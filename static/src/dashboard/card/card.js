import { Component } from "@odoo/owl";

export class Card extends Component {
    static template = "warehouse_monitoring.card";
    static props = {
        size: { type: Number, optional: true },
        height: { type: String, optional: true }, 
        slots: {
            type: Object,
            shape: {
                default: { optional: true },
            },
        },
    };

    static defaultProps = {
        size: 1,
        height: "auto",
    };

    //TODO Refactor to have a grid layout system
    get itemStyle() {
        const width = this.props.size >= 12 ? "100%" : `${18 * this.props.size}rem`;
        return `width: ${width}; height: ${this.props.height};`;
    }
}