offset_transaction = 0;


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
    limit_transaction = 20;
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

function get_transactions_notification(){
    limit_transaction = 5;
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/account",
       headers:{
            'action': 'get_transactions',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {
            'offset': offset_transaction,
            'limit': limit_transaction,
            'provider_type': JSON.stringify([])
       },
       success: function(msg) {
       console.log(msg);
        if(msg.result.error_code == 0){
            text = '';
            for(i in msg.result.response){
                number = parseInt(i)+1;
                if(msg.result.response[i].provider_type == 'airline')
                    text+=`<form action="airline/booking" method="post" id="notification_`+number+`" onclick="set_csrf_notification(`+number+`)">`
                text+=`<li> `+number+` `+msg.result.response[i].order_number+` </li>`;
                text+=`<li>   `+msg.result.response[i].pnr+` </li>`;
                text+=`<input type="hidden" id="order_number" name="order_number" value="`+msg.result.response[i].order_number+`">`;
                text+=`<hr/></form>`;
            }
            document.getElementById('notification_detail').innerHTML = text;
            document.getElementById('notification_detail2').innerHTML = text;

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

function get_transactions(type){
    load_more = false;
    getToken();
    console.log(type);
    if(type == 'reset'){
        console.log('here');
        offset_transaction = 0;
        data_search = [];
        document.getElementById("table_reservation").innerHTML = `
                    <tr>
                        <th style="width:2%;">No.</th>
                        <th style="width:10%;">Name</th>
                        <th style="width:7%;">Provider</th>
                        <th style="width:8%;">State</th>
                        <th style="width:5%;">PNR</th>
                        <th style="width:12%;">Book Date</th>
                        <th style="width:12%;">Hold Date</th>
                        <th style="width:12%;">Issued Date</th>
                        <th style="width:9%;">Issued By</th>
                        <th style="width:7%;">Action</th>
                    </tr>`;
    }
    limit_transaction = 20;
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/account",
       headers:{
            'action': 'get_transactions',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {
            'offset': offset_transaction,
            'limit': limit_transaction,
            'provider_type': JSON.stringify([])
       },
       success: function(msg) {
        console.log(msg);
        if(msg.result.error_code == 0){
            try{
                if(msg.result.response.length >= 20){
                    offset_transaction++;
                    table_reservation(msg.result.response);
                    load_more = true;
                }else{
                    table_reservation(msg.result.response);
                }
            }catch(err){
                console.log('dari home');
                //set_notification(msg.result.response.transport_booking);
            }
        }else{
            alert('Oops, something when wrong please contact HO !');
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}