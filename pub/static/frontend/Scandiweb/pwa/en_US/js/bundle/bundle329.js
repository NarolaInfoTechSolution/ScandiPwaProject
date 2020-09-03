require.config({"config": {
        "jsbuild":{"Magento_Checkout/js/model/quote.js":"/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n/**\n * @api\n */\ndefine([\n    'ko',\n    'underscore',\n    'domReady!'\n], function (ko, _) {\n    'use strict';\n\n    /**\n     * Get totals data from the extension attributes.\n     * @param {*} data\n     * @returns {*}\n     */\n    var proceedTotalsData = function (data) {\n            if (_.isObject(data) && _.isObject(data['extension_attributes'])) {\n                _.each(data['extension_attributes'], function (element, index) {\n                    data[index] = element;\n                });\n            }\n\n            return data;\n        },\n        billingAddress = ko.observable(null),\n        shippingAddress = ko.observable(null),\n        shippingMethod = ko.observable(null),\n        paymentMethod = ko.observable(null),\n        quoteData = window.checkoutConfig.quoteData,\n        basePriceFormat = window.checkoutConfig.basePriceFormat,\n        priceFormat = window.checkoutConfig.priceFormat,\n        storeCode = window.checkoutConfig.storeCode,\n        totalsData = proceedTotalsData(window.checkoutConfig.totalsData),\n        totals = ko.observable(totalsData),\n        collectedTotals = ko.observable({});\n\n    return {\n        totals: totals,\n        shippingAddress: shippingAddress,\n        shippingMethod: shippingMethod,\n        billingAddress: billingAddress,\n        paymentMethod: paymentMethod,\n        guestEmail: null,\n\n        /**\n         * @return {*}\n         */\n        getQuoteId: function () {\n            return quoteData['entity_id'];\n        },\n\n        /**\n         * @return {Boolean}\n         */\n        isVirtual: function () {\n            return !!Number(quoteData['is_virtual']);\n        },\n\n        /**\n         * @return {*}\n         */\n        getPriceFormat: function () {\n            return priceFormat;\n        },\n\n        /**\n         * @return {*}\n         */\n        getBasePriceFormat: function () {\n            return basePriceFormat;\n        },\n\n        /**\n         * @return {*}\n         */\n        getItems: function () {\n            return window.checkoutConfig.quoteItemData;\n        },\n\n        /**\n         *\n         * @return {*}\n         */\n        getTotals: function () {\n            return totals;\n        },\n\n        /**\n         * @param {Object} data\n         */\n        setTotals: function (data) {\n            data = proceedTotalsData(data);\n            totals(data);\n            this.setCollectedTotals('subtotal_with_discount', parseFloat(data['subtotal_with_discount']));\n        },\n\n        /**\n         * @param {*} paymentMethodCode\n         */\n        setPaymentMethod: function (paymentMethodCode) {\n            paymentMethod(paymentMethodCode);\n        },\n\n        /**\n         * @return {*}\n         */\n        getPaymentMethod: function () {\n            return paymentMethod;\n        },\n\n        /**\n         * @return {*}\n         */\n        getStoreCode: function () {\n            return storeCode;\n        },\n\n        /**\n         * @param {String} code\n         * @param {*} value\n         */\n        setCollectedTotals: function (code, value) {\n            var colTotals = collectedTotals();\n\n            colTotals[code] = value;\n            collectedTotals(colTotals);\n        },\n\n        /**\n         * @return {Number}\n         */\n        getCalculatedTotal: function () {\n            var total = 0.; //eslint-disable-line no-floating-decimal\n\n            _.each(collectedTotals(), function (value) {\n                total += value;\n            });\n\n            return total;\n        }\n    };\n});\n"}
}});