var w = window,
    d = document;
var MCK_LABELS;
var MCK_BASE_URL;
var MCK_CURR_LATITIUDE = 40.7324319;
var MCK_CURR_LONGITUDE = -73.82480777777776;
var mckUtils = new MckUtils();
var mckDateUtils = new MckDateUtils();
var mckContactUtils = new MckContactUtils();
var mckMapUtils = new MckMapUtils();
function MckUtils() {
    var _this = this;
    var TEXT_NODE = 3,
        ELEMENT_NODE = 1,
        TAGS_BLOCK = ['p', 'div', 'pre', 'form'];
    _this.init = function () {
        var initurl = MCK_CONTEXTPATH ? MCK_CONTEXTPATH + "/v2/tab/initialize.page" : "https://apps.applozic.com/v2/tab/initialize.page";
        var messurl = MCK_CONTEXTPATH ? MCK_CONTEXTPATH + "/rest/ws/message/list" : "https://apps.applozic.com/rest/ws/message/list";
        $applozic.ajax({
            url: initurl,
            contentType: 'application/json',
            type: 'OPTIONS'
        }).done(function (data) { });

        $applozic.ajax({
            url: messurl,
            contentType: 'application/json',
            type: 'OPTIONS'
        }).done(function (data) { });
    }
    _this.showElement = function (element) {

        if (typeof element !== "object" && (typeof element !== 'undefined' && typeof element !== null) || (element && typeof element === "object" && element.length !== 0)) {

            element.classList.remove('n-vis');
            element.classList.add('vis');
        }

    }
    _this.hideElement = function (element) {

        if (typeof element !== "object" && (typeof element !== 'undefined' && typeof element !== null) || (element && typeof element === "object" && element.length !== 0)) {

            element.classList.remove('vis');
            element.classList.add('n-vis');
        }
    };
    _this.badgeCountOnLaucher = function (enablebadgecount, totalunreadCount) {
        var element = document.getElementById("applozic-badge-count");
        if (enablebadgecount === true && totalunreadCount > 0) {
            if (totalunreadCount < 99) {
                element.innerHTML = totalunreadCount;
            }
            else {
                element.innerHTML = "99+";
            }
            element.classList.add("mck-badge-count");
        }
        if (enablebadgecount === true && totalunreadCount === 0) {
            element.innerHTML = "";
            element.classList.remove("mck-badge-count");
        }
    };
    _this.randomId = function () {
        return w.Math.random().toString(36).substring(7);
    };
    _this.textVal = function ($element) {
        var lines = [];
        var line = [];
        var flush = function () {
            lines.push(line.join(''));
            line = [];
        };
        var sanitizeNode = function (node) {
            if (node.nodeType === TEXT_NODE) {
                line.push(node.nodeValue);
            } else if (node.nodeType === ELEMENT_NODE) {
                var tagName = node.tagName.toLowerCase();
                var isBlock = TAGS_BLOCK.indexOf(tagName) !== -1;
                if (isBlock && line.length) {
                    flush();
                }
                if (tagName === 'img') {
                    var alt = node.getAttribute('alt') || '';
                    if (alt) {
                        line.push(alt);
                    }
                    return;
                } else if (tagName === 'style') {
                    return;
                } else if (tagName === 'br') {
                    flush();
                }
                var children = node.childNodes;
                for (var i = 0; i < children.length; i++) {
                    sanitizeNode(children[i]);
                }
                if (isBlock && line.length) {
                    flush();
                }
            }
        };
        var children = $element.childNodes;
        for (var i = 0; i < children.length; i++) {
            sanitizeNode(children[i]);
        }
        if (line.length) {
            flush();
        }
        return lines.join('\n');
    };
    _this.mouseX = function (evt) {
        if (evt.pageX) {
            return evt.pageX;
        } else if (evt.clientX) {
            return evt.clientX + (d.documentElement.scrollLeft ? d.documentElement.scrollLeft : d.body.scrollLeft);
        } else {
            return null;
        }
    };
    _this.mouseY = function (evt) {
        if (evt.pageY) {
            return evt.pageY;
        } else if (evt.clientY) {
            return evt.clientY + (d.documentElement.scrollTop ? d.documentElement.scrollTop : d.body.scrollTop);
        } else {
            return null;
        }
    };
    _this.startsWith = function (matcher, str) {
        if (str === null || typeof matcher === 'undefined')
            return false;
        var i = str.length;
        if (matcher.length < i)
            return false;
        for (--i; (i >= 0) && (matcher[i] === str[i]); --i)
            continue;
        return i < 0;
    };
    _this.setEndOfContenteditable = function (contentEditableElement) {
        var range,
            selection;
        if (document.createRange) //Firefox, Chrome, Opera, Safari, IE 9+
        {
            range = document.createRange(); //Create a range (a range is a like the selection but invisible)
            range.selectNodeContents(contentEditableElement); //Select the entire contents of the element with the range
            range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
            selection = window.getSelection(); //get the selection object (allows you to change selection)
            selection.removeAllRanges(); //remove any selections already made
            selection.addRange(range); //make the range you have just created the visible selection
        } else if (document.selection) //IE 8 and lower
        {
            range = document.body.createTextRange(); //Create a range (a range is a like the selection but invisible)
            range.moveToElementText(contentEditableElement); //Select the entire contents of the element with the range
            range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
            range.select(); //Select the range (make it the visible selection
        }
    };

    this.encryptionKey = null;
    this.getEncryptionKey = function () {
        var setEncryptionKey;
        if (this.encryptionKey === null) {
            setEncryptionKey = ALStorage.getEncryptionKey();
            return setEncryptionKey;
        }
        else {
            return this.encryptionKey;
        }

    }
    this.setEncryptionKey = function (key) {
        this.encryptionKey = key;
    }

    _this.b64EncodeUnicode = function (str) {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
            return String.fromCharCode('0x' + p1);
        }));
    };

    _this.b64DecodeUnicode = function (str) {
        return decodeURIComponent(Array.prototype.map.call(atob(str), function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    };

    _this.ajax = function (options) {
        //var reqOptions = Object.assign({}, options);
        var reqOptions = $applozic.extend({}, {}, options);
        if (!(options.skipEncryption === true) && mckUtils.getEncryptionKey()) {
            var key = aesjs.util.convertStringToBytes(mckUtils.getEncryptionKey());
            var iv = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

            if (reqOptions.type.toLowerCase() === 'post') {
                // encrypt Data
                while (options.data && options.data.length % 16 != 0) {
                    options.data += ' ';
                }
                var aesCtr = new aesjs.ModeOfOperation.ecb(key);
                var bytes = aesjs.util.convertStringToBytes(options.data);
                var encryptedBytes = aesCtr.encrypt(bytes);
                var encryptedStr = String.fromCharCode.apply(null, encryptedBytes);
                reqOptions.data = btoa(encryptedStr);
            }

            reqOptions.success = function (data) {
                // Decrypt response
                var decodedData = atob(data);
                var arr = [];
                for (var i = 0; i < decodedData.length; i++) {
                    arr.push(decodedData.charCodeAt(i));
                }
                var aesCtr = new aesjs.ModeOfOperation.ecb(key);
                var decryptedBytes = aesCtr.decrypt(arr);
                var res = aesjs.util.convertBytesToString(decryptedBytes);
                res = res.replace(/\\u0000/g, '').replace(/^\s*|\s*[\x00-\x10]*$/g, '');
                if (mckUtils.isJsonString(res)) {
                    options.success(JSON.parse(res));
                } else {
                    options.success(res);
                }
            }
        }
        $applozic.ajax(reqOptions);
    };

    _this.isJsonString = function (str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    };

}
function MckContactUtils() {
    var _this = this;
    _this.getContactId = function (contact) {
        var contactId = contact.contactId;
        return _this.formatContactId(contactId);
    };
    _this.formatContactId = function (contactId) {
        if (contactId.indexOf('+') === 0) {
            contactId = contactId.substring(1);
        }
        contactId = decodeURIComponent(contactId);
        return $applozic.trim(contactId.replace(/\@/g, 'AT').replace(/\./g, 'DOT').replace(/\*/g, 'STAR').replace(/\#/g, 'HASH').replace(/\|/g, 'VBAR').replace(/\+/g, 'PLUS').replace(/\;/g, 'SCOLON').replace(/\?/g, 'QMARK').replace(/\,/g, 'COMMA').replace(/\:/g, 'COLON'));
    };
}
function MckMapUtils() {
    var _this = this;
    _this.getCurrentLocation = function (succFunc, errFunc) {
        w.navigator.geolocation.getCurrentPosition(succFunc, errFunc);
    };
    _this.getSelectedLocation = function () {
        return {
            lat: MCK_CURR_LATITIUDE,
            lon: MCK_CURR_LONGITUDE
        };
    };
}
function MckDateUtils() {
    var _this = this;
    _this.getDate = function (createdAtTime) {
        var date = new Date(parseInt(createdAtTime, 10));
        if (!isInvalidDate(date)) {
            return getFormattedDate(date)
        } else {
            throw SyntaxError('invalid date');
        }
    };

    _this.getLastSeenAtStatus = function (lastSeenAtTime) {
        var currentDate = new Date();
        var date = new Date(parseInt(lastSeenAtTime, 10));
        if (isInvalidDate(date)) {
            throw SyntaxError('Invalid Date'); 
        } else {
            if ((currentDate.getDate() === date.getDate()) && (currentDate.getMonth() === date.getMonth()) && (currentDate.getYear() === date.getYear())) {
                var hoursDiff = currentDate.getHours() - date.getHours();
                var timeDiff = w.Math.floor((currentDate.getTime() - date.getTime()) / 60000);
                if (timeDiff < 60) {
                    return (timeDiff <= 1) ? MCK_LABELS['last.seen'] + ' 1 ' + MCK_LABELS['min'] + ' ' + MCK_LABELS['ago'] : MCK_LABELS['last.seen'] + ' ' + timeDiff + MCK_LABELS['mins'] + ' ' + MCK_LABELS['ago'];
                }
                return (hoursDiff === 1) ? MCK_LABELS['last.seen'] + ' 1 ' + MCK_LABELS['hour'] + ' ' + MCK_LABELS['ago'] : MCK_LABELS['last.seen'] + ' ' + hoursDiff + MCK_LABELS['hours'] + ' ' + MCK_LABELS['ago'];
            } else if (((currentDate.getDate() - date.getDate() === 1) && (currentDate.getMonth() === date.getMonth()) && (currentDate.getYear() === date.getYear()))) {
                return MCK_LABELS['last.seen'] + ' ' + MCK_LABELS['yesterday'];
            } else {
                return MCK_LABELS['last.seen'] + ' ' + getFormattedDate(date);
            }
        }
    };

    _this.convertMilisIntoTime = function (millisec) {
        var duration;
        var milliseconds = parseInt((millisec % 1000) / 100),
            seconds = parseInt((millisec / 1000) % 60),
            minutes = parseInt((millisec / (1000 * 60)) % 60),
            hours = parseInt((millisec / (1000 * 60 * 60)) % 24);

        if (hours > 0) {
            duration = hours + " Hr " + minutes + " Min " + seconds + " Sec";
        } else if (minutes > 0) {
            duration = minutes + " Min " + seconds + " Sec";
        } else {
            duration = seconds + " Sec ";
        }
        return duration;
    };

    var getFormattedDate = function (createdAtTime) {
        // Time Masks
        var fullFormat = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
        var onlyTimeFormat = { hour: "2-digit", minute: "2-digit" };
        var monthHourFormat = { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }

        var language = window.localStorage.getItem('language').replace('_', '-');
        var createdAt = new Date(createdAtTime);

        // Verify if current time is the same of the message. If not, convert time to local timezone
        if (new Date().getHours() !== createdAt.getHours()) {
            var newDate = new Date(createdAt.getTime() + createdAt.getTimezoneOffset() * 60 * 1000);
            var offset = createdAt.getTimezoneOffset() / 60;
            var hours = createdAt.getHours();
            newDate.setHours(hours - offset);
            createdAt = new Date(newDate);
        }

        return new Date().getFullYear() > createdAt.getFullYear() ? createdAt.toLocaleTimeString(language, fullFormat) :
            new Date().getMonth() > createdAt.getMonth() || new Date().getDate() > createdAt.getDate() ? createdAt.toLocaleTimeString(language, monthHourFormat) : createdAt.toLocaleTimeString(language, onlyTimeFormat);
    }

    var isInvalidDate = function (dt) {
        return isNaN(dt) ? true : false;
    }
}
