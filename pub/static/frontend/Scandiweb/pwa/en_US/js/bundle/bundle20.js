require.config({"config": {
        "jsbuild":{"Magento_Braintree/js/view/payment/method-renderer/paypal.js":"/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n/*browser:true*/\n/*global define*/\ndefine([\n    'jquery',\n    'underscore',\n    'Magento_Checkout/js/view/payment/default',\n    'Magento_Braintree/js/view/payment/adapter',\n    'braintreePayPal',\n    'braintreePayPalCheckout',\n    'Magento_Checkout/js/model/quote',\n    'Magento_Checkout/js/model/full-screen-loader',\n    'Magento_Checkout/js/model/payment/additional-validators',\n    'Magento_Vault/js/view/payment/vault-enabler',\n    'Magento_Checkout/js/action/create-billing-address',\n    'Magento_Braintree/js/view/payment/kount',\n    'mage/translate',\n    'Magento_Ui/js/model/messageList'\n], function (\n    $,\n    _,\n    Component,\n    BraintreeAdapter,\n    BraintreePayPal,\n    BraintreePayPalCheckout,\n    quote,\n    fullScreenLoader,\n    additionalValidators,\n    VaultEnabler,\n    createBillingAddress,\n    kount,\n    $t,\n    globalMessageList\n) {\n    'use strict';\n\n    return Component.extend({\n        defaults: {\n            template: 'Magento_Braintree/payment/paypal',\n            code: 'braintree_paypal',\n            active: false,\n            grandTotalAmount: null,\n            isReviewRequired: false,\n            paypalCheckoutInstance: null,\n            customerEmail: null,\n            vaultEnabler: null,\n            paymentPayload: {\n                nonce: null\n            },\n            paypalButtonSelector: '[data-container=\"paypal-button\"]',\n\n            /**\n             * Additional payment data\n             *\n             * {Object}\n             */\n            additionalData: {},\n\n            imports: {\n                onActiveChange: 'active'\n            }\n        },\n\n        /**\n         * Initialize view.\n         *\n         * @return {exports}\n         */\n        initialize: function () {\n            var self = this;\n\n            self._super();\n\n            BraintreeAdapter.getApiClient().then(function (clientInstance) {\n                return BraintreePayPal.create({\n                    client: clientInstance\n                });\n            }).then(function (paypalCheckoutInstance) {\n                self.paypalCheckoutInstance = paypalCheckoutInstance;\n\n                return self.paypalCheckoutInstance;\n            });\n\n            kount.getDeviceData()\n                .then(function (deviceData) {\n                    self.additionalData['device_data'] = deviceData;\n                });\n\n            // for each component initialization need update property\n            this.isReviewRequired(false);\n\n            return self;\n        },\n\n        /**\n         * Set list of observable attributes\n         * @returns {exports.initObservable}\n         */\n        initObservable: function () {\n            var self = this;\n\n            this._super()\n                .observe(['active', 'isReviewRequired', 'customerEmail']);\n\n            this.vaultEnabler = new VaultEnabler();\n            this.vaultEnabler.setPaymentCode(this.getVaultCode());\n            this.vaultEnabler.isActivePaymentTokenEnabler.subscribe(function () {\n                self.onVaultPaymentTokenEnablerChange();\n            });\n\n            this.grandTotalAmount = quote.totals()['base_grand_total'];\n\n            quote.totals.subscribe(function () {\n                if (self.grandTotalAmount !== quote.totals()['base_grand_total']) {\n                    self.grandTotalAmount = quote.totals()['base_grand_total'];\n                }\n            });\n\n            quote.shippingAddress.subscribe(function () {\n                if (self.isActive()) {\n                    self.reInitPayPal();\n                }\n            });\n\n            return this;\n        },\n\n        /**\n         * Get payment name\n         *\n         * @returns {String}\n         */\n        getCode: function () {\n            return this.code;\n        },\n\n        /**\n         * Get payment title\n         *\n         * @returns {String}\n         */\n        getTitle: function () {\n            return window.checkoutConfig.payment[this.getCode()].title;\n        },\n\n        /**\n         * Check if payment is active\n         *\n         * @returns {Boolean}\n         */\n        isActive: function () {\n            var active = this.getCode() === this.isChecked();\n\n            this.active(active);\n\n            return active;\n        },\n\n        /**\n         * Triggers when payment method change\n         * @param {Boolean} isActive\n         */\n        onActiveChange: function (isActive) {\n            if (!isActive) {\n                return;\n            }\n\n            // need always re-init Braintree with PayPal configuration\n            this.reInitPayPal();\n        },\n\n        /**\n         * Sets payment payload\n         *\n         * @param {Object} paymentPayload\n         * @private\n         */\n        setPaymentPayload: function (paymentPayload) {\n            this.paymentPayload = paymentPayload;\n        },\n\n        /**\n         * Update quote billing address\n         * @param {Object}customer\n         * @param {Object}address\n         */\n        setBillingAddress: function (customer, address) {\n            var billingAddress = {\n                street: [address.line1],\n                city: address.city,\n                postcode: address.postalCode,\n                countryId: address.countryCode,\n                email: customer.email,\n                firstname: customer.firstName,\n                lastname: customer.lastName,\n                telephone: customer.phone,\n                regionCode: address.state\n            };\n\n            billingAddress = createBillingAddress(billingAddress);\n            quote.billingAddress(billingAddress);\n        },\n\n        /**\n         * Prepare data to place order\n         * @param {Object} payload\n         */\n        beforePlaceOrder: function (payload) {\n            this.setPaymentPayload(payload);\n\n            if (this.isRequiredBillingAddress() || quote.billingAddress() === null)  {\n                if (typeof payload.details.billingAddress !== 'undefined') {\n                    this.setBillingAddress(payload.details, payload.details.billingAddress);\n                } else {\n                    this.setBillingAddress(payload.details, payload.details.shippingAddress);\n                }\n            }\n\n            if (this.isSkipOrderReview()) {\n                this.placeOrder();\n            } else {\n                this.customerEmail(payload.details.email);\n                this.isReviewRequired(true);\n            }\n        },\n\n        /**\n         * Re-init PayPal Auth Flow\n         */\n        reInitPayPal: function () {\n            var self = this;\n\n            $(self.paypalButtonSelector).html('');\n\n            return BraintreePayPalCheckout.Button.render({\n                env: this.getEnvironment(),\n                style: {\n                    color: 'blue',\n                    shape: 'rect',\n                    size: 'medium',\n                    label: 'pay',\n                    tagline: false\n                },\n\n                /**\n                 * Creates a PayPal payment\n                 */\n                payment: function () {\n                    return self.paypalCheckoutInstance.createPayment(\n                        self.getPayPalConfig()\n                    );\n                },\n\n                /**\n                 * Tokenizes the authorize data\n                 */\n                onAuthorize: function (data) {\n                    return self.paypalCheckoutInstance.tokenizePayment(data)\n                        .then(function (payload) {\n                            self.beforePlaceOrder(payload);\n                        });\n                },\n\n                /**\n                 * Triggers on error\n                 */\n                onError: function () {\n                    self.showError($t('Payment ' + self.getTitle() + ' can\\'t be initialized'));\n                    self.reInitPayPal();\n                }\n            }, self.paypalButtonSelector);\n        },\n\n        /**\n         * Get locale\n         * @returns {String}\n         */\n        getLocale: function () {\n            return window.checkoutConfig.payment[this.getCode()].locale;\n        },\n\n        /**\n         * Is shipping address can be editable on PayPal side\n         * @returns {Boolean}\n         */\n        isAllowOverrideShippingAddress: function () {\n            return window.checkoutConfig.payment[this.getCode()].isAllowShippingAddressOverride;\n        },\n\n        /**\n         * Is billing address required from PayPal side\n         * @returns {Boolean}\n         */\n        isRequiredBillingAddress: function () {\n            return window.checkoutConfig.payment[this.getCode()].isRequiredBillingAddress;\n        },\n\n        /**\n         * Get configuration for PayPal\n         * @returns {Object}\n         */\n        getPayPalConfig: function () {\n            var totals = quote.totals(),\n                config,\n                isActiveVaultEnabler = this.isActiveVault();\n\n            config = {\n                flow: !isActiveVaultEnabler ? 'checkout' : 'vault',\n                amount: this.grandTotalAmount,\n                currency: totals['base_currency_code'],\n                locale: this.getLocale(),\n                enableShippingAddress: true,\n                shippingAddressEditable: this.isAllowOverrideShippingAddress()\n            };\n\n            config.shippingAddressOverride = this.getShippingAddress();\n\n            if (this.getMerchantName()) {\n                config.displayName = this.getMerchantName();\n            }\n\n            return config;\n        },\n\n        /**\n         * Get shipping address\n         * @returns {Object}\n         */\n        getShippingAddress: function () {\n            var address = quote.shippingAddress();\n\n            if (_.isNull(address.postcode) || _.isUndefined(address.postcode)) {\n                return {};\n            }\n\n            return {\n                line1: _.isUndefined(address.street) || _.isUndefined(address.street[0]) ? '' : address.street[0],\n                city: address.city,\n                state: address.regionCode,\n                postalCode: address.postcode,\n                countryCode: address.countryId,\n                phone: address.telephone,\n                recipientName: address.firstname + ' ' + address.lastname\n            };\n        },\n\n        /**\n         * Get merchant name\n         * @returns {String}\n         */\n        getMerchantName: function () {\n            return window.checkoutConfig.payment[this.getCode()].merchantName;\n        },\n\n        /**\n         * Get data\n         * @returns {Object}\n         */\n        getData: function () {\n            var data = {\n                'method': this.getCode(),\n                'additional_data': {\n                    'payment_method_nonce': this.paymentPayload.nonce\n                }\n            };\n\n            data['additional_data'] = _.extend(data['additional_data'], this.additionalData);\n\n            this.vaultEnabler.visitAdditionalData(data);\n\n            return data;\n        },\n\n        /**\n         * Returns payment acceptance mark image path\n         * @returns {String}\n         */\n        getPaymentAcceptanceMarkSrc: function () {\n\n            return window.checkoutConfig.payment[this.getCode()].paymentAcceptanceMarkSrc;\n        },\n\n        /**\n         * @returns {String}\n         */\n        getVaultCode: function () {\n            return window.checkoutConfig.payment[this.getCode()].vaultCode;\n        },\n\n        /**\n         * @returns {String}\n         */\n        getEnvironment: function () {\n            return window.checkoutConfig.payment[BraintreeAdapter.getCode()].environment;\n        },\n\n        /**\n         * Check if need to skip order review\n         * @returns {Boolean}\n         */\n        isSkipOrderReview: function () {\n            return window.checkoutConfig.payment[this.getCode()].skipOrderReview;\n        },\n\n        /**\n         * Checks if vault is active\n         * @returns {Boolean}\n         */\n        isActiveVault: function () {\n            return this.vaultEnabler.isVaultEnabled() && this.vaultEnabler.isActivePaymentTokenEnabler();\n        },\n\n        /**\n         * Re-init PayPal Auth flow to use Vault\n         */\n        onVaultPaymentTokenEnablerChange: function () {\n            this.reInitPayPal();\n        },\n\n        /**\n         * Show error message\n         *\n         * @param {String} errorMessage\n         * @private\n         */\n        showError: function (errorMessage) {\n            globalMessageList.addErrorMessage({\n                message: errorMessage\n            });\n        }\n    });\n});\n"}
}});
