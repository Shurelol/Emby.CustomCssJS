define([
  "loading",
  "alert",
  "embyRouter",
  "emby-input",
  "emby-button",
  "emby-select",
  "emby-textarea",
], function (
  loading,
  alert,
  embyRouter,
) {
  "use strict";

  return function init(view, params) {

    function onSubmit(e) {
        e.preventDefault();
        return false;
    }

    function save(type, nameOld) {
      let name = view.querySelector(`#customjscssName`).value;
      let description = view.querySelector(`#customjscssDescription`).value;
      let state = view.querySelector(`#customjscssState`).value;
      let content = view.querySelector(`#customjscssContent`).value;
      if (!name) {
        alert("Name cannot be empty");
        return;
      }
      ApiClient.getPluginConfiguration(pluginUniqueId).then(function (config) {
        let customPart = config[`custom${params.type}`];
        let customPartNew = customPart.filter(item => item.name !== name && item.name !== nameOld);
        if (!nameOld) {
          // add
          if (customPart.length !== customPartNew.length) {
            alert("Name already exists");
            return;
          }
        } else {
          // edit
          if (customPart.length - 1 !== customPartNew.length) {
            alert("Name already exists");
            return;
          }
        }
        customPartNew.push({
          name: name,
          description: description,
          state: state,
          date: new Date().toLocaleString(),
          content: content
        });
        config[`custom${params.type}`] = customPartNew;
        ApiClient.updatePluginConfiguration(pluginUniqueId, config).then(function (result) {
          Dashboard.processPluginConfigurationUpdateResult(result);
          embyRouter.show(`configurationpage?name=customcssjs_provider`);
        });
      });
    }

    function renderConfiguration(type, name, description, state, content) {
      // set name
      let nameNode = view.querySelector(`#customjscssName`);
      nameNode.value = name;
      // set description
      let descriptionNode = view.querySelector(`#customjscssDescription`);
      descriptionNode.value = description;
      // set state
      let stateNode = view.querySelector(`#customjscssState`);
      stateNode.value = state;
      // set content
      let contentNode = view.querySelector(`#customjscssContent`);
      contentNode.value = content;
    }

    function loadConfiguration(type, name) {
      if (name) {
        ApiClient.getPluginConfiguration(pluginUniqueId).then(function (config) {
          let detail = config[`custom${type}`].find(item => item.name === name);
          detail ? renderConfiguration(type, detail.name, detail.description, detail.state, detail.content)
            : renderConfiguration(type, "", "", "off", "");
        });
      } else {
        renderConfiguration(type, "", "", "off", "");
      }
    }

    function renderView(params) {
      let type = params.type;
      let name = params.cname;
      loadConfiguration(type, name);
      // set save btn
      let saveBtnNode = view.querySelector("#customjscssSaveBtn");
      saveBtnNode.addEventListener("click", function () {
        save(type, name);
      });
      loading.hide();
    }

    let pluginUniqueId = "98F76C3D-695F-4082-9220-AD5752E0859D";

    view.addEventListener("viewshow", function () {
      loading.show();
      renderView(params);
    });

    view.querySelector('form').addEventListener('submit', onSubmit);

  };
});
