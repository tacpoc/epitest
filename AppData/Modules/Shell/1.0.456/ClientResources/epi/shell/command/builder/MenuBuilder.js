//>>built
define("epi/shell/command/builder/MenuBuilder",["dojo/_base/array","dojo/_base/declare","dojo/_base/lang","dojo/on","dijit/Menu","dijit/MenuItem","dijit/CheckedMenuItem","dijit/PopupMenuItem","epi/shell/command/builder/_Builder","epi/shell/command/_CommandModelBindingMixin"],function(_1,_2,_3,on,_4,_5,_6,_7,_8,_9){return _2([_8],{_menuItemClass:_2([_5,_9]),_checkedMenuItemClass:_2([_6,_9]),_popupMenuItemClass:_2([_7,_9]),_create:function(_a){var _b=typeof _a.active=="boolean",_c=_3.isArray(_a.options),_d=_b?this._checkedMenuItemClass:_c?this._popupMenuItemClass:this._menuItemClass,_e=_3.mixin({model:_a},this.itemSettings);var _f=new _d(_e);if(_c){this._createOptionMenu(_a,_f);}return _f;},_createOptionMenu:function(_10,_11){_11.popup=new _4();_1.forEach(_10.options,function(_12){var _13=new _6({label:_12.label,checked:_10.selected===_12.value});on(_13,"click",function(e){_10.set("selected",_12.value);});_10.watch("selected",function(_14,_15,_16){if(_16!==_12.value){_13.set("checked",false);}});_11.popup.addChild(_13);});}});});