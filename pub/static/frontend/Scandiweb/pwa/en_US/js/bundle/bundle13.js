require.config({"config": {
        "jsbuild":{"Magento_Braintree/js/view/payment/adapter.js":"/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n/*browser:true*/\n/*global define*/\ndefine([\n    'jquery',\n    'braintreeClient'\n], function ($, braintreeClient) {\n    'use strict';\n\n    return {\n        apiClient: null,\n        checkout: null,\n        code: 'braintree',\n\n        /**\n         * Returns Braintree API client\n         * @returns {Object}\n         */\n        getApiClient: function () {\n            return braintreeClient.create({\n                authorization: this.getClientToken()\n            });\n        },\n\n        /**\n         * Returns payment code\n         *\n         * @returns {String}\n         */\n        getCode: function () {\n            return this.code;\n        },\n\n        /**\n         * Returns client token\n         *\n         * @returns {String}\n         * @private\n         */\n        getClientToken: function () {\n            return window.checkoutConfig.payment[this.code].clientToken;\n        }\n    };\n});\n"}
}});