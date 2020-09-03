require.config({"config": {
        "jsbuild":{"Magento_Checkout/js/view/shipping-address/address-renderer/default.js":"/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n\ndefine([\n    'jquery',\n    'ko',\n    'uiComponent',\n    'underscore',\n    'Magento_Checkout/js/action/select-shipping-address',\n    'Magento_Checkout/js/model/quote',\n    'Magento_Checkout/js/model/shipping-address/form-popup-state',\n    'Magento_Checkout/js/checkout-data',\n    'Magento_Customer/js/customer-data'\n], function ($, ko, Component, _, selectShippingAddressAction, quote, formPopUpState, checkoutData, customerData) {\n    'use strict';\n\n    var countryData = customerData.get('directory-data');\n\n    return Component.extend({\n        defaults: {\n            template: 'Magento_Checkout/shipping-address/address-renderer/default'\n        },\n\n        /** @inheritdoc */\n        initObservable: function () {\n            this._super();\n            this.isSelected = ko.computed(function () {\n                var isSelected = false,\n                    shippingAddress = quote.shippingAddress();\n\n                if (shippingAddress) {\n                    isSelected = shippingAddress.getKey() == this.address().getKey(); //eslint-disable-line eqeqeq\n                }\n\n                return isSelected;\n            }, this);\n\n            return this;\n        },\n\n        /**\n         * @param {String} countryId\n         * @return {String}\n         */\n        getCountryName: function (countryId) {\n            return countryData()[countryId] != undefined ? countryData()[countryId].name : ''; //eslint-disable-line\n        },\n\n        /**\n         * Get customer attribute label\n         *\n         * @param {*} attribute\n         * @returns {*}\n         */\n        getCustomAttributeLabel: function (attribute) {\n            var resultAttribute;\n\n            if (typeof attribute === 'string') {\n                return attribute;\n            }\n\n            if (attribute.label) {\n                return attribute.label;\n            }\n\n            if (typeof this.source.get('customAttributes') !== 'undefined') {\n                resultAttribute = _.findWhere(this.source.get('customAttributes')[attribute['attribute_code']], {\n                    value: attribute.value\n                });\n            }\n\n            return resultAttribute && resultAttribute.label || attribute.value;\n        },\n\n        /** Set selected customer shipping address  */\n        selectAddress: function () {\n            selectShippingAddressAction(this.address());\n            checkoutData.setSelectedShippingAddress(this.address().getKey());\n        },\n\n        /**\n         * Edit address.\n         */\n        editAddress: function () {\n            formPopUpState.isVisible(true);\n            this.showPopup();\n\n        },\n\n        /**\n         * Show popup.\n         */\n        showPopup: function () {\n            $('[data-open-modal=\"opc-new-shipping-address\"]').trigger('click');\n        }\n    });\n});\n"}
}});