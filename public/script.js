// "object" != typeof ue || "object" != typeof ue.interface ? ("object" != typeof ue && (ue = {}), ue.interface = {}, ue.interface.broadcast = function (e, t) { if ("string" == typeof e) { var o = [e, ""]; void 0 !== t && (o[1] = t); var n = encodeURIComponent(JSON.stringify(o)); "object" == typeof history && "function" == typeof history.pushState ? (history.pushState({}, "", "#" + n), history.pushState({}, "", "#" + encodeURIComponent("[]"))) : (document.location.hash = n, document.location.hash = encodeURIComponent("[]")) } }) : function (e) { ue.interface = {}, ue.interface.broadcast = function (t, o) { "string" == typeof t && (void 0 !== o ? e.broadcast(t, JSON.stringify(o)) : e.broadcast(t, "")) } }(ue.interface), ue5 = ue.interface.broadcast;

if (typeof ue != "object" || typeof ue.interface != "object") {
    if (typeof ue != "object")
        ue = {};
    // mobile
    ue.interface = {};
    ue.interface.broadcast = function (name, data) {
        if (typeof name != "string")
            return;
        var args = [name, ""];
        if (typeof data != "undefined")
            args[1] = data;
        var hash = encodeURIComponent(JSON.stringify(args));
        if (typeof history == "object" && typeof history.pushState == "function") {
            history.pushState({}, "", "#" + hash);
            history.pushState({}, "", "#" + encodeURIComponent("[]"));
        }
        else {
            document.location.hash = hash;
            document.location.hash = encodeURIComponent("[]");
        }
    };
}
else
    (function (obj) {
        // desktop
        ue.interface = {};
        ue.interface.broadcast = function (name, data) {
            if (typeof name != "string")
                return;
            if (typeof data != "undefined")
                obj.broadcast(name, JSON.stringify(data));
            else
                obj.broadcast(name, "");
        };
    })(ue.interface);
// create the global ue5(...) helper function
ue5 = ue.interface.broadcast;