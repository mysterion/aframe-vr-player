import { C_VID_STATE } from "../components/VideoState.js";
import { El } from "../elems.js";

export function setupWebFileInput() {
    function handleFileSelect(event) {
        const fileInput = event.target;
        const file = fileInput.files[0];
        if (file) {
            El.videoState.setAttribute(C_VID_STATE, {
                src: URL.createObjectURL(file),
                fileName: file.name
            })
        }
    }
    El.file.addEventListener('change', handleFileSelect)
}