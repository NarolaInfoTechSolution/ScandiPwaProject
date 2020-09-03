require.config({"config": {
        "jsbuild":{"Magento_Ui/js/modal/alert.js":"/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n\n/**\n * @api\n */\ndefine([\n    'jquery',\n    'underscore',\n    'jquery-ui-modules/widget',\n    'Magento_Ui/js/modal/confirm',\n    'mage/translate'\n], function ($, _) {\n    'use strict';\n\n    $.widget('mage.alert', $.mage.confirm, {\n        options: {\n            modalClass: 'confirm',\n            title: $.mage.__('Attention'),\n            actions: {\n\n                /**\n                 * Callback always - called on all actions.\n                 */\n                always: function () {}\n            },\n            buttons: [{\n                text: $.mage.__('OK'),\n                class: 'action-primary action-accept',\n\n                /**\n                 * Click handler.\n                 */\n                click: function () {\n                    this.closeModal(true);\n                }\n            }]\n        },\n\n        /**\n         * Create widget.\n         */\n        _create: function () {\n            this.options.actions.always();\n            this._super();\n        },\n\n        /**\n         * Close modal window.\n         */\n        closeModal: function () {\n            this.element.bind('alertclosed', _.bind(this._remove, this));\n\n            return this._super();\n        }\n    });\n\n    return function (config) {\n        return $('<div></div>').html(config.content).alert(config);\n    };\n});\n"}
}});