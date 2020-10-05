counter_passenger = 0;
counter_line = 0;
agent_offside = 0;
function get_data_issued_offline(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/issued_offline",
       headers:{
            'action': 'get_data',
       },
       data: {},
       success: function(msg) {
           console.log(msg);
           issued_offline_data = msg;
           text = '<option value="">Select</option>';
           for(i in issued_offline_data.transaction_type){
               text+= `<option value='`+issued_offline_data.transaction_type[i].code+`'>`+issued_offline_data.transaction_type[i].name+`</option>`;
           }
           document.getElementById('transaction_type').innerHTML = text;
           $('#transaction_type').niceSelect('update');

           text = '<option value=""></option>';
           for(i in issued_offline_data.sector_type){
               text+= `<option value='`+issued_offline_data.sector_type[i][0]+`'>`+issued_offline_data.sector_type[i][1]+`</option>`;
           }
           document.getElementById('sector').innerHTML = text;
           $('#sector').niceSelect('update');


//           text = '<option value=""></option>';
//           for(i in issued_offline_data.carrier_id){
//               text+= `<option value='`+issued_offline_data.carrier_id[i].id+`'>`+issued_offline_data.carrier_id[i].name+`</option>`;
//           }
//           document.getElementById('carrier_id').innerHTML = text;
//           $('#carrier_id').niceSelect('update');

           text = '<option value=""></option>';
           for(i in issued_offline_data.social_media_id){
               text+= `<option value='`+issued_offline_data.social_media_id[i].name+`'>`+issued_offline_data.social_media_id[i].name+`</option>`;
           }
           document.getElementById('social_media').innerHTML = text;
           $('#social_media').niceSelect('update');
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status == 500){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error data issued offline </span>' + errorThrown,
                })
            }
       },timeout: 60000
    });
}

