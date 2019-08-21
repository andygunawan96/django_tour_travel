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
       data: {
            'signature': signature
       },
       success: function(msg) {
        console.log(msg);
        if(msg.result.error_code == 0){
            balance = parseInt(msg.result.response.balance);
            credit_limit = parseInt(msg.result.response.credit_limit);
            text = `<div class="row">
                        <div class="col-lg-6">Balance: </div>
                        <div class="col-lg-6" style="text-align:right;">`+msg.result.response.currency_code + ' ' + getrupiah(balance)+`</div>
                    </div>`;
            document.getElementById("balance").innerHTML = text;
            text = `<div class="row">
                        <div class="col-lg-6">Credit Limit: </div>
                        <div class="col-lg-6" style="text-align:right;">`+msg.result.response.currency_code+ ' ' + getrupiah(credit_limit)+`</div>
                    </div>`;
            document.getElementById("credit_limit").innerHTML = text;
            //document.getElementById('balance').value = msg.result.response.balance + msg.result.response.credit_limit;
        }else if(msg.result.error_code == 4003){
            logout();
        }else{
            alert(msg.result.error_msg);
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
       data: {
            'signature': signature
       },
       success: function(msg) {
       console.log(msg);
        if(msg.result.error_code == 0){
            //document.getElementById('balance').value = msg.result.response.balance + msg.result.response.credit_limit;
        }else if(msg.result.error_code == 4003){
            logout();
        }else{
            alert(msg.result.error_msg);
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

function get_transactions_notification(){
    limit_transaction = 10;
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
            'provider_type': JSON.stringify([]),
            'signature': signature
       },
       success: function(msg) {
       console.log(msg);
        if(msg.result.error_code == 0){
            text = '';

            for(i in msg.result.response){

                number = parseInt(i)+1;
                if(msg.result.response[i].provider.provider_type == 'airline'){
                    text+=`<div class="col-lg-12 notification-hover" style="cursor:pointer;">`;
                    text+=`<form action="airline/booking" method="post" id="notification_`+number+`" onclick="set_csrf_notification(`+number+`)">`;
                    text+=`<span style="font-weight:500;"> `+number+`. `+msg.result.response[i].order_number+` - `+msg.result.response[i].pnr+`</span>`;
                    text+=`<input type="hidden" id="order_number" name="order_number" value="`+msg.result.response[i].order_number+`">`;
                    text+=`<hr/></form>`;
                    text+=`</div>`;
                }

            }
            document.getElementById('notification_detail').innerHTML = text;
//            document.getElementById('notification_detail2').innerHTML = text;

        }else if(msg.result.error_code == 4003){
            logout();
        }else{
            alert(msg.result.error_msg);
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
    if(type == 'reset'){
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
            'provider_type': JSON.stringify([]),
            'signature': signature
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
                //set_notification(msg.result.response.transport_booking);
            }
        }else if(msg.result.error_code == 4003){
            logout();
        }else{
            alert(msg.result.error_msg);
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

function get_top_up_amount(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/account",
       headers:{
            'action': 'get_top_up_amount',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {
        'signature': signature
       },
       success: function(msg) {
        console.log('here');
        console.log(msg);
        top_up_amount_list = msg.result.response;
        if(msg.result.error_code == 0){
            text = '';
            for(i in msg.result.response)
                text += `<option value="`+msg.result.response[i].seq_id+`" data-amount="`+msg.result.response[i].amount+`">`+msg.result.response[i].name+`</option>`;
            document.getElementById('amount').innerHTML = text;
            total_price_top_up();
        }else if(msg.result.error_code == 4003){
            logout();
        }else{
            alert(msg.result.error_msg);
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

function submit_top_up(){
    currency_code = '';
    for(i in top_up_amount_list){
        if(top_up_amount_list[i].seq_id == document.getElementById('amount').value){
            currency_code = top_up_amount_list[i].currency_code
            break;
        }
    }
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/account",
       headers:{
            'action': 'submit_top_up',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {
            'currency_code': currency_code,
            'amount_seq_id': document.getElementById('amount').value,
            'amount_count': document.getElementById('qty').value,
            'unique_amount': 0,
            'signature': signature
       },
       success: function(msg) {
        console.log(msg);
        if(msg.result.error_code == 0)
            document.getElementById('top_up_form').submit();
        else if(msg.result.error_code == 4003){
            logout();
        }else{
            alert(msg.result.error_msg);
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

function get_top_up(){

    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/account",
       headers:{
            'action': 'get_top_up',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {
            'signature': signature
       },
       success: function(msg) {
        console.log(msg);
        top_up_history = msg.result.response;
        //edit here
        for(i in top_up_history){
            tes = moment.utc(top_up_history[i].due_date).format('YYYY-MM-DD HH:mm:ss')
            var localTime  = moment.utc(tes).toDate();
            top_up_history[i].due_date = moment(localTime).format('DD MMM YYYY HH:mm');
        }
        if(msg.result.error_code == 0)
            table_top_up_history(msg.result.response);
        else if(msg.result.error_code == 4003){
            logout();
        }else{
            alert(msg.result.error_msg);
        }
        $('#loading-search-top-up').hide();
//        document.getElementById('top_up_form').submit();
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

function confirm_top_up(payment_seq_id){

    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/account",
       headers:{
            'action': 'confirm_top_up',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {
            'name': top_up_history[top_up_value].name,
            'payment_seq_id': payment_seq_id,
            'signature': signature
       },
       success: function(msg) {
        console.log(msg);
//        document.getElementById('top_up_form').submit();
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

function request_top_up(val){

    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/account",
       headers:{
            'action': 'request_top_up_api',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {
            'name': top_up_history[val].name,
            'signature': signature
       },
       success: function(msg) {
        console.log(msg);
//        document.getElementById('top_up_form').submit();
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

function table_top_up_history(data){
    text= '';
    var node = document.createElement("tr");
    for(i in data){
        data_search.push(data[i]);
        text+=`
        <form action="" method="POST" id="gotobooking`+data_counter+`" />
        <tr>
            <td>`+(parseInt(i)+1)+`</td>
            <td name="order_number">`+data[i].name+`</td>`;

        text+= `<td>`+data[i].due_date+`</td>`;
        text+= `<td>`+data[i].currency_code+' '+getrupiah(data[i].total)+`</td>`;
        text+= `<td>
        <input type='button' class="primary-btn-custom" value='Pay' onclick="get_payment_acquirer_top_up(`+data_counter+`)" />`;
        if(data[i].state == 'confirm')
            text+=`<input type='button' class="primary-btn-custom" value='Confirm' onclick="request_top_up(`+data_counter+`)" />`;
        text+=`</td>`;

        text+= `</tr>`;
        node.innerHTML = text;
        document.getElementById("table_top_up_history").appendChild(node);
        node = document.createElement("tr");
        $('#loading-search-top-up').hide();
//                   document.getElementById('airlines_ticket').innerHTML += text;
        text = '';
        data_counter++;
    }
}

function total_price_top_up(){
    for(i in top_up_amount_list){
        if(top_up_amount_list[i].seq_id == document.getElementById('amount').value){
            document.getElementById('total_amount').value = "Rp "+getrupiah((top_up_amount_list[i].amount * parseInt(document.getElementById('qty').value)));
            break;
        }
    }
    $('#amount').niceSelect('update');
}

function check_top_up(){
    error_text = '';
    if(document.getElementById('tac_checkbox').checked == false){
        error_text += 'Please check Term and Conditions\n';
    }

    if(document.getElementById('amount').value == ''){
        error_text += 'Please Input Amount\n';
    }
    try{
        if(parseInt(document.getElementById('amount').value) * parseInt(document.getElementById('qty').value) <= 50000){
            error_text += 'Minimum top up Amount IDR 50,000\n';
        }
    }catch(err){

    }
    if(error_text == ''){
        submit_top_up();
    }else{
        alert(error_text);
    }
}

function get_payment_acquirer_top_up(val){
    top_up_value = val;
    get_payment_acq('Confirm','', '', 'top_up', signature, 'top_up','HO.1636001', top_up_history[val].name);
}
