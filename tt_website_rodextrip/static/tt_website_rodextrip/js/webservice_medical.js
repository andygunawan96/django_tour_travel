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
                    get_config_medical(data, vendor);
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
          error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error medical signin');
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
                    data_kota = medical_config['result']['response']['kota']
                    var product = '';
                    for(i in medical_config.result.response.carriers_code){
                        if(medical_config.result.response.carriers_code[i].code == test_type)
                            product = medical_config.result.response.carriers_code[i].name
                    }
                    document.getElementById('medical_product').innerHTML = product;
                    document.getElementById('copy_booker_to_pax_div').hidden = false;
                    document.getElementById('medical_pax_dix').hidden = false;
                    add_table();
                }else if(type == 'home'){
                    var text = '';
                    if(vendor == 'phc'){
                        for(i in msg.result.response.carriers_code){
                            text += '<option value="'+msg.result.response.carriers_code[i].code+'">' + msg.result.response.carriers_code[i].name + '</option>';
                        }
                        document.getElementById('medical_type_phc').innerHTML += text;
                        $('#medical_type_phc').niceSelect('update');
                    }else if(vendor == 'periksain'){
                        for(i in msg.result.response)
                            text += '<option value="'+i+'">Antigen</option>';
                        document.getElementById('medical_type_periksain').innerHTML += text;
                        $('#medical_type_periksain').niceSelect('update');
                    }
                }
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get config medical');
       },timeout: 300000
    });
}

//function get_kota(){
//    $.ajax({
//       type: "POST",
//       url: "/webservice/medical",
//       headers:{
//            'action': 'get_kota',
//       },
//       data: {
//            'signature': signature,
//       },
//       success: function(msg) {
//            console.log(msg);
//            data_kota = msg;
//       },
//       error: function(XMLHttpRequest, textStatus, errorThrown) {
//            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get config medical');
//       },timeout: 300000
//    });
//}

function get_kecamatan(id_kabupaten,id_kecamatan){
    var text = '';
    text += '<option value="">Choose</option>';
    for(i in data_kota[document.getElementById(id_kabupaten).value]){
        text += '<option value="'+i+'">'+i+"</option>";
    }
    document.getElementById(id_kecamatan).innerHTML = text;
    $('#'+id_kecamatan).select2();
    text = '';
    if(id_kecamatan.includes('ktp'))
        text = `<option value="">Select Kelurahan KTP</option>`;
    else{
        text = `<option value="">Select Kelurahan</option>`;
    }
    document.getElementById(id_kecamatan.replace('kecamatan','kelurahan')).innerHTML = text;
    $('#'+id_kecamatan.replace('kecamatan','kelurahan')).select2();
}

function get_kelurahan(id_kecamatan,id_kelurahan){
    var text = '';
    text += '<option value="">Choose</option>';
    for(i in data_kota[document.getElementById(id_kecamatan.replace('kecamatan','kabupaten')).value][document.getElementById(id_kecamatan).value]){
        text += '<option value="'+data_kota[document.getElementById(id_kecamatan.replace('kecamatan','kabupaten')).value][document.getElementById(id_kecamatan).value][i]+'">'+data_kota[document.getElementById(id_kecamatan.replace('kecamatan','kabupaten')).value][document.getElementById(id_kecamatan).value][i]+"</option>";
    }
    document.getElementById(id_kelurahan).innerHTML = text;
    $('#'+id_kelurahan).select2();
}

//function get_kecamatan(id_kabupaten,id_kecamatan){
//    $.ajax({
//       type: "POST",
//       url: "/webservice/medical",
//       headers:{
//            'action': 'get_kecamatan',
//       },
//       data: {
//            'signature': signature,
//            'kabupaten': document.getElementById(id_kabupaten).value
//       },
//       success: function(msg) {
//            console.log(msg);
//            if(msg.result.error_code == 0){
//                var text = '';
//                text += '<option value="">Choose</option>';
//                for(i in msg.result.response.kecamatan){
//                    text += '<option value="'+msg.result.response.kecamatan[i]+'">'+msg.result.response.kecamatan[i]+"</option>";
//                }
//                document.getElementById(id_kecamatan).innerHTML = text;
//                $('#'+id_kecamatan).select2();
//                text = '';
//                if(id_kecamatan.includes('ktp'))
//                    text = `<option value="">Select Kelurahan KTP</option>`;
//                else{
//                    text = `<option value="">Select Kelurahan</option>`;
//                }
//                document.getElementById(id_kecamatan.replace('kecamatan','kelurahan')).innerHTML = text;
//                $('#'+id_kecamatan.replace('kecamatan','kelurahan')).select2();
//
//                //$('#'+id_kecamatan).niceSelect('update');
////                get_desa(id_kecamatan, id_kecamatan.replace('kecamatan','kelurahan'));
//            }
//       },
//       error: function(XMLHttpRequest, textStatus, errorThrown) {
//            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get config medical');
//       },timeout: 300000
//    });
//}
//
//function get_kelurahan(id_kecamatan,id_kelurahan){
//    $.ajax({
//       type: "POST",
//       url: "/webservice/medical",
//       headers:{
//            'action': 'get_desa',
//       },
//       data: {
//            'signature': signature,
//            'kecamatan': document.getElementById(id_kecamatan).value
//       },
//       success: function(msg) {
//            console.log(msg);
//            if(msg.result.error_code == 0){
//                var text = '';
//                text += '<option value="">Choose</option>';
//                for(i in msg.result.response.desa){
//                    text += '<option value="'+msg.result.response.desa[i]+'">'+msg.result.response.desa[i]+"</option>";
//                }
//                document.getElementById(id_kelurahan).innerHTML = text;
//                $('#'+id_kelurahan).select2();
//            }
//       },
//       error: function(XMLHttpRequest, textStatus, errorThrown) {
//            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get config medical');
//       },timeout: 300000
//    });
//}

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
                msg = msg.result.response;
                if(Object.keys(msg).length > 0){
                    for(i in msg){
                        for(j in msg[i].timeslots){
                            for(k in msg[i].timeslots[j]){
                                tes = moment.utc(j + ' '+ msg[i].timeslots[j][k].time).format('YYYY-MM-DD HH:mm:ss')
                                localTime  = moment.utc(tes).toDate();
                                msg[i].timeslots[j][k].time = moment(localTime).format('HH:mm');
                            }
                        }
                    }
                    medical_get_availability_response = msg;
                    var text_innerHTML = '';
                    for(i in msg){
                        if(i == 'Surabaya')
                            text_innerHTML += `<option value=`+i+` selected>`+i+`</option>`;
                        else
                            text_innerHTML += `<option value=`+i+`>`+i+`</option>`;
                    }
                    document.getElementById('booker_area').innerHTML = text_innerHTML;
                    $('#booker_area').niceSelect('update');
                    add_other_time();
                }else if(vendor == 'phc' && test_type == 'PHCDTKATG' || vendor == 'phc' && test_type == 'PHCDTKPCR'){
                    var text_innerHTML = '';
                    text_innerHTML += `<option value='surabaya' selected>Surabaya</option>`;
                    document.getElementById('booker_area').innerHTML = text_innerHTML;
                    $('#booker_area').niceSelect('update');
                }else{
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: 'Timeslot not available please contact administrator!',
                    }).then((result) => {
                      //redirect ke phc
                    })
                }
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get availability medical');
       },timeout: 300000
    });
}



