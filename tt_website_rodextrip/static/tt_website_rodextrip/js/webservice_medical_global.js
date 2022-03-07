function medical_global_signin(data){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/medical_global",
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
                    get_config_medical_global(data, vendor);
                    medical_global_get_availability();
               }else{
                    //get booking
                    get_config_medical_global('get_booking');
                    medical_global_get_booking(data);
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
                $("#show_loading_booking_medical").hide();
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
            $("#show_loading_booking_medical").hide();
          }catch(err){
            console.log(err); // error kalau ada element yg tidak ada
          }
       },timeout: 60000
    });

}

function medical_global_page_passenger(){
    $.ajax({
       type: "POST",
       url: "/webservice/medical",
       headers:{
            'action': 'page_passenger',
       },
       data: {
            'signature': signature,
       },
       success: function(msg) {
            console.log(msg);
            titles = msg.titles;
            countries = msg.countries;
            get_list_report_footer();
            medical_global_signin('passenger');
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get data medical');
       },timeout: 300000
    });
}

function medical_global_page_review(){
    $.ajax({
       type: "POST",
       url: "/webservice/medical_global",
       headers:{
            'action': 'page_review',
       },
       data: {
            'signature': signature,
       },
       success: function(msg) {
            console.log(msg);
            passengers = msg.passenger;
            medical_global_get_cache_price();
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get data medical');
       },timeout: 300000
    });
}

function get_config_medical_global(type){
    $.ajax({
       type: "POST",
       url: "/webservice/medical_global",
       headers:{
            'action': 'get_config',
       },
       data: {
            'signature': signature,
       },
       success: function(msg) {
            console.log(msg);
            if(msg.result.error_code == 0){
                medical_config = msg;
                if(type == 'home'){
                    var text = '';
                    for(i in msg.result.response){
                        text += '<option value="'+msg.result.response[i].code+'">' + msg.result.response[i].name + '</option>';
                    }
                    document.getElementById('medical_type_medical').innerHTML += text;
                    $('#medical_type_medical').niceSelect('update');
                }else if(type == 'passenger'){
                    print_check_price++;
                    if(print_check_price == 2){
                        document.getElementById('check_price_medical').hidden = false;
                        document.getElementById('div_schedule_medical').style.display = 'block';
                    }
                    var product = '';

                    for(i in medical_config.result.response){
                        if(medical_config.result.response[i].code == test_type){
                            product = medical_config.result.response[i].name;
                            break;
                        }
                    }
                    document.getElementById('medical_product').innerHTML = product;
                    document.getElementById('copy_booker_to_pax_div').hidden = false;
//                    try{
//                    document.getElementById('medical_pax_div').hidden = false;
//                    }catch(err){}
                    add_table(true);
                    try{
                        $("#show_loading_booking_medical").hide();
                    }catch(err){
                        console.log(err); // error kalau ada element yg tidak ada
                    }
                }else if(type == 'review'){
                    for(i in medical_config.result.response){
                        if(medical_config.result.response[i].code == test_type){
                            $text = medical_config.result.response[i].name + '\n\n' + $text;
                            document.getElementById('test_type_text').innerHTML = `<h4>`+medical_config.result.response[i].name+`</h4>`;
                            break;
                        }
                    }
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
                $("#show_loading_booking_medical").hide();
               }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
               }
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get config medical');
       },timeout: 300000
    });
}

function get_zip_code(){
    $.ajax({
       type: "POST",
       url: "/webservice/medical",
       headers:{
            'action': 'get_zip_code',
       },
       data: {
            'signature': signature,
       },
       success: function(msg) {
            console.log(msg);
            if(msg.result.error_code == 0){
                zip_code_list = msg;
            }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
            }else{
               Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: msg.result.error_msg,
               })
               try{
                $("#show_loading_booking_medical").hide();
               }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
               }
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get config medical');
       },timeout: 300000
    });
}

function get_kabupaten(id_provinsi, id_kabupaten){
    var text = '';
    if(document.getElementById(id_provinsi).value != '' && document.getElementById(id_provinsi).value != 'Select Provinsi' && document.getElementById(id_provinsi).value != 'Select Provinsi KTP' && document.getElementById(id_provinsi).value != 'Choose'){
        text += '<option value="">Choose</option>';
        for(i in data_kota[document.getElementById(id_provinsi).value]['kabupaten']){
            text += '<option value="'+i+'">'+data_kota[document.getElementById(id_provinsi).value]['kabupaten'][i].name+"</option>";
        }

    }else{
        if(id_provinsi.includes('ktp'))
            text += '<option value="">Choose Kabupaten KTP</option>';
        else
            text += '<option value="">Choose Kabupaten</option>';
    }
    document.getElementById(id_kabupaten).innerHTML = text;
    $('#'+id_kabupaten).select2();

    text = `<option value="">Select Kecamatan</option>`;
    document.getElementById(id_kabupaten.replace('kabupaten','kecamatan')).innerHTML = text;

    $('#'+id_provinsi.replace('provinsi','kecamatan')).select2();

    text = `<option value="">Select Kelurahan</option>`;
    document.getElementById(id_kabupaten.replace('kabupaten','kelurahan')).innerHTML = text;

    $('#'+id_provinsi.replace('provinsi','kelurahan')).select2();
    if(vendor == 'periksain')
        $('#'+id_provinsi).select2();
}

