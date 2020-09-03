require.config({"config": {
        "jsbuild":{"mage/backend/validation.js":"/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n\n/* global BASE_URL, alertAlreadyDisplayed */\ndefine([\n    'jquery',\n    'underscore',\n    'Magento_Ui/js/modal/alert',\n    'jquery/ui',\n    'jquery/validate',\n    'mage/translate',\n    'mage/validation'\n], function ($, _, alert) {\n    'use strict';\n\n    $.extend(true, $.validator.prototype, {\n        /**\n         * Focus invalid fields\n         */\n        focusInvalid: function () {\n            if (this.settings.focusInvalid) {\n                try {\n                    $(this.errorList.length && this.errorList[0].element || [])\n                        .focus()\n                        .trigger('focusin');\n                } catch (e) {\n                    // ignore IE throwing errors when focusing hidden elements\n                }\n            }\n        },\n\n        /**\n         * Elements.\n         */\n        elements: function () {\n            var validator = this,\n                rulesCache = {};\n\n            // select all valid inputs inside the form (no submit or reset buttons)\n            return $(this.currentForm)\n                .find('input, select, textarea')\n                .not(this.settings.forceIgnore)\n                .not(':submit, :reset, :image, [disabled]')\n                .not(this.settings.ignore)\n                .filter(function () {\n                    if (!this.name && validator.settings.debug && window.console) {\n                        console.error('%o has no name assigned', this);\n                    }\n\n                    // select only the first element for each name, and only those with rules specified\n                    if (this.name in rulesCache || !validator.objectLength($(this).rules())) {\n                        return false;\n                    }\n\n                    rulesCache[this.name] = true;\n\n                    return true;\n                });\n        }\n    });\n\n    $.extend($.fn, {\n        /**\n         * ValidationDelegate overridden for those cases where the form is located in another form,\n         *     to avoid not correct working of validate plug-in\n         * @override\n         * @param {String} delegate - selector, if event target matched against this selector,\n         *     then event will be delegated\n         * @param {String} type - event type\n         * @param {Function} handler - event handler\n         * @return {Element}\n         */\n        validateDelegate: function (delegate, type, handler) {\n            return this.on(type, $.proxy(function (event) {\n                var target = $(event.target),\n                    form = target[0].form;\n\n                if (form && $(form).is(this) && $.data(form, 'validator') && target.is(delegate)) {\n                    return handler.apply(target, arguments);\n                }\n            }, this));\n        }\n    });\n\n    $.widget('mage.validation', $.mage.validation, {\n        options: {\n            messagesId: 'messages',\n            forceIgnore: '',\n            ignore: ':disabled, .ignore-validate, .no-display.template, ' +\n                ':disabled input, .ignore-validate input, .no-display.template input, ' +\n                ':disabled select, .ignore-validate select, .no-display.template select, ' +\n                ':disabled textarea, .ignore-validate textarea, .no-display.template textarea',\n            errorElement: 'label',\n            errorUrl: typeof BASE_URL !== 'undefined' ? BASE_URL : null,\n\n            /**\n             * @param {HTMLElement} element\n             */\n            highlight: function (element) {\n                if ($.validator.defaults.highlight && $.isFunction($.validator.defaults.highlight)) {\n                    $.validator.defaults.highlight.apply(this, arguments);\n                }\n                $(element).trigger('highlight.validate');\n            },\n\n            /**\n             * @param {HTMLElement} element\n             */\n            unhighlight: function (element) {\n                if ($.validator.defaults.unhighlight && $.isFunction($.validator.defaults.unhighlight)) {\n                    $.validator.defaults.unhighlight.apply(this, arguments);\n                }\n                $(element).trigger('unhighlight.validate');\n            }\n        },\n\n        /**\n         * Validation creation\n         * @protected\n         */\n        _create: function () {\n            if (!this.options.submitHandler && $.type(this.options.submitHandler) !== 'function') {\n                if (!this.options.frontendOnly && this.options.validationUrl) {\n                    this.options.submitHandler = $.proxy(this._ajaxValidate, this);\n                } else {\n                    this.options.submitHandler = $.proxy(this._submit, this);\n                }\n            }\n            this.element.on('resetElement', function (e) {\n                $(e.target).rules('remove');\n            });\n            this._super('_create');\n        },\n\n        /**\n         * ajax validation\n         * @protected\n         */\n        _ajaxValidate: function () {\n            $.ajax({\n                url: this.options.validationUrl,\n                type: 'POST',\n                dataType: 'json',\n                data: this.element.serialize(),\n                context: $('body'),\n                success: $.proxy(this._onSuccess, this),\n                error: $.proxy(this._onError, this),\n                showLoader: true,\n                dontHide: false\n            });\n        },\n\n        /**\n         * Process ajax success.\n         *\n         * @protected\n         * @param {Object} response\n         */\n        _onSuccess: function (response) {\n            if (!response.error) {\n                this._submit();\n            } else {\n                this._showErrors(response);\n                $(this.element[0]).trigger('afterValidate.error');\n                $('body').trigger('processStop');\n            }\n        },\n\n        /**\n         * Submitting a form.\n         * @private\n         */\n        _submit: function () {\n            $(this.element[0]).trigger('afterValidate.beforeSubmit');\n            this.element[0].submit();\n        },\n\n        /**\n         * Displays errors after backend validation.\n         *\n         * @param {Object} data - Data that came from backend.\n         */\n        _showErrors: function (data) {\n            $('body').notification('clear')\n                .notification('add', {\n                    error: data.error,\n                    message: data.message,\n\n                    /**\n                     * @param {*} message\n                     */\n                    insertMethod: function (message) {\n                        $('.messages:first').html(message);\n                    }\n                });\n        },\n\n        /**\n         * Tries to retrieve element either by id or by inputs' name property.\n         * @param {String} code - String to search by.\n         * @returns {jQuery} jQuery element.\n         */\n        _getByCode: function (code) {\n            var parent = this.element[0],\n                element;\n\n            element = parent.querySelector('#' + code) || parent.querySelector('input[name=' + code + ']');\n\n            return $(element);\n        },\n\n        /**\n         * Process ajax error\n         * @protected\n         */\n        _onError: function () {\n            $(this.element[0]).trigger('afterValidate.error');\n            $('body').trigger('processStop');\n\n            if (this.options.errorUrl) {\n                location.href = this.options.errorUrl;\n            }\n        }\n    });\n\n    _.each({\n        'validate-greater-zero-based-on-option': [\n            function (v, el) {\n                var optionType = $(el)\n                    .closest('.form-list')\n                    .prev('.fieldset-alt')\n                    .find('select.select-product-option-type'),\n                    optionTypeVal = optionType.val();\n\n                v = Number(v) || 0;\n\n                if (optionType && (optionTypeVal == 'checkbox' || optionTypeVal == 'multi') && v <= 0) { //eslint-disable-line\n                    return false;\n                }\n\n                return true;\n            },\n            $.mage.__('Please enter a number greater 0 in this field.')\n        ],\n        'validate-rating': [\n            function () {\n                var ratings = $('#detailed_rating').find('.field-rating'),\n                    noError = true;\n\n                ratings.each(function (index, rating) {\n                    noError = noError && $(rating).find('input:checked').length > 0;\n                });\n\n                return noError;\n            },\n            $.mage.__('Please select one of each ratings above.')\n        ],\n        'validate-downloadable-file': [\n            function (v, element) {\n                var elmParent = $(element).parent(),\n                    linkType = elmParent.find('input[value=\"file\"]'),\n                    newFileContainer;\n\n                if (linkType.is(':checked') && (v === '' || v === '[]')) {\n                    newFileContainer = elmParent.find('.new-file');\n\n                    if (!alertAlreadyDisplayed && (newFileContainer.empty() || newFileContainer.is(':visible'))) {\n                        window.alertAlreadyDisplayed = true;\n                        alert({\n                            content: $.mage.__('There are files that were selected but not uploaded yet. ' +\n                            'Please upload or remove them first')\n                        });\n                    }\n\n                    return false;\n                }\n\n                return true;\n            },\n            'Please upload a file.'\n        ],\n        'validate-downloadable-url': [\n            function (v, element) {\n                var linkType = $(element).parent().find('input[value=\"url\"]');\n\n                if (linkType.is(':checked') && v === '') {\n                    return false;\n                }\n\n                return true;\n            },\n            $.mage.__('Please specify Url.')\n        ]\n    }, function (rule, i) {\n        rule.unshift(i);\n        $.validator.addMethod.apply($.validator, rule);\n    });\n\n    return $.mage.validation;\n});\n"}
}});