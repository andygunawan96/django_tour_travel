var train_data = [];
var train_data_filter = '';
var train_cookie = '';
var train_sid = '';
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

//function test_search_train(){
//    counter = parseInt(document.getElementById('counter').value);
//    for(i=0;i<counter;i++){
//        train_signin('');
//    }
//}

function train_redirect_signin(type){
    if(type != 'signin'){
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
        getToken();
        $.ajax({
           type: "POST",
           url: "/webservice/train",
           headers:{
                'action': 'signin',
           },
           data: data_send,
           success: function(msg) {
           try{
                if(msg.result.error_code == 0){
                    train_signature = msg.result.response.signature;
                    new_login_signature = msg.result.response.signature;
                    $('#myModalSignIn').modal('hide');
                    window.location.href = '/';
//                    location.reload();
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

function get_train_data_search_page(frontend_signature){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/train",
       headers:{
            'action': 'get_train_data_search_page',
       },
       data: {
            "frontend_signature": frontend_signature
       },
       success: function(msg) {
            train_request = msg.train_request;
            get_train_config('home');
            train_signin('');

       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
        error_ajax(XMLHttpRequest, textStatus, errorThrown, '');
       }
    });
}

function get_train_data_passenger_page(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/train",
       headers:{
            'action': 'get_train_data_passenger_page',
       },
       data: {
            "signature": signature
       },
       success: function(msg) {
        train_data = msg.response;
        departure_date = '';
        for(i in train_data){
            departure_date = moment(train_data[i].departure_date[0], 'DD MMM YYYY').format('YYYY-MM-DD')
        }
        train_carriers = msg.train_carriers;
        train_response = msg.response;
        train_request = msg.train_request;
        train_detail();
        $(function() {
              breadcrumb_create("train", 3, 0);
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
                      minDate: moment(train_request.departure[train_request.departure.length-1],'DD MMM YYYY').subtract(100, 'years'),
                      maxDate: moment(train_request.departure[train_request.departure.length-1],'DD MMM YYYY').subtract(3, 'years'),
                      showDropdowns: true,
                      opens: 'center',
                      locale: {
                          format: 'DD MMM YYYY',
                      }
                  });
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
                      minDate: moment(train_request.departure[train_request.departure.length-1],'DD MMM YYYY').subtract(2, 'years').subtract(364, 'days'),
                      maxDate: moment(train_request.departure[train_request.departure.length-1],'DD MMM YYYY'),
                      showDropdowns: true,
                      opens: 'center',
                      locale: {
                          format: 'DD MMM YYYY',
                      }
                  });
                  $('input[name="infant_birth_date'+i+'"]').val("");

                  $('input[name="infant_passport_expired_date'+i+'"]').daterangepicker({
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
                  $('input[name="infant_passport_expired_date'+i+'"]').val("");
              }
          });
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
        error_ajax(XMLHttpRequest, textStatus, errorThrown, '');
       }
    });
}

function get_train_data_review_page(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/train",
       headers:{
            'action': 'get_train_data_review_page',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
        train_data = msg.response;
        passengers = msg.passengers;
        passenger_with_booker = msg.passengers;
        train_request = msg.train_request;
        upsell_price_dict = msg.upsell_price_dict
        train_detail();
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
        error_ajax(XMLHttpRequest, textStatus, errorThrown, '');
       }
    });
}

function train_signin(data, type=''){
    if(typeof(frontend_signature) === 'undefined')
        frontend_signature = '';
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
        "timezone": timezone,
        "frontend_signature": frontend_signature
    }
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/train",
       headers:{
            'action': 'signin',
       },
       data: data_send,
       success: function(msg) {
            if(msg.result.error_code == 0){
                signature = msg.result.response.signature;
                get_agent_currency_rate();
                get_carriers_train();
                if(data == '')
                    train_get_config_provider(signature);
                else if(data != '' && type == 'reorder')
                    search_reorder(data);
                else if(data != '')
                    train_get_booking(data);
            }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
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
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error train singin');
            hide_modal_waiting_transaction();
       },timeout: 60000
    });
}

function get_train_config(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/train",
       headers:{
            'action': 'get_data',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
        new_train_destination = [];
        for(i in msg){
            new_train_destination.push(msg[i].code+' - '+ msg[i].name+` - `+msg[i].city+` - `+msg[i].country);
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
        error_ajax(XMLHttpRequest, textStatus, errorThrown, '');
       }
    });
}

function get_carriers_train(){
    $.ajax({
       type: "POST",
       url: "/webservice/train",
       headers:{
            'action': 'get_carriers',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
           train_carriers = msg;
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {

       },timeout: 60000
    });
}

function train_get_config_provider(signature,type=''){
    $.ajax({
       type: "POST",
       url: "/webservice/train",
       headers:{
            'action': 'get_config_provider',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
            counter_train_provider = 0;
            counter_train_search = 0;
            if(google_analytics != '')
                gtag('event', 'train_search', {});
            if(msg.result.error_code == 0){
                provider_length = Object.keys(msg.result.response).length;
                provider_train = msg.result.response;
                if(type == ''){
                    send_request_search();
                }else if(type == 'reorder'){
                    counter_train_search = 0;
                    search_train_func('reorder')
                }
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
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error train get  config provider');
       },timeout: 60000
    });
}

function send_request_search(){
    counter_train_provider = 0;
    document.getElementById('loading-search-train').hidden = false
    text = '';
    if(train_request.direction == 'OW')
        text = train_request.departure[0];
    else
        text = train_request.departure[0] + ' - ' + train_request.departure[1];

    pax = train_request.adult + ' Adult';
    pax += ', ' + train_request.infant + ' Infant';

    if(train_request.direction == 'OW')
        document.getElementById('show_origin_destination').innerHTML = `<span title="`+train_request.origin[0]+` > `+train_request.destination[0]+`"><span class="copy_span"> `+train_request.origin[0].split(' - ')[1] + ` (`+train_request.origin[0].split(' - ')[0]+`) </span><i class="fas fa-arrow-right"></i><span class="copy_span"> `+train_request.destination[0].split(' - ')[1]+` (`+train_request.destination[0].split(' - ')[0]+`)</span></span>`;
    else
        document.getElementById('show_origin_destination').innerHTML = `<span title="`+train_request.origin[0]+` > `+train_request.destination[0]+`"><span class="copy_span"> `+train_request.origin[0].split(' - ')[1] + ` (`+train_request.origin[0].split(' - ')[0]+`) </span><i class="fas fa-arrows-alt-h"></i><span class="copy_span"> `+train_request.destination[0].split(' - ')[1]+` (`+train_request.destination[0].split(' - ')[0]+`)</span></span>`;
    document.getElementById('show_date').innerHTML = `<i class="fas fa-calendar-alt"></i> <span class="copy_span" style="text-transform: capitalize; font-size:13px;">`+text+` </span>`;

    document.getElementById('train_div_box_choose').innerHTML = `
    <span style="font-size:14px; font-weight:bold;">
        <img style="width:auto; height:25px; border-radius:7px; background:white;" src="/static/tt_website/images/icon/product/c-train.png" alt="Train Icon">
        Departure |
        `+train_request.origin[0].split(' - ')[1] + ` (`+train_request.origin[0].split(' - ')[0]+`) <i class="fas fa-arrow-right"></i> `+train_request.destination[0].split(' - ')[1]+` (`+train_request.destination[0].split(' - ')[0]+`) | `+train_request.departure[0]+`
    </span>`;

    change_date_next_prev(train_request_pick);
    search_train_func('');
}

function search_train_func(type=''){
    for(i in provider_train){
        train_search(provider_train[i].provider, signature,type);
    }
}

//signin jadi 1 sama search
function train_search(provider, signature, type){
    if(type != 'reorder'){
        document.getElementById('train_ticket').innerHTML = ``;
        document.getElementById('train_detail').innerHTML = ``;
    }
    $.ajax({
       type: "POST",
       url: "/webservice/train",
       headers:{
            'action': 'search',
       },
       data: {
            'signature': signature,
            'search_request': JSON.stringify(train_request),
            'provider': provider
       },
       success: function(msg) {
           counter_train_search++;
           try{
                if(msg.result.error_code==0){
                    counter_train_provider++;
                    if(type != 'reorder'){
                        datasearch2(msg.result.response)
                    }else{
                        //re order
                        for(i in msg.result.response.schedules){
                            train_data_reorder = train_data_reorder.concat(msg.result.response.schedules[i].journeys);
                        }
                        re_order_check_search();
                    }
                }else{
                    if(counter_train_search == provider_length && train_data.length == 0){
                        if(type != 'reorder'){
                            loadingTrain();
                            var response = '';
                            response +=`
                                <div style="padding:5px; margin:10px;">
                                    <div style="text-align:center">
                                        <img src="/static/tt_website/images/no_found/no-train.png" style="width:80px; height:80px;" alt="Not Found Train" title="" />
                                        <br/><br/>
                                        <h6>NO TRAIN AVAILABLE</h6>
                                    </div>
                                </div>
                            `;
                            document.getElementById('train_ticket').innerHTML = response;

                            document.getElementById('train_result').innerHTML = '';
                            document.getElementById("train_ticket_loading").innerHTML = '';

                            Swal.fire({
                              type: 'error',
                              title: 'Oops!',
                              html: '<span style="color: red;">Error train search </span>' + errorThrown,
                            })
                        }else{
                            Swal.fire({
                              type: 'error',
                              title: 'Oops!',
                              html: '<span style="color: red;">Error Train not found </span>' + errorThrown,
                            })
                            console.log('reorder here');
                        }
                    }
               }
           }catch(err){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error train search </span>' + msg.result.error_msg,
                })
                if(type == 'reorder')
                    location.reload();
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error train search');
            if(type != 'reorder'){
                counter_train_search++;
                if(counter_train_search == provider_length){
                    if(train_data.length == 0){
                        loadingTrain();
                        var response = '';
                        response +=`
                            <div style="padding:5px; margin:10px;">
                                <div style="text-align:center">
                                    <img src="/static/tt_website/images/no_found/no-train.png" style="width:80px; height:80px;" alt="Not Found Train" title="" />
                                    <br/><br/>
                                    <h6>NO TRAIN AVAILABLE</h6>
                                </div>
                            </div>
                        `;
                        document.getElementById('train_ticket').innerHTML = response;

                        document.getElementById('train_result').innerHTML = '';
                        document.getElementById("train_ticket_loading").innerHTML = '';

                        Swal.fire({
                          type: 'error',
                          title: 'Oops!',
                          html: '<span style="color: red;">Error train search </span>' + errorThrown,
                        })
                    }
                }
            }
       },timeout: 300000
    });
}

function check_elapse_time_three_hours(departure){
  today = moment();
  dep = moment(departure);
  var diff = dep.diff(today, 'hours');
  if(diff >= 3)
    return true;
  else
    return false;
}

function datasearch2(train){
    var counter = train_data.length;
    data = [];
    data = train_data;
    for(i in train.schedules){
        for(j in train.schedules[i].journeys){
           train.schedules[i].journeys[j].sequence = counter;
           train.schedules[i].journeys[j].train_sequence = i;
           price = 0;
           currency = '';
           if(train.schedules[i].journeys[j].cabin_class == 'E')
                train.schedules[i].journeys[j].cabin_class = ['E', 'Executive']
           else if(train.schedules[i].journeys[j].cabin_class == 'K')
                train.schedules[i].journeys[j].cabin_class = ['K', 'Economy']
           else if(train.schedules[i].journeys[j].cabin_class == 'B')
                train.schedules[i].journeys[j].cabin_class = ['B', 'Business']
           date = moment(train.schedules[i].journeys[j].departure_date,'DD MMM YYYY - HH:mm').format('YYYY-MM-DD HH:mm');
           train.schedules[i].journeys[j].can_book_three_hours = check_elapse_time_three_hours(date);
           train.schedules[i].journeys[j].can_book_check_arrival_on_next_departure = true;
           train.schedules[i].journeys[j].departure_date = train.schedules[i].journeys[j].departure_date.split(' - ');
           train.schedules[i].journeys[j].arrival_date = train.schedules[i].journeys[j].arrival_date.split(' - ');
           for(k in train.schedules[i].journeys[j].fares){
                for(l in train.schedules[i].journeys[j].fares[k].service_charge_summary){
                    train.schedules[i].journeys[j].price = 0;
                    train.schedules[i].journeys[j].without_discount_price = 0;
                    for(m in train.schedules[i].journeys[j].fares[k].service_charge_summary[l].service_charges){
                        if(train.schedules[i].journeys[j].fares[k].service_charge_summary[l].service_charges[m].charge_code != 'rac'){
                            if(train.schedules[i].journeys[j].hasOwnProperty('currency') == false)
                                train.schedules[i].journeys[j].currency = train.schedules[i].journeys[j].fares[k].service_charge_summary[l].service_charges[m].currency;
                            if(train.schedules[i].journeys[j].fares[k].service_charge_summary[l].service_charges[m].charge_code != 'disc'){
                                train.schedules[i].journeys[j].without_discount_price += train.schedules[i].journeys[j].fares[k].service_charge_summary[l].service_charges[m].amount;
                            }
                            train.schedules[i].journeys[j].price += train.schedules[i].journeys[j].fares[k].service_charge_summary[l].service_charges[m].amount;
                        }
                    }
                    break;
                }
                break;
           }
           data.push(train.schedules[i].journeys[j]);
           counter++;
       }
    }
    train_data = data;
    filtering('filter');
}


function train_pre_create_booking(val){
    Swal.fire({
      title: 'Are you sure want to Hold Booking?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        $('.hold-seat-booking-train').addClass("running");
        $('.hold-seat-booking-train').attr("disabled", true);
        please_wait_transaction();
        if(val == 0){
            document.getElementById("passengers").value = JSON.stringify(passenger_with_booker);
            document.getElementById("signature").value = signature;
            document.getElementById("provider").value = 'train';
            document.getElementById("type").value = 'train';
            document.getElementById("voucher_code").value = voucher_code;
            document.getElementById("discount").value = JSON.stringify(discount_voucher);
            document.getElementById("session_time_input").value = time_limit;
            train_create_booking(val);
        }else{
            document.getElementById("passengers").value = JSON.stringify(passengers);
            document.getElementById("signature").value = signature;
            document.getElementById("provider").value = 'train';
            document.getElementById("type").value = 'train_review';
            document.getElementById("voucher_code").value = voucher_code;
            document.getElementById("discount").value = JSON.stringify(discount_voucher);
            document.getElementById("session_time_input").value = time_limit;
            document.getElementById('train_issued').submit();
        }
      }
    })
}

