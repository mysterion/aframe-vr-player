import { El } from "../../main";
import { Store } from "../../store"
import { isObjectEmpty } from "../../utils";
import { EV, EVENTS } from "../Events";


export const ViewAngles = [0, -30, -45, -60, -90, -60, -45, -30]
export const UiAngles = [0, 30, 0, -30]

export const SETTINGS = 'settings'

export const ST = {
    RESUME_VIDEO: 'resumeVideo',
    DEF_PRESET: 'defaultPreset',
    SAVE_PRESET: 'savePreset',
    DEF_EYE: 'defaultEye',
    VIEW_ANG: 'viewAngle',
    UI_ANG: 'uiAngle'
}

export const getSettings = (key) => {
    return El.settings.getAttribute(SETTINGS)[key]
}

AFRAME.registerComponent(SETTINGS, {
    schema: {
        [ST.RESUME_VIDEO]: { type: 'boolean', default: true },
        [ST.DEF_PRESET]: { type: 'number', default: 0 },
        [ST.SAVE_PRESET]: { type: 'boolean', default: true },
        [ST.DEF_EYE]: { type: 'string', default: 'left' },
        [ST.VIEW_ANG]: { type: 'number', default: 0 },
        [ST.UI_ANG]: { type: 'number', default: 0 },
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
        let d = this.data

        // el.setAttribute(C_AS_VIDEO, { time: d.resumeVideo })
        // el.setAttribute(C_AS_VIDEO, { defaultPreset: d.defaultPreset })
        // el.setAttribute(C_AS_VIDEO, { savePreset: d.savePreset })
        // getElem('camera').setAttribute('stereocam', { eye: d.defaultEye })
        // getElem('env').setAttribute('env-manager', { defaultEye: d.defaultEye })
        // El.cameraRig.setAttribute('rotation', `${ViewAngles[d.viewAngle]} 0 0`)
        // El.controls.setAttribute('rotation', `${UiAngles[d.uiAngle]} 0 0`)
        El.events.emit(EV.SETTINGS, d, false)
        Store.set('settings', d)
    },
});