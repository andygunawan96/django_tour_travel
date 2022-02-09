var bus_data = [];
var bus_data_filter = '';
var bus_cookie = '';
var bus_sid = '';
last_session = 'sell_journey'
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

//function test_search_bus(){
//    counter = parseInt(document.getElementById('counter').value);
//    for(i=0;i<counter;i++){
//        bus_signin('');
//    }
//}

function bus_redirect_signup(type){
    if(type != 'signin'){
        getToken();
        $.ajax({
           type: "POST",
           url: "/webservice/bus",
           headers:{
                'action': 'signin',
           },
    //       url: "{% url 'tt_backend_rodextrip:social_media_tree_update' %}",
           data: {},
           success: function(msg) {
           try{
               console.log(msg);
               if(msg.result.error_code == 0){
                    bus_signature = msg.result.response.signature;
                    new_login_signature = msg.result.response.signature;
                    if(type != 'search'){
                        $.ajax({
                           type: "POST",
                           url: "/webservice/bus",
                           headers:{
                                'action': 'search',
                           },
                           data: {
                               'use_cache': true,
                               'signature': new_login_signature
                           },
                           success: function(msg) {
                           console.log(msg);
                               if(msg.result.error_code == 0){
                                    signature = new_login_signature;
                                    document.getElementById('reload_page').innerHTML +=`
                                        <input type='hidden' name="time_limit_input" value="`+time_limit+`"/>
                                        <input type='hidden' id="response" name="response" value=""/>
                                        <input type='hidden' name="signature" value='`+new_login_signature+`'/>
                                    `;
                                    try{
                                        document.getElementById('response').value = bus_response;
                                    }catch(err){
                                        console.log(err); // error kalau ada element yg tidak ada
                                    }
                                    document.getElementById('reload_page').submit();
                                    $('#myModalSignin').modal('hide');
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

           },timeout: 60000
        });
    }
}

function bus_signin(data){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/bus",
       headers:{
            'action': 'signin',
       },
       data: {},
       success: function(msg) {
            console.log(msg);
            if(msg.result.error_code == 0){
                signature = msg.result.response.signature;
                get_carriers_bus();
                if(data == '')
                    bus_get_config_provider(signature);
//                    bus_search(msg.result.response.signature);
                else if(data != '')
                    bus_get_booking(data);
            }else{
               Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: msg.result.error_msg,
               })
               try{
                hide_modal_waiting_transaction();
               }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
               }
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error bus singin');
            hide_modal_waiting_transaction();
       },timeout: 60000
    });
}

function bus_search_page(){
    $.ajax({
       type: "POST",
       url: "/webservice/bus",
       headers:{
            'action': 'search_page',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
            console.log(msg);
            bus_request = msg.bus_request;
            get_bus_config();
            bus_signin('');
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error data review hotel');
            $('#loading-search-bus').hide();
       },timeout: 180000
   });
}

function bus_search_page(){
    $.ajax({
       type: "POST",
       url: "/webservice/bus",
       headers:{
            'action': 'search_page',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
            console.log(msg);
            bus_request = msg.bus_request;
            get_bus_config();
            bus_signin('');
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error data review hotel');
            $('#loading-search-bus').hide();
       },timeout: 180000
   });
}

function bus_passenger_page(){
    $.ajax({
       type: "POST",
       url: "/webservice/bus",
       headers:{
            'action': 'passenger_page',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
            console.log(msg);
            bus_data = msg.response;
            bus_carriers = msg.bus_carriers;

            bus_response = msg.response;

            bus_request = msg.bus_request;
            bus_detail();
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
                  minDate: moment(bus_request.departure[bus_request.departure.length-1],'DD MMM YYYY').subtract(100, 'years'),
                  maxDate: moment(bus_request.departure[bus_request.departure.length-1],'DD MMM YYYY').subtract(3, 'years'),
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
                  startDate: moment(),
                  minDate: moment(),
                  showDropdowns: true,
                  opens: 'center',
                  locale: {
                      format: 'DD MMM YYYY',
                  }
              });
              $('input[name="adult_passport_expired_date'+i+'"]').val("");
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error data review hotel');
            $('#loading-search-bus').hide();
       },timeout: 180000
   });
}

function bus_review_page(){
    $.ajax({
       type: "POST",
       url: "/webservice/bus",
       headers:{
            'action': 'review_page',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
            console.log(msg);
            bus_data = msg.response;

            passengers = msg.passenger;
            passenger_with_booker = JSON.parse(JSON.stringify(passengers));

            adult = passengers.adult

            infant = passengers.infant;
            passengers = {
                'adult': adult,
                'infant': infant
            }
            bus_request = msg.bus_request;
            bus_booking = msg.bus_booking;
            adult = bus_request.adult;
            infant = 0;
            child = 0;
            var print_seat = false;
            for(i in bus_data){
                if(bus_data[i].available_seat_map)
                    print_seat = true;
            }

            for(i in bus_booking){
                pax_type = 'adult'
                for(j in bus_booking[i].journeys){
                    for(k in bus_booking[i].journeys[j].seat){
                        if(bus_booking[i].journeys[j].seat[k].seat_code != ''){
                            try{
                                document.getElementById('seat_'+pax_type+bus_booking[i].journeys[j].seat[k].sequence.toString()).innerHTML += bus_booking[i].journeys[j].seat[k].seat + bus_booking[i].journeys[j].seat[k].column;
                            }catch(err){
                                pax_type = 'infant';
                                try{
                                    document.getElementById('seat_'+pax_type+bus_booking[i].journeys[j].seat[k].sequence.toString()).innerHTML += bus_booking[i].journeys[j].seat[k].seat + bus_booking[i].journeys[j].seat[k].column;
                                }catch(err){
                                    console.log(err); // error kalau ada element yg tidak ada
                                }
                            }
                        }
                    }
                }
            }

            if(print_seat){
                document.getElementById('seat_map_div_mb').hidden = false;
                document.getElementById('seat_map_div_wb').hidden = false;
            }
            bus_detail();
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error data review hotel');
            $('#loading-search-bus').hide();
       },timeout: 180000
   });
}

function get_bus_config(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/bus",
       headers:{
            'action': 'get_config',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
        console.log(msg);
        for(i in msg.station){
            msg.station[i]['name_show'] = msg.station[i].city+' - '+ msg.station[i].name;
        }
        new_bus_destination = msg.station;
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
        error_ajax(XMLHttpRequest, textStatus, errorThrown, '');
       }
    });
}

function get_carriers_bus(){
    $.ajax({
       type: "POST",
       url: "/webservice/bus",
       headers:{
            'action': 'get_carriers',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
           console.log(msg);
           bus_carriers = msg;
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {

       },timeout: 60000
    });
}

function bus_get_config_provider(signature){
    $.ajax({
       type: "POST",
       url: "/webservice/bus",
       headers:{
            'action': 'get_config_provider',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
            console.log(msg);
            counter_bus_provider = 0;
            counter_bus_search = 0;
            if(google_analytics != '')
                gtag('bus', 'bus_search', {});
            if(msg.result.error_code == 0){
                provider_length = msg.result.response.providers.length;
                provider_bus = msg.result.response.providers;
                send_request_search();
            }else{
               Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: msg.result.error_msg,
               }).then((result) => {
                  if (result.value) {
                    hide_modal_waiting_transaction();
                  }
                })
               try{
                hide_modal_waiting_transaction();
               }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
               }
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error bus get config provider');
       },timeout: 60000
    });
}