function check_issued_offline(){
    error_log = '';
    request = {};
    if(counter_passenger == 0)
        error_log += 'Please fill passengers\n';
    else{
        request['passenger'] = []
        for(i=0; i < counter_passenger; i++){
            //kasi if kosong
            if(document.getElementById('adult_first_name' + (i + 1)).value == ''){
                error_log += 'Please fill first name for passenger '+ (i + 1) + ' !\n';
                document.getElementById('adult_first_name' + (i + 1)).style['border-color'] = 'red';
            }else{
                request['passenger_first_name'+i] = document.getElementById('adult_first_name' + (i + 1)).value;
                document.getElementById('adult_first_name' + (i + 1)).style['border-color'] = '#EFEFEF';
            }
            if(document.getElementById('adult_last_name' + (i + 1)).value == ''){
                error_log += 'Please fill last name for passenger '+ (i + 1) + ' !\n';
                document.getElementById('adult_last_name' + (i + 1)).style['border-color'] = 'red';
            }else{
                request['passenger_last_name'+i] = document.getElementById('adult_last_name' + (i + 1)).value;
                document.getElementById('adult_last_name' + (i + 1)).style['border-color'] = '#EFEFEF';
            }
            if(document.getElementById('adult_title' + (i + 1)).value == ''){
                error_log += 'Please fill title name for passenger '+ (i + 1) + ' !\n';
                document.getElementById('adult_title' + (i + 1)).style['border-color'] = 'red';
            }else{
                request['passenger_title'+i] = document.getElementById('adult_title' + (i + 1)).value;
                document.getElementById('adult_title' + (i + 1)).style['border-color'] = '#EFEFEF';
            }
            if(document.getElementById('adult_nationality' + (i + 1)).value == ''){
                error_log += 'Please fill title name for passenger '+ (i + 1) + ' !\n';
                document.getElementById('adult_nationality' + (i + 1)).style['border-color'] = 'red';
            }else{
                request['passenger_nationality_code'+i] = document.getElementById('adult_nationality' + (i + 1)).value;
                document.getElementById('adult_nationality' + (i + 1)).style['border-color'] = '#EFEFEF';
            }
            if(check_date(document.getElementById('adult_birth_date'+ (i + 1)).value)==false){
                error_log+= 'Birth date wrong for passenger passenger '+i+'!\n';
                document.getElementById('adult_birth_date'+ (i + 1)).style['border-color'] = 'red';
            }else{
                request['passenger_birth_date'+i] = document.getElementById('adult_birth_date' + (i + 1)).value;
                document.getElementById('adult_birth_date'+ (i + 1)).style['border-color'] = '#EFEFEF';
            }
            if(document.getElementById('transaction_type').value == 'airline'){
//                if(document.getElementById('sector').value == 'international'){
                if(document.getElementById('adult_passport_number'+ (i + 1)).value != ''){
                    if(document.getElementById('adult_passport_number'+ (i + 1)).value == ''){
                        error_log+= 'Please fill passport number for passenger '+i+'!\n';
                        document.getElementById('adult_passport_number'+ (i + 1)).style['border-color'] = 'red';
                    }else{
                        request['passenger_passport_number'+i] = document.getElementById('adult_passport_number' + (i + 1)).value;
                        document.getElementById('adult_passport_number'+ (i + 1)).style['border-color'] = '#EFEFEF';
                    }
                    if(document.getElementById('adult_passport_expired_date'+ (i + 1)).value == ''){
                        error_log+= 'Please fill passport expired date for passenger '+i+'!\n';
                        document.getElementById('adult_passport_expired_date'+ (i + 1)).style['border-color'] = 'red';
                    }else{
                        request['passenger_passport_expired_date'+i] = document.getElementById('adult_passport_expired_date' + (i + 1)).value;
                        document.getElementById('adult_passport_expired_date'+ (i + 1)).style['border-color'] = '#EFEFEF';
                    }
                    if(document.getElementById('adult_country_of_issued'+ (i + 1)).value == ''){
                        error_log+= 'Please fill country of issued for passenger '+i+'!\n';
                        document.getElementById('adult_country_of_issued'+ (i + 1)).style['border-color'] = 'red';
                    }else{
                        request['passenger_country_of_issued'+i] = document.getElementById('adult_country_of_issued' + (i + 1)).value;
                        document.getElementById('adult_country_of_issued'+ (i + 1)).style['border-color'] = '#EFEFEF';
                    }
                }
            }
            if(document.getElementById('adult_cp' + (i + 1)).checked == true){
                if(check_phone_number(document.getElementById('adult_phone' + (i + 1)).value)==false){
                    error_log+= 'Phone number only contain number 8 - 12 digits for passenger '+i+'!\n';
                    document.getElementById('adult_phone' + (i + 1)).style['border-color'] = 'red';
                }else{
                    request['passenger_phone'+i] = document.getElementById('adult_phone' + (i + 1)).value;
                    document.getElementById('adult_phone' + (i + 1)).style['border-color'] = '#EFEFEF';
                }
                if(check_email(document.getElementById('adult_email' + (i + 1)).value)==false){
                    error_log+= 'Invalid Passenger '+i+' email!\n';
                    document.getElementById('adult_email' + (i + 1)).style['border-color'] = 'red';
                }else{
                    request['passenger_email'+i] = document.getElementById('adult_email' + (i + 1)).value;
                    document.getElementById('adult_email' + (i + 1)).style['border-color'] = '#EFEFEF';
                }
            }
            request['passenger_cp'+i] = document.getElementById('adult_cp' + (i + 1)).checked;
            request['passenger_years_old'+i] = document.getElementById('adult_years_old' + (i + 1)).value;
            request['passenger_phone_code'+i] = document.getElementById('adult_phone_code' + (i + 1)).value;
            request['passenger_phone'+i] = document.getElementById('adult_phone' + (i + 1)).value;
            request['passenger_email'+i] = document.getElementById('adult_email' + (i + 1)).value;
            request['passenger_id'+i] = document.getElementById('adult_id' + (i + 1)).value;
        }
    }
    if(document.getElementById('booker_title').value == ''){
        error_log += 'Please fill title name for booker !\n';
        document.getElementById('booker_title').style['border-color'] = 'red';
    }else{
        request["booker_title"] = document.getElementById('booker_title').value;
        document.getElementById('booker_title').style['border-color'] = '#EFEFEF';
    }if(document.getElementById('booker_first_name').value == ''){
        error_log += 'Please fill first name for booker !\n';
        document.getElementById('booker_first_name').style['border-color'] = 'red';
    }else{
        request["booker_first_name"] = document.getElementById('booker_first_name').value;
        document.getElementById('booker_first_name').style['border-color'] = '#EFEFEF';
    }
    if(document.getElementById('booker_last_name').value == ''){
        error_log += 'Please fill last name for booker !\n';
        document.getElementById('booker_last_name').style['border-color'] = 'red';
    }else{
        request["booker_last_name"] = document.getElementById('booker_last_name').value;
        document.getElementById('booker_last_name').style['border-color'] = '#EFEFEF';
    }if(document.getElementById('booker_email').value == ''){
        error_log += 'Please fill email for booker !\n';
        document.getElementById('booker_email').style['border-color'] = 'red';
    }else{
        request["booker_email"] = document.getElementById('booker_email').value;
        document.getElementById('booker_email').style['border-color'] = '#EFEFEF';
    }if(document.getElementById('booker_phone_code').value == ''){
        error_log += 'Please fill phone code for booker !\n';
        document.getElementById('booker_phone_code').style['border-color'] = 'red';
    }else{
        request["booker_calling_code"] = document.getElementById('booker_phone_code').value;
        document.getElementById('booker_phone_code').style['border-color'] = '#EFEFEF';
    }if(document.getElementById('booker_phone').value == ''){
        error_log += 'Please fill phone for booker !\n';
        document.getElementById('booker_phone').style['border-color'] = 'red';
    }else{
        request["booker_mobile"] = document.getElementById('booker_phone').value;
        document.getElementById('booker_phone').style['border-color'] = '#EFEFEF';
    }if(document.getElementById('booker_nationality').value == ''){
        error_log += 'Please fill nationality for booker !\n';
        document.getElementById('booker_nationality').style['border-color'] = 'red';
    }else{
        request["booker_nationality_code"] = document.getElementById('booker_nationality').value;
        document.getElementById('booker_nationality').style['border-color'] = '#EFEFEF';
    }
    request["booker_id"] = document.getElementById('booker_id').value;
    if(counter_line == 0)
        error_log += 'Please fill line\n';
    else{
        for(i=0; i < counter_line; i++){
            if(document.getElementById('pnr'+i).value == ''){
                error_log += 'Please fill pnr for line '+ (i+1) + '\n';
                document.getElementById('pnr'+i).style['border-color'] = 'red';
            }else{
                document.getElementById('pnr'+i).style['border-color'] = '#EFEFEF';
                request["line_pnr"+i] = document.getElementById('pnr'+i).value;
            }
            if(document.getElementById('transaction_type').value == 'airline' || document.getElementById('transaction_type').value == 'train'){
                if(document.getElementById('origin'+i).value == '' && document.getElementById('origin'+i).value.split(' - ') == 4){
                    error_log += 'Please use autocomplete origin for line '+ (i+1) + '\n';
                    document.getElementById('origin'+i).style['border-color'] = 'red';
                }else{
                    document.getElementById('origin'+i).style['border-color'] = '#EFEFEF';
                    request["line_origin"+i] = document.getElementById('origin'+i).value;
                }if(document.getElementById('destination'+i).value == '' && document.getElementById('destination'+i).value.split(' - ') == 4){
                    error_log += 'Please use autocomplete destination for line '+ (i+1) + '\n';
                    document.getElementById('destination'+i).style['border-color'] = 'red';
                }else{
                    document.getElementById('destination'+i).style['border-color'] = '#EFEFEF';
                    request["line_destination"+i] = document.getElementById('destination'+i).value;
                }if(document.getElementById('departure'+i).value == ''){
                    error_log += 'Please fill departure for line '+ (i+1) + '\n';
                    document.getElementById('departure'+i).style['border-color'] = 'red';
                }else{
                    document.getElementById('departure'+i).style['border-color'] = '#EFEFEF';
                    request["line_departure"+i] =  document.getElementById('departure'+i).value;
                }if(document.getElementById('arrival'+i).value == ''){
                    error_log += 'Please fill arrival for line '+ (i+1) + '\n';
                    document.getElementById('arrival'+i).style['border-color'] = 'red';
                }else{
                    document.getElementById('arrival'+i).style['border-color'] = '#EFEFEF';
                    request["line_arrival"+i] = document.getElementById('arrival'+i).value;
                }if(document.getElementById('carrier_code'+i).value == ''){
                    error_log += 'Please fill carrier code for line '+ (i+1) + '\n';
                    document.getElementById('carrier_code'+i).style['border-color'] = 'red';
                }else{
                    document.getElementById('carrier_code'+i).style['border-color'] = '#EFEFEF';
                    request["line_carrier_code"+i] = document.getElementById('carrier_code'+i).value;
                }if(document.getElementById('carrier_number'+i).value == ''){
                    error_log += 'Please fill carrier number for line '+ (i+1) + '\n';
                    document.getElementById('carrier_number'+i).style['border-color'] = 'red';
                }else{
                    document.getElementById('carrier_number'+i).style['border-color'] = '#EFEFEF';
                    request["line_carrier_number"+i] = document.getElementById('carrier_number'+i).value;
                }if(document.getElementById('provider'+i).value == ''){
                    error_log += 'Please fill provider for line '+ (i+1) + '\n';
                    document.getElementById('provider'+i).style['border-color'] = 'red';
                }else{
                    document.getElementById('provider'+i).style['border-color'] = '#EFEFEF';
                    request["line_provider"+i] = document.getElementById('provider'+i).value;
                }
                if(document.getElementById('sub_class'+i).value == ''){
                    error_log += 'Please fill sub class for line '+ (i+1) + '\n';
                    document.getElementById('sub_class'+i).style['border-color'] = 'red';
                }else{
                    document.getElementById('sub_class'+i).style['border-color'] = '#EFEFEF';
                    request["line_sub_class"+i] = document.getElementById('sub_class'+i).value;
                }if(document.getElementById('class'+i).value == ''){
                    error_log += 'Please fill class for line '+ (i+1) + '\n';
                    document.getElementById('class'+i).style['border-color'] = 'red';
                }else{
                    document.getElementById('class'+i).style['border-color'] = '#EFEFEF';
                    request["line_class_of_service"+i] = document.getElementById('class'+i).value;
                }
            }else if(document.getElementById('transaction_type').value == 'hotel'){
                //kasi check hotel
                if(document.getElementById('hotel_name'+i).value == ''){
                    error_log += 'Please fill name for line '+ (i+1) + '\n';
                    document.getElementById('hotel_name'+i).style['border-color'] = 'red';
                }else{
                    document.getElementById('hotel_name'+i).style['border-color'] = '#EFEFEF';
                    request["line_hotel_name"+i] = document.getElementById('hotel_name'+i).value;
                }if(document.getElementById('hotel_room'+i).value == ''){
                    error_log += 'Please fill room for line '+ (i+1) + '\n';
                    document.getElementById('hotel_room'+i).style['border-color'] = 'red';
                }else{
                    document.getElementById('hotel_room'+i).style['border-color'] = '#EFEFEF';
                    request["line_hotel_room"+i] = document.getElementById('hotel_room'+i).value;
                }if(document.getElementById('hotel_qty'+i).value == '' && check_number(document.getElementById('hotel_qty'+i).value)){
                    error_log += 'Please fill quantity for line '+ (i+1) + '\n';
                    document.getElementById('hotel_qty'+i).style['border-color'] = 'red';
                }else{
                    document.getElementById('hotel_qty'+i).style['border-color'] = '#EFEFEF';
                    request["line_hotel_qty"+i] = document.getElementById('hotel_qty'+i).value;
                }if(document.getElementById('hotel_check_in'+i).value == ''){
                    error_log += 'Please fill check-in for line '+ (i+1) + '\n';
                    document.getElementById('hotel_check_in'+i).style['border-color'] = 'red';
                }else{
                    document.getElementById('hotel_check_in'+i).style['border-color'] = '#EFEFEF';
                    request["line_hotel_check_in"+i] = document.getElementById('hotel_check_in'+i).value;
                }if(document.getElementById('hotel_check_out'+i).value == ''){
                    error_log += 'Please fill check-out for line '+ (i+1) + '\n';
                    document.getElementById('hotel_check_out'+i).style['border-color'] = 'red';
                }else{
                    document.getElementById('hotel_check_out'+i).style['border-color'] = '#EFEFEF';
                    request["line_hotel_check_out"+i] = document.getElementById('hotel_check_out'+i).value;
                }if(document.getElementById('hotel_description'+i).value == ''){
                    error_log += 'Please fill description for line '+ (i+1) + '\n';
                    document.getElementById('hotel_description'+i).style['border-color'] = 'red';
                }else{
                    document.getElementById('hotel_description'+i).style['border-color'] = '#EFEFEF';
                    request["line_hotel_description"+i] = document.getElementById('hotel_description'+i).value;
                }
            }else if(document.getElementById('transaction_type').value == 'activity'){
                //kasi check hotel
                if(document.getElementById('activity_name'+i).value == ''){
                    error_log += 'Please fill name for line '+ (i+1) + '\n';
                    document.getElementById('activity_name'+i).style['border-color'] = 'red';
                }else{
                    document.getElementById('activity_name'+i).style['border-color'] = '#EFEFEF';
                    request["line_activity_name"+i] = document.getElementById('activity_name'+i).value;
                }if(document.getElementById('activity_package'+i).value == ''){
                    error_log += 'Please fill package for line '+ (i+1) + '\n';
                    document.getElementById('activity_package'+i).style['border-color'] = 'red';
                }else{
                    document.getElementById('activity_package'+i).style['border-color'] = '#EFEFEF';
                    request["line_activity_package"+i] = document.getElementById('activity_package'+i).value;
                }if(document.getElementById('activity_qty'+i).value == ''){
                    error_log += 'Please fill quantity for line '+ (i+1) + '\n';
                    document.getElementById('activity_qty'+i).style['border-color'] = 'red';
                }else{
                    document.getElementById('activity_qty'+i).style['border-color'] = '#EFEFEF';
                    request["line_activity_qty"+i] = document.getElementById('activity_qty'+i).value;
                }if(document.getElementById('activity_datetime'+i).value == ''){
                    error_log += 'Please fill visit date for line '+ (i+1) + '\n';
                    document.getElementById('activity_datetime'+i).style['border-color'] = 'red';
                }else{
                    document.getElementById('activity_datetime'+i).style['border-color'] = '#EFEFEF';
                    request["line_activity_datetime"+i] = document.getElementById('activity_datetime'+i).value;
                }if(document.getElementById('activity_description'+i).value == ''){
                    error_log += 'Please fill description for line '+ (i+1) + '\n';
                    document.getElementById('activity_description'+i).style['border-color'] = 'red';
                }else{
                    document.getElementById('activity_description'+i).style['border-color'] = '#EFEFEF';
                    request["line_activity_description"+i] = document.getElementById('activity_description'+i).value;
                }
            }else{
                request["line_other_description"+i] = document.getElementById('other_description'+i).value;
            }
        }
    }
//    if(document.getElementById('contact_id').value == ''){}
    request['quick_validate'] = document.getElementById('quick_validate').checked;
    if(document.getElementById('transaction_type').value == ''){
        error_log += 'Please fill transaction type\n';
        document.getElementById('transaction_type').style['border-color'] = 'red';
    }else{
        document.getElementById('transaction_type').style['border-color'] = '#EFEFEF';
        request["type"] = document.getElementById('transaction_type').value;
    }if(document.getElementById('sector').value == '' && document.getElementById('transaction_type').value == 'airline'){
        error_log += 'Please fill sector\n';
        document.getElementById('sector').style['border-color'] = 'red';
    }else{
        request["sector_type"] = document.getElementById('sector').value;
        document.getElementById('sector').style['border-color'] = '#EFEFEF';
    }if(document.getElementById('total_sale_price').value == ''){
        error_log += 'Please fill total sale price\n';
        document.getElementById('total_sale_price').style['border-color'] = 'red';
    }else{
        request["total_sale_price"] = document.getElementById('total_sale_price').value;
        document.getElementById('total_sale_price').style['border-color'] = '#EFEFEF';
    }if(document.getElementById('social_media').value == ''){
        error_log += 'Please fill social media\n';
        document.getElementById('social_media').style['border-color'] = 'red';
    }else{
        document.getElementById('social_media').style['border-color'] = '#EFEFEF';
        request["social_media"] = document.getElementById('social_media').value;
    }if(document.getElementById('timelimit').value == ''){
        error_log += 'Please fill time limit\n';
        document.getElementById('timelimit').style['border-color'] = 'red';
    }else{
        document.getElementById('timelimit').style['border-color'] = '#EFEFEF';
        request["expired_date"] = document.getElementById('timelimit').value;
    }if(error_log == ''){
        request["desc"] = document.getElementById('description').value;
        request["counter_passenger"] = counter_passenger;
        request["counter_line"] = counter_line;
        $('.payment_acq_btn').prop('disabled', true);
        $('.payment_acq_btn').addClass("running");
        $("#loading_payment_acq").show();
        issued_offline_signin();
    }else{
         Swal.fire({
          type: 'error',
          title: 'Oops!',
          html: '<span style="color: #ff9900;">Error </span>' + error_log,
        })

    }

}
function issued_offline_signin(data){
    getToken();
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
                try{
                    document.getElementById('payment_acq').hidden = false;
                }catch(err){}
                if(data == undefined)
                    set_data_issued_offline();
                else
                    get_booking_offline(data);
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

function set_data_issued_offline(){
    for(i=0; i < counter_line; i++){
        if(document.getElementById('pnr'+i).value == ''){
            error_log += 'Please fill pnr for line '+ (i+1) + '\n';
            document.getElementById('pnr'+i).style['border-color'] = 'red';
        }else{
            document.getElementById('pnr'+i).style['border-color'] = '#EFEFEF';
            request["line_pnr"+i] = document.getElementById('pnr'+i).value;
        }
        if(document.getElementById('transaction_type').value == 'airline' || document.getElementById('transaction_type').value == 'train'){
            if(document.getElementById('origin'+i).value == '' && document.getElementById('origin'+i).value.split(' - ') == 4){
                error_log += 'Please fill origin using autocomplete for line '+ (i+1) + '\n';
                document.getElementById('origin'+i).style['border-color'] = 'red';
            }else{
                document.getElementById('origin'+i).style['border-color'] = '#EFEFEF';
                request["line_origin"+i] = document.getElementById('origin'+i).value;
            }if(document.getElementById('destination'+i).value == '' && document.getElementById('destination'+i).value.split(' - ') == 4){
                error_log += 'Please fill destination using autocomplete for line '+ (i+1) + '\n';
                document.getElementById('destination'+i).style['border-color'] = 'red';
            }else{
                document.getElementById('destination'+i).style['border-color'] = '#EFEFEF';
                request["line_destination"+i] = document.getElementById('destination'+i).value;
            }if(document.getElementById('departure'+i).value == ''){
                error_log += 'Please fill departure for line '+ (i+1) + '\n';
                document.getElementById('departure'+i).style['border-color'] = 'red';
            }else{
                document.getElementById('departure'+i).style['border-color'] = '#EFEFEF';
                request["line_departure"+i] =  document.getElementById('departure'+i).value;
            }if(document.getElementById('arrival'+i).value == ''){
                error_log += 'Please fill arrival for line '+ (i+1) + '\n';
                document.getElementById('arrival'+i).style['border-color'] = 'red';
            }else{
                document.getElementById('arrival'+i).style['border-color'] = '#EFEFEF';
                request["line_arrival"+i] = document.getElementById('arrival'+i).value;
            }if(document.getElementById('carrier_code'+i).value == ''){
                error_log += 'Please fill carrier code for line '+ (i+1) + '\n';
                document.getElementById('carrier_code'+i).style['border-color'] = 'red';
            }else{
                document.getElementById('carrier_code'+i).style['border-color'] = '#EFEFEF';
                request["line_carrier_code"+i] = document.getElementById('carrier_code'+i).value;
            }if(document.getElementById('carrier_number'+i).value == ''){
                error_log += 'Please fill carrier number for line '+ (i+1) + '\n';
                document.getElementById('carrier_number'+i).style['border-color'] = 'red';
            }else{
                document.getElementById('carrier_number'+i).style['border-color'] = '#EFEFEF';
                request["line_carrier_number"+i] = document.getElementById('carrier_number'+i).value;
            }if(document.getElementById('provider'+i).value == ''){
                error_log += 'Please fill provider for line '+ (i+1) + '\n';
                document.getElementById('provider'+i).style['border-color'] = 'red';
            }else{
                document.getElementById('provider'+i).style['border-color'] = '#EFEFEF';
                request["line_provider"+i] = document.getElementById('provider'+i).value;
            }
            if(document.getElementById('sub_class'+i).value == ''){
                error_log += 'Please fill sub class for line '+ (i+1) + '\n';
                document.getElementById('sub_class'+i).style['border-color'] = 'red';
            }else{
                document.getElementById('sub_class'+i).style['border-color'] = '#EFEFEF';
                request["line_sub_class"+i] = document.getElementById('sub_class'+i).value;
            }if(document.getElementById('class'+i).value == ''){
                error_log += 'Please fill class for line '+ (i+1) + '\n';
                document.getElementById('class'+i).style['border-color'] = 'red';
            }else{
                document.getElementById('class'+i).style['border-color'] = '#EFEFEF';
                request["line_class_of_service"+i] = document.getElementById('class'+i).value;
            }
        }else if(document.getElementById('transaction_type').value == 'hotel'){
            //kasi check hotel
            if(document.getElementById('hotel_name'+i).value == ''){
                error_log += 'Please fill name for line '+ (i+1) + '\n';
                document.getElementById('hotel_name'+i).style['border-color'] = 'red';
            }else{
                document.getElementById('hotel_name'+i).style['border-color'] = '#EFEFEF';
                request["line_hotel_name"+i] = document.getElementById('hotel_name'+i).value;
            }if(document.getElementById('hotel_room'+i).value == ''){
                error_log += 'Please fill room for line '+ (i+1) + '\n';
                document.getElementById('hotel_room'+i).style['border-color'] = 'red';
            }else{
                document.getElementById('hotel_room'+i).style['border-color'] = '#EFEFEF';
                request["line_hotel_room"+i] = document.getElementById('hotel_room'+i).value;
            }if(document.getElementById('hotel_qty'+i).value == ''){
                error_log += 'Please fill quantity for line '+ (i+1) + '\n';
                document.getElementById('hotel_qty'+i).style['border-color'] = 'red';
            }else{
                document.getElementById('hotel_qty'+i).style['border-color'] = '#EFEFEF';
                request["line_hotel_qty"+i] = document.getElementById('hotel_qty'+i).value;
            }if(document.getElementById('hotel_check_in'+i).value == ''){
                error_log += 'Please fill check-in for line '+ (i+1) + '\n';
                document.getElementById('hotel_check_in'+i).style['border-color'] = 'red';
            }else{
                document.getElementById('hotel_check_in'+i).style['border-color'] = '#EFEFEF';
                request["line_hotel_check_in"+i] = document.getElementById('hotel_check_in'+i).value;
            }if(document.getElementById('hotel_check_out'+i).value == ''){
                error_log += 'Please fill check-out for line '+ (i+1) + '\n';
                document.getElementById('hotel_check_out'+i).style['border-color'] = 'red';
            }else{
                document.getElementById('hotel_check_out'+i).style['border-color'] = '#EFEFEF';
                request["line_hotel_check_out"+i] = document.getElementById('hotel_check_out'+i).value;
            }if(document.getElementById('hotel_description'+i).value == ''){
                error_log += 'Please fill description for line '+ (i+1) + '\n';
                document.getElementById('hotel_description'+i).style['border-color'] = 'red';
            }else{
                document.getElementById('hotel_description'+i).style['border-color'] = '#EFEFEF';
                request["line_hotel_description"+i] = document.getElementById('hotel_description'+i).value;
            }
        }else if(document.getElementById('transaction_type').value == 'activity'){
            //kasi check hotel
            if(document.getElementById('activity_name'+i).value == ''){
                error_log += 'Please fill name for line '+ (i+1) + '\n';
                document.getElementById('activity_name'+i).style['border-color'] = 'red';
            }else{
                document.getElementById('activity_name'+i).style['border-color'] = '#EFEFEF';
                request["line_activity_name"+i] = document.getElementById('activity_name'+i).value;
            }if(document.getElementById('activity_package'+i).value == ''){
                error_log += 'Please fill package for line '+ (i+1) + '\n';
                document.getElementById('activity_package'+i).style['border-color'] = 'red';
            }else{
                document.getElementById('activity_package'+i).style['border-color'] = '#EFEFEF';
                request["line_activity_package"+i] = document.getElementById('activity_package'+i).value;
            }if(document.getElementById('activity_qty'+i).value == ''){
                error_log += 'Please fill quantity for line '+ (i+1) + '\n';
                document.getElementById('activity_qty'+i).style['border-color'] = 'red';
            }else{
                document.getElementById('activity_qty'+i).style['border-color'] = '#EFEFEF';
                request["line_activity_qty"+i] = document.getElementById('activity_qty'+i).value;
            }if(document.getElementById('activity_datetime'+i).value == ''){
                error_log += 'Please fill visit date for line '+ (i+1) + '\n';
                document.getElementById('activity_datetime'+i).style['border-color'] = 'red';
            }else{
                document.getElementById('activity_datetime'+i).style['border-color'] = '#EFEFEF';
                request["line_activity_datetime"+i] = document.getElementById('activity_datetime'+i).value;
            }if(document.getElementById('activity_description'+i).value == ''){
                error_log += 'Please fill description for line '+ (i+1) + '\n';
                document.getElementById('activity_description'+i).style['border-color'] = 'red';
            }else{
                document.getElementById('activity_description'+i).style['border-color'] = '#EFEFEF';
                request["line_activity_description"+i] = document.getElementById('activity_description'+i).value;
            }
        }
    }
    if(document.getElementById('transaction_type').value == ''){
        error_log += 'Please fill transaction type\n';
        document.getElementById('transaction_type').style['border-color'] = 'red';
    }else{
        document.getElementById('transaction_type').style['border-color'] = '#EFEFEF';
        request["type"] = document.getElementById('transaction_type').value;
    }if(document.getElementById('sector').value == '' && document.getElementById('transaction_type').value == 'airline'){
        error_log += 'Please fill sector\n';
        document.getElementById('sector').style['border-color'] = 'red';
    }else{
        request["sector_type"] = document.getElementById('sector').value;
        document.getElementById('sector').style['border-color'] = '#EFEFEF';
    }if(document.getElementById('total_sale_price').value == ''){
        error_log += 'Please fill total sale price\n';
        document.getElementById('total_sale_price').style['border-color'] = 'red';
    }else{
        request["total_sale_price"] = document.getElementById('total_sale_price').value.split(',').join('');
        document.getElementById('total_sale_price').style['border-color'] = '#EFEFEF';
    }if(document.getElementById('social_media').value == ''){
        error_log += 'Please fill social media\n';
        document.getElementById('social_media').style['border-color'] = 'red';
    }else{
        document.getElementById('social_media').style['border-color'] = '#EFEFEF';
        request["social_media"] = document.getElementById('social_media').value;
    }if(document.getElementById('timelimit').value == ''){
        error_log += 'Please fill time limit\n';
        document.getElementById('timelimit').style['border-color'] = 'red';
    }else{
        document.getElementById('timelimit').style['border-color'] = '#EFEFEF';
        request["expired_date"] = document.getElementById('timelimit').value;
    }
    request["desc"] = document.getElementById('description').value;
    request["counter_line"] = counter_line;
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/issued_offline",
       headers:{
            'action': 'set_data_issued_offline',
       },
       data: request,
       success: function(msg) {
            console.log(msg);
            if(msg.result.error_code == 0)
                update_booker();
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status == 500){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error set data issued offline  </span>' + errorThrown,
                })
                $('.payment_acq_btn').prop('disabled', false);
                $('.hold-seat-booking-train').removeClass("running");
            }
       },timeout: 60000
    });
}

