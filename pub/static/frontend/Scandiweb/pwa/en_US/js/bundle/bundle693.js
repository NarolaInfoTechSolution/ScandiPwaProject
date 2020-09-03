require.config({"config": {
        "jsbuild":{"Magento_ConfigurableProduct/js/catalog-add-to-cart.js":"/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\nrequire([\n    'jquery'\n], function ($) {\n    'use strict';\n\n    /**\n     * Add selected configurable attributes to redirect url\n     *\n     * @see Magento_Catalog/js/catalog-add-to-cart\n     */\n    $('body').on('catalogCategoryAddToCartRedirect', function (event, data) {\n        $(data.form).find('select[name*=\"super\"]').each(function (index, item) {\n            data.redirectParameters.push(item.config.id + '=' + $(item).val());\n        });\n    });\n});\n"}
}});