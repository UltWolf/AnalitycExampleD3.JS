/* See license.txt for terms of usage */

var _ = require('underscore');

exports.get = function(url, params, cb) {
    exports.send(url, 'GET', params, cb);
}

exports.post = function(url, params, cb) {
    exports.send(url, 'POST', params, cb);
}

exports.send = function(url, method, params, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            var data = xhr.responseText;
            try {
                data = JSON.parse(data);
            } catch (exc) {
            }
            if (cb) {
                cb(data);
            }
        }
    }

    var body;
    if (params) {
        var bodies = [];
        for (var name in params) {
            bodies.push(name + '=' + encodeURIComponent(params[name]));
        }

        body = bodies.join('&');
        if (body.length) {
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); 
        }        
    }

    xhr.send(body);
}

exports.getJSON = function(url, params, cb) {
   var pairs = ['callback=jsonp'];
    _.each(params, function(value, key) {
        pairs[pairs.length] = key+'='+value;
    });
    if (pairs.length) {
        url = url + (url.indexOf('?') == -1 ? '?' : '&') + pairs.join('&');
    }

    function jsonpReturn(o) {
        self.jsonp = undefined;
        if (!o || o.error) {
            if (cb) cb(o);        
        } else {
            if (cb) cb(0, o);
        }        
    }

    if (has('appjs')) {
        self.jsonp = jsonpReturn;

        appjs.load(url, 'GET', {}, params, function(err, data) {
            if (err) {
                cb(err);            
            } else {
                sandboxEval(data);
            }
        });
    } else if (self.document) {
        self.jsonp = function(o) {
            // Return on a timeout to ensure that getJSON calls return asynchronously. There
            // is a case in IE where, after hitting the back button, this will return
            // synchronously and potentially confuse some clients.
            setTimeout(function() { jsonpReturn(o) }, 0);
        }

        function cleanup() {
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }            
        }

        var script = document.createElement('script');
        script.type = 'text/javascript';
        // script.async = true;
        script.src = url;
        script.onload = cleanup;
        script.onerror = function(event) {
            cleanup();
            cb("Error");
        };
        var head = document.getElementsByTagName("head")[0];
        head.appendChild(script);
    } else {
        self.jsonp = jsonpReturn;

        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                eval(xhr.responseText);
                self.jsonp = null;
            }
        }
        xhr.send("");
    }
}