function update_booker(){
    if(document.getElementById('booker_title').value == ''){
        error_log += 'Please fill title name for booker !\n';
        document.getElementById('booker_title').style['border-color'] = 'red';
    }else{
        request["booker_title"] = document.getElementById('booker_title').value;
        document.getElementById('booker_title').style['border-color'] = '#EFEFEF';
    }if(document.getElementById('booker_first_name').value == ''){
        error_log += 'Please fill first name for booker !\n';
        document.getElementById('booker_first_name').style['border-color'] = 'red';
    }else{
        request["booker_first_name"] = document.getElementById('booker_first_name').value;
        document.getElementById('booker_first_name').style['border-color'] = '#EFEFEF';
    }
    if(document.getElementById('booker_last_name').value == ''){
        error_log += 'Please fill last name for booker !\n';
        document.getElementById('booker_last_name').style['border-color'] = 'red';
    }else{
        request["booker_last_name"] = document.getElementById('booker_last_name').value;
        document.getElementById('booker_last_name').style['border-color'] = '#EFEFEF';
    }if(document.getElementById('booker_email').value == ''){
        error_log += 'Please fill email for booker !\n';
        document.getElementById('booker_email').style['border-color'] = 'red';
    }else{
        request["booker_email"] = document.getElementById('booker_email').value;
        document.getElementById('booker_email').style['border-color'] = '#EFEFEF';
    }if(document.getElementById('booker_phone_code').value == ''){
        error_log += 'Please fill phone code for booker !\n';
        document.getElementById('booker_phone_code').style['border-color'] = 'red';
    }else{
        request["booker_calling_code"] = document.getElementById('booker_phone_code').value;
        document.getElementById('booker_phone_code').style['border-color'] = '#EFEFEF';
    }if(document.getElementById('booker_phone').value == ''){
        error_log += 'Please fill phone for booker !\n';
        document.getElementById('booker_phone').style['border-color'] = 'red';
    }else{
        request["booker_mobile"] = document.getElementById('booker_phone').value;
        document.getElementById('booker_phone').style['border-color'] = '#EFEFEF';
    }if(document.getElementById('booker_nationality').value == ''){
        error_log += 'Please fill nationality for booker !\n';
        document.getElementById('booker_nationality').style['border-color'] = 'red';
    }else{
        request["booker_nationality_code"] = document.getElementById('booker_nationality').value;
        document.getElementById('booker_nationality').style['border-color'] = '#EFEFEF';
    }
    request["booker_id"] = document.getElementById('booker_id').value;
    request["counter_passenger"] = counter_passenger;
    for(i=0; i < counter_passenger; i++){
        //kasi if kosong
        if(document.getElementById('adult_first_name' + (i + 1)).value == ''){
            error_log += 'Please fill first name for passenger '+ (i + 1) + ' !\n';
            document.getElementById('adult_first_name' + (i + 1)).style['border-color'] = 'red';
        }else{
            request['passenger_first_name'+i] = document.getElementById('adult_first_name' + (i + 1)).value;
            document.getElementById('adult_first_name' + (i + 1)).style['border-color'] = '#EFEFEF';
        }
        if(document.getElementById('adult_last_name' + (i + 1)).value == ''){
            error_log += 'Please fill last name for passenger '+ (i + 1) + ' !\n';
            document.getElementById('adult_last_name' + (i + 1)).style['border-color'] = 'red';
        }else{
            request['passenger_last_name'+i] = document.getElementById('adult_last_name' + (i + 1)).value;
            document.getElementById('adult_last_name' + (i + 1)).style['border-color'] = '#EFEFEF';
        }
        if(document.getElementById('adult_title' + (i + 1)).value == ''){
            error_log += 'Please fill title name for passenger '+ (i + 1) + ' !\n';
            document.getElementById('adult_title' + (i + 1)).style['border-color'] = 'red';
        }else{
            request['passenger_title'+i] = document.getElementById('adult_title' + (i + 1)).value;
            document.getElementById('adult_title' + (i + 1)).style['border-color'] = '#EFEFEF';
        }
        if(document.getElementById('adult_nationality' + (i + 1)).value == ''){
            error_log += 'Please fill nationality for passenger '+ (i + 1) + ' !\n';
            document.getElementById('adult_nationality' + (i + 1)).style['border-color'] = 'red';
        }else{
            request['passenger_nationality_code'+i] = document.getElementById('adult_nationality' + (i + 1)).value;
            document.getElementById('adult_nationality' + (i + 1)).style['border-color'] = '#EFEFEF';
        }
        if(document.getElementById('adult_cp' + (i + 1)).checked == true){
            request['passenger_years_old'+i] = document.getElementById('adult_years_old' + (i + 1)).value;
            request['passenger_phone_code'+i] = document.getElementById('adult_phone_code' + (i + 1)).value;
            request['passenger_phone'+i] = document.getElementById('adult_phone' + (i + 1)).value;
            request['passenger_email'+i] = document.getElementById('adult_email' + (i + 1)).value;
        }
        request['passenger_cp'+i] = document.getElementById('adult_cp' + (i + 1)).checked;
        request['passenger_id'+i] = document.getElementById('adult_id' + (i + 1)).value;
    }
    if(document.getElementsByName('myRadios')[0].checked == true)
        request['myRadios'] = true;
    else
        request['myRadios'] = false;
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/issued_offline",
       headers:{
            'action': 'update_contact',
       },
       data: request,
       success: function(msg) {
            if(msg.result.error_code == 0)
                update_passenger();

       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status == 500){
                $('.payment_acq_btn').prop('disabled', false);
                $('.hold-seat-booking-train').removeClass("running");
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error issued offline update booker </span>' + errorThrown,
                })
            }
       },timeout: 60000
    });
}

