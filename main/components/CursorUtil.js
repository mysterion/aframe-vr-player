import { El } from "../main.js";
import { createEl } from "../utils.js";
import { EV } from "./Events.js";
import { getSettings, ST } from "./settings/Settings.js";


export const CUR_TYPE = {
    'TAP': 'tap',
    'GAZE': 'gaze',
    'LASER': 'laser',
}

const attrs = {
    'animation__click': 'property: scale; startEvents: click; easing: easeInCubic; dur: 150; from: 0.1 0.1 0.1; to: 1 1 1',
    'animation__fusing': 'property: scale; startEvents: fusing; easing: easeInCubic; dur: 1500; from: 1 1 1; to: 0.1 0.1 0.1',
    'animation__mouseleave': 'property: scale; startEvents: mouseleave; easing: easeInCubic; dur: 500; to: 1 1 1',
    'raycaster': 'objects: [clickable]',
    'geometry': "primitive: ring; radiusInner: 0.2; radiusOuter: 0.4;",
    'material': "color: black; shader: flat",
    'position': "0 0 -50",
}

AFRAME.registerComponent('cursor-util', {
    schema: {},

    init: function () {
        let el = this.el

        this.cursor = null

        this.checkVR = AFRAME.utils.bind(this.checkVR, this)
        this.onSettingsChange = AFRAME.utils.bind(this.onSettingsChange, this)
        this.clearCursor = AFRAME.utils.bind(this.clearCursor, this)

        el.sceneEl.addEventListener('enter-vr', this.checkVR)
        el.sceneEl.addEventListener('exit-vr', this.checkVR)
        El.events.addEventListener(EV.SETTINGS, this.onSettingsChange)

        this.onSettingsChange()
        this.checkVR()
    },

    onSettingsChange: function (e) {
        if (!e) {
            e = { detail: { [ST.CUR_TYPE]: getSettings(ST.CUR_TYPE) } }
        }

        let el = this.el

        let newCursor = e.detail[ST.CUR_TYPE]

        if (newCursor === this.cursor) {
            return
        }

        this.clearCursor()

        switch (newCursor) {
            case CUR_TYPE.TAP:
                createEl('a-entity', {
                    ...attrs,
                    cursor: "fuse: false;",
                }, [
                    createEl('a-entity', {
                        geometry: "primitive: circle; radius: 0.2;",
                        material: "color: aquamarine; shader: flat;"
                    })
                ], el)
                break
            case CUR_TYPE.GAZE:
                createEl('a-entity', {
                    ...attrs,
                    cursor: "fuse: true;",
                }, [
                    createEl('a-entity', {
                        geometry: "primitive: circle; radius: 0.2;",
                        material: "color: aquamarine; shader: flat;"
                    })
                ], el)
                break
            case CUR_TYPE.LASER:
                createEl('a-entity', {
                    'laser-controls': 'hand: right',
                }, [], el)
                break
        }

        this.cursor = newCursor

    },

    clearCursor: function () {
        this.el.replaceChildren()
    },

    checkVR: function () {
        if (!AFRAME.utils.device.checkVRSupport()) {
            this.el.children[0].setAttribute('cursor', 'rayOrigin: mouse')
        }
    }
});