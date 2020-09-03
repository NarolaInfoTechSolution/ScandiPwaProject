require.config({"config": {
        "jsbuild":{"Magento_Catalog/js/price-option-file.js":"/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n\ndefine([\n    'jquery',\n    'jquery-ui-modules/widget'\n], function ($) {\n    'use strict';\n\n    $.widget('mage.priceOptionFile', {\n        options: {\n            fileName: '',\n            fileNamed: '',\n            fieldNameAction: '',\n            changeFileSelector: '',\n            deleteFileSelector: ''\n        },\n\n        /**\n         * Creates instance of widget\n         * @private\n         */\n        _create: function () {\n            this.fileDeleteFlag = this.fileChangeFlag = false;\n            this.inputField = this.element.find('input[name=' + this.options.fileName + ']')[0];\n            this.inputFieldAction = this.element.find('input[name=' + this.options.fieldNameAction + ']')[0];\n            this.fileNameSpan = this.element.parent('dd').find('.' + this.options.fileNamed);\n\n            $(this.options.changeFileSelector).on('click', $.proxy(function () {\n                this._toggleFileChange();\n            }, this));\n            $(this.options.deleteFileSelector).on('click', $.proxy(function () {\n                this._toggleFileDelete();\n            }, this));\n        },\n\n        /**\n         * Toggles whether the current file is being changed or not. If the file is being deleted\n         * then the option to change the file is disabled.\n         * @private\n         */\n        _toggleFileChange: function () {\n            this.element.toggle();\n            this.fileChangeFlag = !this.fileChangeFlag;\n\n            if (!this.fileDeleteFlag) {\n                $(this.inputFieldAction).attr('value', this.fileChangeFlag ? 'save_new' : 'save_old');\n                this.inputField.disabled = !this.fileChangeFlag;\n            }\n        },\n\n        /**\n         * Toggles whether the file is to be deleted. When the file is being deleted, the name of\n         * the file is decorated with strike-through text and the option to change the file is\n         * disabled.\n         * @private\n         */\n        _toggleFileDelete: function () {\n            this.fileDeleteFlag = $(this.options.deleteFileSelector + ':checked').val();\n            $(this.inputFieldAction).attr('value',\n                this.fileDeleteFlag ? '' : this.fileChangeFlag ? 'save_new' : 'save_old');\n            this.inputField.disabled = this.fileDeleteFlag || !this.fileChangeFlag;\n            this.fileNameSpan.css('text-decoration', this.fileDeleteFlag ? 'line-through' : 'none');\n        }\n    });\n\n    return $.mage.priceOptionFile;\n});\n"}
}});