function update_passenger(){
    for(i=0; i < counter_passenger; i++){
        //kasi if kosong
        if(document.getElementById('adult_first_name' + (i + 1)).value == ''){
            error_log += 'Please fill first name for passenger '+ (i + 1) + ' !\n';
            document.getElementById('adult_first_name' + (i + 1)).style['border-color'] = 'red';
        }else{
            request['passenger_first_name'+i] = document.getElementById('adult_first_name' + (i + 1)).value;
            document.getElementById('adult_first_name' + (i + 1)).style['border-color'] = '#EFEFEF';
        }
        if(document.getElementById('adult_last_name' + (i + 1)).value == ''){
            error_log += 'Please fill last name for passenger '+ (i + 1) + ' !\n';
            document.getElementById('adult_last_name' + (i + 1)).style['border-color'] = 'red';
        }else{
            request['passenger_last_name'+i] = document.getElementById('adult_last_name' + (i + 1)).value;
            document.getElementById('adult_last_name' + (i + 1)).style['border-color'] = '#EFEFEF';
        }
        if(document.getElementById('adult_title' + (i + 1)).value == ''){
            error_log += 'Please fill title name for passenger '+ (i + 1) + ' !\n';
            document.getElementById('adult_title' + (i + 1)).style['border-color'] = 'red';
        }else{
            request['passenger_title'+i] = document.getElementById('adult_title' + (i + 1)).value;
            document.getElementById('adult_title' + (i + 1)).style['border-color'] = '#EFEFEF';
        }
        if(document.getElementById('adult_nationality' + (i + 1)).value == ''){
            error_log += 'Please fill title name for passenger '+ (i + 1) + ' !\n';
            document.getElementById('adult_nationality' + (i + 1)).style['border-color'] = 'red';
        }else{
            request['passenger_nationality_code'+i] = document.getElementById('adult_nationality' + (i + 1)).value;
            document.getElementById('adult_nationality' + (i + 1)).style['border-color'] = '#EFEFEF';
        }

        request['passenger_birth_date'+i] = document.getElementById('adult_birth_date' + (i + 1)).value;
        try{
            request['passenger_passport_number'+i] = document.getElementById('adult_passport_number' + (i + 1)).value;
            request['passenger_passport_expired_date'+i] = document.getElementById('adult_passport_expired_date' + (i + 1)).value;
            request['passenger_country_of_issued'+i] = document.getElementById('adult_country_of_issued' + (i + 1)).value;
        }catch(err){}
    }
    request["counter_passenger"] = counter_passenger;
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/issued_offline",
       headers:{
            'action': 'update_passenger',
       },
       data: request,
       success: function(msg) {
            if(msg.result.error_code == 0){
                get_payment_acq('Issued', document.getElementById('booker_id').value, '', 'billing', signature, 'issued_offline','', '');
                focus_box('payment_acq');
                //document.getElementById('payment_acq').hidden = false;
            }
//

       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status == 500){
                $('.payment_acq_btn').prop('disabled', false);
                $('.hold-seat-booking-train').removeClass("running");
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error issued offline update passenger </span>' + errorThrown,
                })
            }
       },timeout: 60000
    });
}

