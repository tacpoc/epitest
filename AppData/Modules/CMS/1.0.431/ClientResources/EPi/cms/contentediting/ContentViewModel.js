//>>built
define("epi/cms/contentediting/ContentViewModel",["dojo","dojo/_base/array","dojo/_base/connect","dojo/_base/declare","dojo/_base/Deferred","dojo/_base/lang","dojo/Stateful","epi/dependency","epi/datetime","epi/string","epi/shell/UndoManager","epi/shell/widget/dialog/Alert","epi/cms/contentediting/ContentActionSupport","epi/cms/contentediting/ContentEditingValidator","epi/cms/contentediting/ContentModel","epi/cms/contentediting/ContentModelServerSync","epi/cms/command/ReloadContent","epi/i18n!epi/cms/nls/episerver.cms.contentediting","epi/i18n!epi/cms/nls/episerver.cms.components.versions"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a,_b,_c,_d,_e,_f,_10,_11,res,_12){return _4("epi.cms.contentediting.ContentViewModel",[_7],{contentModel:null,metadata:null,syncService:null,editorFactory:null,syncInterval:10000,validator:null,contentDataStore:null,profileHandler:null,languageContext:null,_converterRegistry:null,_contentVersionStore:null,_syncRetryTimeout:60000,_undoManager:null,_undoManagerConnects:null,_syncServiceConnects:null,contextTypeName:"",contentLink:null,contentData:null,viewName:null,isCreatingNewVersion:false,hasUndoSteps:false,hasRedoSteps:false,isValid:true,hasPendingChanges:false,lastSaved:null,isSaved:true,isSaving:false,isOnline:true,hasErrors:false,isChangingContentStatus:false,constructor:function(){this._undoManagerConnects=[];this._syncServiceConnects=[];},postscript:function(){this.inherited(arguments);this.profileHandler=this.profileHandler||_8.resolve("epi.shell.Profile");this.metadataManager=this.metadataManager||_8.resolve("epi.shell.MetadataManager");var _13=_8.resolve("epi.storeregistry");this.contentDataStore=this.contentDataStore||_13.get("epi.cms.contentdata");this._contentVersionStore=_13.get("epi.cms.contentversion");this._converterRegistry=this._converterRegistry||_8.resolve("epi.objectconverterregistry");this._undoManager=new _b();this.validator=new _e({contextId:this.contentLink,contextTypeName:this.contextTypeName});this._createSyncService();var _14=_6.hitch(this,function(_15,_16,_17){this.set(_15,_17);});this.validator.watch("isValid",_14);this.validator.watch("hasErrors",_14);this._undoManager.watch("hasUndoSteps",_14);this._undoManager.watch("hasRedoSteps",_14);},setActiveProperty:function(_18){this.onSetActiveProperty(_18);},suspend:function(){this.onContentChange();this.onSuspend();},onSuspend:function(){},destroy:function(){this.clear();this.disconnectLocal(this._undoManagerConnects);this.disconnectLocal(this._syncServiceConnects);this.inherited(arguments);},clear:function(){this._undoManager.clear();},setContentData:function(_19,ctx){this.contentLink=_19.contentLink;this.contentData=_19;this.syncService.contentLink=this.contentLink;this.languageContext=ctx.languageContext;},_createSyncService:function(){this.disconnectLocal(this._syncServiceConnects);delete this.syncService;var _1a=new _10({contentLink:this.contentLink,contentDataStore:this.contentDataStore});_1a.watch("hasPendingChanges",_6.hitch(this,function(_1b,old,_1c){this.set("hasPendingChanges",_1c);}));this.syncService=_1a;},connectLocal:function(_1d,obj,evt,_1e){if(!_6.isArray(_1d)){throw Error("First argument to connectLocal must be an Array");}return _1d.push(_3.connect(obj,evt,this,_1e));},disconnectLocal:function(_1f){if(_6.isArray(_1f)){var _20;while(_20=_1f.pop()){_3.disconnect(_20);}}},resetNotifications:function(){this.validator.clearErrorsBySource(this.validator.validationSource.client);},getProperty:function(_21){return this.contentModel.get(_21);},setProperty:function(_22,_23){this._setModelProperty(_22,_23);},publishProperty:function(_24,_25){this.syncService.publishProperty(_24,_25).then(_6.hitch(this,function(){this.contentModel.set(_24,_25);_5.when(this.contentDataStore.query({id:this.contentData.contentLink}),_6.hitch(this,function(_26){this.set("contentData",_26);}));}));},commitProperty:function(_27,_28,_29){var _2a=(_29!==undefined)?_29:this.contentModel.get(_27);this._commitProperty(_27,_28,_2a);},commitProperties:function(_2b){var _2c=_2.map(_2b,function(_2d){var _2e=(_2d.oldValue!==undefined)?_2d.oldValue:this.contentModel.get(_2d.propertyName);return {propertyName:_2d.propertyName,value:_2d.value,oldValue:_2e};},this);this._commitProperties(_2c);},_commitProperties:function(_2f){_2.forEach(_2f,function(_30){this._setModelProperty(_30.propertyName,_30.value);},this);var _31=_2.map(_2f,function(_32){return {propertyName:_32.propertyName,value:_32.oldValue,oldValue:_32.value};});this._undoManager.createStep(this,this._commitProperties,[_31],"Edit properties");},_setModelProperty:function(_33,_34){this.set("isSaved",false);this.syncService.scheduleForSync(_33,_34);this.contentModel.set(_33,_34);this.onPropertyEdited(_33,_34);},onPropertyEdited:function(_35,_36){},_commitProperty:function(_37,_38,_39){this._setModelProperty(_37,_38);this._undoManager.createStep(this,this._commitProperty,[_37,_39,_38],"Edit "+_37);},_onSynchronizeSuccess:function(_3a,_3b,_3c){_2.forEach(_3b,_6.hitch(this,function(_3d){this.validator.clearPropertyErrors(_3d.name,this.validator.validationSource.server);this._patchContentDataStore(_3a,_3d.name,null,_3d.value);}));this.validator.setGlobalErrors(_3c.validationErrors,this.validator.validationSource.server);},_onSynchronizeFailure:function(_3e,_3f,_40,_41){_2.forEach(_3f,function(_42){if("successfull" in _42){if(_42.successfull){this.validator.clearPropertyErrors(_42.name,this.validator.validationSource.server);}else{this.validator.setPropertyErrors(_42.name,[{"errorMessage":_42.validationErrors,severity:this.validator.severity.error}],this.validator.validationSource.server);}}else{}},this);if(_41){if(_41.validationErrors){this.validator.setGlobalErrors(_41.validationErrors,this.validator.validationSource.server);}else{this.validator.clearGlobalErrors(this.validator.validationSource.server);}}},_contentLinkChanged:function(_43,_44){this.contentLink=_44;this.syncService.contentLink=_44;this.validator.setContextId(_44);var _45={uri:"epi.cms.contentdata:///"+_44};_3.publish("/epi/shell/context/request",[_45,{sender:this,contentLinkSyncChange:true,trigger:"internal"}]);},ensureWritableVersion:function(){var _46=this.contentLink;if(!this.contentData.isNewVersionRequired){return _46;}this.isCreatingNewVersion=true;var def=new _5();_5.when(this._contentVersionStore.put({originalContentLink:_46}),_6.hitch(this,function(_47){this._contentLinkChanged(_46,_47);this.isCreatingNewVersion=false;def.resolve(_47);}),_6.hitch(this,function(){this.isCreatingNewVersion=false;def.reject();}));return def;},validate:function(){var def;if(!this.validator){def=new _5();def.resolve();}else{def=this.validator.validate();}return def;},revertToPublished:function(){var _48=this.contentLink;_5.when(this._contentVersionStore.remove(_48),_6.hitch(this,function(){this._loadPublishedVersion(_48);}),_6.hitch(this,function(_49){if(_49.status===403){this.dialog=new _c({description:_12.deleteversion.cannotdeletepublished,onAction:_6.hitch(this,function(){var _4a=new _11({forceReloadCurrentContent:true});_4a.execute();})});this.dialog.show();}if(_49.status===404){this.dialog=new _c({description:res.versionstatus.versionnotfound,onAction:_6.hitch(this,function(){this._loadPublishedVersion(_48);})});this.dialog.show();}}));},_loadPublishedVersion:function(_4b){_5.when(this._contentVersionStore.query({contentLink:_4b,language:this.languageContext?this.languageContext.language:"",query:"getpublishedversion"}),_6.hitch(this,function(_4c){if(_4c!==null){var _4d={uri:"epi.cms.contentdata:///"+_4c.contentLink,context:this};_3.publish("/epi/shell/context/request",[_4d,{sender:this,trigger:"internal"}]);}}));},createDraft:function(){var _4e=this.contentLink;var _4f=this.contentData.status;var _50=_d.versionStatus;var _51=_4f===_50.DelayedPublish;return _5.when(this._contentVersionStore.put({originalContentLink:_4e,isCommonDraft:_51}),_6.hitch(this,function(_52){var _53={uri:"epi.cms.contentdata:///"+_52,context:this};_3.publish("/epi/shell/context/request",[_53,{sender:this}]);}));},editCommonDraft:function(){var _54=this.contentLink;return _5.when(this._contentVersionStore.query({contentLink:_54,query:"getcommondraftversion"}),_6.hitch(this,function(_55){var _56={uri:"epi.cms.contentdata:///"+_55.contentLink,context:this};_3.publish("/epi/shell/context/request",[_56,{sender:this}]);}));},_populateContentModel:function(_57,_58){var _59={},_5a,_5b;for(var _5c in _57){var _5d=_58.getPropertyMetadata(_5c);var _5e=_57[_5c];if(_5d.hasSubProperties()){_59[_5c]=this._populateContentModel(_5e,_5d);}else{_59[_5c]=_5e;_5a=_5d.customEditorSettings.converter;if(_5a){_5b=this._converterRegistry.getConverter(_5a,"runtimeType");if(_5b){_59[_5c]=_5b.convert(_5a,"runtimeType",_5e);}}}}return _59;},getPropertyMetaData:function(_5f){if(this.metadata){return this.metadata.getPropertyMetadata(_5f);}else{var _60=[],def=new _5();this.connectLocal(_60,this,"onMetadataResolve",function(_61){if(_61){def.resolve(this.metadata.getPropertyMetadata(_5f));}else{def.reject();}this.disconnectLocal(_60);});return def;}},getContentModelAndMetadata:function(){var def=new _5();_5.when(this.metadataManager.getMetadataForType("EPiServer.Core.ContentData",{contentLink:this.contentLink}),_6.hitch(this,function(_62){this.metadata=_62;this.set("contentModel",new _f({initialData:this._populateContentModel(this.contentData.properties,_62)}));this.onMetadataResolve(true);def.resolve();}),function(){this.onMetadataResolve(false);def.reject();});return def;},onMetadataResolve:function(_63){},getMetadataThenUpdateModel:function(){var def=new _5();_5.when(this.metadataManager.getMetadataForType("EPiServer.Core.ContentData",{contentLink:this.contentLink}),_6.hitch(this,function(_64){this.metadata=_64;this.set("contentModel",_6.mixin(this.contentModel,new _f({initialData:this._populateContentModel(this.contentData.properties,_64)})));def.resolve();}),function(){def.reject();});return def;},save:function(){if(!this.isOnline){var def=new _5();def.resolve(true);return def;}return this._save();},_save:function(){var def=new _5(),_65=_6.hitch(this,function(_66){if(_66){if(_66.successful){this._onSynchronizeSuccess(_66.contentLink,_66.properties,_66);}else{this._onSynchronizeFailure(_66.contentLink,_66.properties,_66.validationErrors,_66);}if(_66&&_66.hasContentLinkChanged){this._contentLinkChanged(_66.contentLink,_66.oldContentLink);}}this.set("isOnline",true);this.set("lastSaved",new Date());this.set("isSaving",false);this.set("isSaved",true);def.resolve(true);}),_67=_6.hitch(this,function(_68){this.set("hasErrors",true);this.set("isSaving",false);this.set("isSaved",false);this.set("isOnline",false);if(_68){_2.forEach(_68.properties,_6.hitch(this,function(_69){if(!this.syncService.pendingSync(_69.name)){this.syncService.scheduleForSync(_69.name,_69.value);}}));}setTimeout(_6.hitch(this,function(){this.set("isOnline",true);this._save();}),this._syncRetryTimeout);def.reject(_68);});if(this.isCreatingNewVersion||!this.hasPendingChanges){_65();}else{_5.when(this.ensureWritableVersion(),_6.hitch(this,function(){this.set("isSaving",true);_5.when(this.syncService.save(),_65,_67);}),_67);}return def;},undo:function(){this._undoManager.undo();},redo:function(){this._undoManager.redo();},_patchContentDataStore:function(_6a,_6b,_6c,_6d){var _6e={};_6.setObject(_6b,_6d,_6e);return this.contentDataStore.patchCache({contentLink:_6a,changedBy:this.profileHandler.userName,saved:_9.serialize(new Date()),properties:_6e});},changeContentStatus:function(_6f){var _70=this.contentLink;var def=new _5();this.set("isChangingContentStatus",true);var _71=_6.hitch(this,function(_72){var _73=_72&&_72.success;var _74=this.validator;if(_73){if(_6f==_d.action.Publish||_6f==_d.action.CheckIn||_6f==(_d.saveAction.CheckIn|_d.saveAction.DelayedPublish|_d.saveAction.ForceCurrentVersion)){this.set("lastSaved",null);}if(_74){_74.clearGlobalErrors(_74.validationSource.server);}def.resolve({id:_72.id,oldId:_70});}else{if(_72&&_72.validationErrors){if(_74){_74.setGlobalErrors(_72.validationErrors,_74.validationSource.server);_74.validate();}def.reject(null);}else{def.reject((_72&&_72.errorMessage)?_72.errorMessage:res.publish.error);}}this.set("isChangingContentStatus",false);});var _75=_6.hitch(this,function(_76){_3.publish("/epi/cms/action/showerror");def.reject((_76&&_76.errorMessage)?_76.errorMessage:res.publish.error);this.set("isChangingContentStatus",false);});this.onContentChange();_5.when(this.validate(),_6.hitch(this,function(){_5.when(this.save(),_6.hitch(this,function(){_5.when(this.contentDataStore.executeMethod("ChangeStatus",_70,{action:_6f}),_71,_75);}),_75);}),_75);return def;},onContentChange:function(){},hasEditAccess:function(){return _d.hasAccess(this.contentData.accessMask,_d.accessLevel.Edit);},hasAccess:function(_77){var _78=!this.languageContext||!this.languageContext.isTranslationNeeded;return _78&&_d.isActionAvailable(this.contentData,_77||_d.action.Edit,_d.providerCapabilities.Edit);},canChangeContent:function(_79){return this.hasAccess(_79);}});});