function send_request_search(){
    counter_bus_provider = 0;
    document.getElementById('loading-search-bus').hidden = false
    text = '';
    if(bus_request.direction == 'OW')
        text = bus_request.departure[0];
    else
        text = bus_request.departure[0] + ' - ' + bus_request.departure[1];

    pax = bus_request.adult + ' Adult';
    //pax += ', ' + bus_request.infant + ' Infant';

    document.getElementById('date_bus').innerHTML = `
    <span class="copy_span" style="text-transform: capitalize; font-size:13px;">`+text+` </span>
    <span style="text-transform: capitalize; font-size:12px; margin-left:5px;"><i class="fas fa-users"></i> <span class="copy_span">`+ pax +`</span></span>`;

    change_date_next_prev(bus_request_pick);
    for(i in provider_bus){
        bus_search(provider_bus[i].provider, signature);
    }
}

//signin jadi 1 sama search
function bus_search(provider, signature){
    document.getElementById('bus_ticket').innerHTML = ``;
    document.getElementById('bus_detail').innerHTML = ``;
    $.ajax({
       type: "POST",
       url: "/webservice/bus",
       headers:{
            'action': 'search',
       },
       data: {
            'signature': signature,
            'search_request': JSON.stringify(bus_request),
            'provider': provider
       },
       success: function(msg) {
           console.log(msg);
           counter_bus_search++;
           try{
                if(msg.result.error_code==0){
                    counter_bus_provider++;
                    datasearch2(msg.result.response)
                }else{
                    if(counter_bus_search == provider_length && bus_data.length == 0){
                        loadingTrain();
                        var response = '';
                        response +=`
                            <div style="padding:5px; margin:10px;">
                                <div style="text-align:center">
                                    <img src="/static/tt_website_rodextrip/images/nofound/no-bus.png" style="width:80px; height:80px;" alt="Not Found Bus" title="" />
                                    <br/><br/>
                                    <h6>NO BUS AVAILABLE</h6>
                                </div>
                            </div>
                        `;
                        document.getElementById('bus_ticket').innerHTML = response;
                        $('#loading-search-bus').hide();
                        Swal.fire({
                          type: 'error',
                          title: 'Oops!',
                          html: '<span style="color: red;">Error bus search </span>' + msg.result.error_msg,
                        })
                    }
               }
           }catch(err){
                console.log(err);
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error bus search </span>' + msg.result.error_msg,
                })
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error bus search');
            counter_bus_search++;
            if(counter_bus_search == provider_length){
                if(bus_data.length == 0){
                    loadingTrain();
                    var response = '';
                    response +=`
                        <div style="padding:5px; margin:10px;">
                            <div style="text-align:center">
                                <img src="/static/tt_website_rodextrip/img/icon/no-train.png" style="width:80px; height:80px;" alt="Not Found Train" title="" />
                                <br/><br/>
                                <h6>NO BUS AVAILABLE</h6>
                            </div>
                        </div>
                    `;
                    document.getElementById('bus_ticket').innerHTML = response;
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: red;">Error bus search </span>' + errorThrown,
                    })
                }
            }
       },timeout: 300000
    });
}

function bus_get_rules(){
    data_send = {};
    journey_code_list = [];
    provider = '';
    for(i in journeys){
        journey_code_list.push(journeys[i].journey_code);
        provider = journeys[i].provider;
    }
    data_send = {
        'provider': provider,
        'journey_code_list': journey_code_list
    }
    $.ajax({
       type: "POST",
       url: "/webservice/bus",
       headers:{
            'action': 'get_rules',
       },
       data: {
            'signature': signature,
            'data': JSON.stringify(data_send),
       },
       success: function(msg) {
           console.log(msg);
           if(msg.result.error_code == 0){
               for(i in msg.result.response)
                    journeys[i].rules = msg.result.response[i].rules;

           }
           bus_get_detail();
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error bus search');
       },timeout: 300000
    });
}

function check_elapse_time_three_hours(departure){
  today = new Date();
  dep = new Date(departure);
  var diff = parseInt(Math.abs(dep - today)/3600000);
  if(today > dep)
    diff *= -1;
  if(diff >= 3)
    return true;
  else
    return false;
}

function datasearch2(bus){
    try{
    var counter = bus_data.length;
    data = [];
    data = bus_data;
    for(i in bus.schedules){
        for(j in bus.schedules[i].journeys){
           bus.schedules[i].journeys[j].sequence = counter;
           bus.schedules[i].journeys[j].bus_sequence = i;
           price = 0;
           currency = '';
           date = bus.schedules[i].journeys[j].departure_date;
           date = date.split(' - ')[0].split(' ')[2] + ' ' + date.split(' - ')[0].split(' ')[1] + ' ' + date.split(' - ')[0].split(' ')[0] + ' ' +date.split(' - ')[1];
           bus.schedules[i].journeys[j].can_book_three_hours = check_elapse_time_three_hours(date);
           bus.schedules[i].journeys[j].can_book_check_arrival_on_next_departure = true;
           bus.schedules[i].journeys[j].departure_date = bus.schedules[i].journeys[j].departure_date.split(' - ');
           bus.schedules[i].journeys[j].arrival_date = bus.schedules[i].journeys[j].arrival_date.split(' - ');
           for(k in bus.schedules[i].journeys[j].fares){
                for(l in bus.schedules[i].journeys[j].fares[k].service_charge_summary){
                    bus.schedules[i].journeys[j].price = 0
                    for(m in bus.schedules[i].journeys[j].fares[k].service_charge_summary[l].service_charges){
                        if(bus.schedules[i].journeys[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'fare' || bus.schedules[i].journeys[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'roc' || bus.schedules[i].journeys[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'tax'){
                            bus.schedules[i].journeys[j].currency = bus.schedules[i].journeys[j].fares[k].service_charge_summary[l].service_charges[m].currency;
                            bus.schedules[i].journeys[j].price += bus.schedules[i].journeys[j].fares[k].service_charge_summary[l].service_charges[m].amount;
                        }
                    }
                    break;
                }
                break;
           }
           data.push(bus.schedules[i].journeys[j]);
           counter++;
       }
    }
    bus_data = data;
    }catch(err){console.log(err);}
    filtering('filter');
}


function bus_pre_create_booking(val){
    Swal.fire({
      title: 'Are you sure want to Hold Booking?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        $('.hold-seat-booking-bus').addClass("running");
        $('.hold-seat-booking-bus').attr("disabled", true);
        please_wait_transaction();
        if(val == 0){
            document.getElementById("passengers").value = JSON.stringify(passenger_with_booker);
            document.getElementById("signature").value = signature;
            document.getElementById("provider").value = 'bus';
            document.getElementById("type").value = 'bus';
            document.getElementById("voucher_code").value = voucher_code;
            document.getElementById("discount").value = JSON.stringify(discount_voucher);
            document.getElementById("session_time_input").value = time_limit;
            bus_create_booking(val);
        }else{
            document.getElementById("passengers").value = JSON.stringify(passengers);
            document.getElementById("signature").value = signature;
            document.getElementById("provider").value = 'bus';
            document.getElementById("type").value = 'bus_review';
            document.getElementById("voucher_code").value = voucher_code;
            document.getElementById("discount").value = JSON.stringify(discount_voucher);
            document.getElementById("session_time_input").value = time_limit;
            document.getElementById('bus_issued').submit();
        }
      }
    })
}

function force_issued_bus(val){
    //tambah swal
    if(value == 0)
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
        please_wait_transaction();
        $('.next-loading-booking').addClass("running");
        $('.next-loading-booking').prop('disabled', true);
        $('.next-loading-issued').prop('disabled', true);
        $('.issued_booking_btn').prop('disabled', true);
        bus_create_booking(val);
      }
    })

}

