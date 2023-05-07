## 客户端（electron）
***
- 复制customjs_css文件夹及customjs_css.js到\electronapp\plugins
- 修改\electronapp\www\app.js
    - 新增函数loadCustom
      ```
      function loadCustom() {
        require(['appSettings'], function (appSettings) {
          try {
            let customcss_settings = appSettings.get("CustomCss");
            if (customcss_settings) {
              customcss_settings = JSON.parse(customcss_settings);
              if (typeof(customcss_settings) !== "object") {
                customcss_settings = [customcss_settings];
              }
              for (let i = 0; i < customcss_settings.length; i++) {
                let s = document.createElement("style");
                s.type = "text/css";
                s.innerHTML = customcss_settings;
                document.head.appendChild(s);
              }
            }
          } catch (err) {
            console.warn(`swiper an error: ${err.message}`);
          }
          try {
            let customjs_settings = appSettings.get("CustomJS");
            if (customjs_settings) {
              customjs_settings = JSON.parse(customjs_settings);
              if (typeof(customjs_settings) !== "object") {
                customjs_settings = [customjs_settings];
              }
              for (let i = 0; i < customjs_settings.length; i++) {
                eval(customjs_settings[i]);
              }
            }
          } catch (err) {
            console.warn(`swiper an error: ${err.message}`);
          }
        });
      }
      ```
  - 函数start中.then(loadHeader)和.then(onAppReady)间新增.then(loadCustom)
    ```
    .then(loadHeader)
    .then(loadCustom)
    .then(onAppReady)
    ```
***
- 若添加自定义JS或者Css后页面无法加载，app.js中删除.then(loadCustom)，重启后，编辑自定义JS或者Css
