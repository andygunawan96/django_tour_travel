offset_transaction = 0;
page_transaction_history_ledger = 1
temp_date_history = ''
function signin_rodextrip(type){
    $.ajax({
       type: "POST",
       url: "/webservice/issued_offline",
       headers:{
            'action': 'signin',
       },
       data: {},
       success: function(msg) {
            if(msg.result.error_code == 0){
                signature = msg.result.response.signature;
            }
            if(type == 'reservation'){
                get_transactions('reset');
            }else if(type == 'top_up_history'){
                get_top_up();
            }else if(type == 'history_transaction'){
                get_transaction_history_ledger('','false');
            }else if(type == 'registration'){
                agent_register_get_config();
                get_promotions();
                auto_complete('country')
                auto_complete_registration('social_media');
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get signature');
       },timeout: 60000
    });
}

function get_balance(val){
    using_cache = '';
    if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false){
        if(val != undefined)
            using_cache = val;
        if(typeof signature !== 'undefined'){
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
                if(msg.result.error_code == 0){
                    get_balance_response = msg;
                    time = 300;
                    balance = 0;
                    credit_limit = 0;
                    customer_parent_balance = 0;
                    if(msg.result.response.hasOwnProperty('balance'))
                        balance = parseInt(msg.result.response.balance);
                    if(msg.result.response.hasOwnProperty('credit_limit'))
                        credit_limit = parseInt(msg.result.response.credit_limit);
                    if(msg.result.response.hasOwnProperty('customer_parent_balance'))
                        customer_parent_balance = parseInt(msg.result.response.customer_parent_balance);

                    if(vendor_balance_check == 0){
//                        try{
//                            document.getElementById("balance").style.color = "black";
//                        }catch(err){}
//
//                        try{
//                            document.getElementById("balance_mob").style.color = "black";
//                        }catch(err){}
//
//                        try{
//                            document.getElementById("balance_search").style.color = "black";
//                        }catch(err){}

                        text = `Your Balance: `+msg.result.response.currency_code + ' ' + getrupiah(balance)+``;

                    }else{
                        //BALANCE VENDOR
                        text = `Balance Vendor`;
                        if(document.getElementById("balance")){
                            document.getElementById("balance").style.cursor = "pointer";
                            document.getElementById("balance").onclick = function() {$("#myModalBalanceVendor").modal('show');};
                        }
                        if(document.getElementById("balance_mob")){
                            document.getElementById("balance_mob").style.cursor = "pointer";
                            document.getElementById("balance_mob").onclick = function() {$("#myModalBalanceVendor").modal('show');};
                        }
                        if(document.getElementById("balance_search")){
                            document.getElementById("balance_search").style.cursor = "pointer";
                            document.getElementById("balance_search").onclick = function() {$("#myModalBalanceVendor").modal('show');};
                        }
                        if(document.getElementById("my_balance"))
                            document.getElementById("my_balance").innerHTML = `
                            <img src="/static/tt_website_rodextrip/images/icon/wallet_black.png" alt="Balance Vendor" style="width:15px; height:15px;">
                            <span style="font-size:14px; font-weight:500;"><span style="color:`+color+`;">`+msg.result.response.currency_code+` `+getrupiah(balance)+`</span></span>`;
                    }
                    if(msg.result.response.is_show_balance){
                        //BALANCE
                        if(document.getElementById("balance"))
                            document.getElementById("balance").innerHTML = text;
                        if(document.getElementById("balance_mob"))
                            document.getElementById("balance_mob").innerHTML = text;
                        if(document.getElementById("balance_search"))
                            document.getElementById("balance_search").innerHTML = text;
                    }
                    if(msg.result.response.is_show_credit_limit){
                        text = `Credit Limit: `+msg.result.response.currency_code+ ' ' + getrupiah(credit_limit)+``;
                        //CREDIT LIMIT
                        if(document.getElementById("credit_limit"))
                            document.getElementById("credit_limit").innerHTML = text;
                        if(document.getElementById("credit_mob"))
                            document.getElementById("credit_mob").innerHTML = text;
                        if(document.getElementById("credit_search"))
                            document.getElementById("credit_search").innerHTML = text;
                    }
                    if(msg.result.response.is_show_customer_parent_balance){
                        text = `Corporate Balance: `+msg.result.response.currency_code+ ' ' + getrupiah(customer_parent_balance)+``;
                        //PARENT AGENT BALANCE CORPORATE
                        if(document.getElementById("customer_parent_balance"))
                            document.getElementById("customer_parent_balance").innerHTML = text;
                        if(document.getElementById("customer_parent_balance_mob"))
                            document.getElementById("customer_parent_balance_mob").innerHTML = text;
                        if(document.getElementById("customer_parent_balance_search"))
                            document.getElementById("customer_parent_balance_search").innerHTML = text;
                    }
                    if(window.location.href.split('/').length < 7){
//                        get_transactions_notification(val);
                        get_transactions_notification();
                    }
                    //get_vendor_balance(val);
                    //document.getElementById('balance').value = msg.result.response.balance + msg.result.response.credit_limit;
                }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                    clearTimeout(timeInterval); //clear get balance no session
                    time = -1;
                    auto_logout();
                }else{
                    text = `Balance: Timeout`;
                    //BALANCE TIMEOUT
                    if(document.getElementById("balance"))
                        document.getElementById("balance").innerHTML = text;
                    if(document.getElementById("balance_mob"))
                        document.getElementById("balance_mob").innerHTML = text;
                    if(document.getElementById("balance_search"))
                        document.getElementById("balance_search").innerHTML = text;

                    text = `Credit Limit: Timeout`;
                    //CREDIT LIMIT TIMEOUT
                    if(document.getElementById("credit_limit"))
                        document.getElementById("credit_limit").innerHTML = text;
                    if(document.getElementById("credit_mob"))
                        document.getElementById("credit_mob").innerHTML = text;
                    if(document.getElementById("credit_search"))
                        document.getElementById("credit_search").innerHTML = text;
                    Swal.fire({
                          type: 'error',
                          title: 'Oops!',
                          html: '<span style="color: #ff9900;">Error get balance </span>' + msg.result.error_msg,
                    })
                }

               },
               error: function(XMLHttpRequest, textStatus, errorThrown) {
                    auto_logout();
                    text = `Balance: Failed`;
                        //BALANCE Failed AJAX
                        if(document.getElementById("balance"))
                            document.getElementById("balance").innerHTML = text;
                        if(document.getElementById("balance_mob"))
                            document.getElementById("balance_mob").innerHTML = text;
                        if(document.getElementById("balance_search"))
                            document.getElementById("balance_search").innerHTML = text;
                    text = `Credit Limit: Failed`;
                    //CREDIT LIMIT Failed AJAX
                    if(document.getElementById("credit_limit"))
                        document.getElementById("credit_limit").innerHTML = text;
                    if(document.getElementById("credit_mob"))
                        document.getElementById("credit_mob").innerHTML = text;
                    if(document.getElementById("credit_search"))
                        document.getElementById("credit_search").innerHTML = text;
               },timeout: 60000
            });
        }else{

        }
    }
}

function get_account(){
    limit_transaction = 20;
    if(typeof variable !== 'undefined'){
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
            if(msg.result.error_code == 0){
                //document.getElementById('balance').value = msg.result.response.balance + msg.result.response.credit_limit;
            }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
            }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error account </span>' + msg.result.error_msg,
                })
            }
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
    //            logout();
                error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error account');
           },timeout: 60000
        });
    }
}

function get_transactions_notification(){
    $.ajax({
       type: "POST",
       url: "/webservice/account",
       headers:{
            'action': 'get_transactions_notif_api',
       },
       data: {
            'provider_type': 'airline',
            'signature': signature
       },
       success: function(msg) {
//            console.log(msg);
            try{
                document.getElementById('notification_detail').innerHTML = '';
    //            document.getElementById('notification_detail2').innerHTML = '';
                if(msg.result.error_code == 0){
                    text = '';
                    var hold_date = '';
                    var date = '';
                    var check_notif = 0;
                    var timeout_notif = 5000;
                    if(Object.keys(msg.result.response).length == 0){
                        document.getElementById('notification_detail').innerHTML = `
                            <div class="col-lg-12 notification-hover" style="cursor:pointer;">
                                <div class="row">
                                    <div class="col-sm-12" style="text-align:center">
                                        <span style="font-weight:500"> No Notification</span>
                                    </div>
                                </div>
                                <hr>
                            </div>`;
                        try{
                            document.getElementById('notification_detail2').innerHTML = `
                                <div class="col-lg-12 notification-hover" style="cursor:pointer;">
                                    <div class="row">
                                        <div class="col-sm-12" style="text-align:center">
                                            <span style="font-weight:500"> No Notification</span>
                                        </div>
                                    </div>
                                    <hr>
                                </div>`;
                        }catch(err){
                            console.log(err); // error kalau ada element yg tidak ada
                        }
                        $(".bell_notif").removeClass("infinite");
                    }else{
                        notif_text = '';
                        //untuk render data notifnya
                        render_data_notification = msg.result.response;
                        render_notification();
                        /*
                        for(i in msg.result.response){
                            if(window.location.href.split('/').length == 4 && check_notif < 5){
                                notif_text = `
                                    <div id="alert`+check_notif+`">
                                        <div class="alert alert-warning" role="alert">
                                          <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                          <strong>Hurry pay for this booking!</strong> `+msg.result.response[i].name + ' ' + msg.result.response[i].description.msg;
                                if(msg.result.response[i].description.datetime != ''){
                                    tes = moment.utc(msg.result.response[i].description.datetime).format('YYYY-MM-DD HH:mm:ss')
                                    localTime  = moment.utc(tes).toDate();
                                    datetime = moment(localTime).format('DD MMM YYYY HH:mm');
                                    notif_text += ' before ' + datetime;
                                }
                                notif_text+=`
                                        </div>
                                    </div>`;
                                document.getElementById('notification_div').innerHTML += notif_text;
                                check_notif++;
                            }else{
                                break
                            }
                        }
                        if(check_notif == 0){
                            try{
                                document.getElementById('notification_detail').innerHTML = `
                                    <div class="col-lg-12 notification-hover" style="cursor:pointer;">
                                        <div class="row">
                                            <div class="col-sm-12" style="text-align:center">
                                                <span style="font-weight:500"> No Notification</span>
                                            </div>
                                        </div>
                                        <hr>
                                    </div>`;
                                try{
                                    document.getElementById('notification_detail2').innerHTML = `
                                        <div class="col-lg-12 notification-hover" style="cursor:pointer;">
                                            <div class="row">
                                                <div class="col-sm-12" style="text-align:center">
                                                    <span style="font-weight:500"> No Notification</span>
                                                </div>
                                            </div>
                                            <hr>
                                        </div>`;
                                }catch(err){
                                    console.log(err); // error kalau ada element yg tidak ada
                                }
                            }catch(err){
                                console.log(err); // error kalau ada element yg tidak ada
                            }
                            $(".bell_notif").removeClass("infinite");
                        }*/
                    }

                    setTimeout(function() {
                        $("#notification_div").fadeTo(500, 0).slideUp(500, function(){
                            //$(this).remove();
                            $("#notification_div").hide();
                        });
                    }, timeout_notif);

        //            document.getElementById('notification_detail2').innerHTML = text;

                }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                    auto_logout();
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
            }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
            }

            setTimeout(function() {
                $("#loading-search-notification").hide();
            }, 500);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get transaction need update identity');
       },timeout: 60000
    });
}

