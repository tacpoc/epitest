//>>built
define("epi/cms/widget/_HasClearButton",["epi","dojo","dijit"],function(_1,_2,_3){return _2.declare("epi.cms.widget._HasClearButton",null,{postCreate:function(){this.inherited(arguments);var _4=this.clearButton.onClick?"onClick":"onclick";_2.connect(this.clearButton,_4,_2.hitch(this,this.clearValue));},clearValue:function(){if(this.readOnly){return;}var _5=this.getEmptyValue();this.set("value",_5);},getEmptyValue:function(){return null;}});});