var basePath =
  "/media/developer/apps/usr/palm/applications/org.rchalaaa.webos.custom-screensaver";
var applyPath = basePath + "/assets/apply.sh";
var unapplyPath = basePath + "/assets/unapply.sh";
var linkPath = "/var/lib/webosbrew/init.d/50-custom-screensaver-aerial";
var settingsPath = basePath + "/assets/settings.json";
var hbChannelService = "luna://org.webosbrew.hbchannel.service";

var sourceOptions = [
  { label: "FullHD (H265)", value: "url-1080-SDR" },
  { label: "FullHD (H264)", value: "url-1080-H264" },
  { label: "FullHD Dolby Vision (HEVC)", value: "url-1080-HDR" },
  { label: "4k (HEVC)", value: "url-4K-SDR" },
  { label: "4k Dolby Vision (HEVC)", value: "url-4K-HDR" },
  { label: "4k 240FPS (HEVC)", value: "url-4K-SDR-240FPS" },
];

var languageOptions = [
  { value: "ar-AE", label: "العربية" },
  { value: "be-BY", label: "Беларуская" },
  { value: "ca-ES", label: "Català" },
  { value: "cs-CZ", label: "Čeština" },
  { value: "da-DK", label: "Dansk" },
  { value: "de-DE", label: "Deutsch" },
  { value: "el-GR", label: "ελληνικά" },
  { value: "en-AU", label: "English (Australia)" },
  { value: "en-GB", label: "English (United Kingdom)" },
  { value: "en-US", label: "English (United States)" },
  { value: "es-ES", label: "Español" },
  { value: "es-419", label: "Español (Latinoamérica)" },
  { value: "fi-FI", label: "Suomi" },
  { value: "fr-CA", label: "Français (Canada)" },
  { value: "fr-FR", label: "Français" },
  { value: "he-IL", label: "עברית" },
  { value: "hi-IN", label: "हिन्दी" },
  { value: "hr-HR", label: "Hrvatski" },
  { value: "hu-HU", label: "Magyar" },
  { value: "id-ID", label: "Bahasa Indonesia" },
  { value: "it-IT", label: "Italiano" },
  { value: "ja-JP", label: "日本語" },
  { value: "ko-KR", label: "한국어" },
  { value: "ms-MY", label: "Bahasa Melayu" },
  { value: "nl-NL", label: "Nederlands" },
  { value: "nb-NO", label: "Norge" },
  { value: "pl-PL", label: "Polski" },
  { value: "pt-BR", label: "Português (Brasil)" },
  { value: "pt-PT", label: "Português (Portugal)" },
  { value: "ro-RO", label: "Română" },
  { value: "ru-RU", label: "Русский" },
  { value: "sk-SK", label: "Slovenčina" },
  { value: "sl-SI", label: "Slovenski" },
  { value: "sv-SE", label: "Svenska" },
  { value: "th-TH", label: "ไทย" },
  { value: "tr-TR", label: "Türkçe" },
  { value: "uk-UA", label: "Українська" },
  { value: "vi-VN", label: "Tiếng Việt" },
  { value: "zh-CN", label: "中文 (中国大陆)" },
  { value: "zh-HK", label: "中文（香港）" },
  { value: "zh-TW", label: "中文 (台灣)" },
];

var fontOptions = [{ value: "SegoeUI-Light.ttf", label: "SegoeUI Light" }];

if (window.AERIAL_FONT_OPTIONS && window.AERIAL_FONT_OPTIONS.length) {
  fontOptions = window.AERIAL_FONT_OPTIONS;
}

var uiText = {};

var settings = {
  enabled: true,
  localeLang: "en-US",
  localeLangIndex: 9,
  sourceType: "url-4K-SDR",
  sourceTypeIndex: 3,
  osdOpacity: 100,
  osdTextScale: 100,
  osdFontFile: "SegoeUI-Light.ttf",
  osdFontFileIndex: 0,
  debug: false,
  showPoi: true,
  showName: true,
  showTime: true,
  showDate: true,
};