function get_kecamatan(id_kabupaten,id_kecamatan){
    var text = '';
    if(document.getElementById(id_kabupaten).value != '' && document.getElementById(id_kabupaten).value != 'Select Kabupaten' && document.getElementById(id_kabupaten).value != 'Select Kabupaten KTP' && document.getElementById(id_kabupaten).value != 'Choose'){
        text += '<option value="">Choose</option>';
        if(vendor == 'phc'){
            for(i in data_kota[document.getElementById(id_kabupaten).value]){
                text += '<option value="'+i+'">'+i+"</option>";
            }
        }else if(vendor == 'periksain'){
            for(i in data_kota[document.getElementById(id_kabupaten.replace('kabupaten','provinsi')).value]['kabupaten'][document.getElementById(id_kabupaten).value]['kecamatan']){
                text += '<option value="'+i+'">'+data_kota[document.getElementById(id_kabupaten.replace('kabupaten','provinsi')).value]['kabupaten'][document.getElementById(id_kabupaten).value]['kecamatan'][i].name+"</option>";
            }
        }
    }else{
        if(id_kecamatan.includes('ktp'))
            text += '<option value="">Choose Kecamatan KTP</option>';
        else
            text += '<option value="">Choose Kecamatan</option>';
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

    if(vendor == 'periksain')
        $('#'+id_kabupaten).select2();
}

function get_kelurahan(id_kecamatan,id_kelurahan){
    var text = '';
    if(document.getElementById(id_kecamatan).value != '' && document.getElementById(id_kecamatan).value != 'Select Kecamatan' && document.getElementById(id_kecamatan).value != 'Select Kecamatan KTP' && document.getElementById(id_kecamatan).value != 'Choose'){
        text += '<option value="">Choose</option>';
        if(vendor == 'phc'){
            for(i in data_kota[document.getElementById(id_kecamatan.replace('kecamatan','kabupaten')).value][document.getElementById(id_kecamatan).value]){
                text += '<option value="'+data_kota[document.getElementById(id_kecamatan.replace('kecamatan','kabupaten')).value][document.getElementById(id_kecamatan).value][i]+'">'+data_kota[document.getElementById(id_kecamatan.replace('kecamatan','kabupaten')).value][document.getElementById(id_kecamatan).value][i]+"</option>";
            }
        }else if(vendor == 'periksain'){
            for(i in data_kota[document.getElementById(id_kecamatan.replace('kecamatan','provinsi')).value]['kabupaten'][document.getElementById(id_kecamatan.replace('kecamatan','kabupaten')).value]['kecamatan'][document.getElementById(id_kecamatan).value]['kelurahan']){
                text += '<option value="'+i+'">'+data_kota[document.getElementById(id_kecamatan.replace('kecamatan','provinsi')).value]['kabupaten'][document.getElementById(id_kecamatan.replace('kecamatan','kabupaten')).value]['kecamatan'][document.getElementById(id_kecamatan).value]['kelurahan'][i].name+"</option>";
            }
        }
    }else{
        if(id_kecamatan.includes('ktp'))
            text += '<option value="">Choose Kelurahan KTP</option>';
        else
            text += '<option value="">Choose Kelurahan</option>';
    }
    document.getElementById(id_kelurahan).innerHTML = text;
    $('#'+id_kelurahan).select2();
    if(vendor == 'periksain')
        $('#'+id_kecamatan).select2();
}

function medical_global_get_availability(){
    test_date_data = [];
    test_kuota = [];
    $.ajax({
       type: "POST",
       url: "/webservice/medical_global",
       headers:{
            'action': 'get_availability',
       },
       data: {
            'signature': signature,
            'provider': vendor,
            'carrier_code': test_type
       },
       success: function(msg) {
            console.log(msg);
            if(msg.result.error_code == 0){
                print_check_price++;
                if(print_check_price == 2){
                    document.getElementById('check_price_medical').hidden = false;
                    document.getElementById('div_schedule_medical').style.display = 'block';
                }
                msg = msg.result.response;
                if(Object.keys(msg).length > 0){
                    test_kuota = msg;
                    for(i in msg){
                        for(j in msg[i].timeslots){
                            test_date_data.push(j);
                            for(k in msg[i].timeslots[j]){
                                tes = moment.utc(j + ' '+ msg[i].timeslots[j][k].time).format('YYYY-MM-DD HH:mm:ss')
                                localTime  = moment.utc(tes).toDate();
                                msg[i].timeslots[j][k].time = moment(localTime).format('HH:mm');
                                if(msg[i].timeslots[j][k].hasOwnProperty('time_end')){
                                    tes = moment.utc(j + ' '+ msg[i].timeslots[j][k].time_end).format('YYYY-MM-DD HH:mm:ss')
                                    localTime  = moment.utc(tes).toDate();
                                    msg[i].timeslots[j][k].time_end = moment(localTime).format('HH:mm');
                                }
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
                    change_area();
                }else{
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: 'Timeslot not available please contact administrator!',
                    }).then((result) => {
                      //redirect ke phc
                    })
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
                $("#show_loading_booking_medical").hide();
               }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
               }
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get availability medical');
       },timeout: 300000
    });
}

function medical_global_check_price(){
    var timeslot_list = [];
    document.getElementById('check_price_medical').disabled = true;

    var now = moment();
    var test_list_counter = 1;
    var add_list = true;
    var error_log = '';

    for(i=1;i <= test_time; i++){
        try{
            if(document.getElementById('booker_timeslot_id'+i).value != '')
                timeslot_list.push(document.getElementById('booker_timeslot_id'+i).value.split('~')[0])
        }catch(err){
            console.log(err); // error kalau ada element yg tidak ada drive thru tidak harus pilih timeslot
        }
    }
    for(i=1; i <= test_time; i++){
        try{
            add_list = true;
            if(vendor == 'periksain'){
                if(now.format('DD MMM YYYY') == document.getElementById('booker_test_date'+i).value){
                    if(new Date() > new Date(document.getElementById('booker_test_date'+i).value+' '+document.getElementById('booker_timeslot_id'+i).value.split('~')[1])){
                        add_list = false;
                        error_log += 'Test time reservation already pass please change test time ' + test_list_counter + '!</br>\n';
                    }
                }
            }else{
                if(now.format('DD MMM YYYY') == document.getElementById('booker_test_date'+i).value){
                    if(new Date() > new Date(document.getElementById('booker_test_date'+i).value+' '+document.getElementById('booker_timeslot_id'+i).value.split('~')[1])){
                        add_list = false;
                        error_log += 'Test time reservation already pass please change test time ' + test_list_counter + '!</br>\n';
                    }
                }
            }
            test_list_counter++;
        }catch(err){

        }
    }
    if(timeslot_list.length != 0 && error_log == '' || test_type.includes('DT')){
        $.ajax({
           type: "POST",
           url: "/webservice/medical_global",
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
                    if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
                        document.getElementById('use_booker').style.display = 'block';
                    var text = `
                    <div style="background-color:white; margin-bottom:15px;">
                        <h4 style="color:`+color+`;"> Price Detail</h4>`;
//                    for(i in msg.result.response.service_charges){
//                        if(msg.result.response.service_charges[i].charge_code != 'rac'){
//                            if(msg.result.response.service_charges[i].charge_code == 'fare')
//                                charge_code = 'FARE';
//                            else if(msg.result.response.service_charges[i].charge_code == 'adm')
//                                charge_code = 'Admin Fee Drive Thru';
//                            text+=`
//                            <div class="row" style="margin-bottom:5px;">
//                                <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
//                                    <span style="font-size:12px;">`+msg.result.response.service_charges[i].pax_count+`x `+charge_code+` @IDR `+getrupiah(msg.result.response.service_charges[i].amount)+`</span>`;
//                        text+=`</div>
//                                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
//                                    <b><span style="font-size:13px;">IDR `+getrupiah(msg.result.response.service_charges[i].total)+`</span></b>
//                                </div>
//                            </div>`;
//                        }
//                    }
                    price_list = {
                        "fare": {
                            "amount":0,
                            "currency":'',
                            "pax_count":0,
                        }, "adm": {
                            "amount":0,
                            "currency":'',
                            "pax_count":0,
                        }
                    };
                    for(i in msg.result.response.service_charges){
                        if(msg.result.response.service_charges[i].charge_type != 'RAC'){
                            price_list['fare']['amount'] += msg.result.response.service_charges[i].amount;
                            price_list['fare']['pax_count'] = msg.result.response.service_charges[i].pax_count;
                            price_list['fare']['currency'] = msg.result.response.service_charges[i].currency;
                        }
                    }

                    text+=`
                            <div class="row" style="margin-bottom:5px;">
                                <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                    <span style="font-size:12px;">`+price_list['fare']['pax_count']+`x Fare @IDR `+getrupiah(price_list['fare']['amount'])+`</span>`;
                        text+=`</div>
                                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                    <b><span style="font-size:13px;">IDR `+getrupiah(price_list['fare']['amount']*price_list['fare']['pax_count'])+`</span></b>
                                </div>
                            </div>`;
                    text+=`
                            <div class="row" style="margin-bottom:5px;">
                                <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                    <span style="font-size:12px;">Grand Total</span>`;
                                text+=`</div>
                                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                    <b><span style="font-size:13px;">IDR `+getrupiah(msg.result.response.total_price)+`</span></b>
                                </div>
                            </div>`;
                    if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
                        text+=`
                            <div class="col-lg-12" style="text-align:center; display:none;" id="show_commission">
                                <div class="alert alert-success">
                                    <span style="font-size:13px; font-weight: bold;">Your Commission: IDR `+getrupiah(msg.result.response.total_commission)+`</span><br>
                                </div>
                            </div>`;
                    if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
                        text+=`
                            <input class="primary-btn-white" id="show_commission_button" style="width:100%;" type="button" onclick="show_commission('commission');" value="Show Commission"><br/>`;
                    text += `</div>`;

                    if(msg.result.response.extra_cost == true){
                        text += `
                            <label style="color:red !important;">* </label>
                            <label>Extra Cost</label>
                            <br/>`;
                        if(vendor == 'periksain'){
                            text+=`
                                <label style="margin-left:5px;">- 5 hours before test</label>
                                <br/>`;
                            text+=`
                                <label style="margin-left:5px;">- After 19:00 WIB</label>
                                <br/>`;
                        }
                        text+=`
                            <label style="margin-left:5px;">- Only 1 customer</label>`;
                    }

                    document.getElementById('medical_detail').innerHTML = text;
                    document.getElementById('medical_detail').style.display = 'block';
                    document.getElementById('next_medical').style.display = 'block';

                    try{
                        document.getElementById('medical_pax_div').hidden = false;
                    }catch(err){
                        console.log(err); // error kalau ada element yg tidak ada
                    }
                    $('html, body').animate({
                        scrollTop: $("#medical_detail").offset().top - 120
                    }, 500);


                    //print harga
                }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                    auto_logout();
                }else{
                   Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: msg.result.error_msg,
                   })
                   try{
                    $("#show_loading_booking_medical").hide();
                   }catch(err){
                    console.log(err); // error kalau ada element yg tidak ada
                   }
                }
                }catch(err){console.log(err);}
                document.getElementById('check_price_medical').disabled = false;
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get price medical');
                document.getElementById('check_price_medical').disabled = false; //disable false jika timeout atau apapun yg masuk catch
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

function medical_global_get_cache_price(){
    $.ajax({
       type: "POST",
       url: "/webservice/medical_global",
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
                <div style="background-color:white; padding:10px; margin-bottom:15px;">
                    <h5> Price Detail</h5>
                <hr/>`;
//                for(i in msg.result.response.service_charges){
//                    if(msg.result.response.service_charges[i].charge_code != 'rac'){
//                        if(msg.result.response.service_charges[i].charge_code == 'fare')
//                            charge_code = 'FARE';
//                        else if(msg.result.response.service_charges[i].charge_code == 'adm')
//                            charge_code = 'Admin Fee Drive Thru';
//                        text+=`
//                        <div class="row" style="margin-bottom:5px;">
//                            <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
//                                <span style="font-size:12px;">`+msg.result.response.service_charges[i].pax_count+`x `+charge_code+` @IDR `+getrupiah(msg.result.response.service_charges[i].amount)+`</span>`;
//                    text+=`</div>
//                            <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
//                                <b><span style="font-size:13px;">IDR `+getrupiah(msg.result.response.service_charges[i].total)+`</span></b>
//                            </div>
//                        </div>`;
//                    }
//                }

                price_list = {
                    "fare": {
                        "amount":0,
                        "currency":'',
                        "pax_count":0,
                    }, "adm": {
                        "amount":0,
                        "currency":'',
                        "pax_count":0,
                    }
                };
                for(i in msg.result.response.service_charges){
                    if(msg.result.response.service_charges[i].charge_type != 'RAC'){
                        price_list['fare']['amount'] += msg.result.response.service_charges[i].amount;
                        price_list['fare']['pax_count'] = msg.result.response.service_charges[i].pax_count;
                        price_list['fare']['currency'] = msg.result.response.service_charges[i].currency;
                    }
                }

                text+=`
                        <div class="row" style="margin-bottom:5px;">
                            <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                <span style="font-size:12px;">`+price_list['fare']['pax_count']+`x Fare @`+price_list['fare']['currency']+` `+getrupiah(price_list['fare']['amount'])+`</span>`;
                    text+=`</div>
                            <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                <b><span style="font-size:13px;">IDR `+getrupiah(price_list['fare']['pax_count'] * price_list['fare']['amount'])+`</span></b>
                            </div>
                        </div>`;

                text+=`
                    <div class="row" style="margin-bottom:5px;">
                        <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                            <span style="font-size:12px;">Grand Total</span>`;
                        text+=`</div>
                        <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                            <b><span style="font-size:13px;">IDR `+getrupiah(msg.result.response.total_price)+`</span></b>
                        </div>
                    </div>`;
                if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
                    text+=`
                        <div class="col-lg-12" style="text-align:center; display:none;padding-bottom:10px;" id="show_commission">
                            <div class="alert alert-success">
                                <span style="font-size:13px; font-weight: bold;">Your Commission: IDR `+getrupiah(msg.result.response.total_commission)+`</span><br>
                            </div>
                        </div>`;
                if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
                    text+=`
                        <input class="primary-btn-white" id="show_commission_button" style="width:100%;margin-bottom:10px;" type="button" onclick="show_commission('commission');" value="Show Commission"><br/>`;
                text+=`
                    <div>
                        <center>
                            <input type="button" class="primary-btn-white" style="width:100%;" onclick="copy_data();" value="Copy"/>
                        </center>
                    </div>`;
                document.getElementById('medical_detail').innerHTML = text;
                document.getElementById('medical_detail').style.display = 'block';
                $text += 'Price:\n';
                $text += msg.result.response.service_charges[0].pax_count+`x Fare @IDR `+getrupiah(msg.result.response.service_charges[0].amount) + `\n`;
                $text += 'Grand Total: IDR' + getrupiah(msg.result.response.total_price)


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
            else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
            }else{
               Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: msg.result.error_msg,
               })
               try{
                $("#show_loading_booking_medical").hide();
               }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
               }
            }
            }catch(err){console.log(err);}
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get price medical');
       },timeout: 300000
    });
}

