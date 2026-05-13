<div align="center">
<img src="assets/icon130.png" alt="Aerial webOS logo" width="200">
<br><h1>Aerial webOS screensaver (fork of <a href="https://github.com/webosbrew/custom-screensaver">custom-screensaver</a>)</h1>
   
<a href="https://github.com/aabytt/custom-screensaver-aerial/releases/latest"><img src="https://img.shields.io/github/v/release/aabytt/custom-screensaver-aerial?style=flat-square" alt="Latest release"/></a>
<a href="https://github.com/aabytt/custom-screensaver-aerial/releases"><img src="https://img.shields.io/github/downloads/aabytt/custom-screensaver-aerial/total?style=flat-square" alt="Downloads"/></a>


</div>

What's new in this fork
-----------------------

This fork focuses on a better day-to-day experience for managing Aerial on webOS:

* Improved configuration UI designed for TV remote navigation.
* Better UX with a single enable/disable switch instead of separate autostart and temporary apply controls.
* On-screen information toggles for name, points of interest, time, date, and debug info.
* Custom OSD font support: add `.ttf` or `.otf` files to `assets/` and select them from the UI.
* More customizable overlay controls for language, opacity, video source, fallback quality, and text display.

* [190+ aerial videos](https://aabytt.github.io/aerial-preview/) from different sources.
* Modern non-Enyo configuration UI built for TV remote navigation.
* One-click enable/disable flow that applies the custom screensaver now and across reboots.
* 40+ locales for OSD.
* Source type selection (FullHD/4k SDR or Dolby Vision).
* OSD controls for opacity, shown fields, language, and bundled font files.
* Requires root and Homebrew channel
* Compatible with webOS 5 (2020), webOS 6 (2021), webOS 22 (2022), webOS 23 (2023)

Disclaimer
---------------
- App replaces original webOS screensaver. Use at your own risk. 

Features
--------

* Enable or disable the custom screensaver from a single setting.
* Automatically applies or unapplies the screensaver whenever the app opens.
* Automatically manages the Homebrew boot script for persistence after reboot.
* Launch screensaver immediately for testing
* Custom OSD fonts: add `.ttf` or `.otf` files to `assets/`, then rebuild so they appear in the UI.

Development
-----------

This fork no longer uses Enyo/Moonstone for the configuration app. The webOS app is built as a small static app:

```sh
pnpm install
pnpm run build
pnpm run package
```

`pnpm run build` creates `dist/` and generates the font selector from font files in `assets/`. `pnpm run package` creates the installable `.ipk` with `ares-package`.

Installation
------------
This should be downloadable in Homebrew Channel. Otherwise, there's an `ipk` in
GitHub releases to the right. You are on your own here.

Donate
------------
Looking for more sources or cool new features? Your support would mean the world!
* [YooMoney](https://yoomoney.ru/to/4100115685800097)

Screenshots
------------
   ![Main](https://github.com/aabytt/custom-screensaver-aerial/assets/84480313/77daf2da-b528-41ba-8377-fff70e6e1fd3)
   ![Screenshot](https://github.com/aabytt/custom-screensaver-aerial/assets/84480313/166f43e7-a3cf-4035-975a-931f282f5655)
   ![Settings](https://github.com/aabytt/custom-screensaver-aerial/assets/84480313/1b7f281b-efdc-4eed-b0f2-b06f4bd5929a)