function commit_booking(){
    document.getElementById('submit_top_up').disabled = true;
    data = {
        'seq_id':payment_acq2[payment_method][selected].seq_id,
        'member':payment_acq2[payment_method][selected].method,
        'voucher_code': voucher_code
    }

    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/issued_offline",
       headers:{
            'action': 'commit_booking',
       },
       data: data,
       success: function(msg) {
           console.log(msg);
           if(msg.result.error_code == 0){
               Swal.fire({
                 type: 'success',
                 title: 'Booking!',
                 html: 'Issued Offline number booking: ' + msg.result.response.order_number,
               })

               document.getElementById('transaction_type').value = '';
               document.getElementById('sector').value = '';
               document.getElementById('description').value = '';
               document.getElementById('social_media').value = '';
               document.getElementById('total_sale_price').value = '';
               document.getElementById('contact_person').value = '';
               document.getElementById('timelimit').value = '';

               //booker
               document.getElementsByName('radio-booker-type')[0].checked = true;
               document.getElementById('booker_title').value = 'MR';
               document.getElementById('booker_first_name').value = '';
               document.getElementById('booker_last_name').value = '';
               document.getElementById('booker_email').value = '';
               document.getElementById('booker_phone').value = '';


               for(i=counter_passenger; i >= 0; i--){
                   delete_table_of_passenger();
               }
               for(i=counter_line; i >= 0; i--){
                   delete_table_of_line();
               }
               document.getElementsByName('myRadios')[1].checked = true;
               document.getElementById('show_line').hidden = true;
               document.getElementById('show_line').innerHTML = '';
//               document.getElementById('payment_acq').hidden = true;
               close_div('payment_acq');
               $('#transaction_type').niceSelect('update');
               $('#sector').niceSelect('update');
               $('#social_media').niceSelect('update');
               document.getElementById('sector_div').hidden = true;
           }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error issued offline commit booking </span>' + msg.result.error_msg,
                })
                close_div('payment_acq');
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status == 500){
                $('.payment_acq_btn').prop('disabled', false);
                $('.hold-seat-booking-train').removeClass("running");
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error issued offline commit booking </span>' + errorThrown,
                })
            }
       },timeout: 180000
    });
}

