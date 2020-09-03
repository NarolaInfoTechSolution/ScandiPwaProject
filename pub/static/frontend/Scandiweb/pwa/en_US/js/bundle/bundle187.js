require.config({"config": {
        "jsbuild":{"Magento_Catalog/js/view/compare-products.js":"/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n\ndefine([\n    'uiComponent',\n    'Magento_Customer/js/customer-data',\n    'jquery',\n    'mage/mage',\n    'mage/decorate'\n], function (Component, customerData, $) {\n    'use strict';\n\n    var sidebarInitialized = false;\n\n    /**\n     * Initialize sidebar\n     */\n    function initSidebar() {\n        if (sidebarInitialized) {\n            return;\n        }\n\n        sidebarInitialized = true;\n        $('[data-role=compare-products-sidebar]').decorate('list', true);\n    }\n\n    return Component.extend({\n        /** @inheritdoc */\n        initialize: function () {\n            this._super();\n            this.compareProducts = customerData.get('compare-products');\n\n            initSidebar();\n        }\n    });\n});\n"}
}});
