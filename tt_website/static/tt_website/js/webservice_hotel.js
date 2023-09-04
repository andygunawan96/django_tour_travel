var hotel_data = '';
var hotel_data_filter = '';
var hotel_price = '';
var price_pick = '';
var is_hotel_search_done = false;
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
last_session = '';
high_price_slider = 0;
low_price_slider = 99999999;
step_slider = 0;

function get_hotel_config(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/hotel",
       headers:{
            'action': 'get_data',
       },
       data: {},
       success: function(msg) {
        hotel_config = msg
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error hotel config');
       },timeout: 180000
    });
}

function get_auto_complete(term,suggest){
    clearTimeout(hotelAutoCompleteVar);
    term = term.toLowerCase();
    check = 0;
    var priority = [];

    getToken();
    hotelAutoCompleteVar = setTimeout(function() {
        $.ajax({
           type: "POST",
           url: "/webservice/hotel",
           headers:{
                'action': 'get_auto_complete',
           },
           data: {
                'name':term
           },
           success: function(msg) {
            if(document.getElementById('hotel_id_destination').value.split(' - ').length < 2){
                hotel_choices = msg;
                suggest(hotel_choices);
            }
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error hotel auto complete');
           },timeout: 60000
        });
    }, 1000);
}

function hotel_redirect_signup(type){
    if(type != 'signin'){
        getToken();
        $.ajax({
           type: "POST",
           url: "/webservice/hotel",
           headers:{
                'action': 'signin',
           },
           data: {},
           success: function(msg) {
           try{
               if(msg.result.error_code == 0){
                    hotel_signature = msg.result.response.signature;
                    new_login_signature = msg.result.response.signature;

                    if(type != 'search'){
                        $.ajax({
                           type: "POST",
                           url: "/webservice/hotel",
                           headers:{
                                'action': 'get_top_facility',
                           },
                           data: {
                               'use_cache': true,
                               'signature': new_login_signature
                           },
                           success: function(msg) {
                               if(msg.result.error_code == 0){
                                    $.ajax({
                                       type: "POST",
                                       url: "/webservice/hotel",
                                       headers:{
                                            'action': 'search',
                                       },
                                       data: {
                                          'use_cache': true,
                                          'signature': new_login_signature,
                                       },
                                       success: function(msg) {
                                            if(msg.result.error_code == 0 && type != 'get_details'){
                                                $.ajax({
                                                   type: "POST",
                                                   url: "/webservice/hotel",
                                                   headers:{
                                                        'action': 'detail',
                                                   },
                                                   data: {
                                                        'use_cache': true,
                                                        'signature': new_login_signature
                                                   },
                                                   success: function(msg) {
                                                        if(type == 'review' && msg.result.error_code == 0){
                                                            $.ajax({
                                                               type: "POST",
                                                               url: "/webservice/hotel",
                                                               headers:{
                                                                    'action': 'get_cancellation_policy',
                                                               },
                                                               data: {
                                                                    'use_cache': true,
                                                                    'signature': new_login_signature
                                                               },
                                                               success: function(msg) {
                                                                    signature = new_login_signature;
                                                                    $('#myModalSignin').modal('hide');
                                                                    location.reload();
                                                            },error: function(XMLHttpRequest, textStatus, errorThrown) {
                                                               },timeout: 60000
                                                            });
                                                        }else{
                                                            signature = new_login_signature;
                                                            $('#myModalSignin').modal('hide');
                                                            location.reload();

                                                        }
                                                },error: function(XMLHttpRequest, textStatus, errorThrown) {
                                                   },timeout: 60000
                                                });
                                            }else{
                                                signature = new_login_signature;
                                                $('#myModalSignin').modal('hide');
                                                location.reload();

                                            }
                                       },
                                       error: function(XMLHttpRequest, textStatus, errorThrown) {
                                       },timeout: 120000
                                    });
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
              error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error hotel signin');
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

function hotel_signin(data, need_signin=false){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/hotel",
       headers:{
            'action': 'signin',
       },
       data: {},
       success: function(msg) {
           if(msg.result.error_code == 0){
               signature = msg.result.response.signature;
               get_carriers_hotel();
               get_agent_currency_rate();
               if(data == '' && need_signin == false){
                    get_top_facility();
                    hotel_search();

               }else if(data == '' && need_signin == true){
                    hotel_search_in_detail();

               }else if(data != ''){
                    hotel_get_booking(data);
               }
           }else{
               Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: msg.result.error_msg,
               })
               try{
                $('#loading-search-hotel').hide();
               }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
               }
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error hotel signin');
            try{
                $('#loading-search-hotel').hide();
            }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
            }
       },timeout: 120000
    });
}

function hotel_wizard_onclick(){
    $('.loader-rodextrip').fadeIn();
    document.getElementById('btn-search-hotel_wizard').disabled = true;
    hotel_signin('',true);
}


function get_carriers_hotel(){
    $.ajax({
       type: "POST",
       url: "/webservice/hotel",
       headers:{
            'action': 'get_carriers',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
            hotel_carriers = msg;
            if(document.URL.split('/')[document.URL.split('/').length-1] == 'page_admin'){
                text = `<table>
                            <tr>
                                <th>Code</th>
                                <th style="width:10%"></th>
                                <th>Alias</th>
                            </tr>`;
                for(i in hotel_carriers){
                    text +=`<tr>
                                <td style="padding-top:10px;">`+i+`</td>
                                <td></td>
                                <td>
                                    <div class="form-select">
                                        <input type="text" class="form-control" id="hotel_carrier_`+i+`" placeholder="Alias Name " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Alias Name '" value="`+hotel_carriers[i].name+`">
                                    </div>
                                </td>
                            </tr>`;
                }
                text += `</table>`;
                document.getElementById('hotel_masking_div').innerHTML = text;
                hotel_get_carrier_alias_name();
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {

       },timeout: 60000
    });
}

function hotel_search_in_detail(){
    getToken();
    //document.getElementById('hotel_ticket').innerHTML = ``;

    child_age = '';
    for(i=0; i<parseInt($('#hotel_child_wizard').val());i++){
       child_age+=parseInt($('#hotel_child_age_wizard'+(i+1).toString()).val());
       if(i != parseInt($('#hotel_child_wizard').val())-1)
           child_age+=',';
    }
    temp_id = document.getElementById('hotel_searchForm_wizard').action;
    temp_id = temp_id.split('/')[temp_id.split('/').length-1];
    $.ajax({
       type: "POST",
       url: "/webservice/hotel",
       headers:{
            'action': 'search',
       },
       data: {
        'id': temp_id,
        'nationality': $('#hotel_id_nationality_wizard').val(),
        'checkin': $('#hotel_checkin_wizard').val(),
        'checkout': $('#hotel_checkout_wizard').val(),
        'room': $('#hotel_room_wizard').val(),
        'adult': $('#hotel_adult_wizard').val(),
        'child': $('#hotel_child_wizard').val(),
        'child_age': child_age,
        'business_trip': $('#business_trip_wizard').val(),
        'signature': signature
       },
       success: function(msg) {
           $('#loading-search-hotel').hide();
           if(google_analytics != '')
               gtag('event', 'hotel_search', {});
           try{
                if(msg.result.error_code==0){
//                    redirect
                    document.getElementById('hotel_detail').value = JSON.stringify(msg.result.response.hotel_ids[0]);
                    document.getElementById('hotel_searchForm_wizard').submit();
                }else{
                    //kalau error belum
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: #ff9900;">Error hotel search </span>' + msg.result.error_msg,
                    })
                    $('.loader-rodextrip').fadeOut();
                    document.getElementById('btn-search-hotel_wizard').disabled = false;
                }
           }catch(err){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error hotel search </span>' + msg.result.error_msg,
                })
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error hotel search');
            $('#loading-search-hotel').hide();
       },timeout: 180000
   });
}

function hotel_get_current_search(){
    if(!is_hotel_search_done){
        setTimeout(function() {
            $.ajax({
               type: "POST",
               url: "/webservice/hotel",
               headers:{
                    'action': 'get_current_search',
               },
               data: {
                    'destination': $('#hotel_id_destination').val(),
                    'nationality': $('#hotel_id_nationality').val(),
                    'checkin': $('#hotel_checkin').val(),
                    'checkout': $('#hotel_checkout').val(),
                    'room': $('#hotel_room').val(),
                    'adult': $('#hotel_adult').val(),
                    'child': $('#hotel_child').val(),
                    'child_age': child_age,
                    'business_trip': $('#business_trip').val(),
                    'signature': signature
               },
               success: function(msg) {
                    if(msg.result.error_code == 0 && !is_hotel_search_done){
                        vendor = [];
                        if(msg.result.response.hasOwnProperty('hotel_ids') && msg.result.response.hotel_ids.length > 0){
                            hotel_data = msg.result.response;
                            for(i in msg.result.response.hotel_ids){
                                check = 0;
        //                                        if(vendor.length != 0){
        //                                            for(j in msg.result.response.hotel_ids[i].prices){
        //                                                if(vendor.indexOf(j) == -1){
        //                                                    vendor.push(j);
        //                                                }else{
        //                                                    check = 1;
        //                                                }
        //                                            }
        //                                        }
        //                                        if(check == 0){
        //                                            for(j in msg.result.response.hotel_ids[i].prices){
        //                                                if(vendor.indexOf(j) == -1){
        //                                                    vendor.push(j);
        //                                                }
        //                                            }
        //                                        }
                               for(j in msg.result.response.hotel_ids[i].prices){
                                   if(high_price_slider < msg.result.response.hotel_ids[i].prices[j].price){
                                       high_price_slider = msg.result.response.hotel_ids[i].prices[j].price;
                                   }
                                   if(low_price_slider > msg.result.response.hotel_ids[i].prices[j].price){
                                       low_price_slider = msg.result.response.hotel_ids[i].prices[j].price;
                                   }
                               }
                            }
                            if(high_price_slider <= 1000000){
                                step_slider = 50000;
                            }
                            else if(high_price_slider > 1000000 && high_price_slider <= 10000000 ){
                                step_slider = 100000;
                            }
                            else{
                                step_slider = 200000;
                            }
                            document.getElementById("price-from").value = low_price_slider;
                            document.getElementById("price-to").value = high_price_slider;
                            document.getElementById("price-from2").value = low_price_slider;
                            document.getElementById("price-to2").value = high_price_slider;

                            $(".js-range-slider").data("ionRangeSlider").update({
                                 from: low_price_slider,
                                 to: high_price_slider,
                                 min: low_price_slider,
                                 max: high_price_slider,
                                 step: step_slider
                            });
                            $(".js-range-slider2").data("ionRangeSlider").update({
                                 from: low_price_slider,
                                 to: high_price_slider,
                                 min: low_price_slider,
                                 max: high_price_slider,
                                 step: step_slider
                            });
                            filtering('filter');
                            if(hotel_pagination_number != 0){
                                $('#pagination-container2').pagination('drawPage', hotel_pagination_number);
                                $('#pagination-container').pagination('drawPage', hotel_pagination_number);
                                change_image_hotel(hotel_pagination_number);
                            }
                        }
                        hotel_get_current_search();
                    }
               },
               error: function(XMLHttpRequest, textStatus, errorThrown) {
                   error_ajax(XMLHttpRequest, textStatus, errorThrown, '');
               }
            });
        }, 5000);
    }
}
//signin jadi 1 sama search
function hotel_search(){
    getToken();
    //document.getElementById('hotel_ticket').innerHTML = ``;
    child_age = '';
    for(i=0; i<parseInt($('#hotel_child').val());i++){
       child_age+=parseInt($('#hotel_child_age'+(i+1).toString()).val());
       if(i != parseInt($('#hotel_child').val())-1)
           child_age+=',';
    }

    hotel_get_current_search();

    qty_room = $('#hotel_room').val();
    qty_adult = $('#hotel_adult').val();
    qty_child = $('#hotel_child').val();

    if (qty_room >= 9){
        document.getElementById("right-plus-room-hotel").disabled = true;
        document.getElementById("left-minus-room-hotel").disabled = false;
    }else if(qty_room <= 1){
        document.getElementById("right-plus-room-hotel").disabled = false;
        document.getElementById("left-minus-room-hotel").disabled = true;
    }else{
        document.getElementById("right-plus-room-hotel").disabled = false;
        document.getElementById("left-minus-room-hotel").disabled = false;
    }

    if(qty_room == qty_adult){
        if (qty_adult >= 9){
            document.getElementById("right-plus-adult-hotel").disabled = true;
            document.getElementById("left-minus-adult-hotel").disabled = true;
        }else if(qty_adult <= 1){
            document.getElementById("right-plus-adult-hotel").disabled = false;
            document.getElementById("left-minus-adult-hotel").disabled = true;
        }
    }else{
        if (qty_adult >= 9){
            document.getElementById("right-plus-adult-hotel").disabled = true;
        }else if(qty_adult <= 1){
            document.getElementById("left-minus-adult-hotel").disabled = true;
        }
    }

    if(qty_child == 0){
        document.getElementById("left-minus-child-hotel").disabled = true;
    }else if(qty_room*2 == qty_child){
        document.getElementById("right-plus-child-hotel").disabled = true;
        document.getElementById("left-minus-child-hotel").disabled = false;
    }else{
        document.getElementById("left-minus-child-hotel").disabled = false;
        document.getElementById("right-plus-child-hotel").disabled = false;
    }

    $.ajax({
       type: "POST",
       url: "/webservice/hotel",
       headers:{
            'action': 'search',
       },
       data: {
        'destination': $('#hotel_id_destination').val(),
        'nationality': $('#hotel_id_nationality').val(),
        'checkin': $('#hotel_checkin').val(),
        'checkout': $('#hotel_checkout').val(),
        'room': $('#hotel_room').val(),
        'adult': $('#hotel_adult').val(),
        'child': $('#hotel_child').val(),
        'child_age': child_age,
        'business_trip': $('#business_trip').val(),
        'signature': signature
       },
       success: function(msg) {
           is_hotel_search_done = true;
           $('#loading-search-hotel').hide();
           if(google_analytics != '')
               gtag('event', 'hotel_search', {});
           try{
                if(msg.result.error_code==0){
                    hotel_set_signature(msg.result.signature)
                    hotel_data = msg.result.response;
                    vendor = [];
                    for(i in msg.result.response.hotel_ids){
                        check = 0;
//                                        if(vendor.length != 0){
//                                            for(j in msg.result.response.hotel_ids[i].prices){
//                                                if(vendor.indexOf(j) == -1){
//                                                    vendor.push(j);
//                                                }else{
//                                                    check = 1;
//                                                }
//                                            }
//                                        }
//                                        if(check == 0){
//                                            for(j in msg.result.response.hotel_ids[i].prices){
//                                                if(vendor.indexOf(j) == -1){
//                                                    vendor.push(j);
//                                                }
//                                            }
//                                        }
                       for(j in msg.result.response.hotel_ids[i].prices){
                           if(high_price_slider < msg.result.response.hotel_ids[i].prices[j].price){
                               high_price_slider = msg.result.response.hotel_ids[i].prices[j].price;
                           }
                           if(low_price_slider > msg.result.response.hotel_ids[i].prices[j].price){
                               low_price_slider = msg.result.response.hotel_ids[i].prices[j].price;
                           }
                       }
                    }
                    if(high_price_slider <= 1000000){
                        step_slider = 50000;
                    }
                    else if(high_price_slider > 1000000 && high_price_slider <= 10000000 ){
                        step_slider = 100000;
                    }
                    else{
                        step_slider = 200000;
                    }
                    document.getElementById("price-from").value = low_price_slider;
                    document.getElementById("price-to").value = high_price_slider;
                    document.getElementById("price-from2").value = low_price_slider;
                    document.getElementById("price-to2").value = high_price_slider;

                    $(".js-range-slider").data("ionRangeSlider").update({
                         from: low_price_slider,
                         to: high_price_slider,
                         min: low_price_slider,
                         max: high_price_slider,
                         step: step_slider
                    });
                    $(".js-range-slider2").data("ionRangeSlider").update({
                         from: low_price_slider,
                         to: high_price_slider,
                         min: low_price_slider,
                         max: high_price_slider,
                         step: step_slider
                    });
                    filtering('filter');
                    if(hotel_pagination_number != 0){
                        $('#pagination-container2').pagination('drawPage', hotel_pagination_number);
                        $('#pagination-container').pagination('drawPage', hotel_pagination_number);
                        change_image_hotel(hotel_pagination_number);
                    }
                }else{
                    //kalau error belum
                    document.getElementById("hotel_error").innerHTML = '';
                    text = '';
                    text += `
                        <div style="padding:5px; margin:10px;">
                            <div style="text-align:center">
                                <img src="/static/tt_website/images/no_found/no-hotel.png" style="width:60px; height:60px;" alt="Hotel Not Found" title="" />
                                <br/><br/>
                                <span style="font-size:14px; font-weight:600;">Oops! Hotel not found. Please try another day or another hotel</span>
                            </div>
                        </div>
                    `;
                    var node = document.createElement("div");
                    node.innerHTML = text;
                    document.getElementById("hotel_error").appendChild(node);
                    node = document.createElement("div");
                    $('#pagination-container').hide();
                    $('#pagination-container2').hide();
                    $('#hotel_error').show();
                    //tanya ko vincent
//                    Swal.fire({
//                      type: 'error',
//                      title: 'Oops!',
//                      html: '<span style="color: #ff9900;">Error hotel search </span>' + msg.result.error_msg,
//                    })
                }
           }catch(err){
                $('#loading-search-hotel').hide();
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error hotel search </span>' + msg.result.error_msg,
                })
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            is_hotel_search_done = true;
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error hotel search');
            $('#loading-search-hotel').hide();
       },timeout: 300000
   });
}

function hotel_set_signature(signature_hotel){
    $.ajax({
       type: "POST",
       url: "/webservice/hotel",
       headers:{
            'action': 'set_signature',
       },
       data: {
            'signature': signature_hotel
       },
       success: function(msg) {
            signature = signature_hotel;
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error set hotel signature');
            $('#loading-search-hotel').hide();
       },timeout: 180000
   });
}

function hotel_detail_page(){
    qty_room = $('#hotel_room').val();
    qty_adult = $('#hotel_adult').val();
    qty_child = $('#hotel_child').val();

    if (qty_room >= 9){
        document.getElementById("right-plus-room-hotel").disabled = true;
        document.getElementById("left-minus-room-hotel").disabled = false;
    }else if(qty_room <= 1){
        document.getElementById("right-plus-room-hotel").disabled = false;
        document.getElementById("left-minus-room-hotel").disabled = true;
    }else{
        document.getElementById("right-plus-room-hotel").disabled = false;
        document.getElementById("left-minus-room-hotel").disabled = false;
    }

    if(qty_room == qty_adult){
        if (qty_adult >= 9){
            document.getElementById("right-plus-adult-hotel").disabled = true;
            document.getElementById("left-minus-adult-hotel").disabled = true;
        }else if(qty_adult <= 1){
            document.getElementById("right-plus-adult-hotel").disabled = false;
            document.getElementById("left-minus-adult-hotel").disabled = true;
        }
    }else{
        if (qty_adult >= 9){
            document.getElementById("right-plus-adult-hotel").disabled = true;
        }else if(qty_adult <= 1){
            document.getElementById("left-minus-adult-hotel").disabled = true;
        }
    }

    if(qty_child == 0){
        document.getElementById("left-minus-child-hotel").disabled = true;
    }else if(qty_room*2 == qty_child){
        document.getElementById("right-plus-child-hotel").disabled = true;
        document.getElementById("left-minus-child-hotel").disabled = false;
    }else{
        document.getElementById("left-minus-child-hotel").disabled = false;
        document.getElementById("right-plus-child-hotel").disabled = false;
    }

    $.ajax({
       type: "POST",
       url: "/webservice/hotel",
       headers:{
            'action': 'detail_page',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
            facilities = msg.facilities;
            hotel_search_data = JSON.stringify(msg.hotel_search);
            hotel_facility_request(facilities);
            var firstDate = msg.check_in;
            var secondDate = msg.check_out;
            get_agent_currency_rate();
            hotel_detail_request(moment(firstDate).format('DD MMM YYYY'), moment(secondDate).format('DD MMM YYYY'));
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error data review hotel');
            $('#loading-search-hotel').hide();
       },timeout: 180000
   });
}

function hotel_passenger_page(){
    $.ajax({
       type: "POST",
       url: "/webservice/hotel",
       headers:{
            'action': 'passenger_page',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
            get_carriers_hotel();
            hotel_price = msg.hotel_price;
            hotel_request = msg.hotel_request;
            departure_date = ''
            if(hotel_request.hasOwnProperty('checkin_date'))
                departure_date = moment(hotel_request.checkout_date, 'DD MMM YYYY').format('YYYY-MM-DD')
            hotel_detail();
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error data review hotel');
            $('#loading-search-hotel').hide();
       },timeout: 180000
   });
}

function hotel_review_page(){
    $.ajax({
       type: "POST",
       url: "/webservice/hotel",
       headers:{
            'action': 'review_page',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
            facilities = msg.facilities;
            adult = msg.adult;
            booker = msg.booker;
            contact = msg.contact;
            child = msg.child;
            hotel = msg.hotel;
            //upsell_price = {{upsell}};
            hotel_price = msg.hotel_price;
            cancellation_policy = msg.cancellation_policy;
            special_request = msg.special_request;
            hotel_detail(cancellation_policy);
            hotel_facility_request(facilities);
            hotel_provision(hotel_price.price_code, hotel_price.provider);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error data review hotel');
            $('#loading-search-hotel').hide();
       },timeout: 180000
   });
}

function get_top_facility(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/hotel",
       headers:{
            'action': 'get_top_facility',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
        if(msg.result.error_code == 0){
            top_facility = msg.result.response;
            if (top_facility.length != 0){
                facility_filter_html = `<hr><h6 class="filter_general" onclick="show_hide_general('hotelFacilities');">Facilities <i class="fas fa-chevron-down" id="hotelFacilities_generalDown" style="float:right; display:none;"></i><i class="fas fa-chevron-up" id="hotelFacilities_generalUp" style="float:right; display:block;"></i></h6>
                <div id="hotelFacilities_generalShow" style="display:inline-block;">`;
                for(i in top_facility){
                    facility_filter_html += `
                    <label class="check_box_custom">
                        <span class="span-search-ticket" style="color:black;">`+top_facility[i].facility_name+`</span>
                        <input type="checkbox" id="fac_filter`+i+`" onclick="change_filter('facility',`+i+`);">
                        <span class="check_box_span_custom"></span>
                    </label><br/>`;
                }
                facility_filter_html+=`</div>`;
                var node = document.createElement("div");
                node.innerHTML = facility_filter_html;
                document.getElementById("filter").appendChild(node);

                facility_filter_html = `<hr><h6 style="padding-bottom:10px;">Facilities</h6>`;
                for(i in top_facility){
                    facility_filter_html += `
                    <label class="check_box_custom">
                        <span class="span-search-ticket" style="color:black;">`+top_facility[i].facility_name+`</span>
                        <input type="checkbox" id="fac_filter2`+i+`" onclick="change_filter('facility',`+i+`);">
                        <span class="check_box_span_custom"></span>
                    </label><br/>`;
                }
                var node = document.createElement("div");
                node.innerHTML = facility_filter_html;
                document.getElementById("filter2").appendChild(node);
            }
        }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
            auto_logout();
        }else{
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: #ff9900;">Error hotel get top facility </span>' + msg.result.error_msg,
            })
            $('.loader-rodextrip').fadeOut();
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error hotel top facility');
       },timeout: 60000
    });
}

//Versi 1 dimana ambil icon facility dari backend
function hotel_facility_request_1(hotel_facilities){
    getToken();
    $.ajax({
        type: "POST",
        url: "/webservice/hotel",
        headers:{
            'action': 'get_facility_img',
        },
        data: {
            'signature': signature
        },
        success: function(msg) {
            if(msg.result.error_code == 0){
                facility_image = msg.result.response;
                facility_image_html = '';
                //Note: Fungsi Buat get Master facility dari backend(msg)
                //Note: Fungsi Buat checking Facility Hotel yg sedang aktif(hotel_facilities)
                hotel_facilities = $.parseJSON(hotel_facilities);

                for (rec in hotel_facilities){
                    var new_html = '';
                    for(i in facility_image){
                        if (facility_image[i].facility_name == hotel_facilities[rec].facility_name){
                            new_html = `
                            <div class="col-md-3 col-xs-4" style="width:25%; padding-bottom:15px;">
                                <i class="fas fa-circle" style="font-size:9px;"></i>
                                <span style="font-weight:500;"> `+ hotel_facilities[rec].facility_name +`</span>
                            </div>`;
                            break;
                        }
                        if (facility_image[i].internal_code == hotel_facilities[rec].facility_id){
                            new_html = `
                            <div class="col-md-3 col-sm-4 col-xs-6" style="width:25%; padding-bottom:15px;">
                                <i class="fas fa-circle" style="font-size:9px;"></i>
                                <span style="font-weight:500;"> `+ hotel_facilities[rec].facility_name +`</span>
                            </div>`;
                            break;
                        }
                    }
                    if (new_html === '' || facility_image[i].facility_image == false){
                        new_html = `
                        <div class="col-md-3 col-sm-4 col-xs-6" style="width:25%; padding-bottom:15px;">
                            <i class="fas fa-circle" style="font-size:9px;"></i>
                            <span style="font-weight:500;"> `+ hotel_facilities[rec].facility_name +`</span>
                        </div>`;
                    }
                    facility_image_html += new_html;
                }
                document.getElementById("js_image_facility").innerHTML = facility_image_html;
            }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
            }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error hotel service charge </span>' + msg.result.error_msg,
                })
                $('.loader-rodextrip').fadeOut();
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error hotel facility request');
        },timeout: 60000
    });
}

