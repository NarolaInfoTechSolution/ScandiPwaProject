require.config({"config": {
        "jsbuild":{"Magento_Usps/js/view/shipping-rates-validation.js":"/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n\ndefine([\n    'uiComponent',\n    'Magento_Checkout/js/model/shipping-rates-validator',\n    'Magento_Checkout/js/model/shipping-rates-validation-rules',\n    '../model/shipping-rates-validator',\n    '../model/shipping-rates-validation-rules'\n], function (\n    Component,\n    defaultShippingRatesValidator,\n    defaultShippingRatesValidationRules,\n    uspsShippingRatesValidator,\n    uspsShippingRatesValidationRules\n) {\n    'use strict';\n\n    defaultShippingRatesValidator.registerValidator('usps', uspsShippingRatesValidator);\n    defaultShippingRatesValidationRules.registerRules('usps', uspsShippingRatesValidationRules);\n\n    return Component;\n});\n"}
}});