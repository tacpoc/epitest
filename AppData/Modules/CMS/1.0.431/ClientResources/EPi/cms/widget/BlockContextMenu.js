//>>built
require({cache:{"url:epi/cms/widget/templates/BlockContextMenu.html":"<div data-dojo-type=\"dijit.Menu\" class=\"epi-blockContextMenu\">\r\n    <!--\r\n    <div class=\"epi-publishInfoPane\">\r\n        <div><strong data-dojo-attach-point=\"blockName\"></strong></div>\r\n        <div data-dojo-attach-point=\"referenceText\"></div>\r\n        <div data-dojo-attach-point=\"publishInfoText\"></div>\r\n    </div>\r\n    -->\r\n\r\n    <div data-dojo-type=\"dijit.MenuItem\" data-dojo-attach-point=\"editMenuItem\" data-dojo-attach-event=\"onClick: _onEdit\" iconClass=\"epi-iconPen\">${actionResources.edit}</div>\r\n    <div data-dojo-type=\"dijit.MenuSeparator\"></div>\r\n    <div data-dojo-type=\"dijit.MenuItem\" data-dojo-attach-point=\"moveUpMenuItem\" data-dojo-attach-event=\"onClick: _onMoveUp\" iconClass=\"epi-iconUp\">${actionResources.moveup}</div>\r\n    <div data-dojo-type=\"dijit.MenuItem\" data-dojo-attach-point=\"moveDownMenuItem\" data-dojo-attach-event=\"onClick: _onMoveDown\" iconClass=\"epi-iconDown\">${actionResources.movedown}</div>\r\n    <div data-dojo-type=\"dijit.MenuSeparator\"></div>\r\n    <div data-dojo-type=\"dijit.MenuItem\" data-dojo-attach-point=\"removeMenuItem\" data-dojo-attach-event=\"onClick: _onRemove\" iconClass=\"epi-iconTrash\">${actionResources.remove}</div>\r\n</div>"}});define("epi/cms/widget/BlockContextMenu",["dojo","dojo/i18n","dojo/_base/lang","dojo/date/locale","dojo/string","dojo/html","dojox/html/entities","dijit","dijit/Menu","dijit/MenuItem","dijit/MenuSeparator","dijit/_WidgetsInTemplateMixin","epi","epi/shell/widget/_ModelBindingMixin","epi/cms/contentediting/command/BlockEditing","dojo/text!./templates/BlockContextMenu.html","epi/i18n!epi/cms/nls/episerver.cms.widget.blockcontextmenu"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a,_b,_c,_d,_e,_f,_10,res){return _1.declare("epi.cms.widget.BlockContextMenu",[_9,_c,_e],{templateString:_10,res:res,actionResources:_d.resources.action,commands:null,model:null,onEdit:function(){},onRemove:function(){},onMoveDown:function(){},onMoveUp:function(){},postMixInProperties:function(){this.inherited(arguments);this.commands=this.commands||new _f();this.commands.remove.watch("canExecute",_1.hitch(this,function(){if(this.removeMenuItem){this.removeMenuItem.set("disabled",!this.commands.remove.canExecute);}}));this.commands.edit.watch("canExecute",_1.hitch(this,function(){if(this.editMenuItem){this.editMenuItem.set("disabled",!this.commands.edit.canExecute);}}));this.commands.moveUp.watch("canExecute",_1.hitch(this,function(){if(this.moveUpMenuItem){this.moveUpMenuItem.set("disabled",!this.commands.moveUp.canExecute);}}));this.commands.moveDown.watch("canExecute",_1.hitch(this,function(){if(this.moveDownMenuItem){this.moveDownMenuItem.set("disabled",!this.commands.moveDown.canExecute);}}));},postCreate:function(){this.inherited(arguments);},_setModelAttr:function(_11){this.commands.set("model",_11);this.inherited(arguments);},_onEdit:function(){this.commands.edit.execute();this.onEdit();},_onRemove:function(){this.commands.remove.execute();this.onRemove();},_onMoveUp:function(){this.commands.moveUp.execute();this.onMoveUp();},_onMoveDown:function(){this.commands.moveDown.execute();this.onMoveDown();}});});