import { reactive } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { rpc as jsonrpc } from "@web/core/network/rpc";

const statisticsService = {
    dependencies: [], // No dependencies to avoid startup delays
    start(env) {
        // 1. Create the reactive state
        const stats = reactive({
            data: {},
            isLoaded: false
        });

        // 2. Define the reload logic
        async function loadStatistics() {
            try {
                const result = await jsonrpc("/stats");
                stats.data = result
                stats.isLoaded = true;
                console.log("Statistics service updated data.");
            } catch (error) {
                console.error("Failed to fetch statistics", error);
            }
        }

        // 3. Initial load and periodic refresh (10s for testing)
        loadStatistics();
        setInterval(loadStatistics, 600000);

        // 4. Return the reactive object
        return stats;
    },
};

// Add to the services registry
registry.category("services").add("warehouse_monitoring.statistics", statisticsService);