function bus_create_booking(val){
    data = {
        'value': val,
        'signature': signature
    }
    try{
        data['acquirer_seq_id'] = payment_acq2[payment_method][selected].acquirer_seq_id;
        data['member'] = payment_acq2[payment_method][selected].method;
    }catch(err){
    }
    try{
//        data['voucher_code'] = voucher_code;
        data['voucher_code'] = '';
    }catch(err){
        console.log(err); // error kalau ada element yg tidak ada
    }
    try{
        data['paxs'] = JSON.stringify(pax);
    }catch(err){
        console.log(err); // error kalau ada element yg tidak ada
    }
    console.log(data);
    $.ajax({
       type: "POST",
       url: "/webservice/bus",
       headers:{
            'action': 'commit_booking',
       },
       data: data,
       success: function(msg) {
       console.log(msg);
       if(google_analytics != ''){
           if(data.hasOwnProperty('member') == true)
                gtag('event', 'bus_issued', {});
           else
                gtag('event', 'bus_hold_booking', {});
       }
        if(msg.result.error_code == 0){
            //send order number
            if(msg.result.response.state == 'booked'){
                if(val == 0){
                    $('.hold-seat-booking-bus').removeClass("running");
                    $('.hold-seat-booking-bus').attr("disabled", false);
                    if(user_login.co_agent_frontend_security.includes('b2c_limitation') == true){
                        document.getElementById("order_number").value = msg.result.response.order_number;
                        bus_get_detail = msg;
                        set_seat_map();
//                        send_url_booking('bus', btoa(msg.result.response.order_number), msg.result.response.order_number);
//                        document.getElementById('order_number').value = msg.result.response.order_number;
//                        document.getElementById('bus_issued').submit();
                    }else{
                        document.getElementById('bus_booking').innerHTML+= '<input type="hidden" name="order_number" value='+msg.result.response.order_number+'>';
                        document.getElementById('bus_booking').action = '/bus/booking/' + btoa(msg.result.response.order_number);
                        document.getElementById('bus_booking').submit();
                    }
                }else{
                    if(user_login.co_agent_frontend_security.includes('b2c_limitation') == true)
                        send_url_booking('bus', btoa(msg.result.response.order_number), msg.result.response.order_number);
                    document.getElementById('order_number').value = msg.result.response.order_number;
                    document.getElementById('issued').action = '/bus/booking/' + btoa(msg.result.response.order_number);
                    document.getElementById('issued').submit();
                }
            }else{
                document.getElementById('bus_booking').innerHTML+= '<input type="hidden" name="order_number" value='+msg.result.response.order_number+'>';
                document.getElementById('bus_booking').action = '/bus/booking/' + btoa(msg.result.response.order_number);
                document.getElementById('bus_booking').submit();
            }
//            gotoForm();
        }else{
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: #ff9900;">Error bus create booking </span>' + msg.result.error_msg,
            }).then((result) => {
              if (result.value) {
                hide_modal_waiting_transaction();
              }
            })
            $('.hold-seat-booking-bus').removeClass("running");
            $('.hold-seat-booking-bus').attr("disabled", false);
            hide_modal_waiting_transaction();
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error bus create booking');
            hide_modal_waiting_transaction();
            $('.hold-seat-booking-bus').removeClass("running");
            $('.hold-seat-booking-bus').attr("disabled", false);
       },timeout: 480000
    });
}

