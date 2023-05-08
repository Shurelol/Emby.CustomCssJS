## 服务端（所有网页客户端）

[English](README_EN.md)
- 复制customjs_css文件夹到\system\dashboard-ui
- 修改\system\dashboard-ui\app.js
    - 函数`onAppReady()`中新增路由（可放置在路由`database`下面，搜索`path: "/database"`）  
    
      ```
      appRouter.addRoute({
        contentPath: "/customjs_css/customjs_css.html",
        path: "/customjs_css",
        autoFocus: !1,
        roles: "admin",
        controller: "customjs_css/customjs_css.js",
        controllerType: "module",
        title: "自定义JavaScript及Css",
        settingsTheme: !0,
        clearBackdrop: !0,
        adjustHeaderForEmbeddedScroll: !0,
      }),
      ```
    - 新增函数`loadCustom()`
    
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
  - 函数`start()`中`.then(loadHeader)`和`.then(onAppReady)`间新增`.then(loadCustom)`
  
    ```
    .then(loadHeader)
    .then(loadCustom)
    .then(onAppReady)
    ```
- 修改\system\dashboard-ui\modules\navdrawer\navdrawercontent.js  
    - 函数`getAdminMenuItems()`中新增导航（可放置在导航`Conversions`下，搜索`/conversions?mode=convert`） 
    
      ```
      links.push({
        Name: "自定义JavaScript及Css",
        Icon: "tv",
        href: "/customjs_css",
      }),
      ```
***
- 若添加自定义JS或者Css后页面无法加载，app.js中删除`.then(loadCustom)`，重启后，编辑自定义JS或者Css
