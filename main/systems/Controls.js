import { El } from "../elems.js";

export const CTL_HIDDEN = 'controls-hidden'
export const CTL_SHOWN = 'controls-shown'
export const CONTROLS = 'controls'

AFRAME.registerComponent('controls', {
    init: function () {
        this.system.register(this.el)
    },

    remove: function () {
        this.system.unregister(this.el);
    }
});

AFRAME.registerSystem('controls', {
    init: function () {
        this.entities = []
        this.clickables = []
    },

    register: function (el) {
        this.entities.push(el)
    },

    unregister: function (el) {
        var index = this.entities.indexOf(el)
        this.entities.splice(index, 1)
    },

    hideControls: function () {
        for (let i in this.entities) {
            let e = this.entities[i]
            this.clickables.push(e.hasAttribute('clickable'))
            if (this.clickables.at(-1)) {
                e.removeAttribute('clickable')
            }
            e.object3D.visible = false
        }

        El.events.emit(CONTROLS, CTL_HIDDEN, false)
    },

    showControls: function () {
        for (let i in this.entities) {
            let e = this.entities[i]
            if (this.clickables[i]) {
                e.setAttribute('clickable', '')
            }
            e.object3D.visible = true
        }
        this.clickables = []
        El.events.emit(CONTROLS, CTL_SHOWN, false)
    }
});
