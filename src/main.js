import './components/TimelineListener.js'
import './components/Setup.js'
import './components/StereoSphere.js'
import './components/StereoCam.js'
import './components/ButtonHighlight.js'
import { toTime } from './components/TimelineListener.js';
import { openSingleFile, setUpSingleFileOpen } from './UI/openSingleFile.js';
import { isLoading, showFiles } from './UI/renderFiles.js';

export const GS = {

    'cursor': document.querySelector('#cursor'),
    // camera-rig > recenter-sphere > camera-wrapper > camera
    'cameraRig': document.querySelector('#cameraRig'),
    'camRecenter': document.querySelector('#camRecenter'),
    'cameraWrapper': document.querySelector('#cameraWrapper'),
    'camera': document.querySelector('#camera'),

    'video': document.querySelector('#video'),
    'videoText': document.querySelector('#videoText'),

    'controls': document.querySelector('#controls'),
    'seek': document.querySelector('#seek'),
    'timeline': document.querySelector('#timeline'),

    'openFileBtn': document.querySelector('#openFileBtn'),
    'seekBackwardBtn': document.querySelector('#seekBackwardBtn'),
    'pausePlayBtn': document.querySelector('#pausePlayBtn'),
    'seekForwardBtn': document.querySelector('#seekForwardBtn'),
    'hideFilesBtn': document.querySelector('#hideFilesBtn'),
    'hideUiBtn': document.querySelector('#hideUiBtn'),

    'volIncrBtn': document.querySelector('#volIncrBtn'),
    'volDecrBtn': document.querySelector('#volDecrBtn'),
    'volumeTxt': document.querySelector('#volumeTxt'),

    'toggleMode': document.querySelector("#toggleMode"),


    'leftEye': document.querySelector('#leftEye'),
    'rightEye': document.querySelector('#rightEye'),

    // files ui
    'files': document.querySelector('#files'),
    'loader': document.querySelector('#loader'),
    'loaded': document.querySelector('#loaded'),
    'filesList': document.querySelector('#filesList'),
    'fileInput': document.querySelector('#fileInput'),

    CON: {
        HIDE_CONTROLS_TIMEOUT: 5000
    }

}

export var inVR = false

export const videoPlayBtns = [
    GS.seek,
    GS.timeline,
    GS.seekBackwardBtn,
    GS.pausePlayBtn,
    GS.seekForwardBtn,
    GS.hideUiBtn,
    GS.openFileBtn,
    GS.volIncrBtn,
    GS.volDecrBtn,
    GS.toggleMode,
]

export var videoModeIndex = 0

export const videoModes = [
    {
        "text": "180 SBS EQR", "fn": () => {
            GS.leftEye.setAttribute("stereosphere", "mode: 180SbsEq;")
            GS.rightEye.setAttribute("stereosphere", "mode: 180SbsEq;")
        }
    },
    {
        "text": "180 SBS FISH", "fn": () => {
            GS.leftEye.setAttribute("stereosphere", "mode: SbsFish; fishFov: 180")
            GS.rightEye.setAttribute("stereosphere", "mode: SbsFish; fishFov: 180")
        }
    },
    {
        "text": "190 SBS FISH", "fn": () => {
            GS.leftEye.setAttribute("stereosphere", "mode: SbsFish; fishFov: 190")
            GS.rightEye.setAttribute("stereosphere", "mode: SbsFish; fishFov: 190")
        }
    },
    {
        "text": "200 SBS FISH", "fn": () => {
            GS.leftEye.setAttribute("stereosphere", "mode: SbsFish; fishFov: 200")
            GS.rightEye.setAttribute("stereosphere", "mode: SbsFish; fishFov: 200")
        }
    }
]



export const ascene = document.querySelector("a-scene")

// for debugging
window.GS = GS;

function openFiles() {
    if (import.meta.env.VITE_WEB) {
        openSingleFile()
        return
    }
    hideBtn(GS.openFileBtn)
    showBtn(GS.hideFilesBtn)
    // show files ui
    GS.files.setAttribute("visible", "true")
    GS.loaded.setAttribute("data-raycastable", "")
    // process
    showFiles()

}

function closeFiles() {
    if (import.meta.env.VITE_WEB) return
    hideBtn(hideFilesBtn)
    showBtn(openFileBtn)

    // block user when loading
    if (isLoading()) return
    // process

    // delete files ui entities
    GS.loaded.replaceChildren()
    // hide files ui
    GS.files.setAttribute("visible", "false")
    GS.loaded.removeAttribute("data-raycastable")


}

function hideBtn(el) {
    el.setAttribute("visible", "false")
    el.removeAttribute("data-raycastable")
}

function showBtn(el) {
    el.setAttribute("visible", "true")
    el.setAttribute("data-raycastable", "")
}

