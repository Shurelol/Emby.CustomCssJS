# EmbyCustomJS_Css

[中文](README.md)
- **Note the risk of cross-site scripting attacks**
- **This plugin is based on mediabrowser.server.core 4.8.0.24-beta**
- Test (Copy source code to custom JavaScript or Css)
  - [embyLaunchPotplayer](https://greasyfork.org/zh-CN/scripts/459297-embylaunchpotplayer/code)
  - [Emby调用弹弹play](https://greasyfork.org/zh-CN/scripts/443916-emby%E8%B0%83%E7%94%A8%E5%BC%B9%E5%BC%B9play/code)
  - OSD related code cannot be added by JavaScript and Css for the time being

- Admin page：
  - Provide scripts for All users, User can choose to use it or not unless the script is forced on
  

- User page：
  - Choose to use scripts provided by the admin or not
  - Write own scripts, which are stored in localStorage
  - Config of the state of scripts are stored in localStorage, if there is an error, you can reset it