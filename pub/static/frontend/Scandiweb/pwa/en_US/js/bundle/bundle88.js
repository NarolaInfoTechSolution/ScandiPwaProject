require.config({"config": {
        "jsbuild":{"jquery/fileUploader/jquery.iframe-transport.js":"/*\n * jQuery Iframe Transport Plugin 1.5\n * https://github.com/blueimp/jQuery-File-Upload\n *\n * Copyright 2011, Sebastian Tschan\n * https://blueimp.net\n *\n * Licensed under the MIT license:\n * http://www.opensource.org/licenses/MIT\n */\n\n/*jslint unparam: true, nomen: true */\n/*global define, window, document */\n\n(function (factory) {\n    'use strict';\n    if (typeof define === 'function' && define.amd) {\n        // Register as an anonymous AMD module:\n        define(['jquery'], factory);\n    } else {\n        // Browser globals:\n        factory(window.jQuery);\n    }\n}(function ($) {\n    'use strict';\n\n    // Helper variable to create unique names for the transport iframes:\n    var counter = 0;\n\n    // The iframe transport accepts three additional options:\n    // options.fileInput: a jQuery collection of file input fields\n    // options.paramName: the parameter name for the file form data,\n    //  overrides the name property of the file input field(s),\n    //  can be a string or an array of strings.\n    // options.formData: an array of objects with name and value properties,\n    //  equivalent to the return data of .serializeArray(), e.g.:\n    //  [{name: 'a', value: 1}, {name: 'b', value: 2}]\n    $.ajaxTransport('iframe', function (options) {\n        if (options.async && (options.type === 'POST' || options.type === 'GET')) {\n            var form,\n                iframe;\n            return {\n                send: function (_, completeCallback) {\n                    form = $('<form style=\"display:none;\"></form>');\n                    form.attr('accept-charset', options.formAcceptCharset);\n                    // javascript:false as initial iframe src\n                    // prevents warning popups on HTTPS in IE6.\n                    // IE versions below IE8 cannot set the name property of\n                    // elements that have already been added to the DOM,\n                    // so we set the name along with the iframe HTML markup:\n                    iframe = $(\n                        '<iframe src=\"javascript:false;\" name=\"iframe-transport-' +\n                            (counter += 1) + '\"></iframe>'\n                    ).bind('load', function () {\n                        var fileInputClones,\n                            paramNames = $.isArray(options.paramName) ?\n                                    options.paramName : [options.paramName];\n                        iframe\n                            .unbind('load')\n                            .bind('load', function () {\n                                var response;\n                                // Wrap in a try/catch block to catch exceptions thrown\n                                // when trying to access cross-domain iframe contents:\n                                try {\n                                    response = iframe.contents();\n                                    // Google Chrome and Firefox do not throw an\n                                    // exception when calling iframe.contents() on\n                                    // cross-domain requests, so we unify the response:\n                                    if (!response.length || !response[0].firstChild) {\n                                        throw new Error();\n                                    }\n                                } catch (e) {\n                                    response = undefined;\n                                }\n                                // The complete callback returns the\n                                // iframe content document as response object:\n                                completeCallback(\n                                    200,\n                                    'success',\n                                    {'iframe': response}\n                                );\n                                // Fix for IE endless progress bar activity bug\n                                // (happens on form submits to iframe targets):\n                                $('<iframe src=\"javascript:false;\"></iframe>')\n                                    .appendTo(form);\n                                form.remove();\n                            });\n                        form\n                            .prop('target', iframe.prop('name'))\n                            .prop('action', options.url)\n                            .prop('method', options.type);\n                        if (options.formData) {\n                            $.each(options.formData, function (index, field) {\n                                $('<input type=\"hidden\"/>')\n                                    .prop('name', field.name)\n                                    .val(field.value)\n                                    .appendTo(form);\n                            });\n                        }\n                        if (options.fileInput && options.fileInput.length &&\n                                options.type === 'POST') {\n                            fileInputClones = options.fileInput.clone();\n                            // Insert a clone for each file input field:\n                            options.fileInput.after(function (index) {\n                                return fileInputClones[index];\n                            });\n                            if (options.paramName) {\n                                options.fileInput.each(function (index) {\n                                    $(this).prop(\n                                        'name',\n                                        paramNames[index] || options.paramName\n                                    );\n                                });\n                            }\n                            // Appending the file input fields to the hidden form\n                            // removes them from their original location:\n                            form\n                                .append(options.fileInput)\n                                .prop('enctype', 'multipart/form-data')\n                                // enctype must be set as encoding for IE:\n                                .prop('encoding', 'multipart/form-data');\n                        }\n                        form.submit();\n                        // Insert the file input fields at their original location\n                        // by replacing the clones with the originals:\n                        if (fileInputClones && fileInputClones.length) {\n                            options.fileInput.each(function (index, input) {\n                                var clone = $(fileInputClones[index]);\n                                $(input).prop('name', clone.prop('name'));\n                                clone.replaceWith(input);\n                            });\n                        }\n                    });\n                    form.append(iframe).appendTo(document.body);\n                },\n                abort: function () {\n                    if (iframe) {\n                        // javascript:false as iframe src aborts the request\n                        // and prevents warning popups on HTTPS in IE6.\n                        // concat is used to avoid the \"Script URL\" JSLint error:\n                        iframe\n                            .unbind('load')\n                            .prop('src', 'javascript'.concat(':false;'));\n                    }\n                    if (form) {\n                        form.remove();\n                    }\n                }\n            };\n        }\n    });\n\n    // The iframe transport returns the iframe content document as response.\n    // The following adds converters from iframe to text, json, html, and script:\n    $.ajaxSetup({\n        converters: {\n            'iframe text': function (iframe) {\n                return $(iframe[0].body).text();\n            },\n            'iframe json': function (iframe) {\n                return $.parseJSON($(iframe[0].body).text());\n            },\n            'iframe html': function (iframe) {\n                return $(iframe[0].body).html();\n            },\n            'iframe script': function (iframe) {\n                return $.globalEval($(iframe[0].body).text());\n            }\n        }\n    });\n\n}));\n"}
}});
