import { El } from "../elems.js"
import { createEl } from "../utils.js"
import { getSettings, setSettings, ST } from "./settings/Settings.js"

const MAX_DISPLAY_WIDTH = 1920
const OVERLAY_DISTANCE = -55

let overlay = null
let dialogState = null

const suppressDialog = () => {
    const dialog = El.dialog
    if (!dialog || dialogState) { return }

    const clickables = Array.from(dialog.querySelectorAll("[clickable]"))
    if (dialog.hasAttribute("clickable")) { clickables.push(dialog) }

    dialogState = {
        visible: dialog.object3D ? dialog.object3D.visible : true,
        clickables,
    }

    for (const el of clickables) { el.removeAttribute("clickable") }
    if (dialog.object3D) { dialog.object3D.visible = false }
}

const restoreDialog = () => {
    if (!dialogState) { return }

    const dialog = El.dialog
    const state = dialogState
    dialogState = null

    if (!dialog) { return }

    for (const el of state.clickables) {
        if (el.isConnected && !el.hasAttribute("clickable")) {
            el.setAttribute("clickable", "")
        }
    }

    if (dialog.object3D) {
        dialog.object3D.visible = state.visible && dialog.children.length > 0
    }
}

const closePicker = () => {
    if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay)
    }
    overlay = null
    restoreDialog()
}

const toHex = (r, g, b) => {
    return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase()
}

const showMessage = (message) => {
    closePicker()

    const width = 28
    const height = 12
    const group = createEl('a-entity', {
        position: `0 0 ${OVERLAY_DISTANCE}`,
    }, [], El.camera)

    suppressDialog()
    overlay = group

    createEl('a-plane', {
        geometry: `width: ${width}; height: ${height}`,
        material: 'shader: flat; color: #111; opacity: 0.96; transparent: true;',
        position: '0 0 0',
    }, [], group)

    createEl('a-entity', {
        text: `value: ${message}; align: center; width: 10; color: #fff;`,
        position: '0 1 0.1',
    }, [], group)

    const cancel = createEl('a-plane', {
        geometry: 'width: 8; height: 2.2',
        material: 'color: #A15807;',
        position: '0 -3.5 0.1',
        clickable: '',
        'button-highlight': '',
        text: 'value: cancel; align: center; width: 8; zOffset: 0.2;',
    }, [], group)

    cancel.addEventListener('click', closePicker)
}

const captureFrame = () => {
    const video = El.video
    if (!video || video.readyState < 2 || !video.videoWidth || !video.videoHeight) {
        return null
    }

    const sample = document.createElement('canvas')
    sample.width = video.videoWidth
    sample.height = video.videoHeight

    const sampleCtx = sample.getContext('2d', { willReadFrequently: true })
    sampleCtx.drawImage(video, 0, 0, sample.width, sample.height)

    const scale = Math.min(1, MAX_DISPLAY_WIDTH / sample.width)
    const display = document.createElement('canvas')
    display.width = Math.max(1, Math.round(sample.width * scale))
    display.height = Math.max(1, Math.round(sample.height * scale))

    const displayCtx = display.getContext('2d')
    displayCtx.drawImage(sample, 0, 0, display.width, display.height)

    return {
        sample,
        sampleCtx,
        url: display.toDataURL('image/png'),
    }
}

export const openKeyColorPicker = (onPick) => {
    closePicker()

    let frame = null
    try {
        frame = captureFrame()
    } catch (err) {
        console.error('key color picker: failed to capture video frame', err)
        showMessage('Could not read the video frame')
        return
    }

    if (!frame) {
        showMessage('Load a video before picking a color')
        return
    }

    const aspect = frame.sample.width / frame.sample.height
    let imgH = 18
    let imgW = imgH * aspect
    if (imgW > 34) {
        imgW = 34
        imgH = imgW / aspect
    }

    const panelW = Math.max(28, imgW + 4)
    const panelH = imgH + 10
    const titleY = panelH / 2 - 1.6
    const currentY = panelH / 2 - 3.2
    const hintY = -panelH / 2 + 4
    const cancelY = -panelH / 2 + 1.8

    const color = getSettings(ST.KEY_COLOR) || '#00FF00'

    const group = createEl('a-entity', {
        position: `0 0 ${OVERLAY_DISTANCE}`,
    }, [], El.camera)

    suppressDialog()
    overlay = group

    createEl('a-plane', {
        geometry: `width: ${panelW}; height: ${panelH}`,
        material: 'shader: flat; color: #111; opacity: 0.96; transparent: true;',
        position: '0 0 0',
    }, [], group)

    createEl('a-entity', {
        text: 'value: Pick chroma key color; align: center; width: 11; color: #fff;',
        position: `0 ${titleY} 0.1`,
    }, [], group)

    createEl('a-plane', {
        geometry: 'width: 1.8; height: 1.8',
        material: `shader: flat; color: ${color};`,
        position: `${-panelW / 2 + 2.2} ${currentY} 0.1`,
    }, [], group)

    createEl('a-entity', {
        text: `value: ${color}; align: left; width: 7; color: #fff;`,
        position: `${-panelW / 2 + 4.1} ${currentY} 0.1`,
    }, [], group)

    const image = createEl('a-image', {
        src: frame.url,
        geometry: `width: ${imgW}; height: ${imgH}`,
        position: '0 0.8 0.05',
        clickable: '',
    }, [], group)

    createEl('a-entity', {
        text: 'value: Click the background color in the frame; align: center; width: 12; color: #ddd;',
        position: `0 ${hintY} 0.1`,
    }, [], group)

    const cancel = createEl('a-plane', {
        geometry: 'width: 8; height: 2.2',
        material: 'color: #A15807;',
        position: `0 ${cancelY} 0.1`,
        clickable: '',
        'button-highlight': '',
        text: 'value: cancel; align: center; width: 8; zOffset: 0.2;',
    }, [], group)

    cancel.addEventListener('click', closePicker)

    let done = false

    image.addEventListener('click', (e) => {
        if (done) { return }

        const uv = e.detail?.intersection?.uv
        if (!uv) { return }

        const x = Math.min(frame.sample.width - 1, Math.max(0, Math.floor(uv.x * frame.sample.width)))
        const y = Math.min(frame.sample.height - 1, Math.max(0, Math.floor((1 - uv.y) * frame.sample.height)))

        let pixel = null
        try {
            pixel = frame.sampleCtx.getImageData(x, y, 1, 1).data
        } catch (err) {
            console.error('key color picker: failed to read video pixel', err)
            showMessage('Could not read the video frame')
            return
        }

        done = true
        const picked = toHex(pixel[0], pixel[1], pixel[2])
        setSettings(ST.KEY_COLOR, picked)
        if (onPick) { onPick(picked) }
        closePicker()
    })
}
