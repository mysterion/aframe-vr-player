export const ControlsHidden = 'controlsHidden'
export const ControlsShown = 'controlsShown'
export const E_Controls = 'E_Controls'

AFRAME.registerComponent('controls', {
    init: function () {
        this.system.register(this.el)
    },

    remove: function () {
        this.system.unregister(this.el);
    }
});

// this.el - a-scene
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

        this.el.emit(E_Controls, ControlsHidden, false)
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
        this.el.emit(E_Controls, ControlsShown, false)
    }
});
