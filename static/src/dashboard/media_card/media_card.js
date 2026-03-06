import { Component, useState } from "@odoo/owl";

export class MediaCard extends Component {
    static template = "warehouse_monitoring.media_card";
    static props = {
        title: { type: String, optional: true },
        url: { type: String, optional: true },
        height: { type: String, optional: true },
    };

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
