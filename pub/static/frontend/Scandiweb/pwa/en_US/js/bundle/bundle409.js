require.config({"config": {
        "jsbuild":{"Amazon_Payment/js/view/checkout-widget-address.js":"/*global define*/\n\ndefine(\n    [\n        'jquery',\n        'uiComponent',\n        'ko',\n        'Magento_Customer/js/model/customer',\n        'Magento_Checkout/js/model/quote',\n        'Magento_Checkout/js/action/select-shipping-address',\n        'Magento_Checkout/js/model/shipping-rate-processor/new-address',\n        'Magento_Checkout/js/action/set-shipping-information',\n        'Amazon_Payment/js/model/storage',\n        'amazonCore',\n        'Magento_Checkout/js/model/shipping-service',\n        'Magento_Checkout/js/model/address-converter',\n        'mage/storage',\n        'Magento_Checkout/js/model/full-screen-loader',\n        'Magento_Checkout/js/model/error-processor',\n        'Magento_Checkout/js/model/url-builder',\n        'Magento_Checkout/js/checkout-data',\n        'Magento_Checkout/js/model/checkout-data-resolver',\n        'uiRegistry',\n        'Amazon_Payment/js/messages'\n    ],\n    function (\n        $,\n        Component,\n        ko,\n        customer,\n        quote,\n        selectShippingAddress,\n        shippingProcessor,\n        setShippingInformationAction,\n        amazonStorage,\n        amazonCore,\n        shippingService,\n        addressConverter,\n        storage,\n        fullScreenLoader,\n        errorProcessor,\n        urlBuilder,\n        checkoutData,\n        checkoutDataResolver,\n        registry,\n        amazonMessages\n    ) {\n        'use strict';\n\n        var self;\n\n        return Component.extend({\n            defaults: {\n                template: 'Amazon_Payment/checkout-widget-address'\n            },\n            options: {\n                sellerId: registry.get('amazonPayment').merchantId,\n                addressWidgetDOMId: 'addressBookWidgetDiv',\n                widgetScope: registry.get('amazonPayment').loginScope\n            },\n            isCustomerLoggedIn: customer.isLoggedIn,\n            amazonCustomerEmail: amazonStorage.amazonCustomerEmail,\n            isAmazonAccountLoggedIn: amazonStorage.isAmazonAccountLoggedIn,\n            isAmazonEnabled: ko.observable(registry.get('amazonPayment').isPwaEnabled),\n            rates: shippingService.getShippingRates(),\n\n            /**\n             * Init\n             */\n            initialize: function () {\n                self = this;\n                this._super();\n                // Update checkoutUrl for step-navigator if orderReferenceId is set (e.g. InvaldPaymentMethod)\n                if (amazonStorage.orderReferenceId()) {\n                    window.checkoutConfig.checkoutUrl += '?orderReferenceId=' + amazonStorage.orderReferenceId()\n                }\n            },\n\n            /**\n             * Call when component template is rendered\n             */\n            initAddressWidget: function () {\n                if(amazonStorage.amazonDefined()) {\n                    self.renderAddressWidget();\n                } else {\n                    var subscription = amazonStorage.amazonDefined.subscribe(function (defined) { //eslint-disable-line vars-on-top\n                        if (defined) {\n                            self.renderAddressWidget();\n                            subscription.dispose();\n                        }\n                    });\n                }\n            },\n\n            /**\n             * render Amazon address Widget\n             */\n            renderAddressWidget: function () {\n                new OffAmazonPayments.Widgets.AddressBook({ // eslint-disable-line no-undef\n                    sellerId: self.options.sellerId,\n                    scope: self.options.widgetScope,\n\n                    /**\n                     * Order reference creation callback\n                     */\n                    onOrderReferenceCreate: function (orderReference) {\n                        var orderid = amazonStorage.orderReferenceId() || orderReference.getAmazonOrderReferenceId();\n                        amazonStorage.setOrderReference(orderid);\n                    },\n\n                    /**\n                     * Address select callback\n                     */\n                    onAddressSelect: function () { // orderReference\n                        self.getShippingAddressFromAmazon();\n                    },\n                    displayMode: self.isShippingAddressReadOnly() ? 'Read' : '',\n                    design: {\n                        designMode: 'responsive'\n                    },\n\n                    /**\n                     * Error callback\n                     */\n                    onError: amazonCore.handleWidgetError\n                }).bind(self.options.addressWidgetDOMId);\n                amazonMessages.displayMessages();\n            },\n\n            /**\n             * Get shipping address from Amazon API\n             */\n            getShippingAddressFromAmazon: function () {\n                var serviceUrl, payload;\n\n                amazonStorage.isShippingMethodsLoading(true);\n                shippingService.isLoading(true);\n                serviceUrl = urlBuilder.createUrl('/amazon-shipping-address/:amazonOrderReference', {\n                    amazonOrderReference: amazonStorage.getOrderReference()\n                }),\n                    payload = {\n                        addressConsentToken: amazonStorage.getAddressConsentToken()\n                    };\n\n                storage.put(\n                    serviceUrl,\n                    JSON.stringify(payload)\n                ).done(\n                    function (data) {\n                        var amazonAddress = data.shift(),\n                            addressData = addressConverter.formAddressDataToQuoteAddress(amazonAddress),\n                            i;\n\n                        //if telephone is blank set it to 00000000 so it passes the required validation\n                        addressData.telephone = !addressData.telephone ? '0000000000' : addressData.telephone;\n\n                        //fill in blank street fields\n                        if ($.isArray(addressData.street)) {\n                            for (i = addressData.street.length; i <= 2; i++) {\n                                addressData.street[i] = '';\n                            }\n                        }\n                        checkoutData.setShippingAddressFromData(\n                            addressConverter.quoteAddressToFormAddressData(addressData)\n                        );\n                        checkoutDataResolver.resolveEstimationAddress();\n                    }\n                ).fail(\n                    function (response) {\n                        errorProcessor.process(response);\n                        //remove shipping loader and set shipping rates to 0 on a fail\n                        shippingService.setShippingRates([]);\n                        amazonStorage.isShippingMethodsLoading(false);\n                        if (self.isShippingAddressReadOnly()) {\n                            shippingService.isLoading(false);\n                            $('.checkout-shipping-method').hide();\n                        }\n                    }\n                );\n            },\n\n            /**\n             * Get Amazon Order Reference ID\n             */\n            getAmazonOrderReference: function () {\n                return amazonStorage.getOrderReference();\n            },\n\n            /**\n             * Get Amazon Address Consent Token\n             */\n            getAddressConsentToken: function () {\n                return amazonStorage.getAddressConsentToken();\n            },\n\n            /**\n             * Is shipping widget set to read-only (orderReferenceId already set?)\n             */\n            isShippingAddressReadOnly: function() {\n                return (amazonStorage.orderReferenceId());\n            },\n\n            /**\n             * Continue to payment (e.g. if shipping address is read-only)\n             */\n            continuePayment: function() {\n                window.location = window.checkoutConfig.checkoutUrl + '#payment';\n            }\n        });\n    }\n);\n"}
}});