function bus_get_booking(data, sync=false){
    price_arr_repricing = {};
    get_vendor_balance('false');
    document.getElementById('cancel').hidden = true;
    document.getElementById('cancel').innerHTML = '';
    $.ajax({
       type: "POST",
       url: "/webservice/bus",
       headers:{
            'action': 'get_booking',
       },
       data: {
            'order_number': data,
            'signature': signature,
            'sync': sync
       },
       success: function(msg) {
        console.log(msg);
        try{
            document.getElementById('button-home').hidden = false;
            document.getElementById('button-new-reservation').hidden = false;
            if(msg.result.error_code == 0){
                bus_get_detail = msg;
                if(msg.result.response.hold_date != false && msg.result.response.hold_date != ''){
                    tes = moment.utc(msg.result.response.hold_date).format('YYYY-MM-DD HH:mm:ss')
                    var localTime  = moment.utc(tes).toDate();
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
                if(msg.result.response.state != 'issued' && msg.result.response.state != 'fail_booked'  && msg.result.response.state != 'fail_issued' && msg.result.response.state != 'cancel' && msg.result.response.state != 'cancel2'){
                    try{
                        if(now.diff(hold_date_time, 'minutes')<0){
                            check_payment_payment_method(msg.result.response.order_number, 'Issued', msg.result.response.booker.seq_id, 'billing', 'bus', signature, msg.result.response.payment_acquirer_number);
        //                    get_payment_acq('Issued',msg.result.response.booker.seq_id, msg.result.response.order_number, 'billing',signature,'bus');
                            document.getElementById('voucher_discount').style.display = '';
                        }
                    }catch(err){
                        console.log(err); // error kalau ada element yg tidak ada
                    }
                }else{
                    try{
                        document.getElementById('voucher_discount').style.display = 'none';
                    }catch(err){
                        console.log(err); // error kalau ada element yg tidak ada
                    }
                }
                total_price_provider = [];
                price_provider = 0;
                price_provider_for_discount = 0;
                $text = '';
                text = '';
                $text += 'Order Number: '+ msg.result.response.order_number + '\n';
                if(msg.result.response.state == 'booked')
                    $text += 'Hold Date:\n';
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
                        for(i in msg.result.response.provider_bookings){
                            //datetime utc to local
                            if(msg.result.response.provider_bookings[i].error_msg.length != 0 && msg.result.response.state != 'issued')
                                text += `<div class="alert alert-danger">
                                    `+msg.result.response.provider_bookings[i].error_msg+`
                                    <a href="#" class="close" data-dismiss="alert" aria-label="close" style="margin-top:-1.9vh;">x</a>
                                </div>`;
                            if(msg.result.response.provider_bookings[i].hold_date != false || msg.result.response.provider_bookings[i].hold_date != ''){
                                tes = moment.utc(msg.result.response.provider_bookings[i].hold_date).format('YYYY-MM-DD HH:mm:ss')
                                var localTime  = moment.utc(tes).toDate();
                                data_gmt = moment(msg.result.response.provider_bookings[i].hold_date)._d.toString().split(' ')[5];
                                gmt = data_gmt.replace(/[^a-zA-Z+-]+/g, '');
                                timezone = data_gmt.replace (/[^\d.]/g, '');
                                timezone = timezone.split('')
                                timezone = timezone.filter(item => item !== '0')
                                msg.result.response.provider_bookings[i].hold_date = moment(localTime).format('DD MMM YYYY HH:mm') + ' ' + gmt + timezone;
                            }
                            //
                            $text += msg.result.response.provider_bookings[i].pnr;
                            if(msg.result.response.state == 'booked')
                                $text +=' ('+msg.result.response.provider_bookings[i].hold_date+')\n';
                            else
                                $text += '\n';
                            text+=`<tr>`;
                            if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false || msg.result.response.state == 'issued')
                            text+=`
                                <td>`+msg.result.response.provider_bookings[i].pnr+`</td>`;
                            else
                                text+=`<td> - </td>`;
                            if(msg.result.response.state == 'booked')
                                text +=`
                                <td>`+msg.result.response.provider_bookings[i].hold_date+`</td>`;
                            text +=`<td id='pnr'>`;

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
                            text+=`
                                `+msg.result.response.provider_bookings[i].state_description+`
                                    </span>
                                </td>
                            </tr>`;
                        }
                        $text +='\n';
                text+=`</table>
                    <hr/>
                    <div class="row">
                        <div class="col-lg-6">
                            <h6>Booked</h6>
                            <span>Date: <b>`;
                                if(msg.result.response.booked_date != ""){
                                    text += msg.result.response.booked_date;
                                }else{
                                    text += `-`;
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
                                        text += msg.result.response.issued_date;
                                    }else{
                                        text += `-`;
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
                            <h5> Bus Detail </h5>
                            <hr/>`;
                        check = 0;
                        flight_counter = 1;
                        rules = 0;
                        for(i in msg.result.response.provider_bookings){
                            for(j in msg.result.response.provider_bookings[i].journeys){
                                if(msg.result.response.provider_bookings[i].journeys[j].cabin_class == 'E')
                                    msg.result.response.provider_bookings[i].journeys[j].cabin_class = ['E', 'Executive']
                                else if(msg.result.response.provider_bookings[i].journeys[j].cabin_class == 'K')
                                    msg.result.response.provider_bookings[i].journeys[j].cabin_class = ['K', 'Economy']
                                else if(msg.result.response.provider_bookings[i].journeys[j].cabin_class == 'B')
                                    msg.result.response.provider_bookings[i].journeys[j].cabin_class = ['B', 'Business']
                                if(i != 0){
                                    text+=`<hr/>`;
                                }
                                text += `<h5>PNR: `+msg.result.response.provider_bookings[i].journeys[j].pnr+`</h5>`;
                                text+=`<h6>Journey `+flight_counter+`</h6><br/>`;
                                $text += 'Journey '+ flight_counter+'\n';
                                flight_counter++;
                                //yang baru harus diganti

                                $text += msg.result.response.provider_bookings[i].journeys[j].carrier_name+'\n';
                                $text += msg.result.response.provider_bookings[i].journeys[j].departure_date + ' - ';
                                if(msg.result.response.provider_bookings[i].journeys[j].departure_date.split(' - ')[0] == msg.result.response.provider_bookings[i].journeys[j].arrival_date.split(' - ')[0])
                                    $text += msg.result.response.provider_bookings[i].journeys[j].arrival_date.split(' - ')[1] + '\n';
                                else
                                    $text += msg.result.response.provider_bookings[i].journeys[j].arrival_date + '\n';
                                $text += msg.result.response.provider_bookings[i].journeys[j].origin_name +' ('+msg.result.response.provider_bookings[i].journeys[j].origin+') - '+msg.result.response.provider_bookings[i].journeys[j].destination_name +' ('+msg.result.response.provider_bookings[i].journeys[j].destination+')\n';

                                for(k in msg.result.response.provider_bookings[i].journeys[j].seats){
                                    if(msg.result.response.provider_bookings[i].journeys[j].seats[k].seat){
                                        if(k == 0)
                                            $text += 'Seats:\n';
                                        $text += msg.result.response.provider_bookings[i].journeys[j].seats[k].passenger + ', ' + msg.result.response.provider_bookings[i].journeys[j].seats[k].seat.split(',')[0] + ' ' + msg.result.response.provider_bookings[i].journeys[j].seats[k].seat.split(',')[1]+'\n';
                                    }
                                }
                                $text += '\n';
                                text+= `
                                <div class="row">
                                    <div class="col-lg-4">`;
                                text+=`<h6>`+msg.result.response.provider_bookings[i].journeys[j].carrier_name+' '+msg.result.response.provider_bookings[i].journeys[j].carrier_number+`</h5>
                                <span>Class : `+msg.result.response.provider_bookings[i].journeys[j].cabin_class[1];
                                if(msg.result.response.provider_bookings[i].journeys[j].class_of_service != '')
                                    text+=` (`+msg.result.response.provider_bookings[i].journeys[j].class_of_service+`)</span><br/>`;
                                else
                                    text += '<br/>';
                                text+=`</div>`;
                                text += `
                                    <div class="col-lg-8">
                                        <div class="row">
                                            <div class="col-lg-6 col-xs-6">
                                                <table style="width:100%">
                                                    <tr>
                                                        <td><h5>`+msg.result.response.provider_bookings[i].journeys[j].departure_date.split(' - ')[1]+`</h5></td>
                                                        <td style="padding-left:15px;">
                                                            <img src="/static/tt_website_rodextrip/img/icon/bus-01.png" style="width:30px; height:30px;" alt="Bus"/>
                                                        </td>
                                                        <td style="height:25px;padding:0 15px;width:100%">
                                                            <div style="display:inline-block;position:relative;width:100%">
                                                                <div style="height:2px;position:absolute;top:16px;width:100%;background-color:#d4d4d4;"></div>
                                                                <div class="origin-code-snippet" style="background-color:#d4d4d4;right:-6px"></div>
                                                                <div style="height:30px;min-width:20px;position:relative;width:0%"/>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </table>
                                                <span>`+msg.result.response.provider_bookings[i].journeys[j].departure_date.split(' - ')[0]+`</span><br/>
                                                <span style="font-weight:500;">`+msg.result.response.provider_bookings[i].journeys[j].origin_name+`</span>
                                            </div>

                                            <div class="col-lg-6 col-xs-6" style="padding:0;">
                                                <table style="width:100%; margin-bottom:6px;">
                                                    <tr>
                                                        <td><h5>`+msg.result.response.provider_bookings[i].journeys[j].arrival_date.split(' - ')[1]+`</h5></td>
                                                        <td></td>
                                                        <td style="height:30px;padding:0 15px;width:100%"></td>
                                                    </tr>
                                                </table>
                                                <span>`+msg.result.response.provider_bookings[i].journeys[j].arrival_date.split(' - ')[0]+`</span><br/>
                                                <span style="font-weight:500;">`+msg.result.response.provider_bookings[i].journeys[j].destination_name+`</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
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
                                                `+msg.result.response.provider_bookings[i].rules[j].description[k]+`
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
                </div>

                <div style="border:1px solid #cdcdcd; padding:10px; background-color:white; margin-top:20px;">
                    <h5> Booker</h5>
                    <hr/>
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
                            <td>`+msg.result.response.booker.email+`</td>
                            <td>`+msg.result.response.booker.phones[0].calling_code+' - '+msg.result.response.booker.phones[0].calling_number+`</td>
                        </tr>

                    </table>
                </div>
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
                            <td> `+msg.result.response.contact.title+` `+msg.result.response.contact.name+`</td>
                            <td>`+msg.result.response.contact.email+`</td>
                            <td>`+msg.result.response.contact.phone+`</td>
                        </tr>
                    </table>
                </div>

                <div style="border:1px solid #cdcdcd; padding:10px; background-color:white; margin-top:20px;">
                    <h5> List of Passenger</h5>
                    <hr/>
                    <table style="width:100%" id="list-of-passenger">
                        <tr>
                            <th style="width:5%;" class="list-of-passenger-left">No</th>
                            <th style="width:30%;">Name</th>
                            <th style="width:15%;">Birth Date</th>
                            <th style="width:15%;">Identity Type</th>
                            <th style="width:20%;">ID</th>
                            <th style="width:20%;">Seat</th>
                        </tr>`;
                        for(pax in msg.result.response.passengers){
                            ticket = [];
                            for(i in msg.result.response.provider_bookings){
                                for(j in msg.result.response.provider_bookings[i].journeys){
                                    for(k in msg.result.response.provider_bookings[i].journeys[j].seats){
                                        if(msg.result.response.passengers[pax].name == msg.result.response.provider_bookings[i].journeys[j].seats[k].passenger){
                                            ticket.push({
                                                'journey': msg.result.response.provider_bookings[i].journeys[j].origin + ' - ' + msg.result.response.provider_bookings[i].journeys[j].destination,
                                                'seat': msg.result.response.provider_bookings[i].journeys[j].seats[k].seat
                                            })
                                            break;
                                        }
                                    }
                                }
                                try{
                                    ticket += msg.result.response.provider_bookings[provider].tickets[pax].ticket_number
                                    if(provider != msg.result.response.provider_bookings.length - 1)
                                        ticket += ', ';
                                }catch(err){

                                }
                            }
                            text+=`<tr>
                                <td class="list-of-passenger-left">`+(parseInt(pax)+1)+`</td>
                                <td>`+msg.result.response.passengers[pax].title+` `+msg.result.response.passengers[pax].first_name+` `+msg.result.response.passengers[pax].last_name+`</td>
                                <td>`+msg.result.response.passengers[pax].birth_date+`</td>
                                <td>`+msg.result.response.passengers[pax].identity_type.charAt(0).toUpperCase()+msg.result.response.passengers[pax].identity_type.slice(1).toLowerCase()+`</td>
                                <td>`+msg.result.response.passengers[pax].identity_number+`</td>
                                <td>`;
                                for(i in ticket)
                                    if(ticket[i].seat){
                                        if(ticket[i].seat.split(',').length == 2)
                                           text += ticket[i].journey+`<br/>`+ticket[i].seat.split(',')[0] + ' ' + ticket[i].seat.split(',')[1] +`<br/>`;
                                    }
                                text+=`
                                </td>
                            </tr>`;
                        }

                    text+=`</table>
                    </div>
                </div>

                <div class="row" style="margin-top:20px;">
                    <div class="col-lg-4" style="padding-bottom:10px;">`;
                        if(msg.result.response.state != 'cancel' && msg.result.response.state != 'cancel2'){
                            if (msg.result.response.state == 'booked'){
                                try{
                                    document.getElementById('div_sync_status').hidden = false;
                                }catch(err){
                                    console.log(err); // error kalau ada element yg tidak ada
                                }
                                text+=`
                                <form method="post" id="seat_map_request" action='/bus/seat_map'>

                                    <input type="button" id="button-choose-print" class="primary-btn hold-seat-booking-bus ld-ext-right" style="width:100%;color:`+text_color+`;" value="Seat Map" onclick="set_seat_map();"/>
                                    <input id='passenger_input' name="passenger_input" type="hidden"/>
                                    <input id='seat_map_request_input' name="seat_map_request_input" type="hidden"/>
                                    <input id='order_number' name="order_number" value="`+msg.result.response.order_number+`" type="hidden"/>
                                </form>`;
                            }else if(msg.result.response.state == 'issued'){
                                try{
                                    document.getElementById('div_sync_status').hidden = true;
                                }catch(err){
                                    console.log(err); // error kalau ada element yg tidak ada
                                }
                                text+=`
                                <button type="button" id="button-choose-print" class="primary-btn ld-ext-right" style="width:100%;" onclick="get_printout('`+msg.result.response.order_number+`', 'ticket','bus');">
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
                                <button type="button" id="button-print-print" class="primary-btn ld-ext-right" style="width:100%;" onclick="get_printout('`+msg.result.response.order_number+`', 'itinerary','bus');">
                                    Print Form
                                    <div class="ld ld-ring ld-cycle"></div>
                                </button>`;
                            }
                            else if(msg.result.response.state == 'issued'){
                                text+=`
                                <button type="button" class="primary-btn ld-ext-right" id="button-print-print" style="width:100%;" onclick="get_printout('`+msg.result.response.order_number+`', 'ticket_price','bus');">
                                    Print Ticket (Price)
                                    <div class="ld ld-ring ld-cycle"></div>
                                </button>`;
                            }
                        }
                        text+=`
                    </div>
                    <div class="col-lg-4" style="padding-bottom:10px;">`;
                        if(msg.result.response.state != 'cancel' && msg.result.response.state != 'cancel2'){
                            if (msg.result.response.state  == 'booked'){
                                try{
                                    if(now.diff(hold_date_time, 'minutes')<0)
                                        $(".issued_booking_btn").show();
                                }catch(err){
                                    console.log(err); // error kalau ada element yg tidak ada
                                }
                            }
                            else if(msg.result.response.state == 'issued'){
    //                            text+=`
    //                            <a class="issued-booking-bus ld-ext-right" style="color:`+text_color+`;">
    //                                <input type="button" class="primary-btn" id="button-issued-print" style="width:100%;" value="Print Invoice" onclick="window.open('https://backend.rodextrip.com/rodextrip/report/pdf/tt.reservation.bus/`+msg.result.response.order_number+`/4','_blank');"/>
    //                                <div class="ld ld-ring ld-cycle"></div>
    //                            </a>`;
                                text+=`
                                <a class="issued-booking-bus ld-ext-right" style="color:`+text_color+`;">
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
                                                        <button type="button" id="button-issued-print" class="primary-btn ld-ext-right" onclick="get_printout('`+msg.result.response.order_number+`', 'invoice','bus');">
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
                                $(".issued_booking_btn").remove();
                            }
                        }
                            text+=`
                        </a>
                    </div>
                </div>`;
                document.getElementById('bus_booking').innerHTML = text;
                hide_modal_waiting_transaction();
                //$(".issued_booking_btn").show();

                //detail
                text = '';
                tax = 0;
                fare = 0;
                total_price = 0;
                commission = 0;
                service_charge = ['FARE', 'RAC', 'ROC', 'TAX', 'CSC'];
                text_detail=`
                <div style="background-color:white; padding:10px; border: 1px solid #cdcdcd; margin-bottom:15px;">
                    <h5> Price Detail</h5>
                <hr/>`;

                //repricing
                type_amount_repricing = ['Repricing'];
                //repricing
                counter_service_charge = 0;
                disc = 0;

                $text += '\nContact Person:\n';
                $text += msg.result.response.contact.title + ' ' + msg.result.response.contact.name + '\n';
                $text += msg.result.response.contact.email + '\n';
                $text += msg.result.response.contact.phone+ '\n';

                $text += '\nPrice:\n';
                for(i in msg.result.response.provider_bookings){
                    try{
                        csc = 0;
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
                                }catch(err){
                                    console.log(err); // error kalau ada element yg tidak ada
                                }
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
                    }catch(err){
                        console.log(err); // error kalau ada element yg tidak ada
                    }
                }
                try{
                    $text += 'Grand Total: '+price.currency+' '+ getrupiah(total_price);
                    if(msg.result.response.state == 'booked')
                    $text += '\n\nPrices and availability may change at any time';
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
                                if(total_price != 0)
                                    text_detail+= price.currency+` `+getrupiah(total_price);
                                else
                                    text_detail+= 'Free';
                            }catch(err){

                            }
                            text_detail+= `</span>
                        </div>
                    </div>`;

                    if(msg.result.response.state == 'booked' && user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false){
                        text_detail+=`<div style="text-align:right; padding-bottom:10px;"><img src="/static/tt_website_rodextrip/img/bank.png" alt="Bank" style="width:25px; height:25px; cursor:pointer;" onclick="show_repricing();"/></div>`;
                    }else if(msg.result.response.state == 'issued' && user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false){
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
                                <a href="mailto:?subject=This is the bus price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png" alt="Email"/></a>`;
                        } else {
                            text_detail+=`
                                <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png" alt="Whatsapp"/></a>
                                <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png" alt="Line"/></a>
                                <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png" alt="Telegram"/></a>
                                <a href="mailto:?subject=This is the bus price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png" alt="Email"/></a>`;
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
                        </div>`;
                    text_detail+=`
                </div>`;
                }catch(err){
                    console.log(err);
                }
                try{
                    testing_price = price.currency;
                    text += text_detail;
                }catch(err){

                }
                add_repricing();
                document.getElementById('show_title_bus').hidden = false;
                document.getElementById('show_loading_booking_bus').hidden = true;
                document.getElementById('bus_detail').innerHTML = text;

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
                   document.getElementById('cancel').hidden = false;
                   document.getElementById('cancel').innerHTML = `<button class="primary-btn-white" style="width:100%;" id="bus_cancel_booking_btn" type="button" onclick="bus_cancel_booking();">Cancel Booking <i class="fas fa-times" style="padding-left:5px; color:red; font-size:16px;"></i></button>`;
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
                    document.getElementById('cancel').hidden = true;
                    document.getElementById('cancel').innerHTML = '';

                   document.getElementById('issued-breadcrumb').classList.add("br-active");
                   document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-active");
                   document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-check"></i>`;
                   document.getElementById('alert-state').innerHTML = `
                   <div class="alert alert-success" role="alert">
                       <h5>Your booking has been successfully Issued!</h5>
                   </div>`;
                }

            }else if(msg.result.error_code == 1035){
                document.getElementById('show_title_bus').hidden = false;
                document.getElementById('show_loading_booking_bus').hidden = true;
                document.getElementById('show_title_bus').hidden = true;
                render_login('bus');
            }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error bus booking </span>' + msg.result.error_msg,
                }).then((result) => {
                  if (result.value) {
                    hide_modal_waiting_transaction();
                  }
                })
                document.getElementById('show_loading_booking_bus').hidden = true;
                hide_modal_waiting_transaction();
            }
        }catch(err){
            console.log(err);
            Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error bus booking </span> Please try again in 1 - 5 minutes later or contact customer service' ,
            }).then((result) => {
              window.location.href = '/reservation';
            })
            document.getElementById('show_loading_booking_bus').hidden = true;
            hide_modal_waiting_transaction();
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error bus booking');
            hide_modal_waiting_transaction();
            document.getElementById('show_loading_booking_bus').hidden = true;
       },timeout: 480000
    });
}

