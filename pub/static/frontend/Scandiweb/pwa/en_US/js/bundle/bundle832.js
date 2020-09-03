require.config({"config": {
        "jsbuild":{"Magento_Ui/js/grid/editing/editor-view.js":"/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n\n/**\n * @api\n */\ndefine([\n    'ko',\n    'Magento_Ui/js/lib/view/utils/async',\n    'underscore',\n    'uiRegistry',\n    'uiClass'\n], function (ko, $, _, registry, Class) {\n    'use strict';\n\n    return Class.extend({\n        defaults: {\n            rootSelector: '${ $.columnsProvider }:.admin__data-grid-wrap',\n            tableSelector: '${ $.rootSelector } -> table',\n            rowSelector: '${ $.tableSelector } tbody tr.data-row',\n            headerButtonsTmpl:\n                '<!-- ko template: headerButtonsTmpl --><!-- /ko -->',\n            bulkTmpl:\n                '<!-- ko scope: bulk -->' +\n                    '<!-- ko template: getTemplate() --><!-- /ko -->' +\n                '<!-- /ko -->',\n            rowTmpl:\n                '<!-- ko with: _editor -->' +\n                    '<!-- ko if: isActive($row()._rowIndex, true) -->' +\n                        '<!-- ko with: getRecord($row()._rowIndex, true) -->' +\n                            '<!-- ko template: rowTmpl --><!-- /ko -->' +\n                        '<!-- /ko -->' +\n                        '<!-- ko if: isSingleEditing && singleEditingButtons -->' +\n                            '<!-- ko template: rowButtonsTmpl --><!-- /ko -->' +\n                        '<!-- /ko -->' +\n                    '<!-- /ko -->' +\n               '<!-- /ko -->'\n        },\n\n        /**\n         * Initializes view component.\n         *\n         * @returns {View} Chainable.\n         */\n        initialize: function () {\n            _.bindAll(\n                this,\n                'initRoot',\n                'initTable',\n                'initRow',\n                'rowBindings',\n                'tableBindings'\n            );\n\n            this._super();\n\n            this.model = registry.get(this.model);\n\n            $.async(this.rootSelector, this.initRoot);\n            $.async(this.tableSelector, this.initTable);\n            $.async(this.rowSelector, this.initRow);\n\n            return this;\n        },\n\n        /**\n         * Initializes columns root container.\n         *\n         * @param {HTMLElement} node\n         * @returns {View} Chainable.\n         */\n        initRoot: function (node) {\n            $(this.headerButtonsTmpl)\n                .insertBefore(node)\n                .applyBindings(this.model);\n\n            return this;\n        },\n\n        /**\n         * Initializes table element.\n         *\n         * @param {HTMLTableElement} table\n         * @returns {View} Chainable.\n         */\n        initTable: function (table) {\n            $(table).bindings(this.tableBindings);\n\n            this.initBulk(table);\n\n            return this;\n        },\n\n        /**\n         * Initializes bulk editor element\n         * for the provided table.\n         *\n         * @param {HTMLTableElement} table\n         * @returns {View} Chainable.\n         */\n        initBulk: function (table) {\n            var tableBody = $('tbody', table)[0];\n\n            $(this.bulkTmpl)\n                .prependTo(tableBody)\n                .applyBindings(this.model);\n\n            return this;\n        },\n\n        /**\n         * Initializes table row.\n         *\n         * @param {HTMLTableRowElement} row\n         * @returns {View} Chainable.\n         */\n        initRow: function (row) {\n            var $editingRow;\n\n            $(row).extendCtx({\n                    _editor: this.model\n                }).bindings(this.rowBindings);\n\n            $editingRow = $(this.rowTmpl)\n                .insertBefore(row)\n                .applyBindings(row);\n\n            ko.utils.domNodeDisposal.addDisposeCallback(row, this.removeEditingRow.bind(this, $editingRow));\n\n            return this;\n        },\n\n        /**\n         * Returns row bindings.\n         *\n         * @param {Object} ctx - Current context of a row.\n         * @returns {Object}\n         */\n        rowBindings: function (ctx) {\n            var model = this.model;\n\n            return {\n                visible: ko.computed(function () {\n                    var record = ctx.$row(),\n                        index = record && record._rowIndex;\n\n                    return !model.isActive(index, true);\n                })\n            };\n        },\n\n        /**\n         * Returns table bindings.\n         *\n         * @returns {Object}\n         */\n        tableBindings: function () {\n            var model = this.model;\n\n            return {\n                css: {\n                    '_in-edit': ko.computed(function () {\n                        return model.hasActive() && !model.permanentlyActive;\n                    })\n                }\n            };\n        },\n\n        /**\n         * Removes specified array of nodes.\n         *\n         * @param {ArrayLike} row\n         */\n        removeEditingRow: function (row) {\n            _.toArray(row).forEach(ko.removeNode);\n        }\n    });\n});\n"}
}});
