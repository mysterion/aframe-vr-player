import { El } from "../../main.js";
import { Store } from "../../store.js";
import { createEl, setAttr } from "../../utils.js";

AFRAME.registerComponent('btn-vol', {
    schema: {
        vol: { type: 'number', default: 1 }
    },
    init: function () {
        let el = this.el
        this.setVolume = AFRAME.utils.bind(this.setVolume, this)

        let width = this.width = 10
        setAttr(el, {
            geometry: {
                primitive: 'plane',
                width: width + 1,
                height: 5,
            },
            material: 'color: #808080'
        })

        let txt = this.txt = createEl('a-text', {
            'width': 40,
            'align': 'center',
            'value': '100',
            'position': '0 0 0.3',

        })
        el.appendChild(txt)

        let bar = this.bar = createEl('a-entity', {
            material: 'color: #005073',
            geometry: `primitive: plane;width: width;height: 4;`
        })
        el.appendChild(bar)

        el.addEventListener('click', (e) => {
            this.setVolume(e.detail.intersection.uv.x)
        });

        this.setVolume(Store.get('volume') ?? 1)
    },
    setVolume: function (i) {
        if (i >= 0.9) i = 1
        if (i <= 0.1) i = 0.1
        let q = this.width * i
        let p = q / 2
        El.video.volume = i
        Store.set('volume', i)
        this.txt.setAttribute('value', `${Math.round(El.video.volume * 100)}`)
        this.bar.setAttribute('position', `${p - this.width / 2} 0 0.2`)
        this.bar.setAttribute('geometry', { 'width': q })
    }
});