//Versi 2 Menggunakan icon standart sja
function hotel_facility_request(hotel_facilities){
    getToken();
    var facility_image_html = '';
    try{
        hotel_facilities = $.parseJSON(hotel_facilities);
        for (rec in hotel_facilities){
            if (hotel_facilities[rec].facility_name != undefined){
                var fac_name = hotel_facilities[rec].facility_name;
            } else {
                // Error handling untuk KNB
                // Hapus jika data dari KNB sdah di update
                var fac_name = hotel_facilities[rec];
            }
            facility_image_html += `
                    <div class="col-md-3 col-xs-6" style="width:25%; padding-bottom:15px;">
                        <i class="fas fa-circle" style="font-size:9px;"></i>
                        <span style="font-weight:500;"> `+ fac_name +`</span>
                    </div>`;
        }
        document.getElementById("js_image_facility").innerHTML = facility_image_html;
    }catch(err){
        facility_image_html += `
        <div class="col-md-3 col-xs-6" style="width:25%; padding-bottom:15px;">
            <i class="fas fa-circle" style="font-size:9px;"></i>
            <span style="font-weight:500;">No Facility to show right now</span>
        </div>`;
        document.getElementById("js_image_facility").innerHTML = facility_image_html;
    }
}

function hotel_detail_request(checkin_date, checkout_date){
    clearTimeout(myVar);
    // Remove Copy dan Next button waktu ganti tanggal START
    document.getElementById("hotel_detail_button").innerHTML = '';
    // Remove Copy dan Next button waktu ganti tanggal END
    document.getElementById('hotel_detail_table').innerHTML = '';
    document.getElementById("detail_room_pick").innerHTML = `
    <div class="detail-hotel-box">
        <div class="row" style="margin-bottom:15px;">
            <div class="col-lg-12 mb-2">
                <div class="stripe_checkbox" style="float:right;">
                    <div class="div_stripe">
                        <div class="loading_stripe"></div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-3">
                <div class="stripe_img_big_room">
                    <div class="div_stripe">
                        <div class="loading_stripe"></div>
                    </div>
                </div>
            </div>
            <div class="col-lg-9 col-md-9">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="stripe_div_100" style="margin-bottom:5px;">
                            <div class="div_stripe">
                                <div class="loading_stripe"></div>
                            </div>
                        </div>
                        <div class="place_div_left_right">
                            <div class="stripe_div_small100">
                                <div class="div_stripe">
                                    <div class="loading_stripe"></div>
                                </div>
                            </div>
                            <label style="position:absolute; right:0px;">
                                <div class="stripe_div_small100">
                                    <div class="div_stripe">
                                        <div class="loading_stripe"></div>
                                    </div>
                                </div>
                            </label>
                        </div>
                        <hr style="margin:5px 0px;">
                    </div>
                    <div class="col-lg-12">
                        <div class="row">
                            <div class="col-lg-8 col-md-8">
                                <div class="stripe_div_medium115" style="margin-bottom:5px;">
                                    <div class="div_stripe">
                                        <div class="loading_stripe"></div>
                                    </div>
                                </div>
                                <div class="stripe_div_small85" style="margin-bottom:5px;">
                                    <div class="div_stripe">
                                        <div class="loading_stripe"></div>
                                    </div>
                                </div>
                                <div class="stripe_div_medium145" style="margin-bottom:5px;">
                                    <div class="div_stripe">
                                        <div class="loading_stripe"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-4 col-md-4" style="text-align:right;">
                                <div class="stripe_price" style="float:right">
                                    <div class="div_stripe">
                                        <div class="loading_stripe"></div>
                                    </div>
                                </div>
                                <div class="stripe_button" style="float:right;">
                                    <div class="div_stripe">
                                        <div class="loading_stripe"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="detail-hotel-box">
        <div class="row" style="margin-bottom:15px;">
            <div class="col-lg-12 mb-2">
                <div class="stripe_checkbox" style="float:right;">
                    <div class="div_stripe">
                        <div class="loading_stripe"></div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-3">
                <div class="stripe_img_big_room">
                    <div class="div_stripe">
                        <div class="loading_stripe"></div>
                    </div>
                </div>
            </div>
            <div class="col-lg-9 col-md-9">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="stripe_div_100" style="margin-bottom:5px;">
                            <div class="div_stripe">
                                <div class="loading_stripe"></div>
                            </div>
                        </div>
                        <div class="place_div_left_right">
                            <div class="stripe_div_small100">
                                <div class="div_stripe">
                                    <div class="loading_stripe"></div>
                                </div>
                            </div>
                            <label style="position:absolute; right:0px;">
                                <div class="stripe_div_small100">
                                    <div class="div_stripe">
                                        <div class="loading_stripe"></div>
                                    </div>
                                </div>
                            </label>
                        </div>
                        <hr style="margin:5px 0px;">
                    </div>
                    <div class="col-lg-12">
                        <div class="row">
                            <div class="col-lg-8 col-md-8">
                                <div class="stripe_div_medium115" style="margin-bottom:5px;">
                                    <div class="div_stripe">
                                        <div class="loading_stripe"></div>
                                    </div>
                                </div>
                                <div class="stripe_div_small85" style="margin-bottom:5px;">
                                    <div class="div_stripe">
                                        <div class="loading_stripe"></div>
                                    </div>
                                </div>
                                <div class="stripe_div_medium145" style="margin-bottom:5px;">
                                    <div class="div_stripe">
                                        <div class="loading_stripe"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-4 col-md-4" style="text-align:right;">
                                <div class="stripe_price" style="float:right">
                                    <div class="div_stripe">
                                        <div class="loading_stripe"></div>
                                    </div>
                                </div>
                                <div class="stripe_button" style="float:right;">
                                    <div class="div_stripe">
                                        <div class="loading_stripe"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="detail-hotel-box">
        <div class="row" style="margin-bottom:15px;">
            <div class="col-lg-12 mb-2">
                <div class="stripe_checkbox" style="float:right;">
                    <div class="div_stripe">
                        <div class="loading_stripe"></div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-3">
                <div class="stripe_img_big_room">
                    <div class="div_stripe">
                        <div class="loading_stripe"></div>
                    </div>
                </div>
            </div>
            <div class="col-lg-9 col-md-9">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="stripe_div_100" style="margin-bottom:5px;">
                            <div class="div_stripe">
                                <div class="loading_stripe"></div>
                            </div>
                        </div>
                        <div class="place_div_left_right">
                            <div class="stripe_div_small100">
                                <div class="div_stripe">
                                    <div class="loading_stripe"></div>
                                </div>
                            </div>
                            <label style="position:absolute; right:0px;">
                                <div class="stripe_div_small100">
                                    <div class="div_stripe">
                                        <div class="loading_stripe"></div>
                                    </div>
                                </div>
                            </label>
                        </div>
                        <hr style="margin:5px 0px;">
                    </div>
                    <div class="col-lg-12">
                        <div class="row">
                            <div class="col-lg-8 col-md-8">
                                <div class="stripe_div_medium115" style="margin-bottom:5px;">
                                    <div class="div_stripe">
                                        <div class="loading_stripe"></div>
                                    </div>
                                </div>
                                <div class="stripe_div_small85" style="margin-bottom:5px;">
                                    <div class="div_stripe">
                                        <div class="loading_stripe"></div>
                                    </div>
                                </div>
                                <div class="stripe_div_medium145" style="margin-bottom:5px;">
                                    <div class="div_stripe">
                                        <div class="loading_stripe"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-4 col-md-4" style="text-align:right;">
                                <div class="stripe_price" style="float:right">
                                    <div class="div_stripe">
                                        <div class="loading_stripe"></div>
                                    </div>
                                </div>
                                <div class="stripe_button" style="float:right;">
                                    <div class="div_stripe">
                                        <div class="loading_stripe"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

    document.getElementById("select_copy_all").innerHTML =`
    <div class="place_div_white" style="margin-bottom:15px;">
        <span style="font-weight:bold; font-size:14px;">
            <div class="stripe_div_medium130">
                <div class="div_stripe">
                    <div class="loading_stripe"></div>
                </div>
            </div>
        </span>
        <label style="position:absolute; right:10px;">
            <div class="stripe_div_small100">
                <div class="div_stripe">
                    <div class="loading_stripe"></div>
                </div>
            </div>
        </label>
    </div>`;

    document.getElementById("pagination-container").innerHTML =`
    <div class="stripe_div_pagination">
        <div class="div_stripe">
            <div class="loading_stripe"></div>
        </div>
    </div>`;
    document.getElementById("pagination-container2").innerHTML =`
    <div class="stripe_div_pagination">
        <div class="div_stripe">
            <div class="loading_stripe"></div>
        </div>
    </div>`;

    // date_hotel
    document.getElementById('date_hotel').innerHTML = 'Date: ' + checkin_date + ' - ' + checkout_date;
    is_first_render_room_hotel = true;
    hotel_room_detail_pick = null;
    document.getElementById("badge-hotel-notif").innerHTML = "0";
    is_hotel_search_done = false;
    hotel_get_current_search_detail(checkin_date, checkout_date);
    myVar = setTimeout(function() {
        $.ajax({
           type: "POST",
           url: "/webservice/hotel",
           headers:{
                'action': 'detail',
           },
           data: {
                'checkin_date': checkin_date,
                'checkout_date': checkout_date,
                'signature': signature,
                'data': hotel_search_data
           },
           success: function(msg) {
            is_hotel_search_done = true;
            // Remove Copy dan Next button waktu ganti tanggal START
            document.getElementById("hotel_detail_button").innerHTML = '';
            // Remove Copy dan Next button waktu ganti tanggal END
            document.getElementById("detail_room_pick").innerHTML = '';
            document.getElementById('hotel_detail_table').innerHTML = '';
            document.getElementById("select_copy_all").innerHTML = '';
            $('#loading-detail-hotel').hide();
            off_overlay();
            //show package
            if(msg.result.error_code == 0){
                var result = msg.result.response;
                text='';
                text2='';
                text_filter = '';
                var node2 = document.createElement("div");
                if(typeof result.prices === "undefined"){
                    //alert("There's no room in this hotel!");
                    $('#loading-detail-hotel').hide();
                    $('#detail_room_pick').html(`<div class="alert alert-warning" style="border:1px solid #cdcdcd;" role="alert"><span style="font-weight:bold;"> Sorry, We can't find any room for this criteria. Please try another day or another hotel</span></div>`);
                    // window.location.href = "http://localhost:8000";
                }else if(result.prices.length == 0){
                    //alert("There's no room in this hotel!");
                    $('#loading-detail-hotel').hide();
                    $('#detail_room_pick').html(`<div class="alert alert-warning" style="border:1px solid #cdcdcd;" role="alert"><span style="font-weight:bold;"> Sorry, We can't find any room for this criteria. Please try another day or another hotel</span></div>`);
                }else{
                    provider_list = [];
                    for(i in result.prices){
                        if(provider_list.includes(result.prices[i].provider) == false)
                            provider_list.push(result.prices[i].provider);
                    }
                    text_filter+=`
                    <div class="row">
                        <div class="col-lg-12">
                            <h6 class="mb-2">Show All</h6>
                            <div class="checkbox-inline1">
                               <label class="check_box_custom">
                                    <span class="span-search-ticket" style="color:black;">Select All to Copy</span>
                                    <input type="checkbox" id="checkbox_room_all" onclick="filter_room_hotel('','');">
                                    <span class="check_box_span_custom"></span>
                                </label>
                            </div>
                        </div>
                    </div>`;

                    text_filter+=`
                    <div class="row">
                        <div class="col-lg-12">
                            <hr/>
                            <h6 class="mb-2">Meal Type</h6>
                            <div class="checkbox-inline1">
                               <label class="check_box_custom">
                                    <span class="span-search-ticket" style="color:black;">Room Only</span>
                                    <input type="checkbox" id="checkbox_room_only" onclick="filter_room_hotel('meal',false);">
                                    <span class="check_box_span_custom"></span>
                                </label><br>
                            </div>
                            <div class="checkbox-inline1">
                               <label class="check_box_custom">
                                    <span class="span-search-ticket" style="color:black;">Breakfast</span>
                                    <input type="checkbox" id="checkbox_breakfast" onclick="filter_room_hotel('meal',true);">
                                    <span class="check_box_span_custom"></span>
                                </label><br>
                            </div>
                            <hr/>
                        </div>
                    </div>`;

                    text_filter+=`
                    <div class="row">
                        <div class="col-lg-12">
                            <h6 class="mb-2">Room Type</h6>
                            <div class="checkbox-inline1">
                               <label class="check_box_custom">
                                    <span class="span-search-ticket" style="color:black;">Single</span>
                                    <input type="checkbox" id="checkbox_single" onclick="filter_room_hotel('room','single');">
                                    <span class="check_box_span_custom"></span>
                                </label><br>
                            </div>
                            <div class="checkbox-inline1">
                               <label class="check_box_custom">
                                    <span class="span-search-ticket" style="color:black;">Twin</span>
                                    <input type="checkbox" id="checkbox_twin" onclick="filter_room_hotel('room','twin');">
                                    <span class="check_box_span_custom"></span>
                                </label><br>
                            </div>
                            <div class="checkbox-inline1">
                               <label class="check_box_custom">
                                    <span class="span-search-ticket" style="color:black;">Double</span>
                                    <input type="checkbox" id="checkbox_double" onclick="filter_room_hotel('room','double');">
                                    <span class="check_box_span_custom"></span>
                                </label><br>
                            </div>
                            <div class="checkbox-inline1">
                               <label class="check_box_custom">
                                    <span class="span-search-ticket" style="color:black;">Queen</span>
                                    <input type="checkbox" id="checkbox_queen" onclick="filter_room_hotel('room','queen');">
                                    <span class="check_box_span_custom"></span>
                                </label><br>
                            </div>
                            <div class="checkbox-inline1">
                               <label class="check_box_custom">
                                    <span class="span-search-ticket" style="color:black;">King</span>
                                    <input type="checkbox" id="checkbox_king" onclick="filter_room_hotel('room','king');">
                                    <span class="check_box_span_custom"></span>
                                </label><br>
                            </div>
                            <hr/>
                        </div>
                    </div>`;
                    if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false){
                        text_filter+=`
                        <div class="row">
                            <div class="col-lg-12">
                                <h6 class="mb-2">Provider</h6>`;
                            for(i in provider_list){
                                text_filter+=`
                                <div class="checkbox-inline1">
                                   <label class="check_box_custom">
                                        <span class="span-search-ticket" style="color:black;">`+provider_list[i]+`</span>
                                        <input type="checkbox" id="checkbox_provider`+i+`" onclick="filter_room_hotel('provider','`+provider_list[i]+`');">
                                        <span class="check_box_span_custom"></span>
                                    </label><br>
                                </div>`;
                            }
                            text_filter+=`
                            </div>
                        </div>`;
                    }
                    if(document.getElementById("select_copy_div") == null){
                        text2+=`
                        <div class="row">
                            <div class="col-lg-6">
                                <span style="font-size:14px; font-weight:bold;" id="total_room_hotel"></span>
                            </div>
                            <div class="col-lg-6">
                                <label class="check_box_custom" style="float:right; margin-bottom:unset;">
                                    <span class="span-search-ticket" style="color:black;">Select All to Copy</span>
                                    <input type="checkbox" id="check_all_copy" onchange="check_all_result_room();"/>
                                    <span class="check_box_span_custom"></span>
                                </label>
                            </div>
                        </div>`;
                        node2.className = 'sorting-box';
                        node2.id = 'select_copy_div';
                        node2.innerHTML = text2;
                        document.getElementById("select_copy_all").appendChild(node2);
                    }
                    node2 = document.createElement("div");

                    document.getElementById("filterRoom_generalShow").innerHTML = text_filter;

                    result_room_detail = result;
                    hotel_price = result.prices;
                    filter_type = ''
                    filter_room_hotel('');

                    //            for(i in result.prices){
        //                text+=`
        //                <div class="row" style="margin-bottom:15px;">
        //                    <div class="col-lg-12" style="margin-bottom:25px;">
        //                        <div style="top:0px; right:10px; position:absolute;">
        //                            <label class="check_box_custom">
        //                                <span class="span-search-ticket"></span>
        //                                <input type="checkbox" id="copy_hotel"/>
        //                                <span class="check_box_span_custom"></span>
        //                            </label>
        //                        </div>
        //                    </div>`;
        //
        //                for(j in msg.result.prices[i].rooms){
        //                    if(msg.result.prices[i].rooms[j].images.length != 0){
        //                        text+=`
        //                        <div class="col-lg-3 col-md-3">
        //                            <div class="img-hotel-detail" style="background-image: url(`+msg.result.prices[i].rooms[j].images[0].url+`);"></div>
        //                        </div>`;
        //                    }else{
        //                        text+=`
        //                        <div class="col-lg-3 col-md-3">
        //                            <div class="img-hotel-detail" style="background-image: url('/static/tt_website/images/no_found/no-image-hotel.jpeg');"></div>
        //                        </div>`;
        //                    }
        //
        //                    text+='<div class="col-lg-5 col-md-5"> <div style="margin-bottom:10px;"> <h4 style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">' +msg.result.prices[i].rooms[j].description+ '</h4></div>';
        //                    text+='<span>' + msg.result.prices[i].rooms[j].category + '<br/> Total: '+ msg.result.prices[i].rooms[j].qty + ' room(s)</span><br/>';
        //                }
        //
        //                text += '<span>Meal Type: ' + msg.result.prices[i].meal_type+'</span><br/>';
        //                text+=`</div>`;
        //
        //                text+=`
        //                <div class="col-lg-4 col-md-4" style="text-align:right;">`;
        //                if(msg.result.prices[i].currency != 'IDR')
        //                    text+= '<span style="font-weight: bold; font-size:16px;">'+ msg.result.prices[i].currency + ' ' + msg.result.prices[i].price_total +'</span>';
        //                else
        //                    text+= '<span style="font-weight: bold; font-size:16px;">'+ msg.result.prices[i].currency + ' ' + getrupiah(msg.result.prices[i].price_total) + '</span>';
        //
        //                text+='<br/><button class="primary-btn-custom" type="button" onclick="hotel_room_pick('+msg.result.prices[i].sequence+');" id="button'+msg.result.prices[i].sequence+'">Choose</button>';
        //                text+=`</div></div>`;
        //
        //            }
        //            hotel_price = msg.result.prices;
                }
            }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
            }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error hotel request room </span>' + msg.result.error_msg,
                })
                $('.loader-rodextrip').fadeOut();
                document.getElementById("select_copy_all").innerHTML = '';
                document.getElementById('detail_room_pick').innerHTML = `
                <div style="padding:5px; margin:10px;">
                    <div style="text-align:center">
                        <img src="/static/tt_website/images/no_found/no-hotel.png" style="width:60px; height:60px;" alt="Hotel Not Found" title="" />
                        <br/><br/>
                        <span style="font-size:14px; font-weight:600;">Oops! Room not found.</span>
                    </div>
                </div>`;
                document.getElementById("pagination-container").innerHTML = '';
                document.getElementById("pagination-container2").innerHTML = '';
                document.getElementById("filterRoom_generalShow").innerHTML = 'Not Found';
            }
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error hotel detail request');
                document.getElementById("select_copy_all").innerHTML = '';
                document.getElementById('detail_room_pick').innerHTML = `
                <div style="padding:5px; margin:10px;">
                    <div style="text-align:center">
                        <img src="/static/tt_website/images/no_found/no-hotel.png" style="width:60px; height:60px;" alt="Hotel Not Found" title="" />
                        <br/><br/>
                        <span style="font-size:14px; font-weight:600;">Oops! Room not found.</span>
                    </div>
                </div>`;
                document.getElementById("pagination-container").innerHTML = '';
                document.getElementById("pagination-container2").innerHTML = '';
                document.getElementById("filterRoom_generalShow").innerHTML = 'Not Found';
           },timeout: 180000
        });
    },500);
}

