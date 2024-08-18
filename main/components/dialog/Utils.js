import { El } from "../../main.js";
import { CTL_HIDDEN, CONTROLS } from "../../systems/Controls.js";

AFRAME.registerComponent('dialog-utils', {
    schema: {
        'screen': { 'type': 'string', 'default': '' }
    },

    init: function () {
        let el = this.el
        El.events.addEventListener(CONTROLS, (e) => {
            if (e.detail !== CTL_HIDDEN) return false
            el.object3D.visible = false
            el.removeAttribute('clickable')
            el.replaceChildren()
        })
    }
});

export const DWidth = 60
export const DHeight = 30

const videoExtensions = [
    "3g2",
    "3gp",
    "aaf",
    "asf",
    "avchd",
    "avi",
    "drc",
    "flv",
    "m2v",
    "m3u8",
    "m4p",
    "m4v",
    "mkv",
    "mng",
    "mov",
    "mp2",
    "mp4",
    "mpe",
    "mpeg",
    "mpg",
    "mpv",
    "mxf",
    "nsv",
    "ogg",
    "ogv",
    "qt",
    "rm",
    "rmvb",
    "roq",
    "svi",
    "vob",
    "webm",
    "wmv",
    "yuv"
]

export function isVideo(fileName) {
    for (let i in videoExtensions) {
        if (fileName.toLowerCase().endsWith(videoExtensions[i]))
            return true
    }
    return false
}