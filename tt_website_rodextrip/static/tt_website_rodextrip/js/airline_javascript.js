price_type = [];
total_price_provider = []
additional_price = 0;

airline_choose = 0;

promotion_code = 0;
sorting_value = 'Lowest Price';

counter_search = 0;
counter_airline_search = 0;
check_flight_type = 0;
check_flight_departure = 0;
check_flight_return = 0;

origin_multi_city = [];
destination_multi_city = [];
var myVar;

var departure_list = [
    {
        value:'All',
        status: true
    },{
        value:'00.01 - 11.00',
        status: false
    },{
        value:'11.01 - 15.00',
        status: false
    },{
        value:'15.01 - 18.00',
        status: false
    },{
        value:'18.01 - 24.00',
        status: false
    }
]

var arrival_list = [
    {
        value:'All',
        status: true
    },{
        value:'00.01 - 11.00',
        status: false
    },{
        value:'11.01 - 15.00',
        status: false
    },{
        value:'15.01 - 18.00',
        status: false
    },{
        value:'18.01 - 24.00',
        status: false
    }
]

var transit_list = [
    {
        value:'Direct',
        status: false
    },{
        value:'1',
        status: false
    },{
        value:'2+',
        status: false
    }
]

var transit_duration_list = [
    {
        value:'0h - 4h',
        status: false
    },{
        value:'4h - 8h',
        status: false
    },{
        value:'8h - 12h',
        status: false
    },{
        value:'12h+',
        status: false
    }
]

var sorting_list = [
    {
        value:'Lowest Price',
        status: false
    },{
        value:'Highest Price',
        status: false
    },{
        value:'Earliest Departure',
        status: false
    },{
        value:'Latest Departure',
        status: false
    },{
        value:'Earliest Arrival',
        status: false
    },{
        value:'Latest Arrival',
        status: false
    }
]

var sorting_list2 = [
    {
        value:'Price',
        status: false
    },{
//        value:'Shortest Duration',
//        status: false
//    },{
        value:'Departure',
        status: false
    },{
        value:'Arrival',
        status: false
    }
]

//autocomplete

function set_airline_search_value_to_false(){
    airline_search_value = 'false';
}
function set_airline_search_value_to_true(){
    airline_search_value = 'true';
}

function add_promotion_code(){
    text = '';
    if(promotion_code == 0)
        text +=`<div class="row">
                    <div class="col-lg-6">
                        <label>Code</label>
                    </div>
                    <div class="col-lg-6">
                        <label>Carrier Code</label>
                    </div>
                </div>`;
    text += `
        <div class="row banner-right" id="promotion_code_line`+promotion_code+`">
            <div class="col-lg-6 form-wrap" style="padding:0px 15px 0px 15px; text-align:left;">
                <input type="text" class="form-control" id="code_line`+promotion_code+`" name="code_line`+promotion_code+`" placeholder="Code"/>
            </div>
            <div class="col-lg-6 form-wrap" style="padding:0px 15px 0px 15px; text-align:left;">
                <input type="text" class="form-control" id="carrier_code_line`+promotion_code+`" name="carrier_code_line`+promotion_code+`" placeholder="ex GA"/>
            </div>
            <div class="col-lg-12" style="text-align:right;">
                <button type="button" class="primary-delete-date" onclick="delete_promotion_code(`+promotion_code+`)"><i class="fa fa-trash-alt" style="color:#E92B2B;font-size:16px;"></i> Delete</button>
            </div>
        </div>`;
    var node = document.createElement("div");
    node.innerHTML = text;
    document.getElementById("promotion_code").appendChild(node);
    promotion_code++;
}

function delete_promotion_code(val){
    document.getElementById("promotion_code_line"+val).remove();
}

function airline_search_autocomplete(term){
    term = term.toLowerCase();
    var choices = new_airline_destination;
    var suggestions = [];
    var priority = [];
    if(term.split(' - ').length == 4)
        term = '';
    for (i=0;i<choices.length;i++){
        if(choices[i].toLowerCase().split(' - ')[0].search(term) !== -1){
            priority.push(choices[i]);
        }else if(choices[i].toLowerCase().search(term) !== -1)
            suggestions.push(choices[i]);
    }
    return priority.concat(suggestions).slice(0,100);
}

function airline_goto_search(){
    type = '';
    error_log = '';

    var radios = document.getElementsByName('radio_airline_type');
    for (var j = 0, length = radios.length; j < length; j++) {
        if (radios[j].checked) {
            // do whatever you want with the checked radio
            type = radios[j].value;
            // only one radio can be logically checked, don't check the rest
            break;
        }
    }

    if(type != 'multicity'){
        if(document.getElementById('origin_id_flight').value.split(' - ').length != 4)
            error_log+= 'Please use autocomplete for origin\n';
        if(document.getElementById('destination_id_flight').value.split(' - ').length != 4)
            error_log+= 'Please use autocomplete for destination\n';
//        if(document.getElementById('origin_id_flight').value.split(' - ')[3] == document.getElementById('destination_id_flight').value.split(' - ')[3] && document.getElementById('destination_id_flight').value.split(' - ')[3] == 'Indonesia')
//            error_log+= "Sorry domestic airline still under development!\n";
    }else{
        for(var i=1;i<=counter_airline_search;i++){
            if(document.getElementById('origin_id_flight'+i).value.split(' - ').length != 4)
                error_log+= 'Please use autocomplete for origin '+i+'\n';
            if(document.getElementById('destination_id_flight'+i).value.split(' - ').length != 4)
                error_log+= 'Please use autocomplete for destination '+i+'\n';
        }
    }
//    error_log = ''; //DEV GARUDA
    if(error_log == ''){
        $('.button-search').addClass("running");
        document.getElementById('counter').value = counter_airline_search;
        document.getElementById('airline_searchForm').submit();
    }else{
        $('.button-search').removeClass("running");
        alert(error_log);
    }
}

function return_airline(){
    if(document.getElementById('directionflight').checked != true)
        $('#airline_return').prop('disabled', true);
    else
        $('#airline_return').prop('disabled', false);
}

function airline_check_search_values(){
    error_log = '';
    if(document.getElementById('origin_id_flight').value.split(' - ').length != 2)
        error_log += 'Please use autocomplete for From field';
    if(document.getElementById('destination_id_flight').value.split(' - ').length != 2)
        error_log += 'Please use autocomplete for To field';
    if(error_log == '')
        document.getElementById('airline_searchForm').submit();
    else
        alert(error_log);
}

function add_multi_city(type){
    if(counter_airline_search != 6){
        counter_airline_search++;
        if(counter_airline_search == 1){
            quantity_adult_flight = parseInt(document.getElementById('adult_flight').value);
            quantity_child_flight = parseInt(document.getElementById('child_flight').value);
            quantity_infant_flight = parseInt(document.getElementById('infant_flight').value);
            var node_paxs = document.createElement("div");
            text_paxs = `
            <div class="row">
                <div class="col-lg-4 col-md-4" style="text-align:left;">`;
                    if(template != 4){
                        text_paxs += `
                        <span class="span-search-ticket"><i class="fas fa-users"></i> Passenger</span>
                        <div class="input-container-search-ticket btn-group">`;
                    }else{
                        text_paxs += `
                        <span class="span-search-ticket">Passenger</span>
                        <div class="input-container-search-ticket btn-group">
                        <i class="fas fa-users" style="padding:14px; height: 43px; width: 45px; background:`+color+`; color:`+text_color+`;"></i>`;
                    }

                    text_paxs += `
                        <button id="show_total_pax_flight`+counter_airline_search+`" type="button" class="form-control dropdown-toggle" data-toggle="dropdown" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align:left; cursor:pointer;"></button>
                        <ul class="dropdown-menu" role="menu">
                            <div class="row" style="padding:10px;">
                                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="float:left !important;">
                                    <div style="float:left;">
                                        <label>
                                            <span style="color:black; font-size:13px;">Adult</span><br/>
                                            <span style="color:gray; font-size:11px;">(Age 11+)</span>
                                        </label>
                                    </div>
                                </div>
                                <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="float:right !important;">
                                    <div style="float:right; display:flex; padding:5px 0px 5px 5px;">`;
                                        if(quantity_adult_flight == 1)
                                        text_paxs +=`
                                        <button type="button" class="left-minus-adult-flight btn-custom-circle" id="left-minus-adult-flight`+counter_airline_search+`" onclick="airline_set_passenger_minus('adult',`+counter_airline_search+`);" data-type="minus" data-field="" disabled>`;
                                        else
                                        text_paxs+=`<button type="button" class="left-minus-adult-flight btn-custom-circle" id="left-minus-adult-flight`+counter_airline_search+`" onclick="airline_set_passenger_minus('adult',`+counter_airline_search+`);" data-type="minus" data-field="" >`;
                                        text_paxs +=`
                                            <i class="fas fa-minus"></i>
                                        </button>
                                        <input type="text" style="padding:5px !important; border:none; background:none; font-size:13px; text-align:center; width:25px;" id="adult_flight`+counter_airline_search+`" name="adult_flight`+counter_airline_search+`" value="`+quantity_adult_flight+`" min="1" readonly>`;
                                        if(quantity_adult_flight + quantity_child_flight == 9)
                                        text_paxs +=`<button type="button" class="right-plus-adult-flight btn-custom-circle" id="right-plus-adult-flight`+counter_airline_search+`" data-type="plus" data-field="" onclick="airline_set_passenger_plus('adult',`+counter_airline_search+`);" disabled>`;
                                        else
                                        text_paxs +=`<button type="button" class="right-plus-adult-flight btn-custom-circle" id="right-plus-adult-flight`+counter_airline_search+`" data-type="plus" data-field="" onclick="airline_set_passenger_plus('adult',`+counter_airline_search+`);">`;
                                        text_paxs +=`
                                            <i class="fas fa-plus"></i>
                                        </button>
                                    </div>
                                </div>

                                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="float:left !important;">
                                    <div style="float:left;">
                                        <label>
                                            <span style="color:black; font-size:13px;">Child<br/></span>
                                            <span style="color:gray; font-size:11px;">(Age 2 - 11)</span>
                                        </label>
                                    </div>
                                </div>
                                <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="float:right !important;">
                                    <div style="float:right; display:flex; padding:5px 0px 5px 5px;">`;
                                        if(quantity_child_flight == 0)
                                        text_paxs +=`<button type="button" class="left-minus-child-flight btn-custom-circle" id="left-minus-child-flight`+counter_airline_search+`" data-type="minus" data-field="" disabled onclick="airline_set_passenger_minus('child',`+counter_airline_search+`);">`;
                                        else
                                        text_paxs +=`<button type="button" class="left-minus-child-flight btn-custom-circle" id="left-minus-child-flight`+counter_airline_search+`" data-type="minus" data-field="" onclick="airline_set_passenger_minus('child',`+counter_airline_search+`);">`;
                                        text_paxs +=`
                                            <i class="fas fa-minus"></i>
                                        </button>
                                        <input type="text" style="padding:5px !important; border:none; background:none; font-size:13px; text-align:center; width:25px;" id="child_flight`+counter_airline_search+`" name="child_flight`+counter_airline_search+`" value="`+quantity_child_flight+`" min="0" readonly>`;
                                        if(quantity_adult_flight + quantity_child_flight == 9)
                                        text_paxs+=`<button type="button" class="right-plus-child-flight btn-custom-circle" id="right-plus-child-flight`+counter_airline_search+`" data-type="plus" data-field="" disabled onclick="airline_set_passenger_plus('child',`+counter_airline_search+`);">`;
                                        else
                                        text_paxs+=`<button type="button" class="right-plus-child-flight btn-custom-circle" id="right-plus-child-flight`+counter_airline_search+`" data-type="plus" data-field="" onclick="airline_set_passenger_plus('child',`+counter_airline_search+`);">`;
                                        text_paxs+=`
                                            <i class="fas fa-plus"></i>
                                        </button>
                                    </div>
                                </div>

                                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="float:left !important;">
                                    <div style="float:left;">
                                        <label>
                                            <span style="color:black; font-size:13px;">Infant<br/></span>
                                            <span style="color:gray; font-size:11px;">(Age < 2)</span>
                                        </label>
                                    </div>
                                </div>
                                <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="float:right !important;">
                                    <div style="float:right; display:flex; padding:5px 0px 5px 5px;">`;
                                        if(quantity_infant_flight == 0)
                                        text_paxs+=`<button type="button" class="left-minus-infant-flight btn-custom-circle" id="left-minus-infant-flight`+counter_airline_search+`" data-type="minus" data-field="" disabled onclick="airline_set_passenger_minus('infant',`+counter_airline_search+`);">`;
                                        else
                                        text_paxs+=`<button type="button" class="left-minus-infant-flight btn-custom-circle" id="left-minus-infant-flight`+counter_airline_search+`" data-type="minus" data-field="" onclick="airline_set_passenger_minus('infant',`+counter_airline_search+`);">`;
                                        text_paxs+=`
                                            <i class="fas fa-minus"></i>
                                        </button>
                                        <input type="text" style="padding:5px !important; border:none; background:none; font-size:13px; text-align:center; width:25px;" id="infant_flight`+counter_airline_search+`" name="infant_flight`+counter_airline_search+`" value="`+quantity_infant_flight+`" readonly>`;
                                        if(quantity_infant_flight == quantity_adult_flight)
                                        text_paxs+=`
                                        <button type="button" class="right-plus-infant-flight btn-custom-circle" id="right-plus-infant-flight`+counter_airline_search+`" data-type="plus" data-field="" disabled onclick="airline_set_passenger_plus('infant',`+counter_airline_search+`);">`;
                                        else
                                        text_paxs+=`
                                        <button type="button" class="right-plus-infant-flight btn-custom-circle" id="right-plus-infant-flight`+counter_airline_search+`" data-type="plus" data-field="" onclick="airline_set_passenger_plus('infant',`+counter_airline_search+`);">`;
                                        text_paxs+=`
                                            <i class="fas fa-plus"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="col-lg-12" style="text-align:right;">
                                    <hr/>
                                    <button class="primary-btn" type="button" style="line-height:34px;" onclick="next_focus_element('airline','passenger1');">Done</button>
                                </div>
                            </div>
                        </ul>
                    </div>
                </div>
                <div class="col-lg-4 col-md-4">`;
                if(template != 4){
                    text_paxs += `
                    <span class="span-search-ticket"><i class="fas fa-plane"></i> Airline</span>
                    <div class="input-container-search-ticket btn-group">`;
                }else{
                    text_paxs += `
                    <span class="span-search-ticket">Passenger</span>
                    <div class="input-container-search-ticket btn-group">
                    <i class="fas fa-plane" style="padding:14px; height: 43px; width: 45px; background:`+color+`; color:`+text_color+`;"></i>`;
                }
                try{
                    text_paxs += `<button id="show_provider_airline`+counter_airline_search+`" type="button" class="form-control dropdown-toggle" data-toggle="dropdown" style="text-align:left; cursor:pointer;"><i class="fas fa-plane"></i> ` + airline_check + `</button>`;
                }catch(err){
                    text_paxs += `<button id="show_provider_airline`+counter_airline_search+`" type="button" class="form-control dropdown-toggle" data-toggle="dropdown" style="text-align:left; cursor:pointer;"><i class="fas fa-plane"></i> Choose Airline</button>`;
                }

                if(template != 1){
                    text_paxs += `<ul id="provider_flight_content`+counter_airline_search+`" class="dropdown-menu" style="padding:20px; z-index:11;">`;
                }else{
                    text_paxs += `<ul id="provider_flight_content`+counter_airline_search+`" class="dropdown-menu" style="padding:10px; z-index:11;">`;
                }
                    text_paxs += `
                        </ul>
                    </div>
                </div>
                <div class="col-lg-4 col-md-4">
                    <span class="span-search-ticket">Class</span>`;
                    if(template == 1){
                        text_paxs += `
                        <div class="input-container-search-ticket btn-group">
                            <div class="form-select" id="default-select`+counter_airline_search+`">
                                <select id="cabin_class_flight`+counter_airline_search+`" name="cabin_class_flight`+counter_airline_search+`" data-live-search="true" size="4">`;
                    }
                    else if(template == 2){
                        text_paxs += `
                        <div>
                            <div class="form-select" id="default-select`+counter_airline_search+`">
                                <select id="cabin_class_flight`+counter_airline_search+`" name="cabin_class_flight`+counter_airline_search+`" data-live-search="true" size="4" class="form-control">`;
                    }
                    else if(template == 3){
                       text_paxs += `
                       <div class="form-group">
                            <div class="default-select" id="default-select`+counter_airline_search+`">
                                <select id="cabin_class_flight`+counter_airline_search+`" name="cabin_class_flight`+counter_airline_search+`" data-live-search="true" size="4">`;
                    }
                    else if(template == 4){
                        text_paxs += `
                        <div class="input-container-search-ticket btn-group">
                            <div class="form-select">
                                <select class="nice-select-default" id="cabin_class_flight`+counter_airline_search+`" name="cabin_class_flight`+counter_airline_search+`">`;
                    }
                    else if(template == 5 || template == 6){
                        text_paxs += `
                        <div>
                            <select class="form-control" id="cabin_class_flight`+counter_airline_search+`" name="cabin_class_flight`+counter_airline_search+`">`;
                    }
                        for(i in cabin_class){
                            try{
                                if(type == 'search'){
                                    if(airline_request.cabin_class[0] == cabin_class[i].value)
                                        text_paxs+=`<option value="`+cabin_class[i].value+`" selected>`+cabin_class[i].name+`</option>`;
                                    else
                                        text_paxs+=`<option value="`+cabin_class[i].value+`" >`+cabin_class[i].name+`</option>`;
                                }else if(i == 0){
                                    if(type == 'home')
                                        text_paxs+=`<option value="`+cabin_class[i].value+`" selected>`+cabin_class[i].name+`</option>`;
                                    else
                                        text_paxs+=`<option value="`+cabin_class[i].value+`" >`+cabin_class[i].name+`</option>`;
                                }else
                                    text_paxs+=`<option value="`+cabin_class[i].value+`" >`+cabin_class[i].name+`</option>`;
                            }catch(err){
                                if(i == 0)
                                    text_paxs+=`<option value="`+cabin_class[i].value+`" selected>`+cabin_class[i].name+`</option>`;
                                else
                                    text_paxs+=`<option value="`+cabin_class[i].value+`" >`+cabin_class[i].name+`</option>`;
                            }
                        }
                     text_paxs+=`</select>
                        </div>
                    </div>
                </div>
            </div>`;
            node_paxs.innerHTML = text_paxs;
            document.getElementById("mc_airline_paxs").appendChild(node_paxs);
            get_carrier_code_list(type, counter_airline_search);
            airline_provider_list_mc.push(airline_provider_list);
            $('#cabin_class_flight'+counter_airline_search).niceSelect();

            $('#cabin_class_flight1').on('change', function() {
                setTimeout(function(){
                    $("#origin_id_flight1").focus();
                }, 200);
            });
        }

//        var node_tabs = document.createElement("li");
//        if(counter_airline_search == 1)
//        text_tabs = `
//        <a class="nav-link active" id="mc_airline`+counter_airline_search+`" data-toggle="tab" href="#mc_airline_add`+counter_airline_search+`" role="tab" aria-controls="mc_airline_tab`+counter_airline_search+`" aria-selected="true">
//            <span><i class="fas fa-plane"></i> Flight `+counter_airline_search+` </span>
//        </a>`;
//        else
//        text_tabs = `
//        <a class="nav-link" id="mc_airline`+counter_airline_search+`" data-toggle="tab" href="#mc_airline_add`+counter_airline_search+`" role="tab" aria-controls="mc_airline_tab`+counter_airline_search+`" aria-selected="true">
//            <span><i class="fas fa-plane"></i> Flight `+counter_airline_search+` </span>
//        </a>`;
//        node_tabs.className = 'nav-item';
//        node_tabs.innerHTML = text_tabs;
//        node_tabs.setAttribute('id', 'mc_airline_add_tabs'+counter_airline_search);
//        document.getElementById("mc_airline_add_tabs").appendChild(node_tabs);

        var node = document.createElement("div");
        if(template == 1){
            text = `
            <div class="col-lg-12">
                <div class="row">
                    <div class="col-lg-12" style="text-align:left; padding:0px; margin-top:10px; margin-bottom:10px;">
                        <h5 style="color:`+text_color+`">Flight-`+counter_airline_search+`</h5>
                    </div>
                        <div class="col-lg-8">
                            <div class="row">
                                <div class="col-lg-6 col-md-6 col-sm-6 airline-from" style="padding-left:0px;">
                                    <span class="span-search-ticket"><i class="fas fa-plane-departure"></i> From</span>
                                        <div class="input-container-search-ticket">
                                            <div class="form-select">`;
                                            if(type == 'search'){
                                                if(airline_request.destination[counter_airline_search - 1] != null)
                                                    text+=`
                                                    <input id="origin_id_flight`+counter_airline_search+`" name="origin_id_flight`+counter_airline_search+`" class="form-control" type="text" placeholder="Origin" style="width:100%;outline:0" autocomplete="off" value="`+airline_request.origin[counter_airline_search - 1]+`" onfocus="document.getElementById('origin_id_flight`+counter_airline_search+`').select();" onclick="set_airline_search_value_to_false();">`;
                                                else{
                                                    temp = document.getElementById('destination_id_flight'+(counter_airline_search-1).toString()).value;
                                                    text+=`
                                                    <input id="origin_id_flight`+counter_airline_search+`" name="origin_id_flight`+counter_airline_search+`" class="form-control" type="text" placeholder="Origin" style="width:100%;outline:0" autocomplete="off" value="`+temp+`" onfocus="document.getElementById('origin_id_flight`+counter_airline_search+`').select();" onclick="set_airline_search_value_to_false();">`;
                                                }
                                            }else if(counter_airline_search==1)
                                                try{
                                                    text+=`
                                                    <input id="origin_id_flight`+counter_airline_search+`" name="origin_id_flight`+counter_airline_search+`" class="form-control" type="text" placeholder="Origin" style="width:100%;outline:0" autocomplete="off" value="`+airline_request.origin[counter_airline_search - 1]+`" onfocus="document.getElementById('origin_id_flight`+counter_airline_search+`').select();" onclick="set_airline_search_value_to_false();">`;
                                                }catch(err){
                                                    text+=`
                                                    <input id="origin_id_flight`+counter_airline_search+`" name="origin_id_flight`+counter_airline_search+`" class="form-control" type="text" placeholder="Origin" style="width:100%;outline:0" autocomplete="off" value="`+airline_origin+`" onfocus="document.getElementById('origin_id_flight`+counter_airline_search+`').select();" onclick="set_airline_search_value_to_false();">`;
                                                }
                                            else{
                                                temp = document.getElementById('destination_id_flight'+(counter_airline_search-1).toString()).value;
                                                text+=`
                                                <input id="origin_id_flight`+counter_airline_search+`" name="origin_id_flight`+counter_airline_search+`" class="form-control" type="text" placeholder="Origin" style="width:100%;outline:0" autocomplete="off" value="`+temp+`" onfocus="document.getElementById('origin_id_flight`+counter_airline_search+`').select();" onclick="set_airline_search_value_to_false();">`;
                                                //<select class="form-control" style="width:100%;" id="origin_id_flight`+counter_airline_search+`" placeholder="City or Airport or IATA" onchange="airline_autocomplete('origin', `+counter_airline_search+`)">
                                            }
                                    text+=`
                                            </div>
                                        </div>
                                    </div>
                                    <div class="image-change-route-vertical">
                                        <h4><a href="javascript:airline_switch(`+counter_airline_search+`);" tabindex="-1" style="z-index:5; color:black;" id="flight_switch`+counter_airline_search+`"><i class="image-rounded-icon2"><i class="fas fa-exchange-alt"></i></i></a></h4>
                                    </div>
                                    <div class="image-change-route-horizontal">
                                        <h4><a class="horizontal-arrow" href="javascript:airline_switch(`+counter_airline_search+`);" tabindex="-1" style="z-index:5; color:`+text_color+`;" id="flight_switch`+counter_airline_search+`"><i class="image-rounded-icon"><i class="fas fa-exchange-alt icon-change"></i></i></a></h4>
                                    </div>
                                <div class="col-lg-6 col-md-6 col-sm-6 airline-to" style="z-index:5; padding-right:0px;">
                                <span class="span-search-ticket"><i class="fas fa-plane-arrival"></i> To</span>
                                <div class="input-container-search-ticket">
                                    <div class="form-select">`;
                                    if(type == 'search'){
                                        if(airline_request.destination[counter_airline_search - 1] != null)
                                            text+=`
                                            <input id="destination_id_flight`+counter_airline_search+`" name="destination_id_flight`+counter_airline_search+`" class="form-control" type="text" placeholder="Destination" style="width:100%;outline:0" autocomplete="off" value="`+airline_request.destination[counter_airline_search - 1]+`" onfocus="document.getElementById('destination_id_flight`+counter_airline_search+`').select();" onclick="set_airline_search_value_to_false();">`;
                                        else{
                                            temp = document.getElementById('origin_id_flight'+(counter_airline_search-1).toString()).value;
                                            text+=`
                                            <input id="destination_id_flight`+counter_airline_search+`" name="destination_id_flight`+counter_airline_search+`" class="form-control" type="text" placeholder="Destination" style="width:100%;outline:0" autocomplete="off" value="`+temp+`" onfocus="document.getElementById('destination_id_flight`+counter_airline_search+`').select();" onclick="set_airline_search_value_to_false();">`;
                                        }

                                    }else if(counter_airline_search == 1)
                                    text+=`
                                        <input id="destination_id_flight`+counter_airline_search+`" name="destination_id_flight`+counter_airline_search+`" class="form-control" type="text" placeholder="Destination" style="width:100%;outline:0" autocomplete="off" value="`+airline_destination+`" onfocus="document.getElementById('destination_id_flight`+counter_airline_search+`').select();" onclick="set_airline_search_value_to_false();">`;
                                    else{
                                        temp = document.getElementById('origin_id_flight'+(counter_airline_search-1).toString()).value;
                                    text+=`
                                        <input id="destination_id_flight`+counter_airline_search+`" name="destination_id_flight`+counter_airline_search+`" class="form-control" type="text" placeholder="Destination" style="width:100%;outline:0" autocomplete="off" value="`+temp+`" onfocus="document.getElementById('destination_id_flight`+counter_airline_search+`').select();" onclick="set_airline_search_value_to_false();">`;
                                        //<select class="form-control " name="state" style="width:100%;" id="destination_id_flight`+counter_airline_search+`" name="destination_id_flight`+counter_airline_search+`" placeholder="City or Airport or IATA" onchange="airline_autocomplete('destination', `+counter_airline_search+`)">
                                    }
                                    text+=`</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4" style="padding:0px;">
                        <span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Departure</span>
                        <div class="input-container-search-ticket">
                            <input type="text" class="form-control" name="airline_departure`+counter_airline_search+`" id="airline_departure`+counter_airline_search+`" placeholder="Departure Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date '" autocomplete="off" readonly style="background:white;">
                        </div>
                    </div>
                </div>
            </div>`;
        }
        else if(template == 2){
            text = `
            <div class="row">
                <div class="col-lg-12" style="text-align:left; margin-top:10px; margin-bottom:10px;">
                    <h5 style="color:`+text_color+`;">Flight-`+counter_airline_search+`</h5>
                </div>
                    <div class="col-lg-8">
                        <div class="row">
                            <div class="col-lg-6 col-md-6 col-sm-6 airline-from">
                                <span class="span-search-ticket"><i class="fas fa-plane-departure"></i> From</span>
                                    <div class="input-container-search-ticket">`;
                                        if(type == 'search'){
                                            if(airline_request.destination[counter_airline_search - 1] != null)
                                                text+=`
                                                <input id="origin_id_flight`+counter_airline_search+`" name="origin_id_flight`+counter_airline_search+`" class="form-control" type="text" placeholder="Origin" style="width:100%;outline:0" autocomplete="off" value="`+airline_request.origin[counter_airline_search - 1]+`" onfocus="document.getElementById('origin_id_flight`+counter_airline_search+`').select();" onclick="set_airline_search_value_to_false();">`;
                                            else{
                                                temp = document.getElementById('destination_id_flight'+(counter_airline_search-1).toString()).value;
                                                text+=`
                                                <input id="origin_id_flight`+counter_airline_search+`" name="origin_id_flight`+counter_airline_search+`" class="form-control" type="text" placeholder="Origin" style="width:100%;outline:0" autocomplete="off" value="`+temp+`" onfocus="document.getElementById('origin_id_flight`+counter_airline_search+`').select();" onclick="set_airline_search_value_to_false();">`;
                                            }
                                        }else if(counter_airline_search==1)
                                            text+=`
                                            <input id="origin_id_flight`+counter_airline_search+`" name="origin_id_flight`+counter_airline_search+`" class="form-control" type="text" placeholder="Origin" style="width:100%;outline:0" autocomplete="off" value="`+airline_origin+`" onfocus="document.getElementById('origin_id_flight`+counter_airline_search+`').select();" onclick="set_airline_search_value_to_false();">`;
                                        else{
                                            temp = document.getElementById('destination_id_flight'+(counter_airline_search-1).toString()).value;
                                            text+=`
                                            <input id="origin_id_flight`+counter_airline_search+`" name="origin_id_flight`+counter_airline_search+`" class="form-control" type="text" placeholder="Origin" style="width:100%;outline:0" autocomplete="off" value="`+temp+`" onfocus="document.getElementById('origin_id_flight`+counter_airline_search+`').select();" onclick="set_airline_search_value_to_false();">`;
                                            //<select class="form-control" style="width:100%;" id="origin_id_flight`+counter_airline_search+`" placeholder="City or Airport or IATA" onchange="airline_autocomplete('origin', `+counter_airline_search+`)">
                                        }
                                text+=`
                                    </div>
                                </div>
                                <div class="image-change-route-vertical">
                                    <h4><a href="javascript:airline_switch(`+counter_airline_search+`);" tabindex="-1" style="z-index:5;" id="flight_switch`+counter_airline_search+`"><i class="image-rounded-icon2"><i class="fas fa-exchange-alt"></i></i></a></h4>
                                </div>
                                <div class="image-change-route-horizontal">
                                    <h4><a class="horizontal-arrow" href="javascript:airline_switch(`+counter_airline_search+`);" tabindex="-1" style="z-index:5; color:`+text_color+`;" id="flight_switch`+counter_airline_search+`"><i class="image-rounded-icon"><i class="fas fa-exchange-alt icon-change"></i></i></a></h4>
                                </div>
                            <div class="col-lg-6 col-md-6 col-sm-6 airline-to" style="z-index:5;">
                            <span class="span-search-ticket"><i class="fas fa-plane-arrival"></i> To</span>
                            <div class="input-container-search-ticket">`;
                                if(type == 'search'){
                                    if(airline_request.destination[counter_airline_search - 1] != null)
                                        text+=`
                                        <input id="destination_id_flight`+counter_airline_search+`" name="destination_id_flight`+counter_airline_search+`" class="form-control" type="text" placeholder="Destination" style="width:100%;outline:0" autocomplete="off" value="`+airline_request.destination[counter_airline_search - 1]+`" onfocus="document.getElementById('destination_id_flight`+counter_airline_search+`').select();" onclick="set_airline_search_value_to_false();">`;
                                    else{
                                        temp = document.getElementById('origin_id_flight'+(counter_airline_search-1).toString()).value;
                                        text+=`
                                        <input id="destination_id_flight`+counter_airline_search+`" name="destination_id_flight`+counter_airline_search+`" class="form-control" type="text" placeholder="Destination" style="width:100%;outline:0" autocomplete="off" value="`+temp+`" onfocus="document.getElementById('destination_id_flight`+counter_airline_search+`').select();" onclick="set_airline_search_value_to_false();">`;
                                    }

                                }else if(counter_airline_search == 1)
                                text+=`
                                    <input id="destination_id_flight`+counter_airline_search+`" name="destination_id_flight`+counter_airline_search+`" class="form-control" type="text" placeholder="Destination" style="width:100%;outline:0" autocomplete="off" value="`+airline_destination+`" onfocus="document.getElementById('destination_id_flight`+counter_airline_search+`').select();" onclick="set_airline_search_value_to_false();">`;
                                else{
                                    temp = document.getElementById('origin_id_flight'+(counter_airline_search-1).toString()).value;
                                text+=`
                                    <input id="destination_id_flight`+counter_airline_search+`" name="destination_id_flight`+counter_airline_search+`" class="form-control" type="text" placeholder="Destination" style="width:100%;outline:0" autocomplete="off" value="`+temp+`" onfocus="document.getElementById('destination_id_flight`+counter_airline_search+`').select();" onclick="set_airline_search_value_to_false();">`;
                                    //<select class="form-control " name="state" style="width:100%;" id="destination_id_flight`+counter_airline_search+`" name="destination_id_flight`+counter_airline_search+`" placeholder="City or Airport or IATA" onchange="airline_autocomplete('destination', `+counter_airline_search+`)">
                                }
                                text+=`
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4">
                    <span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Departure</span>
                    <div class="input-container-search-ticket">
                        <input type="text" class="form-control" name="airline_departure`+counter_airline_search+`" id="airline_departure`+counter_airline_search+`" placeholder="Departure Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date '" autocomplete="off" readonly style="background:white;">
                    </div>
                </div>
            </div>`;
        }
        else if(template == 3){
            text = `
            <div class="row">
                <div class="col-lg-12" style="text-align:left; margin-top:10px; margin-bottom:10px;">
                    <h5 style="color:`+text_color+`;">Flight-`+counter_airline_search+`</h5>
                </div>
                    <div class="col-lg-8">
                        <div class="row">
                            <div class="col-lg-6 col-md-6 col-sm-6 airline-from">
                                <span class="span-search-ticket"><i class="fas fa-plane-departure"></i> From</span>
                                    <div class="form-group">`;
                                        if(type == 'search'){
                                            if(airline_request.destination[counter_airline_search - 1] != null)
                                                text+=`
                                                <input id="origin_id_flight`+counter_airline_search+`" name="origin_id_flight`+counter_airline_search+`" class="form-control" type="text" placeholder="Origin" style="width:100%;outline:0" autocomplete="off" value="`+airline_request.origin[counter_airline_search - 1]+`" onfocus="document.getElementById('origin_id_flight`+counter_airline_search+`').select();" onclick="set_airline_search_value_to_false();">`;
                                            else{
                                                temp = document.getElementById('destination_id_flight'+(counter_airline_search-1).toString()).value;
                                                text+=`
                                                <input id="origin_id_flight`+counter_airline_search+`" name="origin_id_flight`+counter_airline_search+`" class="form-control" type="text" placeholder="Origin" style="width:100%;outline:0" autocomplete="off" value="`+temp+`" onfocus="document.getElementById('origin_id_flight`+counter_airline_search+`').select();" onclick="set_airline_search_value_to_false();">`;
                                            }
                                        }else if(counter_airline_search==1)
                                            text+=`
                                            <input id="origin_id_flight`+counter_airline_search+`" name="origin_id_flight`+counter_airline_search+`" class="form-control" type="text" placeholder="Origin" style="width:100%;outline:0" autocomplete="off" value="`+airline_origin+`" onfocus="document.getElementById('origin_id_flight`+counter_airline_search+`').select();" onclick="set_airline_search_value_to_false();">`;
                                        else{
                                            temp = document.getElementById('destination_id_flight'+(counter_airline_search-1).toString()).value;
                                            text+=`
                                            <input id="origin_id_flight`+counter_airline_search+`" name="origin_id_flight`+counter_airline_search+`" class="form-control" type="text" placeholder="Origin" style="width:100%;outline:0" autocomplete="off" value="`+temp+`" onfocus="document.getElementById('origin_id_flight`+counter_airline_search+`').select();" onclick="set_airline_search_value_to_false();">`;
                                            //<select class="form-control" style="width:100%;" id="origin_id_flight`+counter_airline_search+`" placeholder="City or Airport or IATA" onchange="airline_autocomplete('origin', `+counter_airline_search+`)">
                                        }
                                text+=`
                                    </div>
                                </div>
                            <div class="col-lg-6 col-md-6 col-sm-6 airline-to" style="z-index:5;">
                            <h4 class="image-change-route-vertical"><a href="javascript:airline_switch(`+counter_airline_search+`);" tabindex="-1" style="z-index:5;" id="flight_switch`+counter_airline_search+`"><i class="fas fa-exchange-alt"></i></a></h4>
                            <h4 class="image-change-route-horizontal"><a class="horizontal-arrow" href="javascript:airline_switch(`+counter_airline_search+`);" tabindex="-1" style="z-index:5;" id="flight_switch`+counter_airline_search+`"><i class="fas fa-exchange-alt icon-change"></i></a></h4>
                            <span class="span-search-ticket"><i class="fas fa-plane-arrival"></i> To</span>
                            <div class="form-group">`;
                                if(type == 'search'){
                                    if(airline_request.destination[counter_airline_search - 1] != null)
                                        text+=`
                                        <input id="destination_id_flight`+counter_airline_search+`" name="destination_id_flight`+counter_airline_search+`" class="form-control" type="text" placeholder="Destination" style="width:100%;outline:0" autocomplete="off" value="`+airline_request.destination[counter_airline_search - 1]+`" onfocus="document.getElementById('destination_id_flight`+counter_airline_search+`').select();" onclick="set_airline_search_value_to_false();">`;
                                    else{
                                        temp = document.getElementById('origin_id_flight'+(counter_airline_search-1).toString()).value;
                                        text+=`
                                        <input id="destination_id_flight`+counter_airline_search+`" name="destination_id_flight`+counter_airline_search+`" class="form-control" type="text" placeholder="Destination" style="width:100%;outline:0" autocomplete="off" value="`+temp+`" onfocus="document.getElementById('destination_id_flight`+counter_airline_search+`').select();" onclick="set_airline_search_value_to_false();">`;
                                    }

                                }else if(counter_airline_search == 1)
                                text+=`
                                    <input id="destination_id_flight`+counter_airline_search+`" name="destination_id_flight`+counter_airline_search+`" class="form-control" type="text" placeholder="Destination" style="width:100%;outline:0" autocomplete="off" value="`+airline_destination+`" onfocus="document.getElementById('destination_id_flight`+counter_airline_search+`').select();" onclick="set_airline_search_value_to_false();">`;
                                else{
                                    temp = document.getElementById('origin_id_flight'+(counter_airline_search-1).toString()).value;
                                text+=`
                                    <input id="destination_id_flight`+counter_airline_search+`" name="destination_id_flight`+counter_airline_search+`" class="form-control" type="text" placeholder="Destination" style="width:100%;outline:0" autocomplete="off" value="`+temp+`" onfocus="document.getElementById('destination_id_flight`+counter_airline_search+`').select();" onclick="set_airline_search_value_to_false();">`;
                                    //<select class="form-control " name="state" style="width:100%;" id="destination_id_flight`+counter_airline_search+`" name="destination_id_flight`+counter_airline_search+`" placeholder="City or Airport or IATA" onchange="airline_autocomplete('destination', `+counter_airline_search+`)">
                                }
                                text+=`
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4">
                    <span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Departure</span>
                    <div class="form-group">
                        <input type="text" class="form-control" name="airline_departure`+counter_airline_search+`" id="airline_departure`+counter_airline_search+`" placeholder="Departure Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date '" autocomplete="off" readonly style="background:white;">
                    </div>
                </div>
            </div>`;
        }
        else if(template == 4){
            text = `
            <div class="row">
                <div class="col-lg-12" style="text-align:left; margin-top:10px; margin-bottom:10px;">
                    <h5 style="color:`+text_color+`;">Flight-`+counter_airline_search+`</h5>
                </div>
                    <div class="col-lg-8">
                        <div class="row">
                            <div class="col-lg-6 col-md-6 col-sm-6 airline-from">
                                <span class="span-search-ticket">From</span>
                                    <div class="input-container-search-ticket">
                                        <i class="fas fa-plane-departure" style="padding:14px; height: 43px; width: 45px; background:`+color+`; color:`+text_color+`;"></i>`;
                                        if(type == 'search'){
                                            if(airline_request.destination[counter_airline_search - 1] != null)
                                                text+=`
                                                <input id="origin_id_flight`+counter_airline_search+`" name="origin_id_flight`+counter_airline_search+`" class="form-control" type="text" placeholder="Origin" style="width:100%;outline:0" autocomplete="off" value="`+airline_request.origin[counter_airline_search - 1]+`" onfocus="document.getElementById('origin_id_flight`+counter_airline_search+`').select();" onclick="set_airline_search_value_to_false();">`;
                                            else{
                                                temp = document.getElementById('destination_id_flight'+(counter_airline_search-1).toString()).value;
                                                text+=`
                                                <input id="origin_id_flight`+counter_airline_search+`" name="origin_id_flight`+counter_airline_search+`" class="form-control" type="text" placeholder="Origin" style="width:100%;outline:0" autocomplete="off" value="`+temp+`" onfocus="document.getElementById('origin_id_flight`+counter_airline_search+`').select();" onclick="set_airline_search_value_to_false();">`;
                                            }
                                        }else if(counter_airline_search==1)
                                            text+=`
                                            <input id="origin_id_flight`+counter_airline_search+`" name="origin_id_flight`+counter_airline_search+`" class="form-control" type="text" placeholder="Origin" style="width:100%;outline:0" autocomplete="off" value="`+airline_origin+`" onfocus="document.getElementById('origin_id_flight`+counter_airline_search+`').select();" onclick="set_airline_search_value_to_false();">`;
                                        else{
                                            temp = document.getElementById('destination_id_flight'+(counter_airline_search-1).toString()).value;
                                            text+=`
                                            <input id="origin_id_flight`+counter_airline_search+`" name="origin_id_flight`+counter_airline_search+`" class="form-control" type="text" placeholder="Origin" style="width:100%;outline:0" autocomplete="off" value="`+temp+`" onfocus="document.getElementById('origin_id_flight`+counter_airline_search+`').select();" onclick="set_airline_search_value_to_false();">`;
                                            //<select class="form-control" style="width:100%;" id="origin_id_flight`+counter_airline_search+`" placeholder="City or Airport or IATA" onchange="airline_autocomplete('origin', `+counter_airline_search+`)">
                                        }
                                text+=`
                                    </div>
                                </div>
                            <div class="col-lg-6 col-md-6 col-sm-6 airline-to" style="z-index:5;">
                            <h4 class="image-change-route-vertical"><a href="javascript:airline_switch(`+counter_airline_search+`);" tabindex="-1" style="z-index:5;" id="flight_switch`+counter_airline_search+`"><span class="icon icon-exchange"></span></a></h4>
                            <h4 class="image-change-route-horizontal"><a class="horizontal-arrow" href="javascript:airline_switch(`+counter_airline_search+`);" tabindex="-1" style="z-index:5;" id="flight_switch`+counter_airline_search+`"><span class="icon icon-exchange"></span></a></h4>
                            <span class="span-search-ticket">To</span>
                            <div class="input-container-search-ticket">
                                <i class="fas fa-plane-arrival" style="padding:14px; height: 43px; width: 45px; background:`+color+`; color:`+text_color+`;"></i>`;
                                if(type == 'search'){
                                    if(airline_request.destination[counter_airline_search - 1] != null)
                                        text+=`
                                        <input id="destination_id_flight`+counter_airline_search+`" name="destination_id_flight`+counter_airline_search+`" class="form-control" type="text" placeholder="Destination" style="width:100%;outline:0" autocomplete="off" value="`+airline_request.destination[counter_airline_search - 1]+`" onfocus="document.getElementById('destination_id_flight`+counter_airline_search+`').select();" onclick="set_airline_search_value_to_false();">`;
                                    else{
                                        temp = document.getElementById('origin_id_flight'+(counter_airline_search-1).toString()).value;
                                        text+=`
                                        <input id="destination_id_flight`+counter_airline_search+`" name="destination_id_flight`+counter_airline_search+`" class="form-control" type="text" placeholder="Destination" style="width:100%;outline:0" autocomplete="off" value="`+temp+`" onfocus="document.getElementById('destination_id_flight`+counter_airline_search+`').select();" onclick="set_airline_search_value_to_false();">`;
                                    }

                                }else if(counter_airline_search == 1)
                                text+=`
                                    <input id="destination_id_flight`+counter_airline_search+`" name="destination_id_flight`+counter_airline_search+`" class="form-control" type="text" placeholder="Destination" style="width:100%;outline:0" autocomplete="off" value="`+airline_destination+`" onfocus="document.getElementById('destination_id_flight`+counter_airline_search+`').select();" onclick="set_airline_search_value_to_false();">`;
                                else{
                                    temp = document.getElementById('origin_id_flight'+(counter_airline_search-1).toString()).value;
                                text+=`
                                    <input id="destination_id_flight`+counter_airline_search+`" name="destination_id_flight`+counter_airline_search+`" class="form-control" type="text" placeholder="Destination" style="width:100%;outline:0" autocomplete="off" value="`+temp+`" onfocus="document.getElementById('destination_id_flight`+counter_airline_search+`').select();" onclick="set_airline_search_value_to_false();">`;
                                    //<select class="form-control " name="state" style="width:100%;" id="destination_id_flight`+counter_airline_search+`" name="destination_id_flight`+counter_airline_search+`" placeholder="City or Airport or IATA" onchange="airline_autocomplete('destination', `+counter_airline_search+`)">
                                }
                                text+=`
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4">
                    <span class="span-search-ticket">Departure</span>
                    <div class="input-container-search-ticket">
                        <i class="fas fa-calendar-alt" style="padding:14px; height: 43px; width: 45px; background:`+color+`; color:`+text_color+`;"></i>
                        <input type="text" class="form-control" name="airline_departure`+counter_airline_search+`" id="airline_departure`+counter_airline_search+`" placeholder="Departure Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date '" autocomplete="off" readonly style="background:white;">
                    </div>
                </div>
            </div>`;
        }
        else if(template == 5){
            text = `
            <div class="row">
                <div class="col-lg-12" style="text-align:left; margin-top:10px; margin-bottom:10px;">
                    <h5 style="color:`+text_color+`;">Flight-`+counter_airline_search+`</h5>
                </div>
                    <div class="col-lg-8">
                        <div class="row">
                            <div class="col-lg-6 col-md-6 col-sm-6 airline-from">
                                <span class="span-search-ticket"><i class="fas fa-plane-departure"></i> From</span>
                                        <div class="input-container-search-ticket">`;
                                        if(type == 'search'){
                                            if(airline_request.destination[counter_airline_search - 1] != null)
                                                text+=`
                                                <input id="origin_id_flight`+counter_airline_search+`" name="origin_id_flight`+counter_airline_search+`" class="form-control" type="text" placeholder="Origin" style="width:100%;outline:0" autocomplete="off" value="`+airline_request.origin[counter_airline_search - 1]+`" onfocus="document.getElementById('origin_id_flight`+counter_airline_search+`').select();" onclick="set_airline_search_value_to_false();">`;
                                            else{
                                                temp = document.getElementById('destination_id_flight'+(counter_airline_search-1).toString()).value;
                                                text+=`
                                                <input id="origin_id_flight`+counter_airline_search+`" name="origin_id_flight`+counter_airline_search+`" class="form-control" type="text" placeholder="Origin" style="width:100%;outline:0" autocomplete="off" value="`+temp+`" onfocus="document.getElementById('origin_id_flight`+counter_airline_search+`').select();" onclick="set_airline_search_value_to_false();">`;
                                            }
                                        }else if(counter_airline_search==1)
                                            text+=`
                                            <input id="origin_id_flight`+counter_airline_search+`" name="origin_id_flight`+counter_airline_search+`" class="form-control" type="text" placeholder="Origin" style="width:100%;outline:0" autocomplete="off" value="`+airline_origin+`" onfocus="document.getElementById('origin_id_flight`+counter_airline_search+`').select();" onclick="set_airline_search_value_to_false();">`;
                                        else{
                                            temp = document.getElementById('destination_id_flight'+(counter_airline_search-1).toString()).value;
                                            text+=`
                                            <input id="origin_id_flight`+counter_airline_search+`" name="origin_id_flight`+counter_airline_search+`" class="form-control" type="text" placeholder="Origin" style="width:100%;outline:0" autocomplete="off" value="`+temp+`" onfocus="document.getElementById('origin_id_flight`+counter_airline_search+`').select();" onclick="set_airline_search_value_to_false();">`;
                                            //<select class="form-control" style="width:100%;" id="origin_id_flight`+counter_airline_search+`" placeholder="City or Airport or IATA" onchange="airline_autocomplete('origin', `+counter_airline_search+`)">
                                        }
                                text+=`
                                    </div>
                                </div>
                            <div class="col-lg-6 col-md-6 col-sm-6 airline-to" style="z-index:5;">
                                <h4 class="image-change-route-vertical3"><a href="javascript:airline_switch(`+counter_airline_search+`);" tabindex="-1" style="z-index:5;" id="flight_switch`+counter_airline_search+`"><i class="image-rounded-icon2"><i class="fas fa-exchange-alt"></i></i></a></h4>
                                <h4 class="image-change-route-horizontal3"><a class="horizontal-arrow" href="javascript:airline_switch(`+counter_airline_search+`);" tabindex="-1" style="z-index:5;" id="flight_switch`+counter_airline_search+`"><i class="image-rounded-icon2"><i class="fas fa-exchange-alt icon-change"></i></i></a></h4>
                                <span class="span-search-ticket"><i class="fas fa-plane-arrival"></i> To</span>
                                    <div class="input-container-search-ticket">`;
                                if(type == 'search'){
                                    if(airline_request.destination[counter_airline_search - 1] != null)
                                        text+=`
                                        <input id="destination_id_flight`+counter_airline_search+`" name="destination_id_flight`+counter_airline_search+`" class="form-control" type="text" placeholder="Destination" style="width:100%;outline:0" autocomplete="off" value="`+airline_request.destination[counter_airline_search - 1]+`" onfocus="document.getElementById('destination_id_flight`+counter_airline_search+`').select();" onclick="set_airline_search_value_to_false();">`;
                                    else{
                                        temp = document.getElementById('origin_id_flight'+(counter_airline_search-1).toString()).value;
                                        text+=`
                                        <input id="destination_id_flight`+counter_airline_search+`" name="destination_id_flight`+counter_airline_search+`" class="form-control" type="text" placeholder="Destination" style="width:100%;outline:0" autocomplete="off" value="`+temp+`" onfocus="document.getElementById('destination_id_flight`+counter_airline_search+`').select();" onclick="set_airline_search_value_to_false();">`;
                                    }

                                }else if(counter_airline_search == 1)
                                text+=`
                                    <input id="destination_id_flight`+counter_airline_search+`" name="destination_id_flight`+counter_airline_search+`" class="form-control" type="text" placeholder="Destination" style="width:100%;outline:0" autocomplete="off" value="`+airline_destination+`" onfocus="document.getElementById('destination_id_flight`+counter_airline_search+`').select();" onclick="set_airline_search_value_to_false();">`;
                                else{
                                    temp = document.getElementById('origin_id_flight'+(counter_airline_search-1).toString()).value;
                                text+=`
                                    <input id="destination_id_flight`+counter_airline_search+`" name="destination_id_flight`+counter_airline_search+`" class="form-control" type="text" placeholder="Destination" style="width:100%;outline:0" autocomplete="off" value="`+temp+`" onfocus="document.getElementById('destination_id_flight`+counter_airline_search+`').select();" onclick="set_airline_search_value_to_false();">`;
                                    //<select class="form-control " name="state" style="width:100%;" id="destination_id_flight`+counter_airline_search+`" name="destination_id_flight`+counter_airline_search+`" placeholder="City or Airport or IATA" onchange="airline_autocomplete('destination', `+counter_airline_search+`)">
                                }
                                text+=`
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4">
                    <span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Departure</span>
                    <div class="input-container-search-ticket">
                        <input type="text" class="form-control" name="airline_departure`+counter_airline_search+`" id="airline_departure`+counter_airline_search+`" placeholder="Departure Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date '" autocomplete="off" readonly style="background:white;" >
                    </div>
                </div>
            </div>`;
        }
        else if(template == 6){
            text = `
            <div class="col-lg-12" style="padding:0px;">
                <div class="row">
                    <div class="col-lg-12" style="text-align:left; margin-top:10px; margin-bottom:10px;">
                        <h5 style="color:`+text_color+`">Flight-`+counter_airline_search+`</h5>
                    </div>
                        <div class="col-lg-8">
                            <div class="row">
                                <div class="col-lg-6 col-md-6 airline-from">
                                    <span class="span-search-ticket"><i class="fas fa-plane-departure"></i> From</span>
                                        <div class="input-container-search-ticket">
                                            <div class="form-select">`;
                                            if(type == 'search'){
                                                if(airline_request.destination[counter_airline_search - 1] != null)
                                                    text+=`
                                                    <input id="origin_id_flight`+counter_airline_search+`" name="origin_id_flight`+counter_airline_search+`" class="form-control" type="text" placeholder="Origin" style="width:100%;outline:0" autocomplete="off" value="`+airline_request.origin[counter_airline_search - 1]+`" onfocus="document.getElementById('origin_id_flight`+counter_airline_search+`').select();" onclick="set_airline_search_value_to_false();">`;
                                                else{
                                                    temp = document.getElementById('destination_id_flight'+(counter_airline_search-1).toString()).value;
                                                    text+=`
                                                    <input id="origin_id_flight`+counter_airline_search+`" name="origin_id_flight`+counter_airline_search+`" class="form-control" type="text" placeholder="Origin" style="width:100%;outline:0" autocomplete="off" value="`+temp+`" onfocus="document.getElementById('origin_id_flight`+counter_airline_search+`').select();" onclick="set_airline_search_value_to_false();">`;
                                                }
                                            }else if(counter_airline_search==1)
                                                try{
                                                    text+=`
                                                    <input id="origin_id_flight`+counter_airline_search+`" name="origin_id_flight`+counter_airline_search+`" class="form-control" type="text" placeholder="Origin" style="width:100%;outline:0" autocomplete="off" value="`+airline_request.origin[counter_airline_search - 1]+`" onfocus="document.getElementById('origin_id_flight`+counter_airline_search+`').select();" onclick="set_airline_search_value_to_false();">`;
                                                }catch(err){
                                                    text+=`
                                                    <input id="origin_id_flight`+counter_airline_search+`" name="origin_id_flight`+counter_airline_search+`" class="form-control" type="text" placeholder="Origin" style="width:100%;outline:0" autocomplete="off" value="`+airline_origin+`" onfocus="document.getElementById('origin_id_flight`+counter_airline_search+`').select();" onclick="set_airline_search_value_to_false();">`;
                                                }
                                            else{
                                                temp = document.getElementById('destination_id_flight'+(counter_airline_search-1).toString()).value;
                                                text+=`
                                                <input id="origin_id_flight`+counter_airline_search+`" name="origin_id_flight`+counter_airline_search+`" class="form-control" type="text" placeholder="Origin" style="width:100%;outline:0" autocomplete="off" value="`+temp+`" onfocus="document.getElementById('origin_id_flight`+counter_airline_search+`').select();" onclick="set_airline_search_value_to_false();">`;
                                                //<select class="form-control" style="width:100%;" id="origin_id_flight`+counter_airline_search+`" placeholder="City or Airport or IATA" onchange="airline_autocomplete('origin', `+counter_airline_search+`)">
                                            }
                                    text+=`
                                            </div>
                                        </div>
                                    </div>
                                    <div class="image-change-route-vertical">
                                        <h4><a href="javascript:airline_switch(`+counter_airline_search+`);" tabindex="-1" style="z-index:5; color:black;" id="flight_switch`+counter_airline_search+`"><i class="image-rounded-icon2"><i class="fas fa-exchange-alt"></i></i></a></h4>
                                    </div>
                                    <div class="image-change-route-horizontal">
                                        <h4><a class="horizontal-arrow" href="javascript:airline_switch(`+counter_airline_search+`);" tabindex="-1" style="z-index:5; color:`+text_color+`;" id="flight_switch`+counter_airline_search+`"><i class="image-rounded-icon"><i class="fas fa-exchange-alt icon-change"></i></i></a></h4>
                                    </div>
                                <div class="col-lg-6 col-md-6 airline-to" style="z-index:5;">
                                <span class="span-search-ticket"><i class="fas fa-plane-arrival"></i> To</span>
                                <div class="input-container-search-ticket">
                                    <div class="form-select">`;
                                    if(type == 'search'){
                                        if(airline_request.destination[counter_airline_search - 1] != null)
                                            text+=`
                                            <input id="destination_id_flight`+counter_airline_search+`" name="destination_id_flight`+counter_airline_search+`" class="form-control" type="text" placeholder="Destination" style="width:100%;outline:0" autocomplete="off" value="`+airline_request.destination[counter_airline_search - 1]+`" onfocus="document.getElementById('destination_id_flight`+counter_airline_search+`').select();" onclick="set_airline_search_value_to_false();">`;
                                        else{
                                            temp = document.getElementById('origin_id_flight'+(counter_airline_search-1).toString()).value;
                                            text+=`
                                            <input id="destination_id_flight`+counter_airline_search+`" name="destination_id_flight`+counter_airline_search+`" class="form-control" type="text" placeholder="Destination" style="width:100%;outline:0" autocomplete="off" value="`+temp+`" onfocus="document.getElementById('destination_id_flight`+counter_airline_search+`').select();" onclick="set_airline_search_value_to_false();">`;
                                        }

                                    }else if(counter_airline_search == 1)
                                    text+=`
                                        <input id="destination_id_flight`+counter_airline_search+`" name="destination_id_flight`+counter_airline_search+`" class="form-control" type="text" placeholder="Destination" style="width:100%;outline:0" autocomplete="off" value="`+airline_destination+`" onfocus="document.getElementById('destination_id_flight`+counter_airline_search+`').select();" onclick="set_airline_search_value_to_false();">`;
                                    else{
                                        temp = document.getElementById('origin_id_flight'+(counter_airline_search-1).toString()).value;
                                    text+=`
                                        <input id="destination_id_flight`+counter_airline_search+`" name="destination_id_flight`+counter_airline_search+`" class="form-control" type="text" placeholder="Destination" style="width:100%;outline:0" autocomplete="off" value="`+temp+`" onfocus="document.getElementById('destination_id_flight`+counter_airline_search+`').select();" onclick="set_airline_search_value_to_false();">`;
                                        //<select class="form-control " name="state" style="width:100%;" id="destination_id_flight`+counter_airline_search+`" name="destination_id_flight`+counter_airline_search+`" placeholder="City or Airport or IATA" onchange="airline_autocomplete('destination', `+counter_airline_search+`)">
                                    }
                                    text+=`</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Departure</span>
                        <div class="input-container-search-ticket">
                            <input type="text" class="form-control" name="airline_departure`+counter_airline_search+`" id="airline_departure`+counter_airline_search+`" placeholder="Departure Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date '" autocomplete="off" readonly style="background:white;">
                        </div>
                    </div>
                </div>
            </div>`;
        }


//        if(counter_airline_search == 1){
//            node.className = 'tab-pane fade show active';
//        }
//        else{
//            node.className = 'tab-pane fade';
//        }
        node.innerHTML = text;
        node.setAttribute('id', 'mc_airline_add'+counter_airline_search);
        document.getElementById("mc_airline_add").appendChild(node);
        $("airline_departure"+counter_airline_search).val(moment().format('DD MMM YYYY'));
        if(type == 'search'){
            //check lagi
            var counter = counter_airline_search-1;
            if(counter != 0)
                counter -= 1;
            if(counter_airline_search == 1)
                min_date = moment().format('DD MMM YYYY');
            else
                if(airline_request.departure[counter] != undefined)
                    min_date = airline_request.departure[counter]
                else
                    min_date = $('input[name="airline_departure'+(counter_airline_search - 1)+'"]').val()
            $('input[name="airline_departure'+counter_airline_search+'"]').daterangepicker({
              singleDatePicker: true,
              autoUpdateInput: true,
              opens: 'center',
              startDate: airline_request.departure[counter_airline_search-1],
              minDate: min_date,
              maxDate: moment().subtract(-365, 'days'),
              showDropdowns: true,
              locale: {
                  format: 'DD MMM YYYY',
              }
            });

            $('input[name="airline_departure'+counter_airline_search+'"]').on('apply.daterangepicker', function(ev, picker) {
                setTimeout(function(){
                    $("#origin_id_flight"+counter_airline_search).focus();
                }, 200);
            });
        }else{
            min_date = '';
            try{
                if($("#airline_departure"+parseInt(counter_airline_search - 1).toString()).val() != undefined){
                    if(counter_airline_search == 1)
                        min_date = moment().format('DD MMM YYYY');
                    else
                        min_date = $("#airline_departure"+parseInt(counter_airline_search - 1).toString()).val();
                    pick_date = $("#airline_departure"+parseInt(counter_airline_search - 1).toString()).val();
                }else{
                    if(counter_airline_search == 1)
                        min_date = moment().format('DD MMM YYYY');
                    else
                        min_date = $("#airline_departure").val()
                    pick_date = $("#airline_departure").val()
                }
            }catch(err){
                min_date = moment().format('DD MMM YYYY');
                pick_date = moment().format('DD MMM YYYY');
            }
            $('input[name="airline_departure'+counter_airline_search+'"]').daterangepicker({
              singleDatePicker: true,
              autoUpdateInput: true,
              opens: 'center',
              startDate: pick_date,
              minDate: min_date,
              maxDate: moment().subtract(-365, 'days'),
              showDropdowns: true,
              locale: {
                  format: 'DD MMM YYYY',
              }
            });
            $('input[name="airline_departure'+counter_airline_search+'"]').on('apply.daterangepicker', function(ev, picker) {
                var this_temp_date = ev.currentTarget.id;
                setTimeout(function(){
                    $("#origin_id_flight"+parseInt(parseInt(this_temp_date.substr(this_temp_date.length-1,1))+1).toString()).focus();
                }, 200);

                for(i=0;i<=counter_airline_search;i++){
                    $('input[name="airline_departure'+i+'"]').on('apply.daterangepicker', function(ev, picker) {
                        var this_temp_date = ev.currentTarget.id;
                        setTimeout(function(){
                            $("#origin_id_flight"+parseInt(parseInt(this_temp_date.substr(this_temp_date.length-1,1))+1).toString()).focus();
                        }, 200);
                    });
                }
            });
        }

        $('input[name="airline_departure'+counter_airline_search+'"]').change(function() {
            val = parseInt(this.id.replace ( /[^\d.]/g, '' ));
            for(i=val;i<=counter_airline_search;i++){
                if(i != val){
                    min_date = '';
                    try{
                        if($("#airline_departure"+(i-1).toString()).val() != undefined){
                            min_date = $("#airline_departure"+(i-1).toString()).val();
                            pick_date = $("#airline_departure"+(i).toString()).val();
                        }else{
                            min_date = $("#airline_departure").val()
                            pick_date = $("#airline_departure"+(i).toString()).val();
                        }
                        if(moment(pick_date) < moment(pick_date))
                        pick_date = min_date;
                    }catch(err){
                        min_date = $("#airline_departure").val()
                        pick_date = $("#airline_departure").val()
                    }
                    $('input[name="airline_departure'+i+'"]').daterangepicker({
                      singleDatePicker: true,
                      autoUpdateInput: true,
                      opens: 'center',
                      startDate: pick_date,
                      minDate: min_date,
                      maxDate: moment().subtract(-365, 'days'),
                      showDropdowns: true,
                      locale: {
                          format: 'DD MMM YYYY',
                      }
                    });
                }
            }
        });

        var temp_origin = new autoComplete({
            selector: '#origin_id_flight'+counter_airline_search,
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
                var this_temp_origin = this;
                setTimeout(function(){
                    $("#destination_id_flight"+this_temp_origin.selector.substr(this_temp_origin.selector.length-1,1)).focus();
                }, 200);
                set_airline_search_value_to_true();
            }
        });
        var temp_destination = new autoComplete({
            selector: '#destination_id_flight'+counter_airline_search,
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
                var this_temp_destination = this;
                setTimeout(function(){
                    $("#airline_departure"+this_temp_destination.selector.substr(this_temp_destination.selector.length-1,1)).focus();
                }, 200);
                set_airline_search_value_to_true();
            }
        });
        destination_multi_city.push(temp_destination);
        origin_multi_city.push(temp_origin)
        //select2
//        get_airline_config(type,counter_airline_search);
//        $('#origin_id_flight'+counter_airline_search).select2();
//        $('#destination_id_flight'+counter_airline_search).select2();
        $('.dropdown-menu').on('click', function(e) {
          e.stopPropagation();
        });

        if(counter_airline_search == 6){
            document.getElementById('add_mc_btn').hidden = true;
        }
        else{
            document.getElementById('del_mc_btn').hidden = false;
        }


//        for(i=0;i<counter;i++){
//            console.log('origin_id_flight'+(i+1));
//            $('#origin_id_flight'+(i+1)).select2();
//            $('#destination_id_flight'+(i+1)).select2();
//        }

    }else{
        Swal.fire({
          type: 'warning',
          title: 'Oops!',
          html: '3 Flight maximum in 1 search!',
       })
    }
}

function del_multi_city(){
    if(counter_airline_search!=1){
        //document.getElementById("mc_airline"+counter_airline_search).remove();
        document.getElementById("mc_airline_add"+counter_airline_search).remove();
        airline_provider_list_mc.pop(airline_provider_list_mc.length - 1);
        counter_airline_search--;
        //document.getElementById("mc_airline1").classList.add("active");
        //document.getElementById("mc_airline_add1").classList.add("show");
        //document.getElementById("mc_airline_add1").classList.add("active");
        if(counter_airline_search != 1){
            //document.getElementById("mc_airline"+counter_airline_search).classList.remove("active");
            //document.getElementById("mc_airline_add"+counter_airline_search).classList.remove("show");
            //document.getElementById("mc_airline_add"+counter_airline_search).classList.remove("active");
            document.getElementById('add_mc_btn').hidden = false;
            document.getElementById('del_mc_btn').hidden = false;
        }
        else{
            document.getElementById('add_mc_btn').hidden = false;
            document.getElementById('del_mc_btn').hidden = true;
        }
    }
}

function triggered(){
    try{
        if($state == 0){
            document.getElementById('search').hidden = true;
            $state = 1;
        }else{
            document.getElementById('search').hidden = false;
            $state = 0;
        }
    }catch(err){
        document.getElementById('search').hidden = false;
        $state = 0;
    }
}

function airline_filter_render(){

    var node = document.createElement("div");
    text = '';
    text+= `<h4 style="display: inline;">Filter</h4><a style="float: right; cursor: pointer;" onclick="reset_filter();"><i style="color:`+color+`;" class="fa fa-refresh"></i> Reset</a>
    <h6 class="filter_general" onclick="show_hide_general('airlineAirline');" id="filter_airline_span"></h6>
    <div id="airlineAirline_generalShow" style="display:inline-block;">
    </div>`;
    text += `
        <hr/>
        <h6 class="filter_general" onclick="show_hide_general('airlineTransit');">Transit <i class="fas fa-chevron-down" id="airlineTransit_generalDown" style="float:right; display:none;"></i><i class="fas fa-chevron-up" id="airlineTransit_generalUp" style="float:right; display:block;"></i></h6>
    <div id="airlineTransit_generalShow" style="display:inline-block;">`;
    for(i in transit_list){
        text+=`
        <label class="check_box_custom">
            <span class="span-search-ticket" style="color:black;">`+transit_list[i].value+`</span>
            <input type="checkbox" id="checkbox_transit`+i+`" onclick="change_filter('transit',`+i+`)"/>
            <span class="check_box_span_custom"></span>
        </label><br/>`;
    }
    text+=`</div>`;
    node = document.createElement("div");
    node.innerHTML = text;
    document.getElementById("filter").appendChild(node);
    node = document.createElement("div");

    text = `
            <hr/>
            <h6 class="filter_general" onclick="show_hide_general('airlineDuration');">Transit Duration <i class="fas fa-chevron-down" id="airlineDuration_generalDown" style="float:right; display:none;"></i><i class="fas fa-chevron-up" id="airlineDuration_generalUp" style="float:right; display:block;"></i></h6>
    <div id="airlineDuration_generalShow" style="display:inline-block;">`;
    for(i in transit_duration_list){
        text+=`
        <label class="check_box_custom">
            <span class="span-search-ticket" style="color:black;">`+transit_duration_list[i].value+`</span>
            <input type="checkbox" id="checkbox_transit_duration`+i+`" onclick="change_filter('transit_duration',`+i+`)"/>
            <span class="check_box_span_custom"></span>
        </label><br/>`;
    }
    text+=`</div>`;
    node = document.createElement("div");
    node.innerHTML = text;
    document.getElementById("filter").appendChild(node);

    text=`
    <hr/>
    <h6 class="filter_general" onclick="show_hide_general('airlineDeparture');">Departure Time <i class="fas fa-chevron-down" id="airlineDeparture_generalDown" style="float:right; display:none;"></i><i class="fas fa-chevron-up" id="airlineDeparture_generalUp" style="float:right; display:block;"></i></h6>
    <div id="airlineDeparture_generalShow" style="display:inline-block;">`;
    for(i in departure_list){
        if(i == 0)
            text += `
            <label class="check_box_custom">
                <span class="span-search-ticket" style="color:black;">`+departure_list[i].value+`</span>
                <input type="checkbox" id="checkbox_departure_time`+i+`" onclick="change_filter('departure',`+i+`);" checked/>
                <span class="check_box_span_custom"></span>
            </label><br/>`;
        else
            text += `
            <label class="check_box_custom">
                <span class="span-search-ticket" style="color:black;">`+departure_list[i].value+`</span>
                <input type="checkbox" id="checkbox_departure_time`+i+`" onclick="change_filter('departure',`+i+`);">
                <span class="check_box_span_custom"></span>
            </label><br/>`;
    }
    text+=`</div>`;
    node = document.createElement("div");
    node.innerHTML = text;
    document.getElementById("filter").appendChild(node);
    node = document.createElement("div");

    text=`
        <hr/>
        <h6 class="filter_general" onclick="show_hide_general('airlineArrival');">Arrival Time <i class="fas fa-chevron-down" id="airlineArrival_generalDown" style="float:right; display:none;"></i><i class="fas fa-chevron-up" id="airlineArrival_generalUp" style="float:right; display:block;"></i></h6>
    <div id="airlineArrival_generalShow" style="display:inline-block;">`;
    for(i in arrival_list){
        if(i == 0)
            text+=`
            <label class="check_box_custom">
                <span class="span-search-ticket" style="color:black;">`+arrival_list[i].value+`</span>
                <input type="checkbox" id="checkbox_arrival_time`+i+`" onclick="change_filter('arrival',`+i+`)" checked />
                <span class="check_box_span_custom"></span>
            </label><br/>`;
        else
            text+=`
            <label class="check_box_custom">
                <span class="span-search-ticket" style="color:black;">`+arrival_list[i].value+`</span>
                <input type="checkbox" id="checkbox_arrival_time`+i+`" onclick="change_filter('arrival',`+i+`)"/>
                <span class="check_box_span_custom"></span>
            </label><br/>`;
    }
    text+=`</div>`;
//        <div id="airline_list">
//
//        </div>`;

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
    /*
    <hr/>
    <h6 style="padding-bottom:10px;">Price Range</h6>
    <div class="wrapper">
        <div class="range-slider">
            <input type="text" class="js-range-slider" value=""/>
        </div>
        <div class="row">
            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                <span>Min</span><br/>
                <input type="text" class="js-input-from form-control-custom" id="price-from" value="0" />
            </div>
            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                <span>Max</span><br/>
                <input type="text" class="js-input-to form-control-custom" id="price-to" value="80900500" />
            </div>
        </div>
    </div>
    */
    text+= `<h4 style="display: inline;">Filter</h4><a style="float: right; cursor: pointer;" onclick="reset_filter();"><i style="color:`+color+`;" class="fa fa-refresh"></i> Reset</a>
    <hr/>
    <h6 style="padding-bottom:10px;">Departure Time</h6>`;
    for(i in departure_list){
        if(i == 0)
            text += `
            <label class="check_box_custom">
                <span class="span-search-ticket" style="color:black;">`+departure_list[i].value+`</span>
                <input type="checkbox" id="checkbox_departure_time2`+i+`" onclick="change_filter('departure',`+i+`);" checked/>
                <span class="check_box_span_custom"></span>
            </label><br/>`;
        else
            text += `
            <label class="check_box_custom">
                <span class="span-search-ticket" style="color:black;">`+departure_list[i].value+`</span>
                <input type="checkbox" id="checkbox_departure_time2`+i+`" onclick="change_filter('departure',`+i+`);">
                <span class="check_box_span_custom"></span>
            </label><br/>`;
    }
    node2 = document.createElement("div");
    node2.innerHTML = text;
    document.getElementById("filter2").appendChild(node2);
    node2 = document.createElement("div");

    text=`
        <hr/>
        <h6 style="padding-bottom:10px;">Arrival Time</h6>`;
    for(i in arrival_list){
        if(i == 0)
            text+=`
            <label class="check_box_custom">
                <span class="span-search-ticket" style="color:black;">`+arrival_list[i].value+`</span>
                <input type="checkbox" id="checkbox_arrival_time2`+i+`" onclick="change_filter('arrival',`+i+`)" checked />
                <span class="check_box_span_custom"></span>
            </label><br/>`;
        else
            text+=`
            <label class="check_box_custom">
                <span class="span-search-ticket" style="color:black;">`+arrival_list[i].value+`</span>
                <input type="checkbox" id="checkbox_arrival_time2`+i+`" onclick="change_filter('arrival',`+i+`)"/>
                <span class="check_box_span_custom"></span>
            </label><br/>`;
    }
    text+=`
    <h6 id="filter_airline_span2"></h6>
    <div id="airline_list2">

    </div>`;

    node2 = document.createElement("div");
    node2.innerHTML = text;
    document.getElementById("filter2").appendChild(node2);
    node2 = document.createElement("div");

    text = `
            <hr/>
            <h6 style="padding-bottom:10px;">Transit</h6>`;
    for(i in transit_list){
        text+=`
        <label class="check_box_custom">
            <span class="span-search-ticket" style="color:black;">`+transit_list[i].value+`</span>
            <input type="checkbox" id="checkbox_transit2`+i+`" onclick="change_filter('transit',`+i+`)"/>
            <span class="check_box_span_custom"></span>
        </label><br/>`;
    }
    node2 = document.createElement("div");
    node2.innerHTML = text;
    document.getElementById("filter2").appendChild(node2);
    node2 = document.createElement("div");

    text = `
            <hr/>
            <h6 style="padding-bottom:10px;">Transit Duration</h6>`;
    for(i in transit_duration_list){
        text+=`
        <label class="check_box_custom">
            <span class="span-search-ticket" style="color:black;">`+transit_duration_list[i].value+`</span>
            <input type="checkbox" id="checkbox_transit_duration2`+i+`" onclick="change_filter('transit_duration',`+i+`)"/>
            <span class="check_box_span_custom"></span>
        </label><br/>`;
    }

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

function airline_autocomplete(type,val){
    if(val == undefined){
        if(type == 'origin')
            document.getElementById('airline_origin_flight').value = document.getElementById('select2-origin_id_flight-container').innerHTML;
        else if(type == 'destination')
            document.getElementById('airline_destination_flight').value = document.getElementById('select2-destination_id_flight-container').innerHTML;
    }else{

        if(type == 'origin'){
            element = `select2-origin_id_flight`+val+`-container`;
            document.getElementById('airline_origin_flight'+val).value = document.getElementById(element).innerHTML;
        }else if(type == 'destination'){
            element = `select2-destination_id_flight`+val+`-container`;
            document.getElementById('airline_destination_flight'+val).value = document.getElementById(element).innerHTML;
        }
    }
}

function airline_set_passenger_plus(type, val){
    pax = '';
    quantity_adult_flight = parseInt(document.getElementById('adult_flight').value);
    quantity_child_flight = parseInt(document.getElementById('child_flight').value);
    quantity_infant_flight = parseInt(document.getElementById('infant_flight').value);
    if(type == 'adult'){
        var quantity = parseInt($('#adult_flight'+val).val());
        if(quantity < 9){
            $('#adult_flight').val(quantity + 1);
            $('#adult_flight1').val(quantity + 1);
            quantity_adult_flight = quantity + 1;
        }

        if (quantity_adult_flight+quantity_child_flight == 9){
            document.getElementById("left-minus-adult-flight").disabled = false;
            document.getElementById("right-plus-adult-flight").disabled = true;
            document.getElementById("right-plus-child-flight").disabled = true;
            document.getElementById("left-minus-adult-flight1").disabled = false;
            document.getElementById("right-plus-adult-flight1").disabled = true;
            document.getElementById("right-plus-child-flight1").disabled = true;
            if (quantity_child_flight > 0){
                document.getElementById("left-minus-child-flight").disabled = false;
                if(val != 0){
                    document.getElementById("left-minus-child-flight1").disabled = false;
                }
            }
            else{
                document.getElementById("left-minus-child-flight").disabled = true;
                document.getElementById("left-minus-child-flight1").disabled = true;
            }
        }
        else{
            document.getElementById("left-minus-adult-flight").disabled = false;
            document.getElementById("right-plus-child-flight").disabled = false;
            document.getElementById("left-minus-adult-flight1").disabled = false;
            document.getElementById("right-plus-child-flight1").disabled = false;
            if (quantity_child_flight > 0){
                document.getElementById("left-minus-child-flight").disabled = false;
                document.getElementById("left-minus-child-flight1").disabled = false;
            }
            else{
                document.getElementById("left-minus-child-flight").disabled = true;
                document.getElementById("left-minus-child-flight1").disabled = true;
            }
        }
        if (quantity_adult_flight > quantity_infant_flight){
            document.getElementById("right-plus-infant-flight").disabled = false;
            document.getElementById("right-plus-infant-flight").disabled = false;
            document.getElementById("right-plus-infant-flight1").disabled = false;
            document.getElementById("right-plus-infant-flight1").disabled = false;
        }
        if (quantity_adult_flight == quantity_infant_flight){
            document.getElementById("right-plus-infant-flight").disabled = true;
            document.getElementById("right-plus-infant-flight1").disabled = true;
        }

    }else if(type == 'child'){
        var quantity = parseInt($('#child_flight').val());

        if(quantity < 8){
            $('#child_flight').val(quantity + 1);
            $('#child_flight1').val(quantity + 1);
            quantity_child_flight = quantity + 1;
        }

        if (quantity_adult_flight+quantity_child_flight == 9){
            document.getElementById("right-plus-adult-flight").disabled = true;
            document.getElementById("right-plus-child-flight").disabled = true;
            document.getElementById("left-minus-child-flight").disabled = false;
            document.getElementById("right-plus-adult-flight1").disabled = true;
            document.getElementById("right-plus-child-flight1").disabled = true;
            document.getElementById("left-minus-child-flight1").disabled = false;

            if (quantity_adult_flight == 1){
                document.getElementById("left-minus-adult-flight").disabled = true;
                document.getElementById("left-minus-adult-flight1").disabled = true;
            }
            if (quantity_child_flight > 0){
                document.getElementById("left-minus-child-flight").disabled = false;
                document.getElementById("left-minus-child-flight1").disabled = false;
            }
            else{
                document.getElementById("left-minus-child-flight").disabled = true;
                document.getElementById("left-minus-child-flight1").disabled = true;
            }
        }
        else{
            document.getElementById("right-plus-child-flight").disabled = false;
            document.getElementById("left-minus-child-flight").disabled = false;
            document.getElementById("right-plus-child-flight1").disabled = false;
            document.getElementById("left-minus-child-flight1").disabled = false;

            if (quantity_child_flight > 0){
                document.getElementById("left-minus-child-flight").disabled = false;
                document.getElementById("left-minus-child-flight1").disabled = false;
            }
            else{
                document.getElementById("left-minus-child-flight").disabled = true;
                document.getElementById("left-minus-child-flight1").disabled = true;
            }
        }

    }else if(type == 'infant'){
        var quantity = parseInt($('#infant_flight').val());

        if (quantity < quantity_adult_flight){
            $('#infant_flight').val(quantity + 1);
            $('#infant_flight1').val(quantity + 1);
            quantity_infant_flight = quantity + 1;
        }

        if (quantity_infant_flight < quantity_adult_flight){
            document.getElementById("left-minus-infant-flight").disabled = false;
            document.getElementById("right-plus-infant-flight").disabled = false;
            document.getElementById("left-minus-infant-flight1").disabled = false;
            document.getElementById("right-plus-infant-flight1").disabled = false;
        }
        else if(quantity_infant_flight == quantity_adult_flight){
            document.getElementById("left-minus-infant-flight").disabled = false;
            document.getElementById("right-plus-infant-flight").disabled = true;
            document.getElementById("left-minus-infant-flight1").disabled = false;
            document.getElementById("right-plus-infant-flight1").disabled = true;
        }
        else{
            document.getElementById("right-plus-infant-flight").disabled = true;
            document.getElementById("left-minus-infant-flight").disabled = false;
            document.getElementById("right-plus-infant-flight1").disabled = true;
            document.getElementById("left-minus-infant-flight1").disabled = false;
        }
    }

    $('#show_total_pax_flight').text(quantity_adult_flight + " Adult, " + quantity_child_flight + " Child, " +quantity_infant_flight + " Infant");
    $('#show_total_pax_flight1').text(quantity_adult_flight + " Adult, " + quantity_child_flight + " Child, " +quantity_infant_flight + " Infant");

}

function airline_set_passenger_minus(type, val){
    error_log = '';
    pax = '';
    quantity_adult_flight = parseInt(document.getElementById('adult_flight').value);
    quantity_child_flight = parseInt(document.getElementById('child_flight').value);
    quantity_infant_flight = parseInt(document.getElementById('infant_flight').value);

    if(type == 'adult'){
        var quantity = parseInt($('#adult_flight').val());

        if(quantity > 1){
            $('#adult_flight').val(quantity - 1);
            $('#adult_flight1').val(quantity - 1);
            quantity_adult_flight = quantity - 1;

            if(quantity_adult_flight < quantity_infant_flight){
               quantity_infant_flight = quantity_adult_flight;
               $('#infant_flight').val(quantity - 1);
               $('#infant_flight1').val(quantity - 1);
            }
        }

        if (quantity_adult_flight+quantity_child_flight == 9){
            document.getElementById("left-minus-adult-flight").disabled = false;
            document.getElementById("right-plus-adult-flight").disabled = true;
            document.getElementById("right-plus-child-flight").disabled = true;
            document.getElementById("left-minus-adult-flight1").disabled = false;
            document.getElementById("right-plus-adult-flight1").disabled = true;
            document.getElementById("right-plus-child-flight1").disabled = true;
            if (quantity_child_flight > 0){
                document.getElementById("left-minus-child-flight").disabled = false;
                document.getElementById("left-minus-child-flight1").disabled = false;
            }
        }
        else{
            document.getElementById("right-plus-child-flight").disabled = false;
            document.getElementById("right-plus-child-flight1").disabled = false;
            if (quantity_child_flight > 0){
                document.getElementById("left-minus-child-flight").disabled = false;
                document.getElementById("left-minus-child-flight1").disabled = false;
            }

            if (quantity_adult_flight == 1){
                document.getElementById("left-minus-adult-flight").disabled = true;
                document.getElementById("right-plus-adult-flight").disabled = false;
                document.getElementById("left-minus-adult-flight1").disabled = true;
                document.getElementById("right-plus-adult-flight1").disabled = false;
            }
            else{
                document.getElementById("right-plus-adult-flight").disabled = false;
                document.getElementById("right-plus-adult-flight1").disabled = false;
            }
        }

        if (quantity_adult_flight == quantity_infant_flight){
            document.getElementById("right-plus-infant-flight").disabled = true;
            document.getElementById("right-plus-infant-flight1").disabled = true;
        }

    }else if(type == 'child'){
        var quantity = parseInt($('#child_flight').val());

        if(quantity > 0){
            $('#child_flight').val(quantity - 1);
            $('#child_flight1').val(quantity - 1);
            quantity_child_flight = quantity - 1;
        }

        if (quantity_adult_flight+quantity_child_flight != 9){
            document.getElementById("right-plus-adult-flight").disabled = false;
            document.getElementById("right-plus-child-flight").disabled = false;
            document.getElementById("right-plus-adult-flight1").disabled = false;
            document.getElementById("right-plus-child-flight1").disabled = false;

            if (quantity_adult_flight == 1){
                document.getElementById("left-minus-adult-flight").disabled = true;
                document.getElementById("left-minus-adult-flight1").disabled = true;
            }
            if (quantity_child_flight > 0){
                document.getElementById("left-minus-child-flight").disabled = false;
                document.getElementById("left-minus-child-flight1").disabled = false;
            }
            else{
                document.getElementById("left-minus-child-flight").disabled = true;
                document.getElementById("left-minus-child-flight1").disabled = true;
            }
        }

    }else if(type == 'infant'){
        var quantity = parseInt($('#infant_flight').val());

        if(quantity > 0){
            $('#infant_flight').val(quantity - 1);
            $('#infant_flight1').val(quantity - 1);
            quantity_infant_flight = quantity - 1;
        }

        if (quantity_infant_flight == 0){
            document.getElementById("left-minus-infant-flight").disabled = true;
            document.getElementById("right-plus-infant-flight").disabled = false;
            document.getElementById("left-minus-infant-flight1").disabled = true;
            document.getElementById("right-plus-infant-flight1").disabled = false;
        }
        else{
            document.getElementById("right-plus-infant-flight").disabled = false;
            document.getElementById("right-plus-infant-flight1").disabled = false;
        }
    }

    $('#show_total_pax_flight').text(quantity_adult_flight + " Adult, " + quantity_child_flight + " Child, " +quantity_infant_flight + " Infant");
    $('#show_total_pax_flight1').text(quantity_adult_flight + " Adult, " + quantity_child_flight + " Child, " +quantity_infant_flight + " Infant");

}

function airline_switch(val){
    if(val == undefined){
        var temp = document.getElementById("origin_id_flight").value;
        document.getElementById("origin_id_flight").value = document.getElementById("destination_id_flight").value;
        document.getElementById("destination_id_flight").value = temp;
    }else{
        var temp = document.getElementById("origin_id_flight"+val).value;
        document.getElementById("origin_id_flight"+val).value = document.getElementById("destination_id_flight"+val).value;
        document.getElementById("destination_id_flight"+val).value = temp;

    }

}

function search_airport(val){
    clearTimeout(myVar);
    myVar = setTimeout(function() {
       find = '';
       if(val == 'origin'){
           find = document.getElementById('origin_id_flight').value.toLowerCase();
           document.getElementById("airline_origin_name").innerHTML = '';
       }else if(val == 'destination'){
           find = document.getElementById('destination_id_flight').value.toLowerCase();
           document.getElementById("airline_destination_name").innerHTML = '';
       }
       if(find.length>1){
           text = '';
           airline_destination.forEach((obj)=> {
             if(obj.name.toString().toLowerCase().search(find) !== -1 || obj.city.toString().toLowerCase().search(find) !== -1 || obj.code.toString().toLowerCase().search(find) !== -1){
               node = document.createElement("div");
               node.innerHTML = `<option value="`+obj.name+' - '+obj.city+' ('+obj.code+`)">`+obj.code+`</option>`;
               if(val == 'origin')
                   document.getElementById("airline_origin_name").appendChild(node);
               else if(val == 'destination')
                   document.getElementById("airline_destination_name").appendChild(node);
             }
           });
       }
    }, 500);
}

function change_filter(type, value){
    var check = 0;
    if(type == 'airline'){
        carrier_code[value].status = !carrier_code[value].status;
        document.getElementById("checkbox_airline"+value).checked = carrier_code[value].status;
        document.getElementById("checkbox_airline2"+value).checked = carrier_code[value].status;
    }else if(type == 'departure'){
        if(value == 0)
            for(i in departure_list){
                departure_list[i].status = false
                document.getElementById("checkbox_departure_time"+i).checked = departure_list[i].status;
                document.getElementById("checkbox_departure_time2"+i).checked = departure_list[i].status;
            }
        else{
            departure_list[0].status = false;
            document.getElementById("checkbox_departure_time0").checked = false;
            document.getElementById("checkbox_departure_time20").checked = false;
        }
        departure_list[value].status = !departure_list[value].status;
        for(i in departure_list){
            if(departure_list[i].status == true)
                check = 1;
        }
        if(check == 0)
            departure_list[value].status = !departure_list[value].status;
        document.getElementById("checkbox_departure_time"+value).checked = departure_list[value].status;
        document.getElementById("checkbox_departure_time2"+value).checked = departure_list[value].status;
    }else if(type == 'arrival'){
        arrival_list
        if(value == 0)
            for(i in arrival_list){
                arrival_list[i].status = false
                document.getElementById("checkbox_arrival_time"+i).checked = arrival_list[i].status;
                document.getElementById("checkbox_arrival_time2"+i).checked = arrival_list[i].status;
            }
        else{
            arrival_list[0].status = false;
            document.getElementById("checkbox_arrival_time0").checked = false;
            document.getElementById("checkbox_arrival_time20").checked = false;
        }
        arrival_list[value].status = !arrival_list[value].status;
        for(i in arrival_list){
            if(arrival_list[i].status == true)
                check = 1;
        }
        if(check == 0)
            arrival_list[value].status = !arrival_list[value].status;
        document.getElementById("checkbox_arrival_time"+value).checked = arrival_list[value].status;
        document.getElementById("checkbox_arrival_time2"+value).checked = arrival_list[value].status;
    }else if(type == 'price'){
        //still no
    }else if(type == 'transit'){
//        transit_list
        transit_list[value].status = !transit_list[value].status;
        document.getElementById("checkbox_transit"+value).checked = transit_list[value].status;
        document.getElementById("checkbox_transit2"+value).checked = transit_list[value].status;
    }else if(type == 'transit_duration'){
//        transit_duration
        transit_duration_list[value].status = !transit_duration_list[value].status;
        document.getElementById("checkbox_transit_duration"+value).checked = transit_duration_list[value].status;
        document.getElementById("checkbox_transit_duration2"+value).checked = transit_duration_list[value].status;
    }
    filtering('filter');
}

function time_check(data){
    var temp_data = [];
    var check = 0;
    data.forEach((obj1)=> {
        check = 0;
        departure_list.forEach((obj)=> {
            if(obj.status == true && obj.value == 'All' && check == 0){
                check = 1;
            }else if(obj.status == true && check == 0){
                time = obj.value.split(' - ');
                for(i in time)
                    time[i] = time[i].split('.')[0]*3600 + time[i].split('.')[1]*60;
                data_time = obj1.departure_date.split(' - ');
                data_time = data_time[1].split(':')[0]*3600 + data_time[1].split(':')[1]*60;
                if(time[0]<=data_time && time[1]>=data_time){
                    check = 1;
                }
            }
        });
        if(check == 1){
            arrival_list.forEach((obj)=> {
                if(obj.status == true && obj.value == 'All' && check == 1){
                    temp_data.push(obj1);
                    check = 2;
                }else if(obj.status == true && check == 1){
                    time = obj.value.split(' - ');
                    for(i in time)
                        time[i] = time[i].split('.')[0]*3600 + time[i].split('.')[1]*60;
                    data_time = obj1.arrival_date.split(' - ');
                    data_time = data_time[1].split(':')[0]*3600 + data_time[1].split(':')[1]*60;
                    if(time[0]<=data_time && time[1]>=data_time){
                        temp_data.push(obj1);
                        check = 2;
                    }
                }
            });
        }
        check = 0;

    });
    return temp_data;
}

function filtering(type){
   sort_key = 0;
   scroll_add_airline = true;
   var temp_data = [];
   data = airline_data;
   if(type == 'filter'){
       check_carrier_code = 0;
       check_transit_list = 0;
       check_transit_duration = 0;
       for(i in carrier_code)
           if(carrier_code[i].status == true)
               check_carrier_code = 1;

       for(i in transit_list)
           if(transit_list[i].status == true)
               check_transit_list = 1;

       for(i in transit_duration_list)
           if(transit_duration_list[i].status == true)
               check_transit_duration = 1;

       data = time_check(data);
       var check = 0;
       if(check_carrier_code == 1){
           //pick airline
           data.forEach((obj)=> {
               check = 0;
               obj.segments.forEach((segments)=> {
                   carrier_code.forEach((obj1)=> {
                       if(segments.carrier_code == obj1.code && obj1.status==true){
                           check = 1;
                       }
                   });
               });
               if(check != 0){
                   temp_data.push(obj);
               }
           });
           data = temp_data;
           temp_data = [];
       }

       if(check_transit_list== 1){
           data.forEach((obj)=> {
               check = 0;
               transit_list.forEach((obj1)=> {
                   if(obj1.status == true && check == 0){
                       transit = 0;
                       if(obj1.value == 'Direct')
                           transit = 0;
                       else if(obj1.value == '1')
                           transit = 1;
                       else
                           transit = 2;
                       if(transit != 2){
                           if(obj.transit_count == transit){
                               temp_data.push(obj);
                               check = 1;
                           }
                       }else
                           if(obj.transit_count >= transit){
                               temp_data.push(obj);
                               check = 1;
                           }
                   }
               });
           });
           data = temp_data;
           temp_data = [];
       }
       if(check_transit_duration == 1){
           data.forEach((obj)=> {
               transit_time = 0;
               obj.segments.forEach((segments)=> {
                   time_segment = 0;
                   segment_time = segments.transit_duration.split(' ');

                   for(i in segment_time){
                       if(segment_time[i].substr(1,1) == 'd'){
                           time_segment += parseInt(segment_time[i]) * 86400;
                       }else if(segment_time[i].substr(1,1) == 'h'){
                           time_segment += parseInt(segment_time[i]) * 3600;
                       }else if(segment_time[i].substr(1,1) == 'm'){
                           time_segment += parseInt(segment_time[i]) * 60;
                       }else if(segment_time[i].substr(1,1) == 's'){
                           time_segment += parseInt(segment_time[i]);
                       }
                   }
                   if(transit_time < time_segment){
                       transit_time = time_segment;
                   }
               });
               check = 0;
               transit_duration_list.forEach((obj1)=> {
                   if(obj1.status == true && check == 0){
                       if(obj1.value == '12h+'){
                           if(transit_time >= 43200){
                               temp_data.push(obj);
                               check = 1;
                           }

                       }
                       else if(transit_time >= parseInt(obj1.value.split(' - ')[0])*3600 && transit_time <= parseInt(obj1.value.split(' - ')[1])*3600 && check == 0){
                           temp_data.push(obj);
                           check = 1;
                       }
                   }
               });
           });
           data = temp_data;
           temp_data = [];
       }
       //filter arrival departure
       if(airline_pick_list.length > 0){
            copy_data_json = JSON.parse(JSON.stringify(data));
            if(airline_request.departure[journey.length-1] == airline_request.departure[journey.length]){
                temp_data = [];
                for(i in copy_data_json){
                    if(parseInt(airline_pick_list[airline_pick_list.length-1].arrival_date.split(' - ')[1].split(':')[0])*60 + parseInt(airline_pick_list[airline_pick_list.length-1].arrival_date.split(' - ')[1].split(':')[1]) > parseInt(copy_data_json[i].departure_date.split(' - ')[1].split(':')[0])*60 + parseInt(copy_data_json[i].departure_date.split(' - ')[1].split(':')[1])){
                        copy_data_json[i].can_book_check_arrival_on_next_departure = false;
                    }else{
                        copy_data_json[i].can_book_check_arrival_on_next_departure = true;
                    }
                    temp_data.push(copy_data_json[i]);
                }
                data = temp_data;
                temp_data = [];
            }
       }
       sort();
   }else if(type == 'sort'){
       sort();
   }
}

function sort_button(value){
    sort_key = 0;
    scroll_add_airline = true;
    if(value == 'price'){
       if(sorting_value == '' || sorting_value == 'Lowest Price'){
           sorting_value = 'Highest Price';
           document.getElementById("img-sort-down-price").style.display = "none";
           document.getElementById("img-sort-up-price").style.display = "block";
       }else{
           sorting_value = 'Lowest Price';
           document.getElementById("img-sort-down-price").style.display = "block";
           document.getElementById("img-sort-up-price").style.display = "none";
       }
   }else if(value == 'departure'){
       if(sorting_value == '' || sorting_value == 'Earliest Departure'){
           sorting_value = 'Latest Departure';
           document.getElementById("img-sort-down-departure").style.display = "none";
           document.getElementById("img-sort-up-departure").style.display = "block";
       }else{
           sorting_value = 'Earliest Departure';
           document.getElementById("img-sort-down-departure").style.display = "block";
           document.getElementById("img-sort-up-departure").style.display = "none";
       }
   }else if(value == 'arrival'){
       if(sorting_value == '' || sorting_value == 'Earliest Arrival'){
           sorting_value = 'Latest Arrival';
           document.getElementById("img-sort-down-arrival").style.display = "none";
           document.getElementById("img-sort-up-arrival").style.display = "block";
       }else{
           sorting_value = 'Earliest Arrival';
           document.getElementById("img-sort-down-arrival").style.display = "block";
           document.getElementById("img-sort-up-arrival").style.display = "none";
       }
   }else{
       sorting_value = value;
   }
   filtering('filter');
}

function get_airline_recommendations_list(){
    airline_recommendations_list = [];
    airline_recommendations_journey = [];
    airline_recommendations_combo_list = [];
    airline_recommendations_dict = {};
    if(airline_pick_list.length != 0){
        for(i in recommendations_airline){
            check_recommendations_airline = 0;
            check_recommendations_airline_combo = true;
            for(j in recommendations_airline[i].journey_flight_refs){
                if(airline_pick_list.length > parseInt(j)){
                    //check
                    if(airline_pick_list[j].journey_ref_id == recommendations_airline[i].journey_flight_refs[j].journey_ref_id){
                        for(k in recommendations_airline[i].journey_flight_refs[j].fare_flight_refs){
                            if(airline_pick_list[j].segments[k].fares[airline_pick_list[j].segments[k].fare_pick].fare_ref_id != recommendations_airline[i].journey_flight_refs[j].fare_flight_refs[k].fare_ref_id){
                                check_recommendations_airline_combo = false;
                                break;
                            }
                        }
                    }else{
                        check_recommendations_airline = 1;
                        break;
                    }
                    //salah break
                }else if(check_recommendations_airline == 0){
                    if(check_recommendations_airline_combo){
                        if(airline_recommendations_dict.hasOwnProperty(recommendations_airline[i].journey_flight_refs[j].journey_ref_id) == false)
                            airline_recommendations_dict[recommendations_airline[i].journey_flight_refs[j].journey_ref_id] = [];
                        airline_recommendations_dict[recommendations_airline[i].journey_flight_refs[airline_pick_list.length].journey_ref_id].push({
                            "segments": recommendations_airline[i].journey_flight_refs[airline_pick_list.length].fare_flight_refs,
                            "service_charge_summary": recommendations_airline[i].service_charge_summary,
                            "service_charges": recommendations_airline[i].service_charges
                        })
                        airline_recommendations_list.push(recommendations_airline[i].journey_flight_refs[j].journey_ref_id);
                        airline_recommendations_combo_list.push(check_recommendations_airline_combo);
                        airline_recommendations_journey.push(recommendations_airline[i]);
                        break;
                    }
                }else{
                    break;
                }
            }
        }
    }
}

function sort(){
    airline = JSON.parse(JSON.stringify(data));
    ticket_count = 0;
    var contain = 0;
    scroll_add_airline = false;
    if(sort_key == 0)
        document.getElementById("airlines_ticket").innerHTML = '';
    if (airline.length == 0 && count == airline_choose && airline_choose != 0){
        text = '';
        text += `
        <div style="text-align:center">
            <img src="/static/tt_website_rodextrip/images/nofound/no-airlines.png" style="width:70px; height:70px;" alt="Not Found Airlines" title="" />
            <br/>
        </div>
        <center><div class="alert alert-warning" role="alert" style="margin-top:15px; border:1px solid #cdcdcd;"><h6><i class="fas fa-search-minus"></i> Oops! Sorry no ticket for flight `+ parseInt(counter_search).toString()+` Please try another flight. </h6></div></center>`;
        var node = document.createElement("div");
        node.innerHTML = text;
        document.getElementById("airlines_ticket").appendChild(node);
        node = document.createElement("div");
    }else{
        //show data
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
        for(var i = 0; i < airline.length-1; i++) {
            for(var j = i+1; j < airline.length; j++) {
                if(sorting == ''){
                    if(airline[j].segments[0].carrier_code == 'SQ' || airline[j].segments[0].carrier_code == 'MI'){
                        var temp = airline[i];
                        airline[i] = airline[j];
                        airline[j] = temp;
                    }
                }else if(sorting == 'Lowest Price'){
                    if(airline[i].total_price > airline[j].total_price){
                        var temp = airline[i];
                        airline[i] = airline[j];
                        airline[j] = temp;
                    }
                }else if(sorting == 'Highest Price'){
                    if(airline[i].total_price < airline[j].total_price){
                        var temp = airline[i];
                        airline[i] = airline[j];
                        airline[j] = temp;
                    }
                }else if(sorting == 'Earliest Departure'){
                    if(airline[i].departure_date.split(' - ')[1] > airline[j].departure_date.split(' - ')[1]){
                        var temp = airline[i];
                        airline[i] = airline[j];
                        airline[j] = temp;
                    }
                }else if(sorting == 'Latest Departure'){
                    if(airline[i].departure_date.split(' - ')[1] < airline[j].departure_date.split(' - ')[1]){
                        var temp = airline[i];
                        airline[i] = airline[j];
                        airline[j] = temp;
                    }
                }else if(sorting == 'Earliest Arrival'){
                    if(airline[i].arrival_date.split(' - ')[1] > airline[j].arrival_date.split(' - ')[1]){
                        var temp = airline[i];
                        airline[i] = airline[j];
                        airline[j] = temp;
                    }
                }else if(sorting == 'Latest Arrival'){
                    if(airline[i].arrival_date.split(' - ')[1] < airline[j].arrival_date.split(' - ')[1]){
                        var temp = airline[i];
                        airline[i] = airline[j];
                        airline[j] = temp;
                    }
                }
                if(parseInt(airline[i].available_count) == 0){
                    var temp = airline[i];
                    airline[i] = airline[j];
                    airline[j] = temp;
                }
            }
        }
        //SORT AVAILABLE
        for(var i = airline.length-1; i >= 0; i--) {
            if(airline[i].can_book == false && airline_pick_list.length == 0 || airline[i].can_book_check_arrival_on_next_departure == false && airline_pick_list.length > 0 || airline[i].available_count < parseInt(airline_request.adult + airline_request.child + airline_request.infant)){
                for(j=i;j<airline.length-1;j++){
                    if(airline[j+1].can_book == false && airline_pick_list.length == 0 || airline[j+1].can_book_check_arrival_on_next_departure == false && airline_pick_list.length > 0 || airline[j+1].available_count < parseInt(airline_request.adult + airline_request.child + airline_request.infant)){
                        break;
                    }else{
                        temp = airline[j];
                        airline[j] = airline[j+1];
                        airline[j+1] = temp
                    }
                }
            }
        }


        airline_data_filter = airline;
        //change sort render

        text = '';
        var first = sort_key * 10;
        var last = (sort_key+1) * 10;
        if(sort_key == 0)
            text += `<div style="background-color:`+color+`; padding:10px;">
                    <h6 style="color:`+text_color+`;">Choose Flight `+counter_search+`</h6>
                </div>`;
        get_airline_recommendations_list();
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
        if(airline_pick_list.length != airline_request.origin.length){
            for(i in airline){
               if(airline[i].origin == airline_request.origin[counter_search-1].split(' - ')[0] && airline[i].destination == airline_request.destination[counter_search-1].split(' - ')[0] && airline_request.departure[counter_search-1] == airline[i].departure_date.split(' - ')[0]){
                   if(airline_pick_list.length == 0 || airline_pick_list.length != 0 && airline_recommendations_list.length == 0 && airline[i].journey_ref_id == '' || airline_recommendations_dict.hasOwnProperty(airline[i].journey_ref_id)){
                       ticket_count++;
                       if(ticket_count >= first && ticket_count < last){
                           contain++;
                           check_flight_type = 1;
                           check_flight_departure = 0;
                           var price = 0;
                           text += `
                           <div class="search-box-result" id="journey`+i+`">
                               <span class="copy_journey" hidden>`+i+`</span>
                               <div class="row" style="padding:10px;">
                                   <div class="col-xs-10">`;
                                   if(airline_recommendations_dict.hasOwnProperty(airline[i].journey_ref_id))
                                        text+=`<label style="background:`+color+`; color:`+text_color+`;padding:5px 10px;">Combo Price</label>`;
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
                                   <div class="col-xs-2" style="padding:0px 10px 15px 15px;">`;
                                       if(airline[i].is_combo_price == true){
                                           text+=`<span class="copy_combo_price" style="float:left; font-weight: bold; border-bottom:2px solid `+color+`;">Combo Price</span>`;
                                       }
                                       text += `
                                       <label class="check_box_custom" style="float:right;">
                                           <span class="span-search-ticket"></span>
                                           <input type="checkbox" class="copy_result" name="copy_result`+i+`" id="copy_result`+i+`" onchange="checkboxCopyBox(`+i+`);"/>
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
                                                <div class="row mt-2">
                                                    <div class="col-lg-2" style="padding-top:10px;">
                                                        <span class="copy_po" hidden>`+j+`</span>`;
                                                        text+=`<div class="row"><div class="col-lg-12" id="copy_provider_operated`+i+``+j+`">`;
                                                        if(j != 0){
                                                            text+=`<hr style="margin-top:unset; margin-bottom:unset;"/>`;
                                                        }
                                                        if(airline[i].segments[j].carrier_code != airline[i].segments[j].operating_airline_code && airline[i].segments[j].operating_airline_code != ''){
                                                            try{
                                                                text += `<span class="copy_operated_by" style="float:left; font-weight: 700; font-size:12px;">Operated by `+airline_carriers[0][airline[i].segments[j].operating_airline_code].name+`</span><br/>`;

                                                            }catch(err){
                                                                text += `<span class="copy_operated_by" style="float:left; font-weight: 700; font-size:12px;">Operated by `+airline[i].segments[j].operating_airline_code+`</span><br/>`;
                                                            }
                                                        }
                                                        text+=`
                                                            <span class="copy_carrier_provider" style="font-weight:500; font-size:12px;">`+airline_carriers[0][airline[i].segments[j].carrier_code].name+`</span><br/>
                                                            <img data-toggle="tooltip" alt="`+airline_carriers[0][airline[i].segments[j].carrier_code].name+`" style="width:50px; height:50px;margin-bottom:5px;" title="`+airline_carriers[0][airline[i].segments[j].carrier_code].name+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+airline[i].segments[j].carrier_code+`.png"><br/>
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
                                                                        <img src="/static/tt_website_rodextrip/img/icon/airlines-01.png" style="width:20px; height:20px;"/>
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
                                                                <span class="copy_transit">Transit: `+airline[i].segments[j].transit_count+`</span>`;

                                                        text+=`
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
                                            <div class="row mt-2">
                                                <div class="col-lg-2">`;
                                                    for(j in airline[i].segments){
                                                        //ganti sini
                                                        flight_number = parseInt(j) + 1;
                                                        text+=`
                                                        <div class="row"><div class="col-lg-12" id="copy_provider_operated`+i+``+j+`">
                                                        <span class="copy_po" hidden>`+j+`</span>`;
                                                        if(airline[i].segments[j].carrier_code != airline[i].segments[j].operating_airline_code && airline[i].segments[j].operating_airline_code != ''){
                                                            if(j != 0){
                                                                text+=`<hr/>`;
                                                            }
                                                            try{
                                                                text += `<span class="copy_operated_by" style="float:left; font-weight: 700; font-size:12px;">Operated by `+airline_carriers[0][airline[i].segments[j].operating_airline_code].name+`</span><br/>`;
                                                            }catch(err){
                                                                text += `<span class="copy_operated_by" style="float:left; font-weight: 700; font-size:12px;">Operated by `+airline[i].segments[j].operating_airline_code+`</span><br/>`;
                                                            }
                                                            try{
                                                                text+=`
                                                                <span class="copy_carrier_provider" style="font-weight:500; font-size:12px;">`+airline_carriers[0][airline[i].segments[j].carrier_code].name+`</span><br/>
                                                                <img data-toggle="tooltip" style="width:50px; height:50px;" alt="`+airline_carriers[0][airline[i].segments[j].carrier_code].name+`" title="`+airline_carriers[0][airline[i].segments[j].carrier_code].name+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+airline[i].segments[j].carrier_code+`.png"><br/>`;
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
                                                                <span class="copy_carrier_provider" style="font-weight:500; font-size:12px;">`+airline_carriers[0][airline[i].segments[j].carrier_code].name+`</span><br/>
                                                                <img data-toggle="tooltip" style="width:50px; height:50px;" alt="`+airline_carriers[0][airline[i].segments[j].carrier_code].name+`" title="`+airline_carriers[0][airline[i].segments[j].carrier_code].name+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+airline[i].segments[j].carrier_code+`.png"><br/>`;
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
                                                        //    <span class="copy_carrier_provider" style="font-weight:500; font-size:12px;">`+airline_carriers[0][airline[i].carrier_code_list[j]].name+`</span><br/>
                                                        //    <img data-toggle="tooltip" alt="`+airline_carriers[0][airline[i].carrier_code_list[j]].name+`" style="width:50px; height:50px;" title="`+airline_carriers[0][airline[i].carrier_code_list[j]].name+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+airline[i].carrier_code_list[j]+`.png"><br/>`;
                                                        //}
                                                    text+=`
                                                </div>
                                                <div class="col-lg-10">
                                                    <div class="row">
                                                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-6">
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
                                                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-6 mb-2">
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
                                                    <div class="col-lg-4 col-md-4 col-sm-4">
                                                        <div class="row">
                                                            <div class="col-xs-12">
                                                                <i class="fas fa-plane"></i> `;
                                                                if(airline[i].transit_count==0){
                                                                    text+=`<span class="copy_transit" style="font-weight:500;">Direct</span>`;
                                                                }
                                                                else{
                                                                    text+=`<span class="copy_transit" style="font-weight:500;">Transit: `+airline[i].transit_count+`</span>`;
                                                                }
                                                                text+=`
                                                            </div>
                                                            <div class="col-xs-12">
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
                                                            <div class="col-xs-12">`;
                                                            if(airline[i].available_count != 0){
                                                                if(airline[i].available_count > 9){
                                                                    text += `<img src="/static/tt_website_rodextrip/img/icon/seat.png" style="height:16px; width:auto;"/><span>`+airline[i].available_count+` seats available</span>`;
                                                                }else{
                                                                    text += `<img src="/static/tt_website_rodextrip/img/icon/seat.png" style="height:16px; width:auto;"/><span style="color:#fc2617;">`+airline[i].available_count+` seats left </span>`;
                                                                }
                                                                //if(choose_airline != null && choose_airline == airline[i].sequence && airline_request.direction != 'MC')
                                                                //text+=`<input type='button' style="margin:10px;" id="departjourney`+i+`" class="primary-btn-custom-un choose_selection_ticket_airlines_depart" value="Chosen" onclick="get_price_itinerary(`+i+`)" sequence_id="0"/>`;
                                                                //else
                                                            }
                                                            text+=`
                                                            </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>`;
                                    }

                                   text+=`
                                   <div class="col-lg-6 col-md-6 col-sm-6" style="padding-bottom:10px; margin: auto;">`;

                                   if(provider_list_data[airline[i].provider].is_post_issued_reschedule)
                                        text+=`
                                            <span style="font-weight:bold; padding-right:5px;"><i class="fas fa-check-circle" style="color:#4f9c64;"></i> Reschedule</span>`;
//                                   if(provider_list_data[airline[i].provider].is_post_issued_cancel)
//                                        text+=`
//                                            <span style="font-weight:bold; padding-right:5px;"><i class="fas fa-check-circle" style="color:#4f9c64;"></i> Refund</span>`;

                                   text+=`
                                       <a id="detail_button_journey0`+i+`" data-toggle="collapse" data-parent="#accordiondepart" onclick="show_flight_details(`+i+`);" href="#detail_departjourney`+i+`" style="color: #237395; text-decoration: unset;" aria-expanded="true">
                                           <span class="detail-link" style="font-weight: bold; display:none;" id="flight_details_up`+i+`"> Flight details <i class="fas fa-chevron-up" style="font-size:14px;"></i></span>
                                            <span class="detail-link" style="font-weight: bold; display:block;" id="flight_details_down`+i+`"> Flight details <i class="fas fa-chevron-down" style="font-size:14px;"></i></span>
                                       </a>`;

                                   text+=`</div>
                                   <div class="col-lg-6 col-md-6 col-sm-6 mt-2" style="text-align:right;">`;
                                       text+=`<span id="fare_no_discount`+i+`" class="basic_fare_field" style="text-decoration: line-through;color:#cdcdcd;"></span><br/>`;
                                       text+=`<span id="fare`+i+`" class="basic_fare_field copy_price price_template"></span><br/>`;

                                       if(provider_list_data.hasOwnProperty(airline[i].provider) == true && provider_list_data[airline[i].provider].description != '')
                                            text += `<span style="margin-right:5px;">`+provider_list_data[airline[i].provider].description+`</span>`;
                                       if(airline[i].can_book == true && airline[i].can_book_check_arrival_on_next_departure == true){
                                           text+=`<input type='button' style="margin:5px 0px 0px 0px;" id="departjourney`+i+`" class="primary-btn-custom choose_selection_ticket_airlines_depart" value="Choose" onclick="get_price_itinerary(`+i+`)" sequence_id="0"/>`;
                                       }else if(airline[i].can_book == true && airline[i].can_book_check_arrival_on_next_departure == false)
                                           text+=`
                                            <input type='button' style="margin:5px 0px 0px 0px;" id="departjourney`+i+`" class="primary-btn-custom choose_selection_ticket_airlines_depart" value="Choose" onclick="alert_message_swal('Sorry, arrival time you pick does not match with this journey!');" sequence_id="0"/>`;
                                       else{
                                           text+=`<input type='button' style="margin:5px 0px 0px 0px;" id="departjourney`+i+`" class="primary-btn-custom choose_selection_ticket_airlines_depart" value="Sold Out" onclick="" disabled sequence_id="0"/>`;
                                       }
                                       text+=`
                                   </div>`;
                               text+=`
                               </div>

                               <div id="detail_departjourney`+i+`" class="panel-collapse collapse in" aria-expanded="true" style="display:none;">`;
                                   for(j in airline[i].segments){
                                       text+=`<div id="copy_segments_details`+i+``+j+`">
                                       <span class="copy_segments" hidden>`+i+``+j+`</span>`;
                                       if(airline[i].segments[j].transit_duration != ''){
                                           text += `<div class="col-lg-12" style="text-align:center;padding:0px 15px;"><div style="border:1px solid #cdcdcd; background:#f7f7f7; padding:15px; border-radius:14px; color:`+color+`;"><i class="fas fa-clock"></i><span style="font-weight:500" class="copy_transit_details">Transit Duration: `;
                                           if(airline[i].segments[j].transit_duration.split(':')[0] != '0')
                                               text+= airline[i].segments[j].transit_duration.split(':')[0] + 'd ';
                                           if(airline[i].segments[j].transit_duration.split(':')[1] != '0')
                                               text+= airline[i].segments[j].transit_duration.split(':')[1] + 'h ';
                                           if(airline[i].segments[j].transit_duration.split(':')[2] != '0')
                                               text+= airline[i].segments[j].transit_duration.split(':')[2] + 'm ';
                                           text+=`</span></div></div><br/>`;
                                       }else{
                                           text += `<span class="copy_transit_details" hidden>0</span>`;
                                       }
                                       var depart = 0;
                                       if(airline[i].segments[j].origin == airline_request.destination[counter_search-1].split(' - ')[0])
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
                                       if(airline[i].segments[j].carrier_code != airline[i].segments[j].operating_airline_code && airline[i].segments[j].operating_airline_code != ''){
                                            text+=`
                                           <span style="font-weight: 500; font-size:12px;" class="copy_carrier_provider_details">`+airline_carriers[0][airline[i].segments[j].operating_airline_code].name+`</span><br/>
                                           <span class="carrier_code_template">`+airline[i].segments[j].carrier_name+`</span><br/>
                                           <img data-toggle="tooltip" alt="`+airline[i].segments[j].operating_airline_code+`" style="width:50px; height:50px;" title="`+airline_carriers[0][airline[i].segments[j].operating_airline_code].name+`" src="`+static_path_url_server+`/public/airline_logo/`+airline[i].segments[j].operating_airline_code+`.png"><br/>`;
                                       }else{
                                            text+=`
                                           <span style="font-weight: 500; font-size:12px;" class="copy_carrier_provider_details">`+airline_carriers[0][airline[i].segments[j].carrier_code].name+`</span><br/>
                                           <span class="carrier_code_template">`+airline[i].segments[j].carrier_name+`</span><br/>
                                           <img data-toggle="tooltip" alt="`+airline[i].segments[j].operating_airline_code+`" style="width:50px; height:50px;" title="`+airline_carriers[0][airline[i].segments[j].carrier_code].name+`" src="`+static_path_url_server+`/public/airline_logo/`+airline[i].segments[j].carrier_code+`.png"><br/>`;
                                       }
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
                                               <div class="col-lg-12 mt-2 mb-2">
                                                   <div class="timeline-wrapper">
                                                       <ul class="StepProgress">
                                                           <li class="StepProgress-item is-done">
                                                               <div>
                                                                   <span class="copy_legs_date_depart" style="font-weight:600; font-size:16px;">`+airline[i].segments[j].legs[k].departure_date.split(' - ')[1]+`</span><br/>
                                                                   <span class="copy_legs_date_depart">`+airline[i].segments[j].legs[k].departure_date.split(' - ')[0]+`</span>
                                                               </div>
                                                               <div>
                                                                   <span style="font-weight:500;" class="legs_word_break copy_legs_depart">`+airline[i].segments[j].legs[k].origin_city+` - `+airline[i].segments[j].legs[k].origin_name+` (`+airline[i].segments[j].legs[k].origin+`)</span>`;
                                                                if(airline[i].segments[j].origin_terminal != ''){
                                                                    text+=`<span style="font-size:13px; font-weight:500;">Terminal: `+airline[i].segments[j].origin_terminal+`</span><br/>`;
                                                                }else{
                                                                    text+=`<span style="font-size:13px; font-weight:500;">Terminal: -</span><br/>`;
                                                                }
                                                                text+=`
                                                              </div>
                                                           </li>
                                                           <li class="StepProgress-item is-end">
                                                               <div>
                                                                   <span class="copy_legs_date_arr" style="font-weight:600; font-size:16px;">`+airline[i].segments[j].legs[k].arrival_date.split(' - ')[1]+`</span><br/>
                                                                   <span class="copy_legs_date_arr">`+airline[i].segments[j].legs[k].arrival_date.split(' - ')[0]+`</span>
                                                               </div>
                                                               <div style="width:84%;">
                                                                   <span style="font-weight:500;" class="copy_legs_arr">`+airline[i].segments[j].legs[k].destination_city+` - `+airline[i].segments[j].legs[k].destination_name+` (`+airline[i].segments[j].legs[k].destination+`)</span><br/>`;

                                                                if(airline[i].segments[j].destination_terminal != ''){
                                                                    text+=`<span style="font-size:13px; font-weight:500;">Terminal: `+airline[i].segments[j].destination_terminal+`</span><br/>`;
                                                                }else{
                                                                    text+=`<span style="font-size:13px; font-weight:500;">Terminal: -</span><br/>`;
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
                                           text+=`</span><br/>`;
                                           if(airline[i].segments[j].carrier_type_name != '')
                                               text += `<span style="font-weight:500;"><i class="fas fa-plane"></i> `+airline[i].segments[j].carrier_type_name+`</span><br/>`;
                                           else if(airline[i].segments[j].carrier_type_code != '')
                                               text += `<span style="font-weight:500;"><i class="fas fa-plane"></i> `+airline[i].segments[j].carrier_type_code+`</span><br/>`;
                                           for(k in airline[i].segments[j].fares){
                                               if(k == 0){
                                                   for(l in airline[i].segments[j].fares[k].fare_details){
                                                       text+=`
                                                       <div id="copy_fares_details`+i+``+j+``+k+``+l+`">
                                                       <span class="copy_fares" hidden>`+i+``+j+``+k+``+l+`</span>`;
                                                       if(airline[i].segments[j].fares[k].fare_details[l].detail_type.includes('BG')){
                                                            text+=`<i class="fas fa-suitcase"></i><span style="font-weight:500;" class="copy_suitcase_details"> `+airline[i].segments[j].fares[k].fare_details[l].amount+` `+airline[i].segments[j].fares[k].fare_details[l].unit+`</span><br/>`;
                                                       }
                                                       else if(airline[i].segments[j].fares[k].fare_details[l].detail_type == 'ML'){
                                                            text+=`<i class="fas fa-utensils"></i><span style="font-weight:500;" class="copy_utensils_details"> `+airline[i].segments[j].fares[k].fare_details[l].amount+` `+airline[i].segments[j].fares[k].fare_details[l].unit+`</span><br/>`;
                                                       }else{
                                                            text+=`<span style="font-weight:500;" class="copy_others_details">`+airline[i].segments[j].fares[k].fare_details[l].amount+` `+airline[i].segments[j].fares[k].fare_details[l].unit+`</span><br/>`;
                                                       }
                                                       text+=`</div>`;
                                                   }
                                                   break;
                                               }
                                           }
                                       text+=`</div>
                                       <div class="col-lg-12">`;
                                           text+=`
                                           <div class="row">
                                               <div class="col-lg-12">
                                                    <button style="text-align:left; width:unset; line-height:20px; font-size:13px; height:50px;" id="show_choose_seat`+i+``+j+`" type="button" class="form-control primary-btn-white dropdown-toggle" data-toggle="dropdown">
                                                        <img src="/static/tt_website_rodextrip/img/icon/seat.png" style="height:16px; width:auto;"> <span id="choose_seat_span`+i+``+j+`">Choose Seat Class</span>
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
                                                                        if(j == airline[i].segments.length - 1 && airline_pick_list.length == airline_request.origin.length - 1 && airline_pick_list != 0){
                                                                           if(airline_request.origin.length == airline_pick_list.length + 1 && airline_recommendations_dict.hasOwnProperty(airline[i].journey_ref_id)){
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
                                                                        else if(airline_pick_list.length != airline_request.origin.length-1 || airline_request.origin.length == 1){
                                                                            for(l in airline[i].segments[j].fares[k].service_charge_summary)
                                                                                if(airline[i].segments[j].fares[k].service_charge_summary[l].pax_type == 'ADT'){
                                                                                    for(m in airline[i].segments[j].fares[k].service_charge_summary[l].service_charges)
                                                                                        if(airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'tax' || airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'fare' || airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'roc')
                                                                                            total_price+= airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].amount;
                                                                                    break;
                                                                            }
                                                                        }
                                                                        text+=`<div class="col-xs-12">`;
                                                                        if(airline_request.adult + airline_request.child > airline[i].segments[j].fares[k].available_count){
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
                                                                               <span class="checkmark-radio"></span>
                                                                               </label></div>`;

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
                                                                               <input onclick="change_fare(`+i+`,`+j+`,`+k+`); change_seat_span(`+i+`, `+j+`, '`+temp_seat_name+`');" id="journey`+i+`segment`+j+`fare" name="journey`+i+`segment`+j+`fare" type="radio" value="`+k+`"`;
                                                                               if(fare_check == 0){
                                                                                    text+=` checked="checked"`;
                                                                                    airline[i].segments[j].fare_pick = parseInt(k);
                                                                               }
                                                                               text+=`>
                                                                               <span class="checkmark-radio"></span>`;

                                                                           fare_check = 1;
                                                                           id_price_segment = `journey`+i+`segment`+j+`fare`+k;
                                                                           if(total_price == 0){
                                                                               if(airline_request.adult + airline_request.child > airline[i].segments[j].fares[k].available_count){
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
                                                                           text+=`</label></div></span>`;
                                                                        }
                                                                    }
                                                               }else{
                                                                    //bukan combo
                                                                    if(airline[i].segments[j].fares[k].service_charge_summary.length > 0)
                                                                        total_price = airline[i].segments[j].fares[k].service_charge_summary[0].total_price / airline[i].segments[j].fares[k].service_charge_summary[0].pax_count;
                                                                    else
                                                                        total_price = 0;
                                                                    text+=`<div class="col-xs-12">`;
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
                                                                       text+=`</span> / <span>`+airline[i].segments[j].fares[k].available_count;
                                                                       if(airline_request.adult + airline_request.child > airline[i].segments[j].fares[k].available_count)
                                                                            text+= `<input onclick="" disabled id="journey`+i+`segment`+j+`fare" name="journey`+i+`segment`+j+`fare" type="radio" value="`+k+`"`;
                                                                       text+=`
                                                                       <input onclick="change_fare(`+i+`,`+j+`,`+k+`); change_seat_span(`+i+`, `+j+`, '`+temp_seat_name+`');" id="journey`+i+`segment`+j+`fare" name="journey`+i+`segment`+j+`fare" type="radio" value="`+k+`"`;
                                                                       if(fare_check == 0 && airline[i].segments[j].fares[k].available_count > airline_request.adult + airline_request.child){
                                                                            text+=` checked="checked"`;
                                                                            airline[i].segments[j].fare_pick = parseInt(k);
                                                                            fare_check = 1;
                                                                       }
                                                                       text+=`>
                                                                       <span class="checkmark-radio"></span>`;

                                                                   id_price_segment = `journey`+i+`segment`+j+`fare`+k;
                                                                   if(total_price == 0){
                                                                       if(airline_request.adult + airline_request.child > airline[i].segments[j].fares[k].available_count){
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
                                           </div><br/>`;
                                       text+=`</div>
                                       </div>
                                   </div>`;
                                   }
                                   text+=`
                               </div>
                           </div>`;
                           var node = document.createElement("div");
                           node.innerHTML = text;
                           document.getElementById("airlines_ticket").appendChild(node);
                           node = document.createElement("div");
                //                   document.getElementById('airlines_ticket').innerHTML += text;


                           for(j in airline[i].segments){
                                fare_check = 0;
                                for(k in airline[i].segments[j].fares){

                                   var temp_total_price = 0;
                                   if(j == airline[i].segments.length - 1 && airline_pick_list.length == airline_request.origin.length - 1 && airline_pick_list != 0){
                                       if(airline_request.origin.length == airline_pick_list.length + 1 && airline_recommendations_list.length != 0){
                                            check = 0;
                                            for(l in airline_recommendations_journey[airline_recommendations_list.indexOf(airline[i].journey_ref_id)].journey_flight_refs[airline_pick_list.length].fare_flight_refs){
                                                try{
                                                    if(airline[i].segments[l].fares[k].fare_ref_id == airline_recommendations_journey[airline_recommendations_list.indexOf(airline[i].journey_ref_id)].journey_flight_refs[airline_pick_list.length].fare_flight_refs[l].fare_ref_id)
                                                        check = 1;
                                                }catch(err){
                                                    console.log(err); // error kalau ada element yg tidak ada
                                                }
                                            }
                                            if(check == 1){
                                                for(l in airline_recommendations_journey[airline_recommendations_list.indexOf(airline[i].journey_ref_id)].service_charge_summary){
                                                    if(airline_recommendations_journey[airline_recommendations_list.indexOf(airline[i].journey_ref_id)].service_charge_summary[l].pax_type == 'ADT')
                                                        temp_total_price = airline_recommendations_journey[airline_recommendations_list.indexOf(airline[i].journey_ref_id)].service_charge_summary[l].total_price / airline_recommendations_journey[airline_recommendations_list.indexOf(airline[i].journey_ref_id)].service_charge_summary[l].pax_count;
                                                }
                                                temp_total_price -= total_price_pick;
                                            }else{
                                                for(l in airline[i].segments[j].fares[k].service_charge_summary)
                                                    if(airline[i].segments[j].fares[k].service_charge_summary[l].pax_type == 'ADT'){
                                                        for(m in airline[i].segments[j].fares[k].service_charge_summary[l].service_charges)
                                                            if(airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'tax' || airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'fare' || airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'roc')
                                                                temp_total_price+= airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].amount;
                                                        break;
                                                }
                                            }
                                       }else{
                                            for(l in airline[i].segments[j].fares[k].service_charge_summary)
                                                if(airline[i].segments[j].fares[k].service_charge_summary[l].pax_type == 'ADT'){
                                                    for(m in airline[i].segments[j].fares[k].service_charge_summary[l].service_charges)
                                                        if(airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'tax' || airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'fare' || airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'roc')
                                                            temp_total_price+= airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].amount;
                                                    break;
                                            }
                                       }
                                   }else if(airline_pick_list.length != airline_request.origin.length-1 || airline_request.origin.length == 1){
                                        for(l in airline[i].segments[j].fares[k].service_charge_summary)
                                            if(airline[i].segments[j].fares[k].service_charge_summary[l].pax_type == 'ADT'){
                                                for(m in airline[i].segments[j].fares[k].service_charge_summary[l].service_charges)
                                                    if(airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'tax' || airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'fare' || airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'roc')
                                                        temp_total_price+= airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].amount;
                                                break;
                                        }
                                   }

                                   if(airline_request.adult + airline_request.child > airline[i].segments[j].fares[k].available_count){

                                   }else{
                                       if(fare_check == 0 && k == airline[i].segments[j].fare_pick){
                                            var choose_span = document.getElementById('choose_seat_span'+i+j);
                                            choose_span.innerHTML = 'Choose Seat Class - '+airline[i].segments[j].fares[k].class_of_service;

                                            if(airline[i].segments[j].fares[k].cabin_class != ''){
                                                if(airline[i].segments[j].fares[k].cabin_class == 'Y'){
                                                    choose_span.innerHTML += ' (Economy)';
                                                }
                                                else if(airline[i].carrier_code_list.includes('QG') && airline[i].segments[j].fares[k].cabin_class == 'W'){
                                                    choose_span.innerHTML += ' (Royal Green)';
                                                }
                                                else if(airline[i].segments[j].fares[k].cabin_class == 'W'){
                                                    choose_span.innerHTML += ' (Premium Economy)';
                                                }
                                                else if(airline[i].segments[j].fares[k].cabin_class == 'C'){
                                                    choose_span.innerHTML += ' (Business)';
                                                }
                                                else if(airline[i].segments[j].fares[k].cabin_class == 'F'){
                                                    choose_span.innerHTML += ' (First Class)';
                                                }
                                            }

                                           if(temp_total_price == 0){
                                                choose_span.innerHTML += ' - Choose to view price';
                                           }else{
                                                choose_span.innerHTML += ' - '+airline[i].currency + ' ' + getrupiah(temp_total_price);
                                           }

                                           fare_check = 1;
                                       }
                                   }
                                }
                           }

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

                           text = '';
                            if(airline_request.origin.length == airline_pick_list.length + 1 && airline_recommendations_list.length != 0){
                                total_price = 0;
                                for(l in airline_recommendations_journey[airline_recommendations_list.indexOf(airline[i].journey_ref_id)].service_charge_summary){
                                    if(airline_recommendations_journey[airline_recommendations_list.indexOf(airline[i].journey_ref_id)].service_charge_summary[l].pax_type == 'ADT')
                                        total_price = airline_recommendations_journey[airline_recommendations_list.indexOf(airline[i].journey_ref_id)].service_charge_summary[l].total_price / airline_recommendations_journey[airline_recommendations_list.indexOf(airline[i].journey_ref_id)].service_charge_summary[l].pax_count;
                                }
                                total_price -= total_price_pick;
                                if(total_price != 0){

                                    document.getElementById('fare'+i).innerHTML = airline[i].currency+' '+getrupiah(total_price);
                                }else if(airline[i].can_book == true)
                                    document.getElementById('fare'+i).innerHTML = 'Choose to view price';
                            }else{
                                if(airline[i].total_price != 0){
                                    total_discount = 0;
                                    for(j in airline[i].segments){
                                        for(k in airline[i].segments[j].fares[airline[i].segments[j].fare_pick].service_charge_summary){
                                            for(l in airline[i].segments[j].fares[airline[i].segments[j].fare_pick].service_charge_summary[k].service_charges){
                                                if(airline[i].segments[j].fares[airline[i].segments[j].fare_pick].service_charge_summary[k].service_charges[l].charge_type == 'DISC')
                                                    total_discount += Math.abs(airline[i].segments[j].fares[airline[i].segments[j].fare_pick].service_charge_summary[k].service_charges[l].amount);
                                            }
                                        }
                                    }
                                    if(total_discount != 0)
                                        document.getElementById('fare_no_discount'+i).innerHTML = airline[i].currency+' '+getrupiah(airline[i].total_price + total_discount);
                                    document.getElementById('fare'+i).innerHTML = airline[i].currency+' '+getrupiah(airline[i].total_price);

                                }else if(airline[i].can_book == true)
                                    document.getElementById('fare'+i).innerHTML = 'Choose to view price';
                            }
                       }
                   }
               }
           }
       }
   }
   if(contain >= 9){
       scroll_add_airline = true;
   }
   if(airline_choose/count_progress_bar_airline == 1 && ticket_count == 0 && airline_choose != 0 && count_progress_bar_airline != 0 && airline_pick_list.length != airline_request.origin.length){
        document.getElementById("airlines_ticket").innerHTML = '';
        text = '';
        text += `
        <div style="text-align:center">
            <img src="/static/tt_website_rodextrip/images/nofound/no-airlines.png" alt="Not Found Airlines" style="width:70px; height:70px;" title="" />
            <br/>
        </div>
        <center><div class="alert alert-warning" role="alert" style="margin-top:15px; border:1px solid #cdcdcd;"><h6><i class="fas fa-search-minus"></i> Oops! Sorry no ticket for flight `+ parseInt(counter_search).toString()+`. Please try another flight. </h6></div></center>`;
        var node = document.createElement("div");
        node.innerHTML = text;
        document.getElementById("airlines_ticket").appendChild(node);
        node = document.createElement("div");
        Swal.fire({
          type: 'error',
          title: 'Oops!',
          html: '<span style="color: red;"> Sorry no ticket for flight '+ parseInt(counter_search).toString()+' </span>',
        });
//        if(ticket_count == 0 && airline_data.length == 0)
//            window.location.href="/dashboard";
   }
   else{
        //cek count airline #1
        checkboxCopy();
        document.getElementById("airlines_result_ticket").innerHTML = '';
        text_co = `
        <div class="we_found_box" style="border:1px solid #cdcdcd; background-color:white; margin-bottom:-5px; padding:10px;">
            <span style="font-weight:bold; font-size:14px;"> We found `+ticket_count+` flights</span>
            <label class="check_box_custom" style="float:right;">
                <span class="span-search-ticket" style="color:black;">Select all</span>
                <input type="checkbox" id="check_all_copy" onchange="check_all_result();"/>
                <span class="check_box_span_custom"></span>
            </label>
        </div>`;
        var node_co = document.createElement("div");
        node_co.innerHTML = text_co;
        document.getElementById("airlines_result_ticket").appendChild(node_co);
   }
}

function change_departure(val){
    document.getElementById("badge-copy-notif").innerHTML = "0";
    document.getElementById("badge-copy-notif2").innerHTML = "0";
    $('#button_copy_airline').hide();
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
    change_date_next_prev(counter_search-1);
    text = '';
    airline_pick_mc('no_button');
    document.getElementById("airline_detail").innerHTML = '';
    filtering('filter');

    document.getElementById("badge-flight-notif").innerHTML = "0";
    document.getElementById("badge-flight-notif2").innerHTML = "0";
    $("#badge-flight-notif").removeClass("infinite");
    $("#badge-flight-notif2").removeClass("infinite");
    $('#button_chart_airline').hide();
    $('#choose-ticket-flight').show();


}

function delete_mc_journey(val){
    journey.splice(val-1,1);
    value_pick.splice(val-1,1);
    airline_pick_list.splice(val-1,1);
    temp = parseInt(airline_request.counter) - 1;
    counter_search = temp;
    airline_request.counter = temp.toString();
    airline_request['departure'].splice(val-1,1);
    airline_request['destination'].splice(val-1,1);
    airline_request['origin'].splice(val-1,1);
    airline_request['return'].splice(val-1,1);
    //update data kalau comboprice tetap tidak ketemu karena temen 1 adalah 2 bukan 3 testing delete flight 2 change flight 1
    new_data = [];
    for(i in airline_data){
        if(airline_data[i].airline_pick_sequence != val){
            if(airline_data[i].airline_pick_sequence > val)
                airline_data[i].airline_pick_sequence--;
            new_data.push(airline_data[i]);
        }
    }
    airline_data = new_data;
    airline_pick_mc('all');
    if(parseInt(airline_request.counter) == journey.length){
        document.getElementById('airline_detail').innerHTML = '';
        document.getElementById('airlines_ticket').innerHTML = '';
        //filtering('filter');
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

}

function airline_pick_mc(type){
    text = '';
    for(i in airline_pick_list){
        text+=`<div>`;
        if($radio_value_string != "multicity"){
            if(airline_pick_list[i].is_combo_price == true){
                text+=`
                <div style="background-color:`+color+`; padding:10px;">
                    <h6 style="color:`+text_color+`;">Departure-Return Flight</h6>
                </div>`;
            }else if(airline_pick_list[i].airline_pick_sequence == 1){
                text+=`
                <div style="background-color:`+color+`; padding:10px;">
                    <h6 style="color:`+text_color+`;">Departure Flight</h6>
                </div>`;
            }else if(airline_pick_list[i].airline_pick_sequence == 2){
                text+=`
                <div style="background-color:`+color+`; padding:10px;">
                    <h6 style="color:`+text_color+`;">Return Flight</h6>
                </div>`;
            }
        }else{
            text+=`
            <div style="background-color:`+color+`; padding:10px;">
                <h6 style="color:`+text_color+`;">Flight - `+(airline_pick_list[i].airline_pick_sequence)+`</h6>
            </div>`;
        }

        text+=`
        <div style="background-color:white; border:1px solid `+color+`; margin-bottom:15px; padding:10px;" id="journey2`+airline_pick_list[i].airline_pick_sequence+`">
            <div class="row">`;
                carrier_code_airline = [];

                text+=`<div class="col-lg-12">`;

                if(airline_pick_list[i].hasOwnProperty('search_banner')){
                   for(banner_counter in airline_pick_list[i].search_banner){
                       var max_banner_date = moment().subtract(parseInt(-1*airline_pick_list[i].search_banner[banner_counter].minimum_days), 'days').format('YYYY-MM-DD');
                       var selected_banner_date = moment(airline_pick_list[i].departure_date.split(' - ')[0]).format('YYYY-MM-DD');

                       if(selected_banner_date >= max_banner_date){
                           if(airline_pick_list[i].search_banner[banner_counter].active == true){
                               text+=`<label id="pop_search_banner_pick`+i+``+banner_counter+`" style="background:`+airline_pick_list[i].search_banner[banner_counter].banner_color+`; color:`+airline_pick_list[i].search_banner[banner_counter].text_color+`;padding:5px 10px;">`+airline_pick_list[i].search_banner[banner_counter].name+`</label>`;
                           }
                       }
                   }
                }

                text+=`</div>`;
                if(airline_pick_list[i].is_combo_price == true){
                    for(j in airline_pick_list[i].segments){
                        flight_number = parseInt(j) + 1;
                        text +=`
                        <div class="col-lg-12">
                            <div class="row">
                                <div class="col-lg-2" style="padding-top:10px;">`;
                                    if(airline_pick_list[i].segments[j].carrier_code != airline_pick_list[i].segments[j].operating_airline_code && airline_pick_list[i].segments[j].operating_airline_code != ''){
                                        try{
                                            text += `<span class="copy_operated_by" style="float:left; font-weight: 700; font-size:12px;">Operated By `+airline_carriers[0][airline_pick_list[i].segments[j].operating_airline_code].name+`</span><br/>`;

                                        }catch(err){
                                            text += `<span class="copy_operated_by" style="float:left; font-weight: 700; font-size:12px;">Operated By `+airline_pick_list[i].segments[j].operating_airline_code+`</span><br/>`;
                                        }
                                    }
                                    text+=`
                                    <span class="copy_carrier_provider" style="font-weight:500; font-size:12px;">`+airline_carriers[0][airline_pick_list[i].segments[j].carrier_code].name+`</span><br/>`;
                                    try{
                                    text+=`
                                    <img data-toggle="tooltip" style="width:50px; height:50px;margin-bottom:5px;" alt="`+airline_carriers[0][airline_pick_list[i].segments[j].operating_airline_code].name+`" title="`+airline_carriers[0][airline_pick_list[i].segments[j].operating_airline_code].name+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+airline_pick_list[i].segments[j].operating_airline_code+`.png"><br/>`;
                                    }catch(err){
                                    text+=`<img data-toggle="tooltip" style="width:50px; height:50px;margin-bottom:5px;" alt="`+airline_carriers[0][airline_pick_list[i].segments[j].operating_airline_code].name+`" title="`+airline_carriers[0][airline_pick_list[i].segments[j].operating_airline_code].name+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+airline_pick_list[i].segments[j].carrier_code+`.png"><br/>`;}
                                    text+=`
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
                                            <span class="copy_transit">Transit: `+airline_pick_list[i].segments[j].transit_count+`</span><br/>`;
                                    text+=`
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
                                    if(airline_pick_list[i].segments[j].carrier_code != airline_pick_list[i].segments[j].operating_airline_code && airline_pick_list[i].segments[j].operating_airline_code != ''){
                                        try{
                                            text += `<span class="copy_operated_by" style="float:left; font-weight: 700; font-size:12px;">Operated by `+airline_carriers[0][airline_pick_list[i].segments[j].operating_airline_code].name+`</span><br/>`;
                                        }catch(err){
                                            text += `<span class="copy_operated_by" style="float:left; font-weight: 700; font-size:12px;">Operated by `+airline_pick_list[i].segments[j].operating_airline_code+`</span><br/>`;
                                        }
                                        try{
                                            text+=`
                                            <span class="copy_carrier_provider" style="font-weight:500; font-size:12px;">`+airline_carriers[0][airline_pick_list[i].segments[j].carrier_code].name+`</span><br/>
                                            <img data-toggle="tooltip" style="width:50px; height:50px;" alt="`+airline_carriers[0][airline_pick_list[i].segments[j].carrier_code].name+`" title="`+airline_carriers[0][airline_pick_list[i].segments[j].carrier_code].name+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+airline_pick_list[i].segments[j].carrier_code+`.png"><br/>`;
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
                                            <span class="copy_carrier_provider" style="font-weight:500; font-size:12px;">`+airline_carriers[0][airline_pick_list[i].segments[j].carrier_code].name+`</span><br/>
                                            <img data-toggle="tooltip" style="width:50px; height:50px;" alt="`+airline_carriers[0][airline_pick_list[i].segments[j].carrier_code].name+`" title="`+airline_carriers[0][airline_pick_list[i].segments[j].carrier_code].name+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+airline_pick_list[i].segments[j].carrier_code+`.png"><br/>`;
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
                                //    <span class="copy_carrier_provider" style="font-weight:500; font-size:12px;">`+airline_carriers[0][airline[i].carrier_code_list[j]].name+`</span><br/>
                                //    <img data-toggle="tooltip" alt="" style="width:50px; height:50px;" title="`+airline_carriers[0][airline[i].carrier_code_list[j]].name+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+airline[i].carrier_code_list[j]+`.png"><br/>`;
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

                <div class="col-lg-8" style="text-align:right;">`;
                    price = 0;
                    if(i == airline_pick_list.length - 1 && airline_pick_list.length == airline_request.origin.length && Object.keys(airline_recommendations_dict).length > 0 && i != 0){
                        total_price = 0;
                        journey_recom_idx = 0
                        is_journey_recom = false;
                        if(airline_recommendations_dict.hasOwnProperty(airline_pick_list[i].journey_ref_id)){
                            for(l in airline_recommendations_dict[airline_pick_list[airline_pick_list.length-1].journey_ref_id]){
                                is_journey_recom = false;
                                for(m in airline_recommendations_dict[airline_pick_list[airline_pick_list.length-1].journey_ref_id][l].segments){
                                    if(airline_pick_list[i].segments[j].fares[airline_pick_list[i].segments[j].fare_pick].fare_ref_id == airline_recommendations_dict[airline_pick_list[i].journey_ref_id][l].segments[m].fare_ref_id){
                                        is_journey_recom = true;
                                    }else{
                                        is_journey_recom = false;
                                        break;
                                    }
                                }
                                if(is_journey_recom == true){
                                    journey_recom_idx = l;
                                    break;
                                }
                            }
                        }
                        if(airline_recommendations_dict.hasOwnProperty(airline_pick_list[airline_pick_list.length-1].journey_ref_id)){
                            for(l in airline_recommendations_dict[airline_pick_list[airline_pick_list.length-1].journey_ref_id][journey_recom_idx].service_charge_summary){
                                if(airline_recommendations_dict[airline_pick_list[airline_pick_list.length-1].journey_ref_id][journey_recom_idx].service_charge_summary[l].pax_type == 'ADT'){
                                    price = airline_recommendations_dict[airline_pick_list[airline_pick_list.length-1].journey_ref_id][journey_recom_idx].service_charge_summary[l].total_price / airline_recommendations_dict[airline_pick_list[airline_pick_list.length-1].journey_ref_id][journey_recom_idx].service_charge_summary[l].pax_count; // harga per orang
                                }
                            }
                        }
//                        for(l in airline_recommendations_journey){
//                            for(m in airline_recommendations_journey[l].journey_flight_refs){
//                                if(airline_recommendations_journey[l].journey_flight_refs[m].journey_ref_id == airline_pick_list[airline_pick_list.length - 1].journey_ref_id){
//                                    for(n in airline_recommendations_journey[l].journey_flight_refs[m].fare_flight_refs){
//                                        if(airline_recommendations_journey[l].journey_flight_refs[m].fare_flight_refs[n].fare_ref_id == airline_pick_list[airline_pick_list.length - 1].segments[airline_pick_list[airline_pick_list.length - 1].segments.length -1].fares[airline_pick_list[airline_pick_list.length - 1].segments[airline_pick_list[airline_pick_list.length - 1].segments.length -1].fare_pick].fare_ref_id){
//                                            for(o in airline_recommendations_journey[l].service_charge_summary){
//                                                if(airline_recommendations_journey[l].service_charge_summary[o].pax_type == 'ADT'){
//                                                    price = airline_recommendations_journey[l].service_charge_summary[o].total_price / airline_recommendations_journey[l].service_charge_summary[o].pax_count;
//                                                }
//                                                found = true;
//                                            }
//                                            break;
//                                        }
//                                    }
//                                    if(found == true)
//                                        break;
//                                }
//                            }
//                            if(found == true)
//                                break;
//                        }
//                        for(l in airline_recommendations_journey[airline_recommendations_list.indexOf(airline_pick_list[i].journey_ref_id)].service_charge_summary){
//                            if(airline_recommendations_journey[airline_recommendations_list.indexOf(airline_pick_list[i].journey_ref_id)].service_charge_summary[l].pax_type == 'ADT')
//                                price = airline_recommendations_journey[airline_recommendations_list.indexOf(airline_pick_list[i].journey_ref_id)].service_charge_summary[l].total_price / airline_recommendations_journey[airline_recommendations_list.indexOf(airline_pick_list[i].journey_ref_id)].service_charge_summary[l].pax_count;
//                                console.log(airline_recommendations_journey[airline_recommendations_list.indexOf(airline_pick_list[i].journey_ref_id)].service_charge_summary[l].total_price / airline_recommendations_journey[airline_recommendations_list.indexOf(airline_pick_list[i].journey_ref_id)].service_charge_summary[l].pax_count);
//                        }
                        price -= total_price_pick;
                    }else{
                        for(j in airline_pick_list[i].segments){
                            for(k in airline_pick_list[i].segments[j].fares){
                                if(parseInt(airline_request.child)+parseInt(airline_request.adult) <= airline_pick_list[i].segments[j].fares[k].available_count && k==airline_pick_list[i].segments[j].fare_pick){
                                    for(l in airline_pick_list[i].segments[j].fares[k].service_charge_summary){
                                        if(airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].pax_type == 'ADT')
                                            for(m in airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges)
                                                if(airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'fare' || airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'tax' || airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'roc'){
                                                    currency = airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].currency;
                                                    price+= airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].amount;
                                                }
                                    }
                                    break;
                                }
                            }
                        }
                    }
//
//                    price = 0;
//                    for(j in airline_pick_list[i].segments){
//                        for(k in airline_pick_list[i].segments[j].fares){
//                            if(parseInt(airline_request.child)+parseInt(airline_request.adult) <= airline_pick_list[i].segments[j].fares[k].available_count && k==airline_pick_list[i].segments[j].fare_pick){
//                                for(l in airline_pick_list[i].segments[j].fares[k].service_charge_summary){
//                                    if(airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].pax_type == 'ADT')
//                                        for(m in airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges)
//                                            if(airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'fare' || airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'tax' || airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'roc'){
//                                                currency = airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].currency;
//                                                price+= airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].amount;
//                                            }
//                                }
//                                break;
//                            }
//                        }
//                    }
                    total_discount = 0;
                    if(price == 0){
                        text+= 'Choose All Flight Schedule to view price</span>';
                    }else{
                        for(j in airline_pick_list[i].segments){
                            for(k in airline_pick_list[i].segments[j].fares[airline_pick_list[i].segments[j].fare_pick].service_charge_summary){
                                for(l in airline_pick_list[i].segments[j].fares[airline_pick_list[i].segments[j].fare_pick].service_charge_summary[k].service_charges){
                                    if(airline_pick_list[i].segments[j].fares[airline_pick_list[i].segments[j].fare_pick].service_charge_summary[k].service_charges[l].charge_type == 'DISC')
                                        total_discount += Math.abs(airline_pick_list[i].segments[j].fares[airline_pick_list[i].segments[j].fare_pick].service_charge_summary[k].service_charges[l].amount);
                                }
                            }
                        }
                        if(total_discount != 0){
                            text += `<br/><span id="fare_no_discount_detail_pick`+airline_pick_list[i].airline_pick_sequence+`" class="basic_fare_field" style="text-decoration: line-through;color:#cdcdcd;">`+currency+` `+getrupiah(price)+`</span><br/>`
                        }
                        text+= `<span id="fare_detail_pick`+airline_pick_list[i].airline_pick_sequence+`" class="basic_fare_field price_template" style="font-size:16px;font-weight: bold; color:`+color+`; padding:10px 0px;">`+currency+' '+getrupiah(price-total_discount) + '</span>';
                    }

                    text+=`</span><br/>`;
                    if(provider_list_data.hasOwnProperty(airline_pick_list[i].provider) == true && provider_list_data[airline_pick_list[i].provider].description != '')
                        text += `<span style="margin-right:5px;">`+provider_list_data[airline_pick_list[i].provider].description+`</span><br/>`;
                    if(type == 'all'){
                        text+=`
                        <input type='button' id="deletejourney_pick`+airline_pick_list[i].airline_pick_sequence+`" class="primary-btn-custom choose_selection_ticket_airlines_depart" value="Delete" onclick="delete_mc_journey(`+airline_pick_list[i].airline_pick_sequence+`);" sequence_id="0"/>
                        <input type='button' style="margin-left:15px;" id="changejourney_pick`+airline_pick_list[i].airline_pick_sequence+`" class="primary-btn-custom choose_selection_ticket_airlines_depart" value="Change" onclick="change_departure(`+airline_pick_list[i].airline_pick_sequence+`);" sequence_id="0"/>`;
                    }
                    else if(type == 'change'){
                        text+=`
                        <input type='button' style="background:#cdcdcd !important;" id="deletejourney_pick`+airline_pick_list[i].airline_pick_sequence+`" class="primary-btn-custom choose_selection_ticket_airlines_depart" value="Delete" onclick="delete_mc_journey(`+airline_pick_list[i].airline_pick_sequence+`);" disabled sequence_id="0"/>
                        <input type='button' style="margin-left:15px;" id="changejourney_pick`+airline_pick_list[i].airline_pick_sequence+`" class="primary-btn-custom choose_selection_ticket_airlines_depart" value="Change" onclick="change_departure(`+airline_pick_list[i].airline_pick_sequence+`);" sequence_id="0"/>`;
                    }
                    else if(type == 'delete'){
                        text+=`
                        <input type='button' style="margin:10px;" id="deletejourney_pick`+airline_pick_list[i].airline_pick_sequence+`" class="primary-btn-custom choose_selection_ticket_airlines_depart" value="Delete" onclick="delete_mc_journey(`+airline_pick_list[i].airline_pick_sequence+`);" sequence_id="0"/>
                        <input type='button' style="margin-left:15px;background:#f5f5f5 !important;" id="changejourney_pick`+airline_pick_list[i].airline_pick_sequence+`" class="primary-btn-custom choose_selection_ticket_airlines_depart" value="Change" onclick="change_departure(`+airline_pick_list[i].airline_pick_sequence+`);" disabled sequence_id="0"/>`;
                    }
                    else if(type=='no_button'){
                        text+=`
                        <input type='button' style="margin:10px;background:#cdcdcd !important;" id="deletejourney_pickdepartjourney`+airline_pick_list[i].airline_pick_sequence+`" class="primary-btn-custom choose_selection_ticket_airlines_depart" value="Delete" onclick="delete_mc_journey(`+airline_pick_list[i].airline_pick_sequence+`);" disabled sequence_id="0"/>
                        <input type='button' style="margin-left:15px;background:#cdcdcd !important;" id="changejourney_pick`+airline_pick_list[i].airline_pick_sequence+`" class="primary-btn-custom choose_selection_ticket_airlines_depart" value="Change" onclick="change_departure(`+airline_pick_list[i].airline_pick_sequence+`);" disabled sequence_id="0"/>`;
                    }
                    text+=`
                </div>
                <div class="col-lg-12" style="padding:0px;">
                <div id="detail_departjourney_pick`+airline_pick_list[i].airline_pick_sequence+`" class="panel-collapse collapse in" aria-expanded="true" style="display:none;">`;
                for(j in airline_pick_list[i].segments){
                    if(airline_pick_list[i].segments[j].transit_duration != ''){
                        text += `
                        <div class="col-lg-12 mt-3" style="text-align:center;padding:0px 15px;">
                            <div style="border:1px solid #cdcdcd; background:#f7f7f7; padding:15px; border-radius:14px; color:`+color+`;"><span style="font-weight:500;"><i class="fas fa-clock"></i>Transit Duration: `;
                        if(airline_pick_list[i].segments[j].transit_duration.split(':')[0] != '0')
                            text+= airline_pick_list[i].segments[j].transit_duration.split(':')[0] + 'd ';
                        if(airline_pick_list[i].segments[j].transit_duration.split(':')[1] != '0')
                            text+= airline_pick_list[i].segments[j].transit_duration.split(':')[1] + 'h ';
                        if(airline_pick_list[i].segments[j].transit_duration.split(':')[2] != '0')
                            text+= airline_pick_list[i].segments[j].transit_duration.split(':')[2] + 'm ';
                        text+=`</span></div></div><br/>`;
                    }
                var depart = 0;
                if(airline_pick_list[i].segments[j].origin == airline_request.destination[0].split(' - ')[0])
                    depart = 1;
                if(airline_request.direction != 'MC'){
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
                }else{
                    text+=`
                        <div class="col-lg-12">
                            <div style="text-align:left; background-color:white; padding-top:10px;">
                                <span class="flight_type_template">Flight `+parseInt(parseInt(i)+1)+`</span>
                                <hr/>
                            </div>
                        </div>`;
                }
                text+=`
                    <div class="col-lg-12">
                        <div class="row" id="journeypick0segment0">

                        <div class="col-lg-2">`;
                        if(airline_pick_list[i].segments[j].carrier_code != airline_pick_list[i].segments[j].operating_airline_code && airline_pick_list[i].segments[j].operating_airline_code != ''){
                        try{
                            text += `<span class="copy_operated_by" style="float:left; font-weight: 700; font-size:12px;">Operated by `+airline_carriers[0][airline_pick_list[i].segments[j].operating_airline_code].name+`</span><br/>`;

                        }catch(err){
                            text += `<span class="copy_operated_by" style="float:left; font-weight: 700; font-size:12px;">Operated by `+airline_pick_list[i].segments[j].operating_airline_code+`</span><br/>`;
                        }
                    }
                    text+=`
                        <span class="copy_carrier_provider" style="font-weight:500; font-size:12px;">`+airline_carriers[0][airline_pick_list[i].segments[j].carrier_code].name+`</span><br/>
                        <img data-toggle="tooltip" alt="`+airline_carriers[0][airline_pick_list[i].segments[j].carrier_code].name+`" style="width:50px; height:50px;margin-bottom:5px;" title="`+airline_carriers[0][airline_pick_list[i].segments[j].carrier_code].name+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+airline_pick_list[i].segments[j].carrier_code+`.png"><br/>
                        </div>
                        <div class="col-lg-7">`;
                        for(k in airline_pick_list[i].segments[j].legs){
                        text+=`
                            <div class="timeline-wrapper">
                                <ul class="StepProgress">
                                    <li class="StepProgress-item is-done">
                                       <div>
                                           <span style="font-weight:600; font-size:16px;">`+airline_pick_list[i].segments[j].legs[k].departure_date.split(' - ')[1]+`</span><br/>
                                           <span>`+airline_pick_list[i].segments[j].legs[k].departure_date.split(' - ')[0]+`</span>
                                       </div>
                                       <div style="width:84%;">
                                           <span style="font-weight:500;">`+airline_pick_list[i].segments[j].legs[k].origin_city+` - `+airline_pick_list[i].segments[j].legs[k].origin_name+` (`+airline_pick_list[i].segments[j].legs[k].origin+`)</span></br>`;
                                       if(airline_pick_list[i].segments[j].legs[k].origin_terminal != ''){
                                           text+=`<span style="font-size:13px; font-weight:500;">Terminal: `+airline_pick_list[i].segments[j].legs[k].origin_terminal+`</span><br/>`;
                                       }else{
                                           text+=`<span style="font-size:13px; font-weight:500;">Terminal: -</span><br/>`;
                                       }
                                       text+=`
                                       </div>
                                    </li>
                                    <li class="StepProgress-item is-end">
                                       <div>
                                           <span style="font-weight:600; font-size:16px;">`+airline_pick_list[i].segments[j].legs[k].arrival_date.split(' - ')[1]+`</span><br/>
                                           <span>`+airline_pick_list[i].segments[j].legs[k].arrival_date.split(' - ')[0]+`</span>
                                       </div>
                                       <div style="width:84%;">
                                           <span style="font-weight:500;">`+airline_pick_list[i].segments[j].legs[k].destination_city+`</span> - <span>`+airline_pick_list[i].segments[j].legs[k].destination_name+` (`+airline_pick_list[i].segments[j].legs[k].destination+`)</span><br/>`;
                                       if(airline_pick_list[i].segments[j].legs[k].destination_terminal != ''){
                                           text+=`<span style="font-size:13px; font-weight:500;">Terminal: `+airline_pick_list[i].segments[j].legs[k].destination_terminal+`</span><br/>`;
                                       }else{
                                           text+=`<span style="font-size:13px; font-weight:500;">Terminal: -</span><br/>`;
                                       }
                                       text+=`
                                       </div>
                                    </li>
                                </ul>
                            </div>`;
                            }
                            text+=`
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
                            if(airline_pick_list[i].segments[j].carrier_type_name != '')
                                text += `<span style="font-weight:500;"><i class="fas fa-plane"></i> `+airline_pick_list[i].segments[j].carrier_type_name+`</span><br/>`;
                            else if(airline_pick_list[i].segments[j].carrier_type_code!= '')
                                text += `<span style="font-weight:500;"><i class="fas fa-plane"></i> `+airline_pick_list[i].segments[j].carrier_type_code+`</span><br/>`;
                            for(k in airline_pick_list[i].segments[j].fares){
                                if(k == 0){
                                    for(l in airline_pick_list[i].segments[j].fares[k].fare_details){
                                        if(airline_pick_list[i].segments[j].fares[k].fare_details[l].detail_type.includes('BG')){
                            text+=`
                            <span style="font-weight:500;"><i class="fas fa-suitcase"></i> `+airline_pick_list[i].segments[j].fares[k].fare_details[l].amount+` `+airline_pick_list[i].segments[j].fares[k].fare_details[l].unit+`</span><br/>`;
                                        }
                                    }
                                break;
                                }
                            }
                        text+=`</div>
                        <div class="col-lg-12" style="padding-top:10px;">
                            <button style="text-align:left; width:unset; line-height:20px; font-size:13px; height:50px;" id="show_choose_seat_pick`+i+``+j+`" type="button" class="form-control primary-btn-white dropdown-toggle" data-toggle="dropdown">
                                <img src="/static/tt_website_rodextrip/img/icon/seat.png" style="height:16px; width:auto;"> <span id="choose_seat_span_pick`+i+``+j+`"></span>
                            </button>
                            <ul id="provider_seat_content_pick`+i+``+j+`" class="dropdown-menu" style="background:unset; padding:0px 15px 15px 15px; z-index:5; border:unset;">
                               <div style="background:white; padding:15px; border:1px solid #cdcdcd; overflow-y:auto; height:200px;">
                                   <div class="row">
                                       <div class="col-lg-12">
                                            <h6>(Class Of Service / Seat left)</h6>
                                            <hr/>
                                       </div>`;

                                       for(k in airline_pick_list[i].segments[j].fares){
                                            text+=`<div class="col-lg-12">`;
                                            if(k==airline_pick_list[i].segments[j].fare_pick){
                                            text+=`
                                            <label class="radio-button-custom">
                                                `+airline_pick_list[i].segments[j].fares[k].class_of_service;
                                                if(airline_pick_list[i].segments[j].fares[k].cabin_class != ''){
                                                    if(airline_pick_list[i].segments[j].fares[k].cabin_class == 'Y'){
                                                        text += ' (Economy)';
                                                    }
                                                    else if(airline_pick_list[i].carrier_code_list.includes('QG') && airline_pick_list[i].segments[j].fares[k].cabin_class == 'W'){
                                                        text += ' (Royal Green)';
                                                    }
                                                    else if(airline_pick_list[i].segments[j].fares[k].cabin_class == 'W'){
                                                        text += ' (Premium Economy)';
                                                    }
                                                    else if(airline_pick_list[i].segments[j].fares[k].cabin_class == 'C'){
                                                        text += ' (Business)';
                                                    }
                                                    else if(airline_pick_list[i].segments[j].fares[k].cabin_class == 'F'){
                                                        text += ' (First Class)';
                                                    }
                                                }
                                                text+=`</span> / <span>`+airline_pick_list[i].segments[j].fares[k].available_count+`
                                                <input id="journeypick`+airline_pick_list[i].airline_pick_sequence+`segment`+j+`fare" name="journeypick`+airline_pick_list[i].airline_pick_sequence+`segment`+j+`fare" type="radio" value="`+k+`" checked="checked" disabled>
                                                <span class="checkmark-radio"></span>`;
                                            }
                                            else{
                                            text+=`
                                            <label class="radio-button-custom" style="color:#cdcdcd; cursor:not-allowed;">
                                                `+airline_pick_list[i].segments[j].fares[k].class_of_service;
                                                if(airline_pick_list[i].segments[j].fares[k].cabin_class != '')
                                                    if(airline_pick_list[i].segments[j].fares[k].cabin_class == 'Y')
                                                        text += ' (Economy)';
                                                    else if(airline_pick_list[i].carrier_code_list.includes('QG') && airline_pick_list[i].segments[j].fares[k].cabin_class == 'W')
                                                        text += ' (Royal Green)';
                                                    else if(airline_pick_list[i].segments[j].fares[k].cabin_class == 'W')
                                                        text += ' (Premium Economy)';
                                                    else if(airline_pick_list[i].segments[j].fares[k].cabin_class == 'C')
                                                        text += ' (Business)';
                                                    else if(airline_pick_list[i].segments[j].fares[k].cabin_class == 'F')
                                                        text += ' (First Class)';
                                                text+=`</span> / <span>`+airline_pick_list[i].segments[j].fares[k].available_count+`
                                                <input id="journeypick`+airline_pick_list[i].airline_pick_sequence+`segment`+j+`fare" name="journeypick`+airline_pick_list[i].airline_pick_sequence+`segment`+j+`fare" type="radio" value="`+k+`" disabled>
                                                <span class="checkmark-radio"></span>`;
                                            }

                                            var total_price = 0;
                                            if(i == airline_pick_list.length - 1 && airline_recommendations_list.length != 0 && i != 0){
                                                check = 0;
                                                for(l in airline_recommendations_journey[airline_recommendations_list.indexOf(airline_pick_list[i].journey_ref_id)].journey_flight_refs[airline_pick_list.length-1].fare_flight_refs){
                                                    try{
                                                        if(airline_pick_list[i].segments[l].fares[k].fare_ref_id == airline_recommendations_journey[airline_recommendations_list.indexOf(airline_pick_list[i].journey_ref_id)].journey_flight_refs[airline_pick_list.length-1].fare_flight_refs[l].fare_ref_id)
                                                            check = 1;
                                                    }catch(err){
                                                        console.log(err); // error kalau ada element yg tidak ada
                                                    }
                                                }
                                                if(check == 1){
                                                    if(j == airline_pick_list[i].segments.length - 1){
                                                        for(l in airline_recommendations_journey[airline_recommendations_list.indexOf(airline_pick_list[i].journey_ref_id)].service_charge_summary){
                                                            if(airline_recommendations_journey[airline_recommendations_list.indexOf(airline_pick_list[i].journey_ref_id)].service_charge_summary[l].pax_type == 'ADT')
                                                                total_price = airline_recommendations_journey[airline_recommendations_list.indexOf(airline_pick_list[i].journey_ref_id)].service_charge_summary[l].total_price / airline_recommendations_journey[airline_recommendations_list.indexOf(airline_pick_list[i].journey_ref_id)].service_charge_summary[l].pax_count;
                                                        }
                                                        total_price -= total_price_pick;
                                                    }
                                                }else{
                                                    for(l in airline_pick_list[i].segments[j].fares[k].service_charge_summary){
                                                        if(airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].pax_type == 'ADT'){
                                                            for(m in airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges)
                                                                if(airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'tax' || airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'fare' || airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'roc')
                                                                    total_price+= airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].amount;
                                                            break;
                                                        }
                                                    }
                                                }
                                            }
                                            else if(i != airline_request.origin.length-1 || airline_request.origin.length == 1){
                                                for(l in airline_pick_list[i].segments[j].fares[k].service_charge_summary){
                                                    if(airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].pax_type == 'ADT'){
                                                        for(m in airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges)
                                                            if(airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'tax' || airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'fare' || airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'roc')
                                                                total_price+= airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].amount;
                                                        break;
                                                    }
                                                }
                                            }

                                            //
            //                                        var total_price = 0;
            //                                        for(l in airline_pick_list[i].segments[j].fares[k].service_charge_summary){
            //                                            if(airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].pax_type == 'ADT'){
            //                                                for(m in airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges)
            //                                                    if(airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'tax' || airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'fare' || airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'roc')
            //                                                        total_price+= airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].amount;
            //                                                break;
            //                                            }
            //                                        }
                                           if(total_price == 0){
                                               if(airline_request.adult + airline_request.child > airline_pick_list[i].segments[j].fares[k].available_count){
                                                    text+=`<br/><span id="journeypick`+airline_pick_list[i].airline_pick_sequence+`segment`+j+`fare`+k+`" class="price_template" style="font-weight:bold; color:#cdcdcd;">SOLD OUT</span>`;
                                               }else{
                                                    if(k==airline_pick_list[i].segments[j].fare_pick){
                                                        text+=`<br/><span id="journeypick`+airline_pick_list[i].airline_pick_sequence+`segment`+j+`fare`+k+`" class="price_template" style="font-weight:bold;">Price: `+airline_pick_list[i].currency+` `+getrupiah(total_price)+`</span>`;
                                                    }else{
                                                        text+=`<br/><span id="journeypick`+airline_pick_list[i].airline_pick_sequence+`segment`+j+`fare`+k+`" class="price_template" style="font-weight:bold; color:#cdcdcd;">Change and choose to view Price</span>`;
                                                    }
                                               }
                                           }else{
                                               if(k==airline_pick_list[i].segments[j].fare_pick){
                                                    text+=`<br/><span id="journeypick`+airline_pick_list[i].airline_pick_sequence+`segment`+j+`fare`+k+`" class="price_template" style="font-weight:bold;">Price: `+airline_pick_list[i].currency+` `+getrupiah(total_price)+`</span>`;
                                               }else{
                                                    text+=`<br/><span id="journeypick`+airline_pick_list[i].airline_pick_sequence+`segment`+j+`fare`+k+`" class="price_template" style="font-weight:bold; color:#cdcdcd;">Change and choose to view Price</span>`;
                                               }
                                           }


                                            if(airline_pick_list[i].segments[j].fares[k].fare_name)
                                               text+=`<br/><span>`+airline_pick_list[i].segments[j].fares[k].fare_name+`</span>`;

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
                            </div>
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
    document.getElementById('airline_ticket_pick').innerHTML = text;
    for(i in airline_pick_list){
        for(j in airline_pick_list[i].segments){
            for(k in airline_pick_list[i].segments[j].fares){
                var temp_total_price_pick = 0;
                if(i == airline_pick_list.length - 1 && airline_recommendations_list.length != 0 && i != 0){
                    check = 0;
                    for(l in airline_recommendations_journey[airline_recommendations_list.indexOf(airline_pick_list[i].journey_ref_id)].journey_flight_refs[airline_pick_list.length-1].fare_flight_refs){
                        try{
                            if(airline_pick_list[i].segments[l].fares[k].fare_ref_id == airline_recommendations_journey[airline_recommendations_list.indexOf(airline_pick_list[i].journey_ref_id)].journey_flight_refs[airline_pick_list.length-1].fare_flight_refs[l].fare_ref_id)
                                check = 1;
                        }catch(err){
                            console.log(err); // error kalau ada element yg tidak ada
                        }
                    }
                    if(check == 1){
                        if(j == airline_pick_list[i].segments.length - 1){
                            for(l in airline_recommendations_journey[airline_recommendations_list.indexOf(airline_pick_list[i].journey_ref_id)].service_charge_summary){
                                if(airline_recommendations_journey[airline_recommendations_list.indexOf(airline_pick_list[i].journey_ref_id)].service_charge_summary[l].pax_type == 'ADT')
                                    temp_total_price_pick = airline_recommendations_journey[airline_recommendations_list.indexOf(airline_pick_list[i].journey_ref_id)].service_charge_summary[l].total_price / airline_recommendations_journey[airline_recommendations_list.indexOf(airline_pick_list[i].journey_ref_id)].service_charge_summary[l].pax_count;
                            }
                            temp_total_price_pick -= total_price_pick;
                        }
                    }else{
                        for(l in airline_pick_list[i].segments[j].fares[k].service_charge_summary){
                            if(airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].pax_type == 'ADT'){
                                for(m in airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges)
                                    if(airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'tax' || airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'fare' || airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'roc')
                                        temp_total_price_pick+= airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].amount;
                                break;
                            }
                        }
                    }
                }
                else if(i != airline_request.origin.length-1 || airline_request.origin.length == 1){
                    for(l in airline_pick_list[i].segments[j].fares[k].service_charge_summary){
                        if(airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].pax_type == 'ADT'){
                            for(m in airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges)
                                if(airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'tax' || airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'fare' || airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'roc')
                                    temp_total_price_pick+= airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].amount;
                            break;
                        }
                    }
                }

                if(k==airline_pick_list[i].segments[j].fare_pick){
                    var choose_span_pick = document.getElementById('choose_seat_span_pick'+i+j);
                    choose_span_pick.innerHTML = ''+airline_pick_list[i].segments[j].fares[k].class_of_service;

                    if(airline_pick_list[i].segments[j].fares[k].cabin_class != ''){
                        if(airline_pick_list[i].segments[j].fares[k].cabin_class == 'Y'){
                            choose_span_pick.innerHTML += ' (Economy)';
                        }
                        else if(airline_pick_list[i].carrier_code_list.includes('QG') && airline_pick_list[i].segments[j].fares[k].cabin_class == 'W'){
                            choose_span_pick.innerHTML += ' (Royal Green)';
                        }
                        else if(airline_pick_list[i].segments[j].fares[k].cabin_class == 'W'){
                            choose_span_pick.innerHTML += ' (Premium Economy)';
                        }
                        else if(airline_pick_list[i].segments[j].fares[k].cabin_class == 'C'){
                            choose_span_pick.innerHTML += ' (Business)';
                        }
                        else if(airline_pick_list[i].segments[j].fares[k].cabin_class == 'F'){
                            choose_span_pick.innerHTML += ' (First Class)';
                        }
                    }

                   if(temp_total_price_pick == 0){
                        choose_span_pick.innerHTML += ' - Choose All Flight Schedule';
                   }else{
                        choose_span_pick.innerHTML += ' - '+airline_pick_list[i].currency + ' ' + getrupiah(temp_total_price_pick);
                   }

                }
            }
        }


        if(airline_pick_list[i].hasOwnProperty('search_banner')){
           for(banner_counter in airline_pick_list[i].search_banner){
               var max_banner_date = moment().subtract(parseInt(-1*airline_pick_list[i].search_banner[banner_counter].minimum_days), 'days').format('YYYY-MM-DD');
               var selected_banner_date = moment(airline_pick_list[i].departure_date.split(' - ')[0]).format('YYYY-MM-DD');

               if(selected_banner_date >= max_banner_date){
                   if(airline_pick_list[i].search_banner[banner_counter].active == true && airline_pick_list[i].search_banner[banner_counter].description != ''){
                       new jBox('Tooltip', {
                            attach: '#pop_search_banner_pick'+i+banner_counter,
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
    }

}

function airline_check_search(){

    var error_log = '';
    if(document.getElementById("origin_id_flight").value == document.getElementById("destination_id_flight").value)
        error_log += 'Please change your Origin or Destination!\n';
    if(document.getElementById('airline_departure').value=='')
        error_log += 'Please change your departure date!\n';
    if(document.getElementById('directionflight').checked == true)
        if(document.getElementById('airline_return').value=='')
            error_log += 'Please change your return date!\n';

    if(error_log == ''){
//        airline_signin();
        document.getElementById('airline_searchForm').submit();
    }
    else
        alert(error_log);
}

function first_value_provider(){
    //buat MC
    if(document.getElementById('provider_box_All').checked == true){
        try{
            document.getElementById('show_provider_airline').innerHTML = 'All airline chosen';
            document.getElementById('provider_box_All_1').checked = true
        }catch(err){
            console.log(err)
        }
    }else{
        check = 0;
        for(i in airline_provider_list){
            try{
                if(document.getElementById('provider_box_'+i).checked == true){
                    check++;
                    document.getElementById('provider_box_'+i+'_1').checked = true
                }
            }catch(err){console.log(err)}
        }
        if(document.getElementById('show_provider_airline1')) //buat MC
            document.getElementById('show_provider_airline1').innerHTML = check+' Airline chosen';
    }
}

function func_check_provider(carrier_code,val){
    if(val == undefined){
        if(carrier_code == 'all'){
            for(i in airline_provider_list){
                document.getElementById('provider_box_'+i).checked = false;
            }
            document.getElementById('provider_box_All').checked = true;
        }
        else
            document.getElementById('provider_box_All').checked = false;
        check = 0;
        for(i in airline_provider_list){
            if(document.getElementById('provider_box_'+i).checked == true){
                if(i != 'All')
                    check++;
            }
        }
        if(check == 0){
            document.getElementById('provider_box_All').checked = true
            document.getElementById('show_provider_airline').innerHTML = 'All airline chosen';
        }else{
            document.getElementById('show_provider_airline').innerHTML = check+' Airline chosen';
        }
        if(val == undefined && carrier_code == undefined){
            if(check == 0){
                document.getElementById('provider_box_All').checked = true
                document.getElementById('show_provider_airline').innerHTML = 'All airline chosen';
                try{
                    document.getElementById('show_provider_airline1').innerHTML = 'All airline chosen';
                    document.getElementById('provider_box_All_1').checked = true
                }catch(err){console.log(err);}
            }else{
                document.getElementById('show_provider_airline').innerHTML = check+' Airline chosen';
                document.getElementById('show_provider_airline1').innerHTML = check+' Airline chosen';
            }
        }
    }else{
        if(carrier_code == 'all'){
            for(i in airline_provider_list){
                document.getElementById('provider_box_'+i+'_'+val).checked = false;
                document.getElementById('provider_box_'+i).checked = false;
            }
            document.getElementById('provider_box_All_'+val).checked = true;
            document.getElementById('provider_box_All').checked = true;
        }
        else{
            document.getElementById('provider_box_'+carrier_code).checked = !document.getElementById('provider_box_'+carrier_code).checked;
            document.getElementById('provider_box_All_'+val).checked = false;
            document.getElementById('provider_box_All').checked = false;
        }
        check = 0;
        for(i in airline_provider_list){
            if(document.getElementById('provider_box_'+i+'_'+val).checked == true){
                check++;
            }
        }
        if(check == 0){
            document.getElementById('provider_box_All_'+val).checked = true
            document.getElementById('provider_box_All').checked = true
            document.getElementById('show_provider_airline').innerHTML = 'All airline chosen';
            document.getElementById('show_provider_airline1').innerHTML = 'All airline chosen';
        }else{
            document.getElementById('show_provider_airline').innerHTML = check+' Airline chosen';
            document.getElementById('show_provider_airline1').innerHTML = check+' Airline chosen';
        }
    }

}

function triggered(){
    try{
        if($state == 0){
            document.getElementById('search').hidden = true;
            $state = 1;
        }else{
            document.getElementById('search').hidden = false;
            $state = 0;
        }
    }catch(err){
        document.getElementById('search').hidden = false;
        $state = 0;
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

function copy_data(){
    //

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
//    const el = document.createElement('textarea');
//    el.innerHTML = $text;
//    document.body.appendChild(el);
//    el.select();
//    document.execCommand('copy');
//    document.body.removeChild(el);
}

function share_data(){
//    const el = document.createElement('textarea');
//    el.value = $text;
//    document.body.appendChild(el);
//    el.select();
//    document.execCommand('copy');
//    document.body.removeChild(el);
    $text_share = window.encodeURIComponent($text);
}

function airline_detail(type){
    text = '';
    if(type == ''){
        total_discount = 0;
        airline_price = [];
        if(price_itinerary.hasOwnProperty('price_itinerary_provider'))
            price_itinerary_temp = price_itinerary.price_itinerary_provider;
        else
            price_itinerary_temp = price_itinerary.sell_journey_provider;
        currency = '';
        for(i in price_itinerary_temp){
            for(j in price_itinerary_temp[i].journeys){
                for(k in price_itinerary_temp[i].journeys[j].segments){
                    for(l in price_itinerary_temp[i].journeys[j].segments[k].fares){
                        if(price_itinerary_temp[i].journeys[j].segments[k].fares[l].service_charge_summary.length != 0)
                            airline_price.push({});
                        for(m in price_itinerary_temp[i].journeys[j].segments[k].fares[l].service_charge_summary){
                            price_type = {
                                'fare': 0,
                                'tax':  0,
                                'rac':  0,
                                'roc':  0,
                                'disc':  0,
                            }
                            for(n in price_itinerary_temp[i].journeys[j].segments[k].fares[l].service_charge_summary[m].service_charges){
                                if(price_itinerary_temp[i].journeys[j].segments[k].fares[l].service_charge_summary[m].service_charges[n].charge_type.toLowerCase() == 'fare') //harga per pax hanya fare karena yg lain pax count bisa beda
                                    price_type[price_itinerary_temp[i].journeys[j].segments[k].fares[l].service_charge_summary[m].service_charges[n].charge_type.toLowerCase()] = price_itinerary_temp[i].journeys[j].segments[k].fares[l].service_charge_summary[m].service_charges[n].amount;
                                else
                                    price_type[price_itinerary_temp[i].journeys[j].segments[k].fares[l].service_charge_summary[m].service_charges[n].charge_type.toLowerCase()] = price_itinerary_temp[i].journeys[j].segments[k].fares[l].service_charge_summary[m].service_charges[n].total;
                                if(price_type.hasOwnProperty('currency') == false)
                                    price_type['currency'] = price_itinerary_temp[i].journeys[j].segments[k].fares[l].service_charge_summary[m].service_charges[n].currency;
                            }
                            if(currency == '')
                                currency = price_itinerary_temp[i].journeys[j].segments[k].fares[l].service_charge_summary[m].service_charges[0].currency;
                            price_type['currency'] = currency;
                            airline_price[airline_price.length-1][price_itinerary_temp[i].journeys[j].segments[k].fares[l].service_charge_summary[m].pax_type] = price_type;
                            total_discount += airline_price[airline_price.length-1][price_itinerary_temp[i].journeys[j].segments[k].fares[l].service_charge_summary[m].pax_type].hasOwnProperty('disc') ? airline_price[airline_price.length-1][price_itinerary_temp[i].journeys[j].segments[k].fares[l].service_charge_summary[m].pax_type]['disc'] : 0
                            price_type = [];
                        }
                    }
                }
            }
        }
        price_counter = 0;
        total_price = 0;
        commission_price = 0;
        rules = 0;
        $text = '';
        text += `
        <div class="row" style="margin-bottom:5px; ">
            <div class="col-lg-12">
               <h4> Price Detail </h4>
               <hr/>
            </div>
        </div>`;
        text += `
        <div class="row">
            <div class="col-lg-12">
                <div class="row">`;
                flight_count = 0;
                for(i in price_itinerary_temp){
                    for(j in price_itinerary_temp[i].journeys){
                        is_citilink = false;
                        if(price_itinerary_temp[i].journeys[j].carrier_code_list.includes('QG')){
                            is_citilink = true;
                        }
                        if(i == 0 && j == 0 && Boolean(price_itinerary.is_combo_price) == true && price_itinerary_temp.length > 1){
                            text += `<h6>Special Price</h6>`;
                            $text +='Special Price\n';
                        }else if( i != 0 && j != 0){
                            text+=`<hr/>`;
                        }
                        flight_count++;
                        if(flight_count != 1){
                            text+=`<hr/>`;
                        }
                        text += `
                        <div class="col-lg-12 mt-1 mb-2">
                            <h6 style="cursor:pointer; color:`+color+`; display:none;" id="flight_title_up`+flight_count+`" onclick="show_hide_flight(`+flight_count+`);">
                                Flight `+flight_count+` -
                                `+price_itinerary_temp[i].journeys[j].origin+`
                                <i class="fas fa-arrow-right"></i>
                                `+price_itinerary_temp[i].journeys[j].destination+`
                                ( `+price_itinerary_temp[i].journeys[j].departure_date.split(' - ')[0]+` )
                                <i class="fas fa-caret-up" style="float:right; font-size:18px;"></i>
                            </h6>
                            <h6 class="mt-1 mb-2" style="cursor:pointer; color:`+color+`;" id="flight_title_down`+flight_count+`" onclick="show_hide_flight(`+flight_count+`);">
                                Flight `+flight_count+` -
                                `+price_itinerary_temp[i].journeys[j].origin+`
                                <i class="fas fa-arrow-right"></i>
                                `+price_itinerary_temp[i].journeys[j].destination+`
                                ( `+price_itinerary_temp[i].journeys[j].departure_date.split(' - ')[0]+` )
                                <i class="fas fa-caret-down" style="float:right; font-size:18px;"></i>
                            </h6>
                        </div>`;

                        $text +='Flight '+flight_count+'\n';
                        text+=`<div class="col-lg-12" id="flight_div_sh`+flight_count+`" style="display:none;">`;

                        if(price_itinerary_temp[i].journeys[j].hasOwnProperty('search_banner')){
                           for(banner_counter in price_itinerary_temp[i].journeys[j].search_banner){
                               var max_banner_date = moment().subtract(parseInt(-1*price_itinerary_temp[i].journeys[j].search_banner[banner_counter].minimum_days), 'days').format('YYYY-MM-DD');
                               var selected_banner_date = moment(price_itinerary_temp[i].journeys[j].departure_date.split(' - ')[0]).format('YYYY-MM-DD');

                               if(selected_banner_date >= max_banner_date){
                                   if(price_itinerary_temp[i].journeys[j].search_banner[banner_counter].active == true || price_itinerary_temp[i].journeys[j].search_banner[banner_counter].active == 'true'){
                                       text+=`<label id="pop_search_banner_detail`+i+``+j+``+banner_counter+`" style="background:`+price_itinerary_temp[i].journeys[j].search_banner[banner_counter].banner_color+`; color:`+price_itinerary_temp[i].journeys[j].search_banner[banner_counter].text_color+`;padding:5px 10px;">`+price_itinerary_temp[i].journeys[j].search_banner[banner_counter].name+`</label>`;
                                   }
                               }
                           }
                           if(price_itinerary_temp[i].journeys[j].search_banner.length > 0)
                               text+=`<br/>`;
                        }

                        //logo
        //                carrier_code_list = Array.from(new Set(price_itinerary_temp[i].journeys[j].carrier_code_list))
        //                for(k in carrier_code_list) //print gambar airline
        //                    try{
        //                        text+=`<img data-toggle="tooltip" alt="`+airline_carriers[0][carrier_code_list[k]]+`" title="`+airline_carriers[0][carrier_code_list[k]]+`" style="margin-top:10px; width:50px; height:50px; margin-right:10px;" src="`+static_path_url_server+`/public/airline_logo/`+carrier_code_list[k]+`.png"><span> </span>`;
        //                    }catch(err){
        //                        text+=`<img data-toggle="tooltip" alt="Airline" title="" style="margin-top:10px; width:50px; height:50px; margin-right:10px;" src="`+static_path_url_server+`/public/airline_logo/`+carrier_code_list[k]+`.png"><span> </span>`;
        //                    }

                        //text+=`<br/>`;
                        for(k in price_itinerary_temp[i].journeys[j].segments){
                            $text += '‣ ';
                            try{
                                if(price_itinerary_temp[i].journeys[j].segments[k].carrier_code != price_itinerary_temp[i].journeys[j].segments[k].operating_airline_code && price_itinerary_temp[i].journeys[j].segments[k].operating_airline_code != ''){
                                    text+=`<span style="font-size:13px; font-weight:500;">Operated By `+airline_carriers[price_itinerary_temp[i].journeys[j].segments[k].operating_airline_code].name+` (`+price_itinerary_temp[i].journeys[j].segments[k].carrier_code+price_itinerary_temp[i].journeys[j].segments[k].carrier_number+`)</span><br/>`
                                    text+=`<img data-toggle="tooltip" alt="`+airline_carriers[price_itinerary_temp[i].journeys[j].segments[k].operating_airline_code].name+`" title="`+airline_carriers[price_itinerary_temp[i].journeys[j].segments[k].operating_airline_code].name+`" style="margin-top:10px; width:50px; height:50px; margin-right:10px;" src="`+static_path_url_server+`/public/airline_logo/`+price_itinerary_temp[i].journeys[j].segments[k].operating_airline_code+`.png"><span> </span>`;
                                }else{
                                    text+=`<span style="font-size:13px; font-weight:500;">`+airline_carriers[price_itinerary_temp[i].journeys[j].segments[k].carrier_code].name+` (`+price_itinerary_temp[i].journeys[j].segments[k].carrier_code+price_itinerary_temp[i].journeys[j].segments[k].carrier_number+`)</span><br/>`
                                    text+=`<img data-toggle="tooltip" alt="`+airline_carriers[price_itinerary_temp[i].journeys[j].segments[k].carrier_code].name+`" title="`+airline_carriers[price_itinerary_temp[i].journeys[j].segments[k].carrier_code].name+`" style="margin-top:10px; width:50px; height:50px; margin-right:10px;" src="`+static_path_url_server+`/public/airline_logo/`+price_itinerary_temp[i].journeys[j].segments[k].carrier_code+`.png"><span> </span>`;
                                }
                                $text += airline_carriers[price_itinerary_temp[i].journeys[j].segments[k].carrier_code].name + ' (' + price_itinerary_temp[i].journeys[j].segments[k].carrier_code + price_itinerary_temp[i].journeys[j].segments[k].carrier_number + ') ';
                            }catch(err){
                                // carrier tidak ketemu di dict
                                if(price_itinerary_temp[i].journeys[j].segments[k].carrier_code != price_itinerary_temp[i].journeys[j].segments[k].operating_airline_code && price_itinerary_temp[i].journeys[j].segments[k].operating_airline_code != ''){
                                    text+=`<span style="font-size:13px; font-weight:500;">Operated By`+price_itinerary_temp[i].journeys[j].segments[k].operating_airline_code+` (`+price_itinerary_temp[i].journeys[j].segments[k].carrier_code+price_itinerary_temp[i].journeys[j].segments[k].carrier_number+`)</span><br/>`
                                    text+=`<img data-toggle="tooltip" alt="`+price_itinerary_temp[i].journeys[j].segments[k].operating_airline_code+`" title="`+price_itinerary_temp[i].journeys[j].segments[k].operating_airline_code+`" style="margin-top:10px; width:50px; height:50px; margin-right:10px;" src="`+static_path_url_server+`/public/airline_logo/`+price_itinerary_temp[i].journeys[j].segments[k].operating_airline_code+`.png"><span> </span>`;
                                }else{
                                    text+=`<span style="font-size:13px; font-weight:500;">`+price_itinerary_temp[i].journeys[j].segments[k].carrier_code+` (`+price_itinerary_temp[i].journeys[j].segments[k].carrier_code+price_itinerary_temp[i].journeys[j].segments[k].carrier_number+`)</span><br/>`
                                    text+=`<img data-toggle="tooltip" alt="`+price_itinerary_temp[i].journeys[j].segments[k].carrier_code+`" title="`+price_itinerary_temp[i].journeys[j].segments[k].carrier_code+`" style="margin-top:10px; width:50px; height:50px; margin-right:10px;" src="`+static_path_url_server+`/public/airline_logo/`+price_itinerary_temp[i].journeys[j].segments[k].carrier_code+`.png"><span> </span>`;
                                }
                                $text += price_itinerary_temp[i].journeys[j].segments[k].carrier_code + ' (' + price_itinerary_temp[i].journeys[j].segments[k].carrier_code + price_itinerary_temp[i].journeys[j].segments[k].carrier_number + ') ';
                            }
                            for(l in price_itinerary_temp[i].journeys[j].segments[k].fares){
                                if(is_citilink && price_itinerary_temp[i].journeys[j].segments[k].fares[l].cabin_class == 'W')
                                    $text += airline_cabin_class_list['W1'] + ' (' + price_itinerary_temp[i].journeys[j].segments[k].fares[l].class_of_service + ')';
                                else
                                    $text += airline_cabin_class_list[price_itinerary_temp[i].journeys[j].segments[k].fares[l].cabin_class];
                                $text += ' (' + price_itinerary_temp[i].journeys[j].segments[k].fares[l].class_of_service + ')\n';
                            }
                            //OPERATED BY
                            try{
                                if(price_itinerary_temp[i].journeys[j].segments[k].carrier_code != price_itinerary_temp[i].journeys[j].segments[k].operating_airline_code && price_itinerary_temp[i].journeys[j].segments[k].operating_airline_code != ''){
                                    $text += 'Operated By ' + airline_carriers[price_itinerary_temp[i].journeys[j].segments[k].operating_airline_code].name + '\n';
                                }
                            }catch(err){
                                if(price_itinerary_temp[i].journeys[j].segments[k].carrier_code != price_itinerary_temp[i].journeys[j].segments[k].operating_airline_code && price_itinerary_temp[i].journeys[j].segments[k].operating_airline_code != ''){
                                    $text += 'Operated By ' + price_itinerary_temp[i].journeys[j].segments[k].operating_airline_code + '\n';
                                }
                            }

        //                    $text += '\n\n';
        //                    $text += '‣ Departure:\n';
        //                    $text += price_itinerary_temp[i].journeys[j].segments[k].origin_name + ' (' + price_itinerary_temp[i].journeys[j].segments[k].origin_city + ') ' + price_itinerary_temp[i].journeys[j].segments[k].departure_date + '\n';

        //                    $text += '\n';
        //                    $text += '‣ Arrival:\n';
        //                    $text += price_itinerary_temp[i].journeys[j].segments[k].destination_name + ' (' + price_itinerary_temp[i].journeys[j].segments[k].destination_city + ') '+price_itinerary_temp[i].journeys[j].segments[k].arrival_date +'\n\n';

                            $text += '\n'+price_itinerary_temp[i].journeys[j].segments[k].origin_city + ' (' + price_itinerary_temp[i].journeys[j].segments[k].origin + ') - ' + price_itinerary_temp[i].journeys[j].segments[k].destination_city + ' (' + price_itinerary_temp[i].journeys[j].segments[k].destination + ')\n';
                            $text += 'Departure Date: '+price_itinerary_temp[i].journeys[j].segments[k].departure_date+'\n';
                            $text += 'Arrival Date: '+price_itinerary_temp[i].journeys[j].segments[k].arrival_date +'\n\n';
                            text+=`
                            <div class="row">
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                    <table style="width:100%">
                                        <tr>
                                            <td class="airport-code"><h5>`+price_itinerary_temp[i].journeys[j].segments[k].departure_date.split(' - ')[1]+`</h5></td>
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
                                    <span style="font-size:13px;">`+price_itinerary_temp[i].journeys[j].segments[k].departure_date.split(' - ')[0]+`</span></br>
                                    <span style="font-size:13px; font-weight:500;">`+price_itinerary_temp[i].journeys[j].segments[k].origin_city+` (`+price_itinerary_temp[i].journeys[j].segments[k].origin+`)</span><br/>`;

                                    if(price_itinerary_temp[i].journeys[j].segments[k].origin_terminal != ''){
                                        text+=`<span style="font-size:13px; font-weight:500;">Terminal: `+price_itinerary_temp[i].journeys[j].segments[k].origin_terminal+`</span><br/>`;
                                    }else{
                                        text+=`<span style="font-size:13px; font-weight:500;">Terminal: -</span><br/>`;
                                    }
                                text+=`
                                </div>
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                    <table style="width:100%; margin-bottom:6px;">
                                        <tr>
                                            <td><h5>`+price_itinerary_temp[i].journeys[j].segments[k].arrival_date.split(' - ')[1]+`</h5></td>
                                            <td></td>
                                            <td style="height:30px;padding:0 15px;width:100%"></td>
                                        </tr>
                                    </table>
                                    <span style="font-size:13px;">`+price_itinerary_temp[i].journeys[j].segments[k].arrival_date.split(' - ')[0]+`</span><br/>
                                    <span style="font-size:13px; font-weight:500;">`+price_itinerary_temp[i].journeys[j].segments[k].destination_city+` (`+price_itinerary_temp[i].journeys[j].segments[k].destination+`)</span><br/>`;
                                    if(price_itinerary_temp[i].journeys[j].segments[k].destination_terminal != ''){
                                        text+=`<span style="font-size:13px; font-weight:500;">Terminal: `+price_itinerary_temp[i].journeys[j].segments[k].destination_terminal+`</span><br/>`;
                                    }else{
                                        text+=`<span style="font-size:13px; font-weight:500;">Terminal: - </span><br/>`;
                                    }
                                text+=`
                                </div>
                            </div>`;

                            if(price_itinerary_temp[i].journeys[j].segments[k].fares.length > 0){
                                text += `<span><b>`;
                                if(price_itinerary_temp[i].journeys[j].segments[k].fares[0].cabin_class != '')
                                    if(price_itinerary_temp[i].journeys[j].segments[k].fares[0].cabin_class == 'Y')
                                        text += 'Economy - ';
                                    else if(price_itinerary_temp[i].journeys[j].carrier_code_list.includes('QG') && price_itinerary_temp[i].journeys[j].segments[k].fares[0].cabin_class == 'W')
                                        text += ' (Royal Green)';
                                    else if(price_itinerary_temp[i].journeys[j].segments[k].fares[0].cabin_class == 'W')
                                        text += 'Premium Economy - ';
                                    else if(price_itinerary_temp[i].journeys[j].segments[k].fares[0].cabin_class == 'C')
                                        text += 'Business - ';
                                    else if(price_itinerary_temp[i].journeys[j].segments[k].fares[0].cabin_class == 'F')
                                        text += 'First Class - ';
                                text+=`Class: ` + price_itinerary_temp[i].journeys[j].segments[k].fares[0].class_of_service;
                                text+=`</b></span><br/><br/>`;

                                if(k == price_itinerary_temp[i].journeys[j].segments.length-1){
                                    if(provider_list_data[price_itinerary_temp[i].provider].is_post_issued_reschedule)
                                        text+=`
                                            <br/><span style="font-weight:bold;"><i class="fas fa-check-circle" style="color:#4f9c64;"></i> Reschedule</span>`;
                                    if(price_itinerary_temp[i].hasOwnProperty('is_ssr') && price_itinerary_temp[i].is_ssr)
                                        text+=`
                                            <br/><span style="font-weight:bold;"><i class="fas fa-check-circle" style="color:#4f9c64;"></i> SSR</span>`;
                                    if(price_itinerary_temp[i].hasOwnProperty('is_seat') && price_itinerary_temp[i].is_seat)
                                        text+=`
                                            <br/><span style="font-weight:bold;"><i class="fas fa-check-circle" style="color:#4f9c64;"></i> Seat</span>`;
        //                            if(provider_list_data[price_itinerary_temp[i].provider].is_post_issued_cancel)
        //                                text+=`
        //                                    <br/><span style="font-weight:bold;"><i class="fas fa-check-circle" style="color:#4f9c64;"></i> Refund</span>`;
                                }
                            }

                            for(l in price_itinerary_temp[i].journeys[j].segments[k].legs){

                            }
                            if(price_itinerary_temp[i].journeys[j].segments[k].fares.length > 0 ){
                                for(l in price_itinerary_temp[i].journeys[j].segments[k].fares){
                                    if(price_itinerary_temp[i].journeys[j].segments[k].fares[l].service_charge_summary.length > 0){

                                    //price
                                    price = 0;
                                    //adult
                                    $text+= 'Price\n';
                                    text+=`<br/>`;
                                        try{//adult
                                            if(airline_request.adult != 0){
                                                try{
                                                    if(airline_price[price_counter].ADT['roc'] != null)
                                                        price = airline_price[i].ADT['roc'];
                                                    if(airline_price[price_counter].ADT.tax != null)
                                                        price += airline_price[price_counter].ADT.tax;
                                                }catch(err){

                                                }
                                                commission = 0;
                                                if(airline_price[price_counter].ADT['rac'] != null)
                                                    commission = airline_price[price_counter].ADT['rac']
                                                commission_price += commission;
                                                total_price += (airline_request.adult * airline_price[price_counter].ADT['fare']) + price;
                                                text+=`
                                                    <div class="row" style="padding:5px;">
                                                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="text-align:left;">
                                                            <hr/>
                                                        </div>
                                                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="text-align:left;">
                                                            <span style="font-size:13px; font-weight:500;">`+airline_request.adult+`x Adult Fare @`+airline_price[price_counter].ADT.currency +' '+getrupiah(Math.ceil(airline_price[price_counter].ADT.fare))+`</span><br/>
                                                        </div>
                                                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="text-align:left;">
                                                            <span style="font-size:13px; font-weight:500;">    Service Charge `+airline_price[price_counter].ADT.currency+` `+getrupiah(Math.ceil(price))+`</span>
                                                        </div>
                                                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="text-align:right;">
                                                            <span style="font-size:13px; font-weight:500;">`+airline_price[price_counter].ADT.currency+` `+getrupiah(Math.ceil((airline_price[price_counter].ADT.fare * airline_request.adult) +price))+`</span>
                                                        </div>
                                                        <div class="col-lg-12">
                                                            <hr style="border:1px solid #e0e0e0; margin-top:5px; margin-bottom:5px;"/>
                                                        </div>
                                                   </div>`;
                                                $text += airline_request.adult + ' Adult Fare @'+ airline_price[price_counter].ADT.currency +' '+getrupiah(Math.ceil(airline_price[price_counter].ADT.fare))+'\n';
                                                $text += 'Adult Tax '+ airline_price[price_counter].ADT.currency +' '+getrupiah(Math.ceil(price))+'\n';
                                                price = 0;
                                                total_price_provider.push({
                                                    'provider': price_itinerary_temp[i].provider,
                                                    'price': airline_price[price_counter].ADT
                                                });
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
                                                text+=`
                                                    <div class="row" style="padding:5px;">
                                                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="text-align:left;">
                                                            <span style="font-size:13px; font-weight:500;">`+airline_request.child+`x Child Fare @`+airline_price[price_counter].CHD.currency +' '+getrupiah(Math.ceil(airline_price[price_counter].CHD.fare))+`</span><br/>
                                                        </div>
                                                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="text-align:left;">
                                                            <span style="font-size:13px; font-weight:500;">Service Charge `+airline_price[price_counter].CHD.currency+` `+getrupiah(Math.ceil(price))+`</span>
                                                        </div>
                                                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="text-align:right;">
                                                            <span style="font-size:13px; font-weight:500;">`+airline_price[price_counter].CHD.currency+` `+getrupiah(Math.ceil((airline_price[price_counter].CHD.fare * airline_request.child)+price))+`</span>
                                                        </div>
                                                        <div class="col-lg-12">
                                                            <hr style="border:1px solid #e0e0e0; margin-top:5px; margin-bottom:5px;"/>
                                                        </div>
                                                    </div>`;
                                                $text += airline_request.child + ' Child Fare @'+ airline_price[price_counter].CHD.currency +' '+getrupiah(Math.ceil(airline_price[price_counter].CHD.fare))+'\n';
                                                $text += 'Child Tax '+ airline_price[price_counter].CHD.currency +' '+getrupiah(Math.ceil(price))+'\n';
                                                price = 0;
                                                total_price_provider.push({
                                                    'provider': price_itinerary_temp[i].provider,
                                                    'price': airline_price[price_counter].CHD
                                                });
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
                                                text+=`
                                                    <div class="row" style="padding:5px;">
                                                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="text-align:left;">
                                                            <span style="font-size:13px; font-weight:500;">`+airline_request.infant+`x Infant Fare @`+airline_price[price_counter].INF.currency +' '+getrupiah(Math.ceil(airline_price[price_counter].INF.fare))+`</span><br/>
                                                        </div>
                                                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="text-align:left;">
                                                            <span style="font-size:13px; font-weight:500;">    Service Charge `+airline_price[price_counter].INF.currency+` `+getrupiah(Math.ceil(price))+`</span>
                                                        </div>
                                                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="text-align:right;">
                                                            <span style="font-size:13px; font-weight:500;">`+airline_price[price_counter].INF.currency+` `+getrupiah(Math.ceil((airline_price[price_counter].INF.fare * airline_request.infant)+price))+`</span>
                                                        </div>
                                                        <div class="col-lg-12">
                                                            <hr style="border:1px solid #e0e0e0; margin-top:5px; margin-bottom:5px;"/>
                                                        </div>
                                                    </div>`;
                                                $text += airline_request.infant + ' Infant Fare @'+ airline_price[price_counter].INF.currency +' '+getrupiah(Math.ceil(airline_price[price_counter].INF.fare+price))+'\n';
                                                $text += 'Infant Tax '+ airline_price[price_counter].INF.currency +' '+getrupiah(Math.ceil(price))+'\n';
                                                price = 0;
                                                total_price_provider.push({
                                                    'provider': price_itinerary_temp[i].provider,
                                                    'price': airline_price[price_counter].INF
                                                });
                                            }
                                        }catch(err){

                                        }
                                        price_counter++;
                                        $text += '\n';
                                    }
                                }
                            }
                        }

        //                if(provider_list_data[price_itinerary_temp[i].provider].is_post_issued_reschedule)
        //                    text+=`
        //                        <br/><span style="font-weight:bold;"><i class="fas fa-check-circle" style="color:#4f9c64;"></i> Reschedule</span>`;
        //                if(provider_list_data[price_itinerary_temp[i].provider].is_post_issued_cancel)
        //                    text+=`
        //                        <br/><span style="font-weight:bold;"><i class="fas fa-check-circle" style="color:#4f9c64;"></i> Refund</span>`;

        //                text+=`<div class="row"><div class="col-lg-12"><hr/></div></div>`;

                        text+=`</div>`;
                    }
                }

        text+=`</div>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-7" style="text-align:left;">
                <label>Additional Price</label><br/>
            </div>
            <div class="col-lg-5" style="text-align:right;">`;
            if(airline_price[0].ADT.currency == 'IDR')
            text+=`
                <label id="additional_price">`+getrupiah(additional_price)+`</label><br/>`;
            else
            text+=`
                <label id="additional_price">`+additional_price+`</label><br/>`;
            text+=`
                <input type="hidden" name="additional_price" id="additional_price_hidden"/>
            </div>`;
            try{
                if(upsell_price != 0){
                    text+=`<div class="col-lg-7" style="text-align:left;">
                        <label>Other Service Charge</label><br/>
                    </div>
                    <div class="col-lg-5" style="text-align:right;">`;
                    if(airline_price[0].ADT.currency == 'IDR')
                    text+=`
                        <label>`+airline_price[0].ADT.currency+` `+getrupiah(upsell_price)+`</label><br/>`;
                    else
                    text+=`
                        <label>`+airline_price[0].ADT.currency+` `+upsell_price+`</label><br/>`;
                    text+=`</div>`;
                }
            }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
            }
            try{
                if(total_discount != 0){
                    text+=`<div class="col-lg-7" style="text-align:left;">
                        <label>Discount</label><br/>
                    </div>
                    <div class="col-lg-5" style="text-align:right;">`;
                    if(airline_price[0].ADT.currency == 'IDR')
                    text+=`
                        <label>`+airline_price[0].ADT.currency+` `+getrupiah(total_discount)+`</label><br/>`;
                    else
                    text+=`
                        <label>`+airline_price[0].ADT.currency+` `+total_discount+`</label><br/>`;
                    text+=`</div>`;
                }
            }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
            }
            text+=`
            <div class="col-lg-7" style="text-align:left;">
                <span style="font-size:14px; font-weight:bold;"><b>Total</b></span><br/>
            </div>
            <div class="col-lg-5" style="text-align:right;">`;
            try{
                grand_total_price = total_price;
                grand_total_price += parseFloat(additional_price)
                grand_total_price += upsell_price;
            }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
            }
            if(airline_price[0].ADT.currency == 'IDR'){
                text+=`
                    <span style="font-size:14px; font-weight:bold;" id="total_price"><b> `+airline_price[i].ADT.currency+` `+getrupiah(grand_total_price+total_discount)+`</b></span><br/>`;
            }else{
                text+=`
                    <span style="font-size:14px; font-weight:bold;" id="total_price"><b> `+airline_price[i].ADT.currency+` `+parseFloat(grand_total_price+total_discount)+`</b></span><br/>`;
            }
            text+=`
            </div>
        </div>`;
        if(document.URL.split('/')[document.URL.split('/').length-1] == 'review'){
            tax = 0;
            fare = 0;
            total_price = 0;
            price_provider = 0;
            commission = 0;
            service_charge = ['FARE', 'RAC', 'ROC', 'TAX', 'SSR', 'DISC'];
            type_amount_repricing = ['Repricing'];
            for(i in passengers){
                if(i != 'booker' && i != 'contact'){
                    for(j in passengers[i]){
                        pax_type_repricing.push([passengers[i][j].first_name +passengers[i][j].last_name, passengers[i][j].first_name +passengers[i][j].last_name]);
                        price_arr_repricing[passengers[i][j].first_name +passengers[i][j].last_name] = {
                            'Fare': 0,
                            'Tax': 0,
                            'Repricing': 0
                        }
                    }
                }
            }
            //repricing
            text_repricing = `
            <div class="col-lg-12">
                <div style="padding:5px;" class="row">
                    <div class="col-lg-6"></div>
                    <div class="col-lg-6">Repricing</div>
                </div>
            </div>`;
            for(k in price_arr_repricing){
               text_repricing += `
               <div class="col-lg-12">
                    <div style="padding:5px;" class="row" id="adult">
                        <div class="col-lg-6" id="`+j+`_`+k+`">`+k+`</div>
                        <div hidden id="`+k+`_price">`+getrupiah(price_arr_repricing[k].Fare + price_arr_repricing[k].Tax)+`</div>`;
                        if(price_arr_repricing[k].Repricing == 0)
                        text_repricing+=`<div class="col-lg-6" id="`+k+`_repricing">-</div>`;
                        else
                        text_repricing+=`<div class="col-lg-6" id="`+k+`_repricing">`+getrupiah(price_arr_repricing[k].Repricing)+`</div>`;
                        text_repricing+=`<div hidden id="`+k+`_total">`+getrupiah(price_arr_repricing[k].Fare + price_arr_repricing[k].Tax + price_arr_repricing[k].Repricing)+`</div>
                    </div>
                </div>`;
            }
            text_repricing += `<div id='repricing_button' class="col-lg-12" style="text-align:center;"></div>`;
            document.getElementById('repricing_div').innerHTML = text_repricing;
            //repricing
        }
        if(document.URL.split('/')[document.URL.split('/').length-1] == 'review' && user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false){
            text+=`<div style="text-align:right;"><img src="/static/tt_website_rodextrip/img/bank.png" alt="Bank" style="width:25px; height:25px; cursor:pointer;" onclick="show_repricing();"/></div>`;
        }
        text+=`
        <div class="row">
            <div class="col-lg-12" style="padding-bottom:10px;">
                <hr/>
                <span style="font-size:14px; font-weight:bold;">Share This on:</span><br/>`;

                $text += '‣ Grand Total: '+airline_price[0].ADT.currency+' '+ getrupiah(grand_total_price) + '\nPrices and availability may change at any time';

                share_data();
                var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                if (isMobile) {
                    text+=`
                        <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" alt="Whatsapp" src="/static/tt_website_rodextrip/img/whatsapp.png"/></a>
                        <a href="line://msg/text/`+ $text_share +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" alt="Line" src="/static/tt_website_rodextrip/img/line.png"/></a>
                        <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" alt="Telegram" src="/static/tt_website_rodextrip/img/telegram.png"/></a>
                        <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" alt="Email" src="/static/tt_website_rodextrip/img/email.png"/></a>`;
                } else {
                    text+=`
                        <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" alt="Whatsapp" src="/static/tt_website_rodextrip/img/whatsapp.png"/></a>
                        <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" alt="Line" src="/static/tt_website_rodextrip/img/line.png"/></a>
                        <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" alt="Telegram" src="/static/tt_website_rodextrip/img/telegram.png"/></a>
                        <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" alt="Email" src="/static/tt_website_rodextrip/img/email.png"/></a>`;
                }

            text+=`
            </div>
        </div>`;
        if(user_login.co_agent_frontend_security.includes('see_commission') == true && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
            text+=`
            <div class="row" id="show_commission" style="display:block;">
                <div class="col-lg-12 col-xs-12">
                    <div class="alert alert-success">
                        <div style="text-align:center;">
                            <span style="font-size:13px; font-weight: bold;">YPM: IDR `+getrupiah(commission_price*-1)+`</span>
                        </div>`;
            text_notes = '';
            for(x in airline_pick){
                if(airline_pick[x].provider.includes('lionair'))
                    text_notes = '* Lion Air YPM is shown after booking';
            }
            if(text_notes == '')
                text_notes = '* Please mark up the price first'
            if(commission_price == 0)
                text +=`
                        <div style="text-align:left;">
                            <span style="font-size:13px;color:red">`+text_notes+`</span>
                        </div>`;
            text+=`</div>
                </div>
            </div>`;
        text+=`
        <div style="padding-bottom:10px;">
            <center>
                <input type="button" class="primary-btn-white" style="width:100%;" onclick="copy_data();" value="Copy"/>
            </center>
        </div>`;
        if(user_login.co_agent_frontend_security.includes('see_commission') == true && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
            text+=`
            <div style="padding-bottom:10px;">
                <center>
                    <input type="button" class="primary-btn-white" style="width:100%;" onclick="show_commission('commission');" id="show_commission_button" value="Hide YPM"/><br/>
                </center>
            </div>`;
    }else if(type == 'request_new'){
        $text = '';
        text += `
        <div class="row" style="margin-bottom:5px; ">
            <div class="col-lg-12">
               <h4> Price Detail </h4>
               <hr/>
            </div>
        </div>`;
        flight_count = 0;
        for(i in airline_get_detail.provider_bookings){
            for(j in airline_get_detail.provider_bookings[i].journeys){
                if(airline_get_detail.provider_bookings[i].journeys[j].journey_type == 'COM'){
                    //combo
                    text += `<h6>Combo Price</h6>`;
                    $text +='Combo Price\n';
                }else{
                    //no combo
                    if(airline_get_detail.provider_bookings[i].journeys[j].journey_type == 'DEP'){
                        text += `<h6>Departure</h6>`;
                            $text +='Departure\n';
                    }else if(airline_get_detail.provider_bookings[i].journeys[j].journey_type == 'RET'){
                        text += `<div class="row">
                                    <div class="col-lg-12" style="margin-bottom:5px;margin-top:2px;">
                                        <h6>Return</h6>`;
                        $text +='Return\n';
                    }else{
                        text += `<h6>Flight `+parseInt(flight_count+1)+`</h6>`
                    }
                }
                for(k in airline_get_detail.provider_bookings[i].journeys[j].segments){
                    text += `
                    <div class="row">
                        <div class="col-lg-12">`;
                    try{
                        text+=`<img data-toggle="tooltip" alt="`+airline_carriers[airline_get_detail.provider_bookings[i].journeys[j].segments[k].carrier_code].name+`" title="`+airline_carriers[airline_get_detail.provider_bookings[i].journeys[j].segments[k].carrier_code].name+`" style="width:50px; height:50px;" src="`+static_path_url_server+`/public/airline_logo/`+airline_get_detail.provider_bookings[i].journeys[j].segments[k].carrier_code+`.png"><span> </span>`;
                    }catch(err){
                        text+=`<img data-toggle="tooltip" alt="Airline" title="" style="width:50px; height:50px;" src="`+static_path_url_server+`/public/airline_logo/`+airline_get_detail.provider_bookings[i].journeys[j].segments[k].carrier_code+`.png"><span> </span>`;
                    }
                    text+=`</div>`;
                    if(airline_get_detail.provider_bookings[i].journeys[j].journey_type == 'COM'){
                        text += `<div class="col-lg-12" style="margin-bottom:5px;"><h6>Flight `+parseInt(flight_count+1)+`</h6></div>`;
                        $text +='Flight'+parseInt(flight_count+1)+'\n';
                        flight_count++;
                    }
                    //datacopy
                    if(airline_get_detail.provider_bookings[i].journeys[j].segments[k].journey_type == 'DEP'){
                        $text += airline_carriers[airline_get_detail.provider_bookings[i].journeys[j].segments[k].carrier_code].name + ' ' + airline_get_detail.provider_bookings[i].journeys[j].segments[k].carrier_code + airline_get_detail.provider_bookings[i].journeys[j].segments[k].carrier_number + '\n';
                        $text += airline_get_detail.provider_bookings[i].journeys[j].segments[k].departure_date + ' → ' + airline_get_detail.provider_bookings[i].journeys[j].segments[k].arrival_date + '\n';
                        $text += airline_get_detail.provider_bookings[i].journeys[j].segments[k].origin_name + ' (' + airline_get_detail.provider_bookings[i].journeys[j].segments[k].origin_city + ') - ';
                        $text += airline_get_detail.provider_bookings[i].journeys[j].segments[k].destination_name + ' (' + airline_get_detail.provider_bookings[i].journeys[j].segments[k].destination_city + ')\n\n';

                    }else if(airline_get_detail.provider_bookings[i].journeys[j].segments[k].journey_type == 'RET'){
                        $text += airline_carriers[airline_get_detail.provider_bookings[i].journeys[j].segments[k].carrier_code].name + ' ' + airline_get_detail.provider_bookings[i].journeys[j].segments[k].carrier_code + airline_get_detail.provider_bookings[i].journeys[j].segments[k].carrier_number + '\n';
                        $text += airline_get_detail.provider_bookings[i].journeys[j].segments[k].departure_date + ' → ' + airline_get_detail.provider_bookings[i].journeys[j].segments[k].arrival_date + '\n';
                        $text += airline_get_detail.provider_bookings[i].journeys[j].segments[k].origin_name + ' (' + airline_get_detail.provider_bookings[i].journeys[j].segments[k].origin_city + ') - ';
                        $text += airline_get_detail.provider_bookings[i].journeys[j].segments[k].destination_name + ' (' + airline_get_detail.provider_bookings[i].journeys[j].segments[k].destination_city + ')\n\n';
                    }
                    text+=`
                        <div class="col-lg-12">
                            <div class="row">
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                    <table style="width:100%">
                                        <tr>
                                            <td class="airport-code"><h5>`+airline_get_detail.provider_bookings[i].journeys[j].segments[k].departure_date.split('  ')[1]+`</h5></td>
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
                                    <span style="font-size:13px;">`+airline_get_detail.provider_bookings[i].journeys[j].segments[k].departure_date.split('  ')[0]+`</span></br>
                                    <span style="font-size:13px; font-weight:500;">`+airline_get_detail.provider_bookings[i].journeys[j].segments[k].origin_city+` (`+airline_get_detail.provider_bookings[i].journeys[j].segments[k].origin+`)</span>
                                </div>
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                    <table style="width:100%; margin-bottom:6px;">
                                        <tr>
                                            <td><h5>`+airline_get_detail.provider_bookings[i].journeys[j].segments[k].arrival_date.split('  ')[1]+`</h5></td>
                                            <td></td>
                                            <td style="height:30px;padding:0 15px;width:100%"></td>
                                        </tr>
                                    </table>
                                    <span style="font-size:13px;">`+airline_get_detail.provider_bookings[i].journeys[j].segments[k].arrival_date.split('  ')[0]+`</span><br/>
                                    <span style="font-size:13px; font-weight:500;">`+airline_get_detail.provider_bookings[i].journeys[j].segments[k].destination_city+` (`+airline_get_detail.provider_bookings[i].journeys[j].segments[k].destination+`)</span>
                                </div>
                            </div>
                            <hr/>
                        </div>
                    </div>`;
                }
                flight_count++;
            }
        }
        //getprice
        $text+= 'Price\n';
        total_price = 0;
        currency = ''
        for(i in airline_get_detail.passengers[0].sale_service_charges){
            text += `<div class="row">
                        <div class="col-lg-12">
            `;
            for(j in airline_get_detail.passengers){
                for(k in airline_get_detail.passengers[j].sale_service_charges){
                    for(l in airline_get_detail.passengers[j].sale_service_charges[k]){
                        currency = airline_get_detail.passengers[j].sale_service_charges[k][l].currency;
                        break
                    }
                    break;
                }
                break;

            }
            text+=`</div>`;
        }
        text += `
            <div class="col-lg-7" style="text-align:left;">
                <label>Additional Price</label><br/>
            </div>
            <div class="col-lg-5" style="text-align:right;">`;
            if(currency == 'IDR')
            text+=`
                <label id="additional_price">`+currency+` `+getrupiah(additional_price)+`</label><br/>`;
            else
            text+=`
                <label id="additional_price">`+additional_price+`</label><br/>`;
            text+=`
            </div>
            <div class="col-lg-7" style="text-align:left;">
                <span style="font-size:14px; font-weight:bold;"><b>Total</b></span><br/>
            </div>
            <div class="col-lg-5" style="text-align:right;">`;
            if(airline_get_detail.passengers[j].sale_service_charges[k][l].currency == 'IDR')
            text+=`
                <span style="font-size:14px; font-weight:bold;" id="total_price"><b>`+currency+` `+getrupiah(parseFloat(total_price+parseFloat(additional_price)))+`</b></span><br/>`;
            else
            text+=`
                <span style="font-size:14px; font-weight:bold;" id="total_price"><b>`+getrupiah(total_price+additional_price)+`</b></span><br/>`;
            text+=`
            </div>`;
    }
    else if(type == 'reschedule'){
        try{
            document.getElementById('additional_price_information_rs').innerHTML = `
                <div class="row">
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                        <span style="font-size:13px; font-weight:500;">Additional Price</span>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                        <span style="font-size:13px; font-weight:500;">`+currency+` `+getrupiah(Math.ceil(additional_price))+`</span>
                    </div>
                </div>
            `;
            document.getElementById('additional_price_information_rs').hidden = false;
            document.getElementById('total_price_rs').innerHTML = `<b>`+currency+` `+getrupiah(Math.ceil(total_price+additional_price))+`</b>`;
        }catch(err){
            console.log(err); // error kalau ada element yg tidak ada
        }
    }


    if(type != 'reschedule'){
        try{
            document.getElementById('airline_detail').innerHTML = text;
            for(i in price_itinerary_temp){
                for(j in price_itinerary_temp[i].journeys){
                   if(price_itinerary_temp[i].journeys[j].hasOwnProperty('search_banner')){
                       for(banner_counter in price_itinerary_temp[i].journeys[j].search_banner){
                           var max_banner_date = moment().subtract(parseInt(-1*price_itinerary_temp[i].journeys[j].search_banner[banner_counter].minimum_days), 'days').format('YYYY-MM-DD');
                           var selected_banner_date = moment(price_itinerary_temp[i].journeys[j].departure_date.split(' - ')[0]).format('YYYY-MM-DD');
                           if(selected_banner_date >= max_banner_date){
                               if(price_itinerary_temp[i].journeys[j].search_banner[banner_counter].active == true && price_itinerary_temp[i].journeys[j].search_banner[banner_counter].description != ''){
                                   new jBox('Tooltip', {
                                        attach: '#pop_search_banner_detail'+i+j+banner_counter,
                                        theme: 'TooltipBorder',
                                        width: 280,
                                        position: {
                                          x: 'center',
                                          y: 'bottom'
                                        },
                                        closeOnMouseleave: true,
                                        animation: 'zoomIn',
                                        content: price_itinerary_temp[i].journeys[j].search_banner[banner_counter].description
                                   });
                               }
                           }
                       }
                   }
                }
            }
        }catch(err){
            console.log(err); // error kalau ada element yg tidak ada
        }
    }


    try{
        if(document.URL.split('/')[document.URL.split('/').length-1] == 'review'){

            $text += '\n\nContact:\n';
            $text += passengers.contact[0].title + ' ' + passengers.contact[0].first_name + ' ' + passengers.contact[0].last_name + '\n';
            $text += passengers.contact[0].email + '\n';
            $text += passengers.contact[0].calling_code + ' - ' +passengers.contact[0].mobile + '\n\n';

            for(i in passengers.adult){
                if(i == 0)
                    $text += 'Passengers:\n';
                $text += passengers.adult[i].title + ' ' + passengers.adult[i].first_name + ' ' + passengers.adult[i].last_name + ' ';
                for(j in passengers.adult[i].ssr_list){
                    $text += passengers.adult[i].ssr_list[j].name;
                    if(parseInt(parseInt(j)+1) != passengers.adult[i].ssr_list.length)
                        $text += ', ';
                }
                for(j in passengers.adult[i].seat_list){
                    $text += ', ' + passengers.adult[i].seat_list[j].seat_pick;
                }
                if(passengers.adult[i].birth_date != '')
                    $text += ' (ADT / ' + passengers.adult[i].birth_date + ')\n';
                else
                    $text += ' (ADT)\n';
            }
            for(i in passengers.child){
                $text += passengers.child[i].title + ' ' + passengers.child[i].first_name + ' ' + passengers.child[i].last_name + ' (CHD / ' + passengers.child[i].birth_date + ')\n';
            }
            for(i in passengers.infant){
                $text += passengers.infant[i].title + ' ' + passengers.infant[i].first_name + ' ' + passengers.infant[i].last_name + ' (INF / ' + passengers.infant[i].birth_date + ')\n';
            }
            $text += '\n';
        }
    }catch(err){

    }

}

function on_change_ssr(){
    additional_price = 0;
    for(i in passengers){
        for(j in passengers[i].seat_list){
            if(isNaN(parseInt(passengers[i].seat_list[j].price)) == false)
                additional_price += parseInt(passengers[i].seat_list[j].price);
        }
    }

    for(i=1;i<=len_passenger;i++){
        for(j in ssr_keys){
            for(k=1;k<=ssr_keys[j].len;k++){
                if(document.getElementById(ssr_keys[j].key+'_'+ssr_keys[j].provider+'_'+i+'_'+k).value != '')
                    additional_price += parseInt(document.getElementById(ssr_keys[j].key+'_'+ssr_keys[j].provider+'_'+i+'_'+k).value.split('_')[1])
            }
        }
    }
    airline_detail(type);
}

function update_identity(type, val){
     if(is_identity_required == 'true' || is_international == 'true')
        document.getElementById(type+'_identity_type'+val).style.display = 'block';
     else if(is_identity_required == 'false'){
        document.getElementById(type+'_identity_type'+val).style.display = 'none';
        document.getElementById(type+'_passport_number'+val).value = '';
        try{
            document.getElementById(type+'_identity_type'+val).value = '';
        }catch(err){}
        try{
            document.getElementById(type+'_id_type'+val).value = '';
        }catch(err){}
        document.getElementById(type+'_passport_expired_date'+val).value = '';
        document.getElementById('select2-'+type+'_country_of_issued'+val+'_id-container').innerHTML = 'Country of Issued';
        document.getElementById(type+'_country_of_issued'+val).value = '';
        $('#'+type+'_identity_type'+val).niceSelect('update');
    }
}

function check_passenger(adult, child, infant){
    //booker
    error_log = '';
    //check booker jika teropong
    length_name = 100;
    for(j in airline_pick){
       for(k in airline_pick[j].journeys){
            for(l in airline_pick[j].journeys[k].carrier_code_list){
                if(length_name > airline_carriers[airline_pick[j].journeys[k].carrier_code_list[l]].adult_length_name)
                    length_name = airline_carriers[airline_pick[j].journeys[k].carrier_code_list[l]].adult_length_name;
            }
       }
    }
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
    }if(document.getElementById('booker_nationality').value == ''){
        error_log+= 'Please fill booker nationality!</br>\n';
        $("#booker_nationality").each(function() {
          $(this).siblings(".select2-container").css('border', '1px solid red');
        });
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

   for(i in airline_pick){
        for(j in airline_pick[i].journeys){
            last_departure_date = airline_pick[i].journeys[j].departure_date.split(' - ')[0];
        }
   }
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
       if(birth_date_required == true){
           if(check_date(document.getElementById('adult_birth_date'+i).value)==false){
               error_log+= 'Birth date wrong for passenger adult '+i+'!</br>\n';
               document.getElementById('adult_birth_date'+i).style['border-color'] = 'red';
           }else{
               document.getElementById('adult_birth_date'+i).style['border-color'] = '#EFEFEF';
           }
       }if(document.getElementById('adult_nationality'+i).value == ''){
           error_log+= 'Please fill nationality for passenger adult '+i+'!</br>\n';
           document.getElementById('adult_nationality'+i).style['border-color'] = 'red';
       }else{
           if(is_identity_required == 'true')
               if(document.getElementById('adult_id_type'+i).value == '' && document.getElementById('adult_identity_type'+i).style.display == 'block'){
                    error_log+= 'Please fill id type for passenger adult '+i+'!</br>\n';
                    document.getElementById('adult_id_type'+i).style['border-color'] = 'red';
               }
           document.getElementById('adult_nationality'+i).style['border-color'] = '#EFEFEF';
       }
       if(document.getElementById('adult_identity_type'+i).style.display == 'block'){
           if(document.getElementById('adult_id_type'+i).value != ''){
                $("#adult_id_type"+i).each(function() {
                    $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                });
               if(document.getElementById('adult_nationality'+i).value == 'Indonesia'){
                   //indonesia
                   if(document.getElementById('adult_id_type'+i).value == 'ktp' && is_international == 'false'){
                        document.getElementById('adult_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
                        $("#adult_id_type"+i).each(function() {
                            $(this).parent().find('.nice-select').css('border', '0px solid red');
                        });
                        document.getElementById('adult_passport_expired_date'+i).style['border-color'] = '#cdcdcd';
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
                   }else if(document.getElementById('adult_id_type'+i).value == 'passport' && is_international == 'true'){
                       $("#adult_id_type"+i).each(function() {
                           $(this).parent().find('.nice-select').css('border', '0px solid red');
                       });
                       if(document.getElementById('adult_id_type'+i).value == 'passport' && check_passport(document.getElementById('adult_passport_number'+i).value) == false){
                           error_log+= 'Please fill id number, passport only contain more than 6 digits  for passenger adult '+i+'!</br>\n';
                           document.getElementById('adult_passport_number'+i).style['border-color'] = 'red';
                       }else{
                           document.getElementById('adult_passport_number'+i).style['border-color'] = '#EFEFEF';
                       }
                       if(document.getElementById('adult_passport_expired_date'+i).value == ''){
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
                       }if(document.getElementById('adult_country_of_issued'+i).value == ''){
                           error_log+= 'Please fill country of issued for passenger adult '+i+'!</br>\n';
                            $("#adult_country_of_issued"+i+"_id").each(function() {
                              $(this).siblings(".select2-container").css('border', '1px solid red');
                            });
                       }else{
                            $("#adult_country_of_issued"+i+"_id").each(function() {
                              $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                            });
                       }

                   }else if(is_international == 'false'){
                        error_log += 'Please change identity to NIK for passenger adult '+i+'!</br>\n';
                        $("#adult_id_type"+i).each(function() {
                            $(this).parent().find('.nice-select').css('border', '1px solid red');
                        });
                   }else if(is_international == 'true'){
                        error_log += 'Please change identity to Passport for passenger adult '+i+'!</br>\n';
                        $("#adult_id_type"+i).each(function() {
                            $(this).parent().find('.nice-select').css('border', '1px solid red');
                        });
                   }
               }else{
                   //foreign
                   $("#adult_id_type"+i).each(function() {
                       $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                   });
                   if(document.getElementById('adult_id_type'+i).value == 'passport'){
                       if(document.getElementById('adult_id_type'+i).value == 'passport' && check_passport(document.getElementById('adult_passport_number'+i).value) == false){
                           error_log+= 'Please fill id number, passport only contain more than 6 digits  for passenger adult '+i+'!</br>\n';
                           document.getElementById('adult_passport_number'+i).style['border-color'] = 'red';
                       }else{
                           document.getElementById('adult_passport_number'+i).style['border-color'] = '#EFEFEF';
                       }
                       if(document.getElementById('adult_passport_expired_date'+i).value == ''){
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
                       }if(document.getElementById('adult_country_of_issued'+i).value == ''){
                           error_log+= 'Please fill country of issued for passenger adult '+i+'!</br>\n';
                            $("#adult_country_of_issued"+i+"_id").each(function() {
                              $(this).siblings(".select2-container").css('border', '1px solid red');
                            });
                       }else{
                            $("#adult_country_of_issued"+i+"_id").each(function() {
                              $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                            });
                       }
                   }else{
                       error_log+= 'Please change identity type to Passport for passenger adult '+i+'!</br>\n';
                   }
               }
           }else{
                if(document.getElementById('adult_passport_number'+i).value != ''){
                    error_log+= 'Please choose identity type for passenger adult '+i+'!</br>\n';
                    document.getElementById('adult_passport_number'+i).style['border-color'] = 'red';
                    document.getElementById('adult_passport_expired_date'+i).style['border-color'] = 'red';
                    $("#adult_id_type"+i).each(function() {
                        $(this).parent().find('.nice-select').css('border', '1px solid red');
                    });

                    $("#adult_country_of_issued"+i+"_id").each(function() {
                      $(this).siblings(".select2-container").css('border', '1px solid red');
                    });
                }
           }
       }



       if(document.getElementById('adult_cp'+i).checked == true){
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
       }if(ff_request.length != 0 && check_ff == 1){
           for(j=1;j<=ff_request.length;j++){
                error_ff = true
                if(document.getElementById('adult_ff_request'+i+'_'+j).value != '' && document.getElementById('adult_ff_request'+i+'_'+j).value != 'Frequent Flyer Program' && document.getElementById('adult_ff_number'+i+'_'+j).value != '')
                    error_ff = false
                else if(document.getElementById('adult_ff_request'+i+'_'+j).value == '' && document.getElementById('adult_ff_number'+i+'_'+j).value != '' ||
                        document.getElementById('adult_ff_request'+i+'_'+j).value == 'Frequent Flyer Program' && document.getElementById('adult_ff_number'+i+'_'+j).value != ''){
                    error_log+= 'Please choose Frequent Flyer Program Journey '+j+' for passenger adult '+i+'!</br>\n';
                    document.getElementById('adult_ff_number'+i+'_'+j).style['border-color'] = 'red';
                }else if(document.getElementById('adult_ff_request'+i+'_'+j).value != 'Frequent Flyer Program' && document.getElementById('adult_ff_number'+i+'_'+j).value == '' &&
                    document.getElementById('adult_ff_request'+i+'_'+j).value != '' && document.getElementById('adult_ff_number'+i+'_'+j).value == ''){
                    error_log+= 'Please fill Frequent Flyer Number '+j+' for passenger adult '+i+'!</br>\n';
                    document.getElementById('adult_ff_number'+i+'_'+j).style['border-color'] = 'red';
                }
                if(error_ff == false){
                    document.getElementById('adult_ff_number'+i+'_'+j).style['border-color'] = '#EFEFEF';
                    document.getElementById('adult_ff_request'+i+'_'+j).style['border-color'] = '#EFEFEF';
                }
           }
       }
   }
   //child
   length_name = 100;
   for(j in airline_pick){
       for(k in airline_pick[j].journeys){
            for(l in airline_pick[j].journeys[k].carrier_code_list){
                if(length_name > airline_carriers[airline_pick[j].journeys[k].carrier_code_list[l]].child_length_name)
                    length_name = airline_carriers[airline_pick[j].journeys[k].carrier_code_list[l]].child_length_name;
            }
       }
   }

   for(i=1;i<=child;i++){
       if(check_name(document.getElementById('child_title'+i).value,
       document.getElementById('child_first_name'+i).value,
       document.getElementById('child_last_name'+i).value,
       length_name) == false){
           error_log+= 'Total of child '+i+' name maximum '+length_name+' characters!</br>\n';
           document.getElementById('child_first_name'+i).style['border-color'] = 'red';
           document.getElementById('child_last_name'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('child_first_name'+i).style['border-color'] = '#EFEFEF';
           document.getElementById('child_last_name'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('child_first_name'+i).value == '' || check_word(document.getElementById('child_first_name'+i).value) == false){
           if(document.getElementById('child_first_name'+i).value == '')
               error_log+= 'Please input first name of child passenger '+i+'!</br>\n';
           else if(check_word(document.getElementById('child_first_name'+i).value) == false){
               error_log+= 'Please use alpha characters first name of child passenger '+i+'!</br>\n';
               document.getElementById('child_first_name'+i).style['border-color'] = 'red';
           }
       }else{
           document.getElementById('child_first_name'+i).style['border-color'] = '#EFEFEF';
       }
       //check lastname
       if(check_name_airline(document.getElementById('child_first_name'+i).value, document.getElementById('child_last_name'+i).value) != ''){
           error_log+= 'Please '+check_name_airline(document.getElementById('child_first_name'+i).value, document.getElementById('child_last_name'+i).value)+' child passenger '+i+'!</br>\n';
           document.getElementById('child_last_name'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('child_last_name'+i).style['border-color'] = '#EFEFEF';
       }
       if(check_date(document.getElementById('child_birth_date'+i).value)==false){
           error_log+= 'Birth date wrong for passenger child '+i+'!</br>\n';
           document.getElementById('child_birth_date'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('child_birth_date'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('child_nationality'+i).value == ''){
           error_log+= 'Please fill nationality for passenger child '+i+'!</br>\n';
           document.getElementById('child_nationality'+i).style['border-color'] = 'red';
       }else{
           if(is_identity_required == 'true' && document.getElementById('child_identity_type'+i).style.display == 'block')
               if(document.getElementById('child_id_type'+i).value == ''){
                    error_log+= 'Please fill id type for passenger child '+i+'!</br>\n';
                    document.getElementById('child_id_type'+i).style['border-color'] = 'red';
               }
           document.getElementById('child_nationality'+i).style['border-color'] = '#EFEFEF';
       }

       if(document.getElementById('child_identity_type'+i).style.display == 'block'){
           if(document.getElementById('child_id_type'+i).value != ''){
               document.getElementById('child_id_type'+i).style['border-color'] = '#EFEFEF';
               if(document.getElementById('child_nationality'+i).value == 'Indonesia'){
                   //indonesia
                   if(document.getElementById('child_id_type'+i).value == 'ktp' && is_international == 'false'){
                        document.getElementById('child_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
                        $("#child_id_type"+i).each(function() {
                            $(this).parent().find('.nice-select').css('border', '0px solid red');
                        });
                        if(check_ktp(document.getElementById('child_passport_number'+i).value) == false){
                           error_log+= 'Please fill id number, nik only contain 16 digits for passenger child '+i+'!</br>\n';
                           document.getElementById('child_passport_number'+i).style['border-color'] = 'red';
                        }else{
                           document.getElementById('child_passport_number'+i).style['border-color'] = '#EFEFEF';
                        }if(document.getElementById('child_country_of_issued'+i).value == '' || document.getElementById('child_country_of_issued'+i).value == 'Country of Issued'){
                           error_log+= 'Please fill country of issued for passenger child '+i+'!</br>\n';
                           $("#child_country_of_issued"+i+"_id").each(function() {
                             $(this).siblings(".select2-container").css('border', '1px solid red');
                           });
                        }else{
                           $("#child_country_of_issued"+i+"_id").each(function() {
                             $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                           });
                        }
                   }else if(document.getElementById('child_id_type'+i).value == 'passport' && is_international == 'true'){
                       $("#child_id_type"+i).each(function() {
                           $(this).parent().find('.nice-select').css('border', '0px solid red');
                       });
                       if(document.getElementById('child_id_type'+i).value == 'passport' && check_passport(document.getElementById('child_passport_number'+i).value) == false){
                           error_log+= 'Please fill id number, passport only contain more than 6 digits  for passenger child '+i+'!</br>\n';
                           document.getElementById('child_passport_number'+i).style['border-color'] = 'red';
                       }else{
                           document.getElementById('child_passport_number'+i).style['border-color'] = '#EFEFEF';
                       }
                       if(document.getElementById('child_passport_expired_date'+i).value == ''){
                           error_log+= 'Please fill passport expired date for passenger child '+i+'!</br>\n';
                           document.getElementById('child_passport_expired_date'+i).style['border-color'] = 'red';
                       }else{
                           duration = moment.duration(moment(document.getElementById('child_passport_expired_date'+i).value).diff(last_departure_date));
                           //CHECK EXPIRED
                           if(duration._milliseconds < 0 ){
                                error_log+= 'Please update passport expired date for passenger child '+i+'!</br>\n';
                                document.getElementById('child_passport_expired_date'+i).style['border-color'] = 'red';
                           }else
                                document.getElementById('child_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
                       }if(document.getElementById('child_country_of_issued'+i).value == ''){
                           error_log+= 'Please fill country of issued for passenger child '+i+'!</br>\n';
                           $("#child_country_of_issued"+i+"_id").each(function() {
                             $(this).siblings(".select2-container").css('border', '1px solid red');
                           });

                       }else{
                           $("#child_country_of_issued"+i+"_id").each(function() {
                             $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                           });

                       }
                   }else if(is_international == 'false'){
                        error_log += 'Please change identity to NIK for passenger child '+i+'!</br>\n';
                        $("#child_id_type"+i).each(function() {
                            $(this).parent().find('.nice-select').css('border', '1px solid red');
                        });
                   }else if(is_international == 'true'){
                        error_log += 'Please change identity to Passport for passenger child '+i+'!</br>\n';
                        $("#child_id_type"+i).each(function() {
                            $(this).parent().find('.nice-select').css('border', '1px solid red');
                        });
                   }
               }else{
                   //foreign
                   if(document.getElementById('child_id_type'+i).value == 'passport'){
                       $("#child_id_type"+i).each(function() {
                           $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                       });
                       if(document.getElementById('child_id_type'+i).value == 'passport' && check_passport(document.getElementById('child_passport_number'+i).value) == false){
                           error_log+= 'Please fill id number, passport only contain more than 6 digits  for passenger child '+i+'!</br>\n';
                           document.getElementById('child_passport_number'+i).style['border-color'] = 'red';
                       }else{
                           document.getElementById('child_passport_number'+i).style['border-color'] = '#EFEFEF';
                       }
                       if(document.getElementById('child_passport_expired_date'+i).value == ''){
                           error_log+= 'Please fill passport expired date for passenger child '+i+'!</br>\n';
                           document.getElementById('child_passport_expired_date'+i).style['border-color'] = 'red';
                       }else{
                           duration = moment.duration(moment(document.getElementById('child_passport_expired_date'+i).value).diff(last_departure_date));
                           //CHECK EXPIRED
                           if(duration._milliseconds < 0 ){
                                error_log+= 'Please update passport expired date for passenger child '+i+'!</br>\n';
                                document.getElementById('child_passport_expired_date'+i).style['border-color'] = 'red';
                           }else
                                document.getElementById('child_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
                       }if(document.getElementById('child_country_of_issued'+i).value == ''){
                           error_log+= 'Please fill country of issued for passenger child '+i+'!</br>\n';
                           $("#child_country_of_issued"+i+"_id").each(function() {
                             $(this).siblings(".select2-container").css('border', '1px solid red');
                           });

                       }else{
                           $("#child_country_of_issued"+i+"_id").each(function() {
                             $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                           });

                       }
                   }else{
                       error_log+= 'Please change identity type to Passport for passenger child '+i+'!</br>\n';
                   }
               }
           }else{
               error_log+= 'Please choose identity type for passenger child '+i+'!</br>\n';

               document.getElementById('child_passport_number'+i).style['border-color'] = 'red';
               document.getElementById('child_passport_expired_date'+i).style['border-color'] = 'red';
               $("#child_id_type"+i).each(function() {
                    $(this).parent().find('.nice-select').css('border', '1px solid red');
               });

               $("#child_country_of_issued"+i+"_id").each(function() {
                  $(this).siblings(".select2-container").css('border', '1px solid red');
               });
           }
       }
//       if(document.getElementById('child_identity_type'+i).style.display == 'block'){
//           if(document.getElementById('child_passport_number'+i).value != '' ||
//              document.getElementById('child_passport_expired_date'+i).value != '' ||
//              document.getElementById('child_country_of_issued'+i).value != '' || is_lionair == 'true' && is_international == 'true'){
//               if(document.getElementById('child_passport_number'+i).value == ''){
//                   error_log+= 'Please fill passport number for passenger child '+i+'!</br>\n';
//                   document.getElementById('child_passport_number'+i).style['border-color'] = 'red';
//               }else{
//                   document.getElementById('child_passport_number'+i).style['border-color'] = '#EFEFEF';
//               }if(document.getElementById('child_passport_expired_date'+i).value == ''){
//                   error_log+= 'Please fill passport expired date for passenger child '+i+'!</br>\n';
//                   document.getElementById('child_passport_expired_date'+i).style['border-color'] = 'red';
//               }else{
//                   duration = moment.duration(moment(document.getElementById('child_passport_expired_date'+i).value).diff(last_departure_date));
//                   //CHECK EXPIRED
//                   if(duration._milliseconds < 0 ){
//                        error_log+= 'Please update passport expired date for child adult '+i+'!</br>\n';
//                        document.getElementById('child_passport_expired_date'+i).style['border-color'] = 'red';
//                   }else
//                        document.getElementById('child_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
//               }if(document.getElementById('child_country_of_issued'+i).value == ''){
//                   error_log+= 'Please fill country of issued for passenger child '+i+'!</br>\n';
//                   document.getElementById('child_country_of_issued'+i).style['border-color'] = 'red';
//               }else{
//                   document.getElementById('child_country_of_issued'+i).style['border-color'] = '#EFEFEF';
//               }
//           }
//       }

       if(ff_request.length != 0 && check_ff == 1){
           for(j=1;j<=ff_request.length;j++){
                if(document.getElementById('child_ff_request'+i+'_'+j).value != '' && document.getElementById('child_ff_number'+i+'_'+j).value != '' ||
                   document.getElementById('child_ff_request'+i+'_'+j).value != 'Frequent Flyer Program' && document.getElementById('child_ff_number'+i+'_'+j).value != ''){

                    error_log+= 'Please fill Frequent Flyer Number '+j+' for passenger child '+i+'!</br>\n';
                    document.getElementById('child_ff_number'+i+'_'+j).style['border-color'] = 'red';
                }else if(document.getElementById('child_ff_request'+i+'_'+j).value != 'Frequent Flyer Program' && document.getElementById('child_ff_number'+i+'_'+j).value != ''){
                    error_log+= 'Please fill Frequent Flyer Number '+j+' for passenger child '+i+'!</br>\n';
                    document.getElementById('child_ff_number'+i+'_'+j).style['border-color'] = 'red';
                }else{
                    document.getElementById('child_ff_number'+i+'_'+j).style['border-color'] = '#EFEFEF';
                    document.getElementById('child_ff_request'+i+'_'+j).style['border-color'] = '#EFEFEF';
                }
           }
       }
   }

   //infant
   length_name = 100;
   for(j in airline_pick){
       for(k in airline_pick[j].journeys){
            for(l in airline_pick[j].journeys[k].carrier_code_list){
                if(length_name > airline_carriers[airline_pick[j].journeys[k].carrier_code_list[l]].infant_length_name)
                    length_name = airline_carriers[airline_pick[j].journeys[k].carrier_code_list[l]].infant_length_name;
            }
       }
   }

   for(i=1;i<=infant;i++){
       if(check_name(document.getElementById('infant_title'+i).value,
       document.getElementById('infant_first_name'+i).value,
       document.getElementById('infant_last_name'+i).value,
       length_name) == false){
           error_log+= 'Total of infant '+i+' name maximum '+length_name+' characters!</br>\n';
           document.getElementById('infant_first_name'+i).style['border-color'] = 'red';
           document.getElementById('infant_last_name'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('infant_first_name'+i).style['border-color'] = '#EFEFEF';
           document.getElementById('infant_last_name'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('infant_first_name'+i).value == '' || check_word(document.getElementById('infant_first_name'+i).value) == false){
           if(document.getElementById('infant_first_name'+i).value == '')
               error_log+= 'Please input first name of infant passenger '+i+'!</br>\n';
           else if(check_word(document.getElementById('infant_first_name'+i).value) == false){
               error_log+= 'Please use alpha characters first name of infant passenger '+i+'!</br>\n';
               document.getElementById('infant_first_name'+i).style['border-color'] = 'red';
           }
       }else{
           document.getElementById('infant_first_name'+i).style['border-color'] = '#EFEFEF';
       }
       //check lastname
       if(check_name_airline(document.getElementById('infant_first_name'+i).value, document.getElementById('infant_last_name'+i).value) != ''){
           error_log+= 'Please '+check_name_airline(document.getElementById('infant_first_name'+i).value, document.getElementById('infant_last_name'+i).value)+' infant passenger '+i+'!</br>\n';
           document.getElementById('infant_last_name'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('infant_last_name'+i).style['border-color'] = '#EFEFEF';
       }
       if(check_date(document.getElementById('infant_birth_date'+i).value)==false){
           error_log+= 'Birth date wrong for passenger infant '+i+'!</br>\n';
           document.getElementById('infant_birth_date'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('infant_birth_date'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('infant_nationality'+i).value == ''){
           error_log+= 'Please fill nationality for passenger infant '+i+'!</br>\n';
           document.getElementById('infant_nationality'+i).style['border-color'] = 'red';
       }else{
           if(is_identity_required == 'true')
               if(document.getElementById('infant_id_type'+i).value == '' && document.getElementById('infant_identity_type'+i).style.display == 'block'){
                    error_log+= 'Please fill id type for passenger infant '+i+'!</br>\n';
                    document.getElementById('infant_id_type'+i).style['border-color'] = 'red';
               }
           document.getElementById('infant_nationality'+i).style['border-color'] = '#EFEFEF';
       }

       if(document.getElementById('infant_identity_type'+i).style.display == 'block'){
           if(document.getElementById('infant_id_type'+i).value != ''){
               document.getElementById('infant_id_type'+i).style['border-color'] = '#EFEFEF';
               if(document.getElementById('infant_nationality'+i).value == 'Indonesia'){
                   //indonesia
                   if(document.getElementById('infant_id_type'+i).value == 'ktp' && is_international == 'false'){
                        document.getElementById('infant_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
                        $("#infant_id_type"+i).each(function() {
                            $(this).parent().find('.nice-select').css('border', '0px solid red');
                        });
                        if(check_ktp(document.getElementById('infant_passport_number'+i).value) == false){
                           error_log+= 'Please fill id number, nik only contain 16 digits for passenger infant '+i+'!</br>\n';
                           document.getElementById('infant_passport_number'+i).style['border-color'] = 'red';
                        }else{
                           document.getElementById('infant_passport_number'+i).style['border-color'] = '#EFEFEF';
                        }if(document.getElementById('infant_country_of_issued'+i).value == ''){
                           error_log+= 'Please fill country of issued for passenger infant '+i+'!</br>\n';
                           $("#infant_country_of_issued"+i+"_id").each(function() {
                             $(this).siblings(".select2-container").css('border', '1px solid red');
                           });
                        }else{
                           $("#infant_country_of_issued"+i+"_id").each(function() {
                             $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                           });
                        }
                   }else if(document.getElementById('infant_id_type'+i).value == 'passport' && is_international == 'true'){
                       $("#infant_id_type"+i).each(function() {
                            $(this).parent().find('.nice-select').css('border', '0px solid red');
                       });
                       if(document.getElementById('infant_id_type'+i).value == 'passport' && check_passport(document.getElementById('infant_passport_number'+i).value) == false){
                           error_log+= 'Please fill id number, passport only contain more than 6 digits  for passenger infant '+i+'!</br>\n';
                           document.getElementById('infant_passport_number'+i).style['border-color'] = 'red';
                       }else{
                           document.getElementById('infant_passport_number'+i).style['border-color'] = '#EFEFEF';
                       }
                       if(document.getElementById('infant_passport_expired_date'+i).value == ''){
                           error_log+= 'Please fill passport expired date for passenger infant '+i+'!</br>\n';
                           document.getElementById('infant_passport_expired_date'+i).style['border-color'] = 'red';
                       }else{
                           duration = moment.duration(moment(document.getElementById('infant_passport_expired_date'+i).value).diff(last_departure_date));
                           //CHECK EXPIRED
                           if(duration._milliseconds < 0 ){
                                error_log+= 'Please update passport expired date for passenger infant '+i+'!</br>\n';
                                document.getElementById('infant_passport_expired_date'+i).style['border-color'] = 'red';
                           }else
                                document.getElementById('infant_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
                       }if(document.getElementById('infant_country_of_issued'+i).value == ''){
                           error_log+= 'Please fill country of issued for passenger infant '+i+'!</br>\n';
                           $("#infant_country_of_issued"+i+"_id").each(function() {
                             $(this).siblings(".select2-container").css('border', '1px solid red');
                           });
                       }else{
                           $("#infant_country_of_issued"+i+"_id").each(function() {
                             $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                           });
                       }
                   }else if(is_international == 'false'){
                        error_log += 'Please change identity to NIK for passenger infant '+i+'!</br>\n';
                        $("#infant_id_type"+i).each(function() {
                             $(this).parent().find('.nice-select').css('border', '1px solid red');
                        });
                   }else if(is_international == 'true'){
                        error_log += 'Please change identity to Passport for passenger infant '+i+'!</br>\n';
                        $("#infant_id_type"+i).each(function() {
                             $(this).parent().find('.nice-select').css('border', '1px solid red');
                        });
                   }
               }else{
                   //foreign
                   if(document.getElementById('infant_id_type'+i).value == 'passport'){
                       $("#infant_id_type"+i).each(function() {
                            $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                       });
                       if(document.getElementById('infant_id_type'+i).value == 'passport' && check_passport(document.getElementById('infant_passport_number'+i).value) == false){
                           error_log+= 'Please fill id number, passport only contain more than 6 digits  for passenger infant '+i+'!</br>\n';
                           document.getElementById('infant_passport_number'+i).style['border-color'] = 'red';
                       }else{
                           document.getElementById('infant_passport_number'+i).style['border-color'] = '#EFEFEF';
                       }
                       if(document.getElementById('infant_passport_expired_date'+i).value == ''){
                           error_log+= 'Please fill passport expired date for passenger infant '+i+'!</br>\n';
                           document.getElementById('infant_passport_expired_date'+i).style['border-color'] = 'red';
                       }else{
                           duration = moment.duration(moment(document.getElementById('infant_passport_expired_date'+i).value).diff(last_departure_date));
                           //CHECK EXPIRED
                           if(duration._milliseconds < 0 ){
                                error_log+= 'Please update passport expired date for passenger infant '+i+'!</br>\n';
                                document.getElementById('infant_passport_expired_date'+i).style['border-color'] = 'red';
                           }else
                                document.getElementById('infant_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
                       }if(document.getElementById('infant_country_of_issued'+i).value == ''){
                           error_log+= 'Please fill country of issued for passenger infant '+i+'!</br>\n';
                           $("#infant_country_of_issued"+i+"_id").each(function() {
                             $(this).siblings(".select2-container").css('border', '1px solid red');
                           });
                       }else{
                           $("#infant_country_of_issued"+i+"_id").each(function() {
                             $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                           });
                       }
                   }else{
                        error_log+= 'Please change identity type to Passport for passenger infant '+i+'!</br>\n';
                   }
               }
           }else{
               error_log+= 'Please choose identity type for passenger infant '+i+'!</br>\n';

               document.getElementById('infant_passport_number'+i).style['border-color'] = 'red';
               document.getElementById('infant_passport_expired_date'+i).style['border-color'] = 'red';
               $("#infant_id_type"+i).each(function() {
                    $(this).parent().find('.nice-select').css('border', '1px solid red');
               });

               $("#infant_country_of_issued"+i+"_id").each(function() {
                  $(this).siblings(".select2-container").css('border', '1px solid red');
               });
           }
       }
//       if(document.getElementById('infant_identity_type'+i).style.display == 'block'){
//           if(document.getElementById('infant_passport_number'+i).value != '' ||
//              document.getElementById('infant_passport_expired_date'+i).value != '' ||
//              document.getElementById('infant_country_of_issued'+i).value != '' || is_lionair == 'true' && is_international == 'true'){
//               if(document.getElementById('infant_passport_number'+i).value == ''){
//                   error_log+= 'Please fill passport number for passenger infant '+i+'!</br>\n';
//                   document.getElementById('infant_passport_number'+i).style['border-color'] = 'red';
//               }else{
//                   document.getElementById('infant_passport_number'+i).style['border-color'] = '#EFEFEF';
//               }if(document.getElementById('infant_passport_expired_date'+i).value == ''){
//                   error_log+= 'Please fill passport expired date for passenger infant '+i+'!</br>\n';
//                   document.getElementById('infant_passport_expired_date'+i).style['border-color'] = 'red';
//               }else{
//                   duration = moment.duration(moment(document.getElementById('infant_passport_expired_date'+i).value).diff(last_departure_date));
//                   //CHECK EXPIRED
//                   if(duration._milliseconds < 0 ){
//                        error_log+= 'Please update passport expired date for infant adult '+i+'!</br>\n';
//                        document.getElementById('infant_passport_expired_date'+i).style['border-color'] = 'red';
//                   }else
//                        document.getElementById('infant_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
//               }if(document.getElementById('infant_country_of_issued'+i).value == ''){
//                   error_log+= 'Please fill country of issued for passenger infant '+i+'!</br>\n';
//                   document.getElementById('infant_country_of_issued'+i).style['border-color'] = 'red';
//               }else{
//                   document.getElementById('infant_country_of_issued'+i).style['border-color'] = '#EFEFEF';
//               }
//           }
//       }

   }
   if(error_log==''){
        //KALAU DATE DISABLED DARI TEROPONG VALUE TIDAK BISA DI AMBIL EXPIRED DATE TIDAK DI DISABLED FALSE KARENA BISA DI EDIT
       for(i=1;i<=adult;i++){
            document.getElementById('adult_birth_date'+i).disabled = false;
//            document.getElementById('adult_passport_expired_date'+i).disabled = false;
       }
       for(i=1;i<=child;i++){
            document.getElementById('child_birth_date'+i).disabled = false;
//            document.getElementById('child_passport_expired_date'+i).disabled = false;
       }
       for(i=1;i<=infant;i++){
            document.getElementById('infant_birth_date'+i).disabled = false;
//            document.getElementById('infant_passport_expired_date'+i).disabled = false;
       }
       $('.loader-rodextrip').fadeIn();
       document.getElementById('time_limit_input').value = time_limit;
//       document.getElementById('airline_price_itinerary_request').value = JSON.stringify(airline_get_price_request);
       document.getElementById('airline_review').action = '/airline/review/' + signature;
       document.getElementById('airline_review').submit();
   }
   else{
       $('.loader-rodextrip').fadeOut();
       document.getElementById('show_error_log').innerHTML = error_log;
       $("#myModalErrorPassenger").modal('show');
       $('.btn-next').removeClass("running");
       $('.btn-next').prop('disabled', false);
   }
}

function get_airline_review(){
    text = '';
    text = `<div style="background:white; margin-bottom:15px; padding:10px; border:1px solid #cdcdcd;">
            <h4>Flight Detail</h4>
            <hr/>`;
    flight_count = 0;
    for(i in airline_pick){
        airline_pick[i].price_itinerary = airline_pick[i].journeys;
        for(j in airline_pick[i].price_itinerary){
            if(airline_pick[i].price_itinerary[j].is_combo_price == true){
                text += `<h6>Combo Price</h6>`;
            }else if(airline_request.direction != 'MC'){
                if(i == 0 && j == 0){
                    text += `<h6>Departure</h6>`;
                    if(airline_request.direction != 'MC'){}
                    else{
                        flight_count++;
                    }
                }else{
                    text += `<h6>Return</h6>`;
                    if(airline_request.direction != 'MC'){}
                    else{
                        flight_count++;
                    }
                }
            }else if(airline_request.direction == 'MC'){
                flight_count++;
                text += `<h6>Flight `+flight_count+`</h6>`;
            }
            //logo
            text+=`<div class="row">`;


            for(k in airline_pick[i].price_itinerary[j].segments){
                if(airline_pick[i].price_itinerary[j].journey_type == 'COM'){
                    text += `<div><h6>Flight `+parseInt(flight_count+1)+`</h6></div>`;
                    flight_count++;
                }
                text+=`<div class="col-lg-4">`;
                try{
                    text+=`<img data-toggle="tooltip" alt="`+airline_carriers[airline_pick[i].price_itinerary[j].segments[k].carrier_code].name+`" title="`+airline_carriers[airline_pick[i].price_itinerary[j].segments[k].carrier_code].name+`" style="width:50px; height:50px;" src="`+static_path_url_server+`/public/airline_logo/`+airline_pick[i].price_itinerary[j].segments[k].carrier_code+`.png"> <br/><span>`+airline_pick[i].price_itinerary[j].segments[k].carrier_name+` </span>`;
                }catch(err){
                    text+=`<img data-toggle="tooltip" alt="Airline" title="" style="width:50px; height:50px;" src="`+static_path_url_server+`/public/airline_logo/`+airline_pick[i].price_itinerary[j].segments[k].carrier_code+`.png"><br/><span>`+airline_pick[i].price_itinerary[j].segments[k].carrier_name+` </span>`;
                }
                text+=`</div>`;
                text+=`<div class="col-lg-8">`;
                for(l in airline_pick[i].price_itinerary[j].segments[k].legs){
                    text+=`
                    <div class="row">
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                            <table style="width:100%">
                                <tr>
                                    <td class="airport-code"><h5>`+airline_pick[i].price_itinerary[j].segments[k].legs[l].departure_date.split(' - ')[1]+`</h5></td>
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
                            <span style="font-size:13px;">`+airline_pick[i].price_itinerary[j].segments[k].legs[l].departure_date.split(' - ')[0]+`</span></br>
                            <span style="font-size:13px; font-weight:500;">`+airline_pick[i].price_itinerary[j].segments[k].legs[l].origin_city+` (`+airline_pick[i].price_itinerary[j].segments[k].legs[l].origin+`)</span>
                        </div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                            <table style="width:100%; margin-bottom:6px;">
                                <tr>
                                    <td><h5>`+airline_pick[i].price_itinerary[j].segments[k].legs[l].arrival_date.split(' - ')[1]+`</h5></td>
                                    <td></td>
                                    <td style="height:30px;padding:0 15px;width:100%"></td>
                                </tr>
                            </table>
                            <span style="font-size:13px;">`+airline_pick[i].price_itinerary[j].segments[k].legs[l].arrival_date.split(' - ')[0]+`</span><br/>
                            <span style="font-size:13px; font-weight:500;">`+airline_pick[i].price_itinerary[j].segments[k].legs[l].destination_city+` (`+airline_pick[i].price_itinerary[j].segments[k].legs[l].destination+`)</span>
                        </div>
                    </div>`;
                }
                text+=`
                </div>`;
            }

            text+=`<div class="col-lg-12">`;
                if(provider_list_data[airline_pick[i].price_itinerary[j].provider].is_post_issued_reschedule)
                    text+=`
                        <br/><span style="font-weight:bold;"><i class="fas fa-check-circle" style="color:#4f9c64;"></i> Reschedule</span>`;
//                if(provider_list_data[airline_pick[i].price_itinerary[j].provider].is_post_issued_cancel)
//                    text+=`
//                        <br/><span style="font-weight:bold;"><i class="fas fa-check-circle" style="color:#4f9c64;"></i> Refund</span>`;

                text+=`
                </div>
            </div>
            <hr/>`;
        }
    }
    text+=`</div>`;

    //contact
    text+=`
    <div class="row">
        <div class="col-lg-12">
            <div style="background:white; padding:10px; border:1px solid #cdcdcd;">
                <h4>Contact(s) Person</h4><hr/>
                <div style="overflow-x:auto;">
                <table style="width:100%;" id="list-of-passenger">
                    <tr>
                        <th style="width:7%;" class="list-of-passenger-left">No</th>
                        <th style="width:28%;">Name</th>
                        <th style="width:7%;">Email</th>
                        <th style="width:18%;">Phone Number</th>
                    </tr>`;
                    for(i in passengers.contact){
                        text+=`<tr>
                                <td class="list-of-passenger-left">`+(parseInt(i)+1)+`</td>
                                <td>`+passengers.contact[i].title+` `+passengers.contact[i].first_name+` `+ passengers.contact[i].last_name +`</td>
                                <td>`+passengers.contact[i].email+`</td>
                                <td>`+passengers.contact[i].calling_code+` - `+passengers.contact[i].mobile+`</td>
                               </tr>`;
                    }
                text+=`</table>
                </div>
            </div>
        </div>
    </div>`;

    //SSR
    text+=`
    <div class="row" style="padding-top:20px;">
        <div class="col-lg-12">
            <div style="background:white; padding:10px; border:1px solid #cdcdcd;">
                <h4>Seat & SSR</h4><hr/>
                <div class="row">`;
                    count_pax = 0;
                    for(i in passengers_ssr){
                        text+=`
                            <div class="col-lg-12">
                            <h5>`+(parseInt(count_pax)+1)+`.
                            `+passengers_ssr[i].title+` `+passengers_ssr[i].first_name+` `+ passengers_ssr[i].last_name+`</h5>`;
                            if(passengers_ssr[i].hasOwnProperty('behaviors') && Object.keys(passengers_ssr[i].behaviors).length > 0){
                                text+=`<br/><b>Behaviors:</b><br/>`;
                                for(j in passengers_ssr[i].behaviors){
                                    if(j.toLowerCase() == 'airline'){
                                        text+=`<i>`+j+`</i><br/>`;
                                        for(k in passengers_ssr[i].behaviors[j]){
                                            text+=`<span><i>`+k+`: </i><b>`+passengers_ssr[i].behaviors[j][k].value+`</b></span><br/>`;
                                        }
                                    }
                                }
                            }
                            text+=`</div>
                            <div class="col-lg-12">`;
                            if(passengers_ssr[i].pax_type == 'ADT')
                                text += `<b>Adult - </b>`;
                            else
                                text += `<b>Child - </b>`;
                            text+=`
                            Birth Date: <b>`+passengers_ssr[i].birth_date+`</b></div>
                            <div class="col-lg-12">`;
                            try{
                                for(j in passengers_ssr[i].ff_numbers){
                                    text+= `<label>`+passengers_ssr[i].ff_numbers[j].ff_code+`: `+passengers_ssr[i].ff_numbers[j].ff_number+`</label><br/>`;
                                }
                            }catch(err){
                                console.log(err); // error kalau ada element yg tidak ada
                            }

                            if(passengers_ssr[i].ssr_list.length){
                                text+=`<h6 style="color:`+color+`;">SSR</h6>`;
                            }
                            fee_dict = {}
                            for(j in passengers_ssr[i].ssr_list){
                                if(fee_dict.hasOwnProperty(passengers_ssr[i].ssr_list[j].journey_code) == false){
                                    fee_dict[passengers_ssr[i].ssr_list[j].journey_code] = {
                                        "fees": [],
                                        "origin": passengers_ssr[i].ssr_list[j].origin,
                                        "destination": passengers_ssr[i].ssr_list[j].destination,
                                        "departure_date": passengers_ssr[i].ssr_list[j].departure_date
                                    };
                                }
                                fee_dict[passengers_ssr[i].ssr_list[j].journey_code].fees.push({
                                    "ssr_type": passengers_ssr[i].ssr_list[j].ssr_type,
                                    "name": passengers_ssr[i].ssr_list[j].name
                                })
                            }
                            for(j in fee_dict){
                                text += `<span style="font-weight:500;">`+fee_dict[j].origin+` - `+fee_dict[j].destination+` (`+fee_dict[j].departure_date+`)</span><br/>`;
                                for(k in fee_dict[j].fees){
                                    if(fee_dict[j].fees[k].ssr_type == 'ML'){
                                        text+=`<i class="fas fa-utensils"></i> `;
                                    }
                                    else if(fee_dict[j].fees[k].ssr_type.includes('BG')){
                                        text+=`<i class="fas fa-suitcase"></i> `;
                                    }
                                    else{
                                        text+=`<i class="fas fa-tools"></i> `;
                                    }
                                    text+= `<span style="font-weight:500;">`+fee_dict[j].fees[k].name+`</span><br/>`;
                                }
                            }

                            if(passengers_ssr[i].hasOwnProperty('seat_list')){
                                text+=`<h6 style="color:`+color+`;">Seat</h6>`;
                            }
                            for(j in passengers_ssr[i].seat_list){
                                if(passengers_ssr[i].seat_list[j].seat_pick != ''){
                                    text+=`<img src="/static/tt_website_rodextrip/img/icon/seat.png" style="height:16px; width:auto;"/>`;
                                    text+= `<span style="font-weight:500;"> `+passengers_ssr[i].seat_list[j].segment_code+` (`+moment(passengers_ssr[i].seat_list[j].departure_date).format('DD MMM YYYY') +`): ` +passengers_ssr[i].seat_list[j].seat_pick + '</span><br>';
                                }
                            }
                            text+=`
                                <hr/>
                            </div>`;
                        count_pax++;
                    }
                    for(i in passengers.infant){
                        text+=`<div class="col-lg-12">
                                <h5> `+(parseInt(count_pax)+1)+`.
                                `+passengers.infant[i].title+` `+passengers.infant[i].first_name+` `+ passengers.infant[i].last_name +`</h5>
                                <b>Infant - </b>
                                Birth Date: <b>`+passengers.infant[i].birth_date+`</b>
                               </div>`;
                        count_pax++;
                    }
                text+=`
                </div>
            </div>
        </div>
    </div>`;

    //Seat
//    text+=`
//    <div class="row" style="padding-top:20px;">
//        <div class="col-lg-12">
//            <div style="background:white; padding:10px; border:1px solid #cdcdcd;">
//                <h4>Seat</h4><hr/>
//                <table style="width:100%;" id="list-of-passenger">
//                    <tr>
//                        <th style="width:7%;" class="list-of-passenger-left">No</th>
//                        <th style="width:28%;">Name</th>
//                        <th style="width:7%;">Type</th>
//                        <th style="width:18%;">Birth Date</th>
//                        <th style="width:18%;">Seat</th>
//                    </tr>`;
//                    count_pax = 0;
//                    for(i in passengers_ssr){
//                        text+=`<tr>
//                                <td class="list-of-passenger-left">`+(parseInt(count_pax)+1)+`</td>
//                                <td>`+passengers_ssr[i].title+` `+passengers_ssr[i].first_name+` `+ passengers_ssr[i].last_name +`</td>
//                                <td>`;
//                                if(passengers_ssr[i].pax_type == 'ADT')
//                                    text += `Adult`;
//                                else
//                                    text += `Child`;
//                                text+=`</td>
//                                <td>`+passengers_ssr[i].birth_date+`</td>
//                                <td>`;
//                                try{
//                                    for(j in passengers_ssr[i].ff_numbers){
//                                        text+= `<label>`+passengers_ssr[i].ff_numbers[j].ff_code+`: `+passengers_ssr[i].ff_numbers[j].ff_number+`</label><br/>`;
//                                    }
//                                }catch(err){}
//                                for(j in passengers_ssr[i].seat_list){
//                                    if(passengers_ssr[i].seat_list[j].seat_pick != '')
//                                        text+= `<label>`+passengers_ssr[i].seat_list[j].segment_code + ` ` +passengers_ssr[i].seat_list[j].seat_pick + '</label><br>';
//                                }
//                                text+=`</td>
//                               </tr>`;
//                        count_pax++;
//                    }
//                    for(i in passengers.infant){
//                        text+=`<tr>
//                                <td class="list-of-passenger-left">`+(parseInt(count_pax)+1)+`</td>
//                                <td>`+passengers.infant[i].title+` `+passengers.infant[i].first_name+` `+ passengers.infant[i].last_name +`</td>
//                                <td>Infant</td>
//                                <td>`+passengers.infant[i].birth_date+`</td>
//                                <td></td>
//                               </tr>`;
//                        count_pax++;
//                    }
//                text+=`</table>
//            </div>
//        </div>
//    </div>`;

    document.getElementById('airline_review').innerHTML = text;

}

function get_airline_review_after_sales(){
    text = '';
    text = `<div>
                <h4>Flight Detail</h4>
                <hr/>`;
    flight_count = 0;
    for(i in airline_get_detail.provider_bookings){
        for(j in airline_get_detail.provider_bookings[i].journeys){
            if(airline_get_detail.provider_bookings[i].journeys[j].is_combo_price == true){
                text += `<h6>Combo Price</h6>`;
            }else if(i == 0){
                text += `<h6>Departure</h6>`;
            }else{
                text += `<h6>Return</h6>`;
            }
            for(k in airline_get_detail.provider_bookings[i].journeys[j].segments){
                if(airline_get_detail.provider_bookings[i].journeys[j].segments[k].journey_type == 'COM'){
                    text += `<div><h6>Flight `+parseInt(flight_count+1)+`</h6></div>`;
                    flight_count++;
                }
                try{
                    text+=`<img data-toggle="tooltip" alt="`+airline_carriers[airline_get_detail.provider_bookings[i].journeys[j].segments[k].carrier_code]+`" title="`+airline_carriers[airline_get_detail.provider_bookings[i].journeys[j].segments[k].carrier_code]+`" style="width:50px; height:50px;" src="`+static_path_url_server+`/public/airline_logo/`+airline_get_detail.provider_bookings[i].journeys[j].segments[k].carrier_code+`.png"><span> </span>`;
                }catch(err){
                    text+=`<img data-toggle="tooltip" alt="Airline" title="" style="width:50px; height:50px;" src="`+static_path_url_server+`/public/airline_logo/`+airline_get_detail.provider_bookings[i].journeys[j].segments[k].carrier_code+`.png"><span> </span>`;
                }
                text+=`
                    <div class="row">
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                            <table style="width:100%">
                                <tr>
                                    <td class="airport-code"><h5>`+airline_get_detail.provider_bookings[i].journeys[j].segments[k].departure_date.split('  ')[1]+`</h5></td>
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
                            <span style="font-size:13px;">`+airline_get_detail.provider_bookings[i].journeys[j].segments[k].departure_date.split('  ')[0]+`</span></br>
                            <span style="font-size:13px; font-weight:500;">`+airline_get_detail.provider_bookings[i].journeys[j].segments[k].origin_city+` (`+airline_get_detail.provider_bookings[i].journeys[j].segments[k].origin+`)</span>
                        </div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                            <table style="width:100%; margin-bottom:6px;">
                                <tr>
                                    <td><h5>`+airline_get_detail.provider_bookings[i].journeys[j].segments[k].arrival_date.split('  ')[1]+`</h5></td>
                                    <td></td>
                                    <td style="height:30px;padding:0 15px;width:100%"></td>
                                </tr>
                            </table>
                            <span style="font-size:13px;">`+airline_get_detail.provider_bookings[i].journeys[j].segments[k].arrival_date.split('  ')[0]+`</span><br/>
                            <span style="font-size:13px; font-weight:500;">`+airline_get_detail.provider_bookings[i].journeys[j].segments[k].destination_city+` (`+airline_get_detail.provider_bookings[i].journeys[j].segments[k].destination+`)</span>
                        </div>
                    </div>`;
            }
        }
    }

    //passengers
    text+=`
    <div class="row" style="padding-top:20px;">
        <div class="col-lg-12">
            <div>
                <h4>List of Passenger(s)</h4><hr/>
                <table style="width:100%;" id="list-of-passenger">
                    <tr>
                        <th style="width:7%;" class="list-of-passenger-left">No</th>
                        <th style="width:28%;">Name</th>
                        <th style="width:7%;">Type</th>
                        <th style="width:18%;">Birth Date</th>
                        <th style="width:18%;">SSR Old</th>
                        <th style="width:18%;">SSR New</th>
                    </tr>`;
                    count_pax = 0
                    for(i in passengers_ssr){
                        text+=`<tr>
                                <td class="list-of-passenger-left">`+(parseInt(count_pax)+1)+`</td>
                                <td>`+passengers_ssr[i].title+` `+passengers_ssr[i].first_name+` `+ passengers_ssr[i].last_name +`</td>
                                <td>Adult</td>
                                <td>`+passengers_ssr[i].birth_date+`</td>
                                <td>`;
                                  try{
                                      for(j in airline_get_detail.passengers[i].fees){
                                        text += `<label>`+airline_get_detail.passengers[i].fees[j].fee_name+ ' ' + airline_get_detail.passengers[i].fees[j].fee_value + `</label><br/>`;
                                      }
                                  }catch(err){
                                    console.log(err); // error kalau ada element yg tidak ada
                                  }
                                  text+=`
                                </div>
                                </td>
                                <td>`;
                                for(j in passengers_ssr[i].ssr_list){
                                    try{
                                        text += `<label>`+passengers_ssr[i].ssr_list[j].availability_type+ ' ' + passengers_ssr[i].ssr_list[j].name + `</label><br/>`;
                                  }catch(err){
                                    console.log(err); // error kalau ada element yg tidak ada
                                  }
                                }
                                for(j in passengers_ssr[i].seat_list){
                                    try{
                                        if(passengers_ssr[i].seat_list[j].seat_pick != ''){
                                            text += `<label>Seat `+passengers_ssr[i].seat_list[j].segment_code+ ' ' + passengers_ssr[i].seat_list[j].seat_pick + `</label><br/>`;
                                        }
                                  }catch(err){
                                    console.log(err); // error kalau ada element yg tidak ada
                                  }
                                }
                                text+=`</td>
                               </tr>`;
                        count_pax++;
                    }
                    for(i in passengers.infant){
                        text+=`<tr>
                                <td class="list-of-passenger-left">`+(parseInt(count_pax)+1)+`</td>
                                <td>`+passengers.infant[i].title+` `+passengers.infant[i].first_name+` `+ passengers.infant[i].last_name +`</td>
                                <td>Infant</td>
                                <td>`+passengers.infant[i].birth_date+`</td>
                                <td></td>
                                <td></td>
                               </tr>`;
                        count_pax++;
                    }

                text+=`</table>
                    <br/><label>Notes: Change for same type only</label>
            </div>
        </div>
    </div>`;

    text+=`</div>`;
    document.getElementById('airline_review').innerHTML = text;
}

function update_contact_cp(val){
    temp = 1;
    while(temp != airline_request.adult+1){
        if(document.getElementById('adult_cp'+temp.toString()).checked == true && val != temp){
            document.getElementById('adult_cp_hidden1_'+temp.toString()).hidden = true;
            document.getElementById('adult_cp_hidden2_'+temp.toString()).hidden = true;
            document.getElementById('adult_cp'+temp.toString()).checked = false;
            alert('Contact Person has been changed!');
        }
        temp++;
    }
    if(document.getElementById('adult_cp'+val.toString()).checked == true){
        document.getElementById('adult_cp_hidden1_'+val.toString()).hidden = false;
        document.getElementById('adult_cp_hidden2_'+val.toString()).hidden = false;
    }else{
        document.getElementById('adult_cp_hidden1_'+val.toString()).hidden = true;
        document.getElementById('adult_cp_hidden2_'+val.toString()).hidden = true;
    }
}

function next_ssr(){
    $('.loader-rodextrip').fadeIn();
    document.getElementById('time_limit_input').value = time_limit;
    document.getElementById('additional_price_input').value = document.getElementById('additional_price').innerHTML;
    document.getElementById('airline_booking').submit();
}

function next_seat_map(){
    $('.loader-rodextrip').fadeIn();
    document.getElementById('airline_booking').innerHTML += `<input type="hidden" id="passenger" name="passenger" value='`+JSON.stringify(passengers)+`'>`;
    document.getElementById('time_limit_input').value = time_limit;
    document.getElementById('additional_price_input').value = document.getElementById('additional_price').innerHTML;
    document.getElementById('airline_booking').submit();
}

function set_new_request_ssr(){
    show_loading();
    $('#ssr_req_new_ssr').prop('disabled', true);
    $('#ssr_req_new_seat').prop('disabled', true);
    $('#reissued_btn_dsb').prop('disabled', true);
    $('#reissued_req_btn').prop('disabled', true);
    please_wait_transaction();
//    get_post_ssr_availability();
    get_post_ssr_availability_v2();
}

function set_new_request_seat(){
    show_loading();
    please_wait_transaction();
    $('#ssr_req_new_ssr').prop('disabled', true);
    $('#ssr_req_new_seat').prop('disabled', true);
    $('#reissued_btn_dsb').prop('disabled', true);
    $('#reissued_req_btn').prop('disabled', true);
//    get_post_seat_availability();
    get_post_seat_availability_v2();
}

function send_request_link(val){
    document.getElementById('time_limit_input').value = time_limit;
    document.getElementById('additional_price_input').value = document.getElementById('additional_price').innerHTML;
    document.getElementById('airline_request_send2').action = val;
    document.getElementById('airline_request_send2').submit();
}

function checkboxCopy(){
    var count_copy = $(".copy_result:checked").length;
    if(count_copy == 0){
        $('#button_copy_airline').hide();
    }
    else{
        $('#button_copy_airline').show();
    }
    document.getElementById("badge-copy-notif").innerHTML = count_copy;
    document.getElementById("badge-copy-notif2").innerHTML = count_copy;
}

function checkboxCopyBox(id){
    if(document.getElementById('copy_result'+id).checked) {
        var copycount = $(".copy_result:checked").length;
        if(copycount == ticket_count){
            document.getElementById("check_all_copy").checked = true;
        }

    } else {
        document.getElementById("check_all_copy").checked = false;
    }
    checkboxCopy();
}

function check_passport_expired_six_month(id){
    last_departure_date = '';
    for(i in airline_pick){
        for(j in airline_pick[i].journeys){
            last_departure_date = airline_pick[i].journeys[j].departure_date.split(' - ')[0];
        }
    }
    if(document.getElementById(id).value != '' && document.getElementById(id).value != moment().subtract(-1, 'years').format('DD MMM YYYY') && id.includes('infant') == false){
        var duration = moment.duration(moment(document.getElementById(id).value).diff(last_departure_date));
        if(duration._data.months < 6 && duration._data.years == 0)
            Swal.fire({
              type: 'warning',
              title: 'Oops!',
              html: '<span style="color: #ff9900;">Passport expired date less then 6 months </span>' ,
            })
    }
}

function check_all_result(){
   var selectAllCheckbox = document.getElementById("check_all_copy");
   if(selectAllCheckbox.checked==true){
        var checkboxes = document.getElementsByClassName("copy_result");
        for(var i=0, n=checkboxes.length;i<n;i++) {
        checkboxes[i].checked = true;
        $('#choose-airline-copy').hide();
    }
   }else {
    var checkboxes = document.getElementsByClassName("copy_result");
    for(var i=0, n=checkboxes.length;i<n;i++) {
        checkboxes[i].checked = false;
        $('#choose-airline-copy').show();
    }
   }
   checkboxCopy();
}

function get_checked_copy_result(){
    document.getElementById("show-list-copy-airline").innerHTML = '';

    var search_params = document.getElementById("show-list-copy-airline").innerHTML = '';

    var value_idx = [];
    $("#airline_search_params .copy_span").each(function(obj) {
        value_idx.push( $(this).text() );
    })

    var value_flight_type = "";
    if($radio_value_string != "multicity"){
        if(check_flight_type == 1){
            value_flight_type = "Departure Flight";
        }else if(check_flight_type == 2){
            value_flight_type = "Return Flight";
        }else if(check_flight_type == 3){
            value_flight_type = "Departure-Return Flight";
        }
    }else{
        value_flight_type = "Multi-City Flight";
    }
    text='';
    //$text='Search: '+value_idx[0]+'\n'+value_idx[1].trim()+'\nDate: '+value_idx[2]+'\n'+value_idx[3]+'\n\n';

    $text= value_idx[0]+' - '+value_idx[1]+' → '+value_idx[2]+', '+value_idx[3]+'\n\n';

    var airline_number = 0;
    node = document.createElement("div");
    //text+=`<div class="col-lg-12"><h5>`+value_flight_type+`</h5><hr/></div>`;
    text+=`<div class="col-lg-12" style="min-height=200px; max-height:500px; overflow-y: scroll;">`;
    $(".copy_result:checked").each(function(obj) {
        var parent_airline = $(this).parent().parent().parent().parent();
        var combo_price = parent_airline.find('.copy_combo_price').html();
        var price_airline = parent_airline.find('.copy_price').html();
        //var search_banner = parent_airline.find('.copy_search_banner').html();
        var value_copy = [];
        parent_airline.find('.copy_airline').each(function(obj) {
            value_copy.push($(this).html());
        });

        var id_airline = parent_airline.find('.id_copy_result').html();
        airline_number = airline_number + 1;
        $text += '› Option-'+airline_number+'\n';

        text+=`
        <div class="row" id="div_list`+id_airline+`">`;
        text+=`
            <div class="col-lg-9">
                <h5>Option-`+airline_number+`</h5>
            </div>`;

            for (var i = 0; i < value_copy.length; i++) {
                var temp_copy = ''+value_copy[i];
                var parent_copy = $("#copy_div_airline"+temp_copy);
            }

            var value_journey = [];
            parent_airline.find('.copy_journey').each(function(obj) {
                value_journey.push($(this).html());
            });

            text+=`
            <div class="col-lg-3" style="text-align:right;">
                <span style="font-weight:500; cursor:pointer;" onclick="delete_checked_copy_result(`+id_airline+`);"><i class="fas fa-times-circle" style="color:red; font-size:18px;"></i> Delete</span>
            </div>
            <div class="col-lg-12"><br/>`;

            for (var i = 0; i < value_journey.length; i++) {
                var temp_journey = ''+value_journey[i];
                var parent_copy_details = $("#detail_departjourney"+temp_journey);
                var value_segments = [];
                parent_copy_details.find('.copy_segments').each(function(obj) {
                    value_segments.push($(this).html());
                });

                for (var j = 0; j < value_segments.length; j++){
                    var temp_segments = ''+value_segments[j];
                    var parent_segments = $("#copy_segments_details"+temp_segments);
                    var parent_po = $("#copy_provider_operated"+temp_segments);

                    parent_segments.find('.copy_transit_details').each(function(obj) {
                        if($(this).html() != undefined || $(this).html() != ''){
                            if($(this).html() != "0"){
                                text+=`<br/><span style="font-weight:500;">`+$(this).html()+` </span><br/>`;
                                $text += '• '+$(this).html()+' \n';
                            }
                        }
                    });

                    var co_j = j+1;
                    text+=`<h5>Flight-`+co_j+`</h5>`;
                    $text += '\nFlight-'+co_j+'\n';

                    parent_segments.find('.copy_carrier_provider_details').each(function(obj) {
                        if($(this).html() != undefined){
                            text+=`<span>Airlines: `+$(this).html()+` </span>`;
                            $text += '› '+$(this).html()+' ';
                            parent_segments.find('.carrier_code_template').each(function(obj_carrier_code){
                                if($(this).html() != undefined){
                                    text+=`<span>`+$(this).html()+` </span>`;
                                    $text += $(this).html()+' ';
                                }
                            });

                            parent_segments.find('.radio-button-custom').each(function(i, obj_sub_class){
                                var id_class_of_service = $(this).html().split('id="')[1].split('"')[0]
                                var change_radios = document.getElementsByName(id_class_of_service);
                                for (var j = 0, length = change_radios.length; j < length; j++) {
                                    if (change_radios[j].checked && i == j) {
                                        text+=`<br/><span>`+$(this).html().replace(' ','').split('(')[4].split(')')[0]+` (`+$(this).html().split('(')[0].replace('\n','').replace(/ /g,'')+`)</span>`;
                                        $text += `\n`+$(this).html().replace(' ','').split('(')[4].split(')')[0]+` (`+$(this).html().split('(')[0].replace('\n','').replace(/ /g,'')+`)`;
                                        break;
                                    }
                                }
                            });
                        }
                    });

                    parent_po.find('.copy_operated_by').each(function(obj) {
                        if($(this).html() != undefined){
                            text+=`<span> (`+$(this).html()+`)</span>`;
                            $text += ' ('+$(this).html()+')';
                        }
                    });
                    text+=`<br/>`;
                    $text += '\n';
                    var value_legs = [];
                    parent_segments.find('.copy_legs').each(function(obj) {
                        value_legs.push($(this).html());
                    });

                    for (var k = 0; k < value_legs.length; k++){
                       var temp_legs = ''+value_legs[k];
                       var parent_legs = $("#copy_legs_details"+temp_legs);
                       var parent_duration = $("#copy_legs_duration_details"+temp_legs);

                       text+=`
                       <div class="row">
                           <div class="col-lg-6" style="text-align:left;">`;

                       $text += '\n';
                       $text += 'Departure: ';
                       parent_legs.find('.copy_legs_depart').each(function(obj) {
                           if($(this).html() != undefined){
                               text+=`<b>Departure</b><br/><span>`+$(this).html()+` </span>`;
                               $text += $(this).html()+', ';
                           }
                       });

                       parent_legs.find('.copy_legs_date_depart').each(function(obj) {
                           if($(this).html() != undefined){
                               text+=`<br/><span>`+$(this).html()+` </span>`;
                               $text += $(this).html()+' ';
                           }
                       });
                       text+=`</div>
                       <div class="col-lg-6" style="text-align:right;">`;
                       $text += '\nArrival: ';
                       parent_legs.find('.copy_legs_arr').each(function(obj) {
                           if($(this).html() != undefined){
                               text+=`<b>Arrival</b><br/><span> `+$(this).html()+` </span>`;
                               $text += ''+$(this).html()+', ';
                           }
                       });

                       parent_legs.find('.copy_legs_date_arr').each(function(obj) {
                           if($(this).html() != undefined){
                               text+=`<br/><span> `+$(this).html()+` </span>`;
                               $text += ' '+$(this).html()+' ';
                           }
                       });
                       text+=`</div>
                        <div class="col-lg-12">
                            <br/>
                        </div>
                       </div>`;

                       $text+='\n';
                    }

                    $text+='\n';
                    var value_fares = [];
                    parent_segments.find('.copy_fares').each(function(obj) {
                        value_fares.push($(this).html());
                    });
                    for (var l = 0; l < value_fares.length; l++){
                       var temp_fares = ''+value_fares[l];
                       var parent_fares = $("#copy_fares_details"+temp_fares);
                       parent_fares.find('.copy_suitcase_details').each(function(obj) {
                           if($(this).html() != undefined || $(this).html() != ''){
                               text+=`<span>• Baggage: `+$(this).html()+` </span><br/>`;
                               $text += '• Baggage   : '+$(this).html()+' \n';
                           }
                       });
                       parent_fares.find('.copy_utensils_details').each(function(obj) {
                           if($(this).html() != undefined || $(this).html() != ''){
                               text+=`<span>• Meal: `+$(this).html()+` </span><br/>`;
                               $text += '• Meal  : '+$(this).html()+' \n';
                           }
                       });
                       parent_fares.find('.copy_others_details').each(function(obj) {
                           if($(this).html() != undefined || $(this).html() != ''){
                               text+=`<span>• Others: `+$(this).html()+` </span><br/>`;
                               $text += '• Others    : '+$(this).html()+' \n';
                           }
                       });

                       parent_duration.find('.copy_duration_details').each(function(obj) {
                           if($(this).html() != undefined || $(this).html() != ''){
                               text+=`<span>• Duration: `+$(this).html()+` </span><br/>`;
                               $text += '• Duration :'+$(this).html()+' \n';
                           }
                       });
                    }
                }

//                if(search_banner != undefined){
//                    text+=`<span class="search_banner_airline">• `+search_banner+`</span><br/>`;
//                    $text += '• '+search_banner+'\n';
//                }
                $text+='--------------------\n';
                text+=`<hr/>`;
                if(combo_price != undefined){
                    text+=`<span class="price_template">Price: `+price_airline+` (`+combo_price+`)</span><br/>`;
                    $text += 'Price: '+price_airline+ ' ('+combo_price+')\n';
                }else{
                    text+=`<span class="price_template">Price: `+price_airline+`</span><br/>`;
                    $text += 'Price: '+price_airline+'\n';
                }

                $text+='====================\n\n';
            }
            text+=`
            </div>
            <div class="col-lg-12"><hr/></div>
        </div>`;
    });
    text+=`
    </div>
    <div class="col-lg-12" style="margin-bottom:15px;" id="share_result">
        <span style="font-size:14px; font-weight:bold;">Share This on:</span><br/>`;
        share_data();
        var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
            text+=`
                <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" alt="Whatsapp" src="/static/tt_website_rodextrip/img/whatsapp.png"/></a>`;
            if(airline_number < 11){
                text+=`
                    <a href="line://msg/text/`+ $text_share +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" alt="Line" src="/static/tt_website_rodextrip/img/line.png"/></a>
                    <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" alt="Telegram" src="/static/tt_website_rodextrip/img/telegram.png"/></a>`;
            }
            else{
                text+=`
                <a href="#" target="_blank" title="Share by Line" style="padding-right:5px; cursor:not-allowed;"><img style="height:30px; width:auto;" alt="Line Disable" src="/static/tt_website_rodextrip/img/line-gray.png"/></a>
                <a href="#" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" alt="Telegram Disable" src="/static/tt_website_rodextrip/img/telegram-gray.png"/></a>`;
            }
            text+=`
                <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" alt="Email" src="/static/tt_website_rodextrip/img/email.png"/></a>`;
        } else {
            text+=`
                <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" alt="Whatsapp" src="/static/tt_website_rodextrip/img/whatsapp.png"/></a>`;
            if(airline_number < 11){
                text+=`
                    <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" alt="Line" src="/static/tt_website_rodextrip/img/line.png"/></a>
                    <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" alt="Telegram" src="/static/tt_website_rodextrip/img/telegram.png"/></a>`;
            }
            else{
                text+=`
                <a href="#" title="Share by Line" style="padding-right:5px; cursor:not-allowed;"><img style="height:30px; width:auto;" alt="Line Disable" src="/static/tt_website_rodextrip/img/line-gray.png"/></a>
                <a href="#" title="Share by Telegram" style="padding-right:5px; cursor:not-allowed;"><img style="height:30px; width:auto;" alt="Telegram Disable" src="/static/tt_website_rodextrip/img/telegram-gray.png"/></a>`;
            }
            text+=`
                <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" alt="Email" src="/static/tt_website_rodextrip/img/email.png"/></a>`;
        }
        if(airline_number > 10){
            text+=`<br/><span style="color:red;">Nb: Share on Line and Telegram Max 10 Airline</span>`;
        }
    text+=`
    </div>
    <div class="col-lg-12" id="copy_result">
        <input class="primary-btn-white" style="width:100%;" type="button" onclick="copy_data();" value="Copy">
    </div>`;

    node.innerHTML = text;
    node.className = "row";
    document.getElementById("show-list-copy-airline").appendChild(node);

//    if(hotel_number > 10){
//        document.getElementById("mobile_line").style.display = "none";
//        document.getElementById("mobile_telegram").style.cursor = "not-allowed";
//        document.getElementById("pc_line").style.display = "not-allowe";
//        document.getElementById("pc_telegram").style.cursor = "not-allowed";
//    }
//
    var count_copy = $(".copy_result:checked").length;
    if (count_copy == 0){
        $('#choose-airline-copy').show();
        $("#share_result").remove();
        $("#copy_result").remove();
        $text = '';
        $text_share = '';
    }else{
        $('#choose-airline-copy').hide();
    }
}

function delete_checked_copy_result(id){
    $("#div_list"+id).remove();
    $("#copy_result"+id).prop("checked", false);
    checkboxCopyBox(id)
    var count_copy = $(".copy_result:checked").length;
    if (count_copy == 0){
        $('#choose-airline-copy').show();
        $("#share_result").remove();
        $("#copy_result").remove();
        $text = '';
        $text_share = '';
    }
    else{
        $('#choose-airline-copy').hide();
        get_checked_copy_result();
        share_data();
    }
    checkboxCopy();
}

function reset_filter(){
    change_filter('departure', 0);
    change_filter('arrival', 0);
    for(i in carrier_code){
        carrier_code[i].status = false;
        document.getElementById("checkbox_airline"+i).checked = carrier_code[i].status;
        document.getElementById("checkbox_airline2"+i).checked = carrier_code[i].status;
    }
    for(i in transit_list){
        transit_list[i].status = false;
        document.getElementById("checkbox_transit"+i).checked = transit_list[i].status;
        document.getElementById("checkbox_transit2"+i).checked = transit_list[i].status;
    }
    for(i in transit_duration_list){
        transit_duration_list[i].status = false;
        document.getElementById("checkbox_transit_duration"+i).checked = transit_duration_list[i].status;
        document.getElementById("checkbox_transit_duration2"+i).checked = transit_duration_list[i].status;
    }
    filtering('filter');
}

function change_date_shortcut(val){
    Swal.fire({
      title: 'Are you sure want change date for flight '+counter_search.toString()+'?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        counter_search--;
        if(airline_request.departure[counter_search] == airline_request['return'][counter_search]){
            airline_request['return'][counter_search] = moment(airline_request.departure[counter_search]).subtract(val,'days').format('DD MMM YYYY');
        }else if(counter_search != 0){
            airline_request['return'][0] = moment(airline_request.departure[counter_search]).subtract(val,'days').format('DD MMM YYYY');
        }
        airline_request.departure[counter_search] = moment(airline_request.departure[counter_search]).subtract(val,'days').format('DD MMM YYYY');
        airline_data = [];
        document.getElementById('airlineAirline_generalShow').innerHTML = '';
        document.getElementById('airline_list2').innerHTML = '';
        time_limit = 1200;
        carrier_code = [];
        airline_list_count = 0;
        counter_search = 0;
        airline_pick_list = [];
        check_airline_pick = 0;
        journey = [];
        airline_pick_mc('no_button');
        document.getElementById("badge-flight-notif").innerHTML = "";
        document.getElementById("badge-flight-notif2").innerHTML = "";
        document.getElementById('waitFlightSearch').style.display = 'block';
        document.getElementById('airlines_result_ticket').innerHTML = '';
        $("#badge-flight-notif").removeClass("infinite");
        $("#badge-flight-notif2").removeClass("infinite");
        $("#myModalTicketFlight").modal('hide');
        $('#loading-search-flight').hide();
        $('#button_chart_airline').hide();
        $('#choose-ticket-flight').show();
//        send_search_to_api();
        airline_signin('');
      }
    })

//    change_date_next_prev(counter_search-1);
}

function change_date_next_prev(counter){
    var today_date = moment().format('DD MMM YYYY'); //hari ini
    flight_date = moment(airline_request.departure[counter]);
    var date_format = 'DD MMM YYYY';
    document.getElementById('now_date').innerHTML = `<div style="background:white; border:2px solid `+color+`; padding:15px; text-align: center;" id="div_onclick_now_date">`+flight_date.format(date_format)+`</div>`;
    document.getElementById('prev_date_1').innerHTML = `<div class="button_date_np date_item_p1" style="padding:15px;" id="div_onclick_p1" onclick="change_date_shortcut(1);">`+flight_date.subtract(+1, 'days').format(date_format)+`</div>`;
    document.getElementById('prev_date_2').innerHTML = `<div class="button_date_np date_item_p2" style="padding:15px;" id="div_onclick_p2" onclick="change_date_shortcut(2);">`+flight_date.subtract(+1, 'days').format(date_format)+`</div>`;
    document.getElementById('next_date_1').innerHTML = `<div class="button_date_np date_item_n1" style="padding:15px;" id="div_onclick_n1" onclick="change_date_shortcut(-1);">`+flight_date.subtract(-3, 'days').format(date_format)+`</div>`;
    document.getElementById('next_date_2').innerHTML = `<div class="button_date_np date_item_n2" style="padding:15px;" id="div_onclick_n2" onclick="change_date_shortcut(-2);">`+flight_date.subtract(-1, 'days').format(date_format)+`</div>`;
    flight_date.subtract(+2, 'days') //balikin ke hari ini

    if(airline_request.direction == 'OW'){
        if(new Date(flight_date.subtract(+1, 'days').format(date_format)).getTime() < new Date(today_date).getTime()){
            $('.date_item_p1').removeClass("button_date_np");
            $('.date_item_p1').addClass("button_date_np_disabled");
            document.getElementById('div_onclick_p1').onclick = '';
        }
        if(new Date(flight_date.subtract(+1, 'days').format(date_format)).getTime() < new Date(today_date).getTime()){
            $('.date_item_p2').removeClass("button_date_np");
            $('.date_item_p2').addClass("button_date_np_disabled");
            document.getElementById('div_onclick_p2').onclick = '';
        }
        flight_date.subtract(-2, 'days') //balikin ke hari ini
    }else{
        if(counter == 0){
            //kalo flight pertama, tidak bisa pilih tgl sblm hari ini dan bisa pilih tanggal sebelum flight 2
            var nextdept = moment(airline_request.departure[counter+1]).subtract(-1, 'days').format('DD MMM YYYY'); // tanggal berangkat setelahnya
            if(new Date(flight_date.subtract(+1, 'days').format(date_format)).getTime() < new Date(today_date).getTime()){
                $('.date_item_p1').removeClass("button_date_np");
                $('.date_item_p1').addClass("button_date_np_disabled");
                document.getElementById('div_onclick_p1').onclick = '';
            }
            if(new Date(flight_date.subtract(+1, 'days').format(date_format)).getTime() < new Date(today_date).getTime()){
                $('.date_item_p2').removeClass("button_date_np");
                $('.date_item_p2').addClass("button_date_np_disabled");
                document.getElementById('div_onclick_p2').onclick = '';
            }
            if(new Date(flight_date.subtract(-3, 'days').format(date_format)).getTime() >= new Date(nextdept).getTime()){
                $('.date_item_n1').removeClass("button_date_np");
                $('.date_item_n1').addClass("button_date_np_disabled");
                document.getElementById('div_onclick_n1').onclick = '';
            }
            if(new Date(flight_date.subtract(-1, 'days').format(date_format)).getTime() >= new Date(nextdept).getTime()){
                $('.date_item_n2').removeClass("button_date_np");
                $('.date_item_n2').addClass("button_date_np_disabled");
                document.getElementById('div_onclick_n2').onclick = '';
            }
            flight_date.subtract(+2, 'days') //balikin ke hari ini
        }
        else{
            var prevdept = moment(airline_request.departure[counter-1]).subtract(+1, 'days').format('DD MMM YYYY'); // tanggal berangkat sebelumnya
            if(airline_request.direction == 'MC'){
                if(counter_search != airline_request.departure.length-1){
                    var nextdept = moment(airline_request.departure[counter+1]).subtract(-1, 'days').format('DD MMM YYYY'); // tanggal berangkat setelahnya
                    if(new Date(flight_date.subtract(-1, 'days').format(date_format)).getTime() >= new Date(nextdept).getTime()){
                        $('.date_item_n1').removeClass("button_date_np");
                        $('.date_item_n1').addClass("button_date_np_disabled");
                        document.getElementById('div_onclick_n1').onclick = '';
                    }
                    if(new Date(flight_date.subtract(-1, 'days').format(date_format)).getTime() >= new Date(nextdept).getTime()){
                        $('.date_item_n2').removeClass("button_date_np");
                        $('.date_item_n2').addClass("button_date_np_disabled");
                        document.getElementById('div_onclick_n2').onclick = '';
                    }
                    flight_date.subtract(+2, 'days') //balikin ke hari ini
                }
            }
            if(new Date(flight_date.subtract(+1, 'days').format(date_format)).getTime() <= new Date(prevdept).getTime()){
                $('.date_item_p1').removeClass("button_date_np");
                $('.date_item_p1').addClass("button_date_np_disabled");
                document.getElementById('div_onclick_p1').onclick = '';
            }
            if(new Date(flight_date.subtract(+1, 'days').format(date_format)).getTime() <= new Date(prevdept).getTime()){
                $('.date_item_p2').removeClass("button_date_np");
                $('.date_item_p2').addClass("button_date_np_disabled");
                document.getElementById('div_onclick_p2').onclick = '';
            }
            flight_date.subtract(-2, 'days') //balikin ke hari ini

        }

    }
//    var today_date = moment().format('DD MMM YYYY'); //hari ini
//    var deptdate = moment(airline_request.departure[counter]).format('DD MMM YYYY'); //tanggal flight skrg
//    var pdate1 = moment(airline_request.departure[counter]).subtract(+1, 'days').format('DD MMM YYYY'); //1 tanggal sebelumnya
//    var pdate2 = moment(airline_request.departure[counter]).subtract(+2, 'days').format('DD MMM YYYY'); //2 tanggal sebelumnya
//    var ndate1 = moment(airline_request.departure[counter]).subtract(-1, 'days').format('DD MMM YYYY'); //1 tanggal setelahnya
//    var ndate2 = moment(airline_request.departure[counter]).subtract(-2, 'days').format('DD MMM YYYY'); //2 tanggal setelahnya
//
//    document.getElementById('prev_date_1').innerHTML = `<div class="button_date_np date_item_p1">`+pdate1+`</div>`;
//    document.getElementById('prev_date_2').innerHTML = `<div class="button_date_np date_item_p2">`+pdate2+`</div>`;
//    document.getElementById('next_date_1').innerHTML = `<div class="button_date_np date_item_n1">`+ndate1+`</div>`;
//    document.getElementById('next_date_2').innerHTML = `<div class="button_date_np date_item_n2">`+ndate2+`</div>`;
//    document.getElementById('now_date').innerHTML = `<div style="background:white; border:2px solid `+color+`; padding:15px 0; text-align: center;">`+deptdate+`</div>`;
//
//    if(airline_request.direction == 'OW'){
//        if(new Date(pdate1).getTime() < new Date(today_date).getTime()){
//            $('.date_item_p1').removeClass("button_date_np");
//            $('.date_item_p1').addClass("button_date_np_disabled");
//        }
//        if(new Date(pdate2).getTime() < new Date(today_date).getTime()){
//            $('.date_item_p2').removeClass("button_date_np");
//            $('.date_item_p2').addClass("button_date_np_disabled");
//        }
//    }else{
//        if(counter == 0){
//            //kalo flight pertama, tidak bisa pilih tgl sblm hari ini dan bisa pilih tanggal sebelum flight 2
//            var nextdept = moment(airline_request.departure[counter+1]).subtract(-1, 'days').format('DD MMM YYYY'); // tanggal berangkat setelahnya
//            if(new Date(pdate1).getTime() < new Date(today_date).getTime()){
//                $('.date_item_p1').removeClass("button_date_np");
//                $('.date_item_p1').addClass("button_date_np_disabled");
//            }
//            if(new Date(pdate2).getTime() < new Date(today_date).getTime()){
//                $('.date_item_p2').removeClass("button_date_np");
//                $('.date_item_p2').addClass("button_date_np_disabled");
//            }
//            if(new Date(ndate1).getTime() >= new Date(nextdept).getTime()){
//                $('.date_item_n1').removeClass("button_date_np");
//                $('.date_item_n1').addClass("button_date_np_disabled");
//            }
//            if(new Date(ndate2).getTime() >= new Date(nextdept).getTime()){
//                $('.date_item_n2').removeClass("button_date_np");
//                $('.date_item_n2').addClass("button_date_np_disabled");
//            }
//        }
//        if(counter == 1){
//            var prevdept = moment(airline_request.departure[counter-1]).subtract(+1, 'days').format('DD MMM YYYY'); // tanggal berangkat sebelumnya
//            if(airline_request.direction == 'MC'){
//                var nextdept = moment(airline_request.departure[counter+1]).subtract(-1, 'days').format('DD MMM YYYY'); // tanggal berangkat setelahnya
//                if(new Date(ndate1).getTime() >= new Date(nextdept).getTime()){
//                    $('.date_item_n1').removeClass("button_date_np");
//                    $('.date_item_n1').addClass("button_date_np_disabled");
//                }
//                if(new Date(ndate2).getTime() >= new Date(nextdept).getTime()){
//                    $('.date_item_n2').removeClass("button_date_np");
//                    $('.date_item_n2').addClass("button_date_np_disabled");
//                }
//            }
//            if(new Date(pdate1).getTime() <= new Date(prevdept).getTime()){
//                $('.date_item_p1').removeClass("button_date_np");
//                $('.date_item_p1').addClass("button_date_np_disabled");
//            }
//            if(new Date(pdate2).getTime() <= new Date(prevdept).getTime()){
//                $('.date_item_p2').removeClass("button_date_np");
//                $('.date_item_p2').addClass("button_date_np_disabled");
//            }
//
//        }
//        if(counter == 2){
//            var prevdept = moment(airline_request.departure[counter-1]).subtract(+1, 'days').format('DD MMM YYYY'); // tanggal berangkat sebelumnya
//            if(new Date(pdate1).getTime() == new Date(prevdept).getTime()){
//                $('.date_item_p1').removeClass("button_date_np");
//                $('.date_item_p1').addClass("button_date_np_disabled");
//            }
//            if(new Date(pdate2).getTime() == new Date(prevdept).getTime()){
//                $('.date_item_p2').removeClass("button_date_np");
//                $('.date_item_p2').addClass("button_date_np_disabled");
//            }
//        }
//
//    }
}

function change_seat_span(id1, id2, textseat){
    document.getElementById('choose_seat_span'+id1+id2).innerHTML = 'Choose Seat Class - '+textseat;
}



function checkboxCopyReschedule(){
    var count_copy = $(".copy_result:checked").length;
    if(count_copy == 0){
        $('#button_copy_airline').hide();
    }
    else{
        $('#button_copy_airline').show();
    }
    document.getElementById("badge-copy-notif").innerHTML = count_copy;
    document.getElementById("badge-copy-notif2").innerHTML = count_copy;
}

function checkboxCopyBoxReschedule(id){
    if(document.getElementById('copy_result'+id).checked) {
        var copycount = $(".copy_result:checked").length;
        if(copycount == ticket_count){
            document.getElementById("check_all_copy").checked = true;
        }

    } else {
        document.getElementById("check_all_copy").checked = false;
    }
    checkboxCopyReschedule();
}

function check_all_resultReschedule(){
   var selectAllCheckbox = document.getElementById("check_all_copy");
   if(selectAllCheckbox.checked==true){
        var checkboxes = document.getElementsByClassName("copy_result");
        for(var i=0, n=checkboxes.length;i<n;i++) {
        checkboxes[i].checked = true;
        $('#choose-airline-copy').hide();
    }
   }else {
    var checkboxes = document.getElementsByClassName("copy_result");
    for(var i=0, n=checkboxes.length;i<n;i++) {
        checkboxes[i].checked = false;
        $('#choose-airline-copy').show();
    }
   }
   checkboxCopyReschedule();
}

function get_checked_copy_resultReschedule(){
    document.getElementById("show-list-copy-airline").innerHTML = '';

    var search_params = document.getElementById("show-list-copy-airline").innerHTML = '';

    var value_idx = [];
//    $("#airline_search_params .copy_span").each(function(obj) {
//        value_idx.push( $(this).text() );
//    })
//
//    var value_flight_type = "";
//    if($radio_value_string != "multicity"){
//        if(check_flight_type == 1){
//            value_flight_type = "Departure Flight";
//        }else if(check_flight_type == 2){
//            value_flight_type = "Return Flight";
//        }else if(check_flight_type == 3){
//            value_flight_type = "Departure-Return Flight";
//        }
//    }else{
//        value_flight_type = "Multi-City Flight";
//    }

    text='';
    //$text='Search: '+value_idx[0]+'\n'+value_idx[1].trim()+'\nDate: '+value_idx[2]+'\n'+value_idx[3]+'\n\n';

    $text= value_idx[0]+' - '+value_idx[1]+' → '+value_idx[2]+', '+value_idx[3]+'\n\n';

    var airline_number = 0;
    node = document.createElement("div");
    //text+=`<div class="col-lg-12"><h5>`+value_flight_type+`</h5><hr/></div>`;
    text+=`<div class="col-lg-12" style="min-height=200px; max-height:500px; overflow-y: scroll;">`;
    $(".copy_result:checked").each(function(obj) {
        var parent_airline = $(this).parent().parent().parent().parent();
        var combo_price = parent_airline.find('.copy_combo_price').html();
        var price_airline = parent_airline.find('.copy_price').html();
        //var search_banner = parent_airline.find('.copy_search_banner').html();
        var value_copy = [];
        parent_airline.find('.copy_airline').each(function(obj) {
            value_copy.push($(this).html());
        });

        var id_airline = parent_airline.find('.id_copy_result').html();
        airline_number = airline_number + 1;
        $text += '› Option-'+airline_number+'\n';

        text+=`
        <div class="row" id="div_list`+id_airline+`">`;
        text+=`
            <div class="col-lg-9">
                <h5>Option-`+airline_number+`</h5>
            </div>`;

            for (var i = 0; i < value_copy.length; i++) {
                var temp_copy = ''+value_copy[i];
                var parent_copy = $("#copy_div_airline"+temp_copy);
            }

            var value_journey = [];
            parent_airline.find('.copy_journey').each(function(obj) {
                value_journey.push($(this).html());
            });

            text+=`
            <div class="col-lg-3" style="text-align:right;">
                <span style="font-weight:500; cursor:pointer;" onclick="delete_checked_copy_resultReschedule(`+id_airline+`);"><i class="fas fa-times-circle" style="color:red; font-size:18px;"></i> Delete</span>
            </div>
            <div class="col-lg-12"><br/>`;

            for (var i = 0; i < value_journey.length; i++) {
                var temp_journey = ''+value_journey[i];
                var parent_copy_details = $("#detail_departjourney"+temp_journey);
                var value_segments = [];
                parent_copy_details.find('.copy_segments').each(function(obj) {
                    value_segments.push($(this).html());
                });

                for (var j = 0; j < value_segments.length; j++){
                    var temp_segments = ''+value_segments[j];
                    var parent_segments = $("#copy_segments_details"+temp_segments);
                    var parent_po = $("#copy_provider_operated"+temp_segments);

                    parent_segments.find('.copy_transit_details').each(function(obj) {
                        if($(this).html() != undefined || $(this).html() != ''){
                            if($(this).html() != "0"){
                                text+=`<br/><span style="font-weight:500;">`+$(this).html()+` </span><br/>`;
                                $text += '• '+$(this).html()+' \n';
                            }
                        }
                    });

                    var co_j = j+1;
                    text+=`<h5>Flight-`+co_j+`</h5>`;
                    $text += '\nFlight-'+co_j+'\n';

                    parent_segments.find('.copy_carrier_provider_details').each(function(obj) {
                        if($(this).html() != undefined){
                            text+=`<span>Airlines: `+$(this).html()+` </span>`;
                            $text += '› '+$(this).html()+' ';
                            parent_segments.find('.carrier_code_template').each(function(obj_carrier_code){
                                if($(this).html() != undefined){
                                    text+=`<span>`+$(this).html()+` </span>`;
                                    $text += $(this).html()+' ';
                                }
                            });

                            parent_segments.find('.radio-button-custom').each(function(i, obj_sub_class){
                                var id_class_of_service = $(this).html().split('id="')[1].split('"')[0]
                                var change_radios = document.getElementsByName(id_class_of_service);
                                for (var j = 0, length = change_radios.length; j < length; j++) {
                                    if (change_radios[j].checked && i == j) {
                                        text+=`<br/><span>`+$(this).html().replace(' ','').split('(')[4].split(')')[0]+` (`+$(this).html().split('(')[0].replace('\n','').replace(/ /g,'')+`)</span>`;
                                        $text += `\n`+$(this).html().replace(' ','').split('(')[4].split(')')[0]+` (`+$(this).html().split('(')[0].replace('\n','').replace(/ /g,'')+`)`;
                                        break;
                                    }
                                }
                            });
                        }
                    });

                    parent_po.find('.copy_operated_by').each(function(obj) {
                        if($(this).html() != undefined){
                            text+=`<span> (`+$(this).html()+`)</span>`;
                            $text += ' ('+$(this).html()+')';
                        }
                    });
                    text+=`<br/>`;
                    $text += '\n';
                    var value_legs = [];
                    parent_segments.find('.copy_legs').each(function(obj) {
                        value_legs.push($(this).html());
                    });

                    for (var k = 0; k < value_legs.length; k++){
                       var temp_legs = ''+value_legs[k];
                       var parent_legs = $("#copy_legs_details"+temp_legs);
                       var parent_duration = $("#copy_legs_duration_details"+temp_legs);

                       text+=`
                       <div class="row">
                           <div class="col-xs-6" style="text-align:left;">`;

                       $text += '\n';
                       $text += 'Departure: ';
                       parent_legs.find('.copy_legs_depart').each(function(obj) {
                           if($(this).html() != undefined){
                               text+=`<b>Departure</b><br/><span>`+$(this).html()+` </span>`;
                               $text += $(this).html()+', ';
                           }
                       });

                       parent_legs.find('.copy_legs_date_depart').each(function(obj) {
                           if($(this).html() != undefined){
                               text+=`<br/><span>`+$(this).html()+` </span>`;
                               $text += $(this).html()+' ';
                           }
                       });
                       text+=`</div>
                       <div class="col-xs-6" style="text-align:right;">`;
                       $text += '\nArrival: ';
                       parent_legs.find('.copy_legs_arr').each(function(obj) {
                           if($(this).html() != undefined){
                               text+=`<b>Arrival</b><br/><span> `+$(this).html()+` </span>`;
                               $text += ''+$(this).html()+', ';
                           }
                       });

                       parent_legs.find('.copy_legs_date_arr').each(function(obj) {
                           if($(this).html() != undefined){
                               text+=`<br/><span> `+$(this).html()+` </span>`;
                               $text += ' '+$(this).html()+' ';
                           }
                       });
                       text+=`</div>
                        <div class="col-lg-12">
                            <br/>
                        </div>
                       </div>`;

                       $text+='\n';
                    }

                    $text+='\n';
                    var value_fares = [];
                    parent_segments.find('.copy_fares').each(function(obj) {
                        value_fares.push($(this).html());
                    });
                    for (var l = 0; l < value_fares.length; l++){
                       var temp_fares = ''+value_fares[l];
                       var parent_fares = $("#copy_fares_details"+temp_fares);
                       parent_fares.find('.copy_suitcase_details').each(function(obj) {
                           if($(this).html() != undefined || $(this).html() != ''){
                               text+=`<span>• Baggage: `+$(this).html()+` </span><br/>`;
                               $text += '• Baggage   : '+$(this).html()+' \n';
                           }
                       });
                       parent_fares.find('.copy_utensils_details').each(function(obj) {
                           if($(this).html() != undefined || $(this).html() != ''){
                               text+=`<span>• Meal: `+$(this).html()+` </span><br/>`;
                               $text += '• Meal  : '+$(this).html()+' \n';
                           }
                       });
                       parent_fares.find('.copy_others_details').each(function(obj) {
                           if($(this).html() != undefined || $(this).html() != ''){
                               text+=`<span>• Others: `+$(this).html()+` </span><br/>`;
                               $text += '• Others    : '+$(this).html()+' \n';
                           }
                       });

                       parent_duration.find('.copy_duration_details').each(function(obj) {
                           if($(this).html() != undefined || $(this).html() != ''){
                               text+=`<span>• Duration: `+$(this).html()+` </span><br/>`;
                               $text += '• Duration :'+$(this).html()+' \n';
                           }
                       });
                    }
                }

//                if(search_banner != undefined){
//                    text+=`<span class="search_banner_airline">• `+search_banner+`</span><br/>`;
//                    $text += '• '+search_banner+'\n';
//                }
                $text+='--------------------\n';
                text+=`<hr/>`;
                if(combo_price != undefined){
                    text+=`<span class="price_template">Price: `+price_airline+` (`+combo_price+`)</span><br/>`;
                    $text += 'Price: '+price_airline+ ' ('+combo_price+')\n';
                }else{
                    text+=`<span class="price_template">Price: `+price_airline+`</span><br/>`;
                    $text += 'Price: '+price_airline+'\n';
                }

                $text+='====================\n\n';
            }
            text+=`
            </div>
            <div class="col-lg-12"><hr/></div>
        </div>`;
    });
    text+=`
    </div>
    <div class="col-lg-12" style="margin-bottom:15px;" id="share_result">
        <span style="font-size:14px; font-weight:bold;">Share This on:</span><br/>`;
        share_data();
        var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
            text+=`
                <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" alt="Whatsapp" src="/static/tt_website_rodextrip/img/whatsapp.png"/></a>`;
            if(airline_number < 11){
                text+=`
                    <a href="line://msg/text/`+ $text_share +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" alt="Line" src="/static/tt_website_rodextrip/img/line.png"/></a>
                    <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" alt="Telegram" src="/static/tt_website_rodextrip/img/telegram.png"/></a>`;
            }
            else{
                text+=`
                <a href="#" target="_blank" title="Share by Line" style="padding-right:5px; cursor:not-allowed;"><img style="height:30px; width:auto;" alt="Line Disable" src="/static/tt_website_rodextrip/img/line-gray.png"/></a>
                <a href="#" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" alt="Telegram Disable" src="/static/tt_website_rodextrip/img/telegram-gray.png"/></a>`;
            }
            text+=`
                <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" alt="Email" src="/static/tt_website_rodextrip/img/email.png"/></a>`;
        } else {
            text+=`
                <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" alt="Whatsapp" src="/static/tt_website_rodextrip/img/whatsapp.png"/></a>`;
            if(airline_number < 11){
                text+=`
                    <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" alt="Line" src="/static/tt_website_rodextrip/img/line.png"/></a>
                    <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" alt="Telegram" src="/static/tt_website_rodextrip/img/telegram.png"/></a>`;
            }
            else{
                text+=`
                <a href="#" title="Share by Line" style="padding-right:5px; cursor:not-allowed;"><img style="height:30px; width:auto;" alt="Line Disable" src="/static/tt_website_rodextrip/img/line-gray.png"/></a>
                <a href="#" title="Share by Telegram" style="padding-right:5px; cursor:not-allowed;"><img style="height:30px; width:auto;" alt="Telegram Disable" src="/static/tt_website_rodextrip/img/telegram-gray.png"/></a>`;
            }
            text+=`
                <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" alt="Email" src="/static/tt_website_rodextrip/img/email.png"/></a>`;
        }
        if(airline_number > 10){
            text+=`<br/><span style="color:red;">Nb: Share on Line and Telegram Max 10 Airline</span>`;
        }
    text+=`
    </div>
    <div class="col-lg-12" id="copy_result">
        <input class="primary-btn-white" style="width:100%;" type="button" onclick="copy_data();" value="Copy">
    </div>`;

    node.innerHTML = text;
    node.className = "row";
    document.getElementById("show-list-copy-airline").appendChild(node);

//    if(hotel_number > 10){
//        document.getElementById("mobile_line").style.display = "none";
//        document.getElementById("mobile_telegram").style.cursor = "not-allowed";
//        document.getElementById("pc_line").style.display = "not-allowe";
//        document.getElementById("pc_telegram").style.cursor = "not-allowed";
//    }
//
    var count_copy = $(".copy_result:checked").length;
    if (count_copy == 0){
        $('#choose-airline-copy').show();
        $("#share_result").remove();
        $("#copy_result").remove();
        $text = '';
        $text_share = '';
    }else{
        $('#choose-airline-copy').hide();
    }
}

function delete_checked_copy_resultReschedule(id){
    $("#div_list"+id).remove();
    $("#copy_result"+id).prop("checked", false);
    checkboxCopyBoxReschedule(id)
    var count_copy = $(".copy_result:checked").length;
    if (count_copy == 0){
        $('#choose-airline-copy').show();
        $("#share_result").remove();
        $("#copy_result").remove();
        $text = '';
        $text_share = '';
    }
    else{
        $('#choose-airline-copy').hide();
        get_checked_copy_resultReschedule();
        share_data();
    }
    checkboxCopyReschedule();
}

function choose_airline_groupbooking(text){
    $('#show_provider_airline').text(text);
}

function show_loading_reorder(product){
    $('.next-loading-reorder').addClass("running");
    $('.next-loading-reorder').prop('disabled', true);
    $('.issued_booking_btn').prop('disabled', true);
    $('#button-sync-status').prop('disabled', true);

    custom_waiting = '';
    if(product == 'airline'){
        custom_waiting += `
        <div id="waitFlightSearch" style="display:block;">
            <div class="center-div-t">
                <div>
                    <img src="/static/tt_website_rodextrip/img/loading-screen-white.gif" style="height:30px; width:30px;"/>
                </div>
            </div>
            <div style="text-align:center">
                <span style="font-size:20px; font-weight:bold; color:`+text_color+`;" id="text_value_waiting">Set Request, please wait <img src="/static/tt_website_rodextrip/img/loading-dot-white.gif" style="height:50px; width:50px;"/></span>
            </div>
        </div>`;
    }
    document.getElementById("viewWaitingTransaction").innerHTML = custom_waiting;
    $("#waitingTransaction").modal('show');

}