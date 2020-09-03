require.config({"config": {
        "jsbuild":{"jquery/ui-modules/droppable.js":"/*!\n * jQuery UI Droppable - v1.10.4\n * http://jqueryui.com\n *\n * Copyright 2014 jQuery Foundation and other contributors\n * Released under the MIT license.\n * http://jquery.org/license\n *\n * http://api.jqueryui.com/droppable/\n */\n\ndefine([\n    'jquery',\n    'jquery-ui-modules/draggable'\n], function ($, undefined) {\n\n    function isOverAxis(x, reference, size) {\n        return (x > reference) && (x < (reference + size));\n    }\n\n    $.widget(\"ui.droppable\", {\n        version: \"1.10.4\",\n        widgetEventPrefix: \"drop\",\n        options: {\n            accept: \"*\",\n            activeClass: false,\n            addClasses: true,\n            greedy: false,\n            hoverClass: false,\n            scope: \"default\",\n            tolerance: \"intersect\",\n\n            // callbacks\n            activate: null,\n            deactivate: null,\n            drop: null,\n            out: null,\n            over: null\n        },\n        _create: function () {\n\n            var proportions,\n                o = this.options,\n                accept = o.accept;\n\n            this.isover = false;\n            this.isout = true;\n\n            this.accept = $.isFunction(accept) ? accept : function (d) {\n                return d.is(accept);\n            };\n\n            this.proportions = function ( /* valueToWrite */) {\n                if (arguments.length) {\n                    // Store the droppable's proportions\n                    proportions = arguments[0];\n                } else {\n                    // Retrieve or derive the droppable's proportions\n                    return proportions ?\n                        proportions :\n                        proportions = {\n                            width: this.element[0].offsetWidth,\n                            height: this.element[0].offsetHeight\n                        };\n                }\n            };\n\n            // Add the reference and positions to the manager\n            $.ui.ddmanager.droppables[o.scope] = $.ui.ddmanager.droppables[o.scope] || [];\n            $.ui.ddmanager.droppables[o.scope].push(this);\n\n            (o.addClasses && this.element.addClass(\"ui-droppable\"));\n\n        },\n\n        _destroy: function () {\n            var i = 0,\n                drop = $.ui.ddmanager.droppables[this.options.scope];\n\n            for (; i < drop.length; i++) {\n                if (drop[i] === this) {\n                    drop.splice(i, 1);\n                }\n            }\n\n            this.element.removeClass(\"ui-droppable ui-droppable-disabled\");\n        },\n\n        _setOption: function (key, value) {\n\n            if (key === \"accept\") {\n                this.accept = $.isFunction(value) ? value : function (d) {\n                    return d.is(value);\n                };\n            }\n            $.Widget.prototype._setOption.apply(this, arguments);\n        },\n\n        _activate: function (event) {\n            var draggable = $.ui.ddmanager.current;\n            if (this.options.activeClass) {\n                this.element.addClass(this.options.activeClass);\n            }\n            if (draggable) {\n                this._trigger(\"activate\", event, this.ui(draggable));\n            }\n        },\n\n        _deactivate: function (event) {\n            var draggable = $.ui.ddmanager.current;\n            if (this.options.activeClass) {\n                this.element.removeClass(this.options.activeClass);\n            }\n            if (draggable) {\n                this._trigger(\"deactivate\", event, this.ui(draggable));\n            }\n        },\n\n        _over: function (event) {\n\n            var draggable = $.ui.ddmanager.current;\n\n            // Bail if draggable and droppable are same element\n            if (!draggable || (draggable.currentItem || draggable.element)[0] === this.element[0]) {\n                return;\n            }\n\n            if (this.accept.call(this.element[0], (draggable.currentItem || draggable.element))) {\n                if (this.options.hoverClass) {\n                    this.element.addClass(this.options.hoverClass);\n                }\n                this._trigger(\"over\", event, this.ui(draggable));\n            }\n\n        },\n\n        _out: function (event) {\n\n            var draggable = $.ui.ddmanager.current;\n\n            // Bail if draggable and droppable are same element\n            if (!draggable || (draggable.currentItem || draggable.element)[0] === this.element[0]) {\n                return;\n            }\n\n            if (this.accept.call(this.element[0], (draggable.currentItem || draggable.element))) {\n                if (this.options.hoverClass) {\n                    this.element.removeClass(this.options.hoverClass);\n                }\n                this._trigger(\"out\", event, this.ui(draggable));\n            }\n\n        },\n\n        _drop: function (event, custom) {\n\n            var draggable = custom || $.ui.ddmanager.current,\n                childrenIntersection = false;\n\n            // Bail if draggable and droppable are same element\n            if (!draggable || (draggable.currentItem || draggable.element)[0] === this.element[0]) {\n                return false;\n            }\n\n            this.element.find(\":data(ui-droppable)\").not(\".ui-draggable-dragging\").each(function () {\n                var inst = $.data(this, \"ui-droppable\");\n                if (\n                    inst.options.greedy &&\n                    !inst.options.disabled &&\n                    inst.options.scope === draggable.options.scope &&\n                    inst.accept.call(inst.element[0], (draggable.currentItem || draggable.element)) &&\n                    $.ui.intersect(draggable, $.extend(inst, {offset: inst.element.offset()}), inst.options.tolerance)\n                ) {\n                    childrenIntersection = true;\n                    return false;\n                }\n            });\n            if (childrenIntersection) {\n                return false;\n            }\n\n            if (this.accept.call(this.element[0], (draggable.currentItem || draggable.element))) {\n                if (this.options.activeClass) {\n                    this.element.removeClass(this.options.activeClass);\n                }\n                if (this.options.hoverClass) {\n                    this.element.removeClass(this.options.hoverClass);\n                }\n                this._trigger(\"drop\", event, this.ui(draggable));\n                return this.element;\n            }\n\n            return false;\n\n        },\n\n        ui: function (c) {\n            return {\n                draggable: (c.currentItem || c.element),\n                helper: c.helper,\n                position: c.position,\n                offset: c.positionAbs\n            };\n        }\n\n    });\n\n    $.ui.intersect = function (draggable, droppable, toleranceMode) {\n\n        if (!droppable.offset) {\n            return false;\n        }\n\n        var draggableLeft, draggableTop,\n            x1 = (draggable.positionAbs || draggable.position.absolute).left,\n            y1 = (draggable.positionAbs || draggable.position.absolute).top,\n            x2 = x1 + draggable.helperProportions.width,\n            y2 = y1 + draggable.helperProportions.height,\n            l = droppable.offset.left,\n            t = droppable.offset.top,\n            r = l + droppable.proportions().width,\n            b = t + droppable.proportions().height;\n\n        switch (toleranceMode) {\n            case \"fit\":\n                return (l <= x1 && x2 <= r && t <= y1 && y2 <= b);\n            case \"intersect\":\n                return (l < x1 + (draggable.helperProportions.width / 2) && // Right Half\n                    x2 - (draggable.helperProportions.width / 2) < r && // Left Half\n                    t < y1 + (draggable.helperProportions.height / 2) && // Bottom Half\n                    y2 - (draggable.helperProportions.height / 2) < b); // Top Half\n            case \"pointer\":\n                draggableLeft = ((draggable.positionAbs || draggable.position.absolute).left + (draggable.clickOffset || draggable.offset.click).left);\n                draggableTop = ((draggable.positionAbs || draggable.position.absolute).top + (draggable.clickOffset || draggable.offset.click).top);\n                return isOverAxis(draggableTop, t, droppable.proportions().height) && isOverAxis(draggableLeft, l, droppable.proportions().width);\n            case \"touch\":\n                return (\n                    (y1 >= t && y1 <= b) ||\t// Top edge touching\n                    (y2 >= t && y2 <= b) ||\t// Bottom edge touching\n                    (y1 < t && y2 > b)\t\t// Surrounded vertically\n                ) && (\n                    (x1 >= l && x1 <= r) ||\t// Left edge touching\n                    (x2 >= l && x2 <= r) ||\t// Right edge touching\n                    (x1 < l && x2 > r)\t\t// Surrounded horizontally\n                );\n            default:\n                return false;\n        }\n\n    };\n\n    /*\n        This manager tracks offsets of draggables and droppables\n    */\n    $.ui.ddmanager = {\n        current: null,\n        droppables: {\"default\": []},\n        prepareOffsets: function (t, event) {\n\n            var i, j,\n                m = $.ui.ddmanager.droppables[t.options.scope] || [],\n                type = event ? event.type : null, // workaround for #2317\n                list = (t.currentItem || t.element).find(\":data(ui-droppable)\").addBack();\n\n            droppablesLoop: for (i = 0; i < m.length; i++) {\n\n                //No disabled and non-accepted\n                if (m[i].options.disabled || (t && !m[i].accept.call(m[i].element[0], (t.currentItem || t.element)))) {\n                    continue;\n                }\n\n                // Filter out elements in the current dragged item\n                for (j = 0; j < list.length; j++) {\n                    if (list[j] === m[i].element[0]) {\n                        m[i].proportions().height = 0;\n                        continue droppablesLoop;\n                    }\n                }\n\n                m[i].visible = m[i].element.css(\"display\") !== \"none\";\n                if (!m[i].visible) {\n                    continue;\n                }\n\n                //Activate the droppable if used directly from draggables\n                if (type === \"mousedown\") {\n                    m[i]._activate.call(m[i], event);\n                }\n\n                m[i].offset = m[i].element.offset();\n                m[i].proportions({width: m[i].element[0].offsetWidth, height: m[i].element[0].offsetHeight});\n\n            }\n\n        },\n        drop: function (draggable, event) {\n\n            var dropped = false;\n            // Create a copy of the droppables in case the list changes during the drop (#9116)\n            $.each(($.ui.ddmanager.droppables[draggable.options.scope] || []).slice(), function () {\n\n                if (!this.options) {\n                    return;\n                }\n                if (!this.options.disabled && this.visible && $.ui.intersect(draggable, this, this.options.tolerance)) {\n                    dropped = this._drop.call(this, event) || dropped;\n                }\n\n                if (!this.options.disabled && this.visible && this.accept.call(this.element[0], (draggable.currentItem || draggable.element))) {\n                    this.isout = true;\n                    this.isover = false;\n                    this._deactivate.call(this, event);\n                }\n\n            });\n            return dropped;\n\n        },\n        dragStart: function (draggable, event) {\n            //Listen for scrolling so that if the dragging causes scrolling the position of the droppables can be recalculated (see #5003)\n            draggable.element.parentsUntil(\"body\").bind(\"scroll.droppable\", function () {\n                if (!draggable.options.refreshPositions) {\n                    $.ui.ddmanager.prepareOffsets(draggable, event);\n                }\n            });\n        },\n        drag: function (draggable, event) {\n\n            //If you have a highly dynamic page, you might try this option. It renders positions every time you move the mouse.\n            if (draggable.options.refreshPositions) {\n                $.ui.ddmanager.prepareOffsets(draggable, event);\n            }\n\n            //Run through all droppables and check their positions based on specific tolerance options\n            $.each($.ui.ddmanager.droppables[draggable.options.scope] || [], function () {\n\n                if (this.options.disabled || this.greedyChild || !this.visible) {\n                    return;\n                }\n\n                var parentInstance, scope, parent,\n                    intersects = $.ui.intersect(draggable, this, this.options.tolerance),\n                    c = !intersects && this.isover ? \"isout\" : (intersects && !this.isover ? \"isover\" : null);\n                if (!c) {\n                    return;\n                }\n\n                if (this.options.greedy) {\n                    // find droppable parents with same scope\n                    scope = this.options.scope;\n                    parent = this.element.parents(\":data(ui-droppable)\").filter(function () {\n                        return $.data(this, \"ui-droppable\").options.scope === scope;\n                    });\n\n                    if (parent.length) {\n                        parentInstance = $.data(parent[0], \"ui-droppable\");\n                        parentInstance.greedyChild = (c === \"isover\");\n                    }\n                }\n\n                // we just moved into a greedy child\n                if (parentInstance && c === \"isover\") {\n                    parentInstance.isover = false;\n                    parentInstance.isout = true;\n                    parentInstance._out.call(parentInstance, event);\n                }\n\n                this[c] = true;\n                this[c === \"isout\" ? \"isover\" : \"isout\"] = false;\n                this[c === \"isover\" ? \"_over\" : \"_out\"].call(this, event);\n\n                // we just moved out of a greedy child\n                if (parentInstance && c === \"isout\") {\n                    parentInstance.isout = false;\n                    parentInstance.isover = true;\n                    parentInstance._over.call(parentInstance, event);\n                }\n            });\n\n        },\n        dragStop: function (draggable, event) {\n            draggable.element.parentsUntil(\"body\").unbind(\"scroll.droppable\");\n            //Call prepareOffsets one final time since IE does not fire return scroll events when overflow was caused by drag (see #5003)\n            if (!draggable.options.refreshPositions) {\n                $.ui.ddmanager.prepareOffsets(draggable, event);\n            }\n        }\n    };\n\n});\n"}
}});