function show_snooze(val, date, create_date, index){
    //document.getElementById('snooze_div'+val).hidden = false;
    document.getElementById('snooze_date_modal').innerHTML = `
    <input type="text" class="form-control mb-3" name="snooze_input_date`+val+`" id="snooze_input_date`+val+`" placeholder="Snooze Date" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Snooze Date '" autocomplete="off" readonly>
    <div style="text-align:right;">
        <button type="button" class="primary-btn-white-cancel" onclick="close_modal_click('myModalNotification');">
            Cancel
        </button>
        <button type="button" class="primary-btn" onclick="set_snooze_notification(`+val+`, '`+date+`', '`+create_date+`', `+index+`);">
            Snooze
        </button>
    </div>`;

    $('input[name="snooze_input_date'+val+'"]').daterangepicker({
        singleDatePicker: true,
        autoUpdateInput: true,
        opens: 'center',
        drops: 'auto',
        startDate: moment().subtract(-1, 'days'),
        minDate: moment().subtract(-1, 'days'),
        maxDate: moment(date),
        showDropdowns: true,
        locale: {
            format: 'DD MMM YYYY',
        }
    });

    $('#myModalNotification').modal('show');
}

function set_snooze_notification(number, date, create_date, index){
    var days = Math.ceil((new Date(document.getElementById('snooze_input_date'+number).value) - new Date())/(1000 * 3600 * 24)); // milliseconds * 1 hours * 24 hours
    if(days != 0){
        set_snooze_notification_api(document.getElementById('order_number_notif'+number).value, document.getElementById('desc_notif'+number).value, days, number, date, create_date, index);
    }else{
        Swal.fire({
            type: 'error',
            title: 'Oops!',
            html: 'Please choose snooze!',
        })
    }
}

function set_unsnooze_notification(number, date, create_date, index){
    set_snooze_notification_api(document.getElementById('order_number_notif'+number).value, document.getElementById('desc_notif'+number).value, 0, number, date, create_date, index);
}

function set_snooze_notification_api(order_number, description, days, number, date, create_date, index){
    $.ajax({
       type: "POST",
       url: "/webservice/account",
       headers:{
            'action': 'set_snooze_notif_api',
       },
       data: {
            'order_number': order_number,
            'days': days,
            'signature': signature
       },
       success: function(msg) {
            $("#myModalNotification").modal('hide');
            if(msg.result.error_code == 0){
                if(days == 0){
                    document.getElementById('notif_button_span'+number).innerHTML = `
                        <span class="notification-hover" onclick="show_snooze(`+number+`,'`+date+`', '`+create_date+`', `+index+`)">
                            Snooze
                            <i class="fas fa-bell" style="font-size:14px;"></i>
                        </span>`;
                    document.getElementById('snooze_div_datetime'+number).innerHTML = '';

                }else{
                    document.getElementById('notif_button_span'+number).innerHTML = `
                        <span class="notification-hover" style="font-size:14px; padding-right:10px; color:#DC143C;" onclick="set_unsnooze_notification(`+number+`,'`+date+`', '`+create_date+`', `+index+`)">
                            Cancel
                            <i class="fas fa-times" style="font-size:14px;"></i>
                        </span>
                        <span class="notification-hover" style="font-size:14px;" onclick="show_snooze(`+number+`,'`+date+`','`+create_date+`', `+index+`)">
                            Edit
                            <i class="fas fa-pen" style="font-size:14px;"></i>
                        </span>`;
                    document.getElementById('snooze_div_datetime'+number).innerHTML =`
                        <i><i class="fas fa-clock" style="color:#808080; font-size:16px;"></i> Snooze until <i style="color:`+color+`;">`+moment(create_date).subtract(days * -1, 'days').format('DD MMMM YYYY')+`</i></i>`;
                }

                render_data_notification[index].snooze_days = days;

                const Toast = Swal.mixin({
                  toast: true,
                  position: 'top-end',
                  showConfirmButton: false,
                  timer: 3000
                })

                Toast.fire({
                  type: 'success',
                  title: 'Snooze'
                });

            }else{
                Swal.fire({
                    type: 'error',
                    title: 'Oops!',
                    html: msg.result.error_msg,
                })
            }

       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error set read notification');
       },timeout: 60000
    });

}

function set_read_notification(number){
    $.ajax({
       type: "POST",
       url: "/webservice/account",
       headers:{
            'action': 'set_read_transactions_notif_api',
       },
       data: {
            'order_number': document.getElementById('order_number_notif'+number).value,
            'description': document.getElementById('desc_notif'+number).value,
            'signature': signature
       },
       success: function(msg) {
            document.getElementById('notification_'+number).submit();
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error set read notification');
       },timeout: 60000
    });
}

