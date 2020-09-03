require.config({"config": {
        "text":{"Magento_Paypal/template/payment/iframe-methods.html":"<!--\n/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n-->\n<div class=\"payment-method\" data-bind=\"css: {'_active': (getCode() == isChecked())}\">\n    <div class=\"payment-method-title field choice\">\n        <input type=\"radio\"\n               name=\"payment[method]\"\n               class=\"radio\"\n               data-bind=\"attr: {'id': getCode()}, value: getCode(), checked: isChecked, click: selectPaymentMethod, visible: isRadioButtonVisible()\"/>\n        <label class=\"label\" data-bind=\"attr: {'for': getCode()}\"><span data-bind=\"text: getTitle()\"></span></label>\n    </div>\n    <div class=\"payment-method-content\">\n        <!-- ko foreach: getRegion('messages') -->\n        <!-- ko template: getTemplate() --><!-- /ko -->\n        <!--/ko-->\n        <div class=\"payment-method-billing-address\">\n            <!-- ko foreach: $parent.getRegion(getBillingAddressFormName()) -->\n                <!-- ko template: getTemplate() --><!-- /ko -->\n            <!--/ko-->\n        </div>\n        <div class=\"checkout-agreements-block\">\n            <!-- ko foreach: $parent.getRegion('before-place-order') -->\n                <!-- ko template: getTemplate() --><!-- /ko -->\n            <!--/ko-->\n        </div>\n        <div class=\"actions-toolbar\" data-bind=\"visible: !isInAction()\">\n            <div class=\"primary\">\n                <button data-role=\"review-save\"\n                        type=\"submit\"\n                        data-bind=\"click: placePendingPaymentOrder, attr: {title: $t('Continue')}, css: {disabled: !isPlaceOrderActionAllowed()}\"\n                        class=\"button action primary checkout\">\n                    <span data-bind=\"i18n: 'Continue'\"></span>\n                </button>\n            </div>\n        </div>\n        <div data-bind=\"visible: isInAction()\">\n            <div id=\"iframe-warning\" class=\"message notice\">\n                <div><!-- ko i18n: 'Please do not refresh the page until you complete payment.' --><!-- /ko --></div>\n            </div>\n            <!-- ko if: isPaymentReady() -->\n            <iframe data-bind=\"attr: {id: getCode() + '-iframe', src: getActionUrl()}, event: {load: iframeLoaded}\"\n                    data-container=\"paypal-iframe\"\n                    class=\"paypal iframe\"\n                    scrolling=\"no\"\n                    frameborder=\"0\"\n                    border=\"0\"\n                    height=\"610\"\n                    width=\"100%\"\n                    >\n            </iframe>\n            <!-- /ko -->\n        </div>\n    </div>\n</div>\n"}
}});