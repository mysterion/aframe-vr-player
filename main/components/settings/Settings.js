import { El } from "../../elems.js";
import { Store } from "../../store.js"
import { isObjectEmpty } from "../../utils.js";
import { CUR_TYPE } from "../CursorUtil.js";
import { EV } from "../Events.js";

export const SETTINGS = 'settings'

export const ST = {
    RESUME_VIDEO: 'resumeVideo',
    DEF_PRESET: 'defaultPreset',
    SAVE_PRESET: 'savePreset',
    DEF_EYE: 'defaultEye',
    VIEW_ANG: 'viewAngle',
    UI_ANG: 'uiAngle',
    CUR_TYPE: 'cursorType',

    FLAT_ENV_POI: 'flatEnv_poi',
    FLAT_ENV_BG: 'flatEnv_bg',
    FLAT_ENV_VTYPE: 'flatEnv_vtype',

    PASSTHROUGH: 'passthrough',
    CAM_QUALITY: 'camQuality',
    CAM_FACING: 'camFacing',
    CAM_ZOOM: 'camZoom',
    CAM_PAN: 'camPan',
    CAM_TILT: 'camTilt',
    CAM_MIRROR: 'camMirror',
    KEY_COLOR: 'keyColor',
    KEY_SIMILARITY: 'keySimilarity',
    KEY_SMOOTHNESS: 'keySmoothness',
}

export const getSettings = (key) => {
    return El.settings.getAttribute(SETTINGS)[key]
}

export const setSettings = (key, value) => {
    El.settings.setAttribute(SETTINGS, {
        [key]: value
    })
}

/*

usage:
 0) on `component` init, use `getSettings(ST.KEY_NAME)` to update the component's attribute (dont worry , it doesn't change the other lifecycle funcs)
 1) buttons/interactions should use - 
    `setSettings(ST.KEY_NAME, value)`
   BTS:-
    --- settings is saved in persistent storage
    --- an event is fired,
    --- use
    --- El.events.addEventListener(EV.SETTINGS, this.onSettingsChange)
    --- to implement your logic


    Example: CursorUtil.js
*/

AFRAME.registerComponent(SETTINGS, {
    schema: {
        [ST.RESUME_VIDEO]: { type: 'boolean', default: true },
        [ST.DEF_PRESET]: { type: 'number', default: 0 },
        [ST.SAVE_PRESET]: { type: 'boolean', default: true },
        [ST.DEF_EYE]: { type: 'string', default: 'left' },
        [ST.VIEW_ANG]: { type: 'number', default: 0 },
        [ST.UI_ANG]: { type: 'number', default: 0 },
        [ST.CUR_TYPE]: { type: 'string', default: CUR_TYPE.TAP },

        [ST.FLAT_ENV_BG]: { type: 'number', default: 0 },
        [ST.FLAT_ENV_POI]: { type: 'number', default: 0 },
        [ST.FLAT_ENV_VTYPE]: { type: 'string', default: "2D" },

        [ST.PASSTHROUGH]: { type: 'boolean', default: false },
        [ST.CAM_QUALITY]: { type: 'string', default: 'medium' },
        [ST.CAM_FACING]: { type: 'string', default: 'environment' },
        [ST.CAM_ZOOM]: { type: 'number', default: 1 },
        [ST.CAM_PAN]: { type: 'number', default: 0 },
        [ST.CAM_TILT]: { type: 'number', default: 0 },
        [ST.CAM_MIRROR]: { type: 'boolean', default: false },
        [ST.KEY_COLOR]: { type: 'string', default: '#00FF00' },
        [ST.KEY_SIMILARITY]: { type: 'number', default: 0.35 },
        [ST.KEY_SMOOTHNESS]: { type: 'number', default: 0.12 },
    },

    init: function () {
        let el = this.el
        let settings = Store.get('settings')
        if (!settings) {
            settings = this.data
            Store.set('settings', settings)
        } else {
            // filter out old keys
            for (let key in settings) {
                if (!(key in this.data)) {
                    delete settings[key]
                }
            }
            // migration
            let newSettings = {}
            for (let dkey in this.data) {
                if (!(dkey in settings)) {
                    newSettings[dkey] = this.data[dkey]
                }
            }
            if (!isObjectEmpty(newSettings)) {
                Store.set('settings', { ...settings, ...newSettings })
            }
            el.setAttribute(SETTINGS, settings)
        }
    },

    update: function (od) {
        El.events.emit(EV.SETTINGS, this.data, false)
        Store.set('settings', this.data)
    },
});