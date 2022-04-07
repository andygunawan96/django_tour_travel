var airline_data = [];
var airline_data_show = [];
var airline_data_filter = [];
var airline_pick_list = [];
var airline_provider_list_mc = [];
last_session = '';
var airline_cookie = '';
var airline_sid = '';
var dep_price = [];
var ret_price = [];
var journey = [];
var value_pick = [];
var carrier_code = [];
var check = 0;
var count = 0;
var count_progress_bar_airline = 0;
var check_airline_pick = 0;
var pnr_list = [];
var airline_list_count = 0;
var captcha_time = 10;
var choose_airline = null;
var month = {
    '01': 'Jan',
    '02': 'Feb',
    '03': 'Mar',
    '04': 'Apr',
    '05': 'May',
    '06': 'Jun',
    '07': 'Jul',
    '08': 'Aug',
    '09': 'Sep',
    '10': 'Oct',
    '11': 'Nov',
    '12': 'Dec',
}
var airline_cabin_class_list = {
    'Y': 'Economy',
    'W': 'Premium Economy',
    'W1': 'Royal Green', //BUAT CITILINK PREMIUM ECO UPDATE KE ROYAL GREEN PAK ADI YG MINTA CARRIER CODE QG
    'C': 'Business',
    'F': 'First Class',
}

var airline_departure = 'departure';
function elapse_time(departure,arrival){
    arrival_time = (parseInt(arrival[1].split(':')[0])*3600)+(parseInt(arrival[1].split(':')[1])*60);
    departure_time = (parseInt(departure[1].split(':')[0])*3600)+(parseInt(departure[1].split(':')[1])*60);
    if(departure[0] != arrival[0]){
      arrival_time+=24*3600;
    }
    var duration = arrival_time-departure_time;
    duration = {
        'hours': parseInt(duration/3600),
        'minutes': parseInt((duration/60)%60),
        'seconds': duration%60
    }
    if(duration.minutes!= 0){
        if(duration.minutes<10)
            duration = duration.hours+"h0"+duration.minutes+"m";
        else
            duration = duration.hours+"h"+duration.minutes+"m";
    }else
        duration = duration.hours+"h";
    return duration;
}

function can_book(departure, arrival){
    arrival_time = (parseInt(departure[1].split(':')[0])*3600)+(parseInt(departure[1].split(':')[1])*60);
    departure_time = (parseInt(arrival[1].split(':')[0])*3600)+(parseInt(arrival[1].split(':')[1])*60);
    departure[0].split('-')
    oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
    firstDate = new Date(departure[0].split('-')[0],departure[0].split('-')[1],departure[0].split('-')[2]);
    secondDate = new Date(departure[0].split('-')[0],departure[0].split('-')[1],departure[0].split('-')[2]);
    diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
    if(diffDays>0){
        arrival+=diffDays*24*3600;
    }
    duration=0;
    if(departure>arrival){
        duration=0;
    }else{
        duration = arrival-departure-10800;
        if(duration>0){
            duration=false;
        }else{
            duration=true;
        }
    }
    return duration;
}

function get_city(){

}

function airline_redirect_signup(type){
    if(type != 'signin'){
        getToken();
        $.ajax({
           type: "POST",
           url: "/webservice/airline",
           headers:{
                'action': 'signin',
           },
    //       url: "{% url 'tt_backend_rodextrip:social_media_tree_update' %}",
           data: {},
           success: function(msg) {
           try{
               if(msg.result.error_code == 0){
                    airline_signature = msg.result.response.signature;
                    new_login_signature = msg.result.response.signature;
                    if(type == 'get_price' || type == 'sell_journeys'){
                        signature = new_login_signature;
                        $('#myModalSignin').modal('hide');
                        location.reload();
                    }
                    if(type != 'search'){
                        $.ajax({
                           type: "POST",
                           url: "/webservice/airline",
                           headers:{
                                'action': 'search',
                           },
                           data: {
                               'use_cache': true,
                               'signature': new_login_signature
                           },
                           success: function(msg) {
                               if(msg.error_code == 0){
                                    if(type != 'get_price'){
                                        $.ajax({
                                           type: "POST",
                                           url: "/webservice/airline",
                                           headers:{
                                                'action': 'get_price_itinerary',
                                           },
                                           data: {
                                              'use_cache': true,
                                              'signature': new_login_signature,
                                              'data': JSON.stringify(airline_get_price_request)
                                           },
                                           success: function(msg) {
                                                $.ajax({
                                                   type: "POST",
                                                   url: "/webservice/airline",
                                                   headers:{
                                                        'action': 'get_fare_rules',
                                                   },
                                                   data: {
                                                        'signature': new_login_signature,
                                                        'data': JSON.stringify(airline_get_price_request)
                                                   },
                                                   success: function(msg) {
                                                        if(msg.result.error_code == 0){
                                                            if(type != 'sell_journeys'){
                                                                $.ajax({
                                                                   type: "POST",
                                                                   url: "/webservice/airline",
                                                                   headers:{
                                                                        'action': 'sell_journeys',
                                                                   },
                                                                   data: {
                                                                        'signature': new_login_signature,
                                                                        'data': JSON.stringify(airline_get_price_request)
                                                                   },
                                                                   success: function(msg) {
                                                                       if(msg.result.error_code == 0){
                                                                            $.ajax({
                                                                               type: "POST",
                                                                               url: "/webservice/airline",
                                                                               headers:{
                                                                                    'action': 'get_seat_availability',
                                                                               },
                                                                               data: {
                                                                                    'signature': new_login_signature
                                                                               },
                                                                               success: function(msg) {
                                                                                    $.ajax({
                                                                                       type: "POST",
                                                                                       url: "/webservice/airline",
                                                                                       headers:{
                                                                                            'action': 'get_ssr_availability',
                                                                                       },
                                                                                       data: {
                                                                                            'signature': new_login_signature
                                                                                       },
                                                                                       success: function(msg) {
                                                                                            $.ajax({
                                                                                               type: "POST",
                                                                                               url: "/webservice/airline",
                                                                                               headers:{
                                                                                                    'action': 'get_ff_availability',
                                                                                               },
                                                                                               data: {
                                                                                                    'signature': new_login_signature
                                                                                               },
                                                                                               success: function(msg) {
                                                                                                    signature = new_login_signature;
                                                                                                    if(type == 'review'){
                                                                                                        //ambil pax
                                                                                                         $.ajax({
                                                                                                           type: "POST",
                                                                                                           url: "/webservice/airline",
                                                                                                           headers:{
                                                                                                                'action': 'get_pax',
                                                                                                           },
                                                                                                           data: {
                                                                                                                'signature': new_login_signature
                                                                                                           },
                                                                                                           success: function(msg) {
                                                                                                                //bikin form isi input airline_pick csrf_token time_limit_input signature
                                                                                                                document.getElementById('reload_page').innerHTML +=`
                                                                                                                    <input type='hidden' name="time_limit_input" value="`+time_limit+`"/>
                                                                                                                    <input type='hidden' id="airline_pick" name="airline_pick" value=""/>
                                                                                                                    <input type='hidden' id="airline_price_itinerary" name="airline_price_itinerary" value=""/>
                                                                                                                    <input type='hidden' id="airline_price_itinerary_request" name="airline_price_itinerary_request" value=""/>
                                                                                                                    <input type='hidden' id="additional_price_input" name="additional_price_input" value=""/>
                                                                                                                    <input type='hidden' id="airline_create_passengers" name="airline_create_passengers" value=""/>
                                                                                                                    <input type='hidden' name="signature" value='`+new_login_signature+`'/>
                                                                                                                `;
                                                                                                                try{
                                                                                                                    document.getElementById('airline_pick').value = JSON.stringify(airline_pick);
                                                                                                                    document.getElementById('airline_price_itinerary').value = JSON.stringify(price_itinerary);
                                                                                                                    document.getElementById('airline_price_itinerary_request').value = JSON.stringify(airline_get_price_request);
                                                                                                                    document.getElementById('airline_create_passengers').value = JSON.stringify(msg);
                                                                                                                    document.getElementById('additional_price_input').value = JSON.stringify(additional_price);
                                                                                                                }catch(err){
                                                                                                                    console.log(err); // error kalau login di page revie ada yg salah
                                                                                                                }
                                                                                                                document.getElementById('reload_page').submit();
                                                                                                           },error: function(XMLHttpRequest, textStatus, errorThrown) {
                                                                                                           },timeout: 60000
                                                                                                         });
                                                                                                    }else{
                                                                                                        //bikin form isi input airline_pick csrf_token time_limit_input signature
                                                                                                        document.getElementById('reload_page').innerHTML +=`
                                                                                                            <input type='hidden' name="time_limit_input" value="`+time_limit+`"/>
                                                                                                            <input type='hidden' id="airline_pick" name="airline_pick" value=""/>
                                                                                                            <input type='hidden' id="airline_price_itinerary" name="airline_price_itinerary" value=""/>
                                                                                                            <input type='hidden' id="airline_price_itinerary_request" name="airline_price_itinerary_request" value=""/>
                                                                                                            <input type='hidden' id="additional_price_input" name="additional_price_input" value=""/>
                                                                                                            <input type='hidden' name="signature" value='`+new_login_signature+`'/>
                                                                                                        `;
                                                                                                        try{
                                                                                                            document.getElementById('airline_pick').value = JSON.stringify(airline_pick);
                                                                                                            document.getElementById('airline_price_itinerary').value = JSON.stringify(price_itinerary);
                                                                                                            document.getElementById('airline_price_itinerary_request').value = JSON.stringify(airline_get_price_request);
                                                                                                            document.getElementById('additional_price_input').value = JSON.stringify(additional_price);
                                                                                                        }catch(err){
                                                                                                            console.log(err); // error kalau login di page revie ada yg salah
                                                                                                        }
                                                                                                        document.getElementById('reload_page').submit();
                                                                                                    }
                                                                                                    //location.reload();
                                                                                               },
                                                                                               error: function(XMLHttpRequest, textStatus, errorThrown) {
                                                                                               },timeout: 60000
                                                                                            });
                                                                                       },
                                                                                       error: function(XMLHttpRequest, textStatus, errorThrown) {
                                                                                       },timeout: 60000
                                                                                    });
                                                                               },
                                                                               error: function(XMLHttpRequest, textStatus, errorThrown) {
                                                                               },timeout: 60000
                                                                            });
                                                                       }
                                                                   },
                                                                   error: function(XMLHttpRequest, textStatus, errorThrown) {
                                                                   },timeout: 60000
                                                                });
                                                            }else{
                                                                signature = new_login_signature;
                                                                $('#myModalSignin').modal('hide');
                                                                location.reload();
                                                            }
                                                        }
                                                   },
                                                   error: function(XMLHttpRequest, textStatus, errorThrown) {
                                                   },timeout: 60000
                                                });
                                           },
                                           error: function(XMLHttpRequest, textStatus, errorThrown) {
                                           },timeout: 120000
                                        });
                                    }else{
                                        signature = new_login_signature;
                                        $('#myModalSignin').modal('hide');
                                        location.reload();
                                    }
                               }
                           },
                           error: function(XMLHttpRequest, textStatus, errorThrown) {
                           },timeout: 120000 // sets timeout to 120 seconds
                        });
                    }else{
                        signature = new_login_signature;
                        $('#myModalSignin').modal('hide');
                        location.reload();
                    }
               }
           }catch(err){
               console.log(err)
            }
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
              error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error airline signin');
              $("#barFlightSearch").hide();
              $("#waitFlightSearch").hide();
              $('.loader-rodextrip').fadeOut();
              try{
                $("#show_loading_booking_airline").hide();
              }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
              }
           },timeout: 60000
        });
    }
}

function get_airline_data_search_page(){
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'get_data_search_page',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
           airline_request = msg.airline_request;
           airline_carriers = msg.airline_carriers;
           airline_carriers_data_awal = JSON.parse(JSON.stringify(msg.airline_carriers));
           airline_all_carriers = JSON.parse(JSON.stringify(msg.airline_all_carriers));
           airline_signin('');
           quantity_adult_flight = airline_request.adult;
           quantity_child_flight = airline_request.child;
           quantity_infant_flight = airline_request.infant;
           while(count<counter_mc){
                add_multi_city('search');
                count++;
           }
           $('#show_total_pax_flight').text(airline_request.adult + " Adult, " + airline_request.child + " Child, " + airline_request.infant + " Infant");
           try{
               //MC
               document.getElementById('adult_flight1').value = airline_request.adult;
               document.getElementById('child_flight1').value = airline_request.child;
               document.getElementById('infant_flight1').value = airline_request.infant;
               $('#show_total_pax_flight1').text(airline_request.adult + " Adult, " + airline_request.child + " Child, " + airline_request.infant + " Infant");
               if (quantity_adult_flight+quantity_child_flight == 9){
                    document.getElementById("right-plus-adult-flight1").disabled = true;
                    document.getElementById("right-plus-child-flight1").disabled = true;

                    if(quantity_adult_flight == 1 ){
                      document.getElementById("left-minus-adult-flight1").disabled = true;
                    }
                    else{
                      document.getElementById("left-minus-adult-flight1").disabled = false;
                    }

                    if(quantity_child_flight == 0){
                      document.getElementById("left-minus-child-flight1").disabled = true;
                    }
                    else{
                      document.getElementById("left-minus-child-flight1").disabled = false;
                    }
               }else{
                    if(quantity_adult_flight == 1 ){
                      document.getElementById("left-minus-adult-flight1").disabled = true;
                      document.getElementById("right-plus-adult-flight1").disabled = false;
                    }
                    else{
                      document.getElementById("left-minus-adult-flight1").disabled = false;
                      document.getElementById("right-plus-adult-flight1").disabled = false;
                    }

                    if(quantity_child_flight == 0){
                      document.getElementById("left-minus-child-flight1").disabled = true;
                      document.getElementById("right-plus-child-flight1").disabled = false;
                    }
                    else{
                      document.getElementById("left-minus-child-flight1").disabled = false;
                      document.getElementById("right-plus-child-flight1").disabled = false;
                    }
               }
               if (quantity_infant_flight == 0){
                      document.getElementById("left-minus-infant-flight1").disabled = true;
                      document.getElementById("right-plus-infant-flight1").disabled = false;
               }else if (quantity_infant_flight == quantity_adult_flight){
                      document.getElementById("left-minus-infant-flight1").disabled = false;
                      document.getElementById("right-plus-infant-flight1").disabled = true;
               }else{
                      document.getElementById("right-plus-infant-flight1").disabled = false;
                      document.getElementById("left-minus-infant-flight1").disabled = false;
               }
           }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
           }
           if (quantity_adult_flight+quantity_child_flight == 9){
                document.getElementById("right-plus-adult-flight").disabled = true;
                document.getElementById("right-plus-child-flight").disabled = true;

                if(quantity_adult_flight == 1 ){
                  document.getElementById("left-minus-adult-flight").disabled = true;
                }
                else{
                  document.getElementById("left-minus-adult-flight").disabled = false;
                }

                if(quantity_child_flight == 0){
                  document.getElementById("left-minus-child-flight").disabled = true;
                }
                else{
                  document.getElementById("left-minus-child-flight").disabled = false;
                }
           }else{
                if(quantity_adult_flight == 1 ){
                  document.getElementById("left-minus-adult-flight").disabled = true;
                  document.getElementById("right-plus-adult-flight").disabled = false;
                }
                else{
                  document.getElementById("left-minus-adult-flight").disabled = false;
                  document.getElementById("right-plus-adult-flight").disabled = false;
                }

                if(quantity_child_flight == 0){
                  document.getElementById("left-minus-child-flight").disabled = true;
                  document.getElementById("right-plus-child-flight").disabled = false;
                }
                else{
                  document.getElementById("left-minus-child-flight").disabled = false;
                  document.getElementById("right-plus-child-flight").disabled = false;
                }
           }
           if (quantity_infant_flight == 0){
                  document.getElementById("left-minus-infant-flight").disabled = true;
                  document.getElementById("right-plus-infant-flight").disabled = false;
           }else if (quantity_infant_flight == quantity_adult_flight){
                  document.getElementById("left-minus-infant-flight").disabled = false;
                  document.getElementById("right-plus-infant-flight").disabled = true;
           }else{
                  document.getElementById("right-plus-infant-flight").disabled = false;
                  document.getElementById("left-minus-infant-flight").disabled = false;
           }

       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {

       },timeout: 60000
    });

}

function get_airline_data_passenger_page(){
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'get_data_passenger_page',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
           airline_pick = msg.airline_pick;
           airline_get_price_request = msg.airline_get_price_request;
           price_itinerary = msg.price_itinerary;
           airline_carriers = msg.airline_carriers;
           airline_request = msg.airline_request;
           ff_request = msg.ff_request;
           adult = airline_request.adult;
           child = airline_request.child;
           infant = airline_request.infant;
           if(msg.hasOwnProperty('pax_cache')){
                pax_cache_reorder = msg.pax_cache;
           }
           airline_get_provider_list('passenger');
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {

       },timeout: 60000
    });
}

function auto_input_pax_cache_reorder(){
    if(pax_cache_reorder.hasOwnProperty('booker')){
        document.getElementById('booker_first_name').value = pax_cache_reorder.booker.first_name;
        document.getElementById('booker_last_name').value = pax_cache_reorder.booker.last_name;
        document.getElementById('booker_title').value = pax_cache_reorder.booker.title;
        document.getElementById('booker_email').value = pax_cache_reorder.booker.email;
        document.getElementById('booker_phone_code_id').value = pax_cache_reorder.booker.calling_code;
        document.getElementById('booker_phone').value = pax_cache_reorder.booker.mobile;
        document.getElementById('booker_id').value = pax_cache_reorder.booker.booker_seq_id;
        $('#booker_phone_code_id').val(pax_cache_reorder.booker.calling_code).trigger('change');
        $('#booker_title').niceSelect('update');
        $('#booker_nationality_id').val(pax_cache_reorder.booker.nationality_code).trigger('change');

    }
    if(pax_cache_reorder.hasOwnProperty('adult')){
        for(x in pax_cache_reorder.adult){
            if(x == 0){
                if(pax_cache_reorder.adult[x].passenger_seq_id == pax_cache_reorder.booker.booker_seq_id){
                    document.getElementsByName('myRadios')[0].checked = true;
                    copy_booker_to_passenger('copy','airline');
                }
            }
            index = parseInt(parseInt(x)+1).toString();
            document.getElementById('adult_title'+index).value = pax_cache_reorder.adult[x].title;
            document.getElementById('adult_id'+index).value = pax_cache_reorder.adult[x].passenger_seq_id;
            document.getElementById('adult_behaviors'+index).value = JSON.stringify(pax_cache_reorder.adult[x].behaviors);
            document.getElementById('adult_first_name'+index).value = pax_cache_reorder.adult[x].first_name;
            document.getElementById('adult_last_name'+index).value = pax_cache_reorder.adult[x].last_name;
            document.getElementById('adult_birth_date'+index).value = pax_cache_reorder.adult[x].birth_date;
            if(pax_cache_reorder.adult[x].identity_type != ''){
                document.getElementById('adult_id_type'+index).value = pax_cache_reorder.adult[x].identity_type;
                document.getElementById('adult_passport_number'+index).value = pax_cache_reorder.adult[x].identity_number;
                if(pax_cache_reorder.adult[x].identity_expdate != '')
                    document.getElementById('adult_passport_expired_date'+index).value = pax_cache_reorder.adult[x].identity_expdate;
                $('#adult_country_of_issued'+index+'_id').val(pax_cache_reorder.adult[x].identity_country_of_issued_name).trigger('change');
            }
            $('#adult_nationality'+index+'_id').val(pax_cache_reorder.adult[x].nationality_name).trigger('change');
            $('#adult_title'+index).niceSelect('update');
            $('#adult_id_type'+index).niceSelect('update');
        }
    }
    if(pax_cache_reorder.hasOwnProperty('child')){
        for(i in pax_cache_reorder.child){
            index = parseInt(parseInt(i)+1).toString();
            document.getElementById('child_title'+index).value = pax_cache_reorder.child[i].title;
            document.getElementById('child_id'+index).value = pax_cache_reorder.child[i].passenger_seq_id;
            document.getElementById('child_behaviors'+index).value = JSON.stringify(pax_cache_reorder.child[i].behaviors);
            document.getElementById('child_first_name'+index).value = pax_cache_reorder.child[i].first_name;
            document.getElementById('child_last_name'+index).value = pax_cache_reorder.child[i].last_name;
            document.getElementById('child_birth_date'+index).value = pax_cache_reorder.child[i].birth_date;
            if(pax_cache_reorder.child[i].identity_type != ''){
                document.getElementById('child_id_type'+index).value = pax_cache_reorder.child[i].identity_type;
                document.getElementById('child_passport_number'+index).value = pax_cache_reorder.child[i].identity_number;
                if(pax_cache_reorder.child[i].identity_expdate != '')
                    document.getElementById('child_passport_expired_date'+index).value = pax_cache_reorder.child[i].identity_expdate;
                $('#child_country_of_issued'+index+'_id').val(pax_cache_reorder.child[i].identity_country_of_issued_name).trigger('change');
            }
            $('#child_nationality'+index+'_id').val(pax_cache_reorder.child[i].nationality_name).trigger('change');
            $('#child_title'+index).niceSelect('update');
            $('#child_id_type'+index).niceSelect('update');
        }
    }
    if(pax_cache_reorder.hasOwnProperty('infant')){
        for(i in pax_cache_reorder.infant){
            index = parseInt(parseInt(i)+1).toString();
            document.getElementById('infant_title'+index).value = pax_cache_reorder.infant[i].title;
            document.getElementById('infant_id'+index).value = pax_cache_reorder.infant[i].passenger_seq_id;
            document.getElementById('infant_behaviors'+index).value = JSON.stringify(pax_cache_reorder.infant[i].behaviors);
            document.getElementById('infant_first_name'+index).value = pax_cache_reorder.infant[i].first_name;
            document.getElementById('infant_last_name'+index).value = pax_cache_reorder.infant[i].last_name;
            document.getElementById('infant_birth_date'+index).value = pax_cache_reorder.infant[i].birth_date;
            if(pax_cache_reorder.infant[i].identity_type != ''){
                document.getElementById('infant_id_type'+index).value = pax_cache_reorder.infant[i].identity_type;
                document.getElementById('infant_passport_number'+index).value = pax_cache_reorder.infant[i].identity_number;
                if(pax_cache_reorder.infant[i].identity_expdate != '')
                    document.getElementById('infant_passport_expired_date'+index).value = pax_cache_reorder.infant[i].identity_expdate;
                $('#infant_country_of_issued'+index+'_id').val(pax_cache_reorder.infant[i].identity_country_of_issued_name).trigger('change');
            }
            $('#infant_nationality'+index+'_id').val(pax_cache_reorder.infant[i].nationality_name).trigger('change');
            $('#infant_title'+index).niceSelect('update');
            $('#infant_id_type'+index).niceSelect('update');
        }
    }
}

function get_airline_data_review_page(){
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'get_data_review_page',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
           airline_pick = msg.airline_pick;
           airline_get_price_request = msg.airline_get_price_request;
           price_itinerary = msg.price_itinerary;
           airline_carriers = msg.airline_carriers;
           passengers = msg.passengers;
           passengers_ssr = msg.passengers_ssr;
           airline_request = msg.airline_request;
           airline_get_provider_list('review');

       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {

       },timeout: 60000
    });
}

function get_airline_data_review_after_sales_page(){
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'get_data_review_after_sales_page',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
           airline_carriers = msg.airline_carriers;
           passengers = msg.passengers;
           passengers_ssr = msg.passengers_ssr;
           airline_get_detail = msg.airline_get_detail;
           airline_detail('request_new');
           get_airline_review_after_sales();

       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {

       },timeout: 60000
    });
}

function get_airline_data_book_page(){
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'get_data_book_page',
       },
       data: {},
       success: function(msg) {
           airline_carriers = msg.airline_carriers;
           airline_signin(order_number);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {

       },timeout: 60000
    });

}

function get_airline_data_ssr_page(after_sales){
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'get_data_ssr_page',
       },
       data: {
            'after_sales': after_sales,
            'signature': signature
       },
       success: function(msg) {
           airline_carriers = msg.airline_carriers;
           passengers = msg.passengers;
           ssr_page_type = '';
           if(after_sales){
               airline_get_detail = msg.airline_getbooking;
               breadcrumb = 2;
               ssr_page_type = 'request_new';
               airline_get_provider_list('ssr');
           }else{
               airline_pick = msg.airline_pick;
               price_itinerary = msg.price_itinerary;
               airline_request = msg.airline_request;
               breadcrumb = 1;
               airline_get_provider_list('ssr');
           }
           $( document ).ready(function() {
                if(breadcrumb == 1)
                    breadcrumb_create("airline", 3, 0);
                else{
                    breadcrumb_create("airline_new", 4, 1);
                }
           });
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {

       },timeout: 60000
    });

}

function get_airline_data_seat_page(after_sales){
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'get_data_seat_page',
       },
       data: {
            'after_sales': after_sales,
            'signature': signature
       },
       success: function(msg) {
           airline_carriers = msg.airline_carriers;
           passengers = msg.passengers;
           seat_page_type = '';
           if(after_sales){
               airline_get_detail = msg.airline_getbooking;
               breadcrumb = 2;
               seat_page_type = 'request_new';
               airline_get_provider_list('seat');
           }else{
               airline_pick = msg.airline_pick;
               price_itinerary = msg.price_itinerary;
               airline_request = msg.airline_request;
               breadcrumb = 1;
               airline_get_provider_list('seat');
           }

           get_seat_map_response();
           set_first_passenger_seat_map_airline(0);
           $( document ).ready(function() {
                if(breadcrumb == 1)
                    breadcrumb_create("airline", 3, 0);
                else{
                    breadcrumb_create("airline", 3, 1);
                }
           });
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {

       },timeout: 60000
    });

}

function airline_signin(data,type=''){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'signin',
       },
//       url: "{% url 'tt_backend_rodextrip:social_media_tree_update' %}",
       data: {},
       success: function(msg) {
       try{
           if(msg.result.error_code == 0){
               airline_signature = msg.result.response.signature;
               signature = msg.result.response.signature;
               if(data == '' && type == ''){
                   airline_get_provider_list('search');
               }else if(data != '' && type == ''){
                   get_airline_config('home');
                   airline_get_provider_list('get_booking', data); //get booking pindah di dalem get provider list karena jika get booking balik dulu provider error tidak ada
               }else if(data != '' && type == 'refund'){
                   airline_get_provider_list('refund', data); //get booking pindah di dalem get provider list karena jika get booking balik dulu provider error tidak ada
               }else if(data != '' && type == 'reorder'){
                   search_reorder(); //re order
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
               }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
               }
           }
       }catch(err){
           $("#barFlightSearch").hide();
           $("#waitFlightSearch").hide();

           Swal.fire({
               type: 'error',
               title: 'Oops...',
               text: 'Something went wrong, please try again or check your internet connection',
           })
           $('.loader-rodextrip').fadeOut();
           document.getElementById("airlines_error").innerHTML = '';
           text = '';
           text += `
           <div class="alert alert-warning" style="border:1px solid #cdcdcd;" role="alert">
               <span style="font-weight:bold;"> Oops! Something went wrong, please try again or check your internet connection</span>
           </div>`;
           var node = document.createElement("div");
           node.innerHTML = text;
           document.getElementById("airlines_error").appendChild(node);
           node = document.createElement("div");
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
          error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error airline signin');
          $("#barFlightSearch").hide();
          $("#waitFlightSearch").hide();
          $('.loader-rodextrip').fadeOut();
          try{
            $("#show_loading_booking_airline").hide();
          }catch(err){
            console.log(err); // error kalau ada element yg tidak ada
          }
       },timeout: 60000
    });

}

function get_carrier_code_list(type, val){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'get_carriers_search',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
           airline_provider_list = msg;
           text=`<div class="row"><div class="col-lg-12" style="overflow-y:auto;overflow-x:hidden;height:235px;">`;
           if(type == 'groupbooking'){
               list_carrier = ['JT','GA','AK','QG']
               for(i in msg){
                    if(list_carrier.includes(i)){
                        text+=`
                            <li>
                                <label class="radio-button-custom crlabel">
                                    <span style="font-size:13px;">`+msg[i].display_name+`</span>
                                    <input type="radio" name="carrier_code" value="`+i+`" onchange="choose_airline_groupbooking('`+msg[i].display_name+`');">
                                    <span class="checkmark-radio"></span>
                                </label>
                            </li>`;
                    }
               }
           }else if(type != 'search'){
               text += `
                    <li>
                        <a class="small" data-value="option1" tabIndex="-1">
                            <label class="check_box_custom">
                                <span class="span-search-ticket" style="color:black;">All</span>`;
                                if(val == undefined)
                                text+=`
                                    <input type="checkbox" id="provider_box_All" name="provider_box_All" value="all" checked="checked" onclick="func_check_provider('all')"/>`;
                                else{
                                    if(document.getElementById('provider_box_All').checked == false)
                                        text+=`
                                            <input type="checkbox" id="provider_box_All_`+val+`" name="provider_box_All_`+val+`" value="all" onclick="func_check_provider('all',`+val+`)"/>`;
                                    else
                                        text+=`
                                            <input type="checkbox" id="provider_box_All_`+val+`" name="provider_box_All_`+val+`" value="all" checked="checked" onclick="func_check_provider('all',`+val+`)"/>`;
                                }
                                text+=`
                                <span class="check_box_span_custom"></span>
                            </label>
                        </a>
                        <br/>
                    </li>
               `;
               for(i in msg){
                    if(msg[i].hasOwnProperty('is_excluded_from_b2c') && msg[i].is_excluded_from_b2c != true || user_login.co_agent_frontend_security.includes('b2c_limitation') == false){
                        text+=`
                            <li>
                                <a class="small" data-value="option1" tabIndex="-1">
                                    <label class="check_box_custom">
                                        <span class="span-search-ticket" style="color:black;">`+msg[i].display_name+`</span>`;
                                        if(val == undefined)
                                        text+=`
                                            <input type="checkbox" id="provider_box_`+i+`" name="provider_box_`+i+`" value="`+i+`" onclick="func_check_provider('`+i+`')"/>`;
                                        else{
                                            if(document.getElementById('provider_box_'+i).checked == false)
                                                text+=`
                                                    <input type="checkbox" id="provider_box_`+i+`_`+val+`" name="provider_box_`+i+`_`+val+`" value="`+i+`" onclick="func_check_provider('`+i+`',`+val+`)"/>`;
                                            else
                                                text+=`
                                                    <input type="checkbox" id="provider_box_`+i+`_`+val+`" name="provider_box_`+i+`_`+val+`" value="`+i+`" checked="checked" onclick="func_check_provider('`+i+`',`+val+`)"/>`;
                                        }
                                        text+=`
                                        <span class="check_box_span_custom"></span>
                                    </label>
                                </a>
                                <br/>
                            </li>`;
                    }
               }
           }else{
               try{
                   text = `
                    <li>
                        <a class="small" data-value="option1" tabIndex="-1">
                            <label class="check_box_custom">
                                <span class="span-search-ticket" style="color:black;">All</span>`;
                                if(val == undefined)
                                text+=`
                                    <input type="checkbox" id="provider_box_All" name="provider_box_All" value="all" checked="checked" onclick="func_check_provider('all')"/>`;
                                else{
                                    if(document.getElementById('provider_box_All').checked == true){
                                        text+=`
                                            <input type="checkbox" id="provider_box_All_`+val+`" name="provider_box_All_`+val+`" value="all" checked="checked" onclick="func_check_provider('all',`+val+`)"/>`;
                                    }else
                                        text+=`
                                            <input type="checkbox" id="provider_box_All_`+val+`" name="provider_box_All_`+val+`" value="all" onclick="func_check_provider('all',`+val+`)"/>`;
                                }
                                text+=`
                                <span class="check_box_span_custom"></span>
                            </label>
                        </a>
                        <br/>
                    </li>`;
                   for(i in airline_carriers_data_awal[0]){
                        if(airline_carriers_data_awal[0][i].is_excluded_from_b2c != true || user_login.co_agent_frontend_security.includes('b2c_limitation') == false){
                            if(i != 'All'){
                                text+=`
                                    <li>
                                        <a class="small" data-value="option1" tabIndex="-1">
                                            <label class="check_box_custom">
                                                <span class="span-search-ticket" style="color:black;">`+airline_carriers_data_awal[0][i].display_name+`</span>`;
                                                if(val == undefined)
                                                text+=`
                                                    <input type="checkbox" id="provider_box_`+i+`" name="provider_box_`+i+`" value="`+i+`" onclick="func_check_provider('`+i+`')"/>`;
                                                else{
                                                    try{
                                                        if(document.getElementById('provider_box_'+i).checked == true)
                                                            text+=`
                                                                <input type="checkbox" id="provider_box_`+i+`_`+val+`" name="provider_box_`+i+`_`+val+`" value="`+i+`" onclick="func_check_provider('`+i+`',`+val+`)" checked="checked"/>`;
                                                        else
                                                            text+=`
                                                                <input type="checkbox" id="provider_box_`+i+`_`+val+`" name="provider_box_`+i+`_`+val+`" value="`+i+`" onclick="func_check_provider('`+i+`',`+val+`)"/>`;
                                                    }catch(err){
                                                        if(airline_carriers_data_awal[val-1][i].bool == true)
                                                            text+=`
                                                                <input type="checkbox" id="provider_box_`+i+`_`+val+`" name="provider_box_`+i+`_`+val+`" value="`+i+`" onclick="func_check_provider('`+i+`',`+val+`)" checked="checked"/>`;
                                                        else
                                                            text+=`
                                                                <input type="checkbox" id="provider_box_`+i+`_`+val+`" name="provider_box_`+i+`_`+val+`" value="`+i+`" onclick="func_check_provider('`+i+`',`+val+`)"/>`;
                                                    }
                                                }
                                                text+=`
                                                <span class="check_box_span_custom"></span>
                                            </label>
                                        </a>
                                        <br/>
                                    </li>`;
                            }
                        }
                   }
               }catch(err){

               }
           }
           text+=`</div><div class="col-lg-12" style="text-align:right;"><hr/><button class="primary-btn" type="button" style="line-height:34px;" onclick="next_focus_element('airline','airline');">Done</button></div>
           </div>`;
           if(val == undefined){
               if(document.getElementById('provider_flight_content'))
                    document.getElementById('provider_flight_content').innerHTML = text;
//               try{
//                   document.getElementById('provider_flight_content').innerHTML = text;
//               }catch(err){
//
//               }
           }else{
                if(document.getElementById('provider_flight_content'+val))
                    document.getElementById('provider_flight_content'+val).innerHTML = text;
//               try{
//                   document.getElementById('provider_flight_content'+val).innerHTML = text;
//               }catch(err){
//                   console.log(err);
//               }
           }
           if(type != 'groupbooking')
            first_value_provider();
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error airline carrier code list');
            $('.loader-rodextrip').fadeOut();
       },timeout: 60000
    });

}

//function get_carriers_search(type, val){
//    getToken();
//    $.ajax({
//       type: "POST",
//       url: "/webservice/airline",
//       headers:{
//            'action': 'get_carriers_search',
//       },
//       data: {
//            'signature': signature
//       },
//       success: function(msg) {
//           console.log(msg);
//       },
//       error: function(XMLHttpRequest, textStatus, errorThrown) {
//            Swal.fire({
//              type: 'error',
//              title: 'Oops!',
//              html: '<span style="color: red;">Error airline carrier code list </span>' + errorThrown,
//            })
//            $('.loader-rodextrip').fadeOut();
//       },timeout: 60000
//    });
//
//}

function get_carrier_providers(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'get_carrier_providers',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
           provider_list = msg;
           carrier_to_provider();
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error airline provider list');
           $('.loader-rodextrip').fadeOut();
           $("#barFlightSearch").hide();
           $("#waitFlightSearch").hide();
           document.getElementById("airlines_error").innerHTML = '';
            text = '';
            text += `
                <div class="alert alert-warning" style="border:1px solid #cdcdcd;" role="alert">
                    <span style="font-weight:bold;"> Oops! Something went wrong, please try again or check your internet connection</span>
                </div>
            `;
            var node = document.createElement("div");
            node.innerHTML = text;
            document.getElementById("airlines_error").appendChild(node);
            node = document.createElement("div");
       },timeout: 60000
    });

}

function get_carriers(){
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'get_carriers',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
           airline_carriers[0] = msg;
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {

       },timeout: 60000
    });
}

function get_provider_booking_from_vendor(){
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'get_provider_booking_from_vendor',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
           if(msg.result.error_code == 0)
               airline_provider_list_from_vendor = msg.result.response.list_provider
           else
               airline_provider_list_from_vendor = [];

           for(i in airline_provider_list_from_vendor){
                document.getElementById('provider_booking_from_vendor').innerHTML += `<option value="`+airline_provider_list_from_vendor[i][0]+`">`+airline_provider_list_from_vendor[i][1]+`</option>`;
           }
           $('#provider_booking_from_vendor').niceSelect('update');
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {

       },timeout: 60000
    });
}

function get_retrieve_booking_from_vendor(){
    if(document.getElementById('pnr2').value != ''){
        document.getElementById('retrieve_booking_from_vendor').disabled = true;
        $('.loader-rodextrip').fadeIn();
        $.ajax({
           type: "POST",
           url: "/webservice/airline",
           headers:{
                'action': 'get_retrieve_booking_from_vendor',
           },
           data: {
                'signature': signature,
                'pnr':  document.getElementById('pnr2').value,
                'provider': document.getElementById('provider_booking_from_vendor').value
           },
           success: function(msg) {
               data_get_retrieve_booking = msg;
               if(msg.result.error_code == 0){
                   response = draw_get_booking(msg.result.response)
                   document.getElementById('result_get_booking_from_vendor').innerHTML = response;
               }else{
                   Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: msg.result.error_additional_msg,
                   })
               }
               document.getElementById('retrieve_booking_from_vendor').disabled = false;
               $('.loader-rodextrip').fadeOut();
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
               document.getElementById('retrieve_booking_from_vendor').disabled = false;
               $('.loader-rodextrip').fadeOut();
           },timeout: 60000
        });
    }else{
        Swal.fire({
          type: 'error',
          title: 'Oops!',
          html: 'Please fill pnr',
        })
    }
}

function draw_get_booking(msg){
    text = '';

    var localTime;
    text+=`
    <div style="background-color:white; border:1px solid #cdcdcd;">
        <div class="row">
            <div class="col-lg-12">
                <div style="padding:10px; background-color:white;">
                    <div class="row">
                        <div class='col-lg-4'>
                        </div>
                        <div class='col-lg-4'>
                            <h5> Flight Detail <img style="width:18px;margin-top:-5px;" src="/static/tt_website_rodextrip/img/icon/airplane.png" alt="Flight Detail"/></h5>
                        </div>
                        <div class='col-lg-4'>
                            <h5>`+msg.status+`</h5>
                        </div>
                    </div>
                <hr/>`;
            check = 0;
            flight_counter = 1;
            text+=`<h5>PNR: `+msg.pnr+`</h5>`;
            for(i in msg.journeys){
                for(j in msg.journeys[i].segments){
                    if(j != 0){
                        text+=`<hr/>`;
                    }
                    text+=`<h6>Flight `+flight_counter+`</h6>`;
                    flight_counter++;
                    for(k in msg.journeys[i].segments[j].legs){
                        text+= `
                            <div class="row">
                                <div class="col-lg-2">`;
                                try{
                                    text += `<img data-toggle="tooltip" style="width:50px; height:50px;" alt="`+airline_carriers[0][msg.journeys[i].segments[j].legs[k].carrier_code].name+`" title="`+airline_carriers[0][msg.journeys[i].segments[j].legs[k].carrier_code].name+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+msg.journeys[i].segments[j].legs[k].carrier_code+`.png"/>`;
                                }catch(err){
                                    text += `<img data-toggle="tooltip" style="width:50px; height:50px;" alt="`+msg.journeys[i].segments[j].legs[k].carrier_code+`" title="`+msg.journeys[i].segments[j].legs[k].carrier_code+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+msg.journeys[i].segments[j].legs[k].carrier_code+`.png"/>`;
                                }
                                text+=`<h5>`+msg.journeys[i].segments[j].legs[k].carrier_name+`</h5><br/>
                                </div>
                                <div class="col-lg-10" style="padding-top:10px;">
                                    <div class="row">
                                        <div class="col-lg-6 col-xs-6">
                                            <table style="width:100%">
                                                <tr>
                                                    <td><h5>`+msg.journeys[i].segments[j].legs[k].departure_date.split('  ')[1]+`</h5></td>
                                                    <td style="padding-left:15px;">
                                                        <img src="/static/tt_website_rodextrip/img/icon/airlines-01.png" alt="Airline" style="width:20px; height:20px;"/>
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
                                            <span>`+msg.journeys[i].segments[j].legs[k].departure_date.split('  ')[0]+`</span><br/>
                                            <span style="font-weight:500;">`+msg.journeys[i].segments[j].legs[k].origin_name+` - `+msg.journeys[i].segments[j].legs[k].origin_city+` (`+msg.journeys[i].segments[j].legs[k].origin+`)</span>
                                        </div>

                                        <div class="col-lg-6 col-xs-6" style="padding:0;">
                                            <table style="width:100%; margin-bottom:6px;">
                                                <tr>
                                                    <td><h5>`+msg.journeys[i].segments[j].legs[k].arrival_date.split('  ')[1]+`</h5></td>
                                                    <td></td>
                                                    <td style="height:30px;padding:0 15px;width:100%"></td>
                                                </tr>
                                            </table>
                                            <span>`+msg.journeys[i].segments[j].legs[k].arrival_date.split('  ')[0]+`</span><br/>
                                            <span style="font-weight:500;">`+msg.journeys[i].segments[j].legs[k].destination_name+` - `+msg.journeys[i].segments[j].legs[k].destination_city+` (`+msg.journeys[i].segments[j].legs[k].destination+`)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
                    }
                }
            }
            text+=`
                </div>
            </div>
        </div>
    </div>`;
    text+=`

    <div style="border:1px solid #cdcdcd; padding:10px; background-color:white; margin-top:20px;">
        <h5> List of Passenger</h5>
        <hr/>
        <table style="width:100%" id="list-of-passenger">
            <tr>
                <th style="width:5%;" class="list-of-passenger-left">No</th>
                <th style="width:30%;">Name</th>
                <th style="width:20%;">Birth Date</th>
            </tr>`;
            for(pax in msg.passengers){
                text+=`
                <tr>
                    <td class="list-of-passenger-left">`+(parseInt(pax)+1)+`</td>
                    <td>`+msg.passengers[pax].title+` `+msg.passengers[pax].first_name+` `+msg.passengers[pax].last_name+`</td>
                    <td>-</td>
                </tr>`;
            }

        text+=`</table>
        </div>
    </div>`;
    price = [];
    for(i in msg.journeys){
        for(j in msg.journeys[i].segments){
            for(k in msg.journeys[i].segments[j].fares){
                for(l in msg.journeys[i].segments[j].fares[k].service_charge_summary){
                    price.push(msg.journeys[i].segments[j].fares[k].service_charge_summary[l])
                }
            }
        }
    }
    for(i in price){
        text+=`
        <div class="row" style="margin-bottom:5px;">
            <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                <span style="font-size:12px;">`+price[i].pax_count+`x Fare `+price[i].pax_type+` @`+price[i].service_charges[0].currency+` `+getrupiah(price[i].total_fare/price[i].pax_count)+`</span>`;
            text+=`</div>
            <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                <span style="font-size:13px;">`+price[i].service_charges[0].currency+` `+getrupiah(price[i].total_fare)+`</span>
            </div>
        </div>`;
        text+=`
        <div class="row" style="margin-bottom:5px;">
            <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                <span style="font-size:12px;">`+price[i].pax_count+`x Tax `+price[i].pax_type+` @`+price[i].service_charges[0].currency+` `+getrupiah(price[i].total_tax/price[i].pax_count)+`</span>`;
            text+=`</div>
            <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                <span style="font-size:13px;">`+price[i].service_charges[0].currency+` `+getrupiah(price[i].total_tax)+`</span>
            </div>
        </div>`;
    }
    text+=`
        <div class="row" style="margin-bottom:5px;">
            <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                <span style="font-size:12px;">Grand Total</span>`;
            text+=`</div>
            <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                <span style="font-size:13px;">`+price[0].service_charges[0].currency+` `+getrupiah(msg.total_price)+`</span>
            </div>
        </div>`;
    //pilih booker
    //button save backend
    text += `<input type="button" id="save_retrieve_booking_from_vendor_id" class="primary-btn" onclick="save_retrieve_booking_from_vendor();" value="Save to backend"/>`
    return text;
}

function save_retrieve_booking_from_vendor(){
    if(document.getElementById('booker_vendor_id').value != ''){
        document.getElementById('save_retrieve_booking_from_vendor_id').disabled = true;
        $.ajax({
           type: "POST",
           url: "/webservice/airline",
           headers:{
                'action': 'save_retrieve_booking_from_vendor',
           },
           data: {
                'signature': signature,
                'booker_id': document.getElementById('booker_vendor_id').value,
                'response': JSON.stringify(data_get_retrieve_booking),
                'customer_parent_id': document.getElementById('customer_parent_booking_from_vendor').value
    //            'duplicate_pnr': document.getElementById('duplicate_pnr').checked
           },
           success: function(msg) {
               if(msg.result.error_code == 0){
                   Swal.fire({
                      type: 'success',
                      title: 'Update!',
                      html: msg.result.error_msg,
                   })
                   document.getElementById('pnr2').value = '';
                   document.getElementById('booker_vendor').value = '';
                   document.getElementById('booker_vendor_id').value = '';
                   document.getElementById('result_get_booking_from_vendor').innerHTML = '';
                   window.location= "/airline/booking/"+btoa(msg.result.response.order_number);
               }else{
                   Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: msg.result.error_additional_message,
                   })
               }
               document.getElementById('save_retrieve_booking_from_vendor_id').disabled = false;
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {

           },timeout: 60000
        });
    }else{
        Swal.fire({
          type: 'error',
          title: 'Oops!',
          html: 'Please input booker',
        })
    }
}


function airline_get_provider_list(type, data=''){
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'get_provider_description',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
           provider_list_data = msg;

           airline_carriers_full = msg;
           if(type == 'review'){
                check_ssr = 0;
                check_seat = 0;
                check_hold_booking = 1;
                check_force_issued = 1;
                for(i in airline_pick){
                    if(provider_list_data[airline_pick[i].provider].is_pre_ssr == true)
                        check_ssr = 1;
                    if(provider_list_data[airline_pick[i].provider].is_pre_seat == true)
                        check_seat = 1;
                    if(provider_list_data[airline_pick[i].provider].is_pre_book == false)
                        check_hold_booking = 0;
                    if(provider_list_data[airline_pick[i].provider].is_pre_issue == false)
                        check_force_issued = 0;
                }

                try{
                    if(check_ssr == 0)
                        document.getElementById('ssr_btn').remove();
                }catch(err){
                }
                try{
                    if(check_seat == 0)
                        document.getElementById('seat_btn').remove();
                }catch(err){
                }
                try{
                    if(check_hold_booking == 0)
                        document.getElementById('hold_booking_btn').remove();
                }catch(err){
                }
                try{
                    if(check_force_issued == 0)
                        document.getElementById('force_issued_btn').remove();
                }catch(err){
                }
                airline_detail('');
                get_airline_review();


           }else if(type == 'passenger'){
                check_ff = 0;
                for(i in airline_pick){
                    if(provider_list_data[airline_pick[i].provider].is_pre_frequent_flyer == true)
                        check_ff = 1;
                }
                if(check_ff == 0){
                    for(i=1;i<=adult;i++){
                        for(j=1;j<=ff_request.length;j++){
                            try{
                                document.getElementById('adult_ff_program_'+i+'_'+j).innerHTML = '';
                                document.getElementById('adult_ff_value_'+i+'_'+j).innerHTML = '';
                            }catch(err){console.log(err)}
                        }
                    }
                    for(i=1;i<=child;i++){
                        for(j=1;j<=ff_request.length;j++){
                            try{
                                document.getElementById('child_ff_program_'+i+'_'+j).innerHTML = '';
                                document.getElementById('child_ff_value_'+i+'_'+j).innerHTML = '';
                            }catch(err){console.log(err)}
                        }
                    }
                    for(i=1;i<=infant;i++){
                        for(j=1;j<=ff_request.length;j++){
                            try{
                                document.getElementById('infant_ff_program_'+i+'_'+j).innerHTML = '';
                                document.getElementById('infant_ff_value_'+i+'_'+j).innerHTML = '';
                            }catch(err){console.log(err)}
                        }
                    }
                }
                $(function() {
                    airline_detail('');
                    document.getElementById('airline_sell_journey').value = JSON.stringify(price_itinerary);
                    for (var i = 1; i <= adult; i++){
                        document.getElementById("train_adult"+i+"_search").addEventListener("keyup", function(event) {
                            if (event.keyCode === 13) {
                                event.preventDefault();
                                var adult_enter = "search_adult_"+event.target.id.toString().replace(/[^\d.]/g, '');
                                document.getElementById(adult_enter).click();
                            }
                        });

                        $('input[name="adult_birth_date'+i+'"]').daterangepicker({
                            singleDatePicker: true,
                            autoUpdateInput: true,
                            startDate: moment().subtract(18, 'years'),
                            minDate: moment(airline_request.departure[airline_request.departure.length-1],'DD MMM YYYY').subtract(100, 'years'),
                            maxDate: moment(airline_request.departure[airline_request.departure.length-1],'DD MMM YYYY').subtract(12, 'years'),
                            showDropdowns: true,
                            opens: 'center',
                            locale: {
                                format: 'DD MMM YYYY',
                            }
                        });
                        if(birth_date_required == false)
                            $('input[name="adult_birth_date'+i+'"]').val("");

                        $('input[name="adult_passport_expired_date'+i+'"]').daterangepicker({
                            singleDatePicker: true,
                            autoUpdateInput: true,
                            startDate: moment().subtract(-1,'years'),
                            minDate: moment().subtract(-1, 'days'),
                            showDropdowns: true,
                            opens: 'center',
                            locale: {
                                format: 'DD MMM YYYY',
                            }
                        });
                        $('input[name="adult_passport_expired_date'+i+'"]').val("");
                    }

                    for (var i = 1; i <= child; i++){
                        document.getElementById("train_child"+i+"_search").addEventListener("keyup", function(event) {
                          if (event.keyCode === 13) {
                             event.preventDefault();
                             var child_enter = "search_child_"+event.target.id.toString().replace(/[^\d.]/g, '');
                             document.getElementById(child_enter).click();
                          }
                        });


                        $('input[name="child_birth_date'+i+'"]').daterangepicker({
                            singleDatePicker: true,
                            autoUpdateInput: true,
                            startDate: moment().subtract(5, 'years'),
                            minDate: moment(airline_request.departure[airline_request.departure.length-1],'DD MMM YYYY').subtract(11, 'years').subtract(365, 'days'),
                            maxDate: moment(airline_request.departure[airline_request.departure.length-1],'DD MMM YYYY').subtract(2, 'years'),
                            showDropdowns: true,
                            opens: 'center',
                            locale: {
                                format: 'DD MMM YYYY',
                            }
                        });
                          //$('input[name="child_birth_date'+i+'"]').val("");

                        $('input[name="child_passport_expired_date'+i+'"]').daterangepicker({
                            singleDatePicker: true,
                            autoUpdateInput: true,
                            startDate: moment().subtract(-1,'years'),
                            minDate: moment().subtract(-1, 'days'),
                            showDropdowns: true,
                            opens: 'center',
                            locale: {
                                format: 'DD MMM YYYY',
                            }
                        });
                        $('input[name="child_passport_expired_date'+i+'"]').val("");
                    }

                    for (var i = 1; i <= infant; i++){
                        document.getElementById("train_infant"+i+"_search").addEventListener("keyup", function(event) {
                          if (event.keyCode === 13) {
                            event.preventDefault();
                            var infant_enter = "search_infant_"+event.target.id.toString().replace(/[^\d.]/g, '');
                            document.getElementById(infant_enter).click();
                          }
                        });

                        $('input[name="infant_birth_date'+i+'"]').daterangepicker({
                            singleDatePicker: true,
                            autoUpdateInput: true,
                            startDate: moment().subtract(1, 'years'),
                            minDate: moment(airline_request.departure[airline_request.departure.length-1],'DD MMM YYYY').subtract(1, 'years').subtract(364, 'days'),
                            maxDate: moment(),
                            showDropdowns: true,
                            opens: 'center',
                            locale: {
                                format: 'DD MMM YYYY',
                            }
                        });
                          //$('input[name="infant_birth_date'+i+'"]').val("");

                        $('input[name="infant_passport_expired_date'+i+'"]').daterangepicker({
                            singleDatePicker: true,
                            autoUpdateInput: true,
                            startDate: moment().subtract(-1,'years'),
                            minDate: moment().subtract(-1, 'days'),
                            showDropdowns: true,
                            opens: 'center',
                            locale: {
                                format: 'DD MMM YYYY',
                            }
                        });
                        $('input[name="infant_passport_expired_date'+i+'"]').val("");
                      }
                    if (typeof pax_cache_reorder !== 'undefined'){
                        auto_input_pax_cache_reorder();
                    }
                   });
           }else if(type == 'search'){
                get_carrier_providers('search');
           }else if(type == 'get_booking'){
                airline_get_booking(data);
           }else if(type == 'refund'){
                airline_get_booking_refund(data);
           }else if(type == 'ssr'){
                airline_detail(ssr_page_type);
           }else if(type == 'seat'){
                airline_detail(seat_page_type);
           }
           //carrier_to_provider();
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error airline provider list');
           $('.loader-rodextrip').fadeOut();
           $("#barFlightSearch").hide();
           $("#waitFlightSearch").hide();
           document.getElementById("airlines_error").innerHTML = '';
            text = '';
            text += `
                <div class="alert alert-warning" style="border:1px solid #cdcdcd;" role="alert">
                    <span style="font-weight:bold;"> Oops! Something went wrong, please try again or check your internet connection</span>
                </div>
            `;
            var node = document.createElement("div");
            node.innerHTML = text;
            document.getElementById("airlines_error").appendChild(node);
            node = document.createElement("div");
       },timeout: 60000
    });

}

function carrier_to_provider(){
    airline = [];
    for(i in airline_carriers_data_awal){
        airline.push({});
        for(j in airline_carriers_data_awal[i]){
            if(airline_carriers_data_awal[i][j].code == 'all' && airline_carriers_data_awal[i][j].bool == true){
                for(i in airline_carriers_data_awal){
                    for(j in airline_carriers_data_awal[i]){
                        try{
                            if(airline_carriers_data_awal[i][j].code != 'all'){
                                if(airline[i].hasOwnProperty(airline_carriers_data_awal[i][j].code) == false)
                                    for(k in airline_carriers_data_awal[i][j].provider){
                                        if(provider_list[airline_carriers_data_awal[i][j].code].includes(airline_carriers_data_awal[i][j].provider[k]) == true){
                                            if(airline[i].hasOwnProperty(airline_carriers_data_awal[i][j].code) == true)
                                                airline[i][airline_carriers_data_awal[i][j].code].push(airline_carriers_data_awal[i][j].provider[k]);
                                            else
                                                airline[i][airline_carriers_data_awal[i][j].code] = [airline_carriers_data_awal[i][j].provider[k]];
                                        }
                                    }
                                else{
                                    for(k in airline_carriers_data_awal[i][j].provider){
                                        if(airline[i][airline_carriers_data_awal[i][j].code].includes(airline_carriers_data_awal[i][j].provider[k]) == false && provider_list[airline_carriers_data_awal[i][j].code].includes(airline_carriers_data_awal[i][j].provider[k]))
                                            if(airline[i].hasOwnProperty(airline_carriers_data_awal[i][j].code) == true)
                                                airline[i][airline_carriers_data_awal[i][j].code].push(airline_carriers_data_awal[i][j].provider[k]);
                                            else
                                                airline[i][airline_carriers_data_awal[i][j].code] = [airline_carriers_data_awal[i][j].provider[k]];
                                    }
                                }
                            }
                        }catch(err){console.log(err);}
                    }
                }
                break
            }else if(airline_carriers_data_awal[i][j].bool == true){
                try{
                    if(airline[i].hasOwnProperty(airline_carriers_data_awal[i][j].code) == false)
                        for(k in airline_carriers_data_awal[i][j].provider){
                            if(provider_list[airline_carriers_data_awal[i][j].code].includes(airline_carriers_data_awal[i][j].provider[k]) == true){
                                if(airline[i].hasOwnProperty(airline_carriers_data_awal[i][j].code) == true)
                                    airline[i][airline_carriers_data_awal[i][j].code].push(airline_carriers_data_awal[i][j].provider[k]);
                                else
                                    airline[i][airline_carriers_data_awal[i][j].code] = [airline_carriers_data_awal[i][j].provider[k]];
                            }
                        }
                    else{
                        for(k in airline_carriers_data_awal[i][j].provider){
                            if(airline[i][airline_carriers_data_awal[i][j].code].includes(airline_carriers_data_awal[i][j].provider[k]) == false && provider_list[airline_carriers_data_awal[i][j].code].includes(airline_carriers_data_awal[i][j].provider[k]))
                                if(airline[i].hasOwnProperty(airline_carriers_data_awal[i][j].code) == true)
                                    airline[i][airline_carriers_data_awal[i][j].code].push(airline_carriers_data_awal[i][j].provider[k]);
                                else
                                    airline[i][airline_carriers_data_awal[i][j].code] = [airline_carriers_data_awal[i][j].provider[k]];
                        }
                    }

                }catch(err){

                }
            }
        }
    }
    provider_airline = []
    for(i in airline[0]){
        for(j in airline[0][i]){
            try{
                if(airline_carriers_data_awal[0][i].is_excluded_from_b2c != true || user_login.co_agent_frontend_security.includes('b2c_limitation') == false){
                    check = 0;
                    try{
                        for(k in provider_airline){
                            if(airline_carriers_data_awal[0][i].is_favorite == true){
                                provider_airline.push([airline[0][i][j],[i], airline_carriers_data_awal[0][i].is_favorite])
                                check = 1;
                                break;
                            }else if(provider_airline[k][0] == airline[0][i][j] && provider_airline[k][2] == false){
                                provider_airline[k][1].push(i);
                                check = 1;
                                break;
                            }
                        }if(check == 0){
                            provider_airline.push([airline[0][i][j],[i], airline_carriers_data_awal[0][i].is_favorite])
                        }
                    }catch(err){
                        console.log(err); // error kalau ada element yg tidak ada
                    }
                }
            }catch(err){console.log(err)}
        }
    }
    airline_choose = 0;
    count_progress_bar_airline = 0;
    send_search_to_api();
    get_carriers();
    if(google_analytics != '')
        gtag('event', 'airline_search', {});
//    document.getElementById('airline_list').innerHTML = '';
    document.getElementById('airline_list2').innerHTML = '';
}

function send_search_to_api(val){
    if(airline_request.direction == 'RT'){
        document.getElementById('show_origin_destination').innerHTML = `<span style="font-size:12px;" title="`+airline_request.origin[counter_search]+` > `+airline_request.destination[counter_search]+`"><span class="copy_span"> `+airline_request.origin[counter_search].split(' - ')[1] + ` (`+airline_request.origin[counter_search].split(' - ')[0]+`) </span><i class="fas fa-arrows-alt-h"></i><span class="copy_span"> `+airline_request.destination[counter_search].split(' - ')[1]+` (`+airline_request.destination[counter_search].split(' - ')[0]+`)</span></span>`;
        date_show = `<i class="fas fa-calendar-alt"></i> `+airline_request.departure[0];
        if(airline_request.departure[0] != airline_request['return'][0]){
            date_show += ` - `+airline_request['return'][0];
        }
        document.getElementById('show_date').innerHTML = date_show;
        document.getElementById('title_search').innerHTML += " From " + airline_request.origin[counter_search].split(' - ')[2] + " To " + airline_request.destination[counter_search].split(' - ')[2];
    }else if(airline_request.direction != 'RT'){
        document.getElementById('show_origin_destination').innerHTML = `<span style="font-size:12px;" title="`+airline_request.origin[counter_search]+` > `+airline_request.destination[counter_search]+`"><span class="copy_span"> `+airline_request.origin[counter_search].split(' - ')[1] + ` (`+airline_request.origin[counter_search].split(' - ')[0]+`) </span><i class="fas fa-arrow-right"></i><span class="copy_span"> `+airline_request.destination[counter_search].split(' - ')[1]+` (`+airline_request.destination[counter_search].split(' - ')[0]+`)</span></span>`;
        date_show = `<i class="fas fa-calendar-alt"></i> `+airline_request.departure[counter_search];
        if(airline_request.departure[counter_search] != airline_request['return'][counter_search]){
            date_show += ` - `+airline_request['return'][counter_search];
        }
        document.getElementById('show_date').innerHTML = date_show;
        if(airline_request.direction != 'MC'){
            document.getElementById('title_search').innerHTML += " From " + airline_request.origin[counter_search].split(' - ')[2] + " To " + airline_request.destination[counter_search].split(' - ')[2];
        }
    }
    if(val == undefined){
        //baru
        if(provider_airline.length == 0){
            Swal.fire({
              type: 'error',
              title: 'Oops...',
              text: 'Something went wrong, search other airline',
            })
            $('.loader-rodextrip').fadeOut();
            $("#barFlightSearch").hide();
            $("#waitFlightSearch").hide();
            document.getElementById("airlines_error").innerHTML = '';
            text = '';
            text += `
                <div class="alert alert-warning" style="border:1px solid #cdcdcd;" role="alert">
                    <span style="font-weight:bold;"> Oops... Something went wrong, search other airline</span>
                </div>
                <img src="/static/tt_website_rodextrip/images/no pic/no-flight.jpeg" alt="Not Found Airlines" style="height:50px;"/>
            `;
            var node = document.createElement("div");
            node.innerHTML = text;
            node.style = 'text-align:center';
            document.getElementById("airlines_error").appendChild(node);
            node = document.createElement("div");
        }
        else{
            ticket_count = 0;
            if ((airline_choose/count_progress_bar_airline)*100 == 100){
                airline_choose = 0;
                count_progress_bar_airline = 0;
            }
            last_send = false;
            for(i in provider_airline){
                if(i == provider_airline.length-1)
                    last_send = true;
                airline_search(provider_airline[i][0],provider_airline[i][1], last_send);
            }
            var bar1 = new ldBar("#barFlightSearch");
            var bar2 = document.getElementById('barFlightSearch').ldBar;
            bar1.set((airline_choose/count_progress_bar_airline)*100);
            if ((airline_choose/count_progress_bar_airline)*100 == 100){
                $("#barFlightSearch").hide();
                $("#waitFlightSearch").hide();
            }
            document.getElementById('barFlightSearch').style.display = "block";
            document.getElementById('waitFlightSearch').style.display = "block";
        }
    }
    change_date_next_prev(counter_search);
    counter_search++;
}

function get_airline_config(type, val){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'get_data',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
            new_airline_destination = [];
            for(i in msg){
                new_airline_destination.push(msg[i].code + ` - `+ msg[i].city +' - '+msg[i].country +  ' - '+ msg[i].name );
            }

       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error airline config');
            $('.loader-rodextrip').fadeOut();
       },timeout: 60000
    });
}

function airline_search(provider,carrier_codes,last_send=false,re_order=false){
    if(!re_order){
        document.getElementById("airlines_ticket").innerHTML = '';
        count_progress_bar_airline++;
    }
    getToken();
    last_session = 'get_price';
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'search',
       },
//       url: "{% url 'tt_backend_rodextrip:social_media_tree_update' %}",
       data: {
           'provider': provider,
           'carrier_codes': JSON.stringify(carrier_codes),
           'counter_search': counter_search,
           'signature': signature,
           'search_request': JSON.stringify(airline_request),
           'last_send': last_send
       },
       success: function(msg) {
           if(msg.error_code == 0){
              if(!re_order){
                  try{
                      datasearch2(msg.response);
                      var bar1 = new ldBar("#barFlightSearch");
                      var bar2 = document.getElementById('barFlightSearch').ldBar;
                      bar1.set((airline_choose/count_progress_bar_airline)*100);
                      if ((airline_choose/count_progress_bar_airline)*100 == 100){
                        document.getElementById('sorting-flight2').hidden = false;
                        document.getElementById('sorting-flight').hidden = false;
                        document.getElementById('filter').hidden = false;
                        $("#barFlightSearch").hide();
                        $("#waitFlightSearch").hide();
                      }

                  }catch(err){
                      datasearch2(msg.response);
                      var bar1 = new ldBar("#barFlightSearch");
                      var bar2 = document.getElementById('barFlightSearch').ldBar;
                      bar1.set((airline_choose/count_progress_bar_airline)*100);
                      if ((airline_choose/count_progress_bar_airline)*100 == 100){
                        $("#barFlightSearch").hide();
                        $("#waitFlightSearch").hide();
                      }
                  }
                  if (count_progress_bar_airline == airline_choose && airline_data.length == 0){
                        document.getElementById("airlines_ticket").innerHTML = '';
                        text = '';
                        text += `
                        <div style="text-align:center">
                            <img src="/static/tt_website_rodextrip/images/nofound/no-airlines.png" style="width:70px; height:70px;" alt="Not Found Airlines" title="" />
                            <br/>
                        </div>
                        <center><div class="alert alert-warning" role="alert" style="margin-top:15px; border:1px solid #cdcdcd;"><h6><i class="fas fa-search-minus"></i> Oops! Sorry no ticket for flight. Please try another flight. </h6></div></center>`;
                        var node = document.createElement("div");
                        node.innerHTML = text;
                        document.getElementById("airlines_ticket").appendChild(node);
                        node = document.createElement("div");
                  }
                  var node = document.createElement("div");
                  var node2 = document.createElement("div");
                  if(document.getElementById("filter_airline_span").innerHTML == '' && airline_data.length > 0){
                       document.getElementById('filter_airline_span').innerHTML = " Airline"+ '<i class="fas fa-chevron-down" id="airlineAirline_generalDown" style="float:right; display:none;"></i><i class="fas fa-chevron-up" id="airlineAirline_generalUp" style="float:right; display:block;"></i>';
                       document.getElementById('filter_airline_span').parentNode.insertBefore(document.createElement('hr'), document.getElementById('filter_airline_span'));
                       document.getElementById('filter_airline_span2').innerHTML = " Airline";
                       document.getElementById('filter_airline_span2').parentNode.insertBefore(document.createElement('hr'), document.getElementById('filter_airline_span2'));
                  }
                  try{
                       msg.response.schedules.forEach((obj)=> {

                           obj.journeys.forEach((obj2) =>{
                               check = 0;
                               carrier_code.forEach((obj1)=> {
                                   if(obj1.code == obj2.segments[0].carrier_code){
                                       check=1;
                                   }
                               });
                               carrier_code_airline_checkbox = '';
                               if(check == 0){
                                   carrier_code_airline_checkbox += `
                                   <div class="checkbox-inline1">
                                   <label class="check_box_custom">`;
                                   try{
                                   carrier_code_airline_checkbox +=`
                                        <span class="span-search-ticket" style="color:black;">`+airline_all_carriers[obj2.segments[0].carrier_code].name+`</span>`;
                                   }catch(err){
                                   carrier_code_airline_checkbox +=`
                                        <span class="span-search-ticket" style="color:black;">`+obj2.segments[0].carrier_code+`</span>`;
                                   }
                                   carrier_code_airline_checkbox +=`
                                        <input type="checkbox" id="checkbox_airline`+airline_list_count+`" onclick="change_filter('airline',`+airline_list_count+`);"/>
                                        <span class="check_box_span_custom"></span>
                                    </label><br/>
                                   </div>`;
                                   node.innerHTML = carrier_code_airline_checkbox;
                                   document.getElementById("airlineAirline_generalShow").appendChild(node);
                                   node = document.createElement("div");
                                   carrier_code_airline_checkbox = '';
                                   carrier_code_airline_checkbox += `
                                   <div class="checkbox-inline1">
                                   <label class="check_box_custom">`;
                                   try{
                                   carrier_code_airline_checkbox +=`
                                        <span class="span-search-ticket" style="color:black;">`+airline_all_carriers[obj2.segments[0].carrier_code].name+`</span>`;
                                   }catch(err){
                                   carrier_code_airline_checkbox +=`
                                        <span class="span-search-ticket" style="color:black;">`+obj2.segments[0].carrier_code+`</span>`;
                                   }
                                   carrier_code_airline_checkbox +=`<input type="checkbox" id="checkbox_airline2`+airline_list_count+`" onclick="change_filter('airline',`+airline_list_count+`);"/>
                                        <span class="check_box_span_custom"></span>
                                    </label><br/>
                                   </div>`;
                                   node2.innerHTML = carrier_code_airline_checkbox;
                                   document.getElementById("airline_list2").appendChild(node2);
                                   node2 = document.createElement("div");

                                   carrier_code.push({
                                       airline:airline_carriers[0][obj2.segments[0].carrier_code],
                                       code:obj2.segments[0].carrier_code,
                                       status: false,
                                       key: airline_list_count
                                   });
                                   airline_list_count++;
                               }
                           })

                       });
                  }catch(err){console.log(err)}
              }else{
                //re order
                for(i in msg.response.schedules){
                    airline_data_reorder = airline_data_reorder.concat(msg.response.schedules[i].journeys);
                }
                re_order_check_search();
              }
           }else{
                if(!re_order){
                    airline_choose++;
                    var bar1 = new ldBar("#barFlightSearch");
                    var bar2 = document.getElementById('barFlightSearch').ldBar;
                    bar1.set((airline_choose/count_progress_bar_airline)*100);
                    if ((airline_choose/count_progress_bar_airline)*100 == 100){
                        if(count_progress_bar_airline == 1){
                            Swal.fire({
                              type: 'error',
                              title: 'Oops!',
                              html: '<span style="color: red;">Error airline search </span>' + msg.error_msg,
                            })

                        }
                        filtering('filter');
                        $("#barFlightSearch").hide();
                        $("#waitFlightSearch").hide();
                    }
                }else{
                    //reorder
                    re_order_check_search();
                }
           }
//            document.getElementById('train_searchForm').submit();
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            airline_choose++;
            var bar1 = new ldBar("#barFlightSearch");
            var bar2 = document.getElementById('barFlightSearch').ldBar;
            bar1.set((airline_choose/count_progress_bar_airline)*100);
            if ((airline_choose/count_progress_bar_airline)*100 == 100){
                $("#barFlightSearch").hide();
                $("#waitFlightSearch").hide();
                filtering('filter');
            }
           if (count_progress_bar_airline == airline_choose && airline_data.length == 0){
                error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error airline search');
                $('.loader-rodextrip').fadeOut();
                $("#barFlightSearch").hide();
                $("#waitFlightSearch").hide();
                document.getElementById("airlines_error").innerHTML = '';
                text = '';
                text += `
                    <div class="alert alert-warning" style="border:1px solid #cdcdcd;" role="alert">
                        <span style="font-weight:bold;"> Oops `+errorThrown+`! Something went wrong, please try again or check your internet connection</span>
                    </div>
                `;
                var node = document.createElement("div");
                node.innerHTML = text;
                document.getElementById("airlines_error").appendChild(node);
                node = document.createElement("div");
            }
       },timeout: 120000 // sets timeout to 120 seconds
    });

}

function datasearch2(airline){
   airline_choose++;
   data = [];
   data_show = [];
   temp_data = [];
   text = '';
   var counter = 0;
   for(i in airline_data){
       data.push(airline_data[i]);
       if(airline_data[i].origin == airline_request.origin[counter_search-1].substr(airline_request.origin[counter_search-1].length-4,3) && airline_departure == 'departure')
           data_show.push(airline_data[i]);
       else if(airline_data[i].origin == airline_request.destination[counter_search-1].substr(airline_request.origin[counter_search-1].length-4,3) && airline_departure == 'return')
           data_show.push(airline_data[i]);
       counter++;
   }

   for(i in airline.schedules){
        for(j in airline.schedules[i].journeys){
           fare_details = [];
           airline.schedules[i].journeys[j].sequence = counter;
           available_count = 100;
           for(k in airline_request.origin){
                if(airline_request.origin[k].split(' - ')[0] == airline.schedules[i].journeys[j].origin &&
                   airline_request.destination[k].split(' - ')[0] == airline.schedules[i].journeys[j].destination &&
                   airline_request.departure[k] == airline.schedules[i].journeys[j].departure_date.split(' - ')[0]){
                    airline.schedules[i].journeys[j].airline_pick_sequence = parseInt(parseInt(k)+1);
                }
           }
           if(airline.schedules[i].journeys[j].hasOwnProperty('is_vtl_flight') && airline.schedules[i].journeys[j].is_vtl_flight == true){
                //flight VTL hardcode dari frontend
                airline.schedules[i].journeys[j].search_banner.push({
                    "active": true,
                    "banner_color": "#f15a22",
                    "description": '',
                    "name": "VTL Flight",
                    "text_color": "#ffffff"
                })
           }
           price = 0;
           currency = '';
           airline.schedules[i].journeys[j].operated_by = true;
           can_book_schedule = true;
           can_book = true;
           for(k in airline.schedules[i].journeys[j].segments){
               if(airline.schedules[i].journeys[j].segments[k].fares.length == 0)
                    can_book = false;
               for(l in airline.schedules[i].journeys[j].segments[k].fares){
                   //fix bug seat available di case seat available < request pax
                   if(available_count > airline.schedules[i].journeys[j].segments[k].fares[l].available_count)
                        available_count = airline.schedules[i].journeys[j].segments[k].fares[l].available_count;
                   if(airline.schedules[i].journeys[j].segments[k].fares[l].available_count >= parseInt(airline_request.adult)+parseInt(airline_request.child) || airline.schedules[i].journeys[j].segments[k].fares[l].available_count == -1){//atau buat sia
                       can_book = true;
                       airline.schedules[i].journeys[j].segments[k].fare_pick = 0;
                       for(m in airline.schedules[i].journeys[j].segments[k].fares[l].fare_details){
                            add_fare_detail = true;
                            for(n in fare_details){
                                if(fare_details[n].amount == airline.schedules[i].journeys[j].segments[k].fares[l].fare_details[m].amount && fare_details[n].detail_type == airline.schedules[i].journeys[j].segments[k].fares[l].fare_details[m].detail_type){
                                    add_fare_detail = false;
                                }
                            }
                            if(add_fare_detail)
                                fare_details.push(airline.schedules[i].journeys[j].segments[k].fares[l].fare_details[m])
                       }
                       for(m in airline.schedules[i].journeys[j].segments[k].fares[l].service_charge_summary){
                           if(airline.schedules[i].journeys[j].segments[k].fares[l].service_charge_summary[m].pax_type == 'ADT'){
                               for(n in airline.schedules[i].journeys[j].segments[k].fares[l].service_charge_summary[m].service_charges){
                                   if(airline.schedules[i].journeys[j].segments[k].fares[l].service_charge_summary[m].service_charges[n].charge_code != 'rac' && airline.schedules[i].journeys[j].segments[k].fares[l].service_charge_summary[m].service_charges[n].charge_code != 'rac1' && airline.schedules[i].journeys[j].segments[k].fares[l].service_charge_summary[m].service_charges[n].charge_code != 'rac2'){
                                       price += airline.schedules[i].journeys[j].segments[k].fares[l].service_charge_summary[m].service_charges[n].amount;
                                       if(currency == ''){
                                           currency = airline.schedules[i].journeys[j].segments[k].fares[l].service_charge_summary[m].service_charges[n].currency;
                                       }
                                   }
                               }
                           }
                       }
                       break;
                   }else{
                        can_book = false;
                   }
               }
               if(can_book_schedule)
                    can_book_schedule = can_book;

               if(airline.schedules[i].journeys[j].segments[k].carrier_code == airline.schedules[i].journeys[j].segments[k].operating_airline_code && airline.schedules[i].journeys[j].operated_by != false){
                   airline.schedules[i].journeys[j].operated_by_carrier_code = airline.schedules[i].journeys[j].segments[k].operating_airline_code;
               }else if(airline.schedules[i].journeys[j].segments[k].carrier_code != airline.schedules[i].journeys[j].segments[k].operating_airline_code){
                   airline.schedules[i].journeys[j].operated_by_carrier_code = airline.schedules[i].journeys[j].segments[k].operating_airline_code;
                   airline.schedules[i].journeys[j].operated_by = false;
               }
           }
           airline.schedules[i].journeys[j].total_price = price;
           if(available_count == 100)
               available_count = 0;
           airline.schedules[i].journeys[j].available_count = available_count;
           airline.schedules[i].journeys[j].can_book = can_book_schedule;
           airline.schedules[i].journeys[j].can_book_check_arrival_on_next_departure = true;
           airline.schedules[i].journeys[j].currency = currency;
           airline.schedules[i].journeys[j].fare_details = fare_details;
           data.push(airline.schedules[i].journeys[j]);
           temp_data.push(airline.schedules[i].journeys[j]);
           counter++;
        }
   }
   airline_data = data;

//   print_ticket_search(temp_data);
//   sort_button('price');
//   sort(temp_data);
   recommendations_airline = recommendations_airline.concat(airline.recommendations)
   if(airline_request.departure.length != journey.length)
       filtering('filter');
}

function change_fare(journey, segment, fares){
    price = 0;
    price_discount = 0;
    var change_radios = document.getElementsByName('journey'+journey+'segment'+segment+'fare');
    for (var j = 0, length = change_radios.length; j < length; j++) {
        if (change_radios[j].checked) {
            fare_value = j
            break;
        }
    }
    group_fares = airline[journey].segments[segment].fares[fare_value].group_fare_id;
    for(i in airline[journey].segments){
        if(group_fares.length != 0){
            for(j in airline[journey].segments[i].fares){
                if(parseInt(i) == segment){
                    break;
                }else if(airline[journey].segments[i].fares[j].group_fare_id == group_fares){
                    document.getElementsByName('journey'+journey+'segment'+i+'fare')[parseInt(j)].checked = true;
                    break;
                }
            }
        }
        var radios = document.getElementsByName('journey'+journey+'segment'+i+'fare');

        for (var j = 0, length = radios.length; j < length; j++) {
            if (radios[j].checked) {
                // do whatever you want with the checked radio
                temp = document.getElementById('journey'+journey+'segment'+i+'fare'+(radios[j].value)).innerHTML;
//                price += parseInt(temp.replace( /[^\d.]/g, '' ));
                airline[journey].segments[i].fare_pick = parseInt(j);
                // only one radio can be logically checked, don't check the rest
                break;
            }
        }
        //hitung ulang price

        for(j in airline[journey].segments[i].fares[airline[journey].segments[i].fare_pick].service_charge_summary){

            if(airline[journey].segments[i].fares[airline[journey].segments[i].fare_pick].service_charge_summary[j].pax_type == 'ADT'){
                for(k in airline[journey].segments[i].fares[airline[journey].segments[i].fare_pick].service_charge_summary[j].service_charges){
                    if(airline[journey].segments[i].fares[airline[journey].segments[i].fare_pick].service_charge_summary[j].service_charges[k].charge_type != 'RAC'){
                        if(airline[journey].segments[i].fares[airline[journey].segments[i].fare_pick].service_charge_summary[j].service_charges[k].charge_type != 'DISC'){
                            price += airline[journey].segments[i].fares[airline[journey].segments[i].fare_pick].service_charge_summary[j].service_charges[k].amount;
                            console.log(airline[journey].segments[i].fares[airline[journey].segments[i].fare_pick].service_charge_summary[j]);
                        }
                        price_discount += airline[journey].segments[i].fares[airline[journey].segments[i].fare_pick].service_charge_summary[j].service_charges[k].amount;
                    }
                }
                break
            }
        }
    }

    if(isNaN(parseInt(price)) == false){
        document.getElementById('fare'+journey).innerHTML = 'IDR ' + getrupiah(price_discount.toString());
        if(price != price_discount)
            document.getElementById('fare_no_discount'+journey).innerHTML = 'IDR ' + getrupiah(price.toString());
    }
//    airline_data[journey].total_price = price;

    //update fare details detail
    if(airline[journey].segments[segment].fares[fares].hasOwnProperty('fare_details')){
        for(l in airline[journey].segments[segment].fares[fares].fare_details){
            text=`
            <span class="copy_fares" hidden>`+journey+segment+fares+l+`</span>`;
            if(airline[journey].segments[segment].fares[fares].fare_details[l].detail_type.includes('BG')){
                text+=`<i class="fas fa-suitcase"></i><span style="font-weight:500;" class="copy_suitcase_details"> `+airline[journey].segments[segment].fares[fares].fare_details[l].amount+` `+airline[journey].segments[segment].fares[fares].fare_details[l].unit+`</span><br/>`;
            }else if(airline[journey].segments[segment].fares[fares].fare_details[l].detail_type == 'ML'){
                text+=`<i class="fas fa-utensils"></i><span style="font-weight:500;" class="copy_utensils_details"> `+airline[journey].segments[segment].fares[fares].fare_details[l].amount+` `+airline[journey].segments[segment].fares[fares].fare_details[l].unit+`</span><br/>`;
            }else{
                text+=`<span style="font-weight:500;" class="copy_others_details"> `+airline[journey].segments[segment].fares[fares].fare_details[l].amount+` `+airline[journey].segments[segment].fares[fares].fare_details[l].unit+`</span><br/>`;
            }
            document.getElementById('copy_fares_details'+journey+segment+"0"+l).innerHTML = text
        }
        fare_details = [];
        for(j in airline[journey].segments){
            if(airline[journey].segments[j].fares[airline[journey].segments[j].fare_pick].hasOwnProperty('fare_details')){
                for(l in airline[journey].segments[j].fares[airline[journey].segments[j].fare_pick].fare_details){
                    add_new_data = true;
                    for(m in fare_details){
                        add_new_data = false;
                        if(fare_details[m].detail_code == airline[journey].segments[j].fares[airline[journey].segments[j].fare_pick].fare_details[l].detail_code && fare_details[m].amount > airline[journey].segments[j].fares[airline[journey].segments[j].fare_pick].fare_details[l].amount){
                            fare_details.splice(m, 1);
                            add_new_data = true;
                            break;
                        }else if(fare_details[m].detail_code == airline[journey].segments[j].fares[airline[journey].segments[j].fare_pick].fare_details[l].detail_code && fare_details[m].amount < airline[journey].segments[j].fares[airline[journey].segments[j].fare_pick].fare_details[l].amount){
                            break;
                        }
                    }
                    if(add_new_data)
                        fare_details.push(airline[journey].segments[j].fares[airline[journey].segments[j].fare_pick].fare_details[l])
                }
            }
        }
        airline[journey].fare_details = fare_details;
        text = '';
        for(j in airline[journey].fare_details){
           text+=`
           <div class="col-xs-12">`;
           if(airline[journey].fare_details[j].detail_type.includes('BG')){
                text+=`<i class="fas fa-suitcase"></i><span style="font-weight:500;" class="copy_suitcase_details"> `+airline[journey].fare_details[j].amount+` `+airline[journey].fare_details[j].unit+`</span><br/>`;
           }
           else if(airline[journey].fare_details[j].detail_type == 'ML'){
                text+=`<i class="fas fa-utensils"></i><span style="font-weight:500;" class="copy_utensils_details"> `+airline[journey].fare_details[j].amount+` `+airline[journey].fare_details[j].unit+`</span><br/>`;
           }else{
                text+=`<span style="font-weight:500;" class="copy_others_details">`+airline[journey].fare_details[j].amount+` `+airline[journey].fare_details[j].unit+`</span><br/>`;
           }
           text+=`</div>`;
        }
        document.getElementById('airline'+journey+'fare_details').innerHTML = text;
    }
}

function get_price_itinerary(val){
    segment = [];
    fare = 0;
    if(check_airline_pick == 1 && airline_request.direction == 'OW'){
        if(value_pick.length != 0){
            try{
                document.getElementById('departjourney'+value_pick[0]).value = 'Choose';
                document.getElementById('departjourney'+value_pick[0]).disabled = false;
                document.getElementById('departjourney'+value_pick[0]).classList.remove("primary-btn-custom-un");
                document.getElementById('departjourney'+value_pick[0]).classList.add("primary-btn-custom");

            }catch(err){

            }
        }
        journey = [];
        value_pick = [];
        airline_pick_list = [];
    }
    else if(check_airline_pick == 1 && airline_request.direction == 'RT'){
        if(value_pick.length != 0){
            try{
                document.getElementById('departjourney'+value_pick[value_pick.length-1]).value = 'Choose';
                document.getElementById('departjourney'+value_pick[value_pick.length-1]).disabled = false;
                document.getElementById('departjourney'+value_pick[value_pick.length-1]).classList.remove("primary-btn-custom-un");
                document.getElementById('departjourney'+value_pick[value_pick.length-1]).classList.add("primary-btn-custom");
            }catch(err){

            }
        }
        journey.pop();
        value_pick.pop();
        airline_pick_list.pop();
    }
    else if(check_airline_pick == 1 && airline_request.direction == 'MC'){
        if(value_pick.length != 0){
            try{
                document.getElementById('departjourney'+value_pick[value_pick.length-1]).value = 'Choose';
                document.getElementById('departjourney'+value_pick[value_pick.length-1]).disabled = false;
                document.getElementById('departjourney'+value_pick[value_pick.length-1]).classList.remove("primary-btn-custom-un");
                document.getElementById('departjourney'+value_pick[value_pick.length-1]).classList.add("primary-btn-custom");
            }catch(err){

            }
        }
        journey.pop();
        value_pick.pop();
        airline_pick_list.pop();
    }

    if(choose_airline != null){
        try{document.getElementById('departjourney'+choose_airline).classList.remove("primary-btn-custom-un");
                document.getElementById('departjourney'+choose_airline).classList.add("primary-btn-custom");
            if(airline_request.direction == 'RT' && airline_data[choose_airline].combo_price == true){
                document.getElementById('departjourney'+choose_airline).value = 'Choose';
                document.getElementById('departjourney'+choose_airline).disabled = false;
            }else if(airline_request.direction == 'RT' && journey.length == 2){
                document.getElementById('departjourney'+choose_airline).value = 'Choose';
                document.getElementById('departjourney'+choose_airline).classList.remove("primary-btn-custom-un");
                document.getElementById('departjourney'+choose_airline).classList.add("primary-btn-custom");
                document.getElementById('departjourney'+choose_airline).disabled = false;
            }else if(airline_request.direction == 'OW'){
                document.getElementById('departjourney'+choose_airline).value = 'Choose';
                document.getElementById('departjourney'+choose_airline).classList.remove("primary-btn-custom-un");
                document.getElementById('departjourney'+choose_airline).classList.add("primary-btn-custom");
                document.getElementById('departjourney'+choose_airline).disabled = false;
            }

        }catch(err){

        }
    }
    document.getElementById("badge-copy-notif").innerHTML = "0";
    document.getElementById("badge-copy-notif2").innerHTML = "0";
    $('#button_copy_airline').hide();

    document.getElementById('departjourney'+val).value = 'Chosen';
    document.getElementById('departjourney'+val).classList.remove("primary-btn-custom");
    document.getElementById('departjourney'+val).classList.add("primary-btn-custom-un");
    document.getElementById('departjourney'+val).disabled = true;
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    document.getElementById("airline_detail").innerHTML = "";
    document.getElementById("airline_detail_next").innerHTML = "";
    choose_airline = val;
    provider = '';
    for(i in airline_data_filter[val].segments){
        var radios = document.getElementsByName('journey'+val+'segment'+i+'fare');
        //get fare checked
        for (var j = 0, length = radios.length; j < length; j++) {
            if (radios[j].checked) {
                // do whatever you want with the checked radio
                airline_data_filter[val].segments[i].fare_pick = parseInt(radios[j].value);
                fare = parseInt(radios[j].value);
                // only one radio can be logically checked, don't check the rest
                break;
            }
        }
        //give fare pick
        if(airline_data_filter[val].segments[i].provider.match(/sabre/))
            provider = 'sabre'
        else
            provider = airline_data_filter[val].segments[i].provider;
        subclass = '';
        class_of_service = '';
        fare_code = '';
        try{
            subclass = airline_data_filter[val].segments[i].fares[fare].subclass;
        }catch(err){

        }

        try{
            fare_code = airline_data_filter[val].segments[i].fares[fare].fare_code;
        }catch(err){

        }

        try{
            class_of_service = airline_data_filter[val].segments[i].fares[fare].class_of_service;
        }catch(err){

        }
        segment.push({
            "segment_code": airline_data_filter[val].segments[i].segment_code,
//            'journey_type': airline_data_filter[val].segments[i].journey_type,
            'fare_code': fare_code,
            'carrier_code': airline_data_filter[val].segments[i].carrier_code,
            'class_of_service': class_of_service,
            "fare_pick": parseInt(airline_data_filter[val].segments[i].fare_pick),
        })

        //get farecode
//        document.getElementById('airline_searchForm').
    }
    auto_combo_price_flag = true;
    filter_recommendation = [];
    airline_recommendations_list.map(function (str,i) {if(str.includes(airline_data_filter[val].journey_ref_id) == true) return (filter_recommendation.push(i)) });
    for(i in filter_recommendation){
        if(airline_recommendations_combo_list[filter_recommendation[i]] == true){
            auto_combo_price_flag = false;
            break;
        }
    }
    if(airline_pick_list.length != 0){
        if(airline_recommendations_list.length > 0){
            data_check = true;
            if(airline_recommendations_list != 0){
                data_check = check_combo_price_schedule_fare(airline_data_filter[val]);
            }
            if(data_check){
                airline_pick_list.push(JSON.parse(JSON.stringify(airline_data_filter[val])));
                value_pick.push(val);
                set_segment_provider_get_itinenary(segment, provider, val);
            }else{
                document.getElementById('departjourney'+val).value = 'Choose';
                document.getElementById('departjourney'+val).classList.add("primary-btn-custom");
                document.getElementById('departjourney'+val).classList.remove("primary-btn-custom-un");
                document.getElementById('departjourney'+val).disabled = false;
                Swal.fire({
                  type: 'warning',
                  title: 'Oops!',
                  html: 'Invalid Combination, Please change your last combination flight!',
               })
            }
        // tidak terpakai karena fare sudah mengikuti recomm
//            Swal.fire({
//              title: 'Auto combo price?',
//              type: 'warning',
//              showCancelButton: true,
//              confirmButtonColor: '#3085d6',
//              cancelButtonColor: '#d33',
//              confirmButtonText: 'Yes'
//            }).then((result) => {
//                if(result.value == true){
//                    if(airline_pick_list.length != 0 && auto_combo_price_flag == true){
//                        for(i in airline_pick_list){
//                            for(j in airline_pick_list[i].segments){
//                                for(k in airline_pick_list[i].segments[j].fares){
//                                    try{
//                                        if(airline_pick_list[i].segments[j].fares[k].fare_ref_id == airline_recommendations_journey[airline_recommendations_list.indexOf(airline_data_filter[val].journey_ref_id)].journey_flight_refs[i].fare_flight_refs[j].fare_ref_id){
//                                            airline_pick_list[i].segments[j].fare_pick = parseInt(k);
//                                            break;
//                                        }
//                                    }catch(err){
//                                        console.log(err); // error kalau ada element yg tidak ada
//                                    }
//                                }
//                            }
//                        }
//                    }
//                    airline_pick_list.push(JSON.parse(JSON.stringify(airline_data_filter[val])));
//                    value_pick.push(val);
//                    set_segment_provider_get_itinenary(segment, provider, val);
//                }else{
//                    //check combo price ada tidak kalau ada lanjut kalau tidak error
//
//                }
//            });
        }else{
            if(airline_pick_list.length != 0 && auto_combo_price_flag == true){
                for(i in airline_pick_list){
                    for(j in airline_pick_list[i].segments){
                        for(k in airline_pick_list[i].segments[j].fares){
                            try{
                                if(airline_pick_list[i].segments[j].fares[k].fare_ref_id == airline_recommendations_journey[airline_recommendations_list.indexOf(airline_data_filter[val].journey_ref_id)].journey_flight_refs[i].fare_flight_refs[j].fare_ref_id){
                                    airline_pick_list[i].segments[j].fare_pick = parseInt(k);
                                    break;
                                }
                            }catch(err){
                                console.log(err); // error kalau ada element yg tidak ada
                            }
                        }
                    }
                }
            }
            airline_pick_list.push(JSON.parse(JSON.stringify(airline_data_filter[val])));
            value_pick.push(val);
            set_segment_provider_get_itinenary(segment, provider, val);
        }
    }else{
        airline_pick_list.push(JSON.parse(JSON.stringify(airline_data_filter[val])));
        value_pick.push(val);
        set_segment_provider_get_itinenary(segment, provider, val);
    }
}

function check_combo_price_schedule_fare(journey){
    var data_check = true;
    if(airline_recommendations_dict.hasOwnProperty(journey.journey_ref_id)){
        for(journey_idx in airline_recommendations_dict[journey.journey_ref_id]){
            data_check = true;
            for(segment_idx in airline_recommendations_dict[journey.journey_ref_id][journey_idx].segments){
                if(airline_recommendations_dict[journey.journey_ref_id][journey_idx].segments[segment_idx].fare_ref_id != journey.segments[segment_idx].fares[journey.segments[segment_idx].fare_pick].fare_ref_id){
                    data_check = false;
                    break;
                }
            }
            if(data_check)
                break
        }
        return data_check;
    }
    return false;
}

function set_segment_provider_get_itinenary(segment, provider, val){
    price = 0;
    if(airline_request.direction == 'OW'){
        journey.push({'segments':segment, 'provider': provider});
    }else if(airline_request.direction == 'RT' && airline_data_filter[val].is_combo_price == true){
        journey.push({'segments':segment, 'provider': provider});
    }else if(airline_request.direction == 'RT' && journey.length == 0){
        airline_pick_mc('change');
        journey.push({'segments':segment, 'provider': provider});
        send_search_to_api(counter_search);
        document.getElementById("airlines_ticket").innerHTML = '';
        data_show = [];
        airline_departure = 'return';
        filtering('filter');
        var total_price = 0;

    }
    else if(airline_request.direction == 'RT' && journey.length == 1){
        journey.push({'segments':segment, 'provider': provider});
    }
    else if(airline_request.direction == 'MC' && airline_data_filter[val].is_combo_price == true)
        journey.push({'segments':segment, 'provider': provider});
    else if(airline_request.direction == 'MC' && journey.length != airline_request.counter){
        journey.push({'segments':segment, 'provider': provider,'sequence': counter_search-1});
    }
    else if(airline_request.direction == 'MC' && journey.length == airline_request.counter){
        temp_journey = [];
        temp_journey.push(journey[0]);
        temp_journey.push({'segments':segment, 'provider': provider,'sequence': counter_search-1});
        journey = temp_journey;
    }

    check = 0;
    //change view
    if(airline_request.direction == 'RT' && airline_data_filter[val].is_combo_price == true){
        airline_pick_mc('change');
        check_airline_pick = 1;
        document.getElementById("badge-flight-notif").innerHTML = "1";
        document.getElementById("badge-flight-notif2").innerHTML = "1";
        $("#badge-flight-notif").addClass("infinite");
        $("#badge-flight-notif2").addClass("infinite");
        $("#myModalTicketFlight").modal('show');
        $('#loading-search-flight').show();
        $('#button_chart_airline').show();
        $('#choose-ticket-flight').hide();
    }
    else if(airline_request.direction == 'OW'){
        airline_pick_mc('change');
        check_airline_pick = 1;
        document.getElementById("badge-flight-notif").innerHTML = "1";
        document.getElementById("badge-flight-notif2").innerHTML = "1";
        $("#badge-flight-notif").addClass("infinite");
        $("#badge-flight-notif2").addClass("infinite");
        $("#myModalTicketFlight").modal('show');
        $('#loading-search-flight').show();
        $('#button_chart_airline').show();
        $('#choose-ticket-flight').hide();
    }
    else if(airline_request.direction == 'RT' && journey.length == 2){
        airline_pick_mc('change');
        check_airline_pick = 1;
        document.getElementById("badge-flight-notif").innerHTML = "1";
        document.getElementById("badge-flight-notif2").innerHTML = "1";
        $("#badge-flight-notif").addClass("infinite");
        $("#badge-flight-notif2").addClass("infinite");
        $("#myModalTicketFlight").modal('show');
        $('#loading-search-flight').show();
        $('#button_chart_airline').show();
        $('#choose-ticket-flight').hide();
    }
    else if(airline_request.direction == 'MC' && airline_data_filter[val].is_combo_price == true){
        airline_pick_mc('change');
        check_airline_pick = 1;
        document.getElementById("badge-flight-notif").innerHTML = "1";
        document.getElementById("badge-flight-notif2").innerHTML = "1";
        $("#badge-flight-notif").addClass("infinite");
        $("#badge-flight-notif2").addClass("infinite");
        $("#myModalTicketFlight").modal('show');
        $('#loading-search-flight').show();
        $('#button_chart_airline').show();
        $('#choose-ticket-flight').hide();
    }
    else if(airline_request.direction == 'MC' && parseInt(airline_request.counter) == journey.length){
        airline_pick_mc('all');
        check_airline_pick = 1;
        document.getElementById("badge-flight-notif").innerHTML = "1";
        document.getElementById("badge-flight-notif2").innerHTML = "1";
        $("#badge-flight-notif").addClass("infinite");
        $("#badge-flight-notif2").addClass("infinite");
        $("#myModalTicketFlight").modal('show');
        $('#loading-search-flight').show();
        $('#button_chart_airline').show();
        $('#choose-ticket-flight').hide();
        counter_search = parseInt(airline_request.counter);
        filtering('filter');
    }
    else if(airline_request.direction == 'MC' && airline_request.counter != journey.length){
        document.getElementById("airline_ticket_pick").innerHTML = '';
        airline_pick_mc('all');
        send_search_to_api(counter_search);
        filtering('filter');
    }

    if(check_airline_pick == 1){
        for(i in airline_pick_list){
            for(j in airline_pick_list){
                if(airline_pick_list[i].airline_pick_sequence < airline_pick_list[j].airline_pick_sequence){
                    temp = {
                        'airline_pick_list':airline_pick_list[i],
                        'journey':journey[i]
                    }
                    airline_pick_list[i] = airline_pick_list[j];
                    journey[i] = journey[j];
                    airline_pick_list[j] = temp.airline_pick_list;
                    journey[j] = temp.journey
                }
            }
        }
        if(airline_request.direction == 'MC')
            airline_pick_mc('all');
        else
            airline_pick_mc('change');
        set_automatic_combo_price();
    }
}

function set_automatic_combo_price(){
    journey = [];
    for(i in airline_pick_list){
        total_price_temp = 0;
        segments = [];
        for(j in airline_pick_list[i].segments){
            for(k in airline_pick_list[i].segments[j].fares){
                if(airline_pick_list[i].segments[j].fare_pick == parseInt(k)){
                    segments.push({
                        "segment_code": airline_pick_list[i].segments[j].segment_code,
                        "fare_code": airline_pick_list[i].segments[j].fares[k].fare_code,
                        "carrier_code": airline_pick_list[i].segments[j].carrier_code,
                        "class_of_service": airline_pick_list[i].segments[j].fares[k].class_of_service,
                        "fare_pick": parseInt(k)
                    });
                    document.getElementsByName('journeypick'+airline_pick_list[i].airline_pick_sequence+'segment'+j+'fare')[k].checked = true;
                    for(l in airline_pick_list[i].segments[j].fares[k].service_charge_summary){
                        if(airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].pax_type == 'ADT'){
                            total_price_temp += airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].total_price / airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].pax_count;
                            break;
                        }
                    }
                    break;
                }
            }
        }
        journey.push({
            "provider": airline_pick_list[i].provider,
            "segments": segments
        });
        airline_pick_list[i].total_price = total_price_temp;
        //document.getElementById('fare_detail_pick'+airline_pick_list[i].airline_pick_sequence).innerHTML = airline_pick_list[i].currency + ' ' + getrupiah(airline_pick_list[i].total_price);
    }
    document.getElementById('airline_detail').innerHTML = '';
    document.getElementById('airline_detail_next').innerHTML = '';
    check_airline_pick = 1;
    document.getElementById("badge-flight-notif").innerHTML = "1";
    document.getElementById("badge-flight-notif2").innerHTML = "1";
    $("#badge-flight-notif").addClass("infinite");
    $("#badge-flight-notif2").addClass("infinite");
    $("#myModalTicketFlight").modal('show');
    $('#loading-search-flight').show();
    $('#button_chart_airline').show();
    $('#choose-ticket-flight').hide();
    get_price_itinerary_request();
}

function get_price_itinerary_request(){
    added = 1;
    for(i in airline_pick_list){
        try{
            document.getElementById('changejourney_pick'+parseInt(parseInt(i)+added)).disabled = true;
        }catch(err){
            added++;
            try{
                document.getElementById('changejourney_pick'+parseInt(parseInt(i)+added)).disabled = true;
            }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
            }
        }
    }
    separate = false;
    try{
        if(document.getElementsByName('myRadios')[0].checked == true)
            separate = true;
        else
            separate = false;
    }catch(err){

    }
    promotion_code_list = [];
    for(i=0;i<promotion_code;i++){
        try{
            if(document.getElementById('carrier_code_line'+i).value != '' && document.getElementById('code_line'+i).value != '')
                promotion_code_list.push({
                    'carrier_code': document.getElementById('carrier_code_line'+i).value,
                    'promo_code': document.getElementById('code_line'+i).value
                })
        }catch(err){
            console.log(err); // error kalau ada element yg tidak ada
        }
    }

    document.getElementById("airlines_ticket").innerHTML = '';
    last_session = 'sell_journeys';
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'get_price_itinerary',
       },
       data: {
          "promo_codes": JSON.stringify(promotion_code_list),
          "journeys_booking": JSON.stringify(journey),
          'signature': signature,
          'separate_journey': separate,
       },
       success: function(resJson) {
           added = 1;
           for(i in airline_pick_list){
                try{
                    document.getElementById('changejourney_pick'+parseInt(parseInt(i)+added)).disabled = false;
                }catch(err){
                    added++;
                    try{
                        document.getElementById('changejourney_pick'+parseInt(parseInt(i)+added)).disabled = false;
                    }catch(err){
                        console.log(err); // error kalau ada element yg tidak ada
                    }
                }
           }
           get_price_airline_response = resJson
           airline_get_price_request = get_price_airline_response.result.request
           price_type = {};
           airline_price = [];
           price_counter = 0;
           fare_print = false;
           check_journey = '';
           check_provider = '';
           if(resJson.result.error_code == 0 && resJson.result.response.price_itinerary_provider.length!=0){
                for(i in resJson.result.response.price_itinerary_provider){
                    for(j in resJson.result.response.price_itinerary_provider[i].journeys){
                        for(k in resJson.result.response.price_itinerary_provider[i].journeys[j].segments){
                            for(l in resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].fares){
                                if(resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].fares[l].service_charge_summary.length != 0){
                                    if(check_journey != j || check_provider != i){
                                        airline_price.push({});
                                        check_journey = j;
                                        check_provider = i;
                                    }
                                }
                                for(m in resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].fares[l].service_charge_summary){
                                    price_type = {
                                        'fare': 0,
                                        'tax':  0,
                                        'rac':  0,
                                        'roc':  0,
                                        'disc':  0,
                                    }
                                    for(n in resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].fares[l].service_charge_summary[m].service_charges){
                                        if(resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].fares[l].service_charge_summary[m].service_charges[n].charge_type.toLowerCase() == 'fare') //harga per pax hanya fare saja yang lain ambil total karena pax count bisa beda
                                            price_type[resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].fares[l].service_charge_summary[m].service_charges[n].charge_type.toLowerCase()] += resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].fares[l].service_charge_summary[m].service_charges[n].amount;
                                        else
                                            price_type[resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].fares[l].service_charge_summary[m].service_charges[n].charge_type.toLowerCase()] += resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].fares[l].service_charge_summary[m].service_charges[n].amount * resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].fares[l].service_charge_summary[m].service_charges[n].pax_count;
                                        if(price_type.hasOwnProperty('currency') == false)
                                            price_type['currency'] = resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].fares[l].service_charge_summary[m].service_charges[n].currency;
                                    }
                                    if(airline_price[airline_price.length-1].hasOwnProperty(resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].fares[l].service_charge_summary[m].pax_type) == false)
                                        airline_price[airline_price.length-1][resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].fares[l].service_charge_summary[m].pax_type] = price_type;
                                    else{
                                        airline_price[airline_price.length-1][resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].fares[l].service_charge_summary[m].pax_type]['fare'] += price_type.hasOwnProperty('fare') ? price_type['fare'] : 0;
                                        airline_price[airline_price.length-1][resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].fares[l].service_charge_summary[m].pax_type]['tax'] += price_type.hasOwnProperty('tax') ? price_type['tax'] : 0;
                                        airline_price[airline_price.length-1][resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].fares[l].service_charge_summary[m].pax_type]['rac'] += price_type.hasOwnProperty('rac') ? price_type['rac'] : 0;
                                        airline_price[airline_price.length-1][resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].fares[l].service_charge_summary[m].pax_type]['roc'] += price_type.hasOwnProperty('roc') ? price_type['roc'] : 0;
                                        airline_price[airline_price.length-1][resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].fares[l].service_charge_summary[m].pax_type]['disc'] += price_type.hasOwnProperty('disc') ? price_type['disc'] : 0;
                                    }
                                    price_type = {};
                                }
                            }
                        }
                    }
                }
                text = '';
                text_detail_next = '';
                total_price = 0;
                total_discount = 0;
                commission_price = 0;
                rules = 0;
                $text = '';
                $text_price = '';
                text += `
                <div class="col-lg-12">
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="alert alert-warning" role="alert">
                                <span style="font-weight:bold;"> Please check before going to the next page!</span>
                            </div>
                        </div>
                        <div class="col-lg-12">
                            <div class="row">`;
                            flight_count = 0;
                            max_flight = 0;
                            for(i in resJson.result.response.price_itinerary_provider){
                                max_flight += resJson.result.response.price_itinerary_provider[i].journeys.length;
                            }
                            for(i in resJson.result.response.price_itinerary_provider){
                                for(j in resJson.result.response.price_itinerary_provider[i].journeys){
                                    is_citilink = false;
                                    if(resJson.result.response.price_itinerary_provider[i].journeys[j].carrier_code_list.includes('QG')){
                                        is_citilink = true;
                                    }
                                    flight_count++;
//                                    text += `
//                                    <div class="col-lg-12 mt-2">
//                                        <h6 style="background:`+color+`; padding:10px; cursor:pointer; color:`+text_color+`;" id="flight_title_up`+flight_count+`" onclick="show_hide_flight(`+flight_count+`);">Flight `+flight_count+` <i class="fas fa-caret-up" style="float:right; font-size:18px;"></i></h6>
//                                        <h6 style="background:`+color+`; padding:10px; cursor:pointer; color:`+text_color+`; display:none;" id="flight_title_down`+flight_count+`" onclick="show_hide_flight(`+flight_count+`);">Flight `+flight_count+` <i class="fas fa-caret-down" style="float:right; font-size:18px;"></i></h6>
//                                    </div>`;
//                                    $text +='Flight '+flight_count+'\n';
                                    text += `
                                    <div class="col-lg-12 mt-2">
                                        <h6 style="background:`+color+`; padding:10px; cursor:pointer; color:`+text_color+`; display:none;" id="flight_title_up`+flight_count+`" onclick="show_hide_flight(`+flight_count+`);">
                                            Flight `+flight_count+`
                                            `+resJson.result.response.price_itinerary_provider[i].journeys[j].origin+`
                                            <i class="fas fa-arrow-right"></i>
                                            `+resJson.result.response.price_itinerary_provider[i].journeys[j].destination+`
                                            ( `+resJson.result.response.price_itinerary_provider[i].journeys[j].departure_date.split(' - ')[0]+` )
                                            <i class="fas fa-caret-up" style="float:right; font-size:18px;"></i>
                                        </h6>
                                        <h6 style="background:`+color+`; padding:10px; cursor:pointer; color:`+text_color+`;" id="flight_title_down`+flight_count+`" onclick="show_hide_flight(`+flight_count+`);">
                                            Flight `+flight_count+`
                                            `+resJson.result.response.price_itinerary_provider[i].journeys[j].origin+`
                                            <i class="fas fa-arrow-right"></i>
                                            `+resJson.result.response.price_itinerary_provider[i].journeys[j].destination+`
                                            ( `+resJson.result.response.price_itinerary_provider[i].journeys[j].departure_date.split(' - ')[0]+` )
                                            <i class="fas fa-caret-down" style="float:right; font-size:18px;"></i>
                                        </h6>
                                    </div>`;
                                    $text +='Flight '+flight_count+'\n';
                                    text+=`
                                    <div class="col-lg-12" style="padding:0px 15px 15px 15px; display:none;" id="flight_div_sh`+flight_count+`">
                                        <div class="row">
                                            <div class="col-lg-12">
                                                <div style="padding:15px; border:1px solid #cdcdcd;">`;
                                                if(i == 0 && j == 0 && resJson.result.response.is_combo_price == true && journey.length > 1){
                                                    //text += `<marquee direction="down" behavior="alternate" height="50">
                                                    //<marquee behavior="alternate"><font size="5">Special Price</font></marquee>
                                                    //</marquee>`;
                                                    $text +='Special Price\n';
                                                }
                                                text+=`
                                                <div class="row">
                                                    <div class="col-lg-12">`;
                                                    if(resJson.result.response.price_itinerary_provider[i].journeys[j].hasOwnProperty('search_banner')){
                                                       for(banner_counter in resJson.result.response.price_itinerary_provider[i].journeys[j].search_banner){
                                                           var max_banner_date = moment().subtract(parseInt(-1*resJson.result.response.price_itinerary_provider[i].journeys[j].search_banner[banner_counter].minimum_days), 'days').format('YYYY-MM-DD');
                                                           var selected_banner_date = moment(resJson.result.response.price_itinerary_provider[i].journeys[j].departure_date.split(' - ')[0]).format('YYYY-MM-DD');

                                                           if(selected_banner_date >= max_banner_date){
                                                               if(resJson.result.response.price_itinerary_provider[i].journeys[j].search_banner[banner_counter].active == true){
                                                                   text+=`<label id="pop_search_banner_cart`+i+``+j+``+banner_counter+`" style="background:`+resJson.result.response.price_itinerary_provider[i].journeys[j].search_banner[banner_counter].banner_color+`; color:`+resJson.result.response.price_itinerary_provider[i].journeys[j].search_banner[banner_counter].text_color+`;padding:5px 10px;">`+resJson.result.response.price_itinerary_provider[i].journeys[j].search_banner[banner_counter].name+`</label>`;
                                                               }
                                                           }
                                                       }
                                                    }
                                                    text+=`
                                                    </div>
                                                    <div class="col-lg-3">`;
                                                    //logo
                                                    for(k in resJson.result.response.price_itinerary_provider[i].journeys[j].segments){ //print gambar airline
                                                        if(k != 0)
                                                            text +=`<br/>`;
                                                        try{
                                                            if(resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].carrier_code != resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].operating_airline_code && resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].operating_airline_code != ''){
                                                                text+=`
                                                                <span style="font-weight: 500; font-size:12px;">Operated By `+airline_carriers[0][resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].operating_airline_code].name+` `+resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].carrier_number+`</span><br/>
                                                                <img data-toggle="tooltip" alt="`+airline_carriers[0][resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].operating_airline_code].name+`" title="`+airline_carriers[0][resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].operating_airline_code].name+`" style="width:50px; height:50px;" src="`+static_path_url_server+`/public/airline_logo/`+resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].operating_airline_code+`.png"><span> </span>`;
                                                            }else{
                                                                text+=`
                                                                <span style="font-weight: 500; font-size:12px;">`+resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].carrier_code+` `+resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].carrier_number+`</span><br/>
                                                                <img data-toggle="tooltip" alt="`+airline_carriers[0][resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].carrier_code].name+`" title="`+airline_carriers[0][resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].carrier_code].name+`" style="width:50px; height:50px;" src="`+static_path_url_server+`/public/airline_logo/`+resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].carrier_code+`.png"><span> </span>`;
                                                            }

                                                        }catch(err){
                                                            if(resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].carrier_code != resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].operating_airline_code && resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].operating_airline_code != ''){
                                                                text+=`<img data-toggle="tooltip" alt="Airline" title="" style="width:50px; height:50px;" src="`+static_path_url_server+`/public/airline_logo/`+resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].operating_airline_code+`.png"><span> </span>`;
                                                            }else{
                                                                text+=`<img data-toggle="tooltip" alt="Airline" title="" style="width:50px; height:50px;" src="`+static_path_url_server+`/public/airline_logo/`+resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].carrier_code+`.png"><span> </span>`;
                                                            }
                                                        }
                                                        text += `<br/>`;
                                                        if(resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].fares.length > 0){
                                                            text += `<span>`
                                                            if(resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].fares[0].cabin_class != '' &&  airline_cabin_class_list.hasOwnProperty(resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].fares[0].cabin_class)){
                                                                if(is_citilink && resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].fares[0].cabin_class == 'W')
                                                                    text += airline_cabin_class_list['W1']
                                                                else
                                                                    text += airline_cabin_class_list[resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].fares[0].cabin_class]
                                                            }
                                                            text += `<br/>Class: `+resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].fares[0].class_of_service+`</span>`;
                                                        }
                                                    }
                                                    text+=`
                                                    </div>
                                                    <div class="col-lg-9">`;
                                                    for(k in resJson.result.response.price_itinerary_provider[i].journeys[j].segments){
                                                        //datacopy
                                                        $text += '‣ ';
                                                        try{
                                                            //sesuai dict
                                                            $text += airline_carriers[0][resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].carrier_code].name + ' (' + resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].carrier_code + resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].carrier_number + ') ';
                                                        }catch(err){
                                                            //di dict tidak ada
                                                            $text += resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].carrier_code + ' (' + resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].carrier_code + resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].carrier_number + ') ';

                                                        }
                                                        for(l in resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].fares){
                                                            if(resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].fares[l].cabin_class != '' && airline_cabin_class_list.hasOwnProperty(resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].fares[l].cabin_class)){
                                                                if(is_citilink && resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].fares[l].cabin_class == 'W')
                                                                    $text += airline_cabin_class_list['W1'];
                                                                else
                                                                    $text += airline_cabin_class_list[resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].fares[l].cabin_class];
                                                            }
                                                            $text += ' (' + resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].fares[l].class_of_service + ')\n';
                                                        }
                                                        //operated by
                                                        try{
                                                            //sesuai dict
                                                            if(resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].carrier_code != resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].operating_airline_code && resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].operating_airline_code != ''){
                                                                $text += 'Operated By ' + airline_carriers[0][resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].operating_airline_code].name + '\n';
                                                            }
                                                        }catch(err){
                                                            //di dict tidak ada
                                                            if(resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].carrier_code != resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].operating_airline_code && resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].operating_airline_code != ''){
                                                                $text += 'Operated By ' + resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].operating_airline_code + '\n';
                                                            }
                                                        }

                            //                            $text += '\n';
                            //                            $text += 'Departure: ';
                            //                            $text += resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].origin_name + ' (' + resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].origin_city + ') ' + resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].departure_date + '\n';

                            //                            $text += '\n';
                            //                            $text += 'Arrival: ';
                            //                            $text += resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].destination_name + ' (' + resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].destination_city + ') '+resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].arrival_date +'\n\n';

                                                         $text += '\n'+resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].origin_city + ' (' + resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].origin + ') - ' + resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].destination_city + ' (' + resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].destination + ')\n';
                                                         $text += 'Departure Date  : '+resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].departure_date+'\n';
                                                         $text += 'Arrival Date    : '+resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].arrival_date +'\n\n';

                                                        for(l in resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].legs){
                                                            text+=`
                                                                <div class="row">
                                                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                                                        <table style="width:100%">
                                                                            <tr>
                                                                                <td class="airport-code"><h5>`+resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].legs[l].departure_date.split(' - ')[1]+`</h5></td>
                                                                                <td style="padding-left:15px;">
                                                                                    <img src="/static/tt_website_rodextrip/img/icon/airlines-01.png" alt="Airline" style="width:20px; height:20px;"/>
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
                                                                        <span style="font-size:13px;">`+resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].legs[l].departure_date.split(' - ')[0]+`</span></br>
                                                                        <span style="font-size:13px; font-weight:500;">`+resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].legs[l].origin_city+` (`+resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].legs[l].origin+`)</span><br/>`;
                                                                    if(resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].legs[l].origin_terminal != ''){
                                                                        text+=`<span style="font-size:13px; font-weight:500;">Terminal: `+resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].legs[l].origin_terminal+`</span>`;
                                                                    }else{
                                                                        text+=`<span style="font-size:13px; font-weight:500;">Terminal: -</span>`;
                                                                    }
                                                                    text+=`
                                                                    </div>
                                                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                                                        <table style="width:100%; margin-bottom:6px;">
                                                                            <tr>
                                                                                <td><h5>`+resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].legs[l].arrival_date.split(' - ')[1]+`</h5></td>
                                                                                <td></td>
                                                                                <td style="height:30px;padding:0 15px;width:100%"></td>
                                                                            </tr>
                                                                        </table>
                                                                        <span style="font-size:13px;">`+resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].legs[l].arrival_date.split(' - ')[0]+`</span><br/>
                                                                        <span style="font-size:13px; font-weight:500;">`+resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].legs[l].destination_city+` (`+resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].legs[l].destination+`)</span><br/>`;

                                                                        if(resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].legs[l].destination_terminal != ''){
                                                                            text+=`<span style="font-size:13px; font-weight:500;">Terminal: `+resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].legs[l].destination_terminal+`</span>`;
                                                                        }else{
                                                                            text+=`<span style="font-size:13px; font-weight:500;">Terminal: -</span>`;
                                                                        }

                                                                    text+=`
                                                                    </div>
                                                                </div>`;
                                                        }

                                                        if(k == resJson.result.response.price_itinerary_provider[i].journeys[j].segments.length - 1)
                                                            text+=`</div>`;
                                                        if(airline_price.length > resJson.result.response.price_itinerary_provider[i].journeys.length || //journey
                                                           airline_price.length > resJson.result.response.price_itinerary_provider.length){ //provider
                                                            fare_print = true;
                                                        }
                                                    }
                                                    text+=`</div>`;

                                                    if(resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].fares.length > 0){
                                                        text+=`
                                                        <div class="row">
                                                            <div class="col-lg-12 mt-2 mb-2">`;
                                                            if(provider_list_data[resJson.result.response.price_itinerary_provider[i].provider].is_post_issued_reschedule)
                                                                text+=`
                                                                    <span style="padding:5px 10px; margin-right:5px; border:1px solid #cdcdcd; background:#fafafa; font-weight:bold; border-radius:14px;"><i class="fas fa-check-circle" style="color:#4f9c64;"></i> Reschedule</span>`;
                                //                            if(provider_list_data[resJson.result.response.price_itinerary_provider[i].provider].is_post_issued_cancel)
                                //                                text+=`
                                //                                    <span style="padding:5px 10px; margin-right:5px; border:1px solid #cdcdcd; background:#fafafa; font-weight:bold; border-radius:14px;"><i class="fas fa-check-circle" style="color:#4f9c64;"></i> Refund</span>`;
                                                        text+=`</div>
                                                        </div>`;
                                                    }

                        //                        if(fare_print == true){
                        //                            fare_print = false;
                        //                            text+=`
                        //                            </div>
                        //                        </div>`;
                        //                            temp = render_price_in_get_price(text, $text, $text_price)
                        //                            text = temp[0];
                        //                            $text = temp[1];
                        //                            $text_price = temp[2];
                        //                        }else{
                        //                            text+=`</div></div></div></div>`;
                        //                        }

                                            text+=`</div>
                                            </div>
                                        </div>
                                    </div>`;
                                }
                                temp = render_price_in_get_price(text, $text, $text_price)
                                text = temp[0];
                                $text = temp[1];
                                $text_price = temp[2];
                            }
//                            for(;price_counter<airline_price.length;i++){
//                                temp = render_price_in_get_price(text, $text, $text_price)
//                                text = temp[0];
//                                $text = temp[1];
//                                $text_price = temp[2];
//                            }
                            if($text_price != ''){
                                $text += $text_price;
                                $text_price = '';
                            }

                        text+=`
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
            text_detail_next +=`
            <div class="col-lg-12">
            <div class="row">
                <div class="col-lg-12">
                    <br/>
                    <div class="row">
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                            <span style="font-size:14px; font-weight: bold;"><b>Total</b></span>
                        </div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">`;
                        text_detail_next+=`<span style="font-size:14px; font-weight: bold;"><b>`+airline_price[0].ADT.currency+` `+getrupiah(Math.ceil(total_price+total_discount))+`</b></span><br/>`;

                        text_detail_next+=`
                        </div>
                    </div>
                </div>

                <div class="col-lg-12" style="padding-bottom:10px;">
                <hr/>
                <span style="font-size:14px; font-weight:bold;">Share This on:</span><br/>`;
                if(total_discount != 0)
                    $text += '‣ Discount: IDR '+ getrupiah(Math.ceil(total_discount*-1)) + '\n';
                $text += '‣ Grand Total: IDR '+ getrupiah(Math.ceil(total_price+total_discount)) + '\nPrices and availability may change at any time';
                share_data();
                var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                if (isMobile) {
                    text_detail_next+=`
                        <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png" alt="Whatsapp"/></a>
                        <a href="line://msg/text/`+ $text_share +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png" alt="Line"/></a>
                        <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png" alt="Telegram"/></a>
                        <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png" alt="Email"/></a>`;
                } else {
                    text_detail_next+=`
                        <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png" alt="Whatsapp"/></a>
                        <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png" alt="Line"/></a>
                        <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png" alt="Telegram"/></a>
                        <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png" alt="Email"/></a>`;
                }
                text_detail_next+=`</div>`;
                if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
                    text_detail_next+=`
                        <div class="col-lg-12" style="text-align:center; display:none;" id="show_commission">
                            <div class="alert alert-success">
                                <span style="font-size:13px; font-weight: bold;">Your Commission: IDR `+getrupiah(commission_price*-1)+`</span><br>
                            </div>
                        </div>`;
                text_detail_next+=`
                    <div class="col-lg-4 col-md-4 col-sm-4" style="padding-bottom:5px;">
                        <input class="primary-btn-white" style="width:100%;" type="button" onclick="copy_data();" value="Copy Flight Detail">
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-4" style="padding-bottom:5px;">`;
                if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
                   text_detail_next+=`
                        <input class="primary-btn-white" id="show_commission_button" style="width:100%;" type="button" onclick="show_commission('commission');" value="Show Commission"><br/>
                    `;
                text_detail_next += `</div>`;
                if(agent_security.includes('book_reservation') == true)
                text_detail_next+=`
                    <div class="col-lg-4 col-md-4 col-sm-4" style="padding-bottom:5px;">
                        <button class="primary-btn btn-next ld-ext-right" style="width:100%;" onclick="next_disabled(); airline_sell_journeys();" type="button" value="Next">
                            Next
                            <div class="ld ld-ring ld-cycle"></div>
                        </button>
                    </div>`;
                text_detail_next+=`
                    </div>
                </div>
            </div>`;

                document.getElementById('airline_detail').innerHTML = text;
                document.getElementById('airline_detail_next').innerHTML = text_detail_next;
                for(i in resJson.result.response.price_itinerary_provider){
                    for(j in resJson.result.response.price_itinerary_provider[i].journeys){
                        if(resJson.result.response.price_itinerary_provider[i].journeys[j].hasOwnProperty('search_banner')){
                           for(banner_counter in resJson.result.response.price_itinerary_provider[i].journeys[j].search_banner){
                               var max_banner_date = moment().subtract(parseInt(-1*resJson.result.response.price_itinerary_provider[i].journeys[j].search_banner[banner_counter].minimum_days), 'days').format('YYYY-MM-DD');
                               var selected_banner_date = moment(resJson.result.response.price_itinerary_provider[i].journeys[j].departure_date.split(' - ')[0]).format('YYYY-MM-DD');

                               if(selected_banner_date >= max_banner_date){
                                   if(resJson.result.response.price_itinerary_provider[i].journeys[j].search_banner[banner_counter].active == true && resJson.result.response.price_itinerary_provider[i].journeys[j].search_banner[banner_counter].description != ''){
                                       new jBox('Tooltip', {
                                            attach: '#pop_search_banner_cart'+i+j+banner_counter,
                                            theme: 'TooltipBorder',
                                            width: 280,
                                            position: {
                                              x: 'center',
                                              y: 'bottom'
                                            },
                                            closeOnMouseleave: true,
                                            animation: 'zoomIn',
                                            content: resJson.result.response.price_itinerary_provider[i].journeys[j].search_banner[banner_counter].description
                                       });
                                   }
                               }
                           }
                        }
                    }
                }

                $('.btn-next').prop('disabled', true);
                $('#loading-search-flight').hide();
                $('#choose-ticket-flight').hide();
                //check here
                text = '[';
                for(i in resJson.result.response.price_itinerary_provider){
                    if(i!=0)
                        text+= '&&&';
                    text += JSON.stringify(resJson.result.response.price_itinerary_provider[i]);
                }
                text+= ']';
                document.getElementById('airline_pick').value = text;
                get_fare_rules();

            }else if(resJson.result.error_code == 4003 || resJson.result.error_code == 4002){
                auto_logout();
            }else if(resJson.result.error_code == 4024){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  text: resJson.result.error_msg,
                }).then((result) =>{
                  if (result.value) {
                    window.location.href="/airline";
                  }
                })
            }
            else{
                //document.getElementById("badge-flight-notif").innerHTML = "0";
                //document.getElementById("badge-flight-notif2").innerHTML = "0";
                //$("#badge-flight-notif").removeClass("infinite");
                //$("#badge-flight-notif2").removeClass("infinite");
                //$('#button_chart_airline').hide();
                text = `<div class="col-lg-12" style="text-align:center;"><span style="font-weight: bold; font-size:14px; padding:15px;">No Price Itinerary</span></div>`;
//                check_other_class = false;
//                for(pick in airline_pick_list){
//                    for(segment in airline_pick_list[pick].segments){
//                        if(airline_pick_list[pick].segments[segment].fares.length > 1){
//                            check_other_class = true;
//                            break;
//                        }
//                    }
//                    if(check_other_class == true)
//                        break;
//                }
//                if(check_other_class == true){
//                    text += `<div class="col-lg-12" style="text-align:center;"><button type="button" class="primary-btn-custom" onclick="set_automatic_combo_price('');">Change class to combo</button></div>`;
//                }

                document.getElementById('airline_detail').innerHTML = text;
                $('#loading-search-flight').hide();
                $('#choose-ticket-flight').hide();
            }

       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           added = 1;
           for(i in airline_pick_list){
                try{
                    document.getElementById('changejourney_pick'+parseInt(parseInt(i)+added)).disabled = false;
                }catch(err){
                    added++;
                    try{
                        document.getElementById('changejourney_pick'+parseInt(parseInt(i)+added)).disabled = false;
                    }catch(err){
                        console.log(err); // error kalau ada element yg tidak ada
                    }
                }
           }
           //document.getElementById("badge-flight-notif").innerHTML = "0";
           //document.getElementById("badge-flight-notif2").innerHTML = "0";
           //$("#badge-flight-notif").removeClass("infinite");
           //$("#badge-flight-notif2").removeClass("infinite");
           //$('#button_chart_airline').hide();
           text = `<span style="font-weight: bold; font-size:14px; padding:15px;">No Price Itinerary</span>`;
           document.getElementById('airline_detail').innerHTML = text;
           $('#loading-search-flight').hide();
           $('#choose-ticket-flight').hide();
           error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error airline price itinerary request');
           $('.loader-rodextrip').fadeOut();
       },timeout: 120000
    });
}

function render_price_in_get_price(text, $text, $text_share){

    text+=`
    <div class="col-lg-12" id="rules`+rules+`" style="padding-bottom:15px;">
        <span class="carrier_code_template"> Term and Condition </span><br/>
        <span style="font-size:16px; font-weight:bold;">PLEASE WAIT ... </span>
        <div class="sk-circle">
            <div class="sk-circle1 sk-child"></div>
            <div class="sk-circle2 sk-child"></div>
            <div class="sk-circle3 sk-child"></div>
            <div class="sk-circle4 sk-child"></div>
            <div class="sk-circle5 sk-child"></div>
            <div class="sk-circle6 sk-child"></div>
            <div class="sk-circle7 sk-child"></div>
            <div class="sk-circle8 sk-child"></div>
            <div class="sk-circle9 sk-child"></div>
            <div class="sk-circle10 sk-child"></div>
            <div class="sk-circle11 sk-child"></div>
            <div class="sk-circle12 sk-child"></div>
        </div>
    </div>
    `;

    rules++;
    //price
    price = 0;
    discount = 0;
    //adult

    try{//adult
        if(airline_request.adult != 0){
            try{
                if(airline_price[price_counter].ADT['roc'] != null)
                    price = airline_price[price_counter].ADT['roc'];
                if(airline_price[price_counter].ADT.tax != null)
                    price += airline_price[price_counter].ADT.tax;

            }catch(err){

            }
            commission = 0;
            if(airline_price[price_counter].ADT['rac'] != null)
                commission = airline_price[price_counter].ADT['rac']
            commission_price += commission;
            total_price += (airline_request.adult * airline_price[price_counter].ADT['fare']) + price;
            if(airline_price[price_counter].ADT.hasOwnProperty('disc')){
                total_discount += airline_request.adult * airline_price[price_counter].ADT['disc'];
                discount += airline_request.adult * airline_price[price_counter].ADT['disc'];
            }
            text+=`
            <div class="col-lg-12">
                <div class="row">
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                        <span style="font-size:13px; font-weight:500;">`+airline_request.adult+`x Adult Fare @`+airline_price[price_counter].ADT.currency +' '+getrupiah(Math.ceil(airline_price[price_counter].ADT.fare))+`</span><br/>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                        <span style="font-size:13px; font-weight:500;">`+getrupiah(Math.ceil(airline_price[price_counter].ADT.fare * airline_request.adult))+`</span>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                        <span style="font-size:13px; font-weight:500;">Service Charge</span>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                        <span style="font-size:13px; font-weight:500;">`+getrupiah(Math.ceil(price))+`</span>
                    </div>
                    <div class="col-lg-12" style="border:1px solid #e3e3e3;"></div>
                </div>
            </div>`;
            $text_price+= 'Price\n';
            $text_price += airline_request.adult + ' Adult Fare @'+ airline_price[price_counter].ADT.currency +' '+getrupiah(Math.ceil(airline_price[price_counter].ADT.fare))+'\n';
            $text_price += 'Adult Tax '+ airline_price[price_counter].ADT.currency +' '+getrupiah(Math.ceil(price))+'\n';
            price = 0;
        }
    }catch(err){

    }

    try{//child
        if(airline_request.child != 0){
            try{
                if(airline_price[price_counter].CHD['roc'] != null)
                    price = airline_price[price_counter].CHD['roc'];
                if(airline_price[price_counter].CHD.tax != null)
                    price += airline_price[price_counter].CHD.tax;
            }catch(err){

            }
            commission = 0;
            if(airline_price[price_counter].CHD['rac'] != null)
                commission = airline_price[price_counter].CHD['rac'];
            commission_price += commission;
            total_price += (airline_request.child * airline_price[price_counter].CHD['fare']) + price;
            if(airline_price[price_counter].CHD.hasOwnProperty('disc')){
                total_discount += airline_request.child * airline_price[price_counter].CHD['disc'];
                discount += airline_request.child * airline_price[price_counter].CHD['disc'];
            }
            text+=`
            <div class="col-lg-12">
                <div class="row">
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                        <span style="font-size:13px; font-weight:500;">`+airline_request.child+`x Child Fare @`+airline_price[price_counter].CHD.currency+' '+getrupiah(Math.ceil(airline_price[price_counter].CHD.fare))+`</span><br/>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                        <span style="font-size:13px; font-weight:500;">`+getrupiah(Math.ceil(airline_price[price_counter].CHD.fare * airline_request.child))+`</span>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                        <span style="font-size:13px; font-weight:500;">Service Charge</span>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                        <span style="font-size:13px; font-weight:500;">`+getrupiah(Math.ceil(price * airline_request.child))+`</span>
                    </div>
                    <div class="col-lg-12" style="border:1px solid #e3e3e3;"></div>
                </div>
            </div>`;
            $text_price += airline_request.child + ' Child Fare @'+ airline_price[i].CHD.currency +' '+getrupiah(Math.ceil(airline_price[i].CHD.fare))+'\n';
            $text_price += 'Child Tax '+ airline_price[i].CHD.currency +' '+getrupiah(Math.ceil(price))+'\n';
            price = 0;
        }
    }catch(err){

    }

    try{//infant
        if(airline_request.infant != 0){
            price = 0;
            try{
                if(airline_price[price_counter].INF['roc'] != null)
                    price = airline_price[price_counter].INF['roc'];
                if(airline_price[price_counter].INF.tax != null)
                    price += airline_price[price_counter].INF.tax;
            }catch(err){

            }
            commission = 0;
            try{
                if(airline_price[price_counter].INF['rac'] != null)
                    commission = airline_price[price_counter].INF['rac'];
            }catch(err){

            }
            commission_price += commission;
            total_price += (airline_request.infant * airline_price[price_counter].INF['fare']) + price;
            if(airline_price[price_counter].INF.hasOwnProperty('disc')){
                total_discount += airline_request.infant * airline_price[price_counter].INF['disc'];
                discount += airline_request.infant * airline_price[price_counter].INF['disc'];
            }
            text+=`
            <div class="col-lg-12">
                <div class="row">
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                        <span style="font-size:13px; font-weight:500;">`+airline_request.infant+`x Infant Fare @`+airline_price[price_counter].INF.currency+' '+getrupiah(Math.ceil(airline_price[price_counter].INF.fare))+`</span><br/>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                        <span style="font-size:13px; font-weight:500;">`+getrupiah(Math.ceil(airline_price[price_counter].INF.fare * airline_request.infant))+`</span>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                        <span style="font-size:13px; font-weight:500;">Service Charge</span>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                        <span style="font-size:13px; font-weight:500;">`+getrupiah(Math.ceil(price * airline_request.infant))+`</span>
                    </div>
                    <div class="col-lg-12" style="border:1px solid #e3e3e3;"></div>
                </div>
            </div>`;
            $text_price += airline_request.infant + ' Infant Fare @'+ airline_price[price_counter].INF.currency +' '+getrupiah(Math.ceil(airline_price[price_counter].INF.fare))+'\n';
            $text_price += 'Infant Tax'+ airline_price[price_counter].INF.currency +' '+getrupiah(Math.ceil(price))+'\n';
            price = 0;
        }
    }catch(err){

    }
    if(discount != 0){
        text += `
            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                <span style="font-size:13px; font-weight:500;">Discount</span>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                <span style="font-size:13px; font-weight:500;">`+getrupiah(Math.ceil(discount))+`</span>
            </div>
        `;
        $text_price += 'Discount ' + getrupiah(Math.ceil(discount)) + '\n';
    }
    price_counter++;
    $text_price += '\n';
    if(airline_price.length == max_flight){
        $text += $text_price;
        $text_price = '';
    }
    text += `<div class="col-lg-12 mb-2"></div>`;
    temp = [text, $text, $text_price]
    return temp
}

function get_fare_rules(){
    getToken();
    try{
        data_request = JSON.stringify(get_price_airline_response.result.request)
    }catch(err){
        data_request = ''
    }
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'get_fare_rules',
       },
       data: {
            'signature': signature,
            'data': data_request
       },
       success: function(msg) {
            last_session = 'sell_journeys';
            count_fare = 0;
            text_fare = '';
            if(msg.result.error_code == 0){
                for(i in msg.result.response.fare_rule_provider){
                    if(msg.result.response.fare_rule_provider[i].hasOwnProperty('journeys') == true){
                        if(msg.result.response.fare_rule_provider[i].hasOwnProperty('rules') && msg.result.response.fare_rule_provider[i].rules.length != 0){
                            text_fare+=`
                                <span id="span-tac-up`+count_fare+`" class="carrier_code_template mt-3" style="display:block; cursor:pointer; padding:15px; border:1px solid #cdcdcd; border-radius:7px;" onclick="show_hide_tac(`+count_fare+`);"> Show Term and Condition <i class="fas fa-chevron-down"></i></span>
                                <span id="span-tac-down`+count_fare+`" class="carrier_code_template mt-3" style="display:none; cursor:pointer; padding:15px; border:1px solid #cdcdcd; border-radius:7px;" onclick="show_hide_tac(`+count_fare+`);"> Hide Term and Condition <i class="fas fa-chevron-up"></i></span>
                                <div id="div-tac`+count_fare+`" style="display:none; padding:15px; border:1px solid #cdcdcd;">`;
                            for(k in msg.result.response.fare_rule_provider[i].rules){
                                if(msg.result.response.fare_rule_provider[i].rules[k] != ""){
                                    text_fare += `<span style="font-weight:bold;">`+msg.result.response.fare_rule_provider[i].rules[k].name+`</span><br/>`;
                                    for(l in msg.result.response.fare_rule_provider[i].rules[k].description){
                                        text_fare += `<div class="row">
                                                        <div class="col-lg-1 col-xs-1 col-md-1">
                                                            <i class="fas fa-circle" style="font-size:9px;margin-left:15px;"></i>
                                                        </div>
                                                        <div class="col-lg-11 col-xs-11 col-md-11" style="padding:0">
                                                            <span style="font-weight:400;"> `+msg.result.response.fare_rule_provider[i].rules[k].description[l]+`</span><br/>
                                                        </div>
                                                      </div>`;
                                    }
                                }
                            }
                            if(msg.result.response.fare_rule_provider[i].rules.length == 0)
                                text_fare += `<span style="font-weight:400;"><i class="fas fa-circle" style="font-size:9px;"></i> No fare rules</span><br/>`;
                            text_fare+=`</div>`;
                        }else{
                            text_fare += 'No fare rules';
                        }
                        try{
                            document.getElementById('rules'+count_fare).innerHTML = text_fare;
                        }catch(err){
                            console.log(err);
                        }
                        text_fare = '';
                        count_fare++;
                    }else{
                        try{
                            for(var i=0;i<5;i++)//hardcode
                                document.getElementById('rules'+i).innerHTML = 'No fare rules';
                        }catch(err){

                        }
                    }

                }
                try{
                    for(var i=count_fare;i<5;i++)//hardcode
                        document.getElementById('rules'+i).innerHTML = 'No fare rules';
                }catch(err){

                }

            }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
            }else if(msg.result.error_code == 4024){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  text: msg.result.error_msg,
                }).then((result) =>{
                  if (result.value) {
                    window.location.href="/airline";
                  }
                })
            }else{
                try{
                    for(var i=0;i<100;i++)//hardcode
                        document.getElementById('rules'+i).innerHTML = 'No fare rules';
                }catch(err){

                }
            }
            $('.btn-next').prop('disabled', false);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            try{
                for(var i=0;i<100;i++)//hardcode
                    document.getElementById('rules'+i).innerHTML = '<b>Oops! Something went wrong, please choose / change again and check your internet connection</b>';
            }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
            }
       },timeout: 60000
    });
}

function airline_sell_journeys(){
    $('.loader-rodextrip').fadeIn();
    getToken();
    try{
        data_request = JSON.stringify(get_price_airline_response.result.request)
    }catch(err){
        data_request = ''
    }
    for(i in airline_pick_list)
        document.getElementById('changejourney_pick'+parseInt(parseInt(i)+1)).disabled = true;
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'sell_journeys',
       },
       data: {
            'signature': signature,
            'data': data_request
       },
       success: function(msg) {
           if(msg.result.error_code == 0){
               document.getElementById('airline_sell_journey_response').value = JSON.stringify(msg.result.response);
               get_seat_availability('');
           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
           }else if(msg.result.error_code == 4024){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  text: msg.result.error_msg,
                }).then((result) =>{
                  if (result.value) {
                    window.location.href="/airline";
                  }
                })
           }else{
                for(i in airline_pick_list)
                    document.getElementById('changejourney_pick'+parseInt(parseInt(i)+1)).disabled = false;
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error airline sell journeys </span>' + msg.result.error_msg,
                })
                $('.loader-rodextrip').fadeOut();
                $('.btn-next').removeClass('running');
                $('.btn-next').prop('disabled', false);
                $('.loader-rodextrip').fadeOut();
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error airline sell journeys');
            $('.loader-rodextrip').fadeOut();
            $('.btn-next').removeClass('running');
            $('.btn-next').prop('disabled', false);
            $('.loader-rodextrip').fadeOut();
       },timeout: 300000
    });

}
//get seat map
function get_seat_availability(type){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'get_seat_availability',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
            if(type == '' || type == 'reorder')
                get_ssr_availability(type);
            else if(type == 'request_new_seat' && msg.result.error_code == 0)
                window.location.href='/airline/seat_map';
            else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error airline seat availability </span>' + msg.result.error_msg,
                })
                $('.loader-rodextrip').fadeOut();
                $('#show_loading_booking_airline').hide();
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error airline seat availability');
            $('.loader-rodextrip').fadeOut();
            $('#show_loading_booking_airline').hide();
       },timeout: 300000
    });
}

//POST
function get_post_seat_availability(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'get_post_seat_availability',
       },
       data: {
            'signature': signature,
            'booking': JSON.stringify(airline_get_detail)
       },
       success: function(msg) {
            if(msg.result.error_code == 0){
                if(msg.result.response.seat_availability_provider.length > 0){
                    document.getElementById('get_booking_data_json').value = JSON.stringify(airline_get_detail);
                    document.getElementById('after_sales_form').action = '/airline/seat_map';
                    document.getElementById('after_sales_form').submit();
                }else{
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: #ff9900;">Error airline no request new seat available</span>',
                    })
                    $('.loader-rodextrip').fadeOut();
                    $('#show_loading_booking_airline').hide();
                    hide_modal_waiting_transaction();
                }
            }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error airline seat availability </span>' + msg.result.error_msg,
                })
                $('.loader-rodextrip').fadeOut();
                $('#show_loading_booking_airline').hide();
                hide_modal_waiting_transaction();
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error airline seat availability');
            $('.loader-rodextrip').fadeOut();
            $('#show_loading_booking_airline').hide();
            hide_modal_waiting_transaction();
       },timeout: 300000
    });
}
//POST
function get_post_ssr_availability(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'get_post_ssr_availability',
       },
       data: {
            'signature': signature,
            'booking': JSON.stringify(airline_get_detail)
       },
       success: function(msg) {
            if(msg.result.error_code == 0){
                var check_ssr = 0;
                for(i in msg.result.response.ssr_availability_provider){
                    if(msg.result.response.ssr_availability_provider[i].hasOwnProperty('ssr_availability') == true && Object.keys(msg.result.response.ssr_availability_provider[i].ssr_availability).length > 0)
                        check_ssr = 1;
                }
                if(check_ssr == 1){
                    document.getElementById('get_booking_data_json').value = JSON.stringify(airline_get_detail);
                    document.getElementById('after_sales_form').action = '/airline/ssr';
                    document.getElementById('after_sales_form').submit();
                }else{
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: #ff9900;">Error airline no request new ssr available</span>',
                    });
                    $('.loader-rodextrip').fadeOut();
                    $('#show_loading_booking_airline').hide();
                    hide_modal_waiting_transaction();
                }
            }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error airline ssr availability </span>' + msg.result.error_msg,
                })
                $('.loader-rodextrip').fadeOut();
                $('#show_loading_booking_airline').hide();
                hide_modal_waiting_transaction();
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error airline ssr availability');
            $('.loader-rodextrip').fadeOut();
            $('#show_loading_booking_airline').hide();
            hide_modal_waiting_transaction();
       },timeout: 300000
    });
}

function get_seat_map_response(){
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'get_seat_map_response',
       },
       data: {
            "signature": signature
       },
       success: function(msg) {
            seat_map = msg;
            check = 0;
            text = '<div class="col-lg-12"> <div class="row">';
            percent = 0;
            segment_list = []
            for(i in seat_map.seat_availability_provider){
                if(seat_map.seat_availability_provider[i].hasOwnProperty('segments')){
                    percent += seat_map.seat_availability_provider[i].segments.length;
                    percent = 75 / percent;
                    for(j in seat_map.seat_availability_provider[i].segments){
                        if(i == 0 && j == 0){
                            set_seat_show_segments = seat_map.seat_availability_provider[i].segments[j].segment_code2+'_'+seat_map.seat_availability_provider[i].segments[j].departure_date;
                            segment_list.push(seat_map.seat_availability_provider[i].segments[j].segment_code2);
                            text += `
                            <div class="col-lg-4 col-md-6 col-sm-6 col-xs-6">
                                <button class="button-seat-pass" style="width:100%; margin-right:10px; margin-bottom:10px; padding:10px;" type="button" id="`+seat_map.seat_availability_provider[i].segments[j].segment_code2+`_`+seat_map.seat_availability_provider[i].segments[j].departure_date+`" onclick="show_seat_map('`+seat_map.seat_availability_provider[i].segments[j].segment_code2+`_`+seat_map.seat_availability_provider[i].segments[j].departure_date+`', false)">
                                    <span>`+seat_map.seat_availability_provider[i].segments[j].segment_code2+`</span><br/>
                                    <span style="font-weight:700">`+moment(seat_map.seat_availability_provider[i].segments[j].departure_date).format('DD MMM YYYY HH:mm')+`</span>
                                </button>
                            </div>`;
                        }else
                        text += `
                        <div class="col-lg-4 col-md-6 col-sm-6 col-xs-6">
                            <button class="button-seat-pass" style="width:100%; margin-right:10px; margin-bottom:10px; padding:10px; color:black; background-color:white;" id="`+seat_map.seat_availability_provider[i].segments[j].segment_code2+`_`+seat_map.seat_availability_provider[i].segments[j].departure_date+`" type="button" onclick="show_seat_map('`+seat_map.seat_availability_provider[i].segments[j].segment_code2+`_`+seat_map.seat_availability_provider[i].segments[j].departure_date+`', false)">
                                <span>`+seat_map.seat_availability_provider[i].segments[j].segment_code2+`</span><br/>
                                <span style="font-weight:700">`+moment(seat_map.seat_availability_provider[i].segments[j].departure_date).format('DD MMM YYYY HH:mm')+`</span>
                            </button>
                        </div>`;
                    }
                }
            }
            text += '</div></div>';
            document.getElementById('airline_seat_map').innerHTML = text;
            show_seat_map(set_seat_show_segments, true)
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error airline seat map response');
            $('.loader-rodextrip').fadeOut();
       },timeout: 300000
    });
}

function show_seat_map(val, checked){
    if(val != set_seat_show_segments || checked == true){
        document.getElementById(set_seat_show_segments).style.background = 'white';
        document.getElementById(set_seat_show_segments).style.color = 'black';
        document.getElementById(val).style.background = color;
        document.getElementById(val).style.color = 'white';
        set_seat_show_segments = val;
        text = '';
        check = 0;
        for(i in seat_map.seat_availability_provider){
            if(check == 1)
                break;
            for(j in seat_map.seat_availability_provider[i].segments){
                if(seat_map.seat_availability_provider[i].segments[j].segment_code2+'_'+seat_map.seat_availability_provider[i].segments[j].departure_date == set_seat_show_segments){
                    try{
                        for(k in seat_map.seat_availability_provider[i].segments[j].seat_cabins){
                            text+=`<div class="mySlides1">
                                        <div style="width:100%;text-align:center;">`;

                            percent = parseInt(50 / seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[0].seats.length+1);
                            for(l in seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows){
                                if(l == 0){
                                    text+=`<div style="width:100%;text-align:center;">`;
                                    for(m in seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats){
                                        if(m == 0)
                                            text+=`<input type="button" style="width:`+(percent)+`%;background-color:transparent;font-size:13px;border:transparent; padding:3px;" id="header`+m+`_`+m+`" disabled/>`;
                                        text+=`<input type="button" style="width:`+(percent+0.5)+`%;background-color:transparent;font-size:13px;border:transparent; padding:3px;" id="header`+m+`" value="`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].column+`" disabled/>`;
    //                                    text+=`<label style="width:`+percent+`%;margin:3px;cursor:not-allowed;">`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].column+`</label>`;
                                    }
                                    text+=`</div>`;
                                }
                                text+=`<div style="width:100%;text-align:center;">`;
                                for(m in seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats){
                                    if(m == 0)
                                        text+=`<label style="width:`+percent+`%; color:`+text_color+`; padding:3px;font-size:13px;color:black" id="">`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].row_number+`</label>`;
                                    check = 0;
                                    for(n in passengers){
                                        if(check == 1)
                                            break;
                                        for(o in passengers[n].seat_list){
                                            seat_pick_parse = ''
                                            if(passengers[n].seat_list[o].seat_pick != '')
                                                seat_pick_parse = passengers[n].seat_list[o].seat_pick.replace(/[^0-9]/g, '') + passengers[n].seat_list[o].seat_pick.replace(/[^A-Za-z]/g, '');
                                            if(passenger_pick == n){
                                                if(passengers[n].seat_list[o].segment_code == seat_map.seat_availability_provider[i].segments[j].segment_code2 && seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].row_number+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].column == seat_pick_parse && passengers[n].seat_list[o].departure_date == seat_map.seat_availability_provider[i].segments[j].departure_date){
                                                    check = 1;
                                                    text+=`<input class="button-seat-map" type="button" style="width:`+percent+`%;font-size:13px;background-color:`+color+`; padding:3px;color:`+text_color+`;" onclick="alert('Already booked');" id="`+seat_map.seat_availability_provider[i].segments[j].segment_code2+`_`+seat_map.seat_availability_provider[i].segments[j].departure_date+`_`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].row_number+`_`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].column+`" value="`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].row_number+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].column+`"/>`;
                                                    break;
                                                }
                                            }else if(passengers[n].seat_list[o].segment_code == seat_map.seat_availability_provider[i].segments[j].segment_code2 && seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].row_number+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].column == seat_pick_parse && passengers[n].seat_list[o].departure_date == seat_map.seat_availability_provider[i].segments[j].departure_date){
                                                check = 1;
                                                text+=`<input class="button-seat-map" type="button" style="width:`+percent+`%;font-size:13px;background-color:#ff8971; padding:3px;color:`+text_color+`;" onclick="alert('Already booked');" id="`+seat_map.seat_availability_provider[i].segments[j].segment_code2+`_`+seat_map.seat_availability_provider[i].segments[j].departure_date+`_`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].row_number+`_`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].column+`"  value="`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].row_number+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].column+`"/>`;
                                                break;
                                            }
                                        }
                                    }
                                    if(check == 0){
                                        if(seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].availability == 0){
                                            text+=`<input class="button-seat-map" type="button" style="width:`+percent+`%;font-size:13px;background-color:#656565; color:`+text_color+`; padding:3px;" id="`+seat_map.seat_availability_provider[i].segments[j].segment_code2+`_`+seat_map.seat_availability_provider[i].segments[j].departure_date+`_`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].row_number+`_`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].column+`" onclick="alert('Already booked');" value="`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].row_number+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].column+`"/>`;
                                        }else if(seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].availability == 1){
                                            text+=`<input class="button-seat-map" type="button" style="width:`+percent+`%;font-size:13px;background-color:#CACACA; padding:3px;" id="`+seat_map.seat_availability_provider[i].segments[j].segment_code2+`_`+seat_map.seat_availability_provider[i].segments[j].departure_date+`_`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].row_number+`_`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].column+`"
                                            onclick="update_seat_passenger('`+seat_map.seat_availability_provider[i].segments[j].segment_code2+`',
                                                                           '`+seat_map.seat_availability_provider[i].segments[j].departure_date+`',
                                                                           '`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].row_number+`',
                                                                           '`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].column+`',
                                                                           '`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].seat_code+`',
                                                                           '`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].seat_name+`',
                                                                           '`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].service_charges[0].currency+`',
                                                                           '`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].service_charges[0].amount+`',
                                                                           '`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].description+`')"
                                            value='`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].row_number+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].column+`'/>`;
                                        }else if(seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].availability == -1){
                                            text+=`<input type="button" style="width:`+percent+`%;background-color:transparent;font-size:13px;border:transparent; padding:3px;" id="`+seat_map.seat_availability_provider[i].segments[j].segment_code2+`_`+seat_map.seat_availability_provider[i].segments[j].departure_date+`_`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].row_number+`_`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].column+`" value="" disabled/>`;
                                        }
                                    }
                                }
                                text+=`</div>`;
                            }
                            text+=`
                                </div>
                            </div>`;
                        }

                        check = 1;
                        if(text != '')
                            text+=`<a class="prev" onclick="plusSlides(-1, 0)" style="font-size:15px; padding:0px;">&#10094; Prev</a>
                               <a class="next" onclick="plusSlides(1, 0)" style="font-size:15px; padding:0px;">Next &#10095;</a>`;
                        break;
                    }catch(err){
                        console.log(err); // error kalau ada element yg tidak ada
                    }
                }
            }
        }
        document.getElementById('airline_slideshow').innerHTML = text;
        showSlides(1, 0);
    }
}

function set_passenger_seat_map_airline(val){
    text='';
    text += `<hr/>
    <h5 style="color:`+color+`;">
        <i class="fas fa-user"></i> `+passengers[val].title+` `+passengers[val].first_name+` `+passengers[val].last_name+`
    </h5>`;
    if(passengers[val].hasOwnProperty('behaviors') && Object.keys(passengers[val].behaviors).length > 0){
        print_behavior = false;
        text_behaviors=`<br/><b>Behaviors:</b><br/>`;
        for(j in passengers[val].behaviors){
            if(j.toLowerCase() == 'airline'){
                print_behavior = true;
                text_behaviors+=`<b>`+j+`</b><br/>`;
                for(k in passengers[val].behaviors[j]){
                    text_behaviors+=`<span><i>`+k+`: </i><b>`+passengers[val].behaviors[j][k].value+`</b>`;
                    if(passengers[val].behaviors[j][k].remark != '' && passengers[val].behaviors[j][k].remark != false)
                        text_behaviors +=` - `+passengers[val].behaviors[j][k].remark;
                    text_behaviors+=`</span><br/>`;
                }
            }
        }
        if(print_behavior)
            text += text_behaviors
    }
    text+=`
    <div class="row">`;
    for(i in passengers[val].seat_list){
        text+=`
        <div class="col-lg-12">
            <h6 style="padding-top:10px;">
                <img src="/static/tt_website_rodextrip/img/icon/seat.png" style="height:16px; width:auto;"/>
                `+passengers[val].seat_list[i].segment_code+` (`+moment(passengers[val].seat_list[i].departure_date).format('DD MMM YYYY HH:mm')+`): `+passengers[val].seat_list[i].seat_pick+`
            </h6>
            <div style="border:1px solid #cdcdcd; padding:15px; background:white; margin-bottom:10px;">
            <h6>Description: </h6>`;
        for(j in passengers[val].seat_list[i].description){
            //if(j == 0)
                //text+=`<span style="font-weight:400; font-size:14px;">Description:</span><br/>`;
            text+=`<span>`+passengers[val].seat_list[i].description[j]+`</span><br/>`;
        }
        text+=`</div>
        </div>
        <div class="col-lg-12">
            <span style="font-weight:bold; font-size:15px;">Price: `+passengers[val].seat_list[i].currency+` `+getrupiah(passengers[val].seat_list[i].price)+`</span><br/>`;
        if(passengers[val].seat_list[i].seat_name != '')
            text+= `<input class="button-seat-pass button-seat-pass-cancel" type="button" id="cancel_seat`+i+`" style="width:200px; padding: 10px; margin-right: 10px; text-align: center; margin-bottom: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: white;" onclick="set_cancel_seat(`+i+`);" value="Cancel Seat">`;

        text+=`</div><div class="col-lg-12"><hr/></div>`;
    }
    text+=`</div>`;
    document.getElementById('passenger'+(passenger_pick+1)).style.background = 'white';
    document.getElementById('passenger'+(passenger_pick+1)).style.color = 'black';
    document.getElementById('passenger'+(val+1)).style.background = color;
    document.getElementById('passenger'+(val+1)).style.color = 'white';
    passenger_pick = val;
    document.getElementById('airline_passenger_detail_seat').innerHTML = text;
    try{
        show_seat_map(set_seat_show_segments,true);
        airline_detail(type);
    }catch(err){
        airline_detail('request_new');
    }

}

function set_first_passenger_seat_map_airline(val){
    text='';
    text += `<hr/>
    <h5 style="color:`+color+`;">
        <i class="fas fa-user"></i> `+passengers[val].title+` `+passengers[val].first_name+` `+passengers[val].last_name+`
    </h5>`;
    if(passengers[val].hasOwnProperty('behaviors') && Object.keys(passengers[val].behaviors).length > 0){
        print_behavior = false;
        text_behaviors=`<br/><b>Behaviors:</b><br/>`;
        for(j in passengers[val].behaviors){
            if(j.toLowerCase() == 'airline'){
                print_behavior = true;
                text_behaviors+=`<b>`+j+`</b><br/>`;
                for(k in passengers[val].behaviors[j]){
                    text_behaviors+=`<span><i>`+k+`: </i><b>`+passengers[val].behaviors[j][k].value+`</b>`;
                    if(passengers[val].behaviors[j][k].remark != '' && passengers[val].behaviors[j][k].remark != false)
                        text_behaviors +=` - `+passengers[val].behaviors[j][k].remark;
                    text_behaviors+=`</span><br/>`;
                }
            }
        }
        if(print_behavior)
            text += text_behaviors
    }
    text+=`
    <div class="row">`;
    for(i in passengers[val].seat_list){
        text+=`
        <div class="col-lg-12">
            <h6 style="padding-top:10px;">
                <img src="/static/tt_website_rodextrip/img/icon/seat.png" style="height:16px; width:auto;"/>
                `+passengers[val].seat_list[i].segment_code+` (`+moment(passengers[val].seat_list[i].departure_date).format('DD MMM YYYY HH:mm')+`) : `+passengers[val].seat_list[i].seat_pick+`
            </h6>
            <div style="border:1px solid #cdcdcd; padding:15px; background:white; margin-bottom:10px;">
            <h6>Description: </h6>`;
        for(j in passengers[val].seat_list[i].description){
            //if(j == 0)
                //text+=`<span style="font-weight:400; font-size:14px;">Description:</span><br/>`;
            text+=`<span>`+passengers[val].seat_list[i].description[j]+`</span><br/>`;
        }
        text+=`</div>
        </div>
        <div class="col-lg-12">`;
        text+=`<span style="font-weight:bold; font-size:15px;">Price: `+passengers[val].seat_list[i].currency+` `+getrupiah(passengers[val].seat_list[i].price)+`</span>`;
        if(passengers[val].seat_list[i].seat_name != '')
            text+= `<br/><input class="button-seat-pass button-seat-pass-cancel" type="button" id="cancel_seat" style="width: 200px; background: `+color+`; padding: 10px; margin-right: 10px; text-align: center; margin-bottom: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: white;" onclick="set_cancel_seat(`+i+`);" value="Cancel Seat">`;
        text+=`</div><div class="col-lg-12"><hr/></div>`;
    }
    text+=`</div>`;
    document.getElementById('passenger'+(val+1)).style.background = color;
    document.getElementById('passenger'+(val+1)).style.color = 'white';
    passenger_pick = val;
    document.getElementById('airline_passenger_detail_seat').innerHTML = text;
}

function set_cancel_seat(segment_number){
    if(isNaN(passengers[passenger_pick].seat_list[segment_number].price) == false)
        if(additional_price - parseFloat(passengers[passenger_pick].seat_list[segment_number].price) >= 0 )
            additional_price -= parseFloat(passengers[passenger_pick].seat_list[segment_number].price);
    passengers[passenger_pick].seat_list[segment_number].seat_pick = '';
    passengers[passenger_pick].seat_list[segment_number].seat_code = '';
    passengers[passenger_pick].seat_list[segment_number].seat_name = '';
    passengers[passenger_pick].seat_list[segment_number].currency = '';
    passengers[passenger_pick].seat_list[segment_number].price = '';
    passengers[passenger_pick].seat_list[segment_number].description = '';
    set_passenger_seat_map_airline(passenger_pick);
}

function update_seat_passenger(segment, departure_date, row, column,seat_code,seat_name, currency, amount,description){

    $('html, body').animate({
        scrollTop: $("#airline_passenger_detail_seat").offset().top - 110
    }, 500);

    if(isNaN(passenger_pick) == false){
        try{
            for(i in passengers[passenger_pick].seat_list){
                if(passengers[passenger_pick].seat_list[i].segment_code == segment && departure_date == passengers[passenger_pick].seat_list[i].departure_date){
                    //lepas passenger seat
                    if(passengers[passenger_pick].seat_list[i].seat_pick != ''){
                        seat_choose_pax = passengers[passenger_pick].seat_list[i].seat_pick;
//                        get_seat_check = false;
//                        for(j in seat_map.seat_availability_provider){
//                            for(k in seat_map.seat_availability_provider[j].segments){
//                                if(seat_map.seat_availability_provider[j].segments[k].segment_code2 == passengers[passenger_pick].seat_list[i].segment_code && seat_map.seat_availability_provider[j].segments[k].departure_date == passengers[passenger_pick].seat_list[i].departure_date){
//                                    for(l in seat_map.seat_availability_provider[j].segments[k].seat_cabins){
//                                        for(m in seat_map.seat_availability_provider[j].segments[k].seat_cabins[l].seat_rows){
//                                            if(seat_map.seat_availability_provider[j].segments[k].seat_cabins[l].seat_rows[m].row_number == seat_choose_pax.replace(/[^0-9]/g, '')){
//                                                for(n in seat_map.seat_availability_provider[j].segments[k].seat_cabins[l].seat_rows[m].seats){
//                                                    console.log(seat_map.seat_availability_provider[j].segments[k].seat_cabins[l].seat_rows[m].seats[n]);
//                                                    console.log(seat_choose_pax.replace(/[^A-Za-z]/g, ''));
//                                                    console.log(passengers[passenger_pick].seat_list[i].seat_code);
//                                                    if(seat_map.seat_availability_provider[j].segments[k].seat_cabins[l].seat_rows[m].seats[n].column == seat_choose_pax.replace(/[^A-Za-z]/g, '')){
//                                                        get_seat_check = true;
//                                                        seat_map.seat_availability_provider[j].segments[k].seat_cabins[l].seat_rows[m].seats[n].availability = 1;
//                                                        console.log(seat_map.seat_availability_provider[j].segments[k].seat_cabins[l].seat_rows[m].seats[n]);
//                                                        break;
//                                                    }
//                                                }
//                                            }
//                                            if(get_seat_check == true)
//                                                break
//                                        }
//                                        if(get_seat_check == true)
//                                            break
//                                    }
//                                }
//                                if(get_seat_check == true)
//                                    break
//                            }
//                            if(get_seat_check == true)
//                               break
//                        }
                        try{
                            document.getElementById(segment+'_'+departure_date+'_'+seat_choose_pax.replace(/[^0-9]/g, '')+'_'+seat_choose_pax.replace(/[^A-Za-z]/g, '')).style.background = '#CACACA';
                            document.getElementById(segment+'_'+departure_date+'_'+seat_choose_pax.replace(/[^0-9]/g, '')+'_'+seat_choose_pax.replace(/[^A-Za-z]/g, '')).style.color = 'black';
                        }catch(err){
                            console.log(err); // error kalau ada element yg tidak ada
                        }

                    }
                    //pasang passenger seat
                    if(passengers[passenger_pick].seat_list[i].price != '')
                        additional_price -= parseFloat(passengers[passenger_pick].seat_list[i].price);
                    additional_price += parseFloat(amount);
                    passengers[passenger_pick].seat_list[i].seat_pick = row+column;
                    passengers[passenger_pick].seat_list[i].seat_code = seat_code;
                    passengers[passenger_pick].seat_list[i].seat_name = seat_name;
                    passengers[passenger_pick].seat_list[i].currency = currency;
                    passengers[passenger_pick].seat_list[i].price = amount;
                    passengers[passenger_pick].seat_list[i].description = description.split(',');
                    document.getElementById(segment+'_'+departure_date+'_'+row+'_'+column).style.background = color;
                    document.getElementById(segment+'_'+departure_date+'_'+row+'_'+column).style.color = 'white';
                    break;
                }
            }
            set_passenger_seat_map_airline(passenger_pick);
        }catch(err){
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              text: 'Please choose passenger first!',
            })
            $('.loader-rodextrip').fadeOut();
        }
    }else{
        Swal.fire({
          type: 'error',
          title: 'Oops!',
          text: 'Please choose passenger first!',
        })
        $('.loader-rodextrip').fadeOut();
    }
}

//SSR
function get_ssr_availability(type){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'get_ssr_availability',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
            if(type == '' || type == 'reorder'){
                get_ff_availability(type);
            }else if(type == 'request_new_ssr' && msg.result.error_code == 0)
                window.location.href='/airline/ssr';
            else if(type == 'request_new_ssr')
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: #ff9900;">Error airline ssr availability </span>' + msg.result.error_msg,
                    })
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error airline ssr availability');
            $('.loader-rodextrip').fadeOut();
       },timeout: 300000
    });
}

function get_ff_availability(type){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'get_ff_availability',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
            if(type == ''){
                try{
                    document.getElementById('time_limit_input').value = time_limit;
                    document.getElementById('signature').value = signature;
                    document.getElementById('airline_price_itinerary').value = JSON.stringify(get_price_airline_response.result.response);
                    document.getElementById('airline_price_itinerary_request').value = JSON.stringify(get_price_airline_response.result.request);
                }catch(err){
                    console.log(err); // error kalau ada element yg tidak ada
                }
                document.getElementById('go_to_passenger').action = '/airline/passenger/'+ signature;
                document.getElementById('go_to_passenger').submit();
            }else if(type == 'reorder'){
                try{
                    document.getElementById('time_limit_input').value = 1200;
                    document.getElementById('airline_price_itinerary').value = JSON.stringify(get_price_airline_response.result.response);
                    document.getElementById('airline_price_itinerary_request').value = JSON.stringify(get_price_airline_response.result.request);
                }catch(err){
                    console.log(err); // error kalau ada element yg tidak ada
                }
                document.getElementById('go_to_passenger').action = '/airline/passenger/'+ signature;
                document.getElementById('go_to_passenger').submit();
            }else if(type == 'request_new_ssr' && msg.result.error_code == 0)
                window.location.href='/airline/ssr';
            else if(type == 'request_new_ssr')
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error airline ff availability </span>' + msg.result.error_msg,
                })
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error airline ssr availability');
            $('.loader-rodextrip').fadeOut();
       },timeout: 300000
    });
}

function airline_update_passenger(val){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'update_passengers',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
           if(msg.result.error_code == 0){
               if(ssr == 0) //set ssr
                airline_set_ssr(val);
               else if(seat == 0)
                airline_assign_seats(val);
               else
                if(val == 0)
                    airline_commit_booking(val);
                else
                    document.getElementById('airline_issued').submit();

           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
           }else if(msg.result.error_code == 4024){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  text: msg.result.error_msg,
                }).then((result) =>{
                  if (result.value) {
                    window.location.href="/airline";
                  }
                })
           }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error airline update passenger </span>' + msg.result.error_msg,
                })
                $('.loader-rodextrip').fadeOut();
                hide_modal_waiting_transaction();
                $('.btn-next').removeClass('running');
                $('.btn-next').prop('disabled', false);
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error airline update passenger');
            $('.loader-rodextrip').fadeOut();
            hide_modal_waiting_transaction();
            $('.btn-next').removeClass('running');
            $('.btn-next').prop('disabled', false);
       },timeout: 300000
    });
}

function airline_update_contact_booker(val){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'update_contacts',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
           if(msg.result.error_code == 0){
                airline_update_passenger(val);
           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
           }else if(msg.result.error_code == 4024){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  text: msg.result.error_msg,
                }).then((result) =>{
                  if (result.value) {
                    window.location.href="/airline";
                  }
                })
           }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error Error airline update booker </span>' + msg.result.error_msg,
                }).then((result) => {
                  if (result.value) {
                    hide_modal_waiting_transaction();
                  }
                })
                hide_modal_waiting_transaction();
                $('.btn-next').removeClass('running');
                $('.btn-next').prop('disabled', false);
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error airline update booker');
            hide_modal_waiting_transaction();
            hide_modal_waiting_transaction();
            $('.btn-next').removeClass('running');
            $('.btn-next').prop('disabled', false);
       },timeout: 300000
    });
}

function airline_set_ssr(val){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'sell_ssrs',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
           if(msg.result.error_code == 0){
                for(i in msg.result.response.sell_ssr_provider){
                    error_log = '';
                    if(msg.result.response.sell_ssr_provider[i].status == "unavailable"){
                        error_log += msg.result.response.sell_ssr_provider[i].error_msg+'\n';
                    }
                }
                if(error_log != ''){
                    Swal.fire({
                      title: msg.result.error_msg,
                      type: 'warning',
                      showCancelButton: true,
                      confirmButtonColor: '#3085d6',
                      cancelButtonColor: '#d33',
                      confirmButtonText: 'Yes'
                    }).then((result) => {
                      if (result.value) {
                        if(seat == 0)
                            airline_assign_seats(val);
                        else
                            if(val == 0)
                                airline_commit_booking(val);
                            else
                                document.getElementById('airline_issued').submit();

                      }else{
                           window.location.href="/dashboard";
                      }
                    })
                }else{
                    if(seat == 0)
                        airline_assign_seats(val);
                    else
                        if(val == 0)
                            airline_commit_booking(val);
                        else
                            document.getElementById('airline_issued').submit();
                }
           }else{
                Swal.fire({
                  title: msg.result.error_msg,
                  type: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Yes'
                }).then((result) => {
                  if (result.value) {
                    if(seat == 0)
                        airline_assign_seats(val);
                    else
                        if(val == 0)
                            airline_commit_booking(val);
                        else
                            document.getElementById('airline_issued').submit();
                  }else{
                       window.location.href="/dashboard";
                  }
                })
           }

       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error airline seat ssr');
            $('.loader-rodextrip').fadeOut();
            hide_modal_waiting_transaction();
            $('.btn-next').removeClass('running');
            $('.btn-next').prop('disabled', false);
       }, timeout: 300000
    });
}

function airline_assign_seats(val){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'assign_seats',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
           if(msg.result.error_code == 0){
                error_log = '';
                for(i in msg.result.response.seat_provider){
                    if(msg.result.response.seat_provider[i].status == 'unavailable')
                        error_log += msg.result.response.seat_provider[i].error_msg + '\n';
                }
                if(error_log == '')
                    if(val == 0)
                        airline_commit_booking(val);
                    else
                        document.getElementById('airline_issued').submit();
                else{
                    Swal.fire({
                      title: error_log,
                      type: 'warning',
                      showCancelButton: true,
                      confirmButtonColor: '#3085d6',
                      cancelButtonColor: '#d33',
                      confirmButtonText: 'Yes'
                    }).then((result) => {
                      if (result.value)
                            if(val == 0)
                                airline_commit_booking(val);
                            else
                                document.getElementById('airline_issued').submit();
                      else{
                           window.location.href="/dashboard";
                      }
                    })
                }
           }else{
                Swal.fire({
                  title: msg.result.error_msg,
                  type: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Yes'
                }).then((result) => {
                  if (result.value)
                        if(val == 0)
                            airline_commit_booking(val);
                        else
                            document.getElementById('airline_issued').submit();
                  else{
                       window.location.href="/dashboard";
                  }
                })
           }

       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error airline assign seats');
            $('.loader-rodextrip').fadeOut();
            hide_modal_waiting_transaction();
            $('.btn-next').removeClass('running');
            $('.btn-next').prop('disabled', false);
       },timeout: 300000
    });
}

function force_issued_airline(val){
    //tambah swal
    if(val == 0)
    {
        var temp_title = 'Are you sure you want to Hold Booking?';
    }
    else
    {
        var temp_title = 'Are you sure you want to Force Issued this booking?';
    }
    Swal.fire({
      title: temp_title,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        $('.next-loading-booking').addClass("running");
        $('.next-loading-booking').prop('disabled', true);
        $('.next-loading-issued').prop('disabled', true);
        $('.issued_booking_btn').prop('disabled', true);
        please_wait_transaction();
        airline_commit_booking(val);
      }
    })
}

function airline_commit_booking(val){
    data = {
        'value': val,
        'signature': signature,
        'voucher_code': ''
    }
    try{
        data['acquirer_seq_id'] = payment_acq2[payment_method][selected].acquirer_seq_id;
        data['member'] = payment_acq2[payment_method][selected].method;
        data['voucher_code'] =  voucher_code;
    }catch(err){
        console.log(err); // error kalau ada element yg tidak ada
    }
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'commit_booking',
       },
       data: data,
       success: function(msg) {
           if(google_analytics != ''){
               if(data.hasOwnProperty('member') == true)
                   gtag('event', 'airline_issued', {});
               else
                   gtag('event', 'airline_hold_booking', {});
           }
           if(msg.result.error_code == 0){
               //send order number
               if(val == 0){
                   if(user_login.co_agent_frontend_security.includes('b2c_limitation') == true){
//                        send_url_booking('airline', btoa(msg.result.response.order_number), msg.result.response.order_number);
//                        document.getElementById('order_number').value = msg.result.response.order_number;
//                        document.getElementById('airline_issued').submit();
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
                            send_url_booking('airline', btoa(msg.result.response.order_number), msg.result.response.order_number);
                            document.getElementById('order_number').value = msg.result.response.order_number;
                            document.getElementById('airline_issued').submit();
                          }else{
                               document.getElementById('airline_booking').innerHTML+= '<input type="hidden" name="order_number" value='+msg.result.response.order_number+'>';
                               document.getElementById('airline_booking').action = '/airline/booking/' + btoa(msg.result.response.order_number);
                               document.getElementById('airline_booking').submit();
                          }
                        })
                   }else if(user_login.hasOwnProperty('co_job_position_is_request_required') && user_login.co_job_position_is_request_required == true){
                    Swal.fire({
                      title: 'Success',
                      type: 'success',
                      confirmButtonColor: 'blue',
                      confirmButtonText: 'View Booking',
                    }).then((result) => {
                        document.getElementById('airline_booking').innerHTML+= '<input type="hidden" name="order_number" value='+msg.result.response.order_number+'>';
                        document.getElementById('airline_booking').action = '/airline/booking/' + btoa(msg.result.response.order_number);
                        document.getElementById('airline_booking').submit();
                    })
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
                            send_url_booking('airline', btoa(msg.result.response.order_number), msg.result.response.order_number);
                            document.getElementById('order_number').value = msg.result.response.order_number;
                            document.getElementById('airline_issued').submit();
                          }else{
                               document.getElementById('airline_booking').innerHTML+= '<input type="hidden" name="order_number" value='+msg.result.response.order_number+'>';
                               document.getElementById('airline_booking').action = '/airline/booking/' + btoa(msg.result.response.order_number);
                               document.getElementById('airline_booking').submit();
                          }
                        })
//                       document.getElementById('airline_booking').innerHTML+= '<input type="hidden" name="order_number" value='+msg.result.response.order_number+'>';
//                       document.getElementById('airline_booking').action = '/airline/booking/' + btoa(msg.result.response.order_number);
//                       document.getElementById('airline_booking').submit();
                   }
               }else{
                   if(user_login.co_agent_frontend_security.includes('b2c_limitation') == true)
                        send_url_booking('airline', btoa(msg.result.response.order_number), msg.result.response.order_number);
                   document.getElementById('order_number').value = msg.result.response.order_number;
                   document.getElementById('issued').action = '/airline/booking/' + btoa(msg.result.response.order_number);
                   document.getElementById('issued').submit();
               }
           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
           }else if(msg.result.error_code == 1026){
//                Swal.fire({
//                  title: msg.result.error_msg+ ' Are you sure want to Book this booking?',
//                  type: 'warning',
//                  showCancelButton: true,
//                  confirmButtonColor: '#3085d6',
//                  cancelButtonColor: '#d33',
//                  confirmButtonText: 'Yes'
//                }).then((result) => {
//                  if (result.value) {
//                        please_wait_transaction();
//                        $('.next-loading-booking').addClass("running");
//                        $('.next-loading-booking').prop('disabled', true);
//                        $('.next-loading-issued').prop('disabled', true);
//                        $('.issued_booking_btn').prop('disabled', true);
//                        airline_force_commit_booking(1);
//                  }
//                })
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: 'Booking passenger validator, Please contact BTB!',
                })
                hide_modal_waiting_transaction();
                $('.loader-rodextrip').fadeOut();
                $('.btn-next').removeClass('running');
                $('.btn-next').prop('disabled', false);
           }else if(msg.result.error_code == 4024){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  text: msg.result.error_msg,
                }).then((result) =>{
                  if (result.value) {
                    window.location.href="/airline";
                  }
                })
           }else if(msg.result.error_code == 4014){
                if(val == 0){
                    if(msg.result.response.order_number != ''){
                        document.getElementById('order_number').value = msg.result.response.order_number;
                        document.getElementById('airline_issued').submit();
//                        document.getElementById('airline_booking').innerHTML+= '<input type="hidden" name="order_number" value='+msg.result.response.order_number+'>';
//                        document.getElementById('airline_booking').submit();
                    }else{
                        Swal.fire({
                          type: 'error',
                          title: 'Oops!',
                          html: '<span style="color: #ff9900;">Error airline commit booking </span>' + msg.result.error_msg,
                        }).then((result) => {
                          if (result.value) {
                            hide_modal_waiting_transaction();
                          }
                        })
                        hide_modal_waiting_transaction();
                        $('.loader-rodextrip').fadeOut();
                        $('.btn-next').removeClass('running');
                        $('.btn-next').prop('disabled', false);
                    }
                }else{
                    if(msg.result.response.order_number != ''){
                       if(user_login.co_agent_frontend_security.includes('b2c_limitation') == true)
                            send_url_booking('airline', btoa(msg.result.response.order_number), msg.result.response.order_number);
                       document.getElementById('order_number').value = msg.result.response.order_number;
                       document.getElementById('issued').action = '/airline/booking/' + btoa(msg.result.response.order_number);
                       document.getElementById('issued').submit();
                    }else{
                        Swal.fire({
                          type: 'error',
                          title: 'Oops!',
                          html: '<span style="color: #ff9900;">Error airline commit booking </span>' + msg.result.error_msg,
                        }).then((result) => {
                          if (result.value) {
                            hide_modal_waiting_transaction();
                          }
                        })
                        hide_modal_waiting_transaction();
                        $('.loader-rodextrip').fadeOut();
                        $('.btn-next').removeClass('running');
                        $('.btn-next').prop('disabled', false);
                    }
                }
           }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error airline commit booking </span>' + msg.result.error_msg,
                }).then((result) => {
                  if (result.value) {
                    hide_modal_waiting_transaction();
                  }
                })
                hide_modal_waiting_transaction();
                $('.loader-rodextrip').fadeOut();
                $('.btn-next').removeClass('running');
                $('.btn-next').prop('disabled', false);
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error airline commit booking');
            hide_modal_waiting_transaction();
            $('.loader-rodextrip').fadeOut();
            $('.btn-next').removeClass('running');
            $('.btn-next').prop('disabled', false);
       },timeout: 300000
    });
}

function airline_force_commit_booking(val){
    data = {
        'value': val,
        'signature': signature,
        'voucher_code': ''
    }
    try{
        data['acquirer_seq_id'] = payment_acq2[payment_method][selected].acquirer_seq_id;
        data['member'] = payment_acq2[payment_method][selected].method;
        data['bypass_psg_validator'] = true;
        data['voucher_code'] =  voucher_code;
    }catch(err){
        console.log(err); // error kalau ada element yg tidak ada
    }
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'commit_booking',
       },
       data: data,
       success: function(msg) {
           if(google_analytics != ''){
               if(data.hasOwnProperty('member') == true)
                   gtag('event', 'airline_issued', {});
               else
                   gtag('event', 'airline_hold_booking', {});
           }
           if(msg.result.error_code == 0){
               //send order number
               if(val == 0){
                   if(user_login.co_agent_frontend_security.includes('b2c_limitation') == true)
                        send_url_booking('airline', btoa(msg.result.response.order_number), msg.result.response.order_number);
                   document.getElementById('airline_booking').innerHTML+= '<input type="hidden" name="order_number" value='+msg.result.response.order_number+'>';
                   document.getElementById('airline_booking').action = '/airline/booking/' + btoa(msg.result.response.order_number);
                   document.getElementById('airline_booking').submit();
               }else{
                   if(user_login.co_agent_frontend_security.includes('b2c_limitation') == true)
                        send_url_booking('airline', btoa(msg.result.response.order_number), msg.result.response.order_number);
                   document.getElementById('order_number').value = msg.result.response.order_number;
                   document.getElementById('issued').action = '/airline/booking/' + btoa(msg.result.response.order_number);
                   document.getElementById('issued').submit();
               }
           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
           }else if(msg.result.error_code == 4024){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  text: msg.result.error_msg,
                }).then((result) =>{
                  if (result.value) {
                    window.location.href="/airline";
                  }
                })
           }else if(msg.result.error_code == 4014){
                if(val == 0){
                    if(msg.result.response.order_number != ''){
                        document.getElementById('airline_booking').innerHTML+= '<input type="hidden" name="order_number" value='+msg.result.response.order_number+'>';
                        document.getElementById('airline_booking').submit();
                    }else{
                        Swal.fire({
                          type: 'error',
                          title: 'Oops!',
                          html: '<span style="color: #ff9900;">Error airline commit booking </span>' + msg.result.error_msg,
                        }).then((result) => {
                          if (result.value) {
                            window.location.href='/';
                          }
                        })
                        hide_modal_waiting_transaction();
                        $('.loader-rodextrip').fadeOut();
                        $('.btn-next').removeClass('running');
                        $('.btn-next').prop('disabled', false);
                    }
                }else{
                    if(msg.result.response.order_number != ''){
                       if(user_login.co_agent_frontend_security.includes('b2c_limitation') == true)
                            send_url_booking('airline', btoa(msg.result.response.order_number), msg.result.response.order_number);
                       document.getElementById('order_number').value = msg.result.response.order_number;
                       document.getElementById('issued').action = '/airline/booking/' + btoa(msg.result.response.order_number);
                       document.getElementById('issued').submit();
                    }else{
                        Swal.fire({
                          type: 'error',
                          title: 'Oops!',
                          html: '<span style="color: #ff9900;">Error airline commit booking </span>' + msg.result.error_msg,
                        }).then((result) => {
                          if (result.value) {
                            window.location.href='/';
                          }
                        })
                        hide_modal_waiting_transaction();
                        $('.loader-rodextrip').fadeOut();
                        $('.btn-next').removeClass('running');
                        $('.btn-next').prop('disabled', false);
                    }
                }
           }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error airline commit booking </span>' + msg.result.error_msg,
                }).then((result) => {
                  if (result.value) {
                    hide_modal_waiting_transaction();
                  }
                })
                hide_modal_waiting_transaction();
                $('.loader-rodextrip').fadeOut();
                $('.btn-next').removeClass('running');
                $('.btn-next').prop('disabled', false);
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error airline commit booking');
            hide_modal_waiting_transaction();
            hide_modal_waiting_transaction();
            $('.loader-rodextrip').fadeOut();
            $('.btn-next').removeClass('running');
            $('.btn-next').prop('disabled', false);
       },timeout: 300000
    });
}

function airline_hold_booking(val){
    title = '';
    if(val == 0)
        title = 'Are you sure want to Hold Booking?';
    else if(val == 1)
        title = 'Are you sure want to Force Issued this booking?';
    Swal.fire({
      title: title,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        if (val==0){
            please_wait_transaction();
            $('.next-loading-booking').addClass("running");
            $('.next-loading-booking').prop('disabled', true);
            $('.next-loading-issued').prop('disabled', true);
            $('.issued_booking_btn').prop('disabled', true);
        }
        else{
            please_wait_transaction();
            $('.next-loading-booking').prop('disabled', true);
            $('.next-loading-issued').addClass("running");
            $('.next-loading-issued').prop('disabled', true);
            $('.issued_booking_btn').prop('disabled', true);
        }
        if(val == 1){
            try{
                document.getElementById("passengers").value = JSON.stringify(passengers);
                document.getElementById("signature").value = signature;
                document.getElementById("provider").value = 'airline';
                document.getElementById("type").value = 'airline_review';
                document.getElementById("voucher_code").value = voucher_code;
                document.getElementById("discount").value = JSON.stringify(discount_voucher);
                document.getElementById("session_time_input").value = time_limit;
            }catch(err){
                console.log(err)
            }
        }else if(val == 0){
            try{
                document.getElementById("passengers").value = JSON.stringify(passengers);
                document.getElementById("signature").value = signature;
                document.getElementById("provider").value = 'airline';
                document.getElementById("type").value = 'airline_book_then_issued';
                document.getElementById("voucher_code").value = voucher_code;
                document.getElementById("discount").value = JSON.stringify(discount_voucher);
                document.getElementById("session_time_input").value = time_limit;
            }catch(err){
                console.log(err)
            }

        }else if(user_login.co_agent_frontend_security.includes('b2c_limitation')){
            try{
                document.getElementById("passengers").value = JSON.stringify(passengers);
                document.getElementById("signature").value = signature;
                document.getElementById("provider").value = 'airline';
                document.getElementById("type").value = 'airline';
                document.getElementById("voucher_code").value = voucher_code;
                document.getElementById("discount").value = JSON.stringify(discount_voucher);
                document.getElementById("session_time_input").value = time_limit;
            }catch(err){
                console.log(err)
            }
        }
        airline_update_contact_booker(val);
      }
    })
}

function create_new_reservation(){
    //pilihan carrier
    var text = '';
    var option = '';
    text += `<div style="background:white;margin-top:15px;padding:15px 15px 5px 15px; border:1px solid #cdcdcd;">
                <h5>Re Order</h5>`;

    //orang
    text += `<h6>Journey</h6>
            <table style="width:100%;background:white;margin-top:15px;" class="list-of-table">
                <tr>
                    <th style="width:70%">Journey</th>
                </tr>`;
    var counter_journey = 0;
    for(i in airline_get_detail.result.response.provider_bookings){
        for(j in airline_get_detail.result.response.provider_bookings[i].journeys){
            if(moment(airline_get_detail.result.response.provider_bookings[i].journeys[j].departure_date).format('YYYY-MM-DD HH:mm') > moment().format('YYYY-MM-DD HH:mm'))
                text += `
                <tr>
                    <td>`+airline_get_detail.result.response.provider_bookings[i].journeys[j].origin+`-`+airline_get_detail.result.response.provider_bookings[i].journeys[j].destination+`</td>
                </tr>`;
            counter_journey++;
        }
    }
    text+= `</table><br/>`;

    //orang
    text += `<h6>Passengers</h6>
            <table style="width:100%;background:white;margin-top:15px;" class="list-of-table">
                <tr>
                    <th style="width:70%">Name</th>
                    <th style="width:30%">Re-Order</th>
                </tr>`;
    for(i in airline_get_detail.result.response.passengers){
        text += `<tr>
                    <td>`+airline_get_detail.result.response.passengers[i].name+`</td>
                    <td>
                        <label class="check_box_custom" style="margin-bottom:15px; float:left;">
                            <input type="checkbox" id="passenger`+i+`" name="passenger`+i+`" checked />
                            <span class="check_box_span_custom"></span>
                        </label>
                    </td>
                 </tr>`
    }
    text+= `</table>`;


    //button
    text += `<button type="button" class="primary-btn mb-3" id="button-home" style="width:100%;margin-top:15px;" onclick="airline_reorder();">
                Re Order
            </button>
            <span style="color:red">*Please input Frequent Flyer, Seat, and SSR again!</span>
            `

    document.getElementById('button-re-order-div').innerHTML = text;
    document.getElementById('reorder_div').hidden = true;
}

function airline_reorder(){
    //check all pax
    var check_pax = false;
    var check_journey = false;
    passenger_list_copy = [];
    journey_list_copy = [];
    for(i in airline_get_detail.result.response.passengers){
        if(document.getElementById('passenger'+i).checked){
            passenger_list_copy.push(airline_get_detail.result.response.passengers[i]);
            check_pax = true; // ada pax yg mau re order
        }
    }
    var counter_journey = 0;
    for(i in airline_get_detail.result.response.provider_bookings){
        for(j in airline_get_detail.result.response.provider_bookings[i].journeys){
            journey_list_copy.push(airline_get_detail.result.response.provider_bookings[i].journeys[j]);
            check_journey = true; // ada pax yg mau re order
            counter_journey++;
        }
    }
    if(check_pax && check_journey){
        airline_signin(airline_get_detail.result.response.order_number, 'reorder');
    }else if(check_journey){
        Swal.fire({
            type: 'error',
            title: 'Oops!',
            html: 'Minimal Re-Order with 1 pax!',
        })
    }else if(check_pax)
        Swal.fire({
            type: 'error',
            title: 'Oops!',
            html: 'Minimal Re-Order with 1 journey!',
        })
    else
        Swal.fire({
            type: 'error',
            title: 'Oops!',
            html: 'Minimal Re-Order with 1 journey and 1 pax!',
        })
}

function search_reorder(){

    airline_request = {
        "origin":[],
        "destination":[],
        "departure":[],
        "return":[],
        "direction":"OW",
        "adult":0,
        "child":0,
        "infant":0,
        "cabin_class":[],
        "is_combo_price":"false",
        "carrier_codes":[],
        "counter":"0",
        "flight":""
    };
    adult = 0;
    child = 0;
    infant = 0;
    for(i in passenger_list_copy){
        if(passenger_list_copy[i].birth_date != '' && passenger_list_copy[i].birth_date != false){
            old = parseInt(Math.abs(moment() - moment(passenger_list_copy[i].birth_date,'DD MMM YYYY'))/31536000000)
            if(old > 12)
                adult++;
            else if(old>2)
                child++;
            else
                infant++;
        }else{
            adult++;
        }
    }
    provider_list_reorder = {};
    for(i in journey_list_copy){
        for(j in journey_list_copy[i].segments){
            if(provider_list_reorder.hasOwnProperty(journey_list_copy[i].segments[j].provider) == false)
                provider_list_reorder[journey_list_copy[i].segments[j].provider] = [];
            if(provider_list_reorder[journey_list_copy[i].segments[j].provider].includes(journey_list_copy[i].segments[j].carrier_code) == false)
                provider_list_reorder[journey_list_copy[i].segments[j].provider].push(journey_list_copy[i].segments[j].carrier_code)
            airline_request['cabin_class'].push(journey_list_copy[i].segments[j].cabin_class)
        }
        airline_request['origin'].push(journey_list_copy[i].origin+' - - - ')
        airline_request['destination'].push(journey_list_copy[i].destination+' - - - ')
        airline_request['departure'].push(journey_list_copy[i].departure_date.split('  ')[0])
        airline_request['return'].push(journey_list_copy[i].departure_date.split('  ')[0])

    }
    airline_request['direction'] = airline_request['origin'].length == 1 ? 'OW' : 'MC';
    airline_request['adult'] = adult;
    airline_request['child'] = child;
    airline_request['infant'] = infant;
    if(airline_request['direction'] == 'OW')
        airline_request['is_combo_price'] = "false"
    else
        airline_request['is_combo_price'] = "true"
    re_order_set_airline_request();
}

function re_order_set_airline_request(){
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 're_order_set_airline_request',
       },
       data: {
          'signature': signature,
          'airline_request': JSON.stringify(airline_request),
       },
       success: function(resJson) {
            console.log('set request done')
            re_order_set_passengers();
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {

       },timeout: 120000
    });
}

function re_order_set_passengers(){
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 're_order_set_passengers',
       },
       data: {
          'signature': signature,
          'pax': JSON.stringify(passenger_list_copy),
          'booker': JSON.stringify(airline_get_detail.result.response.booker)
       },
       success: function(resJson) {
            console.log('set passenger done')
            airline_choose = 0;
            try{
                airline_data_reorder = [];
                last_send = false;
                for(i in provider_list_reorder){
                    if(i == Object.keys(provider_list_reorder).length-1)
                        last_send = true;
                    airline_search(i,provider_list_reorder[i],last_send=false, true);
                }
            }catch(err){
                console.log(err);
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {

       },timeout: 120000
    });
}

function re_order_check_search(){
    airline_choose++;
    if(airline_choose == Object.keys(provider_list_reorder).length){
        console.log('get data journey');
        re_order_find_journey();
    }
}

function re_order_find_journey(){
    promotion_code_list = [];
    journey = [];
    separate = false;
    for(i in journey_list_copy){
        for(x in airline_data_reorder){
            if(journey_list_copy[i].journey_code == airline_data_reorder[x].journey_code){
                journey.push({"provider": airline_data_reorder[x].provider,segments:[]});
                for(j in journey_list_copy[i].segments){
                    for(y in airline_data_reorder[x].segments){
                        if(journey_list_copy[i].segments[j].segment_code == airline_data_reorder[x].segments[y].segment_code){
                            for(z in airline_data_reorder[x].segments[y].fares){
                                if(airline_data_reorder[x].segments[y].fares[z].class_of_service == journey_list_copy[i].segments[j].class_of_service && airline_data_reorder[x].segments[y].fares[z].available_count >= airline_request.adult + airline_request.child){
                                    journey[journey.length-1].segments.push({
                                        "carrier_code": airline_data_reorder[x].segments[y].carrier_code,
                                        "class_of_service": airline_data_reorder[x].segments[y].fares[z].class_of_service,
                                        "fare_code": airline_data_reorder[x].segments[y].fares[z].fare_code,
                                        "segment_code": airline_data_reorder[x].segments[y].segment_code,
                                    });
                                    break;
                                }
                            }
                        }
                    }
                }
                break;
            }
        }
    }
    error_log = '';
    for(i in journey){
        if(journey[i].segments.length == 0){
            error_log += 'Journey not available!';
            break;
        }
    }
    if(error_log != ''){
        Swal.fire({
            type: 'warning',
            title: 'Oops!',
            html: error_log,
       });
    }else{
        console.log('select data journey');
        re_order_get_price();
    }
}

function re_order_get_price(){
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'get_price_itinerary',
       },
       data: {
          "promo_codes": JSON.stringify(promotion_code_list),
          "journeys_booking": JSON.stringify(journey),
          'signature': signature,
          'separate_journey': separate,
       },
       success: function(msg) {
            console.log('get price done');
            if(msg.result.error_code == 0){
                get_price_airline_response = msg;
                data_request = get_price_airline_response.result.request;
                re_order_get_fare_rules();
            }else{

            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {

       },timeout: 120000
    });
}

function re_order_get_fare_rules(){
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'get_fare_rules',
       },
       data: {
            'signature': signature,
            'data': JSON.stringify(data_request)
       },
       success: function(msg) {
            console.log('get fare rules done');
            if(msg.result.error_code == 0){
                re_order_sell_journeys();
            }else{

            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {

       },timeout: 120000
   });
}

function re_order_sell_journeys(){
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'sell_journeys',
       },
       data: {
            'signature': signature,
            'data': JSON.stringify(data_request)
       },
       success: function(msg) {
           console.log('sell journey done');
           if(msg.result.error_code == 0){
               document.getElementById('airline_sell_journey_response').value = JSON.stringify(msg.result.response);
               get_seat_availability('reorder');
           }else{

           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {

       },timeout: 300000
    });
}

function airline_get_booking(data, sync=false){
    airline_pick_list = [];
    document.getElementById('payment_acq').hidden = true;
    price_arr_repricing = {};
    get_vendor_balance('false');
    try{
        show_loading();
    }catch(err){
        console.log(err); // error kalau ada element yg tidak ada
    }

    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'get_booking',
       },
       data: {
            'order_number': data,
            'signature': signature,
            'sync': sync
       },
       success: function(msg) {
           hide_modal_waiting_transaction();
           document.getElementById('button-home').hidden = false;
           document.getElementById('button-home-mb').hidden = false;
           document.getElementById('button-new-reservation').hidden = false;
           document.getElementById("overlay-div-box").style.display = "none";

           airline_get_detail = msg;
           get_payment = false;
           can_issued = msg.result.response.can_issued;

           document.getElementById('airline_reissue_div').innerHTML = '';
           time_now = moment().format('YYYY-MM-DD HH:mm:SS');
           //get booking view edit here
           try{
               if(msg.result.error_code == 0){
                if(msg.result.response.state == 'booked' || msg.result.response.state == 'partial_booked' || msg.result.response.state == 'partial_issued' || msg.result.response.state == 'fail_issued'){
                    document.getElementById('div_sync_status').hidden = false;
                    try{
                        if(user_login.co_job_position_is_request_required == true && msg.result.response.issued_request_status != "approved")
                        {
                            document.getElementById('issued_btn_airline').setAttribute("onClick", "airline_request_issued('"+msg.result.response.order_number+"');");
                            if(msg.result.response.issued_request_status == "on_process")
                            {
                                document.getElementById('issued_btn_airline').innerHTML = "Issued Booking Requested";
                                document.getElementById('issued_btn_airline').disabled = true;
                            }
                            else
                            {
                                document.getElementById('issued_btn_airline').innerHTML = "Request Issued Booking";
                            }
                        }
                        document.getElementById('issued_btn_airline').hidden = false;
                    }catch(err){
                        console.log(err); // error kalau ada element yg tidak ada
                    }
                }
                for(i in msg.result.response.passengers[0].sale_service_charges){
                    for(j in msg.result.response.passengers[0].sale_service_charges[i]){
                        currency = msg.result.response.passengers[0].sale_service_charges[i][j].currency
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
                }else if(msg.result.response.state == 'void'){
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
                           check_payment_payment_method(msg.result.response.order_number, 'Issued', msg.result.response.booker.seq_id, 'billing', 'airline', signature, msg.result.response.payment_acquirer_number);
                       get_payment = true;
    //                   get_payment_acq('Issued',msg.result.response.booker.seq_id, msg.result.response.order_number, 'billing',signature,'airline');
                       //document.getElementById('issued-breadcrumb').classList.remove("active");
                       //document.getElementById('issued-breadcrumb').classList.add("current");
                       document.getElementById('issued-breadcrumb').classList.add("br-active");
                       document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-active");

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
                last_date = '';
                var advance_order = false;
                for(i in msg.result.response.provider_bookings){
                    if(msg.result.response.provider_bookings[i].hasOwnProperty('is_advance_purchase') && msg.result.response.provider_bookings[i].is_advance_purchase && msg.result.response.state == 'booked'){
                        advance_order = true;
                    }
                    for(j in msg.result.response.provider_bookings[i].journeys){
                        last_date = moment(msg.result.response.provider_bookings[i].journeys[j].departure_date).format('YYYY-MM-DD HH:mm:SS');
                    }
                }
                if(advance_order){
                    text += `<div class="alert alert-warning" role="alert">
                                <h5>Advance Purchase</h5>
                             </div>`;
                    $text += 'Advance Purchase\n';
                }
                col = 4;
                is_reroute = false;
                if(msg.result.response.state == 'issued' || msg.result.response.state == 'rescheduled' || msg.result.response.state == 'reissue'){
                   //baru
                   try{
                       check_ssr = 0;
                       check_seat = 0;
                       check_cancel = 0;
                       check_reschedule = 0;
                       check_ff = 0;
                       check_split = 0;
                       col = 4;
                       if(msg.result.response.is_agent || user_login.co_agent_frontend_security.includes('process_channel_booking')){
                           if(last_date != '' && time_now < last_date){
                               for(i in msg.result.response.provider_bookings){
                                    if(provider_list_data[msg.result.response.provider_bookings[i].provider].is_post_issued_reschedule){
                                        check_reschedule = 1;
                                    }
                                    if(provider_list_data[msg.result.response.provider_bookings[i].provider].is_post_issued_ssr){
                                        check_ssr = 1;
                                    }
                                    if(provider_list_data[msg.result.response.provider_bookings[i].provider].is_post_issued_seat){
                                        check_seat = 1;
                                    }
                                    if(provider_list_data[msg.result.response.provider_bookings[i].provider].is_post_issued_frequent_flyer){
                                        check_ff = 1;
                                    }
                                    if(provider_list_data[msg.result.response.provider_bookings[i].provider].is_post_issued_cancel){
                                        check_cancel = 1;
                                    }
                                    if(provider_list_data[msg.result.response.provider_bookings[i].provider].is_post_issued_split){
                                        check_split = 1;
                                    }
                                    if(provider_list_data[msg.result.response.provider_bookings[i].provider].is_post_issued_reroute){
                                        is_reroute = true;
                                    }
                               }
                           }
                       }
                       for(i in msg.result.response.provider_bookings){
                            if(provider_list_data[msg.result.response.provider_bookings[i].provider].is_ori_ticket){
                                    col = 3;
                            }
                       }
                       document.getElementById('ssr_request_after_sales').innerHTML = '<h4>Reissued</h4><hr>';
                       if(check_reschedule){
                            document.getElementById('reissued').hidden = false;
                            document.getElementById('reissued').innerHTML = `
                                <button class="primary-btn-ticket" id="reissued_btn_dsb" style="width:100%;" type="button" onclick="reissued_btn();">
                                    Reissued
                                </button>
                            `;
                       }
                       if(check_split){
                            document.getElementById('split_booking').hidden = false;
                            document.getElementById('split_booking').innerHTML = `<input class="primary-btn-ticket" style="width:100%;" type="button" onclick="split_booking_btn();" value="Split Booking">`;
                       }
                       document.getElementById('ssr_request_after_sales').innerHTML = '<h4>Request</h4><hr>';
                       if(check_seat){
                            document.getElementById('ssr_request_after_sales').hidden = false;
                            document.getElementById('ssr_request_after_sales').innerHTML += `
                            <input class="primary-btn-ticket" style="margin-bottom:15px;" type="button" onclick="set_new_request_seat()" value="Seat"><br/>`;
                       }
                       if(check_ssr){
                            document.getElementById('ssr_request_after_sales').hidden = false;
                            document.getElementById('ssr_request_after_sales').innerHTML += `
                            <input class="primary-btn-ticket" type="button" onclick="set_new_request_ssr()" value="Baggage, Meal, Medical">`;
                       }
                       if(check_ff){
                       }
                       if(check_cancel){
                            document.getElementById('cancel').hidden = false;
                            document.getElementById('cancel').innerHTML = `<input class="primary-btn-white" style="width:100%;" type="button" onclick="cancel_btn_location();" value="Refund Booking">`;
                       }
                   }catch(err){
                    console.log(err);
                   }
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
    //                if(provider_list.includes("traveloka") == true){
    //                    document.getElementById('cancel').hidden = false;
    //                    document.getElementById('cancel').innerHTML = `<input class="primary-btn-ticket" style="width:100%;" type="button" onclick="cancel_btn();" value="Cancel Booking">`;
    //                }
                }
                if(msg.result.response.state == 'booked'){
                    try{
                        if(can_issued)
                            $(".issued_booking_btn").show();
                    }catch(err){
                        console.log(err); // error kalau ada element yg tidak ada
                    }
                    check_provider_booking++;
                    try{
                       check_ssr = 0;
                       check_seat = 0;
                       check_cancel = 0;
                       check_reschedule = 0;
                       check_ff = 0;
                       check_split = 0;
                       col = 4;
                       if(msg.result.response.is_agent || user_login.co_agent_frontend_security.includes('process_channel_booking')){
                           if(last_date != '' && time_now < last_date){
                               for(i in msg.result.response.provider_bookings){
                                    if(provider_list_data[msg.result.response.provider_bookings[i].provider].is_post_booked_reschedule){
                                        check_reschedule = 1;
                                    }
                                    if(provider_list_data[msg.result.response.provider_bookings[i].provider].is_post_booked_ssr){
                                        check_ssr = 1;
                                    }
                                    if(provider_list_data[msg.result.response.provider_bookings[i].provider].is_post_booked_seat){
                                        check_seat = 1;
                                    }
                                    if(provider_list_data[msg.result.response.provider_bookings[i].provider].is_post_booked_frequent_flyer){
                                        check_ff = 1;
                                    }
                                    if(provider_list_data[msg.result.response.provider_bookings[i].provider].is_post_booked_split){
                                        check_split = 1;
                                    }
                                    if(provider_list_data[msg.result.response.provider_bookings[i].provider].is_post_booked_cancel){
                                        check_cancel = 1;
                                    }
                                    if(provider_list_data[msg.result.response.provider_bookings[i].provider].is_post_booked_reroute){
                                        is_reroute = true;
                                    }
                                    if(provider_list_data[msg.result.response.provider_bookings[i].provider].is_ori_ticket){
                                        col = 3;
                                    }

                               }
                           }
                       }
                       if(check_reschedule){
                            document.getElementById('reissued').hidden = false;
                            document.getElementById('reissued').innerHTML = `<input class="primary-btn-white" style="width:100%;" type="button" onclick="reissued_btn();" value="Change Booking">`;
                       }
                       if(check_split){
                            document.getElementById('split_booking').hidden = false;
                            document.getElementById('split_booking').innerHTML = `<input class="primary-btn-ticket" style="width:100%;" type="button" onclick="split_booking_btn();" value="Split Booking">`;
                       }
//                       document.getElementById('ssr_request_after_sales').innerHTML = '<h4>Request New</h4><hr>';
//                       if(check_seat){
//                            document.getElementById('ssr_request_after_sales').hidden = false;
//                            document.getElementById('ssr_request_after_sales').innerHTML += `
//                            <input class="primary-btn-ticket" style="margin-bottom:15px;" type="button" onclick="set_new_request_seat()" value="Seat"><br/>`;
//                       }
//                       if(check_ssr){
//                            document.getElementById('ssr_request_after_sales').hidden = false;
//                            document.getElementById('ssr_request_after_sales').innerHTML += `
//                            <input class="primary-btn-ticket" type="button" onclick="set_new_request_ssr()" value="Baggage, Meal, Medical">`;
//                       }
                       if(check_ff){
                       }
                       if(check_cancel){
                            document.getElementById('cancel').hidden = false;
                            document.getElementById('cancel').innerHTML = `<button class="primary-btn-white" style="width:100%;" type="button" onclick="cancel_btn();">Cancel Booking <i class="fas fa-times" style="padding-left:5px; color:red; font-size:16px;"></i></button>`;
                       }
                    }catch(err){

                    }
                }
                else{
                    $(".issued_booking_btn").hide();
                    //$(".issued_booking_btn").remove();
                    $('.loader-rodextrip').fadeOut();
                    hide_modal_waiting_transaction();
                }
                //rebooking
                if(msg.result.response.hasOwnProperty('rebooking') && msg.result.response.rebooking){

                    document.getElementById('reorder_div').innerHTML = `
                    <button type="button" id="button-re-order" class="primary-btn-white" onclick="create_new_reservation();">
                        <i class="fas fa-redo-alt"></i> Re Order
                    </button>`;
                }

                $text += '‣ Order Number: '+ msg.result.response.order_number + '\n';

                //$text += 'Hold Date: ' + msg.result.response.hold_date + '\n';
                $text += '‣ Status: '+msg.result.response.state_description + '\n';
                var localTime;
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
                        for(i in msg.result.response.provider_bookings){
                            if(msg.result.response.provider_bookings[i].state == 'booked' && printed_hold_date == false){
                                if(get_payment == false){
                                   check_payment_payment_method(msg.result.response.order_number, 'Issued', msg.result.response.booker.seq_id, 'billing', 'airline', signature, msg.result.response.payment_acquirer_number);
                                   get_payment = true;
                                }
    //                                check_payment_payment_method(msg.result.response.order_number, 'Issued', msg.result.response.booker.seq_id, 'billing', 'airline', signature);
    //                            get_payment_acq('Issued',msg.result.response.booker.seq_id, msg.result.response.order_number, 'billing',signature,'airline');
                                $text += 'PLEASE MAKE PAYMENT BEFORE '+ msg.result.response.hold_date + `\n`;
                                try{
                                    if(now.diff(hold_date_time, 'minutes')<0)
                                        $(".issued_booking_btn").show();
                                }catch(err){
                                    console.log(err); // error kalau ada element yg tidak ada
                                }
                                check_provider_booking++;
                                printed_hold_date = true;
                            }
                            //datetime utc to local
                            if(msg.result.response.provider_bookings[i].error_msg.length != 0 && msg.result.response.provider_bookings[i].state != 'issued')
                                text += `<div class="alert alert-danger">
                                    `+msg.result.response.provider_bookings[i].error_msg+`
                                    <a href="#" class="close" data-dismiss="alert" aria-label="close" style="margin-top:-1.9vh;">x</a>
                                </div>`;
                            if(msg.result.response.provider_bookings[i].hold_date != '' && msg.result.response.provider_bookings[i].hold_date != false){
                                tes = moment.utc(msg.result.response.provider_bookings[i].hold_date).format('YYYY-MM-DD HH:mm:ss')
                                localTime  = moment.utc(tes).toDate();
                                msg.result.response.provider_bookings[i].hold_date = moment(localTime).format('DD MMM YYYY HH:mm');
                            }
                            //
                            text+=`<tr>`;
                            if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false || msg.result.response.state == 'issued')
                                text+=`
                                    <td>`+msg.result.response.provider_bookings[i].pnr+`</td>`;
                            else
                                text += `<td> - </td>`;

                            if(msg.result.response.state == 'booked')
                                text+=`<td>`+msg.result.response.hold_date+`</td>`;

                            text+=`
                                <td>`;
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
                                msg.result.response.provider_bookings[i].state_description == 'Done'){
                                text+=`<span style="background:#30b330; color:white; padding:0px 15px; border-radius:14px;">`;
                            }
                            else if(msg.result.response.provider_bookings[i].state_description == 'Refund' ||
                                msg.result.response.provider_bookings[i].state_description == 'Draft'){
                                text+=`<span style="background:#8c8d8f; color:white; padding:0px 15px; border-radius:14px;">`;
                            }
                            else{
                                text+=`<span>`;
                            }
                            text+=`
                                    `+msg.result.response.provider_bookings[i].state_description+`
                                </span>
                                </td>
                            </tr>`;
                        }
                        if(check_provider_booking == 0 && msg.result.response.state != 'issued'){
                            $text += '‣ Status: '+msg.result.response.state_description+'\n';
                            check_provider_booking++;
                            $(".issued_booking_btn").remove();
                        }
                text+=`
                </table>
                    <hr/>
                    <div class="row">
                        <div class="col-lg-6 mb-3">
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
                            <h5> Flight Detail <img style="width:18px;" src="/static/tt_website_rodextrip/images/icon/plane.png" alt="Flight Detail"/></h5>
                            <hr/>`;
                        check = 0;
                        flight_counter = 1;
                        rules = 0;
                        for(i in msg.result.response.provider_bookings){
                            $text += '‣ Booking Code: ';
                            if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false || msg.result.response.state == 'issued')
                                $text += msg.result.response.provider_bookings[i].pnr+'\n';
                            else
                                $text += '-\n';
                            if(i != 0){
                                text+=`<hr/>`;
                            }
                            text += `<div class="row">
                                        <div class="col-lg-6">`;
                            if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false || msg.result.response.state == 'issued')
                                text+=`<h5>PNR: `+msg.result.response.provider_bookings[i].pnr+`</h5>`;
                            else
                                text += `<h5>PNR: - </h5>`;
                            text += `   </div>
                                        <div class="col-lg-6" style="text-align:right;">`;
                            if(provider_list_data.hasOwnProperty(msg.result.response.provider_bookings[i].provider) && provider_list_data[msg.result.response.provider_bookings[i].provider].description != '')
                                text +=`
                                            <h5>`+provider_list_data[msg.result.response.provider_bookings[i].provider].description+`</h5>`;
                            else
                                text +=`
                                            <h5>`+msg.result.response.provider_bookings[i].provider+`</h5>`;
                            text+=`
                                        </div>
                                    </div>`;
                            for(j in msg.result.response.provider_bookings[i].journeys){
                                fare_detail_list = [];
                                text+=`<h6>Flight `+flight_counter+`</h6>`;
                                $text += '\nFlight '+ flight_counter+'\n';
                                flight_counter++;
                                if(msg.result.response.provider_bookings[i].journeys[j].hasOwnProperty('search_banner')){
                                   for(banner_counter in msg.result.response.provider_bookings[i].journeys[j].search_banner){
                                       var max_banner_date = moment().subtract(parseInt(-1*msg.result.response.provider_bookings[i].journeys[j].search_banner[banner_counter].minimum_days), 'days').format('YYYY-MM-DD');
                                       var selected_banner_date = moment(msg.result.response.provider_bookings[i].journeys[j].departure_date.split('  ')[0]).format('YYYY-MM-DD');

                                       if(selected_banner_date >= max_banner_date){
                                           text+=`<label id="pop_search_banner`+i+``+j+``+banner_counter+`" style="background:`+msg.result.response.provider_bookings[i].journeys[j].search_banner[banner_counter].banner_color+`; color:`+msg.result.response.provider_bookings[i].journeys[j].search_banner[banner_counter].text_color+`;padding:5px 10px;">`+msg.result.response.provider_bookings[i].journeys[j].search_banner[banner_counter].name+`</label>`;
                                       }
                                   }
                                }
                                for(k in msg.result.response.provider_bookings[i].journeys[j].segments){
                                    $text+='‣ ';
                                    var cabin_class = '';
                                    //yang baru harus diganti
                                    if(msg.result.response.provider_bookings[i].journeys[j].segments[k].cabin_class == 'Y')
                                        cabin_class = 'Economy Class';
                                    else if(msg.result.response.provider_bookings[i].journeys[j].segments[k].carrier_code == 'QG' && msg.result.response.provider_bookings[i].journeys[j].segments[k].cabin_class == 'W')
                                        cabin_class = 'Royal Green Class';
                                    else if(msg.result.response.provider_bookings[i].journeys[j].segments[k].cabin_class == 'W')
                                        cabin_class = 'Premium Economy Class';
                                    else if(msg.result.response.provider_bookings[i].journeys[j].segments[k].cabin_class == 'C')
                                        cabin_class = 'Business Class';
                                    else if(msg.result.response.provider_bookings[i].journeys[j].segments[k].cabin_class == 'F')
                                        cabin_class = 'First Class';

                                    text+=`
                                    <div class="row">
                                        <div class="col-lg-4">`;
                                        try{
                                            text += `<img data-toggle="tooltip" style="width:50px; height:50px;" alt="`+airline_carriers[msg.result.response.provider_bookings[i].journeys[j].segments[k].carrier_code].name+`" title="`+airline_carriers[msg.result.response.provider_bookings[i].journeys[j].segments[k].carrier_code].name+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+msg.result.response.provider_bookings[i].journeys[j].segments[k].carrier_code+`.png"/>`;
                                        }catch(err){
                                            text += `<img data-toggle="tooltip" style="width:50px; height:50px;" alt="`+msg.result.response.provider_bookings[i].journeys[j].segments[k].carrier_code+`" title="`+msg.result.response.provider_bookings[i].journeys[j].segments[k].carrier_code+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+msg.result.response.provider_bookings[i].journeys[j].segments[k].carrier_code+`.png"/>`;
                                        }
                                        text+=`<h5>`+msg.result.response.provider_bookings[i].journeys[j].segments[k].carrier_name+' '+msg.result.response.provider_bookings[i].journeys[j].segments[k].carrier_number+`</h5>
                                            <span>Class : `+cabin_class+` (`+msg.result.response.provider_bookings[i].journeys[j].segments[k].class_of_service+`)</span><br/>
                                        </div>
                                        <div class="col-lg-8" style="padding-top:10px;">`;

                                    for(l in msg.result.response.provider_bookings[i].journeys[j].segments[k].legs){
                                        try{
                                            $text += airline_carriers[msg.result.response.provider_bookings[i].journeys[j].segments[k].carrier_code].name + ' ' + msg.result.response.provider_bookings[i].journeys[j].segments[k].carrier_number;
                                        }catch(err){
                                            $text += msg.result.response.provider_bookings[i].journeys[j].segments[k].carrier_code + ' ' + msg.result.response.provider_bookings[i].journeys[j].segments[k].carrier_number;
                                        }
                                        if(cabin_class != '')
                                            $text += ' ' + cabin_class + ' (' + msg.result.response.provider_bookings[i].journeys[j].segments[k].class_of_service + ')';
                                        else
                                            $text += ' ' + cabin_class + ' (' + msg.result.response.provider_bookings[i].journeys[j].segments[k].class_of_service + ')';

//                                        $text += '\n\n';
//                                        $text += '‣ Departure:\n';
//                                        $text += msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].origin_name + ' (' + msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].origin_city + ') ' + '\n';
//
//                                        $text += '\n';
//                                        $text += '‣ Arrival:\n';
//                                        $text += msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].destination_name + ' (' + msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].destination_city + ') ' +'\n\n';

                                        $text += '\n'+msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].origin_city + ' (' + msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].origin + ') - ' + msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].destination_city + ' (' + msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].destination + ')\n';

                                        if(msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].arrival_date.split('  ')[0] == msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].departure_date.split('  ')[0]){
                                            $text += msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].departure_date.split('  ')[0]+' ';
                                            $text += msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].departure_date.split('  ')[1]+' - ';
                                            $text += msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].arrival_date.split('  ')[1]+'\n';
                                        }else{
                                            $text += msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].departure_date.split('  ')[0]+' ';
                                            $text += msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].departure_date.split('  ')[1]+' - ';
                                            $text += msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].arrival_date.split('  ')[0]+' ';
                                            $text += msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].arrival_date.split('  ')[1]+'\n';
                                        }

                                        text+= `
                                        <div class="row">
                                            <div class="col-lg-6 col-xs-6">
                                                <table style="width:100%">
                                                    <tr>
                                                        <td><h5>`+msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].departure_date.split('  ')[1]+`</h5></td>
                                                        <td style="padding-left:15px;">
                                                            <img src="/static/tt_website_rodextrip/img/icon/airlines-01.png" alt="Airline" style="width:20px; height:20px;"/>
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
                                                <span>`+msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].departure_date.split('  ')[0]+`</span><br/>
                                                <span style="font-weight:500;">`+msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].origin_name+` - `+msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].origin_city+` (`+msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].origin+`)</span><br/>`;
                                                if(msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].origin_terminal != ''){
                                                    text+=`<span style="font-size:13px; font-weight:500;">Terminal: `+msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].origin_terminal+`</span>`;
                                                }else{
                                                    text+=`<span style="font-size:13px; font-weight:500;">Terminal: -</span>`;
                                                }
                                            text+=`
                                            </div>

                                            <div class="col-lg-6 col-xs-6" style="padding:0;">
                                                <table style="width:100%; margin-bottom:6px;">
                                                    <tr>
                                                        <td><h5>`+msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].arrival_date.split('  ')[1]+`</h5></td>
                                                        <td></td>
                                                        <td style="height:30px;padding:0 15px;width:100%"></td>
                                                    </tr>
                                                </table>
                                                <span>`+msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].arrival_date.split('  ')[0]+`</span><br/>
                                                <span style="font-weight:500;">`+msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].destination_name+` - `+msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].destination_city+` (`+msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].destination+`)</span><br/>`;
                                                if(msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].destination_terminal != ''){
                                                    text+=`<span style="font-size:13px; font-weight:500;">Terminal: `+msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].destination_terminal+`</span>`;
                                                }else{
                                                    text+=`<span style="font-size:13px; font-weight:500;">Terminal: -</span>`;
                                                }
                                            text+=`
                                            </div>
                                        </div>`;
                                    }
                                    text+=`</div>
                                    </div>`;
                                    for(l in msg.result.response.provider_bookings[i].journeys[j].segments[k].fare_details){
                                        add = true
                                        for(m in fare_detail_list){
                                            if(fare_detail_list[m].unit == msg.result.response.provider_bookings[i].journeys[j].segments[k].fare_details[l].unit && fare_detail_list[m].detail_name == msg.result.response.provider_bookings[i].journeys[j].segments[k].fare_details[l].detail_name)
                                                add = false
                                        }
                                        if(add)
                                            fare_detail_list.push(msg.result.response.provider_bookings[i].journeys[j].segments[k].fare_details[l]);
                                    }
                                    $text += '\n';
                                }
                                for(l in fare_detail_list){
                                    if(l == 0)
                                        $text += '‣ Include:\n';
                                    if(fare_detail_list[l].detail_type == 'BG'){
                                        text+=`<i class="fas fa-suitcase"></i><span style="font-weight:500;" class="copy_suitcase_details"> `+fare_detail_list[l].amount+` `+fare_detail_list[l].unit+` for 1 person</span><br/>`;
                                        $text += 'Baggage ';
                                    }else if(fare_detail_list[l].detail_type == 'ML'){
                                        text+=`<i class="fas fa-utensils"></i><span style="font-weight:500;" class="copy_utensils_details"> `+fare_detail_list[l].amount+` `+fare_detail_list[l].unit+` for 1 person</span><br/>`;
                                        $text += 'Meal ';
                                    }else{
                                        text+=`<span style="font-weight:500;" class="copy_others_details">`+fare_detail_list[l].amount+` `+fare_detail_list[l].unit+` for 1 person</span><br/>`;
                                        $text += fare_detail_list[l].detail_name;
                                    }
                                    $text += fare_detail_list[l].amount + ' ' + fare_detail_list[l].unit +' for 1 person\n';

                                }
                                $text += '\n';
                            }
                            try{
                                //prevent error kalau provider tidak ada
                                if(provider_list_data[msg.result.response.provider_bookings[i].provider].is_post_issued_reschedule)
                                    text+=`
                                        <br/><span style="font-weight:bold;"><i class="fas fa-check-circle" style="color:#4f9c64;"></i> Reschedule</span>`;
                                if(provider_list_data[msg.result.response.provider_bookings[i].provider].is_post_issued_cancel)
                                    text+=`
                                        <br/><span style="font-weight:bold;"><i class="fas fa-check-circle" style="color:#4f9c64;"></i> Refund</span>`;
                            }catch(err){
                                console.log(err); // error kalau ada element yg tidak ada
                            }
                            for(j in msg.result.response.provider_bookings[i].rules){
                                text += `
                                    <span id="span-tac-up`+rules+`" class="carrier_code_template" style="display: block; cursor: pointer;" onclick="show_hide_tac(`+rules+`);"> `+msg.result.response.provider_bookings[i].rules[j].name+` <i class="fas fa-chevron-down"></i></span>
                                    <span id="span-tac-down`+rules+`" class="carrier_code_template" style="display: none; cursor: pointer;" onclick="show_hide_tac(`+rules+`);"> `+msg.result.response.provider_bookings[i].rules[j].name+` <i class="fas fa-chevron-up"></i></span>
                                    <div id="div-tac`+rules+`" style="display: none; max-height: 175px; overflow-y: auto; padding: 15px;">
                                `;
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
                                }
                                text += `</div>`;
                                rules++;
                            }
                        }
                        text+=`
                            </div>
                        </div>
                    </div>
                </div>`;
                if(msg.result.response.hasOwnProperty('reschedule_list') == true){
    //                $text += 'Order Number: '+ msg.result.response.order_number + '\n';
    //                $text += msg.result.response.state_description + '\n';
                    if(msg.result.response.reschedule_list.length>0){
                        text+=`
                        <div style="background-color:white; border:1px solid #cdcdcd;margin-top:20px;">
                            <div class="row">
                                <div class="col-lg-12">
                                    <div style="padding:10px; background-color:white;">
                                    <h5> Reschedule Flight Detail <img style="width:18px;" src="/static/tt_website_rodextrip/images/icon/plane.png" alt="Reschedule Flight Detail"/></h5>
                                    <hr/>`;
                                check = 0;
                                for(i in msg.result.response.reschedule_list){
                                    flight_counter = 1;
                                    if(i != 0){
                                        text+=`<hr/>`;
                                    }
                                    text+=`<div class="row">
                                            <div class="col-lg-6">`;
                                    text+=`<h5>Reschedule: `+msg.result.response.reschedule_list[i].reschedule_number+`</h5>`;
                                    text+=`</div>
                                           <div class="col-lg-6" style="text-align:right;">`
                                    text+=`<h5>State: `+msg.result.response.reschedule_list[i].state+`</h5>`;
                                    text+=`</div></div>`;
                                    for(j in msg.result.response.reschedule_list[i].old_segments){

                                        text+=`<h5>PNR: `+msg.result.response.reschedule_list[i].old_segments[j].pnr+`</h5>`;
                                        text+=`<h6>Flight `+flight_counter+`</h6>`;
                                        flight_counter++;
                                        var cabin_class = '';
                                        //yang baru harus diganti
                                        if(msg.result.response.reschedule_list[i].old_segments[j].cabin_class == 'Y')
                                            cabin_class = 'Economy Class';
                                        else if(msg.result.response.reschedule_list[i].old_segments[j].carrier_code == 'QG' && msg.result.response.reschedule_list[i].old_segments[j].cabin_class == 'W')
                                            cabin_class = 'Royal Green Class';
                                        else if(msg.result.response.reschedule_list[i].old_segments[j].cabin_class == 'W')
                                            cabin_class = 'Premium Economy Class';
                                        else if(msg.result.response.reschedule_list[i].old_segments[j].cabin_class == 'C')
                                            cabin_class = 'Business Class';
                                        else if(msg.result.response.reschedule_list[i].old_segments[j].cabin_class == 'F')
                                            cabin_class = 'First Class';
                                        for(k in msg.result.response.reschedule_list[i].old_segments[j].legs){
                                            text+= `
                                            <div class="row">
                                                <div class="col-lg-4">`;
                                                try{
                                                    text += `<img data-toggle="tooltip" style="width:50px; height:50px;" alt="`+airline_carriers[msg.result.response.reschedule_list[i].old_segments[j].carrier_code].name+`" title="`+airline_carriers[msg.result.response.reschedule_list[i].old_segments[j].carrier_code].name+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+msg.result.response.reschedule_list[i].old_segments[j].carrier_code+`.png"/>`;
                                                }catch(err){
                                                    text += `<img data-toggle="tooltip" style="width:50px; height:50px;" alt="`+msg.result.response.reschedule_list[i].old_segments[j].carrier_code+`" title="`+msg.result.response.reschedule_list[i].old_segments[j].carrier_code+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+msg.result.response.reschedule_list[i].old_segments[j].carrier_code+`.png"/>`;
                                                }
                                                text+=`<h5>`+msg.result.response.reschedule_list[i].old_segments[j].carrier_name+' '+msg.result.response.reschedule_list[i].old_segments[j].carrier_number+`</h5>
                                                    <span>Class : `+cabin_class+` (`+msg.result.response.reschedule_list[i].old_segments[j].class_of_service+`)</span><br/>
                                                </div>
                                                <div class="col-lg-8" style="padding-top:10px;">
                                                    <div class="row">
                                                        <div class="col-lg-6 col-xs-6">
                                                            <table style="width:100%">
                                                                <tr>
                                                                    <td><h5>`+msg.result.response.reschedule_list[i].old_segments[j].legs[k].departure_date.split('  ')[1]+`</h5></td>
                                                                    <td style="padding-left:15px;">
                                                                        <img src="/static/tt_website_rodextrip/img/icon/airlines-01.png" alt="Airline" style="width:20px; height:20px;"/>
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
                                                            <span>`+msg.result.response.reschedule_list[i].old_segments[j].legs[k].departure_date.split('  ')[0]+`</span><br/>
                                                            <span style="font-weight:500;">`+msg.result.response.reschedule_list[i].old_segments[j].legs[k].origin_name+` - `+msg.result.response.reschedule_list[i].old_segments[j].legs[k].origin_city+` (`+msg.result.response.reschedule_list[i].old_segments[j].legs[k].origin+`)</span>
                                                        </div>

                                                        <div class="col-lg-6 col-xs-6" style="padding:0;">
                                                            <table style="width:100%; margin-bottom:6px;">
                                                                <tr>
                                                                    <td><h5>`+msg.result.response.reschedule_list[i].old_segments[j].legs[k].arrival_date.split('  ')[1]+`</h5></td>
                                                                    <td></td>
                                                                    <td style="height:30px;padding:0 15px;width:100%"></td>
                                                                </tr>
                                                            </table>
                                                            <span>`+msg.result.response.reschedule_list[i].old_segments[j].legs[k].arrival_date.split('  ')[0]+`</span><br/>
                                                            <span style="font-weight:500;">`+msg.result.response.reschedule_list[i].old_segments[j].legs[k].destination_name+` - `+msg.result.response.reschedule_list[i].old_segments[j].legs[k].destination_city+` (`+msg.result.response.reschedule_list[i].old_segments[j].legs[k].destination+`)</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>`;
                                        }
                                    }
                                    text += `
                                            <div class="row">
                                                <div class="col-lg-6 col-xs-6">
                                                </div>
                                                <div class="col-lg-6 col-xs-6" style="text-align:right;">
                                                    <span style="font-weight:500;color:`+color+`">`+currency+` `+getrupiah(msg.result.response.reschedule_list[i].total_amount)+`</span><br/>
                                                </div>
                                            </div>`;
                                }
                                text+=`
                                    </div>
                                </div>
                            </div>
                        </div>`;
                    }
                }
                text+=`

                <div style="border:1px solid #cdcdcd; padding:10px; background-color:white; margin-top:20px;">
                    <h5> Booker</h5>
                    <hr/>
                    <div style="overflow-x:auto;">
                    <table style="width:100%" id="list-of-passenger">
                        <tr>
                            <th style="width:10%;" class="list-of-passenger-left">No</th>
                            <th style="width:40%;">Name</th>
                            <th style="width:30%;">Email</th>
                            <th style="width:30%;">Phone</th>
                        </tr>`;
                        title = '';
                        if(msg.result.response.booker.gender == 'female' && msg.result.response.booker.marital_status == "married")
                            title = 'MRS';
                        else if(msg.result.response.booker.gender == 'female')
                            title = 'MS'
                        else
                            title = 'MR';
                        text+=`<tr>
                            <td class="list-of-passenger-left">`+(1)+`</td>
                            <td>`+title+` `+msg.result.response.booker.name+`</td>
                            <td>`+msg.result.response.booker.email+`</td>`;
                        if(msg.result.response.booker.phones.length > 0)
                        text+=`
                            <td>`+msg.result.response.booker.phones[0].calling_code+' - '+msg.result.response.booker.phones[0].calling_number+`</td>`;
                        else
                        text+=`<td></td>`;
                        text+=`</tr>

                    </table>
                    </div>
                </div>
                <div style="border:1px solid #cdcdcd; padding:10px; background-color:white; margin-top:20px;">
                    <h5> Contact Person</h5>
                    <hr/>
                    <div style="overflow-x:auto;">
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
                    </div>
                </div>

                <div style="border:1px solid #cdcdcd; padding:10px; background-color:white; margin-top:20px;">
                    <h5> List of Passenger</h5>
                    <hr/>
                    <div class="row">`;
                        for(pax in msg.result.response.passengers){
                            ticket = '';
                            ff_request = '';
                            for(provider in msg.result.response.provider_bookings){
                                try{
                                    ticket += msg.result.response.provider_bookings[provider].tickets[pax].ticket_number;
                                    if(provider != msg.result.response.provider_bookings.length - 1)
                                        if(ticket != '')
                                            ticket += ', ';
                                    if(ff_request != '')
                                        ff_request += '<br/>';
                                    if(msg.result.response.provider_bookings[provider].tickets[pax].ff_name != '' && msg.result.response.provider_bookings[provider].tickets[pax].ff_number != '')
                                        ff_request += msg.result.response.provider_bookings[provider].tickets[pax].ff_name + ': '+ msg.result.response.provider_bookings[provider].tickets[pax].ff_number;
                                }catch(err){

                                }
                            }

                            text+=`
                            <div class="col-lg-12">
                                <h5>`+(parseInt(pax)+1)+`.
                                `+msg.result.response.passengers[pax].title+` `+msg.result.response.passengers[pax].first_name+` `+msg.result.response.passengers[pax].last_name+`
                                </h5>
                                Birth Date: <b>`+msg.result.response.passengers[pax].birth_date+`</b><br/>
                                Ticket Number: <b>`+ticket+`</b><br/>
                                `+ff_request;
                                fee_dict = {}; //bikin ke dict agar bisa fees per segment / journey
                                      try{
                                            for(i in msg.result.response.passengers[pax].fees){
                                                if(fee_dict.hasOwnProperty(msg.result.response.passengers[pax].fees[i].journey_code) == false){
                                                    fee_dict[msg.result.response.passengers[pax].fees[i].journey_code] = {
                                                        "fees": [],
                                                    };
                                                    found = false;
                                                    for(j in msg.result.response.provider_bookings){
                                                        for(k in msg.result.response.provider_bookings[j].journeys){
                                                            if(msg.result.response.provider_bookings[j].journeys[k].journey_code == msg.result.response.passengers[pax].fees[i].journey_code){
                                                                found = true;
                                                                fee_dict[msg.result.response.passengers[pax].fees[i].journey_code].origin = msg.result.response.provider_bookings[j].journeys[k].origin;
                                                                fee_dict[msg.result.response.passengers[pax].fees[i].journey_code].destination = msg.result.response.provider_bookings[j].journeys[k].destination;
                                                                break;
                                                            }
                                                            for(l in msg.result.response.provider_bookings[j].journeys[k].segments){
                                                                if(msg.result.response.provider_bookings[j].journeys[k].segments[l].segment_code == msg.result.response.passengers[pax].fees[i].journey_code){
                                                                    found = true;
                                                                    fee_dict[msg.result.response.passengers[pax].fees[i].journey_code].origin = msg.result.response.provider_bookings[j].journeys[k].segments[l].origin;
                                                                    fee_dict[msg.result.response.passengers[pax].fees[i].journey_code].destination = msg.result.response.provider_bookings[j].journeys[k].segments[l].destination;
                                                                    break;
                                                                }
                                                            }
                                                            if(found)
                                                                break;
                                                        }
                                                        if(found)
                                                            break
                                                    }
                                                }
                                                fee_dict[msg.result.response.passengers[pax].fees[i].journey_code].fees.push({
                                                    "fee_category": msg.result.response.passengers[pax].fees[i].fee_category,
                                                    "fee_name": msg.result.response.passengers[pax].fees[i].fee_name
                                                })
                                            }
                                      }catch(err){
                                          console.log(err); // error kalau ada element yg tidak ada
                                      }
                                      for(i in fee_dict){
                                            text += `<label style="color:`+color+`;">`+fee_dict[i].origin+` - `+fee_dict[i].destination+`</label><br/>`;
                                            for(j in fee_dict[i].fees){
                                                if(fee_dict[i].fees[j].fee_category == 'meal'){
                                                    text+=`<i class="fas fa-utensils"></i> `;
                                                }
                                                else if(fee_dict[i].fees[j].fee_category == 'baggage'){
                                                    text+=`<i class="fas fa-suitcase"></i> `;
                                                }
                                                else if(fee_dict[i].fees[j].fee_category == 'equipment'){
                                                    text+=`<i class="fas fa-tools"></i> `;
                                                }
                                                else if(fee_dict[i].fees[j].fee_category == 'seat'){
                                                    text+=`<img src="/static/tt_website_rodextrip/img/icon/seat.png" style="height:16px; width:auto;"/> `;
                                                }

                                                text += `<label>`;
                                                if(fee_dict[i].fees[j].fee_name.toLowerCase().includes(fee_dict[i].fees[j].fee_category.toLowerCase()) == false)
                                                    text += fee_dict[i].fees[j].fee_category + ': ';
                                                text += fee_dict[i].fees[j].fee_name + `</label><br/>`;
                                            }
                                      }
                                      msg.result.response.passengers[pax].fees_dict = fee_dict;
                                      text+=`
                                      <hr/>
                            </div>`;
                        }
                    text+=`
                    </div>
                        <div class="row mt-3" id="ssr_request_after_sales">`;
                           if(check_seat || check_ssr){
                                text+=`
                                <div class="col-lg-12">
                                    <h6>Request New</h6>
                                    <br/>
                                </div>`;
                           }
                           if(check_ssr){
                                text+=`
                                <div class="col-lg-6 mb-3">
                                    <button class="primary-btn-white" style="width:100%;" type="button" onclick="set_new_request_ssr()">
                                        <i class="fas fa-plus"></i> Baggage, Meal, Medical
                                    </button>
                                </div>`;
                           }
                           if(check_seat){
                                text+=`
                                <div class="col-lg-6">
                                    <button class="primary-btn-white" style="width:100%;" type="button" onclick="set_new_request_seat()">
                                        <i class="fas fa-plus"></i> Seat
                                    </button>
                                </div>`;
                           }
                       text+=`
                       </div>
                    </div>
                </div>

                <div class="row" style="margin-top:20px;">`;

                text+=`
                    <div class="col-lg-6 col-md-6" style="padding-bottom:10px;">`;
                        if(msg.result.response.state != 'cancel' && msg.result.response.state != 'cancel2'){
                            if (msg.result.response.state == 'issued'){
                                text+=`
                                <button type="button" id="button-choose-print" class="primary-btn ld-ext-right" style="width:100%;" onclick="get_printout('`+msg.result.response.order_number+`', 'ticket','airline');">
                                    Print Ticket
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
                                <button type="button" id="button-print-print" class="primary-btn ld-ext-right" style="width:100%;" onclick="get_printout('`+msg.result.response.order_number+`', 'itinerary','airline');">
                                    Print Form
                                    <div class="ld ld-ring ld-cycle"></div>
                                </button>`;
                            }
                            else if (msg.result.response.state == 'issued'){
                                text+=`
                                <button type="button" class="primary-btn ld-ext-right" id="button-print-print" style="width:100%;" onclick="get_printout('`+msg.result.response.order_number+`', 'ticket_price','airline');">
                                    Print Ticket (Price)
                                    <div class="ld ld-ring ld-cycle"></div>
                                </button>`;
                            }
                        }
                        text+=`
                    </div>`;
                    if(msg.result.response.state == 'issued' && col == 3){
                    text+=`
                    <div class="col-lg-6 col-md-6" style="padding-bottom:10px;">`;
                        text+=`
                        <button type="button" id="button-print-ori" class="primary-btn ld-ext-right" style="width:100%;" onclick="get_printout('`+msg.result.response.order_number+`', 'ticket_original','airline',120);">
                            Print Ori Ticket
                            <div class="ld ld-ring ld-cycle"></div>
                        </button>
                    </div>`;
                    }
                    text+=`<div class="col-lg-6 col-md-6" style="padding-bottom:10px;">`;
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
                                                        <button type="button" id="button-issued-print" class="primary-btn ld-ext-right" onclick="get_printout('`+msg.result.response.order_number+`', 'invoice','airline');">
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
                    text+=`
                    </div>`;
                text+=`
                </div>`;
                document.getElementById('airline_booking').innerHTML = text;

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

                $text += '\n‣ Contact Person:\n';
                $text += msg.result.response.contact.title + ' ' + msg.result.response.contact.name + '\n';
                $text += msg.result.response.contact.email + '\n';
                $text += msg.result.response.contact.phone+ '\n';

                $text += '\n‣ Price:\n';
                csc = 0;
                for(i in msg.result.response.provider_bookings){
                    try{
                        if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false || msg.result.response.state == 'issued')
                            text_detail+=`
                                <div style="text-align:left">
                                    <span style="font-weight:500; font-size:14px;">PNR: `+msg.result.response.provider_bookings[i].pnr+` </span>
                                </div>`;

                        for(j in msg.result.response.passengers){
                            price = {'FARE': 0, 'RAC': 0, 'ROC': 0, 'TAX':0 , 'currency': '', 'CSC': 0, 'SSR': 0, 'DISC': 0,'SEAT':0};
                            for(k in msg.result.response.passengers[j].sale_service_charges[msg.result.response.provider_bookings[i].pnr]){
                                price[k] += msg.result.response.passengers[j].sale_service_charges[msg.result.response.provider_bookings[i].pnr][k].amount;
                                if(price['currency'] == '')
                                    price['currency'] = msg.result.response.passengers[j].sale_service_charges[msg.result.response.provider_bookings[i].pnr][k].currency;
                            }
                            disc -= price['DISC'];
                            if(i ==0 ){
                                //HANYA PROVIDER PERTAMA KARENA UPSELL PER PASSENGER BUKAN PER JOURNEY
                                try{
                                    price['CSC'] = msg.result.response.passengers[j].channel_service_charges.amount;
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
                                    <span style="font-size:12px;">`+msg.result.response.passengers[j].name+`</span>`;
                                text_detail+=`</div>
                                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                    <span style="font-size:13px;">`+price.currency+` `+getrupiah(parseInt(price.FARE + price.TAX + price.ROC + price.SSR + price.SEAT))+`</span>
                                </div>
                            </div>`;
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
                            counter_ssr = 0;
                            for(k in msg.result.response.passengers[j].fees_dict){
                                if(counter_ssr == 0)
                                    $text += 'SSR Request:\n';
                                $text += msg.result.response.passengers[j].fees_dict[k].origin + ' → ' + msg.result.response.passengers[j].fees_dict[k].destination+'\n';
                                for(l in msg.result.response.passengers[j].fees_dict[k].fees){
                                    $text += msg.result.response.passengers[j].fees_dict[k].fees[l].fee_category+': '+msg.result.response.passengers[j].fees_dict[k].fees[l].fee_name + '\n';
                                }
                                if(Object.keys(msg.result.response.passengers[j].fees_dict).length != counter_ssr)
                                    $text += '\n';
                                counter_ssr++;
                            }
                            $text += '['+msg.result.response.provider_bookings[i].pnr+'] '
                            $text += currency+` `+getrupiah(parseInt(price.FARE + price.SSR + price.SEAT + price.TAX + price.ROC + price.CSC + price.DISC))+'\n\n\n';
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
                        counter_service_charge++;
                    }catch(err){console.log(err);}
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
                try{
                    airline_get_detail.result.response.total_price = total_price;
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
                                <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png" alt="Email"/></a>`;
                        } else {
                            text_detail+=`
                                <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png" alt="Whatsapp"/></a>
                                <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png" alt="Line"/></a>
                                <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png" alt="Telegram"/></a>
                                <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png" alt="Email"/></a>`;
                        }

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
                    text_detail+=`<center>

                    <div style="padding-bottom:10px;">
                        <center>
                            <input type="button" class="primary-btn-white" style="width:100%;" onclick="copy_data();" value="Copy"/>
                        </center>
                    </div>`;
                    if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
                    text_detail+=`
                    <div style="margin-bottom:5px;">
                        <input class="primary-btn-white" id="show_commission_button" style="width:100%;" type="button" onclick="show_commission('commission');" value="Show Commission"/>
                    </div>
                </div>`;
                }catch(err){
                    console.log(err); // error kalau ada element yg tidak ada
                }
                document.getElementById('airline_detail').innerHTML = text_detail;
                if(msg.result.response.hasOwnProperty('voucher_reference') && msg.result.response.voucher_reference != '' && msg.result.response.voucher_reference != false){
                    try{
                        render_voucher(price.currency,disc, msg.result.response.state)
                    }catch(err){console.log(err);}
                }
                try{
                    if(msg.result.response.state == 'booked' || msg.result.response.state == 'issued' && msg.result.response.voucher_reference)
                        document.getElementById('voucher_div').style.display = 'block';
                    else
                        document.getElementById('voucher_div').style.display = 'none';
                }catch(err){console.log(err);}
                //refund
                if(msg.result.response.state == 'refund'){
                    total_refund = 0;
                    if(msg.result.response.refund_list.length > 0){
                        text = `<div style="background-color:white; padding:10px; border: 1px solid #cdcdcd; margin-bottom:15px;">
                                    <h5> Refund</h5>
                                <hr/>`;
                        for(i in msg.result.response.refund_list){
                                if(msg.result.response.refund_list[i].state != 'cancel'){
                                text += `
                                        <div class="row" style="margin-bottom:5px;">
                                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                                                <span style="font-weight:500;font-size:15px;">`+msg.result.response.refund_list[i].reschedule_number+`</span></div>
                                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                                                <span style="font-weight:500;font-size:15px;">State: `+msg.result.response.refund_list[i].state+`</span>
                                            </div>
                                         </div>

                                         <div style="text-align:left">
                                            <span style="font-weight:500; font-size:14px;">PNR: `+msg.result.response.refund_list[i].pnr+` </span>
                                         </div>
                                         <div class="row" style="margin-bottom:5px;">
                                            <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                                <span style="font-size:12px;">Refund Amount</span></div>
                                            <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                                <span style="font-size:13px;">`+price.currency+` `+getrupiah(msg.result.response.refund_list[i].refund_amount)+`</span>
                                            </div>
                                         </div>
                                         <div class="row" style="margin-bottom:5px;">
                                            <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                                <span style="font-size:12px;">Admin Fee</span></div>
                                            <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                                <span style="font-size:13px;">`+price.currency+` `+getrupiah(msg.result.response.refund_list[i].final_admin_fee)+`</span>
                                            </div>
                                         </div>`;
                                total_refund += msg.result.response.refund_list[i].total_amount;
                                break;
                            }
                        }
                        text += `<hr/>
                                 <div class="row" style="margin-bottom:5px;">
                                    <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                        <span style="font-size:13px; font-weight: bold;">Total Refund Customer</span></div>
                                    <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                        <span style="font-size:13px; font-weight: bold;">`+price.currency+` `+getrupiah(total_refund)+`</span>
                                    </div>
                                 </div>
                             </div>`;
                        document.getElementById('total_refund_div').innerHTML = text;
                        document.getElementById('total_refund_div').style.display = 'block';

                    }
                }

                $("#show_loading_booking_airline").hide();

                //
                text = `
                <div class="modal fade" id="myModal" role="dialog">
                    <div class="modal-dialog">

                        <!-- Modal content-->
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title" style="color:`+text_color+`;">Price Change <i class="fas fa-money"></i></h4>
                                <button type="button" class="close" data-dismiss="modal" onclick="airline_get_booking('`+msg.result.response.order_number+`');show_loading();please_wait_transaction();">&times;</button>
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
                document.getElementById('airline_booking').innerHTML += text;
                document.getElementById('show_title_airline').hidden = false;
                document.getElementById('show_loading_booking_airline').hidden = true;
                add_repricing();
                if (msg.result.response.state != 'booked'){
    //                document.getElementById('issued-breadcrumb').classList.add("active");
                }

                for(i in msg.result.response.provider_bookings){
                    for(j in msg.result.response.provider_bookings[i].journeys){
                        if(msg.result.response.provider_bookings[i].journeys[j].hasOwnProperty('search_banner')){
                           for(banner_counter in msg.result.response.provider_bookings[i].journeys[j].search_banner){
                               var max_banner_date = moment().subtract(parseInt(-1*msg.result.response.provider_bookings[i].journeys[j].search_banner[banner_counter].minimum_days), 'days').format('YYYY-MM-DD');
                               var selected_banner_date = moment(msg.result.response.provider_bookings[i].journeys[j].departure_date.split('  ')[0]).format('YYYY-MM-DD');

                               if(selected_banner_date >= max_banner_date){
                                   if(msg.result.response.provider_bookings[i].journeys[j].search_banner[banner_counter].description != ''){
                                       new jBox('Tooltip', {
                                            attach: '#pop_search_banner'+i+j+banner_counter,
                                            theme: 'TooltipBorder',
                                            width: 280,
                                            position: {
                                              x: 'center',
                                              y: 'bottom'
                                            },
                                            closeOnMouseleave: true,
                                            animation: 'zoomIn',
                                            content: msg.result.response.provider_bookings[i].journeys[j].search_banner[banner_counter].description
                                       });
                                   }
                               }
                           }
                        }
                    }
                }

               }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                   auto_logout();
               }else if(msg.result.error_code == 1035){
                    hide_modal_waiting_transaction();
                    document.getElementById('show_loading_booking_airline').hidden = true;
                    render_login('airline');
               }else{
                    text += `<div class="alert alert-danger">
                            <h5>
                                `+msg.result.error_code+`
                            </h5>
                            `+msg.result.error_msg+`
                        </div>`;
                    document.getElementById('airline_booking').innerHTML = text;
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: #ff9900;">Error airline booking </span>' + msg.result.error_msg,
                    })
                    $('#show_loading_booking_airline').hide();
                    $('.loader-rodextrip').fadeOut();
               }
           }catch(err){
                text = '';
                text += `<div class="alert alert-danger">
                            <h5>
                                Error
                            </h5>
                        </div>`;
                document.getElementById('airline_booking').innerHTML = text;
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
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error airline booking');
            $("#show_loading_booking_airline").hide();
            $("#show_error_booking_airline").show();
            hide_modal_waiting_transaction();
            $('.loader-rodextrip').fadeOut();
       },timeout: 300000
    });
}

function cancel_btn_location(){
    show_loading();
    please_wait_transaction();
    window.location= "/airline/booking/"+btoa(airline_get_detail.result.response.order_number)+"/refund";
}

function check_refund_btn(){
    show_loading();
    please_wait_transaction();
    getToken();
    $.ajax({
           type: "POST",
           url: "/webservice/airline",
           headers:{
                'action': 'get_refund_booking',
           },
           data: {
               'order_number': airline_get_detail.result.response.order_number,
               'signature': signature
           },
           success: function(msg) {
               hide_modal_waiting_transaction();
               document.getElementById("overlay-div-box").style.display = "none";

               if(msg.result.error_code == 0){
                   //update ticket
                   document.getElementById('refund_detail').hidden = false;
                   text = '<h5>Refund:<h5>';
                   total = 0;
                   for (i in msg.result.response.provider_bookings){
                       total_price = 0;
                       currency = '';
                       for(pax in airline_get_detail.result.response.passengers){
                            try{
                                total_price += airline_get_detail.result.response.passengers[pax].total_price[msg.result.response.provider_bookings[i].pnr];
                                total += airline_get_detail.result.response.passengers[pax].total_price[msg.result.response.provider_bookings[i].pnr];
                            }catch(err){console.log(err)}
                            if(currency == '' || currency == 'undefined')
                                currency = airline_get_detail.result.response.passengers[pax].currency;
                       }
                       text+=`
                        <div class="row" style="margin-bottom:5px;">
                            <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                <span style="font-size:12px;">`+msg.result.response.provider_bookings[i].pnr+`</span>
                            </div>
                            <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                <span style="font-size:13px;">`+currency+` `+getrupiah(parseInt(total_price))+`</span>
                            </div>
                        </div>`;
                        text+=`
                        <div class="row" style="margin-bottom:5px;">
                            <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                <span style="font-size:12px;">Refund Fee</span>
                            </div>
                            <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                <span style="font-size:13px;">`+currency+` -`+getrupiah(parseInt(msg.result.response.provider_bookings[i].penalty_amount))+`</span>
                            </div>
                        </div>`;
                        text+=`
                        <div class="row" style="margin-bottom:5px;">
                            <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                <span style="font-size:12px;">Admin Fee</span>
                            </div>
                            <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                <span style="font-size:13px;">`+currency+` -`+getrupiah(parseInt(msg.result.response.provider_bookings[i].admin_fee))+`</span>
                            </div>
                        </div>`;
                        total = total - msg.result.response.provider_bookings[i].penalty_amount - msg.result.response.provider_bookings[i].admin_fee;
                   }

                   text+=`
                        <hr/>
                        <div class="row" style="margin-bottom:5px;">
                            <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                <span style="font-size:12px;">Grand Total</span>
                            </div>
                            <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                <span style="font-size:13px;">`+currency+` `+getrupiah(parseInt(total))+`</span>
                            </div>
                        </div>`;


                   document.getElementById('refund_detail').innerHTML = text;
                   document.getElementById('refund_detail').style.display = 'block';
                   document.getElementById('full_refund').value = 'Proceed';
                   document.getElementById('full_refund').setAttribute('onClick', 'cancel_btn();');
               }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                    auto_logout();
               }else{
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: #ff9900;">Error airline cancel </span>' + msg.result.error_msg,
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

                    hide_modal_waiting_transaction();
                    document.getElementById("overlay-div-box").style.display = "none";

                    $('.hold-seat-booking-train').prop('disabled', false);
                    $('.hold-seat-booking-train').removeClass("running");
                    airline_get_booking(airline_get_detail.result.response.order_number);
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
                document.getElementById('show_loading_booking_airline').style.display = 'block';
                document.getElementById('show_loading_booking_airline').hidden = false;
                document.getElementById('payment_acq').hidden = true;
                hide_modal_waiting_transaction();
                document.getElementById("overlay-div-box").style.display = "none";
                $('.hold-seat-booking-train').prop('disabled', false);
                $('.hold-seat-booking-train').removeClass("running");
                airline_get_booking(airline_get_detail.result.response.order_number);
           },timeout: 300000
        });
}

function check_refund_partial_btn(){
    try{
        clearInterval(timeLimitInterval);
    }catch(err){
        console.log(err); // error kalau ada element yg tidak ada
    }
    show_loading();
    please_wait_transaction();
    getToken();

    var passengers = [];
    $('.refund_pax:checkbox:checked').each(function( index ) {
        //console.log( index + ": " + $('.refund_pax:checkbox:checked')[0].id );
        passengers.push($('.refund_pax:checkbox:checked')[index].id);
    });
    //console.log(passengers);
    captcha = {};
    check_image = 0;
    if(refund_msg.result.response.length>0){
        for(i in refund_msg.result.response){
            img_list = refund_msg.result.response[i].img.split(';');
            for(j in img_list){
                if(img_list[j] != ''){
                    try{
                        if(j != 0)
                            captcha[refund_msg.result.response[i].pnr] += ';'+document.getElementById('captcha'+parseInt(check_image)).value;
                        else
                            captcha[refund_msg.result.response[i].pnr] = document.getElementById('captcha'+parseInt(check_image)).value;
                    }catch(err){
                        if(j != 0)
                            captcha[refund_msg.result.response[i].pnr] += ';';
                        else
                            captcha[refund_msg.result.response[i].pnr] = '';
                    }
                }else{
                    if(j!=0)
                        captcha[refund_msg.result.response[i].pnr] += ';';
                    else
                        captcha[refund_msg.result.response[i].pnr] = '';
                }
                check_image++;
            }
        }
    }
    $.ajax({
           type: "POST",
           url: "/webservice/airline",
           headers:{
                'action': 'get_refund_booking',
           },
           data: {
               'order_number': airline_get_detail.result.response.order_number,
               'signature': signature,
               'passengers': JSON.stringify(passengers),
               'captcha':JSON.stringify(captcha)
           },
           success: function(msg) {
               hide_modal_waiting_transaction();
               document.getElementById("overlay-div-box").style.display = "none";
               if(msg.result.error_code == 0){
                   airline_refund_response = msg.result.response
                   //update ticket
                   document.getElementById('refund_detail').hidden = false;
                   text = '<h5>Refund:<h5>';
                   total = 0;
                   pinalty_amount_with_admin_fee = 0;
                   pnr_refund_list = {};
                   total_hitung_frontend = 0;
                   var is_amadeus = [];
                   for (i in msg.result.response.provider_bookings){
                       currency = msg.result.response.provider_bookings[i].currency;
                       if(msg.result.response.provider_bookings[i].hasOwnProperty('resv_total_price')){
                           try{
                                total += msg.result.response.provider_bookings[i].resv_total_price;
                           }catch(err){console.log(err)}
                           is_amadeus.push(false);
                           for(j in msg.result.response.provider_bookings[i].passengers){
                                for(k in msg.result.response.provider_bookings[i].passengers[j].fees){
                                    if(msg.result.response.provider_bookings[i].passengers[j].fees[k].fee_type == 'RF'){
                                        is_amadeus[i] = true;
                                        if(Object.keys(pnr_refund_list).includes(msg.result.response.provider_bookings[i].pnr) == false){
                                            pnr_refund_list[msg.result.response.provider_bookings[i].pnr] = [];
                                        }
                                        text+= `
                                            <div class="row" style="margin-bottom:5px;">
                                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="text-align:left;">
                                                    <span style="font-size:12px;">`+msg.result.response.provider_bookings[i].passengers[j].title+` `+msg.result.response.provider_bookings[i].passengers[j].first_name+` `+msg.result.response.provider_bookings[i].passengers[j].last_name+` `+msg.result.response.provider_bookings[i].passengers[j].fees[k].fee_name+` `+msg.result.response.provider_bookings[i].pnr+`</span>
                                                </div>
                                            </div>
                                            `;
                                        for(l in msg.result.response.provider_bookings[i].passengers[j].fees[k].service_charges){
                                            // AMADEUS EDIT REFUND
                                            /*
                                            text+=`
                                                <div class="row" style="margin-bottom:5px;">
                                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                                                        <span style="font-size:12px;">`+msg.result.response.provider_bookings[i].passengers[j].fees[k].service_charges[l].charge_type+` `+msg.result.response.provider_bookings[i].passengers[j].fees[k].service_charges[l].charge_code+` `+msg.result.response.provider_bookings[i].pnr+`</span>
                                                    </div>`;
                                            if(msg.result.response.provider_bookings[i].passengers[j].fees[k].fee_code != 'com'){
                                                text+=`
                                                    <div class="col-lg-1 col-md-1 col-sm-1 col-xs-1" style="text-align:right;">
                                                        <span style="font-size:13px;">`+currency+`</span>
                                                        <input type="hidden" id="`+msg.result.response.provider_bookings[i].passengers[j].first_name+`_`+msg.result.response.provider_bookings[i].passengers[j].last_name+`_`+msg.result.response.provider_bookings[i].passengers[j].fees[k].fee_name+`_`+msg.result.response.provider_bookings[i].passengers[j].fees[k].service_charges[l].charge_type+`_`+msg.result.response.provider_bookings[i].passengers[j].fees[k].service_charges[l].sequence+`_type" value="amount"/>
                                                    </div>`;
                                                total_hitung_frontend += msg.result.response.provider_bookings[i].passengers[j].fees[k].service_charges[l].amount;
                                            }else{
                                                text+=`
                                                    <div class="col-lg-1 col-md-1 col-sm-1 col-xs-1" style="text-align:right;">
                                                        <span style="font-size:13px;">%</span>
                                                        <input type="hidden" id="`+msg.result.response.provider_bookings[i].passengers[j].first_name+`_`+msg.result.response.provider_bookings[i].passengers[j].last_name+`_`+msg.result.response.provider_bookings[i].passengers[j].fees[k].fee_name+`_`+msg.result.response.provider_bookings[i].passengers[j].fees[k].service_charges[l].charge_type+`_`+msg.result.response.provider_bookings[i].passengers[j].fees[k].service_charges[l].sequence+`_type" value="percentage"/>
                                                    </div>`;
                                            }
                                            text+=`
                                                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4" style="text-align:right;">
                                                        <input type="text" id="`+msg.result.response.provider_bookings[i].passengers[j].first_name+`_`+msg.result.response.provider_bookings[i].passengers[j].last_name+`_`+msg.result.response.provider_bookings[i].passengers[j].fees[k].fee_name+`_`+msg.result.response.provider_bookings[i].passengers[j].fees[k].service_charges[l].charge_type+`_`+msg.result.response.provider_bookings[i].passengers[j].fees[k].service_charges[l].sequence+`" value="`+getrupiah(msg.result.response.provider_bookings[i].passengers[j].fees[k].service_charges[l].amount)+`" onchange="change_refund_price('`+msg.result.response.provider_bookings[i].passengers[j].first_name+`_`+msg.result.response.provider_bookings[i].passengers[j].last_name+`_`+msg.result.response.provider_bookings[i].passengers[j].fees[k].fee_name+`_`+msg.result.response.provider_bookings[i].passengers[j].fees[k].service_charges[l].charge_type+`_`+msg.result.response.provider_bookings[i].passengers[j].fees[k].service_charges[l].sequence+`')" style="width:130%"/>

                                                    </div>
                                                </div>`;
                                            */
                                            text+=`
                                                <div class="row" style="margin-bottom:5px;">
                                                    <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                                        <span style="font-size:12px;" id="`+msg.result.response.provider_bookings[i].passengers[j].first_name+`_`+msg.result.response.provider_bookings[i].passengers[j].last_name+`_`+msg.result.response.provider_bookings[i].passengers[j].fees[k].fee_name+`_`+msg.result.response.provider_bookings[i].passengers[j].fees[k].service_charges[l].charge_type+`_`+msg.result.response.provider_bookings[i].passengers[j].fees[k].service_charges[l].sequence+`">`+msg.result.response.provider_bookings[i].passengers[j].fees[k].service_charges[l].charge_type+` `+msg.result.response.provider_bookings[i].passengers[j].fees[k].service_charges[l].charge_code+` `+msg.result.response.provider_bookings[i].pnr+`</span>
                                                    </div>
                                                    <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                                        <span style="font-size:13px;">`;
                                            if(msg.result.response.provider_bookings[i].passengers[j].fees[k].fee_code != 'com'){
                                                text+=currency;
                                                text+=`<input type="hidden" id="`+msg.result.response.provider_bookings[i].passengers[j].first_name+`_`+msg.result.response.provider_bookings[i].passengers[j].last_name+`_`+msg.result.response.provider_bookings[i].passengers[j].fees[k].fee_name+`_`+msg.result.response.provider_bookings[i].passengers[j].fees[k].service_charges[l].charge_type+`_`+msg.result.response.provider_bookings[i].passengers[j].fees[k].service_charges[l].sequence+`_type" value="amount"/>`;
                                                total_hitung_frontend += msg.result.response.provider_bookings[i].passengers[j].fees[k].service_charges[l].amount;
                                            }else{
                                                text+=`%`;
                                                text+=`<input type="hidden" id="`+msg.result.response.provider_bookings[i].passengers[j].first_name+`_`+msg.result.response.provider_bookings[i].passengers[j].last_name+`_`+msg.result.response.provider_bookings[i].passengers[j].fees[k].fee_name+`_`+msg.result.response.provider_bookings[i].passengers[j].fees[k].service_charges[l].charge_type+`_`+msg.result.response.provider_bookings[i].passengers[j].fees[k].service_charges[l].sequence+`_type" value="percentage"/>`;
                                            }
                                            text+=getrupiah(msg.result.response.provider_bookings[i].passengers[j].fees[k].service_charges[l].amount);
                                            text+=`
                                                        </span>
                                                    </div>
                                                </div>
                                                    `;

                                            pnr_refund_list[msg.result.response.provider_bookings[i].pnr].push(msg.result.response.provider_bookings[i].passengers[j].first_name+`_`+msg.result.response.provider_bookings[i].passengers[j].last_name+`_`+msg.result.response.provider_bookings[i].passengers[j].fees[k].fee_name+`_`+msg.result.response.provider_bookings[i].passengers[j].fees[k].service_charges[l].charge_type+`_`+msg.result.response.provider_bookings[i].passengers[j].fees[k].service_charges[l].sequence)
                                        }
                                    }
                                }
                           }
                           text+=`
                            <div class="row" style="margin-bottom:5px;">
                                <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                    <span style="font-size:12px;">Received Amount `+msg.result.response.provider_bookings[i].pnr+`</span>
                                </div>
                                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                    <span style="font-size:13px;" id="total_`+msg.result.response.provider_bookings[i].pnr+`">`+currency+` `;
                                    if(is_amadeus[i] == false){
                                        text+=getrupiah(parseInt(msg.result.response.provider_bookings[i].resv_total_price - msg.result.response.provider_bookings[i].penalty_amount))+`</span>`;
                                        total = total - msg.result.response.provider_bookings[i].penalty_amount - msg.result.response.provider_bookings[i].admin_fee;
                                    }else{
                                        text+=getrupiah(parseInt(total_hitung_frontend))+`</span>`;
                                        total = total_hitung_frontend - msg.result.response.provider_bookings[i].penalty_amount - msg.result.response.provider_bookings[i].admin_fee;
                                    }
                                    text+=`
                                </div>
                            </div>`;
//                            text+=`
//                            <div class="row" style="margin-bottom:5px;">
//                                <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
//                                    <span style="font-size:12px;">Refund Fee</span>
//                                </div>
//                                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
//                                    <span style="font-size:13px;">`+currency+` -`+getrupiah(parseInt(msg.result.response.provider_bookings[i].penalty_amount))+`</span>
//                                </div>
//                            </div>`;
                            text+=`
                            <div class="row" style="margin-bottom:5px;">
                                <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                    <span style="font-size:12px;">Admin Fee `+msg.result.response.provider_bookings[i].pnr+`</span>
                                </div>
                                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                    <span style="font-size:13px;">`+currency+` -`+getrupiah(parseInt(msg.result.response.provider_bookings[i].admin_fee))+`</span>
                                </div>
                            </div>`;
                            pinalty_amount_with_admin_fee -= msg.result.response.provider_bookings[i].penalty_amount - msg.result.response.provider_bookings[i].admin_fee;
                        }
                    }
                   text+=`
                        <hr/>
                        <div class="row" style="margin-bottom:5px;">
                            <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                <span style="font-size:12px;">Grand Total</span>
                            </div>
                            <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">`;
                            if(total_hitung_frontend == 0){
                            text+=`
                                <span style="font-size:13px;" id="grand_total_refund">`+currency+` `+getrupiah(parseInt(total))+`</span>`;
                            }else{
                            text+=`
                                <span style="font-size:13px;" id="grand_total_refund">`+currency+` `+getrupiah(parseInt(total_hitung_frontend - msg.result.response.provider_bookings[i].admin_fee))+`</span>`;
                            }
                            text+=`
                            </div>
                        </div>`;


                   document.getElementById('refund_detail').innerHTML = text;
                   document.getElementById('refund_detail').style.display = 'block';
                   document.getElementById('full_refund').value = 'Proceed';
                   document.getElementById('full_refund').setAttribute('onClick', 'cancel_btn();');
                   hide_modal_waiting_transaction();
               }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                    auto_logout();
               }else{
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: #ff9900;">Error airline refund </span>' + msg.result.error_msg,
                    })
                    hide_modal_waiting_transaction();
                    document.getElementById("overlay-div-box").style.display = "none";

                    $('.hold-seat-booking-train').prop('disabled', false);
                    $('.hold-seat-booking-train').removeClass("running");
                    document.getElementById('captcha').innerHTML = `
                        <button class="btn-next primary-btn next-passenger-train ld-ext-right" id="request_captcha" style="width:100%;" type="button" value="Next" onclick="next_disabled();pre_refund_login();">
                            Check Refund Price
                            <div class="ld ld-ring ld-cycle"></div>
                        </button>`;
                    document.getElementById('cancel').hidden = true;
                    document.getElementById('cancel').innerHTML = '';
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
                document.getElementById('show_loading_booking_airline').style.display = 'block';
                document.getElementById('show_loading_booking_airline').hidden = false;
                document.getElementById('payment_acq').hidden = true;
                hide_modal_waiting_transaction();
                document.getElementById("overlay-div-box").style.display = "none";
                $('.hold-seat-booking-train').prop('disabled', false);
                $('.hold-seat-booking-train').removeClass("running");
                airline_get_booking(airline_get_detail.result.response.order_number);
           },timeout: 300000
        });
}

function change_refund_price(id){
    document.getElementById(id).value = getrupiah(document.getElementById(id).value.split(',').join(''));
    grand_total = -pinalty_amount_with_admin_fee;
    for(i in pnr_refund_list){
        total = 0;
        for(j in pnr_refund_list[i]){
            if(document.getElementById(pnr_refund_list[i][j]+'_type').value == 'amount')
                total += parseInt(document.getElementById(pnr_refund_list[i][j]).value.split(',').join(''))
        }

        grand_total += total;
        document.getElementById('total_'+i).innerHTML = currency + ' ' + getrupiah(total);
    }
    document.getElementById('grand_total_refund').innerHTML = currency + ' ' + getrupiah(grand_total);
//    console.log(obj);
//    console.log(id);
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
//        AMADEUS UPDATE REFUND BOOKING
//        var passengers = [];
//        $('.refund_pax:checkbox:checked').each(function( index ) {
//            //console.log( index + ": " + $('.refund_pax:checkbox:checked')[0].id );
//            passengers.push($('.refund_pax:checkbox:checked')[index].id);
//        });
//        var passengers_remarks = []
//        $('.refund_remarks:input').each(function( index ) {
//            console.log(index);
//            passengers_remarks.push({
//                "value": $('.refund_remarks:input')[index].value,
//                "id": $('.refund_remarks:input')[index].id
//            });
//        });
//        var list_price_refund = [];
//        var provider = [];
//        for(i in airline_refund_response.provider_bookings){
//            if(provider.includes(airline_refund_response.provider_bookings[i].pnr)==false)
//                provider.push(airline_refund_response.provider_bookings[i].provider);
//            for(j in airline_refund_response.provider_bookings[i].passengers){
//                for(k in airline_refund_response.provider_bookings[i].passengers[j].fees){
//                    if(airline_refund_response.provider_bookings[i].passengers[j].fees[k].fee_type == 'RF'){
//                        list_price_refund.push(airline_refund_response.provider_bookings[i].passengers[j].fees[k])
//                        list_price_refund[list_price_refund.length-1].pnr = airline_refund_response.provider_bookings[i].pnr;
//                        list_price_refund[list_price_refund.length-1].sequence = airline_refund_response.provider_bookings[i].passengers[j].sequence;
//                        list_price_refund[list_price_refund.length-1].first_name = airline_refund_response.provider_bookings[i].passengers[j].first_name;
//                        list_price_refund[list_price_refund.length-1].last_name = airline_refund_response.provider_bookings[i].passengers[j].last_name;
//                    }
//                }
//            }
//        }
//        total = 0;
//        for(i in pnr_refund_list){
//            for(j in pnr_refund_list[i]){
//                total = parseInt(document.getElementById(pnr_refund_list[i][j]).value.split(',').join(''));
//                name = pnr_refund_list[i][j];
//                for(k in list_price_refund){
//                    if(name.split('_')[0] == list_price_refund[k].first_name && name.split('_')[1] == list_price_refund[k].last_name && i == list_price_refund[k].pnr && name.split('_')[2] == list_price_refund[k].fee_name){
//                        for(l in list_price_refund[k].service_charges){
//                            if(name.split('_')[3] == list_price_refund[k].service_charges[l].charge_type && name.split('_')[4] == list_price_refund[k].service_charges[l].sequence){
//                                list_price_refund[k].service_charges[l].amount = total;
//                                break;
//                            }
//                        }
//                        break;
//                    }
//                }
//            }
//        }
//
//        $.ajax({
//           type: "POST",
//           url: "/webservice/airline",
//           headers:{
//                'action': 'update_refund_booking',
//           },
//           data: {
//               'order_number': airline_get_detail.result.response.order_number,
//               'signature': signature,
//               'passengers': JSON.stringify(passengers),
//               'list_price_refund': JSON.stringify(list_price_refund),
//               'provider': JSON.stringify(provider),
//               'remarks': JSON.stringify(passengers_remarks)
//           },
//           success: function(msg) {
//               console.log(msg);
//               if(msg.result.error_code == 0){
//                   cancel_reservation_airline();
//               }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
//                    auto_logout();
//               }else{
//                    Swal.fire({
//                      type: 'error',
//                      title: 'Oops!',
//                      html: '<span style="color: #ff9900;">Error airline cancel </span>' + msg.result.error_msg,
//                    })
//                    price_arr_repricing = {};
//                    pax_type_repricing = [];
//                    document.getElementById('show_loading_booking_airline').hidden = false;
//                    document.getElementById('airline_booking').innerHTML = '';
//                    document.getElementById('airline_detail').innerHTML = '';
//                    document.getElementById('payment_acq').innerHTML = '';
//                    document.getElementById('show_loading_booking_airline').style.display = 'block';
//                    document.getElementById('show_loading_booking_airline').hidden = false;
//                    document.getElementById('payment_acq').hidden = true;
//
//                    hide_modal_waiting_transaction();
//                    document.getElementById("overlay-div-box").style.display = "none";
//
//                    $('.hold-seat-booking-train').prop('disabled', false);
//                    $('.hold-seat-booking-train').removeClass("running");
//                    airline_get_booking_refund(airline_get_detail.result.response.order_number);
//               }
//           },
//           error: function(XMLHttpRequest, textStatus, errorThrown) {
//                error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error airline issued');
//                price_arr_repricing = {};
//                pax_type_repricing = [];
//                document.getElementById('show_loading_booking_airline').hidden = false;
//                document.getElementById('airline_booking').innerHTML = '';
//                document.getElementById('airline_detail').innerHTML = '';
//                document.getElementById('payment_acq').innerHTML = '';
//                document.getElementById('show_loading_booking_airline').style.display = 'block';
//                document.getElementById('show_loading_booking_airline').hidden = false;
//                document.getElementById('payment_acq').hidden = true;
//                hide_modal_waiting_transaction();
//                document.getElementById("overlay-div-box").style.display = "none";
//                $('.hold-seat-booking-train').prop('disabled', false);
//                $('.hold-seat-booking-train').removeClass("running");
//                airline_get_booking(airline_get_detail.result.response.order_number);
//           },timeout: 300000
//        });
            cancel_reservation_airline();
      }
    })
}

function cancel_reservation_airline(){
    var passengers = [];
    $('.refund_pax:checkbox:checked').each(function( index ) {
        //console.log( index + ": " + $('.refund_pax:checkbox:checked')[0].id );
        passengers.push($('.refund_pax:checkbox:checked')[index].id);
    });
    $.ajax({
           type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'cancel',
       },
       data: {
           'order_number': airline_get_detail.result.response.order_number,
           'signature': signature,
           'passengers': JSON.stringify(passengers),
       },
       success: function(msg) {
           if(msg.result.error_code == 0){
               //update ticket
               window.location = "/airline/booking/" + btoa(airline_get_detail.result.response.order_number);
               document.getElementById('airline_reissue_div').innerHTML = '';
               price_arr_repricing = {};
               pax_type_repricing = [];
               hide_modal_waiting_transaction();
               document.getElementById('show_loading_booking_airline').hidden = false;
               document.getElementById('airline_booking').innerHTML = '';
               document.getElementById('airline_detail').innerHTML = '';
               document.getElementById('payment_acq').innerHTML = '';
               document.getElementById('show_loading_booking_airline').style.display = 'block';
               document.getElementById('show_loading_booking_airline').hidden = false;
               document.getElementById('payment_acq').hidden = true;
               document.getElementById("overlay-div-box").style.display = "none";
               $(".issued_booking_btn").remove();
               //airline_get_booking_refund(airline_get_detail.result.response.order_number);
           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
           }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error airline cancel </span>' + msg.result.error_msg,
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

                hide_modal_waiting_transaction();
                document.getElementById("overlay-div-box").style.display = "none";

                $('.hold-seat-booking-train').prop('disabled', false);
                $('.hold-seat-booking-train').removeClass("running");
                if(window.location.href.split('/').length == 7)
                    airline_get_booking_refund(airline_get_detail.result.response.order_number);
                else if(window.location.href.split('/').length == 6)
                    airline_get_booking(airline_get_detail.result.response.order_number);
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error airline reissued');
            price_arr_repricing = {};
            pax_type_repricing = [];
            document.getElementById('show_loading_booking_airline').hidden = false;
            document.getElementById('airline_booking').innerHTML = '';
            document.getElementById('airline_detail').innerHTML = '';
            document.getElementById('payment_acq').innerHTML = '';
            document.getElementById('show_loading_booking_airline').style.display = 'block';
            document.getElementById('show_loading_booking_airline').hidden = false;
            document.getElementById('payment_acq').hidden = true;
            hide_modal_waiting_transaction();
            document.getElementById("overlay-div-box").style.display = "none";
            $('.hold-seat-booking-train').prop('disabled', false);
            $('.hold-seat-booking-train').removeClass("running");
            airline_get_booking_refund(airline_get_detail.result.response.order_number);
       },timeout: 300000
    });
}

function airline_issued(data){
    var temp_data = {}
    if(typeof(airline_get_detail) !== 'undefined')
        temp_data = JSON.stringify(airline_get_detail)
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
           url: "/webservice/airline",
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
               if(google_analytics != '')
                   gtag('event', 'airline_issued', {});
               if(msg.result.error_code == 0){
                   try{
                       if(msg.result.response.state == 'issued')
                            try{
                               if(msg.result.response.state == 'issued')
                                    print_success_issued();
                               else
                                    print_fail_issued();
                            }catch(err){
                                console.log(err); // error kalau ada element yg tidak ada
                            }
                       else
                            print_fail_issued();
                   }catch(err){
                    console.log(err); // error kalau ada element yg tidak ada
                   }

                   if(document.URL.split('/')[document.URL.split('/').length-1] == 'payment'){
                        window.location.href = '/airline/booking/' + btoa(data);
                   }else{
                       //update ticket
                       price_arr_repricing = {};
                       pax_type_repricing = [];
                       hide_modal_waiting_transaction();
                       document.getElementById('show_loading_booking_airline').hidden = false;
                       document.getElementById('airline_booking').innerHTML = '';
                       document.getElementById('airline_detail').innerHTML = '';
                       document.getElementById('payment_acq').innerHTML = '';
                       document.getElementById('ssr_request_after_sales').hidden = true;
                       document.getElementById('show_loading_booking_airline').style.display = 'block';
                       document.getElementById('show_loading_booking_airline').hidden = false;
                       document.getElementById('reissued').hidden = true;
                       document.getElementById('cancel').hidden = true;
                       document.getElementById('payment_acq').hidden = true;
                       document.getElementById("overlay-div-box").style.display = "none";
                       $(".issued_booking_btn").hide(); //kalau error masih keluar button awal remove ivan
                       airline_get_booking(data);
                   }
               }else if(msg.result.error_code == 1009){
                   price_arr_repricing = {};
                   pax_type_repricing = [];
                   hide_modal_waiting_transaction();
                   document.getElementById('show_loading_booking_airline').hidden = false;
                   document.getElementById('airline_booking').innerHTML = '';
                   document.getElementById('airline_detail').innerHTML = '';
                   document.getElementById('payment_acq').innerHTML = '';
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
                      html: '<span style="color: #ff9900;">Error airline issued </span>' + msg.result.error_msg,
                    }).then((result) => {
                      if (result.value) {
                        hide_modal_waiting_transaction();
                      }
                    })
                    hide_modal_waiting_transaction();
                    document.getElementById("overlay-div-box").style.display = "none";

                    $('.hold-seat-booking-train').prop('disabled', false);
                    $('.hold-seat-booking-train').removeClass("running");
                    airline_get_booking(data);
               }else if(msg.result.error_code == 4006){
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: #ff9900;">Error airline issued </span>' + msg.result.error_msg,
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
                    for(i in airline_get_detail.result.response.passengers[0].sale_service_charges){
                        text+=`
                        <div style="text-align:center">
                            `+i+`
                        </div>`;
                        for(j in airline_get_detail.result.response.passengers){
                            price = {'FARE': 0, 'RAC': 0, 'ROC': 0, 'TAX':0 , 'currency': '', 'CSC': 0, 'SSR': 0, 'DISC': 0,'SEAT':0};
                            for(k in airline_get_detail.result.response.passengers[j].sale_service_charges[i]){
                                price[k] = airline_get_detail.result.response.passengers[j].sale_service_charges[i][k].amount;
                                if(price['currency'] == '')
                                    price['currency'] = airline_get_detail.result.response.passengers[j].sale_service_charges[i][k].currency;
                            }
                            try{
                                price['CSC'] = airline_get_detail.result.response.passengers[j].channel_service_charges.amount;
                            }catch(err){
                                console.log(err); // error kalau ada element yg tidak ada
                            }

                            text+=`<div class="row" style="margin-bottom:5px;">
                                <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                    <span style="font-size:12px;">`+airline_get_detail.result.response.passengers[j].name+` Fare
                                </div>
                                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                    <span style="font-size:13px;">`+price.currency+` `+getrupiah(parseInt(price.FARE))+`</span>
                                </div>
                            </div>
                            <div class="row" style="margin-bottom:5px;">
                                <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                    <span style="font-size:12px;">`+airline_get_detail.result.response.passengers[j].name+` Tax
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
                                        <span style="font-size:13px;">IDR `+getrupiah(parseInt(price.DISC))+`</span>
                                    </div>
                                </div>`;

                            total_price += parseInt(price.TAX + price.ROC + price.FARE + price.SSR + price.SEAT + price.DISC);
                            price_provider_show += parseInt(price.TAX + price.ROC + price.FARE + price.SSR + price.SEAT + price.DISC);
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

                    airline_get_detail = msg;
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
                                        <span style="font-size:13px;">IDR `+getrupiah(parseInt(price.DISC))+`</span>
                                    </div>
                                </div>`;

                            total_price += parseInt(price.TAX + price.ROC + price.FARE + price.SSR + price.SEAT + price.DISC);
                            price_provider_show += parseInt(price.TAX + price.ROC + price.FARE + price.SSR + price.SEAT + price.DISC);
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
                    if(msg.result.error_code != 1007){
                        Swal.fire({
                          type: 'error',
                          title: 'Oops!',
                          html: '<span style="color: #ff9900;">Error airline issued </span>' + msg.result.error_msg,
                        })
                    }else{
                        Swal.fire({
                          type: 'error',
                          title: 'Error airline issued '+ msg.result.error_msg,
                          showCancelButton: true,
                          cancelButtonText: 'Ok',
                          confirmButtonColor: '#f15a22',
                          cancelButtonColor: '#3085d6',
                          confirmButtonText: 'Top Up'
                        }).then((result) => {
                            console.log(result);
                            if (result.value) {
                                window.location.href = '/top_up';
                            }
                        })
                    }
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
                    airline_get_booking(data);
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
                airline_get_booking(data);
           },timeout: 300000
        });
      }
    })
}

function airline_request_issued(req_order_number){
    Swal.fire({
      title: 'Are you sure want to Request Issued for this booking?',
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
           url: "/webservice/content",
           headers:{
                'action': 'create_reservation_issued_request',
           },
           data: {
               'order_number': req_order_number,
               'table_name': 'airline',
               'signature': signature
           },
           success: function(msg) {
               if(msg.result.error_code == 0){
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
                    $(".issued_booking_btn").hide(); //kalau error masih keluar button awal remove ivan
                    window.location.href = '/reservation_request/' + btoa(msg.result.response.request_number);
               }
               else {
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: #ff9900;">Error airline request issued </span>' + msg.result.error_msg,
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
                    airline_get_booking(data);
                    $(".issued_booking_btn").hide();
               }
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error airline request issued');
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
                airline_get_booking(data);
           },timeout: 300000
        });
      }
    })
}

function update_service_charge(type){
    repricing_order_number = '';
    if(type == 'booking'){
        document.getElementById('airline_booking').innerHTML = '';
        upsell = []
        for(i in airline_get_detail.result.response.passengers){
            for(j in airline_get_detail.result.response.passengers[i].sale_service_charges){
                currency = airline_get_detail.result.response.passengers[i].sale_service_charges[j].FARE.currency;
            }
            list_price = []
            for(j in list){
                if(airline_get_detail.result.response.passengers[i].name == document.getElementById('selection_pax'+j).value){
                    list_price.push({
                        'amount': list[j],
                        'currency_code': currency
                    });
                }

            }
            upsell.push({
                'sequence': airline_get_detail.result.response.passengers[i].sequence,
                'pricing': JSON.parse(JSON.stringify(list_price))
            });
        }
        repricing_order_number = order_number;
    }else{
        upsell_price = 0;
        upsell = []
        counter_pax = -1;
        currency = airline_price[0].ADT.currency;
        for(i in passengers){
            list_price = []
            if(i != 'booker' && i != 'contact'){
                for(j in list){
                    for(k in passengers[i]){
                        if(passengers[i][k].first_name+passengers[i][k].last_name == document.getElementById('selection_pax'+j).value){
                            list_price.push({
                                'amount': list[j],
                                'currency_code': currency
                            });
                            upsell_price += list[j];
                        }
                    }
                }
                counter_pax++;
            }
            if(list_price.length != 0)
                upsell.push({
                    'sequence': counter_pax,
                    'pricing': JSON.parse(JSON.stringify(list_price))
                });
        }
    }
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
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
                try{
                    if(type == 'booking'){
                        please_wait_transaction();
                        airline_get_booking(repricing_order_number);
                        price_arr_repricing = {};
                        pax_type_repricing = [];
                    }else{
                        price_arr_repricing = {};
                        pax_type_repricing = [];
                        airline_detail('');
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
                  html: '<span style="color: #ff9900;">Error airline service charge </span>' + msg.result.error_msg,
                })
                $('.loader-rodextrip').fadeOut();
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error airline service charge');
            $('.loader-rodextrip').fadeOut();
       },timeout: 60000
    });

}


function update_insentif_booker(type){
    repricing_order_number = '';
    if(type == 'booking'){
        document.getElementById('airline_booking').innerHTML = '';
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
       url: "/webservice/airline",
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
                        airline_get_booking(repricing_order_number);
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
                  html: '<span style="color: #ff9900;">Error airline update booker insentif </span>' + msg.result.error_msg,
                })
                $('.loader-rodextrip').fadeOut();
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error airline update booker insentif');
            $('.loader-rodextrip').fadeOut();
       },timeout: 60000
    });

}


function show_commission(val){
    var sc = '';
    var scs = '';
    if(val == 'new'){
        sc = document.getElementById("show_commission_new");
        scs = document.getElementById("show_commission_button_new");
    }else if(val == 'commission'){
        var sc = document.getElementById("show_commission");
        var scs = document.getElementById("show_commission_button");
    }else{
        sc = document.getElementById("show_commission_old");
        scs = document.getElementById("show_commission_button_old");
    }
    if (sc.style.display === "none"){
        sc.style.display = "block";
        scs.value = "Hide Commission";
    }
    else{
        sc.style.display = "none";
        scs.value = "Show Commission";
    }
}

function gotoForm(){
    document.getElementById('airline_searchForm').submit();
}


function sell_ssrs_after_sales(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'sell_post_ssrs',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
           if(msg.result.error_code == 0){
                if(state == 'issued' || state == 'reissue' || state == 'rescheduled'){
                    get_payment_acq('Issued',booker_id, order_number, 'billing',signature,'airline_after_sales');
                    $('#show_loading_booking_airline').hide();
                    hide_modal_waiting_transaction();
                }else{
//                    update_booking_after_sales();
                    update_booking_after_sales_v2();
                }
           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
           }else{
                Swal.fire({
                  type: 'warning',
                  title: 'Error please try again!',
                }).then((result) => {
                  window.location = '/airline/booking/'+btoa(order_number);
                })
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error airline ssr after sales');
            $('.loader-rodextrip').fadeOut();
            $('.btn-next').removeClass('running');
            $('.btn-next').prop('disabled', false);
       },timeout: 300000
    });
}

function after_sales_next_btn(){
    text = 'Are you sure you want to change ';
    if(page == 'ssr')
        text+= 'SSR?';
    else if(page == 'seat')
        text+= 'Seat?';
    Swal.fire({
      title: text,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        show_loading();
        please_wait_transaction();
        if(page == 'ssr'){
//            sell_ssrs_after_sales();
            sell_ssrs_after_sales_v2();
        }else if(page == 'seat'){
//            assign_seats_after_sales();
            assign_seats_after_sales_v2();
        }
      }
    })

}

function assign_seats_after_sales(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'assign_post_seats',
       },
       data: {
            'signature': airline_signature,
            'booking': JSON.stringify(airline_get_detail)
       },
       success: function(msg) {
           if(msg.result.error_code == 0){
                if(state == 'issued' || state == 'reissue' || state == 'rescheduled'){
                    get_payment_acq('Issued',booker_id, order_number, 'billing',signature,'airline_after_sales');
                    $('#show_loading_booking_airline').hide();
                    hide_modal_waiting_transaction();
                }else{
//                    update_booking_after_sales();
                    update_booking_after_sales_v2();
                }
           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
           }else{
                Swal.fire({
                  type: 'warning',
                  title: 'Error please try again!',
                }).then((result) => {
                  window.location = '/airline/booking/'+btoa(order_number);
                })
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error airline seat after sales');
            $('.loader-rodextrip').fadeOut();
            $('.btn-next').removeClass('running');
            $('.btn-next').prop('disabled', false);
       },timeout: 300000
    });
}

function update_booking_after_sales(input_pax_seat = false){
    data = {};
    data['signature'] = signature;
    error_log = '';
    if($("[name='radio_payment_type']").val() != undefined){
        data['acquirer_seq_id'] = payment_acq2[payment_method][selected].acquirer_seq_id;
        data['member'] = payment_acq2[payment_method][selected].method;
    }
    pax_seat = {};
    try{
        if(passengers != undefined && input_pax_seat == true)
            data['pax_seat'] = JSON.stringify(passengers);
    }catch(err){
        console.log(err); // error kalau ada element yg tidak ada
    }
    try{
        data['booking'] = JSON.stringify(airline_get_detail)
    }catch(err){
        console.log(err); // error kalau ada element yg tidak ada
    }
    if(error_log == ''){
        getToken();
        show_loading();
        please_wait_transaction();
        $.ajax({
           type: "POST",
           url: "/webservice/airline",
           headers:{
                'action': 'update_booking'
           },
           data: data,
           success: function(msg) {
               hide_modal_waiting_transaction();
               document.getElementById('show_loading_booking_airline').hidden = false;
               try{
                    document.getElementById('airline_reissue_div').innerHTML = '';
               }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
               }
               if(msg.result.error_code == 0){
                    window.location = '/airline/booking/' + btoa(msg.result.response.order_number);
               }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                    auto_logout();
               }else{
                    Swal.fire({
                      type: 'warning',
                      title: 'Error '+msg.result.error_msg+'!',
                    }).then((result) => {
                      window.location = '/airline/booking/'+btoa(order_number);
                    })
               }
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error airline update booking');
                window.location = '/airline/booking/'+btoa(order_number);
                $('.loader-rodextrip').fadeOut();
                $('.btn-next').removeClass('running');
                $('.btn-next').prop('disabled', false);
           },timeout: 300000
        });
    }else{
        Swal.fire({
          type: 'error',
          title: 'Oops!',
          html: '<span style="color: red;">'+error_log+' </span>',
        })
        window.location = '/airline/booking/'+btoa(order_number);
    }
}

function delete_reissue(val){
    document.getElementById(val).remove();
}

function reroute_btn(){
    text = '';
    flight = 1;
    cabin_class = 1;
    for(i in airline_get_detail.result.response.provider_bookings){
        text += `<div id="reissue_`+i+`">`;
            text += `<input type='hidden' id="pnr`+i+`" value=`+airline_get_detail.result.response.provider_bookings[i].pnr+`>`;
//            text += `<div class="row">
//                       <div class="col-lg-10 col-xs-10">`;
//                text+=`</div>
//                       <div class="col-lg-2 col-xs-2">
//                        <label onclick="delete_reissue('reissue_`+i+`')">X</label>
//                       </div>
//                   </div>`;
        for(j in airline_get_detail.result.response.provider_bookings[i].journeys){
            if(moment() < moment(airline_get_detail.result.response.provider_bookings[i].journeys[j].departure_date)){
                text += `<div id="reissue_`+i+`_journey`+j+`">`;
                text += `<div class="row">
                           <div class="col-lg-10 col-xs-10">`;
                    text+=`</div>
                           <div class="col-lg-2 col-xs-2">
                            <label onclick="delete_reissue('reissue_`+i+`_journey`+j+`')" style="font-size:18px; color:red;"><i class="fas fa-times"></i></label>
                           </div>
                       </div>`;
                for(k in airline_get_detail.result.response.provider_bookings[i].journeys[j].segments){
                    //kasih silang kasih reset
                    text+=`<h5>`+airline_get_detail.result.response.provider_bookings[i].journeys[j].segments[k].carrier_name+' '+airline_get_detail.result.response.provider_bookings[i].journeys[j].segments[k].carrier_number+`</h5>`;
                    text+=`
                            <div class="row">
                                <div class="col-lg-12">`;
                                try{
                                text+=`
                                    <img data-toggle="tooltip" style="width:50px; height:50px;" alt="`+airline_carriers[airline_get_detail.result.response.provider_bookings[i].journeys[j].segments[k].carrier_code].name+`" title="`+airline_carriers[airline_get_detail.result.response.provider_bookings[i].journeys[j].segments[k].carrier_code].name+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+airline_get_detail.result.response.provider_bookings[i].journeys[j].segments[k].carrier_code+`.png"/>`;
                                }catch(err){
                                text+=`
                                    <img data-toggle="tooltip" style="width:50px; height:50px;" alt="`+airline_get_detail.result.response.provider_bookings[i].journeys[j].segments[k].carrier_code+`" title="`+airline_get_detail.result.response.provider_bookings[i].journeys[j].segments[k].carrier_code+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+airline_get_detail.result.response.provider_bookings[i].journeys[j].segments[k].carrier_code+`.png"/>`;
                                }
                                text +=`
                                </div>
                            </div>`;
                }
                text+=`<div class="row">
                        <div class="col-lg-12 col-xs-12">
                            <span class="span-search-ticket"><i class="fas fa-plane-departure"></i> From</span>
                            <div class="input-container-search-ticket">
                                <div class="form-select">
                                    <input id="origin_id_flight`+flight+`" name="origin_id_flight`+flight+`" class="form-control" type="text" placeholder="Origin" style="width:100%;max-width:600px;outline:0" autocomplete="off" value="" onfocus="document.getElementById('origin_id_flight`+flight+`').select();" onclick="set_airline_search_value_to_false();">

                                </div>
                            </div>
                        </div>

                        <div class="col-lg-12 col-xs-12">
                            <span class="span-search-ticket"><i class="fas fa-plane-departure"></i> Destination</span>
                            <div class="input-container-search-ticket">
                                <div class="form-select">
                                    <input id="destination_id_flight`+flight+`" name="destination_id_flight`+flight+`" class="form-control" type="text" placeholder="Destination" style="width:100%;max-width:600px;outline:0" autocomplete="off" value="" onfocus="document.getElementById('destination_id_flight`+flight+`').select();" onclick="set_airline_search_value_to_false();">

                                </div>
                            </div>
                        </div>
                        <div class="col-lg-12 banner-right">
                            <div class="form-wrap" style="padding:10px 0px 0px 0px;">
                                <input type="text" style="background:white;margin-top:5px;" class="form-control" name="airline_departure" id="airline_departure`+flight+`" placeholder="Departure Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date '" autocomplete="off" readonly>
                            </div>
                        </div>
                    </div>
                </div>`;
            }
            flight++;
        }
        text+=`</div>`;
        text+=`
            <div class="row">
                <div class="col-lg-12">
                    <div class="form-select">
                        <select id="cabin_class_flight`+cabin_class+`" name="cabin_class_flight`+cabin_class+`" class="nice-select-default reissued-class-airline">
                            <option value="Y" selected="">Economy</option>`;
        if(airline_get_detail.result.response.provider_bookings[i].journeys[j].segments[0].carrier_code == 'QG')
            text +=`
                            <option value="W">Royal Green</option>`;
        else
            text +=`
                            <option value="W">Premium Economy</option>`;
        text +=`
                            <option value="C">Business</option>
                            <option value="F">First Class</option>
                        </select>
                    </div>
                </div>
            </div>`;
        cabin_class++;
    }
    document.getElementById('reissue_div').innerHTML = text;
    $('.reissued-class-airline').niceSelect();
    counter_airline = 1;
    for(i in airline_get_detail.result.response.provider_bookings){
        for(j in airline_get_detail.result.response.provider_bookings[i].journeys){
            $('input[id="airline_departure'+counter_airline+'"]').daterangepicker({
                  singleDatePicker: true,
                  autoUpdateInput: true,
                  autoApply: true,
                  startDate: moment(airline_get_detail.result.response.provider_bookings[i].journeys[j].departure_date.split('  ')[0]),
                  minDate: moment(),
                  maxDate: moment().subtract(-1, 'years'),
                  showDropdowns: true,
                  opens: 'center',
                  locale: {
                      format: 'DD MMM YYYY',
                  }
            }, function(start, end, label) {
                document.getElementById(this.element.context.id).value = moment(start._d).format('DD MMM YYYY');
                check_next_date_journey_reissue();
            });

            var airline_origin = new autoComplete({
                selector: '#origin_id_flight'+counter_airline,
                minChars: 1,
                cache: false,
                delay:0,
                source: function(term, suggest){
                    if(term.split(' - ').length == 4)
                            term = ''
                    if(term.length > 1)
                        suggest(airline_search_autocomplete(term));
                },
                onSelect: function(e, term, item){
                    setTimeout(function(){
                        $("#destination_id_flight"+counter_airline).focus();
                    }, 200);
                    set_airline_search_value_to_true();
                }
            });
            document.getElementById('origin_id_flight'+counter_airline).value = airline_get_detail.result.response.provider_bookings[i].journeys[j].origin+` - `+airline_get_detail.result.response.provider_bookings[i].journeys[j].origin_city+` - `+airline_get_detail.result.response.provider_bookings[i].journeys[j].origin_country+` - `+airline_get_detail.result.response.provider_bookings[i].journeys[j].origin_name;
            var airline_destination = new autoComplete({
                selector: '#destination_id_flight'+counter_airline,
                minChars: 0,
                cache: false,
                delay:0,
                source: function(term, suggest){
                    if(term.split(' - ').length == 4)
                        term = ''
                    if(term.length > 1)
                        suggest(airline_search_autocomplete(term));
                },
                onSelect: function(e, term, item){
                    setTimeout(function(){
                        $("#airline_departure"+parseInt(counter_airline+1)).focus();
                        $("#airline_departure_return").focus();
                    }, 200);
                    set_airline_search_value_to_true();
                }
            });
            document.getElementById('destination_id_flight'+counter_airline).value = airline_get_detail.result.response.provider_bookings[i].journeys[j].destination+` - `+airline_get_detail.result.response.provider_bookings[i].journeys[j].destination_city+` - `+airline_get_detail.result.response.provider_bookings[i].journeys[j].destination_country+` - `+airline_get_detail.result.response.provider_bookings[i].journeys[j].destination_name;

            counter_airline++;
        }
    }
}

function reissued_btn(){
    text = '';
    flight = 1;
    cabin_class = 1;
    if(airline_get_detail.result.response.state == 'booked')
    text += `
            <h5>Change Booking</h5>`;
    else
    text+=`
            <h5>Reissue</h5>`;
    text+=`
            <div class="col-lg-12" style="margin-top:10px;">
                <input class="primary-btn-ticket" style="width:100%;" type="button" onclick="reissued_btn();" value="Reset">
            </div><hr/>`;
    if(is_reroute){
        text+= `
            <div class="col-lg-12" style="margin-top:10px;">
                <input class="primary-btn-ticket" style="width:100%;" type="button" onclick="reroute_btn();" value="Reroute">
            </div>`;
    }
    text += `<div id="reissue_div">`;
    for(i in airline_get_detail.result.response.provider_bookings){
        text += `<div id="reissue_`+i+`">`;
            text += `<input type='hidden' id="pnr`+i+`" value=`+airline_get_detail.result.response.provider_bookings[i].pnr+`>`;
//            text += `<div class="row">
//                       <div class="col-lg-10 col-xs-10">`;
//                text+=`</div>
//                       <div class="col-lg-2 col-xs-2">
//                        <label onclick="delete_reissue('reissue_`+i+`')">X</label>
//                       </div>
//                   </div>`;
        for(j in airline_get_detail.result.response.provider_bookings[i].journeys){
            if(moment() < moment(airline_get_detail.result.response.provider_bookings[i].journeys[j].departure_date)){
                text += `<div id="reissue_`+i+`_journey`+j+`">`;
                text += `<div class="row">
                           <div class="col-lg-10 col-xs-10">`;
                    text+=`</div>
                           <div class="col-lg-2 col-xs-2">
                            <label onclick="delete_reissue('reissue_`+i+`_journey`+j+`')" style="font-size:18px; color:red;"><i class="fas fa-times"></i></label>
                           </div>
                       </div>`;
                for(k in airline_get_detail.result.response.provider_bookings[i].journeys[j].segments){
                    //kasih silang kasih reset
                    text+=`<h5>`+airline_get_detail.result.response.provider_bookings[i].journeys[j].segments[k].carrier_name+' '+airline_get_detail.result.response.provider_bookings[i].journeys[j].segments[k].carrier_number+`</h5>`;
                    text+=`
                            <div class="row">
                                <div class="col-lg-12">`;
                                try{
                                text+=`
                                    <img data-toggle="tooltip" style="width:50px; height:50px;" alt="`+airline_carriers[airline_get_detail.result.response.provider_bookings[i].journeys[j].segments[k].carrier_code].name+`" title="`+airline_carriers[airline_get_detail.result.response.provider_bookings[i].journeys[j].segments[k].carrier_code].name+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+airline_get_detail.result.response.provider_bookings[i].journeys[j].segments[k].carrier_code+`.png"/>`;
                                }catch(err){
                                text+=`
                                    <img data-toggle="tooltip" style="width:50px; height:50px;" alt="`+airline_get_detail.result.response.provider_bookings[i].journeys[j].segments[k].carrier_code+`" title="`+airline_get_detail.result.response.provider_bookings[i].journeys[j].segments[k].carrier_code+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+airline_get_detail.result.response.provider_bookings[i].journeys[j].segments[k].carrier_code+`.png"/>`;
                                }
                                text +=`
                                </div>
                            </div>`;
                }
                text+=`<div class="row">
                        <div class="col-lg-6 col-xs-6">
                            <table style="width:100%">
                                <tr>
                                    <td><h5>`+airline_get_detail.result.response.provider_bookings[i].journeys[j].departure_date.split('  ')[1]+`</h5></td>
                                    <td style="padding-left:15px;">
                                        <img src="/static/tt_website_rodextrip/img/icon/airlines-01.png" alt="Airline" style="width:20px; height:20px;"/>
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
                            <span>`+airline_get_detail.result.response.provider_bookings[i].journeys[j].departure_date.split('  ')[0]+`</span><br/>
                            <span style="font-weight:500;">`+airline_get_detail.result.response.provider_bookings[i].journeys[j].origin_name+` - `+airline_get_detail.result.response.provider_bookings[i].journeys[j].origin_city+` (`+airline_get_detail.result.response.provider_bookings[i].journeys[j].origin+`)</span>
                        </div>

                        <div class="col-lg-6 col-xs-6" style="padding:0;">
                            <table style="width:100%; margin-bottom:6px;">
                                <tr>
                                    <td><h5>`+airline_get_detail.result.response.provider_bookings[i].journeys[j].arrival_date.split('  ')[1]+`</h5></td>
                                    <td></td>
                                    <td style="height:30px;padding:0 15px;width:100%"></td>
                                </tr>
                            </table>
                            <span>`+airline_get_detail.result.response.provider_bookings[i].journeys[j].arrival_date.split('  ')[0]+`</span><br/>
                            <span style="font-weight:500;">`+airline_get_detail.result.response.provider_bookings[i].journeys[j].destination_name+` - `+airline_get_detail.result.response.provider_bookings[i].journeys[j].destination_city+` (`+airline_get_detail.result.response.provider_bookings[i].journeys[j].destination+`)</span>
                        </div>
                    <div class="col-lg-12 banner-right">
                        <div class="form-wrap" style="padding:10px 0px 0px 0px;">
                            <input type="text" style="background:white;margin-top:5px;" class="form-control" name="airline_departure" id="airline_departure`+flight+`" placeholder="Departure Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date '" autocomplete="off" readonly>
                        </div>
                    </div>
                </div>
            </div>`;
                flight++;
            }
        }
        text+=`</div>`;
        text+=`
            <div class="row">
                <div class="col-lg-12">
                    <div class="form-select">
                        <select id="cabin_class_flight`+cabin_class+`" name="cabin_class_flight`+cabin_class+`" class="nice-select-default reissued-class-airline">
                            <option value="Y" selected="">Economy</option>`;
        if(airline_get_detail.result.response.provider_bookings[i].journeys[j].segments[0].carrier_code == 'QG')
            text +=`
                            <option value="W">Royal Green</option>`;
        else
            text +=`
                            <option value="W">Premium Economy</option>`;
        text +=`
                            <option value="C">Business</option>
                            <option value="F">First Class</option>
                        </select>
                    </div>
                </div>
            </div>`;
        cabin_class++;
    }
    text += `</div>`;
    text+=`
        <div class="col-lg-12 mt-2 mb-3" style="padding:0px;">
            <!--<input class="primary-btn-ticket" style="width:100%;" type="button" onclick="airline_reissued();" value="Request Reissued">--!>
            <button class="primary-btn-ticket" id="reissued_req_btn" style="width:100%;" type="button" onclick="airline_get_reschedule_availability_v2();">
                Request Reissued
            </button>
        </div>
    </div>`;
    document.getElementById('reissued').innerHTML = text;
    $('.reissued-class-airline').niceSelect();
    airline_date = airline_get_detail.result.response.provider_bookings[0].departure_date.split(' ')[0];
    counter_airline = 1;
    for(i in airline_get_detail.result.response.provider_bookings){
        for(j in airline_get_detail.result.response.provider_bookings[i].journeys){
            $('input[id="airline_departure'+counter_airline+'"]').daterangepicker({
                  singleDatePicker: true,
                  autoUpdateInput: true,
                  autoApply: true,
                  startDate: moment(airline_get_detail.result.response.provider_bookings[i].journeys[j].departure_date.split('  ')[0]),
                  minDate: moment(),
                  maxDate: moment().subtract(-1, 'years'),
                  showDropdowns: true,
                  opens: 'center',
                  locale: {
                      format: 'DD MMM YYYY',
                  }
            }, function(start, end, label) {
                document.getElementById(this.element.context.id).value = moment(start._d).format('DD MMM YYYY');
                check_next_date_journey_reissue();
            });

            counter_airline++;
        }
    }
}

function check_next_date_journey_reissue(){
    counter_airline = 1;
    min_date = '';
    for(i in airline_get_detail.result.response.provider_bookings){
        for(j in airline_get_detail.result.response.provider_bookings[i].journeys){
            if(min_date == '')
                min_date = moment();
            if(moment(min_date) > moment($('input[id="airline_departure'+counter_airline+'"]').val()))
                select_date = min_date;
            else
                select_date = moment($('input[id="airline_departure'+counter_airline+'"]').val());
            $('input[id="airline_departure'+counter_airline+'"]').daterangepicker({
                  singleDatePicker: true,
                  autoUpdateInput: true,
                  startDate: select_date,
                  minDate: min_date,
                  maxDate: moment().subtract(-1, 'years'),
                  showDropdowns: true,
                  opens: 'center',
                  locale: {
                      format: 'DD MMM YYYY',
                  }
            }, function(start, end, label) {
                document.getElementById(this.element.context.id).value = moment(start._d).format('DD MMM YYYY');
                check_next_date_journey_reissue();
            });
            min_date = $('input[id="airline_departure'+counter_airline+'"]').val();
            counter_airline++;
        }
    }
}

function airline_reissued(){
    flight = 1;
    cabin_class = 1;
    provider_list = [];
    journey_list = [];
    cabin_class_flight = 1;
    pnr_list = []
    for(i in airline_get_detail.result.response.provider_bookings){
        for(j in airline_get_detail.result.response.provider_bookings[i].journeys){
            if(moment() < moment(airline_get_detail.result.response.provider_bookings[i].journeys[j].departure_date)){
                try{
                    journey_list.push({
                        "origin": airline_get_detail.result.response.provider_bookings[i].journeys[j].origin,
                        "destination": airline_get_detail.result.response.provider_bookings[i].journeys[j].destination,
                        "departure_date": document.getElementById('airline_departure'+ flight).value,
                    });
                }catch(err){
                    console.log(err); // error kalau ada element yg tidak ada
                }
                flight++;
            }
        }
        if(journey_list.length > 0){
            provider_list.push({
                "pnr": airline_get_detail.result.response.provider_bookings[i].pnr,
                "schedule_id": i,
                "journeys":  journey_list,
                "cabin_class": document.getElementById('cabin_class_flight'+ cabin_class).value
            });
            pnr_list.push(airline_get_detail.result.response.provider_bookings[i].pnr)
        }
        cabin_class++;
        journey_list = [];
    }
    try{
        document.getElementById('voucher_discount').hidden = true;
    }catch(err){
        console.log(err); // error kalau ada element yg tidak ada
    }
    document.getElementById('reissued').hidden = true;
    if(airline_get_detail.result.response.state == 'booked')
        try{
            document.getElementById('issued_btn_airline').hidden = true;
        }catch(err){
            console.log(err); // error kalau ada element yg tidak ada
        }

    getToken();
    show_loading();
    please_wait_transaction();
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'reissue',
       },
//       url: "{% url 'tt_backend_rodextrip:social_media_tree_update' %}",
       data: {
            'data':JSON.stringify(provider_list),
            'signature': signature,
            'booking': JSON.stringify(airline_get_detail)
       },
       success: function(msg) {
           hide_modal_waiting_transaction();
           document.getElementById('show_loading_booking_airline').hidden = false;
           if(msg.result.error_code == 0){
                document.getElementById('airline_booking').innerHTML = '';
                document.getElementById('show_loading_booking_airline').style.display = 'block';
                document.getElementById('show_loading_booking_airline').hidden = false;
                document.getElementById('airline_detail').innerHTML = '';
                document.getElementById('ssr_request_after_sales').hidden = true;

                document.getElementById('reissued').innerHTML = `<input class="primary-btn-white" style="width:100%;" type="button" onclick="show_loading();please_wait_transaction();airline_get_booking('`+airline_get_detail.result.response.order_number+`')" value="Cancel Reissued">`;
                flight_select = 0;
                datareissue2(msg.result.response.reschedule_availability_provider);
           }else{
                Swal.fire({
                   type: 'error',
                   title: 'Oops!',
                   html: '<span style="color: red;">Error reissued </span>' + msg.result.error_msg,
                }).then((result) => {
                  if (result.value) {
                    hide_modal_waiting_transaction();
                  }
                })
                airline_get_booking(airline_get_detail.result.response.order_number);
                $('.loader-rodextrip').fadeOut();
                hide_modal_waiting_transaction();
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error airline reissued');
            $("#show_loading_booking_airline").hide();
            $("#show_error_booking_airline").show();
            hide_modal_waiting_transaction();
            $('.loader-rodextrip').fadeOut();
       },timeout: 300000
    });
}

function datareissue2(airline){
   var counter = 0;
   data = [];
   flight_select = 0;
   full_data = airline
   recommendations_airline = [];
   airline_recommendations_list = [];
   airline_recommendations_journey = [];
   airline_recommendations_combo_list = [];
   for(i in airline){
       for(j in airline[i].recommendations){
            recommendations_airline.push(airline[i].recommendations[j]);
       }
       for(j in airline[i].schedules){
            airline_pick_sequence = 0;
            found = false;
            for(k in provider_list){
                for(l in provider_list[k].journeys){
                    airline_pick_sequence++;
                    if(moment(airline[i].schedules[j].departure_date).format('DD MMM YYYY') == provider_list[k].journeys[l].departure_date &&
                       airline[i].schedules[j].destination == provider_list[k].journeys[l].destination &&
                       airline[i].schedules[j].origin == provider_list[k].journeys[l].origin){
                       found = true;
                       break;
                    }
                }
                if(found == true)
                    break;
            }
            for(k in airline[i].schedules[j].journeys){
                fare_details = [];
                try{
                   airline[i].schedules[j].journeys[k].sequence = counter;
                   airline[i].schedules[j].journeys[k].airline_pick_sequence = airline_pick_sequence;
                   available_count = 100;
                   price = 0;
                   currency = '';
                   airline[i].schedules[j].journeys[k].operated_by = true;
                   can_book = true;
                   if(airline[i].schedules[j].journeys[k].hasOwnProperty('is_vtl_flight') && airline[i].schedules[j].journeys[k].is_vtl_flight == true){
                        //flight VTL hardcode dari frontend
                        airline[i].schedules[j].journeys[k].search_banner.push({
                            "active": true,
                            "banner_color": "#f15a22",
                            "description": '',
                            "name": "VTL Flight",
                            "text_color": "#ffffff"
                        })
                   }
                   for(l in airline[i].schedules[j].journeys[k].segments){
                       if(airline[i].schedules[j].journeys[k].segments[l].fares.length == 0)
                            can_book = false;
                       for(m in airline[i].schedules[j].journeys[k].segments[l].fares){
                           airline[i].schedules[j].journeys[k].segments[l].fare_pick = 0;
                           for(n in airline[i].schedules[j].journeys[k].segments[l].fares[m].fare_details){
                                add_fare_detail = true;
                                for(o in fare_details){
                                    if(fare_details[o].amount == airline[i].schedules[j].journeys[k].segments[l].fares[m].fare_details[n].amount && fare_details[o].detail_type == airline[i].schedules[j].journeys[k].segments[l].fares[m].fare_details[n].detail_type){
                                        add_fare_detail = false;
                                    }
                                }
                                if(add_fare_detail)
                                    fare_details.push(airline[i].schedules[j].journeys[k].segments[l].fares[m].fare_details[n])
                           }
                           for(n in airline[i].schedules[j].journeys[k].segments[l].fares[m].service_charge_summary){
                               if(airline[i].schedules[j].journeys[k].segments[l].fares[m].service_charge_summary[n].pax_type == 'ADT'){
                                   for(o in airline[i].schedules[j].journeys[k].segments[l].fares[m].service_charge_summary[n].service_charges){
                                       if(airline[i].schedules[j].journeys[k].segments[l].fares[m].service_charge_summary[n].service_charges[o].charge_code != 'rac' && airline[i].schedules[j].journeys[k].segments[l].fares[m].service_charge_summary[n].service_charges[o].charge_code != 'rac1' && airline[i].schedules[j].journeys[k].segments[l].fares[m].service_charge_summary[n].service_charges[o].charge_code != 'rac2'){
                                           price += airline[i].schedules[j].journeys[k].segments[l].fares[m].service_charge_summary[n].service_charges[o].amount;
                                           if(currency == ''){
                                               currency = airline[i].schedules[j].journeys[k].segments[l].fares[m].service_charge_summary[n].service_charges[n].currency;
                                           }
                                       }
                                   }
                               }
                           }
                           break;
                       }

                       if(airline[i].schedules[j].journeys[k].segments[l].carrier_code == airline[i].schedules[j].journeys[k].segments[l].operating_airline_code && airline[i].schedules[j].journeys[k].operated_by != false){
                           airline[i].schedules[j].journeys[k].operated_by_carrier_code = airline[i].schedules[j].journeys[k].segments[l].operating_airline_code;
                       }else if(airline[i].schedules[j].journeys[k].segments[l].carrier_code != airline[i].schedules[j].journeys[k].segments[l].operating_airline_code){
                           airline[i].schedules[j].journeys[k].operated_by_carrier_code = airline[i].schedules[j].journeys[k].segments[l].operating_airline_code;
                           airline[i].schedules[j].journeys[k].operated_by = false;
                       }
                   }
                   airline[i].schedules[j].journeys[k].total_price = price;
                   if(available_count == 100)
                       available_count = 0;
                   airline[i].schedules[j].journeys[k].available_count = available_count;
                   airline[i].schedules[j].journeys[k].can_book = can_book;
                   airline[i].schedules[j].journeys[k].currency = currency;
                   airline[i].schedules[j].journeys[k].fare_details = fare_details;
                   data.push(airline[i].schedules[j].journeys[k]);
                   counter++;
                }catch(err){console.log(err);}
            }
       }
   }
   counter_search=1;
   airline_data = data;
   get_airline_recommendations_list();
   render_ticket_reissue();
//   $("#myModal_reissue").modal();
}

function render_ticket_reissue(){
    document.getElementById('show_loading_booking_airline').style.display = 'none';
    document.getElementById('show_loading_booking_airline').hidden = true;
    ticket_count = 0;
    airline = airline_data;
    var text= '';
    total_price_pick = 0;
    for(i in airline_pick_list){
        for(j in airline_pick_list[i].segments){
            for(k in airline_pick_list[i].segments[j].fares){
                if(parseInt(k) == airline_pick_list[i].segments[j].fare_pick){
                    for(l in airline_pick_list[i].segments[j].fares[k].service_charge_summary)
                        if(airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].pax_type == 'ADT'){
                            total_price_pick += airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].total_price / airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].pax_count;
                            break;
                        }
                    break;
                }
            }
        }
    }
    document.getElementById("airline_booking").innerHTML = '';
    if(airline_pick_list.length != airline_get_detail.result.response.provider_bookings.length + 1){
        for(i in airline){
           if(airline[i].airline_pick_sequence == counter_search){
               if(airline_pick_list.length == 0 || airline_pick_list.length != 0 && airline_recommendations_list.length == 0 && airline[i].journey_ref_id == '' || airline_recommendations_dict.hasOwnProperty(airline[i].journey_ref_id)){
                   check_flight_type = 1;
                   check_flight_departure = 0;
                   var price = 0;
                   text += `
                   <div class="search-box-result" id="journey`+i+`">
                       <span class="copy_journey" hidden>`+i+`</span>
                       <div class="row" style="padding:10px;">
                           <div class="col-xs-10">`;
                           if(airline[i].is_combo_price == true){
                                text+=`<label style="background:`+color+`; color:`+text_color+`;padding:5px 10px;">Combo Price</label>`;
                           }

                           //search banner
                           //counter_search-1
                           if(airline[i].hasOwnProperty('search_banner')){
                               for(banner_counter in airline[i].search_banner){
                                   var max_banner_date = moment().subtract(parseInt(-1*airline[i].search_banner[banner_counter].minimum_days), 'days').format('YYYY-MM-DD');
                                   var selected_banner_date = moment(airline[i].departure_date.split(' - ')[0]).format('YYYY-MM-DD');

                                   if(selected_banner_date >= max_banner_date){
                                       if(airline[i].search_banner[banner_counter].active == true){
                                           text+=`<label id="pop_search_banner`+i+``+banner_counter+`" class="copy_search_banner" style="background:`+airline[i].search_banner[banner_counter].banner_color+`; color:`+airline[i].search_banner[banner_counter].text_color+`;padding:5px 10px;">`+airline[i].search_banner[banner_counter].name+`</label>`;
                                       }
                                   }
                               }
                           }

                           text+=`
                           </div>

                           <div class="col-xs-2" style="padding:0px 10px 15px 15px;">
                               <label class="check_box_custom" style="float:right;">
                                   <span class="span-search-ticket"></span>
                                   <input type="checkbox" class="copy_result" name="copy_result`+i+`" id="copy_result`+i+`" onchange="checkboxCopyBoxReschedule(`+i+`);"/>
                                   <span class="check_box_span_custom"></span>
                               </label>
                               <span class="id_copy_result" hidden>`+i+`</span>
                           </div>`;
                           carrier_code_airline = [];
                           if(airline[i].is_combo_price == true){
                                check_flight_type = 3;
                                check_flight_departure = 0;
                                check_flight_return = 0;
                                for(j in airline[i].segments){
                                    flight_number = parseInt(j) + 1;
                                    text +=`
                                    <div class="col-lg-12" id="copy_div_airline`+i+``+j+`">
                                        <span class="copy_airline" hidden>`+i+``+j+`</span>
                                        <div class="row">
                                            <div class="col-lg-2" style="padding-top:10px;">
                                                <span class="copy_po" hidden>`+j+`</span>`;
                                                text+=`<div class="row"><div class="col-lg-12" id="copy_provider_operated`+i+``+j+`">`;
                                                if(j != 0){
                                                    text+=`<hr style="margin-top:unset; margin-bottom:unset;"/>`;
                                                }
                                                if(airline[i].segments[j].carrier_code != airline[i].segments[j].operating_airline_code){
                                                    try{
                                                        text += `<span class="copy_operated_by" style="float:left; font-weight: 700; font-size:12px;">Operated by `+airline_carriers[airline[i].segments[j].operating_airline_code].name+`</span><br/>`;

                                                    }catch(err){
                                                        text += `<span class="copy_operated_by" style="float:left; font-weight: 700; font-size:12px;">Operated by `+airline[i].segments[j].operating_airline_code+`</span><br/>`;
                                                    }
                                                }
                                                text+=`
                                                    <span class="copy_carrier_provider" style="font-weight:500; font-size:12px;">`+airline_carriers[0][airline[i].segments[j].carrier_code].name+`</span><br/>
                                                    <img data-toggle="tooltip" style="width:50px; height:50px;margin-bottom:5px;" alt="`+airline_carriers[0][airline[i].segments[j].carrier_code].name+`" title="`+airline_carriers[0][airline[i].segments[j].carrier_code].name+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+airline[i].segments[j].carrier_code+`.png"><br/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-10">
                                                <div class="row">`;
                                                text+=`
                                                <div class="col-lg-12" style="margin-top:10px;">
                                                    <span class="copy_flight_number carrier_code_template">Flight `+flight_number+` </span>
                                                </div>`;

                                                text+=`
                                                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">
                                                    <table style="width:100%">
                                                        <tr>
                                                            <td class="airport-code"><h5 class="copy_time_depart">`+airline[i].segments[j].departure_date.split(' - ')[1]+`</h5></td>
                                                            <td style="padding-left:15px;">
                                                                <img src="/static/tt_website_rodextrip/img/icon/airlines-01.png" alt="Airline" style="width:20px; height:20px;"/>
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
                                                    <span class="copy_date_depart">`+airline[i].segments[j].departure_date.split(' - ')[0]+` </span></br>
                                                    <span class="copy_departure" style="font-weight:500;">`+airline[i].segments[j].origin_city+` (`+airline[i].segments[j].origin+`)</span>
                                                </div>

                                                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">
                                                    <table style="width:100%; margin-bottom:6px;">
                                                        <tr>
                                                            <td><h5 class="copy_time_arr">`+airline[i].segments[j].arrival_date.split(' - ')[1]+`</h5></td>
                                                            <td></td>
                                                            <td style="height:30px;padding:0 15px;width:100%"></td>
                                                        </tr>
                                                    </table>
                                                    <span class="copy_date_arr">`+airline[i].segments[j].arrival_date.split(' - ')[0]+` </span></br>
                                                    <span class="copy_arrival" style="font-weight:500;">`+airline[i].segments[j].destination_city+` (`+airline[i].segments[j].destination+`)</span>
                                                </div>

                                                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">
                                                    <i class="fas fa-clock"></i><span class="copy_duration" style="font-weight:500;"> `;
                                                if(airline[i].segments[j].elapsed_time.split(':')[0] != '0'){
                                                    text+= airline[i].segments[j].elapsed_time.split(':')[0] + 'd ';
                                                }
                                                if(airline[i].segments[j].elapsed_time.split(':')[1] != '0'){
                                                    text+= airline[i].segments[j].elapsed_time.split(':')[1] + 'h ';
                                                }
                                                if(airline[i].segments[j].elapsed_time.split(':')[2] != '0'){
                                                    text+= airline[i].segments[j].elapsed_time.split(':')[2] + 'm ';
                                                }
                                                text+=`</span><br/>
                                                        <span class="copy_transit">Transit: `+airline[i].segments[j].transit_count+`</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;
                                }
                           }
                           else if(airline[i].is_combo_price == false){
                                text+=`
                                <div class="col-lg-12" id="copy_div_airline`+i+`">
                                    <span class="copy_airline" hidden>`+i+`</span>
                                    <div class="row">
                                        <div class="col-lg-2">`;
                                            for(j in airline[i].segments){
                                                //ganti sini
                                                flight_number = parseInt(j) + 1;
                                                text+=`
                                                <div class="row"><div class="col-lg-12" id="copy_provider_operated`+i+``+j+`">
                                                <span class="copy_po" hidden>`+j+`</span>`;
                                                if(airline[i].segments[j].carrier_code != airline[i].segments[j].operating_airline_code){
                                                    if(j != 0){
                                                        text+=`<hr/>`;
                                                    }
                                                    try{
                                                        text += `<span class="copy_operated_by" style="float:left; font-weight: 700; font-size:12px;">Operated by `+airline_carriers[airline[i].segments[j].operating_airline_code].name+`</span><br/>`;
                                                    }catch(err){
                                                        text += `<span class="copy_operated_by" style="float:left; font-weight: 700; font-size:12px;">Operated by `+airline[i].segments[j].operating_airline_code+`</span><br/>`;
                                                    }
                                                    try{
                                                        text+=`
                                                        <span class="copy_carrier_provider" style="font-weight:500; font-size:12px;">`+airline_carriers[airline[i].segments[j].carrier_code].name+`</span><br/>
                                                        <img data-toggle="tooltip" style="width:50px; height:50px;" alt="`+airline_carriers[airline[i].segments[j].carrier_code].name+`" title="`+airline_carriers[airline[i].segments[j].carrier_code].name+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+airline[i].segments[j].carrier_code+`.png"><br/>`;
                                                    }catch(err){
                                                        text+=`
                                                        <span class="copy_carrier_provider" style="font-weight:500; font-size:12px;">`+airline[i].segments[j].carrier_code+`</span><br/>
                                                        <img data-toggle="tooltip" style="width:50px; height:50px;" alt="`+airline[i].segments[j].carrier_code+`" title="`+airline[i].segments[j].carrier_code+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+airline[i].segments[j].carrier_code+`.png"><br/>`;
                                                    }
                                                }else if(carrier_code_airline.includes(airline[i].segments[j].carrier_code) == false){
                                                    if(j != 0){
                                                        text+=`<hr/>`;
                                                    }
                                                    try{
                                                        text+=`
                                                        <span class="copy_carrier_provider" style="font-weight:500; font-size:12px;">`+airline_carriers[airline[i].segments[j].carrier_code].name+`</span><br/>
                                                        <img data-toggle="tooltip" style="width:50px; height:50px;" alt="`+airline_carriers[airline[i].segments[j].carrier_code].name+`" title="`+airline_carriers[airline[i].segments[j].carrier_code].name+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+airline[i].segments[j].carrier_code+`.png"><br/>`;
                                                    }catch(err){
                                                        text+=`
                                                        <span class="copy_carrier_provider" style="font-weight:500; font-size:12px;">`+airline[i].segments[j].carrier_code+`</span><br/>
                                                        <img data-toggle="tooltip" style="width:50px; height:50px;" alt="`+airline[i].segments[j].carrier_code+`" title="`+airline[i].segments[j].carrier_code+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+airline[i].segments[j].carrier_code+`.png"><br/>`;
                                                    }
                                                }
                                                if(carrier_code_airline.includes(airline[i].segments[j].carrier_code) == false)
                                                    carrier_code_airline.push(airline[i].segments[j].carrier_code);
                                                text+=`</div></div>`;
                                            }
                                                //for(j in airline[i].carrier_code_list){
                                                //    text+=`
                                                //    <span class="copy_carrier_provider" style="font-weight:500; font-size:12px;">`+airline_carriers[airline[i].carrier_code_list[j]].name+`</span><br/>
                                                //    <img data-toggle="tooltip" alt="" style="width:50px; height:50px;" title="`+airline_carriers[airline[i].carrier_code_list[j]].name+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+airline[i].carrier_code_list[j]+`.png"><br/>`;
                                                //}
                                            text+=`
                                        </div>
                                        <div class="col-lg-10">
                                            <div class="row">
                                            <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">
                                                <table style="width:100%">
                                                    <tr>
                                                        <td class="airport-code"><h5 class="copy_time_depart">`+airline[i].departure_date.split(' - ')[1]+`</h5></td>
                                                        <td style="padding-left:15px;">
                                                            <img src="/static/tt_website_rodextrip/img/icon/airlines-01.png" alt="Airline" style="width:20px; height:20px;"/>
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
                                                <span class="copy_date_depart">`+airline[i].departure_date.split(' - ')[0]+` </span><br/>
                                                <span class="copy_departure" style="font-weight:500;">`+airline[i].origin_city+` (`+airline[i].origin+`)</span><br/>
                                            </div>
                                            <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">
                                                <table style="width:100%; margin-bottom:6px;">
                                                    <tr>
                                                        <td><h5 class="copy_time_arr">`+airline[i].arrival_date.split(' - ')[1]+`</h5></td>
                                                        <td></td>
                                                        <td style="height:30px;padding:0 15px;width:100%"></td>
                                                    </tr>
                                                </table>
                                                <span class="copy_date_arr">`+airline[i].arrival_date.split(' - ')[0]+`</span><br/>
                                                <span class="copy_arrival" style="font-weight:500;">`+airline[i].destination_city+` (`+airline[i].destination+`)</span><br/>
                                            </div>
                                            <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">
                                                <i class="fas fa-clock"></i><span class="copy_duration" style="font-weight:500;"> `;
                                                if(airline[i].elapsed_time.split(':')[0] != '0'){
                                                    text+= airline[i].elapsed_time.split(':')[0] + 'd ';
                                                }
                                                if(airline[i].elapsed_time.split(':')[1] != '0'){
                                                    text+= airline[i].elapsed_time.split(':')[1] + 'h ';
                                                }
                                                if(airline[i].elapsed_time.split(':')[2] != '0'){
                                                    text+= airline[i].elapsed_time.split(':')[2] + 'm ';
                                                }
                                                text+=`</span><br/>`;
                                                if(airline[i].transit_count==0){
                                                    text+=`<span class="copy_transit" style="font-weight:500;">Direct</span>`;
                                                }
                                                else{
                                                    text+=`<span class="copy_transit" style="font-weight:500;">Transit: `+airline[i].transit_count+`</span>`;
                                                }
                                                text+=`
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
                            }

                           text+=`
                           <div class="col-lg-4 col-md-4 col-sm-4" style="padding-top:15px; margin: auto;">
                               <a id="detail_button_journey0`+i+`" data-toggle="collapse" data-parent="#accordiondepart" onclick="show_flight_details(`+i+`);" href="#detail_departjourney`+i+`" style="color: #237395; text-decoration: unset;" aria-expanded="true">
                                   <span class="detail-link" style="font-weight: bold; display:none;" id="flight_details_up`+i+`"> Flight details <i class="fas fa-chevron-up" style="font-size:14px;"></i></span>
                                    <span class="detail-link" style="font-weight: bold; display:block;" id="flight_details_down`+i+`"> Flight details <i class="fas fa-chevron-down" style="font-size:14px;"></i></span>
                               </a>`;
                               if(airline_recommendations_dict.hasOwnProperty(airline[i].journey_ref_id))
                                    text+=`<label>Combo Price</label>`;
                           text+=`</div>
                           <div class="col-lg-8 col-md-8 col-sm-8" style="text-align:right;">
                               <div>
                               <span id="fare`+i+`" class="basic_fare_field copy_price price_template"></span><br/>`;
                               if(provider_list_data[airline[i].provider].description != '')
                                    text += `<span>`+provider_list_data[airline[i].provider].description+`</span>`;
                               text+=`</div>`;
                               if(airline[i].available_count != 0)
                                    text += `<span>`+airline[i].available_count+` Seats </span>`;
//                                        if(choose_airline != null && choose_airline == airline[i].sequence && airline_request.direction != 'MC')
//                                            text+=`<input type='button' style="margin:10px;" id="departjourney`+i+`" class="primary-btn-custom-un choose_selection_ticket_airlines_depart" value="Chosen" onclick="get_price_itinerary(`+i+`)" sequence_id="0"/>`;
//                                        else

                               if(airline[i].can_book == true){
                                   text+=`<input type='button' style="margin:5px 0px 0px 0px;" id="departjourney`+i+`" class="primary-btn-custom choose_selection_ticket_airlines_depart" value="Choose" onclick="get_price_itinerary_reissue(`+i+`)" sequence_id="0"/>`;
                               }else{
                                   text+=`<input type='button' style="margin:5px 0px 0px 0px;" id="departjourney`+i+`" class="primary-btn-custom choose_selection_ticket_airlines_depart" value="Sold Out" onclick="" disabled sequence_id="0"/>`;
                               }
                               text+=`
                           </div>
                       </div>

                       <div id="detail_departjourney`+i+`" class="panel-collapse collapse in" aria-expanded="true" style="display:none;">`;
                           for(j in airline[i].segments){
                               text+=`<div id="copy_segments_details`+i+``+j+`">
                               <span class="copy_segments" hidden>`+i+``+j+`</span>`;
                               if(airline[i].segments[j].transit_duration != ''){
                                   text += `<div class="col-lg-12" style="text-align:center;"><i class="fas fa-clock"></i><span style="font-weight:500" class="copy_transit_details">Transit Duration: `;
                                   if(airline[i].segments[j].transit_duration.split(':')[0] != '0')
                                       text+= airline[i].segments[j].transit_duration.split(':')[0] + 'd ';
                                   if(airline[i].segments[j].transit_duration.split(':')[1] != '0')
                                       text+= airline[i].segments[j].transit_duration.split(':')[1] + 'h ';
                                   if(airline[i].segments[j].transit_duration.split(':')[2] != '0')
                                       text+= airline[i].segments[j].transit_duration.split(':')[2] + 'm ';
                                   text+=`</span></div><br/>`;
                               }else{
                                   text += `<span class="copy_transit_details" hidden>0</span>`;
                               }
                               var depart = 0;
                                   if(airline_pick_list.length == 1)
                                   depart = 1;
                               if(depart == 0 && j == 0)
                                   text+=`
                                   <div style="text-align:left; background-color:white; padding:5px 10px 5px 10px;">
                                       <span class="flight_type_template">Departure</span>
                                       <hr/>
                                   </div>`;
                               else if(depart == 1){
                                   text+=`
                                   <div style="text-align:left; background-color:white; padding:5px 10px 5px 10px;">
                                       <span class="flight_type_template">Return</span>
                                       <hr/>
                                   </div>`;
                                   depart = 2;
                               }
                               text+=`
                               <div class="row" id="journey0segment0" style="padding:10px;">
                                   <div class="col-lg-2">`;
                               try{
                               text+=`
                                   <span style="font-weight: 500; font-size:12px;" class="copy_carrier_provider_details">`+airline_carriers[airline[i].segments[j].carrier_code].name+`</span><br/>
                                   <span class="carrier_code_template">`+airline[i].segments[j].carrier_name+`</span><br/>
                                   <img data-toggle="tooltip" style="width:50px; height:50px;" alt="`+airline_carriers[airline[i].segments[j].carrier_code].name+`" title="`+airline_carriers[airline[i].segments[j].carrier_code].name+`" src="`+static_path_url_server+`/public/airline_logo/`+airline[i].segments[j].carrier_code+`.png"><br/>`;
                               }catch(err){
                               text+=`
                                   <span style="font-weight: 500;" class="copy_carrier_provider_details">`+airline[i].segments[j].carrier_code+`</span><br/>
                                   <span class="carrier_code_template">`+airline[i].segments[j].carrier_name+`</span><br/>`;
                               }
                               text+=`
                               </div>
                               <div class="col-lg-7">`;
                               for(k in airline[i].segments[j].legs){
                                   text+=`
                                   <div class="row" id="copy_legs_details`+i+``+j+``+k+`">
                                       <span class="copy_legs" hidden>`+i+``+j+``+k+`</span>
                                       <div class="col-lg-12">
                                           <div class="timeline-wrapper">
                                               <ul class="StepProgress">
                                                   <li class="StepProgress-item is-done">
                                                       <div class="bold">
                                                           <span class="copy_legs_date_depart">`+airline[i].segments[j].legs[k].departure_date.split(' - ')[0]+` - `+airline[i].segments[j].legs[k].departure_date.split(' - ')[1]+`</span>
                                                       </div>
                                                       <div>
                                                           <span style="font-weight:500;" class="copy_legs_depart">`+airline[i].segments[j].legs[k].origin_city+` - `+airline[i].segments[j].legs[k].origin_name+` (`+airline[i].segments[j].legs[k].origin+`)</span></br>`;

                                                       if(airline[i].segments[j].origin_terminal != ''){
                                                           text+=`<span style="font-size:13px; font-weight:500;">Terminal: `+airline[i].segments[j].origin_terminal+`</span>`;
                                                       }else{
                                                           text+=`<span style="font-size:13px; font-weight:500;">Terminal: -</span>`;
                                                       }
                                                       text+=`
                                                      </div>
                                                   </li>
                                                   <li class="StepProgress-item is-end">
                                                       <div class="bold">
                                                           <span class="copy_legs_date_arr">`+airline[i].segments[j].legs[k].arrival_date.split(' - ')[0]+` - `+airline[i].segments[j].legs[k].arrival_date.split(' - ')[1]+`</span>
                                                       </div>
                                                       <div>
                                                           <span style="font-weight:500;" class="copy_legs_arr">`+airline[i].segments[j].legs[k].destination_city+` - `+airline[i].segments[j].legs[k].destination_name+` (`+airline[i].segments[j].legs[k].destination+`)</span><br/>`;
                                                       if(airline[i].segments[j].destination_terminal != ''){
                                                           text+=`<span style="font-size:13px; font-weight:500;">Terminal: `+airline[i].segments[j].destination_terminal+`</span>`;
                                                       }else{
                                                           text+=`<span style="font-size:13px; font-weight:500;">Terminal: -</span>`;
                                                       }

                                                       text+=`
                                                       </div>
                                                  </li>
                                               </ul>
                                           </div>
                                       </div>
                                   </div>`;
                               }
                               text+=`
                               </div>
                               <div class="col-lg-3" id="copy_legs_duration_details`+i+``+j+``+k+`">
                                   <i class="fas fa-clock"></i><span style="font-weight:500;" class="copy_duration_details"> `;
                                   if(airline[i].segments[j].elapsed_time.split(':')[0] != '0')
                                       text+= airline[i].segments[j].elapsed_time.split(':')[0] + 'd ';
                                   if(airline[i].segments[j].elapsed_time.split(':')[1] != '0')
                                       text+= airline[i].segments[j].elapsed_time.split(':')[1] + 'h ';
                                   if(airline[i].segments[j].elapsed_time.split(':')[2] != '0')
                                       text+= airline[i].segments[j].elapsed_time.split(':')[2] + 'm ';
                                   text+=`</span>
                               </div>
                               <div class="col-xs-12">
                                    <div class="row" id="airline`+i+`fare_details">`;
                               for(j in airline[i].fare_details){
                                   text+=`
                                   <div class="col-xs-12">`;
                                   if(airline[i].fare_details[j].detail_type.includes('BG')){
                                        text+=`<i class="fas fa-suitcase"></i><span style="font-weight:500;" class="copy_suitcase_details"> `+airline[i].fare_details[j].amount+` `+airline[i].fare_details[j].unit+`</span><br/>`;
                                   }
                                   else if(airline[i].fare_details[j].detail_type == 'ML'){
                                        text+=`<i class="fas fa-utensils"></i><span style="font-weight:500;" class="copy_utensils_details"> `+airline[i].fare_details[j].amount+` `+airline[i].fare_details[j].unit+`</span><br/>`;
                                   }else{
                                        text+=`<span style="font-weight:500;" class="copy_others_details">`+airline[i].fare_details[j].amount+` `+airline[i].fare_details[j].unit+`</span><br/>`;
                                   }
                                   text+=`</div>`;
                               }
                               text+=`
                                    </div>
                               </div>
                               <div class="col-lg-12">`;
                                   text+=`
                                   <br/>
                                   <div class="row">
                                       <div class="col-lg-12">
                                           <button style="text-align:left; width:unset; line-height:20px; font-size:13px; height:50px;" id="show_choose_seat`+i+``+j+`" type="button" class="form-control primary-btn-white dropdown-toggle" data-toggle="dropdown">`;
                                           if(airline[i].can_book == true){
                                                text+=`<img src="/static/tt_website_rodextrip/img/icon/seat.png" style="height:16px; width:auto;"> <span id="choose_seat_span`+i+``+j+`">Choose Seat Class</span>`;
                                           }else{
                                                text+=`<img src="/static/tt_website_rodextrip/img/icon/seat.png" style="height:16px; width:auto;"> <span id="choose_seat_span`+i+``+j+`">SOLD OUT</span>`;
                                           }

                                           text+=`
                                           </button>
                                           <ul id="provider_seat_content`+i+``+j+`" class="dropdown-menu" style="background:unset; padding:0px 15px 15px 15px; z-index:5; border:unset;">
                                              <div style="background:white; padding:15px; border:1px solid #cdcdcd; overflow-y:auto; height:200px;">
                                              <div class="row">
                                                  <div class="col-lg-12">
                                                       <h6>(Class Of Service / Seat left)</h6>
                                                       <hr/>
                                                  </div>`;
                                                  fare_check = 0;
                                                  for(k in airline[i].segments[j].fares){
                                                       check = 0;
                                                       temp_seat_name = '';
                                                       //airline pertama, airline tanpa combo price, airline combo price
                                                       if(airline_pick_list.length == 0 || airline_recommendations_dict == {} || airline_recommendations_dict.hasOwnProperty(airline[i].journey_ref_id)){
                                                            print = true;
                                                            journey_recom_idx = 0
                                                            if(airline_recommendations_dict.hasOwnProperty(airline[i].journey_ref_id)){
                                                                print = false;
                                                                for(l in airline_recommendations_dict[airline[i].journey_ref_id]){
                                                                    for(m in airline_recommendations_dict[airline[i].journey_ref_id][l].segments){
                                                                        if(airline[i].segments[j].fares[k].fare_ref_id == airline_recommendations_dict[airline[i].journey_ref_id][l].segments[m].fare_ref_id){
                                                                            journey_recom_idx = l;
                                                                            print = true;
                                                                            break;
                                                                        }
                                                                    }
                                                                    if(print)
                                                                        break;
                                                                }
                                                            }
                                                            if(print == true){
                                                                var total_price = 0;
                                                                //recomm
                                                                if(j == airline[i].segments.length - 1 && airline_pick_list.length == all_journey_flight_list.length - 1 && airline_pick_list != 0){
                                                                   if(all_journey_flight_list.length == airline_pick_list.length + 1 && airline_recommendations_dict.hasOwnProperty(airline[i].journey_ref_id)){
                                                                        //combo price
                                                                        for(l in airline_recommendations_dict[airline[i].journey_ref_id][journey_recom_idx].service_charge_summary){
                                                                            if(airline_recommendations_dict[airline[i].journey_ref_id][journey_recom_idx].service_charge_summary[l].pax_type == 'ADT'){
                                                                                total_price = airline_recommendations_dict[airline[i].journey_ref_id][journey_recom_idx].service_charge_summary[l].total_price / airline_recommendations_dict[airline[i].journey_ref_id][journey_recom_idx].service_charge_summary[l].pax_count; // harga per orang
                                                                            }
                                                                        }
                                                                        total_price -= total_price_pick;
                                                                   }
                                                                   else{
                                                                        //normal / first ticket
                                                                        for(l in airline[i].segments[j].fares[k].service_charge_summary)
                                                                            if(airline[i].segments[j].fares[k].service_charge_summary[l].pax_type == 'ADT'){
                                                                                for(m in airline[i].segments[j].fares[k].service_charge_summary[l].service_charges)
                                                                                    if(airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'tax' || airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'fare' || airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'roc')
                                                                                        total_price+= airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].amount;
                                                                                break;
                                                                        }
                                                                   }
                                                                }
                                                                //normal ticket
                                                                else if(airline_pick_list.length != all_journey_flight_list.length-1 || all_journey_flight_list.length == 1){
                                                                    for(l in airline[i].segments[j].fares[k].service_charge_summary)
                                                                        if(airline[i].segments[j].fares[k].service_charge_summary[l].pax_type == 'ADT'){
                                                                            for(m in airline[i].segments[j].fares[k].service_charge_summary[l].service_charges)
                                                                                if(airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'tax' || airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'fare' || airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'roc')
                                                                                    total_price+= airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].amount;
                                                                            break;
                                                                    }
                                                                }
                                                                text+=`<div class="col-xs-12">`;
                                                                if(airline_get_detail.result.response.ADT + airline_get_detail.result.response.CHD > airline[i].segments[j].fares[k].available_count){
                                                                   text+=`
                                                                   <label class="radio-button-custom" style="color:#cdcdcd !important; cursor:not-allowed;">
                                                                       `+airline[i].segments[j].fares[k].class_of_service;
                                                                   temp_seat_name += ''+airline[i].segments[j].fares[k].class_of_service+' -';
                                                                   if(airline[i].segments[j].fares[k].cabin_class != ''){
                                                                        if(airline[i].segments[j].fares[k].cabin_class == 'Y'){
                                                                            text += ' (Economy)';
                                                                            temp_seat_name += ' (Economy)';
                                                                        }
                                                                        else if(airline[i].carrier_code_list.includes('QG') && airline[i].segments[j].fares[k].cabin_class == 'W'){
                                                                            text += ' (Royal Green)';
                                                                            temp_seat_name += ' (Royal Green)';
                                                                        }
                                                                        else if(airline[i].segments[j].fares[k].cabin_class == 'W'){
                                                                            text += ' (Premium Economy)';
                                                                            temp_seat_name += ' (Premium Economy)';
                                                                        }
                                                                        else if(airline[i].segments[j].fares[k].cabin_class == 'C'){
                                                                            text += ' (Business)';
                                                                            temp_seat_name += ' (Business)';
                                                                        }
                                                                        else if(airline[i].segments[j].fares[k].cabin_class == 'F'){
                                                                            text += ' (First Class)';
                                                                            temp_seat_name += ' (First Class)';
                                                                        }
                                                                   }
                                                                   temp_seat_name += ' - SOLD OUT';
                                                                   text+=`</span> / <span>`+airline[i].segments[j].fares[k].available_count+`
                                                                       <input onclick="change_fare(`+i+`,`+j+`,`+k+`); change_seat_span(`+i+`, `+j+`, '`+temp_seat_name+`')" id="journey`+i+`segment`+j+`fare" name="journey`+i+`segment`+j+`fare" type="radio" value="`+k+`" disabled>
                                                                       <span class="checkmark-radio"></span>`;

                                                               }
                                                                else{
                                                                   text+=`
                                                                   <label class="radio-button-custom">
                                                                       `+airline[i].segments[j].fares[k].class_of_service;
                                                                        temp_seat_name += ''+airline[i].segments[j].fares[k].class_of_service+' ';
                                                                        if(airline[i].segments[j].fares[k].cabin_class != ''){
                                                                            if(airline[i].segments[j].fares[k].cabin_class == 'Y'){
                                                                                text += ' (Economy)';
                                                                                temp_seat_name += ' (Economy)';
                                                                            }
                                                                            else if(airline[i].carrier_code_list.includes('QG') && airline[i].segments[j].fares[k].cabin_class == 'W'){
                                                                                text += ' (Royal Green)';
                                                                                temp_seat_name += ' (Royal Green)';
                                                                            }
                                                                            else if(airline[i].segments[j].fares[k].cabin_class == 'W'){
                                                                                text += ' (Premium Economy)';
                                                                                temp_seat_name += ' (Premium Economy)';
                                                                            }
                                                                            else if(airline[i].segments[j].fares[k].cabin_class == 'C'){
                                                                                text += ' (Business)';
                                                                                temp_seat_name += ' (Business)';
                                                                            }
                                                                            else if(airline[i].segments[j].fares[k].cabin_class == 'F'){
                                                                                text += ' (First Class)';
                                                                                temp_seat_name += ' (First Class)';
                                                                            }
                                                                        }
                                                                       if(total_price == 0){
                                                                            temp_seat_name += ' - Choose to view price';
                                                                       }else{
                                                                            temp_seat_name += ' - '+airline[i].currency + ' ' + getrupiah(total_price);
                                                                       }
                                                                       text+=`</span> / <span>`+airline[i].segments[j].fares[k].available_count+`
                                                                       <input onclick="change_fare(`+i+`,`+j+`,`+k+`);change_seat_span(`+i+`, `+j+`, '`+temp_seat_name+`');" id="journey`+i+`segment`+j+`fare" name="journey`+i+`segment`+j+`fare" type="radio" value="`+k+`"`;
                                                                       if(fare_check == 0){
                                                                            text+=` checked="checked"`;
                                                                            airline[i].segments[j].fare_pick = parseInt(k);
                                                                       }
                                                                       text+=`>
                                                                       <span class="checkmark-radio"></span>`;

                                                                   fare_check = 1;
                                                                   id_price_segment = `journey`+i+`segment`+j+`fare`+k;
                                                                   if(total_price == 0){
                                                                       if(airline_get_detail.result.response.ADT + airline_get_detail.result.response.CHD > airline[i].segments[j].fares[k].available_count){
                                                                           text+=`</br><span>Price:</span><span id="`+id_price_segment+`" class="price_template" style="color:#cdcdcd;">SOLD OUT</span><br/>`;
                                                                       }else{
                                                                           text+=`</br><span>Price:</span><span id="`+id_price_segment+`" class="price_template">Choose to view price</span><br/>`;
                                                                       }
                                                                   }else{
                                                                       text+=`</br><span>Price:</span><span id="`+id_price_segment+`" class="price_template">`+airline[i].currency+` `+getrupiah(total_price)+`</span><br/>`;
                                                                   }
                                                                   if(airline[i].segments[j].fares[k].fare_name)
                                                                       text+=`<span>`+airline[i].segments[j].fares[k].fare_name+`</span>`;
                                                                   if(airline[i].segments[j].fares[k].description.length != 0){
                                                                        for(l in airline[i].segments[j].fares[k].description){
                                                                            text += `<span style="display:block;">`+airline[i].segments[j].fares[k].description[l]+`</span>`;
                                                                            if(l != airline[i].segments[j].fares[k].description.length -1)
                                                                                text += '';
                                                                        }
                                                                   }
                                                                   text+=`</label></div>`;

                                                                }
                                                            }
                                                       }
                                                       // recommendation
//                                                       if(parseInt(airline_request.counter) == airline_pick_list.length + 1 && airline_recommendations_list.length != 0){
//                                                           for(l in airline_recommendations_journey[airline_recommendations_list.indexOf(airline[i].journey_ref_id)].journey_flight_refs[airline_pick_list.length].fare_flight_refs){
//                                                                if(airline[i].segments[l].fares[k].fare_ref_id != airline_recommendations_journey[airline_recommendations_list.indexOf(airline[i].journey_ref_id)].journey_flight_refs[airline_pick_list.length].fare_flight_refs[l].fare_ref_id)
//                                                                    check = 1;
//                                                           }
//                                                       }
//                                                       if(check == 0){

//                                                                   var total_price = 0;
//                                                                   if(j == airline[i].segments.length - 1 && airline_pick_list.length == airline_request.origin.length - 1 && airline_pick_list != 0){
//                                                                       if(airline_request.origin.length == airline_pick_list.length + 1 && airline_recommendations_list.length != 0){
//                                                                            check = 0;
//                                                                            for(l in airline_recommendations_journey[airline_recommendations_list.indexOf(airline[i].journey_ref_id)].journey_flight_refs[airline_pick_list.length].fare_flight_refs){
//                                                                                try{
//                                                                                    if(airline[i].segments[l].fares[k].fare_ref_id == airline_recommendations_journey[airline_recommendations_list.indexOf(airline[i].journey_ref_id)].journey_flight_refs[airline_pick_list.length].fare_flight_refs[l].fare_ref_id)
//                                                                                        check = 1;
//                                                                                }catch(err){
//                                                                                    console.log(err); // error kalau ada element yg tidak ada
//                                                                                }
//                                                                            }
//                                                                            if(check == 1){
//                                                                                for(l in airline_recommendations_journey[airline_recommendations_list.indexOf(airline[i].journey_ref_id)].service_charge_summary){
//                                                                                    if(airline_recommendations_journey[airline_recommendations_list.indexOf(airline[i].journey_ref_id)].service_charge_summary[l].pax_type == 'ADT')
//                                                                                        total_price = airline_recommendations_journey[airline_recommendations_list.indexOf(airline[i].journey_ref_id)].service_charge_summary[l].total_price / airline_recommendations_journey[airline_recommendations_list.indexOf(airline[i].journey_ref_id)].service_charge_summary[l].pax_count;
//                                                                                }
//                                                                                total_price -= total_price_pick;
//                                                                            }else{
//                                                                                for(l in airline[i].segments[j].fares[k].service_charge_summary)
//                                                                                    if(airline[i].segments[j].fares[k].service_charge_summary[l].pax_type == 'ADT'){
//                                                                                        for(m in airline[i].segments[j].fares[k].service_charge_summary[l].service_charges)
//                                                                                            if(airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'tax' || airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'fare' || airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'roc')
//                                                                                                total_price+= airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].amount;
//                                                                                        break;
//                                                                                }
//                                                                            }
//                                                                       }else{
//                                                                            for(l in airline[i].segments[j].fares[k].service_charge_summary)
//                                                                                if(airline[i].segments[j].fares[k].service_charge_summary[l].pax_type == 'ADT'){
//                                                                                    for(m in airline[i].segments[j].fares[k].service_charge_summary[l].service_charges)
//                                                                                        if(airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'tax' || airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'fare' || airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'roc')
//                                                                                            total_price+= airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].amount;
//                                                                                    break;
//                                                                            }
//                                                                       }
//                                                                   }
//                                                                   else if(airline_pick_list.length != airline_request.origin.length-1 || airline_request.origin.length == 1){
//                                                                        for(l in airline[i].segments[j].fares[k].service_charge_summary)
//                                                                            if(airline[i].segments[j].fares[k].service_charge_summary[l].pax_type == 'ADT'){
//                                                                                for(m in airline[i].segments[j].fares[k].service_charge_summary[l].service_charges)
//                                                                                    if(airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'tax' || airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'fare' || airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'roc')
//                                                                                        total_price+= airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].amount;
//                                                                                break;
//                                                                        }
//                                                                   }
//
//                                                                   text+=`<div class="col-xs-12">`;
//                                                                   if(airline_request.adult + airline_request.child > airline[i].segments[j].fares[k].available_count){
//                                                                       text+=`
//                                                                       <label class="radio-button-custom" style="color:#cdcdcd !important; cursor:not-allowed;">
//                                                                           `+airline[i].segments[j].fares[k].class_of_service;
//                                                                       temp_seat_name += ''+airline[i].segments[j].fares[k].class_of_service+' -';
//                                                                       if(airline[i].segments[j].fares[k].cabin_class != ''){
//                                                                            if(airline[i].segments[j].fares[k].cabin_class == 'Y'){
//                                                                                text += ' (Economy)';
//                                                                                temp_seat_name += ' (Economy)';
//                                                                            }
//                                                                            else if(airline[i].carrier_code_list.includes('QG') && airline[i].segments[j].fares[k].cabin_class == 'W'){
//                                                                                text += ' (Royal Green)';
//                                                                                temp_seat_name += ' (Royal Green)';
//                                                                            }
//                                                                            else if(airline[i].segments[j].fares[k].cabin_class == 'W'){
//                                                                                text += ' (Premium Economy)';
//                                                                                temp_seat_name += ' (Premium Economy)';
//                                                                            }
//                                                                            else if(airline[i].segments[j].fares[k].cabin_class == 'C'){
//                                                                                text += ' (Business)';
//                                                                                temp_seat_name += ' (Business)';
//                                                                            }
//                                                                            else if(airline[i].segments[j].fares[k].cabin_class == 'F'){
//                                                                                text += ' (First Class)';
//                                                                                temp_seat_name += ' (First Class)';
//                                                                            }
//                                                                       }
//                                                                       temp_seat_name += ' - SOLD OUT';
//                                                                       text+=`</span> / <span>`+airline[i].segments[j].fares[k].available_count+`
//                                                                           <input onclick="change_fare(`+i+`,`+j+`,`+k+`); change_seat_span(`+i+`, `+j+`, '`+temp_seat_name+`')" id="journey`+i+`segment`+j+`fare" name="journey`+i+`segment`+j+`fare" type="radio" value="`+k+`" disabled>
//                                                                           <span class="checkmark-radio"></span>`;
//
//                                                                   }
//                                                                   else{
//                                                                       if(fare_check == 0){
//                                                                            text+=`
//                                                                               <label class="radio-button-custom">
//                                                                                   `+airline[i].segments[j].fares[k].class_of_service;
//                                                                                    temp_seat_name += ''+airline[i].segments[j].fares[k].class_of_service+' ';
//                                                                                    if(airline[i].segments[j].fares[k].cabin_class != ''){
//                                                                                        if(airline[i].segments[j].fares[k].cabin_class == 'Y'){
//                                                                                            text += ' (Economy)';
//                                                                                            temp_seat_name += ' (Economy)';
//                                                                                        }
//                                                                                        else if(airline[i].carrier_code_list.includes('QG') && airline[i].segments[j].fares[k].cabin_class == 'W'){
//                                                                                            text += ' (Royal Green)';
//                                                                                            temp_seat_name += ' (Royal Green)';
//                                                                                        }
//                                                                                        else if(airline[i].segments[j].fares[k].cabin_class == 'W'){
//                                                                                            text += ' (Premium Economy)';
//                                                                                            temp_seat_name += ' (Premium Economy)';
//                                                                                        }
//                                                                                        else if(airline[i].segments[j].fares[k].cabin_class == 'C'){
//                                                                                            text += ' (Business)';
//                                                                                            temp_seat_name += ' (Business)';
//                                                                                        }
//                                                                                        else if(airline[i].segments[j].fares[k].cabin_class == 'F'){
//                                                                                            text += ' (First Class)';
//                                                                                            temp_seat_name += ' (First Class)';
//                                                                                        }
//                                                                                    }
//                                                                                   if(total_price == 0){
//                                                                                        temp_seat_name += ' - Choose to view price';
//                                                                                   }else{
//                                                                                        temp_seat_name += ' - '+airline[i].currency + ' ' + getrupiah(total_price);
//                                                                                   }
//                                                                                   text+=`</span> / <span>`+airline[i].segments[j].fares[k].available_count+`
//                                                                                   <input onclick="change_fare(`+i+`,`+j+`,`+k+`); change_seat_span(`+i+`, `+j+`, '`+temp_seat_name+`');" id="journey`+i+`segment`+j+`fare" name="journey`+i+`segment`+j+`fare" type="radio" value="`+k+`" checked="checked">
//                                                                                   <span class="checkmark-radio"></span>`;
//
//                                                                               fare_check = 1;
//                                                                       }else if(fare_check == 1){
//                                                                           text+=`
//                                                                           <label class="radio-button-custom">
//                                                                               `+airline[i].segments[j].fares[k].class_of_service;
//                                                                               temp_seat_name += ''+airline[i].segments[j].fares[k].class_of_service+' ';
//                                                                               if(airline[i].segments[j].fares[k].cabin_class != ''){
//                                                                                    if(airline[i].segments[j].fares[k].cabin_class == 'Y'){
//                                                                                        text += ' (Economy)';
//                                                                                        temp_seat_name += ' (Economy)';
//                                                                                    }
//                                                                                    else if(airline[i].segments[j].fares[k].cabin_class == 'W'){
//                                                                                        text += ' (Premium Economy)';
//                                                                                        temp_seat_name += ' (Premium Economy)';
//                                                                                    }
//                                                                                    else if(airline[i].segments[j].fares[k].cabin_class == 'C'){
//                                                                                        text += ' (Business)';
//                                                                                        temp_seat_name += ' (Business)';
//                                                                                    }
//                                                                                    else if(airline[i].segments[j].fares[k].cabin_class == 'F'){
//                                                                                        text += ' (First Class)';
//                                                                                        temp_seat_name += ' (First Class)';
//                                                                                    }
//                                                                               }
//
//                                                                               if(total_price == 0){
//                                                                                    temp_seat_name += ' - Choose to view price';
//                                                                               }else{
//                                                                                    temp_seat_name += ' - '+airline[i].currency + ' ' + getrupiah(total_price);
//                                                                               }
//                                                                               text+=`</span> / <span>`+airline[i].segments[j].fares[k].available_count+`
//                                                                               <input onclick="change_fare(`+i+`,`+j+`,`+k+`); change_seat_span(`+i+`, `+j+`, '`+temp_seat_name+`');" id="journey`+i+`segment`+j+`fare" name="journey`+i+`segment`+j+`fare" type="radio" value="`+k+`">
//                                                                               <span class="checkmark-radio"></span>`;
//                                                                       }
//                                                                   }
//                                                                   id_price_segment = `journey`+i+`segment`+j+`fare`+k;
//                                                                   if(total_price == 0){
//                                                                       if(airline_request.adult + airline_request.child > airline[i].segments[j].fares[k].available_count){
//                                                                           text+=`</br><span>Price:</span><span id="`+id_price_segment+`" class="price_template" style="color:#cdcdcd;">SOLD OUT</span><br/>`;
//                                                                       }else{
//                                                                           text+=`</br><span>Price:</span><span id="`+id_price_segment+`" class="price_template">Choose to view price</span><br/>`;
//                                                                       }
//                                                                   }else{
//                                                                       text+=`</br><span>Price:</span><span id="`+id_price_segment+`" class="price_template">`+airline[i].currency+` `+getrupiah(total_price)+`</span><br/>`;
//                                                                   }
//                                                                   if(airline[i].segments[j].fares[k].fare_name)
//                                                                       text+=`<span>`+airline[i].segments[j].fares[k].fare_name+`</span>`;
//                                                                   if(airline[i].segments[j].fares[k].description.length != 0){
//                                                                        for(l in airline[i].segments[j].fares[k].description){
//                                                                            text += `<span style="display:block;">`+airline[i].segments[j].fares[k].description[l]+`</span>`;
//                                                                            if(l != airline[i].segments[j].fares[k].description.length -1)
//                                                                                text += '';
//                                                                        }
//                                                                   }
//                                                                   text+=`</label></div>`;
                                                   }
                                               text+=`
                                               </div>
                                           </ul>
                                       </div>
                                   </div>
                               <br/>`;
                               text+=`</div>
                               </div>
                           </div>`;
                           }
                           text+=`
                       </div>
                   </div>`;
                   var node = document.createElement("div");
                   node.innerHTML = text;
                   document.getElementById("airline_booking").appendChild(node);
                   node = document.createElement("div");
        //                   document.getElementById('airlines_ticket').innerHTML += text;
                   text = '';

                   if(airline[i].hasOwnProperty('search_banner')){
                       for(banner_counter in airline[i].search_banner){
                           var max_banner_date = moment().subtract(parseInt(-1*airline[i].search_banner[banner_counter].minimum_days), 'days').format('YYYY-MM-DD');
                           var selected_banner_date = moment(airline[i].departure_date.split(' - ')[0]).format('YYYY-MM-DD');

                           if(selected_banner_date >= max_banner_date){
                               if(airline[i].search_banner[banner_counter].active == true && airline[i].search_banner[banner_counter].description != ''){
                                   new jBox('Tooltip', {
                                        attach: '#pop_search_banner'+i+banner_counter,
                                        theme: 'TooltipBorder',
                                        width: 280,
                                        position: {
                                          x: 'center',
                                          y: 'bottom'
                                        },
                                        closeOnMouseleave: true,
                                        animation: 'zoomIn',
                                        content: airline[i].search_banner[banner_counter].description
                                   });
                               }
                           }
                       }
                   }
                   total_price_airline = 0;
                   for(j in airline[i].segments){
                       total_price_choose = 0;
                       temp_seat_choose = '';
                       check_price_done = 0;
                       for(k in airline[i].segments[j].fares){
                           if(airline[i].segments[j].fares[k].service_charge_summary.length != 0){
                               if(check_price_done == 0 && k == airline[i].segments[j].fare_pick){
                                   temp_seat_choose += 'Choose Seat Class - '+airline[i].segments[j].fares[k].class_of_service+' ';
                                   if(airline[i].segments[j].fares[k].cabin_class != ''){
                                        if(airline[i].segments[j].fares[k].cabin_class == 'Y'){
                                            temp_seat_choose += ' (Economy)';
                                        }
                                        else if(airline[i].carrier_code_list.includes('QG') && airline[i].segments[j].fares[k].cabin_class == 'W'){
                                            temp_seat_choose += ' (Royal Green)';
                                        }
                                        else if(airline[i].segments[j].fares[k].cabin_class == 'W'){
                                            temp_seat_choose += ' (Premium Economy)';
                                        }
                                        else if(airline[i].segments[j].fares[k].cabin_class == 'C'){
                                            temp_seat_choose += ' (Business)';
                                        }
                                        else if(airline[i].segments[j].fares[k].cabin_class == 'F'){
                                            temp_seat_choose += ' (First Class)';
                                        }
                                   }

//                                   for(l in airline[i].segments[j].fares[k].service_charge_summary){
//                                        if(airline[i].segments[j].fares[k].service_charge_summary[l].pax_type == 'ADT'){
//                                            total_price_choose += airline[i].segments[j].fares[k].service_charge_summary[l].total_price;
//                                        }
//                                   }
                                   //recomm
                                   if(j == airline[i].segments.length - 1 && airline_pick_list.length == all_journey_flight_list.length - 1 && airline_pick_list != 0){
                                       if(all_journey_flight_list.length == airline_pick_list.length + 1 && airline_recommendations_dict.hasOwnProperty(airline[i].journey_ref_id)){
                                            //combo price
                                            for(l in airline_recommendations_dict[airline[i].journey_ref_id][journey_recom_idx].service_charge_summary){
                                                if(airline_recommendations_dict[airline[i].journey_ref_id][journey_recom_idx].service_charge_summary[l].pax_type == 'ADT'){
                                                    total_price_choose = airline_recommendations_dict[airline[i].journey_ref_id][journey_recom_idx].service_charge_summary[l].total_price / airline_recommendations_dict[airline[i].journey_ref_id][journey_recom_idx].service_charge_summary[l].pax_count; // harga per orang
                                                }
                                            }
                                            total_price_choose -= total_price_pick;
                                       }
                                       else{
                                            //normal / first ticket
                                            for(l in airline[i].segments[j].fares[k].service_charge_summary)
                                                if(airline[i].segments[j].fares[k].service_charge_summary[l].pax_type == 'ADT'){
                                                    for(m in airline[i].segments[j].fares[k].service_charge_summary[l].service_charges)
                                                        if(airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'tax' || airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'fare' || airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'roc')
                                                            total_price_choose+= airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].amount;
                                                    break;
                                            }
                                       }
                                   }
                                   //normal ticket
                                   else if(airline_pick_list.length != all_journey_flight_list.length-1 || all_journey_flight_list.length == 1){
                                        for(l in airline[i].segments[j].fares[k].service_charge_summary)
                                            if(airline[i].segments[j].fares[k].service_charge_summary[l].pax_type == 'ADT'){
                                                for(m in airline[i].segments[j].fares[k].service_charge_summary[l].service_charges)
                                                    if(airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'tax' || airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'fare' || airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'roc')
                                                        total_price_choose+= airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].amount;
                                                break;
                                        }
                                   }
                                   check_price_done = 1;
                                   total_price_airline += total_price_choose;
                                   temp_seat_choose += ' - ' + airline[i].currency +' '+getrupiah(total_price_choose);
                               }
                           }
                        document.getElementById('choose_seat_span'+i+j).innerHTML = temp_seat_choose;
                       }
                   }
                   if(airline[i].currency == 'IDR'){
                        document.getElementById('fare'+i).innerHTML = airline[i].currency+' '+getrupiah(total_price_airline);
                   }else{
                        document.getElementById('fare'+i).innerHTML = airline[i].currency+' '+total_price_airline;
                   }
               }
           }
       }

       $('#select_all_copy').show();
       $('#button_copy_reschedule').show();

    }

}
function get_price_itinerary_reissue(val){
    segment = [];
    if(airline_data[val].provider.match(/sabre/))
        provider = 'sabre'
    else
        provider = airline_data[val].provider;
    for(i in airline_data[val].segments){
        segment.push({
            "segment_code": airline_data[val].segments[i].segment_code,
            'fare_code': airline_data[val].segments[i].fares[airline_data[val].segments[i].fare_pick].fare_code,
            'carrier_code': airline_data[val].segments[i].carrier_code,
        });
    }
    counter_search++;
    journey_booking_length = 0;
    for(i in provider_list){
        journey_booking_length += provider_list[i].journeys.length;
    }
    if(airline_pick_list.length == journey_booking_length){
        journey.push({'segments': segment, 'provider': provider});
        airline_pick_list.push(airline_data[val]);
        get_chosen_ticket();
        render_ticket_reissue();
        //get_price_reissue_construct();
//        sell_journey_reissue_construct();
//        sell_reschedule_v2();
        airline_get_reschedule_itinerary_v2();
        //tampil getprice
    }else{
        flight_select++;
        journey.push({'segments': segment, 'provider': provider});
        airline_pick_list.push(airline_data[val]);
        get_chosen_ticket();
        airline_recommendations_list = [];
        airline_recommendations_journey = [];
        airline_recommendations_combo_list = [];
        get_airline_recommendations_list();
        render_ticket_reissue();
        if(airline_pick_list.length == journey_booking_length){
            //get_price_reissue_construct();
//            sell_journey_reissue_construct()
//            sell_reschedule_v2();
            airline_get_reschedule_itinerary_v2();
            //tampil getprice
        }
    }
}

function change_departure_reissue(val){
//    document.getElementById("badge-copy-notif").innerHTML = "0";
//    document.getElementById("badge-copy-notif2").innerHTML = "0";
//    $('#button_copy_airline').hide();
//    if(airline_request.direction != 'MC'){
//        check_airline_pick = 0;
//        while(true){
//            journey.splice(val-1,1);
//            value_pick.splice(val-1,1);
//            airline_pick_list.splice(val-1,1);
//            if(airline_pick_list.length < val)
//                break;
//        }
//        counter_search = val;
//        document.getElementById("airline_ticket_pick").innerHTML = '';
//        document.getElementById("airline_detail").innerHTML = '';
//        airline_departure = 'departure';
//        choose_airline = null;
//        airline_pick_mc('no_button');
//        filtering('filter');
//    }else{
//        //MC
//        //location.reload();
//        check_airline_pick = 0;
//        while(true){
//            journey.splice(val-1,1);
//            value_pick.splice(val-1,1);
//            airline_pick_list.splice(val-1,1);
//            if(airline_pick_list.length < val)
//                break;
//        }
//        counter_search = val;
//        text = '';
//        airline_pick_mc('no_button');
//        document.getElementById("airline_detail").innerHTML = '';
//        filtering('filter');
//    }
    check_airline_pick = 0;
    while(true){
        journey.splice(val-1,1);
        value_pick.splice(val-1,1);
        airline_pick_list.splice(val-1,1);
        if(airline_pick_list.length < val)
            break;
    }
    counter_search = val;
    text = '';
    document.getElementById('airline_detail').innerHTML = '';
    document.getElementById('payment_acq').innerHTML = '';
    get_chosen_ticket('no_button');
    render_ticket_reissue();
//    document.getElementById("airline_detail").innerHTML = '';
//    filtering('filter');

//    document.getElementById("badge-flight-notif").innerHTML = "0";
//    document.getElementById("badge-flight-notif2").innerHTML = "0";
//    $("#badge-flight-notif").removeClass("infinite");
//    $("#badge-flight-notif2").removeClass("infinite");
//    $('#button_chart_airline').hide();
//    $('#choose-ticket-flight').show();

}

function get_chosen_ticket(type='all'){
    text = '';
    for(i in airline_pick_list){
        text+=`
        <div>
            <div style="background-color:`+color+`; padding:10px;">
                <h6 style="color:`+text_color+`;">Flight - `+(airline_pick_list[i].airline_pick_sequence)+`</h6>
            </div>`;

        text+=`
        <div style="background-color:white; border:1px solid `+color+`; margin-bottom:15px; padding:10px;" id="journey2`+airline_pick_list[i].airline_pick_sequence+`">
            <div class="row">
               <div class="col-lg-12">`;
               if(airline_pick_list[i].is_combo_price == true){
                    text+=`<label style="background:`+color+`; color:`+text_color+`;padding:5px 10px;">Combo Price</label>`;
                }

               //search banner
               //counter_search-1
               if(airline_pick_list[i].hasOwnProperty('search_banner')){
                   for(banner_counter in airline_pick_list[i].search_banner){
                       var max_banner_date = moment().subtract(parseInt(-1*airline_pick_list[i].search_banner[banner_counter].minimum_days), 'days').format('YYYY-MM-DD');
                       var selected_banner_date = moment(airline_pick_list[i].departure_date.split(' - ')[0]).format('YYYY-MM-DD');

                       if(selected_banner_date >= max_banner_date){
                           if(airline_pick_list[i].search_banner[banner_counter].active == true){
                               text+=`<label id="pop_search_banner`+i+``+banner_counter+`" class="copy_search_banner" style="background:`+airline_pick_list[i].search_banner[banner_counter].banner_color+`; color:`+airline_pick_list[i].search_banner[banner_counter].text_color+`;padding:5px 10px;">`+airline_pick_list[i].search_banner[banner_counter].name+`</label>`;
                           }
                       }
                   }
               }
               text+=`</div>`;

                carrier_code_airline = []
                if(airline_pick_list[i].is_combo_price == true){
                    for(j in airline_pick_list[i].segments){
                        flight_number = parseInt(j) + 1;
                        text +=`
                        <div class="col-lg-12">
                            <div class="row">
                                <div class="col-lg-2" style="padding-top:10px;">`;
                                    if(airline_pick_list[i].segments[j].carrier_code != airline_pick_list[i].segments[j].operating_airline_code){
                                        try{
                                            text += `<span class="copy_operated_by" style="float:left; font-weight: 700; font-size:12px;">Operated By `+airline_carriers[airline_pick_list[i].segments[j].operating_airline_code].name+`</span><br/>`;

                                        }catch(err){
                                            text += `<span class="copy_operated_by" style="float:left; font-weight: 700; font-size:12px;">Operated By `+airline_pick_list[i].segments[j].operating_airline_code+`</span><br/>`;
                                        }
                                    }
                                    text+=`
                                    <span class="copy_carrier_provider" style="font-weight:500; font-size:12px;">`+airline_carriers[airline_pick_list[i].segments[j].carrier_code].name+`</span><br/>
                                    <img data-toggle="tooltip" style="width:50px; height:50px;margin-bottom:5px;" alt="`+airline_carriers[airline_pick_list[i].segments[j].carrier_code].name+`" title="`+airline_carriers[airline_pick_list[i].segments[j].carrier_code].name+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+airline_pick_list[i].segments[j].carrier_code+`.png"><br/>
                                </div>
                                <div class="col-lg-10">
                                    <div class="row">`;
                                    text+=`
                                    <div class="col-lg-12" style="margin-top:10px;">
                                        <span class="copy_flight_number" class="carrier_code_template">Flight `+flight_number+` </span>
                                    </div>`;

                                    text+=`
                                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">
                                        <table style="width:100%">
                                            <tr>
                                                <td class="airport-code"><h5 class="copy_time_depart">`+airline_pick_list[i].segments[j].departure_date.split(' - ')[1]+`</h5></td>
                                                <td style="padding-left:15px;">
                                                    <img src="/static/tt_website_rodextrip/img/icon/airlines-01.png" alt="Airline" style="width:20px; height:20px;"/>
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
                                        <span class="copy_date_depart">`+airline_pick_list[i].segments[j].departure_date.split(' - ')[0]+` </span></br>
                                        <span class="copy_departure" style="font-weight:500;">`+airline_pick_list[i].segments[j].origin_city+` (`+airline_pick_list[i].segments[j].origin+`)</span>
                                    </div>

                                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">
                                        <table style="width:100%; margin-bottom:6px;">
                                            <tr>
                                                <td><h5 class="copy_time_arr">`+airline_pick_list[i].segments[j].arrival_date.split(' - ')[1]+`</h5></td>
                                                <td></td>
                                                <td style="height:30px;padding:0 15px;width:100%"></td>
                                            </tr>
                                        </table>
                                        <span class="copy_date_arr">`+airline_pick_list[i].segments[j].arrival_date.split(' - ')[0]+` </span></br>
                                        <span class="copy_arrival" style="font-weight:500;">`+airline_pick_list[i].segments[j].destination_city+` (`+airline_pick_list[i].segments[j].destination+`)</span>
                                    </div>

                                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">
                                        <i class="fas fa-clock"></i><span class="copy_duration" style="font-weight:500;"> `;
                                    if(airline_pick_list[i].segments[j].elapsed_time.split(':')[0] != '0'){
                                        text+= airline_pick_list[i].segments[j].elapsed_time.split(':')[0] + 'd ';
                                    }
                                    if(airline_pick_list[i].segments[j].elapsed_time.split(':')[1] != '0'){
                                        text+= airline_pick_list[i].segments[j].elapsed_time.split(':')[1] + 'h ';
                                    }
                                    if(airline_pick_list[i].segments[j].elapsed_time.split(':')[2] != '0'){
                                        text+= airline_pick_list[i].segments[j].elapsed_time.split(':')[2] + 'm ';
                                    }
                                    text+=`</span><br/>
                                            <span class="copy_transit">Transit: `+airline_pick_list[i].segments[j].transit_count+`</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`;
                    }
                }
                else if(airline_pick_list[i].is_combo_price == false){
                    text+=`
                    <div class="col-lg-12" id="copy_div_airline`+airline_pick_list[i].sequence+`">
                        <span class="copy_airline" hidden>`+airline_pick_list[i].sequence+`</span>
                        <div class="row">
                            <div class="col-lg-2">`;
                                for(j in airline_pick_list[i].segments){
                                    if(airline_pick_list[i].segments[j].carrier_code != airline_pick_list[i].segments[j].operating_airline_code){
                                        try{
                                            text += `<span class="copy_operated_by" style="float:left; font-weight: 700; font-size:12px;">Operated by `+airline_carriers[airline_pick_list[i].segments[j].operating_airline_code].name+`</span><br/>`;
                                        }catch(err){
                                            text += `<span class="copy_operated_by" style="float:left; font-weight: 700; font-size:12px;">Operated by `+airline_pick_list[i].segments[j].operating_airline_code+`</span><br/>`;
                                        }
                                        try{
                                            text+=`
                                            <span class="copy_carrier_provider" style="font-weight:500; font-size:12px;">`+airline_carriers[airline_pick_list[i].segments[j].carrier_code].name+`</span><br/>
                                            <img data-toggle="tooltip" style="width:50px; height:50px;" alt="`+airline_carriers[airline_pick_list[i].segments[j].carrier_code].name+`" title="`+airline_carriers[airline_pick_list[i].segments[j].carrier_code].name+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+airline_pick_list[i].segments[j].carrier_code+`.png"><br/>`;
                                        }catch(err){
                                            text+=`
                                            <span class="copy_carrier_provider" style="font-weight:500; font-size:12px;">`+airline_pick_list[i].segments[j].carrier_code+`</span><br/>
                                            <img data-toggle="tooltip" style="width:50px; height:50px;" alt="`+airline_pick_list[i].segments[j].carrier_code+`" title="`+airline_pick_list[i].segments[j].carrier_code+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+airline_pick_list[i].segments[j].carrier_code+`.png"><br/>`;
                                        }
                                        if(j != 0){
                                            text+=`<hr style="margin-top:unset;"/>`;
                                        }
                                    }else if(carrier_code_airline.includes(airline_pick_list[i].segments[j].carrier_code) == false){
                                        try{
                                            text+=`
                                            <span class="copy_carrier_provider" style="font-weight:500; font-size:12px;">`+airline_carriers[airline_pick_list[i].segments[j].carrier_code].name+`</span><br/>
                                            <img data-toggle="tooltip" style="width:50px; height:50px;" alt="`+airline_carriers[airline_pick_list[i].segments[j].carrier_code].name+`" title="`+airline_carriers[airline_pick_list[i].segments[j].carrier_code].name+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+airline_pick_list[i].segments[j].carrier_code+`.png"><br/>`;
                                        }catch(err){
                                            text+=`
                                            <span class="copy_carrier_provider" style="font-weight:500; font-size:12px;">`+airline_pick_list[i].segments[j].carrier_code+`</span><br/>
                                            <img data-toggle="tooltip" style="width:50px; height:50px;" alt="`+airline_pick_list[i].segments[j].carrier_code+`" title="`+airline_pick_list[i].segments[j].carrier_code+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+airline_pick_list[i].segments[j].carrier_code+`.png"><br/>`;
                                        }
                                        if(j != 0){
                                            text+=`<hr style="margin-top:unset;"/>`;
                                        }
                                    }
                                    if(carrier_code_airline.includes(airline_pick_list[i].segments[j].carrier_code) == false)
                                        carrier_code_airline.push(airline_pick_list[i].segments[j].carrier_code);

                                }
                                //for(j in airline[i].carrier_code_list){
                                //    text+=`
                                //    <span class="copy_carrier_provider" style="font-weight:500; font-size:12px;">`+airline_carriers[airline[i].carrier_code_list[j]].name+`</span><br/>
                                //    <img data-toggle="tooltip" alt="" style="width:50px; height:50px;" title="`+airline_carriers[airline[i].carrier_code_list[j]].name+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+airline[i].carrier_code_list[j]+`.png"><br/>`;
                                //}
                            text+=`
                            </div>
                            <div class="col-lg-10">
                                <div class="row">
                                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">
                                    <table style="width:100%">
                                        <tr>
                                            <td class="airport-code"><h5 class="copy_time_depart">`+airline_pick_list[i].departure_date.split(' - ')[1]+`</h5></td>
                                            <td style="padding-left:15px;">
                                                <img src="/static/tt_website_rodextrip/img/icon/airlines-01.png" alt="Airline" style="width:20px; height:20px;"/>
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
                                    <span class="copy_date_depart">`+airline_pick_list[i].departure_date.split(' - ')[0]+` </span><br/>
                                    <span class="copy_departure" style="font-weight:500;">`+airline_pick_list[i].origin_city+` (`+airline_pick_list[i].origin+`)</span><br/>
                                </div>
                                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">
                                    <table style="width:100%; margin-bottom:6px;">
                                        <tr>
                                            <td><h5 class="copy_time_arr">`+airline_pick_list[i].arrival_date.split(' - ')[1]+`</h5></td>
                                            <td></td>
                                            <td style="height:30px;padding:0 15px;width:100%"></td>
                                        </tr>
                                    </table>
                                    <span class="copy_date_arr">`+airline_pick_list[i].arrival_date.split(' - ')[0]+`</span><br/>
                                    <span class="copy_arrival" style="font-weight:500;">`+airline_pick_list[i].destination_city+` (`+airline_pick_list[i].destination+`)</span><br/>
                                </div>
                                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">
                                    <i class="fas fa-clock"></i><span class="copy_duration" style="font-weight:500;"> `;
                                    if(airline_pick_list[i].elapsed_time.split(':')[0] != '0'){
                                        text+= airline_pick_list[i].elapsed_time.split(':')[0] + 'd ';
                                    }
                                    if(airline_pick_list[i].elapsed_time.split(':')[1] != '0'){
                                        text+= airline_pick_list[i].elapsed_time.split(':')[1] + 'h ';
                                    }
                                    if(airline_pick_list[i].elapsed_time.split(':')[2] != '0'){
                                        text+= airline_pick_list[i].elapsed_time.split(':')[2] + 'm ';
                                    }
                                    text+=`</span><br/>`;
                                    if(airline_pick_list[i].transit_count==0){
                                        text+=`<span class="copy_transit" style="font-weight:500;">Direct</span>`;
                                    }
                                    else{
                                        text+=`<span class="copy_transit" style="font-weight:500;">Transit: `+airline_pick_list[i].transit_count+`</span>`;
                                    }
                                    text+=`
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
                }
                text+=`
                <div class="col-lg-4" style="text-align:left; padding-top:15px;">
                    <a id="detail_button_journey`+airline_pick_list[i].airline_pick_sequence+`" data-toggle="collapse" data-parent="#accordiondepart" href="#detail_departjourney_pick`+airline_pick_list[i].airline_pick_sequence+`" style="color: `+color+`; text-decoration:unset;" onclick="show_flight_details2(`+airline_pick_list[i].airline_pick_sequence+`);" aria-expanded="true">
                        <span style="font-weight: bold; display:none;" id="flight_details_up2`+airline_pick_list[i].airline_pick_sequence+`"> Flight details <i class="fas fa-chevron-up" style="font-size:14px;"></i></span>
                        <span style="font-weight: bold; display:block;" id="flight_details_down2`+airline_pick_list[i].airline_pick_sequence+`"> Flight details <i class="fas fa-chevron-down" style="font-size:14px;"></i></span>
                    </a>
                </div>

                <div class="col-lg-8" style="text-align:right;">
                    <span id="fare_detail_pick`+airline_pick_list[i].airline_pick_sequence+`" class="basic_fare_field price_template" style="font-size:16px;font-weight: bold; color:`+color+`; padding:10px 0px;">`;
                    price = 0;
                    for(j in airline_pick_list[i].segments){
                        for(k in airline_pick_list[i].segments[j].fares[airline_pick_list[i].segments[j].fare_pick].service_charge_summary){
                            if(airline_pick_list[i].segments[j].fares[airline_pick_list[i].segments[j].fare_pick].service_charge_summary[k].pax_type == 'ADT')
                                for(m in airline_pick_list[i].segments[j].fares[airline_pick_list[i].segments[j].fare_pick].service_charge_summary[k].service_charges)
                                    if(airline_pick_list[i].segments[j].fares[airline_pick_list[i].segments[j].fare_pick].service_charge_summary[k].service_charges[m].charge_code == 'fare' || airline_pick_list[i].segments[j].fares[airline_pick_list[i].segments[j].fare_pick].service_charge_summary[k].service_charges[m].charge_code == 'tax' || airline_pick_list[i].segments[j].fares[airline_pick_list[i].segments[j].fare_pick].service_charge_summary[k].service_charges[m].charge_code == 'roc'){
                                        currency = airline_pick_list[i].segments[j].fares[airline_pick_list[i].segments[j].fare_pick].service_charge_summary[k].service_charges[m].currency;
                                        price+= airline_pick_list[i].segments[j].fares[airline_pick_list[i].segments[j].fare_pick].service_charge_summary[k].service_charges[m].amount;
                                    }
                        }
                    }
                    text+= currency+' '+getrupiah(price) + '</span>';
                    if(provider_list_data.hasOwnProperty(airline_pick_list[i].provider) == true && provider_list_data[airline_pick_list[i].provider].description != '')
                        text += `<br/><span>`+provider_list_data[airline_pick_list[i].provider].description+`</span><br/>`;
                    if(type == 'all'){
                        text+=`
                        <input type='button' style="margin-left:15px;" id="changejourney_pick`+airline_pick_list[i].airline_pick_sequence+`" class="primary-btn-custom choose_selection_ticket_airlines_depart" value="Change" onclick="change_departure_reissue(`+airline_pick_list[i].airline_pick_sequence+`);" sequence_id="0"/>`;
                    }
                    else if(type == 'change'){
                        text+=`
                        <input type='button' style="margin-left:15px;" id="changejourney_pick`+airline_pick_list[i].airline_pick_sequence+`" class="primary-btn-custom choose_selection_ticket_airlines_depart" value="Change" onclick="change_departure_reissue(`+airline_pick_list[i].airline_pick_sequence+`);" sequence_id="0"/>`;
                    }
                    else if(type == 'delete'){
                        text+=`
                        <input type='button' style="margin-left:15px;background:#f5f5f5 !important;" id="changejourney_pick`+airline_pick_list[i].airline_pick_sequence+`" class="primary-btn-custom choose_selection_ticket_airlines_depart" value="Change" onclick="change_departure_reissue(`+airline_pick_list[i].airline_pick_sequence+`);" disabled sequence_id="0"/>`;
                    }
                    else if(type=='no_button'){
                        text+=`
                        <input type='button' style="margin-left:15px;background:#cdcdcd !important;" id="changejourney_pick`+airline_pick_list[i].airline_pick_sequence+`" class="primary-btn-custom choose_selection_ticket_airlines_depart" value="Change" onclick="change_departure_reissue(`+airline_pick_list[i].airline_pick_sequence+`);" disabled sequence_id="0"/>`;
                    }
                    text+=`
                </div>
                <div class="col-lg-12" style="padding:0px;">
                <div id="detail_departjourney_pick`+airline_pick_list[i].airline_pick_sequence+`" class="panel-collapse collapse in" aria-expanded="true" style="display:none;">`;
                for(j in airline_pick_list[i].segments){
                    if(airline_pick_list[i].segments[j].transit_duration != ''){
                        text += `<div class="col-sm-12" style="text-align:center;"><span style="font-weight:500;"><i class="fas fa-clock"></i>Transit Duration: `;
                        if(airline_pick_list[i].segments[j].transit_duration.split(':')[0] != '0')
                            text+= airline_pick_list[i].segments[j].transit_duration.split(':')[0] + 'd ';
                        if(airline_pick_list[i].segments[j].transit_duration.split(':')[1] != '0')
                            text+= airline_pick_list[i].segments[j].transit_duration.split(':')[1] + 'h ';
                        if(airline_pick_list[i].segments[j].transit_duration.split(':')[2] != '0')
                            text+= airline_pick_list[i].segments[j].transit_duration.split(':')[2] + 'm ';
                        text+=`</span></div><br/>`;
                    }
                var depart = 0;
                if(depart == 0 && j == 0)
                    text+=`
                    <div class="col-lg-12">
                        <div style="text-align:left; background-color:white; padding-top:10px;">
                            <span class="flight_type_template">Departure</span>
                            <hr/>
                        </div>
                    </div>`;
                else if(depart == 1){
                    text+=`
                    <div class="col-lg-12">
                        <div style="text-align:left; background-color:white; padding-top:10px;">
                            <span class="flight_type_template">Return</span>
                            <hr/>
                        </div>
                    </div>`;
                    depart = 2;
                }
                else{
                    text+=`
                    <div class="col-lg-12">
                        <div style="text-align:left; background-color:white; padding-top:10px;">
                            <span class="flight_type_template">Return</span>
                            <hr/>
                        </div>
                    </div>`;
                    depart = 2;
                }
                text+=`
                    <div class="col-lg-12">
                        <div class="row" id="journeypick0segment0">

                        <div class="col-lg-2">`;
                        try{
                        text+=`
                            <span style="font-weight: 500; font-size:12px;">`+airline_carriers[airline_pick_list[i].segments[j].carrier_code].name+`</span><br/>
                            <span style="color:`+color+`; font-weight: 500;">`+airline_pick_list[i].segments[j].carrier_name+`</span><br/>
                            <img data-toggle="tooltip" style="width:50px; height:50px;" alt="`+airline_carriers[airline_pick_list[i].segments[j].carrier_code].name+`" title="`+airline_carriers[airline_pick_list[i].segments[j].carrier_code].name+`" src="`+static_path_url_server+`/public/airline_logo/`+airline_pick_list[i].segments[j].carrier_code+`.png"><br/>`;
                        }catch(err){
                        text+=`
                            <span style="font-weight: 500;">`+airline_pick_list[i].segments[j].carrier_code+`</span><br/>
                            <span style="color:`+color+`; font-weight: 500;">`+airline_pick_list[i].segments[j].carrier_name+`</span><br/>`;
                        }
                        text+=`
                        </div>
                        <div class="col-lg-7">
                            <div class="timeline-wrapper">
                                <ul class="StepProgress">
                                    <li class="StepProgress-item is-done">
                                        <div class="bold">
                                            `+airline_pick_list[i].segments[j].departure_date.split(' - ')[0]+` - `+airline_pick_list[i].segments[j].departure_date.split(' - ')[1]+`
                                        </div>
                                        <div>
                                            <span style="font-weight:500;">`+airline_pick_list[i].segments[j].origin_city+` - `+airline_pick_list[i].segments[j].origin_name+` (`+airline_pick_list[i].segments[j].origin+`)</span></br>`;
                                        if(airline_pick_list[i].segments[j].origin_terminal != ''){
                                           text+=`<span style="font-size:13px; font-weight:500;">Terminal: `+airline_pick_list[i].segments[j].origin_terminal+`</span>`;
                                        }else{
                                           text+=`<span style="font-size:13px; font-weight:500;">Terminal: -</span>`;
                                        }

                                        text+=`
                                        </div>
                                    </li>
                                    <li class="StepProgress-item is-end">
                                        <div class="bold">
                                            `+airline_pick_list[i].segments[j].arrival_date.split(' - ')[0]+` - `+airline_pick_list[i].segments[j].arrival_date.split(' - ')[1]+`
                                        </div>
                                        <div>
                                            <span style="font-weight:500;">`+airline_pick_list[i].segments[j].destination_city+`</span> - <span>`+airline_pick_list[i].segments[j].destination_name+` (`+airline_pick_list[i].segments[j].destination+`)</span><br/>`;
                                        if(airline_pick_list[i].segments[j].destination_terminal != ''){
                                           text+=`<span style="font-size:13px; font-weight:500;">Terminal: `+airline_pick_list[i].segments[j].destination_terminal+`</span>`;
                                        }else{
                                           text+=`<span style="font-size:13px; font-weight:500;">Terminal: -</span>`;
                                        }
                                        text+=`
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="col-lg-3">
                            <span style="font-weight:500;"><i class="fas fa-clock"></i> `;
                            if(airline_pick_list[i].segments[j].elapsed_time.split(':')[0] != '0')
                                text+= airline_pick_list[i].segments[j].elapsed_time.split(':')[0] + 'd ';
                            if(airline_pick_list[i].segments[j].elapsed_time.split(':')[1] != '0')
                                text+= airline_pick_list[i].segments[j].elapsed_time.split(':')[1] + 'h ';
                            if(airline_pick_list[i].segments[j].elapsed_time.split(':')[2] != '0')
                                text+= airline_pick_list[i].segments[j].elapsed_time.split(':')[2] + 'm ';
                            text+=`</span><br/>`;
                            for(k in airline_pick_list[i].segments[j].fares){
                                if(k == 0){
                                    for(l in airline_pick_list[i].segments[j].fares[k].fare_details){
                                        if(airline_pick_list[i].segments[j].fares[k].fare_details[l].detail_type == 'BG'){
                            text+=`
                            <span style="font-weight:500;"><i class="fas fa-suitcase"></i> `+airline_pick_list[i].segments[j].fares[k].fare_details[l].amount+` `+airline_pick_list[i].segments[j].fares[k].fare_details[l].unit+`</span><br/>`;
                                        }
                                    }
                                break;
                                }
                            }
                        text+=`</div>
                        <div class="col-lg-12" style="padding-top:10px;">
                            <button style="text-align:left; width:unset; line-height:20px; font-size:13px; height:50px;" id="show_choose_seat`+i+``+j+`" type="button" class="form-control primary-btn-white dropdown-toggle" data-toggle="dropdown">`;
                            if(airline[i].can_book == true){
                                 text+=`<img src="/static/tt_website_rodextrip/img/icon/seat.png" style="height:16px; width:auto;"> <span id="choose_seat_span`+i+``+j+`">Choose Seat Class</span>`;
                            }else{
                                 text+=`<img src="/static/tt_website_rodextrip/img/icon/seat.png" style="height:16px; width:auto;"> <span id="choose_seat_span`+i+``+j+`">SOLD OUT</span>`;
                            }

                            text+=`
                            </button>
                            <ul id="provider_seat_content`+i+``+j+`" class="dropdown-menu" style="background:unset; padding:0px 15px 15px 15px; z-index:5; border:unset;">
                               <div style="background:white; padding:15px; border:1px solid #cdcdcd; overflow-y:auto; height:200px;">
                                   <div class="row">
                                       <div class="col-lg-12">
                                            <h6>(Class Of Service / Seat left)</h6>
                                            <hr/>
                                       </div>`;
                                        for(k in airline_pick_list[i].segments[j].fares){
                                            temp_seat_name = '';
                                            text+=`
                                            <div class="col-xs-12">`;
                                            var total_price = 0;
                                            for(l in airline_pick_list[i].segments[j].fares[k].service_charge_summary){
                                                if(airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].pax_type == 'ADT'){
                                                    for(m in airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges)
                                                        if(airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'tax' || airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'fare' || airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'roc')
                                                            total_price+= airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].amount;
                                                    break;
                                                }
                                            }

                                            if(k==airline_pick_list[i].segments[j].fare_pick){
                                            text+=`
                                                <label class="radio-button-custom">
                                                `+airline_pick_list[i].segments[j].fares[k].class_of_service;
                                                if(airline_pick_list[i].segments[j].fares[k].cabin_class != '')
                                                    if(airline_pick_list[i].segments[j].fares[k].cabin_class == 'Y'){
                                                        text += ' (Economy)';
                                                        temp_seat_name += ' (Economy)';
                                                    }
                                                    else if(airline_pick_list[i].carrier_code_list.includes('QG') && airline_pick_list[i].segments[j].fares[k].cabin_class == 'W'){
                                                        text += ' (Royal Green)';
                                                        temp_seat_name += ' (Royal Green)';
                                                    }
                                                    else if(airline_pick_list[i].segments[j].fares[k].cabin_class == 'W'){
                                                        text += ' (Premium Economy)';
                                                        temp_seat_name += ' (Premium Economy)';
                                                    }
                                                    else if(airline_pick_list[i].segments[j].fares[k].cabin_class == 'C'){
                                                        text += ' (Business)';
                                                        temp_seat_name += ' (Business)';
                                                    }
                                                    else if(airline_pick_list[i].segments[j].fares[k].cabin_class == 'F'){
                                                        text += ' (First Class)';
                                                        temp_seat_name += ' (First Class)';
                                                    }
                                                text+=`</span> / <span>`+airline_pick_list[i].segments[j].fares[k].available_count+`
                                                <input id="journeypick`+airline_pick_list[i].airline_pick_sequence+`segment`+j+`fare" name="journeypick`+airline_pick_list[i].airline_pick_sequence+`segment`+j+`fare" type="radio" value="`+k+`" checked="checked" disabled>
                                                <span class="checkmark-radio"></span>`;
                                                text+=`<br/>`;
                                                text+=`<span id="journeypick`+airline_pick_list[i].airline_pick_sequence+`segment`+j+`fare`+k+`" class="price_template" style="font-weight:bold;">`+airline_pick_list[i].currency+` `+getrupiah(total_price)+`</span>`;
                                            }
                                            else{
                                            text+=`
                                            <label class="radio-button-custom" style="color:#cdcdcd !important; cursor:not-allowed;">
                                                `+airline_pick_list[i].segments[j].fares[k].class_of_service;
                                                if(airline_pick_list[i].segments[j].fares[k].cabin_class != '')
                                                    if(airline_pick_list[i].segments[j].fares[k].cabin_class == 'Y'){
                                                        text += ' (Economy)';
                                                        temp_seat_name += ' (Economy)';
                                                    }
                                                    else if(airline_pick_list[i].carrier_code_list.includes('QG') && airline_pick_list[i].segments[j].fares[k].cabin_class == 'W'){
                                                        text += ' (Royal Green)';
                                                        temp_seat_name += ' (Royal Green)';
                                                    }
                                                    else if(airline_pick_list[i].segments[j].fares[k].cabin_class == 'W'){
                                                        text += ' (Premium Economy)';
                                                        temp_seat_name += ' (Premium Economy)';
                                                    }
                                                    else if(airline_pick_list[i].segments[j].fares[k].cabin_class == 'C'){
                                                        text += ' (Business)';
                                                        temp_seat_name += ' (Business)';
                                                    }
                                                    else if(airline_pick_list[i].segments[j].fares[k].cabin_class == 'F'){
                                                        text += ' (First Class)';
                                                        temp_seat_name += ' (First Class)';
                                                    }
                                                text+=`</span> / <span>`+airline_pick_list[i].segments[j].fares[k].available_count+`
                                                <input id="journeypick`+airline_pick_list[i].airline_pick_sequence+`segment`+j+`fare" name="journeypick`+airline_pick_list[i].airline_pick_sequence+`segment`+j+`fare" type="radio" value="`+k+`" disabled>
                                                <span class="checkmark-radio"></span>`;
                                                text+=`<br/>`;
                                                text+=`<span id="journeypick`+airline_pick_list[i].airline_pick_sequence+`segment`+j+`fare`+k+`" class="price_template" style="color:#cdcdcd !important; font-weight:bold;">`+airline_pick_list[i].currency+` `+getrupiah(total_price)+`</span>`;

                                            }

                                            if(airline_pick_list[i].segments[j].fares[k].fare_name){
                                               text+=`<br/><span>`+airline_pick_list[i].segments[j].fares[k].fare_name+`</span>`;
                                            }

                                            if(airline_pick_list[i].segments[j].fares[k].description.length != 0){
                                                text+=`<br/>`;
                                                for(l in airline_pick_list[i].segments[j].fares[k].description){
                                                    text += `<span style="display:block;">`+airline_pick_list[i].segments[j].fares[k].description[l]+`</span>`;
                                                    if(l != airline_pick_list[i].segments[j].fares[k].description.length -1)
                                                        text += '';
                                                }
                                            }
                                            text+=`</label></div>`;
                                        }
                                        text+=`
                                    </div>
                                </ul>
                            </div>
                        </div>
                    </div>`;
                }
                text+=`
                        </div>
                        </div>
                    </div>
                </div>
            </div>`;
    }
    document.getElementById('airline_reissue_div').innerHTML = text;

    try{
        if(airline_pick_list[i].hasOwnProperty('search_banner')){
       for(banner_counter in airline_pick_list[i].search_banner){
           var max_banner_date = moment().subtract(parseInt(-1*airline_pick_list[i].search_banner[banner_counter].minimum_days), 'days').format('YYYY-MM-DD');
           var selected_banner_date = moment(airline_pick_list[i].departure_date.split(' - ')[0]).format('YYYY-MM-DD');

           if(selected_banner_date >= max_banner_date){
               if(airline_pick_list[i].search_banner[banner_counter].active == true && airline_pick_list[i].search_banner[banner_counter].description != ''){
                   new jBox('Tooltip', {
                        attach: '#pop_search_banner'+i+banner_counter,
                        theme: 'TooltipBorder',
                        width: 280,
                        position: {
                          x: 'center',
                          y: 'bottom'
                        },
                        closeOnMouseleave: true,
                        animation: 'zoomIn',
                        content: airline_pick_list[i].search_banner[banner_counter].description
                   });
               }
           }
       }
   }
    }catch(err){

    }

}

function get_price_itinerary_reissue_request(airline_response, total_admin_fee, msg){
    //ganti dari response
    text = '';
    total_price = 0;
    commission_price = 0;
    rules = 0;
    $text = '';

    //old
    $text += 'Order Number: '+ airline_get_detail.result.response.order_number + '\n';
    //$text += 'Hold Date: ' + airline_get_detail.result.response.hold_date + '\n';
    $text += airline_get_detail.result.response.state_description + '\n';
    flight_counter = 1;
    for(i in airline_get_detail.result.response.provider_bookings){
        $text += 'Booking Code: ' + airline_get_detail.result.response.provider_bookings[i].pnr+'\n';
        for(j in airline_get_detail.result.response.provider_bookings[i].journeys){
            $text += 'Flight '+ flight_counter+'\n';
            for(k in airline_get_detail.result.response.provider_bookings[i].journeys[j].segments){
                var cabin_class = '';
                //yang baru harus diganti
                if(airline_get_detail.result.response.provider_bookings[i].journeys[j].segments[k].cabin_class == 'Y')
                    cabin_class = 'Economy Class';
                else if(airline_get_detail.result.response.provider_bookings[i].journeys[j].segments[k].carrier_code == 'QG' && airline_get_detail.result.response.provider_bookings[i].journeys[j].segments[k].cabin_class == 'W')
                    cabin_class = 'Royal Green Class';
                else if(airline_get_detail.result.response.provider_bookings[i].journeys[j].segments[k].cabin_class == 'W')
                    cabin_class = 'Premium Economy Class';
                else if(airline_get_detail.result.response.provider_bookings[i].journeys[j].segments[k].cabin_class == 'C')
                    cabin_class = 'Business Class';
                else if(airline_get_detail.result.response.provider_bookings[i].journeys[j].segments[k].cabin_class == 'F')
                    cabin_class = 'First Class';
                for(l in airline_get_detail.result.response.provider_bookings[i].journeys[j].segments[k].legs){
                    try{
                        $text += airline_carriers[airline_get_detail.result.response.provider_bookings[i].journeys[j].segments[k].carrier_code].name + ' ' + airline_get_detail.result.response.provider_bookings[i].journeys[j].segments[k].carrier_number;
                    }catch(err){
                        $text += airline_get_detail.result.response.provider_bookings[i].journeys[j].segments[k].carrier_code + ' ' + airline_get_detail.result.response.provider_bookings[i].journeys[j].segments[k].carrier_number;
                    }
                    if(cabin_class != '')
                        $text += ' ' + cabin_class;
                    else
                        $text += ' ' + cabin_class;
                    $text += '\n';
                    if(airline_get_detail.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].arrival_date.split('  ')[0] == airline_get_detail.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].departure_date.split('  ')[0]){
                        $text += airline_get_detail.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].departure_date.split('  ')[0]+' ';
                        $text += airline_get_detail.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].departure_date.split('  ')[1]+' - ';
                        $text += airline_get_detail.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].arrival_date.split('  ')[1]+'\n';
                    }else{
                        $text += airline_get_detail.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].departure_date.split('  ')[0]+' ';
                        $text += airline_get_detail.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].departure_date.split('  ')[1]+' - ';
                        $text += airline_get_detail.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].arrival_date.split('  ')[0]+' ';
                        $text += airline_get_detail.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].arrival_date.split('  ')[1]+'\n';
                    }
                    $text += airline_get_detail.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].origin_name +' ('+airline_get_detail.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].origin_city+') - '+airline_get_detail.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].destination_name +' ('+airline_get_detail.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].destination_city+')\n\n';
                }
            }
        }
    }
    //old


    text += `
    <div class="col-lg-12" style="background-color:white; padding:10px; border: 1px solid #cdcdcd; margin-bottom:15px;">
        <div class="row">
            <div class="col-lg-12">
                <div class="alert alert-warning" role="alert">
                    <span style="font-weight:bold;"> Please check before going to the next page!</span>
                </div>
            </div>
            <div class="col-lg-12">
                <div class="row">`;
    flight_count = 0;
    $text +='New schedule\n';
    for(i in airline_response){
        text+=`
        <div class="col-lg-12" style="max-height:400px; overflow-y: auto;">`;
        flight_count++;
        text += `<hr/><h6>Flight `+flight_count+`</h6>`;
        $text +='Flight '+flight_count+'\n';
 text+=`</div>
        <div class="col-lg-12">`;
        //logo
        for(j in airline_response[i].carrier_code_list){ //print gambar airline
            try{
                text+=`
                <span style="font-weight: 500; font-size:12px;">`+airline_carriers[airline_response[i].carrier_code_list[j]].name+`</span><br/>
                <img data-toggle="tooltip" alt="`+airline_carriers[airline_response[i].carrier_code_list[j]].name+`" title="`+airline_carriers[airline_response[i].carrier_code_list[j]].name+`" style="width:50px; height:50px;" src="`+static_path_url_server+`/public/airline_logo/`+airline_response[i].carrier_code_list[j]+`.png"><span> </span>`;
            }catch(err){
                text+=`<img data-toggle="tooltip" alt="Airline" title="" style="width:50px; height:50px;" src="`+static_path_url_server+`/public/airline_logo/`+airline_response[i].carrier_code_list[j]+`.png"><span> </span>`;
            }
        }
        text+=`</div>`;
        text+=`<div class="col-lg-12">`;
        price = 0;
        //adult
        currency = '';
        for(j in airline_response[i].segments){
            //datacopy
            $text += airline_carriers[airline_response[i].segments[j].carrier_code].name + ' ' + airline_response[i].segments[j].carrier_code + airline_response[i].segments[j].carrier_number + '\n';
            $text += airline_response[i].segments[j].departure_date + ' → ' + airline_response[i].segments[j].arrival_date + '\n';
            $text += airline_response[i].segments[j].origin_name + ' (' + airline_response[i].segments[j].origin_city + ') - ';
            $text += airline_response[i].segments[j].destination_name + ' (' + airline_response[i].segments[j].destination_city + ')\n\n';

            for(k in airline_response[i].segments[j].legs){
                text+=`
                    <div class="row">
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                            <table style="width:100%">
                                <tr>
                                    <td class="airport-code"><h5>`+airline_response[i].segments[j].legs[k].departure_date.split(' - ')[1]+`</h5></td>
                                    <td style="padding-left:15px;">
                                        <img src="/static/tt_website_rodextrip/img/icon/airlines-01.png" alt="Airline" style="width:20px; height:20px;"/>
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
                            <span style="font-size:13px;">`+airline_response[i].segments[j].legs[k].departure_date.split(' - ')[0]+`</span></br>
                            <span style="font-size:13px; font-weight:500;">`+airline_response[i].segments[j].legs[k].origin_city+` (`+airline_response[i].segments[j].legs[k].origin+`)</span>
                        </div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                            <table style="width:100%; margin-bottom:6px;">
                                <tr>
                                    <td><h5>`+airline_response[i].segments[j].legs[k].arrival_date.split(' - ')[1]+`</h5></td>
                                    <td></td>
                                    <td style="height:30px;padding:0 15px;width:100%"></td>
                                </tr>
                            </table>
                            <span style="font-size:13px;">`+airline_response[i].segments[j].legs[k].arrival_date.split(' - ')[0]+`</span><br/>
                            <span style="font-size:13px; font-weight:500;">`+airline_response[i].segments[j].legs[k].destination_city+` (`+airline_response[i].segments[j].legs[k].destination+`)</span>
                        </div>
                    </div>`;
            }
            if(j == airline_response[i].segments.length - 1)
                text+=`</div>`;
            price_list = {};
            try{//adult
                if(airline_response[i].segments[j].fares.length > 0){
                    $text+= 'Price\n';
                    for(k in airline_response[i].segments[j].fares){
                        for(l in airline_response[i].segments[j].fares[k].service_charge_summary){
                            if(airline_response[i].segments[j].fares[k].service_charge_summary[l].hasOwnProperty('total_commission') == true)
                                commission += airline_response[i].segments[j].fares[k].service_charge_summary[l].total_commission;
                            price += airline_response[i].segments[j].fares[k].service_charge_summary[l].total_price;
                            if(currency == '')
                                currency = airline_response[i].segments[j].fares[k].service_charge_summary[l].service_charges[0].currency;
                            text+=`
                            <div class="col-lg-12">
                                <div class="row">
                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                                        <span style="font-size:13px; font-weight:500;">`+airline_response[i].segments[j].fares[k].service_charge_summary[l].pax_count+`x `+airline_response[i].segments[j].fares[k].service_charge_summary[l].pax_type+` @`+currency+` `+getrupiah(airline_response[i].segments[j].fares[k].service_charge_summary[l].total_price/airline_response[i].segments[j].fares[k].service_charge_summary[l].pax_count)+`</span><br/>
                                    </div>
                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                                        <span style="font-size:13px; font-weight:500;">`+currency +' '+getrupiah(Math.ceil(airline_response[i].segments[j].fares[k].service_charge_summary[l].total_price))+`</span><br/>
                                    </div>
                                </div>
                            </div>`;
                            $text += airline_response[i].segments[j].fares[k].service_charge_summary[l].pax_count+`x `+airline_response[i].segments[j].fares[k].service_charge_summary[l].pax_type+ ' Price'+ currency +' '+getrupiah(Math.ceil(airline_response[i].segments[j].fares[k].service_charge_summary[l].total_price/airline_response[i].segments[j].fares[k].service_charge_summary[l].pax_count))+'\n';
                        }
                    }
                    total_price += price
                    price = 0;
                }
            }catch(err){
                console.log(err);
            }
        }


        $text += '\n';
    }
    var print_hr = true;
    for(i in msg){
        for(j in msg[i].passengers){
            if(msg[i].passengers[j].fees.length > 0){
                if(print_hr){
                    text += `<hr/>`;
                    print_hr = false;
                }
                text+=`
                <div class="col-lg-12">
                    <div class="row">
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="text-align:left;">
                            <span style="font-size:13px; font-weight:500;"> `+msg[i].passengers[j].title+` `+msg[i].passengers[j].first_name+` `+msg[i].passengers[j].last_name+`</span><br/>
                        </div>
                    </div>
                </div>`;
            }
            for(k in msg[i].passengers[j].fees){
                text +=`
                <div class="col-lg-12">
                    <div class="row">
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                            <span style="font-size:13px; font-weight:500;">- `+msg[i].passengers[j].fees[k].fee_type+` </span><br/>
                        </div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                            <span style="font-size:13px; font-weight:500;">`+currency +' '+getrupiah(Math.ceil(msg[i].passengers[j].fees[k].base_price))+`</span><br/>
                        </div>
                    </div>
                </div>`;
                total_price += msg[i].passengers[j].fees[k].base_price;
            }
        }
    }

    text+=`
        </div>
    </div>`;
    text_err = '';
    for(i in msg){
        for(j in msg[i]['messages']){
            if(i == 0 && j == 0){
                text_err += `<div class="col-lg-12">
                                <div class="row">`;
            }
            text_err += `
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="text-align:left;">
                <span style="font-size:14px;color:red;">`+msg[i]['messages'][j]+`</span>
            </div>`
        }
    }
    if(text_err != '')
        text_err += `</div></div>`;
    text += text_err;
    text+=`
    <div class="col-lg-12" id='additional_price_information_rs' hidden>
    </div>`;
    if(airline_get_detail.result.response.state == 'booked' ){
        text+=`
    <div class="col-lg-12">
        <hr/>
        <div class="row">
            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                <span style="font-size:14px; font-weight: bold;"><b>Total</b></span>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                <span style="font-size:14px; font-weight: bold;" id="total_price_rs"><b>`+currency+` `+getrupiah(Math.ceil(total_price))+`</b></span>
            </div>
        </div>
    </div>`;
    }else{
        text+=`
    <div class="col-lg-12">
        <hr/>
        <div class="row">
            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                <span style="font-size:14px; font-weight: bold;"><b>Admin Fee</b></span>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                <span style="font-size:14px; font-weight: bold;"><b>`+currency+` `+getrupiah(Math.ceil(total_admin_fee))+`</b></span>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                <span style="font-size:14px; font-weight: bold;"><b>Total</b></span>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                <span style="font-size:14px; font-weight: bold;"><b>`+currency+` `+getrupiah(Math.ceil(total_price) + Math.ceil(total_admin_fee))+`</b></span>
            </div>
        </div>
    </div>`;
    }
    text+=`
    <div class="col-lg-12" style="padding-bottom:10px;">
    <hr/>
    <span style="font-size:14px; font-weight:bold;">Share This on:</span><br/>`;
    $text += '‣ Admin Fee: IDR '+ getrupiah(Math.ceil(total_admin_fee)) + '\n';
    $text += '‣ Grand Total: IDR '+ getrupiah(Math.ceil(total_price) + Math.ceil(total_admin_fee)) + '\nPrices and availability may change at any time';
    share_data();
    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
        text+=`
            <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png" alt="Whatsapp"/></a>
            <a href="line://msg/text/`+ $text_share +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png" alt="Line"/></a>
            <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png" alt="Telegram"/></a>
            <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png" alt="Email"/></a>`;
    } else {
        text+=`
            <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png" alt="Whatsapp"/></a>
            <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png" alt="Line"/></a>
            <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png" alt="Telegram"/></a>
            <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png" alt="Email"/></a>`;
    }

    text+=`
        </div>
    </div>`;
    if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
        text+=`
        <div class="row" id="show_commission" style="display:none;">
            <div class="col-lg-12 col-xs-12" style="text-align:center;">
                <div class="alert alert-success">
                    <span style="font-size:13px; font-weight: bold;">Your Commission: `+currency+` `+getrupiah(commission*-1)+`</span><br>
                </div>
            </div>
        </div>`;
    text+=`
        <div style="padding-bottom:10px;">
            <center>
                <input type="button" class="primary-btn-white" style="width:100%;" onclick="copy_data();" value="Copy"/><br/>
            </center>
        </div>`;
    if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
        text+=`
        <div style="padding-bottom:10px;">
            <center>
                <input type="button" class="primary-btn-white" style="width:100%;" onclick="show_commission('commission');" id="show_commission_button" value="Show Commission"/><br/>
            </center>
        </div>`;
    text+=`</div>`;

    document.getElementById('airline_detail').innerHTML = text;
    $("#myModal_price_itinerary").modal();

    $('.btn-next').prop('disabled', true);
    $('#loading-search-flight').hide();
    $('#choose-ticket-flight').hide();
}

function get_price_reissue_construct(){
    title = '';
    if(airline_get_detail.result.response.state == 'booked')
        title = 'Are you sure want to check this journey?';
    else
        title = 'Are you sure want to check this journey?';
    Swal.fire({
      title: title,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
        if (result.value) {
            if (result.value == true){
            show_loading();
            please_wait_transaction();
//                document.getElementById('next_reissue').disabled = true;
                $.ajax({
                   type: "POST",
                   url: "/webservice/airline",
                   headers:{
                        'action': 'get_price_reissue_construct',
                   },
            //       url: "{% url 'tt_backend_rodextrip:social_media_tree_update' %}",
                   data: {
                        "journeys_booking": JSON.stringify(journey),
                        "passengers":JSON.stringify({
                            "adult": airline_get_detail.result.response.ADT,
                            "child": airline_get_detail.result.response.CHD,
                            "infant": airline_get_detail.result.response.INF
                        }),
                        'signature': signature,
                        "pnr": JSON.stringify(pnr_list),
                        'booking': JSON.stringify(airline_get_detail)
                   },
                   success: function(msg) {
                       hide_modal_waiting_transaction();
                       document.getElementById('show_loading_booking_airline').hidden = false;
                       if(msg.result.error_code == 0){
                           for(i in journey){
                               try{
                                   document.getElementById('changejourney_pick'+parseInt(1+parseInt(i))).disabled = true;
                                   document.getElementById('changejourney_pick'+parseInt(1+parseInt(i))).onclick = '';
                               }catch(err){
                                console.log(err); // error kalau ada element yg tidak ada
                               }
                           }
                           airline_response = [];
                           airline_route = [];
                           check_seat = 0;
                           for(i in msg.result.response.sell_reschedule_provider){
                               for(j in msg.result.response.sell_reschedule_provider[i].journeys){
                                   airline_response.push(msg.result.response.sell_reschedule_provider[i].journeys[j]);
                                   for(k in msg.result.response.sell_reschedule_provider[i].journeys[j].segments){
                                       if(msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].seat_cabins.length > 0){
                                           check_seat = 1;
                                           airline_route.push(msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].origin+' - '+msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].destination)
                                       }
                                   }
                               }
                           }
                           for(i=0;i<airline_response.length;i++){
                                for(j=i;j<airline_response.length;j++){
                                    if(airline_response[i].departure_date > airline_response[j].departure_date){
                                        temp = airline_response[i];
                                        airline_response[i] = airline_response[j];
                                        airline_response[j] = temp;
                                    }
                                }
                           }
                           //change date moment
                           for(i=0;i<airline_response.length;i++){

                           }
                           get_price_itinerary_reissue_request(airline_response, msg.result.response.total_admin_fee, msg.result.response.sell_reschedule_provider);
                           if(airline_get_detail.result.response.state == 'issued'){
                               get_payment_acq('Issued',airline_get_detail.result.response.booker.seq_id, airline_get_detail.result.response.order_number, 'billing',signature,'airline_reissue');
                               document.getElementById('payment_acq').hidden = false;
                           }else{
//                               document.getElementById('airline_detail').innerHTML += `<input type="button" class="primary-btn issued_booking_btn" style="width:100%;" onclick="update_booking_after_sales(true);" value="Continue">`;
                               document.getElementById('airline_detail').innerHTML += `<input type="button" class="primary-btn issued_booking_btn" style="width:100%;" onclick="update_booking_after_sales_v2(true);" value="Continue">`;
                               document.getElementById('payment_acq').innerHTML = '';
                           }
                           if(check_seat){
                               document.getElementById('airline_booking').innerHTML += `
                                    <div class="row">
                                        <div class="col-lg-12">
                                            <h5 style="padding-top:10px; padding-bottom:10px;">Airline Route</h5>
                                            <div class="row" id="airline_seat_map" style="padding-bottom:15px;">`;
                               first_value = true;
                               passengers = JSON.parse(JSON.stringify(airline_get_detail.result.response.passengers));
                               seat_map = {
                                    "seat_availability_provider" : []
                               }
                               for(i in msg.result.response.sell_reschedule_provider){
                                   for(j in msg.result.response.sell_reschedule_provider[i].journeys){
                                       airline_response.push(msg.result.response.sell_reschedule_provider[i].journeys[j]);
                                       for(k in msg.result.response.sell_reschedule_provider[i].journeys[j].segments){
                                           if(msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].seat_cabins.length > 0){
                                                check_provider = false;
                                                for(l in seat_map.seat_availability_provider){
                                                    if(seat_map.seat_availability_provider[l].provider == msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].provider){
                                                        check_provider = true;
                                                        break;
                                                    }
                                                }
                                                if(!check_provider){
                                                    seat_map.seat_availability_provider.push({
                                                        "provider": msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].provider,
                                                        "status": "available",
                                                        "pnr": msg.result.response.sell_reschedule_provider[i].pnr,
                                                        "segments": []
                                                    })
                                                }
                                                for(l in seat_map.seat_availability_provider){
                                                    if(seat_map.seat_availability_provider[l].provider == msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].provider &&
                                                       seat_map.seat_availability_provider[l].pnr == msg.result.response.sell_reschedule_provider[i].pnr){
                                                       seat_map.seat_availability_provider[l].segments.push(msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k])
                                                       break;
                                                    }
                                                }
                                                for(l in passengers){
                                                    if(!passengers[l].hasOwnProperty('seat_list'))
                                                        passengers[l]['seat_list'] = [];
                                                    passengers[l]['seat_list'].push({
                                                        "segment_code": msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].segment_code2,
                                                        "departure_date": msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].departure_date,
                                                        "seat_pick": "",
                                                        "seat_code": "",
                                                        "seat_name": "",
                                                        "description": "",
                                                        "currency": "",
                                                        "price": "",
                                                        "pnr": msg.result.response.sell_reschedule_provider[i].pnr
                                                    });
                                                }

                                                if(first_value == true){
                                                    set_seat_show_segments = msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].segment_code2+'_'+msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].departure_date;
                                                    document.getElementById('airline_booking').innerHTML+= `
                                                        <div class="col-lg-4 col-md-6 col-sm-6 col-xs-6">
                                                            <button class="button-seat-pass" style="width:100%; margin-right:10px; margin-bottom:10px; padding:10px;color:`+text_color+`; background-color:`+color+`;" type="button" id="`+msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].segment_code2+`_`+msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].departure_date+`" onclick="show_seat_map('`+msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].segment_code2+`_`+msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].departure_date+`', false)">
                                                                <span>`+msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].segment_code2+`</span>
                                                            </button>
                                                        </div>`;
                                                    first_value = false;
                                                }else{
                                                    document.getElementById('airline_booking').innerHTML+= `
                                                        <div class="col-lg-4 col-md-6 col-sm-6 col-xs-6">
                                                            <button class="button-seat-pass" style="width:100%; margin-right:10px; margin-bottom:10px; padding:10px;color:black; background-color:white;" type="button" id="`+msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].segment_code2+`_`+msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].departure_date+`" onclick="show_seat_map('`+msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].segment_code2+`_`+msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].departure_date+`', false)">
                                                                <span>`+msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].segment_code2+`</span>
                                                            </button>
                                                        </div>`;
                                                }
                                           }
                                        }
                                    }
                                }

                               document.getElementById('airline_booking').innerHTML+= `

                                            </div>
                                        </div>
                                        <div class="col-lg-12">
                                            <h5 style="padding-top:10px; padding-bottom:10px;">Passenger</h5>
                                            <div class="row">`;
                                            for(i in airline_get_detail.result.response.passengers){
                                                document.getElementById('airline_booking').innerHTML+= `
                                                    <div class="col-lg-4 col-md-6 col-sm-6 col-xs-6">
                                                        <input title="`+airline_get_detail.result.response.passengers[i].title+` `+airline_get_detail.result.response.passengers[i].name+`" class="button-seat-pass" type="button" id="passenger`+parseInt(parseInt(i)+1)+`" style="width:100%; background-color:white;padding:10px; margin-right:10px; text-align:center;margin-bottom:10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color:black;" onclick="set_passenger_seat_map_airline(`+i+`);" value="`+airline_get_detail.result.response.passengers[i].title+` `+airline_get_detail.result.response.passengers[i].name+`">
                                                    </div>`;
                                            }
                                            document.getElementById('airline_booking').innerHTML+= `
                                            </div>
                                            <div id="airline_passenger_detail_seat">

                                            </div>
                                        </div>
                                        <div class="col-lg-12" style="padding-bottom:10px;">
                                            <hr/>
                                            <div class="row">
                                                <div class="col-lg-4 col-sm-4 col-md-4 col-xs-4">
                                                    <div style="text-align:center">
                                                        <span class="button-seat-map2" style="background-color:`+color+`"></span>
                                                        <br/>
                                                        <h6>Selected</h6>
                                                    </div>
                                                </div>
                                                <div class="col-lg-4 col-sm-4 col-md-4 col-xs-4">
                                                    <div style="text-align:center">
                                                        <span class="button-seat-map2" style="background-color:#656565"></span>
                                                        <br/>
                                                        <h6>Not Available</h6>
                                                    </div>
                                                </div>
                                                <div class="col-lg-4 col-sm-4 col-md-4 col-xs-4">
                                                    <div style="text-align:center">
                                                        <span class="button-seat-map2" style="background-color:#CACACA"></span>
                                                        <br/>
                                                        <h6>Available</h6>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="slideshow-container" id="airline_slideshow" style="padding-top:15px;">

                                            </div>
                                        </div>
                                    </div>
                               `;
                               slideIndex = [1,1];
                               slideId = ["mySlides1", "mySlides2"];
                               type = 'reschedule';
                               set_first_passenger_seat_map_airline(0);
                               show_seat_map(set_seat_show_segments, true)
                           }
                       }else{
                           //harus nya login ulang
                           Swal.fire({
                              type: 'error',
                              title: 'Oops...',
                              text: msg.result.error_msg,
                           })
                           hide_modal_waiting_transaction();
                           $('.loader-rodextrip').fadeOut();
                       }
                   },
                   error: function(XMLHttpRequest, textStatus, errorThrown) {
                        error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error airline sell journey reissue');
                        hide_modal_waiting_transaction();
                        $('.loader-rodextrip').fadeOut();
                   },timeout: 300000
                });
            }else{

            }

        }else{

        }
    })
}

function sell_journey_reissue_construct(){
    title = '';
    if(airline_get_detail.result.response.state == 'booked')
        title = 'Are you sure want to change your booking?';
    else
        title = 'Are you sure want to reissue?';
    Swal.fire({
      title: 'Are you sure want to reissue?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
        if (result.value) {
            if (result.value == true){
            show_loading();
            please_wait_transaction();
//                document.getElementById('next_reissue').disabled = true;
                $.ajax({
                   type: "POST",
                   url: "/webservice/airline",
                   headers:{
                        'action': 'sell_journey_reissue_construct',
                   },
            //       url: "{% url 'tt_backend_rodextrip:social_media_tree_update' %}",
                   data: {
                        "journeys_booking": JSON.stringify(journey),
                        "passengers":JSON.stringify({
                            "adult": airline_get_detail.result.response.ADT,
                            "child": airline_get_detail.result.response.CHD,
                            "infant": airline_get_detail.result.response.INF
                        }),
                        'signature': signature,
                        "pnr": JSON.stringify(pnr_list),
                        'booking': JSON.stringify(airline_get_detail)
                   },
                   success: function(msg) {
                       hide_modal_waiting_transaction();
                       document.getElementById('show_loading_booking_airline').hidden = false;
                       if(msg.result.error_code == 0){
                           for(i in journey){
                               try{
                                   document.getElementById('changejourney_pick'+parseInt(1+parseInt(i))).disabled = true;
                                   document.getElementById('changejourney_pick'+parseInt(1+parseInt(i))).onclick = '';
                               }catch(err){
                                console.log(err); // error kalau ada element yg tidak ada
                               }
                           }
                           airline_response = [];
                           airline_route = [];
                           check_seat = 0;
                           for(i in msg.result.response.sell_reschedule_provider){
                               for(j in msg.result.response.sell_reschedule_provider[i].journeys){
                                   airline_response.push(msg.result.response.sell_reschedule_provider[i].journeys[j]);
                                   for(k in msg.result.response.sell_reschedule_provider[i].journeys[j].segments){
                                       if(msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].hasOwnProperty('seat_cabins') && msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].seat_cabins.length > 0){
                                           check_seat = 1;
                                           airline_route.push(msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].origin+' - '+msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].destination)
                                       }
                                   }
                               }
                           }
                           for(i=0;i<airline_response.length;i++){
                                for(j=i;j<airline_response.length;j++){
                                    if(airline_response[i].departure_date > airline_response[j].departure_date){
                                        temp = airline_response[i];
                                        airline_response[i] = airline_response[j];
                                        airline_response[j] = temp;
                                    }
                                }
                           }
                           //change date moment
                           for(i=0;i<airline_response.length;i++){

                           }
                           get_price_itinerary_reissue_request(airline_response, msg.result.response.total_admin_fee, msg.result.response.sell_reschedule_provider);
                           if(airline_get_detail.result.response.state == 'issued'){
                               get_payment_acq('Issued',airline_get_detail.result.response.booker.seq_id, airline_get_detail.result.response.order_number, 'billing',signature,'airline_reissue');
                               document.getElementById('payment_acq').hidden = false;
                           }else{
//                               document.getElementById('airline_detail').innerHTML += `<input type="button" class="primary-btn issued_booking_btn" style="width:100%;" onclick="update_booking_after_sales(true);" value="Continue">`;
                               document.getElementById('airline_detail').innerHTML += `<input type="button" class="primary-btn issued_booking_btn" style="width:100%;" onclick="update_booking_after_sales_v2(true);" value="Continue">`;
                               document.getElementById('payment_acq').innerHTML = '';
                           }
                           if(check_seat){
                               document.getElementById('airline_booking').innerHTML += `
                                    <div class="row">
                                        <div class="col-lg-12">
                                            <h5 style="padding-top:10px; padding-bottom:10px;">Airline Route</h5>
                                            <div class="row" id="airline_seat_map" style="padding-bottom:15px;">`;
                               first_value = true;
                               passengers = JSON.parse(JSON.stringify(airline_get_detail.result.response.passengers));
                               seat_map = {
                                    "seat_availability_provider" : []
                               }
                               for(i in msg.result.response.sell_reschedule_provider){
                                   for(j in msg.result.response.sell_reschedule_provider[i].journeys){
                                       airline_response.push(msg.result.response.sell_reschedule_provider[i].journeys[j]);
                                       for(k in msg.result.response.sell_reschedule_provider[i].journeys[j].segments){
                                           if(msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].hasOwnProperty('seat_cabins') && msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].seat_cabins.length > 0){
                                                check_provider = false;
                                                for(l in seat_map.seat_availability_provider){
                                                    if(seat_map.seat_availability_provider[l].provider == msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].provider){
                                                        check_provider = true;
                                                        break;
                                                    }
                                                }
                                                if(!check_provider){
                                                    seat_map.seat_availability_provider.push({
                                                        "provider": msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].provider,
                                                        "status": "available",
                                                        "pnr": msg.result.response.sell_reschedule_provider[i].pnr,
                                                        "segments": []
                                                    })
                                                }
                                                for(l in seat_map.seat_availability_provider){
                                                    if(seat_map.seat_availability_provider[l].provider == msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].provider &&
                                                       seat_map.seat_availability_provider[l].pnr == msg.result.response.sell_reschedule_provider[i].pnr){
                                                       seat_map.seat_availability_provider[l].segments.push(msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k])
                                                       break;
                                                    }
                                                }
                                                for(l in passengers){
                                                    if(!passengers[l].hasOwnProperty('seat_list'))
                                                        passengers[l]['seat_list'] = [];
                                                    passengers[l]['seat_list'].push({
                                                        "segment_code": msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].segment_code2,
                                                        "departure_date": msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].departure_date,
                                                        "seat_pick": "",
                                                        "seat_code": "",
                                                        "seat_name": "",
                                                        "description": "",
                                                        "currency": "",
                                                        "price": "",
                                                        "pnr": msg.result.response.sell_reschedule_provider[i].pnr
                                                    });
                                                }

                                                if(first_value == true){
                                                    set_seat_show_segments = msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].segment_code2+'_'+msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].departure_date;
                                                    document.getElementById('airline_booking').innerHTML+= `
                                                        <div class="col-lg-4 col-md-6 col-sm-6 col-xs-6">
                                                            <button class="button-seat-pass" style="width:100%; margin-right:10px; margin-bottom:10px; padding:10px;color:`+text_color+`; background-color:`+color+`;" type="button" id="`+msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].segment_code2+`_`+msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].departure_date+`" onclick="show_seat_map('`+msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].segment_code2+`_`+msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].departure_date+`', false)">
                                                                <span>`+msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].segment_code2+`</span>
                                                            </button>
                                                        </div>`;
                                                    first_value = false;
                                                }else{
                                                    document.getElementById('airline_booking').innerHTML+= `
                                                        <div class="col-lg-4 col-md-6 col-sm-6 col-xs-6">
                                                            <button class="button-seat-pass" style="width:100%; margin-right:10px; margin-bottom:10px; padding:10px;color:black; background-color:white;" type="button" id="`+msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].segment_code2+`_`+msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].departure_date+`" onclick="show_seat_map('`+msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].segment_code2+`_`+msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].departure_date+`', false)">
                                                                <span>`+msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].segment_code2+`</span>
                                                            </button>
                                                        </div>`;
                                                }
                                           }
                                        }
                                    }
                                }

                               document.getElementById('airline_booking').innerHTML+= `

                                            </div>
                                        </div>
                                        <div class="col-lg-12">
                                            <h5 style="padding-top:10px; padding-bottom:10px;">Passenger</h5>
                                            <div class="row">`;
                                            for(i in airline_get_detail.result.response.passengers){
                                                document.getElementById('airline_booking').innerHTML+= `
                                                    <div class="col-lg-4 col-md-6 col-sm-6 col-xs-6">
                                                        <input title="`+airline_get_detail.result.response.passengers[i].title+` `+airline_get_detail.result.response.passengers[i].name+`" class="button-seat-pass" type="button" id="passenger`+parseInt(parseInt(i)+1)+`" style="width:100%; background-color:white;padding:10px; margin-right:10px; text-align:center;margin-bottom:10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color:black;" onclick="set_passenger_seat_map_airline(`+i+`);" value="`+airline_get_detail.result.response.passengers[i].title+` `+airline_get_detail.result.response.passengers[i].name+`">
                                                    </div>`;
                                            }
                                            document.getElementById('airline_booking').innerHTML+= `
                                            </div>
                                            <div id="airline_passenger_detail_seat">

                                            </div>
                                        </div>
                                        <div class="col-lg-12" style="padding-bottom:10px;">
                                            <hr/>
                                            <div class="row">
                                                <div class="col-lg-4 col-sm-4 col-md-4 col-xs-4">
                                                    <div style="text-align:center">
                                                        <span class="button-seat-map2" style="background-color:`+color+`"></span>
                                                        <br/>
                                                        <h6>Selected</h6>
                                                    </div>
                                                </div>
                                                <div class="col-lg-4 col-sm-4 col-md-4 col-xs-4">
                                                    <div style="text-align:center">
                                                        <span class="button-seat-map2" style="background-color:#656565"></span>
                                                        <br/>
                                                        <h6>Not Available</h6>
                                                    </div>
                                                </div>
                                                <div class="col-lg-4 col-sm-4 col-md-4 col-xs-4">
                                                    <div style="text-align:center">
                                                        <span class="button-seat-map2" style="background-color:#CACACA"></span>
                                                        <br/>
                                                        <h6>Available</h6>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="slideshow-container" id="airline_slideshow" style="padding-top:15px;">

                                            </div>
                                        </div>
                                    </div>
                               `;
                               slideIndex = [1,1];
                               slideId = ["mySlides1", "mySlides2"];
                               type = 'reschedule';
                               set_first_passenger_seat_map_airline(0);
                               show_seat_map(set_seat_show_segments, true)
                           }
                       }else{
                           //harus nya login ulang
                           Swal.fire({
                              type: 'error',
                              title: 'Oops...',
                              text: msg.result.error_msg,
                           })
                           $('.loader-rodextrip').fadeOut();
                       }
                   },
                   error: function(XMLHttpRequest, textStatus, errorThrown) {
                        error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error airline sell journey reissue');
                        $('.loader-rodextrip').fadeOut();
                   },timeout: 300000
                });
            }else{

            }

        }else{

        }
    })
}

function dismiss_reissue(){
    $('#myModal_reissue').modal('hide')
}

function dismiss_reissue_get_price(){
    $('#myModal_price_itinerary').modal('hide');
}

function reissue_airline_commit_booking(val){
    show_loading();
    data = {
        'value': val,
        'signature': signature
    }
    try{
        data['acquirer_seq_id'] = payment_acq2[payment_method][selected].acquirer_seq_id;
        data['member'] = payment_acq2[payment_method][selected].method;
    }catch(err){
    }
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'commit_booking',
       },
       data: data,
       success: function(msg) {
           if(msg.result.error_code == 0){
               //send order number
               document.getElementById('airline_booking').innerHTML = '';
               document.getElementById('airline_detail').innerHTML = '';
               document.getElementById('payment_acq').innerHTML = '';
               document.getElementById('reissued').innerHTML = '';
               document.getElementById('ssr_request_after_sales').innerHTML = '';
               $('.modal').modal('hide') // closes all active pop ups.
               $('.modal-backdrop').remove() // removes the grey overlay.
               $("body").removeClass("modal-open");
               airline_signin(msg.result.response.order_number);


           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
           }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error airline commit booking </span>' + msg.result.error_msg,
                })
                $('.loader-rodextrip').fadeOut();
                window.location.href = "/";
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error airline commit booking');
            $('.loader-rodextrip').fadeOut();
       },timeout: 300000
    });
}

function command_cryptic(){
    if(document.getElementById('message').value != '' && document.getElementById('message').value != '\n'){
        $('.btn-next').addClass("running");
        $('.btn-next').prop('disabled', true);
        var radios = document.getElementsByName('provider');
        for (var j = 0, length = radios.length; j < length; j++) {
            if (radios[j].checked) {
                // do whatever you want with the checked radio
                provider = radios[j].value;
                // only one radio can be logically checked, don't check the rest
                break;
            }
        }
        data = {
            'text_string': document.getElementById('message').value,
            'signature': signature,
            'provider': provider
        }
        text = '<br/>> ' + document.getElementById('message').value
        text = text.replace(/\n/g, '<br/>');
        counter++;
        var node = document.createElement("div");
        node.id = 'div_id'+counter;
        node.innerHTML = text;
        document.getElementById("chat").appendChild(node);
        document.getElementById('div_id'+counter).scrollIntoView(false);
        document.getElementById('message').value = '';
        document.getElementById('message').disabled = true;
        $.ajax({
           type: "POST",
           url: "/webservice/airline",
           headers:{
                'action': 'command_cryptic',
           },
           data: data,
           success: function(msg) {
               if(msg.result.error_code == 0){
                   //send order number
                   text = msg.result.response.text_string_details
                   text = text.replace(/\n/g, '<br/>');
                   counter++;
                   var node = document.createElement("pre");
                   node.id = 'div_id'+counter;

                   node.innerHTML = text;
                   document.getElementById("chat").appendChild(node);
                   document.getElementById('div_id'+counter).scrollIntoView(false);

               }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                    auto_logout();
               }else{
                    $('div').animate({ scrollTop: $("#div_chat_user").height() }, 'slow');
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: #ff9900;">Error airline command_cryptic </span>' + msg.result.error_msg,
                    })
               }
//               $('.loader-rodextrip').fadeOut();
               $('.btn-next').removeClass("running");
               $('.btn-next').prop('disabled', false);
               document.getElementById('message').disabled = false;
               document.getElementById("message").focus();
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error airline command cryptic');
                $('.loader-rodextrip').fadeOut();
           },timeout: 300000
        });
    }else{
        document.getElementById('message').value = '';
    }
}

function cancel_after_sales(){
    window.location="/airline/booking/"+btoa(airline_get_detail.order_number);
}

function pre_refund_login(){
    document.getElementById('request_captcha').disabled = true;
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'pre_refund_login',
       },
       data: {
            'signature': signature,
            'booking': JSON.stringify(airline_get_detail)
       },
       success: function(msg) {
           document.getElementById('request_captcha').disabled = false;
           $('#request_captcha').removeClass("running");
           refund_msg = msg;
           check_image = 0;
           if(msg.result.error_code ==0){
                if(msg.result.response.length == 0){
                    document.getElementById('cancel').hidden = false;
                    document.getElementById('cancel').innerHTML += `<div id="refund_detail" style="display:none;"></div>`;
                    document.getElementById('cancel').innerHTML += `<input class="primary-btn-ticket" style="width:100%;" id="full_refund" type="button" onclick="check_refund_partial_btn();" value="Check Refund Price Booking">`;
                    document.getElementById('captcha').hidden = true;
                }else{
                    for(i in msg.result.response){
                        if(msg.result.response[i].img != '' && msg.result.response[i].img != ';'){
                            pnr_list = msg.result.response[i].pnr.split(',');
                            img_list = msg.result.response[i].img.split(';');
                            for(j in img_list){
                                if(img_list[j] != ''){
                                    document.getElementById('cancel').innerHTML += pnr_list[j]+`<center><img style="margin-bottom:5px;" src="data:image/png;base64,`+img_list[j]+`"/></center><br/>`;
                                    document.getElementById('cancel').innerHTML += `<input style="margin-bottom:5px;" type="text" class="form-control" name="captcha`+parseInt(check_image)+`" id="captcha`+parseInt(check_image)+`" placeholder="Captcha " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Captcha '">`;
                                }else{
                                    document.getElementById('cancel').innerHTML += `<input style="margin-bottom:5px;" type="hidden" class="form-control" name="captcha`+parseInt(check_image)+`" id="captcha`+parseInt(check_image)+`" placeholder="Captcha " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Captcha '" value=''>`;
                                }
                                check_image++;
                            }
                        }
                    }
                }
                if(check_image != 0){
                    document.getElementById('cancel').hidden = false;
                    document.getElementById('captcha').innerHTML = `
                    <div class="row" style="padding-top:10px">
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                            <span style="font-size:13px; font-weight:500; padding-right:10px;">Session Time </span>
                        </div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right">
                            <span class="count_time" id="session_time_captcha"><i class="fas fa-stopwatch"></i> 10s</span>
                        </div>
                    </div>
                    <div class="row" style="padding-top:10px">
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                            <span style="font-size:13px; font-weight:500; padding-right:10px;">Elapsed Time </span>
                        </div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right">
                            <span class="count_time" id="elapse_time_captcha"></i> 0s</span>
                        </div>
                    </div>`;
                    document.getElementById('cancel').innerHTML += `<div id="refund_detail" style="display:none;"></div>`;
                    document.getElementById('cancel').innerHTML += `<input class="primary-btn-ticket" style="width:100%;" id="full_refund" type="button" onclick="check_refund_partial_btn();" value="Check Refund Price Booking">`;
                    time_limit_captcha = captcha_time;
                    captcha_time_limit_airline();
                }else{
                    document.getElementById('cancel').innerHTML = `<div id="refund_detail" style="display:none;"></div>`;
                    document.getElementById('cancel').innerHTML += `<input class="primary-btn-ticket" style="width:100%;" id="full_refund" type="button" onclick="check_refund_partial_btn();" value="Check Refund Price Booking">`;
                    document.getElementById('cancel').hidden = false;
                    check_refund_partial_btn();
                }
           }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error get refund price </span>' + msg.result.error_additional_msg,
                })
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error airline check refund price');
            $('.loader-rodextrip').fadeOut();
       },timeout: 300000
    });
}

function captcha_time_limit_airline(){
    timeLimitInterval = setInterval(function() {
        if(time_limit_captcha!=0){
            time_limit_captcha--;
            document.getElementById('session_time_captcha').innerHTML = ` <i class="fas fa-stopwatch"></i> `;
            if(parseInt(time_limit_captcha/60) % 24 > 0)
                document.getElementById('session_time_captcha').innerHTML += parseInt(time_limit_captcha/60) % 24 +`m:`;
            document.getElementById('session_time_captcha').innerHTML += (time_limit_captcha%60) +`s`

            document.getElementById('elapse_time_captcha').innerHTML = ` <i class="fas fa-clock"></i> `;
            if(parseInt((captcha_time - time_limit_captcha)/60) % 24 > 0)
                document.getElementById('elapse_time_captcha').innerHTML += parseInt((captcha_time - time_limit_captcha)/60) % 24 +`m:`;
            document.getElementById('elapse_time_captcha').innerHTML += ((captcha_time - time_limit_captcha)%60) +`s`;
        }else{
            document.getElementById('captcha').innerHTML = `
                <button class="btn-next primary-btn next-passenger-train ld-ext-right" id="request_captcha" style="width:100%;" type="button" value="Next" onclick="next_disabled();pre_refund_login();">
                    Check Refund Price
                    <div class="ld ld-ring ld-cycle"></div>
                </button>`;
            document.getElementById('cancel').hidden = true;
            document.getElementById('cancel').innerHTML = '';
            clearInterval(timeLimitInterval);
        }
    }, 1000);
}

function airline_get_booking_refund(data){
    airline_pick_list = [];
    document.getElementById('payment_acq').hidden = true;
    price_arr_repricing = {};
    get_vendor_balance('false');
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'get_booking',
       },
       data: {
            'order_number': data,
            'signature': airline_signature
       },
       success: function(msg) {
           //get booking view edit here
           if(msg.result.error_code == 0){
            hide_modal_waiting_transaction();
            document.getElementById("overlay-div-box").style.display = "none";
            for(i in msg.result.response.passengers[0].sale_service_charges){
                for(j in msg.result.response.passengers[0].sale_service_charges[i]){
                    currency = msg.result.response.passengers[0].sale_service_charges[i][j].currency
                    break;
                }
                break;
            }
            airline_get_detail = msg;
            get_payment = false;
            document.getElementById('airline_reissue_div').innerHTML = '';
            var text = '';
            $text = '';
            check_provider_booking = 0;
            if(msg.result.response.hold_date != false && msg.result.response.hold_date != ''){
                tes = moment.utc(msg.result.response.hold_date).format('YYYY-MM-DD HH:mm:ss');
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
            }else if(msg.result.response.state == 'void'){
               document.getElementById('issued-breadcrumb').classList.remove("br-active");
               document.getElementById('issued-breadcrumb').classList.add("br-fail");
               //document.getElementById('issued-breadcrumb').classList.remove("current");
               //document.getElementById('header_issued').innerHTML = `Fail <i class="fas fa-times"></i>`;
               document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
               document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-fail");
               document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
               document.getElementById('issued-breadcrumb-span').innerHTML = `Cancelled`;
            }else if(msg.result.response.state == 'fail_booked'){
               document.getElementById('issued-breadcrumb').classList.remove("br-active");
               document.getElementById('issued-breadcrumb').classList.add("br-fail");
               //document.getElementById('issued-breadcrumb').classList.remove("current");
               //document.getElementById('header_issued').innerHTML = `Fail <i class="fas fa-times"></i>`;
               document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
               document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-fail");
               document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
               document.getElementById('issued-breadcrumb-span').innerHTML = `Fail Booked`;
            }else if(msg.result.response.state == 'booked'){
               try{
                   if(now.diff(hold_date_time, 'minutes')<0)
                       check_payment_payment_method(msg.result.response.order_number, 'Issued', msg.result.response.booker.seq_id, 'billing', 'airline', signature, msg.result.response.payment_acquirer_number);
                   get_payment = true;
//                   get_payment_acq('Issued',msg.result.response.booker.seq_id, msg.result.response.order_number, 'billing',signature,'airline');
                   document.getElementById('voucher_div').style.display = '';
                   //document.getElementById('issued-breadcrumb').classList.remove("active");
                   //document.getElementById('issued-breadcrumb').classList.add("current");
                   document.getElementById('issued-breadcrumb').classList.add("br-active");
                   document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-active");
               }catch(err){
                    console.log(err); // error kalau ada element yg tidak ada
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
            }else{
               //document.getElementById('issued-breadcrumb').classList.remove("current");
               //document.getElementById('issued-breadcrumb').classList.add("active");
               document.getElementById('issued-breadcrumb').classList.add("br-active");
               document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-active");
               document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-check"></i>`;
            }

            if(msg.result.response.state == 'issued' || msg.result.response.state == 'rescheduled'){
                try{
                    document.getElementById('voucher_discount').style.display = 'none';
                }catch(err){
                    console.log(err); // error kalau ada element yg tidak ada
                }
               //baru
               try{
                   check_ssr = 0;
                   check_seat = 0;
                   check_cancel = 0;
                   check_reschedule = 0;
                   check_ff = 0;
                   try{
                       for(i in msg.result.response.provider_bookings){
                            if(provider_list_data[msg.result.response.provider_bookings[i].provider].is_post_issued_cancel){
                                check_cancel = 1;
                            }

                       }
                   }catch(err){
                       console.log(err); // error kalau ada element yg tidak ada
                   }
//                   check_cancel = 1; //testing ivan
                   if(check_cancel){
                        //document.getElementById('captcha').hidden = false;
//                        document.getElementById('cancel').innerHTML = `<input class="primary-btn-ticket" style="width:100%;" type="button" onclick="check_refund_partial_btn();" value="Check Refund Price Partial"><hr/>`;
                        document.getElementById('captcha').innerHTML = `
                            <button class="btn-next primary-btn next-passenger-train ld-ext-right" id="request_captcha" style="width:100%;" type="button" value="Next" onclick="next_disabled();pre_refund_login();">
                                Check Refund Price
                                <div class="ld ld-ring ld-cycle"></div>
                            </button>`;
                   }
               }catch(err){
                console.log(err);
               }
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
//                if(provider_list.includes("traveloka") == true){
//                    document.getElementById('cancel').hidden = false;
//                    document.getElementById('cancel').innerHTML = `<input class="primary-btn-ticket" style="width:100%;" type="button" onclick="cancel_btn();" value="Cancel Booking">`;
//                }
            }
            if(msg.result.response.state == 'booked'){
                try{
                    if(now.diff(hold_date_time, 'minutes')<0)
                        $(".issued_booking_btn").show();
                }catch(err){
                    console.log(err); // error kalau ada element yg tidak ada
                }
                check_provider_booking++;

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

            text+=`
            <div style="background-color:white; border:1px solid #cdcdcd;">
                <div class="row">
                    <div class="col-lg-12">
                        <div style="padding:10px; background-color:white;">
                        <h5> Flight Detail <img style="width:18px;" alt="Flight Detail" src="/static/tt_website_rodextrip/images/icon/plane.png"/></h5>
                        <hr/>`;
                    check = 0;
                    flight_counter = 1;
                    pnr_list_checkbox = {};
                    for(i in msg.result.response.provider_bookings){
                        $text += 'Booking Code: ' + msg.result.response.provider_bookings[i].pnr+'\n';
                        if(i != 0){
                            text+=`<hr/>`;
                        }
                        text+=`<div class="row">
                                <div class="col-lg-6 col-xs-6 col-md-6">`;
                        text+=`<h5>PNR: `+msg.result.response.provider_bookings[i].pnr+`</h5>`;
                        text+=` </div>
                                <div class="col-lg-6 col-xs-6 col-md-6" style="text-align:right">
                                    <label>`;
                        refund_text = '';
                        if(provider_list_data[msg.result.response.provider_bookings[i].provider].is_post_issued_cancel_per_pax == true)
                            refund_text += `Refund per passenger`;
                        if(provider_list_data[msg.result.response.provider_bookings[i].provider].is_post_issued_cancel_per_journey == true)
                            if(refund_text != '')
                                refund_text += ` or per journey`;
                            else
                                refund_text += `Refund per journey`;
                        text += refund_text;
                                    text+=`</label>
                                </div>
                            </div>`;
                        for(j in msg.result.response.provider_bookings[i].journeys){
                            if(provider_list_data[msg.result.response.provider_bookings[i].provider].is_post_issued_cancel_per_journey == true || j==0){
                                    pnr_list_checkbox[msg.result.response.provider_bookings[i].pnr+'_'+j] = {
                                        'checkbox': [],
                                        'per_pax': provider_list_data[msg.result.response.provider_bookings[i].provider].is_post_issued_cancel_per_pax,
                                        'per_seg': provider_list_data[msg.result.response.provider_bookings[i].provider].is_post_issued_cancel_per_journey,
                                        'pnr_checkbox': 'pnr_'+i+'_'+j
                                    };
                                text+=`<h6>Flight `+flight_counter+`</h6>`;
                                if(moment().format('YYYY-MM-DD HH:mm:ss') < msg.result.response.provider_bookings[i].departure_date)
                                    text+=`<input type="checkbox" id="pnr_`+i+`_`+j+`" onclick="pnr_refund_onclick('pnr_`+i+`_`+j+`','pnr');"><label for="pnr`+i+`">  Refund</label>`;
                                $text += 'Flight '+ flight_counter+'\n';
                                flight_counter++;
                            }
                            for(k in msg.result.response.provider_bookings[i].journeys[j].segments){
                                var cabin_class = '';
                                //yang baru harus diganti
                                if(msg.result.response.provider_bookings[i].journeys[j].segments[k].cabin_class == 'Y')
                                    cabin_class = 'Economy Class';
                                else if(msg.result.response.provider_bookings[i].journeys[j].carrier_code == 'QG' && msg.result.response.provider_bookings[i].journeys[j].segments[k].cabin_class == 'W')
                                    cabin_class = 'Royal Green Class';
                                else if(msg.result.response.provider_bookings[i].journeys[j].segments[k].cabin_class == 'W')
                                    cabin_class = 'Premium Economy Class';
                                else if(msg.result.response.provider_bookings[i].journeys[j].segments[k].cabin_class == 'C')
                                    cabin_class = 'Business Class';
                                else if(msg.result.response.provider_bookings[i].journeys[j].segments[k].cabin_class == 'F')
                                    cabin_class = 'First Class';
                                for(l in msg.result.response.provider_bookings[i].journeys[j].segments[k].legs){
                                    try{
                                        $text += airline_carriers[msg.result.response.provider_bookings[i].journeys[j].segments[k].carrier_code].name + ' ' + msg.result.response.provider_bookings[i].journeys[j].segments[k].carrier_number;
                                    }catch(err){
                                        $text += msg.result.response.provider_bookings[i].journeys[j].segments[k].carrier_code + ' ' + msg.result.response.provider_bookings[i].journeys[j].segments[k].carrier_number;
                                    }
                                    if(cabin_class != '')
                                        $text += ' ' + cabin_class;
                                    else
                                        $text += ' ' + cabin_class;
                                    $text += '\n';
                                    if(msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].arrival_date.split('  ')[0] == msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].departure_date.split('  ')[0]){
                                        $text += msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].departure_date.split('  ')[0]+' ';
                                        $text += msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].departure_date.split('  ')[1]+' - ';
                                        $text += msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].arrival_date.split('  ')[1]+'\n';
                                    }else{
                                        $text += msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].departure_date.split('  ')[0]+' ';
                                        $text += msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].departure_date.split('  ')[1]+' - ';
                                        $text += msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].arrival_date.split('  ')[0]+' ';
                                        $text += msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].arrival_date.split('  ')[1]+'\n';
                                    }
                                    $text += msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].origin_name +' ('+msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].origin_city+') - '+msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].destination_name +' ('+msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].destination_city+')\n\n';

                                    text+= `
                                    <div class="row">
                                        <div class="col-lg-4">`;
                                        try{
                                            text += `<img data-toggle="tooltip" style="width:50px; height:50px;" alt="`+airline_carriers[msg.result.response.provider_bookings[i].journeys[j].segments[k].carrier_code].name+`" title="`+airline_carriers[msg.result.response.provider_bookings[i].journeys[j].segments[k].carrier_code].name+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+msg.result.response.provider_bookings[i].journeys[j].segments[k].carrier_code+`.png"/>`;
                                        }catch(err){
                                            text += `<img data-toggle="tooltip" style="width:50px; height:50px;" alt="`+msg.result.response.provider_bookings[i].journeys[j].segments[k].carrier_code+`" title="`+msg.result.response.provider_bookings[i].journeys[j].segments[k].carrier_code+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+msg.result.response.provider_bookings[i].journeys[j].segments[k].carrier_code+`.png"/>`;
                                        }
                                        text+=`<h5>`+msg.result.response.provider_bookings[i].journeys[j].segments[k].carrier_name+' '+msg.result.response.provider_bookings[i].journeys[j].segments[k].carrier_number+`</h5>
                                            <span>Class : `+cabin_class+` (`+msg.result.response.provider_bookings[i].journeys[j].segments[k].class_of_service+`)</span><br/>
                                        </div>
                                        <div class="col-lg-8" style="padding-top:10px;">
                                            <div class="row">
                                                <div class="col-lg-6 col-xs-6">
                                                    <table style="width:100%">
                                                        <tr>
                                                            <td><h5>`+msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].departure_date.split('  ')[1]+`</h5></td>
                                                            <td style="padding-left:15px;">
                                                                <img src="/static/tt_website_rodextrip/img/icon/airlines-01.png" alt="Airline" style="width:20px; height:20px;"/>
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
                                                    <span>`+msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].departure_date.split('  ')[0]+`</span><br/>
                                                    <span style="font-weight:500;">`+msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].origin_name+` - `+msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].origin_city+` (`+msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].origin+`)</span>
                                                </div>

                                                <div class="col-lg-6 col-xs-6" style="padding:0;">
                                                    <table style="width:100%; margin-bottom:6px;">
                                                        <tr>
                                                            <td><h5>`+msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].arrival_date.split('  ')[1]+`</h5></td>
                                                            <td></td>
                                                            <td style="height:30px;padding:0 15px;width:100%"></td>
                                                        </tr>
                                                    </table>
                                                    <span>`+msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].arrival_date.split('  ')[0]+`</span><br/>
                                                    <span style="font-weight:500;">`+msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].destination_name+` - `+msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].destination_city+` (`+msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].destination+`)</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;
                                }
                            }
                            if(provider_list_data[msg.result.response.provider_bookings[i].provider].is_post_issued_cancel_per_journey == true){
                                text+=`<br/>
                                <table style="width:100%" id="list-of-passenger">
                                    <tr>
                                        <th style="width:5%;" class="list-of-passenger-left">Refund</th>
                                        <th style="width:30%;">Name</th>
                                        <th style="width:20%;">Birth Date</th>
                                        <th style="width:45%;">Remarks</th>
                                    </tr>`;
                                    for(pax in msg.result.response.passengers){
                                        ticket = '';
                                        for(provider in msg.result.response.provider_bookings){
                                            for(journey in msg.result.response.provider_bookings[provider].journeys){
                                                if(msg.result.response.provider_bookings[i].pnr == msg.result.response.provider_bookings[provider].pnr &&
                                                   msg.result.response.provider_bookings[i].journeys[j].origin == msg.result.response.provider_bookings[provider].journeys[journey].origin &&
                                                   msg.result.response.provider_bookings[i].journeys[j].destination == msg.result.response.provider_bookings[provider].journeys[journey].destination){

                                                    text+=`<tr>`;
                                                    if(moment().format('YYYY-MM-DD HH:mm:ss') < msg.result.response.provider_bookings[i].departure_date){
                                                        text+=`
                                                        <td class="list-of-passenger-left"><input class="refund_pax" type="checkbox" id="pnr~`+msg.result.response.provider_bookings[provider].pnr+`~`+msg.result.response.passengers[pax].sequence+`~`+msg.result.response.provider_bookings[provider].journeys[journey].origin+`~`+msg.result.response.provider_bookings[provider].journeys[journey].destination+`~`+msg.result.response.provider_bookings[provider].journeys[journey].departure_date+`" onclick="pnr_refund_onclick('pnr~`+msg.result.response.provider_bookings[provider].pnr+`~`+msg.result.response.passengers[pax].sequence+`~`+msg.result.response.provider_bookings[provider].journeys[journey].origin+`~`+msg.result.response.provider_bookings[provider].journeys[journey].destination+`~`+msg.result.response.provider_bookings[provider].journeys[journey].departure_date+`','pax');" /></td>`;
                                                        pnr_list_checkbox[msg.result.response.provider_bookings[i].pnr+'_'+j]['checkbox'].push(`pnr~`+msg.result.response.provider_bookings[provider].pnr+`~`+msg.result.response.passengers[pax].sequence+`~`+msg.result.response.provider_bookings[provider].journeys[journey].origin+`~`+msg.result.response.provider_bookings[provider].journeys[journey].destination+`~`+msg.result.response.provider_bookings[provider].journeys[journey].departure_date);
                                                    }
                                                    else
                                                    text+=`<td></td>`;
                                                    text+=`
                                                    <td>`+msg.result.response.passengers[pax].title+` `+msg.result.response.passengers[pax].first_name+` `+msg.result.response.passengers[pax].last_name+`</td>
                                                    <td>`+msg.result.response.passengers[pax].birth_date+`</td>
                                                    <td><input type="text" class="refund_remarks" style="width:100%" id="remarks~`+msg.result.response.provider_bookings[provider].pnr+`~`+msg.result.response.passengers[pax].sequence+`~`+msg.result.response.provider_bookings[provider].journeys[journey].origin+`~`+msg.result.response.provider_bookings[provider].journeys[journey].destination+`~`+msg.result.response.provider_bookings[provider].journeys[journey].departure_date+`" name="remarks~`+msg.result.response.provider_bookings[provider].pnr+`~`+msg.result.response.passengers[pax].sequence+`~`+msg.result.response.provider_bookings[provider].journeys[journey].origin+`~`+msg.result.response.provider_bookings[provider].journeys[journey].destination+`~`+msg.result.response.provider_bookings[provider].journeys[journey].departure_date+`"/></td>
                                                </tr>`;

                                                }
                                            }
                                        }
                                    }

                                text+=`</table><br/>`;
                            }
                        }
                        if(provider_list_data[msg.result.response.provider_bookings[i].provider].is_post_issued_cancel_per_journey == false){
                            text+=`<br/>
                            <table style="width:100%" id="list-of-passenger">
                                <tr>
                                    <th style="width:5%;" class="list-of-passenger-left">Refund</th>
                                    <th style="width:30%;">Name</th>
                                    <th style="width:20%;">Birth Date</th>
                                    <th style="width:45%;">Remarks</th>
                                </tr>`;
                                for(pax in msg.result.response.passengers){
                                    ticket = '';
                                    for(provider in msg.result.response.provider_bookings){
                                        pnr_refund = '';
                                        remark_refund = '';
                                        for(journey in msg.result.response.provider_bookings[provider].journeys){
                                            if(msg.result.response.provider_bookings[i].pnr == msg.result.response.provider_bookings[provider].pnr && msg.result.response.provider_bookings[provider].pnr in msg.result.response.passengers[pax].sale_service_charges){
                                                if((parseInt(journey)+1) == msg.result.response.provider_bookings[provider].journeys.length){
                                                    pnr_refund += `pnr~`+msg.result.response.provider_bookings[provider].pnr+`~`+msg.result.response.passengers[pax].sequence+`~`+msg.result.response.provider_bookings[provider].journeys[journey].origin+`~`+msg.result.response.provider_bookings[provider].journeys[journey].destination+`~`+msg.result.response.provider_bookings[provider].journeys[journey].departure_date;
                                                    remark_refund += `remarks~`+msg.result.response.provider_bookings[provider].pnr+`~`+msg.result.response.passengers[pax].sequence+`~`+msg.result.response.provider_bookings[provider].journeys[journey].origin+`~`+msg.result.response.provider_bookings[provider].journeys[journey].destination+`~`+msg.result.response.provider_bookings[provider].journeys[journey].departure_date;
                                                    text+=`<tr>`;
                                                    if(moment().format('YYYY-MM-DD HH:mm:ss') < msg.result.response.provider_bookings[i].departure_date){
                                                        text+=`
                                                        <td class="list-of-passenger-left"><input class="refund_pax" type="checkbox" id="`+pnr_refund+`" onclick="pnr_refund_onclick('`+pnr_refund+`','pax');" /></td>`;
                                                        pnr_list_checkbox[msg.result.response.provider_bookings[i].pnr+'_'+0]['checkbox'].push(pnr_refund);
                                                    }
                                                    else
                                                    text+=`<td></td>`;
                                                    text+=`
                                                    <td>`+msg.result.response.passengers[pax].title+` `+msg.result.response.passengers[pax].first_name+` `+msg.result.response.passengers[pax].last_name+`</td>
                                                    <td>`+msg.result.response.passengers[pax].birth_date+`</td>
                                                    <td><input type="text" class="refund_remarks" style="width:100%" id="`+remark_refund+`" name="`+remark_refund+`"/></td>
                                                </tr>`;
                                                }else{
                                                    pnr_refund += `pnr~`+msg.result.response.provider_bookings[provider].pnr+`~`+msg.result.response.passengers[pax].sequence+`~`+msg.result.response.provider_bookings[provider].journeys[journey].origin+`~`+msg.result.response.provider_bookings[provider].journeys[journey].destination+`~`+msg.result.response.provider_bookings[provider].journeys[journey].departure_date+` - `;
                                                    remark_refund += `remarks~`+msg.result.response.provider_bookings[provider].pnr+`~`+msg.result.response.passengers[pax].sequence+`~`+msg.result.response.provider_bookings[provider].journeys[journey].origin+`~`+msg.result.response.provider_bookings[provider].journeys[journey].destination+`~`+msg.result.response.provider_bookings[provider].journeys[journey].departure_date+` - `;
                                                }

                                            }
                                        }
                                    }
                                }

                            text+=`</table><br/>`;
                        }
                    }
                    text+=`
                        </div>
                    </div>
                </div>
            </div>`;

            text+=`

            </div>`;
            airline_get_detail = msg;
            document.getElementById('airline_booking').innerHTML = text;

//            //detail
//            text = '';
//            tax = 0;
//            fare = 0;
//            total_price = 0;
//            total_price_provider = [];
//            price_provider = 0;
//            commission = 0;
//            service_charge = ['FARE', 'RAC', 'ROC', 'TAX', 'SSR', 'DISC'];
//            text_detail=`
//            <div style="background-color:white; padding:10px; border: 1px solid #cdcdcd; margin-bottom:15px;">
//                <h5> Price Detail</h5>
//            <hr/>`;
//
//            //repricing
//            type_amount_repricing = ['Repricing'];
//            //repricing
//            counter_service_charge = 0;
//            $text += '\nPrice:\n';
//            for(i in msg.result.response.provider_bookings){
//                try{
//                    if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false || msg.result.response.state == 'issued')
//                        text_detail+=`
//                            <div style="text-align:left">
//                                <span style="font-weight:500; font-size:14px;">PNR: `+msg.result.response.provider_bookings[i].pnr+` </span>
//                            </div>`;
//
//                    for(j in msg.result.response.passengers){
//                        price = {'FARE': 0, 'RAC': 0, 'ROC': 0, 'TAX':0 , 'currency': '', 'CSC': 0, 'SSR': 0, 'DISC': 0,'SEAT':0};
//                        for(k in msg.result.response.passengers[j].sale_service_charges[msg.result.response.provider_bookings[i].pnr]){
//                            price[k] += msg.result.response.passengers[j].sale_service_charges[msg.result.response.provider_bookings[i].pnr][k].amount;
//                            if(price['currency'] == '')
//                                price['currency'] = msg.result.response.passengers[j].sale_service_charges[msg.result.response.provider_bookings[i].pnr][k].currency;
//                        }
//                        try{
//                            price['CSC'] = msg.result.response.passengers[j].channel_service_charges.amount;
//
//                        }catch(err){}
//                        //repricing
//                        check = 0;
//                        for(k in pax_type_repricing){
//                            if(pax_type_repricing[k][0] == msg.result.response.passengers[j].name)
//                                check = 1;
//                        }
//                        if(check == 0){
//                            pax_type_repricing.push([msg.result.response.passengers[j].name, msg.result.response.passengers[j].name]);
//                            price_arr_repricing[msg.result.response.passengers[j].name] = {
//                                'Fare': price['FARE'] + price['SSR'] + price['SEAT'] + price['DISC'],
//                                'Tax': price['TAX'] + price['ROC'],
//                                'Repricing': price['CSC']
//                            }
//                        }else{
//                            price_arr_repricing[msg.result.response.passengers[j].name] = {
//                                'Fare': price_arr_repricing[msg.result.response.passengers[j].name]['Fare'] + price['FARE'] + price['DISC'] + price['SSR'] + price['SEAT'],
//                                'Tax': price_arr_repricing[msg.result.response.passengers[j].name]['Tax'] + price['TAX'] + price['ROC'],
//                                'Repricing': price['CSC']
//                            }
//                        }
//                        text_repricing = `
//                        <div class="col-lg-12">
//                            <div style="padding:5px;" class="row">
//                                <div class="col-lg-3"></div>
//                                <div class="col-lg-3">Price</div>
//                                <div class="col-lg-3">Repricing</div>
//                                <div class="col-lg-3">Total</div>
//                            </div>
//                        </div>`;
//                        for(k in price_arr_repricing){
//                           text_repricing += `
//                           <div class="col-lg-12">
//                                <div style="padding:5px;" class="row" id="adult">
//                                    <div class="col-lg-3" id="`+j+`_`+k+`">`+k+`</div>
//                                    <div class="col-lg-3" id="`+k+`_price">`+getrupiah(price_arr_repricing[k].Fare + price_arr_repricing[k].Tax)+`</div>`;
//                                    if(price_arr_repricing[k].Repricing == 0)
//                                    text_repricing+=`<div class="col-lg-3" id="`+k+`_repricing">-</div>`;
//                                    else
//                                    text_repricing+=`<div class="col-lg-3" id="`+k+`_repricing">`+getrupiah(price_arr_repricing[k].Repricing)+`</div>`;
//                                    text_repricing+=`<div class="col-lg-3" id="`+k+`_total">`+getrupiah(price_arr_repricing[k].Fare + price_arr_repricing[k].Tax + price_arr_repricing[k].Repricing)+`</div>
//                                </div>
//                            </div>`;
//                        }
//                        text_repricing += `<div id='repricing_button' class="col-lg-12" style="text-align:center;"></div>`;
//                        document.getElementById('repricing_div').innerHTML = text_repricing;
//                        //repricing
//
//                        text_detail+=`
//                        <div class="row" style="margin-bottom:5px;">
//                            <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
//                                <span style="font-size:12px;">`+msg.result.response.passengers[j].name+`</span>`;
//                            text_detail+=`</div>
//                            <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
//                                <span style="font-size:13px;">`+price.currency+` `+getrupiah(parseInt(price.FARE + price.TAX + price.ROC + price.CSC + price.SSR + price.SEAT + price.DISC))+`</span>
//                            </div>
//                        </div>`;
//                        $text += msg.result.response.passengers[j].title +' '+ msg.result.response.passengers[j].name + ' ['+msg.result.response.provider_bookings[i].pnr+'] ';
//                        for(k in msg.result.response.passengers[j].fees){
//                            $text += msg.result.response.passengers[j].fees[k].fee_name;
//                            if(parseInt(parseInt(k)+1) != msg.result.response.passengers[j].fees.length)
//                                $text += ', ';
//                            else
//                                $text += ' ';
//                        }
//                        $text += price.currency+` `+getrupiah(parseInt(price.FARE + price.SSR + price.SEAT + price.TAX + price.ROC + price.CSC + price.DISC))+'\n';
//                        if(counter_service_charge == 0){
//                            total_price += parseInt(price.TAX + price.ROC + price.FARE + price.SEAT + price.CSC + price.SSR + price.DISC);
//                            price_provider += parseInt(price.TAX + price.ROC + price.FARE + price.SEAT + price.CSC + price.SSR + price.DISC);
//                        }else{
//                            total_price += parseInt(price.TAX + price.ROC + price.FARE + price.SSR + price.SEAT + price.DISC);
//                            price_provider += parseInt(price.TAX + price.ROC + price.FARE + price.SSR + price.SEAT + price.DISC);
//                        }
//                        commission += parseInt(price.RAC);
//                    }
//                    total_price_provider.push({
//                        'pnr': msg.result.response.provider_bookings[i].pnr,
//                        'price': price_provider
//                    })
//                    price_provider = 0;
//                    counter_service_charge++;
//                }catch(err){}
//            }
//            try{
//                airline_get_detail.result.response.total_price = total_price;
//                $text += 'Grand Total: '+price.currency+' '+ getrupiah(total_price);
//                if(check_provider_booking != 0 && msg.result.response.state == 'booked'){
//                    $text += '\n\nPrices and availability may change at any time';
//                }
//                text_detail+=`
//                <div>
//                    <hr/>
//                </div>
//                <div class="row" style="margin-bottom:10px;">
//                    <div class="col-lg-6 col-xs-6" style="text-align:left;">
//                        <span style="font-size:13px; font-weight: bold;">Grand Total</span>
//                    </div>
//                    <div class="col-lg-6 col-xs-6" style="text-align:right;">
//                        <span style="font-size:13px; font-weight: bold;">`;
//                        try{
//                            text_detail+= price.currency+` `+getrupiah(total_price);
//                        }catch(err){
//
//                        }
//                        text_detail+= `</span>
//                    </div>
//                </div>`;
//                if(msg.result.response.state == 'booked')
//                    text_detail+=`<div style="text-align:right; padding-bottom:10px;"><img src="/static/tt_website_rodextrip/img/bank.png" alt="" style="width:25px; height:25px; cursor:pointer;" onclick="show_repricing();"/></div>`;
//                text_detail+=`<div class="row">
//                <div class="col-lg-12" style="padding-bottom:10px;">
//                    <hr/>
//                    <span style="font-size:14px; font-weight:bold;">Share This on:</span><br/>`;
//                    share_data();
//                    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
//                    if (isMobile) {
//                        text_detail+=`
//                            <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png" alt="Whatsapp"/></a>
//                            <a href="line://msg/text/`+ $text_share +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png" alt="Line"/></a>
//                            <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png" alt="Telegram"/></a>
//                            <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png" alt="Email"/></a>`;
//                    } else {
//                        text_detail+=`
//                            <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png" alt="Whatsapp"/></a>
//                            <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png" alt="Line"/></a>
//                            <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png" alt="Telegram"/></a>
//                            <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png" alt="Email"/></a>`;
//                    }
//
//                text_detail+=`
//                    </div>
//                </div>`;
//                if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false)
//                    text_detail+=`
//                    <div class="row" id="show_commission" style="display:none;">
//                        <div class="col-lg-12 col-xs-12" style="text-align:center;">
//                            <div class="alert alert-success">
//                                <span style="font-size:13px; font-weight:bold;">Your Commission: `+price.currency+` `+getrupiah(parseInt(commission)*-1)+`</span><br>
//                            </div>
//                        </div>
//                    </div>`;
//                text_detail+=`<center>
//
//                <div style="padding-bottom:10px;">
//                    <center>
//                        <input type="button" class="primary-btn-ticket" style="width:100%;" onclick="copy_data();" value="Copy"/>
//                    </center>
//                </div>`;
//                if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false)
//                text_detail+=`
//                <div style="margin-bottom:5px;">
//                    <input class="primary-btn-ticket" id="show_commission_button" style="width:100%;" type="button" onclick="show_commission('commission');" value="Show Commission"/>
//                </div>
//            </div>`;
//            }catch(err){}
//            document.getElementById('airline_detail').innerHTML = text_detail;


            $("#show_loading_booking_airline").hide();

            //
            text = `
            <div class="modal fade" id="myModal" role="dialog">
                <div class="modal-dialog">

                    <!-- Modal content-->
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title" style="color:`+text_color+`;">Price Change <i class="fas fa-money"></i></h4>
                            <button type="button" class="close" data-dismiss="modal" onclick="airline_get_booking('`+msg.result.response.order_number+`');show_loading();please_wait_transaction();">&times;</button>
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
            document.getElementById('airline_booking').innerHTML += text;
//            document.getElementById('show_title_airline').hidden = false;
            document.getElementById('show_loading_booking_airline').hidden = true;
            add_repricing();
            if (msg.result.response.state != 'booked'){
//                document.getElementById('issued-breadcrumb').classList.add("active");
            }

           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
               auto_logout();
           }else if(msg.result.error_code == 1035){
                    hide_modal_waiting_transaction();
                    document.getElementById('show_loading_booking_airline').hidden = true;
                    render_login('airline');
           }else{
                text += `<div class="alert alert-danger">
                        <h5>
                            `+msg.result.error_code+`
                        </h5>
                        `+msg.result.error_msg+`
                    </div>`;
                document.getElementById('airline_booking').innerHTML = text;
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
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error airline booking');
            $("#show_loading_booking_airline").hide();
            $("#show_error_booking_airline").show();
            $('.loader-rodextrip').fadeOut();
            hide_modal_waiting_transaction();
       },timeout: 300000
    });
}

function pnr_refund_onclick(val, type){

    if(type == 'pnr'){//pnr
        count_check = 0;
        for(i in pnr_list_checkbox){
            if(pnr_list_checkbox[i].pnr_checkbox == val){
                break;
            }
            count_check++;
        }
        checkbox_check = document.getElementById(val).checked;
        if(checkbox_check == true){
            for(i in pnr_list_checkbox){
                if(pnr_list_checkbox[i].pnr_checkbox == val){
                    for(j in pnr_list_checkbox[i]['checkbox']){
                        try{
                            document.getElementById(pnr_list_checkbox[i]['checkbox'][j]).checked = 'checked';
                        }catch(err){
                            console.log(err); // error kalau ada element yg tidak ada
                        } //mungkin checkbox tidak ada karena kalau sudah berangkat element tidak di print
                    }
                    break;
                }
            }
        }else
            for(i in pnr_list_checkbox){
                if(pnr_list_checkbox[i].pnr_checkbox == val){
                    for(j in pnr_list_checkbox[i]['checkbox']){
                        try{
                            document.getElementById(pnr_list_checkbox[i]['checkbox'][j]).checked = '';
                        }catch(err){
                            console.log(err); // error kalau ada element yg tidak ada
                        } //mungkin checkbox tidak ada karena kalau sudah berangkat element tidak di print
                    }
                    break;
                }
            }
    }else if(type == 'pax'){//pax
        checkbox_check = document.getElementById(val).checked;
        pnr = '';
        pnr_check = true;
        for(i in pnr_list_checkbox){
            check = false;
            for(j in pnr_list_checkbox[i]['checkbox']){
                if(val == pnr_list_checkbox[i]['checkbox'][j]){
                    check = true;
                    pnr = pnr_list_checkbox[i].pnr_checkbox;
                }
            }
            if(check == true){
                //check here
                for(j in pnr_list_checkbox[i]['checkbox']){
                    if(pnr_list_checkbox[i].per_pax == false || pnr_list_checkbox[i].per_seg == true && pnr_list_checkbox[i].per_seg == false){
                        if(checkbox_check == false){
                            document.getElementById(pnr_list_checkbox[i]['checkbox'][j]).checked = '';
                        }else{
                            document.getElementById(pnr_list_checkbox[i]['checkbox'][j]).checked = 'checked';
                        }
                    }
                    if(document.getElementById(pnr_list_checkbox[i]['checkbox'][j]).checked == false)
                        pnr_check = false;
                }
                try{
                    if(pnr_check == true)
                        document.getElementById(pnr).checked = 'checked';
                    else
                        document.getElementById(pnr).checked = '';
                }catch(err){console.log(err);}
            }
        }
    }
    btn_show = false;
    for(i in pnr_list_checkbox){
        if(document.getElementById(pnr_list_checkbox[i].pnr_checkbox).checked == true)
            btn_show = true;
        if(btn_show == true)
            break;
        for(j in pnr_list_checkbox[i]['checkbox']){
            if(document.getElementById(pnr_list_checkbox[i]['checkbox'][j]).checked == true)
            btn_show = true;
        }
    }
    if(btn_show == true)
        document.getElementById('captcha').hidden = false;
    else
        document.getElementById('captcha').hidden = true;

    try{
        document.getElementById('refund_detail').style.display = 'none';
        document.getElementById('refund_detail').innerHTML = '';
        document.getElementById('cancel').hidden = true;
        document.getElementById('refund_detail').innerHTML = '';
    }catch(err){
        console.log(err); // error kalau ada element yg tidak ada
    }
}

//v2

function airline_get_reschedule_availability_v2(){
    flight = 1;
    cabin_class = 1;
    provider_list = [];
    journey_list = [];
    cabin_class_flight = 1;
    pnr_list = []
    all_journey_flight_list = [];
    error_log = '';
    for(i in airline_get_detail.result.response.provider_bookings){
        for(j in airline_get_detail.result.response.provider_bookings[i].journeys){
            if(moment() < moment(airline_get_detail.result.response.provider_bookings[i].journeys[j].departure_date)){
                try{
                    if(document.getElementById('origin_id_flight'+flight) != null){
                        origin = document.getElementById('origin_id_flight'+flight).value;
                        if(origin.split(' - ').length == 4)
                            origin = origin.split(' - ')[0];
                        else
                            error_log = 'Please use autocomplete for origin '+flight + '!\n';
                    }else
                        origin = airline_get_detail.result.response.provider_bookings[i].journeys[j].origin;
                    if(document.getElementById('destination_id_flight'+flight) != null){
                        destination = document.getElementById('destination_id_flight'+flight).value;
                        if(destination.split(' - ').length == 4)
                            destination = destination.split(' - ')[0];
                        else
                            error_log = 'Please use autocomplete for destination '+flight + '!\n';
                    }else
                        destination = airline_get_detail.result.response.provider_bookings[i].journeys[j].destination;
                    journey_list.push({
                        "origin": origin,
                        "destination": destination,
                        "departure_date": document.getElementById('airline_departure'+ flight).value,
                        "journey_key":airline_get_detail.result.response.provider_bookings[i].journeys[j].origin + '-' + airline_get_detail.result.response.provider_bookings[i].journeys[j].destination
                    });
                    all_journey_flight_list.push({
                        "origin": origin,
                        "destination": destination,
                        "departure_date": document.getElementById('airline_departure'+ flight).value,
                        "journey_key":airline_get_detail.result.response.provider_bookings[i].journeys[j].origin + '-' + airline_get_detail.result.response.provider_bookings[i].journeys[j].destination
                    });
                }catch(err){
                    console.log(err); // error kalau ada element yg tidak ada
                }
                flight++;
            }
        }
        if(journey_list.length > 0){
            provider_list.push({
                "pnr": airline_get_detail.result.response.provider_bookings[i].pnr,
                "journeys":  journey_list,
                "cabin_class": document.getElementById('cabin_class_flight'+ cabin_class).value
            });
            pnr_list.push(airline_get_detail.result.response.provider_bookings[i].pnr)
        }
        cabin_class++;
        journey_list = [];
    }
    if(error_log == ''){
        try{
            document.getElementById('voucher_discount').hidden = true;
        }catch(err){
            console.log(err); // error kalau ada element yg tidak ada
        }
        document.getElementById('reissued').hidden = true;
        if(airline_get_detail.result.response.state == 'booked')
            try{
                document.getElementById('issued_btn_airline').hidden = true;
            }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
            }

        getToken();
        show_loading();
        please_wait_transaction();
        $('#ssr_req_new_ssr').prop('disabled', true);
        $('#ssr_req_new_seat').prop('disabled', true);
        $('#reissued_btn_dsb').prop('disabled', true);
        $('#reissued_req_btn').prop('disabled', true);

        $.ajax({
           type: "POST",
           url: "/webservice/airline",
           headers:{
                'action': 'get_reschedule_availability_v2',
           },
    //       url: "{% url 'tt_backend_rodextrip:social_media_tree_update' %}",
           data: {
                'data':JSON.stringify(provider_list),
                'signature': signature,
                'booking': JSON.stringify(airline_get_detail)
           },
           success: function(msg) {
               hide_modal_waiting_transaction();
               document.getElementById('show_loading_booking_airline').hidden = false;
               if(msg.result.error_code == 0){
                    document.getElementById('airline_booking').innerHTML = '';
                    document.getElementById('show_loading_booking_airline').style.display = 'block';
                    document.getElementById('show_loading_booking_airline').hidden = false;
                    document.getElementById('airline_detail').innerHTML = '';
                    document.getElementById('ssr_request_after_sales').hidden = true;

                    document.getElementById('reissued').innerHTML = `<input class="primary-btn-white" style="width:100%;" type="button" onclick="show_loading();please_wait_transaction();airline_get_booking('`+airline_get_detail.result.response.order_number+`')" value="Cancel Reissued">`;
                    flight_select = 0;
                    datareissue2(msg.result.response.reschedule_availability_provider);
               }else{
                    Swal.fire({
                       type: 'error',
                       title: 'Oops!',
                       html: '<span style="color: red;">Error reissued </span>' + msg.result.error_msg,
                    }).then((result) => {
                      if (result.value) {
                        hide_modal_waiting_transaction();
                      }
                    })
                    airline_get_booking(airline_get_detail.result.response.order_number);
                    $('.loader-rodextrip').fadeOut();
                    hide_modal_waiting_transaction();
                    $('#ssr_req_new_ssr').prop('disabled', false);
                    $('#ssr_req_new_seat').prop('disabled', false);
                    $('#reissued_btn_dsb').prop('disabled', false);
                    $('#reissued_req_btn').prop('disabled', false);
               }
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error airline reissued');
                $("#show_loading_booking_airline").hide();
                $("#show_error_booking_airline").show();
                hide_modal_waiting_transaction();
                $('.loader-rodextrip').fadeOut();

                $('#ssr_req_new_ssr').prop('disabled', false);
                $('#ssr_req_new_seat').prop('disabled', false);
                $('#reissued_btn_dsb').prop('disabled', false);
                $('#reissued_req_btn').prop('disabled', false);

           },timeout: 300000
        });
    }else{
        Swal.fire({
          type: 'error',
          title: 'Oops!',
          text: error_log,
        });
    }
}

function airline_get_reschedule_itinerary_v2(){
    show_loading();
    please_wait_transaction();
//                document.getElementById('next_reissue').disabled = true;
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'get_reschedule_itinerary_v2',
       },
//       url: "{% url 'tt_backend_rodextrip:social_media_tree_update' %}",
       data: {
            "journeys_booking": JSON.stringify(journey),
            "passengers":JSON.stringify({
                "adult": airline_get_detail.result.response.ADT,
                "child": airline_get_detail.result.response.CHD,
                "infant": airline_get_detail.result.response.INF
            }),
            'signature': signature,
            "pnr": JSON.stringify(pnr_list),
            'booking': JSON.stringify(airline_get_detail)
       },
       success: function(msg) {
           hide_modal_waiting_transaction();
           document.getElementById('show_loading_booking_airline').hidden = false;
           if(msg.result.error_code == 0){
               for(i in journey){
                   try{
                       document.getElementById('changejourney_pick'+parseInt(1+parseInt(i))).disabled = false; //sudah sell tidak bisa
                       document.getElementById('changejourney_pick'+parseInt(1+parseInt(i))).onclick = '';
                   }catch(err){
                       console.log(err); // error kalau ada element yg tidak ada
                   }
               }
               airline_response = [];
               airline_route = [];
               check_seat = 0;
               for(i in msg.result.response.reschedule_itinerary_provider){
                   for(j in msg.result.response.reschedule_itinerary_provider[i].journeys){
                       airline_response.push(msg.result.response.reschedule_itinerary_provider[i].journeys[j]);
                       for(k in msg.result.response.reschedule_itinerary_provider[i].journeys[j].segments){
                           if(msg.result.response.reschedule_itinerary_provider[i].journeys[j].segments[k].hasOwnProperty('seat_cabins') && msg.result.response.reschedule_itinerary_provider[i].journeys[j].segments[k].seat_cabins.length > 0){
                               check_seat = 1;
                               airline_route.push(msg.result.response.reschedule_itinerary_provider[i].journeys[j].segments[k].origin+' - '+msg.result.response.reschedule_itinerary_provider[i].journeys[j].segments[k].destination)
                           }
                       }
                   }
               }
               for(i=0;i<airline_response.length;i++){
                    for(j=i;j<airline_response.length;j++){
                        if(airline_response[i].departure_date > airline_response[j].departure_date){
                            temp = airline_response[i];
                            airline_response[i] = airline_response[j];
                            airline_response[j] = temp;
                        }
                    }
               }
               //change date moment
               for(i=0;i<airline_response.length;i++){

               }
               get_price_itinerary_reissue_request(airline_response, msg.result.response.total_admin_fee, msg.result.response.sell_reschedule_provider);
               document.getElementById('airline_detail').innerHTML += `
                <div class="col-lg-12" style="background-color:white; padding:10px; border: 1px solid #cdcdcd; margin-bottom:15px;" id="sell_reschedule_div">
                    <input type="button" class="primary-btn" style="width:100%;" onclick="sell_reschedule_v2();" value="Proceed">
                </div>`;


           }else if(msg.result.error_code == 500 && msg.result.error_msg == 'Internal server error'){
               sell_reschedule_v2();
           }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops...',
                  text: msg.result.error_msg,
                })
                $('.loader-rodextrip').fadeOut();
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error airline get price itinerary reissue');
            $('.loader-rodextrip').fadeOut();
       },timeout: 300000
    });
}

function sell_reschedule_v2(){
    title = '';
    if(airline_get_detail.result.response.state == 'booked')
        title = 'Are you sure want to change your booking?';
    else
        title = 'Are you sure want to reissue?';
    Swal.fire({
      title: 'Are you sure want to reissue?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
        if (result.value) {
            if (result.value == true){
            show_loading();
            please_wait_transaction();
//                document.getElementById('next_reissue').disabled = true;
                $.ajax({
                   type: "POST",
                   url: "/webservice/airline",
                   headers:{
                        'action': 'sell_reschedule_v2',
                   },
            //       url: "{% url 'tt_backend_rodextrip:social_media_tree_update' %}",
                   data: {
                        "journeys_booking": JSON.stringify(journey),
                        "passengers":JSON.stringify({
                            "adult": airline_get_detail.result.response.ADT,
                            "child": airline_get_detail.result.response.CHD,
                            "infant": airline_get_detail.result.response.INF
                        }),
                        'signature': signature,
                        "pnr": JSON.stringify(pnr_list),
                        'booking': JSON.stringify(airline_get_detail)
                   },
                   success: function(msg) {
                       hide_modal_waiting_transaction();
                       document.getElementById('show_loading_booking_airline').hidden = false;
                       if(msg.result.error_code == 0){
                           if(document.getElementById('sell_reschedule_div')){
                                document.getElementById('sell_reschedule_div').hidden = true;
                           }
                           for(i in journey){
                               try{
                                   document.getElementById('changejourney_pick'+parseInt(1+parseInt(i))).disabled = true; //sudah sell tidak bisa
                                   document.getElementById('changejourney_pick'+parseInt(1+parseInt(i))).onclick = '';
                               }catch(err){
                                   console.log(err); // error kalau ada element yg tidak ada
                               }
                           }
                           airline_response = [];
                           airline_route = [];
                           check_seat = 0;
                           for(i in msg.result.response.sell_reschedule_provider){
                               for(j in msg.result.response.sell_reschedule_provider[i].journeys){
                                   airline_response.push(msg.result.response.sell_reschedule_provider[i].journeys[j]);
                                   for(k in msg.result.response.sell_reschedule_provider[i].journeys[j].segments){
                                       if(msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].hasOwnProperty('seat_cabins') && msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].seat_cabins.length > 0){
                                           check_seat = 1;
                                           airline_route.push(msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].origin+' - '+msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].destination)
                                       }
                                   }
                               }
                           }
                           for(i=0;i<airline_response.length;i++){
                                for(j=i;j<airline_response.length;j++){
                                    if(airline_response[i].departure_date > airline_response[j].departure_date){
                                        temp = airline_response[i];
                                        airline_response[i] = airline_response[j];
                                        airline_response[j] = temp;
                                    }
                                }
                           }
                           //change date moment
                           for(i=0;i<airline_response.length;i++){

                           }
                           get_price_itinerary_reissue_request(airline_response, msg.result.response.total_admin_fee, msg.result.response.sell_reschedule_provider);
                           if(airline_get_detail.result.response.state == 'issued'){
                               get_payment_acq('Issued',airline_get_detail.result.response.booker.seq_id, airline_get_detail.result.response.order_number, 'billing',signature,'airline_reissue');
                               document.getElementById('payment_acq').hidden = false;
                           }else{
                               document.getElementById('airline_detail').innerHTML += `<input type="button" class="primary-btn issued_booking_btn" style="width:100%;" onclick="update_booking_after_sales_v2(true);" value="Continue">`;
                               document.getElementById('payment_acq').innerHTML = '';
                           }
                           if(check_seat){
                               document.getElementById('airline_booking').innerHTML += `
                                    <div class="row">
                                        <div class="col-lg-12">
                                            <h5 style="padding-top:10px; padding-bottom:10px;">Airline Route</h5>
                                            <div class="row" id="airline_seat_map" style="padding-bottom:15px;">`;
                               first_value = true;
                               passengers = []
                               for(i in airline_get_detail.result.response.passengers){
                                    if(moment().diff(moment(airline_get_detail.result.response.passengers[i].birth_date, "DD MMM YYYY"), 'years') >= 2){
                                        passengers.push(airline_get_detail.result.response.passengers[i])
                                    }
                               }
//                               passengers = JSON.parse(JSON.stringify(airline_get_detail.result.response.passengers));
                               seat_map = {
                                    "seat_availability_provider" : []
                               }
                               for(i in msg.result.response.sell_reschedule_provider){
                                   for(j in msg.result.response.sell_reschedule_provider[i].journeys){
                                       airline_response.push(msg.result.response.sell_reschedule_provider[i].journeys[j]);
                                       for(k in msg.result.response.sell_reschedule_provider[i].journeys[j].segments){
                                           if(msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].hasOwnProperty('seat_cabins') && msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].seat_cabins.length > 0){
                                                check_provider = false;
                                                for(l in seat_map.seat_availability_provider){
                                                    if(seat_map.seat_availability_provider[l].provider == msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].provider){
                                                        check_provider = true;
                                                        break;
                                                    }
                                                }
                                                if(!check_provider){
                                                    seat_map.seat_availability_provider.push({
                                                        "provider": msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].provider,
                                                        "status": "available",
                                                        "pnr": msg.result.response.sell_reschedule_provider[i].pnr,
                                                        "segments": []
                                                    })
                                                }
                                                for(l in seat_map.seat_availability_provider){
                                                    if(seat_map.seat_availability_provider[l].provider == msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].provider &&
                                                       seat_map.seat_availability_provider[l].pnr == msg.result.response.sell_reschedule_provider[i].pnr){
                                                       seat_map.seat_availability_provider[l].segments.push(msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k])
                                                       break;
                                                    }
                                                }
                                                for(l in passengers){
                                                    if(!passengers[l].hasOwnProperty('seat_list'))
                                                        passengers[l]['seat_list'] = [];
                                                    passengers[l]['seat_list'].push({
                                                        "segment_code": msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].segment_code2,
                                                        "departure_date": msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].departure_date,
                                                        "seat_pick": "",
                                                        "seat_code": "",
                                                        "seat_name": "",
                                                        "description": "",
                                                        "currency": "",
                                                        "price": "",
                                                        "pnr": msg.result.response.sell_reschedule_provider[i].pnr
                                                    });
                                                }

                                                if(first_value == true){
                                                    set_seat_show_segments = msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].segment_code2+'_'+msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].departure_date;
                                                    document.getElementById('airline_booking').innerHTML+= `
                                                        <div class="col-lg-4 col-md-6 col-sm-6 col-xs-6">
                                                            <button class="button-seat-pass" style="width:100%; margin-right:10px; margin-bottom:10px; padding:10px;color:`+text_color+`; background-color:`+color+`;" type="button" id="`+msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].segment_code2+`_`+msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].departure_date+`" onclick="show_seat_map('`+msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].segment_code2+`_`+msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].departure_date+`', false)">
                                                                <span>`+msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].segment_code2+`</span>
                                                            </button>
                                                        </div>`;
                                                    first_value = false;
                                                }else{
                                                    document.getElementById('airline_booking').innerHTML+= `
                                                        <div class="col-lg-4 col-md-6 col-sm-6 col-xs-6">
                                                            <button class="button-seat-pass" style="width:100%; margin-right:10px; margin-bottom:10px; padding:10px;color:black; background-color:white;" type="button" id="`+msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].segment_code2+`_`+msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].departure_date+`" onclick="show_seat_map('`+msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].segment_code2+`_`+msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].departure_date+`', false)">
                                                                <span>`+msg.result.response.sell_reschedule_provider[i].journeys[j].segments[k].segment_code2+`</span>
                                                            </button>
                                                        </div>`;
                                                }
                                           }
                                        }
                                    }
                               }

                               document.getElementById('airline_booking').innerHTML+= `

                                            </div>
                                        </div>
                                        <div class="col-lg-12">
                                            <h5 style="padding-top:10px; padding-bottom:10px;">Passenger</h5>
                                            <div class="row">`;
                                            for(i in passengers){
                                                document.getElementById('airline_booking').innerHTML+= `
                                                    <div class="col-lg-4 col-md-6 col-sm-6 col-xs-6">
                                                        <input title="`+airline_get_detail.result.response.passengers[i].title+` `+airline_get_detail.result.response.passengers[i].name+`" class="button-seat-pass" type="button" id="passenger`+parseInt(parseInt(i)+1)+`" style="width:100%; background-color:white;padding:10px; margin-right:10px; text-align:center;margin-bottom:10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color:black;" onclick="set_passenger_seat_map_airline(`+i+`);" value="`+airline_get_detail.result.response.passengers[i].title+` `+airline_get_detail.result.response.passengers[i].name+`">
                                                    </div>`;
                                            }
                                            document.getElementById('airline_booking').innerHTML+= `
                                            </div>
                                            <div id="airline_passenger_detail_seat">

                                            </div>
                                        </div>
                                        <div class="col-lg-12" style="padding-bottom:10px;">
                                            <hr/>
                                            <div class="row">
                                                <div class="col-lg-4 col-sm-4 col-md-4 col-xs-4">
                                                    <div style="text-align:center">
                                                        <span class="button-seat-map2" style="background-color:`+color+`"></span>
                                                        <br/>
                                                        <h6>Selected</h6>
                                                    </div>
                                                </div>
                                                <div class="col-lg-4 col-sm-4 col-md-4 col-xs-4">
                                                    <div style="text-align:center">
                                                        <span class="button-seat-map2" style="background-color:#656565"></span>
                                                        <br/>
                                                        <h6>Not Available</h6>
                                                    </div>
                                                </div>
                                                <div class="col-lg-4 col-sm-4 col-md-4 col-xs-4">
                                                    <div style="text-align:center">
                                                        <span class="button-seat-map2" style="background-color:#CACACA"></span>
                                                        <br/>
                                                        <h6>Available</h6>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="slideshow-container" id="airline_slideshow" style="padding-top:15px;">

                                            </div>
                                        </div>
                                    </div>
                               `;
                               slideIndex = [1,1];
                               slideId = ["mySlides1", "mySlides2"];
                               type = 'reschedule';
                               set_first_passenger_seat_map_airline(0);
                               show_seat_map(set_seat_show_segments, true)
                           }
                       }else{
                           //harus nya login ulang
                           Swal.fire({
                              type: 'error',
                              title: 'Oops...',
                              text: msg.result.error_msg,
                           })
                           $('.loader-rodextrip').fadeOut();
                       }
                   },
                   error: function(XMLHttpRequest, textStatus, errorThrown) {
                        error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error airline sell journey reissue');
                        $('.loader-rodextrip').fadeOut();
                   },timeout: 300000
                });
            }else{

            }

        }else{

        }
    })
}

function update_booking_after_sales_v2(input_pax_seat = false){
    data = {};
    data['signature'] = signature;
    error_log = '';
    if($("[name='radio_payment_type']").val() != undefined){
        data['acquirer_seq_id'] = payment_acq2[payment_method][selected].acquirer_seq_id;
        data['member'] = payment_acq2[payment_method][selected].method;
    }
    pax_seat = {};
    try{
        if(passengers != undefined && input_pax_seat == true)
            data['pax_seat'] = JSON.stringify(passengers);
    }catch(err){
        console.log(err); // error kalau ada element yg tidak ada
    }
    try{
        data['booking'] = JSON.stringify(airline_get_detail);
    }catch(err){
        console.log(err); // error kalau ada element yg tidak ada
    }
    if(error_log == ''){
        getToken();
        show_loading();
        please_wait_transaction();
        $.ajax({
           type: "POST",
           url: "/webservice/airline",
           headers:{
                'action': 'update_booking_v2',

           },
           data: data,
           success: function(msg) {
               hide_modal_waiting_transaction();
               document.getElementById('show_loading_booking_airline').hidden = false;
               try{
                    document.getElementById('airline_reissue_div').innerHTML = '';
               }catch(err){
                    console.log(err); // error kalau ada element yg tidak ada
               }
               if(msg.result.error_code == 0){
                    window.location = '/airline/booking/' + btoa(msg.result.response.order_number);
               }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                    auto_logout();
               }else{
                    Swal.fire({
                      type: 'warning',
                      title: 'Error '+msg.result.error_msg+'!',
                    }).then((result) => {
                      window.location = '/airline/booking/'+btoa(order_number);
                    })
               }
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error airline update booking');
                window.location = '/airline/booking/'+btoa(order_number);
                $('.loader-rodextrip').fadeOut();
                $('.btn-next').removeClass('running');
                $('.btn-next').prop('disabled', false);
           },timeout: 300000
        });
    }else{
        Swal.fire({
          type: 'error',
          title: 'Oops!',
          html: '<span style="color: red;">'+error_log+' </span>',
        })
        window.location = '/airline/booking/'+btoa(order_number);
    }
}

function split_booking_request(){
    passengers = [];
    $('.split_booking:checkbox:checked').each(function( index ) {
        if($('.split_booking:checkbox:checked')[index].id){
            counter_pax = $('.split_booking:checkbox:checked')[index].id.split('_')[1];

            passengers.push('pax_' + pax_list[counter_pax].sequence.toString());
            if(infant_list.length >= counter_pax)
                passengers.push('pax_' + infant_list[counter_pax].sequence.toString());
        }
    });
    if(passengers.length == 0){
        Swal.fire({
          type: 'error',
          title: 'Oops!',
          html: 'Please pick passenger!',
        })
    }else if(passengers.length == airline_get_detail.result.response.passengers.length){
        Swal.fire({
          type: 'error',
          title: 'Oops!',
          html: "Can't split all passenger!",
        })
    }else{
        Swal.fire({
          title: 'Are you sure want to Split Booking?',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes'
        }).then((result) => {
          if (result.value) {
            show_loading();
            please_wait_transaction();
            $.ajax({
               type: "POST",
               url: "/webservice/airline",
               headers:{
                    'action': 'split_booking_v2',
               },
               data: {
                    "passengers":JSON.stringify(passengers),
                    'signature': signature,
               },
               success: function(msg) {
                   airline_get_booking(msg.result.response.order_number);
                   hide_modal_waiting_transaction();
               },
               error: function(XMLHttpRequest, textStatus, errorThrown) {
                    error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error airline update booking');
                    window.location = '/airline/booking/'+btoa(order_number);
                    $('.loader-rodextrip').fadeOut();
                    $('.btn-next').removeClass('running');
                    $('.btn-next').prop('disabled', false);
               },timeout: 300000
            });
          }
        })
    }
}

function split_booking_btn(){
    text = '';
    flight = 1;
    cabin_class = 1;
    text+=`
            <h5>Split Booking</h5>`;
    pax_list = [];
    infant_list = [];
    for(i in airline_get_detail.result.response.passengers){
        if(airline_get_detail.result.response.passengers[i].pax_type == 'INF')
            infant_list.push(airline_get_detail.result.response.passengers[i]);
        else
            pax_list.push(airline_get_detail.result.response.passengers[i]);
    }
    for(i in pax_list){
        text += `<div class="row">
                       <div class="col-lg-10 col-xs-10">
                        `+pax_list[i].title+` `+pax_list[i].name;
        if(infant_list.length > i)
            text += ` - `+infant_list[i].title+` `+infant_list[i].name;
        text += `
                       </div>
                       <div class="col-lg-2 col-xs-2" style="text-align:right;">
                        <input type="checkbox" class="split_booking" id="pax_`+i+`" name="pax_`+i+`"/>
                       </div>
                   </div>`;
    }
//    for(i in airline_get_detail.result.response.passengers){
//
//    }
    text+=`
        <div class="col-lg-12" style="margin-top:10px;">
            <input class="primary-btn-ticket" style="width:100%;" type="button" onclick="split_booking_request();" value="Split Booking">
        </div>
    </div>`;
    document.getElementById('split_booking').innerHTML = text;
}

function get_post_ssr_availability_v2(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'get_post_ssr_availability_v2',
       },
       data: {
            'signature': signature,
            'booking': JSON.stringify(airline_get_detail)
       },
       success: function(msg) {
            if(msg.result.error_code == 0){
                var check_ssr = 0;
                for(i in msg.result.response.ssr_availability_provider){
                    if(msg.result.response.ssr_availability_provider[i].hasOwnProperty('ssr_availability') == true && Object.keys(msg.result.response.ssr_availability_provider[i].ssr_availability).length > 0)
                        check_ssr = 1;
                }
                if(check_ssr == 1){
                    document.getElementById('get_booking_data_json').value = JSON.stringify(airline_get_detail);
                    document.getElementById('after_sales_data').value = JSON.stringify(msg);
                    document.getElementById('after_sales_form').action = '/airline/ssr/'+signature;
                    document.getElementById('after_sales_form').submit();
                }else{
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: #ff9900;">Error airline no request new ssr available</span>',
                    });
                    $('.loader-rodextrip').fadeOut();
                    $('#show_loading_booking_airline').hide();
                    hide_modal_waiting_transaction();
                }
            }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error airline ssr availability </span>' + msg.result.error_msg,
                })
                $('.loader-rodextrip').fadeOut();
                $('#show_loading_booking_airline').hide();
                hide_modal_waiting_transaction();
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error airline ssr availability');
            $('.loader-rodextrip').fadeOut();
            $('#show_loading_booking_airline').hide();
            hide_modal_waiting_transaction();
       },timeout: 300000
    });
}

function get_post_seat_availability_v2(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'get_post_seat_availability_v2',
       },
       data: {
            'signature': signature,
            'booking': JSON.stringify(airline_get_detail)
       },
       success: function(msg) {
            if(msg.result.error_code == 0){
                if(msg.result.response.seat_availability_provider.length > 0){
                    document.getElementById('get_booking_data_json').value = JSON.stringify(airline_get_detail);
                    document.getElementById('after_sales_data').value = JSON.stringify(msg);
                    document.getElementById('after_sales_form').action = '/airline/seat_map/'+signature;
                    document.getElementById('after_sales_form').submit();
                }else{
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: #ff9900;">Error airline no request new seat available</span>',
                    })
                    $('.loader-rodextrip').fadeOut();
                    $('#show_loading_booking_airline').hide();
                    hide_modal_waiting_transaction();
                }
            }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error airline seat availability </span>' + msg.result.error_msg,
                })
                $('.loader-rodextrip').fadeOut();
                $('#show_loading_booking_airline').hide();
                hide_modal_waiting_transaction();
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error airline seat availability');
            $('.loader-rodextrip').fadeOut();
            $('#show_loading_booking_airline').hide();
            hide_modal_waiting_transaction();
       },timeout: 300000
    });
}

function assign_seats_after_sales_v2(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'assign_post_seats_v2',
       },
       data: {
            'signature': airline_signature,
            'booking': JSON.stringify(airline_get_detail)
       },
       success: function(msg) {
           if(msg.result.error_code == 0){
                if(state == 'issued' || state == 'reissue' || state == 'rescheduled'){
                    get_payment_acq('Issued',booker_id, order_number, 'billing',signature,'airline_after_sales');
                    $('#show_loading_booking_airline').hide();
                    hide_modal_waiting_transaction();
                }else
                    update_booking_after_sales_v2();
           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
           }else{
                Swal.fire({
                  type: 'warning',
                  title: 'Error please try again!',
                }).then((result) => {
                  window.location = '/airline/booking/'+btoa(order_number);
                })
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error airline seat after sales');
            $('.loader-rodextrip').fadeOut();
            $('.btn-next').removeClass('running');
            $('.btn-next').prop('disabled', false);
       },timeout: 300000
    });
}

function sell_ssrs_after_sales_v2(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'sell_post_ssrs_v2',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
           if(msg.result.error_code == 0){
                if(state == 'issued' || state == 'reissue' || state == 'rescheduled'){
                    get_payment_acq('Issued',booker_id, order_number, 'billing',signature,'airline_after_sales');
                    $('#show_loading_booking_airline').hide();
                    hide_modal_waiting_transaction();
                }else{
                    update_booking_after_sales_v2();
                }
           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
           }else{
                Swal.fire({
                  type: 'warning',
                  title: 'Error please try again!',
                }).then((result) => {
                  window.location = '/airline/booking/'+btoa(order_number);
                })
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error airline ssr after sales');
            $('.loader-rodextrip').fadeOut();
            $('.btn-next').removeClass('running');
            $('.btn-next').prop('disabled', false);
       },timeout: 300000
    });
}

function show_hide_flight(id){
    var general_up = document.getElementById('flight_title_up'+id);
    var general_down = document.getElementById('flight_title_down'+id);
    var general_show = document.getElementById('flight_div_sh'+id);

    if (general_down.style.display === "none") {
        general_up.style.display = "none";
        general_down.style.display = "block";
        general_show.style.display = "none";
    }
    else {
        general_up.style.display = "block";
        general_down.style.display = "none";
        general_show.style.display = "block";
    }
}

function pre_refund_login_v2(){
    document.getElementById('request_captcha').disabled = true;
    var passengers = [];
    $('.refund_pax:checkbox:checked').each(function( index ) {
        //console.log( index + ": " + $('.refund_pax:checkbox:checked')[0].id );
        passengers.push($('.refund_pax:checkbox:checked')[index].id);
    });
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'pre_refund_login_v2',
       },
       data: {
            'signature': signature,
            'booking': JSON.stringify(airline_get_detail),
            'passengers': JSON.stringify(passengers)
       },
       success: function(msg) {
           document.getElementById('request_captcha').disabled = false;
           $('#request_captcha').removeClass("running");
           refund_msg = msg;
           check_image = 0;
           if(msg.result.error_code ==0){
                if(msg.result.response.init_cancel_provider.length == 0){
                    document.getElementById('cancel').hidden = false;
                    document.getElementById('cancel').innerHTML += `<div id="refund_detail" style="display:none;"></div>`;
//                    document.getElementById('cancel').innerHTML += `<input class="primary-btn-ticket" style="width:100%;" id="full_refund" type="button" onclick="check_refund_partial_btn();" value="Check Refund Price Booking">`;
                    document.getElementById('cancel').innerHTML += `<input class="primary-btn-ticket" style="width:100%;" id="full_refund" type="button" onclick="check_refund_partial_btn_v2();" value="Check Refund Price Booking">`;
                    document.getElementById('captcha').hidden = true;
                }else{
                    for(i in msg.result.response.init_cancel_provider){
                        if(msg.result.response.init_cancel_provider[i].img != ''){
                            document.getElementById('cancel').innerHTML += msg.result.response.init_cancel_provider[i].pnr+`<center><img style="margin-bottom:5px;" src="data:image/png;base64,`+msg.result.response.init_cancel_provider[i].img+`"/></center><br/>`;
                            document.getElementById('cancel').innerHTML += `<input style="margin-bottom:5px;" type="text" class="form-control" name="captcha`+parseInt(i+1)+`" id="captcha`+parseInt(i+1)+`" placeholder="Captcha " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Captcha '">`
                            check_image++;
                        }
                    }
                }
                if(check_image != 0){
                    document.getElementById('cancel').hidden = false;
                    document.getElementById('captcha').innerHTML = `
                    <div class="row" style="padding-top:10px">
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                            <span style="font-size:13px; font-weight:500; padding-right:10px;">Session Time </span>
                        </div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right">
                            <span class="count_time" id="session_time_captcha"><i class="fas fa-stopwatch"></i> 10s</span>
                        </div>
                    </div>
                    <div class="row" style="padding-top:10px">
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                            <span style="font-size:13px; font-weight:500; padding-right:10px;">Elapsed Time </span>
                        </div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right">
                            <span class="count_time" id="elapse_time_captcha"></i> 0s</span>
                        </div>
                    </div>`;
                    document.getElementById('cancel').innerHTML += `<div id="refund_detail" style="display:none;"></div>`;
//                    document.getElementById('cancel').innerHTML += `<input class="primary-btn-ticket" style="width:100%;" id="full_refund" type="button" onclick="check_refund_partial_btn();" value="Check Refund Price Booking">`;
                    document.getElementById('cancel').innerHTML += `<input class="primary-btn-ticket" style="width:100%;" id="full_refund" type="button" onclick="check_refund_partial_btn_v2();" value="Check Refund Price Booking">`;
                    time_limit_captcha = captcha_time;
                    captcha_time_limit_airline();
                }else{
                    document.getElementById('cancel').innerHTML = `<div id="refund_detail" style="display:none;"></div>`;
//                    document.getElementById('cancel').innerHTML += `<input class="primary-btn-ticket" style="width:100%;" id="full_refund" type="button" onclick="check_refund_partial_btn();" value="Check Refund Price Booking">`;
                    document.getElementById('cancel').innerHTML += `<input class="primary-btn-ticket" style="width:100%;" id="full_refund" type="button" onclick="check_refund_partial_btn_v2();" value="Check Refund Price Booking">`;
                    document.getElementById('cancel').hidden = false;
//                    check_refund_partial_btn();
                    check_refund_partial_btn_v2();
                }
           }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error get refund price </span>' + msg.result.error_additional_msg,
                })
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error airline check refund price');
            $('.loader-rodextrip').fadeOut();
       },timeout: 300000
    });
}

function check_refund_partial_btn_v2(){
    try{
        clearInterval(timeLimitInterval);
    }catch(err){
        console.log(err); // error kalau ada element yg tidak ada
    }
    show_loading();
    please_wait_transaction();
    getToken();

    var passengers = [];
    $('.refund_pax:checkbox:checked').each(function( index ) {
        //console.log( index + ": " + $('.refund_pax:checkbox:checked')[0].id );
        passengers.push($('.refund_pax:checkbox:checked')[index].id);
    });
    //console.log(passengers);
    captcha = {};
    if(refund_msg.result.response.length>0){
        for(i in refund_msg.result.response){
            if(refund_msg.result.response[i].img != '')
                captcha[refund_msg.result.response[i].pnr] = document.getElementById('captcha'+parseInt(i+1)).value;
            else
                captcha[refund_msg.result.response[i].pnr] = '';
        }
    }
    $.ajax({
           type: "POST",
           url: "/webservice/airline",
           headers:{
                'action': 'get_cancel_booking',
           },
           data: {
               'order_number': airline_get_detail.result.response.order_number,
               'signature': signature,
               'passengers': JSON.stringify(passengers),
               'booking': JSON.stringify(airline_get_detail),
               'captcha':JSON.stringify(captcha)
           },
           success: function(msg) {
               hide_modal_waiting_transaction();
               document.getElementById("overlay-div-box").style.display = "none";
               if(msg.result.error_code == 0){
                   airline_refund_response = msg.result.response
                   //update ticket
                   document.getElementById('refund_detail').hidden = false;
                   text = '<h5>Refund:<h5>';
                   total = 0;
                   pinalty_amount_with_admin_fee = 0;
                   pnr_refund_list = {};
                   total_hitung_frontend = 0;
                   var is_amadeus = [];
                   for (i in msg.result.response.cancel_booking_provider){
                       currency = msg.result.response.cancel_booking_provider[i].penalty_currency;
//                       if(msg.result.response.cancel_booking_provider[i].hasOwnProperty('resv_total_price')){ //NANTI UPDATE
                       if(msg.result.response.cancel_booking_provider[i].hasOwnProperty('penalty_amount')){
                           try{
                                total += msg.result.response.cancel_booking_provider[i].penalty_amount;
                           }catch(err){console.log(err)}
                           is_amadeus.push(false);
                           for(j in msg.result.response.cancel_booking_provider[i].passengers){
                                for(k in msg.result.response.cancel_booking_provider[i].passengers[j].fees){
                                    if(msg.result.response.cancel_booking_provider[i].passengers[j].fees[k].fee_type == 'RF'){
                                        is_amadeus[i] = true;
                                        if(Object.keys(pnr_refund_list).includes(msg.result.response.cancel_booking_provider[i].pnr) == false){
                                            pnr_refund_list[msg.result.response.cancel_booking_provider[i].pnr] = [];
                                        }
                                        text+= `
                                            <div class="row" style="margin-bottom:5px;">
                                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="text-align:left;">
                                                    <span style="font-size:12px;">`+msg.result.response.cancel_booking_provider[i].passengers[j].title+` `+msg.result.response.cancel_booking_provider[i].passengers[j].first_name+` `+msg.result.response.cancel_booking_provider[i].passengers[j].last_name+` `+msg.result.response.cancel_booking_provider[i].passengers[j].fees[k].fee_name+` `+msg.result.response.cancel_booking_provider[i].pnr+`</span>
                                                </div>
                                            </div>
                                            `;
                                        for(l in msg.result.response.cancel_booking_provider[i].passengers[j].fees[k].service_charges){
                                            // AMADEUS EDIT REFUND
                                            /*
                                            text+=`
                                                <div class="row" style="margin-bottom:5px;">
                                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                                                        <span style="font-size:12px;">`+msg.result.response.cancel_booking_provider[i].passengers[j].fees[k].service_charges[l].charge_type+` `+msg.result.response.cancel_booking_provider[i].passengers[j].fees[k].service_charges[l].charge_code+` `+msg.result.response.cancel_booking_provider[i].pnr+`</span>
                                                    </div>`;
                                            if(msg.result.response.cancel_booking_provider[i].passengers[j].fees[k].fee_code != 'com'){
                                                text+=`
                                                    <div class="col-lg-1 col-md-1 col-sm-1 col-xs-1" style="text-align:right;">
                                                        <span style="font-size:13px;">`+currency+`</span>
                                                        <input type="hidden" id="`+msg.result.response.cancel_booking_provider[i].passengers[j].first_name+`_`+msg.result.response.cancel_booking_provider[i].passengers[j].last_name+`_`+msg.result.response.cancel_booking_provider[i].passengers[j].fees[k].fee_name+`_`+msg.result.response.cancel_booking_provider[i].passengers[j].fees[k].service_charges[l].charge_type+`_`+msg.result.response.cancel_booking_provider[i].passengers[j].fees[k].service_charges[l].sequence+`_type" value="amount"/>
                                                    </div>`;
                                                total_hitung_frontend += msg.result.response.cancel_booking_provider[i].passengers[j].fees[k].service_charges[l].amount;
                                            }else{
                                                text+=`
                                                    <div class="col-lg-1 col-md-1 col-sm-1 col-xs-1" style="text-align:right;">
                                                        <span style="font-size:13px;">%</span>
                                                        <input type="hidden" id="`+msg.result.response.cancel_booking_provider[i].passengers[j].first_name+`_`+msg.result.response.cancel_booking_provider[i].passengers[j].last_name+`_`+msg.result.response.cancel_booking_provider[i].passengers[j].fees[k].fee_name+`_`+msg.result.response.cancel_booking_provider[i].passengers[j].fees[k].service_charges[l].charge_type+`_`+msg.result.response.cancel_booking_provider[i].passengers[j].fees[k].service_charges[l].sequence+`_type" value="percentage"/>
                                                    </div>`;
                                            }
                                            text+=`
                                                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4" style="text-align:right;">
                                                        <input type="text" id="`+msg.result.response.cancel_booking_provider[i].passengers[j].first_name+`_`+msg.result.response.cancel_booking_provider[i].passengers[j].last_name+`_`+msg.result.response.cancel_booking_provider[i].passengers[j].fees[k].fee_name+`_`+msg.result.response.cancel_booking_provider[i].passengers[j].fees[k].service_charges[l].charge_type+`_`+msg.result.response.cancel_booking_provider[i].passengers[j].fees[k].service_charges[l].sequence+`" value="`+getrupiah(msg.result.response.cancel_booking_provider[i].passengers[j].fees[k].service_charges[l].amount)+`" onchange="change_refund_price('`+msg.result.response.cancel_booking_provider[i].passengers[j].first_name+`_`+msg.result.response.cancel_booking_provider[i].passengers[j].last_name+`_`+msg.result.response.cancel_booking_provider[i].passengers[j].fees[k].fee_name+`_`+msg.result.response.cancel_booking_provider[i].passengers[j].fees[k].service_charges[l].charge_type+`_`+msg.result.response.cancel_booking_provider[i].passengers[j].fees[k].service_charges[l].sequence+`')" style="width:130%"/>

                                                    </div>
                                                </div>`;
                                            */
                                            text+=`
                                                <div class="row" style="margin-bottom:5px;">
                                                    <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                                        <span style="font-size:12px;" id="`+msg.result.response.cancel_booking_provider[i].passengers[j].first_name+`_`+msg.result.response.cancel_booking_provider[i].passengers[j].last_name+`_`+msg.result.response.cancel_booking_provider[i].passengers[j].fees[k].fee_name+`_`+msg.result.response.cancel_booking_provider[i].passengers[j].fees[k].service_charges[l].charge_type+`_`+msg.result.response.cancel_booking_provider[i].passengers[j].fees[k].service_charges[l].sequence+`">`+msg.result.response.cancel_booking_provider[i].passengers[j].fees[k].service_charges[l].charge_type+` `+msg.result.response.cancel_booking_provider[i].passengers[j].fees[k].service_charges[l].charge_code+` `+msg.result.response.cancel_booking_provider[i].pnr+`</span>
                                                    </div>
                                                    <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                                        <span style="font-size:13px;">`;
                                            if(msg.result.response.cancel_booking_provider[i].passengers[j].fees[k].fee_code != 'com'){
                                                text+=currency;
                                                text+=`<input type="hidden" id="`+msg.result.response.cancel_booking_provider[i].passengers[j].first_name+`_`+msg.result.response.cancel_booking_provider[i].passengers[j].last_name+`_`+msg.result.response.cancel_booking_provider[i].passengers[j].fees[k].fee_name+`_`+msg.result.response.cancel_booking_provider[i].passengers[j].fees[k].service_charges[l].charge_type+`_`+msg.result.response.cancel_booking_provider[i].passengers[j].fees[k].service_charges[l].sequence+`_type" value="amount"/>`;
                                                total_hitung_frontend += msg.result.response.cancel_booking_provider[i].passengers[j].fees[k].service_charges[l].amount;
                                            }else{
                                                text+=`%`;
                                                text+=`<input type="hidden" id="`+msg.result.response.cancel_booking_provider[i].passengers[j].first_name+`_`+msg.result.response.cancel_booking_provider[i].passengers[j].last_name+`_`+msg.result.response.cancel_booking_provider[i].passengers[j].fees[k].fee_name+`_`+msg.result.response.cancel_booking_provider[i].passengers[j].fees[k].service_charges[l].charge_type+`_`+msg.result.response.cancel_booking_provider[i].passengers[j].fees[k].service_charges[l].sequence+`_type" value="percentage"/>`;
                                            }
                                            text+=getrupiah(msg.result.response.cancel_booking_provider[i].passengers[j].fees[k].service_charges[l].amount);
                                            text+=`
                                                        </span>
                                                    </div>
                                                </div>
                                                    `;

                                            pnr_refund_list[msg.result.response.cancel_booking_provider[i].pnr].push(msg.result.response.cancel_booking_provider[i].passengers[j].first_name+`_`+msg.result.response.cancel_booking_provider[i].passengers[j].last_name+`_`+msg.result.response.cancel_booking_provider[i].passengers[j].fees[k].fee_name+`_`+msg.result.response.cancel_booking_provider[i].passengers[j].fees[k].service_charges[l].charge_type+`_`+msg.result.response.cancel_booking_provider[i].passengers[j].fees[k].service_charges[l].sequence)
                                        }
                                    }
                                }
                           }
                           text+=`
                            <div class="row" style="margin-bottom:5px;">
                                <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                    <span style="font-size:12px;">Received Amount `+msg.result.response.cancel_booking_provider[i].pnr+`</span>
                                </div>
                                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                    <span style="font-size:13px;" id="total_`+msg.result.response.cancel_booking_provider[i].pnr+`">`+currency+` `;
                                    if(is_amadeus[i] == false){
                                        text+=getrupiah(parseInt(msg.result.response.cancel_booking_provider[i].resv_total_price - msg.result.response.cancel_booking_provider[i].penalty_amount))+`</span>`;
                                        total = total - msg.result.response.cancel_booking_provider[i].penalty_amount - msg.result.response.cancel_booking_provider[i].admin_fee;
                                    }else{
                                        text+=getrupiah(parseInt(total_hitung_frontend))+`</span>`;
                                        total = total_hitung_frontend - msg.result.response.cancel_booking_provider[i].penalty_amount - msg.result.response.cancel_booking_provider[i].admin_fee;
                                    }
                                    text+=`
                                </div>
                            </div>`;
//                            text+=`
//                            <div class="row" style="margin-bottom:5px;">
//                                <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
//                                    <span style="font-size:12px;">Refund Fee</span>
//                                </div>
//                                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
//                                    <span style="font-size:13px;">`+currency+` -`+getrupiah(parseInt(msg.result.response.cancel_booking_provider[i].penalty_amount))+`</span>
//                                </div>
//                            </div>`;
                            text+=`
                            <div class="row" style="margin-bottom:5px;">
                                <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                    <span style="font-size:12px;">Admin Fee `+msg.result.response.cancel_booking_provider[i].pnr+`</span>
                                </div>
                                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                    <span style="font-size:13px;">`+currency+` -`+getrupiah(parseInt(msg.result.response.cancel_booking_provider[i].admin_fee))+`</span>
                                </div>
                            </div>`;
                            pinalty_amount_with_admin_fee -= msg.result.response.cancel_booking_provider[i].penalty_amount - msg.result.response.cancel_booking_provider[i].admin_fee;
                        }
                    }
                   text+=`
                        <hr/>
                        <div class="row" style="margin-bottom:5px;">
                            <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                <span style="font-size:12px;">Grand Total</span>
                            </div>
                            <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">`;
                            if(total_hitung_frontend == 0){
                            text+=`
                                <span style="font-size:13px;" id="grand_total_refund">`+currency+` `+getrupiah(parseInt(total))+`</span>`;
                            }else{
                            text+=`
                                <span style="font-size:13px;" id="grand_total_refund">`+currency+` `+getrupiah(parseInt(total_hitung_frontend - msg.result.response.cancel_booking_provider[i].admin_fee))+`</span>`;
                            }
                            text+=`
                            </div>
                        </div>`;


                   document.getElementById('refund_detail').innerHTML = text;
                   document.getElementById('refund_detail').style.display = 'block';
                   document.getElementById('full_refund').value = 'Proceed';
                   document.getElementById('full_refund').setAttribute('onClick', 'cancel_btn_v2();');
                   hide_modal_waiting_transaction();
               }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                    auto_logout();
               }else{
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: #ff9900;">Error airline refund </span>' + msg.result.error_msg,
                    })
                    hide_modal_waiting_transaction();
                    document.getElementById("overlay-div-box").style.display = "none";

                    $('.hold-seat-booking-train').prop('disabled', false);
                    $('.hold-seat-booking-train').removeClass("running");
                    document.getElementById('captcha').innerHTML = `
                        <!--<button class="btn-next primary-btn next-passenger-train ld-ext-right" id="request_captcha" style="width:100%;" type="button" value="Next" onclick="next_disabled();pre_refund_login();">-->
                            <button class="btn-next primary-btn next-passenger-train ld-ext-right" id="request_captcha" style="width:100%;" type="button" value="Next" onclick="next_disabled();pre_refund_login_v2();">
                            Check Refund Price
                            <div class="ld ld-ring ld-cycle"></div>
                        </button>`;
                    document.getElementById('cancel').hidden = true;
                    document.getElementById('cancel').innerHTML = '';
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
                document.getElementById('show_loading_booking_airline').style.display = 'block';
                document.getElementById('show_loading_booking_airline').hidden = false;
                document.getElementById('payment_acq').hidden = true;
                hide_modal_waiting_transaction();
                document.getElementById("overlay-div-box").style.display = "none";
                $('.hold-seat-booking-train').prop('disabled', false);
                $('.hold-seat-booking-train').removeClass("running");
                airline_get_booking(airline_get_detail.result.response.order_number);
           },timeout: 300000
        });
}

function cancel_btn_v2(){
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
//        AMADEUS UPDATE REFUND BOOKING
        var optional_request = false;
        for(i in airline_get_detail.result.response.provider_bookings){
            if(airline_get_detail.result.response.provider_bookings[i].provider == 'amadeus' || airline_get_detail.result.response.provider_bookings[i].provider == 'lionair' || airline_get_detail.result.response.provider_bookings[i].provider == 'lionairapi'){
                optional_request = true
            }
        }
        if(optional_request){
            var passengers = [];
            $('.refund_pax:checkbox:checked').each(function( index ) {
                //console.log( index + ": " + $('.refund_pax:checkbox:checked')[0].id );
                passengers.push($('.refund_pax:checkbox:checked')[index].id);
            });
            var passengers_remarks = []
            $('.refund_remarks:input').each(function( index ) {
                passengers_remarks.push({
                    "value": $('.refund_remarks:input')[index].value,
                    "id": $('.refund_remarks:input')[index].id
                });
            });
            var list_price_refund = [];
            var provider = [];
            for(i in airline_refund_response.provider_bookings){
                if(provider.includes(airline_refund_response.provider_bookings[i].pnr)==false)
                    provider.push(airline_refund_response.provider_bookings[i].provider);
                for(j in airline_refund_response.provider_bookings[i].passengers){
                    for(k in airline_refund_response.provider_bookings[i].passengers[j].fees){
                        if(airline_refund_response.provider_bookings[i].passengers[j].fees[k].fee_type == 'RF'){
                            list_price_refund.push(airline_refund_response.provider_bookings[i].passengers[j].fees[k])
                            list_price_refund[list_price_refund.length-1].pnr = airline_refund_response.provider_bookings[i].pnr;
                            list_price_refund[list_price_refund.length-1].sequence = airline_refund_response.provider_bookings[i].passengers[j].sequence;
                            list_price_refund[list_price_refund.length-1].first_name = airline_refund_response.provider_bookings[i].passengers[j].first_name;
                            list_price_refund[list_price_refund.length-1].last_name = airline_refund_response.provider_bookings[i].passengers[j].last_name;
                        }
                    }
                }
            }
            total = 0;
//            for(i in pnr_refund_list){
//                for(j in pnr_refund_list[i]){
//                    total = parseInt(document.getElementById(pnr_refund_list[i][j]).value.split(',').join(''));
//                    name = pnr_refund_list[i][j];
//                    for(k in list_price_refund){
//                        if(name.split('_')[0] == list_price_refund[k].first_name && name.split('_')[1] == list_price_refund[k].last_name && i == list_price_refund[k].pnr && name.split('_')[2] == list_price_refund[k].fee_name){
//                            for(l in list_price_refund[k].service_charges){
//                                if(name.split('_')[3] == list_price_refund[k].service_charges[l].charge_type && name.split('_')[4] == list_price_refund[k].service_charges[l].sequence){
//                                    list_price_refund[k].service_charges[l].amount = total;
//                                    break;
//                                }
//                            }
//                            break;
//                        }
//                    }
//                }
//            }

            $.ajax({
               type: "POST",
               url: "/webservice/airline",
               headers:{
                    'action': 'update_refund_booking_v2',
               },
               data: {
                   'order_number': airline_get_detail.result.response.order_number,
                   'signature': signature,
                   'passengers': JSON.stringify(passengers),
//                   'list_price_refund': JSON.stringify(list_price_refund),
                   'provider': JSON.stringify(provider),
                   'remarks': JSON.stringify(passengers_remarks),
                   'refund_response': JSON.stringify(airline_refund_response)
               },
               success: function(msg) {
                   if(msg.result.error_code == 0){
                       cancel_reservation_airline_v2();
                   }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                        auto_logout();
                   }else{
                        Swal.fire({
                          type: 'error',
                          title: 'Oops!',
                          html: '<span style="color: #ff9900;">Error airline cancel </span>' + msg.result.error_msg,
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

                        hide_modal_waiting_transaction();
                        document.getElementById("overlay-div-box").style.display = "none";

                        $('.hold-seat-booking-train').prop('disabled', false);
                        $('.hold-seat-booking-train').removeClass("running");
                        airline_get_booking_refund(airline_get_detail.result.response.order_number);
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
                    document.getElementById('show_loading_booking_airline').style.display = 'block';
                    document.getElementById('show_loading_booking_airline').hidden = false;
                    document.getElementById('payment_acq').hidden = true;
                    hide_modal_waiting_transaction();
                    document.getElementById("overlay-div-box").style.display = "none";
                    $('.hold-seat-booking-train').prop('disabled', false);
                    $('.hold-seat-booking-train').removeClass("running");
                    airline_get_booking(airline_get_detail.result.response.order_number);
               },timeout: 300000
            });
        }else
            cancel_reservation_airline_v2();
      }
    })
}

function cancel_reservation_airline_v2(){
    var passengers = [];
    $('.refund_pax:checkbox:checked').each(function( index ) {
        //console.log( index + ": " + $('.refund_pax:checkbox:checked')[0].id );
        passengers.push($('.refund_pax:checkbox:checked')[index].id);
    });
    $.ajax({
           type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'cancel_v2',
       },
       data: {
           'order_number': airline_get_detail.result.response.order_number,
           'signature': signature,
           'passengers': JSON.stringify(passengers),
           'refund_response': JSON.stringify(airline_refund_response)
       },
       success: function(msg) {
           if(msg.result.error_code == 0){
               //update ticket
               window.location = "/airline/booking/" + btoa(airline_get_detail.result.response.order_number);
               document.getElementById('airline_reissue_div').innerHTML = '';
               price_arr_repricing = {};
               pax_type_repricing = [];
               hide_modal_waiting_transaction();
               document.getElementById('show_loading_booking_airline').hidden = false;
               document.getElementById('airline_booking').innerHTML = '';
               document.getElementById('airline_detail').innerHTML = '';
               document.getElementById('payment_acq').innerHTML = '';
               document.getElementById('show_loading_booking_airline').style.display = 'block';
               document.getElementById('show_loading_booking_airline').hidden = false;
               document.getElementById('payment_acq').hidden = true;
               document.getElementById("overlay-div-box").style.display = "none";
               $(".issued_booking_btn").remove();
               //airline_get_booking_refund(airline_get_detail.result.response.order_number);
           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
           }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error airline cancel </span>' + msg.result.error_msg,
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

                hide_modal_waiting_transaction();
                document.getElementById("overlay-div-box").style.display = "none";

                $('.hold-seat-booking-train').prop('disabled', false);
                $('.hold-seat-booking-train').removeClass("running");
                if(window.location.href.split('/').length == 7)
                    airline_get_booking_refund(airline_get_detail.result.response.order_number);
                else if(window.location.href.split('/').length == 6)
                    airline_get_booking(airline_get_detail.result.response.order_number);
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error airline reissued');
            price_arr_repricing = {};
            pax_type_repricing = [];
            document.getElementById('show_loading_booking_airline').hidden = false;
            document.getElementById('airline_booking').innerHTML = '';
            document.getElementById('airline_detail').innerHTML = '';
            document.getElementById('payment_acq').innerHTML = '';
            document.getElementById('show_loading_booking_airline').style.display = 'block';
            document.getElementById('show_loading_booking_airline').hidden = false;
            document.getElementById('payment_acq').hidden = true;
            hide_modal_waiting_transaction();
            document.getElementById("overlay-div-box").style.display = "none";
            $('.hold-seat-booking-train').prop('disabled', false);
            $('.hold-seat-booking-train').removeClass("running");
            airline_get_booking_refund(airline_get_detail.result.response.order_number);
       },timeout: 300000
    });
}