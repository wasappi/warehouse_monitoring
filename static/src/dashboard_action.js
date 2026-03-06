import { Component, xml } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { LazyComponent } from "@web/core/assets";

class WarehouseMonitoringDashboardLoader extends Component {
    static props = {
        action: { type: Object, optional: true },
        actionId: { type: Number, optional: true },
        updateActionState: { type: Function, optional: true },
        className: { type: String, optional: true },
    };
    static components = { LazyComponent };
    static template = xml`
        <LazyComponent 
            bundle="'warehouse_monitoring.dashboard'" 
            Component="'WarehouseMonitoringDashboard'" 
        />
    `;
}

// Register the LOADER as the action
registry.category("actions").add("warehouse_monitoring.dashboard", WarehouseMonitoringDashboardLoader);