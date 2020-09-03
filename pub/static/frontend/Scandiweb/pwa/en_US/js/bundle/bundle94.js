require.config({"config": {
        "jsbuild":{"jquery/fileUploader/jquery.fileupload-fp.js":"/*\n * jQuery File Upload File Processing Plugin 1.0\n * https://github.com/blueimp/jQuery-File-Upload\n *\n * Copyright 2012, Sebastian Tschan\n * https://blueimp.net\n *\n * Licensed under the MIT license:\n * http://www.opensource.org/licenses/MIT\n */\n\n/*jslint nomen: true, unparam: true, regexp: true */\n/*global define, window, document */\n\n(function (factory) {\n    'use strict';\n    if (typeof define === 'function' && define.amd) {\n        // Register as an anonymous AMD module:\n        define([\n            'jquery',\n            'jquery/fileUploader/load-image',\n            'jquery/fileUploader/canvas-to-blob',\n            'jquery/fileUploader/jquery.fileupload'\n        ], factory);\n    } else {\n        // Browser globals:\n        factory(\n            window.jQuery,\n            window.loadImage\n        );\n    }\n}(function ($, loadImage) {\n    'use strict';\n\n    // The File Upload IP version extends the basic fileupload widget\n    // with file processing functionality:\n    $.widget('blueimpFP.fileupload', $.blueimp.fileupload, {\n\n        options: {\n            // The list of file processing actions:\n            process: [\n            /*\n                {\n                    action: 'load',\n                    fileTypes: /^image\\/(gif|jpeg|png)$/,\n                    maxFileSize: 20000000 // 20MB\n                },\n                {\n                    action: 'resize',\n                    maxWidth: 1920,\n                    maxHeight: 1200,\n                    minWidth: 800,\n                    minHeight: 600\n                },\n                {\n                    action: 'save'\n                }\n            */\n            ],\n\n            // The add callback is invoked as soon as files are added to the\n            // fileupload widget (via file input selection, drag & drop or add\n            // API call). See the basic file upload widget for more information:\n            add: function (e, data) {\n                $(this).fileupload('process', data).done(function () {\n                    data.submit();\n                });\n            }\n        },\n\n        processActions: {\n            // Loads the image given via data.files and data.index\n            // as canvas element.\n            // Accepts the options fileTypes (regular expression)\n            // and maxFileSize (integer) to limit the files to load:\n            load: function (data, options) {\n                var that = this,\n                    file = data.files[data.index],\n                    dfd = $.Deferred();\n                if (window.HTMLCanvasElement &&\n                        window.HTMLCanvasElement.prototype.toBlob &&\n                        ($.type(options.maxFileSize) !== 'number' ||\n                            file.size < options.maxFileSize) &&\n                        (!options.fileTypes ||\n                            options.fileTypes.test(file.type))) {\n                    loadImage(\n                        file,\n                        function (canvas) {\n                            data.canvas = canvas;\n                            dfd.resolveWith(that, [data]);\n                        },\n                        {canvas: true}\n                    );\n                } else {\n                    dfd.rejectWith(that, [data]);\n                }\n                return dfd.promise();\n            },\n            // Resizes the image given as data.canvas and updates\n            // data.canvas with the resized image.\n            // Accepts the options maxWidth, maxHeight, minWidth and\n            // minHeight to scale the given image:\n            resize: function (data, options) {\n                if (data.canvas) {\n                    var canvas = loadImage.scale(data.canvas, options);\n                    if (canvas.width !== data.canvas.width ||\n                            canvas.height !== data.canvas.height) {\n                        data.canvas = canvas;\n                        data.processed = true;\n                    }\n                }\n                return data;\n            },\n            // Saves the processed image given as data.canvas\n            // inplace at data.index of data.files:\n            save: function (data, options) {\n                // Do nothing if no processing has happened:\n                if (!data.canvas || !data.processed) {\n                    return data;\n                }\n                var that = this,\n                    file = data.files[data.index],\n                    name = file.name,\n                    dfd = $.Deferred(),\n                    callback = function (blob) {\n                        if (!blob.name) {\n                            if (file.type === blob.type) {\n                                blob.name = file.name;\n                            } else if (file.name) {\n                                blob.name = file.name.replace(\n                                    /\\..+$/,\n                                    '.' + blob.type.substr(6)\n                                );\n                            }\n                        }\n                        // Store the created blob at the position\n                        // of the original file in the files list:\n                        data.files[data.index] = blob;\n                        dfd.resolveWith(that, [data]);\n                    };\n                // Use canvas.mozGetAsFile directly, to retain the filename, as\n                // Gecko doesn't support the filename option for FormData.append:\n                if (data.canvas.mozGetAsFile) {\n                    callback(data.canvas.mozGetAsFile(\n                        (/^image\\/(jpeg|png)$/.test(file.type) && name) ||\n                            ((name && name.replace(/\\..+$/, '')) ||\n                                'blob') + '.png',\n                        file.type\n                    ));\n                } else {\n                    data.canvas.toBlob(callback, file.type);\n                }\n                return dfd.promise();\n            }\n        },\n\n        // Resizes the file at the given index and stores the created blob at\n        // the original position of the files list, returns a Promise object:\n        _processFile: function (files, index, options) {\n            var that = this,\n                dfd = $.Deferred().resolveWith(that, [{\n                    files: files,\n                    index: index\n                }]),\n                chain = dfd.promise();\n            that._processing += 1;\n            $.each(options.process, function (i, settings) {\n                chain = chain.pipe(function (data) {\n                    return that.processActions[settings.action]\n                        .call(this, data, settings);\n                });\n            });\n            chain.always(function () {\n                that._processing -= 1;\n                if (that._processing === 0) {\n                    that.element\n                        .removeClass('fileupload-processing');\n                }\n            });\n            if (that._processing === 1) {\n                that.element.addClass('fileupload-processing');\n            }\n            return chain;\n        },\n\n        // Processes the files given as files property of the data parameter,\n        // returns a Promise object that allows to bind a done handler, which\n        // will be invoked after processing all files (inplace) is done:\n        process: function (data) {\n            var that = this,\n                options = $.extend({}, this.options, data);\n            if (options.process && options.process.length &&\n                    this._isXHRUpload(options)) {\n                $.each(data.files, function (index, file) {\n                    that._processingQueue = that._processingQueue.pipe(\n                        function () {\n                            var dfd = $.Deferred();\n                            that._processFile(data.files, index, options)\n                                .always(function () {\n                                    dfd.resolveWith(that);\n                                });\n                            return dfd.promise();\n                        }\n                    );\n                });\n            }\n            return this._processingQueue;\n        },\n\n        _create: function () {\n            $.blueimp.fileupload.prototype._create.call(this);\n            this._processing = 0;\n            this._processingQueue = $.Deferred().resolveWith(this)\n                .promise();\n        }\n\n    });\n\n}));\n"}
}});