function pre_medical_global_commit_booking(val){
    if(val == 0){
        medical_global_commit_booking(val);
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
                    document.getElementById("type").value = 'medical_global_review';
                    document.getElementById("voucher_code").value = voucher_code;
                    document.getElementById("discount").value = JSON.stringify(discount_voucher);
                    //document.getElementById("session_time_input").value = 300;
                    document.getElementById('medical_issued').submit();
                }catch(err){
                    console.log(err)
                }
            }
        })

    }
}

function confirm_order(){
    $('#loading-search-reservation').show();
    $.ajax({
       type: "POST",
       url: "/webservice/medical_global",
       headers:{
            'action': 'confirm_order',
       },
       data: {
           'order_number': order_number,
           'signature': signature,
       },
       success: function(msg) {
           console.log(msg);
           if(msg.result.error_code == 0){
                //update ticket
                document.getElementById('show_loading_booking_medical').hidden = false;
                hide_modal_waiting_transaction();
                document.getElementById('medical_booking').innerHTML = '';
                document.getElementById('medical_detail').innerHTML = '';
                document.getElementById('payment_acq').innerHTML = '';
                //document.getElementById('voucher_div').style.display = 'none';
                document.getElementById('payment_acq').hidden = true;
                document.getElementById('div_sync_status').hidden = true;
                document.getElementById('button-print-print').hidden = true;

                document.getElementById("overlay-div-box").style.display = "none";
                $(".issued_booking_btn").hide(); //kalau error masih keluar button awal remove ivan
                medical_global_get_booking(order_number);
           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
           }else{
                //update ticket
                document.getElementById('show_loading_booking_medical').hidden = false;
                hide_modal_waiting_transaction();
                try{
                    document.getElementById('medical_booking').innerHTML = '';
                    document.getElementById('medical_detail').innerHTML = '';
                    document.getElementById('payment_acq').innerHTML = '';
                    //document.getElementById('voucher_div').style.display = 'none';
                    document.getElementById('payment_acq').hidden = true;
                    document.getElementById('div_sync_status').hidden = true;
                    document.getElementById('button-print-print').hidden = true;
                }catch(err){
                    console.log(err); // error kalau ada element yg tidak ada
                };

                document.getElementById("overlay-div-box").style.display = "none";
                $(".issued_booking_btn").hide(); //kalau error masih keluar button awal remove ivan
                medical_global_get_booking(order_number);
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error medical confirm order </span>' + msg.result.error_msg,
                })
           }
           $('#loading-search-reservation').hide();
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            hide_modal_waiting_transaction();
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get price medical');
       },timeout: 300000
    });
}

