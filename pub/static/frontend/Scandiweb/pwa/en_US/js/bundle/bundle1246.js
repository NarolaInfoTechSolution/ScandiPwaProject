require.config({"config": {
        "text":{"Magento_Ui/templates/grid/columns/onoff.html":"<!--\n/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n-->\n\n<th class=\"data-grid-multicheck-cell\">\n    <label data-bind=\"i18n: 'Assign'\"></label>\n    <div\n        class=\"action-multicheck-wrap\"\n        data-bind=\"css: {'_disabled': !totalRecords()},\n                   collapsible\">\n        <input\n            id=\"mass-select-checkbox\"\n            class=\"admin__control-checkbox\"\n            type=\"checkbox\"\n            data-bind=\"checked: allSelected(),\n                       event: { change: toggleSelectAll },\n                       css: { '_indeterminate': indetermine },\n                       enable: totalRecords\">\n        <label for=\"mass-select-checkbox\"></label>\n        <button\n            class=\"action-multicheck-toggle\"\n            data-toggle=\"dropdown\"\n            data-bind=\"css: { '_active': $collapsible.opened },\n                       enable: totalRecords,\n                       toggleCollapsible\">\n            <span data-bind=\"i18n: 'Options'\"></span>\n        </button>\n        <ul\n            class=\"action-menu\"\n            data-bind=\"closeCollapsible, foreach: actions\">\n            <li data-bind=\"click: $parent[value].bind($parent),\n                           visible: $parent.isActionRelevant(value)\">\n                <span class=\"action-menu-item\" data-bind=\"text: label\"></span>\n            </li>\n        </ul>\n    </div>\n</th>\n"}
}});
