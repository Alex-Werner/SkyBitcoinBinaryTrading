var Crypto = Class.extend({
    init:function(){

    },
    getNonce:function(){
        return new Date().getTime();
    }
})