function force_issued_train(val){
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
        train_create_booking(val);
      }
    })
}

function train_create_booking(val, type=''){
    var formData = new FormData($('#global_payment_form').get(0));
    formData.append('value', val);
    formData.append('signature', signature);
    try{
        formData.append('acquirer_seq_id', payment_acq2[payment_method][selected].acquirer_seq_id);
        formData.append('member', payment_acq2[payment_method][selected].method);
        if (document.getElementById('is_attach_pay_ref') && document.getElementById('is_attach_pay_ref').checked == true)
        {
            formData.append('payment_reference', document.getElementById('pay_ref_text').value);
        }
    }catch(err){
    }
    try{
        formData.append('voucher_code', voucher_code);
    }catch(err){
        console.log(err); // error kalau ada element yg tidak ada
    }

    var error_log = '';
    if(document.getElementById('pin')){
        if(document.getElementById('pin').value)
            formData.append('pin', document.getElementById('pin').value);
        else
            error_log = 'Please input PIN!';
    }
    if(error_log){
        Swal.fire({
            type: 'error',
            title: 'Oops!',
            html: error_log,
        })
        $('.hold-seat-booking-train').removeClass("running");
        $('.hold-seat-booking-train').attr("disabled", false);
        setTimeout(function(){
            hide_modal_waiting_transaction();
        }, 500);
    }else{
        $.ajax({
            type: "POST",
            url: "/webservice/train",
            headers:{
                'action': 'commit_booking',
            },
            data: formData,
            success: function(msg) {
                if(google_analytics != ''){
                    if(formData.get('member'))
                        gtag('event', 'train_issued', {});
                    else
                        gtag('event', 'train_hold_booking', {});
                }
                if(msg.result.error_code == 0){
                    //send order number
                    if(type == ''){
                        //order biasa
                        if(msg.result.response.state == 'booked'){
                            if(val == 0){
                                $('.hold-seat-booking-train').removeClass("running");
                                $('.hold-seat-booking-train').attr("disabled", false);
                                if(user_login.co_agent_frontend_security.includes('b2c_limitation') == true){
                                    document.getElementById("order_number").value = msg.result.response.order_number;
                                    train_get_detail = msg;
                                    set_seat_map();
            //                        send_url_booking('train', btoa(msg.result.response.order_number), msg.result.response.order_number);
            //                        document.getElementById('order_number').value = msg.result.response.order_number;
            //                        document.getElementById('train_issued').submit();
                                }else{
                                    document.getElementById('train_booking').innerHTML+= '<input type="hidden" name="order_number" value='+msg.result.response.order_number+'>';
                                    document.getElementById('train_booking').action = '/train/booking/' + btoa(msg.result.response.order_number);
                                    document.getElementById('train_booking').submit();
                                }
                            }else{
                                if(user_login.co_agent_frontend_security.includes('b2c_limitation') == true)
                                    send_url_booking('train', btoa(msg.result.response.order_number), msg.result.response.order_number);
                                document.getElementById('order_number').value = msg.result.response.order_number;
                                document.getElementById('issued').action = '/train/booking/' + btoa(msg.result.response.order_number);
                                document.getElementById('issued').submit();
                            }
                        }else{
                            document.getElementById('train_booking').innerHTML+= '<input type="hidden" name="order_number" value='+msg.result.response.order_number+'>';
                            document.getElementById('train_booking').action = '/train/booking/' + btoa(msg.result.response.order_number);
                            document.getElementById('train_booking').submit();
                        }
                    }else if(type == 'reorder'){
                        //buat re order
                        document.getElementById('train_booking_form').innerHTML+= '<input type="hidden" name="order_number" value='+msg.result.response.order_number+'>';
                        document.getElementById('train_booking_form').action = '/train/booking/' + btoa(msg.result.response.order_number);
                        document.getElementById('train_booking_form').submit();
                    }
                }else{
                    Swal.fire({
                        type: 'error',
                        title: 'Oops!',
                        html: '<span style="color: #ff9900;">Error train create booking </span>' + msg.result.error_msg,
                    }).then((result) => {
                        if (result.value) {
                            hide_modal_waiting_transaction();
                        }
                    })
                    $('.hold-seat-booking-train').removeClass("running");
                    $('.hold-seat-booking-train').attr("disabled", false);
                    hide_modal_waiting_transaction();
                    if(type == 'reorder')
                        location.reload();
                }
            },
            contentType:false,
            processData:false,
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error train create booking');
                hide_modal_waiting_transaction();
                $('.hold-seat-booking-train').removeClass("running");
                $('.hold-seat-booking-train').attr("disabled", false);
            },timeout: 480000
        });
    }
}