function get_transaction_history_ledger(type,use_cache){
    $('#loading-search-reservation').show();
    if(type == 'reset'){
        page_transaction_history_ledger = 1;
        document.getElementById('body_table_reservation').innerHTML = '';
        $('#loading-search-reservation').show();
    }
    limit_transaction = 100;
    load_more = false;
    document.getElementById('button').disabled = true;
    if(document.getElementById('start_date'))
        start_date = moment(document.getElementById('start_date').value).format('YYYY-MM-DD');
    if(document.getElementById('end_date'))
        end_date = moment(document.getElementById('end_date').value).format('YYYY-MM-DD');
    $.ajax({
       type: "POST",
       url: "/webservice/account",
       headers:{
            'action': 'get_history_transaction_ledger',
       },
       data: {
            'page': page_transaction_history_ledger,
            'limit': limit_transaction,
            'using_cache': use_cache,
            'start_date': start_date,
            'end_date': end_date,
            'signature': signature
       },
       success: function(msg) {
            console.log(msg);
            text = '';

            if(msg.result.error_code == 0){
                date_now_history = moment().format('DD MMM YYYY');
                for(i in msg.result.response){
                    if(msg.result.response[i].date){
                        data_date_history = moment(msg.result.response[i].date).format('DD MMM YYYY');

                        if(temp_date_history != data_date_history){
                            text+=`<br/>`;
                            temp_date_history = '';
                        }

                        if(temp_date_history == ''){
                            text += `<div class="border_custom_left" style="background:white; padding:15px;">`;
                            if(date_now_history == data_date_history){
                                text += "<b style='font-size:14px;'><i class='fas fa-calendar-alt' style='padding-right:5px;'></i>Today</b>";
                            }else{
                                text += "<b style='font-size:14px;'><i class='fas fa-calendar-alt' style='padding-right:5px;'></i>"+moment(msg.result.response[i].date).format('DD MMM YYYY') + '</b>';
                            }
                            text += `</div>`;
                            temp_date_history = data_date_history;
                        }
                    }

                    text += `<div style="border:1px solid #cdcdcd; background:white; padding:15px;">`;
                        text += `
                        <div class="row">
                            <div class="col-lg-9">`;
                                if(msg.result.response[i].provider_type_name == "Airline"){
                                    text += `<img src="/static/tt_website_rodextrip/images/icon/airlines_black.png" alt="`+msg.result.response[i].name+`" style="width:22px; height:22px;">`;
                                }else if(msg.result.response[i].provider_type_name == "Train"){
                                    text += `<img src="/static/tt_website_rodextrip/images/icon/train_black.png" alt="`+msg.result.response[i].name+`" style="width:22px; height:22px;">`;
                                }else if(msg.result.response[i].provider_type_name == "Hotel"){
                                    text += `<img src="/static/tt_website_rodextrip/images/icon/hotel_black.png" alt="`+msg.result.response[i].name+`" style="width:22px; height:22px;">`;
                                }else if(msg.result.response[i].provider_type_name == "Activity"){
                                    text += `<img src="/static/tt_website_rodextrip/images/icon/activity_black.png" alt="`+msg.result.response[i].name+`" style="width:22px; height:22px;">`;
                                }else if(msg.result.response[i].provider_type_name == "Tour"){
                                    text += `<img src="/static/tt_website_rodextrip/images/icon/tour_black.png" alt="`+msg.result.response[i].name+`" style="width:22px; height:22px;">`;
                                }else if(msg.result.response[i].provider_type_name == "Visa"){
                                    text += `<img src="/static/tt_website_rodextrip/images/icon/visa_black.png" alt="`+msg.result.response[i].name+`" style="width:22px; height:22px;">`;
                                }else if(msg.result.response[i].provider_type_name == "Passport"){
                                    text += `<img src="/static/tt_website_rodextrip/images/icon/passport_black.png" alt="`+msg.result.response[i].name+`" style="width:22px; height:22px;">`;
                                }else if(msg.result.response[i].provider_type_name == "PPOB"){
                                    text += `<img src="/static/tt_website_rodextrip/images/icon/ppob_black.png" alt="`+msg.result.response[i].name+`" style="width:22px; height:22px;">`;
                                }else if(msg.result.response[i].provider_type_name == "Event"){
                                    text += `<img src="/static/tt_website_rodextrip/images/icon/event_black.png" alt="`+msg.result.response[i].name+`" style="width:22px; height:22px;">`;
                                }else if(msg.result.response[i].provider_type_name == "Bus"){
                                    text += `<img src="/static/tt_website_rodextrip/images/icon/bus_black.png" alt="`+msg.result.response[i].name+`" style="width:22px; height:22px;">`;
                                }else if(msg.result.response[i].provider_type_name == "Insurance"){
                                    text += `<img src="/static/tt_website_rodextrip/images/icon/insurance_black.png" alt="`+msg.result.response[i].name+`" style="width:22px; height:22px;">`;
                                }else if(msg.result.response[i].provider_type_name == "Offline"){
                                    text += `<img src="/static/tt_website_rodextrip/images/icon/offline_black.png" alt="`+msg.result.response[i].name+`" style="width:auto; height:22px;">`;
                                }else if(msg.result.response[i].provider_type_name == "Group Booking"){
                                    text += `<img src="/static/tt_website_rodextrip/images/icon/groupbooking_black.png" alt="`+msg.result.response[i].name+`" style="width:auto; height:22px;">`;
                                }else if(msg.result.response[i].provider_type_name == "Mitra Keluarga"){
                                    text += `<img src="/static/tt_website_rodextrip/images/icon/mitra_keluarga.png" alt="`+msg.result.response[i].name+`" style="width:auto; height:22px;">`;
                                }else if(msg.result.response[i].provider_type_name == "phc"){
                                    text += `<img src="/static/tt_website_rodextrip/images/icon/phc_logo.png" alt="`+msg.result.response[i].name+`" style="width:auto; height:22px;">`;
                                }else if(msg.result.response[i].provider_type_name == "Lab Pintar"){
                                    text += `<img src="/static/tt_website_rodextrip/images/icon/lab_pintar.png" alt="`+msg.result.response[i].name+`" style="width:auto; height:22px;">`;
                                }else if(msg.result.response[i].provider_type_name == "Sentra Medika"){
                                    text += `<img src="/static/tt_website_rodextrip/images/icon/sentra_medika.png" alt="`+msg.result.response[i].name+`" style="width:auto; height:22px;">`;
                                }else if(msg.result.response[i].provider_type_name == "Periksain"){
                                    text += `<img src="/static/tt_website_rodextrip/images/icon/periksain.png" alt="`+msg.result.response[i].name+`" style="width:auto; height:22px;">`;
                                }else{
                                    text += `<img src="/static/tt_website_rodextrip/images/icon/wallet_black.png" alt="`+msg.result.response[i].name+`" style="width:20px; height:20px;">`;
                                }

                                if(msg.result.response[i].provider_type_name)
                                    text += '<b style="font-size:16px;"> ' +msg.result.response[i].provider_type_name + '</b><br/>';
                                if(msg.result.response[i].name)
                                    text += '<b style="font-size:16px;">' +msg.result.response[i].name + '</b><br/>';
                                if(msg.result.response[i].pnr)
                                    text += "<b>PNR:</b><i> "+msg.result.response[i].pnr + '</i><br/>';
                                if(msg.result.response[i].name.includes(msg.result.response[i].ref) == false)
                                    text += "<b>Reference:</b><i> "+msg.result.response[i].ref + '</i><br/>';
                                if(Object.keys(msg.result.response[i].booker).length > 0)
                                    text += "<b>Booker:</b><i> "+msg.result.response[i].booker.name + '</i><br/>';
                                if(msg.result.response[i].info)
                                    text += "<span id='pop_detail_info"+i+"'><b style='color:"+color+"; cursor:pointer;'>Detail Info <i class='fas fa-chevron-down'></i></b></span><br/>";
                                text += `
                            </div>
                            <div class="col-lg-3" style="text-align:right;">`;
                            tes = moment.utc(msg.result.response[i].create_date).format('YYYY-MM-DD HH:mm:ss')
                            localTime  = moment.utc(tes).toDate();
                            msg.result.response[i].create_date = moment(localTime).format('DD MMM YYYY HH:mm');

                            text+=`<i>`+moment(msg.result.response[i].create_date).format('DD MMM YYYY - HH:mm')+`</i><br/>`;

                            if(msg.result.response[i].currency && msg.result.response[i].debit > 0){
                                text += `<span style="text-align:right; font-size:18px; font-weight:700; color:green">`;
                                if(msg.result.response[i].source_of_funds_type == 'balance')
                                    text += msg.result.response[i].currency+' ';
                                else
                                    text += 'Rodextrip Points '
                                text += '+'+getrupiah(msg.result.response[i].debit);
                                text += `</span>`;
                            }
                            if(msg.result.response[i].currency && msg.result.response[i].credit > 0){
                                text += `<span style="text-align:right; font-size:18px; font-weight:700; color:red">`;
                                if(msg.result.response[i].source_of_funds_type == 'balance')
                                    text += msg.result.response[i].currency+' ';
                                else
                                    text += 'Rodextrip Points '
                                text += '-'+getrupiah(msg.result.response[i].credit);
                                text += `</span>`;
                            }

                            text += `
                            </div>
                        </div>
                    </div>`;
                }

                if(msg.result.response.length == 0)
                    document.getElementById('reservation_found').style.display = 'block';
                else
                    document.getElementById('reservation_found').style.display = 'none';
            }else{
                document.getElementById('reservation_found').style.display = 'block';
            }
            document.getElementById('body_table_reservation').innerHTML += text;

            if(msg.result.error_code == 0){
                for(i in msg.result.response){
                    if(msg.result.response[i].info){
                        new jBox('Tooltip', {
                            attach: '#pop_detail_info'+i,
                            target: '#pop_detail_info'+i,
                            theme: 'TooltipBorder',
                            trigger: 'click',
                            adjustTracker: true,
                            closeOnClick: 'body',
                            closeButton: 'box',
                            animation: 'move',
                            position: {
                              x: 'left',
                              y: 'bottom'
                            },
                            outside: 'y',
                            pointer: 'left:20',
                            offset: {
                              x: 25
                            },
                            content: '<b>'+msg.result.response[i].info+'</b>',
                            onOpen: function () {
                              this.source.addClass('active').html('<b style="color:'+color+'; cursor:pointer;">Close <i class="fas fa-chevron-up"></i></b>');
                            },
                            onClose: function () {
                              this.source.removeClass('active').html('<b style="color:'+color+'; cursor:pointer;">Detail Info <i class="fas fa-chevron-down"></i></b>');
                            }
                        });
                    }
                }
            }

            $('#loading-search-reservation').hide();
            page_transaction_history_ledger++;
            document.getElementById('button').disabled = false;
            if(msg.result.response.length ==limit_transaction)
                load_more = true;

       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error transaction history ledger');
       },timeout: 60000
    });
}

