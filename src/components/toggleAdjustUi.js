import { createEl } from "../utils";

AFRAME.registerComponent('toggle-adjust-ui', {
    init: function () {
        // this.viewAngle = AFRAME.utils.bind(this.viewAngle, this)
        // this.uiAngle = AFRAME.utils.bind(this.uiAngle, this)

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
                clickable: '',
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
                clickable: '',
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
                value: 'view\n0',
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
                clickable: '',
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
                clickable: '',
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

    },

    update: function () {
    },

    remove: function () {
        this.el.removeChild(this.viewAngle)
        this.el.removeChild(this.uiAngle)
    },

});