function set_seat_map(){
    passengers = [];
    seat_map_request = [];
    for(i in bus_get_detail.result.response.provider_bookings){
        for(j in bus_get_detail.result.response.provider_bookings[i].journeys){
            seat_map_request.push({
                'fare_code': bus_get_detail.result.response.provider_bookings[i].journeys[j].fare_code,
                'provider': bus_get_detail.result.response.provider_bookings[i].provider
            })
            for(k in bus_get_detail.result.response.provider_bookings[i].journeys[j].seats){
                check = 0;
                for(l in passengers){
                    if(passengers[l].name == bus_get_detail.result.response.provider_bookings[i].journeys[j].seats[k].passenger){
                        passengers[l].seat_list.push({
                            'seat':bus_get_detail.result.response.provider_bookings[i].journeys[j].seats[k].seat,
                            'fare_code': bus_get_detail.result.response.provider_bookings[i].journeys[j].fare_code,
                            'origin': bus_get_detail.result.response.provider_bookings[i].journeys[j].origin,
                            'seat_code': bus_get_detail.result.response.provider_bookings[i].journeys[j].seats[l].seat_code,
                            'destination': bus_get_detail.result.response.provider_bookings[i].journeys[j].destination
                        });
                        check = 1;
                        break;
                    }
                }
                if(check == 0){
                    passengers.push({
                        'sequence': bus_get_detail.result.response.provider_bookings[i].journeys[j].seats[k].passenger_sequence,
                        'name': bus_get_detail.result.response.provider_bookings[i].journeys[j].seats[k].passenger,
                        'seat_list': [{
                            'seat': bus_get_detail.result.response.provider_bookings[i].journeys[j].seats[k].seat,
                            'fare_code': bus_get_detail.result.response.provider_bookings[i].journeys[j].fare_code,
                            'origin': bus_get_detail.result.response.provider_bookings[i].journeys[j].origin,
                            'seat_code': bus_get_detail.result.response.provider_bookings[i].journeys[j].seats[k].seat_code,
                            'destination': bus_get_detail.result.response.provider_bookings[i].journeys[j].destination
                        }]
                    })
                }
            }
        }
    }
    for(i=passengers.length-1;i>0;i--){
        if(passengers[i].seat_list[0].seat_code == '')
            passengers.pop(i);
    }
    document.getElementById('passenger_input').value = JSON.stringify(passengers);
    document.getElementById('seat_map_request_input').value = JSON.stringify(seat_map_request);
    goto_seat_map();
}