function get_transactions(type){
    $('#loading-search-reservation').show();
    document.getElementById('button').disabled = true;
    load_more = false;
    if(type == 'reset' || type == 'filter' || type == 'mode'){
        offset_transaction = 0;
        data_counter = 0;
        data_search = [];
        document.getElementById("table_reservation").innerHTML = '';
    }
    carrier_code = [];
    try{
        var radios = document.getElementsByName('filter');
        for (var j = 0, length = radios.length; j < length; j++) {
            if (radios[j].checked) {
                filter = radios[j].value;
            }
            radios[j].disabled = true
        }
        if(filter != '')
            carrier_code.push(filter);
    }catch(err){

    }
    filter = '';
    try{
        var radios = document.getElementsByName('filter_type');
        for (var j = 0, length = radios.length; j < length; j++) {
            if (radios[j].checked) {
                filter = radios[j].value;
            }
            radios[j].disabled = true
        }
    }catch(err){

    }
    state = '';
    start_date = '';
    end_date = '';
    name = '';
    pnr = '';
    booker_name = '';
    passenger_name = '';
    if(document.getElementById('state'))
        state = document.getElementById('state').value;
    if(document.getElementById('start_date'))
        start_date = moment(document.getElementById('start_date').value).format('YYYY-MM-DD');
    if(document.getElementById('end_date'))
        end_date = moment(document.getElementById('end_date').value).format('YYYY-MM-DD');
    if(document.getElementById('name'))
        passenger_name = document.getElementById('name').value;
    if(document.getElementById('booker_name'))
        booker_name = document.getElementById('booker_name').value;
    if(document.getElementById('passenger_name'))
        passenger_name = document.getElementById('passenger_name').value;
    if(document.getElementById('pnr'))
        pnr = document.getElementById('pnr').value;
    if(filter == 'booker' && booker_name == ''){
        filter = '';
    }else if(filter == 'name' && name == ''){
        filter = '';
    }else if(filter == 'pnr' && pnr == ''){
        filter = '';
    }else if(filter == 'date' && start_date == '' ||filter == 'date' && end_date == ''){
        filter = '';
    }else if(filter == 'state' && state == '')
        filter = '';
    limit_transaction = 20;
    $.ajax({
       type: "POST",
       url: "/webservice/account",
       headers:{
            'action': 'get_transactions',
       },
       data: {
            'offset': offset_transaction,
            'limit': limit_transaction,
            'provider_type': JSON.stringify(carrier_code),
            'signature': signature,
            'type': 'all',
//            'name': '',
            'state': state,
            'start_date': start_date,
            'end_date': end_date,
            'booker_name': booker_name,
            'passenger_name': passenger_name,
            'pnr': pnr,
            'using_cache': 'false'
       },
       success: function(msg) {
        document.getElementById('search').style.display = 'block';
        document.getElementById('button').disabled = false;
        $('#loading-search-reservation').hide();
        try{
            var radios = document.getElementsByName('filter_type');
            for (var j = 0, length = radios.length; j < length; j++) {
                radios[j].disabled = false
            }
        }catch(err){
            console.log(err); // error kalau ada element yg tidak ada
        }
        if(msg.result.error_code == 0){
            if(type == 'reset' || type == 'filter' || type == 'mode'){
                offset_transaction = 0;
                data_counter = 0;
                data_search = [];
                document.getElementById("table_reservation").innerHTML = '';
            }
            try{
                var date = '';
                var localTime = '';
                text = '';
                data_length = 0;
                var str = '';
                for(i in msg.result.response){
                    str = i;
//                    if(data_length == 0)
//                        text += `<label class="radio-button-custom">
//                                <span>`+str.charAt(0).toUpperCase()+str.slice(1).toLowerCase()+`</span>
//                                <input type="radio" checked="checked" name="filter" value="`+str+`" onclick="get_transactions('filter');">
//                                <span class="checkmark-radio"></span>
//                            </label>`;
//                    else
//                        text += `<label class="radio-button-custom">
//                                <span>`+str.charAt(0).toUpperCase()+str.slice(1).toLowerCase()+`</span>
//                                <input type="radio" name="filter" value="`+str+`" onclick="get_transactions('filter');">
//                                <span class="checkmark-radio"></span>
//                            </label>`;
                    for(j in msg.result.response[i]){
                        data_length++;
                        if(msg.result.response[i][j].hold_date != '' && msg.result.response[i][j].hold_date != false){
                            date = moment.utc(msg.result.response[i][j].hold_date, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
                            localTime  = moment.utc(date).toDate();
                            data_gmt = moment(msg.result.response[i][j].hold_date)._d.toString().split(' ')[5];
                            gmt = data_gmt.replace(/[^a-zA-Z+-]+/g, '');
                            timezone = data_gmt.replace (/[^\d.]/g, '');
                            timezone = timezone.split('')
                            timezone = timezone.filter(item => item !== '0')
                            msg.result.response[i][j].hold_date = moment(localTime).format('DD MMM YYYY HH:mm') + ' ' + gmt + timezone;
                        }
                        if(msg.result.response[i][j].booked_date != '' && msg.result.response[i][j].booked_date != false){
                            date = moment.utc(msg.result.response[i][j].booked_date, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
                            localTime  = moment.utc(date).toDate();
                            data_gmt = moment(msg.result.response[i][j].booked_date)._d.toString().split(' ')[5];
                            gmt = data_gmt.replace(/[^a-zA-Z+-]+/g, '');
                            timezone = data_gmt.replace (/[^\d.]/g, '');
                            timezone = timezone.split('')
                            timezone = timezone.filter(item => item !== '0')
                            msg.result.response[i][j].booked_date = moment(localTime).format('DD MMM YYYY HH:mm') + ' ' + gmt + timezone;
                        }
                        if(msg.result.response[i][j].issued_date != '' && msg.result.response[i][j].issued_date != false){
                            date = moment.utc(msg.result.response[i][j].issued_date, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
                            localTime  = moment.utc(date).toDate();
                            data_gmt = moment(msg.result.response[i][j].issued_date)._d.toString().split(' ')[5];
                            gmt = data_gmt.replace(/[^a-zA-Z+-]+/g, '');
                            timezone = data_gmt.replace (/[^\d.]/g, '');
                            timezone = timezone.split('')
                            timezone = timezone.filter(item => item !== '0')
                            msg.result.response[i][j].issued_date = moment(localTime).format('DD MMM YYYY HH:mm') + ' ' + gmt + timezone;
                        }
                    }
                }
//                if(type == 'reset')
//                    document.getElementById('type').innerHTML = text;
                var radios = document.getElementsByName('filter');
                for (var j = 0, length = radios.length; j < length; j++) {
                    if (radios[j].checked) {
                        filter = radios[j].value;
                    }
                    radios[j].disabled = false;
                }
                for(x in msg.result.response[filter]){ // filter == provider yg lagi di pilih
                    data_search.push(msg.result.response[filter][x]);
                }
                if(Object.keys(msg.result.response).length == 0 && data_counter == 0){
//                    var node = document.createElement("div");
//                    node.innerHTML = `
//                    <div class="col-lg-12 notification-hover" style="cursor:pointer;">
//                        <div class="row">
//                            <div class="col-sm-12" style="text-align:center">
//                                <span style="font-weight:500"> No Record</span>
//                            </div>
//                        </div>
//                    </div>`;
//                    document.getElementById("desc").appendChild(node);
                    document.getElementById('reservation_found').innerHTML = `
                        <h6><i class="fas fa-search-minus"></i> Oops! Data not found!</h6>
                    `;
                    document.getElementById('reservation_found').style.display = '';
                }if(Object.keys(msg.result.response).length == 0 && data_counter != 0){
                    document.getElementById('reservation_found').innerHTML = `
                        <h6><i class="fas fa-search-minus"></i> End of data!</h6>
                    `;
                    document.getElementById('reservation_found').style.display = '';

                }else if(msg.result.response[filter].length >= 20){
                    offset_transaction++;
                    if ($("input[name='view_type_reservation']:checked").val() == "card_mode") {
                        table_reservation(msg.result.response[filter], 'card_mode');
                    }else{
                        table_reservation(msg.result.response[filter], 'table_mode');
                    }

                    load_more = true;
                    document.getElementById('reservation_found').style.display = 'none';
//                    $('#reservation_found').hide();
                }else{
                    if ($("input[name='view_type_reservation']:checked").val() == "card_mode") {
                        table_reservation(msg.result.response[filter], 'card_mode');
                    }else{
                        table_reservation(msg.result.response[filter], 'table_mode');
                    }
                    document.getElementById('reservation_found').style.display = 'none';
//                    $('#reservation_found').hide();
                }
            }catch(err){
                //set_notification(msg.result.response.transport_booking);
            }
        }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
            auto_logout();
        }else{
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: #ff9900;">Error transactions </span>' + msg.result.error_msg,
            })
        }
        var radios = document.getElementsByName('filter');
        for (var j = 0, length = radios.length; j < length; j++) {
            if (radios[j].checked) {
                filter = radios[j].value;
            }
            radios[j].disabled = false;
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error transactions');
       },timeout: 60000
    });
}

function get_top_up_quota(){
    $.ajax({
       type: "POST",
       url: "/webservice/account",
       headers:{
            'action': 'get_top_up_quota',
       },
       data: {
        'signature': signature
       },
       success: function(msg) {
        top_up_amount_list = msg.result.response;
        if(msg.result.error_code == 0){
            text = '';
            for(i in msg.result.response.price_list){
                text += `<option value="`+msg.result.response.price_list[i].acquirer_seq_id+`" data-amount="`+msg.result.response.price_list[i].amount+`">`+getrupiah(msg.result.response.price_list[i].amount)+` - PNR for `+msg.result.response.price_list[i].validity_duration+` days</option>`;
            }
            document.getElementById('amount').innerHTML = text;
            document.getElementById('term_n_condition').innerHTML = 'Issued without package quota will be charge '+ msg.result.response.currency + ' ' + getrupiah(msg.result.response.excess_quota_fee);
            $('#amount').niceSelect('update');
            change_quota_top_up_price();
        }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
            auto_logout();
        }else{
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: #ff9900;">Error topup amount </span>' + msg.result.error_msg,
            })
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error top up amount');
       },timeout: 60000
    });
}

function change_quota_top_up_price(){
    for(i in top_up_amount_list.price_list){
        if(top_up_amount_list.price_list[i].acquirer_seq_id == document.getElementById('amount').value){
            document.getElementById('total_amount').value = top_up_amount_list.price_list[i].currency + ' ' + getrupiah(top_up_amount_list.price_list[i].price);
            break;
        }
    }
}

function check_top_up_quota(){
    error_log = '';
    if(document.getElementById('amount').value == '')
        error_log += 'Please fill amount quota!\n';
    if(error_log == ''){
        Swal.fire({
          title: 'Do you want to proceed this request?',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes'
        }).then((result) => {
          if (result.value)
                buy_quota_btbo2();
        })

    }else
        Swal.fire({
          type: 'error',
          title: 'Oops!',
          html: error_log,
        })
}

function buy_quota_btbo2(){
    $.ajax({
       type: "POST",
       url: "/webservice/account",
       headers:{
            'action': 'buy_quota_btbo2',
       },
       data: {
            'signature': signature,
            'acquirer_seq_id': document.getElementById('amount').value
       },
       success: function(msg) {
        if(msg.result.error_code == 0){
            Swal.fire({
              type: 'success',
              title: 'Success top up quota pnr!',
              html: 'Please Wait ...',
              timer: 50000,
              onBeforeOpen: () => {
                Swal.showLoading()
                timerInterval = setInterval(() => {
                  Swal.getContent().querySelector('strong')
                    .textContent = Swal.getTimerLeft()
                }, 100)
              },
              onClose: () => {
                clearInterval(timerInterval)
              }
            }).then((result) => {
              if (
                /* Read more about handling dismissals below */
                result.dismiss === Swal.DismissReason.timer
              ) {

              }
            })
            document.getElementById('top_up_form').submit();
        }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
            auto_logout();
        }else{
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: #ff9900;">Error top up quota pnr </span>' + msg.result.error_msg,
            })
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error top up amount');
       },timeout: 60000
    });
}

