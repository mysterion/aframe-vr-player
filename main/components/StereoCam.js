import { El } from "../elems.js";
import { EV } from "./Events.js";
import { ST } from "./settings/Settings.js";

AFRAME.registerComponent('stereocam', {

    schema: {
        eye: { type: 'string', default: "left" }
    },

    init: function () {
        this.onEyeChange = AFRAME.utils.bind(this.onEyeChange, this)

        this.eye_changed = true;

        El.events.addEventListener(EV.SETTINGS, this.onEyeChange)


    },

    onEyeChange: function (e) {
        let eye = e.detail[ST.DEF_EYE]
        this.el.setAttribute('stereocam', `eye: ${eye}`)
        this.eye_changed = true
    },

    update: function (od) {
        this.eye_changed = true
    },

    tick: function (time) {
        if (this.eye_changed) {
            console.log('stereocam: ', this.data.eye)
            var rootCam
            this.el.object3D.children.forEach(function (item) {
                if (item.type == "PerspectiveCamera") {
                    rootCam = item
                }
            });
            if (rootCam) {
                if (this.data.eye === 'left') {
                    rootCam.layers.enable(1)
                    rootCam.layers.disable(2)
                } else if (this.data.eye === 'right') {
                    rootCam.layers.enable(2)
                    rootCam.layers.disable(1)
                } else {
                    rootCam.layers.enable(1);
                    rootCam.layers.enable(2);
                }
            } else {
                console.error("stereocam: Camera not found")
            }
            this.eye_changed = false
        }
    },

    remove: function (e) {
        El.events.removeEventListener(EV.SETTINGS, this.onEyeChange)
    }
});