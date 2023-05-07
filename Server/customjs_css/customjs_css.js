define(['loading', 'pluginManager', 'appSettings', 'baseView', 'emby-textarea', 'emby-scroller'], function (loading, pluginManager, appSettings, BaseView) {

    function onSubmit(e) {
        e.preventDefault();
        return false;
    }

    function saveSettings(view) {
        let flag = view.querySelector("#txtCustomJS").value !== appSettings.get("CustomJS") || view.querySelector("#txtCustomCss").value !== appSettings.get("CustomCss")
        appSettings.set('CustomJS', view.querySelector("#txtCustomJS").value);
        appSettings.set('CustomCss', view.querySelector("#txtCustomCss").value);
        if (flag) {
            window.location.reload();
        }

    }

    function renderSettings(view) {

        view.querySelector("#txtCustomJS").value = appSettings.get("CustomJS")||"";
        view.querySelector("#txtCustomCss").value = appSettings.get("CustomCss")||"";
    }

    function SettingsView(view, params) {

        BaseView.apply(this, arguments);

        view.querySelector('form').addEventListener('submit', onSubmit);
    }

    Object.assign(SettingsView.prototype, BaseView.prototype);

    SettingsView.prototype.onResume = function (options) {

        BaseView.prototype.onResume.apply(this, arguments);

        loading.hide();

        if (options.refresh) {
            renderSettings(this.view);
        }
    };

    SettingsView.prototype.onPause = function () {

        saveSettings(this.view);

        BaseView.prototype.onPause.apply(this, arguments);
    };

    return SettingsView;
});
