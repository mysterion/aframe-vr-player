import { El } from "../../elems.js"
import { createEl, getAttr } from "../../utils.js"
import { CUR_TYPE } from "../CursorUtil.js"
import { openKeyColorPicker } from "../KeyColorPicker.js"
import { getSettings, setSettings, SETTINGS, ST } from "../settings/Settings.js"

import { DHeight, DWidth } from "./Utils.js"

export const DIALOG_SETTINGS = 'dialog-settings'

const itemLimit = 5
const space = -DHeight * 0.125
const initialPosition = DHeight * 0.15


function defaultEyeTgl(el, y, val) {
    const vars = ['left', 'right']
    var i = vars.indexOf(val)

    let tile = createEl("a-plane", {
        "geometry": `width: ${DWidth * 0.40}; height: ${DHeight * 0.1}`,
        "material": "color: #A15807;",
        "position": `${DWidth * 0.25} ${y} 0.2`,
        "clickable": "",
        "button-highlight": "",
        "text": `value: ${val}; align: center; width: 35; zOffset: 0.2;`,
    }, [], el)

    tile.onclick = () => {
        i = (i + 1) % vars.length
        tile.setAttribute("text", `value: ${vars[i]}`)
        El.settings.setAttribute(SETTINGS, {
            defaultEye: vars[i]
        })
    }
}

function savePresetChk(el, y, val) {
    const vars = [false, true]
    var i = vars.indexOf(val)

    let tile = createEl("a-plane", {
        "geometry": `width: ${DWidth * 0.40}; height: ${DHeight * 0.1}`,
        "material": "color: #A15807;",
        "position": `${DWidth * 0.25} ${y} 0.2`,
        "clickable": "",
        "button-highlight": "",
        "text": `value: ${val ? "ON" : "OFF"}; align: center; width: 35; zOffset: 0.2;`,
    }, [], el)

    tile.onclick = () => {
        let newVal = vars[++i % vars.length]
        tile.setAttribute("text", `value: ${newVal ? "ON" : "OFF"}`)
        El.settings.setAttribute(SETTINGS, {
            savePreset: newVal
        })
    }
}

function resumeVideoChk(el, y, val) {
    const vars = [false, true]
    var i = vars.indexOf(val)

    let tile = createEl("a-plane", {
        "geometry": `width: ${DWidth * 0.40}; height: ${DHeight * 0.1}`,
        "material": "color: #A15807;",
        "position": `${DWidth * 0.25} ${y} 0.2`,
        "clickable": "",
        "button-highlight": "",
        "text": `value: ${val ? "ON" : "OFF"}; align: center; width: 35; zOffset: 0.2;`,
    }, [], el)

    tile.addEventListener('click', () => {
        let newVal = vars[++i % vars.length]
        tile.setAttribute("text", `value: ${newVal ? "ON" : "OFF"}`)
        El.settings.setAttribute(SETTINGS, {
            resumeVideo: newVal
        })
    })
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
        "button-highlight": "",
        "text": `value: tap; align: center; width: 35; zOffset: 0.4;`,
    }, [
    ], tile)

    let Bgaze = createEl("a-plane", {
        "geometry": `width: ${BtnWidth}; height: ${BtnHeight}`,
        "material": `color: ${colorInActive};`,
        "position": `0 0 0.2`,
        "clickable": "",
        "button-highlight": "",
        "text": `value: gaze; align: center; width: 35; zOffset: 0.4;`,
    }, [], tile)

    let Blaser = createEl("a-plane", {
        "geometry": `width: ${BtnWidth}; height: ${BtnHeight}`,
        "material": `color: ${colorInActive};`,
        "position": `7.75 0 0.2`,
        "clickable": "",
        "button-highlight": "",
        "text": `value: laser; align: center; width: 35; zOffset: 0.4;`,
    }, [], tile)

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

