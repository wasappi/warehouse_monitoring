import requests
import logging
from odoo import models, fields, api
from odoo.exceptions import ValidationError

_logger = logging.getLogger(__name__)

class WarehouseMonitoringStation(models.Model):
    _name = "warehouse_monitoring.station"
    _description = "Warehouse Monitoring Station"

    name = fields.Char(string="Station Name")
    location_id = fields.Many2one("warehouse_monitoring.location")
    measure_ids = fields.One2many("warehouse_monitoring.measure", "station_id")

    ip_address = fields.Char(string="ESP32 IP Address", help="Tailscale/Local IP")
    last_sync = fields.Datetime(string="Last Successful Sync", readonly=True)
    
    # Store current values on the station for quick dashboard access
    current_temperature = fields.Float(string="Current Temp", readonly=True)
    current_humidity = fields.Float(string="Current Humidity", readonly=True)

    def scheduled_fetch_all(self):
        """Called by the Cron (Scheduled Action)"""
   
        stations = self.search([('ip_address', '!=', False)])
        for station in stations:
            station._fetch_from_esp32()

    def _fetch_from_esp32(self):
            self.ensure_one()
            try:
                url = f"http://{self.ip_address}/metrics"
                r = requests.get(url, timeout=5)
                r.raise_for_status()
                data = r.json()

                metrics = [
                    {'key': 'temperature', 'cat_code': 'temp', 'unit_sym': '°C'},
                    {'key': 'humidity', 'cat_code': 'hum', 'unit_sym': '%'}
                ]

                for metric in metrics:
                    val = data.get(metric['key'])
                    if val is None:
                        continue

                    category = self.env['warehouse_monitoring.measure_category'].search([
                        ('category', '=', metric['cat_code'])
                    ], limit=1)

                    unit = self.env['warehouse_monitoring.measure_unit'].search([
                        ('symbol', '=', metric['unit_sym'])
                    ], limit=1)

                    if category and unit:
                        self.env['warehouse_monitoring.measure'].create({
                            'station_id': self.id,
                            'measure_category_id': category.id,
                            'measure_unit_id': unit.id,
                            'value': float(val),
                            'measurement_date': fields.Datetime.now(),
                        })

                # Update the station summary fields
                self.write({
                    'current_temperature': data.get('temperature'),
                    'current_humidity': data.get('humidity'),
                    'last_sync': fields.Datetime.now(),
                })

            except Exception as e:
                _logger.error("IoT Sync Failed for station %s: %s", self.name, e)