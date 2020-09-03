require.config({"config": {
        "jsbuild":{"mage/adminhtml/wysiwyg/tiny_mce/plugins/magentovariable/editor_plugin.js":"/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n\n/* global tinymce, MagentovariablePlugin, varienGlobalEvents, Base64 */\n/* eslint-disable strict */\ndefine([\n    'Magento_Variable/js/config-directive-generator',\n    'Magento_Variable/js/custom-directive-generator',\n    'wysiwygAdapter',\n    'jquery',\n    'mage/adminhtml/tools'\n], function (configDirectiveGenerator, customDirectiveGenerator, wysiwyg, jQuery) {\n    return function (config) {\n        tinymce.create('tinymce.plugins.magentovariable', {\n\n            /**\n             * Initialize editor plugin.\n             *\n             * @param {tinymce.editor} editor - Editor instance that the plugin is initialized in.\n             * @param {String} url - Absolute URL to where the plugin is located.\n             */\n            init: function (editor, url) {\n                var self = this;\n\n                /**\n                 * Add new command to open variables selector slideout.\n                 */\n                editor.addCommand('openVariablesSlideout', function (commandConfig) {\n                    var selectedElement;\n\n                    if (commandConfig) {\n                        selectedElement = commandConfig.selectedElement;\n                    } else {\n                        selectedElement = tinymce.activeEditor.selection.getNode();\n                    }\n                    MagentovariablePlugin.setEditor(editor);\n                    MagentovariablePlugin.loadChooser(\n                        config.url,\n                        wysiwyg.getId(),\n                        selectedElement\n                    );\n                });\n\n                /**\n                 * Add button to the editor toolbar.\n                 */\n                editor.addButton('magentovariable', {\n                    title: jQuery.mage.__('Insert Variable'),\n                    tooltip: jQuery.mage.__('Insert Variable'),\n                    cmd: 'openVariablesSlideout',\n                    image: url + '/img/icon.png',\n\n                    /**\n                     * Highlight or dismiss Insert Variable button when variable is selected or deselected.\n                     */\n                    onPostRender: function () {\n                        var _this = this,\n\n                        /**\n                         * Toggle active state of Insert Variable button.\n                         *\n                         * @param {Object} e\n                         */\n                        toggleVariableButton = function (e) {\n                            _this.active(false);\n\n                            if (jQuery(e.target).hasClass('magento-variable')) {\n                                _this.active(true);\n                            }\n                        };\n\n                        editor.on('click', toggleVariableButton);\n                        editor.on('change', toggleVariableButton);\n                    }\n                });\n\n                /**\n                 * Double click handler on the editor to handle dbl click on variable placeholder.\n                 */\n                editor.on('dblclick', function (evt) {\n                    if (jQuery(evt.target).hasClass('magento-variable')) {\n                        editor.selection.collapse(false);\n                        editor.execCommand('openVariablesSlideout', {\n                            ui: true,\n                            selectedElement: evt.target\n                        });\n                    }\n                });\n\n                /**\n                 * Attach event handler for when wysiwyg editor is about to encode its content\n                 */\n                varienGlobalEvents.attachEventHandler('wysiwygEncodeContent', function (content) {\n                    content = self.encodeVariables(content);\n\n                    return content;\n                });\n\n                /**\n                 * Attach event handler for when wysiwyg editor is about to decode its content\n                 */\n                varienGlobalEvents.attachEventHandler('wysiwygDecodeContent', function (content) {\n                    content = self.decodeVariables(content);\n\n                    return content;\n                });\n            },\n\n            /**\n             * Encode variables in content\n             *\n             * @param {String} content\n             * @returns {*}\n             */\n            encodeVariables: function (content) {\n                content = content.gsub(/\\{\\{config path=\\\"([^\\\"]+)\\\"\\}\\}/i, function (match) {\n                    var path = match[1],\n                        magentoVariables,\n                        imageHtml;\n\n                    magentoVariables = JSON.parse(config.placeholders);\n\n                    if (magentoVariables[match[1]] && magentoVariables[match[1]]['variable_type'] === 'default') {\n                        imageHtml = '<span id=\"%id\" class=\"magento-variable magento-placeholder mceNonEditable\">' +\n                            '%s</span>';\n                        imageHtml = imageHtml.replace('%s', magentoVariables[match[1]]['variable_name']);\n                    } else {\n                        imageHtml = '<span id=\"%id\" class=\"' +\n                            'magento-variable magento-placeholder magento-placeholder-error ' +\n                            'mceNonEditable' +\n                            '\">' +\n                            'Not found' +\n                            '</span>';\n                    }\n\n                    return imageHtml.replace('%id', Base64.idEncode(path));\n                });\n\n                content = content.gsub(/\\{\\{customVar code=([^\\}\\\"]+)\\}\\}/i, function (match) {\n                    var path = match[1],\n                        magentoVariables,\n                        imageHtml;\n\n                    magentoVariables = JSON.parse(config.placeholders);\n\n                    if (magentoVariables[match[1]] && magentoVariables[match[1]]['variable_type'] === 'custom') {\n                        imageHtml = '<span id=\"%id\" class=\"magento-variable magento-custom-var magento-placeholder ' +\n                            'mceNonEditable\">%s</span>';\n                        imageHtml = imageHtml.replace('%s', magentoVariables[match[1]]['variable_name']);\n                    } else {\n                        imageHtml = '<span id=\"%id\" class=\"' +\n                            'magento-variable magento-custom-var magento-placeholder ' +\n                            'magento-placeholder-error mceNonEditable' +\n                            '\">' +\n                            match[1] +\n                            '</span>';\n                    }\n\n                    return imageHtml.replace('%id', Base64.idEncode(path));\n                });\n\n                return content;\n            },\n\n            /**\n             * Decode variables in content.\n             *\n             * @param {String} content\n             * @returns {String}\n             */\n            decodeVariables: function (content) {\n                var doc = (new DOMParser()).parseFromString(content.replace(/&quot;/g, '&amp;quot;'), 'text/html'),\n                    returnval = '';\n\n                [].forEach.call(doc.querySelectorAll('span.magento-variable'), function (el) {\n                    var $el = jQuery(el);\n\n                    if ($el.hasClass('magento-custom-var')) {\n                        $el.replaceWith(\n                            customDirectiveGenerator.processConfig(\n                                Base64.idDecode(\n                                    $el.attr('id')\n                                )\n                            )\n                        );\n                    } else {\n                        $el.replaceWith(\n                            configDirectiveGenerator.processConfig(\n                                Base64.idDecode(\n                                    $el.attr('id')\n                                )\n                            )\n                        );\n                    }\n                });\n\n                returnval += doc.head ? doc.head.innerHTML.replace(/&amp;quot;/g, '&quot;') : '';\n                returnval += doc.body ? doc.body.innerHTML.replace(/&amp;quot;/g, '&quot;') : '';\n\n                return returnval ? returnval : content;\n            },\n\n            /**\n             * @return {Object}\n             */\n            getInfo: function () {\n                return {\n                    longname: 'Magento Variable Manager Plugin',\n                    author: 'Magento Core Team',\n                    authorurl: 'http://magentocommerce.com',\n                    infourl: 'http://magentocommerce.com',\n                    version: '1.0'\n                };\n            }\n        });\n\n        /**\n         * Register plugin\n         */\n        tinymce.PluginManager.add('magentovariable', tinymce.plugins.magentovariable);\n    };\n});\n"}
}});