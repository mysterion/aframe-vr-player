const LISTING_URL = `${import.meta.env.VITE_LISTING_URL}`
const FILE_GET_URL = `${import.meta.env.VITE_FILE_GET_URL}`
export const C_FILES = 'dialog-files'
const itemLimit = 6
const space = -0.23
const initialPosition = 0.5


function createIcon(src, parent, position, scale) {
    let el = document.createElement("a-image")
    el.setAttribute("src", src)
    el.setAttribute("position", position)
    el.setAttribute("background-color", "blue")
    el.setAttribute("scale", scale)
    parent.appendChild(el)
}

async function fetchFiles(el, url) {
    // TODO: implement filesystem api for WEB build
    el.setAttribute('dialog-loading', '')
    let res = await fetch(LISTING_URL + "/" + url)
    let { files, folders } = await res.json()
    // TODO: add error handling screen
    el.removeAttribute('dialog-loading')
    el.setAttribute(C_FILES, { filesFolders: { files, folders } })
}


function insertFolderUI(el, url, files, folders, offset) {
    let offsetFiles = offset[url]?.files ?? 0
    let offsetFolders = offset[url]?.folders ?? 0

    let uri = document.createElement("a-text")
    let p = el.getAttribute("geometry")
    uri.setAttribute("value", "folder://" + url)
    uri.setAttribute("geometry", `primitive:plane; width:${p.width}; height: 0.2`)
    uri.setAttribute("position", `0 ${p.height / 2} 0.01`)
    uri.setAttribute("material", "color: grey")
    // el.setAttribute("rotation", "20 0 0")
    uri.setAttribute("align", "center")
    uri.setAttribute("width", "2")
    el.appendChild(uri)

    createIcon("#asset-movie-icon", el, `-2.35 0 0.01`, "0.25 0.25 1")
    createIcon("#asset-folder", el, `2.35 0 0.01`, "0.25 0.25 1")

    let refreshBtn = document.createElement("a-image")
    refreshBtn.setAttribute("src", "#asset-refresh")
    refreshBtn.setAttribute("scale", "0.2 0.2 1")
    refreshBtn.setAttribute("position", `-0.3 ${p.height / 2 - 0.3} 0.02`)
    refreshBtn.setAttribute("clickable", "")
    refreshBtn.setAttribute("button-highlight", "")
    refreshBtn.addEventListener("click", () => {
        fetchFiles(el, url)
    })
    el.appendChild(refreshBtn)


    let backBtn = document.createElement("a-image")
    backBtn.setAttribute("src", "#asset-back")
    backBtn.setAttribute("scale", "0.2 0.2 1")
    backBtn.setAttribute("position", `0.3 ${p.height / 2 - 0.3} 0.02`)
    backBtn.setAttribute("clickable", "")
    backBtn.setAttribute("button-highlight", "")
    backBtn.addEventListener("click", () => {
        el.setAttribute(C_FILES, {
            url: url.substr(0, url.lastIndexOf('/'))
        })
    })
    el.appendChild(backBtn)

    if (files.length > itemLimit) {
        if (offsetFiles != 0) {
            let filesUpBtn = document.createElement("a-image")
            filesUpBtn.setAttribute("src", "#asset-up")
            filesUpBtn.setAttribute("scale", "0.2 0.2 1")
            filesUpBtn.setAttribute("position", `-1.2 0.75 0.02`)
            filesUpBtn.setAttribute("clickable", "")
            filesUpBtn.setAttribute("button-highlight", "")
            filesUpBtn.addEventListener("click", () => {
                el.setAttribute(C_FILES, {
                    offset: {
                        ...offset,
                        [url]: {
                            files: offsetFiles - itemLimit / 2,
                            folders: offsetFolders
                        }
                    }
                })
            })
            el.appendChild(filesUpBtn)
        }
        if (offsetFiles + itemLimit < files.length) {
            let filesDownBtn = document.createElement("a-image")
            filesDownBtn.setAttribute("src", "#asset-up")
            filesDownBtn.setAttribute("scale", "0.2 -0.2 1")
            filesDownBtn.setAttribute("position", `-1.2 ${initialPosition + 0.2 + (itemLimit * space) + (space - 0.01)} 0.02`)
            filesDownBtn.setAttribute("clickable", "")
            filesDownBtn.setAttribute("button-highlight", "")
            filesDownBtn.addEventListener("click", () => {
                el.setAttribute(C_FILES, {
                    offset: {
                        ...offset,
                        [url]: {
                            files: offsetFiles + itemLimit / 2,
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
            let foldersUpBtn = document.createElement("a-image")
            foldersUpBtn.setAttribute("src", "#asset-up")
            foldersUpBtn.setAttribute("scale", "0.2 0.2 1")
            foldersUpBtn.setAttribute("position", "1.2 0.75 0.02")
            foldersUpBtn.setAttribute("clickable", "")
            foldersUpBtn.setAttribute("button-highlight", "")
            foldersUpBtn.addEventListener("click", () => {
                el.setAttribute(C_FILES, {
                    offset: {
                        ...offset,
                        [url]: {
                            files: offsetFiles,
                            folders: offsetFolders - itemLimit / 2
                        }
                    }
                })
            })
            el.appendChild(foldersUpBtn)
        }
        if (offsetFolders + itemLimit < folders.length) {
            let foldersDownBtn = document.createElement("a-image")
            foldersDownBtn.setAttribute("src", "#asset-up")
            foldersDownBtn.setAttribute("scale", "0.2 -0.2 1")
            foldersDownBtn.setAttribute("position", `1.2 ${initialPosition + 0.2 + (itemLimit * space) + (space - 0.01)} 0.02`)
            foldersDownBtn.setAttribute("clickable", "")
            foldersDownBtn.setAttribute("button-highlight", "")
            foldersDownBtn.addEventListener("click", () => {
                el.setAttribute(C_FILES, {
                    offset: {
                        ...offset,
                        [url]: {
                            files: offsetFiles,
                            folders: offsetFolders + itemLimit / 2
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
    const video = document.getElementById('video')

    // files 
    let pos = initialPosition
    for (let i = offsetFiles; i < offsetFiles + itemLimit; i++) {
        if (i < files.length) {
            let tile = document.createElement("a-plane")
            tile.setAttribute("geometry", "width:2; height: 0.2")
            tile.setAttribute("material", "color: #801D9F;")
            tile.setAttribute("position", `-1.2 ${pos} 0.01`)
            tile.setAttribute("clickable", "")
            tile.setAttribute("button-highlight", "")
            tile.onclick = () => {
                video.src = FILE_GET_URL + url + "/" + files[i]
                video.play()
            }

            let text = document.createElement("a-text")
            text.setAttribute("value", files[i].replace(/^.*[\\/]/, '').substring(0, 40))
            text.setAttribute("align", "center")
            text.setAttribute("width", "2")

            tile.appendChild(text)
            el.appendChild(tile)
            pos += space
        }
    }

    // folders
    pos = initialPosition
    for (let i = offsetFolders; i < offsetFolders + itemLimit; i++) {
        if (i < folders.length) {
            let tile = document.createElement("a-plane")
            tile.setAttribute("geometry", "width:2; height: 0.2")
            tile.setAttribute("material", "color: #C39807;")
            tile.setAttribute("position", `1.2 ${pos} 0.01`)
            tile.setAttribute("clickable", "")
            tile.setAttribute("button-highlight", "")
            tile.onclick = () => {
                el.setAttribute(C_FILES, { 'url': url + "/" + folders[i] })
                console.log("going : ", url + "/" + folders[i])
            }

            let text = document.createElement("a-text")
            text.setAttribute("value", folders[i].replace(/^.*[\\/]/, ''))
            text.setAttribute("align", "center")
            text.setAttribute("width", "2")

            tile.appendChild(text)
            el.appendChild(tile)
            pos += space
        }
    }

    insertFolderUI(el, url, files, folders, offset)
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
        el.setAttribute('geometry', 'primitive: plane; width: 5; height: 2.1')
        el.setAttribute('material', 'color: teal')
        el.setAttribute('dialog-utils', { 'screen': C_FILES })
        el.object3D.visible = true
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
            fetchFiles(this.el, d.url)
        } else {
            renderFiles(el, d.url, d.filesFolders.files, d.filesFolders.folders, d.offset)
        }
    },

    remove: function () {
        let el = this.el
        el.replaceChildren()
        el.removeAttribute('clickable')
        el.setAttribute('dialog-utils', { 'screen': '' })
    }
});