function change_top_up(){
    document.getElementById('amount').disabled = false;
//    document.getElementById('payment_method').disabled = false;
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
            'amount': document.getElementById('amount').value.split(',').join(''),
//            'amount_count': document.getElementById('qty').value,
//            'unique_amount': payment_acq2[payment_method][selected].price_component.unique_amount,
//            'acquirer_seq_id': payment_acq2[payment_method][selected].acquirer_seq_id,
            'signature': signature
       },
       success: function(msg) {
        if(msg.result.error_code == 0){
            document.getElementById('amount').disabled = true;
//            document.getElementById('payment_method').disabled = true;
            document.getElementById('tac_checkbox').disabled = true;
            document.getElementById('submit_name').innerHTML = 'Change';
            document.getElementById('submit_name').setAttribute( "onClick", "javascript: change_top_up();" );

            get_payment_acq('Issued','', '', 'top_up', signature, 'top_up','', '');
            document.getElementById('submit_name').disabled = false;
            setTimeout(function() {
                focus_box('payment_acq');
            }, 500);
//            document.getElementById('top_up_form').submit();
        }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
            auto_logout();
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
           error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error submit top up');
           document.getElementById('submit_top_up').classList.remove('running');
           document.getElementById('submit_top_up').disabled = false;
       },timeout: 60000
    });
}

function commit_top_up(){
    document.getElementById('submit_top_up').disabled = true;
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/account",
       headers:{
            'action': 'commit_top_up',
       },
       data: {
            'member': payment_acq2[payment_method][selected].method,
            'acquirer_seq_id': payment_acq2[payment_method][selected].acquirer_seq_id,
            'signature': signature
       },
       success: function(msg) {
        if(msg.result.error_code == 0){
            document.getElementById('top_up_form').submit();
        }else{
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: #ff9900;">Error commit topup </span>' + msg.result.error_msg,
            }).then((result) => {
                if (result.value) {
                    document.getElementById('top_up_form').submit();
                }
            });


        }

       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error commit top up');
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
            document.getElementById("table_top_up_history").innerHTML = '';
    //        document.getElementById("payment_acq").innerHTML = '';
    //        document.getElementById("payment_acq").style = 'padding-bottom:20px;';
            get_top_up();
    //        document.getElementById('top_up_form').submit();
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error cancel top up');
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
    state = '';
    name = '';
    start_date = '';
    end_date = '';
    type = '';
    document.getElementById('button').disabled = true;
    var radios = document.getElementsByName('filter');
    for (var j = 0, length = radios.length; j < length; j++) {
        if (radios[j].checked) {
            type = radios[j].value;
            break;
        }
    }
    try{
        state = document.getElementById('state').value;
        start_date = moment(document.getElementById('start_date').value).format('YYYY-MM-DD');
        end_date = moment(document.getElementById('end_date').value).format('YYYY-MM-DD');
    }catch(err){
        console.log(err); // error kalau ada element yg tidak ada
    }
    try{
        name = document.getElementById('name').value;
    }catch(err){
        console.log(err); // error kalau ada element yg tidak ada
    }
    $('#loading-search-top-up').show();
    $.ajax({
       type: "POST",
       url: "/webservice/account",
       headers:{
            'action': 'get_top_up',
       },
       data: {
            'signature': signature,
            'name': name,
            'state': state,
            'start_date': start_date,
            'end_date': end_date,
            'type': 'all'
       },
       success: function(msg) {
        document.getElementById('button').disabled = false;
        data_length = 0;
        text = '';
        //edit here
        for(i in msg.result.response){
            str = i;
            if(i == 'top up')
                text += `<label class="radio-button-custom">
                        <span>`+str.charAt(0).toUpperCase()+str.slice(1).toLowerCase()+`</span>
                        <input type="radio" checked="checked" name="filter" value="`+str+`" onclick="table_top_up_history();">
                        <span class="checkmark-radio"></span>
                    </label>`;
            else if(agent_security.includes('pnr_quota') == true)
                text += `<label class="radio-button-custom">
                        <span>`+str.charAt(0).toUpperCase()+str.slice(1).toLowerCase()+`</span>
                        <input type="radio" name="filter" value="`+str+`" onclick="table_top_up_quota_history();">
                        <span class="checkmark-radio"></span>
                    </label>`;
            if(i == 'top_up'){
                for(j in msg.result.response[i])
                    if(msg.result.response[i][j].due_date != ''){
                        tes = moment.utc(msg.result.response[i][j].due_date).format('YYYY-MM-DD HH:mm:ss')
                        var localTime  = moment.utc(tes).toDate();
                        msg.result.response[i][j].due_date = moment(localTime).format('DD MMM YYYY HH:mm');
                    }
            }else{
                for(j in msg.result.response[i]){
                    if(msg.result.response[i][j].expired_date != ''){
                        msg.result.response[i][j].expired_date = moment(msg.result.response[i][j].expired_date).format('DD MMM YYYY');
                    }
                }
            }
            data_length++;
        }
        top_up_history = msg.result.response;
        type = '';
        try{
            var radios = document.getElementsByName('filter');
            for (var j = 0, length = radios.length; j < length; j++) {
                if (radios[j].checked) {
                    // do whatever you want with the checked radio
                    company = radios[j].value;
                    // only one radio can be logically checked, don't check the rest
                    break;
                }
            }
        }catch(err){
            console.log(err); // error kalau ada element yg tidak ada
        }
        if(type == '')
            document.getElementById('type').innerHTML = text;
        if(msg.result.error_code == 0){
            type = '';
            var radios = document.getElementsByName('filter');
            for (var j = 0, length = radios.length; j < length; j++) {
                if (radios[j].checked) {
                    // do whatever you want with the checked radio
                    type = radios[j].value;
                    // only one radio can be logically checked, don't check the rest
                    break;
                }
            }
            if(type == 'top up')
                table_top_up_history();
            else
                table_top_up_quota_history();
        }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
            auto_logout();
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
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error top up');
            $('#loading-search-top-up').hide();
       },timeout: 60000
    });
}

function confirm_top_up(name){
    Swal.fire({
      title: 'Already pay for this top up?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
        if (result.value){
            $.ajax({
               type: "POST",
               url: "/webservice/account",
               headers:{
                    'action': 'confirm_top_up',
               },
               data: {
                    'name': name,
                    'signature': signature
               },
               success: function(msg) {
                document.getElementById("table_top_up_history").innerHTML = '';
                get_top_up();
        //        document.getElementById('top_up_form').submit();
               },
               error: function(XMLHttpRequest, textStatus, errorThrown) {
                    error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error confirm top up');
               },timeout: 60000
            });
        }
    })
}

function request_top_up(val){
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
        document.getElementById("table_top_up_history").innerHTML = '';
        document.getElementById("payment_acq").innerHTML = '';
        document.getElementById("payment_acq").style = 'padding-bottom:20px;';
        get_top_up();
//        document.getElementById('top_up_form').submit();
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error request top up');
       },timeout: 60000
    });
}

