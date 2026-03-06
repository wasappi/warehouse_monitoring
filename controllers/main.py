import logging
import requests
from odoo import http, fields
from odoo.http import request
from datetime import timedelta

_logger = logging.getLogger(__name__)

class WarehouseMonitoringController(http.Controller):
    @http.route('/stats', type='jsonrpc', auth='user')
    def get_stats(self, station_id=None, start_date=None, end_date=None, days=None):
        base_domain = []
        if station_id:
            base_domain.append(('station_id', '=', int(station_id)))

        station = request.env['warehouse_monitoring.station'].browse(int(station_id)) if station_id else None
        camera_url = station.camera_url if station and station.exists() else None

        now_utc = fields.Datetime.now()

        # Handle Date Filtering
        if days:
            start_dt = now_utc - timedelta(days=int(days))
            base_domain.append(('measurement_date', '>=', fields.Datetime.to_string(start_dt)))
        elif start_date or end_date:
            if start_date:
                base_domain.append(('measurement_date', '>=', start_date))
            if end_date:
                base_domain.append(('measurement_date', '<=', end_date))
        else:
            # Default to last 7 days
            start_dt = now_utc - timedelta(days=7)
            base_domain.append(('measurement_date', '>=', fields.Datetime.to_string(start_dt)))

        # Fetch all (2000) records
        all_rec = request.env['warehouse_monitoring.measure'].search(
            base_domain, order="measurement_date asc", limit=2000
        )

        # Split into temp and humidity lists for calculations
        temp_recs = all_rec.filtered(lambda r: r.measure_category_id.category == 'temp')
        hum_recs = all_rec.filtered(lambda r: r.measure_category_id.category == 'hum')
        press_recs = all_rec.filtered(lambda r: r.measure_category_id.category == 'press')
        co2_recs = all_rec.filtered(lambda r: r.measure_category_id.category in ('co2', 'gas'))

        latest_temp = temp_recs[-1] if temp_recs else None
        latest_hum = hum_recs[-1] if hum_recs else None
        latest_press = press_recs[-1] if press_recs else None
        latest_co2 = co2_recs[-1] if co2_recs else None

        def format_since(measure_dt):
            if not measure_dt:
                return None
            now_user = fields.Datetime.context_timestamp(request.env.user, now_utc)
            measure_user = fields.Datetime.context_timestamp(request.env.user, measure_dt)
            delta_seconds = int((now_user - measure_user).total_seconds())
            if delta_seconds <= 60:
                return "just now"
            minutes = delta_seconds // 60
            if minutes < 60:
                return f"{minutes} minute{'s' if minutes != 1 else ''} ago"
            hours = minutes // 60
            if hours < 24:
                return f"{hours} hour{'s' if hours != 1 else ''} ago"
            days = hours // 24
            return f"{days} day{'s' if days != 1 else ''} ago"
        
        # Temperature Delta
        temp_values = temp_recs.mapped('value')
        temp_delta = max(temp_values) - min(temp_values) if temp_values else 0

        # Dew Point Gap
        safety_margin = 0
        if latest_temp and latest_hum:
            # Simple approximation just for proff of concept
            dew_point = latest_temp.value - ((100 - latest_hum.value) / 5.0)
            safety_margin = latest_temp.value - dew_point

        return {
            "camera_url": camera_url,
            "latest_temp": {
                "value": latest_temp.value if latest_temp else 0,
                "unit": latest_temp.measure_unit_id.symbol if latest_temp else "°C",
                "date": format_since(latest_temp.measurement_date) if latest_temp else None,
            },
            "latest_hum": {
                "value": latest_hum.value if latest_hum else 0,
                "unit": latest_hum.measure_unit_id.symbol if latest_hum else "%",
                "date": format_since(latest_hum.measurement_date) if latest_hum else None,
            },
            "latest_press": {
                "value": latest_press.value if latest_press else 0,
                "unit": latest_press.measure_unit_id.symbol if latest_press else "hPa",
                "date": format_since(latest_press.measurement_date) if latest_press else None,
            },
            "latest_co2": {
                "value": latest_co2.value if latest_co2 else 0,
                "unit": latest_co2.measure_unit_id.symbol if latest_co2 else "ppm",
                "date": format_since(latest_co2.measurement_date) if latest_co2 else None,
            },
            "temp_delta": {
                "value": round(temp_delta, 1),
                "unit": "Δ°C"
            },
            "safety_margin": {
                "value": round(safety_margin, 1),
                "unit": "°C",
                "is_danger": safety_margin < 3
            },
            "chart_data": {
                "labels": all_rec.mapped(lambda m: m.measurement_date.strftime("%m/%d %H:%M") if m.measurement_date else ""),
                "temp": [m.value if m.measure_category_id.category == 'temp' else None for m in all_rec],
                "humid": [m.value if m.measure_category_id.category == 'hum' else None for m in all_rec],
                "press": [m.value if m.measure_category_id.category == 'press' else None for m in all_rec],
                "co2": [m.value if m.measure_category_id.category in ('co2', 'gas') else None for m in all_rec],
            }
        }

    @http.route('/trigger_light', type='jsonrpc', auth='user')
    def trigger_light(self, station_id=None, on=0):
        if not station_id:
            return {"ok": False, "error": "missing_station"}

        station = request.env['warehouse_monitoring.station'].browse(int(station_id))
        if not station.exists():
            return {"ok": False, "error": "unknown_station"}

        if not station.ip_address:
            return {"ok": False, "error": "missing_station_ip"}

        try:
            url = f"http://{station.ip_address}/light"
            params = {"on": 1 if int(on) else 0}
            response = requests.get(url, params=params, timeout=5)
            response.raise_for_status()
            return {"ok": True}
        except Exception as exc:
            _logger.error("Light trigger failed for station %s: %s", station.name, exc)
            return {"ok": False, "error": str(exc)}