function hotel_get_current_search_detail(checkin_date, checkout_date){
    if(!is_hotel_search_done){
        setTimeout(function() {
            $.ajax({
               type: "POST",
               url: "/webservice/hotel",
               headers:{
                    'action': 'get_current_search_detail',
               },
               data: {
                    'checkin_date': checkin_date,
                    'checkout_date': checkout_date,
                    'signature': signature,
                    'data': hotel_search_data
               },
               success: function(msg) {
                    try{
                        if(msg.result.error_code == 0 && !is_hotel_search_done){
                            var result = msg.result.response;
                            text='';
                            text2='';
                            text_filter = '';
                            var node2 = document.createElement("div");
                            if(result.prices.length > 0){
                                provider_list = [];
                                for(i in result.prices){
                                    if(provider_list.includes(result.prices[i].provider) == false)
                                        provider_list.push(result.prices[i].provider);
                                }
                                text_filter+=`
                                <div class="row">
                                    <div class="col-lg-12">
                                        <h6 class="mb-2">Show All</h6>
                                        <div class="checkbox-inline1">
                                           <label class="check_box_custom">
                                                <span class="span-search-ticket" style="color:black;">Select All to Copy</span>
                                                <input type="checkbox" id="checkbox_room_all" onclick="filter_room_hotel('','');">
                                                <span class="check_box_span_custom"></span>
                                            </label>
                                        </div>
                                    </div>
                                </div>`;

                                text_filter+=`
                                <div class="row">
                                    <div class="col-lg-12">
                                        <hr/>
                                        <h6 class="mb-2">Meal Type</h6>
                                        <div class="checkbox-inline1">
                                           <label class="check_box_custom">
                                                <span class="span-search-ticket" style="color:black;">Room Only</span>
                                                <input type="checkbox" id="checkbox_room_only" onclick="filter_room_hotel('meal',false);">
                                                <span class="check_box_span_custom"></span>
                                            </label><br>
                                        </div>
                                        <div class="checkbox-inline1">
                                           <label class="check_box_custom">
                                                <span class="span-search-ticket" style="color:black;">Breakfast</span>
                                                <input type="checkbox" id="checkbox_breakfast" onclick="filter_room_hotel('meal',true);">
                                                <span class="check_box_span_custom"></span>
                                            </label><br>
                                        </div>
                                        <hr/>
                                    </div>
                                </div>`;

                                text_filter+=`
                                <div class="row">
                                    <div class="col-lg-12">
                                        <h6 class="mb-2">Room Type</h6>
                                        <div class="checkbox-inline1">
                                           <label class="check_box_custom">
                                                <span class="span-search-ticket" style="color:black;">Single</span>
                                                <input type="checkbox" id="checkbox_single" onclick="filter_room_hotel('room','single');">
                                                <span class="check_box_span_custom"></span>
                                            </label><br>
                                        </div>
                                        <div class="checkbox-inline1">
                                           <label class="check_box_custom">
                                                <span class="span-search-ticket" style="color:black;">Twin</span>
                                                <input type="checkbox" id="checkbox_twin" onclick="filter_room_hotel('room','twin');">
                                                <span class="check_box_span_custom"></span>
                                            </label><br>
                                        </div>
                                        <div class="checkbox-inline1">
                                           <label class="check_box_custom">
                                                <span class="span-search-ticket" style="color:black;">Double</span>
                                                <input type="checkbox" id="checkbox_double" onclick="filter_room_hotel('room','double');">
                                                <span class="check_box_span_custom"></span>
                                            </label><br>
                                        </div>
                                        <div class="checkbox-inline1">
                                           <label class="check_box_custom">
                                                <span class="span-search-ticket" style="color:black;">Queen</span>
                                                <input type="checkbox" id="checkbox_queen" onclick="filter_room_hotel('room','queen');">
                                                <span class="check_box_span_custom"></span>
                                            </label><br>
                                        </div>
                                        <div class="checkbox-inline1">
                                           <label class="check_box_custom">
                                                <span class="span-search-ticket" style="color:black;">King</span>
                                                <input type="checkbox" id="checkbox_king" onclick="filter_room_hotel('room','king');">
                                                <span class="check_box_span_custom"></span>
                                            </label><br>
                                        </div>
                                        <hr/>
                                    </div>
                                </div>`;
                                if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false){
                                    text_filter+=`
                                    <div class="row">
                                        <div class="col-lg-12">
                                            <h6 class="mb-2">Provider</h6>`;
                                        for(i in provider_list){
                                            text_filter+=`
                                            <div class="checkbox-inline1">
                                               <label class="check_box_custom">
                                                    <span class="span-search-ticket" style="color:black;">`+provider_list[i]+`</span>
                                                    <input type="checkbox" id="checkbox_provider`+i+`" onclick="filter_room_hotel('provider','`+provider_list[i]+`');">
                                                    <span class="check_box_span_custom"></span>
                                                </label><br>
                                            </div>`;
                                        }
                                        text_filter+=`
                                        </div>
                                    </div>`;
                                }

                                if(document.getElementById("select_copy_div") == null){
                                    text2+=`
                                    <div class="row">
                                        <div class="col-lg-6">
                                            <span style="font-size:14px; font-weight:bold;" id="total_room_hotel"></span>
                                        </div>
                                        <div class="col-lg-6">
                                            <label class="check_box_custom" style="float:right; margin-bottom:unset;">
                                                <span class="span-search-ticket" style="color:black;">Select All to Copy</span>
                                                <input type="checkbox" id="check_all_copy" onchange="check_all_result_room();"/>
                                                <span class="check_box_span_custom"></span>
                                            </label>
                                        </div>
                                    </div>`;
                                    node2.className = 'sorting-box';
                                    node2.id = 'select_copy_div';
                                    node2.innerHTML = text2;

                                    document.getElementById("select_copy_all").appendChild(node2);

                                    document.getElementById("filterRoom_generalShow").innerHTML = text_filter;
                                }

                                result_room_detail = result;
                                hotel_price = result.prices;
                                filter_type = ''
                                filter_room_hotel('');
                            }

                        }
                    }catch(err){console.log(err);}
                    hotel_get_current_search_detail(checkin_date, checkout_date);
               },
               error: function(XMLHttpRequest, textStatus, errorThrown) {
                   error_ajax(XMLHttpRequest, textStatus, errorThrown, '');
               }
            });
        }, 5000);
    }
}

function sortFunction(a, b) {
    if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] < b[0]) ? -1 : 1;
    }
}

