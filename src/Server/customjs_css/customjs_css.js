define(['embyRouter', 'loading', 'pluginManager', 'appSettings', 'baseView', 'emby-textarea', 'emby-scroller'], function (embyRouter, loading, pluginManager, appSettings, BaseView) {

    function onSubmit(e) {
        e.preventDefault();
        return false;
    }

    function reload() {
        window.location.reload();
    }

    function renderSettings(view, userflag) {
        //初始化代码编辑器
        function update(type, name=""){
            let url = pluginManager.mapRoute(
                        "customjs_css",
                        "customjs_css_update.html"
                    );
            embyRouter.show(`${url}?type=${type}&name=${name}`);
        }
        
        function render_setting(type){
            let list = view.querySelector(`#listCustom${type}`);
            let custom_settings = appSettings.get(`Custom${type}`);
            if (custom_settings) {
                custom_settings = JSON.parse(custom_settings);
                let custom_settings_local = localStorage.getItem(`Custom${type}local`);
                console.warn(custom_settings_local)
                custom_settings_local = custom_settings_local ? JSON.parse(custom_settings_local) : {};
                for (let name in custom_settings) {
                    let detail = custom_settings[name];
                    let date = detail.date;
                    let enabled = detail.enabled;
                    let list_item = view.querySelector(`#listitemCustom${type}_0`).cloneNode(true);
                    list_item.style.display = "";
                    list_item.id = `listitemCustom${type}_${name}`;
                    if (enabled === "1") {
                        list_item.children[0].children[0].children[1].style.display = "none";
                    } else {
                        list_item.children[0].children[0].children[0].style.display = "none";
                    }
                    if((custom_settings_local.hasOwnProperty(name) && custom_settings_local[name] === "1")){
                        list_item.children[0].children[1].children[1].style.display = "none";
                    } else {
                        list_item.children[0].children[1].children[0].style.display = "none";
                    }
                    // name
                    list_item.children[0].children[2].children[0].innerText = decodeURIComponent(name);
                    // date
                    if (date) {
                        list_item.children[0].children[2].children[1].innerText = date;
                    }
                    // btn edit
                    list_item.children[0].children[3].addEventListener("click", function () {
                        update(type, name);
                    });
                    // btn del
                    if (userflag) {
                        list_item.children[0].children[4].addEventListener("click", function () {
                            delete custom_settings[name];
                            appSettings.set(`Custom${type}`, JSON.stringify(custom_settings));
                            this.parentNode.parentNode.remove();
                        });
                    } else {
                        list_item.children[0].children[4].remove()
                    }

                    list.appendChild(list_item);
                }
            }

            // btn add
            view.querySelector(`#btnCustom${type}add`).addEventListener("click", function () {
                update(type);
            });

        }

        render_setting("JS");
        render_setting("Css");
        view.querySelector(`#btnCustomJS_Cssreload`).addEventListener("click", function () {
            reload();
        });

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
            let apiclient = ApiClient;
            let userid = apiclient.getCurrentUserId();
            apiclient.getUser(userid).then(user => {
                renderSettings(this.view, user.Policy.IsAdministrator);
            });
        }
    };

    SettingsView.prototype.onPause = function () {

        BaseView.prototype.onPause.apply(this, arguments);
    };

    return SettingsView;
});
