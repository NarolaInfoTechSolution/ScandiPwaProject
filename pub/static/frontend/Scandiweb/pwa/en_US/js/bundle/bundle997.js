require.config({"config": {
        "jsbuild":{"mage/apply/main.js":"/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n\ndefine([\n    'underscore',\n    'jquery',\n    './scripts'\n], function (_, $, processScripts) {\n    'use strict';\n\n    var dataAttr = 'data-mage-init',\n        nodeSelector = '[' + dataAttr + ']';\n\n    /**\n     * Initializes components assigned to a specified element via data-* attribute.\n     *\n     * @param {HTMLElement} el - Element to initialize components with.\n     * @param {Object|String} config - Initial components' config.\n     * @param {String} component - Components' path.\n     */\n    function init(el, config, component) {\n        require([component], function (fn) {\n\n            if (typeof fn === 'object') {\n                fn = fn[component].bind(fn);\n            }\n\n            if (_.isFunction(fn)) {\n                fn(config, el);\n            } else if ($(el)[component]) {\n                $(el)[component](config);\n            }\n        }, function (error) {\n            if ('console' in window && typeof window.console.error === 'function') {\n                console.error(error);\n            }\n\n            return true;\n        });\n    }\n\n    /**\n     * Parses elements 'data-mage-init' attribute as a valid JSON data.\n     * Note: data-mage-init attribute will be removed.\n     *\n     * @param {HTMLElement} el - Element whose attribute should be parsed.\n     * @returns {Object}\n     */\n    function getData(el) {\n        var data = el.getAttribute(dataAttr);\n\n        el.removeAttribute(dataAttr);\n\n        return {\n            el: el,\n            data: JSON.parse(data)\n        };\n    }\n\n    return {\n        /**\n         * Initializes components assigned to HTML elements via [data-mage-init].\n         *\n         * @example Sample 'data-mage-init' declaration.\n         *      data-mage-init='{\"path/to/component\": {\"foo\": \"bar\"}}'\n         */\n        apply: function (context) {\n            var virtuals = processScripts(!context ? document : context),\n                nodes = document.querySelectorAll(nodeSelector);\n\n            _.toArray(nodes)\n                .map(getData)\n                .concat(virtuals)\n                .forEach(function (itemContainer) {\n                    var element = itemContainer.el;\n\n                    _.each(itemContainer.data, function (obj, key) {\n                            if (obj.mixins) {\n                                require(obj.mixins, function () { //eslint-disable-line max-nested-callbacks\n                                    var i, len;\n\n                                    for (i = 0, len = arguments.length; i < len; i++) {\n                                        $.extend(\n                                            true,\n                                            itemContainer.data[key],\n                                            arguments[i](itemContainer.data[key], element)\n                                        );\n                                    }\n\n                                    delete obj.mixins;\n                                    init.call(null, element, obj, key);\n                                });\n                            } else {\n                                init.call(null, element, obj, key);\n                            }\n\n                        }\n                    );\n\n                });\n        },\n        applyFor: init\n    };\n});\n"}
}});
