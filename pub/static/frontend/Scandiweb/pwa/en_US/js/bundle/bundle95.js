require.config({"config": {
        "jsbuild":{"jquery/fileUploader/cors/jquery.postmessage-transport.js":"/*\n * jQuery postMessage Transport Plugin 1.1\n * https://github.com/blueimp/jQuery-File-Upload\n *\n * Copyright 2011, Sebastian Tschan\n * https://blueimp.net\n *\n * Licensed under the MIT license:\n * http://www.opensource.org/licenses/MIT\n */\n\n/*jslint unparam: true, nomen: true */\n/*global define, window, document */\n\n(function (factory) {\n    'use strict';\n    if (typeof define === 'function' && define.amd) {\n        // Register as an anonymous AMD module:\n        define(['jquery'], factory);\n    } else {\n        // Browser globals:\n        factory(window.jQuery);\n    }\n}(function ($) {\n    'use strict';\n\n    var counter = 0,\n        names = [\n            'accepts',\n            'cache',\n            'contents',\n            'contentType',\n            'crossDomain',\n            'data',\n            'dataType',\n            'headers',\n            'ifModified',\n            'mimeType',\n            'password',\n            'processData',\n            'timeout',\n            'traditional',\n            'type',\n            'url',\n            'username'\n        ],\n        convert = function (p) {\n            return p;\n        };\n\n    $.ajaxSetup({\n        converters: {\n            'postmessage text': convert,\n            'postmessage json': convert,\n            'postmessage html': convert\n        }\n    });\n\n    $.ajaxTransport('postmessage', function (options) {\n        if (options.postMessage && window.postMessage) {\n            var iframe,\n                loc = $('<a>').prop('href', options.postMessage)[0],\n                target = loc.protocol + '//' + loc.host,\n                xhrUpload = options.xhr().upload;\n            return {\n                send: function (_, completeCallback) {\n                    var message = {\n                            id: 'postmessage-transport-' + (counter += 1)\n                        },\n                        eventName = 'message.' + message.id;\n                    iframe = $(\n                        '<iframe style=\"display:none;\" src=\"' +\n                            options.postMessage + '\" name=\"' +\n                            message.id + '\"></iframe>'\n                    ).bind('load', function () {\n                        $.each(names, function (i, name) {\n                            message[name] = options[name];\n                        });\n                        message.dataType = message.dataType.replace('postmessage ', '');\n                        $(window).bind(eventName, function (e) {\n                            e = e.originalEvent;\n                            var data = e.data,\n                                ev;\n                            if (e.origin === target && data.id === message.id) {\n                                if (data.type === 'progress') {\n                                    ev = document.createEvent('Event');\n                                    ev.initEvent(data.type, false, true);\n                                    $.extend(ev, data);\n                                    xhrUpload.dispatchEvent(ev);\n                                } else {\n                                    completeCallback(\n                                        data.status,\n                                        data.statusText,\n                                        {postmessage: data.result},\n                                        data.headers\n                                    );\n                                    iframe.remove();\n                                    $(window).unbind(eventName);\n                                }\n                            }\n                        });\n                        iframe[0].contentWindow.postMessage(\n                            message,\n                            target\n                        );\n                    }).appendTo(document.body);\n                },\n                abort: function () {\n                    if (iframe) {\n                        iframe.remove();\n                    }\n                }\n            };\n        }\n    });\n\n}));\n"}
}});
