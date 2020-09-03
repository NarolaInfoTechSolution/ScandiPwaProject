require.config({"config": {
        "jsbuild":{"Magento_Tinymce3/tiny_mce/plugins/print/editor_plugin_src.js":"/**\n * editor_plugin_src.js\n *\n * Copyright 2009, Moxiecode Systems AB\n * Released under LGPL License.\n *\n * License: http://tinymce.moxiecode.com/license\n * Contributing: http://tinymce.moxiecode.com/contributing\n */\n\n(function() {\n\ttinymce.create('tinymce.plugins.Print', {\n\t\tinit : function(ed, url) {\n\t\t\ted.addCommand('mcePrint', function() {\n\t\t\t\ted.getWin().print();\n\t\t\t});\n\n\t\t\ted.addButton('print', {title : 'print.print_desc', cmd : 'mcePrint'});\n\t\t},\n\n\t\tgetInfo : function() {\n\t\t\treturn {\n\t\t\t\tlongname : 'Print',\n\t\t\t\tauthor : 'Moxiecode Systems AB',\n\t\t\t\tauthorurl : 'http://tinymce.moxiecode.com',\n\t\t\t\tinfourl : 'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/print',\n\t\t\t\tversion : tinymce.majorVersion + \".\" + tinymce.minorVersion\n\t\t\t};\n\t\t}\n\t});\n\n\t// Register plugin\n\ttinymce.PluginManager.add('print', tinymce.plugins.Print);\n})();\n"}
}});