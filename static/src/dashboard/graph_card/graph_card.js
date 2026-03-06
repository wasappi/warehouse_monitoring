import { Component, onWillStart, useRef, onMounted, useEffect } from "@odoo/owl";
import { loadJS } from "@web/core/assets";

export class GraphCard extends Component {
    static template = "warehouse_monitoring.graph_card";
    static props = {
        data: { type: Object }, // Expecting: { labels: [], temp: [], humid: [], press: [], co2: [] }
        label: { type: String, optional: true },
        visibleSeries: { type: Array, optional: true },
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
    }
    renderChart() {
        if (this.chart) {
            this.chart.destroy();
        }

        const { labels = [], temp = [], humid = [], press = [], co2 = [] } = this.props.data || {};

        if (!this.canvasRef.el || labels.length === 0) {
            return;
        }

        const requestedSeries = new Set(this.props.visibleSeries || []);
        const showAllSeries = requestedSeries.size === 0;

        const allDatasets = [
            {
                series: 'temp',
                type: 'line',
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
                series: 'humid',
                type: 'bar',
                label: 'Humidity (%)',
                data: humid,
                backgroundColor: 'rgba(54, 162, 235, 0.4)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                yAxisID: 'y-humid',
                spanGaps: true,
            },
            {
                series: 'press',
                type: 'line',
                label: 'Pressure (hPa)',
                data: press,
                borderColor: '#4caf50',
                backgroundColor: 'transparent',
                yAxisID: 'y-press',
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 2,
                spanGaps: true,
            },
            {
                series: 'co2',
                type: 'line',
                label: 'CO2 (ppm)',
                data: co2,
                borderColor: '#ff9800',
                backgroundColor: 'transparent',
                borderDash: [5, 3],
                yAxisID: 'y-co2',
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 2,
                spanGaps: true,
            },
        ];

        const datasets = allDatasets
            .filter((dataset) => showAllSeries || requestedSeries.has(dataset.series))
            .map(({ series, ...dataset }) => dataset);

        if (datasets.length === 0 || datasets.every((dataset) => !(dataset.data || []).some((value) => value !== null && value !== undefined))) {
            return;
        }

        const scales = {
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
                offset: true,
                min: 0,
                max: 100
            },
            'y-press': {
                type: 'linear',
                position: 'right',
                title: { display: true, text: 'Pressure (hPa)' },
                grid: { drawOnChartArea: false },
                offset: true,
                suggestedMin: 950,
                suggestedMax: 1050
            },
            'y-co2': {
                type: 'linear',
                position: 'right',
                title: { display: true, text: 'CO2 (ppm)' },
                grid: { drawOnChartArea: false },
                offset: true,
                suggestedMin: 400,
                suggestedMax: 2000
            }
        };

        const activeAxisIds = new Set(datasets.map((dataset) => dataset.yAxisID));
        for (const axisId of Object.keys(scales)) {
            if (!activeAxisIds.has(axisId)) {
                delete scales[axisId];
            }
        }

        const axisIds = Object.keys(scales);
        if (axisIds.length === 1) {
            const onlyAxis = scales[axisIds[0]];
            onlyAxis.position = 'left';
            delete onlyAxis.grid;
            delete onlyAxis.offset;
        }

        const config = {
            type: 'bar',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top' },
                    title: {
                        display: !!this.props.label,
                        text: this.props.label,
                    },
                },
                scales: scales
            }
        };

        this.chart = new Chart(this.canvasRef.el, config);
    }
}