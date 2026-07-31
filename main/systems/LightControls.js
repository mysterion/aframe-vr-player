import { setAttr } from "../utils.js";

AFRAME.registerSystem('light-controls', {
    init: function () {
        this.off = AFRAME.utils.bind(this.off, this);
        this.on = AFRAME.utils.bind(this.on, this);
        this.originalIntensities = new Map();
    },

    off: function () {
        const lights = this.el.querySelectorAll('[light]');
        lights.forEach((el) => {
            const c = el.components.light;
            if (!c) return;

            const cint = c.data.intensity;

            if (!this.originalIntensities.has(el)) {
                this.originalIntensities.set(el, cint);
            }

            setAttr(el, { 'light': 'intensity: 0' });
        });
    },

    on: function () {
        if (this.originalIntensities.size === 0) return;

        this.originalIntensities.forEach((oi, el) => {
            if (el.parentNode) {
                setAttr(el, { 'light': `intensity: ${oi}` });
            }
        });

        this.originalIntensities.clear();
    }
});
