require.config({"config": {
        "jsbuild":{"Magento_Tinymce3/tiny_mce/classes/dom/EventUtils.js":"/**\n * EventUtils.js\n *\n * Copyright 2009, Moxiecode Systems AB\n * Released under LGPL License.\n *\n * License: http://tinymce.moxiecode.com/license\n * Contributing: http://tinymce.moxiecode.com/contributing\n */\n\n(function(tinymce) {\n\t// Shorten names\n\tvar each = tinymce.each, DOM = tinymce.DOM, isIE = tinymce.isIE, isWebKit = tinymce.isWebKit, Event;\n\n\t/**\n\t * This class handles DOM events in a cross platform fasion it also keeps track of element\n\t * and handler references to be able to clean elements to reduce IE memory leaks.\n\t *\n\t * @class tinymce.dom.EventUtils\n\t */\n\ttinymce.create('tinymce.dom.EventUtils', {\n\t\t/**\n\t\t * Constructs a new EventUtils instance.\n\t\t *\n\t\t * @constructor\n\t\t * @method EventUtils\n\t\t */\n\t\tEventUtils : function() {\n\t\t\tthis.inits = [];\n\t\t\tthis.events = [];\n\t\t},\n\n\t\t/**\n\t\t * Adds an event handler to the specified object.\n\t\t *\n\t\t * @method add\n\t\t * @param {Element/Document/Window/Array/String} o Object or element id string to add event handler to or an array of elements/ids/documents.\n\t\t * @param {String/Array} n Name of event handler to add for example: click.\n\t\t * @param {function} f Function to execute when the event occurs.\n\t\t * @param {Object} s Optional scope to execute the function in.\n\t\t * @return {function} Function callback handler the same as the one passed in.\n\t\t * @example\n\t\t * // Adds a click handler to the current document\n\t\t * tinymce.dom.Event.add(document, 'click', function(e) {\n\t\t *    console.debug(e.target);\n\t\t * });\n\t\t */\n\t\tadd : function(o, n, f, s) {\n\t\t\tvar cb, t = this, el = t.events, r;\n\n\t\t\tif (n instanceof Array) {\n\t\t\t\tr = [];\n\n\t\t\t\teach(n, function(n) {\n\t\t\t\t\tr.push(t.add(o, n, f, s));\n\t\t\t\t});\n\n\t\t\t\treturn r;\n\t\t\t}\n\n\t\t\t// Handle array\n\t\t\tif (o && o.hasOwnProperty && o instanceof Array) {\n\t\t\t\tr = [];\n\n\t\t\t\teach(o, function(o) {\n\t\t\t\t\to = DOM.get(o);\n\t\t\t\t\tr.push(t.add(o, n, f, s));\n\t\t\t\t});\n\n\t\t\t\treturn r;\n\t\t\t}\n\n\t\t\to = DOM.get(o);\n\n\t\t\tif (!o)\n\t\t\t\treturn;\n\n\t\t\t// Setup event callback\n\t\t\tcb = function(e) {\n\t\t\t\t// Is all events disabled\n\t\t\t\tif (t.disabled)\n\t\t\t\t\treturn;\n\n\t\t\t\te = e || window.event;\n\n\t\t\t\t// Patch in target, preventDefault and stopPropagation in IE it's W3C valid\n\t\t\t\tif (e && isIE) {\n\t\t\t\t\tif (!e.target)\n\t\t\t\t\t\te.target = e.srcElement;\n\n\t\t\t\t\t// Patch in preventDefault, stopPropagation methods for W3C compatibility\n\t\t\t\t\ttinymce.extend(e, t._stoppers);\n\t\t\t\t}\n\n\t\t\t\tif (!s)\n\t\t\t\t\treturn f(e);\n\n\t\t\t\treturn f.call(s, e);\n\t\t\t};\n\n\t\t\tif (n == 'unload') {\n\t\t\t\ttinymce.unloads.unshift({func : cb});\n\t\t\t\treturn cb;\n\t\t\t}\n\n\t\t\tif (n == 'init') {\n\t\t\t\tif (t.domLoaded)\n\t\t\t\t\tcb();\n\t\t\t\telse\n\t\t\t\t\tt.inits.push(cb);\n\n\t\t\t\treturn cb;\n\t\t\t}\n\n\t\t\t// Store away listener reference\n\t\t\tel.push({\n\t\t\t\tobj : o,\n\t\t\t\tname : n,\n\t\t\t\tfunc : f,\n\t\t\t\tcfunc : cb,\n\t\t\t\tscope : s\n\t\t\t});\n\n\t\t\tt._add(o, n, cb);\n\n\t\t\treturn f;\n\t\t},\n\n\t\t/**\n\t\t * Removes the specified event handler by name and function from a element or collection of elements.\n\t\t *\n\t\t * @method remove\n\t\t * @param {String/Element/Array} o Element ID string or HTML element or an array of elements or ids to remove handler from.\n\t\t * @param {String} n Event handler name like for example: \"click\"\n\t\t * @param {function} f Function to remove.\n\t\t * @return {bool/Array} Bool state if true if the handler was removed or an array with states if multiple elements where passed in.\n\t\t * @example\n\t\t * // Adds a click handler to the current document\n\t\t * var func = tinymce.dom.Event.add(document, 'click', function(e) {\n\t\t *    console.debug(e.target);\n\t\t * });\n\t\t * \n\t\t * // Removes the click handler from the document\n\t\t * tinymce.dom.Event.remove(document, 'click', func);\n\t\t */\n\t\tremove : function(o, n, f) {\n\t\t\tvar t = this, a = t.events, s = false, r;\n\n\t\t\t// Handle array\n\t\t\tif (o && o.hasOwnProperty && o instanceof Array) {\n\t\t\t\tr = [];\n\n\t\t\t\teach(o, function(o) {\n\t\t\t\t\to = DOM.get(o);\n\t\t\t\t\tr.push(t.remove(o, n, f));\n\t\t\t\t});\n\n\t\t\t\treturn r;\n\t\t\t}\n\n\t\t\to = DOM.get(o);\n\n\t\t\teach(a, function(e, i) {\n\t\t\t\tif (e.obj == o && e.name == n && (!f || (e.func == f || e.cfunc == f))) {\n\t\t\t\t\ta.splice(i, 1);\n\t\t\t\t\tt._remove(o, n, e.cfunc);\n\t\t\t\t\ts = true;\n\t\t\t\t\treturn false;\n\t\t\t\t}\n\t\t\t});\n\n\t\t\treturn s;\n\t\t},\n\n\t\t/**\n\t\t * Clears all events of a specific object.\n\t\t *\n\t\t * @method clear\n\t\t * @param {Object} o DOM element or object to remove all events from.\n\t\t * @example\n\t\t * // Cancels all mousedown events in the active editor\n\t\t * tinyMCE.activeEditor.onMouseDown.add(function(ed, e) {\n\t\t *    return tinymce.dom.Event.cancel(e);\n\t\t * });\n\t\t */\n\t\tclear : function(o) {\n\t\t\tvar t = this, a = t.events, i, e;\n\n\t\t\tif (o) {\n\t\t\t\to = DOM.get(o);\n\n\t\t\t\tfor (i = a.length - 1; i >= 0; i--) {\n\t\t\t\t\te = a[i];\n\n\t\t\t\t\tif (e.obj === o) {\n\t\t\t\t\t\tt._remove(e.obj, e.name, e.cfunc);\n\t\t\t\t\t\te.obj = e.cfunc = null;\n\t\t\t\t\t\ta.splice(i, 1);\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t},\n\n\t\t/**\n\t\t * Cancels an event for both bubbeling and the default browser behavior.\n\t\t *\n\t\t * @method cancel\n\t\t * @param {Event} e Event object to cancel.\n\t\t * @return {Boolean} Always false.\n\t\t */\n\t\tcancel : function(e) {\n\t\t\tif (!e)\n\t\t\t\treturn false;\n\n\t\t\tthis.stop(e);\n\n\t\t\treturn this.prevent(e);\n\t\t},\n\n\t\t/**\n\t\t * Stops propogation/bubbeling of an event.\n\t\t *\n\t\t * @method stop\n\t\t * @param {Event} e Event to cancel bubbeling on.\n\t\t * @return {Boolean} Always false.\n\t\t */\n\t\tstop : function(e) {\n\t\t\tif (e.stopPropagation)\n\t\t\t\te.stopPropagation();\n\t\t\telse\n\t\t\t\te.cancelBubble = true;\n\n\t\t\treturn false;\n\t\t},\n\n\t\t/**\n\t\t * Prevent default browser behvaior of an event.\n\t\t *\n\t\t * @method prevent\n\t\t * @param {Event} e Event to prevent default browser behvaior of an event.\n\t\t * @return {Boolean} Always false.\n\t\t */\n\t\tprevent : function(e) {\n\t\t\tif (e.preventDefault)\n\t\t\t\te.preventDefault();\n\t\t\telse\n\t\t\t\te.returnValue = false;\n\n\t\t\treturn false;\n\t\t},\n\n\t\t/**\n\t\t * Destroys the instance.\n\t\t *\n\t\t * @method destroy\n\t\t */\n\t\tdestroy : function() {\n\t\t\tvar t = this;\n\n\t\t\teach(t.events, function(e, i) {\n\t\t\t\tt._remove(e.obj, e.name, e.cfunc);\n\t\t\t\te.obj = e.cfunc = null;\n\t\t\t});\n\n\t\t\tt.events = [];\n\t\t\tt = null;\n\t\t},\n\n\t\t_add : function(o, n, f) {\n\t\t\tif (o.attachEvent)\n\t\t\t\to.attachEvent('on' + n, f);\n\t\t\telse if (o.addEventListener)\n\t\t\t\to.addEventListener(n, f, false);\n\t\t\telse\n\t\t\t\to['on' + n] = f;\n\t\t},\n\n\t\t_remove : function(o, n, f) {\n\t\t\tif (o) {\n\t\t\t\ttry {\n\t\t\t\t\tif (o.detachEvent)\n\t\t\t\t\t\to.detachEvent('on' + n, f);\n\t\t\t\t\telse if (o.removeEventListener)\n\t\t\t\t\t\to.removeEventListener(n, f, false);\n\t\t\t\t\telse\n\t\t\t\t\t\to['on' + n] = null;\n\t\t\t\t} catch (ex) {\n\t\t\t\t\t// Might fail with permission denined on IE so we just ignore that\n\t\t\t\t}\n\t\t\t}\n\t\t},\n\n\t\t_pageInit : function(win) {\n\t\t\tvar t = this;\n\n\t\t\t// Keep it from running more than once\n\t\t\tif (t.domLoaded)\n\t\t\t\treturn;\n\n\t\t\tt.domLoaded = true;\n\n\t\t\teach(t.inits, function(c) {\n\t\t\t\tc();\n\t\t\t});\n\n\t\t\tt.inits = [];\n\t\t},\n\n\t\t_wait : function(win) {\n\t\t\tvar t = this, doc = win.document;\n\n\t\t\t// No need since the document is already loaded\n\t\t\tif (win.tinyMCE_GZ && tinyMCE_GZ.loaded) {\n\t\t\t\tt.domLoaded = 1;\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\t// Use IE method\n\t\t\tif (doc.attachEvent) {\n\t\t\t\tdoc.attachEvent(\"onreadystatechange\", function() {\n\t\t\t\t\tif (doc.readyState === \"complete\") {\n\t\t\t\t\t\tdoc.detachEvent(\"onreadystatechange\", arguments.callee);\n\t\t\t\t\t\tt._pageInit(win);\n\t\t\t\t\t}\n\t\t\t\t});\n\n\t\t\t\tif (doc.documentElement.doScroll && win == win.top) {\n\t\t\t\t\t(function() {\n\t\t\t\t\t\tif (t.domLoaded)\n\t\t\t\t\t\t\treturn;\n\n\t\t\t\t\t\ttry {\n\t\t\t\t\t\t\t// If IE is used, use the trick by Diego Perini licensed under MIT by request to the author.\n\t\t\t\t\t\t\t// http://javascript.nwbox.com/IEContentLoaded/\n\t\t\t\t\t\t\tdoc.documentElement.doScroll(\"left\");\n\t\t\t\t\t\t} catch (ex) {\n\t\t\t\t\t\t\tsetTimeout(arguments.callee, 0);\n\t\t\t\t\t\t\treturn;\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tt._pageInit(win);\n\t\t\t\t\t})();\n\t\t\t\t}\n\t\t\t} else if (doc.addEventListener) {\n\t\t\t\tt._add(win, 'DOMContentLoaded', function() {\n\t\t\t\t\tt._pageInit(win);\n\t\t\t\t});\n\t\t\t}\n\n\t\t\tt._add(win, 'load', function() {\n\t\t\t\tt._pageInit(win);\n\t\t\t});\n\t\t},\n\n\t\t_stoppers : {\n\t\t\tpreventDefault : function() {\n\t\t\t\tthis.returnValue = false;\n\t\t\t},\n\n\t\t\tstopPropagation : function() {\n\t\t\t\tthis.cancelBubble = true;\n\t\t\t}\n\t\t}\n\t});\n\n\t/**\n\t * Instance of EventUtils for the current document.\n\t *\n\t * @property Event\n\t * @member tinymce.dom\n\t * @type tinymce.dom.EventUtils\n\t */\n\tEvent = tinymce.dom.Event = new tinymce.dom.EventUtils();\n\n\t// Dispatch DOM content loaded event for IE and Safari\n\tEvent._wait(window);\n\n\ttinymce.addUnload(function() {\n\t\tEvent.destroy();\n\t});\n})(tinymce);\n"}
}});
