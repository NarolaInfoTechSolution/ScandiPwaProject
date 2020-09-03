require.config({"config": {
        "text":{"Magento_Ui/templates/group/group.html":"<!--\n/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n-->\n<fieldset class=\"field\" data-bind=\"css: additionalClasses\">\n    <legend class=\"label\">\n        <span translate=\"element.label\"></span>\n    </legend>\n    <div class=\"control\">\n        <!-- ko foreach: { data: elems, as: 'element' } -->\n\n            <!-- ko if: element.visible() -->\n\n                <!-- ko ifnot: (element.input_type == 'checkbox' || element.input_type == 'radio') -->\n                    <!-- ko template: $parent.fieldTemplate --><!-- /ko -->\n                <!-- /ko -->\n\n                <!-- ko if: (element.input_type == 'checkbox' || element.input_type == 'radio') -->\n                    <!-- ko template: element.elementTmpl --><!-- /ko -->\n                <!-- /ko -->\n\n            <!-- /ko -->\n\n        <!-- /ko -->\n\n        <!-- ko if: validateWholeGroup -->\n        <!-- ko  foreach: { data: elems, as: 'element' } -->\n            <!-- ko if: element.error() && element.visible() -->\n                <label class=\"error\" data-bind=\"attr: { for: uid }, text: element.error\"></label>\n            <!-- /ko -->\n        <!-- /ko -->\n        <!-- /ko -->\n    </div>\n</fieldset>\n"}
}});