var controls = {};
var openSelectKey = null;
var editingControlId = null;
var navPositions = {
  testRun: { row: 0, col: 2 },
  enabled: { row: 1, col: 0 },
  sourceType: { row: 1, col: 1 },
  localeLang: { row: 1, col: 2 },
  osdOpacity: { row: 2, col: 0 },
  showName: { row: 2, col: 1 },
  showPoi: { row: 2, col: 2 },
  osdTextScale: { row: 3, col: 0 },
  showTime: { row: 3, col: 1 },
  showDate: { row: 3, col: 2 },
  osdFontFile: { row: 4, col: 0 },
  debug: { row: 4, col: 1 },
};

document.addEventListener("DOMContentLoaded", function () {
  document.title = "webOS Aerial Screensaver";
  renderApp();
  loadInitialState();
});

function renderApp() {
  document.body.innerHTML =
    '<main class="app-shell">' +
    '  <section class="hero-card">' +
    "    <div>" +
    '      <p class="eyebrow" data-i18n="appEyebrow">Custom screensaver</p>' +
    "      <h1>webOS Aerial</h1>" +
    '      <p class="hero-copy" data-i18n="heroCopy">Tune video quality, overlay text, and screensaver status for your TV from one focused control panel.</p>' +
    "    </div>" +
    '    <div class="hero-actions">' +
    '      <button id="testRun" class="primary-button" type="button" data-i18n="testRun">Test run</button>' +
    "    </div>" +
    "  </section>" +
    '  <section class="content-grid">' +
    '    <section class="panel">' +
    '      <div class="section-heading">' +
    '        <p data-i18n="statusEyebrow">Status</p>' +
    '        <h2 data-i18n="screensaverTitle">Screensaver</h2>' +
    "      </div>" +
    '      <label class="toggle-card large-toggle">' +
    "        <span>" +
    '          <strong data-i18n="enableScreensaver">Enable customscreensaver</strong>' +
    '          <small id="enabledText">Applies now and after reboot.</small>' +
    "        </span>" +
    '        <input id="enabled" type="checkbox" />' +
    "      </label>" +
    "    </section>" +
    '    <section class="panel">' +
    '      <div class="section-heading">' +
    '        <p data-i18n="playbackEyebrow">Playback</p>' +
    '        <h2 data-i18n="videoSourceTitle">Video source</h2>' +
    "      </div>" +
    '      <label class="field" id="sourceTypeField">' +
    '        <span data-i18n="sourceVideoType">Source video type</span>' +
    '        <button id="sourceType" class="select-button" type="button">Loading...</button>' +
    '        <div id="sourceTypeMenu" class="select-menu" role="listbox"></div>' +
    "        </label>" +
    "    </section>" +
    '    <section class="panel">' +
    '      <div class="section-heading">' +
    '        <p data-i18n="localizationEyebrow">Localization</p>' +
    '        <h2 data-i18n="languageTitle">Language</h2>' +
    "      </div>" +
    '      <label class="field" id="localeLangField">' +
    '        <span data-i18n="languageLabel">Language</span>' +
    '        <button id="localeLang" class="select-button" type="button">Loading...</button>' +
    '        <div id="localeLangMenu" class="select-menu" role="listbox"></div>' +
    "      </label>" +
    "    </section>" +
    '    <section class="panel text-display-panel">' +
    '      <div class="section-heading">' +
    '        <p data-i18n="overlayEyebrow">Overlay</p>' +
    '        <h2 data-i18n="textDisplayTitle">Text display</h2>' +
    "      </div>" +
    '      <label class="range-field">' +
    '        <span><span data-i18n="textOpacity">Text opacity</span> <strong id="opacityValue">100%</strong></span>' +
    '        <input id="osdOpacity" type="range" min="0" max="100" step="5" />' +
    "      </label>" +
    '      <label class="range-field">' +
    '        <span><span data-i18n="textScale">Text scale</span> <strong id="scaleValue">x1</strong></span>' +
    '        <input id="osdTextScale" type="range" min="50" max="150" step="5" />' +
    "      </label>" +
    '      <label class="field" id="osdFontFileField">' +
    '        <span data-i18n="osdFont">OSD font</span>' +
    '        <button id="osdFontFile" class="select-button" type="button">Loading...</button>' +
    '        <div id="osdFontFileMenu" class="select-menu" role="listbox"></div>' +
    "      </label>" +
    "    </section>" +
    '    <section class="panel span-2">' +
    '      <div class="section-heading">' +
    '        <p data-i18n="detailsEyebrow">Details</p>' +
    '        <h2 data-i18n="onScreenInfoTitle">On-screen information</h2>' +
    "      </div>" +
    '      <div class="toggle-grid">' +
    createToggleMarkup("showName", "Name", "Show the aerial video name.") +
    createToggleMarkup(
      "showPoi",
      "Description",
      "Show the aerial video description.",
    ) +
    createToggleMarkup("showTime", "Time", "Show the current time.") +
    createToggleMarkup("showDate", "Date", "Show the current date.") +
    createToggleMarkup(
      "debug",
      "Debug info",
      "Display extra playback diagnostics.",
    ) +
    "      </div>" +
    "    </section>" +
    '    <section class="panel status-panel span-2">' +
    '      <div class="section-heading">' +
    '        <p data-i18n="resultEyebrow">Result</p>' +
    '        <h2 data-i18n="resultTitle">Status</h2>' +
    "      </div>" +
    '      <pre id="result">Loading settings...</pre>' +
    "    </section>" +
    "  </section>" +
    "</main>";

  controls = {
    sourceType: document.getElementById("sourceType"),
    sourceTypeMenu: document.getElementById("sourceTypeMenu"),
    localeLang: document.getElementById("localeLang"),
    localeLangMenu: document.getElementById("localeLangMenu"),
    osdFontFile: document.getElementById("osdFontFile"),
    osdFontFileMenu: document.getElementById("osdFontFileMenu"),
    osdOpacity: document.getElementById("osdOpacity"),
    opacityValue: document.getElementById("opacityValue"),
    osdTextScale: document.getElementById("osdTextScale"),
    scaleValue: document.getElementById("scaleValue"),
    enabled: document.getElementById("enabled"),
    enabledText: document.getElementById("enabledText"),
    showPoi: document.getElementById("showPoi"),
    showName: document.getElementById("showName"),
    showTime: document.getElementById("showTime"),
    showDate: document.getElementById("showDate"),
    debug: document.getElementById("debug"),
    result: document.getElementById("result"),
  };

  fillSelectMenu("sourceType", sourceOptions);
  fillSelectMenu("localeLang", languageOptions);
  fillSelectMenu("osdFontFile", fontOptions);
  attachEvents();
  initRemoteNavigation();
}

