import { Component, onWillStart, useState } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { Layout } from "@web/search/layout";
import { useService } from "@web/core/utils/hooks";
import { Card } from "./card/card";


export class WarehouseMonitoringDashboard extends Component {
    static template = "warehouse_monitoring.dashboard"
    static components = { Layout, Card };

    setup() {
        this.statistics = useState(useService("warehouse_monitoring.statistics"))
        this.orm = useService("orm");
        console.log(this.statistics)
        const itemsRegistry = registry.category("warehouse_monitoring");
        this.items = itemsRegistry.getAll();
    }

    openConfiguration() {
        console.log("Open configuration")
    }

    // TODO check OWL Odoo tuto for customized dashboard cards
    get displayedItems() {
        return this.items;
        //return this.items.filter(item => !this.state.disabledItems.includes(item.id));
    }
}

registry.category("lazy_components").add("WarehouseMonitoringDashboard", WarehouseMonitoringDashboard);
