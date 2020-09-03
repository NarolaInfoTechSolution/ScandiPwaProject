require.config({"config": {
        "jsbuild":{"Magento_Tinymce3/tiny_mce/utils/mctabs.js":"/**\n * mctabs.js\n *\n * Copyright 2009, Moxiecode Systems AB\n * Released under LGPL License.\n *\n * License: http://tinymce.moxiecode.com/license\n * Contributing: http://tinymce.moxiecode.com/contributing\n */\n\nfunction MCTabs() {\n\tthis.settings = [];\n\tthis.onChange = tinyMCEPopup.editor.windowManager.createInstance('tinymce.util.Dispatcher');\n};\n\nMCTabs.prototype.init = function(settings) {\n\tthis.settings = settings;\n};\n\nMCTabs.prototype.getParam = function(name, default_value) {\n\tvar value = null;\n\n\tvalue = (typeof(this.settings[name]) == \"undefined\") ? default_value : this.settings[name];\n\n\t// Fix bool values\n\tif (value == \"true\" || value == \"false\")\n\t\treturn (value == \"true\");\n\n\treturn value;\n};\n\nMCTabs.prototype.showTab =function(tab){\n\ttab.className = 'current';\n\ttab.setAttribute(\"aria-selected\", true);\n\ttab.setAttribute(\"aria-expanded\", true);\n\ttab.tabIndex = 0;\n};\n\nMCTabs.prototype.hideTab =function(tab){\n\tvar t=this;\n\n\ttab.className = '';\n\ttab.setAttribute(\"aria-selected\", false);\n\ttab.setAttribute(\"aria-expanded\", false);\n\ttab.tabIndex = -1;\n};\n\nMCTabs.prototype.showPanel = function(panel) {\n\tpanel.className = 'current'; \n\tpanel.setAttribute(\"aria-hidden\", false);\n};\n\nMCTabs.prototype.hidePanel = function(panel) {\n\tpanel.className = 'panel';\n\tpanel.setAttribute(\"aria-hidden\", true);\n}; \n\nMCTabs.prototype.getPanelForTab = function(tabElm) {\n\treturn tinyMCEPopup.dom.getAttrib(tabElm, \"aria-controls\");\n};\n\nMCTabs.prototype.displayTab = function(tab_id, panel_id, avoid_focus) {\n\tvar panelElm, panelContainerElm, tabElm, tabContainerElm, selectionClass, nodes, i, t = this;\n\n\ttabElm = document.getElementById(tab_id);\n\n\tif (panel_id === undefined) {\n\t\tpanel_id = t.getPanelForTab(tabElm);\n\t}\n\n\tpanelElm= document.getElementById(panel_id);\n\tpanelContainerElm = panelElm ? panelElm.parentNode : null;\n\ttabContainerElm = tabElm ? tabElm.parentNode : null;\n\tselectionClass = t.getParam('selection_class', 'current');\n\n\tif (tabElm && tabContainerElm) {\n\t\tnodes = tabContainerElm.childNodes;\n\n\t\t// Hide all other tabs\n\t\tfor (i = 0; i < nodes.length; i++) {\n\t\t\tif (nodes[i].nodeName == \"LI\") {\n\t\t\t\tt.hideTab(nodes[i]);\n\t\t\t}\n\t\t}\n\n\t\t// Show selected tab\n\t\tt.showTab(tabElm);\n\t}\n\n\tif (panelElm && panelContainerElm) {\n\t\tnodes = panelContainerElm.childNodes;\n\n\t\t// Hide all other panels\n\t\tfor (i = 0; i < nodes.length; i++) {\n\t\t\tif (nodes[i].nodeName == \"DIV\")\n\t\t\t\tt.hidePanel(nodes[i]);\n\t\t}\n\n\t\tif (!avoid_focus) { \n\t\t\ttabElm.focus();\n\t\t}\n\n\t\t// Show selected panel\n\t\tt.showPanel(panelElm);\n\t}\n};\n\nMCTabs.prototype.getAnchor = function() {\n\tvar pos, url = document.location.href;\n\n\tif ((pos = url.lastIndexOf('#')) != -1)\n\t\treturn url.substring(pos + 1);\n\n\treturn \"\";\n};\n\n\n//Global instance\nvar mcTabs = new MCTabs();\n\ntinyMCEPopup.onInit.add(function() {\n\tvar tinymce = tinyMCEPopup.getWin().tinymce, dom = tinyMCEPopup.dom, each = tinymce.each;\n\n\teach(dom.select('div.tabs'), function(tabContainerElm) {\n\t\tvar keyNav;\n\n\t\tdom.setAttrib(tabContainerElm, \"role\", \"tablist\"); \n\n\t\tvar items = tinyMCEPopup.dom.select('li', tabContainerElm);\n\t\tvar action = function(id) {\n\t\t\tmcTabs.displayTab(id, mcTabs.getPanelForTab(id));\n\t\t\tmcTabs.onChange.dispatch(id);\n\t\t};\n\n\t\teach(items, function(item) {\n\t\t\tdom.setAttrib(item, 'role', 'tab');\n\t\t\tdom.bind(item, 'click', function(evt) {\n\t\t\t\taction(item.id);\n\t\t\t});\n\t\t});\n\n\t\tdom.bind(dom.getRoot(), 'keydown', function(evt) {\n\t\t\tif (evt.keyCode === 9 && evt.ctrlKey && !evt.altKey) { // Tab\n\t\t\t\tkeyNav.moveFocus(evt.shiftKey ? -1 : 1);\n\t\t\t\ttinymce.dom.Event.cancel(evt);\n\t\t\t}\n\t\t});\n\n\t\teach(dom.select('a', tabContainerElm), function(a) {\n\t\t\tdom.setAttrib(a, 'tabindex', '-1');\n\t\t});\n\n\t\tkeyNav = tinyMCEPopup.editor.windowManager.createInstance('tinymce.ui.KeyboardNavigation', {\n\t\t\troot: tabContainerElm,\n\t\t\titems: items,\n\t\t\tonAction: action,\n\t\t\tactOnFocus: true,\n\t\t\tenableLeftRight: true,\n\t\t\tenableUpDown: true\n\t\t}, tinyMCEPopup.dom);\n\t});\n});"}
}});