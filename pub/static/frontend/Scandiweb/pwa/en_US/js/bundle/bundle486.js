require.config({"config": {
        "jsbuild":{"Magento_Tinymce3/tiny_mce/themes/advanced/js/charmap.js":"/**\n * charmap.js\n *\n * Copyright 2009, Moxiecode Systems AB\n * Released under LGPL License.\n *\n * License: http://tinymce.moxiecode.com/license\n * Contributing: http://tinymce.moxiecode.com/contributing\n */\n\ntinyMCEPopup.requireLangPack();\n\nvar charmap = [\n\t['&nbsp;',    '&#160;',  true, 'no-break space'],\n\t['&amp;',     '&#38;',   true, 'ampersand'],\n\t['&quot;',    '&#34;',   true, 'quotation mark'],\n// finance\n\t['&cent;',    '&#162;',  true, 'cent sign'],\n\t['&euro;',    '&#8364;', true, 'euro sign'],\n\t['&pound;',   '&#163;',  true, 'pound sign'],\n\t['&yen;',     '&#165;',  true, 'yen sign'],\n// signs\n\t['&copy;',    '&#169;',  true, 'copyright sign'],\n\t['&reg;',     '&#174;',  true, 'registered sign'],\n\t['&trade;',   '&#8482;', true, 'trade mark sign'],\n\t['&permil;',  '&#8240;', true, 'per mille sign'],\n\t['&micro;',   '&#181;',  true, 'micro sign'],\n\t['&middot;',  '&#183;',  true, 'middle dot'],\n\t['&bull;',    '&#8226;', true, 'bullet'],\n\t['&hellip;',  '&#8230;', true, 'three dot leader'],\n\t['&prime;',   '&#8242;', true, 'minutes / feet'],\n\t['&Prime;',   '&#8243;', true, 'seconds / inches'],\n\t['&sect;',    '&#167;',  true, 'section sign'],\n\t['&para;',    '&#182;',  true, 'paragraph sign'],\n\t['&szlig;',   '&#223;',  true, 'sharp s / ess-zed'],\n// quotations\n\t['&lsaquo;',  '&#8249;', true, 'single left-pointing angle quotation mark'],\n\t['&rsaquo;',  '&#8250;', true, 'single right-pointing angle quotation mark'],\n\t['&laquo;',   '&#171;',  true, 'left pointing guillemet'],\n\t['&raquo;',   '&#187;',  true, 'right pointing guillemet'],\n\t['&lsquo;',   '&#8216;', true, 'left single quotation mark'],\n\t['&rsquo;',   '&#8217;', true, 'right single quotation mark'],\n\t['&ldquo;',   '&#8220;', true, 'left double quotation mark'],\n\t['&rdquo;',   '&#8221;', true, 'right double quotation mark'],\n\t['&sbquo;',   '&#8218;', true, 'single low-9 quotation mark'],\n\t['&bdquo;',   '&#8222;', true, 'double low-9 quotation mark'],\n\t['&lt;',      '&#60;',   true, 'less-than sign'],\n\t['&gt;',      '&#62;',   true, 'greater-than sign'],\n\t['&le;',      '&#8804;', true, 'less-than or equal to'],\n\t['&ge;',      '&#8805;', true, 'greater-than or equal to'],\n\t['&ndash;',   '&#8211;', true, 'en dash'],\n\t['&mdash;',   '&#8212;', true, 'em dash'],\n\t['&macr;',    '&#175;',  true, 'macron'],\n\t['&oline;',   '&#8254;', true, 'overline'],\n\t['&curren;',  '&#164;',  true, 'currency sign'],\n\t['&brvbar;',  '&#166;',  true, 'broken bar'],\n\t['&uml;',     '&#168;',  true, 'diaeresis'],\n\t['&iexcl;',   '&#161;',  true, 'inverted exclamation mark'],\n\t['&iquest;',  '&#191;',  true, 'turned question mark'],\n\t['&circ;',    '&#710;',  true, 'circumflex accent'],\n\t['&tilde;',   '&#732;',  true, 'small tilde'],\n\t['&deg;',     '&#176;',  true, 'degree sign'],\n\t['&minus;',   '&#8722;', true, 'minus sign'],\n\t['&plusmn;',  '&#177;',  true, 'plus-minus sign'],\n\t['&divide;',  '&#247;',  true, 'division sign'],\n\t['&frasl;',   '&#8260;', true, 'fraction slash'],\n\t['&times;',   '&#215;',  true, 'multiplication sign'],\n\t['&sup1;',    '&#185;',  true, 'superscript one'],\n\t['&sup2;',    '&#178;',  true, 'superscript two'],\n\t['&sup3;',    '&#179;',  true, 'superscript three'],\n\t['&frac14;',  '&#188;',  true, 'fraction one quarter'],\n\t['&frac12;',  '&#189;',  true, 'fraction one half'],\n\t['&frac34;',  '&#190;',  true, 'fraction three quarters'],\n// math / logical\n\t['&fnof;',    '&#402;',  true, 'function / florin'],\n\t['&int;',     '&#8747;', true, 'integral'],\n\t['&sum;',     '&#8721;', true, 'n-ary sumation'],\n\t['&infin;',   '&#8734;', true, 'infinity'],\n\t['&radic;',   '&#8730;', true, 'square root'],\n\t['&sim;',     '&#8764;', false,'similar to'],\n\t['&cong;',    '&#8773;', false,'approximately equal to'],\n\t['&asymp;',   '&#8776;', true, 'almost equal to'],\n\t['&ne;',      '&#8800;', true, 'not equal to'],\n\t['&equiv;',   '&#8801;', true, 'identical to'],\n\t['&isin;',    '&#8712;', false,'element of'],\n\t['&notin;',   '&#8713;', false,'not an element of'],\n\t['&ni;',      '&#8715;', false,'contains as member'],\n\t['&prod;',    '&#8719;', true, 'n-ary product'],\n\t['&and;',     '&#8743;', false,'logical and'],\n\t['&or;',      '&#8744;', false,'logical or'],\n\t['&not;',     '&#172;',  true, 'not sign'],\n\t['&cap;',     '&#8745;', true, 'intersection'],\n\t['&cup;',     '&#8746;', false,'union'],\n\t['&part;',    '&#8706;', true, 'partial differential'],\n\t['&forall;',  '&#8704;', false,'for all'],\n\t['&exist;',   '&#8707;', false,'there exists'],\n\t['&empty;',   '&#8709;', false,'diameter'],\n\t['&nabla;',   '&#8711;', false,'backward difference'],\n\t['&lowast;',  '&#8727;', false,'asterisk operator'],\n\t['&prop;',    '&#8733;', false,'proportional to'],\n\t['&ang;',     '&#8736;', false,'angle'],\n// undefined\n\t['&acute;',   '&#180;',  true, 'acute accent'],\n\t['&cedil;',   '&#184;',  true, 'cedilla'],\n\t['&ordf;',    '&#170;',  true, 'feminine ordinal indicator'],\n\t['&ordm;',    '&#186;',  true, 'masculine ordinal indicator'],\n\t['&dagger;',  '&#8224;', true, 'dagger'],\n\t['&Dagger;',  '&#8225;', true, 'double dagger'],\n// alphabetical special chars\n\t['&Agrave;',  '&#192;',  true, 'A - grave'],\n\t['&Aacute;',  '&#193;',  true, 'A - acute'],\n\t['&Acirc;',   '&#194;',  true, 'A - circumflex'],\n\t['&Atilde;',  '&#195;',  true, 'A - tilde'],\n\t['&Auml;',    '&#196;',  true, 'A - diaeresis'],\n\t['&Aring;',   '&#197;',  true, 'A - ring above'],\n\t['&AElig;',   '&#198;',  true, 'ligature AE'],\n\t['&Ccedil;',  '&#199;',  true, 'C - cedilla'],\n\t['&Egrave;',  '&#200;',  true, 'E - grave'],\n\t['&Eacute;',  '&#201;',  true, 'E - acute'],\n\t['&Ecirc;',   '&#202;',  true, 'E - circumflex'],\n\t['&Euml;',    '&#203;',  true, 'E - diaeresis'],\n\t['&Igrave;',  '&#204;',  true, 'I - grave'],\n\t['&Iacute;',  '&#205;',  true, 'I - acute'],\n\t['&Icirc;',   '&#206;',  true, 'I - circumflex'],\n\t['&Iuml;',    '&#207;',  true, 'I - diaeresis'],\n\t['&ETH;',     '&#208;',  true, 'ETH'],\n\t['&Ntilde;',  '&#209;',  true, 'N - tilde'],\n\t['&Ograve;',  '&#210;',  true, 'O - grave'],\n\t['&Oacute;',  '&#211;',  true, 'O - acute'],\n\t['&Ocirc;',   '&#212;',  true, 'O - circumflex'],\n\t['&Otilde;',  '&#213;',  true, 'O - tilde'],\n\t['&Ouml;',    '&#214;',  true, 'O - diaeresis'],\n\t['&Oslash;',  '&#216;',  true, 'O - slash'],\n\t['&OElig;',   '&#338;',  true, 'ligature OE'],\n\t['&Scaron;',  '&#352;',  true, 'S - caron'],\n\t['&Ugrave;',  '&#217;',  true, 'U - grave'],\n\t['&Uacute;',  '&#218;',  true, 'U - acute'],\n\t['&Ucirc;',   '&#219;',  true, 'U - circumflex'],\n\t['&Uuml;',    '&#220;',  true, 'U - diaeresis'],\n\t['&Yacute;',  '&#221;',  true, 'Y - acute'],\n\t['&Yuml;',    '&#376;',  true, 'Y - diaeresis'],\n\t['&THORN;',   '&#222;',  true, 'THORN'],\n\t['&agrave;',  '&#224;',  true, 'a - grave'],\n\t['&aacute;',  '&#225;',  true, 'a - acute'],\n\t['&acirc;',   '&#226;',  true, 'a - circumflex'],\n\t['&atilde;',  '&#227;',  true, 'a - tilde'],\n\t['&auml;',    '&#228;',  true, 'a - diaeresis'],\n\t['&aring;',   '&#229;',  true, 'a - ring above'],\n\t['&aelig;',   '&#230;',  true, 'ligature ae'],\n\t['&ccedil;',  '&#231;',  true, 'c - cedilla'],\n\t['&egrave;',  '&#232;',  true, 'e - grave'],\n\t['&eacute;',  '&#233;',  true, 'e - acute'],\n\t['&ecirc;',   '&#234;',  true, 'e - circumflex'],\n\t['&euml;',    '&#235;',  true, 'e - diaeresis'],\n\t['&igrave;',  '&#236;',  true, 'i - grave'],\n\t['&iacute;',  '&#237;',  true, 'i - acute'],\n\t['&icirc;',   '&#238;',  true, 'i - circumflex'],\n\t['&iuml;',    '&#239;',  true, 'i - diaeresis'],\n\t['&eth;',     '&#240;',  true, 'eth'],\n\t['&ntilde;',  '&#241;',  true, 'n - tilde'],\n\t['&ograve;',  '&#242;',  true, 'o - grave'],\n\t['&oacute;',  '&#243;',  true, 'o - acute'],\n\t['&ocirc;',   '&#244;',  true, 'o - circumflex'],\n\t['&otilde;',  '&#245;',  true, 'o - tilde'],\n\t['&ouml;',    '&#246;',  true, 'o - diaeresis'],\n\t['&oslash;',  '&#248;',  true, 'o slash'],\n\t['&oelig;',   '&#339;',  true, 'ligature oe'],\n\t['&scaron;',  '&#353;',  true, 's - caron'],\n\t['&ugrave;',  '&#249;',  true, 'u - grave'],\n\t['&uacute;',  '&#250;',  true, 'u - acute'],\n\t['&ucirc;',   '&#251;',  true, 'u - circumflex'],\n\t['&uuml;',    '&#252;',  true, 'u - diaeresis'],\n\t['&yacute;',  '&#253;',  true, 'y - acute'],\n\t['&thorn;',   '&#254;',  true, 'thorn'],\n\t['&yuml;',    '&#255;',  true, 'y - diaeresis'],\n\t['&Alpha;',   '&#913;',  true, 'Alpha'],\n\t['&Beta;',    '&#914;',  true, 'Beta'],\n\t['&Gamma;',   '&#915;',  true, 'Gamma'],\n\t['&Delta;',   '&#916;',  true, 'Delta'],\n\t['&Epsilon;', '&#917;',  true, 'Epsilon'],\n\t['&Zeta;',    '&#918;',  true, 'Zeta'],\n\t['&Eta;',     '&#919;',  true, 'Eta'],\n\t['&Theta;',   '&#920;',  true, 'Theta'],\n\t['&Iota;',    '&#921;',  true, 'Iota'],\n\t['&Kappa;',   '&#922;',  true, 'Kappa'],\n\t['&Lambda;',  '&#923;',  true, 'Lambda'],\n\t['&Mu;',      '&#924;',  true, 'Mu'],\n\t['&Nu;',      '&#925;',  true, 'Nu'],\n\t['&Xi;',      '&#926;',  true, 'Xi'],\n\t['&Omicron;', '&#927;',  true, 'Omicron'],\n\t['&Pi;',      '&#928;',  true, 'Pi'],\n\t['&Rho;',     '&#929;',  true, 'Rho'],\n\t['&Sigma;',   '&#931;',  true, 'Sigma'],\n\t['&Tau;',     '&#932;',  true, 'Tau'],\n\t['&Upsilon;', '&#933;',  true, 'Upsilon'],\n\t['&Phi;',     '&#934;',  true, 'Phi'],\n\t['&Chi;',     '&#935;',  true, 'Chi'],\n\t['&Psi;',     '&#936;',  true, 'Psi'],\n\t['&Omega;',   '&#937;',  true, 'Omega'],\n\t['&alpha;',   '&#945;',  true, 'alpha'],\n\t['&beta;',    '&#946;',  true, 'beta'],\n\t['&gamma;',   '&#947;',  true, 'gamma'],\n\t['&delta;',   '&#948;',  true, 'delta'],\n\t['&epsilon;', '&#949;',  true, 'epsilon'],\n\t['&zeta;',    '&#950;',  true, 'zeta'],\n\t['&eta;',     '&#951;',  true, 'eta'],\n\t['&theta;',   '&#952;',  true, 'theta'],\n\t['&iota;',    '&#953;',  true, 'iota'],\n\t['&kappa;',   '&#954;',  true, 'kappa'],\n\t['&lambda;',  '&#955;',  true, 'lambda'],\n\t['&mu;',      '&#956;',  true, 'mu'],\n\t['&nu;',      '&#957;',  true, 'nu'],\n\t['&xi;',      '&#958;',  true, 'xi'],\n\t['&omicron;', '&#959;',  true, 'omicron'],\n\t['&pi;',      '&#960;',  true, 'pi'],\n\t['&rho;',     '&#961;',  true, 'rho'],\n\t['&sigmaf;',  '&#962;',  true, 'final sigma'],\n\t['&sigma;',   '&#963;',  true, 'sigma'],\n\t['&tau;',     '&#964;',  true, 'tau'],\n\t['&upsilon;', '&#965;',  true, 'upsilon'],\n\t['&phi;',     '&#966;',  true, 'phi'],\n\t['&chi;',     '&#967;',  true, 'chi'],\n\t['&psi;',     '&#968;',  true, 'psi'],\n\t['&omega;',   '&#969;',  true, 'omega'],\n// symbols\n\t['&alefsym;', '&#8501;', false,'alef symbol'],\n\t['&piv;',     '&#982;',  false,'pi symbol'],\n\t['&real;',    '&#8476;', false,'real part symbol'],\n\t['&thetasym;','&#977;',  false,'theta symbol'],\n\t['&upsih;',   '&#978;',  false,'upsilon - hook symbol'],\n\t['&weierp;',  '&#8472;', false,'Weierstrass p'],\n\t['&image;',   '&#8465;', false,'imaginary part'],\n// arrows\n\t['&larr;',    '&#8592;', true, 'leftwards arrow'],\n\t['&uarr;',    '&#8593;', true, 'upwards arrow'],\n\t['&rarr;',    '&#8594;', true, 'rightwards arrow'],\n\t['&darr;',    '&#8595;', true, 'downwards arrow'],\n\t['&harr;',    '&#8596;', true, 'left right arrow'],\n\t['&crarr;',   '&#8629;', false,'carriage return'],\n\t['&lArr;',    '&#8656;', false,'leftwards double arrow'],\n\t['&uArr;',    '&#8657;', false,'upwards double arrow'],\n\t['&rArr;',    '&#8658;', false,'rightwards double arrow'],\n\t['&dArr;',    '&#8659;', false,'downwards double arrow'],\n\t['&hArr;',    '&#8660;', false,'left right double arrow'],\n\t['&there4;',  '&#8756;', false,'therefore'],\n\t['&sub;',     '&#8834;', false,'subset of'],\n\t['&sup;',     '&#8835;', false,'superset of'],\n\t['&nsub;',    '&#8836;', false,'not a subset of'],\n\t['&sube;',    '&#8838;', false,'subset of or equal to'],\n\t['&supe;',    '&#8839;', false,'superset of or equal to'],\n\t['&oplus;',   '&#8853;', false,'circled plus'],\n\t['&otimes;',  '&#8855;', false,'circled times'],\n\t['&perp;',    '&#8869;', false,'perpendicular'],\n\t['&sdot;',    '&#8901;', false,'dot operator'],\n\t['&lceil;',   '&#8968;', false,'left ceiling'],\n\t['&rceil;',   '&#8969;', false,'right ceiling'],\n\t['&lfloor;',  '&#8970;', false,'left floor'],\n\t['&rfloor;',  '&#8971;', false,'right floor'],\n\t['&lang;',    '&#9001;', false,'left-pointing angle bracket'],\n\t['&rang;',    '&#9002;', false,'right-pointing angle bracket'],\n\t['&loz;',     '&#9674;', true, 'lozenge'],\n\t['&spades;',  '&#9824;', true, 'black spade suit'],\n\t['&clubs;',   '&#9827;', true, 'black club suit'],\n\t['&hearts;',  '&#9829;', true, 'black heart suit'],\n\t['&diams;',   '&#9830;', true, 'black diamond suit'],\n\t['&ensp;',    '&#8194;', false,'en space'],\n\t['&emsp;',    '&#8195;', false,'em space'],\n\t['&thinsp;',  '&#8201;', false,'thin space'],\n\t['&zwnj;',    '&#8204;', false,'zero width non-joiner'],\n\t['&zwj;',     '&#8205;', false,'zero width joiner'],\n\t['&lrm;',     '&#8206;', false,'left-to-right mark'],\n\t['&rlm;',     '&#8207;', false,'right-to-left mark'],\n\t['&shy;',     '&#173;',  false,'soft hyphen']\n];\n\ntinyMCEPopup.onInit.add(function() {\n\ttinyMCEPopup.dom.setHTML('charmapView', renderCharMapHTML());\n\taddKeyboardNavigation();\n});\n\nfunction addKeyboardNavigation(){\n\tvar tableElm, cells, settings;\n\n\tcells = tinyMCEPopup.dom.select(\"a.charmaplink\", \"charmapgroup\");\n\n\tsettings ={\n\t\troot: \"charmapgroup\",\n\t\titems: cells\n\t};\n\tcells[0].tabindex=0;\n\ttinyMCEPopup.dom.addClass(cells[0], \"mceFocus\");\n\tif (tinymce.isGecko) {\n\t\tcells[0].focus();\t\t\n\t} else {\n\t\tsetTimeout(function(){\n\t\t\tcells[0].focus();\n\t\t}, 100);\n\t}\n\ttinyMCEPopup.editor.windowManager.createInstance('tinymce.ui.KeyboardNavigation', settings, tinyMCEPopup.dom);\n}\n\nfunction renderCharMapHTML() {\n\tvar charsPerRow = 20, tdWidth=20, tdHeight=20, i;\n\tvar html = '<div id=\"charmapgroup\" aria-labelledby=\"charmap_label\" tabindex=\"0\" role=\"listbox\">'+\n\t'<table role=\"presentation\" border=\"0\" cellspacing=\"1\" cellpadding=\"0\" width=\"' + (tdWidth*charsPerRow) + \n\t'\"><tr height=\"' + tdHeight + '\">';\n\tvar cols=-1;\n\n\tfor (i=0; i<charmap.length; i++) {\n\t\tvar previewCharFn;\n\n\t\tif (charmap[i][2]==true) {\n\t\t\tcols++;\n\t\t\tpreviewCharFn = 'previewChar(\\'' + charmap[i][1].substring(1,charmap[i][1].length) + '\\',\\'' + charmap[i][0].substring(1,charmap[i][0].length) + '\\',\\'' + charmap[i][3] + '\\');';\n\t\t\thtml += ''\n\t\t\t\t+ '<td class=\"charmap\">'\n\t\t\t\t+ '<a class=\"charmaplink\" role=\"button\" onmouseover=\"'+previewCharFn+'\" onfocus=\"'+previewCharFn+'\" href=\"javascript:void(0)\" onclick=\"insertChar(\\'' + charmap[i][1].substring(2,charmap[i][1].length-1) + '\\');\" onclick=\"return false;\" onmousedown=\"return false;\" title=\"' + charmap[i][3] + ' '+ tinyMCEPopup.editor.translate(\"advanced_dlg.charmap_usage\")+'\">'\n\t\t\t\t+ charmap[i][1]\n\t\t\t\t+ '</a></td>';\n\t\t\tif ((cols+1) % charsPerRow == 0)\n\t\t\t\thtml += '</tr><tr height=\"' + tdHeight + '\">';\n\t\t}\n\t }\n\n\tif (cols % charsPerRow > 0) {\n\t\tvar padd = charsPerRow - (cols % charsPerRow);\n\t\tfor (var i=0; i<padd-1; i++)\n\t\t\thtml += '<td width=\"' + tdWidth + '\" height=\"' + tdHeight + '\" class=\"charmap\">&nbsp;</td>';\n\t}\n\n\thtml += '</tr></table></div>';\n\thtml = html.replace(/<tr height=\"20\"><\\/tr>/g, '');\n\n\treturn html;\n}\n\nfunction insertChar(chr) {\n\ttinyMCEPopup.execCommand('mceInsertContent', false, '&#' + chr + ';');\n\n\t// Refocus in window\n\tif (tinyMCEPopup.isWindow)\n\t\twindow.focus();\n\n\ttinyMCEPopup.editor.focus();\n\ttinyMCEPopup.close();\n}\n\nfunction previewChar(codeA, codeB, codeN) {\n\tvar elmA = document.getElementById('codeA');\n\tvar elmB = document.getElementById('codeB');\n\tvar elmV = document.getElementById('codeV');\n\tvar elmN = document.getElementById('codeN');\n\n\tif (codeA=='#160;') {\n\t\telmV.innerHTML = '__';\n\t} else {\n\t\telmV.innerHTML = '&' + codeA;\n\t}\n\n\telmB.innerHTML = '&amp;' + codeA;\n\telmA.innerHTML = '&amp;' + codeB;\n\telmN.innerHTML = codeN;\n}\n"}
}});