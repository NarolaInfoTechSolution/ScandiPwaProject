require.config({"config": {
        "jsbuild":{"Magento_Sales/js/orders-returns.js":"/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n\ndefine([\n    'jquery',\n    'jquery-ui-modules/widget'\n], function ($) {\n    'use strict';\n\n    $.widget('mage.ordersReturns', {\n        options: {\n            zipCode: '#oar-zip', // Search by zip code.\n            emailAddress: '#oar-email', // Search by email address.\n            searchType: '#quick-search-type-id' // Search element used for choosing between the two.\n        },\n\n        /** @inheritdoc */\n        _create: function () {\n            $(this.options.searchType).on('change', $.proxy(this._showIdentifyBlock, this)).trigger('change');\n        },\n\n        /**\n         * Show either the search by zip code option or the search by email address option.\n         * @private\n         * @param {jQuery.Event} e - Change event. Event target value is either 'zip' or 'email'.\n         */\n        _showIdentifyBlock: function (e) {\n            var value = $(e.target).val();\n\n            $(this.options.zipCode).toggle(value === 'zip');\n            $(this.options.emailAddress).toggle(value === 'email');\n        }\n    });\n\n    return $.mage.ordersReturns;\n});\n"}
}});