function create_detail_room(i, data){
    var idx_img = 0;
    for(j in data.prices[i].rooms){
        if(data.prices[i].rooms[j].images.length != 0){
            idx_img = 1;
        }
    }
    detail_room_txt = '';
    detail_price_txt = '';
    discount_hotel = 0;
    for(j in data.prices[i].rooms){
        var rm_number = parseInt(j)+1;

        detail_room_txt += `<div class="row">`;
        detail_room_txt+=`<div class="col-lg-4 mb-2">`;
        if(idx_img == 1){
            detail_room_txt += `<div class="owl-carousel-room-img owl-theme" style="text-align:center;">`;
                for(k in data.prices[i].rooms[j].images){
                detail_room_txt+=`
                    <div class="item" style="cursor:zoom-in; float:none; display:inline-block; text-align:center;">
                    <img class="owl-lazy img-hotel-detail zoom-img" data-src="`+data.prices[i].rooms[j].images[k].url+`" style="border:1px solid #cdcdcd; height:200px; margin:auto; width:auto;" alt="Room Hotel" onerror="this.src='/static/tt_website/images/no_found/no-image-hotel.jpeg';" style="margin: auto; max-height:300px; width:unset;">
                    </div>`;
               }
            detail_room_txt+=`</div>`;
        }
        else{
            detail_room_txt+=`<center><img src="/static/tt_website/images/no_found/no-image-hotel.jpeg" style="height:200px; width:auto; border:1px solid #cdcdcd;" alt="Room Hotel" onerror="this.src='/static/tt_website/images/no_found/no-image-hotel.jpeg';"></center>`;
        }
        detail_room_txt+=`</div>`;


        detail_room_txt+=`<div class="col-lg-8">`;
        detail_room_txt+= '<h5 class="name_room" style="margin-bottom:5px;" + title=' + data.prices[i].rooms[j].description + '><span style="color:' +color+ ';">' + 'Room#'+ rm_number +'</span> - ' + data.prices[i].rooms[j].description + '</h5>';
        if(data.prices[i].rooms[j].hasOwnProperty('category') && data.prices[i].rooms[j].category != ""){
            detail_room_txt+= `<span>`+data.prices[i].rooms[j].category+`</span><br/>`;
        }
        if(data.prices[i].hasOwnProperty('meal_type') && data.prices[i].meal_type != "" && data.prices[i].meal_type != undefined){
            detail_room_txt+= '<span class="meal_room"><b>Meal Type:</b> <span>' + data.prices[i].meal_type+'</span></span><br/>';
        }

        if(data.prices[i].rooms[j].hasOwnProperty('room_size') == true){
            if(data.prices[i].rooms[j].room_size.size != ''){
                detail_room_txt+=`<span class="size_room"><b>Size: </b> <span>`+data.prices[i].rooms[j].room_size.size;
                if(data.prices[i].rooms[j].room_size.unit != ''){
                    detail_room_txt += data.prices[i].rooms[j].room_size.unit;
                }
                detail_room_txt+=`</span></span><br/>`;
            }
        }

        if(data.prices[i].rooms[j].supplements.length != 0)
            detail_room_txt+= '<span class="suplement"><b>Suplement(s): </b></span><ul>';
            for(l in data.prices[i].rooms[j].supplements){
                detail_room_txt+= '<li>'+ data.prices[i].rooms[j].supplements[l].name + ': '+ data.prices[i].rooms[j].supplements[l].price + ' ' + data.prices[i].rooms[j].supplements[l].currency + ' (' + data.prices[i].rooms[j].supplements[l].type +  ')' + '</li>'
            }
            detail_room_txt+= '</ul>';
        if(data.prices[i].rooms[j].notes != undefined && data.prices[i].rooms[j].notes != ""){
            detail_room_txt+= '<span class="note"><b>Notes:</b><br/>';
            detail_room_txt+=`
            <div class="notes-description">
                <div class="text show-more-height" id="notes_div`+i+``+j+`">
                    `+data.prices[i].rooms[j].notes+`
                </div>
                <div class="show-more`+i+``+j+` mb-2" style="color:`+color+`; cursor:pointer; font-weight:800; font-size:14px;" onclick="show_less_notes(`+i+`, `+j+`);">Show More</div>
            </div>`;
        }
        detail_room_txt+=`</div>
        <div class="col-lg-12"><hr/></div></div>`;

        detail_price_txt += `<div class="row">
        <div class="col-lg-12">
            <h6 style="color:`+color+`;">Room #`+rm_number+`</h6>
        </div>`;
        for(np in data.prices[i].rooms[j].nightly_prices){
            date_np = new Date(data.prices[i].rooms[j].nightly_prices[np].date).toString().split(' ');

            detail_price_txt += `<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                Date: `+date_np[2]+` `+date_np[1]+` `+date_np[3]+`
            </div>`;
            detail_price_txt += `<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                `+data.prices[i].currency+` `+getrupiah(data.prices[i].rooms[j].nightly_prices[np].price)+`
            </div>`;
            for(svc in data.prices[i].rooms[j].nightly_prices[np].service_charges){
                if(data.prices[i].rooms[j].nightly_prices[np].service_charges[svc].charge_type == 'DISC')
                    discount_hotel += data.prices[i].rooms[j].nightly_prices[np].service_charges[svc].total
            }
        }
        detail_price_txt += `<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6"><span style="font-weight:700;">Total:</span></div>`;
        detail_price_txt += `<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6"><span style="font-weight:700;">`+data.prices[i].currency+` `+getrupiah(data.prices[i].rooms[j].price_total)+`</span></div>`;
        detail_price_txt += `<div class="col-lg-12"><hr/></div></div>`;
    }
    if(discount_hotel != 0){
        detail_price_txt += `<div class="row"><div class="col-lg-6 col-md-6 col-sm-6 col-xs-6"><span style="font-weight:700;color:#e04022;">Discount:</span></div>`;
        detail_price_txt += `<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6"><span style="font-weight:700;color:#e04022;">`+data.prices[i].currency+` `+getrupiah(discount_hotel)+`</span></div></div>`;
    }
    detail_price_txt += `<div class="row"><div class="col-lg-6 col-md-6 col-sm-6 col-xs-6"><span style="font-weight:700;">Grand Total:</span></div>`;
    detail_price_txt += `<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6"><span style="font-weight:700;">`+data.prices[i].currency+` `+getrupiah(data.prices[i].price_total + discount_hotel)+`</span></div></div>`;

    if(typeof(currency_rate_data) !== 'undefined' && currency_rate_data.result.is_show && data.prices[i].price_total + discount_hotel){
        if(user_login.hasOwnProperty('co_ho_seq_id') && currency_rate_data.result.response.agent.hasOwnProperty(user_login.co_ho_seq_id)){ // buat o3
            for(k in currency_rate_data.result.response.agent[user_login.co_ho_seq_id]){
                try{
                    if(currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].base_currency == data.prices[i].currency){
                        price_convert = ((data.prices[i].price_total + discount_hotel)/currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].rate).toFixed(2);
                        if(price_convert%1 == 0)
                            price_convert = parseInt(price_convert);
                        detail_price_txt+=`
                        <div class="row">
                            <div class="col-lg-6" style="">
                            </div>
                            <div class="col-lg-6" style="">
                                <span style="font-weight:700;">Estimated `+k+` `+getrupiah(price_convert)+`</span>
                            </div>
                        </div>`;
                    }
                }catch(err){
                    console.log(err);
                }
            }
        }
    }

    document.getElementById('detail_room-tab_edit').innerHTML = detail_room_txt;
    document.getElementById('price_room-tab_edit').innerHTML = detail_price_txt;

    $('.zoom-img').wrap('<span style="display:inline-block"></span>').css('display', 'block').parent().zoom({ on:'click' });
    $('.owl-carousel-room-img').owlCarousel({
        loop:false,
        nav: true,
        rewind: true,
        margin: 20,
        responsiveClass:true,
        dots: false,
        lazyLoad:true,
        lazyLoadEager:true,
        merge: false,
        smartSpeed:500,
        autoplay: false,
        autoplayTimeout:8000,
        autoplayHoverPause:false,
        navText: ['<i class="fa fa-chevron-left owl-wh"/>', '<i class="fa fa-chevron-right owl-wh"/>'],
        responsive:{
            0:{
                items:1,
                nav:true
            },
            600:{
                items:1,
                nav:true
            },
            1000:{
                items:1,
                nav:true,
            }
        }
    });

    $("#myModalDetailRoom").modal('show');

}

function hotel_get_cancellation_policy(price_code, provider, view_type){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/hotel",
       headers:{
            'action': 'get_cancellation_policy',
       },
       data: {
          "price_code": price_code,
          "provider": provider,
          'signature': signature
       },
       success: function(msg) {
            // hotel_provision(price_code, provider);
            if(msg.result.error_code == 0){
                var result = msg.result.response;
                if (view_type == '0'){
                    // each Room Picking
                    text = '<ul style="list-style-type: disc; margin: 0 15px;">';
                    //$text2 += 'Cancellation Policy: \n';
                    if(result.policies.length != 0){
                        for(i in result.policies){
                            // if (result.policies[i].received_amount != 0){
                                //text += '<li style="list-style: unset;">Cancellation Before: ' + result.policies[i].date + ' will be Refunded: ' + result.policies[i].received_amount + '</li>';
                                //$text2 += 'Cancellation Before: ' + result.policies[i].date + ' will be Refunded: ' + result.policies[i].received_amount + '\n';
                            // }else {
                                // text += '<li style="list-style: unset;">No Cancellation after: ' + result.policies[i].date;
                                //$text2 += 'No Cancellation after: ' + result.policies[i].date + '\n';
                            // }
                            text += '<li style="list-style: unset;">' + result.policies[i].cancellation_string + '</li>';
                        }
                    } else {
                        text += '<li style="list-style: unset;">Not Refundable</li>';
//                        text += '<li style="list-style: unset;">No Cancellation Policy Provided</li>';
                        //$text2 += 'No Cancellation Policy Provided \n';
                    }
                    text += '</ul>';
                    document.getElementById('cancellation_policy_choose').innerHTML = text;
                    document.getElementById('hotel_detail_button_loading').innerHTML = '';
                    $('.hold-seat-booking-train').prop('disabled', false);
                    $('.hold-seat-booking-train').removeClass("running");

                    document.getElementById("badge-hotel-notif").innerHTML = "1";
//                    hotel_room_pick_button();
                } else if (view_type == '1'){
                    // Passenger Page
                    var text = '';
                    text += `
                    <div class="row">
                        <div class="col-lg-12 mb-3" style="border-bottom:1px solid #cdcdcd;">
                            <h4 class="mb-3"><i class="fas fa-ban"></i> Cancellation Policy</h4>
                            <h6 class="mb-3" id="js_hotel_name">`+result.hotel_name+`</h6>
                        </div>
                    </div>`;
                    text += '<ul style="list-style-type: disc; margin: 0 15px;">';
                    //$text2 += '\n Cancellation Policy: \n';
                    if(result.policies.length != 0){
                        for(i in result.policies){
                            text += '<li style="color:'+color+'; list-style: unset;">' + result.policies[i].cancellation_string + '</li>'
                            $text2 += result.policies[i].cancellation_string + '\n'

                            //if (result.policies[i].received_amount != 0){
                                //text += '<li style="color:'+color+'; list-style: unset;">Cancellation Before: ' + result.policies[i].date + ' will be Refunded: ' + result.policies[i].received_amount + '</li>'
                                //$text2 += 'Cancellation Before: ' + result.policies[i].date + ' will be Refunded: ' + result.policies[i].received_amount + '\n'
                            //} else {
                                //text += '<li style="color:'+color+'; list-style: unset;">No Cancellation after: ' + result.policies[i].date;
                                //$text2 += 'No Cancellation after: ' + result.policies[i].date+ '\n';
                            //}
                        }
                    } else {
                        text += '<li style="color:'+color+'; list-style: unset;">Not Refundable</li>';
//                        text += '<li style="color:'+color+'; list-style: unset;">No Cancellation Policy Provided</li>';
                        //$text2 += 'No Cancellation Policy Provided \n';
                    };
                    text += '</ul>';
                    document.getElementById('cancellation_policy').innerHTML = text;
                } else {
                    text = '<ul style="list-style-type: disc; margin: 0 15px;">';
                    if(result.policies.length != 0){
                        for(i in result.policies){
                            text += '<li style="color:'+color+'; list-style: unset;">' + result.policies[i].cancellation_string +'</li>'
                            //if (result.policies[i].received_amount != 0){
                                //text += '<li style="color:'+color+'; list-style: unset;">Cancellation Before: ' + result.policies[i].date + ' will be Refunded: ' + result.policies[i].received_amount + '</li>'
                            //} else {
                                //text += '<li style="color:'+color+'; list-style: unset;">No Cancellation after: ' + result.policies[i].date;
                            //}
                        }
                    } else {
                        text += '<li style="color:'+color+'; list-style: unset;">Not Refundable</li>';
//                        text += '<li style="color:'+color+'; list-style: unset;">No Cancellation Policy Provided</li>';
                    };
                    text += '</ul>';
                    document.getElementById('js_cancellation_button'+provider).parentNode.innerHTML = text;
                }
            }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
            }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error hotel get cancellation policy </span>' + msg.result.error_msg,
                })
                $('.loader-rodextrip').fadeOut();
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error hotel cancellation policy');
            if (view_type == '1'){
                var text = '<h4>Cancellation Policy</h4>';
                text += '<ul style="list-style-type: circle; margin: 0 15px;"><li style="list-style: unset;">Not Refundable</li></ul>';
//                text += '<ul style="list-style-type: circle; margin: 0 15px;"><li style="list-style: unset;">No Cancellation Policy Provided</li></ul>';
                document.getElementById('cancellation_policy').innerHTML = text;
            } else {
                var text = '<ul style="list-style-type: circle; margin: 0 15px;">';
                text += '<li style="list-style: unset;">Not Refundable</li></ul>';
//                text += '<li style="list-style: unset;">No Cancellation Policy Provided</li></ul>';
                document.getElementById('js_cancellation_button'+provider).parentNode.innerHTML = text;
            }
       },timeout: 60000
    });
}

function hotel_provision(price_code, provider){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/hotel",
       headers:{
            'action': 'provision',
       },
       data: {
          "price_code": price_code,
          "provider": provider,
          'signature': signature
       },
       success: function(msg) {
            //testing start
            //testing end
            provision = msg;
            if(msg.result.error_code == 0){
                if(user_login.co_agent_frontend_security.includes('issued_reservation'))
                    document.getElementById('issued_hotel_btn').disabled = false;
            }else if(msg.result.error_code == 4006){
                if(user_login.co_agent_frontend_security.includes('issued_reservation'))
                    document.getElementById('issued_hotel_btn').disabled = false;
            }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
            }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Oops, Room Not Available. </span> Please try again!' ,
                }).then((result) => {
                  window.location.href = '/hotel/detail/'+hotel.id;
                })

//                Swal.fire({
//                  title: 'Oops, This Room Not Available',
//                  type: 'warning',
//                  showCancelButton: true,
//                  confirmButtonColor: '#3085d6',
//                  cancelButtonColor: '#d33',
//                  confirmButtonText: 'Check Other Room',
//                  cancelButtonText: 'Check Other Hotel'
//                }).then((result) => {
//                  if (result.value) {
//                    window.location.href = '/hotel/detail/'+hotel.id;
//                  }else{
//                    window.location.href = '/hotel/search';
//                  }
//                })
                $('.loader-rodextrip').fadeOut();
            }
            if(msg.result.response.hasOwnProperty('hotel_norm')){
                for (rec in msg.result.response.hotel_norm){
                    if (msg.result.response.hotel_norm[rec]){
                        data_print = msg.result.response.hotel_norm[rec].replace(/&lt;/g, '<');
                        data_print = data_print.replace(/&gt;/g, '>');
                        document.getElementById('js_hotel_norms').innerHTML += '<li class="list-group-item">'+ data_print +'</li>';
                    }
                }
                document.getElementById('js_hotel_norms_container').style.display = 'block';
            }
            if (msg.result.response.cancellation_policy){
                var text = '';
                for (i in msg.result.response.cancellation_policy){
                    if (msg.result.response.cancellation_policy[i].charge_type == 'amount'){
                        text += '<li style="list-style: unset;">Cancellation between: ' + msg.result.response.cancellation_policy[i].from_date + ' - ' + msg.result.response.cancellation_policy[i].to_date;
                        if (msg.result.response.cancellation_policy[i].charge_rate == 0){
                            text += ' No Charged Fee';
                        } else {
                            text += ' will be Charge: ' + msg.result.response.cancellation_policy[i].charge_rate;
                        }
                        text += '<br/>Notes: ' + msg.result.response.cancellation_policy[i].description + '</li>';
                    } else {
                        text += '<li style="list-style: unset;">Cancellation between: ' + msg.result.response.cancellation_policy[i].from_date + ' - ' + msg.result.response.cancellation_policy[i].to_date + ' will be Charge: ' + msg.result.response.cancellation_policy[i].charge_rate + '(%)<br/>Notes: ' + msg.result.response.cancellation_policy[i].description + '</li>';
                    }
                    document.getElementById('new_cancellation_policy').innerHTML = text;
                }
            }
            document.getElementById('loading-hotel').style.display = 'none';
            document.getElementById('js_new_cancel').style.display = 'block';
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error hotel provision');
       },timeout: 60000
    });
}

function gotoForm(){
    document.getElementById('hotel_searchForm').submit();
}

