<div align="center">
<img src="assets/icon_130x130.png" alt="Aerial webOS logo" width="200">
<br><h1>Aerial webOS screensaver (fork of <a href="https://github.com/aabytt/custom-screensaver-aerial">custom-screensaver-aerial</a>)</h1>
   
<a href="https://github.com/rchalaaa/custom-screensaver/releases/latest"><img src="https://img.shields.io/github/v/release/rchalaaa/custom-screensaver?style=flat-square" alt="Latest release"/></a>

</div>

## What's new in this fork

- [190+ aerial videos](https://aabytt.github.io/aerial-preview/) from different sources.
- Modern TV-friendly configuration UI without Enyo/Moonstone.
- One-click enable/disable with reboot persistence.
- 40+ locales for OSD.
- Source type selection, including FullHD/4K SDR and Dolby Vision.
- OSD controls for language, opacity, fields, and custom fonts.
- Requires root and Homebrew channel
- Compatible with webOS 5 (2020), webOS 6 (2021), webOS 22 (2022), webOS 23 (2023)

## Disclaimer

- App replaces original webOS screensaver. Use at your own risk.

## Features

- Enable or disable the custom screensaver from a single setting.
- Automatically applies or unapplies the screensaver whenever the app opens.
- Automatically manages the Homebrew boot script for persistence after reboot.
- Launch screensaver immediately for testing
- Custom OSD fonts: add `.ttf` or `.otf` files to `assets/`, then rebuild so they appear in the UI.

## How to install

### Method 1, using webos dev manager:

1. Download the ipk file from the releases.
2. Download [webos-dev-manager](https://github.com/webosbrew/dev-manager-desktop), and open it
3. Press add device
4. Fill in your TVs information, Authentication Method should be `password`, Username should be `root`, and password should be `alpine`. The host address is the IP address of the TV.
5. In the `Apps` menu, click the Install button in the upper right corner.
6. Choose the ipk file you downloaded earlier.
7. The app should now be installed and should show up in the list. Press Launch to launch it

### Method 2, using the webos CLI:

1. Download the ipk file from the releases.
2. Install the [webos CLI](https://webostv.developer.lge.com/develop/tools/cli-installation)
3. Run the following command with the CLI, but with the IP address of your tv, and a device name: `ares-setup-device --add deviceName -i "host=ip_address" -i "port=22" -i "username=root" -i "password=alpine"`
   For example: `ares-setup-device --add livingRoomTV -i "host=192.168.1.129" -i "port=22" -i "username=root" -i "password=alpine"`
4. Run this command, with the path of the ipk file, to install it. `ares-install --device deviceName /path/to/file.ipk`
5. The app should now be installed. Run `ares-launch --device deviceName org.webosbrew.inputhook` to launch it.

## How to build

1. Clone the repository
2. Run the following commands (assuming PNPM is installed):

```
pnpm install
pnpm run build
pnpm run package
```

3. This will produce an ipk file. See the instructions above for installing it.

## Screenshots

![Main](https://github.com/aabytt/custom-screensaver-aerial/assets/84480313/77daf2da-b528-41ba-8377-fff70e6e1fd3)
![Screenshot](https://github.com/aabytt/custom-screensaver-aerial/assets/84480313/166f43e7-a3cf-4035-975a-931f282f5655)
![Settings](https://github.com/aabytt/custom-screensaver-aerial/assets/84480313/1b7f281b-efdc-4eed-b0f2-b06f4bd5929a)

## Credits

https://github.com/aabytt/custom-screensaver-aerial - Original fork, from where the app was refactorized
