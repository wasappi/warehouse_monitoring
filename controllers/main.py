from odoo import http
from odoo.http import request

class WarehouseMonitoringController(http.Controller):
    @http.route('/stats', type='jsonrpc', auth='user')
    def get_stats(self):
        # Fetch last 25 records across all categories
        all_rec = request.env['warehouse_monitoring.measure'].search(
            [], order="measurement_date desc", limit=25
        ).sorted('measurement_date')

        labels = all_rec.mapped(lambda m: m.measurement_date.strftime("%H:%M"))

        temp_data = all_rec.mapped(lambda m: m.value if m.measure_category_id.category == 'temp' else None)
        humid_data = all_rec.mapped(lambda m: m.value if m.measure_category_id.category == 'hum' else None)

        # Get latest individual temp for the ValueCard
        latest_temp_rec = request.env['warehouse_monitoring.measure'].search([
            ('measure_category_id.category', '=', 'temp')
        ], limit=1, order='measurement_date desc')

        return {
            "latest_temp": {
                "value": latest_temp_rec.value if latest_temp_rec else 0,
                "unit": latest_temp_rec.measure_unit_id.symbol if latest_temp_rec else ""
            },
            "chart_data": {
                "labels": labels,
                "temp": temp_data,
                "humid": humid_data,
            }
        }