function hotel_issued_alert(val){
    if(val == 1)
        text = "Are you sure you want to Force Issued this booking?";
    else
        text = "Are you sure you want to Hold Booking this booking?";
    Swal.fire({
      title: text,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
//        hotel_issued_booking();
        if(provision.result.error_code == 0){
            $('.next-loading-booking').prop('disabled', true);
            $('.next-loading-issued').addClass("running");
            $('.next-loading-issued').prop('disabled', true);
            $('.loader-rodextrip').fadeIn();
            document.getElementById("passengers").value = JSON.stringify({'booker':booker});
            document.getElementById("signature").value = signature;
            document.getElementById("provider").value = 'hotel';
            document.getElementById("type").value = 'hotel_review';
            document.getElementById("voucher_code").value = voucher_code;
            document.getElementById("discount").value = JSON.stringify(discount_voucher);
            document.getElementById("session_time_input").value = time_limit;
            if(val == 1)
                document.getElementById('hotel_issued').submit();
            else
                hotel_issued_booking(0);
        }else if(provision.result.error_code == 4006){
            text = '';
            text += `
                <div class="row" style="margin-bottom:5px; ">
                    <div class="col-lg-12">
                       <h4> Old Price </h4>
                       <hr/>
                    </div>
                </div>`;
            for(i in hotel_price.rooms){
                text += '<h5>'+ hotel_price.rooms[i].description + '</h5>';
                text += '<span>Qty: '+ hotel_price.rooms[i].qty + '</span><br/>';
                //text += '<span> '+ hotel_price.rooms[i].category + '<span><br/>';
                text += '<span>Meal Type: ' + hotel_price.meal_type + '</span/><br/><br/>';

                text += `<div class="row">`;
                for(j in hotel_price.rooms[i].nightly_prices){
                    date = new Date(hotel_price.rooms[i].nightly_prices[j].date).toString().split(' ');
                    if(hotel_price.rooms[i].nightly_prices[j].currency != 'IDR'){
                        text += '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;"><span>Date: '+date[2] +' '+ date[1] + ' ' + date[3] + '</span></div><div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;"> ' + hotel_price.rooms[i].nightly_prices[j].currency + ' ' + parseInt((hotel_price.rooms[i].nightly_prices[j].price))+'<span/></div>';
                    }else{
                        text += '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;"><span>Date: '+date[2] +' '+ date[1] + ' ' + date[3] + '</span></div><div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;"> ' + hotel_price.rooms[i].nightly_prices[j].currency + ' ' + getrupiah(hotel_price.rooms[i].nightly_prices[j].price)+'<span/></div>';
                    }
                }
                try{
                    grand_total_price = parseFloat(hotel_price.rooms[i].price_total);
                }catch(err){
                    console.log(err); // error kalau ada element yg tidak ada
                }
                text += `<div class="col-lg-12"><hr/></div>`;
                try{
                    if(upsell_price != 0){
                        text+=`<div class="col-lg-7" style="text-align:left;">
                            <span style="font-size:13px;font-weight:500;">Other Service Charge</span><br/>
                        </div>
                        <div class="col-lg-5" style="text-align:right;">`;
                        text+=`
                            <span style="font-size:13px; font-weight:500;">`+hotel_price.rooms[i].nightly_prices[j].currency+` `+getrupiah(upsell_price)+`</span><br/>`;
                        text+=`</div>`;
                        grand_total_price += upsell_price;
                    }
                }catch(err){console.log(err)}
                text += `<div class="col-lg-6">
                    <span style="font-weight:bold;">Total</span>
                </div>
                <div class="col-lg-6" style="text-align:right;">
                    <span style="font-weight:bold;">`+hotel_price.rooms[i].nightly_prices[j].currency+` `+ getrupiah(grand_total_price) +`</span>
                </div>`;
                if(user_login.co_agent_frontend_security.includes('see_commission') == true && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
                    text+= print_commission(hotel_price.commission*-1,'show_commission_hotel_old', hotel_price.rooms[i].nightly_prices[j].currency)
                if(user_login.co_agent_frontend_security.includes('see_commission') == true && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
                    text += `<div class="col-lg-12">
                        <input class="primary-btn" id="show_commission_button_hotel_old" style="width:100%;" type="button" onclick="show_commission_hotel_price_change('old');" value="Hide YPM"/>
                    </div>`;
                text += `</div>`;
            }
            document.getElementById('old_price').innerHTML = text;
            text = '';
            temporary = provision.result.response;
            text += `
                <div class="row" style="margin-bottom:5px; ">
                    <div class="col-lg-12">
                       <h4> New Price </h4>
                       <hr/>
                    </div>
                </div>`;
            for(i in temporary.rooms){
                text += '<h5>'+ temporary.rooms[i].description + '</h5>';
                text += '<span>Qty: '+ temporary.rooms[i].qty + '</span><br/>';
                //text += '<span> '+ hotel_price.rooms[i].category + '<span><br/>';
                text += '<span>Meal Type: ' + temporary.meal_type + '</span/><br/><br/>';

                text += `<div class="row">`;
                for(j in temporary.rooms[i].nightly_prices){
                    date = new Date(temporary.rooms[i].nightly_prices[j].date).toString().split(' ');
                    if(temporary.rooms[i].nightly_prices[j].currency != 'IDR'){
                        text += '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;"><span>Date: '+date[2] +' '+ date[1] + ' ' + date[3] + '</span></div><div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;"> ' + temporary.rooms[i].nightly_prices[j].currency + ' ' + parseInt((temporary.rooms[i].nightly_prices[j].price))+'<span/></div>';
                    }else{
                        text += '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;"><span>Date: '+date[2] +' '+ date[1] + ' ' + date[3] + '</span></div><div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;"> ' + temporary.rooms[i].nightly_prices[j].currency + ' ' + getrupiah(temporary.rooms[i].nightly_prices[j].price)+'<span/></div>';
                    }
                }
                try{
                    grand_total_price = parseFloat(temporary.rooms[i].price_total);
                }catch(err){
                    console.log(err); // error kalau ada element yg tidak ada
                }
                text += `<div class="col-lg-12"><hr/></div>`;
                try{
                    if(upsell_price != 0){
                        text+=`<div class="col-lg-7" style="text-align:left;">
                            <span style="font-size:13px;font-weight:500;">Other Service Charge</span><br/>
                        </div>
                        <div class="col-lg-5" style="text-align:right;">`;
                        text+=`
                            <span style="font-size:13px; font-weight:500;">`+temporary.rooms[i].currency+` `+getrupiah(upsell_price)+`</span><br/>`;
                        text+=`</div>`;
                        grand_total_price += upsell_price;
                    }
                }catch(err){console.log(err)}
                text += `<div class="col-lg-6">
                    <span style="font-weight:bold;">Total</span>
                </div>
                <div class="col-lg-6" style="text-align:right;">
                    <span style="font-weight:bold;">`+temporary.rooms[i].currency+` `+ getrupiah(grand_total_price) +`</span>
                </div>`;
                if(user_login.co_agent_frontend_security.includes('see_commission') == true && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
                    text+= print_commission(temporary.commission*-1,'show_commission_hotel_new',temporary.rooms[i].currency)
                if(user_login.co_agent_frontend_security.includes('see_commission') == true && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
                    text += `<div class="col-lg-12">
                        <input class="primary-btn" id="show_commission_button_hotel_new" style="width:100%;" type="button" onclick="show_commission_hotel_price_change('new');" value="Hide YPM"/>
                    </div>`;
                text += `</div>`;
            }

            document.getElementById('new_price').innerHTML = text;

            $("#ModalChangePrice").modal('show');
        }
      }
    })
}

function hotel_force_issued_alert(force_issued){
    if(force_issued == 1)
        var msg_str = 'Are you sure you want to Force Issued this booking?'
     else
        var msg_str = 'Are you sure you want to Hold this booking?'
    Swal.fire({
      title: msg_str,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        $('.next-loading-booking').prop('disabled', true);
        $('.next-loading-issued').addClass("running");
        $('.next-loading-issued').prop('disabled', true);
        $('.loader-rodextrip').fadeIn();
//        hotel_issued_booking();
        document.getElementById("passengers").value = JSON.stringify({'booker':booker});
        document.getElementById("signature").value = signature;
        document.getElementById("provider").value = 'hotel';
        document.getElementById("type").value = 'hotel_review';
        document.getElementById("voucher_code").value = voucher_code;
        document.getElementById("discount").value = JSON.stringify(discount_voucher);
        document.getElementById("session_time_input").value = time_limit;
        if(force_issued == 1)
            document.getElementById("hotel_issued").submit();
        else
            hotel_issued_booking(0);
      }
    })
}

function force_issued_hotel(val){
    Swal.fire({
      title: 'Are you sure you want to Force Issued this booking?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        please_wait_transaction();
        $('.next-loading-booking').addClass("running");
        $('.next-loading-booking').prop('disabled', true);
        $('.next-loading-issued').prop('disabled', true);
        $('.issued_booking_btn').prop('disabled', true);
        hotel_issued_booking(val);
      }
    })
}

function hotel_issued(data){
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

        if(document.getElementById('hotel_payment_form'))
        {
            var formData = new FormData($('#hotel_payment_form').get(0));
        }
        else
        {
            var formData = new FormData($('#global_payment_form').get(0));
        }
        formData.append('order_number', data);
        formData.append('acquirer_seq_id', payment_acq2[payment_method][selected].acquirer_seq_id);
        formData.append('member', payment_acq2[payment_method][selected].method);
        formData.append('agent_payment', document.getElementById('payment_ho_id') ? document.getElementById('payment_ho_id').value : '');
        formData.append('signature', signature);
        formData.append('voucher_code', voucher_code);
        if (document.getElementById('is_attach_pay_ref') && document.getElementById('is_attach_pay_ref').checked == true)
        {
            formData.append('payment_reference', document.getElementById('pay_ref_text').value);
        }

        getToken();
        $.ajax({
           type: "POST",
           url: "/webservice/hotel",
           headers:{
                'action': 'issued_b2c',
           },
           data: {
               'order_number': data,
               'acquirer_seq_id': payment_acq2[payment_method][selected].acquirer_seq_id,
               'member': payment_acq2[payment_method][selected].method,
               'voucher_code': voucher_code,
               'signature': signature,
           },
           success: function(msg) {
               if(google_analytics != '')
                   gtag('event', 'hotel_issued', {});
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
                        window.location.href = '/hotel/booking/' + btoa(data);
                   }else{
                       //update ticket check lagi
                       price_arr_repricing = {};
                       pax_type_repricing = [];
                       hotel_get_booking(data);
                       document.getElementById('payment_acq').innerHTML = '';
                       document.getElementById('payment_acq').hidden = true;
                       document.getElementById("overlay-div-box").style.display = "none";
                       hide_modal_waiting_transaction();
                   }
               }else if(msg.result.error_code == 1009){
                   price_arr_repricing = {};
                   pax_type_repricing = [];
                   hide_modal_waiting_transaction();
                   document.getElementById('show_loading_booking_airline').hidden = false;
                   document.getElementById('hotel_booking').innerHTML = '';
                   document.getElementById('hotel_detail').innerHTML = '';
                   document.getElementById('payment_acq').innerHTML = '';
                   document.getElementById('voucher_div').style.display = 'none';
                   document.getElementById('ssr_request_after_sales').hidden = true;
                   document.getElementById('show_loading_booking_airline').style.display = 'block';
                   document.getElementById('show_loading_booking_airline').hidden = false;
                   document.getElementById('payment_acq').hidden = true;
                   document.getElementById("overlay-div-box").style.display = "none";
                   $(".issued_booking_btn").hide();
                   Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: #ff9900;">Error hotel issued </span>' + msg.result.error_msg,
                    }).then((result) => {
                      if (result.value) {
                        hide_modal_waiting_transaction();
                      }
                    })
                    hide_modal_waiting_transaction();
                    document.getElementById("overlay-div-box").style.display = "none";

                    $('.hold-seat-booking-train').prop('disabled', false);
                    $('.hold-seat-booking-train').removeClass("running");
                    hotel_get_booking(data);
               }else if(msg.result.error_code == 4006){
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: #ff9900;">Error hotel issued </span>' + msg.result.error_msg,
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
                    for(i in hotel_get_detail.result.response.passengers[0].sale_service_charges){
                        text+=`
                        <div style="text-align:center">
                            `+i+`
                        </div>`;
                        for(j in hotel_get_detail.result.response.passengers){
                            price = {'FARE': 0, 'RAC': 0, 'ROC': 0, 'TAX':0 , 'currency': '', 'CSC': 0, 'SSR': 0, 'DISC': 0,'SEAT':0};
                            csc = 0;
                            for(k in hotel_get_detail.result.response.passengers[j].sale_service_charges[i]){
                                price[k] = hotel_get_detail.result.response.passengers[j].sale_service_charges[i][k].amount;
                                if(price['currency'] == '')
                                    price['currency'] = hotel_get_detail.result.response.passengers[j].sale_service_charges[i][k].currency;
                            }
                            try{
//                                price['CSC'] = hotel_get_detail.result.response.passengers[j].channel_service_charges.amount;
                                csc += hotel_get_detail.result.response.passengers[j].channel_service_charges.amount;
                            }catch(err){
                                console.log(err); // error kalau ada element yg tidak ada
                            }

                            text+=`<div class="row" style="margin-bottom:5px;">
                                <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                    <span style="font-size:12px;">`+hotel_get_detail.result.response.passengers[j].name+` Fare
                                </div>
                                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                    <span style="font-size:13px;">`+price.currency+` `+getrupiah(parseInt(price.FARE))+`</span>
                                </div>
                            </div>
                            <div class="row" style="margin-bottom:5px;">
                                <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                    <span style="font-size:12px;">`+hotel_get_detail.result.response.passengers[j].name+` Tax
                                </div>
                                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                    <span style="font-size:13px;">`+price.currency+` `+getrupiah(parseInt(price.TAX + price.ROC + price.CSC))+`</span>
                                </div>
                            </div>`;
                            if(price.SSR != 0 || price.SEAT != 0)
                                text+=`
                                <div class="row" style="margin-bottom:5px;">
                                    <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                        <span style="font-size:12px;">`+hotel_get_detail.result.response.passengers[j].name+` Additional
                                    </div>
                                    <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                        <span style="font-size:13px;">`+price.currency+` `+getrupiah(parseInt(price.SSR + price.SEAT))+`</span>
                                    </div>
                                </div>`;
                            if(price.DISC != 0)
                                text+=`
                                <div class="row" style="margin-bottom:5px;">
                                    <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                        <span style="font-size:12px;">`+hotel_get_detail.result.response.passengers[j].name+` DISC
                                    </div>
                                    <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                        <span style="font-size:13px;">`+price.currency+` -`+getrupiah(parseInt(price.DISC))+`</span>
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
                    if(user_login.co_agent_frontend_security.includes('see_commission') == true && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
                        text+= print_commission(commission*-1,'show_commission_old', price.currency)
                    if(user_login.co_agent_frontend_security.includes('see_commission') == true && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
                        text+=`<center><div style="margin-bottom:5px;"><input class="primary-btn-ticket" id="show_commission_button_old" style="width:100%;" type="button" onclick="show_commission('old');" value="Hide YPM"/></div>`;
                    text+=`</div>`;
                    document.getElementById('old_price').innerHTML = text;

                    hotel_get_detail = msg;
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
                            csc = 0;
                            for(k in msg.result.response.passengers[j].sale_service_charges[i]){
                                price[k] = msg.result.response.passengers[j].sale_service_charges[i][k].amount;
                                price['currency'] = msg.result.response.passengers[j].sale_service_charges[i][k].currency;
                            }

                            try{
//                                price['CSC'] = hotel_get_detail.result.response.passengers[j].channel_service_charges.amount;
                                csc += hotel_get_detail.result.response.passengers[j].channel_service_charges.amount;
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
                                    <span style="font-size:13px;">`+price.currency+` `+getrupiah(parseInt(price.TAX + price.ROC + price.CSC))+`</span>
                                </div>
                            </div>`;
                            if(price.SSR != 0 || price.SEAT != 0)
                                text+=`
                                <div class="row" style="margin-bottom:5px;">
                                    <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                        <span style="font-size:12px;">`+hotel_get_detail.result.response.passengers[j].name+` Additional
                                    </div>
                                    <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                        <span style="font-size:13px;">`+price.currency+` `+getrupiah(parseInt(price.SSR + price.SEAT))+`</span>
                                    </div>
                                </div>`;
                            if(price.DISC != 0)
                                text+=`
                                <div class="row" style="margin-bottom:5px;">
                                    <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                        <span style="font-size:12px;">`+hotel_get_detail.result.response.passengers[j].name+` DISC
                                    </div>
                                    <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                        <span style="font-size:13px;">`+price.currency+` -`+getrupiah(parseInt(price.DISC))+`</span>
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
                    if(user_login.co_agent_frontend_security.includes('see_commission') == true && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
                        text+= print_commission(commission*-1,'show_commission_new', price.currency)
                    if(user_login.co_agent_frontend_security.includes('see_commission') == true && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
                        text+=`<center><div style="margin-bottom:5px;"><input class="primary-btn-ticket" id="show_commission_button_new" style="width:100%;" type="button" onclick="show_commission('new');" value="Hide YPM"/></div>`;
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
                          html: '<span style="color: #ff9900;">Error hotel issued </span>' + msg.result.error_msg,
                        })
                    }else{
                        Swal.fire({
                          type: 'error',
                          title: 'Error hotel issued '+ msg.result.error_msg,
                          showCancelButton: true,
                          cancelButtonText: 'Ok',
                          confirmButtonColor: color,
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
                    document.getElementById('show_loading_booking_airline').hidden = false;
                    document.getElementById('hotel_booking').innerHTML = '';
                    document.getElementById('hotel_detail').innerHTML = '';
                    document.getElementById('payment_acq').innerHTML = '';
                    document.getElementById('show_loading_booking_airline').style.display = 'block';
                    document.getElementById('show_loading_booking_airline').hidden = false;
                    document.getElementById('payment_acq').hidden = true;
                    hide_modal_waiting_transaction();
                    document.getElementById("overlay-div-box").style.display = "none";

                    $('.hold-seat-booking-train').prop('disabled', false);
                    $('.hold-seat-booking-train').removeClass("running");
                    hotel_get_booking(data);
                    $(".issued_booking_btn").hide();
               }
           },
           contentType:false,
           processData:false,
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error hotel issued');
                price_arr_repricing = {};
                pax_type_repricing = [];
                document.getElementById('show_loading_booking_airline').hidden = false;
                document.getElementById('hotel_booking').innerHTML = '';
                document.getElementById('hotel_detail').innerHTML = '';
                document.getElementById('payment_acq').innerHTML = '';
                document.getElementById('voucher_div').style.display = 'none';
                document.getElementById('ssr_request_after_sales').hidden = true;
                document.getElementById('show_loading_booking_airline').style.display = 'block';
                document.getElementById('show_loading_booking_airline').hidden = false;
                document.getElementById('payment_acq').hidden = true;
                hide_modal_waiting_transaction();
                document.getElementById("overlay-div-box").style.display = "none";
                $('.hold-seat-booking-train').prop('disabled', false);
                $('.hold-seat-booking-train').removeClass("running");
                $(".issued_booking_btn").hide();
                hotel_get_booking(data);
           },timeout: 300000
        });
      }
    })
}

function hotel_request_issued(req_order_number){
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
               'table_name': 'hotel',
               'signature': signature
           },
           success: function(msg) {
               if(msg.result.error_code == 0){
                    price_arr_repricing = {};
                    pax_type_repricing = [];
                    document.getElementById('payment_acq').innerHTML = '';
                    document.getElementById('payment_acq').hidden = true;
                    document.getElementById("overlay-div-box").style.display = "none";
                    hide_modal_waiting_transaction();
                    window.location.href = '/reservation_request/' + btoa(msg.result.response.request_number);
               }
               else {
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: #ff9900;">Error hotel request issued </span>' + msg.result.error_msg,
                    })
                    price_arr_repricing = {};
                    pax_type_repricing = [];
                    document.getElementById('show_loading_booking_airline').hidden = false;
                    document.getElementById('hotel_booking').innerHTML = '';
                    document.getElementById('hotel_detail').innerHTML = '';
                    document.getElementById('payment_acq').innerHTML = '';
                    document.getElementById('show_loading_booking_airline').style.display = 'block';
                    document.getElementById('show_loading_booking_airline').hidden = false;
                    document.getElementById('payment_acq').hidden = true;
                    hide_modal_waiting_transaction();
                    document.getElementById("overlay-div-box").style.display = "none";

                    $('.hold-seat-booking-train').prop('disabled', false);
                    $('.hold-seat-booking-train').removeClass("running");
                    hotel_get_booking(req_order_number);
                    $(".issued_booking_btn").hide();
               }
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                price_arr_repricing = {};
                pax_type_repricing = [];
                document.getElementById('show_loading_booking_airline').hidden = false;
                document.getElementById('hotel_booking').innerHTML = '';
                document.getElementById('hotel_detail').innerHTML = '';
                document.getElementById('payment_acq').innerHTML = '';
                document.getElementById('voucher_div').style.display = 'none';
                document.getElementById('ssr_request_after_sales').hidden = true;
                document.getElementById('show_loading_booking_airline').style.display = 'block';
                document.getElementById('show_loading_booking_airline').hidden = false;
                document.getElementById('payment_acq').hidden = true;
                hide_modal_waiting_transaction();
                document.getElementById("overlay-div-box").style.display = "none";
                $('.hold-seat-booking-train').prop('disabled', false);
                $('.hold-seat-booking-train').removeClass("running");
                $(".issued_booking_btn").hide();
                hotel_get_booking(req_order_number);
           },timeout: 300000
        });
      }
    })
}

function hotel_issued_booking(val){
    force_issued = false;
    var formData = new FormData($('#global_payment_form').get(0));
    if(val == 1)
    {
        formData.append('force_issued', val);
        formData.append('signature', signature);
        formData.append('acquirer_seq_id', payment_acq2[payment_method][selected].acquirer_seq_id);
        formData.append('member', payment_acq2[payment_method][selected].method);
        default_payment_to_ho = ''
        if(total_price_payment_acq == 0)
            default_payment_to_ho = 'balance'
        formData.append('agent_payment', document.getElementById('payment_ho_id') ? document.getElementById('payment_ho_id').value : default_payment_to_ho);
        formData.append('voucher_code', voucher_code);
        if (document.getElementById('is_attach_pay_ref') && document.getElementById('is_attach_pay_ref').checked == true)
        {
            formData.append('payment_reference', document.getElementById('pay_ref_text').value);
        }
        try{
            var radios = document.getElementsByName('use_point');
            for (var j = 0, length = radios.length; j < length; j++) {
                if (radios[j].checked) {
                    formData.append('use_point', radios[j].value);
                    break;
                }
            }

        }catch(err){console.log(err)}
    }
    else
    {
        formData.append('force_issued', val);
        formData.append('signature', signature);
    }

    $.ajax({
       type: "POST",
       url: "/webservice/hotel",
       headers:{
            'action': 'issued',
       },
       data: formData,
       success: function(msg) {
            if(google_analytics != ''){
                if(formData.get('member'))
                    gtag('event', 'hotel_issued', {});
                else
                    gtag('event', 'hotel_hold_booking', {});
            }
            try{
                if(msg.result.error_code == 0){
                    if(val == 0){
                        if(user_login.co_agent_frontend_security.includes('b2c_limitation') == true)
                        {
                            $('.loader-rodextrip').fadeOut();
                            Swal.fire({
                              title: "Success, booking has been made. We'll sent you an email for your reservation",
                              type: 'success',
                              showCancelButton: true,
                              confirmButtonColor: '#3085d6',
                              cancelButtonColor: 'blue',
                              cancelButtonText: 'View Booking',
                              confirmButtonText: 'Payment'
                            }).then((result) => {
                                if (result.value) {
                                    $('.hold-seat-booking-train').addClass("running");
                                    $('.hold-seat-booking-train').attr("disabled", true);
                                    document.getElementById('order_number').value = msg.result.response.order_number;
                                    document.getElementById('hotel_issued').submit();
                                }else{
                                    document.getElementById('issued').innerHTML+= '<input type="hidden" name="order_number" value='+msg.result.response.order_number+'>';
                                    document.getElementById('issued').action = '/hotel/booking/' + btoa(msg.result.response.order_number);
                                    document.getElementById('issued').submit();
                                }
                            })

                        }
                        else
                        {
                            document.getElementById('issued').action = '/hotel/booking/' + btoa(msg.result.response.order_number);
                            document.getElementById('issued').submit();
                        }
                    }else{
                        if(user_login.co_agent_frontend_security.includes('b2c_limitation') == true)
                            send_url_booking('hotel', btoa(msg.result.response.os_res_no), msg.result.response.order_number);
                        document.getElementById('issued').action = '/hotel/booking/' + btoa(msg.result.response.order_number);
                        document.getElementById('issued').submit();
                    }
    //                var form = document.getElementById('hotel_booking');
    //                var input = document.createElement('input');//prepare a new input DOM element
    //                input.setAttribute('name', 'result');//set the param name
    //                input.setAttribute('value', JSON.stringify(msg) );//set the value
    //                input.setAttribute('type', 'hidden')//set the type
    //                form.appendChild(input);
    //                form.submit();
                }else{
                    //swal
                    try{
                        $('.loader-rodextrip').fadeOut();
                    }catch(err){
                        console.log(err); // error kalau ada element yg tidak ada
                    }
                    hide_modal_waiting_transaction();
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: red;">Error issued hotel </span>' + msg.result.error_msg,
                    }).then((result) => {
                      if (result.value) {
                        hide_modal_waiting_transaction();
                      }
                    })
                }
            }catch(err){
                try{
                    $('.loader-rodextrip').fadeOut();
                }catch(err){
                    console.log(err); // error kalau ada element yg tidak ada
                }
                hide_modal_waiting_transaction();
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error hotel issued booking </span>',
                }).then((result) => {
                  if (result.value) {
                    hide_modal_waiting_transaction();
                  }
                })
            }
       },
       contentType:false,
       processData:false,
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error hotel issued booking');
            hide_modal_waiting_transaction();
       },timeout: 300000
    });
}

function hotel_get_booking(data){
    price_arr_repricing = {};
    get_vendor_balance('false');
    $.ajax({
       type: "POST",
       url: "/webservice/hotel",
       headers:{
            'action': 'get_booking',
       },
       data: {
            'order_number': data,
            'signature': signature
       },
       success: function(msg) {
            try{
                list_pnr = [];
                if(msg.result.error_code == 0){
                    hide_modal_waiting_transaction();
                    document.getElementById('button-home').hidden = false;
                    document.getElementById('button-new-reservation').hidden = false;
                    document.getElementById("overlay-div-box").style.display = "none";
                    can_issued = msg.result.response.can_issued;
                    if(msg.result.response.hold_date != ''){
                        tes = moment.utc(msg.result.response.hold_date).format('YYYY-MM-DD HH:mm:ss')
                        localTime  = moment.utc(tes).toDate();
                        data_gmt = moment(msg.result.response.hold_date)._d.toString().split(' ')[5];
                        gmt = data_gmt.replace(/[^a-zA-Z+-]+/g, '');
                        timezone = data_gmt.replace (/[^\d.]/g, '');
                        timezone = timezone.split('')
                        timezone = timezone.filter(item => item !== '0')
                    }if(msg.result.response.booked_date != ''){
                        tes = moment.utc(msg.result.response.booked_date).format('YYYY-MM-DD HH:mm:ss')
                        localTime  = moment.utc(tes).toDate();
                        data_gmt = moment(msg.result.response.booked_date)._d.toString().split(' ')[5];
                        gmt = data_gmt.replace(/[^a-zA-Z+-]+/g, '');
                        timezone = data_gmt.replace (/[^\d.]/g, '');
                        timezone = timezone.split('')
                        timezone = timezone.filter(item => item !== '0')
                        msg.result.response.booked_date = moment(localTime).format('DD MMM YYYY HH:mm') + ' ' + gmt + timezone;
                    }
                    if(msg.result.response.issued_date != ''){
                        tes = moment.utc(msg.result.response.issued_date).format('YYYY-MM-DD HH:mm:ss')
                        localTime  = moment.utc(tes).toDate();
                        data_gmt = moment(msg.result.response.issued_date)._d.toString().split(' ')[5];
                        gmt = data_gmt.replace(/[^a-zA-Z+-]+/g, '');
                        timezone = data_gmt.replace (/[^\d.]/g, '');
                        timezone = timezone.split('')
                        timezone = timezone.filter(item => item !== '0')
                        msg.result.response.issued_date = moment(localTime).format('DD MMM YYYY HH:mm') + ' ' + gmt + timezone;
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
                    }else if(msg.result.response.state == 'booked'){
                       try{
                           if(can_issued)
                               check_payment_payment_method(msg.result.response.order_number, 'Issued', msg.result.response.booker.seq_id, 'billing', 'hotel', signature, msg.result.response.payment_acquirer_number);
                           get_payment = true;
        //                   get_payment_acq('Issued',msg.result.response.booker.seq_id, msg.result.response.order_number, 'billing',signature,'hotel');
                           document.getElementById('voucher_div').style.display = '';
                           //document.getElementById('issued-breadcrumb').classList.remove("active");
                           //document.getElementById('issued-breadcrumb').classList.add("current");
                           document.getElementById('issued-breadcrumb').classList.add("br-active");
                           document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-active");

                           document.getElementById('alert-state').innerHTML = `
                           <div class="alert alert-success" role="alert">
                               <h5>Your booking has been successfully Booked. Please proceed to payment or review your booking again.</h5>
                           </div>`;
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

                    if(msg.result.response.state == 'pending' || msg.result.response.state == 'in_progress' || msg.result.response.state == 'partial_issued' || msg.result.response.state == 'fail_issued'){
                        document.getElementById('div_sync_status').hidden = false;
                    }
                    csc = 0;
                    for(i in msg.result.response.hotel_rooms){
                        try{
                            //HARGA PER ROOM MAU DI BIKIN PER PAX
                            // Update Vin Harga Pax yg diterima di FE adalah Total per pax tidak  perlu dikali total per night lagi
                            // Todo: Pertimbangkan better mechanism
                            total_price = 0
                            for(j in msg.result.response.passengers){
                                if(msg.result.response.passengers[j].hasOwnProperty('channel_service_charges')){
                                    csc += msg.result.response.passengers[j].channel_service_charges.amount;
                                }
                            }
                            break; // upsell hanya 1x
                        }catch(err){}
                    }
                    hotel_get_detail = msg;
                    $text = '';
                    $text += 'Order Number: '+ msg.result.response.order_number + '\n';
                    $text += msg.result.response.state + '\n';
                    text = `
                    <div class="row">
                        <div class="col-lg-12 mb-3" style="border-bottom:1px solid #cdcdcd;">
                            <h4 class="mb-3"><i class="fas fa-scroll"></i> Order Number: `+msg.result.response.order_number+`</h4>
                        </div>
                    </div>`;
                    if(msg.result.response.hotel_name != false){
                        text+=`
                        <h4>`+msg.result.response.hotel_name+`</h4>`;
                    }
                    if(msg.result.response.hotel_address != false){
                        text+=`<b>Address: </b><i>`+msg.result.response.hotel_address+`</i><br/>`;
                    }

                    if(msg.result.response.hotel_phone != false){
                        text+=`<b>Phone: </b><i>`+msg.result.response.hotel_phone+`</i><br/>`;
                    }

                    text+=`<b>Check In: </b><i>`+msg.result.response.checkin_date+`</i><br/>`;
                    text+=`<b>Check Out: </b><i>`+msg.result.response.checkout_date+`</i><hr/>`;

                    text+=`
                    <table style="width:100%;">
                        <tr>
                            <th style="font-size:14px;"><b>Booking Code</b></th>
                            <th style="font-size:14px;"><b>Status</b></th>
                        </tr>`;
                        for(i in msg.result.response.hotel_rooms){
                            if(list_pnr.includes(msg.result.response.hotel_rooms[i].prov_issued_code) == false){
                                text+=`
                                    <tr>`;
                                if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false || msg.result.response.state == 'issued')
                                    text+=`
                                        <td>`+msg.result.response.hotel_rooms[i].prov_issued_code+`</td>`;
                                else
                                    text+= `<td> - </td>`;
                                text+=`<td>`;

                                if(msg.result.response.state.charAt(0).toUpperCase()+msg.result.response.state.slice(1).toLowerCase() == 'Expired' ||
                                    msg.result.response.state.charAt(0).toUpperCase()+msg.result.response.state.slice(1).toLowerCase() == 'Cancel2' ||
                                    msg.result.response.state.charAt(0).toUpperCase()+msg.result.response.state.slice(1).toLowerCase() == 'Fail_issued'){
                                    text+=`<span style="background:#DC143C; color:white; padding:0px 15px; border-radius:14px;">`;
                                }
                                else if(msg.result.response.state.charAt(0).toUpperCase()+msg.result.response.state.slice(1).toLowerCase() == 'Booked'){
                                    text+=`<span style="background:#3fa1e8; color:white; padding:0px 15px; border-radius:14px;">`;
                                }
                                else if(msg.result.response.state.charAt(0).toUpperCase()+msg.result.response.state.slice(1).toLowerCase() == 'Issued'){
                                    text+=`<span style="background:#30b330; color:white; padding:0px 15px; border-radius:14px;">`;
                                }
                                else{
                                    text+=`<span>`;
                                }

                                text+=``+msg.result.response.state.charAt(0).toUpperCase()+msg.result.response.state.slice(1).toLowerCase()+`
                                        </span>
                                    </td>
                                </tr>`;
                                list_pnr.push(msg.result.response.hotel_rooms[i].prov_issued_code);
                            }
                        }
                    text+=`
                    </table>
                    <hr/>`;

                    if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false){
                        text+=`
                        <div class="row mb-3">
                            <div class="col-lg-6">
                                <b>Agent: </b><i>`+msg.result.response.agent_name+`</i>
                            </div>`;
                        if(msg.result.response.customer_parent_name){
                            text+=`
                            <div class="col-lg-6">
                                <b>Customer: </b><i>`+msg.result.response.customer_parent_type_name+` `+msg.result.response.customer_parent_name+`</i>
                            </div>`;
                        }
                        text+= `</div>`;
                    }
                    text+=`
                    <div class="row">
                        <div class="col-lg-3 mb-3">
                            <span>
                                <b>Booked by</b><br><i>`+msg.result.response.booked_by+`</i>
                            </span>
                        </div>
                        <div class="col-lg-5 mb-3">
                            <span>
                                <b>Booked Date: </b><br>
                                <i>`;
                                if(msg.result.response.booked_date != ""){
                                    text+=``+msg.result.response.booked_date+``;
                                }else{
                                    text+=`-`;
                                }
                                text+=`
                                </i>
                            </span>
                        </div>
                    </div>`;
                    if(msg.result.response.state == 'issued'){
                        text+=`
                        <div class="row">
                            <div class="col-lg-3 mb-3">
                                <span>
                                    <b>Issued by</b><br><i>`+msg.result.response.issued_by+`</i>
                                </span>
                            </div>
                            <div class="col-lg-5 mb-3">
                                <span>
                                    <b>Issued Date: </b><br>
                                    <i>`;
                                    if(msg.result.response.issued_date != ""){
                                        text+=``+msg.result.response.issued_date+``;
                                    }else{
                                        text+=`-`;
                                    }
                                    text+=`
                                    </i>
                                </span>
                            </div>
                        </div>`;
                    }

                   document.getElementById('hotel_booking').innerHTML = text;
                   if(can_issued){
                       if(msg.result.response.state != 'issued'){
                           if(user_login.co_job_position_is_request_required == true && msg.result.response.issued_request_status != "approved")
                           {
                                document.getElementById('hotel_issued_btn').setAttribute("onClick", "hotel_request_issued('"+msg.result.response.order_number+"');");
                                if(msg.result.response.issued_request_status == "on_process")
                                {
                                    document.getElementById('hotel_issued_btn').innerHTML = "Issued Booking Requested";
                                    document.getElementById('hotel_issued_btn').disabled = true;
                                }
                                else
                                {
                                    document.getElementById('hotel_issued_btn').innerHTML = "Request Issued Booking";
                                }
                           }
                           check_payment_payment_method(msg.result.response.order_number, 'Issued', msg.result.response.booker.seq_id,  'billing', 'hotel', signature, msg.result.response.payment_acquirer_number);
                           $(".issued_booking_btn").show();
                       }
                   }
                   text = `
                   <div class="row">
                       <div class="col-lg-12 mb-3" style="border-bottom:1px solid #cdcdcd;">
                          <h4 class="mb-3"><img src="/static/tt_website/images/icon/product/b-hotel.png" alt="hotel" style="width:20px; height:20px;"> List of Room</h4>
                       </div>
                   </div>`;

                   for(i in msg.result.response.hotel_rooms){
                        var num_rooms = parseInt(i)+1;
                        if(num_rooms == 1){
                            text+=`<div class="mb-3">
                            <div class="row">`;
                        }else{
                            text+=`<div style="border-top:1px solid #cdcdcd;">
                            <div class="row mt-3">`;
                        }

                        text+=`
                                <div class="col-lg-2">
                                    <h5 class="single_border_custom_left" style="padding-left:5px;">#`+ num_rooms +`</h5>
                                </div>
                                <div class="col-lg-10">
                                    <h5>
                                        `+msg.result.response.hotel_rooms[i].room_name;
                                        if(msg.result.response.hotel_rooms[i].room_type != '')
                                           text+=`<br/>`+msg.result.response.hotel_rooms[i].room_type;
                                    text+=`
                                    </h5>
                                    <span><b>Room: </b>1</span><br/>
                                    <span><b>Max Person: </b><i>`+msg.result.response.hotel_rooms[i].person+` Adult</i></span><br/>
                                </div>
                                <div class="col-lg-12 mt-2">`;
                                    text+=`
                                    <span><b>Date: </b></span><br/>`;
                                    total_room_night = 0;
                                    for(j in msg.result.response.hotel_rooms[i].dates){
                                        total_room_night += msg.result.response.hotel_rooms[i].dates.length;
                                    }
                                    for(j in msg.result.response.hotel_rooms[i].dates){
                                        if(j > 0){
                                            text+=`<div class="mb-2"></div>`;
                                        }
                                        text+=`
                                        <i>`+msg.result.response.hotel_rooms[i].dates[j].date+`</i><br/>
                                        Meal type:
                                        <i>`+msg.result.response.hotel_rooms[i].dates[j].meal_type+`</i><br/>`;
                                        total_price_print = msg.result.response.hotel_rooms[i].dates[j].sale_price;
                                        if(csc)
                                            total_price_print += Math.ceil(csc/total_room_night);
                                        text+=`Rate: <i>`+msg.result.response.hotel_rooms[i].currency+` `+getrupiah(total_price_print)+`</i>`;
                                    }
                                text+=`
                                    </div>
                                </div>
                             </div>
                        </div>`;
                    }


                    document.getElementById('hotel_list_room').innerHTML = text;

                    text = '';
                    text +=`
                    <div class="row">
                       <div class="col-lg-12 mb-3" style="border-bottom:1px solid #cdcdcd;">
                            <h4 class="mb-3"><i class="fas fa-users"></i> List of Guest</h4>
                        </div>
                    </div>`;

                    for(i in msg.result.response.passengers){
                        var new_int = parseInt(i)+1;
                        if(new_int == 1){
                            text+=`<div style="padding: 10px 0px;">`;
                        }else{
                            text+=`<div style="border-top:1px solid #cdcdcd; padding: 10px 0px;">`;
                        }

                        text+=`
                             <div class="row">
                                <div class="col-lg-2">
                                    <h5 class="single_border_custom_left" style="padding-left:5px;">#`+ new_int +`</h5>
                                </div>
                                <div class="col-lg-9">
                                    <h5>`+msg.result.response.passengers[i].title+`. `+msg.result.response.passengers[i].first_name+` `+msg.result.response.passengers[i].last_name+`
                                    <b style="background:white; font-size:13px; color:black; padding:0px 15px; display:unset; border: 1px solid #cdcdcd; border-radius:7px;">`;
                                        if(msg.result.response.passengers[i].title == 'MR' || msg.result.response.passengers[i].title == 'MRS' || msg.result.response.passengers[i].title == 'MS' ){
                                            text+=`Adult`;
                                        }else{
                                            text+=`Child`;
                                        }
                                    text+=`
                                    </b>
                                    </h5>`;
                                    if(msg.result.response.passengers[i].birth_date)
                                        text+=`
                                    <span><b>Birth Date: </b><i>`+msg.result.response.passengers[i].birth_date+`</i></span>`;
                                    text+=`
                                </div>
                             </div>
                        </div>`;
                    }

                    document.getElementById('hotel_passenger').innerHTML = text;
                    if(msg.result.response.state == 'issued'){
                        document.getElementById('issued-breadcrumb').classList.add("br-active");
                        document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-active");
                        document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-check"></i>`;
                        text = `
                        <div style="border:1px solid #cdcdcd; padding:10px; background-color:white; margin-top:20px;" id="hotel_hide_logo_opt_cont">
                            <div class="row">`;
                        if (msg.result.response.state == 'issued'){
                            text+=`
                                <div class="col-lg-6">
                                    <label class="check_box_custom">
                                        <span class="span-search-ticket" style="color:black;">Hide agent logo on tickets</span>
                                        <input type="checkbox" id="is_hide_agent_logo" name="is_hide_agent_logo"/>
                                        <span class="check_box_span_custom"></span>
                                    </label>
                                </div>`;
                        }
                        text+=`
                                <div class="col-lg-6">
                                    <label class="check_box_custom">
                                        <span class="span-search-ticket" style="color:black;">force get new tickets</span>
                                        <input type="checkbox" id="is_force_get_new_printout" name="is_force_get_new_printout"/>
                                        <span class="check_box_span_custom"></span>
                                    </label>
                                </div>`;
                        text += `
                            </div>
                        </div>`;

                        document.getElementById('hotel_hide_agent_logo_opt').innerHTML = text;
                        text=`<div class="col-sm-6">
                                    <button type="button" id="button-choose-print" style="width:100%;" class="primary-btn ld-ext-right" onclick="get_printout('`+msg.result.response.order_number+`', 'ticket','hotel');">
                                        <i class="fas fa-print"></i> Print Voucher
                                        <div class="ld ld-ring ld-cycle"></div>
                                    </button>
                               </div>`;
                        text+=`
                            <div class="col-sm-6">
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

                                                <div class="row">
                                                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 mb-2">
                                                            <span class="control-label" for="Name">Included Rooms</span>
                                                            <table class="table list-of-reservation" style="border: 1px solid; width:100%;">`;
                                                            for (resv_pax in hotel_get_detail.result.response.hotel_rooms)
                                                            {
                                                                text += `
                                                                <tr>
                                                                    <td>
                                                                        <span id="resv_pax_value`+resv_pax+`">`+hotel_get_detail.result.response.hotel_rooms[resv_pax].room_name+` (`+hotel_get_detail.result.response.hotel_rooms[resv_pax].meal_type+`) </span>
                                                                    </td>
                                                                    <td>
                                                                        <label class="check_box_custom cblabel">
                                                                            <input type="checkbox" id="resv_pax_checkbox`+resv_pax+`" name="resv_pax_checkbox`+i+`" checked />
                                                                            <span class="check_box_span_custom cbspan" style="background:#cdcdcd;"></span>
                                                                        </label>
                                                                    </td>
                                                                </tr>`;
                                                            }
                                               text += `</table></div>
                                                    </div>

                                                <br/>
                                                <div style="text-align:right;">
                                                    <span>Don't want to edit? just submit</span>
                                                    <br/>
                                                    <button type="button" id="button-issued-print" class="primary-btn ld-ext-right" onclick="get_printout('`+msg.result.response.order_number+`', 'invoice','hotel');">
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
                            </div>`;
                        document.getElementById('hotel_btn_printout').innerHTML = text;
                    }

                   //detail
                    text = '';
                    tax = 0;
                    fare = 0;
                    total_price = 0;
                    total_price_provider = [];
                    price_provider = 0;
                    commission = 0;
                    disc = 0;
                    currency = '';
                    service_charge = ['FARE', 'RAC', 'ROC', 'TAX', 'SSR', 'DISC'];
                    text_detail=`
                    <div style="background-color:white; padding:15px; border: 1px solid #cdcdcd; margin-bottom:15px;">
                        <div class="row" style="margin-bottom:5px;">
                            <div class="col-lg-12 mb-3" style="border-bottom:1px solid #cdcdcd;">
                               <h4 class="mb-3">Price Detail</h4>
                            </div>
                        </div>`;

                    if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false || msg.result.response.state == 'issued')
                        text_detail+=`
                            <div style="text-align:left">
                                <span style="font-weight:700; font-size:14px;">Booking Code / PNR:<span><br/>
                                <span style="font-weight:400; font-size:14px;">`+msg.result.response.hotel_rooms[0].prov_issued_code+` </span>
                            </div>`;

                    var idx = 0;
                    var pnr_dict = []; //description
                    var room_dict = []; //description
                    show_name_room = '';
                    title_name_room = '';
                    document.getElementById("div_name_room").innerHTML = '';

                    for(i in msg.result.response.hotel_rooms){
                        room_dict.push(msg.result.response.hotel_rooms[i].room_name);
                        document.getElementById("div_name_room").innerHTML += `<input type="hidden" id="name_room_htl`+i+`" name="name_room_htl`+i+`"/>`;
                    }

                    room_dict.sort();

                    var current_room = null;
                    var cnt_room = 0;

                    for (var ro = 0; ro < room_dict.length; ro++) {
                        if (room_dict[ro] != current_room) {
                            if (cnt_room > 0) {
                                show_name_room += `<span style="color:`+color+`;">`+cnt_room+`x </span>`+ current_room+` + `;
                                title_name_room += cnt_room+'x '+ current_room+' + ';
                            }
                            current_room = room_dict[ro];
                            cnt_room = 1;
                        } else {
                            cnt_room++;
                        }
                    }
                    if (cnt_room > 0) {
                        show_name_room += `<span style="color:`+color+`;">`+cnt_room+`x </span>`+ current_room;
                        title_name_room += cnt_room+'x '+ current_room;
                    }

                    text_detail+=`<h5>`+show_name_room+`</h5>`;

                    //repricing
                    type_amount_repricing = ['Repricing'];
                    //repricing
                    counter_service_charge = 0;

                    $text += '\nContact Person:\n';
                    $text += msg.result.response.contact.title + ' ' + msg.result.response.contact.name + '\n';
                    $text += msg.result.response.contact.email + '\n';
                    $text += msg.result.response.contact.phone+ '\n';

                    $text += '\nPrice:\n';

                    text_detail += `<div class="mt-3">
                        <center><h6 style="color:`+color+`; display:block; cursor:pointer;" id="price_detail_hotel_down" onclick="show_hide_div('price_detail_hotel');">See Detail <i class="fas fa-chevron-down" style="font-size:14px;"></i></h6></center>
                    </div>`;
                    text_detail += `<div id="price_detail_hotel_div" style="display:none;">`;
                    csc = 0;
                    for(i in msg.result.response.hotel_rooms){
                        try{
                            //HARGA PER ROOM MAU DI BIKIN PER PAX
                            // Update Vin Harga Pax yg diterima di FE adalah Total per pax tidak  perlu dikali total per night lagi
                            // Todo: Pertimbangkan better mechanism
                            total_price = 0;
                            for(j in msg.result.response.passengers){
                                price = {'FARE': 0, 'RAC': 0, 'ROC': 0, 'TAX':0 , 'currency': '', 'CSC': 0, 'SSR': 0, 'DISC': 0};

                                for(k in msg.result.response.passengers[j].sale_service_charges[msg.result.response.hotel_rooms[i].prov_issued_code]){
                                    price[k] += msg.result.response.passengers[j].sale_service_charges[msg.result.response.hotel_rooms[i].prov_issued_code][k].amount;
                                    if(price['currency'] == ''){
                                        price['currency'] = msg.result.response.passengers[j].sale_service_charges[msg.result.response.hotel_rooms[i].prov_issued_code][k].currency;
                                        currency = msg.result.response.passengers[j].sale_service_charges[msg.result.response.hotel_rooms[i].prov_issued_code][k].currency;
                                    }
                                }
                                disc -= price['DISC'];
                                try{
                                    csc += msg.result.response.passengers[j].channel_service_charges.amount;
//                                    price['CSC'] = msg.result.response.passengers[j].channel_service_charges.amount;
                                }catch(err){
                                    console.log(err); // error kalau ada element yg tidak ada
                                }
                                if(price['FARE'] != 0){
                                    total_price_provider.push({
                                        'provider': msg.result.response.hotel_rooms[i].provider,
                                        'price': price
                                    })
                                    total_price += parseInt(price.TAX + price.ROC + price.FARE + price.CSC + price.DISC);
                                }
                                commission += parseInt(price.RAC);
                                break; //harga hanya di pax 1 agar price tidak ter reset
                            }
                            for(j in msg.result.response.passengers){
                                if(price_arr_repricing.hasOwnProperty('Reservation') == false){
                                    price_arr_repricing['Reservation'] = {}
                                }
                                pax_type_repricing.push(['Reservation', 'Reservation']);
                                price_arr_repricing['Reservation']['Reservation'] = {
                                    'Fare': (price['FARE']) + price['SSR'] + price['DISC'],
                                    'Tax': price['TAX'] + price['ROC'] - csc,
                                    'Repricing': csc
                                }
                                break; // upsell per reservasi
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
                                for(l in price_arr_repricing[k]){
                                    text_repricing += `
                                    <div class="col-lg-12">
                                        <div style="padding:5px;" class="row" id="adult">
                                            <div class="col-lg-3" id="`+l+`_`+k+`">`+l+`</div>
                                            <div class="col-lg-3" id="`+l+`_price">`+getrupiah(price_arr_repricing[k][l].Fare + price_arr_repricing[k][l].Tax)+`</div>`;
                                            if(price_arr_repricing[k][l].Repricing == 0)
                                                text_repricing+=`<div class="col-lg-3" id="`+l+`_repricing">-</div>`;
                                            else
                                                text_repricing+=`<div class="col-lg-3" id="`+l+`_repricing">`+getrupiah(price_arr_repricing[k][l].Repricing)+`</div>`;
                                            text_repricing+=`<div class="col-lg-3" id="`+l+`_total">`+getrupiah(price_arr_repricing[k][l].Fare + price_arr_repricing[k][l].Tax + price_arr_repricing[k][l].Repricing)+`</div>
                                        </div>
                                    </div>`;
                                }
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
                            break;
                        }catch(err){console.log(err);}
                    }
                    //DETAIL PER ROOM
                    for(i in msg.result.response.hotel_rooms){
                        try{
                            var idx_room = parseInt(i)+1;
                            text_detail+=`
                            <div class="row" style="margin-bottom:5px;">
                                <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                    <h6><span style="color:`+color+`;">Room #`+idx_room+` </span>`+msg.result.response.hotel_rooms[i].room_name+`</h6>
                                    <span style="font-size:12px;">`+msg.result.response.hotel_rooms[i].room_type+`</span><br/>`;
                                    for(j in msg.result.response.hotel_rooms[i].dates){
                                        text_detail+=`<span style="font-size:12px;">`+msg.result.response.hotel_rooms[i].dates[j].date+`</span><br/>`;
                                    }
                                text_detail+=`</div>
                                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                    <br/>`;
                                    for(j in msg.result.response.hotel_rooms[i].dates){
                                        text_detail+=`<br/>`;
                                    }
                                    try{
                                    var total_per_room = parseInt(0);
                                    total_room = msg.result.response.hotel_rooms.length;

                                    for(j in msg.result.response.hotel_rooms[i].dates){
                                        total_per_room = total_per_room + parseInt(msg.result.response.hotel_rooms[i].dates[j].sale_price);
                                    }
                                    if(csc)
                                        total_per_room += Math.ceil(csc/total_room);
                                        text_detail+=`
                                    <span style="font-size:13px; font-weight:700;">`+msg.result.response.hotel_rooms[i].dates[j].currency+` `+ getrupiah(total_per_room) +`</span>`;
                                    }catch(err){
                                        console.log(err); // error kalau ada element yg tidak ada
                                    }
                                    text_detail+=`
                                </div>
                            </div>`;
                            text_detail += `<div class="row"><div class="col-lg-12"><hr/></div></div>`;
                            try{
                                for(j in msg.result.response.hotel_rooms[i].dates){
                                    $text += msg.result.response.hotel_rooms[i].dates[j].date + ' ';
                                }
                                if(i == msg.result.response.hotel_rooms.length - 1)
                                    $text += currency+` `+getrupiah(parseInt(total_price_provider[i].price.FARE + total_price_provider[i].price.TAX + total_price_provider[i].price.ROC))+'\n';
                                else
                                    $text += currency+` `+getrupiah(parseInt(total_price_provider[i].price.FARE + total_price_provider[i].price.TAX + total_price_provider[i].price.ROC))+'\n';
                            }catch(err){
                                console.log(err); // error kalau ada element yg tidak ada
                            }
                        }catch(err){console.log(err);}
                    }
                    text_detail += `</div>`;
                    text_detail += `<div>
                        <center><h6 style="color:`+color+`; display:none; cursor:pointer;" id="price_detail_hotel_up" onclick="show_hide_div('price_detail_hotel');">Close Detail <i class="fas fa-chevron-up" style="font-size:14px;"></i></h6></center>
                    </div>`;

                    try{
                        //di gabung
//                        if(csc != 0){
//                            text_detail+=`
//                                <div class="row" style="margin-bottom:5px;">
//                                    <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
//                                        <span style="font-size:12px;">Other service charges</span>`;
//                                    text_detail+=`</div>
//                                    <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
//                                        <span style="font-size:13px;">`+currency+` `+getrupiah(parseInt(csc))+`</span>
//                                    </div>
//                                </div>`;
//                            $text += 'Other service charges: '+currency+' '+ getrupiah(csc)+'\n';
//                        }
                        if(disc != 0){
                            text_detail+=`
                                <div class="row" style="margin-bottom:5px;">
                                    <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                        <span style="font-size:12px;">Discount</span>`;
                                    text_detail+=`</div>
                                    <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                        <span style="font-size:13px;">`+currency+` -`+getrupiah(parseInt(disc))+`</span>
                                    </div>
                                </div>`;
                            $text += 'Discount: '+currency+' '+ getrupiah(disc)+'\n';
                        }
                        $text += 'Grand Total: '+currency+' '+ getrupiah(total_price);
                        text_detail+=`
                        <div>
                            <hr/>
                        </div>
                        <div class="row" style="margin-bottom:10px;">
                            <div class="col-lg-6 col-xs-6" style="text-align:left;">
                                <span style="font-size:13px; font-weight: bold;">Grand Total</span>
                            </div>
                            <div class="col-lg-6 col-xs-6" style="text-align:right;">
                                <span id="total_price" style="font-size:13px; font-weight: bold;`;
                        if(is_show_breakdown_price){
                            text_detail+=`cursor:pointer;`;
                        }
                        text_detail+=`">`;
                                try{
                                    text_detail+= currency+` `+getrupiah(total_price);
                                }catch(err){

                                }
                                text_detail+= `</span>`;
                        if(is_show_breakdown_price){
                             text_detail+=`<i class="fas fa-caret-down"></i>`;
                        }
                        text_detail+=`
                            </div>
                        </div>`;
                        if(['booked', 'partial_booked', 'partial_issued', 'halt_booked'].includes(msg.result.response.state)){
                            if(typeof(currency_rate_data) !== 'undefined' && currency_rate_data.result.is_show && total_price){
                                if(user_login.hasOwnProperty('co_ho_seq_id') && currency_rate_data.result.response.agent.hasOwnProperty(user_login.co_ho_seq_id)){ // buat o3
                                    for(k in currency_rate_data.result.response.agent[user_login.co_ho_seq_id]){
                                        try{
                                            if(currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].base_currency == currency){
                                                price_convert = parseFloat((total_price)/currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].rate).toFixed(2);
                                                if(price_convert%1 == 0)
                                                    price_convert = parseInt(price_convert);
                                                text_detail+=`
                                                <div class="row">
                                                    <div class="col-lg-12" style="text-align:right;">
                                                        <span style="font-size:13px; font-weight:bold;"> Estimated `+k+` `+price_convert+`</span>
                                                    </div>
                                                </div>`;
                                            }
                                        }catch(err){
                                            console.log(err);
                                        }
                                    }
                                }
                            }
                        }else if(msg.result.response.hasOwnProperty('estimated_currency') && msg.result.response.estimated_currency.hasOwnProperty('other_currency') && Object.keys(msg.result.response.estimated_currency.other_currency).length > 0){
                            for(k in msg.result.response.estimated_currency.other_currency){
                                text_detail+=`
                                            <div class="col-lg-12" style="text-align:right;">
                                                <span style="font-size:13px; font-weight:bold;" id="total_price_`+msg.result.response.estimated_currency.other_currency[k].currency+`"> Estimated `+msg.result.response.estimated_currency.other_currency[k].currency+` `+getrupiah(msg.result.response.estimated_currency.other_currency[k].amount)+`</span><br/>
                                            </div>`;
                            }
                        }
                        if(msg.result.response.state != 'issued' && user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
                            text_detail+=`<div style="text-align:right; padding-bottom:10px;"><img src="/static/tt_website/images/icon/symbol/upsell_price.png" alt="bank" style="width:auto; height:25px; cursor:pointer;" onclick="show_repricing();"/></div>`;
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
                                    <a href="mailto:?subject=This is the hotel price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/email.png" alt="Email"/></a>`;
                            } else {
                                text_detail+=`
                                    <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/whatsapp.png" alt="Whatsapp"/></a>
                                    <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/line.png" alt="Line"/></a>
                                    <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/telegram.png" alt="Telegram"/></a>
                                    <a href="mailto:?subject=This is the hotel price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/email.png" alt="Email"/></a>`;
                            }

                        text_detail+=`
                            </div>
                        </div>`;
                        if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false){
                            text_detail+=`
                            <div class="row" id="show_commission_hotel" style="display:block;">
                                <div class="col-lg-12 col-xs-12" style="text-align:center;">
                                    <div class="alert alert-success">
                                        <div class="row">
                                            <div class="col-lg-6 col-xs-6" style="text-align:left;">
                                                <span style="font-size:13px; font-weight:bold;">YPM</span>
                                            </div>
                                            <div class="col-lg-6 col-xs-6" style="text-align:right;">
                                                <span style="font-size:13px; font-weight:bold;">`+currency+` `+getrupiah(parseInt(commission)*-1)+`</span>
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
                                                <span style="font-size:13px; font-weight:bold;">`+currency+` `+getrupiah(total_nta)+`</span>
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
                                                <span style="font-size:13px; font-weight:bold;">`+currency+` `+getrupiah(total_nta)+`</span>
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
                                        if(commission == 0){
                                            text_detail+=`
                                            <div class="row">
                                                <div class="col-lg-12 col-xs-12" style="text-align:left;">
                                                    <span style="font-size:13px; color:red;">* Please mark up the price first</span>
                                                </div>
                                            </div>`;
                                        }
                                    text_detail+=`</div>
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
                                <input class="primary-btn-white" id="show_commission_button" style="width:100%;" type="button" onclick="show_commission_hotel('commission');" value="Hide YPM"/>
                            </div>`;
                        text_detail+=`
                    </div>`;
                }catch(err){console.log(err)}
                document.getElementById('hotel_detail').innerHTML = text_detail;
                if(is_show_breakdown_price){
                    var price_breakdown = {};
                    var currency_breakdown = '';
                    for(i in hotel_get_detail.result.response.passengers){
                        for(j in hotel_get_detail.result.response.passengers[i].sale_service_charges){
                            for(k in hotel_get_detail.result.response.passengers[i].sale_service_charges[j]){
                                if(k != 'RAC'){
                                    if(!price_breakdown.hasOwnProperty(k.toUpperCase()))
                                        price_breakdown[k.toUpperCase()] = 0;
                                    price_breakdown[k.toUpperCase()] += hotel_get_detail.result.response.passengers[i].sale_service_charges[j][k].amount;
                                    if(currency_breakdown == '')
                                        currency_breakdown = hotel_get_detail.result.response.passengers[i].sale_service_charges[j][k].currency;
                                }
                            }
                        }
                    }
                    var breakdown_text = '';
                    for(j in price_breakdown){
                        if(breakdown_text)
                            breakdown_text += '<br/>';
                        if(j != 'ROC')
                            breakdown_text += '<b>'+j+'</b> ';
                        else
                            breakdown_text += '<b>CONVENIENCE FEE</b> ';
                        breakdown_text += currency_breakdown + ' ' + getrupiah(price_breakdown[j]);
                    }
                    new jBox('Tooltip', {
                        attach: '#total_price',
                        target: '#total_price',
                        theme: 'TooltipBorder',
                        trigger: 'click',
                        adjustTracker: true,
                        closeOnClick: 'body',
                        closeButton: 'box',
                        animation: 'move',
                        position: {
                          x: 'left',
                          y: 'top'
                        },
                        outside: 'y',
                        pointer: 'left:20',
                        offset: {
                          x: 25
                        },
                        content: breakdown_text
                    });
                }
                text_cancellation_policy = `
                    <div style="background-color:white; padding:15px; border: 1px solid #cdcdcd; margin-bottom:15px;">
                        <div class="row">
                            <div class="col-lg-12 mb-3" style="border-bottom:1px solid #cdcdcd;">
                                <h4 class="mb-3"><i class="fas fa-ban"></i> Cancellation Policy</h4>
                            </div>
                        </div>
                        <ul style="list-style-type: disc; margin: 0 15px;">`;

                //cancellation policy
                if(msg.result.response.hasOwnProperty('cancellation_policy_str'))
                    cancellation_policy_list = msg.result.response.cancellation_policy_str.split(';;');
                else
                    cancellation_policy_list = [];
                for(i in cancellation_policy_list)
                    text_cancellation_policy += '<li style="list-style: unset;">' + cancellation_policy_list[i] + '</li>';
                if(cancellation_policy_list.length == 0)
                    text_cancellation_policy += '<li style="list-style: unset;">No Cancellation</li>';
                text_cancellation_policy += '</ul></div>';
                document.getElementById('hotel_cancellation_policy_div').innerHTML = text_cancellation_policy;
                //cancellation policy

                //refund
                if(msg.result.response.checkin_date){
                    checkin_date = moment(msg.result.response.checkin_date);
                    now = moment();
                    if(checkin_date > now && msg.result.response.state == 'issued'){
                        document.getElementById('hotel_refund_div').innerHTML = `
                        <button type="button" id="button-choose-print" style="width:100%;" class="primary-btn ld-ext-right" onclick="hotel_check_refund_amount();">
                            Refund
                            <div class="ld ld-ring ld-cycle"></div>
                        </button>`;
                    }else{
                        document.getElementById('hotel_refund_div').innerHTML = ``;
                    }
                }
                //refund

                document.getElementById('show_title_hotel').hidden = false;
                document.getElementById('show_loading_booking_airline').hidden = true;
                add_repricing();
                if(msg.result.response.hasOwnProperty('voucher_reference') && msg.result.response.voucher_reference != '' && msg.result.response.voucher_reference != false){
                    try{
                        render_voucher(price.currency,msg.result.response.voucher_discount, msg.result.response.state)
                    }catch(err){console.log(err);}
                }
                try{
                    if(msg.result.response.state == 'booked' || msg.result.response.state == 'issued' && msg.result.response.voucher_reference)
                        document.getElementById('voucher_discount').style.display = 'block';
                    else
                        document.getElementById('voucher_discount').style.display = 'none';
                }catch(err){console.log(err);}

    //               document.getElementById('hotel_detail').innerHTML = text;
                }else if(msg.result.error_code == 1035){
                    $('#myModalSignin').modal('show');
                    Swal.fire({
                        type: 'error',
                        title: 'Oops!',
                        html: msg.result.error_msg,
                    })
                }else{
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: #ff9900;">Error hotel booking </span> Please try again in 1 - 5 minutes later or contact customer service' ,
                    }).then((result) => {
                      window.location.href = '/reservation';
                    })
                }
            }catch(err){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error hotel booking </span> Please try again in 1 - 5 minutes later or contact customer service' ,
                }).then((result) => {
                  window.location.href = '/reservation';
                })
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error hotel get booking');
       },timeout: 180000
    });
}

