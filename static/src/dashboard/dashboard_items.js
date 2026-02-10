import { registry } from "@web/core/registry";
import { ValueCard } from "./value_card/value_card";
import { GraphCard } from "./graph_card/graph_card";

const dashboardRegistry = registry.category("warehouse_monitoring");

// Check Odoo owl tuto

dashboardRegistry.add("latest_temp", {
    id: "latest_temp",
    description: "Latest temperature value",
    Component: ValueCard,
    size: 1,
    props: (stats) => ({
        title: "Current temperature",
        value: stats.latest_temp ? stats.latest_temp.value : "—",
        unit: stats.latest_temp ? stats.latest_temp.unit : ""
    }),
});

dashboardRegistry.add("latest_hum", {
    id: "latest_hum",
    description: "Latest humidity value",
    Component: ValueCard,
    size: 1,
    props: (stats) => ({
        title: "Current humidity",
        value: stats.latest_hum ? stats.latest_hum.value : "—",
        unit: stats.latest_hum ? stats.latest_hum.unit : ""
    }),
});

dashboardRegistry.add("temp_delta", {
    id: "temp_delta",
    description: "Temperature variation over the period",
    Component: ValueCard,
    size: 1,
    props: (stats) => {
        const tempDelta = stats?.temp_delta;
        const tempDeltaValue = tempDelta?.value;
        return {
            title: "Temperature Variation",
            value: tempDeltaValue ?? "—",
            unit: tempDelta?.unit ?? "",
            className: typeof tempDeltaValue === "number" && tempDeltaValue > 5 ? "text-warning fw-bold" : "",
        };
    },
});

dashboardRegistry.add("safety_margin", {
    id: "safety_margin",
    description: "Condensation Risk",
    Component: ValueCard,
    size: 1,
    props: (stats) => {
        const safetyMargin = stats?.safety_margin;
        return {
            title: "Current Condensation Margin",
            value: safetyMargin?.value ?? "—",
            unit: safetyMargin?.unit ?? "",
            className: safetyMargin?.is_danger ? "text-danger fw-bold" : "",
        };
    },
});


// Graphcard
dashboardRegistry.add("temp_humid_trend", {
    id: "temp_humid_trend",
    description: "Temp vs Humidity Trend",
    Component: GraphCard,
    size: 12,
    height: "450px",
    props: (stats) => ({
        label: "Warehouse Environment",
        data: stats.chart_data, 
    }),
});