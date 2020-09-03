require.config({"config": {
        "text":{"Magento_Catalog/template/product/price/max_price.html":"<!--\n/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n-->\n<span if=\"showMaximumPrice\"\n      class=\"price-container\"\n      css=\"getAdjustmentCssClasses($row())\">\n    <span if=\"label\"\n          class=\"price-label\"\n          text=\"label\"/>\n\n    <span class=\"price-wrapper\"\n          css=\"priceWrapperCssClasses\"\n          attr=\"priceWrapperAttr\"\n          data-price-amount=\"\"\n          data-price-type=\"\"\n          html=\"getMaxPrice($row())\"/>\n\n    <each args=\"data: getAdjustments('max_price'), as: '$adj'\">\n        <render args=\"$adj.getBody()\"/>\n    </each>\n</span>\n\n"}
}});