function bus_issued(data){
    var temp_data = {}
    if(typeof(bus_get_detail) !== 'undefined')
        temp_data = JSON.stringify(bus_get_detail)
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
        $.ajax({
           type: "POST",
           url: "/webservice/bus",
           headers:{
                'action': 'issued',
           },
           data: {
               'order_number': data,
               'acquirer_seq_id': payment_acq2[payment_method][selected].acquirer_seq_id,
               'member': payment_acq2[payment_method][selected].method,
               'signature': signature,
               'voucher_code': voucher_code,
               'booking': temp_data
           },
           success: function(msg) {
               console.log(msg);
               if(google_analytics != '')
                   gtag('event', 'bus_issued', {});
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
                        window.location.href = '/bus/booking/' + btoa(data);
                   }else{
                       //update ticket
                       price_arr_repricing = {};
                       pax_type_repricing = [];
                       document.getElementById('show_loading_booking_bus').hidden = true;
                       document.getElementById('bus_booking').innerHTML = '';
                       document.getElementById('bus_detail').innerHTML = '';
                       document.getElementById('payment_acq').innerHTML = '';
                       document.getElementById('show_loading_booking_bus').style.display = 'block';
                       document.getElementById('show_loading_booking_bus').hidden = false;
                       document.getElementById('payment_acq').hidden = true;
                       document.getElementById("overlay-div-box").style.display = "none";
                       try{
                            document.getElementById('voucher_discount').style.display = 'none';
                       }catch(err){
                            console.log(err); // error kalau ada element yg tidak ada
                       }
                       hide_modal_waiting_transaction();
                       bus_get_booking(data);
                   }
               }else if(msg.result.error_code == 1009){
                   price_arr_repricing = {};
                   pax_type_repricing = [];
                   document.getElementById('show_loading_booking_bus').hidden = true;
                   document.getElementById('bus_booking').innerHTML = '';
                   document.getElementById('bus_detail').innerHTML = '';
                   document.getElementById('payment_acq').innerHTML = '';
                   document.getElementById('show_loading_booking_bus').style.display = 'block';
                   document.getElementById('show_loading_booking_bus').hidden = false;
                   document.getElementById('payment_acq').hidden = true;
                   document.getElementById("overlay-div-box").style.display = "none";
                   try{
                        document.getElementById('voucher_discount').style.display = 'none';
                   }catch(err){
                        console.log(err); // error kalau ada element yg tidak ada
                   }
                   hide_modal_waiting_transaction();
                   bus_get_booking(data);
                   Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: #ff9900;">Error bus issued </span>' + msg.result.error_msg,
                    }).then((result) => {
                      if (result.value) {
                        hide_modal_waiting_transaction();
                      }
                    })
               }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                    auto_logout();
               }else{
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: #ff9900;">Error bus issued </span>' + msg.result.error_msg,
                    })
                    price_arr_repricing = {};
                    pax_type_repricing = [];
                    document.getElementById('show_loading_booking_bus').hidden = true;
                    document.getElementById('bus_booking').innerHTML = '';
                    document.getElementById('bus_detail').innerHTML = '';
                    document.getElementById('payment_acq').innerHTML = '';
                    document.getElementById('show_loading_booking_bus').style.display = 'block';
                    document.getElementById('show_loading_booking_bus').hidden = false;
                    document.getElementById('payment_acq').hidden = true;
                    document.getElementById("overlay-div-box").style.display = "none";
                    try{
                        document.getElementById('voucher_discount').style.display = 'none';
                    }catch(err){
                        console.log(err); // error kalau ada element yg tidak ada
                    }
                    $('.hold-seat-booking-bus').prop('disabled', false);
                    $('.hold-seat-booking-bus').removeClass("running");
                    hide_modal_waiting_transaction();
                    bus_get_booking(data);
               }
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error bus issued');
                price_arr_repricing = {};
                pax_type_repricing = [];
                document.getElementById('show_loading_booking_bus').hidden = true;
                document.getElementById('bus_booking').innerHTML = '';
                document.getElementById('bus_detail').innerHTML = '';
                document.getElementById('payment_acq').innerHTML = '';
                document.getElementById('show_loading_booking_bus').style.display = 'block';
                document.getElementById('show_loading_booking_bus').hidden = false;
                document.getElementById('payment_acq').hidden = true;
                try{
                    document.getElementById('voucher_discount').style.display = 'none';
                }catch(err){
                    console.log(err); // error kalau ada element yg tidak ada
                }
                $('.hold-seat-booking-bus').prop('disabled', false);
                $('.hold-seat-booking-bus').removeClass("running");
                hide_modal_waiting_transaction();
                document.getElementById("overlay-div-box").style.display = "none";
                bus_get_booking(data);
           },timeout: 480000
        });
      }
    })
}

