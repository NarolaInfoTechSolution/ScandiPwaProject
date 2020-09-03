require.config({"config": {
        "jsbuild":{"Magento_Ui/js/grid/tree-massactions.js":"/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n\n/**\n * @api\n */\ndefine([\n    'ko',\n    'underscore',\n    'Magento_Ui/js/grid/massactions'\n], function (ko, _, Massactions) {\n    'use strict';\n\n    return Massactions.extend({\n        defaults: {\n            template: 'ui/grid/tree-massactions',\n            submenuTemplate: 'ui/grid/submenu',\n            listens: {\n                opened: 'hideSubmenus'\n            }\n        },\n\n        /**\n         * Initializes observable properties.\n         *\n         * @returns {Massactions} Chainable.\n         */\n        initObservable: function () {\n            this._super()\n                .recursiveObserveActions(this.actions());\n\n            return this;\n        },\n\n        /**\n         * Recursive initializes observable actions.\n         *\n         * @param {Array} actions - Action objects.\n         * @param {String} [prefix] - An optional string that will be prepended\n         *      to the \"type\" field of all child actions.\n         * @returns {Massactions} Chainable.\n         */\n        recursiveObserveActions: function (actions, prefix) {\n            _.each(actions, function (action) {\n                if (prefix) {\n                    action.type = prefix + '.' + action.type;\n                }\n\n                if (action.actions) {\n                    action.visible = ko.observable(false);\n                    action.parent = actions;\n                    this.recursiveObserveActions(action.actions, action.type);\n                }\n            }, this);\n\n            return this;\n        },\n\n        /**\n         * Applies specified action.\n         *\n         * @param {String} actionIndex - Actions' identifier.\n         * @returns {Massactions} Chainable.\n         */\n        applyAction: function (actionIndex) {\n            var action = this.getAction(actionIndex),\n                visibility;\n\n            if (action.visible) {\n                visibility = action.visible();\n\n                this.hideSubmenus(action.parent);\n                action.visible(!visibility);\n\n                return this;\n            }\n\n            return this._super(actionIndex);\n        },\n\n        /**\n         * Retrieves action object associated with a specified index.\n         *\n         * @param {String} actionIndex - Actions' identifier.\n         * @param {Array} actions - Action objects.\n         * @returns {Object} Action object.\n         */\n        getAction: function (actionIndex, actions) {\n            var currentActions = actions || this.actions(),\n                result = false;\n\n            _.find(currentActions, function (action) {\n                if (action.type === actionIndex) {\n                    result = action;\n\n                    return true;\n                }\n\n                if (action.actions) {\n                    result = this.getAction(actionIndex, action.actions);\n\n                    return result;\n                }\n            }, this);\n\n            return result;\n        },\n\n        /**\n         * Recursive hide all sub folders in given array.\n         *\n         * @param {Array} actions - Action objects.\n         * @returns {Massactions} Chainable.\n         */\n        hideSubmenus: function (actions) {\n            var currentActions = actions || this.actions();\n\n            _.each(currentActions, function (action) {\n                if (action.visible && action.visible()) {\n                    action.visible(false);\n                }\n\n                if (action.actions) {\n                    this.hideSubmenus(action.actions);\n                }\n            }, this);\n\n            return this;\n        }\n    });\n});\n"}
}});