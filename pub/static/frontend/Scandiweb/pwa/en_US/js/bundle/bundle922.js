require.config({"config": {
        "jsbuild":{"tiny_mce_4/plugins/paste/plugin.min.js":"!function(v){\"use strict\";var g=function(t){var e=t,n=function(){return e};return{get:n,set:function(t){e=t},clone:function(){return g(n())}}},e=tinymce.util.Tools.resolve(\"tinymce.PluginManager\"),a=function(t){return!(!/(^|[ ,])powerpaste([, ]|$)/.test(t.settings.plugins)||!e.get(\"powerpaste\")||(\"undefined\"!=typeof v.window.console&&v.window.console.log&&v.window.console.log(\"PowerPaste is incompatible with Paste plugin! Remove 'paste' from the 'plugins' option.\"),0))},s=function(t,e){return{clipboard:t,quirks:e}},f=function(t,e,n,r){return t.fire(\"PastePreProcess\",{content:e,internal:n,wordContent:r})},d=function(t,e,n,r){return t.fire(\"PastePostProcess\",{node:e,internal:n,wordContent:r})},u=function(t,e){return t.fire(\"PastePlainTextToggle\",{state:e})},n=function(t,e){return t.fire(\"paste\",{ieFake:e})},m={shouldPlainTextInform:function(t){return t.getParam(\"paste_plaintext_inform\",!0)},shouldBlockDrop:function(t){return t.getParam(\"paste_block_drop\",!1)},shouldPasteDataImages:function(t){return t.getParam(\"paste_data_images\",!1)},shouldFilterDrop:function(t){return t.getParam(\"paste_filter_drop\",!0)},getPreProcess:function(t){return t.getParam(\"paste_preprocess\")},getPostProcess:function(t){return t.getParam(\"paste_postprocess\")},getWebkitStyles:function(t){return t.getParam(\"paste_webkit_styles\")},shouldRemoveWebKitStyles:function(t){return t.getParam(\"paste_remove_styles_if_webkit\",!0)},shouldMergeFormats:function(t){return t.getParam(\"paste_merge_formats\",!0)},isSmartPasteEnabled:function(t){return t.getParam(\"smart_paste\",!0)},isPasteAsTextEnabled:function(t){return t.getParam(\"paste_as_text\",!1)},getRetainStyleProps:function(t){return t.getParam(\"paste_retain_style_properties\")},getWordValidElements:function(t){return t.getParam(\"paste_word_valid_elements\",\"-strong/b,-em/i,-u,-span,-p,-ol,-ul,-li,-h1,-h2,-h3,-h4,-h5,-h6,-p/div,-a[href|name],sub,sup,strike,br,del,table[width],tr,td[colspan|rowspan|width],th[colspan|rowspan|width],thead,tfoot,tbody\")},shouldConvertWordFakeLists:function(t){return t.getParam(\"paste_convert_word_fake_lists\",!0)},shouldUseDefaultFilters:function(t){return t.getParam(\"paste_enable_default_filters\",!0)}},r=function(t,e,n){var r,o,i;\"text\"===e.pasteFormat.get()?(e.pasteFormat.set(\"html\"),u(t,!1)):(e.pasteFormat.set(\"text\"),u(t,!0),i=t,!1===n.get()&&m.shouldPlainTextInform(i)&&(o=\"Paste is now in plain text mode. Contents will now be pasted as plain text until you toggle this option off.\",(r=t).notificationManager.open({text:r.translate(o),type:\"info\"}),n.set(!0))),t.focus()},l=function(t,n,e){t.addCommand(\"mceTogglePlainTextPaste\",function(){r(t,n,e)}),t.addCommand(\"mceInsertClipboardContent\",function(t,e){e.content&&n.pasteHtml(e.content,e.internal),e.text&&n.pasteText(e.text)})},p=tinymce.util.Tools.resolve(\"tinymce.Env\"),h=tinymce.util.Tools.resolve(\"tinymce.util.Delay\"),y=tinymce.util.Tools.resolve(\"tinymce.util.Tools\"),o=tinymce.util.Tools.resolve(\"tinymce.util.VK\"),t=\"x-tinymce/html\",i=\"\\x3c!-- \"+t+\" --\\x3e\",c=function(t){return i+t},b=function(t){return t.replace(i,\"\")},x=function(t){return-1!==t.indexOf(i)},P=function(){return t},w=tinymce.util.Tools.resolve(\"tinymce.html.Entities\"),_=function(t){return t.replace(/\\r?\\n/g,\"<br>\")},T=function(t,e,n){var r=t.split(/\\n\\n/),o=function(t,e){var n,r=[],o=\"<\"+t;if(\"object\"==typeof e){for(n in e)e.hasOwnProperty(n)&&r.push(n+'=\"'+w.encodeAllRaw(e[n])+'\"');r.length&&(o+=\" \"+r.join(\" \"))}return o+\">\"}(e,n),i=\"</\"+e+\">\",a=y.map(r,function(t){return t.split(/\\n/).join(\"<br />\")});return 1===a.length?a[0]:y.map(a,function(t){return o+t+i}).join(\"\")},D=function(t){return!/<(?:\\/?(?!(?:div|p|br|span)>)\\w+|(?:(?!(?:span style=\"white-space:\\s?pre;?\">)|br\\s?\\/>))\\w+\\s[^>]+)>/i.test(t)},C=function(t,e,n){return e?T(t,e,n):_(t)},k=tinymce.util.Tools.resolve(\"tinymce.html.DomParser\"),S=tinymce.util.Tools.resolve(\"tinymce.html.Node\"),O=tinymce.util.Tools.resolve(\"tinymce.html.Schema\"),R=tinymce.util.Tools.resolve(\"tinymce.html.Serializer\");function F(e,t){return y.each(t,function(t){e=t.constructor===RegExp?e.replace(t,\"\"):e.replace(t[0],t[1])}),e}var E={filter:F,innerText:function(e){var n=O(),r=k({},n),o=\"\",i=n.getShortEndedElements(),a=y.makeMap(\"script noscript style textarea video audio iframe object\",\" \"),s=n.getBlockElements();return e=F(e,[/<!\\[[^\\]]+\\]>/g]),function t(e){var n=e.name,r=e;if(\"br\"!==n){if(\"wbr\"!==n)if(i[n]&&(o+=\" \"),a[n])o+=\" \";else{if(3===e.type&&(o+=e.value),!e.shortEnded&&(e=e.firstChild))for(;t(e),e=e.next;);s[n]&&r.next&&(o+=\"\\n\",\"p\"===n&&(o+=\"\\n\"))}}else o+=\"\\n\"}(r.parse(e)),o},trimHtml:function(t){return t=F(t,[/^[\\s\\S]*<body[^>]*>\\s*|\\s*<\\/body[^>]*>[\\s\\S]*$/gi,/<!--StartFragment-->|<!--EndFragment-->/g,[/( ?)<span class=\"Apple-converted-space\">\\u00a0<\\/span>( ?)/g,function(t,e,n){return e||n?\"\\xa0\":\" \"}],/<br class=\"Apple-interchange-newline\">/g,/<br>$/i])},createIdGenerator:function(t){var e=0;return function(){return t+e++}},isMsEdge:function(){return-1!==v.navigator.userAgent.indexOf(\" Edge/\")}};function A(e){var n,t;return t=[/^[IVXLMCD]{1,2}\\.[ \\u00a0]/,/^[ivxlmcd]{1,2}\\.[ \\u00a0]/,/^[a-z]{1,2}[\\.\\)][ \\u00a0]/,/^[A-Z]{1,2}[\\.\\)][ \\u00a0]/,/^[0-9]+\\.[ \\u00a0]/,/^[\\u3007\\u4e00\\u4e8c\\u4e09\\u56db\\u4e94\\u516d\\u4e03\\u516b\\u4e5d]+\\.[ \\u00a0]/,/^[\\u58f1\\u5f10\\u53c2\\u56db\\u4f0d\\u516d\\u4e03\\u516b\\u4e5d\\u62fe]+\\.[ \\u00a0]/],e=e.replace(/^[\\u00a0 ]+/,\"\"),y.each(t,function(t){if(t.test(e))return!(n=!0)}),n}function I(t){var i,a,s=1;function n(t){var e=\"\";if(3===t.type)return t.value;if(t=t.firstChild)for(;e+=n(t),t=t.next;);return e}function u(t,e){if(3===t.type&&e.test(t.value))return t.value=t.value.replace(e,\"\"),!1;if(t=t.firstChild)do{if(!u(t,e))return!1}while(t=t.next);return!0}function e(e,n,r){var o=e._listLevel||s;o!==s&&(o<s?i&&(i=i.parent.parent):(a=i,i=null)),i&&i.name===n?i.append(e):(a=a||i,i=new S(n,1),1<r&&i.attr(\"start\",\"\"+r),e.wrap(i)),e.name=\"li\",s<o&&a&&a.lastChild.append(i),s=o,function t(e){if(e._listIgnore)e.remove();else if(e=e.firstChild)for(;t(e),e=e.next;);}(e),u(e,/^\\u00a0+/),u(e,/^\\s*([\\u2022\\u00b7\\u00a7\\u25CF]|\\w+\\.)/),u(e,/^\\u00a0+/)}for(var r=[],o=t.firstChild;null!=o;)if(r.push(o),null!==(o=o.walk()))for(;void 0!==o&&o.parent!==t;)o=o.walk();for(var l=0;l<r.length;l++)if(\"p\"===(t=r[l]).name&&t.firstChild){var c=n(t);if(/^[\\s\\u00a0]*[\\u2022\\u00b7\\u00a7\\u25CF]\\s*/.test(c)){e(t,\"ul\");continue}if(A(c)){var f=/([0-9]+)\\./.exec(c),d=1;f&&(d=parseInt(f[1],10)),e(t,\"ol\",d);continue}if(t._listLevel){e(t,\"ul\",1);continue}i=null}else a=i,i=null}function M(n,r,o,i){var a,s={},t=n.dom.parseStyle(i);return y.each(t,function(t,e){switch(e){case\"mso-list\":(a=/\\w+ \\w+([0-9]+)/i.exec(i))&&(o._listLevel=parseInt(a[1],10)),/Ignore/i.test(t)&&o.firstChild&&(o._listIgnore=!0,o.firstChild._listIgnore=!0);break;case\"horiz-align\":e=\"text-align\";break;case\"vert-align\":e=\"vertical-align\";break;case\"font-color\":case\"mso-foreground\":e=\"color\";break;case\"mso-background\":case\"mso-highlight\":e=\"background\";break;case\"font-weight\":case\"font-style\":return void(\"normal\"!==t&&(s[e]=t));case\"mso-element\":if(/^(comment|comment-list)$/i.test(t))return void o.remove()}0!==e.indexOf(\"mso-comment\")?0!==e.indexOf(\"mso-\")&&(\"all\"===m.getRetainStyleProps(n)||r&&r[e])&&(s[e]=t):o.remove()}),/(bold)/i.test(s[\"font-weight\"])&&(delete s[\"font-weight\"],o.wrap(new S(\"b\",1))),/(italic)/i.test(s[\"font-style\"])&&(delete s[\"font-style\"],o.wrap(new S(\"i\",1))),(s=n.dom.serializeStyle(s,o.name))||null}var B,H,j,L,N,$={preProcess:function(t,e){return m.shouldUseDefaultFilters(t)?function(r,t){var e,o;(e=m.getRetainStyleProps(r))&&(o=y.makeMap(e.split(/[, ]/))),t=E.filter(t,[/<br class=\"?Apple-interchange-newline\"?>/gi,/<b[^>]+id=\"?docs-internal-[^>]*>/gi,/<!--[\\s\\S]+?-->/gi,/<(!|script[^>]*>.*?<\\/script(?=[>\\s])|\\/?(\\?xml(:\\w+)?|img|meta|link|style|\\w:\\w+)(?=[\\s\\/>]))[^>]*>/gi,[/<(\\/?)s>/gi,\"<$1strike>\"],[/&nbsp;/gi,\"\\xa0\"],[/<span\\s+style\\s*=\\s*\"\\s*mso-spacerun\\s*:\\s*yes\\s*;?\\s*\"\\s*>([\\s\\u00a0]*)<\\/span>/gi,function(t,e){return 0<e.length?e.replace(/./,\" \").slice(Math.floor(e.length/2)).split(\"\").join(\"\\xa0\"):\"\"}]]);var n=m.getWordValidElements(r),i=O({valid_elements:n,valid_children:\"-li[p]\"});y.each(i.elements,function(t){t.attributes[\"class\"]||(t.attributes[\"class\"]={},t.attributesOrder.push(\"class\")),t.attributes.style||(t.attributes.style={},t.attributesOrder.push(\"style\"))});var a=k({},i);a.addAttributeFilter(\"style\",function(t){for(var e,n=t.length;n--;)(e=t[n]).attr(\"style\",M(r,o,e,e.attr(\"style\"))),\"span\"===e.name&&e.parent&&!e.attributes.length&&e.unwrap()}),a.addAttributeFilter(\"class\",function(t){for(var e,n,r=t.length;r--;)n=(e=t[r]).attr(\"class\"),/^(MsoCommentReference|MsoCommentText|msoDel)$/i.test(n)&&e.remove(),e.attr(\"class\",null)}),a.addNodeFilter(\"del\",function(t){for(var e=t.length;e--;)t[e].remove()}),a.addNodeFilter(\"a\",function(t){for(var e,n,r,o=t.length;o--;)if(n=(e=t[o]).attr(\"href\"),r=e.attr(\"name\"),n&&-1!==n.indexOf(\"#_msocom_\"))e.remove();else if(n&&0===n.indexOf(\"file://\")&&(n=n.split(\"#\")[1])&&(n=\"#\"+n),n||r){if(r&&!/^_?(?:toc|edn|ftn)/i.test(r)){e.unwrap();continue}e.attr({href:n,name:r})}else e.unwrap()});var s=a.parse(t);return m.shouldConvertWordFakeLists(r)&&I(s),t=R({validate:r.settings.validate},i).serialize(s)}(t,e):e},isWordContent:function(t){return/<font face=\"Times New Roman\"|class=\"?Mso|style=\"[^\"]*\\bmso-|style='[^'']*\\bmso-|w:WordDocument/i.test(t)||/class=\"OutlineElement/.test(t)||/id=\"?docs\\-internal\\-guid\\-/.test(t)}},W=function(t,e){return{content:t,cancelled:e}},z=function(t,e,n,r){var o,i,a,s,u,l,c=f(t,e,n,r);return t.hasEventListeners(\"PastePostProcess\")&&!c.isDefaultPrevented()?(o=t,i=c.content,a=n,s=r,u=o.dom.create(\"div\",{style:\"display:none\"},i),l=d(o,u,a,s),W(l.node.innerHTML,l.isDefaultPrevented())):W(c.content,c.isDefaultPrevented())},U=function(t,e,n){var r=$.isWordContent(e),o=r?$.preProcess(t,e):e;return z(t,o,n,r)},V=function(t,e){var n,r;return t.insertContent((n=e,r=t.dom.create(\"body\",{},n),y.each(r.querySelectorAll(\"meta\"),function(t){return t.parentNode.removeChild(t)}),r.innerHTML),{merge:m.shouldMergeFormats(t),paste:!0}),!0},q=function(t){return/^https?:\\/\\/[\\w\\?\\-\\/+=.&%@~#]+$/i.test(t)},K=function(t){return q(t)&&/.(gif|jpe?g|png)$/.test(t)},G=function(t,e,n){return!(!1!==t.selection.isCollapsed()||!q(e)||(o=e,i=n,(r=t).undoManager.extra(function(){i(r,o)},function(){r.execCommand(\"mceInsertLink\",!1,o)}),0));var r,o,i},X=function(t,e,n){return!!K(e)&&(o=e,i=n,(r=t).undoManager.extra(function(){i(r,o)},function(){r.insertContent('<img src=\"'+o+'\">')}),!0);var r,o,i},Y=function(t,e){var n,r;!1===m.isSmartPasteEnabled(t)?V(t,e):(n=t,r=e,y.each([G,X,V],function(t){return!0!==t(n,r,V)}))},Z=function(t){return function(){return t}},J=Z(!1),Q=Z(!0),tt=J,et=Q,nt=function(){return rt},rt=(L={fold:function(t,e){return t()},is:tt,isSome:tt,isNone:et,getOr:j=function(t){return t},getOrThunk:H=function(t){return t()},getOrDie:function(t){throw new Error(t||\"error: getOrDie called on none.\")},getOrNull:function(){return null},getOrUndefined:function(){return undefined},or:j,orThunk:H,map:nt,ap:nt,each:function(){},bind:nt,flatten:nt,exists:tt,forall:et,filter:nt,equals:B=function(t){return t.isNone()},equals_:B,toArray:function(){return[]},toString:Z(\"none()\")},Object.freeze&&Object.freeze(L),L),ot=function(n){var t=function(){return n},e=function(){return o},r=function(t){return t(n)},o={fold:function(t,e){return e(n)},is:function(t){return n===t},isSome:et,isNone:tt,getOr:t,getOrThunk:t,getOrDie:t,getOrNull:t,getOrUndefined:t,or:e,orThunk:e,map:function(t){return ot(t(n))},ap:function(t){return t.fold(nt,function(t){return ot(t(n))})},each:function(t){t(n)},bind:r,flatten:t,exists:r,forall:r,filter:function(t){return t(n)?o:rt},equals:function(t){return t.is(n)},equals_:function(t,e){return t.fold(tt,function(t){return e(n,t)})},toArray:function(){return[n]},toString:function(){return\"some(\"+n+\")\"}};return o},it={some:ot,none:nt,from:function(t){return null===t||t===undefined?rt:ot(t)}},at=(N=\"function\",function(t){return function(t){if(null===t)return\"null\";var e=typeof t;return\"object\"===e&&(Array.prototype.isPrototypeOf(t)||t.constructor&&\"Array\"===t.constructor.name)?\"array\":\"object\"===e&&(String.prototype.isPrototypeOf(t)||t.constructor&&\"String\"===t.constructor.name)?\"string\":e}(t)===N}),st=Array.prototype.slice,ut=function(t,e){for(var n=t.length,r=new Array(n),o=0;o<n;o++){var i=t[o];r[o]=e(i,o,t)}return r},lt=function(t,e){for(var n=0,r=t.length;n<r;n++)e(t[n],n,t)},ct=at(Array.from)?Array.from:function(t){return st.call(t)},ft=function(t){var n=it.none(),e=[],r=function(t){o()?a(t):e.push(t)},o=function(){return n.isSome()},i=function(t){lt(t,a)},a=function(e){n.each(function(t){v.setTimeout(function(){e(t)},0)})};return t(function(t){n=it.some(t),i(e),e=[]}),{get:r,map:function(n){return ft(function(e){r(function(t){e(n(t))})})},isReady:o}},dt={nu:ft,pure:function(e){return ft(function(t){t(e)})}},mt=function(e){var t=function(t){var r;e((r=t,function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];var n=this;v.setTimeout(function(){r.apply(n,t)},0)}))},n=function(){return dt.nu(t)};return{map:function(r){return mt(function(n){t(function(t){var e=r(t);n(e)})})},bind:function(n){return mt(function(e){t(function(t){n(t).get(e)})})},anonBind:function(n){return mt(function(e){t(function(t){n.get(e)})})},toLazy:n,toCached:function(){var e=null;return mt(function(t){null===e&&(e=n()),e.get(t)})},get:t}},gt={nu:mt,pure:function(e){return mt(function(t){t(e)})}},pt=function(a,t){return t(function(r){var o=[],i=0;0===a.length?r([]):lt(a,function(t,e){var n;t.get((n=e,function(t){o[n]=t,++i>=a.length&&r(o)}))})})},vt=function(t,e){var n=ut(t,e);return pt(n,gt.nu)},ht=function(t,e,n){var r=n||x(e),o=U(t,b(e),r);!1===o.cancelled&&Y(t,o.content)},yt=function(t,e){e=t.dom.encode(e).replace(/\\r\\n/g,\"\\n\"),e=C(e,t.settings.forced_root_block,t.settings.forced_root_block_attrs),ht(t,e,!1)},bt=function(t){var e={};if(t){if(t.getData){var n=t.getData(\"Text\");n&&0<n.length&&-1===n.indexOf(\"data:text/mce-internal,\")&&(e[\"text/plain\"]=n)}if(t.types)for(var r=0;r<t.types.length;r++){var o=t.types[r];try{e[o]=t.getData(o)}catch(i){e[o]=\"\"}}}return e},xt=function(t,e){return e in t&&0<t[e].length},Pt=function(t){return xt(t,\"text/html\")||xt(t,\"text/plain\")},wt=E.createIdGenerator(\"mceclip\"),_t=function(e,t,n){var r,o,i,a,s=\"paste\"===t.type?t.clipboardData:t.dataTransfer;if(e.settings.paste_data_images&&s){var u=(i=(o=s).items?ut(ct(o.items),function(t){return t.getAsFile()}):[],a=o.files?ct(o.files):[],function(t,e){for(var n=[],r=0,o=t.length;r<o;r++){var i=t[r];e(i,r,t)&&n.push(i)}return n}(0<i.length?i:a,function(t){return/^image\\/(jpeg|png|gif|bmp)$/.test(t.type)}));if(0<u.length)return t.preventDefault(),(r=u,vt(r,function(r){return gt.nu(function(t){var e=r.getAsFile?r.getAsFile():r,n=new window.FileReader;n.onload=function(){t({blob:e,uri:n.result})},n.readAsDataURL(e)})})).get(function(t){n&&e.selection.setRng(n),lt(t,function(t){!function(t,e){var n,r,o,i,a,s,u,l=(n=e.uri,-1!==(r=n.indexOf(\",\"))?n.substr(r+1):null),c=wt(),f=t.settings.images_reuse_filename&&e.blob.name?(o=t,i=e.blob.name,(a=i.match(/([\\s\\S]+?)\\.(?:jpeg|jpg|png|gif)$/i))?o.dom.encode(a[1]):null):c,d=new v.Image;if(d.src=e.uri,s=t.settings,u=d,!s.images_dataimg_filter||s.images_dataimg_filter(u)){var m,g=t.editorUpload.blobCache,p=void 0;(m=g.findFirst(function(t){return t.base64()===l}))?p=m:(p=g.create(c,e.blob,l,f),g.add(p)),ht(t,'<img src=\"'+p.blobUri()+'\">',!1)}else ht(t,'<img src=\"'+e.uri+'\">',!1)}(e,t)})}),!0}return!1},Tt=function(t){return o.metaKeyPressed(t)&&86===t.keyCode||t.shiftKey&&45===t.keyCode},Dt=function(u,l,c){var e,f,d=(e=g(it.none()),{clear:function(){e.set(it.none())},set:function(t){e.set(it.some(t))},isSet:function(){return e.get().isSome()},on:function(t){e.get().each(t)}});function m(t,e,n,r){var o,i;xt(t,\"text/html\")?o=t[\"text/html\"]:(o=l.getHtml(),r=r||x(o),l.isDefaultContent(o)&&(n=!0)),o=E.trimHtml(o),l.remove(),i=!1===r&&D(o),o.length&&!i||(n=!0),n&&(o=xt(t,\"text/plain\")&&i?t[\"text/plain\"]:E.innerText(o)),l.isDefaultContent(o)?e||u.windowManager.alert(\"Please use Ctrl+V/Cmd+V keyboard shortcuts to paste contents.\"):n?yt(u,o):ht(u,o,r)}u.on(\"keydown\",function(t){function e(t){Tt(t)&&!t.isDefaultPrevented()&&l.remove()}if(Tt(t)&&!t.isDefaultPrevented()){if((f=t.shiftKey&&86===t.keyCode)&&p.webkit&&-1!==v.navigator.userAgent.indexOf(\"Version/\"))return;if(t.stopImmediatePropagation(),d.set(t),window.setTimeout(function(){d.clear()},100),p.ie&&f)return t.preventDefault(),void n(u,!0);l.remove(),l.create(),u.once(\"keyup\",e),u.once(\"paste\",function(){u.off(\"keyup\",e)})}}),u.on(\"paste\",function(t){var e,n,r,o=d.isSet(),i=(e=u,n=bt(t.clipboardData||e.getDoc().dataTransfer),E.isMsEdge()?y.extend(n,{\"text/html\":\"\"}):n),a=\"text\"===c.get()||f,s=xt(i,P());f=!1,t.isDefaultPrevented()||(r=t.clipboardData,-1!==v.navigator.userAgent.indexOf(\"Android\")&&r&&r.items&&0===r.items.length)?l.remove():Pt(i)||!_t(u,t,l.getLastRng()||u.selection.getRng())?(o||t.preventDefault(),!p.ie||o&&!t.ieFake||xt(i,\"text/html\")||(l.create(),u.dom.bind(l.getEl(),\"paste\",function(t){t.stopPropagation()}),u.getDoc().execCommand(\"Paste\",!1,null),i[\"text/html\"]=l.getHtml()),xt(i,\"text/html\")?(t.preventDefault(),s||(s=x(i[\"text/html\"])),m(i,o,a,s)):h.setEditorTimeout(u,function(){m(i,o,a,s)},0)):l.remove()})},Ct=function(t){return p.ie&&t.inline?v.document.body:t.getBody()},kt=function(e,t,n){var r;Ct(r=e)!==r.getBody()&&e.dom.bind(t,\"paste keyup\",function(t){Rt(e,n)||e.fire(\"paste\")})},St=function(t){return t.dom.get(\"mcepastebin\")},Ot=function(t,e){return e===t},Rt=function(t,e){var n,r=St(t);return(n=r)&&\"mcepastebin\"===n.id&&Ot(e,r.innerHTML)},Ft=function(a){var s=g(null),u=\"%MCEPASTEBIN%\";return{create:function(){return e=s,n=u,o=(t=a).dom,i=t.getBody(),e.set(t.selection.getRng()),r=t.dom.add(Ct(t),\"div\",{id:\"mcepastebin\",\"class\":\"mce-pastebin\",contentEditable:!0,\"data-mce-bogus\":\"all\",style:\"position: fixed; top: 50%; width: 10px; height: 10px; overflow: hidden; opacity: 0\"},n),(p.ie||p.gecko)&&o.setStyle(r,\"left\",\"rtl\"===o.getStyle(i,\"direction\",!0)?65535:-65535),o.bind(r,\"beforedeactivate focusin focusout\",function(t){t.stopPropagation()}),kt(t,r,n),r.focus(),void t.selection.select(r,!0);var t,e,n,r,o,i},remove:function(){return function(t,e){if(St(t)){for(var n=void 0,r=e.get();n=t.dom.get(\"mcepastebin\");)t.dom.remove(n),t.dom.unbind(n);r&&t.selection.setRng(r)}e.set(null)}(a,s)},getEl:function(){return St(a)},getHtml:function(){return function(n){var e,t,r,o,i,a=function(t,e){t.appendChild(e),n.dom.remove(e,!0)};for(t=y.grep(Ct(n).childNodes,function(t){return\"mcepastebin\"===t.id}),e=t.shift(),y.each(t,function(t){a(e,t)}),r=(o=n.dom.select(\"div[id=mcepastebin]\",e)).length-1;0<=r;r--)i=n.dom.create(\"div\"),e.insertBefore(i,o[r]),a(i,o[r]);return e?e.innerHTML:\"\"}(a)},getLastRng:function(){return s.get()},isDefault:function(){return Rt(a,u)},isDefaultContent:function(t){return Ot(u,t)}}},Et=function(n,t){var e=Ft(n);return n.on(\"preInit\",function(){return Dt(a=n,e,t),void a.parser.addNodeFilter(\"img\",function(t,e,n){var r,o=function(t){t.attr(\"data-mce-object\")||s===p.transparentSrc||t.remove()};if(!a.settings.paste_data_images&&(r=n).data&&!0===r.data.paste)for(var i=t.length;i--;)(s=t[i].attributes.map.src)&&(0===s.indexOf(\"webkit-fake-url\")?o(t[i]):a.settings.allow_html_data_urls||0!==s.indexOf(\"data:\")||o(t[i]))});var a,s}),{pasteFormat:t,pasteHtml:function(t,e){return ht(n,t,e)},pasteText:function(t){return yt(n,t)},pasteImageData:function(t,e){return _t(n,t,e)},getDataTransferItems:bt,hasHtmlOrText:Pt,hasContentType:xt}},At=function(){},It=function(t,e,n){if(r=t,!1!==p.iOS||r===undefined||\"function\"!=typeof r.setData||!0===E.isMsEdge())return!1;try{return t.clearData(),t.setData(\"text/html\",e),t.setData(\"text/plain\",n),t.setData(P(),e),!0}catch(o){return!1}var r},Mt=function(t,e,n,r){It(t.clipboardData,e.html,e.text)?(t.preventDefault(),r()):n(e.html,r)},Bt=function(s){return function(t,e){var n=c(t),r=s.dom.create(\"div\",{contenteditable:\"false\",\"data-mce-bogus\":\"all\"}),o=s.dom.create(\"div\",{contenteditable:\"true\"},n);s.dom.setStyles(r,{position:\"fixed\",top:\"0\",left:\"-3000px\",width:\"1000px\",overflow:\"hidden\"}),r.appendChild(o),s.dom.add(s.getBody(),r);var i=s.selection.getRng();o.focus();var a=s.dom.createRng();a.selectNodeContents(o),s.selection.setRng(a),setTimeout(function(){s.selection.setRng(i),r.parentNode.removeChild(r),e()},0)}},Ht=function(t){return{html:t.selection.getContent({contextual:!0}),text:t.selection.getContent({format:\"text\"})}},jt=function(t){return!t.selection.isCollapsed()||!!(e=t).dom.getParent(e.selection.getStart(),\"td[data-mce-selected],th[data-mce-selected]\",e.getBody());var e},Lt=function(t){var e,n;t.on(\"cut\",(e=t,function(t){jt(e)&&Mt(t,Ht(e),Bt(e),function(){setTimeout(function(){e.execCommand(\"Delete\")},0)})})),t.on(\"copy\",(n=t,function(t){jt(n)&&Mt(t,Ht(n),Bt(n),At)}))},Nt=tinymce.util.Tools.resolve(\"tinymce.dom.RangeUtils\"),$t=function(t,e){return Nt.getCaretRangeFromPoint(e.clientX,e.clientY,t.getDoc())},Wt=function(t,e){t.focus(),t.selection.setRng(e)},zt=function(a,s,u){m.shouldBlockDrop(a)&&a.on(\"dragend dragover draggesture dragdrop drop drag\",function(t){t.preventDefault(),t.stopPropagation()}),m.shouldPasteDataImages(a)||a.on(\"drop\",function(t){var e=t.dataTransfer;e&&e.files&&0<e.files.length&&t.preventDefault()}),a.on(\"drop\",function(t){var e,n;if(n=$t(a,t),!t.isDefaultPrevented()&&!u.get()){e=s.getDataTransferItems(t.dataTransfer);var r,o=s.hasContentType(e,P());if((s.hasHtmlOrText(e)&&(!(r=e[\"text/plain\"])||0!==r.indexOf(\"file://\"))||!s.pasteImageData(t,n))&&n&&m.shouldFilterDrop(a)){var i=e[\"mce-internal\"]||e[\"text/html\"]||e[\"text/plain\"];i&&(t.preventDefault(),h.setEditorTimeout(a,function(){a.undoManager.transact(function(){e[\"mce-internal\"]&&a.execCommand(\"Delete\"),Wt(a,n),i=E.trimHtml(i),e[\"text/html\"]?s.pasteHtml(i,o):s.pasteText(i)})}))}}}),a.on(\"dragstart\",function(t){u.set(!0)}),a.on(\"dragover dragend\",function(t){m.shouldPasteDataImages(a)&&!1===u.get()&&(t.preventDefault(),Wt(a,$t(a,t))),\"dragend\"===t.type&&u.set(!1)})},Ut=function(t){var e=t.plugins.paste,n=m.getPreProcess(t);n&&t.on(\"PastePreProcess\",function(t){n.call(e,e,t)});var r=m.getPostProcess(t);r&&t.on(\"PastePostProcess\",function(t){r.call(e,e,t)})};function Vt(e,n){e.on(\"PastePreProcess\",function(t){t.content=n(e,t.content,t.internal,t.wordContent)})}function qt(t,e){if(!$.isWordContent(e))return e;var n=[];y.each(t.schema.getBlockElements(),function(t,e){n.push(e)});var r=new RegExp(\"(?:<br>&nbsp;[\\\\s\\\\r\\\\n]+|<br>)*(<\\\\/?(\"+n.join(\"|\")+\")[^>]*>)(?:<br>&nbsp;[\\\\s\\\\r\\\\n]+|<br>)*\",\"g\");return e=E.filter(e,[[r,\"$1\"]]),e=E.filter(e,[[/<br><br>/g,\"<BR><BR>\"],[/<br>/g,\" \"],[/<BR><BR>/g,\"<br>\"]])}function Kt(t,e,n,r){if(r||n)return e;var l,o=m.getWebkitStyles(t);if(!1===m.shouldRemoveWebKitStyles(t)||\"all\"===o)return e;if(o&&(l=o.split(/[, ]/)),l){var c=t.dom,f=t.selection.getNode();e=e.replace(/(<[^>]+) style=\"([^\"]*)\"([^>]*>)/gi,function(t,e,n,r){var o=c.parseStyle(c.decode(n)),i={};if(\"none\"===l)return e+r;for(var a=0;a<l.length;a++){var s=o[l[a]],u=c.getStyle(f,l[a],!0);/color/.test(l[a])&&(s=c.toHex(s),u=c.toHex(u)),u!==s&&(i[l[a]]=s)}return(i=c.serializeStyle(i,\"span\"))?e+' style=\"'+i+'\"'+r:e+r})}else e=e.replace(/(<[^>]+) style=\"([^\"]*)\"([^>]*>)/gi,\"$1$3\");return e=e.replace(/(<[^>]+) data-mce-style=\"([^\"]+)\"([^>]*>)/gi,function(t,e,n,r){return e+' style=\"'+n+'\"'+r})}function Gt(n,t){n.$(\"a\",t).find(\"font,u\").each(function(t,e){n.dom.remove(e,!0)})}var Xt=function(t){var e,n;p.webkit&&Vt(t,Kt),p.ie&&(Vt(t,qt),n=Gt,(e=t).on(\"PastePostProcess\",function(t){n(e,t.node)}))},Yt=function(t,e,n){var r=n.control;r.active(\"text\"===e.pasteFormat.get()),t.on(\"PastePlainTextToggle\",function(t){r.active(t.state)})},Zt=function(t,e){var n=function(r){for(var o=[],t=1;t<arguments.length;t++)o[t-1]=arguments[t];return function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];var n=o.concat(t);return r.apply(null,n)}}(Yt,t,e);t.addButton(\"pastetext\",{active:!1,icon:\"pastetext\",tooltip:\"Paste as text\",cmd:\"mceTogglePlainTextPaste\",onPostRender:n}),t.addMenuItem(\"pastetext\",{text:\"Paste as text\",selectable:!0,active:e.pasteFormat,cmd:\"mceTogglePlainTextPaste\",onPostRender:n})};e.add(\"paste\",function(t){if(!1===a(t)){var e=g(!1),n=g(!1),r=g(m.isPasteAsTextEnabled(t)?\"text\":\"html\"),o=Et(t,r),i=Xt(t);return Zt(t,o),l(t,o,e),Ut(t),Lt(t),zt(t,o,n),s(o,i)}})}(window);"}
}});