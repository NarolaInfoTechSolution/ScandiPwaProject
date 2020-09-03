require.config({"config": {
        "jsbuild":{"Magento_Tinymce3/tiny_mce/plugins/table/js/row.js":"tinyMCEPopup.requireLangPack();\n\nfunction init() {\n\ttinyMCEPopup.resizeToInnerSize();\n\n\tdocument.getElementById('backgroundimagebrowsercontainer').innerHTML = getBrowserHTML('backgroundimagebrowser','backgroundimage','image','table');\n\tdocument.getElementById('bgcolor_pickcontainer').innerHTML = getColorPickerHTML('bgcolor_pick','bgcolor');\n\n\tvar inst = tinyMCEPopup.editor;\n\tvar dom = inst.dom;\n\tvar trElm = dom.getParent(inst.selection.getStart(), \"tr\");\n\tvar formObj = document.forms[0];\n\tvar st = dom.parseStyle(dom.getAttrib(trElm, \"style\"));\n\n\t// Get table row data\n\tvar rowtype = trElm.parentNode.nodeName.toLowerCase();\n\tvar align = dom.getAttrib(trElm, 'align');\n\tvar valign = dom.getAttrib(trElm, 'valign');\n\tvar height = trimSize(getStyle(trElm, 'height', 'height'));\n\tvar className = dom.getAttrib(trElm, 'class');\n\tvar bgcolor = convertRGBToHex(getStyle(trElm, 'bgcolor', 'backgroundColor'));\n\tvar backgroundimage = getStyle(trElm, 'background', 'backgroundImage').replace(new RegExp(\"url\\\\(['\\\"]?([^'\\\"]*)['\\\"]?\\\\)\", 'gi'), \"$1\");\n\tvar id = dom.getAttrib(trElm, 'id');\n\tvar lang = dom.getAttrib(trElm, 'lang');\n\tvar dir = dom.getAttrib(trElm, 'dir');\n\n\tselectByValue(formObj, 'rowtype', rowtype);\n\n\t// Any cells selected\n\tif (dom.select('td.mceSelected,th.mceSelected', trElm).length == 0) {\n\t\t// Setup form\n\t\taddClassesToList('class', 'table_row_styles');\n\t\tTinyMCE_EditableSelects.init();\n\n\t\tformObj.bgcolor.value = bgcolor;\n\t\tformObj.backgroundimage.value = backgroundimage;\n\t\tformObj.height.value = height;\n\t\tformObj.id.value = id;\n\t\tformObj.lang.value = lang;\n\t\tformObj.style.value = dom.serializeStyle(st);\n\t\tselectByValue(formObj, 'align', align);\n\t\tselectByValue(formObj, 'valign', valign);\n\t\tselectByValue(formObj, 'class', className, true, true);\n\t\tselectByValue(formObj, 'dir', dir);\n\n\t\t// Resize some elements\n\t\tif (isVisible('backgroundimagebrowser'))\n\t\t\tdocument.getElementById('backgroundimage').style.width = '180px';\n\n\t\tupdateColor('bgcolor_pick', 'bgcolor');\n\t} else\n\t\ttinyMCEPopup.dom.hide('action');\n}\n\nfunction updateAction() {\n\tvar inst = tinyMCEPopup.editor, dom = inst.dom, trElm, tableElm, formObj = document.forms[0];\n\tvar action = getSelectValue(formObj, 'action');\n\n\tif (!AutoValidator.validate(formObj)) {\n\t\ttinyMCEPopup.alert(AutoValidator.getErrorMessages(formObj).join('. ') + '.');\n\t\treturn false;\n\t}\n\n\ttinyMCEPopup.restoreSelection();\n\ttrElm = dom.getParent(inst.selection.getStart(), \"tr\");\n\ttableElm = dom.getParent(inst.selection.getStart(), \"table\");\n\n\t// Update all selected rows\n\tif (dom.select('td.mceSelected,th.mceSelected', trElm).length > 0) {\n\t\ttinymce.each(tableElm.rows, function(tr) {\n\t\t\tvar i;\n\n\t\t\tfor (i = 0; i < tr.cells.length; i++) {\n\t\t\t\tif (dom.hasClass(tr.cells[i], 'mceSelected')) {\n\t\t\t\t\tupdateRow(tr, true);\n\t\t\t\t\treturn;\n\t\t\t\t}\n\t\t\t}\n\t\t});\n\n\t\tinst.addVisual();\n\t\tinst.nodeChanged();\n\t\tinst.execCommand('mceEndUndoLevel');\n\t\ttinyMCEPopup.close();\n\t\treturn;\n\t}\n\n\tswitch (action) {\n\t\tcase \"row\":\n\t\t\tupdateRow(trElm);\n\t\t\tbreak;\n\n\t\tcase \"all\":\n\t\t\tvar rows = tableElm.getElementsByTagName(\"tr\");\n\n\t\t\tfor (var i=0; i<rows.length; i++)\n\t\t\t\tupdateRow(rows[i], true);\n\n\t\t\tbreak;\n\n\t\tcase \"odd\":\n\t\tcase \"even\":\n\t\t\tvar rows = tableElm.getElementsByTagName(\"tr\");\n\n\t\t\tfor (var i=0; i<rows.length; i++) {\n\t\t\t\tif ((i % 2 == 0 && action == \"odd\") || (i % 2 != 0 && action == \"even\"))\n\t\t\t\t\tupdateRow(rows[i], true, true);\n\t\t\t}\n\n\t\t\tbreak;\n\t}\n\n\tinst.addVisual();\n\tinst.nodeChanged();\n\tinst.execCommand('mceEndUndoLevel');\n\ttinyMCEPopup.close();\n}\n\nfunction updateRow(tr_elm, skip_id, skip_parent) {\n\tvar inst = tinyMCEPopup.editor;\n\tvar formObj = document.forms[0];\n\tvar dom = inst.dom;\n\tvar curRowType = tr_elm.parentNode.nodeName.toLowerCase();\n\tvar rowtype = getSelectValue(formObj, 'rowtype');\n\tvar doc = inst.getDoc();\n\n\t// Update row element\n\tif (!skip_id)\n\t\tdom.setAttrib(tr_elm, 'id', formObj.id.value);\n\n\tdom.setAttrib(tr_elm, 'align', getSelectValue(formObj, 'align'));\n\tdom.setAttrib(tr_elm, 'vAlign', getSelectValue(formObj, 'valign'));\n\tdom.setAttrib(tr_elm, 'lang', formObj.lang.value);\n\tdom.setAttrib(tr_elm, 'dir', getSelectValue(formObj, 'dir'));\n\tdom.setAttrib(tr_elm, 'style', dom.serializeStyle(dom.parseStyle(formObj.style.value)));\n\tdom.setAttrib(tr_elm, 'class', getSelectValue(formObj, 'class'));\n\n\t// Clear deprecated attributes\n\tdom.setAttrib(tr_elm, 'background', '');\n\tdom.setAttrib(tr_elm, 'bgColor', '');\n\tdom.setAttrib(tr_elm, 'height', '');\n\n\t// Set styles\n\ttr_elm.style.height = getCSSSize(formObj.height.value);\n\ttr_elm.style.backgroundColor = formObj.bgcolor.value;\n\n\tif (formObj.backgroundimage.value != \"\")\n\t\ttr_elm.style.backgroundImage = \"url('\" + formObj.backgroundimage.value + \"')\";\n\telse\n\t\ttr_elm.style.backgroundImage = '';\n\n\t// Setup new rowtype\n\tif (curRowType != rowtype && !skip_parent) {\n\t\t// first, clone the node we are working on\n\t\tvar newRow = tr_elm.cloneNode(1);\n\n\t\t// next, find the parent of its new destination (creating it if necessary)\n\t\tvar theTable = dom.getParent(tr_elm, \"table\");\n\t\tvar dest = rowtype;\n\t\tvar newParent = null;\n\t\tfor (var i = 0; i < theTable.childNodes.length; i++) {\n\t\t\tif (theTable.childNodes[i].nodeName.toLowerCase() == dest)\n\t\t\t\tnewParent = theTable.childNodes[i];\n\t\t}\n\n\t\tif (newParent == null) {\n\t\t\tnewParent = doc.createElement(dest);\n\n\t\t\tif (theTable.firstChild.nodeName == 'CAPTION')\n\t\t\t\tinst.dom.insertAfter(newParent, theTable.firstChild);\n\t\t\telse\n\t\t\t\ttheTable.insertBefore(newParent, theTable.firstChild);\n\t\t}\n\n\t\t// append the row to the new parent\n\t\tnewParent.appendChild(newRow);\n\n\t\t// remove the original\n\t\ttr_elm.parentNode.removeChild(tr_elm);\n\n\t\t// set tr_elm to the new node\n\t\ttr_elm = newRow;\n\t}\n\n\tdom.setAttrib(tr_elm, 'style', dom.serializeStyle(dom.parseStyle(tr_elm.style.cssText)));\n}\n\nfunction changedBackgroundImage() {\n\tvar formObj = document.forms[0], dom = tinyMCEPopup.editor.dom;\n\tvar st = dom.parseStyle(formObj.style.value);\n\n\tst['background-image'] = \"url('\" + formObj.backgroundimage.value + \"')\";\n\n\tformObj.style.value = dom.serializeStyle(st);\n}\n\nfunction changedStyle() {\n\tvar formObj = document.forms[0], dom = tinyMCEPopup.editor.dom;\n\tvar st = dom.parseStyle(formObj.style.value);\n\n\tif (st['background-image'])\n\t\tformObj.backgroundimage.value = st['background-image'].replace(new RegExp(\"url\\\\('?([^']*)'?\\\\)\", 'gi'), \"$1\");\n\telse\n\t\tformObj.backgroundimage.value = '';\n\n\tif (st['height'])\n\t\tformObj.height.value = trimSize(st['height']);\n\n\tif (st['background-color']) {\n\t\tformObj.bgcolor.value = st['background-color'];\n\t\tupdateColor('bgcolor_pick','bgcolor');\n\t}\n}\n\nfunction changedSize() {\n\tvar formObj = document.forms[0], dom = tinyMCEPopup.editor.dom;\n\tvar st = dom.parseStyle(formObj.style.value);\n\n\tvar height = formObj.height.value;\n\tif (height != \"\")\n\t\tst['height'] = getCSSSize(height);\n\telse\n\t\tst['height'] = \"\";\n\n\tformObj.style.value = dom.serializeStyle(st);\n}\n\nfunction changedColor() {\n\tvar formObj = document.forms[0], dom = tinyMCEPopup.editor.dom;\n\tvar st = dom.parseStyle(formObj.style.value);\n\n\tst['background-color'] = formObj.bgcolor.value;\n\n\tformObj.style.value = dom.serializeStyle(st);\n}\n\ntinyMCEPopup.onInit.add(init);\n"}
}});