function bus_get_seat_map(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/bus",
       headers:{
            'action': 'get_seat_map',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
        console.log(msg);
        if(msg.result.error_code==0){
            seat_map_response = msg.result.response;
            print_seat_map(0);
        }else{
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: #ff9900;">Error bus seat map </span>' + msg.result.error_msg,
            })
        }

       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error bus seat map');
       },timeout: 480000
    });
}

function bus_cancel_booking(){
    Swal.fire({
      title: 'Are you sure want to Cancel Booking?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        please_wait_transaction();
        getToken();
        $.ajax({
           type: "POST",
           url: "/webservice/bus",
           headers:{
                'action': 'cancel',
           },
           data: {
                'order_number': order_number,
                'signature': signature
           },
           success: function(msg) {
           console.log(msg);
            if(msg.result.error_code == 0){
               price_arr_repricing = {};
               pax_type_repricing = [];
               bus_get_booking(order_number);
               document.getElementById('show_loading_booking_bus').hidden = true;
               document.getElementById('bus_booking').innerHTML = '';
               document.getElementById('bus_detail').innerHTML = '';
               document.getElementById('payment_acq').innerHTML = '';
               document.getElementById('show_loading_booking_bus').style.display = 'block';
               document.getElementById('show_loading_booking_bus').hidden = false;
               document.getElementById('payment_acq').hidden = true;
               document.getElementById("overlay-div-box").style.display = "none";
               try{
                    document.getElementById('voucher_discount').style.display = 'none';
               }catch(err){
                    console.log(err); // error kalau ada element yg tidak ada
               }
               try{
                    document.getElementById("issued_btn_bus").style.display = "none";
               }catch(err){
                    console.log(err); // error kalau ada element yg tidak ada
               }
            }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error cancel bus </span>' + msg.result.error_msg,
                }).then((result) => {
                  if (result.value) {
                    hide_modal_waiting_transaction();
                  }
                })
                price_arr_repricing = {};
                pax_type_repricing = [];
                document.getElementById('show_loading_booking_bus').hidden = true;
                document.getElementById('bus_booking').innerHTML = '';
                document.getElementById('bus_detail').innerHTML = '';
                document.getElementById('payment_acq').innerHTML = '';
                document.getElementById('show_loading_booking_bus').style.display = 'block';
                document.getElementById('show_loading_booking_bus').hidden = false;
                document.getElementById('payment_acq').hidden = true;
                document.getElementById("overlay-div-box").style.display = "none";
                try{
                    document.getElementById('voucher_discount').style.display = 'none';
                }catch(err){
                    console.log(err); // error kalau ada element yg tidak ada
                }
                bus_get_booking(order_number);
                hide_modal_waiting_transaction();
            }
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error bus manual seat');
                hide_modal_waiting_transaction();
           },timeout: 480000
        });
        $('.submit-seat-bus').addClass("running");
      }
    })
}

