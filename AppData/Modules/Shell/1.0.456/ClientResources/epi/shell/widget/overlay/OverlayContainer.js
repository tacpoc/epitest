//>>built
define("epi/shell/widget/overlay/OverlayContainer",["dojo/_base/array","dojo/_base/declare","dojo/_base/Deferred","dojo/_base/lang","dojo/dom-style","dijit/_Container","dijit/_WidgetBase","dijit/_TemplatedMixin"],function(_1,_2,_3,_4,_5,_6,_7,_8){return _2("epi.shell.widget.overlay.OverlayContainer",[_7,_6,_8],{updateInterval:250,enabled:false,target:null,targetCoverEnabled:false,templateString:"<div data-dojo-attach-point=\"containerNode\" class=\"epi-overlay-container\"><div data-dojo-attach-point=\"targetCover\" class=\"epi-overlay-targetCover\"></div></div>",startup:function(){if(this._started){return;}this.inherited(arguments);this._toggleTargetCover(this.enabled);this.subscribe("/dnd/start",function(){this.set("targetCoverEnabled",true);});this.subscribe("/dnd/cancel",function(){this.set("targetCoverEnabled",false);});this.subscribe("/dnd/drop",function(){this.set("targetCoverEnabled",false);});this.subscribe("/external/overlay/update",this._updateOverlayItems);this.subscribe("/external/overlay/interval",function(_9){this.set("updateInterval",_9);});this.connect(this.target,"onLoading",this.disableChildren);this.connect(this.target,"onAfterResize",this._onAfterResizeHandler);},addChild:function(_a,_b){this.inherited(arguments);_a.set("parent",this);_a.resize();if(_a.onResize){_a.connect(_a,"onResize",_4.hitch(this,this._onContentChange));}},reset:function(){this.destroyDescendants();},_onAfterResizeHandler:function(_c){this.set("documentSize",_c);this._updateOverlayItems(true);},_onContentChange:function(){this.target.contentChange();},_updateOverlayItems:function(_d){if(!this.get("enabled")||this.isUpdating||!this.target.isInspectable()){return;}var _e=4;var _f=1;var _10;var _11;this.isUpdating=true;do{_10=false;_1.forEach(this.getChildren(),function(_12){var _13=_12.get("position");_11=_13.isChanged||_11;if(_13.isChanged){_10=_12.updatePosition(_13)||_10;}},this);}while(_10&&_f++<_e);this.isUpdating=false;if(_f>=2||!_d&&_11){this.target.contentChange();}},disableChildren:function(){_1.forEach(this.getChildren(),function(w){w.set("disabled",true);},this);},_toggleTargetCover:function(_14){var _15=this.get("documentSize");if(_14&&_15){_5.set(this.targetCover,{width:(_15.w)+"px",height:(_15.h)+"px"});}_5.set(this.targetCover,{display:_14?"block":"none"});},_togglePoller:function(_16){var _17=this;function _18(){_17._updateOverlayItems();if(_17.updateInterval>0){_17._pollerToken=setTimeout(_18,_17.updateInterval);}};if(_17._pollerToken){clearTimeout(_17._pollerToken);}if(_16){_18();}},_setUpdateIntervalAttr:function(_19){this._set("updateInterval",_19);this._togglePoller(_19>0);},_setEnabledAttr:function(_1a){this._set("enabled",_1a);if(_1a){this._updateOverlayItems();}_1.forEach(this.getChildren(),function(w){w.set("disabled",!_1a);},this);this._togglePoller(_1a);_5.set(this.domNode,{display:_1a?"":"none"});},_setTargetCoverEnabledAttr:function(_1b){if(this.targetCoverEnabled===_1b){return;}this._toggleTargetCover(_1b);this._set("targetCoverEnabled",_1b);}});});