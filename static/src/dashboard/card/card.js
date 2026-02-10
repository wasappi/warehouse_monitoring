import { Component } from "@odoo/owl";

export class Card extends Component {
    static template = "warehouse_monitoring.card";
    static props = {
        size: { type: Number, optional: true },
        slots: { type: Object, shape: { default: { optional: true } } },
    };
    static defaultProps = { size: 1 };

    //Bootstrap grid responsive columns
    get columnClass() {
        return this.props.size >= 12 ? "col-12" : "col-12 col-sm-6 col-md-3 col-lg-3";
    }
}