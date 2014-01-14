//>>built
define("epi/cms/contentediting/InlineEditorWrapper",["epi","dojo","dojo/_base/array","dojo/_base/declare","dojo/_base/lang","dojo/dom-style","dijit","epi/cms/contentediting/_EditorWrapperBase"],function(_1,_2,_3,_4,_5,_6,_7,_8){return _4("epi.cms.contentediting.InlineEditorWrapper",[_8],{width:"100%",_createEditor:function(){this._createdEditor=true;var _9=this._computeStyling();_2["require"](this.editorWidgetType);var _a=_2.getObject(this.editorWidgetType);var _b=_5.delegate(this.editorParams,{style:_9});this.editorWidget=new _a(_b);this.editorWidget.set("value",this.value);_2.place(this.editorWidget.domNode,this.overlayItem.domNode);var ew=this.editorWidget;this.connect(ew,"onClick",function(e){_2.stopEvent(e);});if(this.autoSave){this.connect(ew,"onBlur","_onBlur");this.connect(ew,"onChange","_onEditorChange");this.connect(ew,"onKeyPress","_onEditorKeyPress");}else{if("intermediateChanges" in ew){ew.set("intermediateChanges",true);this.connect(ew,"onChange","_onIntermediateChange");}}},_computeStyling:function(){var _c=this.blockDisplayNode,_d=_6.getComputedStyle(this.blockDisplayNode),_e="line-height:"+_d.lineHeight+";",_f=_6.getComputedStyle(this.domNode);_3.forEach(["Weight","Family","Size","Style"],function(_10){var _11=_d["font"+_10],_12=_f["font"+_10];if(_12!=_11){_e+="font-"+_10+":"+_d["font"+_10]+";";}},this);var _13=this.width;if(_13=="100%"){_e+="width:100%;";}else{_e+="width:"+(_13+(Number(_13)==_13?"px":""))+";";}_e+="position: absolute; left: -2px; top: -2px;";return _e;},_onEditorChange:function(val){if(this.hasBeenEdited()){this._onChange(val);}},startEdit:function(){if(this.editorWidget){_2.style(this.editorWidget.domNode,{visibility:"visible"});}else{this._createEditor();}this._blockDisplayNodeOpacity=_6.get(this.blockDisplayNode,"opacity");_6.set(this.blockDisplayNode,"opacity","0.5");this.inherited(arguments);if(_2.isIE){_7.focus(_7.getFocus());}setTimeout(_2.hitch(this,function(){this.focus();}),0);},_onIntermediateChange:function(val){},_onBlur:function(){this.tryToStopEditing(true);},_removeEditingFeatures:function(){_6.set(this.blockDisplayNode,"opacity",this._blockDisplayNodeOpacity);_2.style(this.editorWidget.domNode,{visibility:"hidden"});},_onTryToStopWithInvalidValue:function(){this.inherited(arguments);this.focus();}});});