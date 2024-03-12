// systems
import './systems/Controls.js'

// components
import './components/Timeline.js'
import './components/StereoSphere.js'
import './components/StereoCam.js'
import './components/ButtonHighlight.js'
import './components/Recenter.js'
import './components/CursorUtil.js'
import './components/ToggleMode.js'
import './components/AdjustCamera.js'

// components:dialog
import './components/dialog/Files.js'
import './components/dialog/Settings.js'
import './components/dialog/Loading.js'
import './components/dialog/Utils.js'

// components:settings
import './components/settings/ApplySettingsVideo.js'
import './components/settings/ApplySettings.js'

// buttons
import './components/buttons/btnOpenFile.js'
import './components/buttons/btnPausePlay.js'
import './components/buttons/btnSeekBack.js'
import './components/buttons/btnSeekForw.js'
import './components/buttons/btnVol.js'
import './components/buttons/btnHideControls.js'
import './components/buttons/btnSettings.js'

if (import.meta.env.VITE_WEB) {
    function handleFileSelect(event) {
        const fileInput = event.target;
        const file = fileInput.files[0];
        const video = document.getElementById('video')
        if (file) {
            video.src = URL.createObjectURL(file)
        }
    }

    document.getElementById('fileInput').addEventListener('change', handleFileSelect)
}

export const E = {
    ascene: document.querySelector('a-scene'),
    leftEye: document.getElementById('leftEye'),
    rightEye: document.getElementById('rightEye'),
    video: document.getElementById('video'),
}