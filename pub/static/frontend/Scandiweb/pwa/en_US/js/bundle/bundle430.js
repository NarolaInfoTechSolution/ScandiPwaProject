require.config({"config": {
        "jsbuild":{"Magento_Paypal/js/paypal-checkout.js":"/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n\ndefine([\n    'jquery',\n    'Magento_Ui/js/modal/confirm',\n    'Magento_Customer/js/customer-data',\n    'jquery-ui-modules/widget',\n    'mage/mage'\n], function ($, confirm, customerData) {\n    'use strict';\n\n    $.widget('mage.paypalCheckout', {\n        options: {\n            originalForm:\n                'form:not(#product_addtocart_form_from_popup):has(input[name=\"product\"][value=%1])',\n            productId: 'input[type=\"hidden\"][name=\"product\"]',\n            ppCheckoutSelector: '[data-role=pp-checkout-url]',\n            ppCheckoutInput: '<input type=\"hidden\" data-role=\"pp-checkout-url\" name=\"return_url\" value=\"\"/>'\n        },\n\n        /**\n         * Initialize store credit events\n         * @private\n         */\n        _create: function () {\n            this.element.on('click', '[data-action=\"checkout-form-submit\"]', $.proxy(function (e) {\n                var $target = $(e.target),\n                    returnUrl = $target.data('checkout-url'),\n                    productId = $target.closest('form').find(this.options.productId).val(),\n                    originalForm = this.options.originalForm.replace('%1', productId),\n                    self = this,\n                    billingAgreement = customerData.get('paypal-billing-agreement');\n\n                e.preventDefault();\n\n                if (billingAgreement().askToCreate) {\n                    confirm({\n                        content: billingAgreement().confirmMessage,\n                        actions: {\n\n                            /**\n                             * Confirmation handler\n                             *\n                             */\n                            confirm: function () {\n                                returnUrl = billingAgreement().confirmUrl;\n                                self._redirect(returnUrl, originalForm);\n                            },\n\n                            /**\n                             * Cancel confirmation handler\n                             *\n                             */\n                            cancel: function (event) {\n                                if (event && !$(event.target).hasClass('action-close')) {\n                                    self._redirect(returnUrl);\n                                }\n                            }\n                        }\n                    });\n                } else {\n                    this._redirect(returnUrl, originalForm);\n                }\n            }, this));\n        },\n\n        /**\n         * Redirect to certain url, with optional form\n         * @param {String} returnUrl\n         * @param {HTMLElement} originalForm\n         *\n         */\n        _redirect: function (returnUrl, originalForm) {\n            var $form,\n                ppCheckoutInput;\n\n            if (this.options.isCatalogProduct) {\n                // find the form from which the button was clicked\n                $form = originalForm ? $(originalForm) : $($(this.options.shortcutContainerClass).closest('form'));\n\n                ppCheckoutInput = $form.find(this.options.ppCheckoutSelector)[0];\n\n                if (!ppCheckoutInput) {\n                    ppCheckoutInput = $(this.options.ppCheckoutInput);\n                    ppCheckoutInput.appendTo($form);\n                }\n                $(ppCheckoutInput).val(returnUrl);\n\n                $form.submit();\n            } else {\n                $.mage.redirect(returnUrl);\n            }\n        }\n    });\n\n    return $.mage.paypalCheckout;\n});\n"}
}});