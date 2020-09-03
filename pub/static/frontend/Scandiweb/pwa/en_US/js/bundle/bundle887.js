require.config({"config": {
        "jsbuild":{"Magento_Ui/js/form/element/single-checkbox-use-config.js":"/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n\n/**\n * @api\n */\ndefine([\n    'Magento_Ui/js/form/element/single-checkbox'\n], function (Component) {\n    'use strict';\n\n    return Component.extend({\n        defaults: {\n            isUseDefault: false,\n            isUseConfig: false,\n            listens: {\n                'isUseConfig': 'toggleElement',\n                'isUseDefault': 'toggleElement'\n            }\n        },\n\n        /**\n         * @inheritdoc\n         */\n        initObservable: function () {\n\n            return this\n                ._super()\n                .observe('isUseConfig');\n        },\n\n        /**\n         * Toggle element\n         */\n        toggleElement: function () {\n            this.disabled(this.isUseDefault() || this.isUseConfig());\n\n            if (this.source) {\n                this.source.set('data.use_default.' + this.index, Number(this.isUseDefault()));\n            }\n        }\n    });\n});\n"}
}});
