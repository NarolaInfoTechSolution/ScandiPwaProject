require.config({"config": {
        "text":{"Magento_Payment/template/payment/cc-form.html":"<!--\n/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n-->\n\n<fieldset data-bind=\"attr: {class: 'fieldset payment items ccard ' + getCode(), id: 'payment_form_' + getCode()}\">\n    <!-- ko if: (isShowLegend())-->\n    <legend class=\"legend\">\n        <span><!-- ko i18n: 'Credit Card Information'--><!-- /ko --></span>\n    </legend><br />\n    <!-- /ko -->\n    <div class=\"field type\">\n        <div class=\"control\">\n            <ul class=\"credit-card-types\">\n                <!-- ko foreach: {data: getCcAvailableTypesValues(), as: 'item'} -->\n                <li class=\"item\" data-bind=\"css: {\n                                                 _active: $parent.selectedCardType() == item.value,\n                                                 _inactive: $parent.selectedCardType() != null && $parent.selectedCardType() != item.value\n                                                 } \">\n                    <!--ko if: $parent.getIcons(item.value) -->\n                    <img data-bind=\"attr: {\n                        'src': $parent.getIcons(item.value).url,\n                        'alt': item.type,\n                        'width': $parent.getIcons(item.value).width,\n                        'height': $parent.getIcons(item.value).height\n                        }\">\n                    <!--/ko-->\n                </li>\n                <!--/ko-->\n            </ul>\n            <input type=\"hidden\"\n                   name=\"payment[cc_type]\"\n                   class=\"input-text\"\n                   value=\"\"\n                   data-bind=\"attr: {id: getCode() + '_cc_type', 'data-container': getCode() + '-cc-type'},\n                   value: creditCardType\n                   \">\n        </div>\n    </div>\n    <div class=\"field number required\">\n        <label data-bind=\"attr: {for: getCode() + '_cc_number'}\" class=\"label\">\n            <span><!-- ko i18n: 'Credit Card Number'--><!-- /ko --></span>\n        </label>\n        <div class=\"control\">\n            <input type=\"number\" name=\"payment[cc_number]\" class=\"input-text\" value=\"\"\n                   data-bind=\"attr: {\n                                    autocomplete: off,\n                                    id: getCode() + '_cc_number',\n                                    title: $t('Credit Card Number'),\n                                    'data-container': getCode() + '-cc-number',\n                                    'data-validate': JSON.stringify({'required-number':true, 'validate-card-type':getCcAvailableTypesValues(), 'validate-card-number':'#' + getCode() + '_cc_type', 'validate-cc-type':'#' + getCode() + '_cc_type'})},\n                              enable: isActive($parents),\n                              value: creditCardNumber,\n                              valueUpdate: 'keyup' \"/>\n        </div>\n    </div>\n    <div class=\"field date required\" data-bind=\"attr: {id: getCode() + '_cc_type_exp_div'}\">\n        <label data-bind=\"attr: {for: getCode() + '_expiration'}\" class=\"label\">\n            <span><!-- ko i18n: 'Expiration Date'--><!-- /ko --></span>\n        </label>\n        <div class=\"control\">\n            <div class=\"fields group group-2\">\n                <div class=\"field no-label month\">\n                    <div class=\"control\">\n                        <select  name=\"payment[cc_exp_month]\"\n                                 class=\"select select-month\"\n                                 data-bind=\"attr: {id: getCode() + '_expiration', 'data-container': getCode() + '-cc-month', 'data-validate': JSON.stringify({required:true, 'validate-cc-exp':'#' + getCode() + '_expiration_yr'})},\n                                            enable: isActive($parents),\n                                            options: getCcMonthsValues(),\n                                            optionsValue: 'value',\n                                            optionsText: 'month',\n                                            optionsCaption: $t('Month'),\n                                            value: creditCardExpMonth\">\n                        </select>\n                    </div>\n                </div>\n                <div class=\"field no-label year\">\n                    <div class=\"control\">\n                        <select name=\"payment[cc_exp_year]\"\n                                class=\"select select-year\"\n                                data-bind=\"attr: {id: getCode() + '_expiration_yr', 'data-container': getCode() + '-cc-year', 'data-validate': JSON.stringify({required:true})},\n                                           enable: isActive($parents),\n                                           options: getCcYearsValues(),\n                                           optionsValue: 'value',\n                                           optionsText: 'year',\n                                           optionsCaption: $t('Year'),\n                                           value: creditCardExpYear\">\n                        </select>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n    <!-- ko if: (hasVerification())-->\n    <div class=\"field cvv required\" data-bind=\"attr: {id: getCode() + '_cc_type_cvv_div'}\">\n        <label data-bind=\"attr: {for: getCode() + '_cc_cid'}\" class=\"label\">\n            <span><!-- ko i18n: 'Card Verification Number'--><!-- /ko --></span>\n        </label>\n        <div class=\"control _with-tooltip\">\n            <input type=\"number\"\n                   autocomplete=\"off\"\n                   class=\"input-text cvv\"\n                   name=\"payment[cc_cid]\"\n                   value=\"\"\n                   data-bind=\"attr: {id: getCode() + '_cc_cid',\n                        title: $t('Card Verification Number'),\n                        'data-container': getCode() + '-cc-cvv',\n                        'data-validate': JSON.stringify({'required-number':true, 'validate-card-cvv':'#' + getCode() + '_cc_type'})},\n                        enable: isActive($parents),\n                        value: creditCardVerificationNumber\" />\n            <div class=\"field-tooltip toggle\">\n                <span class=\"field-tooltip-action action-cvv\"\n                      tabindex=\"0\"\n                      data-toggle=\"dropdown\"\n                      data-bind=\"attr: {title: $t('What is this?')}, mageInit: {'dropdown':{'activeClass': '_active'}}\">\n                    <span><!-- ko i18n: 'What is this?'--><!-- /ko --></span>\n                </span>\n                <div class=\"field-tooltip-content\"\n                     data-target=\"dropdown\"\n                     data-bind=\"html: getCvvImageHtml()\"></div>\n            </div>\n        </div>\n    </div>\n    <!-- /ko -->\n</fieldset>\n"}
}});
