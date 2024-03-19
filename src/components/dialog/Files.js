import { E } from '../../main'
import { createEl, getFileName } from '../../utils'
import { C_VID_STATE } from '../VideoState'
import { DHeight, DWidth } from './Utils'

const LISTING_URL = `${import.meta.env.VITE_LISTING_URL}`
const FILE_GET_URL = `${import.meta.env.VITE_FILE_GET_URL}`
export const C_FILES = 'dialog-files'
const itemLimit = 5
const space = -DHeight * 0.125
const initialPosition = DHeight * 0.15

async function fetchFiles(el, url) {
    el.setAttribute('dialog-loading', '')
    let res = await fetch(LISTING_URL + "/" + url)
    let { files, folders } = await res.json()
    el.setAttribute(C_FILES, { filesFolders: { files, folders } })
    // TODO: add error handling screen for web and server builds
    el.removeAttribute('dialog-loading')
}


function insertFolderUI(el, url, files, folders, offset) {
    let offsetFiles = offset[url]?.files ?? 0
    let offsetFolders = offset[url]?.folders ?? 0

    let p = el.getAttribute("geometry")
    let uri = createEl("a-plane", {
        "geometry": `primitive:plane; width:${p.width}; height: 3`,
        "position": `0 ${p.height / 2} 0.2`,
        "material": "color: #808080",
    }, [
        createEl('a-entity', {
            text: `value: folder:/${url}; align: center; width: 30;`,
            position: '0 0 0.2'
        })
    ])
    el.appendChild(uri)

    el.append(
        createEl("a-image", {
            'src': "#asset-movie-icon",
            'position': `-${p.width / 2} 0 0.1`,
            'background-color': "blue",
            'scale': "4 4 1"
        }),
        createEl("a-image", {
            'src': "#asset-folder",
            'position': `${p.width / 2} 0 0.1`,
            'background-color': "blue",
            'scale': "4 4 1"
        })
    )

    let refreshBtn = createEl("a-image", {
        "src": "#asset-refresh",
        "scale": "4 4 1",
        "position": `-${p.width * 0.1} ${p.height * 0.35} 0.3`,
        "clickable": "",
        "button-highlight": "",
    })
    refreshBtn.addEventListener("click", () => {
        this.fetchFiles(el, url)
    })

    let backBtn = createEl("a-image", {
        "src": "#asset-back",
        "scale": "4 4 1",
        "position": `${p.width * 0.1} ${p.height * 0.35} 0.3`,
        "clickable": "",
        "button-highlight": "",
    })
    backBtn.addEventListener("click", () => {
        el.setAttribute(C_FILES, {
            url: url.substr(0, url.lastIndexOf('/'))
        })
    })
    el.append(refreshBtn, backBtn)

    if (files.length > itemLimit) {
        if (offsetFiles != 0) {
            let filesUpBtn = createEl("a-image", {
                "src": "#asset-up",
                "scale": "3 3 1",
                "position": `-${p.width * 0.25} ${p.height * 0.3} 0.2`,
                "clickable": "",
                "button-highlight": "",
            })
            filesUpBtn.addEventListener("click", () => {
                el.setAttribute(C_FILES, {
                    offset: {
                        ...offset,
                        [url]: {
                            files: offsetFiles - itemLimit,
                            folders: offsetFolders
                        }
                    }
                })
            })
            el.appendChild(filesUpBtn)
        }
        if (offsetFiles + itemLimit < files.length) {
            let filesDownBtn = createEl("a-image", {
                "src": "#asset-up",
                "scale": "3 -3 1",
                "position": `-${p.width * 0.25} -${p.height * 0.5} 0.2`,
                "clickable": "",
                "button-highlight": "",
            })
            filesDownBtn.addEventListener("click", () => {
                el.setAttribute(C_FILES, {
                    offset: {
                        ...offset,
                        [url]: {
                            files: offsetFiles + itemLimit,
                            folders: offsetFolders
                        }
                    }
                })
            })
            el.appendChild(filesDownBtn)
        }
    }

    if (folders.length > itemLimit) {
        if (offsetFolders != 0) {
            let foldersUpBtn = createEl("a-image", {
                "src": "#asset-up",
                "scale": "3 3 1",
                "position": `${p.width * 0.25} ${p.height * 0.3} 0.2`,
                "clickable": "",
                "button-highlight": "",
            })
            foldersUpBtn.addEventListener("click", () => {
                el.setAttribute(C_FILES, {
                    offset: {
                        ...offset,
                        [url]: {
                            files: offsetFiles,
                            folders: offsetFolders - itemLimit
                        }
                    }
                })
            })
            el.appendChild(foldersUpBtn)
        }
        if (offsetFolders + itemLimit < folders.length) {
            let foldersDownBtn = createEl("a-image", {
                "src": "#asset-up",
                "scale": "3 -3 1",
                "position": `${p.width * 0.25} -${p.height * 0.5} 0.2`,
                "clickable": "",
                "button-highlight": "",
            })
            foldersDownBtn.addEventListener("click", () => {
                el.setAttribute(C_FILES, {
                    offset: {
                        ...offset,
                        [url]: {
                            files: offsetFiles,
                            folders: offsetFolders + itemLimit
                        }
                    }
                })
            })
            el.appendChild(foldersDownBtn)
        }
    }
}


