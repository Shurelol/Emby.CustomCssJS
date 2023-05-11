define(['globalize', 'apphost', 'playbackManager', 'pluginManager', 'events', 'embyRouter', 'appSettings', 'userSettings', 'loading', 'dom', 'require', 'connectionManager'], function (globalize, appHost, playbackManager, pluginManager, events, embyRouter, appSettings, userSettings, loading, dom, require, connectionManager) {
  'use strict';

  return function () {

    this.name = 'Custom JavaScrips and Css';
    this.type = 'custom'
    this.id = 'customjs_css';

    this.getRoutes = function () {

      let routes = [];

      routes.push({
        path: "customjs_css_update.html",
        transition: "slide",
        controller: "customjs_css/customjs_css_update.js",
        controllerType: "module",
        title: "自定义JavaScript及Css",
        settingsTheme: !0,
        adjustHeaderForEmbeddedScroll: !0,
      });

      routes.push({
        path: "customjs_css.html",
        transition: "slide",
        controller: "customjs_css/customjs_css.js",
        controllerType: "module",
        type: "settings",
        title: "自定义JavaScript及Css",
        category: "Playback",
        thumbImage: "",
        icon: "tune",
        order: 2,
        settingsTheme: !0,
        adjustHeaderForEmbeddedScroll: !0,
      })

      return routes;
    };

    function loadSettings(type) {
      let custom_settings = appSettings.get(`Custom${type}`);
      custom_settings = custom_settings ? JSON.parse(custom_settings) : {};
      if (typeof (custom_settings) !== "object" || !isNaN(custom_settings.length)) {
        custom_settings = {};
        appSettings.set(`Custom${type}`, JSON.stringify(custom_settings));
      }
      return custom_settings;
    }

    function loadSettingsLocal(type, settings) {
      let custom_settings = localStorage.getItem(`Custom${type}local`);
      custom_settings = custom_settings ? JSON.parse(custom_settings) : {};
      if (typeof (custom_settings) !== "object" || !isNaN(custom_settings.length)) {
        custom_settings = {};
        if (settings) {
          for (let name in settings) {
            custom_settings[name] = "0";
          }
        }
      } else {
        let custom_settings_new = {};
        if (settings) {
          for (let name in settings) {
            if (custom_settings.hasOwnProperty(name)) {
              custom_settings_new[name] = custom_settings[name];
            }
          }
          custom_settings = custom_settings_new;
        }
      }
      localStorage.setItem(`Custom${type}local`, JSON.stringify(custom_settings));
      return custom_settings;
    }

    function loadCustom() {
      try {
        let customcss = loadSettings("Css");
        let customcss_local = loadSettingsLocal("Css", customcss);
        if (customcss) {
          for (let name in customcss) {
            let content = customcss[name].content;
            let enabled = customcss[name].enabled;
            if (customcss_local.hasOwnProperty(name) && customcss_local[name] === "1" && content && enabled === "1") {
              let s = document.createElement("style");
              s.type = "text/css";
              s.innerHTML = customcss[name].content;
              document.head.appendChild(s);
              console.warn(`load customCss: ${decodeURIComponent(name)}`);
            }
          }
        }
      } catch (err) {
        console.warn(`load customCss error: ${err.message}`);
      }

      try {
        let customjs = loadSettings("JS");
        let customjs_local = loadSettingsLocal("JS", customjs);
        if (customjs) {
          for (let name in customjs) {
            let content = customjs[name].content;
            let enabled = customjs[name].enabled;
            if (customjs_local.hasOwnProperty(name) && customjs_local[name] === "1" && content && enabled === "1"){
              eval(content);
              console.warn(`load customJs: ${decodeURIComponent(name)}`);
            }
          }
        }
      } catch (err) {
        console.warn(`load customJS error: ${err.message}`);
      }
    }

    loadCustom();
  }

})