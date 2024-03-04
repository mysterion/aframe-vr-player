import { GS } from "../main"

const LISTING_URL = `${import.meta.env.VITE_LISTING_URL}`
const FILE_GET_URL = `${import.meta.env.VITE_FILE_GET_URL}`
const itemLimit = 8

// State
const S = {
    url: "",
    files: [],
    folders: [],
    offset: {
        u: { files: 0, folder: 0 }
    }
}

function createIcon(src, p, position, scale) {
    let el = document.createElement("a-image")
    el.setAttribute("src", src)
    el.setAttribute("position", position)
    el.setAttribute("background-color", "blue")
    el.setAttribute("scale", scale)
    p.appendChild(el)
}

function showLoader(boo) {
    GS.loader.setAttribute("visible", boo)
    GS.loaded.setAttribute("visible", !boo)
}

export function isLoading() {
    return GS.loader.getAttribute("visible")
}

async function fetchFiles(url) {
    showLoader(true)
    if (!url) url = ""
    let res = await fetch(LISTING_URL + "/" + url)
    let { files, folders } = await res.json()
    S.files = files
    S.folders = folders
    if (!S.offset[url]) S.offset[url] = { files: 0, folders: 0 }
    renderFiles(url)
    showLoader(false)
}


function insertFolderUI(path) {
    let uri = document.createElement("a-text")
    let p = GS.loaded.getAttribute("geometry")
    uri.setAttribute("value", "folder://" + path)
    uri.setAttribute("geometry", `primitive:plane; width:${p.width}; height: 0.2`)
    uri.setAttribute("position", `0 ${p.height / 2} 0.01`)
    uri.setAttribute("material", "color: grey")
    // el.setAttribute("rotation", "20 0 0")
    uri.setAttribute("align", "center")
    uri.setAttribute("width", "2")
    GS.loaded.appendChild(uri)

    createIcon("#asset-movie-icon", GS.loaded, `-1.2 ${p.height / 2 - 0.4} 0.01`, "0.5 0.5 1")
    createIcon("#asset-folder", GS.loaded, `1.2 ${p.height / 2 - 0.4} 0.01`, "0.5 0.5 1")

    let refreshBtn = document.createElement("a-image")
    refreshBtn.setAttribute("src", "#asset-refresh")
    refreshBtn.setAttribute("scale", "0.2 0.2 1")
    refreshBtn.setAttribute("position", `-0.4 ${p.height / 2 - 0.5} 0.02`)
    refreshBtn.setAttribute("data-raycastable", "")
    refreshBtn.addEventListener("click", () => {
        fetchFiles(path)
    })
    GS.loaded.appendChild(refreshBtn)


    let backBtn = document.createElement("a-image")
    backBtn.setAttribute("src", "#asset-back")
    backBtn.setAttribute("scale", "0.2 0.2 1")
    backBtn.setAttribute("position", `0.4 ${p.height / 2 - 0.5} 0.02`)
    backBtn.setAttribute("data-raycastable", "")
    backBtn.addEventListener("click", () => {
        fetchFiles(path.substr(0, path.lastIndexOf('/')))
    })
    GS.loaded.appendChild(backBtn)

    if (S.files.length > itemLimit) {
        if (S.offset[path].files != 0) {
            let filesUpBtn = document.createElement("a-image")
            filesUpBtn.setAttribute("src", "#asset-up")
            filesUpBtn.setAttribute("scale", "0.2 0.2 1")
            filesUpBtn.setAttribute("position", `-1.2 0.725 0.02`)
            filesUpBtn.setAttribute("data-raycastable", "")
            filesUpBtn.addEventListener("click", () => {
                S.offset[path].files -= 1
                renderFiles(path)
            })
            GS.loaded.appendChild(filesUpBtn)
        }
        if (S.offset[path].files + itemLimit < S.files.length) {
            let filesDownBtn = document.createElement("a-image")
            filesDownBtn.setAttribute("src", "#asset-up")
            filesDownBtn.setAttribute("scale", "0.2 -0.2 1")
            filesDownBtn.setAttribute("position", `-1.2 ${0.725 + (itemLimit * -0.23) - 0.22} 0.02`)
            filesDownBtn.setAttribute("data-raycastable", "")
            filesDownBtn.addEventListener("click", () => {
                S.offset[path].files += 1
                renderFiles(path)
            })
            GS.loaded.appendChild(filesDownBtn)
        }
    }

    if (S.folders.length > itemLimit) {
        if (S.offset[path].folders != 0) {
            let foldersUpBtn = document.createElement("a-image")
            foldersUpBtn.setAttribute("src", "#asset-up")
            foldersUpBtn.setAttribute("scale", "0.2 0.2 1")
            foldersUpBtn.setAttribute("position", `1.2 0.725 0.02`)
            foldersUpBtn.setAttribute("data-raycastable", "")
            foldersUpBtn.addEventListener("click", () => {
                S.offset[path].folders -= 1
                renderFiles(path)
            })
            GS.loaded.appendChild(foldersUpBtn)
        }
        if (S.offset[path].folders + itemLimit < S.folders.length) {
            let foldersDownBtn = document.createElement("a-image")
            foldersDownBtn.setAttribute("src", "#asset-up")
            foldersDownBtn.setAttribute("scale", "0.2 -0.2 1")
            foldersDownBtn.setAttribute("position", `1.2 ${0.725 + (itemLimit * -0.23) - 0.22} 0.02`)
            foldersDownBtn.setAttribute("data-raycastable", "")
            foldersDownBtn.addEventListener("click", () => {
                S.offset[path].folders += 1
                renderFiles(path)
            })
            GS.loaded.appendChild(foldersDownBtn)
        }
    }

}


