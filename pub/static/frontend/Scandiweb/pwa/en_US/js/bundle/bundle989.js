require.config({"config": {
        "jsbuild":{"mage/deletable-item.js":"/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n\n/**\n * @deprecated since version 2.2.0\n */\ndefine([\n    'jquery',\n    'jquery-ui-modules/widget'\n], function ($) {\n    'use strict';\n\n    /**\n     * This widget is used to tag a DOM element as deletable. By default, it will use the click event on the item with a\n     * data role of delete to trigger the deletion.\n     */\n    $.widget('mage.deletableItem', {\n        options: {\n            deleteEvent: 'click',\n            deleteSelector: '[data-role=\"delete\"]',\n            hiddenClass: 'no-display'\n        },\n\n        /**\n         * This method binds elements found in this widget.\n         */\n        _bind: function () {\n            var handlers = {};\n\n            // since the first handler is dynamic, generate the object using array notation\n            handlers[this.options.deleteEvent + ' ' + this.options.deleteSelector] = '_onDeleteClicked';\n            handlers.hideDelete = '_onHideDelete';\n            handlers.showDelete = '_onShowDelete';\n\n            this._on(handlers);\n        },\n\n        /**\n         * This method constructs a new widget.\n         */\n        _create: function () {\n            this._bind();\n        },\n\n        /**\n         * This method is to initialize the control\n         * @private\n         */\n        _init: function () {\n            this._onHideDelete(); // by default, hide the control\n        },\n\n        /**\n         * This method removes the entity from the DOM.\n         * @private\n         */\n        _onDeleteClicked: function (e) {\n            e.stopPropagation();\n            this.element.trigger('deleteItem');\n        },\n\n        /**\n         * This method hides the delete capability of this item (i.e. making it not deletable)\n         * @private\n         */\n        _onHideDelete: function () {\n            this.element.find(this.options.deleteSelector).addClass(this.options.hiddenClass);\n        },\n\n        /**\n         * This method shows the delete capability of this item (i.e. making it deletable)\n         * @private\n         */\n        _onShowDelete: function () {\n            this.element.find(this.options.deleteSelector).removeClass(this.options.hiddenClass);\n        }\n    });\n\n    return $.mage.deletableItem;\n});\n"}
}});