function checkboxCopyRoom(){
    var count_copy = $(".copy_result:checked").length;
    if(count_copy == 0){
        $('#button_copy_hotel').hide();
    }
    else{
        $('#button_copy_hotel').show();
    }
    document.getElementById("badge-copy-notif").innerHTML = count_copy;
    document.getElementById("badge-copy-notif2").innerHTML = count_copy;
}

function check_all_result_room(){
   var selectAllCheckbox=document.getElementById("check_all_copy");
   if(selectAllCheckbox.checked==true){
        var checkboxes = document.getElementsByClassName("copy_result");
        for(var i=0, n=checkboxes.length;i<n;i++) {
        checkboxes[i].checked = true;
        $('#choose-hotel-copy').hide();
    }
   }else {
    var checkboxes = document.getElementsByClassName("copy_result");
    for(var i=0, n=checkboxes.length;i<n;i++) {
        checkboxes[i].checked = false;
        $('#choose-hotel-copy').show();
    }
   }
   checkboxCopyRoom();
}

function get_checked_copy_result_room(){
    document.getElementById("show-list-copy-hotel").innerHTML = '';
    text='';
    $text='';
    var room_number = 0;
    var name_hotel = $(".name_hotel").html();
    var rating_hotel = $(".rating_hotel").html();
    var address_hotel = $('.address_hotel').html();
    var datecico = $('#hotel_checkin_checkout').val();
    $text += ''+name_hotel+ ' *' +rating_hotel+ '\n';
    if(address_hotel != '')
        $text += 'Address: '+address_hotel+'\n';
    $text += 'Date: '+datecico+'\n▬▬▬▬▬\n';

    node = document.createElement("div");
    text+=`
    <div class="col-lg-12" style="background:white; padding:15px; margin-bottom:15px; border-top:1px solid #cdcdcd; border-bottom:1px solid #cdcdcd;"  id="information_hotel">
        <h6>`+name_hotel+` `+rating_hotel+ `</h6>`;
        if(address_hotel != '')
            text+=`
        <span>Address: `+address_hotel+`</span><br/>`;
        text+=`
        <span>Date: `+datecico+`</span><br/><br/>
    </div>
    <div class="col-lg-12">`;
    $(".copy_result:checked").each(function(obj) {
        var parent_room = $(this).parent().parent().parent().parent();
        var name_room = parent_room.find('.name_room').text();
        var desc_room = parent_room.find('.desc_room').text();
        var qty_room = parent_room.find('.qty_room').text();
        var meal_room = parent_room.find('.meal_room').text();
        var _room = parent_room.find('.meal_room').text();
        var meal_room = parent_room.find('.meal_room').text();
        var price_room = parent_room.find('.price_room').text();
        var total_room_night = parent_room.find('.copy_total_rn').text();
        var id_room = parent_room.find('.id_copy_result').text();
        var id_room_total = parent_room.find('.id_copy_room_total').text();

        var id_room_total_int = parseInt(id_room_total);
        //copy size unit
        room_number = room_number + 1;

        $text += '\nOption #'+room_number+'\n'+name_room+ ' ' + desc_room+'\n';
        //$text += qty_room+'\n';
        $text += ''+meal_room+'\n';
        $text += total_room_night+'\n\n';
        $text += 'Detail\n';
        for (let count_room = 0; count_room < id_room_total; count_room++) {
            var name_per_room = parent_room.find('.name_per_room'+id_room+count_room).text();
            var size_room = parent_room.find('.size_room'+id_room+count_room).text();
            var unit_room = parent_room.find('.unit_room'+id_room+count_room).text();
            $text += '> '+name_per_room+'\n';
            $text += size_room+' '+unit_room+'\n';
        }

        text+=`
        <div class="row" id="div_list`+id_room+`" style="padding-top:15px; border-bottom:1px solid #cdcdcd; border-top:1px solid #cdcdcd; margin-bottom:15px; background:white;">`;

        text+=`
            <div class="col-lg-9">
                <h6 class="single_border_custom_left" style="padding-left:5px;"> ROOM OPTION-`+room_number+`</h6>
            </div>
            <div class="col-lg-3" style="text-align:right;">
                <span style="font-weight:500; cursor:pointer;" onclick="delete_checked_copy_result_room(`+id_room+`);">Delete <i class="fas fa-times-circle" style="color:red; font-size:18px;"></i></span>
            </div>
            <div class="col-lg-12">
                <hr/>
            </div>
            <div class="col-lg-12">
                <h6>`+name_room+` </h6>
                <span>`+qty_room+` Room</span><br/>
                <span>`+meal_room+`</span><br/>
            </div>
            <div class="col-lg-12 mb-3" style="text-align:right;">
                <h6>Price: <b style="color:`+color+`;">`+price_room+`<br/>`+total_room_night+`</b></h6>
            </div>

        </div>`;

        $text += '\nPrice: '+price_room+'\n\n';
        $text += '▬▬▬▬▬\n';
    });

    $text += '===Price may change at any time===';
    text+=`</div>`;
    text_footer = `
    <div class="col-lg-12" id="share_result">
        <span style="font-size:14px; font-weight:bold;">Share this on:</span><br/>`;
        share_data_room();
        var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
            text_footer+=`
                <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/whatsapp.png" alt="Whatsapp"/></a>`;
            if(room_number < 11){
                text_footer+=`
                    <a href="line://msg/text/`+ $text_share +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/line.png" alt="Line"/></a>
                    <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/telegram.png" alt="Telegram"/></a>`;
            }
            else{
                text_footer+=`
                <a href="#" target="_blank" title="Share by Line" style="padding-right:5px; cursor:not-allowed;"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/line-gray.png" alt="Line Disable"/></a>
                <a href="#" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/telegram-gray.png" alt="Telegram Disable"/></a>`;
            }
            text_footer+=`
                <a href="mailto:?subject=This is the hotel price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/email.png" alt="Email"/></a>`;
        } else {
            text_footer+=`
                <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/whatsapp.png" alt="Whatsapp"/></a>`;
            if(room_number < 11){
                text_footer+=`
                    <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/line.png" alt="Line"/></a>
                    <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/telegram.png" alt="Telegram"/></a>`;
            }
            else{
                text_footer+=`
                <a href="#" title="Share by Line" style="padding-right:5px; cursor:not-allowed;"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/line-gray.png" alt="Line Disable"/></a>
                <a href="#" title="Share by Telegram" style="padding-right:5px; cursor:not-allowed;"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/telegram-gray.png" alt="Telegram Disable"/></a>`;
            }
            text_footer+=`
                <a href="mailto:?subject=This is the hotel price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/email.png" alt="Email"/></a>`;
        }
        if(room_number > 10){
            text_footer+=`<br/><span style="color:red;">Nb: Share on Line and Telegram Max 10 Room</span>`;
        }
    text_footer+=`
        <div style="float:right;" id="copy_result">
            <button class="primary-btn-white" style="width:150px;" type="button" onclick="copy_data_room();">
                <i class="fas fa-copy"></i> Copy
            </button>
        </div>
    </div>`;

    node.innerHTML = text;
    node.className = "row";
    document.getElementById("show-list-copy-hotel").appendChild(node);

    document.getElementById("footer_list_copy").innerHTML = text_footer;
    if(room_number > 10){
        document.getElementById("mobile_line").style.display = "none";
        document.getElementById("mobile_telegram").style.cursor = "not-allowed";
        document.getElementById("pc_line").style.display = "not-allowe";
        document.getElementById("pc_telegram").style.cursor = "not-allowed";
    }

    var count_copy = $(".copy_result:checked").length;
    if (count_copy == 0){
        $('#choose-hotel-copy').show();
        $("#information_hotel").remove();
        $("#share_result").remove();
        $("#copy_result").remove();
        $text = '';
        $text_share = '';
    }
    else{
        $('#choose-hotel-copy').hide();
    }
}

