import { El } from "../elems.js";
import { Store } from "../store.js";
import { createEl, setAttr } from "../utils.js";
import { EV } from "./Events.js";
import { PRESET } from "./env/constants.js";

export const ViewAngles = [90, 60, 45, 30, 0, -30, -45, -60, -90]

export const uiAngles = [60, 45, 30, 15, 0, -15, -30, -45, -60]

function hideBtn(element) {
    element.removeAttribute('button-highlight')
    element.removeAttribute('clickable')
    element.setAttribute('visible', false)
}

function showBtn(element) {
    element.setAttribute('button-highlight', '')
    element.setAttribute('clickable', '')
    element.setAttribute('visible', true)

}

AFRAME.registerComponent('toggle-adjust-ui', {
    init: function () {

        this.viewAngleIdx = Store.get('viewAngleIdx') ?? 4
        this.uiAngleIdx = Store.get('uiAngleIdx') ?? 4

        this.viewUp = createEl('a-entity', {
            position: '0 4 0',
            geometry: 'primitive: triangle; vertexA: 0 0.5 0; vertexB: -2 -1.5 0; vertexC: 2 -1.5 0;',
            material: 'side: double; color: #808080; opacity: 1;',
            clickable: '',
            'button-highlight': ''
        }, [
            createEl('a-entity', {
                position: '0 0 -0.3',
                geometry: 'primitive: triangle; vertexA: 0 1 0; vertexB: -2.5 -1.5 0; vertexC: 2.5 -1.5 0;',
                material: 'side: double; color: #006cd8; opacity: 1;',
                'button-highlight': ''
            })
        ])
        this.viewDown = createEl('a-entity', {
            position: '0 -4 0',
            geometry: 'primitive: triangle; vertexA: 2 1.5 0; vertexB: 0 -0.5 0; vertexC: -2 1.5 0;',
            material: 'side: double; color: #808080; opacity: 1;',
            clickable: '',
            'button-highlight': ''
        }, [
            createEl('a-entity', {
                position: '0 0 -0.3',
                geometry: 'primitive: triangle; vertexA: 2.5 1.5 0; vertexB: 0 -1 0; vertexC: -2.5 1.5 0;',
                material: 'side: double; color: #006cd8; opacity: 1;',
                'button-highlight': ''
            })
        ])

        this.viewAngle = createEl('a-entity', {
            position: '-34 1.5 -59',
            material: 'color: #808080; opacity: 1',
            rotation: '0 20 0',
            geometry: 'primitive:plane; width:4.5; height: 4.5',
        }, [
            createEl('a-text', {
                align: 'center',
                value: `view\n0`,
                width: '40',
                position: '0 0 0.3'
            }),
            createEl('a-entity', {
                position: '0 0 -0.2',
                material: 'color: #006cd8; opacity: 1',
                geometry: 'primitive:plane; width:5; height: 5',
            }),
            this.viewUp,
            this.viewDown,
        ], this.el)

        this.uiUp = createEl('a-entity', {
            position: '0 4 0',
            geometry: 'primitive: triangle; vertexA: 0 0.5 0; vertexB: -2 -1.5 0; vertexC: 2 -1.5 0;',
            material: 'side: double; color: #808080; opacity: 1;',
            clickable: '',
            'button-highlight': ''
        }, [
            createEl('a-entity', {
                position: '0 0 -0.3',
                geometry: 'primitive: triangle; vertexA: 0 1 0; vertexB: -2.5 -1.5 0; vertexC: 2.5 -1.5 0;',
                material: 'side: double; color: #006cd8; opacity: 1;',
                'button-highlight': ''
            })
        ])
        this.uiDown = createEl('a-entity', {
            position: '0 -4 0',
            geometry: 'primitive: triangle; vertexA: 2 1.5 0; vertexB: 0 -0.5 0; vertexC: -2 1.5 0;',
            material: 'side: double; color: #808080; opacity: 1;',
            clickable: '',
            'button-highlight': ''
        }, [
            createEl('a-entity', {
                position: '0 0 -0.3',
                geometry: 'primitive: triangle; vertexA: 2.5 1.5 0; vertexB: 0 -1 0; vertexC: -2.5 1.5 0;',
                material: 'side: double; color: #006cd8; opacity: 1;',
                'button-highlight': ''
            })
        ])
        this.uiAngle = createEl('a-entity', {
            position: '34 1.5 -59',
            rotation: '0 -20 0',
            material: 'color: #808080; opacity: 1',
            geometry: 'primitive:plane; width:4.5; height: 4.5',
        }, [
            createEl('a-text', {
                align: 'center',
                value: 'ui\n0',
                width: '40',
                position: '0 0 0.3'
            }),
            createEl('a-entity', {
                position: '0 0 -0.2',
                material: 'color: #006cd8; opacity: 1',
                geometry: 'primitive:plane; width:5; height: 5',
            }),
            this.uiUp,
            this.uiDown,
        ], this.el)

        this.uiUp.addEventListener('click', () => {
            this.uiAngleIdx -= 1
            this.update()
        })

        this.uiDown.addEventListener('click', () => {
            this.uiAngleIdx += 1
            this.update()
        })

        this.viewUp.addEventListener('click', () => {
            this.viewAngleIdx -= 1
            this.update()
        })

        this.viewDown.addEventListener('click', () => {
            this.viewAngleIdx += 1
            this.update()
        })

        this.onEnvChange = AFRAME.utils.bind(this.onEnvChange, this)

        El.events.addEventListener(EV.ENVIRONMENT, this.onEnvChange)

    },

    update: function () {
        // D:
        if (this.uiAngleIdx === 0) {
            hideBtn(this.uiUp)
        } else {
            showBtn(this.uiUp)
        }

        if (this.uiAngleIdx === uiAngles.length - 1) {
            hideBtn(this.uiDown)
        } else {
            showBtn(this.uiDown)
        }

        if (this.viewAngleIdx === 0) {
            hideBtn(this.viewUp)
        } else {
            showBtn(this.viewUp)
        }

        if (this.viewAngleIdx === ViewAngles.length - 1) {
            hideBtn(this.viewDown)
        } else {
            showBtn(this.viewDown)
        }
        // D:

        if (this.curEnv === PRESET.FLAT_2D) {
            hideBtn(this.uiDown)
            hideBtn(this.uiUp)
            this.uiAngleIdx = 4 // set to 0
            this.uiAngle.setAttribute('visible', false)
        } else {
            this.uiAngle.setAttribute('visible', true)
        }

        if (this.curEnv === PRESET.M_360_EQR) {
            hideBtn(this.viewDown)
            hideBtn(this.viewUp)
            this.viewAngleIdx = 4 // set to 0
            this.viewAngle.setAttribute('visible', false)
        } else {
            this.viewAngle.setAttribute('visible', true)
        }


        El.cameraRig.setAttribute('rotation', `${-1 * ViewAngles[this.viewAngleIdx]} 0 0`)
        setAttr(this.viewAngle.children[0], {
            value: `view\n${ViewAngles[this.viewAngleIdx]}`
        })

        El.controls.setAttribute('rotation', `${uiAngles[this.uiAngleIdx]} 0 0`)
        setAttr(this.uiAngle.children[0], {
            value: `ui\n${uiAngles[this.uiAngleIdx]}`
        })
        if (this.curEnv !== PRESET.FLAT_2D)
            Store.set('uiAngleIdx', this.uiAngleIdx)

        if (this.curEnv !== PRESET.M_360_EQR)
            Store.set('viewAngleIdx', this.viewAngleIdx)
    },

    onEnvChange: function (e) {
        this.curEnv = e.detail.preset
        this.update()
    },

    remove: function () {
        this.el.removeChild(this.viewAngle)
        this.el.removeChild(this.uiAngle)
    },

});