async function renderFiles(url) {
    GS.loaded.replaceChildren()
    S.url = url

    // files 
    let initialPosition = 0.5
    let space = -0.23
    for (let i = S.offset[url].files; i < S.offset[url].files + itemLimit; i++) {
        if (i < S.files.length) {
            let el = document.createElement("a-text")
            el.setAttribute("value", S.files[i].replace(/^.*[\\/]/, '').substring(0, 40))
            el.setAttribute("geometry", "primitive:plane; width:2; height: 0.2")
            el.setAttribute("material", "color: #801D9F;")
            el.setAttribute("position", `-1.2 ${initialPosition} 0.01`)
            el.setAttribute("align", "center")
            el.setAttribute("width", "2")
            el.setAttribute("data-raycastable", "")
            el.onclick = () => {
                GS.video.src = FILE_GET_URL + url + "/" + S.files[i]
                GS.video.play()
                console.log("playing : ", GS.video.src)
            }
            GS.loaded.appendChild(el)
            initialPosition += space
        }
    }

    // folders
    initialPosition = 0.5
    for (let i = S.offset[url].folders; i < S.offset[url].folders + itemLimit; i++) {
        if (i < S.folders.length) {
            let el = document.createElement("a-text")
            el.setAttribute("value", S.folders[i].replace(/^.*[\\/]/, ''))
            el.setAttribute("geometry", "primitive:plane; width:2; height: 0.2")
            el.setAttribute("material", "color: #C39807;")
            el.setAttribute("position", `1.2 ${initialPosition} 0.01`)
            el.setAttribute("align", "center")
            el.setAttribute("width", "2")
            el.setAttribute("data-raycastable", "")
            el.onclick = () => {
                fetchFiles(url + "/" + S.folders[i])
                console.log("going : ", url + "/" + S.folders[i])
            }
            GS.loaded.appendChild(el)
            initialPosition += space
        }
    }

    insertFolderUI(url)
}

export async function showFiles() {
    if (S.files.length === 0 && S.folders.length === 0) {
        fetchFiles()
    } else {
        renderFiles(S.url)
    }
}