require.config({"config": {
        "jsbuild":{"Magento_Paypal/js/in-context/button.js":"/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\ndefine([\n    'uiComponent',\n    'jquery',\n    'Magento_Paypal/js/in-context/express-checkout-wrapper',\n    'Magento_Customer/js/customer-data'\n], function (Component, $, Wrapper, customerData) {\n    'use strict';\n\n    return Component.extend(Wrapper).extend({\n        defaults: {\n            declinePayment: false\n        },\n\n        /** @inheritdoc */\n        initialize: function (config, element) {\n            var cart = customerData.get('cart'),\n                customer = customerData.get('customer');\n\n            this._super();\n            this.renderPayPalButtons(element);\n            this.declinePayment = !customer().firstname && !cart().isGuestCheckoutAllowed;\n\n            return this;\n        },\n\n        /** @inheritdoc */\n        beforePayment: function (resolve, reject) {\n            var promise = $.Deferred();\n\n            if (this.declinePayment) {\n                this.addError(this.signInMessage, 'warning');\n\n                reject();\n            } else {\n                promise.resolve();\n            }\n\n            return promise;\n        },\n\n        /** @inheritdoc */\n        prepareClientConfig: function () {\n            this._super();\n            this.clientConfig.commit = false;\n\n            return this.clientConfig;\n        }\n    });\n});\n"}
}});
