

function get_balance(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/account",
       headers:{
            'action': 'get_balance',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {},
       success: function(msg) {
        console.log(msg);
        if(msg.result.error_code == 0){
            balance = parseInt(msg.result.response.balance);
            credit_limit = parseInt(msg.result.response.credit_limit);
            text = `<div class="row">
                        <div class="col-lg-6">Balance: </div>
                        <div class="col-lg-6" style="text-align:right;">`+msg.result.response.currency_code + getrupiah(balance)+`</div>
                    </div>`;
            document.getElementById("balance").innerHTML = text;
            text = `<div class="row">
                        <div class="col-lg-6">Credit Limit: </div>
                        <div class="col-lg-6" style="text-align:right;">`+msg.result.response.currency_code + getrupiah(credit_limit)+`</div>
                    </div>`;
            document.getElementById("credit_limit").innerHTML = text;
            //document.getElementById('balance').value = msg.result.response.balance + msg.result.response.credit_limit;
            console.log('success');
        }else{
            console.log('error');
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

function get_account(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/account",
       headers:{
            'action': 'get_account',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {},
       success: function(msg) {
       console.log(msg);
        if(msg.result.error_code == 0){
            //document.getElementById('balance').value = msg.result.response.balance + msg.result.response.credit_limit;
            console.log('success');
        }else{
            console.log('error');
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

function get_transactions(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/account",
       headers:{
            'action': 'get_transactions',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {},
       success: function(msg) {
       console.log(msg);
        if(msg.result.error_code == 0){
            console.log('success');
        }else{
            console.log('error');
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}