function train_get_booking(data){
    price_arr_repricing = {};
    get_vendor_balance('false');
    document.getElementById('cancel').hidden = true;
    document.getElementById('cancel').innerHTML = '';
    $.ajax({
       type: "POST",
       url: "/webservice/train",
       headers:{
            'action': 'get_booking',
       },
       data: {
            'order_number': data,
            'signature': signature
       },
       success: function(msg) {
        try{
            document.getElementById('button-home').hidden = false;
            document.getElementById('button-new-reservation').hidden = false;
            var give_space = false;
            if(msg.result.error_code == 0){
                train_get_detail = msg;
                price_arr_repricing = {};
                pax_type_repricing = [];
                can_issued = msg.result.response.can_issued;
                document.getElementById('button_new_offline').hidden = false;
                document.getElementById('booking_data_product').value = JSON.stringify(msg);
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

                //rebooking
                if(msg.result.response.hasOwnProperty('rebooking') && msg.result.response.rebooking){
                    document.getElementById('reorder_div').innerHTML = `
                    <button type="button" id="button-re-order" class="primary-btn-white mr-1" onclick="create_new_reservation();" data-toggle="modal" data-target="#myModalReOrder">
                        <i class="fas fa-train"></i> Re Order
                    </button>`;
                }

                try{
                    if(msg.result.response.state == 'booked' || msg.result.response.state == 'issued' && msg.result.response.voucher_reference)
                        document.getElementById('voucher_discount').style.display = 'block';
                    else
                        document.getElementById('voucher_discount').style.display = 'none';
                }catch(err){console.log(err);}
                if(msg.result.response.state != 'issued' && msg.result.response.state != 'fail_booked'  && msg.result.response.state != 'fail_issued' && msg.result.response.state != 'cancel' && msg.result.response.state != 'cancel2'){
                    try{
                        if(can_issued){
                            check_payment_payment_method(msg.result.response.order_number, 'Issued', msg.result.response.booker.seq_id, 'billing', 'train', signature, msg.result.response.payment_acquirer_number, msg);
        //                    get_payment_acq('Issued',msg.result.response.booker.seq_id, msg.result.response.order_number, 'billing',signature,'train');
                            document.getElementById('voucher_discount').style.display = 'block';
                        }
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
                <div class="mb-3" id="airline_booking_order_number">
                    <div class="div_box_default">
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="row">
                                    <div class="col-lg-12">
                                        <h4 style="margin-bottom:15px;">
                                            <i class="fas fa-scroll"></i> Order Number: `+msg.result.response.order_number+`
                                        </h4>
                                    </div>
                                    <div class="col-lg-12 mb-3">
                                        <table class="list-of-table" style="width:100%; background:white;">
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
                                                if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false || msg.result.response.state == 'issued')
                                                    $text += msg.result.response.provider_bookings[i].pnr;
                                                else
                                                    $text += '-';
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
                                                    text+=`<td>`+msg.result.response.hold_date+`</td>`;
                                                text+=`
                                                    <td id='pnr'>`;
                                                if(msg.result.response.provider_bookings[i].state_description == 'Expired' ||
                                                    msg.result.response.provider_bookings[i].state_description == 'Booking Failed' ||
                                                    msg.result.response.provider_bookings[i].state_description == 'Cancelled'){
                                                    text+=`<span style="background:#DC143C; color:white; padding:0px 15px; border-radius:14px;">`;
                                                }
                                                else if(msg.result.response.provider_bookings[i].state_description == 'Booked'){
                                                    text+=`<span style="background:#3fa1e8; color:white; padding:0px 15px; border-radius:14px;">`;
                                                }
                                                else if(msg.result.response.provider_bookings[i].state_description == 'Issued'){
                                                    text+=`<span style="background:#30b330; color:white; padding:0px 15px; border-radius:14px;">`;
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
                                        text+=`
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="row">
                                    <div class="col-lg-12">
                                        <div class="row">`;
                                            if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false){
                                                text+=`
                                                <div class="col-lg-6">
                                                    <b>Agent: </b><i>`+msg.result.response.agent_name+`</i>
                                                </div>`;
                                                if(msg.result.response.customer_parent_name){
                                                    text+=`
                                                    <div class="col-lg-6">
                                                        <span>Customer: <b>`+msg.result.response.customer_parent_type_name+` `+msg.result.response.customer_parent_name+`</b></span>
                                                    </div>`;
                                                }
                                            }
                                            text+=`
                                        </div>
                                    </div>
                                    <div class="col-lg-12">
                                        <div class="row">
                                            <div class="col-lg-6">
                                                <span>
                                                    <b>Booked by: </b><i>`+msg.result.response.booked_by+`</i>
                                                </span>
                                            </div>
                                            <div class="col-lg-6">
                                                <span>
                                                    <b>Booked Date: </b>
                                                    <i>`;
                                                    if(msg.result.response.booked_date != ""){
                                                        text+=``+msg.result.response.booked_date+``;
                                                    }else{
                                                        text+=`-`
                                                    }
                                                    text+=`</i>
                                                </span><br>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-12">
                                        <div class="row">
                                            <div class="col-lg-6">
                                                <span>
                                                    <b>Issued by: </b><i>`+msg.result.response.issued_by+`</i>
                                                </span>
                                            </div>
                                            <div class="col-lg-6">
                                                <span>
                                                    <b>Issued Date: </b>
                                                    <i>`;
                                                    if(msg.result.response.issued_date != ""){
                                                        text+=``+msg.result.response.issued_date+``;
                                                    }else{
                                                        text+=`-`
                                                    }
                                                    text+=`</i>
                                                </span><br>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="div_box_default mb-3">
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="row">
                                <div class="col-lg-12 mb-3" style="border-bottom: 1px solid #cdcdcd;">
                                    <h4 class="mb-3"><img src="/static/tt_website/images/icon/product/b-train.png" alt="`+data[i].provider_type+`" style="width:20px; height:20px;"> Train Detail</h4>
                                </div>
                            </div>`;
                            check = 0;
                            flight_counter = 1;
                            for(i in msg.result.response.provider_bookings){
                                for(j in msg.result.response.provider_bookings[i].journeys){
                                    if(msg.result.response.provider_bookings[i].journeys[j].cabin_class == 'E')
                                        msg.result.response.provider_bookings[i].journeys[j].cabin_class = ['E', 'Executive']
                                    else if(msg.result.response.provider_bookings[i].journeys[j].cabin_class == 'K')
                                        msg.result.response.provider_bookings[i].journeys[j].cabin_class = ['K', 'Economy']
                                    else if(msg.result.response.provider_bookings[i].journeys[j].cabin_class == 'B')
                                        msg.result.response.provider_bookings[i].journeys[j].cabin_class = ['B', 'Business']

                                    if(i != 0){
                                        text+=`<div class="col-lg-12 mb-3 mt-3" style="border-top:1px solid #cdcdcd; padding:0px;"></div>`;
                                    }

                                    text+=`<h5 style="width: fit-content; border-bottom:2px solid #cdcdcd;">`;
                                    if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false || msg.result.response.state == 'issued')
                                        text += msg.result.response.provider_bookings[i].journeys[j].pnr;
                                    else
                                        text += `-`;
                                    text+=`</h5>`;
                                    text+=`<h6>Journey `+flight_counter+`</h6>`;
                                    $text += 'Journey '+ flight_counter+'\n';
                                    flight_counter++;

                                    if(msg.result.response.provider_bookings[i].journeys[j].hasOwnProperty('search_banner')){
                                       for(banner_counter in msg.result.response.provider_bookings[i].journeys[j].search_banner){
                                           var max_banner_date = moment().subtract(parseInt(-1*msg.result.response.provider_bookings[i].journeys[j].search_banner[banner_counter].minimum_days), 'days').format('YYYY-MM-DD');
                                           var selected_banner_date = moment(msg.result.response.provider_bookings[i].journeys[j].departure_date.split(' -')[0]).format('YYYY-MM-DD');
                                           if(selected_banner_date >= max_banner_date){
                                               if(msg.result.response.provider_bookings[i].journeys[j].search_banner[banner_counter].active == true){
                                                   text+=`<label id="pop_search_banner`+i+``+j+``+banner_counter+`" style="background:`+msg.result.response.provider_bookings[i].journeys[j].search_banner[banner_counter].banner_color+`; color:`+text_color+`;padding:5px 10px;">`+msg.result.response.provider_bookings[i].journeys[j].search_banner[banner_counter].name+`</label>`;
                                               }
                                           }
                                       }
                                    }

                                    if(msg.result.response.provider_bookings[i].journeys[j].hasOwnProperty('search_banner')){
                                       for(banner_counter in msg.result.response.provider_bookings[i].journeys[j].search_banner){
                                           var max_banner_date = moment().subtract(parseInt(-1*msg.result.response.provider_bookings[i].journeys[j].search_banner[banner_counter].minimum_days), 'days').format('YYYY-MM-DD');
                                           var selected_banner_date = moment(msg.result.response.provider_bookings[i].journeys[j].departure_date.split('  ')[0]).format('YYYY-MM-DD');

                                           if(selected_banner_date <= max_banner_date){
                                               if(msg.result.response.provider_bookings[i].journeys[j].search_banner[banner_counter].active == true){
                                                   text+=`<label style="background:`+msg.result.response.provider_bookings[i].journeys[j].search_banner[banner_counter].banner_color+`; color:`+text_color+`;padding:5px 10px;">`+msg.result.response.provider_bookings[i].journeys[j].search_banner[banner_counter].name+`</label>`;
                                               }
                                           }
                                       }
                                    }
                                    //yang baru harus diganti

                                    $text += msg.result.response.provider_bookings[i].journeys[j].carrier_name+'\n';
                                    $text += msg.result.response.provider_bookings[i].journeys[j].departure_date + ' - ';
                                    if(msg.result.response.provider_bookings[i].journeys[j].departure_date.split(' - ')[0] == msg.result.response.provider_bookings[i].journeys[j].arrival_date.split(' - ')[0])
                                        $text += msg.result.response.provider_bookings[i].journeys[j].arrival_date.split(' - ')[1] + '\n';
                                    else
                                        $text += msg.result.response.provider_bookings[i].journeys[j].arrival_date + '\n';
                                    $text += msg.result.response.provider_bookings[i].journeys[j].origin_name +' ('+msg.result.response.provider_bookings[i].journeys[j].origin+') - '+msg.result.response.provider_bookings[i].journeys[j].destination_name +' ('+msg.result.response.provider_bookings[i].journeys[j].destination+')\n';
                                    $text += 'Seats:\n'
                                    for(k in msg.result.response.provider_bookings[i].journeys[j].seats){
                                        $text += msg.result.response.provider_bookings[i].journeys[j].seats[k].passenger + ', ' + msg.result.response.provider_bookings[i].journeys[j].seats[k].seat.split(',')[0] + ' ' + msg.result.response.provider_bookings[i].journeys[j].seats[k].seat.split(',')[1]+'\n';
                                    }
                                    $text += '\n';
                                    text+= `
                                    <div class="row">
                                        <div class="col-lg-5 col-md-4">
                                            <div style="display:inline-flex;">
                                                <div style="display:inline-block;">
                                                    <img data-toggle="tooltip" title="KAI" class="train_provider_img" src="/static/tt_website/images/logo/product/kai_logo.png" alt="KAI">
                                                </div>
                                                <div style="display:inline-block;">
                                                    <span style="margin-top:15px; font-size:13px; font-weight:bold;">`+msg.result.response.provider_bookings[i].journeys[j].carrier_name+' '+msg.result.response.provider_bookings[i].journeys[j].carrier_number+`</span><br>
                                                    <span style="margin-top:15px; font-size:13px; font-weight:500;">
                                                        `+msg.result.response.provider_bookings[i].journeys[j].cabin_class[1];
                                                        if(msg.result.response.provider_bookings[i].journeys[j].class_of_service != '')
                                                            text+=` (`+msg.result.response.provider_bookings[i].journeys[j].class_of_service+`)`;
                                                    text+=`
                                                    </span><br>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-7 col-md-8">
                                            <div class="row" style="padding-top:10px;">
                                                <div class="col-lg-6 col-xs-6">
                                                    <h6>`+msg.result.response.provider_bookings[i].journeys[j].departure_date.split(' - ')[1]+`</h6>
                                                    <span>`+msg.result.response.provider_bookings[i].journeys[j].departure_date.split(' - ')[0]+`</span><br>
                                                    <span style="font-weight:500;">`+msg.result.response.provider_bookings[i].journeys[j].origin_name+` (`+msg.result.response.provider_bookings[i].journeys[j].origin+`)</span><br>
                                                </div>

                                                <div class="col-lg-6 col-xs-6">
                                                    <div style="text-align:center; position: absolute; left:-20%;">
                                                        <div style="display:inline-block;position:relative;width:100%;z-index:1;">
                                                            <img src="/static/tt_website/images/icon/symbol/train-01.png" alt="Train" style="width:20px; height:20px; margin-top:5px; position:relative; z-index:99;">
                                                            <div class="show_pc" style="height:2px;position:absolute;top:16px;width:100%;background-color:#d4d4d4;"></div>
                                                            <div class="show_pc origin-code-snippet" style="background-color:#d4d4d4;right:0px"></div>
                                                        </div>
                                                        <span style="font-weight:500;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                                    </div>
                                                    <div style="text-align:right">
                                                        <h6>`+msg.result.response.provider_bookings[i].journeys[j].arrival_date.split(' - ')[1]+`</h6>
                                                        <span>`+msg.result.response.provider_bookings[i].journeys[j].arrival_date.split(' - ')[0]+`</span><br>
                                                        <span style="font-weight:500;">`+msg.result.response.provider_bookings[i].journeys[j].destination_name+` (`+msg.result.response.provider_bookings[i].journeys[j].destination+`)</span><br>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;
                                }
                            }
                            text+=`
                        </div>
                    </div>
                </div>`;

                if(msg.result.response.booker.gender == 'female' && msg.result.response.booker.marital_status == "married")
                    title = 'MRS';
                else if(msg.result.response.booker.gender == 'female')
                    title = 'MS'
                else
                    title = 'MR';

                text+=`

                <div class="row mb-3">
                    <div class="col-lg-6">
                        <div class="div_box_default">
                            <div class="row">
                                <div class="col-lg-12 mb-3" style="border-bottom: 1px solid #cdcdcd;">
                                    <h4 class="mb-3"><i class="fas fa-user"></i> Booker</h4>
                                </div>
                            </div>
                            <div style="display:inline-flex;">
                                <div>`;
                                    if(title == "MR"){
                                        text+=`<img src="/static/tt_website/images/icon/symbol/user_mr.png" alt="User MR" class="picture_passenger_small">`;
                                    }
                                    else if(title == "MRS"){
                                        text+=`<img src="/static/tt_website/images/icon/symbol/user_mrs.png" alt="User MRS" class="picture_passenger_small">`;
                                    }
                                    else if(title == "MS"){
                                        text+=`<img src="/static/tt_website/images/icon/symbol/user_ms.png" alt="User MS" class="picture_passenger_small">`;
                                    }
                                    else if(title == "MSTR"){
                                        text+=`<img src="/static/tt_website/images/icon/symbol/user_mistr.png" alt="User MSTR" class="picture_passenger_small">`;
                                    }
                                    else if(title == "MISS"){
                                        text+=`<img src="/static/tt_website/images/icon/symbol/user_miss.png" alt="User MISS" class="picture_passenger_small">`;
                                    }
                                    text+=`
                                </div>
                                <div style="margin-left:10px;">
                                    <h5>
                                        `+title+` `+msg.result.response.booker.name+`
                                    </h5>
                                    <b>Email: </b><i>`+msg.result.response.booker.email+`</i><br><b>Phone: </b><i>`+msg.result.response.booker.phone+`</i><br>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="div_box_default">
                            <div class="row">
                                <div class="col-lg-12 mb-3" style="border-bottom: 1px solid #cdcdcd;">
                                    <h4 class="mb-3"><i class="fas fa-address-book"></i> Contact Person</h4>
                                </div>
                            </div>
                            <div style="display:inline-flex;">
                                <div>`;
                                    if(msg.result.response.contact.title == "MR"){
                                        text+=`<img src="/static/tt_website/images/icon/symbol/user_mr.png" alt="User MR" class="picture_passenger_small">`;
                                    }
                                    else if(msg.result.response.contact.title == "MRS"){
                                        text+=`<img src="/static/tt_website/images/icon/symbol/user_mrs.png" alt="User MRS" class="picture_passenger_small">`;
                                    }
                                    else if(msg.result.response.contact.title == "MS"){
                                        text+=`<img src="/static/tt_website/images/icon/symbol/user_ms.png" alt="User MS" class="picture_passenger_small">`;
                                    }
                                    else if(msg.result.response.contact.title == "MSTR"){
                                        text+=`<img src="/static/tt_website/images/icon/symbol/user_mistr.png" alt="User MSTR" class="picture_passenger_small">`;
                                    }
                                    else if(msg.result.response.contact.title == "MISS"){
                                        text+=`<img src="/static/tt_website/images/icon/symbol/user_miss.png" alt="User MISS" class="picture_passenger_small">`;
                                    }
                                    text+=`
                                </div>
                                <div style="margin-left:10px;">
                                    <h5>
                                        `+msg.result.response.contact.title+` `+msg.result.response.contact.name+`
                                    </h5>
                                    <b>Email: </b><i>`+msg.result.response.contact.email+`</i><br><b>Phone: </b><i>`+msg.result.response.contact.phone+`</i><br>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;

                //SSR
                text+=`
                <div class="row">
                    <div class="col-lg-12">
                        <div class="div_box_default mb-3" style="padding: 15px 15px 0px 15px;">
                            <div class="row">
                                <div class="col-lg-12">
                                    <h4 style="margin-bottom:10px;">
                                        <i class="fas fa-users"></i>
                                        Passengers
                                    </h4>`;
                                    text+=`
                                </div>
                            </div>
                            <div class="row">`;
                                for(pax in msg.result.response.passengers){
                                    ticket = [];
                                    give_space = false;
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
                                    text+=`
                                    <div class="col-lg-12" style="border-top:1px solid #cdcdcd;">
                                        <div class="row">
                                            <div class="col-lg-12" style="background: aliceblue;">
                                                <h5 id="passenger_number0" style="padding-top:10px;">
                                                    Passenger #`+(parseInt(pax)+1)+`
                                                </h5>
                                                <div style="display:inline-flex; margin-top:10px; margin-bottom:10px;">
                                                    <div>`;
                    //                                if(passengers_ssr[i].face_image.length > 0){
                    //                                    text+=`<img src="`+passengers_ssr[i].face_image[0]+`" alt="User" class="picture_passenger_agent">`;
                    //                                }
                                                        if(msg.result.response.passengers[pax].title == "MR"){
                                                            text+=`<img src="/static/tt_website/images/icon/symbol/user_mr.png" alt="User MR" class="picture_passenger_small">`;
                                                        }
                                                        else if(msg.result.response.passengers[pax].title == "MRS"){
                                                            text+=`<img src="/static/tt_website/images/icon/symbol/user_mrs.png" alt="User MRS" class="picture_passenger_small">`;
                                                        }
                                                        else if(msg.result.response.passengers[pax].title == "MS"){
                                                            text+=`<img src="/static/tt_website/images/icon/symbol/user_ms.png" alt="User MS" class="picture_passenger_small">`;
                                                        }
                                                        else if(msg.result.response.passengers[pax].title == "MSTR"){
                                                            text+=`<img src="/static/tt_website/images/icon/symbol/user_mistr.png" alt="User MSTR" class="picture_passenger_small">`;
                                                        }
                                                        else if(msg.result.response.passengers[pax].title == "MISS"){
                                                            text+=`<img src="/static/tt_website/images/icon/symbol/user_miss.png" alt="User MISS" class="picture_passenger_small">`;
                                                        }
                                                    text+=`
                                                    </div>
                                                    <div style="margin-left:10px;">
                                                        <h5>
                                                            `+msg.result.response.passengers[pax].title+` `+msg.result.response.passengers[pax].first_name+` `+msg.result.response.passengers[pax].last_name+`
                                                            <b style="margin-left:5px; background:white; font-size:13px; color:black; padding:0px 10px; display:unset; border: 1px solid #cdcdcd; border-radius:5px;">`;
                                                            if(msg.result.response.passengers[pax].pax_type == 'ADT'){
                                                                 text+=` Adult`;
                                                            }
                                                            else if(msg.result.response.passengers[pax].pax_type == 'INF'){
                                                                 text+=` Infant`;
                                                            }
                                                            text+=`
                                                            </b>
                                                        </h5>
                                                        <b>Birth Date:</b> <i>`+msg.result.response.passengers[pax].birth_date+`</i><br/>
                                                        <b>`+msg.result.response.passengers[pax].identity_type.charAt(0).toUpperCase()+msg.result.response.passengers[pax].identity_type.slice(1).toLowerCase()+`:</b> <i>`+msg.result.response.passengers[pax].identity_number+`</i><br/>
                                                        <b>Status:</b> <i>`;
                                                        if(msg.result.response.passengers[pax].hasOwnProperty('temporary_field')){
                                                            for(j in msg.result.response.passengers[pax].temporary_field){
                                                                for(k in msg.result.response.passengers[pax].temporary_field[j]){
                                                                    if(give_space)
                                                                        text += `<br/>`;
                                                                    if(give_space == false)
                                                                        give_space = true;
                                                                    text += `<span>`+k+` </span>`;
                                                                    if(msg.result.response.passengers[pax].temporary_field[j][k])
                                                                        text += `<i class="fas fa-check-square" style="color:blue"></i>`;
                                                                    else
                                                                        text += `<i class="fas fa-times" style="color:blue"></i>`;

                                                                }
                                                            }
                                                        }
                                                        text+=`
                                                        </i>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-12" style="padding:15px;">
                                                <h5 class="mb-3" style="border-bottom: 2px solid #cdcdcd; width:fit-content;">Seat</h5>
                                                <div>`;
                                                for(i in ticket){
                                                    text+=`
                                                    <div class="row">
                                                       <div class="col-xs-12">`;
                                                        if(ticket[i].seat.split(',').length == 2){
                                                            text += `
                                                            <h6 style="margin-bottom:10px;">`+ticket[i].journey+`</h6>
                                                            <div style="padding:0px 15px;">
                                                                <div class="row">
                                                                   <div class="col-xs-12 mb-3">• <b style="background: white; padding: 5px; margin-right:5px;">`+ticket[i].seat.split(',')[0] + ' ' + ticket[i].seat.split(',')[1] +`</b>
                                                                   </div>
                                                               </div>
                                                           </div>`;
                                                        }
                                                        text+=`
                                                        </div>
                                                    </div>`;
                                                }
                                                text+=`
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;
                                }
                                text+=`
                            </div>`;
                            text+=`
                        </div>`;
                        if(msg.result.response.state != 'cancel' && msg.result.response.state != 'cancel2'){
                            if (msg.result.response.state == 'booked'){
                                text+=`
                                <div class="div_box_default" style="margin-bottom:15px; padding: 15px 15px 0px 15px">
                                    <div class="row">
                                        <div class="col-lg-12 mb-3" style="border-bottom:1px solid #cdcdcd;">
                                            <h4 class="mb-3">Request</h4>
                                        </div>
                                        <div class="col-lg-6 col-md-6 mb-3">
                                            <form method="post" id="seat_map_request" action='/train/seat_map/`+signature+`'>
                                                <button class="btn-next primary-btn-white-cl" type="button" onclick="set_seat_map();" style="width:100%; margin-bottom:unset; text-align:left;">
                                                    Seat Map
                                                </button>
                                                <input id='passenger_input' name="passenger_input" type="hidden"/>
                                                <input id='seat_map_request_input' name="seat_map_request_input" type="hidden"/>
                                                <input id='order_number' name="order_number" value="`+msg.result.response.order_number+`" type="hidden"/>
                                            </form>
                                        </div>
                                    </div>
                                </div>`;
                            }
                        }
                        text+=`
                    </div>
                </div>`;

                text_print_booking = '';

                text_print_booking += `
                <div class="div_box_default">
                    <h4 class="mb-3">Print</h4>
                    <div class="row">`;
                        if (msg.result.response.state == 'issued'){
                            text_print_booking+=`
                            <div class="col-lg-12">
                                <label class="check_box_custom">
                                    <span class="span-search-ticket" style="color:black;">Hide agent logo on tickets</span>
                                    <input type="checkbox" id="is_hide_agent_logo" name="is_hide_agent_logo"/>
                                    <span class="check_box_span_custom"></span>
                                </label>
                            </div>`;
                        }
                        text_print_booking+=`
                        <div class="col-lg-12">
                            <label class="check_box_custom">
                                <span class="span-search-ticket" style="color:black;">Force get new printout</span>
                                <input type="checkbox" id="is_force_get_new_printout" name="is_force_get_new_printout"/>
                                <span class="check_box_span_custom"></span>
                            </label>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-lg-12" style="padding-bottom:10px;">`;
                            if(msg.result.response.state != 'cancel' && msg.result.response.state != 'cancel2'){
                                if(msg.result.response.state == 'issued'){
                                    text_print_booking+=`
                                    <button type="button" id="button-choose-print" class="primary-btn-white ld-ext-right" style="width:100%; margin-bottom:5px; text-align:left;" onclick="get_printout('`+msg.result.response.order_number+`', 'ticket','train');">
                                        <i class="fas fa-print"></i> Print Ticket
                                        <div class="ld ld-ring ld-cycle"></div>
                                    </button>`;
                                }
                            }
                            text_print_booking+=`
                        </div>
                        <div class="col-lg-12" style="padding-bottom:10px;">`;
                            if(msg.result.response.state != 'cancel' && msg.result.response.state != 'cancel2'){
                                if (msg.result.response.state  == 'booked'){
                                    text_print_booking+=`
                                    <button type="button" id="button-print-print" class="primary-btn-white ld-ext-right" style="width:100%; margin-bottom:5px; text-align:left;" onclick="get_printout('`+msg.result.response.order_number+`', 'itinerary','train');">
                                        <i class="fas fa-print"></i> Print Form
                                        <div class="ld ld-ring ld-cycle"></div>
                                    </button>`;
                                }
                                else if(msg.result.response.state == 'issued'){
                                    text_print_booking+=`
                                    <button type="button" class="primary-btn-white ld-ext-right" id="button-print-print" style="width:100%; margin-bottom:5px; text-align:left;" onclick="get_printout('`+msg.result.response.order_number+`', 'ticket_price','train');">
                                        <i class="fas fa-print"></i> Print Ticket (Price)
                                        <div class="ld ld-ring ld-cycle"></div>
                                    </button>`;
                                }
                            }
                            text_print_booking+=`
                        </div>
                        <div class="col-lg-12" style="padding-bottom:10px;">`;
                            if(msg.result.response.state != 'cancel' && msg.result.response.state != 'cancel2'){
                                if (msg.result.response.state  == 'booked' || msg.result.response.state  == 'partial_booked' || msg.result.response.state == 'partial_issued'){
                                    if (msg.result.response.state  == 'booked'){
                                        text_print_booking+=`
                                        <button type="button" id="button-print-itin-price" class="primary-btn-white ld-ext-right" style="width:100%; margin-bottom:5px; text-align:left;" onclick="get_printout('`+msg.result.response.order_number+`', 'itinerary_price','train');">
                                            <i class="fas fa-print"></i> Print Form (Price)
                                            <div class="ld ld-ring ld-cycle"></div>
                                        </button>`;
                                    }
                                    try{
                                        if(can_issued)
                                        {
                                            if(user_login.co_job_position_is_request_required == true && msg.result.response.issued_request_status != "approved")
                                            {
                                                document.getElementById('issued_btn_train').setAttribute("onClick", "train_request_issued('"+msg.result.response.order_number+"');");
                                                if(msg.result.response.issued_request_status == "on_process")
                                                {
                                                    document.getElementById('issued_btn_train').innerHTML = "Issued Booking Requested";
                                                    document.getElementById('issued_btn_train').disabled = true;
                                                }
                                                else
                                                {
                                                    document.getElementById('issued_btn_train').innerHTML = "Request Issued Booking";
                                                }
                                            }
                                            $(".issued_booking_btn").show();
                                        }
                                    }catch(err){
                                        console.log(err); // error kalau ada element yg tidak ada
                                    }
                                }
                                else if(msg.result.response.state == 'issued'){
                                    text_print_booking+=`
                                    <button type="button" class="primary-btn-white issued-booking-train ld-ext-right" style="width:100%; margin-bottom:5px; text-align:left;" data-toggle="modal" data-target="#printInvoice">
                                        <i class="fas fa-print"></i> Print Invoice
                                        <div class="ld ld-ring ld-cycle"></div>
                                    </button>`;
                                    // modal invoice
                                    text_print_booking+=`
                                    <div class="modal fade" id="printInvoice" role="dialog" data-keyboard="false">
                                        <div class="modal-dialog">
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
                                                            <span class="control-label" for="Name">Included Passengers</span>
                                                            <table class="table list-of-reservation" style="border: 1px solid; width:100%;">`;
                                                            for (resv_pax in train_get_detail.result.response.passengers)
                                                            {
                                                                text_print_booking += `
                                                                <tr>
                                                                    <td>
                                                                        <span id="resv_pax_value`+resv_pax+`">`+train_get_detail.result.response.passengers[resv_pax].name+`, `+train_get_detail.result.response.passengers[resv_pax].title+`</span>
                                                                    </td>
                                                                    <td>
                                                                        <label class="check_box_custom cblabel">
                                                                            <input type="checkbox" id="resv_pax_checkbox`+resv_pax+`" name="resv_pax_checkbox`+i+`" checked />
                                                                            <span class="check_box_span_custom cbspan" style="background:#cdcdcd;"></span>
                                                                        </label>
                                                                    </td>
                                                                </tr>`;
                                                            }
                                               text_print_booking += `</table></div>
                                                    </div>

                                                    <br/>
                                                    <div style="text-align:right;">
                                                        <span>Don't want to edit? just submit</span>
                                                        <br/>
                                                        <button type="button" id="button-issued-print" class="primary-btn ld-ext-right" onclick="get_printout('`+msg.result.response.order_number+`', 'invoice','train');">
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
                                    </div>`;
                                    $(".issued_booking_btn").remove();
                                }
                            }
                            text_print_booking+=`
                        </div>
                    </div>
                </div>`;
                document.getElementById('train_booking_print').innerHTML = text_print_booking;
                document.getElementById('train_booking').innerHTML = text;
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
                <div style="background-color:white; padding:15px; border: 1px solid #cdcdcd; margin-bottom:15px;">
                    <div class="row">
                        <div class="col-lg-12 mb-3" style="border-bottom: 1px solid #cdcdcd;">
                            <h4 class="mb-3">Price Detail</h4>
                        </div>
                    </div>`;

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
                            try{
//                                price['CSC'] = msg.result.response.passengers[j].channel_service_charges.amount;
                                csc += msg.result.response.passengers[j].channel_service_charges.amount;
                            }catch(err){
                                console.log(err); // error kalau ada element yg tidak ada
                            }
                            //repricing
                            check = 0;
                            if(price_arr_repricing.hasOwnProperty(msg.result.response.passengers[j].pax_type) == false){
                                price_arr_repricing[msg.result.response.passengers[j].pax_type] = {}
                                pax_type_repricing.push([msg.result.response.passengers[j].pax_type, msg.result.response.passengers[j].pax_type]);
                            }
                            // fix agar tidak tumpuk harga pnr pertama
                            if(price_arr_repricing[msg.result.response.passengers[j].pax_type].hasOwnProperty(msg.result.response.passengers[j].name)){
                                price_arr_repricing[msg.result.response.passengers[j].pax_type][msg.result.response.passengers[j].name] = {
                                    'Fare': price_arr_repricing[msg.result.response.passengers[j].pax_type][msg.result.response.passengers[j].name]['Fare'] +  price['FARE'] + price['SSR'] + price['SEAT'] + price['DISC'],
                                    'Tax': price_arr_repricing[msg.result.response.passengers[j].pax_type][msg.result.response.passengers[j].name]['Tax'] +  price['TAX'] + price['ROC'] - csc,
                                    'Repricing': csc
                                }
                            }else{
                                price_arr_repricing[msg.result.response.passengers[j].pax_type][msg.result.response.passengers[j].name] = {
                                    'Fare': price['FARE'] + price['SSR'] + price['SEAT'] + price['DISC'],
                                    'Tax': price['TAX'] + price['ROC'] - csc,
                                    'Repricing': csc
                                }
                            }
                            text_repricing = '';
                            for(k in price_arr_repricing){
                                for(l in price_arr_repricing[k]){
                                    text_repricing += `
                                    <div class="col-lg-12">
                                        <div style="padding:5px;" class="row" id="adult">
                                            <div class="col-lg-12" id="`+j+`_`+k+`"><h6>`+l+`</h6></div>
                                            <div class="col-lg-4" id="`+l+`_price"><b>Price </b><br/><i>`+getrupiah(price_arr_repricing[k][l].Fare + price_arr_repricing[k][l].Tax)+`</i></div>`;
                                            if(price_arr_repricing[k][l].Repricing == 0)
                                                text_repricing+=`<div class="col-lg-4" id="`+l+`_repricing"><b>Repricing </b><br/>-</div>`;
                                            else
                                                text_repricing+=`<div class="col-lg-4" id="`+l+`_repricing"><b>Repricing </b><br/><i>`+getrupiah(price_arr_repricing[k][l].Repricing)+`</i></div>`;
                                            text_repricing+=`<div class="col-lg-4" id="`+l+`_total"><b>Total </b><br/><i>`+getrupiah(price_arr_repricing[k][l].Fare + price_arr_repricing[k][l].Tax + price_arr_repricing[k][l].Repricing)+`</i></div>
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
                                    <div class="col-lg-6" id="repricing_booker_name"><b>Booker Insentif</b></div>
                                    <div class="col-lg-3" id="repriring_booker_repricing"></div>
                                    <div class="col-lg-3" id="repriring_booker_total"><i>`+booker_insentif+`</i></div>
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
                                    <span style="font-size:13px;`;
                                    if(is_show_breakdown_price){
                                        text_detail+=`cursor:pointer;" id="passenger_breakdown`+j+`_`+msg.result.response.provider_bookings[i].pnr+`"`;
                                    }else{
                                        text_detail+=`"`;
                                    }
                                if(counter_service_charge == 0) //with upsell pnr pertama
                                    text_detail+=`
                                    >`+price.currency+` `+getrupiah(parseInt(price.FARE + price.TAX + price.ROC + price.SSR + price.SEAT + price.CSC));
                                else
                                    text_detail+=`
                                    >`+price.currency+` `+getrupiah(parseInt(price.FARE + price.TAX + price.ROC + price.SSR + price.SEAT));
                                if(is_show_breakdown_price)
                                    text_detail+=`<i class="fas fa-caret-down"></i>`;
                                text_detail += `</span>`;
                                text_detail+=`
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
                            if(counter_service_charge == 0){ //with upsell
                                total_price += parseInt(price.TAX + price.ROC + price.FARE + price.SEAT + price.CSC + price.SSR + price.DISC);
                                $text += currency+` `+getrupiah(parseInt(price.FARE + price.SSR + price.SEAT + price.TAX + price.ROC + price.CSC + price.DISC))+'\n';
                            }else{ // no upsell
                                total_price += parseInt(price.TAX + price.ROC + price.FARE + price.SSR + price.SEAT + price.DISC);
                                $text += currency+` `+getrupiah(parseInt(price.FARE + price.SSR + price.SEAT + price.TAX + price.ROC + price.DISC))+'\n';
                            }
                            commission += parseInt(price.RAC);
                            total_price_provider.push({
                                'pnr': msg.result.response.provider_bookings[i].pnr,
                                'provider': msg.result.response.provider_bookings[i].provider,
                                'price': JSON.parse(JSON.stringify(price))
                            });
                        }
                        //di gabung ke pax
//                        if(csc != 0){
//                            text_detail+=`
//                                <div class="row" style="margin-bottom:5px;">
//                                    <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
//                                        <span style="font-size:12px;">Other service charges</span>`;
//                                    text_detail+=`</div>
//                                    <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
//                                        <span style="font-size:13px;">`+price.currency+` `+getrupiah(parseInt(csc))+`</span>
//                                    </div>
//                                </div>`;
//                        }
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
                            <span id="total_price" style="font-size:13px; font-weight: bold;`;
                            if(is_show_breakdown_price)
                                text_detail+='cursor:pointer;';
                            text_detail+=`">`;
                            try{
                                if(total_price != 0)
                                    text_detail+= price.currency+` `+getrupiah(total_price);
                                else
                                    text_detail+= 'Free';
                            }catch(err){

                            }
                            if(is_show_breakdown_price)
                                text_detail+=`<i class="fas fa-caret-down"></i>`;
                            text_detail+= `</span>
                        </div>
                    </div>`;
                    if(['booked', 'partial_booked', 'partial_issued', 'halt_booked'].includes(msg.result.response.state)){
                        if(typeof(currency_rate_data) !== 'undefined' && currency_rate_data.result.is_show && total_price){
                            if(user_login.hasOwnProperty('co_ho_seq_id') && currency_rate_data.result.response.agent.hasOwnProperty(user_login.co_ho_seq_id)){ // buat o3
                                for(k in currency_rate_data.result.response.agent[user_login.co_ho_seq_id]){
                                    try{
                                        if(currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].base_currency == price.currency){
                                            price_convert = (parseFloat(total_price)/currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].rate).toFixed(2);
                                            if(price_convert%1 == 0)
                                                price_convert = parseInt(price_convert);
                                            text_detail+=`
                                                <div class="row">
                                                    <div class="col-lg-12" style="text-align:right;">
                                                        <span style="font-size:13px; font-weight:bold;" id="total_price_`+k+`"> Estimated `+k+` `+price_convert+`</span><br/>
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


                    if(msg.result.response.state == 'booked' && user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false){
                        text_detail+=`<div style="text-align:right; padding-bottom:10px;"><img src="/static/tt_website/images/icon/symbol/upsell_price.png" alt="Bank" style="width:auto; height:25px; cursor:pointer;" onclick="show_repricing();"/></div>`;
                    }else if(msg.result.response.state == 'issued' && user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false){
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
                                <a href="mailto:?subject=This is the train price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/email.png" alt="Email"/></a>`;
                        } else {
                            text_detail+=`
                                <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/whatsapp.png" alt="Whatsapp"/></a>
                                <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/line.png" alt="Line"/></a>
                                <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/telegram.png" alt="Telegram"/></a>
                                <a href="mailto:?subject=This is the train price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/email.png" alt="Email"/></a>`;
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
                    </div>`;
//                    if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
//                        text_detail+=`
//                        <div style="margin-bottom:5px;">
//                            <input class="primary-btn-white" id="show_commission_button" style="width:100%;" type="button" onclick="show_commission('commission');" value="Show YPM"/>
//                        </div>`;
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
                document.getElementById('show_title_train').hidden = false;
                document.getElementById('show_loading_booking_train').hidden = true;
                document.getElementById('train_detail').innerHTML = text;

                if(is_show_breakdown_price){
                    var price_breakdown = {};
                    var currency_breakdown = '';
                    for(i in train_get_detail.result.response.passengers){
                        price_breakdown = {};
                        for(j in train_get_detail.result.response.passengers[i].service_charge_details){
                            for(k in train_get_detail.result.response.passengers[i].service_charge_details[j].service_charges){
                                for(l in train_get_detail.result.response.passengers[i].service_charge_details[j].service_charges[k]){
                                    currency_breakdown = train_get_detail.result.response.passengers[i].service_charge_details[j].service_charges[k][l].currency;
                                    break;
                                }
                            }
                            if(!price_breakdown.hasOwnProperty('FARE'))
                                price_breakdown['FARE'] = 0;
                            if(!price_breakdown.hasOwnProperty('TAX'))
                                price_breakdown['TAX'] = 0;
                            if(!price_breakdown.hasOwnProperty('BREAKDOWN'))
                                price_breakdown['BREAKDOWN'] = 0;
                            if(!price_breakdown.hasOwnProperty('CONVENIENCE FEE'))
                                price_breakdown['CONVENIENCE FEE'] = 0;
                            if(!price_breakdown.hasOwnProperty('COMMISSION'))
                                price_breakdown['COMMISSION'] = 0;
                            if(!price_breakdown.hasOwnProperty('NTA TRAIN'))
                                price_breakdown['NTA TRAIN'] = 0;
                            if(!price_breakdown.hasOwnProperty('SERVICE FEE'))
                                price_breakdown['SERVICE FEE'] = 0;
                            if(!price_breakdown.hasOwnProperty('VAT'))
                                price_breakdown['VAT'] = 0;
                            if(!price_breakdown.hasOwnProperty('OTT'))
                                price_breakdown['OTT'] = 0;
                            if(!price_breakdown.hasOwnProperty('TOTAL PRICE'))
                                price_breakdown['TOTAL PRICE'] = 0;
                            if(!price_breakdown.hasOwnProperty('NTA AGENT'))
                                price_breakdown['NTA AGENT'] = 0;
                            if(!price_breakdown.hasOwnProperty('COMMISSION HO') && user_login.co_agent_frontend_security.includes('agent_ho'))
                                price_breakdown['COMMISSION HO'] = 0;

                            price_breakdown['FARE'] = train_get_detail.result.response.passengers[i].service_charge_details[j].base_fare;
                            price_breakdown['TAX'] = train_get_detail.result.response.passengers[i].service_charge_details[j].base_tax;
                            price_breakdown['BREAKDOWN'] = 0;
                            price_breakdown['CONVENIENCE FEE'] = train_get_detail.result.response.passengers[i].service_charge_details[j].base_upsell;
                            price_breakdown['COMMISSION'] = (train_get_detail.result.response.passengers[i].service_charge_details[j].base_commission_vendor * -1);
                            price_breakdown['NTA TRAIN'] = train_get_detail.result.response.passengers[i].service_charge_details[j].base_nta_vendor;
                            price_breakdown['SERVICE FEE'] = train_get_detail.result.response.passengers[i].service_charge_details[j].base_fee_ho;
                            price_breakdown['VAT'] = train_get_detail.result.response.passengers[i].service_charge_details[j].base_vat_ho;
                            price_breakdown['OTT'] = train_get_detail.result.response.passengers[i].service_charge_details[j].base_price_ott;
                            price_breakdown['TOTAL PRICE'] = train_get_detail.result.response.passengers[i].service_charge_details[j].base_price;
                            price_breakdown['NTA AGENT'] = train_get_detail.result.response.passengers[i].service_charge_details[j].base_nta;
                            if(user_login.co_agent_frontend_security.includes('agent_ho'))
                                price_breakdown['COMMISSION HO'] = train_get_detail.result.response.passengers[i].service_charge_details[j].base_commission_ho * -1;
                            for(k in train_get_detail.result.response.passengers[i].service_charge_details[j].service_charges){
                                if(k == 'ROC'){
                                    for(l in train_get_detail.result.response.passengers[i].service_charge_details[j].service_charges[k]){
                                        if(train_get_detail.result.response.passengers[i].service_charge_details[j].service_charges[k][l].charge_code == 'csc'){
                                            price_breakdown['CHANNEL UPSELL'] = train_get_detail.result.response.passengers[i].service_charge_details[j].service_charges[k][l].amount;
                                            break;
                                        }
                                    }
                                    break;
                                }
                            }
                            var breakdown_text = '';
                            for(k in price_breakdown){
                                if(k != 'BREAKDOWN' && price_breakdown[k] != 0){
                                    if(breakdown_text)
                                        breakdown_text += '<br/>';
                                    breakdown_text += '<b>'+k+'</b> ';
                                    breakdown_text += currency_breakdown + ' ' + getrupiah(price_breakdown[k]);
                                }else if(k == 'BREAKDOWN'){
                                    if(breakdown_text)
                                        breakdown_text += '<br/>';
                                    breakdown_text += '<b>'+k+'</b> ';
                                }
                            }
                            new jBox('Tooltip', {
                                attach: '#passenger_breakdown'+i+'_'+ train_get_detail.result.response.passengers[i].service_charge_details[j].pnr,
                                target: '#passenger_breakdown'+i+'_'+ train_get_detail.result.response.passengers[i].service_charge_details[j].pnr,
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
                            price_breakdown = {};
                            breakdown_text = '';
                            currency_breakdown = '';
                        }
                    }

                    price_breakdown = {};
                    for(i in train_get_detail.result.response.passengers){
                        for(j in train_get_detail.result.response.passengers[i].service_charge_details){
                            if(!price_breakdown.hasOwnProperty('FARE'))
                                price_breakdown['FARE'] = 0;
                            if(!price_breakdown.hasOwnProperty('TAX'))
                                price_breakdown['TAX'] = 0;
                            if(!price_breakdown.hasOwnProperty('BREAKDOWN'))
                                price_breakdown['BREAKDOWN'] = 0;
                            if(!price_breakdown.hasOwnProperty('CONVENIENCE FEE'))
                                price_breakdown['CONVENIENCE FEE'] = 0;
                            if(!price_breakdown.hasOwnProperty('COMMISSION'))
                                price_breakdown['COMMISSION'] = 0;
                            if(!price_breakdown.hasOwnProperty('NTA TRAIN'))
                                price_breakdown['NTA TRAIN'] = 0;
                            if(!price_breakdown.hasOwnProperty('SERVICE FEE'))
                                price_breakdown['SERVICE FEE'] = 0;
                            if(!price_breakdown.hasOwnProperty('VAT'))
                                price_breakdown['VAT'] = 0;
                            if(!price_breakdown.hasOwnProperty('OTT'))
                                price_breakdown['OTT'] = 0;
                            if(!price_breakdown.hasOwnProperty('TOTAL PRICE'))
                                price_breakdown['TOTAL PRICE'] = 0;
                            if(!price_breakdown.hasOwnProperty('NTA AGENT'))
                                price_breakdown['NTA AGENT'] = 0;
                            if(!price_breakdown.hasOwnProperty('COMMISSION HO') && user_login.co_agent_frontend_security.includes('agent_ho'))
                                price_breakdown['COMMISSION HO'] = 0;
                            if(!price_breakdown.hasOwnProperty('CHANNEL UPSELL'))
                                price_breakdown['CHANNEL UPSELL'] = 0;

                            price_breakdown['FARE'] += train_get_detail.result.response.passengers[i].service_charge_details[j].base_fare;
                            price_breakdown['TAX'] += train_get_detail.result.response.passengers[i].service_charge_details[j].base_tax;
                            price_breakdown['BREAKDOWN'] = 0;
                            price_breakdown['CONVENIENCE FEE'] += train_get_detail.result.response.passengers[i].service_charge_details[j].base_upsell;
                            price_breakdown['COMMISSION'] += (train_get_detail.result.response.passengers[i].service_charge_details[j].base_commission_vendor * -1);
                            price_breakdown['NTA TRAIN'] += train_get_detail.result.response.passengers[i].service_charge_details[j].base_nta_vendor;
                            price_breakdown['SERVICE FEE'] += train_get_detail.result.response.passengers[i].service_charge_details[j].base_fee_ho;
                            price_breakdown['VAT'] += train_get_detail.result.response.passengers[i].service_charge_details[j].base_vat_ho;
                            price_breakdown['OTT'] += train_get_detail.result.response.passengers[i].service_charge_details[j].base_price_ott;
                            price_breakdown['TOTAL PRICE'] += train_get_detail.result.response.passengers[i].service_charge_details[j].base_price;
                            price_breakdown['NTA AGENT'] += train_get_detail.result.response.passengers[i].service_charge_details[j].base_nta;
                            if(user_login.co_agent_frontend_security.includes('agent_ho'))
                                price_breakdown['COMMISSION HO'] += train_get_detail.result.response.passengers[i].service_charge_details[j].base_commission_ho * -1;
                            for(k in train_get_detail.result.response.passengers[i].service_charge_details[j].service_charges){
                                if(k == 'ROC'){
                                    for(l in train_get_detail.result.response.passengers[i].service_charge_details[j].service_charges[k]){
                                        if(train_get_detail.result.response.passengers[i].service_charge_details[j].service_charges[k][l].charge_code == 'csc'){
                                            price_breakdown['CHANNEL UPSELL'] += train_get_detail.result.response.passengers[i].service_charge_details[j].service_charges[k][l].amount;
                                            break;
                                        }
                                    }
                                    break;
                                }
                            }
                        }
                    }
                    var breakdown_text = '';
                    for(j in price_breakdown){
                        if(j != 'BREAKDOWN' && price_breakdown[j] != 0){
                            if(breakdown_text)
                                breakdown_text += '<br/>';
                            breakdown_text += '<b>'+j+'</b> ';
                            breakdown_text += currency_breakdown + ' ' + getrupiah(price_breakdown[j]);
                        }else if(j == 'BREAKDOWN'){
                            if(breakdown_text)
                                breakdown_text += '<br/>';
                            breakdown_text += '<b>'+j+'</b> ';
                        }
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

                for(i in msg.result.response.provider_bookings){
                    for(j in msg.result.response.provider_bookings[i].journeys){
                        if(msg.result.response.provider_bookings[i].journeys[j].hasOwnProperty('search_banner')){
                           for(banner_counter in msg.result.response.provider_bookings[i].journeys[j].search_banner){
                               var max_banner_date = moment().subtract(parseInt(-1*msg.result.response.provider_bookings[i].journeys[j].search_banner[banner_counter].minimum_days), 'days').format('YYYY-MM-DD');
                               var selected_banner_date = moment(msg.result.response.provider_bookings[i].journeys[j].departure_date.split(' -')[0]).format('YYYY-MM-DD');
                               if(selected_banner_date >= max_banner_date){
                                   if(msg.result.response.provider_bookings[i].journeys[j].search_banner[banner_counter].active == true){
                                       new jBox('Tooltip', {
                                            attach: '#pop_search_banner'+i+j+banner_counter,
                                            theme: 'TooltipBorder',
                                            width: 280,
                                            closeOnMouseleave: true,
                                            position: {
                                              x: 'center',
                                              y: 'bottom'
                                            },
                                            animation: 'zoomIn',
                                            content: msg.result.response.provider_bookings[i].journeys[j].search_banner[banner_counter].description
                                       });
                                   }
                               }
                           }
                        }
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
                   document.getElementById('cancel').hidden = false;
                   if(template != 6){
                        document.getElementById('cancel').innerHTML = `<button class="primary-btn-white" style="width:100%;" id="train_cancel_booking_btn" type="button" onclick="train_cancel_booking();">Cancel Booking <i class="fas fa-times" style="padding-left:5px; color:red; font-size:16px;"></i></button>`;
                   }else{
                        document.getElementById('cancel').innerHTML = `<button class="primary-btn-white" style="margin-bottom:0px; width:100%;" id="train_cancel_booking_btn" type="button" onclick="train_cancel_booking();">Cancel Booking <i class="fas fa-times" style="padding-left:5px; color:red; font-size:16px;"></i></button>`;
                   }
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
                }else if(msg.result.response.state == 'issued'){
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
                    is_show_web_check_in = false;
                    try{
                        for(i in msg.result.response.provider_bookings){
                            if(moment().format('YYYY-MM-DD HH:mm:ss') < moment(msg.result.response.provider_bookings[i].departure_date).format('YYYY-MM-DD HH:mm:ss')){
                                is_show_web_check_in = true;
                            }
                        }
                        if(is_show_web_check_in){
                            for(i in msg.result.response.passengers){
                                if(msg.result.response.passengers[i].hasOwnProperty('temporary_field') && msg.result.response.passengers[i]['temporary_field'].length > 0 && msg.result.response.passengers[i]['temporary_field'][0].hasOwnProperty('web_check_in') && is_show_web_check_in)
                                    is_show_web_check_in = false;
                            }
                        }
                        if(is_show_web_check_in){
                            document.getElementById('web_checkin_btn').hidden = false;
                            document.getElementById('web_checkin_btn').innerHTML = `<button class="primary-btn-white" style="margin-bottom:0px; width:100%;" id="train_web_checkin_btn" type="button" onclick="train_checkin_booking();">Web Check-in </button>`;
                        }
                    }catch(err){}
                }
                if(msg.result.response.hasOwnProperty('voucher_reference') && msg.result.response.voucher_reference != '' && msg.result.response.voucher_reference != false){
                    try{
                        render_voucher(price.currency,msg.result.response.voucher_discount, msg.result.response.state)
                    }catch(err){console.log(err);}
                }

            }else if(msg.result.error_code == 1035){
                document.getElementById('show_title_train').hidden = false;
                document.getElementById('show_loading_booking_train').hidden = true;
                document.getElementById('show_title_train').hidden = true;
                render_login('train');
            }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error train booking </span>' + msg.result.error_msg,
                }).then((result) => {
                  if (result.value) {
                    hide_modal_waiting_transaction();
                  }
                })
                document.getElementById('show_loading_booking_train').hidden = true;
                hide_modal_waiting_transaction();
            }
        }catch(err){
            Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error train booking </span> Please try again in 1 - 5 minutes later or contact customer service' ,
            }).then((result) => {
              window.location.href = '/reservation';
            })
            document.getElementById('show_loading_booking_train').hidden = true;
            hide_modal_waiting_transaction();
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error train booking');
            hide_modal_waiting_transaction();
            document.getElementById('show_loading_booking_train').hidden = true;
       },timeout: 480000
    });
}

function create_new_reservation(){
    //pilihan carrier
    var text = '';
    var option = '';
    //orang
    text += `<h6>Journey</h6>
            <table style="width:100%;background:white;margin-top:15px;" class="list-of-table">
                <tr>
                    <th style="width:70%">Journey</th>
                    <th style="width:30%">Re-Order</th>
                </tr>`;
    var counter_journey = 0;
    for(i in train_get_detail.result.response.provider_bookings){
        for(j in train_get_detail.result.response.provider_bookings[i].journeys){
            if(moment(train_get_detail.result.response.provider_bookings[i].journeys[j].departure_date).format('YYYY-MM-DD HH:mm') > moment().format('YYYY-MM-DD HH:mm'))
                text += `
                <tr>
                    <td>`+train_get_detail.result.response.provider_bookings[i].journeys[j].origin+`-`+train_get_detail.result.response.provider_bookings[i].journeys[j].destination+`</td>
                    <td>
                        <label class="check_box_custom" style="margin-bottom:15px; float:left;">
                            <input type="checkbox" id="journey`+i+`" name="journey`+i+`" checked />
                            <span class="check_box_span_custom"></span>
                        </label>
                    </td>
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
    for(i in train_get_detail.result.response.passengers){
        text += `<tr>
                    <td>`+train_get_detail.result.response.passengers[i].name+`</td>
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
    text += `
    <button type="button" class="next-loading-reorder primary-btn mb-3 ld-ext-right" id="button-reorder" style="width:100%;margin-top:15px;" onclick="train_reorder();">
        Re Order
        <div class="ld ld-ring ld-cycle"></div>
    </button>`;

    document.getElementById('button-re-order-div').innerHTML = text;
    //document.getElementById('reorder_div').hidden = true;
}

function train_reorder(){
    //check all pax
    var check_pax = false;
    var check_journey = false;
    passenger_list_copy = [];
    journey_list_copy = [];
    for(i in train_get_detail.result.response.passengers){
        if(document.getElementById('passenger'+i).checked){
            passenger_list_copy.push(train_get_detail.result.response.passengers[i]);
            check_pax = true; // ada pax yg mau re order
        }
    }
    var counter_journey = 0;
    for(i in train_get_detail.result.response.provider_bookings){
        for(j in train_get_detail.result.response.provider_bookings[i].journeys){
            if(document.getElementById('journey'+i).checked){
                journey_list_copy.push(train_get_detail.result.response.provider_bookings[i].journeys[j]);
                check_journey = true; // ada pax yg mau re order
            }
            counter_journey++;
        }
    }
    if(check_pax && check_journey){
        show_loading_reorder('train');
        train_signin(train_get_detail.result.response.order_number, 'reorder');
    }else if(check_journey){
        Swal.fire({
            type: 'error',
            title: 'Oops!',
            html: 'Minimal Re-Order with 1 pax!',
        })
    }else if(check_pax){
        Swal.fire({
            type: 'error',
            title: 'Oops!',
            html: 'Minimal Re-Order with 1 journey!',
        })
    }else{
        Swal.fire({
            type: 'error',
            title: 'Oops!',
            html: 'Minimal Re-Order with 1 journey and 1 pax!',
        })
    }
}

function search_reorder(){
    train_request = {
        "origin":[],
        "destination":[],
        "departure":[],
        "direction":"OW",
        "adult":0,
        "infant":0,
    };
    adult = 0;
    infant = 0;
    for(i in passenger_list_copy){
        if(passenger_list_copy[i].birth_date != '' && passenger_list_copy[i].birth_date != false){
            old = parseInt(Math.abs(moment() - moment(passenger_list_copy[i].birth_date,'DD MMM YYYY'))/31536000000)
            if(old > 2)
                adult++;
            else
                infant++;
        }else{
            adult++;
        }
    }
    provider_list_reorder = {};
    for(i in journey_list_copy){
        train_request['origin'].push(journey_list_copy[i].origin+' - - - ')
        train_request['destination'].push(journey_list_copy[i].destination+' - - - ')
        train_request['departure'].push(journey_list_copy[i].departure_date.split('  ')[0])
    }
    train_request['direction'] = train_request['origin'].length == 1 ? 'OW' : 'RT';
    train_request['adult'] = adult;
    train_request['infant'] = infant;
    re_order_set_passengers();
}

function re_order_set_passengers(){
    $.ajax({
       type: "POST",
       url: "/webservice/train",
       headers:{
            'action': 're_order_set_passengers',
       },
       data: {
          'signature': signature,
          'pax': JSON.stringify(passenger_list_copy),
          'booker': JSON.stringify(train_get_detail.result.response.booker)
       },
       success: function(resJson) {
            setTimeout(function(){
                please_wait_custom('Set Passenger <i class="fas fa-check-circle" style="color:'+color+';"></i><br/>Search Schedule, please wait <img src="/static/tt_website/images/gif/loading-dot-white.gif" style="height:50px; width:50px;"/>');
                train_data_reorder = [];
                train_get_config_provider(signature,'reorder')
            }, 1000);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            please_wait_custom('Set Passenger Failed <i class="fas fa-times-circle" style="color:#f53e31"></i>');
            $('.next-loading-reorder').removeClass("running");
            $('.next-loading-reorder').prop('disabled', false);
            $('.issued_booking_btn').prop('disabled', false);
            $('#button-sync-status').prop('disabled', false);
            setTimeout(function(){
                $("#waitingTransaction").modal('hide');
            }, 2000);
       },timeout: 120000
    });
}

function re_order_check_search(){
    if(counter_train_provider == Object.keys(provider_train).length){
        setTimeout(function(){
            please_wait_custom('Search Schedule <i class="fas fa-check-circle" style="color:'+color+';"></i><br/>Select Data Journey, please wait <img src="/static/tt_website/images/gif/loading-dot-white.gif" style="height:50px; width:50px;"/>');
            re_order_find_journey();
        }, 1000);
    }
}

function re_order_find_journey(){
    promotion_code_list = [];
    journey = [];
    separate = false;
    error_log = '';
    for(i in journey_list_copy){
        for(x in train_data_reorder){
            if(journey_list_copy[i].journey_code == train_data_reorder[x].journey_code && journey_list_copy[i].fare_code == train_data_reorder[x].fares[0].fare_code){
                if(journey_list_copy[i].available_count < train_request.adult){
                    error_log += `Journey `+parseInt(parseInt(i)+1)+` not available<br/>`;
                }else if(check_elapse_time_three_hours(moment(train_data_reorder[x].departure_date, 'DD MMM YYYY - HH:mm').format("YYYY MMM DD HH:mm")) == false)
                    error_log += `Departure time < 3 hours!<br/>`;
                else
                    journey.push(train_data_reorder[x]);
                break;
            }
        }
    }

    if(error_log != ''){
        Swal.fire({
            type: 'warning',
            title: 'Oops!',
            html: error_log,
        });
        location.reload();
    }else{
        console.log('select data journey');
        setTimeout(function(){
            please_wait_custom('Select Data Journey <i class="fas fa-check-circle" style="color:'+color+';"></i><br/>Set Pick Train, please wait <img src="/static/tt_website/images/gif/loading-dot-white.gif" style="height:50px; width:50px;"/>');
            re_order_set_journey();
        }, 1000);
    }
}

function re_order_set_journey(){
    $.ajax({
       type: "POST",
       url: "/webservice/train",
       headers:{
            'action': 'choose_train_reorder',
       },
       data: {
          "train_pick": JSON.stringify(journey)
       },
       success: function(msg) {
            setTimeout(function(){
                please_wait_custom('Set Pick Train <i class="fas fa-check-circle" style="color:'+color+';"></i><br/>Redirect page, please wait <img src="/static/tt_website/images/gif/loading-dot-white.gif" style="height:50px; width:50px;"/>');
                train_create_booking(0,'reorder')
            }, 1000);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {

       },timeout: 120000
    });
}


function set_seat_map(){
    passengers = [];
    seat_map_request = [];
    for(i in train_get_detail.result.response.provider_bookings){
        for(j in train_get_detail.result.response.provider_bookings[i].journeys){
            seat_map_request.push({
                'fare_code': train_get_detail.result.response.provider_bookings[i].journeys[j].fare_code,
                'provider': train_get_detail.result.response.provider_bookings[i].provider
            })
            for(k in train_get_detail.result.response.provider_bookings[i].journeys[j].seats){
                check = 0;
                for(l in passengers){
                    if(passengers[l].name == train_get_detail.result.response.provider_bookings[i].journeys[j].seats[k].passenger){
                        passengers[l].seat_list.push({
                            'seat':train_get_detail.result.response.provider_bookings[i].journeys[j].seats[k].seat,
                            'fare_code': train_get_detail.result.response.provider_bookings[i].journeys[j].fare_code,
                            'origin': train_get_detail.result.response.provider_bookings[i].journeys[j].origin,
                            'seat_code': train_get_detail.result.response.provider_bookings[i].journeys[j].seats[l].seat_code,
                            'destination': train_get_detail.result.response.provider_bookings[i].journeys[j].destination
                        });
                        check = 1;
                        break;
                    }
                }
                if(check == 0){
                    passengers.push({
                        'sequence': train_get_detail.result.response.provider_bookings[i].journeys[j].seats[k].passenger_sequence,
                        'name': train_get_detail.result.response.provider_bookings[i].journeys[j].seats[k].passenger,
                        'seat_list': [{
                            'seat': train_get_detail.result.response.provider_bookings[i].journeys[j].seats[k].seat,
                            'fare_code': train_get_detail.result.response.provider_bookings[i].journeys[j].fare_code,
                            'origin': train_get_detail.result.response.provider_bookings[i].journeys[j].origin,
                            'seat_code': train_get_detail.result.response.provider_bookings[i].journeys[j].seats[k].seat_code,
                            'destination': train_get_detail.result.response.provider_bookings[i].journeys[j].destination
                        }],
                        'behaviors': train_get_detail.result.response.passengers[k].hasOwnProperty('behaviors') ? train_get_detail.result.response.passengers[k].behaviors : ""
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

function train_issued(data){
    var temp_data = {}
    if(typeof(train_get_detail) !== 'undefined')
        temp_data = JSON.stringify(train_get_detail)
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

            if(document.getElementById('train_payment_form'))
            {
                var formData = new FormData($('#train_payment_form').get(0));
            }
            else
            {
                var formData = new FormData($('#global_payment_form').get(0));
            }
            formData.append('order_number', data);
            formData.append('acquirer_seq_id', payment_acq2[payment_method][selected].acquirer_seq_id);
            formData.append('member', payment_acq2[payment_method][selected].method);
            default_payment_to_ho = ''
            if(total_price_payment_acq == 0)
                default_payment_to_ho = 'balance'
            formData.append('agent_payment', document.getElementById('payment_ho_id') ? document.getElementById('payment_ho_id').value : default_payment_to_ho);
            formData.append('signature', signature);
            formData.append('voucher_code', voucher_code);
            formData.append('booking', temp_data);

            if (document.getElementById('is_attach_pay_ref') && document.getElementById('is_attach_pay_ref').checked == true)
            {
                formData.append('payment_reference', document.getElementById('pay_ref_text').value);
            }
            var error_log = '';
            if(document.getElementById('pin')){
                if(document.getElementById('pin').value)
                    formData.append('pin', document.getElementById('pin').value);
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
                    url: "/webservice/train",
                    headers:{
                        'action': 'issued',
                    },
                    data: formData,
                    success: function(msg) {
                        if(google_analytics != '')
                            gtag('event', 'train_issued', {});
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
                                window.location.href = '/train/booking/' + btoa(data);
                            }else{
                                //update ticket
                                price_arr_repricing = {};
                                pax_type_repricing = [];
                                document.getElementById('show_loading_booking_train').hidden = true;
                                document.getElementById('train_booking').innerHTML = '';
                                document.getElementById('train_detail').innerHTML = '';
                                document.getElementById('payment_acq').innerHTML = '';
                                document.getElementById('show_loading_booking_train').style.display = 'block';
                                document.getElementById('show_loading_booking_train').hidden = false;
                                document.getElementById('payment_acq').hidden = true;
                                document.getElementById("overlay-div-box").style.display = "none";
                                try{
                                    document.getElementById('voucher_discount').style.display = 'none';
                                }catch(err){
                                    console.log(err); // error kalau ada element yg tidak ada
                                }
                                hide_modal_waiting_transaction();
                                train_get_booking(data);
                            }
                        }else if(msg.result.error_code == 1009){
                            price_arr_repricing = {};
                            pax_type_repricing = [];
                            document.getElementById('show_loading_booking_train').hidden = true;
                            document.getElementById('train_booking').innerHTML = '';
                            document.getElementById('train_detail').innerHTML = '';
                            document.getElementById('payment_acq').innerHTML = '';
                            document.getElementById('show_loading_booking_train').style.display = 'block';
                            document.getElementById('show_loading_booking_train').hidden = false;
                            document.getElementById('payment_acq').hidden = true;
                            document.getElementById("overlay-div-box").style.display = "none";
                            try{
                                document.getElementById('voucher_discount').style.display = 'none';
                            }catch(err){
                                console.log(err); // error kalau ada element yg tidak ada
                            }
                            hide_modal_waiting_transaction();
                            train_get_booking(data);
                            Swal.fire({
                                type: 'error',
                                title: 'Oops!',
                                html: '<span style="color: #ff9900;">Error train issued </span>' + msg.result.error_msg,
                            }).then((result) => {
                                if (result.value) {
                                    hide_modal_waiting_transaction();
                                }
                            })
                        }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                            auto_logout();
                        }else{
                            if(msg.result.error_code != 1007){
                                Swal.fire({
                                    type: 'error',
                                    title: 'Oops!',
                                    html: '<span style="color: #ff9900;">Error train issued </span>' + msg.result.error_msg,
                                })
                            }else{
                                Swal.fire({
                                    type: 'error',
                                    title: 'Error train issued '+ msg.result.error_msg,
                                    showCancelButton: true,
                                    cancelButtonText: 'Ok',
                                    confirmButtonColor: color,
                                    cancelButtonColor: '#3085d6',
                                    confirmButtonText: 'Top Up'
                                }).then((result) => {
                                    console.log(result);
                                    if (result.value) {
                                        window.location.href = '/top_up';
                                    }else{
                                        if(window.location.href.includes('payment')){
                                            window.location.href = '/train/booking/'+data;
                                        }
                                    }
                                })
                            }
                            price_arr_repricing = {};
                            pax_type_repricing = [];
                            if(document.URL.split('/')[document.URL.split('/').length-1] != 'payment'){
                                document.getElementById('show_loading_booking_train').hidden = true;
                                document.getElementById('train_booking').innerHTML = '';
                                document.getElementById('train_detail').innerHTML = '';
                                document.getElementById('payment_acq').innerHTML = '';
                                document.getElementById('show_loading_booking_train').style.display = 'block';
                                document.getElementById('show_loading_booking_train').hidden = false;
                                document.getElementById('payment_acq').hidden = true;
                                train_get_booking(data);
                            }
                            document.getElementById("overlay-div-box").style.display = "none";
                            try{
                                document.getElementById('voucher_discount').style.display = 'none';
                            }catch(err){
                                console.log(err); // error kalau ada element yg tidak ada
                            }
                            $('.hold-seat-booking-train').prop('disabled', false);
                            $('.hold-seat-booking-train').removeClass("running");
                            hide_modal_waiting_transaction();

                        }
                    },
                    contentType:false,
                    processData:false,
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error train issued');
                        price_arr_repricing = {};
                        pax_type_repricing = [];
                        document.getElementById('show_loading_booking_train').hidden = true;
                        document.getElementById('train_booking').innerHTML = '';
                        document.getElementById('train_detail').innerHTML = '';
                        document.getElementById('payment_acq').innerHTML = '';
                        document.getElementById('show_loading_booking_train').style.display = 'block';
                        document.getElementById('show_loading_booking_train').hidden = false;
                        document.getElementById('payment_acq').hidden = true;
                        try{
                            document.getElementById('voucher_discount').style.display = 'none';
                        }catch(err){
                            console.log(err); // error kalau ada element yg tidak ada
                        }
                        $('.hold-seat-booking-train').prop('disabled', false);
                        $('.hold-seat-booking-train').removeClass("running");
                        hide_modal_waiting_transaction();
                        document.getElementById("overlay-div-box").style.display = "none";
                        train_get_booking(data);
                    },timeout: 480000
                });
            }
        }
    })
}

function train_request_issued(req_order_number){
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
               'table_name': 'train',
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
                      html: '<span style="color: #ff9900;">Error train request issued </span>' + msg.result.error_msg,
                    })
                    price_arr_repricing = {};
                    pax_type_repricing = [];
                    document.getElementById('show_loading_booking_train').hidden = true;
                    document.getElementById('train_booking').innerHTML = '';
                    document.getElementById('train_detail').innerHTML = '';
                    document.getElementById('payment_acq').innerHTML = '';
                    try{
                        document.getElementById('voucher_discount').style.display = 'none';
                    }catch(err){
                        console.log(err); // error kalau ada element yg tidak ada
                    }
                    document.getElementById('show_loading_booking_train').style.display = 'block';
                    document.getElementById('show_loading_booking_train').hidden = false;
                    document.getElementById('payment_acq').hidden = true;
                    document.getElementById("overlay-div-box").style.display = "none";
                    $('.hold-seat-booking-train').prop('disabled', false);
                    $('.hold-seat-booking-train').removeClass("running");
                    hide_modal_waiting_transaction();
                    train_get_booking(req_order_number);
               }
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                price_arr_repricing = {};
                pax_type_repricing = [];
                document.getElementById('show_loading_booking_train').hidden = true;
                document.getElementById('train_booking').innerHTML = '';
                document.getElementById('train_detail').innerHTML = '';
                document.getElementById('payment_acq').innerHTML = '';
                document.getElementById('show_loading_booking_train').style.display = 'block';
                document.getElementById('show_loading_booking_train').hidden = false;
                document.getElementById('payment_acq').hidden = true;
                try{
                    document.getElementById('voucher_discount').style.display = 'none';
                }catch(err){
                    console.log(err); // error kalau ada element yg tidak ada
                }
                $('.hold-seat-booking-train').prop('disabled', false);
                $('.hold-seat-booking-train').removeClass("running");
                hide_modal_waiting_transaction();
                document.getElementById("overlay-div-box").style.display = "none";
                train_get_booking(req_order_number);
           },timeout: 300000
        });
      }
    })
}

