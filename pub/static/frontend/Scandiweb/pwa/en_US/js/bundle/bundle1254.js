require.config({"config": {
        "text":{"Magento_Ui/templates/grid/sticky/filters.html":"<!--\n/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n-->\n<div class=\"data-grid-filters-actions-wrap\">\n    <div class=\"data-grid-filters-action-wrap\">\n        <button\n                class=\"action-default\"\n                data-action=\"grid-filter-expand\"\n                data-bind=\"\n                 click: function(){\n                    window.scrollTo(0, 0);\n                    $data.trigger('open');\n                 },\n                 attr: {disabled: !hasVisible()}\">\n            <span data-bind=\"i18n: 'Filters'\"></span>\n        </button>\n        <span class=\"filters-active\" data-bind=\"text: countActive() || ''\"></span> <!-- Added the amount of selected filters -->\n    </div>\n</div>\n"}
}});
