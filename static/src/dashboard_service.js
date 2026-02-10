import { reactive } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { rpc as jsonrpc } from "@web/core/network/rpc";

const statisticsService = {
    dependencies: [],
    start(env) {
        // Default hardcoded values for station id and time range
        // TODO refactor
        const stats = reactive({
            data: {},
            isLoaded: false,
            filters: {
                station_id: 1,
                days: 3,
            },
            reload: async () => {},
        });

        async function loadStatistics(overrides = {}) {
            try {
                stats.filters = { ...stats.filters, ...overrides };
                const result = await jsonrpc("/stats", stats.filters);
                stats.data = result
                stats.isLoaded = true;
                console.log("Statistics service updated data.");
            } catch (error) {
                console.error("Failed to fetch statistics", error);
            }
        }

        stats.reload = loadStatistics;

        // 3. Initial load and every hour periodic refresh
        loadStatistics();
        setInterval(loadStatistics, 3600000);

        // 4. Return the reactive object
        return stats;
    },
};

// Add to the services registry
registry.category("services").add("warehouse_monitoring.statistics", statisticsService);