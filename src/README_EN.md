[中文](README.md)
### modify back-end (Server)
- Copy `src\Emby.CustomCssJS.dll` to `programdata\plugins`

### modify front-end (Server and Client)
- Server
  - Copy `src\CustomCssJS.js` to `system\dashboard-ui\modules`
  - modify `\system\dashboard-ui\app.js`
    - Add `list.push("./modules/CustomCssJS.js"),` before `Promise.all(list.map(loadPlugin))` in `start()`
  
      ```
      list.push("./modules/CustomCssJS.js"),
      Promise.all(list.map(loadPlugin))
      ```
- Desktop Client
  - Copy `src\CustomCssJS.js` to `electronapp\plugins`


- App (Android)
  - Copy `src\CustomCssJS.js` to `assets\www\modules`
  - modify `assets\www\app.js`
    - Add `list.push("./modules/CustomCssJS.js"),` before `Promise.all(list.map(loadPlugin))` in `start()`
  
      ```
      list.push("./modules/CustomCssJS.js"),
      Promise.all(list.map(loadPlugin))
      ```
  - modify `assets\www\native\android\apphost.js`
    - Set `features.restrictedplugins` to `false`
  
      ```
      features.restrictedplugins = false;
      ```
***
- State config of Server Scripts stored in `localStorage`, key: `customcssServerConfig_${sercerID}` and `customjsServerConfig_${sercerID}`
- State config of Local Scripts stored in `localStorage`, key: `customcssLocalConfig` and `customjsLocalConfig`
- If error occurred, del these data in `localStorage`