from odoo import models, fields
from odoo.exceptions import ValidationError, UserError


class Measure(models.Model):
    _name = "weather_station.measure"
    _description = "A weather measure"

    name = fields.Char(string="Name", required=True)
    station_id = fields.Many2one('weather_station.station', ondelete='cascade', required=True)
    measure_category_id = fields.Many2one("weather_station.measure_category", required=True)
    measure_unit_id = fields.Many2one("weather_station.measure_unit", required=True)
    value = fields.Float(string="Value")
    measurement_date = fields.Datetime(string="Measurement Date", default=fields.Datetime.now)