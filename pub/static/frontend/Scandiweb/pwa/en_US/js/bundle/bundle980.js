require.config({"config": {
        "jsbuild":{"mage/translate-inline-vde.js":"/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n\n/**\n * @deprecated since version 2.2.0\n */\ndefine([\n    'jquery',\n    'mage/template',\n    'jquery-ui-modules/widget',\n    'jquery-ui-modules/core',\n    'mage/translate-inline',\n    'mage/translate'\n], function ($, mageTemplate) {\n    'use strict';\n\n    /**\n     * Widget for a dialog to edit translations.\n     */\n    $.widget('mage.translateInlineDialogVde', $.mage.translateInline, {\n        options: {\n            translateForm: {\n                template: '#translate-inline-dialog-form-template',\n                data: {\n                    selector: '#translate-inline-dialog-form'\n                }\n            },\n            dialogClass: 'translate-dialog',\n            draggable: false,\n            modal: false,\n            resizable: false,\n            height: 'auto',\n            minHeight: 0,\n            buttons: [{\n                text: $.mage.__('Cancel'),\n                'class': 'translate-dialog-cancel',\n\n                /**\n                 * Click.\n                 */\n                click: function () {\n                    $(this).translateInlineDialogVde('close');\n                }\n            },\n            {\n                text: $.mage.__('Save'),\n                'class': 'translate-dialog-save',\n\n                /**\n                 * Click.\n                 */\n                click: function () {\n                    $(this).translateInlineDialogVde('submit');\n                }\n            }],\n\n            area: 'vde',\n            ajaxUrl: null,\n            textTranslations: null,\n            imageTranslations: null,\n            scriptTranslations: null,\n            translateMode: null,\n            translateModes: ['text', 'script', 'alt']\n        },\n\n        /**\n         * Identifies if the form is already being submitted.\n         *\n         * @type {Boolean}\n         */\n        isSubmitting: false,\n\n        /**\n         * Identifies if inline text is being editied.  Only one element can be edited at a time.\n         *\n         * @type {Boolean}\n         */\n        isBeingEdited: false,\n\n        /**\n         * Creates the translation dialog widget. Fulfills jQuery WidgetFactory _create hook.\n         */\n        _create: function () {\n            this._super();\n            // Unbind previously bound events that may be present from previous loads of vde container.\n            if (parent && parent.jQuery) {\n                parent.jQuery('[data-frame=\"editor\"]')\n                    .off('modeChange')\n                    .on('modeChange', $.proxy(this._checkTranslateEditing, this));\n            }\n        },\n\n        /**\n         * @param {jQuery.Event} e\n         * @param {Object} widget\n         * @param {Function} callback\n         */\n        openWithWidget: function (e, widget, callback) {\n            if (widget && callback) {\n                this.callback = callback;\n                this.element.html(this._prepareContent($(widget.element).data('translate')));\n                this.triggerElement = widget.element;\n                $(window).on('resize.translateInlineDialogVde', $.proxy(this._positionNearTarget, this));\n                this._positionNearTarget();\n            }\n            this.open(arguments);\n        },\n\n        /**\n         * @private\n         */\n        _positionNearTarget: function () {\n            this.option('position', {\n                of: this.triggerElement,\n                my: 'left top',\n                at: 'left-3 top-9'\n            });\n            this.option('width', $(this.triggerElement).width());\n        },\n\n        /**\n         * Close.\n         */\n        close: function () {\n            this._super();\n            this._onCancel();\n            this.isBeingEdited = false;\n            $(window).off('resize.translateInlineVdeDialog');\n        },\n\n        /**\n         * Shows translate mode applicable css styles.\n         */\n        toggleStyle: function (mode) {\n            // TODO: need to remove eventually\n            this._toggleOutline(mode);\n\n            this.options.textTranslations.translateInlineVde('toggleIcon', mode);\n            this.options.imageTranslations.translateInlineImageVde('toggleIcon', mode);\n            this.options.scriptTranslations.translateInlineScriptVde('toggleIcon', mode);\n        },\n\n        /**\n         * Determine if user has modified inline translation text, but has not saved it.\n         */\n        _checkTranslateEditing: function (event, data) {\n            var url, dataDisable;\n\n            if (this.isBeingEdited) {\n                alert(data['alert_message']); //eslint-disable-line no-alert\n                data['is_being_edited'] = true;\n            } else {\n                // Disable inline translation.\n                url = parent.jQuery('[data-frame=\"editor\"]').attr('src');\n                dataDisable = {\n                    frameUrl: url.substring(0, url.indexOf('translation_mode')),\n                    mode: this.options.translateMode\n                };\n                parent.jQuery('[vde-translate]').trigger('disableInlineTranslation', dataDisable);\n\n                // Inline translation text is not being edited.  Continue on.\n                parent.jQuery('[data-frame=\"editor\"]').trigger(data['next_action'], data);\n            }\n        },\n\n        /**\n         * @return {*}\n         * @private\n         */\n        _prepareContent: function () {\n            var content = this._superApply(arguments);\n\n            this._on(content.find('textarea[data-translate-input-index]'), {\n                /**\n                 * @param {jQuery.Event} e\n                 */\n                keydown: function (e) {\n                    var keyCode = $.ui.keyCode;\n\n                    switch (e.keyCode) {\n                        case keyCode.ESCAPE:\n                            e.preventDefault();\n                            this.close();\n                            break;\n\n                        case keyCode.ENTER:\n                            e.preventDefault();\n                            this._formSubmit();\n                            break;\n                        default:\n                            // keep track of the fact that translate text has been changed\n                            this.isBeingEdited = true;\n                    }\n                }\n            });\n            this._on(content.find(this.options.translateForm.data.selector), {\n                /**\n                 * @param {jQuery.Event} e\n                 * @return {Boolean}\n                 */\n                submit: function (e) {\n                    e.preventDefault();\n                    this._formSubmit();\n\n                    return true;\n                }\n            });\n\n            return content;\n        },\n\n        /**\n         * Submits the form.\n         */\n        _formSubmit: function () {\n            this._superApply(arguments);\n            this.isBeingEdited = false;\n        },\n\n        /**\n         * Callback for when the AJAX call in _formSubmit is completed.\n         */\n        _formSubmitComplete: function () {\n            // TODO: need to replace with merged version\n            var self = this;\n\n            this.element.find('[data-translate-input-index]').each($.proxy(function (count, elem) {\n                var index = $(elem).data('translate-input-index'),\n                    value = $(elem).val() || '';\n\n                self.callback(index, value);\n                self = null;\n            }, this));\n\n            $(window).off('resize.translateInlineVdeDialog');\n            this._onSubmitComplete();\n\n            this._superApply(arguments);\n            this.isSubmitting = false;\n        },\n\n        /**\n         * @param {*} mode\n         * @private\n         */\n        _toggleOutline: function (mode) {\n            var that = this;\n\n            // TODO: need to remove eventually\n            if (mode == null) {\n                mode = this.options.translateMode;\n            } else {\n                this.options.translateMode = mode;\n            }\n\n            this.element.closest('[data-container=\"body\"]').addClass('trnslate-inline-' + mode + '-area');\n            $.each(this.options.translateModes, function () {\n                if (this != mode) { //eslint-disable-line eqeqeq\n                    that.element.closest('[data-container=\"body\"]').removeClass('trnslate-inline-' + this + '-area');\n                }\n            });\n        },\n\n        /**\n         * @private\n         */\n        _onCancel: function () {\n            // TODO: need to remove eventually\n            this._toggleOutline();\n            this.options.textTranslations.translateInlineVde('show');\n            this.options.imageTranslations.translateInlineImageVde('show');\n            this.options.scriptTranslations.translateInlineScriptVde('show');\n        },\n\n        /**\n         * @private\n         */\n        _onSubmitComplete: function () {\n            // TODO: need to remove eventually\n            this._toggleOutline();\n            this.options.textTranslations.translateInlineVde('show');\n            this.options.imageTranslations.translateInlineImageVde('show');\n            this.options.scriptTranslations.translateInlineScriptVde('show');\n        }\n    });\n\n    /**\n     * Widget for an icon to be displayed indicating that text can be translated.\n     */\n    $.widget('mage.translateInlineVde', {\n        options: {\n            iconTemplateSelector: '[data-template=\"translate-inline-icon\"]',\n            img: null,\n            imgHover: null,\n\n            offsetLeft: -16,\n\n            dataAttrName: 'translate',\n            translateMode: null,\n\n            /**\n             * On click.\n             */\n            onClick: function () {}\n        },\n\n        /**\n         * Elements to wrap instead of just inserting a child element. This is\n         * to work around some different behavior in Firefox vs. WebKit.\n         *\n         * @type {Array}\n         */\n        elementsToWrap: ['button'],\n\n        /**\n         * Determines if the template is already appended to the element.\n         *\n         * @type {Boolean}\n         */\n        isTemplateAttached: false,\n\n        iconTemplate: null,\n        iconWrapperTemplate: null,\n        elementWrapperTemplate: null,\n\n        /**\n         * Determines if the element is suppose to be wrapped or just attached.\n         *\n         * @type {Boolean}, null is unset, false/true is set\n         */\n        isElementWrapped: null,\n\n        /**\n         * Creates the icon widget to indicate text that can be translated.\n         * Fulfills jQuery's WidgetFactory _create hook.\n         */\n        _create: function () {\n            this.element.addClass('translate-edit-icon-container');\n            this._initTemplates();\n            this.show();\n        },\n\n        /**\n         * Shows the widget.\n         */\n        show: function () {\n            this._attachIcon();\n\n            this.iconTemplate.removeClass('hidden');\n\n            if (this.element.data('translateMode') != this.options.translateMode) { //eslint-disable-line eqeqeq\n                this.iconTemplate.addClass('hidden');\n            }\n\n            this.element.on('dblclick', $.proxy(this._invokeAction, this));\n            this._disableElementClicks();\n        },\n\n        /**\n         * Show edit icon for given translate mode.\n         */\n        toggleIcon: function (mode) {\n            if (mode == this.element.data('translateMode')) { //eslint-disable-line eqeqeq\n                this.iconTemplate.removeClass('hidden');\n            } else {\n                this.iconTemplate.addClass('hidden');\n            }\n\n            this.options.translateMode = mode;\n        },\n\n        /**\n         * Determines if the element should have an icon element wrapped around it or\n         * if an icon element should be added as a child element.\n         */\n        _shouldWrap: function () {\n            var c;\n\n            if (this.isElementWrapped !== null) {\n                return this.isElementWrapped;\n            }\n\n            this.isElementWrapped = false;\n\n            for (c = 0; c < this.elementsToWrap.length; c++) {\n                if (this.element.is(this.elementsToWrap[c])) {\n                    this.isElementWrapped = true;\n                    break;\n                }\n            }\n\n            return this.isElementWrapped;\n        },\n\n        /**\n         * Attaches an icon to the widget's element.\n         */\n        _attachIcon: function () {\n            if (this._shouldWrap()) {\n                if (!this.isTemplateAttached) {\n                    this.iconWrapperTemplate = this.iconTemplate.wrap('<div/>').parent();\n                    this.iconWrapperTemplate.addClass('translate-edit-icon-wrapper-text');\n\n                    this.elementWrapperTemplate = this.element.wrap('<div/>').parent();\n                    this.elementWrapperTemplate.addClass('translate-edit-icon-container');\n\n                    this.iconTemplate.appendTo(this.iconWrapperTemplate);\n                    this.iconWrapperTemplate.appendTo(this.elementWrapperTemplate);\n                }\n            } else {\n                this.iconTemplate.appendTo(this.element);\n                this.element.removeClass('invisible');\n            }\n\n            this.isTemplateAttached = true;\n        },\n\n        /**\n         * Disables the element click from actually performing a click.\n         */\n        _disableElementClicks: function () {\n            this.element.find('a').off('click');\n\n            if (this.element.is('A')) {\n                this.element.on('click', function () {\n                    return false;\n                });\n            }\n        },\n\n        /**\n         * Hides the widget.\n         */\n        hide: function () {\n            this.element.off('dblclick');\n            this.iconTemplate.addClass('hidden');\n        },\n\n        /**\n         * Replaces the translated text inside the widget with the new value.\n         */\n        replaceText: function (index, value) {\n            var translateData = this.element.data(this.options.dataAttrName),\n                innerHtmlStr = this.element.html();\n\n            if (value === null || value === '') {\n                value = '&nbsp;';\n            }\n\n            innerHtmlStr =  innerHtmlStr.replace(translateData[index].shown, value);\n\n            this.element.html(innerHtmlStr);\n\n            translateData[index].shown = value;\n            translateData[index].translated = value;\n            this.element.data(this.options.dataAttrName, translateData);\n        },\n\n        /**\n         * Initializes all the templates for the widget.\n         */\n        _initTemplates: function () {\n            this._initIconTemplate();\n            this.iconTemplate.addClass('translate-edit-icon-text');\n        },\n\n        /**\n         * Changes depending on hover action.\n         */\n        _hoverIcon: function () {\n            if (this.options.imgHover) {\n                this.iconTemplate.prop('src', this.options.imgHover);\n            }\n        },\n\n        /**\n         * Changes depending on hover action.\n         */\n        _unhoverIcon: function () {\n            if (this.options.imgHover) {\n                this.iconTemplate.prop('src', this.options.img);\n            }\n        },\n\n        /**\n         * Initializes the icon template for the widget. Sets the widget up to\n         * respond to events.\n         */\n        _initIconTemplate: function () {\n            this.iconTemplate = $(mageTemplate(this.options.iconTemplateSelector, {\n                data: this.options\n            }));\n\n            this.iconTemplate.on('click', $.proxy(this._invokeAction, this))\n                             .on('mouseover', $.proxy(this._hoverIcon, this))\n                             .on('mouseout', $.proxy(this._unhoverIcon, this));\n        },\n\n        /**\n         * Invokes the action (e.g. activate the inline dialog)\n         */\n        _invokeAction: function (event) {\n            this._detachIcon();\n            this.options.onClick(event, this);\n        },\n\n        /**\n         * Destroys the widget. Fulfills jQuery's WidgetFactory _destroy hook.\n         */\n        _destroy: function () {\n            this.iconTemplate.remove();\n            this._detachIcon();\n        },\n\n        /**\n         * Detaches an icon from the widget's element.\n         */\n        _detachIcon: function () {\n            this._unhoverIcon();\n\n            $(this.iconTemplate).detach();\n\n            if (this._shouldWrap()) {\n                this.iconWrapperTemplate.remove();\n                this.element.unwrap();\n                this.elementWrapperTemplate.remove();\n            } else {\n                this.element.addClass('invisible');\n            }\n\n            this.isTemplateAttached = false;\n        }\n    });\n\n    $.widget('mage.translateInlineImageVde', $.mage.translateInlineVde, {\n        /**\n         * @private\n         */\n        _attachIcon: function () {\n            if (!this.isTemplateAttached) {\n                this.iconWrapperTemplate = this.iconTemplate.wrap('<div/>').parent();\n                this.iconWrapperTemplate.addClass('translate-edit-icon-wrapper-image');\n\n                this.elementWrapperTemplate = this.element.wrap('<div/>').parent();\n                this.elementWrapperTemplate.addClass('translate-edit-icon-container');\n\n                this.iconTemplate.appendTo(this.iconWrapperTemplate);\n                this.iconWrapperTemplate.appendTo(this.elementWrapperTemplate);\n\n                this.isTemplateAttached = true;\n            }\n        },\n\n        /**\n         * @private\n         */\n        _initTemplates: function () {\n            this._initIconTemplate();\n            this.iconTemplate.addClass('translate-edit-icon-image');\n        },\n\n        /**\n         * @private\n         */\n        _detachIcon: function () {\n            $(this.iconTemplate).detach();\n            this.iconWrapperTemplate.remove();\n            this.element.unwrap();\n            this.elementWrapperTemplate.remove();\n\n            this.isTemplateAttached = false;\n        }\n    });\n\n    $.widget('mage.translateInlineScriptVde', $.mage.translateInlineVde, {});\n\n    /*\n     * @TODO move the \"escapeHTML\" method into the file with global utility functions\n     */\n    $.extend(true, $, {\n        mage: {\n            /**\n             * @param {String} str\n             * @return {String}\n             */\n            escapeHTML: function (str) {\n                return str ? str.replace(/\"/g, '&quot;') : '';\n            }\n        }\n    });\n});\n"}
}});
