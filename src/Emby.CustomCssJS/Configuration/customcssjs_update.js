define([
  "loading",
  "alert",
  "toast",
  "embyRouter",
  "emby-input",
  "emby-button",
  "emby-select",
  "emby-textarea",
], function (
  loading,
  alert,
  toast,
  embyRouter,
) {
  "use strict";

  return function init(view, params) {

    function onSubmit(e) {
        e.preventDefault();
        return false;
    }

    function save(type, source, nameOld) {
      let name = view.querySelector(`#customjscssName`).value;
      let state = view.querySelector(`#customjscssState`).value;
      if (source === "Server") {
        let customConfig = JSON.parse(localStorage.getItem(`custom${type}Config`)).filter(item => item.name !== nameOld);
        if (state === "on") {
          customConfig.push(name)
        }
        localStorage.setItem(`custom${type}Config`, JSON.stringify(customConfig));
      } else if (source === "Local") {
        let description = view.querySelector(`#customjscssDescription`).value;
        let content = view.querySelector(`#customjscssContent`).value;
        if (!name) {
          alert("Name cannot be empty");
          return;
        }
        let customLocal = JSON.parse(localStorage.getItem(`custom${type}Local`));
        let customLocalNew = customLocal.filter(item => item.name !== name && item.name !== nameOld);
        if (!nameOld) {
          // add
          if (customLocal.length !== customLocalNew.length) {
            alert("Name already exists");
            return;
          }
        } else {
          // edit
          if (customLocal.length - 1 !== customLocalNew.length) {
            alert("Name already exists");
            return;
          }
        }
        customLocalNew.push({
          name: name,
          description: description,
          state: state,
          date: new Date().toLocaleString(),
          content: content
        });
        localStorage.setItem(`custom${type}Local`, JSON.stringify(customLocalNew));
      }
      toast(`${name} saved`);
      loadConfiguration("type");
      embyRouter.show(`configurationpage?name=customcssjs`);
    }

    function renderConfiguration(type, source, name, description, state, content) {
      // set name
      let nameNode = view.querySelector(`#customjscssName`);
      nameNode.value = name;
      nameNode.disable = (source === "Server");
      // set description
      let descriptionNode = view.querySelector(`#customjscssDescription`);
      descriptionNode.value = description;
      descriptionNode.defer = (source === "Server");
      // set state
      let stateNode = view.querySelector(`#customjscssState`);
      stateNode.value = state;
      // set content
      let contentNode = view.querySelector(`#customjscssContent`);
      contentNode.value = content;
    }

    function loadConfiguration(type, source, name) {
      if (name) {
        if (source === "Server") {
          ApiClient.getPluginConfiguration(pluginUniqueId).then(function (config) {
            let detail = config[`custom${type}`].find(item => item.name === name);
            detail ? renderConfiguration(type, source, detail.name, detail.description, detail.state, detail.content)
              : renderConfiguration(type, source, "", "", "off", "");
          });
        } else if (source === "Local") {
          let detail = JSON.parse(localStorage.getItem(`custom${type}Local`)).find(item => item.name === name);
          detail ? renderConfiguration(type, source, detail.name, detail.description, detail.state, detail.content)
            : renderConfiguration(type, source, "", "", "off", "");
        }
      } else {
        renderConfiguration(type, source, "", "", "off", "");
      }
    }

    function renderView(params) {
      let type = params.type;
      let source = params.source;
      let name = params.cname;
      loadConfiguration(type, source, name);
      // set save btn
      let saveBtnNode = view.querySelector("#customjscssSaveBtn");
      saveBtnNode.addEventListener("click", function () {
        save(type, source, name);
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