function table_top_up_history(){
    data = top_up_history['top up'];
    document.getElementById('table_top_up_history').innerHTML = '';
    text= '';
    data_counter = 0;
    if(data.length != 0){
        $('#top_up_found').hide();
        for(i in data){
            data_search.push(data[i]);
            text+=`
            <form action="" method="POST" id="gotobooking`+data_counter+`" style="width:100%; margin-bottom:30px;"/>
            <div class="col-lg-12" style="background:white; border:1px solid #cdcdcd; width:100%; padding:15px 15px 0px 15px;">
                <div class="row">
                    <div class="col-lg-6 mb-3">
                        <h5 class="single_border_custom_left" style="padding-left:10px;">
                            `+(parseInt(i)+1)+`.
                            <span name="order_number" style="padding-right:5px;">`+data[i].name+` </span>
                            <img src="/static/tt_website_rodextrip/images/icon/wallet_black.png" alt="Top Up" style="width:15px; height:15px;">
                        </h5>
                    </div>

                    <div class="col-lg-6 mb-3" style="text-align:right;">
                        <b style="padding-right:10px;"><i>State:</b></i>`;
                            if(data[i].state_description == 'Validated'){
                                text+=`<b style="background:#30b330; font-size:13px; color:white; padding:5px 15px; display:unset; border-radius:7px;">`;
                            }else if(data[i].state_description == 'Approved'){
                                text+=`<b style="background:#3fa1e8; font-size:13px; color:white; padding:5px 15px; display:unset; border-radius:7px;">`;
                            }else if(data[i].state_description == 'Request' || data[i].state_description == 'Draft'){
                                text+=`<b style="background:#8c8d8f; font-size:13px; color:white; padding:5px 15px; display:unset; border-radius:7px;">`;
                            }else if(data[i].state_description == 'Expired' || data[i].state_description == 'Cancelled'){
                                text+=`<b style="background:#DC143C; font-size:13px; color:white; padding:5px 15px; display:unset; border-radius:7px;">`;
                            }else{
                                text+=`<b>`;
                            }
                            text+=``+data[i].state_description+`
                        </b>
                    </div>
                    <div class="col-lg-4" style="border-bottom: 1px solid #cdcdcd; padding: 15px;">
                        <span><b>Create Date</b><br/>`;
                        if(data[i].date == false){
                            text+= `<i>-</i>`;
                        }
                        else{
                            text+= `<i>`+moment(data[i].date).format('ddd, DD MMM YYYY HH:mm:ss')+`</i>`;
                        }
                        text+=`</span>
                    </div>
                    <div class="col-lg-4" style="border-bottom: 1px solid #cdcdcd; padding: 15px;">
                        <span><b>Due Date</b><br/>`;
                        if(data[i].due_date == false){
                            text+= `<i>-</i>`;
                        }
                        else{
                            text+= `<i>`+moment(data[i].due_date).format('ddd, DD MMM YYYY HH:mm:ss')+`</i>`;
                        }
                        text+=`</span>
                    </div>
                    <div class="col-lg-4" style="border-bottom: 1px solid #cdcdcd; padding: 15px;">
                        <span><b>Help by</b><br/>`;
                        if(data[i].hasOwnProperty('help_by') == true && data[i].help_by != ""){
                            text+= `<i>`+data[i].help_by+`</i>`;
                        }
                        else{
                            text+= `<i>-</i>`;
                        }
                        text+=`</span>
                    </div>
                    <div class="col-lg-4" style="padding: 15px;">
                        <span><b>Payment Method</b><br/><i>`+data[i].payment_method+`</i></span>
                    </div>
                    <div class="col-lg-4" style="padding: 15px;">
                        <span><b>Amount</b><br/><i>`+data[i].currency_code+' '+getrupiah(data[i].total)+`</i></span>
                    </div>`;

                    text+= `<div class="col-lg-4" style="text-align:right; padding: 15px;">`;
                    if(data[i].state == 'request' || data[i].state == 'confirm'){
                        text+= `
                        <input type='button' class="primary-btn-custom" value='Cancel' onclick="cancel_top_up('`+data[i].name+`')" />
                        <input type='button' style="margin-top:5px;" class="primary-btn-custom" value='Pre Invoice' onclick="get_printout('`+data[i].name+`', 'invoice','top_up');" />`;
                    }
                    if(data[i].state == 'confirm'){
                        text+= `
                        <input type='button' style="margin-top:5px;" class="primary-btn-custom" value='Payment' onclick="confirm_top_up('`+data[i].name+`')" />`;
                    }
                    if(data[i].state == 'approved'){
                        text+= `
                        <input type='button' style="margin-top:5px;" class="primary-btn-custom" value='Invoice' onclick="get_printout('`+data[i].name+`', 'invoice','top_up');" />`;
                    }
                    text+=`
                    </div>
                </div>
            </div>`;

            document.getElementById("table_top_up_history").innerHTML += text;
            $('#loading-search-top-up').hide();
    //                   document.getElementById('airlines_ticket').innerHTML += text;
            text = '';
            data_counter++;
        }
    }else{
        $('#loading-search-top-up').hide();
        $('#top_up_found').show();
    }
}

function table_top_up_quota_history(){
    data = top_up_history['quota'];
    document.getElementById('table_top_up_history').innerHTML = `<tr>
                    <th style="width:5%;">No.</th>
                    <th style="width:20%;">Quota Package</th>
                    <th style="width:20%;">Used Amount</th>
                    <th style="width:15%;">Available Amount</th>
                    <th style="width:15%;">Expired Date</th>
                    <th style="width:15%;">Status</th>
                </tr>`;
    text= '';
    var node = document.createElement("tr");
    data_counter = 0;
    if(data.length != 0){
        $('#top_up_found').hide();
        for(i in data){
            data_search.push(data[i]);
            text+=`
            <tr>
                <td>`+(parseInt(i)+1)+`</td>
                <td>`+data[i].name+`</td>`;

            text+= `<td>`+data[i].used_amount+`</td>`;
            text+= `<td style="text-align:right">`+data[i].available_amount+`</td>`;
            text+= `<td>`+data[i].expired_date+`</td>`;
            text+= `<td>`+data[i].state+`</td>`;
            text+= `</tr>`;
            node.innerHTML = text;
            document.getElementById("table_top_up_history").appendChild(node);
            node = document.createElement("tr");
            $('#loading-search-top-up').hide();
    //                   document.getElementById('airlines_ticket').innerHTML += text;
            text = '';
            data_counter++;
        }
    }else{
        $('#loading-search-top-up').hide();
        $('#top_up_found').show();
    }
}

function total_price_top_up(evt){
//    for(i in top_up_amount_list){
//        if(top_up_amount_list[i].seq_id == document.getElementById('amount').value){
//            document.getElementById('total_amount').value = "IDR "+getrupiah(top_up_amount_list[i].amount);
//            break;
//        }
//    }
    var check = 0;
    if(document.getElementById('amount').value == '')
        check = 1;
    var amount = document.getElementById('amount').value.split(',');
    amount = amount.join('');
    document.getElementById('amount').value = getrupiah(amount);
    document.getElementById('total_amount').value = "IDR "+document.getElementById('amount').value;
    try{
        document.getElementById('payment_method_price').innerHTML = payment_acq2[payment_method][selected].currency+` `+getrupiah(document.getElementById('amount').value);
        document.getElementById('payment_method_grand_total').innerHTML = payment_acq2[payment_method][selected].currency+` `+getrupiah(document.getElementById('amount').value + payment_acq2[payment_method][selected].price_component.unique_amount);
    }catch(err){
    }
    if(document.getElementById('amount').value == '' && check ==0)
        Swal.fire({
          type: 'error',
          title: 'Oops!',
          html: '<span style="color: #ff9900;">Please input numeric only </span>' ,
        })
//    $('#amount').niceSelect('update');
}

function check_top_up(){
    document.getElementById('submit_name').disabled = true;
    error_text = '';
    if(document.getElementById('tac_checkbox').checked == false){
        error_text += 'Please check Term and Conditions\n';
    }

    if(document.getElementById('amount').value == ''){
        error_text += 'Please Input Amount\n';
    }
    try{
        if(document.getElementById('amount').value.split(',')[document.getElementById('amount').value.split(',').length-1] != '000'){
            error_text += 'Please input last 3 digits amount 000\n';
        }
        else if(parseInt(document.getElementById('amount').value.split(',').join('')) < 50000){
            error_text += 'Amount (Min Top Up Amount IDR 50,000)\n';
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
          if (result.value) {
            $('.loader-rodextrip').fadeIn();
            $('.payment_acq_btn').prop('disabled', true);
            $('.payment_acq_btn').addClass("running");
            $("#loading_payment_acq").show();
            submit_top_up();

          }else{
            $('.loader-rodextrip').fadeIn();
            $('#submit_top_up').prop('disabled', false);
            $('#submit_top_up').removeClass('running');
            document.getElementById('submit_name').disabled = false;
          }
        })

    }else{
        document.getElementById('submit_name').disabled = false;
        Swal.fire({
          type: 'error',
          title: 'Oops!',
          html: error_text //'<span style="color: #ff9900;">Error check topup</span>' + error_text,
        })
    }
}

function get_payment_acquirer_top_up(val){
    top_up_value = val;
    get_payment_acq('Confirm','', '', 'top_up', signature, 'top_up','HO.1636001', '');
}

function get_vendor_balance(val){
    using_cache = '';
    if(val != undefined)
        using_cache = val;
    $.ajax({
       type: "POST",
       url: "/webservice/account",
       headers:{
            'action': 'get_vendor_balance',
       },
       data: {
            'signature': signature,
            'using_cache': using_cache
       },
       success: function(msg) {
        text_balance = '';
        if(msg.result.error_code == 0){
            text_balance += `
            <div class="col-lg-12 mb-3">
                <h6 class="mb-2">My Balance</h6>
                <div style="border: 1px solid #cdcdcd; border-radius:14px; padding:10px;" id="my_balance">

                </div>
            </div>

            <div class="col-lg-12">
            <h6>Balance Vendor</h6>
            <div class="row">`;
            for(blc in msg.result.response.data){
                text_balance += `<div class="col-lg-6 col-md-6 mt-2 mb-2">
                <div style="border: 1px solid #cdcdcd; border-radius:14px; padding:10px;">`;
                    if(msg.result.response.data[blc].provider_type == "airline"){
                        text_balance += `<img src="/static/tt_website_rodextrip/images/icon/airlines_black.png" alt="`+msg.result.response.data[blc].code+` `+msg.result.response.data[blc].code+`" style="width:15px; height:15px;">`;
                    }else if(msg.result.response.data[blc].provider_type == "train"){
                        text_balance += `<img src="/static/tt_website_rodextrip/images/icon/train_black.png" alt="`+msg.result.response.data[blc].code+` `+msg.result.response.data[blc].code+`" style="width:15px; height:15px;">`;
                    }else if(msg.result.response.data[blc].provider_type == "hotel"){
                        text_balance += `<img src="/static/tt_website_rodextrip/images/icon/hotel_black.png" alt="`+msg.result.response.data[blc].code+` `+msg.result.response.data[blc].code+`" style="width:15px; height:15px;">`;
                    }else if(msg.result.response.data[blc].provider_type == "activity"){
                        text_balance += `<img src="/static/tt_website_rodextrip/images/icon/activity_black.png" alt="`+msg.result.response.data[blc].code+` `+msg.result.response.data[blc].code+`" style="width:15px; height:15px;">`;
                    }else if(msg.result.response.data[blc].provider_type == "tour"){
                        text_balance += `<img src="/static/tt_website_rodextrip/images/icon/tour_black.png" alt="`+msg.result.response.data[blc].code+` `+msg.result.response.data[blc].code+`" style="width:15px; height:15px;">`;
                    }else if(msg.result.response.data[blc].provider_type == "visa"){
                        text_balance += `<img src="/static/tt_website_rodextrip/images/icon/visa_black.png" alt="`+msg.result.response.data[blc].code+` `+msg.result.response.data[blc].code+`" style="width:15px; height:15px;">`;
                    }else if(msg.result.response.data[blc].provider_type == "passport"){
                        text_balance += `<img src="/static/tt_website_rodextrip/images/icon/passport_black.png" alt="`+msg.result.response.data[blc].code+` `+msg.result.response.data[blc].code+`" style="width:15px; height:15px;">`;
                    }else if(msg.result.response.data[blc].provider_type == "ppob"){
                        text_balance += `<img src="/static/tt_website_rodextrip/images/icon/ppob_black.png" alt="`+msg.result.response.data[blc].code+` `+msg.result.response.data[blc].code+`" style="width:15px; height:15px;">`;
                    }else if(msg.result.response.data[blc].provider_type == "event"){
                        text_balance += `<img src="/static/tt_website_rodextrip/images/icon/event_black.png" alt="`+msg.result.response.data[blc].code+` `+msg.result.response.data[blc].code+`" style="width:15px; height:15px;">`;
                    }
                    text_balance += `
                        <span style="text-transform: capitalize; font-size:14px; font-weight:500;">`+msg.result.response.data[blc].code+`</span><br/>
                        <img src="/static/tt_website_rodextrip/images/icon/wallet_black.png" alt="Balance Vendor" style="width:15px; height:15px;">
                        <span style="font-size:14px; color:`+color+`; font-weight:500;">`+msg.result.response.data[blc].currency+` `+getrupiah(msg.result.response.data[blc].balance)+`</span>
                    </div>
                </div>`;
            }
            tes = moment.utc(msg.result.response.cache_time).format('YYYY-MM-DD HH:mm')
            localTime  = moment.utc(tes).toDate();
            data_gmt = moment(msg.result.response.cache_time)._d.toString().split(' ')[5];
            gmt = data_gmt.replace(/[^a-zA-Z+-]+/g, ''); //ambil gmt
            timezone = data_gmt.replace (/[^\d.]/g, ''); //ambil timezone
            timezone = timezone.split('') //split per char
            timezone = timezone.filter(item => item !== '0') //hapus angka 0 di timezone
            text_balance += `</div>
            <span style="text-transform: capitalize; font-size:14px; font-weight:500;">Last cache `+moment(localTime).format('DD MMM YYYY HH:mm') + ' ' + gmt + timezone+`</span>
            </div>`;
            document.getElementById("balance_content").innerHTML = text_balance;
            vendor_balance_check = 1;
        }else{
            vendor_balance_check = 0;
        }
        get_balance(val);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            vendor_balance_check = 0;
            get_balance(val);
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get vendor balance');
       },timeout: 60000
    });
}

