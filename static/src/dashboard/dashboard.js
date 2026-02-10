import { Component, onWillStart, useState } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { Layout } from "@web/search/layout";
import { Dropdown } from "@web/core/dropdown/dropdown";
import { DropdownItem } from "@web/core/dropdown/dropdown_item";
import { useService } from "@web/core/utils/hooks";
import { Card } from "./card/card";


export class WarehouseMonitoringDashboard extends Component {
    static template = "warehouse_monitoring.dashboard"
    static components = { Layout, Card, Dropdown, DropdownItem };

    setup() {
        this.statistics = useState(useService("warehouse_monitoring.statistics"))
        this.orm = useService("orm");
        console.log(this.statistics)
        const itemsRegistry = registry.category("warehouse_monitoring");
        this.items = itemsRegistry.getAll();

        this.stations = useState({ data: [] });
        this.currentStation = useState({ id: 1, name: "Warehouse Station" });
        this.currentPeriod = useState({ label: "Last 3 days", days: 3 });
        this.periods = [
            { label: "Last 24h", days: 1 },
            { label: "Last 72h", days: 3 },
            { label: "Last 7 days", days: 7 },
        ];

        this.selectStation = this.selectStation.bind(this);
        this.selectPeriod = this.selectPeriod.bind(this);

        onWillStart(async () => {
            this.stations.data = await this.orm.searchRead(
                "warehouse_monitoring.station",
                [],
                ["name"]
            );
        });
    }

    openConfiguration() {
        console.log("Open configuration")
    }

    selectStation(station) {
        this.currentStation.id = station.id;
        this.currentStation.name = station.name;
        this.statistics.reload({
            station_id: station.id,
            days: this.currentPeriod.days,
        });
    }

    selectPeriod(period) {
        this.currentPeriod.label = period.label;
        this.currentPeriod.days = period.days;
        this.statistics.reload({
            station_id: this.currentStation.id,
            days: period.days,
        });
    }

    // TODO check OWL Odoo tuto for customized dashboard cards
    get displayedItems() {
        return this.items;
        //return this.items.filter(item => !this.state.disabledItems.includes(item.id));
    }
}

registry.category("lazy_components").add("WarehouseMonitoringDashboard", WarehouseMonitoringDashboard);
