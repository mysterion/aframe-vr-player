import { Store } from "../../store"
import { videoPresets } from "../VideoState";

import { C_AS_VIDEO } from "./ApplySettingsVideo";

export const C_APPLY_SETTINGS = 'apply-settings'

AFRAME.registerComponent(C_APPLY_SETTINGS, {
    schema: {
        resumeVideo: { type: 'boolean', default: true },
        defaultPreset: { type: 'number', default: 0 },
        savePreset: { type: 'boolean', default: true }
    },

    init: function () {
        let el = this.el
        let settings = Store.get('settings')
        if (!settings) {
            settings = this.data
            Store.set('settings', settings)
        } else {
            el.setAttribute(C_APPLY_SETTINGS, settings)
        }
    },

    update: function (od) {
        let el = this.el
        let d = this.data

        el.setAttribute(C_AS_VIDEO, { time: d.resumeVideo })
        el.setAttribute(C_AS_VIDEO, { defaultPreset: d.defaultPreset })
        el.setAttribute(C_AS_VIDEO, { savePreset: d.savePreset })
        Store.set('settings', d)
    },
});