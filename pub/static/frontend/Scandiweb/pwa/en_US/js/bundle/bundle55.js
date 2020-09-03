require.config({"config": {
        "jsbuild":{"jquery/ui-modules/effect-clip.js":"/*!\n * jQuery UI Effects Clip - v1.10.4\n * http://jqueryui.com\n *\n * Copyright 2014 jQuery Foundation and other contributors\n * Released under the MIT license.\n * http://jquery.org/license\n *\n * http://api.jqueryui.com/clip-effect/\n */\ndefine([\n    'jquery',\n    'jquery-ui-modules/effect'\n], function ($, undefined) {\n\n    $.effects.effect.clip = function (o, done) {\n        // Create element\n        var el = $(this),\n            props = [\"position\", \"top\", \"bottom\", \"left\", \"right\", \"height\", \"width\"],\n            mode = $.effects.setMode(el, o.mode || \"hide\"),\n            show = mode === \"show\",\n            direction = o.direction || \"vertical\",\n            vert = direction === \"vertical\",\n            size = vert ? \"height\" : \"width\",\n            position = vert ? \"top\" : \"left\",\n            animation = {},\n            wrapper, animate, distance;\n\n        // Save & Show\n        $.effects.save(el, props);\n        el.show();\n\n        // Create Wrapper\n        wrapper = $.effects.createWrapper(el).css({\n            overflow: \"hidden\"\n        });\n        animate = (el[0].tagName === \"IMG\") ? wrapper : el;\n        distance = animate[size]();\n\n        // Shift\n        if (show) {\n            animate.css(size, 0);\n            animate.css(position, distance / 2);\n        }\n\n        // Create Animation Object:\n        animation[size] = show ? distance : 0;\n        animation[position] = show ? 0 : distance / 2;\n\n        // Animate\n        animate.animate(animation, {\n            queue: false,\n            duration: o.duration,\n            easing: o.easing,\n            complete: function () {\n                if (!show) {\n                    el.hide();\n                }\n                $.effects.restore(el, props);\n                $.effects.removeWrapper(el);\n                done();\n            }\n        });\n\n    };\n\n});\n"}
}});