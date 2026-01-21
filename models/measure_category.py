from odoo import models, fields
from odoo.exceptions import ValidationError, UserError

class MeasureCategory(models.Model):
    _name = "weather_station.measure_category"
    _descriptino = "The category of a measure"

    category = fields.Selection([
        ('temp', 'Temperature'),
        ('hum', 'Humidity'),
        ('other', 'Other')
    ], required=True)