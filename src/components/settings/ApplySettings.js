import { Store } from "../../store"

import { C_AS_RES_VID } from "./ResumeVideo";

export const C_APPLY_SETTINGS = 'apply-settings'

AFRAME.registerComponent(C_APPLY_SETTINGS, {
    schema: {
        resumeVideo: { type: 'string', default: 'ON' }
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

        if (d.resumeVideo === 'ON') {
            el.setAttribute(C_AS_RES_VID, '')
        } else {
            el.removeAttribute(C_AS_RES_VID)
        }

        Store.set('settings', d)
    },
});