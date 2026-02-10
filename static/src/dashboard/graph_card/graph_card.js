import { Component, onWillStart, useRef, onMounted, useEffect, useState } from "@odoo/owl";
import { loadJS } from "@web/core/assets";
import { Dropdown} from "@web/core/dropdown/dropdown"
import { DropdownItem} from "@web/core/dropdown/dropdown_item"
import { useService } from "@web/core/utils/hooks";


export class GraphCard extends Component {
    static template = "warehouse_monitoring.graph_card";
    static components = { Dropdown, DropdownItem };
    static props = {
        data: { type: Object }, // Expecting: { labels: [], temp: [], humid: [] }
        label: { type: String, optional: true },
    };

    setup() {
        this.canvasRef = useRef("canvas");
        this.chart = null;

        onWillStart(() => loadJS("/web/static/lib/Chart/Chart.js"));

        useEffect(
            () => {
                this.renderChart();
            },
            () => [this.props.data]
        );

        onMounted(() => {
            this.renderChart();
        });


        //-----------Should be refactored, ranges options fetch from Server instead 
        this.orm = useService("orm");
        this.statistics = useService("warehouse_monitoring.statistics");
        this.stations = useState({ data: [] });
        this.currentStation = useState({ id: 1, name: "Warehouse Station" });
        this.currentPeriod = useState({ label: "Last 3 days", days: 3 });
        this.periods = [
            { label: "Last 24h", days: 1 },
            { label: "Last 72h", days: 3 },
            { label: "Last 7 days", days: 7 },
        ];
        //-----------
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
    renderChart() {
        if (this.chart) {
            this.chart.destroy();
        }

        const { labels = [], temp = [], humid = [] } = this.props.data || {};

        if (!this.canvasRef.el || labels.length === 0) {
            return;
        }

        const config = {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        type: 'line', // Override for Temperature
                        label: 'Temperature (°C)',
                        data: temp,
                        borderColor: '#ff6384',
                        backgroundColor: 'transparent',
                        yAxisID: 'y-temp',
                        tension: 0.4,
                        borderWidth: 3,
                        pointRadius: 4,
                        spanGaps: true,
                    },
                    {
                        type: 'bar',
                        label: 'Humidity (%)',
                        data: humid,
                        backgroundColor: 'rgba(54, 162, 235, 0.4)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                        yAxisID: 'y-humid',
                        spanGaps: true,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top' }
                },
                scales: {
                    'y-temp': {
                        type: 'linear',
                        position: 'left',
                        title: { display: true, text: 'Temp (°C)' },
                        suggestedMin: 15, 
                        suggestedMax: 35
                    },
                    'y-humid': {
                        type: 'linear',
                        position: 'right',
                        title: { display: true, text: 'Humidity (%)' },
                        grid: { drawOnChartArea: false },
                        min: 0,
                        max: 100
                    }
                }
            }
        };

        this.chart = new Chart(this.canvasRef.el, config);
    }
}