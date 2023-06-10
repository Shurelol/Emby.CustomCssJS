using MediaBrowser.Controller.Net;
using MediaBrowser.Model.Services;
using Emby.CustomCssJS.Configuration;
using System;

namespace Emby.CustomCssJS.Api
{
    [Route("/CustomCssJS/Scripts", "GET", Summary = "Gets CustomCssJS Scripts")]
    [Authenticated(FeatureIds = new String[] { "customcssjs" })]
    public class GetCustomCssJSscripts : IReturn<PluginConfiguration>

    {

    }

    public class CustomCssJSApi : IService, IRequiresRequest
    {
        private readonly IHttpResultFactory _resultFactory;

        public IRequest Request { get; set; }

        public CustomCssJSApi(IHttpResultFactory resultFactory)
        {
            _resultFactory = resultFactory;
        }

        public object GET (GetCustomCssJSscripts request)
        {
            return Plugin.Instance.Configuration;
        }

    }
}