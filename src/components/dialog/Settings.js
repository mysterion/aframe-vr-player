import { videoModes } from "../ToggleMode"

import { C_APPLY_SETTINGS } from "../settings/ApplySettings"

export const C_SETTINGS = 'dialog-settings'

const itemLimit = 4
const space = -0.3
const initialPosition = 0.4
const ascene = document.querySelector('a-scene')


// -1.2 ${pos} 0.01
function selectionModeTgl(el, y) {
    var id = 0
    var ids = ["tap (recommended)", "fuse 1.5s", "fuse 2s", "fuse 3s"]

    let tile = document.createElement("a-plane")
    tile.setAttribute("geometry", "width:2; height: 0.2")
    tile.setAttribute("material", "color: #A15807;")
    tile.setAttribute("position", `1.2 ${y} 0.01`)
    tile.setAttribute("clickable", "")
    tile.setAttribute("button-highlight", "")


    let text = document.createElement("a-text")
    text.setAttribute("value", ids[id])
    text.setAttribute("align", "center")
    text.setAttribute("width", "2")

    tile.appendChild(text)
    tile.onclick = () => {
        text.setAttribute("value", ids[(++id) % ids.length])
    }

    el.appendChild(tile)
}

function defaultPresetTgl(el, y) {
    var id = 0

    let tile = document.createElement("a-plane")
    tile.setAttribute("geometry", "width:2; height: 0.2")
    tile.setAttribute("material", "color: #A15807;")
    tile.setAttribute("position", `1.2 ${y} 0.01`)
    tile.setAttribute("clickable", "")
    tile.setAttribute("button-highlight", "")


    let text = document.createElement("a-text")
    text.setAttribute("value", videoModes[id].text)
    text.setAttribute("align", "center")
    text.setAttribute("width", "2")

    tile.appendChild(text)
    tile.onclick = () => {
        text.setAttribute("value", videoModes[(++id) % videoModes.length].text)
    }

    el.appendChild(tile)
}

function savePresetChk(el, y) {
    var i = 0
    var vars = ["OFF", "ON"]

    let tile = document.createElement("a-plane")
    tile.setAttribute("geometry", "width:2; height: 0.2")
    tile.setAttribute("material", "color: #A15807;")
    tile.setAttribute("position", `1.2 ${y} 0.01`)
    tile.setAttribute("clickable", "")
    tile.setAttribute("button-highlight", "")


    let text = document.createElement("a-text")
    text.setAttribute("value", vars[0])
    text.setAttribute("align", "center")
    text.setAttribute("width", "2")

    tile.appendChild(text)
    tile.onclick = () => {
        text.setAttribute("value", vars[++i % vars.length])
    }

    el.appendChild(tile)
}

function resumeVideoChk(el, y, val) {
    var vars = ["OFF", "ON"]
    var i = vars.indexOf(val)

    let tile = document.createElement("a-plane")
    tile.setAttribute("geometry", "width:2; height: 0.2")
    tile.setAttribute("material", "color: #A15807;")
    tile.setAttribute("position", `1.2 ${y} 0.01`)
    tile.setAttribute("clickable", "")
    tile.setAttribute("button-highlight", "")

    let text = document.createElement("a-text")
    text.setAttribute("value", vars[i])
    text.setAttribute("align", "center")
    text.setAttribute("width", "2")

    tile.appendChild(text)

    tile.addEventListener('click', () => {
        let newVal = vars[++i % vars.length]
        text.setAttribute("value", newVal)
        ascene.setAttribute(C_APPLY_SETTINGS, {
            resumeVideo: newVal
        })
    })

    el.appendChild(tile)
}

function uiPosTgl(el, y) {
    var i = 0
    var vars = ["OFF", "ON"]

    let tile = document.createElement("a-plane")
    tile.setAttribute("geometry", "width:2; height: 0.2")
    tile.setAttribute("material", "color: #A15807;")
    tile.setAttribute("position", `1.2 ${y} 0.01`)
    tile.setAttribute("clickable", "")
    tile.setAttribute("button-highlight", "")


    let text = document.createElement("a-text")
    text.setAttribute("value", vars[0])
    text.setAttribute("align", "center")
    text.setAttribute("width", "2")

    tile.appendChild(text)
    tile.onclick = () => {
        text.setAttribute("value", vars[++i % vars.length])
    }

    el.appendChild(tile)
}

function defaultEyeTgl(el, y) {
    var i = 0
    var vars = ["LEFT", "RIGHT"]

    let tile = document.createElement("a-plane")
    tile.setAttribute("geometry", "width:2; height: 0.2")
    tile.setAttribute("material", "color: #A15807;")
    tile.setAttribute("position", `1.2 ${y} 0.01`)
    tile.setAttribute("clickable", "")
    tile.setAttribute("button-highlight", "")


    let text = document.createElement("a-text")
    text.setAttribute("value", vars[0])
    text.setAttribute("align", "center")
    text.setAttribute("width", "2")

    tile.appendChild(text)
    tile.onclick = () => {
        text.setAttribute("value", vars[++i % vars.length])
    }

    el.appendChild(tile)
}

