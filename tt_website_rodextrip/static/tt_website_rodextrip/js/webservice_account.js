offset_transaction = 0;

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
                    if(window.location.href.split('/').length < 5)
                        get_transactions_notification(val);
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

function get_transactions_notification(val){
    limit_transaction = 10;
    using_cache = '';
    if(signature != ''){
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
                'type': 'all',
                'state': 'booked',
                'start_date': '',
                'end_date': '',
                'name': '',
                'booker_name': '',
                'passenger_name': '',
                'pnr': '',
                'using_cache': using_cache
           },
           success: function(msg) {
           try{
                document.getElementById('notification_detail').innerHTML = '';
    //            document.getElementById('notification_detail2').innerHTML = '';
                if(msg.result.error_code == 0){
                    text = '';
                    var hold_date = '';
                    var date = '';
                    var check_notif = 0;
                    var timeout_notif = 5000;
                    var today = new Date();
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
                        for(i in msg.result.response){
                            for(j in msg.result.response[i]){
                                hold_date = '';
                                if(check_notif == 5)
                                    break;
                                if(msg.result.response[i][j].hold_date != ''){
                                    date = moment.utc(msg.result.response[i][j].hold_date).format('YYYY-MM-DD HH:mm:ss');
                                    var localTime  = moment.utc(date).toDate();

                                    hold_date = moment(localTime).format('DD MMM YYYY HH:mm');
                                    if(window.location.href.split('/')[window.location.href.split('/').length-1] == "dashboard" && check_notif < 5){
                                        document.getElementById('notification_div').innerHTML +=`
                                            <div id="alert`+check_notif+`">
                                                <div class="alert alert-warning" role="alert">
                                                  <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                                  <strong>Hurry pay for this booking!</strong> `+msg.result.response[i][j].order_number + ' - ' + hold_date+`
                                                </div>
                                            </div>`;
                                    }
                                    check_notif++;
                                    url_goto = '';
                                    if(msg.result.response[i][j].provider_type == 'airline'){
                                        url_goto = '/airline/booking/';
                                    }else if(msg.result.response[i][j].provider_type == 'train'){
                                        url_goto = '/train/booking/';
                                    }else if(msg.result.response[i][j].provider_type == 'activity'){
                                        url_goto = '/activity/booking/';
                                    }else if(msg.result.response[i][j].provider_type == 'hotel'){
                                        url_goto = '/hotel/booking/';
                                    }else if(msg.result.response[i][j].provider_type == 'visa'){
                                        url_goto = '/visa/booking/';
                                    }else if(msg.result.response[i][j].provider_type == 'tour'){
                                        url_goto = '/tour/booking/';
                                    }else if(msg.result.response[i][j].provider_type == 'offline'){
                                        url_goto = '/issued_offline/booking/';
                                    }else if(msg.result.response[i][j].provider_type == 'passport'){
                                        url_goto = '/passport/booking/';
                                    }else if(msg.result.response[i][j].provider_type == 'ppob'){
                                        url_goto = '/ppob/booking/';
                                    }else if(msg.result.response[i][j].provider_type == 'event'){
                                        url_goto = '/event/booking/';
                                    }else if(msg.result.response[i][j].provider_type == 'periksain' || msg.result.response[i][j].provider_type == 'phc'){
                                        url_goto = '/medical/booking/';
                                    }else if(msg.result.response[i][j].provider_type == 'medical'){
                                        url_goto = '/medical_global/booking/';
                                    }else if(msg.result.response[i][j].provider_type == 'bus'){
                                        url_goto = '/bus/booking/';
                                    }else if(msg.result.response[i][j].provider_type == 'swabexpress'){
                                        url_goto = '/swab_express/booking/';
                                    }else if(msg.result.response[i][j].provider_type == 'labpintar'){
                                        url_goto = '/lab_pintar/booking/';
                                    }else if(msg.result.response[i][j].provider_type == 'mitrakeluarga'){
                                        url_goto = '/mitra_keluarga/booking/';
                                    }else if(msg.result.response[i][j].provider_type == 'insurance'){
                                        url_goto = '/insurance/booking/';
                                    }
                                    text = '';
                                    text+=`<div class="col-lg-12 notification-hover" style="cursor:pointer;">`;
                                    text+=`<form action="`+url_goto+btoa(msg.result.response[i][j].order_number)+`" method="post" id="notification_`+check_notif+`" onclick="set_csrf_notification(`+check_notif+`)">`;
                                    text+=`<div class="row">
                                            <div class="col-sm-6">`;
                                    text+=`<span style="font-weight:500;"> `+check_notif+`. `+msg.result.response[i][j].order_number+` - `+msg.result.response[i][j].pnr+`</span>`;
                                    text+=` </div>
                                            <div class="col-sm-6" style="text-align:right">
                                            <span style="font-weight:500;"> `+hold_date+`</span>`;
                                    text+=` </div>
                                           </div>`;
                                    text+=`<input type="hidden" id="order_number`+check_notif+`" name="order_number`+check_notif+`" value="`+msg.result.response[i][j].order_number+`">`;
                                    text+=`<input type="hidden" id="type_reservation`+check_notif+`" name="order_number`+check_notif+`" value="`+j+`">`;
                                    text+=`<hr/></form>`;
                                    text+=`</div>`;
                                    document.getElementById('notification_detail').innerHTML += text;
                                    $(".bell_notif").addClass("infinite");
                                    $(".bell_notif").css("color", color);
    //                              document.getElementById('notification_detail2').innerHTML += text;
                                }else{
                                    hold_date = 'Error booked';
                                }
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
                        }
                    }
                    setTimeout(function() {
                        $("#notification_div").fadeTo(500, 0).slideUp(500, function(){
                            $(this).remove();
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
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error transactions notification');
                text= '';
                text+=`<div class="col-lg-12 notification-hover" style="cursor:pointer;">`;
                text+=`<span style="font-weight:500;"> Please try again or check your internet connection</span>`;
                text+=`</div>`;
                document.getElementById('notification_detail').innerHTML = text;
           },timeout: 60000
        });
    }else{

    }
}

function get_transactions(type){
    $('#loading-search-reservation').show();
    document.getElementById('button').disabled = true;
    load_more = false;
    if(type == 'reset' || type == 'filter'){
        offset_transaction = 0;
        data_counter = 0;
        data_search = [];
        document.getElementById("table_reservation").innerHTML = `
                    <tr>
                        <th style="width:2%;">No.</th>
                        <th style="width:9%;">Order Number</th>
                        <th style="width:5%;">Provider</th>
                        <th style="width:10%;">Book Date</th>
                        <th style="width:10%;">Booker name</th>
                        <th style="width:10%;">Hold Date</th>
                        <th style="width:6%;">State</th>
                        <th style="width:4%;">PNR</th>
                        <th style="width:13%;">Info</th>
                        <th style="width:10%;">Issued Date</th>
                        <th style="width:9%;">Booked By</th>
                        <th style="width:9%;">Issued By</th>
                        <th style="width:3%;">Action</th>
                    </tr>`;
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
            if(type == 'reset' || type == 'filter'){
                offset_transaction = 0;
                data_counter = 0;
                document.getElementById("table_reservation").innerHTML = `
                    <tr>
                        <th style="width:2%;">No.</th>
                        <th style="width:9%;">Order Number</th>
                        <th style="width:5%;">Provider</th>
                        <th style="width:10%;">Book Date</th>
                        <th style="width:10%;">Booker name</th>
                        <th style="width:10%;">Hold Date</th>
                        <th style="width:6%;">State</th>
                        <th style="width:4%;">PNR</th>
                        <th style="width:13%;">Info</th>
                        <th style="width:10%;">Issued Date</th>
                        <th style="width:9%;">Booked By</th>
                        <th style="width:9%;">Issued By</th>
                        <th style="width:3%;">Action</th>
                    </tr>`;
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
                    table_reservation(msg.result.response[filter]);
                    load_more = true;
                    document.getElementById('reservation_found').style.display = 'none';
//                    $('#reservation_found').hide();
                }else{
                    table_reservation(msg.result.response[filter]);
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
    document.getElementById('table_top_up_history').innerHTML = `<tr>
                    <th style="width:5%;">No.</th>
                    <th style="width:20%;">Top Up Number</th>
                    <th style="width:20%;">Due Date</th>
                    <th style="width:15%;">Amount</th>
                    <th style="width:15%;">Status</th>
                    <th style="width:15%;">Payment Method</th>
                    <th style="width:15%;">Help By</th>
                    <th style="width:10%;">Action</th>
                </tr>`;
    text= '';
    var node = document.createElement("tr");
    data_counter = 0;
    if(data.length != 0){
        $('#top_up_found').hide();
        for(i in data){
            data_search.push(data[i]);
            text+=`
            <form action="" method="POST" id="gotobooking`+data_counter+`" />
            <tr>
                <td>`+(parseInt(i)+1)+`</td>
                <td name="order_number">`+data[i].name+`</td>`;

            text+= `<td>`+data[i].due_date+`</td>`;
            text+= `<td style="text-align:right">`+data[i].currency_code+' '+getrupiah(data[i].total)+`</td>`;
            text+= `<td>`+data[i].state_description+`</td>`;
            text+= `<td>`+data[i].payment_method+`</td>`;
            if(data[i].hasOwnProperty('help_by') == true){
                text+= `<td>`+data[i].help_by+`</td>`;
            }else{
                text+= `<td>-</td>`;
            }
            text+= `<td>`;
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