function passthroughChk(el, y, val) {
    const vars = [false, true]
    var i = vars.indexOf(!!val)

    let tile = createEl("a-plane", {
        "geometry": `width: ${DWidth * 0.40}; height: ${DHeight * 0.1}`,
        "material": "color: #A15807;",
        "position": `${DWidth * 0.25} ${y} 0.2`,
        "clickable": "",
        "button-highlight": "",
        "text": `value: ${val ? "ON" : "OFF"}; align: center; width: 35; zOffset: 0.2;`,
    }, [], el)

    tile.addEventListener('click', () => {
        let newVal = vars[++i % vars.length]
        tile.setAttribute("text", `value: ${newVal ? "ON" : "OFF"}`)
        El.settings.setAttribute(SETTINGS, {
            [ST.PASSTHROUGH]: newVal
        })
    })
}

const camQualities = ['low', 'medium', 'high']

function camQualityTgl(el, y, val) {
    var i = Math.max(0, camQualities.indexOf(val))

    let tile = createEl("a-plane", {
        "geometry": `width: ${DWidth * 0.40}; height: ${DHeight * 0.1}`,
        "material": "color: #A15807;",
        "position": `${DWidth * 0.25} ${y} 0.2`,
        "clickable": "",
        "button-highlight": "",
        "text": `value: ${camQualities[i]}; align: center; width: 35; zOffset: 0.2;`,
    }, [], el)

    tile.addEventListener('click', () => {
        i = (i + 1) % camQualities.length
        tile.setAttribute("text", `value: ${camQualities[i]}`)
        El.settings.setAttribute(SETTINGS, {
            [ST.CAM_QUALITY]: camQualities[i]
        })
    })
}

const camFacings = ['environment', 'user', 'any']

function camFacingTgl(el, y, val) {
    var i = Math.max(0, camFacings.indexOf(val))

    let tile = createEl("a-plane", {
        "geometry": `width: ${DWidth * 0.40}; height: ${DHeight * 0.1}`,
        "material": "color: #A15807;",
        "position": `${DWidth * 0.25} ${y} 0.2`,
        "clickable": "",
        "button-highlight": "",
        "text": `value: ${camFacings[i]}; align: center; width: 35; zOffset: 0.2;`,
    }, [], el)

    tile.addEventListener('click', () => {
        i = (i + 1) % camFacings.length
        tile.setAttribute("text", `value: ${camFacings[i]}`)
        El.settings.setAttribute(SETTINGS, {
            [ST.CAM_FACING]: camFacings[i]
        })
    })
}

function camMirrorChk(el, y, val) {
    const vars = [false, true]
    var i = vars.indexOf(!!val)

    let tile = createEl("a-plane", {
        "geometry": `width: ${DWidth * 0.40}; height: ${DHeight * 0.1}`,
        "material": "color: #A15807;",
        "position": `${DWidth * 0.25} ${y} 0.2`,
        "clickable": "",
        "button-highlight": "",
        "text": `value: ${val ? "ON" : "OFF"}; align: center; width: 35; zOffset: 0.2;`,
    }, [], el)

    tile.addEventListener('click', () => {
        let newVal = vars[++i % vars.length]
        tile.setAttribute("text", `value: ${newVal ? "ON" : "OFF"}`)
        El.settings.setAttribute(SETTINGS, {
            [ST.CAM_MIRROR]: newVal
        })
    })
}

function camZoomTgl(el, y, val) {
    cycleNumberTgl(el, y, [0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 4, 5], ST.CAM_ZOOM, (v) => `${v}x`)
}

function camPanTgl(el, y, val) {
    cycleNumberTgl(el, y, [-30, -20, -10, 0, 10, 20, 30], ST.CAM_PAN, (v) => `${v}%`)
}

function camTiltTgl(el, y, val) {
    cycleNumberTgl(el, y, [-30, -20, -10, 0, 10, 20, 30], ST.CAM_TILT, (v) => `${v}%`)
}

