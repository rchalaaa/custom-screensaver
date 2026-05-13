#!/bin/sh

find_mount_target() {
    if [ -n "${MOUNT_TARGET:-}" ] && [ -f "$MOUNT_TARGET" ]; then
        echo "$MOUNT_TARGET"
        return 0
    fi

    for candidate in "/usr/palm/applications/com.webos.app.screensaver/qml/main.qml" "/usr/palm/applications/com.webos.app.screensaver/qml/ScreensaverMain.qml"
    do
        if [ -f "$candidate" ]; then
            echo "$candidate"
            return 0
        fi
    done

    if [ -d "/usr/palm/applications/com.webos.app.screensaver" ]; then
        found="$(grep -rl --include='*.qml' 'timeout' /usr/palm/applications/com.webos.app.screensaver 2>/dev/null | head -n 1 || true)"
        if [ -n "$found" ]; then
            echo "$found"
            return 0
        fi
    fi

    return 1
}

is_mounted() {
    target="$1"

    if command -v findmnt >/dev/null 2>&1; then
        findmnt -n "$target" >/dev/null 2>&1
    else
        mount | grep -F " on $target " >/dev/null 2>&1
    fi
}

MOUNT_TARGET="$(find_mount_target || true)"
if [ -z "$MOUNT_TARGET" ]; then
    echo "[-] Could not detect screensaver QML target under /usr/palm/applications/com.webos.app.screensaver" >&2
    exit 1
fi

if is_mounted "$MOUNT_TARGET"; then
    umount "$MOUNT_TARGET"
    echo "[+] Disabled successfully: $MOUNT_TARGET" >&2
else
    echo "[~] Disabled already: $MOUNT_TARGET" >&2
fi
