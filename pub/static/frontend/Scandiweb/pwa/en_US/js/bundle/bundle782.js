require.config({"config": {
        "jsbuild":{"Magento_Ui/js/lib/knockout/bindings/mage-init.js":"/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n\ndefine([\n    'ko',\n    'underscore',\n    'mage/apply/main'\n], function (ko, _, mage) {\n    'use strict';\n\n    ko.bindingHandlers.mageInit = {\n        /**\n         * Initializes components assigned to HTML elements.\n         *\n         * @param {HTMLElement} el\n         * @param {Function} valueAccessor\n         */\n        init: function (el, valueAccessor) {\n            var data = valueAccessor();\n\n            _.each(data, function (config, component) {\n                mage.applyFor(el, config, component);\n            });\n        }\n    };\n});\n"}
}});
