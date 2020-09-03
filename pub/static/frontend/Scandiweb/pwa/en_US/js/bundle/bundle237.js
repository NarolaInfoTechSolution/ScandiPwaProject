require.config({"config": {
        "jsbuild":{"Magento_Payment/js/model/credit-card-validation/expiration-date-validator/parse-date.js":"/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n\ndefine([], function () {\n    'use strict';\n\n    return function (value) {\n        var month, len;\n\n        if (value.match('/')) {\n            value = value.split(/\\s*\\/\\s*/g);\n\n            return {\n                month: value[0],\n                year: value.slice(1).join()\n            };\n        }\n\n        len = value[0] === '0' || value.length > 5 || value.length === 4 || value.length === 3 ? 2 : 1;\n        month = value.substr(0, len);\n\n        return {\n            month: month,\n            year: value.substr(month.length, 4)\n        };\n    };\n});\n"}
}});