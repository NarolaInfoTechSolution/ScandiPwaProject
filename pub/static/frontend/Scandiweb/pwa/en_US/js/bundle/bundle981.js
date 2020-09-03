require.config({"config": {
        "jsbuild":{"mage/item-table.js":"/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n\n/**\n * @deprecated since version 2.2.0\n */\ndefine([\n    'jquery',\n    'mage/template',\n    'jquery-ui-modules/widget'\n], function ($, mageTemplate) {\n    'use strict';\n\n    $.widget('mage.itemTable', {\n        options: {\n            addBlock: '[data-template=\"add-block\"]',\n            addBlockData: {},\n            addEvent: 'click',\n            addSelector: '[data-role=\"add\"]',\n            itemsSelector: '[data-container=\"items\"]',\n            keepLastRow: true\n        },\n\n        /**\n         * This method adds a new instance of the block to the items.\n         * @private\n         */\n        _add: function () {\n            var hideShowDelete,\n                deletableItems,\n                addedBlock;\n\n            // adding a new row, so increment the count to give each row a unique index\n            this.rowIndex++;\n\n            // make sure the block data has the rowIndex\n            this.options.addBlockData.rowIndex = this.rowIndex;\n\n            // render the form\n            addedBlock = $(this.addBlockTmpl({\n                data: this.options.addBlockData\n            }));\n\n            // add the row to the item block\n            this.element.find(this.options.itemsSelector).append(addedBlock);\n\n            // initialize all mage content\n            addedBlock.trigger('contentUpdated');\n\n            // determine all existing items in the collection\n            deletableItems = this._getDeletableItems();\n\n            // for the most part, show the delete mechanism, except in the case where there is only one it should not\n            // be deleted\n            hideShowDelete = 'showDelete';\n\n            if (this.options.keepLastRow && deletableItems.length === 1) {\n                hideShowDelete = 'hideDelete';\n            }\n\n            // loop through each control and perform that action on the deletable item\n            $.each(deletableItems, function (index) {\n                $(deletableItems[index]).trigger(hideShowDelete);\n            });\n        },\n\n        /**\n         * This method binds elements found in this widget.\n         * @private\n         */\n        _bind: function () {\n            var handlers = {};\n\n            // since the first handler is dynamic, generate the object using array notation\n            handlers[this.options.addEvent + ' ' + this.options.addSelector] = '_add';\n            handlers.deleteItem = '_onDeleteItem';\n\n            this._on(handlers);\n        },\n\n        /**\n         * This method constructs a new widget.\n         * @private\n         */\n        _create: function () {\n            this._bind();\n\n            this.addBlockTmpl = mageTemplate(this.options.addBlock);\n\n            // nothing in the table, so indicate that\n            this.rowIndex = -1;\n\n            // make sure the block data is an object\n            if (this.options.addBlockData == null || typeof this.options.addBlockData !== 'object') {\n                // reset the block data to an empty object\n                this.options.addBlockData = {};\n            }\n\n            // add the first row to the table\n            this._add();\n        },\n\n        /**\n         * This method returns the list of widgets associated with deletable items from the container (direct children\n         * only).\n         * @private\n         */\n        _getDeletableItems: function () {\n            return this.element.find(this.options.itemsSelector + '> .deletableItem');\n        },\n\n        /**\n         * This method removes the item associated with the message.\n         * @private\n         */\n        _onDeleteItem: function (e) {\n            var deletableItems;\n\n            // parent elements don't need to see this event\n            e.stopPropagation();\n\n            // remove the deletable item\n            $(e.target).remove();\n\n            if (this.options.keepLastRow) {\n                // determine if there is only one element remaining, in which case, disable the delete mechanism on it\n                deletableItems = this._getDeletableItems();\n\n                if (deletableItems.length === 1) {\n                    $(deletableItems[0]).trigger('hideDelete');\n                }\n            }\n        }\n    });\n\n    return $.mage.itemTable;\n});\n"}
}});