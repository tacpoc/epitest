//>>built
define("epi/shell/widget/ToolbarDropDownButton",["dojo","dojo/dom-style","dijit/form/DropDownButton","dijit/Menu"],function(_1,_2,_3,_4){return _1.declare("epi.shell.widget.ToolbarDropDownButton",[_3],{constructor:function(){this.dropDown=new _4();},buildRendering:function(){this.inherited(arguments);this._setVisibility();},addChild:function(_5,_6){if(!_5.separator){_5.set("separator","dijit.MenuSeparator");}var _7=this.dropDown.addChild(_5,_6);this._setVisibility();return _7;},getChildren:function(){return this.dropDown.getChildren();},removeChild:function(_8){var _9=this.dropDown.removeChild(_8);this._setVisibility();return _9;},_setVisibility:function(){if(this.hasChildren()){_2.set(this.domNode,"display","");}else{_2.set(this.domNode,"display","none");}}});});