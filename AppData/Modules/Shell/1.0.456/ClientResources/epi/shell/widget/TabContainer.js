//>>built
define("epi/shell/widget/TabContainer",["dojo/_base/Deferred","dojo/_base/lang","dojo/aspect","dojo/dom-class","dijit/layout/ContentPane","dijit/layout/TabContainer","dojox/html/entities","epi/dependency","epi/shell/widget/layout/ComponentContainer","epi/shell/widget/dialog/Confirmation","epi/shell/widget/TabController","epi/shell/widget/dialog/Alert","epi/i18n!epi/shell/ui/nls/EPiServer.Shell.UI.Resources.TabContainer","epi/shell/widget/_ActionConsumerWidget"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a,_b,_c,_d,_e){return dojo.declare("epi.shell.widget.TabContainer",[_6,_e],{controllerWidget:"epi.shell.widget.TabController",_selectedPage:null,_componentsController:null,res:_d,confirmationBeforeRemoval:true,startup:function(){if(this._started){return;}this.inherited(arguments);this.connect(this.tablist,"onLayoutChanged",this._changeLayout);this.connect(this.tablist,"onTabTitleChanged",this._changeName);this.connect(this.tablist,"onAddNewTab",this._createTab);this._componentsController=_8.resolve("epi.shell.controller.Components");if(this.getChildren().length<=0){this._createTab();}},postCreate:function(){this.inherited(arguments);_4.add(this.domNode,"epi-mainApplicationArea");},_makeController:function(){var _f=this.inherited(arguments);this.connect(_f,"onSelectChild",this._pageSelected);var _10=[{label:this.res.addgadget,onClick:_2.hitch(this,this._showComponentDialog)},{label:this.res.createtab,onClick:_2.hitch(this,this._createTab)},{label:this.res.rearrangegadget,onChange:_2.hitch(this,this._rearrangeGadgets),type:"checkedmenuitem",checked:false,rearrangeGadgets:function(_11){this.set("checked",_11);}}];dojo.forEach(_10,_f.addAddMenuItem,_f);return _f;},_rearrangeGadgets:function(_12){if(this._selectedPage){this._selectedPage.changeLockButtonState(_12);}},_showComponentDialog:function(){if(this._selectedPage){this._selectedPage.showComponentSelector();}},_componentSelected:function(){var _13=this._selectedPage;_13.addComponent.apply(_13,arguments);},_pageSelected:function(_14){this._selectedPage=_14;},_createTab:function(){var _15=this._componentsController.getComponentDefinition(this.id);this._componentsController.getEmptyComponentDefinition("EPiServer.Shell.ViewComposition.Containers.ComponentContainer",_2.hitch(this,function(_16){var _17=_16[0];_17.plugInArea=_15.plugInArea;_17.settings.title=this.res.newtabname;_17.settings.numberOfColumns=2;_17.settings.containerUnlocked=true;_17.settings.closable=true;_17.settings.componentCategory=_15.components[0].settings.componentCategory;this._componentsController.addComponent(this,_17,_2.hitch(this,function(_18){var _19=this.getChildren();this.selectChild(_19[_19.length-1]);}));}));},_changeName:function(_1a,_1b){if(this._isEmpty(_1b)){this._showMessageDialog(this.res.tabnamecannotbeemptymessage).then(function(_1c){if(_1c){_1a.controlButton.tabName.innerHTML=_1a.controlButton.tabCurrentName;_1a.controlButton._setTabTitleEditable(true);}});}else{var _1d=String(_1a.title);var _1e=this._componentsController.getComponentDefinition(_1a.id);_1a.title=_1b;_1a.tabCurrentName=_1b;if(_1e!=null){_1e.settings.title=_1b;this._componentsController.saveComponent(this,_1e,function(){},_2.hitch(this,function(){this._showMessageDialog(this.res.tabnamecouldnotbesaved).then(function(_1f){if(_1f){_1a.set("title",_1d);_1a.set("tabCurrentName",_1d);_1a.controlButton.revertTabTitleChanges(true,_1d,_1b);}});}));}else{}}},_changeLayout:function(_20,evt){var _21=evt.currentTarget.title.substr(0,1);if(dojo.isFunction(_20.setColumns)){_20.setColumns(_21);}var _22=this._componentsController.getComponentDefinition(_20.id);if(_22!=null){_22.settings.numberOfColumns=_21;this._componentsController.saveComponent(this,_22);}else{}},closeChild:function(_23){if(this.getChildren().length==1){return;}if(!this.confirmationBeforeRemoval){this.inherited(arguments);this._removeTab(_23);}else{return this._showRemovalConfirmationDialog(_2.hitch(this,function(_24){if(_24){_6.prototype.closeChild.apply(this,[_23]);this._removeTab(_23);}}));}},_removeTab:function(_25){var _26=this._componentsController.getComponentDefinition(_25.id);this._componentsController.removeComponent(_26.id);var _27=this.getChildren().length;if(_27==1){for(var _28 in this.tablist.pane2button){this.tablist.pane2button[_28].closeTabMenuItem.set("disabled",true);}}},_showRemovalConfirmationDialog:function(_29){var _2a=new _a({description:this.res.removetabquestion,title:epi.resources.header.episerver,onAction:_29});_2a.show();},_showMessageDialog:function(_2b){var _2c=new _1();var _2d=new _c({description:_2b});_2d.show();_3.after(_2d,"destroy",function(){_2c.resolve(true);});return _2c;},_isEmpty:function(_2e){return (dojo.trim(_2e)===""?true:false);}});});