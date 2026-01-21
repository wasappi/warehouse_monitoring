from odoo import models, fields
from odoo.exceptions import ValidationError, UserError


class WeatherStation(models.Model):
    _name = "weather_station.station"
    _description = "Weather Station"

    name = fields.Char(string="Weather Station Name")
    location_id = fields.Many2one("weather_station.location")
    measure_ids = fields.One2many("weather_station.measure", "station_id")
