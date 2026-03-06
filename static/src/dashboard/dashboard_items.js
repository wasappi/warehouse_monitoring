import { registry } from "@web/core/registry";
import { ValueCard } from "./value_card/value_card";
import { MediaCard } from "./media_card/media_card";
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
        unit: stats.latest_temp ? stats.latest_temp.unit : "",
        date: stats.latest_temp ? stats.latest_temp.date : null,
        icon: "fa fa-thermometer-half",
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
        unit: stats.latest_hum ? stats.latest_hum.unit : "",
        date: stats.latest_hum ? stats.latest_hum.date : null,
        icon: "fa fa-tint",
    }),
});

dashboardRegistry.add("latest_press", {
    id: "latest_press",
    description: "Latest pressure value",
    Component: ValueCard,
    size: 1,
    props: (stats) => ({
        title: "Current pressure",
        value: stats.latest_press ? stats.latest_press.value : "—",
        unit: stats.latest_press ? stats.latest_press.unit : "",
        date: stats.latest_press ? stats.latest_press.date : null,
        icon: "fa fa-tachometer",
    }),
});

dashboardRegistry.add("latest_co2", {
    id: "latest_co2",
    description: "Latest CO2 value",
    Component: ValueCard,
    size: 1,
    props: (stats) => ({
        title: "Current CO2",
        value: stats.latest_co2 ? stats.latest_co2.value : "—",
        unit: stats.latest_co2 ? stats.latest_co2.unit : "",
        date: stats.latest_co2 ? stats.latest_co2.date : null,
        icon: "fa fa-industry",
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
            icon: "fa fa-arrows-v",
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
            icon: "fa fa-cloud",
            className: safetyMargin?.is_danger ? "text-danger fw-bold" : "",
        };
    },
});


dashboardRegistry.add("live_stream", {
    id: "live_stream",
    description: "Live video stream feed",
    Component: MediaCard,
    size: 12,
    props: (stats) => ({
        title: "Live Camera Feed",
        url: stats?.camera_url || "",
        height: "388px",
    }),
});

// Graph cards - split by data type
dashboardRegistry.add("temp_humid_trend", {
    id: "temp_humid_trend",
    description: "Temperature & Humidity Trend",
    Component: GraphCard,
    size: 12,
    height: "400px",
    props: (stats) => ({
        label: "Temperature & Humidity",
        data: stats.chart_data || {},
        visibleSeries: ["temp", "humid"],
    }),
});

dashboardRegistry.add("co2_trend", {
    id: "co2_trend",
    description: "CO2 Level Trend",
    Component: GraphCard,
    size: 12,
    height: "400px",
    props: (stats) => ({
        label: "CO2 Levels",
        data: stats.chart_data || {},
        visibleSeries: ["co2"],
    }),
});

dashboardRegistry.add("pressure_trend", {
    id: "pressure_trend",
    description: "Pressure Trend",
    Component: GraphCard,
    size: 12,
    height: "400px",
    props: (stats) => ({
        label: "Atmospheric Pressure",
        data: stats.chart_data || {},
        visibleSeries: ["press"],
    }),
});
