require.config({"config": {
        "jsbuild":{"Magento_PageCache/js/page-cache.js":"/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n\ndefine([\n    'jquery',\n    'domReady',\n    'consoleLogger',\n    'jquery-ui-modules/widget',\n    'mage/cookies'\n], function ($, domReady, consoleLogger) {\n    'use strict';\n\n    /**\n     * Helper. Generate random string\n     * TODO: Merge with mage/utils\n     * @param {String} chars - list of symbols\n     * @param {Number} length - length for need string\n     * @returns {String}\n     */\n    function generateRandomString(chars, length) {\n        var result = '';\n\n        length = length > 0 ? length : 1;\n\n        while (length--) {\n            result += chars[Math.round(Math.random() * (chars.length - 1))];\n        }\n\n        return result;\n    }\n\n    /**\n     * Nodes tree to flat list converter\n     * @returns {Array}\n     */\n    $.fn.comments = function () {\n        var elements = [],\n            contents,\n            elementContents;\n\n        /**\n         * @param {jQuery} element - Comment holder\n         */\n        (function lookup(element) {\n            var iframeHostName;\n\n            // prevent cross origin iframe content reading\n            if ($(element).prop('tagName') === 'IFRAME') {\n                iframeHostName = $('<a>').prop('href', $(element).prop('src'))\n                    .prop('hostname');\n\n                if (window.location.hostname !== iframeHostName) {\n                    return [];\n                }\n            }\n\n            /**\n             * Rewrite jQuery contents().\n             *\n             * @param {jQuery} elem\n             */\n            contents = function (elem) {\n                return $.map(elem, function (el) {\n                    try {\n                        return $.nodeName(el, 'iframe') ?\n                            el.contentDocument || (el.contentWindow ? el.contentWindow.document : []) :\n                            $.merge([], el.childNodes);\n                    } catch (e) {\n                        consoleLogger.error(e);\n\n                        return [];\n                    }\n                });\n            };\n\n            elementContents = contents($(element));\n\n            $.each(elementContents, function (index, el) {\n                switch (el.nodeType) {\n                    case 1: // ELEMENT_NODE\n                        lookup(el);\n                        break;\n\n                    case 8: // COMMENT_NODE\n                        elements.push(el);\n                        break;\n\n                    case 9: // DOCUMENT_NODE\n                        lookup($(el).find('body'));\n                        break;\n                }\n            });\n        })(this);\n\n        return elements;\n    };\n\n    /**\n     * FormKey Widget - this widget is generating from key, saves it to cookie and\n     */\n    $.widget('mage.formKey', {\n        options: {\n            inputSelector: 'input[name=\"form_key\"]',\n            allowedCharacters: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',\n            length: 16\n        },\n\n        /**\n         * Creates widget 'mage.formKey'\n         * @private\n         */\n        _create: function () {\n            var formKey = $.mage.cookies.get('form_key'),\n                options = {\n                    secure: window.cookiesConfig ? window.cookiesConfig.secure : false\n                };\n\n            if (!formKey) {\n                formKey = generateRandomString(this.options.allowedCharacters, this.options.length);\n                $.mage.cookies.set('form_key', formKey, options);\n            }\n            $(this.options.inputSelector).val(formKey);\n        }\n    });\n\n    /**\n     * PageCache Widget\n     * Handles additional ajax request for rendering user private content.\n     */\n    $.widget('mage.pageCache', {\n        options: {\n            url: '/',\n            patternPlaceholderOpen: /^ BLOCK (.+) $/,\n            patternPlaceholderClose: /^ \\/BLOCK (.+) $/,\n            versionCookieName: 'private_content_version',\n            handles: []\n        },\n\n        /**\n         * Creates widget 'mage.pageCache'\n         * @private\n         */\n        _create: function () {\n            var placeholders,\n                version = $.mage.cookies.get(this.options.versionCookieName);\n\n            if (!version) {\n                return;\n            }\n            placeholders = this._searchPlaceholders(this.element.comments());\n\n            if (placeholders && placeholders.length) {\n                this._ajax(placeholders, version);\n            }\n        },\n\n        /**\n         * Parse page for placeholders.\n         * @param {Array} elements\n         * @returns {Array}\n         * @private\n         */\n        _searchPlaceholders: function (elements) {\n            var placeholders = [],\n                tmp = {},\n                ii,\n                len,\n                el, matches, name;\n\n            if (!(elements && elements.length)) {\n                return placeholders;\n            }\n\n            for (ii = 0, len = elements.length; ii < len; ii++) {\n                el = elements[ii];\n                matches = this.options.patternPlaceholderOpen.exec(el.nodeValue);\n                name = null;\n\n                if (matches) {\n                    name = matches[1];\n                    tmp[name] = {\n                        name: name,\n                        openElement: el\n                    };\n                } else {\n                    matches = this.options.patternPlaceholderClose.exec(el.nodeValue);\n\n                    if (matches) { //eslint-disable-line max-depth\n                        name = matches[1];\n\n                        if (tmp[name]) { //eslint-disable-line max-depth\n                            tmp[name].closeElement = el;\n                            placeholders.push(tmp[name]);\n                            delete tmp[name];\n                        }\n                    }\n                }\n            }\n\n            return placeholders;\n        },\n\n        /**\n         * Parse for page and replace placeholders\n         * @param {Object} placeholder\n         * @param {Object} html\n         * @protected\n         */\n        _replacePlaceholder: function (placeholder, html) {\n            var startReplacing = false,\n                prevSibling = null,\n                parent, contents, yy, len, element;\n\n            if (!placeholder || !html) {\n                return;\n            }\n\n            parent = $(placeholder.openElement).parent();\n            contents = parent.contents();\n\n            for (yy = 0, len = contents.length; yy < len; yy++) {\n                element = contents[yy];\n\n                if (element == placeholder.openElement) { //eslint-disable-line eqeqeq\n                    startReplacing = true;\n                }\n\n                if (startReplacing) {\n                    $(element).remove();\n                } else if (element.nodeType != 8) { //eslint-disable-line eqeqeq\n                    //due to comment tag doesn't have siblings we try to find it manually\n                    prevSibling = element;\n                }\n\n                if (element == placeholder.closeElement) { //eslint-disable-line eqeqeq\n                    break;\n                }\n            }\n\n            if (prevSibling) {\n                $(prevSibling).after(html);\n            } else {\n                $(parent).prepend(html);\n            }\n\n            // trigger event to use mage-data-init attribute\n            $(parent).trigger('contentUpdated');\n        },\n\n        /**\n         * AJAX helper\n         * @param {Object} placeholders\n         * @param {String} version\n         * @private\n         */\n        _ajax: function (placeholders, version) {\n            var ii,\n                data = {\n                    blocks: [],\n                    handles: this.options.handles,\n                    originalRequest: this.options.originalRequest,\n                    version: version\n                };\n\n            for (ii = 0; ii < placeholders.length; ii++) {\n                data.blocks.push(placeholders[ii].name);\n            }\n            data.blocks = JSON.stringify(data.blocks.sort());\n            data.handles = JSON.stringify(data.handles);\n            data.originalRequest = JSON.stringify(data.originalRequest);\n            $.ajax({\n                url: this.options.url,\n                data: data,\n                type: 'GET',\n                cache: true,\n                dataType: 'json',\n                context: this,\n\n                /**\n                 * Response handler\n                 * @param {Object} response\n                 */\n                success: function (response) {\n                    var placeholder, i;\n\n                    for (i = 0; i < placeholders.length; i++) {\n                        placeholder = placeholders[i];\n\n                        if (response.hasOwnProperty(placeholder.name)) {\n                            this._replacePlaceholder(placeholder, response[placeholder.name]);\n                        }\n                    }\n                }\n            });\n        }\n    });\n\n    domReady(function () {\n        $('body')\n            .formKey();\n    });\n\n    return {\n        'pageCache': $.mage.pageCache,\n        'formKey': $.mage.formKey\n    };\n});\n"}
}});
