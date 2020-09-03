require.config({"config": {
        "text":{"Magento_Ui/templates/form/element/helper/tooltip.html":"<!--\n/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n-->\n <div class=\"field-tooltip toggle\">\n\n    <!-- ko if: (tooltip.link)-->\n    <a class=\"field-tooltip-action action-help\"\n       target=\"_blank\"\n       data-toggle=\"dropdown\"\n       data-bind=\"attr: {href: tooltip.link}, mageInit: {'dropdown':{'activeClass': '_active'}}\"></a>\n     <!-- /ko -->\n\n     <span id=\"tooltip-label\" class=\"label\"><!-- ko i18n: 'Tooltip' --><!-- /ko --></span>\n     <!-- ko if: (!tooltip.link)-->\n         <span\n             id=\"tooltip\"\n             class=\"field-tooltip-action action-help\"\n             tabindex=\"0\"\n             data-toggle=\"dropdown\"\n             data-bind=\"mageInit: {'dropdown':{'activeClass': '_active', 'parent': '.field-tooltip.toggle'}}\"\n             aria-labelledby=\"tooltip-label\"\n         >\n         </span>\n     <!-- /ko -->\n\n     <div class=\"field-tooltip-content\"\n         data-target=\"dropdown\" translate=\"tooltip.description\">\n    </div>\n</div>\n"}
}});