function delete_checked_copy_result_room(id){
    $("#div_list"+id).remove();
    $("#copy_result"+id).prop("checked", false);

    var count_copy = $(".copy_result:checked").length;
    if (count_copy == 0){
        $('#choose-hotel-copy').show();
        $("#information_hotel").remove();
        $("#share_result").remove();
        $("#copy_result").remove();
        $text = '';
        $text_share = '';
    }
    else{
        $('#choose-hotel-copy').hide();
        get_checked_copy_result_room();
        share_data_room();
    }
    checkboxCopyRoom();
}

function copy_data_room(){
    get_checked_copy_result_room();
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

function share_data_room(){
//    const el = document.createElement('textarea');
//    el.value = $text;
//    document.body.appendChild(el);
//    el.select();
//    document.execCommand('copy');
//    document.body.removeChild(el);
    $text_share = window.encodeURIComponent($text);
}

function update_service_charge(type){
    repricing_order_number = '';
    if(type == 'booking'){
        document.getElementById('hotel_booking').innerHTML = '';
        upsell = []
        currency = '';
        for(i in hotel_get_detail.result.response.hotel_rooms){
            currency = hotel_get_detail.result.response.hotel_rooms[i].currency;
            break;
        }
        list_price = []
        if(document.getElementById('Reservation_repricing').innerHTML != '-'){
            list_price.push({
                'amount': parseInt(document.getElementById('Reservation_repricing').innerHTML.split(',').join('')),
                'currency_code': currency
            });
            upsell.push({
                'sequence': 0,
                'pricing': JSON.parse(JSON.stringify(list_price))
            });
        }
        repricing_order_number = hotel_get_detail.result.response.order_number;
    }else{
        upsell_price = 0;
        upsell = []
        counter_pax = 0;
        currency = hotel_price.currency;
        for(i in adult){
            list_price = []
            if(document.getElementById('Reservation_repricing').innerHTML != '-' && document.getElementById('Reservation_repricing').innerHTML != '0'){
                list_price.push({
                    'amount': parseInt(document.getElementById('Reservation_repricing').innerHTML.split(',').join('')),
                    'currency_code': currency
                });
                upsell_price += parseInt(document.getElementById('Reservation_repricing').innerHTML.split(',').join(''));
                upsell.push({
                    'sequence': counter_pax,
                    'pricing': JSON.parse(JSON.stringify(list_price))
                });
            }
            counter_pax++;
            break; //upsell per reservasi
        }
    }
    $.ajax({
       type: "POST",
       url: "/webservice/hotel",
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
                    please_wait_transaction();
                    price_arr_repricing = {};
                    pax_type_repricing = [];
                    hotel_get_booking(repricing_order_number);
                }else{
                    price_arr_repricing = {};
                    pax_type_repricing = [];
                    hotel_detail();
                }

                $('#myModalRepricing').modal('hide');
           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
           }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error hotel service charge </span>' + msg.result.error_msg,
                })
                $('.loader-rodextrip').fadeOut();
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error hotel service charge');
            $('.loader-rodextrip').fadeOut();
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
       url: "/webservice/hotel",
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
                        hotel_get_booking(repricing_order_number);
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
                  html: '<span style="color: #ff9900;">Error hotel update booker insentif </span>' + msg.result.error_msg,
                })
                $('.loader-rodextrip').fadeOut();
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error hotel update booker insentif');
            $('.loader-rodextrip').fadeOut();
       },timeout: 60000
    });

}

