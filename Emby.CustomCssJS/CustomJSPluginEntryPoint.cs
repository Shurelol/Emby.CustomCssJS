using MediaBrowser.Common.Configuration;
using MediaBrowser.Controller.Configuration;
using MediaBrowser.Controller.Library;
using MediaBrowser.Controller.Plugins;
using MediaBrowser.Model.IO;
using MediaBrowser.Model.Logging;
using MediaBrowser.Model.Tasks;

namespace Emby.CustomCssJS
{
    public class CustomJSPluginEntryPoint : IServerEntryPoint
    {
        public static CustomJSPluginEntryPoint Instance { get; private set; }
        
        public CustomJSPluginEntryPoint()
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
