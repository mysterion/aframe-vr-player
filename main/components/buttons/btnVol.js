import { El } from "../../elems.js";
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
        let height = this.height = 4
        setAttr(el, {
            geometry: {
                primitive: 'plane',
                width: width + 1,
                height: height + 1,
            },
            material: 'color: #808080',
            text: `value: 100; width: 40; zOffset: 0.4; align: center`,
        })
        this.bar = createEl('a-entity', {
            material: 'color: #005073',
            geometry: `primitive: plane; width: ${width}; height: ${height};`,
            position: '0 0 0.2'
        }, [], el)

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
        setAttr(this.el, {
            text: `value: ${Math.round(El.video.volume * 100)}`
        })
        setAttr(this.bar,{
                position: `${p - this.width / 2} 0 0.2`,
                geometry: { 'width': q }
        })
    }
});