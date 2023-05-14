define([
  "events",
  "connectionManager",
], function (
  events,
  connectionManager,
  ) {
  "use strict";

  return function () {

    function loadCss(name, content) {
      try {
        let s = document.createElement("style");
        s.type = "text/css";
        s.innerHTML = content;
        document.head.appendChild(s);
        console.warn(`load CustomCss: ${name}`);
      } catch (e) {
        console.error(`load CustomCss ${name} error: ${e}`);
      }
    }

    function loadJS(name, content) {
      try {
        let s = document.createElement("script");
        s.type = "text/javascript";
        s.innerHTML = content;
        document.head.appendChild(s);
        console.warn(`load CustomJS: ${name}`);
      } catch (e) {
        console.error(`load CustomJS ${name} error: ${e}`);
      }
    }

    function loadCode(custom, type) {
      if (type === "css") {
        custom.forEach(item => loadCss(item.name, item.content));
      } else if (type === "js") {
        custom.forEach(item => loadJS(item.name, item.content));
      }
    }

    function getCustom(type, config) {
      // get custom in Server
      let customConfig = localStorage.getItem(`custom${type}Config`);
      if (!customConfig) {
        customConfig = [];
        localStorage.setItem(`custom${type}Config`, JSON.stringify(customConfig));
      } else {
        customConfig = JSON.parse(customConfig);
      }
      let customServer = config[`custom${type}`].filter(item => (item.state === "on" && customConfig.includes(item.name)) || item.state === "forced_on" );
      // get custom in Local
      let customLocal = localStorage.getItem(`custom${type}Local`);
      if (!customLocal) {
        customLocal = [];
        localStorage.setItem(`custom${type}Local`, JSON.stringify(customLocal));
      } else {
        customLocal = JSON.parse(customLocal).filter(item => item.state !== "off");
      }
      return [customServer, customLocal];
    }

    function loadConfiguration() {
      ApiClient.getPluginConfiguration(pluginUniqueId).then(function (config) {
        let [customjsServer, customjsLocal] = getCustom("js", config);
        let [customcssServer, customcssLocal] = getCustom("css", config);
        loadCode(customcssServer, "css");
        loadCode(customcssLocal, "css");
        loadCode(customjsServer, "js");
        loadCode(customjsLocal, "js");
      });
    }

    let pluginUniqueId = "98F76C3D-695F-4082-9220-AD5752E0859D";

    events.on(connectionManager, "localusersignedin", function () {
      loadConfiguration();
    });

  }
});