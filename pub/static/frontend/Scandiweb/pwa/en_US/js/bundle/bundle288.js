require.config({"config": {
        "jsbuild":{"Magento_Checkout/js/view/shipping-information/list.js":"/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n\ndefine([\n    'jquery',\n    'ko',\n    'mageUtils',\n    'uiComponent',\n    'uiLayout',\n    'Magento_Checkout/js/model/quote'\n], function ($, ko, utils, Component, layout, quote) {\n    'use strict';\n\n    var defaultRendererTemplate = {\n        parent: '${ $.$data.parentName }',\n        name: '${ $.$data.name }',\n        component: 'Magento_Checkout/js/view/shipping-information/address-renderer/default',\n        provider: 'checkoutProvider'\n    };\n\n    return Component.extend({\n        defaults: {\n            template: 'Magento_Checkout/shipping-information/list',\n            rendererTemplates: {}\n        },\n\n        /** @inheritdoc */\n        initialize: function () {\n            var self = this;\n\n            this._super()\n                .initChildren();\n\n            quote.shippingAddress.subscribe(function (address) {\n                self.createRendererComponent(address);\n            });\n\n            return this;\n        },\n\n        /** @inheritdoc */\n        initConfig: function () {\n            this._super();\n            // the list of child components that are responsible for address rendering\n            this.rendererComponents = {};\n\n            return this;\n        },\n\n        /** @inheritdoc */\n        initChildren: function () {\n            return this;\n        },\n\n        /**\n         * Create new component that will render given address in the address list\n         *\n         * @param {Object} address\n         */\n        createRendererComponent: function (address) {\n            var rendererTemplate, templateData, rendererComponent;\n\n            $.each(this.rendererComponents, function (index, component) {\n                component.visible(false);\n            });\n\n            if (this.rendererComponents[address.getType()]) {\n                this.rendererComponents[address.getType()].address(address);\n                this.rendererComponents[address.getType()].visible(true);\n            } else {\n                // rendererTemplates are provided via layout\n                rendererTemplate = address.getType() != undefined && this.rendererTemplates[address.getType()] != undefined ? //eslint-disable-line\n                    utils.extend({}, defaultRendererTemplate, this.rendererTemplates[address.getType()]) :\n                    defaultRendererTemplate;\n                templateData = {\n                    parentName: this.name,\n                    name: address.getType()\n                };\n\n                rendererComponent = utils.template(rendererTemplate, templateData);\n                utils.extend(\n                    rendererComponent,\n                    {\n                        address: ko.observable(address),\n                        visible: ko.observable(true)\n                    }\n                );\n                layout([rendererComponent]);\n                this.rendererComponents[address.getType()] = rendererComponent;\n            }\n        }\n    });\n});\n"}
}});