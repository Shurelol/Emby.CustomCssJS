## Client (electron)
[中文](README.md)
***
- Copy customjs_css and customjs_css.js to \electronapp\plugins
- modify \electronapp\www\app.js
    - Add new function `loadCustom()`
    
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
  - Add `.then(loadCustom)` between `.then(loadHeader)` and `.then(onAppReady)` in `start()`
  
    ```
    .then(loadHeader)
    .then(loadCustom)
    .then(onAppReady)
    ```
***
- if there was a loading error, delete `.then(loadCustom)` and restart. You can edit custom JavaScript or Css after then 