require.config({"config": {
        "jsbuild":{"Magento_Tinymce3/tiny_mce/plugins/advlink/js/advlink.js":"/* Functions for the advlink plugin popup */\n\ntinyMCEPopup.requireLangPack();\n\nvar templates = {\n\t\"window.open\" : \"window.open('${url}','${target}','${options}')\"\n};\n\nfunction preinit() {\n\tvar url;\n\n\tif (url = tinyMCEPopup.getParam(\"external_link_list_url\"))\n\t\tdocument.write('<script language=\"javascript\" type=\"text/javascript\" src=\"' + tinyMCEPopup.editor.documentBaseURI.toAbsolute(url) + '\"></script>');\n}\n\nfunction changeClass() {\n\tvar f = document.forms[0];\n\n\tf.classes.value = getSelectValue(f, 'classlist');\n}\n\nfunction init() {\n\ttinyMCEPopup.resizeToInnerSize();\n\n\tvar formObj = document.forms[0];\n\tvar inst = tinyMCEPopup.editor;\n\tvar elm = inst.selection.getNode();\n\tvar action = \"insert\";\n\tvar html;\n\n\tdocument.getElementById('hrefbrowsercontainer').innerHTML = getBrowserHTML('hrefbrowser','href','file','advlink');\n\tdocument.getElementById('popupurlbrowsercontainer').innerHTML = getBrowserHTML('popupurlbrowser','popupurl','file','advlink');\n\tdocument.getElementById('targetlistcontainer').innerHTML = getTargetListHTML('targetlist','target');\n\n\t// Link list\n\thtml = getLinkListHTML('linklisthref','href');\n\tif (html == \"\")\n\t\tdocument.getElementById(\"linklisthrefrow\").style.display = 'none';\n\telse\n\t\tdocument.getElementById(\"linklisthrefcontainer\").innerHTML = html;\n\n\t// Anchor list\n\thtml = getAnchorListHTML('anchorlist','href');\n\tif (html == \"\")\n\t\tdocument.getElementById(\"anchorlistrow\").style.display = 'none';\n\telse\n\t\tdocument.getElementById(\"anchorlistcontainer\").innerHTML = html;\n\n\t// Resize some elements\n\tif (isVisible('hrefbrowser'))\n\t\tdocument.getElementById('href').style.width = '260px';\n\n\tif (isVisible('popupurlbrowser'))\n\t\tdocument.getElementById('popupurl').style.width = '180px';\n\n\telm = inst.dom.getParent(elm, \"A\");\n\tif (elm != null && elm.nodeName == \"A\")\n\t\taction = \"update\";\n\n\tformObj.insert.value = tinyMCEPopup.getLang(action, 'Insert', true); \n\n\tsetPopupControlsDisabled(true);\n\n\tif (action == \"update\") {\n\t\tvar href = inst.dom.getAttrib(elm, 'href');\n\t\tvar onclick = inst.dom.getAttrib(elm, 'onclick');\n\n\t\t// Setup form data\n\t\tsetFormValue('href', href);\n\t\tsetFormValue('title', inst.dom.getAttrib(elm, 'title'));\n\t\tsetFormValue('id', inst.dom.getAttrib(elm, 'id'));\n\t\tsetFormValue('style', inst.dom.getAttrib(elm, \"style\"));\n\t\tsetFormValue('rel', inst.dom.getAttrib(elm, 'rel'));\n\t\tsetFormValue('rev', inst.dom.getAttrib(elm, 'rev'));\n\t\tsetFormValue('charset', inst.dom.getAttrib(elm, 'charset'));\n\t\tsetFormValue('hreflang', inst.dom.getAttrib(elm, 'hreflang'));\n\t\tsetFormValue('dir', inst.dom.getAttrib(elm, 'dir'));\n\t\tsetFormValue('lang', inst.dom.getAttrib(elm, 'lang'));\n\t\tsetFormValue('tabindex', inst.dom.getAttrib(elm, 'tabindex', typeof(elm.tabindex) != \"undefined\" ? elm.tabindex : \"\"));\n\t\tsetFormValue('accesskey', inst.dom.getAttrib(elm, 'accesskey', typeof(elm.accesskey) != \"undefined\" ? elm.accesskey : \"\"));\n\t\tsetFormValue('type', inst.dom.getAttrib(elm, 'type'));\n\t\tsetFormValue('onfocus', inst.dom.getAttrib(elm, 'onfocus'));\n\t\tsetFormValue('onblur', inst.dom.getAttrib(elm, 'onblur'));\n\t\tsetFormValue('onclick', onclick);\n\t\tsetFormValue('ondblclick', inst.dom.getAttrib(elm, 'ondblclick'));\n\t\tsetFormValue('onmousedown', inst.dom.getAttrib(elm, 'onmousedown'));\n\t\tsetFormValue('onmouseup', inst.dom.getAttrib(elm, 'onmouseup'));\n\t\tsetFormValue('onmouseover', inst.dom.getAttrib(elm, 'onmouseover'));\n\t\tsetFormValue('onmousemove', inst.dom.getAttrib(elm, 'onmousemove'));\n\t\tsetFormValue('onmouseout', inst.dom.getAttrib(elm, 'onmouseout'));\n\t\tsetFormValue('onkeypress', inst.dom.getAttrib(elm, 'onkeypress'));\n\t\tsetFormValue('onkeydown', inst.dom.getAttrib(elm, 'onkeydown'));\n\t\tsetFormValue('onkeyup', inst.dom.getAttrib(elm, 'onkeyup'));\n\t\tsetFormValue('target', inst.dom.getAttrib(elm, 'target'));\n\t\tsetFormValue('classes', inst.dom.getAttrib(elm, 'class'));\n\n\t\t// Parse onclick data\n\t\tif (onclick != null && onclick.indexOf('window.open') != -1)\n\t\t\tparseWindowOpen(onclick);\n\t\telse\n\t\t\tparseFunction(onclick);\n\n\t\t// Select by the values\n\t\tselectByValue(formObj, 'dir', inst.dom.getAttrib(elm, 'dir'));\n\t\tselectByValue(formObj, 'rel', inst.dom.getAttrib(elm, 'rel'));\n\t\tselectByValue(formObj, 'rev', inst.dom.getAttrib(elm, 'rev'));\n\t\tselectByValue(formObj, 'linklisthref', href);\n\n\t\tif (href.charAt(0) == '#')\n\t\t\tselectByValue(formObj, 'anchorlist', href);\n\n\t\taddClassesToList('classlist', 'advlink_styles');\n\n\t\tselectByValue(formObj, 'classlist', inst.dom.getAttrib(elm, 'class'), true);\n\t\tselectByValue(formObj, 'targetlist', inst.dom.getAttrib(elm, 'target'), true);\n\t} else\n\t\taddClassesToList('classlist', 'advlink_styles');\n}\n\nfunction checkPrefix(n) {\n\tif (n.value && Validator.isEmail(n) && !/^\\s*mailto:/i.test(n.value) && confirm(tinyMCEPopup.getLang('advlink_dlg.is_email')))\n\t\tn.value = 'mailto:' + n.value;\n\n\tif (/^\\s*www\\./i.test(n.value) && confirm(tinyMCEPopup.getLang('advlink_dlg.is_external')))\n\t\tn.value = 'http://' + n.value;\n}\n\nfunction setFormValue(name, value) {\n\tdocument.forms[0].elements[name].value = value;\n}\n\nfunction parseWindowOpen(onclick) {\n\tvar formObj = document.forms[0];\n\n\t// Preprocess center code\n\tif (onclick.indexOf('return false;') != -1) {\n\t\tformObj.popupreturn.checked = true;\n\t\tonclick = onclick.replace('return false;', '');\n\t} else\n\t\tformObj.popupreturn.checked = false;\n\n\tvar onClickData = parseLink(onclick);\n\n\tif (onClickData != null) {\n\t\tformObj.ispopup.checked = true;\n\t\tsetPopupControlsDisabled(false);\n\n\t\tvar onClickWindowOptions = parseOptions(onClickData['options']);\n\t\tvar url = onClickData['url'];\n\n\t\tformObj.popupname.value = onClickData['target'];\n\t\tformObj.popupurl.value = url;\n\t\tformObj.popupwidth.value = getOption(onClickWindowOptions, 'width');\n\t\tformObj.popupheight.value = getOption(onClickWindowOptions, 'height');\n\n\t\tformObj.popupleft.value = getOption(onClickWindowOptions, 'left');\n\t\tformObj.popuptop.value = getOption(onClickWindowOptions, 'top');\n\n\t\tif (formObj.popupleft.value.indexOf('screen') != -1)\n\t\t\tformObj.popupleft.value = \"c\";\n\n\t\tif (formObj.popuptop.value.indexOf('screen') != -1)\n\t\t\tformObj.popuptop.value = \"c\";\n\n\t\tformObj.popuplocation.checked = getOption(onClickWindowOptions, 'location') == \"yes\";\n\t\tformObj.popupscrollbars.checked = getOption(onClickWindowOptions, 'scrollbars') == \"yes\";\n\t\tformObj.popupmenubar.checked = getOption(onClickWindowOptions, 'menubar') == \"yes\";\n\t\tformObj.popupresizable.checked = getOption(onClickWindowOptions, 'resizable') == \"yes\";\n\t\tformObj.popuptoolbar.checked = getOption(onClickWindowOptions, 'toolbar') == \"yes\";\n\t\tformObj.popupstatus.checked = getOption(onClickWindowOptions, 'status') == \"yes\";\n\t\tformObj.popupdependent.checked = getOption(onClickWindowOptions, 'dependent') == \"yes\";\n\n\t\tbuildOnClick();\n\t}\n}\n\nfunction parseFunction(onclick) {\n\tvar formObj = document.forms[0];\n\tvar onClickData = parseLink(onclick);\n\n\t// TODO: Add stuff here\n}\n\nfunction getOption(opts, name) {\n\treturn typeof(opts[name]) == \"undefined\" ? \"\" : opts[name];\n}\n\nfunction setPopupControlsDisabled(state) {\n\tvar formObj = document.forms[0];\n\n\tformObj.popupname.disabled = state;\n\tformObj.popupurl.disabled = state;\n\tformObj.popupwidth.disabled = state;\n\tformObj.popupheight.disabled = state;\n\tformObj.popupleft.disabled = state;\n\tformObj.popuptop.disabled = state;\n\tformObj.popuplocation.disabled = state;\n\tformObj.popupscrollbars.disabled = state;\n\tformObj.popupmenubar.disabled = state;\n\tformObj.popupresizable.disabled = state;\n\tformObj.popuptoolbar.disabled = state;\n\tformObj.popupstatus.disabled = state;\n\tformObj.popupreturn.disabled = state;\n\tformObj.popupdependent.disabled = state;\n\n\tsetBrowserDisabled('popupurlbrowser', state);\n}\n\nfunction parseLink(link) {\n\tlink = link.replace(new RegExp('&#39;', 'g'), \"'\");\n\n\tvar fnName = link.replace(new RegExp(\"\\\\s*([A-Za-z0-9\\.]*)\\\\s*\\\\(.*\", \"gi\"), \"$1\");\n\n\t// Is function name a template function\n\tvar template = templates[fnName];\n\tif (template) {\n\t\t// Build regexp\n\t\tvar variableNames = template.match(new RegExp(\"'?\\\\$\\\\{[A-Za-z0-9\\.]*\\\\}'?\", \"gi\"));\n\t\tvar regExp = \"\\\\s*[A-Za-z0-9\\.]*\\\\s*\\\\(\";\n\t\tvar replaceStr = \"\";\n\t\tfor (var i=0; i<variableNames.length; i++) {\n\t\t\t// Is string value\n\t\t\tif (variableNames[i].indexOf(\"'${\") != -1)\n\t\t\t\tregExp += \"'(.*)'\";\n\t\t\telse // Number value\n\t\t\t\tregExp += \"([0-9]*)\";\n\n\t\t\treplaceStr += \"$\" + (i+1);\n\n\t\t\t// Cleanup variable name\n\t\t\tvariableNames[i] = variableNames[i].replace(new RegExp(\"[^A-Za-z0-9]\", \"gi\"), \"\");\n\n\t\t\tif (i != variableNames.length-1) {\n\t\t\t\tregExp += \"\\\\s*,\\\\s*\";\n\t\t\t\treplaceStr += \"<delim>\";\n\t\t\t} else\n\t\t\t\tregExp += \".*\";\n\t\t}\n\n\t\tregExp += \"\\\\);?\";\n\n\t\t// Build variable array\n\t\tvar variables = [];\n\t\tvariables[\"_function\"] = fnName;\n\t\tvar variableValues = link.replace(new RegExp(regExp, \"gi\"), replaceStr).split('<delim>');\n\t\tfor (var i=0; i<variableNames.length; i++)\n\t\t\tvariables[variableNames[i]] = variableValues[i];\n\n\t\treturn variables;\n\t}\n\n\treturn null;\n}\n\nfunction parseOptions(opts) {\n\tif (opts == null || opts == \"\")\n\t\treturn [];\n\n\t// Cleanup the options\n\topts = opts.toLowerCase();\n\topts = opts.replace(/;/g, \",\");\n\topts = opts.replace(/[^0-9a-z=,]/g, \"\");\n\n\tvar optionChunks = opts.split(',');\n\tvar options = [];\n\n\tfor (var i=0; i<optionChunks.length; i++) {\n\t\tvar parts = optionChunks[i].split('=');\n\n\t\tif (parts.length == 2)\n\t\t\toptions[parts[0]] = parts[1];\n\t}\n\n\treturn options;\n}\n\nfunction buildOnClick() {\n\tvar formObj = document.forms[0];\n\n\tif (!formObj.ispopup.checked) {\n\t\tformObj.onclick.value = \"\";\n\t\treturn;\n\t}\n\n\tvar onclick = \"window.open('\";\n\tvar url = formObj.popupurl.value;\n\n\tonclick += url + \"','\";\n\tonclick += formObj.popupname.value + \"','\";\n\n\tif (formObj.popuplocation.checked)\n\t\tonclick += \"location=yes,\";\n\n\tif (formObj.popupscrollbars.checked)\n\t\tonclick += \"scrollbars=yes,\";\n\n\tif (formObj.popupmenubar.checked)\n\t\tonclick += \"menubar=yes,\";\n\n\tif (formObj.popupresizable.checked)\n\t\tonclick += \"resizable=yes,\";\n\n\tif (formObj.popuptoolbar.checked)\n\t\tonclick += \"toolbar=yes,\";\n\n\tif (formObj.popupstatus.checked)\n\t\tonclick += \"status=yes,\";\n\n\tif (formObj.popupdependent.checked)\n\t\tonclick += \"dependent=yes,\";\n\n\tif (formObj.popupwidth.value != \"\")\n\t\tonclick += \"width=\" + formObj.popupwidth.value + \",\";\n\n\tif (formObj.popupheight.value != \"\")\n\t\tonclick += \"height=\" + formObj.popupheight.value + \",\";\n\n\tif (formObj.popupleft.value != \"\") {\n\t\tif (formObj.popupleft.value != \"c\")\n\t\t\tonclick += \"left=\" + formObj.popupleft.value + \",\";\n\t\telse\n\t\t\tonclick += \"left='+(screen.availWidth/2-\" + (formObj.popupwidth.value/2) + \")+',\";\n\t}\n\n\tif (formObj.popuptop.value != \"\") {\n\t\tif (formObj.popuptop.value != \"c\")\n\t\t\tonclick += \"top=\" + formObj.popuptop.value + \",\";\n\t\telse\n\t\t\tonclick += \"top='+(screen.availHeight/2-\" + (formObj.popupheight.value/2) + \")+',\";\n\t}\n\n\tif (onclick.charAt(onclick.length-1) == ',')\n\t\tonclick = onclick.substring(0, onclick.length-1);\n\n\tonclick += \"');\";\n\n\tif (formObj.popupreturn.checked)\n\t\tonclick += \"return false;\";\n\n\t// tinyMCE.debug(onclick);\n\n\tformObj.onclick.value = onclick;\n\n\tif (formObj.href.value == \"\")\n\t\tformObj.href.value = url;\n}\n\nfunction setAttrib(elm, attrib, value) {\n\tvar formObj = document.forms[0];\n\tvar valueElm = formObj.elements[attrib.toLowerCase()];\n\tvar dom = tinyMCEPopup.editor.dom;\n\n\tif (typeof(value) == \"undefined\" || value == null) {\n\t\tvalue = \"\";\n\n\t\tif (valueElm)\n\t\t\tvalue = valueElm.value;\n\t}\n\n\t// Clean up the style\n\tif (attrib == 'style')\n\t\tvalue = dom.serializeStyle(dom.parseStyle(value), 'a');\n\n\tdom.setAttrib(elm, attrib, value);\n}\n\nfunction getAnchorListHTML(id, target) {\n\tvar ed = tinyMCEPopup.editor, nodes = ed.dom.select('a'), name, i, len, html = \"\";\n\n\tfor (i=0, len=nodes.length; i<len; i++) {\n\t\tif ((name = ed.dom.getAttrib(nodes[i], \"name\")) != \"\")\n\t\t\thtml += '<option value=\"#' + name + '\">' + name + '</option>';\n\t}\n\n\tif (html == \"\")\n\t\treturn \"\";\n\n\thtml = '<select id=\"' + id + '\" name=\"' + id + '\" class=\"mceAnchorList\"'\n\t\t+ ' onchange=\"this.form.' + target + '.value=this.options[this.selectedIndex].value\"'\n\t\t+ '>'\n\t\t+ '<option value=\"\">---</option>'\n\t\t+ html\n\t\t+ '</select>';\n\n\treturn html;\n}\n\nfunction insertAction() {\n\tvar inst = tinyMCEPopup.editor;\n\tvar elm, elementArray, i;\n\n\telm = inst.selection.getNode();\n\tcheckPrefix(document.forms[0].href);\n\n\telm = inst.dom.getParent(elm, \"A\");\n\n\t// Remove element if there is no href\n\tif (!document.forms[0].href.value) {\n\t\ti = inst.selection.getBookmark();\n\t\tinst.dom.remove(elm, 1);\n\t\tinst.selection.moveToBookmark(i);\n\t\ttinyMCEPopup.execCommand(\"mceEndUndoLevel\");\n\t\ttinyMCEPopup.close();\n\t\treturn;\n\t}\n\n\t// Create new anchor elements\n\tif (elm == null) {\n\t\tinst.getDoc().execCommand(\"unlink\", false, null);\n\t\ttinyMCEPopup.execCommand(\"mceInsertLink\", false, \"#mce_temp_url#\", {skip_undo : 1});\n\n\t\telementArray = tinymce.grep(inst.dom.select(\"a\"), function(n) {return inst.dom.getAttrib(n, 'href') == '#mce_temp_url#';});\n\t\tfor (i=0; i<elementArray.length; i++)\n\t\t\tsetAllAttribs(elm = elementArray[i]);\n\t} else\n\t\tsetAllAttribs(elm);\n\n\t// Don't move caret if selection was image\n\tif (elm.childNodes.length != 1 || elm.firstChild.nodeName != 'IMG') {\n\t\tinst.focus();\n\t\tinst.selection.select(elm);\n\t\tinst.selection.collapse(0);\n\t\ttinyMCEPopup.storeSelection();\n\t}\n\n\ttinyMCEPopup.execCommand(\"mceEndUndoLevel\");\n\ttinyMCEPopup.close();\n}\n\nfunction setAllAttribs(elm) {\n\tvar formObj = document.forms[0];\n\tvar href = formObj.href.value.replace(/ /g, '%20');\n\tvar target = getSelectValue(formObj, 'targetlist');\n\n\tsetAttrib(elm, 'href', href);\n\tsetAttrib(elm, 'title');\n\tsetAttrib(elm, 'target', target == '_self' ? '' : target);\n\tsetAttrib(elm, 'id');\n\tsetAttrib(elm, 'style');\n\tsetAttrib(elm, 'class', getSelectValue(formObj, 'classlist'));\n\tsetAttrib(elm, 'rel');\n\tsetAttrib(elm, 'rev');\n\tsetAttrib(elm, 'charset');\n\tsetAttrib(elm, 'hreflang');\n\tsetAttrib(elm, 'dir');\n\tsetAttrib(elm, 'lang');\n\tsetAttrib(elm, 'tabindex');\n\tsetAttrib(elm, 'accesskey');\n\tsetAttrib(elm, 'type');\n\tsetAttrib(elm, 'onfocus');\n\tsetAttrib(elm, 'onblur');\n\tsetAttrib(elm, 'onclick');\n\tsetAttrib(elm, 'ondblclick');\n\tsetAttrib(elm, 'onmousedown');\n\tsetAttrib(elm, 'onmouseup');\n\tsetAttrib(elm, 'onmouseover');\n\tsetAttrib(elm, 'onmousemove');\n\tsetAttrib(elm, 'onmouseout');\n\tsetAttrib(elm, 'onkeypress');\n\tsetAttrib(elm, 'onkeydown');\n\tsetAttrib(elm, 'onkeyup');\n\n\t// Refresh in old MSIE\n\tif (tinyMCE.isMSIE5)\n\t\telm.outerHTML = elm.outerHTML;\n}\n\nfunction getSelectValue(form_obj, field_name) {\n\tvar elm = form_obj.elements[field_name];\n\n\tif (!elm || elm.options == null || elm.selectedIndex == -1)\n\t\treturn \"\";\n\n\treturn elm.options[elm.selectedIndex].value;\n}\n\nfunction getLinkListHTML(elm_id, target_form_element, onchange_func) {\n\tif (typeof(tinyMCELinkList) == \"undefined\" || tinyMCELinkList.length == 0)\n\t\treturn \"\";\n\n\tvar html = \"\";\n\n\thtml += '<select id=\"' + elm_id + '\" name=\"' + elm_id + '\"';\n\thtml += ' class=\"mceLinkList\" onfoc2us=\"tinyMCE.addSelectAccessibility(event, this, window);\" onchange=\"this.form.' + target_form_element + '.value=';\n\thtml += 'this.options[this.selectedIndex].value;';\n\n\tif (typeof(onchange_func) != \"undefined\")\n\t\thtml += onchange_func + '(\\'' + target_form_element + '\\',this.options[this.selectedIndex].text,this.options[this.selectedIndex].value);';\n\n\thtml += '\"><option value=\"\">---</option>';\n\n\tfor (var i=0; i<tinyMCELinkList.length; i++)\n\t\thtml += '<option value=\"' + tinyMCELinkList[i][1] + '\">' + tinyMCELinkList[i][0] + '</option>';\n\n\thtml += '</select>';\n\n\treturn html;\n\n\t// tinyMCE.debug('-- image list start --', html, '-- image list end --');\n}\n\nfunction getTargetListHTML(elm_id, target_form_element) {\n\tvar targets = tinyMCEPopup.getParam('theme_advanced_link_targets', '').split(';');\n\tvar html = '';\n\n\thtml += '<select id=\"' + elm_id + '\" name=\"' + elm_id + '\" onf2ocus=\"tinyMCE.addSelectAccessibility(event, this, window);\" onchange=\"this.form.' + target_form_element + '.value=';\n\thtml += 'this.options[this.selectedIndex].value;\">';\n\thtml += '<option value=\"_self\">' + tinyMCEPopup.getLang('advlink_dlg.target_same') + '</option>';\n\thtml += '<option value=\"_blank\">' + tinyMCEPopup.getLang('advlink_dlg.target_blank') + ' (_blank)</option>';\n\thtml += '<option value=\"_parent\">' + tinyMCEPopup.getLang('advlink_dlg.target_parent') + ' (_parent)</option>';\n\thtml += '<option value=\"_top\">' + tinyMCEPopup.getLang('advlink_dlg.target_top') + ' (_top)</option>';\n\n\tfor (var i=0; i<targets.length; i++) {\n\t\tvar key, value;\n\n\t\tif (targets[i] == \"\")\n\t\t\tcontinue;\n\n\t\tkey = targets[i].split('=')[0];\n\t\tvalue = targets[i].split('=')[1];\n\n\t\thtml += '<option value=\"' + key + '\">' + value + ' (' + key + ')</option>';\n\t}\n\n\thtml += '</select>';\n\n\treturn html;\n}\n\n// While loading\npreinit();\ntinyMCEPopup.onInit.add(init);\n"}
}});
