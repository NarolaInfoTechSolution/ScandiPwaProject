require.config({"config": {
        "jsbuild":{"mage/polyfill.js":"try {\n    if (!window.localStorage || !window.sessionStorage) {\n        throw new Error();\n    }\n\n    localStorage.setItem('storage_test', 1);\n    localStorage.removeItem('storage_test');\n} catch (e) {\n    (function () {\n        'use strict';\n\n        /**\n         * Returns a storage object to shim local or sessionStorage\n         * @param {String} type - either 'local' or 'session'\n         */\n        var Storage = function (type) {\n            var data;\n\n            /**\n             * Creates a cookie\n             * @param {String} name\n             * @param {String} value\n             * @param {Integer} days\n             */\n            function createCookie(name, value, days) {\n                var date, expires;\n\n                if (days) {\n                    date = new Date();\n                    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);\n                    expires = '; expires=' + date.toGMTString();\n                } else {\n                    expires = '';\n                }\n                document.cookie = name + '=' + value + expires + '; path=/';\n            }\n\n            /**\n             * Reads value of a cookie\n             * @param {String} name\n             */\n            function readCookie(name) {\n                var nameEQ = name + '=',\n                    ca = document.cookie.split(';'),\n                    i = 0,\n                    c;\n\n                for (i = 0; i < ca.length; i++) {\n                    c = ca[i];\n\n                    while (c.charAt(0) === ' ') {\n                        c = c.substring(1, c.length);\n                    }\n\n                    if (c.indexOf(nameEQ) === 0) {\n                        return c.substring(nameEQ.length, c.length);\n                    }\n                }\n\n                return null;\n            }\n\n            /**\n             * Returns cookie name based upon the storage type.\n             * If this is session storage, the function returns a unique cookie per tab\n             */\n            function getCookieName() {\n\n                if (type !== 'session') {\n                    return 'localstorage';\n                }\n\n                if (!window.name) {\n                    window.name = new Date().getTime();\n                }\n\n                return 'sessionStorage' + window.name;\n            }\n\n            /**\n             * Sets storage cookie to a data object\n             * @param {Object} dataObject\n             */\n            function setData(dataObject) {\n                data = encodeURIComponent(JSON.stringify(dataObject));\n                createCookie(getCookieName(), data, 365);\n            }\n\n            /**\n             * Clears value of cookie data\n             */\n            function clearData() {\n                createCookie(getCookieName(), '', 365);\n            }\n\n            /**\n             * @returns value of cookie data\n             */\n            function getData() {\n                var dataResponse = readCookie(getCookieName());\n\n                return dataResponse ? JSON.parse(decodeURIComponent(dataResponse)) : {};\n            }\n\n            data = getData();\n\n            return {\n                length: 0,\n\n                /**\n                 * Clears data from storage\n                 */\n                clear: function () {\n                    data = {};\n                    this.length = 0;\n                    clearData();\n                },\n\n                /**\n                 * Gets an item from storage\n                 * @param {String} key\n                 */\n                getItem: function (key) {\n                    return data[key] === undefined ? null : data[key];\n                },\n\n                /**\n                 * Gets an item by index from storage\n                 * @param {Integer} i\n                 */\n                key: function (i) {\n                    var ctr = 0,\n                        k;\n\n                    for (k in data) {\n\n                        if (data.hasOwnProperty(k)) {\n\n                            // eslint-disable-next-line max-depth\n                            if (ctr.toString() === i.toString()) {\n                                return k;\n                            }\n                            ctr++;\n                        }\n                    }\n\n                    return null;\n                },\n\n                /**\n                 * Removes an item from storage\n                 * @param {String} key\n                 */\n                removeItem: function (key) {\n                    delete data[key];\n                    this.length--;\n                    setData(data);\n                },\n\n                /**\n                 * Sets an item from storage\n                 * @param {String} key\n                 * @param {String} value\n                 */\n                setItem: function (key, value) {\n                    data[key] = value.toString();\n                    this.length++;\n                    setData(data);\n                }\n            };\n        };\n\n        window.localStorage.prototype = window.localStorage = new Storage('local');\n        window.sessionStorage.prototype = window.sessionStorage = new Storage('session');\n    })();\n}\n"}
}});
