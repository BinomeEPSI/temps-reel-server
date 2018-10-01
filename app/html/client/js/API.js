function API(user) {
    Emitter.call(this);
    user = user || undefined

    this.BASE_URL = "http://localhost:8080/server/";

    this.user = user;
    this.opponent = undefined
}

var myXMLHTTPRequest = {
    factory: [
        function () {return new XMLHttpRequest()},
        function () {return new ActiveXObject("Msxml3.XMLHTTP")},
        function () {return new ActiveXObject("Msxml2.XMLHTTP.6.0")},
        function () {return new ActiveXObject("Msxml2.XMLHTTP.3.0")},
        function () {return new ActiveXObject("Msxml2.XMLHTTP")},
        function () {return new ActiveXObject("Microsoft.XMLHTTP")}
    ],
    create: function () {
        var xmlhttp = false;
        for (var i=0;i<myXMLHTTPRequest.factory.length;i++) {
            try {
                xmlhttp = myXMLHTTPRequest.factory[i]();
            }
            catch (e) {
                continue;
            }
            break;
        }
        return xmlhttp;
    }
}

API.prototype.isGameStarted = function () {
    return this.user != undefined && this.opponent != undefined;
}

API.prototype.setUser = function (user) {
    this.user = user
}

API.prototype.setOpponent = function (user) {
    this.opponent = user
}

API.prototype.setDelta = function (delta) {
    this.delta = delta
}

API.prototype._buildURL = function (path, params) {
    params = Object.assign({}, { "k": this.user }, params);
    var url = this.BASE_URL + path + "?";
    Object.keys(params).forEach(function (key) {
        var value = params[key];
        url += key + "=" + value + "&";
    });
    return url;
}

API.prototype.getPlayers = function (callback) {
    var xhr = myXMLHTTPRequest.create()
    var url = this._buildURL("players", {});
    xhr.open("GET", url);
    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                data = JSON.parse(xhr.response)
                callback(data)
            } else {
                console.error('ERROR');
                console.error(xhr.statusText);
            }
        }
    };
    xhr.onerror = function (e) {
        console.error('error')
        console.error(xhr.statusText)
    }
    xhr.send(null);
}

API.prototype.getPlayer = function (callback, id) {
    id = id || this.user

    var xhr = myXMLHTTPRequest.create()
    var url = this._buildURL("players/" + id, {});
    xhr.open("GET", url);
    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                data = JSON.parse(xhr.response)
                callback(data)
            } else {
                console.error('ERROR');
                console.error(xhr.statusText);
            }
        }
    };
    xhr.onerror = function (e) {
        console.error('error')
        console.error(xhr.statusText)
    }
    xhr.send(null);
}

API.prototype.ping = function (callback, id, timestamp) {
    id = id || this.user;
    timestamp = timestamp || Date.now();

    console.info("Timestamp : " + timestamp);

    var url = this._buildURL("pings", { "k": id, "t0": timestamp });
    var xhr = myXMLHTTPRequest.create()
    xhr.open("GET", url);
    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                data = JSON.parse(xhr.response)
                callback(data, Date.now())
            } else {
                console.error('Not a 200 response');
                console.error(xhr.statusText);
            }
        }
    };
    xhr.onerror = function (e) {
        console.error('Error')
        console.error(xhr.statusText)
    }
    xhr.send(null);
}

API.prototype.sendMessage = function (callback, to, msg) {
    var url = this._buildURL("msgs", { "to": to, "data": msg });
    var xhr = myXMLHTTPRequest.create()
    xhr.open("POST", url);
    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 201) { // 201 = Created
                // We just get a statusText when creating a msg
                callback({ "text": xhr.statusText, "success": xhr.status === 201 })
            } else {
                console.error('Not a 200 response');
                console.error(xhr.statusText);
            }
        }
    };
    xhr.onerror = function (e) {
        console.error('Error')
        console.error(xhr.statusText)
    }
    xhr.send(null);
}

API.prototype.getMessage = function (id, timeout) {
    id = id || this.user;
    timeout = timeout || 5000;
    var user = this.user;
    var that = this;

    var url = this._buildURL("msgs", { "k": id, "timeout": timeout });
    var xhr = myXMLHTTPRequest.create()
    xhr.open("GET", url, true);
    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                data = JSON.parse(xhr.response)
                console.log(that.controlEv(data, id === user));
            } else {
                console.error('Not a 200 response');
                console.error(xhr.statusText);
            }
        }
    };
    xhr.onerror = function (e) {
        console.error('Error')
        console.error(xhr)
    }

    xhr.send(null);
}

/**
 * TODO Unused for now
 * @param {*} callback 
 * @param {*} id 
 */
API.prototype.delete = function (callback, id) {
    id = id || this.user
    var url = this._buildURL("msgs/" + id, { "k": id });
    console.log(url);
    var xhr = myXMLHTTPRequest.create()
    xhr.open("DELETE", url, true);
    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                data = JSON.parse(xhr.response)
                callback(data);
            } else {
                console.error('Not a 200 response');
                console.error(xhr.statusText);
            }
        }
    };
    xhr.onerror = function (e) {
        console.error('Error')
        console.error(xhr)
    }

    xhr.send(null);
}

API.prototype.controlEv = function (data, currentUser) {
    this.dispatchEvent(new CustomEvent("messageReceived", {
        "detail": {
            'data': data,
            'currentUser': currentUser
        }
    }));
}