function createToggleMarkup(id, title, description) {
  return (
    '<label class="toggle-card">' +
    "  <span>" +
    '    <strong data-i18n="toggle_' +
    id +
    '_title">' +
    title +
    "</strong>" +
    '    <small data-i18n="toggle_' +
    id +
    '_desc">' +
    description +
    "</small>" +
    "  </span>" +
    '  <input id="' +
    id +
    '" type="checkbox" />' +
    "</label>"
  );
}

function fillSelectMenu(key, options) {
  var menu = controls[key + "Menu"];
  options.forEach(function (option) {
    var item = document.createElement("button");
    item.type = "button";
    item.className = "select-option";
    item.id = key + "Option" + selectedIndex(options, option.value);
    item.value = option.value;
    item.textContent = option.label;
    item.addEventListener("click", function () {
      selectMenuOption(key, option.value);
    });
    menu.appendChild(item);
  });
}

function formatTextScale(value) {
  return (
    "x" +
    (Number(value) / 100)
      .toFixed(2)
      .replace(/0+$/, "")
      .replace(/\.$/, "")
  );
}

function t(key) {
  return uiText[key] || key;
}

function loadUiTranslations(callback) {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function () {
    if (request.readyState !== XMLHttpRequest.DONE) {
      return;
    }

    if (request.status === 200 || request.status === 0) {
      try {
        uiText = JSON.parse(request.responseText).config || {};
      } catch (error) {
        console.error("[Aerial] Could not parse UI translations", error);
        uiText = {};
      }
    } else {
      console.error("[Aerial] Could not load UI translations", request.statusText);
      uiText = {};
    }

    if (callback) {
      callback();
    }
  };
  request.open("GET", "assets/locales/" + (settings.localeLang || "en-US") + ".json");
  request.send();
}

function applyUiTranslations() {
  document.documentElement.lang = settings.localeLang || "en-US";
  document.title = "webOS Aerial Screensaver";
  Array.prototype.slice
    .call(document.querySelectorAll("[data-i18n]"))
    .forEach(function (element) {
      element.textContent = t(element.getAttribute("data-i18n"));
    });
  updateEnabledText();
}

