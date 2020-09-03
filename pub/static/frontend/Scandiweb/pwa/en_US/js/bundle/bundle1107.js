require.config({"config": {
        "text":{"Magento_Catalog/template/product/price/minimal_regular_price.html":"<!--\n/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n-->\n<span if=\"showMinRegularPrice($row())\"\n      class=\"old-price\">\n    <span class=\"price-container\"\n          css=\"getAdjustmentCssClasses($row())\">\n        <span if=\"label\"\n              class=\"price-label\"\n              text=\"label\"/>\n\n        <span class=\"price-wrapper\"\n              css=\"priceWrapperCssClasses\"\n              attr=\"priceWrapperAttr\"\n              data-price-amount=\"\"\n              data-price-type=\"\"\n              html=\"getMinRegularPrice($row())\"/>\n    </span>\n</span>\n"}
}});
