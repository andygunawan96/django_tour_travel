var origin_insurance_destination = [];
var destination_insurance_destination = [];
var zurich_insurance_destination = [];
function insurance_signin(data){
    $.ajax({
       type: "POST",
       url: "/webservice/insurance",
       headers:{
            'action': 'signin',
       },
//       url: "{% url 'tt_backend_rodextrip:social_media_tree_update' %}",
       data: {},
       success: function(msg) {
       try{
           if(msg.result.error_code == 0){
               insurance_signature = msg.result.response.signature;
               signature = msg.result.response.signature;
               if(data == ''){
                    get_insurance_data_search_page();
                    insurance_get_availability();
               }else
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
                $("#show_loading_booking_insurance").hide();
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
          error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error Swab Express signin');
          $("#barFlightSearch").hide();
          $("#waitFlightSearch").hide();
          $('.loader-rodextrip').fadeOut();
          try{
            $("#show_loading_booking_insurance").hide();
          }catch(err){
            console.log(err); // error kalau ada element yg tidak ada
          }
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
           if(msg.result.error_code == 0){
                insurance_config = msg.result.response;
                var radios = document.getElementsByName('insurance_provider');
                var insurance_provider = '';
                for (var j = 0, length = radios.length; j < length; j++) {
                    if (radios[j].checked) {
                        // do whatever you want with the checked radio
                        insurance_provider = radios[j].value;
                        // only one radio can be logically checked, don't check the rest
                        break;
                    }
                }
                zurich_insurance_destination = [];
                origin_insurance_destination = [];
                destination_insurance_destination = [];
                for(i in insurance_config){
                    if(i == 'bcainsurance' && insurance_provider == 'bcainsurance'){
                        for(j in insurance_config[i].City)
                            for(k in insurance_config[i].City[j]){
                                if(j == 'Domestic')
                                    origin_insurance_destination.push(insurance_config[i].City[j][k] + ' - ' + j);
                                destination_insurance_destination.push(insurance_config[i].City[j][k] + ' - ' + j);
                            }
                        break;
                    }else if(i == 'zurich'){
                        for(j in insurance_config[i].listCountry){
                            zurich_insurance_destination.push(insurance_config[i].listCountry[j].Text + ' - ' + insurance_config[i].listCountry[j].Value)
                        }
                    }

                }
                if(page == 'home'){
                    for(i in insurance_config){
                        if(i == 'bcainsurance' && insurance_provider == 'bcainsurance'){
                            for(j in insurance_config[i]['Plan Trip']){
                                choice += '<option value="'+insurance_config[i]['Plan Trip'][j]+'">'+insurance_config[i]['Plan Trip'][j]+'</option>';
                            }
                        }
                    }
                    if(insurance_provider == 'bcainsurance'){
                        document.getElementById('insurance_trip').innerHTML += choice;
                        $('#insurance_trip').niceSelect('update');
                        setTimeout(function(){
                            try{
                                new jBox('Tooltip', {
                                    attach: '#insurance_info',
                                    target: '#insurance_info',
                                    theme: 'TooltipBorder',
                                    trigger: 'click',
                                    adjustTracker: true,
                                    closeOnClick: 'body',
                                    closeButton: 'box',
                                    animation: 'move',
                                    width: 280,
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
                            }catch(err){
                                console.log(err);

                            }
                        }, 1000);
                    }
                }
                if(page == 'search'){
                    for(i in insurance_config){
                        for(j in insurance_config[i]['Plan Trip']){
                            if(insurance_request.plan_trip == insurance_config[i]['Plan Trip'][j])
                                choice += '<option value="'+insurance_config[i]['Plan Trip'][j]+'" selected>'+insurance_config[i]['Plan Trip'][j]+'</option>';
                            else
                                choice += '<option value="'+insurance_config[i]['Plan Trip'][j]+'">'+insurance_config[i]['Plan Trip'][j]+'</option>';
                        }
                    }
                    document.getElementById('insurance_trip').innerHTML += choice;
                    $('#insurance_trip').niceSelect('update');
                    setTimeout(function(){
                        try{
                            new jBox('Tooltip', {
                                attach: '#insurance_info',
                                target: '#insurance_info',
                                theme: 'TooltipBorder',
                                trigger: 'click',
                                adjustTracker: true,
                                closeOnClick: 'body',
                                closeButton: 'box',
                                animation: 'move',
                                width: 280,
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
                        }catch(err){
                            console.log(err);

                        }
                    }, 1000);
                }

                if(page == 'passenger'){
                    var choice = '<option value=""></option>';
                    var choice_city = '<option value="">City</option>';
                    var choice_place_of_birth = '<option value="">Place of Birth</option>';
                    for(i in insurance_config){
                        if(i == 'bcainsurance'){
                            for(j in insurance_config[i]['Table Relation']){
                                choice += '<option value="'+j+'">'+j+'</option>';
                            }
                        }
                    }
                    for(i in insurance_config){
                        if(i == 'bcainsurance'){
                            for(j in insurance_config[i]['City']['Domestic']){
                                choice_city += '<option value="'+insurance_config[i]['City']['Domestic'][j]+'">'+insurance_config[i]['City']['Domestic'][j]+'</option>';
                                choice_place_of_birth += '<option value="'+insurance_config[i]['City']['Domestic'][j]+'">'+insurance_config[i]['City']['Domestic'][j]+'</option>';
                            }
                        }
                    }
                    for(var i=1;i<=parseInt(insurance_request.adult);i++){
                        if(insurance_pick.provider == 'bcainsurance'){
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
                        document.getElementById('adult_city'+i+'_id').innerHTML += choice_city;
                        $('#adult_city'+i+'_id').select2();
                        document.getElementById('adult_place_of_birth'+i+'_id').innerHTML += choice_place_of_birth;
                        $('#adult_place_of_birth'+i+'_id').select2();
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
                $("#show_loading_booking_insurance").hide();
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
            $("#show_loading_booking_insurance").hide();
          }catch(err){
            console.log(err); // error kalau ada element yg tidak ada
          }
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
           if(msg.result.error_code == 0){
                insurance_data = msg.result.response;
                var sequence = 0;
                var text = '';
                var length = 0;
                for(i in insurance_data)
                    length += insurance_data[i].length;
                if (length == 0){
                    text += `
                    <div class="col-lg-12">
                        <div style="text-align:center">
                            <img src="/static/tt_website_rodextrip/images/nofound/no-activity.png" alt="Product not Found" style="width:70px; height:70px;" title="" />
                            <br/>
                        </div>
                        <center><div class="alert alert-warning" role="alert" style="margin-top:15px; border:1px solid #cdcdcd;"><h6><i class="fas fa-search-minus"></i> Oops! Product not found. Please try again or search another product. </h6></div></center>
                    </div>`;
                    document.getElementById('insurance_ticket').innerHTML += text;
                }else{
                    for(i in insurance_data){
                        for(j in insurance_data[i]){
                            text+=`
                               <div class="col-lg-4 col-md-4 activity_box" style="min-height:unset;">
                                    <div class="single-recent-blog-post item" style="border:1px solid #cdcdcd;">
                                        <div class="single-destination relative">`;
                                            if(insurance_data[i][j].provider == 'bcainsurance')
                                                text+=`<div class="thumb relative" style="cursor:pointer; border-bottom:1px solid #cdcdcd; height:200px; background: white url('/static/tt_website_rodextrip/images/insurance/`+insurance_data[i][j].MasterBenefitName.toLowerCase()+`-`+insurance_data[i][j].type_trip_name.toLowerCase()+`.png'); background-size: cover; background-repeat: no-repeat; background-position: center center;" onclick="go_to_detail('`+i+`','`+sequence+`')">`;
                                            else if(insurance_data[i][j].provider == 'zurich')
                                                text+=`<div class="thumb relative" style="cursor:pointer; border-bottom:1px solid #cdcdcd; height:200px; background: white url('/static/tt_website_rodextrip/images/icon/home-zurich.png'); background-size: cover; background-repeat: no-repeat; background-position: center center;" onclick="go_to_detail('`+i+`','`+sequence+`')">`;
                                            text+=`
                                            </div>
                                            <div class="card card-effect-promotion" style="border:unset;">
                                                <div class="card-body">
                                                    <div class="row details">
                                                        <div class="col-lg-12">
                                                            <span style="float:left; font-size:16px;font-weight:bold;">`+insurance_data[i][j].carrier_name+` </span><br/>
                                                            <span style="float:left; font-size:12px;">Destination Area: `+insurance_data[i][j].data_name+`  </span>`;
                                                            if(insurance_data[i][j].provider == 'bcainsurance'){
                                                                text+=`
                                                                <span style="padding-left:3px; cursor:pointer; color:`+color+`;" id="`+i+sequence+`" >
                                                                    <i class="fas fa-info-circle" style="font-size:16px;"></i>
                                                                </span>`;
                                                            }
                                                        text+=`
                                                        </div>
                                                        <div class="col-lg-12 mt-2">
                                                            <span style="float:left; margin-right:5px;font-size:16px;font-weight:bold; color:`+color+`;">IDR `+getrupiah(insurance_data[i][j].total_price)+`</span>
                                                            <span> / `+insurance_request.adult+` pax</span>
                                                            <button style="line-height:32px; float:right;" type="button" class="primary-btn" onclick="go_to_detail('`+i+`','`+sequence+`')">BUY</button>
                                                        </div>
                                                        <div class="col-lg-12 mt-2">`;
                                                            if(insurance_data[i][j].provider == 'zurich'){
                                                                text += `
                                                                <span style="float:left; margin-right:15px; font-size:14px;color:blue;font-weight:bold; cursor:pointer;" data-toggle="modal" data-target="#myModalCoverage"><u style="color:`+color+` !important">Coverage</u>  </span>`;
                                                            }
                                                        text+=`
                                                            <span style="float:left; font-size:14px;color:blue;font-weight:bold; cursor:pointer;" onclick="window.open('`+insurance_data[i][j].pdf+`');"><u style="color:`+color+` !important">Benefit</u>  </span>
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
                            if(insurance_data[i][j].provider == 'bcainsurance'){
                                new jBox('Tooltip', {
                                    attach: '#'+i+sequence,
                                    target: '#'+i+sequence,
                                    theme: 'TooltipBorder',
                                    trigger: 'click',
                                    adjustTracker: true,
                                    closeOnClick: 'body',
                                    closeButton: 'box',
                                    animation: 'move',
                                    width:280,
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
                            }else if(insurance_data[i][j].provider == 'zurich'){
                                document.getElementById('coverage_zurich').innerHTML = insurance_data[i][j].info;
                            }
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
                $("#show_loading_booking_insurance").hide();
               }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
               }
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
            $("#show_loading_booking_insurance").hide();
          }catch(err){
            console.log(err); // error kalau ada element yg tidak ada
          }
       },timeout: 180000
    });
}

function go_to_detail(provider, sequence){
    document.getElementById('time_limit_input').value = time_limit;
    document.getElementById('signature_data').value = signature;
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
            $("#show_loading_booking_insurance").hide();
          }catch(err){
            console.log(err); // error kalau ada element yg tidak ada
          }
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
            $("#show_loading_booking_insurance").hide();
          }catch(err){
            console.log(err); // error kalau ada element yg tidak ada
          }
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
            $("#show_loading_booking_insurance").hide();
          }catch(err){
            console.log(err); // error kalau ada element yg tidak ada
          }
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
            $("#show_loading_booking_insurance").hide();
          }catch(err){
            console.log(err); // error kalau ada element yg tidak ada
          }
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
            $("#show_loading_booking_insurance").hide();
          }catch(err){
            console.log(err); // error kalau ada element yg tidak ada
          }
       },timeout: 60000
    });
}

function insurance_login(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/insurance",
       headers:{
            'action': 'login',
       },
//       url: "{% url 'tt_backend_rodextrip:social_media_tree_update' %}",
       data: {
            'signature': signature
       },
       success: function(msg) {
       try{
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
            $("#show_loading_booking_insurance").hide();
          }catch(err){
            console.log(err); // error kalau ada element yg tidak ada
          }
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
          error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error insurance commit booking');
          $("#barFlightSearch").hide();
          $("#waitFlightSearch").hide();
          $('.loader-rodextrip').fadeOut();
          try{
            $("#show_loading_booking_insurance").hide();
          }catch(err){
            console.log(err); // error kalau ada element yg tidak ada
          }
       },timeout: 300000
    });
}

function get_insurance_data_search_page(){
    $.ajax({
       type: "POST",
       url: "/webservice/insurance",
       headers:{
            'action': 'get_data_search_page',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
           insurance_request = msg.insurance_request;
           insurance_get_config('search');
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {

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
               url: "/webservice/insurance",
               headers:{
                    'action': 'commit_booking',
               },
               data: data,
               success: function(msg) {
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
    grandtotal = 0;
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
                <span style="font-size:13px; font-weight:500;">`+price.pax_count+`x Tax @`+price.currency+` `+getrupiah(Math.ceil(price.tax + price.roc))+`</span>
            </div>
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="text-align:right;">
                <span style="font-size:13px; font-weight:500;">`+price.currency+` `+getrupiah(Math.ceil((price.fare+price.roc + price.tax) * price.pax_count))+`</span>
            </div>
            <div class="col-lg-12">
                <hr style="border:1px solid #e0e0e0; margin-top:5px; margin-bottom:5px;"/>
            </div>
        </div>`;
    grandtotal = Math.ceil((price.fare+price.roc + price.tax) * price.pax_count);
    text += `
        <div class="row" style="padding:5px;" id="additionalprice_div">`;
    additional_price = 0;
    if(document.URL.split('/')[document.URL.split('/').length-1] == 'review'){
        for(i in insurance_passenger.adult){
            for(j in insurance_passenger.adult[i].data_insurance.addons){
                additional_price += insurance_passenger.adult[i].data_insurance.addons[j].price;
            }
        }
        if(additional_price != 0){
            text+=`
                <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12" style="text-align:left;">
                    <span style="font-size:13px; font-weight:500;">Additional Price</span><br/>
                </div>
                <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12" style="text-align:right;">
                    <span style="font-size:13px; font-weight:500;">`+price.currency+` `+getrupiah(additional_price)+`</span><br/>
                </div>`;
        }
    }
    text+=`
            <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12" style="text-align:left;">
                <span style="font-size:13px; font-weight:500;">Grand Total</span><br/>
            </div>
            <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12" style="text-align:right;">
                <span style="font-size:13px; font-weight:500;">`+price.currency+` `+getrupiah(grandtotal+additional_price)+`</span><br/>
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
           //document.getElementById('adult_nationality'+i).style['border-color'] = 'red';
           $("#adult_nationality"+i).each(function() {
             $(this).siblings(".select2-container").css('border', '1px solid red');
           });
       }else{
           //document.getElementById('adult_nationality'+i).style['border-color'] = '#EFEFEF';
           $("#adult_nationality"+i).each(function() {
             $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
           });
       }if(document.getElementById('adult_place_of_birth'+i+'_id').value == ''){
           error_log+= 'Please fill place of birth for passenger adult '+i+'!</br>\n';
           //document.getElementById('adult_nationality'+i).style['border-color'] = 'red';
           $("#adult_place_of_birth"+i+'_id').each(function() {
             $(this).siblings(".select2-container").css('border', '1px solid red');
           });
       }else{
           //document.getElementById('adult_nationality'+i).style['border-color'] = '#EFEFEF';
           $("#adult_place_of_birth"+i+"_id").each(function() {
             $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
           });
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
                   $("#adult_country_of_issued"+i+"_id").each(function() {
                     $(this).siblings(".select2-container").css('border', '1px solid red');
                   });
                }else{
                   $("#adult_country_of_issued"+i+"_id").each(function() {
                     $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                   });
                }
           }else if(document.getElementById('adult_id_type'+i).value == 'passport'){
                if(check_passport(document.getElementById('adult_passport_number'+i).value) == false){
                   error_log+= 'Please fill id number, passport only contain more than 6 digits  for passenger adult '+i+'!</br>\n';
                   document.getElementById('adult_passport_number'+i).style['border-color'] = 'red';
                }else{
                   document.getElementById('adult_passport_number'+i).style['border-color'] = '#EFEFEF';
                }if(document.getElementById('adult_passport_expired_date'+i).value == ''){
                   error_log+= 'Please fill passport expired date for passenger adult '+i+'!</br>\n';
                   document.getElementById('adult_passport_expired_date'+i).style['border-color'] = 'red';
                }else{
                   duration = moment.duration(moment(document.getElementById('adult_passport_expired_date'+i).value).diff(last_departure_date));
                   //CHECK EXPIRED
                   if(duration._milliseconds < 0 ){
                        error_log+= 'Please update passport expired date for passenger adult '+i+'!</br>\n';
                        document.getElementById('adult_passport_expired_date'+i).style['border-color'] = 'red';
                   }else
                        document.getElementById('adult_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
                }if(document.getElementById('adult_country_of_issued'+i).value == '' || document.getElementById('adult_country_of_issued'+i).value == 'Country of Issued'){
                   error_log+= 'Please fill country of issued for passenger adult '+i+'!</br>\n';
                   $("#adult_country_of_issued"+i+"_id").each(function() {
                     $(this).siblings(".select2-container").css('border', '1px solid red');
                   });
                }else{
                   $("#adult_country_of_issued"+i+"_id").each(function() {
                     $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                   });
                }
           }
        }
        //PASSPORT
        if(insurance_pick.sector_type == 'International' && insurance_pick.provider == 'bcainsurance'){
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
               }if(document.getElementById('adult_passport_passport_country_of_issued'+i).value == '' || document.getElementById('adult_passport_passport_country_of_issued'+i).value == 'Country of Issued'){
                   error_log+= 'Please fill country of issued for passenger adult '+i+'!</br>\n';
                   $("#adult_passport_passport_country_of_issued"+i+"_id").each(function() {
                     $(this).siblings(".select2-container").css('border', '1px solid red');
                   });
               }else{
                   $("#adult_passport_passport_country_of_issued"+i+"_id").each(function() {
                     $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                   });
               }
           }
        }

        if(document.getElementById('adult_address'+i).value == ''){
           error_log+= 'Please fill address for passenger adult '+i+'!</br>\n';
           document.getElementById('adult_address'+i).style['border-color'] = 'red';
        }else{
           document.getElementById('adult_address'+i).style['border-color'] = '#EFEFEF';
        }

        if(document.getElementById('adult_postal_code'+i).value == ''){
           error_log+= 'Please fill postal code for passenger adult '+i+'!</br>\n';
           document.getElementById('adult_postal_code'+i).style['border-color'] = 'red';
        }else{
           document.getElementById('adult_postal_code'+i).style['border-color'] = '#EFEFEF';
        }

        if(document.getElementById('adult_city'+i).value == '' || document.getElementById('adult_city'+i).value == 'City'){
           error_log+= 'Please fill city for passenger adult '+i+'!</br>\n';
           $("#adult_city"+i+"_id").each(function() {
             $(this).siblings(".select2-container").css('border', '1px solid red');
           });
        }else{
           $("#adult_city"+i+"_id").each(function() {
             $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
           });
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
                $("#adult_relation1_relation"+i).each(function() {
                    $(this).parent().find('.nice-select').css('border', '1px solid red');
                });
            }else{
                $("#adult_relation1_relation"+i).each(function() {
                    $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                });
            }

            //PASSPORT
            if(insurance_pick.sector_type == 'International'){
               if(document.getElementById('adult_relation1_identity_type'+i).value == 'passport'){
                   if(document.getElementById('adult_relation1_identity_type'+i).value == 'passport' && check_passport(document.getElementById('adult_relation1_passport_number'+i).value) == false){
                       error_log+= 'Please fill id number, passport only contain more than 6 digits for spouse customer'+i+'!</br>\n';
                       document.getElementById('adult_relation1_passport_number'+i).style['border-color'] = 'red';
                   }else{
                       document.getElementById('adult_relation1_passport_number'+i).style['border-color'] = '#EFEFEF';
                   }
                   if(document.getElementById('adult_relation1_passport_expired_date'+i).value == ''){
                       error_log+= 'Please fill passport expired date for spouse customer '+i+'!</br>\n';
                       document.getElementById('adult_relation1_expired_date'+i).style['border-color'] = 'red';
                   }else{
                       duration = moment.duration(moment(document.getElementById('adult_relation1_passport_expired_date'+i).value).diff(last_departure_date));
                       //CHECK EXPIRED
                       if(duration._milliseconds < 0 ){
                            error_log+= 'Please update passport expired date for spouse customer '+i+'!</br>\n';
                            document.getElementById('adult_relation1_passport_expired_date'+i).style['border-color'] = 'red';
                       }else
                            document.getElementById('adult_relation1_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
                   }if(document.getElementById('adult_relation1_passport_country_of_issued'+i).value == '' || document.getElementById('adult_relation1_passport_country_of_issued'+i).value == 'Country of Issued'){
                       error_log+= 'Please fill country of issued for passenger adult '+i+'!</br>\n';
                       $("#adult_relation1_passport_country_of_issued"+i+"_id").each(function() {
                         $(this).siblings(".select2-container").css('border', '1px solid red');
                       });
                   }else{
                       $("#adult_relation1_passport_country_of_issued"+i+"_id").each(function() {
                         $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                       });
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
                    $("#adult_relation2_relation"+i).each(function() {
                        $(this).parent().find('.nice-select').css('border', '1px solid red');
                    });
                }else{
                    $("#adult_relation2_relation"+i).each(function() {
                        $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                    });
                }

                //PASSPORT
                if(insurance_pick.sector_type == 'International'){
                   if(document.getElementById('adult_relation2_identity_type'+i).value == 'passport'){
                       if(document.getElementById('adult_relation2_identity_type'+i).value == 'passport' && check_passport(document.getElementById('adult_relation2_passport_number'+i).value) == false){
                           error_log+= 'Please fill id number, passport only contain more than 6 digits for spouse customer'+i+'!</br>\n';
                           document.getElementById('adult_relation2_passport_number'+i).style['border-color'] = 'red';
                       }else{
                           document.getElementById('adult_relation2_passport_number'+i).style['border-color'] = '#EFEFEF';
                       }
                       if(document.getElementById('adult_relation2_passport_expired_date'+i).value == ''){
                           error_log+= 'Please fill passport expired date for spouse customer '+i+'!</br>\n';
                           document.getElementById('adult_relation2_passport_expired_date'+i).style['border-color'] = 'red';
                       }else{
                           duration = moment.duration(moment(document.getElementById('adult_relation2_passport_expired_date'+i).value).diff(last_departure_date));
                           //CHECK EXPIRED
                           if(duration._milliseconds < 0 ){
                                error_log+= 'Please update passport expired date for spouse customer '+i+'!</br>\n';
                                document.getElementById('adult_relation2_passport_expired_date'+i).style['border-color'] = 'red';
                           }else
                                document.getElementById('adult_relation2_expired_date'+i).style['border-color'] = '#EFEFEF';
                       }if(document.getElementById('adult_relation2_passport_country_of_issued'+i).value == '' || document.getElementById('adult_relation2_passport_country_of_issued'+i).value == 'Country of Issued'){
                           error_log+= 'Please fill country of issued for passenger adult '+i+'!</br>\n';
                           $("#adult_relation5_passport_country_of_issued"+i+"_id").each(function() {
                             $(this).siblings(".select2-container").css('border', '1px solid red');
                           });
                       }else{
                           $("#adult_relation2_passport_country_of_issued"+i+"_id").each(function() {
                             $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                           });
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
                    $("#adult_relation3_relation"+i).each(function() {
                        $(this).parent().find('.nice-select').css('border', '1px solid red');
                    });
                }else{
                    $("#adult_relation3_relation"+i).each(function() {
                        $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                    });
                }
                //PASSPORT
                if(insurance_pick.sector_type == 'International'){
                   if(document.getElementById('adult_relation3_identity_type'+i).value == 'passport'){
                       if(document.getElementById('adult_relation3_identity_type'+i).value == 'passport' && check_passport(document.getElementById('adult_relation3_passport_number'+i).value) == false){
                           error_log+= 'Please fill id number, passport only contain more than 6 digits for spouse customer'+i+'!</br>\n';
                           document.getElementById('adult_relation3_passport_number'+i).style['border-color'] = 'red';
                       }else{
                           document.getElementById('adult_relation3_passport_number'+i).style['border-color'] = '#EFEFEF';
                       }
                       if(document.getElementById('adult_relation3_passport_expired_date'+i).value == ''){
                           error_log+= 'Please fill passport expired date for spouse customer '+i+'!</br>\n';
                           document.getElementById('adult_relation3_passport_expired_date'+i).style['border-color'] = 'red';
                       }else{
                           duration = moment.duration(moment(document.getElementById('adult_relation3_passport_expired_date'+i).value).diff(last_departure_date));
                           //CHECK EXPIRED
                           if(duration._milliseconds < 0 ){
                                error_log+= 'Please update passport expired date for spouse customer '+i+'!</br>\n';
                                document.getElementById('adult_relation3_passport_expired_date'+i).style['border-color'] = 'red';
                           }else
                                document.getElementById('adult_relation3_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
                       }if(document.getElementById('adult_relation3_passport_country_of_issued'+i).value == '' || document.getElementById('adult_relation3_passport_country_of_issued'+i).value == 'Country of Issued'){
                           error_log+= 'Please fill country of issued for passenger adult '+i+'!</br>\n';
                           $("#adult_relation5_passport_country_of_issued"+i+"_id").each(function() {
                             $(this).siblings(".select2-container").css('border', '1px solid red');
                           });
                       }else{
                           $("#adult_relation5_passport_country_of_issued"+i+"_id").each(function() {
                             $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                           });
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
                    $("#adult_relation4_relation"+i).each(function() {
                        $(this).parent().find('.nice-select').css('border', '1px solid red');
                    });
                }else{
                    $("#adult_relation1_relation"+i).each(function() {
                        $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                    });
                }
                //PASSPORT
                if(insurance_pick.sector_type == 'International'){
                   if(document.getElementById('adult_relation4_identity_type'+i).value == 'passport'){
                       if(document.getElementById('adult_relation4_identity_type'+i).value == 'passport' && check_passport(document.getElementById('adult_relation4_passport_number'+i).value) == false){
                           error_log+= 'Please fill id number, passport only contain more than 6 digits for spouse customer'+i+'!</br>\n';
                           document.getElementById('adult_relation4_passport_number'+i).style['border-color'] = 'red';
                       }else{
                           document.getElementById('adult_relation4_passport_number'+i).style['border-color'] = '#EFEFEF';
                       }
                       if(document.getElementById('adult_relation4_passport_expired_date'+i).value == ''){
                           error_log+= 'Please fill passport expired date for spouse customer '+i+'!</br>\n';
                           document.getElementById('adult_relation4_passport_expired_date'+i).style['border-color'] = 'red';
                       }else{
                           duration = moment.duration(moment(document.getElementById('adult_relation4_expired_date'+i).value).diff(last_departure_date));
                           //CHECK EXPIRED
                           if(duration._milliseconds < 0 ){
                                error_log+= 'Please update passport expired date for spouse customer '+i+'!</br>\n';
                                document.getElementById('adult_relation4_passport_expired_date'+i).style['border-color'] = 'red';
                           }else
                                document.getElementById('adult_relation4_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
                       }if(document.getElementById('adult_relation4_passport_country_of_issued'+i).value == '' || document.getElementById('adult_relation4_passport_country_of_issued'+i).value == 'Country of Issued'){
                           error_log+= 'Please fill country of issued for passenger adult '+i+'!</br>\n';
                           $("#adult_relation5_passport_country_of_issued"+i+"_id").each(function() {
                             $(this).siblings(".select2-container").css('border', '1px solid red');
                           });
                       }else{
                           $("#adult_relation5_passport_country_of_issued"+i+"_id").each(function() {
                             $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                           });
                       }
                   }
                }

            }

        }

        if(insurance_pick.provider == 'bcainsurance'){
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
                $("#adult_relation5_relation"+i).each(function() {
                    $(this).parent().find('.nice-select').css('border', '1px solid red');
                });
            }else{
                $("#adult_relation5_relation"+i).each(function() {
                    $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                });
            }

            //CHECK KTP
            if(document.getElementById('adult_relation5_identity_type'+i).value == 'ktp'){
                if(check_ktp(document.getElementById('adult_relation5_passport_number'+i).value) == false){
                   error_log+= 'Please fill id number, nik only contain 16 digits for beneficiary customer '+i+'!</br>\n';
                   document.getElementById('adult_relation5_passport_number'+i).style['border-color'] = 'red';
                }else{
                   document.getElementById('adult_relation5_passport_number'+i).style['border-color'] = '#EFEFEF';
                }if(document.getElementById('adult_relation5_passport_country_of_issued'+i+'_id').value == '' || document.getElementById('adult_relation5_passport_country_of_issued'+i+'_id').value == 'Country of Issued'){
                   error_log+= 'Please fill country of issued for beneficiary customer '+i+'!</br>\n';
                   $("#adult_relation5_passport_country_of_issued"+i+"_id").each(function() {
                     $(this).siblings(".select2-container").css('border', '1px solid red');
                   });
                }else{
                   $("#adult_relation5_passport_country_of_issued"+i+"_id").each(function() {
                     $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                   });
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
    var choices = [];
    var radios = document.getElementsByName('insurance_provider');
    var insurance_provider = '';
    for (var j = 0, length = radios.length; j < length; j++) {
        if (radios[j].checked) {
            // do whatever you want with the checked radio
            insurance_provider = radios[j].value;
            // only one radio can be logically checked, don't check the rest
            break;
        }
    }
    if(insurance_provider == 'bcainsurance'){
        if(type == 'origin')
            choices = origin_insurance_destination;
        else
            choices = destination_insurance_destination;
    }else{
        choices = zurich_insurance_destination;
    }
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
    }catch(err){
        console.log(err); // error kalau ada element yg tidak ada
    }
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
           try{
                hide_modal_waiting_transaction();

                //======================= Resv =========================
                if(msg.result.error_code == 0){
                    insurance_get_detail = msg;
                    price_arr_repricing = {};
                    pax_type_repricing = [];
                    can_issued = msg.result.response.can_issued;
                    document.getElementById('show_loading_booking_insurance').hidden = true;
//                    document.getElementById('button-home').hidden = false;
                    document.getElementById('button-new-reservation').hidden = false;
//                    document.getElementById('new-reservation').hidden = false;
                    hide_modal_waiting_transaction();
                    gmt = '';
                    timezone = '';
                    document.getElementById('cancel_reservation').hidden = true;
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
                       document.getElementById('cancel_reservation').hidden = false;
                       document.getElementById('cancel_reservation').innerHTML = `<button class="primary-btn-white" style="width:100%;" type="button" onclick="cancel_booking('`+data+`');">Cancel Booking <i class="fas fa-times" style="padding-left:5px; color:red; font-size:16px;"></i></button>`;
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
                            text+=`
                            <div class="mb-3" style="border:1px solid #cdcdcd; overflow:auto; padding:15px; background-color:white; margin-top:20px;">
                                <h5> List of Customer</h5>
                                <hr/>`;
                            for(j in msg.result.response.provider_bookings[i].tickets){
                                pax = {};
                                for(k in msg.result.response.passengers){
                                    if(msg.result.response.passengers[k].name == msg.result.response.provider_bookings[i].tickets[j].passenger){
                                        pax = msg.result.response.passengers[k];
                                        break;
                                    }
                                }
                                text+=`
                                <div class="row">
                                    <div class="col-lg-12">
                                        <h5>`+(parseInt(j)+1)+`.
                                        `+pax.title+` `+pax.name;
                                            if(pax.verify)
                                                text += '<i class="fas fa-check-square" style="color:blue"></i>'
                                        text+=`
                                        </h5>
                                        No Polis: <b>`+msg.result.response.provider_bookings[i].tickets[j].ticket_number+`</b><br/>
                                        Email: <b>`+pax.email+`</b><br/>
                                        Phone Number: <b>`+pax.phone_number+`</b>
                                    </div>

                                    <div class="col-lg-12">`;
                                    if(pax.insurance_data.hasOwnProperty('addons')){
                                        if(pax.insurance_data.addons.length != 0){
                                            text+=`<br/><h6>Additional Benefit</h6><br/>
                                            <table style="width:100%;" id="list-of-passengers" class="list-of-passenger-class">
                                                <tr>
                                                    <th style="width:5%;" class="list-of-passenger-left">No</th>
                                                    <th style="width:45%;">Additional Benefit</th>
                                                    <th style="width:25%;">Price</th>
                                                </tr>`;
                                                for(k in pax.insurance_data.addons){
                                                    text+=`
                                                    <tr>
                                                        <td>`+(parseInt(k)+1)+`</td>
                                                        <td>
                                                            `+pax.insurance_data.addons[k].text_with_tag+`
                                                        </td>
                                                        <td>`+pax.insurance_data.addons[k].currency+` `+getrupiah(pax.insurance_data.addons[k].price)+`</td>
                                                    </tr>`;
                                                }
                                            text+=`</table>`;
                                        }else{
                                            text+=`
                                                <br/>
                                                <b>Additional Benefit</b><br/>
                                                <i>Not Selected</i>`;
                                        }
                                    }

                                    if(j != msg.result.response.provider_bookings[i].tickets.length -1){
                                        text+=`<hr/>`;
                                    }
                                text+=`
                                    </div>
                                </div>`;
                            }
                            text+=`</div>`;
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
                    text_detail+=`
                </div>`;
                }catch(err){console.log(err);}


                document.getElementById('insurance_detail').innerHTML = text_detail;
                document.getElementById('update_data_passenger').innerHTML = text_update_data_pax;



                    //======================= Option =========================


                    //======================= Extra Question =========================

                    //==================== Print Button =====================
                    var print_text = '<div class="col-lg-6" style="padding-bottom:10px;">';
                    // === Button 1 ===
                    if (msg.result.response.state  == 'issued') {
                        print_text+=`
                        <button class="primary-btn-white hold-seat-booking-train ld-ext-right" id="button-choose-print" type="button" onclick="get_printout('` + msg.result.response.order_number + `','ticket','insurance');" style="width:100%;">
                            Print Ticket
                            <div class="ld ld-ring ld-cycle"></div>
                        </button>`;
                    }
                    print_text += '</div><div class="col-lg-6" style="padding-bottom:10px;">';
                    // === Button 2 ===
                    if (msg.result.response.state  == 'booked'){
                        print_text+=`
                        <button class="primary-btn-white hold-seat-booking-train ld-ext-right" id="button-print-print" type="button" onclick="get_printout('` + msg.result.response.order_number + `','itinerary','insurance');" style="width:100%;">
                            Print Itinerary Form
                            <div class="ld ld-ring ld-cycle"></div>
                        </button>`;
                    }else{
                        print_text+=`
                        <button class="primary-btn-white hold-seat-booking-train ld-ext-right" type="button" id="button-print-print" onclick="get_printout('` + msg.result.response.order_number + `','ticket_price','insurance');" style="width:100%;">
                            Print Ticket (With Price)
                            <div class="ld ld-ring ld-cycle"></div>
                        </button>`;
                    }
                    print_text += '</div><div class="col-lg-6" style="padding-bottom:10px;">';
                    // === Button 2 ===
                    if (msg.result.response.state  == 'issued'){
                        print_text+=`
                        <button class="primary-btn-white hold-seat-booking-train ld-ext-right" id="button-print-print" type="button" onclick="get_printout('` + msg.result.response.order_number + `','ticket_original','insurance');" style="width:100%;">
                            Print Policies
                            <div class="ld ld-ring ld-cycle"></div>
                        </button>`;
                    }
                    print_text += '</div><div class="col-lg-6" style="padding-bottom:10px;">';
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

function cancel_booking(data){
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
           url: "/webservice/insurance",
           headers:{
                'action': 'cancel',
           },
           data: {
               'order_number': data,
               'signature': signature
           },
           success: function(msg) {
               if(google_analytics != '')
                   gtag('event', 'insurance_issued', {});
               price_arr_repricing = {};
               pax_type_repricing = [];
               hide_modal_waiting_transaction();
               document.getElementById('show_loading_booking_insurance').hidden = false;
               document.getElementById('insurance_booking').innerHTML = '';
               document.getElementById('insurance_detail').innerHTML = '';
               document.getElementById('payment_acq').innerHTML = '';
               try{
                    document.getElementById('voucher_div').style.display = 'none';
               }catch(err){
                    console.log(err); // error kalau ada element yg tidak ada
               }
               document.getElementById('show_loading_booking_insurance').style.display = 'block';
               document.getElementById('show_loading_booking_insurance').hidden = false;
               document.getElementById('cancel').hidden = true;
               document.getElementById('payment_acq').hidden = true;
               document.getElementById("overlay-div-box").style.display = "none";
               $(".issued_booking_btn").hide(); //kalau error masih keluar button awal remove ivan
               insurance_get_booking(data);
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error insurance cancel');
                price_arr_repricing = {};
                pax_type_repricing = [];
                insurance_get_booking(data);
           },timeout: 300000
        });
      }
    })
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
               'acquirer_seq_id': payment_acq2[payment_method][selected].acquirer_seq_id,
               'member': payment_acq2[payment_method][selected].method,
               'voucher_code': voucher_code,
               'signature': signature,
               'booking': temp_data
           },
           success: function(msg) {
               if(google_analytics != '')
                   gtag('event', 'insurance_issued', {});
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
                       try{
                            document.getElementById('voucher_div').style.display = 'none';
                       }catch(err){
                            console.log(err); // error kalau ada element yg tidak ada
                       }
                       document.getElementById('show_loading_booking_insurance').style.display = 'block';
                       document.getElementById('show_loading_booking_insurance').hidden = false;
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
                            }catch(err){
                                console.log(err); // error kalau ada element yg tidak ada
                            }

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
                    if(msg.result.error_code != 1007){
                        Swal.fire({
                          type: 'error',
                          title: 'Oops!',
                          html: '<span style="color: #ff9900;">Error insurance issued </span>' + msg.result.error_msg,
                        })
                    }else{
                        Swal.fire({
                          type: 'error',
                          title: 'Error insurance issued '+ msg.result.error_msg,
                          showCancelButton: true,
                          cancelButtonText: 'Ok',
                          confirmButtonColor: '#f15a22',
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

function delete_expired_date_data(data){
    document.getElementById(data).value = '';
}

function default_data_select2(id, value){
    document.getElementById(id).value = value;
}

function default_data_select2_html(id, value){
    document.getElementById(id).innerHTML = value;
}

function show_commission(){
    var sc = document.getElementById("show_commission");
    var scs = document.getElementById("show_commission_button");
    if (sc.style.display === "none"){
        sc.style.display = "block";
        scs.value = "Hide Commission";
    }
    else{
        sc.style.display = "none";
        scs.value = "Show Commission";
    }
}

function onchange_provider_insurance(){
    var radios = document.getElementsByName('insurance_provider');
    var insurance_provider = '';
    for (var j = 0, length = radios.length; j < length; j++) {
        if (radios[j].checked) {
            // do whatever you want with the checked radio
            insurance_provider = radios[j].value;
            // only one radio can be logically checked, don't check the rest
            break;
        }
    }
    text = '';
    if(insurance_provider == 'bcainsurance'){
        if(template == 1){
        text +=`
            <div class="col-lg-12" id="radio_insurance_search" style="padding:0px; text-align:left;margin-bottom:10px;">
                <label class="radio-button-custom crlabel">
                    <span style="font-size:13px; color:`+text_color+`;">Single Trip</span>
                    <input type="radio" checked="checked" name="radio_insurance_type" value="Single Trip">
                    <span class="checkmark-radio crspan"></span>
                </label>
                <label class="radio-button-custom crlabel">
                    <span style="font-size:13px; color:`+text_color+`;">Annual</span>
                    <input type="radio" name="radio_insurance_type" value="Annual">
                    <span class="checkmark-radio crspan"></span>
                </label>
                <span id="insurance_info"><i class="fas fa-info-circle" style="font-size:20px; cursor:pointer; color:`+text_color+`"></i></span>
            </div>
            <div class="col-lg-6">
                <div class="row">
                    <input id="insurance_provider" name="insurance_provider" value="bcainsurance" hidden>
                    <input id="checkbox" name="insurance_is_senior" value="" hidden>
                    <div class="col-lg-6 col-md-6 col-sm-6 train-from" style="padding-left:0px;">
                        <span class="span-search-ticket"><i class="fas fa-train"></i> From</span>
                        <div class="input-container-search-ticket">
                            <input id="insurance_origin" name="insurance_origin" class="form-control" type="text" placeholder="Origin" style="width:100%; outline:0" autocomplete="off" value="" onfocus="document.getElementById('insurance_origin').select();" onclick="set_insurance_search_value_to_false();">
                        </div>
                    </div>
                    <div class="image-change-route-vertical2">
                        <span><a href="javascript:insurance_switch();" style="z-index:5; color:black;" id="insurance_switch"><i class="image-rounded-icon2"><i class="fas fa-exchange-alt"></i></i></a></span>
                    </div>
                    <div class="image-change-route-horizontal2">
                        <span><a class="horizontal-arrow" href="javascript:insurance_switch();" style="z-index:5; color:{{text_color}} !important;" id="insurance_switch"><i class="image-rounded-icon"><i class="fas fa-exchange-alt"></i></i></a></span>
                    </div>

                    <div class="col-lg-6 col-md-6 col-sm-6 train-to" style="z-index:5; padding-right:0px;">
                        <span class="span-search-ticket"><i class="fas fa-map-marked-alt"></i> To</span>
                        <div class="input-container-search-ticket">
                            <input id="insurance_destination" name="insurance_destination" class="form-control" type="text" placeholder="Destination" style="width:100%; outline:0" autocomplete="off" value="" onfocus="document.getElementById('insurance_destination').select();" onclick="set_insurance_search_value_to_false();">
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-6">
                <div class="row">
                    <span class="span-search-ticket"><i class="fas fa-suitcase"></i> Plan Trip</span>
                    <div class="input-container-search-ticket btn-group">
                        <div class="form-select" id="default-select">
                            <select id="insurance_trip" name="insurance_trip" class="nice-select-default" onchange="next_focus_element('insurance','plantrip')">

                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-6" style="padding:0px;" id="insurance_date_search">
                <span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Date</span>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control" id="insurance_date" name="insurance_date" placeholder="Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Date '" autocomplete="off" readonly/>
                </div>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-6" style="padding:0px;">
                <span class="span-search-ticket"><i class="fas fa-users"></i> Passenger</span>
                <div class="input-container-search-ticket btn-group">
                    <button id="show_total_pax_insurance" style="text-align:left; cursor:pointer;" type="button" class="form-control dropdown-toggle" data-toggle="dropdown"></button>
                    <ul class="dropdown-menu" role="menu" style="overflow-y:unset;">
                        <div class="row" style="padding:10px;">
                            <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="float:left !important;">
                                <div style="float:left;">
                                    <label>
                                        <span style="color:black; font-size:13px;">Customer<br/></span>
                                    </label>
                                </div>
                            </div>
                            <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="float:right !important;">
                                <div style="float:right; display:flex; padding:5px 0px 5px 5px;">
                                    <button type="button" class="left-minus-adult-insurance btn-custom-circle" id="left-minus-adult-insurance" data-type="minus" data-field="" disabled>
                                        <i class="fas fa-minus"></i>
                                    </button>
                                    <input type="text" style="font-size:13px; padding:5px !important; border:none; background:none; font-size:13px; text-align:center; width:25px;" id="insurance_adult" name="insurance_adult" value="1" min="1" readonly>
                                    <button type="button" class="right-plus-adult-insurance btn-custom-circle" id="right-plus-adult-insurance" data-type="plus" data-field="">
                                        <i class="fas fa-plus"></i>
                                    </button>
                                </div>
                            </div>

                            <div class="col-lg-12" style="text-align:right;">
                                <hr/>
                                <button class="primary-btn" type="button" style="line-height:34px;" onclick="next_focus_element('insurance','passenger');">Done</button>
                            </div>
                        </div>
                    </ul>
                </div>
            </div>`;
        }
        else if(template == 2){
        text +=`
            <div class="col-lg-12" id="radio_insurance_search" style="text-align:left;margin-bottom:10px;">
                <label class="radio-button-custom crlabel">
                    <span style="font-size:13px; color:`+text_color+`;">Single Trip</span>
                    <input type="radio" checked="checked" name="radio_insurance_type" value="Single Trip">
                    <span class="checkmark-radio crspan"></span>
                </label>
                <label class="radio-button-custom crlabel">
                    <span style="font-size:13px; color:`+text_color+`;">Annual</span>
                    <input type="radio" name="radio_insurance_type" value="Annual">
                    <span class="checkmark-radio crspan"></span>
                </label>
                <span id="insurance_info"><i class="fas fa-info-circle" style="font-size:20px; cursor:pointer; color:`+text_color+`"></i></span>
            </div>
            <div class="col-lg-6">
                <div class="row">
                    <input id="insurance_provider" name="insurance_provider" value="bcainsurance" hidden>
                    <input id="checkbox" name="insurance_is_senior" value="" hidden>
                    <div class="col-lg-6 col-md-6 col-sm-6 train-from">
                        <span class="span-search-ticket"><i class="fas fa-train"></i> From</span>
                        <div class="input-container-search-ticket">
                            <input id="insurance_origin" name="insurance_origin" class="form-control" type="text" placeholder="Origin" style="width:100%; outline:0" autocomplete="off" value="" onfocus="document.getElementById('insurance_origin').select();" onclick="set_insurance_search_value_to_false();">
                        </div>
                    </div>
                    <div class="image-change-route-vertical2">
                        <span><a href="javascript:insurance_switch();" style="z-index:5; color:black;" id="insurance_switch"><i class="image-rounded-icon2"><i class="fas fa-exchange-alt"></i></i></a></span>
                    </div>
                    <div class="image-change-route-horizontal2">
                        <span><a class="horizontal-arrow" href="javascript:insurance_switch();" style="z-index:5; color:{{text_color}} !important;" id="insurance_switch"><i class="image-rounded-icon"><i class="fas fa-exchange-alt"></i></i></a></span>
                    </div>

                    <div class="col-lg-6 col-md-6 col-sm-6 train-to" style="z-index:5;">
                        <span class="span-search-ticket"><i class="fas fa-map-marked-alt"></i> To</span>
                        <div class="input-container-search-ticket">
                            <input id="insurance_destination" name="insurance_destination" class="form-control" type="text" placeholder="Destination" style="width:100%; outline:0" autocomplete="off" value="" onfocus="document.getElementById('insurance_destination').select();" onclick="set_insurance_search_value_to_false();">
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-6">
                <span class="span-search-ticket"><i class="fas fa-suitcase"></i> Plan Trip</span>
                <select id="insurance_trip" name="insurance_trip" class="form-control" onchange="next_focus_element('insurance','plantrip')">

                </select>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-6" id="insurance_date_search">
                <span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Date</span>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control" style="background:white;" id="insurance_date" name="insurance_date" placeholder="Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Date '" autocomplete="off" readonly/>
                </div>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-6">
                <span class="span-search-ticket"><i class="fas fa-users"></i> Passenger</span>
                <div class="input-container-search-ticket btn-group">
                    <button id="show_total_pax_insurance" style="text-align:left; cursor:pointer;" type="button" class="form-control dropdown-toggle" data-toggle="dropdown"></button>
                    <ul class="dropdown-menu" role="menu" style="overflow-y:unset;">
                        <div class="row" style="padding:10px;">
                            <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="float:left !important;">
                                <div style="float:left;">
                                    <label>
                                        <span style="color:black; font-size:13px;">Customer<br/></span>
                                    </label>
                                </div>
                            </div>
                            <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="float:right !important;">
                                <div style="float:right; display:flex; padding:5px 0px 5px 5px;">
                                    <button type="button" class="left-minus-adult-insurance btn-custom-circle" id="left-minus-adult-insurance" data-type="minus" data-field="" disabled>
                                        <i class="fas fa-minus"></i>
                                    </button>
                                    <input type="text" style="font-size:13px; padding:5px !important; border:none; background:none; font-size:13px; text-align:center; width:25px;" id="insurance_adult" name="insurance_adult" value="1" min="1" readonly>
                                    <button type="button" class="right-plus-adult-insurance btn-custom-circle" id="right-plus-adult-insurance" data-type="plus" data-field="">
                                        <i class="fas fa-plus"></i>
                                    </button>
                                </div>
                            </div>

                            <div class="col-lg-12" style="text-align:right;">
                                <hr/>
                                <button class="primary-btn" type="button" style="line-height:34px;" onclick="next_focus_element('insurance','passenger');">Done</button>
                            </div>
                        </div>
                    </ul>
                </div>
            </div>`;
        }
        else if(template == 3){
        text +=`
            <div class="col-lg-12" id="radio_insurance_search" style="text-align:left;margin-bottom:10px;">
                <label class="radio-button-custom crlabel">
                    <span style="font-size:13px; color:`+text_color+`;">Single Trip</span>
                    <input type="radio" checked="checked" name="radio_insurance_type" value="Single Trip">
                    <span class="checkmark-radio crspan"></span>
                </label>
                <label class="radio-button-custom crlabel">
                    <span style="font-size:13px; color:`+text_color+`;">Annual</span>
                    <input type="radio" name="radio_insurance_type" value="Annual">
                    <span class="checkmark-radio crspan"></span>
                </label>
                <span id="insurance_info"><i class="fas fa-info-circle" style="font-size:20px; cursor:pointer; color:`+text_color+`"></i></span>
            </div>
            <div class="col-lg-12">
                <div class="row">
                    <input id="insurance_provider" name="insurance_provider" value="bcainsurance" hidden>
                    <input id="checkbox" name="insurance_is_senior" value="" hidden>
                    <div class="col-lg-6 col-md-6 col-sm-6 train-from">
                        <span class="span-search-ticket"><i class="fas fa-train"></i> From</span>
                        <div class="input-container-search-ticket">
                            <input id="insurance_origin" name="insurance_origin" class="form-control" type="text" placeholder="Origin" style="width:100%; outline:0" autocomplete="off" value="" onfocus="document.getElementById('insurance_origin').select();" onclick="set_insurance_search_value_to_false();">
                        </div>
                    </div>
                    <div class="image-change-route-vertical2">
                        <span><a href="javascript:insurance_switch();" style="z-index:5; color:black;" id="insurance_switch"><i class="image-rounded-icon2"><i class="fas fa-exchange-alt"></i></i></a></span>
                    </div>
                    <div class="image-change-route-horizontal2">
                        <span><a class="horizontal-arrow" href="javascript:insurance_switch();" style="z-index:5; color:{{text_color}} !important;" id="insurance_switch"><i class="image-rounded-icon"><i class="fas fa-exchange-alt"></i></i></a></span>
                    </div>

                    <div class="col-lg-6 col-md-6 col-sm-6 train-to" style="z-index:5;">
                        <span class="span-search-ticket"><i class="fas fa-map-marked-alt"></i> To</span>
                        <div class="input-container-search-ticket">
                            <input id="insurance_destination" name="insurance_destination" class="form-control" type="text" placeholder="Destination" style="width:100%; outline:0" autocomplete="off" value="" onfocus="document.getElementById('insurance_destination').select();" onclick="set_insurance_search_value_to_false();">
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-4 mb-2">
                <span class="span-search-ticket"><i class="fas fa-suitcase"></i> Plan Trip</span>
                <div class="form-group">
                    <div class="default-select" id="default-select">
                        <select id="insurance_trip" name="insurance_trip" onchange="next_focus_element('insurance','plantrip')">

                        </select>
                    </div>
                </div>
            </div>
            <div class="col-lg-4" id="insurance_date_search">
                <span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Date</span>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control" style="background:white;" id="insurance_date" name="insurance_date" placeholder="Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Date '" autocomplete="off" readonly/>
                </div>
            </div>
            <div class="col-lg-4">
                <span class="span-search-ticket"><i class="fas fa-users"></i> Passenger</span>
                <div class="input-container-search-ticket btn-group">
                    <button id="show_total_pax_insurance" style="text-align:left; cursor:pointer;" type="button" class="form-control dropdown-toggle" data-toggle="dropdown"></button>
                    <ul class="dropdown-menu" role="menu" style="overflow-y:unset;">
                        <div class="row" style="padding:10px;">
                            <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="float:left !important;">
                                <div style="float:left;">
                                    <label>
                                        <span style="color:black; font-size:13px;">Customer<br/></span>
                                    </label>
                                </div>
                            </div>
                            <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="float:right !important;">
                                <div style="float:right; display:flex; padding:5px 0px 5px 5px;">
                                    <button type="button" class="left-minus-adult-insurance btn-custom-circle" id="left-minus-adult-insurance" data-type="minus" data-field="" disabled>
                                        <i class="fas fa-minus"></i>
                                    </button>
                                    <input type="text" style="font-size:13px; padding:5px !important; border:none; background:none; font-size:13px; text-align:center; width:25px;" id="insurance_adult" name="insurance_adult" value="1" min="1" readonly>
                                    <button type="button" class="right-plus-adult-insurance btn-custom-circle" id="right-plus-adult-insurance" data-type="plus" data-field="">
                                        <i class="fas fa-plus"></i>
                                    </button>
                                </div>
                            </div>

                            <div class="col-lg-12" style="text-align:right;">
                                <hr/>
                                <button class="primary-btn" type="button" style="line-height:34px;" onclick="next_focus_element('insurance','passenger');">Done</button>
                            </div>
                        </div>
                    </ul>
                </div>
            </div>`;
        }
        else if(template == 4){
        text +=`
            <div class="col-lg-12" id="radio_insurance_search" style="text-align:left;margin-bottom:10px;">
                <label class="radio-button-custom crlabel">
                    <span style="font-size:13px; color:`+text_color+`;">Single Trip</span>
                    <input type="radio" checked="checked" name="radio_insurance_type" value="Single Trip">
                    <span class="checkmark-radio crspan"></span>
                </label>
                <label class="radio-button-custom crlabel">
                    <span style="font-size:13px; color:`+text_color+`;">Annual</span>
                    <input type="radio" name="radio_insurance_type" value="Annual">
                    <span class="checkmark-radio crspan"></span>
                </label>
                <span id="insurance_info"><i class="fas fa-info-circle" style="font-size:20px; cursor:pointer; color:`+text_color+`"></i></span>
            </div>
            <div class="col-lg-8">
                <div class="row">
                    <input id="insurance_provider" name="insurance_provider" value="bcainsurance" hidden>
                    <input id="checkbox" name="insurance_is_senior" value="" hidden>
                    <div class="col-lg-6 col-md-6 col-sm-6 train-from">
                        <span class="span-search-ticket"> From</span>
                        <div class="input-container-search-ticket">
                            <i class="fas fa-map-marked-alt" style="padding:14px; height: 43px; width: 45px; background:`+color+`; color:`+text_color+`;"></i>
                            <input id="insurance_origin" name="insurance_origin" class="form-control" type="text" placeholder="Origin" style="width:100%; outline:0" autocomplete="off" value="" onfocus="document.getElementById('insurance_origin').select();" onclick="set_insurance_search_value_to_false();">
                        </div>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-6 train-to" style="z-index:5;">
                        <h4 class="image-change-route-vertical"><a href="javascript:insurance_switch();" tabindex="-1" style="z-index:5; color:`+text_color+`;" id="insurance_switch"><span style="margin-left: 2px;" class="icon icon-exchange"></span></a></h4>
                        <h4 class="image-change-route-horizontal"><a href="javascript:insurance_switch();" tabindex="-1" style="z-index:5; color:`+text_color+`;" id="insurance_switch"><span class="icon icon-exchange"></span></a></h4>
                        <span class="span-search-ticket"> To</span>
                        <div class="input-container-search-ticket">
                            <i class="fas fa-map-marked-alt" style="padding:14px; height: 43px; width: 45px; background:`+color+`; color:`+text_color+`;"></i>
                            <input id="insurance_destination" name="insurance_destination" class="form-control" type="text" placeholder="Destination" style="width:100%; outline:0" autocomplete="off" value="" onfocus="document.getElementById('insurance_destination').select();" onclick="set_insurance_search_value_to_false();">
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-4">
                <span class="span-search-ticket">Plan Trip</span>
                <div class="input-container-search-ticket btn-group">
                    <i class="fas fa-suitcase" style="padding:14px; height: 43px; width: 45px; background:`+color+`; color:`+text_color+`;"></i>
                        <select id="insurance_trip" name="insurance_trip" class="nice-select-default" onchange="next_focus_element('insurance','plantrip')">

                        </select>
                    </div>
                </div>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-6" id="insurance_date_search">
                <span class="span-search-ticket">Date</span>
                <div class="input-container-search-ticket">
                    <i class="fas fa-calendar-alt" style="padding:14px; height: 43px; width: 45px; background:`+color+`; color:`+text_color+`;"></i>
                    <input type="text" class="form-control" style="background:white;" id="insurance_date" name="insurance_date" placeholder="Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Date '" autocomplete="off" readonly/>
                </div>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-6">
                <span class="span-search-ticket">Passenger</span>
                <div class="input-container-search-ticket btn-group">
                    <i class="fas fa-users" style="padding:14px; height: 43px; width: 45px; background:`+color+`; color:`+text_color+`;"></i>

                    <button id="show_total_pax_insurance" style="text-align:left; cursor:pointer;" type="button" class="form-control dropdown-toggle" data-toggle="dropdown"></button>
                    <ul class="dropdown-menu" role="menu" style="overflow-y:unset;">
                        <div class="row" style="padding:10px;">
                            <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="float:left !important;">
                                <div style="float:left;">
                                    <label>
                                        <span style="color:black; font-size:13px;">Customer<br/></span>
                                    </label>
                                </div>
                            </div>
                            <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="float:right !important;">
                                <div style="float:right; display:flex; padding:5px 0px 5px 5px;">
                                    <button type="button" class="left-minus-adult-insurance btn-custom-circle" id="left-minus-adult-insurance" data-type="minus" data-field="" disabled>
                                        <i class="fas fa-minus"></i>
                                    </button>
                                    <input type="text" style="font-size:13px; padding:5px !important; border:none; background:none; font-size:13px; text-align:center; width:25px;" id="insurance_adult" name="insurance_adult" value="1" min="1" readonly>
                                    <button type="button" class="right-plus-adult-insurance btn-custom-circle" id="right-plus-adult-insurance" data-type="plus" data-field="">
                                        <i class="fas fa-plus"></i>
                                    </button>
                                </div>
                            </div>

                            <div class="col-lg-12" style="text-align:right;">
                                <hr/>
                                <button class="primary-btn" type="button" style="line-height:34px;" onclick="next_focus_element('insurance','passenger');">Done</button>
                            </div>
                        </div>
                    </ul>
                </div>
            </div>`;
        }
        else if(template == 5){
        text +=`
            <div class="col-lg-12" id="radio_insurance_search" style="text-align:left;margin-bottom:10px;">
                <label class="radio-button-custom crlabel">
                    <span style="font-size:13px; color:`+text_color+`;">Single Trip</span>
                    <input type="radio" checked="checked" name="radio_insurance_type" value="Single Trip">
                    <span class="checkmark-radio crspan"></span>
                </label>
                <label class="radio-button-custom crlabel">
                    <span style="font-size:13px; color:`+text_color+`;">Annual</span>
                    <input type="radio" name="radio_insurance_type" value="Annual">
                    <span class="checkmark-radio crspan"></span>
                </label>
                <span id="insurance_info"><i class="fas fa-info-circle" style="font-size:20px; cursor:pointer; color:`+text_color+`"></i></span>
            </div>
            <div class="col-lg-6">
                <div class="row">
                    <input id="insurance_provider" name="insurance_provider" value="bcainsurance" hidden>
                    <input id="checkbox" name="insurance_is_senior" value="" hidden>
                    <div class="col-lg-6 col-md-6 col-sm-6 train-from">
                        <span class="span-search-ticket"><i class="fas fa-train"></i> From</span>
                        <div class="input-container-search-ticket">
                            <input id="insurance_origin" name="insurance_origin" class="form-control" type="text" placeholder="Origin" style="width:100%; outline:0" autocomplete="off" value="" onfocus="document.getElementById('insurance_origin').select();" onclick="set_insurance_search_value_to_false();">
                        </div>
                    </div>
                    <div class="image-change-route-vertical2">
                        <span><a href="javascript:insurance_switch();" style="z-index:5; color:black;" id="insurance_switch"><i class="image-rounded-icon2"><i class="fas fa-exchange-alt"></i></i></a></span>
                    </div>
                    <div class="image-change-route-horizontal2">
                        <span><a class="horizontal-arrow" href="javascript:insurance_switch();" style="z-index:5; color:{{text_color}} !important;" id="insurance_switch"><i class="image-rounded-icon"><i class="fas fa-exchange-alt"></i></i></a></span>
                    </div>

                    <div class="col-lg-6 col-md-6 col-sm-6 train-to" style="z-index:5;">
                        <span class="span-search-ticket"><i class="fas fa-map-marked-alt"></i> To</span>
                        <div class="input-container-search-ticket">
                            <input id="insurance_destination" name="insurance_destination" class="form-control" type="text" placeholder="Destination" style="width:100%; outline:0" autocomplete="off" value="" onfocus="document.getElementById('insurance_destination').select();" onclick="set_insurance_search_value_to_false();">
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-6">
                <span class="span-search-ticket"><i class="fas fa-suitcase"></i> Plan Trip</span>
                <div class="input-container-search-ticket btn-group">
                    <div class="form-select" id="default-select">
                        <select id="insurance_trip" name="insurance_trip" class="nice-select-default" onchange="next_focus_element('insurance','plantrip')">

                        </select>
                    </div>
                </div>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-6" id="insurance_date_search">
                <span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Date</span>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control" style="background:white;" id="insurance_date" name="insurance_date" placeholder="Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Date '" autocomplete="off" readonly/>
                </div>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-6">
                <span class="span-search-ticket"><i class="fas fa-users"></i> Passenger</span>
                <div class="input-container-search-ticket btn-group">
                    <button id="show_total_pax_insurance" style="text-align:left; cursor:pointer;" type="button" class="form-control dropdown-toggle" data-toggle="dropdown"></button>
                    <ul class="dropdown-menu" role="menu" style="overflow-y:unset;">
                        <div class="row" style="padding:10px;">
                            <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="float:left !important;">
                                <div style="float:left;">
                                    <label>
                                        <span style="color:black; font-size:13px;">Customer<br/></span>
                                    </label>
                                </div>
                            </div>
                            <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="float:right !important;">
                                <div style="float:right; display:flex; padding:5px 0px 5px 5px;">
                                    <button type="button" class="left-minus-adult-insurance btn-custom-circle" id="left-minus-adult-insurance" data-type="minus" data-field="" disabled>
                                        <i class="fas fa-minus"></i>
                                    </button>
                                    <input type="text" style="font-size:13px; padding:5px !important; border:none; background:none; font-size:13px; text-align:center; width:25px;" id="insurance_adult" name="insurance_adult" value="1" min="1" readonly>
                                    <button type="button" class="right-plus-adult-insurance btn-custom-circle" id="right-plus-adult-insurance" data-type="plus" data-field="">
                                        <i class="fas fa-plus"></i>
                                    </button>
                                </div>
                            </div>

                            <div class="col-lg-12" style="text-align:right;">
                                <hr/>
                                <button class="primary-btn" type="button" style="line-height:34px;" onclick="next_focus_element('insurance','passenger');">Done</button>
                            </div>
                        </div>
                    </ul>
                </div>
            </div>`;
        }
        else if(template == 6){
        text +=`
            <div class="col-lg-12" id="radio_insurance_search" style="text-align:left;margin-bottom:10px;">
                <label class="radio-button-custom crlabel">
                    <span style="font-size:13px; color:`+text_color+`;">Single Trip</span>
                    <input type="radio" checked="checked" name="radio_insurance_type" value="Single Trip">
                    <span class="checkmark-radio crspan"></span>
                </label>
                <label class="radio-button-custom crlabel">
                    <span style="font-size:13px; color:`+text_color+`;">Annual</span>
                    <input type="radio" name="radio_insurance_type" value="Annual">
                    <span class="checkmark-radio crspan"></span>
                </label>
                <span id="insurance_info"><i class="fas fa-info-circle" style="font-size:20px; cursor:pointer; color:`+text_color+`"></i></span>
            </div>
            <div class="col-lg-12">
                <div class="row">
                    <input id="insurance_provider" name="insurance_provider" value="bcainsurance" hidden>
                    <input id="checkbox" name="insurance_is_senior" value="" hidden>
                    <div class="col-lg-6 col-md-6">
                        <span class="span-search-ticket"><i class="fas fa-train"></i> From</span>
                        <div class="input-container-search-ticket">
                            <input id="insurance_origin" name="insurance_origin" class="form-control" type="text" placeholder="Origin" style="width:100%; outline:0" autocomplete="off" value="" onfocus="document.getElementById('insurance_origin').select();" onclick="set_insurance_search_value_to_false();">
                        </div>
                    </div>
                    <div class="image-change-route-vertical2">
                        <span><a href="javascript:insurance_switch();" style="z-index:5; color:black;" id="insurance_switch"><i class="image-rounded-icon2"><i class="fas fa-exchange-alt"></i></i></a></span>
                    </div>
                    <div class="image-change-route-horizontal2">
                        <span><a class="horizontal-arrow" href="javascript:insurance_switch();" style="z-index:5; color:{{text_color}} !important;" id="insurance_switch"><i class="image-rounded-icon"><i class="fas fa-exchange-alt"></i></i></a></span>
                    </div>

                    <div class="col-lg-6 col-md-6" style="z-index:5;">
                        <span class="span-search-ticket"><i class="fas fa-map-marked-alt"></i> To</span>
                        <div class="input-container-search-ticket">
                            <input id="insurance_destination" name="insurance_destination" class="form-control" type="text" placeholder="Destination" style="width:100%; outline:0" autocomplete="off" value="" onfocus="document.getElementById('insurance_destination').select();" onclick="set_insurance_search_value_to_false();">
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-4 mb-3">
                <span class="span-search-ticket"><i class="fas fa-suitcase"></i> Plan Trip</span>
                <div class="form-group">
                    <div class="default-select" id="default-select">
                        <select id="insurance_trip" name="insurance_trip" onchange="next_focus_element('insurance','plantrip')">

                        </select>
                    </div>
                </div>
            </div>
            <div class="col-lg-4" id="insurance_date_search">
                <span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Date</span>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control" style="background:white;" id="insurance_date" name="insurance_date" placeholder="Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Date '" autocomplete="off" readonly/>
                </div>
            </div>
            <div class="col-lg-4">
                <span class="span-search-ticket"><i class="fas fa-users"></i> Passenger</span>
                <div class="input-container-search-ticket btn-group">
                    <button id="show_total_pax_insurance" style="text-align:left; cursor:pointer;" type="button" class="form-control dropdown-toggle" data-toggle="dropdown"></button>
                    <ul class="dropdown-menu" role="menu" style="overflow-y:unset;">
                        <div class="row" style="padding:10px;">
                            <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="float:left !important;">
                                <div style="float:left;">
                                    <label>
                                        <span style="color:black; font-size:13px;">Customer<br/></span>
                                    </label>
                                </div>
                            </div>
                            <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="float:right !important;">
                                <div style="float:right; display:flex; padding:5px 0px 5px 5px;">
                                    <button type="button" class="left-minus-adult-insurance btn-custom-circle" id="left-minus-adult-insurance" data-type="minus" data-field="" disabled>
                                        <i class="fas fa-minus"></i>
                                    </button>
                                    <input type="text" style="font-size:13px; padding:5px !important; border:none; background:none; font-size:13px; text-align:center; width:25px;" id="insurance_adult" name="insurance_adult" value="1" min="1" readonly>
                                    <button type="button" class="right-plus-adult-insurance btn-custom-circle" id="right-plus-adult-insurance" data-type="plus" data-field="">
                                        <i class="fas fa-plus"></i>
                                    </button>
                                </div>
                            </div>

                            <div class="col-lg-12" style="text-align:right;">
                                <hr/>
                                <button class="primary-btn" type="button" style="line-height:34px;" onclick="next_focus_element('insurance','passenger');">Done</button>
                            </div>
                        </div>
                    </ul>
                </div>
            </div>`;
        }
        document.getElementById('insurance_div').innerHTML = text;
        //load js ulang
        var insurance_origin = new autoComplete({
            selector: '#insurance_origin',
            minChars: 1,
            cache: false,
            delay:0,
            source: function(term, suggest){
                if(term.split(' - ').length == 4)
                        term = ''
                if(term.length > 1)
                    suggest(insurance_search_autocomplete(term,'origin'));
            },
            onSelect: function(e, term, item){
                setTimeout(function(){
                    $("#insurance_destination").focus();
                }, 200);
                set_insurance_search_value_to_true();
            }
        });
        var insurance_destination = new autoComplete({
            selector: '#insurance_destination',
            minChars: 1,
            cache: false,
            delay:0,
            source: function(term, suggest){
                if(term.split(' - ').length == 4)
                    term = ''
                if(term.length > 1)
                    suggest(insurance_search_autocomplete(term,'destination'));
            },
            onSelect: function(e, term, item){
                setTimeout(function(){
                    $('.nice-select').addClass("open");
                }, 200);
                set_insurance_search_value_to_true();
            }
        });
        selected_value_start = $("input[name='radio_insurance_type']:checked").val();
        if (selected_value_start == "Single Trip"){
            $('input[name="insurance_date"]').daterangepicker({
                singleDatePicker: false,
                autoUpdateInput: true,
                startDate: moment(),
                autoApply: true,
                endDate: moment().subtract(-2, 'days'),
                minDate: moment().subtract(-1, 'days'),
                maxDate: moment().subtract(-1, 'years'),
                showDropdowns: true,
                opens: 'center',
                locale: {
                    format: 'DD MMM YYYY',
                }
            });

            $('input[name="insurance_date"]').on('apply.daterangepicker', function(ev, picker) {
                setTimeout(function(){
                    $("#show_total_pax_insurance").click();
                }, 200);
            });
        }

        $('#insurance_trip').niceSelect();
    }
    else{
        //zurich
        if(template == 1){
        text +=`
            <div class="col-lg-12" id="radio_insurance_search" style="padding:0px; text-align:left;margin-bottom:10px;">
                <label class="radio-button-custom crlabel">
                    <span style="font-size:13px; color:`+text_color+`;">Single Trip</span>
                    <input type="radio" checked="checked" name="radio_insurance_type" value="Single Trip">
                    <span class="checkmark-radio crspan"></span>
                </label>
            </div>
            <div class="col-lg-12 mb-2" style="padding:0px;">
                <label class="check_box_custom">
                    <span class="span-search-ticket" style="color:`+text_color+`;">Is Senior</span>
                    <input type="checkbox" id="insurance_is_senior" name="insurance_is_senior" />
                    <span class="check_box_span_custom"></span>
                </label>
            </div>
            <div class="col-lg-4">
                <div class="row">
                    <input id="insurance_provider" name="insurance_provider" value="zurich" hidden>
                    <div class="col-lg-12" style="padding-left:0px;" hidden>
                        <span class="span-search-ticket"><i class="fas fa-train"></i> From</span>
                        <div class="input-container-search-ticket">
                            <input id="insurance_origin" name="insurance_origin" class="form-control" type="text" placeholder="Origin" style="width:100%; outline:0" autocomplete="off" value="" onfocus="document.getElementById('insurance_origin').select();" onclick="set_insurance_search_value_to_false();">
                        </div>
                    </div>
                    <div class="col-lg-12" style="z-index:5; padding-left:0px; padding-right:0px;">
                        <span class="span-search-ticket"><i class="fas fa-map-marked-alt"></i> Destination</span>
                        <div class="input-container-search-ticket">
                            <input id="insurance_destination" name="insurance_destination" class="form-control" type="text" placeholder="Destination" style="width:100%; outline:0" autocomplete="off" value="" onfocus="document.getElementById('insurance_destination').select();" onclick="set_insurance_search_value_to_false();">
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-4" hidden>
                <div class="row">
                    <span class="span-search-ticket"><i class="fas fa-suitcase"></i> Plan Trip</span>
                    <div class="input-container-search-ticket btn-group">
                        <div class="form-select" id="default-select">
                            <select id="insurance_trip" name="insurance_trip" class="nice-select-default" onchange="next_focus_element('insurance','plantrip')">
                                <option value="LAINNYA" selected>LAINNYA</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-4" style="padding:0px;" id="insurance_date_search">
                <span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Date</span>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control" id="insurance_date" name="insurance_date" placeholder="Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Date '" autocomplete="off" readonly/>
                </div>
            </div>
            <div class="col-lg-4" style="padding:0px;">
                <span class="span-search-ticket"><i class="fas fa-users"></i> Passenger</span>
                <div class="input-container-search-ticket btn-group">
                    <button id="show_total_pax_insurance" style="text-align:left; cursor:pointer;" type="button" class="form-control dropdown-toggle" data-toggle="dropdown"></button>
                    <ul class="dropdown-menu" role="menu" style="overflow-y:unset;">
                        <div class="row" style="padding:10px;">
                            <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="float:left !important;">
                                <div style="float:left;">
                                    <label>
                                        <span style="color:black; font-size:13px;">Customer<br/></span>
                                    </label>
                                </div>
                            </div>
                            <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="float:right !important;">
                                <div style="float:right; display:flex; padding:5px 0px 5px 5px;">
                                    <button type="button" class="left-minus-adult-insurance btn-custom-circle" id="left-minus-adult-insurance" data-type="minus" data-field="" disabled>
                                        <i class="fas fa-minus"></i>
                                    </button>
                                    <input type="text" style="font-size:13px; padding:5px !important; border:none; background:none; font-size:13px; text-align:center; width:25px;" id="insurance_adult" name="insurance_adult" value="1" min="1" readonly>
                                    <button type="button" class="right-plus-adult-insurance btn-custom-circle" id="right-plus-adult-insurance" data-type="plus" data-field="">
                                        <i class="fas fa-plus"></i>
                                    </button>
                                </div>
                            </div>

                            <div class="col-lg-12" style="text-align:right;">
                                <hr/>
                                <button class="primary-btn" type="button" style="line-height:34px;" onclick="next_focus_element('insurance','passenger');">Done</button>
                            </div>
                        </div>
                    </ul>
                </div>
            </div>`;
        }
        else if(template == 2){
        text +=`
            <div class="col-lg-12" id="radio_insurance_search" style="text-align:left;margin-bottom:10px;">
                <label class="radio-button-custom crlabel">
                    <span style="font-size:13px; color:`+text_color+`;">Single Trip</span>
                    <input type="radio" checked="checked" name="radio_insurance_type" value="Single Trip">
                    <span class="checkmark-radio crspan"></span>
                </label>
            </div>
            <div class="col-lg-12 mb-2">
                <label class="check_box_custom">
                    <span class="span-search-ticket" style="color:`+text_color+`;">Is Senior</span>
                    <input type="checkbox" id="insurance_is_senior" name="insurance_is_senior" />
                    <span class="check_box_span_custom"></span>
                </label>
            </div>
            <div class="col-lg-4">
                <div class="row">
                    <input id="insurance_provider" name="insurance_provider" value="zurich" hidden>
                    <div class="col-lg-12" style="padding-left:0px;" hidden>
                        <span class="span-search-ticket"><i class="fas fa-train"></i> From</span>
                        <div class="input-container-search-ticket">
                            <input id="insurance_origin" name="insurance_origin" class="form-control" type="text" placeholder="Origin" style="width:100%; outline:0" autocomplete="off" value="" onfocus="document.getElementById('insurance_origin').select();" onclick="set_insurance_search_value_to_false();">
                        </div>
                    </div>
                    <div class="col-lg-12" style="z-index:5;">
                        <span class="span-search-ticket"><i class="fas fa-map-marked-alt"></i> Destination</span>
                        <div class="input-container-search-ticket">
                            <input id="insurance_destination" name="insurance_destination" class="form-control" type="text" placeholder="Destination" style="width:100%; outline:0" autocomplete="off" value="" onfocus="document.getElementById('insurance_destination').select();" onclick="set_insurance_search_value_to_false();">
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-4" hidden>
                <span class="span-search-ticket"><i class="fas fa-suitcase"></i> Plan Trip</span>
                <select id="insurance_trip" name="insurance_trip" class="form-control" onchange="next_focus_element('insurance','plantrip')">
                    <option value="LAINNYA" selected>LAINNYA</option>
                </select>
            </div>
            <div class="col-lg-4" id="insurance_date_search">
                <span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Date</span>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control" style="background:white;" id="insurance_date" name="insurance_date" placeholder="Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Date '" autocomplete="off" readonly/>
                </div>
            </div>
            <div class="col-lg-4">
                <span class="span-search-ticket"><i class="fas fa-users"></i> Passenger</span>
                <div class="input-container-search-ticket btn-group">
                    <button id="show_total_pax_insurance" style="text-align:left; cursor:pointer;" type="button" class="form-control dropdown-toggle" data-toggle="dropdown"></button>
                    <ul class="dropdown-menu" role="menu" style="overflow-y:unset;">
                        <div class="row" style="padding:10px;">
                            <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="float:left !important;">
                                <div style="float:left;">
                                    <label>
                                        <span style="color:black; font-size:13px;">Customer<br/></span>
                                    </label>
                                </div>
                            </div>
                            <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="float:right !important;">
                                <div style="float:right; display:flex; padding:5px 0px 5px 5px;">
                                    <button type="button" class="left-minus-adult-insurance btn-custom-circle" id="left-minus-adult-insurance" data-type="minus" data-field="" disabled>
                                        <i class="fas fa-minus"></i>
                                    </button>
                                    <input type="text" style="font-size:13px; padding:5px !important; border:none; background:none; font-size:13px; text-align:center; width:25px;" id="insurance_adult" name="insurance_adult" value="1" min="1" readonly>
                                    <button type="button" class="right-plus-adult-insurance btn-custom-circle" id="right-plus-adult-insurance" data-type="plus" data-field="">
                                        <i class="fas fa-plus"></i>
                                    </button>
                                </div>
                            </div>

                            <div class="col-lg-12" style="text-align:right;">
                                <hr/>
                                <button class="primary-btn" type="button" style="line-height:34px;" onclick="next_focus_element('insurance','passenger');">Done</button>
                            </div>
                        </div>
                    </ul>
                </div>
            </div>`;
        }
        else if(template == 3){
        text +=`
            <div class="col-lg-12" id="radio_insurance_search" style="text-align:left;margin-bottom:10px;">
                <label class="radio-button-custom crlabel">
                    <span style="font-size:13px; color:`+text_color+`;">Single Trip</span>
                    <input type="radio" checked="checked" name="radio_insurance_type" value="Single Trip">
                    <span class="checkmark-radio crspan"></span>
                </label>
            </div>
            <div class="col-lg-12 mb-2">
                <label class="check_box_custom">
                    <span class="span-search-ticket" style="color:`+text_color+`;">Is Senior</span>
                    <input type="checkbox" id="insurance_is_senior" name="insurance_is_senior" />
                    <span class="check_box_span_custom"></span>
                </label>
            </div>
            <div class="col-lg-4">
                <div class="row">
                    <input id="insurance_provider" name="insurance_provider" value="zurich" hidden>
                    <div class="col-lg-12" style="padding-left:0px;" hidden>
                        <span class="span-search-ticket"><i class="fas fa-train"></i> From</span>
                        <div class="input-container-search-ticket">
                            <input id="insurance_origin" name="insurance_origin" class="form-control" type="text" placeholder="Origin" style="width:100%; outline:0" autocomplete="off" value="" onfocus="document.getElementById('insurance_origin').select();" onclick="set_insurance_search_value_to_false();">
                        </div>
                    </div>
                    <div class="col-lg-12" style="z-index:5;">
                        <span class="span-search-ticket"><i class="fas fa-map-marked-alt"></i> Destination</span>
                        <div class="input-container-search-ticket">
                            <input id="insurance_destination" name="insurance_destination" class="form-control" type="text" placeholder="Destination" style="width:100%; outline:0" autocomplete="off" value="" onfocus="document.getElementById('insurance_destination').select();" onclick="set_insurance_search_value_to_false();">
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-4" hidden>
                <span class="span-search-ticket"><i class="fas fa-suitcase"></i> Plan Trip</span>
                <select id="insurance_trip" name="insurance_trip" class="form-control" onchange="next_focus_element('insurance','plantrip')">
                    <option value="LAINNYA" selected>LAINNYA</option>
                </select>
            </div>
            <div class="col-lg-4" id="insurance_date_search">
                <span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Date</span>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control" style="background:white;" id="insurance_date" name="insurance_date" placeholder="Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Date '" autocomplete="off" readonly/>
                </div>
            </div>
            <div class="col-lg-4">
                <span class="span-search-ticket"><i class="fas fa-users"></i> Passenger</span>
                <div class="input-container-search-ticket btn-group">
                    <button id="show_total_pax_insurance" style="text-align:left; cursor:pointer;" type="button" class="form-control dropdown-toggle" data-toggle="dropdown"></button>
                    <ul class="dropdown-menu" role="menu" style="overflow-y:unset;">
                        <div class="row" style="padding:10px;">
                            <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="float:left !important;">
                                <div style="float:left;">
                                    <label>
                                        <span style="color:black; font-size:13px;">Customer<br/></span>
                                    </label>
                                </div>
                            </div>
                            <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="float:right !important;">
                                <div style="float:right; display:flex; padding:5px 0px 5px 5px;">
                                    <button type="button" class="left-minus-adult-insurance btn-custom-circle" id="left-minus-adult-insurance" data-type="minus" data-field="" disabled>
                                        <i class="fas fa-minus"></i>
                                    </button>
                                    <input type="text" style="font-size:13px; padding:5px !important; border:none; background:none; font-size:13px; text-align:center; width:25px;" id="insurance_adult" name="insurance_adult" value="1" min="1" readonly>
                                    <button type="button" class="right-plus-adult-insurance btn-custom-circle" id="right-plus-adult-insurance" data-type="plus" data-field="">
                                        <i class="fas fa-plus"></i>
                                    </button>
                                </div>
                            </div>

                            <div class="col-lg-12" style="text-align:right;">
                                <hr/>
                                <button class="primary-btn" type="button" style="line-height:34px;" onclick="next_focus_element('insurance','passenger');">Done</button>
                            </div>
                        </div>
                    </ul>
                </div>
            </div>`;
        }
        else if(template == 4){
        text +=`
            <div class="col-lg-12" id="radio_insurance_search" style="text-align:left;margin-bottom:10px;">
                <label class="radio-button-custom crlabel">
                    <span style="font-size:13px; color:`+text_color+`;">Single Trip</span>
                    <input type="radio" checked="checked" name="radio_insurance_type" value="Single Trip">
                    <span class="checkmark-radio crspan"></span>
                </label>
            </div>
            <div class="col-lg-12 mb-2">
                <label class="check_box_custom">
                    <span class="span-search-ticket" style="color:`+text_color+`;">Is Senior</span>
                    <input type="checkbox" id="insurance_is_senior" name="insurance_is_senior" />
                    <span class="check_box_span_custom"></span>
                </label>
            </div>
            <div class="col-lg-4">
                <div class="row">
                    <input id="insurance_provider" name="insurance_provider" value="zurich" hidden>
                    <div class="col-lg-12" style="padding-left:0px;" hidden>
                        <span class="span-search-ticket"><i class="fas fa-map-marked-alt"></i> From</span>
                        <div class="input-container-search-ticket">
                            <input id="insurance_origin" name="insurance_origin" class="form-control" type="text" placeholder="Origin" style="width:100%; outline:0" autocomplete="off" value="" onfocus="document.getElementById('insurance_origin').select();" onclick="set_insurance_search_value_to_false();">
                        </div>
                    </div>
                    <div class="col-lg-12" style="z-index:5;">
                        <span class="span-search-ticket">Destination</span>
                        <div class="input-container-search-ticket">
                            <i class="fas fa-map-marked-alt" style="padding:14px; height: 43px; width: 45px; background:`+color+`; color:`+text_color+`;"></i>
                            <input id="insurance_destination" name="insurance_destination" class="form-control" type="text" placeholder="Destination" style="width:100%; outline:0" autocomplete="off" value="" onfocus="document.getElementById('insurance_destination').select();" onclick="set_insurance_search_value_to_false();">
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-4" hidden>
                <span class="span-search-ticket"><i class="fas fa-suitcase"></i> Plan Trip</span>
                <select id="insurance_trip" name="insurance_trip" class="form-control" onchange="next_focus_element('insurance','plantrip')">
                    <option value="LAINNYA" selected>LAINNYA</option>
                </select>
            </div>
            <div class="col-lg-4" id="insurance_date_search">
                <span class="span-search-ticket">Date</span>
                <div class="input-container-search-ticket">
                    <i class="fas fa-calendar-alt" style="padding:14px; height: 43px; width: 45px; background:`+color+`; color:`+text_color+`;"></i>
                    <input type="text" class="form-control" style="background:white;" id="insurance_date" name="insurance_date" placeholder="Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Date '" autocomplete="off" readonly/>
                </div>
            </div>
            <div class="col-lg-4">
                <span class="span-search-ticket">Passenger</span>
                <div class="input-container-search-ticket btn-group">
                    <i class="fas fa-users" style="padding:14px; height: 43px; width: 45px; background:`+color+`; color:`+text_color+`;"></i>
                    <button id="show_total_pax_insurance" style="text-align:left; cursor:pointer;" type="button" class="form-control dropdown-toggle" data-toggle="dropdown"></button>
                    <ul class="dropdown-menu" role="menu" style="overflow-y:unset;">
                        <div class="row" style="padding:10px;">
                            <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="float:left !important;">
                                <div style="float:left;">
                                    <label>
                                        <span style="color:black; font-size:13px;">Customer<br/></span>
                                    </label>
                                </div>
                            </div>
                            <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="float:right !important;">
                                <div style="float:right; display:flex; padding:5px 0px 5px 5px;">
                                    <button type="button" class="left-minus-adult-insurance btn-custom-circle" id="left-minus-adult-insurance" data-type="minus" data-field="" disabled>
                                        <i class="fas fa-minus"></i>
                                    </button>
                                    <input type="text" style="font-size:13px; padding:5px !important; border:none; background:none; font-size:13px; text-align:center; width:25px;" id="insurance_adult" name="insurance_adult" value="1" min="1" readonly>
                                    <button type="button" class="right-plus-adult-insurance btn-custom-circle" id="right-plus-adult-insurance" data-type="plus" data-field="">
                                        <i class="fas fa-plus"></i>
                                    </button>
                                </div>
                            </div>

                            <div class="col-lg-12" style="text-align:right;">
                                <hr/>
                                <button class="primary-btn" type="button" style="line-height:34px;" onclick="next_focus_element('insurance','passenger');">Done</button>
                            </div>
                        </div>
                    </ul>
                </div>
            </div>`;
        }
        else if(template == 5){
        text +=`
            <div class="col-lg-12" id="radio_insurance_search" style="text-align:left;margin-bottom:10px;">
                <label class="radio-button-custom crlabel">
                    <span style="font-size:13px; color:`+text_color+`;">Single Trip</span>
                    <input type="radio" checked="checked" name="radio_insurance_type" value="Single Trip">
                    <span class="checkmark-radio crspan"></span>
                </label>
            </div>
            <div class="col-lg-12 mb-2">
                <label class="check_box_custom">
                    <span class="span-search-ticket" style="color:`+text_color+`;">Is Senior</span>
                    <input type="checkbox" id="insurance_is_senior" name="insurance_is_senior" />
                    <span class="check_box_span_custom"></span>
                </label>
            </div>
            <div class="col-lg-4">
                <div class="row">
                    <input id="insurance_provider" name="insurance_provider" value="zurich" hidden>
                    <div class="col-lg-12" style="padding-left:0px;" hidden>
                        <span class="span-search-ticket"><i class="fas fa-train"></i> From</span>
                        <div class="input-container-search-ticket">
                            <input id="insurance_origin" name="insurance_origin" class="form-control" type="text" placeholder="Origin" style="width:100%; outline:0" autocomplete="off" value="" onfocus="document.getElementById('insurance_origin').select();" onclick="set_insurance_search_value_to_false();">
                        </div>
                    </div>
                    <div class="col-lg-12" style="z-index:5;">
                        <span class="span-search-ticket"><i class="fas fa-map-marked-alt"></i> Destination</span>
                        <div class="input-container-search-ticket">
                            <input id="insurance_destination" name="insurance_destination" class="form-control" type="text" placeholder="Destination" style="width:100%; outline:0" autocomplete="off" value="" onfocus="document.getElementById('insurance_destination').select();" onclick="set_insurance_search_value_to_false();">
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-4" hidden>
                <span class="span-search-ticket"><i class="fas fa-suitcase"></i> Plan Trip</span>
                <select id="insurance_trip" name="insurance_trip" class="form-control" onchange="next_focus_element('insurance','plantrip')">
                    <option value="LAINNYA" selected>LAINNYA</option>
                </select>
            </div>
            <div class="col-lg-4" id="insurance_date_search">
                <span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Date</span>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control" style="background:white;" id="insurance_date" name="insurance_date" placeholder="Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Date '" autocomplete="off" readonly/>
                </div>
            </div>
            <div class="col-lg-4">
                <span class="span-search-ticket"><i class="fas fa-users"></i> Passenger</span>
                <div class="input-container-search-ticket btn-group">
                    <button id="show_total_pax_insurance" style="text-align:left; cursor:pointer;" type="button" class="form-control dropdown-toggle" data-toggle="dropdown"></button>
                    <ul class="dropdown-menu" role="menu" style="overflow-y:unset;">
                        <div class="row" style="padding:10px;">
                            <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="float:left !important;">
                                <div style="float:left;">
                                    <label>
                                        <span style="color:black; font-size:13px;">Customer<br/></span>
                                    </label>
                                </div>
                            </div>
                            <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="float:right !important;">
                                <div style="float:right; display:flex; padding:5px 0px 5px 5px;">
                                    <button type="button" class="left-minus-adult-insurance btn-custom-circle" id="left-minus-adult-insurance" data-type="minus" data-field="" disabled>
                                        <i class="fas fa-minus"></i>
                                    </button>
                                    <input type="text" style="font-size:13px; padding:5px !important; border:none; background:none; font-size:13px; text-align:center; width:25px;" id="insurance_adult" name="insurance_adult" value="1" min="1" readonly>
                                    <button type="button" class="right-plus-adult-insurance btn-custom-circle" id="right-plus-adult-insurance" data-type="plus" data-field="">
                                        <i class="fas fa-plus"></i>
                                    </button>
                                </div>
                            </div>

                            <div class="col-lg-12" style="text-align:right;">
                                <hr/>
                                <button class="primary-btn" type="button" style="line-height:34px;" onclick="next_focus_element('insurance','passenger');">Done</button>
                            </div>
                        </div>
                    </ul>
                </div>
            </div>`;
        }
        else if(template == 6){
        text +=`
            <div class="col-lg-12" id="radio_insurance_search" style="text-align:left;margin-bottom:10px;">
                <label class="radio-button-custom crlabel">
                    <span style="font-size:13px; color:`+text_color+`;">Single Trip</span>
                    <input type="radio" checked="checked" name="radio_insurance_type" value="Single Trip">
                    <span class="checkmark-radio crspan"></span>
                </label>
            </div>
            <div class="col-lg-12 mb-2">
                <label class="check_box_custom">
                    <span class="span-search-ticket" style="color:`+text_color+`;">Is Senior</span>
                    <input type="checkbox" id="insurance_is_senior" name="insurance_is_senior" />
                    <span class="check_box_span_custom"></span>
                </label>
            </div>
            <div class="col-lg-4">
                <div class="row">
                    <input id="insurance_provider" name="insurance_provider" value="zurich" hidden>
                    <div class="col-lg-12" style="padding-left:0px;" hidden>
                        <span class="span-search-ticket"><i class="fas fa-train"></i> From</span>
                        <div class="input-container-search-ticket">
                            <input id="insurance_origin" name="insurance_origin" class="form-control" type="text" placeholder="Origin" style="width:100%; outline:0" autocomplete="off" value="" onfocus="document.getElementById('insurance_origin').select();" onclick="set_insurance_search_value_to_false();">
                        </div>
                    </div>
                    <div class="col-lg-12" style="z-index:5;">
                        <span class="span-search-ticket"><i class="fas fa-map-marked-alt"></i> Destination</span>
                        <div class="input-container-search-ticket">
                            <input id="insurance_destination" name="insurance_destination" class="form-control" type="text" placeholder="Destination" style="width:100%; outline:0" autocomplete="off" value="" onfocus="document.getElementById('insurance_destination').select();" onclick="set_insurance_search_value_to_false();">
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-4" hidden>
                <span class="span-search-ticket"><i class="fas fa-suitcase"></i> Plan Trip</span>
                <select id="insurance_trip" name="insurance_trip" class="form-control" onchange="next_focus_element('insurance','plantrip')">
                    <option value="LAINNYA" selected>LAINNYA</option>
                </select>
            </div>
            <div class="col-lg-4" id="insurance_date_search">
                <span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Date</span>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control" style="background:white;" id="insurance_date" name="insurance_date" placeholder="Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Date '" autocomplete="off" readonly/>
                </div>
            </div>
            <div class="col-lg-4">
                <span class="span-search-ticket"><i class="fas fa-users"></i> Passenger</span>
                <div class="input-container-search-ticket btn-group">
                    <button id="show_total_pax_insurance" style="text-align:left; cursor:pointer;" type="button" class="form-control dropdown-toggle" data-toggle="dropdown"></button>
                    <ul class="dropdown-menu" role="menu" style="overflow-y:unset;">
                        <div class="row" style="padding:10px;">
                            <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="float:left !important;">
                                <div style="float:left;">
                                    <label>
                                        <span style="color:black; font-size:13px;">Customer<br/></span>
                                    </label>
                                </div>
                            </div>
                            <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="float:right !important;">
                                <div style="float:right; display:flex; padding:5px 0px 5px 5px;">
                                    <button type="button" class="left-minus-adult-insurance btn-custom-circle" id="left-minus-adult-insurance" data-type="minus" data-field="" disabled>
                                        <i class="fas fa-minus"></i>
                                    </button>
                                    <input type="text" style="font-size:13px; padding:5px !important; border:none; background:none; font-size:13px; text-align:center; width:25px;" id="insurance_adult" name="insurance_adult" value="1" min="1" readonly>
                                    <button type="button" class="right-plus-adult-insurance btn-custom-circle" id="right-plus-adult-insurance" data-type="plus" data-field="">
                                        <i class="fas fa-plus"></i>
                                    </button>
                                </div>
                            </div>

                            <div class="col-lg-12" style="text-align:right;">
                                <hr/>
                                <button class="primary-btn" type="button" style="line-height:34px;" onclick="next_focus_element('insurance','passenger');">Done</button>
                            </div>
                        </div>
                    </ul>
                </div>
            </div>`;
        }
        document.getElementById('insurance_div').innerHTML = text;
        //load js ulang
        document.getElementById("insurance_origin").value = "Surabaya - Domestic"
        var insurance_destination = new autoComplete({
            selector: '#insurance_destination',
            minChars: 1,
            cache: false,
            delay:0,
            source: function(term, suggest){
                if(term.split(' - ').length == 4)
                    term = ''
                if(term.length > 1)
                    suggest(insurance_search_autocomplete(term,'destination'));
            },
            onSelect: function(e, term, item){
                setTimeout(function(){
                    $('.nice-select').addClass("open");
                }, 200);
                set_insurance_search_value_to_true();
            }
        });
        selected_value_start = $("input[name='radio_insurance_type']:checked").val();
        if (selected_value_start == "Single Trip"){
            $('input[name="insurance_date"]').daterangepicker({
                singleDatePicker: false,
                autoUpdateInput: true,
                startDate: moment(),
                autoApply: true,
                endDate: moment().subtract(-2, 'days'),
                minDate: moment().subtract(-1, 'days'),
                maxDate: moment().subtract(-1, 'years'),
                showDropdowns: true,
                opens: 'center',
                locale: {
                    format: 'DD MMM YYYY',
                }
            });

            $('input[name="insurance_date"]').on('apply.daterangepicker', function(ev, picker) {
                setTimeout(function(){
                    $("#show_total_pax_insurance").click();
                }, 200);
            });
        }
        $('#insurance_trip').niceSelect();
    }

    var quantity_adult_insurance = parseInt($('#insurance_adult').val());
    $('#show_total_pax_insurance').text(quantity_adult_insurance + " Customer");

    $('.right-plus-adult-insurance').click(function(e){
        // Stop acting like a button
        e.stopPropagation();
        // Get the field name
        var quantity = parseInt($('#insurance_adult').val());

        // If is not undefined
        if(quantity < 4){
            $('#insurance_adult').val(quantity + 1);
            quantity_adult_insurance = quantity + 1;

            $('#show_total_pax_insurance').text(quantity_adult_insurance + " Customer");
        }

        if (quantity_adult_insurance == 4){
            document.getElementById("left-minus-adult-insurance").disabled = false;
            document.getElementById("right-plus-adult-insurance").disabled = true;
        }
        else{
            document.getElementById("left-minus-adult-insurance").disabled = false;
        }
    });
    $('.left-minus-adult-insurance').click(function(e){
        // Stop acting like a button
        e.stopPropagation();
        // Get the field name
        var quantity = parseInt($('#insurance_adult').val());

        // If is not undefined
        // Increment
        if(quantity > 1){
            $('#insurance_adult').val(quantity - 1);
            quantity_adult_insurance = quantity - 1;

            $('#show_total_pax_insurance').text(quantity_adult_insurance + " Customer");
        }

        if (quantity_adult_insurance == 1){
            document.getElementById("left-minus-adult-insurance").disabled = true;
            document.getElementById("right-plus-adult-insurance").disabled = false;
        }
        else{
            document.getElementById("right-plus-adult-insurance").disabled = false;
        }
    });

    insurance_get_config('home');
}

function edit_additional_benefit(){
    var additional_price = 0;
    var additional_benefit_list = [];
    var text = '';
    for(var i=0;i<parseInt(insurance_request.adult);i++){
        additional_benefit_list = [];
        pax_counter = i + 1;
        for(j in insurance_pick.additional_benefit){
            index = parseInt(parseInt(j) + 1);
            if(document.getElementById('checkbox_add_benefit'+pax_counter+'_'+index).checked){
                additional_benefit_list.push(insurance_pick.additional_benefit[j]);
                additional_price += insurance_pick.additional_benefit[j].price;
            }
        }
        if(additional_benefit_list.length > 0){
            text = `
                <table id="list-of-passenger" style="width:100%;">
                    <tr>
                        <th style="width:65%;">Coverage</th>
                        <th style="width:35%;">Price</th>
                    </tr>
            `;
            for(k in additional_benefit_list){
                text += `
                    <tr>
                        <td>`+additional_benefit_list[k].text_with_tag+`</td>
                        <td>`+additional_benefit_list[k].currency+` `+getrupiah(additional_benefit_list[k].price)+`</td>
                    </tr>
                `;
            }
            text += `</table>`;
        }
        document.getElementById('adult_additional_benefit'+pax_counter+'_div').innerHTML = text;
        document.getElementById('adult_additional_benefit'+pax_counter).value = JSON.stringify(additional_benefit_list);
        text = '';
        additional_benefit_list = [];
    }
    //inner html additional price;
    text = `
        <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12" style="text-align:left;">
            <span style="font-size:13px; font-weight:500;">Additional Price</span><br/>
        </div>
        <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12" style="text-align:right;">
            <span style="font-size:13px; font-weight:500;">`+price.currency+` `+getrupiah(additional_price)+`</span><br/>
        </div>
        <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12" style="text-align:left;">
            <span style="font-size:13px; font-weight:500;">Grand Total</span><br/>
        </div>
        <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12" style="text-align:right;">
            <span style="font-size:13px; font-weight:500;">`+price.currency+` `+getrupiah(grandtotal+additional_price)+`</span><br/>
        </div>`;
    document.getElementById('additionalprice_div').innerHTML = text;

}