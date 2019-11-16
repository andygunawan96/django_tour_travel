offset_transaction = 0;


function get_balance(val){
    using_cache = '';
    if(val != undefined)
        using_cache = val;
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/account",
       headers:{
            'action': 'get_balance',
       },
       data: {
            'signature': signature,
            'using_cache': using_cache
       },
       success: function(msg) {
        console.log(msg);
        if(msg.result.error_code == 0){
            balance = parseInt(msg.result.response.balance);
            credit_limit = parseInt(msg.result.response.credit_limit);
            text = `Balance: `+msg.result.response.currency_code + ' ' + getrupiah(balance)+``;
            document.getElementById("balance").innerHTML = text;
            document.getElementById("balance_mob").innerHTML = text;
            text = `Credit Limit: `+msg.result.response.currency_code+ ' ' + getrupiah(credit_limit)+``;
            document.getElementById("credit_limit").innerHTML = text;
            document.getElementById("credit_mob").innerHTML = text;
            //document.getElementById('balance').value = msg.result.response.balance + msg.result.response.credit_limit;
        }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
            logout();
        }else{
          text = `Balance: Timeout`;
          document.getElementById("balance").innerHTML = text;
          document.getElementById("balance_mob").innerHTML = text;
          text = `Credit Limit: Timeout`;
          document.getElementById("credit_limit").innerHTML = text;
          document.getElementById("credit_mob").innerHTML = text;

//            Swal.fire({
//              type: 'error',
//              title: 'Oops!',
//              html: '<span style="color: #ff9900;">Error balance </span>' + msg.result.error_msg,
//            })
        }
        get_transactions_notification(val);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
          text = `Balance: Failed`;
          document.getElementById("balance").innerHTML = text;
          document.getElementById("balance_mob").innerHTML = text;
          text = `Credit Limit: Failed`;
          document.getElementById("credit_limit").innerHTML = text;
          document.getElementById("credit_mob").innerHTML = text;

//            Swal.fire({
//              type: 'error',
//              title: 'Oops!',
//              html: '<span style="color: red;">Error balance </span>' + errorThrown,
//            })
       },timeout: 60000
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
       data: {
            'signature': signature
       },
       success: function(msg) {
       console.log(msg);
        if(msg.result.error_code == 0){
            //document.getElementById('balance').value = msg.result.response.balance + msg.result.response.credit_limit;
        }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
            logout();
        }else{
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: #ff9900;">Error account </span>' + msg.result.error_msg,
            })
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error account </span>' + errorThrown,
            })
       },timeout: 60000
    });
}

