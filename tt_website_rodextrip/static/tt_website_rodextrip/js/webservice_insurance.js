var origin_insurance_destination = [];
var destination_insurance_destination = [];
function insurance_signin(data){
    $.ajax({
       type: "POST",
       url: "/webservice/lab_pintar",
       headers:{
            'action': 'signin',
       },
//       url: "{% url 'tt_backend_rodextrip:social_media_tree_update' %}",
       data: {},
       success: function(msg) {
       try{
           console.log(msg);
           if(msg.result.error_code == 0){
               insurance_signature = msg.result.response.signature;
               signature = msg.result.response.signature;
               insurance_get_config();
               if(data == '')
                    insurance_get_availability();
               else
                    insurance_get_booking(data);
           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
           }else{
               Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: msg.result.error_msg,
               })
               try{
                $("#show_loading_booking_lab_pintar").hide();
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
          error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error Swab Express signin');
          $("#barFlightSearch").hide();
          $("#waitFlightSearch").hide();
          $('.loader-rodextrip').fadeOut();
          try{
            $("#show_loading_booking_lab_pintar").hide();
          }catch(err){}
       },timeout: 60000
    });
}

function insurance_get_config(page=false){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/insurance",
       headers:{
            'action': 'get_config',
       },
//       url: "{% url 'tt_backend_rodextrip:social_media_tree_update' %}",
       data: {
            'signature': signature
       },
       success: function(msg) {
       try{
           console.log(msg);
           if(msg.result.error_code == 0){
                insurance_config = msg.result.response;
                for(i in insurance_config){
                    for(j in insurance_config[i].City)
                        for(k in insurance_config[i].City[j]){
                            if(j == 'Domestic')
                                origin_insurance_destination.push(insurance_config[i].City[j][k] + ' - ' + j);
                            destination_insurance_destination.push(insurance_config[i].City[j][k] + ' - ' + j);
                        }
                    break;
                }
                if(page == 'home'){
                    for(i in insurance_config){
                        for(j in insurance_config[i]['Plan Trip']){
                            choice += '<option value="'+insurance_config[i]['Plan Trip'][j]+'">'+insurance_config[i]['Plan Trip'][j]+'</option>';
                        }
                    }
                    document.getElementById('insurance_trip').innerHTML += choice;
                    $('#insurance_trip').niceSelect('update');
                }
                if(page == 'passenger'){
                    var choice = '<option value=""></option>';
                    for(i in insurance_config){
                        for(j in insurance_config[i]['Table Relation']){
                            choice += '<option value="'+j+'">'+j+'</option>';
                        }
                    }
                    for(var i=1;i<=parseInt(insurance_request.adult);i++){
                        if(insurance_pick.type_trip_name == 'Family'){
                            document.getElementById('adult_relation1_relation'+i).innerHTML += choice;
                            document.getElementById('adult_relation2_relation'+i).innerHTML += choice;
                            document.getElementById('adult_relation3_relation'+i).innerHTML += choice;
                            document.getElementById('adult_relation4_relation'+i).innerHTML += choice;
                            $('#adult_relation1_relation'+i).niceSelect('update');
                            $('#adult_relation2_relation'+i).niceSelect('update');
                            $('#adult_relation3_relation'+i).niceSelect('update');
                            $('#adult_relation4_relation'+i).niceSelect('update');
                        }
                        document.getElementById('adult_relation5_relation'+i).innerHTML += choice;
                        $('#adult_relation5_relation'+i).niceSelect('update');
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
            $("#show_loading_booking_medical").hide();
          }catch(err){}
       },timeout: 60000
    });
}

function insurance_check_search_values(){
    type = '';
    error_log = '';

    if(document.getElementById('insurance_origin').value.split(' - ').length != 2)
        error_log+= 'Please use autocomplete for origin\n';
    if(document.getElementById('insurance_destination').value.split(' - ').length != 2)
        error_log+= 'Please use autocomplete for destination\n';

    if(error_log == ''){
        $('.button-search').addClass("running");
        get_captcha('recaptcha_insurance','insurance');
    }else{
        $('.button-search').removeClass("running");
        alert(error_log);
    }
}

function insurance_get_availability(){
    $.ajax({
       type: "POST",
       url: "/webservice/insurance",
       headers:{
            'action': 'get_availability',
       },
//       url: "{% url 'tt_backend_rodextrip:social_media_tree_update' %}",
       data: {
            'signature': signature
       },
       success: function(msg) {
       try{
           console.log(msg);
           if(msg.result.error_code == 0){
                insurance_data = msg.result.response
                if (insurance_data.length == 0){
                    text += `
                    <div class="col-lg-12">
                        <div style="text-align:center">
                            <img src="/static/tt_website_rodextrip/images/nofound/no-activity.png" alt="Not Found Activity" style="width:70px; height:70px;" title="" />
                            <br/>
                        </div>
                        <center><div class="alert alert-warning" role="alert" style="margin-top:15px; border:1px solid #cdcdcd;"><h6><i class="fas fa-search-minus"></i> Oops! Activity not found. Please try again or search another activity. </h6></div></center>
                    </div>`;
                }else{
                    var sequence = 0;
                    var text = '';
                    for(i in insurance_data){
                        for(j in insurance_data[i]){
                            text+=`
                               <div class="col-lg-4 col-md-4 activity_box" style="min-height:unset;">
                                    <div class="single-recent-blog-post item" style="border:1px solid #cdcdcd;">
                                        <div class="single-destination relative">`;

                                            text+=`<div class="thumb relative" style="cursor:pointer; border-bottom:1px solid #cdcdcd; height:200px; background: white url('`+static_path_url_server+`/public/tour_packages/not_found.png'); background-size: cover; background-repeat: no-repeat; background-position: center center;" onclick="go_to_detail('`+insurance_data[i][j].sequence+`')">`;
                                            text+=`
                                                <div class="overlay overlay-bg"></div>
                                            </div>
                                            <div class="card card-effect-promotion" style="border:unset;">
                                                <div class="card-body">
                                                    <div class="row details">
                                                        <div class="col-lg-12">
                                                            <span style="float:left; font-size:16px;font-weight:bold;">`+insurance_data[i][j].carrier_name+` </span><br/>
                                                            <span style="float:left; font-size:12px;">Destination Area: `+insurance_data[i][j].data_name+`  </span> <span id="`+i+sequence+`" ><i class="fas fa-info-circle"></i></span>
                                                        </div>
                                                        <div class="col-lg-12">
                                                            <span style="float:left; font-size:16px;font-weight:bold;">IDR `+getrupiah(insurance_data[i][j].total_price)+`  </span>
                                                            <button style="float:right; line-height:32px;" type="button" class="primary-btn" onclick="go_to_detail('`+i+`','`+sequence+`')">BUY</button>
                                                        </div>
                                                        <div class="col-lg-12">
                                                            <span style="float:left; font-size:14px;color:blue;" onclick="window.open('`+insurance_data[i][j].pdf+`');">Benefit  </span>
                                                            <span style="float:right;font-size:10px;">`+i+`</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;
                                    text+=`
                               </div>`;
                           sequence++;
                        }
                    }
                    document.getElementById('insurance_ticket').innerHTML += text;
                    sequence = 0;
                    for(i in insurance_data){
                        for(j in insurance_data[i]){
                            new jBox('Tooltip', {
                                attach: '#'+i+sequence,
                                target: '#'+i+sequence,
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
                                content: insurance_data[i][j].info,
                            });
                            sequence++;
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
               }catch(err){}
           }
           $('#loading-search-insurance').hide();
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
          }catch(err){}
       },timeout: 180000
    });
}

function go_to_detail(provider, sequence){
    document.getElementById('time_limit_input').value = time_limit;
    document.getElementById('signature').value = signature;
    document.getElementById('data_insurance').value = JSON.stringify(insurance_data[provider][sequence]);
    document.getElementById('insurance_next').submit();
}

function insurance_get_token(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/insurance",
       headers:{
            'action': 'get_token',
       },
//       url: "{% url 'tt_backend_rodextrip:social_media_tree_update' %}",
       data: {
            'signature': signature
       },
       success: function(msg) {
       try{
           console.log(msg);
           if(msg.result.error_code == 0){

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
            $("#show_loading_booking_medical").hide();
          }catch(err){}
       },timeout: 60000
    });
}

function insurance_get_kurs(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/insurance",
       headers:{
            'action': 'get_kurs',
       },
//       url: "{% url 'tt_backend_rodextrip:social_media_tree_update' %}",
       data: {
            'signature': signature
       },
       success: function(msg) {
       try{
           console.log(msg);
           if(msg.result.error_code == 0){

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
            $("#show_loading_booking_medical").hide();
          }catch(err){}
       },timeout: 60000
    });
}

function insurance_get_premi(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/insurance",
       headers:{
            'action': 'get_premi',
       },
//       url: "{% url 'tt_backend_rodextrip:social_media_tree_update' %}",
       data: {
            'signature': signature
       },
       success: function(msg) {
       try{
           console.log(msg);
           if(msg.result.error_code == 0){

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
            $("#show_loading_booking_medical").hide();
          }catch(err){}
       },timeout: 60000
    });
}

function insurance_check_benefit_data(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/insurance",
       headers:{
            'action': 'check_benefit_data',
       },
//       url: "{% url 'tt_backend_rodextrip:social_media_tree_update' %}",
       data: {
            'signature': signature
       },
       success: function(msg) {
       try{
           console.log(msg);
           if(msg.result.error_code == 0){

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
            $("#show_loading_booking_medical").hide();
          }catch(err){}
       },timeout: 60000
    });
}

function insurance_updata(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/insurance",
       headers:{
            'action': 'updata',
       },
//       url: "{% url 'tt_backend_rodextrip:social_media_tree_update' %}",
       data: {
            'signature': signature
       },
       success: function(msg) {
       try{
           console.log(msg);
           if(msg.result.error_code == 0){

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
            $("#show_loading_booking_medical").hide();
          }catch(err){}
       },timeout: 60000
    });
}

function insurance_commit_booking(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/insurance",
       headers:{
            'action': 'commit_booking',
       },
//       url: "{% url 'tt_backend_rodextrip:social_media_tree_update' %}",
       data: {
            'signature': signature
       },
       success: function(msg) {
       try{
           console.log(msg);
           if(msg.result.error_code == 0){

           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
           }else{
               Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: msg.result.error_msg,
               })
               try{
                $("#show_loading_booking_insurance").hide();
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
          error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error insurance commit booking');
          $("#barFlightSearch").hide();
          $("#waitFlightSearch").hide();
          $('.loader-rodextrip').fadeOut();
          try{
            $("#show_loading_booking_insurance").hide();
          }catch(err){}
       },timeout: 60000
    });
}

function get_insurance_data_passenger_page(){
    $.ajax({
       type: "POST",
       url: "/webservice/insurance",
       headers:{
            'action': 'get_data_passenger_page',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
           console.log(msg);
           insurance_pick = msg.insurance_pick;
           insurance_request = msg.insurance_request;
           if(insurance_pick.type_trip_name == 'Family'){
                for(i=0;i<adult;i++){
                    document.getElementById('adult_additional_data_for_insurance'+parseInt(parseInt(i)+1)).style.display = 'block';
                }
           }
           insurance_get_config('passenger');
           //harga kanan
           price_detail();
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {

       },timeout: 60000
    });
}

function get_insurance_data_review_page(){
    $.ajax({
       type: "POST",
       url: "/webservice/insurance",
       headers:{
            'action': 'get_data_review_page',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
           console.log(msg);
           insurance_pick = msg.insurance_pick;
           insurance_request = msg.insurance_request;
           insurance_passenger = msg.insurance_passenger;

           //harga kanan
           price_detail();
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {

       },timeout: 60000
    });
}

function insurance_commit_booking(){
    Swal.fire({
      title: 'Are you sure want to Request this booking?',
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

            if(typeof(vendor) === 'undefined')
                vendor = '';
            if(typeof(test_type) === 'undefined')
                test_type = '';
            data = {
                'signature': signature,
                'provider': vendor,
                'test_type': test_type,
                'force_issued': 0
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
               url: "/webservice/insurance",
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
                                send_url_booking('insurance', btoa(msg.result.response.order_number), msg.result.response.order_number);
                                document.getElementById('order_number').value = msg.result.response.order_number;
                                document.getElementById("passengers").value = JSON.stringify(passengers);
                                document.getElementById("signature").value = signature;
                                document.getElementById("provider").value = 'insurance';
                                document.getElementById("type").value = 'insurance_review';
                                document.getElementById("voucher_code").value = voucher_code;
                                document.getElementById("discount").value = JSON.stringify(discount_voucher);
                                document.getElementById("session_time_input").value = 1200;
                                document.getElementById('insurance_issued').submit();

                              }else{
                                document.getElementById('insurance_booking').innerHTML+= '<input type="hidden" name="order_number" value='+msg.result.response.order_number+'>';
                                document.getElementById('insurance_booking').action = '/insurance/booking/' + btoa(msg.result.response.order_number);
                                document.getElementById('insurance_booking').submit();
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
                                send_url_booking('insurance', btoa(msg.result.response.order_number), msg.result.response.order_number);
                                document.getElementById('order_number').value = msg.result.response.order_number;
                                document.getElementById("passengers").value = JSON.stringify(passengers);
                                document.getElementById("signature").value = signature;
                                document.getElementById("provider").value = 'insurance';
                                document.getElementById("type").value = 'insurance_review';
                                document.getElementById("voucher_code").value = voucher_code;
                                document.getElementById("discount").value = JSON.stringify(discount_voucher);
                                document.getElementById("session_time_input").value = 1200;
                                document.getElementById('insurance_issued').submit();

                              }else{
                                document.getElementById('insurance_booking').innerHTML+= '<input type="hidden" name="order_number" value='+msg.result.response.order_number+'>';
                                document.getElementById('insurance_booking').action = '/insurance/booking/' + btoa(msg.result.response.order_number);
                                document.getElementById('insurance_booking').submit();
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
                                send_url_booking('insurance', btoa(msg.result.response.order_number), msg.result.response.order_number);
                                document.getElementById('order_number').value = msg.result.response.order_number;
                                document.getElementById("passengers").value = JSON.stringify(passengers);
                                document.getElementById("signature").value = signature;
                                document.getElementById("provider").value = 'insurance';
                                document.getElementById("type").value = 'insurance_review';
                                document.getElementById("voucher_code").value = voucher_code;
                                document.getElementById("discount").value = JSON.stringify(discount_voucher);
                                document.getElementById("session_time_input").value = 200;
                                document.getElementById('insurance_issued').submit();

                              }else{
                                document.getElementById('insurance_booking').innerHTML+= '<input type="hidden" name="order_number" value='+msg.result.response.order_number+'>';
                                document.getElementById('insurance_booking').action = '/insurance/booking/' + btoa(msg.result.response.order_number);
                                document.getElementById('insurance_booking').submit();
                              }
                           })
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

               },timeout: 60000
            });
        }
    })
}

function price_detail(){
    price = {'fare':0,'tax':0,'rac':0,'roc':0,'currency':'IDR','pax_count': parseInt(insurance_request['adult'])};
    for(i in insurance_pick.service_charges){
        if(insurance_pick.service_charges[i].charge_type == 'FARE'){
            price['fare'] = insurance_pick.service_charges[i].amount;
        }else if(insurance_pick.service_charges[i].charge_type == 'TAX'){
            price['tax'] = insurance_pick.service_charges[i].amount;
        }else if(insurance_pick.service_charges[i].charge_type == 'RAC'){
            price['rac'] = insurance_pick.service_charges[i].amount;
        }else if(insurance_pick.service_charges[i].charge_type == 'ROC'){
            price['roc'] = insurance_pick.service_charges[i].amount;
        }
    }
    text = '';
    text += `<h6>`+insurance_pick.carrier_name+`</h6>`;
    text+=`
        <div class="row" style="padding:5px;">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="text-align:left;">
                <hr/>
            </div>
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="text-align:left;">
                <span style="font-size:13px; font-weight:500;">`+price.pax_count+`x Customer Fare @`+price.currency +' '+getrupiah(Math.ceil(price.fare))+`</span><br/>
            </div>
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="text-align:left;">
                <span style="font-size:13px; font-weight:500;">    Tax @`+price.currency+` `+getrupiah(Math.ceil(price.tax + price.roc))+`</span>
            </div>
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="text-align:right;">
                <span style="font-size:13px; font-weight:500;">`+price.currency+` `+getrupiah(Math.ceil((price.fare+price.roc + price.tax) * price.pax_count))+`</span>
            </div>
            <div class="col-lg-12">
                <hr style="border:1px solid #e0e0e0; margin-top:5px; margin-bottom:5px;"/>
            </div>
       </div>`;
    document.getElementById('insurance_detail_table').innerHTML += text;
}

function check_passenger(){
    //booker
    error_log = '';
    //check booker jika teropong
    length_name = 100;

    try{
        for(i in passenger_data_pick){
            if(passenger_data_pick[i].sequence != 'booker'){
                passenger_check = {
                    'type': passenger_data_pick[i].sequence.substr(0, passenger_data_pick[i].sequence.length-1),
                    'number': passenger_data_pick[i].sequence.substr(passenger_data_pick[i].sequence.length-1, passenger_data_pick[i].sequence.length)
                }
                if(document.getElementById(passenger_check.type+passenger_check.number).value == passenger_data_pick[i].seq_id){
                    if(document.getElementById(passenger_check.type+'_title'+passenger_check.number).value != passenger_data_pick[i].title ||
                       document.getElementById(passenger_check.type+'_first_name'+passenger_check.number).value != passenger_data_pick[i].first_name ||
                       document.getElementById(passenger_check.type+'_last_name'+passenger_check.number).value != passenger_data_pick[i].last_name)
                        error_log += "Search "+passenger_check.type+" "+passenger_check.number+" doesn't match!</br>\nPlease don't use inspect element!</br>\n";
                }
           }else if(passenger_data_pick[i].sequence == 'booker'){
                if(document.getElementById('booker_title').value != passenger_data_pick[i].title ||
                    document.getElementById('booker_first_name').value != passenger_data_pick[i].first_name ||
                    document.getElementById('booker_last_name').value != passenger_data_pick[i].last_name)
                    error_log += "Search booker doesn't match!</br>\nPlease don't use inspect element!</br>\n";
           }
        }
    }catch(err){

    }
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

    var radios = document.getElementsByName('myRadios');
    for (var j = 0, length = radios.length; j < length; j++) {
        if (radios[j].checked) {
            // do whatever you want with the checked radio
            booker_copy = radios[j].value;
            // only one radio can be logically checked, don't check the rest
            break;
        }
    }
    if(booker_copy == 'yes')
        if(document.getElementById('booker_title').value != document.getElementById('adult_title1').value ||
           document.getElementById('booker_first_name').value != document.getElementById('adult_first_name1').value ||
           document.getElementById('booker_last_name').value != document.getElementById('adult_last_name1').value)
                error_log += 'Copy booker to passenger true, value title, first name, and last name has to be same!</br>\n';

   last_departure_date = insurance_request.date_start;
   //adult
   for(i=1;i<=adult;i++){

       if(check_name(document.getElementById('adult_title'+i).value,
            document.getElementById('adult_first_name'+i).value,
            document.getElementById('adult_last_name'+i).value,
            length_name) == false){
           error_log+= 'Total of adult '+i+' name maximum '+length_name+' characters!</br>\n';
           document.getElementById('adult_first_name'+i).style['border-color'] = 'red';
           document.getElementById('adult_last_name'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('adult_first_name'+i).style['border-color'] = '#EFEFEF';
           document.getElementById('adult_last_name'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('adult_first_name'+i).value == '' || check_word(document.getElementById('adult_first_name'+i).value) == false){
           if(document.getElementById('adult_first_name'+i).value == '')
               error_log+= 'Please input first name of adult passenger '+i+'!</br>\n';
           else if(check_word(document.getElementById('adult_first_name'+i).value) == false)
               error_log+= 'Please use alpha characters first name of adult passenger '+i+'!</br>\n';
           document.getElementById('adult_first_name'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('adult_first_name'+i).style['border-color'] = '#EFEFEF';
       }
       //check lastname
       if(check_name_airline(document.getElementById('adult_first_name'+i).value, document.getElementById('adult_last_name'+i).value) != ''){
           error_log += 'Please '+check_name_airline(document.getElementById('adult_first_name'+i).value, document.getElementById('adult_last_name'+i).value)+' adult passenger '+i+'!</br>\n';
           document.getElementById('adult_last_name'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('adult_last_name'+i).style['border-color'] = '#EFEFEF';
       }
       if(check_date(document.getElementById('adult_birth_date'+i).value)==false){
           error_log+= 'Birth date wrong for passenger adult '+i+'!</br>\n';
           document.getElementById('adult_birth_date'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('adult_birth_date'+i).style['border-color'] = '#EFEFEF';
       }
       if(document.getElementById('adult_nationality'+i).value == ''){
           error_log+= 'Please fill nationality for passenger adult '+i+'!</br>\n';
           document.getElementById('adult_nationality'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('adult_nationality'+i).style['border-color'] = '#EFEFEF';
       }
        //KTP
        if(document.getElementById('adult_identity_type'+i).style.display == 'block'){
           if(document.getElementById('adult_id_type'+i).value == 'ktp'){
                if(check_ktp(document.getElementById('adult_passport_number'+i).value) == false){
                   error_log+= 'Please fill id number, nik only contain 16 digits for passenger adult '+i+'!</br>\n';
                   document.getElementById('adult_passport_number'+i).style['border-color'] = 'red';
                }else{
                   document.getElementById('adult_passport_number'+i).style['border-color'] = '#EFEFEF';
                }if(document.getElementById('adult_country_of_issued'+i).value == '' || document.getElementById('adult_country_of_issued'+i).value == 'Country of Issued'){
                   error_log+= 'Please fill country of issued for passenger adult '+i+'!</br>\n';
                   document.getElementById('adult_country_of_issued'+i).style['border-color'] = 'red';
                }else{
                   document.getElementById('adult_country_of_issued'+i).style['border-color'] = '#EFEFEF';
                }

           }
        }
        //PASSPORT
        if(insurance_pick.sector_type == 'International'){
           if(document.getElementById('adult_passport_id_type'+i).value == 'passport'){
               if(document.getElementById('adult_passport_id_type'+i).value == 'passport' && check_passport(document.getElementById('adult_passport_passport_number'+i).value) == false){
                   error_log+= 'Please fill id number, passport only contain more than 6 digits  for passenger adult '+i+'!</br>\n';
                   document.getElementById('adult_passport_passport_number'+i).style['border-color'] = 'red';
               }else{
                   document.getElementById('adult_passport_passport_number'+i).style['border-color'] = '#EFEFEF';
               }
               if(document.getElementById('adult_passport_passport_expired_date'+i).value == ''){
                   error_log+= 'Please fill passport expired date for passenger adult '+i+'!</br>\n';
                   document.getElementById('adult_passport_passport_expired_date'+i).style['border-color'] = 'red';
               }else{
                   duration = moment.duration(moment(document.getElementById('adult_passport_passport_expired_date'+i).value).diff(last_departure_date));
                   //CHECK EXPIRED
                   if(duration._milliseconds < 0 ){
                        error_log+= 'Please update passport expired date for passenger adult '+i+'!</br>\n';
                        document.getElementById('adult_passport_passport_expired_date'+i).style['border-color'] = 'red';
                   }else
                        document.getElementById('adult_passport_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
               }if(document.getElementById('adult_passport_passport_country_of_issued'+i).value == ''){
                   error_log+= 'Please fill country of issued for passenger adult '+i+'!</br>\n';
                   document.getElementById('adult_passport_passport_country_of_issued'+i).style['border-color'] = 'red';
               }else{
                   document.getElementById('adult_passport_passport_country_of_issued'+i).style['border-color'] = '#EFEFEF';
               }
           }
        }

        //PAKET FAMILY
        if(insurance_pick.type_trip_name == 'Family'){
            if(check_name(document.getElementById('adult_relation1_title'+i).value,
                document.getElementById('adult_relation1_first_name'+i).value,
                document.getElementById('adult_relation1_last_name'+i).value,
                length_name) == false){
               error_log+= 'Total of spouse '+i+' name maximum '+length_name+' characters!</br>\n';
               document.getElementById('adult_relation1_first_name'+i).style['border-color'] = 'red';
               document.getElementById('adult_relation1_last_name'+i).style['border-color'] = 'red';
            }else{
               document.getElementById('adult_relation1_first_name'+i).style['border-color'] = '#EFEFEF';
               document.getElementById('adult_relation1_last_name'+i).style['border-color'] = '#EFEFEF';
            }if(document.getElementById('adult_relation1_first_name'+i).value == '' || check_word(document.getElementById('adult_relation1_first_name'+i).value) == false){
               if(document.getElementById('adult_relation1_first_name'+i).value == '')
                   error_log+= 'Please input first name of spouse customer '+i+'!</br>\n';
               else if(check_word(document.getElementById('adult_relation1_first_name'+i).value) == false)
                   error_log+= 'Please use alpha characters first name of spouse customer '+i+'!</br>\n';
               document.getElementById('adult_relation1_first_name'+i).style['border-color'] = 'red';
            }else{
               document.getElementById('adult_relation1_first_name'+i).style['border-color'] = '#EFEFEF';
            }

            if(document.getElementById('adult_relation1_relation'+i).value == '' && document.getElementById('adult_relation1_first_name'+i).value != ''){
                error_log+= 'Please fill first relation for passenger adult '+i+'!</br>\n';
                document.getElementById('adult_relation1_relation'+i).style['border-color'] = 'red';
            }else{
                document.getElementById('adult_relation1_relation'+i).style['border-color'] = '#EFEFEF';
            }

            //PASSPORT
            if(insurance_pick.sector_type == 'International'){
               if(document.getElementById('adult_relation1_identity_type'+i).value == 'passport'){
                   if(document.getElementById('adult_relation1_id_type'+i).value == 'passport' && check_passport(document.getElementById('adult_relation1_passport_number'+i).value) == false){
                       error_log+= 'Please fill id number, passport only contain more than 6 digits for spouse customer'+i+'!</br>\n';
                       document.getElementById('adult_relation1_passport_number'+i).style['border-color'] = 'red';
                   }else{
                       document.getElementById('adult_relation1_passport_number'+i).style['border-color'] = '#EFEFEF';
                   }
                   if(document.getElementById('adult_relation1_expired_date'+i).value == ''){
                       error_log+= 'Please fill passport expired date for spouse customer '+i+'!</br>\n';
                       document.getElementById('adult_relation1_expired_date'+i).style['border-color'] = 'red';
                   }else{
                       duration = moment.duration(moment(document.getElementById('adult_relation1_expired_date'+i).value).diff(last_departure_date));
                       //CHECK EXPIRED
                       if(duration._milliseconds < 0 ){
                            error_log+= 'Please update passport expired date for spouse customer '+i+'!</br>\n';
                            document.getElementById('adult_relation1_expired_date'+i).style['border-color'] = 'red';
                       }else
                            document.getElementById('adult_relation1_expired_date'+i).style['border-color'] = '#EFEFEF';
                   }if(document.getElementById('adult_relation1_country_of_issued'+i).value == ''){
                       error_log+= 'Please fill country of issued for passenger adult '+i+'!</br>\n';
                       document.getElementById('adult_relation1_country_of_issued'+i).style['border-color'] = 'red';
                   }else{
                       document.getElementById('adult_relation1_country_of_issued'+i).style['border-color'] = '#EFEFEF';
                   }
               }
            }

            //ANAK 1 CAN BE NOT FILLED

            if(document.getElementById('adult_relation2_title'+i).value != '' && document.getElementById('adult_relation2_first_name'+i).value != '' && document.getElementById('adult_relation2_last_name'+i).value != ''){
                if(check_name(document.getElementById('adult_relation2_title'+i).value,
                    document.getElementById('adult_relation2_first_name'+i).value,
                    document.getElementById('adult_relation2_last_name'+i).value,
                    length_name) == false){
                   error_log+= 'Total of child 1 for customer '+i+' name maximum '+length_name+' characters!</br>\n';
                   document.getElementById('adult_relation2_first_name'+i).style['border-color'] = 'red';
                   document.getElementById('adult_relation2_last_name'+i).style['border-color'] = 'red';
                }else{
                   document.getElementById('adult_relation2_first_name'+i).style['border-color'] = '#EFEFEF';
                   document.getElementById('adult_relation2_last_name'+i).style['border-color'] = '#EFEFEF';
                }if(document.getElementById('adult_relation2_first_name'+i).value == '' || check_word(document.getElementById('adult_relation2_first_name'+i).value) == false){
                   if(document.getElementById('adult_relation2_first_name'+i).value == '')
                       error_log+= 'Please input first name of child 1 for customer '+i+'!</br>\n';
                   else if(check_word(document.getElementById('adult_relation2_first_name'+i).value) == false)
                       error_log+= 'Please use alpha characters first name of child 1 for customer '+i+'!</br>\n';
                   document.getElementById('adult_relation2_first_name'+i).style['border-color'] = 'red';
                }else{
                   document.getElementById('adult_relation2_first_name'+i).style['border-color'] = '#EFEFEF';
                }

                if(document.getElementById('adult_relation2_relation'+i).value == ''){
                    error_log+= 'Please fill second relation for passenger adult '+i+'!</br>\n';
                    document.getElementById('adult_relation2_relation'+i).style['border-color'] = 'red';
                }else{
                    document.getElementById('adult_relation2_relation'+i).style['border-color'] = '#EFEFEF';
                }

                //PASSPORT
                if(insurance_pick.sector_type == 'International'){
                   if(document.getElementById('adult_relation2_identity_type'+i).value == 'passport'){
                       if(document.getElementById('adult_relation2_id_type'+i).value == 'passport' && check_passport(document.getElementById('adult_relation2_passport_number'+i).value) == false){
                           error_log+= 'Please fill id number, passport only contain more than 6 digits for spouse customer'+i+'!</br>\n';
                           document.getElementById('adult_relation2_passport_number'+i).style['border-color'] = 'red';
                       }else{
                           document.getElementById('adult_relation2_passport_number'+i).style['border-color'] = '#EFEFEF';
                       }
                       if(document.getElementById('adult_relation2_expired_date'+i).value == ''){
                           error_log+= 'Please fill passport expired date for spouse customer '+i+'!</br>\n';
                           document.getElementById('adult_relation2_expired_date'+i).style['border-color'] = 'red';
                       }else{
                           duration = moment.duration(moment(document.getElementById('adult_relation2_expired_date'+i).value).diff(last_departure_date));
                           //CHECK EXPIRED
                           if(duration._milliseconds < 0 ){
                                error_log+= 'Please update passport expired date for spouse customer '+i+'!</br>\n';
                                document.getElementById('adult_relation2_expired_date'+i).style['border-color'] = 'red';
                           }else
                                document.getElementById('adult_relation2_expired_date'+i).style['border-color'] = '#EFEFEF';
                       }if(document.getElementById('adult_relation2_country_of_issued'+i).value == ''){
                           error_log+= 'Please fill country of issued for passenger adult '+i+'!</br>\n';
                           document.getElementById('adult_relation2_country_of_issued'+i).style['border-color'] = 'red';
                       }else{
                           document.getElementById('adult_relation2_country_of_issued'+i).style['border-color'] = '#EFEFEF';
                       }
                   }
                }
            }

                //ANAK 2 IF FIRST NAME KOSONG LEWAT
            if(document.getElementById('adult_relation3_title'+i).value != '' && document.getElementById('adult_relation3_first_name'+i).value != '' && document.getElementById('adult_relation3_last_name'+i).value != ''){
                if(check_name(document.getElementById('adult_relation3_title'+i).value,
                    document.getElementById('adult_relation3_first_name'+i).value,
                    document.getElementById('adult_relation3_last_name'+i).value,
                    length_name) == false){
                   error_log+= 'Total of child 2 for customer '+i+' name maximum '+length_name+' characters!</br>\n';
                   document.getElementById('adult_relation3_first_name'+i).style['border-color'] = 'red';
                   document.getElementById('adult_relation3_last_name'+i).style['border-color'] = 'red';
                }else{
                   document.getElementById('adult_relation3_first_name'+i).style['border-color'] = '#EFEFEF';
                   document.getElementById('adult_relation3_last_name'+i).style['border-color'] = '#EFEFEF';
                }if(document.getElementById('adult_relation3_first_name'+i).value == '' || check_word(document.getElementById('adult_relation3_first_name'+i).value) == false){
                   if(document.getElementById('adult_relation3_first_name'+i).value == '')
                       error_log+= 'Please input first name of child 2 for customer '+i+'!</br>\n';
                   else if(check_word(document.getElementById('adult_relation3_first_name'+i).value) == false)
                       error_log+= 'Please use alpha characters first name of child 2 for customer '+i+'!</br>\n';
                   document.getElementById('adult_relation3_first_name'+i).style['border-color'] = 'red';
                }else{
                   document.getElementById('adult_relation3_first_name'+i).style['border-color'] = '#EFEFEF';
                }

                if(document.getElementById('adult_relation3_relation'+i).value == ''){
                    error_log+= 'Please fill third relation for passenger adult '+i+'!</br>\n';
                    document.getElementById('adult_relation3_relation'+i).style['border-color'] = 'red';
                }else{
                    document.getElementById('adult_relation3_relation'+i).style['border-color'] = '#EFEFEF';
                }
                //PASSPORT
                if(insurance_pick.sector_type == 'International'){
                   if(document.getElementById('adult_relation3_identity_type'+i).value == 'passport'){
                       if(document.getElementById('adult_relation3_id_type'+i).value == 'passport' && check_passport(document.getElementById('adult_relation3_passport_number'+i).value) == false){
                           error_log+= 'Please fill id number, passport only contain more than 6 digits for spouse customer'+i+'!</br>\n';
                           document.getElementById('adult_relation3_passport_number'+i).style['border-color'] = 'red';
                       }else{
                           document.getElementById('adult_relation3_passport_number'+i).style['border-color'] = '#EFEFEF';
                       }
                       if(document.getElementById('adult_relation3_expired_date'+i).value == ''){
                           error_log+= 'Please fill passport expired date for spouse customer '+i+'!</br>\n';
                           document.getElementById('adult_relation3_expired_date'+i).style['border-color'] = 'red';
                       }else{
                           duration = moment.duration(moment(document.getElementById('adult_relation3_expired_date'+i).value).diff(last_departure_date));
                           //CHECK EXPIRED
                           if(duration._milliseconds < 0 ){
                                error_log+= 'Please update passport expired date for spouse customer '+i+'!</br>\n';
                                document.getElementById('adult_relation3_expired_date'+i).style['border-color'] = 'red';
                           }else
                                document.getElementById('adult_relation3_expired_date'+i).style['border-color'] = '#EFEFEF';
                       }if(document.getElementById('adult_relation3_country_of_issued'+i).value == ''){
                           error_log+= 'Please fill country of issued for passenger adult '+i+'!</br>\n';
                           document.getElementById('adult_relation3_country_of_issued'+i).style['border-color'] = 'red';
                       }else{
                           document.getElementById('adult_relation3_country_of_issued'+i).style['border-color'] = '#EFEFEF';
                       }
                   }
                }
            }

            //ANAK 3 IF FIRST NAME KOSONG LEWAT
            if(document.getElementById('adult_relation4_title'+i).value != '' && document.getElementById('adult_relation4_first_name'+i).value != '' && document.getElementById('adult_relation4_last_name'+i).value != ''){
                if(check_name(document.getElementById('adult_relation4_title'+i).value,
                    document.getElementById('adult_relation4_first_name'+i).value,
                    document.getElementById('adult_relation4_last_name'+i).value,
                    length_name) == false){
                   error_log+= 'Total of child 3 for customer '+i+' name maximum '+length_name+' characters!</br>\n';
                   document.getElementById('adult_relation4_first_name'+i).style['border-color'] = 'red';
                   document.getElementById('adult_relation4_last_name'+i).style['border-color'] = 'red';
                }else{
                   document.getElementById('adult_relation4_first_name'+i).style['border-color'] = '#EFEFEF';
                   document.getElementById('adult_relation4_last_name'+i).style['border-color'] = '#EFEFEF';
                }if(document.getElementById('adult_relation4_first_name'+i).value == '' || check_word(document.getElementById('adult_relation4_first_name'+i).value) == false){
                   if(document.getElementById('adult_relation4_first_name'+i).value == '')
                       error_log+= 'Please input first name of child 3 for customer '+i+'!</br>\n';
                   else if(check_word(document.getElementById('adult_relation4_first_name'+i).value) == false)
                       error_log+= 'Please use alpha characters first name of child 3 for customer '+i+'!</br>\n';
                   document.getElementById('adult_relation4_first_name'+i).style['border-color'] = 'red';
                }else{
                   document.getElementById('adult_relation4_first_name'+i).style['border-color'] = '#EFEFEF';
                }

                if(document.getElementById('adult_relation4_relation'+i).value == ''){
                    error_log+= 'Please fill fourth relation for passenger adult '+i+'!</br>\n';
                    document.getElementById('adult_relation4_relation'+i).style['border-color'] = 'red';
                }else{
                    document.getElementById('adult_relation4_relation'+i).style['border-color'] = '#EFEFEF';
                }
                //PASSPORT
                if(insurance_pick.sector_type == 'International'){
                   if(document.getElementById('adult_relation4_identity_type'+i).value == 'passport'){
                       if(document.getElementById('adult_relation4_id_type'+i).value == 'passport' && check_passport(document.getElementById('adult_relation4_passport_number'+i).value) == false){
                           error_log+= 'Please fill id number, passport only contain more than 6 digits for spouse customer'+i+'!</br>\n';
                           document.getElementById('adult_relation4_passport_number'+i).style['border-color'] = 'red';
                       }else{
                           document.getElementById('adult_relation4_passport_number'+i).style['border-color'] = '#EFEFEF';
                       }
                       if(document.getElementById('adult_relation4_expired_date'+i).value == ''){
                           error_log+= 'Please fill passport expired date for spouse customer '+i+'!</br>\n';
                           document.getElementById('adult_relation4_expired_date'+i).style['border-color'] = 'red';
                       }else{
                           duration = moment.duration(moment(document.getElementById('adult_relation4_expired_date'+i).value).diff(last_departure_date));
                           //CHECK EXPIRED
                           if(duration._milliseconds < 0 ){
                                error_log+= 'Please update passport expired date for spouse customer '+i+'!</br>\n';
                                document.getElementById('adult_relation4_expired_date'+i).style['border-color'] = 'red';
                           }else
                                document.getElementById('adult_relation4_expired_date'+i).style['border-color'] = '#EFEFEF';
                       }if(document.getElementById('adult_relation4_country_of_issued'+i).value == ''){
                           error_log+= 'Please fill country of issued for passenger adult '+i+'!</br>\n';
                           document.getElementById('adult_relation4_country_of_issued'+i).style['border-color'] = 'red';
                       }else{
                           document.getElementById('adult_relation4_country_of_issued'+i).style['border-color'] = '#EFEFEF';
                       }
                   }
                }

            }

        }

        //AHLI WARIS WAJIB ISI
        if(check_name(document.getElementById('adult_relation5_title'+i).value,
            document.getElementById('adult_relation5_first_name'+i).value,
            document.getElementById('adult_relation5_last_name'+i).value,
            length_name) == false){
           error_log+= 'Total of beneficiary for customer '+i+' name maximum '+length_name+' characters!</br>\n';
           document.getElementById('adult_relation5_first_name'+i).style['border-color'] = 'red';
           document.getElementById('adult_relation5_last_name'+i).style['border-color'] = 'red';
        }else{
           document.getElementById('adult_relation5_first_name'+i).style['border-color'] = '#EFEFEF';
           document.getElementById('adult_relation5_last_name'+i).style['border-color'] = '#EFEFEF';
        }if(document.getElementById('adult_relation5_first_name'+i).value == '' || check_word(document.getElementById('adult_relation5_first_name'+i).value) == false){
           if(document.getElementById('adult_relation5_first_name'+i).value == '')
               error_log+= 'Please input first name of beneficiary for customer '+i+'!</br>\n';
           else if(check_word(document.getElementById('adult_relation5_first_name'+i).value) == false)
               error_log+= 'Please use alpha characters first name of beneficiary for customer '+i+'!</br>\n';
           document.getElementById('adult_relation5_first_name'+i).style['border-color'] = 'red';
        }else{
           document.getElementById('adult_relation5_first_name'+i).style['border-color'] = '#EFEFEF';
        }

        if(document.getElementById('adult_relation5_relation'+i).value == ''){
            error_log+= 'Please fill beneficiary relation for passenger adult '+i+'!</br>\n';
            document.getElementById('adult_relation5_relation'+i).style['border-color'] = 'red';
        }else{
            document.getElementById('adult_relation5_relation'+i).style['border-color'] = '#EFEFEF';
        }

        //CHECK KTP
        if(document.getElementById('adult_relation5_identity_type'+i).style.display == 'block'){
            if(document.getElementById('adult_relation5_identity_type'+i).value == 'ktp'){
                if(check_ktp(document.getElementById('adult_relation5_passport_number'+i).value) == false){
                   error_log+= 'Please fill id number, nik only contain 16 digits for beneficiary customer '+i+'!</br>\n';
                   document.getElementById('adult_relation5_passport_number'+i).style['border-color'] = 'red';
                }else{
                   document.getElementById('adult_relation5_passport_number'+i).style['border-color'] = '#EFEFEF';
                }if(document.getElementById('adult_relation5_country_of_issued'+i).value == '' || document.getElementById('adult_country_of_issued'+i).value == 'Country of Issued'){
                   error_log+= 'Please fill country of issued for beneficiary customer '+i+'!</br>\n';
                   document.getElementById('adult_relation5_country_of_issued'+i).style['border-color'] = 'red';
                }else{
                   document.getElementById('adult_relation5_country_of_issued'+i).style['border-color'] = '#EFEFEF';
                }

            }
        }

        if(check_email(document.getElementById('adult_email'+i).value)==false){
            error_log+= 'Invalid Contact person email!</br>\n';
            document.getElementById('adult_email'+i).style['border-color'] = 'red';
        }else{
            document.getElementById('adult_email'+i).style['border-color'] = '#EFEFEF';
        }
        if(check_phone_number(document.getElementById('adult_phone'+i).value)==false){
            error_log+= 'Phone number Contact person only contain number 8 - 12 digits!</br>\n';
            document.getElementById('adult_phone'+i).style['border-color'] = 'red';
        }else
            document.getElementById('adult_phone'+i).style['border-color'] = '#EFEFEF';
   }

   if(error_log==''){
        //KALAU DATE DISABLED DARI TEROPONG VALUE TIDAK BISA DI AMBIL EXPIRED DATE TIDAK DI DISABLED FALSE KARENA BISA DI EDIT
       for(i=1;i<=adult;i++){
            document.getElementById('adult_birth_date'+i).disabled = false;
//            document.getElementById('adult_passport_expired_date'+i).disabled = false;
       }
       $('.loader-rodextrip').fadeIn();
       document.getElementById('time_limit_input').value = time_limit;
       document.getElementById('insurance_review').submit();
   }
   else{
       $('.loader-rodextrip').fadeOut();
       document.getElementById('show_error_log').innerHTML = error_log;
       $("#myModalErrorPassenger").modal('show');
       $('.btn-next').removeClass("running");
       $('.btn-next').prop('disabled', false);
   }
}

function getrupiah(price){
    try{
        if(isNaN(price) == false && price.length != 0){
            var temp = parseFloat(price);
            var positif = false;
            if(temp > -1)
                positif = true;

            temp = temp.toString();
            temp = temp.split('-')[temp.split('-').length-1];
            var pj = temp.split('.')[0].toString().length;
            var priceshow="";
            for(x=0;x<pj;x++){
                if((pj-x)%3==0 && x!=0){
                    priceshow+=",";
                }
                priceshow+=temp.charAt(x);
            }
            if(temp.split('.').length == 2){
                for(x=pj;x<pj+3;x++){
                    priceshow+=temp.charAt(x);
                }
            }
            if(positif == false)
                priceshow = '-' + priceshow;

            return priceshow;
        }else{
            return '';
        }
    }catch(err){
        return price;
    }
}

function insurance_switch(){
    var temp = document.getElementById("insurance_origin").value;
    document.getElementById("insurance_origin").value = document.getElementById("insurance_destination").value;
    document.getElementById("insurance_destination").value = temp;

}

function set_insurance_search_value_to_false(){
    insurance_search_value = 'false';
}
function set_insurance_search_value_to_true(){
    insurance_search_value = 'true';
}

function insurance_search_autocomplete(term,type){
    term = term.toLowerCase();
    console.log(type);
    var choices = [];
    if(type == 'origin')
        choices = origin_insurance_destination;
    else
        choices = destination_insurance_destination;
    var suggestions = [];
    var priority = [];
    if(term.split(' - ').length == 2)
        term = '';
    for (i=0;i<choices.length;i++){
        if(choices[i].toLowerCase().split(' - ')[0].search(term) !== -1){
            priority.push(choices[i]);
        }else if(choices[i].toLowerCase().search(term) !== -1)
            suggestions.push(choices[i]);
    }
    return priority.concat(suggestions).slice(0,100);
}

function insurance_get_booking(data, sync=false){
    document.getElementById('payment_acq').hidden = true;
    price_arr_repricing = {};
    get_vendor_balance('false');
    try{
        show_loading();
    }catch(err){}
    $.ajax({
       type: "POST",
       url: "/webservice/insurance",
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
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {

       },timeout: 60000
    });
}