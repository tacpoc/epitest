//>>built
define("epi/shell/widget/Tree",["dojo","dojo/_base/declare","dojo/_base/lang","dojo/_base/array","dijit/Tree"],function(_1,_2,_3,_4,_5){return _2("epi.shell.widget.Tree",_5,{postCreate:function(){this.inherited(arguments);this.connect(this.model,"onItemChildrenReload","_onChildrenReload");},_onChildrenReload:function(_6){var _7=this.model,_8=_7.getIdentity(_6),_9=this._itemNodesMap[_8];if(_9){if(_4.some(_9,function(_a){return _a.state==="LOADED";})){this.model.getChildren(_6,_3.hitch(this,function(_b){_4.forEach(_9,function(_c){_c.setChildItems(_b);});_4.forEach(_b,function(_d){this.model.onChange(_d);this._onChildrenReload(_d);},this);}));}else{_4.forEach(_9,function(_e){if(this.model.mayHaveChildren(_e.item)){_e.makeExpandable();}},this);}}}});});