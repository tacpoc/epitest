//>>built
define("epi/patch/dijit/form/NumberSpinner",["dojo/_base/lang","dijit/form/NumberSpinner"],function(_1,_2){_1.mixin(_2.prototype,{adjust:function(_3,_4){var tc=this.constraints,v=isNaN(_3),_5=!isNaN(tc.max),_6=!isNaN(tc.min);if(v&&_4!=0){_3=_4;}var _7=_3+_4;if(v||isNaN(_7)){return _3;}if(_5&&(_7>tc.max)){_7=tc.max;}if(_6&&(_7<tc.min)){_7=tc.min;}return _7;}});_2.prototype.adjust.nom="adjust";});