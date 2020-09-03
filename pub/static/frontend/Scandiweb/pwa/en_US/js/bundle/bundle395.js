require.config({"config": {
        "jsbuild":{"Amazon_Login/js/view/login-button-wrapper.js":"/**\n * Copyright 2016 Amazon.com, Inc. or its affiliates. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\").\n * You may not use this file except in compliance with the License.\n * A copy of the License is located at\n *\n *  http://aws.amazon.com/apache2.0\n *\n * or in the \"license\" file accompanying this file. This file is distributed\n * on an \"AS IS\" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\n * express or implied. See the License for the specific language governing\n * permissions and limitations under the License.\n */\n\ndefine(['uiRegistry', 'Amazon_Login/js/view/login-button', 'uiComponent'], function(registry, login, component) {\n    'use strict';\n    var amazonPayment = registry.get('amazonPayment');\n\n    if (amazonPayment !== undefined && amazonPayment.allowAmLoginLoading === true) {\n        return login;\n    }\n    return component;\n});\n"}
}});