function train_get_seat_map(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/train",
       headers:{
            'action': 'get_seat_map',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
        if(msg.result.error_code==0){
            seat_map_response = msg.result.response;
            print_seat_map(0);
        }else{
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: #ff9900;">Error train seat map </span>' + msg.result.error_msg,
            })
        }

       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error train seat map');
       },timeout: 480000
    });
}

function train_cancel_booking(){
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
           url: "/webservice/train",
           headers:{
                'action': 'cancel',
           },
           data: {
                'order_number': order_number,
                'signature': signature
           },
           success: function(msg) {
            if(msg.result.error_code == 0){
               price_arr_repricing = {};
               pax_type_repricing = [];
               train_get_booking(order_number);
               document.getElementById('show_loading_booking_train').hidden = true;
               document.getElementById('train_booking').innerHTML = '';
               document.getElementById('train_detail').innerHTML = '';
               document.getElementById('payment_acq').innerHTML = '';
               document.getElementById('show_loading_booking_train').style.display = 'block';
               document.getElementById('show_loading_booking_train').hidden = false;
               document.getElementById('payment_acq').hidden = true;
               document.getElementById("overlay-div-box").style.display = "none";
               try{
                    document.getElementById('voucher_discount').style.display = 'none';
               }catch(err){
                    console.log(err); // error kalau ada element yg tidak ada
               }
               try{
                    document.getElementById("issued_btn_train").style.display = "none";
               }catch(err){
                    console.log(err); // error kalau ada element yg tidak ada
               }
            }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error cancel train </span>' + msg.result.error_msg,
                }).then((result) => {
                  if (result.value) {
                    hide_modal_waiting_transaction();
                  }
                })
                price_arr_repricing = {};
                pax_type_repricing = [];
                document.getElementById('show_loading_booking_train').hidden = true;
                document.getElementById('train_booking').innerHTML = '';
                document.getElementById('train_detail').innerHTML = '';
                document.getElementById('payment_acq').innerHTML = '';
                document.getElementById('show_loading_booking_train').style.display = 'block';
                document.getElementById('show_loading_booking_train').hidden = false;
                document.getElementById('payment_acq').hidden = true;
                document.getElementById("overlay-div-box").style.display = "none";
                try{
                    document.getElementById('voucher_discount').style.display = 'none';
                }catch(err){
                    console.log(err); // error kalau ada element yg tidak ada
                }
                train_get_booking(order_number);
                hide_modal_waiting_transaction();
            }
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error train manual seat');
                hide_modal_waiting_transaction();
           },timeout: 480000
        });
        $('.submit-seat-train').addClass("running");
      }
    })
}

