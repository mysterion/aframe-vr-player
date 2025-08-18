import { El } from "../main.js";
import { CTL_HIDDEN, CTL_SHOWN, CONTROLS } from "../systems/Controls.js";
import { EV } from "./Events.js";

// | feature                      | camera  | screen  | controls |
// | :--------------------------- | :------ | :------ | :------- | 
// | recenter controls (360)      | rotates | rotates | static   |
// | recenter screen and controls | rotates | static  | static   |

AFRAME.registerComponent('recenter', {
    schema: {},

    init: function () {
        var el = this.el
        this.camera = document.getElementById('camera')
        this.env = document.getElementById('env')
        this.recenterCamera = false
        this.recenterEnv = false
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

        El.events.addEventListener(EV.ENVIRONMENT, (e) => {
            if (String(e.detail.preset).includes("360")) {
                this.recenterEnv = true
            } else {
                this.recenterEnv = false
            }
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
            if (this.recenterCamera && this.recenterEnv) {
                El.env.setAttribute("rotation", { y: -(this.camera.getAttribute("rotation").y) });
            }
        })
        
        El.events.addEventListener(EV.ENVIRONMENT, (e) => {
            if (String(e.detail.preset).includes("360")) {
                this.recenterEnv = true
                El.env.setAttribute("rotation", { y: -(this.camera.getAttribute("rotation").y) });
            } else {
                this.recenterEnv = false
                El.env.setAttribute("rotation", "0 0 0");
            }
        })

    },
});