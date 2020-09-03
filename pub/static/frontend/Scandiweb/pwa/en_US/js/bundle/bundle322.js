require.config({"config": {
        "jsbuild":{"Magento_Checkout/js/model/step-navigator.js":"/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n\n/**\n * @api\n */\ndefine([\n    'jquery',\n    'ko'\n], function ($, ko) {\n    'use strict';\n\n    var steps = ko.observableArray();\n\n    return {\n        steps: steps,\n        stepCodes: [],\n        validCodes: [],\n\n        /**\n         * @return {Boolean}\n         */\n        handleHash: function () {\n            var hashString = window.location.hash.replace('#', ''),\n                isRequestedStepVisible;\n\n            if (hashString === '') {\n                return false;\n            }\n\n            if ($.inArray(hashString, this.validCodes) === -1) {\n                window.location.href = window.checkoutConfig.pageNotFoundUrl;\n\n                return false;\n            }\n\n            isRequestedStepVisible = steps.sort(this.sortItems).some(function (element) {\n                return (element.code == hashString || element.alias == hashString) && element.isVisible(); //eslint-disable-line\n            });\n\n            //if requested step is visible, then we don't need to load step data from server\n            if (isRequestedStepVisible) {\n                return false;\n            }\n\n            steps().sort(this.sortItems).forEach(function (element) {\n                if (element.code == hashString || element.alias == hashString) { //eslint-disable-line eqeqeq\n                    element.navigate(element);\n                } else {\n                    element.isVisible(false);\n                }\n\n            });\n\n            return false;\n        },\n\n        /**\n         * @param {String} code\n         * @param {*} alias\n         * @param {*} title\n         * @param {Function} isVisible\n         * @param {*} navigate\n         * @param {*} sortOrder\n         */\n        registerStep: function (code, alias, title, isVisible, navigate, sortOrder) {\n            var hash, active;\n\n            if ($.inArray(code, this.validCodes) !== -1) {\n                throw new DOMException('Step code [' + code + '] already registered in step navigator');\n            }\n\n            if (alias != null) {\n                if ($.inArray(alias, this.validCodes) !== -1) {\n                    throw new DOMException('Step code [' + alias + '] already registered in step navigator');\n                }\n                this.validCodes.push(alias);\n            }\n            this.validCodes.push(code);\n            steps.push({\n                code: code,\n                alias: alias != null ? alias : code,\n                title: title,\n                isVisible: isVisible,\n                navigate: navigate,\n                sortOrder: sortOrder\n            });\n            active = this.getActiveItemIndex();\n            steps.each(function (elem, index) {\n                if (active !== index) {\n                    elem.isVisible(false);\n                }\n            });\n            this.stepCodes.push(code);\n            hash = window.location.hash.replace('#', '');\n\n            if (hash != '' && hash != code) { //eslint-disable-line eqeqeq\n                //Force hiding of not active step\n                isVisible(false);\n            }\n        },\n\n        /**\n         * @param {Object} itemOne\n         * @param {Object} itemTwo\n         * @return {Number}\n         */\n        sortItems: function (itemOne, itemTwo) {\n            return itemOne.sortOrder > itemTwo.sortOrder ? 1 : -1;\n        },\n\n        /**\n         * @return {Number}\n         */\n        getActiveItemIndex: function () {\n            var activeIndex = 0;\n\n            steps().sort(this.sortItems).some(function (element, index) {\n                if (element.isVisible()) {\n                    activeIndex = index;\n\n                    return true;\n                }\n\n                return false;\n            });\n\n            return activeIndex;\n        },\n\n        /**\n         * @param {*} code\n         * @return {Boolean}\n         */\n        isProcessed: function (code) {\n            var activeItemIndex = this.getActiveItemIndex(),\n                sortedItems = steps().sort(this.sortItems),\n                requestedItemIndex = -1;\n\n            sortedItems.forEach(function (element, index) {\n                if (element.code == code) { //eslint-disable-line eqeqeq\n                    requestedItemIndex = index;\n                }\n            });\n\n            return activeItemIndex > requestedItemIndex;\n        },\n\n        /**\n         * @param {*} code\n         * @param {*} scrollToElementId\n         */\n        navigateTo: function (code, scrollToElementId) {\n            var sortedItems = steps().sort(this.sortItems),\n                bodyElem = $('body');\n\n            scrollToElementId = scrollToElementId || null;\n\n            if (!this.isProcessed(code)) {\n                return;\n            }\n            sortedItems.forEach(function (element) {\n                if (element.code == code) { //eslint-disable-line eqeqeq\n                    element.isVisible(true);\n                    bodyElem.animate({\n                        scrollTop: $('#' + code).offset().top\n                    }, 0, function () {\n                        window.location = window.checkoutConfig.checkoutUrl + '#' + code;\n                    });\n\n                    if (scrollToElementId && $('#' + scrollToElementId).length) {\n                        bodyElem.animate({\n                            scrollTop: $('#' + scrollToElementId).offset().top\n                        }, 0);\n                    }\n                } else {\n                    element.isVisible(false);\n                }\n\n            });\n        },\n\n        /**\n         * Sets window location hash.\n         *\n         * @param {String} hash\n         */\n        setHash: function (hash) {\n            window.location.hash = hash;\n        },\n\n        /**\n         * Next step.\n         */\n        next: function () {\n            var activeIndex = 0,\n                code;\n\n            steps().sort(this.sortItems).forEach(function (element, index) {\n                if (element.isVisible()) {\n                    element.isVisible(false);\n                    activeIndex = index;\n                }\n            });\n\n            if (steps().length > activeIndex + 1) {\n                code = steps()[activeIndex + 1].code;\n                steps()[activeIndex + 1].isVisible(true);\n                this.setHash(code);\n                document.body.scrollTop = document.documentElement.scrollTop = 0;\n            }\n        }\n    };\n});\n"}
}});
