from odoo import models, fields
from odoo.exceptions import ValidationError, UserError

class MeasureUnit(models.Model):
    _name = "weather_station.measure_unit"
    _descriptino = "The unit of a measure"

    name = fields.Char(name="Unit name", required=True)
    symbol = fields.Char(name="Unit symbol", required=True, help="e.g °C")
