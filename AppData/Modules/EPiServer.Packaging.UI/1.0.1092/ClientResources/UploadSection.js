//>>built
require({cache:{"url:epi/packaging/templates/Section.htm":"<div style=\"overflow:auto;\">\r\n    <div data-dojo-attach-point=\"_headerPlaceholder\"></div>\r\n    <div class=\"epi-newContentContainerInverted\">\r\n        <div data-dojo-attach-point=\"_contentPlaceholder\"></div>\r\n    </div>\r\n</div>"}});define("epi/packaging/UploadSection",["dojo","dijit","dijit/layout/_LayoutWidget","dijit/_TemplatedMixin","epi/packaging/SectionHeader","epi/packaging/PackageUpload","dojo/text!./templates/Section.htm","epi/i18n!epi/packaging/nls/EPiServer.Packaging.UI.PackageUpload"],function(_1,_2,_3,_4,_5,_6,_7,_8){return _1.declare("epi.packaging.UploadSection",[_3,_4],{res:_8,templateString:_7,antiForgeryData:null,_headerWidget:null,_uploadWidget:null,_packageUpload:null,startup:function(){if(this._started){return;}this._headerWidget=new _5({webHelpAlias:"uploadaddon",antiForgeryData:this.antiForgeryData,sectionTitle:this.res.uploadtitle},this._headerPlaceholder);this._headerWidget.startup();this._packageUpload=new _6({antiForgeryData:this.antiForgeryData},this._contentPlaceholder);this._packageUpload.startup();this.connect(this._packageUpload,"onSiteRestartRequired",function(){this._headerWidget.updateView();});this.connect(this._packageUpload,"onError",function(_9){this._headerWidget.addErrorMessages(_9);});this.connect(this._packageUpload,"onSuccess",function(_a){this._headerWidget.addSuccessMessages(_a);});this.connect(this._packageUpload,"onModuleActionPerformed",function(){this._headerWidget.clearErrorMessages();this._headerWidget.clearSuccessMessages();});this.inherited(arguments);},updateView:function(){this._packageUpload.updateView();this._headerWidget.clearErrorMessages();this._headerWidget.clearSuccessMessages();this._headerWidget.updateView();}});});