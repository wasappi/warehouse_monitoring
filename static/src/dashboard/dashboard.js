import { Component, onWillStart, useState } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { Layout } from "@web/search/layout";
import { Dropdown } from "@web/core/dropdown/dropdown";
import { DropdownItem } from "@web/core/dropdown/dropdown_item";
import { useService } from "@web/core/utils/hooks";
import { rpc as jsonrpc } from "@web/core/network/rpc";
import { Card } from "./card/card";


export class WarehouseMonitoringDashboard extends Component {
    static template = "warehouse_monitoring.dashboard";
    static props = {
        action: { type: Object, optional: true },
        actionId: { type: Number, optional: true },
    };
    static components = { Layout, Card, Dropdown, DropdownItem };

    setup() {
        this.statistics = useState(useService("warehouse_monitoring.statistics"))
        this.orm = useService("orm");
        console.log(this.statistics)
        const itemsRegistry = registry.category("warehouse_monitoring");
        this.items = itemsRegistry.getAll();

        this.stations = useState({ data: [] });
        this.currentStation = useState({ id: 1, name: "Warehouse Station", ip_address: null });
        this.light = useState({ isOn: false, isBusy: false });
        this.currentPeriod = useState({ label: "Last 24h", days: 1 });
        this.periods = [
            { label: "Last 24h", days: 1 },
            { label: "Last 72h", days: 3 },
            { label: "Last 7 days", days: 7 },
        ];

        this.selectStation = this.selectStation.bind(this);
        this.selectPeriod = this.selectPeriod.bind(this);
        this.onToggleLight = this.onToggleLight.bind(this);

        onWillStart(async () => {
            this.stations.data = await this.orm.searchRead(
                "warehouse_monitoring.station",
                [],
                ["name", "ip_address"]
            );
            if (!this.currentStation.ip_address && this.stations.data.length) {
                const defaultStation = this.stations.data.find((s) => s.ip_address) || this.stations.data[0];
                this.selectStation(defaultStation);
            }
        });
    }

    openConfiguration() {
        console.log("Open configuration")
    }

    selectStation(station) {
        this.currentStation.id = station.id;
        this.currentStation.name = station.name;
        this.currentStation.ip_address = station.ip_address || null;
        this.statistics.reload({
            station_id: station.id,
            days: this.currentPeriod.days,
        });
    }

    async onToggleLight(ev) {
        if (!this.currentStation.id || !this.currentStation.ip_address || this.light.isBusy) {
            ev.preventDefault();
            return;
        }

        const nextState = ev.target.checked;
        this.light.isOn = nextState;
        this.light.isBusy = true;

        try {
            const result = await jsonrpc("/trigger_light", {
                station_id: this.currentStation.id,
                on: nextState ? 1 : 0,
            });
            if (!result?.ok) {
                throw new Error(result?.error || "Light toggle failed");
            }
        } catch (error) {
            console.error("Light toggle failed", error);
            this.light.isOn = !nextState;
        } finally {
            this.light.isBusy = false;
        }
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

    get valueItems() {
        const valueIds = [
            "latest_temp",
            "latest_hum",
            "latest_press",
            "latest_co2",
            "temp_delta",
            "safety_margin",
        ];
        return valueIds
            .map((id) => this.items.find((item) => item.id === id))
            .filter(Boolean);
    }

    get mediaItem() {
        return this.items.find((item) => item.id === "live_stream");
    }

    get lightControlItem() {
        return this.items.find((item) => item.id === "light_control");
    }

    get lightControlProps() {
        const baseProps = this.lightControlItem?.props ? this.lightControlItem.props(this.statistics.data) : {};
        return Object.assign({}, baseProps, {
            isOn: this.light.isOn,
            isBusy: this.light.isBusy,
            disabled: !this.currentStation.ip_address,
            onToggle: this.onToggleLight,
        });
    }

    get graphItems() {
        const graphIds = ["temp_humid_trend", "co2_trend", "pressure_trend"];
        return graphIds
            .map((id) => this.items.find((item) => item.id === id))
            .filter(Boolean);
    }
}

registry.category("lazy_components").add("WarehouseMonitoringDashboard", WarehouseMonitoringDashboard);
