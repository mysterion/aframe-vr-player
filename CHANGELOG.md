# Changelog

All notable changes to this project will be documented in this file.

## [1.5.0] - 2024-08-19

### 🐛 Bug Fixes

- Sort files in lexical order and show video files only
- Fixed subtitles and subtitle-seek

### 🚜 Refactor

- Removed island environment
- Removed fisheye 190,200 presets
- Changed `bump` -> `release` script

### ⚙️ Miscellaneous Tasks

- Removed vite. using es6 `imports` (#8)
- Upgraded to aframe 1.6.0, removed, removed aframe-extras
- Updated `README.md`

## [1.4.0] - 2024-08-05

### 🚀 Features

- Thumbnails (#7)
- Show duration on files

### 🚜 Refactor

- Server rewrite to go

### ⚙️ Miscellaneous Tasks

- Separated server code to https://github.com/mysterion/avrp/

## [1.3.2] - 2024-04-04

### 🐛 Bug Fixes

- 2d flat ui reset bug
- Exp - subtitles seek deadlock

## [1.3.1] - 2024-04-04

### 🚀 Features

- Added subtitles(experimental)

### 🐛 Bug Fixes

- Buttons visible Flat 2D on hiding UI

### 🚜 Refactor

- Files component, filter files to show videos only

## [1.3] - 2024-03-30

### 🚀 Features

- Added 2d video support with 3d backgrounds
- Toggle Ui angle
- New ui for moving ui elems
- Better view angle toggle
- Toggle controls ui angle
- Added 2D video support with beach & mountain themes

### 🐛 Bug Fixes

- VideoText and background of timeline listener

### 🚜 Refactor

- UI scale (for consistent viewing experience)
- [**breaking**] Videostate, settings, UI, event dispatch system

## [1.2.1] - 2024-03-16

### 🐛 Bug Fixes

- 190,200, FE presets
- Viewing angle controls
- FE preset artefact

## [1.2] - 2024-03-15

### 🚀 Features

- Settings - default eye added
- Viewing angle button

### 🐛 Bug Fixes

- FileInput on mobile devices

### 🚜 Refactor

- Added env to setup more presets

## [1.1] - 2024-03-12

### 🚀 Features

- Added settings ui
- More compact files ui
- Video resume & save settings(on browser)
- Mouse controls on non-vr mode
- Added settings options: save presets, default presets, resume video
- Filesystem api
- [**breaking**] Added folder access for web build

### 🚜 Refactor

- [**breaking**] Ecs codebase
- Update script

## [1.0] - 2024-03-05

### 🚀 Features

- Added support for 180SBS VR fisheye videos
- Button highlight
- Fov selection on fisheye videos
- Added cli version

### 🐛 Bug Fixes

- FilesUI select bug

### ⚙️ Miscellaneous Tasks

- Added changelog generation

<!-- generated by git-cliff -->