function bus_manual_seat(){
    $('.submit-seat-bus').addClass("running");
    $('.change-seat-bus-buttons').prop('disabled', true);
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/bus",
       headers:{
            'action': 'assign_seats',
       },
       data: {
            'pax': JSON.stringify(pax),
            'order_number': order_number,
            'signature': signature

       },
       success: function(msg) {
       console.log(msg);
        if(msg.result.error_code == 0){
            check = 0;
            for(i in msg.result.response){
                if(msg.result.response[i].status == 'FAILED'){
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: #ff9900;">Error bus manual seat </span>' + msg.result.response[i].error_msg,
                    });
                    check = 1;
                }
            }
            if(check == 0){
                //check var
                if(is_b2c_field.value == true){
                    send_url_booking('bus', btoa(is_b2c_field.order_number), is_b2c_field.order_number);
                    document.getElementById("passengers").value = JSON.stringify(is_b2c_field.passengers);
                    document.getElementById("signature").value = is_b2c_field.signature;
                    document.getElementById("provider").value = is_b2c_field.provider;
                    document.getElementById("type").value = is_b2c_field.type;
                    document.getElementById("voucher_code").value = is_b2c_field.voucher_code;
                    document.getElementById("discount").value = JSON.stringify(is_b2c_field.discount);
                    document.getElementById("session_time_input").value = is_b2c_field.session_time_input;
                    document.getElementById("order_number2").value = is_b2c_field.order_number;
                    document.getElementById('bus_issued').submit();
                }else{
                    document.getElementById('bus_booking').submit();
                }
            }else{
                $('.submit-seat-bus').removeClass("running");
                $('.change-seat-bus-buttons').prop('disabled', false);
            }
        }else
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: #ff9900;">Error bus manual seat </span>' + msg.result.error_msg,
            }).then((result) => {
              if (result.value) {
                hide_modal_waiting_transaction();
              }
            })
            $('.submit-seat-bus').removeClass("running");
            hide_modal_waiting_transaction();
            $('.change-seat-bus-buttons').prop('disabled', false);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error bus manual seat');
            hide_modal_waiting_transaction();
            $('.submit-seat-bus').removeClass("running");
            $('.change-seat-bus-buttons').prop('disabled', false);
       },timeout: 480000
    });
}

function gotoForm(){
    document.getElementById('bus_searchForm').submit();
}

function update_service_charge(type){
    repricing_order_number = '';
    if(type == 'booking'){
        upsell = []
        for(i in bus_get_detail.result.response.passengers){
            for(j in bus_get_detail.result.response.passengers[i].sale_service_charges){
                currency = bus_get_detail.result.response.passengers[i].sale_service_charges[j].FARE.currency;
            }
            list_price = []
            for(j in list){
                if(bus_get_detail.result.response.passengers[i].name == document.getElementById('selection_pax'+j).value){
                    list_price.push({
                        'amount': list[j],
                        'currency_code': currency
                    });
                }

            }
            upsell.push({
                'sequence': bus_get_detail.result.response.passengers[i].sequence,
                'pricing': JSON.parse(JSON.stringify(list_price))
            });
        }
        repricing_order_number = order_number;
    }else{
        upsell_price = 0;
        upsell = []
        counter_pax = -1;
        currency = price['currency'];
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
       url: "/webservice/bus",
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
                    bus_get_booking(repricing_order_number);
                }else{
                    price_arr_repricing = {};
                    pax_type_repricing = [];
                    bus_detail();
                }

                $('#myModalRepricing').modal('hide');
           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
           }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error bus service charge </span>' + msg.result.error_msg,
                })
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error bus service charge');
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
       url: "/webservice/bus",
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
                        bus_get_booking(repricing_order_number);
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
                  html: '<span style="color: #ff9900;">Error bus update booker insentif </span>' + msg.result.error_msg,
                })
                $('.loader-rodextrip').fadeOut();
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error bus update booker insentif');
            $('.loader-rodextrip').fadeOut();
       },timeout: 60000
    });

}

function get_seat_map(){
    $('.hold-seat-booking-bus').addClass("running");
    $('.hold-seat-booking-bus').attr("disabled", true);

    var data_journey_code = [];
    for(i in bus_data){
        data_journey_code.push({
            "journey_code": bus_data[i].journey_code,
            "provider": bus_data[i].provider
        })
    }
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/bus",
       headers:{
            'action': 'get_seat_map',
       },
       data: {
            'signature': signature,
            'journey_code_list': JSON.stringify(data_journey_code),
       },
       success: function(msg) {
        console.log(msg);
        if(msg.result.error_code==0){
            document.getElementById('passenger_input').value = JSON.stringify(passengers);
            document.getElementById('seat_map_request_input').value = JSON.stringify(msg.result.response);
            document.getElementById('signature').value = signature;
            document.getElementById('session_time_input').value = time;
            document.getElementById('bus_seat_map').submit();
        }else{
            $('.hold-seat-booking-bus').removeClass("running");
            $('.hold-seat-booking-bus').attr("disabled", false);

            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: #ff9900;">Error bus seat map </span>' + msg.result.error_msg,
            })
        }

       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error bus seat map');
       },timeout: 480000
    });
}

function get_seat_map_cache(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/bus",
       headers:{
            'action': 'get_seat_map_cache',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
        console.log(msg);
        if(msg.result.error_code==0){
            seat_map_response = msg.result.response;
            print_seat_map(0);
        }else{
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: #ff9900;">Error bus seat map </span>' + msg.result.error_msg,
            })
        }

       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error bus seat map');
       },timeout: 480000
    });
}