require.config({"config": {
        "text":{"Magento_Ui/templates/grid/actions.html":"<!--\n/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n-->\n<div class=\"action-select-wrap\" collapsible=\"onTarget: true\">\n    <button class=\"action-select\" translate=\"'Actions'\"/>\n    <ul class=\"action-menu\"css=\"_active: $collapsible.opened\">\n        <li repeat=\"foreach: actions, item: '$action'\" click=\"applyAction.bind($data, $action().type)\">\n            <span class=\"action-menu-item\" text=\"$action().label\"/>\n        </li>\n    </ul>\n</div>\n"}
}});
