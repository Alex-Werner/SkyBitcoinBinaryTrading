var Market = Class.extend({
    init: function(){
        this.proxy = App.proxy;


    },
    request: function(method,params)
    {
        params = params || {};
        params.method=method;
        params.nonce = ++this.nonce;
        var dfd = $.Deferred();
        $.ajax({
            url: self.hostUrl+self.apiPath,
            cache: false,
            dataType: 'json',
            type: 'POST',
            data: params,
            success : function(res, textStatus, xhr) {
                if (res.success===0){
                    //processing wrong nonce number provided error. Trying again
                    if (res.error.indexOf("invalid nonce parameter")!=-1){
                        self.nonce = parseInt(res.error.match(/\d+/ig)[0]);
                        self.request(method, params).then(function(res){
                            dfd.resolve(res);
                        })
                    } else{
                        dfd.reject(res);
                    }
                } else{
                    dfd.resolve(res.return);
                }
            },
            error: function(xhr, textStatus){
                dfd.reject(xhr);
            }
        });
        return dfd.promise();
    }
});