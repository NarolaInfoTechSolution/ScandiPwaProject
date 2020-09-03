require.config({"config": {
        "jsbuild":{"Magento_Paypal/js/in-context/express-checkout.js":"/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\ndefine([\n    'underscore',\n    'jquery',\n    'uiComponent',\n    'paypalInContextExpressCheckout',\n    'Magento_Customer/js/customer-data',\n    'domReady!'\n], function (_, $, Component, paypalExpressCheckout, customerData) {\n    'use strict';\n\n    return Component.extend({\n\n        defaults: {\n            clientConfig: {\n\n                checkoutInited: false,\n\n                /**\n                 * @param {Object} event\n                 */\n                click: function (event) {\n                    $('body').trigger('processStart');\n\n                    event.preventDefault();\n\n                    if (!this.clientConfig.checkoutInited) {\n                        paypalExpressCheckout.checkout.initXO();\n                        this.clientConfig.checkoutInited = true;\n                    } else {\n                        paypalExpressCheckout.checkout.closeFlow();\n                    }\n\n                    $.getJSON(this.path, {\n                        button: 1\n                    }).done(function (response) {\n                        var message = response && response.message;\n\n                        if (message) {\n                            customerData.set('messages', {\n                                messages: [message]\n                            });\n                        }\n\n                        if (response && response.url) {\n                            paypalExpressCheckout.checkout.startFlow(response.url);\n\n                            return;\n                        }\n\n                        paypalExpressCheckout.checkout.closeFlow();\n                    }).fail(function () {\n                        paypalExpressCheckout.checkout.closeFlow();\n                    }).always(function () {\n                        $('body').trigger('processStop');\n                        customerData.invalidate(['cart']);\n                    });\n                }\n            }\n        },\n\n        /**\n         * @returns {Object}\n         */\n        initialize: function () {\n            this._super();\n\n            return this.initClient();\n        },\n\n        /**\n         * @returns {Object}\n         */\n        initClient: function () {\n            _.each(this.clientConfig, function (fn, name) {\n                if (typeof fn === 'function') {\n                    this.clientConfig[name] = fn.bind(this);\n                }\n            }, this);\n\n            paypalExpressCheckout.checkout.setup(this.merchantId, this.clientConfig);\n\n            return this;\n        }\n    });\n});\n"}
}});