function print_commission(commission,id,currency='IDR',id_span=''){
    var print_commission_text = '';
    var data_commission = commission;
    if(data_commission < 0)
        data_commission = data_commission *-1;
    print_commission_text+=`
        <div class="row" id="`+id+`" style="display:block;">
            <div class="col-lg-12 col-xs-12">
                <div class="alert alert-success">
                    <div style="text-align:center;">
                        <span `;
    if(id_span != '')
        print_commission_text+='id="'+id_span+'" ';
    if(data_commission != 0)
        print_commission_text+=`style="font-size:13px;font-weight: bold;">YPM: `+currency+` `+getrupiah(parseInt(data_commission))+`</span>
                    </div>`;
    else
        print_commission_text+=`style="font-size:13px;font-weight: bold;color:red;">YPM: `+currency+` `+getrupiah(parseInt(data_commission))+`</span>
                    </div>`;
            if(data_commission == 0)
                print_commission_text+=`
                    <div style="text-align:left;">
                        <span style="font-size:13px;color:red;">* Please mark up the price first</span>
                    </div>`;
            print_commission_text+=`
                </div>
            </div>
        </div>`;
    return print_commission_text;
}

var passenger_dict = {};
function init_upload(passenger_type, passenger_number) {
    if(passenger_type in passenger_dict == false){
        passenger_dict[passenger_type] = [];
    }
    document.querySelector('#'+passenger_type+'_files_attachment_identity'+passenger_number).addEventListener('change', FileSelect_attachment.bind(event, passenger_type, passenger_dict[passenger_type].length, 'identity'), false);
    passenger_dict[passenger_type].push(['', document.querySelector('#selectedFiles_'+passenger_type+'_files_identity'+passenger_number) ? document.querySelector('#selectedFiles_'+passenger_type+'_files_identity'+passenger_number) : '']);

}

function FileSelect_attachment(passenger_type, passenger_number, type,e) {
    if(!e.target.files || !window.FileReader) return;
    if(type == 'identity')
        passenger_dict[passenger_type][passenger_number][1].innerHTML = "";
    else
        passenger_dict[passenger_type][passenger_number][0].innerHTML = "";
    var files = e.target.files;
    var filesArr = Array.prototype.slice.call(files);
    filesArr.forEach(function(f) {
        if(!f.type.match("image.*")) {
            return;
        }

        var reader = new FileReader();
        reader.onload = function (e) {
            var html = "<img style='width:20vh;border-radius:20vh;padding-bottom:5px;' src=\"" + e.target.result + "\">" + f.name + "<br clear=\"left\"/>";
            if(type == 'identity'){
                if(passenger_dict[passenger_type][passenger_number][1].innerHTML == '')
                    html = '<h5>Selected File</h5>' + html;
                passenger_dict[passenger_type][passenger_number][1].innerHTML += html;
            }else{
                if(passenger_dict[passenger_type][passenger_number][0].innerHTML == '')
                    html = '<h5>Selected File</h5>' + html;
                passenger_dict[passenger_type][passenger_number][0].innerHTML += html;
            }
        }
        reader.readAsDataURL(f);

    });
}

function transaction_history_click_search(){
    temp_date_history = '';
}