function medical_global_commit_booking(val){
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
        data['acquirer_seq_id'] = payment_acq2[payment_method][selected].acquirer_seq_id;
        data['member'] = payment_acq2[payment_method][selected].method;
    }catch(err){
    }
    try{
        data['voucher_code'] = voucher_code;
    }catch(err){
        console.log(err); // error kalau ada element yg tidak ada
    }
    $.ajax({
       type: "POST",
       url: "/webservice/medical_global",
       headers:{
            'action': 'commit_booking',
       },
       data: data,
       success: function(msg) {
            console.log(msg);
            if(msg.result.error_code == 0){
                if(user_login.co_agent_frontend_security.includes('b2c_limitation') == true){
                    Swal.fire({
                      title: 'Success',
                      type: 'success',
                      showCancelButton: true,
                      confirmButtonColor: '#3085d6',
                      cancelButtonColor: 'blue',
                      confirmButtonText: 'Payment',
                      cancelButtonText: 'View Booking'
                    }).then((result) => {
                      if (result.value) {
                        $('.hold-seat-booking-train').addClass("running");
                        $('.hold-seat-booking-train').attr("disabled", true);
                        please_wait_transaction();
                        send_url_booking('medical', btoa(msg.result.response.order_number), msg.result.response.order_number);
                        document.getElementById('order_number').value = msg.result.response.order_number;
                        document.getElementById("passengers").value = JSON.stringify(passengers);
                        document.getElementById("signature").value = signature;
                        document.getElementById("provider").value = 'medical';
                        document.getElementById("type").value = 'medical_global_review';
                        document.getElementById("voucher_code").value = voucher_code;
                        document.getElementById("discount").value = JSON.stringify(discount_voucher);
                        document.getElementById("session_time_input").value = 1200;
                        document.getElementById('medical_issued').submit();

                      }else{
                        document.getElementById('medical_booking').innerHTML+= '<input type="hidden" name="order_number" value='+msg.result.response.order_number+'>';
                        document.getElementById('medical_booking').action = '/medical_global/booking/' + btoa(msg.result.response.order_number);
                        document.getElementById('medical_booking').submit();
                      }
                    })
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

//                       document.getElementById('medical_booking').innerHTML+= '<input type="hidden" name="order_number" value='+msg.result.response.order_number+'>';
//                       document.getElementById('medical_booking').action = '/medical/booking/' + btoa(msg.result.response.order_number);
//                       document.getElementById('medical_booking').submit();
               }else{
                    Swal.fire({
                      title: 'Success',
                      type: 'success',
                      showCancelButton: true,
                      confirmButtonColor: '#3085d6',
                      cancelButtonColor: 'blue',
                      confirmButtonText: 'Payment',
                      cancelButtonText: 'View Booking'
                    }).then((result) => {
                      if (result.value) {
                        $('.hold-seat-booking-train').addClass("running");
                        $('.hold-seat-booking-train').attr("disabled", true);
                        please_wait_transaction();
                        send_url_booking('medical', btoa(msg.result.response.order_number), msg.result.response.order_number);
                        document.getElementById('order_number').value = msg.result.response.order_number;
                        document.getElementById("passengers").value = JSON.stringify(passengers);
                        document.getElementById("signature").value = signature;
                        document.getElementById("provider").value = 'medical';
                        document.getElementById("type").value = 'medical_global_review';
                        document.getElementById("voucher_code").value = voucher_code;
                        document.getElementById("discount").value = JSON.stringify(discount_voucher);
                        document.getElementById("session_time_input").value = 1200;
                        document.getElementById('medical_issued').submit();

                      }else{
                        document.getElementById('medical_booking').innerHTML+= '<input type="hidden" name="order_number" value='+msg.result.response.order_number+'>';
                        document.getElementById('medical_booking').action = '/medical_global/booking/' + btoa(msg.result.response.order_number);
                        document.getElementById('medical_booking').submit();
                      }
                    })
//                   if(val == 0){
//                       document.getElementById('medical_booking').innerHTML+= '<input type="hidden" name="order_number" value='+msg.result.response.order_number+'>';
//                       document.getElementById('medical_booking').action = '/medical/booking/' + btoa(msg.result.response.order_number);
//                       document.getElementById('medical_booking').submit();
//                   }else if(val == 1){
//                       document.getElementById('order_number').value = msg.result.response.order_number;
//                       document.getElementById('issued').action = '/medical/booking/' + btoa(msg.result.response.order_number);
//                       document.getElementById('issued').submit();
//                   }
               }
            }else if(msg.result.error_code == 1011 || msg.result.error_code == 4014){

                   $('.hold-seat-booking-train').prop('disabled', false);
                   $('.hold-seat-booking-train').removeClass("running");
                   hide_modal_waiting_transaction();
                   Swal.fire({
                      title: msg.result.error_msg,
                      type: 'success',
                      showCancelButton: true,
                      confirmButtonColor: '#3085d6',
                      cancelButtonColor: 'blue',
                      confirmButtonText: 'Payment',
                      cancelButtonText: 'View Booking'
                   }).then((result) => {
                      if (result.value) {
                        $('.hold-seat-booking-train').addClass("running");
                        $('.hold-seat-booking-train').attr("disabled", true);
                        please_wait_transaction();
                        send_url_booking('medical', btoa(msg.result.response.order_number), msg.result.response.order_number);
                        document.getElementById('order_number').value = msg.result.response.order_number;
                        document.getElementById("passengers").value = JSON.stringify(passengers);
                        document.getElementById("signature").value = signature;
                        document.getElementById("provider").value = 'medical';
                        document.getElementById("type").value = 'medical_global_review';
                        document.getElementById("voucher_code").value = voucher_code;
                        document.getElementById("discount").value = JSON.stringify(discount_voucher);
                        document.getElementById("session_time_input").value = 200;
                        document.getElementById('medical_issued').submit();

                      }else{
                        document.getElementById('medical_booking').innerHTML+= '<input type="hidden" name="order_number" value='+msg.result.response.order_number+'>';
                        document.getElementById('medical_booking').action = '/medical/booking/' + btoa(msg.result.response.order_number);
                        document.getElementById('medical_booking').submit();
                      }
                   })
//                   Swal.fire({
//                      type: 'error',
//                      title: 'Oops!',
//                      html: msg.result.error_msg,
//                   }).then((result) => {
//                        if (result.value) {
//                            if(val == 0){
//                                document.getElementById('medical_booking').innerHTML+= '<input type="hidden" name="order_number" value='+msg.result.response.order_number+'>';
//                                document.getElementById('medical_booking').action = '/medical/booking/' + btoa(msg.result.response.order_number);
//                                document.getElementById('medical_booking').submit();
//                            }else if(val == 1){
//                                document.getElementById('order_number').value = msg.result.response.order_number;
//                                document.getElementById('issued').action = '/medical/booking/' + btoa(msg.result.response.order_number);
//                                document.getElementById('issued').submit();
//                            }
//                        }
//                   })
            }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
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

function goto_edit_passenger(){
    if(medical_get_detail.result.response.state == 'booked'){
        document.getElementById('data').value = JSON.stringify(medical_get_detail);
        document.getElementById('medical_edit_passenger').action += medical_get_detail.result.response.order_number;
        document.getElementById('medical_edit_passenger').submit();
    }
}

function medical_global_get_booking(order_number, sync=false){
    document.getElementById('payment_acq').hidden = true;
    price_arr_repricing = {};
    get_vendor_balance('false');
    try{
        show_loading();
    }catch(err){
        console.log(err); // error kalau ada element yg tidak ada
    }
    try{
        close_div('payment_acq');
    }catch(err){
        console.log(err); // error kalau ada element yg tidak ada
    }
    $.ajax({
       type: "POST",
       url: "/webservice/medical_global",
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
                hide_modal_waiting_transaction();

                //======================= Resv =========================
                if(msg.result.error_code == 0){
                    if(window.location.pathname.includes('confirm_order') && user_login.co_agent_frontend_security.includes('confirm_order_medical') == false){
                        window.location.href = '/medical_global/confirm_order/';
                        Swal.fire({
                          type: 'error',
                          title: 'Oops!',
                          html: 'Permission Denied',
                       })
                    }else{
                        medical_get_detail = msg;
                        document.getElementById('show_loading_booking_medical').hidden = true;
    //                    document.getElementById('button-home').hidden = false;
                        document.getElementById('button-new-reservation').hidden = false;
                        document.getElementById('button-re-order-div').hidden = false;
                        document.getElementById('button-re-order').hidden = false;
    //                    document.getElementById('new-reservation').hidden = false;
                        hide_modal_waiting_transaction();
                        gmt = '';
                        timezone = '';
                        if(msg.result.response.hold_date){
                            tes = moment.utc(msg.result.response.hold_date).format('YYYY-MM-DD HH:mm:ss')
                            localTime  = moment.utc(tes).toDate();

                            data_gmt = moment(msg.result.response.hold_date)._d.toString().split(' ')[5];
                            gmt = data_gmt.replace(/[^a-zA-Z+-]+/g, '');
                            timezone = data_gmt.replace (/[^\d.]/g, '');
                            timezone = timezone.split('')
                            timezone = timezone.filter(item => item !== '0')
                            msg.result.response.hold_date = moment(localTime).format('DD MMM YYYY HH:mm') + ' ' + gmt + timezone;
                        }

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

                        //======================= Button Issued ==================
                        if(msg.result.response.state == 'booked'){
                           check_payment_payment_method(msg.result.response.order_number, 'Issued', msg.result.response.booker.seq_id, 'billing', 'medical_global', signature, msg.result.response.payment_acquirer_number);
                           $(".issued_booking_btn").show();
                           $text += 'Status: Booked\n';
                           document.getElementById('div_sync_status').hidden = false;
                           /*document.getElementById('div_sync_status').innerHTML =`
                           <input type="button" class="primary-btn" id="button-sync-status" style="width:100%;" value="Sync Status" onclick="please_wait_transaction();medical_global_get_booking('`+order_number+`',true)">`*/
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
                        }
                        else if(msg.result.response.state == 'issued'){
                            document.getElementById('issued-breadcrumb').classList.add("br-active");
                            document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-active");
                            document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-check"></i>`;
                            document.getElementById('show_title_medical').hidden = true;
                            document.getElementById('display_state').innerHTML = `Your Order Has Been Issued`;
                            document.getElementById('alert-state').innerHTML = `
                            <div class="alert alert-success" role="alert">
                                <h5>Your booking has been successfully Issued!</h5>
                            </div>`;

                            //check permission klo ada button di update
                            if(msg.result.response.test_address_map_link){
                                document.getElementById('div_sync_status').hidden = false;
                                document.getElementById('div_sync_status').innerHTML =`
                                    <button type="button" class="primary-btn-white" id="button-sync-status" style="width:100%;" onclick="window.open('`+msg.result.response.test_address_map_link.test_address_map_link+`','_blank');">
                                        Map <i class="fas fa-map-marker-alt"></i>
                                    </button>`;
                            }
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
                            document.getElementById('div_sync_status').hidden = true;
                            document.getElementById('alert-state').innerHTML = `
                            <div class="alert alert-danger" role="alert">
                                <h5>Your booking has been Expired!</h5>
                            </div>`;
                        }
                        else if(msg.result.response.state == 'fail_issued'){
                            $text = 'Fail Issued';
                            document.getElementById('issued-breadcrumb').classList.remove("br-active");
                            document.getElementById('issued-breadcrumb').classList.add("br-fail");
                            document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
                            document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-fail");
                            document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
                            document.getElementById('issued-breadcrumb-span').innerHTML = `Fail Issued`;
                            document.getElementById('display_state').innerHTML = `Your Order Has Been Failed`;
                            document.getElementById('div_sync_status').hidden = true;
                            document.getElementById('alert-state').innerHTML = `
                            <div class="alert alert-danger" role="alert">
                                <h5>Your booking has been Failed!</h5>
                            </div>`;

                        }
                        else if(msg.result.response.state == 'fail_booked'){
                            $text = 'Fail Booked';
                            document.getElementById('issued-breadcrumb').classList.remove("br-active");
                            document.getElementById('issued-breadcrumb').classList.add("br-fail");
                            document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
                            document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-fail");
                            document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
                            document.getElementById('issued-breadcrumb-span').innerHTML = `Fail Booked`;
                            document.getElementById('display_state').innerHTML = `Your Order Has Been Failed`;
                            document.getElementById('div_sync_status').hidden = true;
                            document.getElementById('alert-state').innerHTML = `
                            <div class="alert alert-danger" role="alert">
                                <h5>Your booking has been Failed!</h5>
                            </div>`;
                        }
                        else if(msg.result.response.state == 'fail_refunded'){
                            $text = 'Fail Refunded';
                            document.getElementById('issued-breadcrumb').classList.remove("br-active");
                            document.getElementById('issued-breadcrumb').classList.add("br-fail");
                            document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
                            document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-fail");
                            document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
                            document.getElementById('issued-breadcrumb-span').innerHTML = `Fail Refunded`;
                            document.getElementById('display_state').innerHTML = `Your Order Has Been Failed`;
                            document.getElementById('div_sync_status').hidden = true;
                            document.getElementById('alert-state').innerHTML = `
                            <div class="alert alert-danger" role="alert">
                                <h5>Your booking has been Failed!</h5>
                            </div>`;
                        }
                        else if(msg.result.response.state == 'refund'){
                            $text = 'Refunded';
                            document.getElementById('issued-breadcrumb').classList.add("br-active");
                            document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-active");
                            document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-check"></i>`;
                            document.getElementById('issued-breadcrumb-span').innerHTML = `Refunded`;
                            document.getElementById('display_state').innerHTML = `Your Order Has Been Refunded`;
                            document.getElementById('div_sync_status').hidden = true;
                            document.getElementById('alert-state').innerHTML = `
                            <div class="alert alert-success" role="alert">
                                <h5>Your booking has been Refund!</h5>
                            </div>`;
                        }
                        text = `
                        <div class="mb-3" style="padding:15px; background:white; border:1px solid #cdcdcd;">
                            <div class="row">
                                <div class="col-lg-6">
                                    <h6 class="carrier_code_template">Order Number : </h6><h6>`+msg.result.response.order_number+`</h6><br/>
                                </div>
                                <div class="col-lg-6" style="text-align:right">
                                    <h5>`+msg.result.response.provider_bookings[0].carrier_name+`</h5>
                                </div>`;
                                for(i in msg.result.response.provider_bookings){
                                    if(msg.result.response.provider_bookings[i].error_msg.length != 0 && msg.result.response.provider_bookings[i].state != 'issued')
                                        text += `<div class="alert alert-danger">
                                            `+msg.result.response.provider_bookings[i].error_msg+`
                                            <a href="#" class="close" data-dismiss="alert" aria-label="close" style="margin-top:-1.9vh;">x</a>
                                        </div>`;
                                    text+=`
                                    <div class="col-lg-12">
                                        <span>Status: </span>`;
                                        if(msg.result.response.provider_bookings[i].state_description == 'Expired' ||
                                            msg.result.response.provider_bookings[i].state_description == 'Cancelled' ||
                                            msg.result.response.provider_bookings[i].state_description == 'Booking Failed'){
                                            text+=`<span style="background:#DC143C; color:white; padding:0px 15px; border-radius:14px;">`;
                                        }
                                        else if(msg.result.response.provider_bookings[i].state_description == 'Booked' ||
                                            msg.result.response.provider_bookings[i].state_description == 'Pending'){
                                            text+=`<span style="background:#3fa1e8; color:white; padding:0px 15px; border-radius:14px;">`;
                                        }
                                        else if(msg.result.response.provider_bookings[i].state_description == 'Issued' ||
                                            msg.result.response.provider_bookings[i].state_description == 'validate' ||
                                            msg.result.response.provider_bookings[i].state_description == 'done'){
                                            text+=`<span style="background:#30b330; color:white; padding:0px 15px; border-radius:14px;">`;
                                        }
                                        else if(msg.result.response.provider_bookings[i].state_description == 'Refund' ||
                                            msg.result.response.provider_bookings[i].state_description == 'sent'){
                                            text+=`<span style="background:#8c8d8f; color:white; padding:0px 15px; border-radius:14px;">`;
                                        }
                                        else{
                                            text+=`<span>`;
                                        }

                                        text+=``+msg.result.response.provider_bookings[i].state_description+`</span><br/>`;
                                        if(msg.result.response.state == 'booked'){
                                            text+=`
                                            <span>Hold Date: </span>
                                            <span style="font-weight:600;">`+msg.result.response.hold_date+`</span><br/>`;
                                            $text += 'Hold Date: '+msg.result.response.hold_date+'\n';
                                        }
                                    text+=`
                                        <span>Test Place: </span>
                                        <span style="font-weight:600;">`+msg.result.response.test_address+`</span>
                                    `;

                                }
                        text+=`</div>
                            </div>`;
                        $text += `\n`+msg.result.response.provider_bookings[0].carrier_name + '\n';
                        $text += `Address: `+msg.result.response.test_address;
                        text+=`
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
                            <hr/>`;
                            if(Object.keys(msg.result.response.picked_timeslot).length>0){
                                text+=`
                                <div class="row">
                                    <div class="col-lg-12">
                                        <h6>Test</h6>
                                        <span>Area: <b>`;
                                            text+=msg.result.response.picked_timeslot.area;

                                            text+=`</b>
                                        </span><br/>`;
                                        $text += `Area: `+ msg.result.response.picked_timeslot.area+'\n';
                                        text+=`<span>Date: <b>`;
                                        tes = moment.utc(msg.result.response.picked_timeslot.datetimeslot).format('YYYY-MM-DD HH:mm')
                                        localTime  = moment.utc(tes).toDate();

                                        text+=moment(msg.result.response.picked_timeslot.datetimeslot.split(' ')[0], 'YYYY-MM-DD').format('DD MMM YYYY') + ' ';
                                        $text += `Date: `+ moment(msg.result.response.picked_timeslot.datetimeslot.split(' ')[0], 'YYYY-MM-DD').format('DD MMM YYYY')+'\n';
                                        text+=`</b><br/><span>Time: <b>`;
                                        if(msg.result.response.provider_bookings[0].carrier_code == 'PHCHCKATG' || msg.result.response.provider_bookings[0].carrier_code == 'PHCHCKPCR' || msg.result.response.provider_bookings[0].carrier_code == "PRKATG"){
                                            text += moment(localTime).format('HH:mm') + ' ' + gmt + timezone;
                                            $text += `Time: `+moment(localTime).format('HH:mm') + ' ' + gmt + timezone+`\n`;
                                        }else{
                                            text+= `MON-SAT 08:00 - 15:00 / SUN 08.00 - 12.00 ` + gmt + timezone;
                                            $text += `Time: MON-SAT 08.00 - 15.00 / SUN 08.00 - 12.00 ` + gmt + timezone+`\n`;
                                        }


                                            text+=`</b>
                                    </div>
                                </div>
                                <hr/>`;


                            }
                       text+=`<div class="row">`;
                       text+=`<div class="col-lg-12"></div>`;
                       text+=`<div class="col-lg-3 col-md-4 col-sm-6">`;

                       text+=`</div>
                       </div>
                       </div>`;
                        text += `
                        <div style="border:1px solid #cdcdcd; padding:10px; overflow:auto; background-color:white; margin-top:20px;">
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
                        $text += '\nCustomer\n';
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
                                        <div class="mb-3" style="border:1px solid #cdcdcd; overflow:auto; padding:10px; background-color:white; margin-top:20px;">
                                            <h5> List of Customer</h5>
                                            <hr/>
                                            <table style="width:100%" id="list-of-passenger">
                                                <tr>
                                                    <th style="width:10%;" class="list-of-passenger-left">No</th>
                                                    <th style="width:50%;">Name</th>
                                                    <th style="width:30%;">Email</th>
                                                    <th style="width:30%;">Phone Number</th>
                                                    <th style="width:30%;">Ticket Number</th>
                                                </tr>`;
                                    }
                                    text+=`<tr>
                                                    <td class="list-of-passenger-left">`+(parseInt(j)+1)+`</td>
                                                    <td>`+pax.title+` `+pax.name+` `;
                                    if(pax.identity_number != '' && pax.identity_number != false){
                                        text += `<br/>`+pax.identity_type+` - `+pax.identity_number;
                                    }
                                    text+=`</td>
                                                    <td>`+pax.email+`</td>
                                                    <td>`+pax.phone_number+`</td>
                                                    <td>`+msg.result.response.provider_bookings[i].tickets[j].ticket_number+`</td>`;
                                    text+=`
                                                </tr>
                                    `;
                                    if(j == msg.result.response.provider_bookings[i].tickets.length -1)
                                    text += `</table>
                                        </div>`
                                }
                                print_provider = true
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
                        text_update_data_pax = '';
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
                        ADMIN_FEE_MEDICAL = 0;
                        try{
                            for(j in msg.result.response.passengers){
                                price = {'FARE': 0, 'RAC': 0, 'ADMIN_FEE_MEDICAL':0, 'ROC': 0, 'TAX':0 , 'currency': '', 'CSC': 0, 'SSR': 0, 'DISC': 0,'SEAT':0};
                                for(k in msg.result.response.passengers[j].sale_service_charges[msg.result.response.provider_bookings[i].pnr]){
                                    price[k] += msg.result.response.passengers[j].sale_service_charges[msg.result.response.provider_bookings[i].pnr][k].amount;
                                    if(price['currency'] == '')
                                        price['currency'] = msg.result.response.passengers[j].sale_service_charges[msg.result.response.provider_bookings[i].pnr][k].currency;
                                }
                                disc -= price['DISC'];
                                try{
                                    price['CSC'] = msg.result.response.passengers[j].channel_service_charges.amount;
                                    csc += msg.result.response.passengers[j].channel_service_charges.amount;
                                }catch(err){
                                    console.log(err); // error kalau ada element yg tidak ada
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
                                        'Fare': price['FARE'] + price['SSR'] + price['SEAT'] + price['DISC'] + price['ADMIN_FEE_MEDICAL'],
                                        'Tax': price['TAX'] + price['ROC'],
                                        'Repricing': price['CSC']
                                    }
                                }else{
                                    price_arr_repricing[msg.result.response.passengers[j].name] = {
                                        'Fare': price_arr_repricing[msg.result.response.passengers[j].name]['Fare'] + price['FARE'] + price['DISC'] + price['SSR'] + price['SEAT'] + price['ADMIN_FEE_MEDICAL'],
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
                                //booker
                                booker_insentif = '-';
                                if(msg.result.response.hasOwnProperty('booker_insentif'))
                                    booker_insentif = msg.result.response.booker_insentif
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
                                        <span style="font-size:12px;">`+msg.result.response.passengers[j].name+` Fare</span>`;
                                    text_detail+=`</div>
                                    <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                        <span style="font-size:13px;">`+price.currency+` `+getrupiah(parseInt(price.FARE + price.TAX + price.ROC + price.SSR + price.SEAT))+`</span>
                                    </div>
                                </div>`;
                                ADMIN_FEE_MEDICAL += price['ADMIN_FEE_MEDICAL'];
                                $text += 'Name: '+msg.result.response.passengers[j].title +' '+ msg.result.response.passengers[j].name + '\n';
                                $text += 'Birth Date: '+ msg.result.response.passengers[j].birth_date +'\n';
                                $text += 'Phone Number: '+ msg.result.response.passengers[j].phone_number +'\n';
                                $text += 'Email: '+ msg.result.response.passengers[j].email +'\n';
                                $text += 'Address: '+ msg.result.response.passengers[j].address_ktp +'\n';
                                $text += 'Price: ['+msg.result.response.provider_bookings[i].pnr+'] ';

                                $text += `IDR `+getrupiah(parseInt(price.FARE + price.SSR + price.SEAT + price.TAX + price.ROC + price.CSC + price.DISC + price['ADMIN_FEE_MEDICAL']))+'\n\n';
                                if(counter_service_charge == 0){
                                    total_price += parseInt(price.TAX + price.ROC + price.FARE + price.SEAT + price.CSC + price.SSR + price.DISC + price['ADMIN_FEE_MEDICAL']);
                                }else{
                                    total_price += parseInt(price.TAX + price.ROC + price.FARE + price.SSR + price.SEAT + price.DISC + price['ADMIN_FEE_MEDICAL']);
                                }
                                commission += parseInt(price.RAC);
                                total_price_provider.push({
                                    'pnr': msg.result.response.provider_bookings[i].pnr,
                                    'provider': msg.result.response.provider_bookings[i].provider,
                                    'price': JSON.parse(JSON.stringify(price))
                                });
                            }
                            if(ADMIN_FEE_MEDICAL){
                                text_detail+=`
                                <div class="row" style="margin-bottom:5px;">
                                    <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                        <span style="font-size:12px;">`+msg.result.response.passengers.length+`x Admin Fee Drive Thru</span>`;
                                    text_detail+=`</div>
                                    <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                        <span style="font-size:13px;">`+price.currency+` `+getrupiah(parseInt(ADMIN_FEE_MEDICAL))+`</span>
                                    </div>
                                </div>`;
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
                                    $text += 'Grand Total: ' +price.currency+` `+ getrupiah(total_price);
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
                        if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false && window.location.pathname.includes('confirm_order') == false){
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
                        if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false && window.location.pathname.includes('confirm_order') == false)
                        text_detail+=`
                        <div>
                            <input class="primary-btn-white" id="show_commission_button" style="width:100%;margin-bottom:10px;" type="button" onclick="show_commission('commission');" value="Show Commission"/>
                        </div>`;
                        if(window.location.pathname.includes('confirm_order') == false){
                        text_detail+=`
                        <div>
                            <center>
                                <input type="button" class="primary-btn-white" style="width:100%;" onclick="copy_data();" value="Copy"/>
                            </center>
                        </div>`;
                            if(msg.result.response.state != 'cancel' && msg.result.response.state != 'cancel2'){
                                document.getElementById('cancel_reservation').innerHTML = `
                                <button class="primary-btn-white hold-seat-booking-train ld-ext-right" id="button-choose-print" type="button" onclick="medical_global_cancel_booking('` + msg.result.response.order_number + `');" style="width:100%;">
                                    Cancel Booking
                                    <i class="fas fa-times" style="padding-left:5px; color:red; font-size:16px;"></i>
                                    <div class="ld ld-ring ld-cycle"></div>
                                </button>`;
                            }
                        }
                        if(window.location.pathname.includes('confirm_order') && user_login.co_agent_frontend_security.includes('confirm_order_medical') && msg.result.response.picked_timeslot != {} && msg.result.response.state_vendor == 'new_order' && moment().format('YYYY-MM-DD') == msg.result.response.picked_timeslot.datetimeslot.substr(0,10)){
                            text_detail+=`
                            <div style="margin-top:10px;">
                                <center>
                                    <input type="button" class="primary-btn" style="width:100%;" onclick="confirm_order();" value="Confirm Order"/>
                                </center>
                            </div>`;
                        }else if(msg.result.response.state_vendor == 'confirmed_order'){
                            text_detail+=`
                            <div style="margin-top:10px;">
                                <center>
                                    <span>Order Already confirmed</span>
                                </center>
                            </div>`;
                        }else if( moment().format('YYYY-MM-DD') != msg.result.response.picked_timeslot.datetimeslot.substr(0,10) && window.location.pathname.includes('confirm_order') == true){
                            text_detail+=`
                            <div style="margin-top:10px;">
                                <center>
                                    <span>Order can only confirmed on the test date</span>
                                </center>
                            </div>`;
                        }

                        text_detail+=`
                    </div>`;
                    }catch(err){console.log(err);}

    //                if(user_login.co_agent_frontend_security.includes('view_map')) //map comment dulu
                    if(msg.result.response.test_address_map_link){
                        map = msg.result.response.test_address_map_link.split('/')[msg.result.response.test_address_map_link.split('/').length-1]
                        lat = parseFloat(map.split(',')[0]);
                        long = parseFloat(map.split(',')[1]);
    //                        change_area();
                    }

                    document.getElementById('medical_detail').innerHTML = text_detail;
                    document.getElementById('update_data_passenger').innerHTML = text_update_data_pax;



                        //======================= Option =========================


                        //======================= Extra Question =========================
                    var print_text = '';
                        //==================== Print Button =====================
                        if(window.location.pathname.includes('confirm_order') == false){
                            print_text += '<div class="col-lg-4" style="padding-bottom:10px;">';
                            // === Button 1 ===
                            if (msg.result.response.state  == 'issued') {
                                print_text+=`
                                <button class="primary-btn-white hold-seat-booking-train ld-ext-right" id="button-choose-print" type="button" onclick="get_printout('` + msg.result.response.order_number + `','ticket','medical');" style="width:100%;">
                                    Print Ticket
                                    <div class="ld ld-ring ld-cycle"></div>
                                </button>`;
                            }
                            print_text += '</div><div class="col-lg-4" style="padding-bottom:10px;">';
                            // === Button 2 ===
                            if (msg.result.response.state  == 'issued'){
//                                print_text+=`
//                                <button class="primary-btn-white hold-seat-booking-train ld-ext-right" type="button" id="button-print-print" onclick="get_printout('` + msg.result.response.order_number + `','ticket_price','medical');" style="width:100%;">
//                                    Print Ticket (With Price)
//                                    <div class="ld ld-ring ld-cycle"></div>
//                                </button>`;
                            }
                            print_text += '</div><div class="col-lg-4" style="padding-bottom:10px;">';
                            // === Button 3 ===
                            if (msg.result.response.state  == 'issued') {
                                print_text+=`
                                    <a class="issued-booking-train ld-ext-right" style="color:`+text_color+`;">
                                        <button type="button" class="primary-btn-white" style="width:100%;" data-toggle="modal" data-target="#printInvoice">
                                            Print Invoice
                                        </button>
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
                        }
                        /*
                        if(msg.result.response.provider_type == 'phc'){
                            print_text += '</div><div class="col-lg-4" style="padding-bottom:10px;">';
                            // === Button 3 ===
                            if (msg.result.response.state  == 'issued') {
                                print_text+=`
                                    <a class="issued-booking-train ld-ext-right" style="color:`+text_color+`;">
                                        <button type="button" class="primary-btn-white" style="width:100%;" data-toggle="modal" data-target="#printKwitansi">
                                            Print Kwitansi
                                        </button>
                                        <div class="ld ld-ring ld-cycle"></div>
                                    </a>`;
                                    // modal invoice
                                    print_text+=`
                                        <div class="modal fade" id="printKwitansi" role="dialog" data-keyboard="false">
                                            <div class="modal-dialog">

                                              <!-- Modal content-->
                                                <div class="modal-content">
                                                    <div class="modal-header">
                                                        <h4 class="modal-title" style="color:`+text_color+`">Kwitansi</h4>
                                                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                                                    </div>
                                                    <div class="modal-body">
                                                        <div class="row">
                                                            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 mb-2">
                                                                <span class="control-label" for="Name">Name</span>
                                                                <div class="input-container-search-ticket">
                                                                    <input type="text" class="form-control o_website_form_input" id="kwitansi_name" name="kwitansi_name" placeholder="Name" required="1"/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <br/>
                                                        <div style="text-align:right;">
                                                            <span>Don't want to edit? just submit</span>
                                                            <br/>
                                                            <button type="button" id="button-issued-print" class="primary-btn ld-ext-right" onclick="get_printout('`+msg.result.response.order_number+`', 'kwitansi','medical');">
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
                        }*/
                        if(print_text)
                            document.getElementById('medical_btn_printout').innerHTML = print_text;

                        //======================= Other =========================
                        add_repricing();
                    }
                }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                    auto_logout();
                }else if(msg.result.error_code == 1035){
                    document.getElementById('show_title_medical').hidden = false;
                    document.getElementById('show_loading_booking_medical').hidden = true;
                    document.getElementById('show_title_medical').hidden = true;
                    render_login('medical');
                }else{
                   Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: msg.result.error_msg,
                   })
                   try{
                    $("#show_loading_booking_medical").hide();
                   }catch(err){console.log(err);}
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

function medical_global_cancel_booking(data){
    var temp_data = {}
    if(typeof(medical_get_detail) !== 'undefined')
        temp_data = JSON.stringify(medical_get_detail)
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
           url: "/webservice/medical_global",
           headers:{
                'action': 'cancel',
           },
           data: {
               'order_number': data,
               'signature': signature
           },
           success: function(msg) {
               console.log(msg);
               document.getElementById('cancel_reservation').innerHTML = '';
               if(msg.result.error_code == 0){
                   if(document.URL.split('/')[document.URL.split('/').length-1] == 'payment'){
                        window.location.href = '/medical_global/booking/' + btoa(data);
                   }else{
//                       //update ticket
                        document.getElementById('show_loading_booking_medical').hidden = false;
                        hide_modal_waiting_transaction();
                        document.getElementById('medical_booking').innerHTML = '';
                        document.getElementById('medical_detail').innerHTML = '';
                        document.getElementById('payment_acq').innerHTML = '';
                        //document.getElementById('voucher_div').style.display = 'none';
                        document.getElementById('payment_acq').hidden = true;
                        document.getElementById('div_sync_status').hidden = true;
//                        document.getElementById('button-print-print').hidden = true;

                        document.getElementById("overlay-div-box").style.display = "none";
                        $(".issued_booking_btn").hide(); //kalau error masih keluar button awal remove ivan
                       medical_global_get_booking(data);
                   }
               }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                    auto_logout();
                    $(".issued_booking_btn").hide();
               }else{
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: #ff9900;">Error medical cancel </span>' + msg.result.error_msg,
                    })
                    price_arr_repricing = {};
                    pax_type_repricing = [];
                    document.getElementById('show_loading_booking_medical').hidden = false;
                    document.getElementById('medical_booking').innerHTML = '';
                    document.getElementById('medical_detail').innerHTML = '';
                    document.getElementById('payment_acq').innerHTML = '';
                    document.getElementById('show_loading_booking_medical').style.display = 'block';
                    document.getElementById('show_loading_booking_medical').hidden = false;
                    document.getElementById('payment_acq').hidden = true;
                    hide_modal_waiting_transaction();
                    document.getElementById("overlay-div-box").style.display = "none";

                    $('.hold-seat-booking-train').prop('disabled', false);
                    $('.hold-seat-booking-train').removeClass("running");
                    medical_global_get_booking(data);
                    $(".issued_booking_btn").hide();
               }
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error medical issued');
                price_arr_repricing = {};
                pax_type_repricing = [];
                document.getElementById('show_loading_booking_medical').hidden = false;
                document.getElementById('medical_booking').innerHTML = '';
                document.getElementById('medical_detail').innerHTML = '';
                document.getElementById('payment_acq').innerHTML = '';
                //document.getElementById('voucher_div').style.display = 'none';
                document.getElementById('show_loading_booking_medical').style.display = 'block';
                document.getElementById('show_loading_booking_medical').hidden = false;
                document.getElementById('payment_acq').hidden = true;
                hide_modal_waiting_transaction();
                document.getElementById("overlay-div-box").style.display = "none";
                $('.hold-seat-booking-train').prop('disabled', false);
                $('.hold-seat-booking-train').removeClass("running");
                $(".issued_booking_btn").hide();
                medical_global_get_booking(data);
           },timeout: 300000
        });
      }
    })
}