function updateEnabledText() {
  if (!controls.enabledText) {
    return;
  }
  controls.enabledText.textContent =
    settings.enabled !== false ? t("enabledText") : t("disabledText");
}

function attachEvents() {
  document.getElementById("testRun").addEventListener("click", function () {
    exec(
      "luna-send -n 1 'luna://com.webos.service.tvpower/power/turnOnScreenSaver' '{}'",
    );
  });
  controls.sourceType.addEventListener("click", function () {
    openSelectMenu("sourceType");
  });
  controls.localeLang.addEventListener("click", function () {
    openSelectMenu("localeLang");
  });
  controls.osdFontFile.addEventListener("click", function () {
    openSelectMenu("osdFontFile");
  });
  controls.osdOpacity.addEventListener("input", function () {
    controls.opacityValue.textContent = controls.osdOpacity.value + "%";
  });
  controls.osdOpacity.addEventListener("change", function () {
    settings.osdOpacity = Number(controls.osdOpacity.value);
    saveSettings();
  });
  controls.osdTextScale.addEventListener("input", function () {
    controls.scaleValue.textContent = formatTextScale(
      controls.osdTextScale.value,
    );
  });
  controls.osdTextScale.addEventListener("change", function () {
    settings.osdTextScale = Number(controls.osdTextScale.value);
    saveSettings();
  });
  controls.enabled.addEventListener("change", function () {
    settings.enabled = controls.enabled.checked;
    saveSettings(function () {
      syncScreensaverState();
    });
  });

  ["showPoi", "showName", "showTime", "showDate", "debug"].forEach(
    function (key) {
      controls[key].addEventListener("change", function () {
        settings[key] = controls[key].checked;
        saveSettings();
      });
    },
  );
}

function initRemoteNavigation() {
  document.addEventListener("keydown", function (event) {
    var key = event.key || keyFromCode(event.keyCode);
    var active = document.activeElement;

    if (openSelectKey) {
      handleOpenSelectKey(key, event);
      return;
    }

    if (!isFocusable(active)) {
      focusFirstControl();
      active = document.activeElement;
    }

    if (key === "ArrowLeft" || key === "ArrowRight") {
      if (
        editingControlId &&
        adjustInlineControl(active, key === "ArrowRight" ? 1 : -1)
      ) {
        event.preventDefault();
        return;
      }
      focusNearestControl(key);
      event.preventDefault();
      return;
    }

    if (key === "ArrowUp" || key === "ArrowDown") {
      focusNearestControl(key);
      event.preventDefault();
      return;
    }

    if (key === "Enter" || key === "OK") {
      activateControl(active);
      event.preventDefault();
    }
  });

  window.setTimeout(focusFirstControl, 0);
}

function keyFromCode(keyCode) {
  var keys = {
    13: "Enter",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    461: "Back",
  };
  return keys[keyCode] || "";
}

function focusableControls() {
  return Array.prototype.slice
    .call(document.querySelectorAll("button, input"))
    .filter(function (element) {
      return (
        !element.className ||
        element.className.indexOf("select-option") === -1 ||
        openSelectKey
      );
    })
    .filter(isFocusable);
}

function isFocusable(element) {
  return !!(
    element &&
    !element.disabled &&
    element.offsetParent !== null &&
    typeof element.focus === "function"
  );
}

function focusFirstControl() {
  var controlsList = focusableControls();
  if (controlsList.length) {
    controlsList[0].focus();
  }
}

function focusNearestControl(direction) {
  var controlsList = focusableControls();
  var active = document.activeElement;

  if (!controlsList.length) {
    return;
  }

  if (controlsList.indexOf(active) === -1) {
    controlsList[0].focus();
    return;
  }

  var activePosition = navPositions[active.id];
  if (!activePosition) {
    controlsList[0].focus();
    return;
  }

  var bestControl = null;
  var bestScore = Infinity;

  controlsList.forEach(function (control) {
    if (control === active) {
      return;
    }

    var position = navPositions[control.id];
    if (!position || !isInGridDirection(direction, activePosition, position)) {
      return;
    }

    var rowDistance = Math.abs(position.row - activePosition.row);
    var colDistance = Math.abs(position.col - activePosition.col);
    var score =
      direction === "ArrowLeft" || direction === "ArrowRight"
        ? colDistance * 10 + rowDistance
        : rowDistance * 10 + colDistance;

    if (score < bestScore) {
      bestScore = score;
      bestControl = control;
    }
  });

  if (bestControl) {
    bestControl.focus();
    scrollFocusedControlIntoView(bestControl);
  }
}

