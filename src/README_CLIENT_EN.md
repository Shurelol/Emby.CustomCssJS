## Client (electron)

[中文](README_CLIENT.md)
### import ace.js
- download [ace.js (build)](https://github.com/ajaxorg/ace-builds/archive/refs/heads/master.zip)
- copy folder `src-noconflict` to `\electronapp\www\bower_components` and rename it to ace
- modify `\electronapp\www\index.html`
  - add scripts in `<head></head>`
    ```
    <script src="bower_components/ace/ace.js"></script>
    <script src="bower_components/ace/ext-language_tools.js"></script>
    <script src="bower_components/ace/ext-beautify.js"></script>
    ``` 
### modify Emby
- Copy folder `customjs_css` to `\electronapp\www`
- modify `\electronapp\www\app.js`
  - Add `list.push("./customjs_css/plugin.js"),` before `Promise.all(list.map(loadPlugin))` in `start()`
  
    ```
    list.push("./customjs_css/plugin.js"),
    Promise.all(list.map(loadPlugin))
    ```
***
- if there was a loading error, delete `loadCustom();` in `plugin.js` and restart. You can edit custom JavaScript or Css after then