function medical_signin(data){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/medical",
       headers:{
            'action': 'signin',
       },
//       url: "{% url 'tt_backend_rodextrip:social_media_tree_update' %}",
       data: {},
       success: function(msg) {
       try{
           console.log(msg);
           if(msg.result.error_code == 0){
               medical_signature = msg.result.response.signature;
               signature = msg.result.response.signature;
               if(data == 'passenger'){
                    if(vendor == "phc"){
                        get_config_medical(data, vendor);
                    }
                    medical_get_availability();
               }else{
                    //get booking
                    medical_get_booking(data);
               }
           }else{
               Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: msg.result.error_msg,
               })
               $('.loader-rodextrip').fadeOut();
               try{
                $("#show_loading_booking_airline").hide();
               }catch(err){}
           }
       }catch(err){
            console.log(err);
           Swal.fire({
               type: 'error',
               title: 'Oops...',
               text: 'Something went wrong, please try again or check your internet connection',
           })
           $('.loader-rodextrip').fadeOut();
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
          error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error airline signin');
          $("#barFlightSearch").hide();
          $("#waitFlightSearch").hide();
          $('.loader-rodextrip').fadeOut();
          try{
            $("#show_loading_booking_airline").hide();
          }catch(err){}
       },timeout: 60000
    });

}