function setupFiles() {
    let { openFileBtn, hideFilesBtn } = GS
    openFileBtn.addEventListener('click', (e) => openFiles())
    hideFilesBtn.addEventListener('click', (e) => closeFiles())
    if (import.meta.env.VITE_WEB) setUpSingleFileOpen()
}

function setupVideo() {
    // video
    let { video, pausePlayBtn, seek, timeline, controls,
        hideUiBtn, volIncrBtn, volDecrBtn, volumeTxt, videoText,
        cursor, seekForwardBtn, seekBackwardBtn, toggleMode, CON } = GS
    video.src = 'static/sample.mp4'

    // pause-play
    video.addEventListener("playing", () => pausePlayBtn.setAttribute("src", "#asset-vp-pause"))
    video.addEventListener("pause", () => pausePlayBtn.setAttribute("src", "#asset-vp-play"))
    pausePlayBtn.addEventListener("click", (e) => {
        if (video.paused) {
            video.play()
        } else {
            video.pause()
        }
    })

    // hideui
    hideUiBtn.addEventListener("click", (e) => {
        controls.setAttribute('visible', false)
        cursor.setAttribute('visible', false)
        GS.rightEye.setAttribute('visible', true)
        videoPlayBtns.forEach((i) => i.removeAttribute('data-raycastable'))
        // close fileui if open
        closeFiles()
    })

    // seek
    var timelineWidth = timeline.getAttribute("geometry").width;
    let { x: sx, y: sy, z: sz } = seek.getAttribute("position")
    let startingPoint = sx - timelineWidth / 2
    seek.setAttribute("position", `${startingPoint} ${sy} ${sz}`)
    video.addEventListener('timeupdate', e => {
        var newPosition = (video.currentTime / video.duration) * timelineWidth - timelineWidth / 2;
        seek.setAttribute("position", `${newPosition} ${sy} ${sz}`);
        videoText.setAttribute("text", { value: `${toTime(video.currentTime)}/${toTime(video.duration)}` })
    })

    // seekforward, backward

    seekForwardBtn.addEventListener("click", (e) => {
        video.currentTime += 15
    })

    seekBackwardBtn.addEventListener("click", (e) => {
        video.currentTime -= 15
    })

    volumeTxt.setAttribute("value", `${Math.round(video.volume * 100)}%`)
    // vol incr
    volIncrBtn.addEventListener("click", (e) => {
        if (video.volume + 0.1 > 1)
            video.volume = 1
        else
            video.volume += 0.1
        volumeTxt.setAttribute("value", `${Math.round(video.volume * 100)}%`)
    })

    // vol decr
    volDecrBtn.addEventListener("click", (e) => {
        if (video.volume - 0.1 < 0)
            video.volume = 0
        else
            video.volume -= 0.1
        volumeTxt.setAttribute("value", `${Math.round(video.volume * 100)}%`)
    })

    // toggleModes
    toggleMode.addEventListener("click", (e) => {
        let { text, fn } = videoModes[(++videoModeIndex % videoModes.length)]
        GS.toggleMode.setAttribute("value", text)
        fn.call()
    })

    // less updates alternative
    // setInterval(() => {
    //     var newPosition = (video.currentTime/video.duration) * timelineWidth - timelineWidth / 2;
    //     console.log(`${newPosition} ${sy} ${sz}`)
    //     seek.setAttribute("position", `${newPosition} ${sy} ${sz}`);
    // }, 2000)

}

/*
    controls visible   - recenter
    controls invisible - shows controls
*/
function setupRecenter() {
    let { camRecenter, camera, cameraWrapper, controls, cursor } = GS
    camRecenter.addEventListener("click", (e) => {
        if (e.detail.intersectedEl !== GS.camRecenter) return;
        if (!controls.getAttribute('visible')) {
            cursor.setAttribute('visible', true)
            controls.setAttribute('visible', true)
            GS.rightEye.setAttribute('visible', false)
            videoPlayBtns.forEach((i) => i.setAttribute('data-raycastable', true))
            return
        }
        if (!inVR) return
        let { y } = camera.getAttribute("rotation");
        cameraWrapper.setAttribute("rotation", { x: 0, y: -y, z: 0 });
    })
}

export function setupScene() {
    console.log("SETUP: Start")
    setupRecenter();
    setupVideo();
    setupFiles();
    console.log("SETUP: End")
}

ascene.addEventListener('enter-vr', function () {
    // in vr mode acamera position.y is set to 1.6
    inVR = true
    GS.cameraRig.setAttribute("position", { x: 0, y: -1.6, z: 0 })
});

ascene.addEventListener('exit-vr', function () {
    inVR = false
    GS.cameraRig.setAttribute("position", { x: 0, y: 0, z: 0 })
});

