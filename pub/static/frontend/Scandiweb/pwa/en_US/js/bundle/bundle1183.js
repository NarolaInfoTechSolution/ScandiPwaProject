require.config({"config": {
        "text":{"Vertex_Tax/template/checkout/cart/totals/tax-messages.html":"<!--\n/**\n * @copyright  Vertex. All rights reserved.  https://www.vertexinc.com/\n * @author     Mediotype                     https://www.mediotype.com/\n */\n-->\n<!-- ko foreach: messages -->\n    <!-- ko if: $data -->\n        <tr class=\"field vertex-message\">\n            <td colspan=\"2\">\n                <div role=\"alert\" class=\"message warning\" generated=\"true\">\n                    <span data-bind=\"text: $data\"></span>\n                </div>\n            </td>\n        </tr>\n    <!-- /ko -->\n<!-- /ko -->\n"}
}});