function get_transactions_notification(val){
    limit_transaction = 10;
    getToken();
    using_cache = '';
    if(val != undefined)
        using_cache = val;
    $.ajax({
       type: "POST",
       url: "/webservice/account",
       headers:{
            'action': 'get_transactions',
       },
       data: {
            'offset': offset_transaction,
            'limit': limit_transaction,
            'provider_type': JSON.stringify([]),
            'signature': signature,
            'using_cache': using_cache
       },
       success: function(msg) {
       console.log(msg);
        if(msg.result.error_code == 0){
            text = '';
            var hold_date = '';
            var date = '';
            var check_notif = 0;
            var timeout_notif = 5000;
            var today = new Date();
            for(i in msg.result.response){
                hold_date = '';
                if(msg.result.response[i].hold_date != ''){
                    date = moment.utc(msg.result.response[i].hold_date).format('YYYY-MM-DD HH:mm:ss');
                    var localTime  = moment.utc(date).toDate();
                    if(today >= moment(localTime) && msg.result.response[i].state_description == 'Expired'){
                        hold_date = 'Expired';
                    }else if(msg.result.response[i].state_description == 'Issued'){
                        hold_date = 'Issued';
                    }else{
                        hold_date = moment(localTime).format('DD MMM YYYY HH:mm');
                        if(window.location.href.split('/')[window.location.href.split('/').length-1] == "" && check_notif < 5){
                            document.getElementById('notification_div').innerHTML +=`
                                <div class="row" id="alert`+check_notif+`">
                                    <div class="col-sm-6">
                                    </div>
                                    <div class="col-sm-6">
                                        <div class="alert alert-warning" role="alert">
                                          <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                          <strong>Hurry pay for this booking!</strong> `+msg.result.response[i].order_number + ' - ' + hold_date+`
                                        </div>
                                    </div>
                                </div>
                            `;
                            check_notif++;
                        }
                    }
                }else{
                    hold_date = 'Error booked';
                }
                number = parseInt(i)+1;
                if(msg.result.response[i].provider.provider_type == 'airline'){
                    text+=`<div class="col-lg-12 notification-hover" style="cursor:pointer;">`;
                    text+=`<form action="airline/booking" method="post" id="notification_`+number+`" onclick="set_csrf_notification(`+number+`)">`;
                    text+=`<div class="row">
                            <div class="col-sm-6">`;
                    text+=`<span style="font-weight:500;"> `+number+`. `+msg.result.response[i].order_number+` - `+msg.result.response[i].pnr+`</span>`;
                    text+=` </div>
                            <div class="col-sm-6" style="text-align:right">
                            <span style="font-weight:500;"> `+hold_date+`</span>`;
                    text+=` </div>
                           </div>`;
                    text+=`<input type="hidden" id="order_number" name="order_number" value="`+msg.result.response[i].order_number+`">`;
                    text+=`<hr/></form>`;
                    text+=`</div>`;
                }
            }
            setTimeout(function() {
                $("#notification_div").fadeTo(500, 0).slideUp(500, function(){
                    $(this).remove();
                });
            }, timeout_notif);
            document.getElementById('notification_detail').innerHTML = text;
//            document.getElementById('notification_detail2').innerHTML = text;

        }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
            logout();
        }else{
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: #ff9900;">Error transactions notification </span>' + msg.result.error_msg,
            })

           text= '';
           text+=`<div class="col-lg-12 notification-hover" style="cursor:pointer;">`;
           text+=`<span style="font-weight:500;"> No Notification</span>`;
           text+=`</div>`;
           document.getElementById('notification_detail').innerHTML = text;
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error transactions notification </span>' + errorThrown,
            })

           text= '';
           text+=`<div class="col-lg-12 notification-hover" style="cursor:pointer;">`;
           text+=`<span style="font-weight:500;"> Please try again or check your internet connection</span>`;
           text+=`</div>`;
           document.getElementById('notification_detail').innerHTML = text;
       },timeout: 60000
    });
}

function get_transactions(type){
    load_more = false;
    getToken();
    if(type == 'reset'){
        offset_transaction = 0;
        data_counter = 0;
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
       data: {
            'offset': offset_transaction,
            'limit': limit_transaction,
            'provider_type': JSON.stringify([]),
            'signature': signature,
            'using_cache': 'false'
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
                    var date = '';
                    var localTime = '';
                    for(i in msg.result.response){
                        date = moment.utc(msg.result.response[i].hold_date).format('YYYY-MM-DD HH:mm:ss');
                        localTime  = moment.utc(date).toDate();
                        msg.result.response[i].hold_date = moment(localTime).format('DD MMM YYYY HH:mm');

                        date = moment.utc(msg.result.response[i].booked_date).format('YYYY-MM-DD HH:mm:ss');
                        localTime  = moment.utc(date).toDate();
                        msg.result.response[i].booked_date = moment(localTime).format('DD MMM YYYY HH:mm');
                    }
                    table_reservation(msg.result.response);
                }
            }catch(err){
                //set_notification(msg.result.response.transport_booking);
            }
        }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
            logout();
        }else{
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: #ff9900;">Error transactions </span>' + msg.result.error_msg,
            })
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error transactions </span>' + errorThrown,
            })
       },timeout: 60000
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
        }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
            logout();
        }else{
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: #ff9900;">Error topup amount </span>' + msg.result.error_msg,
            })
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error topup amount</span>' + errorThrown,
            })
       },timeout: 60000
    });
}

function change_top_up(){
    document.getElementById('amount').disabled = false;
    document.getElementById('payment_method').disabled = false;
    document.getElementById('tac_checkbox').disabled = false;
    document.getElementById('payment_acq').innerHTML = '';
    document.getElementById('submit_name').innerHTML = 'Submit';
    document.getElementById('submit_name').setAttribute( "onClick", "javascript: check_top_up();" );
}

