require.config({"config": {
        "jsbuild":{"Magento_Tinymce3/tiny_mce/plugins/advimage/editor_plugin_src.js":"/**\n * editor_plugin_src.js\n *\n * Copyright 2009, Moxiecode Systems AB\n * Released under LGPL License.\n *\n * License: http://tinymce.moxiecode.com/license\n * Contributing: http://tinymce.moxiecode.com/contributing\n */\n\n(function() {\n\ttinymce.create('tinymce.plugins.AdvancedImagePlugin', {\n\t\tinit : function(ed, url) {\n\t\t\t// Register commands\n\t\t\ted.addCommand('mceAdvImage', function() {\n\t\t\t\t// Internal image object like a flash placeholder\n\t\t\t\tif (ed.dom.getAttrib(ed.selection.getNode(), 'class', '').indexOf('mceItem') != -1)\n\t\t\t\t\treturn;\n\n\t\t\t\ted.windowManager.open({\n\t\t\t\t\tfile : url + '/image.htm',\n\t\t\t\t\twidth : 480 + parseInt(ed.getLang('advimage.delta_width', 0)),\n\t\t\t\t\theight : 385 + parseInt(ed.getLang('advimage.delta_height', 0)),\n\t\t\t\t\tinline : 1\n\t\t\t\t}, {\n\t\t\t\t\tplugin_url : url\n\t\t\t\t});\n\t\t\t});\n\n\t\t\t// Register buttons\n\t\t\ted.addButton('image', {\n\t\t\t\ttitle : 'advimage.image_desc',\n\t\t\t\tcmd : 'mceAdvImage'\n\t\t\t});\n\t\t},\n\n\t\tgetInfo : function() {\n\t\t\treturn {\n\t\t\t\tlongname : 'Advanced image',\n\t\t\t\tauthor : 'Moxiecode Systems AB',\n\t\t\t\tauthorurl : 'http://tinymce.moxiecode.com',\n\t\t\t\tinfourl : 'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/advimage',\n\t\t\t\tversion : tinymce.majorVersion + \".\" + tinymce.minorVersion\n\t\t\t};\n\t\t}\n\t});\n\n\t// Register plugin\n\ttinymce.PluginManager.add('advimage', tinymce.plugins.AdvancedImagePlugin);\n})();"}
}});