function hotel_check_refund_amount(){
    Swal.fire({
      title: 'Are you sure want to Refund this booking?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
        if (result.value) {
            $.ajax({
                type: "POST",
                url: "/webservice/hotel",
                headers:{
                    'action': 'hotel_check_refund_amount',
                },
                data: {
                   'hotel_get_booking': JSON.stringify(hotel_get_detail),
                   'signature': signature
                },
                success: function(msg) {
                   console.log(msg);
                   if(msg.result.error_code == 0){
                        hotel_cancel();
                   }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                        auto_logout();
                   }else{
                        Swal.fire({
                          type: 'error',
                          title: 'Oops!',
                          html: '<span style="color: #ff9900;">Error hotel refund</span>' + msg.result.error_msg,
                        })
                        $('.loader-rodextrip').fadeOut();
                   }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error hotel refund');
                    $('.loader-rodextrip').fadeOut();
                },timeout: 60000
            });
        }
    })
}

function hotel_cancel(){
    Swal.fire({
      title: 'Are you sure want to Refund this booking?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
        if (result.value) {
            $.ajax({
                type: "POST",
                url: "/webservice/hotel",
                headers:{
                    'action': 'hotel_refund',
                },
                data: {
                   'hotel_get_booking': JSON.stringify(hotel_get_detail),
                   'signature': signature
                },
                success: function(msg) {
                   console.log(msg);
                   if(msg.result.error_code == 0){
                        hotel_get_booking(order_number);
                   }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                        auto_logout();
                   }else{
                        Swal.fire({
                          type: 'error',
                          title: 'Oops!',
                          html: '<span style="color: #ff9900;">Error hotel refund</span>' + msg.result.error_msg,
                        })
                        $('.loader-rodextrip').fadeOut();
                   }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error hotel refund');
                    $('.loader-rodextrip').fadeOut();
                },timeout: 60000
            });
        }
    })
}

function show_less_notes(i,j){
    if($("#notes_div"+i+j).hasClass("show-more-height")) {
        $(".show-more"+i+j).text("Show Less");
        $("#notes_div"+i+j).removeClass("show-more-height");
    } else {
        $(".show-more"+i+j).text("Show More");
        $("#notes_div"+i+j).addClass("show-more-height");
    }
}