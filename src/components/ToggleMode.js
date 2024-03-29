// import { El } from "../main";



// // settings -> save preset  ON -> applysettings -> applysettingsvideo(listens on videostate for changes) -> videostate <- toggleMode
// AFRAME.registerComponent('toggle-mode', {
//     init: function () {
//         this.el.addEventListener('click', () => {
//             let preset = El.ascene.getAttribute(C_VID_STATE).preset
//             // console.log(preset, (preset + 1) % videoPresets.length, videoPresets.length)
//             El.ascene.setAttribute(C_VID_STATE, { preset: (preset + 1) % videoPresets.length })
//         })
//         El.ascene.addEventListener(C_VID_STATE, (e) => {
//             let d = e.detail.data
//             this.el.children[0].setAttribute("value", videoPresets[d.preset].text)
//         })
//     }
// });