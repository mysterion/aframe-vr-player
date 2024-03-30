import { createEl } from "../../utils";
import { DHeight, DWidth } from "./Utils";

AFRAME.registerComponent('dialog-loading', {
    schema: {

    },

    init: function () {
        let el = this.el

        let loader = this.loader = createEl('a-entity', {
            'geometry': `primitive: plane; width: ${DWidth}; height: ${DHeight}`,
            'material': 'color: teal; opacity: 0.2',
            'position': '0 0 3',
            'clickable': '',
        })
        el.appendChild(loader)

        let img = createEl('a-image', {
            'src': '#asset-loading',
            'position': '0 0 1',
            'scale': '4 4 1',
        })

        let txt = createEl('a-text', {
            'value': 'loading',
            'width': 2,
            'align': 'center',
            'position': '0 -0.5 0.1',
        })
        loader.append(img, txt)
    },

    remove: function () {
        if (this.el.contains(this.loader)) {
            this.el.removeChild(this.loader)
        }
    }
});