exports.postJSON = function(url, params, cb) {
    exports.post(url, params, function(data) {
        var result = eval(data);
        cb(0, result);
    }); 
};

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFqYXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhamF4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogU2VlIGxpY2Vuc2UudHh0IGZvciB0ZXJtcyBvZiB1c2FnZSAqL1xuXG52YXIgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcblxuZXhwb3J0cy5nZXQgPSBmdW5jdGlvbih1cmwsIHBhcmFtcywgY2IpIHtcbiAgICBleHBvcnRzLnNlbmQodXJsLCAnR0VUJywgcGFyYW1zLCBjYik7XG59XG5cbmV4cG9ydHMucG9zdCA9IGZ1bmN0aW9uKHVybCwgcGFyYW1zLCBjYikge1xuICAgIGV4cG9ydHMuc2VuZCh1cmwsICdQT1NUJywgcGFyYW1zLCBjYik7XG59XG5cbmV4cG9ydHMuc2VuZCA9IGZ1bmN0aW9uKHVybCwgbWV0aG9kLCBwYXJhbXMsIGNiKSB7XG4gICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHhoci5vcGVuKG1ldGhvZCwgdXJsLCB0cnVlKTtcbiAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PSA0KSB7XG4gICAgICAgICAgICB2YXIgZGF0YSA9IHhoci5yZXNwb25zZVRleHQ7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXhjKSB7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2IpIHtcbiAgICAgICAgICAgICAgICBjYihkYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBib2R5O1xuICAgIGlmIChwYXJhbXMpIHtcbiAgICAgICAgdmFyIGJvZGllcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBuYW1lIGluIHBhcmFtcykge1xuICAgICAgICAgICAgYm9kaWVzLnB1c2gobmFtZSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudChwYXJhbXNbbmFtZV0pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJvZHkgPSBib2RpZXMuam9pbignJicpO1xuICAgICAgICBpZiAoYm9keS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC10eXBlXCIsIFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCIpOyBcbiAgICAgICAgfSAgICAgICAgXG4gICAgfVxuXG4gICAgeGhyLnNlbmQoYm9keSk7XG59XG5cbmV4cG9ydHMuZ2V0SlNPTiA9IGZ1bmN0aW9uKHVybCwgcGFyYW1zLCBjYikge1xuICAgdmFyIHBhaXJzID0gWydjYWxsYmFjaz1qc29ucCddO1xuICAgIF8uZWFjaChwYXJhbXMsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgcGFpcnNbcGFpcnMubGVuZ3RoXSA9IGtleSsnPScrdmFsdWU7XG4gICAgfSk7XG4gICAgaWYgKHBhaXJzLmxlbmd0aCkge1xuICAgICAgICB1cmwgPSB1cmwgKyAodXJsLmluZGV4T2YoJz8nKSA9PSAtMSA/ICc/JyA6ICcmJykgKyBwYWlycy5qb2luKCcmJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24ganNvbnBSZXR1cm4obykge1xuICAgICAgICBzZWxmLmpzb25wID0gdW5kZWZpbmVkO1xuICAgICAgICBpZiAoIW8gfHwgby5lcnJvcikge1xuICAgICAgICAgICAgaWYgKGNiKSBjYihvKTsgICAgICAgIFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGNiKSBjYigwLCBvKTtcbiAgICAgICAgfSAgICAgICAgXG4gICAgfVxuXG4gICAgaWYgKGhhcygnYXBwanMnKSkge1xuICAgICAgICBzZWxmLmpzb25wID0ganNvbnBSZXR1cm47XG5cbiAgICAgICAgYXBwanMubG9hZCh1cmwsICdHRVQnLCB7fSwgcGFyYW1zLCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICBjYihlcnIpOyAgICAgICAgICAgIFxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzYW5kYm94RXZhbChkYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChzZWxmLmRvY3VtZW50KSB7XG4gICAgICAgIHNlbGYuanNvbnAgPSBmdW5jdGlvbihvKSB7XG4gICAgICAgICAgICAvLyBSZXR1cm4gb24gYSB0aW1lb3V0IHRvIGVuc3VyZSB0aGF0IGdldEpTT04gY2FsbHMgcmV0dXJuIGFzeW5jaHJvbm91c2x5LiBUaGVyZVxuICAgICAgICAgICAgLy8gaXMgYSBjYXNlIGluIElFIHdoZXJlLCBhZnRlciBoaXR0aW5nIHRoZSBiYWNrIGJ1dHRvbiwgdGhpcyB3aWxsIHJldHVyblxuICAgICAgICAgICAgLy8gc3luY2hyb25vdXNseSBhbmQgcG90ZW50aWFsbHkgY29uZnVzZSBzb21lIGNsaWVudHMuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyBqc29ucFJldHVybihvKSB9LCAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGNsZWFudXAoKSB7XG4gICAgICAgICAgICBpZiAoc2NyaXB0LnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgICBzY3JpcHQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzY3JpcHQpO1xuICAgICAgICAgICAgfSAgICAgICAgICAgIFxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgICAgICBzY3JpcHQudHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnO1xuICAgICAgICAvLyBzY3JpcHQuYXN5bmMgPSB0cnVlO1xuICAgICAgICBzY3JpcHQuc3JjID0gdXJsO1xuICAgICAgICBzY3JpcHQub25sb2FkID0gY2xlYW51cDtcbiAgICAgICAgc2NyaXB0Lm9uZXJyb3IgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgY2xlYW51cCgpO1xuICAgICAgICAgICAgY2IoXCJFcnJvclwiKTtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIGhlYWQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF07XG4gICAgICAgIGhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBzZWxmLmpzb25wID0ganNvbnBSZXR1cm47XG5cbiAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB4aHIub3BlbignR0VUJywgdXJsLCB0cnVlKTtcbiAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09IDQpIHtcbiAgICAgICAgICAgICAgICBldmFsKHhoci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgIHNlbGYuanNvbnAgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHhoci5zZW5kKFwiXCIpO1xuICAgIH1cbn1cblxuZXhwb3J0cy5wb3N0SlNPTiA9IGZ1bmN0aW9uKHVybCwgcGFyYW1zLCBjYikge1xuICAgIGV4cG9ydHMucG9zdCh1cmwsIHBhcmFtcywgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gZXZhbChkYXRhKTtcbiAgICAgICAgY2IoMCwgcmVzdWx0KTtcbiAgICB9KTsgXG59O1xuIl19
