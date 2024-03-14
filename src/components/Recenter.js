import { ControlsHidden, ControlsShown, E_Controls } from "../systems/Controls";

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

        el.sceneEl.addEventListener(E_Controls, (e) => {
            if (e.detail === ControlsHidden)
                this.controlsVisible = false
            else if (e.detail === ControlsShown)
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