function train_checkin_booking(){
    please_wait_transaction();
    $.ajax({
       type: "POST",
       url: "/webservice/train",
       headers:{
            'action': 'checkin',
       },
       data: {
            'order_number': order_number,
            'signature': signature
       },
       success: function(msg) {
        if(msg.result.error_code == 0){
           price_arr_repricing = {};
           pax_type_repricing = [];
           train_get_booking(order_number);
           document.getElementById('show_loading_booking_train').hidden = true;
           document.getElementById('train_booking').innerHTML = '';
           document.getElementById('train_detail').innerHTML = '';
           document.getElementById('payment_acq').innerHTML = '';
           document.getElementById('show_loading_booking_train').style.display = 'block';
           document.getElementById('show_loading_booking_train').hidden = false;
           document.getElementById('payment_acq').hidden = true;
           document.getElementById("overlay-div-box").style.display = "none";
           try{
                document.getElementById('voucher_discount').style.display = 'none';
           }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
           }
           try{
                document.getElementById("issued_btn_train").style.display = "none";
           }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
           }
        }else{
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: #ff9900;">Error web check-in train </span>' + msg.result.error_msg,
            }).then((result) => {
              if (result.value) {
                hide_modal_waiting_transaction();
              }
            })
            price_arr_repricing = {};
            pax_type_repricing = [];
            document.getElementById('show_loading_booking_train').hidden = true;
            document.getElementById('train_booking').innerHTML = '';
            document.getElementById('train_detail').innerHTML = '';
            document.getElementById('payment_acq').innerHTML = '';
            document.getElementById('show_loading_booking_train').style.display = 'block';
            document.getElementById('show_loading_booking_train').hidden = false;
            document.getElementById('payment_acq').hidden = true;
            document.getElementById("overlay-div-box").style.display = "none";
            try{
                document.getElementById('voucher_discount').style.display = 'none';
            }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
            }
            train_get_booking(order_number);
            hide_modal_waiting_transaction();
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error web check-in train');
            hide_modal_waiting_transaction();
       },timeout: 480000
    });
}

