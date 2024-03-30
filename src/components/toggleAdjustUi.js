import { El } from "../main";
import { Store } from "../store";
import { createEl, setAttr } from "../utils";

export const ViewAngles = [90, 60, 45, 30, 0, -30, -45, -60, -90]

export const uiAngles = [60, 45, 30, 15, 0, -15, -30, -45, -60]

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
                position: '0 0 -0.25',
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
                position: '0 0 -0.25',
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
                position: '0 0 0.2'
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
                position: '0 0 -0.25',
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
                position: '0 0 -0.25',
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
                position: '0 0 0.2'
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

    },

    update: function () {
        // D:
        if (this.uiAngleIdx === 0) {
            this.uiUp.removeAttribute('button-highlight')
            this.uiUp.removeAttribute('clickable')
            this.uiUp.setAttribute('visible', false)
        } else {
            this.uiUp.setAttribute('button-highlight', '')
            this.uiUp.setAttribute('clickable', '')
            this.uiUp.setAttribute('visible', true)
        }

        if (this.uiAngleIdx === uiAngles.length - 1) {
            this.uiDown.removeAttribute('button-highlight')
            this.uiDown.removeAttribute('clickable')
            this.uiDown.setAttribute('visible', false)
        } else {
            this.uiDown.setAttribute('button-highlight', '')
            this.uiDown.setAttribute('clickable', '')
            this.uiDown.setAttribute('visible', true)
        }

        if (this.viewAngleIdx === 0) {
            this.viewUp.removeAttribute('button-highlight')
            this.viewUp.removeAttribute('clickable')
            this.viewUp.setAttribute('visible', false)
        } else {
            this.viewUp.setAttribute('button-highlight', '')
            this.viewUp.setAttribute('clickable', '')
            this.viewUp.setAttribute('visible', true)
        }

        if (this.viewAngleIdx === ViewAngles.length - 1) {
            this.viewDown.removeAttribute('button-highlight')
            this.viewDown.removeAttribute('clickable')
            this.viewDown.setAttribute('visible', false)
        } else {
            this.viewDown.setAttribute('button-highlight', '')
            this.viewDown.setAttribute('clickable', '')
            this.viewDown.setAttribute('visible', true)
        }
        // D:

        El.cameraRig.setAttribute('rotation', `${ViewAngles[this.viewAngleIdx]} 0 0`)
        El.controls.setAttribute('rotation', `${uiAngles[this.uiAngleIdx]} 0 0`)
        setAttr(this.viewAngle.children[0], {
            value: `view\n${ViewAngles[this.viewAngleIdx]}`
        })
        setAttr(this.uiAngle.children[0], {
            value: `ui\n${uiAngles[this.uiAngleIdx]}`
        })

        Store.set('viewAngleIdx', this.viewAngleIdx)
        Store.set('uiAngleIdx', this.uiAngleIdx)
    },

    remove: function () {
        this.el.removeChild(this.viewAngle)
        this.el.removeChild(this.uiAngle)
    },

});