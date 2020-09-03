require.config({"config": {
        "jsbuild":{"Magento_Tinymce3/tiny_mce/classes/ControlManager.js":"/**\n * ControlManager.js\n *\n * Copyright 2009, Moxiecode Systems AB\n * Released under LGPL License.\n *\n * License: http://tinymce.moxiecode.com/license\n * Contributing: http://tinymce.moxiecode.com/contributing\n */\n\n(function(tinymce) {\n\t// Shorten names\n\tvar DOM = tinymce.DOM, Event = tinymce.dom.Event, each = tinymce.each, extend = tinymce.extend;\n\n\t/**\n\t * This class is responsible for managing UI control instances. It's both a factory and a collection for the controls.\n\t * @class tinymce.ControlManager\n\t */\n\ttinymce.create('tinymce.ControlManager', {\n\t\t/**\n\t\t * Constructs a new control manager instance.\n\t\t * Consult the Wiki for more details on this class.\n\t\t *\n\t\t * @constructor\n\t\t * @method ControlManager\n\t\t * @param {tinymce.Editor} ed TinyMCE editor instance to add the control to.\n\t\t * @param {Object} s Optional settings object for the control manager.\n\t\t */\n\t\tControlManager : function(ed, s) {\n\t\t\tvar t = this, i;\n\n\t\t\ts = s || {};\n\t\t\tt.editor = ed;\n\t\t\tt.controls = {};\n\t\t\tt.onAdd = new tinymce.util.Dispatcher(t);\n\t\t\tt.onPostRender = new tinymce.util.Dispatcher(t);\n\t\t\tt.prefix = s.prefix || ed.id + '_';\n\t\t\tt._cls = {};\n\n\t\t\tt.onPostRender.add(function() {\n\t\t\t\teach(t.controls, function(c) {\n\t\t\t\t\tc.postRender();\n\t\t\t\t});\n\t\t\t});\n\t\t},\n\n\t\t/**\n\t\t * Returns a control by id or undefined it wasn't found.\n\t\t *\n\t\t * @method get\n\t\t * @param {String} id Control instance name.\n\t\t * @return {tinymce.ui.Control} Control instance or undefined.\n\t\t */\n\t\tget : function(id) {\n\t\t\treturn this.controls[this.prefix + id] || this.controls[id];\n\t\t},\n\n\t\t/**\n\t\t * Sets the active state of a control by id.\n\t\t *\n\t\t * @method setActive\n\t\t * @param {String} id Control id to set state on.\n\t\t * @param {Boolean} s Active state true/false.\n\t\t * @return {tinymce.ui.Control} Control instance that got activated or null if it wasn't found.\n\t\t */\n\t\tsetActive : function(id, s) {\n\t\t\tvar c = null;\n\n\t\t\tif (c = this.get(id))\n\t\t\t\tc.setActive(s);\n\n\t\t\treturn c;\n\t\t},\n\n\t\t/**\n\t\t * Sets the dsiabled state of a control by id.\n\t\t *\n\t\t * @method setDisabled\n\t\t * @param {String} id Control id to set state on.\n\t\t * @param {Boolean} s Active state true/false.\n\t\t * @return {tinymce.ui.Control} Control instance that got disabled or null if it wasn't found.\n\t\t */\n\t\tsetDisabled : function(id, s) {\n\t\t\tvar c = null;\n\n\t\t\tif (c = this.get(id))\n\t\t\t\tc.setDisabled(s);\n\n\t\t\treturn c;\n\t\t},\n\n\t\t/**\n\t\t * Adds a control to the control collection inside the manager.\n\t\t *\n\t\t * @method add\n\t\t * @param {tinymce.ui.Control} Control instance to add to collection.\n\t\t * @return {tinymce.ui.Control} Control instance that got passed in.\n\t\t */\n\t\tadd : function(c) {\n\t\t\tvar t = this;\n\n\t\t\tif (c) {\n\t\t\t\tt.controls[c.id] = c;\n\t\t\t\tt.onAdd.dispatch(c, t);\n\t\t\t}\n\n\t\t\treturn c;\n\t\t},\n\n\t\t/**\n\t\t * Creates a control by name, when a control is created it will automatically add it to the control collection.\n\t\t * It first ask all plugins for the specified control if the plugins didn't return a control then the default behavior\n\t\t * will be used.\n\t\t *\n\t\t * @method createControl\n\t\t * @param {String} n Control name to create for example \"separator\".\n\t\t * @return {tinymce.ui.Control} Control instance that got created and added.\n\t\t */\n\t\tcreateControl : function(n) {\n\t\t\tvar c, t = this, ed = t.editor;\n\n\t\t\teach(ed.plugins, function(p) {\n\t\t\t\tif (p.createControl) {\n\t\t\t\t\tc = p.createControl(n, t);\n\n\t\t\t\t\tif (c)\n\t\t\t\t\t\treturn false;\n\t\t\t\t}\n\t\t\t});\n\n\t\t\tswitch (n) {\n\t\t\t\tcase \"|\":\n\t\t\t\tcase \"separator\":\n\t\t\t\t\treturn t.createSeparator();\n\t\t\t}\n\n\t\t\tif (!c && ed.buttons && (c = ed.buttons[n]))\n\t\t\t\treturn t.createButton(n, c);\n\n\t\t\treturn t.add(c);\n\t\t},\n\n\t\t/**\n\t\t * Creates a drop menu control instance by id.\n\t\t *\n\t\t * @method createDropMenu\n\t\t * @param {String} id Unique id for the new dropdown instance. For example \"some menu\".\n\t\t * @param {Object} s Optional settings object for the control.\n\t\t * @param {Object} cc Optional control class to use instead of the default one.\n\t\t * @return {tinymce.ui.Control} Control instance that got created and added.\n\t\t */\n\t\tcreateDropMenu : function(id, s, cc) {\n\t\t\tvar t = this, ed = t.editor, c, bm, v, cls;\n\n\t\t\ts = extend({\n\t\t\t\t'class' : 'mceDropDown',\n\t\t\t\tconstrain : ed.settings.constrain_menus\n\t\t\t}, s);\n\n\t\t\ts['class'] = s['class'] + ' ' + ed.getParam('skin') + 'Skin';\n\t\t\tif (v = ed.getParam('skin_variant'))\n\t\t\t\ts['class'] += ' ' + ed.getParam('skin') + 'Skin' + v.substring(0, 1).toUpperCase() + v.substring(1);\n\n\t\t\tid = t.prefix + id;\n\t\t\tcls = cc || t._cls.dropmenu || tinymce.ui.DropMenu;\n\t\t\tc = t.controls[id] = new cls(id, s);\n\t\t\tc.onAddItem.add(function(c, o) {\n\t\t\t\tvar s = o.settings;\n\n\t\t\t\ts.title = ed.getLang(s.title, s.title);\n\n\t\t\t\tif (!s.onclick) {\n\t\t\t\t\ts.onclick = function(v) {\n\t\t\t\t\t\tif (s.cmd)\n\t\t\t\t\t\t\ted.execCommand(s.cmd, s.ui || false, s.value);\n\t\t\t\t\t};\n\t\t\t\t}\n\t\t\t});\n\n\t\t\ted.onRemove.add(function() {\n\t\t\t\tc.destroy();\n\t\t\t});\n\n\t\t\t// Fix for bug #1897785, #1898007\n\t\t\tif (tinymce.isIE) {\n\t\t\t\tc.onShowMenu.add(function() {\n\t\t\t\t\t// IE 8 needs focus in order to store away a range with the current collapsed caret location\n\t\t\t\t\ted.focus();\n\n\t\t\t\t\tbm = ed.selection.getBookmark(1);\n\t\t\t\t});\n\n\t\t\t\tc.onHideMenu.add(function() {\n\t\t\t\t\tif (bm) {\n\t\t\t\t\t\ted.selection.moveToBookmark(bm);\n\t\t\t\t\t\tbm = 0;\n\t\t\t\t\t}\n\t\t\t\t});\n\t\t\t}\n\n\t\t\treturn t.add(c);\n\t\t},\n\n\t\t/**\n\t\t * Creates a list box control instance by id. A list box is either a native select element or a DOM/JS based list box control. This\n\t\t * depends on the use_native_selects settings state.\n\t\t *\n\t\t * @method createListBox\n\t\t * @param {String} id Unique id for the new listbox instance. For example \"styles\".\n\t\t * @param {Object} s Optional settings object for the control.\n\t\t * @param {Object} cc Optional control class to use instead of the default one.\n\t\t * @return {tinymce.ui.Control} Control instance that got created and added.\n\t\t */\n\t\tcreateListBox : function(id, s, cc) {\n\t\t\tvar t = this, ed = t.editor, cmd, c, cls;\n\n\t\t\tif (t.get(id))\n\t\t\t\treturn null;\n\n\t\t\ts.title = ed.translate(s.title);\n\t\t\ts.scope = s.scope || ed;\n\n\t\t\tif (!s.onselect) {\n\t\t\t\ts.onselect = function(v) {\n\t\t\t\t\ted.execCommand(s.cmd, s.ui || false, v || s.value);\n\t\t\t\t};\n\t\t\t}\n\n\t\t\ts = extend({\n\t\t\t\ttitle : s.title,\n\t\t\t\t'class' : 'mce_' + id,\n\t\t\t\tscope : s.scope,\n\t\t\t\tcontrol_manager : t\n\t\t\t}, s);\n\n\t\t\tid = t.prefix + id;\n\n\n\t\t\tfunction useNativeListForAccessibility(ed) {\n\t\t\t\treturn ed.settings.use_accessible_selects && !tinymce.isGecko\n\t\t\t}\n\n\t\t\tif (ed.settings.use_native_selects || useNativeListForAccessibility(ed))\n\t\t\t\tc = new tinymce.ui.NativeListBox(id, s);\n\t\t\telse {\n\t\t\t\tcls = cc || t._cls.listbox || tinymce.ui.ListBox;\n\t\t\t\tc = new cls(id, s, ed);\n\t\t\t}\n\n\t\t\tt.controls[id] = c;\n\n\t\t\t// Fix focus problem in Safari\n\t\t\tif (tinymce.isWebKit) {\n\t\t\t\tc.onPostRender.add(function(c, n) {\n\t\t\t\t\t// Store bookmark on mousedown\n\t\t\t\t\tEvent.add(n, 'mousedown', function() {\n\t\t\t\t\t\ted.bookmark = ed.selection.getBookmark(1);\n\t\t\t\t\t});\n\n\t\t\t\t\t// Restore on focus, since it might be lost\n\t\t\t\t\tEvent.add(n, 'focus', function() {\n\t\t\t\t\t\ted.selection.moveToBookmark(ed.bookmark);\n\t\t\t\t\t\ted.bookmark = null;\n\t\t\t\t\t});\n\t\t\t\t});\n\t\t\t}\n\n\t\t\tif (c.hideMenu)\n\t\t\t\ted.onMouseDown.add(c.hideMenu, c);\n\n\t\t\treturn t.add(c);\n\t\t},\n\n\t\t/**\n\t\t * Creates a button control instance by id.\n\t\t *\n\t\t * @method createButton\n\t\t * @param {String} id Unique id for the new button instance. For example \"bold\".\n\t\t * @param {Object} s Optional settings object for the control.\n\t\t * @param {Object} cc Optional control class to use instead of the default one.\n\t\t * @return {tinymce.ui.Control} Control instance that got created and added.\n\t\t */\n\t\tcreateButton : function(id, s, cc) {\n\t\t\tvar t = this, ed = t.editor, o, c, cls;\n\n\t\t\tif (t.get(id))\n\t\t\t\treturn null;\n\n\t\t\ts.title = ed.translate(s.title);\n\t\t\ts.label = ed.translate(s.label);\n\t\t\ts.scope = s.scope || ed;\n\n\t\t\tif (!s.onclick && !s.menu_button) {\n\t\t\t\ts.onclick = function() {\n\t\t\t\t\ted.execCommand(s.cmd, s.ui || false, s.value);\n\t\t\t\t};\n\t\t\t}\n\n\t\t\ts = extend({\n\t\t\t\ttitle : s.title,\n\t\t\t\t'class' : 'mce_' + id,\n\t\t\t\tunavailable_prefix : ed.getLang('unavailable', ''),\n\t\t\t\tscope : s.scope,\n\t\t\t\tcontrol_manager : t\n\t\t\t}, s);\n\n\t\t\tid = t.prefix + id;\n\n\t\t\tif (s.menu_button) {\n\t\t\t\tcls = cc || t._cls.menubutton || tinymce.ui.MenuButton;\n\t\t\t\tc = new cls(id, s, ed);\n\t\t\t\ted.onMouseDown.add(c.hideMenu, c);\n\t\t\t} else {\n\t\t\t\tcls = t._cls.button || tinymce.ui.Button;\n\t\t\t\tc = new cls(id, s, ed);\n\t\t\t}\n\n\t\t\treturn t.add(c);\n\t\t},\n\n\t\t/**\n\t\t * Creates a menu button control instance by id.\n\t\t *\n\t\t * @method createMenuButton\n\t\t * @param {String} id Unique id for the new menu button instance. For example \"menu1\".\n\t\t * @param {Object} s Optional settings object for the control.\n\t\t * @param {Object} cc Optional control class to use instead of the default one.\n\t\t * @return {tinymce.ui.Control} Control instance that got created and added.\n\t\t */\n\t\tcreateMenuButton : function(id, s, cc) {\n\t\t\ts = s || {};\n\t\t\ts.menu_button = 1;\n\n\t\t\treturn this.createButton(id, s, cc);\n\t\t},\n\n\t\t/**\n\t\t * Creates a split button control instance by id.\n\t\t *\n\t\t * @method createSplitButton\n\t\t * @param {String} id Unique id for the new split button instance. For example \"spellchecker\".\n\t\t * @param {Object} s Optional settings object for the control.\n\t\t * @param {Object} cc Optional control class to use instead of the default one.\n\t\t * @return {tinymce.ui.Control} Control instance that got created and added.\n\t\t */\n\t\tcreateSplitButton : function(id, s, cc) {\n\t\t\tvar t = this, ed = t.editor, cmd, c, cls;\n\n\t\t\tif (t.get(id))\n\t\t\t\treturn null;\n\n\t\t\ts.title = ed.translate(s.title);\n\t\t\ts.scope = s.scope || ed;\n\n\t\t\tif (!s.onclick) {\n\t\t\t\ts.onclick = function(v) {\n\t\t\t\t\ted.execCommand(s.cmd, s.ui || false, v || s.value);\n\t\t\t\t};\n\t\t\t}\n\n\t\t\tif (!s.onselect) {\n\t\t\t\ts.onselect = function(v) {\n\t\t\t\t\ted.execCommand(s.cmd, s.ui || false, v || s.value);\n\t\t\t\t};\n\t\t\t}\n\n\t\t\ts = extend({\n\t\t\t\ttitle : s.title,\n\t\t\t\t'class' : 'mce_' + id,\n\t\t\t\tscope : s.scope,\n\t\t\t\tcontrol_manager : t\n\t\t\t}, s);\n\n\t\t\tid = t.prefix + id;\n\t\t\tcls = cc || t._cls.splitbutton || tinymce.ui.SplitButton;\n\t\t\tc = t.add(new cls(id, s, ed));\n\t\t\ted.onMouseDown.add(c.hideMenu, c);\n\n\t\t\treturn c;\n\t\t},\n\n\t\t/**\n\t\t * Creates a color split button control instance by id.\n\t\t *\n\t\t * @method createColorSplitButton\n\t\t * @param {String} id Unique id for the new color split button instance. For example \"forecolor\".\n\t\t * @param {Object} s Optional settings object for the control.\n\t\t * @param {Object} cc Optional control class to use instead of the default one.\n\t\t * @return {tinymce.ui.Control} Control instance that got created and added.\n\t\t */\n\t\tcreateColorSplitButton : function(id, s, cc) {\n\t\t\tvar t = this, ed = t.editor, cmd, c, cls, bm;\n\n\t\t\tif (t.get(id))\n\t\t\t\treturn null;\n\n\t\t\ts.title = ed.translate(s.title);\n\t\t\ts.scope = s.scope || ed;\n\n\t\t\tif (!s.onclick) {\n\t\t\t\ts.onclick = function(v) {\n\t\t\t\t\tif (tinymce.isIE)\n\t\t\t\t\t\tbm = ed.selection.getBookmark(1);\n\n\t\t\t\t\ted.execCommand(s.cmd, s.ui || false, v || s.value);\n\t\t\t\t};\n\t\t\t}\n\n\t\t\tif (!s.onselect) {\n\t\t\t\ts.onselect = function(v) {\n\t\t\t\t\ted.execCommand(s.cmd, s.ui || false, v || s.value);\n\t\t\t\t};\n\t\t\t}\n\n\t\t\ts = extend({\n\t\t\t\ttitle : s.title,\n\t\t\t\t'class' : 'mce_' + id,\n\t\t\t\t'menu_class' : ed.getParam('skin') + 'Skin',\n\t\t\t\tscope : s.scope,\n\t\t\t\tmore_colors_title : ed.getLang('more_colors')\n\t\t\t}, s);\n\n\t\t\tid = t.prefix + id;\n\t\t\tcls = cc || t._cls.colorsplitbutton || tinymce.ui.ColorSplitButton;\n\t\t\tc = new cls(id, s, ed);\n\t\t\ted.onMouseDown.add(c.hideMenu, c);\n\n\t\t\t// Remove the menu element when the editor is removed\n\t\t\ted.onRemove.add(function() {\n\t\t\t\tc.destroy();\n\t\t\t});\n\n\t\t\t// Fix for bug #1897785, #1898007\n\t\t\tif (tinymce.isIE) {\n\t\t\t\tc.onShowMenu.add(function() {\n\t\t\t\t\t// IE 8 needs focus in order to store away a range with the current collapsed caret location\n\t\t\t\t\ted.focus();\n\t\t\t\t\tbm = ed.selection.getBookmark(1);\n\t\t\t\t});\n\n\t\t\t\tc.onHideMenu.add(function() {\n\t\t\t\t\tif (bm) {\n\t\t\t\t\t\ted.selection.moveToBookmark(bm);\n\t\t\t\t\t\tbm = 0;\n\t\t\t\t\t}\n\t\t\t\t});\n\t\t\t}\n\n\t\t\treturn t.add(c);\n\t\t},\n\n\t\t/**\n\t\t * Creates a toolbar container control instance by id.\n\t\t *\n\t\t * @method createToolbar\n\t\t * @param {String} id Unique id for the new toolbar container control instance. For example \"toolbar1\".\n\t\t * @param {Object} s Optional settings object for the control.\n\t\t * @param {Object} cc Optional control class to use instead of the default one.\n\t\t * @return {tinymce.ui.Control} Control instance that got created and added.\n\t\t */\n\t\tcreateToolbar : function(id, s, cc) {\n\t\t\tvar c, t = this, cls;\n\n\t\t\tid = t.prefix + id;\n\t\t\tcls = cc || t._cls.toolbar || tinymce.ui.Toolbar;\n\t\t\tc = new cls(id, s, t.editor);\n\n\t\t\tif (t.get(id))\n\t\t\t\treturn null;\n\n\t\t\treturn t.add(c);\n\t\t},\n\t\t\n\t\tcreateToolbarGroup : function(id, s, cc) {\n\t\t\tvar c, t = this, cls;\n\t\t\tid = t.prefix + id;\n\t\t\tcls = cc || this._cls.toolbarGroup || tinymce.ui.ToolbarGroup;\n\t\t\tc = new cls(id, s, t.editor);\n\t\t\t\n\t\t\tif (t.get(id))\n\t\t\t\treturn null;\n\t\t\t\n\t\t\treturn t.add(c);\n\t\t},\n\n\t\t/**\n\t\t * Creates a separator control instance.\n\t\t *\n\t\t * @method createSeparator\n\t\t * @param {Object} cc Optional control class to use instead of the default one.\n\t\t * @return {tinymce.ui.Control} Control instance that got created and added.\n\t\t */\n\t\tcreateSeparator : function(cc) {\n\t\t\tvar cls = cc || this._cls.separator || tinymce.ui.Separator;\n\n\t\t\treturn new cls();\n\t\t},\n\n\t\t/**\n\t\t * Overrides a specific control type with a custom class.\n\t\t *\n\t\t * @method setControlType\n\t\t * @param {string} n Name of the control to override for example button or dropmenu.\n\t\t * @param {function} c Class reference to use instead of the default one.\n\t\t * @return {function} Same as the class reference.\n\t\t */\n\t\tsetControlType : function(n, c) {\n\t\t\treturn this._cls[n.toLowerCase()] = c;\n\t\t},\n\t\n\t\t/**\n\t\t * Destroy.\n\t\t *\n\t\t * @method destroy\n\t\t */\n\t\tdestroy : function() {\n\t\t\teach(this.controls, function(c) {\n\t\t\t\tc.destroy();\n\t\t\t});\n\n\t\t\tthis.controls = null;\n\t\t}\n\t});\n})(tinymce);\n"}
}});
