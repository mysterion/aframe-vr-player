import { El } from '../../main'
import { createEl, getFileName } from '../../utils'
import { V_FILE_GET_URL, V_LISTING_URL } from '../Consts'
import { C_VID_STATE } from '../VideoState'
import { DHeight, DWidth, isVideo } from './Utils'

export const C_FILES = 'dialog-files'
const itemLimit = 7
const space = -DHeight * 0.11
const initialPosition = DHeight * 0.28

AFRAME.registerComponent(C_FILES, {
    schema: {
        url: { type: 'string', default: '' },
        reRender: { type: 'string', default: '' }
    },

    init: function () {
        let el = this.el
        el.setAttribute('geometry', `primitive: plane; width: ${DWidth}; height: ${DHeight}`)
        el.setAttribute('material', 'color: teal')
        el.setAttribute('dialog-utils', { 'screen': C_FILES })
        el.object3D.visible = true

        this.offset = {}

        this.fetchFiles = AFRAME.utils.bind(this.fetchFiles, this)
        this.insertFolderUI = AFRAME.utils.bind(this.insertFolderUI, this)
        this.renderFiles = AFRAME.utils.bind(this.renderFiles, this)
    },

    update: function (od) {
        var d = this.data
        var el = this.el
        if (d.reRender && d.reRender.length > 0) {
            el.setAttribute('dialog-utils', { 'screen': C_FILES })
            el.setAttribute(C_FILES, { reRender: '' })
            return
        }
        if (d.url !== od.url) {
            this.fetchFiles(this.el, d.url)
        } else {
            this.renderFiles()
        }
    },

    fetchFiles: async function (el, url) {
        el.setAttribute('dialog-loading', '')
        let res = await fetch(V_LISTING_URL + "/" + url)
        let { files, folders } = await res.json()
        this.files = files.filter((file) => isVideo(file))
        this.allFiles = files
        this.folders = folders
        // TODO: add error handling screen for server builds
        el.removeAttribute('dialog-loading')
        this.renderFiles()
    },


    renderFiles: function () {

        const el = this.el
        const url = this.data.url

        el.replaceChildren()
        el.setAttribute('clickable', '')
        el.object3D.visible = true

        let offsetFiles = this.offset[url]?.files ?? 0
        let offsetFolders = this.offset[url]?.folders ?? 0

        // files 
        let pos = initialPosition
        for (let i = offsetFiles; i < offsetFiles + itemLimit; i++) {
            if (i < this.files.length) {
                let tile = createEl("a-plane", {
                    "geometry": `width: ${DWidth * 0.40}; height: ${DHeight * 0.1}`,
                    "material": "color: #801D9F;",
                    "position": `-${DWidth * 0.25} ${pos} 1`,
                    "clickable": "",
                    "button-highlight": "",
                    "marq-text": `value:${getFileName(this.files[i])}; limit:30`,
                }, [], el)
                tile.onclick = async () => {
                    let src = V_FILE_GET_URL + url + "/" + this.files[i]

                    El.videoState.setAttribute(C_VID_STATE, {
                        src: src,
                        fileName: this.files[i]
                    })

                    let subName = this.files[i].substr(0, this.files[i].lastIndexOf('.')) + '.srt'
                    let sub = this.allFiles.find((f) => f === subName)
                    if (sub) {
                        El.subtitles.setAttribute('subtitles', `src: ${V_FILE_GET_URL + url + "/" + sub}`)
                    } else {
                        El.subtitles.removeAttribute('subtitles')
                    }

                }
                pos += space
            }
        }

        // folders
        pos = initialPosition
        for (let i = offsetFolders; i < offsetFolders + itemLimit; i++) {
            if (i < this.folders.length) {
                let tile = createEl("a-plane", {
                    "geometry": `width: ${DWidth * 0.2}; height: ${DHeight * 0.1}`,
                    "material": "color: #C39807;",
                    "position": `${DWidth * 0.35} ${pos} 1`,
                    "clickable": "",
                    "button-highlight": "",
                    "marq-text": `value:${getFileName(this.folders[i])}; limit:14`,
                }, [], el)
                tile.onclick = () => {
                    el.setAttribute(C_FILES, { 'url': url + "/" + this.folders[i] })
                    console.log("going : ", url + "/" + this.folders[i])
                }
                pos += space
            }
        }

        this.insertFolderUI()
    },


    insertFolderUI: function () {

        const el = this.el
        const url = this.data.url

        let offsetFiles = this.offset[url]?.files ?? 0
        let offsetFolders = this.offset[url]?.folders ?? 0

        let p = el.getAttribute("geometry")

        createEl("a-plane", {
            "geometry": `primitive:plane; width:${p.width}; height: 3`,
            "position": `0 ${p.height / 2} 0.2`,
            "material": "color: #808080",
        }, [
            createEl('a-entity', {
                text: `value: folder:/${url}; align: center; width: 30;`,
                position: '0 0 0.2'
            })
        ], el)

        createEl("a-image", {
            'src': "#asset-movie-icon",
            'position': `-${p.width / 2} 0 0.1`,
            'background-color': "blue",
            'scale': "4 4 1"
        }, [], el)
        createEl("a-image", {
            'src': "#asset-folder",
            'position': `${p.width / 2} 0 0.1`,
            'background-color': "blue",
            'scale': "4 4 1"
        }, [], el)

        let refreshBtn = createEl("a-image", {
            "src": "#asset-refresh",
            "scale": "3 3 1",
            "position": `${p.width * 0.05} ${p.height * 0.6} 0.3`,
            "clickable": "",
            "button-highlight": "",
        }, [], el)
        refreshBtn.addEventListener("click", () => {
            this.fetchFiles(el, url)
        })

        let backBtn = createEl("a-image", {
            "src": "#asset-back",
            "scale": "3 3 1",
            "position": `-${p.width * 0.05} ${p.height * 0.6} 0.3`,
            "clickable": "",
            "button-highlight": "",
        }, [], el)
        backBtn.addEventListener("click", () => {
            el.setAttribute(C_FILES, {
                url: url.substr(0, url.lastIndexOf('/'))
            })
        })

        if (this.files.length > itemLimit) {
            if (offsetFiles != 0) {
                let filesUpBtn = createEl("a-image", {
                    "src": "#asset-up",
                    "scale": "3 3 1",
                    "position": `-${p.width * 0.25} ${p.height * 0.4} 0.2`,
                    "clickable": "",
                    "button-highlight": "",
                }, [], el)
                filesUpBtn.addEventListener("click", () => {
                    this.offset = {
                        ...this.offset,
                        [url]: {
                            files: offsetFiles - itemLimit,
                            folders: offsetFolders
                        }
                    }
                    this.renderFiles()
                })
            }
            if (offsetFiles + itemLimit < this.files.length) {
                let filesDownBtn = createEl("a-image", {
                    "src": "#asset-up",
                    "scale": "3 -3 1",
                    "position": `-${p.width * 0.25} -${p.height * 0.5} 0.2`,
                    "clickable": "",
                    "button-highlight": "",
                }, [], el)
                filesDownBtn.addEventListener("click", () => {
                    this.offset = {
                        ...this.offset,
                        [url]: {
                            files: offsetFiles + itemLimit,
                            folders: offsetFolders
                        }
                    }
                    this.renderFiles()
                })
            }
        }

        if (this.folders.length > itemLimit) {
            if (offsetFolders != 0) {
                let foldersUpBtn = createEl("a-image", {
                    "src": "#asset-up",
                    "scale": "3 3 1",
                    "position": `${p.width * 0.35} ${p.height * 0.4} 0.2`,
                    "clickable": "",
                    "button-highlight": "",
                }, [], el)
                foldersUpBtn.addEventListener("click", () => {
                    this.offset = {
                        ...this.offset,
                        [url]: {
                            files: offsetFiles,
                            folders: offsetFolders - itemLimit
                        }
                    }
                    this.renderFiles()
                })
            }
            if (offsetFolders + itemLimit < this.folders.length) {
                let foldersDownBtn = createEl("a-image", {
                    "src": "#asset-up",
                    "scale": "3 -3 1",
                    "position": `${p.width * 0.35} -${p.height * 0.5} 0.2`,
                    "clickable": "",
                    "button-highlight": "",
                }, [], el)
                foldersDownBtn.addEventListener("click", () => {
                    this.offset = {
                        ...this.offset,
                        [url]: {
                            files: offsetFiles,
                            folders: offsetFolders + itemLimit
                        }
                    }
                    this.renderFiles()

                })
            }
        }
    },

    remove: function () {
        let el = this.el
        el.replaceChildren()
        el.removeAttribute('clickable')
        el.setAttribute('dialog-utils', { 'screen': '' })
    }
});