using MediaBrowser.Common.Configuration;
using MediaBrowser.Controller.Configuration;
using MediaBrowser.Controller.Library;
using MediaBrowser.Controller.Plugins;
using MediaBrowser.Model.IO;
using MediaBrowser.Model.Logging;
using MediaBrowser.Model.Services;
using MediaBrowser.Model.Tasks;

namespace Emby.CustomCssJS
{
    public class CustomCssJSPluginEntryPoint : IServerEntryPoint
    {
        public static CustomCssJSPluginEntryPoint Instance { get; private set; }
        
        public CustomCssJSPluginEntryPoint()
        {
            
        }

        public void Run()
        {
            
        }

        public void Dispose()
        {
        }

        
    }
}