function renderFiles(el, url, files, folders, offset) {
    el.replaceChildren()
    el.setAttribute('clickable', '')
    el.object3D.visible = true

    let offsetFiles = offset[url]?.files ?? 0
    let offsetFolders = offset[url]?.folders ?? 0

    // files 
    let pos = initialPosition
    for (let i = offsetFiles; i < offsetFiles + itemLimit; i++) {
        if (i < files.length) {
            let tile = createEl("a-plane", {
                "geometry": `width: ${DWidth * 0.40}; height: ${DHeight * 0.1}`,
                "material": "color: #801D9F;",
                "position": `-${DWidth * 0.25} ${pos} 1`,
                "clickable": "",
                "button-highlight": "",
                "marq-text": `value:${getFileName(files[i])}; limit:30`,
            })
            tile.onclick = async () => {
                let src = FILE_GET_URL + url + "/" + files[i]
                if (import.meta.env.VITE_WEB) {
                    src = URL.createObjectURL(await this.fileHandles[i].getFile())
                }
                E.ascene.setAttribute(C_VID_STATE, {
                    src: src,
                    fileName: files[i]
                })

            }
            el.appendChild(tile)
            pos += space
        }
    }

    // folders
    pos = initialPosition
    for (let i = offsetFolders; i < offsetFolders + itemLimit; i++) {
        if (i < folders.length) {
            let tile = createEl("a-plane", {
                "geometry": `width: ${DWidth * 0.40}; height: ${DHeight * 0.1}`,
                "material": "color: #C39807;",
                "position": `${DWidth * 0.25} ${pos} 1`,
                "clickable": "",
                "button-highlight": "",
                "marq-text": `value:${getFileName(folders[i])}; limit:30`,
            })
            tile.onclick = () => {
                el.setAttribute(C_FILES, { 'url': url + "/" + folders[i] })
                console.log("going : ", url + "/" + folders[i])
            }
            console.log(tile)
            el.appendChild(tile)
            pos += space
        }
    }

    this.insertFolderUI(el, url, files, folders, offset)
}

AFRAME.registerComponent(C_FILES, {
    schema: {
        url: { type: 'string', default: '' },
        filesFolders: {
            default: {
                files: [],
                folders: []
            },
            parse: function (val) {
                if (typeof val === 'object') {
                    return val
                }
                return JSON.parse(val)
            },
            stringify: function (val) {
                if (typeof val === 'string') {
                    return val
                }
                return JSON.stringify(val)
            }
        },
        offset: {
            default: {
                '': {
                    files: 0,
                    folders: 0
                }
            },
            parse: function (val) {
                if (typeof val === 'object') {
                    return val
                }
                return JSON.parse(val)
            },
            stringify: function (val) {
                if (typeof val === 'string') {
                    return val
                }
                return JSON.stringify(val)
            }
        },
        reRender: { type: 'string', default: '' }
    },

    init: function () {
        let el = this.el
        el.setAttribute('geometry', `primitive: plane; width: ${DWidth}; height: ${DHeight}`)
        el.setAttribute('material', 'color: teal')
        el.setAttribute('dialog-utils', { 'screen': C_FILES })
        el.object3D.visible = true

        this.fetchFiles = AFRAME.utils.bind(fetchFiles, this)
        this.insertFolderUI = AFRAME.utils.bind(insertFolderUI, this)
        this.renderFiles = AFRAME.utils.bind(renderFiles, this)
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
            this.renderFiles(el, d.url, d.filesFolders.files, d.filesFolders.folders, d.offset)
        }
    },

    remove: function () {
        let el = this.el
        el.replaceChildren()
        el.removeAttribute('clickable')
        el.setAttribute('dialog-utils', { 'screen': '' })
    }
});