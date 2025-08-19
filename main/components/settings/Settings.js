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
}

export const getSettings = (key) => {
    return El.settings.getAttribute(SETTINGS)[key]
}

/*

usage:
 0) on `component` init, use `Store.get(ST.KEY_NAME)` to get the settings settings
 1) buttons/interactions should use - 
    El.settings.setAttribute(SETTINGS, {
        ST.`KEY NAME`: `VALUE`
    })
 2) settings is saved in persistent storage
 3) an event is fired,
    use
    El.events.addEventListener(EV.SETTINGS, this.onSettingsChange)
    to implement your logic

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