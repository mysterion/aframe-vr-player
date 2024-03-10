function handleFileSelect(event) {
    const fileInput = event.target;
    const file = fileInput.files[0];
    if (file) {
        GS.video.src = URL.createObjectURL(file)
    }
}

export const openSingleFile = () => {
    GS.fileInput.click()
}

export const setUpSingleFileOpen = () => {
    GS.fileInput.addEventListener('change', handleFileSelect);
}
