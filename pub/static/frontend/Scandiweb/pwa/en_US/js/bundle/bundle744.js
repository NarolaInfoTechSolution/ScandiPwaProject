require.config({"config": {
        "jsbuild":{"Magento_Ui/js/lib/registry/registry.js":"/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n\n/**\n * @api\n */\n/* global WeakMap */\ndefine([\n    'jquery',\n    'underscore',\n    'es6-collections'\n], function ($, _) {\n    'use strict';\n\n    var privateData = new WeakMap();\n\n    /**\n     * Extracts private item storage associated\n     * with a provided registry instance.\n     *\n     * @param {Object} container\n     * @returns {Object}\n     */\n    function getItems(container) {\n        return privateData.get(container).items;\n    }\n\n    /**\n     * Extracts private requests array associated\n     * with a provided registry instance.\n     *\n     * @param {Object} container\n     * @returns {Array}\n     */\n    function getRequests(container) {\n        return privateData.get(container).requests;\n    }\n\n    /**\n     * Wrapper function used for convenient access to the elements.\n     * See 'async' method for examples of usage and comparison\n     * with a regular 'get' method.\n     *\n     * @param {(String|Object|Function)} name - Key of the requested element.\n     * @param {Registry} registry - Instance of a registry\n     *      where to search for the element.\n     * @param {(Function|String)} [method] - Optional callback function\n     *      or a name of the elements' method which\n     *      will be invoked when element is available in registry.\n     * @returns {*}\n     */\n    function async(name, registry, method) {\n        var args = _.toArray(arguments).slice(3);\n\n        if (_.isString(method)) {\n            registry.get(name, function (component) {\n                component[method].apply(component, args);\n            });\n        } else if (_.isFunction(method)) {\n            registry.get(name, method);\n        } else if (!args.length) {\n            return registry.get(name);\n        }\n    }\n\n    /**\n     * Checks that every property of the query object\n     * is present and equal to the corresponding\n     * property in target object.\n     * Note that non-strict comparison is used.\n     *\n     * @param {Object} query - Query object.\n     * @param {Object} target - Target object.\n     * @returns {Boolean}\n     */\n    function compare(query, target) {\n        var matches = true,\n            index,\n            keys,\n            key;\n\n        if (!_.isObject(query) || !_.isObject(target)) {\n            return false;\n        }\n\n        keys = Object.getOwnPropertyNames(query);\n        index = keys.length;\n\n        while (matches && index--) {\n            key = keys[index];\n\n            /* eslint-disable eqeqeq */\n            if (target[key] != query[key]) {\n                matches = false;\n            }\n\n            /* eslint-enable eqeqeq */\n        }\n\n        return matches;\n    }\n\n    /**\n     * Explodes incoming string into object if\n     * string is defined as a set of key = value pairs.\n     *\n     * @param {(String|*)} query - String to be processed.\n     * @returns {Object|*} Either created object or an unmodified incoming\n     *      value if conversion was not possible.\n     * @example Sample conversions.\n     *      'key = value, key2 = value2'\n     *      => {key: 'value', key2: 'value2'}\n     */\n    function explode(query) {\n        var result = {},\n            index,\n            data;\n\n        if (typeof query !== 'string' || !~query.indexOf('=')) {\n            return query;\n        }\n\n        query = query.split(',');\n        index = query.length;\n\n        while (index--) {\n            data = query[index].split('=');\n\n            result[data[0].trim()] = data[1].trim();\n        }\n\n        return result;\n    }\n\n    /**\n     * Extracts items from the provided data object\n     * which matches specified search criteria.\n     *\n     * @param {Object} data - Data object where to perform a lookup.\n     * @param {(String|Object|Function)} query - Search criteria.\n     * @param {Boolean} findAll - Flag that defines whether to\n     *      search for all applicable items or to stop on a first found entry.\n     * @returns {Array|Object|*}\n     */\n    function find(data, query, findAll) {\n        var iterator,\n            item;\n\n        query = explode(query);\n\n        if (typeof query === 'string') {\n            item = data[query];\n\n            if (findAll) {\n                return item ? [item] : [];\n            }\n\n            return item;\n        }\n\n        iterator = !_.isFunction(query) ?\n            compare.bind(null, query) :\n            query;\n\n        return findAll ?\n            _.filter(data, iterator) :\n            _.find(data, iterator);\n    }\n\n    /**\n     * @constructor\n     */\n    function Registry() {\n        var data = {\n            items: {},\n            requests: []\n        };\n\n        this._updateRequests = _.debounce(this._updateRequests.bind(this), 10);\n        privateData.set(this, data);\n    }\n\n    Registry.prototype = {\n        constructor: Registry,\n\n        /**\n         * Retrieves item from registry which matches specified search criteria.\n         *\n         * @param {(Object|String|Function|Array)} query - Search condition (see examples).\n         * @param {Function} [callback] - Callback that will be invoked when\n         *      all of the requested items are available.\n         * @returns {*}\n         *\n         * @example Requesting item by it's name.\n         *      var obj = {index: 'test', sample: true};\n         *\n         *      registry.set('first', obj);\n         *      registry.get('first') === obj;\n         *      => true\n         *\n         * @example Requesting item with a specific properties.\n         *      registry.get('sample = 1, index = test') === obj;\n         *      => true\n         *      registry.get('sample = 0, index = foo') === obj;\n         *      => false\n         *\n         * @example Declaring search criteria as an object.\n         *      registry.get({sample: true}) === obj;\n         *      => true;\n         *\n         * @example Providing custom search handler.\n         *      registry.get(function (item) { return item.sample === true; }) === obj;\n         *      => true\n         *\n         * @example Sample asynchronous request declaration.\n         *      registry.get('index = test', function (item) {});\n         *\n         * @example Requesting multiple elements.\n         *      registry.set('second', {index: 'test2'});\n         *      registry.get(['first', 'second'], function (first, second) {});\n         */\n        get: function (query, callback) {\n            if (typeof callback !== 'function') {\n                return find(getItems(this), query);\n            }\n\n            this._addRequest(query, callback);\n        },\n\n        /**\n         * Sets provided item to the registry.\n         *\n         * @param {String} id - Item's identifier.\n         * @param {*} item - Item's data.\n         * returns {Registry} Chainable.\n         */\n        set: function (id, item) {\n            getItems(this)[id] = item;\n\n            this._updateRequests();\n\n            return this;\n        },\n\n        /**\n         * Removes specified item from registry.\n         * Note that search query is not applicable.\n         *\n         * @param {String} id - Item's identifier.\n         * @returns {Registry} Chainable.\n         */\n        remove: function (id) {\n            delete getItems(this)[id];\n\n            return this;\n        },\n\n        /**\n         * Retrieves a collection of elements that match\n         * provided search criteria.\n         *\n         * @param {(Object|String|Function)} query - Search query.\n         *      See 'get' method for the syntax examples.\n         * @returns {Array} Found elements.\n         */\n        filter: function (query) {\n            return find(getItems(this), query, true);\n        },\n\n        /**\n         * Checks that at least one element in collection\n         * matches provided search criteria.\n         *\n         * @param {(Object|String|Function)} query - Search query.\n         *      See 'get' method for the syntax examples.\n         * @returns {Boolean}\n         */\n        has: function (query) {\n            return !!this.get(query);\n        },\n\n        /**\n         * Checks that registry contains a provided item.\n         *\n         * @param {*} item - Item to be checked.\n         * @returns {Boolean}\n         */\n        contains: function (item) {\n            return _.contains(getItems(this), item);\n        },\n\n        /**\n         * Extracts identifier of an item if it's present in registry.\n         *\n         * @param {*} item - Item whose identifier will be extracted.\n         * @returns {String|Undefined}\n         */\n        indexOf: function (item) {\n            return _.findKey(getItems(this), function (elem) {\n                return item === elem;\n            });\n        },\n\n        /**\n         * Same as a 'get' method except that it returns\n         * a promise object instead of invoking provided callback.\n         *\n         * @param {(String|Function|Object|Array)} query - Search query.\n         *      See 'get' method for the syntax examples.\n         * @returns {jQueryPromise}\n         */\n        promise: function (query) {\n            var defer    = $.Deferred(),\n                callback = defer.resolve.bind(defer);\n\n            this.get(query, callback);\n\n            return defer.promise();\n        },\n\n        /**\n         * Creates a wrapper function over the provided search query\n         * in order to provide somehow more convenient access to the\n         * registry's items.\n         *\n         * @param {(String|Object|Function)} query - Search criteria.\n         *      See 'get' method for the syntax examples.\n         * @returns {Function}\n         *\n         * @example Comparison with a 'get' method on retrieving items.\n         *      var module = registry.async('name');\n         *\n         *      module();\n         *      => registry.get('name');\n         *\n         * @example Asynchronous request.\n         *      module(function (component) {});\n         *      => registry.get('name', function (component) {});\n         *\n         * @example Requesting item and invoking it's method with specified parameters.\n         *      module('trigger', true);\n         *      => registry.get('name', function (component) {\n         *          component.trigger(true);\n         *      });\n         */\n        async: function (query) {\n            return async.bind(null, query, this);\n        },\n\n        /**\n         * Creates new instance of a Registry.\n         *\n         * @returns {Registry} New instance.\n         */\n        create: function () {\n            return new Registry;\n        },\n\n        /**\n         * Adds new request to the queue or resolves it immediately\n         * if all of the required items are available.\n         *\n         * @private\n         * @param {(Object|String|Function|Array)} queries - Search criteria.\n         *      See 'get' method for the syntax examples.\n         * @param {Function} callback - Callback that will be invoked when\n         *      all of the requested items are available.\n         * @returns {Registry}\n         */\n        _addRequest: function (queries, callback) {\n            var request;\n\n            if (!Array.isArray(queries)) {\n                queries = queries ? [queries] : [];\n            }\n\n            request = {\n                queries: queries.map(explode),\n                callback: callback\n            };\n\n            this._canResolve(request) ?\n                this._resolveRequest(request) :\n                getRequests(this).push(request);\n\n            return this;\n        },\n\n        /**\n         * Updates requests list resolving applicable items.\n         *\n         * @private\n         * @returns {Registry} Chainable.\n         */\n        _updateRequests: function () {\n            getRequests(this)\n                .filter(this._canResolve, this)\n                .forEach(this._resolveRequest, this);\n\n            return this;\n        },\n\n        /**\n         * Resolves provided request invoking it's callback\n         * with items specified in query parameters.\n         *\n         * @private\n         * @param {Object} request - Request object.\n         * @returns {Registry} Chainable.\n         */\n        _resolveRequest: function (request) {\n            var requests = getRequests(this),\n                items    = request.queries.map(this.get, this),\n                index    = requests.indexOf(request);\n\n            request.callback.apply(null, items);\n\n            if (~index) {\n                requests.splice(index, 1);\n            }\n\n            return this;\n        },\n\n        /**\n         * Checks if provided request can be resolved.\n         *\n         * @private\n         * @param {Object} request - Request object.\n         * @returns {Boolean}\n         */\n        _canResolve: function (request) {\n            var queries = request.queries;\n\n            return queries.every(this.has, this);\n        }\n    };\n\n    return new Registry;\n});\n"}
}});