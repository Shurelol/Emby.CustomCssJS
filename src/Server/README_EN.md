## Server (web)

[中文](README.md)
### import ace.js
- download [ace.js (build)](https://github.com/ajaxorg/ace-builds/archive/refs/heads/master.zip)
- copy folder `src-noconflict` to `\system\dashboard-ui\bower_components` and rename it to ace
- modify `\system\dashboard-ui\index.html`
  - add scripts in `<head></head>`
    ```
    <script src="bower_components/ace/ace.js"></script>
    <script src="bower_components/ace/ext-language_tools.js"></script>
    <script src="bower_components/ace/ext-beautify.js"></script>
    ``` 
### modify Emby
- Copy folder `customjs_css` to `\system\dashboard-ui`
- modify `\system\dashboard-ui\app.js`
  - Add `list.push("./customjs_css/plugin.js"),` before `Promise.all(list.map(loadPlugin))` in `start()`
  
    ```
    list.push("./customjs_css/plugin.js"),
    Promise.all(list.map(loadPlugin))
    ```
***
- if there was a loading error, delete `loadCustom();` in `plugin.js` and restart. You can edit custom JavaScript or Css after then