function get_booking_offline(data){
    $.ajax({
       type: "POST",
       url: "/webservice/issued_offline",
       headers:{
            'action': 'get_booking',
       },
       data: {
            'order_number': data,
            'signature': signature
       },
       success: function(msg) {
            console.log(msg);
            if(msg.result.error_code == 0){
                offline_get_detail = msg;
                var text = '';
                $text = '';
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
                }
                check_provider_booking = 0;
                if(msg.result.response.state == 'booked'){
                    $(".issued_booking_btn").show();
                    check_provider_booking++;
                }
                else{
                    //$(".issued_booking_btn").remove();
                    $('.loader-rodextrip').fadeOut();
                    $("#waitingTransaction").modal('hide');
                }

                $text += 'Order Number: '+ msg.result.response.order_number + '\n';
                if(msg.result.response.hold_date != 'Invalid date'){
                    tes = moment.utc(msg.result.response.hold_date).format('YYYY-MM-DD HH:mm:ss')
                    localTime  = moment.utc(tes).toDate();
                    msg.result.response.hold_date = moment(localTime).format('DD MMM YYYY HH:mm');
                }
                //$text += 'Hold Date: ' + msg.result.response.hold_date + '\n';
                $text += msg.result.response.state_offline + '\n';
                var localTime;
                text += `
                <div class="col-lg-12" style="border:1px solid #cdcdcd; padding:10px; background-color:white; margin-bottom:20px;">
                    <h6>Order Number : `+msg.result.response.order_number+`</h6><br/>
                    <table style="width:100%;">
                        <tr>
                            <th>PNR</th>
                            <th>Hold Date</th>
                            <th>Status</th>
                        </tr>`;
                        for(i in msg.result.response.lines){
                            if(i == 0 && msg.result.response.hold_date != 'Invalid date' && msg.result.response.state != 'issued'){
                                $text += 'Please make payment before '+ msg.result.response.hold_date + `\n`;
                            }
                            text+=`<tr>
                                <td>`+msg.result.response.lines[i].pnr+`</td>`;
                            if(msg.result.response.hold_date != 'Invalid date')
                            text+=`
                                <td>`+msg.result.response.hold_date+`</td>`;
                            else
                            text+=`<td>-</td>`
                            text+=`
                                <td id='pnr'>`+msg.result.response.state_offline+`</td>
                            </tr>`;
                        }
                        $(".issued_booking_btn").remove();
                        $text += msg.result.response.state_offline+'\n';
                        $text +='\n';
                text+=`</table>
                </div>`;

                if(msg.result.response.offline_provider_type == 'airline' || msg.result.response.offline_provider_type == 'train'){
                    text+=`<div style="background-color:white; border:1px solid #cdcdcd;">
                        <div class="row">
                            <div class="col-lg-12">
                                <div style="padding:10px; background-color:white;">
                                <h5> Reservation Detail <img style="width:18px;" src="/static/tt_website_rodextrip/images/icon/plane.png" alt="Reservasi Detail"/></h5>
                                <hr/>`;
                            check = 0;
                            flight_counter = 1;
                            for(i in msg.result.response.lines){
                                $text += 'Booking Code: ' + msg.result.response.lines[i].pnr+'\n';
                                if(i != 0){
                                    text+=`<hr/>`;
                                }
                                text+=`<h5>PNR: `+msg.result.response.lines[i].pnr+`</h5>`;
                                text+=`<h6>Reservation `+flight_counter+`</h6>`;
                                $text += 'Reservation '+ flight_counter+'\n';
                                flight_counter++;
                                $text += msg.result.response.lines[i].carrier;

                                $text += ' ' + msg.result.response.lines[i].class + '\n';
                                if(msg.result.response.lines[i].departure_date.split('  ')[0] == msg.result.response.lines[i].arrival_date.split('  ')[0]){
                                    $text += msg.result.response.lines[i].departure_date.split('  ')[0]+' ';
                                    $text += msg.result.response.lines[i].departure_date.split('  ')[1]+' - ';
                                    $text += msg.result.response.lines[i].arrival_date.split('  ')[1]+'\n';
                                }else{
                                    $text += msg.result.response.lines[i].departure_date.split('  ')[0]+' ';
                                    $text += msg.result.response.lines[i].departure_date.split('  ')[1]+' - ';
                                    $text += msg.result.response.lines[i].arrival_date.split('  ')[0]+' ';
                                    $text += msg.result.response.lines[i].arrival_date.split('  ')[1]+'\n';
                                }
                                $text += msg.result.response.lines[i].origin +' - '+msg.result.response.lines[i].destination +'\n\n';

                                text+= `
                                <div class="row">
                                    <div class="col-lg-4">`;
                                    if(msg.result.response.offline_provider_type == 'airline')
                                        text += `<img data-toggle="tooltip" alt="`+msg.result.response.lines[i].carrier+`" style="width:50px; height:50px;" title="`+msg.result.response.lines[i].carrier+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+msg.result.response.lines[i].carrier_code+`.png"/>`;
                                    else if(msg.result.response.offline_provider_type == 'train')
                                        text += `<img data-toggle="tooltip" alt="`+msg.result.response.lines[i].carrier+`" style="width:50px; height:50px;" title="`+msg.result.response.lines[i].carrier+`" class="airline-logo" src="/static/tt_website_rodextrip/img/icon/kai.png"/>`;

                                    text+=`<h5>`+msg.result.response.lines[i].carrier+' '+msg.result.response.lines[i].carrier_number+`</h5>
                                        <span>Class : `+msg.result.response.lines[i].class+` ( Class of service `+msg.result.response.lines[i].subclass+` )</span><br/>
                                    </div>
                                    <div class="col-lg-8" style="padding-top:10px;">
                                        <div class="row">
                                            <div class="col-lg-6 col-xs-6">
                                                <table style="width:100%">
                                                    <tr>
                                                        <td><h5>`+msg.result.response.lines[i].departure_date.split('  ')[1]+`</h5></td>
                                                        <td style="padding-left:15px;">`;
                                                        if(msg.result.response.offline_provider_type == 'airline')
                                                        text+=`
                                                            <img src="/static/tt_website_rodextrip/img/icon/airlines-01.png" alt="Issued Offline Airline" style="width:20px; height:20px;"/>`;
                                                        else if(msg.result.response.offline_provider_type == 'train')
                                                        text+=`
                                                            <img src="/static/tt_website_rodextrip/img/icon/train-01.png" alt="Issued Offline Train" style="width:20px; height:20px;"/>`;
                                                        text+=`
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
                                                <span>`+msg.result.response.lines[i].departure_date.split('  ')[0]+`</span><br/>
                                                <span style="font-weight:500;">`+msg.result.response.lines[i].origin+`</span>
                                            </div>

                                            <div class="col-lg-6 col-xs-6" style="padding:0;">
                                                <table style="width:100%; margin-bottom:6px;">
                                                    <tr>
                                                        <td><h5>`+msg.result.response.lines[i].arrival_date.split('  ')[1]+`</h5></td>
                                                        <td></td>
                                                        <td style="height:30px;padding:0 15px;width:100%"></td>
                                                    </tr>
                                                </table>
                                                <span>`+msg.result.response.lines[i].arrival_date.split('  ')[0]+`</span><br/>
                                                <span style="font-weight:500;">`+msg.result.response.lines[i].destination+`</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
                            }
                            text+=`
                                </div>
                            </div>
                        </div>
                    </div>`;
                }else if(msg.result.response.offline_provider_type == 'activity'){
                    text+=`<div style="background-color:white; border:1px solid #cdcdcd;">
                        <div class="row">
                            <div class="col-lg-12">
                                <div style="padding:10px; background-color:white;">
                                <h5> Reservation Detail <img style="width:18px;" src="/static/tt_website_rodextrip/images/icon/plane.png" alt="Reservation Detail"/></h5>
                                <hr/>`;
                            check = 0;
                            flight_counter = 1;
                            for(i in msg.result.response.lines){
                                $text += 'Booking Code: ' + msg.result.response.lines[i].pnr+'\n';
                                if(i != 0){
                                    text+=`<hr/>`;
                                }
                                text+=`<h5>PNR: `+msg.result.response.lines[i].pnr+`</h5>`;
                                text+=`<h6>Reservation `+flight_counter+`</h6>`;
                                $text += 'Reservation '+ flight_counter+'\n';
                                flight_counter++;
                                $text += msg.result.response.lines[i].activity_name;
                                if(msg.result.response.lines[i].activity_package)
                                    $text += ` `+msg.result.response.lines[i].activity_package;
                                $text += '\n';
                                $text += msg.result.response.lines[i].visit_date.split('  ')[0]+' ';

                                text+= `
                                <div class="row">
                                    <div class="col-lg-6">`;
                                    text+=`<h5>`+msg.result.response.lines[i].activity_name+' '+msg.result.response.lines[i].activity_package+`</h5>
                                    </div>
                                    <div class="col-lg-6">
                                        <div class="row">
                                            <div class="col-lg-6 col-xs-6">
                                                <table style="width:100%">
                                                    <tr>
                                                        <td><h5>`+msg.result.response.lines[i].visit_date+`</h5></td>
                                                        <td style="padding-left:15px;">
                                                    </tr>
                                                </table>
                                            </div>

                                            <div class="col-lg-6 col-xs-6" style="padding:0;">
                                                <table style="width:100%; margin-bottom:6px;">

                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
                                if(msg.result.response.lines[i].description != '')
                                    text+=`<span>`+msg.result.response.lines[i].description+`</span>`;
                            }
                            text+=`
                                </div>
                            </div>
                        </div>
                    </div>`;
                }else if(msg.result.response.offline_provider_type == 'hotel'){
                    text+=`<div style="background-color:white; border:1px solid #cdcdcd;">
                        <div class="row">
                            <div class="col-lg-12">
                                <div style="padding:10px; background-color:white;">
                                <h5> Reservation Detail </h5>
                                <hr/>`;
                            check = 0;
                            flight_counter = 1;
                            for(i in msg.result.response.lines){
                                $text += 'Booking Code: ' + msg.result.response.lines[i].pnr+'\n';
                                if(i != 0){
                                    text+=`<hr/>`;
                                }
                                text+=`<h5>PNR: `+msg.result.response.lines[i].pnr+`</h5>`;
                                text+=`<h6>Reservation `+flight_counter+`</h6>`;
                                $text += 'Reservation '+ flight_counter+'\n';
                                flight_counter++;
                                $text += msg.result.response.lines[i].hotel_name;

                                $text += ' ' + msg.result.response.lines[i].room + '\n';

                                $text += 'Check in: '+msg.result.response.lines[i].check_in+'\n';
                                $text += 'Check out: '+msg.result.response.lines[i].check_out+'\n';

                                $text += msg.result.response.lines[i].description +'\n\n';

                                text+= `
                                <div class="row">
                                    <div class="col-lg-6">`;
                                    text+=`<h5>`+msg.result.response.lines[i].hotel_name+' '+msg.result.response.lines[i].room+`</h5>
                                    </div>
                                    <div class="col-lg-6">
                                        <div class="row">
                                            <div class="col-lg-12 col-xs-12">
                                                <table style="width:100%">
                                                    <tr>
                                                        <td><h5>Check in</h5></td>
                                                        <td><h5>Check out</h5></td>
                                                    </tr>
                                                    <tr>
                                                        <td>`+msg.result.response.lines[i].check_in+`</td>
                                                        <td>`+msg.result.response.lines[i].check_out+`</td>
                                                    </tr>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
                                if(msg.result.response.lines[i].description != '')
                                    text+=`<span>`+msg.result.response.lines[i].description+`</span>`;
                            }
                            text+=`
                                </div>
                            </div>
                        </div>
                    </div>`;
                }else{
                    text+=`<div style="background-color:white; border:1px solid #cdcdcd;">
                        <div class="row">
                            <div class="col-lg-12">
                                <div style="padding:10px; background-color:white;">
                                <h5> Reservation Detail </h5>
                                <hr/>`;
                            check = 0;
                            flight_counter = 1;
                            for(i in msg.result.response.lines){
                                $text += 'Booking Code: ' + msg.result.response.lines[i].pnr+'\n';
                                if(i != 0){
                                    text+=`<hr/>`;
                                }
                                text+=`<h5>PNR: `+msg.result.response.lines[i].pnr+`</h5>`;
                                if(msg.result.response.lines[i].description != '')
                                    text+=`<span>`+msg.result.response.lines[i].description+`</span>`;
                            }
                            text+=`
                                </div>
                            </div>
                        </div>
                    </div>`;
                }

                text+=`<div style="border:1px solid #cdcdcd; padding:10px; background-color:white; margin-top:20px;">
                    <h5> List of Passenger</h5>
                    <hr/>
                    <table style="width:100%" id="list-of-passenger">
                        <tr>
                            <th style="width:5%;" class="list-of-passenger-left">No</th>
                            <th style="width:30%;">Name</th>
                            <th style="width:20%;">Birth Date</th>
                        </tr>`;
                        for(pax in msg.result.response.passengers){
                            text+=`<tr>
                                <td class="list-of-passenger-left">`+(parseInt(pax)+1)+`</td>
                                <td>`+msg.result.response.passengers[pax].title+` `+msg.result.response.passengers[pax].first_name+` `+msg.result.response.passengers[pax].last_name+`</td>
                                <td>`+msg.result.response.passengers[pax].birth_date+`</td>
                            </tr>`;
                        }

                    text+=`</table>
                    </div>
                </div>

                <div class="row" style="margin-top:20px;">
                    <div class="col-lg-4" style="padding-bottom:10px;">`;
                        console.log(msg.result.response.state_offline);
                        if (msg.result.response.state_offline == 'sent'){
                            text+=`
                            <a href="#" id="seat-map-link" class="hold-seat-booking-train ld-ext-right" style="color:`+text_color+`;">
                                <input type="button" id="button-choose-print" class="primary-btn" style="width:100%;" value="Validate" onclick="validate('`+msg.result.response.order_number+`')"/>
                                <div class="ld ld-ring ld-cycle"></div>
                            </a>`;
                        }

                        text+=`
                    </div>
                    <div class="col-lg-4" style="padding-bottom:10px;">`;
                        if(msg.result.response.state != 'cancel' && msg.result.response.state != 'cancel2'){
                            if(msg.result.response.attachment.length != 0){
                                text+=`
                                <a class="issued-booking-train ld-ext-right" style="color:`+text_color+`;">
                                    <input type="button" class="primary-btn" id="button-issued-print" style="width:100%;" data-toggle="modal" data-target="#printAttachment" value="Attachment"/>
                                    <div class="ld ld-ring ld-cycle"></div>
                                </a>`;
                                text+=`
                                    <div class="modal fade" id="printAttachment" role="dialog" data-keyboard="false">
                                        <div class="modal-dialog">

                                          <!-- Modal content-->
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h4 class="modal-title" style="color:`+text_color+`">Attachment</h4>
                                                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                                                </div>
                                                <div class="modal-body">
                                                    <div class="row">
                                                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">`;
                                                            for(i in msg.result.response.attachment){
                                                                text+=`
                                                                <a href="`+msg.result.response.attachment[i].url+`" target="_blank" style="display:block;">`+msg.result.response.attachment[i].filename+`</a>`;
                                                            }
                                                            text+=`
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
                                                        <input type="button" class="primary-btn" id="button-issued-print" style="width:30%;" value="Submit" onclick="get_printout('`+msg.result.response.order_number+`', 'invoice','offline');"/>
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
                document.getElementById('offline_booking').innerHTML = text;

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
                for(i in msg.result.response.lines){
                    try{
                        text_detail+=`
                            <div style="text-align:left">
                                <span style="font-weight:500; font-size:14px;">PNR: `+msg.result.response.lines[i].pnr+` </span>
                            </div>`;
                        for(j in msg.result.response.passengers){
                            price = {'FARE': 0, 'RAC': 0, 'ROC': 0, 'TAX':0 , 'currency': '', 'CSC': 0, 'SSR': 0, 'DISC': 0};
                            for(k in msg.result.response.lines){
                                price[msg.result.response.lines[k].pnr] += 0;
                                try{
                                    price['currency'] = msg.result.response.currency;
                                }catch(err){}
                            }
                            try{
                                price['CSC'] = 0;

                            }catch(err){}
                            //repricing
                            check = 0;
                            for(k in pax_type_repricing){
                                if(pax_type_repricing[k][0] == msg.result.response.passengers[j].name)
                                    check = 1;
                            }
                            if(check == 0){
                                pax_type_repricing.push([msg.result.response.passengers[j].first_name +msg.result.response.passengers[j].last_name, msg.result.response.passengers[j].first_name +msg.result.response.passengers[j].last_name]);
                                price_arr_repricing[msg.result.response.passengers[j].first_name +msg.result.response.passengers[j].last_name] = {
                                    'Fare': price['FARE'] + price['SSR'] + price['DISC'],
                                    'Tax': price['TAX'] + price['ROC'],
                                    'Repricing': price['CSC']
                                }
                            }else{
                                price_arr_repricing[msg.result.response.passengers[j].first_name +msg.result.response.passengers[j].last_name] = {
                                    'Fare': price_arr_repricing[msg.result.response.passengers[j].first_name +msg.result.response.passengers[j].last_name]['Fare'] + price['FARE'] + price['DISC'] + price['SSR'],
                                    'Tax': price_arr_repricing[msg.result.response.passengers[j].first_name +msg.result.response.passengers[j].last_name]['Tax'] + price['TAX'] + price['ROC'],
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
                            if(counter_service_charge == 0){
                                total_price += parseInt(price.TAX + price.ROC + price.FARE + price.CSC + price.SSR + price.DISC);
                                price_provider += parseInt(price.TAX + price.ROC + price.FARE + price.CSC + price.SSR + price.DISC);
                            }else{
                                total_price += parseInt(price.TAX + price.ROC + price.FARE + price.SSR + price.DISC);
                                price_provider += parseInt(price.TAX + price.ROC + price.FARE + price.SSR + price.DISC);
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
                text_detail += `
                    <div>
                        <hr/>
                    </div>`;
                try{
                    grand_total_price = total_price+msg.result.response.total;
                    other_price = 0
                    for(i in msg.result.response.passengers){
                        other_price += msg.result.response.passengers[i]['channel_service_charges']['amount'];
                    }
                    try{
                        if(other_price != 0){
                            text_detail+=`<div class="row"><div class="col-lg-7" style="text-align:left;">
                                <span style="font-size:13px;font-weight:500;">Other Service Charge</span><br/>
                            </div>
                            <div class="col-lg-5" style="text-align:right;">`;
                            text_detail+=`
                                <span style="font-size:13px; font-weight:500;">`+price.currency+` `+other_price+`</span><br/>`;
                            text_detail+=`</div></div>`;
                            grand_total_price += other_price;
                        }
                    }catch(err){}
                }catch(err){

                }
                try{
                    offline_get_detail.result.response.total_price = grand_total_price;
                    $text += 'Grand Total: '+price.currency+' '+ getrupiah(grand_total_price);
                    if(check_provider_booking != 0 && msg.result.response.state == 'booked'){
                        $text += '\n\nPrices and availability may change at any time';
                    }
                    text_detail+=`
                    <div class="row" style="margin-bottom:10px;">
                        <div class="col-lg-6 col-xs-6" style="text-align:left;">
                            <span style="font-size:13px; font-weight: bold;">Grand Total</span>
                        </div>
                        <div class="col-lg-6 col-xs-6" style="text-align:right;">
                            <span style="font-size:13px; font-weight: bold;">`;
                            try{
                                text_detail+= price.currency+` `+getrupiah(grand_total_price);
                            }catch(err){

                            }
                            text_detail+= `</span>
                        </div>
                    </div>`;
                    if(msg.result.response.state == 'booked')
                        text_detail+=`<div style="text-align:right; padding-bottom:10px;"><img src="/static/tt_website_rodextrip/img/bank.png" alt="Bank" style="width:25px; height:25px; cursor:pointer;" onclick="show_repricing();"/></div>`;
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
                                <a href="mailto:?subject=This is the issued offline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png" alt="Email"/></a>`;
                        } else {
                            text_detail+=`
                                <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png" alt="Whatsapp"/></a>
                                <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png" alt="Line"/></a>
                                <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png" alt="Telegram"/></a>
                                <a href="mailto:?subject=This is the issued offline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png" alt="Email"/></a>`;
                        }

                    text_detail+=`
                        </div>
                    </div>`;
                    if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false)
                        text_detail+=`
                        <div class="row" id="show_commission" style="display:none;">
                            <div class="col-lg-12 col-xs-12" style="text-align:center;">
                                <div class="alert alert-success">
                                    <span style="font-size:13px; font-weight:bold;">Your Commission: `+price.currency+` `+getrupiah(parseInt(msg.result.response.commission)*-1)+`</span><br>
                                </div>
                            </div>
                        </div>`;
                    text_detail+=`<center>

                    <div style="padding-bottom:10px;">
                        <center>
                            <input type="button" class="primary-btn-white" style="width:100%;" onclick="copy_data();" value="Copy"/>
                        </center>
                    </div>`;
                    if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false)
                        text_detail+=`
                        <div style="margin-bottom:5px;">
                            <input class="primary-btn-white" id="show_commission_button" style="width:100%;" type="button" onclick="show_commission('commission');" value="Show Commission"/>
                        </div>`;
                    text_detail+=`
                </div>`;
                }catch(err){}
                document.getElementById('offline_detail').innerHTML = text_detail;
                $("#show_loading_booking_airline").hide();

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
                document.getElementById('offline_booking').innerHTML += text;
                document.getElementById('show_title_airline').hidden = false;
                document.getElementById('show_loading_booking_airline').hidden = true;
                add_repricing();
                if (msg.result.response.state != 'booked'){
    //                document.getElementById('issued-breadcrumb').classList.add("active");
                }
            }else{
                text += `<div class="alert alert-danger">
                        <h5>
                            `+msg.result.error_code+`
                        </h5>
                        `+msg.result.error_msg+`
                    </div>`;
                document.getElementById('offline_booking').innerHTML = text;
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error issued offline get booking </span>' + msg.result.error_msg,
                })
                $('#show_loading_booking_airline').hide();
                $('.loader-rodextrip').fadeOut();
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status == 500){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error issued offline get booking </span>' + errorThrown,
                })
            }
       },timeout: 60000
    });
}

