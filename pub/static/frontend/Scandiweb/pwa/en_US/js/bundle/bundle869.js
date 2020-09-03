require.config({"config": {
        "jsbuild":{"Magento_Ui/js/form/element/single-checkbox-toggle-notice.js":"/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n\n/**\n * @api\n */\ndefine([\n    'Magento_Ui/js/form/element/single-checkbox'\n], function (SingleCheckbox) {\n    'use strict';\n\n    return SingleCheckbox.extend({\n        defaults: {\n            notices: [],\n            tracks: {\n                notice: true\n            }\n        },\n\n        /**\n         * Choose notice on initialization\n         *\n         * @returns {*|void|Element}\n         */\n        initialize: function () {\n            this._super()\n                .chooseNotice();\n\n            return this;\n        },\n\n        /**\n         * Choose notice function\n         *\n         * @returns void\n         */\n        chooseNotice: function () {\n            var checkedNoticeNumber = Number(this.checked());\n\n            this.notice = this.notices[checkedNoticeNumber];\n        },\n\n        /**\n         * Choose notice on update\n         *\n         * @returns void\n         */\n        onUpdate: function () {\n            this._super();\n            this.chooseNotice();\n        }\n    });\n});\n"}
}});