function seekTimeTgl(el, y) {
    var i = 0
    var vars = ["10s", "15s", "30s", "120s"]

    let tile = document.createElement("a-plane")
    tile.setAttribute("geometry", "width:2; height: 0.2")
    tile.setAttribute("material", "color: #A15807;")
    tile.setAttribute("position", `1.2 ${y} 0.01`)
    tile.setAttribute("clickable", "")
    tile.setAttribute("button-highlight", "")


    let text = document.createElement("a-text")
    text.setAttribute("value", vars[0])
    text.setAttribute("align", "center")
    text.setAttribute("width", "2")

    tile.appendChild(text)
    tile.onclick = () => {
        text.setAttribute("value", vars[++i % vars.length])
    }

    el.appendChild(tile)
}

const settings = [
    // { name: "select mode", render: selectionModeTgl },
    // { name: "default preset", render: defaultPresetTgl },
    // { name: "save preset for video", render: savePresetChk },
    { name: "resume video", render: resumeVideoChk, storeKey: 'resumeVideo' },
    // { name: "ui position", render: uiPosTgl },
    // { name: "default eye", render: defaultEyeTgl },
    // { name: "seek time", render: seekTimeTgl },
]

function insertSettingsUI(el, offset) {

    let uri = document.createElement("a-text")
    let p = el.getAttribute("geometry")
    uri.setAttribute("value", "Settings")
    uri.setAttribute("geometry", `primitive:plane; width:${p.width}; height: 0.2`)
    uri.setAttribute("position", `0 ${p.height / 2} 0.01`)
    uri.setAttribute("material", "color: grey")
    uri.setAttribute("align", "center")
    uri.setAttribute("width", "2")
    el.appendChild(uri)

    if (settings.length > itemLimit) {
        if (offset != 0) {
            let upBtn = document.createElement("a-image")
            upBtn.setAttribute("src", "#asset-up")
            upBtn.setAttribute("scale", "0.2 0.2 1")
            upBtn.setAttribute("position", `0 0.75 0.02`)
            upBtn.setAttribute("clickable", "")
            upBtn.setAttribute("button-highlight", "")
            upBtn.addEventListener("click", () => {
                el.setAttribute(C_SETTINGS, {
                    offset: offset - 1
                })
            })
            el.appendChild(upBtn)
        }
        if (offset + itemLimit < settings.length) {
            let downBtn = document.createElement("a-image")
            downBtn.setAttribute("src", "#asset-up")
            downBtn.setAttribute("scale", "0.2 -0.2 1")
            downBtn.setAttribute("position", `0 ${initialPosition + 0.2 + (itemLimit * space) + (space - 0.01)} 0.02`)
            downBtn.setAttribute("clickable", "")
            downBtn.setAttribute("button-highlight", "")
            downBtn.addEventListener("click", () => {
                el.setAttribute(C_SETTINGS, {
                    offset: offset + 1
                })
            })
            el.appendChild(downBtn)
        }
    }

}

function renderSettings(el, offset) {
    el.replaceChildren()
    el.setAttribute('clickable', '')
    el.object3D.visible = true

    insertSettingsUI(el, offset)

    let currentSettings = ascene.getAttribute(C_APPLY_SETTINGS)
    // let e = document.createElement('a-text')
    // e.setAttribute('value', 'hello settings')
    // e.setAttribute('align', 'center')
    // el.appendChild(e)
    let pos = initialPosition
    for (let i = offset; i < offset + itemLimit; i++) {
        if (i < settings.length) {
            let tile = document.createElement("a-plane")
            tile.setAttribute("geometry", "width:2; height: 0.2")
            tile.setAttribute("material", "color: #801D9F;")
            tile.setAttribute("position", `-1.2 ${pos} 0.01`)
            settings[i].render(el, pos, currentSettings[settings[i].storeKey])

            let text = document.createElement("a-text")
            text.setAttribute("value", settings[i].name)
            text.setAttribute("align", "center")
            text.setAttribute("width", "2")

            tile.appendChild(text)
            el.appendChild(tile)
            pos += space
        }
    }
}

// { name: "select mode", render: selectionModeTgl },
// { name: "default preset", render: defaultPresetTgl },
// { name: "save preset for video", render: savePresetChk },
// { name: "resume video", render: resumeVideoChk },
// { name: "ui position", render: uiPosTgl },
// { name: "default eye", render: defaultEyeTgl },
// { name: "seek time", render: seekTimeTgl },

AFRAME.registerComponent(C_SETTINGS, {
    schema: {
        offset: { type: 'number', default: 0 },
        resumeVideo: { type: 'string', default: 'ON' },
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
        renderSettings(el, d.offset)
    },

    remove: function () {
        let el = this.el
        el.replaceChildren()
        el.removeAttribute('clickable')
        el.setAttribute('dialog-utils', { 'screen': '' })
    }
});