function medical_global_issued_booking(data){
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
           url: "/webservice/medical_global",
           headers:{
                'action': 'issued',
           },
           data: {
               'order_number': data,
               'acquirer_seq_id': payment_acq2[payment_method][selected].acquirer_seq_id,
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
                   try{
                       if(msg.result.response.state == 'issued')
                            print_success_issued();
                       else
                            print_fail_issued();
                   }catch(err){
                        console.log(err); // error kalau ada element yg tidak ada
                   }
                   if(document.URL.split('/')[document.URL.split('/').length-1] == 'payment'){
                        window.location.href = '/medical_global/booking/' + btoa(data);
                   }else{
//                       //update ticket
                        document.getElementById('show_loading_booking_medical').hidden = false;
                        hide_modal_waiting_transaction();
                        document.getElementById('medical_booking').innerHTML = '';
                        document.getElementById('medical_detail').innerHTML = '';
                        document.getElementById('payment_acq').innerHTML = '';
                        //document.getElementById('voucher_div').style.display = 'none';
                        document.getElementById('payment_acq').hidden = true;
                        document.getElementById('div_sync_status').hidden = true;
                        //document.getElementById('button-print-print').hidden = true;

                        document.getElementById("overlay-div-box").style.display = "none";
                        $(".issued_booking_btn").hide(); //kalau error masih keluar button awal remove ivan
                       medical_global_get_booking(data);
                   }
               }else if(msg.result.error_code == 1009){
                   price_arr_repricing = {};
                   pax_type_repricing = [];
                   hide_modal_waiting_transaction();
                   document.getElementById('show_loading_booking_medical').hidden = false;
                   document.getElementById('medical_booking').innerHTML = '';
                   document.getElementById('medical_detail').innerHTML = '';
                   document.getElementById('payment_acq').innerHTML = '';
                   //document.getElementById('voucher_div').style.display = 'none';
                   document.getElementById('show_loading_booking_medical').style.display = 'block';
                   document.getElementById('show_loading_booking_medical').hidden = false;
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
                    medical_global_get_booking(data);
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
                            }catch(err){
                                console.log(err); // error kalau ada element yg tidak ada
                            }

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
                            }catch(err){
                                console.log(err); // error kalau ada element yg tidak ada
                            }

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
                      html: '<span style="color: #ff9900;">Error medical issued </span>' + msg.result.error_msg,
                    })
                    price_arr_repricing = {};
                    pax_type_repricing = [];
                    document.getElementById('show_loading_booking_medical').hidden = false;
                    document.getElementById('medical_booking').innerHTML = '';
                    document.getElementById('medical_detail').innerHTML = '';
                    document.getElementById('payment_acq').innerHTML = '';
                    document.getElementById('show_loading_booking_medical').style.display = 'block';
                    document.getElementById('show_loading_booking_medical').hidden = false;
                    document.getElementById('payment_acq').hidden = true;
                    hide_modal_waiting_transaction();
                    document.getElementById("overlay-div-box").style.display = "none";

                    $('.hold-seat-booking-train').prop('disabled', false);
                    $('.hold-seat-booking-train').removeClass("running");
                    medical_global_get_booking(data);
                    $(".issued_booking_btn").hide();
               }
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error medical issued');
                price_arr_repricing = {};
                pax_type_repricing = [];
                document.getElementById('show_loading_booking_medical').hidden = false;
                document.getElementById('medical_booking').innerHTML = '';
                document.getElementById('medical_detail').innerHTML = '';
                document.getElementById('payment_acq').innerHTML = '';
                //document.getElementById('voucher_div').style.display = 'none';
                document.getElementById('show_loading_booking_medical').style.display = 'block';
                document.getElementById('show_loading_booking_medical').hidden = false;
                document.getElementById('payment_acq').hidden = true;
                hide_modal_waiting_transaction();
                document.getElementById("overlay-div-box").style.display = "none";
                $('.hold-seat-booking-train').prop('disabled', false);
                $('.hold-seat-booking-train').removeClass("running");
                $(".issued_booking_btn").hide();
                medical_global_get_booking(data);
           },timeout: 300000
        });
      }
    })
}

