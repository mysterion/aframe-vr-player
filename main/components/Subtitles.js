import { Parser } from "../libs/srt-parser2.js";
import { El } from "../main.js";
import { createEl, setAttr } from "../utils.js";

import { EV } from "./Events.js";
import { ST, getSettings } from "./settings/Settings.js";

const SEEK_NEXT_THRESH = 2

AFRAME.registerComponent('subtitles', {
    schema: {
        src: { type: 'string', default: '' },
        on: { type: 'boolean', default: false }
    },

    init: function () {
        this.parser = new Parser()
        
        this.updateSubtitle = AFRAME.utils.bind(this.updateSubtitle, this)
        this.subsOnHandler = AFRAME.utils.bind(this.subsOnHandler, this)
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

        this.subsOn = createEl('a-entity', {
            geometry: 'primitive: plane; width: 10; height: 3',
            material: 'color: #808080',
            position: '21 -18 -60',
            clickable: '',
            controls: '',
            'button-highlight': ''
        },
            [createEl('a-text', {
                value: this.data.on ? "ON" : "OFF",
                width: '40',
                align: 'center',
                position: '0 0 0.5'
            })],
        )

        this.subsOn.addEventListener('click', this.subsOnHandler)

        this.nextSeek = -2

        this.onlySubsBtn.addEventListener('click', this.onlySubsHandlers)

        El.video.addEventListener('timeupdate', this.updateSubtitle)
        // El.video.addEventListener('seeking', () => { console.log('seeking start'), isSeeking = true })
        // El.video.addEventListener('seeked', () => { console.log('seeking fin'), isSeeking = false })

        El.controls.append(this.onlySubsBtn, this.subsOn)
        El.events.addEventListener(EV.SETTINGS, this.onEyeChange)

        this.subtitles = []
    },

    update: function (od) {
        this.subsOn.children[0].setAttribute('value', this.data.on ? "ON" : "OFF")
        if (this.data.src !== od.src) {
            this.getAndPopulateSubs(this.data.src)
            this.onEyeChange({
                detail: {
                    [ST.DEF_EYE]: getSettings(ST.DEF_EYE)
                }
            })
        }
    },

    subsOnHandler: function () {
        let on = !this.data.on
        this.el.setAttribute('subtitles', { on: on })
        if (on) {
            this.el.object3D.visible = true
            El.video.addEventListener('timeupdate', this.updateSubtitle)
        } else {
            this.el.object3D.visible = false
            El.video.removeEventListener('timeupdate', this.updateSubtitle)
        }
    },

    onEyeChange: function (e) {
        let eye = e.detail[ST.DEF_EYE]
        this.el.setAttribute('stereo', `eye:${eye}`)
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
        // console.log(new Date(), 'currentTime', El.video.currentTime, "timeupdate: rs - ", this.nextSeek);
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
            if (!this.latestSub || currentTime - this.latestSub.endSeconds > SEEK_NEXT_THRESH) {
                if (nextSub.startSeconds - currentTime >= SEEK_NEXT_THRESH) {
                    let pNextSeek = nextSub.startSeconds - SEEK_NEXT_THRESH
                    if (this.nextSeek - 1 <= pNextSeek && pNextSeek <= this.nextSeek + 1) {
                        // don't process
                        // console.log(this.nextSeek - 1, pNextSeek, this.nextSeek + 1)
                        return
                    }
                    this.nextSeek = pNextSeek
                    // console.log(new Date(), 'currentTime', currentTime, 'seeking called to ', nextSub.startSeconds - SEEK_NEXT_THRESH, 'rs - ', this.isSeeking)
                    El.video.currentTime = this.nextSeek
                }
            }
        }
    },

    remove: function () {
        El.controls.removeChild(this.onlySubsBtn)
        El.controls.removeChild(this.subsOn)
        El.video.removeEventListener('timeupdate', this.updateSubtitle)
        this.bg.object3D.visible = false
    },

});