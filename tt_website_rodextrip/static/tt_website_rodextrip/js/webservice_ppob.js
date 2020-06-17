
function signin_ppob(data){
    try{
        $('.btn-next').addClass("running");
        $('.btn-next').prop('disabled', true);
    }catch(err){}
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
                    search_ppob();
                else
                    ppob_get_booking(data);
            }

       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status == 500){
                $('.payment_acq_btn').prop('disabled', false);
                $('.hold-seat-booking-train').removeClass("running");
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error issued offline signin </span>' + errorThrown,
                })
            }
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
            console.log(msg);
//            get_carriers_ppob();
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
                        text+=`<img src="/static/tt_website_rodextrip/images/icon/bpjs.png" style="width:60px; height:60px;"><br/>`;
                    }else if(i == 'pln'){
                        text+=`<img src="/static/tt_website_rodextrip/images/icon/pln.png" style="width:60px; height:60px;"><br/>`;
                    }
                text+=`<div style="text-align:center;"><span style="font-size:15px; color:`+text_color+`;">`+i.toString().toUpperCase()+`</span></div>
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
            if(XMLHttpRequest.status == 500){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error get signature </span>' + errorThrown,
                })
            }
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
            console.log(msg);
            if(msg.result.error_code == 0){
                carrier_ppob = msg.result.response;
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status == 500){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error get signature </span>' + errorThrown,
                })
            }
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
            console.log(msg);
            if(msg.result.error_code == 0){
                carrier_provider_ppob = msg.result.response;
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status == 500){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error get signature </span>' + errorThrown,
                })
            }
       },timeout: 60000
    });
}

function search_ppob(){
    product_code = '';
    customer_number = '';
    amount_of_month = 0;
    total = 0;
    error_log = '';
    customer_number = document.getElementById('bpjs_number').value;
    customer_email = '';
    check_break = false;
    if(bill_type == 'bpjs'){
        product_code = document.getElementById('bpjs_type').value;
        amount_of_month = document.getElementById('bpjs_month').value;
        if(document.getElementById('bpjs_type').options[document.getElementById('bpjs_type').selectedIndex].text == 'BPJS Kesehatan'){
            if(check_number(customer_number) == true){
                for(i in ppob_data.product_data){
                    if(check_break == false){
                        for(j in ppob_data.product_data[i]){
                            if(ppob_data.product_data[i][j].name == document.getElementById('bpjs_type').options[document.getElementById('bpjs_type').selectedIndex].text){
                                if(customer_number.length < ppob_data.product_data[i][j].min_cust_number || customer_number.length > ppob_data.product_data[i][j].max_cust_number){
                                    error_log += 'Please check customer number must between '+ppob_data.product_data[i][j].min_cust_number+ ' to '+ ppob_data.product_data[i][j].max_cust_number+'\n';
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
                            if(ppob_data.product_data[i][j].name == document.getElementById('bpjs_type').options[document.getElementById('bpjs_type').selectedIndex].text){
                                error_log += 'Please check customer number must between '+ppob_data.product_data[i][j].min_cust_number+ ' to '+ ppob_data.product_data[i][j].max_cust_number+'\n';
                                check_break = true;
                                break;
                            }
                        }
                    }else{
                        break;
                    }
                }
            }
        }
    }else{
        product_code = document.getElementById('pln_type').value;
        if(document.getElementById('pln_type').options[document.getElementById('pln_type').selectedIndex].text == 'PLN Prepaid'){
            if(check_pln_prepaid(customer_number) == true){
                for(i in ppob_data.product_data){
                    if(check_break == false){
                        for(j in ppob_data.product_data[i]){
                            if(ppob_data.product_data[i][j].name == document.getElementById('pln_type').options[document.getElementById('pln_type').selectedIndex].text){
                                if(customer_number.length < ppob_data.product_data[i][j].min_cust_number || customer_number.length > ppob_data.product_data[i][j].max_cust_number){
                                    error_log += 'Please check customer number must between '+ppob_data.product_data[i][j].min_cust_number+ ' to '+ ppob_data.product_data[i][j].max_cust_number+'\n';
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
                            if(ppob_data.product_data[i][j].name == document.getElementById('pln_type').options[document.getElementById('pln_type').selectedIndex].text){
                                error_log += 'Please check customer number must between '+ppob_data.product_data[i][j].min_cust_number+ ' to '+ ppob_data.product_data[i][j].max_cust_number+'\n';
                                check_break = true;
                                break;
                            }
                        }
                    }else{
                        break;
                    }
                }
            }
        }else if(document.getElementById('pln_type').options[document.getElementById('pln_type').selectedIndex].text == 'PLN Postpaid'){
            if(check_pln_postpaid(customer_number) == true){
                for(i in ppob_data.product_data){
                    if(check_break == false){
                        for(j in ppob_data.product_data[i]){
                            if(ppob_data.product_data[i][j].name == document.getElementById('pln_type').options[document.getElementById('pln_type').selectedIndex].text){
                                if(customer_number.length < ppob_data.product_data[i][j].min_cust_number || customer_number.length > ppob_data.product_data[i][j].max_cust_number){
                                    error_log += 'Please check customer number must between '+ppob_data.product_data[i][j].min_cust_number+ ' to '+ ppob_data.product_data[i][j].max_cust_number+'\n';
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
                            if(ppob_data.product_data[i][j].name == document.getElementById('pln_type').options[document.getElementById('pln_type').selectedIndex].text){
                                error_log += 'Please check customer number must between '+ppob_data.product_data[i][j].min_cust_number+ ' to '+ ppob_data.product_data[i][j].max_cust_number+'\n';
                                check_break = true;
                                break;
                            }
                        }
                    }else{
                        break;
                    }
                }
            }
        }else if(document.getElementById('pln_type').options[document.getElementById('pln_type').selectedIndex].text == 'PLN Non Tagihan'){
            if(check_pln_non_tagihan(customer_number) == true){
                for(i in ppob_data.product_data){
                    if(check_break == false){
                        for(j in ppob_data.product_data[i]){
                            if(ppob_data.product_data[i][j].name == document.getElementById('pln_type').options[document.getElementById('pln_type').selectedIndex].text){
                                if(customer_number.length < ppob_data.product_data[i][j].min_cust_number || customer_number.length > ppob_data.product_data[i][j].max_cust_number){
                                    error_log += 'Please check customer number must between '+ppob_data.product_data[i][j].min_cust_number+ ' to '+ ppob_data.product_data[i][j].max_cust_number+'\n';
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
                            if(ppob_data.product_data[i][j].name == document.getElementById('pln_type').options[document.getElementById('pln_type').selectedIndex].text){
                                error_log += 'Please check customer number must between '+ppob_data.product_data[i][j].min_cust_number+ ' to '+ ppob_data.product_data[i][j].max_cust_number+'\n';
                                check_break = true;
                                break;
                            }
                        }
                    }else{
                        break;
                    }
                }
            }
        }
    }

    try{
        total = document.getElementById('pln_nominal').value
    }catch(err){}
    try{
        customer_email = document.getElementById('customer_email').value
    }catch(err){}
    if(product_code != '' && customer_number != '' && error_log == ''){
        console.log(carrier_provider_ppob);
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
                'amount_of_month': amount_of_month,
                'customer_email': customer_email
           },
           success: function(msg) {
                console.log(msg);
                bill_response = msg;
                if(msg.result.error_code == 0){
                    currency = '';
                    total_price = 0;
                    commission = 0;
                    for(i in msg.result.response.provider_booking){
                        for(j in msg.result.response.provider_booking[i].service_charges){
                            if(currency == '')
                                currency = msg.result.response.provider_booking[0].service_charges[i].currency
                            if(msg.result.response.provider_booking[i].service_charges[j].charge_type != 'RAC')
                                total_price += msg.result.response.provider_booking[i].service_charges[j].amount;
                            else
                                commission += msg.result.response.provider_booking[i].service_charges[j].amount;
                        }
                    }
                    //open modal
                    document.getElementById('bills_response').innerHTML = `
                        <div class="col-lg-3 col-md-4 col-sm-6 col-xs-6">
                            <div style="padding-bottom:15px;"><span style="font-size:13px;font-weight:500;">Number:</span></div>
                            <div style="padding-bottom:15px;"><span style="font-size:13px;font-weight:500;">Name:</span></div>
                            <div style="padding-bottom:15px;"><span style="font-size:13px;font-weight:500;">Total:</span></div>
                        </div>
                        <div class="col-lg-9 col-md-8 col-sm-6 col-xs-6">
                            <div style="padding-bottom:15px;">`+msg.result.response.provider_booking[0].customer_number+`</div>
                            <div style="padding-bottom:15px;">`+msg.result.response.provider_booking[0].customer_name+`</div>
                            <div style="padding-bottom:15px;">`+currency+` `+getrupiah(total_price)+`</div>
                        </div>
                    `;
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
                if(XMLHttpRequest.status == 500){
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: red;">Error get signature </span>' + errorThrown,
                    })
                }
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
//    if(user_login.co_agent_frontend_security.includes('b2c_limitation')){
//        document.getElementById("passengers").value = JSON.stringify({"booker":{"booker_seq_id":bill_response.result.response.booker.seq_id}});
//        document.getElementById("signature").value = signature;
//        document.getElementById("provider").value = 'ppob';
//        document.getElementById("type").value = 'bills';
//        document.getElementById("voucher_code").value = '';
//        document.getElementById("discount").value = JSON.stringify({});
//        document.getElementById("session_time_input").value = 600;
//        send_url_booking('bills', btoa(bill_response.result.response.order_number), bill_response.result.response.order_number);
//        document.getElementById('order_number').value = bill_response.result.response.order_number;
//        document.getElementById('ppob_issued').submit();
//    }else{
//        document.getElementById('bill_searchForm').innerHTML+= '<input type="hidden" name="order_number" value='+bill_response.result.response.order_number+'>';
//        document.getElementById('bill_searchForm').action = '/ppob/booking/' + btoa(bill_response.result.response.order_number);
//        document.getElementById('bill_searchForm').submit();
//    }
    //testing
    document.getElementById('bill_searchForm').innerHTML+= '<input type="hidden" name="order_number" value='+bill_response.result.response.order_number+'>';
    document.getElementById('bill_searchForm').action = '/ppob/booking/' + btoa(bill_response.result.response.order_number);
    document.getElementById('bill_searchForm').submit();

}

function ppob_get_booking(data){
    price_arr_repricing = {};
    get_balance('false');
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
           console.log(msg);
           bills_get_detail = msg;
           get_payment = false;
           //get booking view edit here
           if(msg.result.error_code == 0){
            var text = '';
            $text = '';
            check_provider_booking = 0;
            if(msg.result.response.hold_date != false && msg.result.response.hold_date != ''){
                tes = moment.utc(msg.result.response.hold_date).format('YYYY-MM-DD HH:mm:ss')
                localTime  = moment.utc(tes).toDate();
                msg.result.response.hold_date = moment(localTime).format('DD MMM YYYY HH:mm');
                var now = moment();
                var hold_date_time = moment(msg.result.response.hold_date, "DD MMM YYYY HH:mm");
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
            }else if(msg.result.response.state == 'cancel2'){
               document.getElementById('issued-breadcrumb').classList.remove("br-active");
               document.getElementById('issued-breadcrumb').classList.add("br-fail");
               //document.getElementById('issued-breadcrumb').classList.remove("current");
               //document.getElementById('header_issued').innerHTML = `Fail <i class="fas fa-times"></i>`;
               document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
               document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-fail");
               document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
               document.getElementById('issued-breadcrumb-span').innerHTML = `Expired`;
            }else if(msg.result.response.state == 'fail_booked'){
               document.getElementById('issued-breadcrumb').classList.remove("br-active");
               document.getElementById('issued-breadcrumb').classList.add("br-fail");
               //document.getElementById('issued-breadcrumb').classList.remove("current");
               //document.getElementById('header_issued').innerHTML = `Fail <i class="fas fa-times"></i>`;
               document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
               document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-fail");
               document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
               document.getElementById('issued-breadcrumb-span').innerHTML = `Fail (Book)`;
            }else if(msg.result.response.state == 'booked'){
               try{
                   if(now.diff(hold_date_time, 'minutes')<0)
                       check_payment_payment_method(msg.result.response.order_number, 'Issued', msg.result.response.booker.seq_id, 'billing', 'bills', signature, msg.result.response.payment_acquirer_number);
                   get_payment = true;
//                   get_payment_acq('Issued',msg.result.response.booker.seq_id, msg.result.response.order_number, 'billing',signature,'airline');
                   document.getElementById('voucher_div').style.display = '';
                   //document.getElementById('issued-breadcrumb').classList.remove("active");
                   //document.getElementById('issued-breadcrumb').classList.add("current");
                   document.getElementById('issued-breadcrumb').classList.add("br-active");
                   document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-active");
               }catch(err){}
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
            }else{
               //document.getElementById('issued-breadcrumb').classList.remove("current");
               //document.getElementById('issued-breadcrumb').classList.add("active");
               document.getElementById('issued-breadcrumb').classList.add("br-active");
               document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-active");
               document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-check"></i>`;
            }

            if(msg.result.response.state == 'issued'){
                try{
                    document.getElementById('voucher_discount').style.display = 'none';
                }catch(err){}
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
                    if(now.diff(hold_date_time, 'minutes')<0)
                        $(".issued_booking_btn").show();
                }catch(err){}
                check_provider_booking++;
            }
            else{
                //$(".issued_booking_btn").remove();
                $('.loader-rodextrip').fadeOut();
                $("#waitingTransaction").modal('hide');
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
                        <th>PNR</th>
                        <th>Hold Date</th>
                        <th>Status</th>
                    </tr>`;
                    printed_hold_date = false;
                    for(i in msg.result.response.provider_booking){
                        if(msg.result.response.state == 'booked' && printed_hold_date == false){
                            if(get_payment == false){
                               check_payment_payment_method(msg.result.response.order_number, 'Issued', msg.result.response.booker.seq_id, 'billing', 'bills', signature, msg.result.response.payment_acquirer_number);
                               get_payment = true;
                            }
//                                check_payment_payment_method(msg.result.response.order_number, 'Issued', msg.result.response.booker.seq_id, 'billing', 'airline', signature);
//                            get_payment_acq('Issued',msg.result.response.booker.seq_id, msg.result.response.order_number, 'billing',signature,'airline');
                            $text += 'Please make payment before '+ msg.result.response.hold_date + `\n`;
                            try{
                                if(now.diff(hold_date_time, 'minutes')<0)
                                    $(".issued_booking_btn").show();
                            }catch(err){}
                            check_provider_booking++;
                            printed_hold_date = true;
                        }
                        //datetime utc to local
                        if(msg.result.response.provider_booking[i].error_msg.length != 0)
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
                        text+=`
                            <td>`+msg.result.response.hold_date+`</td>
                            <td id='pnr'>`+msg.result.response.state_description+`</td>
                        </tr>`;
                    }
                    if(check_provider_booking == 0 && msg.result.response.state != 'issued'){
                        $text += msg.result.response.state_description+'\n';
                        check_provider_booking++;
                        $(".issued_booking_btn").remove();
                    }
                    $text +='\n';
            text+=`</table>
            </div>

            <div style="background-color:white; border:1px solid #cdcdcd;">
                <div class="row">
                    <div class="col-lg-12">
                        <div style="padding:10px; background-color:white;">
                        <h5> Bill Details <img style="width:18px;" src="/static/tt_website_rodextrip/images/icon/plane.png"/></h5>
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
                        if (msg.result.response.state == 'booked'){
                            text+=`
                            <a href="#" id="seat-map-link" class="hold-seat-booking-train ld-ext-right" style="color:`+text_color+`;" hidden>
                                <input type="button" id="button-choose-print" class="primary-btn" style="width:100%;" value="Print Ticket" onclick=""/>
                                <div class="ld ld-ring ld-cycle"></div>
                            </a>`;
                        }else if (msg.result.response.state == 'issued'){
                            text+=`
                            <a href="#" id="seat-map-link" class="hold-seat-booking-train ld-ext-right" style="color:`+text_color+`;">
                                <input type="button" id="button-choose-print" class="primary-btn" style="width:100%;" value="Print Ticket" onclick="get_printout('`+msg.result.response.order_number+`', 'ticket','ppob');"/>
                                <div class="ld ld-ring ld-cycle"></div>
                            </a>`;
                        }
                    }
                    text+=`
                </div>
                <div class="col-lg-4" style="padding-bottom:10px;">`;
                    if(msg.result.response.state != 'cancel' && msg.result.response.state != 'cancel2'){
                        if (msg.result.response.state  == 'booked'){
                            text+=`
                            <a class="print-booking-train ld-ext-right" style="color:`+text_color+`;">
                                <input type="button" class="primary-btn" id="button-print-print" style="width:100%;" value="Print Form" onclick="get_printout('`+msg.result.response.order_number+`', 'itinerary','ppob');" />
                                <div class="ld ld-ring ld-cycle"></div>
                            </a>`;
                        }
                    }
                        text+=`
                </div>
                <div class="col-lg-4" style="padding-bottom:10px;">`;
                    if(msg.result.response.state != 'cancel' && msg.result.response.state != 'cancel2'){
                        if (msg.result.response.state  == 'booked'){
                            text+=`
                            <a class="issued-booking-train ld-ext-right" id="print_invoice" style="color:`+text_color+`;" hidden>
                                <input type="button" class="primary-btn" id="button-issued-print" style="width:100%;" value="Issued" onclick=""/>
                                <div class="ld ld-ring ld-cycle"></div>
                            </a>`;
                        }
                        else if (msg.result.response.state == 'issued'){
                            text+=`
                            <a class="issued-booking-train ld-ext-right" style="color:`+text_color+`;">
                                <input type="button" class="primary-btn" id="button-issued-print" style="width:100%;" data-toggle="modal" data-target="#printInvoice" value="Print Invoice"/>
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
                                                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                        <span class="control-label" for="Name">Name</span>
                                                        <div class="input-container-search-ticket">
                                                            <input type="text" class="form-control o_website_form_input" id="bill_name" name="bill_name" placeholder="Name" required="1"/>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                                        <span class="control-label" for="Additional Information">Additional Information</span>
                                                        <div class="input-container-search-ticket">
                                                            <textarea style="width:100%;" rows="4" id="additional_information" name="additional_information" placeholder="Additional Information"></textarea>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                                        <span class="control-label" for="Address">Address</span>
                                                        <div class="input-container-search-ticket">
                                                            <textarea style="width:100%;" rows="4" id="bill_address" name="bill_address" placeholder="Address"></textarea>
                                                            <!--<input type="text" class="form-control o_website_form_input" id="bill_name" name="bill_address" placeholder="Address" required="1"/>-->
                                                        </div>
                                                    </div>
                                                </div>
                                                <br/>
                                                <div style="text-align:right;">
                                                    <span>Don't want to edit? just submit</span>
                                                    <br/>
                                                    <input type="button" class="primary-btn" id="button-issued-print" style="width:30%;" value="Submit" onclick="get_printout('`+msg.result.response.order_number+`', 'invoice','ppob');"/>
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
            total_price_provider = [];
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
                    for(j in msg.result.response.provider_booking[i].service_charges){
                        if(currency == '')
                            currency = msg.result.response.provider_booking[i].service_charges[j].currency;
                        if(msg.result.response.provider_booking[i].service_charges[j].charge_type == 'RAC')
                            rac += msg.result.response.provider_booking[i].service_charges[j].amount;
                        if(msg.result.response.provider_booking[i].service_charges[j].charge_type == 'ROC')
                            roc += msg.result.response.provider_booking[i].service_charges[j].amount;
                    }
                    if(msg.result.response.provider_booking[i].bill_details.length != 0){
                        msg.result.response.provider_booking[i].bill_details.push({
                            "customer_name": "Service Charges",
                            "currency": currency,
                            "total": roc
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
                            text_repricing += `<div id='repricing_button' class="col-lg-12" style="text-align:center;"></div>`;
                            document.getElementById('repricing_div').innerHTML = text_repricing;
                            //repricing

                            text_detail+=`
                            <div class="row" style="margin-bottom:5px;">
                                <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                    <span style="font-size:12px;">`+msg.result.response.provider_booking[i].bill_details[j].customer_name+`</span>`;
                                text_detail+=`</div>
                                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                    <span style="font-size:13px;">`+price.currency+` `+getrupiah(parseInt(price.FARE + price.TAX + price.ROC + price.CSC + price.SSR + price.SEAT + price.DISC))+`</span>
                                </div>
                            </div>`;
                            $text += msg.result.response.provider_booking[i].bill_details[j].customer_name + ' ['+msg.result.response.provider_booking[i].pnr+'] ';

                            $text += price.currency+` `+getrupiah(parseInt(price.FARE + price.SSR + price.SEAT + price.TAX + price.ROC + price.CSC + price.DISC))+'\n';
                            if(counter_service_charge == 0){
                                total_price += parseInt(price.TAX + price.ROC + price.FARE + price.SEAT + price.CSC + price.SSR + price.DISC);
                                price_provider += parseInt(price.TAX + price.ROC + price.FARE + price.SEAT + price.CSC + price.SSR + price.DISC);
                            }else{
                                total_price += parseInt(price.TAX + price.ROC + price.FARE + price.SSR + price.SEAT + price.DISC);
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
                                price_provider += parseInt(price.TAX + price.ROC + price.FARE + price.SEAT + price.CSC + price.SSR + price.DISC);
                            }else{
                                total_price += parseInt(price.TAX + price.ROC + price.FARE + price.SSR + price.SEAT + price.DISC);
                                price_provider += parseInt(price.TAX + price.ROC + price.FARE + price.SSR + price.SEAT + price.DISC);
                            }
                            commission += parseInt(price.RAC);
                        }
                    }
                    total_price_provider.push({
                        'pnr': msg.result.response.provider_bookings[i].pnr,
                        'price': price_provider
                    })
                    price_provider = 0;
                    counter_service_charge++;
                }catch(err){}
            }
            try{
                bills_get_detail.result.response.total_price = total_price;
                $text += 'Grand Total: '+price.currency+' '+ getrupiah(total_price);
                if(check_provider_booking != 0 && msg.result.response.state == 'booked'){
                    $text += '\n\nPrices and availability may change at any time';
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
                if(msg.result.response.state == 'booked')
                    text_detail+=`<div style="text-align:right; padding-bottom:10px;"><img src="/static/tt_website_rodextrip/img/bank.png" style="width:25px; height:25px; cursor:pointer;" onclick="show_repricing();"/></div>`;
                text_detail+=`<div class="row">
                <div class="col-lg-12" style="padding-bottom:10px;">
                    <hr/>
                    <span style="font-size:14px; font-weight:bold;">Share This on:</span><br/>`;
                    share_data();
                    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                    if (isMobile) {
                        text_detail+=`
                            <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png"/></a>
                            <a href="line://msg/text/`+ $text_share +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png"/></a>
                            <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png"/></a>
                            <a href="mailto:?subject=This is the bill price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png"/></a>`;
                    } else {
                        text_detail+=`
                            <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png"/></a>
                            <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png"/></a>
                            <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png"/></a>
                            <a href="mailto:?subject=This is the bill price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png"/></a>`;
                    }

                text_detail+=`
                    </div>
                </div>`;
                if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false)
                    text_detail+=`
                    <div class="row" id="show_commission" style="display:none;">
                        <div class="col-lg-12 col-xs-12" style="text-align:center;">
                            <div class="alert alert-success">
                                <span style="font-size:13px; font-weight:bold;">Your Commission: `+price.currency+` `+getrupiah(parseInt(rac)*-1)+`</span><br>
                            </div>
                        </div>
                    </div>`;
                text_detail+=`<center>

                <div style="padding-bottom:10px;">
                    <center>
                        <input type="button" class="primary-btn-ticket" style="width:100%;" onclick="copy_data();" value="Copy"/>
                    </center>
                </div>`;
                if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false)
                text_detail+=`
                <div style="margin-bottom:5px;">
                    <input class="primary-btn-ticket" id="show_commission_button" style="width:100%;" type="button" onclick="show_commission('commission');" value="Show Commission"/>
                </div>`;
                if(msg.result.response.state == 'fail_issued' || msg.result.response.state == 'fail_refunded')
                text_detail+=`
                <div style="margin-bottom:5px;">
                    <input class="primary-btn-ticket" style="width:100%;" type="button" onclick="resync_status();" value="Resync"/>
                </div>`;
                text+=`
            </div>`;
            }catch(err){}
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
                            <div id="search_result" style="overflow:auto;height:300px;margin-top:20px;">
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
                            <button type="button" class="btn btn-default" data-dismiss="modal" onclick="airline_issued('`+msg.result.response.order_number+`');">Force Issued</button>
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
                            <div id="search_result" style="overflow:auto;height:300px;margin-top:20px;">
                                <div id="airline_ticket_pick">

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
                            <div id="search_result" style="overflow:auto;height:300px;margin-top:20px;">
                                <div id="airline_detail">

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
            if (msg.result.response.state != 'booked'){
//                document.getElementById('issued-breadcrumb').classList.add("active");
            }

           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
               auto_logout();
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
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
          if(XMLHttpRequest.status == 500){
              $("#show_loading_booking_bills").hide();
              $("#show_error_booking_bills").show();
              Swal.fire({
                type: 'error',
                title: 'Oops!',
                html: '<span style="color: red;">Error bills booking </span>' + errorThrown,
              }).then((result) => {
                  if (result.value) {
                    $("#waitingTransaction").modal('hide');
                  }
                })
              $('.loader-rodextrip').fadeOut();
              $("#waitingTransaction").modal('hide');
          }
       },timeout: 300000
    });
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
           console.log(msg);
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
          if(XMLHttpRequest.status == 500){
              $("#show_loading_booking_bills").hide();
              $("#show_error_booking_bills").show();
              Swal.fire({
                type: 'error',
                title: 'Oops!',
                html: '<span style="color: red;">Error bills booking </span>' + errorThrown,
              }).then((result) => {
                  if (result.value) {
                    $("#waitingTransaction").modal('hide');
                  }
                })
              $('.loader-rodextrip').fadeOut();
              $("#waitingTransaction").modal('hide');
          }
       },timeout: 300000
    });

}

function ppob_issued(data){
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
        getToken();
        $.ajax({
           type: "POST",
           url: "/webservice/ppob",
           headers:{
                'action': 'issued',
           },
           data: {
               'order_number': data,
               'seq_id': payment_acq2[payment_method][selected].seq_id,
               'member': payment_acq2[payment_method][selected].method,
               'voucher_code': voucher_code,
               'signature': signature
           },
           success: function(msg) {
               console.log(msg);
               if(msg.result.error_code == 0){
                   //update ticket
                   price_arr_repricing = {};
                   pax_type_repricing = [];
                   $("#waitingTransaction").modal('hide');
                   document.getElementById('show_loading_booking_bills').hidden = false;
                   document.getElementById('bills_booking').innerHTML = '';
                   document.getElementById('bills_detail').innerHTML = '';
                   document.getElementById('payment_acq').innerHTML = '';
                   document.getElementById('show_loading_booking_bills').style.display = 'block';
                   document.getElementById('show_loading_booking_bills').hidden = false;
                   document.getElementById('payment_acq').hidden = true;
                   document.getElementById("overlay-div-box").style.display = "none";
                   $(".issued_booking_btn").remove();
                   ppob_get_booking(data);
               }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                    auto_logout();
               }else{
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: #ff9900;">Error bills issued </span>' + msg.result.error_msg,
                    })
                    price_arr_repricing = {};
                    pax_type_repricing = [];
                    document.getElementById('show_loading_booking_bills').hidden = false;
                    document.getElementById('bills_booking').innerHTML = '';
                    document.getElementById('bills_detail').innerHTML = '';
                    document.getElementById('payment_acq').innerHTML = '';
                    document.getElementById('show_loading_booking_bills').style.display = 'block';
                    document.getElementById('show_loading_booking_bills').hidden = false;
                    document.getElementById('payment_acq').hidden = true;

                    $("#waitingTransaction").modal('hide');
                    document.getElementById("overlay-div-box").style.display = "none";

                    $('.hold-seat-booking-train').prop('disabled', false);
                    $('.hold-seat-booking-train').removeClass("running");
                    ppob_get_booking(data);
               }
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                if(XMLHttpRequest.status == 500){
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: red;">Error bills issued </span>' + errorThrown,
                    })
                    price_arr_repricing = {};
                    pax_type_repricing = [];
                    document.getElementById('show_loading_booking_bills').hidden = false;
                    document.getElementById('bills_booking').innerHTML = '';
                    document.getElementById('bills_detail').innerHTML = '';
                    document.getElementById('payment_acq').innerHTML = '';
                    document.getElementById('show_loading_booking_bills').style.display = 'block';
                    document.getElementById('show_loading_booking_bills').hidden = false;
                    document.getElementById('payment_acq').hidden = true;
                    $("#waitingTransaction").modal('hide');
                    document.getElementById("overlay-div-box").style.display = "none";
                    $('.hold-seat-booking-train').prop('disabled', false);
                    $('.hold-seat-booking-train').removeClass("running");
                    ppob_get_booking(data);
                }
           },timeout: 300000
        });
      }
    })
}