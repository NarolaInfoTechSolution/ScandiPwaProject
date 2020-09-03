require.config({"config": {
        "jsbuild":{"Magento_Tinymce3/tiny_mce/classes/ui/Container.js":"/**\n * Container.js\n *\n * Copyright 2009, Moxiecode Systems AB\n * Released under LGPL License.\n *\n * License: http://tinymce.moxiecode.com/license\n * Contributing: http://tinymce.moxiecode.com/contributing\n */\n\n/**\n * This class is the base class for all container controls like toolbars. This class should not\n * be instantiated directly other container controls should inherit from this one.\n *\n * @class tinymce.ui.Container\n * @extends tinymce.ui.Control\n */\ntinymce.create('tinymce.ui.Container:tinymce.ui.Control', {\n\t/**\n\t * Base contrustor a new container control instance.\n\t *\n\t * @constructor\n\t * @method Container\n\t * @param {String} id Control id to use for the container.\n\t * @param {Object} s Optional name/value settings object.\n\t */\n\tContainer : function(id, s, editor) {\n\t\tthis.parent(id, s, editor);\n\n\t\t/**\n\t\t * Array of controls added to the container.\n\t\t *\n\t\t * @property controls\n\t\t * @type Array\n\t\t */\n\t\tthis.controls = [];\n\n\t\tthis.lookup = {};\n\t},\n\n\t/**\n\t * Adds a control to the collection of controls for the container.\n\t *\n\t * @method add\n\t * @param {tinymce.ui.Control} c Control instance to add to the container.\n\t * @return {tinymce.ui.Control} Same control instance that got passed in.\n\t */\n\tadd : function(c) {\n\t\tthis.lookup[c.id] = c;\n\t\tthis.controls.push(c);\n\n\t\treturn c;\n\t},\n\n\t/**\n\t * Returns a control by id from the containers collection.\n\t *\n\t * @method get\n\t * @param {String} n Id for the control to retrieve.\n\t * @return {tinymce.ui.Control} Control instance by the specified name or undefined if it wasn't found.\n\t */\n\tget : function(n) {\n\t\treturn this.lookup[n];\n\t}\n});\n\n"}
}});