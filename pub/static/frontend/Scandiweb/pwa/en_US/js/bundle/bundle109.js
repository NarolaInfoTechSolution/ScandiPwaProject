require.config({"config": {
        "jsbuild":{"Magento_AuthorizenetAcceptjs/js/view/payment/validator-handler.js":"/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n\ndefine([\n    'jquery',\n    'Magento_AuthorizenetAcceptjs/js/view/payment/response-validator'\n], function ($, responseValidator) {\n    'use strict';\n\n    return {\n        validators: [],\n\n        /**\n         * Init list of validators\n         */\n        initialize: function () {\n            this.add(responseValidator);\n        },\n\n        /**\n         * Add new validator\n         * @param {Object} validator\n         */\n        add: function (validator) {\n            this.validators.push(validator);\n        },\n\n        /**\n         * Run pull of validators\n         * @param {Object} context\n         * @param {Function} callback\n         */\n        validate: function (context, callback) {\n            var self = this,\n                deferred;\n\n            // no available validators\n            if (!self.validators.length) {\n                callback(true);\n\n                return;\n            }\n\n            // get list of deferred validators\n            deferred = $.map(self.validators, function (current) {\n                return current.validate(context);\n            });\n\n            $.when.apply($, deferred)\n                .done(function () {\n                    callback(true);\n                }).fail(function (error) {\n                    callback(false, error);\n                });\n        }\n    };\n});\n"}
}});