const keyColorPresets = [
    { name: "green", value: "#00FF00" },
    { name: "blue", value: "#0000FF" },
    { name: "grey", value: "#808080" },
]

const keyColorText = (color) => {
    const value = String(color).replace("#", "")
    if (value.length !== 6) { return "#fff" }

    const r = parseInt(value.slice(0, 2), 16)
    const g = parseInt(value.slice(2, 4), 16)
    const b = parseInt(value.slice(4, 6), 16)
    const luminance = (r * 299 + g * 587 + b * 114) / 1000
    return luminance > 128 ? "#111" : "#fff"
}

function keyColorTgl(el, y, val) {
    const colorInActive = "#554b4a"

    let width = DWidth * 0.40
    let height = DHeight * 0.1
    let Hpos = DWidth * 0.25
    let gap = width * 0.04

    let BtnHeight = height - 0.01
    let controls = [
        ...keyColorPresets.map((preset) => ({ label: preset.name, preset })),
        { label: "pick", action: "pick" },
        { label: "hex", action: "hex" },
    ]
    let BtnWidth = (width - gap * (controls.length - 1)) / controls.length

    let tile = createEl("a-plane", {
        "geometry": `width: ${width}; height: ${height}`,
        "material": "color: #A15807;",
        "position": `${Hpos} ${y} 0.2`,
        "clickable": "",
    }, [], el)

    const buttons = controls.map((control, i) => {
        const x = -width / 2 + BtnWidth / 2 + i * (BtnWidth + gap)
        const color = control.preset ? control.preset.value : colorInActive
        const textColor = control.preset ? keyColorText(color) : "#fff"

        return {
            control,
            el: createEl("a-plane", {
                "geometry": `width: ${BtnWidth}; height: ${BtnHeight}`,
                "material": `color: ${color};`,
                "position": `${x} 0 0.2`,
                "clickable": "",
                "button-highlight": "",
                "text": `value: ${control.label}; align: center; width: ${Math.round(BtnWidth * 4)}; zOffset: 0.4; color: ${textColor};`,
            }, [], tile),
        }
    })

    const setHighlightColor = (button, color) => {
        const highlight = button.el.components["button-highlight"]
        if (highlight) { highlight.color = color }
    }

    const updateColor = (color) => {
        const normalized = String(color || "#00FF00").toUpperCase()
        const preset = keyColorPresets.find((p) => p.value.toUpperCase() === normalized)

        for (const button of buttons) {
            if (button.control.preset) {
                const selected = preset && preset.name === button.control.preset.name
                button.el.setAttribute("material", {
                    color: button.control.preset.value,
                    opacity: selected ? 1 : 0.55,
                    transparent: true,
                })
                button.el.setAttribute("text", {
                    color: keyColorText(button.control.preset.value),
                })
                setHighlightColor(button, button.control.preset.value)
            } else if (button.control.action === "pick") {
                const custom = !preset
                button.el.setAttribute("material", {
                    color: custom ? normalized : colorInActive,
                    opacity: 1,
                    transparent: false,
                })
                button.el.setAttribute("text", {
                    color: custom ? keyColorText(normalized) : "#fff",
                })
                setHighlightColor(button, custom ? normalized : colorInActive)
            } else {
                button.el.setAttribute("material", {
                    color: colorInActive,
                    opacity: 1,
                    transparent: false,
                })
                button.el.setAttribute("text", {
                    color: "#fff",
                })
                setHighlightColor(button, colorInActive)
            }
        }
    }

    updateColor(getSettings(ST.KEY_COLOR))

    for (const button of buttons) {
        if (button.control.preset) {
            button.el.onclick = () => {
                setSettings(ST.KEY_COLOR, button.control.preset.value)
                updateColor(button.control.preset.value)
            }
        } else if (button.control.action === "pick") {
            button.el.onclick = () => {
                openKeyColorPicker((color) => updateColor(color))
            }
        } else {
            button.el.onclick = () => {
                let current = getSettings(ST.KEY_COLOR) || "#00FF00"
                let input = window.prompt("Chroma key color hex (#RRGGBB)", current)
                if (!input) { return }

                input = input.trim()
                if (!input.startsWith("#")) { input = "#" + input }
                if (!/^#[0-9a-fA-F]{6}$/.test(input)) {
                    window.alert("Invalid hex color, expected #RRGGBB")
                    return
                }

                let color = input.toUpperCase()
                setSettings(ST.KEY_COLOR, color)
                updateColor(color)
            }
        }
    }
}

