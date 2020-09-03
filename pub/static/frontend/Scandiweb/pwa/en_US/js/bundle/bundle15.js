require.config({"config": {
        "jsbuild":{"Magento_Braintree/js/view/payment/kount.js":"/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n/*browser:true*/\n/*global define*/\n\ndefine([\n    'jquery',\n    'braintreeDataCollector',\n    'Magento_Braintree/js/view/payment/adapter'\n], function (\n    $,\n    braintreeDataCollector,\n    braintreeAdapter\n) {\n    'use strict';\n\n    return {\n        paymentCode: 'braintree',\n\n        /**\n         * Returns information about a customer's device on checkout page for passing to Kount for review.\n         *\n         * @returns {Object}\n         */\n        getDeviceData: function () {\n            var state = $.Deferred();\n\n            if (this.hasFraudProtection()) {\n                braintreeAdapter.getApiClient()\n                    .then(function (clientInstance) {\n                        return braintreeDataCollector.create({\n                            client: clientInstance,\n                            kount: true\n                        });\n                    })\n                    .then(function (dataCollectorInstance) {\n                        var deviceData = dataCollectorInstance.deviceData;\n\n                        state.resolve(deviceData);\n                    })\n                    .catch(function (err) {\n                        state.reject(err);\n                    });\n            }\n\n            return state.promise();\n        },\n\n        /**\n         * Returns setting value.\n         *\n         * @returns {Boolean}\n         * @private\n         */\n        hasFraudProtection: function () {\n            return window.checkoutConfig.payment[this.paymentCode].hasFraudProtection;\n        }\n    };\n});\n"}
}});