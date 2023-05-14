[English](README_EN.md)
### 修改后端（服务端）
- 复制`src\Emby.CustomCssJS.dll`到`system\plugins`

### 修改前端（服务端和客户端）
- 服务端
  - 复制`src\CustomCssJS.js`到`system\dashboard-ui\modules`
  - 修改`system\dashboard-ui\app.js`
    - 函数`start()`中`Promise.all(list.map(loadPlugin))`前新增`list.push("./modules/CustomCssJS.js"),`  

      ```
      list.push("./modules/CustomCssJS.js"),
      Promise.all(list.map(loadPlugin))
      ```
- 客户端
  - 复制`src\CustomCssJS.js`到`electronapp\www\modules\modules`
  - 修改`electronapp\www\modules\app.js`
    - 函数`start()`中`Promise.all(list.map(loadPlugin))`前新增`list.push("./modules/CustomCssJS.js"),`  

      ```
      list.push("./modules/CustomCssJS.js"),
      Promise.all(list.map(loadPlugin))
      ```