function scrollFocusedControlIntoView(control) {
  if (control.scrollIntoViewIfNeeded) {
    control.scrollIntoViewIfNeeded(false);
  } else {
    control.scrollIntoView(false);
  }
}

function isInGridDirection(direction, from, to) {
  if (direction === "ArrowLeft") {
    return to.col < from.col;
  }
  if (direction === "ArrowRight") {
    return to.col > from.col;
  }
  if (direction === "ArrowUp") {
    return to.row < from.row;
  }
  return to.row > from.row;
}

function adjustInlineControl(control, delta) {
  if (!control) {
    return false;
  }

  if (control.type === "range") {
    var step = Number(control.step || 1);
    var min = Number(control.min || 0);
    var max = Number(control.max || 100);
    var nextValue = Math.max(
      min,
      Math.min(max, Number(control.value) + step * delta),
    );
    if (nextValue === Number(control.value)) {
      return false;
    }
    control.value = nextValue;
    dispatchDomEvent(control, "input");
    dispatchDomEvent(control, "change");
    return true;
  }

  return false;
}

function activateControl(control) {
  if (!isFocusable(control)) {
    return;
  }

  if (control.id === "sourceType" || control.id === "localeLang") {
    openSelectMenu(control.id);
    return;
  }

  if (control.type === "range") {
    editingControlId = editingControlId === control.id ? null : control.id;
    control.className = editingControlId === control.id ? "editing" : "";
    return;
  }

  if (control.type === "checkbox") {
    control.checked = !control.checked;
    dispatchDomEvent(control, "change");
    return;
  }

  if (control.tagName === "BUTTON") {
    control.click();
  }
}

function openSelectMenu(key) {
  closeSelectMenu();
  openSelectKey = key;
  controls[key].parentNode.className = "field dropdown-open";
  addClass(findParentByClass(controls[key], "panel"), "dropdown-layer");
  controls[key + "Menu"].className = "select-menu open";
  focusSelectedOption(key);
}

function closeSelectMenu() {
  if (!openSelectKey) {
    return;
  }
  controls[openSelectKey].parentNode.className = "field";
  removeClass(
    findParentByClass(controls[openSelectKey], "panel"),
    "dropdown-layer",
  );
  controls[openSelectKey + "Menu"].className = "select-menu";
  controls[openSelectKey].focus();
  openSelectKey = null;
}

function findParentByClass(element, className) {
  while (element && element !== document.body) {
    if (
      element.className &&
      (" " + element.className + " ").indexOf(" " + className + " ") !== -1
    ) {
      return element;
    }
    element = element.parentNode;
  }
  return null;
}

function addClass(element, className) {
  if (
    element &&
    (" " + element.className + " ").indexOf(" " + className + " ") === -1
  ) {
    element.className += " " + className;
  }
}

function removeClass(element, className) {
  if (!element) {
    return;
  }
  element.className = (" " + element.className + " ")
    .replace(" " + className + " ", " ")
    .replace(/^\s+|\s+$/g, "");
}

function focusSelectedOption(key) {
  var index = selectedSettingIndex(key);
  var option = document.getElementById(key + "Option" + index);
  if (option) {
    option.focus();
  }
}

function handleOpenSelectKey(key, event) {
  var options = selectOptions(openSelectKey);
  var active = document.activeElement;
  var index = optionIndexFromId(active && active.id);

  if (key === "ArrowDown" || key === "ArrowUp") {
    index += key === "ArrowDown" ? 1 : -1;
    if (index < 0) {
      index = options.length - 1;
    }
    if (index >= options.length) {
      index = 0;
    }
    document.getElementById(openSelectKey + "Option" + index).focus();
    event.preventDefault();
    return;
  }

  if (key === "Enter" || key === "OK") {
    if (options[index]) {
      selectMenuOption(openSelectKey, options[index].value);
    }
    event.preventDefault();
    return;
  }

  if (
    key === "ArrowLeft" ||
    key === "ArrowRight" ||
    key === "Back" ||
    key === "Escape"
  ) {
    closeSelectMenu();
    event.preventDefault();
  }
}

