
function signin_ppob(data){
    try{
        $('.btn-next').addClass("running");
        $('.btn-next').prop('disabled', true);
    }catch(err){
        console.log(err); //error kalau tidak ada button next bisa di tambah class runnning & disabled
    }
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/ppob",
       headers:{
            'action': 'signin',
       },
       data: {},
       success: function(msg) {
            if(msg.result.error_code == 0){
                signature = msg.result.response.signature;
                if(data == '')
                {
                    search_ppob();
                }
                else
                {
                    ppob_get_provider_list();
                    ppob_get_booking(data);
                }
            }

       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error signin ppob');
            $('.payment_acq_btn').prop('disabled', false);
            $('.hold-seat-booking-train').removeClass("running");
       },timeout: 60000
    });
}

function get_config_ppob(){
    $.ajax({
       type: "POST",
       url: "/webservice/ppob",
       headers:{
            'action': 'get_config',
       },
       data: {},
       success: function(msg) {
            get_carriers_ppob();
            ppob_data = msg;
            text = '';
            counter = 0;
            for(i in ppob_data.product_data){

                text+=`
                    <label class="radio-img">`;

                    if(counter == 0){
                        text+=`<input type="radio" checked="checked" name="bills_type" value="`+i+`">`;
                    }else{
                        text+=`<input type="radio" name="bills_type" value="`+i+`">`;
                    }
                    if(i == 'bpjs'){
                        text+=`<img src="/static/tt_website_rodextrip/images/icon/bpjs.png" alt="BPJS" style="width:70px; height:70px; padding:0px;"><br/>`;
                    }else if(i == 'pln'){
                        text+=`<img src="/static/tt_website_rodextrip/images/icon/pln.png" alt="PLN" style="width:70px; height:70px; padding:0px;"><br/>`;
                    }else if(i == 'e-voucher'){
                        text+=`<img src="/static/tt_website_rodextrip/images/icon/evoucher.png" alt="E-Voucher" style="width:70px; height:70px; padding:0px;"><br/>`;
                    }
                text+=`<div style="text-align:center; margin-top:5px;"><span style="font-size:13px; color:`+text_color+`;">`+i.toString().toUpperCase()+`</span></div>
                </label>`;

                //text +=`<label class="radio-button-custom" style="margin-bottom:0px;">
                //            <span style="font-size:13px; color:`+text_color+`;">`+i.toString().toUpperCase()+`</span>`;
                //if(counter == 0)
                //text +=`
                //            <input type="radio" checked="checked" name="bills_type" value="`+i+`">`;
                //else
                //text +=`    <input type="radio" name="bills_type" value="`+i+`">`;
                //text +=`
                //            <span class="checkmark-radio"></span>
                //        </label>`;
                counter++;
            }
            document.getElementById('radio_bill_search').innerHTML = text;
            set_container_bill();
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get config ppob');
       },timeout: 60000
    });
}

