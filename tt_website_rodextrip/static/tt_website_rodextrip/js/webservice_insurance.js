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
                    new jBox('Tooltip', {
                        attach: '#insurance_info',
                        target: '#insurance_info',
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
                        content: msg.result.response['bcainsurance']['Info Trip'],
                    });
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

                                            text+=`<div class="thumb relative" style="cursor:pointer; border-bottom:1px solid #cdcdcd; height:200px; background: white url('`+static_path_url_server+`/public/tour_packages/not_found.png'); background-size: cover; background-repeat: no-repeat; background-position: center center;" onclick="go_to_detail('`+i+`','`+sequence+`')">`;
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
            price['fare'] += insurance_pick.service_charges[i].amount;
        }else if(insurance_pick.service_charges[i].charge_type == 'TAX'){
            price['tax'] += insurance_pick.service_charges[i].amount;
        }else if(insurance_pick.service_charges[i].charge_type == 'RAC'){
            price['rac'] += insurance_pick.service_charges[i].amount;
        }else if(insurance_pick.service_charges[i].charge_type == 'ROC'){
            price['roc'] += insurance_pick.service_charges[i].amount;
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
           try{
                hide_modal_waiting_transaction();

                //======================= Resv =========================
                if(msg.result.error_code == 0){
                    insurance_get_detail = msg;
                    document.getElementById('show_loading_booking_insurance').hidden = true;
//                    document.getElementById('button-home').hidden = false;
                    document.getElementById('button-new-reservation').hidden = false;
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
                    insurance_get_detail = msg;
                    $text = '';
                    $text += 'Order Number: '+ msg.result.response.order_number + '\n';

                    //======================= Button Issued ==================
                    if(msg.result.response.state == 'booked'){
                       check_payment_payment_method(msg.result.response.order_number, 'Issued', msg.result.response.booker.seq_id, 'billing', 'insurance', signature, msg.result.response.payment_acquirer_number);
                       $(".issued_booking_btn").show();
                       $text += 'Status: Booked\n';
                       document.getElementById('div_sync_status').hidden = false;
                       /*document.getElementById('div_sync_status').innerHTML =`
                       <input type="button" class="primary-btn" id="button-sync-status" style="width:100%;" value="Sync Status" onclick="please_wait_transaction();insurance_get_booking('`+order_number+`',true)">`*/
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
                        document.getElementById('show_title_insurance').hidden = true;
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
//                        document.getElementById('issued-breadcrumb').classList.remove("br-active");
//                        document.getElementById('issued-breadcrumb').classList.add("br-fail");
//                        document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
//                        document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-fail");
//                        document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
//                        document.getElementById('issued-breadcrumb-span').innerHTML = `Expired`;
//                        document.getElementById('display_state').innerHTML = `Your Order Has Been Expired`;
//                        document.getElementById('div_sync_status').hidden = true;
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
                    $text += `\n`+msg.result.response.provider_bookings[0].carrier_name + '\n\nTest\n';

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

                            }
                    text+=`</div>
                        </div>`;

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
                                                <th style="width:40%;">Name</th>
                                                <th style="width:30%;">Email</th>
                                                <th style="width:30%;">Phone Number</th>
                                                <th style="width:30%;">No Polis</th>
                                            </tr>`;
                                }
                                text+=`<tr>
                                                <td class="list-of-passenger-left">`+(parseInt(j)+1)+`</td>
                                                <td>`+pax.title+` `+pax.name+` `;
                                if(pax.verify)
                                    text += '<i class="fas fa-check-square" style="color:blue"></i>';

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
                        }
                    }
                    document.getElementById('insurance_booking').innerHTML = text;

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
                    ADMIN_FEE_insurance = 0;
                    try{
                        for(j in msg.result.response.passengers){
                            price = {'FARE': 0, 'RAC': 0,'ROC': 0, 'TAX':0 , 'currency': '', 'CSC': 0, 'SSR': 0, 'DISC': 0,'SEAT':0};
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
                                    <span style="font-size:12px;">`+msg.result.response.passengers[j].name+` Fare</span>`;
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
                            $text += `IDR `+getrupiah(parseInt(price.FARE + price.SSR + price.SEAT + price.TAX + price.ROC + price.CSC + price.DISC))+'\n';
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
                    insurance_get_detail.result.response.total_price = total_price;

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
                                $text += `\n` + 'Grand Total: ' +price.currency+` `+ getrupiah(total_price);
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
                                <a href="mailto:?subject=This is the insurance price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png" alt="Email"/></a>`;
                        } else {
                            text_detail+=`
                                <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png" alt="Whatsapp"/></a>
                                <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png" alt="Line"/></a>
                                <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png" alt="Telegram"/></a>
                                <a href="mailto:?subject=This is the insurance price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png" alt="Email"/></a>`;
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
                    <div>
                        <input class="primary-btn-white" id="show_commission_button" style="width:100%;margin-bottom:10px;" type="button" onclick="show_commission('commission');" value="Show Commission"/>
                    </div>`;

                    text_detail+=`
                    <div>
                        <center>
                            <input type="button" class="primary-btn-white" style="width:100%;" onclick="copy_data();" value="Copy"/>
                        </center>
                    </div>`;
                    if (msg.result.response.state  == 'issued' && msg.result.response.order_number.includes('PH')) {
                        var verify = false;
//                        var verify = true;
//                        for(i in msg.result.response.passengers){
//                            if(msg.result.response.passengers[i].verify == false){
//                                verify = false;
//                                break;
//                            }
//                        }
                        if(verify == false){
                            text_update_data_pax+=`<button class="primary-btn-white hold-seat-booking-train ld-ext-right" id="button-choose-print" type="button" onclick="update_data_passengers();" style="width:100%;margin-top:15px;">
                            Update Data Customers`;

                            if(user_login.co_agent_frontend_security.includes('verify_phc') == true && verify == false){
                                text_update_data_pax+= ` / Verify Data`;
                            }
                            text_update_data_pax+=`
                                <i class="fas fa-user-edit"></i>
                                <div class="ld ld-ring ld-cycle"></div>
                            </button>`;
                        }
                        /*if(user_login.co_agent_frontend_security.includes('verify_phc') == true){
                            text_detail+=`
                            <button class="primary-btn hold-seat-booking-train ld-ext-right" id="button-choose-print" type="button" onclick="verify_passenger();" style="width:100%;margin-top:15px;">
                                Verify Data
                                <div class="ld ld-ring ld-cycle"></div>
                            </button>`;
                        }*/
                        document.getElementById('cancel_reservation').innerHTML = '';
                    }
                    else if(msg.result.response.state  == 'booked' && msg.result.response.order_number.includes('PH')){
                        text_update_data_pax+=`<button class="primary-btn-white hold-seat-booking-train ld-ext-right" id="button-choose-print" type="button" onclick="update_data_passengers();" style="width:100%;margin-top:15px;">
                            Update Data Customers <i class="fas fa-user-edit"></i>`;
                            text_update_data_pax+=`
                                <div class="ld ld-ring ld-cycle"></div>
                            </button>`;
                        document.getElementById('cancel_reservation').innerHTML = `
                            <button class="primary-btn-white hold-seat-booking-train ld-ext-right" id="button-choose-print" type="button" onclick="insurance_cancel_booking('` + msg.result.response.order_number + `');" style="width:100%;">
                                Cancel Booking
                                <i class="fas fa-times" style="padding-left:5px; color:red; font-size:16px;"></i>
                                <div class="ld ld-ring ld-cycle"></div>
                            </button>
                        `;
                    }
                    if (msg.result.response.state  == 'issued' && msg.result.response.order_number.includes('PH') == true && msg.result.response.provider_bookings[0].carrier_code.includes('PHCHC') == false) {
                        text_update_data_pax+=`
                            <button class="primary-btn hold-seat-booking-train ld-ext-right" id="button-choose-print" type="button" onclick="insurance_get_result('` + msg.result.response.order_number + `');" style="width:100%;margin-top:15px;">
                                Get Result
                                <div class="ld ld-ring ld-cycle"></div>
                            </button>`;
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

                document.getElementById('insurance_detail').innerHTML = text_detail;
                document.getElementById('update_data_passenger').innerHTML = text_update_data_pax;



                    //======================= Option =========================


                    //======================= Extra Question =========================

                    //==================== Print Button =====================
                    var print_text = '<div class="col-lg-4" style="padding-bottom:10px;">';
                    // === Button 1 ===
                    if (msg.result.response.state  == 'issued') {
                        print_text+=`
                        <button class="primary-btn-white hold-seat-booking-train ld-ext-right" id="button-choose-print" type="button" onclick="get_printout('` + msg.result.response.order_number + `','ticket','insurance');" style="width:100%;">
                            Print Ticket
                            <div class="ld ld-ring ld-cycle"></div>
                        </button>`;
                    }
                    print_text += '</div><div class="col-lg-4" style="padding-bottom:10px;">';
                    // === Button 2 ===
                    if (msg.result.response.state  == 'booked'){
                        print_text+=`
                        <button class="primary-btn-white hold-seat-booking-train ld-ext-right" id="button-print-print" type="button" onclick="get_printout('` + msg.result.response.order_number + `','itinerary','insurance');" style="width:100%;">
                            Print Itinerary Form
                            <div class="ld ld-ring ld-cycle"></div>
                        </button>`;
                    }else{
                        if(order_number.includes('PK'))
                            print_text+=`
                            <button class="primary-btn-white hold-seat-booking-train ld-ext-right" type="button" id="button-print-print" onclick="get_printout('` + msg.result.response.order_number + `','ticket_price','insurance');" style="width:100%;">
                                Print Ticket (With Price)
                                <div class="ld ld-ring ld-cycle"></div>
                            </button>`;
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
                                                    <button type="button" id="button-issued-print" class="primary-btn ld-ext-right" onclick="get_printout('`+msg.result.response.order_number+`', 'invoice','insurance');">
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
                    document.getElementById('insurance_btn_printout').innerHTML = print_text;

                    //======================= Other =========================
                    add_repricing();
                }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                    auto_logout();
                }else if(msg.result.error_code == 1035){
                    document.getElementById('show_title_insurance').hidden = false;
                    document.getElementById('show_loading_booking_insurance').hidden = true;
                    document.getElementById('show_title_insurance').hidden = true;
                    render_login('insurance');
                }else{
                   Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: msg.result.error_msg,
                   })
                   try{
                    $("#show_loading_booking_insurance").hide();
                   }catch(err){console.log(err);}
                }
            }catch(err){
                console.log(err);
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error insurance booking </span> Please try again in 1 - 5 minutes later or contact customer service' ,
                }).then((result) => {
                  window.location.href = '/reservation';
                })
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get booking insurance');
       },timeout: 60000
    });
}

