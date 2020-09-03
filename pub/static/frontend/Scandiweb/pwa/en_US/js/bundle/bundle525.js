require.config({"config": {
        "jsbuild":{"Magento_Tinymce3/tiny_mce/plugins/xhtmlxtras/editor_plugin.js":"(function(){tinymce.create(\"tinymce.plugins.XHTMLXtrasPlugin\",{init:function(a,b){a.addCommand(\"mceCite\",function(){a.windowManager.open({file:b+\"/cite.htm\",width:350+parseInt(a.getLang(\"xhtmlxtras.cite_delta_width\",0)),height:250+parseInt(a.getLang(\"xhtmlxtras.cite_delta_height\",0)),inline:1},{plugin_url:b})});a.addCommand(\"mceAcronym\",function(){a.windowManager.open({file:b+\"/acronym.htm\",width:350+parseInt(a.getLang(\"xhtmlxtras.acronym_delta_width\",0)),height:250+parseInt(a.getLang(\"xhtmlxtras.acronym_delta_height\",0)),inline:1},{plugin_url:b})});a.addCommand(\"mceAbbr\",function(){a.windowManager.open({file:b+\"/abbr.htm\",width:350+parseInt(a.getLang(\"xhtmlxtras.abbr_delta_width\",0)),height:250+parseInt(a.getLang(\"xhtmlxtras.abbr_delta_height\",0)),inline:1},{plugin_url:b})});a.addCommand(\"mceDel\",function(){a.windowManager.open({file:b+\"/del.htm\",width:340+parseInt(a.getLang(\"xhtmlxtras.del_delta_width\",0)),height:310+parseInt(a.getLang(\"xhtmlxtras.del_delta_height\",0)),inline:1},{plugin_url:b})});a.addCommand(\"mceIns\",function(){a.windowManager.open({file:b+\"/ins.htm\",width:340+parseInt(a.getLang(\"xhtmlxtras.ins_delta_width\",0)),height:310+parseInt(a.getLang(\"xhtmlxtras.ins_delta_height\",0)),inline:1},{plugin_url:b})});a.addCommand(\"mceAttributes\",function(){a.windowManager.open({file:b+\"/attributes.htm\",width:380+parseInt(a.getLang(\"xhtmlxtras.attr_delta_width\",0)),height:370+parseInt(a.getLang(\"xhtmlxtras.attr_delta_height\",0)),inline:1},{plugin_url:b})});a.addButton(\"cite\",{title:\"xhtmlxtras.cite_desc\",cmd:\"mceCite\"});a.addButton(\"acronym\",{title:\"xhtmlxtras.acronym_desc\",cmd:\"mceAcronym\"});a.addButton(\"abbr\",{title:\"xhtmlxtras.abbr_desc\",cmd:\"mceAbbr\"});a.addButton(\"del\",{title:\"xhtmlxtras.del_desc\",cmd:\"mceDel\"});a.addButton(\"ins\",{title:\"xhtmlxtras.ins_desc\",cmd:\"mceIns\"});a.addButton(\"attribs\",{title:\"xhtmlxtras.attribs_desc\",cmd:\"mceAttributes\"});a.onNodeChange.add(function(d,c,f,e){f=d.dom.getParent(f,\"CITE,ACRONYM,ABBR,DEL,INS\");c.setDisabled(\"cite\",e);c.setDisabled(\"acronym\",e);c.setDisabled(\"abbr\",e);c.setDisabled(\"del\",e);c.setDisabled(\"ins\",e);c.setDisabled(\"attribs\",f&&f.nodeName==\"BODY\");c.setActive(\"cite\",0);c.setActive(\"acronym\",0);c.setActive(\"abbr\",0);c.setActive(\"del\",0);c.setActive(\"ins\",0);if(f){do{c.setDisabled(f.nodeName.toLowerCase(),0);c.setActive(f.nodeName.toLowerCase(),1)}while(f=f.parentNode)}});a.onPreInit.add(function(){a.dom.create(\"abbr\")})},getInfo:function(){return{longname:\"XHTML Xtras Plugin\",author:\"Moxiecode Systems AB\",authorurl:\"http://tinymce.moxiecode.com\",infourl:\"http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/xhtmlxtras\",version:tinymce.majorVersion+\".\"+tinymce.minorVersion}}});tinymce.PluginManager.add(\"xhtmlxtras\",tinymce.plugins.XHTMLXtrasPlugin)})();"}
}});