function get_carriers_ppob(){
    $.ajax({
       type: "POST",
       url: "/webservice/ppob",
       headers:{
            'action': 'get_carriers',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
            if(msg.result.error_code == 0){
                carrier_ppob = msg.result.response;
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get carriers ppob');
       },timeout: 60000
    });
}

function get_carrier_providers_ppob(){
    $.ajax({
       type: "POST",
       url: "/webservice/ppob",
       headers:{
            'action': 'get_carrier_providers',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
            if(msg.result.error_code == 0){
                carrier_provider_ppob = msg.result.response;
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get carrier providers ppob');
       },timeout: 60000
    });
}

function ppob_get_provider_list(type){
    $.ajax({
       type: "POST",
       url: "/webservice/ppob",
       headers:{
            'action': 'get_provider_description',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
           provider_list_data = msg;
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error ppob get provider list');
       },timeout: 60000
    });
}

function search_ppob(){
    product_code = '';
    customer_number = '';
    amount_of_month = 0;
    total = 0;
    e_voucher = '';
    error_log = '';
    customer_number = document.getElementById('bpjs_number').value;
    customer_email = '';
    check_break = false;
    if(bill_type == 'bpjs'){
        var radios = document.getElementsByName('bpjs_type');
        for (var j = 0, length = radios.length; j < length; j++) {
            if (radios[j].checked) {
                // do whatever you want with the checked radio
                product_code = radios[j].value;
                // only one radio can be logically checked, don't check the rest
                break;
            }
        }

        amount_of_month = document.getElementById('bpjs_month').value;
        if($bpjs_type_name == 'BPJS Kesehatan'){
            if(check_number(customer_number) == true){
                for(i in ppob_data.product_data){
                    if(check_break == false){
                        for(j in ppob_data.product_data[i]){
                            if(ppob_data.product_data[i][j].name == $bpjs_type_name){
                                if(customer_number.length < ppob_data.product_data[i][j].min_cust_number || customer_number.length > ppob_data.product_data[i][j].max_cust_number){
                                    if(ppob_data.product_data[i][j].min_cust_number != ppob_data.product_data[i][j].max_cust_number){
                                        error_log += 'Please check customer number must between '+ppob_data.product_data[i][j].min_cust_number+ ' to '+ ppob_data.product_data[i][j].max_cust_number+'\n';
                                    }else{
                                        error_log += 'Please check customer number must '+ppob_data.product_data[i][j].min_cust_number+'\n';
                                    }
                                    check_break = true;
                                    break;
                                }
                            }
                        }
                    }else{
                        break;
                    }
                }
            }else{
                for(i in ppob_data.product_data){
                    if(check_break == false){
                        for(j in ppob_data.product_data[i]){
                            if(ppob_data.product_data[i][j].name == $bpjs_type_name){
                                if(ppob_data.product_data[i][j].min_cust_number != ppob_data.product_data[i][j].max_cust_number){
                                    error_log += 'Please check customer number must between '+ppob_data.product_data[i][j].min_cust_number+ ' to '+ ppob_data.product_data[i][j].max_cust_number+'\n';
                                    check_break = true;
                                    break;
                                }else{
                                    error_log += 'Please check customer number must '+ppob_data.product_data[i][j].min_cust_number+'\n';
                                    check_break = true;
                                    break;
                                }
                            }
                        }
                    }else{
                        break;
                    }
                }
            }
        }
    }else if(bill_type == 'pln'){
        var radios = document.getElementsByName('pln_type');
        for (var j = 0, length = radios.length; j < length; j++) {
            if (radios[j].checked) {
                // do whatever you want with the checked radio
                product_code = radios[j].value;
                // only one radio can be logically checked, don't check the rest
                break;
            }
        }

        if($pln_type_name == 'PLN Prepaid'){
            if(check_pln_prepaid(customer_number) == true){
                for(i in ppob_data.product_data){
                    if(check_break == false){
                        for(j in ppob_data.product_data[i]){
                            if(ppob_data.product_data[i][j].name == $pln_type_name){
                                if(customer_number.length < ppob_data.product_data[i][j].min_cust_number || customer_number.length > ppob_data.product_data[i][j].max_cust_number){
                                    if(ppob_data.product_data[i][j].min_cust_number != ppob_data.product_data[i][j].max_cust_number){
                                        error_log += 'Please check customer number must between '+ppob_data.product_data[i][j].min_cust_number+ ' to '+ ppob_data.product_data[i][j].max_cust_number+'\n';
                                    }else{
                                        error_log += 'Please check customer number must '+ppob_data.product_data[i][j].min_cust_number+'\n';
                                    }
                                    check_break = true;
                                    break;
                                }
                            }
                        }
                    }else{
                        break;
                    }
                }
            }else{
                for(i in ppob_data.product_data){
                    if(check_break == false){
                        for(j in ppob_data.product_data[i]){
                            if(ppob_data.product_data[i][j].name == $pln_type_name){
                                if(ppob_data.product_data[i][j].min_cust_number != ppob_data.product_data[i][j].max_cust_number){
                                    error_log += 'Please check customer number must between '+ppob_data.product_data[i][j].min_cust_number+ ' to '+ ppob_data.product_data[i][j].max_cust_number+'\n';
                                    check_break = true;
                                    break;
                                }else{
                                    error_log += 'Please check customer number must '+ppob_data.product_data[i][j].min_cust_number+'\n';
                                    check_break = true;
                                    break;
                                }
                            }
                        }
                    }else{
                        break;
                    }
                }
            }
            total = document.getElementById('pln_nominal').value
        }else if($pln_type_name == 'PLN Postpaid'){
            if(check_pln_postpaid(customer_number) == true){
                for(i in ppob_data.product_data){
                    if(check_break == false){
                        for(j in ppob_data.product_data[i]){
                            if(ppob_data.product_data[i][j].name == $pln_type_name){
                                if(customer_number.length < ppob_data.product_data[i][j].min_cust_number || customer_number.length > ppob_data.product_data[i][j].max_cust_number){
                                    if(ppob_data.product_data[i][j].min_cust_number != ppob_data.product_data[i][j].max_cust_number){
                                        error_log += 'Please check customer number must between '+ppob_data.product_data[i][j].min_cust_number+ ' to '+ ppob_data.product_data[i][j].max_cust_number+'\n';
                                    }else{
                                        error_log += 'Please check customer number must '+ppob_data.product_data[i][j].min_cust_number+'\n';
                                    }
                                    check_break = true;
                                    break;
                                }
                            }
                        }
                    }else{
                        break;
                    }
                }
            }else{
                for(i in ppob_data.product_data){
                    if(check_break == false){
                        for(j in ppob_data.product_data[i]){
                            if(ppob_data.product_data[i][j].name == $pln_type_name){
                                if(ppob_data.product_data[i][j].min_cust_number != ppob_data.product_data[i][j].max_cust_number){
                                    error_log += 'Please check customer number must between '+ppob_data.product_data[i][j].min_cust_number+ ' to '+ ppob_data.product_data[i][j].max_cust_number+'\n';
                                    check_break = true;
                                    break;
                                }else{
                                    error_log += 'Please check customer number must '+ppob_data.product_data[i][j].min_cust_number+'\n';
                                    check_break = true;
                                    break;
                                }
                            }
                        }
                    }else{
                        break;
                    }
                }
            }
        }else if($pln_type_name == 'PLN Non Tagihan'){
            if(check_pln_non_tagihan(customer_number) == true){
                for(i in ppob_data.product_data){
                    if(check_break == false){
                        for(j in ppob_data.product_data[i]){
                            if(ppob_data.product_data[i][j].name == $pln_type_name){
                                if(customer_number.length < ppob_data.product_data[i][j].min_cust_number || customer_number.length > ppob_data.product_data[i][j].max_cust_number){
                                    if(ppob_data.product_data[i][j].min_cust_number != ppob_data.product_data[i][j].max_cust_number){
                                        error_log += 'Please check customer number must between '+ppob_data.product_data[i][j].min_cust_number+ ' to '+ ppob_data.product_data[i][j].max_cust_number+'\n';
                                    }else{
                                        error_log += 'Please check customer number must '+ppob_data.product_data[i][j].min_cust_number+'\n';
                                    }
                                    check_break = true;
                                    break;
                                }
                            }
                        }
                    }else{
                        break;
                    }
                }
            }else{
                for(i in ppob_data.product_data){
                    if(check_break == false){
                        for(j in ppob_data.product_data[i]){
                            if(ppob_data.product_data[i][j].name == $pln_type_name){
                                if(ppob_data.product_data[i][j].min_cust_number != ppob_data.product_data[i][j].max_cust_number){
                                    error_log += 'Please check customer number must between '+ppob_data.product_data[i][j].min_cust_number+ ' to '+ ppob_data.product_data[i][j].max_cust_number+'\n';
                                    check_break = true;
                                    break;
                                }else{
                                    error_log += 'Please check customer number must '+ppob_data.product_data[i][j].min_cust_number+'\n';
                                    check_break = true;
                                    break;
                                }
                            }
                        }
                    }else{
                        break;
                    }
                }
            }
        }
    }else if(bill_type == 'e-voucher'){
        var radios = document.getElementsByName('e-voucher_type');
        for (var co = 0, length = radios.length; co < length; co++) {
            if (radios[co].checked) {
                product_code = radios[co].value;
                break;
            }
        }

        //product_code = document.getElementById('e-voucher_type').value;
        if($evoucher_type_name == 'Prepaid Mobile'){
            if(check_evoucher(customer_number) == true){
                for(i in ppob_data.product_data){
                    if(check_break == false){
                        for(j in ppob_data.product_data[i]){
                            if(ppob_data.product_data[i][j].name == $evoucher_type_name){
                                if(customer_number.length < ppob_data.product_data[i][j].min_cust_number || customer_number.length > ppob_data.product_data[i][j].max_cust_number){
                                    if(ppob_data.product_data[i][j].min_cust_number != ppob_data.product_data[i][j].max_cust_number){
                                        error_log += 'Please check customer number must between '+ppob_data.product_data[i][j].min_cust_number+ ' to '+ ppob_data.product_data[i][j].max_cust_number+'\n';
                                    }else{
                                        error_log += 'Please check customer number must '+ppob_data.product_data[i][j].min_cust_number+'\n';
                                    }
                                    check_break = true;
                                    break;
                                }
                            }
                        }
                    }else{
                        break;
                    }
                }
            }else{
                for(i in ppob_data.product_data){
                    if(check_break == false){
                        for(j in ppob_data.product_data[i]){
                            if(ppob_data.product_data[i][j].name == $evoucher_type_name){
                                if(ppob_data.product_data[i][j].min_cust_number != ppob_data.product_data[i][j].max_cust_number){
                                    error_log += 'Please check customer number must between '+ppob_data.product_data[i][j].min_cust_number+ ' to '+ ppob_data.product_data[i][j].max_cust_number+'\n';
                                    check_break = true;
                                    break;
                                }else{
                                    error_log += 'Please check customer number must '+ppob_data.product_data[i][j].min_cust_number+'\n';
                                    check_break = true;
                                    break;
                                }
                            }
                        }
                    }else{
                        break;
                    }
                }
            }
            var radios_nominal = document.getElementsByName('e-voucher_nominal');
            for (var k = 0, length = radios_nominal.length; k < length; k++) {
                if (radios_nominal[k].checked) {
                    e_voucher = radios_nominal[k].value;
                    break;
                }
            }
            if (e_voucher == ''){
                error_log += 'Please choose voucher!';
            }
        }
    }
    if(user_login.co_agent_frontend_security.includes('b2c_limitation') == true){
        customer_email = document.getElementById('customer_email').value
        if (customer_email == '')
        {
            error_log += 'Please fill your email address!';
        }
    }
    if(product_code != '' && customer_number != '' && error_log == ''){
        var search_provider_ppob = carrier_provider_ppob[product_code][0];

        $.ajax({
           type: "POST",
           url: "/webservice/ppob",
           headers:{
                'action': 'search',
           },
           data: {
                'customer_number': customer_number,
                'product_code': product_code,
                'provider': search_provider_ppob,
                'signature': signature,
                'total': total,
                'e_voucher_code': e_voucher,
                'amount_of_month': amount_of_month,
                'customer_email': customer_email
           },
           success: function(msg) {
                if(google_analytics != '')
                    gtag('event', 'ppob_hold_booking', {});
                bill_response = msg;
                if(msg.result.error_code == 0){
                    currency = '';
                    total_price = 0;
                    commission = 0;
                    for(i in msg.result.response.passengers){
                        for(j in msg.result.response.passengers[i].sale_service_charges){
                            for(k in msg.result.response.passengers[i].sale_service_charges[j]){
                                if(currency == '')
                                    currency = msg.result.response.passengers[i].sale_service_charges[j][k].currency
                                if(k != 'RAC')
                                    total_price += msg.result.response.passengers[i].sale_service_charges[j][k].amount;
                                else
                                    commission += msg.result.response.passengers[i].sale_service_charges[j][k].amount;
                            }
                        }
                    }
                    //open modal
                    document.getElementById('bills_response').innerHTML = `
                        <div class="col-lg-3 col-md-4 col-sm-6 col-xs-6">
                            <div style="padding-bottom:15px;"><span style="font-size:15px;font-weight:500;">Number:</span></div>
                        </div>
                        <div class="col-lg-9 col-md-8 col-sm-6 col-xs-6">
                            <div style="padding-bottom:15px;"><span style="font-size:15px;">`+msg.result.response.provider_booking[0].customer_number+`</span></div>
                        </div>`;

                    if(product_code != 800){
                        document.getElementById('bills_response').innerHTML += `
                        <div class="col-lg-3 col-md-4 col-sm-6 col-xs-6">
                            <div style="padding-bottom:15px;"><span style="font-size:15px;font-weight:500;">Name:</span></div>
                        </div>
                        <div class="col-lg-9 col-md-8 col-sm-6 col-xs-6">
                            <div style="padding-bottom:15px;"><span style="font-size:15px;">`+msg.result.response.provider_booking[0].customer_name+`</span></div>
                        </div>`;
                    }
                    document.getElementById('bills_response').innerHTML += `
                        <div class="col-lg-3 col-md-4 col-sm-6 col-xs-6">
                            <div style="padding-bottom:15px;"><span style="font-size:15px;font-weight:500;">Total:</span></div>
                        </div>
                        <div class="col-lg-9 col-md-8 col-sm-6 col-xs-6">
                            <div style="padding-bottom:15px;"><span style="font-size:15px;">`+currency+` `+getrupiah(total_price)+`</span></div>
                        </div>`;
                    $('#myModalBills').modal('show');
                }else{
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: red;">Error check price </span>' + msg.result.error_msg,
                    })
                }
                $('.btn-next').removeClass("running");
                $('.btn-next').prop('disabled', false);
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error ppob check price');
                $('.btn-next').removeClass("running");
                $('.btn-next').prop('disabled', false);
           },timeout: 60000
        });
    }else{
        $('.btn-next').removeClass("running");
        $('.btn-next').prop('disabled', false);
        if(error_log == '')
            alert_message_swal('Please fill all the blank!');
        else
            alert_message_swal(error_log);
    }
}

function bills_ppob(){
    $('.btn-next').addClass("running");
    $('.btn-next').prop('disabled', true);
    if(user_login.co_agent_frontend_security.includes('b2c_limitation')){
        document.getElementById("passengers").value = JSON.stringify({"booker":{"booker_seq_id":bill_response.result.response.booker.seq_id}});
        document.getElementById("signature").value = signature;
        document.getElementById("provider").value = 'ppob';
        document.getElementById("type").value = 'ppob';
        document.getElementById("voucher_code").value = '';
        document.getElementById("discount").value = JSON.stringify({});
        document.getElementById("session_time_input").value = 600;
        send_url_booking('bills', btoa(bill_response.result.response.order_number), bill_response.result.response.order_number);
        document.getElementById('order_number').value = bill_response.result.response.order_number;
        document.getElementById('ppob_issued').submit();
    }else{
        document.getElementById('bill_searchForm').innerHTML+= '<input type="hidden" name="order_number" value='+bill_response.result.response.order_number+'>';
        document.getElementById('bill_searchForm').action = '/ppob/booking/' + btoa(bill_response.result.response.order_number);
        document.getElementById('bill_searchForm').submit();
    }
    //testing
//    document.getElementById('bill_searchForm').innerHTML+= '<input type="hidden" name="order_number" value='+bill_response.result.response.order_number+'>';
//    document.getElementById('bill_searchForm').action = '/ppob/booking/' + btoa(bill_response.result.response.order_number);
//    document.getElementById('bill_searchForm').submit();

}

