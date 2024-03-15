import { E } from "../main";
import { ViewAngles } from "./env/EnvManager";
import { C_APPLY_SETTINGS } from "./settings/ApplySettings";

AFRAME.registerComponent('toggle-view-angle', {

    init: function () {
        this.i = 0
        this.el.addEventListener('click', AFRAME.utils.bind(() => {
            this.i = (this.i + 1) % ViewAngles.length
            E.ascene.setAttribute(C_APPLY_SETTINGS, { viewAngle: this.i })
        }, this))
        E.ascene.addEventListener(C_APPLY_SETTINGS, AFRAME.utils.bind((e) => {
            this.el.setAttribute('value', ViewAngles[e.detail.viewAngle ?? 0])
            this.i = e.detail.viewAngle
        }))
    }
});