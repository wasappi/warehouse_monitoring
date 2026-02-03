from odoo import models, fields
from odoo.exceptions import ValidationError, UserError

class Location(models.Model):
    _name = "warehouse_monitoring.location"
    _description = "Warehouse Location"

    name = fields.Char(string="Location name")
    weather_station_id = fields.One2many("warehouse_monitoring.station", "location_id")