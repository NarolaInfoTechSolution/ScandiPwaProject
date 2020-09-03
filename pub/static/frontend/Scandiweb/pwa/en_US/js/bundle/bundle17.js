require.config({"config": {
        "jsbuild":{"Magento_Braintree/js/view/payment/3d-secure.js":"/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n/*browser:true*/\n/*global define*/\n\ndefine([\n    'jquery',\n    'braintree3DSecure',\n    'Magento_Braintree/js/view/payment/adapter',\n    'Magento_Checkout/js/model/quote',\n    'mage/translate',\n    'Magento_Ui/js/modal/modal',\n    'Magento_Checkout/js/model/full-screen-loader'\n], function (\n    $,\n    braintree3DSecure,\n    braintreeAdapter,\n    quote,\n    $t,\n    Modal,\n    fullScreenLoader\n) {\n    'use strict';\n\n    return {\n        config: null,\n        modal: null,\n        threeDSecureInstance: null,\n        state: null,\n\n        /**\n         * Initializes component\n         */\n        initialize: function () {\n            var self = this,\n                promise = $.Deferred();\n\n            self.state = $.Deferred();\n            braintreeAdapter.getApiClient()\n                .then(function (clientInstance) {\n                    return braintree3DSecure.create({\n                        version: 2, // Will use 3DS 2 whenever possible\n                        client: clientInstance\n                    });\n                })\n                .then(function (threeDSecureInstance) {\n                    self.threeDSecureInstance = threeDSecureInstance;\n                    promise.resolve(self.threeDSecureInstance);\n                })\n                .catch(function (err) {\n                    fullScreenLoader.stopLoader();\n                    promise.reject(err);\n                });\n\n            return promise.promise();\n        },\n\n        /**\n         * Sets 3D Secure config\n         *\n         * @param {Object} config\n         */\n        setConfig: function (config) {\n            this.config = config;\n            this.config.thresholdAmount = parseFloat(config.thresholdAmount);\n        },\n\n        /**\n         * Gets code\n         *\n         * @returns {String}\n         */\n        getCode: function () {\n            return 'three_d_secure';\n        },\n\n        /**\n         * Validates 3D Secure\n         *\n         * @param {Object} context\n         * @returns {Object}\n         */\n        validate: function (context) {\n            var self = this,\n                totalAmount = quote.totals()['base_grand_total'],\n                billingAddress = quote.billingAddress(),\n                shippingAddress = quote.shippingAddress(),\n                options = {\n                    amount: totalAmount,\n                    nonce: context.paymentPayload.nonce,\n                    billingAddress: {\n                        givenName: billingAddress.firstname,\n                        surname: billingAddress.lastname,\n                        phoneNumber: billingAddress.telephone,\n                        streetAddress: billingAddress.street[0],\n                        extendedAddress: billingAddress.street[1],\n                        locality: billingAddress.city,\n                        region: billingAddress.regionCode,\n                        postalCode: billingAddress.postcode,\n                        countryCodeAlpha2: billingAddress.countryId\n                    },\n\n                    /**\n                     * Will be called after receiving ThreeDSecure response, before completing the flow.\n                     *\n                     * @param {Object} data - ThreeDSecure data to consume before continuing\n                     * @param {Function} next - callback to continue flow\n                     */\n                    onLookupComplete: function (data, next) {\n                        next();\n                    }\n                };\n\n            if (context.paymentPayload.details) {\n                options.bin = context.paymentPayload.details.bin;\n            }\n\n            if (shippingAddress && this.isValidShippingAddress(shippingAddress)) {\n                options.additionalInformation = {\n                    shippingGivenName: shippingAddress.firstname,\n                    shippingSurname: shippingAddress.lastname,\n                    shippingPhone: shippingAddress.telephone,\n                    shippingAddress: {\n                        streetAddress: shippingAddress.street[0],\n                        extendedAddress: shippingAddress.street[1],\n                        locality: shippingAddress.city,\n                        region: shippingAddress.regionCode,\n                        postalCode: shippingAddress.postcode,\n                        countryCodeAlpha2: shippingAddress.countryId\n                    }\n                };\n            }\n\n            if (!this.isAmountAvailable(totalAmount) || !this.isCountryAvailable(billingAddress.countryId)) {\n                self.state = $.Deferred();\n                self.state.resolve();\n\n                return self.state.promise();\n            }\n\n            fullScreenLoader.startLoader();\n            this.initialize()\n                .then(function () {\n                    self.threeDSecureInstance.verifyCard(options, function (err, payload) {\n                        if (err) {\n                            fullScreenLoader.stopLoader();\n                            self.state.reject(err.message);\n\n                            return;\n                        }\n\n                        // `liabilityShifted` indicates that 3DS worked and authentication succeeded\n                        // if `liabilityShifted` and `liabilityShiftPossible` are false - card is ineligible for 3DS\n                        if (payload.liabilityShifted || !payload.liabilityShifted && !payload.liabilityShiftPossible) {\n                            context.paymentPayload.nonce = payload.nonce;\n                            self.state.resolve();\n                        } else {\n                            fullScreenLoader.stopLoader();\n                            self.state.reject($t('Please try again with another form of payment.'));\n                        }\n                    });\n                })\n                .fail(function () {\n                    fullScreenLoader.stopLoader();\n                    self.state.reject($t('Please try again with another form of payment.'));\n                });\n\n            return self.state.promise();\n        },\n\n        /**\n         * Checks minimal amount for 3D Secure activation\n         *\n         * @param {Number} amount\n         * @returns {Boolean}\n         * @private\n         */\n        isAmountAvailable: function (amount) {\n            amount = parseFloat(amount);\n\n            return amount >= this.config.thresholdAmount;\n        },\n\n        /**\n         * Checks if current country is available for 3D Secure\n         *\n         * @param {String} countryId\n         * @returns {Boolean}\n         * @private\n         */\n        isCountryAvailable: function (countryId) {\n            var key,\n                specificCountries = this.config.specificCountries;\n\n            // all countries are available\n            if (!specificCountries.length) {\n                return true;\n            }\n\n            for (key in specificCountries) {\n                if (countryId === specificCountries[key]) {\n                    return true;\n                }\n            }\n\n            return false;\n        },\n\n        /**\n         * Validate shipping address\n         *\n         * @param {Object} shippingAddress\n         * @return {Boolean}\n         */\n        isValidShippingAddress: function (shippingAddress) {\n            var isValid = false;\n\n            // check that required fields are not empty\n            if (shippingAddress.firstname && shippingAddress.lastname && shippingAddress.telephone &&\n                shippingAddress.street && shippingAddress.city && shippingAddress.regionCode &&\n                shippingAddress.postcode && shippingAddress.countryId) {\n                isValid = true;\n            }\n\n            return isValid;\n        }\n    };\n});\n"}
}});