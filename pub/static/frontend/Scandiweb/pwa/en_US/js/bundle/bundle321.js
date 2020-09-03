require.config({"config": {
        "jsbuild":{"Magento_Checkout/js/model/resource-url-manager.js":"/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n\n/**\n * @api\n */\ndefine([\n    'Magento_Customer/js/model/customer',\n    'Magento_Checkout/js/model/url-builder',\n    'mageUtils'\n], function (customer, urlBuilder, utils) {\n        'use strict';\n\n        return {\n            /**\n             * @param {Object} quote\n             * @return {*}\n             */\n            getUrlForTotalsEstimationForNewAddress: function (quote) {\n                var params = this.getCheckoutMethod() == 'guest' ? //eslint-disable-line eqeqeq\n                        {\n                            cartId: quote.getQuoteId()\n                        } : {},\n                    urls = {\n                        'guest': '/guest-carts/:cartId/totals-information',\n                        'customer': '/carts/mine/totals-information'\n                    };\n\n                return this.getUrl(urls, params);\n            },\n\n            /**\n             * @param {Object} quote\n             * @return {*}\n             */\n            getUrlForEstimationShippingMethodsForNewAddress: function (quote) {\n                var params = this.getCheckoutMethod() == 'guest' ? //eslint-disable-line eqeqeq\n                        {\n                            quoteId: quote.getQuoteId()\n                        } : {},\n                    urls = {\n                        'guest': '/guest-carts/:quoteId/estimate-shipping-methods',\n                        'customer': '/carts/mine/estimate-shipping-methods'\n                    };\n\n                return this.getUrl(urls, params);\n            },\n\n            /**\n             * @param {Object} quote\n             * @return {*}\n             */\n            getUrlForEstimationShippingMethodsByAddressId: function (quote) {\n                var params = this.getCheckoutMethod() == 'guest' ? //eslint-disable-line eqeqeq\n                        {\n                            quoteId: quote.getQuoteId()\n                        } : {},\n                    urls = {\n                        'default': '/carts/mine/estimate-shipping-methods-by-address-id'\n                    };\n\n                return this.getUrl(urls, params);\n            },\n\n            /**\n             * @param {String} couponCode\n             * @param {String} quoteId\n             * @return {*}\n             */\n            getApplyCouponUrl: function (couponCode, quoteId) {\n                var params = this.getCheckoutMethod() == 'guest' ? //eslint-disable-line eqeqeq\n                        {\n                            quoteId: quoteId\n                        } : {},\n                    urls = {\n                        'guest': '/guest-carts/' + quoteId + '/coupons/' + encodeURIComponent(couponCode),\n                        'customer': '/carts/mine/coupons/' + encodeURIComponent(couponCode)\n                    };\n\n                return this.getUrl(urls, params);\n            },\n\n            /**\n             * @param {String} quoteId\n             * @return {*}\n             */\n            getCancelCouponUrl: function (quoteId) {\n                var params = this.getCheckoutMethod() == 'guest' ? //eslint-disable-line eqeqeq\n                        {\n                            quoteId: quoteId\n                        } : {},\n                    urls = {\n                        'guest': '/guest-carts/' + quoteId + '/coupons/',\n                        'customer': '/carts/mine/coupons/'\n                    };\n\n                return this.getUrl(urls, params);\n            },\n\n            /**\n             * @param {Object} quote\n             * @return {*}\n             */\n            getUrlForCartTotals: function (quote) {\n                var params = this.getCheckoutMethod() == 'guest' ? //eslint-disable-line eqeqeq\n                        {\n                            quoteId: quote.getQuoteId()\n                        } : {},\n                    urls = {\n                        'guest': '/guest-carts/:quoteId/totals',\n                        'customer': '/carts/mine/totals'\n                    };\n\n                return this.getUrl(urls, params);\n            },\n\n            /**\n             * @param {Object} quote\n             * @return {*}\n             */\n            getUrlForSetShippingInformation: function (quote) {\n                var params = this.getCheckoutMethod() == 'guest' ? //eslint-disable-line eqeqeq\n                        {\n                            cartId: quote.getQuoteId()\n                        } : {},\n                    urls = {\n                        'guest': '/guest-carts/:cartId/shipping-information',\n                        'customer': '/carts/mine/shipping-information'\n                    };\n\n                return this.getUrl(urls, params);\n            },\n\n            /**\n             * Get url for service.\n             *\n             * @param {*} urls\n             * @param {*} urlParams\n             * @return {String|*}\n             */\n            getUrl: function (urls, urlParams) {\n                var url;\n\n                if (utils.isEmpty(urls)) {\n                    return 'Provided service call does not exist.';\n                }\n\n                if (!utils.isEmpty(urls['default'])) {\n                    url = urls['default'];\n                } else {\n                    url = urls[this.getCheckoutMethod()];\n                }\n\n                return urlBuilder.createUrl(url, urlParams);\n            },\n\n            /**\n             * @return {String}\n             */\n            getCheckoutMethod: function () {\n                return customer.isLoggedIn() ? 'customer' : 'guest';\n            }\n        };\n    }\n);\n"}
}});
