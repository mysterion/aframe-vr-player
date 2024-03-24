import { E } from "../main";
import { C_APPLY_SETTINGS, UiAngles } from "./settings/ApplySettings";

AFRAME.registerComponent('toggle-ui-angle', {

    init: function () {
        this.i = 0
        this.el.addEventListener('click', AFRAME.utils.bind(() => {
            this.i = (this.i + 1) % UiAngles.length
            console.log(this.i)
            E.ascene.setAttribute(C_APPLY_SETTINGS, { uiAngle: this.i })
        }, this))
        E.ascene.addEventListener(C_APPLY_SETTINGS, AFRAME.utils.bind((e) => {
            this.el.children[0].setAttribute('value', UiAngles[e.detail.uiAngle ?? 0])
            this.i = e.detail.uiAngle
        }))
    }
});