function validate(data){
    $.ajax({
       type: "POST",
       url: "/webservice/issued_offline",
       headers:{
            'action': 'validate',
       },
       data: {
            'order_number': data,
            'signature': signature
       },
       success: function(msg) {
            console.log(msg);
            if(msg.result.error_code == 0){
                get_booking_offline(data);
            }else{
                text += `<div class="alert alert-danger">
                        <h5>
                            `+msg.result.error_code+`
                        </h5>
                        `+msg.result.error_msg+`
                    </div>`;
                document.getElementById('offline_booking').innerHTML = text;
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error airline booking </span>' + msg.result.error_msg,
                })
                $('#show_loading_booking_airline').hide();
                $('.loader-rodextrip').fadeOut();
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status == 500){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error history issued offline </span>' + errorThrown,
                })
            }
       },timeout: 60000
    });
}

function update_service_charge(){
    document.getElementById('offline_booking').innerHTML = '';
    upsell = []
    currency = 'IDR';
    for(i in offline_get_detail.result.response.passengers){
        list_price = []
        for(j in list){
            if(offline_get_detail.result.response.passengers[i].first_name+offline_get_detail.result.response.passengers[i].last_name == document.getElementById('selection_pax'+j).value){
                list_price.push({
                    'amount': list[j],
                    'currency_code': currency
                });
            }

        }
        upsell.push({
            'sequence': offline_get_detail.result.response.passengers[i].sequence,
            'pricing': JSON.parse(JSON.stringify(list_price))
        });
    }
    console.log(upsell);
    $.ajax({
       type: "POST",
       url: "/webservice/issued_offline",
       headers:{
            'action': 'update_service_charge',
       },
       data: {
           'order_number': offline_get_detail.result.response.order_number,
           'passengers': JSON.stringify(upsell),
           'signature': signature
       },
       success: function(msg) {
           console.log(msg);
           if(msg.result.error_code == 0){
                price_arr_repricing = {};
                pax_type_repricing = [];
                get_booking_offline(offline_get_detail.result.response.order_number);
                $('#myModalRepricing').modal('hide');
           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
           }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error issued_offline service charge </span>' + msg.result.error_msg,
                })
                $('.loader-rodextrip').fadeOut();
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status == 500){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error airline service charge </span>' + errorThrown,
                })
                $('.loader-rodextrip').fadeOut();
            }
       },timeout: 60000
    });

}