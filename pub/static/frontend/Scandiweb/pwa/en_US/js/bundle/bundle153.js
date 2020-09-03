require.config({"config": {
        "jsbuild":{"Magento_Catalog/js/list.js":"/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n\ndefine([\n    'jquery',\n    'jquery-ui-modules/widget'\n], function ($) {\n    'use strict';\n\n    $.widget('mage.compareList', {\n\n        /** @inheritdoc */\n        _create: function () {\n            var elem = this.element,\n                products = $('thead td', elem),\n                headings;\n\n            if (products.length > this.options.productsInRow) {\n                headings = $('<table/>')\n                    .addClass('comparison headings data table')\n                    .insertBefore(elem.closest('.container'));\n\n                elem.addClass('scroll');\n\n                $('th', elem).each(function () {\n                    var th = $(this),\n                        thCopy = th.clone();\n\n                    th.animate({\n                        top: '+=0'\n                    }, 50, function () {\n                        var height = th.height();\n\n                        thCopy.css('height', height)\n                            .appendTo(headings)\n                            .wrap('<tr />');\n                    });\n                });\n            }\n\n            $(this.options.windowPrintSelector).on('click', function (e) {\n                e.preventDefault();\n                window.print();\n            });\n        }\n    });\n\n    return $.mage.compareList;\n});\n"}
}});