function copy_data(){
    //
    document.getElementById('data_copy').innerHTML = $text;
    document.getElementById('data_copy').hidden = false;
    var el = document.getElementById('data_copy');
    el.select();
    document.execCommand('copy');
    document.getElementById('data_copy').hidden = true;

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

function insurance_issued_booking(data){
    var temp_data = {}
    if(typeof(insurance_get_detail) !== 'undefined')
        temp_data = JSON.stringify(insurance_get_detail)
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
           url: "/webservice/insurance",
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
                   gtag('event', 'insurance_issued', {});
               if(msg.result.error_code == 0){
                   print_success_issued();
                   if(document.URL.split('/')[document.URL.split('/').length-1] == 'payment'){
                        window.location.href = '/insurance/booking/' + btoa(data);
                   }else{
                       //update ticket
                       price_arr_repricing = {};
                       pax_type_repricing = [];
                       hide_modal_waiting_transaction();
                       document.getElementById('show_loading_booking_insurance').hidden = false;
                       document.getElementById('insurance_booking').innerHTML = '';
                       document.getElementById('insurance_detail').innerHTML = '';
                       document.getElementById('payment_acq').innerHTML = '';
                       document.getElementById('voucher_div').style.display = 'none';
                       document.getElementById('ssr_request_after_sales').hidden = true;
                       document.getElementById('show_loading_booking_insurance').style.display = 'block';
                       document.getElementById('show_loading_booking_insurance').hidden = false;
                       document.getElementById('reissued').hidden = true;
                       document.getElementById('cancel').hidden = true;
                       document.getElementById('payment_acq').hidden = true;
                       document.getElementById("overlay-div-box").style.display = "none";
                       $(".issued_booking_btn").hide(); //kalau error masih keluar button awal remove ivan
                       insurance_get_booking(data);
                   }
               }else if(msg.result.error_code == 1009){
                   price_arr_repricing = {};
                   pax_type_repricing = [];
                   hide_modal_waiting_transaction();
                   document.getElementById('show_loading_booking_insurance').hidden = false;
                   document.getElementById('insurance_booking').innerHTML = '';
                   document.getElementById('insurance_detail').innerHTML = '';
                   document.getElementById('payment_acq').innerHTML = '';
                   document.getElementById('voucher_div').style.display = 'none';
                   document.getElementById('ssr_request_after_sales').hidden = true;
                   document.getElementById('show_loading_booking_insurance').style.display = 'block';
                   document.getElementById('show_loading_booking_insurance').hidden = false;
                   document.getElementById('reissued').hidden = true;
                   document.getElementById('cancel').hidden = true;
                   document.getElementById('payment_acq').hidden = true;
                   document.getElementById("overlay-div-box").style.display = "none";
                   $(".issued_booking_btn").hide();
                   Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: #ff9900;">Error insurance issued </span>' + msg.result.error_msg,
                    }).then((result) => {
                      if (result.value) {
                        hide_modal_waiting_transaction();
                      }
                    })
                    hide_modal_waiting_transaction();
                    document.getElementById("overlay-div-box").style.display = "none";

                    $('.hold-seat-booking-train').prop('disabled', false);
                    $('.hold-seat-booking-train').removeClass("running");
                    insurance_get_booking(data);
               }else if(msg.result.error_code == 4006){
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: #ff9900;">Error insurance issued </span>' + msg.result.error_msg,
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
                    for(i in insurance_get_detail.result.response.passengers[0].sale_service_charges){
                        text+=`
                        <div style="text-align:center">
                            `+i+`
                        </div>`;
                        for(j in insurance_get_detail.result.response.passengers){
                            price = {'FARE': 0, 'RAC': 0, 'ROC': 0, 'TAX':0 , 'currency': '', 'CSC': 0, 'SSR': 0, 'DISC': 0,'SEAT':0};
                            for(k in insurance_get_detail.result.response.passengers[j].sale_service_charges[i]){
                                price[k] = insurance_get_detail.result.response.passengers[j].sale_service_charges[i][k].amount;
                                if(price['currency'] == '')
                                    price['currency'] = insurance_get_detail.result.response.passengers[j].sale_service_charges[i][k].currency;
                            }
                            try{
                                price['CSC'] = insurance_get_detail.result.response.passengers[j].channel_service_charges.amount;
                            }catch(err){}

                            text+=`<div class="row" style="margin-bottom:5px;">
                                <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                    <span style="font-size:12px;">`+insurance_get_detail.result.response.passengers[j].name+` Fare
                                </div>
                                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                    <span style="font-size:13px;">`+price.currency+` `+getrupiah(parseInt(price.FARE))+`</span>
                                </div>
                            </div>
                            <div class="row" style="margin-bottom:5px;">
                                <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                    <span style="font-size:12px;">`+insurance_get_detail.result.response.passengers[j].name+` Tax
                                </div>
                                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                    <span style="font-size:13px;">IDR `+getrupiah(parseInt(price.TAX + price.ROC + price.CSC))+`</span>
                                </div>
                            </div>`;
                            if(price.SSR != 0 || price.SEAT != 0)
                                text+=`
                                <div class="row" style="margin-bottom:5px;">
                                    <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                        <span style="font-size:12px;">`+insurance_get_detail.result.response.passengers[j].name+` Additional
                                    </div>
                                    <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                        <span style="font-size:13px;">IDR `+getrupiah(parseInt(price.SSR + price.SEAT))+`</span>
                                    </div>
                                </div>`;
                            if(price.DISC != 0)
                                text+=`
                                <div class="row" style="margin-bottom:5px;">
                                    <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                        <span style="font-size:12px;">`+insurance_get_detail.result.response.passengers[j].name+` DISC
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

                    insurance_get_detail = msg;
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
                                price['CSC'] = insurance_get_detail.result.response.passengers[j].channel_service_charges.amount;
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
                                        <span style="font-size:12px;">`+insurance_get_detail.result.response.passengers[j].name+` Additional
                                    </div>
                                    <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                        <span style="font-size:13px;">IDR `+getrupiah(parseInt(price.SSR + price.SEAT))+`</span>
                                    </div>
                                </div>`;
                            if(price.DISC != 0)
                                text+=`
                                <div class="row" style="margin-bottom:5px;">
                                    <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                        <span style="font-size:12px;">`+insurance_get_detail.result.response.passengers[j].name+` DISC
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
                      html: '<span style="color: #ff9900;">Error insurance issued </span>' + msg.result.error_msg,
                    })
                    price_arr_repricing = {};
                    pax_type_repricing = [];
                    document.getElementById('show_loading_booking_insurance').hidden = false;
                    document.getElementById('insurance_booking').innerHTML = '';
                    document.getElementById('insurance_detail').innerHTML = '';
                    document.getElementById('payment_acq').innerHTML = '';
                    document.getElementById('show_loading_booking_insurance').style.display = 'block';
                    document.getElementById('show_loading_booking_insurance').hidden = false;
                    document.getElementById('payment_acq').hidden = true;
                    document.getElementById('reissued').hidden = true;
                    document.getElementById('cancel').hidden = true;
                    hide_modal_waiting_transaction();
                    document.getElementById("overlay-div-box").style.display = "none";

                    $('.hold-seat-booking-train').prop('disabled', false);
                    $('.hold-seat-booking-train').removeClass("running");
                    insurance_get_booking(data);
                    $(".issued_booking_btn").hide();
               }
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error insurance issued');
                price_arr_repricing = {};
                pax_type_repricing = [];
                document.getElementById('show_loading_booking_insurance').hidden = false;
                document.getElementById('insurance_booking').innerHTML = '';
                document.getElementById('insurance_detail').innerHTML = '';
                document.getElementById('payment_acq').innerHTML = '';
                document.getElementById('voucher_div').style.display = 'none';
                document.getElementById('ssr_request_after_sales').hidden = true;
                document.getElementById('show_loading_booking_insurance').style.display = 'block';
                document.getElementById('show_loading_booking_insurance').hidden = false;
                document.getElementById('reissued').hidden = true;
                document.getElementById('cancel').hidden = true;
                document.getElementById('payment_acq').hidden = true;
                hide_modal_waiting_transaction();
                document.getElementById("overlay-div-box").style.display = "none";
                $('.hold-seat-booking-train').prop('disabled', false);
                $('.hold-seat-booking-train').removeClass("running");
                $(".issued_booking_btn").hide();
                insurance_get_booking(data);
           },timeout: 300000
        });
      }
    })
}