require.config({"config": {
        "jsbuild":{"jquery/editableMultiselect/js/jquery.multiselect.js":"define([\n    \"jquery\"\n], function($){\n\n    /*\n     * jQuery.multiselect plugin\n     *\n     * Form control: allow select several values from list and add new value(s) to list\n     *\n     * Licensed under the BSD License:\n     *   http://www.opensource.org/licenses/bsd-license\n     *\n     * Version: 0.9.0\n     *\n     * @author Dmitry (dio) Levashov, dio@std42.ru\n     * @example\n     *  html: <select name=\"my-select\" multiple=\"on\"><option .... </select>\n     * js   : $('select[name=\"my-select\"]').multiselect()\n     *  or\n     * var opts = { ... };\n     * $('select[name=\"my-select\"]').multiselect(opts);\n     */\n    $.fn.multiselect = function(opts) {\n        var o = $.extend({\n            mselectHiddenClass: 'mselect-hidden',\n            mselectItemNotEditableClass: 'mselect-list-item-not-editable',\n            mselectItemNotRemovableClass: 'mselect-list-item-not-removable',\n            mselectListClass: 'mselect-list',\n            mselectItemsWrapperClass: 'mselect-items-wrapper',\n            mselectButtonAddClass: 'mselect-button-add',\n            mselectInputContainerClass: 'mselect-input-container',\n            mselectInputClass: 'mselect-input',\n            mselectButtonCancelClass: 'mselect-cancel',\n            mselectButtonSaveClass: 'mselect-save',\n            mselectListItemClass: 'mselect-list-item',\n            mselectItemsWrapperOverflowClass: 'mselect-fixed',\n            mselectDisabledClass: 'mselect-disabled',\n            mselectCheckedClass: 'mselect-checked',\n            layout: '<section class=\"block %mselectListClass%\">'\n                +'<div class=\"block-content\"><div class=\"%mselectItemsWrapperClass%\">'\n                +'%items%'\n                +'</div></div>'\n                +'<footer class=\"block-footer\">'\n                +'<span class=\"action-add %mselectButtonAddClass%\">%addText%</span>'\n                +'</footer>'\n                +'<div class=\"%mselectInputContainerClass%\">'\n                +'<input type=\"text\" class=\"%mselectInputClass%\" title=\"%inputTitle%\"/>'\n                +'<span class=\"%mselectButtonCancelClass%\" title=\"%cancelText%\"></span>'\n                +'<span class=\"%mselectButtonSaveClass%\" title=\"Add\"></span>'\n                +'</div>'\n                +'</section>',\n            item : '<div  class=\"%mselectListItemClass% %mselectDisabledClass% %iseditable% %isremovable%\"><label><input type=\"checkbox\" class=\"%mselectCheckedClass%\" value=\"%value%\" %checked% %disabled% /><span>%label%</span></label>' +\n                '<span class=\"mselect-edit\" title=\"Edit\">Edit</span>' +\n                '<span class=\"mselect-delete\" title=\"Delete\">Delete</span> ' +\n                '</div>',\n            addText: 'Add new value',\n            cancelText: 'Cancel',\n            inputTitle: 'Enter new option',\n            size: 5,\n            keyCodes: {\n                Enter: 13,\n                Esc: 27\n            },\n            toggleAddButton: true,\n            // New option for callback\n            mselectInputSubmitCallback: null,\n            parse : function(v) { return v.split(/\\s*,\\s*/); }\n        }, opts||{});\n\n        return this.filter('select[multiple]:not(.' + o.mselectHiddenClass + ')').each(function() {\n            var select = $(this).addClass(o.mselectHiddenClass).hide(),\n                size = select.attr('size') > 0 ? select.attr('size') : o.size,\n                items = (function() {\n                    var str = '';\n\n                    select.children('option').each(function(i, option) {\n                        option = $(option);\n\n                        str += o.item\n                            .replace(/%value%/gi,  option.val())\n                            .replace(/%checked%/gi, option.attr('selected') ? 'checked' : '')\n                            .replace(/%mselectCheckedClass%/gi, option.attr('selected') ? ''+o.mselectCheckedClass+'' : '')\n                            .replace(/%disabled%/gi, option.attr('disabled') ? 'disabled' : '')\n                            .replace(/%mselectDisabledClass%/gi, option.attr('disabled') ? ''+o.mselectDisabledClass+'' : '')\n                            .replace(/%mselectListItemClass%/gi, o.mselectListItemClass)\n                            .replace(/%iseditable%/gi, option.attr('data-is-editable') ? ''+o.mselectItemNotEditableClass+'' : '')\n                            .replace(/%isremovable%/i, option.attr('data-is-removable') ? ''+o.mselectItemNotRemovableClass+'' : '')\n                            .replace(/%label%/gi,  option.html());\n                    });\n\n                    return str;\n                })(),\n                html = o.layout\n                    .replace(/%items%/gi, items)\n                    .replace(/%mselectListClass%/gi, o.mselectListClass)\n                    .replace(/%mselectButtonAddClass%/gi, o.mselectButtonAddClass)\n                    .replace(/%mselectButtonSaveClass%/gi, o.mselectButtonSaveClass)\n                    .replace(/%mselectButtonCancelClass%/gi, o.mselectButtonCancelClass)\n                    .replace(/%mselectItemsWrapperClass%/gi, o.mselectItemsWrapperClass)\n                    .replace(/%mselectInputContainerClass%/gi, o.mselectInputContainerClass)\n                    .replace(/%mselectInputClass%/gi, o.mselectInputClass)\n                    .replace(/%addText%/gi, o.addText)\n                    .replace(/%cancelText%/gi, o.cancelText)\n                    .replace(/%inputTitle%/gi, o.inputTitle),\n                widget = $(html)\n                    .insertAfter(this)\n                    .on('change.mselectCheck', '[type=checkbox]', function() {\n                        var checkbox = $(this),\n                            index = checkbox.closest('.' + o.mselectListItemClass + '').index();\n\n                        select.find('option').eq(index).attr('selected', !!checkbox.attr('checked'));\n                    }),\n                list = widget.find('.' + o.mselectItemsWrapperClass + ''),\n                buttonAdd = widget.find('.' + o.mselectButtonAddClass + '')\n                    .on('click.mselectAdd', function(e) {\n                        e.preventDefault();\n                        o.toggleAddButton && buttonAdd.hide();\n                        container.show();\n                        input.focus();\n                        if (input.parents(o.mselectListClass).length) {\n                            list.scrollTop(list.height());\n                        }\n                    }),\n                container = widget.find('.' + o.mselectInputContainerClass + ''),\n                input = container.find('[type=text].' + o.mselectInputClass + '')\n                    .on('blur.mselectReset', function() {\n                        reset();\n                    })\n                    .on('keydown.mselectAddNewOption', function(e) {\n                        var c = e.keyCode;\n\n                        if (c == o.keyCodes.Enter || c == o.keyCodes.Esc) {\n                            e.preventDefault();\n                            c == o.keyCodes.Enter ? append(input.val())  : reset();\n                        }\n                    }),\n                buttonSave = container.find('.' + o.mselectButtonSaveClass + '')\n                    .on('mousedown.mselectSave', function(e) {\n                        append(input.val());\n                    }),\n                buttonCancel = container.find('.' + o.mselectButtonCancelClass + '')\n                    .on('mousedown.mdelectCancel', function(e) {\n                        input.val('');\n                    }),\n                append = function(v) {\n                    // Add ability to define custom handler for adding new values\n                    if ($.isFunction(o.mselectInputSubmitCallback)) {\n                        o.mselectInputSubmitCallback(v, o);\n                        return;\n                    }\n                    // end of callback implementation\n                    $.each(typeof(o.parse) == 'function' ? o.parse(v) : [$.trim(v)], function(i, v) {\n                        var item;\n\n                        if (v && !select.children('[value=\"' + v + '\"]').length) {\n                            item = $(o.item.replace(/%value%|%label%/gi, v)\n                                .replace(/%mselectDisabledClass%|%iseditable%|%isremovable%/gi,'')\n                                .replace(/%mselectListItemClass%/gi,o.mselectListItemClass))\n                                .find('[type=checkbox]')\n                                .attr('checked', true)\n                                .addClass(o.mselectCheckedClass)\n                                .end();\n\n                            list.children('.' + o.mselectListItemClass + '').length\n                                ? list.children('.' + o.mselectListItemClass + ':last').after(item)\n                                : list.prepend(item);\n\n                            select.append('<option value=\"' + v + '\" selected=\"selected\">' + v + '</option>');\n                        }\n                    });\n\n                    reset();\n                    list.scrollTop(list.height());\n                },\n                reset = function() {\n                    var ch = select.children();\n\n                    input.val('');\n                    container.hide();\n                    buttonAdd.show();\n                    list[list.children().length ? 'show' : 'hide']();\n\n                    if (ch.length >= size && !list.hasClass(o.mselectItemsWrapperOverflowClass)) {\n                        list.height(list.children('.' + o.mselectListItemClass + ':first')\n                            .outerHeight(true) * size)\n                            .addClass(o.mselectItemsWrapperOverflowClass);\n                    }\n                };\n            reset();\n        }).end();\n    };\n});"}
}});