function ppob_get_booking(data){
    price_arr_repricing = {};
    get_vendor_balance('false');
    $.ajax({
       type: "POST",
       url: "/webservice/ppob",
       headers:{
            'action': 'get_booking',
       },
       data: {
            'order_number': data,
            'signature': signature
       },
       success: function(msg) {
           bills_get_detail = msg;
           get_payment = false;
           hide_modal_waiting_transaction();
           document.getElementById('button-home').hidden = false;
           document.getElementById('button-new-reservation').hidden = false;
           try{
               //get booking view edit here
               if(msg.result.error_code == 0){
                can_issued = msg.result.response.can_issued;
                var text = '';
                $text = '';
                csc = 0;
                for(i in msg.result.response.passengers){
                    try{
                        csc += msg.result.response.passengers[i].channel_service_charges.amount;
                    }catch(err){
                        console.log(err);
                    }
                }
                check_provider_booking = 0;
                if(msg.result.response.hold_date != false && msg.result.response.hold_date != ''){
                    tes = moment.utc(msg.result.response.hold_date).format('YYYY-MM-DD HH:mm:ss')
                    localTime  = moment.utc(tes).toDate();
                    msg.result.response.hold_date = moment(localTime).format('DD MMM YYYY HH:mm');
                    var now = moment();
                    var hold_date_time = moment(msg.result.response.hold_date, "DD MMM YYYY HH:mm");
                    data_gmt = moment(msg.result.response.hold_date)._d.toString().split(' ')[5];
                    gmt = data_gmt.replace(/[^a-zA-Z+-]+/g, '');
                    timezone = data_gmt.replace (/[^\d.]/g, '');
                    timezone = timezone.split('')
                    timezone = timezone.filter(item => item !== '0')
                    msg.result.response.hold_date = moment(localTime).format('DD MMM YYYY HH:mm') + ' ' + gmt + timezone;
                    if(msg.result.response.booked_date != ''){
                        tes = moment.utc(msg.result.response.booked_date).format('YYYY-MM-DD HH:mm:ss')
                        localTime  = moment.utc(tes).toDate();
                        msg.result.response.booked_date = moment(localTime).format('DD MMM YYYY HH:mm') + ' ' + gmt + timezone;
                    }
                    if(msg.result.response.issued_date != ''){
                        tes = moment.utc(msg.result.response.issued_date).format('YYYY-MM-DD HH:mm:ss')
                        localTime  = moment.utc(tes).toDate();
                        msg.result.response.issued_date = moment(localTime).format('DD MMM YYYY HH:mm') + ' ' + gmt + timezone;
                    }
                }
                if(msg.result.response.state == 'cancel'){
                   document.getElementById('issued-breadcrumb').classList.remove("br-active");
                   document.getElementById('issued-breadcrumb').classList.add("br-fail");
                   //document.getElementById('issued-breadcrumb').classList.remove("current");
                   //document.getElementById('header_issued').innerHTML = `Fail <i class="fas fa-times"></i>`;
                   document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
                   document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-fail");
                   document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
                   document.getElementById('issued-breadcrumb-span').innerHTML = `Cancelled`;
                   document.getElementById('alert-state').innerHTML = `
                   <div class="alert alert-danger" role="alert">
                       <h5>Your booking has been Cancelled!</h5>
                   </div>`;
                }else if(msg.result.response.state == 'cancel2'){
                   document.getElementById('issued-breadcrumb').classList.remove("br-active");
                   document.getElementById('issued-breadcrumb').classList.add("br-fail");
                   //document.getElementById('issued-breadcrumb').classList.remove("current");
                   //document.getElementById('header_issued').innerHTML = `Fail <i class="fas fa-times"></i>`;
                   document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
                   document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-fail");
                   document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
                   document.getElementById('issued-breadcrumb-span').innerHTML = `Expired`;
                   document.getElementById('alert-state').innerHTML = `
                   <div class="alert alert-danger" role="alert">
                       <h5>Your booking has been Expired!</h5>
                   </div>`;
                }else if(msg.result.response.state == 'fail_issued'){
                   document.getElementById('issued-breadcrumb').classList.remove("br-active");
                   document.getElementById('issued-breadcrumb').classList.add("br-fail");
                   //document.getElementById('issued-breadcrumb').classList.remove("current");
                   //document.getElementById('header_issued').innerHTML = `Fail <i class="fas fa-times"></i>`;
                   document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
                   document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-fail");
                   document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
                   document.getElementById('issued-breadcrumb-span').innerHTML = `Fail Issued`;
                   document.getElementById('alert-state').innerHTML = `
                   <div class="alert alert-danger" role="alert">
                       <h5>Your booking has been Failed!</h5>
                   </div>`;
                }else if(msg.result.response.state == 'fail_refunded'){
                   document.getElementById('issued-breadcrumb').classList.remove("br-active");
                   document.getElementById('issued-breadcrumb').classList.add("br-fail");
                   //document.getElementById('issued-breadcrumb').classList.remove("current");
                   //document.getElementById('header_issued').innerHTML = `Fail <i class="fas fa-times"></i>`;
                   document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
                   document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-fail");
                   document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
                   document.getElementById('issued-breadcrumb-span').innerHTML = `Fail Refunded`;
                   document.getElementById('alert-state').innerHTML = `
                   <div class="alert alert-danger" role="alert">
                       <h5>Your booking has been Failed!</h5>
                   </div>`;
                }else if(msg.result.response.state == 'fail_booked'){
                   document.getElementById('issued-breadcrumb').classList.remove("br-active");
                   document.getElementById('issued-breadcrumb').classList.add("br-fail");
                   //document.getElementById('issued-breadcrumb').classList.remove("current");
                   //document.getElementById('header_issued').innerHTML = `Fail <i class="fas fa-times"></i>`;
                   document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
                   document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-fail");
                   document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
                   document.getElementById('issued-breadcrumb-span').innerHTML = `Fail Booked`;
                   document.getElementById('alert-state').innerHTML = `
                   <div class="alert alert-danger" role="alert">
                       <h5>Your booking has been Failed!</h5>
                   </div>`;
                }else if(msg.result.response.state == 'booked'){
                   try{
                       if(can_issued)
                           check_payment_payment_method(msg.result.response.order_number, 'Issued', msg.result.response.booker.seq_id, 'billing', 'ppob', signature, msg.result.response.payment_acquirer_number);
                       get_payment = true;
    //                   get_payment_acq('Issued',msg.result.response.booker.seq_id, msg.result.response.order_number, 'billing',signature,'airline');
                       //document.getElementById('issued-breadcrumb').classList.remove("active");
                       //document.getElementById('issued-breadcrumb').classList.add("current");
                       document.getElementById('issued-breadcrumb').classList.add("br-active");
                       document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-active");
                       var check_error_msg_provider = 0;
                       for(co_error in msg.result.response.provider_booking){
                           if(msg.result.response.provider_booking[co_error].error_msg != ''){
                                check_error_msg_provider = 1;
                           }
                           break;
                       }
                       if(check_error_msg_provider != 1){
                           document.getElementById('alert-state').innerHTML = `
                           <div class="alert alert-success" role="alert">
                               <h5>Your booking has been successfully Booked. Please proceed to payment or review your booking again.</h5>
                           </div>`;
                       }
                   }catch(err){
                       console.log(err);
                   }
                }else if(msg.result.response.state == 'draft'){
                   document.getElementById('issued-breadcrumb').classList.remove("br-active");
                   document.getElementById('issued-breadcrumb').classList.add("br-fail");
                   document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
                   document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-fail");
                   document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
                   document.getElementById('Booking-breadcrumb').classList.remove("br-book");
                   document.getElementById('Booking-breadcrumb').classList.add("br-fail");
                   document.getElementById('Booking-breadcrumb-icon').classList.remove("br-icon-active");
                   document.getElementById('Booking-breadcrumb-icon').classList.add("br-icon-fail");
                   document.getElementById('Booking-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
                   document.getElementById('alert-state').innerHTML = `
                   <div class="alert alert-info" role="alert">
                       <h5>Your booking has not been processed!</h5>
                   </div>`;
                }else if(msg.result.response.state == 'refund'){
                   //document.getElementById('issued-breadcrumb').classList.remove("current");
                   //document.getElementById('issued-breadcrumb').classList.add("active");
                   document.getElementById('issued-breadcrumb').classList.add("br-active");
                   document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-active");
                   document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-check"></i>`;
                   document.getElementById('alert-state').innerHTML = `
                   <div class="alert alert-dark" role="alert">
                       <h5>Your booking has been Refunded!</h5>
                   </div>`;
                }else{
                   //document.getElementById('issued-breadcrumb').classList.remove("current");
                   //document.getElementById('issued-breadcrumb').classList.add("active");
                   document.getElementById('issued-breadcrumb').classList.add("br-active");
                   document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-active");
                   document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-check"></i>`;
                   document.getElementById('alert-state').innerHTML = `
                   <div class="alert alert-success" role="alert">
                       <h5>Your booking has been successfully Issued!</h5>
                   </div>`;
                }

                if(msg.result.response.state == 'issued'){
                   //tanya ko sam kalau nyalain
    //                document.getElementById('ssr_request_after_sales').hidden = false;
    //                document.getElementById('ssr_request_after_sales').innerHTML = `
    //                        <input class="primary-btn-ticket" style="width:100%;margin-bottom:10px;" type="button" onclick="set_new_request_ssr()" value="Request New SSR">
    //                        <input class="primary-btn-ticket" style="width:100%;" type="button" onclick="set_new_request_seat()" value="Request New Seat">`;
    //                document.getElementById('reissued').hidden = false;
    //                document.getElementById('reissued').innerHTML = `<input class="primary-btn-ticket" style="width:100%;" type="button" onclick="reissued_btn();" value="Reissued">`;
                    provider_list = [];
                    for(i in msg.result.response.provider_bookings){
                        provider_list.push(msg.result.response.provider_bookings[i].provider);
                    }

                }
                if(msg.result.response.state == 'booked'){
                    try{
                        if(can_issued)
                            $(".issued_booking_btn").show();
                    }catch(err){
                        console.log(err); //kalau tidak ada button issued
                    }
                    check_provider_booking++;
                    try{
                       check_cancel = 0;
                       for(i in msg.result.response.provider_booking){
                            if(provider_list_data[msg.result.response.provider_booking[i].provider].is_post_booked_cancel){
                                check_cancel = 1;
                            }
                       }
                       if(check_cancel){
                            document.getElementById('cancel').hidden = false;
                            document.getElementById('cancel').innerHTML = `<button class="primary-btn-white" style="width:100%;" type="button" onclick="cancel_btn();">Cancel Booking <i class="fas fa-times" style="padding-left:5px; color:red; font-size:16px;"></i></button>`;
                       }
                    }catch(err){

                    }
                }
                else{
                    //$(".issued_booking_btn").remove();
                    $('.loader-rodextrip').fadeOut();
                    hide_modal_waiting_transaction();
                }

                $text += 'Order Number: '+ msg.result.response.order_number + '\n';

                //$text += 'Hold Date: ' + msg.result.response.hold_date + '\n';
                $text += msg.result.response.state_description + '\n';
                var localTime;
                currency = ''
                for(j in msg.result.response.provider_booking[0].service_charges){
                    if(currency == ''){
                        currency = msg.result.response.provider_booking[0].service_charges[j].currency;
                        break;
                    }
                }
                text += `
                <div class="col-lg-12" style="border:1px solid #cdcdcd; padding:10px; background-color:white; margin-bottom:20px;">
                    <h6>Order Number : `+msg.result.response.order_number+`</h6><br/>
                    <table style="width:100%;">
                        <tr>
                            <th>PNR</th>`;
                            if(msg.result.response.state == 'booked')
                                text+=`<th>Hold Date</th>`;
                        text+=`
                            <th>Status</th>
                        </tr>`;
                        printed_hold_date = false;
                        for(i in msg.result.response.provider_booking){
                            if(msg.result.response.state == 'booked' && printed_hold_date == false){
                                if(get_payment == false){
                                   check_payment_payment_method(msg.result.response.order_number, 'Issued', msg.result.response.booker.seq_id, 'billing', 'ppob', signature, msg.result.response.payment_acquirer_number);
                                   get_payment = true;
                                }
    //                                check_payment_payment_method(msg.result.response.order_number, 'Issued', msg.result.response.booker.seq_id, 'billing', 'airline', signature);
    //                            get_payment_acq('Issued',msg.result.response.booker.seq_id, msg.result.response.order_number, 'billing',signature,'airline');
                                $text += 'PLEASE MAKE PAYMENT BEFORE '+ msg.result.response.hold_date + `\n`;
                                try{
                                    if(now.diff(hold_date_time, 'minutes')<0)
                                        $(".issued_booking_btn").show();
                                }catch(err){
                                    console.log(err); //error kalau tidak ada button issued
                                }
                                check_provider_booking++;
                                printed_hold_date = true;
                            }
                            //datetime utc to local
                            if(msg.result.response.provider_booking[i].error_msg.length != 0 && msg.result.response.state != 'issued')
                                text += `<div class="alert alert-danger">
                                    `+msg.result.response.provider_booking[i].error_msg+`
                                    <a href="#" class="close" data-dismiss="alert" aria-label="close" style="margin-top:-1.9vh;">x</a>
                                </div>`;
                            //
                            text+=`<tr>`;
                            if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false || msg.result.response.state == 'issued')
                                text+=`
                                    <td>`+msg.result.response.provider_booking[i].pnr+`</td>`;
                            else
                                text += `<td> - </td>`;

                            if(msg.result.response.state == 'booked')
                                text+=`<td>`+msg.result.response.hold_date+`</td>`;

                            text+=`
                                <td id='pnr'>`;
                            if(msg.result.response.state_description == 'Expired'){
                                text+=`<span style="background:#DC143C; color:white; padding:0px 15px; border-radius:14px;">`;
                            }
                            else if(msg.result.response.state_description == 'Booked'){
                                text+=`<span style="background:#3fa1e8; color:white; padding:0px 15px; border-radius:14px;">`;
                            }
                            else if(msg.result.response.state_description == 'Issued'){
                                text+=`<span style="background:#30b330; color:white; padding:0px 15px; border-radius:14px;">`;
                            }
                            else{
                                text+=`<span>`;
                            }
                            text+=`
                                    `+msg.result.response.state_description+`
                                </span>
                                </td>
                            </tr>`;
                        }
                        if(check_provider_booking == 0 && msg.result.response.state != 'issued'){
                            $text += msg.result.response.state_description+'\n';
                            check_provider_booking++;
                            $(".issued_booking_btn").remove();
                        }
                        $text +='\n';
                text+=`</table>
                    <hr/>
                    <div class="row">
                        <div class="col-lg-6">
                            <h6>Booked</h6>
                            <span>Date: <b>`;
                                if(msg.result.response.booked_date != ""){
                                    text+=``+msg.result.response.booked_date+``;
                                }else{
                                    text+=`-`
                                }
                                text+=`</b>
                            </span>
                            <br/>
                            <span>by <b>`+msg.result.response.booked_by+`</b><span>
                        </div>

                        <div class="col-lg-6 mb-3">`;
                            if(msg.result.response.state == 'issued'){
                                text+=`<h6>Issued</h6>
                                    <span>Date: <b>`;
                                    if(msg.result.response.issued_date != ""){
                                        text+=``+msg.result.response.issued_date+``;
                                    }else{
                                        text+=`-`
                                    }
                                text+=`</b>
                                </span>
                                <br/>
                                <span>by <b>`+msg.result.response.issued_by+`</b><span>`;
                            }
                            text+=`
                        </div>
                    </div>
                </div>

                <div style="background-color:white; border:1px solid #cdcdcd;">
                    <div class="row">
                        <div class="col-lg-12">
                            <div style="padding:10px; background-color:white;">
                            <h5> Bill Details <img style="width:18px;" src="/static/tt_website_rodextrip/images/icon/plane.png" alt="Bills Detail"/></h5>
                            <hr/>`;
                        check = 0;
                        flight_counter = 1;
                        for(i in msg.result.response.provider_booking){
                            $text += 'Booking Code: ' + msg.result.response.provider_booking[i].pnr+'\n';
                            if(i != 0){
                                text+=`<hr/>`;
                            }
                            text+=`<h5>PNR: `+msg.result.response.provider_booking[i].pnr+`</h5>`;
                            flight_counter++;
                            text+=`<div class="row">
                                    <div class="col-lg-4">
                                        <span style="font-weight:500;">Type</span><br/>
                                        <span style="font-weight:500;">Number</span><br/>
                                        <span style="font-weight:500;">Name</span>
                                    </div>
                                    <div class="col-lg-8">
                                        <span>`+msg.result.response.provider_booking[i].carrier_name+`</span><br/>
                                        <span>`+msg.result.response.provider_booking[i].customer_number+`</span><br/>
                                        <span>`+msg.result.response.provider_booking[i].customer_name+`</span>
                                    </div>
                                   </div>`;
                        }
                        text+=`
                            </div>
                        </div>
                    </div>
                </div>`;
                if(msg.result.response.provider_booking[0].bill_details.length != 0){
                text+=`


                <div style="border:1px solid #cdcdcd; padding:10px; background-color:white; margin-top:20px;">
                    <h5> List of Family</h5>
                    <hr/>
                    <table style="width:100%" id="list-of-passenger">
                        <tr>
                            <th style="width:5%;" class="list-of-passenger-left">No</th>
                            <th style="width:30%;">Name</th>
                            <th style="width:20%;">Number</th>
                            <th style="width:25%;">Total</th>
                        </tr>`;
                        passenger_count = 1;
                        for(i in msg.result.response.provider_booking){
                            for(j in msg.result.response.provider_booking[i].bill_details){
                                text+=`<tr>
                                    <td class="list-of-passenger-left">`+(passenger_count)+`</td>
                                    <td>`+msg.result.response.provider_booking[i].bill_details[j].customer_name+`</td>
                                    <td>`+msg.result.response.provider_booking[i].bill_details[j].customer_number+`</td>
                                    <td>`+currency+` `+getrupiah(msg.result.response.provider_booking[i].bill_details[j].total)+`</td>
                                </tr>`;
                                passenger_count++;
                            }
                        }

                    text+=`</table>
                </div>`;
                }

                if(msg.result.response.provider_booking[0].description != ''){
                text+=`
                <div style="border:1px solid #cdcdcd; padding:10px; background-color:white; margin-top:20px;">
                    <h5> Additional Information</h5>
                    <hr/>
                    `+msg.result.response.provider_booking[0].description+`
                </div>
                `;

                }

                text+=`

                <div class="row" style="margin-top:20px;">
                    <div class="col-lg-4" style="padding-bottom:10px;">`;
                        if(msg.result.response.state != 'cancel' && msg.result.response.state != 'cancel2'){
                            if (msg.result.response.state == 'issued'){
                                text+=`
                                <button type="button" class="primary-btn ld-ext-right" id="button-choose-print" style="width:100%;" onclick="get_printout('`+msg.result.response.order_number+`', 'ticket','ppob');">
                                    Print Ticket
                                    <div class="ld ld-ring ld-cycle"></div>
                                </button>`;
                            }
                        }
                        text+=`
                    </div>
                    <div class="col-lg-4" style="padding-bottom:10px;">`;
                        if(msg.result.response.state != 'cancel' && msg.result.response.state != 'cancel2'){
                            if (msg.result.response.state  == 'booked'){
                                text+=`
                                <button type="button" id="button-print-print" class="primary-btn ld-ext-right" style="width:100%;" onclick="get_printout('`+msg.result.response.order_number+`', 'itinerary','ppob');">
                                    Print Form
                                    <div class="ld ld-ring ld-cycle"></div>
                                </button>`;
                            }
                        }
                            text+=`
                    </div>
                    <div class="col-lg-4" style="padding-bottom:10px;">`;
                        if(msg.result.response.state != 'cancel' && msg.result.response.state != 'cancel2'){
                            if (msg.result.response.state == 'issued'){
                                text+=`
                                <a class="issued-booking-train ld-ext-right" style="color:`+text_color+`;">
                                    <input type="button" class="primary-btn" style="width:100%;" data-toggle="modal" data-target="#printInvoice" value="Print Invoice"/>
                                    <div class="ld ld-ring ld-cycle"></div>
                                </a>`;
                                // modal invoice
                                text+=`
                                    <div class="modal fade" id="printInvoice" role="dialog" data-keyboard="false">
                                        <div class="modal-dialog">

                                          <!-- Modal content-->
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h4 class="modal-title" style="color:`+text_color+`">Invoice</h4>
                                                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                                                </div>
                                                <div class="modal-body">
                                                    <div class="row">
                                                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 mb-2">
                                                            <span class="control-label" for="Name">Name</span>
                                                            <div class="input-container-search-ticket">
                                                                <input type="text" class="form-control o_website_form_input" id="bill_name" name="bill_name" placeholder="Name" required="1"/>
                                                            </div>
                                                        </div>
                                                        <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 mb-2">
                                                            <span class="control-label" for="Additional Information">Additional Information</span>
                                                            <div class="input-container-search-ticket">
                                                                <textarea style="width:100%; resize: none;" rows="4" id="additional_information" name="additional_information" placeholder="Additional Information"></textarea>
                                                            </div>
                                                        </div>
                                                        <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 mb-2">
                                                            <span class="control-label" for="Address">Address</span>
                                                            <div class="input-container-search-ticket">
                                                                <textarea style="width:100%; resize: none;" rows="4" id="bill_address" name="bill_address" placeholder="Address"></textarea>
                                                                <!--<input type="text" class="form-control o_website_form_input" id="bill_name" name="bill_address" placeholder="Address" required="1"/>-->
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <br/>
                                                    <div style="text-align:right;">
                                                        <span>Don't want to edit? just submit</span>
                                                        <br/>
                                                        <button type="button" id="button-issued-print" class="primary-btn ld-ext-right" onclick="get_printout('`+msg.result.response.order_number+`', 'invoice','ppob');">
                                                            Submit
                                                            <div class="ld ld-ring ld-cycle"></div>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div class="modal-footer">
                                                  <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                `;
                            }
                        }
                            text+=`
                        </a>
                    </div>
                </div>`;
                document.getElementById('bills_booking').innerHTML = text;

                //detail
                text = '';
                tax = 0;
                fare = 0;
                total_price = 0;
                total_price_for_discount = 0;
                total_price_provider = [];
                disc = 0;
                price_provider = 0;
                commission = 0;
                service_charge = ['FARE', 'RAC', 'ROC', 'TAX', 'SSR', 'DISC'];
                text_detail=`
                <div style="background-color:white; padding:10px; border: 1px solid #cdcdcd; margin-bottom:15px;">
                    <h5> Price Detail</h5>
                <hr/>`;

                //repricing
                type_amount_repricing = ['Repricing'];
                //repricing
                counter_service_charge = 0;
                $text += '\nPrice:\n';
                for(i in msg.result.response.provider_booking){
                    try{
                        if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false || msg.result.response.state == 'issued')
                            text_detail+=`
                                <div style="text-align:left">
                                    <span style="font-weight:500; font-size:14px;">PNR: `+msg.result.response.provider_booking[i].pnr+` </span>
                                </div>`;
                        rac = 0;
                        currency = '';
                        roc = 0;
                        pax = msg.result.response.provider_booking[i].bill_details.length;
                        if(pax == 0)
                            pax = msg.result.response.provider_booking[i].bill_data.length;
                        for(j in msg.result.response.passengers){
                            for(k in msg.result.response.passengers[j].sale_service_charges){
                                for(l in msg.result.response.passengers[j].sale_service_charges[k]){
                                    if(currency == '')
                                        currency = msg.result.response.passengers[j].sale_service_charges[k][l].currency;
                                    if(l == 'RAC')
                                        rac += msg.result.response.passengers[j].sale_service_charges[k][l].amount;
                                    else if(l == 'ROC' )
                                        roc += msg.result.response.passengers[j].sale_service_charges[k][l].amount;
                                    else if(l == 'TAX' )
                                        roc += msg.result.response.passengers[j].sale_service_charges[k][l].amount;
                                }
                            }
                        }
                        price_discount = {'FARE': 0, 'RAC': 0, 'ROC': 0, 'TAX':0 , 'currency': '', 'CSC': 0, 'SSR': 0, 'DISC': 0,'SEAT':0};
                        for(j in msg.result.response.passengers){
                            for(k in msg.result.response.passengers[j].sale_service_charges){
                                for(l in msg.result.response.passengers[j].sale_service_charges[k])
                                    price_discount[l] += msg.result.response.passengers[j].sale_service_charges[k][l].amount
                            }
                        }
                        disc -= price_discount['DISC'];
                        total_price_provider.push({
                            'pnr': msg.result.response.provider_booking[i].pnr,
                            'provider': msg.result.response.provider_booking[i].provider,
                            'price': JSON.parse(JSON.stringify(price_discount))
                        });
                        if(msg.result.response.provider_booking[i].bill_details.length != 0){
                            msg.result.response.provider_booking[i].bill_details.push({
                                "customer_name": "Service Charges",
                                "currency": currency,
                                "total": roc
                            })
                            if(csc != 0)
                                msg.result.response.provider_booking[i].bill_details.push({
                                    "customer_name": "Other Service Charges",
                                    "currency": currency,
                                    "total": csc
                                })
                            for(j in msg.result.response.provider_booking[i].bill_details){
                                price = {'FARE': 0, 'RAC': 0, 'ROC': 0, 'TAX':0 , 'currency': '', 'CSC': 0, 'SSR': 0, 'DISC': 0,'SEAT':0};
                                price['FARE'] = msg.result.response.provider_booking[i].bill_details[j].total;
                                if(rac != 0)
                                    price['RAC'] = rac / pax;
                                else
                                    price['RAC'] = 0;
                                price['currency'] = currency;
                                //repricing
                                check = 0;
                                for(k in pax_type_repricing){
                                    if(pax_type_repricing[k][0] == msg.result.response.provider_booking[i].bill_details[j].customer_name)
                                        check = 1;
                                }
                                if(check == 0){
                                    pax_type_repricing.push([msg.result.response.provider_booking[i].bill_details[j].customer_name, msg.result.response.provider_booking[i].bill_details[j].customer_name]);
                                    price_arr_repricing[msg.result.response.provider_booking[i].bill_details[j].customer_name] = {
                                        'Fare': price['FARE'] + price['SSR'] + price['SEAT'] + price['DISC'],
                                        'Tax': price['TAX'] + price['ROC'],
                                        'Repricing': price['CSC']
                                    }
                                }else{
                                    price_arr_repricing[msg.result.response.provider_booking[i].bill_details[j].customer_name] = {
                                        'Fare': price_arr_repricing[msg.result.response.provider_booking[i].bill_details[j].customer_name]['Fare'] + price['FARE'] + price['DISC'] + price['SSR'] + price['SEAT'],
                                        'Tax': price_arr_repricing[msg.result.response.provider_booking[i].bill_details[j].customer_name]['Tax'] + price['TAX'] + price['ROC'],
                                        'Repricing': price['CSC']
                                    }
                                }
                                text_repricing = `
                                <div class="col-lg-12">
                                    <div style="padding:5px;" class="row">
                                        <div class="col-lg-3"></div>
                                        <div class="col-lg-3">Price</div>
                                        <div class="col-lg-3">Repricing</div>
                                        <div class="col-lg-3">Total</div>
                                    </div>
                                </div>`;
                                for(k in price_arr_repricing){
                                   text_repricing += `
                                   <div class="col-lg-12">
                                        <div style="padding:5px;" class="row" id="adult">
                                            <div class="col-lg-3" id="`+j+`_`+k+`">`+k+`</div>
                                            <div class="col-lg-3" id="`+k+`_price">`+getrupiah(price_arr_repricing[k].Fare + price_arr_repricing[k].Tax)+`</div>`;
                                            if(price_arr_repricing[k].Repricing == 0)
                                            text_repricing+=`<div class="col-lg-3" id="`+k+`_repricing">-</div>`;
                                            else
                                            text_repricing+=`<div class="col-lg-3" id="`+k+`_repricing">`+getrupiah(price_arr_repricing[k].Repricing)+`</div>`;
                                            text_repricing+=`<div class="col-lg-3" id="`+k+`_total">`+getrupiah(price_arr_repricing[k].Fare + price_arr_repricing[k].Tax + price_arr_repricing[k].Repricing)+`</div>
                                        </div>
                                    </div>`;
                                }
                                //booker
                                booker_insentif = '-';
                                if(msg.result.response.hasOwnProperty('booker_insentif'))
                                    booker_insentif = getrupiah(msg.result.response.booker_insentif)
                                text_repricing += `
                                <div class="col-lg-12">
                                    <div style="padding:5px;" class="row" id="booker_repricing" hidden>
                                    <div class="col-lg-6" id="repricing_booker_name">Booker Insentif</div>
                                    <div class="col-lg-3" id="repriring_booker_repricing"></div>
                                    <div class="col-lg-3" id="repriring_booker_total">`+booker_insentif+`</div>
                                    </div>
                                </div>`;
                                text_repricing += `<div id='repricing_button' class="col-lg-12" style="text-align:center;"></div>`;
                                document.getElementById('repricing_div').innerHTML = text_repricing;
                                //repricing

                                text_detail+=`
                                <div class="row" style="margin-bottom:5px;">
                                    <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                        <span style="font-size:12px;">`+msg.result.response.provider_booking[i].bill_details[j].customer_name+`</span>`;
                                    text_detail+=`</div>
                                    <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                        <span style="font-size:13px;">`+currency+` `+getrupiah(parseInt(price.FARE + price.TAX + price.ROC + price.CSC + price.SSR + price.SEAT + price.DISC))+`</span>
                                    </div>
                                </div>`;
                                $text += msg.result.response.provider_booking[i].bill_details[j].customer_name + ' ['+msg.result.response.provider_booking[i].pnr+'] ';

                                $text += price.currency+` `+getrupiah(parseInt(price.FARE + price.SSR + price.SEAT + price.TAX + price.ROC + price.CSC + price.DISC))+'\n';
                                if(counter_service_charge == 0){
                                    total_price += parseInt(price.TAX + price.ROC + price.FARE + price.SEAT + price.CSC + price.SSR + price.DISC);
                                    total_price_for_discount += parseInt(price.FARE);
                                    price_provider += parseInt(price.TAX + price.ROC + price.FARE + price.SEAT + price.CSC + price.SSR + price.DISC);
                                }else{
                                    total_price += parseInt(price.TAX + price.ROC + price.FARE + price.SSR + price.SEAT + price.DISC);
                                    total_price_for_discount += parseInt(price.FARE);
                                    price_provider += parseInt(price.TAX + price.ROC + price.FARE + price.SSR + price.SEAT + price.DISC);
                                }
                                commission += parseInt(price.RAC);
                            }
                        }else{
                            msg.result.response.provider_booking[i].bill_data.push({
                                "period_date": "Service Charges",
                                "currency": currency,
                                "total": roc
                            })
                            if(csc != 0)
                                msg.result.response.provider_booking[i].bill_data.push({
                                    "period_date": "Other Service Charges",
                                    "currency": currency,
                                    "total": csc
                                })
                            for(j in msg.result.response.provider_booking[i].bill_data){
                                price = {'FARE': 0, 'RAC': 0, 'ROC': 0, 'TAX':0 , 'currency': '', 'CSC': 0, 'SSR': 0, 'DISC': 0,'SEAT':0};
                                price['FARE'] = msg.result.response.provider_booking[i].bill_data[j].total;
                                if(rac != 0)
                                    price['RAC'] = rac / pax;
                                else
                                    price['RAC'] = 0;
                                price['currency'] = currency;
                                //repricing
                                check = 0;
                                for(k in pax_type_repricing){
                                    if(pax_type_repricing[k][0] == msg.result.response.provider_booking[i].bill_data[j].period_date)
                                        check = 1;
                                }
                                if(check == 0){
                                    pax_type_repricing.push([msg.result.response.provider_booking[i].bill_data[j].period_date, msg.result.response.provider_booking[i].bill_data[j].period_date]);
                                    price_arr_repricing[msg.result.response.provider_booking[i].bill_data[j].period_date] = {
                                        'Fare': price['FARE'] + price['SSR'] + price['SEAT'] + price['DISC'],
                                        'Tax': price['TAX'] + price['ROC'],
                                        'Repricing': price['CSC']
                                    }
                                }else{
                                    price_arr_repricing[msg.result.response.provider_booking[i].bill_data[j].period_date] = {
                                        'Fare': price_arr_repricing[msg.result.response.provider_booking[i].bill_data[j].pnr]['Fare'] + price['FARE'] + price['DISC'] + price['SSR'] + price['SEAT'],
                                        'Tax': price_arr_repricing[msg.result.response.provider_booking[i].bill_data[j].pnr]['Tax'] + price['TAX'] + price['ROC'],
                                        'Repricing': price['CSC']
                                    }
                                }
                                text_repricing = `
                                <div class="col-lg-12">
                                    <div style="padding:5px;" class="row">
                                        <div class="col-lg-3"></div>
                                        <div class="col-lg-3">Price</div>
                                        <div class="col-lg-3">Repricing</div>
                                        <div class="col-lg-3">Total</div>
                                    </div>
                                </div>`;
                                for(k in price_arr_repricing){
                                   text_repricing += `
                                   <div class="col-lg-12">
                                        <div style="padding:5px;" class="row" id="adult">
                                            <div class="col-lg-3" id="`+j+`_`+k+`">`+k+`</div>
                                            <div class="col-lg-3" id="`+k+`_price">`+getrupiah(price_arr_repricing[k].Fare + price_arr_repricing[k].Tax)+`</div>`;
                                            if(price_arr_repricing[k].Repricing == 0)
                                            text_repricing+=`<div class="col-lg-3" id="`+k+`_repricing">-</div>`;
                                            else
                                            text_repricing+=`<div class="col-lg-3" id="`+k+`_repricing">`+getrupiah(price_arr_repricing[k].Repricing)+`</div>`;
                                            text_repricing+=`<div class="col-lg-3" id="`+k+`_total">`+getrupiah(price_arr_repricing[k].Fare + price_arr_repricing[k].Tax + price_arr_repricing[k].Repricing)+`</div>
                                        </div>
                                    </div>`;
                                }
                                text_repricing += `<div id='repricing_button' class="col-lg-12" style="text-align:center;"></div>`;
                                document.getElementById('repricing_div').innerHTML = text_repricing;
                                //repricing

                                text_detail+=`
                                <div class="row" style="margin-bottom:5px;">
                                    <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                        <span style="font-size:12px;">`+msg.result.response.provider_booking[i].bill_data[j].period_date+`</span>`;
                                    text_detail+=`</div>
                                    <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                        <span style="font-size:13px;">`+price.currency+` `+getrupiah(parseInt(price.FARE + price.TAX + price.ROC + price.CSC + price.SSR + price.SEAT + price.DISC))+`</span>
                                    </div>
                                </div>`;
                                $text += msg.result.response.provider_booking[i].bill_data[j].period_date + ' ['+msg.result.response.provider_booking[i].pnr+'] ';

                                $text += price.currency+` `+getrupiah(parseInt(price.FARE + price.SSR + price.SEAT + price.TAX + price.ROC + price.CSC + price.DISC))+'\n';
                                if(counter_service_charge == 0){
                                    total_price += parseInt(price.TAX + price.ROC + price.FARE + price.SEAT + price.CSC + price.SSR + price.DISC);
                                    total_price_for_discount += parseInt(price.FARE);
                                    price_provider += parseInt(price.TAX + price.ROC + price.FARE + price.SEAT + price.CSC + price.SSR + price.DISC);
                                }else{
                                    total_price += parseInt(price.TAX + price.ROC + price.FARE + price.SSR + price.SEAT + price.DISC);
                                    total_price_for_discount += parseInt(price.FARE);
                                    price_provider += parseInt(price.TAX + price.ROC + price.FARE + price.SSR + price.SEAT + price.DISC);
                                }
                                commission += parseInt(price.RAC);
                            }
                        }
                        price_provider = 0;
                        counter_service_charge++;
                    }catch(err){
                        console.log(err);
                    }
                }
                try{
                    total_price -= disc;
                    bills_get_detail.result.response.total_price = total_price;
                    $text += 'Grand Total: '+price.currency+' '+ getrupiah(total_price);
                    if(check_provider_booking != 0 && msg.result.response.state == 'booked'){
                        $text += '\n\nPrices and availability may change at any time';
                    }
                    if(disc != 0){
                        text_detail+=`
                            <div class="row" style="margin-bottom:5px;">
                                <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                    <span style="font-size:12px;">Discount</span>`;
                                text_detail+=`</div>
                                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                    <span style="font-size:13px;">`+price.currency+` -`+getrupiah(parseInt(disc))+`</span>
                                </div>
                            </div>`;
                    }
                    text_detail+=`
                    <div>
                        <hr/>
                    </div>
                    <div class="row" style="margin-bottom:10px;">
                        <div class="col-lg-6 col-xs-6" style="text-align:left;">
                            <span style="font-size:13px; font-weight: bold;">Grand Total</span>
                        </div>
                        <div class="col-lg-6 col-xs-6" style="text-align:right;">
                            <span style="font-size:13px; font-weight: bold;">`;
                            try{
                                text_detail+= price.currency+` `+getrupiah(total_price);
                            }catch(err){

                            }
                            text_detail+= `</span>
                        </div>
                    </div>`;
                    if(msg.result.response.state == 'booked' && user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
                        text_detail+=`<div style="text-align:right; padding-bottom:10px;"><img src="/static/tt_website_rodextrip/img/bank.png" alt="Bank" style="width:25px; height:25px; cursor:pointer;" onclick="show_repricing();"/></div>`;
                    else if(msg.result.response.state == 'issued' && user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false){
                        text_detail+=`<div style="text-align:right; padding-bottom:10px;"><img src="/static/tt_website_rodextrip/img/bank.png" alt="Bank" style="width:25px; height:25px; cursor:pointer;" onclick="show_repricing();"/></div>`;
                        document.getElementById('repricing_type').innerHTML = '<option value="booker">Booker</option>';
                        $('#repricing_type').niceSelect('update');
                        reset_repricing();
                    }
                    text_detail+=`<div class="row">
                    <div class="col-lg-12" style="padding-bottom:10px;">
                        <hr/>
                        <span style="font-size:14px; font-weight:bold;">Share This on:</span><br/>`;
                        share_data();
                        var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                        if (isMobile) {
                            text_detail+=`
                                <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png" alt="Whatsapp"/></a>
                                <a href="line://msg/text/`+ $text_share +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png" alt="Line"/></a>
                                <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png" alt="Telegram"/></a>
                                <a href="mailto:?subject=This is the bill price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png" alt="Email"/></a>`;
                        } else {
                            text_detail+=`
                                <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png" alt="Whatsapp"/></a>
                                <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png" alt="Line"/></a>
                                <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png" alt="Telegram"/></a>
                                <a href="mailto:?subject=This is the bill price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png" alt="Email"/></a>`;
                        }

                    text_detail+=`
                        </div>
                    </div>`;
                    if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false){
                        text_detail+=`
                        <div class="row" id="show_commission" style="display:block;">
                            <div class="col-lg-12 col-xs-12" style="text-align:center;">
                                <div class="alert alert-success">
                                    <div class="row">
                                        <div class="col-lg-6 col-xs-6" style="text-align:left;">
                                            <span style="font-size:13px; font-weight:bold;">YPM</span>
                                        </div>
                                        <div class="col-lg-6 col-xs-6" style="text-align:right;">
                                            <span style="font-size:13px; font-weight:bold;">`+price.currency+` `+getrupiah(parseInt(rac)*-1)+`</span>
                                        </div>
                                    </div>`;
                                    if(msg.result.response.hasOwnProperty('agent_nta') == true){
                                        total_nta = 0;
                                        total_nta = msg.result.response.agent_nta;
                                        text_detail+=`<div class="row">
                                        <div class="col-lg-6 col-xs-6" style="text-align:left;">
                                            <span style="font-size:13px; font-weight:bold;">Agent NTA</span>
                                        </div>
                                        <div class="col-lg-6 col-xs-6" style="text-align:right;">
                                            <span style="font-size:13px; font-weight:bold;">`+price.currency+` `+getrupiah(total_nta)+`</span>
                                        </div>
                                    </div>`;
                                    }
                                    if(msg.result.response.hasOwnProperty('total_nta') == true){
                                        total_nta = 0;
                                        total_nta = msg.result.response.total_nta;
                                        text_detail+=`<div class="row">
                                        <div class="col-lg-6 col-xs-6" style="text-align:left;">
                                            <span style="font-size:13px; font-weight:bold;">HO NTA</span>
                                        </div>
                                        <div class="col-lg-6 col-xs-6" style="text-align:right;">
                                            <span style="font-size:13px; font-weight:bold;">`+price.currency+` `+getrupiah(total_nta)+`</span>
                                        </div>
                                    </div>`;
                                    }
                                    if(msg.result.response.hasOwnProperty('booker_insentif') == true){
                                        booker_insentif = 0;
                                        booker_insentif = msg.result.response.booker_insentif;
                                        text_detail+=`<div class="row">
                                        <div class="col-lg-6 col-xs-6" style="text-align:left;">
                                            <span style="font-size:13px; font-weight:bold;">Booker Insentif</span>
                                        </div>
                                        <div class="col-lg-6 col-xs-6" style="text-align:right;">
                                            <span style="font-size:13px; font-weight:bold;">`+price.currency+` `+getrupiah(booker_insentif)+`</span>
                                        </div>
                                    </div>`;
                                    }
                                    if(rac == 0){
                                        text_detail+=`
                                        <div class="row">
                                            <div class="col-lg-12 col-xs-12" style="text-align:left;">
                                                <span style="font-size:13px; color:red;">* Please mark up the price first</span>
                                            </div>
                                        </div>`;
                                    }
                                    text_detail+=`
                                </div>
                            </div>
                        </div>`;
                    }
                    text_detail+=`<center>

                    <div style="padding-bottom:10px;">
                        <center>
                            <input type="button" class="primary-btn-white" style="width:100%;" onclick="copy_data();" value="Copy"/>
                        </center>
                    </div>`;
                    if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
                    text_detail+=`
                    <div style="margin-bottom:10px;">
                        <input class="primary-btn-white" id="show_commission_button" style="width:100%;" type="button" onclick="show_commission('commission');" value="Hide YPM"/>
                    </div>`;
                    if(msg.result.response.state == 'fail_issued' || msg.result.response.state == 'fail_refunded')
                    text_detail+=`
                    <div style="margin-bottom:10px;">
                        <input class="primary-btn-ticket" style="width:100%;" type="button" onclick="resync_status();" value="Resync"/>
                    </div>`;
                    text+=`
                </div>`;
                }catch(err){
                    console.log(err);
                }
                document.getElementById('bills_detail').innerHTML = text_detail;
                $("#show_loading_booking_bills").hide();

                //
                text = `
                <div class="modal fade" id="myModal" role="dialog">
                    <div class="modal-dialog">

                        <!-- Modal content-->
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title" style="color:`+text_color+`;">Price Change <i class="fas fa-money"></i></h4>
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div class="modal-body">
                                <div id="search_result" style="max-height:600px; overflow:auto; padding:15px;">
                                    <div class="col-sm-12">
                                        <div class="row">
                                            <div class="col-sm-6">
                                                <div style="text-align:center" id="old_price">
                                                </div>
                                            </div>
                                            <div class="col-sm-6">
                                                <div style="text-align:center" id="new_price">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-default" data-dismiss="modal" onclick="ppob_issued('`+msg.result.response.order_number+`');">Force Issued</button>
                                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal fade" id="myModal_reissue" role="dialog">
                    <div class="modal-dialog">

                        <!-- Modal content-->
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title" style="color:`+text_color+`;">Ticket <i class="fas fa-money"></i></h4>
                                <button type="button" class="close" onclick="dismiss_reissue();">&times;</button>
                            </div>
                            <div class="modal-body">
                                <div id="search_result" style="max-height:600px; overflow:auto; padding:15px;">
                                    <div id="bills_ticket_pick">

                                    </div>
                                    <div class="col-sm-12" id="render_ticket_reissue">

                                    </div>

                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="myModal_price_itinerary" role="dialog">
                    <div class="modal-dialog">

                        <!-- Modal content-->
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title" style="color:`+text_color+`;">Price Change <i class="fas fa-money"></i></h4>
                                <button type="button" class="close" onclick="dismiss_reissue_get_price();">&times;</button>
                            </div>
                            <div class="modal-body">
                                <div id="search_result" style="max-height:600px; overflow:auto; padding:15px;">
                                    <div id="bills_detail">

                                    </div>

                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
                `;
                //
                document.getElementById('bills_booking').innerHTML += text;
                document.getElementById('show_title_bills').hidden = false;
                document.getElementById('show_loading_booking_bills').hidden = true;
                add_repricing();
                if(msg.result.response.hasOwnProperty('voucher_reference') && msg.result.response.voucher_reference != '' && msg.result.response.voucher_reference != false){
                    try{
                        render_voucher(price.currency,msg.result.response.voucher_discount, msg.result.response.state)
                    }catch(err){console.log(err);}
                }
                try{
                    if(msg.result.response.state == 'booked' || msg.result.response.state == 'issued' && msg.result.response.voucher_reference)
                        document.getElementById('voucher_div').style.display = 'block';
                    else
                        document.getElementById('voucher_div').style.display = 'none';
                }catch(err){console.log(err);}
                if (msg.result.response.state != 'booked'){
    //                document.getElementById('issued-breadcrumb').classList.add("active");
                }

               }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                   auto_logout();
               }else if(msg.result.error_code == 1035){
                    document.getElementById('show_loading_booking_bills').hidden = true;
                    render_login('ppob');
               }else{
                    text += `<div class="alert alert-danger">
                            <h5>
                                `+msg.result.error_code+`
                            </h5>
                            `+msg.result.error_msg+`
                        </div>`;
                    document.getElementById('bills_booking').innerHTML = text;
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: #ff9900;">Error bills booking </span>' + msg.result.error_msg,
                    })
                    $('#show_loading_booking_bills').hide();
                    $('.loader-rodextrip').fadeOut();
               }
           }catch(err){
               text += `<div class="alert alert-danger">
                            <h5>
                                Error
                            </h5>
                        </div>`;
               document.getElementById('bills_booking').innerHTML = text;
               $('#show_loading_booking_bills').hide();
               $('.loader-rodextrip').fadeOut();
               Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error bills booking </span> Please try again in 1 - 5 minutes later or contact customer service' ,
                }).then((result) => {
                  window.location.href = '/reservation';
                })
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error bills get booking');
            $("#show_loading_booking_bills").hide();
            $("#show_error_booking_bills").show();
            hide_modal_waiting_transaction();
            $('.loader-rodextrip').fadeOut();
       },timeout: 300000
    });
}

function cancel_btn(){
    Swal.fire({
      title: 'Are you sure want to Cancel this booking?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        show_loading();
        please_wait_transaction();
        getToken();
        $.ajax({
           type: "POST",
           url: "/webservice/ppob",
           headers:{
                'action': 'cancel',
           },
           data: {
               'order_number': bills_get_detail.result.response.order_number,
               'signature': signature
           },
           success: function(msg) {
               if(msg.result.error_code == 0){
                   //update ticket
                   window.location = "/ppob/booking/" + bills_get_detail.result.response.order_number;
                   price_arr_repricing = {};
                   pax_type_repricing = [];
                   hide_modal_waiting_transaction();
                   document.getElementById('show_loading_booking_bills').hidden = false;
                   document.getElementById('bills_booking').innerHTML = '';
                   document.getElementById('bills_detail').innerHTML = '';
                   document.getElementById('payment_acq').innerHTML = '';
                   document.getElementById('show_loading_booking_bills').style.display = 'block';
                   document.getElementById('show_loading_booking_bills').hidden = false;
                   document.getElementById('payment_acq').hidden = true;
                   document.getElementById("overlay-div-box").style.display = "none";
                   $(".issued_booking_btn").remove();
                   ppob_get_booking(bills_get_detail.result.response.order_number);
               }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                    auto_logout();
               }else{
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: #ff9900;">Error ppob cancel </span>' + msg.result.error_msg,
                    }).then((result) => {
                      if (result.value) {
                        price_arr_repricing = {};
                        pax_type_repricing = [];
                        document.getElementById('show_loading_booking_bills').hidden = false;
                        document.getElementById('bills_booking').innerHTML = '';
                        document.getElementById('bills_detail').innerHTML = '';
                        document.getElementById('payment_acq').innerHTML = '';
                        document.getElementById('show_loading_booking_bills').style.display = 'block';
                        document.getElementById('show_loading_booking_bills').hidden = false;
                        document.getElementById('payment_acq').hidden = true;

                        hide_modal_waiting_transaction();
                        document.getElementById("overlay-div-box").style.display = "none";

                        $('.hold-seat-booking-train').prop('disabled', false);
                        $('.hold-seat-booking-train').removeClass("running");
                        ppob_get_booking(bills_get_detail.result.response.order_number);
                      }
                    })
               }
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error ppob cancel booking');
                price_arr_repricing = {};
                pax_type_repricing = [];
                document.getElementById('show_loading_booking_bills').hidden = false;
                document.getElementById('bills_booking').innerHTML = '';
                document.getElementById('bills_detail').innerHTML = '';
                document.getElementById('payment_acq').innerHTML = '';
                document.getElementById('show_loading_booking_bills').style.display = 'block';
                document.getElementById('show_loading_booking_bills').hidden = false;
                document.getElementById('payment_acq').hidden = true;

                hide_modal_waiting_transaction();
                document.getElementById("overlay-div-box").style.display = "none";
                $('.hold-seat-booking-train').prop('disabled', false);
                $('.hold-seat-booking-train').removeClass("running");
                ppob_get_booking(bills_get_detail.result.response.order_number);
           },timeout: 300000
        });
      }
    })
}

function resync_status(){
    $.ajax({
       type: "POST",
       url: "/webservice/ppob",
       headers:{
            'action': 'resync_status',
       },
       data: {
            'order_number': bills_get_detail.result.response.order_number,
            'signature': signature
       },
       success: function(msg) {
           if (msg.result.error_code == 0){
                ppob_get_booking(bills_get_detail.result.response.order_number)
           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
               auto_logout();
           }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error bills resync </span>' + msg.result.error_msg,
                })
                $('#show_loading_booking_bills').hide();
                $('.loader-rodextrip').fadeOut();
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error bills sync status');
            $("#show_loading_booking_bills").hide();
            $("#show_error_booking_bills").show();
            hide_modal_waiting_transaction();
            $('.loader-rodextrip').fadeOut();
       },timeout: 300000
    });

}

function ppob_issued(data){
    var temp_data = {}
    if(typeof(bills_get_detail) !== 'undefined')
        temp_data = JSON.stringify(bills_get_detail)
    Swal.fire({
      title: 'Are you sure want to Issued this booking?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        show_loading();
        please_wait_transaction();

        if(document.getElementById('bills_booking'))
        {
            var formData = new FormData($('#bills_booking').get(0));
        }
        else
        {
            var formData = new FormData($('#global_payment_form').get(0));
        }
        formData.append('order_number', data);
        formData.append('acquirer_seq_id', payment_acq2[payment_method][selected].acquirer_seq_id);
        formData.append('member', payment_acq2[payment_method][selected].method);
        formData.append('signature', signature);
        formData.append('voucher_code', voucher_code);
        formData.append('booking', temp_data);

        if (document.getElementById('is_attach_pay_ref') && document.getElementById('is_attach_pay_ref').checked == true)
        {
            formData.append('payment_reference', document.getElementById('pay_ref_text').value);
        }

        getToken();
        $.ajax({
           type: "POST",
           url: "/webservice/ppob",
           headers:{
                'action': 'issued',
           },
           data: formData,
           success: function(msg) {
               if(google_analytics != '')
                   gtag('event', 'ppob_issued', {});
               if(msg.result.error_code == 0){
                   if(document.URL.split('/')[document.URL.split('/').length-1] == 'payment'){
                        window.location.href = '/ppob/booking/' + btoa(data);
                   }else{
                       //update ticket
                       price_arr_repricing = {};
                       pax_type_repricing = [];
                       hide_modal_waiting_transaction();
                       document.getElementById('show_loading_booking_bills').hidden = false;
                       document.getElementById('bills_booking').innerHTML = '';
                       document.getElementById('bills_detail').innerHTML = '';
                       document.getElementById('payment_acq').innerHTML = '';
                       document.getElementById('show_loading_booking_bills').style.display = 'block';
                       document.getElementById('show_loading_booking_bills').hidden = false;
                       document.getElementById('cancel').hidden = true;
                       document.getElementById('payment_acq').hidden = true;
                       document.getElementById("overlay-div-box").style.display = "none";
                       $(".issued_booking_btn").remove();
                       ppob_get_booking(data);
                   }
               }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                    auto_logout();
               }else{
                    if(msg.result.error_code != 1007){
                        Swal.fire({
                          type: 'error',
                          title: 'Oops!',
                          html: '<span style="color: #ff9900;">Error bills issued </span>' + msg.result.error_msg,
                        })
                    }else{
                        Swal.fire({
                          type: 'error',
                          title: 'Error bills issued '+ msg.result.error_msg,
                          showCancelButton: true,
                          cancelButtonText: 'Ok',
                          confirmButtonColor: '#f15a22',
                          cancelButtonColor: '#3085d6',
                          confirmButtonText: 'Top Up'
                        }).then((result) => {
                            if (result.value) {
                                window.location.href = '/top_up';
                            }
                        })
                    }
                    price_arr_repricing = {};
                    pax_type_repricing = [];
                    document.getElementById('show_loading_booking_bills').hidden = false;
                    document.getElementById('bills_booking').innerHTML = '';
                    document.getElementById('bills_detail').innerHTML = '';
                    document.getElementById('payment_acq').innerHTML = '';
                    document.getElementById('show_loading_booking_bills').style.display = 'block';
                    document.getElementById('show_loading_booking_bills').hidden = false;
                    document.getElementById('cancel').hidden = true;
                    document.getElementById('payment_acq').hidden = true;

                    hide_modal_waiting_transaction();
                    document.getElementById("overlay-div-box").style.display = "none";

                    $('.hold-seat-booking-train').prop('disabled', false);
                    $('.hold-seat-booking-train').removeClass("running");
                    ppob_get_booking(data);
               }
           },
           contentType:false,
           processData:false,
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error bills issued');
                price_arr_repricing = {};
                pax_type_repricing = [];
                document.getElementById('show_loading_booking_bills').hidden = false;
                document.getElementById('bills_booking').innerHTML = '';
                document.getElementById('bills_detail').innerHTML = '';
                document.getElementById('payment_acq').innerHTML = '';
                document.getElementById('show_loading_booking_bills').style.display = 'block';
                document.getElementById('show_loading_booking_bills').hidden = false;
                document.getElementById('cancel').hidden = true;
                document.getElementById('payment_acq').hidden = true;
                hide_modal_waiting_transaction();
                document.getElementById("overlay-div-box").style.display = "none";
                $('.hold-seat-booking-train').prop('disabled', false);
                $('.hold-seat-booking-train').removeClass("running");
                ppob_get_booking(data);
           },timeout: 300000
        });
      }
    })
}

function update_service_charge(type){
    repricing_order_number = '';
    if(type == 'booking'){
        upsell = []
        list_price = [];
        for(j in list){
            list_price.push({
                'amount': list[j],
                'currency_code': 'IDR'
            });
        }
        upsell.push({
            'sequence': 0,
            'pricing': JSON.parse(JSON.stringify(list_price))
        });
        repricing_order_number = bills_get_detail.result.response.order_number;
    }else{
        upsell_price = 0;
        upsell = []
        counter_pax = -1;
        currency = 'IDR';
        for(i in all_pax){
            list_price = [];
            for(j in list){
                if(all_pax[i].first_name+all_pax[i].last_name == document.getElementById('selection_pax'+j).value){
                    list_price.push({
                        'amount': list[j],
                        'currency_code': currency
                    });
                    upsell_price += list[j];
                }
            }
            counter_pax++;
            if(list_price.length != 0)
                upsell.push({
                    'sequence': counter_pax,
                    'pricing': JSON.parse(JSON.stringify(list_price))
                });
        }
    }
    $.ajax({
       type: "POST",
       url: "/webservice/ppob",
       headers:{
            'action': 'update_service_charge',
       },
       data: {
           'order_number': JSON.stringify(repricing_order_number),
           'passengers': JSON.stringify(upsell),
           'signature': signature
       },
       success: function(msg) {
           if(msg.result.error_code == 0){
                if(type == 'booking'){
                    price_arr_repricing = {};
                    pax_type_repricing = [];
                    please_wait_transaction();
                    ppob_get_booking(repricing_order_number);
                }else{
                    price_arr_repricing = {};
                    pax_type_repricing = [];
                    get_price_itinerary_cache('review');
                }

                $('#myModalRepricing').modal('hide');
           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
           }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error bill update service charge </span>' + msg.result.error_msg,
                })
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error bill update service charge');
       },timeout: 60000
    });
}

function update_insentif_booker(type){
    repricing_order_number = '';
    if(type == 'booking'){
        booker_insentif = {}
        total_price = 0
        for(j in list){
            total_price += list[j];
        }
        booker_insentif = {
            'amount': total_price
        };
        repricing_order_number = order_number;
    }
    $.ajax({
       type: "POST",
       url: "/webservice/ppob",
       headers:{
            'action': 'booker_insentif_booking',
       },
       data: {
           'order_number': JSON.stringify(repricing_order_number),
           'booker': JSON.stringify(booker_insentif),
           'signature': signature
       },
       success: function(msg) {
           if(msg.result.error_code == 0){
                try{
                    if(type == 'booking'){
                        please_wait_transaction();
                        ppob_get_booking(repricing_order_number);
                        price_arr_repricing = {};
                        pax_type_repricing = [];
                    }
                }catch(err){
                    console.log(err);
                }
                $('#myModalRepricing').modal('hide');
           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
           }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error bills update booker insentif </span>' + msg.result.error_msg,
                })
                $('.loader-rodextrip').fadeOut();
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error bills update booker insentif');
            $('.loader-rodextrip').fadeOut();
       },timeout: 60000
    });

}