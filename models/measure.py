from odoo import models, fields
from odoo.exceptions import ValidationError, UserError


class Measure(models.Model):
    _name = "warehouse_monitoring.measure"
    _description = "An environmental measure"

    _rec_name = "station_id"
    station_id = fields.Many2one('warehouse_monitoring.station', ondelete='cascade', required=True)
    measure_category_id = fields.Many2one("warehouse_monitoring.measure_category", required=True)
    measure_unit_id = fields.Many2one("warehouse_monitoring.measure_unit", required=True)
    value = fields.Float(string="Value", required=True)
    measurement_date = fields.Datetime(string="Measurement Date", default=fields.Datetime.now)