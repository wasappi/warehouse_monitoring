import { registry } from "@web/core/registry";
import { ValueCard } from "./value_card/value_card";
import { GraphCard } from "./graph_card/graph_card";

// Create the category (if it doesn't exist)
const dashboardRegistry = registry.category("warehouse_monitoring");

// Add items to the registry instead of exporting a list
dashboardRegistry.add("latest_temp", {
    id: "latest_temp",
    description: "Latest Temp",
    Component: ValueCard,
    size: 1,
    props: (stats) => ({
        title: "Latest temperature",
        value: stats.latest_temp.value
    }),
});

dashboardRegistry.add("temp_humid_trend", {
    id: "temp_humid_trend",
    description: "Temp vs Humidity Trend",
    Component: GraphCard,
    size: 12,
    height: "450px",
    props: (stats) => ({
        label: "Warehouse Environment",
        data: stats.chart_data, // Passes the mapped data from the controller
    }),
});