function submit_top_up(){
    currency_code = 'IDR';
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/account",
       headers:{
            'action': 'submit_top_up',
       },
       data: {
//            'currency_code': currency_code,
            'amount': document.getElementById('amount').value,
//            'amount_count': document.getElementById('qty').value,
//            'unique_amount': payment_acq2[payment_method][selected].price_component.unique_amount,
//            'seq_id': payment_acq2[payment_method][selected].seq_id,
            'signature': signature
       },
       success: function(msg) {
        console.log(msg);
        if(msg.result.error_code == 0){
            document.getElementById('amount').disabled = true;
            document.getElementById('payment_method').disabled = true;
            document.getElementById('tac_checkbox').disabled = true;
            document.getElementById('submit_name').innerHTML = 'Change';
            document.getElementById('submit_name').setAttribute( "onClick", "javascript: change_top_up();" );

            get_payment_acq('Issued','', '', 'top_up', signature, 'top_up','', '');
//            document.getElementById('top_up_form').submit();
        }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
            logout();
        }else{
            document.getElementById('submit_top_up').classList.remove('running');
            document.getElementById('submit_top_up').disabled = false;
            error_log = msg.result.error_msg.split('\n');
            log = "";
            for(i in error_log){
                log += error_log[i] + "\n";
            }
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: #ff9900;">Error submit topup </span>' + log,
            })
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           document.getElementById('submit_top_up').classList.remove('running');
           document.getElementById('submit_top_up').disabled = false;

           Swal.fire({
             type: 'error',
             title: 'Oops!',
             html: '<span style="color: red;">Error submit topup </span>' + errorThrown,
           })
       },timeout: 60000
    });
}

function commit_top_up(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/account",
       headers:{
            'action': 'commit_top_up',
       },
       data: {
            'member': payment_acq2[payment_method][selected].method,
            'seq_id': payment_acq2[payment_method][selected].seq_id,
            'signature': signature
       },
       success: function(msg) {
        console.log(msg);
        console.log(document.getElementById('top_up_form'));
        if(msg.result.error_code == 0){
            document.getElementById('top_up_form').submit();
        }else{
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: #ff9900;">Error commit topup </span>' + msg.result.error_msg,
            })
        }
        document.getElementById('top_up_form').submit();
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error commit topup </span>' + errorThrown,
            })
       },timeout: 60000
    });
}


function cancel_top_up(name){
    Swal.fire({
      title: 'Proceed this request?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        $('.loader-rodextrip').fadeIn();
        getToken();
        $.ajax({
           type: "POST",
           url: "/webservice/account",
           headers:{
                'action': 'cancel_top_up',
           },
           data: {
                'name': name,
                'signature': signature
           },
           success: function(msg) {
            console.log(msg);
            document.getElementById("table_top_up_history").innerHTML = `
            <tr>
                <th style="width:10%;">No.</th>
                <th style="width:20%;">Top Up Number</th>
                <th style="width:15%;">Due Date</th>
                <th style="width:15%;">Amount</th>
                <th style="width:15%;">Status</th>
                <th style="width:10%;">Action</th>
            </tr>`;
    //        document.getElementById("payment_acq").innerHTML = '';
    //        document.getElementById("payment_acq").style = 'padding-bottom:20px;';
            get_top_up();
    //        document.getElementById('top_up_form').submit();
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error cancel topup </span>' + errorThrown,
                })
               $('.loader-rodextrip').fadeOut();
               $('#submit_top_up').prop('disabled', false);
               $('#submit_top_up').removeClass('running');
           },timeout: 60000
        });

      }else{
        $('.loader-rodextrip').fadeIn();
        $('#submit_top_up').prop('disabled', false);
        $('#submit_top_up').removeClass('running');
      }
    })
}

function get_top_up(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/account",
       headers:{
            'action': 'get_top_up',
       },
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
        else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
            logout();
        }else{
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: #ff9900;">Error topup </span>' + msg.result.error_msg,
            })
        }
        $('#loading-search-top-up').hide();
