var MAIN_PATH = CHAT_PATH + "/src/";
var CUSTOM_PATH = CHAT_PATH + "/apps/chatapp1/";

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
    var mck_style_loader = [ {
            "name": "combined", "url": MAIN_PATH + "css/app/sidebox/applozic.combined.min.css"
    }, {
            "name": "sidebox", "url": MAIN_PATH + "css/app/sidebox/applozic.sidebox.css"
    } ];
    var mck_script_loader1 = [ {
            "name": "widget", "url": MAIN_PATH + "js/applozic.widget.min.js"
    }, {
            "name": "plugins", "url": MAIN_PATH + "js/applozic.plugins.min.js"
    }, {
            "name": "socket", "url": MAIN_PATH + "js/applozic.socket.min.js"
    }, {
            "name": "maps", "url": "https://maps.google.com/maps/api/js?libraries=places"
    }, {
            "name": "emojis", "url": MAIN_PATH + "js/applozic.emojis.min.js"
    }, {
            "name": "common", "url": MAIN_PATH + "js/app/applozic.common.js"
    },{
           "name": "aes", "url": MAIN_PATH + "js/applozic.aes.js"
    } ];
    var mck_script_loader2 = [ {
            "name": "locationpicker", "url": MAIN_PATH + "js/locationpicker.jquery.min.js"
    } ];
   /*var mck_videocall = [ {
            "name": "video_howler", "url": "https://cdnjs.cloudflare.com/ajax/libs/howler/2.0.2/howler.min.js"
          
    },{
        "name": "video_videocall", "url": "/js/app/call/videocall.js"
          
    }, { 
          "name": "video_twilio", "url": "/js/app/call/twilio-video.js"        
    }, { 
           "name": "video_ringtone", "url": "/js/app/call/mck-ringtone-service.js"

    } ];*/
    this.load = function() {
        try {
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = MAIN_PATH + "js/jquery.min.js";
            if (script.readyState) { // IE
                script.onreadystatechange = function() {
                    if (script.readyState === "loaded" || script.readyState === "complete") {
                        script.onreadystatechange = null;
                        mckinitPlugin();
                    }
                };
            } else { // Others
                script.onload = function() {
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
            $.each(mck_style_loader, function(i, data) {
                mckLoadStyle(data.url);
            });
            $.ajax({
                    url: CUSTOM_PATH + 'sidebox.html', crossDomain: true, success: function(data) {
                        data = data.replace(/MCK_STATICPATH/g, MAIN_PATH);
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
    function mckLoadStyle(url) {
        var head = document.getElementsByTagName('head')[0];
        var style = document.createElement('link');
        style.type = 'text/css';
        style.rel = "stylesheet";
        style.href = url;
        head.appendChild(style);
    }
    function mckLoadScript(url, callback) {
        try {
            var body = document.getElementsByTagName('body')[0];
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = url;
            if (callback) {
                if (script.readyState) { // IE
                    script.onreadystatechange = function() {
                        if (script.readyState === "loaded" || script.readyState === "complete") {
                            script.onreadystatechange = null;
                            callback();
                        }
                    };
                } else { // Others
                    script.onload = function() {
                        callback();
                    };
                }
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
    function mckInitPluginScript() {
        try {
            $.each(mck_script_loader1, function(i, data) {
                if (data.name === "common") {
                    try {
                       var options = applozic._globals;
                        if (typeof options !== 'undefined' && options.locShare === true) {
                            mckLoadScript(data.url, mckLoadScript2);
                        } else {
                            mckLoadScript(data.url, mckLoadAppScript);
                        }
                    } catch (e) {
                        mckLoadScript(data.url, mckLoadAppScript);
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
                                mckLoadScript(url);
                            }
                        } else {
                            mckLoadScript(data.url);
                        }
                    } catch (e) {
                        mckLoadScript(data.url);
                    }
                } else {
                    mckLoadScript(data.url);
                }
            });
             if (typeof applozic._globals !== 'undefined'&& applozic._globals.video === true) {
                          $.each(mck_videocall, function(i, data) { 
                          mckLoadScript(data.url);
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
            $.each(mck_script_loader2, function(i, data) {
                if (data.name === "locationpicker") {
                    mckLoadScript(data.url, mckLoadAppScript);
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
            script.src = MAIN_PATH + "js/app/sidebox/applozic.sidebox.js";
            if (script.readyState) { // IE
                script.onreadystatechange = function() {
                    if (script.readyState === "loaded" || script.readyState === "complete") {
                        script.onreadystatechange = null;
                        mckInitSidebox();
                    }
                };
            } else { // Others
                script.onload = function() {
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
            console.log("Plugin loading error. Refresh page.");
            if (typeof CHAT_ONINIT === 'function') {
                CHAT_ONINIT("error");
            }
            return false;
        }
    }
}