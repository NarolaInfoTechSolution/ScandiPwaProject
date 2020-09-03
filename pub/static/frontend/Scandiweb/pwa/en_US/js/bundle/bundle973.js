require.config({"config": {
        "jsbuild":{"mage/dataPost.js":"/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n\ndefine([\n    'jquery',\n    'mage/template',\n    'Magento_Ui/js/modal/confirm',\n    'jquery-ui-modules/widget'\n], function ($, mageTemplate, uiConfirm) {\n    'use strict';\n\n    $.widget('mage.dataPost', {\n        options: {\n            formTemplate: '<form action=\"<%- data.action %>\" method=\"post\">' +\n            '<% _.each(data.data, function(value, index) { %>' +\n            '<input name=\"<%- index %>\" value=\"<%- value %>\">' +\n            '<% }) %></form>',\n            postTrigger: ['a[data-post]', 'button[data-post]', 'span[data-post]'],\n            formKeyInputSelector: 'input[name=\"form_key\"]'\n        },\n\n        /** @inheritdoc */\n        _create: function () {\n            this._bind();\n        },\n\n        /** @inheritdoc */\n        _bind: function () {\n            var events = {};\n\n            $.each(this.options.postTrigger, function (index, value) {\n                events['click ' + value] = '_postDataAction';\n            });\n\n            this._on(events);\n        },\n\n        /**\n         * Handler for click.\n         *\n         * @param {Object} e\n         * @private\n         */\n        _postDataAction: function (e) {\n            var params = $(e.currentTarget).data('post');\n\n            e.preventDefault();\n            this.postData(params);\n        },\n\n        /**\n         * Data post action.\n         *\n         * @param {Object} params\n         */\n        postData: function (params) {\n            var formKey = $(this.options.formKeyInputSelector).val(),\n                $form, input;\n\n            if (formKey) {\n                params.data['form_key'] = formKey;\n            }\n\n            $form = $(mageTemplate(this.options.formTemplate, {\n                data: params\n            }));\n\n            if (params.files) {\n                $form[0].enctype = 'multipart/form-data';\n                $.each(params.files, function (key, files) {\n                    if (files instanceof FileList) {\n                        input = document.createElement('input');\n                        input.type = 'file';\n                        input.name = key;\n                        input.files = files;\n                        $form[0].appendChild(input);\n                    }\n                });\n            }\n\n            if (params.data.confirmation) {\n                uiConfirm({\n                    content: params.data.confirmationMessage,\n                    actions: {\n                        /** @inheritdoc */\n                        confirm: function () {\n                            $form.appendTo('body').hide().submit();\n                        }\n                    }\n                });\n            } else {\n                $form.appendTo('body').hide().submit();\n            }\n        }\n    });\n\n    $(document).dataPost();\n\n    return $.mage.dataPost;\n});\n"}
}});
