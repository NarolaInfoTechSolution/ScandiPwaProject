require.config({"config": {
        "jsbuild":{"Magento_Ui/js/form/element/single-checkbox.js":"/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n\n/**\n * @api\n */\ndefine([\n    'Magento_Ui/js/form/element/abstract',\n    'underscore',\n    'mage/translate'\n], function (AbstractField, _, $t) {\n    'use strict';\n\n    return AbstractField.extend({\n        defaults: {\n            template: 'ui/form/components/single/field',\n            checked: false,\n            initialChecked: false,\n            multiple: false,\n            prefer: 'checkbox', // 'radio' | 'checkbox' | 'toggle'\n            valueMap: {},\n\n            templates: {\n                radio: 'ui/form/components/single/radio',\n                checkbox: 'ui/form/components/single/checkbox',\n                toggle: 'ui/form/components/single/switcher'\n            },\n\n            listens: {\n                'checked': 'onCheckedChanged',\n                'value': 'onExtendedValueChanged'\n            }\n        },\n\n        /**\n         * @inheritdoc\n         */\n        initConfig: function (config) {\n            this._super();\n\n            if (!config.elementTmpl) {\n                if (!this.prefer && !this.multiple) {\n                    this.elementTmpl = this.templates.radio;\n                } else if (this.prefer === 'radio') {\n                    this.elementTmpl = this.templates.radio;\n                } else if (this.prefer === 'checkbox') {\n                    this.elementTmpl = this.templates.checkbox;\n                } else if (this.prefer === 'toggle') {\n                    this.elementTmpl = this.templates.toggle;\n                } else {\n                    this.elementTmpl = this.templates.checkbox;\n                }\n            }\n\n            if (this.prefer === 'toggle' && _.isEmpty(this.toggleLabels)) {\n                this.toggleLabels = {\n                    'on': $t('Yes'),\n                    'off': $t('No')\n                };\n            }\n\n            if (typeof this.default === 'undefined' || this.default === null) {\n                this.default = '';\n            }\n\n            if (typeof this.value === 'undefined' || this.value === null) {\n                this.value = _.isEmpty(this.valueMap) || this.default !== '' ? this.default : this.valueMap.false;\n                this.initialValue = this.value;\n            } else {\n                this.initialValue = this.value;\n            }\n\n            if (this.multiple && !_.isArray(this.value)) {\n                this.value = []; // needed for correct observable assignment\n            }\n\n            this.initialChecked = this.checked;\n\n            return this;\n        },\n\n        /**\n         * @inheritdoc\n         */\n        initObservable: function () {\n            return this\n                ._super()\n                .observe('checked');\n        },\n\n        /**\n         * Get true/false key from valueMap by value.\n         *\n         * @param {*} value\n         * @returns {Boolean|undefined}\n         */\n        getReverseValueMap: function getReverseValueMap(value) {\n            var bool = false;\n\n            _.some(this.valueMap, function (iValue, iBool) {\n                if (iValue === value) {\n                    bool = iBool === 'true';\n\n                    return true;\n                }\n            });\n\n            return bool;\n        },\n\n        /**\n         * @inheritdoc\n         */\n        setInitialValue: function () {\n            if (_.isEmpty(this.valueMap)) {\n                this.on('value', this.onUpdate.bind(this));\n            } else {\n                this._super();\n                this.checked(this.getReverseValueMap(this.value()));\n            }\n\n            return this;\n        },\n\n        /**\n         * Handle dataScope changes for checkbox / radio button.\n         *\n         * @param {*} newExportedValue\n         */\n        onExtendedValueChanged: function (newExportedValue) {\n            var isMappedUsed = !_.isEmpty(this.valueMap),\n                oldChecked = this.checked.peek(),\n                oldValue = this.initialValue,\n                newChecked;\n\n            if (this.multiple) {\n                newChecked = newExportedValue.indexOf(oldValue) !== -1;\n            } else if (isMappedUsed) {\n                newChecked = this.getReverseValueMap(newExportedValue);\n            } else if (typeof newExportedValue === 'boolean') {\n                newChecked = newExportedValue;\n            } else {\n                newChecked = newExportedValue === oldValue;\n            }\n\n            if (newChecked !== oldChecked) {\n                this.checked(newChecked);\n            }\n        },\n\n        /**\n         * Handle checked state changes for checkbox / radio button.\n         *\n         * @param {Boolean} newChecked\n         */\n        onCheckedChanged: function (newChecked) {\n            var isMappedUsed = !_.isEmpty(this.valueMap),\n                oldValue = this.initialValue,\n                newValue;\n\n            if (isMappedUsed) {\n                newValue = this.valueMap[newChecked];\n            } else {\n                newValue = oldValue;\n            }\n\n            if (!this.multiple && newChecked) {\n                this.value(newValue);\n            } else if (!this.multiple && !newChecked) {\n                if (typeof newValue === 'boolean') {\n                    this.value(newChecked);\n                } else if (newValue === this.value.peek()) {\n                    this.value('');\n                }\n\n                if (isMappedUsed) {\n                    this.value(newValue);\n                }\n            } else if (this.multiple && newChecked && this.value.indexOf(newValue) === -1) {\n                this.value.push(newValue);\n            } else if (this.multiple && !newChecked && this.value.indexOf(newValue) !== -1) {\n                this.value.splice(this.value.indexOf(newValue), 1);\n            }\n        },\n\n        /**\n         * @inheritdoc\n         */\n        onUpdate: function () {\n            if (this.hasUnique) {\n                this.setUnique();\n            }\n\n            return this._super();\n        },\n\n        /**\n         * @inheritdoc\n         */\n        reset: function () {\n            if (this.multiple && this.initialChecked) {\n                this.value.push(this.initialValue);\n            } else if (this.multiple && !this.initialChecked) {\n                this.value.splice(this.value.indexOf(this.initialValue), 1);\n            } else {\n                this.value(this.initialValue);\n            }\n\n            this.error(false);\n\n            return this;\n        },\n\n        /**\n         * @inheritdoc\n         */\n        clear: function () {\n            if (this.multiple) {\n                this.value([]);\n            } else {\n                this.value('');\n            }\n\n            this.error(false);\n\n            return this;\n        }\n    });\n});\n"}
}});