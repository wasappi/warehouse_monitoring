from odoo import models, fields
from odoo.exceptions import ValidationError, UserError


class WarehouseMonitoringStation(models.Model):
    _name = "warehouse_monitoring.station"
    _description = "Warehouse Monitoring Station"

    name = fields.Char(string="Station Name")
    location_id = fields.Many2one("warehouse_monitoring.location")
    measure_ids = fields.One2many("warehouse_monitoring.measure", "station_id")
