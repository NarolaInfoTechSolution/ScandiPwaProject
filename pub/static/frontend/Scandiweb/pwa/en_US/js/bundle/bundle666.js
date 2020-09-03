require.config({"config": {
        "jsbuild":{"Magento_Tinymce3/tiny_mce/classes/html/Entities.js":"/**\n * Entities.js\n *\n * Copyright 2010, Moxiecode Systems AB\n * Released under LGPL License.\n *\n * License: http://tinymce.moxiecode.com/license\n * Contributing: http://tinymce.moxiecode.com/contributing\n */\n\n(function(tinymce) {\n\tvar namedEntities, baseEntities, reverseEntities,\n\t\tattrsCharsRegExp = /[&<>\\\"\\u007E-\\uD7FF\\uE000-\\uFFEF]|[\\uD800-\\uDBFF][\\uDC00-\\uDFFF]/g,\n\t\ttextCharsRegExp = /[<>&\\u007E-\\uD7FF\\uE000-\\uFFEF]|[\\uD800-\\uDBFF][\\uDC00-\\uDFFF]/g,\n\t\trawCharsRegExp = /[<>&\\\"\\']/g,\n\t\tentityRegExp = /&(#x|#)?([\\w]+);/g,\n\t\tasciiMap = {\n\t\t\t\t128 : \"\\u20AC\", 130 : \"\\u201A\", 131 : \"\\u0192\", 132 : \"\\u201E\", 133 : \"\\u2026\", 134 : \"\\u2020\",\n\t\t\t\t135 : \"\\u2021\", 136 : \"\\u02C6\", 137 : \"\\u2030\", 138 : \"\\u0160\", 139 : \"\\u2039\", 140 : \"\\u0152\",\n\t\t\t\t142 : \"\\u017D\", 145 : \"\\u2018\", 146 : \"\\u2019\", 147 : \"\\u201C\", 148 : \"\\u201D\", 149 : \"\\u2022\",\n\t\t\t\t150 : \"\\u2013\", 151 : \"\\u2014\", 152 : \"\\u02DC\", 153 : \"\\u2122\", 154 : \"\\u0161\", 155 : \"\\u203A\",\n\t\t\t\t156 : \"\\u0153\", 158 : \"\\u017E\", 159 : \"\\u0178\"\n\t\t};\n\n\t// Raw entities\n\tbaseEntities = {\n\t\t'\\\"' : '&quot;', // Needs to be escaped since the YUI compressor would otherwise break the code\n\t\t\"'\" : '&#39;',\n\t\t'<' : '&lt;',\n\t\t'>' : '&gt;',\n\t\t'&' : '&amp;'\n\t};\n\n\t// Reverse lookup table for raw entities\n\treverseEntities = {\n\t\t'&lt;' : '<',\n\t\t'&gt;' : '>',\n\t\t'&amp;' : '&',\n\t\t'&quot;' : '\"',\n\t\t'&apos;' : \"'\"\n\t};\n\n\t// Decodes text by using the browser\n\tfunction nativeDecode(text) {\n\t\tvar elm;\n\n\t\telm = document.createElement(\"div\");\n\t\telm.innerHTML = text;\n\n\t\treturn elm.textContent || elm.innerText || text;\n\t};\n\n\t// Build a two way lookup table for the entities\n\tfunction buildEntitiesLookup(items, radix) {\n\t\tvar i, chr, entity, lookup = {};\n\n\t\tif (items) {\n\t\t\titems = items.split(',');\n\t\t\tradix = radix || 10;\n\n\t\t\t// Build entities lookup table\n\t\t\tfor (i = 0; i < items.length; i += 2) {\n\t\t\t\tchr = String.fromCharCode(parseInt(items[i], radix));\n\n\t\t\t\t// Only add non base entities\n\t\t\t\tif (!baseEntities[chr]) {\n\t\t\t\t\tentity = '&' + items[i + 1] + ';';\n\t\t\t\t\tlookup[chr] = entity;\n\t\t\t\t\tlookup[entity] = chr;\n\t\t\t\t}\n\t\t\t}\n\n\t\t\treturn lookup;\n\t\t}\n\t};\n\n\t// Unpack entities lookup where the numbers are in radix 32 to reduce the size\n\tnamedEntities = buildEntitiesLookup(\n\t\t'50,nbsp,51,iexcl,52,cent,53,pound,54,curren,55,yen,56,brvbar,57,sect,58,uml,59,copy,' +\n\t\t'5a,ordf,5b,laquo,5c,not,5d,shy,5e,reg,5f,macr,5g,deg,5h,plusmn,5i,sup2,5j,sup3,5k,acute,' +\n\t\t'5l,micro,5m,para,5n,middot,5o,cedil,5p,sup1,5q,ordm,5r,raquo,5s,frac14,5t,frac12,5u,frac34,' +\n\t\t'5v,iquest,60,Agrave,61,Aacute,62,Acirc,63,Atilde,64,Auml,65,Aring,66,AElig,67,Ccedil,' +\n\t\t'68,Egrave,69,Eacute,6a,Ecirc,6b,Euml,6c,Igrave,6d,Iacute,6e,Icirc,6f,Iuml,6g,ETH,6h,Ntilde,' +\n\t\t'6i,Ograve,6j,Oacute,6k,Ocirc,6l,Otilde,6m,Ouml,6n,times,6o,Oslash,6p,Ugrave,6q,Uacute,' +\n\t\t'6r,Ucirc,6s,Uuml,6t,Yacute,6u,THORN,6v,szlig,70,agrave,71,aacute,72,acirc,73,atilde,74,auml,' +\n\t\t'75,aring,76,aelig,77,ccedil,78,egrave,79,eacute,7a,ecirc,7b,euml,7c,igrave,7d,iacute,7e,icirc,' +\n\t\t'7f,iuml,7g,eth,7h,ntilde,7i,ograve,7j,oacute,7k,ocirc,7l,otilde,7m,ouml,7n,divide,7o,oslash,' +\n\t\t'7p,ugrave,7q,uacute,7r,ucirc,7s,uuml,7t,yacute,7u,thorn,7v,yuml,ci,fnof,sh,Alpha,si,Beta,' +\n\t\t'sj,Gamma,sk,Delta,sl,Epsilon,sm,Zeta,sn,Eta,so,Theta,sp,Iota,sq,Kappa,sr,Lambda,ss,Mu,' +\n\t\t'st,Nu,su,Xi,sv,Omicron,t0,Pi,t1,Rho,t3,Sigma,t4,Tau,t5,Upsilon,t6,Phi,t7,Chi,t8,Psi,' +\n\t\t't9,Omega,th,alpha,ti,beta,tj,gamma,tk,delta,tl,epsilon,tm,zeta,tn,eta,to,theta,tp,iota,' +\n\t\t'tq,kappa,tr,lambda,ts,mu,tt,nu,tu,xi,tv,omicron,u0,pi,u1,rho,u2,sigmaf,u3,sigma,u4,tau,' +\n\t\t'u5,upsilon,u6,phi,u7,chi,u8,psi,u9,omega,uh,thetasym,ui,upsih,um,piv,812,bull,816,hellip,' +\n\t\t'81i,prime,81j,Prime,81u,oline,824,frasl,88o,weierp,88h,image,88s,real,892,trade,89l,alefsym,' +\n\t\t'8cg,larr,8ch,uarr,8ci,rarr,8cj,darr,8ck,harr,8dl,crarr,8eg,lArr,8eh,uArr,8ei,rArr,8ej,dArr,' +\n\t\t'8ek,hArr,8g0,forall,8g2,part,8g3,exist,8g5,empty,8g7,nabla,8g8,isin,8g9,notin,8gb,ni,8gf,prod,' +\n\t\t'8gh,sum,8gi,minus,8gn,lowast,8gq,radic,8gt,prop,8gu,infin,8h0,ang,8h7,and,8h8,or,8h9,cap,8ha,cup,' +\n\t\t'8hb,int,8hk,there4,8hs,sim,8i5,cong,8i8,asymp,8j0,ne,8j1,equiv,8j4,le,8j5,ge,8k2,sub,8k3,sup,8k4,' +\n\t\t'nsub,8k6,sube,8k7,supe,8kl,oplus,8kn,otimes,8l5,perp,8m5,sdot,8o8,lceil,8o9,rceil,8oa,lfloor,8ob,' +\n\t\t'rfloor,8p9,lang,8pa,rang,9ea,loz,9j0,spades,9j3,clubs,9j5,hearts,9j6,diams,ai,OElig,aj,oelig,b0,' +\n\t\t'Scaron,b1,scaron,bo,Yuml,m6,circ,ms,tilde,802,ensp,803,emsp,809,thinsp,80c,zwnj,80d,zwj,80e,lrm,' +\n\t\t'80f,rlm,80j,ndash,80k,mdash,80o,lsquo,80p,rsquo,80q,sbquo,80s,ldquo,80t,rdquo,80u,bdquo,810,dagger,' +\n\t\t'811,Dagger,81g,permil,81p,lsaquo,81q,rsaquo,85c,euro'\n\t, 32);\n\n\ttinymce.html = tinymce.html || {};\n\n\t/**\n\t * Entity encoder class.\n\t *\n\t * @class tinymce.html.SaxParser\n\t * @static\n\t * @version 3.4\n\t */\n\ttinymce.html.Entities = {\n\t\t/**\n\t\t * Encodes the specified string using raw entities. This means only the required XML base entities will be endoded.\n\t\t *\n\t\t * @method encodeRaw\n\t\t * @param {String} text Text to encode.\n\t\t * @param {Boolean} attr Optional flag to specify if the text is attribute contents.\n\t\t * @return {String} Entity encoded text.\n\t\t */\n\t\tencodeRaw : function(text, attr) {\n\t\t\treturn text.replace(attr ? attrsCharsRegExp : textCharsRegExp, function(chr) {\n\t\t\t\treturn baseEntities[chr] || chr;\n\t\t\t});\n\t\t},\n\n\t\t/**\n\t\t * Encoded the specified text with both the attributes and text entities. This function will produce larger text contents\n\t\t * since it doesn't know if the context is within a attribute or text node. This was added for compatibility\n\t\t * and is exposed as the DOMUtils.encode function.\n\t\t *\n\t\t * @method encodeAllRaw\n\t\t * @param {String} text Text to encode.\n\t\t * @return {String} Entity encoded text.\n\t\t */\n\t\tencodeAllRaw : function(text) {\n\t\t\treturn ('' + text).replace(rawCharsRegExp, function(chr) {\n\t\t\t\treturn baseEntities[chr] || chr;\n\t\t\t});\n\t\t},\n\n\t\t/**\n\t\t * Encodes the specified string using numeric entities. The core entities will be encoded as named ones but all non lower ascii characters\n\t\t * will be encoded into numeric entities.\n\t\t *\n\t\t * @method encodeNumeric\n\t\t * @param {String} text Text to encode.\n\t\t * @param {Boolean} attr Optional flag to specify if the text is attribute contents.\n\t\t * @return {String} Entity encoded text.\n\t\t */\n\t\tencodeNumeric : function(text, attr) {\n\t\t\treturn text.replace(attr ? attrsCharsRegExp : textCharsRegExp, function(chr) {\n\t\t\t\t// Multi byte sequence convert it to a single entity\n\t\t\t\tif (chr.length > 1)\n\t\t\t\t\treturn '&#' + (((chr.charCodeAt(0) - 0xD800) * 0x400) + (chr.charCodeAt(1) - 0xDC00) + 0x10000) + ';';\n\n\t\t\t\treturn baseEntities[chr] || '&#' + chr.charCodeAt(0) + ';';\n\t\t\t});\n\t\t},\n\n\t\t/**\n\t\t * Encodes the specified string using named entities. The core entities will be encoded as named ones but all non lower ascii characters\n\t\t * will be encoded into named entities.\n\t\t *\n\t\t * @method encodeNamed\n\t\t * @param {String} text Text to encode.\n\t\t * @param {Boolean} attr Optional flag to specify if the text is attribute contents.\n\t\t * @param {Object} entities Optional parameter with entities to use.\n\t\t * @return {String} Entity encoded text.\n\t\t */\n\t\tencodeNamed : function(text, attr, entities) {\n\t\t\tentities = entities || namedEntities;\n\n\t\t\treturn text.replace(attr ? attrsCharsRegExp : textCharsRegExp, function(chr) {\n\t\t\t\treturn baseEntities[chr] || entities[chr] || chr;\n\t\t\t});\n\t\t},\n\n\t\t/**\n\t\t * Returns an encode function based on the name(s) and it's optional entities.\n\t\t *\n\t\t * @method getEncodeFunc\n\t\t * @param {String} name Comma separated list of encoders for example named,numeric.\n\t\t * @param {String} entities Optional parameter with entities to use instead of the built in set.\n\t\t * @return {function} Encode function to be used.\n\t\t */\n\t\tgetEncodeFunc : function(name, entities) {\n\t\t\tvar Entities = tinymce.html.Entities;\n\n\t\t\tentities = buildEntitiesLookup(entities) || namedEntities;\n\n\t\t\tfunction encodeNamedAndNumeric(text, attr) {\n\t\t\t\treturn text.replace(attr ? attrsCharsRegExp : textCharsRegExp, function(chr) {\n\t\t\t\t\treturn baseEntities[chr] || entities[chr] || '&#' + chr.charCodeAt(0) + ';' || chr;\n\t\t\t\t});\n\t\t\t};\n\n\t\t\tfunction encodeCustomNamed(text, attr) {\n\t\t\t\treturn Entities.encodeNamed(text, attr, entities);\n\t\t\t};\n\n\t\t\t// Replace + with , to be compatible with previous TinyMCE versions\n\t\t\tname = tinymce.makeMap(name.replace(/\\+/g, ','));\n\n\t\t\t// Named and numeric encoder\n\t\t\tif (name.named && name.numeric)\n\t\t\t\treturn encodeNamedAndNumeric;\n\n\t\t\t// Named encoder\n\t\t\tif (name.named) {\n\t\t\t\t// Custom names\n\t\t\t\tif (entities)\n\t\t\t\t\treturn encodeCustomNamed;\n\n\t\t\t\treturn Entities.encodeNamed;\n\t\t\t}\n\n\t\t\t// Numeric\n\t\t\tif (name.numeric)\n\t\t\t\treturn Entities.encodeNumeric;\n\n\t\t\t// Raw encoder\n\t\t\treturn Entities.encodeRaw;\n\t\t},\n\n\t\t/**\n\t\t * Decodes the specified string, this will replace entities with raw UTF characters.\n\t\t *\n\t\t * @param {String} text Text to entity decode.\n\t\t * @return {String} Entity decoded string.\n\t\t */\n\t\tdecode : function(text) {\n\t\t\treturn text.replace(entityRegExp, function(all, numeric, value) {\n\t\t\t\tif (numeric) {\n\t\t\t\t\tvalue = parseInt(value, numeric.length === 2 ? 16 : 10);\n\n\t\t\t\t\t// Support upper UTF\n\t\t\t\t\tif (value > 0xFFFF) {\n\t\t\t\t\t\tvalue -= 0x10000;\n\n\t\t\t\t\t\treturn String.fromCharCode(0xD800 + (value >> 10), 0xDC00 + (value & 0x3FF));\n\t\t\t\t\t} else\n\t\t\t\t\t\treturn asciiMap[value] || String.fromCharCode(value);\n\t\t\t\t}\n\n\t\t\t\treturn reverseEntities[all] || namedEntities[all] || nativeDecode(all);\n\t\t\t});\n\t\t}\n\t};\n})(tinymce);\n"}
}});