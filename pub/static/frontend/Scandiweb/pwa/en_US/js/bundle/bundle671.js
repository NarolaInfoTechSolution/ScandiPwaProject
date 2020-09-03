require.config({"config": {
        "jsbuild":{"Magento_Tinymce3/tiny_mce/classes/xml/Parser.js":"/**\n * Parser.js\n *\n * Copyright 2009, Moxiecode Systems AB\n * Released under LGPL License.\n *\n * License: http://tinymce.moxiecode.com/license\n * Contributing: http://tinymce.moxiecode.com/contributing\n */\n\n(function() {\n\t/**\n\t * XML Parser class. This class is only available for the dev version of TinyMCE.\n\t */\n\ttinymce.create('tinymce.xml.Parser', {\n\t\t/**\n\t\t * Constucts a new XML parser instance.\n\t\t *\n\t\t * @param {Object} Optional settings object.\n\t\t */\n\t\tParser : function(s) {\n\t\t\tthis.settings = tinymce.extend({\n\t\t\t\tasync : true\n\t\t\t}, s);\n\t\t},\n\n\t\t/**\n\t\t * Parses the specified document and executed the callback ones it's parsed.\n\t\t *\n\t\t * @param {String} u URL to XML file to parse.\n\t\t * @param {function} cb Optional callback to execute ones the XML file is loaded.\n\t\t * @param {Object} s Optional scope for the callback execution.\n\t\t */\n\t\tload : function(u, cb, s) {\n\t\t\tvar doc, t, w = window, c = 0;\n\n\t\t\ts = s || this;\n\n\t\t\t// Explorer, use XMLDOM since it can be used on local fs\n\t\t\tif (window.ActiveXObject) {\n\t\t\t\tdoc = new ActiveXObject(\"Microsoft.XMLDOM\");\n\t\t\t\tdoc.async = this.settings.async;\n\n\t\t\t\t// Wait for response\n\t\t\t\tif (doc.async) {\n\t\t\t\t\tfunction check() {\n\t\t\t\t\t\tif (doc.readyState == 4 || c++ > 10000)\n\t\t\t\t\t\t\treturn cb.call(s, doc);\n\n\t\t\t\t\t\tw.setTimeout(check, 10);\n\t\t\t\t\t};\n\n\t\t\t\t\tt = w.setTimeout(check, 10);\n\t\t\t\t}\n\n\t\t\t\tdoc.load(u);\n\n\t\t\t\tif (!doc.async)\n\t\t\t\t\tcb.call(s, doc);\n\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\t// W3C using XMLHttpRequest\n\t\t\tif (window.XMLHttpRequest) {\n\t\t\t\ttry {\n\t\t\t\t\tdoc = new window.XMLHttpRequest();\n\t\t\t\t\tdoc.open('GET', u, this.settings.async);\n\t\t\t\t\tdoc.async = this.settings.async;\n\n\t\t\t\t\tdoc.onload = function() {\n\t\t\t\t\t\tcb.call(s, doc.responseXML);\n\t\t\t\t\t};\n\n\t\t\t\t\tdoc.send('');\n\t\t\t\t} catch (ex) {\n\t\t\t\t\tcb.call(s, null, ex);\n\t\t\t\t}\n\t\t\t}\n\t\t},\n\n\t\t/**\n\t\t * Parses the specified XML string.\n\t\t *\n\t\t * @param {String} xml XML String to parse.\n\t\t * @return {Document} XML Document instance.\n\t\t */\n\t\tloadXML : function(xml) {\n\t\t\tvar doc;\n\n\t\t\t// W3C\n\t\t\tif (window.DOMParser)\n\t\t\t\treturn new DOMParser().parseFromString(xml, \"text/xml\");\n\n\t\t\t// Explorer\n\t\t\tif (window.ActiveXObject) {\n\t\t\t\tdoc = new ActiveXObject(\"Microsoft.XMLDOM\");\n\t\t\t\tdoc.async = \"false\";\n\t\t\t\tdoc.loadXML(xml);\n\n\t\t\t\treturn doc;\n\t\t\t}\n\t\t},\n\n\t\t/**\n\t\t * Returns all string contents of a element concated together.\n\t\t *\n\t\t * @param {XMLNode} el XML element to retrieve text from.\n\t\t * @return {string} XML element text contents.\n\t\t */\n\t\tgetText : function(el) {\n\t\t\tvar o = '';\n\n\t\t\tif (!el)\n\t\t\t\treturn '';\n\n\t\t\tif (el.hasChildNodes()) {\n\t\t\t\tel = el.firstChild;\n\n\t\t\t\tdo {\n\t\t\t\t\tif (el.nodeType == 3 || el.nodeType == 4)\n\t\t\t\t\t\to += el.nodeValue;\n\t\t\t\t} while(el = el.nextSibling);\n\t\t\t}\n\n\t\t\treturn o;\n\t\t}\n\t});\n})();\n"}
}});