//        document.getElementById('top_up_form').submit();
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error topup </span>' + errorThrown,
            })
            $('#loading-search-top-up').hide();
       },timeout: 60000
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
       data: {
            'name': top_up_history[top_up_value].name,
            'payment_seq_id': payment_seq_id,
            'signature': signature
       },
       success: function(msg) {
        console.log(msg);
        document.getElementById("table_top_up_history").innerHTML = '';
        document.getElementById("payment_acq").innerHTML = '';
        document.getElementById("payment_acq").style = 'padding-bottom:20px;';
        get_top_up();
//        document.getElementById('top_up_form').submit();
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error confirm topup </span>' + errorThrown,
            })
       },timeout: 60000
    });
}

function request_top_up(val){
    console.log(val);
    console.log(top_up_history);
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/account",
       headers:{
            'action': 'request_top_up_api',
       },
       data: {
            'name': top_up_history[val].name,
            'signature': signature
       },
       success: function(msg) {
        console.log(msg);
        document.getElementById("table_top_up_history").innerHTML = '';
        document.getElementById("payment_acq").innerHTML = '';
        document.getElementById("payment_acq").style = 'padding-bottom:20px;';
        get_top_up();
//        document.getElementById('top_up_form').submit();
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error request topup </span>' + errorThrown,
            })
       },timeout: 60000
    });
}

function table_top_up_history(data){
    text= '';
    var node = document.createElement("tr");
    data_counter = 0;
    for(i in data){
        data_search.push(data[i]);
        text+=`
        <form action="" method="POST" id="gotobooking`+data_counter+`" />
        <tr>
            <td>`+(parseInt(i)+1)+`</td>
            <td name="order_number">`+data[i].name+`</td>`;

        text+= `<td>`+data[i].due_date+`</td>`;
        text+= `<td>`+data[i].currency_code+' '+getrupiah(data[i].total)+`</td>`;
        text+= `<td>`+data[i].state+`</td>`;
        if(data[i].state == 'request'){
            text+= `<td>
            <input type='button' class="primary-btn-custom" value='Cancel' onclick="cancel_top_up('`+data[i].name+`')" />`;

            text+=`</td>`;
        }else{
            text+= `<td></td>`;
        }

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
//    for(i in top_up_amount_list){
//        if(top_up_amount_list[i].seq_id == document.getElementById('amount').value){
//            document.getElementById('total_amount').value = "IDR "+getrupiah(top_up_amount_list[i].amount);
//            break;
//        }
//    }
    console.log(document.getElementById('amount').value);
    document.getElementById('total_amount').value = "IDR "+getrupiah(document.getElementById('amount').value);
    try{
        document.getElementById('payment_method_price').innerHTML = payment_acq2[payment_method][selected].currency+` `+getrupiah(document.getElementById('amount').value);
        document.getElementById('payment_method_grand_total').innerHTML = payment_acq2[payment_method][selected].currency+` `+getrupiah(document.getElementById('amount').value + payment_acq2[payment_method][selected].price_component.unique_amount);
    }catch(err){
    }

//    $('#amount').niceSelect('update');
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
        if(parseInt(document.getElementById('amount').value) < 50000){
            error_text += 'Minimum top up Amount IDR 50,000\n';
        }
    }catch(err){

    }
    if(error_text == ''){
        Swal.fire({
          title: 'Proceed this request?',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes'
        }).then((result) => {
            console.log(result);
          if (result.value) {
            $('.loader-rodextrip').fadeIn();

            submit_top_up();

          }else{
            $('.loader-rodextrip').fadeIn();
            $('#submit_top_up').prop('disabled', false);
            $('#submit_top_up').removeClass('running');
          }
        })

    }else{
//        document.getElementById('submit_top_up').classList.remove('running');
//        document.getElementById('submit_top_up').disabled = false;
        Swal.fire({
          type: 'error',
          title: 'Oops!',
          html: '<span style="color: #ff9900;">Error check topup</span>' + error_text,
        })
    }
}

function get_payment_acquirer_top_up(val){
    top_up_value = val;
    get_payment_acq('Confirm','', '', 'top_up', signature, 'top_up','HO.1636001', '');
}
