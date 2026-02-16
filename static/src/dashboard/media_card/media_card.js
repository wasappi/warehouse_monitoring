import { Component, useState } from "@odoo/owl";

export class MediaCard extends Component {
    static template = "warehouse_monitoring.media_card";

    setup() {
        this.state = useState({ isPlaying: false });
    }

    onPlay() {
        this.state.isPlaying = true;
    }

    onStop() {
        this.state.isPlaying = false;
    }
} 
