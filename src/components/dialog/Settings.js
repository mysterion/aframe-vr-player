import { ControlsHidden, ControlsShown } from "../../systems/Controls"
export const C_SETTINGS = 'dialog-settings'

function renderFiles(el) {
    el.replaceChildren()
    el.setAttribute('clickable', '')
    el.object3D.visible = true

    let uri = document.createElement("a-text")
    let p = el.getAttribute("geometry")
    uri.setAttribute("value", "Settings")
    uri.setAttribute("geometry", `primitive:plane; width:${p.width}; height: 0.2`)
    uri.setAttribute("position", `0 ${p.height / 2} 0.01`)
    uri.setAttribute("material", "color: grey")
    uri.setAttribute("align", "center")
    uri.setAttribute("width", "2")
    el.appendChild(uri)

    let e = document.createElement('a-text')
    e.setAttribute('value', 'hello settings')
    e.setAttribute('align', 'center')
    el.appendChild(e)
}

AFRAME.registerComponent(C_SETTINGS, {
    schema: {
        reRender: { type: 'string', default: '' }
    },

    init: function () {
        let el = this.el
        el.setAttribute('geometry', 'primitive: plane; width: 5; height: 2.1')
        el.setAttribute('material', 'color: teal')
        el.setAttribute('dialog-utils', { 'screen': C_SETTINGS })
    },

    update: function (od) {
        var d = this.data
        var el = this.el
        if (d.reRender && d.reRender.length > 0) {
            el.setAttribute('dialog-utils', { 'screen': C_SETTINGS })
            el.setAttribute(C_SETTINGS, { reRender: '' })
            return
        }
        renderFiles(el)
    },

    remove: function () {
        let el = this.el
        el.replaceChildren()
        el.removeAttribute('clickable')
        el.setAttribute('dialog-utils', { 'screen': '' })
    }
});