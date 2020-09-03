require.config({"config": {
        "jsbuild":{"Magento_Ui/js/form/element/post-code.js":"/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n\n/**\n * @api\n */\ndefine([\n    'underscore',\n    'uiRegistry',\n    './abstract'\n], function (_, registry, Abstract) {\n    'use strict';\n\n    return Abstract.extend({\n        defaults: {\n            imports: {\n                update: '${ $.parentName }.country_id:value'\n            }\n        },\n\n        /**\n         * Initializes observable properties of instance\n         *\n         * @returns {Abstract} Chainable.\n         */\n        initObservable: function () {\n            this._super();\n\n            /**\n             * equalityComparer function\n             *\n             * @returns boolean.\n             */\n            this.value.equalityComparer = function (oldValue, newValue) {\n                return !oldValue && !newValue || oldValue === newValue;\n            };\n\n            return this;\n        },\n\n        /**\n         * @param {String} value\n         */\n        update: function (value) {\n            var country = registry.get(this.parentName + '.' + 'country_id'),\n                options = country.indexedOptions,\n                option = null;\n\n            if (!value) {\n                return;\n            }\n\n            option = options[value];\n\n            if (!option) {\n                return;\n            }\n\n            if (option['is_zipcode_optional']) {\n                this.error(false);\n                this.validation = _.omit(this.validation, 'required-entry');\n            } else {\n                this.validation['required-entry'] = true;\n            }\n\n            this.required(!option['is_zipcode_optional']);\n        }\n    });\n});\n"}
}});
