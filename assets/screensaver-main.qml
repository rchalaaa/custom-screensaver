/*
 * Aerial screensaver.
 *
 * Usage:
 *   mount --bind ./screensaver-main.qml /usr/palm/applications/com.webos.app.screensaver/qml/main.qml
 *
 * Test launch (no way to trigger on "No signal" screen)
 *   luna-send -n 1 'luna://com.webos.service.tvpower/power/turnOnScreenSaver' '{}'
 */
import QtQuick 2.4
import QtMultimedia 5.6
import Eos.Window 0.1
import Eos.Items 0.1
import WebOS.Global 1.0
import QtQuick.Window 2.2
import QtQuick.Layouts 1.3
import WebOSServices 1.0
import iLib 1.0 as I

WebOSWindow {
    id : window
    width : 1920
    height : 1080
    windowType : "_WEBOS_WINDOW_TYPE_SCREENSAVER"
    color : "black"
    appId : "com.webos.app.screensaver"
    visible : true
    property var poi
    property var poiIndex: 0
    property var settings
    property var playList
    property int randomIndex
    property int stalledCounter : 0
    property string sourceAlt
    property string basePath : "file:///media/developer/apps/usr/palm/applications/org.aabytt.webos.custom-screensaver-aerial/assets/"
    Component.onCompleted : {
        init()
        notificationsService.set('disable')
        playRandomVideo()
    }
    I.ILib {
        id : ilib
    }
    FontLoader {
        id : osdFontLoader
        source : basePath + (settings && settings.osdFontFile ? settings.osdFontFile : 'SegoeUI-Light.ttf')
    }
    function osdFontFamily() {
        return osdFontLoader.name
    }
    Timer {
        id : refreshOSD
        interval : 1000
        running : true
        repeat : true
        onTriggered : {
            checkError()
            checkStatus()
            updateOSD()
        }
    }
    Video {
        id : videoOutput
        fillMode : VideoOutput.PreserveAspectCrop
        width : parent.width
        height : parent.height - 1 // non fullscreen to avoid screensaver automatic disabling
        source : ""
        visible : true
        autoPlay : true
        onStopped : {
            punchThroughArea.visible = false
            osd.visible = false
            fadeOutVideo.running = false
        }
        onPaused : {
            punchThroughArea.visible = false
            playRandomVideo()
            osd.visible = false
            fadeOutVideo.running = false
        }
        onPlaying : {
            punchThroughArea.visible = true
            fadeInVideo.running = true
            fadeInOsd.running = true
            osd.visible = true
        }
        PunchThrough {
            id : punchThroughArea
            visible : false
            x : 0
            y : 0
            z : -1
            width : parent.width
            height : parent.height
            Rectangle {
                id : opacityBox
                width : 1920
                height : 1080
                z : 1
                color : "black"
                OpacityAnimator {
                    id : fadeInVideo
                    target : opacityBox
                    from : 1
                    to : 0
                    duration : 3000
                    running : false
                }
                OpacityAnimator {
                    id : fadeOutVideo
                    target : opacityBox
                    from : 0
                    to : 1
                    duration : 5000
                    running : false
                }
            }
        }
    }
    Rectangle {
    id : osd
    opacity : 0
    visible : true
    color : "transparent"
    anchors.fill : parent
    anchors.margins : 50

    OpacityAnimator {
        id : fadeInOsd
        target : osd
        from : 0
        to : 1
        duration : 3000
        running : false
    }

    OpacityAnimator {
        id : fadeOutOsd
        target : osd
        from : 1
        to : 0
        duration : 5000
        running : false
    }

    RowLayout {
        anchors.left : parent.left
        anchors.right : parent.right
        anchors.bottom : parent.bottom

        spacing : 0

        ColumnLayout {
            id : leftColumn
            Layout.alignment: Qt.AlignLeft | Qt.AlignBottom
            Layout.fillWidth: true
            spacing : 2

            Text {
                id : name
                Layout.fillWidth: true
                Rectangle {
                    anchors.fill : parent
                    color : "#66ff0000"
                    z : -1
                }
                opacity : settings.osdOpacity / 100
                visible : settings ? (settings.showName !== false) : true
                text : poi.strings[playList.assets[randomIndex].localizedNameKey]
                font.family : osdFontFamily()
                font.letterSpacing : -1
                font.pixelSize : 54
                fontSizeMode : Text.Fit
                color : "white"
                style : Text.Raised
                styleColor : "black"
                elide : Text.ElideRight
            }

            Text {
                id : poiOSD
                Layout.fillWidth: true
                Rectangle {
                    anchors.fill : parent
                    color : "#6600ff00"
                    z : -1
                }
                opacity : name.opacity
                visible : settings ? (settings.showPoi !== false) : true
                text : poi.strings[playList.assets[randomIndex].pointsOfInterest[poiIndex]]
                font.family : name.font.family
                font.letterSpacing : name.font.letterSpacing
                font.pixelSize : name.font.pixelSize - 10
                fontSizeMode : name.fontSizeMode
                color : name.color
                style : name.style
                styleColor : name.styleColor
                elide : Text.ElideRight
            }
        }

        ColumnLayout {
            id : rightColumn
            Layout.alignment: Qt.AlignRight | Qt.AlignBottom
            spacing : 2

            Text {
                id : timeOSD
                Layout.alignment: Qt.AlignRight
                Rectangle {
                    anchors.fill : parent
                    color : "#660000ff"
                    z : -1
                }
                opacity : name.opacity
                visible : settings ? (settings.showTime !== false) : true
                font.family : name.font.family
                font.letterSpacing : name.font.letterSpacing
                font.pixelSize : name.font.pixelSize + 36
                fontSizeMode : name.fontSizeMode
                color : name.color
                style : name.style
                styleColor : name.styleColor
                horizontalAlignment : Text.AlignRight
            }

            Text {
                id : dateOSD
                Layout.alignment: Qt.AlignRight
                Rectangle {
                    anchors.fill : parent
                    color : "#66ffff00"
                    z : -1
                }
                opacity : name.opacity
                visible : settings ? (settings.showDate !== false) : true
                font.family : name.font.family
                font.letterSpacing : name.font.letterSpacing
                font.pixelSize : name.font.pixelSize - 10
                fontSizeMode : name.fontSizeMode
                color : name.color
                style : name.style
                styleColor : name.styleColor
                horizontalAlignment : Text.AlignRight
            }
        }
    }
}
    Text {
        id : debug
        visible : settings.debug
        horizontalAlignment : Text.AlignRight
        anchors.right : parent.right
        anchors.margins : 25
        opacity : 0.7
        font.family : name.font.family
        font.pixelSize : name.font.pixelSize - 30
        color : name.color
        style : name.style
        styleColor : name.styleColor
        fontSizeMode : name.fontSizeMode
    }
    function init() {
        loadJSONData(basePath + 'settings.json', 'settings', loadResources)
    }
    function loadResources() {
        loadJSONData(basePath + 'videos.json', 'playList')
        loadJSONData(basePath + 'locales/' + settings.localeLang + '.json', 'poi', playRandomVideo)
    }
    function playRandomVideo() {
        stalledCounter = 0
        randomIndex = Math.floor(Math.random() * playList.assets.length)
        if (!playList.assets[randomIndex].viewed) {
            if (playList.assets[randomIndex][settings.sourceType]) {
                sourceAlt = ""
                videoOutput.source = playList.assets[randomIndex][settings.sourceType]
                    notificationsService.set('disable')
                    videoOutput.play()
            } else if(settings.sourceType == "url-4K-HDR" && settings.playLowerQuality){
                sourceAlt = " - n/a, trying url-4K-SDR"
                videoOutput.source = playList.assets[randomIndex]["url-4K-SDR"]
                    videoOutput.play()
            } else if(settings.sourceType == "url-1080-HDR" && settings.playLowerQuality){
                if(playList.assets[randomIndex]["url-1080-SDR"]){
                    sourceAlt = " - n/a, trying url-1080-SDR"
                    videoOutput.source = playList.assets[randomIndex]["url-1080-SDR"]
                    videoOutput.play()
                } else if(playList.assets[randomIndex]["url-1080-H264"]){
                    sourceAlt = " - n/a, trying url-1080-H264"
                    videoOutput.source = playList.assets[randomIndex]["url-1080-H264"]
                    videoOutput.play()
                } else playRandomVideo() 
            } else playRandomVideo() 
        } else 
            playRandomVideo()
    }

    function checkError() {
        if (videoOutput.error !== 0) {
            notificationsService.set('enable')
            punchThroughArea.visible = false
            playRandomVideo()
        }
    }

    function checkStatus() {
        if (videoOutput.position > 2000) {
            notificationsService.set('enable')
            playList.assets[randomIndex].viewed = true
        }
        if (Math.floor(videoOutput.position / 1000) == Math.floor(videoOutput.duration / 1000) - 5) {
            fadeOutVideo.running = true
            fadeOutOsd.running = true
        }
        if (videoOutput.status == MediaPlayer.EndOfMedia) 
            playRandomVideo()
        if (videoOutput.status === 1) 
            var status = 'NoMedia'
        else if (videoOutput.status === 2) {
            var status = 'Loading'
            stalledCounter ++
            if (stalledCounter > 25) {
                punchThroughArea.visible = false
                playRandomVideo()
            }
        }
        else if (videoOutput.status === 3) 
            var status = 'Loaded'
        else if (videoOutput.status === 4) 
            var status = 'Buffering'
        else if (videoOutput.status === 5) {
            var status = 'Stalled'
            stalledCounter ++
            if (stalledCounter > 25) {
                punchThroughArea.visible = false
                playRandomVideo()
            }
        }
        else if (videoOutput.status === 6) 
            var status = 'Buffered'
         else if (videoOutput.status === 7) 
            var status = 'EndOfMedia'
         else if (videoOutput.status === 8) 
            var status = 'InvalidMedia'
         else if (videoOutput.status === 0) 
            var status = 'UnknownStatus'
        
        if (videoOutput.playbackState === 1) 
            var playbackState = 'playing'
         else if (videoOutput.playbackState === 2) 
            var playbackState = 'paused'
         else if (videoOutput.playbackState === 0){ 
            var playbackState = 'stopped'
            stalledCounter ++
            if (stalledCounter > 15) {
                punchThroughArea.visible = false
                playRandomVideo()
            }
        }

        debug.text = "Video " + randomIndex + " of " + playList.assets.length +
        "\n Source Type: " + settings.sourceType + sourceAlt +
        "\n Try Other Source: " + settings.playLowerQuality +
        "\n Locale: " + settings.localeLang +
        "\n OSD opacity: " + settings.osdOpacity + "%" +
        "\n Timecode: " + Math.floor(videoOutput.position / 1000) + " / " + Math.floor(videoOutput.duration / 1000) +
        "\n Media Status: " + status +
        "\n Stalled Timeout: " + (25 - stalledCounter) +
        "\n Error: " + videoOutput.error + " " + videoOutput.errorString +
        "\n Playback State: " + playbackState +
        "\n Buffer Progress : " + (
        videoOutput.bufferProgress * 33.334).toFixed(0) + "%"
    }
    function updateOSD() {
        var DateFmt = ilib.require("DateFmt.js")
        var now = new Date()
        var time = new DateFmt({
            locale: settings.localeLang,
            timezone: "local",
            type: "time",
            length: "full"
        })
        var day = new DateFmt({
            locale: settings.localeLang,
            timezone: "local",
            type: "date",
            date: "dmw",
            length: "full"
        })
        timeOSD.text = time.format(now)
        if (poi.date) 
            dateOSD.text = poi.date.daysOfWeek[now.getDay()
            ] + ", " + now.getDate() + " " + poi.date.months[now.getMonth()
            ]
         else 
            dateOSD.text = day.format(now)
        
        if (playList.assets[randomIndex].pointsOfInterest[Math.floor(videoOutput.position / 1000)]) 
            poiIndex = Math.floor(videoOutput.position / 1000)        
    }

    Service {
        id : notificationsService
        appId : globalVars.appId
        function set(param) {
            call("luna://com.webos.notification/", param)
        }
    }
    function loadJSONData(url, targetVar, callback) {
        var xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    var jsonData = JSON.parse(xhr.responseText)
                    eval(targetVar + " = jsonData")
                    callback()
                } else {
                    console.error("Error loading JSON data:", xhr.statusText)
                    name.text = xhr.statusText
                }
            }
        }
        xhr.open("GET", url)
        xhr.send()
    }
}