function medical_check_price(){
    var timeslot_list = [];
    document.getElementById('check_price_medical').disabled = true;
    for(i=1;i <= test_time; i++){
        try{
            timeslot_list.push(document.getElementById('booker_timeslot_id'+i).value.split('~')[0])
        }catch(err){}
    }
    var now = moment();
    var test_list_counter = 1;
    var add_list = true;
    var error_log = '';
    if(vendor == 'periksain' || vendor == 'phc' && test_type == 'PHCHCKATG')
    for(i=1; i <= test_time; i++){
        try{
            add_list = true;
            if(now.format('DD MMM YYYY') == document.getElementById('booker_test_date'+i).value){
                if(now.diff(moment(document.getElementById('booker_test_date'+i).value+' '+document.getElementById('booker_timeslot_id'+i).value.split('~')[1]), 'hours') > -5){
                    add_list = false;
                    error_log += 'Test time reservation only can be book 5 hours before test please change test ' + test_list_counter + '!</br>\n';
                }
            }
            test_list_counter++;
        }catch(err){

        }

    }
    if(timeslot_list.length != 0 && error_log == '' || vendor == 'phc' && test_type == 'PHCDTKATG' || vendor == 'phc' && test_type == 'PHCDTKPCR'){
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
                'timeslot_list': JSON.stringify(timeslot_list),
                'carrier_code': test_type
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
                    document.getElementById('next_medical').style.display = 'block';
                    document.getElementById('check_price_medical').disabled = false;
                    //print harga
                }
                }catch(err){console.log(err);}
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get price medical');
           },timeout: 300000
        });
    }else if(error_log != ''){
        Swal.fire({
            type: 'error',
            title: 'Oops!',
            html: error_log,
        })
        document.getElementById('check_price_medical').disabled = false;
    }else{
        Swal.fire({
            type: 'error',
            title: 'Oops!',
            html: 'Please choose timeslot!',
        })
        document.getElementById('check_price_medical').disabled = false;
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

//                if(document.URL.split('/')[document.URL.split('/').length-1] == 'review'){
//                    tax = 0;
//                    fare = 0;
//                    total_price = 0;
//                    price_provider = 0;
//                    commission = 0;
//                    service_charge = ['FARE', 'RAC', 'ROC', 'TAX', 'SSR', 'DISC'];
//                    type_amount_repricing = ['Repricing'];
//                    for(i in passengers){
//                        if(i != 'booker' && i != 'contact'){
//                            for(j in passengers[i]){
//                                pax_type_repricing.push([passengers[i][j].first_name +passengers[i][j].last_name, passengers[i][j].first_name +passengers[i][j].last_name]);
//                                price_arr_repricing[passengers[i][j].first_name +passengers[i][j].last_name] = {
//                                    'Fare': 0,
//                                    'Tax': 0,
//                                    'Repricing': 0
//                                }
//                            }
//                        }
//                    }
//                    //repricing
//                    text_repricing = `
//                    <div class="col-lg-12">
//                        <div style="padding:5px;" class="row">
//                            <div class="col-lg-6"></div>
//                            <div class="col-lg-6">Repricing</div>
//                        </div>
//                    </div>`;
//                    for(k in price_arr_repricing){
//                       text_repricing += `
//                       <div class="col-lg-12">
//                            <div style="padding:5px;" class="row" id="adult">
//                                <div class="col-lg-6" id="`+j+`_`+k+`">`+k+`</div>
//                                <div hidden id="`+k+`_price">`+getrupiah(price_arr_repricing[k].Fare + price_arr_repricing[k].Tax)+`</div>`;
//                                if(price_arr_repricing[k].Repricing == 0)
//                                text_repricing+=`<div class="col-lg-6" id="`+k+`_repricing">-</div>`;
//                                else
//                                text_repricing+=`<div class="col-lg-6" id="`+k+`_repricing">`+getrupiah(price_arr_repricing[k].Repricing)+`</div>`;
//                                text_repricing+=`<div hidden id="`+k+`_total">`+getrupiah(price_arr_repricing[k].Fare + price_arr_repricing[k].Tax + price_arr_repricing[k].Repricing)+`</div>
//                            </div>
//                        </div>`;
//                    }
//                    text_repricing += `<div id='repricing_button' class="col-lg-12" style="text-align:center;"></div>`;
//                    document.getElementById('repricing_div').innerHTML = text_repricing;
//                    //repricing
//                }
//                if(document.URL.split('/')[document.URL.split('/').length-1] == 'review' && user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false){
//                    text+=`<div style="text-align:right;"><img src="/static/tt_website_rodextrip/img/bank.png" alt="Bank" style="width:25px; height:25px; cursor:pointer;" onclick="show_repricing();"/></div>`;
//                }
                //print harga
            }
            }catch(err){console.log(err);}
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get price medical');
       },timeout: 300000
    });
}

