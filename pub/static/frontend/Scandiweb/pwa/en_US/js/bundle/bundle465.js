require.config({"config": {
        "jsbuild":{"Magento_Multishipping/js/multi-shipping.js":"/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n\ndefine([\n    'jquery',\n    'jquery-ui-modules/widget'\n], function ($) {\n    'use strict';\n\n    $.widget('mage.multiShipping', {\n        options: {\n            addNewAddressBtn: 'button[data-role=\"add-new-address\"]', // Add a new multishipping address.\n            addNewAddressFlag: '#add_new_address_flag', // Hidden input field with value 0 or 1.\n            canContinueBtn: 'button[data-role=\"can-continue\"]', // Continue (update quantity or go to shipping).\n            canContinueFlag: '#can_continue_flag' // Hidden input field with value 0 or 1.\n        },\n\n        /**\n         * Bind event handlers to click events for corresponding buttons.\n         * @private\n         */\n        _create: function () {\n            $(this.options.addNewAddressBtn).on('click', $.proxy(this._addNewAddress, this));\n            $(this.options.canContinueBtn).on('click', $.proxy(this._canContinue, this));\n        },\n\n        /**\n         * Add a new address. Set the hidden input field and submit the form. Then enter a new shipping address.\n         * @private\n         */\n        _addNewAddress: function () {\n            $(this.options.addNewAddressFlag).val(1);\n            this.element.submit();\n        },\n\n        /**\n         * Can the user continue to the next step? The data-flag attribute holds either 0 (no) or 1 (yes).\n         * @private\n         * @param {Event} event - Click event on the corresponding button.\n         */\n        _canContinue: function (event) {\n            $(this.options.canContinueFlag).val(parseInt($(event.currentTarget).data('flag'), 10));\n        }\n    });\n\n    return $.mage.multiShipping;\n});\n"}
}});