function get_config_medical(type='', vendor=''){
    $.ajax({
       type: "POST",
       url: "/webservice/medical",
       headers:{
            'action': 'get_config',
       },
       data: {
            'signature': signature,
            'provider': vendor
       },
       success: function(msg) {
            console.log(msg);
            if(msg.result.error_code == 0){
                if(type == 'passenger'){
                    medical_config = msg;
                }else if(type == 'home'){
                    var text = '';
                    if(vendor == 'phc'){
                        for(i in msg.result.response.carrier_type){
                            text += '<option value="'+i+'">' + msg.result.response.carrier_type[i].name + '</option>';
                        }
                        document.getElementById('medical_type').innerHTML += text;
                        $('#medical_type').niceSelect('update');
                    }else if(vendor == 'periksain'){
                        for(i in msg.result.response)
                            document.getElementById('medical_searchForm1').action = 'periksain/passenger/' + i;
                    }
                }
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get config medical');
       },timeout: 300000
    });
}

function get_kecamatan(id_kabupaten,id_kecamatan){
    $.ajax({
       type: "POST",
       url: "/webservice/medical",
       headers:{
            'action': 'get_kecamatan',
       },
       data: {
            'signature': signature,
            'kabupaten': document.getElementById(id_kabupaten).value
       },
       success: function(msg) {
            console.log(msg);
            if(msg.result.error_code == 0){
                var text = '';
                for(i in msg.result.response.kecamatan){
                    text += '<option value="'+msg.result.response.kecamatan[i].code+'">'+msg.result.response.kecamatan[i].value+"</option>";
                }
                document.getElementById(id_kecamatan).innerHTML = text;
                get_desa(id_kecamatan, id_kecamatan.replace('kec','desa'));
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get config medical');
       },timeout: 300000
    });
}

function get_desa(id_kecamatan,id_desa){
    $.ajax({
       type: "POST",
       url: "/webservice/medical",
       headers:{
            'action': 'get_desa',
       },
       data: {
            'signature': signature,
            'kecamatan': document.getElementById(id_kecamatan).value
       },
       success: function(msg) {
            console.log(msg);
            if(msg.result.error_code == 0){
                var text = '';
                for(i in msg.result.response.desa){
                    text += '<option value="'+msg.result.response.desa[i].code+'">'+msg.result.response.desa[i].value+"</option>";
                }
                document.getElementById(id_desa).innerHTML = text;
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get config medical');
       },timeout: 300000
    });
}

function medical_get_availability(){
    $.ajax({
       type: "POST",
       url: "/webservice/medical",
       headers:{
            'action': 'get_availability',
       },
       data: {
            'signature': signature,
            'provider': vendor,
       },
       success: function(msg) {
            console.log(msg);
            if(msg.result.error_code == 0){
                medical_get_availability_response = msg.result.response;
                var text_innerHTML = '';
                for(i in msg.result.response.timeslot){
                    text_innerHTML += `<option value=`+i+`>`+i+`</option>`;
                }
                document.getElementById('booker_area').innerHTML = text_innerHTML;
                $('#booker_area').niceSelect('update');
                document.getElementById('add_test_time_button').hidden = false;
                add_other_time();
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get availability medical');
       },timeout: 300000
    });
}

function medical_check_price(){
    var timeslot_list = [];
    for(i=1;i <= test_time; i++){
        try{
            timeslot_list.push(document.getElementById('booker_timeslot_id'+i).value.split('~')[0])
        }catch(err){}
    }
    if(timeslot_list.length != 0){
        $.ajax({
           type: "POST",
           url: "/webservice/medical",
           headers:{
                'action': 'get_price',
           },
           data: {
                'signature': signature,
                'provider': vendor,
                'pax_count': document.getElementById('passenger').value,
                'timeslot_list': JSON.stringify(timeslot_list)
           },
           success: function(msg) {
                console.log(msg);
                try{
                if(msg.result.error_code == 0){
                    var text = `
                    <div style="background-color:white; padding:10px; border: 1px solid #cdcdcd; margin-bottom:15px;">
                        <h5> Price Detail</h5>
                    <hr/>`;
                    text+=`
                        <div class="row" style="margin-bottom:5px;">
                            <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                <span style="font-size:12px;">`+msg.result.response.service_charges[0].pax_count+`x Fare @IDR `+getrupiah(msg.result.response.service_charges[0].amount)+`</span>`;
                            text+=`</div>
                            <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                <span style="font-size:13px;">IDR `+getrupiah(msg.result.response.total_price)+`</span>
                            </div>
                        </div>`;
                    if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
                        text+=`
                            <div class="col-lg-12" style="text-align:center; display:none;" id="show_commission">
                                <div class="alert alert-success">
                                    <span style="font-size:13px; font-weight: bold;">Your Commission: IDR `+getrupiah(msg.result.response.total_commission*-1)+`</span><br>
                                </div>
                            </div>`;
                    if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
                        text+=`
                            <input class="primary-btn-white" id="show_commission_button" style="width:100%;" type="button" onclick="show_commission('commission');" value="Show Commission"><br/>`;
                    var tempcounter = parseInt(document.getElementById('passenger').value);
                    for(counting=0;counting<tempcounter;counting++){
                        if(counting == 0){
                            if(vendor == 'phc'){
                                add_table_passenger_phc('open');
                            }else if(vendor == 'periksain'){
                                add_table_of_passenger('open');
                            }
                        }else{
                            if(vendor == 'phc'){
                                add_table_passenger_phc();
                            }else if(vendor == 'periksain'){
                                add_table_of_passenger();
                            }
                        }
                    }
                    document.getElementById('medical_detail').innerHTML = text;
                    document.getElementById('medical_detail').style.display = 'block';
                    document.getElementById('next_medical').style.display = 'block';
                    document.getElementById('table_passenger_list').style.display = 'block';
                    //print harga
                }
                }catch(err){console.log(err);}
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get price medical');
           },timeout: 300000
        });
    }else{
        Swal.fire({
            type: 'error',
            title: 'Oops!',
            html: 'Please choose timeslot!',
        })
    }
}

function medical_get_cache_price(){
    $.ajax({
       type: "POST",
       url: "/webservice/medical",
       headers:{
            'action': 'get_price_cache',
       },
       data: {
            'signature': signature,
       },
       success: function(msg) {
            console.log(msg);
            try{
            if(msg.result.error_code == 0){
                var text = `
                <div style="background-color:white; padding:10px; border: 1px solid #cdcdcd; margin-bottom:15px;">
                    <h5> Price Detail</h5>
                <hr/>`;
                text+=`
                    <div class="row" style="margin-bottom:5px;">
                        <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                            <span style="font-size:12px;">`+msg.result.response.service_charges[0].pax_count+`x Fare @IDR `+getrupiah(msg.result.response.service_charges[0].amount)+`</span>`;
                        text+=`</div>
                        <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                            <span style="font-size:13px;">IDR `+getrupiah(msg.result.response.total_price)+`</span>
                        </div>
                    </div>`;
                if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
                    text+=`
                        <div class="col-lg-12" style="text-align:center; display:none;" id="show_commission">
                            <div class="alert alert-success">
                                <span style="font-size:13px; font-weight: bold;">Your Commission: IDR `+getrupiah(msg.result.response.total_commission*-1)+`</span><br>
                            </div>
                        </div>`;
                if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
                    text+=`
                        <input class="primary-btn-white" id="show_commission_button" style="width:100%;" type="button" onclick="show_commission('commission');" value="Show Commission"><br/>`;

                document.getElementById('medical_detail').innerHTML = text;
                document.getElementById('medical_detail').style.display = 'block';
                //print harga
            }
            }catch(err){console.log(err);}
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get price medical');
       },timeout: 300000
    });
}

function medical_commit_booking(){
    data = {
        'signature': signature,
        'provider': vendor,
        'test_type': test_type
    }
    try{
        data['seq_id'] = payment_acq2[payment_method][selected].seq_id;
        data['member'] = payment_acq2[payment_method][selected].method;
    }catch(err){
    }
    try{
        data['voucher_code'] = voucher_code;
    }catch(err){}
    $.ajax({
       type: "POST",
       url: "/webservice/medical",
       headers:{
            'action': 'commit_booking',
       },
       data: data,
       success: function(msg) {
            console.log(msg);
            if(msg.result.error_code == 0){
                if(user_login.co_agent_frontend_security.includes('b2c_limitation') == true){
                    send_url_booking('airline', btoa(msg.result.response.order_number), msg.result.response.order_number);
                    document.getElementById('order_number').value = msg.result.response.order_number;
                    document.getElementById('medical_issued').submit();
               }else{
                   document.getElementById('medical_booking').innerHTML+= '<input type="hidden" name="order_number" value='+msg.result.response.order_number+'>';
                   document.getElementById('medical_booking').action = '/medical/booking/' + btoa(msg.result.response.order_number);
                   document.getElementById('medical_booking').submit();
               }
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get price medical');
       },timeout: 300000
    });
}

function medical_get_booking(order_number, sync=false){
    document.getElementById('payment_acq').hidden = true;
    price_arr_repricing = {};
    get_vendor_balance('false');
    try{
        show_loading();
    }catch(err){}
    $.ajax({
       type: "POST",
       url: "/webservice/medical",
       headers:{
            'action': 'get_booking',
       },
       data: {
            "signature": signature,
            "order_number": order_number
       },
       success: function(msg) {
            console.log(msg);
            try{
                //======================= Resv =========================
                if(msg.result.error_code == 0){
                    document.getElementById('show_loading_booking_medical').hidden = true;
                    document.getElementById('button-home').hidden = false;
                    document.getElementById('button-new-reservation').hidden = false;
                    hide_modal_waiting_transaction();
                    tes = moment.utc(msg.result.response.hold_date).format('YYYY-MM-DD HH:mm:ss')
                    localTime  = moment.utc(tes).toDate();

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
                    event_get_detail = msg;
                    $text = '';
                    $text += 'Order Number: '+ msg.result.response.order_number + '\n';
                    text = `
                        <h6 class="carrier_code_template">Order Number : </h6><h6>`+msg.result.response.order_number+`</h6><br/>
                        <table style="width:100%;">
                            <tr>
                                <th>Booking Code</th>`;
                                if(msg.result.response.state == 'booked')
                                    text+=`<th>Hold Date</th>`;
                            text+=`
                                <th>Status</th>
                            </tr>`;
                            for(i in msg.result.response.providers){
                                text+=`
                                    <tr>
                                        <td>`+msg.result.response.providers[i].pnr+`</td>`;

                                        if(msg.result.response.state == 'booked')
                                            text +=`
                                                <td>`+msg.result.response.hold_date+`</td>`;
                                        text+=`
                                        <td>`+msg.result.response.state_description+`</td>
                                    </tr>`;
                            }
                    text+=`
                        </table>
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

                            <div class="col-lg-6">
                                <h6>Issued</h6>`;
                                if(msg.result.response.state == 'issued'){
                                    text+=`<span>Date: <b>`;
                                    if(msg.result.response.issued_date != ""){
                                        text+=``+msg.result.response.issued_date+``;
                                    }else{
                                        text+=`-`
                                    }
                                    text+=`</b>
                                    </span>
                                    <br/>
                                    <span>by <b>`+msg.result.response.issued_by+`</b><span>`;
                                }else{
                                    text+=`<b>-</b>`;
                                }
                                text+=`
                            </div>
                        </div>
                        <hr/>
                   `;
                   text+=`<div class="row">`;
                   text+=`<div class="col-lg-12"></div>`;
                   text+=`<div class="col-lg-3 col-md-4 col-sm-6">`;

                   text+=`</div>`;
               document.getElementById('medical_booking').innerHTML = text;
            //======================= Button Issued ==================
            if(msg.result.response.state == 'booked'){
               check_payment_payment_method(msg.result.response.order_number, 'Issued', msg.result.response.booker.seq_id, 'billing', 'medical', signature, msg.result.response.payment_acquirer_number);
               $(".issued_booking_btn").show();
               $text += 'Status: Booked\n';
            }
            else if(msg.result.response.state == 'issued'){
                document.getElementById('issued-breadcrumb').classList.add("br-active");
                document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-active");
                document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-check"></i>`;
                document.getElementById('show_title_event').hidden = true;
                document.getElementById('display_state').innerHTML = `Your Order Has Been Issued`;
                //document.getElementById('display_prices').style.display = "none";
                $text += 'Status: Issued\n';
            }
            else if(msg.result.response.state == 'cancel2'){
                $text += 'Status: Expired \n';
                document.getElementById('issued-breadcrumb').classList.remove("br-active");
                document.getElementById('issued-breadcrumb').classList.add("br-fail");
                document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
                document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-fail");
                document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
                document.getElementById('issued-breadcrumb-span').innerHTML = `Expired`;
                document.getElementById('display_state').innerHTML = `Your Order Has Been Expired`;
                document.getElementById('show_title_event').hidden = true;
            }
            else if(msg.result.response.state == 'fail_issued'){
                $text = 'Failed (Issue)';
                document.getElementById('issued-breadcrumb').classList.remove("br-active");
                document.getElementById('issued-breadcrumb').classList.add("br-fail");
                document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
                document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-fail");
                document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
                document.getElementById('issued-breadcrumb-span').innerHTML = `Failed (Issue)`;
                document.getElementById('display_state').innerHTML = `Your Order Has Been Failed (Issue)`;
                document.getElementById('show_title_event').hidden = true;
            }
            else if(msg.result.response.state == 'fail_booked'){
                $text = 'Failed (Book)';
                document.getElementById('issued-breadcrumb').classList.remove("br-active");
                document.getElementById('issued-breadcrumb').classList.add("br-fail");
                document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
                document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-fail");
                document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
                document.getElementById('issued-breadcrumb-span').innerHTML = `Failed (Book)`;
                document.getElementById('display_state').innerHTML = `Your Order Has Been Failed (Book)`;
                document.getElementById('show_title_event').hidden = true;
            }
            else if(msg.result.response.state == 'fail_refunded'){
                $text = 'Failed (Refunded)';
                document.getElementById('issued-breadcrumb').classList.remove("br-active");
                document.getElementById('issued-breadcrumb').classList.add("br-fail");
                document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
                document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-fail");
                document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
                document.getElementById('issued-breadcrumb-span').innerHTML = `Failed (Refunded)`;
                document.getElementById('display_state').innerHTML = `Your Order Has Been Failed (Refunded)`;
                document.getElementById('show_title_event').hidden = true;
            }
            else if(msg.result.response.state == 'refund'){
                $text = 'Refunded';
                document.getElementById('issued-breadcrumb').classList.add("br-active");
                document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-active");
                document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-check"></i>`;
                document.getElementById('issued-breadcrumb-span').innerHTML = `Refunded`;
                document.getElementById('display_state').innerHTML = `Your Order Has Been Refunded`;
                document.getElementById('show_title_event').hidden = true;
            }

            //======================= Option =========================


            //======================= Extra Question =========================

            //detail



            document.getElementById('event_detail').innerHTML = text_detail;

            //==================== Print Button =====================
            var print_text = '<div class="col-lg-4" style="padding-bottom:10px;">';
            // === Button 1 ===
            if (msg.result.response.state  == 'issued') {
                print_text+=`
                <button class="primary-btn hold-seat-booking-train ld-ext-right" id="button-choose-print" type="button" onclick="get_printout('` + msg.result.response.name + `','ticket','event');" style="width:100%;">
                    Print Ticket
                    <div class="ld ld-ring ld-cycle"></div>
                </button>`;
            }
            print_text += '</div><div class="col-lg-4" style="padding-bottom:10px;">';
            // === Button 2 ===
            if (msg.result.response.state  == 'booked'){
                print_text+=`
                <button class="primary-btn hold-seat-booking-train ld-ext-right" id="button-print-print" type="button" onclick="get_printout('` + msg.result.response.name + `','itinerary','event');" style="width:100%;">
                    Print Itinerary Form
                    <div class="ld ld-ring ld-cycle"></div>
                </button>`;
            }else{
                print_text+=`
                <button class="primary-btn hold-seat-booking-train ld-ext-right" type="button" id="button-print-print" onclick="get_printout('` + msg.result.response.name + `','ticket_price','event');" style="width:100%;">
                    Print Ticket (With Price)
                    <div class="ld ld-ring ld-cycle"></div>
                </button>`;
            }
            print_text += '</div><div class="col-lg-4" style="padding-bottom:10px;">';
            // === Button 3 ===
            if (msg.result.response.state  == 'issued') {
                print_text+=`
                <button class="primary-btn hold-seat-booking-train ld-ext-right" type="button" onclick="window.location.href='https://backend.rodextrip.com/rodextrip/report/pdf/tt.agent.invoice/`+msg.result.response.name+`'" style="width:100%;" >
                    Print Invoice
                    <div class="ld ld-ring ld-cycle"></div>
                </button>`;
            }
            print_text += '</div>';
            document.getElementById('event_btn_printout').innerHTML = print_text;

            //======================= Other =========================
            add_repricing();
            console.log($text);
                }else{
                    //swal
                }
            }catch(err){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error event booking </span> Please try again in 1 - 5 minutes later or contact customer service' ,
                }).then((result) => {
                  window.location.href = '/reservation';
                })
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get price medical');
       },timeout: 300000
    });
}