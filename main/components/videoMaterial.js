import { El } from "../elems.js"
import { EV } from "./Events.js"
import { getSettings, ST } from "./settings/Settings.js"
import { CHROMA_SHADER } from "./chroma.js"

const views = new Set()
const hiders = new Set()
let lastState = null

const state = () => [
    !!getSettings(ST.PASSTHROUGH),
    getSettings(ST.KEY_COLOR),
    getSettings(ST.KEY_SIMILARITY),
    getSettings(ST.KEY_SMOOTHNESS),
]

const applyVideoMaterial = (el) => {
    const base = el._videoBase || {}
    const passthrough = !!getSettings(ST.PASSTHROUGH)
    const props = { ...base }
    const shader = props.shader
    delete props.shader

    if (shader === 'youtube-eac') {
        el.setAttribute('material', {
            ...props,
            transparent: passthrough,
            depthWrite: !passthrough,
            enabled: passthrough ? 1 : 0,
            keyColor: getSettings(ST.KEY_COLOR),
            similarity: getSettings(ST.KEY_SIMILARITY),
            smoothness: getSettings(ST.KEY_SMOOTHNESS),
        })
        return
    }

    if (passthrough) {
        el.setAttribute('material', {
            shader: CHROMA_SHADER,
            ...props,
            transparent: true,
            depthWrite: false,
            enabled: 1,
            keyColor: getSettings(ST.KEY_COLOR),
            similarity: getSettings(ST.KEY_SIMILARITY),
            smoothness: getSettings(ST.KEY_SMOOTHNESS),
        })
    } else {
        el.setAttribute('material', {
            shader: 'flat',
            ...props,
            transparent: false,
            depthWrite: true,
        })
    }
}

const applyPassthroughVisibility = (el) => {
    el.object3D.visible = !getSettings(ST.PASSTHROUGH)
}

const refreshVideoViews = () => {
    const next = JSON.stringify(state())
    if (next === lastState) { return }
    lastState = next

    for (const el of Array.from(views)) {
        if (!el.isConnected) {
            views.delete(el)
            continue
        }
        applyVideoMaterial(el)
    }

    for (const el of Array.from(hiders)) {
        if (!el.isConnected) {
            hiders.delete(el)
            continue
        }
        applyPassthroughVisibility(el)
    }
}

// Elements that should only exist when passthrough is off (e.g. artifact masks).
export const registerPassthroughHider = (el) => {
    hiders.add(el)
    applyPassthroughVisibility(el)
    return el
}

export const unregisterPassthroughHider = (el) => {
    hiders.delete(el)
}

// `base` holds the material properties that belong to the preset, e.g.
// { src: '#video', side: 'back', offset: {x: 0.5, y: 0} }.
export const registerVideoView = (el, base = {}) => {
    el._videoBase = base
    views.add(el)
    applyVideoMaterial(el)
    return el
}

El.events.addEventListener(EV.SETTINGS, refreshVideoViews)
