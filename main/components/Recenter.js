import { El } from "../main.js";
import { CTL_HIDDEN, CTL_SHOWN, CONTROLS } from "../systems/Controls.js";

AFRAME.registerComponent('recenter', {
    schema: {},

    init: function () {
        var el = this.el
        this.camera = document.getElementById('camera')
        this.recenterCamera = false
        this.controlsVisible = true

        el.sceneEl.addEventListener('enter-vr', () => {
            this.recenterCamera = true
        })

        el.sceneEl.addEventListener('exit-vr', () => {
            this.recenterCamera = false
        })

        El.events.addEventListener(CONTROLS, (e) => {
            if (e.detail === CTL_HIDDEN)
                this.controlsVisible = false
            else if (e.detail === CTL_SHOWN)
                this.controlsVisible = true
        })

        el.addEventListener("click", (e) => {
            if (e.detail.intersectedEl !== el) return;
            if (!this.controlsVisible) {
                el.sceneEl.systems.controls.showControls()
                return
            }
            if (this.recenterCamera) {
                el.setAttribute("rotation", { y: -(this.camera.getAttribute("rotation").y) });
            }
        })
    },
});