define([
  "globalize",
  "loading",
  "confirm",
  "embyRouter",
  "emby-input",
  "emby-button",
  "emby-select",
], function (
  globalize,
  loading,
  confirm,
  embyRouter,
) {
  "use strict";

  return function init(view) {

    function onSubmit(e) {
        e.preventDefault();
        return false;
    }

    function del(name, type) {
      confirm(`${globalize.translate('Delete')} ${name}`).then(function () {
          loading.show();
          ApiClient.getPluginConfiguration(pluginUniqueId).then(function (config) {
            let customPart = config[`custom${type}`];
            config[`custom${type}`] = customPart.filter(item => item.name !== name);
            ApiClient.updatePluginConfiguration(pluginUniqueId, config).then(function (result) {
              Dashboard.processPluginConfigurationUpdateResult(result);
              loadConfiguration();
            });
          });
        }
      )
    }

    function update(name, type) {
      let url = Dashboard.getConfigurationResourceUrl('customcssjs_provider_update').split("/");
      embyRouter.show(url.pop() + `&cname=${name}&type=${type}`);
    }

    function renderConfiguration(config, type) {
      let listNode = view.querySelector(`#custom${type}List`);
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
          // set date
          let dateNode = templateNode.querySelector(".customcssjsDate");
          dateNode.innerText = detail.date;
          // set description
          let descriptionNode = templateNode.querySelector(".customcssjsDescription");
          detail.description ? descriptionNode.innerText = detail.description : descriptionNode.remove();
          // set delete button
          let delBtnNode = templateNode.querySelector(".customcssjsDelBtn");
          delBtnNode.addEventListener("click", function () {
            del(detail.name, type);
          });
          // set edit button
          let editBtnNode = templateNode.querySelector(".customcssjsEditBtn");
          editBtnNode.addEventListener("click", function () {
            update(detail.name, type)
          });
          // append to list
          listNode.appendChild(templateNode);
        }
      }
    }
    
    function renderAddBtn(type) {
      let addBtnNode = view.querySelector(`#custom${type}AddBtn`);
      addBtnNode.addEventListener("click", function () {
        update("", type)
      });
    }

    
    function loadConfiguration() {
      ApiClient.getPluginConfiguration(pluginUniqueId).then(function (config) {
        renderConfiguration(config[`customjs`], "js");
        renderConfiguration(config[`customcss`], "css");
        loading.hide();
      });
    }
    
    function renderView() {
      loadConfiguration();
      // set add button
      renderAddBtn("js");
      renderAddBtn("css");
      loading.hide();
    }
    
    let pluginUniqueId = "98F76C3D-695F-4082-9220-AD5752E0859D";

    view.addEventListener("viewshow", function () {
      loading.show();
      renderView();
    });

    view.querySelector('form').addEventListener('submit', onSubmit);

  };
});