function optionIndexFromId(id) {
  var match = id && id.match(/Option(\d+)$/);
  return match ? Number(match[1]) : 0;
}

function selectMenuOption(key, value) {
  if (key === "sourceType") {
    settings.sourceType = value;
    settings.sourceTypeIndex = selectedIndex(sourceOptions, value);
  } else if (key === "localeLang") {
    settings.localeLang = value;
    settings.localeLangIndex = selectedIndex(languageOptions, value);
  } else {
    settings.osdFontFile = value;
    settings.osdFontFileIndex = selectedIndex(fontOptions, value);
  }
  updateSelectButtons();
  if (key === "localeLang") {
    loadUiTranslations(applyUiTranslations);
  }
  closeSelectMenu();
  saveSettings();
}

function dispatchDomEvent(element, eventName) {
  var event;
  if (typeof Event === "function") {
    event = new Event(eventName, { bubbles: true });
  } else {
    event = document.createEvent("Event");
    event.initEvent(eventName, true, true);
  }
  element.dispatchEvent(event);
}

function loadInitialState() {
  console.info("[Aerial] Loading settings", settingsPath);
  var request = new XMLHttpRequest();
  request.onreadystatechange = function () {
    if (request.readyState !== XMLHttpRequest.DONE) {
      return;
    }

    if (request.status === 200 || request.status === 0) {
      readSettings(request.responseText);
    } else {
      setResult("Could not load settings: " + request.statusText);
    }

    loadUiTranslations(function () {
      applySettingsToUi();
      setResult(t("ready"));
      window.setTimeout(syncScreensaverState, 0);
    });
  };
  request.open("GET", "assets/settings.json");
  request.send();
}

function readSettings(settingsJson) {
  if (!settingsJson) {
    return;
  }

  try {
    mergeSettings(JSON.parse(settingsJson));
    console.info("[Aerial] Loaded settings", settings);
  } catch (error) {
    console.error("[Aerial] Could not parse settings", error);
    setResult("Could not parse settings: " + error.message);
  }
}

function applySettingsToUi() {
  settings.sourceType =
    settings.sourceType ||
    optionValueAt(sourceOptions, settings.sourceTypeIndex);
  settings.localeLang =
    settings.localeLang ||
    optionValueAt(languageOptions, settings.localeLangIndex);
  settings.osdFontFile =
    settings.osdFontFile ||
    settings.osdFontFamily ||
    optionValueAt(
      fontOptions,
      settings.osdFontFileIndex || settings.osdFontFamilyIndex,
    );
  updateSelectButtons();
  settings.osdTextScale = settings.osdTextScale || 100;
  controls.osdOpacity.value = settings.osdOpacity;
  controls.opacityValue.textContent = settings.osdOpacity + "%";
  controls.osdTextScale.value = settings.osdTextScale;
  controls.scaleValue.textContent = formatTextScale(settings.osdTextScale);
  controls.enabled.checked = settings.enabled !== false;
  controls.showPoi.checked = settings.showPoi !== false;
  controls.showName.checked = settings.showName !== false;
  controls.showTime.checked = settings.showTime !== false;
  controls.showDate.checked = settings.showDate !== false;
  controls.debug.checked = !!settings.debug;
  applyUiTranslations();
}

function updateSelectButtons() {
  controls.sourceType.textContent = optionLabel(
    sourceOptions,
    settings.sourceType,
  );
  controls.localeLang.textContent = optionLabel(
    languageOptions,
    settings.localeLang,
  );
  controls.osdFontFile.textContent = optionLabel(
    fontOptions,
    settings.osdFontFile,
  );
}

function selectOptions(key) {
  if (key === "sourceType") {
    return sourceOptions;
  }
  if (key === "localeLang") {
    return languageOptions;
  }
  return fontOptions;
}

function selectedSettingIndex(key) {
  if (key === "sourceType") {
    return settings.sourceTypeIndex;
  }
  if (key === "localeLang") {
    return settings.localeLangIndex;
  }
  return settings.osdFontFileIndex || settings.osdFontFamilyIndex || 0;
}

function optionLabel(options, value) {
  for (var index = 0; index < options.length; index += 1) {
    if (options[index].value === value) {
      return options[index].label;
    }
  }
  return options[0].label;
}

