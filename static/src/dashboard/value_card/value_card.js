import { Component } from "@odoo/owl";

export class ValueCard extends Component {
    static template = "warehouse_monitoring.value_card";
    static props = {
        title: { type: String, optional: true },
        value: { type: [String, Number], optional: true },
        unit: { type: String, optional: true },
        date: { type: String, optional: true },
        icon: { type: String, optional: true },
        className: { type: String, optional: true },
    };
} 
