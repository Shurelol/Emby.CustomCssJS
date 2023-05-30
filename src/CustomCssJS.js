define([
  "events",
  "connectionManager",
], function (
  events,
  connectionManager,
  ) {
  "use strict";

  return function () {

    function loadCss(name, content, source) {
      try {
        let s = document.createElement("style");
        s.type = "text/css";
        s.innerHTML = content;
        document.head.appendChild(s);
        console.warn(`load CustomCss from ${source}: ${name}`);
      } catch (e) {
        console.error(`load CustomCss from ${source} ${name} error: ${e}`);
      }
    }

    function loadJS(name, content, source) {
      try {
        let startTimer = setInterval(function () { }, 10000);
        let s = document.createElement("script");
        s.type = "text/javascript";
        s.innerHTML = content;
        document.head.appendChild(s);
        let endTimer = setInterval(function () { }, 10000);
        let timerCount = endTimer - startTimer;
        let timerList = [];
        let message = `load CustomJS from ${source}: ${name}`
        if (timerCount > 1) {
          for (let i = startTimer + 1; i < endTimer; i++) {
            timerList.push(i);
          }
          window.customcssjsTimers = window.customcssjsTimers.concat(timerList);
          message += ` with timer ${timerList}`;
        }
        clearInterval(startTimer);
        clearInterval(endTimer);
        console.warn(message);
      } catch (e) {
        console.error(`load CustomJS from ${source} ${name} error: ${e}`);
      }
    }

    function loadCode(custom, type, source) {
      if (type === "css") {
        custom.forEach(item => loadCss(item.name, item.content, source));
      } else if (type === "js") {
        custom.forEach(item => loadJS(item.name, item.content, source));
      }
    }

    function getCustom(type, config) {
      // get Config for Server
      let serverId = ApiClient.serverId();
      let customServerConfig = localStorage.getItem(`custom${type}ServerConfig_${serverId}`);
      if (!customServerConfig) {
        customServerConfig = [];
        localStorage.setItem(`custom${type}ServerConfig_${serverId}`, JSON.stringify(customServerConfig));
      } else {
        customServerConfig = JSON.parse(customServerConfig);
      }
      // get custom in Server
      let customServer = config[`custom${type}`].filter(item => (item.state === "on" && customServerConfig.includes(item.name)) || item.state === "forced_on" );

      // get Config for Local
      let customLocalConfig = localStorage.getItem(`custom${type}LocalConfig`);
      if (!customLocalConfig) {
        customLocalConfig = [];
        localStorage.setItem(`custom${type}LocalConfig`, JSON.stringify(customLocalConfig));
      } else {
        customLocalConfig = JSON.parse(customLocalConfig);
      }
      // get custom in Local
      let customLocal = localStorage.getItem(`custom${type}Local`);
      if (!customLocal) {
        customLocal = [];
        localStorage.setItem(`custom${type}Local`, JSON.stringify(customLocal));
      } else {
        customLocal = JSON.parse(customLocal).filter(item => customLocalConfig.includes(item.name));
      }

      return [customServer, customLocal];
    }

    function clearTimer() {
      let customTimers = window.customcssjsTimers;
      if (customTimers) {
        for (let timer of customTimers) {
          clearInterval(timer);
        }
        console.warn(`clear timer: ${customTimers}`);
      }
      window.customcssjsTimers = [];
    }

    function loadConfiguration() {
      clearTimer();
      ApiClient.getPluginConfiguration(pluginUniqueId).then(function (config) {
        let [customjsServer, customjsLocal] = getCustom("js", config);
        let [customcssServer, customcssLocal] = getCustom("css", config);
        loadCode(customcssServer, "css", "Server");
        loadCode(customcssLocal, "css", "Local");
        loadCode(customjsServer, "js", "Server");
        loadCode(customjsLocal, "js", "Local");
      });
    }

    let pluginUniqueId = "98F76C3D-695F-4082-9220-AD5752E0859D";

    events.on(connectionManager, "localusersignedin", function () {
      loadConfiguration();
    });

  }
});