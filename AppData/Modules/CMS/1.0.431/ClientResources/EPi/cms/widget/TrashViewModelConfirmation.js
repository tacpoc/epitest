//>>built
define("epi/cms/widget/TrashViewModelConfirmation",["dojo/_base/array","dojo/_base/declare","dojo/_base/Deferred","dojo/_base/lang","dojo/aspect","epi/dependency","epi/string","epi/shell/widget/dialog/Dialog","epi/shell/widget/dialog/Confirmation","epi/shell/widget/dialog/Alert","epi/cms/widget/ContentSelectorDialog","epi/cms/widget/FolderTreeStoreModel","epi/i18n!epi/cms/nls/episerver.cms.components.trash"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a,_b,_c,_d){return function(_e){var _f=_6.resolve("epi.cms.Application");var _10=function(_11,_12,_13){var _14=new _3();var _15=new _9({destroyOnHide:true,description:_7.toHTML(_12),title:_7.toHTML(_11),onAction:function(_16){_16?_14.resolve(_13):_14.cancel();}});_15.show();return _14;};var _17=function(_18,_19){var df=new _3(),_1a=_d.restore.dialog,_1b=_f.getTypeUIDescriptors(),_1c=_1b?_1b[_18.typeIdentifier]:null,_1d=_1c?_1c.containerTypeIdentifier:null,_1e=["epi.cms.block","epi.cms.folder"],_1f=_1.indexOf(_1e,_18.typeIdentifier)!==-1,_20={canSelectOwnerContent:false,showButtons:false,root:_19,showRoot:!_1f,typeIdentifiers:_1d||_18.typeIdentifier,model:_1f?new _c():null};if(_18.capabilities.isBlock){_4.mixin(_20,{expandSubRoot:true});}var _21=new _b(_20);var _22=new _8({title:_7.toHTML(_1a.title),description:_7.toHTML(_1a.description),confirmActionText:_7.toHTML(_d.restore.label),content:_21});_21.on("change",function(_23){_22.onActionPropertyChanged({name:"ok"},"disabled",!_23);});_22.on("execute",function(){df.resolve(_21.get("value"));});_22.on("onHide",function(){df.cancel();});_22.show();_21.onChange(null);return df;};_5.around(_e,"restore",function(_24){return function(_25,_26){var _27;return _3.when(_e.contentStore.query({id:_25.contentLink}),_4.hitch(this,function(_28){var _29=null;var _2a=null;if(!_28.isDeleted){_29=_7.toHTML(_d.restore.contentalreadyrestored);_2a=function(){_e.updateFeeder(_e.get("currentFeeder"));};}if(_28.statusCode===401){_29=_7.toHTML(_d.restore.userdonothavepermission);}if(_29){var _2b=new _a({description:_29,onAction:_2a});_2b.show();return false;}var _2c=_e.get("currentFeeder");if(_28.parentLink!=_2c.wasteBasketLink){return _3.when(_17(_28,_2c.restoreRoot),function(_2d){return _24.apply(_e,[_28,_2d]);},function(){return false;});}else{return _3.when(_e.getOldParent(_28.contentLink),function(_2e){var _2f=_2e?_2e.contentLink:null;if(_2f){_27=_10(_d.restore.label,_d.restore.confirmquestion,_2f);}else{_27=_17(_28,_2c.restoreRoot);}_3.when(_27,function(_30){return _24.apply(_e,[_28,_30]);},function(){return false;});});}}),_4.hitch(this,function(_31){var _32=new _a({description:_7.toHTML(_d.restore.contentdeletedpermanently),onAction:function(){_e.updateFeeder(_e.get("currentFeeder"));}});_32.show();return false;}));};});return _e;};});