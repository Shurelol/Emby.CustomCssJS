[English](README_EN.md)

### EMBY（Docker服务器端）安装方法
- 本方案仅`emby/embyserver:beta`镜像测试有效，其他镜像请自行测试
- root账户登录ssh，输入以下指令一键安装
```
wget -O script.sh --no-check-certificate https://raw.githubusercontent.com/Shurelol/Emby.CustomCssJS/main/src/script.sh && bash script.sh
```
- 服务器端安装完成，重启容器，网页端的控制台会多出一个自定义JS和CSS的插件，插件内输入自定义js和css代码即可实现对应功能
- 如果不显示插件，请检查映射的`config`文件夹权限是否正确！

### 修改后端（服务端）
- 复制`src\Emby.CustomCssJS.dll`到`programdata\plugins`

### 修改前端（服务端和客户端）
- 服务端
  - 复制`src\CustomCssJS.js`到`system\dashboard-ui\modules`
  - 修改`system\dashboard-ui\app.js`
    - 函数`start()`中`Promise.all(list.map(loadPlugin))`前新增`list.push("./modules/CustomCssJS.js"),`  

      ```
      list.push("./modules/CustomCssJS.js"),
      Promise.all(list.map(loadPlugin))
      ```
- 桌面客户端
  - 复制`src\CustomCssJS.js`到`electronapp\plugins`


- 移动应用（安卓）
  - 复制`src\CustomCssJS.js`到`assets\www\modules`
  - 修改`assets\www\app.js`
    - 函数`start()`中`Promise.all(list.map(loadPlugin))`前新增`list.push("./modules/CustomCssJS.js"),`  

      ```
      list.push("./modules/CustomCssJS.js"),
      Promise.all(list.map(loadPlugin))
      ```
  - 修改`assets\www\native\android\apphost.js`
    - `features.restrictedplugins`设为`false`  

      ```
      features.restrictedplugins = false;
      ```
***
- 服务端脚本启用信息储存在`localStorage`，键值为`customcssServerConfig_${sercerID}`和`customjsServerConfig_${sercerID}`
- 本地脚本启用信息储存在`localStorage`，键值为`customcssLocalConfig`和`customjsLocalConfig`
- 如启用脚本后，无法进入emby，删除`localStorage`中相应数据即可
