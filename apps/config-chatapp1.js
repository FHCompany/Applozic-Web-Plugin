var MAIN_PATH = CHAT_PATH + "/public/plugin";
var CUSTOM_PATH = CHAT_PATH + "/apps/chatapp1";

var $original;
var oModal = "";
if (typeof jQuery !== 'undefined') {
    $original = jQuery.noConflict(true);
    $ = $original;
    jQuery = $original;
    if (typeof $.fn.modal === 'function') {
        oModal = $.fn.modal.noConflict(true);
        $.fn.modal = oModal;
        jQuery.fn.modal = oModal;
    }
}
var applozicSideBox = new ApplozicSidebox();
applozicSideBox.load();
function ApplozicSidebox() {
    var googleApiKey = (typeof applozic._globals !== 'undefined' && applozic._globals.googleApiKey) ? (applozic._globals.googleApiKey) : "AIzaSyDKfWHzu9X7Z2hByeW4RRFJrD9SizOzZt4";
    var mck_style_loader = [{
        "name": "mck-combined", "url": MAIN_PATH + "/css/app/sidebox/applozic.combined.min.css"
    }, {
        "name": "mck-sidebox", "url": MAIN_PATH + "/css/app/sidebox/applozic.sidebox.css"
    }, {
        "name": "km-login-model", "url": MAIN_PATH + "/css/km-login-model.css"
    }, {
        "name": "custom", "url": CUSTOM_PATH + "/style.css"
    }];
    var mck_script_loader1 = [ /* {
        "name": "jquery-template", "url": APPLOZIC_PATH + "/sidebox/js/app/applozic.jquery.js"
    }, {
        "name": "mck-common", "url": APPLOZIC_PATH + "/sidebox/js/app/applozic.chat.min.js"
    },*/ {
            "name": "widget", "url": MAIN_PATH + "/js/applozic.widget.min.js"
        }, {
            "name": "plugins", "url": MAIN_PATH + "/js/applozic.plugins.min.js"
        }, {
            "name": "socket", "url": MAIN_PATH + "/js/applozic.socket.min.js"
        }, {
            "name": "maps", "url": "https://maps.google.com/maps/api/js?key=" + googleApiKey + "&libraries=places"
        }, {
            "name": "emojis", "url": MAIN_PATH + "/js/applozic.emojis.min.js"
        }, {
            "name": "video_howler", "url": "https://cdnjs.cloudflare.com/ajax/libs/howler/2.0.2/howler.min.js"
        }, /*{ 
            "name": "video_ringtone", "url": APPLOZIC_PATH + "/sidebox/js/app/mck-ringtone-service.js"
    },*/ {
            "name": "aes", "url": MAIN_PATH + "/js/applozic.aes.js"
        }, {
            "name": "cookie", "url": MAIN_PATH + "/js/js.cookie.js"
        }];
    var mck_script_loader2 = [{
        "name": "locationpicker", "url": MAIN_PATH + "/js/locationpicker.jquery.min.js"
    }];
    var mck_videocall = [{
        "name": "video_twilio", "url": MAIN_PATH + "/js/app/call/twilio-video.js"
    }];
    this.load = function () {
        try {
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = MAIN_PATH + "/js/jquery.min.js";
            script.id = "applozic-jquery";
            if (script.readyState) { // IE
                script.onreadystatechange = function () {
                    if (script.readyState === "loaded" || script.readyState === "complete") {
                        script.onreadystatechange = null;
                        mckinitPlugin();
                    }
                };
            } else { // Others
                script.onload = function () {
                    mckinitPlugin();
                };
            }
            head.appendChild(script);
        } catch (e) {
            console.log("Plugin loading error. Refresh page.");
            if (typeof CHAT_ONINIT === 'function') {
                CHAT_ONINIT("error");
            }
            return false;
        }
    };
    function mckinitPlugin() {
        if (!$original && typeof jQuery !== 'undefined') {
            $original = jQuery.noConflict(true);
            $ = $original;
            jQuery = $original;
            if (typeof $.fn.modal === 'function') {
                oModal = $.fn.modal.noConflict(true);
                $.fn.modal = oModal;
                jQuery.fn.modal = oModal;
            }
        }
        try {
            $.each(mck_style_loader, function (i, data) {
                mckLoadStyle(data);
            });
            $.ajax({
                url: CUSTOM_PATH + '/sidebox.html', crossDomain: true, success: function (data) {
                    data = data.replace(/MAIN_PATH/g, MAIN_PATH);
                    $("body").append(data);
                    mckInitPluginScript();
                }
            });
        } catch (e) {
            console.log("Plugin loading error. Refresh page.");
            if (typeof CHAT_ONINIT === 'function') {
                CHAT_ONINIT("error");
            }
            return false;
        }
    }
    function mckLoadStyle(data) {
        var head = document.getElementsByTagName('head')[0];
        var style = document.createElement('link');
        style.type = 'text/css';
        style.rel = "stylesheet";
        style.href = data.url;
        style.id = 'applozic-' + data.name;
        head.appendChild(style);
    }
    function mckLoadScript(data, callback) {
        try {
            var body = document.getElementsByTagName('body')[0];
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = data.url;
            script.id = 'applozic-' + data.name;
            if (callback) {
                if (script.readyState) { // IE
                    script.onreadystatechange = function () {
                        if (script.readyState === "loaded" || script.readyState === "complete") {
                            script.onreadystatechange = null;
                            callback();
                        }
                    };
                } else { // Others
                    script.onload = function () {
                        callback();
                    };
                }
            }
            body.appendChild(script);
        } catch (e) {
            console.log("Plugin loading error. Refresh page.");
            console.log(e);
            if (typeof CHAT_ONINIT === 'function') {
                CHAT_ONINIT("error");
            }
            return false;
        }
    }
    function mckInitPluginScript() {
        try {
            $.each(mck_script_loader1, function (i, data) {
                if (data.name === "cookie") {
                    try {
                        var options = applozic._globals;
                        if (typeof options !== 'undefined' && options.locShare === true) {
                            mckLoadScript(data, mckLoadScript2);
                        } else {
                            mckLoadScript(data, mckLoadAppScript);
                        }
                    } catch (e) {
                        mckLoadScript(data, mckLoadAppScript);
                    }
                } else if (data.name === "maps") {
                    try {
                        var options = applozic._globals;
                        if (typeof options !== 'undefined') {
                            if (options.googleMapScriptLoaded) {
                                return true;
                            }
                            if (options.googleApiKey) {
                                var url = data.url + "&key=" + options.googleApiKey;
                                mckLoadScript({ 'name': data.name, 'url': url });
                            }
                        } else {
                            mckLoadScript(data);
                        }
                    } catch (e) {
                        mckLoadScript(data);
                    }
                } else {
                    mckLoadScript(data);
                }
            });
            if (typeof applozic._globals !== 'undefined' && applozic._globals.video === true) {
                $.each(mck_videocall, function (i, data) {
                    mckLoadScript(data);
                });
            }
        } catch (e) {
            console.log("Plugin loading error. Refresh page.");
            if (typeof CHAT_ONINIT === 'function') {
                CHAT_ONINIT("error");
            }
            return false;
        }
    }
    function mckLoadScript2() {
        try {
            $.each(mck_script_loader2, function (i, data) {
                if (data.name === "locationpicker") {
                    mckLoadScript(data, mckLoadAppScript);
                }
            });
        } catch (e) {
            console.log("Plugin loading error. Refresh page.");
            if (typeof CHAT_ONINIT === 'function') {
                CHAT_ONINIT("error");
            }
            return false;
        }
    }
    function mckLoadAppScript() {
        try {
            var body = document.getElementsByTagName('body')[0];
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = CHAT_PATH + "/public/applozic.plugin-1.0.js";
            script.id = "applozic-sidebox";
            if (script.readyState) { // IE
                script.onreadystatechange = function () {
                    if (script.readyState === "loaded" || script.readyState === "complete") {
                        script.onreadystatechange = null;
                        mckInitSidebox();
                    }
                };
            } else { // Others
                script.onload = function () {
                    mckInitSidebox();
                };
            }
            body.appendChild(script);
        } catch (e) {
            console.log("Plugin loading error. Refresh page.");
            if (typeof CHAT_ONINIT === 'function') {
                CHAT_ONINIT("error");
            }
            return false;
        }
    }
    function mckInitSidebox() {
        try {
            var options = applozic._globals;
            if (typeof options !== 'undefined') {
                options.ojq = $original;
                options.obsm = oModal;

                $applozic.fn.applozic(options);
            }
        } catch (e) {
            console.log(e);
            console.log("Plugin loading error. Refresh page.");
            if (typeof CHAT_ONINIT === 'function') {
                CHAT_ONINIT("error");
            }
            return false;
        }
    }
    function getRandomId() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 32; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }
}