require.config({"config": {
        "jsbuild":{"mage/utils/objects.js":"/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\ndefine([\n    'ko',\n    'jquery',\n    'underscore'\n], function (ko, $, _) {\n    'use strict';\n\n    var primitives = [\n        'undefined',\n        'boolean',\n        'number',\n        'string'\n    ];\n\n    /**\n     * Sets nested property of a specified object.\n     * @private\n     *\n     * @param {Object} parent - Object to look inside for the properties.\n     * @param {Array} path - Splitted path the property.\n     * @param {*} value - Value of the last property in 'path' array.\n     * returns {*} New value for the property.\n     */\n    function setNested(parent, path, value) {\n        var last = path.pop(),\n            len = path.length,\n            pi = 0,\n            part = path[pi];\n\n        for (; pi < len; part = path[++pi]) {\n            if (!_.isObject(parent[part])) {\n                parent[part] = {};\n            }\n\n            parent = parent[part];\n        }\n\n        if (typeof parent[last] === 'function') {\n            parent[last](value);\n        } else {\n            parent[last] = value;\n        }\n\n        return value;\n    }\n\n    /**\n     * Retrieves value of a nested property.\n     * @private\n     *\n     * @param {Object} parent - Object to look inside for the properties.\n     * @param {Array} path - Splitted path the property.\n     * @returns {*} Value of the property.\n     */\n    function getNested(parent, path) {\n        var exists = true,\n            len = path.length,\n            pi = 0;\n\n        for (; pi < len && exists; pi++) {\n            parent = parent[path[pi]];\n\n            if (typeof parent === 'undefined') {\n                exists = false;\n            }\n        }\n\n        if (exists) {\n            if (ko.isObservable(parent)) {\n                parent = parent();\n            }\n\n            return parent;\n        }\n    }\n\n    /**\n     * Removes property from a specified object.\n     * @private\n     *\n     * @param {Object} parent - Object from which to remove property.\n     * @param {Array} path - Splitted path to the property.\n     */\n    function removeNested(parent, path) {\n        var field = path.pop();\n\n        parent = getNested(parent, path);\n\n        if (_.isObject(parent)) {\n            delete parent[field];\n        }\n    }\n\n    return {\n\n        /**\n         * Retrieves or defines objects' property by a composite path.\n         *\n         * @param {Object} data - Container for the properties specified in path.\n         * @param {String} path - Objects' properties divided by dots.\n         * @param {*} [value] - New value for the last property.\n         * @returns {*} Returns value of the last property in chain.\n         *\n         * @example\n         *      utils.nested({}, 'one.two', 3);\n         *      => { one: {two: 3} }\n         */\n        nested: function (data, path, value) {\n            var action = arguments.length > 2 ? setNested : getNested;\n\n            path = path ? path.split('.') : [];\n\n            return action(data, path, value);\n        },\n\n        /**\n         * Removes nested property from an object.\n         *\n         * @param {Object} data - Data source.\n         * @param {String} path - Path to the property e.g. 'one.two.three'\n         */\n        nestedRemove: function (data, path) {\n            path = path.split('.');\n\n            removeNested(data, path);\n        },\n\n        /**\n         * Flattens objects' nested properties.\n         *\n         * @param {Object} data - Object to flatten.\n         * @param {String} [separator='.'] - Objects' keys separator.\n         * @returns {Object} Flattened object.\n         *\n         * @example Example with a default separator.\n         *      utils.flatten({one: { two: { three: 'value'} }});\n         *      => { 'one.two.three': 'value' };\n         *\n         * @example Example with a custom separator.\n         *      utils.flatten({one: { two: { three: 'value'} }}, '=>');\n         *      => {'one=>two=>three': 'value'};\n         */\n        flatten: function (data, separator, parent, result) {\n            separator = separator || '.';\n            result = result || {};\n\n            if (!data) {\n                return result;\n            }\n\n            // UnderscoreJS each breaks when an object has a length property so we use Object.keys\n            _.each(Object.keys(data), function (name) {\n                var node = data[name];\n\n                if ({}.toString.call(node) === '[object Function]') {\n                    return;\n                }\n\n                if (parent) {\n                    name = parent + separator + name;\n                }\n\n                typeof node === 'object' ?\n                    this.flatten(node, separator, name, result) :\n                    result[name] = node;\n\n            }, this);\n\n            return result;\n        },\n\n        /**\n         * Opposite operation of the 'flatten' method.\n         *\n         * @param {Object} data - Previously flattened object.\n         * @param {String} [separator='.'] - Keys separator.\n         * @returns {Object} Object with nested properties.\n         *\n         * @example Example using custom separator.\n         *      utils.unflatten({'one=>two': 'value'}, '=>');\n         *      => {\n         *          one: { two: 'value' }\n         *      };\n         */\n        unflatten: function (data, separator) {\n            var result = {};\n\n            separator = separator || '.';\n\n            _.each(data, function (value, nodes) {\n                nodes = nodes.split(separator);\n\n                setNested(result, nodes, value);\n            });\n\n            return result;\n        },\n\n        /**\n         * Same operation as 'flatten' method,\n         * but returns objects' keys wrapped in '[]'.\n         *\n         * @param {Object} data - Object that should be serialized.\n         * @returns {Object} Serialized data.\n         *\n         * @example\n         *      utils.serialize({one: { two: { three: 'value'} }});\n         *      => { 'one[two][three]': 'value' }\n         */\n        serialize: function (data) {\n            var result = {};\n\n            data = this.flatten(data);\n\n            _.each(data, function (value, keys) {\n                keys = this.serializeName(keys);\n                value = _.isUndefined(value) ? '' : value;\n\n                result[keys] = value;\n            }, this);\n\n            return result;\n        },\n\n        /**\n         * Performs deep extend of specified objects.\n         *\n         * @returns {Object|Array} Extended object.\n         */\n        extend: function () {\n            var args = _.toArray(arguments);\n\n            args.unshift(true);\n\n            return $.extend.apply($, args);\n        },\n\n        /**\n         * Performs a deep clone of a specified object.\n         *\n         * @param {(Object|Array)} data - Data that should be copied.\n         * @returns {Object|Array} Cloned object.\n         */\n        copy: function (data) {\n            var result = data,\n                isArray = Array.isArray(data),\n                placeholder;\n\n            if (this.isObject(data) || isArray) {\n                placeholder = isArray ? [] : {};\n                result = this.extend(placeholder, data);\n            }\n\n            return result;\n        },\n\n        /**\n         * Performs a deep clone of a specified object.\n         * Doesn't save links to original object.\n         *\n         * @param {*} original - Object to clone\n         * @returns {*}\n         */\n        hardCopy: function (original) {\n            if (original === null || typeof original !== 'object') {\n                return original;\n            }\n\n            return JSON.parse(JSON.stringify(original));\n        },\n\n        /**\n         * Removes specified nested properties from the target object.\n         *\n         * @param {Object} target - Object whose properties should be removed.\n         * @param {(...String|Array|Object)} list - List that specifies properties to be removed.\n         * @returns {Object} Modified object.\n         *\n         * @example Basic usage\n         *      var obj = {a: {b: 2}, c: 'a'};\n         *\n         *      omit(obj, 'a.b');\n         *      => {'a.b': 2};\n         *      obj => {a: {}, c: 'a'};\n         *\n         * @example Various syntaxes that would return same result\n         *      omit(obj, ['a.b', 'c']);\n         *      omit(obj, 'a.b', 'c');\n         *      omit(obj, {'a.b': true, 'c': true});\n         */\n        omit: function (target, list) {\n            var removed = {},\n                ignored = list;\n\n            if (this.isObject(list)) {\n                ignored = [];\n\n                _.each(list, function (value, key) {\n                    if (value) {\n                        ignored.push(key);\n                    }\n                });\n            } else if (_.isString(list)) {\n                ignored = _.toArray(arguments).slice(1);\n            }\n\n            _.each(ignored, function (path) {\n                var value = this.nested(target, path);\n\n                if (!_.isUndefined(value)) {\n                    removed[path] = value;\n\n                    this.nestedRemove(target, path);\n                }\n            }, this);\n\n            return removed;\n        },\n\n        /**\n         * Checks if provided value is a plain object.\n         *\n         * @param {*} value - Value to be checked.\n         * @returns {Boolean}\n         */\n        isObject: function (value) {\n            var objProto = Object.prototype;\n\n            return typeof value == 'object' ?\n            objProto.toString.call(value) === '[object Object]' :\n                false;\n        },\n\n        /**\n         *\n         * @param {*} value\n         * @returns {Boolean}\n         */\n        isPrimitive: function (value) {\n            return value === null || ~primitives.indexOf(typeof value);\n        },\n\n        /**\n         * Iterates over obj props/array elems recursively, applying action to each one\n         *\n         * @param {Object|Array} data - Data to be iterated.\n         * @param {Function} action - Callback to be called with each item as an argument.\n         * @param {Number} [maxDepth=7] - Max recursion depth.\n         */\n        forEachRecursive: function (data, action, maxDepth) {\n            maxDepth = typeof maxDepth === 'number' && !isNaN(maxDepth) ? maxDepth - 1 : 7;\n\n            if (!_.isFunction(action) || _.isFunction(data) || maxDepth < 0) {\n                return;\n            }\n\n            if (!_.isObject(data)) {\n                action(data);\n\n                return;\n            }\n\n            _.each(data, function (value) {\n                this.forEachRecursive(value, action, maxDepth);\n            }, this);\n\n            action(data);\n        },\n\n        /**\n         * Maps obj props/array elems recursively\n         *\n         * @param {Object|Array} data - Data to be iterated.\n         * @param {Function} action - Callback to transform each item.\n         * @param {Number} [maxDepth=7] - Max recursion depth.\n         *\n         * @returns {Object|Array}\n         */\n        mapRecursive: function (data, action, maxDepth) {\n            var newData;\n\n            maxDepth = typeof maxDepth === 'number' && !isNaN(maxDepth) ? maxDepth - 1 : 7;\n\n            if (!_.isFunction(action) || _.isFunction(data) || maxDepth < 0) {\n                return data;\n            }\n\n            if (!_.isObject(data)) {\n                return action(data);\n            }\n\n            if (_.isArray(data)) {\n                newData = _.map(data, function (item) {\n                    return this.mapRecursive(item, action, maxDepth);\n                }, this);\n\n                return action(newData);\n            }\n\n            newData = _.mapObject(data, function (val, key) {\n                if (data.hasOwnProperty(key)) {\n                    return this.mapRecursive(val, action, maxDepth);\n                }\n\n                return val;\n            }, this);\n\n            return action(newData);\n        },\n\n        /**\n         * Removes empty(in common sence) obj props/array elems\n         *\n         * @param {*} data - Data to be cleaned.\n         * @returns {*}\n         */\n        removeEmptyValues: function (data) {\n            if (!_.isObject(data)) {\n                return data;\n            }\n\n            if (_.isArray(data)) {\n                return data.filter(function (item) {\n                    return !this.isEmptyObj(item);\n                }, this);\n            }\n\n            return _.omit(data, this.isEmptyObj.bind(this));\n        },\n\n        /**\n         * Checks that argument of any type is empty in common sence:\n         * empty string, string with spaces only, object without own props, empty array, null or undefined\n         *\n         * @param {*} val - Value to be checked.\n         * @returns {Boolean}\n         */\n        isEmptyObj: function (val) {\n\n            return _.isObject(val) && _.isEmpty(val) ||\n            this.isEmpty(val) ||\n            val && val.trim && this.isEmpty(val.trim());\n        }\n    };\n});\n\n"}
}});
