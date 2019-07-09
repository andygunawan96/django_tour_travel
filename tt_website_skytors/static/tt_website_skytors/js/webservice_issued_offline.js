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
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {},
       success: function(msg) {
           issued_offline_data = msg;
           text = '<option value=""></option>';
           for(i in issued_offline_data.transaction_type){
               text+= `<option value='`+issued_offline_data.transaction_type[i][0]+`'>`+issued_offline_data.transaction_type[i][1]+`</option>`;
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
               text+= `<option value='`+issued_offline_data.social_media_id[i].id+`'>`+issued_offline_data.social_media_id[i].name+`</option>`;
           }
           document.getElementById('social_media').innerHTML = text;
           $('#social_media').niceSelect('update');
           console.log(msg);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
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
    if(counter_line == 0 && document.getElementById('transaction_type').value == 'airline' || counter_line == 0 && document.getElementById('transaction_type').value == 'train')
        error_log += 'Please fill line\n';
    else{
        for(i=0; i < counter_line; i++){
            if(document.getElementById('transaction_type').value == 'airline' || document.getElementById('transaction_type').value == 'train'){
                if(document.getElementById('origin'+i).value == ''){
                    error_log += 'Please fill origin for line '+ (i+1) + '\n';
                    document.getElementById('origin'+i).style['border-color'] = 'red';
                }else{
                    document.getElementById('origin'+i).style['border-color'] = '#EFEFEF';
                    request["line_origin"+i] = document.getElementById('origin'+i).value;
                }if(document.getElementById('destination'+i).value == ''){
                    error_log += 'Please fill destination for line '+ (i+1) + '\n';
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
    }
//    if(document.getElementById('contact_id').value == ''){}
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
    }if(document.getElementById('pnr').value == ''){
        error_log += 'Please fill pnr\n';
        document.getElementById('pnr').style['border-color'] = 'red';
    }else{
        document.getElementById('pnr').style['border-color'] = '#EFEFEF';
        request["pnr"] = document.getElementById('pnr').value;
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
        issued_offline_signin();
    }else{
        alert(error_log);
    }

}
function issued_offline_signin(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/issued_offline",
       headers:{
            'action': 'signin',
       },
       data: {},
       success: function(msg) {
            if(msg.result.error_code == 0)
                set_data_issued_offline();

       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

function set_data_issued_offline(){
    for(i=0; i < counter_line; i++){
        if(document.getElementById('transaction_type').value == 'airline' || document.getElementById('transaction_type').value == 'train'){
            if(document.getElementById('origin'+i).value == ''){
                error_log += 'Please fill origin for line '+ (i+1) + '\n';
                document.getElementById('origin'+i).style['border-color'] = 'red';
            }else{
                document.getElementById('origin'+i).style['border-color'] = '#EFEFEF';
                request["line_origin"+i] = document.getElementById('origin'+i).value;
            }if(document.getElementById('destination'+i).value == ''){
                error_log += 'Please fill destination for line '+ (i+1) + '\n';
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
        request["total_sale_price"] = document.getElementById('total_sale_price').value;
        document.getElementById('total_sale_price').style['border-color'] = '#EFEFEF';
    }if(document.getElementById('pnr').value == ''){
        error_log += 'Please fill pnr\n';
        document.getElementById('pnr').style['border-color'] = 'red';
    }else{
        document.getElementById('pnr').style['border-color'] = '#EFEFEF';
        request["pnr"] = document.getElementById('pnr').value;
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
           alert(errorThrown);
       }
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
            error_log += 'Please fill title name for passenger '+ (i + 1) + ' !\n';
            document.getElementById('adult_nationality' + (i + 1)).style['border-color'] = 'red';
        }else{
            request['passenger_nationality_code'+i] = document.getElementById('adult_nationality' + (i + 1)).value;
            document.getElementById('adult_nationality' + (i + 1)).style['border-color'] = '#EFEFEF';
        }

        if(i == 0){
            request['passenger_cp'+i] = document.getElementById('adult_cp' + (i + 1)).checked;
            request['passenger_years_old'+i] = document.getElementById('adult_years_old' + (i + 1)).value;
            request['passenger_phone_code'+i] = document.getElementById('adult_phone_code' + (i + 1)).value;
            request['passenger_phone'+i] = document.getElementById('adult_phone' + (i + 1)).value;
            request['passenger_email'+i] = document.getElementById('adult_email' + (i + 1)).value;
        }
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
           alert(errorThrown);
       }
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
        request['passenger_passport_number'+i] = document.getElementById('adult_passport_number' + (i + 1)).value;
        request['passenger_passport_expired_date'+i] = document.getElementById('adult_passport_expired_date' + (i + 1)).value;
        request['passenger_country_of_issued'+i] = document.getElementById('adult_country_of_issued' + (i + 1)).value;


        request['passenger_cp'+i] = document.getElementById('adult_cp' + (i + 1)).checked;
        request['passenger_years_old'+i] = document.getElementById('adult_years_old' + (i + 1)).value;
        request['passenger_phone_code'+i] = document.getElementById('adult_phone_code' + (i + 1)).value;
        request['passenger_phone'+i] = document.getElementById('adult_phone' + (i + 1)).value;
        request['passenger_email'+i] = document.getElementById('adult_email' + (i + 1)).value;
        request['passenger_id'+i] = document.getElementById('adult_id' + (i + 1)).value;
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
            if(msg.result.error_code == 0)
                commit_booking();

       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

function commit_booking(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/issued_offline",
       headers:{
            'action': 'commit_booking',
       },
       data: {},
       success: function(msg) {
            console.log(msg);

       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

function get_history_issued_offline(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/issued_offline",
       headers:{
            'action': 'get_history_issued_offline',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {
            'offset': agent_offside
       },
       success: function(msg) {
            if(msg.result.response.issued_offline.length == 80){
                agent_offside++;
                table_issued_offline_history(msg.result.response.issued_offline);
                load_more = true;
            }else{
                table_issued_offline_history(msg.result.response.issued_offline);
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}