function pre_medical_commit_booking(val){
    if(val == 0){
        medical_commit_booking(val);
        $('.hold-seat-booking-train').addClass("running");
        $('.hold-seat-booking-train').attr("disabled", true);
        please_wait_transaction();
    }else{
        Swal.fire({
          title: 'Are you sure want to Request this booking?',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.value) {
                try{
                    $('.hold-seat-booking-train').attr("disabled", true);
                    $('.issued_booking_btn').prop('disabled', true);
                    please_wait_transaction();

                    document.getElementById("passengers").value = JSON.stringify(passengers);
                    document.getElementById("signature").value = signature;
                    document.getElementById("provider").value = 'medical';
                    document.getElementById("type").value = 'medical_review';
                    document.getElementById("voucher_code").value = voucher_code;
                    document.getElementById("discount").value = JSON.stringify(discount_voucher);
                    document.getElementById("session_time_input").value = time_limit;
                    document.getElementById('medical_issued').submit();
                }catch(err){
                    console.log(err)
                }
            }
        })

    }
}

function medical_commit_booking(val){
    $('.hold-seat-booking-train').addClass("running");
    $('.hold-seat-booking-train').attr("disabled", true);
    please_wait_transaction();

    if(typeof(vendor) === 'undefined')
        vendor = '';
    if(typeof(test_type) === 'undefined')
        test_type = '';
    data = {
        'signature': signature,
        'provider': vendor,
        'test_type': test_type,
        'force_issued': val
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
//                    send_url_booking('medical', btoa(msg.result.response.order_number), msg.result.response.order_number);
//                    document.getElementById('order_number').value = msg.result.response.order_number;
//                    document.getElementById("passengers").value = JSON.stringify(passengers);
//                    document.getElementById("signature").value = signature;
//                    document.getElementById("provider").value = 'medical';
//                    document.getElementById("type").value = 'medical_review';
//                    document.getElementById("voucher_code").value = voucher_code;
//                    document.getElementById("discount").value = JSON.stringify(discount_voucher);
//                    document.getElementById("session_time_input").value = time_limit;
//                    document.getElementById('medical_issued').submit();
                       document.getElementById('medical_booking').innerHTML+= '<input type="hidden" name="order_number" value='+msg.result.response.order_number+'>';
                       document.getElementById('medical_booking').action = '/medical/booking/' + btoa(msg.result.response.order_number);
                       document.getElementById('medical_booking').submit();
               }else{
                   if(val == 0){
                       document.getElementById('medical_booking').innerHTML+= '<input type="hidden" name="order_number" value='+msg.result.response.order_number+'>';
                       document.getElementById('medical_booking').action = '/medical/booking/' + btoa(msg.result.response.order_number);
                       document.getElementById('medical_booking').submit();
                   }else if(val == 1){
                       document.getElementById('order_number').value = msg.result.response.order_number;
                       document.getElementById('issued').action = '/medical/booking/' + btoa(msg.result.response.order_number);
                       document.getElementById('issued').submit();
                   }
               }
            }else if(msg.result.error_code == 1011 || msg.result.error_code == 4014){

                   $('.hold-seat-booking-train').prop('disabled', false);
                   $('.hold-seat-booking-train').removeClass("running");
                   hide_modal_waiting_transaction();

                   Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: msg.result.error_msg,
                   }).then((result) => {
                        if (result.value) {
                            if(val == 0){
                                document.getElementById('medical_booking').innerHTML+= '<input type="hidden" name="order_number" value='+msg.result.response.order_number+'>';
                                document.getElementById('medical_booking').action = '/medical/booking/' + btoa(msg.result.response.order_number);
                                document.getElementById('medical_booking').submit();
                            }else if(val == 1){
                                document.getElementById('order_number').value = msg.result.response.order_number;
                                document.getElementById('issued').action = '/medical/booking/' + btoa(msg.result.response.order_number);
                                document.getElementById('issued').submit();
                            }
                        }
                   })
            }else{

               $('.hold-seat-booking-train').prop('disabled', false);
               $('.hold-seat-booking-train').removeClass("running");
               hide_modal_waiting_transaction();

               Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: msg.result.error_msg,
               })
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
                    medical_get_detail = msg;
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
                    medical_get_detail = msg;
                    $text = '';
                    $text += 'Order Number: '+ msg.result.response.order_number + '\n';
                    text = `
                        <div class="mb-3" style="padding:15px; background:white; border:1px solid #cdcdcd;">
                            <h6 class="carrier_code_template">Order Number : </h6><h6>`+msg.result.response.order_number+`</h6><br/>
                            <table style="width:100%;">
                                <tr>
                                    <th>Status</th>`;
                                    if(msg.result.response.state == 'booked')
                                        text+=`<th>Hold Date</th>`;
                                text+=`
                                    <th>Test Place</th>
                                </tr>`;
                                for(i in msg.result.response.provider_bookings){
                                    text+=`
                                        <tr>
                                            <td>`+msg.result.response.provider_bookings[i].state_description+`</td>`;

                                            if(msg.result.response.state == 'booked')
                                                text +=`
                                                    <td>`+msg.result.response.hold_date+`</td>`;
                                            text+=`
                                            <td>`+msg.result.response.test_address+`</td>
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

                   text+=`</div>
                   </div>
                   </div>`;
                    text += `
                    <div style="border:1px solid #cdcdcd; padding:10px; background-color:white; margin-top:20px;">
                        <h5> Contact Person</h5>
                        <hr/>
                        <table style="width:100%" id="list-of-passenger">
                            <tr>
                                <th style="width:10%;" class="list-of-passenger-left">No</th>
                                <th style="width:40%;">Name</th>
                                <th style="width:30%;">Email</th>
                                <th style="width:30%;">Phone</th>
                            </tr>`;
                            text+=`<tr>
                                <td class="list-of-passenger-left">`+(1)+`</td>
                                <td>`+msg.result.response.contact.title+` `+msg.result.response.contact.name+`</td>
                                <td>`+msg.result.response.contact.email+`</td>
                                <td>`+msg.result.response.contact.phone+`</td>
                            </tr>
                        </table>
                    </div>`;
                    print_provider = false;
                    for(i in msg.result.response.provider_bookings){
                        if(msg.result.response.provider_bookings[i].hasOwnProperty('tickets')){
                            for(j in msg.result.response.provider_bookings[i].tickets){
                                pax = {};
                                for(k in msg.result.response.passengers){
                                    if(msg.result.response.passengers[k].name == msg.result.response.provider_bookings[i].tickets[j].passenger){
                                        pax = msg.result.response.passengers[k];
                                        break;
                                    }
                                }
                                if(j == 0){
                                    //bikin table
                                    text += `
                                    <div class="mb-3" style="border:1px solid #cdcdcd; padding:10px; background-color:white; margin-top:20px;">
                                        <h5> List of Customer</h5>
                                        <hr/>
                                        <table style="width:100%" id="list-of-passenger">
                                            <tr>
                                                <th style="width:10%;" class="list-of-passenger-left">No</th>
                                                <th style="width:40%;">Name</th>
                                                <th style="width:30%;">Email</th>
                                                <th style="width:30%;">Phone Number</th>
                                                <th style="width:30%;">Ticket Number</th>
                                            </tr>`;
                                }
                                text+=`<tr>
                                                <td class="list-of-passenger-left">`+(1)+`</td>
                                                <td>`+pax.title+` `+pax.name+`</td>
                                                <td>`+pax.email+`</td>
                                                <td>`+pax.phone_number+`</td>
                                                <td>`+msg.result.response.provider_bookings[i].tickets[j].ticket_number+`</td>
                                            </tr>
                                        </table>
                                    </div>`;
                            }
                            print_provider = true
                        }
                    }
                    if(print_provider == false){
                        //periksain
                        for(i in msg.result.response.passengers){
                            if(i==0){
                                text += `
                                    <div class="mb-3" style="border:1px solid #cdcdcd; padding:10px; background-color:white; margin-top:20px;">
                                        <h5> List of Customer</h5>
                                        <hr/>
                                        <table style="width:100%" id="list-of-passenger">
                                            <tr>
                                                <th style="width:10%;" class="list-of-passenger-left">No</th>
                                                <th style="width:40%;">Name</th>
                                                <th style="width:30%;">Email</th>
                                                <th style="width:30%;">Phone Number</th>
                                            </tr>`;
                                }
                            text+=`<tr>
                                                <td class="list-of-passenger-left">`+(1)+`</td>
                                                <td>`+msg.result.response.passengers[i].title+` `+msg.result.response.passengers[i].name+`</td>
                                                <td>`+msg.result.response.passengers[i].email+`</td>
                                                <td>`+msg.result.response.passengers[i].phone_number+`</td>
                                            </tr>
                                        </table>
                                    </div>`;
                        }
                    }
                    document.getElementById('medical_booking').innerHTML = text;

                    //detail
                    text = '';
                    tax = 0;
                    fare = 0;
                    total_price = 0;
                    total_price_provider = [];
                    commission = 0;
                    csc = 0;
                    service_charge = ['FARE', 'RAC', 'ROC', 'TAX', 'SSR', 'DISC'];
                    text_detail=`
                    <div style="background-color:white; padding:10px; border: 1px solid #cdcdcd; margin-bottom:15px;">
                        <h5> Price Detail</h5>
                    <hr/>`;

                    //repricing
                    type_amount_repricing = ['Repricing'];
                    //repricing
                    counter_service_charge = 0;
                    price_arr_repricing = {};
                    pax_type_repricing = [];
                    disc = 0;

                    if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false || msg.result.response.state == 'issued')
                            text_detail+=`
                                <div style="text-align:left">
                                    <span style="font-weight:500; font-size:14px;">Order Number: `+msg.result.response.order_number+` </span>
                                </div>`;
                    for(i in msg.result.response.provider_bookings){
                    csc = 0;
                    try{


                        for(j in msg.result.response.passengers){
                            price = {'FARE': 0, 'RAC': 0, 'ROC': 0, 'TAX':0 , 'currency': '', 'CSC': 0, 'SSR': 0, 'DISC': 0,'SEAT':0};
                            for(k in msg.result.response.passengers[j].sale_service_charges[msg.result.response.provider_bookings[i].pnr]){
                                price[k] += msg.result.response.passengers[j].sale_service_charges[msg.result.response.provider_bookings[i].pnr][k].amount;
                                if(price['currency'] == '')
                                    price['currency'] = msg.result.response.passengers[j].sale_service_charges[msg.result.response.provider_bookings[i].pnr][k].currency;
                            }
                            disc -= price['DISC'];
                            try{
                                price['CSC'] = msg.result.response.passengers[j].channel_service_charges.amount;
                                csc += msg.result.response.passengers[j].channel_service_charges.amount;
                            }catch(err){}
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
                                    'Tax': price['TAX'] + price['ROC'],
                                    'Repricing': price['CSC']
                                }
                            }else{
                                price_arr_repricing[msg.result.response.passengers[j].name] = {
                                    'Fare': price_arr_repricing[msg.result.response.passengers[j].name]['Fare'] + price['FARE'] + price['DISC'] + price['SSR'] + price['SEAT'],
                                    'Tax': price_arr_repricing[msg.result.response.passengers[j].name]['Tax'] + price['TAX'] + price['ROC'],
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
                                    <span style="font-size:12px;">`+msg.result.response.passengers[j].name+`</span>`;
                                text_detail+=`</div>
                                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                    <span style="font-size:13px;">`+price.currency+` `+getrupiah(parseInt(price.FARE + price.TAX + price.ROC + price.SSR + price.SEAT))+`</span>
                                </div>
                            </div>`;
                            $text += msg.result.response.passengers[j].title +' '+ msg.result.response.passengers[j].name + ' ['+msg.result.response.provider_bookings[i].pnr+'] ';
                            journey_code = [];
                            for(k in msg.result.response.provider_bookings[i].journeys){
                                try{
                                    journey_code.push(msg.result.response.provider_bookings[i].journeys[k].journey_code)
                                }catch(err){}
                                for(l in msg.result.response.provider_bookings[i].journeys[k].segments){
                                    journey_code.push(msg.result.response.provider_bookings[i].journeys[k].segments[l].segment_code)
                                }
                            }
                            coma = false
                            for(k in msg.result.response.passengers[j].fees){
                                if(journey_code.indexOf(msg.result.response.passengers[j].fees[k].journey_code) == true){
                                    $text += msg.result.response.passengers[j].fees[k].fee_name;
                                    if(coma == true)
                                        $text += ', ';
                                    else
                                        $text += ' ';
                                    coma = true
                                }
                            }
                            $text += currency+` `+getrupiah(parseInt(price.FARE + price.SSR + price.SEAT + price.TAX + price.ROC + price.CSC + price.DISC))+'\n';
                            if(counter_service_charge == 0){
                                total_price += parseInt(price.TAX + price.ROC + price.FARE + price.SEAT + price.CSC + price.SSR + price.DISC);
                            }else{
                                total_price += parseInt(price.TAX + price.ROC + price.FARE + price.SSR + price.SEAT + price.DISC);
                            }
                            commission += parseInt(price.RAC);
                            total_price_provider.push({
                                'pnr': msg.result.response.provider_bookings[i].pnr,
                                'provider': msg.result.response.provider_bookings[i].provider,
                                'price': JSON.parse(JSON.stringify(price))
                            });
                        }
                        if(csc != 0){
                            text_detail+=`
                                <div class="row" style="margin-bottom:5px;">
                                    <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                        <span style="font-size:12px;">Other service charges</span>`;
                                    text_detail+=`</div>
                                    <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                        <span style="font-size:13px;">`+price.currency+` `+getrupiah(parseInt(csc))+`</span>
                                    </div>
                                </div>`;
                        }
                        counter_service_charge++;
                    }catch(err){console.log(err);}
                }
                try{
                    medical_get_detail.result.response.total_price = total_price;

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
                    text_detail+=`<div class="row">
                    <div class="col-lg-12" style="padding-bottom:10px;">
                        <hr/>`;
                        //<span style="font-size:14px; font-weight:bold;">Share This on:</span><br/>`;
                        /*share_data();
                        var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                        if (isMobile) {
                            text_detail+=`
                                <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png" alt="Whatsapp"/></a>
                                <a href="line://msg/text/`+ $text_share +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png" alt="Line"/></a>
                                <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png" alt="Telegram"/></a>
                                <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png" alt="Email"/></a>`;
                        } else {
                            text_detail+=`
                                <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png" alt="Whatsapp"/></a>
                                <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png" alt="Line"/></a>
                                <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png" alt="Telegram"/></a>
                                <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png" alt="Email"/></a>`;
                        }*/

                    text_detail+=`
                        </div>
                    </div>`;
                    if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false){
                        text_detail+=`
                        <div class="row" id="show_commission" style="display:none;">
                            <div class="col-lg-12 col-xs-12" style="text-align:center;">
                                <div class="alert alert-success">
                                    <div class="row">
                                        <div class="col-lg-6 col-xs-6" style="text-align:left;">
                                            <span style="font-size:13px; font-weight:bold;">Commission</span>
                                        </div>
                                        <div class="col-lg-6 col-xs-6" style="text-align:right;">
                                            <span style="font-size:13px; font-weight:bold;">`+price.currency+` `+getrupiah(parseInt(commission)*-1)+`</span>
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
                                    text_detail+=`
                                </div>
                            </div>
                        </div>`;
                    }
                    text_detail+=`<center>`;
//                    text_detail+=`
//                    <div style="padding-bottom:10px;">
//                        <center>
//                            <input type="button" class="primary-btn-white" style="width:100%;" onclick="copy_data();" value="Copy"/>
//                        </center>
//                    </div>`;
                    if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
                    text_detail+=`
                    <div style="margin-bottom:5px;">
                        <input class="primary-btn-white" id="show_commission_button" style="width:100%;" type="button" onclick="show_commission('commission');" value="Show Commission"/>
                    </div>
                </div>`;
                }catch(err){console.log(err);}
                console.log(text_detail);
                document.getElementById('medical_detail').innerHTML = text_detail;
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
                        document.getElementById('show_title_medical').hidden = true;
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
                    }
                    else if(msg.result.response.state == 'refund'){
                        $text = 'Refunded';
                        document.getElementById('issued-breadcrumb').classList.add("br-active");
                        document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-active");
                        document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-check"></i>`;
                        document.getElementById('issued-breadcrumb-span').innerHTML = `Refunded`;
                        document.getElementById('display_state').innerHTML = `Your Order Has Been Refunded`;
                    }


                    //======================= Option =========================


                    //======================= Extra Question =========================

                    //==================== Print Button =====================
                    var print_text = '<div class="col-lg-4" style="padding-bottom:10px;">';
                    // === Button 1 ===
                    if (msg.result.response.state  == 'issued') {
                        print_text+=`
                        <button class="primary-btn hold-seat-booking-train ld-ext-right" id="button-choose-print" type="button" onclick="get_printout('` + msg.result.response.order_number + `','ticket','medical');" style="width:100%;">
                            Print Ticket
                            <div class="ld ld-ring ld-cycle"></div>
                        </button>`;
                    }
                    print_text += '</div><div class="col-lg-4" style="padding-bottom:10px;">';
                    // === Button 2 ===
                    if (msg.result.response.state  == 'booked'){
                        print_text+=`
                        <button class="primary-btn hold-seat-booking-train ld-ext-right" id="button-print-print" type="button" onclick="get_printout('` + msg.result.response.order_number + `','itinerary','medical');" style="width:100%;">
                            Print Itinerary Form
                            <div class="ld ld-ring ld-cycle"></div>
                        </button>`;
                    }else{
                        print_text+=`
                        <button class="primary-btn hold-seat-booking-train ld-ext-right" type="button" id="button-print-print" onclick="get_printout('` + msg.result.response.order_number + `','ticket_price','medical');" style="width:100%;">
                            Print Ticket (With Price)
                            <div class="ld ld-ring ld-cycle"></div>
                        </button>`;
                    }
                    print_text += '</div><div class="col-lg-4" style="padding-bottom:10px;">';
                    // === Button 3 ===
                    if (msg.result.response.state  == 'issued') {
                        print_text+=`
                            <a class="issued-booking-train ld-ext-right" style="color:`+text_color+`;">
                                <input type="button" class="primary-btn" style="width:100%;" data-toggle="modal" data-target="#printInvoice" value="Print Invoice"/>
                                <div class="ld ld-ring ld-cycle"></div>
                            </a>`;
                            // modal invoice
                            print_text+=`
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
                                                    <button type="button" id="button-issued-print" class="primary-btn ld-ext-right" onclick="get_printout('`+msg.result.response.order_number+`', 'invoice','medical');">
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
                    print_text += '</div>';
                    document.getElementById('medical_btn_printout').innerHTML = print_text;

                    //======================= Other =========================
                    add_repricing();
                    console.log($text);
                }else{
                    //swal
                }
            }catch(err){
                console.log(err);
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error medical booking </span> Please try again in 1 - 5 minutes later or contact customer service' ,
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

function medical_issued_booking(data){
    var temp_data = {}
    if(typeof(medical_get_detail) !== 'undefined')
        temp_data = JSON.stringify(medical_get_detail)
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
           url: "/webservice/medical",
           headers:{
                'action': 'issued',
           },
           data: {
               'order_number': data,
               'seq_id': payment_acq2[payment_method][selected].seq_id,
               'member': payment_acq2[payment_method][selected].method,
               'voucher_code': voucher_code,
               'signature': signature,
               'booking': temp_data
           },
           success: function(msg) {
               console.log(msg);
               if(google_analytics != '')
                   gtag('event', 'medical_issued', {});
               if(msg.result.error_code == 0){
                   if(document.URL.split('/')[document.URL.split('/').length-1] == 'payment'){
                        window.location.href = '/medical/booking/' + btoa(data);
                   }else{
//                       //update ticket
                        document.getElementById('show_loading_booking_medical').hidden = false;
                        hide_modal_waiting_transaction();
                        document.getElementById('medical_booking').innerHTML = '';
                        document.getElementById('medical_detail').innerHTML = '';
                        document.getElementById('payment_acq').innerHTML = '';
                        //document.getElementById('voucher_div').style.display = 'none';
                        document.getElementById('payment_acq').hidden = true;
                        document.getElementById("overlay-div-box").style.display = "none";
                        $(".issued_booking_btn").hide(); //kalau error masih keluar button awal remove ivan
                       medical_get_booking(data);
                   }
               }else if(msg.result.error_code == 1009){
                   price_arr_repricing = {};
                   pax_type_repricing = [];
                   hide_modal_waiting_transaction();
                   document.getElementById('show_loading_booking_airline').hidden = false;
                   document.getElementById('airline_booking').innerHTML = '';
                   document.getElementById('airline_detail').innerHTML = '';
                   document.getElementById('payment_acq').innerHTML = '';
                   document.getElementById('voucher_div').style.display = 'none';
                   document.getElementById('ssr_request_after_sales').hidden = true;
                   document.getElementById('show_loading_booking_airline').style.display = 'block';
                   document.getElementById('show_loading_booking_airline').hidden = false;
                   document.getElementById('reissued').hidden = true;
                   document.getElementById('cancel').hidden = true;
                   document.getElementById('payment_acq').hidden = true;
                   document.getElementById("overlay-div-box").style.display = "none";
                   $(".issued_booking_btn").hide();
                   Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: #ff9900;">Error medical issued </span>' + msg.result.error_msg,
                    }).then((result) => {
                      if (result.value) {
                        hide_modal_waiting_transaction();
                      }
                    })
                    hide_modal_waiting_transaction();
                    document.getElementById("overlay-div-box").style.display = "none";

                    $('.hold-seat-booking-train').prop('disabled', false);
                    $('.hold-seat-booking-train').removeClass("running");
                    medical_get_booking(data);
               }else if(msg.result.error_code == 4006){
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: #ff9900;">Error medical issued </span>' + msg.result.error_msg,
                    }).then((result) => {
                      if (result.value) {
                        hide_modal_waiting_transaction();
                      }
                    })
                    hide_modal_waiting_transaction();
                    $('.btn-next').removeClass('running');
                    $('.btn-next').prop('disabled', false);
                    document.getElementById("overlay-div-box").style.display = "none";
                    //modal pop up

//                    booking_price_detail(msg);
                    tax = 0;
                    fare = 0;
                    total_price = 0;
                    commission = 0;
                    total_price_provider_show = [];
                    price_provider_show = 0;
                    service_charge = ['FARE', 'RAC', 'ROC', 'TAX'];
                    text=`
                        <div style="background-color:`+color+`; margin-top:20px;">
                            <center>
                                <span style="color:`+text_color+`; font-size:16px;">Old Price Detail <i class="fas fa-money-bill-wave"></i></span>
                            </center>
                        </div>
                        <div style="background-color:white; padding:15px; border: 1px solid `+color+`;">`;
                    for(i in medical_get_detail.result.response.passengers[0].sale_service_charges){
                        text+=`
                        <div style="text-align:center">
                            `+i+`
                        </div>`;
                        for(j in medical_get_detail.result.response.passengers){
                            price = {'FARE': 0, 'RAC': 0, 'ROC': 0, 'TAX':0 , 'currency': '', 'CSC': 0, 'SSR': 0, 'DISC': 0,'SEAT':0};
                            for(k in medical_get_detail.result.response.passengers[j].sale_service_charges[i]){
                                price[k] = medical_get_detail.result.response.passengers[j].sale_service_charges[i][k].amount;
                                if(price['currency'] == '')
                                    price['currency'] = medical_get_detail.result.response.passengers[j].sale_service_charges[i][k].currency;
                            }
                            try{
                                price['CSC'] = medical_get_detail.result.response.passengers[j].channel_service_charges.amount;
                            }catch(err){}

                            text+=`<div class="row" style="margin-bottom:5px;">
                                <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                    <span style="font-size:12px;">`+medical_get_detail.result.response.passengers[j].name+` Fare
                                </div>
                                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                    <span style="font-size:13px;">`+price.currency+` `+getrupiah(parseInt(price.FARE))+`</span>
                                </div>
                            </div>
                            <div class="row" style="margin-bottom:5px;">
                                <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                    <span style="font-size:12px;">`+medical_get_detail.result.response.passengers[j].name+` Tax
                                </div>
                                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                    <span style="font-size:13px;">IDR `+getrupiah(parseInt(price.TAX + price.ROC + price.CSC))+`</span>
                                </div>
                            </div>`;
                            if(price.SSR != 0 || price.SEAT != 0)
                                text+=`
                                <div class="row" style="margin-bottom:5px;">
                                    <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                        <span style="font-size:12px;">`+medical_get_detail.result.response.passengers[j].name+` Additional
                                    </div>
                                    <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                        <span style="font-size:13px;">IDR `+getrupiah(parseInt(price.SSR + price.SEAT))+`</span>
                                    </div>
                                </div>`;
                            if(price.DISC != 0)
                                text+=`
                                <div class="row" style="margin-bottom:5px;">
                                    <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                        <span style="font-size:12px;">`+medical_get_detail.result.response.passengers[j].name+` DISC
                                    </div>
                                    <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                        <span style="font-size:13px;">IDR -`+getrupiah(parseInt(price.DISC))+`</span>
                                    </div>
                                </div>`;

                            total_price += parseInt(price.TAX + price.ROC + price.FARE + price.SSR + price.SEAT - price.DISC);
                            price_provider_show += parseInt(price.TAX + price.ROC + price.FARE + price.SSR + price.SEAT - price.DISC);
                            commission += parseInt(price.RAC);
                        }
                        total_price_provider_show.push(price_provider_show);
                        price_provider_show = 0;
                    }
                    total_price_show = total_price;

                    text+=`
                    <div>
                        <hr/>
                    </div>
                    <div class="row" style="margin-bottom:10px;">
                        <div class="col-lg-6 col-xs-6" style="text-align:left;">
                            <span style="font-size:13px; font-weight: bold;">Grand Total</span>
                        </div>
                        <div class="col-lg-6 col-xs-6" style="text-align:right;">
                            <span style="font-size:13px; font-weight: bold;">`+price.currency+` `+getrupiah(total_price_show)+`</span>
                        </div>
                    </div>`;
                    if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
                    text+=`
                    <div class="row" id="show_commission_old" style="display:none;">
                        <div class="col-lg-12 col-xs-12" style="text-align:center;">
                            <div class="alert alert-success">
                                <span style="font-size:13px;">Your Commission: IDR `+getrupiah(parseInt(commission*-1))+`</span><br>
                            </div>
                        </div>
                    </div>`;
                    if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
                        text+=`<center><div style="margin-bottom:5px;"><input class="primary-btn-ticket" id="show_commission_button_old" style="width:100%;" type="button" onclick="show_commission('old');" value="Show Commission"/></div>`;
                    text+=`</div>`;
                    document.getElementById('old_price').innerHTML = text;

                    medical_get_detail = msg;
                    total_price = 0;
                    commission = 0;
                    //new price
                    text=`
                        <div style="background-color:`+color+`; margin-top:20px;">
                            <center>
                                <span style="color:`+text_color+`; font-size:16px;">New Price Detail <i class="fas fa-money-bill-wave"></i></span>
                            </center>
                        </div>
                        <div style="background-color:white; padding:15px; border: 1px solid `+color+`;">`;
                    total_price_provider_show = [];
                    price_provider_show = 0;
                    for(i in msg.result.response.passengers[0].sale_service_charges){
                        text+=`
                        <div style="text-align:center">
                            `+i+`
                        </div>`;
                        for(j in msg.result.response.passengers){
                            price = {'FARE': 0, 'RAC': 0, 'ROC': 0, 'TAX':0 , 'currency': '', 'CSC': 0, 'SSR': 0, 'DISC': 0,'SEAT':0};
                            for(k in msg.result.response.passengers[j].sale_service_charges[i]){
                                price[k] = msg.result.response.passengers[j].sale_service_charges[i][k].amount;
                                price['currency'] = msg.result.response.passengers[j].sale_service_charges[i][k].currency;
                            }

                            try{
                                price['CSC'] = airline_get_detail.result.response.passengers[j].channel_service_charges.amount;
                            }catch(err){}

                            text+=`<div class="row" style="margin-bottom:5px;">
                                <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                    <span style="font-size:12px;">`+msg.result.response.passengers[j].name+` Fare
                                </div>
                                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                    <span style="font-size:13px;">`+price.currency+` `+getrupiah(parseInt(price.FARE))+`</span>
                                </div>
                            </div>
                            <div class="row" style="margin-bottom:5px;">
                                <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                    <span style="font-size:12px;">`+msg.result.response.passengers[j].name+` Tax
                                </div>
                                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                    <span style="font-size:13px;">IDR `+getrupiah(parseInt(price.TAX + price.ROC + price.CSC))+`</span>
                                </div>
                            </div>`;
                            if(price.SSR != 0 || price.SEAT != 0)
                                text+=`
                                <div class="row" style="margin-bottom:5px;">
                                    <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                        <span style="font-size:12px;">`+airline_get_detail.result.response.passengers[j].name+` Additional
                                    </div>
                                    <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                        <span style="font-size:13px;">IDR `+getrupiah(parseInt(price.SSR + price.SEAT))+`</span>
                                    </div>
                                </div>`;
                            if(price.DISC != 0)
                                text+=`
                                <div class="row" style="margin-bottom:5px;">
                                    <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                        <span style="font-size:12px;">`+airline_get_detail.result.response.passengers[j].name+` DISC
                                    </div>
                                    <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                        <span style="font-size:13px;">IDR -`+getrupiah(parseInt(price.DISC))+`</span>
                                    </div>
                                </div>`;

                            total_price += parseInt(price.TAX + price.ROC + price.FARE + price.SSR + price.SEAT - price.DISC);
                            price_provider_show += parseInt(price.TAX + price.ROC + price.FARE + price.SSR + price.SEAT - price.DISC);
                            commission += parseInt(price.RAC);
                        }
                        total_price_provider_show.push(price_provider_show)
                        total_price_show = 0;
                    }
                    total_price_show = total_price;
                    text+=`
                    <div>
                        <hr/>
                    </div>
                    <div class="row" style="margin-bottom:10px;">
                        <div class="col-lg-6 col-xs-6" style="text-align:left;">
                            <span style="font-size:13px; font-weight: bold;">Grand Total</span>
                        </div>
                        <div class="col-lg-6 col-xs-6" style="text-align:right;">
                            <span style="font-size:13px; font-weight: bold;">`+price.currency+` `+getrupiah(total_price_show)+`</span>
                        </div>
                    </div>`;
                    if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
                    text+=`
                    <div class="row" id="show_commission_new" style="display:none;">
                        <div class="col-lg-12 col-xs-12" style="text-align:center;">
                            <div class="alert alert-success">
                                <span style="font-size:13px;">Your Commission: IDR `+getrupiah(parseInt(commission*-1))+`</span><br>
                            </div>
                        </div>
                    </div>`;
                    if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
                        text+=`<center><div style="margin-bottom:5px;"><input class="primary-btn-ticket" id="show_commission_button_new" style="width:100%;" type="button" onclick="show_commission('new');" value="Show Commission"/></div>`;
                    text+=`</div>`;
                    document.getElementById('new_price').innerHTML = text;

                   $("#myModal").modal();
               }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                    auto_logout();
                    $(".issued_booking_btn").hide();
               }else{
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: #ff9900;">Error airline issued </span>' + msg.result.error_msg,
                    })
                    price_arr_repricing = {};
                    pax_type_repricing = [];
                    document.getElementById('show_loading_booking_airline').hidden = false;
                    document.getElementById('airline_booking').innerHTML = '';
                    document.getElementById('airline_detail').innerHTML = '';
                    document.getElementById('payment_acq').innerHTML = '';
                    document.getElementById('show_loading_booking_airline').style.display = 'block';
                    document.getElementById('show_loading_booking_airline').hidden = false;
                    document.getElementById('payment_acq').hidden = true;
                    document.getElementById('reissued').hidden = true;
                    document.getElementById('cancel').hidden = true;
                    hide_modal_waiting_transaction();
                    document.getElementById("overlay-div-box").style.display = "none";

                    $('.hold-seat-booking-train').prop('disabled', false);
                    $('.hold-seat-booking-train').removeClass("running");
                    medical_get_booking(data);
                    $(".issued_booking_btn").hide();
               }
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error airline issued');
                price_arr_repricing = {};
                pax_type_repricing = [];
                document.getElementById('show_loading_booking_airline').hidden = false;
                document.getElementById('airline_booking').innerHTML = '';
                document.getElementById('airline_detail').innerHTML = '';
                document.getElementById('payment_acq').innerHTML = '';
                document.getElementById('voucher_div').style.display = 'none';
                document.getElementById('ssr_request_after_sales').hidden = true;
                document.getElementById('show_loading_booking_airline').style.display = 'block';
                document.getElementById('show_loading_booking_airline').hidden = false;
                document.getElementById('reissued').hidden = true;
                document.getElementById('cancel').hidden = true;
                document.getElementById('payment_acq').hidden = true;
                hide_modal_waiting_transaction();
                document.getElementById("overlay-div-box").style.display = "none";
                $('.hold-seat-booking-train').prop('disabled', false);
                $('.hold-seat-booking-train').removeClass("running");
                $(".issued_booking_btn").hide();
                medical_get_booking(data);
           },timeout: 300000
        });
      }
    })
}