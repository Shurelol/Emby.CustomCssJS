using System;
using System.IO;
using System.Linq;
using System.Collections.Generic;
using MediaBrowser.Common.Configuration;
using MediaBrowser.Model.Serialization;
using MediaBrowser.Model.Plugins;
using MediaBrowser.Model.Services;
using Emby.CustomCssJS.Configuration;
using MediaBrowser.Common.Plugins;
using MediaBrowser.Model.Drawing;


namespace Emby.CustomCssJS
{
    /// <summary>Class Plugin</summary>
    public class Plugin : MediaBrowser.Common.Plugins.BasePlugin<PluginConfiguration>, IHasWebPages, IHasThumbImage, IHasTranslations
    {
        public Plugin(IApplicationPaths applicationPaths, IXmlSerializer xmlSerializer) 
            : base(applicationPaths, xmlSerializer)
        {
            Instance = this;
        }

        public IEnumerable<PluginPageInfo> GetPages()
        {
            return new[]
            {
                new PluginPageInfo
                {
                    Name = "customcssjs",
                    DisplayName = "Custom Css and JavaScrip}",
                    EmbeddedResourcePath = GetType().Namespace + ".Configuration.customcssjs.html",
                    EnableInMainMenu = false,
                    EnableInUserMenu = true,
                    IsMainConfigPage = true,
                    MenuIcon = "tune",
                    FeatureId = "customcssjs"
                },
                new PluginPageInfo
                {
                    Name = "customcssjsjs",
                    EmbeddedResourcePath = GetType().Namespace + ".Configuration.customcssjs.js",
                },
                new PluginPageInfo
                {
                    Name = "customcssjs_update",
                    DisplayName = "Custom Css and JavaScript",
                    EmbeddedResourcePath = GetType().Namespace + ".Configuration.customcssjs_update.html",
                },
                new PluginPageInfo
                {
                    Name = "customcssjs_updatejs",
                    EmbeddedResourcePath = GetType().Namespace + ".Configuration.customcssjs_update.js",
                },
                new PluginPageInfo
                {
                    Name = "customcssjs_provider",
                    DisplayName = "CustomCssJS Provider",
                    EmbeddedResourcePath = GetType().Namespace + ".Configuration.customcssjs_provider.html",
                    EnableInMainMenu = true,
                    EnableInUserMenu = false,
                    IsMainConfigPage = true,
                    MenuSection = "server",
                    MenuIcon = "settings"
                },
                new PluginPageInfo
                {
                    Name = "customcssjs_providerjs",
                    EmbeddedResourcePath = GetType().Namespace + ".Configuration.customcssjs_provider.js",
                },
                new PluginPageInfo
                {
                    Name = "customcssjs_provider_update",
                    DisplayName = "CustomCssJS Provider",
                    EmbeddedResourcePath = GetType().Namespace + ".Configuration.customcssjs_provider_update.html",
                },
                new PluginPageInfo
                {
                    Name = "customcssjs_provider_updatejs",
                    EmbeddedResourcePath = GetType().Namespace + ".Configuration.customcssjs_provider_update.js",
                },
                new PluginPageInfo
                {
                    Name = "customcssjs_ace",
                    EmbeddedResourcePath = GetType().Namespace + ".Configuration.customcssjs_ace.js",
                },
                new PluginPageInfo
                {
                    Name = "customcssjs_ace_worker-javascript",
                    EmbeddedResourcePath = GetType().Namespace + ".Configuration.customcssjs_ace_worker-javascript.js",
                },
                new PluginPageInfo
                {
                    Name = "customcssjs_ace_worker-css",
                    EmbeddedResourcePath = GetType().Namespace + ".Configuration.customcssjs_ace_worker-css.js",
                }
            };
        }


        public override Guid Id => new Guid("98F76C3D-695F-4082-9220-AD5752E0859D");

        /// <summary>Gets the name of the plugin</summary>
        /// <value>The name.</value>

        public override string Name => "Custom Css and JavaScript";

        /// <summary> Gets the description.</summary>
        /// <value>The description.</value>

        public override string Description => "Custom Css and JavaScript for Emby";

        /// <summary>Gets the instance.</summary>
        /// <value>The instance.</value>
        public static Plugin Instance { get; private set; }

        public TranslationInfo[] GetTranslations()
        {
            var basePath = GetType().Namespace + ".strings.";

            return GetType()
                .Assembly
                .GetManifestResourceNames()
                .Where(i => i.StartsWith(basePath, StringComparison.OrdinalIgnoreCase))
                .Select(i => new TranslationInfo
                {
                    Locale = Path.GetFileNameWithoutExtension(i.Substring(basePath.Length)),
                    EmbeddedResourcePath = i

                }).ToArray();
        }

        public ImageFormat ThumbImageFormat => ImageFormat.Jpg;

        //Display Thumbnail image for Plugin Catalogue  - you will need to change build action for thumb.jpg to embedded Resource
        public Stream GetThumbImage()
        {
            Type type = GetType();
            return type.Assembly.GetManifestResourceStream(type.Namespace + ".thumb.jpg");
        }
    }
}
