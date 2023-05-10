## 服务端（网页客户端）

[English](README_EN.md)
### 引入ace.js
- 下载 [ace.js (build)](https://github.com/ajaxorg/ace-builds/archive/refs/heads/master.zip)
- 复制`src-noconflict文件夹`到`\system\dashboard-ui\bower_components`并重命名为ace
- 修改`\system\dashboard-ui\index.html`
  - 在`<head></head>`新增scripts
    ```
    <script src="bower_components/ace/ace.js"></script>
    <script src="bower_components/ace/ext-language_tools.js"></script>
    <script src="bower_components/ace/ext-beautify.js"></script>
    ```
### 修改Emby
- 复制`customjs_css文件夹`到`\system\dashboard-ui`
- 修改`\system\dashboard-ui\app.js`
  - 函数`start()`中`Promise.all(list.map(loadPlugin))`前新增`list.push("./customjs_css/plugin.js"),`  

    ```
    list.push("./customjs_css/plugin.js"),
    Promise.all(list.map(loadPlugin))
    ```
***
- 若添加自定义JS或者Css后页面无法加载，`plugin.js`中删除`loadCustom();`，重启后，编辑自定义JS或者Css
