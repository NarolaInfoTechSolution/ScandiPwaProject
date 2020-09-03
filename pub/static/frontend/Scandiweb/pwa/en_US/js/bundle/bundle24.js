require.config({"config": {
        "jsbuild":{"Magento_Braintree/js/paypal/form-builder.js":"/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\ndefine(\n    [\n        'jquery',\n        'underscore',\n        'mage/template'\n    ],\n    function ($, _, mageTemplate) {\n        'use strict';\n\n        return {\n\n            /**\n             * @param {Object} formData\n             * @returns {*|jQuery}\n             */\n            build: function (formData) {\n                var formTmpl = mageTemplate('<form action=\"<%= data.action %>\"' +\n                    ' method=\"POST\" hidden enctype=\"application/x-www-form-urlencoded\">' +\n                        '<% _.each(data.fields, function(val, key){ %>' +\n                            '<input value=\\'<%= val %>\\' name=\"<%= key %>\" type=\"hidden\">' +\n                        '<% }); %>' +\n                    '</form>');\n\n                return $(formTmpl({\n                    data: {\n                        action: formData.action,\n                        fields: formData.fields\n                    }\n                })).appendTo($('[data-container=\"body\"]'));\n            }\n        };\n    }\n);\n"}
}});
