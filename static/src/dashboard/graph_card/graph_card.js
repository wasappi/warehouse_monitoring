import { Component, onWillStart, useRef, onMounted, useEffect } from "@odoo/owl";
import { loadJS } from "@web/core/assets";

export class GraphCard extends Component {
    static template = "warehouse_monitoring.graph_card";
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