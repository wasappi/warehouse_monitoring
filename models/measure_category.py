from odoo import models, fields
from odoo.exceptions import ValidationError, UserError

class MeasureCategory(models.Model):
    _name = "warehouse_monitoring.measure_category"
    _description = "The category of a measure"

    name = fields.Char(required=True)
    category = fields.Selection([
        ('temp', 'Temperature'),
        ('hum', 'Humidity'),
        ('other', 'Other')
    ], required=True)