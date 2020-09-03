require.config({"config": {
        "text":{"Magento_Shipping/template/checkout/shipping/shipping-policy.html":"<!--\n/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n-->\n<div class=\"shipping-policy-block field-tooltip\"\n     data-bind=\"visible: config.isEnabled\">\n    <span class=\"field-tooltip-action\"\n          tabindex=\"0\"\n          data-toggle=\"dropdown\"\n          data-bind=\"mageInit: {'dropdown':{'activeClass': '_active'}}\">\n        <!-- ko i18n: 'See our Shipping Policy' --><!-- /ko -->\n    </span>\n    <div class=\"field-tooltip-content\"\n         data-target=\"dropdown\">\n        <span data-bind=\"html: config.shippingPolicyContent\"></span>\n    </div>\n</div>\n"}
}});
