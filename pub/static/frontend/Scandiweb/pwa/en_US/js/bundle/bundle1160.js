require.config({"config": {
        "text":{"Magento_Checkout/template/form/element/email.html":"<!--\n/**\n * Copyright \u00a9 Magento, Inc. All rights reserved.\n * See COPYING.txt for license details.\n */\n-->\n<!-- ko ifnot: isCustomerLoggedIn() -->\n\n<!-- ko foreach: getRegion('before-login-form') -->\n<!-- ko template: getTemplate() --><!-- /ko -->\n<!-- /ko -->\n<form class=\"form form-login\" data-role=\"email-with-possible-login\"\n      data-bind=\"submit:login\"\n      method=\"post\">\n    <fieldset id=\"customer-email-fieldset\" class=\"fieldset\" data-bind=\"blockLoader: isLoading\">\n        <div class=\"field required\">\n            <label class=\"label\" for=\"customer-email\">\n                <span data-bind=\"i18n: 'Email Address'\"></span>\n            </label>\n            <div class=\"control _with-tooltip\">\n                <input class=\"input-text\"\n                       type=\"email\"\n                       data-bind=\"\n                            textInput: email,\n                            hasFocus: emailFocused,\n                            mageInit: {'mage/trim-input':{}}\"\n                       name=\"username\"\n                       data-validate=\"{required:true, 'validate-email':true}\"\n                       id=\"customer-email\" />\n                <!-- ko template: 'ui/form/element/helper/tooltip' --><!-- /ko -->\n                <span class=\"note\" data-bind=\"fadeVisible: isPasswordVisible() == false\"><!-- ko i18n: 'You can create an account after checkout.'--><!-- /ko --></span>\n            </div>\n        </div>\n\n        <!--Hidden fields -->\n        <fieldset class=\"fieldset hidden-fields\" data-bind=\"fadeVisible: isPasswordVisible\">\n            <div class=\"field\">\n                <label class=\"label\" for=\"customer-password\">\n                    <span data-bind=\"i18n: 'Password'\"></span>\n                </label>\n                <div class=\"control\">\n                    <input class=\"input-text\"\n                           data-bind=\"\n                                attr: {\n                                    placeholder: $t('Password'),\n                                }\"\n                           type=\"password\"\n                           name=\"password\"\n                           id=\"customer-password\"\n                           data-validate=\"{required:true}\" autocomplete=\"off\"/>\n                    <span class=\"note\" data-bind=\"i18n: 'You already have an account with us. Sign in or continue as guest.'\"></span>\n                </div>\n\n            </div>\n            <!-- ko foreach: getRegion('additional-login-form-fields') -->\n            <!-- ko template: getTemplate() --><!-- /ko -->\n            <!-- /ko -->\n            <div class=\"actions-toolbar\">\n                <input name=\"context\" type=\"hidden\" value=\"checkout\" />\n                <div class=\"primary\">\n                    <button type=\"submit\" class=\"action login primary\" data-action=\"checkout-method-login\"><span data-bind=\"i18n: 'Login'\"></span></button>\n                </div>\n                <div class=\"secondary\">\n                    <a class=\"action remind\" data-bind=\"attr: { href: forgotPasswordUrl }\">\n                        <span data-bind=\"i18n: 'Forgot Your Password?'\"></span>\n                    </a>\n                </div>\n            </div>\n        </fieldset>\n        <!--Hidden fields -->\n    </fieldset>\n</form>\n<!-- /ko -->\n"}
}});