function medical_get_result(data){
    var temp_data = {}
    if(typeof(medical_get_detail) !== 'undefined')
        temp_data = JSON.stringify(medical_get_detail)
    show_loading();
    please_wait_transaction();
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/medical_global",
       headers:{
            'action': 'get_result',
       },
       data: {
           'order_number': data,
           'booking': temp_data,
           'signature': signature
       },
       success: function(msg) {
           console.log(msg);
           hide_modal_waiting_transaction();
           if(msg.result.error_code == 0){
                if(msg.result.response.length != medical_get_detail.result.response.passengers.length){
                    Swal.fire({
                      type: 'warning',
                      title: 'Notification!',
                      html: 'Result still not ready for some customer!',
                   })
                }
                for(i in msg.result.response)
                    window.open(msg.result.response[i],'_blank');
           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
           }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error PHC get result </span>' + msg.result.error_msg,
                })

           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            hide_modal_waiting_transaction();
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get price medical');
       },timeout: 300000
    });
}

function get_transaction_by_analyst(){
    $('#loading-search-reservation').show();
    $.ajax({
       type: "POST",
       url: "/webservice/medical",
       headers:{
            'action': 'get_transaction_by_analyst',
       },
       data: {
           'date_from': moment(document.getElementById('start_date').value).format('YYYY-MM-DD'),
           'date_to': moment(document.getElementById('end_date').value).format('YYYY-MM-DD'),
           'signature': signature,
           'vendor': vendor
       },
       success: function(msg) {
           console.log(msg);
           if(msg.result.error_code == 0){
                document.getElementById("table_reservation").innerHTML = '';
                var node = document.createElement("tr");
                node.innerHTML = `
                    <tr>
                        <th style="width:5%;">No.</th>
                        <th style="width:20%;">Order Number</th>
                        <th style="width:15%;">Agent</th>
                        <th style="width:15%;">Test Time</th>
                        <th style="width:10%;">Status</th>
                        <th style="width:23%;">Test Address</th>
                        <th style="width:5%;">Map</th>
                        <th style="width:7%;">Action</th>
                    </tr>`;;
                document.getElementById("table_reservation").appendChild(node);
                var test_time = '';
                var gmt = '';
                var number = 1;
                for(i in msg.result.response){
                    if(Object.keys(msg.result.response).length>1){
                        var node = document.createElement("tr");
                        node.innerHTML = `
                        <tr>
                            <td colspan=8 style="text-align:center;">`+moment(i).format('DD MMM YYYY')+`</td>
                        <tr/>`;
                        document.getElementById("table_reservation").appendChild(node);
                    }
                    for(j in msg.result.response[i]){
                        date = moment.utc(msg.result.response[i][j].time_test, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm:ss');
                        localTime  = moment.utc(date).toDate();
                        if(gmt == ''){
                            data_gmt = moment(msg.result.response[i][j].time_test)._d.toString().split(' ')[5];
                            gmt = data_gmt.replace(/[^a-zA-Z+-]+/g, '');
                            timezone = data_gmt.replace (/[^\d.]/g, '');
                            timezone = timezone.split('')
                            timezone = timezone.filter(item => item !== '0')
                        }
                        test_time = moment(localTime).format('DD MMM YYYY HH:mm') + ' ' + gmt + timezone;
                        map = msg.result.response[i][j].test_address_map_link.split('/')[msg.result.response[i][j].test_address_map_link.split('/').length-1]
                        var node = document.createElement("tr");
                        node.innerHTML = `
                        <tr>
                            <td>`+number+`</td>
                            <td>`+msg.result.response[i][j].order_number+`</td>
                            <td>`+msg.result.response[i][j].agent+`</td>
                            <td>`+test_time+`</td>
                            <td>`+msg.result.response[i][j].state_description+`</td>
                            <td>`+msg.result.response[i][j].test_address+`</td>
                            <td><input type="button" class="primary-btn" id="button-sync-status" style="width:100%;" value="Map" onclick="window.open('http://maps.google.com/?q=`+map+`','_blank');"></td>
                            <td><button type='button' class="primary-btn-custom" onclick="goto_detail_reservation('`+msg.result.response[i][j].order_number+`')"><i class="fas fa-search"></button></td>
                        <tr/>`;
                        document.getElementById("table_reservation").appendChild(node);
                        number++;
                    }

                }
           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
           }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error '+vendor+' get result </span>' + msg.result.error_msg,
                })
           }
           $('#loading-search-reservation').hide();
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            hide_modal_waiting_transaction();
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get price medical');
       },timeout: 300000
    });
}

