import { E } from "../../main";
import { Store } from "../../store"
import { getElem, isObjectEmpty } from "../../utils";

import { C_AS_VIDEO } from "./ApplySettingsVideo";

export const C_APPLY_SETTINGS = 'apply-settings'

AFRAME.registerComponent(C_APPLY_SETTINGS, {
    schema: {
        resumeVideo: { type: 'boolean', default: true },
        defaultPreset: { type: 'number', default: 0 },
        savePreset: { type: 'boolean', default: true },
        defaultEye: { type: 'string', default: 'left' },
        viewAngle: { type: 'number', default: 0 },
    },

    init: function () {
        let el = this.el
        let settings = Store.get('settings')
        if (!settings) {
            settings = this.data
            Store.set('settings', settings)
        } else {
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
            //
            el.setAttribute(C_APPLY_SETTINGS, settings)
        }
    },

    update: function (od) {
        let el = this.el
        let d = this.data

        el.setAttribute(C_AS_VIDEO, { time: d.resumeVideo })
        el.setAttribute(C_AS_VIDEO, { defaultPreset: d.defaultPreset })
        el.setAttribute(C_AS_VIDEO, { savePreset: d.savePreset })
        getElem('camera').setAttribute('stereocam', { eye: d.defaultEye })
        getElem('env').setAttribute('env-manager', { defaultEye: d.defaultEye })
        E.env.setAttribute('env-manager', { viewAngle: d.viewAngle })
        this.el.emit(C_APPLY_SETTINGS, d, false)
        Store.set('settings', d)
    },
});