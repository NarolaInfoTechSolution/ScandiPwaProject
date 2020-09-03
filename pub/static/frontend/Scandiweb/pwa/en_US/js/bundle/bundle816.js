require.config({"config": {
        "jsbuild":{"Magento_Ui/js/grid/columns/image-preview.js":"/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\ndefine([\n    'jquery',\n    'Magento_Ui/js/grid/columns/column',\n    'Magento_Ui/js/lib/key-codes'\n], function ($, Column, keyCodes) {\n    'use strict';\n\n    return Column.extend({\n        defaults: {\n            bodyTmpl: 'ui/grid/columns/image-preview',\n            previewImageSelector: '[data-image-preview]',\n            visibleRecord: null,\n            height: 0,\n            displayedRecord: {},\n            lastOpenedImage: null,\n            fields: {\n                previewUrl: 'preview_url',\n                title: 'title'\n            },\n            modules: {\n                masonry: '${ $.parentName }',\n                thumbnailComponent: '${ $.parentName }.thumbnail_url'\n            },\n            statefull: {\n                sorting: true,\n                lastOpenedImage: true\n            },\n            listens: {\n                '${ $.provider }:params.filters': 'hide',\n                '${ $.provider }:params.search': 'hide',\n                '${ $.provider }:params.paging': 'hide'\n            },\n            exports: {\n                height: '${ $.parentName }.thumbnail_url:previewHeight'\n            }\n        },\n\n        /**\n         * Initialize image preview component\n         *\n         * @returns {Object}\n         */\n        initialize: function () {\n            this._super();\n            $(document).on('keydown', this.handleKeyDown.bind(this));\n\n            return this;\n        },\n\n        /**\n         * Init observable variables\n         * @return {Object}\n         */\n        initObservable: function () {\n            this._super()\n                .observe([\n                    'visibleRecord',\n                    'height',\n                    'displayedRecord',\n                    'lastOpenedImage'\n                ]);\n\n            return this;\n        },\n\n        /**\n         * Next image preview\n         *\n         * @param {Object} record\n         */\n        next: function (record) {\n            var recordToShow;\n\n            if (record._rowIndex + 1 === this.masonry().rows().length) {\n                return;\n            }\n\n            recordToShow = this.getRecord(record._rowIndex + 1);\n            recordToShow.rowNumber = record.lastInRow ? record.rowNumber + 1 : record.rowNumber;\n            this.show(recordToShow);\n        },\n\n        /**\n         * Previous image preview\n         *\n         * @param {Object} record\n         */\n        prev: function (record) {\n            var recordToShow;\n\n            if (record._rowIndex === 0) {\n                return;\n            }\n            recordToShow = this.getRecord(record._rowIndex - 1);\n\n            recordToShow.rowNumber = record.firstInRow ? record.rowNumber - 1 : record.rowNumber;\n            this.show(recordToShow);\n        },\n\n        /**\n         * Get record\n         *\n         * @param {Integer} recordIndex\n         *\n         * @return {Object}\n         */\n        getRecord: function (recordIndex) {\n            return this.masonry().rows()[recordIndex];\n        },\n\n        /**\n         * Set selected row id\n         *\n         * @param {Number} rowId\n         * @private\n         */\n        _selectRow: function (rowId) {\n            this.thumbnailComponent().previewRowId(rowId);\n        },\n\n        /**\n         * Show image preview\n         *\n         * @param {Object} record\n         */\n        show: function (record) {\n            var img;\n\n            if (record._rowIndex === this.visibleRecord()) {\n                this.hide();\n\n                return;\n            }\n\n            this.hide();\n            this.displayedRecord(record);\n            this._selectRow(record.rowNumber || null);\n            this.visibleRecord(record._rowIndex);\n\n            img = $(this.previewImageSelector + ' img');\n\n            if (img.get(0).complete) {\n                this.updateHeight();\n                this.scrollToPreview();\n            } else {\n                img.load(function () {\n                    this.updateHeight();\n                    this.scrollToPreview();\n                }.bind(this));\n            }\n\n            this.lastOpenedImage(record._rowIndex);\n        },\n\n        /**\n         * Update image preview section height\n         */\n        updateHeight: function () {\n            this.height($(this.previewImageSelector).height() + 'px');\n        },\n\n        /**\n         * Close image preview\n         */\n        hide: function () {\n            this.lastOpenedImage(null);\n            this.visibleRecord(null);\n            this.height(0);\n            this._selectRow(null);\n        },\n\n        /**\n         * Returns visibility for given record.\n         *\n         * @param {Object} record\n         * @return {*|bool}\n         */\n        isVisible: function (record) {\n            if (this.lastOpenedImage() === record._rowIndex &&\n                this.visibleRecord() === null\n            ) {\n                this.show(record);\n            }\n\n            return this.visibleRecord() === record._rowIndex || false;\n        },\n\n        /**\n         * Returns preview image url for a given record.\n         *\n         * @param {Object} record\n         * @return {String}\n         */\n        getUrl: function (record) {\n            return record[this.fields.previewUrl];\n        },\n\n        /**\n         * Returns image title for a given record.\n         *\n         * @param {Object} record\n         * @return {String}\n         */\n        getTitle: function (record) {\n            return record[this.fields.title];\n        },\n\n        /**\n         * Get styles for preview\n         *\n         * @returns {Object}\n         */\n        getStyles: function () {\n            return {\n                'margin-top': '-' + this.height()\n            };\n        },\n\n        /**\n         * Scroll to preview window\n         */\n        scrollToPreview: function () {\n            $(this.previewImageSelector).get(0).scrollIntoView({\n                behavior: 'smooth',\n                block: 'center',\n                inline: 'nearest'\n            });\n        },\n\n        /**\n         * Handle keyboard navigation for image preview\n         *\n         * @param {Object} e\n         */\n        handleKeyDown: function (e) {\n            var key = keyCodes[e.keyCode];\n\n            if (this.visibleRecord() !== null && document.activeElement.tagName !== 'INPUT') {\n                if (key === 'pageLeftKey') {\n                    this.prev(this.displayedRecord());\n                } else if (key === 'pageRightKey') {\n                    this.next(this.displayedRecord());\n                }\n            }\n        }\n    });\n});\n"}
}});
