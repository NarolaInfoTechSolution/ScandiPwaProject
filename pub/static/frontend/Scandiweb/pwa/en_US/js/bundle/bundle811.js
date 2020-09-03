require.config({"config": {
        "jsbuild":{"Magento_Ui/js/grid/columns/multiselect.js":"/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n\n/**\n * @api\n */\ndefine([\n    'underscore',\n    'mage/translate',\n    './column'\n], function (_, $t, Column) {\n    'use strict';\n\n    return Column.extend({\n        defaults: {\n            headerTmpl: 'ui/grid/columns/multiselect',\n            bodyTmpl: 'ui/grid/cells/multiselect',\n            controlVisibility: false,\n            sortable: false,\n            draggable: false,\n            menuVisible: false,\n            excludeMode: false,\n            allSelected: false,\n            indetermine: false,\n            preserveSelectionsOnFilter: false,\n            disabled: [],\n            selected: [],\n            excluded: [],\n            fieldClass: {\n                'data-grid-checkbox-cell': true\n            },\n            actions: [{\n                value: 'selectAll',\n                label: $t('Select All')\n            }, {\n                value: 'deselectAll',\n                label: $t('Deselect All')\n            }, {\n                value: 'selectPage',\n                label: $t('Select All on This Page')\n            }, {\n                value: 'deselectPage',\n                label: $t('Deselect All on This Page')\n            }],\n\n            imports: {\n                totalRecords: '${ $.provider }:data.totalRecords',\n                rows: '${ $.provider }:data.items'\n            },\n\n            listens: {\n                '${ $.provider }:params.filters': 'onFilter',\n                selected: 'onSelectedChange',\n                rows: 'onRowsChange'\n            },\n\n            modules: {\n                source: '${ $.provider }'\n            }\n        },\n\n        /**\n         * Initializes observable properties.\n         *\n         * @returns {Multiselect} Chainable.\n         */\n        initObservable: function () {\n            this._super()\n                .observe([\n                    'disabled',\n                    'selected',\n                    'excluded',\n                    'excludeMode',\n                    'totalSelected',\n                    'allSelected',\n                    'indetermine',\n                    'totalRecords',\n                    'rows'\n                ]);\n\n            return this;\n        },\n\n        /**\n         * Selects specified record.\n         *\n         * @param {*} id - See definition of 'getId' method.\n         * @param {Boolean} [isIndex=false] - See definition of 'getId' method.\n         * @returns {Multiselect} Chainable.\n         */\n        select: function (id, isIndex) {\n            this._setSelection(id, isIndex, true);\n\n            return this;\n        },\n\n        /**\n         * Deselects specified record.\n         *\n         * @param {*} id - See definition of 'getId' method.\n         * @param {Boolean} [isIndex=false] - See definition of 'getId' method.\n         * @returns {Multiselect} Chainable.\n         */\n        deselect: function (id, isIndex) {\n            this._setSelection(id, isIndex, false);\n\n            return this;\n        },\n\n        /**\n         * Toggles selection of a specified record.\n         *\n         * @param {*} id - See definition of 'getId' method.\n         * @param {Boolean} [isIndex=false] - See definition of 'getId' method.\n         * @returns {Multiselect} Chainable.\n         */\n        toggleSelect: function (id, isIndex) {\n            this._setSelection(id, isIndex, !this.isSelected(id, isIndex));\n\n            return this;\n        },\n\n        /**\n         * Checks if specified record is selected.\n         *\n         * @param {*} id - See definition of 'getId' method.\n         * @param {Boolean} [isIndex=false] - See definition of 'getId' method.\n         * @returns {Boolean}\n         */\n        isSelected: function (id, isIndex) {\n            id = this.getId(id, isIndex);\n\n            return this.selected.contains(id);\n        },\n\n        /**\n         * Selects/deselects specified record base on a 'select' parameter value.\n         *\n         * @param {*} id - See definition of 'getId' method.\n         * @param {Boolean} [isIndex=false] - See definition of 'getId' method.\n         * @param {Boolean} select - Whether to select/deselect record.\n         * @returns {Multiselect} Chainable.\n         */\n        _setSelection: function (id, isIndex, select) {\n            var selected = this.selected;\n\n            id = this.getId(id, isIndex);\n\n            if (!select && this.isSelected(id)) {\n                selected.remove(id);\n            } else if (select) {\n                selected.push(id);\n            }\n\n            return this;\n        },\n\n        /**\n         * Selects all records, even those that\n         * are not visible on the page.\n         *\n         * @returns {Multiselect} Chainable.\n         */\n        selectAll: function () {\n            this.excludeMode(true);\n\n            this.clearExcluded()\n                .selectPage();\n\n            return this;\n        },\n\n        /**\n         * Deselects all records.\n         *\n         * @returns {Multiselect} Chainable.\n         */\n        deselectAll: function () {\n            this.excludeMode(false);\n\n            this.clearExcluded();\n            this.selected.removeAll();\n\n            return this;\n        },\n\n        /**\n         * Selects or deselects all records.\n         *\n         * @returns {Multiselect} Chainable.\n         */\n        toggleSelectAll: function () {\n            this.allSelected() ?\n                this.deselectAll() :\n                this.selectAll();\n\n            return this;\n        },\n\n        /**\n         * Selects all records on the current page.\n         *\n         * @returns {Multiselect} Chainable.\n         */\n        selectPage: function () {\n            var selected = _.union(this.selected(), this.getIds());\n\n            selected = _.difference(selected, this.disabled());\n\n            this.selected(selected);\n\n            return this;\n        },\n\n        /**\n         * Deselects all records on the current page.\n         *\n         * @returns {Multiselect} Chainable.\n         */\n        deselectPage: function () {\n            var pageIds = this.getIds();\n\n            this.selected.remove(function (value) {\n                return !!~pageIds.indexOf(value);\n            });\n\n            return this;\n        },\n\n        /**\n        * Selects or deselects all records on the current page.\n        *\n        * @returns {Multiselect} Chainable.\n        */\n        togglePage: function () {\n            return this.isPageSelected() ? this.deselectPage() : this.selectPage();\n        },\n\n        /**\n         * Clears the array of not selected records.\n         *\n         * @returns {Multiselect} Chainable.\n         */\n        clearExcluded: function () {\n            this.excluded.removeAll();\n\n            return this;\n        },\n\n        /**\n         * Retrieve all id's from available records.\n         *\n         * @param {Boolean} [exclude] - Whether to exclude not selected ids' from result.\n         * @returns {Array} An array of ids'.\n         */\n        getIds: function (exclude) {\n            var items = this.rows(),\n                ids = _.pluck(items, this.indexField);\n\n            return exclude ?\n                _.difference(ids, this.excluded()) :\n                ids;\n        },\n\n        /**\n         * Returns identifier of a record.\n         *\n         * @param {*} id - Id of a record or its' index in a rows array.\n         * @param {Boolean} [isIndex=false] - Flag that specifies with what\n         *      kind of identifier we are dealing with.\n         * @returns {*}\n         */\n        getId: function (id, isIndex) {\n            var record = this.rows()[id];\n\n            if (isIndex && record) {\n                id = record[this.indexField];\n            }\n\n            return id;\n        },\n\n        /**\n         * Recalculates list of the excluded records.\n         * Changes value of `excluded`.\n         *\n         * @param {Array} selected - List of the currently selected records.\n         * @returns {Multiselect} Chainable.\n         */\n        updateExcluded: function (selected) {\n            var excluded = this.excluded(),\n                fromPage = _.difference(this.getIds(), selected);\n\n            excluded = _.union(excluded, fromPage);\n            excluded = _.difference(excluded, selected);\n\n            this.excluded(excluded);\n\n            return this;\n        },\n\n        /**\n         * Calculates number of selected records and\n         * updates 'totalSelected' property.\n         *\n         * @returns {Multiselect} Chainable.\n         */\n        countSelected: function () {\n            var total = this.totalRecords(),\n                excluded = this.excluded().length,\n                selected = this.selected().length;\n\n            if (this.excludeMode()) {\n                selected = total - excluded;\n            }\n\n            this.totalSelected(selected);\n\n            return this;\n        },\n\n        /**\n         * Returns selected items on a current page.\n         *\n         * @returns {Array}\n         */\n        getPageSelections: function () {\n            var ids = this.getIds();\n\n            return this.selected.filter(function (id) {\n                return _.contains(ids, id);\n            });\n        },\n\n        /**\n         * Returns selections data.\n         *\n         * @returns {Object}\n         */\n        getSelections: function () {\n            return {\n                excluded: this.excluded(),\n                selected: this.selected(),\n                total: this.totalSelected(),\n                excludeMode: this.excludeMode(),\n                params: this.getFiltering()\n            };\n        },\n\n        /**\n         * Extracts filtering data from data provider.\n         *\n         * @returns {Object} Current filters state.\n         */\n        getFiltering: function () {\n            var source = this.source(),\n                keys = ['filters', 'search', 'namespace'];\n\n            if (!source) {\n                return {};\n            }\n\n            return _.pick(source.get('params'), keys);\n        },\n\n        /**\n         * Defines if provided select/deselect actions is relevant.\n         * E.g. there is no need in a 'select page' action if only one\n         * page is available.\n         *\n         * @param {String} actionId - Id of the action to be checked.\n         * @returns {Boolean}\n         */\n        isActionRelevant: function (actionId) {\n            var pageIds         = this.getIds().length,\n                multiplePages   = pageIds < this.totalRecords(),\n                relevant        = true;\n\n            switch (actionId) {\n                case 'selectPage':\n                    relevant = multiplePages && !this.isPageSelected(true);\n                    break;\n\n                case 'deselectPage':\n                    relevant =  multiplePages && this.isPageSelected();\n                    break;\n\n                case 'selectAll':\n                    relevant = !this.allSelected();\n                    break;\n\n                case 'deselectAll':\n                    relevant = this.totalSelected() > 0;\n            }\n\n            return relevant;\n        },\n\n        /**\n         * Checks if current page has selected records.\n         *\n         * @param {Boolean} [all=false] - If set to 'true' checks that every\n         *      record on the page is selected. Otherwise checks that\n         *      page has some selected records.\n         * @returns {Boolean}\n         */\n        isPageSelected: function (all) {\n            var pageIds = this.getIds(),\n                selected = this.selected(),\n                excluded = this.excluded(),\n                iterator = all ? 'every' : 'some';\n\n            if (this.allSelected()) {\n                return true;\n            }\n\n            if (this.excludeMode()) {\n                return pageIds[iterator](function (id) {\n                    return !~excluded.indexOf(id);\n                });\n            }\n\n            return pageIds[iterator](function (id) {\n                return !!~selected.indexOf(id);\n            });\n        },\n\n        /**\n         * Updates values of the 'allSelected'\n         * and 'indetermine' properties.\n         *\n         * @returns {Multiselect} Chainable.\n         */\n        updateState: function () {\n            var selected        = this.selected().length,\n                excluded        = this.excluded().length,\n                totalSelected   = this.totalSelected(),\n                totalRecords    = this.totalRecords(),\n                allSelected     = totalRecords && totalSelected === totalRecords;\n\n            if (this.excludeMode()) {\n                if (excluded === totalRecords && !this.preserveSelectionsOnFilter) {\n                    this.deselectAll();\n                }\n            } else if (totalRecords && selected === totalRecords && !this.preserveSelectionsOnFilter) {\n                this.selectAll();\n            }\n\n            this.allSelected(allSelected);\n            this.indetermine(totalSelected && !allSelected);\n\n            return this;\n        },\n\n        /**\n         * Overrides base method, because this component\n         * can't have global field action.\n         *\n         * @returns {Boolean} False.\n         */\n        hasFieldAction: function () {\n            return false;\n        },\n\n        /**\n         * Callback method to handle changes of selected items.\n         *\n         * @param {Array} selected - An array of currently selected items.\n         */\n        onSelectedChange: function (selected) {\n            this.updateExcluded(selected)\n                .countSelected()\n                .updateState();\n        },\n\n        /**\n         * Is invoked when rows has changed. Recalculates selected items\n         * based on \"selectMode\" property.\n         */\n        onRowsChange: function () {\n            var newSelections;\n\n            if (this.excludeMode()) {\n                newSelections = _.union(this.getIds(true), this.selected());\n\n                this.selected(newSelections);\n            }\n        },\n\n        /**\n         * Is invoked when filtration is applied or removed\n         */\n        onFilter: function () {\n            if (!this.preserveSelectionsOnFilter) {\n                this.deselectAll();\n            }\n        }\n    });\n});\n"}
}});
