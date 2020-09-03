require.config({"config": {
        "jsbuild":{"Magento_Braintree/js/view/payment/method-renderer/vault.js":"/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n/*browser:true*/\n/*global define*/\ndefine([\n    'jquery',\n    'Magento_Vault/js/view/payment/method-renderer/vault',\n    'Magento_Braintree/js/view/payment/adapter',\n    'Magento_Ui/js/model/messageList',\n    'Magento_Checkout/js/model/full-screen-loader'\n], function ($, VaultComponent, Braintree, globalMessageList, fullScreenLoader) {\n    'use strict';\n\n    return VaultComponent.extend({\n        defaults: {\n            template: 'Magento_Vault/payment/form',\n            modules: {\n                hostedFields: '${ $.parentName }.braintree'\n            }\n        },\n\n        /**\n         * Get last 4 digits of card\n         * @returns {String}\n         */\n        getMaskedCard: function () {\n            return this.details.maskedCC;\n        },\n\n        /**\n         * Get expiration date\n         * @returns {String}\n         */\n        getExpirationDate: function () {\n            return this.details.expirationDate;\n        },\n\n        /**\n         * Get card type\n         * @returns {String}\n         */\n        getCardType: function () {\n            return this.details.type;\n        },\n\n        /**\n         * Place order\n         */\n        placeOrder: function () {\n            var self = this;\n\n            self.getPaymentMethodNonce();\n        },\n\n        /**\n         * Send request to get payment method nonce\n         */\n        getPaymentMethodNonce: function () {\n            var self = this;\n\n            fullScreenLoader.startLoader();\n            $.getJSON(self.nonceUrl, {\n                'public_hash': self.publicHash\n            })\n                .done(function (response) {\n                    fullScreenLoader.stopLoader();\n                    self.hostedFields(function (formComponent) {\n                        formComponent.paymentPayload.nonce = response.paymentMethodNonce;\n                        formComponent.additionalData['public_hash'] = self.publicHash;\n                        formComponent.code = self.code;\n                        formComponent.messageContainer = self.messageContainer;\n                        formComponent.placeOrder();\n                    });\n                })\n                .fail(function (response) {\n                    var error = JSON.parse(response.responseText);\n\n                    fullScreenLoader.stopLoader();\n                    globalMessageList.addErrorMessage({\n                        message: error.message\n                    });\n                });\n        }\n    });\n});\n"}
}});
