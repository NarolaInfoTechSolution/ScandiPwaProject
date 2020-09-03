require.config({"config": {
        "jsbuild":{"Magento_Tinymce3/tiny_mce/plugins/autosave/editor_plugin_src.js":"/**\n * editor_plugin_src.js\n *\n * Copyright 2009, Moxiecode Systems AB\n * Released under LGPL License.\n *\n * License: http://tinymce.moxiecode.com/license\n * Contributing: http://tinymce.moxiecode.com/contributing\n *\n * Adds auto-save capability to the TinyMCE text editor to rescue content\n * inadvertently lost. This plugin was originally developed by Speednet\n * and that project can be found here: http://code.google.com/p/tinyautosave/\n *\n * TECHNOLOGY DISCUSSION:\n * \n * The plugin attempts to use the most advanced features available in the current browser to save\n * as much content as possible.  There are a total of four different methods used to autosave the\n * content.  In order of preference, they are:\n * \n * 1. localStorage - A new feature of HTML 5, localStorage can store megabytes of data per domain\n * on the client computer. Data stored in the localStorage area has no expiration date, so we must\n * manage expiring the data ourselves.  localStorage is fully supported by IE8, and it is supposed\n * to be working in Firefox 3 and Safari 3.2, but in reality it is flaky in those browsers.  As\n * HTML 5 gets wider support, the AutoSave plugin will use it automatically. In Windows Vista/7,\n * localStorage is stored in the following folder:\n * C:\\Users\\[username]\\AppData\\Local\\Microsoft\\Internet Explorer\\DOMStore\\[tempFolder]\n * \n * 2. sessionStorage - A new feature of HTML 5, sessionStorage works similarly to localStorage,\n * except it is designed to expire after a certain amount of time.  Because the specification\n * around expiration date/time is very loosely-described, it is preferable to use locaStorage and\n * manage the expiration ourselves.  sessionStorage has similar storage characteristics to\n * localStorage, although it seems to have better support by Firefox 3 at the moment.  (That will\n * certainly change as Firefox continues getting better at HTML 5 adoption.)\n * \n * 3. UserData - A very under-exploited feature of Microsoft Internet Explorer, UserData is a\n * way to store up to 128K of data per \"document\", or up to 1MB of data per domain, on the client\n * computer.  The feature is available for IE 5+, which makes it available for every version of IE\n * supported by TinyMCE.  The content is persistent across browser restarts and expires on the\n * date/time specified, just like a cookie.  However, the data is not cleared when the user clears\n * cookies on the browser, which makes it well-suited for rescuing autosaved content.  UserData,\n * like other Microsoft IE browser technologies, is implemented as a behavior attached to a\n * specific DOM object, so in this case we attach the behavior to the same DOM element that the\n * TinyMCE editor instance is attached to.\n */\n\n(function(tinymce) {\n\t// Setup constants to help the compressor to reduce script size\n\tvar PLUGIN_NAME = 'autosave',\n\t\tRESTORE_DRAFT = 'restoredraft',\n\t\tTRUE = true,\n\t\tundefined,\n\t\tunloadHandlerAdded,\n\t\tDispatcher = tinymce.util.Dispatcher;\n\n\t/**\n\t * This plugin adds auto-save capability to the TinyMCE text editor to rescue content\n\t * inadvertently lost. By using localStorage.\n\t *\n\t * @class tinymce.plugins.AutoSave\n\t */\n\ttinymce.create('tinymce.plugins.AutoSave', {\n\t\t/**\n\t\t * Initializes the plugin, this will be executed after the plugin has been created.\n\t\t * This call is done before the editor instance has finished it's initialization so use the onInit event\n\t\t * of the editor instance to intercept that event.\n\t\t *\n\t\t * @method init\n\t\t * @param {tinymce.Editor} ed Editor instance that the plugin is initialized in.\n\t\t * @param {string} url Absolute URL to where the plugin is located.\n\t\t */\n\t\tinit : function(ed, url) {\n\t\t\tvar self = this, settings = ed.settings;\n\n\t\t\tself.editor = ed;\n\n\t\t\t// Parses the specified time string into a milisecond number 10m, 10s etc.\n\t\t\tfunction parseTime(time) {\n\t\t\t\tvar multipels = {\n\t\t\t\t\ts : 1000,\n\t\t\t\t\tm : 60000\n\t\t\t\t};\n\n\t\t\t\ttime = /^(\\d+)([ms]?)$/.exec('' + time);\n\n\t\t\t\treturn (time[2] ? multipels[time[2]] : 1) * parseInt(time);\n\t\t\t};\n\n\t\t\t// Default config\n\t\t\ttinymce.each({\n\t\t\t\task_before_unload : TRUE,\n\t\t\t\tinterval : '30s',\n\t\t\t\tretention : '20m',\n\t\t\t\tminlength : 50\n\t\t\t}, function(value, key) {\n\t\t\t\tkey = PLUGIN_NAME + '_' + key;\n\n\t\t\t\tif (settings[key] === undefined)\n\t\t\t\t\tsettings[key] = value;\n\t\t\t});\n\n\t\t\t// Parse times\n\t\t\tsettings.autosave_interval = parseTime(settings.autosave_interval);\n\t\t\tsettings.autosave_retention = parseTime(settings.autosave_retention);\n\n\t\t\t// Register restore button\n\t\t\ted.addButton(RESTORE_DRAFT, {\n\t\t\t\ttitle : PLUGIN_NAME + \".restore_content\",\n\t\t\t\tonclick : function() {\n\t\t\t\t\tif (ed.getContent({draft: true}).replace(/\\s|&nbsp;|<\\/?p[^>]*>|<br[^>]*>/gi, \"\").length > 0) {\n\t\t\t\t\t\t// Show confirm dialog if the editor isn't empty\n\t\t\t\t\t\ted.windowManager.confirm(\n\t\t\t\t\t\t\tPLUGIN_NAME + \".warning_message\",\n\t\t\t\t\t\t\tfunction(ok) {\n\t\t\t\t\t\t\t\tif (ok)\n\t\t\t\t\t\t\t\t\tself.restoreDraft();\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t);\n\t\t\t\t\t} else\n\t\t\t\t\t\tself.restoreDraft();\n\t\t\t\t}\n\t\t\t});\n\n\t\t\t// Enable/disable restoredraft button depending on if there is a draft stored or not\n\t\t\ted.onNodeChange.add(function() {\n\t\t\t\tvar controlManager = ed.controlManager;\n\n\t\t\t\tif (controlManager.get(RESTORE_DRAFT))\n\t\t\t\t\tcontrolManager.setDisabled(RESTORE_DRAFT, !self.hasDraft());\n\t\t\t});\n\n\t\t\ted.onInit.add(function() {\n\t\t\t\t// Check if the user added the restore button, then setup auto storage logic\n\t\t\t\tif (ed.controlManager.get(RESTORE_DRAFT)) {\n\t\t\t\t\t// Setup storage engine\n\t\t\t\t\tself.setupStorage(ed);\n\n\t\t\t\t\t// Auto save contents each interval time\n\t\t\t\t\tsetInterval(function() {\n\t\t\t\t\t\tself.storeDraft();\n\t\t\t\t\t\ted.nodeChanged();\n\t\t\t\t\t}, settings.autosave_interval);\n\t\t\t\t}\n\t\t\t});\n\n\t\t\t/**\n\t\t\t * This event gets fired when a draft is stored to local storage.\n\t\t\t *\n\t\t\t * @event onStoreDraft\n\t\t\t * @param {tinymce.plugins.AutoSave} sender Plugin instance sending the event.\n\t\t\t * @param {Object} draft Draft object containing the HTML contents of the editor.\n\t\t\t */\n\t\t\tself.onStoreDraft = new Dispatcher(self);\n\n\t\t\t/**\n\t\t\t * This event gets fired when a draft is restored from local storage.\n\t\t\t *\n\t\t\t * @event onStoreDraft\n\t\t\t * @param {tinymce.plugins.AutoSave} sender Plugin instance sending the event.\n\t\t\t * @param {Object} draft Draft object containing the HTML contents of the editor.\n\t\t\t */\n\t\t\tself.onRestoreDraft = new Dispatcher(self);\n\n\t\t\t/**\n\t\t\t * This event gets fired when a draft removed/expired.\n\t\t\t *\n\t\t\t * @event onRemoveDraft\n\t\t\t * @param {tinymce.plugins.AutoSave} sender Plugin instance sending the event.\n\t\t\t * @param {Object} draft Draft object containing the HTML contents of the editor.\n\t\t\t */\n\t\t\tself.onRemoveDraft = new Dispatcher(self);\n\n\t\t\t// Add ask before unload dialog only add one unload handler\n\t\t\tif (!unloadHandlerAdded) {\n\t\t\t\twindow.onbeforeunload = tinymce.plugins.AutoSave._beforeUnloadHandler;\n\t\t\t\tunloadHandlerAdded = TRUE;\n\t\t\t}\n\t\t},\n\n\t\t/**\n\t\t * Returns information about the plugin as a name/value array.\n\t\t * The current keys are longname, author, authorurl, infourl and version.\n\t\t *\n\t\t * @method getInfo\n\t\t * @return {Object} Name/value array containing information about the plugin.\n\t\t */\n\t\tgetInfo : function() {\n\t\t\treturn {\n\t\t\t\tlongname : 'Auto save',\n\t\t\t\tauthor : 'Moxiecode Systems AB',\n\t\t\t\tauthorurl : 'http://tinymce.moxiecode.com',\n\t\t\t\tinfourl : 'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/autosave',\n\t\t\t\tversion : tinymce.majorVersion + \".\" + tinymce.minorVersion\n\t\t\t};\n\t\t},\n\n\t\t/**\n\t\t * Returns an expiration date UTC string.\n\t\t *\n\t\t * @method getExpDate\n\t\t * @return {String} Expiration date UTC string.\n\t\t */\n\t\tgetExpDate : function() {\n\t\t\treturn new Date(\n\t\t\t\tnew Date().getTime() + this.editor.settings.autosave_retention\n\t\t\t).toUTCString();\n\t\t},\n\n\t\t/**\n\t\t * This method will setup the storage engine. If the browser has support for it.\n\t\t *\n\t\t * @method setupStorage\n\t\t */\n\t\tsetupStorage : function(ed) {\n\t\t\tvar self = this, testKey = PLUGIN_NAME + '_test', testVal = \"OK\";\n\n\t\t\tself.key = PLUGIN_NAME + ed.id;\n\n\t\t\t// Loop though each storage engine type until we find one that works\n\t\t\ttinymce.each([\n\t\t\t\tfunction() {\n\t\t\t\t\t// Try HTML5 Local Storage\n\t\t\t\t\tif (localStorage) {\n\t\t\t\t\t\tlocalStorage.setItem(testKey, testVal);\n\n\t\t\t\t\t\tif (localStorage.getItem(testKey) === testVal) {\n\t\t\t\t\t\t\tlocalStorage.removeItem(testKey);\n\n\t\t\t\t\t\t\treturn localStorage;\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t},\n\n\t\t\t\tfunction() {\n\t\t\t\t\t// Try HTML5 Session Storage\n\t\t\t\t\tif (sessionStorage) {\n\t\t\t\t\t\tsessionStorage.setItem(testKey, testVal);\n\n\t\t\t\t\t\tif (sessionStorage.getItem(testKey) === testVal) {\n\t\t\t\t\t\t\tsessionStorage.removeItem(testKey);\n\n\t\t\t\t\t\t\treturn sessionStorage;\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t},\n\n\t\t\t\tfunction() {\n\t\t\t\t\t// Try IE userData\n\t\t\t\t\tif (tinymce.isIE) {\n\t\t\t\t\t\ted.getElement().style.behavior = \"url('#default#userData')\";\n\n\t\t\t\t\t\t// Fake localStorage on old IE\n\t\t\t\t\t\treturn {\n\t\t\t\t\t\t\tautoExpires : TRUE,\n\n\t\t\t\t\t\t\tsetItem : function(key, value) {\n\t\t\t\t\t\t\t\tvar userDataElement = ed.getElement();\n\n\t\t\t\t\t\t\t\tuserDataElement.setAttribute(key, value);\n\t\t\t\t\t\t\t\tuserDataElement.expires = self.getExpDate();\n\n\t\t\t\t\t\t\t\ttry {\n\t\t\t\t\t\t\t\t\tuserDataElement.save(\"TinyMCE\");\n\t\t\t\t\t\t\t\t} catch (e) {\n\t\t\t\t\t\t\t\t\t// Ignore, saving might fail if \"Userdata Persistence\" is disabled in IE\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t},\n\n\t\t\t\t\t\t\tgetItem : function(key) {\n\t\t\t\t\t\t\t\tvar userDataElement = ed.getElement();\n\n\t\t\t\t\t\t\t\ttry {\n\t\t\t\t\t\t\t\t\tuserDataElement.load(\"TinyMCE\");\n\t\t\t\t\t\t\t\t\treturn userDataElement.getAttribute(key);\n\t\t\t\t\t\t\t\t} catch (e) {\n\t\t\t\t\t\t\t\t\t// Ignore, loading might fail if \"Userdata Persistence\" is disabled in IE\n\t\t\t\t\t\t\t\t\treturn null;\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t},\n\n\t\t\t\t\t\t\tremoveItem : function(key) {\n\t\t\t\t\t\t\t\ted.getElement().removeAttribute(key);\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t};\n\t\t\t\t\t}\n\t\t\t\t},\n\t\t\t], function(setup) {\n\t\t\t\t// Try executing each function to find a suitable storage engine\n\t\t\t\ttry {\n\t\t\t\t\tself.storage = setup();\n\n\t\t\t\t\tif (self.storage)\n\t\t\t\t\t\treturn false;\n\t\t\t\t} catch (e) {\n\t\t\t\t\t// Ignore\n\t\t\t\t}\n\t\t\t});\n\t\t},\n\n\t\t/**\n\t\t * This method will store the current contents in the storage engine.\n\t\t *\n\t\t * @method storeDraft\n\t\t */\n\t\tstoreDraft : function() {\n\t\t\tvar self = this, storage = self.storage, editor = self.editor, expires, content;\n\n\t\t\t// Is the contents dirty\n\t\t\tif (storage) {\n\t\t\t\t// If there is no existing key and the contents hasn't been changed since\n\t\t\t\t// it's original value then there is no point in saving a draft\n\t\t\t\tif (!storage.getItem(self.key) && !editor.isDirty())\n\t\t\t\t\treturn;\n\n\t\t\t\t// Store contents if the contents if longer than the minlength of characters\n\t\t\t\tcontent = editor.getContent({draft: true});\n\t\t\t\tif (content.length > editor.settings.autosave_minlength) {\n\t\t\t\t\texpires = self.getExpDate();\n\n\t\t\t\t\t// Store expiration date if needed IE userData has auto expire built in\n\t\t\t\t\tif (!self.storage.autoExpires)\n\t\t\t\t\t\tself.storage.setItem(self.key + \"_expires\", expires);\n\n\t\t\t\t\tself.storage.setItem(self.key, content);\n\t\t\t\t\tself.onStoreDraft.dispatch(self, {\n\t\t\t\t\t\texpires : expires,\n\t\t\t\t\t\tcontent : content\n\t\t\t\t\t});\n\t\t\t\t}\n\t\t\t}\n\t\t},\n\n\t\t/**\n\t\t * This method will restore the contents from the storage engine back to the editor.\n\t\t *\n\t\t * @method restoreDraft\n\t\t */\n\t\trestoreDraft : function() {\n\t\t\tvar self = this, storage = self.storage, content;\n\n\t\t\tif (storage) {\n\t\t\t\tcontent = storage.getItem(self.key);\n\n\t\t\t\tif (content) {\n\t\t\t\t\tself.editor.setContent(content);\n\t\t\t\t\tself.onRestoreDraft.dispatch(self, {\n\t\t\t\t\t\tcontent : content\n\t\t\t\t\t});\n\t\t\t\t}\n\t\t\t}\n\t\t},\n\n\t\t/**\n\t\t * This method will return true/false if there is a local storage draft available.\n\t\t *\n\t\t * @method hasDraft\n\t\t * @return {boolean} true/false state if there is a local draft.\n\t\t */\n\t\thasDraft : function() {\n\t\t\tvar self = this, storage = self.storage, expDate, exists;\n\n\t\t\tif (storage) {\n\t\t\t\t// Does the item exist at all\n\t\t\t\texists = !!storage.getItem(self.key);\n\t\t\t\tif (exists) {\n\t\t\t\t\t// Storage needs autoexpire\n\t\t\t\t\tif (!self.storage.autoExpires) {\n\t\t\t\t\t\texpDate = new Date(storage.getItem(self.key + \"_expires\"));\n\n\t\t\t\t\t\t// Contents hasn't expired\n\t\t\t\t\t\tif (new Date().getTime() < expDate.getTime())\n\t\t\t\t\t\t\treturn TRUE;\n\n\t\t\t\t\t\t// Remove it if it has\n\t\t\t\t\t\tself.removeDraft();\n\t\t\t\t\t} else\n\t\t\t\t\t\treturn TRUE;\n\t\t\t\t}\n\t\t\t}\n\n\t\t\treturn false;\n\t\t},\n\n\t\t/**\n\t\t * Removes the currently stored draft.\n\t\t *\n\t\t * @method removeDraft\n\t\t */\n\t\tremoveDraft : function() {\n\t\t\tvar self = this, storage = self.storage, key = self.key, content;\n\n\t\t\tif (storage) {\n\t\t\t\t// Get current contents and remove the existing draft\n\t\t\t\tcontent = storage.getItem(key);\n\t\t\t\tstorage.removeItem(key);\n\t\t\t\tstorage.removeItem(key + \"_expires\");\n\n\t\t\t\t// Dispatch remove event if we had any contents\n\t\t\t\tif (content) {\n\t\t\t\t\tself.onRemoveDraft.dispatch(self, {\n\t\t\t\t\t\tcontent : content\n\t\t\t\t\t});\n\t\t\t\t}\n\t\t\t}\n\t\t},\n\n\t\t\"static\" : {\n\t\t\t// Internal unload handler will be called before the page is unloaded\n\t\t\t_beforeUnloadHandler : function(e) {\n\t\t\t\tvar msg;\n\n\t\t\t\ttinymce.each(tinyMCE.editors, function(ed) {\n\t\t\t\t\t// Store a draft for each editor instance\n\t\t\t\t\tif (ed.plugins.autosave)\n\t\t\t\t\t\ted.plugins.autosave.storeDraft();\n\n\t\t\t\t\t// Never ask in fullscreen mode\n\t\t\t\t\tif (ed.getParam(\"fullscreen_is_enabled\"))\n\t\t\t\t\t\treturn;\n\n\t\t\t\t\t// Setup a return message if the editor is dirty\n\t\t\t\t\tif (!msg && ed.isDirty() && ed.getParam(\"autosave_ask_before_unload\"))\n\t\t\t\t\t\tmsg = ed.getLang(\"autosave.unload_msg\");\n\t\t\t\t});\n\n\t\t\t\treturn msg;\n\t\t\t}\n\t\t}\n\t});\n\n\ttinymce.PluginManager.add('autosave', tinymce.plugins.AutoSave);\n})(tinymce);\n"}
}});