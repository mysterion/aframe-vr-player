import { El } from "../../main.js"
import { createEl, getAttr } from "../../utils.js"
import { CUR_TYPE } from "../CursorUtil.js"
import { getSettings, SETTINGS, ST } from "../settings/Settings.js"

import { DHeight, DWidth } from "./Utils.js"

export const DIALOG_SETTINGS = 'dialog-settings'

const itemLimit = 5
const space = -DHeight * 0.125
const initialPosition = DHeight * 0.15
const ascene = document.querySelector('a-scene')


// -1.2 ${pos} 0.01
function selectionModeTgl(el, y) {
    var id = 0
    // TODO: Add reverting back in 15 seconds logic
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
        El.settings.setAttribute(SETTINGS, {
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
        El.settings.setAttribute(SETTINGS, {
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
        El.settings.setAttribute(SETTINGS, {
            resumeVideo: newVal
        })
    })

    el.appendChild(tile)
}

function toggleCursorType(el, y, val) {

    var colorActive = "#5e74a7"
    var colorInActive = "#554b4a"

    let width = DWidth * 0.40
    let height = DHeight * 0.1

    let Hpos = DWidth * 0.25
    let Vgap = width * 0.1

    let BtnHeight = height - 0.01
    let BtnWidth = (width - Vgap) / 3

    let tile = createEl("a-plane", {
        "geometry": `width: ${width}; height: ${height}`,
        "material": "color: #A15807;",
        "position": `${Hpos} ${y} 0.2`,
        "clickable": "",
    }, [], el)


    let Btap = createEl("a-plane", {
        "geometry": `width: ${BtnWidth}; height: ${BtnHeight}`,
        "material": `color: ${colorInActive};`,
        "position": `-7.75 0 0.2`,
        "clickable": "",
        "button-highlight-text": "",
    }, [
        createEl("a-text", {
            "value": "tap",
            "align": "center",
            "width": "35",
            "position": `0 0 0.5`,
        }, []),
    ], tile)

    let Bgaze = createEl("a-plane", {
        "geometry": `width: ${BtnWidth}; height: ${BtnHeight}`,
        "material": `color: ${colorInActive};`,
        "position": `0 0 0.2`,
        "clickable": "",
        "button-highlight-text": "",
    }, [
        createEl("a-text", {
            "value": "gaze",
            "align": "center",
            "width": "35",
            "position": `0 0 0.5`,
        }, []),
    ], tile)

    let Blaser = createEl("a-plane", {
        "geometry": `width: ${BtnWidth}; height: ${BtnHeight}`,
        "material": `color: ${colorInActive};`,
        "position": `7.75 0 0.2`,
        "clickable": "",
        "button-highlight-text": "",
    }, [
        createEl("a-text", {
            "value": "laser",
            "align": "center",
            "width": "35",
            "position": `0 0 0.5`,
        }, []),
    ], tile)

    const updateColor = (j) => {
        Btap.setAttribute("material", `color: ${j === CUR_TYPE.TAP ? colorActive : colorInActive};`)
        Bgaze.setAttribute("material", `color: ${j === CUR_TYPE.GAZE ? colorActive : colorInActive};`)
        Blaser.setAttribute("material", `color: ${j === CUR_TYPE.LASER ? colorActive : colorInActive};`)
    }

    updateColor(getSettings(ST.CUR_TYPE))

    Btap.onclick = () => {
        updateColor(CUR_TYPE.TAP)
        El.settings.setAttribute(SETTINGS, {
            [ST.CUR_TYPE]: CUR_TYPE.TAP
        })
    }

    Bgaze.onclick = () => {
        updateColor(CUR_TYPE.GAZE)
        El.settings.setAttribute(SETTINGS, {
            [ST.CUR_TYPE]: CUR_TYPE.GAZE
        })
    }

    Blaser.onclick = () => {
        updateColor(CUR_TYPE.LASER)
        El.settings.setAttribute(SETTINGS, {
            [ST.CUR_TYPE]: CUR_TYPE.LASER
        })
    }

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
    { name: "save preset per video", render: savePresetChk, storeKey: ST.SAVE_PRESET },
    { name: "resume video", render: resumeVideoChk, storeKey: ST.RESUME_VIDEO },
    { name: "default eye", render: defaultEyeTgl, storeKey: ST.DEF_EYE },
    { name: "toggle cursor type", render: toggleCursorType, storeKey: ST.CUR_TYPE },
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
                el.setAttribute(SETTINGS, {
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
                el.setAttribute(SETTINGS, {
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

    let currentSettings = getAttr(El.settings, SETTINGS)
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

AFRAME.registerComponent(DIALOG_SETTINGS, {
    schema: {
        offset: { type: 'number', default: 0 },
        reRender: { type: 'string', default: '' }
    },

    init: function () {
        let el = this.el
        el.setAttribute('geometry', `primitive: plane; width: ${DWidth}; height: ${DHeight}`)
        el.setAttribute('material', 'color: teal')
        el.setAttribute('dialog-utils', { 'screen': DIALOG_SETTINGS })
    },

    update: function (od) {
        var d = this.data
        var el = this.el
        if (d.reRender && d.reRender.length > 0) {
            el.setAttribute('dialog-utils', { 'screen': DIALOG_SETTINGS })
            el.setAttribute(DIALOG_SETTINGS, { reRender: '' })
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