//function triggered_auto_signin(){
//    autoSigninInterval = setInterval(function() {
//        if(new Date() > signin_date){
//            re_medical_signin();
//            signin_date.setMinutes(signin_date.getMinutes()+14);
//        }
//    }, 300000);
//
//}


function create_new_reservation(){
    //pilihan carrier
    var text = '';
    var option = '';
    for(i in medical_get_detail.result.response.provider_bookings){
        for(j in medical_config.result.response){
            option += `<option value="`+medical_config.result.response[j].code+`">`+medical_config.result.response[j].name+`</option>`;
        }
    }
    text += `<div style="background:white;margin-top:15px;padding:15px 15px 5px 15px; border:1px solid #cdcdcd;">
                <h5>Re Order</h5>`;
    text+=`
        <div style="margin-top:15px;">
            <label style="color:red !important">*</label>
            <label>Test Type</label>`;
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
                text+=`<div class="default-select">`;
            }

            if(template == 5){
                text+=`<div class="form-select">`;
            }else{
                text+=`<div class="form-select-2">`;
            }

            if(template == 4){
                text+=`<select style="width:100%;" class="nice-select-default rounded" id="test_type" name="test_type">`;
            }else{
                text+=`<select style="width:100%;" id="test_type" name="test_type">`;
            }
            text += option
                    text+= `</select>
                </div>
            </div>
        </div>`;
    //orang
    text += `<table style="width:100%;background:white;margin-top:15px;" class="list-of-table">
                <tr>
                    <th style="width:70%">Name</th>
                    <th style="width:30%">Re-Order</th>
                </tr>`;
    for(i in medical_get_detail.result.response.passengers){
        text += `<tr>
                    <td>`+medical_get_detail.result.response.passengers[i].name+`</td>
                    <td>
                        <label class="check_box_custom" style="margin-bottom:15px; float:left;">
                            <input type="checkbox" id="copy`+i+`" name="copy`+i+`" checked />
                            <span class="check_box_span_custom"></span>
                        </label>
                    </td>
                 </tr>`
    }
    text+= `</table>`;


    //button
    text += `<button type="button" class="primary-btn mb-3" id="button-home" style="width:100%;margin-top:15px;" onclick="medical_reorder();">
                Re Order
            </button>`

    document.getElementById('button-re-order-div').innerHTML = text;
    document.getElementById('button-re-order').hidden = true;
    $('#test_type').niceSelect();
}

