var origin_insurance_destination = [];
var destination_insurance_destination = [];
var zurich_insurance_destination = [];
var sorting_value = 'Lowest Price';
var myVar;
var sorting_list = [
    {
        value:'Name A-Z',
        status: false
    },
    {
        value:'Name Z-A',
        status: false
    },
    {
        value:'Lowest Price',
        status: false
    },
    {
        value:'Highest Price',
        status: false
    }
]

var sorting_list2 = [
    {
        value:'Name',
        status: false
    },
    {
        value:'Price',
        status: false
    }
]
function insurance_signin(data){
    $.ajax({
       type: "POST",
       url: "/webservice/insurance",
       headers:{
            'action': 'signin',
       },
       data: {},
       success: function(msg) {
       try{
           if(msg.result.error_code == 0){
               insurance_signature = msg.result.response.signature;
               signature = msg.result.response.signature;
               get_agent_currency_rate();
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

function insurance_get_config_provider(page=false){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/insurance",
       headers:{
            'action': 'get_config_provider',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
       try{
           if(msg.result.error_code == 0){
                insurance_get_config(page, msg.result.response);
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

function insurance_get_config(page=false, provider_allowed=[]){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/insurance",
       headers:{
            'action': 'get_config',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
       try{
           if(msg.result.error_code == 0){
                insurance_config = {};
                for(i in msg.result.response){
                    if(provider_allowed.hasOwnProperty(i))
                        insurance_config[i] = msg.result.response[i];
                }
                if(['home'].includes(page))
                    print_insurance();
                insurance_print_provider();
                var choice = '';
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
                    choice = '';
                    if(insurance_request.provider == 'zurich'){
                        for(i in insurance_config['zurich']['region']){
                            if(insurance_request.destination_area == i){
                                choice +=`<option value="`+i+`" selected>`+i.substr(0,1).toUpperCase()+i.substr(1,i.length).toLowerCase()+`</option>`;
                            }else{
                                choice +=`<option value="`+i+`">`+i.substr(0,1).toUpperCase()+i.substr(1,i.length).toLowerCase()+`</option>`;
                            }
                        }
                        document.getElementById('insurance_destination_area').innerHTML = choice;
                        $('#insurance_destination_area').niceSelect('update');
                    }else if(insurance_request.provider == 'bcainsurance'){
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

                if(page == 'passenger'){
                    var choice_adult = '<option value="">Select Relation</option>';
                    var choice_child = '<option value="">Select Relation</option>';
                    var choice_all = '<option value="">Select Relation</option>';
                    var choice_city = '<option value="">City</option>';
                    var choice_place_of_birth = '<option value="">Place of Birth</option>';
                    var choice_identity = '<option value="">Choose Identity Type</option>';
                    var choice_title_adult = '<option value=""></option><option value="MR">MR</option><option value="MRS">MRS</option><option value="MS">MS</option>';
                    var choice_title_child = '<option value=""></option><option value="MSTR">MSTR</option><option value="MISS">MISS</option>';

                    if(insurance_pick.provider == 'zurich')
                        choice_identity+=`<option value="ktp">KTP/NIK</option>`;
                    choice_identity+=`<option value="passport">Passport</option>`;
                    for(i in insurance_config){
                        if(i == insurance_pick.provider){
                            for(j in insurance_config[i]['Table Relation']){
                                if(j.toLowerCase().includes('anak')){
                                    choice_child += '<option value="'+j+'">'+j+'</option>';
                                    choice_all += '<option value="'+j+'">'+j+'</option>';
                                }else if(insurance_config[i]['Table Relation'][j].toLowerCase().includes('child')){
                                    choice_child += '<option value="'+j+'">'+insurance_config[i]['Table Relation'][j]+'</option>';
                                    choice_all += '<option value="'+j+'">'+insurance_config[i]['Table Relation'][j]+'</option>';
                                }else if(insurance_config[i]['Table Relation'][j].toLowerCase().includes('spouse')){
                                    choice_adult += '<option value="'+j+'">'+insurance_config[i]['Table Relation'][j]+'</option>';
                                    choice_all += '<option value="'+j+'">'+insurance_config[i]['Table Relation'][j]+'</option>';
                                }else if(j.toLowerCase().includes('saudara') == false){
                                    choice_adult += '<option value="'+j+'">'+j+'</option>';
                                    choice_all += '<option value="'+j+'">'+j+'</option>';
                                }else{
                                    choice_child += '<option value="'+j+'">'+j+'</option>';
                                    choice_adult += '<option value="'+j+'">'+j+'</option>';
                                    choice_all += '<option value="'+j+'">'+j+'</option>';
                                }
                            }
                        }
                    }
                    for(var i=1;i<=parseInt(insurance_request.adult);i++){
                        var counter = 1;
                        if(insurance_pick.provider == 'zurich'){
                            document.getElementById('adult_additional_data_for_insurance'+i).style.display = 'block';
                        }
                        for(var j=1;j<=parseInt(insurance_request.family.adult);j++){
                            if(insurance_pick.type_trip_name == 'Family'){
                                document.getElementById('Adult_relation'+i+'_relation'+counter).innerHTML += choice_adult;
                                $('#Adult_relation'+i+'_relation'+counter).niceSelect('update');
                            }else{
                                document.getElementById('Adult_relation'+i+'_relation'+counter+'_div').style.display = 'none';
                            }
                            document.getElementById('Adult_relation'+i+'_title'+counter).innerHTML = choice_title_adult;
                            $('#Adult_relation'+i+'_title'+counter).niceSelect('update');
                            document.getElementById('Adult_relation'+i+'_id_type'+counter).innerHTML = choice_identity;
                            $('#Adult_relation'+i+'_id_type'+counter).niceSelect('update');
                            counter++;
                        }
                        for(var j=1;j<=parseInt(insurance_request.family.child);j++){
                            if(insurance_pick.type_trip_name == 'Family'){
                                document.getElementById('Child_relation'+i+'_relation'+counter).innerHTML += choice_child;
                                $('#Child_relation'+i+'_relation'+counter).niceSelect('update');
                            }else{
                                document.getElementById('Child_relation'+i+'_relation'+counter+'_div').style.display = 'none';
                            }
                            document.getElementById('Child_relation'+i+'_title'+counter).innerHTML = choice_title_child;
                            $('#Child_relation'+i+'_title'+counter).niceSelect('update');
                            document.getElementById('Child_relation'+i+'_id_type'+counter).innerHTML = choice_identity;
                            $('#Child_relation'+i+'_id_type'+counter).niceSelect('update');
                            counter++;
                        }
                        if(insurance_pick.provider == 'bcainsurance'){
                            document.getElementById('Adult_relation_beneficiary_relation'+i).innerHTML += choice_all;
                            $('#Adult_relation_beneficiary_relation'+i).niceSelect('update');
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

function insurance_print_provider(){
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
    var choice = '';
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
        }
    }
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
                            <img src="/static/tt_website/images/no_found/no-activity.png" alt="Product not Found" style="width:70px; height:70px;" title="" />
                            <br/>
                        </div>
                        <center><div class="alert alert-warning" role="alert" style="margin-top:15px; border:1px solid #cdcdcd;"><h6><i class="fas fa-search-minus"></i> Oops! Product not found. Please try again or search another product. </h6></div></center>
                    </div>`;
                    document.getElementById('insurance_ticket').innerHTML += text;
                }else{
                    sort(insurance_data);
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

function filter_name(name_num){
    clearTimeout(myVar);
    myVar = setTimeout(function() {
        change_filter('insurance_name' + String(name_num));
    }, 500);
}

function get_carriers_insurance(){
    $.ajax({
       type: "POST",
       url: "/webservice/insurance",
       headers:{
            'action': 'get_carriers',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
           insurance_carriers = msg;
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {

       },timeout: 60000
    });
}

function change_filter(type){
    var check = 0;
    if(type == 'insurance_name1'){
        document.getElementById('insurance_filter_name2').value = document.getElementById('insurance_filter_name').value;
    }
    else if(type == 'insurance_name2'){
        document.getElementById('insurance_filter_name').value = document.getElementById('insurance_filter_name2').value;
    }
    filtering('filter');
}

function filtering(type){
    var temp_data = [];
    var searched_name = $('#insurance_filter_name').val();
    data = insurance_data;
    insurance_filter = {}
    if (searched_name){
        for(i in data){
            data[i].forEach((obj)=> {
                var test = 1;
                searched_name.toLowerCase().split(" ").forEach((search_str)=> {
                    if (obj.carrier_name.toLowerCase().includes( search_str ) == false){
                        test = 0;
                    }
                });
                if(test == 1){
                    temp_data.push(obj);
                }
            });
            data = temp_data;
            if(insurance_filter.hasOwnProperty(i) == false)
                insurance_filter[i] = []
            for(x in data){
                insurance_filter[i].push(data[x]);
            }
            temp_data = [];
        }
   }else{
        insurance_filter = data;
   }
   sort(insurance_filter);
}


function sort_button(value){
    if(value == 'name'){
       if(sorting_value == '' || sorting_value == 'Name A-Z'){
           sorting_value = 'Name Z-A';
           document.getElementById("img-sort-down-name").style.display = "none";
           document.getElementById("img-sort-up-name").style.display = "block";
       }else{
           sorting_value = 'Name A-Z';
           document.getElementById("img-sort-down-name").style.display = "block";
           document.getElementById("img-sort-up-name").style.display = "none";
       }
   }else if(value == 'price'){
       if(sorting_value == '' || sorting_value == 'Lowest Price'){
           sorting_value = 'Highest Price';
           document.getElementById("img-sort-down-price").style.display = "none";
           document.getElementById("img-sort-up-price").style.display = "block";
       }else{
           sorting_value = 'Lowest Price';
           document.getElementById("img-sort-down-price").style.display = "block";
           document.getElementById("img-sort-up-price").style.display = "none";
       }

   }
   filtering('filter');
}

function sort(data){
    insurance_data_filter = data;
    sorting = '';
    var radios = document.getElementsByName('radio_sorting');
    for (var j = 0, length = radios.length; j < length; j++) {
        if (radios[j].checked) {
            sorting = document.getElementById('radio_sorting2'+j).value;
            break;
        }
    }
    if(sorting_value != ''){
        sorting = sorting_value;
    }
    console.log(sorting);
    for(var x in insurance_data_filter){
        for(var i = 0; i < insurance_data_filter[x].length-1; i++) {
            for(var j = i+1; j < insurance_data_filter[x].length; j++) {
                if(sorting == '' || sorting == 'Name A-Z'){
                    if(insurance_data_filter[x][i].carrier_name > insurance_data_filter[x][j].carrier_name){
                        var temp = insurance_data_filter[x][i];
                        insurance_data_filter[x][i] = insurance_data_filter[x][j];
                        insurance_data_filter[x][j] = temp;
                    }
                }
                if(sorting == 'Name Z-A'){
                    if(insurance_data_filter[x][i].carrier_name < insurance_data_filter[x][j].carrier_name){
                        var temp = insurance_data_filter[x][i];
                        insurance_data_filter[x][i] = insurance_data_filter[x][j];
                        insurance_data_filter[x][j] = temp;
                    }
                }else if(sorting == 'Lowest Price'){
                    if(insurance_data_filter[x][i].total_price > insurance_data_filter[x][j].total_price){
                        var temp = insurance_data_filter[x][i];
                        insurance_data_filter[x][i] = insurance_data_filter[x][j];
                        insurance_data_filter[x][j] = temp;
                    }
                }else if(sorting == 'Highest Price'){
                    if(insurance_data_filter[x][i].total_price < insurance_data_filter[x][j].total_price){
                        var temp = insurance_data_filter[x][i];
                        insurance_data_filter[x][i] = insurance_data_filter[x][j];
                        insurance_data_filter[x][j] = temp;
                    }
                }
            }
        }
    }
    var sequence = 0;
    var text = '';
    for(i in insurance_data_filter){
        for(j in insurance_data_filter[i]){
            currency = '';
            for(k in insurance_data_filter[i][j].service_charges){
                if(currency)
                    break;
                currency = insurance_data_filter[i][j].service_charges[k].currency;
            }
            text+=`
               <div class="col-lg-4 col-md-4 activity_box" style="min-height:unset;">`;
                    if(template == 3 || template == 4){
                        text+=`<div class="single-recent-blog-post item" style="border:unset;">`;
                    }
                    else{
                        text+=`<div class="single-recent-blog-post item" style="border:1px solid #cdcdcd;">`;
                    }

                    text+=`
                        <div class="single-destination relative">`;
                            if(insurance_data_filter[i][j].provider == 'bcainsurance')
                                text+=`<div class="thumb relative" style="cursor:pointer; border-bottom:1px solid #cdcdcd; height:200px; background: white url('/static/tt_website/images/logo/insurance/`+insurance_data_filter[i][j].MasterBenefitName.toLowerCase()+`-`+insurance_data_filter[i][j].type_trip_name.toLowerCase()+`.png'); background-size: cover; background-repeat: no-repeat; background-position: center center;" onclick="go_to_detail('`+i+`','`+sequence+`')">`;
                            else if(insurance_data_filter[i][j].provider == 'zurich')
                                text+=`<div class="thumb relative" style="cursor:pointer; border-bottom:1px solid #cdcdcd; height:200px; background: white url('/static/tt_website/images/logo/insurance/zurich_img.png'); background-size: cover; background-repeat: no-repeat; background-position: center center;" onclick="go_to_detail('`+i+`','`+sequence+`')">`;
                            text+=`
                            </div>
                            <div class="card card-effect-promotion" style="border:unset;">`;
                            if(template == 3 || template == 4){
                                text+=`<div class="card-body" style="border:unset;">`;
                            }
                            else{
                                text+=`<div class="card-body">`;
                            }

                            text+=`
                                    <div class="row details">
                                        <div class="col-lg-12 mb-3" style="height:90px;">
                                            <span style="font-size:15px;font-weight:bold;" title="`+insurance_data_filter[i][j].carrier_name+`">`+insurance_data_filter[i][j].carrier_name+` </span>`;
                                            //<span style="margin-bottom:10px; font-size:13px;">Destination Area: `+insurance_data_filter[i][j].data_name+`  </span>
                                            if(insurance_data_filter[i][j].provider == 'bcainsurance'){
                                                text+=`
                                                <span style="padding-left:3px; cursor:pointer; color:`+color+`;" id="`+i+sequence+`" >
                                                    <i class="fas fa-info-circle" style="font-size:16px;"></i>
                                                </span>`;
                                            }else{
                                                //edit cenius
                                                cover_covid = false;
                                                for(k in insurance_data_filter[i][j].additional_benefit){
                                                    if(insurance_data_filter[i][j].additional_benefit[k].text[0].toLowerCase().includes('covid-19') || insurance_data_filter[i][j].additional_benefit[k].text[1].toLowerCase().includes('covid-19'))
                                                        cover_covid = true;
                                                }
                                                if(cover_covid){
                                                    text += `<br/><i class="fas fa-shield-alt"></i><span> Cover Covid-19</span>`;
                                                }
                                            }
                                        text+=`
                                        </div>
                                        <div class="col-lg-12 mt-2">
                                            <span style="float:right; margin-right:5px; margin-bottom:5px;"><span style="font-size:16px;font-weight:bold; color:`+color+`;">`+currency+` `+getrupiah(insurance_data_filter[i][j].total_price)+`</span>`;
                                        if(insurance_data_filter[i][j].type_trip_name != 'Family')
                                            text+=`
                                                <span> / Pax</span>`;
                                        else
                                            text+=`
                                                <span> / Package</span>`;
                                        text+=`
                                            </span>
                                            <br/>`;
                                        if(typeof(currency_rate_data) !== 'undefined' && currency_rate_data.result.is_show && insurance_data_filter[i][j].total_price){
                                            if(user_login.hasOwnProperty('co_ho_seq_id') && currency_rate_data.result.response.agent.hasOwnProperty(user_login.co_ho_seq_id)){ // buat o3
                                                for(l in currency_rate_data.result.response.agent[user_login.co_ho_seq_id]){
                                                    try{
                                                        if(currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].base_currency == currency){
                                                            price_convert = (insurance_data_filter[i][j].total_price/currency_rate_data.result.response.agent[user_login.co_ho_seq_id][l].rate).toFixed(2);
                                                            if(price_convert%1 == 0)
                                                                price_convert = parseInt(price_convert);
                                                            text+=`<span style="float:right; margin-right:5px; margin-bottom:5px;"><span style="font-size:16px;font-weight:bold; color:`+color+`;" id="total_price_`+l+`"> Estimated `+l+` `+price_convert+`</span>`;
                                                            if(insurance_data_filter[i][j].type_trip_name != 'Family')
                                                                text+=`
                                                                    <span> / Pax</span>`;
                                                            else
                                                                text+=`
                                                                    <span> / Package</span>`;
                                                            text+=`<br/>`;
                                                        }
                                                    }catch(err){
                                                        console.log(err);
                                                    }
                                                }
                                            }
                                        }
                                        text+=`
                                            <button style="line-height:32px; width:100%;" type="button" class="primary-btn" onclick="modal_policy('`+i+`','`+sequence+`')">BUY</button>
                                        </div>
                                        <div class="col-lg-12 mt-3">`;
                                            if(insurance_data_filter[i][j].provider == 'zurich'){
                                                text += `
                                                <span style="float:left; margin-right:15px; font-size:14px;color:blue;font-weight:bold; cursor:pointer;" data-toggle="modal" data-target="#myModalCoverage" onclick="update_coverage_data(`+j+`)"><u style="color:`+color+` !important">Coverage</u>  </span>`;
                                            }
                                        text+=`
                                            <span style="float:left; font-size:14px;color:blue;font-weight:bold; cursor:pointer;" onclick="openInNewTab('`+insurance_data_filter[i][j].pdf+`');"><u style="color:`+color+` !important">Benefit</u>  </span>
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
    document.getElementById('insurance_ticket').innerHTML = text;
    sequence = 0;
    for(i in insurance_data_filter){
        for(j in insurance_data_filter[i]){
            if(insurance_data_filter[i][j].provider == 'bcainsurance'){
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
                    content: insurance_data_filter[i][j].info,
                });
            }
            sequence++;
        }
    }
}

function update_coverage_data(val){
    document.getElementById('coverage_zurich').innerHTML = insurance_data_filter['zurich'][val].info;
}


function insurance_filter_render(){
    var node = document.createElement("div");
    text = '';
    text+= `<h4 style="display: inline;">Filter</h4><a style="float: right; cursor: pointer;" onclick="reset_filter();"><i style="color:`+color+`;" class="fa fa-refresh"></i> Reset</a>
    <hr/>`;
    if(template == 1){
        text+=`<div class="banner-right">`;
    }else if(template == 2){
        text+=`
        <div class="hotel-search-form-area" style="bottom:0px !important; padding-left:0px; padding-right:0px;">
            <div class="hotel-search-form" style="background-color:unset; padding:unset; box-shadow:unset; color:`+text_color+`;">`;
    }else if(template == 3){
        text+=`
        <div class="header-right" style="background:unset; border:unset;">`;
    }else if(template == 4 || template == 5 || template == 6){
        text+=`
        <div>`;
    }
    text+=`
        <div class="form-wrap" style="padding:0px; text-align:left;">
            <h6 class="filter_general" onclick="show_hide_general('activityName');">Insurance Name <i class="fas fa-chevron-down" id="activityName_generalDown" style="float:right; display:none;"></i><i class="fas fa-chevron-up" id="activityName_generalUp" style="float:right; display:block;"></i></h6>
            <div id="activityName_generalShow" style="display:inline-block; width:100%;">
                <input type="text" style="margin-bottom:unset;" class="form-control" id="insurance_filter_name" placeholder="Insurance Name " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Insurance Name '" autocomplete="off" onkeyup="filter_name(1);"/>
            </div>
            <hr/>
        </div>
    </div>`;
    if(template == 2){
        text+=`</div>`;
    }

    node = document.createElement("div");
    node.innerHTML = text;
    document.getElementById("filter").appendChild(node);
    node = document.createElement("div");

    text='';
    text+=`<span style="font-weight: bold; margin-right:10px;">Sort by: </span>`;

    for(i in sorting_list2){
        text+=`
        <button class="primary-btn-sorting" id="radio_sorting`+i+`" name="radio_sorting" onclick="sort_button('`+sorting_list2[i].value.toLowerCase()+`');" value="`+sorting_list2[i].value+`">
            <span id="img-sort-down-`+sorting_list2[i].value.toLowerCase()+`" style="display:block;"> `+sorting_list2[i].value+` <i class="fas fa-caret-down"></i></span>
            <span id="img-sort-up-`+sorting_list2[i].value.toLowerCase()+`" style="display:none;"> `+sorting_list2[i].value+` <i class="fas fa-caret-up"></i></span>
        </button>`;
    }
    node = document.createElement("div");
    node.className = 'sorting-box';
    node.innerHTML = text;
    document.getElementById("sorting-flight").appendChild(node);

    var node2 = document.createElement("div");
    text = '';
    text+= `<h4 style="display: inline;">Filter</h4><a style="float: right; cursor: pointer;" onclick="reset_filter();"><i style="color:`+color+`;" class="fa fa-refresh"></i> Reset</a>
            <hr/>
            <h6 style="padding-bottom:10px;">Insurance Name</h6>`;
            if(template == 1){
                text+=`<div class="banner-right">`;
            }else if(template == 2){
                text+=`
                <div class="hotel-search-form-area" style="bottom:0px !important; padding-left:0px; padding-right:0px;">
                    <div class="hotel-search-form" style="background-color:unset; padding:unset; box-shadow:unset; color:`+text_color+`;">`;
            }
            text+=`
                <div class="form-wrap" style="padding:0px; text-align:left;">
                    <input type="text" style="margin-bottom:unset;" class="form-control" id="insurance_filter_name2" placeholder="Insurance Name " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Insurance Name '" autocomplete="off" onkeyup="filter_name(2);"/>
                </div>
            </div>`;
            if(template == 2){
                text+=`</div>`;
            }
    text+=`
        <hr/>`;

    node2 = document.createElement("div");
    node2.innerHTML = text;
    document.getElementById("filter2").appendChild(node2);

    text='';
    text+=`<h4>Sorting</h4>
            <hr/>`;

    for(i in sorting_list){
        text+=`
        <label class="radio-button-custom">
            <span class="span-search-ticket" style="color:black;">`+sorting_list[i].value+`</span>
            <input type="radio" id="radio_sorting2`+i+`" name="radio_sorting" onclick="sort_button('`+sorting_list[i].value+`');" value="`+sorting_list[i].value+`">
            <span class="checkmark-radio"></span>
        </label></br>`;
    }
    node2 = document.createElement("div");
    node2.innerHTML = text;
    document.getElementById("sorting-flight2").appendChild(node2);
}

function go_to_detail(res){
    document.getElementById('time_limit_input').value = time_limit;
    document.getElementById('signature_data').value = signature;
    document.getElementById('pax').value = document.getElementById('total_pax').value;
    document.getElementById('adult').value = document.getElementById('total_adult') ? document.getElementById('total_adult').value : '1';
    document.getElementById('child').value = document.getElementById('total_child') ? document.getElementById('total_child').value : '0';
    document.getElementById('data_insurance').value = JSON.stringify(res);
    document.getElementById('insurance_next').submit();
}

function modal_policy(provider,sequence){
    provider_choose = provider;
    sequence_choose = sequence;
    text = '';
    minPax = insurance_data[provider][sequence].minPax;
    maxPax = insurance_data[provider][sequence].maxPax;
    minAdult = insurance_data[provider][sequence].minAdult;
    maxAdult = insurance_data[provider][sequence].maxAdult;
    minChild = insurance_data[provider][sequence].minChild;
    maxChild = insurance_data[provider][sequence].maxChild;
    if(insurance_data[provider][sequence]['type_trip_name'] == 'Individual'){
        text += `
                 <div class="col-lg-7 col-md-7 col-sm-7">
                    <label>Total Pax</label>
                    <div class="input-container-search-ticket">
                        <input type="number" max="`+maxPax+`" min="`+minPax+`" value="`+minPax+`" class="form-control" id="total_pax" name="total_pax" placeholder="Total Pax " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Total Pax '">
                        <input type="number" value="1" class="form-control" id="total_adult" placeholder="Total Adult " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Total Adult '" hidden>
                        <input type="number" value="0" class="form-control" id="total_child" placeholder="Total Child " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Total Child '" hidden>
                    </div>
                </div>`;
        text+= `<div class="col-lg-5 col-md-5 col-sm-5">
                    <button style="width:100%; float:center; margin-top:25px;" type="button" id="insurance_buy_btn" class="primary-btn ld-ext-right" onclick="insurance_sell('`+provider_choose+`','`+sequence_choose+`')">
                        BUY
                        <div class="ld ld-ring ld-cycle"></div>
                    </button>
                </div>`;
    }else{
        text += `
                 <div class="col-lg-12">
                    <div class="row">
                        <input type="hidden" value="1" class="form-control" name="total_pax" id="total_pax" placeholder="Total Pax " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Total Pax '">`;
        if(maxChild != 0)
            text+=`
                         <div class="col-lg-4">
                            <label>Adult</label>
                            <div class="input-container-search-ticket">
                                <input type="number" max="`+maxAdult+`" min="`+minAdult+`" value="`+minAdult+`" class="form-control" id="total_adult" placeholder="Total Adult " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Total Adult '">
                            </div>
                         </div>
                         <div class="col-lg-4">
                            <label>Child</label>
                            <div class="input-container-search-ticket">
                                <input type="number" max="`+maxChild+`" min="`+minChild+`" value="`+minChild+`" class="form-control" id="total_child" name="total_child" placeholder="Total Child " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Total Child '">
                            </div>
                         </div>`;
        else
            text+=`
                         <div class="col-lg-8">
                            <label>Adult</label>
                            <div class="input-container-search-ticket">
                                <input type="number" max="`+maxAdult+`" min="`+minAdult+`" value="`+minAdult+`" class="form-control" id="total_adult" placeholder="Total Adult " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Total Adult '">
                                <input type="hidden" max="`+maxChild+`" min="`+minChild+`" value="`+minChild+`" class="form-control" id="total_child" name="total_child" placeholder="Total Child " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Total Child '">
                            </div>
                         </div>`;
        text+=`
                         <div class="col-lg-4">
                            <button style="width:100%; float:center; margin-top:25px;" type="button" id="insurance_buy_btn" class="primary-btn ld-ext-right" onclick="insurance_sell('`+provider_choose+`','`+sequence_choose+`')">
                                BUY
                                <div class="ld ld-ring ld-cycle"></div>
                            </button>
                         </div>
                    </div>
                 </div>`;
    }
    document.getElementById('modal_policy_body').innerHTML = text;

    $('#myModalPolicy').modal('show');

    if(insurance_data[provider][sequence]['type_trip_name'] == 'Individual'){
        $("#total_pax").change(function(){
            var quantity = parseInt($('#total_pax').val());

            if(quantity < minPax || isNaN(quantity)){
                quantity = 1;
                $('#total_pax').val(quantity);
            }
            else if(quantity > maxPax){
                quantity = 5;
                $('#total_pax').val(quantity);
            }
        });
    }else{
        $("#total_adult").change(function(){
            var quantity_adult = parseInt($('#total_adult').val());
            var quantity_child = parseInt($('#total_child').val());
            if(quantity_adult < minAdult || isNaN(quantity_adult)){
                quantity_adult = minAdult;
                $('#total_adult').val(quantity_adult);
            }
            else if(quantity_adult > maxAdult){
                quantity_adult = maxAdult;
                $('#total_adult').val(quantity_adult);
            }

            if(quantity_adult + quantity_child > maxPax){
                $('#total_child').val(maxPax-quantity_adult);
            }

        });
        $("#total_child").change(function(){
            var quantity_adult = parseInt($('#total_adult').val());
            var quantity_child = parseInt($('#total_child').val());

            if(quantity_child < minChild || isNaN(quantity_child)){
                quantity_child = minChild;
                $('#total_child').val(quantity_child);
            }
            else if(quantity_child > maxChild){
                quantity_child = maxChild;
                $('#total_child').val(quantity_child);
            }

            if(quantity_adult + quantity_child > maxPax){
                $('#total_adult').val(maxPax-quantity_child);
            }
        });
    }

}

function insurance_sell(provider, sequence){
    if(insurance_data[provider][sequence]['type_trip_name'] == 'Individual'){
        document.getElementById("total_pax").disabled = true;
        document.getElementById("total_adult").value = '1'
        document.getElementById("total_child").value = '0'
        document.getElementById("insurance_buy_btn").disabled = true;
        $('#insurance_buy_btn').addClass("running");
    }
    else{
        document.getElementById("total_adult").disabled = true;
        document.getElementById("total_child").disabled = true;
        document.getElementById("insurance_buy_btn").disabled = true;
        $('#insurance_buy_btn').addClass("running");
    }

    $.ajax({
       type: "POST",
       url: "/webservice/insurance",
       headers:{
            'action': 'sell_insurance',
       },
       data: {
            'signature': signature,
            'total_pax': parseInt(document.getElementById('total_adult').value) + parseInt(document.getElementById('total_child').value),
            'total_package': document.getElementById('total_pax').value,
            'insurance_pick': JSON.stringify(insurance_data[provider][sequence])
       },
       success: function(msg) {
       try{
            console.log(msg);
           if(msg.result.error_code == 0){
                msg.result.response['minAdult'] = minAdult;
                msg.result.response['maxAdult'] = maxAdult;
                msg.result.response['minChild'] = minChild;
                msg.result.response['maxChild'] = maxChild;
                go_to_detail(msg.result.response)
           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
           }else{
                if(insurance_data[provider][sequence]['type_trip_name'] == 'Individual'){
                    document.getElementById("total_pax").disabled = false;
                    document.getElementById("insurance_buy_btn").disabled = false;
                }
                else{
                    document.getElementById("total_adult").disabled = false;
                    document.getElementById("total_child").disabled = false;
                    document.getElementById("insurance_buy_btn").disabled = false;
                }

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
            if(insurance_data[provider][sequence]['type_trip_name'] == 'Individual'){
                document.getElementById("total_pax").disabled = false;
                document.getElementById("insurance_buy_btn").disabled = false;
            }
            else{
                document.getElementById("total_adult").disabled = false;
                document.getElementById("total_child").disabled = false;
                document.getElementById("insurance_buy_btn").disabled = false;
            }

           Swal.fire({
               type: 'error',
               title: 'Oops...',
               text: 'Something went wrong, please try again or check your internet connection',
           })
           $('.loader-rodextrip').fadeOut();
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
          error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error insurance sell');
            if(insurance_data[provider][sequence]['type_trip_name'] == 'Individual'){
                document.getElementById("total_pax").disabled = false;
                document.getElementById("insurance_buy_btn").disabled = false;
            }
            else{
                document.getElementById("total_adult").disabled = false;
                document.getElementById("total_child").disabled = false;
                document.getElementById("insurance_buy_btn").disabled = false;
            }

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

function insurance_get_token(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/insurance",
       headers:{
            'action': 'get_token',
       },
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
           insurance_get_config_provider('search');
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
            get_carriers_insurance();
            insurance_pick = msg.insurance_pick;
            insurance_request = msg.insurance_request;
            departure_date = '';
            if(insurance_pick.hasOwnProperty('date_start'))
                departure_date = insurance_pick.date_start;
            for(i=0;i<adult;i++){
                document.getElementById('adult_additional_data_for_insurance'+parseInt(parseInt(i)+1)).style.display = 'block';
            }
            insurance_get_config_provider('passenger');
            //harga kanan
            price_detail();
            var counter_additional = 0;
            var counter_pax = 0;
            var add_benefit = false;
            if(insurance_pick.hasOwnProperty('additional_benefit')){
                for(i in insurance_pick.additional_benefit){
                    // autopick benefit covid
                    if(insurance_pick.additional_benefit[i].text[0].toLowerCase().includes('covid')){
                        add_benefit = true;
                        counter_additional = parseInt(parseInt(i)+1).toString();
                        for(j=0;j<adult;j++){
                            counter_pax = parseInt(parseInt(j)+1).toString();
                            document.getElementById('checkbox_add_benefit'+counter_pax+'_'+counter_additional).checked = 'checked';
                        }
                    }
                }
                if(add_benefit)
                    edit_additional_benefit();
            }
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
            var formData = new FormData($('#global_payment_form').get(0));
            formData.append('signature', signature);
            formData.append('provider', vendor);
            formData.append('test_type', test_type);
            formData.append('force_issued', 0);
            try{
                formData.append('acquirer_seq_id', payment_acq2[payment_method][selected].acquirer_seq_id);
                formData.append('member', payment_acq2[payment_method][selected].method);
//                formData.append('voucher_code', voucher_code);
                if (document.getElementById('is_attach_pay_ref') && document.getElementById('is_attach_pay_ref').checked == true)
                {
                    formData.append('payment_reference', document.getElementById('pay_ref_text').value);
                }
            }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
            }
            if(typeof(voucher_code) !== 'undefined')
                formData.append('voucher_code', voucher_code);
            $.ajax({
               type: "POST",
               url: "/webservice/insurance",
               headers:{
                    'action': 'commit_booking',
               },
               data: formData,
               success: function(msg) {
                   if(msg.result.error_code == 0){
                        if(user_login.co_agent_frontend_security.includes('b2c_limitation') == true){
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
                            document.getElementById('insurance_booking').innerHTML+= '<input type="hidden" name="order_number" value='+msg.result.response.order_number+'>';
                            document.getElementById('insurance_booking').action = '/insurance/booking/' + btoa(msg.result.response.order_number);
                            document.getElementById('insurance_booking').submit();
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
               contentType:false,
               processData:false,
               error: function(XMLHttpRequest, textStatus, errorThrown) {

               },timeout: 60000
            });
        }
    })
}

function price_detail(){
    price = {'fare':0,'tax':0,'rac':0,'roc':0,'currency':'','pax_count': parseInt(insurance_request['adult'])};
    for(i in insurance_pick.service_charges){
        if(!price.currency)
            price.currency = insurance_pick.service_charges[i].currency;
        if(insurance_pick.service_charges[i].charge_type == 'FARE'){
            price['fare'] += insurance_pick.service_charges[i].amount;
        }else if(insurance_pick.service_charges[i].charge_type == 'TAX'){
            price['tax'] += insurance_pick.service_charges[i].total;
        }else if(insurance_pick.service_charges[i].charge_type == 'RAC'){
            price['rac'] += insurance_pick.service_charges[i].total;
        }else if(insurance_pick.service_charges[i].charge_type == 'ROC'){
            price['roc'] += insurance_pick.service_charges[i].total;
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
                <span style="font-size:13px; font-weight:500;">1x Tax @`+price.currency+` `+getrupiah(Math.ceil(price.tax + price.roc))+`</span>
            </div>
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="text-align:right;">
                <span style="font-size:13px; font-weight:500;">`+price.currency+` `+getrupiah(Math.ceil((price.fare) * price.pax_count) + (price.roc + price.tax))+`</span>
            </div>
            <div class="col-lg-12">
                <hr style="border:1px solid #e0e0e0; margin-top:5px; margin-bottom:5px;"/>
            </div>
        </div>`;
    grandtotal = Math.ceil((price.fare) * price.pax_count + (price.roc + price.tax));
    text += `
        <div class="row" style="padding:5px;" id="additionalprice_div">`;
    additional_price = 0;
    if(document.URL.split('/')[document.URL.split('/').length-1] == 'review'){
        for(i in insurance_passenger.adult){
            for(j in insurance_passenger.adult[i].data_insurance.addons){
                additional_price += insurance_passenger.adult[i].data_insurance.addons[j].total_price;
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
                <span id="total_price" style="font-size:13px; font-weight:500;`;
            if(is_show_breakdown_price){
                text+= "cursor:pointer;";
            }
            text+=`">`+price.currency+` `+getrupiah(grandtotal+additional_price);
            if(is_show_breakdown_price){
                text+= ` <i class="fas fa-caret-down"></i>`;
            }
            text+=`</span><br/>
                </div>
            </div>`;
    if(typeof(currency_rate_data) !== 'undefined' && currency_rate_data.result.is_show && grandtotal+additional_price){
        if(user_login.hasOwnProperty('co_ho_seq_id') && currency_rate_data.result.response.agent.hasOwnProperty(user_login.co_ho_seq_id)){ // buat o3
            for(k in currency_rate_data.result.response.agent[user_login.co_ho_seq_id]){
                try{
                    if(currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].base_currency == price.currency){
                        price_convert = (parseFloat(grandtotal+additional_price)/currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].rate).toFixed(2);
                        if(price_convert%1 == 0)
                            price_convert = parseInt(price_convert);
                        text+=`
                            <div class="row" style="padding:5px;">
                                <div class="col-lg-12" style="text-align:right;">
                                    <span style="font-size:13px; font-weight:500;" id="total_price_`+k+`"> Estimated `+k+` `+price_convert+`</span><br/>
                                </div>
                            </div>`;
                    }
                }catch(err){
                    console.log(err);
                }
            }
        }
    }

    if(user_login.co_agent_frontend_security.includes('see_commission') == true && user_login.co_agent_frontend_security.includes("corp_limitation") == false){
        text+=print_commission(price['rac']*-1,'show_commission', price.currency)
    }
    if(user_login.co_agent_frontend_security.includes('see_commission') == true && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
        text+=`<center><div style="margin-bottom:5px;"><input class="primary-btn-ticket" id="show_commission_button" style="width:100%;" type="button" onclick="show_commission();" value="Hide YPM"/></div>`;
    document.getElementById('insurance_detail_table').innerHTML = text;

    if(is_show_breakdown_price){
        var price_breakdown = {};
        var currency_breakdown = '';
        for(i in insurance_pick.service_charges){
            if(insurance_pick.service_charges[i].charge_type != 'RAC'){
                if(!price_breakdown.hasOwnProperty(insurance_pick.service_charges[i].charge_type))
                    price_breakdown[insurance_pick.service_charges[i].charge_type] = 0;
                price_breakdown[insurance_pick.service_charges[i].charge_type] += insurance_pick.service_charges[i].total;
            }
            if(currency_breakdown == '')
                currency_breakdown = insurance_pick.service_charges[i].currency;
        }
        if(typeof upsell_price_dict !== 'undefined'){
            for(i in upsell_price_dict){
                if(!price_breakdown.hasOwnProperty('ROC'))
                    price_breakdown['ROC'] = 0;
                price_breakdown['ROC'] += upsell_price_dict[i];
            }
        }
        if(additional_price)
            price_breakdown['ADDITIONAL PRICE'] = additional_price;
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
}

function check_passenger(){
    //booker
    error_log = '';
    //check booker jika teropong

    length_name = insurance_carriers[insurance_pick.provider].adult_length_name;

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
    }if(document.getElementById('booker_title').value == ''){
        error_log+= 'Please fill booker title!</br>\n';
        document.getElementById('booker_first_name').style['border-color'] = 'red';
    }else{
        document.getElementById('booker_first_name').style['border-color'] = '#EFEFEF';
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
        length_name = insurance_carriers[insurance_pick.provider].adult_length_name;
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
        }
        if(document.getElementById('adult_title'+i).value == ''){
            error_log+= 'Please input title of adult passenger '+i+'!</br>\n';
            document.getElementById('adult_title'+i).style['border-color'] = 'red';
        }else{
            document.getElementById('adult_title'+i).style['border-color'] = '#EFEFEF';
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
        }if(check_date(document.getElementById('adult_birth_date'+i).value)==false){
            error_log+= 'Birth date wrong for passenger adult '+i+'!</br>\n';
            document.getElementById('adult_birth_date'+i).style['border-color'] = 'red';
        }else{
            document.getElementById('adult_birth_date'+i).style['border-color'] = '#EFEFEF';
        }if(document.getElementById('adult_nationality'+i+'_id').value == ''){
            error_log+= 'Please fill nationality for passenger adult '+i+'!</br>\n';
            $("#adult_nationality"+i+'_id').each(function() {
                $(this).siblings(".select2-container").css('border', '1px solid red');
            });
        }else{
            //document.getElementById('adult_nationality'+i).style['border-color'] = '#EFEFEF';
            $("#adult_nationality"+i+'_id').each(function() {
                $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
            });
        }if(document.getElementById('adult_place_of_birth'+i).value == ''){
            error_log+= 'Please fill place of birth for passenger adult '+i+'!</br>\n';
            document.getElementById('adult_place_of_birth'+i).style['border-color'] = 'red';
        }else{
            document.getElementById('adult_place_of_birth'+i).style['border-color'] = '#EFEFEF';
        }
        //KTP
        if(document.getElementById('adult_id_type'+i).style.display == 'block'){
            if(document.getElementById('adult_id_type'+i).value == 'ktp'){
                if(check_ktp(document.getElementById('adult_passport_number'+i).value) == false){
                    error_log+= 'Please fill id number, nik only contain 16 digits for passenger adult '+i+'!</br>\n';
                    document.getElementById('adult_passport_number'+i).style['border-color'] = 'red';
                }else{
                    document.getElementById('adult_passport_number'+i).style['border-color'] = '#EFEFEF';
                }if(document.getElementById('adult_country_of_issued'+i+'_id').value == ''){
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
                }if(document.getElementById('adult_country_of_issued'+i+'_id').value == ''){
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
                }if(document.getElementById('adult_passport_passport_expired_date'+i).value == ''){
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
                }if(document.getElementById('adult_passport_passport_country_of_issued'+i+'_id').value == ''){
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

        if(document.getElementById('adult_city'+i).value == ''){
            error_log+= 'Please fill city for passenger adult '+i+'!</br>\n';
            document.getElementById('adult_city'+i).style['border-color'] = 'red';
        }else{
            document.getElementById('adult_city'+i).style['border-color'] = '#EFEFEF';
        }

        //PAKET FAMILY
        var counter = 1;
        var counter_passenger = 2;
        length_name = insurance_carriers[insurance_pick.provider].adult_length_name;
        for(var j=1;j<=parseInt(insurance_request.family.adult);j++){
            if(check_name(document.getElementById('Adult_relation'+i+'_title'+counter).value,
                document.getElementById('Adult_relation'+i+'_first_name'+counter).value,
                document.getElementById('Adult_relation'+i+'_last_name'+counter).value,
                length_name) == false){
               error_log+= 'Total of Adult '+counter_passenger+' name maximum '+length_name+' characters!</br>\n';
               document.getElementById('Adult_relation'+i+'_first_name'+counter).style['border-color'] = 'red';
               document.getElementById('Adult_relation'+i+'_last_name'+counter).style['border-color'] = 'red';
            }else{
               document.getElementById('Adult_relation'+i+'_first_name'+counter).style['border-color'] = '#EFEFEF';
               document.getElementById('Adult_relation'+i+'_last_name'+counter).style['border-color'] = '#EFEFEF';
            }if(document.getElementById('Adult_relation'+i+'_title'+counter).value == ''){
               error_log+= 'Please input title of adult '+counter_passenger+'!</br>\n';
               document.getElementById('Adult_relation'+i+'_title'+counter).style['border-color'] = 'red';
            }else{
               document.getElementById('Adult_relation'+i+'_title'+counter).style['border-color'] = '#EFEFEF';
            }if(document.getElementById('Adult_relation'+i+'_first_name'+counter).value == '' || check_word(document.getElementById('Adult_relation'+i+'_first_name'+counter).value) == false){
               if(document.getElementById('Adult_relation'+i+'_first_name'+counter).value == '')
                   error_log+= 'Please input first name of adult '+counter_passenger+'!</br>\n';
               else if(check_word(document.getElementById('Adult_relation'+i+'_first_name'+counter).value) == false)
                   error_log+= 'Please use alpha characters first name of relation '+counter_passenger+'!</br>\n';
               document.getElementById('Adult_relation'+i+'_first_name'+counter).style['border-color'] = 'red';
            }else{
               document.getElementById('Adult_relation'+i+'_first_name'+counter).style['border-color'] = '#EFEFEF';
            }

            if(insurance_pick.type_trip_name == 'Family'){
                if(document.getElementById('Adult_relation'+i+'_relation'+counter).value == ''){
                    error_log+= 'Please fill relation of adult '+counter_passenger+'!</br>\n';
                    $("#Adult_relation"+i+"_relation"+counter).each(function() {
                        $(this).parent().find('.nice-select').css('border', '1px solid red');
                    });
                }else{
                    $("#Adult_relation"+i+"_relation"+counter).each(function() {
                        $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                    });
                }
            }

            if(document.getElementById('Adult_relation'+i+'_nationality'+counter+'_id').value == ''){
                error_log+= 'Please fill nationality for adult '+counter_passenger+'!</br>\n';
                $("#Adult_relation"+i+'_nationality'+counter+'_id').each(function() {
                    $(this).siblings(".select2-container").css('border', '1px solid red');
                });
            }else{
                //document.getElementById('adult_nationality'+i).style['border-color'] = '#EFEFEF';
                $("#Adult_relation"+i+'_nationality'+counter+'_id').each(function() {
                    $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                });
            }

            if(check_date(document.getElementById('Adult_relation'+i+'_birth_date'+counter).value)==false){
                error_log+= 'Birth date wrong for adult '+counter_passenger+'!</br>\n';
                document.getElementById('Adult_relation'+i+'_birth_date'+counter).style['border-color'] = 'red';
            }else{
                document.getElementById('Adult_relation'+i+'_birth_date'+counter).style['border-color'] = '#EFEFEF';
            }

            if(document.getElementById('Adult_relation'+i+'_place_of_birth'+counter).value == ''){
                error_log+= 'Please fill place of birth for passenger adult '+counter_passenger+'!</br>\n';
                document.getElementById('Adult_relation'+i+'_place_of_birth'+counter).style['border-color'] = 'red';
            }else{
                document.getElementById('Adult_relation'+i+'_place_of_birth'+counter).style['border-color'] = '#EFEFEF';
            }

            //check identity
            if(document.getElementById('Adult_relation'+i+'_id_type'+counter).value == ''){
                error_log+= 'Please choose identity for passenger adult '+counter_passenger+'!</br>\n';
                $("#Adult_relation"+i+'_id_type'+counter).each(function() {
                    $(this).parent().find('.nice-select').css('border', '1px solid red');
                });
            }else if(document.getElementById('Adult_relation'+i+'_id_type'+counter).value == 'passport'){
               if(document.getElementById('Adult_relation'+i+'_id_type'+counter).value == 'passport' && check_passport(document.getElementById('Adult_relation'+i+'_passport_number'+counter).value) == false){
                   error_log+= 'Please fill id number, passport only contain more than 6 digits for passenger adult '+counter_passenger+'!</br>\n';
                   document.getElementById('Adult_relation'+i+'_passport_number'+counter).style['border-color'] = 'red';
               }else{
                   document.getElementById('Adult_relation'+i+'_passport_number'+counter).style['border-color'] = '#EFEFEF';
               }
               if(document.getElementById('Adult_relation'+i+'_passport_expired_date'+counter).value == ''){
                   error_log+= 'Please fill passport expired date for passenger adult '+counter_passenger+'!</br>\n';
                   document.getElementById('Adult_relation'+i+'_passport_expired_date'+counter).style['border-color'] = 'red';
               }else{
                   duration = moment.duration(moment(document.getElementById('Adult_relation'+i+'_passport_expired_date'+counter).value).diff(last_departure_date));
                   //CHECK EXPIRED
                   if(duration._milliseconds < 0 ){
                        error_log+= 'Please update passport expired date for passenger adult '+counter_passenger+'!</br>\n';
                        document.getElementById('Adult_relation'+i+'_passport_expired_date'+counter).style['border-color'] = 'red';
                   }else
                        document.getElementById('Adult_relation'+i+'_passport_expired_date'+counter).style['border-color'] = '#EFEFEF';
               }if(document.getElementById('Adult_relation'+i+'_country_of_issued'+counter+'_id').value == ''){
                   error_log+= 'Please fill country of issued for passenger adult '+counter_passenger+'!</br>\n';
                   $("#Adult_relation"+i+"_country_of_issued"+counter+"_id").each(function() {
                     $(this).siblings(".select2-container").css('border', '1px solid red');
                   });
               }else{
                   $("#Adult_relation"+i+"_country_of_issued"+counter+"_id").each(function() {
                     $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                   });
               }
            }else if(document.getElementById('Adult_relation'+i+'_id_type'+counter).value == 'ktp'){
                document.getElementById('Adult_relation'+i+'_passport_expired_date'+counter).style['border-color'] = '#EFEFEF';
                $("#Adult_relation"+i+'_id_type'+counter).each(function() {
                    $(this).parent().find('.nice-select').css('border', '0px solid red');
                });
                document.getElementById('Adult_relation'+i+'_passport_expired_date'+counter).style['border-color'] = '#cdcdcd';
                if(check_ktp(document.getElementById('Adult_relation'+i+'_passport_number'+counter).value) == false){
                   error_log+= 'Please fill id number, nik only contain 16 digits for passenger adult '+counter_passenger+'!</br>\n';
                   document.getElementById('Adult_relation'+i+'_passport_number'+counter).style['border-color'] = 'red';
                }else{
                   document.getElementById('Adult_relation'+i+'_passport_number'+counter).style['border-color'] = '#EFEFEF';
                }if(document.getElementById('Adult_relation'+i+'_country_of_issued'+counter+'_id').value == ''){
                   error_log+= 'Please fill country of issued for passenger adult '+counter_passenger+'!</br>\n';
                   $('#Adult_relation'+i+'_country_of_issued'+counter+"_id").each(function() {
                     $(this).siblings(".select2-container").css('border', '1px solid red');
                   });
                }else{
                   $('#Adult_relation'+i+'_country_of_issued'+counter+"_id").each(function() {
                     $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                   });
                }
            }
            counter++;
            counter_passenger++;
        }
        counter_passenger = 1;
        length_name = insurance_carriers[insurance_pick.provider].child_length_name;
        for(var j=1;j<=parseInt(insurance_request.family.child);j++){
            if(check_name(document.getElementById('Child_relation'+i+'_title'+counter).value,
                document.getElementById('Child_relation'+i+'_first_name'+counter).value,
                document.getElementById('Child_relation'+i+'_last_name'+counter).value,
                length_name) == false){
               error_log+= 'Total of passenger child '+counter_passenger+' name maximum '+length_name+' characters!</br>\n';
               document.getElementById('Child_relation'+i+'_first_name'+counter).style['border-color'] = 'red';
               document.getElementById('Child_relation'+i+'_last_name'+counter).style['border-color'] = 'red';
            }else{
               document.getElementById('Child_relation'+i+'_first_name'+counter).style['border-color'] = '#EFEFEF';
               document.getElementById('Child_relation'+i+'_last_name'+counter).style['border-color'] = '#EFEFEF';
            }if(document.getElementById('Child_relation'+i+'_title'+counter).value == ''){
               error_log+= 'Please input title of passenger child '+counter_passenger+'!</br>\n';
               document.getElementById('Child_relation'+i+'_title'+counter).style['border-color'] = 'red';
            }else{
               document.getElementById('Child_relation'+i+'_title'+counter).style['border-color'] = '#EFEFEF';
            }if(document.getElementById('Child_relation'+i+'_first_name'+counter).value == '' || check_word(document.getElementById('Child_relation'+i+'_first_name'+counter).value) == false){
               if(document.getElementById('Child_relation'+i+'_first_name'+counter).value == '')
                   error_log+= 'Please input first name of passenger child '+counter_passenger+'!</br>\n';
               else if(check_word(document.getElementById('Child_relation'+i+'_first_name'+counter).value) == false)
                   error_log+= 'Please use alpha characters first name of passenger child '+counter_passenger+'!</br>\n';
               document.getElementById('Child_relation'+i+'_first_name'+counter).style['border-color'] = 'red';
            }else{
               document.getElementById('Child_relation'+i+'_first_name'+counter).style['border-color'] = '#EFEFEF';
            }

            if(insurance_pick.type_trip_name == 'Family'){
                if(document.getElementById('Child_relation'+i+'_relation'+counter).value == ''){
                    error_log+= 'Please fill passenger child '+counter_passenger+'!</br>\n';
                    $("#Child_relation"+i+"_relation"+counter).each(function() {
                        $(this).parent().find('.nice-select').css('border', '1px solid red');
                    });
                }else{
                    $("#Child_relation"+i+"_relation"+counter).each(function() {
                        $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                    });
                }
            }

            if(document.getElementById('Child_relation'+i+'_nationality'+counter+'_id').value == ''){
                error_log+= 'Please fill nationality for passenger child relation '+counter_passenger+'!</br>\n';
                $("#Child_relation"+i+'_nationality'+counter+'_id').each(function() {
                    $(this).siblings(".select2-container").css('border', '1px solid red');
                });
            }else{
                //document.getElementById('adult_nationality'+i).style['border-color'] = '#EFEFEF';
                $("#Child_relation"+i+'_nationality'+counter+'_id').each(function() {
                    $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                });
            }

            if(check_date(document.getElementById('Child_relation'+i+'_birth_date'+counter).value)==false){
                error_log+= 'Birth date wrong for passenger child '+counter_passenger+'!</br>\n';
                document.getElementById('Child_relation'+i+'_birth_date'+counter).style['border-color'] = 'red';
            }else{
                document.getElementById('Child_relation'+i+'_birth_date'+counter).style['border-color'] = '#EFEFEF';
            }

            if(document.getElementById('Child_relation'+i+'_place_of_birth'+counter).value == ''){
                error_log+= 'Please fill place of birth for passenger child '+counter_passenger+'!</br>\n';
                document.getElementById('Child_relation'+i+'_place_of_birth'+counter).style['border-color'] = 'red';
            }else{
                document.getElementById('Child_relation'+i+'_place_of_birth'+counter).style['border-color'] = '#EFEFEF';
            }

            //check identity
            if(document.getElementById('Child_relation'+i+'_id_type'+counter).value == ''){
                error_log+= 'Please choose identity for passenger child '+counter_passenger+'!</br>\n';
                $("#Child_relation"+i+'_id_type'+counter).each(function() {
                    $(this).parent().find('.nice-select').css('border', '1px solid red');
                });
            }else if(document.getElementById('Child_relation'+i+'_id_type'+counter).value == 'passport'){
               if(document.getElementById('Child_relation'+i+'_id_type'+counter).value == 'passport' && check_passport(document.getElementById('Child_relation'+i+'_passport_number'+counter).value) == false){
                   error_log+= 'Please fill id number, passport only contain more than 6 digits for passenger child '+counter_passenger+'!</br>\n';
                   document.getElementById('Child_relation'+i+'_passport_number'+counter).style['border-color'] = 'red';
               }else{
                   document.getElementById('Child_relation'+i+'_passport_number'+counter).style['border-color'] = '#EFEFEF';
               }
               if(document.getElementById('Child_relation'+i+'_passport_expired_date'+counter).value == ''){
                   error_log+= 'Please fill passport expired date for passenger child '+counter_passenger+'!</br>\n';
                   document.getElementById('Child_relation'+i+'_passport_expired_date'+counter).style['border-color'] = 'red';
               }else{
                   duration = moment.duration(moment(document.getElementById('Child_relation'+i+'_passport_expired_date'+counter).value).diff(last_departure_date));
                   //CHECK EXPIRED
                   if(duration._milliseconds < 0 ){
                        error_log+= 'Please update passport expired date for passenger child '+counter_passenger+'!</br>\n';
                        document.getElementById('Child_relation'+i+'_passport_expired_date'+counter).style['border-color'] = 'red';
                   }else
                        document.getElementById('Child_relation'+i+'_passport_expired_date'+counter).style['border-color'] = '#EFEFEF';
               }if(document.getElementById('Child_relation'+i+'_country_of_issued'+counter+'_id').value == ''){
                   error_log+= 'Please fill country of issued for passenger child '+counter_passenger+'!</br>\n';
                   $("#Child_relation"+i+"_country_of_issued"+counter+"_id").each(function() {
                     $(this).siblings(".select2-container").css('border', '1px solid red');
                   });
               }else{
                   $("#Child_relation"+i+"_country_of_issued"+counter+"_id").each(function() {
                     $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                   });
               }
            }else if(document.getElementById('Child_relation'+i+'_id_type'+counter).value == 'ktp'){
                document.getElementById('Child_relation'+i+'_passport_expired_date'+counter).style['border-color'] = '#EFEFEF';
                $("#Child_relation"+i+'_id_type'+counter).each(function() {
                    $(this).parent().find('.nice-select').css('border', '0px solid red');
                });
                document.getElementById('Child_relation'+i+'_passport_expired_date'+counter).style['border-color'] = '#cdcdcd';
                if(check_ktp(document.getElementById('Child_relation'+i+'_passport_number'+counter).value) == false){
                   error_log+= 'Please fill id number, nik only contain 16 digits for passenger child '+counter_passenger+'!</br>\n';
                   document.getElementById('Child_relation'+i+'_passport_number'+counter).style['border-color'] = 'red';
                }else{
                   document.getElementById('Child_relation'+i+'_passport_number'+counter).style['border-color'] = '#EFEFEF';
                }if(document.getElementById('Child_relation'+i+'_country_of_issued'+counter+'_id').value == ''){
                   error_log+= 'Please fill country of issued for passenger child '+counter_passenger+'!</br>\n';
                   $('#Child_relation'+i+'_country_of_issued'+counter+"_id").each(function() {
                     $(this).siblings(".select2-container").css('border', '1px solid red');
                   });
                }else{
                   $('#Child_relation'+i+'_country_of_issued'+counter+"_id").each(function() {
                     $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                   });
                }
            }
            counter_passenger++;
        }
        length_name = insurance_carriers[insurance_pick.provider].adult_length_name;
        if(insurance_pick.provider == 'bcainsurance'){
            //AHLI WARIS WAJIB ISI
            if(check_name(document.getElementById('Adult_relation_beneficiary_title'+i).value,
                document.getElementById('Adult_relation_beneficiary_first_name'+i).value,
                document.getElementById('Adult_relation_beneficiary_last_name'+i).value,
                length_name) == false){
               error_log+= 'Total of beneficiary for customer '+i+' name maximum '+length_name+' characters!</br>\n';
               document.getElementById('Adult_relation_beneficiary_first_name'+i).style['border-color'] = 'red';
               document.getElementById('Adult_relation_beneficiary_last_name'+i).style['border-color'] = 'red';
            }else{
               document.getElementById('Adult_relation_beneficiary_first_name'+i).style['border-color'] = '#EFEFEF';
               document.getElementById('Adult_relation_beneficiary_last_name'+i).style['border-color'] = '#EFEFEF';
            }if(document.getElementById('Adult_relation_beneficiary_title'+i).value == ''){
               error_log+= 'Please input title of beneficiary for customer '+i+'!</br>\n';
               document.getElementById('Adult_relation_beneficiary_title'+i).style['border-color'] = 'red';
            }else{
               document.getElementById('Adult_relation_beneficiary_title'+i).style['border-color'] = '#EFEFEF';
            }if(document.getElementById('Adult_relation_beneficiary_first_name'+i).value == '' || check_word(document.getElementById('Adult_relation_beneficiary_first_name'+i).value) == false){
               if(document.getElementById('Adult_relation_beneficiary_first_name'+i).value == '')
                   error_log+= 'Please input first name of beneficiary for customer '+i+'!</br>\n';
               else if(check_word(document.getElementById('Adult_relation_beneficiary_first_name'+i).value) == false)
                   error_log+= 'Please use alpha characters first name of beneficiary for customer '+i+'!</br>\n';
               document.getElementById('Adult_relation_beneficiary_first_name'+i).style['border-color'] = 'red';
            }else{
               document.getElementById('Adult_relation_beneficiary_first_name'+i).style['border-color'] = '#EFEFEF';
            }

            if(document.getElementById('Adult_relation_beneficiary_relation'+i).value == ''){
                error_log+= 'Please fill beneficiary relation for passenger adult '+i+'!</br>\n';
                $("#Adult_relation_beneficiary_relation"+i).each(function() {
                    $(this).parent().find('.nice-select').css('border', '1px solid red');
                });
            }else{
                $("#Adult_relation_beneficiary_relation"+i).each(function() {
                    $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                });
            }

            //CHECK KTP
            if(document.getElementById('Adult_relation_beneficiary_id_type'+i).value == 'ktp'){
                if(check_ktp(document.getElementById('Adult_relation_beneficiary_passport_number'+i).value) == false){
                   error_log+= 'Please fill id number, nik only contain 16 digits for beneficiary customer '+i+'!</br>\n';
                   document.getElementById('Adult_relation_beneficiary_passport_number'+i).style['border-color'] = 'red';
                }else{
                   document.getElementById('Adult_relation_beneficiary_passport_number'+i).style['border-color'] = '#EFEFEF';
                }if(document.getElementById('Adult_relation_beneficiary_country_of_issued'+i+'_id').value == ''){
                   error_log+= 'Please fill country of issued for beneficiary customer '+i+'!</br>\n';
                   $("#Adult_relation_beneficiary_country_of_issued"+i+"_id").each(function() {
                     $(this).siblings(".select2-container").css('border', '1px solid red');
                   });
                }else{
                   $("#Adult_relation_beneficiary_country_of_issued"+i+"_id").each(function() {
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
       document.getElementById('booker_nationality_id').disabled = false;
       //KALAU DATE DISABLED DARI TEROPONG VALUE TIDAK BISA DI AMBIL EXPIRED DATE TIDAK DI DISABLED FALSE KARENA BISA DI EDIT
       for(i=1;i<=adult;i++){
            document.getElementById('adult_birth_date'+i).disabled = false;
            document.getElementById('adult_nationality'+i + '_id').disabled = false;
            var counter = 1;
            for(var j=1;j<=parseInt(insurance_request.family.adult);j++){
                document.getElementById('Adult_relation'+i+'_nationality'+counter+'_id').disabled = false;
                counter++;
            }
            for(var j=1;j<=parseInt(insurance_request.family.child);j++){
                document.getElementById('Child_relation'+i+'_nationality'+counter+'_id').disabled = false;
                counter++;
            }
//            document.getElementById('adult_passport_expired_date'+i).disabled = false;
       }
       $('.loader-rodextrip').fadeIn();
       document.getElementById('time_limit_input').value = time_limit;
       upload_image();
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
                    <div style="padding:15px; background:white; border:1px solid #cdcdcd;">
                        <div class="row">
                            <div class="col-lg-12 mb-3" style="padding-bottom:15px; border-bottom:1px solid #cdcdcd;">
                                <h4>
                                    <i class="fas fa-scroll"></i> Order Number: `+msg.result.response.order_number+`
                                </h4>
                            </div>
                            <div class="col-lg-12">
                                <h5>`+msg.result.response.provider_bookings[0].carrier_name+`</h5>
                                <hr/>
                            </div>`;
                            for(i in msg.result.response.provider_bookings){
                                if(msg.result.response.provider_bookings[i].error_msg.length != 0 && msg.result.response.provider_bookings[i].state != 'issued')
                                    text += `<div class="alert alert-danger">
                                        `+msg.result.response.provider_bookings[i].error_msg+`
                                        <a href="#" class="close" data-dismiss="alert" aria-label="close" style="margin-top:-1.9vh;">x</a>
                                    </div>`;
                                text+=`
                                <div class="col-lg-6">`;
                                    if(msg.result.response.state == 'booked'){
                                        text+=`
                                        <b>Hold Date: </b>
                                        <span style="font-weight:600;">`+msg.result.response.hold_date+`</span><br/>`;
                                        $text += 'Hold Date: '+msg.result.response.hold_date+'\n';
                                    }
                                text+=`</div>
                                <div class="col-lg-6" style="text-align:right;">
                                    <b>Status: </b>`;
                                    if(msg.result.response.provider_bookings[i].state_description == 'Expired' ||
                                        msg.result.response.provider_bookings[i].state_description == 'Cancelled' ||
                                        msg.result.response.provider_bookings[i].state_description == 'Booking Failed' ||
                                        msg.result.response.provider_bookings[i].state_description == 'Void'){
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
                                    `+msg.result.response.provider_bookings[i].state_description+`</span>
                                </div>
                                <div class="col-lg-12">`;
                                    //destination
                                    if(msg.result.response.provider_bookings[i].destination){
                                        text+=`
                                        <b>Destination: </b>
                                        <i>`+msg.result.response.provider_bookings[i].destination+`</i><br/>`;
                                        $text += 'Destination: '+msg.result.response.provider_bookings[i].destination+'\n';
                                    }
                                    //start date, end date
                                    if(msg.result.response.provider_bookings[i].start_date && msg.result.response.provider_bookings[i].end_date){
                                        text+=`
                                        <b>Start Date: </b>
                                        <i>`+moment(msg.result.response.provider_bookings[i].start_date, 'YYYY-MM-DD').format('DD MMM YYYY')+`</i><br/>`;
                                        text+=`
                                        <b>End Date: </b>
                                        <i>`+moment(msg.result.response.provider_bookings[i].end_date, 'YYYY-MM-DD').format('DD MMM YYYY')+`</i><br/>`;
                                        $text += 'Start Date: '+moment(msg.result.response.provider_bookings[i].start_date, 'YYYY-MM-DD').format('DD MMM YYYY')+'\n';
                                        $text += 'End Date: '+moment(msg.result.response.provider_bookings[i].end_date, 'YYYY-MM-DD').format('DD MMM YYYY')+'\n';
                                    }
                            }
                    text+=`</div>
                        </div>`;

                    text+=`
                        <hr/>`;
                    if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false){
                        text+=`
                        <div class="row mb-3">
                            <div class="col-lg-6">
                                <b>Agent: </b><i>`+msg.result.response.agent_name+`</i>
                            </div>
                            <div class="col-lg-6">`;
                                if(msg.result.response.customer_parent_name){
                                    text+=`<b>Customer: </b><i>`+msg.result.response.customer_parent_type_name+` `+msg.result.response.customer_parent_name+`</i>`;
                                }
                            text+=`
                            </div>
                        </div>`;
                    }
                    text+=`
                    <div class="row">
                        <div class="col-lg-3">
                            <span>
                                <b>Booked by</b><br><i>`+msg.result.response.booked_by+`</i>
                            </span>
                        </div>
                        <div class="col-lg-9 mb-3">
                            <span>
                                <b>Booked Date </b><br/>`;
                                if(msg.result.response.booked_date != ""){
                                    text+=`<i>`+msg.result.response.booked_date+`</i>`;
                                }else{
                                    text+=`-`;
                                }
                            text+=`
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
                                    <b>Issued Date </b><br/>`;
                                    if(msg.result.response.issued_date != ""){
                                        text+=`<i>`+msg.result.response.issued_date+`</i>`;
                                    }else{
                                        text+=`-`;
                                    }
                                text+=`
                                </span>
                            </div>
                        </div>`;
                    }
                    text+=`
                    </div>`;

                   text+=`<div class="row">`;
                   text+=`<div class="col-lg-12"></div>`;
                   text+=`<div class="col-lg-3 col-md-4 col-sm-6">`;

                   text+=`</div>
                   </div>
                   </div>`;
                    text += `
                    <div style="border:1px solid #cdcdcd; padding:15px; background-color:white; margin-top:20px;">
                        <div class="row">
                            <div class="col-lg-12 mb-3" style="border-bottom:1px solid #cdcdcd;">
                                <h4 class="mb-3"><i class="fas fa-user"></i> Contact Person</h4>
                            </div>
                        </div>
                        <h5>
                            `+msg.result.response.contact.title+` `+msg.result.response.contact.name+`
                        </h5>
                        <b>Email: </b><i>`+msg.result.response.contact.email+`</i><br>
                        <b>Phone: </b><i>`+msg.result.response.contact.phone+`</i><br>
                    </div>`;
                    print_provider = false;
                    pax_number = 1;
                    for(i in msg.result.response.provider_bookings){
                        if(msg.result.response.provider_bookings[i].hasOwnProperty('tickets')){
                            text+=`
                            <div class="mb-3" style="border:1px solid #cdcdcd; padding:15px; background-color:white; margin-top:20px;">
                                <div class="row">
                                    <div class="col-lg-12 mb-3" style="border-bottom:1px solid #cdcdcd;">
                                        <h4 class="mb-3"><i class="fas fa-user"></i> List of Customer</h4>
                                    </div>
                                    <div class="col-lg-12">
                                        <div class="row">`;
                                        for(j in msg.result.response.provider_bookings[i].tickets){
                                            pax = {};
                                            for(k in msg.result.response.passengers){
                                                if(msg.result.response.passengers[k].name == msg.result.response.provider_bookings[i].tickets[j].passenger){
                                                    pax = msg.result.response.passengers[k];
                                                    break;
                                                }
                                            }
                                            if(Object.keys(pax).length > 0){ // prevent data error ticket kelebihan
                                                text+=`
                                                <di class="col-lg-12">
                                                    <h5 class="single_border_custom_left" style="padding-left:5px;">
                                                        `+(pax_number)+`. `+pax.title+` `+pax.name+``;
                                                        if(pax.verify)
                                                            text += '<i class="fas fa-check-square" style="color:blue"></i>';
                                                        text+=`
                                                        <b style="background:white; font-size:13px; color:black; padding:0px 15px; display:unset; border: 1px solid #cdcdcd; border-radius:7px;">
                                                            <i class="fas fa-user"></i> `;
                                                            if(pax.pax_type == 'ADT'){
                                                                 text+=` Adult`;
                                                            }else if(pax.pax_type == 'CHD'){
                                                                 text+=` Child`;
                                                            }else if(pax.pax_type == 'INF'){
                                                                 text+=` Infant`;
                                                            }
                                                        text+=`
                                                        </b>
                                                    </h5>`;
                                                    if(pax.identity_type != ''){
                                                        text+=`<b>`+pax.identity_type.substr(0,1).toUpperCase()+pax.identity_type.substr(1,pax.identity_type.length)+`: </b><i>`+pax.identity_number+`</i><br/>`;
                                                    }

                                                    text+=`
                                                    <b>No Polis: </b><i>`+msg.result.response.provider_bookings[i].tickets[j].ticket_number+`</i><br>
                                                    <b>Email: </b><i>`+pax.email+`</i><br>
                                                    <b>Phone Number: </b><i>`+pax.phone_number+`</i><br>
                                                </div>
                                                <div class="row">
                                                    <div class="col-lg-12 mb-4">`;
                                                        if(pax.insurance_data.hasOwnProperty('addons')){
                                                            if(pax.insurance_data.addons.length != 0){
                                                                text+=`<b>Additional Benefit</b><br/>
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
                                                    text+=`
                                                    </div>
                                                </div>`;
                                                pax_number++;

                                                if(pax.hasOwnProperty('insurance_data') && pax['insurance_data'].hasOwnProperty('relation') && pax['insurance_data']['relation'].length > 0){
                                                    for(k in pax['insurance_data']['relation']){
                                                        text+=`
                                                        <div class="row">
                                                            <div class="col-lg-12">
                                                                <h5 class="single_border_custom_left" style="padding-left:5px;">`+(pax_number)+`.
                                                                `+pax['insurance_data']['relation'][k].title+` `+pax['insurance_data']['relation'][k].first_name + ` ` + pax['insurance_data']['relation'][k].last_name;
                                                                    if(pax.verify)
                                                                        text += '<i class="fas fa-check-square" style="color:blue"></i>';
                                                                text+=`
                                                                </h5>`;
                                                                if(pax['insurance_data']['relation'][k].identity_type != ''){
                                                                    text+= `<b>`+pax['insurance_data']['relation'][k].identity_type.substr(0,1).toUpperCase()+pax['insurance_data']['relation'][k].identity_type.substr(1,pax.identity_type.length)+`: </b><i>`+pax['insurance_data']['relation'][k].identity_number+`</i><br/>`;
                                                                }
                                                                text+=`
                                                            </div>
                                                        </div>
                                                        <div class="row">
                                                            <div class="col-lg-12 mb-4">`;
                                                                if(pax.insurance_data.hasOwnProperty('addons')){
                                                                    if(pax.insurance_data.addons.length != 0){
                                                                        text+=`<b>Additional Benefit</b><br/>
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
                                                        pax_number++;
                                                    }
                                                }

                                                if(pax.hasOwnProperty('insurance_data') && pax['insurance_data'].hasOwnProperty('beneficiary') && Object.keys(pax['insurance_data']['beneficiary']).length > 0){
                                                    text+=`
                                                    <div class="row">
                                                        <div class="col-lg-12">
                                                            <h4>Beneficiary</h4>
                                                            <h5 class="single_border_custom_left" style="padding-left:5px;">`+(pax_number)+`.
                                                            `+pax['insurance_data']['beneficiary'].title+` `+pax['insurance_data']['beneficiary'].first_name+` `+pax['insurance_data']['beneficiary'].last_name;
                                                                if(pax.verify)
                                                                    text += '<i class="fas fa-check-square" style="color:blue"></i>';
                                                            text+=`
                                                            </h5>`;
                                                            if(pax['insurance_data']['beneficiary'].identity_type != '')
                                                                text+= `<b>`+pax['insurance_data']['beneficiary'].identity_type.substr(0,1).toUpperCase()+pax['insurance_data']['beneficiary'].identity_type.substr(1,pax.identity_type.length)+`: </b><i>`+pax['insurance_data']['beneficiary'].identity_number+`</i><br/>`;
                                                            text+=`
                                                        </div>
                                                    </div>`;
                                                }

                                                text+=`</div>`;
                                            }
                                        }
                                        text +=`
                                        </div>
                                    </div>
                                </div>
                            </div>`;
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
                    service_charge = ['FARE', 'RAC', 'ROC', 'TAX', 'SSR', 'DISC'];
                    text_update_data_pax = '';
                    text_detail=`
                    <div style="background-color:white; padding:15px; margin-bottom:15px;">
                        <div class="row">
                            <div class="col-lg-12 mb-3" style="border-bottom:1px solid #cdcdcd;">
                                <h4 class="mb-3"> Price Detail</h4>
                            </div>
                        </div>`;

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
                    ADMIN_FEE_insurance = 0;
                    try{
                        for(j in msg.result.response.passengers){
                            price = {'FARE': 0, 'RAC': 0,'ROC': 0, 'TAX':0 , 'currency': '', 'CSC': 0, 'SSR': 0, 'DISC': 0,'SEAT':0};
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
                            price_arr_repricing[msg.result.response.passengers[j].pax_type][msg.result.response.passengers[j].name] = {
                                'Fare': price['FARE'] + price['SSR'] + price['SEAT'] + price['DISC'],
                                'Tax': price['TAX'] + price['ROC'] - csc,
                                'Repricing': csc
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
                                            <div class="col-lg-3" id="`+j+`_`+k+`">`+l+`</div>
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

                            text_detail+=`
                            <div class="row" style="margin-bottom:5px;">
                                <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                    <span style="font-size:12px;">`+msg.result.response.passengers[j].name+`</span>`;
                                text_detail+=`</div>
                                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">`;
                                if(i == 0) //upsel hanya masuk di pnr pertama
                                    text_detail+=`
                                    <span style="font-size:13px;">`+price.currency+` `+getrupiah(parseInt(price.FARE + price.TAX + price.ROC + price.SSR + price.SEAT + price.CSC))+`</span>`;
                                else
                                    text_detail+=`
                                    <span style="font-size:13px;">`+price.currency+` `+getrupiah(parseInt(price.FARE + price.TAX + price.ROC + price.SSR + price.SEAT))+`</span>`;
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
                            $text += price.currency+` `+getrupiah(parseInt(price.FARE + price.SSR + price.SEAT + price.TAX + price.ROC + price.CSC + price.DISC))+'\n';
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
                        // digabung ke pax
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
                            <span id="total_price" style="font-size:13px; font-weight: bold;`;
                            if(is_show_breakdown_price)
                                text_detail+='cursor:pointer;';
                            text_detail +=`">`;
                            try{
                                text_detail+= price.currency+` `+getrupiah(total_price);
                                $text += `\n` + 'Grand Total: ' +price.currency+` `+ getrupiah(total_price);
                            }catch(err){

                            }
                            if(is_show_breakdown_price)
                                text_detail+=`<i class="fas fa-caret-down"></i>`;
                            text_detail+= `
                            </span>
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
                                                    <div class="col-lg-12" style="text-align:right;">
                                                        <span style="font-size:13px; font-weight:bold;" id="total_price_`+k+`"> Estimated `+k+` `+price_convert+`</span><br/>
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
                        text_detail+=`
                    </div>`;
                    if(msg.result.response.state == 'booked' && user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
                        text_detail+=`<div style="text-align:right; padding-bottom:10px;"><img src="/static/tt_website/images/icon/symbol/upsell_price.png" alt="Bank" style="width:auto; height:25px; cursor:pointer;" onclick="show_repricing();"/></div>`;
                    else if(msg.result.response.state == 'issued' && user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false){
                        text_detail+=`<div style="text-align:right; padding-bottom:10px;"><img src="/static/tt_website/images/icon/symbol/upsell_booker.png" alt="Bank" style="width:auto; height:25px; cursor:pointer;" onclick="show_repricing();"/></div>`;
                        document.getElementById('repricing_type').innerHTML = '<option value="booker">Booker</option>';
                        $('#repricing_type').niceSelect('update');
                        reset_repricing();
                    }
                    text_detail+=`<div class="row">
                    <div class="col-lg-12" style="padding-bottom:10px;">
                        <hr/>`;
                        //<span style="font-size:14px; font-weight:bold;"><i class="fas fa-share-alt"></i> Share This on:</span><br/>`;
                        /*share_data();
                        var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                        if (isMobile) {
                            text_detail+=`
                                <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/whatsapp.png" alt="Whatsapp"/></a>
                                <a href="line://msg/text/`+ $text_share +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/line.png" alt="Line"/></a>
                                <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/telegram.png" alt="Telegram"/></a>
                                <a href="mailto:?subject=This is the insurance price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/email.png" alt="Email"/></a>`;
                        } else {
                            text_detail+=`
                                <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/whatsapp.png" alt="Whatsapp"/></a>
                                <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/line.png" alt="Line"/></a>
                                <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/telegram.png" alt="Telegram"/></a>
                                <a href="mailto:?subject=This is the insurance price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/email.png" alt="Email"/></a>`;
                        }*/

                    text_detail+=`
                        </div>
                    </div>`;
                    if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false && user_login.co_agent_frontend_security.includes('see_commission')){
                        text_detail+=`
                        <div class="row" id="show_commission" style="display:block;">
                            <div class="col-lg-12 col-xs-12" style="text-align:center;">
                                <div class="alert alert-success">
                                    <div class="row">
                                        <div class="col-lg-6 col-xs-6" style="text-align:left;">
                                            <span style="font-size:13px; font-weight:bold;">YPM</span>
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
                                    if(commission == 0){
                                        text_detail+=`
                                        <div class="row">
                                            <div class="col-lg-12 col-xs-12" style="text-align:left;">
                                                <span style="font-size:13px; color:red;">* Please mark up the price first</span>
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
                        <input class="primary-btn-white" id="show_commission_button" style="width:100%;margin-bottom:10px;" type="button" onclick="show_commission('commission');" value="Hide YPM"/>
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

                if(is_show_breakdown_price){
                    var price_breakdown = {};
                    var currency_breakdown = '';
                    for(i in insurance_get_detail.result.response.passengers){
                        for(j in insurance_get_detail.result.response.passengers[i].sale_service_charges){
                            for(k in insurance_get_detail.result.response.passengers[i].sale_service_charges[j]){
                                if(k != 'RAC'){
                                    if(!price_breakdown.hasOwnProperty(k))
                                        price_breakdown[k.toUpperCase()] = 0;
                                    price_breakdown[k.toUpperCase()] += insurance_get_detail.result.response.passengers[i].sale_service_charges[j][k].amount;
                                    if(currency_breakdown == '')
                                        currency_breakdown = insurance_get_detail.result.response.passengers[i].sale_service_charges[j][k].currency;
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
                }


                    //======================= Option =========================


                    //======================= Extra Question =========================

                    //==================== Print Button =====================
                    var print_text = '';
                    // === Button 1 ===
                    print_text += '<div class="col-lg-6" style="padding-bottom:10px;">';
                    if (msg.result.response.state  == 'issued'){
                        print_text+=`
                        <button class="primary-btn hold-seat-booking-train ld-ext-right" id="button-print-print" type="button" onclick="openInNewTab('`+static_path+`/pdf/Ketentuan Zurich Travel Insurance.pdf');" style="width:100%;">
                            Print Policy Terms
                            <div class="ld ld-ring ld-cycle"></div>
                        </button>`;
                    }
                    print_text += '</div>';
                    print_text += '<div class="col-lg-6" style="padding-bottom:10px;">';
                    // === Button 2 ===
                    if (msg.result.response.state  == 'booked'){
                        print_text+=`
                        <button class="primary-btn hold-seat-booking-train ld-ext-right" id="button-print-print" type="button" onclick="get_printout('` + msg.result.response.order_number + `','itinerary','insurance');" style="width:100%;">
                            Print Itinerary Form
                            <div class="ld ld-ring ld-cycle"></div>
                        </button>`;
                    }else{
                    // === Button 2 ===
                        print_text+=`
                        <button class="primary-btn hold-seat-booking-train ld-ext-right" id="button-print-print" type="button" onclick="get_printout('` + msg.result.response.order_number + `','ticket_original','insurance');" style="width:100%;">
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
                      html: '<span style="color: #ff9900;">Error insurance booking </span>' + msg.result.error_msg,
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

        if(document.getElementById('insurance_payment_form'))
        {
            var formData = new FormData($('#insurance_payment_form').get(0));
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

        getToken();
        $.ajax({
           type: "POST",
           url: "/webservice/insurance",
           headers:{
                'action': 'issued',
           },
           data: formData,
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
                            csc = 0;
                            for(k in insurance_get_detail.result.response.passengers[j].sale_service_charges[i]){
                                price[k] = insurance_get_detail.result.response.passengers[j].sale_service_charges[i][k].amount;
                                if(price['currency'] == '')
                                    price['currency'] = insurance_get_detail.result.response.passengers[j].sale_service_charges[i][k].currency;
                            }
                            try{
                                csc += insurance_get_detail.result.response.passengers[j].channel_service_charges.amount;
//                                price['CSC'] = insurance_get_detail.result.response.passengers[j].channel_service_charges.amount;
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
                                    <span style="font-size:13px;">`+price.currency+` `+getrupiah(parseInt(price.TAX + price.ROC + price.CSC))+`</span>
                                </div>
                            </div>`;
                            if(price.SSR != 0 || price.SEAT != 0)
                                text+=`
                                <div class="row" style="margin-bottom:5px;">
                                    <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                        <span style="font-size:12px;">`+insurance_get_detail.result.response.passengers[j].name+` Additional
                                    </div>
                                    <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                        <span style="font-size:13px;">`+price.currency+` `+getrupiah(parseInt(price.SSR + price.SEAT))+`</span>
                                    </div>
                                </div>`;
                            if(price.DISC != 0)
                                text+=`
                                <div class="row" style="margin-bottom:5px;">
                                    <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                        <span style="font-size:12px;">`+insurance_get_detail.result.response.passengers[j].name+` DISC
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
                            csc = 0;
                            for(k in msg.result.response.passengers[j].sale_service_charges[i]){
                                price[k] = msg.result.response.passengers[j].sale_service_charges[i][k].amount;
                                price['currency'] = msg.result.response.passengers[j].sale_service_charges[i][k].currency;
                            }

                            try{
                                csc += insurance_get_detail.result.response.passengers[j].channel_service_charges.amount;
//                                price['CSC'] = insurance_get_detail.result.response.passengers[j].channel_service_charges.amount;
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
                                        <span style="font-size:12px;">`+insurance_get_detail.result.response.passengers[j].name+` Additional
                                    </div>
                                    <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                        <span style="font-size:13px;">`+price.currency+` `+getrupiah(parseInt(price.SSR + price.SEAT))+`</span>
                                    </div>
                                </div>`;
                            if(price.DISC != 0)
                                text+=`
                                <div class="row" style="margin-bottom:5px;">
                                    <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                        <span style="font-size:12px;">`+insurance_get_detail.result.response.passengers[j].name+` DISC
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
                          html: '<span style="color: #ff9900;">Error insurance issued </span>' + msg.result.error_msg,
                        })
                    }else{
                        Swal.fire({
                          type: 'error',
                          title: 'Error insurance issued '+ msg.result.error_msg,
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
           contentType:false,
           processData:false,
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
        scs.value = "Hide YPM";
    }
    else{
        sc.style.display = "none";
        scs.value = "Show YPM";
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
    //add template
    if(insurance_provider == 'bcainsurance'){
        text+=`
        <div class="col-lg-12 mt-3" style="text-align:left;">
            <h3 class="title_cst mb-4">
                <img src="/static/tt_website/images/logo/insurance/bca_insurance.png" alt="BCA Insurance" style="width:auto; height:45px; border-radius:7px; padding:0px; background:white;">
                BCA Insurance
            </h3>
        </div>`;
        if(template == 4){
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
                    <div class="col-lg-6 col-md-6 train-from">
                        <span class="span-search-ticket"> From</span>
                        <div class="input-container-search-ticket">
                            <i class="fas fa-map-marked-alt" style="padding:14px; height: 43px; width: 45px; background:`+color+`; color:`+text_color+`;"></i>
                            <input id="insurance_origin" name="insurance_origin" class="form-control" type="text" placeholder="Origin (City)" style="width:100%; outline:0" autocomplete="off" value="" onfocus="document.getElementById('insurance_origin').select();" onclick="set_insurance_search_value_to_false();">
                        </div>
                    </div>
                    <div class="col-lg-6 col-md-6 train-to" style="z-index:5;">
                        <h4 class="image-change-route-vertical"><a href="javascript:insurance_switch();" tabindex="-1" style="z-index:5; color:`+text_color+`;" id="insurance_switch"><span style="margin-left: 2px;" class="icon icon-exchange"></span></a></h4>
                        <h4 class="image-change-route-horizontal"><a href="javascript:insurance_switch();" tabindex="-1" style="z-index:5; color:`+text_color+`;" id="insurance_switch"><span class="icon icon-exchange"></span></a></h4>
                        <span class="span-search-ticket"> To</span>
                        <div class="input-container-search-ticket">
                            <i class="fas fa-map-marked-alt" style="padding:14px; height: 43px; width: 45px; background:`+color+`; color:`+text_color+`;"></i>
                            <input id="insurance_destination" name="insurance_destination" class="form-control" type="text" placeholder="Destination (City or Country)" style="width:100%; outline:0" autocomplete="off" value="" onfocus="document.getElementById('insurance_destination').select();" onclick="set_insurance_search_value_to_false();">
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3">
                <span class="span-search-ticket">Plan Trip</span>
                <div class="input-container-search-ticket btn-group">
                    <i class="fas fa-suitcase" style="padding:14px; height: 43px; width: 45px; background:`+color+`; color:`+text_color+`;"></i>
                        <select id="insurance_trip" name="insurance_trip" class="nice-select-default" onchange="next_focus_element('insurance','plantrip')">

                        </select>
                    </div>
                </div>
            </div>
            <div class="col-lg-3" id="insurance_date_search">
                <span class="span-search-ticket">Date</span>
                <div class="input-container-search-ticket">
                    <i class="fas fa-calendar-alt" style="padding:14px; height: 43px; width: 45px; background:`+color+`; color:`+text_color+`;"></i>
                    <input type="text" class="form-control" style="background:white;" id="insurance_date" name="insurance_date" placeholder="Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Date '" autocomplete="off" readonly/>
                </div>
            </div>`;
        }
        else{
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
            </div>`;

            if(template == 3 || template == 6 || template == 7){
                text+=`<div class="col-lg-12">`;
            }else{
                text+=`<div class="col-lg-6">`;
            }
            text+=`
                <div class="row">
                    <input id="insurance_provider" name="insurance_provider" value="bcainsurance" hidden>
                    <input id="checkbox" name="insurance_is_senior" value="" hidden>
                    <div class="col-lg-6 col-md-6 train-from">
                        <span class="span-search-ticket"><i class="fas fa-train"></i> From</span>
                        <div class="input-container-search-ticket">
                            <input id="insurance_origin" name="insurance_origin" class="form-control" type="text" placeholder="Origin (City)" style="width:100%; outline:0" autocomplete="off" value="" onfocus="document.getElementById('insurance_origin').select();" onclick="set_insurance_search_value_to_false();">
                        </div>
                    </div>
                    <div class="col-lg-6 col-md-6 train-to" style="z-index:5;">
                        <div class="image-change-route-vertical">
                            <span><a href="javascript:insurance_switch();" style="z-index:5; color:black;" id="insurance_switch"><i class="image-rounded-icon2"><i class="fas fa-exchange-alt"></i></i></a></span>
                        </div>
                        <div class="image-change-route-horizontal">
                            <span><a class="horizontal-arrow" href="javascript:insurance_switch();" style="z-index:5; color:{{text_color}} !important;" id="insurance_switch"><i class="image-rounded-icon"><i class="fas fa-exchange-alt"></i></i></a></span>
                        </div>
                        <span class="span-search-ticket"><i class="fas fa-map-marked-alt"></i> To</span>
                        <div class="input-container-search-ticket">
                            <input id="insurance_destination" name="insurance_destination" class="form-control" type="text" placeholder="Destination (City or Country)" style="width:100%; outline:0" autocomplete="off" value="" onfocus="document.getElementById('insurance_destination').select();" onclick="set_insurance_search_value_to_false();">
                        </div>
                    </div>
                </div>
            </div>`;

            if(template == 3 || template == 6 || template == 7){
                text+=`<div class="col-lg-12">`;
            }else{
                text+=`<div class="col-lg-6">`;
            }
            text+=`
                <div class="row">
                    <div class="col-lg-6 col-md-6">
                        <span class="span-search-ticket"><i class="fas fa-suitcase"></i> Plan Trip</span>`;

                        if(template == 7){
                            text+=`
                            <div class="select-form mb-30">
                                <div class="select-itms">`;
                        }else{
                            text+=`
                            <div class="input-container-search-ticket btn-group">
                                <div class="form-select default-select" id="default-select">`;
                        }
                        text+=`
                                <select id="insurance_trip" name="insurance_trip" class="nice-select-default" onchange="next_focus_element('insurance','plantrip')">

                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6 col-md-6" id="insurance_date_search">
                        <span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Date</span>
                        <div class="input-container-search-ticket">
                            <input type="text" class="form-control" style="background:white;" id="insurance_date" name="insurance_date" placeholder="Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Date '" autocomplete="off" readonly/>
                        </div>
                    </div>
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
    else if(insurance_provider == 'zurich'){
        //zurich
        text+=`
        <div class="col-lg-12 mt-3" style="text-align:left;">
            <h3 class="title_cst mb-4">
                <img src="/static/tt_website/images/logo/insurance/zurich.png" alt="Zurich" style="width:auto; height:45px; border-radius:7px; padding:0px; background:white;">
                Zurich
            </h3>
        </div>`;
        if(template == 4){
        text +=`
            <div class="col-lg-12" id="radio_insurance_search" style="text-align:left;margin-bottom:10px;">
                <label class="radio-button-custom crlabel">
                    <span style="font-size:13px; color:`+text_color+`;">Single Trip</span>
                    <input type="radio" checked="checked" name="radio_insurance_type" value="Single Trip">
                    <span class="checkmark-radio crspan"></span>
                </label>
            </div>
            <div class="col-lg-12 mb-2">
                <label class="check_box_custom" style="text-align:left;">
                    <span class="span-search-ticket" style="color:`+text_color+`;">Is Senior (for Age 70+)</span>
                    <input type="checkbox" id="insurance_is_senior" name="insurance_is_senior" />
                    <span class="check_box_span_custom"></span>
                </label>
            </div>
            <div class="col-lg-4">
                <span class="span-search-ticket">Destination Area</span>
                <div class="input-container-search-ticket btn-group">
                    <i class="fas fa-train" style="padding:14px; height: 43px; width: 45px; background:`+color+`; color:`+text_color+`;"></i>
                    <div class="form-select" id="default-select">
                        <select id="insurance_destination_area" name="insurance_destination_area" class="nice-select-default" onchange="auto_complete_zurich();next_focus_element('insurance','destination')">`;
                        for(i in insurance_config['zurich']['region']){
                            text +=`<option value="`+i+`">`+i.substr(0,1).toUpperCase()+i.substr(1,i.length).toLowerCase()+`</option>`;
                        }
                        text += `
                        </select>
                    </div>
                </div>
            </div>
            <div class="col-lg-4">
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
                        <input id="insurance_destination" name="insurance_destination" class="form-control" type="text" placeholder="Destination (Country)" style="width:100%; outline:0" autocomplete="off" value="" onfocus="document.getElementById('insurance_destination').select();" onclick="set_insurance_search_value_to_false();" onchange="next_focus_element('insurance','date')">
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
            </div>`;
        }
        else{
        text +=`
            <div class="col-lg-12" id="radio_insurance_search" style="text-align:left;margin-bottom:10px;">
                <label class="radio-button-custom crlabel">
                    <span style="font-size:13px; color:`+text_color+`;">Single Trip</span>
                    <input type="radio" checked="checked" name="radio_insurance_type" value="Single Trip">
                    <span class="checkmark-radio crspan"></span>
                </label>
            </div>
            <div class="col-lg-12 mb-2" style="text-align:left;">
                <label class="check_box_custom">
                    <span class="span-search-ticket" style="color:`+text_color+`;">Is Senior (for Age 70+)</span>
                    <input type="checkbox" id="insurance_is_senior" name="insurance_is_senior" />
                    <span class="check_box_span_custom"></span>
                </label>
            </div>
            <div class="col-lg-4">
                <span class="span-search-ticket"><i class="fas fa-train"></i> Destination Area</span>`;
                    if(template == 7){
                        text+=`
                        <div class="select-form mb-30">
                            <div class="select-itms">`;
                    }else{
                        text+=`
                        <div class="input-container-search-ticket btn-group">
                            <div class="form-select default-select" id="default-select">`;
                    }
                    text+=`
                        <select id="insurance_destination_area" name="insurance_destination_area" class="nice-select-default" onchange="auto_complete_zurich();next_focus_element('insurance','destination')">`;
                        for(i in insurance_config['zurich']['region']){
                            text +=`<option value="`+i+`">`+i.substr(0,1).toUpperCase()+i.substr(1,i.length).toLowerCase()+`</option>`;
                        }
                        text += `
                        </select>
                    </div>
                </div>
            </div>
            <div class="col-lg-4">
                <div class="row">
                    <input id="insurance_provider" name="insurance_provider" value="zurich" hidden>
                    <div class="col-lg-12" hidden>
                        <span class="span-search-ticket"><i class="fas fa-train"></i> From</span>
                        <div class="input-container-search-ticket">
                            <input id="insurance_origin" name="insurance_origin" class="form-control" type="text" placeholder="Origin" style="width:100%; outline:0" autocomplete="off" value="" onfocus="document.getElementById('insurance_origin').select();" onclick="set_insurance_search_value_to_false();">
                        </div>
                    </div>
                    <div class="col-lg-12" style="z-index:5;">
                        <span class="span-search-ticket"><i class="fas fa-map-marked-alt"></i> Destination</span>
                        <div class="input-container-search-ticket">
                            <input id="insurance_destination" name="insurance_destination" class="form-control" type="text" placeholder="Destination (Country)" style="width:100%; outline:0" autocomplete="off" value="" onfocus="document.getElementById('insurance_destination').select();" onclick="set_insurance_search_value_to_false();" onchange="next_focus_element('insurance','date')">
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-4" hidden>
                <span class="span-search-ticket"><i class="fas fa-suitcase"></i> Plan Trip</span>
                <div class="input-container-search-ticket btn-group">
                    <div class="form-select" id="default-select">
                        <select id="insurance_trip" name="insurance_trip" class="nice-select-default" onchange="next_focus_element('insurance','plantrip')">
                            <option value="LAINNYA" selected>LAINNYA</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="col-lg-4" id="insurance_date_search">
                <span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Date</span>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control" style="background:white;" id="insurance_date" name="insurance_date" placeholder="Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Date '" autocomplete="off" readonly/>
                </div>
            </div>`;
        }

        document.getElementById('insurance_div').innerHTML = text;

        auto_complete_zurich();

        //load js ulang
        document.getElementById("insurance_origin").value = "Surabaya - Domestic";
        $('#insurance_destination_area').niceSelect();

        var insurance_destination = new autoComplete({
            selector: '#insurance_destination',
            minChars: 1,
            cache: false,
            delay:0,
            source: function(term, suggest){
                if(term.split(' - ').length == 2)
                    term = ''
                if(term.length > 1)
                    suggest(insurance_search_autocomplete(term,'destination'));
            },
            onSelect: function(e, term, item){
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
    insurance_print_provider();
//    insurance_get_config_provider('home');
}

function auto_complete_zurich(){
    if(document.getElementById('insurance_destination_area').value != ''){
        country_list = insurance_config['zurich']['region'][document.getElementById('insurance_destination_area').value]['Countries'].split(',');
        zurich_insurance_destination = [];
        for(i in country_list){
            if(insurance_config['zurich'].listCountryCode.hasOwnProperty(country_list[i]))
                zurich_insurance_destination.push(insurance_config['zurich'].listCountryCode[country_list[i]].Text + ' - ' + insurance_config['zurich'].listCountryCode[country_list[i]].Value)
        }
        //default kosong kalau destination tidak dalam destination_area
        if(document.getElementById('insurance_destination').value != '')
            if(zurich_insurance_destination.includes(document.getElementById('insurance_destination').value) == false)
                document.getElementById('insurance_destination').value = '';

        if(document.getElementById('insurance_destination_area').value == 'Domestic'){
            document.getElementById('insurance_destination').value = zurich_insurance_destination[0];
            setTimeout(function(){
                $("#insurance_date").focus();
            }, 200);
        }else{
            setTimeout(function(){
                $("#insurance_destination").focus();
            }, 200);
        }
    }
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
                additional_price += insurance_pick.additional_benefit[j].total_price;
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
    price_detail();

}

function upload_image(){
    var formData = new FormData($('#insurance_review').get(0));
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

                document.getElementById('image_list_data').value = JSON.stringify(img_list)
                document.getElementById('insurance_review').submit();
            }else{
                //swal error image tidak terupload
                document.getElementById('insurance_review').submit();
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

function update_service_charge(type){
    repricing_order_number = '';
    if(type == 'booking'){
        document.getElementById('insurance_booking').innerHTML = '';
        upsell = []
        for(i in insurance_get_detail.result.response.passengers){
            for(j in insurance_get_detail.result.response.passengers[i].sale_service_charges){
                currency = insurance_get_detail.result.response.passengers[i].sale_service_charges[j].FARE.currency;
                break;
            }
            list_price = []
            if(document.getElementById(insurance_get_detail.result.response.passengers[i].name+'_repricing').innerHTML != '-'){
                list_price.push({
                    'amount': parseInt(document.getElementById(insurance_get_detail.result.response.passengers[i].name+'_repricing').innerHTML.split(',').join('')),
                    'currency_code': currency
                });
                upsell.push({
                    'sequence': insurance_get_detail.result.response.passengers[i].sequence,
                    'pricing': JSON.parse(JSON.stringify(list_price))
                });
            }
        }
        repricing_order_number = insurance_get_detail.result.response.order_number;
    }else{
        //BELUM DI TEST
        upsell_price = 0;
        upsell = []
        counter_pax = 0;
        currency = price.currency;
        for(i in adult){
            list_price = []
            if(document.getElementById(adult[i].first_name+adult[i].last_name+'_repricing').innerHTML != '-' && document.getElementById(adult[i].first_name+adult[i].last_name+'_repricing').innerHTML != '0'){
                list_price.push({
                    'amount': parseInt(document.getElementById(adult[i].first_name+adult[i].last_name+'_repricing').innerHTML.split(',').join('')),
                    'currency_code': currency
                });
                upsell_price += parseInt(document.getElementById(adult[i].first_name+adult[i].last_name+'_repricing').innerHTML.split(',').join(''));
                upsell.push({
                    'sequence': counter_pax,
                    'pricing': JSON.parse(JSON.stringify(list_price))
                });
            }
            counter_pax++;
        }
    }
    $.ajax({
       type: "POST",
       url: "/webservice/insurance",
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
                    insurance_get_booking(repricing_order_number);
                }else{
                    //BELUM DI TEST
                    price_arr_repricing = {};
                    pax_type_repricing = [];
                    insurance_detail();
                }

                $('#myModalRepricing').modal('hide');
           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
           }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error insurance service charge </span>' + msg.result.error_msg,
                })
                $('.loader-rodextrip').fadeOut();
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error insurance service charge');
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
       url: "/webservice/insurance",
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
                        insurance_get_booking(repricing_order_number);
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
                  html: '<span style="color: #ff9900;">Error insurance update booker insentif </span>' + msg.result.error_msg,
                })
                $('.loader-rodextrip').fadeOut();
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error insurance update booker insentif');
            $('.loader-rodextrip').fadeOut();
       },timeout: 60000
    });

}
