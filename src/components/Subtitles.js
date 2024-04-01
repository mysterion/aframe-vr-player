import { El } from "../main";
import { createEl, setAttr } from "../utils";

import srtParser2 from "srt-parser-2";
import { EV } from "./Events";
import { ST, getSettings } from "./settings/Settings";

const ONLY_SUBS_NEXT = 4

AFRAME.registerComponent('subtitles', {
    schema: {
        src: { type: 'string', default: '' }
    },

    init: function () {
        console.log('subs initialized')
        this.parser = new srtParser2()
        this.updateSubtitle = AFRAME.utils.bind(this.updateSubtitle, this)
        this.getAndPopulateSubs = AFRAME.utils.bind(this.getAndPopulateSubs, this)
        this.onlySubsHandlers = AFRAME.utils.bind(this.onlySubsHandlers, this)
        this.onEyeChange = AFRAME.utils.bind(this.onEyeChange, this)
        this.bg = this.el.children[0]
        setAttr(this.bg, {
            geometry: 'primitive: plane',
            material: 'color: black; opacity: 0.5;'
        })
        this.onlySubsON = false
        this.onlySubsBtn = createEl('a-entity', {
            geometry: 'primitive: plane; width: 10; height: 3',
            material: 'color: #808080',
            position: '21 -12 -60',
            clickable: '',
            controls: ''
        },
            [createEl('a-text', {
                value: 'SUBS SEEK',
                width: '40',
                align: 'center',
                position: '0 0 0.5'
            })]
        )

        this.onlySubsBtn.addEventListener('click', this.onlySubsHandlers)

        El.controls.appendChild(this.onlySubsBtn)
        El.video.addEventListener('timeupdate', this.updateSubtitle)
        El.events.addEventListener(EV.SETTINGS, this.onEyeChange)

        this.subtitles = []
    },

    update: function (od) {
        if (this.data.src !== od.src) {
            this.getAndPopulateSubs(this.data.src)
            this.onEyeChange({
                detail: {
                    [ST.DEF_EYE]: getSettings(ST.DEF_EYE)
                }
            })
        }
    },

    onEyeChange: function (e) {
        let eye = e.detail[ST.DEF_EYE]
        let eyeLayer = eye === 'left' ? 1 : 2
        console.log("eye changed")
        this.el.object3D.children[0].layers.set(eyeLayer)
        this.el.object3D.children[1].layers.set(eyeLayer)
        this.bg.object3D.children[0].layers.set(eyeLayer)
    },

    getAndPopulateSubs: async function (src) {
        this.subtitles = []
        const res = await fetch(src)
        const data = await res.text()
        this.subtitles = this.parser.fromSrt(data)
    },

    onlySubsHandlers: function () {
        this.onlySubsON = !this.onlySubsON

        if (this.onlySubsON) {
            setAttr(this.onlySubsBtn, {
                material: 'color: #00008b',
            })
        } else {
            setAttr(this.onlySubsBtn, {
                material: 'color: #808080',
            })
        }
    },

    updateSubtitle: function () {
        if (El.video.seeking) return
        const currentTime = El.video.currentTime
        const currentSubtitle = this.subtitles.find(subtitle => currentTime >= subtitle.startSeconds && currentTime <= subtitle.endSeconds)
        if (currentSubtitle) {
            this.el.object3D.visible = true
            this.bg.object3D.visible = true
            let lines = currentSubtitle.text.split(/\r?\n/)
            let height = lines.length
            let width = lines[0].length
            if (lines.length > 1) {
                for (let i in lines) {
                    width = Math.max(width, lines[i].length)
                }
            }
            this.latestSub = currentSubtitle
            this.el.setAttribute('value', currentSubtitle.text)
            this.bg.setAttribute('geometry', {
                height: 0.25 * height,
                width: 0.1 * (width + 2)
            })
        } else {
            this.el.object3D.visible = false
            this.bg.object3D.visible = true
            // this.el.setAttribute('value', '')
        }
        // ONLY_SUBS_NEXT = 4 seconds
        // if two subs are more than 8 seconds apart.
        // - seek-to '4 seconds before' the next sub
        if (this.onlySubsON) {
            let nextSub = this.subtitles.find(subtitle => currentTime <= subtitle.startSeconds)
            if (!this.latestSub || currentTime - this.latestSub.endSeconds > ONLY_SUBS_NEXT) {
                if (nextSub.startSeconds - currentTime >= ONLY_SUBS_NEXT) {
                    El.video.currentTime = nextSub.startSeconds - ONLY_SUBS_NEXT
                }
            }
        }
    },

    remove: function () {
        El.controls.appendChild(this.onlySubsBtn)
        El.video.removeEventListener('timeupdate', this.updateSubtitle)
        this.bg.object3D.visible = false
    },

});