//>>built
define("epi/cms/contentediting/command/CreateDraft",["dojo/_base/declare","epi/cms/contentediting/command/_ContentCommandBase","epi/cms/contentediting/ContentActionSupport","epi/i18n!epi/cms/nls/episerver.cms.contentediting.toolbar.buttons"],function(_1,_2,_3,_4){return _1("epi.cms.contentediting.command.CreateDraft",[_2],{name:"createdraft",label:_4.createdraft.label,tooltip:_4.createdraft.title,iconClass:"epi-iconPage",contentActionSupport:null,postscript:function(){this.inherited(arguments);this.contentActionSupport=this.contentActionSupport||_3;},_execute:function(){this.model.createDraft();},_onModelChange:function(){this.inherited(arguments);var _5=this.model.contentData,_6=_5.status,_7=_3.versionStatus,_8=this.contentActionSupport.isActionAvailable(_5,_3.action.Create,_3.providerCapabilities.Edit),_9=_8&&(((_6==_7.Published||_6==_7.PreviouslyPublished)&&!_5.isCommonDraft)||_6==_7.DelayedPublish);this.set("canExecute",_9);this.set("isAvailable",_9);}});});