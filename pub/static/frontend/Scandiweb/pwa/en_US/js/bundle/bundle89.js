require.config({"config": {
        "jsbuild":{"jquery/fileUploader/jquery.fileupload-ui.js":"/*\n * jQuery File Upload User Interface Plugin 6.9.5\n * https://github.com/blueimp/jQuery-File-Upload\n *\n * Copyright 2010, Sebastian Tschan\n * https://blueimp.net\n *\n * Licensed under the MIT license:\n * http://www.opensource.org/licenses/MIT\n */\n\n/*jslint nomen: true, unparam: true, regexp: true */\n/*global define, window, document, URL, webkitURL, FileReader */\n\n(function (factory) {\n    'use strict';\n    if (typeof define === 'function' && define.amd) {\n        // Register as an anonymous AMD module:\n        define([\n            'jquery',\n            'mage/template',\n            'jquery/fileUploader/load-image',\n            'jquery/fileUploader/jquery.fileupload-fp',\n            'jquery/fileUploader/jquery.iframe-transport'\n        ], factory);\n    } else {\n        // Browser globals:\n        factory(\n            window.jQuery,\n            window.mageTemplate,\n            window.loadImage\n        );\n    }\n}(function ($, tmpl, loadImage) {\n    'use strict';\n\n    // The UI version extends the FP (file processing) version or the basic\n    // file upload widget and adds complete user interface interaction:\n    var parentWidget = ($.blueimpFP || $.blueimp).fileupload;\n    $.widget('blueimpUI.fileupload', parentWidget, {\n\n        options: {\n            // By default, files added to the widget are uploaded as soon\n            // as the user clicks on the start buttons. To enable automatic\n            // uploads, set the following option to true:\n            autoUpload: false,\n            // The following option limits the number of files that are\n            // allowed to be uploaded using this widget:\n            maxNumberOfFiles: undefined,\n            // The maximum allowed file size:\n            maxFileSize: undefined,\n            // The minimum allowed file size:\n            minFileSize: undefined,\n            // The regular expression for allowed file types, matches\n            // against either file type or file name:\n            acceptFileTypes:  /.+$/i,\n            // The regular expression to define for which files a preview\n            // image is shown, matched against the file type:\n            previewSourceFileTypes: /^image\\/(gif|jpeg|png)$/,\n            // The maximum file size of images that are to be displayed as preview:\n            previewSourceMaxFileSize: 5000000, // 5MB\n            // The maximum width of the preview images:\n            previewMaxWidth: 80,\n            // The maximum height of the preview images:\n            previewMaxHeight: 80,\n            // By default, preview images are displayed as canvas elements\n            // if supported by the browser. Set the following option to false\n            // to always display preview images as img elements:\n            previewAsCanvas: true,\n            // The ID of the upload template:\n            uploadTemplateId: 'template-upload',\n            // The ID of the download template:\n            downloadTemplateId: 'template-download',\n            // The container for the list of files. If undefined, it is set to\n            // an element with class \"files\" inside of the widget element:\n            filesContainer: undefined,\n            // By default, files are appended to the files container.\n            // Set the following option to true, to prepend files instead:\n            prependFiles: false,\n            // The expected data type of the upload response, sets the dataType\n            // option of the $.ajax upload requests:\n            dataType: 'json',\n\n            // The add callback is invoked as soon as files are added to the fileupload\n            // widget (via file input selection, drag & drop or add API call).\n            // See the basic file upload widget for more information:\n            add: function (e, data) {\n                var that = $(this).data('fileupload'),\n                    options = that.options,\n                    files = data.files;\n                $(this).fileupload('process', data).done(function () {\n                    that._adjustMaxNumberOfFiles(-files.length);\n                    data.maxNumberOfFilesAdjusted = true;\n                    data.files.valid = data.isValidated = that._validate(files);\n                    data.context = that._renderUpload(files).data('data', data);\n                    options.filesContainer[\n                        options.prependFiles ? 'prepend' : 'append'\n                    ](data.context);\n                    that._renderPreviews(files, data.context);\n                    that._forceReflow(data.context);\n                    that._transition(data.context).done(\n                        function () {\n                            if ((that._trigger('added', e, data) !== false) &&\n                                    (options.autoUpload || data.autoUpload) &&\n                                    data.autoUpload !== false && data.isValidated) {\n                                data.submit();\n                            }\n                        }\n                    );\n                });\n            },\n            // Callback for the start of each file upload request:\n            send: function (e, data) {\n                var that = $(this).data('fileupload');\n                if (!data.isValidated) {\n                    if (!data.maxNumberOfFilesAdjusted) {\n                        that._adjustMaxNumberOfFiles(-data.files.length);\n                        data.maxNumberOfFilesAdjusted = true;\n                    }\n                    if (!that._validate(data.files)) {\n                        return false;\n                    }\n                }\n                if (data.context && data.dataType &&\n                        data.dataType.substr(0, 6) === 'iframe') {\n                    // Iframe Transport does not support progress events.\n                    // In lack of an indeterminate progress bar, we set\n                    // the progress to 100%, showing the full animated bar:\n                    data.context\n                        .find('.progress').addClass(\n                            !$.support.transition && 'progress-animated'\n                        )\n                        .attr('aria-valuenow', 100)\n                        .find('.bar').css(\n                            'width',\n                            '100%'\n                        );\n                }\n                return that._trigger('sent', e, data);\n            },\n            // Callback for successful uploads:\n            done: function (e, data) {\n                var that = $(this).data('fileupload'),\n                    template;\n                if (data.context) {\n                    data.context.each(function (index) {\n                        var file = ($.isArray(data.result) &&\n                                data.result[index]) || {error: 'emptyResult'};\n                        if (file.error) {\n                            that._adjustMaxNumberOfFiles(1);\n                        }\n                        that._transition($(this)).done(\n                            function () {\n                                var node = $(this);\n                                template = that._renderDownload([file])\n                                    .replaceAll(node);\n                                that._forceReflow(template);\n                                that._transition(template).done(\n                                    function () {\n                                        data.context = $(this);\n                                        that._trigger('completed', e, data);\n                                    }\n                                );\n                            }\n                        );\n                    });\n                } else {\n                    if ($.isArray(data.result)) {\n                        $.each(data.result, function (index, file) {\n                            if (data.maxNumberOfFilesAdjusted && file.error) {\n                                that._adjustMaxNumberOfFiles(1);\n                            } else if (!data.maxNumberOfFilesAdjusted &&\n                                    !file.error) {\n                                that._adjustMaxNumberOfFiles(-1);\n                            }\n                        });\n                        data.maxNumberOfFilesAdjusted = true;\n                    }\n                    template = that._renderDownload(data.result)\n                        .appendTo(that.options.filesContainer);\n                    that._forceReflow(template);\n                    that._transition(template).done(\n                        function () {\n                            data.context = $(this);\n                            that._trigger('completed', e, data);\n                        }\n                    );\n                }\n            },\n            // Callback for failed (abort or error) uploads:\n            fail: function (e, data) {\n                var that = $(this).data('fileupload'),\n                    template;\n                if (data.maxNumberOfFilesAdjusted) {\n                    that._adjustMaxNumberOfFiles(data.files.length);\n                }\n                if (data.context) {\n                    data.context.each(function (index) {\n                        if (data.errorThrown !== 'abort') {\n                            var file = data.files[index];\n                            file.error = file.error || data.errorThrown ||\n                                true;\n                            that._transition($(this)).done(\n                                function () {\n                                    var node = $(this);\n                                    template = that._renderDownload([file])\n                                        .replaceAll(node);\n                                    that._forceReflow(template);\n                                    that._transition(template).done(\n                                        function () {\n                                            data.context = $(this);\n                                            that._trigger('failed', e, data);\n                                        }\n                                    );\n                                }\n                            );\n                        } else {\n                            that._transition($(this)).done(\n                                function () {\n                                    $(this).remove();\n                                    that._trigger('failed', e, data);\n                                }\n                            );\n                        }\n                    });\n                } else if (data.errorThrown !== 'abort') {\n                    data.context = that._renderUpload(data.files)\n                        .appendTo(that.options.filesContainer)\n                        .data('data', data);\n                    that._forceReflow(data.context);\n                    that._transition(data.context).done(\n                        function () {\n                            data.context = $(this);\n                            that._trigger('failed', e, data);\n                        }\n                    );\n                } else {\n                    that._trigger('failed', e, data);\n                }\n            },\n            // Callback for upload progress events:\n            progress: function (e, data) {\n                if (data.context) {\n                    var progress = parseInt(data.loaded / data.total * 100, 10);\n                    data.context.find('.progress')\n                        .attr('aria-valuenow', progress)\n                        .find('.bar').css(\n                            'width',\n                            progress + '%'\n                        );\n                }\n            },\n            // Callback for global upload progress events:\n            progressall: function (e, data) {\n                var $this = $(this),\n                    progress = parseInt(data.loaded / data.total * 100, 10),\n                    globalProgressNode = $this.find('.fileupload-progress'),\n                    extendedProgressNode = globalProgressNode\n                        .find('.progress-extended');\n                if (extendedProgressNode.length) {\n                    extendedProgressNode.html(\n                        $this.data('fileupload')._renderExtendedProgress(data)\n                    );\n                }\n                globalProgressNode\n                    .find('.progress')\n                    .attr('aria-valuenow', progress)\n                    .find('.bar').css(\n                        'width',\n                        progress + '%'\n                    );\n            },\n            // Callback for uploads start, equivalent to the global ajaxStart event:\n            start: function (e) {\n                var that = $(this).data('fileupload');\n                that._transition($(this).find('.fileupload-progress')).done(\n                    function () {\n                        that._trigger('started', e);\n                    }\n                );\n            },\n            // Callback for uploads stop, equivalent to the global ajaxStop event:\n            stop: function (e) {\n                var that = $(this).data('fileupload');\n                that._transition($(this).find('.fileupload-progress')).done(\n                    function () {\n                        $(this).find('.progress')\n                            .attr('aria-valuenow', '0')\n                            .find('.bar').css('width', '0%');\n                        $(this).find('.progress-extended').html('&nbsp;');\n                        that._trigger('stopped', e);\n                    }\n                );\n            },\n            // Callback for file deletion:\n            destroy: function (e, data) {\n                var that = $(this).data('fileupload');\n                if (data.url) {\n                    $.ajax(data);\n                    that._adjustMaxNumberOfFiles(1);\n                }\n                that._transition(data.context).done(\n                    function () {\n                        $(this).remove();\n                        that._trigger('destroyed', e, data);\n                    }\n                );\n            }\n        },\n\n        // Link handler, that allows to download files\n        // by drag & drop of the links to the desktop:\n        _enableDragToDesktop: function () {\n            var link = $(this),\n                url = link.prop('href'),\n                name = link.prop('download'),\n                type = 'application/octet-stream';\n            link.bind('dragstart', function (e) {\n                try {\n                    e.originalEvent.dataTransfer.setData(\n                        'DownloadURL',\n                        [type, name, url].join(':')\n                    );\n                } catch (err) {}\n            });\n        },\n\n        _adjustMaxNumberOfFiles: function (operand) {\n            if (typeof this.options.maxNumberOfFiles === 'number') {\n                this.options.maxNumberOfFiles += operand;\n                if (this.options.maxNumberOfFiles < 1) {\n                    this._disableFileInputButton();\n                } else {\n                    this._enableFileInputButton();\n                }\n            }\n        },\n\n        _formatFileSize: function (bytes) {\n            if (typeof bytes !== 'number') {\n                return '';\n            }\n            if (bytes >= 1000000000) {\n                return (bytes / 1000000000).toFixed(2) + ' GB';\n            }\n            if (bytes >= 1000000) {\n                return (bytes / 1000000).toFixed(2) + ' MB';\n            }\n            return (bytes / 1000).toFixed(2) + ' KB';\n        },\n\n        _formatBitrate: function (bits) {\n            if (typeof bits !== 'number') {\n                return '';\n            }\n            if (bits >= 1000000000) {\n                return (bits / 1000000000).toFixed(2) + ' Gbit/s';\n            }\n            if (bits >= 1000000) {\n                return (bits / 1000000).toFixed(2) + ' Mbit/s';\n            }\n            if (bits >= 1000) {\n                return (bits / 1000).toFixed(2) + ' kbit/s';\n            }\n            return bits + ' bit/s';\n        },\n\n        _formatTime: function (seconds) {\n            var date = new Date(seconds * 1000),\n                days = parseInt(seconds / 86400, 10);\n            days = days ? days + 'd ' : '';\n            return days +\n                ('0' + date.getUTCHours()).slice(-2) + ':' +\n                ('0' + date.getUTCMinutes()).slice(-2) + ':' +\n                ('0' + date.getUTCSeconds()).slice(-2);\n        },\n\n        _formatPercentage: function (floatValue) {\n            return (floatValue * 100).toFixed(2) + ' %';\n        },\n\n        _renderExtendedProgress: function (data) {\n            return this._formatBitrate(data.bitrate) + ' | ' +\n                this._formatTime(\n                    (data.total - data.loaded) * 8 / data.bitrate\n                ) + ' | ' +\n                this._formatPercentage(\n                    data.loaded / data.total\n                ) + ' | ' +\n                this._formatFileSize(data.loaded) + ' / ' +\n                this._formatFileSize(data.total);\n        },\n\n        _hasError: function (file) {\n            if (file.error) {\n                return file.error;\n            }\n            // The number of added files is subtracted from\n            // maxNumberOfFiles before validation, so we check if\n            // maxNumberOfFiles is below 0 (instead of below 1):\n            if (this.options.maxNumberOfFiles < 0) {\n                return 'maxNumberOfFiles';\n            }\n            // Files are accepted if either the file type or the file name\n            // matches against the acceptFileTypes regular expression, as\n            // only browsers with support for the File API report the type:\n            if (!(this.options.acceptFileTypes.test(file.type) ||\n                    this.options.acceptFileTypes.test(file.name))) {\n                return 'acceptFileTypes';\n            }\n            if (this.options.maxFileSize &&\n                    file.size > this.options.maxFileSize) {\n                return 'maxFileSize';\n            }\n            if (typeof file.size === 'number' &&\n                    file.size < this.options.minFileSize) {\n                return 'minFileSize';\n            }\n            return null;\n        },\n\n        _validate: function (files) {\n            var that = this,\n                valid = !!files.length;\n            $.each(files, function (index, file) {\n                file.error = that._hasError(file);\n                if (file.error) {\n                    valid = false;\n                }\n            });\n            return valid;\n        },\n\n        _renderTemplate: function (func, files) {\n            if (!func) {\n                return $();\n            }\n            var result = func({\n                files: files,\n                formatFileSize: this._formatFileSize,\n                options: this.options\n            });\n            if (result instanceof $) {\n                return result;\n            }\n            return $(this.options.templatesContainer).html(result).children();\n        },\n\n        _renderPreview: function (file, node) {\n            var that = this,\n                options = this.options,\n                dfd = $.Deferred();\n            return ((loadImage && loadImage(\n                file,\n                function (img) {\n                    node.append(img);\n                    that._forceReflow(node);\n                    that._transition(node).done(function () {\n                        dfd.resolveWith(node);\n                    });\n                    if (!$.contains(document.body, node[0])) {\n                        // If the element is not part of the DOM,\n                        // transition events are not triggered,\n                        // so we have to resolve manually:\n                        dfd.resolveWith(node);\n                    }\n                },\n                {\n                    maxWidth: options.previewMaxWidth,\n                    maxHeight: options.previewMaxHeight,\n                    canvas: options.previewAsCanvas\n                }\n            )) || dfd.resolveWith(node)) && dfd;\n        },\n\n        _renderPreviews: function (files, nodes) {\n            var that = this,\n                options = this.options;\n            nodes.find('.preview span').each(function (index, element) {\n                var file = files[index];\n                if (options.previewSourceFileTypes.test(file.type) &&\n                        ($.type(options.previewSourceMaxFileSize) !== 'number' ||\n                        file.size < options.previewSourceMaxFileSize)) {\n                    that._processingQueue = that._processingQueue.pipe(function () {\n                        var dfd = $.Deferred();\n                        that._renderPreview(file, $(element)).done(\n                            function () {\n                                dfd.resolveWith(that);\n                            }\n                        );\n                        return dfd.promise();\n                    });\n                }\n            });\n            return this._processingQueue;\n        },\n\n        _renderUpload: function (files) {\n            return this._renderTemplate(\n                this.options.uploadTemplate,\n                files\n            );\n        },\n\n        _renderDownload: function (files) {\n            return this._renderTemplate(\n                this.options.downloadTemplate,\n                files\n            ).find('a[download]').each(this._enableDragToDesktop).end();\n        },\n\n        _startHandler: function (e) {\n            e.preventDefault();\n            var button = $(this),\n                template = button.closest('.template-upload'),\n                data = template.data('data');\n            if (data && data.submit && !data.jqXHR && data.submit()) {\n                button.prop('disabled', true);\n            }\n        },\n\n        _cancelHandler: function (e) {\n            e.preventDefault();\n            var template = $(this).closest('.template-upload'),\n                data = template.data('data') || {};\n            if (!data.jqXHR) {\n                data.errorThrown = 'abort';\n                e.data.fileupload._trigger('fail', e, data);\n            } else {\n                data.jqXHR.abort();\n            }\n        },\n\n        _deleteHandler: function (e) {\n            e.preventDefault();\n            var button = $(this);\n            e.data.fileupload._trigger('destroy', e, {\n                context: button.closest('.template-download'),\n                url: button.attr('data-url'),\n                type: button.attr('data-type') || 'DELETE',\n                dataType: e.data.fileupload.options.dataType\n            });\n        },\n\n        _forceReflow: function (node) {\n            return $.support.transition && node.length &&\n                node[0].offsetWidth;\n        },\n\n        _transition: function (node) {\n            var dfd = $.Deferred();\n            if ($.support.transition && node.hasClass('fade')) {\n                node.bind(\n                    $.support.transition.end,\n                    function (e) {\n                        // Make sure we don't respond to other transitions events\n                        // in the container element, e.g. from button elements:\n                        if (e.target === node[0]) {\n                            node.unbind($.support.transition.end);\n                            dfd.resolveWith(node);\n                        }\n                    }\n                ).toggleClass('in');\n            } else {\n                node.toggleClass('in');\n                dfd.resolveWith(node);\n            }\n            return dfd;\n        },\n\n        _initButtonBarEventHandlers: function () {\n            var fileUploadButtonBar = this.element.find('.fileupload-buttonbar'),\n                filesList = this.options.filesContainer,\n                ns = this.options.namespace;\n            fileUploadButtonBar.find('.start')\n                .bind('click.' + ns, function (e) {\n                    e.preventDefault();\n                    filesList.find('.start button').click();\n                });\n            fileUploadButtonBar.find('.cancel')\n                .bind('click.' + ns, function (e) {\n                    e.preventDefault();\n                    filesList.find('.cancel button').click();\n                });\n            fileUploadButtonBar.find('.delete')\n                .bind('click.' + ns, function (e) {\n                    e.preventDefault();\n                    filesList.find('.delete input:checked')\n                        .siblings('button').click();\n                    fileUploadButtonBar.find('.toggle')\n                        .prop('checked', false);\n                });\n            fileUploadButtonBar.find('.toggle')\n                .bind('change.' + ns, function (e) {\n                    filesList.find('.delete input').prop(\n                        'checked',\n                        $(this).is(':checked')\n                    );\n                });\n        },\n\n        _destroyButtonBarEventHandlers: function () {\n            this.element.find('.fileupload-buttonbar button')\n                .unbind('click.' + this.options.namespace);\n            this.element.find('.fileupload-buttonbar .toggle')\n                .unbind('change.' + this.options.namespace);\n        },\n\n        _initEventHandlers: function () {\n            parentWidget.prototype._initEventHandlers.call(this);\n            var eventData = {fileupload: this};\n            this.options.filesContainer\n                .delegate(\n                    '.start button',\n                    'click.' + this.options.namespace,\n                    eventData,\n                    this._startHandler\n                )\n                .delegate(\n                    '.cancel button',\n                    'click.' + this.options.namespace,\n                    eventData,\n                    this._cancelHandler\n                )\n                .delegate(\n                    '.delete button',\n                    'click.' + this.options.namespace,\n                    eventData,\n                    this._deleteHandler\n                );\n            this._initButtonBarEventHandlers();\n        },\n\n        _destroyEventHandlers: function () {\n            var options = this.options;\n            this._destroyButtonBarEventHandlers();\n            options.filesContainer\n                .undelegate('.start button', 'click.' + options.namespace)\n                .undelegate('.cancel button', 'click.' + options.namespace)\n                .undelegate('.delete button', 'click.' + options.namespace);\n            parentWidget.prototype._destroyEventHandlers.call(this);\n        },\n\n        _enableFileInputButton: function () {\n            this.element.find('.fileinput-button input')\n                .prop('disabled', false)\n                .parent().removeClass('disabled');\n        },\n\n        _disableFileInputButton: function () {\n            this.element.find('.fileinput-button input')\n                .prop('disabled', true)\n                .parent().addClass('disabled');\n        },\n\n        _initTemplates: function () {\n            var options = this.options;\n            options.templatesContainer = document.createElement(\n                options.filesContainer.prop('nodeName')\n            );\n            if (tmpl) {\n                if (options.uploadTemplateId) {\n                    options.uploadTemplate = tmpl(options.uploadTemplateId);\n                }\n                if (options.downloadTemplateId) {\n                    options.downloadTemplate = tmpl(options.downloadTemplateId);\n                }\n            }\n        },\n\n        _initFilesContainer: function () {\n            var options = this.options;\n            if (options.filesContainer === undefined) {\n                options.filesContainer = this.element.find('.files');\n            } else if (!(options.filesContainer instanceof $)) {\n                options.filesContainer = $(options.filesContainer);\n            }\n        },\n\n        _stringToRegExp: function (str) {\n            var parts = str.split('/'),\n                modifiers = parts.pop();\n            parts.shift();\n            return new RegExp(parts.join('/'), modifiers);\n        },\n\n        _initRegExpOptions: function () {\n            var options = this.options;\n            if ($.type(options.acceptFileTypes) === 'string') {\n                options.acceptFileTypes = this._stringToRegExp(\n                    options.acceptFileTypes\n                );\n            }\n            if ($.type(options.previewSourceFileTypes) === 'string') {\n                options.previewSourceFileTypes = this._stringToRegExp(\n                    options.previewSourceFileTypes\n                );\n            }\n        },\n\n        _initSpecialOptions: function () {\n            parentWidget.prototype._initSpecialOptions.call(this);\n            this._initFilesContainer();\n            this._initTemplates();\n            this._initRegExpOptions();\n        },\n\n        _create: function () {\n            parentWidget.prototype._create.call(this);\n            this._refreshOptionsList.push(\n                'filesContainer',\n                'uploadTemplateId',\n                'downloadTemplateId'\n            );\n            if (!$.blueimpFP) {\n                this._processingQueue = $.Deferred().resolveWith(this).promise();\n                this.process = function () {\n                    return this._processingQueue;\n                };\n            }\n        },\n\n        enable: function () {\n            var wasDisabled = false;\n            if (this.options.disabled) {\n                wasDisabled = true;\n            }\n            parentWidget.prototype.enable.call(this);\n            if (wasDisabled) {\n                this.element.find('input, button').prop('disabled', false);\n                this._enableFileInputButton();\n            }\n        },\n\n        disable: function () {\n            if (!this.options.disabled) {\n                this.element.find('input, button').prop('disabled', true);\n                this._disableFileInputButton();\n            }\n            parentWidget.prototype.disable.call(this);\n        }\n\n    });\n\n}));\n"}
}});
