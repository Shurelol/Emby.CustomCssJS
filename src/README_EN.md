[中文](README.md)
### modify back-end (Server)
- Copy `src\Emby.CustomCssJS.dll` to `system\plugins`

### modify front-end (Server and Client)
- Server
  - Copy `src\CustomCssJS.js` to `system\dashboard-ui\modules`
  - modify `\system\dashboard-ui\app.js`
    - Add `list.push("./customjs_css/plugin.js"),` before `Promise.all(list.map(loadPlugin))` in `start()`
  
      ```
      list.push("./modules/CustomCssJS.js"),
      Promise.all(list.map(loadPlugin))
      ```
- Client
  - Copy `src\CustomCssJS.js` to `electronapp\www\modules`
  - modify `electronapp\www\modules\app.js`
    - Add `list.push("./customjs_css/plugin.js"),` before `Promise.all(list.map(loadPlugin))` in `start()`
  
      ```
      list.push("./modules/CustomCssJS.js"),
      Promise.all(list.map(loadPlugin))
      ```