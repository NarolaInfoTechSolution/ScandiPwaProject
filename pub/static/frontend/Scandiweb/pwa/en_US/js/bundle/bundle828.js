require.config({"config": {
        "jsbuild":{"Magento_Ui/js/grid/editing/bulk.js":"/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n\n/**\n * @api\n */\ndefine([\n    'underscore',\n    'mageUtils',\n    './record'\n], function (_, utils, Record) {\n    'use strict';\n\n    /**\n     * Removes empty properties from the provided object.\n     *\n     * @param {Object} data - Object to be processed.\n     * @returns {Object}\n     */\n    function removeEmpty(data) {\n        data = utils.flatten(data);\n        data = _.omit(data, utils.isEmpty);\n\n        return utils.unflatten(data);\n    }\n\n    return Record.extend({\n        defaults: {\n            template: 'ui/grid/editing/bulk',\n            active: false,\n            templates: {\n                fields: {\n                    select: {\n                        caption: ' '\n                    }\n                }\n            },\n            imports: {\n                active: '${ $.editorProvider }:isMultiEditing'\n            },\n            listens: {\n                data: 'updateState',\n                active: 'updateState'\n            }\n        },\n\n        /**\n         * Initializes observable properties.\n         *\n         * @returns {Bulk} Chainable.\n         */\n        initObservable: function () {\n            this._super()\n                .track({\n                    hasData: false\n                });\n\n            return this;\n        },\n\n        /**\n         * Extends original method to disable possible\n         * 'required-entry' validation rule.\n         *\n         * @returns {Object} Columns' field definition.\n         */\n        buildField: function () {\n            var field = this._super(),\n                rules = field.validation;\n\n            if (rules) {\n                delete rules['required-entry'];\n            }\n\n            return field;\n        },\n\n        /**\n         * Applies current data to all active records.\n         *\n         * @returns {Bulk} Chainable.\n         */\n        apply: function () {\n            if (this.isValid()) {\n                this.applyData()\n                    .clear();\n            }\n\n            return this;\n        },\n\n        /**\n         * Sets available data to all active records.\n         *\n         * @param {Object} [data] -  If not specified, then current fields data will be used.\n         * @returns {Bulk} Chainable.\n         */\n        applyData: function (data) {\n            data = data || this.getData();\n\n            this.editor('setData', data, true);\n\n            return this;\n        },\n\n        /**\n         * Returns data of all non-empty fields.\n         *\n         * @returns {Object} Fields data without empty values.\n         */\n        getData: function () {\n            return removeEmpty(this._super());\n        },\n\n        /**\n         * Updates own 'hasData' property and defines\n         * whether regular rows editing can be resumed.\n         *\n         * @returns {Bulk} Chainable.\n         */\n        updateState: function () {\n            var fields  = _.keys(this.getData()),\n                hasData = !!fields.length;\n\n            this.hasData = hasData;\n\n            if (!this.active()) {\n                fields = [];\n            }\n\n            this.editor('disableFields', fields);\n            this.editor('canSave', !fields.length);\n\n            return this;\n        }\n    });\n});\n"}
}});