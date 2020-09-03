require.config({"config": {
        "jsbuild":{"Magento_Catalog/js/product/storage/data-storage.js":"/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\ndefine([\n    'jquery',\n    'underscore',\n    'ko',\n    'mageUtils',\n    'Magento_Catalog/js/product/query-builder',\n    'Magento_Customer/js/customer-data',\n    'jquery/jquery-storageapi'\n], function ($, _, ko, utils, queryBuilder, customerData) {\n    'use strict';\n\n    /**\n     * Process data from API request\n     *\n     * @param {Object} data\n     * @returns {Object}\n     */\n    function getParsedDataFromServer(data) {\n        var result = {};\n\n        _.each(data.items, function (item) {\n                if (item.id) {\n                    result[item.id] = item;\n                }\n            }\n        );\n\n        return {\n            items: result\n        };\n    }\n\n    /**\n     * Set data to localStorage with support check.\n     *\n     * @param {String} namespace\n     * @param {Object} data\n     */\n    function setLocalStorageItem(namespace, data) {\n        try {\n            window.localStorage.setItem(namespace, JSON.stringify(data));\n        } catch (e) {\n            console.warn('localStorage is unavailable - skipping local caching of product data');\n            console.error(e);\n        }\n    }\n\n    return {\n\n        /**\n         * Class name\n         */\n        name: 'DataStorage',\n        request: {},\n        customerDataProvider: 'product_data_storage',\n\n        /**\n         * Initialize class\n         *\n         * @return Chainable.\n         */\n        initialize: function () {\n            if (!this.data) {\n                this.data = ko.observable({});\n            }\n\n            this.initLocalStorage()\n                .initCustomerDataReloadListener()\n                .cachesDataFromLocalStorage()\n                .initDataListener()\n                .initProvideStorage()\n                .initProviderListener();\n\n            return this;\n        },\n\n        /**\n         * Initialize listener to customer data reload\n         *\n         * @return Chainable.\n         */\n        initCustomerDataReloadListener: function () {\n            $(document).on('customer-data-invalidate', this._flushProductStorage.bind(this));\n\n            return this;\n        },\n\n        /**\n         * Flush product storage\n         *\n         * @private\n         * @return void\n         */\n        _flushProductStorage: function (event, sections) {\n            if (_.isEmpty(sections) || _.contains(sections, 'product_data_storage')) {\n                this.localStorage.removeAll();\n            }\n        },\n\n        /**\n         * Initialize listener to data property\n         *\n         * @return Chainable.\n         */\n        initDataListener: function () {\n            this.data.subscribe(this.dataHandler.bind(this));\n\n            return this;\n        },\n\n        /**\n         * Initialize provider storage\n         *\n         * @return Chainable.\n         */\n        initProvideStorage: function () {\n            this.providerHandler(customerData.get(this.customerDataProvider)());\n\n            return this;\n        },\n\n        /**\n         * Handler to update \"data\" property.\n         * Sets data to localStorage\n         *\n         * @param {Object} data\n         */\n        dataHandler: function (data) {\n            if (_.isEmpty(data)) {\n                this.localStorage.removeAll();\n            } else {\n                setLocalStorageItem(this.namespace, data);\n            }\n        },\n\n        /**\n         * Handler to update data in provider.\n         *\n         * @param {Object} data\n         */\n        providerHandler: function (data) {\n            var currentData = utils.copy(this.data()),\n                ids = _.keys(data.items);\n\n            if (data.items && ids.length) {\n                //we can extend only items\n                data = data.items;\n                this.data(_.extend(data, currentData));\n            }\n        },\n\n        /**\n         * Sets data ids\n         *\n         * @param {String} currency\n         * @param {String} store\n         * @param {Object} ids\n         */\n        setIds: function (currency, store, ids) {\n            if (!this.hasInCache(currency, store, ids)) {\n                this.loadDataFromServer(currency, store, ids);\n            } else {\n                this.data.valueHasMutated();\n            }\n        },\n\n        /**\n         * Gets data from \"data\" property by identifiers\n         *\n         * @param {String} currency\n         * @param {String} store\n         * @param {Object} productIdentifiers\n         *\n         * @return {Object} data.\n         */\n        getDataByIdentifiers: function (currency, store, productIdentifiers) {\n            var data = {},\n                dataCollection = this.data(),\n                id;\n\n            for (id in productIdentifiers) {\n                if (productIdentifiers.hasOwnProperty(id)) {\n                    data[id] = dataCollection[id];\n                }\n            }\n\n            return data;\n        },\n\n        /**\n         * Checks has cached data or not\n         *\n         * @param {String} currency\n         * @param {String} store\n         * @param {Object} ids\n         *\n         * @return {Boolean}\n         */\n        hasInCache: function (currency, store, ids) {\n            var data = this.data(),\n                id;\n\n            for (id in ids) {\n                if (!data.hasOwnProperty(id) ||\n                    data[id]['currency_code'] !== currency ||\n                    ~~data[id]['store_id'] !== ~~store\n                ) {\n                    return false;\n                }\n            }\n\n            return true;\n        },\n\n        /**\n         * Load data from server by ids\n         *\n         * @param {String} currency\n         * @param {String} store\n         * @param {Object} ids\n         *\n         * @return void\n         */\n        loadDataFromServer: function (currency, store, ids) {\n            var idsArray = _.keys(ids),\n                prepareAjaxParams = {\n                    'entity_id': idsArray.join(',')\n                };\n\n            if (this.request.sent && this.hasIdsInSentRequest(ids)) {\n                return;\n            }\n\n            this.request = {\n                sent: true,\n                data: ids\n            };\n\n            this.updateRequestConfig.data = queryBuilder.buildQuery(prepareAjaxParams);\n            this.updateRequestConfig.data['store_id'] = store;\n            this.updateRequestConfig.data['currency_code'] = currency;\n            $.ajax(this.updateRequestConfig).done(function (data) {\n                this.request = {};\n                this.providerHandler(getParsedDataFromServer(data));\n            }.bind(this));\n        },\n\n        /**\n         * Each product page consist product cache data,\n         * this function prepare those data to appropriate view, and save it\n         *\n         * @param {Object} data\n         */\n        addDataFromPageCache: function (data) {\n            this.providerHandler(getParsedDataFromServer(data));\n        },\n\n        /**\n         * @param {Object} ids\n         * @returns {Boolean}\n         */\n        hasIdsInSentRequest: function (ids) {\n            var sentDataIds,\n                currentDataIds;\n\n            if (this.request.data) {\n                sentDataIds = _.keys(this.request.data);\n                currentDataIds = _.keys(ids);\n\n                _.each(currentDataIds, function (id) {\n                    if (_.lastIndexOf(sentDataIds, id) === -1) {\n                        return false;\n                    }\n                });\n\n                return true;\n            }\n\n            return false;\n        },\n\n        /**\n         * Initialize provider listener\n         *\n         * @return Chainable.\n         */\n        initProviderListener: function () {\n            customerData.get(this.customerDataProvider).subscribe(this.providerHandler.bind(this));\n\n            return this;\n        },\n\n        /**\n         * Caches data from local storage to local scope\n         *\n         * @return Chainable.\n         */\n        cachesDataFromLocalStorage: function () {\n            this.data(this.getDataFromLocalStorage());\n\n            return this;\n        },\n\n        /**\n         * Gets data from local storage by current namespace\n         *\n         * @return {Object}.\n         */\n        getDataFromLocalStorage: function () {\n            return this.localStorage.get();\n        },\n\n        /**\n         * Initialize localStorage\n         *\n         * @return Chainable.\n         */\n        initLocalStorage: function () {\n            this.localStorage = $.initNamespaceStorage(this.namespace).localStorage;\n\n            return this;\n        }\n    };\n});\n"}
}});
