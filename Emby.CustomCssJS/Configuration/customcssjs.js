define([
  "globalize",
  "loading",
  "confirm",
  "toast",
  "embyRouter",
  "emby-input",
  "emby-button",
  "emby-select",
  "emby-checkbox",
], function (
  globalize,
  loading,
  confirm,
  toast,
  embyRouter) {
  "use strict";
  
  return function init(view) {

    function onSubmit(e) {
        e.preventDefault();
        return false;
    }

  
    function del(name, type) {
      confirm(`${globalize.translate('Delete')} ${name}`).then(function () {
        loading.show();
        let config = JSON.parse(localStorage.getItem(`custom${type}Local`)).filter(item => item.name !== name);
        localStorage.setItem(`custom${type}Local`, JSON.stringify(config));
        toast(`${name} ${globalize.translate('deleted')}`);
        loadConfiguration();
      });
    }
  
    function update(name, type, source, forceflag=false) {
      let url = Dashboard.getConfigurationResourceUrl('customcssjs_update').split("/");
      embyRouter.show(url.pop() + `&cname=${name}&type=${type}&source=${source}&forceflag=${forceflag}`);
    }
  
    function renderConfiguration(config, type, source) {
      let listNode = view.querySelector(`#custom${type}List${source}`);
      while (listNode.childNodes.length > 0) {
        listNode.firstChild.remove();
      }
      if (config.length > 0) {
        for (let detail of config) {
          let templateNode = view.querySelector(`#customcssjsTemplate`).cloneNode(true);
          // del id
          templateNode.removeAttribute("id");
          // del hide
          templateNode.classList.remove("hide");
          // set source
          let sourceNode = templateNode.querySelector(".customcssjsSource");
          switch (source) {
            case "Server":
              sourceNode.innerText = "dns";
              break;
            case "Local":
              sourceNode.innerText = "computer";
              break;
            default:
              sourceNode.remove();
              break;
          }
          // set state
          let stateNode = templateNode.querySelector(".customcssjsState");
          switch (detail.state) {
            case "forced_on":
              let translationForcedOn = globalize.translate("Forced On");
              stateNode.setAttribute("title", translationForcedOn);
              stateNode.setAttribute("aria-label", translationForcedOn);
              stateNode.style.color = "var(--theme-accent-text-color)";
              stateNode.innerText = "check_circle";
              break;
            case "on":
              let translationOn = globalize.translate("On");
              stateNode.setAttribute("title", translationOn);
              stateNode.setAttribute("aria-label", translationOn);
              stateNode.style.color = "var(--theme-accent-text-color)";
              stateNode.innerText = "check";
              break;
            case "off":
              let translationOff = globalize.translate("Off");
              stateNode.setAttribute("title", translationOff);
              stateNode.setAttribute("aria-label", translationOff);
              stateNode.classList.add("secondaryText");
              stateNode.innerText = "close";
              break;
            default:
              stateNode.remove();
              break;
          }
          // set name
          let nameNode = templateNode.querySelector(".customcssjsName");
          nameNode.innerText = detail.name;
          // set description
          let descriptionNode = templateNode.querySelector(".customcssjsDescription");
          detail.description ? descriptionNode.innerText = detail.description : descriptionNode.remove();
          // set date
          let dateNode = templateNode.querySelector(".customcssjsDate");
          dateNode.innerText = detail.date;
          // set edit button
          let editBtnNode = templateNode.querySelector(".customcssjsEditBtn");
          let forceflag = false;
          if (detail.state === "forced_on") {
            editBtnNode.innerText = "visibility";
            forceflag = true;
          }
          editBtnNode.addEventListener("click", function () {
            update(detail.name, type, source, forceflag)
          });
          // set delete button
          let delBtnNode = templateNode.querySelector(".customcssjsDelBtn");
          source === "Server" ? delBtnNode.remove()
            : delBtnNode.addEventListener("click", function () {
              del(detail.name, type);
            });
          // append to list
          view.querySelector(`#custom${type}List${source}Description`).classList.remove("hide");
          listNode.appendChild(templateNode);
        }
      } else {
        view.querySelector(`#custom${type}List${source}Description`).classList.add("hide");
      }
    }

    function renderAddBtn(type) {
      let addBtnNode = view.querySelector(`#custom${type}AddBtn`);
      addBtnNode.addEventListener("click", function () {
        update("", type, "Local");
      });
    }

    function  renderLoadBtn() {
      let loadBtnNode = view.querySelector(`#customcssjsLoadBtn`);
      loadBtnNode.addEventListener("click", function () {
        if (typeof MainActivity === "undefined") {
          let href = window.location.href;
          if (href.match(/autostart=false/i)) {
            window.location.href = `index.html?autostart=false`;
          } else if (href.match(/autostart=true/i)) {
            window.location.href = `index.html?autostart=true`;
          } else {
            window.location.reload();
          }
        } else {
          if (document.querySelector("#Carnival")) {
            window.location.href = "index.html";
          } else {
            MainActivity.exitApp();
            setTimeout(function () {
              window.open("emby://items", "_blank")
            }, 150);
          }
        }
      });
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
      let customServer = config[`custom${type}`].filter(item => item.state !== "off");
      customServer.forEach(function (item) {
        if (item.state !== "forced_on") {
          customServerConfig.includes(item.name) ? item.state = "on" : item.state = "off";
        }
      });

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
        customLocal = JSON.parse(customLocal);
      }
      customLocal.forEach(function (item) {
        customLocalConfig.includes(item.name) ? item.state = "on" : item.state = "off";
      })

      return [customServer, customLocal];
    }

    function loadConfiguration() {
      loading.show();
      ApiClient.getJSON(ApiClient.getUrl("CustomCssJS/Scripts", {})).then(function (config) {
        let [customjsServer, customjsLocal] = getCustom("js", config);
        let [customcssServer, customcssLocal] = getCustom("css", config);
        renderConfiguration(customjsServer, "js", "Server");
        renderConfiguration(customjsLocal, "js", "Local");
        renderConfiguration(customcssServer, "css", "Server");
        renderConfiguration(customcssLocal, "css", "Local");
        loading.hide();
      });
    }

    function renderView() {
      loadConfiguration();
      // set add btn
      renderAddBtn("js");
      renderAddBtn("css");
      // set load btn
      renderLoadBtn();
      loading.hide();
    }
  
    view.addEventListener("viewshow", function () {
      renderView();
    });

    view.querySelector('form').addEventListener('submit', onSubmit);

  };
});