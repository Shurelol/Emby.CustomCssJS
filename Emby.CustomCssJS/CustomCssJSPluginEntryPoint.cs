using System;
using System.IO;
using MediaBrowser.Controller;
using MediaBrowser.Controller.Plugins;
using MediaBrowser.Model.Logging;

namespace Emby.CustomCssJS
{
    public class CustomCssJSPluginEntryPoint : IServerEntryPoint
    {
        public static CustomCssJSPluginEntryPoint Instance { get; private set; }
        private readonly string _uiPath;
        private readonly ILogger _logger;

        public CustomCssJSPluginEntryPoint(IServerApplicationPaths p, ILogManager lm)
        {
            _uiPath = Path.Combine(p.ApplicationResourcesPath, "dashboard-ui");
            _logger = lm.GetLogger("CustomCssJs");
        }

        public void Run()
        {
            CreateJs();
            Inject();
        }

        /// <summary>
        /// 检测 modules/CustomCssJS.js 是否存在, 不存在时创建.
        /// </summary>
        private void CreateJs()
        {
            var jsPath = Path.Combine(_uiPath, "modules", "CustomCssJS.js");
            _logger.Info("CustomCssJS.js path: " + jsPath);

            if (File.Exists(jsPath)) return;
            using (var src = GetType().Assembly.GetManifestResourceStream(GetType().Namespace + ".CustomCssJS.js"))
            using (var target = new FileStream(jsPath, FileMode.Create, FileAccess.Write))
            {
                src?.CopyTo(target);
            }
            _logger.Info("Create CustomCssJS.js successfully");
        }

        /// <summary>
        /// 向 app.js 注入加载 CustomCssJS.js 的代码.
        /// </summary>
        private void Inject()
        {
            var jsPath = Path.Combine(_uiPath, "app.js");
            _logger.Info("app.js path: " + jsPath);

            const string search = "Promise.all(list.map(loadPlugin))";
            const string inject = "list.push(\"./modules/CustomCssJS.js\"),";

            var content = File.ReadAllText(jsPath);
            if (content.IndexOf(inject + search, StringComparison.Ordinal) != -1) return;

            var index = content.IndexOf(search, StringComparison.Ordinal);
            if (index == -1) return;
            content = content.Insert(index, inject);
            File.WriteAllText(jsPath, content);
            _logger.Info("Inject app.js successfully");
        }

        public void Dispose()
        {
        }
    }
}