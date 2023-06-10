define([
  "globalize",
  "loading",
  "alert",
  "toast",
  "embyRouter",
  "emby-input",
  "emby-button",
  "emby-select",
], function (
  globalize,
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
      let editor = window.ace.edit("customjscssContent");
      let customConfigName;
      if (source === "Local") {
        let description = view.querySelector(`#customjscssDescription`).value;
        let content = editor.getValue();
        if (!name) {
          alert(globalize.translate("Name cannot be empty"));
          return;
        }
        let annotations = editor.getSession().getAnnotations();
        for (let annotation of annotations) {
          if (annotation.type === "error") {
            alert(globalize.translate("Code error"));
            return;
          }
        }
        let customLocal = JSON.parse(localStorage.getItem(`custom${type}Local`));
        let customLocalNew = customLocal.filter(item => item.name !== name && item.name !== nameOld);
        if (!nameOld) {
          // add
          if (customLocal.length !== customLocalNew.length) {
            alert(globalize.translate("Name already exists"));
            return;
          }
        } else {
          // edit
          if (customLocal.length - 1 !== customLocalNew.length) {
            alert(globalize.translate("Name already exists"));
            return;
          }
        }
        customLocalNew.push({
          name: name,
          description: description,
          date: new Date().toLocaleString(),
          content: content
        });
        localStorage.setItem(`custom${type}Local`, JSON.stringify(customLocalNew));
        customConfigName = `custom${type}${source}Config`;
      } else if (source === "Server") {
        let serverId = ApiClient.serverId();
        customConfigName = `custom${type}${source}Config_${serverId}`;
      }
      // save state
      if (customConfigName) {
        let customConfig = JSON.parse(localStorage.getItem(customConfigName)).filter(item => item !== nameOld && item !== name);
        if (state === "on") {
          customConfig.push(name)
        }
        localStorage.setItem(customConfigName, JSON.stringify(customConfig));
      }
      // send message and redirect
      toast(`${name} ${globalize.translate('saved')}`);
      editor.destroy();
      editor.container.remove();
      let url = Dashboard.getConfigurationResourceUrl('customcssjs').split("/");
      embyRouter.show(url.pop());
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

    function renderConfiguration(type, source, name, description, state, content) {
      // set name
      let nameNode = view.querySelector(`#customjscssName`);
      nameNode.value = name;
      nameNode.readOnly = (source === "Server");
      // set description
      let descriptionNode = view.querySelector(`#customjscssDescription`);
      descriptionNode.value = description;
      descriptionNode.readOnly = (source === "Server");
      // set state
      let stateDivNode = view.querySelector(`#customjscssStateDiv`);
      if (params.forceflag) {
        stateDivNode.classList.add("hide");
      } else {
        stateDivNode.classList.remove("hide");
        let stateNode = view.querySelector(`#customjscssState`);
        stateNode.value = state;
      }
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
      editor.setReadOnly(source === "Server");
      editor.setValue(content);
    }

    function loadConfiguration(type, source, name) {
      if (name) {
        if (source === "Server") {
          ApiClient.getJSON(ApiClient.getUrl("CustomCssJS/Scripts", {})).then(function (config) {
            let detail = config[`custom${type}`].find(item => item.name === name);
            let serverId = ApiClient.serverId();
            let customServerConfig = JSON.parse(localStorage.getItem(`custom${type}ServerConfig_${serverId}`));
            detail.state = customServerConfig.includes(detail.name) ? "on" : "off";
            detail ? renderConfiguration(type, source, detail.name, detail.description, detail.state, detail.content)
              : renderConfiguration(type, source, "", "", "off", "");
          });
        } else if (source === "Local") {
          let detail = JSON.parse(localStorage.getItem(`custom${type}Local`)).find(item => item.name === name);
          let customLocalConfig = JSON.parse(localStorage.getItem(`custom${type}LocalConfig`));
          detail.state = customLocalConfig.includes(detail.name) ? "on" : "off";
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
      params.forceflag = params.forceflag !== "false";
      loadConfiguration(type, source, name);
      // set save btn
      let saveBtnDivNode = view.querySelector("#customjscssSaveBtnDiv");
      if (params.forceflag) {
        saveBtnDivNode.classList.add("hide");
      } else {
        saveBtnDivNode.classList.remove("hide");
        let saveBtnNode = view.querySelector("#customjscssSaveBtn");
        saveBtnNode.addEventListener("click", function () {
          save(type, source, name);
        });
      }
      loading.hide();
    }

    view.addEventListener("viewshow", function () {
      loading.show();
      renderView(params);
    });

    view.addEventListener("viewbeforehide", function () {
      let editor = view.querySelector(`#customjscssContent`);
      if (editor) {
        editor.remove();
      }
    });

    view.querySelector('form').addEventListener('submit', onSubmit);

  };
});
