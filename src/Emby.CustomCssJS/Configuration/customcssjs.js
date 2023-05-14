define([
  "loading",
  "confirm",
  "toast",
  "embyRouter",
  "emby-input",
  "emby-button",
  "emby-select",
  "emby-checkbox",
], function (
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
      confirm(`Are you sure you want to delete?`, `Delete ${name}`).then(function () {
        loading.show();
        let config = JSON.parse(localStorage.getItem(`custom${type}Local`)).filter(item => item.name !== name);
        localStorage.setItem(`custom${type}Local`, JSON.stringify(config));
        toast(`${name} deleted`);
        loadConfiguration();
      });
    }
  
    function update(name, type, source) {
      embyRouter.show(`configurationpage?name=customcssjs_update&cname=${name}&type=${type}&source=${source}`);
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
              stateNode.setAttribute("title", "Forced on");
              stateNode.setAttribute("aria-label", "Forced on");
              stateNode.style.color = "var(--theme-accent-text-color)";
              stateNode.innerText = "check_circle";
              break;
            case "on":
              stateNode.setAttribute("title", "On");
              stateNode.setAttribute("aria-label", "On");
              stateNode.style.color = "var(--theme-accent-text-color)";
              stateNode.innerText = "check";
              break;
            case "off":
              stateNode.setAttribute("title", "Off");
              stateNode.setAttribute("aria-label", "Off");
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
          detail.state === "forced_on" ? editBtnNode.remove()
            : editBtnNode.addEventListener("click", function () {
              update(detail.name, type, source)
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
          window.location.reload();
      });
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
      let customServer = config[`custom${type}`].filter(item => item.state !== "off");
      customServer.forEach(function (item) {
        if (item.state !== "forced_on") {
          customConfig.includes(item.name) ? item.state = "on" : item.state = "off";
        }
      });
      // get custom in Local
      let customLocal = localStorage.getItem(`custom${type}Local`);
      if (!customLocal) {
        customLocal = [];
        localStorage.setItem(`custom${type}Local`, JSON.stringify(customLocal));
      } else {
        customLocal = JSON.parse(customLocal);
      }
      return [customServer, customLocal];
    }

    function loadConfiguration() {
      loading.show();
      ApiClient.getPluginConfiguration(pluginUniqueId).then(function (config) {
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

    let pluginUniqueId = "98F76C3D-695F-4082-9220-AD5752E0859D";
  
    view.addEventListener("viewshow", function () {
      renderView();
    });

    view.querySelector('form').addEventListener('submit', onSubmit);

  };
});