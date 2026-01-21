from odoo import models, fields
from odoo.exceptions import ValidationError, UserError

class Location(models.Model):
    _name = "weather_station.location"
    _description = "Weather Station Location"

    name = fields.Char(string="Location name")
    weather_station_id = fields.One2many("weather_station.station", "location_id")