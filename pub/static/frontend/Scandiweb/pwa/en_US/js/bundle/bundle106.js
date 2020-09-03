require.config({"config": {
        "jsbuild":{"Magento_AuthorizenetAcceptjs/js/view/payment/acceptjs-client.js":"/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n\ndefine([\n    'jquery',\n    'uiClass',\n    'Magento_AuthorizenetAcceptjs/js/view/payment/acceptjs-factory',\n    'Magento_AuthorizenetAcceptjs/js/view/payment/validator-handler'\n], function ($, Class, acceptjsFactory, validatorHandler) {\n    'use strict';\n\n    return Class.extend({\n        defaults: {\n            environment: 'production'\n        },\n\n        /**\n         * @{inheritdoc}\n         */\n        initialize: function () {\n            validatorHandler.initialize();\n\n            this._super();\n\n            return this;\n        },\n\n        /**\n         * Creates the token pair with the provided data\n         *\n         * @param {Object} data\n         * @return {jQuery.Deferred}\n         */\n        createTokens: function (data) {\n            var deferred = $.Deferred();\n\n            if (this.acceptjsClient) {\n                this._createTokens(deferred, data);\n            } else {\n                acceptjsFactory(this.environment)\n                    .done(function (client) {\n                        this.acceptjsClient = client;\n                        this._createTokens(deferred, data);\n                    }.bind(this));\n            }\n\n            return deferred.promise();\n        },\n\n        /**\n         * Creates a token from the payment information in the form\n         *\n         * @param {jQuery.Deferred} deferred\n         * @param {Object} data\n         */\n        _createTokens: function (deferred, data) {\n            this.acceptjsClient.dispatchData(data, function (response) {\n                validatorHandler.validate(response, function (valid, messages) {\n                    if (valid) {\n                        deferred.resolve({\n                            opaqueDataDescriptor: response.opaqueData.dataDescriptor,\n                            opaqueDataValue: response.opaqueData.dataValue\n                        });\n                    } else {\n                        deferred.reject(messages);\n                    }\n                });\n            });\n        }\n    });\n});\n"}
}});