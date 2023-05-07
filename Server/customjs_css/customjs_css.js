define(['loading', 'pluginManager', 'appSettings', 'baseView', 'emby-textarea', 'emby-scroller'], function (loading, pluginManager, appSettings, BaseView) {


    function onSubmit(e) {
        e.preventDefault();
        return false;
    }

    function saveSettings(view) {
        let flag = false;
        function collect_setting(key) {
            let custom_count = parseInt(view.querySelector(`#anchorCustom${key}`).value);
            let custom_setting = [];
            if (custom_count) {
                for (let i = 0; i < custom_count; i++) {
                    let custom_content = view.querySelector(`#divCustom${key}_${i + 1}`).children[0].children[0].children[1].value;
                    if (custom_content) {
                        custom_setting.push(custom_content);
                    }
                }
            }
            custom_setting = JSON.stringify(custom_setting);
            return custom_setting;
        }

        let customjs_settings = collect_setting("JS");
        let customjs_setting_old = appSettings.get(`CustomJS`);
        if (customjs_setting_old !== customjs_settings) {
            appSettings.set(`CustomJS`, customjs_settings);
            flag = true;
        }

        let customcss_settings = collect_setting("Css");
        let customcss_setting_old = appSettings.get(`CustomCss`);
        if (customcss_setting_old !== customcss_settings) {
            appSettings.set(`CustomCss`, customcss_settings);
            flag = true;
        }

        if (flag) {
            window.location.reload();
        }

    }

    function renderSettings(view) {
        let custom_form = view.querySelector('#formCustomJS_Css');

        function render_setting(key) {
            let custom_btn_add = view.querySelector(`#btnCustom${key}add`);
            let custom_anchor = view.querySelector(`#anchorCustom${key}`);
            let custom_settings = appSettings.get(`Custom${key}`);
            let custom_count = 0;
            if (custom_settings) {
                custom_settings = JSON.parse(custom_settings);
                if (typeof(custom_settings) !== "object") {
                    custom_settings = [custom_settings];
                }
                for (let i = 0; i < custom_settings.length; i++) {
                    let custom_div = view.querySelector(`#divCustom${key}_0`).cloneNode(true);
                    custom_div.style.display = "";
                    custom_div.id = `divCustom${key}_${i + 1}`;
                    custom_div.children[0].children[0].children[1].value = custom_settings[i];
                    custom_div.children[0].children[1].addEventListener("click", function () {
                        let custom_anchor = view.querySelector(`#anchorCustom${key}`);
                        custom_anchor.value = parseInt(custom_count.value) - 1;
                        this.parentNode.parentNode.remove();
                    });
                    custom_form.insertBefore(custom_div, custom_anchor);
                    custom_count += 1;
                }
            }
            custom_btn_add.value = custom_count;
            custom_anchor.value = custom_count;
            custom_btn_add.addEventListener("click", function () {
                let custom_anchor = view.querySelector(`#anchorCustom${key}`);
                let custom_count = parseInt(this.value);
                let custom_div = view.querySelector(`#divCustom${key}_0`).cloneNode(true);
                custom_div.style.display = "";
                custom_div.id = `divCustom${key}_${custom_count + 1}`;
                custom_div.children[0].children[1].addEventListener("click", function () {
                    this.parentNode.parentNode.remove();
                });
                custom_form.insertBefore(custom_div, custom_anchor);
                this.value = custom_count + 1;
                custom_anchor.value = parseInt(custom_anchor.value) + 1;
            });
        }

        render_setting("JS");
        render_setting("Css");


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
