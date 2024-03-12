import { get, set } from "idb-keyval"

async function verifyPermission(fileHandle) {
    const options = { mode: 'read' };

    if ((await fileHandle.queryPermission(options)) === 'granted') {
        return true;
    }

    if ((await fileHandle.requestPermission(options)) === 'granted') {
        return true;
    }

    return false;
}

async function getOrCreateDirHandler() {
    try {
        let h = await get('fs')
        if (h) {
            await verifyPermission(h)
            return h
        }
        h = await window.showDirectoryPicker()
        await set('fs', h)
        return h
    } catch (err) {
        console.error(err)
    }

}

export async function getFolderFromFS(url) {
    let path = url.split('/').slice(1)
    let cd = await getOrCreateDirHandler()
    for (let i in path) {
        cd = await cd.getDirectoryHandle(path[i])
    }
    let promises = [];
    for await (const entry of cd.values()) {
        promises.push(entry);
    }
    promises = await Promise.all(promises);
    let files = [], folders = [], fileHandles = []
    for (let i in promises) {
        if (promises[i].kind === 'file') {
            files.push(promises[i].name)
            fileHandles.push(promises[i])
        } else {
            folders.push(promises[i].name)
        }
    }
    return { files, folders, fileHandles }
}