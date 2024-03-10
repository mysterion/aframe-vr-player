import { ControlsHidden, ControlsShown } from "../systems/Controls";

AFRAME.registerComponent('recenter', {
    schema: {},

    init: function () {
        var el = this.el
        const rightEye = document.getElementById('rightEye')
        this.camera = document.getElementById('camera')
        this.recenterCamera = false
        this.controlsVisible = true

        el.sceneEl.addEventListener('enter-vr', () => {
            this.recenterCamera = true
        })

        el.sceneEl.addEventListener('exit-vr', () => {
            this.recenterCamera = false
        })

        el.sceneEl.addEventListener(ControlsHidden, () => {
            this.controlsVisible = false
        })

        el.sceneEl.addEventListener(ControlsShown, () => {
            this.controlsVisible = true
        })

        el.addEventListener("click", (e) => {
            if (e.detail.intersectedEl !== el) return;
            if (!this.controlsVisible) {
                el.sceneEl.systems.controls.showControls()
                rightEye.setAttribute('visible', false)
                return
            }
            if (this.recenterCamera) {
                el.setAttribute("rotation", { y: -(this.camera.getAttribute("rotation").y) });
            }
        })
    },
});