//>>built
define("epi/shell/widget/WidgetSwitcher",["dojo/_base/array","dojo/_base/declare","dojo/_base/Deferred","dojo/_base/lang","dojo/topic","dijit/layout/StackContainer","epi/dependency","epi/shell/_ContextMixin"],function(_1,_2,_3,_4,_5,_6,_7,_8){return _2("epi.shell.widget.WidgetSwitcher",[_6,_8],{viewComponentDictionary:null,componentConstructorArgs:null,supportedContextTypes:null,constructor:function(_9){this.viewComponentDictionary=_7.resolve("epi.shell.ViewComponentDictionary");},postMixInProperties:function(){this.inherited(arguments);if(this.supportedContextTypes){if(!_4.isArray(this.supportedContextTypes)){this.supportedContextTypes=[this.supportedContextTypes];}if(!_1.every(this.supportedContextTypes,function(_a){return typeof _a=="string";})){throw new Error("supportedContextTypes must be string, array of strings or null.");}}},postCreate:function(){this.inherited(arguments);_3.when(this.getCurrentContext(),_4.hitch(this,this.contextChanged));this.subscribe("/epi/shell/action/changeview",this.viewComponentChangeRequested);},contextChanged:function(_b,_c){if(!this._isContextTypeSupported(_b)){return;}var _d=_b.customViewType?_b.customViewType:_b.type,_e=this.viewComponentDictionary[_d];this._getObject(_e,null,_c);},viewComponentChangeRequested:function(_f,_10,_11){this._getObject(_f,_10,_11);},_isContextTypeSupported:function(_12){if(!_12){return false;}if(!this.supportedContextTypes){return true;}return _1.some(this.supportedContextTypes,function(_13){return _12.type===_13;});},_getObject:function(_14,_15,_16){if(!_14){return;}var _17=this.selectedChildWidget;var _18=_4.hitch(this,function(){if(this._isComponentInstanceOf(_17,_14)){this._updateView(_17,_16);this._onViewChanged(_14,_15,_16);}else{this._changeViewComponent(_14,_15,_16);}});if(_17&&_17.savePendingChanges){_3.when(_17.savePendingChanges(),_18);}else{_18();}},_changeViewComponent:function(_19,_1a,_1b){var _1c=this._getChildByType(_19);var _1d=this.selectedChildWidget;if(_1d){_1d.set("isActive",false);}if(_1c){_1c.set("isActive",true);this.selectChild(_1c);this._updateView(_1c,_1b);this._onViewChanged(_19,_1a,_1b);}else{require([_19],_4.hitch(this,function(_1e){var _1f=_4.mixin(_4.mixin({},this.componentConstructorArgs),_1a);_1c=new _1e(_1f);this.addChild(_1c);_1c.startup();this.selectChild(_1c);this._updateView(_1c,_1b);this._onViewChanged(_19,_1a,_1b);}));}},_updateView:function(_20,_21){if(_20&&typeof _20.updateView==="function"){_20.updateView(_21);}},_getChildByType:function(_22){var _23=_1.filter(this.getChildren(),function(_24,_25){return this._isComponentInstanceOf(_24,_22);},this);return _23.length?_23[0]:null;},_isComponentInstanceOf:function(_26,_27){return _26&&_26.declaredClass.replace(/\./g,"/")===_27;},_onViewChanged:function(_28,_29,_2a){_5.publish("/epi/shell/action/viewchanged",_28,_29,_2a);}});});