function train_manual_seat(){
    $('.submit-seat-train').addClass("running");
    $('.change-seat-train-buttons').prop('disabled', true);
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/train",
       headers:{
            'action': 'assign_seats',
       },
       data: {
            'pax': JSON.stringify(pax),
            'order_number': order_number,
            'signature': signature

       },
       success: function(msg) {
        if(msg.result.error_code == 0){
            check = 0;
            for(i in msg.result.response){
                if(msg.result.response[i].status == 'FAILED'){
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: #ff9900;">Error train manual seat </span>' + msg.result.response[i].error_msg,
                    });
                    check = 1;
                }
            }
            if(check == 0){
                //check var
                if(is_b2c_field.value == true){
                    Swal.fire({
                        title: "Success, booking has been made. We'll sent you an email for your reservation",
                        type: 'success',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: 'blue',
                        confirmButtonText: 'Payment',
                        cancelButtonText: 'View Booking'
                    }).then((result) => {
                        if (result.value) {
                            document.getElementById("passengers").value = JSON.stringify(is_b2c_field.passengers);
                            document.getElementById("signature").value = is_b2c_field.signature;
                            document.getElementById("provider").value = is_b2c_field.provider;
                            document.getElementById("type").value = is_b2c_field.type;
                            document.getElementById("voucher_code").value = is_b2c_field.voucher_code;
                            document.getElementById("discount").value = JSON.stringify(is_b2c_field.discount);
                            document.getElementById("session_time_input").value = is_b2c_field.session_time_input;
                            document.getElementById("order_number2").value = is_b2c_field.order_number;
                            document.getElementById('train_issued').submit();
                        }else{
                            document.getElementById('train_booking').submit();
                        }
                    })
                }else{
                    document.getElementById('train_booking').submit();
                }
            }else{
                $('.submit-seat-train').removeClass("running");
                $('.change-seat-train-buttons').prop('disabled', false);
            }
        }else
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: #ff9900;">Error train manual seat </span>' + msg.result.error_msg,
            }).then((result) => {
              if (result.value) {
                hide_modal_waiting_transaction();
              }
            })
            $('.submit-seat-train').removeClass("running");
            hide_modal_waiting_transaction();
            $('.change-seat-train-buttons').prop('disabled', false);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error train manual seat');
            hide_modal_waiting_transaction();
            $('.submit-seat-train').removeClass("running");
            $('.change-seat-train-buttons').prop('disabled', false);
       },timeout: 480000
    });
}