function selectedIndex(options, value) {
  for (var index = 0; index < options.length; index += 1) {
    if (options[index].value === value) {
      return index;
    }
  }
  return 0;
}

function optionValueAt(options, index) {
  if (options[index]) {
    return options[index].value;
  }
  return options[0].value;
}

function mergeSettings(nextSettings) {
  Object.keys(nextSettings).forEach(function (key) {
    if (key === "playLowerQuality") {
      return;
    }
    settings[key] = nextSettings[key];
  });
}

function saveSettings(callback) {
  settings.sourceTypeIndex = selectedIndex(sourceOptions, settings.sourceType);
  settings.localeLangIndex = selectedIndex(
    languageOptions,
    settings.localeLang,
  );
  settings.osdFontFileIndex = selectedIndex(fontOptions, settings.osdFontFile);
  delete settings.playLowerQuality;
  console.info("[Aerial] Saving settings", settings);
  exec("echo '" + JSON.stringify(settings) + "' > " + settingsPath, callback);
}

function syncScreensaverState() {
  console.info("[Aerial] Sync screensaver state", {
    enabled: settings.enabled !== false,
    applyPath: applyPath,
    unapplyPath: unapplyPath,
    linkPath: linkPath,
  });

  if (settings.enabled !== false) {
    controls.enabledText.textContent = t("enablingText");
    exec(
      "sh " +
        applyPath +
        " && mkdir -p /var/lib/webosbrew/init.d && printf '%s\\n' '#!/bin/sh' 'sh " +
        applyPath +
        "' > " +
        linkPath +
        " && chmod +x " +
        linkPath,
      function () {
        console.info("[Aerial] Screensaver enabled and boot link created");
        controls.enabledText.textContent = t("enabledText");
      },
    );
  } else {
    controls.enabledText.textContent = t("disablingText");
    exec("sh " + unapplyPath + " ; rm -f " + linkPath, function () {
      console.info("[Aerial] Screensaver disabled and boot link removed");
      controls.enabledText.textContent = t("disabledText");
    });
  }
}

function exec(command, callback) {
  console.info("[Aerial] exec", command);
  setResult(t("processing") + "\n" + command);
  requestService(
    hbChannelService,
    "exec",
    { command: command },
    function (evt) {
      console.info("[Aerial] exec success", command, evt);
      handleExecResult(evt);
      if (callback) {
        callback(evt);
      }
    },
    function (evt) {
      console.error("[Aerial] exec failed", command, evt);
      handleExecResult(
        evt || { returnValue: false, errorText: "Service request failed" },
      );
      if (callback) {
        callback(evt);
      }
    },
  );
}

function requestService(service, method, parameters, onSuccess, onFailure) {
  console.info("[Aerial] service request", service, method, parameters);
  if (window.webOS && window.webOS.service && window.webOS.service.request) {
    window.webOS.service.request(service, {
      method: method,
      parameters: parameters,
      onSuccess: onSuccess,
      onFailure: onFailure,
    });
    return;
  }

  if (window.PalmServiceBridge) {
    var bridge = new window.PalmServiceBridge();
    bridge.onservicecallback = function (message) {
      var response;
      try {
        response = JSON.parse(message);
      } catch (error) {
        console.error(
          "[Aerial] Could not parse service response",
          message,
          error,
        );
        response = { returnValue: false, errorText: message };
      }
      if (response.returnValue === false) {
        onFailure(response);
      } else {
        onSuccess(response);
      }
    };
    bridge.call(service + "/" + method, JSON.stringify(parameters || {}));
    return;
  }

  onFailure({
    returnValue: false,
    errorText: "No webOS service bridge is available in this environment.",
  });
}

function handleExecResult(evt) {
  var output = "";
  if (evt && evt.returnValue !== false) {
    output = t("success");
    if (evt.stdoutString) {
      output += "\n" + evt.stdoutString;
    }
    if (evt.stderrString) {
      output += "\n" + evt.stderrString;
    }
  } else {
    output = t("failed");
    if (evt && evt.errorText) {
      output += ": " + evt.errorText;
    }
    if (evt && evt.stdoutString) {
      output += "\n" + evt.stdoutString;
    }
    if (evt && evt.stderrString) {
      output += "\n" + evt.stderrString;
    }
  }
  setResult(output);
}

function setResult(message) {
  if (controls.result) {
    controls.result.textContent = message || t("ready");
  }
}
