require.config({"config": {
        "text":{"Magento_Paypal/template/payment/paypal-express-in-context.html":"<!--\n/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n-->\n<div class=\"payment-method\" css=\"_active: getCode() == isChecked()\" afterRender=\"initListeners\">\n    <div class=\"payment-method-title field choice\">\n        <input type=\"radio\"\n               name=\"payment[method]\"\n               class=\"radio\"\n               attr=\"id: getCode()\"\n               ko-value=\"getCode()\"\n               ko-checked=\"isChecked\"\n               click=\"selectPaymentMethod\"\n               visible=\"isRadioButtonVisible()\"/>\n        <label attr=\"for: getCode()\" class=\"label\">\n            <!-- PayPal Logo -->\n            <img attr=\"src: getPaymentAcceptanceMarkSrc(), alt: $t('Acceptance Mark')\" class=\"payment-icon\"/>\n            <!-- PayPal Logo -->\n            <span text=\"getTitle()\"/>\n            <a class=\"action action-help\"\n               attr=\"href: getPaymentAcceptanceMarkHref()\"\n               click=\"showAcceptanceWindow\"\n               translate=\"'What is PayPal?'\"/>\n        </label>\n    </div>\n    <div class=\"payment-method-content\">\n        <each args=\"getRegion('messages')\" render=\"\"/>\n        <div class=\"checkout-agreements-block\">\n            <each args=\"$parent.getRegion('before-place-order')\" render=\"\"/>\n        </div>\n        <div class=\"actions-toolbar\" attr=\"id: getButtonId()\" afterRender=\"renderPayPalButtons\"/>\n    </div>\n</div>\n"}
}});