import { Parser } from "../libs/srt-parser2.js";
import { El } from "../main.js";
import { createEl, setAttr } from "../utils.js";

import { EV } from "./Events.js";
import { ST, getSettings } from "./settings/Settings.js";

const SEEK_NEXT_THRESH = 2

AFRAME.registerComponent('subtitles', {
    schema: {
        src: { type: 'string', default: '' }
    },

    init: function () {
        this.parser = new Parser()
        
        this.updateSubtitle = AFRAME.utils.bind(this.updateSubtitle, this)

        this.subsBtnHandler = AFRAME.utils.bind(this.subsBtnHandler, this)
        this.seekBtnHandler = AFRAME.utils.bind(this.seekBtnHandler, this)

        this.getAndPopulateSubs = AFRAME.utils.bind(this.getAndPopulateSubs, this)
        this.onEyeChange = AFRAME.utils.bind(this.onEyeChange, this)
        this.bg = this.el.children[0]

        setAttr(this.bg, {
            geometry: 'primitive: plane',
            material: 'color: black; opacity: 0.5;'
        })

        this.seekON = false
        this.subsON = true

        this.seekBtn = createEl('a-entity', {
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

        this.subsBtn = createEl('a-entity', {
            geometry: 'primitive: plane; width: 10; height: 3',
            material: 'color: #808080',
            position: '21 -18 -60',
            clickable: '',
            controls: '',
            'button-highlight': ''
        },
            [createEl('a-text', {
                value: "ON",
                width: '40',
                align: 'center',
                position: '0 0 0.5'
            })],
        )

        this.subsBtn.addEventListener('click', this.subsBtnHandler)

        this.nextSeek = -2

        this.seekBtn.addEventListener('click', this.seekBtnHandler)

        this.updateSubtitleListening = true
        El.video.addEventListener('timeupdate', this.updateSubtitle)
        // El.video.addEventListener('seeking', () => { console.log('seeking start'), isSeeking = true })
        // El.video.addEventListener('seeked', () => { console.log('seeking fin'), isSeeking = false })

        El.controls.append(this.seekBtn, this.subsBtn)
        El.events.addEventListener(EV.SETTINGS, this.onEyeChange)

        this.subtitles = []
    },

    update: function (od) {

        if (!(this.subsON || this.seekON)) {
            this.updateSubtitleListening
            El.video.removeEventListener('timeupdate', this.updateSubtitle)
            this.updateSubtitleListening = false
        }

        if (this.subsON || this.seekON) {
            if (!this.updateSubtitleListening) {
                El.video.addEventListener('timeupdate', this.updateSubtitle)

            }

        }

        if (this.data.src !== od.src) {
            this.getAndPopulateSubs(this.data.src)
            this.onEyeChange({
                detail: {
                    [ST.DEF_EYE]: getSettings(ST.DEF_EYE)
                }
            })
        }
    },

    subsBtnHandler: function () {
        this.subsON = !this.subsON

        this.subsBtn.children[0].setAttribute('value', this.subsON ? "ON" : "OFF")
        
        if (this.subsON) {
            this.el.object3D.visible = true
        } else {
            this.el.object3D.visible = false
        }

        this.update(this.data)
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

    seekBtnHandler: function () {
        this.seekON = !this.seekON

        if (this.seekON) {
            setAttr(this.seekBtn, {
                material: 'color: #00008b',
            })
        } else {
            setAttr(this.seekBtn, {
                material: 'color: #808080',
            })
        }

        this.update(this.data)
    },

    updateSubtitle: function () {
        // console.log(new Date(), 'currentTime', El.video.currentTime, "timeupdate: rs - ", this.nextSeek);
        const currentTime = El.video.currentTime
        const currentSubtitle = this.subtitles.find(subtitle => currentTime >= subtitle.startSeconds && currentTime <= subtitle.endSeconds)

        if (currentSubtitle) {
            this.latestSub = currentSubtitle
        }

        if (this.subsON) {
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

                this.el.setAttribute('value', currentSubtitle.text)
                this.bg.setAttribute('geometry', {
                    height: 0.25 * height,
                    width: 0.1 * (width + 2)
                })
            } else {
                this.el.object3D.visible = false
                this.bg.object3D.visible = true
            }
        }
        // SEEK_NEXT_THRESH = 4 seconds
        // if two subs are more than 8 seconds apart.
        // - seek-to '4 seconds before' the next sub
        if (this.seekON) {
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
        El.controls.removeChild(this.seekBtn)
        El.controls.removeChild(this.subsBtn)
        El.video.removeEventListener('timeupdate', this.updateSubtitle)
        this.bg.object3D.visible = false
    },

});