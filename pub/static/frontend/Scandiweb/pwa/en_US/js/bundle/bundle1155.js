require.config({"config": {
        "text":{"Magento_Checkout/template/billing-address/actions.html":"<!--\n/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n-->\n<div class=\"actions-toolbar\">\n    <div class=\"primary\">\n        <button class=\"action action-update\"\n                type=\"button\"\n                click=\"updateAddress\">\n            <span translate=\"'Update'\"/>\n        </button>\n        <button class=\"action action-cancel\"\n                type=\"button\"\n                click=\"cancelAddressEdit\"\n                visible=\"canUseCancelBillingAddress()\">\n            <span translate=\"'Cancel'\"/>\n        </button>\n    </div>\n</div>\n"}
}});
