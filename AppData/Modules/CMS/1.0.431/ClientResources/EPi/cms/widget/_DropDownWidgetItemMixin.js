//>>built
define("epi/cms/widget/_DropDownWidgetItemMixin",["dojo/dom-construct"],function(_1){return dojo.declare("epi.cms.widget._DropDownWidgetItemMixin",null,{buildRendering:function(){this.inherited(arguments);this.domNode=this._wrapItem(this);},_wrapItem:function(_2){var tr=_1.create("tr");var td=_1.create("th",null,tr);_2.placeAt(td,"first");return tr;}});});