function cycleNumberTgl(el, y, values, key, format) {
    var i = 0
    let current = Math.abs(values[0] - Number(getSettings(key)))
    for (let j = 1; j < values.length; j++) {
        let d = Math.abs(values[j] - Number(getSettings(key)))
        if (d < current) {
            current = d
            i = j
        }
    }

    let tile = createEl("a-plane", {
        "geometry": `width: ${DWidth * 0.40}; height: ${DHeight * 0.1}`,
        "material": "color: #A15807;",
        "position": `${DWidth * 0.25} ${y} 0.2`,
        "clickable": "",
        "button-highlight": "",
        "text": `value: ${format(values[i])}; align: center; width: 35; zOffset: 0.2;`,
    }, [], el)

    tile.addEventListener('click', () => {
        i = (i + 1) % values.length
        tile.setAttribute("text", `value: ${format(values[i])}`)
        El.settings.setAttribute(SETTINGS, {
            [key]: values[i]
        })
    })
}

function keySimilarityTgl(el, y, val) {
    cycleNumberTgl(el, y, [0.2, 0.3, 0.35, 0.4, 0.5], ST.KEY_SIMILARITY, (v) => v.toFixed(2))
}

function keySmoothnessTgl(el, y, val) {
    cycleNumberTgl(el, y, [0.05, 0.1, 0.15, 0.25, 0.4], ST.KEY_SMOOTHNESS, (v) => v.toFixed(2))
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
    { name: "save preset per video", render: savePresetChk, storeKey: ST.SAVE_PRESET },
    { name: "resume video", render: resumeVideoChk, storeKey: ST.RESUME_VIDEO },
    { name: "default eye", render: defaultEyeTgl, storeKey: ST.DEF_EYE },
    { name: "toggle cursor type", render: toggleCursorType, storeKey: ST.CUR_TYPE },
    { name: "camera passthrough", render: passthroughChk, storeKey: ST.PASSTHROUGH },
    { name: "camera quality", render: camQualityTgl, storeKey: ST.CAM_QUALITY },
    { name: "camera facing", render: camFacingTgl, storeKey: ST.CAM_FACING },
    { name: "camera zoom", render: camZoomTgl, storeKey: ST.CAM_ZOOM },
    { name: "camera horizontal", render: camPanTgl, storeKey: ST.CAM_PAN },
    { name: "camera vertical", render: camTiltTgl, storeKey: ST.CAM_TILT },
    { name: "camera mirror", render: camMirrorChk, storeKey: ST.CAM_MIRROR },
    { name: "chroma key color", render: keyColorTgl, storeKey: ST.KEY_COLOR },
    { name: "key tolerance", render: keySimilarityTgl, storeKey: ST.KEY_SIMILARITY },
    { name: "key softness", render: keySmoothnessTgl, storeKey: ST.KEY_SMOOTHNESS },
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
                el.setAttribute(DIALOG_SETTINGS, {
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
                el.setAttribute(DIALOG_SETTINGS, {
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
                "text": `value: ${settings[i].name}; align: center; width: 35; zOffset: 0.2;`,
            }, [], el)
            settings[i].render(el, pos, currentSettings[settings[i].storeKey])
            pos += space
        }
    }
}

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