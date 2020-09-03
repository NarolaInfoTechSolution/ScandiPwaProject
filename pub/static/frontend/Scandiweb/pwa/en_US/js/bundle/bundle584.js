require.config({"config": {
        "jsbuild":{"Magento_Tinymce3/tiny_mce/plugins/searchreplace/js/searchreplace.js":"tinyMCEPopup.requireLangPack();\n\nvar SearchReplaceDialog = {\n\tinit : function(ed) {\n\t\tvar t = this, f = document.forms[0], m = tinyMCEPopup.getWindowArg(\"mode\");\n\n\t\tt.switchMode(m);\n\n\t\tf[m + '_panel_searchstring'].value = tinyMCEPopup.getWindowArg(\"search_string\");\n\n\t\t// Focus input field\n\t\tf[m + '_panel_searchstring'].focus();\n\t\t\n\t\tmcTabs.onChange.add(function(tab_id, panel_id) {\n\t\t\tt.switchMode(tab_id.substring(0, tab_id.indexOf('_')));\n\t\t});\n\t},\n\n\tswitchMode : function(m) {\n\t\tvar f, lm = this.lastMode;\n\n\t\tif (lm != m) {\n\t\t\tf = document.forms[0];\n\n\t\t\tif (lm) {\n\t\t\t\tf[m + '_panel_searchstring'].value = f[lm + '_panel_searchstring'].value;\n\t\t\t\tf[m + '_panel_backwardsu'].checked = f[lm + '_panel_backwardsu'].checked;\n\t\t\t\tf[m + '_panel_backwardsd'].checked = f[lm + '_panel_backwardsd'].checked;\n\t\t\t\tf[m + '_panel_casesensitivebox'].checked = f[lm + '_panel_casesensitivebox'].checked;\n\t\t\t}\n\n\t\t\tmcTabs.displayTab(m + '_tab',  m + '_panel');\n\t\t\tdocument.getElementById(\"replaceBtn\").style.display = (m == \"replace\") ? \"inline\" : \"none\";\n\t\t\tdocument.getElementById(\"replaceAllBtn\").style.display = (m == \"replace\") ? \"inline\" : \"none\";\n\t\t\tthis.lastMode = m;\n\t\t}\n\t},\n\n\tsearchNext : function(a) {\n\t\tvar ed = tinyMCEPopup.editor, se = ed.selection, r = se.getRng(), f, m = this.lastMode, s, b, fl = 0, w = ed.getWin(), wm = ed.windowManager, fo = 0;\n\n\t\t// Get input\n\t\tf = document.forms[0];\n\t\ts = f[m + '_panel_searchstring'].value;\n\t\tb = f[m + '_panel_backwardsu'].checked;\n\t\tca = f[m + '_panel_casesensitivebox'].checked;\n\t\trs = f['replace_panel_replacestring'].value;\n\n\t\tif (tinymce.isIE) {\n\t\t\tr = ed.getDoc().selection.createRange();\n\t\t}\n\n\t\tif (s == '')\n\t\t\treturn;\n\n\t\tfunction fix() {\n\t\t\t// Correct Firefox graphics glitches\n\t\t\t// TODO: Verify if this is actually needed any more, maybe it was for very old FF versions? \n\t\t\tr = se.getRng().cloneRange();\n\t\t\ted.getDoc().execCommand('SelectAll', false, null);\n\t\t\tse.setRng(r);\n\t\t};\n\n\t\tfunction replace() {\n\t\t\ted.selection.setContent(rs); // Needs to be duplicated due to selection bug in IE\n\t\t};\n\n\t\t// IE flags\n\t\tif (ca)\n\t\t\tfl = fl | 4;\n\n\t\tswitch (a) {\n\t\t\tcase 'all':\n\t\t\t\t// Move caret to beginning of text\n\t\t\t\ted.execCommand('SelectAll');\n\t\t\t\ted.selection.collapse(true);\n\n\t\t\t\tif (tinymce.isIE) {\n\t\t\t\t\ted.focus();\n\t\t\t\t\tr = ed.getDoc().selection.createRange();\n\n\t\t\t\t\twhile (r.findText(s, b ? -1 : 1, fl)) {\n\t\t\t\t\t\tr.scrollIntoView();\n\t\t\t\t\t\tr.select();\n\t\t\t\t\t\treplace();\n\t\t\t\t\t\tfo = 1;\n\n\t\t\t\t\t\tif (b) {\n\t\t\t\t\t\t\tr.moveEnd(\"character\", -(rs.length)); // Otherwise will loop forever\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\n\t\t\t\t\ttinyMCEPopup.storeSelection();\n\t\t\t\t} else {\n\t\t\t\t\twhile (w.find(s, ca, b, false, false, false, false)) {\n\t\t\t\t\t\treplace();\n\t\t\t\t\t\tfo = 1;\n\t\t\t\t\t}\n\t\t\t\t}\n\n\t\t\t\tif (fo)\n\t\t\t\t\ttinyMCEPopup.alert(ed.getLang('searchreplace_dlg.allreplaced'));\n\t\t\t\telse\n\t\t\t\t\ttinyMCEPopup.alert(ed.getLang('searchreplace_dlg.notfound'));\n\n\t\t\t\treturn;\n\n\t\t\tcase 'current':\n\t\t\t\tif (!ed.selection.isCollapsed())\n\t\t\t\t\treplace();\n\n\t\t\t\tbreak;\n\t\t}\n\n\t\tse.collapse(b);\n\t\tr = se.getRng();\n\n\t\t// Whats the point\n\t\tif (!s)\n\t\t\treturn;\n\n\t\tif (tinymce.isIE) {\n\t\t\ted.focus();\n\t\t\tr = ed.getDoc().selection.createRange();\n\n\t\t\tif (r.findText(s, b ? -1 : 1, fl)) {\n\t\t\t\tr.scrollIntoView();\n\t\t\t\tr.select();\n\t\t\t} else\n\t\t\t\ttinyMCEPopup.alert(ed.getLang('searchreplace_dlg.notfound'));\n\n\t\t\ttinyMCEPopup.storeSelection();\n\t\t} else {\n\t\t\tif (!w.find(s, ca, b, false, false, false, false))\n\t\t\t\ttinyMCEPopup.alert(ed.getLang('searchreplace_dlg.notfound'));\n\t\t\telse\n\t\t\t\tfix();\n\t\t}\n\t}\n};\n\ntinyMCEPopup.onInit.add(SearchReplaceDialog.init, SearchReplaceDialog);\n"}
}});