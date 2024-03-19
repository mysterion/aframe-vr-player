import { E } from "../../main"
import { createEl } from "../../utils"
import { videoPresets } from "../VideoState"

import { C_APPLY_SETTINGS } from "../settings/ApplySettings"
import { DHeight, DWidth } from "./Utils"

export const C_SETTINGS = 'dialog-settings'

const itemLimit = 5
const space = -DHeight * 0.125
const initialPosition = DHeight * 0.15
const ascene = document.querySelector('a-scene')


// -1.2 ${pos} 0.01
function selectionModeTgl(el, y) {
    var id = 0
    var ids = ["tap (recommended)", "fuse 1.5s", "fuse 2s", "fuse 3s"]

    let tile = document.createElement("a-plane")
    tile.setAttribute("geometry", `width: ${DWidth * 0.40}; height: ${DHeight * 0.1}`)
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

function defaultPresetTgl(el, y, val) {
    var id = val

    let tile = createEl("a-plane", {
        "geometry": `width: ${DWidth * 0.40}; height: ${DHeight * 0.1}`,
        "material": "color: #A15807;",
        "position": `${DWidth * 0.25} ${y} 0.2`,
        "clickable": "",
        "button-highlight": "",
    }, [
        createEl('a-entity', {
            text: `value: ${videoPresets[id].text}; align: center; width: 35;`,
            position: '0 0 0.2'
        })
    ])

    let text = tile.children[0]
    console.log(text)

    tile.onclick = () => {
        id = (id + 1) % videoPresets.length
        text.setAttribute("text", `value: ${videoPresets[id].text}`)
        E.ascene.setAttribute(C_APPLY_SETTINGS, {
            defaultPreset: id
        })
    }
    el.appendChild(tile)
}


function defaultEyeTgl(el, y, val) {
    var vars = ['left', 'right']
    var i = vars.indexOf(val)

    let tile = createEl("a-plane", {
        "geometry": `width: ${DWidth * 0.40}; height: ${DHeight * 0.1}`,
        "material": "color: #A15807;",
        "position": `${DWidth * 0.25} ${y} 0.2`,
        "clickable": "",
        "button-highlight": "",
    }, [
        createEl('a-entity', {
            text: `value: ${val}; align: center; width: 35;`,
            position: '0 0 0.2'
        })
    ])

    let text = tile.children[0]

    tile.onclick = () => {
        i = (i + 1) % vars.length
        text.setAttribute("text", `value: ${vars[i]}`)
        E.ascene.setAttribute(C_APPLY_SETTINGS, {
            defaultEye: vars[i]
        })
    }
    el.appendChild(tile)
}

function savePresetChk(el, y, val) {
    var vars = [false, true]
    var i = vars.indexOf(val)

    let tile = createEl("a-plane", {
        "geometry": `width: ${DWidth * 0.40}; height: ${DHeight * 0.1}`,
        "material": "color: #A15807;",
        "position": `${DWidth * 0.25} ${y} 0.2`,
        "clickable": "",
        "button-highlight": "",
    }, [
        createEl('a-entity', {
            text: `value: ${val ? "ON" : "OFF"}; align: center; width: 35;`,
            position: '0 0 0.2'
        })
    ])

    let text = tile.children[0]

    tile.onclick = () => {
        let newVal = vars[++i % vars.length]
        text.setAttribute("text", `value: ${newVal ? "ON" : "OFF"}`)
        E.ascene.setAttribute(C_APPLY_SETTINGS, {
            savePreset: newVal
        })
    }

    el.appendChild(tile)
}

function resumeVideoChk(el, y, val) {
    var vars = [false, true]
    var i = vars.indexOf(val)

    let tile = createEl("a-plane", {
        "geometry": `width: ${DWidth * 0.40}; height: ${DHeight * 0.1}`,
        "material": "color: #A15807;",
        "position": `${DWidth * 0.25} ${y} 0.2`,
        "clickable": "",
        "button-highlight": "",
    }, [
        createEl('a-entity', {
            text: `value: ${val ? "ON" : "OFF"}; align: center; width: 35;`,
            position: '0 0 0.2'
        })
    ])

    let text = tile.children[0]

    tile.addEventListener('click', () => {
        let newVal = vars[++i % vars.length]
        text.setAttribute("text", `value: ${newVal ? "ON" : "OFF"}`)
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
    tile.setAttribute("geometry", `width: ${DWidth * 0.40}; height: ${DHeight * 0.1}`)
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
    tile.setAttribute("geometry", `width: ${DWidth * 0.40}; height: ${DHeight * 0.1}`)
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
    { name: "default preset", render: defaultPresetTgl, storeKey: 'defaultPreset' },
    { name: "save preset for video", render: savePresetChk, storeKey: 'savePreset' },
    { name: "resume video", render: resumeVideoChk, storeKey: 'resumeVideo' },
    { name: "default eye", render: defaultEyeTgl, storeKey: 'defaultEye' },
    // { name: "ui position", render: uiPosTgl },
    // { name: "default eye", render: defaultEyeTgl },
    // { name: "seek time", render: seekTimeTgl },
]

function insertSettingsUI(el, offset) {
    let p = el.getAttribute("geometry")

    el.appendChild(createEl("a-entity", {
        "geometry": `primitive:plane; width:${p.width}; height: 3`,
        "position": `0 ${p.height / 2} 0.2`,
        "material": "color: grey",
    }, [
        createEl('a-entity', {
            "text": "value: Settings; align: center; width: 30;",
            "position": `0 0 0.2`,
        })
    ]))


    if (settings.length > itemLimit) {
        if (offset != 0) {
            let upBtn = createEl("a-image", {
                "src": "#asset-up",
                "scale": "3 3 1",
                "position": `0 ${p.height * 0.3} 0.2`,
                "clickable": "",
                "button-highlight": "",
            })
            upBtn.addEventListener("click", () => {
                el.setAttribute(C_SETTINGS, {
                    offset: offset - 1
                })
            })
            el.appendChild(upBtn)
        }
        if (offset + itemLimit < settings.length) {
            let downBtn = createEl("a-image", {
                "src": "#asset-up",
                "scale": "3 -3 1",
                "position": `0 -${p.height * 0.5} 0.2`,
                "clickable": "",
                "button-highlight": "",
            })
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
    let pos = initialPosition
    for (let i = offset; i < offset + itemLimit; i++) {
        if (i < settings.length) {
            let tile = createEl("a-plane", {
                "geometry": `width: ${DWidth * 0.40}; height: ${DHeight * 0.1}`,
                "material": "color: #801D9F;",
                "position": `-${DWidth * 0.25} ${pos} 0.2`,
            }, [
                createEl('a-entity', {
                    text: `value: ${settings[i].name}; align: center; width: 35`,
                    position: '0 0 0.2'
                })
            ])
            settings[i].render(el, pos, currentSettings[settings[i].storeKey])
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
        el.setAttribute('geometry', `primitive: plane; width: ${DWidth}; height: ${DHeight}`)
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