function medical_reorder(){
    //check all pax
    var checked = false;
    var passenger_list_copy = [];
    for(i in medical_get_detail.result.response.passengers){
        if(document.getElementById('copy'+i).checked){
            passenger_list_copy.push(medical_get_detail.result.response.passengers[i]);
            checked = true; // ada pax yg mau re order
        }
    }
    if(checked){
        var path = '/medical_global/passenger/' + document.getElementById('test_type').value;
        document.getElementById('data').value = JSON.stringify(passenger_list_copy);
        var data_temp = {
            "address": medical_get_detail.result.response.test_address,
            "area": medical_get_detail.result.response.picked_timeslot.area,
            "place_url_by_google": medical_get_detail.result.response.test_address_map_link,
            "test_list": []
        }
        document.getElementById('booking_data').value = JSON.stringify(data_temp);
        document.getElementById('medical_edit_passenger').action = path;
        document.getElementById('medical_edit_passenger').submit();
    }else{
        Swal.fire({
            type: 'error',
            title: 'Oops!',
            html: 'Minimal Re-Order with 1 pax!',
        })
    }
}


function get_data_cache_passenger_medical(type){
    $.ajax({
       type: "POST",
       url: "/webservice/medical",
       headers:{
            'action': 'get_data_cache_passenger_medical',
       },
       data: {
            'signature': signature,
       },
       success: function(msg) {
            console.log(msg);
            passenger_data_cache_medical = msg;
            auto_fill_data();
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get price medical');
       },timeout: 300000
    });

}

function get_data_cache_schedule_medical(){
    $.ajax({
       type: "POST",
       url: "/webservice/medical",
       headers:{
            'action': 'get_data_booking_cache_medical',
       },
       data: {
            'signature': signature,
       },
       success: function(msg) {
            console.log(msg);
            if(Object.keys(msg).length != 0){
                schedule_medical = msg;
                auto_fill_home_care();
                add_other_time('auto_fill');
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get price medical');
       },timeout: 300000
    });

}

function update_data_passengers(){
    var path = '/'+medical_get_detail.result.response.provider_bookings[0].provider+'/passenger_edit/' + medical_get_detail.result.response.provider_bookings[0].carrier_code +'/'+ medical_get_detail.result.response.order_number;
    var data = {
        'state': medical_get_detail.result.response.state,
        'passengers': medical_get_detail.result.response.passengers,
        'booking': medical_get_detail.result.response
    }
    document.getElementById('data').value = JSON.stringify(data);
    document.getElementById('signature_data').value = signature;
    document.getElementById('medical_edit_passenger').action = path;
    document.getElementById('medical_edit_passenger').submit();
}

function verify_passenger(){
    var check_verify = false;
    for(i in medical_get_detail.result.response.passengers){
        if(medical_get_detail.result.response.passengers[i].verify == false){
            check_verify = true;
            break;
        }
    }
    if(check_verify){
        update_data_passengers();
    }else{
        //verify ke phc
        verify_phc();
    }
}

function save_data_pax_backend(action){
    request = check_passenger_data();
    if(Object.keys(request).length != 0){
        $('.loader-rodextrip').fadeIn();
        request['order_number'] = order_number;
        $.ajax({
           type: "POST",
           url: "/webservice/medical",
           headers:{
                'action': action,
           },
           data: {
                'signature': signature,
                'request': JSON.stringify(request)
           },
           success: function(msg) {
                console.log(msg);
                if(msg.result.error_code == 0){
                    Swal.fire({
                      type: 'success',
                      title: 'Update!',
                    }).then((result) => {
                      cancel_data();
                    })
                }else{
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: msg.result.error_msg,
                   }).then((result) => {
                      cancel_data();
                    })
                }
                $('.loader-rodextrip').fadeOut();

           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                $('.loader-rodextrip').fadeOut();
                error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error update data passenger backend');
           },timeout: 300000
        });
    }
}

function cancel_data(){
    window.location.href = '/medical/booking/' + btoa(document.URL.split('/')[document.URL.split('/').length-1]);
}

function get_medical_information(){
    $.ajax({
       type: "POST",
       url: "/webservice/medical",
       headers:{
            'action': 'get_medical_information',
       },
       data: {
            'signature': signature,
       },
       success: function(msg) {
            console.log(msg);
            if(msg.error_code == 0){
                medical_data_frontend = msg.response;
                if(vendor == 'periksain'){
                    document.getElementById('informasi_penting').innerHTML += medical_data_frontend[0].html
                    if(medical_data_frontend[0].html != false){
                        document.getElementById('informasi_penting').style.display = 'block';
                    }else{
                        document.getElementById("information_checkbox").checked = true;
                    }
                }else{
                    if(test_type.includes('PCR')){
                        document.getElementById('informasi_penting').innerHTML += medical_data_frontend[2].html
                        if(medical_data_frontend[2].html != false){
                            document.getElementById('informasi_penting').style.display = 'block';
                            document.getElementById('information_div_checkbox').style.display = 'block';
                        }else{
                            document.getElementById("information_checkbox").checked = true;
                        }
                    }else{
                        document.getElementById('informasi_penting').innerHTML += medical_data_frontend[1].html
                        if(medical_data_frontend[1].html != false){
                            document.getElementById('informasi_penting').style.display = 'block';
                            document.getElementById('information_div_checkbox').style.display = 'block';
                        }else{
                            document.getElementById("information_checkbox").checked = true;
                        }
                    }
                }
            }else{
                document.getElementById("information_checkbox").checked = true;
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
       },timeout: 60000
    });
}

function update_service_charge(type){
    repricing_order_number = '';
    if(type == 'booking'){
        upsell = []
        for(i in medical_get_detail.result.response.passengers){
            for(j in medical_get_detail.result.response.passengers[i].sale_service_charges){
                currency = medical_get_detail.result.response.passengers[i].sale_service_charges[j].FARE.currency;
            }
            list_price = []
            for(j in list){
                if(medical_get_detail.result.response.passengers[i].name == document.getElementById('selection_pax'+j).value){
                    list_price.push({
                        'amount': list[j],
                        'currency_code': currency
                    });
                }

            }
            upsell.push({
                'sequence': medical_get_detail.result.response.passengers[i].sequence,
                'pricing': JSON.parse(JSON.stringify(list_price))
            });
        }
        repricing_order_number = order_number;
    }else{
        //REVIEW TIDAK BISA KARENA PASSENGER TIDAK ADA
//        upsell_price = 0;
//        upsell = []
//        counter_pax = -1;
//        currency = price['currency'];
//        for(i in passengers){
//            list_price = []
//            if(i != 'booker' && i != 'contact'){
//                for(j in list){
//                    for(k in passengers[i]){
//                        if(passengers[i][k].first_name+passengers[i][k].last_name == document.getElementById('selection_pax'+j).value){
//                            list_price.push({
//                                'amount': list[j],
//                                'currency_code': currency
//                            });
//                            upsell_price += list[j];
//                        }
//                    }
//                }
//                counter_pax++;
//            }
//            if(list_price.length != 0)
//                upsell.push({
//                    'sequence': counter_pax,
//                    'pricing': JSON.parse(JSON.stringify(list_price))
//                });
//        }
    }
    $.ajax({
       type: "POST",
       url: "/webservice/medical",
       headers:{
            'action': 'update_service_charge',
       },
       data: {
           'order_number': JSON.stringify(repricing_order_number),
           'passengers': JSON.stringify(upsell),
           'signature': signature
       },
       success: function(msg) {
           console.log(msg);
           if(msg.result.error_code == 0){
                if(type == 'booking'){
                    price_arr_repricing = {};
                    pax_type_repricing = [];
                    please_wait_transaction();
                    medical_global_get_booking(repricing_order_number);
                }else{
                    price_arr_repricing = {};
                    pax_type_repricing = [];
                    train_detail();
                }

                $('#myModalRepricing').modal('hide');
           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
           }else{
                if(order_number.includes('PH'))
                    vendor = 'PHC';
                else
                    vendor = 'Periksain';
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error '+vendor+' service charge </span>' + msg.result.error_msg,
                })
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            if(order_number.includes('PH'))
                vendor = 'PHC';
            else
                vendor = 'Periksain';
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error '+vendor+' service charge');
       },timeout: 480000
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
       url: "/webservice/medical_global",
       headers:{
            'action': 'booker_insentif_booking',
       },
       data: {
           'order_number': JSON.stringify(repricing_order_number),
           'booker': JSON.stringify(booker_insentif),
           'signature': signature
       },
       success: function(msg) {
           console.log(msg);
           if(msg.result.error_code == 0){
                try{
                    if(type == 'booking'){
                        please_wait_transaction();
                        medical_global_get_booking(repricing_order_number);
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
                  html: '<span style="color: #ff9900;">Error medical update booker insentif </span>' + msg.result.error_msg,
                })
                $('.loader-rodextrip').fadeOut();
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error medical update booker insentif');
            $('.loader-rodextrip').fadeOut();
       },timeout: 60000
    });

}