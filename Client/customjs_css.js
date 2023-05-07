define(['globalize', 'apphost', 'playbackManager', 'pluginManager', 'events', 'embyRouter', 'appSettings', 'userSettings', 'loading', 'dom', 'require', 'connectionManager'], function (globalize, appHost, playbackManager, pluginManager, events, embyRouter, appSettings, userSettings, loading, dom, require, connectionManager) {
    'use strict';

    return function () {

        this.name = 'custom';
        this.type = 'js_css'
        this.id = 'customjs_css';

        this.getRoutes = function () {

            var routes = [];

            routes.push({
                path: 'customjs_css/customjs_css.html',
                transition: 'slide',
                controller: pluginManager.mapPath(this, 'customjs_css/customjs_css.js'),
                type: 'settings',
                title: '自定义JavaScript及Css',
                category: 'Playback',
                thumbImage: '',
                icon: 'tv',
                settingsTheme: true,
                adjustHeaderForEmbeddedScroll: true
            });

            return routes;
        };
    }

})