import { Component } from "@odoo/owl";

export class LightControlCard extends Component {
    static template = "warehouse_monitoring.light_control_card";
    static props = {
        label: { type: String, optional: true },
        isOn: { type: Boolean, optional: true },
        isBusy: { type: Boolean, optional: true },
        disabled: { type: Boolean, optional: true },
        onToggle: { type: Function, optional: true },
    };
    static defaultProps = {
        label: "Warehouse Light",
        isOn: false,
        isBusy: false,
        disabled: false,
    };
}