function gotoForm(){
    document.getElementById('train_searchForm').submit();
}

function update_service_charge(type){
    repricing_order_number = '';
    if(type == 'booking'){
        upsell = []
        for(i in train_get_detail.result.response.passengers){
            for(j in train_get_detail.result.response.passengers[i].sale_service_charges){
                currency = train_get_detail.result.response.passengers[i].sale_service_charges[j].FARE.currency;
            }
            list_price = []
            if(document.getElementById(train_get_detail.result.response.passengers[i].name+'_repricing').innerHTML != '-'){
                list_price.push({
                    'amount': parseInt(document.getElementById(train_get_detail.result.response.passengers[i].name+'_repricing').innerHTML.split(',').join('')),
                    'currency_code': currency
                });
                upsell.push({
                    'sequence': train_get_detail.result.response.passengers[i].sequence,
                    'pricing': JSON.parse(JSON.stringify(list_price))
                });
            }
        }
        repricing_order_number = order_number;
    }else{
        upsell_price_dict = {};
        upsell = []
        counter_pax = 0;
        currency = price.currency;
        for(i in passengers){
            list_price = []
            if(i != 'booker' && i != 'contact'){
                upsell_price_dict[i] = 0
                for(k in passengers[i]){
                    if(document.getElementById(passengers[i][k].first_name+passengers[i][k].last_name+'_repricing').innerHTML != '-' && document.getElementById(passengers[i][k].first_name+passengers[i][k].last_name+'_repricing').innerHTML != '0'){
                        list_price.push({
                            'amount': parseInt(document.getElementById(passengers[i][k].first_name+passengers[i][k].last_name+'_repricing').innerHTML.split(',').join('')),
                            'currency_code': currency
                        });
                        upsell_price_dict[i] += parseInt(document.getElementById(passengers[i][k].first_name+passengers[i][k].last_name+'_repricing').innerHTML.split(',').join(''));
                        upsell.push({
                            'sequence': counter_pax,
                            'pricing': JSON.parse(JSON.stringify(list_price)),
                            'pax_type': i
                        });
                        list_price = [];
                    }
                    counter_pax++;
                }
            }
        }
    }
    $.ajax({
       type: "POST",
       url: "/webservice/train",
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
                    price_arr_repricing = {};
                    pax_type_repricing = [];
                    please_wait_transaction();
                    train_get_booking(repricing_order_number);
                }else{
                    price_arr_repricing = {};
                    pax_type_repricing = [];
                    train_detail();
                }

                $('#myModalRepricing').modal('hide');
           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
           }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error train service charge </span>' + msg.result.error_msg,
                })
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error train service charge');
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
       url: "/webservice/train",
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
                        train_get_booking(repricing_order_number);
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
                  html: '<span style="color: #ff9900;">Error train update booker insentif </span>' + msg.result.error_msg,
                })
                $('.loader-rodextrip').fadeOut();
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error train update booker insentif');
            $('.loader-rodextrip').fadeOut();
       },timeout: 60000
    });

}

