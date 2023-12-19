counter_passenger = 0;
cabin_class_list = {
    'airline': {
        'Y': 'Economy',
        'W': 'Premium Economy',
        'C': 'Business',
        'F': 'First Class'
    }
}
function check_years_old(sequence){
    var birth_date = '';
    birth_date = moment(document.getElementById('adult_birth_date'+sequence).value, 'DD MMM YYYY');
    document.getElementById('adult_years_old'+sequence).value = parseInt(Math.abs(moment(new Date()) - birth_date)/31536000000);
}

function update_contact(type,val){
    if(type == 'booker'){
        if(document.getElementById('booker_title').value != '' && document.getElementById('booker_first_name').value != '')
            document.getElementById('contact_person').value = document.getElementById('booker_title').value + ' ' + document.getElementById('booker_first_name').value + ' ' + document.getElementById('booker_last_name').value;
    }else if(type == 'passenger'){
        if(document.getElementById('adult_title'+val).value != '')
            document.getElementById('name_pax'+parseInt(val-1)).innerHTML = document.getElementById('adult_title'+val).value + ' ';
        if(document.getElementById('adult_first_name'+val).value != '')
            document.getElementById('name_pax'+parseInt(val-1)).innerHTML += document.getElementById('adult_first_name'+val).value + ' ' ;
        if(document.getElementById('adult_last_name'+val).value != '')
            document.getElementById('name_pax'+parseInt(val-1)).innerHTML += document.getElementById('adult_last_name'+val).value;
        if(document.getElementById('adult_birth_date'+val).value != ''){
            document.getElementById('birth_date'+parseInt(val-1)).innerHTML = document.getElementById('adult_birth_date'+val).value;
        }
    }
}

function group_booking_signin(data){
    if(typeof(platform) === 'undefined'){
        platform = '';
    }
    if(typeof(unique_id) === 'undefined'){
        unique_id = '';
    }
    if(typeof(web_vendor) === 'undefined'){
        web_vendor = '';
    }
    if(typeof(timezone) === 'undefined'){
        timezone = '';
    }
    data_send = {
        "platform": platform,
        "unique_id": unique_id,
        "browser": web_vendor,
        "timezone": timezone
    }
    $.ajax({
        type: "POST",
        url: "/webservice/group_booking",
        headers:{
            'action': 'signin',
        },
        data: data_send,
        success: function(msg) {
            try{
                if(msg.result.error_code == 0){
                    group_booking_signature = msg.result.response.signature;
                    signature = msg.result.response.signature;
                    if(data == ''){
    //                    get_group_booking_data_search_page();
    //                    group_booking_get_availability();
                    }else{
                        group_booking_page();
                        group_booking_get_booking(data);
                    }
                }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                    auto_logout();
                }else if(msg.result.error_code == 1040){
                    $('#myModalSignIn').modal('show');
                    try{
                        document.getElementById('keep_me_sign_in_div').hidden = true;
                    }catch(err){}
                    try{
                        document.getElementById('forget_password_label').hidden = true;
                    }catch(err){}
                    try{
                        setTimeout(() => {
                          document.getElementById('email_otp_input1').select();
                        }, 500);
                    }catch(err){}

//                    Swal.fire({
//                        type: 'warning',
//                        html: 'Input OTP'
//                    });
                    if(document.getElementById('otp_div')){
                        document.getElementById('otp_information').innerHTML = 'An OTP has been sent, Please check your email!';
                        document.getElementById('otp_information').hidden = false;
                        document.getElementById('otp_type_div').hidden = false;
                        document.getElementById('otp_div').hidden = false;
                        document.getElementById('otp_time_limit').hidden = false;
                        document.getElementById('username_div').hidden = true;
                        document.getElementById('password_div').hidden = true;
                        document.getElementById('signin_btn').onclick = function() {get_captcha('g-recaptcha-response','signin_product_otp');}
                        document.getElementById("btn_otp_resend").onclick = function() {signin_product_otp(true);}

                        now = new Date().getTime();

                        time_limit_otp = msg.result.error_msg.split(', ')[1];
                        tes = moment.utc(time_limit_otp).format('YYYY-MM-DD HH:mm:ss');
                        localTime  = moment.utc(tes).toDate();

                        data_gmt = moment(time_limit_otp)._d.toString().split(' ')[5];
                        gmt = data_gmt.replace(/[^a-zA-Z+-]+/g, '');
                        timezone = data_gmt.replace (/[^\d.]/g, '');
                        timezone = timezone.split('')
                        timezone = timezone.filter(item => item !== '0')
                        time_limit_otp = moment(localTime).format('YYYY-MM-DD HH:mm:ss');
                        time_limit_otp = parseInt((new Date(time_limit_otp.replace(/-/g, "/")).getTime() - now) / 1000);
                        session_otp_time_limit();
                    }
                    $('.loading-button').prop('disabled', false);
                    $('.loading-button').removeClass("running");
                }else if(msg.result.error_code == 1041){
                    Swal.fire({
                        type: 'warning',
                        html: msg.result.error_msg
                    });
                    $('.loading-button').prop('disabled', false);
                    $('.loading-button').removeClass("running");
                }else{
                    Swal.fire({
                        type: 'error',
                        title: 'Oops!',
                        html: msg.result.error_msg,
                    })
                    try{
                        $("#show_loading_booking_group_booking").hide();
                    }catch(err){
                        console.log(err); // error kalau ada element yg tidak ada
                    }
                }
            }catch(err){
                Swal.fire({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong, please try again or check your internet connection',
                })
                $('.loader-rodextrip').fadeOut();
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error Swab Express signin');
            $("#barFlightSearch").hide();
            $("#waitFlightSearch").hide();
            $('.loader-rodextrip').fadeOut();
            try{
                $("#show_loading_booking_group_booking").hide();
            }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
            }
        },timeout: 60000
    });
}

function group_booking_page(){
    $.ajax({
       type: "POST",
       url: "/webservice/issued_offline",
       headers:{
            'action': 'page_issued_offline',
       },
       data: {
       },
       success: function(msg) {
            titles = msg.titles;
            countries = msg.countries;
            pax_type_list = {'ADT': 'Adult','CHD': 'Child', 'INF': 'Infant'}
            airline_carriers = msg.airline_carriers;
            try{
                get_public_holiday(moment().format('YYYY-MM-DD'), moment().subtract(-1, 'years').format('YYYY-MM-DD'));
                new_get_public_holiday(moment().format('YYYY-MM-DD'), moment().subtract(-1, 'years').format('YYYY-MM-DD'));
            }catch(err){
                console.log(err);
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error data review hotel');
            $('#loading-search-hotel').hide();
       },timeout: 180000
   });
}

function show_form(){
    var radios = document.getElementsByName('radio_group_booking_type');
    var product_type = '';
    var text = '';
    for (var j = 0, length = radios.length; j < length; j++) {
        if (radios[j].checked) {
            // do whatever you want with the checked radio
            product_type = radios[j].value;
            // only one radio can be logically checked, don't check the rest
            break;
        }
    }
    if(product_type == 'airline'){
        document.getElementById('airline_searchForm').style.display = 'block';
    }
}

function group_booking_get_config(page=false){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/group_booking",
       headers:{
            'action': 'get_config',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
       try{
           if(msg.result.error_code == 0){
                group_booking_config = msg.result.response;

                if(page == 'home'){
                    text = '<div class="row">';
                    text += `
                    <div class="col-lg-12" id="radio_group_booking">`;
                    for(i in msg.result.response.provider_type){
                        text += `
                        <label class="radio-img" style="vertical-align:top; margin-right: 10px;">
                            <input type="radio"`;
                            if(msg.result.response.provider_type[i].code == 'airline')
                                text+=` checked="checked"`;
                        text+=`name="radio_group_booking_type" value="`+msg.result.response.provider_type[i].code+`">
                            <img style="width:auto; height:70px; border-radius:7px; padding:15px; background:white;" src="/static/tt_website/images/icon/product/c-airline.png" alt="Airline Icon">
                            <div style="width:100px; text-align:center;"><span class="title_prd">`+msg.result.response.provider_type[i].name+`</span></div>
                        </label>`;
                    }
                    text += `</div></div>`;
                    document.getElementById('groupbooking_searchForm').innerHTML += text;
                    show_form();
                }
                if(page == 'search'){

                }

                if(page == 'passenger'){

                }
           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
           }else{
               Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: msg.result.error_msg,
               })
               try{
                $("#show_loading_booking_group_booking").hide();
               }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
               }
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
          error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error medical signin');
          $("#barFlightSearch").hide();
          $("#waitFlightSearch").hide();
          $('.loader-rodextrip').fadeOut();
          try{
            $("#show_loading_booking_group_booking").hide();
          }catch(err){
            console.log(err); // error kalau ada element yg tidak ada
          }
       },timeout: 60000
    });
}

function group_booking_commit_booking(page=false){
    getToken();
    product_type = '';
    carrier_code = '';
    journey_type = '';
    var radios = document.getElementsByName('radio_group_booking_type');
    for (var j = 0, length = radios.length; j < length; j++) {
        if (radios[j].checked) {
            // do whatever you want with the checked radio
            product_type = radios[j].value;
            // only one radio can be logically checked, don't check the rest
            break;
        }
    }
    radios = document.getElementsByName('carrier_code');
    for (var j = 0, length = radios.length; j < length; j++) {
        if (radios[j].checked) {
            // do whatever you want with the checked radio
            carrier_code = radios[j].value;
            // only one radio can be logically checked, don't check the rest
            break;
        }
    }
    radios = document.getElementsByName('radio_airline_type');
    for (var j = 0, length = radios.length; j < length; j++) {
        if (radios[j].checked) {
            // do whatever you want with the checked radio
            journey_type = radios[j].value;
            // only one radio can be logically checked, don't check the rest
            break;
        }
    }
    var error_log = '';
    if(product_type == 'airline'){
        if(document.getElementById('origin_id_flight').value.split(' - ').length != 4)
            error_log += 'Please fill origin<br/>';
        if(document.getElementById('destination_id_flight').value.split(' - ').length != 4)
            error_log += 'Please fill destination<br/>';
        if(carrier_code == '')
            error_log += 'Please choose airline<br/>';
        data = {
            'provider_type': product_type,
            'ADT': parseInt(document.getElementById('adult_flight_gb').value),
            'CHD': parseInt(document.getElementById('child_flight_gb').value),
            'INF': parseInt(document.getElementById('infant_flight_gb').value),
            'carrier_code': carrier_code,
            'origin': document.getElementById('origin_id_flight').value.split(' - ')[0],
            'destination': document.getElementById('destination_id_flight').value.split(' - ')[0],
            'journey_type': journey_type == 'oneway' ? 'ow' : 'rt',
            'cabin_class': document.getElementById('cabin_class_flight').value,
            'departure_date': moment(document.getElementById('airline_departure').value, 'DD MMM YYYY').format('YYYY-MM-DD'),
            'return_date': journey_type == 'oneway' ? '' : moment(document.getElementById('airline_return').value, 'DD MMM YYYY').format('YYYY-MM-DD'),
            'description': ''
        }
    }
    if(error_log == ''){
        data['signature'] = signature;
        $.ajax({
           type: "POST",
           url: "/webservice/group_booking",
           headers:{
                'action': 'create_booking',
           },
           data: data,
           success: function(msg) {
           try{
               if(msg.result.error_code == 0){
                    Swal.fire({
                      type: 'success',
                      title: 'Create!',
                      html: msg.result.response.order_number
                    })
                    document.getElementById('adult_flight_gb').value = '10';
                    document.getElementById('child_flight_gb').value = '0';
                    document.getElementById('infant_flight_gb').value = '0';
                    document.getElementById('origin_id_flight').value = '';
                    document.getElementById('destination_id_flight').value = '';

               }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                    auto_logout();
               }else{
                   Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: msg.result.error_msg,
                   });
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
              error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error medical signin');
              $("#barFlightSearch").hide();
              $("#waitFlightSearch").hide();
              $('.loader-rodextrip').fadeOut();
              try{
                $("#show_loading_booking_group_booking").hide();
              }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
              }
           },timeout: 60000
        });
    }else{
        Swal.fire({
            type: 'error',
            title: 'Oops!',
            html: error_log
        });
    }
}

function groupbooking_modal_issued()
{
    $("#issuedModal").modal('show');
}

function issued_rules_print(){
    text = '';
    for(i in group_booking_get_detail.result.response.payment_rules_available){
        if(i != 0)
            text += `<br/>`;
        text += `
            <label class="radio-button-custom">
                <input type="radio" name="payment_opt" value="`+i+`" onchange="pick_issued_rules_print();"/> `+group_booking_get_detail.result.response.payment_rules_available[i].name+`
                <span class="checkmark-radio"></span>
            </label>
        `;
    }
    text += `<div id="info_rules"/>`;
    document.getElementById('modal_issued_groupbooking').innerHTML = text;
}

function pick_issued_rules_print(){
    var radios = document.getElementsByName('payment_opt');
    for (var j = 0, length = radios.length; j < length; j++) {
        if (radios[j].checked) {
            // do whatever you want with the checked radio
            issued_pick = radios[j].value;
            // only one radio can be logically checked, don't check the rest
            break;
        }
    }
    text = `
        <table class="table table-bordered" style="font-size:12px;">
            <thead>
            <tr>
                <th></th>
                <th>Amount</th>
                <th>Due Date</th>
            </tr>
            </thead>
            <tbody>`;
    for(i in group_booking_get_detail.result.response.payment_rules_available[issued_pick].payment_rules){
        text += `
            <tr>
                <td>`+group_booking_get_detail.result.response.payment_rules_available[issued_pick].payment_rules[i].name+`</td>
                <td>`+group_booking_get_detail.result.response.payment_rules_available[issued_pick].payment_rules[i].currency+` `+getrupiah(group_booking_get_detail.result.response.payment_rules_available[issued_pick].payment_rules[i].amount)+`</td>
                <td>`+moment().add(group_booking_get_detail.result.response.payment_rules_available[issued_pick].payment_rules[i].due_date, 'days').format('DD MMM YYYY')+`</td>
            </tr>`;
    }
    text += `</tbody>
        </table>`;


    document.getElementById('info_rules').innerHTML = text;
}

