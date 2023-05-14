# Emby自定义JavaScript及Css

[English](README_EN.md)
- **注意XSS风险，出现任何问题后果自负**
- **此插件基于 mediabrowser.server.core 4.8.0.24-beta**
- 测试（粘贴代码到自定义JavaScript或Css）
  - [embyLaunchPotplayer](https://greasyfork.org/zh-CN/scripts/459297-embylaunchpotplayer/code)
  - [Emby调用弹弹play](https://greasyfork.org/zh-CN/scripts/443916-emby%E8%B0%83%E7%94%A8%E5%BC%B9%E5%BC%B9play/code)
  - 弹幕相关插件暂时无法通过JavaScript及Css添加

- 管理员页面：
  - 为所有用户提供脚本，用户可以选择使用（强制开启的强制使用）
  

- 用户页面：
  - 管理员提供的脚本可以选择使用
  - 用户自定义的脚本储存在本地（localStorage）
  - 脚本启用信息储存在本地（localStorage），加载有错误可重置还原