function render_notification(){
    document.getElementById('notification_detail').innerHTML = '';

    check_notif = 0;

//    $("#loading-search-notification").show();
    if(document.getElementById('provider_notification').innerHTML == ''){
        document.getElementById('provider_notification').innerHTML = '';
        text_provider = `
        <label class="radio-label" style="width:120px; cursor:pointer;">
            <input type="radio" name="provider_notification_radio" value="all_provider" checked onchange="render_notification()">
            <div class="div_radio_img_txt" style="text-transform: capitalize;">
                <h6 style="font-size:20px; font-weight:bold;">ALL</h6><br/>Provider
            </div>
        </label>`;
        provider_type_list_notification = [];
        for(i in render_data_notification){
            provider_type_list_notification.push(render_data_notification[i].provider_type);
        }
        provider_type_unique = [...new Set(provider_type_list_notification)];

        for(i in provider_type_unique){
            text_provider += `
            <label class="radio-label" style="width:120px; cursor:pointer;">
                <input type="radio" name="provider_notification_radio" value="`+provider_type_unique[i]+`" onchange="render_notification()">
                <div class="div_radio_img_txt" style="text-transform: capitalize;">`;

                if(provider_type_unique[i] == "airline"){
                    text_provider += `<img src="/static/tt_website_rodextrip/images/icon/airlines_black.png" alt="`+render_data_notification[i].name+`" style="width:20px; height:20px;">`;
                }else if(provider_type_unique[i] == "train"){
                    text_provider += `<img src="/static/tt_website_rodextrip/images/icon/train_black.png" alt="`+render_data_notification[i].name+`" style="width:20px; height:20px;">`;
                }else if(provider_type_unique[i] == "hotel"){
                    text_provider += `<img src="/static/tt_website_rodextrip/images/icon/hotel_black.png" alt="`+render_data_notification[i].name+`" style="width:20px; height:20px;">`;
                }else if(provider_type_unique[i] == "activity"){
                    text_provider += `<img src="/static/tt_website_rodextrip/images/icon/activity_black.png" alt="`+render_data_notification[i].name+`" style="width:20px; height:20px;">`;
                }else if(provider_type_unique[i] == "tour"){
                    text_provider += `<img src="/static/tt_website_rodextrip/images/icon/tour_black.png" alt="`+render_data_notification[i].name+`" style="width:20px; height:20px;">`;
                }else if(provider_type_unique[i] == "visa"){
                    text_provider += `<img src="/static/tt_website_rodextrip/images/icon/visa_black.png" alt="`+render_data_notification[i].name+`" style="width:20px; height:20px;">`;
                }else if(provider_type_unique[i] == "passport"){
                    text_provider += `<img src="/static/tt_website_rodextrip/images/icon/passport_black.png" alt="`+render_data_notification[i].name+`" style="width:20px; height:20px;">`;
                }else if(provider_type_unique[i] == "ppob"){
                    text_provider += `<img src="/static/tt_website_rodextrip/images/icon/ppob_black.png" alt="`+render_data_notification[i].name+`" style="width:20px; height:20px;">`;
                }else if(provider_type_unique[i] == "event"){
                    text_provider += `<img src="/static/tt_website_rodextrip/images/icon/event_black.png" alt="`+render_data_notification[i].name+`" style="width:20px; height:20px;">`;
                }else if(provider_type_unique[i] == "bus"){
                    text_provider += `<img src="/static/tt_website_rodextrip/images/icon/bus_black.png" alt="`+render_data_notification[i].name+`" style="width:20px; height:20px;">`;
                }else if(provider_type_unique[i] == "insurance"){
                    text_provider += `<img src="/static/tt_website_rodextrip/images/icon/insurance_black.png" alt="`+render_data_notification[i].name+`" style="width:20px; height:20px;">`;
                }else if(provider_type_unique[i] == "offline"){
                    text_provider += `<img src="/static/tt_website_rodextrip/images/icon/offline_black.png" alt="`+render_data_notification[i].name+`" style="width:auto; height:20px;">`;
                }else if(provider_type_unique[i] == "groupooking"){
                    text_provider += `<img src="/static/tt_website_rodextrip/images/icon/groupbooking_black.png" alt="`+render_data_notification[i].name+`" style="width:auto; height:20px;">`;
                }else if(provider_type_unique[i] == "mitrakeluarga"){
                    text_provider += `<img src="/static/tt_website_rodextrip/images/icon/mitra_keluarga.png" alt="`+render_data_notification[i].name+`" style="width:auto; height:20px;">`;
                }else if(provider_type_unique[i] == "phc"){
                    text_provider += `<img src="/static/tt_website_rodextrip/images/icon/phc_logo.png" alt="`+render_data_notification[i].name+`" style="width:auto; height:20px;">`;
                }else if(provider_type_unique[i] == "labpintar"){
                    text_provider += `<img src="/static/tt_website_rodextrip/images/icon/lab_pintar.png" alt="`+render_data_notification[i].name+`" style="width:auto; height:20px;">`;
                }else if(provider_type_unique[i] == "sentramedika"){
                    text_provider += `<img src="/static/tt_website_rodextrip/images/icon/sentra_medika.png" alt="`+render_data_notification[i].name+`" style="width:auto; height:20px;">`;
                }else if(provider_type_unique[i] == "periksain"){
                    text_provider += `<img src="/static/tt_website_rodextrip/images/icon/periksain.png" alt="`+render_data_notification[i].name+`" style="width:auto; height:20px;">`;
                }else{
                    text_provider += `<img src="/static/tt_website_rodextrip/images/icon/wallet_black.png" alt="`+render_data_notification[i].name+`" style="width:20px; height:20px;">`;
                }

            text_provider += `
                    <br/> `+provider_type_unique[i]+`
                </div>
            </label>`;
        }
        document.getElementById('provider_notification').innerHTML = text_provider;
    }



    value_provider_notif = $("input[name='provider_notification_radio']:checked").val();

    for(i in render_data_notification){

        print_provider = false;
        if(render_data_notification[i].provider_type == value_provider_notif){
            print_provider = true;
        }else{
            if(value_provider_notif == 'all_provider'){
                print_provider = true;
            }
        }

        print_notif = false;
        if ($("input[name='filter_notification']:checked").val() == "all_notification"){
            print_notif = true;
        }else if($("input[name='filter_notification']:checked").val() == "snooze_notification"){
            if(render_data_notification[i].snooze_days > 0){
                print_notif = true;
            }
        }else if($("input[name='filter_notification']:checked").val() == "snooze_notification"){
            if(render_data_notification[i].snooze_days > 0){
                print_notif = true;
            }
        }else if($("input[name='filter_notification']:checked").val() == "unread_notification"){
            if(render_data_notification[i].is_read == false){
                print_notif = true;
            }
        }else if($("input[name='filter_notification']:checked").val() == "read_notification"){
            if(render_data_notification[i].is_read == true){
                print_notif = true;
            }
        }

        if(print_notif && print_provider){
            check_notif++;
            url_goto = '';
            if(render_data_notification[i].provider_type == 'airline'){
                url_goto = '/airline/booking/';
            }else if(render_data_notification[i].provider_type == 'train'){
                url_goto = '/train/booking/';
            }else if(render_data_notification[i].provider_type == 'activity'){
                url_goto = '/activity/booking/';
            }else if(render_data_notification[i].provider_type == 'hotel'){
                url_goto = '/hotel/booking/';
            }else if(render_data_notification[i].provider_type == 'visa'){
                url_goto = '/visa/booking/';
            }else if(render_data_notification[i].provider_type == 'tour'){
                url_goto = '/tour/booking/';
            }else if(render_data_notification[i].provider_type == 'offline'){
                url_goto = '/issued_offline/booking/';
            }else if(render_data_notification[i].provider_type == 'passport'){
                url_goto = '/passport/booking/';
            }else if(render_data_notification[i].provider_type == 'ppob'){
                url_goto = '/ppob/booking/';
            }else if(render_data_notification[i].provider_type == 'event'){
                url_goto = '/event/booking/';
            }else if(render_data_notification[i].provider_type == 'periksain' || render_data_notification[i].provider_type == 'phc'){
                url_goto = '/medical/booking/';
            }else if(render_data_notification[i].provider_type == 'medical'){
                url_goto = '/medical_global/booking/';
            }else if(render_data_notification[i].provider_type == 'bus'){
                url_goto = '/bus/booking/';
            }else if(render_data_notification[i].provider_type == 'swabexpress'){
                url_goto = '/swab_express/booking/';
            }else if(render_data_notification[i].provider_type == 'labpintar'){
                url_goto = '/lab_pintar/booking/';
            }else if(render_data_notification[i].provider_type == 'mitrakeluarga'){
                url_goto = '/mitra_keluarga/booking/';
            }else if(render_data_notification[i].provider_type == 'insurance'){
                url_goto = '/insurance/booking/';
            }else if(render_data_notification[i].provider_type == 'groupbooking'){
                url_goto = '/groupbooking/booking/';
            }
            text = '';
            text+=`
            <div class="col-lg-12" style="cursor:pointer;">
                <div class="row">
                    <div class="col-xs-10" style="cursor:pointer;">
                        <form action="`+url_goto+btoa(render_data_notification[i].name)+`" method="post" id="notification_`+check_notif+`" onclick="set_csrf_notification(`+check_notif+`)">
                            <div class="row">
                                <div class="col-xs-12">`;
                                    if(render_data_notification[i].is_read == false){
                                        text+=`<span style="font-weight:700; font-size:16px;"> `+check_notif+`. `+render_data_notification[i].name;
                                        if(render_data_notification[i].pnr)
                                            text+=` - `+render_data_notification[i].pnr+`</span>`;
                                    }else{
                                        text+=`<span style="font-weight:400; color:#808080; font-size:16px;"> `+check_notif+`. `+render_data_notification[i].name;
                                        if(render_data_notification[i].pnr)
                                            text+=` - `+render_data_notification[i].pnr+`</span>`;
                                    }
                                    text+=`<br/>`;
                                    if(render_data_notification[i].is_read == false){
                                        text+=`<span style="font-size:13px; text-transform: capitalize;">`+render_data_notification[i].provider_type+`</span>`;
                                    }else{
                                        text+=`<span style="color:#808080; font-size:13px; text-transform: capitalize;">`+render_data_notification[i].provider_type+`</span>`;
                                    }
                                text+=`
                                </div>
                                <div class="col-xs-12">
                                    <span `;
                                    if(render_data_notification[i].is_read)
                                        text+= `style="color:#808080;"`;
                                    text+=`>`+render_data_notification[i].description.msg.replaceAll('\n','<br/>');
                                    if(render_data_notification[i].description.datetime != ''){
                                        tes = moment.utc(render_data_notification[i].description.datetime).format('YYYY-MM-DD HH:mm:ss')
                                        localTime  = moment.utc(tes).toDate();
                                        render_data_notification[i].description.datetime = moment(localTime).format('DD MMM YYYY HH:mm');
                                        text += ' before ' + render_data_notification[i].description.datetime;
                                    }
                                    text+=`</span>`;
                                text+=`
                                </div>
                            </div>
                            <input type="hidden" id="order_number_notif`+check_notif+`" name="order_number_notif`+check_notif+`" value="`+render_data_notification[i].name+`">
                            <input type="hidden" id="desc_notif`+check_notif+`" name="desc_notif`+check_notif+`" value="`+render_data_notification[i].description+`">
                        </form>
                    </div>
                    <div class="col-xs-2" style="text-align:right; cursor:pointer;">`;
                        if(render_data_notification[i].is_read == false)
                            text += `<i class="fas fa-circle" style="color:`+color+`; font-size:16px;"></i>`;
                    text+=`
                    </div>
                    <div class="col-lg-12 mb-1"></div>
                    <div class="col-xs-12" style="text-align:right;" id="snooze_div_datetime`+check_notif+`">`;
                    if(render_data_notification[i].snooze_days > 0){
                        text+=`
                        <i><i class="fas fa-clock" style="color:#808080; font-size:16px;"></i> Snooze until <i style="color:`+color+`;">`+moment(render_data_notification[i].create_date).subtract(render_data_notification[i].snooze_days * -1, 'days').format('DD MMMM YYYY')+`</i></i>`;
                    }
                    text+=`
                    </div>
                    <div class="col-xs-12" style="text-align:right; font-weight:500;" id="notif_button_span`+check_notif+`">`;
                    if(render_data_notification[i].snooze_days == 0 && render_data_notification[i].last_snooze_date){
                        text+=`
                        <span class="notification-hover" onclick="show_snooze(`+check_notif+`,'`+render_data_notification[i].last_snooze_date+`','`+render_data_notification[i].create_date+`',`+i+`)">
                            Snooze
                            <i class="fas fa-bell" style="font-size:14px;"></i>
                        </span>`;
                    }
                    else if(render_data_notification[i].snooze_days != 0){
                        text+=`
                        <span class="notification-hover" style="font-size:14px; padding-right:10px; color:#DC143C;" onclick="set_unsnooze_notification(`+check_notif+`,'`+render_data_notification[i].last_snooze_date+`','`+render_data_notification[i].create_date+`',`+i+`)">
                            Cancel
                            <i class="fas fa-times" style="font-size:14px;"></i>
                        </span>`;
                        text+=`
                        <span class="notification-hover" style="font-size:14px;" onclick="show_snooze(`+check_notif+`,'`+render_data_notification[i].last_snooze_date+`','`+render_data_notification[i].create_date+`',`+i+`)">
                            Edit
                            <i class="fas fa-pen" style="font-size:14px;"></i>
                        </span>`;
                    }
                    text+=`
                    </div>`;

                    text += `
                    </div>
                </div>
                <div class="col-lg-12">
                    <hr/>
                </div>
            </div>`;
            document.getElementById('notification_detail').innerHTML += text;
            $(".bell_notif").addClass("infinite");
            $(".bell_notif").css("color", color);
        //                              document.getElementById('notification_detail2').innerHTML += text;
        }
    }
}