require.config({"config": {
        "text":{"Magento_Braintree/template/payment/multishipping/paypal.html":"<!--\n/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n-->\n<div class=\"payment-method\" data-bind=\"css: {'_active': isActive()}\">\n    <div class=\"payment-method-title field choice\">\n        <label class=\"label\" data-bind=\"attr: {'for': getCode()}\">\n            <!-- PayPal Logo -->\n            <img data-bind=\"attr: {src: getPaymentAcceptanceMarkSrc(), alt: $t('Acceptance Mark'), title: $t('Acceptance Mark')}\"\n                 class=\"payment-icon\"/>\n            <!-- PayPal Logo -->\n            <span text=\"getTitle()\"></span>\n        </label>\n    </div>\n\n    <div class=\"payment-method-content\">\n        <each args=\"getRegion('messages')\" render=\"\"></each>\n        <fieldset class=\"braintree-paypal-fieldset\" data-bind='attr: {id: \"payment_form_\" + getCode()}'>\n            <div id=\"paypal-container\"></div>\n        </fieldset>\n        <div data-container=\"paypal-button\"></div>\n        <div class=\"actions-toolbar braintree-paypal-actions\" data-bind=\"visible: isReviewRequired()\">\n            <div class=\"payment-method-item braintree-paypal-account\">\n                <span class=\"payment-method-type\">PayPal</span>\n                <span class=\"payment-method-description\" text=\"customerEmail()\"></span>\n            </div>\n            <div class=\"actions-toolbar no-display\">\n                <div class=\"primary\">\n                    <button data-button=\"paypal-place\" data-role=\"review-save\"\n                            type=\"submit\"\n                            data-bind=\"{click: placeOrder}\"\n                            class=\"action primary checkout\">\n                        <span data-bind=\"i18n: 'Place Order'\"></span>\n                    </button>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n"}
}});
