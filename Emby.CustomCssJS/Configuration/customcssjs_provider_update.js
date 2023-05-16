define([
  "loading",
  "alert",
  "embyRouter",
  "emby-input",
  "emby-button",
  "emby-select",
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
      let editor = window.ace.edit("customjscssContent");
      let content = editor.getValue();
      if (!name) {
        alert("Name cannot be empty");
        return;
      }
      let annotations = editor.getSession().getAnnotations();
      for (let annotation of annotations) {
        if (annotation.type === "error") {
          alert("Code error");
          return;
        }
      }
      ApiClient.getPluginConfiguration(pluginUniqueId).then(function (config) {
        let customPart = config[`custom${type}`];
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
          editor.destroy();
          editor.container.remove();
          let url = Dashboard.getConfigurationResourceUrl('customcssjs_provider').split("/");
          embyRouter.show(url.pop());
        });
      });
    }

    function init_editor() {
      if (!window.ace) {
        let xhr = new XMLHttpRequest();
        let url = Dashboard.getConfigurationResourceUrl('customcssjs_ace');
        xhr.open('GET', url, false);
        xhr.send();
        let acejs = new Function(xhr.responseText);
        acejs();
        window.ace = ace;
      }
      let editor = window.ace.edit("customjscssContent");
      let rootStyle = getComputedStyle(document.documentElement);
      let colorNow = rootStyle.getPropertyValue('--theme-accent-text-color').toString();
      let colorLight = rootStyle.getPropertyValue('--theme-accent-text-color-lightbg').toString();
      let colorDark = rootStyle.getPropertyValue('--theme-accent-text-color-darkbg').toString();
      let theme;
      if (colorNow.includes(colorDark)) {
        theme = "one_dark";
      } else if (colorNow.includes(colorLight)) {
        theme = "xcode";
      } else {
        theme = "one_dark";
      }
      editor.setTheme(`ace/theme/${theme}`);
      editor.setFontSize(15);
      editor.setOption("wrap", "free");
      editor.setOptions({
          fontFamily: "Consolas, Monaco, monospace",
          enableBasicAutocompletion: true,
          enableSnippets: true,
          enableLiveAutocompletion: true,
      });
      editor.setShowPrintMargin(false);
      return editor;
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
      let editor = init_editor();
      let mode;
      switch (type) {
        case "css":
          mode = "ace/mode/css";
          break;
        case "js":
          mode = "ace/mode/javascript";
          break;
        default:
          mode = "ace/mode/javascript";
      }
      editor.session.setMode(mode);
      editor.setReadOnly(false);
      editor.setValue(content);
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

    view.addEventListener("viewbeforehide", function () {
      view.querySelector(`#customjscssContent`).remove();
    });

    view.querySelector('form').addEventListener('submit', onSubmit);

  };
});
