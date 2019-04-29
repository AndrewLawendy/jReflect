(function (window) {
    'use strict';
    var jRef = window.jReflect = (window.jReflect = {});

    function domIsReady(fn) {
        function trigger() {
            window.document.removeEventListener('DOMContentLoaded', trigger);
            window.removeEventListener('load', trigger);
            fn();
        }

        // check if document is already loaded
        if (window.document.readyState === 'complete') {
            window.setTimeout(fn);
        } else {
            // We can not use jqLite since we are not done loading and jQuery could be loaded later.

            // Works for modern browsers and IE9
            window.document.addEventListener('DOMContentLoaded', trigger);

            // Fallback to window.onload for others
            window.addEventListener('load', trigger);
        }
    }
    jRef.init = function () {
        var scopes = document.querySelectorAll('[jrf-scope]');
        [].forEach.call(scopes, function (scope) {
            var scopeArr = scope.getAttribute('jrf-scope');
            if (window[scopeArr]) jRef.compile(scope, window[scopeArr]);
        });
    }
    jRef.compile = function (scope, arr) {
        var repeatElms = scope.querySelectorAll('[jrf-repeat]');
        // jRef.assignSpots(repeatElms);
        [].forEach.call(repeatElms, function (el, index) {
            // jRef.innerRepeat(el, arr);
            var parent = el.parentNode,
                repeatVal = el.getAttribute("jrf-repeat"),
                repeatKeys = repeatVal.split(' in '),
                item = repeatKeys[0],
                repeaterName = repeatKeys[1],
                repeater = jRef.getRepeater(arr, repeaterName),
                docFr = document.createDocumentFragment();
            parent.removeChild(el);
            repeater.forEach(function (r, index) {
                var comment = document.createComment(" Repeat: " + repeatVal + " ");
                docFr.appendChild(comment);
                docFr.append(el.cloneNode(true));
            });
            parent.appendChild(docFr);
        });
    }
    // jRef.innerRepeat = function (el, arr) {
    //     var innerRepeat = el.querySelectorAll('[jrf-repeat]');
    //     [].forEach.call(innerRepeat, function (scope) {
    //         jRef.compile(scope, arr);
    //     });
    // }
    jRef.getRepeater = function (arr, repeaterName) {
        if (arr.hasOwnProperty(repeaterName))
            return arr[repeaterName];
        switch (repeaterName) {
            case "$root":
                return arr;
            default:
                return arr;
        }
    }
    domIsReady(jRef.init);
})(window);