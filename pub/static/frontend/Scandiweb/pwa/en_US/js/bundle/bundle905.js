require.config({"config": {
        "jsbuild":{"tiny_mce_4/plugins/autoresize/plugin.min.js":"!function(){\"use strict\";var i=function(t){var e=t,n=function(){return e};return{get:n,set:function(t){e=t},clone:function(){return i(n())}}},t=tinymce.util.Tools.resolve(\"tinymce.PluginManager\"),y=tinymce.util.Tools.resolve(\"tinymce.Env\"),r=tinymce.util.Tools.resolve(\"tinymce.util.Delay\"),h=function(t){return parseInt(t.getParam(\"autoresize_min_height\",t.getElement().offsetHeight),10)},v=function(t){return parseInt(t.getParam(\"autoresize_max_height\",0),10)},o=function(t){return t.getParam(\"autoresize_overflow_padding\",1)},a=function(t){return t.getParam(\"autoresize_bottom_margin\",50)},n=function(t){return t.getParam(\"autoresize_on_init\",!0)},u=function(t,e,n,i,o){r.setEditorTimeout(t,function(){_(t,e),n--?u(t,e,n,i,o):o&&o()},i)},S=function(t,e){var n=t.getBody();n&&(n.style.overflowY=e?\"\":\"hidden\",e||(n.scrollTop=0))},_=function(t,e){var n,i,o,r,a,u,s,l,g,c,f,d=t.dom;if(i=t.getDoc())if((m=t).plugins.fullscreen&&m.plugins.fullscreen.isFullscreen())S(t,!0);else{var m;o=i.body,r=h(t),u=d.getStyle(o,\"margin-top\",!0),s=d.getStyle(o,\"margin-bottom\",!0),l=d.getStyle(o,\"padding-top\",!0),g=d.getStyle(o,\"padding-bottom\",!0),c=d.getStyle(o,\"border-top-width\",!0),f=d.getStyle(o,\"border-bottom-width\",!0),a=o.offsetHeight+parseInt(u,10)+parseInt(s,10)+parseInt(l,10)+parseInt(g,10)+parseInt(c,10)+parseInt(f,10),(isNaN(a)||a<=0)&&(a=y.ie?o.scrollHeight:y.webkit&&0===o.clientHeight?0:o.offsetHeight),a>h(t)&&(r=a);var p=v(t);p&&p<a?(r=p,S(t,!0)):S(t,!1),r!==e.get()&&(n=r-e.get(),d.setStyle(t.iframeElement,\"height\",r+\"px\"),e.set(r),y.webkit&&n<0&&_(t,e))}},s={setup:function(i,e){i.on(\"init\",function(){var t,e,n=i.dom;t=o(i),e=a(i),!1!==t&&n.setStyles(i.getBody(),{paddingLeft:t,paddingRight:t}),!1!==e&&n.setStyles(i.getBody(),{paddingBottom:e})}),i.on(\"nodechange setcontent keyup FullscreenStateChanged\",function(t){_(i,e)}),n(i)&&i.on(\"init\",function(){u(i,e,20,100,function(){u(i,e,5,1e3)})})},resize:_},l=function(t,e){t.addCommand(\"mceAutoResize\",function(){s.resize(t,e)})};t.add(\"autoresize\",function(t){if(!t.inline){var e=i(0);l(t,e),s.setup(t,e)}})}();"}
}});
