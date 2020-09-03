require.config({"config": {
        "jsbuild":{"Magento_Ui/js/form/element/select.js":"/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n\n/**\n * @api\n */\ndefine([\n    'underscore',\n    'mageUtils',\n    'uiRegistry',\n    './abstract',\n    'uiLayout'\n], function (_, utils, registry, Abstract, layout) {\n    'use strict';\n\n    var inputNode = {\n        parent: '${ $.$data.parentName }',\n        component: 'Magento_Ui/js/form/element/abstract',\n        template: '${ $.$data.template }',\n        provider: '${ $.$data.provider }',\n        name: '${ $.$data.index }_input',\n        dataScope: '${ $.$data.customEntry }',\n        customScope: '${ $.$data.customScope }',\n        sortOrder: {\n            after: '${ $.$data.name }'\n        },\n        displayArea: 'body',\n        label: '${ $.$data.label }'\n    };\n\n    /**\n     * Parses incoming options, considers options with undefined value property\n     *     as caption\n     *\n     * @param  {Array} nodes\n     * @return {Object}\n     */\n    function parseOptions(nodes, captionValue) {\n        var caption,\n            value;\n\n        nodes = _.map(nodes, function (node) {\n            value = node.value;\n\n            if (value === null || value === captionValue) {\n                if (_.isUndefined(caption)) {\n                    caption = node.label;\n                }\n            } else {\n                return node;\n            }\n        });\n\n        return {\n            options: _.compact(nodes),\n            caption: _.isString(caption) ? caption : false\n        };\n    }\n\n    /**\n     * Recursively loops over data to find non-undefined, non-array value\n     *\n     * @param  {Array} data\n     * @return {*} - first non-undefined value in array\n     */\n    function findFirst(data) {\n        var value;\n\n        data.some(function (node) {\n            value = node.value;\n\n            if (Array.isArray(value)) {\n                value = findFirst(value);\n            }\n\n            return !_.isUndefined(value);\n        });\n\n        return value;\n    }\n\n    /**\n     * Recursively set to object item like value and item.value like key.\n     *\n     * @param {Array} data\n     * @param {Object} result\n     * @returns {Object}\n     */\n    function indexOptions(data, result) {\n        var value;\n\n        result = result || {};\n\n        data.forEach(function (item) {\n            value = item.value;\n\n            if (Array.isArray(value)) {\n                indexOptions(value, result);\n            } else {\n                result[value] = item;\n            }\n        });\n\n        return result;\n    }\n\n    return Abstract.extend({\n        defaults: {\n            customName: '${ $.parentName }.${ $.index }_input',\n            elementTmpl: 'ui/form/element/select',\n            caption: '',\n            options: []\n        },\n\n        /**\n         * Extends instance with defaults, extends config with formatted values\n         *     and options, and invokes initialize method of AbstractElement class.\n         *     If instance's 'customEntry' property is set to true, calls 'initInput'\n         */\n        initialize: function () {\n            this._super();\n\n            if (this.customEntry) {\n                registry.get(this.name, this.initInput.bind(this));\n            }\n\n            if (this.filterBy) {\n                this.initFilter();\n            }\n\n            return this;\n        },\n\n        /**\n         * Calls 'initObservable' of parent, initializes 'options' and 'initialOptions'\n         *     properties, calls 'setOptions' passing options to it\n         *\n         * @returns {Object} Chainable.\n         */\n        initObservable: function () {\n            this._super();\n\n            this.initialOptions = this.options;\n\n            this.observe('options caption')\n                .setOptions(this.options());\n\n            return this;\n        },\n\n        /**\n         * Set link for filter.\n         *\n         * @returns {Object} Chainable\n         */\n        initFilter: function () {\n            var filter = this.filterBy;\n\n            this.filter(this.default, filter.field);\n            this.setLinks({\n                filter: filter.target\n            }, 'imports');\n\n            return this;\n        },\n\n        /**\n         * Creates input from template, renders it via renderer.\n         *\n         * @returns {Object} Chainable.\n         */\n        initInput: function () {\n            layout([utils.template(inputNode, this)]);\n\n            return this;\n        },\n\n        /**\n         * Matches specified value with existing options\n         * or, if value is not specified, returns value of the first option.\n         *\n         * @returns {*}\n         */\n        normalizeData: function () {\n            var value = this._super(),\n                option;\n\n            if (value !== '') {\n                option = this.getOption(value);\n\n                return option && option.value;\n            }\n\n            if (!this.caption()) {\n                return findFirst(this.options);\n            }\n        },\n\n        /**\n         * Filters 'initialOptions' property by 'field' and 'value' passed,\n         * calls 'setOptions' passing the result to it\n         *\n         * @param {*} value\n         * @param {String} field\n         */\n        filter: function (value, field) {\n            var source = this.initialOptions,\n                result;\n\n            field = field || this.filterBy.field;\n\n            result = _.filter(source, function (item) {\n                return item[field] === value || item.value === '';\n            });\n\n            this.setOptions(result);\n        },\n\n        /**\n         * Change visibility for input.\n         *\n         * @param {Boolean} isVisible\n         */\n        toggleInput: function (isVisible) {\n            registry.get(this.customName, function (input) {\n                input.setVisible(isVisible);\n            });\n        },\n\n        /**\n         * Sets 'data' to 'options' observable array, if instance has\n         * 'customEntry' property set to true, calls 'setHidden' method\n         *  passing !options.length as a parameter\n         *\n         * @param {Array} data\n         * @returns {Object} Chainable\n         */\n        setOptions: function (data) {\n            var captionValue = this.captionValue || '',\n                result = parseOptions(data, captionValue),\n                isVisible;\n\n            this.indexedOptions = indexOptions(result.options);\n\n            this.options(result.options);\n\n            if (!this.caption()) {\n                this.caption(result.caption);\n            }\n\n            if (this.customEntry) {\n                isVisible = !!result.options.length;\n\n                this.setVisible(isVisible);\n                this.toggleInput(!isVisible);\n            }\n\n            return this;\n        },\n\n        /**\n         * Processes preview for option by it's value, and sets the result\n         * to 'preview' observable\n         *\n         * @returns {Object} Chainable.\n         */\n        getPreview: function () {\n            var value = this.value(),\n                option = this.indexedOptions[value],\n                preview = option ? option.label : '';\n\n            this.preview(preview);\n\n            return preview;\n        },\n\n        /**\n         * Get option from indexedOptions list.\n         *\n         * @param {Number} value\n         * @returns {Object} Chainable\n         */\n        getOption: function (value) {\n            return this.indexedOptions[value];\n        },\n\n        /**\n         * Select first available option\n         *\n         * @returns {Object} Chainable.\n         */\n        clear: function () {\n            var value = this.caption() ? '' : findFirst(this.options);\n\n            this.value(value);\n\n            return this;\n        },\n\n        /**\n         * Initializes observable properties of instance\n         *\n         * @returns {Object} Chainable.\n         */\n        setInitialValue: function () {\n            if (_.isUndefined(this.value()) && !this.default) {\n                this.clear();\n            }\n\n            return this._super();\n        }\n    });\n});\n"}
}});
