require.config({"config": {
        "jsbuild":{"Magento_Checkout/js/sidebar.js":"/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n\ndefine([\n    'jquery',\n    'Magento_Customer/js/model/authentication-popup',\n    'Magento_Customer/js/customer-data',\n    'Magento_Ui/js/modal/alert',\n    'Magento_Ui/js/modal/confirm',\n    'underscore',\n    'jquery-ui-modules/widget',\n    'mage/decorate',\n    'mage/collapsible',\n    'mage/cookies',\n    'jquery-ui-modules/effect-fade'\n], function ($, authenticationPopup, customerData, alert, confirm, _) {\n    'use strict';\n\n    $.widget('mage.sidebar', {\n        options: {\n            isRecursive: true,\n            minicart: {\n                maxItemsVisible: 3\n            }\n        },\n        scrollHeight: 0,\n        shoppingCartUrl: window.checkout.shoppingCartUrl,\n\n        /**\n         * Create sidebar.\n         * @private\n         */\n        _create: function () {\n            this._initContent();\n        },\n\n        /**\n         * Update sidebar block.\n         */\n        update: function () {\n            $(this.options.targetElement).trigger('contentUpdated');\n            this._calcHeight();\n            this._isOverflowed();\n        },\n\n        /**\n         * @private\n         */\n        _initContent: function () {\n            var self = this,\n                events = {};\n\n            this.element.decorate('list', this.options.isRecursive);\n\n            /**\n             * @param {jQuery.Event} event\n             */\n            events['click ' + this.options.button.close] = function (event) {\n                event.stopPropagation();\n                $(self.options.targetElement).dropdownDialog('close');\n            };\n            events['click ' + this.options.button.checkout] = $.proxy(function () {\n                var cart = customerData.get('cart'),\n                    customer = customerData.get('customer'),\n                    element = $(this.options.button.checkout);\n\n                if (!customer().firstname && cart().isGuestCheckoutAllowed === false) {\n                    // set URL for redirect on successful login/registration. It's postprocessed on backend.\n                    $.cookie('login_redirect', this.options.url.checkout);\n\n                    if (this.options.url.isRedirectRequired) {\n                        element.prop('disabled', true);\n                        location.href = this.options.url.loginUrl;\n                    } else {\n                        authenticationPopup.showModal();\n                    }\n\n                    return false;\n                }\n                element.prop('disabled', true);\n                location.href = this.options.url.checkout;\n            }, this);\n\n            /**\n             * @param {jQuery.Event} event\n             */\n            events['click ' + this.options.button.remove] =  function (event) {\n                event.stopPropagation();\n                confirm({\n                    content: self.options.confirmMessage,\n                    actions: {\n                        /** @inheritdoc */\n                        confirm: function () {\n                            self._removeItem($(event.currentTarget));\n                        },\n\n                        /** @inheritdoc */\n                        always: function (e) {\n                            e.stopImmediatePropagation();\n                        }\n                    }\n                });\n            };\n\n            /**\n             * @param {jQuery.Event} event\n             */\n            events['keyup ' + this.options.item.qty] = function (event) {\n                self._showItemButton($(event.target));\n            };\n\n            /**\n             * @param {jQuery.Event} event\n             */\n            events['change ' + this.options.item.qty] = function (event) {\n                self._showItemButton($(event.target));\n            };\n\n            /**\n             * @param {jQuery.Event} event\n             */\n            events['click ' + this.options.item.button] = function (event) {\n                event.stopPropagation();\n                self._updateItemQty($(event.currentTarget));\n            };\n\n            /**\n             * @param {jQuery.Event} event\n             */\n            events['focusout ' + this.options.item.qty] = function (event) {\n                self._validateQty($(event.currentTarget));\n            };\n\n            this._on(this.element, events);\n            this._calcHeight();\n            this._isOverflowed();\n        },\n\n        /**\n         * Add 'overflowed' class to minicart items wrapper element\n         *\n         * @private\n         */\n        _isOverflowed: function () {\n            var list = $(this.options.minicart.list),\n                cssOverflowClass = 'overflowed';\n\n            if (this.scrollHeight > list.innerHeight()) {\n                list.parent().addClass(cssOverflowClass);\n            } else {\n                list.parent().removeClass(cssOverflowClass);\n            }\n        },\n\n        /**\n         * @param {HTMLElement} elem\n         * @private\n         */\n        _showItemButton: function (elem) {\n            var itemId = elem.data('cart-item'),\n                itemQty = elem.data('item-qty');\n\n            if (this._isValidQty(itemQty, elem.val())) {\n                $('#update-cart-item-' + itemId).show('fade', 300);\n            } else if (elem.val() == 0) { //eslint-disable-line eqeqeq\n                this._hideItemButton(elem);\n            } else {\n                this._hideItemButton(elem);\n            }\n        },\n\n        /**\n         * @param {*} origin - origin qty. 'data-item-qty' attribute.\n         * @param {*} changed - new qty.\n         * @returns {Boolean}\n         * @private\n         */\n        _isValidQty: function (origin, changed) {\n            return origin != changed && //eslint-disable-line eqeqeq\n                changed.length > 0 &&\n                changed - 0 == changed && //eslint-disable-line eqeqeq\n                changed - 0 > 0;\n        },\n\n        /**\n         * @param {Object} elem\n         * @private\n         */\n        _validateQty: function (elem) {\n            var itemQty = elem.data('item-qty');\n\n            if (!this._isValidQty(itemQty, elem.val())) {\n                elem.val(itemQty);\n            }\n        },\n\n        /**\n         * @param {HTMLElement} elem\n         * @private\n         */\n        _hideItemButton: function (elem) {\n            var itemId = elem.data('cart-item');\n\n            $('#update-cart-item-' + itemId).hide('fade', 300);\n        },\n\n        /**\n         * @param {HTMLElement} elem\n         * @private\n         */\n        _updateItemQty: function (elem) {\n            var itemId = elem.data('cart-item');\n\n            this._ajax(this.options.url.update, {\n                'item_id': itemId,\n                'item_qty': $('#cart-item-' + itemId + '-qty').val()\n            }, elem, this._updateItemQtyAfter);\n        },\n\n        /**\n         * Update content after update qty\n         *\n         * @param {HTMLElement} elem\n         */\n        _updateItemQtyAfter: function (elem) {\n            var productData = this._getProductById(Number(elem.data('cart-item')));\n\n            if (!_.isUndefined(productData)) {\n                $(document).trigger('ajax:updateCartItemQty');\n\n                if (window.location.href === this.shoppingCartUrl) {\n                    window.location.reload(false);\n                }\n            }\n            this._hideItemButton(elem);\n        },\n\n        /**\n         * @param {HTMLElement} elem\n         * @private\n         */\n        _removeItem: function (elem) {\n            var itemId = elem.data('cart-item');\n\n            this._ajax(this.options.url.remove, {\n                'item_id': itemId\n            }, elem, this._removeItemAfter);\n        },\n\n        /**\n         * Update content after item remove\n         *\n         * @param {Object} elem\n         * @private\n         */\n        _removeItemAfter: function (elem) {\n            var productData = this._getProductById(Number(elem.data('cart-item')));\n\n            if (!_.isUndefined(productData)) {\n                $(document).trigger('ajax:removeFromCart', {\n                    productIds: [productData['product_id']]\n                });\n\n                if (window.location.href.indexOf(this.shoppingCartUrl) === 0) {\n                    window.location.reload();\n                }\n            }\n        },\n\n        /**\n         * Retrieves product data by Id.\n         *\n         * @param {Number} productId - product Id\n         * @returns {Object|undefined}\n         * @private\n         */\n        _getProductById: function (productId) {\n            return _.find(customerData.get('cart')().items, function (item) {\n                return productId === Number(item['item_id']);\n            });\n        },\n\n        /**\n         * @param {String} url - ajax url\n         * @param {Object} data - post data for ajax call\n         * @param {Object} elem - element that initiated the event\n         * @param {Function} callback - callback method to execute after AJAX success\n         */\n        _ajax: function (url, data, elem, callback) {\n            $.extend(data, {\n                'form_key': $.mage.cookies.get('form_key')\n            });\n\n            $.ajax({\n                url: url,\n                data: data,\n                type: 'post',\n                dataType: 'json',\n                context: this,\n\n                /** @inheritdoc */\n                beforeSend: function () {\n                    elem.attr('disabled', 'disabled');\n                },\n\n                /** @inheritdoc */\n                complete: function () {\n                    elem.attr('disabled', null);\n                }\n            })\n                .done(function (response) {\n                    var msg;\n\n                    if (response.success) {\n                        callback.call(this, elem, response);\n                    } else {\n                        msg = response['error_message'];\n\n                        if (msg) {\n                            alert({\n                                content: msg\n                            });\n                        }\n                    }\n                })\n                .fail(function (error) {\n                    console.log(JSON.stringify(error));\n                });\n        },\n\n        /**\n         * Calculate height of minicart list\n         *\n         * @private\n         */\n        _calcHeight: function () {\n            var self = this,\n                height = 0,\n                counter = this.options.minicart.maxItemsVisible,\n                target = $(this.options.minicart.list),\n                outerHeight;\n\n            self.scrollHeight = 0;\n            target.children().each(function () {\n\n                if ($(this).find('.options').length > 0) {\n                    $(this).collapsible();\n                }\n                outerHeight = $(this).outerHeight(true);\n\n                if (counter-- > 0) {\n                    height += outerHeight;\n                }\n                self.scrollHeight += outerHeight;\n            });\n\n            target.parent().height(height);\n        }\n    });\n\n    return $.mage.sidebar;\n});\n"}
}});