function upload_image(){
    var formData = new FormData($('#train_review').get(0));
    formData.append('signature', signature)
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/content",
       headers:{
            'action': 'update_image_passenger',
       },
       data: formData,
       success: function(msg) {
            if(msg.result.error_code == 0){
                img_list = msg.result.response;
                //adult
                for(var i=0;i<adult;i++){
                    index = i+1;
                    //list gambar identity
                    for(var j=0;j<100;j++){
                        try{
                            if(document.getElementById('adult_identity'+index+'_'+j+'_delete').checked == true)
                                img_list.push([document.getElementById('adult_identity'+index+'_'+j+'_image_seq_id').value, 2, "adult_files_attachment_identity1"]);
                        }catch(err){
                            //gambar habis
                            break;
                        }
                    }

                }
                //infant
                for(var i=0;i<infant;i++){
                    index = i+1;
                    //list gambar identity
                    for(var j=0;j<100;j++){
                        try{
                            if(document.getElementById('infant_identity'+index+'_'+j+'_delete').checked == true)
                                img_list.push([document.getElementById('infant_identity'+index+'_'+j+'_image_seq_id').value, 2, 'infant_files_attachment_identity1']);
                        }catch(err){
                            //gambar habis
                            break;
                        }
                    }

                }
                document.getElementById('image_list_data').value = JSON.stringify(img_list)
                document.getElementById('train_review').submit();
                //document.getElementById('form_admin').submit();
            }else{
                //swal error image tidak terupload
                document.getElementById('train_review').submit();
            }
       },
       contentType:false,
       processData:false,
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error update passenger');
            document.getElementById('update_passenger_customer').disabled = false;
       }
    });
}

function reset_train_filter(){
    for(i in cabin_list){
        document.getElementById('checkbox_cabin'+i).checked = false;
        if(document.getElementById('checkbox_cabin2'+i))
            document.getElementById('checkbox_cabin2'+i).checked = false;
        cabin_list[i].status = false;
    }for(i in departure_list){
        if(i == 0){
            document.getElementById('checkbox_departure_time'+i).checked = true;
            if(document.getElementById('checkbox_departure_time2'+i))
                document.getElementById('checkbox_departure_time2'+i).checked = true;
            departure_list[i].status = true;
        }else{
            document.getElementById('checkbox_departure_time'+i).checked = false;
            if(document.getElementById('checkbox_departure_time2'+i))
                document.getElementById('checkbox_departure_time2'+i).checked = false;
            departure_list[i].status = false;
        }
    }
    for(i in arrival_list){
        if(i == 0){
            document.getElementById('checkbox_arrival_time'+i).checked = true;
            if(document.getElementById('checkbox_arrival_time2'+i))
                document.getElementById('checkbox_arrival_time2'+i).checked = true;
            arrival_list[i].status = true;
        }else{
            document.getElementById('checkbox_arrival_time'+i).checked = false;
            if(document.getElementById('checkbox_arrival_time2'+i))
                document.getElementById('checkbox_arrival_time2'+i).checked = false;
            arrival_list[i].status = false;
        }
    }
}