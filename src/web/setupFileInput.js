import { C_VID_STATE } from "../components/VideoState";
import { E } from "../main";

export function setupWebFileInput() {
    function handleFileSelect(event) {
        const fileInput = event.target;
        const file = fileInput.files[0];
        if (file) {
            E.ascene.setAttribute(C_VID_STATE, {
                src: URL.createObjectURL(file),
                fileName: file.name
            })
        }
    }
    E.file.addEventListener('change', handleFileSelect)
}