require.config({"config": {
        "jsbuild":{"mage/utils/arrays.js":"/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n\ndefine([\n    'underscore',\n    './strings'\n], function (_, utils) {\n    'use strict';\n\n    /**\n     * Defines index of an item in a specified container.\n     *\n     * @param {*} item - Item whose index should be defined.\n     * @param {Array} container - Container upon which to perform search.\n     * @returns {Number}\n     */\n    function getIndex(item, container) {\n        var index = container.indexOf(item);\n\n        if (~index) {\n            return index;\n        }\n\n        return _.findIndex(container, function (value) {\n            return value && value.name === item;\n        });\n    }\n\n    return {\n        /**\n         * Facade method to remove/add value from/to array\n         * without creating a new instance.\n         *\n         * @param {Array} arr - Array to be modified.\n         * @param {*} value - Value to add/remove.\n         * @param {Boolean} add - Flag that specfies operation.\n         * @returns {Utils} Chainable.\n         */\n        toggle: function (arr, value, add) {\n            return add ?\n                this.add(arr, value) :\n                this.remove(arr, value);\n        },\n\n        /**\n         * Removes the incoming value from array in case\n         * without creating a new instance of it.\n         *\n         * @param {Array} arr - Array to be modified.\n         * @param {*} value - Value to be removed.\n         * @returns {Utils} Chainable.\n         */\n        remove: function (arr, value) {\n            var index = arr.indexOf(value);\n\n            if (~index) {\n                arr.splice(index, 1);\n            }\n\n            return this;\n        },\n\n        /**\n         * Adds the incoming value to array if\n         * it's not alredy present in there.\n         *\n         * @param {Array} arr - Array to be modifed.\n         * @param {...*} arguments - Values to be added.\n         * @returns {Utils} Chainable.\n         */\n        add: function (arr) {\n            var values = _.toArray(arguments).slice(1);\n\n            values.forEach(function (value) {\n                if (!~arr.indexOf(value)) {\n                    arr.push(value);\n                }\n            });\n\n            return this;\n        },\n\n        /**\n         * Inserts specified item into container at a specified position.\n         *\n         * @param {*} item - Item to be inserted into container.\n         * @param {Array} container - Container of items.\n         * @param {*} [position=-1] - Position at which item should be inserted.\n         *      Position can represent:\n         *          - specific index in container\n         *          - item which might already be present in container\n         *          - structure with one of these properties: after, before\n         * @returns {Boolean|*}\n         *      - true if element has changed its' position\n         *      - false if nothing has changed\n         *      - inserted value if it wasn't present in container\n         */\n        insert: function (item, container, position) {\n            var currentIndex = getIndex(item, container),\n                newIndex,\n                target;\n\n            if (typeof position === 'undefined') {\n                position = -1;\n            } else if (typeof position === 'string') {\n                position = isNaN(+position) ? position : +position;\n            }\n\n            newIndex = position;\n\n            if (~currentIndex) {\n                target = container.splice(currentIndex, 1)[0];\n\n                if (typeof item === 'string') {\n                    item = target;\n                }\n            }\n\n            if (typeof position !== 'number') {\n                target = position.after || position.before || position;\n\n                newIndex = getIndex(target, container);\n\n                if (~newIndex && (position.after || newIndex >= currentIndex)) {\n                    newIndex++;\n                }\n            }\n\n            if (newIndex < 0) {\n                newIndex += container.length + 1;\n            }\n\n            container[newIndex] ?\n                container.splice(newIndex, 0, item) :\n                container[newIndex] = item;\n\n            return !~currentIndex ? item : currentIndex !== newIndex;\n        },\n\n        /**\n         * @param {Array} elems\n         * @param {Number} offset\n         * @return {Number|*}\n         */\n        formatOffset: function (elems, offset) {\n            if (utils.isEmpty(offset)) {\n                offset = -1;\n            }\n\n            offset = +offset;\n\n            if (offset < 0) {\n                offset += elems.length + 1;\n            }\n\n            return offset;\n        }\n    };\n});\n"}
}});