function group_booking_get_booking(order_number){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/group_booking",
       headers:{
            'action': 'get_booking',
       },
       data: {
            'signature': signature,
            'order_number': order_number
       },
       success: function(msg) {
       try{
           hide_modal_waiting_transaction();
           document.getElementById('button-home').hidden = false;
           document.getElementById('button-home-mb').hidden = false;
           document.getElementById('button-new-reservation').hidden = false;
           document.getElementById("overlay-div-box").style.display = "none";

           counter_passenger = 0;
           group_booking_get_detail = msg;
           get_payment = false;
           time_now = moment().format('YYYY-MM-DD HH:mm:SS');
           //get booking view edit here
           $(".issued_booking_btn").hide();
           try{
               if(msg.result.error_code == 0){
                price_arr_repricing = {};
                pax_type_repricing = [];
                for(i in msg.result.response.ticket_list){
                    msg.result.response.ticket_list[i].fare_pick = 0;
                }
//               document.getElementById('table_of_passenger').innerHTML = `
//                <tr>
//                    <th style="width:5%;">No</th>
//                    <th style="width:40%;">Name</th>
//                    <th style="width:35%;">Birth Date</th>
//                    <th style="width:15%;"></th>
//                </tr>
//               `;
                if(msg.result.response.state == 'booked' || msg.result.response.state == 'partial_booked' || msg.result.response.state == 'partial_issued' || msg.result.response.state == 'fail_issued'){
                    document.getElementById('div_sync_status').hidden = false;
                }
                for(i in msg.result.response.passengers){
                    for(j in msg.result.response.passengers[i].sale_service_charges){
                        for(k in msg.result.response.passengers[i].sale_service_charges[j]){
                            currency = msg.result.response.passengers[i].sale_service_charges[j][k].currency
                            break;
                        }
                        break;
                    }
                    break;
                }
                var text = '';
                $text = '';
                check_provider_booking = 0;
                if(msg.result.response.hold_date != false && msg.result.response.hold_date != ''){
                    tes = moment.utc(msg.result.response.hold_date).format('YYYY-MM-DD HH:mm:ss')
                    localTime  = moment.utc(tes).toDate();
                    msg.result.response.hold_date = moment(localTime).format('DD MMM YYYY HH:mm');
                    var now = moment();
                    var hold_date_time = moment(msg.result.response.hold_date, "DD MMM YYYY HH:mm");
                    data_gmt = moment(msg.result.response.hold_date)._d.toString().split(' ')[5];
                    gmt = data_gmt.replace(/[^a-zA-Z+-]+/g, ''); //ambil gmt
                    timezone = data_gmt.replace (/[^\d.]/g, ''); //ambil timezone
                    timezone = timezone.split('') //split per char
                    timezone = timezone.filter(item => item !== '0') //hapus angka 0 di timezone
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
                try{
                    if(msg.result.response.state_groupbooking == 'cancel'){
                       breadcrumb_create("group_booking", 5, 1);
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
                    }else if(msg.result.response.state_groupbooking == 'cancel2' || msg.result.response.state_groupbooking == 'expired'){
                       breadcrumb_create("group_booking", 5, 1);
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
                       $("#group_booking_detail").hide();
                    }else if(msg.result.response.state_groupbooking == 'void'){
                       breadcrumb_create("group_booking", 5, 1);
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
                    }else if(msg.result.response.state_groupbooking == 'fail_refunded'){
                       breadcrumb_create("group_booking", 5, 1);
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
                    }else if(msg.result.response.state_groupbooking == 'fail_issued'){
                       breadcrumb_create("group_booking", 5, 1);
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
                    }else if(msg.result.response.state_groupbooking == 'fail_booked'){
                       breadcrumb_create("group_booking", 5, 1);
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
                    }else if(msg.result.response.state_groupbooking == 'booked'){
                       try{
    //                       if(now.diff(hold_date_time, 'minutes')<0)
    //                           check_payment_payment_method(msg.result.response.order_number, 'Issued', msg.result.response.booker.seq_id, 'billing', 'groupbooking', signature, msg.result.response.payment_acquirer_number);
//                           get_payment = true;
        //                   get_payment_acq('Issued',msg.result.response.booker.seq_id, msg.result.response.order_number, 'billing',signature,'airline');
                           //document.getElementById('voucher_div').style.display = '';
                           //document.getElementById('issued-breadcrumb').classList.remove("active");
                           //document.getElementById('issued-breadcrumb').classList.add("current");
    //                       document.getElementById('issued-breadcrumb').classList.add("br-active");
    //                       document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-active");

                           var check_error_msg_provider = 0;
                           for(co_error in msg.result.response.provider_bookings){
                               if(msg.result.response.provider_bookings[co_error].error_msg != ''){
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
                        console.log(err); // error kalau ada element yg tidak ada
                       }
                    }else if(msg.result.response.state_groupbooking == 'draft'){
                        breadcrumb_create("group_booking", 2, 1);
                    }else if(msg.result.response.state_groupbooking == 'confirm'){
                        breadcrumb_create("group_booking", 3, 1);
                    }else if(msg.result.response.state_groupbooking == 'sent'){
                       breadcrumb_create("group_booking", 4, 1);
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
                    }else if(msg.result.response.state_groupbooking == 'refund'){
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
                       breadcrumb_create("group_booking", 5, 1);
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
                }catch(err){console.log(err);}


                $text += '‣ Order Number: '+ msg.result.response.order_number + '\n';

                //$text += 'Hold Date: ' + msg.result.response.hold_date + '\n';
                $text += '‣ Status: '+msg.result.response.state_description + '\n';
                var localTime;
                text += `
                <div class="col-lg-12 mb-3">
                    <div class="row">
                        <div class="col-lg-12" style="border:1px solid #cdcdcd; padding:15px; background:white;">
                            <div class="row">
                                <div class="col-lg-12" style="padding-bottom:15px; border-bottom:1px solid #cdcdcd;">
                                    <h4>
                                        <i class="fas fa-scroll"></i> Order Number: `+msg.result.response.order_number+`
                                    </h4>
                                </div>
                                <div class="col-lg-12" style="text-align:right; padding-top:15px;">
                                    <b style="padding-right:10px;"><i>State:</b></i>`;
                                        if(msg.result.response.state == 'issued' || msg.result.response.state == 'done'){
                                            text+=`<b style="background:#30b330; font-size:13px; color:white; padding:5px 15px; display:unset; border-radius:7px;">`;
                                        }else if(msg.result.response.state == 'booked'){
                                            text+=`<b style="background:#3fa1e8; font-size:13px; color:white; padding:5px 15px; display:unset; border-radius:7px;">`;
                                        }else if(msg.result.response.state == 'Refund' || msg.result.response.state == 'Draft' || msg.result.response.state == 'Pending' || msg.result.response.state == 'New'){
                                            text+=`<b style="background:#8c8d8f; font-size:13px; color:white; padding:5px 15px; display:unset; border-radius:7px;">`;
                                        }else if(msg.result.response.state == 'Booking Failed' || msg.result.response.state == 'Expired'
                                                || msg.result.response.state == 'Cancelled'){
                                            text+=`<b style="background:#DC143C; font-size:13px; color:white; padding:5px 15px; display:unset; border-radius:7px;">`;
                                        }else{
                                            text+=`<b>`;
                                        }

                                        text+=``+msg.result.response.state+`
                                    </b>
                                </div>

                                <div class="col-lg-12">
                                    <div class="row">
                                        <div class="col-lg-3" style="padding:15px;">
                                            <span>
                                                <b>PNR</b><br>`;
                                                if(msg.result.response.state == 'issued'){
                                                    text+=`<i>`+msg.result.response.pnr+`</i>`;
                                                }else{
                                                    text+=`-`;
                                                }
                                            text+=`
                                            </span>
                                        </div>`;
                                        if(msg.result.response.state == 'booked'){
                                            text+=`
                                            <div class="col-lg-4" style="padding:15px;">
                                                <b>Hold Date</b><br>`;
                                                text+=`<i>`+msg.result.response.hold_date+`</i>`;
                                                text+=`
                                            </div>`;
                                        }
                                        text+=`
                                        <div class="col-lg-5" style="padding:15px">`;
                                        if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false){
                                            text+=`<b>Agent: </b><i>`+msg.result.response.agent_name+`</i><br/>`;
                                            if(msg.result.response.customer_parent_name){
                                                text+=`
                                                <b>Customer: </b>
                                                <i>`+msg.result.response.customer_parent_type_name+` `+msg.result.response.customer_parent_name+`</i>`;
                                            }
                                        }
                                        text+=`
                                        </div>
                                    </div>
                                </div>`;
                                text+=`
                            </div>`;

                            text+=`
                            <div class="row">
                                <div class="col-lg-3 mb-3">
                                    <span>
                                        <b>Booked by</b><br>`;
                                        text+=`<i>`+msg.result.response.booked_by+`</i>`;
                                    text+=`
                                    </span>
                                </div>
                                <div class="col-lg-5 mb-3">
                                    <span>
                                        <b>Booked Date: </b><br/>`;
                                        if(msg.result.response.booked_date != ""){
                                            text+=`<i>`+msg.result.response.booked_date+`</i>`;
                                        }else{
                                            text+=`-`;
                                        }
                                        text+=`
                                    </span>
                                </div>
                            </div>`;

                            if(msg.result.response.state == 'issued'){
                                text+=`
                                <div class="row">
                                    <div class="col-lg-3 mb-3">
                                        <span>
                                            <b>Issued by</b><br>`;
                                            text+=`<i>`+msg.result.response.issued_by+`</i>`;
                                        text+=`
                                        </span>
                                    </div>
                                    <div class="col-lg-5 mb-3">
                                        <span>
                                            <b>Issued Date: </b><br/>`;
                                            if(msg.result.response.issued_date != ""){
                                                text+=`<i>`+msg.result.response.issued_date+`</i>`;
                                            }else{
                                                text+=`-`;
                                            }
                                            text+=`
                                        </span>
                                    </div>
                                </div>`;
                            }
                            text+=`
                        </div>
                    </div>
                </div>`;

                var cabin_class = '';
                if(msg.result.response.request.cabin_class == 'Y')
                    cabin_class = 'Economy Class';
                else if(msg.result.response.request.carrier_code == 'QG' && msg.result.response.request.cabin_class == 'W')
                    cabin_class = 'Royal Green Class';
                else if(msg.result.response.request.cabin_class == 'W')
                    cabin_class = 'Premium Economy Class';
                else if(msg.result.response.request.cabin_class == 'C')
                    cabin_class = 'Business Class';
                else if(msg.result.response.request.cabin_class == 'F')
                    cabin_class = 'First Class';

                text+=`
                <div class="col-lg-12" style="border:1px solid #cdcdcd; padding:15px; background-color:white; margin-bottom:20px;">
                    <div class="row">
                        <div class="col-lg-12" style="padding-bottom:15px; border-bottom:1px solid #cdcdcd;">
                            <h4>
                                <i class="fas fa-sticky-note"></i> Group Booking Request
                            </h4>
                        </div>
                        <div class="col-lg-12" style="padding-top:15px;">
                            <h5 class="single_border_custom_bottom mb-2" style="width:max-content;">Departure</h5>
                        </div>
                        <div class="col-lg-4" style="padding:15px;">
                            <b>Origin</b><br/>
                            <i>`+msg.result.response.request.origin.city + ` (` + msg.result.response.request.origin.code + `)</i>
                        </div>
                        <div class="col-lg-4" style="padding: 15px;">
                            <b>Destination</b><br/>
                            <i>`+msg.result.response.request.destination.city + ` (` + msg.result.response.request.destination.code + `)</i>
                        </div>
                        <div class="col-lg-4" style="padding: 15px;">
                            <b>Departure Date</b><br/>
                            <i>`+msg.result.response.request.departure_date+`</i>
                        </div>
                        <div class="col-lg-4" style="padding: 15px;">
                            <b>Carrier Code</b><br/><i>`;
                            try{
                                text+= airline_carriers[msg.result.response.request.carrier_code].name;
                            }catch(err){
                                text+= msg.result.response.request.carrier_code;
                            }
                            text+=`</i>
                        </div>
                        <div class="col-lg-4" style="padding: 15px;">
                            <b>Cabin Class</b><br/><i>`;
                            text+= cabin_class;
                            text+=`</i>
                        </div>
                        <div class="col-lg-4" style="padding: 15px;">
                            <b>Passengers</b><br/><i>`;
                            text+= msg.result.response.request.pax.ADT +` Adult`;
                            if(msg.result.response.request.pax.CHD)
                                text+= `, ` + msg.result.response.request.pax.CHD +` Child`;
                            if(msg.result.response.request.pax.INF)
                                text+= `, ` + msg.result.response.request.pax.INF +` Infant`;
                            text+=`</i>
                        </div>
                        <div class="col-lg-12 mb-3">`;
                        if(msg.result.response.request.return_date != ''){
                            text+=`
                            <div class="row" style="padding-top:15px; border-top:1px solid #cdcdcd;">
                                <div class="col-lg-12" style="padding-top:15px;">
                                    <h5 class="single_border_custom_bottom mb-2" style="width:max-content;">Return</h5>
                                </div>
                                <div class="col-lg-4" style="padding:15px;">
                                    <b>Origin</b><br/>
                                    <i>`+msg.result.response.request.destination.city + `(` + msg.result.response.request.destination.code + `)</i>
                                </div>
                                <div class="col-lg-4" style="padding: 15px;">
                                    <b>Destination</b><br/>
                                    <i>`+msg.result.response.request.origin.city + `(` + msg.result.response.request.origin.code + `)</i>
                                </div>
                                <div class="col-lg-4" style="padding: 15px;">
                                    <b>Return Date</b><br/>
                                    <i>`+msg.result.response.request.return_date+`</i>
                                </div>
                                <div class="col-lg-4" style="padding: 15px;">
                                    <b>Carrier Code</b><br/><i>`;
                                    try{
                                        text+= airline_carriers[msg.result.response.request.carrier_code].name;
                                    }catch(err){
                                        text+= msg.result.response.request.carrier_code;
                                    }
                                    text+=`</i>
                                </div>
                                <div class="col-lg-4" style="padding: 15px;">
                                    <b>Cabin Class</b><br/><i>`;
                                    text+= cabin_class;
                                    text+=`</i>
                                </div>
                                <div class="col-lg-4" style="padding: 15px;">
                                    <b>Passengers</b><br/><i>`;
                                    text+= msg.result.response.request.pax.ADT +` Adult`;
                                    if(msg.result.response.request.pax.CHD)
                                        text+= `, ` + msg.result.response.request.pax.CHD +` Child`;
                                    if(msg.result.response.request.pax.INF)
                                        text+= `, ` + msg.result.response.request.pax.INF +` Infant`;
                                    text+=`</i>
                                </div>
                            </div>`;
                        }
                        text+=`
                        </div>
                    </div>
                </div>
                <div class="col-lg-12" style="border:1px solid #cdcdcd; padding:15px; background-color:white; margin-bottom:20px;">
                    <div class="row">`;
                        text+= `
                        <div class="col-lg-12 mb-2" style="border-bottom: 1px solid #cdcdcd;">
                            <h4 class="mb-3">
                                <i class="fas fa-ticket-alt"></i> Ticket
                            </h4>
                        </div>`;

                        rules = 0;
                        if(msg.result.response.state_groupbooking == 'confirm'){
                            if(msg.result.response.price_pick_departure){
                                text+=`
                                <div class="col-lg-12" style="background-color:white; margin-top:15px;">
                                    <div class="row">
                                        <div class="col-lg-12 pt-3">`;
                                            $text += '‣ Booking Code: -\n';
                                            text+=`
                                            <div class="row">
                                                <div class="col-xs-6">
                                                    <h5 class="single_border_custom_bottom mb-2" style="width:max-content;">Departure</h5>
                                                </div>
                                                <div class="col-xs-6" style="text-align:right;">
                                                    <h5>PNR: -</h5>
                                                </div>
                                            </div>`;

                                            $text += '\nFlight Departure\n';
                                            $text+='‣ ';

                                            for(i in msg.result.response.price_pick_departure.segments){
                                                text+=`
                                                <div class="row">
                                                    <div class="col-lg-12">`;
                                                        try{
                                                            text += `<img data-toggle="tooltip" style="width:50px; height:50px;" alt="`+airline_carriers[msg.result.response.price_pick_departure.segments[i].carrier_code].name+`" title="`+airline_carriers[msg.result.response.price_pick_departure.segments[i].carrier_code].name+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+msg.result.response.price_pick_departure.segments[i].carrier_code+`.png"/>`;
                                                        }catch(err){
                                                            text += `<img data-toggle="tooltip" style="width:50px; height:50px;" alt="`+msg.result.response.price_pick_departure.segments[i].carrier_code+`" title="`+msg.result.response.price_pick_departure.segments[i].carrier_code+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+msg.result.response.price_pick_departure.segments[i].carrier_code+`.png"/>`;
                                                        }
                                                        text+=`<h5>`+msg.result.response.price_pick_departure.segments[i].carrier_name+`</h5>
                                                        <span>Class : `+cabin_class+`</span><br/>
                                                    </div>
                                                    <div class="col-lg-12" style="padding-top:10px;">`;
                                                        $text += msg.result.response.price_pick_departure.segments[i].carrier_name;
                                                        if(cabin_class != '')
                                                            $text += ' ' + cabin_class;

                                                        for(j in msg.result.response.price_pick_departure.segments[i].legs){
                                                            $text += '\n'+msg.result.response.price_pick_departure.segments[i].legs[j].origin_city + ' (' + msg.result.response.price_pick_departure.segments[i].legs[j].origin+ ') - ' + msg.result.response.price_pick_departure.segments[i].legs[j].destination_city + ' (' + msg.result.response.price_pick_departure.segments[i].legs[j].destination + ')\n';

                                                            if(msg.result.response.price_pick_departure.segments[i].legs[j].arrival_date.split('  ')[0] == msg.result.response.price_pick_departure.segments[i].legs[j].departure_date.split('  ')[0]){
                                                                $text += msg.result.response.price_pick_departure.segments[i].legs[j].departure_date.split('  ')[0]+' ';
                                                                $text += msg.result.response.price_pick_departure.segments[i].legs[j].departure_date.split('  ')[1]+' - ';
                                                                $text += msg.result.response.price_pick_departure.segments[i].legs[j].arrival_date.split('  ')[1]+'\n';
                                                            }else{
                                                                $text += msg.result.response.price_pick_departure.segments[i].legs[j].departure_date.split('  ')[0]+' ';
                                                                $text += msg.result.response.price_pick_departure.segments[i].legs[j].departure_date.split('  ')[1]+' - ';
                                                                $text += msg.result.response.price_pick_departure.segments[i].legs[j].arrival_date.split('  ')[0]+' ';
                                                                $text += msg.result.response.price_pick_departure.segments[i].legs[j].arrival_date.split('  ')[1]+'\n';
                                                            }

                                                            text+= `
                                                            <div class="row">
                                                                <div class="col-lg-6 col-xs-6">
                                                                    <table style="width:100%">
                                                                        <tr>
                                                                            <td><h5>`+msg.result.response.price_pick_departure.segments[i].legs[j].departure_date.split('  ')[1]+`</h5></td>
                                                                            <td style="padding-left:15px;">
                                                                                <img src="/static/tt_website/images/icon/symbol/airlines-01.png" alt="Airline" style="width:20px; height:20px;"/>
                                                                            </td>
                                                                            <td style="height:30px;padding:0 15px;width:100%">
                                                                                <div style="display:inline-block;position:relative;width:100%">
                                                                                    <div style="height:2px;position:absolute;top:16px;width:100%;background-color:#d4d4d4;"></div>
                                                                                    <div class="origin-code-snippet" style="background-color:#d4d4d4;right:-6px"></div>
                                                                                    <div style="height:30px;min-width:40px;position:relative;width:0%"/>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                    <span>`+msg.result.response.price_pick_departure.segments[i].legs[j].departure_date.split('  ')[0]+`</span><br/>
                                                                    <span style="font-weight:500;">`+msg.result.response.price_pick_departure.segments[i].legs[j].origin_name+` - `+msg.result.response.price_pick_departure.segments[i].legs[j].origin_city+` (`+msg.result.response.price_pick_departure.segments[i].legs[j].origin+`)</span><br/>`;
                                //                                    if(msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].origin_terminal != ''){
                                //                                        text+=`<span style="font-size:13px; font-weight:500;">Terminal: `+msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].origin_terminal+`</span>`;
                                //                                    }else{
                                                                        text+=`<span style="font-size:13px; font-weight:500;">Terminal: -</span>`;
                                //                                    }
                                                                text+=`
                                                                </div>

                                                                <div class="col-lg-6 col-xs-6" style="padding:0;">
                                                                    <table style="width:100%; margin-bottom:6px;">
                                                                        <tr>
                                                                            <td><h5>`+msg.result.response.price_pick_departure.segments[i].legs[j].arrival_date.split('  ')[1]+`</h5></td>
                                                                            <td></td>
                                                                            <td style="height:30px;padding:0 15px;width:100%"></td>
                                                                        </tr>
                                                                    </table>
                                                                    <span>`+msg.result.response.price_pick_departure.segments[i].legs[j].arrival_date.split('  ')[0]+`</span><br/>
                                                                    <span style="font-weight:500;">`+msg.result.response.price_pick_departure.segments[i].legs[j].destination_name+` - `+msg.result.response.price_pick_departure.segments[i].legs[j].destination_city+` (`+msg.result.response.price_pick_departure.segments[i].legs[j].destination+`)</span><br/>`;
                                //                                    if(msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].destination_terminal != ''){
                                //                                        text+=`<span style="font-size:13px; font-weight:500;">Terminal: `+msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].destination_terminal+`</span>`;
                                //                                    }else{
                                                                        text+=`<span style="font-size:13px; font-weight:500;">Terminal: -</span>`;
                                //                                    }
                                                                text+=`
                                                                </div>
                                                            </div>`;
                                                        }
                                                    text += `
                                                    </div>
                                                </div>`;
                                            }
                                        text+=`
                                        </div>
                                    </div>
                                </div>`;
                            }
                            if(msg.result.response.hasOwnProperty('price_pick_return') && msg.result.response.price_pick_return){
                                text+=`
                                <div class="col-lg-12" style="background-color:white; border-top:1px solid #cdcdcd;margin-top:20px;">
                                    <div class="row">
                                        <div class="col-lg-12 pt-3 pb-3">`;
                                            $text += '‣ Booking Code: -\n';
                                            text+=`
                                            <div class="row">
                                                <div class="col-xs-6">
                                                    <h5 class="single_border_custom_bottom mb-2" style="width:max-content;">Return</h5>
                                                </div>
                                                <div class="col-xs-6" style="text-align:right;">
                                                    <h5>PNR: -</h5>
                                                </div>
                                            </div>`;
                                            $text += '\nFlight Return\n';
                                            $text+='‣ ';
                                            for(i in msg.result.response.price_pick_return.segments){
                                                text+=`
                                                <div class="row">
                                                    <div class="col-lg-12">`;
                                                        try{
                                                            text += `<img data-toggle="tooltip" style="width:50px; height:50px;" alt="`+airline_carriers[msg.result.response.price_pick_return.segments[i].carrier_code].name+`" title="`+airline_carriers[msg.result.response.price_pick_return.segments[i].carrier_code].name+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+msg.result.response.price_pick_return.segments[i].carrier_code+`.png"/>`;
                                                        }catch(err){
                                                            text += `<img data-toggle="tooltip" style="width:50px; height:50px;" alt="`+msg.result.response.price_pick_return.segments[i].carrier_code+`" title="`+msg.result.response.price_pick_return.segments[i].carrier_code+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+msg.result.response.price_pick_return.segments[i].carrier_code+`.png"/>`;
                                                        }
                                                        text+=`<h5>`+msg.result.response.price_pick_return.segments[i].carrier_name+`</h5>
                                                            <span>Class : `+cabin_class+`</span><br/>
                                                    </div>
                                                    <div class="col-lg-12" style="padding-top:10px;">`;
                                                        $text += msg.result.response.price_pick_return.segments[i].carrier_name;
                                                        if(cabin_class != '')
                                                            $text += ' ' + cabin_class;

                                                        for(j in msg.result.response.price_pick_return.segments[i].legs){
                                                            $text += '\n'+msg.result.response.price_pick_return.segments[i].legs[j].origin_city + ' (' + msg.result.response.price_pick_return.segments[i].legs[j].origin+ ') - ' + msg.result.response.price_pick_return.segments[i].legs[j].destination_city + ' (' + msg.result.response.price_pick_return.segments[i].legs[j].destination + ')\n';

                                                            if(msg.result.response.price_pick_return.segments[i].legs[j].arrival_date.split('  ')[0] == msg.result.response.price_pick_return.segments[i].legs[j].departure_date.split('  ')[0]){
                                                                $text += msg.result.response.price_pick_return.segments[i].legs[j].departure_date.split('  ')[0]+' ';
                                                                $text += msg.result.response.price_pick_return.segments[i].legs[j].departure_date.split('  ')[1]+' - ';
                                                                $text += msg.result.response.price_pick_return.segments[i].legs[j].arrival_date.split('  ')[1]+'\n';
                                                            }else{
                                                                $text += msg.result.response.price_pick_return.segments[i].legs[j].departure_date.split('  ')[0]+' ';
                                                                $text += msg.result.response.price_pick_return.segments[i].legs[j].departure_date.split('  ')[1]+' - ';
                                                                $text += msg.result.response.price_pick_return.segments[i].legs[j].arrival_date.split('  ')[0]+' ';
                                                                $text += msg.result.response.price_pick_return.segments[i].legs[j].arrival_date.split('  ')[1]+'\n';
                                                            }

                                                            text+= `
                                                            <div class="row">
                                                                <div class="col-lg-6 col-xs-6">
                                                                    <table style="width:100%">
                                                                        <tr>
                                                                            <td><h5>`+msg.result.response.price_pick_return.segments[i].legs[j].departure_date.split('  ')[1]+`</h5></td>
                                                                            <td style="padding-left:15px;">
                                                                                <img src="/static/tt_website/images/icon/symbol/airlines-01.png" alt="Airline" style="width:20px; height:20px;"/>
                                                                            </td>
                                                                            <td style="height:30px;padding:0 15px;width:100%">
                                                                                <div style="display:inline-block;position:relative;width:100%">
                                                                                    <div style="height:2px;position:absolute;top:16px;width:100%;background-color:#d4d4d4;"></div>
                                                                                    <div class="origin-code-snippet" style="background-color:#d4d4d4;right:-6px"></div>
                                                                                    <div style="height:30px;min-width:40px;position:relative;width:0%"/>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                    <span>`+msg.result.response.price_pick_return.segments[i].legs[j].departure_date.split('  ')[0]+`</span><br/>
                                                                    <span style="font-weight:500;">`+msg.result.response.price_pick_return.segments[i].legs[j].origin_name+` - `+msg.result.response.price_pick_return.segments[i].legs[j].origin_city+` (`+msg.result.response.price_pick_return.segments[i].legs[j].origin+`)</span><br/>`;
                                //                                    if(msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].origin_terminal != ''){
                                //                                        text+=`<span style="font-size:13px; font-weight:500;">Terminal: `+msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].origin_terminal+`</span>`;
                                //                                    }else{
                                                                        text+=`<span style="font-size:13px; font-weight:500;">Terminal: -</span>`;
                                //                                    }
                                                                text+=`
                                                                </div>

                                                                <div class="col-lg-6 col-xs-6" style="padding:0;">
                                                                    <table style="width:100%; margin-bottom:6px;">
                                                                        <tr>
                                                                            <td><h5>`+msg.result.response.price_pick_return.segments[i].legs[j].arrival_date.split('  ')[1]+`</h5></td>
                                                                            <td></td>
                                                                            <td style="height:30px;padding:0 15px;width:100%"></td>
                                                                        </tr>
                                                                    </table>
                                                                    <span>`+msg.result.response.price_pick_return.segments[i].legs[j].arrival_date.split('  ')[0]+`</span><br/>
                                                                    <span style="font-weight:500;">`+msg.result.response.price_pick_return.segments[i].legs[j].destination_name+` - `+msg.result.response.price_pick_return.segments[i].legs[j].destination_city+` (`+msg.result.response.price_pick_return.segments[i].legs[j].destination+`)</span><br/>`;
                                //                                    if(msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].destination_terminal != ''){
                                //                                        text+=`<span style="font-size:13px; font-weight:500;">Terminal: `+msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].destination_terminal+`</span>`;
                                //                                    }else{
                                                                        text+=`<span style="font-size:13px; font-weight:500;">Terminal: -</span>`;
                                //                                    }
                                                                text+=`
                                                                </div>
                                                            </div>`;
                                                        }
                                                        text += `
                                                    </div>
                                                </div>`;
                                            }
                                            text+=`
                                        </div>
                                    </div>
                                </div>`;
                            }
                        }
                        else if(msg.result.response.state_groupbooking != 'draft' && msg.result.response.provider_bookings.length != 0){
                            text += `
                            <div class="col-lg-12 mt-3" style="background-color:white; border-top:1px solid #cdcdcd;">
                                <div class="row">
                                    <div class="col-lg-12">`;
                                    flight_counter = 1;
                                    rules = 0;
                                    for(i in msg.result.response.provider_bookings){
                                        $text += '\n‣ Booking Code: ';
                                        if(i != 0)
                                            text+=`<hr/>`;

                                        text+=`
                                        <div class="row pt-3">
                                            <div class="col-xs-6">
                                                <h5 class="single_border_custom_bottom mb-2" style="width:max-content;">Flight `+flight_counter+`</h5>
                                            </div>
                                            <div class="col-xs-6" style="text-align:right;">`;
                                                if(msg.result.response.provider_bookings[i].pnr != 'departure' && msg.result.response.provider_bookings[i].pnr != 'return'){
                                                    $text += msg.result.response.provider_bookings[i].pnr+'\n';
                                                    text+=`<h5>PNR: `+msg.result.response.provider_bookings[i].pnr+`</h5>`;
                                                }else{
                                                    $text += '-\n';
                                                    text+=`<h5>PNR: -</h5>`;
                                                }
                                            text+=`
                                            </div>
                                        </div>`;

                                        fare_detail_list = [];
                                        $text += '\nFlight '+ flight_counter+'\n';
                                        flight_counter++;
                                        for(k in msg.result.response.provider_bookings[i].ticket.segments){
                                            var cabin_class = '';
                                            //yang baru harus diganti
                                            if(msg.result.response.request.cabin_class == 'Y')
                                                cabin_class = 'Economy Class';
                                            else if(msg.result.response.provider_bookings[i].ticket.segments[k].carrier_code == 'QG' && msg.result.response.request.cabin_class == 'W')
                                                cabin_class = 'Royal Green Class';
                                            else if(msg.result.response.request.cabin_class == 'W')
                                                cabin_class = 'Premium Economy Class';
                                            else if(msg.result.response.request.cabin_class == 'C')
                                                cabin_class = 'Business Class';
                                            else if(msg.result.response.request.cabin_class == 'F')
                                                cabin_class = 'First Class';

                                            text+=`
                                            <div class="row">
                                                <div class="col-lg-12">`;
                                                try{
                                                    text += `<img data-toggle="tooltip" style="width:50px; height:50px;" alt="`+airline_carriers[msg.result.response.provider_bookings[i].ticket.segments[k].carrier_code].name+`" title="`+airline_carriers[msg.result.response.provider_bookings[i].ticket.segments[k].carrier_code].name+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+msg.result.response.provider_bookings[i].ticket.segments[k].carrier_code+`.png"/>`;
                                                }catch(err){
                                                    text += `<img data-toggle="tooltip" style="width:50px; height:50px;" alt="`+msg.result.response.provider_bookings[i].ticket.segments[k].carrier_code+`" title="`+msg.result.response.provider_bookings[i].ticket.segments[k].carrier_code+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+msg.result.response.provider_bookings[i].ticket.segments[k].carrier_code+`.png"/>`;
                                                }
                                                text+=`<h5>`+msg.result.response.provider_bookings[i].ticket.segments[k].carrier_name+`</h5>
                                                    <span>Class : `+cabin_class+`</span><br/>
                                                </div>
                                                <div class="col-lg-12" style="padding-top:10px;">`;

                                            for(l in msg.result.response.provider_bookings[i].ticket.segments[k].legs){
                                                $text+='‣ ';
                                                try{
                                                    $text += airline_carriers[msg.result.response.provider_bookings[i].ticket.segments[k].carrier_code].name + ' ' + msg.result.response.provider_bookings[i].ticket.segments[k].carrier_number;
                                                }catch(err){
                                                    $text += msg.result.response.provider_bookings[i].ticket.segments[k].carrier_name;
                                                }
                                                if(cabin_class != '')
                                                    $text += ' ' + cabin_class;
                                                else
                                                    $text += ' ' + cabin_class;

                //                                        $text += '\n\n';
                //                                        $text += '‣ Departure:\n';
                //                                        $text += msg.result.response.provider_bookings[i].ticket.segments[k].legs[l].origin_name + ' (' + msg.result.response.provider_bookings[i].ticket.segments[k].legs[l].origin_city + ') ' + '\n';
                //
                //                                        $text += '\n';
                //                                        $text += '‣ Arrival:\n';
                //                                        $text += msg.result.response.provider_bookings[i].ticket.segments[k].legs[l].destination_name + ' (' + msg.result.response.provider_bookings[i].ticket.segments[k].legs[l].destination_city + ') ' +'\n\n';

                                                $text += '\n'+msg.result.response.provider_bookings[i].ticket.segments[k].legs[l].origin_city + ' (' + msg.result.response.provider_bookings[i].ticket.segments[k].legs[l].origin + ') - ' + msg.result.response.provider_bookings[i].ticket.segments[k].legs[l].destination_city + ' (' + msg.result.response.provider_bookings[i].ticket.segments[k].legs[l].destination + ')\n';

                                                if(msg.result.response.provider_bookings[i].ticket.segments[k].legs[l].arrival_date.split('  ')[0] == msg.result.response.provider_bookings[i].ticket.segments[k].legs[l].departure_date.split('  ')[0]){
                                                    $text += msg.result.response.provider_bookings[i].ticket.segments[k].legs[l].departure_date.split('  ')[0]+' ';
                                                    $text += msg.result.response.provider_bookings[i].ticket.segments[k].legs[l].departure_date.split('  ')[1]+' - ';
                                                    $text += msg.result.response.provider_bookings[i].ticket.segments[k].legs[l].arrival_date.split('  ')[1]+'\n';
                                                }else{
                                                    $text += msg.result.response.provider_bookings[i].ticket.segments[k].legs[l].departure_date.split('  ')[0]+' ';
                                                    $text += msg.result.response.provider_bookings[i].ticket.segments[k].legs[l].departure_date.split('  ')[1]+' - ';
                                                    $text += msg.result.response.provider_bookings[i].ticket.segments[k].legs[l].arrival_date.split('  ')[0]+' ';
                                                    $text += msg.result.response.provider_bookings[i].ticket.segments[k].legs[l].arrival_date.split('  ')[1]+'\n\n';
                                                }

                                                text+= `
                                                <div class="row">
                                                    <div class="col-lg-6 col-xs-6">
                                                        <table style="width:100%">
                                                            <tr>
                                                                <td><h5>`+msg.result.response.provider_bookings[i].ticket.segments[k].legs[l].departure_date.split('  ')[1]+`</h5></td>
                                                                <td style="padding-left:15px;">
                                                                    <img src="/static/tt_website/images/icon/symbol/airlines-01.png" alt="Airline" style="width:20px; height:20px;"/>
                                                                </td>
                                                                <td style="height:30px;padding:0 15px;width:100%">
                                                                    <div style="display:inline-block;position:relative;width:100%">
                                                                        <div style="height:2px;position:absolute;top:16px;width:100%;background-color:#d4d4d4;"></div>
                                                                        <div class="origin-code-snippet" style="background-color:#d4d4d4;right:-6px"></div>
                                                                        <div style="height:30px;min-width:40px;position:relative;width:0%"/>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                        <span>`+msg.result.response.provider_bookings[i].ticket.segments[k].legs[l].departure_date.split('  ')[0]+`</span><br/>
                                                        <span style="font-weight:500;">`+msg.result.response.provider_bookings[i].ticket.segments[k].legs[l].origin_name+` - `+msg.result.response.provider_bookings[i].ticket.segments[k].legs[l].origin_city+` (`+msg.result.response.provider_bookings[i].ticket.segments[k].legs[l].origin+`)</span><br/>`;
                //                                            if(msg.result.response.provider_bookings[i].ticket.segments[k].legs[l].origin_terminal != ''){
                //                                                text+=`<span style="font-size:13px; font-weight:500;">Terminal: `+msg.result.response.provider_bookings[i].ticket.segments[k].legs[l].origin_terminal+`</span>`;
                //                                            }else{
                                                            text+=`<span style="font-size:13px; font-weight:500;">Terminal: -</span>`;
                //                                            }
                                                    text+=`
                                                    </div>

                                                    <div class="col-lg-6 col-xs-6" style="padding:0;">
                                                        <table style="width:100%; margin-bottom:6px;">
                                                            <tr>
                                                                <td><h5>`+msg.result.response.provider_bookings[i].ticket.segments[k].legs[l].arrival_date.split('  ')[1]+`</h5></td>
                                                                <td></td>
                                                                <td style="height:30px;padding:0 15px;width:100%"></td>
                                                            </tr>
                                                        </table>
                                                        <span>`+msg.result.response.provider_bookings[i].ticket.segments[k].legs[l].arrival_date.split('  ')[0]+`</span><br/>
                                                        <span style="font-weight:500;">`+msg.result.response.provider_bookings[i].ticket.segments[k].legs[l].destination_name+` - `+msg.result.response.provider_bookings[i].ticket.segments[k].legs[l].destination_city+` (`+msg.result.response.provider_bookings[i].ticket.segments[k].legs[l].destination+`)</span><br/>`;
                //                                            if(msg.result.response.provider_bookings[i].ticket.segments[k].legs[l].destination_terminal != ''){
                //                                                text+=`<span style="font-size:13px; font-weight:500;">Terminal: `+msg.result.response.provider_bookings[i].ticket.segments[k].legs[l].destination_terminal+`</span>`;
                //                                            }else{
                                                            text+=`<span style="font-size:13px; font-weight:500;">Terminal: -</span>`;
                //                                            }
                                                    text+=`
                                                    </div>
                                                </div>`;
                                            }
                                            text+=`</div>
                                            </div>`;
                                            $text += '\n';
                                        }
                                        if(msg.result.response.provider_bookings[i].rules){
                                            $text += `Rules:\n`;
                                            for(j in msg.result.response.provider_bookings[i].rules){
                                                text += `
                                                    <span id="span-tac-up`+rules+`" class="carrier_code_template" style="display: block; cursor: pointer;" onclick="show_hide_tac(`+rules+`);"> `+msg.result.response.provider_bookings[i].rules[j].name+` <i class="fas fa-chevron-down"></i></span>
                                                    <span id="span-tac-down`+rules+`" class="carrier_code_template" style="display: none; cursor: pointer;" onclick="show_hide_tac(`+rules+`);"> `+msg.result.response.provider_bookings[i].rules[j].name+` <i class="fas fa-chevron-up"></i></span>
                                                    <div id="div-tac`+rules+`" style="display: none; max-height: 175px; overflow-y: auto; padding: 15px;">
                                                `;
                                                $text += msg.result.response.provider_bookings[i].rules[j].name + '\n';
                                                if(msg.result.response.provider_bookings[i].rules[j].description.length > 0){
                                                    for(k in msg.result.response.provider_bookings[i].rules[j].description){
                                                        text += `
                                                            <div class="row">
                                                                <div class="col-lg-1 col-xs-1 col-md-1">
                                                                    <i class="fas fa-circle" style="font-size:9px;margin-left:15px;"></i>
                                                                </div>
                                                                <div class="col-lg-11 col-xs-11 col-md-11" style="padding:0">
                                                                    <span style="font-weight:400;"> `+msg.result.response.provider_bookings[i].rules[j].description[k]+`</span><br>
                                                                </div>
                                                            </div>`;
                                                        $text += '‣ '+msg.result.response.provider_bookings[i].rules[j].description[k]+'\n';
                                                    }
                                                }else{
                                                    text += `
                                                            <div class="row">
                                                                <div class="col-lg-1 col-xs-1 col-md-1">
                                                                    <i class="fas fa-circle" style="font-size:9px;margin-left:15px;"></i>
                                                                </div>
                                                                <div class="col-lg-11 col-xs-11 col-md-11" style="padding:0">
                                                                    <span style="font-weight:400;">No `+msg.result.response.provider_bookings[i].rules[j].name+`</span><br>
                                                                </div>
                                                            </div>`;
                                                    $text += '‣ No '+msg.result.response.provider_bookings[i].rules[j].name+'\n';
                                                }
                                                text += `</div>`;
                                                rules++;
                                            }
                                            $text += `\n`;
                                        }else{
                                            text += `No Rules`;
                                            $text += `No Rules\n\n`;
                                        }
                                    }
                                    text+=`
                            </div>
                        </div>
                    </div>`;
                    }
                    text+=`</div>`;

                    if(msg.result.response.state_groupbooking == 'confirm'){
                        text+=`
                        <div class="row">
                            <div class="col-lg-12">
                                <button type="button" id="button-print-print" class="primary-btn ld-ext-right" style="margin-top:10px;" onclick="modal('ticket',true)">
                                    Choose Ticket
                                    <div class="ld ld-ring ld-cycle"></div>
                                </button>
                            </div>
                        </div>`;
                    }
                text+=`</div>`;

                text+=`
                <div class="col-lg-12 mb-3" style="padding-top:15px; padding-bottom:15px; border:1px solid #cdcdcd; background-color:white;">
                    <div class="row">
                        <div class="col-lg-12 mb-3" style="border-bottom: 1px solid #cdcdcd;">`;
                            text+=`<h4 class="mb-3"><i class="fas fa-user"></i> Booker</h4>
                        </div>
                        <div class="col-lg-12">`;
                            if(msg.result.response.booker.name != false){
                                title = '';
                                if(msg.result.response.booker.gender == 'female' && msg.result.response.booker.marital_status == "married")
                                    title = 'MRS';
                                else if(msg.result.response.booker.gender == 'female')
                                    title = 'MS'
                                else
                                    title = 'MR';

                                text+=`
                                <div class="row pt-1">
                                    <div class="col-lg-12">
                                        <h4>
                                            `+title+` `+msg.result.response.booker.name+`
                                        </h4>
                                        <input id="id_passenger`+counter_passenger+`" name="id_passenger`+counter_passenger+`" type="hidden"/>
                                        <b>Email: </b><i>`+msg.result.response.booker.email+`</i><br/>`;
                                        if(msg.result.response.booker.phones.length > 0)
                                            text+=`<b>Phone: </b><i>`+msg.result.response.booker.phones[0].calling_code+' - '+msg.result.response.booker.phones[0].calling_number+`</i>`;
                                        else
                                            text+=`<b>Phone: </b>-`;
                                    text+=`
                                    </div>
                                </div>`;
                                document.getElementById('booker_title').value = title;
                                document.getElementById('booker_first_name').value = msg.result.response.booker.first_name;
                                document.getElementById('booker_last_name').value = msg.result.response.booker.last_name;
                                $('#booker_nationality_id').val(msg.result.response.booker.nationality_code).trigger('change');
                                document.getElementById('booker_email').value = msg.result.response.booker.email;
                                $('#booker_phone_code_id').val(msg.result.response.booker.phones[0].calling_code).trigger('change');
                                document.getElementById('booker_phone').value = msg.result.response.booker.phones[0].calling_number;
                                $('#booker_title').niceSelect('update');
                                document.getElementById('booker_cp').checked = false;
                            }
                            if(msg.result.response.state_groupbooking == 'confirm'){
                                text+= `
                                <button type="button" id="button-print-print" class="primary-btn ld-ext-right mt-2 mb-3" onclick="modal('booker',true)">`;
                                    if(msg.result.response.booker.name == false)
                                        text+=`
                                            Add Booker`;
                                    else
                                        text+=`
                                            Edit Booker`;
                                text+=`
                                    <div class="ld ld-ring ld-cycle"></div>
                                </button>`;
                            }
                        text+=`
                        </div>
                    </div>
                </div>
                <div class="col-lg-12 mb-3" style="padding-bottom:15px; border:1px solid #cdcdcd; background-color:white;">
                    <div class="row pt-3">
                        <div class="col-lg-12 mb-3" style="border-bottom: 1px solid #cdcdcd;">`;
                            text+=`<h4 class="mb-3"><i class="fas fa-user"></i> Contact Person</h4>
                        </div>
                        <div class="col-lg-12">`;
                            if(msg.result.response.contact.name != false){

                                text+=`
                                <div class="row pt-1">
                                    <div class="col-lg-12">
                                        <h4>
                                            `+msg.result.response.contact.title+` `+msg.result.response.contact.name+`
                                        </h4>
                                        <input id="id_passenger`+counter_passenger+`" name="id_passenger`+counter_passenger+`" type="hidden"/>
                                        <b>Email: </b><i>`+msg.result.response.contact.email+`</i><br/>`;
                                        text+=`<b>Phone: </b><i>`+msg.result.response.contact.phone+`</i>`;
                                    text+=`
                                    </div>
                                </div>`;
                                document.getElementById('contact_title').value = msg.result.response.contact.title;
                                document.getElementById('contact_first_name').value = msg.result.response.contact_id.first_name;
                                document.getElementById('contact_last_name').value = msg.result.response.contact_id.last_name;
                                $('#contact_nationality_id').val(msg.result.response.contact_id.nationality_code).trigger('change');
                                document.getElementById('contact_email').value = msg.result.response.contact.email;
                                $('#contact_phone_code_id').val(msg.result.response.contact.phone.split(' - ')[0]).trigger('change');
                                document.getElementById('contact_phone').value = msg.result.response.contact.phone.split(' - ')[1];
                                $('#contact_title').niceSelect('update');
                            }
                            if(msg.result.response.booker.name != false){
                                if(msg.result.response.state_groupbooking == 'confirm'){
                                    text += `
                                        <button type="button" id="button-print-print" class="primary-btn ld-ext-right mt-2" onclick="modal('contact',true)">`;
                                    if(msg.result.response.contact.name == false)
                                        text+=`
                                            Add Contact`;
                                    else
                                        text+=`
                                            Edit Contact`;
                                    text+=`
                                            <div class="ld ld-ring ld-cycle"></div>
                                        </button>`;
                                }
                            }
                        text+=`
                        </div>
                    </div>
                </div>`;
                document.getElementById('group_booking').innerHTML = text;

                //btn print
                text = '';
                if(msg.result.response.state_groupbooking == 'confirm'){
                    text+= `
                        <button type="button" id="button-print-print" class="primary-btn ld-ext-right mt-3" onclick="group_booking_update_passenger()">`;
                    //kalau sudah pilih
                    text+=`
                            Save Passengers`;
                    text+=`
                            <div class="ld ld-ring ld-cycle"></div>
                        </button>`;
                }

                text +=`

                <div class="row" style="margin-top:20px;">`;
                if(msg.result.response.state_groupbooking != 'draft' && msg.result.response.state_groupbooking != 'confirm'){
                    text+=`
                        <div class="col-lg-6 col-md-6" style="padding-bottom:10px;">`;
                            if(msg.result.response.state != 'cancel' && msg.result.response.state != 'cancel2'){
                                if (msg.result.response.state == 'issued'){
                                    text+=`
                                    <button type="button" id="button-choose-print" class="primary-btn ld-ext-right" style="width:100%;" onclick="get_printout('`+msg.result.response.order_number+`', 'ticket','groupbooking');">
                                        <i class="fas fa-print"></i> Print Ticket
                                        <div class="ld ld-ring ld-cycle"></div>
                                    </button>`;
                                }
                            }
                            text+=`
                        </div>`;
                        text+=`
                        <div class="col-lg-6 col-md-6" style="padding-bottom:10px;">`;
                            if(msg.result.response.state != 'cancel' && msg.result.response.state != 'cancel2'){
                                if (msg.result.response.state  == 'booked'){
                                    text+=`
                                    <button type="button" id="button-print-print" class="primary-btn ld-ext-right" style="width:100%;" onclick="get_printout('`+msg.result.response.order_number+`', 'itinerary','groupbooking');">
                                        <i class="fas fa-print"></i> Print Form
                                        <div class="ld ld-ring ld-cycle"></div>
                                    </button>`;
                                }
                                else if (msg.result.response.state == 'issued'){
                                    text+=`
                                    <button type="button" class="primary-btn ld-ext-right" id="button-print-print" style="width:100%;" onclick="get_printout('`+msg.result.response.order_number+`', 'ticket_price','groupbooking');">
                                        <i class="fas fa-print"></i> Print Ticket (Price)
                                        <div class="ld ld-ring ld-cycle"></div>
                                    </button>`;
                                }
                            }
                            text+=`
                        </div>`;
                        text+=`<div class="col-lg-6 col-md-6" style="padding-bottom:10px;">`;
                            if(msg.result.response.state != 'cancel' && msg.result.response.state != 'cancel2'){
                                if (msg.result.response.state == 'issued'){
                                    text+=`
                                    <button type="button" class="issued-booking-train primary-btn ld-ext-right" style="width:100%;" data-toggle="modal" data-target="#printInvoice">
                                        <i class="fas fa-print"></i> Print Invoice
                                        <div class="ld ld-ring ld-cycle"></div>
                                    </button>`;

                                    // modal invoice
                                    text+=`
                                        <div class="modal fade" id="printInvoice" role="dialog" data-keyboard="false">
                                            <div class="modal-dialog">

                                              <!-- Modal content-->
                                                <div class="modal-content">
                                                    <div class="modal-header">
                                                        <h4 class="modal-title">Invoice</h4>
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
                                                            <button type="button" id="button-issued-print" class="primary-btn ld-ext-right" onclick="get_printout('`+msg.result.response.order_number+`', 'invoice','groupbooking');">
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
                        </div>`;
                }
                document.getElementById('btn_print').innerHTML = text;
                if(msg.result.response.state != 'draft')
                document.getElementById('list_of_pax').hidden = false;

                if(msg.result.response.state_groupbooking != 'draft' && msg.result.response.state_groupbooking != 'confirm'){
                    //detail
                    text = '';
                    tax = 0;
                    fare = 0;
                    total_price = 0;
                    total_price_provider = [];
                    commission = 0;
                    service_charge = ['FARE', 'RAC', 'ROC', 'TAX', 'SSR', 'DISC'];
                    text_detail=`
                    <div style="background-color:white; padding:15px; border: 1px solid #cdcdcd; margin-bottom:15px;">
                        <div class="row">
                            <div class="col-lg-12 mb-3" style="border-bottom:1px solid #cdcdcd;">
                                <h4 class="mb-3">Price Detail</h4>
                            </div>
                        </div>`;

                    //repricing
                    type_amount_repricing = ['Repricing'];
                    //repricing
                    counter_service_charge = 0;
                    price_arr_repricing = {};
                    pax_type_repricing = [];
                    disc = 0;

                    $text += '\n‣ Contact Person:\n';
                    $text += msg.result.response.contact.title + ' ' + msg.result.response.contact.name + '\n';
                    $text += msg.result.response.contact.email + '\n';
                    $text += msg.result.response.contact.phone+ '\n';

                    $text += '\n‣ Price:\n';
                    for(i in msg.result.response.provider_bookings){
                        try{
                            if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false || msg.result.response.state == 'issued')
                                text_detail+=`
                                    <div style="text-align:left">
                                        <span style="font-weight:500; font-size:14px;">PNR: `+msg.result.response.provider_bookings[i].pnr+` </span>
                                    </div>`;

                            for(j in msg.result.response.passengers){
                                price = {'FARE': 0, 'RAC': 0, 'ROC': 0, 'TAX':0 , 'currency': '', 'CSC': 0, 'SSR': 0, 'DISC': 0,'SEAT':0};
                                csc = 0;
                                for(k in msg.result.response.passengers[j].sale_service_charges[msg.result.response.provider_bookings[i].pnr]){
                                    price[k] += msg.result.response.passengers[j].sale_service_charges[msg.result.response.provider_bookings[i].pnr][k].amount;
                                    if(price['currency'] == '')
                                        price['currency'] = msg.result.response.passengers[j].sale_service_charges[msg.result.response.provider_bookings[i].pnr][k].currency;
                                }
                                disc -= price['DISC'];
                                if(i ==0 ){
                                    //HANYA PROVIDER PERTAMA KARENA UPSELL PER PASSENGER BUKAN PER JOURNEY
                                    try{
//                                        price['CSC'] = msg.result.response.passengers[j].channel_service_charges.amount;
                                        csc += msg.result.response.passengers[j].channel_service_charges.amount;
                                    }catch(err){
                                        console.log(err); // error kalau ada element yg tidak ada
                                    }
                                }
                                //repricing
                                check = 0;
                                for(k in pax_type_repricing){
                                    if(pax_type_repricing[k][0] == msg.result.response.passengers[j].name)
                                        check = 1;
                                }
                                if(check == 0){
                                    pax_type_repricing.push([msg.result.response.passengers[j].name, msg.result.response.passengers[j].name]);
                                    price_arr_repricing[msg.result.response.passengers[j].name] = {
                                        'Fare': price['FARE'] + price['SSR'] + price['SEAT'] + price['DISC'],
                                        'Tax': price['TAX'] + price['ROC'] - csc,
                                        'Repricing': csc
                                    }
                                }else{
                                    price_arr_repricing[msg.result.response.passengers[j].name] = {
                                        'Fare': price_arr_repricing[msg.result.response.passengers[j].name]['Fare'] + price['FARE'] + price['DISC'] + price['SSR'] + price['SEAT'],
                                        'Tax': price_arr_repricing[msg.result.response.passengers[j].name]['Tax'] + price['TAX'] + price['ROC'] - csc,
                                        'Repricing': csc
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
                                if (typeof price !== 'undefined'){
                                    text_detail+=`
                                    <div class="row" style="margin-bottom:5px;">
                                        <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                            <span style="font-size:12px;">`+msg.result.response.passengers[j].name+`</span>`;
                                        text_detail+=`</div>
                                        <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">`;
                                        if(counter_service_charge == 0) // with upsell pnr pertama
                                            text_detail+=`
                                            <span style="font-size:13px;">`+price.currency+` `+getrupiah(parseInt(price.FARE + price.TAX + price.ROC + price.SSR + price.SEAT + price.CSC))+`</span>`;
                                        else // no upsell
                                            text_detail+=`
                                            <span style="font-size:13px;">`+price.currency+` `+getrupiah(parseInt(price.FARE + price.TAX + price.ROC + price.SSR + price.SEAT))+`</span>`;
                                        text_detail+=`
                                        </div>
                                    </div>`;
                                }
                                $text += msg.result.response.passengers[j].title +' '+ msg.result.response.passengers[j].name + '\n';
                                journey_code = [];
                                for(k in msg.result.response.provider_bookings[i].journeys){
                                    try{
                                        journey_code.push(msg.result.response.provider_bookings[i].journeys[k].journey_code)
                                    }catch(err){
                                        console.log(err); // error kalau ada element yg tidak ada
                                    }
                                    for(l in msg.result.response.provider_bookings[i].journeys[k].segments){
                                        journey_code.push(msg.result.response.provider_bookings[i].journeys[k].segments[l].segment_code)
                                    }
                                }
                                coma = false

                                if (typeof price !== 'undefined'){
                                    $text += '['+msg.result.response.provider_bookings[i].pnr+'] '

                                    if(counter_service_charge == 0){ // with upsell
                                        total_price += parseInt(price.TAX + price.ROC + price.FARE + price.SEAT + price.CSC + price.SSR + price.DISC);
                                        $text += currency+` `+getrupiah(parseInt(price.FARE + price.SSR + price.SEAT + price.TAX + price.ROC + price.CSC + price.DISC))+'\n\n';
                                    }else{ // no upsell
                                        total_price += parseInt(price.TAX + price.ROC + price.FARE + price.SSR + price.SEAT + price.DISC);
                                        $text += currency+` `+getrupiah(parseInt(price.FARE + price.SSR + price.SEAT + price.TAX + price.ROC + price.DISC))+'\n\n';
                                    }
                                    commission += parseInt(price.RAC);
                                    total_price_provider.push({
                                        'pnr': msg.result.response.provider_bookings[i].pnr,
                                        'provider': msg.result.response.provider_bookings[i].provider,
                                        'price': JSON.parse(JSON.stringify(price))
                                    });
                                }
                            }
                            counter_service_charge++;
                        }catch(err){console.log(err);}
                    }
                    // di gabung
//                    if(csc != 0 && typeof price !== 'undefined'){
//                        text_detail+=`
//                            <div class="row" style="margin-bottom:5px;">
//                                <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
//                                    <span style="font-size:12px;">Other service charges</span>`;
//                                text_detail+=`</div>
//                                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
//                                    <span style="font-size:13px;">`+price.currency+` `+getrupiah(parseInt(csc))+`</span>
//                                </div>
//                            </div>`;
//                    }
                    try{
                        group_booking_get_detail.result.response.total_price = total_price;
                        $text += '‣ Grand Total: '+price.currency+' '+ getrupiah(total_price);
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
                                    console.log(err);
                                }
                                text_detail+= `</span>
                            </div>
                        </div>`;
                        if(msg.result.response.state == 'booked' && user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
                            text_detail+=`<div style="text-align:right; padding-bottom:10px;"><img src="/static/tt_website/images/icon/symbol/upsell_price.png" alt="Bank" style="width:auto; height:25px; cursor:pointer;" onclick="show_repricing();"/></div>`;
                        else if(msg.result.response.state == 'issued' && user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false){
                            text_detail+=`<div style="text-align:right; padding-bottom:10px;"><img src="/static/tt_website/images/icon/symbol/upsell_booker.png" alt="Bank" style="width:auto; height:25px; cursor:pointer;" onclick="show_repricing();"/></div>`;
                            document.getElementById('repricing_type').innerHTML = '<option value="booker">Booker</option>';
                            $('#repricing_type').niceSelect('update');
                            reset_repricing();
                        }
                        text_detail+=`<div class="row">
                        <div class="col-lg-12" style="padding-bottom:10px;">
                            <hr/>
                            <span style="font-size:14px; font-weight:bold;"><i class="fas fa-share-alt"></i> Share This on:</span><br/>`;
                            share_data();
                            var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                            if (isMobile) {
                                text_detail+=`
                                    <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/whatsapp.png" alt="Whatsapp"/></a>
                                    <a href="line://msg/text/`+ $text_share +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/line.png" alt="Line"/></a>
                                    <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/telegram.png" alt="Telegram"/></a>
                                    <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/email.png" alt="Email"/></a>`;
                            } else {
                                text_detail+=`
                                    <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/whatsapp.png" alt="Whatsapp"/></a>
                                    <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/line.png" alt="Line"/></a>
                                    <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/telegram.png" alt="Telegram"/></a>
                                    <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/email.png" alt="Email"/></a>`;
                            }

                        text_detail+=`
                            </div>
                        </div>`;

                        if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false && user_login.co_agent_frontend_security.includes('see_commission')){
                            text_detail+=`
                            <div class="alert alert-success" style="margin-top:10px;">
                                <div style="color:black; font-weight:bold; cursor:pointer; font-size:15px; text-align:left; width:100%;" onclick="show_commission('show_commission');">
                                    <span>YPM </span>
                                    <span id="show_commission_button">`;
                                        text_detail+=`<span style="float:right;">show <i class="fas fa-eye"></i></span>`;
                                    text_detail+=`
                                    </span>`;

                                    text_detail+=`<span id="show_commission" style="display:none;">`;

                                    text_detail+=`<span style="font-size:14px; font-weight: bold; color:`+color+`;"> `+price.currency+` `+getrupiah(parseInt(commission)*-1)+`</span><br/>`;

                                    if(msg.result.response.hasOwnProperty('agent_nta') == true){
                                        total_nta = 0;
                                        total_nta = msg.result.response.agent_nta;
                                        text_detail+=`
                                        <span style="font-size:14px; font-weight:bold;">Agent NTA: </span>
                                        <span style="font-size:14px; font-weight:bold; color:`+color+`;">`+price.currency+` `+getrupiah(total_nta)+`</span><br/>`;
                                    }
                                    if(msg.result.response.hasOwnProperty('total_nta') == true){
                                        total_nta = 0;
                                        total_nta = msg.result.response.total_nta;
                                        text_detail+=`
                                        <span style="font-size:14px; font-weight:bold;">HO NTA: </span>
                                        <span style="font-size:14px; font-weight:bold; color:`+color+`;">`+price.currency+` `+getrupiah(total_nta)+`</span><br/>`;
                                    }
                                    if(msg.result.response.hasOwnProperty('booker_insentif') == true){
                                        booker_insentif = 0;
                                        booker_insentif = msg.result.response.booker_insentif;
                                        text_detail+=`
                                        <span style="font-size:14px; font-weight:bold;">Booker Insentif: </span>
                                        <span style="font-size:14px; font-weight:bold; color:`+color+`;">`+price.currency+` `+getrupiah(booker_insentif)+`</span>`;
                                    }
                                    if(commission == 0){
                                        text_detail+=`<span style="font-size:13px; font-weight: bold;color:red">* Please mark up the price first</span>`;
                                    }
                                    text_detail+=`
                                    </span>
                                </div>
                            </div>`;
                        }
                        text_detail+=`<center>

                        <div style="padding-bottom:10px;">
                            <center>
                                <input type="button" class="primary-btn-white" style="width:100%;" onclick="copy_data();" value="Copy"/>
                            </center>
                        </div>
                    </div>`;
//                        if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
//                        text_detail+=`
//                        <div style="margin-bottom:5px;">
//                            <input class="primary-btn-white" id="show_commission_button" style="width:100%;" type="button" onclick="show_commission('commission');" value="Show YPM"/>
//                        </div>

                    }catch(err){
                        console.log(err); // error kalau ada element yg tidak ada
                    }
                    document.getElementById('group_booking_detail').innerHTML = text_detail;
                }

                $("#show_loading_booking_airline").hide();

                //
                text = `
                <div class="modal fade" id="myModal" role="dialog">
                    <div class="modal-dialog">

                        <!-- Modal content-->
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title">Price Change <i class="fas fa-money"></i></h4>
                                <button type="button" class="close" data-dismiss="modal" onclick="airline_get_booking('`+msg.result.response.order_number+`');show_loading();please_wait_transaction();">&times;</button>
                            </div>
                            <div class="modal-body">
                                <div style="overflow:auto;height:300px;margin-top:20px;">
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
                                <button type="button" class="btn btn-default" data-dismiss="modal" onclick="airline_get_booking('`+msg.result.response.order_number+`');show_loading();please_wait_transaction();">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal fade" id="myModal_reissue" role="dialog">
                    <div class="modal-dialog">

                        <!-- Modal content-->
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title">Ticket <i class="fas fa-money"></i></h4>
                                <button type="button" class="close" onclick="dismiss_reissue();">&times;</button>
                            </div>
                            <div class="modal-body">
                                <div style="overflow:auto;height:300px;margin-top:20px;">
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
                                <h4 class="modal-title">Price Change <i class="fas fa-money"></i></h4>
                                <button type="button" class="close" onclick="dismiss_reissue_get_price();">&times;</button>
                            </div>
                            <div class="modal-body">
                                <div style="overflow:auto;height:300px;margin-top:20px;">
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
                document.getElementById('group_booking').innerHTML += text;
                document.getElementById('show_title_group_booking').hidden = false;
                document.getElementById('show_loading_booking_group_booking').hidden = true;
                add_repricing();
                if (msg.result.response.state != 'booked'){
    //                document.getElementById('issued-breadcrumb').classList.add("active");
                }
                render_ticket();

                if(msg.result.response.state_groupbooking == 'confirm'){
                    document.getElementById('btn_pax').style.display = 'block';
                    group_booking_can_sent();
                }else if(msg.result.response.state_groupbooking == 'sent'){
                    document.getElementById('btn_pax').style.display = 'none';
                    document.getElementById('book_btn_group_booking').style.display = 'none';
                    is_agent = msg.result.response.agent_name == user_login.co_agent_name
                    get_payment_acq('Issued',msg.result.response.booker.seq_id, msg.result.response.order_number, 'billing',signature,'groupbooking', is_agent);
                    try{
                        $(".issued_booking_btn").show();
                    }catch(err){
                        console.log(err); // error kalau ada element yg tidak ada
                    }
                }else{
                    document.getElementById('btn_pax').style.display = 'none';
                }
                if(msg.result.response.hasOwnProperty('payment_rules_available'))
                    issued_rules_print();
                for(i in msg.result.response.passengers){
                    data_pax = [
                        msg.result.response.passengers[i].pax_type,
                        msg.result.response.passengers[i].title,
                        msg.result.response.passengers[i].first_name,
                        msg.result.response.passengers[i].last_name,
                        msg.result.response.passengers[i].nationality_code,
                        msg.result.response.passengers[i].birth_date.split('-')[2],
                        msg.result.response.passengers[i].birth_date.split('-')[1],
                        msg.result.response.passengers[i].birth_date.split('-')[0],
                        msg.result.response.passengers[i].identity_type,
                        msg.result.response.passengers[i].identity_number,
                        msg.result.response.passengers[i].identity_expdate ? msg.result.response.passengers[i].identity_expdate.split('-')[2] : '',
                        msg.result.response.passengers[i].identity_expdate ? msg.result.response.passengers[i].identity_expdate.split('-')[1] : '',
                        msg.result.response.passengers[i].identity_expdate ? msg.result.response.passengers[i].identity_expdate.split('-')[0] : '',
                        msg.result.response.passengers[i].identity_country_of_issued_code
                    ]
                    add_table_of_passenger('close',data_pax)
                }
                if(msg.result.response.hasOwnProperty('voucher_reference') && msg.result.response.voucher_reference != '' && msg.result.response.voucher_reference != false){
                    try{
                        render_voucher(price.currency,msg.result.response.voucher_discount, msg.result.response.state)
                    }catch(err){console.log(err);}
                }
//                try{
//                    if(msg.result.response.state == 'booked' || msg.result.response.state == 'issued' && msg.result.response.voucher_reference)
//                        document.getElementById('voucher_discount').style.display = 'block';
//                    else
//                        document.getElementById('voucher_discount').style.display = 'none';
//                }catch(err){console.log(err);}
               }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                   auto_logout();
               }else if(msg.result.error_code == 1035){
                    hide_modal_waiting_transaction();
                    document.getElementById('show_loading_booking_group_booking').hidden = true;
                    render_login('groupbooking');
               }else{
                    text += `<div class="alert alert-danger">
                            <h5>
                                `+msg.result.error_code+`
                            </h5>
                            `+msg.result.error_msg+`
                        </div>`;
                    document.getElementById('group_booking').innerHTML = text;
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: #ff9900;">Error group booking </span>' + msg.result.error_msg,
                    })
                    $('#show_loading_booking_group_booking').hide();
                    $('.loader-rodextrip').fadeOut();
               }

           }catch(err){
                console.log(err);
                text = '';
                text += `<div class="alert alert-danger">
                            <h5>
                                Error
                            </h5>
                        </div>`;
                document.getElementById('group_booking').innerHTML = text;
                $('#show_loading_booking_airline').hide();
                $('.loader-rodextrip').fadeOut();
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error airline booking </span> Please try again in 1 - 5 minutes later or contact customer service' ,
                }).then((result) => {
                  window.location.href = '/reservation';
                })
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
          error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error medical signin');
          $("#barFlightSearch").hide();
          $("#waitFlightSearch").hide();
          $('.loader-rodextrip').fadeOut();
          try{
            $("#show_loading_booking_group_booking").hide();
          }catch(err){
            console.log(err); // error kalau ada element yg tidak ada
          }
       },timeout: 60000
    });
}

function render_ticket(){
    text = '';
    type = '';
    for(i in group_booking_get_detail.result.response.ticket_list){
        if(type != group_booking_get_detail.result.response.ticket_list[i].type){
            text +=`<h4 class="mt-2 mb-2" style="text-transform: capitalize; border-bottom:3px solid `+color+`; width:fit-content;">`+group_booking_get_detail.result.response.ticket_list[i].type+`</h4>`;
            type = group_booking_get_detail.result.response.ticket_list[i].type;
        }
        is_choose = false;
        is_fare_pick = null;
        //check chosen
        if(group_booking_get_detail.result.response.ticket_list[i].type == 'departure'){
            if(group_booking_get_detail.result.response.hasOwnProperty('price_pick_departure')){
                for(j in group_booking_get_detail.result.response.ticket_list[i].fare_list){
                    if(group_booking_get_detail.result.response.ticket_list[i].fare_list[j].fare_seq_id == group_booking_get_detail.result.response.price_pick_departure.fare.fare_seq_id){
                        is_choose = true;
                        is_fare_pick = j;
                        group_booking_get_detail.result.response.ticket_list[i].fare_pick = j;
                        break;
                    }
                }
            }
        }else if(group_booking_get_detail.result.response.ticket_list[i].type == 'return'){
            if(group_booking_get_detail.result.response.hasOwnProperty('price_pick_return')){
                for(j in group_booking_get_detail.result.response.ticket_list[i].fare_list){
                    if(group_booking_get_detail.result.response.ticket_list[i].fare_list[j].fare_seq_id == group_booking_get_detail.result.response.price_pick_return.fare.fare_seq_id){
                        is_choose = true;
                        is_fare_pick = j;
                        group_booking_get_detail.result.response.ticket_list[i].fare_pick = j;
                        break;
                    }
                }
            }
        }
            text += `
            <div class="row" style="padding:10px;">
                <div class="col-lg-12" id="copy_div_airline`+i+`" style="border:1px solid #cdcdcd;">
                    <span class="copy_airline" hidden="">`+i+`</span>
                    <div class="row mt-2">
                        <div class="col-lg-2">
                            <div class="row">
                                <div class="col-lg-12" id="copy_provider_operated`+i+`">
                                    <span class="copy_po" hidden="">`+i+`</span>`;
                                    carrier_code_list = [];
                                    for(j in group_booking_get_detail.result.response.ticket_list[i].segments){
                                        if(carrier_code_list.includes(group_booking_get_detail.result.response.ticket_list[i].segments[j].carrier_code) == false){
                                            try{
                                                text+= `
                                            <span class="copy_carrier_provider" style="font-weight:500; font-size:12px;">`+airline_carriers[group_booking_get_detail.result.response.ticket_list[i].segments[j].carrier_code].name+`</span><br>
                                            <img data-toggle="tooltip" style="width:50px; height:50px;" alt="`+airline_carriers[group_booking_get_detail.result.response.ticket_list[i].segments[j].carrier_code].name+`" title="`+airline_carriers[group_booking_get_detail.result.response.ticket_list[i].segments[j].carrier_code].name+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+group_booking_get_detail.result.response.ticket_list[i].segments[j].carrier_code+`.png"><br>`;
                                            }catch(err){
                                                text+= `
                                            <span class="copy_carrier_provider" style="font-weight:500; font-size:12px;">`+group_booking_get_detail.result.response.ticket_list[i].segments[j].carrier_code+`</span><br>
                                            <img data-toggle="tooltip" style="width:50px; height:50px;" alt="`+group_booking_get_detail.result.response.ticket_list[i].segments[j].carrier_code+`" title="`+group_booking_get_detail.result.response.ticket_list[i].segments[j].carrier_code+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+group_booking_get_detail.result.response.ticket_list[i].segments[j].carrier_code+`.png"><br>`;
                                            }
                                            carrier_code_list.push(group_booking_get_detail.result.response.ticket_list[i].segments[j].carrier_code);
                                        }
                                    }
                                    text+=`
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-10">
                            <div class="row">
                            <div class="col-lg-4 col-md-4 col-sm-4 col-xs-6">
                                <table style="width:100%">
                                    <tbody><tr>
                                        <td class="airport-code"><h5 class="copy_time_depart">`+group_booking_get_detail.result.response.ticket_list[i].departure_date.split('  ')[1]+`</h5></td>
                                        <td style="padding-left:15px;">
                                            <img src="/static/tt_website/images/icon/symbol/airlines-01.png" alt="Airline" style="width:20px; height:20px;">
                                        </td>
                                        <td style="height:30px;padding:0 15px;width:100%">
                                            <div style="display:inline-block;position:relative;width:100%">
                                                <div style="height:2px;position:absolute;top:16px;width:100%;background-color:#d4d4d4;"></div>
                                                <div class="origin-code-snippet" style="background-color:#d4d4d4;right:-6px"></div>
                                                <div style="height:30px;min-width:40px;position:relative;width:0%">
                                            </div>
                                        </div></td>
                                    </tr>
                                </tbody></table>
                                <span class="copy_date_depart">`+group_booking_get_detail.result.response.ticket_list[i].departure_date.split('  ')[0]+` </span><br>
                                <span class="copy_departure" style="font-weight:500;">`;
                                if(group_booking_get_detail.result.response.ticket_list[i].type == 'departure')
                                    text += group_booking_get_detail.result.response.request.origin.city + ` (` + group_booking_get_detail.result.response.request.origin.code + `)`;
                                else
                                    text += group_booking_get_detail.result.response.request.destination.city + ` (` + group_booking_get_detail.result.response.request.destination.code + `)`;
                                text+=`</span><br>
                            </div>
                            <div class="col-lg-4 col-md-4 col-sm-4 col-xs-6 mb-2">
                                <table style="width:100%; margin-bottom:6px;">
                                    <tbody><tr>
                                        <td><h5 class="copy_time_arr">`+group_booking_get_detail.result.response.ticket_list[i].arrival_date.split('  ')[1]+`</h5></td>
                                        <td></td>
                                        <td style="height:30px;padding:0 15px;width:100%"></td>
                                    </tr>
                                </tbody></table>
                                <span class="copy_date_arr">`+group_booking_get_detail.result.response.ticket_list[i].arrival_date.split('  ')[0]+`</span><br>
                                <span class="copy_arrival" style="font-weight:500;">`;
                                if(group_booking_get_detail.result.response.ticket_list[i].type == 'departure')
                                    text += group_booking_get_detail.result.response.request.destination.city + ` (` + group_booking_get_detail.result.response.request.destination.code + `)`;
                                else
                                    text += group_booking_get_detail.result.response.request.origin.city + ` (` + group_booking_get_detail.result.response.request.origin.code + `)`;
                                text+=`</span><br>
                            </div>
                            <div class="col-lg-4 col-md-4 col-sm-4">
                                <div class="row">
                                    <div class="col-xs-12">
                                        <i class="fas fa-clock"></i><span class="copy_duration" style="font-weight:500;"> duration belum </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                   <div class="col-lg-6" style="padding-bottom:10px;">
                       <a id="detail_button_journey`+i+`" data-toggle="collapse" data-parent="#accordiondepart" onclick="show_flight_details(`+i+`);" href="#detail_departjourney`+i+`" style="color: #237395; text-decoration: unset;" aria-expanded="true">
                           <span class="detail-link" style="font-weight: bold; display:none;" id="flight_details_up`+i+`"> Flight details <i class="fas fa-chevron-up" style="font-size:14px;"></i></span>
                            <span class="detail-link" style="font-weight: bold; display:block;" id="flight_details_down`+i+`"> Flight details <i class="fas fa-chevron-down" style="font-size:14px;"></i></span>
                       </a>
                   </div>

                   <div class="col-lg-6" style="text-align:right; padding:0px 10px 15px 15px;">
                        `;

                   text +=`
                       <span id="fare`+i+`" class="basic_fare_field copy_price price_template" style="margin-right:5px;">`;
                   price = 0;
                   pax_count = 0;
                   for(j in group_booking_get_detail.result.response.ticket_list[i].fare_list[0].price_list){
                        if(group_booking_get_detail.result.response.ticket_list[i].fare_list[0].price_list[j].pax_type == 'ADT'){
                            pax_count = group_booking_get_detail.result.response.request.pax.ADT;
                        }else if(group_booking_get_detail.result.response.ticket_list[i].fare_list[0].price_list[j].pax_type == 'CHD'){
                            pax_count = group_booking_get_detail.result.response.request.pax.CHD;
                        }else if(group_booking_get_detail.result.response.ticket_list[i].fare_list[0].price_list[j].pax_type == 'INF'){
                            pax_count = group_booking_get_detail.result.response.request.pax.INF;
                        }
                        for(k in group_booking_get_detail.result.response.ticket_list[i].fare_list[0].price_list[j].service_charges){
                            if(k != 'RAC')
                                price += pax_count * group_booking_get_detail.result.response.ticket_list[i].fare_list[0].price_list[j].service_charges[k].amount;
                        }
                   }
                   text += group_booking_get_detail.result.response.ticket_list[i].fare_list[0].price_list[0].currency+` `+getrupiah(price)+`</span>`;
                   text+=`
                        <label class="radio-label" style="padding:unset; width:100px;">
                            <input type="radio" name="`+type+`" value="`+i+`"`;
                            if(is_choose)
                                text += `checked`;
                            text+=`/>
                            <div class="div_label" style="min-height:50px; max-height:50px;"><span style="black;">Choose</span></div>
                        </label>
                   </div>
               </div>
           </div>
           <div id="detail_departjourney`+i+`" class="panel-collapse in collapse show" aria-expanded="true" style="border:1px solid #cdcdcd; display: none;"><div id="copy_segments_details`+i+`">`;
            if(group_booking_get_detail.result.response.ticket_list[i].hasOwnProperty('segments')){
                text += `
                    <div class="col-lg-12 mt-2 mb-2">
                        <div class="row" style="padding:10px;">`;
                for(j in group_booking_get_detail.result.response.ticket_list[i].segments){
                    text+=`<div class="col-lg-2">`;
                    try{
                        text+=`
                           <span style="font-weight: 500; font-size:12px;" class="copy_carrier_provider_details">`+airline_carriers[group_booking_get_detail.result.response.ticket_list[i].segments[j].carrier_code].name+`</span><br/>
                           <span class="carrier_code_template">`+group_booking_get_detail.result.response.ticket_list[i].segments[j].carrier_name+`</span><br/>
                           <img data-toggle="tooltip" alt="`+group_booking_get_detail.result.response.ticket_list[i].segments[j].carrier_code+`" style="width:50px; height:50px;" title="`+airline_carriers[group_booking_get_detail.result.response.ticket_list[i].segments[j].carrier_code].name+`" src="`+static_path_url_server+`/public/airline_logo/`+group_booking_get_detail.result.response.ticket_list[i].segments[j].carrier_code+`.png"><br/>`;
                    }catch(err){
                        text+=`
                           <span style="font-weight: 500;" class="copy_carrier_provider_details">`+group_booking_get_detail.result.response.ticket_list[i].segments[j].carrier_code+`</span><br/>
                           <span class="carrier_code_template">`+group_booking_get_detail.result.response.ticket_list[i].segments[j].carrier_name+`</span><br/>
                           <img data-toggle="tooltip" alt="`+group_booking_get_detail.result.response.ticket_list[i].segments[j].carrier_code+`" style="width:50px; height:50px;" title="`+group_booking_get_detail.result.response.ticket_list[i].segments[j].carrier_code+`" src="`+static_path_url_server+`/public/airline_logo/`+group_booking_get_detail.result.response.ticket_list[i].segments[j].carrier_code+`.png"><br/>`;

                    }
                    text+= `</div>
                            <div class="col-lg-10">`;
                    for(k in group_booking_get_detail.result.response.ticket_list[i].segments[j].legs){
                        text += `
                        <div class="row" id="copy_legs_details`+i+``+j+``+k+`">
                           <span class="copy_legs" hidden>`+i+``+j+``+k+`</span>
                           <div class="col-lg-12 mt-2 mb-2">
                               <div class="timeline-wrapper">
                                   <ul class="StepProgress">
                                       <li class="StepProgress-item is-done">
                                           <div>
                                               <span class="copy_legs_date_depart" style="font-weight:600; font-size:16px;">`+group_booking_get_detail.result.response.ticket_list[i].segments[j].legs[k].departure_date.split('  ')[1]+`</span><br/>
                                               <span class="copy_legs_date_depart">`+group_booking_get_detail.result.response.ticket_list[i].segments[j].legs[k].departure_date.split('  ')[0]+`</span>
                                           </div>
                                           <div>
                                               <span style="font-weight:500;" class="legs_word_break copy_legs_depart">`+group_booking_get_detail.result.response.ticket_list[i].segments[j].legs[k].origin_city+` - `+group_booking_get_detail.result.response.ticket_list[i].segments[j].legs[k].origin_name+` (`+group_booking_get_detail.result.response.ticket_list[i].segments[j].legs[k].origin+`)</span>`;

                                            text+=`
                                          </div>
                                       </li>
                                       <li class="StepProgress-item is-end">
                                           <div>
                                               <span class="copy_legs_date_arr" style="font-weight:600; font-size:16px;">`+group_booking_get_detail.result.response.ticket_list[i].segments[j].legs[k].arrival_date.split('  ')[1]+`</span><br/>
                                               <span class="copy_legs_date_arr">`+group_booking_get_detail.result.response.ticket_list[i].segments[j].legs[k].arrival_date.split('  ')[0]+`</span>
                                           </div>
                                           <div style="width:84%;">
                                               <span style="font-weight:500;" class="copy_legs_arr">`+group_booking_get_detail.result.response.ticket_list[i].segments[j].legs[k].destination_city+` - `+group_booking_get_detail.result.response.ticket_list[i].segments[j].legs[k].destination_name+` (`+group_booking_get_detail.result.response.ticket_list[i].segments[j].legs[k].destination+`)</span><br/>`;

                                            text+=`
                                           </div>
                                      </li>
                                   </ul>
                               </div>
                           </div>
                        </div>`;
                    }
                    text += `</div>`;
                }
                text+=`<div class="col-lg-12">
                           <div class="row">
                               <div class="col-lg-12">
                                    <button style="text-align:left; width:unset; line-height:20px; font-size:13px; height:50px;" id="show_choose_seat`+i+`" type="button" class="form-control primary-btn-white dropdown-toggle" data-toggle="dropdown">`;
                                    price = 0;
                                    pax_count = 0;
                                    for(j in group_booking_get_detail.result.response.ticket_list[i].fare_list[0].price_list){
                                        if(group_booking_get_detail.result.response.ticket_list[i].fare_list[0].price_list[j].pax_type == 'ADT')
                                            pax_count = group_booking_get_detail.result.response.request.pax.ADT;
                                        else if(group_booking_get_detail.result.response.ticket_list[i].fare_list[0].price_list[j].pax_type == 'CHD')
                                            pax_count = group_booking_get_detail.result.response.request.pax.CHD;
                                        else if(group_booking_get_detail.result.response.ticket_list[i].fare_list[0].price_list[j].pax_type == 'INF')
                                            pax_count = group_booking_get_detail.result.response.request.pax.INF;
                                        for(k in group_booking_get_detail.result.response.ticket_list[i].fare_list[0].price_list[j].service_charges){
                                            if(k != 'RAC')
                                                price += pax_count * group_booking_get_detail.result.response.ticket_list[i].fare_list[0].price_list[j].service_charges[k].amount;
                                        }
                                    }
                                    text+=`
                                        <img src="/static/tt_website/images/icon/symbol/seat.png" style="height:16px; width:auto;"> <span id="choose_seat_span`+i+`">Choose Seat Class  - `+cabin_class_list[group_booking_get_detail.result.response.request.provider_type][group_booking_get_detail.result.response.request.cabin_class]+` - `+group_booking_get_detail.result.response.ticket_list[i].fare_list[0].price_list[0].currency+` `+getrupiah(price)+`</span>
                                    </button>
                                    <ul id="provider_seat_content`+i+`" class="dropdown-menu" style="background:unset; padding:0px 15px 15px 15px; z-index:5; border:unset;">
                                       <div style="background:white; padding:15px; border:1px solid #cdcdcd; overflow-y:auto; height:200px;">
                                       <div class="row">
                                           <div class="col-lg-12">
                                                <h6>(Class Of Service / Seat left)</h6>
                                                <hr>
                                           </div>`;
                                           for(j in group_booking_get_detail.result.response.ticket_list[i].fare_list){
                                               currency = '';
                                               price = 0;
                                               pax_count = 0;
                                               price_perpax = {};
                                               for(k in group_booking_get_detail.result.response.ticket_list[i].fare_list[j].price_list){
                                                    if(price_perpax.hasOwnProperty(group_booking_get_detail.result.response.ticket_list[i].fare_list[j].price_list[k].pax_type) == false)
                                                        price_perpax[group_booking_get_detail.result.response.ticket_list[i].fare_list[j].price_list[k].pax_type] = {
                                                            'pax_count': 0,
                                                            'price': 0,
                                                            'currency': 0,
                                                            'price_total': 0
                                                        }
                                                    if(group_booking_get_detail.result.response.ticket_list[i].fare_list[j].price_list[k].pax_type == 'ADT')
                                                        pax_count = group_booking_get_detail.result.response.request.pax.ADT;
                                                    else if(group_booking_get_detail.result.response.ticket_list[i].fare_list[j].price_list[k].pax_type == 'CHD')
                                                        pax_count = group_booking_get_detail.result.response.request.pax.CHD;
                                                    else if(group_booking_get_detail.result.response.ticket_list[i].fare_list[j].price_list[k].pax_type == 'INF')
                                                        pax_count = group_booking_get_detail.result.response.request.pax.INF;
                                                    for(l in group_booking_get_detail.result.response.ticket_list[i].fare_list[j].price_list[k].service_charges){
                                                        if(l != 'RAC'){
                                                            price += pax_count * group_booking_get_detail.result.response.ticket_list[i].fare_list[j].price_list[k].service_charges[l].amount;
                                                            price_perpax[group_booking_get_detail.result.response.ticket_list[i].fare_list[j].price_list[k].pax_type]['pax_count'] = pax_count;
                                                            price_perpax[group_booking_get_detail.result.response.ticket_list[i].fare_list[j].price_list[k].pax_type]['price'] += group_booking_get_detail.result.response.ticket_list[i].fare_list[j].price_list[k].service_charges[l].amount;
                                                            price_perpax[group_booking_get_detail.result.response.ticket_list[i].fare_list[j].price_list[k].pax_type]['currency'] = group_booking_get_detail.result.response.ticket_list[i].fare_list[j].price_list[k].service_charges[l].currency;
                                                            price_perpax[group_booking_get_detail.result.response.ticket_list[i].fare_list[j].price_list[k].pax_type]['price_total'] = price_perpax[group_booking_get_detail.result.response.ticket_list[i].fare_list[j].price_list[k].pax_type]['price'] * pax_count;
                                                        }
                                                    }
                                               }
                                               text+=`
                                               <div class="col-xs-12">
                                                   <label class="radio-button-custom" style="color:black !important; cursor:not-allowed;">
                                                        `+cabin_class_list[group_booking_get_detail.result.response.request.provider_type][group_booking_get_detail.result.response.request.cabin_class];
                                                       if(j == 0 && is_fare_pick == null)
                                                        text+=`
                                                       <input name="journey`+i+`fare" type="radio" value="`+j+`" onclick="choose_fare(`+i+`,`+j+`)" checked>`;
                                                       else if(is_fare_pick != null && is_fare_pick == j)
                                                        text+=`
                                                       <input name="journey`+i+`fare" type="radio" value="`+j+`" onclick="choose_fare(`+i+`,`+j+`)" checked>`;
                                                       else
                                                        text+=`
                                                       <input name="journey`+i+`fare" type="radio" value="`+j+`" onclick="choose_fare(`+i+`,`+j+`)">`;
                                                       for(k in price_perpax)
                                                        text+=`<span></span><br><span>`+k+` Price:</span><span class="price_template" style="color:`+color+`;">`+price_perpax[k].currency+` `+getrupiah(price_perpax[k].price_total)+`</span><br></span>`;
                                                       text+=`
                                                       <span class="checkmark-radio"></span><br><span>Total Price:</span><span id="journey`+i+`fare`+j+`" class="price_template" style="color:`+color+`;">`+group_booking_get_detail.result.response.ticket_list[i].fare_list[j].price_list[0].currency+` `+getrupiah(price)+`</span><br></span>
                                                   </label>
                                               </div>`;
                                           }
                                       text+=`

                                       </div>
                                   </div></ul>
                               </div>
                           </div><br></div>
                       </div>
                   </div>
                </div>`;
                text += `</div>
                    </div>
                </div>`;
            }

            text += `
               </div>
            </div>
        </div>`;
    }
    document.getElementById('ticket_list').innerHTML = text;
}

function modal(type,show){
    if(type == 'booker'){
        if(show){
            $("#myModal_booker").modal('show');
        }else{
            $("#myModal_booker").modal('hide');
        }
    }else if(type == 'contact'){
        if(show){
            $("#myModal_contact").modal('show');
        }else{
            $("#myModal_contact").modal('hide');
        }
    }else if(type == 'ticket'){
        if(show){
            $("#myModalTicket").modal('show');
        }else{
            $("#myModalTicket").modal('hide');
        }
    }
}

function share_data(){
//    const el = document.createElement('textarea');
//    el.value = $test;
//    document.body.appendChild(el);
//    el.select();
//    document.execCommand('copy');
//    document.body.removeChild(el);
    $text_share = window.encodeURIComponent($text);
}

function get_all_booking_state_booked(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/group_booking",
       headers:{
            'action': 'get_all_booking_state_booked',
       },
       data: {
            'signature': signature,
       },
       success: function(msg) {
       try{
           if(msg.result.error_code == 0){

           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
           }else{
               Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: msg.result.error_msg,
               });
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
          error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error medical signin');
          $("#barFlightSearch").hide();
          $("#waitFlightSearch").hide();
          $('.loader-rodextrip').fadeOut();
          try{
            $("#show_loading_booking_group_booking").hide();
          }catch(err){
            console.log(err); // error kalau ada element yg tidak ada
          }
       },timeout: 60000
    });
}

function group_booking_update_passenger(){
    error_log = '';
    length_name = 100;
    pax = [];
    pax_counter = 1
    last_departure_date = group_booking_get_detail.result.response.request.return_date ? group_booking_get_detail.result.response.request.return_date : group_booking_get_detail.result.response.request.departure_date
    for(i=1;i<=counter_passenger;i++){
       try{
           if(check_name(document.getElementById('adult_title'+i).value,
                document.getElementById('adult_first_name'+i).value,
                document.getElementById('adult_last_name'+i).value,
                length_name) == false){
               error_log+= 'Total of passenger '+pax_counter+' name maximum '+length_name+' characters!</br>\n';
               document.getElementById('adult_first_name'+i).style['border-color'] = 'red';
               document.getElementById('adult_last_name'+i).style['border-color'] = 'red';
           }else{
               document.getElementById('adult_first_name'+i).style['border-color'] = '#EFEFEF';
               document.getElementById('adult_last_name'+i).style['border-color'] = '#EFEFEF';
           }if(document.getElementById('adult_first_name'+i).value == '' || check_word(document.getElementById('adult_first_name'+i).value) == false){
               if(document.getElementById('adult_first_name'+i).value == '')
                   error_log+= 'Please input first name of passenger '+pax_counter+'!</br>\n';
               else if(check_word(document.getElementById('adult_first_name'+i).value) == false)
                   error_log+= 'Please use alpha characters first name of passenger '+pax_counter+'!</br>\n';
               document.getElementById('adult_first_name'+i).style['border-color'] = 'red';
           }else{
               document.getElementById('adult_first_name'+i).style['border-color'] = '#EFEFEF';
           }
           //check lastname
           if(check_name_airline(document.getElementById('adult_first_name'+i).value, document.getElementById('adult_last_name'+i).value) != ''){
               error_log += 'Please '+check_name_airline(document.getElementById('adult_first_name'+i).value, document.getElementById('adult_last_name'+i).value)+' passenger '+i+'!</br>\n';
               document.getElementById('adult_last_name'+i).style['border-color'] = 'red';
           }else{
               document.getElementById('adult_last_name'+i).style['border-color'] = '#EFEFEF';
           }
           if(check_date(document.getElementById('adult_birth_date'+i).value)==false){
               error_log+= 'Birth date wrong for passenger '+pax_counter+'!</br>\n';
               document.getElementById('adult_birth_date'+i).style['border-color'] = 'red';
           }else{
               document.getElementById('adult_birth_date'+i).style['border-color'] = '#EFEFEF';
           }if(document.getElementById('adult_nationality'+i+'_id').value == ''){
               error_log+= 'Please fill nationality for passenger '+pax_counter+'!</br>\n';
               document.getElementById('adult_nationality'+i+'_id').style['border-color'] = 'red';
           }else{
               document.getElementById('adult_nationality'+i+'_id').style['border-color'] = '#EFEFEF';
           }
           if(document.getElementById('adult_identity_type'+i).value != ''){
                $("#adult_identity_type"+i).each(function() {
                    $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                });
               if(document.getElementById('adult_nationality'+i+'_id').value == 'Indonesia'){
                   //indonesia
                   if(document.getElementById('adult_identity_type'+i).value == 'ktp'){
                        document.getElementById('adult_identity_expired_date'+i).style['border-color'] = '#cdcdcd';
                        if(check_ktp(document.getElementById('adult_identity_number'+i).value) == false){
                           error_log+= 'Please fill id number, nik only contain 16 digits for passenger '+pax_counter+'!</br>\n';
                           document.getElementById('adult_identity_number'+i).style['border-color'] = 'red';
                        }else{
                           document.getElementById('adult_identity_number'+i).style['border-color'] = '#EFEFEF';
                        }if(document.getElementById('select2-adult_country_of_issued'+i+'_id-container').innerHTML == '' || document.getElementById('select2-adult_country_of_issued'+i+'_id-container').innerHTML == 'Country of Issued'){
                           error_log+= 'Please fill country of issued for passenger '+pax_counter+'!</br>\n';
                           $("#adult_country_of_issued"+i+"_id").each(function() {
                             $(this).siblings(".select2-container").css('border', '1px solid red');
                           });
                        }else{
                           $("#adult_country_of_issued"+i+"_id").each(function() {
                             $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                           });
                        }
                   }else if(document.getElementById('adult_identity_type'+i).value == 'passport'){
                       if(document.getElementById('adult_identity_type'+i).value == 'passport' && check_passport(document.getElementById('adult_identity_number'+i).value) == false){
                           error_log+= 'Please fill id number, passport only contain more than 6 digits  for passenger '+pax_counter+'!</br>\n';
                           document.getElementById('adult_identity_number'+i).style['border-color'] = 'red';
                       }else{
                           document.getElementById('adult_identity_number'+i).style['border-color'] = '#EFEFEF';
                       }
                       if(document.getElementById('adult_identity_expired_date'+i).value == ''){
                           error_log+= 'Please fill passport expired date for passenger '+pax_counter+'!</br>\n';
                           document.getElementById('adult_identity_expired_date'+i).style['border-color'] = 'red';
                       }else{
                           duration = moment.duration(moment(document.getElementById('adult_identity_expired_date'+i).value).diff(last_departure_date));
                           //CHECK EXPIRED
                           if(duration._milliseconds < 0 ){
                                error_log+= 'Please update passport expired date for passenger '+pax_counter+'!</br>\n';
                                document.getElementById('adult_identity_expired_date'+i).style['border-color'] = 'red';
                           }else
                                document.getElementById('adult_identity_expired_date'+i).style['border-color'] = '#EFEFEF';
                       }if(document.getElementById('select2-adult_country_of_issued'+i+'_id-container').innerHTML == '' || document.getElementById('select2-adult_country_of_issued'+i+'_id-container').innerHTML == 'Country of Issued'){
                           error_log+= 'Please fill country of issued for passenger '+pax_counter+'!</br>\n';
                            $("#adult_country_of_issued"+i+"_id").each(function() {
                              $(this).siblings(".select2-container").css('border', '1px solid red');
                            });
                       }else{
                            $("#adult_country_of_issued"+i+"_id").each(function() {
                              $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                            });
                       }

                   }else{
                        error_log += 'Please fill identity for passenger '+i+'!</br>\n';
                   }
               }else{
                   //foreign
                   if(document.getElementById('adult_identity_type'+i).value == 'passport'){
                       if(document.getElementById('adult_identity_type'+i).value == 'passport' && check_passport(document.getElementById('adult_identity_number'+i).value) == false){
                           error_log+= 'Please fill id number, passport only contain more than 6 digits  for passenger '+pax_counter+'!</br>\n';
                           document.getElementById('adult_identity_number'+i).style['border-color'] = 'red';
                       }else{
                           document.getElementById('adult_identity_number'+i).style['border-color'] = '#EFEFEF';
                       }
                       if(document.getElementById('adult_identity_expired_date'+i).value == ''){
                           error_log+= 'Please fill passport expired date for passenger '+pax_counter+'!</br>\n';
                           document.getElementById('adult_identity_expired_date'+i).style['border-color'] = 'red';
                       }else{
                           duration = moment.duration(moment(document.getElementById('adult_identity_expired_date'+i).value).diff(last_departure_date));
                           //CHECK EXPIRED
                           if(duration._milliseconds < 0 ){
                                error_log+= 'Please update passport expired date for passenger '+pax_counter+'!</br>\n';
                                document.getElementById('adult_identity_expired_date'+i).style['border-color'] = 'red';
                           }else
                                document.getElementById('adult_identity_expired_date'+i).style['border-color'] = '#EFEFEF';
                       }if(document.getElementById('adult_country_of_issued'+i+'_id').value == ''){
                           error_log+= 'Please fill country of issued for passenger '+pax_counter+'!</br>\n';
                            $("#adult_country_of_issued"+i+"_id").each(function() {
                              $(this).siblings(".select2-container").css('border', '1px solid red');
                            });
                       }else{
                            $("#adult_country_of_issued"+i+"_id").each(function() {
                              $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                            });
                       }
                   }else{
                       error_log+= 'Please fill identity type to Passport for passenger '+pax_counter+'!</br>\n';
                   }
               }
           }else{
                if(document.getElementById('adult_identity_number'+i).value != ''){
                   error_log+= 'Please choose identity type for passenger '+pax_counter+'!</br>\n';
                }
                document.getElementById('adult_identity_number'+i).style['border-color'] = 'red';
                document.getElementById('adult_identity_expired_date'+i).style['border-color'] = 'red';
                $("#adult_identity_type"+i).each(function() {
                    $(this).parent().find('.nice-select').css('border', '1px solid red');
                });

                $("#adult_country_of_issued"+i+"_id").each(function() {
                  $(this).siblings(".select2-container").css('border', '1px solid red');
                });
           }
           behaviors = {}
           try{
                if(document.getElementById('adult_behaviors_'+ (i)).value){
                    behaviors['groupbooking'] = document.getElementById('adult_behaviors_'+ (i)).value;
                }
            }catch(err){console.log(err);}
           pax.push({
                "pax_type": "ADT", //hardcode dulu sementara
                "first_name": document.getElementById('adult_first_name'+i).value,
                "last_name": document.getElementById('adult_last_name'+i).value,
                "title": document.getElementById('adult_title'+i).value,
                "birth_date": moment(document.getElementById('adult_birth_date'+i).value,'DD MMM YYYY').format('YYYY-MM-DD'),
                "passenger_seq_id": document.getElementById('adult_id'+i).value,
                "is_also_booker": false,
                "is_also_contact": false,
                "nationality_code": document.getElementById('adult_nationality'+i+'_id').value,
                "identity": {
                    "identity_country_of_issued_code": document.getElementById('adult_country_of_issued'+i+'_id').value,
                    "identity_expdate": document.getElementById('adult_identity_expired_date'+i).value != '' && document.getElementById('adult_identity_expired_date'+i).value != 'Invalid Date' ? moment(document.getElementById('adult_identity_expired_date'+i).value,'DD MMM YYYY').format('YYYY-MM-DD') : '',
                    "identity_number": document.getElementById('adult_identity_number'+i).value,
                    "identity_type": document.getElementById('adult_identity_type'+i).value
                },
                "behaviors": behaviors
           })
           pax_counter++;
       }catch(err){console.log(err);}
    }
    if(error_log == '' && pax.length != 0){
        data = {
            'signature': signature,
            'order_number': order_number,
            'passengers': JSON.stringify(pax)
        }
        getToken();
        $.ajax({
           type: "POST",
           url: "/webservice/group_booking",
           headers:{
                'action': 'update_passenger',
           },
           data: data,
           success: function(msg) {
           try{
               if(msg.result.error_code == 0){
                    Swal.fire({
                      type: 'success',
                      title: 'Update!',
                      html: msg.result.error_msg,
                    })
                    group_booking_get_booking(order_number);
               }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                    auto_logout();
               }else{
                   Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: msg.result.error_msg,
                   });
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
              error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error medical signin');
              $("#barFlightSearch").hide();
              $("#waitFlightSearch").hide();
              $('.loader-rodextrip').fadeOut();
              try{
                $("#show_loading_booking_group_booking").hide();
              }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
              }
           },timeout: 60000
        });
    }else if(pax.length == 0){
        Swal.fire({
           type: 'error',
           title: 'Oops...',
           text: 'Please fill passenger first!',
        })
    }else{
        Swal.fire({
           type: 'error',
           title: 'Oops...',
           text: error_log,
        })
    }
}

function group_booking_update_booker(){
    error_log = '';
    length_name = 100;
    if(check_name(document.getElementById('booker_title').value,
                    document.getElementById('booker_first_name').value,
                    document.getElementById('booker_last_name').value,
                    length_name) == false){
        error_log+= 'Total of Booker name maximum '+length_name+' characters!</br>\n';
        document.getElementById('booker_first_name').style['border-color'] = 'red';
        document.getElementById('booker_last_name').style['border-color'] = 'red';
    }else{
        document.getElementById('booker_first_name').style['border-color'] = '#EFEFEF';
        document.getElementById('booker_last_name').style['border-color'] = '#EFEFEF';
    }if(document.getElementById('booker_first_name').value == '' || check_word(document.getElementById('booker_first_name').value) == false){
        if(document.getElementById('booker_first_name').value == '')
            error_log+= 'Please fill booker first name!</br>\n';
        else if(check_word(document.getElementById('booker_first_name').value) == false)
            error_log+= 'Please use alpha characters for booker first name!</br>\n';
        document.getElementById('booker_first_name').style['border-color'] = 'red';
    }else{
        document.getElementById('booker_first_name').style['border-color'] = '#EFEFEF';
    }if(check_phone_number(document.getElementById('booker_phone').value)==false){
        if(check_phone_number(document.getElementById('booker_phone').value) == false)
            error_log+= 'Phone number Booker only contain number 8 - 12 digits!</br>\n';
        document.getElementById('booker_phone').style['border-color'] = 'red';
    }else{
        document.getElementById('booker_phone').style['border-color'] = '#EFEFEF';
    }if(check_email(document.getElementById('booker_email').value)==false){
        error_log+= 'Invalid Booker email!</br>\n';
        document.getElementById('booker_email').style['border-color'] = 'red';
    }else{
        document.getElementById('booker_email').style['border-color'] = '#EFEFEF';
    }
    if(error_log == ''){
        data = {
            'title': document.getElementById('booker_title').value,
            'first_name': document.getElementById('booker_first_name').value,
            'last_name': document.getElementById('booker_last_name').value,
            'nationality_code': document.getElementById('booker_nationality_id').value,
            'email': document.getElementById('booker_email').value,
            'calling_code': document.getElementById('booker_phone_code_id').value,
            'mobile': document.getElementById('booker_phone').value,
            'booker_seq_id': document.getElementById('booker_id').value,
            'order_number': order_number,
            'signature': signature
        }
        getToken();
        $.ajax({
           type: "POST",
           url: "/webservice/group_booking",
           headers:{
                'action': 'update_booker',
           },
           data: data,
           success: function(msg) {
           try{
               if(msg.result.error_code == 0){
                    if(document.getElementById('booker_cp').checked){
                        group_booking_update_contact(data);
                    }else{
                        Swal.fire({
                          type: 'success',
                          title: 'Update!',
                          html: msg.result.error_msg,
                        })
                        group_booking_get_booking(order_number);
                    }
               }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                    auto_logout();
               }else{
                   Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: msg.result.error_msg,
                   });
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
              error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error medical signin');
              $("#barFlightSearch").hide();
              $("#waitFlightSearch").hide();
              $('.loader-rodextrip').fadeOut();
              try{
                $("#show_loading_booking_group_booking").hide();
              }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
              }
           },timeout: 60000
        });
    }else{
        Swal.fire({
           type: 'error',
           title: 'Oops...',
           text: error_log,
        })
    }
}

function group_booking_update_contact(req=false){
    error_log = '';
    if(req){
        data = {
            'title': document.getElementById('booker_title').value,
            'first_name': document.getElementById('booker_first_name').value,
            'last_name': document.getElementById('booker_last_name').value,
            'nationality': document.getElementById('booker_nationality_id').value,
            'email': document.getElementById('booker_email').value,
            'calling_code': document.getElementById('booker_phone_code_id').value,
            'mobile': document.getElementById('booker_phone').value,
            'contact_seq_id': document.getElementById('booker_id').value,
            'is_also_booker': true,
            'order_number': order_number,
            'signature': signature
        }
    }else{
        length_name = 100;
        if(check_name(document.getElementById('contact_title').value,
                        document.getElementById('contact_first_name').value,
                        document.getElementById('contact_last_name').value,
                        length_name) == false){
            error_log+= 'Total of Contact name maximum '+length_name+' characters!</br>\n';
            document.getElementById('contact_first_name').style['border-color'] = 'red';
            document.getElementById('contact_last_name').style['border-color'] = 'red';
        }else{
            document.getElementById('contact_first_name').style['border-color'] = '#EFEFEF';
            document.getElementById('contact_last_name').style['border-color'] = '#EFEFEF';
        }if(document.getElementById('contact_first_name').value == '' || check_word(document.getElementById('contact_first_name').value) == false){
            if(document.getElementById('contact_first_name').value == '')
                error_log+= 'Please fill contact first name!</br>\n';
            else if(check_word(document.getElementById('contact_first_name').value) == false)
                error_log+= 'Please use alpha characters for contact first name!</br>\n';
            document.getElementById('contact_first_name').style['border-color'] = 'red';
        }else{
            document.getElementById('contact_first_name').style['border-color'] = '#EFEFEF';
        }if(check_phone_number(document.getElementById('contact_phone').value)==false){
            if(check_phone_number(document.getElementById('contact_phone').value) == false)
                error_log+= 'Phone number contact only contain number 8 - 12 digits!</br>\n';
            document.getElementById('contact_phone').style['border-color'] = 'red';
        }else{
            document.getElementById('contact_phone').style['border-color'] = '#EFEFEF';
        }if(check_email(document.getElementById('contact_email').value)==false){
            error_log+= 'Invalid contact email!</br>\n';
            document.getElementById('contact_email').style['border-color'] = 'red';
        }else{
            document.getElementById('contact_email').style['border-color'] = '#EFEFEF';
        }

        data = {
            'title': document.getElementById('contact_title').value,
            'first_name': document.getElementById('contact_first_name').value,
            'last_name': document.getElementById('contact_last_name').value,
            'nationality_code': document.getElementById('contact_nationality_id').value,
            'email': document.getElementById('contact_email').value,
            'calling_code': document.getElementById('contact_phone_code_id').value,
            'mobile': document.getElementById('contact_phone').value,
            'contact_seq_id': document.getElementById('contact_id').value,
            'is_also_booker': true,
            'order_number': order_number,
            'signature': signature
        }
    }

    if(error_log == ''){
        getToken();
        $.ajax({
           type: "POST",
           url: "/webservice/group_booking",
           headers:{
                'action': 'update_contact',
           },
           data: data,
           success: function(msg) {
           try{
               if(msg.result.error_code == 0){
                    Swal.fire({
                      type: 'success',
                      title: 'Update!',
                      html: msg.result.error_msg,
                    })
                    group_booking_get_booking(order_number);
               }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                    auto_logout();
               }else{
                   Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: msg.result.error_msg,
                   });
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
              error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error medical signin');
              $("#barFlightSearch").hide();
              $("#waitFlightSearch").hide();
              $('.loader-rodextrip').fadeOut();
              try{
                $("#show_loading_booking_group_booking").hide();
              }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
              }
           },timeout: 60000
        });
    }else{
        Swal.fire({
           type: 'error',
           title: 'Oops...',
           text: error_log,
        })
    }
}

function group_booking_issued_booking(){
    var temp_data = {}
    payment_method_choice = '';
    var radios = document.getElementsByName('payment_opt');
    for (var j = 0, length = radios.length; j < length; j++) {
        if (radios[j].checked) {
            // do whatever you want with the checked radio
            issued_pick = radios[j].value;
            // only one radio can be logically checked, don't check the rest
            break;
        }
    }
    payment_method_choice = group_booking_get_detail.result.response.payment_rules_available[issued_pick].payment_rules_seq_id;
    default_payment_to_ho = ''
    if(total_price_payment_acq == 0)
        default_payment_to_ho = 'balance'
    getToken();
    data = {
        'order_number': order_number,
        'payment_method': payment_method_choice,
        'acquirer_seq_id': payment_acq2[payment_method][selected].acquirer_seq_id,
        'member': payment_acq2[payment_method][selected].method,
        'agent_payment': document.getElementById('payment_ho_id') ? document.getElementById('payment_ho_id').value : default_payment_to_ho,
        'signature': signature,
        'voucher_code': voucher_code,
    }
    var error_log = '';
    if(document.getElementById('pin')){
        if(document.getElementById('pin').value)
            data['pin'] =  document.getElementById('pin').value;
        else
            error_log = 'Please input PIN!';
    }
    if(error_log){
        Swal.fire({
            type: 'error',
            title: 'Oops!',
            html: error_log,
        })
        $('.hold-seat-booking-train').prop('disabled', false);
        $('.hold-seat-booking-train').removeClass("running");
        setTimeout(function(){
            hide_modal_waiting_transaction();
        }, 500);
    }else{
        $.ajax({
            type: "POST",
            url: "/webservice/group_booking",
            headers:{
                'action': 'issued_booking',
            },
            data: data,
            success: function(msg) {
                if(google_analytics != '')
                    gtag('event', 'groupbooking_issued', {});
                if(msg.result.error_code == 0){
                    $("#issuedModal").modal('hide');
                    try{
                        if(msg.result.response.state == 'issued')
                            print_success_issued();
                        else
                            print_fail_issued();
                    }catch(err){
                        console.log(err); // error kalau ada element yg tidak ada
                    }
                    if(document.URL.split('/')[document.URL.split('/').length-1] == 'payment'){
                        window.location.href = '/tour/booking/' + btoa(order_number);
                    }else{
                        price_arr_repricing = {};
                        pax_type_repricing = [];
                        group_booking_get_booking(order_number);
                        document.getElementById('payment_acq').innerHTML = '';
                        document.getElementById('payment_acq').hidden = true;
                        $("#issuedModal").modal('hide');
                        hide_modal_waiting_transaction();
                        document.getElementById("overlay-div-box").style.display = "none";
                    }
                }else if(msg.result.error_code == 1009){
                    price_arr_repricing = {};
                    pax_type_repricing = [];
                    document.getElementById('payment_acq').innerHTML = '';
                    document.getElementById('payment_acq').hidden = true;
                    $("#issuedModal").modal('hide');
                    hide_modal_waiting_transaction();
                    document.getElementById("overlay-div-box").style.display = "none";
                    document.getElementById('tour_final_info').innerHTML = text;
                    document.getElementById('product_title').innerHTML = '';
                    document.getElementById('product_type_title').innerHTML = '';
                    document.getElementById('tour_detail_table').innerHTML = '';
                    group_booking_get_booking(order_number);
                }else{
                    if(msg.result.error_code != 1007){
                        Swal.fire({
                            type: 'error',
                            title: 'Oops!',
                            html: '<span style="color: #ff9900;">Error group booking issued </span>' + msg.result.error_msg,
                        })
                    }else{
                        Swal.fire({
                            type: 'error',
                            title: 'Error group booking issued '+ msg.result.error_msg,
                            showCancelButton: true,
                            cancelButtonText: 'Ok',
                            confirmButtonColor: color,
                            cancelButtonColor: '#3085d6',
                            confirmButtonText: 'Top Up'
                        }).then((result) => {
                            if (result.value) {
                                window.location.href = '/top_up';
                            }else{
                                if(window.location.href.includes('payment')){
                                    window.location.href = '/group_booking/booking/'+order_number;
                                }
                            }
                        })
                    }
                    price_arr_repricing = {};
                    pax_type_repricing = [];
                    document.getElementById('payment_acq').innerHTML = '';
                    document.getElementById('payment_acq').hidden = true;
                    $("#issuedModal").modal('hide');
                    hide_modal_waiting_transaction();
                    document.getElementById("overlay-div-box").style.display = "none";
                    document.getElementById('tour_final_info').innerHTML = text;
                    document.getElementById('product_title').innerHTML = '';
                    document.getElementById('product_type_title').innerHTML = '';
                    document.getElementById('tour_detail_table').innerHTML = '';
                    group_booking_get_booking(order_number);
                    $("#issuedModal").modal('hide');
                    $('.hold-seat-booking-train').prop('disabled', false);
                    $('.hold-seat-booking-train').removeClass("running");
                    hide_modal_waiting_transaction();
               }
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error group booking issued booking');
           },timeout: 60000
        });
    }
}

function choose_fare(val, fare_val){
    group_booking_get_detail.result.response.ticket_list[val].fare_pick = fare_val;
    temp = document.getElementById('choose_seat_span'+val).innerHTML.split(' - ');
    temp.pop();
    temp.push(document.getElementById('journey'+val+'fare'+fare_val).innerHTML);

    document.getElementById('choose_seat_span'+val).innerHTML = temp.join(' - ');
    document.getElementById('fare'+val).innerHTML = document.getElementById('journey'+val+'fare'+fare_val).innerHTML;
}

function choose_ticket(val){
    group_booking_pick_ticket();
}

function group_booking_pick_ticket(){
    fare_seq_id_list = [];
    var radios = document.getElementsByName('departure');
    for (var j = 0, length = radios.length; j < length; j++) {
        if (radios[j].checked) {
            // do whatever you want with the checked radio
            fare_seq_id_list.push(group_booking_get_detail.result.response.ticket_list[radios[j].value].fare_list[group_booking_get_detail.result.response.ticket_list[radios[j].value].fare_pick].fare_seq_id);
            // only one radio can be logically checked, don't check the rest
            break;
        }
    }
    var radios = document.getElementsByName('return');
    for (var j = 0, length = radios.length; j < length; j++) {
        if (radios[j].checked) {
            // do whatever you want with the checked radio
            fare_seq_id_list.push(group_booking_get_detail.result.response.ticket_list[radios[j].value].fare_list[group_booking_get_detail.result.response.ticket_list[radios[j].value].fare_pick].fare_seq_id);
            // only one radio can be logically checked, don't check the rest
            break;
        }
    }
    //group_booking_get_detail.result.response.ticket_list
    getToken();
    if(fare_seq_id_list.length > 0){
        $.ajax({
           type: "POST",
           url: "/webservice/group_booking",
           headers:{
                'action': 'pick_ticket',
           },
           data: {
                'signature': signature,
                'order_number': order_number,
                'fare_seq_id_list': JSON.stringify(fare_seq_id_list)
           },
           success: function(msg) {
           try{
               if(msg.result.error_code == 0){
                    Swal.fire({
                      type: 'success',
                      title: 'Update!',
                      html: msg.result.error_msg,
                    })
                    modal('ticket',false);
                    group_booking_get_booking(order_number);
               }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                    auto_logout();
               }else{
                   Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: msg.result.error_msg,
                   });
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
              error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error medical signin');
              $("#barFlightSearch").hide();
              $("#waitFlightSearch").hide();
              $('.loader-rodextrip').fadeOut();
              try{
                $("#show_loading_booking_group_booking").hide();
              }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
              }
           },timeout: 60000
        });
    }else{
        modal('ticket',false);
    }
}

function change_state_back_to_confirm(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/group_booking",
       headers:{
            'action': 'change_state_back_to_confirm',
       },
       data: {
            'signature': signature,
            'order_number': order_number
       },
       success: function(msg) {
       try{
           if(msg.result.error_code == 0){
                Swal.fire({
                  type: 'success',
                  title: 'Update!',
                  html: msg.result.error_msg,
                })
                group_booking_get_booking(order_number);
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
          error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error medical signin');
          $("#barFlightSearch").hide();
          $("#waitFlightSearch").hide();
          $('.loader-rodextrip').fadeOut();
          try{
            $("#show_loading_booking_group_booking").hide();
          }catch(err){
            console.log(err); // error kalau ada element yg tidak ada
          }
       },timeout: 60000
    });
}

function change_state_to_booked(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/group_booking",
       headers:{
            'action': 'change_state_to_booked',
       },
       data: {
            'signature': signature,
            'order_number': order_number
       },
       success: function(msg) {
       try{
           if(msg.result.error_code == 0){
                Swal.fire({
                  type: 'success',
                  title: 'Update!',
                  html: msg.result.error_msg,
                })
                group_booking_get_booking(order_number);
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
          error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error medical signin');
          $("#barFlightSearch").hide();
          $("#waitFlightSearch").hide();
          $('.loader-rodextrip').fadeOut();
          try{
            $("#show_loading_booking_group_booking").hide();
          }catch(err){
            console.log(err); // error kalau ada element yg tidak ada
          }
       },timeout: 60000
    });
}

function group_booking_can_sent(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/group_booking",
       headers:{
            'action': 'check_data_can_sent',
       },
       data: {
            'signature': signature,
            'order_number': order_number
       },
       success: function(msg) {
       try{
           if(msg.result.error_code == 0){
                //button book now
                document.getElementById('book_btn_group_booking').style.display = 'block';
                //get_payment_acq('Issued', group_booking_get_detail.result.response.booker.seq_id, group_booking_get_detail.result.response.order_number, 'billing', signature, 'groupbooking');
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
          error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error medical signin');
          $("#barFlightSearch").hide();
          $("#waitFlightSearch").hide();
          $('.loader-rodextrip').fadeOut();
          try{
            $("#show_loading_booking_group_booking").hide();
          }catch(err){
            console.log(err); // error kalau ada element yg tidak ada
          }
       },timeout: 60000
    });
}

function onchange_title(val){
    if(document.getElementById('adult_pax_type'+val).value == 'ADT' && document.getElementById('adult_title'+val).value != 'MR' ||
       document.getElementById('adult_pax_type'+val).value == 'ADT' && document.getElementById('adult_title'+val).value != 'MRS' ||
       document.getElementById('adult_pax_type'+val).value == 'ADT' && document.getElementById('adult_title'+val).value != 'MS' ||
       document.getElementById('adult_pax_type'+val).value == 'ADT' && document.getElementById('adult_title'+val).value != ''){
        text = '';
        text += '<option value="">Select Title</option><option value="MR">MR</option><option value="MRS">MRS</option><option value="MS">MS</option>';
        document.getElementById('adult_title'+val).innerHTML = text;
        $('#adult_title'+val).niceSelect('update');
    }else if(document.getElementById('adult_pax_type'+val).value != 'ADT' && document.getElementById('adult_title'+val).value == 'MR' ||
       document.getElementById('adult_pax_type'+val).value != 'ADT' && document.getElementById('adult_title'+val).value == 'MRS' ||
       document.getElementById('adult_pax_type'+val).value != 'ADT' && document.getElementById('adult_title'+val).value == 'MS' ||
       document.getElementById('adult_pax_type'+val).value != 'ADT' && document.getElementById('adult_title'+val).value == ''){
        text = '';
        text += '<option value="">Select Title</option><option value="MSTR">MSTR</option><option value="MISS">MISS</option>';
        document.getElementById('adult_title'+val).innerHTML = text;
        $('#adult_title'+val).niceSelect('update');
    }

}

function add_table_of_passenger(type, data){
    text= '';
    set_passenger_number(counter_passenger);
    var node = document.createElement("div");
    count_pax = 0;
    for(i=0;i<counter_passenger;i++){
        if(document.getElementById('passenger_number'+i) != null)
            count_pax++;
    }
    if(count_pax == 0){
        document.getElementById('table_of_passenger').innerHTML = '';
    }

    if(count_pax < group_booking_get_detail.result.response.request.pax.ADT + group_booking_get_detail.result.response.request.pax.CHD + group_booking_get_detail.result.response.request.pax.INF){
        if(data){
            pax_type = data[0]
            title = data[1];
            first_name = data[2];
            last_name = data[3];
            nationality = data[4];
            birth_date = moment(data[5]+'-'+data[6]+'-'+data[7],'DD-MM-YYYY').format('DD MMM YYYY');
            identity_type = data[8];
            identity_number = data[9];
            if(data[10] != '' && data[11] != '' && data[12] != '')
                identity_exp_date = moment(data[10]+'-'+data[11]+'-'+data[12],'DD-MM-YYYY').format('DD MMM YYYY');
            else
                identity_exp_date = '';
            country_of_issued = data[13];
            name = title + ' ' + first_name + ' ' + last_name;

        }else{
            pax_type = '';
            title = '';
            first_name = '';
            last_name = '';
            nationality = '';
            birth_date = '';
            identity_type = '';
            identity_number = '';
            identity_exp_date = '';
            country_of_issued = '';
            name = '';
        }

        text += `<div class="col-lg-12">`;
        if(count_pax == 0){
            text += `<div class="row">`;
        }else{
            text += `<div class="row" style="padding-top:15px; border-top:1px solid #cdcdcd;">`;
        }
        text+=`
            <div class="col-lg-2">
                <h4 id="passenger_number`+counter_passenger+`" class="single_border_custom_bottom" style="margin-bottom:5px; width:50px; word-break:break-word;">#`+(count_pax+1)+`</h4>
            </div>
            <div class="col-lg-7">
                <h4 id='name_pax`+counter_passenger+`' name='name_pax`+counter_passenger+`'>NO PASSENGER SELECTED</h4>
                <input id="id_passenger`+counter_passenger+`" name="id_passenger`+counter_passenger+`" type="hidden"/>
                <span id='birth_date`+counter_passenger+`' name='birth_date`+counter_passenger+`'>`+birth_date+`</span>
            </div>

            <div class="col-lg-3 mb-1" style="text-align:right;">`;
            if(group_booking_get_detail.result.response.state_groupbooking == 'confirm'){
                text+=`
                <button type="button" class="primary-btn-custom" style="margin-bottom:5px; height:43px; line-height:35px;" data-toggle="modal" data-target="#myModal_adult`+parseInt(counter_passenger+1)+`" data-backdrop="static" onclick="set_passenger_number(`+parseInt(parseInt(counter_passenger)+1)+`);"><i class="fas fa-search"></i></button>
                <button type="button" class="primary-btn-cancel" style="margin-bottom:5px; height:43px; line-height:31px;" onclick="delete_table_of_passenger(`+parseInt(counter_passenger)+`);"><i class="fas fa-times"></i></button>`;
            }
            text+=`
            </div>
        </div>`;
        text +=`
        <div class="modal fade" id="myModal_adult`+parseInt(counter_passenger+1)+`" role="dialog" data-keyboard="false">
            <div class="overlay_modal_custom" onclick="close_modal_check('adult', '`+parseInt(counter_passenger+1)+`');"></div>
            <div class="modal-dialog modal_custom_fixed">
                <div class="modal-content">
                    <div class="modal-header">
                        <div class="row">
                            <div class="col-xs-6 pb-3">
                                <h4 class="modal-title" id="passenger_number_modal_header`+counter_passenger+`">Passenger `+(count_pax+1)+`</h4>
                            </div>
                            <div class="col-xs-6">
                                <button type="button" class="close modal_custom_close" data-dismiss="modal" onclick="close_modal_check('adult', '`+parseInt(counter_passenger+1)+`');">&times;</button>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-lg-12" id="radio_airline_search" style="text-align:left;margin-bottom:20px;">
                                <label class="radio-button-custom">
                                    <span style="font-size:14px;">Search</span>
                                    <input type="radio" checked="checked" id="radio_passenger_search`+parseInt(counter_passenger+1)+`" name="radio_passenger`+parseInt(counter_passenger+1)+`" value="search" onclick="radio_button('passenger_gb',`+(counter_passenger+1)+`);">
                                    <span class="checkmark-radio"></span>
                                </label>
                                <label class="radio-button-custom">
                                    <span style="font-size:14px;">Input/Edit Passenger</span>
                                    <input type="radio" id="radio_passenger_input`+parseInt(counter_passenger+1)+`" name="radio_passenger`+parseInt(counter_passenger+1)+`" value="create" onclick="radio_button('passenger_gb',`+(counter_passenger+1)+`); clear_btn_top('adult', '`+parseInt(counter_passenger+1)+`'); clear_search_pax('adult','`+parseInt(counter_passenger+1)+`');">
                                    <span class="checkmark-radio"></span>
                                </label>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-xs-6" id="button_tl_adult`+parseInt(counter_passenger+1)+`">

                            </div>
                            <div class="col-xs-6" id="button_tr_adult`+parseInt(counter_passenger+1)+`">

                            </div>
                        </div>
                    </div>
                    <div class="modal-body">
                        <div id="passenger_content">
                            <div id="passenger_search`+parseInt(counter_passenger+1)+`">
                                <div class="row">
                                    <div class="col-lg-12" id="date_pax`+parseInt(counter_passenger+1)+`"></div>
                                    <div class="col-lg-9 col-md-9">
                                        <div class="row">
                                            <div class="col-lg-6 col-md-6 col-sm-6">
                                                <div class="form-select">
                                                    <select id="train_adult`+parseInt(counter_passenger+1)+`_search_type" onchange="search_type_on_change('pax','`+parseInt(counter_passenger+1)+`','train_adult`+parseInt(counter_passenger+1)+`_search_type','train_adult`+parseInt(counter_passenger+1)+`_search');">
                                                        <option value="cust_name">By Customer Name</option>
                                                        <option value="mobile">By Customer Mobile</option>
                                                        <option value="email">By Customer Mail</option>
                                                        <option value="identity_type">By Customer Identity Number</option>
                                                        <option value="birth_date">By Birth Date</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-lg-6 col-md-6 col-sm-6">
                                                <input class="form-control" type="text" id="train_adult`+parseInt(counter_passenger+1)+`_search" placeholder="Search"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-3 col-md-3">
                                        <button type="button" id="adult`+parseInt(counter_passenger+1)+`_search" class="primary-btn" onclick="get_customer_list('adult','`+parseInt(counter_passenger+1)+`','group_booking'); search_modal_pe_none();">Search</button>
                                    </div>
                                </div>
                                <span><i class="fas fa-exclamation-triangle" style="font-size:18px; color:#ffcc00;"></i> Using this means you can't change title, first name, and last name</span>
                                <div class="loading-pax-train" style="text-align:center; margin-top:15px; display:none;">
                                    <span style="font-size:18px; font-weight:bold;"> PLEASE WAIT </span><img src="/static/tt_website/images/gif/search.gif" alt="Search" style="height:50px; width:50px;"/>
                                </div>
                                <div id="search_result_adult`+(counter_passenger+1)+`">

                                </div>
                            </div>
                            <div id="passenger_input`+parseInt(counter_passenger+1)+`" style="background-color:white;" hidden>
                                <div class="row">
                                    <div class="col-lg-12" style="background-color:white;" id="adult_paxs`+parseInt(counter_passenger+1)+`">
                                        <div class="row">
                                            <div class="col-lg-12 col-md-12 col-sm-12" id="adult_div_avatar`+parseInt(counter_passenger+1)+`" hidden>
                                            </div>
                                            <div class="col-lg-6" style="margin-top:15px;">
                                                <label style="color:red">*</label>
                                                <label>Pax Type</label>`;
                                                if(template == 1){
                                                    text+=`<div class="input-container-search-ticket">`;
                                                }else if(template == 2){
                                                    text+=`<div>`;
                                                }else if(template == 3){
                                                    text+=`<div class="default-select">`;
                                                }else if(template == 4){
                                                    text+=`<div class="input-container-search-ticket">`;
                                                }else if(template == 5){
                                                    text+=`<div class="input-container-search-ticket">`;
                                                }else if(template == 6){
                                                    text+=`<div class="input-container-search-ticket">`;
                                                }
                                                text+=`<div class="form-select-2">`;
                                                if(template == 4){
                                                    text+=`<select class="nice-select-default rounded" id="adult_pax_type`+parseInt(counter_passenger+1)+`" name="adult_pax_type`+parseInt(counter_passenger+1)+`" onchange="onchange_title(`+parseInt(counter_passenger+1)+`)">`;
                                                }else{
                                                    text+=`<select id="adult_pax_type`+parseInt(counter_passenger+1)+`" name="adult_pax_type`+parseInt(counter_passenger+1)+`" onchange="onchange_title(`+parseInt(counter_passenger+1)+`)">`;
                                                }
                                                        for(i in pax_type_list){
                                                            text+= `<option value="`+i+`"`;
                                                            if(pax_type == i)
                                                                text += ' selected';
                                                            text+=`>`+pax_type_list[i]+`</option>`;
                                                        }
                                                        text+=`</select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-6" style="margin-top:15px;">
                                                <label style="color:red">*</label>
                                                <label>Title</label>`;
                                                if(template == 1){
                                                    text+=`<div class="input-container-search-ticket">`;
                                                }else if(template == 2){
                                                    text+=`<div>`;
                                                }else if(template == 3){
                                                    text+=`<div class="default-select">`;
                                                }else if(template == 4){
                                                    text+=`<div class="input-container-search-ticket">`;
                                                }else if(template == 5){
                                                    text+=`<div class="input-container-search-ticket">`;
                                                }else if(template == 6){
                                                    text+=`<div class="input-container-search-ticket">`;
                                                }
                                                text+=`<div class="form-select-2">`;
                                                if(template == 4){
                                                    text+=`<select class="nice-select-default rounded" id="adult_title`+parseInt(counter_passenger+1)+`" name="adult_title`+parseInt(counter_passenger+1)+`">`;
                                                }else{
                                                    text+=`<select id="adult_title`+parseInt(counter_passenger+1)+`" name="adult_title`+parseInt(counter_passenger+1)+`">`;
                                                }
                                                        for(i in titles){
                                                            text+= `<option value="`+titles[i]+`"`;
                                                            if(title == titles[i])
                                                                text += ' selected';
                                                            text+=`>`+titles[i]+`</option>`;
                                                        }
                                                        text+=`</select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-12">
                                                <br/>
                                                <label style="color:red">*</label>
                                                <label>First name and middle name (if any)</label>
                                                <div class="input-container-search-ticket" style="margin-bottom:5px;">
                                                    <input type="text" class="form-control" name="adult_first_name`+parseInt(counter_passenger+1)+`" id="adult_first_name`+parseInt(counter_passenger+1)+`" placeholder="First Name " onfocus="this.placeholder = ''" onblur="this.placeholder = 'First Name '" value=`+first_name+`>
                                                    <input type="hidden" class="form-control" name="adult_id`+parseInt(counter_passenger+1)+`" id="adult_id`+parseInt(counter_passenger+1)+`">
                                                </div>
                                                <span style="font-size:12px; padding:0;">As on Identity Card or Passport without title and punctuation</span>
                                            </div>
                                            <div class="col-lg-12 mb-3">
                                                <br/>
                                                <label>Last name</label>
                                                <div class="input-container-search-ticket" style="margin-bottom:5px;">
                                                    <input type="text" class="form-control" name="adult_last_name`+parseInt(counter_passenger+1)+`" id="adult_last_name`+parseInt(counter_passenger+1)+`" placeholder="Last Name " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Last Name '" value=`+last_name+`>
                                                </div>
                                                <span style="font-size:12px; padding:0;">As on Identity Card or Passport without title and punctuation</span>
                                            </div>
                                            <div class="col-lg-12 mb-3">
                                                <label style="color:red">*</label>
                                                <label>Nationality</label>`;
                                                if(template == 1 || template == 5 || template == 6){
                                                    text+=`<div class="input-container-search-ticket">`;
                                                }
                                                text+=`
                                                    <div class="form-select">
                                                        <select class="form-control js-example-basic-single" name="adult_nationality`+parseInt(counter_passenger+1)+`_id" style="width:100%;" id="adult_nationality`+parseInt(counter_passenger+1)+`_id" placeholder="Nationality">
                                                            <option value="">Select Nationality</option>`;
                                                            for(i in countries){
                                                                if(countries[i].code == 'ID' && nationality == '')
                                                                   text+=`<option value="`+countries[i].code+`" selected>`+countries[i].name+`</option>`;
                                                                else if(countries[i].name == nationality)
                                                                   text+=`<option value="`+countries[i].code+`" selected>`+countries[i].name+`</option>`;
                                                                else
                                                                   text+=`<option value="`+countries[i].code+`">`+countries[i].name+`</option>`;
                                                            }
                                                        text+=`</select>
                                                    </div>`;
                                                if(template == 1 || template == 5 || template == 6){
                                                    text+=`</div>`;
                                                }
                                            text+=`
                                            </div>
                                            <div class="col-lg-12 mb-3">
                                                <label style="color:red">*</label>
                                                <label>Birth Date</label>
                                                <div class="input-container-search-ticket" style="margin-bottom:5px;">
                                                    <input type="text" style="background:white;" class="form-control date-picker-birth" name="adult_birth_date`+parseInt(counter_passenger+1)+`" id="adult_birth_date`+parseInt(counter_passenger+1)+`" onchange="check_years_old(`+parseInt(counter_passenger+1)+`)" placeholder="Birth Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Birth Date '" autocomplete="off">
                                                    <input type="hidden" class="form-control" name="adult_years_old`+parseInt(counter_passenger+1)+`" id="adult_years_old`+parseInt(counter_passenger+1)+`">
                                                </div>
                                            </div>
                                            <div class="col-lg-12 mb-3" id="adult_div_avatar_identity`+parseInt(counter_passenger+1)+`" hidden>
                                            </div>`;

//                                                    <div class="col-lg-6 col-md-6 col-sm-6">
//                                                        <span>Identity Photo</span><br>
//                                                        <button type="button" class="primary-btn" data-toggle="modal" data-target="#myModal_attachment_identity_adult`+parseInt(counter_passenger+1)+`">Upload Image</button>
//                                                        <!-- Modal -->
//                                                        <div class="modal fade" id="myModal_attachment_identity_adult`+parseInt(counter_passenger+1)+`" data-keyboard="false">
//                                                            <div class="modal-dialog">
//
//                                                                <!-- Modal content-->
//                                                                <div class="modal-content">
//                                                                    <div class="modal-header">
//                                                                        <h4 class="modal-title">Identity Photo</h4>
//                                                                        <button type="button" class="close" onclick="$('#myModal_attachment_identity_adult`+parseInt(counter_passenger+1)+`').modal('hide');">×</button>
//                                                                    </div>
//                                                                    <div class="modal-body">
//
//                                                                        Files: <input type="file" id="adult_files_attachment_identity`+parseInt(counter_passenger+1)+`" name="adult_files_attachment_identity`+parseInt(counter_passenger+1)+`" accept="image/*"><br>
//
//                                                                        <div id="selectedFiles_adult_files_identity`+parseInt(counter_passenger+1)+`"></div>
//                                                                        <div id="adult_attachment_identity`+parseInt(counter_passenger+1)+`">
//
//                                                                        </div>
//                                                                    </div>
//                                                                    <div class="modal-footer">
//                                                                        <button type="button" class="btn btn-default" onclick="$('#myModal_attachment_identity_adult`+parseInt(counter_passenger+1)+`').modal('hide');">Close</button>
//                                                                    </div>
//                                                                </div>
//                                                            </div>
//                                                        </div>
//                                                    </div>
//                                                    <div class="col-lg-6 col-md-6 col-sm-6">
//                                                    </div>
                                            text+=`<div class="col-lg-12 mb-3" id="adult_identity_div`+parseInt(counter_passenger+1)+`">
                                                <label style="color:red">*</label>
                                                <label>ID Type</label>`;
                                                if(template == 1){
                                                    text+=`<div class="input-container-search-ticket">`;
                                                }else if(template == 2){
                                                    text+=`<div>`;
                                                }else if(template == 3){
                                                    text+=`<div class="default-select">`;
                                                }else if(template == 4){
                                                    text+=`<div class="input-container-search-ticket">`;
                                                }else if(template == 5){
                                                    text+=`<div class="input-container-search-ticket">`;
                                                }else if(template == 6){
                                                    text+=`<div class="input-container-search-ticket">`;
                                                }
                                                text+=`<div class="form-select-2">`;
                                                if(template == 4){
                                                    text+=`<select class="nice-select-default rounded" id="adult_identity_type`+parseInt(counter_passenger+1)+`" name="adult_identity_type`+parseInt(counter_passenger+1)+`">`;
                                                }else{
                                                    text+=`<select id="adult_identity_type`+parseInt(counter_passenger+1)+`" name="adult_identity_type`+parseInt(counter_passenger+1)+`" >`;
                                                }
                                                if(identity_type == ''){
                                                    text+=`
                                                        <option value=""></option>
                                                        <option value="ktp">KTP</option>
                                                        <option value="sim">SIM</option>
                                                        <option value="passport">PASSPORT</option>
                                                        <option value="other">Other</option>`;
                                                }else{
                                                    text+=`
                                                        <option value=""></option>`;
                                                    if(identity_type == 'ktp')
                                                        text+=`<option value="ktp" selected>KTP</option>`;
                                                    else
                                                        text+=`<option value="ktp">KTP</option>`;

                                                    if(identity_type == 'sim')
                                                        text+=`<option value="sim" selected>SIM</option>`;
                                                    else
                                                        text+=`<option value="sim">SIM</option>`;

                                                    if(identity_type == 'passport')
                                                        text+=`<option value="passport" selected>Passport</option>`;
                                                    else
                                                        text+=`<option value="passport">Passport</option>`;

                                                    if(identity_type == 'other')
                                                        text+=`<option value="other" selected>Other</option>`;
                                                    else
                                                        text+=`<option value="other">Other</option>`;
                                                }
                                                        text+=`</select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-12 mb-3">
                                                <label style="color:red">*</label>
                                                <label>Identity Number</label>
                                                <div class="input-container-search-ticket" style="margin-bottom:5px;">
                                                    <input type="text" class="form-control" name="adult_identity_number`+parseInt(counter_passenger+1)+`" id="adult_identity_number`+parseInt(counter_passenger+1)+`" placeholder="Identity Number " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Identity Number '" value=`+identity_number+`>
                                                </div>
                                            </div>
                                            <div class="col-lg-12 mb-3">
                                                <label style="color:red">*</label>
                                                <label>Identity Expired Date</label>
                                                <div class="input-container-search-ticket" style="margin-bottom:5px;">
                                                    <input type="text" class="form-control date-picker-passport" name="adult_identity_expired_date`+parseInt(counter_passenger+1)+`" id="adult_identity_expired_date`+parseInt(counter_passenger+1)+`" placeholder="Identity Expired Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Identity Expired Date '" autocomplete="off">
                                                    <button type="button" class="primary-delete-date" onclick="delete_identity_expired_date('adult', `+parseInt(counter_passenger+1)+`)"><i class="fa fa-trash-alt" style="color:#E92B2B;font-size:20px;"></i></button>
                                                </div>
                                            </div>

                                            <div class="col-lg-12 mb-3">
                                                <label style="color:red">*</label>
                                                <label>Country of Issued</label>`;
                                                if(template == 1){
                                                    text+=`<div class="input-container-search-ticket">`;
                                                    text+=`
                                                        <div class="form-select">
                                                            <select class="form-control js-example-basic-single" name="adult_country_of_issued`+parseInt(counter_passenger+1)+`_id" style="width:100%;" id="adult_country_of_issued`+parseInt(counter_passenger+1)+`_id" placeholder="Country Of Issued">
                                                                <option value="">Select Country Of Issued</option>`;
                                                                for(i in countries){
                                                                   if(country_of_issued != '' && country_of_issued == countries[i].name)
                                                                    text+=`<option value="`+countries[i].code+`" selected>`+countries[i].name+`</option>`;
                                                                   else
                                                                    text+=`<option value="`+countries[i].code+`">`+countries[i].name+`</option>`;
                                                                }
                                                            text+=`</select>
                                                        </div>
                                                        <button type="button" class="primary-delete-date" onclick="delete_country_of_issued('adult', `+parseInt(counter_passenger+1)+`)"><i class="fa fa-trash-alt" style="color:#E92B2B;font-size:20px;"></i></button>`;
                                                    text+=`</div>`;
                                                }else if(template == 2){
                                                    text+=`<div class="input-container-search-ticket">`;
                                                    text+=`
                                                        <select class="form-control js-example-basic-single" name="adult_country_of_issued`+parseInt(counter_passenger+1)+`_id" style="width:100%;" id="adult_country_of_issued`+parseInt(counter_passenger+1)+`_id" placeholder="Country Of Issued">
                                                            <option value="">Select Country Of Issued</option>`;
                                                            for(i in countries){
                                                               if(country_of_issued != '' && country_of_issued == countries[i].name)
                                                                text+=`<option value="`+countries[i].code+`" selected>`+countries[i].name+`</option>`;
                                                               else
                                                                text+=`<option value="`+countries[i].code+`">`+countries[i].name+`</option>`;
                                                            }
                                                        text+=`</select>
                                                        <button type="button" class="primary-delete-date" onclick="delete_country_of_issued('adult', `+parseInt(counter_passenger+1)+`)"><i class="fa fa-trash-alt" style="color:#E92B2B;font-size:20px;"></i></button>`;
                                                    text+=`</div>`;
                                                }else if(template == 3){
                                                    text+=`<div class="input-container-search-ticket" style="margin-bottom:5px;">`;
                                                    text+=`
                                                        <select class="form-control js-example-basic-single" name="adult_country_of_issued`+parseInt(counter_passenger+1)+`_id" style="width:100%;" id="adult_country_of_issued`+parseInt(counter_passenger+1)+`_id" placeholder="Country Of Issued">
                                                            <option value="">Select Country Of Issued</option>`;
                                                            for(i in countries){
                                                               if(country_of_issued != '' && country_of_issued == countries[i].name)
                                                                text+=`<option value="`+countries[i].code+`" selected>`+countries[i].name+`</option>`;
                                                               else
                                                                text+=`<option value="`+countries[i].code+`">`+countries[i].name+`</option>`;
                                                            }
                                                        text+=`</select>
                                                        <button type="button" class="primary-delete-date" onclick="delete_country_of_issued('adult', `+parseInt(counter_passenger+1)+`)"><i class="fa fa-trash-alt" style="color:#E92B2B;font-size:20px;"></i></button>`;
                                                    text+=`</div>`;
                                                }else if(template == 4){
                                                    text+=`<div class="input-container-search-ticket" style="margin-bottom:5px;">`;
                                                    text+=`
                                                        <select class="form-control js-example-basic-single" name="adult_country_of_issued`+parseInt(counter_passenger+1)+`_id" style="width:100%;" id="adult_country_of_issued`+parseInt(counter_passenger+1)+`_id" placeholder="Country Of Issued">
                                                            <option value="">Select Country Of Issued</option>`;
                                                            for(i in countries){
                                                               if(country_of_issued != '' && country_of_issued == countries[i].name)
                                                                text+=`<option value="`+countries[i].code+`" selected>`+countries[i].name+`</option>`;
                                                               else
                                                                text+=`<option value="`+countries[i].code+`">`+countries[i].name+`</option>`;
                                                            }
                                                        text+=`</select>
                                                        <button type="button" class="primary-delete-date" onclick="delete_country_of_issued('adult', `+parseInt(counter_passenger+1)+`)"><i class="fa fa-trash-alt" style="color:#E92B2B;font-size:20px;"></i></button>`;
                                                    text+=`</div>`;
                                                }else if(template == 5){
                                                    text+=`<div class="input-container-search-ticket">`;
                                                    text+=`
                                                        <div class="form-select">
                                                            <select class="form-control js-example-basic-single" name="adult_country_of_issued`+parseInt(counter_passenger+1)+`_id" style="width:100%;" id="adult_country_of_issued`+parseInt(counter_passenger+1)+`_id" placeholder="Country Of Issued">
                                                                <option value="">Select Country Of Issued</option>`;
                                                                for(i in countries){
                                                                   if(country_of_issued != '' && country_of_issued == countries[i].name)
                                                                    text+=`<option value="`+countries[i].code+`" selected>`+countries[i].name+`</option>`;
                                                                   else
                                                                    text+=`<option value="`+countries[i].code+`">`+countries[i].name+`</option>`;
                                                                }
                                                            text+=`</select>
                                                        </div>
                                                        <button type="button" class="primary-delete-date" onclick="delete_country_of_issued('adult', `+parseInt(counter_passenger+1)+`)"><i class="fa fa-trash-alt" style="color:#E92B2B;font-size:20px;"></i></button>`;
                                                    text+=`</div>`;
                                                }else if(template == 6){
                                                    text+=`<div class="input-container-search-ticket">`;
                                                    text+=`
                                                        <div class="form-select">
                                                            <select class="form-control js-example-basic-single" name="adult_country_of_issued`+parseInt(counter_passenger+1)+`_id" style="width:100%;" id="adult_country_of_issued`+parseInt(counter_passenger+1)+`_id" placeholder="Country Of Issued">
                                                                <option value="">Select Country Of Issued</option>`;
                                                                for(i in countries){
                                                                   if(country_of_issued != '' && country_of_issued == countries[i].name)
                                                                    text+=`<option value="`+countries[i].code+`" selected>`+countries[i].name+`</option>`;
                                                                   else
                                                                    text+=`<option value="`+countries[i].code+`">`+countries[i].name+`</option>`;
                                                                }
                                                            text+=`</select>
                                                        </div>
                                                        <button type="button" class="primary-delete-date" onclick="delete_country_of_issued('adult', `+parseInt(counter_passenger+1)+`)"><i class="fa fa-trash-alt" style="color:#E92B2B;font-size:20px;"></i></button>`;
                                                    text+=`</div>`;
                                                }
                                            text+=`
                                            </div>
                                            <div class="col-lg-12 mb-3" >
                                                <label>Behaviors</label>
                                                <div class="input-container-search-ticket">
                                                    <textarea class="form-control" style="resize: none; height:200px;" id="adult_behaviors_`+parseInt(counter_passenger+1)+`" name="adult_behaviors_`+parseInt(counter_passenger+1)+`" placeholder="Solo Traveller:&#10;&#10;Group Traveller:&#10;" rows="6" cols="45"></textarea>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" onclick="update_contact('passenger',`+parseInt(counter_passenger+1)+`);" class="primary-btn" style="background-color:#cdcdcd; color:black;" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

        node.innerHTML = text;
        node.setAttribute('id', 'table_passenger'+counter_passenger);
        node.className = 'row';
        document.getElementById("table_of_passenger").appendChild(node);

        $('input[name="adult_birth_date'+parseInt(counter_passenger+1)+'"]').daterangepicker({
              parentEl: "#passenger_input"+parseInt(counter_passenger+1),
              singleDatePicker: true,
              autoUpdateInput: true,
              startDate: moment().subtract(+18, 'years'),
              maxDate: moment(),
              showDropdowns: true,
              opens: 'center',
              locale: {
                  format: 'DD MMM YYYY',
              }
        });

        $('input[name="adult_identity_expired_date'+parseInt(counter_passenger+1)+'"]').daterangepicker({
              parentEl: "#passenger_input"+parseInt(counter_passenger+1),
              singleDatePicker: true,
              autoUpdateInput: true,
              startDate: moment(),
              minDate: moment(),
              showDropdowns: true,
              opens: 'center',
              locale: {
                  format: 'DD MMM YYYY',
              }
        });
        document.getElementById('adult_identity_expired_date'+parseInt(counter_passenger+1)).value = identity_exp_date;
        document.getElementById('adult_birth_date'+parseInt(counter_passenger+1)).value = birth_date;
        document.getElementById("train_adult"+parseInt(counter_passenger+1)+"_search").addEventListener("keyup", function(event) {
          // Number 13 is the "Enter" key on the keyboard

          if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            document.getElementById(event.target.id.split('_')[1]+'_search').click();
          }
        });
    //    document.getElementById("radio_passenger_search"+(counter_passenger+1)).onclick = "radio_button('passenger',counter_passenger);"

        $('#adult_nationality'+parseInt(counter_passenger+1)+'_id').select2();
        $('#adult_country_of_issued'+parseInt(counter_passenger+1)+'_id').select2();
        $('#adult_phone_code'+parseInt(counter_passenger+1)+'_id').select2();
    //    $('#adult_nationality'+parseInt(counter_passenger+1)).select2();
//        if(type == 'open')
//            $('#myModal_adult'+parseInt(parseInt(counter_passenger+1))).modal('show');
        $('#adult_title'+parseInt(counter_passenger+1)).niceSelect();
        $('#train_adult'+parseInt(counter_passenger+1)+'_search_type').niceSelect();
        $('#adult_pax_type'+parseInt(counter_passenger+1)).niceSelect();
        $('#adult_identity_type'+parseInt(counter_passenger+1)).niceSelect();
//        auto_complete(`adult_nationality`+parseInt(counter_passenger+1));
        counter_passenger++;
        passenger_number = counter_passenger;
//        document.addEventListener("DOMContentLoaded", init_upload('adult',counter_passenger), false);
    }else{
        Swal.fire({
          type: 'warning',
          title: 'Oops!',
          html: 'Max Passenger!',
       })
    }
}

function delete_table_of_passenger(counter){
    if(counter_passenger != 0){
        try{
            var element = document.getElementById('table_passenger'+counter);
            element.parentNode.removeChild(element);
        }catch(err){
            console.log(err) //ada element yg tidak ada
        }
    }
    count_pax = 1;
    for(i=0;i<counter_passenger;i++){
        try{
            document.getElementById('passenger_number'+i).innerHTML = '#'+count_pax;
            document.getElementById('passenger_number_modal_header'+i).innerHTML = 'Passenger '+count_pax;
            count_pax++;
        }catch(err){

        }
    }

    if(document.getElementById('table_of_passenger').innerHTML.trim() == ''){
        document.getElementById('table_of_passenger').innerHTML = '<h6 class="mb-3">PLEASE ADD PASSENGER OR UPLOAD FILE FIRST!</h6>';
    }

}

function Upload() {
    //Reference the FileUpload element.
    var fileUpload = document.getElementById("fileUpload");

    //Validate whether File is valid Excel file.
    if(fileUpload.value.toLowerCase().endsWith(".xlsx")){
        if (typeof (FileReader) != "undefined") {
            var reader = new FileReader();

            //For Browsers other than IE.
            if (reader.readAsBinaryString) {
                reader.onload = function (e) {
                    ProcessExcel(e.target.result);
                };
                reader.readAsBinaryString(fileUpload.files[0]);
            } else {
                //For IE Browser.
                reader.onload = function (e) {
                    var data = "";
                    var bytes = new Uint8Array(e.target.result);
                    for (var i = 0; i < bytes.byteLength; i++) {
                        data += String.fromCharCode(bytes[i]);
                    }
                    ProcessExcel(data);
                };
                reader.readAsArrayBuffer(fileUpload.files[0]);
            }
        } else {
            alert("This browser does not support HTML5.");
        }
    } else {
        alert("Please upload a valid Excel file.");
    }
};

function ProcessExcel(data) {
    //Read the Excel File data.
    var workbook = XLSX.read(data, {
        type: 'binary'
    });
    //Fetch the name of First Sheet.
    var firstSheet = workbook.SheetNames[0];

    //Read all rows from First Sheet into an JSON array.
    var excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);
    //Create a HTML Table element.
    var table = document.createElement("table");
    table.border = "1";

    //Add the header row.
    var row = table.insertRow(-1);

    //Add the header cells.
    var headerCell = document.createElement("TH");
    headerCell.innerHTML = "Id";
    row.appendChild(headerCell);

    headerCell = document.createElement("TH");
    headerCell.innerHTML = "Name";
    row.appendChild(headerCell);

    headerCell = document.createElement("TH");
    headerCell.innerHTML = "Country";
    row.appendChild(headerCell);

    //Add the data rows from Excel file.
    passengers_excel = []
    for (var i = 0; i < excelRows.length; i++) {
        //Add the data row.
        passengers_excel.push([])
        for(j in excelRows[i]){
            passengers_excel[passengers_excel.length-1].push(excelRows[i][j])
        }
    }
    notes = '';
    counter_pax = 0;
    for(i in passengers_excel){
        add_table_of_passenger('close',passengers_excel[i]);
    }
};

function show_commission(val){
    var sc = '';
    var scs = '';
    if(val == 'show_commission_new'){
        sc = document.getElementById("show_commission_new");
        scs = document.getElementById("show_commission_new_button");
    }else if(val == 'show_commission'){
        var sc = document.getElementById("show_commission");
        var scs = document.getElementById("show_commission_button");
    }else{
        sc = document.getElementById("show_commission_old");
        scs = document.getElementById("show_commission_old_button");
    }
    if (sc.style.display === "none"){
        sc.style.display = "inline";
        scs.innerHTML = `<span style="float:right;">hide <i class="fas fa-eye-slash"></i></span>`;
    }
    else{
        sc.style.display = "none";
        scs.innerHTML = `<span style="float:right;">show <i class="fas fa-eye"></i></span>`;
    }
}

function update_service_charge(type){
    repricing_order_number = '';
    if(type == 'booking'){
        document.getElementById('group_booking').innerHTML = '';
        upsell = []
        for(i in group_booking_get_detail.result.response.passengers){
            for(j in group_booking_get_detail.result.response.passengers[i].sale_service_charges){
                currency = group_booking_get_detail.result.response.passengers[i].sale_service_charges[j].FARE.currency;
            }
            list_price = []
            for(j in list){
                if(group_booking_get_detail.result.response.passengers[i].name == document.getElementById('selection_pax'+j).value){
                    list_price.push({
                        'amount': list[j],
                        'currency_code': currency
                    });
                }

            }
            upsell.push({
                'sequence': group_booking_get_detail.result.response.passengers[i].sequence,
                'pricing': JSON.parse(JSON.stringify(list_price))
            });
        }
        repricing_order_number = order_number;
    }
    $.ajax({
       type: "POST",
       url: "/webservice/group_booking",
       headers:{
            'action': 'update_service_charge',
       },
       data: {
           'order_number': repricing_order_number,
           'passengers': JSON.stringify(upsell),
           'signature': signature
       },
       success: function(msg) {
           if(msg.result.error_code == 0){
                try{
                    if(type == 'booking'){
                        please_wait_transaction();
                        group_booking_get_booking(order_number);
                        price_arr_repricing = {};
                        pax_type_repricing = [];
                    }
                }catch(err){
                    console.log(err); // error kalau ada element yg tidak ada
                }
                $('#myModalRepricing').modal('hide');
           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
           }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error group booking service charge </span>' + msg.result.error_msg,
                })
                $('.loader-rodextrip').fadeOut();
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error group booking service charge');
            $('.loader-rodextrip').fadeOut();
       },timeout: 60000
    });

}


function update_insentif_booker(type){
    repricing_order_number = '';
    if(type == 'booking'){
        document.getElementById('group_booking').innerHTML = '';
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
       url: "/webservice/group_booking",
       headers:{
            'action': 'booker_insentif_booking',
       },
       data: {
           'order_number': repricing_order_number,
           'booker': JSON.stringify(booker_insentif),
           'signature': signature
       },
       success: function(msg) {
           if(msg.result.error_code == 0){
                try{
                    if(type == 'booking'){
                        please_wait_transaction();
                        group_booking_get_booking(order_number);
                        price_arr_repricing = {};
                        pax_type_repricing = [];
                    }
                }catch(err){
                    console.log(err); // error kalau ada element yg tidak ada
                }
                $('#myModalRepricing').modal('hide');
           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
           }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error group booking update booker insentif </span>' + msg.result.error_msg,
                })
                $('.loader-rodextrip').fadeOut();
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error group booking update booker insentif');
            $('.loader-rodextrip').fadeOut();
       },timeout: 60000
    });

}

function copy_data(){
    const el = document.createElement('textarea');
    el.value = $text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    })

    Toast.fire({
      type: 'success',
      title: 'Copied Successfully'
    })
}

function delete_identity_expired_date(type, id){
    document.getElementById(type+'_identity_expired_date'+id).value = "";
}