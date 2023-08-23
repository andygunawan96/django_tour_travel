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
now_page = '';

picker_multi_city = [];

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
    },{
        value:'Shortest Duration',
        status: false
    },{
        value:'Highest Duration',
        status: false
    },{
        value:'Shortest Transit Duration',
        status: false
    },{
        value:'Highest Transit Duration',
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
    },{
        value:'Duration',
        status: false
    },{
        value:'Transit Duration',
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

function add_promotion_code(car_code='', osi_code=''){
    text = '';
    text +=`
    <div class="row" id="promotion_code_line`+promotion_code+`" style="background:white; padding-bottom:15px; margin-bottom:15px; border-top:1px solid #cdcdcd; border-bottom:1px solid #cdcdcd;">
        <div class="col-xs-12" style="text-align:right;">
            <button type="button" class="primary-delete-date" onclick="delete_promotion_code(`+promotion_code+`)"><i class="fa fa-times" style="color:#E92B2B;font-size:16px;"></i> Delete</button>
        </div>
        <div class="col-lg-6">
            <label>Code</label>
            <input type="text" class="form-control" id="code_line`+promotion_code+`" name="code_line`+promotion_code+`" placeholder="Code" value="`+osi_code+`"/>
        </div>
        <div class="col-lg-6">
            <label>Carrier Code</label>
            <input type="text" class="form-control" id="carrier_code_line`+promotion_code+`" name="carrier_code_line`+promotion_code+`" placeholder="ex GA" value="`+car_code+`"/>
        </div>
    </div>`;
    var node = document.createElement("div");
    node.innerHTML = text;
    document.getElementById("promotion_code").appendChild(node);
    promotion_code++;
    document.getElementById('promo_code_counter').value = promotion_code;
}

function toggle_promo_code(){
    if(document.getElementById('checkbox_add_promotion_code_airline').checked){
        document.getElementById('promo_code_airline').style.display = 'block';
    }else{
        document.getElementById('promo_code_airline').style.display = 'none';
    }
}

function add_promotion_code_home(){
    text = '';
    text +=`
    <div class="row" id="promotion_code_line`+promotion_code+`" style="background:white; padding-bottom:15px; margin-bottom:15px; border-top:1px solid #cdcdcd; border-bottom:1px solid #cdcdcd;">
        <div class="col-xs-12" style="text-align:right;">
            <button type="button" class="primary-delete-date" onclick="delete_promotion_code(`+promotion_code+`)"><i class="fa fa-times" style="color:#E92B2B;font-size:16px;"></i> Delete</button>
        </div>
        <div class="col-lg-6">
            <label>Code</label>
            <input type="text" class="form-control" id="code_line`+promotion_code+`" name="code_line`+promotion_code+`" placeholder="Code" value=""/>
        </div>
        <div class="col-lg-6">
            <label>Carrier Code</label>
            <input type="text" class="form-control" id="carrier_code_line`+promotion_code+`" name="carrier_code_line`+promotion_code+`" placeholder="ex GA" value=""/>
        </div>
    </div>`;
    var node = document.createElement("div");
    node.innerHTML = text;
    document.getElementById("promo_code_airline_div").appendChild(node);
    promotion_code++;
    document.getElementById('promo_code_counter').value = promotion_code;
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

    try{
        if(document.getElementById('checkbox_corpor_mode_airline').checked){
            var cor_selection = document.getElementById('airline_corpor_select');
            var corbooker_selection = document.getElementById('airline_corbooker_select');
            if(!cor_selection.options[cor_selection.selectedIndex].value || !corbooker_selection.options[corbooker_selection.selectedIndex].value)
            {
                error_log+= 'Please choose Corporate and Booker, or uncheck "Activate Corporate Mode" if you do not wish to activate it\n';
            }
        }
    }catch(err){
        console.log('no corpor mode checkbox on airline search UI');
    }
    var quantity_total_pax = parseInt(document.getElementById('adult_flight').value)+parseInt(document.getElementById('child_flight').value);
    if(document.getElementById('student_flight'))
        quantity_total_pax += parseInt(document.getElementById('student_flight').value);
    if(document.getElementById('labour_flight'))
        quantity_total_pax += parseInt(document.getElementById('labour_flight').value);
    if(document.getElementById('seaman_flight'))
        quantity_total_pax += parseInt(document.getElementById('seaman_flight').value);
    if(quantity_total_pax == 0)
        error_log += 'Please input passenger\n';

//    error_log = ''; //DEV GARUDA
    if(error_log == ''){
        $('.button-search').addClass("running");
        document.getElementById('counter').value = counter_airline_search;
        // SIMPEN CACHE
        var radios = document.getElementsByName('radio_airline_type');
        var direction = '';
        for (var j = 0, length = radios.length; j < length; j++) {
            if (radios[j].checked) {
                // do whatever you want with the checked radio
                direction = radios[j].value;
                // only one radio can be logically checked, don't check the rest
                break;
            }
        }
        if(['oneway', 'roundtrip'].includes(direction)){
            request_airline = {
                "origin": [document.getElementById('origin_id_flight').value],
                "destination": [document.getElementById('destination_id_flight').value],
                "departure": [direction == 'roundtrip' ? document.getElementById('airline_departure_return').value.split(' - ')[0] : document.getElementById('airline_departure').value],
                "return": [direction == 'roundtrip' ? document.getElementById('airline_departure_return').value.split(' - ')[1] : ''],
                "direction": direction,
                "adult": parseInt(document.getElementById('adult_flight').value),
                "child": parseInt(document.getElementById('child_flight').value),
                "infant": parseInt(document.getElementById('infant_flight').value),
                "cabin_class": document.getElementById('cabin_class_flight').value,
                "cabin_class_list": [], // hanya untuk MC
                "is_combo_price": document.getElementById('is_combo_price').checked,
                "carrier_codes": [],
                "counter":1
            }

            // check adv
            if(document.getElementById('student_flight'))
                request_airline['student'] = parseInt(document.getElementById('student_flight').value);
            if(document.getElementById('labour_flight'))
                request_airline['labour'] = parseInt(document.getElementById('labour_flight').value);
            if(document.getElementById('seaman_flight'))
                request_airline['seaman'] = parseInt(document.getElementById('seaman_flight').value);

            if(document.getElementById('provider_box_All') && document.getElementById('provider_box_All').checked){

            }else{
                for(i in airline_provider_list){
                    if(document.getElementById('provider_box_'+i) && document.getElementById('provider_box_'+i).checked){
                        request_airline['carrier_codes'].push(i);
                    }
                }
            }
            //
        }else{
            // MC
            request_airline = {
                "origin": [],
                "destination": [],
                "departure": [],
                "return": [],
                "direction": direction,
                "adult": parseInt(document.getElementById('adult_flight1').value),
                "child": parseInt(document.getElementById('child_flight1').value),
                "infant": parseInt(document.getElementById('infant_flight1').value),
                "cabin_class": document.getElementById('cabin_class_flight_mc').value,
                "cabin_class_list": [], // hanya untuk MC
                "is_combo_price": document.getElementById('is_combo_price').checked,
                "carrier_codes": [],
                "counter": counter_airline_search
            }
            for(i=1;i<=counter_airline_search;i++){
                request_airline['origin'].push(document.getElementById('origin_id_flight'+i).value)
                request_airline['destination'].push(document.getElementById('destination_id_flight'+i).value)
                request_airline['departure'].push(document.getElementById('airline_departure'+i).value)
                request_airline['cabin_class_list'].push(document.getElementById('cabin_class_flight'+i).value)
            }
            if(document.getElementById('student_flight1'))
                request_airline['student'] = parseInt(document.getElementById('student_flight1').value);
            if(document.getElementById('labour_flight1'))
                request_airline['labour'] = parseInt(document.getElementById('labour_flight1').value);
            if(document.getElementById('seaman_flight1'))
                request_airline['seaman'] = parseInt(document.getElementById('seaman_flight1').value);

            if(document.getElementById('provider_box_All_1') && document.getElementById('provider_box_All_1').checked){

            }else{
                for(i in airline_provider_list){
                    if(document.getElementById('provider_box_'+i+'_1') && document.getElementById('provider_box_'+i+'_1').checked){
                        request_airline['carrier_codes'].push(i);
                    }
                }
            }
        }
        if(document.getElementById('promo_code_counter')){
            promo_code_counter = document.getElementById('promo_code_counter').value;
            list_promo_code = [];
            if(promo_code_counter != ''){
                for(i=0;i<parseInt(promo_code_counter);i++){
                    try{
                        list_promo_code.push({
                            "carrier_code": document.getElementById('carrier_code_line'+i).value,
                            "promo_code": document.getElementById('code_line'+i).value,
                        })
                    }catch(err){console.log(err)}
                }
            }
            document.getElementById('promo_code_counter_list').value = JSON.stringify(list_promo_code);
        }
        document_set_cookie('airline_request', JSON.stringify(request_airline));

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
    if(counter_airline_search != 4){
        counter_airline_search++;
        if(counter_airline_search == 1){
            var min_pax = 1;
            if(airline_advance_pax_type == 'true')
                min_pax = 0;
            quantity_adult_flight = parseInt(document.getElementById('adult_flight').value);
            quantity_child_flight = parseInt(document.getElementById('child_flight').value);
            quantity_infant_flight = parseInt(document.getElementById('infant_flight').value);
            if(airline_pax_type_student == 'true' && document.getElementById('student_flight'))
                quantity_student_flight = parseInt(document.getElementById('student_flight').value);
            if(airline_pax_type_labour == 'true' && document.getElementById('labour_flight'))
                quantity_labour_flight = parseInt(document.getElementById('labour_flight').value);
            if(airline_pax_type_seaman == 'true' && document.getElementById('seaman_flight'))
                quantity_seaman_flight = parseInt(document.getElementById('seaman_flight').value);
            var node_paxs = document.createElement("div");
            text_paxs = `
            <div class="row">
                <div class="col-lg-4" style="text-align:left;">`;
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
                                </div>`;
                                if(airline_pax_type_student == 'true' && document.getElementById('student_flight')){
                text_paxs += `  <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="float:left !important;">
                                    <div style="float:left;">
                                        <label>
                                            <span style="color:black; font-size:13px;">Student</span><br/>
                                            <span style="color:gray; font-size:11px;">(Age 11+)</span>
                                        </label>
                                    </div>
                                </div>
                                <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="float:right !important;">
                                    <div style="float:right; display:flex; padding:5px 0px 5px 5px;">`;
                                        if(quantity_student_flight == 1)
                                        text_paxs +=`
                                        <button type="button" class="left-minus-student-flight btn-custom-circle" id="left-minus-student-flight`+counter_airline_search+`" onclick="airline_set_passenger_minus('student',`+counter_airline_search+`);" data-type="minus" data-field="" disabled>`;
                                        else
                                        text_paxs+=`<button type="button" class="left-minus-student-flight btn-custom-circle" id="left-minus-student-flight`+counter_airline_search+`" onclick="airline_set_passenger_minus('student',`+counter_airline_search+`);" data-type="minus" data-field="" >`;
                                        text_paxs +=`
                                            <i class="fas fa-minus"></i>
                                        </button>
                                        <input type="text" style="padding:5px !important; border:none; background:none; font-size:13px; text-align:center; width:25px;" id="student_flight`+counter_airline_search+`" name="student_flight`+counter_airline_search+`" value="`+quantity_student_flight+`" min="`+min_pax+`" readonly>`;
                                        if(quantity_adult_flight + quantity_child_flight == 9)
                                        text_paxs +=`<button type="button" class="right-plus-student-flight btn-custom-circle" id="right-plus-student-flight`+counter_airline_search+`" data-type="plus" data-field="" onclick="airline_set_passenger_plus('student',`+counter_airline_search+`);" disabled>`;
                                        else
                                        text_paxs +=`<button type="button" class="right-plus-student-flight btn-custom-circle" id="right-plus-student-flight`+counter_airline_search+`" data-type="plus" data-field="" onclick="airline_set_passenger_plus('student',`+counter_airline_search+`);">`;
                                        text_paxs +=`
                                            <i class="fas fa-plus"></i>
                                        </button>
                                    </div>
                                </div>`;
                                }
                                if(airline_pax_type_labour == 'true' && document.getElementById('labour_flight')){
                text_paxs += `  <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="float:left !important;">
                                    <div style="float:left;">
                                        <label>
                                            <span style="color:black; font-size:13px;">Labour</span><br/>
                                            <span style="color:gray; font-size:11px;">(Age 11+)</span>
                                        </label>
                                    </div>
                                </div>
                                <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="float:right !important;">
                                    <div style="float:right; display:flex; padding:5px 0px 5px 5px;">`;
                                        if(quantity_labour_flight == 1)
                                        text_paxs +=`
                                        <button type="button" class="left-minus-labour-flight btn-custom-circle" id="left-minus-labour-flight`+counter_airline_search+`" onclick="airline_set_passenger_minus('labour',`+counter_airline_search+`);" data-type="minus" data-field="" disabled>`;
                                        else
                                        text_paxs+=`<button type="button" class="left-minus-labour-flight btn-custom-circle" id="left-minus-labour-flight`+counter_airline_search+`" onclick="airline_set_passenger_minus('labour',`+counter_airline_search+`);" data-type="minus" data-field="" >`;
                                        text_paxs +=`
                                            <i class="fas fa-minus"></i>
                                        </button>
                                        <input type="text" style="padding:5px !important; border:none; background:none; font-size:13px; text-align:center; width:25px;" id="labour_flight`+counter_airline_search+`" name="labour_flight`+counter_airline_search+`" value="`+quantity_labour_flight+`" min="`+min_pax+`" readonly>`;
                                        if(quantity_adult_flight + quantity_child_flight == 9)
                                        text_paxs +=`<button type="button" class="right-plus-labour-flight btn-custom-circle" id="right-plus-labour-flight`+counter_airline_search+`" data-type="plus" data-field="" onclick="airline_set_passenger_plus('labour',`+counter_airline_search+`);" disabled>`;
                                        else
                                        text_paxs +=`<button type="button" class="right-plus-labour-flight btn-custom-circle" id="right-plus-labour-flight`+counter_airline_search+`" data-type="plus" data-field="" onclick="airline_set_passenger_plus('labour',`+counter_airline_search+`);">`;
                                        text_paxs +=`
                                            <i class="fas fa-plus"></i>
                                        </button>
                                    </div>
                                </div>`;
                                }
                                if(airline_pax_type_seaman == 'true' && document.getElementById('seaman_flight')){
                text_paxs += `  <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="float:left !important;">
                                    <div style="float:left;">
                                        <label>
                                            <span style="color:black; font-size:13px;">Seaman</span><br/>
                                            <span style="color:gray; font-size:11px;">(Age 11+)</span>
                                        </label>
                                    </div>
                                </div>
                                <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="float:right !important;">
                                    <div style="float:right; display:flex; padding:5px 0px 5px 5px;">`;
                                        if(quantity_seaman_flight == 1)
                                        text_paxs +=`
                                        <button type="button" class="left-minus-seaman-flight btn-custom-circle" id="left-minus-seaman-flight`+counter_airline_search+`" onclick="airline_set_passenger_minus('seaman',`+counter_airline_search+`);" data-type="minus" data-field="" disabled>`;
                                        else
                                        text_paxs+=`<button type="button" class="left-minus-seaman-flight btn-custom-circle" id="left-minus-seaman-flight`+counter_airline_search+`" onclick="airline_set_passenger_minus('seaman',`+counter_airline_search+`);" data-type="minus" data-field="" >`;
                                        text_paxs +=`
                                            <i class="fas fa-minus"></i>
                                        </button>
                                        <input type="text" style="padding:5px !important; border:none; background:none; font-size:13px; text-align:center; width:25px;" id="seaman_flight`+counter_airline_search+`" name="seaman_flight`+counter_airline_search+`" value="`+quantity_seaman_flight+`" min="`+min_pax+`" readonly>`;
                                        if(quantity_adult_flight + quantity_child_flight == 9)
                                        text_paxs +=`<button type="button" class="right-plus-seaman-flight btn-custom-circle" id="right-plus-seaman-flight`+counter_airline_search+`" data-type="plus" data-field="" onclick="airline_set_passenger_plus('seaman',`+counter_airline_search+`);" disabled>`;
                                        else
                                        text_paxs +=`<button type="button" class="right-plus-seaman-flight btn-custom-circle" id="right-plus-seaman-flight`+counter_airline_search+`" data-type="plus" data-field="" onclick="airline_set_passenger_plus('seaman',`+counter_airline_search+`);">`;
                                        text_paxs +=`
                                            <i class="fas fa-plus"></i>
                                        </button>
                                    </div>
                                </div>`;
                                }
                                text_paxs+=`
                                <div class="col-lg-12" style="text-align:right;">
                                    <hr/>
                                    <button class="primary-btn" type="button" style="line-height:34px;" onclick="next_focus_element('airline','passenger1');">Done</button>
                                </div>
                            </div>
                        </ul>
                    </div>
                </div>
                <div class="col-lg-4">`;
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
                <div class="col-lg-4">
                    <span class="span-search-ticket">Preferred Class</span>`;
                    if(template == 1){
                        text_paxs += `
                        <div class="input-container-search-ticket btn-group">
                            <div class="form-select" id="default-select">
                                <select id="cabin_class_flight_mc" name="cabin_class_flight_mc" data-live-search="true" size="4">`;
                    }
                    else if(template == 2){
                        text_paxs += `
                        <div>
                            <div class="form-select" id="default-select">
                                <select id="cabin_class_flight_mc" name="cabin_class_flight_mc" data-live-search="true" size="4" class="form-control">`;
                    }
                    else if(template == 3){
                       text_paxs += `
                       <div class="form-group">
                            <div class="default-select" id="default-select">
                                <select id="cabin_class_flight_mc" name="cabin_class_flight_mc" data-live-search="true" size="4">`;
                    }
                    else if(template == 4){
                        text_paxs += `
                        <div class="input-container-search-ticket btn-group">
                            <div class="form-select">
                                <select class="nice-select-default" id="cabin_class_flight_mc" name="cabin_class_flight_mc">`;
                    }
                    else if(template == 5 || template == 6){
                        text_paxs += `
                        <div>
                            <div>
                                <select class="form-control" id="cabin_class_flight_mc" name="cabin_class_flight_mc">`;
                    }
                    else if(template == 7){
                        text_paxs += `
                        <div class="select-form mb-30">
                            <div class="select-itms">
                                <select id="cabin_class_flight_mc" name="cabin_class_flight_mc">`;
                    }
                    for(i in cabin_class){
                        try{
                            if(type == 'search'){
                                if(airline_request.cabin_class == cabin_class[i].value)
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
                            console.log(err);
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
            plus_min_passenger_airline_btn();
            get_carrier_code_list(type, counter_airline_search);
            airline_provider_list_mc.push(airline_provider_list);
            $('#cabin_class_flight_mc').niceSelect();

            $('#cabin_class_flight_mc').on('change', function() {
                setTimeout(function(){
                    $("#origin_id_flight"+counter_airline_search).focus();
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
        //add template
        if(template == 4){
            text = `
            <div class="col-lg-12" style="text-align:left; margin-top:10px; margin-bottom:10px;">
                <h5 style="color:`+text_color+`;">Flight-`+counter_airline_search+`</h5>
            </div>
            <div class="col-lg-6">
                <div class="row">
                    <div class="col-lg-6 col-md-6 airline-from">
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
                    <div class="col-lg-6 col-md-6 airline-to" style="z-index:5;">
                        <h4 class="image-change-route-vertical"><a class="switch_a" href="javascript:airline_switch(`+counter_airline_search+`);" tabindex="-1" style="z-index:5;" id="flight_switch`+counter_airline_search+`"><span class="icon icon-exchange"></span></a></h4>
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
            <div class="col-lg-6 mb-4">
                <div class="row">
                    <div class="col-lg-6 col-md-6">
                        <span class="span-search-ticket">Departure</span>
                        <div class="input-container-search-ticket">
                            <i class="fas fa-calendar-alt" style="padding:14px; height: 43px; width: 45px; background:`+color+`; color:`+text_color+`;"></i>
                            <input type="text" class="form-control" name="airline_departure`+counter_airline_search+`" id="airline_departure`+counter_airline_search+`" placeholder="Departure Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date '" autocomplete="off" readonly style="background:white;">
                        </div>
                    </div>
                    <div class="col-lg-6 col-md-6">
                        <span class="span-search-ticket">Class</span>
                            <div class="input-container-search-ticket btn-group">
                                <div class="form-select">
                                    <select class="nice-select-default" id="cabin_class_flight`+counter_airline_search+`" name="cabin_class_flight`+counter_airline_search+`">`;
                                    for(i in cabin_class){
                                        try{
                                            if(type == 'search'){
                                                if(airline_request.cabin_class_list[counter_airline_search-1] == cabin_class[i].value || airline_request.cabin_class_list.length < counter_airline_search && i == 0)
                                                    text +=`<option value="`+cabin_class[i].value+`" selected>`+cabin_class[i].name+`</option>`;
                                                else
                                                    text +=`<option value="`+cabin_class[i].value+`" >`+cabin_class[i].name+`</option>`;
                                            }else if(i == 0){
                                                if(type == 'home')
                                                    text +=`<option value="`+cabin_class[i].value+`" selected>`+cabin_class[i].name+`</option>`;
                                                else
                                                    text +=`<option value="`+cabin_class[i].value+`" >`+cabin_class[i].name+`</option>`;
                                            }else
                                                text +=`<option value="`+cabin_class[i].value+`" >`+cabin_class[i].name+`</option>`;
                                        }catch(err){
                                            if(i == 0)
                                                text +=`<option value="`+cabin_class[i].value+`" selected>`+cabin_class[i].name+`</option>`;
                                            else
                                                text +=`<option value="`+cabin_class[i].value+`" >`+cabin_class[i].name+`</option>`;
                                        }
                                    }
                                 text +=`</select>
                                <br/><span style="float:left;color:`+text_color+`">If supported by airlines</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        }
        else{
            text = `
            <div class="col-lg-12 mb-3">
                <div class="row">
                    <div class="col-lg-12" style="text-align:left; margin-top:10px; margin-bottom:15px;">
                        <h5 style="color:`+text_color+`">Flight-`+counter_airline_search+`</h5>
                    </div>`;

                    if(template == 3 || template == 7){
                        text+=`<div class="col-lg-12">`;
                    }
                    else{
                        text+=`<div class="col-lg-6">`;
                    }
                    text+=`
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
                                    }
                                    else if(counter_airline_search==1){
                                        try{
                                            text+=`
                                            <input id="origin_id_flight`+counter_airline_search+`" name="origin_id_flight`+counter_airline_search+`" class="form-control" type="text" placeholder="Origin" style="width:100%;outline:0" autocomplete="off" value="`+airline_request.origin[counter_airline_search - 1]+`" onfocus="document.getElementById('origin_id_flight`+counter_airline_search+`').select();" onclick="set_airline_search_value_to_false();">`;
                                        }catch(err){
                                            text+=`
                                            <input id="origin_id_flight`+counter_airline_search+`" name="origin_id_flight`+counter_airline_search+`" class="form-control" type="text" placeholder="Origin" style="width:100%;outline:0" autocomplete="off" value="`+airline_origin+`" onfocus="document.getElementById('origin_id_flight`+counter_airline_search+`').select();" onclick="set_airline_search_value_to_false();">`;
                                        }
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
                            <div class="col-lg-6 col-md-6 airline-to" style="z-index:5;">
                                <div class="image-change-route-vertical">
                                    <h4><a class="switch_a" href="javascript:airline_switch(`+counter_airline_search+`);" tabindex="-1" style="z-index:5; color:black;" id="flight_switch`+counter_airline_search+`"><i class="image-rounded-icon2"><i class="fas fa-exchange-alt"></i></i></a></h4>
                                </div>
                                <div class="image-change-route-horizontal">
                                    <h4><a class="horizontal-arrow" href="javascript:airline_switch(`+counter_airline_search+`);" tabindex="-1" style="z-index:5; color:`+text_color+`;" id="flight_switch`+counter_airline_search+`"><i class="image-rounded-icon"><i class="fas fa-exchange-alt icon-change"></i></i></a></h4>
                                </div>
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
                    </div>`;
                    if(template == 3 || template == 7){
                        text+=`<div class="col-lg-12">`;
                    }
                    else{
                        text+=`<div class="col-lg-6">`;
                    }
                    text+=`
                        <div class="row">
                            <div class="col-lg-6 col-md-6">
                                <span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Departure</span>
                                <div class="input-container-search-ticket">
                                    <input type="text" class="form-control" name="airline_departure`+counter_airline_search+`" id="airline_departure`+counter_airline_search+`" placeholder="Departure Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date '" autocomplete="off" readonly style="background:white;">
                                </div>
                            </div>
                            <div class="col-lg-6 col-md-6">
                                <span class="span-search-ticket">Class</span>`;
                                if(template == 1){
                                    text += `
                                    <div class="input-container-search-ticket btn-group">
                                        <div class="form-select" id="default-select`+counter_airline_search+`">
                                            <select id="cabin_class_flight`+counter_airline_search+`" name="cabin_class_flight`+counter_airline_search+`" data-live-search="true" size="4">`;
                                }
                                else if(template == 2){
                                    text += `
                                    <div>
                                        <div class="form-select" id="default-select`+counter_airline_search+`">
                                            <select id="cabin_class_flight`+counter_airline_search+`" name="cabin_class_flight`+counter_airline_search+`" data-live-search="true" size="4" class="form-control">`;
                                }
                                else if(template == 3){
                                   text += `
                                   <div class="form-group">
                                        <div class="default-select" id="default-select`+counter_airline_search+`">
                                            <select id="cabin_class_flight`+counter_airline_search+`" name="cabin_class_flight`+counter_airline_search+`" data-live-search="true" size="4">`;
                                }
                                else if(template == 5 || template == 6){
                                    text += `
                                    <div>
                                        <div>
                                            <select class="form-control" id="cabin_class_flight`+counter_airline_search+`" name="cabin_class_flight`+counter_airline_search+`">`;
                                }else if(template == 7){
                                    text+=`
                                    <div class="select-form mb-30">
                                        <div class="select-itms">
                                            <select id="cabin_class_flight`+counter_airline_search+`" name="cabin_class_flight`+counter_airline_search+`">`;
                                }


                                for(i in cabin_class){
                                    try{
                                        if(type == 'search'){
                                            if(airline_request.cabin_class_list[counter_airline_search-1] == cabin_class[i].value || airline_request.cabin_class_list.length < counter_airline_search && i == 0)
                                                text +=`<option value="`+cabin_class[i].value+`" selected>`+cabin_class[i].name+`</option>`;
                                            else
                                                text +=`<option value="`+cabin_class[i].value+`" >`+cabin_class[i].name+`</option>`;
                                        }else if(i == 0){
                                            if(type == 'home')
                                                text +=`<option value="`+cabin_class[i].value+`" selected>`+cabin_class[i].name+`</option>`;
                                            else
                                                text +=`<option value="`+cabin_class[i].value+`" >`+cabin_class[i].name+`</option>`;
                                        }else
                                            text +=`<option value="`+cabin_class[i].value+`" >`+cabin_class[i].name+`</option>`;
                                    }catch(err){
                                        if(i == 0)
                                            text +=`<option value="`+cabin_class[i].value+`" selected>`+cabin_class[i].name+`</option>`;
                                        else
                                            text +=`<option value="`+cabin_class[i].value+`" >`+cabin_class[i].name+`</option>`;
                                    }
                                }
                                text +=`</select>
                                    <br/><span style="float:left;color:`+text_color+`">If supported by airlines</span>
                                    </div>
                                </div>
                            </div>
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
        node.className = 'row';
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

            picker_multi_city[counter_airline_search] = new Lightpick({
                field: document.getElementById('airline_departure'+counter_airline_search),
                singleDate: true,
                startDate: airline_request.departure[counter_airline_search-1] ? airline_request.departure[counter_airline_search-1] : min_date,
                minDate: min_date,
                maxDate: moment().subtract(-1, 'years'),
                idNumber: counter_airline_search,
                onSelect: function(date){
                    onchange_mc_date(this._opts.idNumber);
                    setTimeout(function(){
                        $("#origin_id_flight"+parseInt(this._opts.idNumber+1)).focus();
                    }, 200);
                }
            });

            //            $('input[name="airline_departure'+counter_airline_search+'"]').daterangepicker({
            //              singleDatePicker: true,
            //              autoUpdateInput: true,
            //              opens: 'center',
            //              startDate: airline_request.departure[counter_airline_search-1],
            //              minDate: min_date,
            //              maxDate: moment().subtract(-365, 'days'),
            //              showDropdowns: true,
            //              locale: {
            //                  format: 'DD MMM YYYY',
            //              }
            //            });
            //
            //            $('input[name="airline_departure'+counter_airline_search+'"]').on('apply.daterangepicker', function(ev, picker) {
            //                setTimeout(function(){
            //                    $("#origin_id_flight"+counter_airline_search).focus();
            //                }, 200);
            //            });

            $('#cabin_class_flight'+counter_airline_search).niceSelect();

            $('#cabin_class_flight'+counter_airline_search).on('change', function() {
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

            picker_multi_city[counter_airline_search] = new Lightpick({
                field: document.getElementById('airline_departure'+counter_airline_search),
                singleDate: true,
                startDate: pick_date,
                minDate: min_date,
                maxDate: moment().subtract(-1, 'years'),
                idNumber: counter_airline_search,
                onSelect: function(){
                    onchange_mc_date(this._opts.idNumber);
                    setTimeout(function(){
                        $("#origin_id_flight"+parseInt(this._opts.idNumber+1)).focus();
                    }, 200);
                }
            });

            //            $('input[name="airline_departure'+counter_airline_search+'"]').daterangepicker({
            //              singleDatePicker: true,
            //              autoUpdateInput: true,
            //              opens: 'center',
            //              startDate: pick_date,
            //              minDate: min_date,
            //              maxDate: moment().subtract(-365, 'days'),
            //              showDropdowns: true,
            //              locale: {
            //                  format: 'DD MMM YYYY',
            //              }
            //            });
            //            $('input[name="airline_departure'+counter_airline_search+'"]').on('apply.daterangepicker', function(ev, picker) {
            //                var this_temp_date = ev.currentTarget.id;
            //                setTimeout(function(){
            //                    $("#origin_id_flight"+parseInt(parseInt(this_temp_date.substr(this_temp_date.length-1,1))+1).toString()).focus();
            //                }, 200);
            //
            //                for(i=0;i<=counter_airline_search;i++){
            //                    $('input[name="airline_departure'+i+'"]').on('apply.daterangepicker', function(ev, picker) {
            //                        var this_temp_date = ev.currentTarget.id;
            //                        setTimeout(function(){
            //                            $("#origin_id_flight"+parseInt(parseInt(this_temp_date.substr(this_temp_date.length-1,1))+1).toString()).focus();
            //                        }, 200);
            //                    });
            //                }
            //            });
            $('#cabin_class_flight'+counter_airline_search).niceSelect();

            $('#cabin_class_flight'+counter_airline_search).on('change', function() {
                setTimeout(function(){
                    $("#origin_id_flight"+counter_airline_search).focus();
                }, 200);
            });
        }

//        $('input[name="airline_departure'+counter_airline_search+'"]').change(function() {
//            val = parseInt(this.id.replace ( /[^\d.]/g, '' ));
//            for(i=val;i<=counter_airline_search;i++){
//                if(i != val){
//                    min_date = '';
//                    try{
//                        if($("#airline_departure"+(i-1).toString()).val() != undefined){
//                            min_date = $("#airline_departure"+(i-1).toString()).val();
//                            pick_date = $("#airline_departure"+(i).toString()).val();
//                        }else{
//                            min_date = $("#airline_departure").val()
//                            pick_date = $("#airline_departure"+(i).toString()).val();
//                        }
//                        if(moment(pick_date) < moment(min_date))
//                            pick_date = min_date;
//                    }
//                    catch(err){
//                        min_date = $("#airline_departure").val()
//                        pick_date = $("#airline_departure").val()
//                    }
//
//
//                    $('input[name="airline_departure'+i+'"]').daterangepicker({
//                      singleDatePicker: true,
//                      autoUpdateInput: true,
//                      opens: 'center',
//                      startDate: pick_date,
//                      minDate: min_date,
//                      maxDate: moment().subtract(-365, 'days'),
//                      showDropdowns: true,
//                      locale: {
//                          format: 'DD MMM YYYY',
//                      }
//                    });
//                }
//            }
//        });

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
          html: '4 Flight maximum in 1 search!',
       })
    }
}

function plus_min_passenger_airline_btn(){
    var max_pax = 9;
    var min_pax = 1;
    if(airline_advance_pax_type == 'true')
        min_pax = 0;
    var quantity_total_pax = parseInt(document.getElementById('adult_flight').value)+parseInt(document.getElementById('child_flight').value);
    var quantity_adult_flight = parseInt(document.getElementById('adult_flight').value);
    var quantity_child_flight = parseInt(document.getElementById('child_flight').value);
    var quantity_infant_flight = parseInt(document.getElementById('infant_flight').value);
    if(airline_advance_pax_type == 'true' && airline_pax_type_student == 'true')
        var quantity_student_flight = parseInt(document.getElementById('student_flight').value);
    if(airline_advance_pax_type == 'true' && airline_pax_type_labour == 'true')
        var quantity_labour_flight = parseInt(document.getElementById('labour_flight').value);
    if(airline_advance_pax_type == 'true' && airline_pax_type_seaman == 'true')
        var quantity_seaman_flight = parseInt(document.getElementById('seaman_flight').value);

    if(typeof(quantity_student_flight) !== 'undefined')
        quantity_total_pax += parseInt(document.getElementById('student_flight').value);
    if(typeof(quantity_labour_flight) !== 'undefined')
        quantity_total_pax += parseInt(document.getElementById('labour_flight').value);
    if(typeof(quantity_seaman_flight) !== 'undefined')
        quantity_total_pax += parseInt(document.getElementById('seaman_flight').value);
    // tombol add
    if(quantity_total_pax == max_pax){
        document.getElementById("right-plus-adult-flight").disabled = true;
        if(document.getElementById("right-plus-adult-flight1"))
            document.getElementById("right-plus-adult-flight1").disabled = true;
        document.getElementById("right-plus-child-flight").disabled = true;
        if(document.getElementById("right-plus-child-flight"))
            if(document.getElementById("right-plus-child-flight1"))
            document.getElementById("right-plus-child-flight1").disabled = true;
        if(typeof(quantity_student_flight) !== 'undefined'){
            document.getElementById("right-plus-student-flight").disabled = true;
            if(document.getElementById("right-plus-student-flight1"))
                document.getElementById("right-plus-student-flight1").disabled = true;
        }
        if(typeof(quantity_labour_flight) !== 'undefined'){
            document.getElementById("right-plus-labour-flight").disabled = true;
            if(document.getElementById("right-plus-labour-flight1"))
                document.getElementById("right-plus-labour-flight1").disabled = true;
        }if(typeof(quantity_seaman_flight) !== 'undefined'){
            document.getElementById("right-plus-seaman-flight").disabled = true;
            if(document.getElementById("right-plus-seaman-flight"))
                document.getElementById("right-plus-seaman-flight1").disabled = true;
        }
    }else{
        document.getElementById("right-plus-adult-flight").disabled = false;
        if(document.getElementById("right-plus-adult-flight1"))
            document.getElementById("right-plus-adult-flight1").disabled = false;
        document.getElementById("right-plus-child-flight").disabled = false;
        if(document.getElementById("right-plus-child-flight1"))
            document.getElementById("right-plus-child-flight").disabled = false;
        if(typeof(quantity_student_flight) !== 'undefined'){
            document.getElementById("right-plus-student-flight").disabled = false;
            if(document.getElementById("right-plus-student-flight1"))
                document.getElementById("right-plus-student-flight1").disabled = false;
        }if(typeof(quantity_labour_flight) !== 'undefined'){
            document.getElementById("right-plus-labour-flight").disabled = false;
            if(document.getElementById("right-plus-labour-flight1"))
                document.getElementById("right-plus-labour-flight1").disabled = false;
        }if(typeof(quantity_seaman_flight) !== 'undefined'){
            document.getElementById("right-plus-seaman-flight").disabled = false;
            if(document.getElementById("right-plus-seaman-flight1"))
                document.getElementById("right-plus-seaman-flight1").disabled = false;
        }
    }
    // tombol add infant
    if(quantity_adult_flight == quantity_infant_flight){
        document.getElementById("right-plus-infant-flight").disabled = true;
        if(document.getElementById("right-plus-infant-flight1"))
            document.getElementById("right-plus-infant-flight1").disabled = true;
    }else{
        document.getElementById("right-plus-infant-flight").disabled = false;
        if(document.getElementById("right-plus-infant-flight1"))
            document.getElementById("right-plus-infant-flight1").disabled = false;
    }

    // tombol min
    if(quantity_adult_flight == min_pax){
        document.getElementById("left-minus-adult-flight").disabled = true;
        if(document.getElementById("left-minus-adult-flight1"))
            document.getElementById("left-minus-adult-flight1").disabled = true;
    }else{
        document.getElementById("left-minus-adult-flight").disabled = false;
        if(document.getElementById("left-minus-adult-flight1"))
            document.getElementById("left-minus-adult-flight1").disabled = false;
    }

    if(quantity_child_flight == 0){
        document.getElementById("left-minus-child-flight").disabled = true;
        if(document.getElementById("left-minus-child-flight1"))
            document.getElementById("left-minus-child-flight1").disabled = true;
    }else{
        document.getElementById("left-minus-child-flight").disabled = false;
        if(document.getElementById("left-minus-child-flight1"))
            document.getElementById("left-minus-child-flight1").disabled = false;
    }

    if(quantity_infant_flight == 0){
        document.getElementById("left-minus-infant-flight").disabled = true;
        if(document.getElementById("left-minus-infant-flight1"))
            document.getElementById("left-minus-infant-flight1").disabled = true;
    }else{
        document.getElementById("left-minus-infant-flight").disabled = false;
        if(document.getElementById("left-minus-infant-flight1"))
            document.getElementById("left-minus-infant-flight1").disabled = false;
    }

    if(typeof(quantity_student_flight) !== 'undefined' && quantity_student_flight == min_pax){
        document.getElementById("left-minus-student-flight").disabled = true;
        if(document.getElementById("left-minus-student-flight1"))
            document.getElementById("left-minus-student-flight1").disabled = true;
    }else if(typeof(quantity_student_flight) !== 'undefined' && quantity_student_flight != min_pax){
        document.getElementById("left-minus-student-flight").disabled = false;
        if(document.getElementById("left-minus-student-flight1"))
            document.getElementById("left-minus-student-flight1").disabled = false;
    }
    if(typeof(quantity_labour_flight) !== 'undefined' && quantity_labour_flight == min_pax){
        document.getElementById("left-minus-labour-flight").disabled = true;
        if(document.getElementById("left-minus-labour-flight1"))
            document.getElementById("left-minus-labour-flight1").disabled = true;
    }else if(typeof(quantity_labour_flight) !== 'undefined' && quantity_labour_flight != min_pax){
        document.getElementById("left-minus-labour-flight").disabled = false;
        if(document.getElementById("left-minus-labour-flight1"))
            document.getElementById("left-minus-labour-flight1").disabled = false;
    }
    if(typeof(quantity_seaman_flight) !== 'undefined' && quantity_seaman_flight == min_pax){
        document.getElementById("left-minus-seaman-flight").disabled = true;
        if(document.getElementById("left-minus-seaman-flight1"))
            document.getElementById("left-minus-seaman-flight1").disabled = true;
    }else if(typeof(quantity_seaman_flight) !== 'undefined' && quantity_seaman_flight != min_pax){
        document.getElementById("left-minus-seaman-flight").disabled = false;
        if(document.getElementById("left-minus-seaman-flight1"))
            document.getElementById("left-minus-seaman-flight1").disabled = false;
    }

    var show_total_pax = quantity_adult_flight + " Adult, " + quantity_child_flight + " Child, " +quantity_infant_flight + " Infant";
    if(typeof(quantity_student_flight) !== 'undefined' && quantity_student_flight > 0)
        show_total_pax += ", " + quantity_student_flight + " Student"
    if(typeof(quantity_labour_flight) !== 'undefined' && quantity_labour_flight > 0)
        show_total_pax += ", " + quantity_labour_flight + " Labour"
    if(typeof(quantity_seaman_flight) !== 'undefined' && quantity_seaman_flight > 0)
        show_total_pax += ", " + quantity_seaman_flight + " Seaman"
    $('#show_total_pax_flight').text(show_total_pax);
    $('#show_total_pax_flight1').text(show_total_pax);
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
    document.getElementById("sorting-flight").innerHTML = '';
    document.getElementById("sorting-flight2").innerHTML = '';
    document.getElementById("filter").innerHTML = '';
    document.getElementById("filter2").innerHTML = '';

    var node = document.createElement("div");
    text = '';
    text+= `<h4 style="display: inline;">Filter</h4><a style="float: right; cursor: pointer;" onclick="reset_filter();"><i style="color:`+color+`;" class="fa fa-refresh"></i> Reset</a>
    <hr/>
    <h6 class="filter_general" onclick="show_hide_general('airlineAirline');" id="filter_airline_span" style="display:none;"></h6>
    <div id="airlineAirline_generalShow_loading">
        <div class="place_div_left_right">
            <span style="font-weight:bold; font-size:14px;">
                <div class="stripe_div_small70">
                    <div class="div_stripe">
                        <div class="loading_stripe"></div>
                    </div>
                </div>
            </span>
            <label style="position:absolute; right:0px;">
                <div class="stripe_checkbox">
                    <div class="div_stripe">
                        <div class="loading_stripe"></div>
                    </div>
                </div>
            </label>
        </div>
        <div class="place_div_grid">
            <label>
                <div class="stripe_div_medium160">
                    <div class="div_stripe">
                        <div class="loading_stripe"></div>
                    </div>
                </div>
            </label>
            <label>
                <div class="stripe_div_medium130">
                    <div class="div_stripe">
                        <div class="loading_stripe"></div>
                    </div>
                </div>
            </label>
            <label>
                <div class="stripe_div_medium160">
                    <div class="div_stripe">
                        <div class="loading_stripe"></div>
                    </div>
                </div>
            </label>
            <label>
                <div class="stripe_div_small100">
                    <div class="div_stripe">
                        <div class="loading_stripe"></div>
                    </div>
                </div>
            </label>
        </div>
    </div>
    <div id="airlineAirline_generalShow">

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
            <span id="img-sort-down-`+sorting_list2[i].value.toLowerCase()+`" style="display:block;"> `+sorting_list2[i].value+` <i class="fas fa-chevron-down"></i></span>
            <span id="img-sort-up-`+sorting_list2[i].value.toLowerCase()+`" style="display:none;"> `+sorting_list2[i].value+` <i class="fas fa-chevron-up"></i></span>
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
    text+= `
    <h6 id="filter_airline_span2"></h6>
    <div id="airlineAirline_generalShow_loading2">
        <div class="place_div_left_right">
            <span style="font-weight:bold; font-size:14px;">
                <div class="stripe_div_small70">
                    <div class="div_stripe">
                        <div class="loading_stripe"></div>
                    </div>
                </div>
            </span>
        </div>
        <div class="place_div_grid">
            <label>
                <div class="stripe_div_medium160">
                    <div class="div_stripe">
                        <div class="loading_stripe"></div>
                    </div>
                </div>
            </label>
            <label>
                <div class="stripe_div_medium130">
                    <div class="div_stripe">
                        <div class="loading_stripe"></div>
                    </div>
                </div>
            </label>
            <label>
                <div class="stripe_div_medium160">
                    <div class="div_stripe">
                        <div class="loading_stripe"></div>
                    </div>
                </div>
            </label>
            <label>
                <div class="stripe_div_small100">
                    <div class="div_stripe">
                        <div class="loading_stripe"></div>
                    </div>
                </div>
            </label>
        </div>
    </div>
    <div id="airline_list2">

    </div>
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

    quantity_adult_flight = parseInt(document.getElementById('adult_flight').value);
    quantity_child_flight = parseInt(document.getElementById('child_flight').value);
    quantity_infant_flight = parseInt(document.getElementById('infant_flight').value);
    quantity_total_pax = parseInt(document.getElementById('adult_flight').value) + parseInt(document.getElementById('child_flight').value);
    if(document.getElementById('student_flight'))
        quantity_total_pax += parseInt(document.getElementById('student_flight').value);
    if(document.getElementById('labour_flight'))
        quantity_total_pax += parseInt(document.getElementById('labour_flight').value);
    if(document.getElementById('seaman_flight'))
        quantity_total_pax += parseInt(document.getElementById('seaman_flight').value);
    if(type == 'adult'){
        var quantity = parseInt($('#adult_flight'+val).val());
        if(quantity_total_pax < 9){
            $('#adult_flight').val(quantity + 1);
            $('#adult_flight1').val(quantity + 1);
        }
    }else if(type == 'child'){
        var quantity = parseInt($('#child_flight').val());
        if(quantity_total_pax < 9){
            $('#child_flight').val(quantity + 1);
            $('#child_flight1').val(quantity + 1);
        }
    }else if(type == 'infant'){
        var quantity = parseInt($('#infant_flight').val());
        if (quantity < quantity_adult_flight){
            $('#infant_flight').val(quantity + 1);
            $('#infant_flight1').val(quantity + 1);
        }
    }else if(type == 'student'){
        var quantity = parseInt($('#student_flight').val());
        if(quantity_total_pax < 9){
            $('#student_flight').val(quantity + 1);
            $('#student_flight1').val(quantity + 1);
        }
    }else if(type == 'labour'){
        var quantity = parseInt($('#labour_flight').val());
        if(quantity_total_pax < 9){
            $('#labour_flight').val(quantity + 1);
            $('#labour_flight1').val(quantity + 1);
        }
    }else if(type == 'seaman'){
        var quantity = parseInt($('#seaman_flight').val());
        if(quantity_total_pax < 9){
            $('#seaman_flight').val(quantity + 1);
            $('#seaman_flight1').val(quantity + 1);
            quantity_child_flight = quantity + 1;
        }
    }
    plus_min_passenger_airline_btn();
}

function airline_set_passenger_minus(type, val){
    quantity_adult_flight = parseInt(document.getElementById('adult_flight').value);
    quantity_child_flight = parseInt(document.getElementById('child_flight').value);
    quantity_infant_flight = parseInt(document.getElementById('infant_flight').value);
    var minimum_quantity = 1;
    if(airline_advance_pax_type == 'true')
        minimum_quantity = 0;
    if(type == 'adult'){
        var quantity = parseInt($('#adult_flight').val());
        if(quantity > minimum_quantity){
            $('#adult_flight').val(quantity - 1);
            $('#adult_flight1').val(quantity - 1);
            quantity_adult_flight = quantity - 1;

            if(quantity_adult_flight < quantity_infant_flight){
               quantity_infant_flight = quantity_adult_flight;
               $('#infant_flight').val(quantity - 1);
               $('#infant_flight1').val(quantity - 1);
            }
        }
    }else if(type == 'child'){
        var quantity = parseInt($('#child_flight').val());
        if(quantity > 0){
            $('#child_flight').val(quantity - 1);
            $('#child_flight1').val(quantity - 1);
            quantity_child_flight = quantity - 1;
        }
    }else if(type == 'infant'){
        var quantity = parseInt($('#infant_flight').val());

        if(quantity > 0){
            $('#infant_flight').val(quantity - 1);
            $('#infant_flight1').val(quantity - 1);
            quantity_infant_flight = quantity - 1;
        }
    }else if(type == 'student'){
        var quantity = parseInt($('#student_flight').val());
        if(quantity > 0){
            $('#student_flight').val(quantity - 1);
            $('#student_flight1').val(quantity - 1);
            quantity_student_flight = quantity - 1;
        }
    }else if(type == 'labour'){
        var quantity = parseInt($('#labour_flight').val());
        if(quantity > 0){
            $('#labour_flight').val(quantity - 1);
            $('#labour_flight1').val(quantity - 1);
            quantity_labour_flight = quantity - 1;
        }
    }else if(type == 'seaman'){
        var quantity = parseInt($('#seaman_flight').val());
        if(quantity > 0){
            $('#seaman_flight').val(quantity - 1);
            $('#seaman_flight1').val(quantity - 1);
            quantity_seaman_flight = quantity - 1;
        }
    }
    plus_min_passenger_airline_btn();
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
//        arrival_list
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
    data.forEach((airline_data_rec)=> {
        check = 0;
        departure_list.forEach((filter_rec)=> {
            if(filter_rec.status == true && filter_rec.value == 'All' && check == 0){
                check = 1;
            }else if(filter_rec.status == true && check == 0){
                time = filter_rec.value.split(' - ');
                for(i in time)
                    time[i] = time[i].split('.')[0]*3600 + time[i].split('.')[1]*60;
                data_time = airline_data_rec.departure_date.split(', ')[1].split(' - ');
                data_time = data_time[1].split(':')[0]*3600 + data_time[1].split(':')[1]*60;
                if(time[0]<=data_time && time[1]>=data_time){
                    check = 1;
                }
            }
        });
        if(check == 1){
            arrival_list.forEach((filter_rec)=> {
                if(filter_rec.status == true && filter_rec.value == 'All' && check == 1){
                    temp_data.push(airline_data_rec);
                    check = 2;
                }else if(filter_rec.status == true && check == 1){
                    time = filter_rec.value.split(' - ');
                    for(i in time)
                        time[i] = time[i].split('.')[0]*3600 + time[i].split('.')[1]*60;
                    data_time = airline_data_rec.arrival_date.split(', ')[1].split(' - ');
                    data_time = data_time[1].split(':')[0]*3600 + data_time[1].split(':')[1]*60;
                    if(time[0]<=data_time && time[1]>=data_time){
                        temp_data.push(airline_data_rec);
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
                   transit_duration = segments.transit_duration.split(':');
                   if(transit_duration.length == 4){ //check transit duration kalau segment pertama hanya ""
                       transit_time += parseInt(transit_duration[0]) * 86400;
                       transit_time += parseInt(transit_duration[1]) * 3600;
                       transit_time += parseInt(transit_duration[2]) * 60;
                       transit_time += parseInt(transit_duration[3]);
                   }
               });
               console.log(transit_time);
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
   }else if(value == 'duration'){
       if(sorting_value == '' || sorting_value == 'Shortest Duration'){
           sorting_value = 'Highest Duration';
           document.getElementById("img-sort-down-duration").style.display = "none";
           document.getElementById("img-sort-up-duration").style.display = "block";
       }else{
           sorting_value = 'Shortest Duration';
           document.getElementById("img-sort-down-duration").style.display = "block";
           document.getElementById("img-sort-up-duration").style.display = "none";
       }
   }else if(value == 'transit duration'){
       if(sorting_value == '' || sorting_value == 'Shortest Transit Duration'){
           sorting_value = 'Highest Transit Duration';
           document.getElementById("img-sort-down-transit duration").style.display = "none";
           document.getElementById("img-sort-up-transit duration").style.display = "block";
       }else{
           sorting_value = 'Shortest Transit Duration';
           document.getElementById("img-sort-down-transit duration").style.display = "block";
           document.getElementById("img-sort-up-transit duration").style.display = "none";
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
            <img src="/static/tt_website/images/no_found/no-airlines.png" style="width:70px; height:70px;" alt="Not Found Airlines" title="" />
            <br/>
        </div>
        <center><div class="alert alert-warning" role="alert" style="margin-top:15px; border:1px solid #cdcdcd;"><h6><i class="fas fa-search-minus"></i> Oops! Sorry no ticket for flight `+ parseInt(counter_search).toString()+` Please try another flight. </h6></div></center>`;
        var node = document.createElement("div");
        node.innerHTML = text;
        document.getElementById("airlines_ticket").appendChild(node);
        node = document.createElement("div");

        try{
            document.getElementById('airlines_result_ticket').innerHTML = '';
            document.getElementById("airlines_ticket_loading").innerHTML = '';
            document.getElementById("airlineAirline_generalShow_loading").innerHTML = '<h6>Flights not Found</h6>';
            document.getElementById("airlineAirline_generalShow_loading2").innerHTML = '<h6>Flights not Found</h6>';
        }catch(err){console.log(err)}
    }else{
        //show data
        sorting = '';

        try{
            document.getElementById("airlineAirline_generalShow_loading").innerHTML = '';
            document.getElementById("airlineAirline_generalShow_loading2").innerHTML = '';
        }catch(err){console.log(err)}

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
                    if(airline[i].departure_date.split(', ')[1].split(' - ')[1] > airline[j].departure_date.split(', ')[1].split(' - ')[1]){
                        var temp = airline[i];
                        airline[i] = airline[j];
                        airline[j] = temp;
                    }
                }else if(sorting == 'Latest Departure'){
                    if(airline[i].departure_date.split(', ')[1].split(' - ')[1] < airline[j].departure_date.split(', ')[1].split(' - ')[1]){
                        var temp = airline[i];
                        airline[i] = airline[j];
                        airline[j] = temp;
                    }
                }else if(sorting == 'Earliest Arrival'){
                    if(airline[i].arrival_date.split(', ')[1].split(' - ')[1] > airline[j].arrival_date.split(', ')[1].split(' - ')[1]){
                        var temp = airline[i];
                        airline[i] = airline[j];
                        airline[j] = temp;
                    }
                }else if(sorting == 'Latest Arrival'){
                    if(airline[i].arrival_date.split(', ')[1].split(' - ')[1] < airline[j].arrival_date.split(', ')[1].split(' - ')[1]){
                        var temp = airline[i];
                        airline[i] = airline[j];
                        airline[j] = temp;
                    }
                }else if(sorting == 'Shortest Duration'){
                    // first index i, second index j
                    airline_first_elapsed_time = airline[i].elapsed_time.split(':');
                    airline_first_elapsed_time = (parseInt(airline_first_elapsed_time[0]) * 86400) + (parseInt(airline_first_elapsed_time[1]) * 3600) + (parseInt(airline_first_elapsed_time[2]) * 60) + (parseInt(airline_first_elapsed_time[3]));
                    airline_second_elapsed_time = airline[j].elapsed_time.split(':');
                    airline_second_elapsed_time = (parseInt(airline_second_elapsed_time[0]) * 86400) + (parseInt(airline_second_elapsed_time[1]) * 3600) + (parseInt(airline_second_elapsed_time[2]) * 60) + (parseInt(airline_second_elapsed_time[3]));
                    if(airline_first_elapsed_time > airline_second_elapsed_time){
                        var temp = airline[i];
                        airline[i] = airline[j];
                        airline[j] = temp;
                    }
                }else if(sorting == 'Highest Duration'){
                    airline_first_elapsed_time = airline[i].elapsed_time.split(':');
                    airline_first_elapsed_time = (parseInt(airline_first_elapsed_time[0]) * 86400) + (parseInt(airline_first_elapsed_time[1]) * 3600) + (parseInt(airline_first_elapsed_time[2]) * 60) + parseInt(airline_first_elapsed_time[3]);
                    airline_second_elapsed_time = airline[j].elapsed_time.split(':');
                    airline_second_elapsed_time = (parseInt(airline_second_elapsed_time[0]) * 86400) + (parseInt(airline_second_elapsed_time[1]) * 3600) + (parseInt(airline_second_elapsed_time[2]) * 60) + parseInt(airline_second_elapsed_time[3]);
                    if(airline_first_elapsed_time < airline_second_elapsed_time){
                        var temp = airline[i];
                        airline[i] = airline[j];
                        airline[j] = temp;
                    }
                }else if(sorting == 'Shortest Transit Duration'){
                    if(airline[i].transit_duration_in_sec > airline[j].transit_duration_in_sec){
                        var temp = airline[i];
                        airline[i] = airline[j];
                        airline[j] = temp;
                    }
                }else if(sorting == 'Highest Transit Duration'){
                    if(airline[i].transit_duration_in_sec < airline[j].transit_duration_in_sec){
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
            text += `
            <div style="background-color:`+color+`; padding:10px;">
                <h6 style="color:`+text_color+`;">Choose Flight `+counter_search+`</h6>
            </div>`;
        get_airline_recommendations_list();
        total_price_pick = 0;
        for(i in airline_pick_list){
            for(j in airline_pick_list[i].segments){
                for(k in airline_pick_list[i].segments[j].fares){
                    if(parseInt(k) == airline_pick_list[i].segments[j].fare_pick){
                        for(l in airline_pick_list[i].segments[j].fares[k].service_charge_summary)
                            if(!['CHD', 'INF'].includes(airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].pax_type)){
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
               if(airline[i].origin == airline_request.origin[counter_search-1].split(' - ')[0] && airline[i].destination == airline_request.destination[counter_search-1].split(' - ')[0] && airline_request.departure[counter_search-1] == airline[i].departure_date.split(', ')[1].split(' - ')[0]){
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
                                           var selected_banner_date = moment(airline[i].departure_date.split(', ')[1].split(' - ')[0]).format('YYYY-MM-DD');

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
                                   //udah lama ga d pake
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
                                                            <span class="carrier_code_template">`+airline[i].segments[j].carrier_name+`</span><br/>
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
                                                                        <img src="/static/tt_website/images/icon/symbol/airlines-01.png" style="width:20px; height:20px; margin-top:5px;"/>
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
                                        //hasil search
                                        flight_operated_temp = '';
                                        flight_carrier_temp = '';
                                        flight_carrier_name_temp = '';
                                        for(j in airline[i].segments){
                                            if(airline[i].segments[j].carrier_code != airline[i].segments[j].operating_airline_code && airline[i].segments[j].operating_airline_code != ''){
                                                if(flight_carrier_temp != '')
                                                    flight_carrier_temp += ', ';
                                                if(flight_operated_temp != '')
                                                    flight_operated_temp += ', ';

                                                try{
                                                    flight_operated_temp += airline_carriers[0][airline[i].segments[j].operating_airline_code].name;
                                                }catch(err){
                                                    flight_operated_temp += airline[i].segments[j].operating_airline_code;
                                                }
                                                try{
                                                    flight_carrier_temp += airline_carriers[0][airline[i].segments[j].carrier_code].name;
                                                }catch(err){
                                                    flight_carrier_temp += airline[i].segments[j].carrier_code;
                                                }
                                            }
                                            else if(airline[i].carrier_code_list.length == 1){
                                                if(j == 0){
                                                    if(flight_carrier_temp != '')
                                                        flight_carrier_temp += ', ';
                                                    try{
                                                        flight_carrier_temp += airline_carriers[0][airline[i].segments[j].carrier_code].name;
                                                    }catch(err){
                                                        flight_carrier_temp += airline[i].segments[j].carrier_code;
                                                    }
                                                }
                                            }
                                            else{
                                                if(flight_carrier_temp != '')
                                                        flight_carrier_temp += ', ';
                                                try{
                                                    flight_carrier_temp += airline_carriers[0][airline[i].segments[j].carrier_code].name;
                                                }catch(err){
                                                    flight_carrier_temp += airline[i].segments[j].carrier_code;
                                                }
                                            }

                                            try{
                                                flight_carrier_name_temp += airline[i].segments[j].carrier_name;
                                                if(j != (airline[i].segments.length-1)){
                                                    flight_carrier_name_temp += ', ';
                                                }
                                            }catch(err){}
                                        }

                                        flight_check_print = 0; //print 1x
                                        text+=`
                                        <div class="col-lg-9" id="copy_div_airline`+i+`">
                                            <span class="copy_airline" hidden>`+i+`</span>
                                            <div class="row mt-2">
                                                <div class="col-lg-4 col-md-4">`;
                                                    for(j in airline[i].segments){
                                                        //ganti sini
                                                        flight_number = parseInt(j) + 1;
                                                        if(flight_check_print == 0){
                                                            text+=`<div class="row">`;
                                                        }else{
                                                            text+=`<div class="row" style="display:none;">`;
                                                        }
                                                        text+=`
                                                            <div class="col-lg-12 mb-2" id="copy_provider_operated`+i+``+j+`">
                                                                <span class="copy_po" hidden>`+j+`</span>`;
                                                                if(flight_operated_temp != ''){
                                                                    text+=`
                                                                    <div style="font-size:12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100%;">
                                                                        <span><b>Operated:</b> `+flight_operated_temp+`</span>
                                                                    </div>`;
                                                                }
                                                                text+=`
                                                                <div style="display:inline-flex;">`;
                                                                    if(flight_check_print == 0){
                                                                        text+=`
                                                                        <div style="display:inline-block;">`;
                                                                            if(airline[i].segments[j].carrier_code != airline[i].segments[j].operating_airline_code && airline[i].segments[j].operating_airline_code != ''){
                                                                                try{
                                                                                    text+=`<img data-toggle="tooltip" class="airlines_provider_img" alt="`+airline_carriers[0][airline[i].segments[j].carrier_code].name+`" title="`+airline_carriers[0][airline[i].segments[j].carrier_code].name+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+airline[i].segments[j].carrier_code+`.png">`;
                                                                                }catch(err){
                                                                                    text+=`<img data-toggle="tooltip" class="airlines_provider_img" alt="`+airline[i].segments[j].carrier_code+`" title="`+airline[i].segments[j].carrier_code+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+airline[i].segments[j].carrier_code+`.png">`;
                                                                                }
                                                                            }
                                                                            else if(airline[i].carrier_code_list.length > 1){
                                                                                text+=`
                                                                                <img data-toggle="tooltip" class="airlines_provider_img" alt="`+airline_carriers[0][airline[i].segments[j].carrier_code].name+`" title="`+airline_carriers[0][airline[i].segments[j].carrier_code].name+`" class="airline-logo" src="/static/tt_website/images/icon/product/c-multi-airline.png">`;

//                                                                                    text+=`
//                                                                                    <div style="background: white; width: fit-content; padding: 0px 5px; font-size: 12px; position: absolute; bottom: -5px; left: 40px; border: 1px solid #cdcdcd; border-radius: 6px;">
//                                                                                        <i class="fas fa-plane"></i> `+parseInt(airline[i].segments.length)+`
//                                                                                    </div>`;
                                                                            }else{
                                                                                try{
                                                                                    text+=`<img data-toggle="tooltip" class="airlines_provider_img" alt="`+airline_carriers[0][airline[i].segments[j].carrier_code].name+`" title="`+airline_carriers[0][airline[i].segments[j].carrier_code].name+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+airline[i].segments[j].carrier_code+`.png">`;
                                                                                }catch(err){
                                                                                    text+=`<img data-toggle="tooltip" class="airlines_provider_img" alt="`+airline[i].segments[j].carrier_code+`" title="`+airline[i].segments[j].carrier_code+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+airline[i].segments[j].carrier_code+`.png">`;
                                                                                }
                                                                            }

                                                                        text+=`
                                                                        </div>`;

                                                                        text+=`
                                                                        <div style="display:inline-block;">`;
                                                                            if(flight_carrier_temp != ''){
                                                                                text+=`<div style="display:grid;"><span style="font-size:12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100%;">`+flight_carrier_temp+`</span></div>`;
                                                                            }

                                                                            if(flight_carrier_name_temp != ''){
                                                                                text+=`<div style="display:grid;"><span style="font-size:12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100%;">`+flight_carrier_name_temp+`</span></div>`;
                                                                            }
                                                                            text+=`

                                                                            <span style="color:`+color+`; cursor:pointer; font-weight:bold;" id="airlines_info_temp`+i+`">Detail <i class="fas fa-info-circle"></i></span>
                                                                        </div>`;

                                                                        flight_check_print = 1;
                                                                    }
                                                                    text+=`
                                                                </div>
                                                                <div style="font-weight:bold; display:none;">`;
                                                                    if(airline[i].segments[j].carrier_code != airline[i].segments[j].operating_airline_code && airline[i].segments[j].operating_airline_code != ''){
                                                                        try{
                                                                            text += `<span class="copy_operated_by" style="float:left; font-weight: 700; font-size:12px;">Operated by `+airline_carriers[0][airline[i].segments[j].operating_airline_code].name+`</span>`;
                                                                        }catch(err){
                                                                            text += `<span class="copy_operated_by" style="float:left; font-weight: 700; font-size:12px;">Operated by `+airline[i].segments[j].operating_airline_code+`</span>`;
                                                                        }
                                                                        try{
                                                                            text+=`<span class="copy_carrier_provider" style="font-size:12px;">`+airline_carriers[0][airline[i].segments[j].carrier_code].name+`</span>`;
                                                                        }catch(err){
                                                                            text+=`<span class="copy_carrier_provider" style="font-size:12px;">`+airline[i].segments[j].carrier_code+`</span>`;
                                                                        }
                                                                    }else if(carrier_code_airline.includes(airline[i].segments[j].carrier_code) == false){
                                                                        try{
                                                                            text+=`<span class="copy_carrier_provider" style="font-size:12px;">`+airline_carriers[0][airline[i].segments[j].carrier_code].name+`</span>`;
                                                                        }catch(err){
                                                                            text+=`<span class="copy_carrier_provider" style="font-size:12px;">`+airline[i].segments[j].carrier_code+`</span>`;
                                                                        }
                                                                    }

                                                                    try{
                                                                        text+=`<span class="carrier_code_template" style="font-size:12px;">`+airline[i].segments[j].carrier_name+`</span>`;
                                                                    }catch(err){}

                                                                    text+=`
                                                                </div>`;
                                                                if(carrier_code_airline.includes(airline[i].segments[j].carrier_code) == false)
                                                                    carrier_code_airline.push(airline[i].segments[j].carrier_code);
                                                                text+=`
                                                            </div>
                                                        </div>`;
                                                    }
                                                        //for(j in airline[i].carrier_code_list){
                                                        //    text+=`
                                                        //    <span class="copy_carrier_provider" style="font-weight:500; font-size:12px;">`+airline_carriers[0][airline[i].carrier_code_list[j]].name+`</span><br/>
                                                        //    <img data-toggle="tooltip" alt="`+airline_carriers[0][airline[i].carrier_code_list[j]].name+`" style="width:50px; height:50px;" title="`+airline_carriers[0][airline[i].carrier_code_list[j]].name+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+airline[i].carrier_code_list[j]+`.png"><br/>`;
                                                        //}

                                                    text+=`
                                                    <div class="row show_fd">
                                                        <div class="col-lg-12">
                                                           <a id="detail_button_journey_pc0`+i+`" data-toggle="collapse" data-parent="#accordiondepart" onclick="show_flight_details(`+i+`);" href="#detail_departjourney`+i+`" style="color: #237395; text-decoration: unset;" aria-expanded="true">
                                                               <span class="detail-link" style="font-weight: bold; display:none;" id="flight_details_up_pc`+i+`"> Flight details <i class="fas fa-chevron-up" style="font-size:14px;"></i></span>
                                                               <span class="detail-link" style="font-weight: bold; display:block;" id="flight_details_down_pc`+i+`"> Flight details <i class="fas fa-chevron-down" style="font-size:14px;"></i></span>
                                                           </a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-lg-8 col-md-8">
                                                    <div class="row">
                                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                                            <h6 class="copy_time_depart">`+airline[i].departure_date.split(' - ')[1]+`</h6>
                                                            <span class="copy_date_depart">`+airline[i].departure_date.split(' - ')[0]+` </span><br/>
                                                            <span class="copy_departure" style="font-weight:500;">`+airline[i].origin+`</span><br/>
                                                        </div>
                                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                                            <div style="text-align:center; position: absolute; left:-30%;">`;
                                                            if(airline[i].transit_count==0){
                                                                text+=`<span class="copy_transit" style="font-weight:500;">Direct</span>`;
                                                            }
                                                            else{
                                                                text+=`<span class="copy_transit" style="font-weight:500;">Transit: `+airline[i].transit_count+`</span>`;
                                                            }
                                                            text+=`
                                                            <div style="display:inline-block;position:relative;width:100%;z-index:1;">
                                                                <img src="/static/tt_website/images/icon/symbol/airlines-01.png" alt="Airline" style="width:20px; height:20px; margin-top:5px; position:relative; z-index:99;"/>
                                                                <div class="show_pc" style="height:2px;position:absolute;top:16px;width:100%;background-color:#d4d4d4;"></div>
                                                                <div class="show_pc origin-code-snippet" style="background-color:#d4d4d4;right:0px"></div>
                                                            </div>`;
                                                            if(airline[i].elapsed_time.split(':')[0] != '0'){
                                                                text+= airline[i].elapsed_time.split(':')[0] + 'd ';
                                                            }
                                                            if(airline[i].elapsed_time.split(':')[1] != '0'){
                                                                text+= airline[i].elapsed_time.split(':')[1] + 'h ';
                                                            }
                                                            if(airline[i].elapsed_time.split(':')[2] != '0'){
                                                                text+= airline[i].elapsed_time.split(':')[2] + 'm ';
                                                            }
                                                            text+=`
                                                            </div>
                                                            <div style="text-align:right">
                                                                <h6 class="copy_time_arr">`+airline[i].arrival_date.split(' - ')[1]+`</h6>
                                                                <span class="copy_date_arr">`+airline[i].arrival_date.split(' - ')[0]+`</span><br/>
                                                                <span class="copy_arrival" style="font-weight:500;">`+airline[i].destination+`</span><br/>
                                                            </div>
                                                        </div>
                                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="margin-top:10px;">
                                                            <div class="row" id="airline`+i+`fare_details">
                                                                <div class="col-xs-12">`;
                                                                for(j in airline[i].fare_details){
                                                                   if(airline[i].fare_details[j].detail_type.includes('BG')){
                                                                        text+=`<div class="custom_fare_cls"><i class="fas fa-suitcase"></i><span style="font-weight:500;" class="copy_suitcase_details"> `+airline[i].fare_details[j].amount+` `+airline[i].fare_details[j].unit+`</span></div>`;
                                                                   }
                                                                   else if(airline[i].fare_details[j].detail_type == 'ML'){
                                                                        text+=`<div class="custom_fare_cls"><i class="fas fa-utensils"></i><span style="font-weight:500;" class="copy_utensils_details"> `+airline[i].fare_details[j].amount+` `+airline[i].fare_details[j].unit+`</span></div>`;
                                                                   }else{
                                                                        text+=`<div class="custom_fare_cls"><span style="font-weight:500;" class="copy_others_details">`+airline[i].fare_details[j].amount+` `+airline[i].fare_details[j].unit+`</span></div>`;
                                                                   }
                                                                }
                                                                text+=`
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 mt-2">
                                                           <div style="display:block; padding-top:5px; text-align:right;">
                                                               <span style="font-weight:700;">Class </span>`;
                                                               for(fare_seat_co in airline[i].segments){
                                                                   text+=`<div class="custom_seat_cls"><span id="fare_seat_class`+i+``+fare_seat_co+`"></span></div>`;
                //                                                   if(fare_seat_co != airline[i].segments.length-1){
                //                                                       text+=`<br/>`;
                //                                                   }
                                                               }
                                                               text+=`
                                                           </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>`;
                                    }

                                   text+=`
                                   <div class="col-lg-3" style="margin-bottom:5px; text-align:right;">
                                       <div class="row">
                                            <div class="col-lg-12 col-md-6">`;

                                               if(provider_list_data.hasOwnProperty(airline[i].provider) == true && provider_list_data[airline[i].provider].description != '')
                                                    text += `<span style="margin-right:5px;">`+provider_list_data[airline[i].provider].description+`</span><br/>`;

                                               text+=`
                                               <div style="display:block; padding-top:5px;">
                                                   <div id="fare_no_discount`+i+`">

                                                   </div>
                                                   <span id="more_fare`+i+`" style="cursor:pointer;">
                                                       <span id="fare`+i+`" class="basic_fare_field copy_price price_template"`;
                                                       if(is_show_breakdown_price){
                                                            text += ` style="cursor:pointer;"`;
                                                       }
                                                       text+=`>
                                                       </span>
                                                   </span>
                                               </div>`;
                                               if(typeof(currency_rate_data) !== 'undefined' && currency_rate_data.result.is_show){
                                                    if(user_login.hasOwnProperty('co_ho_seq_id') && currency_rate_data.result.response.agent.hasOwnProperty(user_login.co_ho_seq_id)){ // buat o3
                                                        for(k in currency_rate_data.result.response.agent[user_login.co_ho_seq_id]){
                                                            try{
                                                                text+=`<span id="fare`+i+`_other_currency_`+k+`" class="basic_fare_field copy_price price_template"></span>`;
                                                            }catch(err){console.log(err);}
                                                        }
                                                    }
                                               }
                                               if(airline[i].available_count != 0){
                                                   if(airline[i].available_count > 9){
                                                       text += `<img src="/static/tt_website/images/icon/symbol/seat.png" style="height:16px; width:auto;"/><span id='airline_seat_left`+i+`' style="font-size:12px;">`+airline[i].available_count+` seats available</span>`;
                                                   }else{
                                                       text += `<img src="/static/tt_website/images/icon/symbol/seat.png" style="height:16px; width:auto;"/><span id='airline_seat_left`+i+`' style="font-size:12px; color:#fc2617;">`+airline[i].available_count+` seats left </span>`;
                                                   }
                                                   //if(choose_airline != null && choose_airline == airline[i].sequence && airline_request.direction != 'MC')
                                                   //text+=`<input type='button' style="margin:10px;" id="departjourney`+i+`" class="primary-btn-custom-un choose_selection_ticket_airlines_depart" value="Chosen" onclick="get_price_itinerary(`+i+`)" sequence_id="0"/>`;
                                                   //else
                                               }
                                           text+=`
                                           </div>
                                           <div class="col-lg-12 col-md-6" style="margin:auto;">`;
                                               if(airline[i].can_book == true && airline[i].can_book_check_arrival_on_next_departure == true){
                                                   text+=`<input type='button' style="margin:5px 0px 0px 0px; width:100%" id="departjourney`+i+`" class="primary-btn-custom choose_selection_ticket_airlines_depart" value="Choose" onclick="get_price_itinerary(`+i+`)" sequence_id="0"/>`;
                                               }else if(airline[i].can_book == true && airline[i].can_book_check_arrival_on_next_departure == false){
                                                   text+=`<input type='button' style="margin:5px 0px 0px 0px; width:100%" id="departjourney`+i+`" class="primary-btn-custom choose_selection_ticket_airlines_depart" value="Choose" onclick="alert_message_swal('Sorry, arrival time you pick does not match with this journey!');" sequence_id="0"/>`;
                                               }else{
                                                   text+=`<input type='button' style="margin:5px 0px 0px 0px; width:100%" id="departjourney`+i+`" class="primary-btn-custom choose_selection_ticket_airlines_depart" value="Sold Out" onclick="" disabled sequence_id="0"/>`;
                                               }
                                           text+=`
                                           </div>`;
//                                   if(provider_list_data[airline[i].provider].is_post_issued_reschedule)
//                                        text+=`
//                                            <span style="font-weight:bold; padding-right:5px;"><i class="fas fa-check-circle" style="color:#4f9c64;"></i> Reschedule</span>`;

//                                   if(provider_list_data[airline[i].provider].is_post_issued_cancel)
//                                        text+=`
//                                            <span style="font-weight:bold; padding-right:5px;"><i class="fas fa-check-circle" style="color:#4f9c64;"></i> Refund</span>`;

                                       text+=`
                                   </div>
                               </div>
                               <div class="col-lg-12 mt-3 show_fd_mbl">
                                   <a id="detail_button_journey0`+i+`" data-toggle="collapse" data-parent="#accordiondepart" onclick="show_flight_details(`+i+`);" href="#detail_departjourney`+i+`" style="color: #237395; text-decoration: unset;" aria-expanded="true">
                                       <span class="detail-link" style="font-weight: bold; display:none;" id="flight_details_up`+i+`"> Flight details <i class="fas fa-chevron-up" style="font-size:14px;"></i></span>
                                       <span class="detail-link" style="font-weight: bold; display:block;" id="flight_details_down`+i+`"> Flight details <i class="fas fa-chevron-down" style="font-size:14px;"></i></span>
                                   </a>
                               </div>

                               <div id="detail_departjourney`+i+`" class="panel-collapse collapse in" aria-expanded="true" style="display:none; width:100%; background: #f7f7f7; margin:5px; padding-top:15px;">`;
                                   for(j in airline[i].segments){
                                        text+=`
                                        <div id="copy_segments_details`+i+``+j+`">
                                           <span class="copy_segments" hidden>`+i+``+j+`</span>`;
                                           if(airline[i].segments[j].transit_duration != ''){
                                               text += `<div style="text-align:center;padding:0px 15px; margin-bottom:10px;">
                                               <div style="border:1px solid #cdcdcd; background:white; padding:5px; border-radius:5px;">
                                               <i class="fas fa-clock"></i>
                                               <span class="copy_transit_details"> Transit Duration: `;
                                               if(airline[i].segments[j].transit_duration.split(':')[0] != '0')
                                                   text+= airline[i].segments[j].transit_duration.split(':')[0] + 'd ';
                                               if(airline[i].segments[j].transit_duration.split(':')[1] != '0')
                                                   text+= airline[i].segments[j].transit_duration.split(':')[1] + 'h ';
                                               if(airline[i].segments[j].transit_duration.split(':')[2] != '0')
                                                   text+= airline[i].segments[j].transit_duration.split(':')[2] + 'm ';
                                               text+=`</span></div></div>`;
                                           }
                                           else{
                                               text += `<span class="copy_transit_details" hidden>0</span>`;
                                           }
    //                                       var depart = 0;
    //                                       if(airline[i].segments[j].origin == airline_request.destination[counter_search-1].split(' - ')[0])
    //                                           depart = 1;
    //                                       if(depart == 0 && j == 0)
    //                                           text+=`
    //                                           <div style="text-align:left; background-color:white; padding:5px 10px 5px 10px;">
    //                                               <span class="flight_type_template">Departure</span>
    //                                               <hr/>
    //                                           </div>`;
    //                                       else if(depart == 1){
    //                                           text+=`
    //                                           <div style="text-align:left; background-color:white; padding:5px 10px 5px 10px;">
    //                                               <span class="flight_type_template">Return</span>
    //                                               <hr/>
    //                                           </div>`;
    //                                           depart = 2;
    //                                       }
                                           text+=`
                                           <div class="row" id="journey0segment0" style="padding:10px;">
                                               <div class="col-lg-3 mb-2">
                                                   <div style="display:inline-flex;">`;
                                                   try{
                                                       if(airline[i].segments[j].carrier_code != airline[i].segments[j].operating_airline_code && airline[i].segments[j].operating_airline_code != ''){
                                                           text+=`
                                                           <div style="display:inline-block;">
                                                                <img data-toggle="tooltip" class="airlines_provider_img_fd" alt="`+airline[i].segments[j].operating_airline_code+`" title="`+airline_carriers[0][airline[i].segments[j].operating_airline_code].name+`" src="`+static_path_url_server+`/public/airline_logo/`+airline[i].segments[j].operating_airline_code+`.png">
                                                           </div>
                                                           <div style="display:inline-block; margin:auto;">
                                                               <div style="display:grid;">
                                                                   <span style="font-size:13px;" class="copy_carrier_provider_details">`+airline_carriers[0][airline[i].segments[j].operating_airline_code].name+`</span>
                                                               </div>
                                                               <div style="display:grid;">
                                                                   <span style="font-size:13px; font-weight:bold;" class="carrier_code_template">`+airline[i].segments[j].carrier_name+`</span>
                                                               </div>
                                                           </div>`;
                                                       }else{
                                                           text+=`
                                                           <div style="display:inline-block;">
                                                                <img data-toggle="tooltip" class="airlines_provider_img_fd" alt="`+airline[i].segments[j].operating_airline_code+`" title="`+airline_carriers[0][airline[i].segments[j].carrier_code].name+`" src="`+static_path_url_server+`/public/airline_logo/`+airline[i].segments[j].carrier_code+`.png">
                                                           </div>
                                                           <div style="display:inline-block; margin:auto;">
                                                               <div style="display:grid;">
                                                                   <span style="font-size:13px;" class="copy_carrier_provider_details">`+airline_carriers[0][airline[i].segments[j].carrier_code].name+`</span>
                                                               </div>
                                                               <div style="display:grid;">
                                                                   <span style="font-size:13px; font-weight:bold" class="carrier_code_template">`+airline[i].segments[j].carrier_name+`</span>
                                                               </div>
                                                           </div>`;
                                                       }
                                                   }
                                                   catch(err){
                                                       text+=`
                                                       <div style="display:inline-block;">
                                                            <img data-toggle="tooltip" class="airlines_provider_img_fd" alt="/static/tt_website/images/icon/product/c-airline.png" title="`+airline[i].segments[j].carrier_code+`" src="/static/tt_website/images/icon/product/c-airline.png">
                                                       </div>
                                                       <div style="display:inline-block; margin:auto;">
                                                           <div style="display:grid;">
                                                               <span style="font-size:13px;" class="copy_carrier_provider_details">`+airline[i].segments[j].carrier_code+`</span>
                                                           </div>
                                                           <div style="display:grid;">
                                                               <span style="font-size:13px; font-weight:bold" class="carrier_code_template">`+airline[i].segments[j].carrier_name+`</span>
                                                           </div>
                                                       </div>`;
                                                   }
                                                   text+=`
                                                   </div>
                                               </div>
                                               <div class="col-lg-6">`;
                                                   for(k in airline[i].segments[j].legs){
                                                       text+=`
                                                       <div class="row">
                                                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                                                <h6>`+airline[i].segments[j].legs[k].departure_date.split(' - ')[1]+`</h6>
                                                                <span style="font-size:12px;">`+airline[i].segments[j].legs[k].departure_date.split(' - ')[0]+`</span><br/>
                                                                <span>`+airline[i].segments[j].legs[k].origin+` (`+airline[i].segments[j].legs[k].origin_city+`)</span><br/>
                                                                <span style="font-weight:500;">`+airline[i].segments[j].legs[k].origin_name+`</span><br/>`;
                                                                if(airline[i].segments[j].origin_terminal != ''){
                                                                    text+=`<span style="font-size:13px; font-weight:500;">Terminal: `+airline[i].segments[j].origin_terminal+`</span><br/>`;
                                                                }else{
                                                                    text+=`<span style="font-size:13px; font-weight:500;">Terminal: -</span><br/>`;
                                                                }
                                                            text+=`
                                                            </div>
                                                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                                                <div style="text-align:center; position: absolute; left:-50%; width:100%; top:-10px;">
                                                                    <div style="display:inline-block;position:relative;width:100%;z-index:1;">
                                                                        <img src="/static/tt_website/images/icon/symbol/airlines-01.png" alt="Airline" style="width:20px; height:20px; margin-top:5px; position:relative; z-index:99;"/>
                                                                        <div class="show_pc" style="height:2px;position:absolute;top:16px;width:100%;background-color:#d4d4d4;"></div>
                                                                        <div class="show_pc origin-code-snippet" style="background-color:#d4d4d4;right:0px"></div>
                                                                    </div>`;
                                                                   if(airline[i].segments[j].elapsed_time.split(':')[0] != '0')
                                                                       text+= airline[i].segments[j].elapsed_time.split(':')[0] + 'd ';
                                                                   if(airline[i].segments[j].elapsed_time.split(':')[1] != '0')
                                                                       text+= airline[i].segments[j].elapsed_time.split(':')[1] + 'h ';
                                                                   if(airline[i].segments[j].elapsed_time.split(':')[2] != '0')
                                                                       text+= airline[i].segments[j].elapsed_time.split(':')[2] + 'm ';
                                                                    text+=`
                                                                </div>
                                                                <div style="text-align:right">
                                                                    <h6>`+airline[i].segments[j].legs[k].arrival_date.split(' - ')[1]+`</h6>
                                                                    <span style="font-size:12px;">`+airline[i].segments[j].legs[k].arrival_date.split(' - ')[0]+`</span><br/>
                                                                    <span>`+airline[i].segments[j].legs[k].destination+` (`+airline[i].segments[j].legs[k].destination_city+`)</span><br/
                                                                    <span style="font-weight:500;">`+airline[i].segments[j].legs[k].destination_name+`</span><br/>`;
                                                                    if(airline[i].segments[j].destination_terminal != ''){
                                                                        text+=`<span style="font-size:13px; font-weight:500;" class="legs_terminal_destination">Terminal: `+airline[i].segments[j].destination_terminal+`</span><br/>`;
                                                                    }else{
                                                                        text+=`<span style="font-size:13px; font-weight:500;" class="legs_terminal_destination">Terminal: -</span><br/>`;
                                                                    }
                                                                    text+=`
                                                                </div>
                                                            </div>
                                                       </div>`;
                                                   }

                                                   //copy airline checkmark
                                                   for(k in airline[i].segments[j].legs){
                                                       text+=`
                                                       <div class="row" id="copy_legs_details`+i+``+j+``+k+`" style="display:none;">
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
                                                                                text+=`<span style="font-size:13px; font-weight:500;" class="legs_terminal_origin">Terminal: `+airline[i].segments[j].origin_terminal+`</span><br/>`;
                                                                            }else{
                                                                                text+=`<span style="font-size:13px; font-weight:500;" class="legs_terminal_origin">Terminal: -</span><br/>`;
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
                                                                                text+=`<span style="font-size:13px; font-weight:500;" class="legs_terminal_destination">Terminal: `+airline[i].segments[j].destination_terminal+`</span><br/>`;
                                                                            }else{
                                                                                text+=`<span style="font-size:13px; font-weight:500;" class="legs_terminal_destination">Terminal: -</span><br/>`;
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
                                               </div>`;
                                               //copy airline checkmark
                                               text+=`
                                               <div class="col-lg-6" id="copy_legs_duration_details`+i+``+j+``+k+`" style="display:none;">
                                                   <i class="fas fa-clock"></i><span style="font-weight:500;" class="copy_duration_details"> `;
                                                   if(airline[i].segments[j].elapsed_time.split(':')[0] != '0')
                                                       text+= airline[i].segments[j].elapsed_time.split(':')[0] + 'd ';
                                                   if(airline[i].segments[j].elapsed_time.split(':')[1] != '0')
                                                       text+= airline[i].segments[j].elapsed_time.split(':')[1] + 'h ';
                                                   if(airline[i].segments[j].elapsed_time.split(':')[2] != '0')
                                                       text+= airline[i].segments[j].elapsed_time.split(':')[2] + 'm ';
                                                   text+=`</span><br/>`;

                                                   for(k in airline[i].segments[j].fares){
                                                       if(k == 0){
                                                           for(l in airline[i].segments[j].fares[k].fare_details){
                                                               text+=`
                                                               <div id="copy_fares_details`+i+``+j+``+k+``+l+`">
                                                               <span class="copy_fares" hidden>`+i+``+j+``+k+``+l+`</span>`;
                                                               if(l == 0){
                                                                   if(airline[i].segments[j].carrier_type_name != '')
                                                                       text += `<span style="font-weight:500;"><i class="fas fa-plane"></i> <span style="font-weight:500;" class="copy_aircraft_details">`+airline[i].segments[j].carrier_type_name+`</span><br/>`;
                                                                   else if(airline[i].segments[j].carrier_type_code != '')
                                                                       text += `<span style="font-weight:500;"><i class="fas fa-plane"></i> <span style="font-weight:500;" class="copy_aircraft_details">`+airline[i].segments[j].carrier_type_code+`</span><br/>`;
                                                               }
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
                                               text+=`
                                               </div>`;

                                               //edit detail segment
                                               text+=`
                                               <div class="col-lg-3">
                                                   <div class="row">
                                                       <div class="col-xs-12">`;
                                                       for(k in airline[i].segments[j].fares){
                                                           if(k == 0){
                                                               for(l in airline[i].segments[j].fares[k].fare_details){
                                                                   if(l == 0){
                                                                       if(airline[i].segments[j].carrier_type_name != '')
                                                                           text += `<div class="custom_fare_cls"><i class="fas fa-plane"></i> <span style="font-weight:500;">`+airline[i].segments[j].carrier_type_name+`</span></div><br/>`;
                                                                       else if(airline[i].segments[j].carrier_type_code != '')
                                                                           text += `<div class="custom_fare_cls"><i class="fas fa-plane"></i> <span style="font-weight:500;">`+airline[i].segments[j].carrier_type_code+`</span></div><br/>`;
                                                                   }
                                                                   if(airline[i].segments[j].fares[k].fare_details[l].detail_type.includes('BG')){
                                                                        text+=`<div class="custom_fare_cls"><i class="fas fa-suitcase"></i><span style="font-weight:500;" class="copy_suitcase_details"> `+airline[i].segments[j].fares[k].fare_details[l].amount+` `+airline[i].segments[j].fares[k].fare_details[l].unit+`</span></div><br/>`;
                                                                   }
                                                                   else if(airline[i].segments[j].fares[k].fare_details[l].detail_type == 'ML'){
                                                                        text+=`<div class="custom_fare_cls"><i class="fas fa-utensils"></i><span style="font-weight:500;" class="copy_utensils_details"> `+airline[i].segments[j].fares[k].fare_details[l].amount+` `+airline[i].segments[j].fares[k].fare_details[l].unit+`</span></div><br/>`;
                                                                   }else{
                                                                        text+=`<div class="custom_fare_cls"><span style="font-weight:500;" class="copy_others_details">`+airline[i].segments[j].fares[k].fare_details[l].amount+` `+airline[i].segments[j].fares[k].fare_details[l].unit+`</span></div><br/>`;
                                                                   }
                                                               }
                                                               break;
                                                           }
                                                       }
                                                       text+=`
                                                       </div>
                                                   </div>
                                                   <img src="/static/tt_website/images/icon/symbol/seat.png" style="height:16px; width:auto;">
                                                   <span id="choose_seat_span`+i+``+j+`"></span><br/>
                                                   <span type="button" class="detail-link" onclick="open_cos_seat_class('`+i+`','`+j+`')" style="font-weight:bold; font-size:14px; text-decoration:underline; cursor:pointer;">Change RBD <i class="fas fa-sync-alt"></i></span>
                                               </div>`;

                                               text+=`
                                               <div class="col-lg-12" style="top:-40px; left:-15px;">
                                                    <button id="show_choose_seat`+i+``+j+`" style="display:none;" type="button" class="primary-btn-white dropdown-toggle" data-toggle="dropdown"></button>
                                                    <ul id="provider_seat_content`+i+``+j+`" class="dropdown-menu" style="background:white; z-index:5; border:unset; padding:15px; border:1px solid #cdcdcd;">
                                                       <div class="row">
                                                           <div class="col-xs-12">
                                                                <h6 class="mb-3"><img src="/static/tt_website/images/icon/symbol/seat.png" style="height:16px; width:auto;"> Class of Service</h6>
                                                           </div>
                                                           <div class="col-lg-12">
                                                               <div style="display:flex; overflow:auto;">`;
                                                               fare_check = 0;

                                                               data_soc = [];//seat of class
                                                               data_soc_av = [];//seat of class available
                                                               data_soc_so = [];//seat of class sold out
                                                               for(k in airline[i].segments[j].fares){
                                                                    if(airline_pick_list.length == 0 || airline_recommendations_dict == {} || airline_recommendations_dict.hasOwnProperty(airline[i].journey_ref_id)){
                                                                        print = true;
                                                                        if(airline_recommendations_dict.hasOwnProperty(airline[i].journey_ref_id)){
                                                                            print = false;
                                                                            for(l in airline_recommendations_dict[airline[i].journey_ref_id]){
                                                                                for(m in airline_recommendations_dict[airline[i].journey_ref_id][l].segments){
                                                                                    if(airline[i].segments[j].fares[k].fare_ref_id == airline_recommendations_dict[airline[i].journey_ref_id][l].segments[m].fare_ref_id){
                                                                                        print = true;
                                                                                        break;
                                                                                    }
                                                                                }
                                                                                if(print)
                                                                                    break;
                                                                            }
                                                                        }
                                                                        if(print == true){
                                                                            if(airline_request.adult + airline_request.child > airline[i].segments[j].fares[k].available_count){
                                                                                data_soc_so.push(airline[i].segments[j].fares[k]);
                                                                            }else{
                                                                                data_soc_av.push(airline[i].segments[j].fares[k]);
                                                                            }
                                                                        }
                                                                    }
                                                                    else{
                                                                        if(airline_request.adult + airline_request.child > airline[i].segments[j].fares[k].available_count){
                                                                            data_soc_so.push(airline[i].segments[j].fares[k]);
                                                                        }else{
                                                                            data_soc_av.push(airline[i].segments[j].fares[k]);
                                                                        }
                                                                    }
                                                               }

                                                               data_soc = data_soc_av.concat(data_soc_so);
                                                               airline[i].segments[j].fares = data_soc;

                                                               for(k in airline[i].segments[j].fares){
                                                                   check = 0;
                                                                   text_seat_name = '';
                                                                   temp_seat_name = '';
                                                                   price_seat_name = '';
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
                                                                                        if(!['CHD', 'INF'].includes(airline_recommendations_dict[airline[i].journey_ref_id][journey_recom_idx].service_charge_summary[l].pax_type)){
                                                                                            total_price = airline_recommendations_dict[airline[i].journey_ref_id][journey_recom_idx].service_charge_summary[l].total_price / airline_recommendations_dict[airline[i].journey_ref_id][journey_recom_idx].service_charge_summary[l].pax_count; // harga per orang
                                                                                        }
                                                                                    }
                                                                                    total_price -= total_price_pick;
                                                                               }
                                                                               else{
                                                                                    //normal / first ticket
                                                                                    for(l in airline[i].segments[j].fares[k].service_charge_summary)
                                                                                        if(!['CHD', 'INF'].includes(airline[i].segments[j].fares[k].service_charge_summary[l].pax_type)){
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
                                                                                    if(!['CHD', 'INF'].includes(airline[i].segments[j].fares[k].service_charge_summary[l].pax_type)){
                                                                                        for(m in airline[i].segments[j].fares[k].service_charge_summary[l].service_charges)
                                                                                            if(airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'tax' || airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'fare' || airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'roc')
                                                                                                total_price+= airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].amount;
                                                                                        break;
                                                                                }
                                                                            }

                                                                            temp_seat_name += ''+airline[i].segments[j].fares[k].class_of_service+' ';
                                                                            price_seat_name += ''+airline[i].segments[j].fares[k].class_of_service;
                                                                            if(airline[i].segments[j].fares[k].cabin_class != ''){
                                                                                 if(airline[i].segments[j].fares[k].cabin_class == 'Y'){
                                                                                     text_seat_name += ' (Economy)';
                                                                                     temp_seat_name += ' (Economy)';
                                                                                 }
                                                                                 else if(airline[i].carrier_code_list.includes('QG') && airline[i].segments[j].fares[k].cabin_class == 'W'){
                                                                                     text_seat_name += ' (Royal Green)';
                                                                                     temp_seat_name += ' (Royal Green)';
                                                                                 }
                                                                                 else if(airline[i].segments[j].fares[k].cabin_class == 'W'){
                                                                                     text_seat_name += ' (Premium Economy)';
                                                                                     temp_seat_name += ' (Premium Economy)';
                                                                                 }
                                                                                 else if(airline[i].segments[j].fares[k].cabin_class == 'C'){
                                                                                     text_seat_name += ' (Business)';
                                                                                     temp_seat_name += ' (Business)';
                                                                                 }
                                                                                 else if(airline[i].segments[j].fares[k].cabin_class == 'F'){
                                                                                     text_seat_name += ' (First Class)';
                                                                                     temp_seat_name += ' (First Class)';
                                                                                 }
                                                                            }

                                                                            if(airline_request.adult + airline_request.child > airline[i].segments[j].fares[k].available_count){
                                                                               temp_seat_name += ' - SOLD OUT';
                                                                               text+=`
                                                                               <label class="radio-label100" style="color:#cdcdcd !important; cursor:not-allowed;">
                                                                                   <input onclick="" id="journey`+i+`segment`+j+`fare" name="journey`+i+`segment`+j+`fare" type="radio" value="`+airline[i].segments[j].fares[k].fare_code+`" disabled>
                                                                                   <div class="div_label100" style="background:white !important; cursor: not-allowed; color: #cdcdcd;">
                                                                                        <span style="font-weight:bold; font-size:15px;">`+airline[i].segments[j].fares[k].class_of_service+` `+text_seat_name+`</span><br/>`;
                                                                                        if(airline[i].segments[j].fares[k].fare_name)
                                                                                            text+=`<span style="font-size:13px;">`+airline[i].segments[j].fares[k].fare_name+`</span><br/>`;
                                                                                        if(airline[i].segments[j].fares[k].fare_basis_code)
                                                                                            text+=`<span style="font-size:13px;">`+airline[i].segments[j].fares[k].fare_basis_code+`</span>`;

                                                                                        text+=`
                                                                                        <div class="center_vh">
                                                                                            <img src="/static/tt_website/images/no_found/sold-out.png"/>
                                                                                        </div>
                                                                                        <div style="width:100%; text-align:right; right: 10px; bottom: 10px; position: absolute; margin-top:15px;">
                                                                                            <span class="price_template" style="color:#cdcdcd;">SOLD OUT</span><br/>
                                                                                        </div>
                                                                                   </div>
                                                                               </label>`;
                                                                            }
                                                                            else{
                                                                                if(total_price == 0){
                                                                                     temp_seat_name += ' <br/><b>Choose to view price</b>';
                                                                                }else{
                                                                                     temp_seat_name += ' <br/><b>'+airline[i].currency + ' ' + getrupiah(total_price)+'</b>';
                                                                                }

                                                                                text+=`
                                                                                <label class="radio-label100">
                                                                                     <input onclick="change_fare(`+i+`,`+j+`,`+k+`,'`+airline[i].segments[j].fares[k].fare_code+`'); change_seat_span(`+i+`, `+j+`, '`+temp_seat_name+`'); change_seat_fare_span(`+i+`, `+j+`, '`+price_seat_name+`');" id="journey`+i+`segment`+j+`fare" name="journey`+i+`segment`+j+`fare" type="radio" value="`+airline[i].segments[j].fares[k].fare_code+`"`;
                                                                                     if(fare_check == 0){
                                                                                          text+=` checked="checked"`;
                                                                                          airline[i].segments[j].fare_pick = parseInt(k);
                                                                                     }
                                                                                     text+=`>
                                                                                     <div class="div_label100">
                                                                                        <i class="fas fa-check check_label100"></i>
                                                                                        <span style="font-weight:bold; font-size:15px;">`+airline[i].segments[j].fares[k].class_of_service+` `+text_seat_name+`</span><br/>`;
                                                                                        if(airline[i].segments[j].fares[k].fare_name)
                                                                                            text+=`<span style="font-size:13px;">`+airline[i].segments[j].fares[k].fare_name+`</span><br/>`;
                                                                                        if(airline[i].segments[j].fares[k].fare_basis_code)
                                                                                            text+=`<span style="font-size:13px;">`+airline[i].segments[j].fares[k].fare_basis_code+`</span><br/>`;

                                                                                        if(airline[i].segments[j].fares[k].description.length != 0){
                                                                                             for(l in airline[i].segments[j].fares[k].description){
                                                                                                 text += `<span style="font-size:13px; display:block;"><i class="fas fa-caret-right"></i> `+airline[i].segments[j].fares[k].description[l]+`</span>`;
                                                                                             }
                                                                                             text+=`<br/>`;
                                                                                        }
                                                                                        text+=`Seat left: `+airline[i].segments[j].fares[k].available_count;
                                                                                        fare_check = 1;
                                                                                        id_price_segment = `journey`+i+`segment`+j+`fare`+k;

                                                                                        text+=`<div style="width:100%; text-align:right; right: 10px; bottom: 10px; position: absolute; margin-top:15px;">`;
                                                                                        if(total_price == 0){
                                                                                            text+=`<span id="`+id_price_segment+`" class="price_template">Choose to view price</span><br/>`;
                                                                                        }else{
                                                                                            text+=`<span id="`+id_price_segment+`" class="price_template">`+airline[i].currency+` `+getrupiah(total_price)+`</span>`;
                                                                                        }
                                                                                        text+=`
                                                                                        </div>
                                                                                    </div>
                                                                                 </label>`;
                                                                            }
                                                                        }
                                                                   }
                                                                   else{
                                                                        //bukan combo
                                                                        if(airline[i].segments[j].fares[k].service_charge_summary.length > 0)
                                                                            total_price = airline[i].segments[j].fares[k].service_charge_summary[0].total_price / airline[i].segments[j].fares[k].service_charge_summary[0].pax_count;
                                                                        else
                                                                            total_price = 0;

                                                                        temp_seat_name += ''+airline[i].segments[j].fares[k].class_of_service+' ';
                                                                        price_seat_name += ''+airline[i].segments[j].fares[k].class_of_service;
                                                                        if(airline[i].segments[j].fares[k].cabin_class != ''){
                                                                            if(airline[i].segments[j].fares[k].cabin_class == 'Y'){
                                                                                text_seat_name += ' (Economy)';
                                                                                temp_seat_name += ' (Economy)';
                                                                            }
                                                                            else if(airline[i].carrier_code_list.includes('QG') && airline[i].segments[j].fares[k].cabin_class == 'W'){
                                                                                text_seat_name += ' (Royal Green)';
                                                                                temp_seat_name += ' (Royal Green)';
                                                                            }
                                                                            else if(airline[i].segments[j].fares[k].cabin_class == 'W'){
                                                                                text_seat_name += ' (Premium Economy)';
                                                                                temp_seat_name += ' (Premium Economy)';
                                                                            }
                                                                            else if(airline[i].segments[j].fares[k].cabin_class == 'C'){
                                                                                text_seat_name += ' (Business)';
                                                                                temp_seat_name += ' (Business)';
                                                                            }
                                                                            else if(airline[i].segments[j].fares[k].cabin_class == 'F'){
                                                                                text_seat_name += ' (First Class)';
                                                                                temp_seat_name += ' (First Class)';
                                                                            }
                                                                       }

                                                                        if(airline_request.adult + airline_request.child > airline[i].segments[j].fares[k].available_count){
                                                                            temp_seat_name += ' - SOLD OUT';
                                                                            text+=`
                                                                            <label class="radio-label100" style="color:#cdcdcd !important; cursor:not-allowed;">
                                                                               <input onclick="" disabled id="journey`+i+`segment`+j+`fare" name="journey`+i+`segment`+j+`fare" type="radio" value="`+k+`">
                                                                               <div class="div_label100" style="background:white !important; cursor: not-allowed; color: #cdcdcd;">
                                                                                    <span style="font-weight:bold; font-size:15px;">`+airline[i].segments[j].fares[k].class_of_service+` `+text_seat_name+`</span><br/>`;
                                                                                    if(airline[i].segments[j].fares[k].fare_name)
                                                                                        text+=`<span style="font-size:13px;">`+airline[i].segments[j].fares[k].fare_name+`</span><br/>`;
                                                                                    if(airline[i].segments[j].fares[k].fare_basis_code)
                                                                                        text+=`<span style="font-size:13px;">`+airline[i].segments[j].fares[k].fare_basis_code+`</span>`;

                                                                                    text+=`
                                                                                    <div class="center_vh">
                                                                                        <img src="/static/tt_website/images/no_found/sold-out.png"/>
                                                                                    </div>
                                                                                    <div style="width:100%; text-align:right; right: 10px; bottom: 10px; position: absolute; margin-top:15px;">
                                                                                        <span class="price_template" style="color:#cdcdcd;">SOLD OUT</span><br/>
                                                                                    </div>
                                                                               </div>
                                                                           </label>`;
                                                                        }
                                                                        else{
                                                                            if(total_price == 0){
                                                                                 temp_seat_name += ' <br/><b>Choose to view price</b>';
                                                                            }else{
                                                                                 temp_seat_name += ' <br/><b>'+airline[i].currency + ' ' + getrupiah(total_price) + '</b>';
                                                                            }
                                                                            text+=`
                                                                            <label class="radio-label100">
                                                                                <input onclick="change_fare(`+i+`,`+j+`,`+k+`,'`+airline[i].segments[j].fares[k].fare_code+`'); change_seat_span(`+i+`, `+j+`, '`+temp_seat_name+`'); change_seat_fare_span(`+i+`, `+j+`, '`+price_seat_name+`');" id="journey`+i+`segment`+j+`fare" name="journey`+i+`segment`+j+`fare" type="radio" value="`+airline[i].segments[j].fares[k].fare_code+`"`;
                                                                                if(fare_check == 0 && airline[i].segments[j].fares[k].available_count > airline_request.adult + airline_request.child){
                                                                                     text+=` checked="checked"`;
                                                                                     airline[i].segments[j].fare_pick = parseInt(k);
                                                                                     fare_check = 1;
                                                                                }
                                                                                text+=`>
                                                                                <div class="div_label100">
                                                                                   <i class="fas fa-check check_label100"></i>
                                                                                   <span style="font-weight:bold; font-size:15px;">`+airline[i].segments[j].fares[k].class_of_service+` `+text_seat_name+`</span><br/>`;

                                                                                   if(airline[i].segments[j].fares[k].fare_name)
                                                                                       text+=`<span style="font-size:13px;">`+airline[i].segments[j].fares[k].fare_name+`</span><br/>`;
                                                                                   if(airline[i].segments[j].fares[k].fare_basis_code)
                                                                                       text+=`<span style="font-size:13px;">`+airline[i].segments[j].fares[k].fare_basis_code+`</span><br/>`;

                                                                                   if(airline[i].segments[j].fares[k].description.length != 0){
                                                                                        for(l in airline[i].segments[j].fares[k].description){
                                                                                            text += `<span style="font-size:13px; display:block;"><i class="fas fa-caret-right"></i> `+airline[i].segments[j].fares[k].description[l]+`</span>`;
                                                                                        }
                                                                                        text+=`<br/>`;
                                                                                   }

                                                                                   text+=`Seat left: `+airline[i].segments[j].fares[k].available_count;

                                                                                   id_price_segment = `journey`+i+`segment`+j+`fare`+k;

                                                                                   text+=`<div style="width:100%; text-align:right; right: 10px; bottom: 10px; position: absolute; margin-top:15px;">`;
                                                                                   if(total_price == 0){
                                                                                       text+=`<span id="`+id_price_segment+`" class="price_template">Choose to view price</span><br/>`;
                                                                                   }else{
                                                                                       text+=`<span id="`+id_price_segment+`" class="price_template">`+airline[i].currency+` `+getrupiah(total_price)+`</span><br/>`;
                                                                                   }
                                                                                   text+=`
                                                                                   </div>
                                                                               </div>
                                                                           </label>`;
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
    //                                                                           <input onclick="change_fare(`+i+`,`+j+`,`+k+`,); change_seat_span(`+i+`, `+j+`, '`+temp_seat_name+`'); change_seat_fare_span(`+i+`, `+j+`, '`+price_seat_name+`');" id="journey`+i+`segment`+j+`fare" name="journey`+i+`segment`+j+`fare" type="radio" value="`+k+`" disabled>
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
    //                                                                                   <input onclick="change_fare(`+i+`,`+j+`,`+k+`); change_seat_span(`+i+`, `+j+`, '`+temp_seat_name+`'); change_seat_fare_span(`+i+`, `+j+`, '`+price_seat_name+`');" id="journey`+i+`segment`+j+`fare" name="journey`+i+`segment`+j+`fare" type="radio" value="`+k+`" checked="checked">
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
    //                                                                               <input onclick="change_fare(`+i+`,`+j+`,`+k+`); change_seat_span(`+i+`, `+j+`, '`+temp_seat_name+`'); change_seat_fare_span(`+i+`, `+j+`, '`+price_seat_name+`');" id="journey`+i+`segment`+j+`fare" name="journey`+i+`segment`+j+`fare" type="radio" value="`+k+`">
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
    //                                                                       text+=`<span style="font-size:13px;">`+airline[i].segments[j].fares[k].fare_name+`</span>`;
    //                                                                   if(airline[i].segments[j].fares[k].description.length != 0){
    //                                                                        for(l in airline[i].segments[j].fares[k].description){
    //                                                                            text += `<span style="font-size:13px; display:block;">`+airline[i].segments[j].fares[k].description[l]+`</span>`;
    //                                                                            if(l != airline[i].segments[j].fares[k].description.length -1)
    //                                                                                text += '';
    //                                                                        }
    //                                                                   }
    //                                                                   text+=`</label></div>`;
                                                               }
                                                               text+=`
                                                               </div>
                                                           </div>
                                                       </div>
                                                   </ul>
                                                </div>
                                            </div>
                                        </div>`;
                                       }

                                   text+=`
                                   <div class="col-lg-12" style="background:white; padding-top:10px; border-top:1px solid #cdcdcd;">
                                       <div class="row">
                                            <div class="col-lg-5 col-md-5" style="text-align:left; margin:auto;">
                                               <span style="font-weight:700;">Class</span>`;
                                               for(fare_seat_co in airline[i].segments){
                                                   text+=`<div class="custom_seat_cls"><span id="fare_seat_class_fd`+i+``+fare_seat_co+`"></span></div>`;
                                               }
                                               text+=`
                                            </div>
                                            <div class="col-lg-4 col-md-4" style="text-align:right; margin:auto;">
                                               <div id="fare_no_discount_fd`+i+`">

                                               </div>
                                               <span id="more_fare_fd`+i+`" style="cursor:pointer;">
                                                   <span id="fare_fd`+i+`" class="basic_fare_field price_template"`;
                                                   if(is_show_breakdown_price){
                                                        text += ` style="cursor:pointer;"`;
                                                   }
                                                   text+=`>
                                                   </span>
                                               </span>`;
                                               if(typeof(currency_rate_data) !== 'undefined' && currency_rate_data.result.is_show){
                                                    if(user_login.hasOwnProperty('co_ho_seq_id') && currency_rate_data.result.response.agent.hasOwnProperty(user_login.co_ho_seq_id)){ // buat o3
                                                        for(k in currency_rate_data.result.response.agent[user_login.co_ho_seq_id]){
                                                            try{
                                                                text+=`<span id="fare_fd`+i+`_other_currency_`+k+`" class="basic_fare_field price_template"></span>`;
                                                            }catch(err){console.log(err);}
                                                        }
                                                    }
                                               }
                                           text+=`
                                           </div>
                                           <div class="col-lg-3 col-md-3" style="text-align:right; margin:auto;">`;
                                               if(airline[i].can_book == true && airline[i].can_book_check_arrival_on_next_departure == true){
                                                   text+=`<input type='button' style="margin:5px 0px 0px 0px; width:100%;" id="departjourney_fd`+i+`" class="primary-btn-custom choose_selection_ticket_airlines_depart" value="Choose" onclick="get_price_itinerary(`+i+`)" sequence_id="0"/>`;
                                               }else if(airline[i].can_book == true && airline[i].can_book_check_arrival_on_next_departure == false){
                                                   text+=`<input type='button' style="margin:5px 0px 0px 0px; width:100%;" id="departjourney_fd`+i+`" class="primary-btn-custom choose_selection_ticket_airlines_depart" value="Choose" onclick="alert_message_swal('Sorry, arrival time you pick does not match with this journey!');" sequence_id="0"/>`;
                                               }else{
                                                   text+=`<input type='button' style="margin:5px 0px 0px 0px; width:100%;" id="departjourney_fd`+i+`" class="primary-btn-custom choose_selection_ticket_airlines_depart" value="Sold Out" onclick="" disabled sequence_id="0"/>`;
                                               }
                                           text+=`
                                           </div>
                                       </div>
                                   </div>
                               </div>
                           </div>`;
                           var node = document.createElement("div");
                           node.innerHTML = text;
                           document.getElementById("airlines_ticket").appendChild(node);
                           node = document.createElement("div");
                //                   document.getElementById('airlines_ticket').innerHTML += text;

                           document.getElementById("airlines_ticket_loading").innerHTML = "";

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
                                                    if(!['CHD', 'INF'].includes(airline_recommendations_journey[airline_recommendations_list.indexOf(airline[i].journey_ref_id)].service_charge_summary[l].pax_type))
                                                        temp_total_price = airline_recommendations_journey[airline_recommendations_list.indexOf(airline[i].journey_ref_id)].service_charge_summary[l].total_price / airline_recommendations_journey[airline_recommendations_list.indexOf(airline[i].journey_ref_id)].service_charge_summary[l].pax_count;
                                                }
                                                temp_total_price -= total_price_pick;
                                            }else{
                                                for(l in airline[i].segments[j].fares[k].service_charge_summary)
                                                    if(!['CHD', 'INF'].includes(airline[i].segments[j].fares[k].service_charge_summary[l].pax_type)){
                                                        for(m in airline[i].segments[j].fares[k].service_charge_summary[l].service_charges)
                                                            if(airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'tax' || airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'fare' || airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'roc')
                                                                temp_total_price+= airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].amount;
                                                        break;
                                                }
                                            }
                                       }else{
                                            for(l in airline[i].segments[j].fares[k].service_charge_summary)
                                                if(!['CHD', 'INF'].includes(airline[i].segments[j].fares[k].service_charge_summary[l].pax_type)){
                                                    for(m in airline[i].segments[j].fares[k].service_charge_summary[l].service_charges)
                                                        if(airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'tax' || airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'fare' || airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'roc')
                                                            temp_total_price+= airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].amount;
                                                    break;
                                            }
                                       }
                                   }else if(airline_pick_list.length != airline_request.origin.length-1 || airline_request.origin.length == 1){
                                        for(l in airline[i].segments[j].fares[k].service_charge_summary)
                                            if(!['CHD', 'INF'].includes(airline[i].segments[j].fares[k].service_charge_summary[l].pax_type)){
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
                                            var fare_seat_span = document.getElementById('fare_seat_class'+i+j);
                                            var fare_seat_span_fd = document.getElementById('fare_seat_class_fd'+i+j);
                                            choose_span.innerHTML = ''+airline[i].segments[j].fares[k].class_of_service;
                                            fare_seat_span.innerHTML = ''+airline[i].segments[j].fares[k].class_of_service;
                                            fare_seat_span_fd.innerHTML = ''+airline[i].segments[j].fares[k].class_of_service;

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
                                                choose_span.innerHTML += ' <br/><b>Choose to view price</b>';
                                           }else{
                                                choose_span.innerHTML += ' <br/><b>'+airline[i].currency + ' ' + getrupiah(temp_total_price) + '</b>';
                                           }

                                           fare_check = 1;
                                       }
                                   }
                                }
                           }

                           airline_info_text = '';
                           for(j in airline[i].segments){
                               airline_info_text+=`
                               <div class="row">
                                  <div class="col-lg-12 mb-2">
                                       <div style="display:inline-flex;">
                                           <div style="font-weight:bold; display:inline-block;">`;
                                               try{
                                                   airline_info_text+=`<img data-toggle="tooltip" class="airlines_provider_img_detail" alt="`+airline_carriers[0][airline[i].segments[j].carrier_code].name+`" title="`+airline_carriers[0][airline[i].segments[j].carrier_code].name+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+airline[i].segments[j].carrier_code+`.png">`;
                                               }catch(err){
                                                   airline_info_text+=`<img data-toggle="tooltip" class="airlines_provider_img_detail" alt="`+airline[i].segments[j].carrier_code+`" title="`+airline[i].segments[j].carrier_code+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+airline[i].segments[j].carrier_code+`.png">`;
                                               }
                                           airline_info_text+=`
                                           </div>
                                           <div style="display:inline-block;;">`;
                                               if(airline[i].segments[j].carrier_code != airline[i].segments[j].operating_airline_code && airline[i].segments[j].operating_airline_code != ''){
                                                   try{
                                                       airline_info_text += `<span style="font-weight: 700; font-size:12px;">Operated:</span><br/><span style="font-weight: 700; font-size:12px;"> `+airline_carriers[0][airline[i].segments[j].operating_airline_code].name+`</span><br/>`;
                                                   }catch(err){
                                                       airline_info_text += `<span style="font-weight: 700; font-size:12px;">Operated:</span><br/><span> `+airline[i].segments[j].operating_airline_code+`</span><br/>`;
                                                   }
                                               }

                                               try{
                                                   airline_info_text+=`<span style="font-size:12px;">`+airline_carriers[0][airline[i].segments[j].carrier_code].name+`</span><br/>`;
                                               }catch(err){
                                                   airline_info_text+=`<span style="font-size:12px;">`+airline[i].segments[j].carrier_code+`</span><br/>`;
                                               }

                                               try{
                                                   airline_info_text+=`<span style="font-size:12px;">`+airline[i].segments[j].carrier_name+`</span>`;
                                               }catch(err){}

                                               airline_info_text+=`
                                           </div>
                                       </div>
                                    </div>
                               </div>`;
                           }
                           new jBox('Tooltip', {
                               attach: '#airlines_info_temp'+i,
                               target: '#airlines_info_temp'+i,
                               theme: 'TooltipBorder',
                               trigger: 'click',
                               width: 200,
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
                               content: airline_info_text
                           });
//                           for(j in airline[i].fare_details){
//                              if(airline[i].fare_details[j].detail_type.includes('BG')){
//                                   text+=`<div class="custom_fare_cls"><i class="fas fa-suitcase"></i><span style="font-weight:500; display:none;" class="copy_suitcase_details"> `+airline[i].fare_details[j].amount+` `+airline[i].fare_details[j].unit+`</span></div>`;
//                              }
//                              else if(airline[i].fare_details[j].detail_type == 'ML'){
//                                   text+=`<div class="custom_fare_cls"><i class="fas fa-utensils"></i><span style="font-weight:500; display:none;" class="copy_utensils_details"> `+airline[i].fare_details[j].amount+` `+airline[i].fare_details[j].unit+`</span></div>`;
//                              }else{
//                                   text+=`<div class="custom_fare_cls"><span style="font-weight:500; display:none;" class="copy_others_details">`+airline[i].fare_details[j].amount+` `+airline[i].fare_details[j].unit+`</span></div>`;
//                              }
//                           }


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
                                    if(!['CHD', 'INF'].includes(airline_recommendations_journey[airline_recommendations_list.indexOf(airline[i].journey_ref_id)].service_charge_summary[l].pax_type))
                                        total_price = airline_recommendations_journey[airline_recommendations_list.indexOf(airline[i].journey_ref_id)].service_charge_summary[l].total_price / airline_recommendations_journey[airline_recommendations_list.indexOf(airline[i].journey_ref_id)].service_charge_summary[l].pax_count;
                                }
                                total_price -= total_price_pick;
                                if(total_price != 0){
                                    document.getElementById('fare'+i).innerHTML = airline[i].currency+' '+getrupiah(total_price);
                                    try{
                                        document.getElementById('fare_fd'+i).innerHTML = airline[i].currency+' '+getrupiah(total_price);
                                    }catch(err){}
                                }else if(airline[i].can_book == true)
                                    document.getElementById('fare'+i).innerHTML = 'Choose to view price';
                                    try{
                                        document.getElementById('fare_fd'+i).innerHTML = 'Choose to view price';
                                    }catch(err){}
                                if(is_show_breakdown_price){
                                    document.getElementById('more_fare'+i).innerHTML+= ` <i class="fas fa-chevron-down price_template"></i>`;
                                    try{
                                        document.getElementById('more_fare_fd'+i).innerHTML+= ` <i class="fas fa-chevron-down price_template"></i>`;
                                    }catch(err){}
                                    var price_breakdown = {};
                                    for(l in airline_recommendations_journey[airline_recommendations_list.indexOf(airline[i].journey_ref_id)].service_charge_summary){
                                        if(!['CHD', 'INF'].includes(airline_recommendations_journey[airline_recommendations_list.indexOf(airline[i].journey_ref_id)].service_charge_summary[l].pax_type)){
                                            for(k in airline_recommendations_journey[airline_recommendations_list.indexOf(airline[i].journey_ref_id)].service_charge_summary[l].service_charges){
                                                if(airline_recommendations_journey[airline_recommendations_list.indexOf(airline[i].journey_ref_id)].service_charge_summary[l].service_charges[k].charge_type != 'RAC'){
                                                    if(!price_breakdown.hasOwnProperty(airline_recommendations_journey[airline_recommendations_list.indexOf(airline[i].journey_ref_id)].service_charge_summary[l].service_charges[k].charge_type))
                                                        price_breakdown[airline_recommendations_journey[airline_recommendations_list.indexOf(airline[i].journey_ref_id)].service_charge_summary[l].service_charges[k].charge_type] = 0;
                                                    price_breakdown[airline_recommendations_journey[airline_recommendations_list.indexOf(airline[i].journey_ref_id)].service_charge_summary[l].service_charges[k].charge_type] += airline_recommendations_journey[airline_recommendations_list.indexOf(airline[i].journey_ref_id)].service_charge_summary[l].service_charges[k].total;
                                                }
                                            }
                                            break;
                                        }
                                    }
                                    for(index_airline in airline_pick_list){
                                        for(index_segment in airline_pick_list[index_airline].segments){
                                            for(index_fare in airline_pick_list[index_airline].segments[index_segment].fares){
                                                if(parseInt(index_fare) == airline_pick_list[index_airline].segments[index_segment].fare_pick){
                                                    for(index_svc_summary in airline_pick_list[index_airline].segments[index_segment].fares[index_fare].service_charge_summary)
                                                        if(!['CHD', 'INF'].includes(airline_pick_list[index_airline].segments[index_segment].fares[index_fare].service_charge_summary[index_svc_summary].pax_type)){
                                                            for(index_svc in airline_pick_list[index_airline].segments[index_segment].fares[index_fare].service_charge_summary[index_svc_summary].service_charges){
                                                                price_breakdown[airline_pick_list[index_airline].segments[index_segment].fares[index_fare].service_charge_summary[index_svc_summary].service_charges[index_svc].charge_type] -= airline_pick_list[index_airline].segments[index_segment].fares[index_fare].service_charge_summary[index_svc_summary].service_charges[index_svc].amount;
                                                            }
                                                            break;
                                                        }
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                    var breakdown_text = '';
                                    for(x in price_breakdown){
                                        if(breakdown_text)
                                            breakdown_text += '<br/>';
                                        if(j != 'ROC')
                                            breakdown_text += '<b>'+x+'</b> ';
                                        else
                                            breakdown_text += '<b>CONVENIENCE FEE</b> ';
                                        breakdown_text += airline[i].currency + ' ' + getrupiah(price_breakdown[x]);
                                    }
                                    new jBox('Tooltip', {
                                        attach: '#more_fare'+i,
                                        target: '#more_fare'+i,
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
                                    try{
                                        new jBox('Tooltip', {
                                            attach: '#more_fare_fd'+i,
                                            target: '#more_fare_fd'+i,
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
                                    }catch(err){}
                                }
                                if(typeof(currency_rate_data) !== 'undefined' && currency_rate_data.result.is_show && airline[i].total_price){
                                    if(user_login.hasOwnProperty('co_ho_seq_id') && currency_rate_data.result.response.agent.hasOwnProperty(user_login.co_ho_seq_id)){ // buat o3
                                        for(k in currency_rate_data.result.response.agent[user_login.co_ho_seq_id]){
                                            try{
                                                if(currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].base_currency == airline[i].currency){
                                                    price_convert = (airline[i].total_price/currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].rate).toFixed(2);
                                                    if(price_convert%1 == 0)
                                                        price_convert = parseInt(price_convert);
                                                    document.getElementById('fare'+i+'_other_currency_'+k).innerHTML = 'Estimated ' + k + ' ' + getrupiah(price_convert) + '<br/>';
                                                    try{
                                                        document.getElementById('fare_fd'+i+'_other_currency_'+k).innerHTML = 'Estimated ' + k + ' ' + getrupiah(price_convert) + '<br/>';
                                                    }catch(err){}
                                                }else{
                                                    document.getElementById('fare'+i+'_other_currency_'+k).style.display = 'none';
                                                    try{
                                                        document.getElementById('fare_fd'+i+'_other_currency_'+k).style.display = 'none';
                                                    }catch(err){}
                                                }
                                            }catch(err){
                                                console.log(err);
                                            }
                                        }
                                    }
                                }
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
                                    if(total_discount != 0){
                                        document.getElementById('fare_no_discount'+i).innerHTML = '<span class="basic_fare_field cross_price" style="font-size:13px; color:#929292;">'+airline[i].currency+' '+getrupiah(airline[i].total_price + total_discount)+'</span><br/>';
                                        try{
                                            document.getElementById('fare_no_discount_fd'+i).innerHTML = '<span class="basic_fare_field cross_price" style="font-size:13px; color:#929292;">'+airline[i].currency+' '+getrupiah(airline[i].total_price + total_discount)+'</span><br/>';
                                        }catch(err){}
                                    }
                                    document.getElementById('fare'+i).innerHTML = airline[i].currency+' '+getrupiah(airline[i].total_price);
                                    try{
                                        document.getElementById('fare_fd'+i).innerHTML = airline[i].currency+' '+getrupiah(airline[i].total_price);
                                    }catch(err){}
                                    if(is_show_breakdown_price){
                                        document.getElementById('more_fare'+i).innerHTML+= ` <i class="fas fa-chevron-down price_template"></i>`;
                                        try{
                                            document.getElementById('more_fare_fd'+i).innerHTML+= ` <i class="fas fa-chevron-down price_template"></i>`;
                                        }catch(err){}
                                        var price_breakdown = {};
                                        for(j in airline[i].segments){
                                            for(k in airline[i].segments[j].fares[airline[i].segments[j].fare_pick].service_charge_summary){
                                                if(!['CHD', 'INF'].includes(airline[i].segments[j].fares[airline[i].segments[j].fare_pick].service_charge_summary[k].pax_type)){
                                                    for(l in airline[i].segments[j].fares[airline[i].segments[j].fare_pick].service_charge_summary[k].service_charges){
                                                        if(airline[i].segments[j].fares[airline[i].segments[j].fare_pick].service_charge_summary[k].service_charges[l].charge_type != 'RAC'){
                                                            if(!price_breakdown.hasOwnProperty(airline[i].segments[j].fares[airline[i].segments[j].fare_pick].service_charge_summary[k].service_charges[l].charge_type))
                                                                price_breakdown[airline[i].segments[j].fares[airline[i].segments[j].fare_pick].service_charge_summary[k].service_charges[l].charge_type] = 0;
                                                            price_breakdown[airline[i].segments[j].fares[airline[i].segments[j].fare_pick].service_charge_summary[k].service_charges[l].charge_type] += airline[i].segments[j].fares[airline[i].segments[j].fare_pick].service_charge_summary[k].service_charges[l].total;
                                                        }
                                                    }
                                                    break;
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
                                            breakdown_text += airline[i].currency + ' ' + getrupiah(price_breakdown[j]);
                                        }
                                        new jBox('Tooltip', {
                                            attach: '#more_fare'+i,
                                            target: '#more_fare'+i,
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
                                        try{
                                            new jBox('Tooltip', {
                                                attach: '#more_fare_fd'+i,
                                                target: '#more_fare_fd'+i,
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
                                        }catch(err){}
                                    }
                                    if(typeof(currency_rate_data) !== 'undefined' && currency_rate_data.result.is_show && airline[i].total_price){
                                        if(user_login.hasOwnProperty('co_ho_seq_id') && currency_rate_data.result.response.agent.hasOwnProperty(user_login.co_ho_seq_id)){ // buat o3
                                            for(k in currency_rate_data.result.response.agent[user_login.co_ho_seq_id]){
                                                try{
                                                    if(currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].base_currency == airline[i].currency){
                                                        price_convert = (airline[i].total_price/currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].rate).toFixed(2);
                                                        if(price_convert%1 == 0)
                                                            price_convert = parseInt(price_convert);
                                                        document.getElementById('fare'+i+'_other_currency_'+k).innerHTML = 'Estimated ' + k + ' ' + getrupiah(price_convert) + '<br/>';
                                                        try{
                                                            document.getElementById('fare_fd'+i+'_other_currency_'+k).innerHTML = 'Estimated ' + k + ' ' + getrupiah(price_convert) + '<br/>';
                                                        }catch(err){}
                                                    }else{
                                                        document.getElementById('fare'+i+'_other_currency_'+k).style.display = 'none';
                                                        try{
                                                            document.getElementById('fare_fd'+i+'_other_currency_'+k).style.display = 'none';
                                                        }catch(err){}
                                                    }
                                                }catch(err){
                                                    console.log(err);
                                                }
                                            }
                                        }
                                    }

                                }else if(airline[i].can_book == true){
                                    document.getElementById('fare'+i).innerHTML = 'Choose to view price';
                                    try{
                                        document.getElementById('fare_fd'+i).innerHTML = 'Choose to view price';
                                    }catch(err){}
                                }
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
            <img src="/static/tt_website/images/no_found/no-airlines.png" alt="Not Found Airlines" style="width:70px; height:70px;" title="" />
            <br/>
        </div>
        <center><div class="alert alert-warning" role="alert" style="margin-top:15px; border:1px solid #cdcdcd;"><h6><i class="fas fa-search-minus"></i> Oops! Sorry no ticket for flight `+ parseInt(counter_search).toString()+`. Please try another flight. </h6></div></center>`;
        var node = document.createElement("div");
        node.innerHTML = text;
        document.getElementById("airlines_ticket").appendChild(node);
        node = document.createElement("div");

        document.getElementById('airlines_result_ticket').innerHTML = '';
        document.getElementById("airlines_ticket_loading").innerHTML = '';
        document.getElementById("airlineAirline_generalShow_loading").innerHTML = '<h6>Flights not Found</h6>';
        document.getElementById("airlineAirline_generalShow_loading2").innerHTML = '<h6>Flights not Found</h6>';

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
                <span class="span-search-ticket" style="color:black;">Select All to Copy</span>
                <input type="checkbox" id="check_all_copy" onchange="check_all_result();"/>
                <span class="check_box_span_custom"></span>
            </label>
        </div>`;
        var node_co = document.createElement("div");
        node_co.innerHTML = text_co;
        document.getElementById("airlines_result_ticket").appendChild(node_co);

        document.getElementById("airlineAirline_generalShow_loading").innerHTML = '';
        document.getElementById("airlineAirline_generalShow_loading2").innerHTML = '';
   }

//    $('.dropdown-menu').on('click', function(e) {
//      e.stopPropagation();
//    });
    $(".dropdown-close-seat").click(function() {
       $(".dropdown-close-seat").dropdown("toggle");
    });
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
    $('#airlines_result_ticket').show();

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
        $('#airlines_result_ticket').hide();
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
        <div style="background-color:white; border:1px solid `+color+`; margin-bottom:15px; padding:15px 15px 0px 15px;;" id="journey2`+airline_pick_list[i].airline_pick_sequence+`">
            <div class="row">
                <div class="col-lg-12">`;
                    carrier_code_airline = [];
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
                text+=`
                </div>`;
                //sudah lama ga dipake
                //hasil pick airline
                if(airline_pick_list[i].is_combo_price == true){
                    for(j in airline_pick_list[i].segments){
                        flight_number = parseInt(j) + 1;
                        text +=`
                        <div class="col-lg-12">
                            <div class="row">
                                <div class="col-lg-2" style="padding-top:10px;">`;
                                    if(airline_pick_list[i].segments[j].carrier_code != airline_pick_list[i].segments[j].operating_airline_code && airline_pick_list[i].segments[j].operating_airline_code != ''){
                                        try{
                                            text += `<span class="copy_operated_by" style="float:left; font-weight: 700; font-size:12px;">Operated by `+airline_carriers[0][airline_pick_list[i].segments[j].operating_airline_code].name+`</span><br/>`;
                                        }catch(err){
                                            text += `<span class="copy_operated_by" style="float:left; font-weight: 700; font-size:12px;">Operated by `+airline_pick_list[i].segments[j].operating_airline_code+`</span><br/>`;
                                        }
                                    }
                                    text+=`
                                    <span class="copy_carrier_provider" style="font-weight:500; font-size:12px;">`+airline_carriers[0][airline_pick_list[i].segments[j].carrier_code].name+`</span><br/>
                                    <span class="carrier_code_template">`+airline_pick_list[i].segments[j].carrier_name+`</span><br/>`;

                                    try{
                                        text+=`<img data-toggle="tooltip" style="width:50px; height:50px;margin-bottom:5px;" alt="`+airline_carriers[0][airline_pick_list[i].segments[j].operating_airline_code].name+`" title="`+airline_carriers[0][airline_pick_list[i].segments[j].operating_airline_code].name+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+airline_pick_list[i].segments[j].operating_airline_code+`.png"><br/>`;
                                    }catch(err){
                                        text+=`<img data-toggle="tooltip" style="width:50px; height:50px;margin-bottom:5px;" alt="`+airline_carriers[0][airline_pick_list[i].segments[j].operating_airline_code].name+`" title="`+airline_carriers[0][airline_pick_list[i].segments[j].operating_airline_code].name+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+airline_pick_list[i].segments[j].carrier_code+`.png"><br/>`;
                                    }
                                    text+=`
                                </div>
                                <div class="col-lg-10">
                                    <div class="row">
                                        <div class="col-lg-12" style="margin-top:10px;">
                                            <span class="copy_flight_number" class="carrier_code_template">Flight `+flight_number+`</span>
                                        </div>
                                        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">
                                            <table style="width:100%">
                                                <tr>
                                                    <td class="airport-code"><h5 class="copy_time_depart">`+airline_pick_list[i].segments[j].departure_date.split(' - ')[1]+`</h5></td>
                                                    <td style="padding-left:15px;">
                                                        <img src="/static/tt_website/images/icon/symbol/airlines-01.png" alt="Airline" style="width:20px; height:20px; margin-top:5px;"/>
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
                                            <i class="fas fa-clock"></i>
                                            <span class="copy_duration" style="font-weight:500;">`;
                                            if(airline_pick_list[i].segments[j].elapsed_time.split(':')[0] != '0'){
                                                text+= airline_pick_list[i].segments[j].elapsed_time.split(':')[0] + 'd ';
                                            }
                                            if(airline_pick_list[i].segments[j].elapsed_time.split(':')[1] != '0'){
                                                text+= airline_pick_list[i].segments[j].elapsed_time.split(':')[1] + 'h ';
                                            }
                                            if(airline_pick_list[i].segments[j].elapsed_time.split(':')[2] != '0'){
                                                text+= airline_pick_list[i].segments[j].elapsed_time.split(':')[2] + 'm ';
                                            }
                                            text+=`
                                            </span><br/>
                                            <span class="copy_transit">Transit: `+airline_pick_list[i].segments[j].transit_count+`</span><br/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`;
                    }
                }
                else if(airline_pick_list[i].is_combo_price == false){
                    flight_operated_pick = '';
                    flight_carrier_pick = '';
                    flight_carrier_name_pick = '';
                    for(j in airline_pick_list[i].segments){
                        if(airline_pick_list[i].segments[j].carrier_code != airline_pick_list[i].segments[j].operating_airline_code && airline_pick_list[i].segments[j].operating_airline_code != ''){
                            if(flight_carrier_pick != '')
                                flight_carrier_pick += ', ';
                            if(flight_operated_pick != '')
                                flight_operated_pick += ', ';
                            try{
                                flight_operated_pick += airline_carriers[0][airline_pick_list[i].segments[j].operating_airline_code].name;
                            }catch(err){
                                flight_operated_pick += airline_pick_list[i].segments[j].operating_airline_code;
                            }
                            try{
                                flight_carrier_pick += airline_carriers[0][airline_pick_list[i].segments[j].carrier_code].name;
                            }catch(err){
                                flight_carrier_pick += airline_pick_list[i].segments[j].carrier_code;
                            }
                        }
                        else if(airline_pick_list[i].carrier_code_list.length == 1){
                            if(j == 0){
                                if(flight_carrier_pick != '')
                                    flight_carrier_pick += ', ';
                                try{
                                    flight_carrier_pick += airline_carriers[0][airline_pick_list[i].segments[j].carrier_code].name;
                                }catch(err){
                                    flight_carrier_pick += airline_pick_list[i].segments[j].carrier_code;
                                }
                            }
                        }
                        else{
                            if(flight_carrier_pick != '')
                                    flight_carrier_pick += ', ';
                            try{
                                flight_carrier_pick += airline_carriers[0][airline_pick_list[i].segments[j].carrier_code].name;
                            }catch(err){
                                flight_carrier_pick += airline_pick_list[i].segments[j].carrier_code;
                            }
                        }

                        try{
                            flight_carrier_name_pick += airline_pick_list[i].segments[j].carrier_name;
                            if(j != (airline_pick_list[i].segments.length-1)){
                                flight_carrier_name_pick += ', ';
                            }
                        }catch(err){}
                    }

                    flight_check_print_pick = 0; //print 1x
                    text+=`
                    <div class="col-lg-9" id="copy_div_airline`+airline_pick_list[i].sequence+`">
                        <span class="copy_airline" hidden>`+airline_pick_list[i].sequence+`</span>
                        <div class="row mt-2">
                            <div class="col-lg-4 col-md-4">`;
                                for(j in airline_pick_list[i].segments){
                                    //ganti sini
                                    if(flight_check_print_pick == 0){
                                        text+=`<div class="row">`;
                                    }else{
                                        text+=`<div class="row" style="display:none;">`;
                                    }
                                    text+=`
                                        <div class="col-lg-12 mb-2">
                                            <span class="copy_po" hidden>`+j+`</span>`;
                                            if(flight_operated_pick != ''){
                                                text+=`
                                                <div style="font-size:12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100%;">
                                                    <span><b>Operated:</b> `+flight_operated_pick+`</span>
                                                </div>`;
                                            }
                                            text+=`
                                            <div style="display:inline-flex;">`;
                                                if(flight_check_print_pick == 0){
                                                    text+=`
                                                    <div style="display:inline-block;">`;
                                                        if(airline_pick_list[i].segments[j].carrier_code != airline_pick_list[i].segments[j].operating_airline_code && airline_pick_list[i].segments[j].operating_airline_code != ''){
                                                            try{
                                                                text+=`<img data-toggle="tooltip" class="airlines_provider_img" alt="`+airline_carriers[0][airline_pick_list[i].segments[j].carrier_code].name+`" title="`+airline_carriers[0][airline_pick_list[i].segments[j].carrier_code].name+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+airline_pick_list[i].segments[j].carrier_code+`.png">`;
                                                            }catch(err){
                                                                text+=`<img data-toggle="tooltip" class="airlines_provider_img" alt="`+airline_pick_list[i].segments[j].carrier_code+`" title="`+airline_pick_list[i].segments[j].carrier_code+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+airline_pick_list[i].segments[j].carrier_code+`.png">`;
                                                            }
                                                        }
                                                        else if(airline_pick_list[i].carrier_code_list.length > 1){
                                                            text+=`
                                                            <img data-toggle="tooltip" class="airlines_provider_img" alt="`+airline_carriers[0][airline_pick_list[i].segments[j].carrier_code].name+`" title="`+airline_carriers[0][airline_pick_list[i].segments[j].carrier_code].name+`" class="airline-logo" src="/static/tt_website/images/icon/product/c-multi-airline.png">`;

//                                                                                    text+=`
//                                                                                    <div style="background: white; width: fit-content; padding: 0px 5px; font-size: 12px; position: absolute; bottom: -5px; left: 40px; border: 1px solid #cdcdcd; border-radius: 6px;">
//                                                                                        <i class="fas fa-plane"></i> `+parseInt(airline_pick_list[i].segments.length)+`
//                                                                                    </div>`;
                                                        }else{
                                                            try{
                                                                text+=`<img data-toggle="tooltip" class="airlines_provider_img" alt="`+airline_carriers[0][airline_pick_list[i].segments[j].carrier_code].name+`" title="`+airline_carriers[0][airline_pick_list[i].segments[j].carrier_code].name+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+airline_pick_list[i].segments[j].carrier_code+`.png">`;
                                                            }catch(err){
                                                                text+=`<img data-toggle="tooltip" class="airlines_provider_img" alt="`+airline_pick_list[i].segments[j].carrier_code+`" title="`+airline_pick_list[i].segments[j].carrier_code+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+airline_pick_list[i].segments[j].carrier_code+`.png">`;
                                                            }
                                                        }
                                                    text+=`
                                                    </div>`;

                                                    text+=`
                                                    <div style="display:inline-block;">`;
                                                        if(flight_carrier_pick != ''){
                                                            text+=`<div style="display:grid;"><span style="font-size:12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100%;">`+flight_carrier_pick+`</span></div>`;
                                                        }

                                                        if(flight_carrier_name_pick != ''){
                                                            text+=`<div style="display:grid;"><span style="font-size:12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100%;">`+flight_carrier_name_pick+`</span></div>`;
                                                        }
                                                        text+=`

                                                        <span style="color:`+color+`; cursor:pointer; font-weight:bold;" id="airlines_info_temp_pick`+i+`">Detail <i class="fas fa-info-circle"></i></span>
                                                    </div>`;

                                                    flight_check_print_pick = 1;
                                                }
                                                text+=`
                                            </div>
                                            <div style="font-weight:bold; display:none;">`;
                                                if(airline_pick_list[i].segments[j].carrier_code != airline_pick_list[i].segments[j].operating_airline_code && airline_pick_list[i].segments[j].operating_airline_code != ''){
                                                    try{
                                                        text += `<span class="copy_operated_by" style="float:left; font-weight: 700; font-size:12px;">Operated by `+airline_carriers[0][airline_pick_list[i].segments[j].operating_airline_code].name+`</span>`;
                                                    }catch(err){
                                                        text += `<span class="copy_operated_by" style="float:left; font-weight: 700; font-size:12px;">Operated by `+airline_pick_list[i].segments[j].operating_airline_code+`</span>`;
                                                    }
                                                    try{
                                                        text+=`<span class="copy_carrier_provider" style="font-size:12px;">`+airline_carriers[0][airline_pick_list[i].segments[j].carrier_code].name+`</span>`;
                                                    }catch(err){
                                                        text+=`<span class="copy_carrier_provider" style="font-size:12px;">`+airline_pick_list[i].segments[j].carrier_code+`</span>`;
                                                    }
                                                }else if(carrier_code_airline.includes(airline_pick_list[i].segments[j].carrier_code) == false){
                                                    try{
                                                        text+=`<span class="copy_carrier_provider" style="font-size:12px;">`+airline_carriers[0][airline_pick_list[i].segments[j].carrier_code].name+`</span>`;
                                                    }catch(err){
                                                        text+=`<span class="copy_carrier_provider" style="font-size:12px;">`+airline_pick_list[i].segments[j].carrier_code+`</span>`;
                                                    }
                                                }

                                                try{
                                                    text+=`<span class="carrier_code_template" style="font-size:12px;">`+airline_pick_list[i].segments[j].carrier_name+`</span>`;
                                                }catch(err){}

                                                text+=`
                                            </div>`;

                                            if(carrier_code_airline.includes(airline_pick_list[i].segments[j].carrier_code) == false)
                                                carrier_code_airline.push(airline_pick_list[i].segments[j].carrier_code);
                                            text+=`
                                        </div>
                                    </div>`;
                                }
                                //for(j in airline_pick_list[i].carrier_code_list){
                                //    text+=`
                                //    <span class="copy_carrier_provider" style="font-weight:500; font-size:12px;">`+airline_carriers[0][airline_pick_list[i].carrier_code_list[j]].name+`</span><br/>
                                //    <img data-toggle="tooltip" alt="" style="width:50px; height:50px;" title="`+airline_carriers[0][airline_pick_list[i].carrier_code_list[j]].name+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+airline_pick_list[i].carrier_code_list[j]+`.png"><br/>`;
                                //}

                                text+=`
                                <div class="row show_fd">
                                    <div class="col-lg-12">
                                       <a id="detail_button_journey_pc2`+airline_pick_list[i].airline_pick_sequence+`" data-toggle="collapse" data-parent="#accordiondepart" href="#detail_departjourney_pick`+airline_pick_list[i].airline_pick_sequence+`" style="color: `+color+`; text-decoration:unset;" onclick="show_flight_details2(`+airline_pick_list[i].airline_pick_sequence+`);" aria-expanded="true">
                                           <span style="font-weight: bold; display:none;" id="flight_details_up_pc2`+airline_pick_list[i].airline_pick_sequence+`"> Flight details <i class="fas fa-chevron-up" style="font-size:14px;"></i></span>
                                           <span style="font-weight: bold; display:block;" id="flight_details_down_pc2`+airline_pick_list[i].airline_pick_sequence+`"> Flight details <i class="fas fa-chevron-down" style="font-size:14px;"></i></span>
                                       </a>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-8 col-md-8">
                                <div class="row">
                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                        <h6 class="copy_time_depart">`+airline_pick_list[i].departure_date.split(' - ')[1]+`</h6>
                                        <span class="copy_date_depart">`+airline_pick_list[i].departure_date.split(' - ')[0]+` </span><br/>
                                        <span class="copy_departure" style="font-weight:500;">`+airline_pick_list[i].origin+`</span><br/>
                                    </div>
                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                        <div style="text-align:center; position: absolute; left:-30%;">`;
                                        if(airline_pick_list[i].transit_count==0){
                                            text+=`<span class="copy_transit" style="font-weight:500;">Direct</span>`;
                                        }
                                        else{
                                            text+=`<span class="copy_transit" style="font-weight:500;">Transit: `+airline_pick_list[i].transit_count+`</span>`;
                                        }
                                        text+=`
                                        <div style="display:inline-block;position:relative;width:100%;z-index:1;">
                                            <img src="/static/tt_website/images/icon/symbol/airlines-01.png" alt="Airline" style="width:20px; height:20px; margin-top:5px; position:relative; z-index:99;"/>
                                            <div class="show_pc" style="height:2px;position:absolute;top:16px;width:100%;background-color:#d4d4d4;"></div>
                                            <div class="show_pc origin-code-snippet" style="background-color:#d4d4d4;right:0px"></div>
                                        </div>`;
                                        if(airline_pick_list[i].elapsed_time.split(':')[0] != '0'){
                                            text+= airline_pick_list[i].elapsed_time.split(':')[0] + 'd ';
                                        }
                                        if(airline_pick_list[i].elapsed_time.split(':')[1] != '0'){
                                            text+= airline_pick_list[i].elapsed_time.split(':')[1] + 'h ';
                                        }
                                        if(airline_pick_list[i].elapsed_time.split(':')[2] != '0'){
                                            text+= airline_pick_list[i].elapsed_time.split(':')[2] + 'm ';
                                        }
                                        text+=`
                                        </div>
                                        <div style="text-align:right">
                                            <h6 class="copy_time_arr">`+airline_pick_list[i].arrival_date.split(' - ')[1]+`</h6>
                                            <span class="copy_date_arr">`+airline_pick_list[i].arrival_date.split(' - ')[0]+`</span><br/>
                                            <span class="copy_arrival" style="font-weight:500;">`+airline_pick_list[i].destination+`</span><br/>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="margin-top:10px;">
                                        <div class="row">
                                            <div class="col-xs-12">`;
                                            for(j in airline_pick_list[i].fare_details){
                                               if(airline_pick_list[i].fare_details[j].detail_type.includes('BG')){
                                                    text+=`<div class="custom_fare_cls"><i class="fas fa-suitcase"></i><span style="font-weight:500;" class="copy_suitcase_details"> `+airline_pick_list[i].fare_details[j].amount+` `+airline_pick_list[i].fare_details[j].unit+`</span></div>`;
                                               }
                                               else if(airline_pick_list[i].fare_details[j].detail_type == 'ML'){
                                                    text+=`<div class="custom_fare_cls"><i class="fas fa-utensils"></i><span style="font-weight:500;" class="copy_utensils_details"> `+airline_pick_list[i].fare_details[j].amount+` `+airline_pick_list[i].fare_details[j].unit+`</span></div>`;
                                               }else{
                                                    text+=`<div class="custom_fare_cls"><span style="font-weight:500;" class="copy_others_details">`+airline_pick_list[i].fare_details[j].amount+` `+airline_pick_list[i].fare_details[j].unit+`</span></div>`;
                                               }
                                            }
                                            text+=`
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 mt-2">
                                       <div style="display:block; padding-top:5px; text-align:right;">
                                           <span style="font-weight:700;">Class </span>`;
                                            for(fare_seat_co in airline_pick_list[i].segments){
                                                text+=`<div class="custom_seat_cls"><span id="fare_seat_class_pick`+i+``+fare_seat_co+`"></span></div>`;
//                                                if(fare_seat_co != airline_pick_list[i].segments.length-1){
//                                                    text+=`<br/>`;
//                                                }
                                            }
                                            text+=`
                                       </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
                }

                text+=`
                <div class="col-lg-3" style="margin-bottom:5px; text-align:right;">
                    <div class="row">`;
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
                                    if(!['CHD', 'INF'].includes(airline_recommendations_dict[airline_pick_list[airline_pick_list.length-1].journey_ref_id][journey_recom_idx].service_charge_summary[l].pax_type)){
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
                                            if(!['CHD', 'INF'].includes(airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].pax_type))
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

                        if(provider_list_data.hasOwnProperty(airline_pick_list[i].provider) == true && provider_list_data[airline_pick_list[i].provider].description != ''){
                            text += `<div class="col-lg-12"><span style="margin-right:5px;">`+provider_list_data[airline_pick_list[i].provider].description+`</span></div>`;
                        }

                        text+=`
                        <div class="col-lg-12">
                            <div style="display:inline-block;">`;
                            total_discount = 0;
                            if(price == 0){
                                text+= '<span style="color:'+color+'">Choose All Flight Schedule to view price</span>';
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
                                    text += `<br/><span id="fare_no_discount_detail_pick`+airline_pick_list[i].airline_pick_sequence+`" class="basic_fare_field cross_price" style="font-size:14px; color:#929292;">`+currency+` `+getrupiah(price)+`</span><br/>`
                                }
                                text+= `<span id="fare_detail_pick`+airline_pick_list[i].airline_pick_sequence+`" class="basic_fare_field price_template" style="font-size:16px;font-weight: bold; color:`+color+`; padding:10px 0px;`;
                                if(is_show_breakdown_price){
                                    text+= "cursor:pointer;";
                                }
                                text+=`">`+currency+' '+getrupiah(price-total_discount);
                                if(is_show_breakdown_price){
                                    text+= ` <i class="fas fa-chevron-down price_template"></i>`;
                                }
                                text+='</span>';
                                if(typeof(currency_rate_data) !== 'undefined' && currency_rate_data.result.is_show && price){
                                    if(user_login.hasOwnProperty('co_ho_seq_id') && currency_rate_data.result.response.agent.hasOwnProperty(user_login.co_ho_seq_id)){ // buat o3
                                        for(k in currency_rate_data.result.response.agent[user_login.co_ho_seq_id]){
                                            try{
                                                if(currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].base_currency == currency){
                                                    price_convert = (Math.ceil(price-total_discount)/currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].rate).toFixed(2);
                                                    if(price_convert%1 == 0)
                                                        price_convert = parseInt(price_convert);
                                                    text+=`<br/><span class="basic_fare_field price_template" style="font-size:16px;font-weight: bold; color:`+color+`; padding:10px 0px;"> Estimated `+k+` `+getrupiah(price_convert)+`</span>`;
                                                }
                                            }catch(err){
                                                console.log(err);
                                            }
                                        }
                                    }
                                }
                            }
                            text+=`
                            </div>
                        </div>
                        <div class="col-lg-12 col-md-6 pt-3" style="margin:auto;">
                            <div class="row">`;
                            if(type == 'all'){
                                text+=`
                                <div class="col-lg-12 col-xs-6">
                                    <input type='button' style="width:100%; height:35px; line-height:unset;" id="deletejourney_pick`+airline_pick_list[i].airline_pick_sequence+`" class="primary-btn-white-cancel choose_selection_ticket_airlines_depart" value="Delete" onclick="delete_mc_journey(`+airline_pick_list[i].airline_pick_sequence+`);" sequence_id="0"/>
                                </div>
                                <div class="col-lg-12 col-xs-6">
                                    <input type='button' style="width:100%; height:35px; line-height:unset;" id="changejourney_pick`+airline_pick_list[i].airline_pick_sequence+`" class="primary-btn-custom choose_selection_ticket_airlines_depart" value="Change" onclick="change_departure(`+airline_pick_list[i].airline_pick_sequence+`);" sequence_id="0"/>
                                </div>`;
                            }
                            else if(type == 'change'){
                                text+=`
                                <div class="col-lg-12 col-xs-6">
                                    <input type='button' style="width:100%; height:35px; line-height:unset; background:#cdcdcd !important;" id="deletejourney_pick`+airline_pick_list[i].airline_pick_sequence+`" class="primary-btn-white-cancel choose_selection_ticket_airlines_depart" value="Delete" onclick="delete_mc_journey(`+airline_pick_list[i].airline_pick_sequence+`);" disabled sequence_id="0"/>
                                </div>
                                <div class="col-lg-12 col-xs-6">
                                    <input type='button' style="width:100%; height:35px; line-height:unset; " id="changejourney_pick`+airline_pick_list[i].airline_pick_sequence+`" class="primary-btn-custom choose_selection_ticket_airlines_depart" value="Change" onclick="change_departure(`+airline_pick_list[i].airline_pick_sequence+`);" sequence_id="0"/>
                                </div>`;
                            }
                            else if(type == 'delete'){
                                text+=`
                                <div class="col-lg-12 col-xs-6">
                                    <input type='button' style="width:100%; height:35px; line-height:unset; " id="deletejourney_pick`+airline_pick_list[i].airline_pick_sequence+`" class="primary-btn-white-cancel choose_selection_ticket_airlines_depart" value="Delete" onclick="delete_mc_journey(`+airline_pick_list[i].airline_pick_sequence+`);" sequence_id="0"/>
                                </div>
                                <div class="col-lg-12 col-xs-6">
                                    <input type='button' style="width:100%; height:35px; line-height:unset; background:#f5f5f5 !important;" id="changejourney_pick`+airline_pick_list[i].airline_pick_sequence+`" class="primary-btn-custom choose_selection_ticket_airlines_depart" value="Change" onclick="change_departure(`+airline_pick_list[i].airline_pick_sequence+`);" disabled sequence_id="0"/>
                                </div>`;
                            }
                            else if(type=='no_button'){
                                text+=`
                                <div class="col-lg-12 col-xs-6">
                                    <input type='button' style="width:100%; height:35px; line-height:unset; background:#cdcdcd !important;" id="deletejourney_pickdepartjourney`+airline_pick_list[i].airline_pick_sequence+`" class="primary-btn-white-cancel choose_selection_ticket_airlines_depart" value="Delete" onclick="delete_mc_journey(`+airline_pick_list[i].airline_pick_sequence+`);" disabled sequence_id="0"/>
                                </div>
                                <div class="col-lg-12 col-xs-6">
                                    <input type='button' style="width:100%; height:35px; line-height:unset; background:#cdcdcd !important;" id="changejourney_pick`+airline_pick_list[i].airline_pick_sequence+`" class="primary-btn-custom choose_selection_ticket_airlines_depart" value="Change" onclick="change_departure(`+airline_pick_list[i].airline_pick_sequence+`);" disabled sequence_id="0"/>
                                </div>`;
                            }
                            text+=`
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-12 mt-3 show_fd_mbl">
                    <a id="detail_button_journey2`+airline_pick_list[i].airline_pick_sequence+`" data-toggle="collapse" data-parent="#accordiondepart" href="#detail_departjourney_pick`+airline_pick_list[i].airline_pick_sequence+`" style="color: `+color+`; text-decoration:unset;" onclick="show_flight_details2(`+airline_pick_list[i].airline_pick_sequence+`);" aria-expanded="true">
                        <span style="font-weight: bold; display:none;" id="flight_details_up2`+airline_pick_list[i].airline_pick_sequence+`"> Flight details <i class="fas fa-chevron-up" style="font-size:14px;"></i></span>
                        <span style="font-weight: bold; display:block;" id="flight_details_down2`+airline_pick_list[i].airline_pick_sequence+`"> Flight details <i class="fas fa-chevron-down" style="font-size:14px;"></i></span>
                    </a>
                </div>

                <div id="detail_departjourney_pick`+airline_pick_list[i].airline_pick_sequence+`" class="panel-collapse collapse in" aria-expanded="true" style="display:none; width:100%; background: #f7f7f7; background: #f7f7f7; padding:15px 10px 10px 10px;">
                    <div class="row">`;
                    for(j in airline_pick_list[i].segments){
                        if(airline_pick_list[i].segments[j].transit_duration != ''){
                            text += `
                            <div class="col-lg-12 mt-1 mb-1" style="text-align:center;padding:10px 15px;">
                                <div style="border:1px solid #cdcdcd; background:white; padding:5px; border-radius:5px;">
                                    <span style="font-weight:500;"><i class="fas fa-clock"></i>Transit Duration: `;
                                    if(airline_pick_list[i].segments[j].transit_duration.split(':')[0] != '0')
                                        text+= airline_pick_list[i].segments[j].transit_duration.split(':')[0] + 'd ';
                                    if(airline_pick_list[i].segments[j].transit_duration.split(':')[1] != '0')
                                        text+= airline_pick_list[i].segments[j].transit_duration.split(':')[1] + 'h ';
                                    if(airline_pick_list[i].segments[j].transit_duration.split(':')[2] != '0')
                                        text+= airline_pick_list[i].segments[j].transit_duration.split(':')[2] + 'm ';
                                    text+=`
                                    </span>
                                </div>
                            </div>
                            <br/>`;
                        }


//                            var depart = 0;
//                            if(airline_pick_list[i].segments[j].origin == airline_request.destination[0].split(' - ')[0])
//                                depart = 1;
//
//                            if(airline_request.direction != 'MC'){
//                                if(depart == 0 && j == 0)
//                                    text+=`
//                                    <div class="col-lg-12">
//                                        <div style="text-align:left; background-color:white; padding-top:10px;">
//                                            <span class="flight_type_template">Departure</span>
//                                            <hr/>
//                                        </div>
//                                    </div>`;
//                                else if(depart == 1){
//                                    text+=`
//                                    <div class="col-lg-12">
//                                        <div style="text-align:left; background-color:white; padding-top:10px;">
//                                            <span class="flight_type_template">Return</span>
//                                            <hr/>
//                                        </div>
//                                    </div>`;
//                                    depart = 2;
//                                }
//                            }
//                            else{
//                                text+=`
//                                <div class="col-lg-12">
//                                    <div style="text-align:left; background-color:white; padding-top:10px;">
//                                        <span class="flight_type_template">Flight `+parseInt(parseInt(i)+1)+`</span>
//                                        <hr/>
//                                    </div>
//                                </div>`;
//                            }

                        text+=`
                        <div class="col-lg-12">
                            <div class="row" id="journeypick0segment0">
                               <div class="col-lg-3 mb-2">
                                   <div style="display:inline-flex;">`;
                                   try{
                                       if(airline_pick_list[i].segments[j].carrier_code != airline_pick_list[i].segments[j].operating_airline_code && airline_pick_list[i].segments[j].operating_airline_code != ''){
                                           text+=`
                                           <div style="display:inline-block;">
                                                <img data-toggle="tooltip" class="airlines_provider_img_fd" alt="`+airline_pick_list[i].segments[j].operating_airline_code+`" title="`+airline_carriers[0][airline_pick_list[i].segments[j].operating_airline_code].name+`" src="`+static_path_url_server+`/public/airline_logo/`+airline_pick_list[i].segments[j].operating_airline_code+`.png">
                                           </div>
                                           <div style="display:inline-block; margin:auto;">
                                               <div style="display:grid;">
                                                   <span style="font-size:13px;" class="copy_carrier_provider_details">`+airline_carriers[0][airline_pick_list[i].segments[j].operating_airline_code].name+`</span>
                                               </div>
                                               <div style="display:grid;">
                                                   <span style="font-size:13px; font-weight:bold;" class="carrier_code_template">`+airline_pick_list[i].segments[j].carrier_name+`</span>
                                               </div>
                                           </div>`;
                                       }else{
                                           text+=`
                                           <div style="display:inline-block;">
                                                <img data-toggle="tooltip" class="airlines_provider_img_fd" alt="`+airline_pick_list[i].segments[j].operating_airline_code+`" title="`+airline_carriers[0][airline_pick_list[i].segments[j].carrier_code].name+`" src="`+static_path_url_server+`/public/airline_logo/`+airline_pick_list[i].segments[j].carrier_code+`.png">
                                           </div>
                                           <div style="display:inline-block; margin:auto;">
                                               <div style="display:grid;">
                                                   <span style="font-size:13px;" class="copy_carrier_provider_details">`+airline_carriers[0][airline_pick_list[i].segments[j].carrier_code].name+`</span>
                                               </div>
                                               <div style="display:grid;">
                                                   <span style="font-size:13px; font-weight:bold" class="carrier_code_template">`+airline_pick_list[i].segments[j].carrier_name+`</span>
                                               </div>
                                           </div>`;
                                       }
                                   }
                                   catch(err){
                                       text+=`
                                       <div style="display:inline-block;">
                                            <img data-toggle="tooltip" class="airlines_provider_img_fd" alt="/static/tt_website/images/icon/product/c-airline.png" title="`+airline_pick_list[i].segments[j].carrier_code+`" src="/static/tt_website/images/icon/product/c-airline.png">
                                       </div>
                                       <div style="display:inline-block; margin:auto;">
                                           <div style="display:grid;">
                                               <span style="font-size:13px;" class="copy_carrier_provider_details">`+airline_pick_list[i].segments[j].carrier_code+`</span>
                                           </div>
                                           <div style="display:grid;">
                                               <span style="font-size:13px; font-weight:bold" class="carrier_code_template">`+airline_pick_list[i].segments[j].carrier_name+`</span>
                                           </div>
                                       </div>`;
                                   }
                                   text+=`
                                   </div>
                               </div>`;

//                                text+=`
//                                <div class="col-lg-2">`;
//                                    if(airline_pick_list[i].segments[j].carrier_code != airline_pick_list[i].segments[j].operating_airline_code && airline_pick_list[i].segments[j].operating_airline_code != ''){
//                                        try{
//                                            text += `<span class="copy_operated_by" style="float:left; font-weight: 700; font-size:12px;">Operated by `+airline_carriers[0][airline_pick_list[i].segments[j].operating_airline_code].name+`</span><br/>`;
//
//                                        }catch(err){
//                                            text += `<span class="copy_operated_by" style="float:left; font-weight: 700; font-size:12px;">Operated by `+airline_pick_list[i].segments[j].operating_airline_code+`</span><br/>`;
//                                        }
//                                    }
//                                text+=`
//                                    <span class="copy_carrier_provider" style="font-weight:500; font-size:12px;">`+airline_carriers[0][airline_pick_list[i].segments[j].carrier_code].name+`</span><br/>
//                                    <img data-toggle="tooltip" alt="`+airline_carriers[0][airline_pick_list[i].segments[j].carrier_code].name+`" style="width:50px; height:50px;margin-bottom:5px;" title="`+airline_carriers[0][airline_pick_list[i].segments[j].carrier_code].name+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+airline_pick_list[i].segments[j].carrier_code+`.png"><br/>
//                                </div>`;

                                text+=`
                                <div class="col-lg-6">`;
                                for(k in airline_pick_list[i].segments[j].legs){
                                   text+=`
                                   <div class="row">
                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                            <h6>`+airline_pick_list[i].segments[j].legs[k].departure_date.split(' - ')[1]+`</h6>
                                            <span style="font-size:12px;">`+airline_pick_list[i].segments[j].legs[k].departure_date.split(' - ')[0]+`</span><br/>
                                            <span>`+airline_pick_list[i].segments[j].legs[k].origin+` (`+airline_pick_list[i].segments[j].legs[k].origin_city+`)</span><br/>
                                            <span style="font-weight:500;">`+airline_pick_list[i].segments[j].legs[k].origin_name+`</span><br/>`;
                                            if(airline_pick_list[i].segments[j].origin_terminal != ''){
                                                text+=`<span style="font-size:13px; font-weight:500;">Terminal: `+airline_pick_list[i].segments[j].origin_terminal+`</span><br/>`;
                                            }else{
                                                text+=`<span style="font-size:13px; font-weight:500;">Terminal: -</span><br/>`;
                                            }
                                        text+=`
                                        </div>
                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                            <div style="text-align:center; position: absolute; left:-50%; width:100%; top:-10px;">
                                                <div style="display:inline-block;position:relative;width:100%;z-index:1;">
                                                    <img src="/static/tt_website/images/icon/symbol/airlines-01.png" alt="Airline" style="width:20px; height:20px; margin-top:5px; position:relative; z-index:99;"/>
                                                    <div class="show_pc" style="height:2px;position:absolute;top:16px;width:100%;background-color:#d4d4d4;"></div>
                                                    <div class="show_pc origin-code-snippet" style="background-color:#d4d4d4;right:0px"></div>
                                                </div>`;
                                               if(airline_pick_list[i].segments[j].elapsed_time.split(':')[0] != '0')
                                                   text+= airline_pick_list[i].segments[j].elapsed_time.split(':')[0] + 'd ';
                                               if(airline_pick_list[i].segments[j].elapsed_time.split(':')[1] != '0')
                                                   text+= airline_pick_list[i].segments[j].elapsed_time.split(':')[1] + 'h ';
                                               if(airline_pick_list[i].segments[j].elapsed_time.split(':')[2] != '0')
                                                   text+= airline_pick_list[i].segments[j].elapsed_time.split(':')[2] + 'm ';
                                                text+=`
                                            </div>
                                            <div style="text-align:right">
                                                <h6>`+airline_pick_list[i].segments[j].legs[k].arrival_date.split(' - ')[1]+`</h6>
                                                <span style="font-size:12px;">`+airline_pick_list[i].segments[j].legs[k].arrival_date.split(' - ')[0]+`</span><br/>
                                                <span>`+airline_pick_list[i].segments[j].legs[k].destination+` (`+airline_pick_list[i].segments[j].legs[k].destination_city+`)</span><br/
                                                <span style="font-weight:500;">`+airline_pick_list[i].segments[j].legs[k].destination_name+`</span><br/>`;
                                                if(airline_pick_list[i].segments[j].destination_terminal != ''){
                                                    text+=`<span style="font-size:13px; font-weight:500;" class="legs_terminal_destination">Terminal: `+airline_pick_list[i].segments[j].destination_terminal+`</span><br/>`;
                                                }else{
                                                    text+=`<span style="font-size:13px; font-weight:500;" class="legs_terminal_destination">Terminal: -</span><br/>`;
                                                }
                                                text+=`
                                            </div>
                                        </div>
                                   </div>`;
                                }

                                //edit detail segment2
                                text+=`
                                </div>
                                <div class="col-lg-3">
                                   <div class="row">
                                       <div class="col-xs-12">`;
                                       for(k in airline_pick_list[i].segments[j].fares){
                                           if(k == 0){
                                               for(l in airline_pick_list[i].segments[j].fares[k].fare_details){
                                                   if(l == 0){
                                                       if(airline_pick_list[i].segments[j].carrier_type_name != '')
                                                           text += `<div class="custom_fare_cls"><i class="fas fa-plane"></i> <span style="font-weight:500;">`+airline_pick_list[i].segments[j].carrier_type_name+`</span></div><br/>`;
                                                       else if(airline_pick_list[i].segments[j].carrier_type_code != '')
                                                           text += `<div class="custom_fare_cls"><i class="fas fa-plane"></i> <span style="font-weight:500;">`+airline_pick_list[i].segments[j].carrier_type_code+`</span></div><br/>`;
                                                   }
                                                   if(airline_pick_list[i].segments[j].fares[k].fare_details[l].detail_type.includes('BG')){
                                                        text+=`<div class="custom_fare_cls"><i class="fas fa-suitcase"></i><span style="font-weight:500;" class="copy_suitcase_details"> `+airline_pick_list[i].segments[j].fares[k].fare_details[l].amount+` `+airline_pick_list[i].segments[j].fares[k].fare_details[l].unit+`</span></div><br/>`;
                                                   }
                                                   else if(airline_pick_list[i].segments[j].fares[k].fare_details[l].detail_type == 'ML'){
                                                        text+=`<div class="custom_fare_cls"><i class="fas fa-utensils"></i><span style="font-weight:500;" class="copy_utensils_details"> `+airline_pick_list[i].segments[j].fares[k].fare_details[l].amount+` `+airline_pick_list[i].segments[j].fares[k].fare_details[l].unit+`</span></div><br/>`;
                                                   }else{
                                                        text+=`<div class="custom_fare_cls"><span style="font-weight:500;" class="copy_others_details">`+airline_pick_list[i].segments[j].fares[k].fare_details[l].amount+` `+airline_pick_list[i].segments[j].fares[k].fare_details[l].unit+`</span></div><br/>`;
                                                   }
                                               }
                                               break;
                                           }
                                       }
                                       text+=`
                                       </div>
                                   </div>
                                   <img src="/static/tt_website/images/icon/symbol/seat.png" style="height:16px; width:auto;">
                                   <span id="choose_seat_span_pick`+i+``+j+`"></span><br/>
                                   <span type="button" class="detail-link" onclick="open_cos_seat_class_pick('`+i+`','`+j+`')" style="font-weight:bold; font-size:14px; text-decoration:underline; cursor:pointer;">View RBD <i class="fas fa-eye"></i></span>
                                </div>

                               <div class="col-lg-12" style="top:-40px; left:-15px;">
                                    <button id="show_choose_seat_pick`+i+``+j+`" style="display:none;" type="button" class="primary-btn-white dropdown-toggle" data-toggle="dropdown"></button>
                                    <ul id="provider_seat_content_pick`+i+``+j+`" class="dropdown-menu" style="background:white; z-index:5; border:unset; padding:15px; border:1px solid #cdcdcd;">
                                       <div class="row">
                                           <div class="col-xs-9">
                                                <h6 class="mb-3"><img src="/static/tt_website/images/icon/symbol/seat.png" style="height:16px; width:auto;"> Class of Service</h6>
                                           </div>
                                           <div class="col-xs-3">
                                                <button type="button" class="close dropdown-close-seat">×</button>
                                           </div>
                                           <div class="col-lg-12">
                                               <div style="display:flex; overflow:auto;">`;

                                                   for(k in airline_pick_list[i].segments[j].fares){
                                                        text_seat_name_pick = '';
                                                        if(airline_pick_list[i].segments[j].fares[k].cabin_class != ''){
                                                            if(airline_pick_list[i].segments[j].fares[k].cabin_class == 'Y'){
                                                                text_seat_name_pick += ' (Economy)';
                                                            }else if(airline_pick_list[i].carrier_code_list.includes('QG') && airline_pick_list[i].segments[j].fares[k].cabin_class == 'W'){
                                                                text_seat_name_pick += ' (Royal Green)';
                                                            }else if(airline_pick_list[i].segments[j].fares[k].cabin_class == 'W'){
                                                                text_seat_name_pick += ' (Premium Economy)';
                                                            }else if(airline_pick_list[i].segments[j].fares[k].cabin_class == 'C'){
                                                                text_seat_name_pick += ' (Business)';
                                                            }else if(airline_pick_list[i].segments[j].fares[k].cabin_class == 'F'){
                                                                text_seat_name_pick += ' (First Class)';
                                                            }
                                                        }

                                                        if(k==airline_pick_list[i].segments[j].fare_pick){
                                                            text+=`
                                                            <label class="radio-label100">
                                                                <input id="journeypick`+airline_pick_list[i].airline_pick_sequence+`segment`+j+`fare" name="journeypick`+airline_pick_list[i].airline_pick_sequence+`segment`+j+`fare" type="radio" value="`+k+`" checked="checked" disabled>
                                                                <div class="div_label100">`;
                                                        }
                                                        else{
                                                            text+=`
                                                            <label class="radio-label100" style="color:#cdcdcd !important; cursor:not-allowed;">
                                                                <input id="journeypick`+airline_pick_list[i].airline_pick_sequence+`segment`+j+`fare" name="journeypick`+airline_pick_list[i].airline_pick_sequence+`segment`+j+`fare" type="radio" value="`+k+`" disabled>
                                                                <div class="div_label100" style="background:white !important; cursor: not-allowed; color: #cdcdcd;">`;

                                                                if(airline_request.adult + airline_request.child > airline_pick_list[i].segments[j].fares[k].available_count){
                                                                    text+=`
                                                                    <div class="center_vh">
                                                                        <img src="/static/tt_website/images/no_found/sold-out.png" style="width:100px; height:100px;"/>
                                                                    </div>`;
                                                                }
                                                        }

                                                        text+=`
                                                             <i class="fas fa-check check_label100"></i>
                                                             <span style="font-weight:bold; font-size:15px;">`+airline_pick_list[i].segments[j].fares[k].class_of_service+` `+text_seat_name_pick+`</span><br/>`;
                                                             if(airline_pick_list[i].segments[j].fares[k].fare_name)
                                                                 text+=`<span style="font-size:13px;">`+airline_pick_list[i].segments[j].fares[k].fare_name+`</span>`;
                                                             if(airline_pick_list[i].segments[j].fares[k].fare_basis_code)
                                                                 text+=`<span style="font-size:13px;">`+airline_pick_list[i].segments[j].fares[k].fare_basis_code+`</span>`;

                                                             if(airline_pick_list[i].segments[j].fares[k].description.length != 0){
                                                                  for(l in airline_pick_list[i].segments[j].fares[k].description){
                                                                      text += `<span style="font-size:13px; display:block;"><i class="fas fa-caret-right"></i> `+airline_pick_list[i].segments[j].fares[k].description[l]+`</span>`;
                                                                  }
                                                                  text+=`<br/>`;
                                                             }

                                                             if(airline_request.adult + airline_request.child > airline_pick_list[i].segments[j].fares[k].available_count){
                                                             }else{
                                                                text+=`Seat left: `+airline_pick_list[i].segments[j].fares[k].available_count;
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
                                                                                if(!['CHD', 'INF'].includes(airline_recommendations_journey[airline_recommendations_list.indexOf(airline_pick_list[i].journey_ref_id)].service_charge_summary[l].pax_type))
                                                                                    total_price = airline_recommendations_journey[airline_recommendations_list.indexOf(airline_pick_list[i].journey_ref_id)].service_charge_summary[l].total_price / airline_recommendations_journey[airline_recommendations_list.indexOf(airline_pick_list[i].journey_ref_id)].service_charge_summary[l].pax_count;
                                                                            }
                                                                            total_price -= total_price_pick;
                                                                        }
                                                                    }
                                                                    else{
                                                                        for(l in airline_pick_list[i].segments[j].fares[k].service_charge_summary){
                                                                            if(!['CHD', 'INF'].includes(airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].pax_type)){
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
                                                                        if(!['CHD', 'INF'].includes(airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].pax_type)){
                                                                            for(m in airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges)
                                                                                if(airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'tax' || airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'fare' || airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'roc')
                                                                                    total_price+= airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].amount;
                                                                            break;
                                                                        }
                                                                    }
                                                                }

                    //                                        var total_price = 0;
                    //                                        for(l in airline_pick_list[i].segments[j].fares[k].service_charge_summary){
                    //                                            if(airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].pax_type == 'ADT'){
                    //                                                for(m in airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges)
                    //                                                    if(airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'tax' || airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'fare' || airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'roc')
                    //                                                        total_price+= airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].amount;
                    //                                                break;
                    //                                            }
                    //                                        }

                                                             text+=`<div style="width:100%; text-align:right; right: 10px; bottom: 10px; position: absolute; margin-top:15px;">`;
                                                             if(total_price == 0){
                                                                if(airline_request.adult + airline_request.child > airline_pick_list[i].segments[j].fares[k].available_count){
                                                                     text+=`<span id="journeypick`+airline_pick_list[i].airline_pick_sequence+`segment`+j+`fare`+k+`" class="price_template" style="font-weight:bold; color:#cdcdcd;">SOLD OUT</span>`;
                                                                }else{
                                                                     if(k==airline_pick_list[i].segments[j].fare_pick){
                                                                         text+=`<span id="journeypick`+airline_pick_list[i].airline_pick_sequence+`segment`+j+`fare`+k+`" class="price_template" style="font-weight:bold;">`+airline_pick_list[i].currency+` `+getrupiah(total_price)+`</span>`;
                                                                     }else{
                                                                         text+=`<span id="journeypick`+airline_pick_list[i].airline_pick_sequence+`segment`+j+`fare`+k+`" class="price_template" style="font-weight:bold; color:#cdcdcd;">Choose to view Price<br/>Change first to choose</span>`;
                                                                     }
                                                                }
                                                            }
                                                            else{
                                                                if(k==airline_pick_list[i].segments[j].fare_pick){
                                                                     text+=`<span id="journeypick`+airline_pick_list[i].airline_pick_sequence+`segment`+j+`fare`+k+`" class="price_template" style="font-weight:bold;">`+airline_pick_list[i].currency+` `+getrupiah(total_price)+`</span>`;
                                                                }
                                                                else{
                                                                     text+=`<span id="journeypick`+airline_pick_list[i].airline_pick_sequence+`segment`+j+`fare`+k+`" class="price_template" style="font-weight:bold; color:#cdcdcd;">`+airline_pick_list[i].currency+` `+getrupiah(total_price)+`<br/>Change first to choose</span>`;
                                                               }
                                                            }
                                                            text+=`
                                                            </div>
                                                         </div>
                                                       </label>`;
                                                    }
                                                   text+=`
                                                </div>
                                            </div>
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
        </div>`;
    }
    document.getElementById('airline_ticket_pick').innerHTML = text;

   airline_info_text_pick = '';
   for(i in airline_pick_list){
       for(j in airline_pick_list[i].segments){
           airline_info_text_pick+=`
           <div class="row">
              <div class="col-lg-12 mb-2">
                   <div style="display:inline-flex;">
                       <div style="font-weight:bold; display:inline-block;">`;
                           try{
                               airline_info_text_pick+=`<img data-toggle="tooltip" class="airlines_provider_img_detail" alt="`+airline_carriers[0][airline_pick_list[i].segments[j].carrier_code].name+`" title="`+airline_carriers[0][airline_pick_list[i].segments[j].carrier_code].name+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+airline_pick_list[i].segments[j].carrier_code+`.png">`;
                           }catch(err){
                               airline_info_text_pick+=`<img data-toggle="tooltip" class="airlines_provider_img_detail" alt="`+airline_pick_list[i].segments[j].carrier_code+`" title="`+airline_pick_list[i].segments[j].carrier_code+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+airline_pick_list[i].segments[j].carrier_code+`.png">`;
                           }
                       airline_info_text_pick+=`
                       </div>
                       <div style="display:inline-block;;">`;
                           if(airline_pick_list[i].segments[j].carrier_code != airline_pick_list[i].segments[j].operating_airline_code && airline_pick_list[i].segments[j].operating_airline_code != ''){
                               try{
                                   airline_info_text_pick += `<span style="font-weight: 700; font-size:12px;">Operated:</span><br/><span style="font-weight: 700; font-size:12px;"> `+airline_carriers[0][airline_pick_list[i].segments[j].operating_airline_code].name+`</span><br/>`;
                               }catch(err){
                                   airline_info_text_pick += `<span style="font-weight: 700; font-size:12px;">Operated:</span><br/><span> `+airline_pick_list[i].segments[j].operating_airline_code+`</span><br/>`;
                               }
                           }

                           try{
                               airline_info_text_pick+=`<span style="font-size:12px;">`+airline_carriers[0][airline_pick_list[i].segments[j].carrier_code].name+`</span><br/>`;
                           }catch(err){
                               airline_info_text_pick+=`<span style="font-size:12px;">`+airline_pick_list[i].segments[j].carrier_code+`</span><br/>`;
                           }

                           try{
                               airline_info_text_pick+=`<span style="font-size:12px;">`+airline_pick_list[i].segments[j].carrier_name+`</span>`;
                           }catch(err){}

                           airline_info_text_pick+=`
                       </div>
                   </div>
                </div>
           </div>`;
       }
   }
   new jBox('Tooltip', {
       attach: '#airlines_info_temp_pick'+i,
       target: '#airlines_info_temp_pick'+i,
       theme: 'TooltipBorder',
       trigger: 'click',
       width: 200,
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
       content: airline_info_text_pick
   });


    if(is_show_breakdown_price){
        var price_breakdown = {};
        for(i in airline_pick_list){
            for(j in airline_pick_list[i].segments){
                for(k in airline_pick_list[i].segments[j].fares[airline_pick_list[i].segments[j].fare_pick].service_charge_summary){
                    for(l in airline_pick_list[i].segments[j].fares[airline_pick_list[i].segments[j].fare_pick].service_charge_summary[k].service_charges){
                        if(airline_pick_list[i].segments[j].fares[airline_pick_list[i].segments[j].fare_pick].service_charge_summary[k].service_charges[l].charge_type != 'RAC'){
                            if(!price_breakdown.hasOwnProperty(airline_pick_list[i].segments[j].fares[airline_pick_list[i].segments[j].fare_pick].service_charge_summary[k].service_charges[l].charge_type))
                                price_breakdown[airline_pick_list[i].segments[j].fares[airline_pick_list[i].segments[j].fare_pick].service_charge_summary[k].service_charges[l].charge_type] = 0;
                            price_breakdown[airline_pick_list[i].segments[j].fares[airline_pick_list[i].segments[j].fare_pick].service_charge_summary[k].service_charges[l].charge_type] += airline_pick_list[i].segments[j].fares[airline_pick_list[i].segments[j].fare_pick].service_charge_summary[k].service_charges[l].total;
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
                breakdown_text += airline_pick_list[i].currency + ' ' + getrupiah(price_breakdown[j]);
            }
            new jBox('Tooltip', {
                attach: '#fare_detail_pick'+airline_pick_list[i].airline_pick_sequence,
                target: '#fare_detail_pick'+airline_pick_list[i].airline_pick_sequence,
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
                                if(!['CHD', 'INF'].includes(airline_recommendations_journey[airline_recommendations_list.indexOf(airline_pick_list[i].journey_ref_id)].service_charge_summary[l].pax_type))
                                    temp_total_price_pick = airline_recommendations_journey[airline_recommendations_list.indexOf(airline_pick_list[i].journey_ref_id)].service_charge_summary[l].total_price / airline_recommendations_journey[airline_recommendations_list.indexOf(airline_pick_list[i].journey_ref_id)].service_charge_summary[l].pax_count;
                            }
                            temp_total_price_pick -= total_price_pick;
                        }
                    }else{
                        for(l in airline_pick_list[i].segments[j].fares[k].service_charge_summary){
                            if(!['CHD', 'INF'].includes(airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].pax_type)){
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
                        if(!['CHD', 'INF'].includes(airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].pax_type)){
                            for(m in airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges)
                                if(airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'tax' || airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'fare' || airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'roc')
                                    temp_total_price_pick+= airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].amount;
                            break;
                        }
                    }
                }

                if(k==airline_pick_list[i].segments[j].fare_pick){
                    var choose_span_pick = document.getElementById('choose_seat_span_pick'+i+j);
                    var fare_seat_span_pick = document.getElementById('fare_seat_class_pick'+i+j);
                    choose_span_pick.innerHTML = ''+airline_pick_list[i].segments[j].fares[k].class_of_service;
                    fare_seat_span_pick.innerHTML = ''+airline_pick_list[i].segments[j].fares[k].class_of_service;

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
                        choose_span_pick.innerHTML += ' <br/><span style="font-size:15px; font-weight:bold;">Choose All Flight Schedule</span>';
                   }else{
                        choose_span_pick.innerHTML += ' <br/><span style="font-size:15px; font-weight:bold;">'+airline_pick_list[i].currency + ' ' + getrupiah(temp_total_price_pick)+'</span>';
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
        }catch(err){
            console.log(err)
        }
        try{
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
        try{
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
        }catch(err){console.log(err)} // dari page admin
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
        is_roundtrip_combo = false;
        if(price_itinerary_temp.length != airline_request.departure.length){
            var total_journey = 0;
            for(i in price_itinerary_temp.journeys)
                total_journey++;
            if(total_journey != journey.length && airline_request.direction == 'RT')
                is_roundtrip_combo = true;
        }
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
                                    price_type[price_itinerary_temp[i].journeys[j].segments[k].fares[l].service_charge_summary[m].service_charges[n].charge_type.toLowerCase()] += price_itinerary_temp[i].journeys[j].segments[k].fares[l].service_charge_summary[m].service_charges[n].total;
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
        <div class="row" style="margin-bottom:5px;">
            <div class="col-lg-12 mb-3" style="border-bottom:1px solid #cdcdcd;">
                <h4 class="mb-3"> Price Detail</h4>
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
//                            $text +='Special Price\n';
                        }else if( i != 0 && j != 0){
                            text+=`<hr/>`;
                        }
                        flight_count++;
                        if(!is_roundtrip_combo)
                            $text +='‣ Flight '+flight_count+'\n';
                        else
                            $text +='‣ Roundtrip\n';
                        if(flight_count != 1){
                            text+=`<div class="col-lg-12"><hr/></div>`;
                        }
                        text += `
                        <div class="col-lg-12 mt-2">
                            <span class="span_link" style="display:none;" id="flight_title_up`+flight_count+`" onclick="show_hide_flight(`+flight_count+`);">`;
                            if(!is_roundtrip_combo)
                                text+=`Flight `+flight_count+` -`;
                            else
                                text+= 'Roundtrip - ';
                            text+=price_itinerary_temp[i].journeys[j].origin;
                            if(!is_roundtrip_combo)
                                text+=` <i class="fas fa-arrow-right"></i> `;
                            else
                                text+=` <i class="fas fa-arrows-alt-h"></i> `; // cek cenius
                            text+=price_itinerary_temp[i].journeys[j].destination+`
                                <i class="fas fa-chevron-up" style="float:right; color:`+color+`; font-size:18px;"></i>
                            </span>
                            <span class="span_link" id="flight_title_down`+flight_count+`" onclick="show_hide_flight(`+flight_count+`);">`;
                            if(!is_roundtrip_combo)
                                text+=`Flight `+flight_count+` -`;
                            else
                                text+= 'Roundtrip - '
                            text+=price_itinerary_temp[i].journeys[j].origin;
                            if(!is_roundtrip_combo)
                                text+=` <i class="fas fa-arrow-right"></i> `;
                            else
                                text+=` <i class="fas fa-arrows-alt-h"></i> `; // cek cenius
                            text+=price_itinerary_temp[i].journeys[j].destination+`
                                <i class="fas fa-chevron-down" style="float:right; color:`+color+`; font-size:18px;"></i>
                            </span>
                        </div>
                        <div class="col-lg-12 mb-2"><b>`+price_itinerary_temp[i].journeys[j].departure_date.split(' - ')[0]+`</b></div>`;


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
//                            $text += '‣ ';
                            try{
                                if(price_itinerary_temp[i].journeys[j].segments[k].carrier_code != price_itinerary_temp[i].journeys[j].segments[k].operating_airline_code && price_itinerary_temp[i].journeys[j].segments[k].operating_airline_code != ''){
                                    text+=`<span style="margin-top:15px; font-size:13px; font-weight:500;">Operated By `+airline_carriers[price_itinerary_temp[i].journeys[j].segments[k].operating_airline_code].name+` (`+price_itinerary_temp[i].journeys[j].segments[k].carrier_code+price_itinerary_temp[i].journeys[j].segments[k].carrier_number+`)</span><br/>`
                                    text+=`<img data-toggle="tooltip" alt="`+airline_carriers[price_itinerary_temp[i].journeys[j].segments[k].operating_airline_code].name+`" title="`+airline_carriers[price_itinerary_temp[i].journeys[j].segments[k].operating_airline_code].name+`" style="margin-top:10px; width:50px; height:50px; margin-right:10px;" src="`+static_path_url_server+`/public/airline_logo/`+price_itinerary_temp[i].journeys[j].segments[k].operating_airline_code+`.png"><span> </span>`;
                                }else{
                                    text+=`<span style="margin-top:15px; font-size:13px; font-weight:500;">`+airline_carriers[price_itinerary_temp[i].journeys[j].segments[k].carrier_code].name+` (`+price_itinerary_temp[i].journeys[j].segments[k].carrier_code+price_itinerary_temp[i].journeys[j].segments[k].carrier_number+`)</span><br/>`
                                    text+=`<img data-toggle="tooltip" alt="`+airline_carriers[price_itinerary_temp[i].journeys[j].segments[k].carrier_code].name+`" title="`+airline_carriers[price_itinerary_temp[i].journeys[j].segments[k].carrier_code].name+`" style="margin-top:10px; width:50px; height:50px; margin-right:10px;" src="`+static_path_url_server+`/public/airline_logo/`+price_itinerary_temp[i].journeys[j].segments[k].carrier_code+`.png"><span> </span>`;
                                }
                                $text += airline_carriers[price_itinerary_temp[i].journeys[j].segments[k].carrier_code].name + ' (' + price_itinerary_temp[i].journeys[j].segments[k].carrier_code + price_itinerary_temp[i].journeys[j].segments[k].carrier_number + ') ';
                            }catch(err){
                                // carrier tidak ketemu di dict
                                if(price_itinerary_temp[i].journeys[j].segments[k].carrier_code != price_itinerary_temp[i].journeys[j].segments[k].operating_airline_code && price_itinerary_temp[i].journeys[j].segments[k].operating_airline_code != ''){
                                    text+=`<span style="margin-top:15px; font-size:13px; font-weight:500;">Operated By`+price_itinerary_temp[i].journeys[j].segments[k].operating_airline_code+` (`+price_itinerary_temp[i].journeys[j].segments[k].carrier_code+price_itinerary_temp[i].journeys[j].segments[k].carrier_number+`)</span><br/>`
                                    text+=`<img data-toggle="tooltip" alt="`+price_itinerary_temp[i].journeys[j].segments[k].operating_airline_code+`" title="`+price_itinerary_temp[i].journeys[j].segments[k].operating_airline_code+`" style="margin-top:10px; width:50px; height:50px; margin-right:10px;" src="`+static_path_url_server+`/public/airline_logo/`+price_itinerary_temp[i].journeys[j].segments[k].operating_airline_code+`.png"><span> </span>`;
                                }else{
                                    text+=`<span style="margin-top:15px; font-size:13px; font-weight:500;">`+price_itinerary_temp[i].journeys[j].segments[k].carrier_code+` (`+price_itinerary_temp[i].journeys[j].segments[k].carrier_code+price_itinerary_temp[i].journeys[j].segments[k].carrier_number+`)</span><br/>`
                                    text+=`<img data-toggle="tooltip" alt="`+price_itinerary_temp[i].journeys[j].segments[k].carrier_code+`" title="`+price_itinerary_temp[i].journeys[j].segments[k].carrier_code+`" style="margin-top:10px; width:50px; height:50px; margin-right:10px;" src="`+static_path_url_server+`/public/airline_logo/`+price_itinerary_temp[i].journeys[j].segments[k].carrier_code+`.png"><span> </span>`;
                                }
                                $text += price_itinerary_temp[i].journeys[j].segments[k].carrier_code + ' (' + price_itinerary_temp[i].journeys[j].segments[k].carrier_code + price_itinerary_temp[i].journeys[j].segments[k].carrier_number + ') ';
                            }
                            for(l in price_itinerary_temp[i].journeys[j].segments[k].fares){
                                if(is_citilink && price_itinerary_temp[i].journeys[j].segments[k].fares[l].cabin_class == 'W')
                                    $text += airline_cabin_class_list['W1'];
                                else
                                    $text += airline_cabin_class_list[price_itinerary_temp[i].journeys[j].segments[k].fares[l].cabin_class];
                                $text += ' [' + price_itinerary_temp[i].journeys[j].segments[k].fares[l].class_of_service + ']';
                            }
                            //OPERATED BY
                            try{
                                if(price_itinerary_temp[i].journeys[j].segments[k].carrier_code != price_itinerary_temp[i].journeys[j].segments[k].operating_airline_code && price_itinerary_temp[i].journeys[j].segments[k].operating_airline_code != ''){
                                    $text += ' Operated By ' + airline_carriers[price_itinerary_temp[i].journeys[j].segments[k].operating_airline_code].name;
                                }
                            }catch(err){
                                if(price_itinerary_temp[i].journeys[j].segments[k].carrier_code != price_itinerary_temp[i].journeys[j].segments[k].operating_airline_code && price_itinerary_temp[i].journeys[j].segments[k].operating_airline_code != ''){
                                    $text += ' Operated By ' + price_itinerary_temp[i].journeys[j].segments[k].operating_airline_code;
                                }
                            }
                            $text_ssr = '';
                            $text_description = '';
                            for(l in price_itinerary_temp[i].journeys[j].segments[k].fares){
                                for(m in price_itinerary_temp[i].journeys[j].segments[k].fares[l].fare_details){
                                    if(price_itinerary_temp[i].journeys[j].segments[k].fares[l].fare_details[m].detail_type.includes('BG')){
                                        if($text_ssr != '')
                                            $text_ssr += ', '
                                        if(price_itinerary_temp[i].journeys[j].segments[k].fares[l].fare_details[m].detail_name != '' && price_itinerary_temp[i].journeys[j].segments[k].fares[l].fare_details[m].detail_name.includes('default_ssr') == false)
                                            $text_ssr += price_itinerary_temp[i].journeys[j].segments[k].fares[l].fare_details[m].detail_name;
                                        else
                                            $text_ssr += 'Baggage ' + price_itinerary_temp[i].journeys[j].segments[k].fares[l].fare_details[m].amount + ' ' + price_itinerary_temp[i].journeys[j].segments[k].fares[l].fare_details[m].unit
                                    }else if(price_itinerary_temp[i].journeys[j].segments[k].fares[l].fare_details[m].detail_type.includes('ML')){
                                        $text_ssr += 'Meal ' + price_itinerary_temp[i].journeys[j].segments[k].fares[l].fare_details[m].amount + ' ' + resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].fares[l].fare_details[m].unit + '\n';
                                    }
                                }
                                if(price_itinerary_temp[i].journeys[j].segments[k].carrier_type_name){
                                    if($text_ssr != '')
                                        $text_ssr += ', '
                                    $text_ssr += 'Aircraft ' + price_itinerary_temp[i].journeys[j].segments[k].carrier_type_name + '\n';
                                }
                                if(price_itinerary_temp[i].journeys[j].segments[k].fares[l].description.length > 0){
                                    $text_description += '- Description: ';
                                    for(m in price_itinerary_temp[i].journeys[j].segments[k].fares[l].description){
                                        if(m != 0)
                                            $text_description += ', ';
                                        $text_description += '• ' + price_itinerary_temp[i].journeys[j].segments[k].fares[l].description[m] + '\n';
                                    }
                                }
                            }

                            if($text_ssr)
                                $text += $text_ssr;
                            if($text_description)
                                $text += $text_description;


        //                    $text += '\n\n';
        //                    $text += '‣ Departure:\n';
        //                    $text += price_itinerary_temp[i].journeys[j].segments[k].origin_name + ' (' + price_itinerary_temp[i].journeys[j].segments[k].origin_city + ') ' + price_itinerary_temp[i].journeys[j].segments[k].departure_date + '\n';

        //                    $text += '\n';
        //                    $text += '‣ Arrival:\n';
        //                    $text += price_itinerary_temp[i].journeys[j].segments[k].destination_name + ' (' + price_itinerary_temp[i].journeys[j].segments[k].destination_city + ') '+price_itinerary_temp[i].journeys[j].segments[k].arrival_date +'\n\n';

                            // NEW //
                            $text += '- Departure: ' + price_itinerary_temp[i].journeys[j].segments[k].origin_city + ', ' + price_itinerary_temp[i].journeys[j].segments[k].origin_country + ' (' + price_itinerary_temp[i].journeys[j].segments[k].origin + ') ';
                            $text += price_itinerary_temp[i].journeys[j].segments[k].departure_date.split(' - ')[0] + ' at ' + price_itinerary_temp[i].journeys[j].segments[k].departure_date.split(' - ')[1] + '\n';
                            if(price_itinerary_temp[i].journeys[j].segments[k].origin_terminal)
                                $text += '- Terminal: ' + price_itinerary_temp[i].journeys[j].segments[k].origin_terminal + '\n';
                            $text += '- Arrival: ' + price_itinerary_temp[i].journeys[j].segments[k].destination_city  + ', ' + price_itinerary_temp[i].journeys[j].segments[k].destination_country + ' (' + price_itinerary_temp[i].journeys[j].segments[k].destination + ') ';
                            $text += price_itinerary_temp[i].journeys[j].segments[k].arrival_date.split(' - ')[0] + ' at ' + price_itinerary_temp[i].journeys[j].segments[k].arrival_date.split(' - ')[1] + '\n';
                            if(price_itinerary_temp[i].journeys[j].segments[k].arrival_terminal)
                                $text += '- Terminal: ' + price_itinerary_temp[i].journeys[j].segments[k].arrival_terminal + '\n';
                            $text += '\n';
                            // NEW //

//                            $text += price_itinerary_temp[i].journeys[j].segments[k].origin_city + ' (' + price_itinerary_temp[i].journeys[j].segments[k].origin + ') - ' + price_itinerary_temp[i].journeys[j].segments[k].destination_city + ' (' + price_itinerary_temp[i].journeys[j].segments[k].destination + ')\n';
//                            $text += 'Departure Date: '+price_itinerary_temp[i].journeys[j].segments[k].departure_date+'\n';
//                            if(price_itinerary_temp[i].journeys[j].segments[k].origin_terminal)
//                                $text += 'Terminal: ' + price_itinerary_temp[i].journeys[j].segments[k].origin_terminal + '\n';
//                            $text += 'Arrival Date: '+price_itinerary_temp[i].journeys[j].segments[k].arrival_date +'\n';
//                            if(price_itinerary_temp[i].journeys[j].segments[k].destination_terminal)
//                                $text += 'Terminal: ' + price_itinerary_temp[i].journeys[j].segments[k].destination_terminal + '\n';
//                            $text += '\n';
                            text+=`
                            <div class="row">
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                    <table style="width:100%">
                                        <tr>
                                            <td class="airport-code"><h5>`+price_itinerary_temp[i].journeys[j].segments[k].departure_date.split(' - ')[1]+`</h5></td>
                                            <td style="padding-left:15px;">
                                                <img src="/static/tt_website/images/icon/symbol/airlines-01.png" alt="Airline" style="width:20px; height:20px; margin-top:5px;"/>
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
                                text += `<div style="margin-bottom:15px;"><img src="/static/tt_website/images/icon/symbol/seat.png" style="height:16px; width:auto;"><span style="font-weight:800;">`;
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
                                text+=`</span>`;
                                for(l in price_itinerary_temp[i].journeys[j].segments[k].fares){
                                    for(m in price_itinerary_temp[i].journeys[j].segments[k].fares[l].fare_details){
                                        if(price_itinerary_temp[i].journeys[j].segments[k].fares[l].fare_details[m].detail_type.includes('BG')){
//                                            $text += '• Baggage ';
//                                            if(price_itinerary_temp[i].journeys[j].segments[k].fares[l].fare_details[m].detail_name != '' && price_itinerary_temp[i].journeys[j].segments[k].fares[l].fare_details[m].detail_name.includes('default_ssr') == false)
//                                                $text += price_itinerary_temp[i].journeys[j].segments[k].fares[l].fare_details[m].detail_name;
//                                            else
//                                                $text += price_itinerary_temp[i].journeys[j].segments[k].fares[l].fare_details[m].amount + ' ' + price_itinerary_temp[i].journeys[j].segments[k].fares[l].fare_details[m].unit
//                                            $text += '\n';
                                            text += `<br/><i class="fas fa-suitcase"></i><span style="font-weight:800;"> Baggage - `+price_itinerary_temp[i].journeys[j].segments[k].fares[l].fare_details[m].amount + ' ' + price_itinerary_temp[i].journeys[j].segments[k].fares[l].fare_details[m].unit+` </span>`;
                                        }else if(price_itinerary_temp[i].journeys[j].segments[k].fares[l].fare_details[m].detail_type.includes('ML')){
//                                            $text += '• Meal ' + price_itinerary_temp[i].journeys[j].segments[k].fares[l].fare_details[m].amount + ' ' + resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].fares[l].fare_details[m].unit + '\n';
                                            text += `<br/><i class="fas fa-suitcase"></i><span style="font-weight:800;"> Meal - `+price_itinerary_temp[i].journeys[j].segments[k].fares[l].fare_details[m].amount + ' ' + price_itinerary_temp[i].journeys[j].segments[k].fares[l].fare_details[m].unit+` </span>`;
                                        }

                                        if(price_itinerary_temp[i].journeys[j].segments[k].fares[l].fare_details[m].hasOwnProperty('detail_name')){
                                            if(price_itinerary_temp[i].journeys[j].segments[k].fares[l].fare_details[m].detail_name){
                                                text+=`
                                                <span id="fare_detail_name`+i+``+j+``+k+``+l+``+m+`">
                                                    <i class="fas fa-info-circle" onclick="print_fare_detail_name('fare_detail_name`+i+``+j+``+k+``+l+``+m+`', '`+price_itinerary_temp[i].journeys[j].segments[k].fares[l].fare_details[m].detail_name+`');" style="padding-left:5px; color:`+color+`; cursor:pointer; font-size:16px;"></i>
                                                </span>`;
                                            }
                                        }
                                    }
                                    if(price_itinerary_temp[i].journeys[j].segments[k].carrier_type_name){
//                                        $text += '• Aircraft: ' + price_itinerary_temp[i].journeys[j].segments[k].carrier_type_name + '\n';
                                        text += `<br/><i class="fas fa-plane"></i><span style="font-weight:800;"> Aircraft - `+price_itinerary_temp[i].journeys[j].segments[k].carrier_type_name+` </span>`;
                                    }
//                                    if(price_itinerary_temp[i].journeys[j].segments[k].fares[l].description.length > 0){
//                                        $text += 'Description: \n';
//                                        for(m in price_itinerary_temp[i].journeys[j].segments[k].fares[l].description){
//                                            $text += '• ' + price_itinerary_temp[i].journeys[j].segments[k].fares[l].description[m] + '\n';
//                                        }
//                                    }
                                }
                                text+=`</div>`;

                                if(k == price_itinerary_temp[i].journeys[j].segments.length-1){
//                                    if(provider_list_data[price_itinerary_temp[i].provider].is_post_issued_reschedule)
//                                        text+=`
//                                            <span style="font-weight:bold;"><i class="fas fa-check-circle" style="color:#4f9c64;"></i> Reschedule</span>`;

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
                        }
                        text+=`</div>`;

                        text+=`<div class="col-lg-12">`;
                        for(k in price_itinerary_temp[i].journeys[j].segments){
                            sub_total_count = 0;
                            if(price_itinerary_temp[i].journeys[j].segments[k].fares.length > 0 ){
                                for(l in price_itinerary_temp[i].journeys[j].segments[k].fares){
                                    if(price_itinerary_temp[i].journeys[j].segments[k].fares[l].service_charge_summary.length > 0){
                                        //price
                                        price = 0;
                                        //adult
                                        $text+= '‣ Price\n';
                                        for(pax_type in airline_price[price_counter]){
                                            pax_count = 0;
                                            pax_type_name = '';
                                            upsell_type_code = '';
                                            if(pax_type == 'ADT'){
                                                pax_count = airline_request.adult;
                                                pax_type_name = 'Adult';
                                                upsell_type_code = 'adult';
                                            }else if(pax_type == 'CHD'){
                                                pax_count = airline_request.child;
                                                pax_type_name = 'Child';
                                                upsell_type_code = 'child';
                                            }else if(pax_type == 'INF'){
                                                pax_count = airline_request.infant;
                                                pax_type_name = 'Infant';
                                                upsell_type_code = 'infant';
                                            }else if(pax_type == 'STU'){
                                                pax_count = airline_request.student;
                                                pax_type_name = 'Student';
                                                upsell_type_code = 'student';
                                            }else if(pax_type == 'LBR'){
                                                pax_count = airline_request.labour;
                                                pax_type_name = 'Labour';
                                                upsell_type_code = 'labour';
                                            }else if(pax_type == 'SEA'){
                                                pax_count = airline_request.seaman;
                                                pax_type_name = 'Seaman';
                                                upsell_type_code = 'seaman';
                                            }
                                            try{// PRINT PRICE
                                                try{
                                                    if(airline_price[price_counter][pax_type]['roc'] != null)
                                                        price = airline_price[price_counter][pax_type]['roc'];
                                                    if(airline_price[price_counter][pax_type].tax != null)
                                                        price += airline_price[price_counter][pax_type].tax;
                                                    if(upsell_price_dict.hasOwnProperty(upsell_type_code) && i == 0){ //upsell hanya di gunakan di provider pertama
                                                        price += upsell_price_dict[upsell_type_code];
                                                        commission_price -= upsell_price_dict[upsell_type_code];
                                                    }
                                                    if(upsell_price_dict_ssr.hasOwnProperty(upsell_type_code) && i == 0){ //upsell hanya di gunakan di provider pertama
                                                        price += upsell_price_dict_ssr[upsell_type_code];
                                                        commission_price -= upsell_price_dict[upsell_type_code];
                                                    }
                                                }catch(err){

                                                }
                                                commission = 0;
                                                if(airline_price[price_counter][pax_type]['rac'] != null)
                                                    commission = airline_price[price_counter][pax_type]['rac']
                                                commission_price += commission;
                                                total_price += (pax_count * airline_price[price_counter][pax_type]['fare']) + price;
                                                text+=`
                                                <div class="row mt-2">
                                                    <div class="col-lg-12">
                                                        <h6>`+pax_type_name+`</h6>
                                                        <div class="row">
                                                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                                                                <span style="font-size:13px; font-weight:500;"><b>`+pax_count+`x</b> Fare @ `+airline_price[price_counter][pax_type].currency +' '+getrupiah(Math.ceil(airline_price[price_counter][pax_type].fare))+`</span><br/>
                                                            </div>
                                                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                                                                <span style="font-size:13px; font-weight:500;">`+airline_price[price_counter][pax_type].currency+` `+getrupiah(Math.ceil(airline_price[price_counter][pax_type].fare * pax_count))+`</span>
                                                            </div>
                                                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                                                                <span style="font-size:13px; font-weight:500;">Tax & Charges</span>
                                                            </div>
                                                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                                                                <span style="font-size:13px; font-weight:500;">`+airline_price[price_counter][pax_type].currency+` `+getrupiah(Math.ceil(price))+`</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                               </div>`;
                                                $text += pax_count + ' '+pax_type_name+' @'+ airline_price[price_counter][pax_type].currency +' '+getrupiah(Math.ceil(airline_price[price_counter][pax_type].fare) + Math.ceil(price/pax_count))+'\n';
    //                                                $text += 'Adult Tax '+ airline_price[price_counter].ADT.currency +' '+getrupiah(Math.ceil(price))+'\n';
                                                sub_total_count+=Math.ceil((airline_price[price_counter][pax_type].fare * pax_count) +price);
                                                price = 0;
                                                total_price_provider.push({
                                                    'provider': price_itinerary_temp[i].provider,
                                                    'price': airline_price[price_counter][pax_type]
                                                });
                                            }catch(err){

                                            }
                                        }
                                        text+=`
                                        <div class="row mt-2 mb-2">
                                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                                                <span style="font-size:13px; font-weight:bold;">Subtotal</span>
                                            </div>
                                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                                                <span style="font-size:13px; font-weight:bold;">`+currency+` `+getrupiah(Math.ceil(sub_total_count))+`</span>
                                            </div>
                                            <div class="col-lg-12 mb-3"></div>
                                        </div>`;

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
                <label>Ancillary Fee</label><br/>
            </div>
            <div class="col-lg-5" style="text-align:right;">`;
            currency = '';
            for(x in airline_price){
                for(y in airline_price[x]){
                    currency = airline_price[x][y].currency;
                    if(currency)
                        break;
                }
                if(currency)
                    break;
            }
            text+=`
                <label id="additional_price">`+currency+` `+getrupiah(additional_price)+`</label><br/>`;

            text+=`
                <input type="hidden" name="additional_price" id="additional_price_hidden"/>
            </div>`;
//            try{
//                upsell_price = 0;
//                if(Object.keys(upsell_price_dict).length != 0){
//                    for(x in upsell_price_dict)
//                        upsell_price += upsell_price_dict[x];
//                }
//            }catch(err){
//                console.log(err); // error kalau ada element yg tidak ada
//            }


            //contact person pax //
            if(typeof(passengers) !== 'undefined'){
                if(passengers.hasOwnProperty('contact')){
                    $text += '‣ Contact Person:\n'
                    for(x in passengers['contact']){
                        $text += '- ' + passengers['contact'][x].title + ' ' + passengers['contact'][x].first_name + ' ' + passengers['contact'][x].last_name + '\n';
                        $text += 'Email: ' + passengers['contact'][x].email + '\n';
                        $text += 'Phone: ' + passengers['contact'][x].calling_code + ' - ' + passengers['contact'][x].mobile + '\n\n';
                    }
                }
                total_pax = airline_request.adult + airline_request.child + airline_request.infant;
                if(airline_request.hasOwnProperty('labour'))
                    total_pax += airline_request.labour;
                if(airline_request.hasOwnProperty('seaman'))
                    total_pax += airline_request.seaman;
                if(airline_request.hasOwnProperty('student'))
                    total_pax += airline_request.student;
                $text += '‣ Passenger'
                if(total_pax > 1)
                    $text += 's';
                $text += ':\n';
                if(passengers.hasOwnProperty('adult')){
                    for(x in passengers['adult']){
                        $text += '• ' + passengers['adult'][x].title + ' ' + passengers['adult'][x].first_name + ' ' + passengers['adult'][x].last_name + ' ';
                        if(passengers['adult'][x].identity_type){
                            $text += '- ' + passengers['adult'][x].identity_type.substr(0,1).toUpperCase() + passengers['adult'][x].identity_type.substr(1,passengers['adult'][x].identity_type.length).toLowerCase() + ': ';
                            $text += passengers['adult'][x].identity_number.substr(0,1);
                            for(z=0;z<passengers['adult'][x].identity_number.length-4;z++)
                                $text += '-'
                            $text += passengers['adult'][x].identity_number.substr(passengers['adult'][x].identity_number.length-3,passengers['adult'][x].identity_number.length)
                        }
                        for(y in passengers['adult'][x].ff_numbers){
                            if(y == 0)
                                $text += '- ';
                            if(y != 0)
                                $text += ',';
                            $text += passengers['adult'][x].ff_numbers[y].ff_code + ': ';
                            $text += passengers['adult'][x].ff_numbers[y].ff_number.substr(0,1);
                            for(z=0;z<passengers['adult'][x].ff_numbers[y].ff_number.length-4;z++)
                                $text += '*'
                            $text += passengers['adult'][x].ff_numbers[y].ff_number.substr(passengers['adult'][x].ff_numbers[y].ff_number.length-3,passengers['adult'][x].ff_numbers[y].ff_number.length);
                        }
                        $text += '\n';
                        if(passengers['adult'][x].hasOwnProperty('ssr_list')){
                            for(y in passengers['adult'][x].ssr_list){
                                $text += '- ' + passengers['adult'][x].ssr_list[y].origin + '-' + passengers['adult'][x].ssr_list[y].destination + ' ';
                                if(passengers['adult'][x].ssr_list[y].availability_type == 'baggage'){
                                    $text += 'Baggage: ';
                                }else if(passengers['adult'][x].ssr_list[y].availability_type == 'meal'){
                                    $text += 'Meal: ';
                                }else if(passengers['adult'][x].ssr_list[y].availability_type == 'seat'){
                                    $text += 'Seat: ';
                                }else if(passengers['adult'][x].ssr_list[y].availability_type == 'wheelchair'){
                                    $text += 'Wheelchair';
                                }else{
                                    $text += passengers['adult'][x].ssr_list[y].availability_type.substr(0,1).toUpperCase() + passengers['adult'][x].ssr_list[y].availability_type.substr(1,passengers['adult'].ssr_list[y].availability_type.length).toLowerCase();
                                }
                                $text += passengers['adult'][x].ssr_list[y].name + '\n';
                            }
                        }
                        if(passengers['adult'][x].hasOwnProperty('seat_list')){
                            for(y in passengers['adult'][x].seat_list){
                                if(passengers['adult'][x].seat_list[y].seat_name){
                                    $text += '- ' + passengers['adult'][x].seat_list[y].segment_code + ' Seat: ' + passengers['adult'][x].seat_list[y].seat_name + '\n';
                                }
                            }
                        }
                        $text += '\n';
                    }
                }
                if(passengers.hasOwnProperty('child')){
                    for(x in passengers['child']){
                        $text += '• ' + passengers['child'][x].title + ' ' + passengers['child'][x].first_name + ' ' + passengers['child'][x].last_name + ' ';
                        if(passengers['child'][x].identity_type){
                            $text += '- ' + passengers['child'][x].identity_type.substr(0,1).toUpperCase() + passengers['child'][x].identity_type.substr(1,passengers['child'][x].identity_type.length).toLowerCase() + ': ';
                            $text += passengers['child'][x].identity_number.substr(0,1);
                            for(z=0;z<passengers['child'][x].identity_number.length-4;z++)
                                $text += '-'
                            $text += passengers['child'][x].identity_number.substr(passengers['child'][x].identity_number.length-3,passengers['child'][x].identity_number.length)
                        }
                        for(y in passengers['child'][x].ff_numbers){
                            if(y == 0)
                                $text += '- ';
                            if(y != 0)
                                $text += ',';
                            $text += passengers['child'][x].ff_numbers[y].ff_code + ': ';
                            $text += passengers['child'][x].ff_numbers[y].ff_number.substr(0,1);
                            for(z=0;z<passengers['child'][x].ff_numbers[y].ff_number.length-4;z++)
                                $text += '*'
                            $text += passengers['child'][x].ff_numbers[y].ff_number.substr(passengers['child'][x].ff_numbers[y].ff_number.length-3,passengers['child'][x].ff_numbers[y].ff_number.length);
                        }
                        $text += '\n';
                        if(passengers['child'][x].hasOwnProperty('ssr_list')){
                            for(y in passengers['child'][x].ssr_list){
                                $text += '- ' + passengers['child'][x].ssr_list[y].origin + '-' + passengers['child'][x].ssr_list[y].destination + ' ';
                                if(passengers['child'][x].ssr_list[y].availability_type == 'baggage'){
                                    $text += 'Baggage: ';
                                }else if(passengers['child'][x].ssr_list[y].availability_type == 'meal'){
                                    $text += 'Meal: ';
                                }else if(passengers['child'][x].ssr_list[y].availability_type == 'seat'){
                                    $text += 'Seat: ';
                                }else if(passengers['child'][x].ssr_list[y].availability_type == 'wheelchair'){
                                    $text += 'Wheelchair';
                                }else{
                                    $text += passengers['child'][x].ssr_list[y].availability_type.substr(0,1).toUpperCase() + passengers['child'][x].ssr_list[y].availability_type.substr(1,passengers['child'].ssr_list[y].availability_type.length).toLowerCase();
                                }
                                $text += passengers['child'][x].ssr_list[y].name + '\n';
                            }
                        }
                        if(passengers['child'][x].hasOwnProperty('seat_list')){
                            for(y in passengers['child'][x].seat_list){
                                if(passengers['child'][x].seat_list[y].seat_name){
                                    $text += '- ' + passengers['child'][x].seat_list[y].segment_code + ' Seat: ' + passengers['child'][x].seat_list[y].seat_name + '\n';
                                }
                            }
                        }
                        $text += '\n';
                    }
                }
                if(passengers.hasOwnProperty('infant')){
                    for(x in passengers['infant']){
                        $text += '• ' + passengers['infant'][x].title + ' ' + passengers['infant'][x].first_name + ' ' + passengers['infant'][x].last_name + ' ';
                        if(passengers['infant'][x].identity_type)
                            $text += '- ' + passengers['infant'][x].identity_type + ': ' + passengers['infant'][x].identity_number + ' ';
                        $text += '\n';
                    }
                }

                if(passengers.hasOwnProperty('student')){
                    for(x in passengers['student']){
                        $text += '- ' + passengers['student'][x].title + ' ' + passengers['student'][x].first_name + ' ' + passengers['student'][x].last_name + ' ';
                        if(passengers['student'][x].identity_type){
                            $text += '- ' + passengers['student'][x].identity_type.substr(0,1).toUpperCase() + passengers['student'][x].identity_type.substr(1,passengers['student'][x].identity_type.length).toLowerCase() + ': ';
                            $text += passengers['student'][x].identity_number.substr(0,1);
                            for(z=0;z<passengers['student'][x].identity_number.length-4;z++)
                                $text += '-'
                            $text += passengers['student'][x].identity_number.substr(passengers['student'][x].identity_number.length-3,passengers['student'][x].identity_number.length)
                        }
                        for(y in passengers['student'][x].ff_numbers){
                            if(y == 0)
                                $text += '- ';
                            if(y != 0)
                                $text += ',';
                            $text += passengers['student'][x].ff_numbers[y].ff_code + ': ';
                            $text += passengers['student'][x].ff_numbers[y].ff_number.substr(0,1);
                            for(z=0;z<passengers['student'][x].ff_numbers[y].ff_number.length-4;z++)
                                $text += '*'
                            $text += passengers['student'][x].ff_numbers[y].ff_number.substr(passengers['student'][x].ff_numbers[y].ff_number.length-3,passengers['student'][x].ff_numbers[y].ff_number.length);
                        }
                        if(passengers['student'][x].hasOwnProperty('ssr_list')){
                            for(y in passengers['student'][x].ssr_list){
                                $text += '- ' + passengers['student'][x].ssr_list[y].origin + '-' + passengers['student'][x].ssr_list[y].destination + ' ';
                                if(passengers['student'][x].ssr_list[y].availability_type == 'baggage'){
                                    $text += 'Baggage: ';
                                }else if(passengers['student'][x].ssr_list[y].availability_type == 'meal'){
                                    $text += 'Meal: ';
                                }else if(passengers['student'][x].ssr_list[y].availability_type == 'seat'){
                                    $text += 'Seat: ';
                                }else if(passengers['student'][x].ssr_list[y].availability_type == 'wheelchair'){
                                    $text += 'Wheelchair';
                                }else{
                                    $text += passengers['student'][x].ssr_list[y].availability_type.substr(0,1).toUpperCase() + passengers['student'][x].ssr_list[y].availability_type.substr(1,passengers['student'].ssr_list[y].availability_type.length).toLowerCase();
                                }
                                $text += passengers['student'][x].ssr_list[y].name + '\n';
                            }
                        }
                        if(passengers['student'][x].hasOwnProperty('seat_list')){
                            for(y in passengers['student'][x].seat_list){
                                if(passengers['student'][x].seat_list[y].seat_name){
                                    $text += '- ' + passengers['student'][x].seat_list[y].segment_code + ' Seat: ' + passengers['student'][x].seat_list[y].seat_name + '\n';
                                }
                            }
                        }
                        $text += '\n';
                    }
                }

                if(passengers.hasOwnProperty('labour')){
                    for(x in passengers['labour']){
                        $text += '- ' + passengers['labour'][x].title + ' ' + passengers['labour'][x].first_name + ' ' + passengers['labour'][x].last_name + ' ';
                        if(passengers['labour'][x].identity_type){
                            $text += '- ' + passengers['labour'][x].identity_type.substr(0,1).toUpperCase() + passengers['labour'][x].identity_type.substr(1,passengers['labour'][x].identity_type.length).toLowerCase() + ': ';
                            $text += passengers['labour'][x].identity_number.substr(0,1);
                            for(z=0;z<passengers['labour'][x].identity_number.length-4;z++)
                                $text += '-'
                            $text += passengers['labour'][x].identity_number.substr(passengers['labour'][x].identity_number.length-3,passengers['labour'][x].identity_number.length)
                        }
                        for(y in passengers['labour'][x].ff_numbers){
                            if(y == 0)
                                $text += '- ';
                            if(y != 0)
                                $text += ',';
                            $text += passengers['labour'][x].ff_numbers[y].ff_code + ': ';
                            $text += passengers['labour'][x].ff_numbers[y].ff_number.substr(0,1);
                            for(z=0;z<passengers['labour'][x].ff_numbers[y].ff_number.length-4;z++)
                                $text += '*'
                            $text += passengers['labour'][x].ff_numbers[y].ff_number.substr(passengers['labour'][x].ff_numbers[y].ff_number.length-3,passengers['labour'][x].ff_numbers[y].ff_number.length);
                        }
                        if(passengers['labour'][x].hasOwnProperty('ssr_list')){
                            for(y in passengers['labour'][x].ssr_list){
                                $text += '- ' + passengers['labour'][x].ssr_list[y].origin + '-' + passengers['labour'][x].ssr_list[y].destination + ' ';
                                if(passengers['labour'][x].ssr_list[y].availability_type == 'baggage'){
                                    $text += 'Baggage: ';
                                }else if(passengers['labour'][x].ssr_list[y].availability_type == 'meal'){
                                    $text += 'Meal: ';
                                }else if(passengers['labour'][x].ssr_list[y].availability_type == 'seat'){
                                    $text += 'Seat: ';
                                }else if(passengers['labour'][x].ssr_list[y].availability_type == 'wheelchair'){
                                    $text += 'Wheelchair';
                                }else{
                                    $text += passengers['labour'][x].ssr_list[y].availability_type.substr(0,1).toUpperCase() + passengers['labour'][x].ssr_list[y].availability_type.substr(1,passengers['labour'].ssr_list[y].availability_type.length).toLowerCase();
                                }
                                $text += passengers['labour'][x].ssr_list[y].name + '\n';
                            }
                        }
                        if(passengers['labour'][x].hasOwnProperty('seat_list')){
                            for(y in passengers['labour'][x].seat_list){
                                if(passengers['labour'][x].seat_list[y].seat_name){
                                    $text += '- ' + passengers['labour'][x].seat_list[y].segment_code + ' Seat: ' + passengers['labour'][x].seat_list[y].seat_name + '\n';
                                }
                            }
                        }
                        $text += '\n';
                    }
                }

                if(passengers.hasOwnProperty('seaman')){
                    for(x in passengers['seaman']){
                        $text += '- ' + passengers['seaman'][x].title + ' ' + passengers['seaman'][x].first_name + ' ' + passengers['seaman'][x].last_name + ' ';
                        if(passengers['seaman'][x].identity_type){
                            $text += '- ' + passengers['seaman'][x].identity_type.substr(0,1).toUpperCase() + passengers['seaman'][x].identity_type.substr(1,passengers['seaman'][x].identity_type.length).toLowerCase() + ': ';
                            $text += passengers['seaman'][x].identity_number.substr(0,1);
                            for(z=0;z<passengers['seaman'][x].identity_number.length-4;z++)
                                $text += '-'
                            $text += passengers['seaman'][x].identity_number.substr(passengers['seaman'][x].identity_number.length-3,passengers['seaman'][x].identity_number.length)
                        }
                        for(y in passengers['seaman'][x].ff_numbers){
                            if(y == 0)
                                $text += '- ';
                            if(y != 0)
                                $text += ',';
                            $text += passengers['seaman'][x].ff_numbers[y].ff_code + ': ';
                            $text += passengers['seaman'][x].ff_numbers[y].ff_number.substr(0,1);
                            for(z=0;z<passengers['seaman'][x].ff_numbers[y].ff_number.length-4;z++)
                                $text += '*'
                            $text += passengers['seaman'][x].ff_numbers[y].ff_number.substr(passengers['seaman'][x].ff_numbers[y].ff_number.length-3,passengers['seaman'][x].ff_numbers[y].ff_number.length);
                        }
                        if(passengers['seaman'][x].hasOwnProperty('ssr_list')){
                            for(y in passengers['seaman'][x].ssr_list){
                                $text += '- ' + passengers['seaman'][x].ssr_list[y].origin + '-' + passengers['seaman'][x].ssr_list[y].destination + ' ';
                                if(passengers['seaman'][x].ssr_list[y].availability_type == 'baggage'){
                                    $text += 'Baggage: ';
                                }else if(passengers['seaman'][x].ssr_list[y].availability_type == 'meal'){
                                    $text += 'Meal: ';
                                }else if(passengers['seaman'][x].ssr_list[y].availability_type == 'seat'){
                                    $text += 'Seat: ';
                                }else if(passengers['seaman'][x].ssr_list[y].availability_type == 'wheelchair'){
                                    $text += 'Wheelchair';
                                }else{
                                    $text += passengers['seaman'][x].ssr_list[y].availability_type.substr(0,1).toUpperCase() + passengers['seaman'][x].ssr_list[y].availability_type.substr(1,passengers['seaman'].ssr_list[y].availability_type.length).toLowerCase();
                                }
                                $text += passengers['seaman'][x].ssr_list[y].name + '\n';
                            }
                        }
                        if(passengers['seaman'][x].hasOwnProperty('seat_list')){
                            for(y in passengers['seaman'][x].seat_list){
                                if(passengers['seaman'][x].seat_list[y].seat_name){
                                    $text += '- ' + passengers['seaman'][x].seat_list[y].segment_code + 'Seat: ' + passengers['seaman'][x].seat_list[y].seat_name + '\n';
                                }
                            }
                        }
                        $text += '\n';
                    }
                }
                $text += '\n';
            }


            if(additional_price != 0)
                $text += '‣ Ancillary Fee: ' + currency + ' ' +getrupiah(additional_price) + '\n';
            try{
                if(total_discount != 0){
                    text+=`<div class="col-lg-7" style="text-align:left;">
                        <label>Discount</label><br/>
                    </div>
                    <div class="col-lg-5" style="text-align:right;">`;
                    text+=`
                        <label>`+currency+` `+getrupiah(total_discount)+`</label><br/>`;
                    text+=`</div>`;
                    $text += '‣ Discount: ' + currency + ' ' +getrupiah(total_discount*-1) + '\n';
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
//                grand_total_price += upsell_price;
            }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
            }
            text+=`
                    <span style="font-size:14px; font-weight:bold;`;
            if(is_show_breakdown_price)
                text+='cursor:pointer;';
            text+=`" id="total_price";><b> `+currency+` `+getrupiah(grand_total_price+total_discount)+`</b>`;
            if(is_show_breakdown_price)
                text+=`<i class="fas fa-chevron-down"></i>`;
            text+=`</span><br/>`;
            text+=`
            </div>`;
            if(typeof(currency_rate_data) !== 'undefined' && currency_rate_data.result.is_show && grand_total_price){
                if(user_login.hasOwnProperty('co_ho_seq_id') && currency_rate_data.result.response.agent.hasOwnProperty(user_login.co_ho_seq_id)){ // buat o3
                    for(k in currency_rate_data.result.response.agent[user_login.co_ho_seq_id]){
                        try{
                            if(currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].base_currency == currency){
                                price_convert = ((grand_total_price+total_discount)/currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].rate).toFixed(2);
                                if(price_convert%1 == 0)
                                    price_convert = parseInt(price_convert);
                                text+=`
                                    <div class="col-lg-12" style="text-align:right;">
                                        <span style="font-size:14px; font-weight:bold;" id="total_price_`+k+`"><b> Estimated `+k+` `+getrupiah(price_convert)+`</b></span><br/>
                                    </div>`;
                            }
                        }catch(err){
                            console.log(err);
                        }
                    }
                }
            }
            text+=`
        </div>`;
        if(document.URL.split('/')[document.URL.split('/').length-2] == 'review'){
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
                        if(price_arr_repricing.hasOwnProperty(passengers[i][j].pax_type) == false){
                            price_arr_repricing[passengers[i][j].pax_type] = {}
                            pax_type_repricing.push([passengers[i][j].pax_type, passengers[i][j].pax_type]);
                        }
                        price_arr_repricing[passengers[i][j].pax_type][passengers[i][j].first_name +passengers[i][j].last_name] = {
                            'Fare': 0,
                            'Tax': 0,
                            'Repricing': 0
                        }
                    }
                }
            }
            //repricing
            text_repricing = '';
            for(k in price_arr_repricing){
                for(l in price_arr_repricing[k]){
                    text_repricing += `
                    <div class="col-lg-12">
                        <div style="padding:5px;" class="row" id="adult">
                            <div class="col-lg-12" id="`+j+`_`+k+`"><h6>`+l+`</h6></div>
                            <div hidden id="`+l+`_price">`+getrupiah(price_arr_repricing[k][l].Fare + price_arr_repricing[k][l].Tax)+`</div>`;
                            if(price_arr_repricing[k][l].Repricing == 0)
                                text_repricing+=`<div class="col-lg-4" id="`+l+`_repricing"><b>Repricing </b><br/>-</div>`;
                            else
                                text_repricing+=`<div class="col-lg-4" id="`+l+`_repricing"><b>Repricing </b><br/><i>`+getrupiah(price_arr_repricing[k][l].Repricing)+`</i></div>`;
                            text_repricing+=`<div hidden id="`+l+`_total">`+getrupiah(price_arr_repricing[k][l].Fare + price_arr_repricing[k][l].Tax + price_arr_repricing[k][l].Repricing)+`</div>
                        </div>
                    </div>`;
                }
            }
            text_repricing += `<div id='repricing_button' class="col-lg-12" style="text-align:center;"></div>`;
            document.getElementById('repricing_div').innerHTML = text_repricing;

            text_repricing2 = '';
            for(k in price_arr_repricing){
                for(l in price_arr_repricing[k]){
                    text_repricing2 += `
                    <div class="col-lg-12">
                        <div style="padding:5px;" class="row" id="adult">
                            <div class="col-lg-12" id="`+j+`_`+k+`"><h6>`+l+`</h6></div>
                            <div hidden id="`+l+`_price_ssr">`+getrupiah(price_arr_repricing[k][l].Fare + price_arr_repricing[k][l].Tax)+`</div>`;
                            if(price_arr_repricing[k][l].Repricing == 0)
                                text_repricing2+=`<div class="col-lg-4" id="`+l+`_repricing_ssr"><b>Repricing </b><br/>-</div>`;
                            else
                                text_repricing2+=`<div class="col-lg-4" id="`+l+`_repricing_ssr"><b>Repricing </b><br/><i>`+getrupiah(price_arr_repricing[k][l].Repricing)+`</i></div>`;
                            text_repricing2+=`<div hidden id="`+l+`_total_ssr">`+getrupiah(price_arr_repricing[k][l].Fare + price_arr_repricing[k][l].Tax + price_arr_repricing[k][l].Repricing)+`</div>
                        </div>
                    </div>`;
                }
            }
            text_repricing2 += `<div id='ssr_repricing_button' class="col-lg-12" style="text-align:center;"></div>`;
            document.getElementById('ssr_repricing_div').innerHTML = text_repricing2;
            //repricing
        }
        if(document.URL.split('/')[document.URL.split('/').length-2] == 'review' && user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false){
            text+=`<div style="text-align:right;"><img src="/static/tt_website/images/icon/symbol/upsell_price.png" alt="Bank" style="width:auto; height:25px; cursor:pointer;" onclick="show_repricing();"/></div>`;
        }
        text+=`
        <div class="row">
            <div class="col-lg-12" style="padding-bottom:10px;">
                <hr/>
                <span style="font-size:14px; font-weight:bold;"><i class="fas fa-share-alt"></i> Share This on:</span><br/>`;

                $text += '‣ Grand Total: '+currency+' '+ getrupiah(grand_total_price + total_discount) + '\nPrices and availability may change at any time';

                share_data();
                var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                if (isMobile) {
                    text+=`
                        <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" alt="Whatsapp" src="/static/tt_website/images/logo/apps/whatsapp.png"/></a>
                        <a href="line://msg/text/`+ $text_share +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" alt="Line" src="/static/tt_website/images/logo/apps/line.png"/></a>
                        <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" alt="Telegram" src="/static/tt_website/images/logo/apps/telegram.png"/></a>
                        <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" alt="Email" src="/static/tt_website/images/logo/apps/email.png"/></a>`;
                } else {
                    text+=`
                        <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" alt="Whatsapp" src="/static/tt_website/images/logo/apps/whatsapp.png"/></a>
                        <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" alt="Line" src="/static/tt_website/images/logo/apps/line.png"/></a>
                        <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" alt="Telegram" src="/static/tt_website/images/logo/apps/telegram.png"/></a>
                        <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" alt="Email" src="/static/tt_website/images/logo/apps/email.png"/></a>`;
                }
            text+=`
            </div>
        </div>`;
        if(user_login.co_agent_frontend_security.includes('see_commission') == true && user_login.co_agent_frontend_security.includes("corp_limitation") == false && user_login.co_agent_frontend_security.includes('b2c_limitation') == false){
            // tidak ikut default karena ada notes untuk YPM lionair
            text+=`
            <div class="row" id="show_commission" style="display:block;">
                <div class="col-lg-12 col-xs-12">
                    <div class="alert alert-success">
                        <div style="text-align:center;">
                            <span style="font-size:13px; font-weight: bold;">YPM: `+currency+` `+getrupiah(commission_price*-1)+`</span>
                        </div>`;
            text_notes = '';
            for(x in airline_pick){
                for(y in airline_pick[x].journeys){
                    for(z in airline_pick[x].journeys[y].segments){
                        if(airline_pick[x].journeys[y].segments[z].carrier_code.includes('JT') ||
                           airline_pick[x].journeys[y].segments[z].carrier_code.includes('IW') ||
                           airline_pick[x].journeys[y].segments[z].carrier_code.includes('ID') ||
                           airline_pick[x].journeys[y].segments[z].carrier_code.includes('IU') ||
                           airline_pick[x].journeys[y].segments[z].carrier_code.includes('OD'))
                           text_notes = '* Lion Air YPM is shown after booking';
                        if(text_notes != '')
                            break;
                    }
                    if(text_notes != '')
                        break;
                }
                if(text_notes != '')
                    break;
            }
            if(text_notes == '')
                text_notes = '* Please mark up the price first'
            if(commission_price == 0)
                text +=`
                        <div style="text-align:left;">
                            <span style="font-size:13px;font-weight: bold;color:red">`+text_notes+`</span>
                        </div>`;
            text+=`</div>
                </div>
            </div>`;
        }
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
        // after sales post-booking dan post-issued
        $text = '';
        text += `
        <div class="row" style="margin-bottom:5px;">
            <div class="col-lg-12 mb-3" style="border-bottom:1px solid #cdcdcd;">
                <h4 class="mb-3"> Price Detail</h4>
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
                                                <img src="/static/tt_website/images/icon/symbol/airlines-01.png" alt="Airline" style="width:20px; height:20px; margin-top:5px;"/>
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
        if(typeof(currency) === 'undefined'){
            currency = ''
            for(i in airline_get_detail.passengers[0].sale_service_charges){
                for(j in airline_get_detail.passengers){
                    for(k in airline_get_detail.passengers[j].sale_service_charges){
                        for(l in airline_get_detail.passengers[j].sale_service_charges[k]){
                            currency = airline_get_detail.passengers[j].sale_service_charges[k][l].currency;
                            break;
                        }
                        break;
                    }
                    break;
                }
            }
        }
        if(!currency){
            try{
                for(i in passengers){
                    if(passengers[i].hasOwnProperty('seat_list'))
                        for(j in passengers[i].seat_list){
                            if(!currency)
                                currency = passengers[i].seat_list[j].currency;
                        }
                }
                if(!currency){
                    for(i in passengers_ssr){
                        if(passengers_ssr[i].hasOwnProperty('seat_list')){
                            for(j in passengers_ssr[i].seat_list){
                                if(!currency)
                                    currency = passengers_ssr[i].seat_list[j].currency;
                            }
                        }else if(passengers_ssr[i].hasOwnProperty('ssr_list')){
                            for(j in passengers_ssr[i].ssr_list){
                                if(!currency)
                                    currency = passengers_ssr[i].ssr_list[j].currency;
                            }
                        }
                    }
                }
            }catch(err){

            }
        }
        text += `
        <div class="row">
            <div class="col-lg-7" style="text-align:left;">
                <label>Ancillary Fee</label><br/>
            </div>
            <div class="col-lg-5" style="text-align:right;">`;
            text+=`
                <label id="additional_price">`+currency+` `+getrupiah(additional_price)+`</label><br/>`;

            text+=`
            </div>
            <div class="col-lg-7" style="text-align:left;">
                <span style="font-size:14px; font-weight:bold;"><b>Total</b></span><br/>
            </div>
            <div class="col-lg-5" style="text-align:right; padding-bottom:10px;">`;
            text+=`
                <span style="font-size:14px; font-weight:bold;" id="total_price"><b>`+currency+` `+getrupiah(total_price+additional_price)+`</b></span><br/>`;
            text+=`
            </div>`;
            if(typeof(currency_rate_data) !== 'undefined' && currency_rate_data.result.is_show && total_price+additional_price){
                if(user_login.hasOwnProperty('co_ho_seq_id') && currency_rate_data.result.response.agent.hasOwnProperty(user_login.co_ho_seq_id)){ // buat o3
                    for(k in currency_rate_data.result.response.agent[user_login.co_ho_seq_id]){
                        try{
                            if(currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].base_currency == currency){
                                price_convert = ((total_price+additional_price)/currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].rate).toFixed(2);
                                if(price_convert%1 == 0)
                                    price_convert = parseInt(price_convert);
                                text+=`
                                    <div class="col-lg-12" style="text-align:right;">
                                        <span style="font-size:14px; font-weight:bold;" id="total_price_`+k+`"><b> Estimated `+k+` `+getrupiah(price_convert)+`</b></span><br/>
                                    </div>`;
                            }
                        }catch(err){
                            console.log(err);
                        }
                    }
                }
            }
            text+=`
        </div>`;

        if(window.location.pathname.includes('review_after_sales') && user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
        {
            text +=`<div style="text-align:right; padding-bottom:10px;"><img src="/static/tt_website/images/icon/symbol/upsell_price.png" alt="Bank" style="width:auto; height:25px; cursor:pointer;" onclick="show_repricing();"/></div>`;
        }

    }
    else if(type == 'reschedule'){
        try{
            document.getElementById('additional_price_information_rs').innerHTML = `
                <div class="row">
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                        <span style="font-size:13px; font-weight:500;">Ancillary Fee</span>
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
            if (type != 'request_new')
            {
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
            }
        }catch(err){
            console.log(err); // error kalau ada element yg tidak ada
        }
    }

    if(is_show_breakdown_price){
        var price_breakdown = {};
        var currency_breakdown = '';
        if(typeof(airline_price) !== 'undefined'){
            for(i in airline_price){
                for(j in airline_price[i]){
                    for(k in airline_price[i][j]){
                        if(!['currency', 'disc', 'rac'].includes(k)){
                            if(!price_breakdown.hasOwnProperty(k.toUpperCase()))
                                price_breakdown[k.toUpperCase()] = 0;
                            price_breakdown[k.toUpperCase()] += airline_price[i][j][k];

                        }
                        if(k == 'currency' && currency_breakdown == '')
                            currency_breakdown = airline_price[i][j][k];
                    }
                }
                // upsell
                if(typeof upsell_price_dict !== 'undefined'){
                    for(i in upsell_price_dict){
                        if(!price_breakdown.hasOwnProperty('ROC'))
                            price_breakdown['ROC'] = 0;
                        price_breakdown['ROC'] += upsell_price_dict[i];
                    }
                }
                if(typeof(additional_price) !== 'undefined' && additional_price){
                    price_breakdown['ANCILLARY FEE'] = additional_price;
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

    try{
        if(now_page == 'ssr_no_after_sales'){
            get_default_ssr(passengers, price_itinerary_temp, 'ssr_page');
        }else{
            document.getElementsByClassName("ssr_include_flight").style.display = 'none';
        }
    }catch(err){

    }
}

function on_change_ssr(){
    additional_price = 0;
    for(i in passengers){
        // seat hanya di hitung pre book, after sales di abaikan
        if(!after_sales){
            for(j in passengers[i].seat_list){
                if(isNaN(parseInt(passengers[i].seat_list[j].price)) == false)
                    additional_price += parseInt(passengers[i].seat_list[j].price);
            }
        }
//        if(document.URL.split('/')[document.URL.split('/').length-2] == 'ssr'){
//            for(j in passengers[i].ssr_list){
//                if(passengers[i].ssr_list[j].hasOwnProperty('price')){
//                    additional_price -= passengers[i].ssr_list[j].price;
//                }
//            }
//        }
    }

    for(i=1;i<=len_passenger;i++){
        for(j in ssr_keys){
            for(k=1;k<=ssr_keys[j].len;k++){
                if(document.getElementById(ssr_keys[j].key+'_'+ssr_keys[j].provider+'_'+i+'_'+k).value != ''){
                    additional_price += parseInt(document.getElementById(ssr_keys[j].key+'_'+ssr_keys[j].provider+'_'+i+'_'+k).value.split('_')[2])
                    currency = document.getElementById(ssr_keys[j].key+'_'+ssr_keys[j].provider+'_'+i+'_'+k).value.split('_')[1];
                    if(document.URL.split('/')[document.URL.split('/').length-2] == 'ssr'){
                        index = i - 1;
                        try{
                            for(x in passengers[index].ssr_list){
                                if(passengers[index].ssr_list[x].journey_code == ssr_keys[j].journey_code && ssr_keys[j].key == passengers[index].ssr_list[x].availability_type){
                                    if(passengers[i].ssr_list[x].hasOwnProperty('price'))
                                        additional_price -= passengers[i].ssr_list[x].price;
                                }
                            }
                        }catch(err){
                            console.log(err)
                        }
                    }
                }
            }
        }
    }
    airline_detail(type);
}

function get_airline_channel_repricing_data(){
    for(j in passengers_ssr){
        passengers_ssr[j].name = passengers_ssr[j].title + ' ' + passengers_ssr[j].first_name + ' ' + passengers_ssr[j].last_name;
        pax_price = 0;
        for(i in passengers_ssr[j].seat_list){
            if(isNaN(parseInt(passengers_ssr[j].seat_list[i].price)) == false)
                pax_price += parseInt(passengers_ssr[j].seat_list[i].price);
        }
        for(i in passengers_ssr[j].ssr_list){
            if(isNaN(parseInt(passengers_ssr[j].ssr_list[i].total_price)) == false)
                pax_price += parseInt(passengers_ssr[j].ssr_list[i].total_price);
        }
        try{
            // PRE BOOKED
            for(i in airline_price){
                for(j in airline_price[i]){
                    if(!currency)
                        break;
                    currency = airline_price[i][j].currency;
                }
                if(!currency)
                    break;
            }
        }catch(err){
            // AFTER SALES

        }
        price = {'FARE': pax_price, 'currency': currency, 'CSC': 0};
        if(price['currency'] == '')
            price['currency'] = 'IDR'

//        try{
//            price['CSC'] = airline_get_detail.passengers[j].channel_service_charges.amount_addons;
//            csc += airline_get_detail.passengers[j].channel_service_charges.amount_addons;
//        }catch(err){
//            console.log(err); // error kalau ada element yg tidak ada
//        }

        //repricing
        check = 0;
        if(price_arr_repricing.hasOwnProperty(passengers_ssr[j].pax_type) == false){
            price_arr_repricing[passengers_ssr[j].pax_type] = {}
            pax_type_repricing.push([passengers_ssr[j].pax_type, passengers_ssr[j].pax_type]);
        }
        // fix agar tidak tumpuk harga pnr pertama
        if(price_arr_repricing[passengers_ssr[j].pax_type].hasOwnProperty(passengers_ssr[j].name)){
            price_arr_repricing[passengers_ssr[j].pax_type][passengers_ssr[j].name] = {
                'Fare': price_arr_repricing[passengers_ssr[j].pax_type][passengers_ssr[j].name]['Fare'] + price['FARE'],
                'Tax': 0,
                'Repricing': price['CSC'],
                'total': price_arr_repricing[passengers_ssr[j].pax_type][passengers_ssr[j].name]['Fare'] + price['FARE'] + price['CSC']
            }
        }else{
            price_arr_repricing[passengers_ssr[j].pax_type][passengers_ssr[j].name] = {
                'Fare': price['FARE'],
                'Tax': 0,
                'Repricing': price['CSC'],
                'total': price['FARE'] + price['CSC']
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
        text_repricing += `<div id='repricing_button' class="col-lg-12" style="text-align:center;"></div>`;
        document.getElementById('repricing_div').innerHTML = text_repricing;
    }
}

function get_airline_channel_repricing_data_reschedule(msg){
    counter = 0;
    price_arr_repricing = {};
    pax_type_repricing = [];

    gen_passenger_data = {}

    for(i in airline_get_detail.result.response.passengers){
        full_pax_name = airline_get_detail.result.response.passengers[i].title+` `+airline_get_detail.result.response.passengers[i].first_name+` `+airline_get_detail.result.response.passengers[i].last_name;
        if(!gen_passenger_data.hasOwnProperty(full_pax_name)){
            gen_passenger_data[full_pax_name] = airline_get_detail.result.response.passengers[i];
            gen_passenger_data[full_pax_name].name = full_pax_name;
        }
    }

    for(i in msg){
        for(j in msg[i].passengers){
            full_pax_name = msg[i].passengers[j].title+` `+msg[i].passengers[j].first_name+` `+msg[i].passengers[j].last_name;
            if(gen_passenger_data.hasOwnProperty(full_pax_name)){
                gen_passenger_data[full_pax_name].fees = msg[i].passengers[j].fees;
            }
        }
    }
    currency = '';
    for(j in gen_passenger_data){
        pax_price = 0;
        for(k in gen_passenger_data[j].fees){
            pax_price += gen_passenger_data[j].fees[k].base_price;
        }

        for(k in airline_response){
            for(l in airline_response[k].segments){
                try{
                    if(airline_response[k].segments[l].fares.length > 0){
                        for(m in airline_response[k].segments[l].fares){
                            for(n in airline_response[k].segments[l].fares[m].service_charge_summary){
                                if(!currency)
                                    currency = airline_response[k].segments[l].fares[m].service_charge_summary[n].currency;
                                if(airline_response[k].segments[l].fares[m].service_charge_summary[n].pax_type == gen_passenger_data[j].pax_type)
                                {
                                    pax_price += airline_response[k].segments[l].fares[m].service_charge_summary[n].total_price/airline_response[k].segments[l].fares[m].service_charge_summary[n].pax_count;
                                }
                            }
                        }
                    }
                }catch(err){
                    console.log(err);
                }
            }
        }

        price = {'FARE': pax_price, 'currency': currency, 'CSC': 0};


//        try{
//            price['CSC'] = airline_get_detail.passengers[j].channel_service_charges.amount_addons;
//            csc += airline_get_detail.passengers[j].channel_service_charges.amount_addons;
//        }catch(err){
//            console.log(err); // error kalau ada element yg tidak ada
//        }

        //repricing
        check = 0;
        if(price_arr_repricing.hasOwnProperty(gen_passenger_data[j].pax_type) == false){
            price_arr_repricing[gen_passenger_data[j].pax_type] = {}
            pax_type_repricing.push([gen_passenger_data[j].pax_type, gen_passenger_data[j].pax_type]);
        }
        // fix agar tidak tumpuk harga pnr pertama
        if(price_arr_repricing[gen_passenger_data[j].pax_type].hasOwnProperty(gen_passenger_data[j].name)){
            price_arr_repricing[gen_passenger_data[j].pax_type][gen_passenger_data[j].name] = {
                'Fare': price_arr_repricing[gen_passenger_data[j].pax_type][gen_passenger_data[j].name]['Fare'] + price['FARE'],
                'Tax': 0,
                'Repricing': price['CSC'],
                'total': price_arr_repricing[gen_passenger_data[j].pax_type][gen_passenger_data[j].name]['Fare'] + price['FARE'] + price['CSC']
            }
        }else{
            price_arr_repricing[gen_passenger_data[j].pax_type][gen_passenger_data[j].name] = {
                'Fare': price['FARE'],
                'Tax': 0,
                'Repricing': price['CSC'],
                'total': price['FARE'] + price['CSC']
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
        text_repricing += `<div id='repricing_button' class="col-lg-12" style="text-align:center;"></div>`;
        document.getElementById('repricing_div').innerHTML = text_repricing;
        document.getElementById('repricing_type').innerHTML = '<option value="passenger">Passenger</option>';
        document.getElementById("table_of_equation").innerHTML = ``;
        document.getElementById('repr_calc_button').innerHTML = `
            <hr/>
            <center>
                <input class="primary-btn-ticket" type="button" onclick="calculate('request_new');" value="Calculate">
            </center>
        `;
        $('#repricing_type').niceSelect('update');
        // reset_repricing();
    }
}

function update_identity(type, val){
     if(is_identity_required == 'true' || is_international == 'true')
        document.getElementById(type+'_identity_div'+val).style.display = 'block';
     else if(is_identity_required == 'false'){
        document.getElementById(type+'_identity_div'+val).style.display = 'none';
        document.getElementById(type+'_passport_number'+val).value = '';
        try{
            document.getElementById(type+'_identity_div'+val).value = '';
        }catch(err){}
        try{
            document.getElementById(type+'_id_type'+val).value = '';
        }catch(err){}
        document.getElementById(type+'_passport_expired_date'+val).value = '';
        $('#'+type+'_country_of_issued'+val+'_id').val('').trigger('change');
        $('#'+type+'_identity_div'+val).niceSelect('update');
    }
}

function check_passenger(adult, child, infant, type=''){
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
    if(document.getElementById('booker_title') != undefined){
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
            error_log+= 'Please choose booker title!</br>\n';
            $("#booker_title").each(function() {
                $(this).parent().find('.nice-select').css('border', '1px solid red');
            });
        }else{
            $("#booker_title").each(function() {
                $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
            });
        }
        if(document.getElementById('booker_first_name').value == '' || check_word(document.getElementById('booker_first_name').value) == false){
            if(document.getElementById('booker_first_name').value == '')
                error_log+= 'Please fill booker first name!</br>\n';
            else if(check_word(document.getElementById('booker_first_name').value) == false)
                error_log+= 'Please use alpha characters for booker first name!</br>\n';
            document.getElementById('booker_first_name').style['border-color'] = 'red';
        }else{
            document.getElementById('booker_first_name').style['border-color'] = '#EFEFEF';
        }if(document.getElementById('booker_nationality_id').value == ''){
            error_log+= 'Please fill booker nationality!</br>\n';
            $("#booker_nationality_id").each(function() {
              $(this).siblings(".select2-container").css('border', '1px solid red');
            });
        }else{
            document.getElementById('booker_first_name').style['border-color'] = '#EFEFEF';
        }if(document.getElementById('booker_phone_code_id').value==''){
            error_log+= 'Please choose phone number code for booker!</br>\n';
            $("#booker_phone_code_id").each(function() {
              $(this).siblings(".select2-container").css('border', '1px solid red');
            });
            document.getElementById('booker_phone').style['border-color'] = 'red';
        }else{
            document.getElementById('booker_phone').style['border-color'] = '#EFEFEF';
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
        var booker_copy = 'no';
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
            if(document.getElementById('booker_title').value.toUpperCase() != document.getElementById('adult_title1').value.toUpperCase() ||
               document.getElementById('booker_first_name').value.toUpperCase() != document.getElementById('adult_first_name1').value.toUpperCase() ||
               document.getElementById('booker_last_name').value.toUpperCase() != document.getElementById('adult_last_name1').value.toUpperCase())
                    error_log += 'Copy booker to passenger true, value title, first name, and last name has to be same!</br>\n';

       for(i in airline_pick){
            for(j in airline_pick[i].journeys){
                last_departure_date = airline_pick[i].journeys[j].departure_date.split(' - ')[0];
            }
       }
    }
    // is lion air di hapus 1 sept 2022
    var list_identity_need_update = [];
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
        }if(document.getElementById('adult_title'+i).value == ''){
            error_log+= 'Please choose title of adult passenger '+i+'!</br>\n';
            $("#adult_title"+i).each(function() {
                $(this).parent().find('.nice-select').css('border', '1px solid red');
            });
        }else{
           $("#adult_title"+i).each(function() {
                $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
            });
        }
        if(document.getElementById('adult_first_name'+i).value == '' || check_word(document.getElementById('adult_first_name'+i).value) == false){
           if(document.getElementById('adult_first_name'+i).value == '')
               error_log+= 'Please input first name of adult passenger '+i+'!</br>\n';
           else if(check_word(document.getElementById('adult_first_name'+i).value) == false)
               error_log+= 'Please use alpha characters first name of adult passenger '+i+'!</br>\n';
           document.getElementById('adult_first_name'+i).style['border-color'] = 'red';
        }else{
           document.getElementById('adult_first_name'+i).style['border-color'] = '#EFEFEF';
        }
       //check lastname
       // no check update 10 jan 2023 IVAN case A JAN
//       if(check_name_airline(document.getElementById('adult_first_name'+i).value, document.getElementById('adult_last_name'+i).value) != ''){
//           error_log += 'Please '+check_name_airline(document.getElementById('adult_first_name'+i).value, document.getElementById('adult_last_name'+i).value)+' adult passenger '+i+'!</br>\n';
//           document.getElementById('adult_last_name'+i).style['border-color'] = 'red';
//       }else{
//           document.getElementById('adult_last_name'+i).style['border-color'] = '#EFEFEF';
//       }
        if(birth_date_required == true || document.getElementById('adult_id_type'+i).value == 'passport'){
           if(check_date(document.getElementById('adult_birth_date'+i).value)==false){
               error_log+= 'Birth date wrong for passenger adult '+i+'!</br>\n';
               document.getElementById('adult_birth_date'+i).style['border-color'] = 'red';
           }else{
               duration = moment.duration(moment(document.getElementById('adult_birth_date'+i).value).diff(last_departure_date));
               if(duration._data.years <= -12 == false){ //check age
                    error_log+= 'Age wrong for passenger adult '+i+' minimum 12 years old!</br>\n';
                    document.getElementById('adult_birth_date'+i).style['border-color'] = 'red';
               }else{
                    document.getElementById('adult_birth_date'+i).style['border-color'] = '#EFEFEF';
               }
           }
        }if(document.getElementById('adult_nationality'+i+'_id').value == ''){
           error_log+= 'Please fill nationality for passenger adult '+i+'!</br>\n';
           document.getElementById('adult_nationality'+i+'_id').style['border-color'] = 'red';
        }else{
           if(is_identity_required == 'true')
               if(document.getElementById('adult_id_type'+i).value == '' && document.getElementById('adult_identity_div'+i).style.display == 'block'){
                    error_log+= 'Please fill id type for passenger adult '+i+'!</br>\n';
                    document.getElementById('adult_id_type'+i).style['border-color'] = 'red';
               }
           document.getElementById('adult_nationality'+i+'_id').style['border-color'] = '#EFEFEF';
        }
        if(document.getElementById('adult_identity_div'+i).style.display == 'block'){
           if(document.getElementById('adult_id_type'+i).value != ''){
                $("#adult_id_type"+i).each(function() {
                    $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                });
//               if(document.getElementById('adult_nationality'+i).value == 'Indonesia'){
//                   //indonesia
//                   if(document.getElementById('adult_id_type'+i).value == 'ktp' && is_international == 'false'){
//                        document.getElementById('adult_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
//                        $("#adult_id_type"+i).each(function() {
//                            $(this).parent().find('.nice-select').css('border', '0px solid red');
//                        });
//                        document.getElementById('adult_passport_expired_date'+i).style['border-color'] = '#cdcdcd';
//                        if(check_ktp(document.getElementById('adult_passport_number'+i).value) == false){
//                           error_log+= 'Please fill id number, nik only contain 16 digits for passenger adult '+i+'!</br>\n';
//                           document.getElementById('adult_passport_number'+i).style['border-color'] = 'red';
//                        }else{
//                           document.getElementById('adult_passport_number'+i).style['border-color'] = '#EFEFEF';
//                        }if(document.getElementById('adult_country_of_issued'+i).value == '' || document.getElementById('adult_country_of_issued'+i).value == 'Country of Issued'){
//                           error_log+= 'Please fill country of issued for passenger adult '+i+'!</br>\n';
//                           $("#adult_country_of_issued"+i+"_id").each(function() {
//                             $(this).siblings(".select2-container").css('border', '1px solid red');
//                           });
//                        }else{
//                           $("#adult_country_of_issued"+i+"_id").each(function() {
//                             $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
//                           });
//                        }
//                   }
//                   else if(document.getElementById('adult_id_type'+i).value == 'passport' && is_international == 'true'){
//                       $("#adult_id_type"+i).each(function() {
//                           $(this).parent().find('.nice-select').css('border', '0px solid red');
//                       });
//                       if(document.getElementById('adult_id_type'+i).value == 'passport' && check_passport(document.getElementById('adult_passport_number'+i).value) == false){
//                           error_log+= 'Please fill id number, passport only contain more than 6 digits  for passenger adult '+i+'!</br>\n';
//                           document.getElementById('adult_passport_number'+i).style['border-color'] = 'red';
//                       }else{
//                           document.getElementById('adult_passport_number'+i).style['border-color'] = '#EFEFEF';
//                       }
//                       if(document.getElementById('adult_passport_expired_date'+i).value == ''){
//                           error_log+= 'Please fill passport expired date for passenger adult '+i+'!</br>\n';
//                           document.getElementById('adult_passport_expired_date'+i).style['border-color'] = 'red';
//                       }else{
//                           duration = moment.duration(moment(document.getElementById('adult_passport_expired_date'+i).value).diff(last_departure_date));
//                           //CHECK EXPIRED
//                           if(duration._milliseconds < 0 ){
//                                list_identity_need_update.push('adult_'+i);
////                                error_log+= 'Please update passport expired date for passenger adult '+i+'!</br>\n';
////                                document.getElementById('adult_passport_expired_date'+i).style['border-color'] = 'red';
//                           }else
//                                document.getElementById('adult_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
//                       }if(document.getElementById('adult_country_of_issued'+i).value == '' || document.getElementById('adult_country_of_issued'+i).value == 'Country of Issued'){
//                           error_log+= 'Please fill country of issued for passenger adult '+i+'!</br>\n';
//                            $("#adult_country_of_issued"+i+"_id").each(function() {
//                              $(this).siblings(".select2-container").css('border', '1px solid red');
//                            });
//                       }else{
//                            $("#adult_country_of_issued"+i+"_id").each(function() {
//                              $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
//                            });
//                       }
//
//                   }
//                   else if(is_international == 'false'){
//                        error_log += 'Please change identity to NIK for passenger adult '+i+'!</br>\n';
//                        $("#adult_id_type"+i).each(function() {
//                            $(this).parent().find('.nice-select').css('border', '1px solid red');
//                        });
//                   }else if(is_international == 'true'){
//                        error_log += 'Please change identity to Passport for passenger adult '+i+'!</br>\n';
//                        $("#adult_id_type"+i).each(function() {
//                            $(this).parent().find('.nice-select').css('border', '1px solid red');
//                        });
//                   }
//               }
//               else{
//                   //foreign
//                   $("#adult_id_type"+i).each(function() {
//                       $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
//                   });
//                   if(document.getElementById('adult_id_type'+i).value == 'passport'){
//                       if(document.getElementById('adult_id_type'+i).value == 'passport' && check_passport(document.getElementById('adult_passport_number'+i).value) == false){
//                           error_log+= 'Please fill id number, passport only contain more than 6 digits  for passenger adult '+i+'!</br>\n';
//                           document.getElementById('adult_passport_number'+i).style['border-color'] = 'red';
//                       }else{
//                           document.getElementById('adult_passport_number'+i).style['border-color'] = '#EFEFEF';
//                       }
//                       if(document.getElementById('adult_passport_expired_date'+i).value == ''){
//                           error_log+= 'Please fill passport expired date for passenger adult '+i+'!</br>\n';
//                           document.getElementById('adult_passport_expired_date'+i).style['border-color'] = 'red';
//                       }else{
//                           duration = moment.duration(moment(document.getElementById('adult_passport_expired_date'+i).value).diff(last_departure_date));
//                           //CHECK EXPIRED
//                           if(duration._milliseconds < 0 ){
//                                list_identity_need_update.push('adult_'+i);
////                                error_log+= 'Please update passport expired date for passenger adult '+i+'!</br>\n';
////                                document.getElementById('adult_passport_expired_date'+i).style['border-color'] = 'red';
//                           }else
//                                document.getElementById('adult_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
//                       }if(document.getElementById('adult_country_of_issued'+i).value == ''){
//                           error_log+= 'Please fill country of issued for passenger adult '+i+'!</br>\n';
//                            $("#adult_country_of_issued"+i+"_id").each(function() {
//                              $(this).siblings(".select2-container").css('border', '1px solid red');
//                            });
//                       }else{
//                            $("#adult_country_of_issued"+i+"_id").each(function() {
//                              $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
//                            });
//                       }
//                   }else{
//                       error_log+= 'Please change identity type to Passport for passenger adult '+i+'!</br>\n';
//                   }
//               }
               // IVAN 17 okt 2022 open all passenger nationality, kalau inter harus passport
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
               else if(document.getElementById('adult_id_type'+i).value == 'passport'){
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
                            list_identity_need_update.push('adult_'+i);
//                                error_log+= 'Please update passport expired date for passenger adult '+i+'!</br>\n';
//                                document.getElementById('adult_passport_expired_date'+i).style['border-color'] = 'red';
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
               else if(is_international == 'true'){
                    error_log += 'Please change identity to Passport for passenger adult '+i+'!</br>\n';
                    $("#adult_id_type"+i).each(function() {
                        $(this).parent().find('.nice-select').css('border', '1px solid red');
                    });
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
       }else{
           if(document.getElementById('adult_valid_passport'+i))
               if(document.getElementById('adult_valid_passport'+i).checked)
                   list_identity_need_update.push('adult_'+i)
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
       }
       if(typeof ff_request !== 'undefined'){
           if(ff_request.length != 0 && check_ff == 1){
               var index_ff = 0;
               for(j=1;j<=ff_request.length;j++){
                    index_ff = j-1;
                    if(ff_request[index_ff].hasOwnProperty('error_code') == false){
                        error_ff = true;
                        ff_required = false;
                        for(k in ff_request[index_ff].carrier_codes){
                            if(airline_carriers[ff_request[index_ff].carrier_codes[k]].hasOwnProperty('required_frequent_flyer') && airline_carriers[ff_request[index_ff].carrier_codes[k]].required_frequent_flyer){
                                ff_required = airline_carriers[ff_request[index_ff].carrier_codes[k]].required_frequent_flyer;
                                break;
                            }
                        }
                        if(ff_required && document.getElementById('adult_ff_request'+i+'_'+j + '_id').value == '' && document.getElementById('adult_ff_number'+i+'_'+j).value == ''){
                            error_log+= 'Please choose Frequent Flyer Program Journey '+j+' for passenger adult '+i+'!</br>\n';
                            error_log+= 'Please fill Frequent Flyer Number '+j+' for passenger adult '+i+'!</br>\n';
                            $("#adult_ff_request"+i+'_'+j+'_id').each(function() {
                                $(this).parent().find('.nice-select').css('border', '1px solid red');
                            });
                            document.getElementById('adult_ff_number'+i+'_'+j).style['border-color'] = 'red';
                        }else if(ff_required && document.getElementById('adult_ff_request'+i+'_'+j + '_id').value == ''){
                            error_log+= 'Please choose Frequent Flyer Program Journey '+j+' for passenger adult '+i+'!</br>\n';
                            $("#adult_ff_request"+i+'_'+j+'_id').each(function() {
                                $(this).parent().find('.nice-select').css('border', '1px solid red');
                            });
                        }else if(ff_required && document.getElementById('adult_ff_number'+i+'_'+j).value == ''){
                            error_log+= 'Please fill Frequent Flyer Number '+j+' for passenger adult '+i+'!</br>\n';
                            document.getElementById('adult_ff_number'+i+'_'+j).style['border-color'] = 'red';
                        }
                        else if(document.getElementById('adult_ff_request'+i+'_'+j + '_id').value != '')
                            error_ff = false
                        else if(document.getElementById('adult_ff_request'+i+'_'+j + '_id').value == '' && document.getElementById('adult_ff_number'+i+'_'+j).value != ''){
                            error_log+= 'Please choose Frequent Flyer Program Journey '+j+' for passenger adult '+i+'!</br>\n';
                            document.getElementById('adult_ff_number'+i+'_'+j).style['border-color'] = 'red';
                        }else if(document.getElementById('adult_ff_request'+i+'_'+j + '_id').value != '' && document.getElementById('adult_ff_number'+i+'_'+j).value == '' &&
                            document.getElementById('adult_ff_request'+i+'_'+j + '_id').value != '' && document.getElementById('adult_ff_number'+i+'_'+j).value == ''){
                            error_log+= 'Please fill Frequent Flyer Number '+j+' for passenger adult '+i+'!</br>\n';
                            document.getElementById('adult_ff_number'+i+'_'+j).style['border-color'] = 'red';
                        }else{
                            error_ff = false
                        }
                        if(error_ff == false){
                            document.getElementById('adult_ff_number'+i+'_'+j).style['border-color'] = '#EFEFEF';
                            document.getElementById('adult_ff_request'+i+'_'+j+'_id').style['border-color'] = '#EFEFEF';
                        }
                    }
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
       }if(document.getElementById('child_title'+i).value == ''){
            error_log+= 'Please choose title of child passenger '+i+'!</br>\n';
            $("#child_title"+i).each(function() {
                $(this).parent().find('.nice-select').css('border', '0px solid red');
            });
       }else{
           $("#child_title"+i).each(function() {
                $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
            });
       }
       if(document.getElementById('child_first_name'+i).value == '' || check_word(document.getElementById('child_first_name'+i).value) == false){
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
       // no check update 10 jan 2023 IVAN case A JAN
//       if(check_name_airline(document.getElementById('child_first_name'+i).value, document.getElementById('child_last_name'+i).value) != ''){
//           error_log+= 'Please '+check_name_airline(document.getElementById('child_first_name'+i).value, document.getElementById('child_last_name'+i).value)+' child passenger '+i+'!</br>\n';
//           document.getElementById('child_last_name'+i).style['border-color'] = 'red';
//       }else{
//           document.getElementById('child_last_name'+i).style['border-color'] = '#EFEFEF';
//       }
       if(check_date(document.getElementById('child_birth_date'+i).value)==false){
           error_log+= 'Birth date wrong for passenger child '+i+'!</br>\n';
           document.getElementById('child_birth_date'+i).style['border-color'] = 'red';
       }else{
           duration = moment.duration(moment(document.getElementById('child_birth_date'+i).value).diff(last_departure_date));
           if(duration._data.years <= -2 && duration._data.years > -12 == false){ //check age
                error_log+= 'Age wrong for passenger child '+i+', minimum 2 years old and maximum 11 years old!</br>\n';
                document.getElementById('child_birth_date'+i).style['border-color'] = 'red';
           }else{
                document.getElementById('child_birth_date'+i).style['border-color'] = '#EFEFEF';
           }
       }if(document.getElementById('child_nationality'+i+'_id').value == ''){
           error_log+= 'Please fill nationality for passenger child '+i+'!</br>\n';
           document.getElementById('child_nationality'+i+'_id').style['border-color'] = 'red';
       }else{
           if(is_identity_required == 'true' && document.getElementById('child_identity_div'+i).style.display == 'block')
               if(document.getElementById('child_id_type'+i).value == ''){
                    error_log+= 'Please fill id type for passenger child '+i+'!</br>\n';
                    document.getElementById('child_id_type'+i).style['border-color'] = 'red';
               }
           document.getElementById('child_nationality'+i+'_id').style['border-color'] = '#EFEFEF';
       }

       if(document.getElementById('child_identity_div'+i).style.display == 'block'){
           if(document.getElementById('child_id_type'+i).value != ''){
               document.getElementById('child_id_type'+i).style['border-color'] = '#EFEFEF';
//               if(document.getElementById('child_nationality'+i).value == 'Indonesia'){
//                   //indonesia
//                   if(document.getElementById('child_id_type'+i).value == 'ktp' && is_international == 'false'){
//                        document.getElementById('child_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
//                        $("#child_id_type"+i).each(function() {
//                            $(this).parent().find('.nice-select').css('border', '1px solid red');
//                        });
//                        if(check_ktp(document.getElementById('child_passport_number'+i).value) == false){
//                           error_log+= 'Please fill id number, nik only contain 16 digits for passenger child '+i+'!</br>\n';
//                           document.getElementById('child_passport_number'+i).style['border-color'] = 'red';
//                        }else{
//                           document.getElementById('child_passport_number'+i).style['border-color'] = '#EFEFEF';
//                        }if(document.getElementById('child_country_of_issued'+i).value == '' || document.getElementById('child_country_of_issued'+i).value == 'Country of Issued'){
//                           error_log+= 'Please fill country of issued for passenger child '+i+'!</br>\n';
//                           $("#child_country_of_issued"+i+"_id").each(function() {
//                             $(this).siblings(".select2-container").css('border', '1px solid red');
//                           });
//                        }else{
//                           $("#child_country_of_issued"+i+"_id").each(function() {
//                             $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
//                           });
//                        }
//                   }
//                   else if(document.getElementById('child_id_type'+i).value == 'passport' && is_international == 'true'){
//                       $("#child_id_type"+i).each(function() {
//                           $(this).parent().find('.nice-select').css('border', '0px solid red');
//                       });
//                       if(document.getElementById('child_id_type'+i).value == 'passport' && check_passport(document.getElementById('child_passport_number'+i).value) == false){
//                           error_log+= 'Please fill id number, passport only contain more than 6 digits  for passenger child '+i+'!</br>\n';
//                           document.getElementById('child_passport_number'+i).style['border-color'] = 'red';
//                       }else{
//                           document.getElementById('child_passport_number'+i).style['border-color'] = '#EFEFEF';
//                       }
//                       if(document.getElementById('child_passport_expired_date'+i).value == ''){
//                           error_log+= 'Please fill passport expired date for passenger child '+i+'!</br>\n';
//                           document.getElementById('child_passport_expired_date'+i).style['border-color'] = 'red';
//                       }else{
//                           duration = moment.duration(moment(document.getElementById('child_passport_expired_date'+i).value).diff(last_departure_date));
//                           //CHECK EXPIRED
//                           if(duration._milliseconds < 0 ){
//                                list_identity_need_update.push('child_'+i);
////                                error_log+= 'Please update passport expired date for passenger child '+i+'!</br>\n';
////                                document.getElementById('child_passport_expired_date'+i).style['border-color'] = 'red';
//                           }else
//                                document.getElementById('child_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
//                       }if(document.getElementById('child_country_of_issued'+i).value == '' || document.getElementById('child_country_of_issued'+i).value == 'Country of Issued'){
//                           error_log+= 'Please fill country of issued for passenger child '+i+'!</br>\n';
//                           $("#child_country_of_issued"+i+"_id").each(function() {
//                             $(this).siblings(".select2-container").css('border', '1px solid red');
//                           });
//
//                       }else{
//                           $("#child_country_of_issued"+i+"_id").each(function() {
//                             $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
//                           });
//
//                       }
//                   }
//                   else if(is_international == 'false'){
//                        error_log += 'Please change identity to NIK for passenger child '+i+'!</br>\n';
//                        $("#child_id_type"+i).each(function() {
//                            $(this).parent().find('.nice-select').css('border', '1px solid red');
//                        });
//                   }else if(is_international == 'true'){
//                        error_log += 'Please change identity to Passport for passenger child '+i+'!</br>\n';
//                        $("#child_id_type"+i).each(function() {
//                            $(this).parent().find('.nice-select').css('border', '1px solid red');
//                        });
//                   }
//               }
//               else{
//                   //foreign
//                   if(document.getElementById('child_id_type'+i).value == 'passport'){
//                       $("#child_id_type"+i).each(function() {
//                           $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
//                       });
//                       if(document.getElementById('child_id_type'+i).value == 'passport' && check_passport(document.getElementById('child_passport_number'+i).value) == false){
//                           error_log+= 'Please fill id number, passport only contain more than 6 digits  for passenger child '+i+'!</br>\n';
//                           document.getElementById('child_passport_number'+i).style['border-color'] = 'red';
//                       }else{
//                           document.getElementById('child_passport_number'+i).style['border-color'] = '#EFEFEF';
//                       }
//                       if(document.getElementById('child_passport_expired_date'+i).value == ''){
//                           error_log+= 'Please fill passport expired date for passenger child '+i+'!</br>\n';
//                           document.getElementById('child_passport_expired_date'+i).style['border-color'] = 'red';
//                       }else{
//                           duration = moment.duration(moment(document.getElementById('child_passport_expired_date'+i).value).diff(last_departure_date));
//                           //CHECK EXPIRED
//                           if(duration._milliseconds < 0 ){
//                                list_identity_need_update.push('child_'+i);
////                                error_log+= 'Please update passport expired date for passenger child '+i+'!</br>\n';
////                                document.getElementById('child_passport_expired_date'+i).style['border-color'] = 'red';
//                           }else
//                                document.getElementById('child_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
//                       }if(document.getElementById('child_country_of_issued'+i).value == ''){
//                           error_log+= 'Please fill country of issued for passenger child '+i+'!</br>\n';
//                           $("#child_country_of_issued"+i+"_id").each(function() {
//                             $(this).siblings(".select2-container").css('border', '1px solid red');
//                           });
//
//                       }else{
//                           $("#child_country_of_issued"+i+"_id").each(function() {
//                             $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
//                           });
//
//                       }
//                   }else{
//                       error_log+= 'Please change identity type to Passport for passenger child '+i+'!</br>\n';
//                   }
//               }
               // IVAN 17 okt 2022 open all passenger nationality, kalau inter harus passport
               if(document.getElementById('child_id_type'+i).value == 'ktp' && is_international == 'false'){
                    document.getElementById('child_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
                    $("#child_id_type"+i).each(function() {
                        $(this).parent().find('.nice-select').css('border', '1px solid red');
                    });
                    if(check_ktp(document.getElementById('child_passport_number'+i).value) == false){
                       error_log+= 'Please fill id number, nik only contain 16 digits for passenger child '+i+'!</br>\n';
                       document.getElementById('child_passport_number'+i).style['border-color'] = 'red';
                    }else{
                       document.getElementById('child_passport_number'+i).style['border-color'] = '#EFEFEF';
                    }if(document.getElementById('child_country_of_issued'+i+'_id').value == ''){
                       error_log+= 'Please fill country of issued for passenger child '+i+'!</br>\n';
                       $("#child_country_of_issued"+i+"_id").each(function() {
                         $(this).siblings(".select2-container").css('border', '1px solid red');
                       });
                    }else{
                       $("#child_country_of_issued"+i+"_id").each(function() {
                         $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                       });
                    }
               }
               else if(document.getElementById('child_id_type'+i).value == 'passport'){
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
                            list_identity_need_update.push('child_'+i);
//                                error_log+= 'Please update passport expired date for passenger child '+i+'!</br>\n';
//                                document.getElementById('child_passport_expired_date'+i).style['border-color'] = 'red';
                       }else
                            document.getElementById('child_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
                   }if(document.getElementById('child_country_of_issued'+i+'_id').value == ''){
                       error_log+= 'Please fill country of issued for passenger child '+i+'!</br>\n';
                       $("#child_country_of_issued"+i+"_id").each(function() {
                         $(this).siblings(".select2-container").css('border', '1px solid red');
                       });

                   }else{
                       $("#child_country_of_issued"+i+"_id").each(function() {
                         $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                       });

                   }
               }
               else if(is_international == 'true'){
                    error_log += 'Please change identity to Passport for passenger child '+i+'!</br>\n';
                    $("#child_id_type"+i).each(function() {
                        $(this).parent().find('.nice-select').css('border', '1px solid red');
                    });
               }
           }else{
                if(document.getElementById('child_id_type'+i).value != ''){
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
       }else{
           if(document.getElementById('child_valid_passport'+i))
               if(document.getElementById('child_valid_passport'+i).checked)
                   list_identity_need_update.push('child_'+i)
       }
       if(typeof ff_request !== 'undefined'){
           if(ff_request.length != 0 && check_ff == 1){
               for(j=1;j<=ff_request.length;j++){
                    index_ff = j-1;
                    if(ff_request[index_ff].hasOwnProperty('error_code') == false){
                        error_ff = true
                        ff_required = false;
//                        for(k in ff_request[index_ff].carrier_codes){
//                            if(airline_carriers[ff_request[index_ff].carrier_codes[k]].hasOwnProperty('required_frequent_flyer') && airline_carriers[ff_request[index_ff].carrier_codes[k]].required_frequent_flyer){
//                                ff_required = airline_carriers[ff_request[index_ff].carrier_codes[k]].required_frequent_flyer;
//                                break;
//                            }
//                        }
                        if(ff_required && document.getElementById('child_ff_request'+i+'_'+j + '_id').value == '' && document.getElementById('child_ff_number'+i+'_'+j).value == ''){
                            error_log+= 'Please choose Frequent Flyer Program Journey '+j+' for passenger child '+i+'!</br>\n';
                            error_log+= 'Please fill Frequent Flyer Number '+j+' for passenger child '+i+'!</br>\n';
                            $("#child_ff_request"+i+'_'+j+'_id').each(function() {
                                $(this).parent().find('.nice-select').css('border', '1px solid red');
                            });
                            document.getElementById('child_ff_number'+i+'_'+j).style['border-color'] = 'red';
                        }else if(ff_required && document.getElementById('child_ff_request'+i+'_'+j + '_id').value == ''){
                            error_log+= 'Please choose Frequent Flyer Program Journey '+j+' for passenger child '+i+'!</br>\n';
                            $("#child_ff_request"+i+'_'+j+'_id').each(function() {
                                $(this).parent().find('.nice-select').css('border', '1px solid red');
                            });
                        }else if(ff_required && document.getElementById('child_ff_number'+i+'_'+j).value == ''){
                            error_log+= 'Please fill Frequent Flyer Number '+j+' for passenger child '+i+'!</br>\n';
                            document.getElementById('child_ff_number'+i+'_'+j).style['border-color'] = 'red';
                        }
                        else if(document.getElementById('child_ff_request'+i+'_'+j + '_id').value != '' && document.getElementById('child_ff_number'+i+'_'+j).value != '')
                            error_ff = false
                        else if(document.getElementById('child_ff_request'+i+'_'+j + '_id').value == '' && document.getElementById('child_ff_number'+i+'_'+j).value != ''){
                            error_log+= 'Please choose Frequent Flyer Program Journey '+j+' for passenger child '+i+'!</br>\n';
                            document.getElementById('child_ff_number'+i+'_'+j).style['border-color'] = 'red';
                        }else if(document.getElementById('child_ff_request'+i+'_'+j + '_id').value != '' && document.getElementById('child_ff_number'+i+'_'+j).value == '' &&
                            document.getElementById('child_ff_request'+i+'_'+j + '_id').value != '' && document.getElementById('child_ff_number'+i+'_'+j).value == ''){
                            error_log+= 'Please fill Frequent Flyer Number '+j+' for passenger child '+i+'!</br>\n';
                            document.getElementById('child_ff_number'+i+'_'+j).style['border-color'] = 'red';
                        }else{
                            error_ff = false
                        }
                        if(error_ff == false){
                            document.getElementById('child_ff_number'+i+'_'+j).style['border-color'] = '#EFEFEF';
                            document.getElementById('child_ff_request'+i+'_'+j + '_id').style['border-color'] = '#EFEFEF';
                        }
                    }
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
       name = document.getElementById('adult_title'+i).value+document.getElementById('adult_first_name'+i).value+' '+document.getElementById('adult_last_name'+i).value;
       name += document.getElementById('infant_title'+i).value+document.getElementById('infant_first_name'+i).value+' '+document.getElementById('infant_last_name'+i).value;
       if(check_name_adult_infant(name, length_name) == false){
           error_log+= 'Total of adult and infant '+i+' name maximum '+length_name+' characters!</br>\n';
           document.getElementById('infant_first_name'+i).style['border-color'] = 'red';
           document.getElementById('infant_last_name'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('infant_first_name'+i).style['border-color'] = '#EFEFEF';
           document.getElementById('infant_last_name'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('infant_title'+i).value == ''){
            error_log+= 'Please choose title of infant passenger '+i+'!</br>\n';
            $("#infant_title"+i).each(function() {
                $(this).parent().find('.nice-select').css('border', '1px solid red');
            });
       }else{
           $("#infant_title"+i).each(function() {
                $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
            });
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
       // no check update 10 jan 2023 IVAN case A JAN
//       if(check_name_airline(document.getElementById('infant_first_name'+i).value, document.getElementById('infant_last_name'+i).value) != ''){
//           error_log+= 'Please '+check_name_airline(document.getElementById('infant_first_name'+i).value, document.getElementById('infant_last_name'+i).value)+' infant passenger '+i+'!</br>\n';
//           document.getElementById('infant_last_name'+i).style['border-color'] = 'red';
//       }else{
//           document.getElementById('infant_last_name'+i).style['border-color'] = '#EFEFEF';
//       }
       if(check_date(document.getElementById('infant_birth_date'+i).value)==false){
           error_log+= 'Birth date wrong for passenger infant '+i+'!</br>\n';
           document.getElementById('infant_birth_date'+i).style['border-color'] = 'red';
       }else{
           duration = moment.duration(moment(document.getElementById('infant_birth_date'+i).value).diff(last_departure_date));
           if(duration._data.years > -2 == false){ //check age
                error_log+= 'Age wrong for passenger child '+i+' maximum 2 years old!</br>\n';
                document.getElementById('infant_birth_date'+i).style['border-color'] = 'red';
           }else{
                document.getElementById('infant_birth_date'+i).style['border-color'] = '#EFEFEF';
           }
       }if(document.getElementById('infant_nationality'+i+'_id').value == ''){
           error_log+= 'Please fill nationality for passenger infant '+i+'!</br>\n';
           document.getElementById('infant_nationality'+i+'_id').style['border-color'] = 'red';
       }else{
           if(is_identity_required == 'true')
               if(document.getElementById('infant_id_type'+i).value == '' && document.getElementById('infant_identity_div'+i).style.display == 'block'){
                    error_log+= 'Please fill id type for passenger infant '+i+'!</br>\n';
                    document.getElementById('infant_id_type'+i).style['border-color'] = 'red';
               }
           document.getElementById('infant_nationality'+i+'_id').style['border-color'] = '#EFEFEF';
       }

       if(document.getElementById('infant_identity_div'+i).style.display == 'block'){
           if(document.getElementById('infant_id_type'+i).value != ''){
               document.getElementById('infant_id_type'+i).style['border-color'] = '#EFEFEF';
//               if(document.getElementById('infant_nationality'+i).value == 'Indonesia'){
//                   //indonesia
//                   if(document.getElementById('infant_id_type'+i).value == 'ktp' && is_international == 'false'){
//                        document.getElementById('infant_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
//                        $("#infant_id_type"+i).each(function() {
//                            $(this).parent().find('.nice-select').css('border', '0px solid red');
//                        });
//                        if(check_ktp(document.getElementById('infant_passport_number'+i).value) == false){
//                           error_log+= 'Please fill id number, nik only contain 16 digits for passenger infant '+i+'!</br>\n';
//                           document.getElementById('infant_passport_number'+i).style['border-color'] = 'red';
//                        }else{
//                           document.getElementById('infant_passport_number'+i).style['border-color'] = '#EFEFEF';
//                        }if(document.getElementById('infant_country_of_issued'+i).value == ''){
//                           error_log+= 'Please fill country of issued for passenger infant '+i+'!</br>\n';
//                           $("#infant_country_of_issued"+i+"_id").each(function() {
//                             $(this).siblings(".select2-container").css('border', '1px solid red');
//                           });
//                        }else{
//                           $("#infant_country_of_issued"+i+"_id").each(function() {
//                             $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
//                           });
//                        }
//                   }else if(document.getElementById('infant_id_type'+i).value == 'passport' && is_international == 'true'){
//                       $("#infant_id_type"+i).each(function() {
//                            $(this).parent().find('.nice-select').css('border', '0px solid red');
//                       });
//                       if(document.getElementById('infant_id_type'+i).value == 'passport' && check_passport(document.getElementById('infant_passport_number'+i).value) == false){
//                           error_log+= 'Please fill id number, passport only contain more than 6 digits  for passenger infant '+i+'!</br>\n';
//                           document.getElementById('infant_passport_number'+i).style['border-color'] = 'red';
//                       }else{
//                           document.getElementById('infant_passport_number'+i).style['border-color'] = '#EFEFEF';
//                       }
//                       if(document.getElementById('infant_passport_expired_date'+i).value == ''){
//                           error_log+= 'Please fill passport expired date for passenger infant '+i+'!</br>\n';
//                           document.getElementById('infant_passport_expired_date'+i).style['border-color'] = 'red';
//                       }else{
//                           duration = moment.duration(moment(document.getElementById('infant_passport_expired_date'+i).value).diff(last_departure_date));
//                           //CHECK EXPIRED
//                           if(duration._milliseconds < 0 ){
//                                list_identity_need_update.push('infant_'+i);
////                                error_log+= 'Please update passport expired date for passenger infant '+i+'!</br>\n';
////                                document.getElementById('infant_passport_expired_date'+i).style['border-color'] = 'red';
//                           }else
//                                document.getElementById('infant_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
//                       }if(document.getElementById('infant_country_of_issued'+i).value == '' || document.getElementById('infant_country_of_issued'+i).value == 'Country of Issued'){
//                           error_log+= 'Please fill country of issued for passenger infant '+i+'!</br>\n';
//                           $("#infant_country_of_issued"+i+"_id").each(function() {
//                             $(this).siblings(".select2-container").css('border', '1px solid red');
//                           });
//                       }else{
//                           $("#infant_country_of_issued"+i+"_id").each(function() {
//                             $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
//                           });
//                       }
//                   }else if(is_international == 'false'){
//                        error_log += 'Please change identity to NIK for passenger infant '+i+'!</br>\n';
//                        $("#infant_id_type"+i).each(function() {
//                             $(this).parent().find('.nice-select').css('border', '1px solid red');
//                        });
//                   }else if(is_international == 'true'){
//                        error_log += 'Please change identity to Passport for passenger infant '+i+'!</br>\n';
//                        $("#infant_id_type"+i).each(function() {
//                             $(this).parent().find('.nice-select').css('border', '1px solid red');
//                        });
//                   }
//               }
//               else{
//                   //foreign
//                   if(document.getElementById('infant_id_type'+i).value == 'passport'){
//                       $("#infant_id_type"+i).each(function() {
//                            $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
//                       });
//                       if(document.getElementById('infant_id_type'+i).value == 'passport' && check_passport(document.getElementById('infant_passport_number'+i).value) == false){
//                           error_log+= 'Please fill id number, passport only contain more than 6 digits  for passenger infant '+i+'!</br>\n';
//                           document.getElementById('infant_passport_number'+i).style['border-color'] = 'red';
//                       }else{
//                           document.getElementById('infant_passport_number'+i).style['border-color'] = '#EFEFEF';
//                       }
//                       if(document.getElementById('infant_passport_expired_date'+i).value == ''){
//                           error_log+= 'Please fill passport expired date for passenger infant '+i+'!</br>\n';
//                           document.getElementById('infant_passport_expired_date'+i).style['border-color'] = 'red';
//                       }else{
//                           duration = moment.duration(moment(document.getElementById('infant_passport_expired_date'+i).value).diff(last_departure_date));
//                           //CHECK EXPIRED
//                           if(duration._milliseconds < 0 ){
//                                list_identity_need_update.push('infant_'+i);
////                                error_log+= 'Please update passport expired date for passenger infant '+i+'!</br>\n';
////                                document.getElementById('infant_passport_expired_date'+i).style['border-color'] = 'red';
//                           }else
//                                document.getElementById('infant_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
//                       }if(document.getElementById('infant_country_of_issued'+i).value == ''){
//                           error_log+= 'Please fill country of issued for passenger infant '+i+'!</br>\n';
//                           $("#infant_country_of_issued"+i+"_id").each(function() {
//                             $(this).siblings(".select2-container").css('border', '1px solid red');
//                           });
//                       }else{
//                           $("#infant_country_of_issued"+i+"_id").each(function() {
//                             $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
//                           });
//                       }
//                   }else{
//                        error_log+= 'Please change identity type to Passport for passenger infant '+i+'!</br>\n';
//                   }
//               }
               // IVAN 17 okt 2022 open all passenger nationality, kalau inter harus passport
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
                    }if(document.getElementById('infant_country_of_issued'+i+'_id').value == ''){
                       error_log+= 'Please fill country of issued for passenger infant '+i+'!</br>\n';
                       $("#infant_country_of_issued"+i+"_id").each(function() {
                         $(this).siblings(".select2-container").css('border', '1px solid red');
                       });
                    }else{
                       $("#infant_country_of_issued"+i+"_id").each(function() {
                         $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                       });
                    }
               }
               else if(document.getElementById('infant_id_type'+i).value == 'passport'){
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
                            list_identity_need_update.push('infant_'+i);
//                                error_log+= 'Please update passport expired date for passenger infant '+i+'!</br>\n';
//                                document.getElementById('infant_passport_expired_date'+i).style['border-color'] = 'red';
                       }else
                            document.getElementById('infant_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
                   }if(document.getElementById('infant_country_of_issued'+i+'_id').value == ''){
                       error_log+= 'Please fill country of issued for passenger infant '+i+'!</br>\n';
                       $("#infant_country_of_issued"+i+"_id").each(function() {
                         $(this).siblings(".select2-container").css('border', '1px solid red');
                       });
                   }else{
                       $("#infant_country_of_issued"+i+"_id").each(function() {
                         $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                       });
                   }
               }
               else if(is_international == 'true'){
                    error_log += 'Please change identity to Passport for passenger infant '+i+'!</br>\n';
                    $("#infant_id_type"+i).each(function() {
                         $(this).parent().find('.nice-select').css('border', '1px solid red');
                    });
               }
           }else{
                if(document.getElementById('infant_id_type'+i).value != ''){
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
       }else{
           if(document.getElementById('infant_valid_passport'+i))
               if(document.getElementById('infant_valid_passport'+i).checked)
                   list_identity_need_update.push('infant_'+i)
       }
   }
//   if(error_log != ''){
       // kalau ada error lain mau notif error expired identity
//       for(i in list_identity_need_update){
//            passenger_id = list_identity_need_update[i].split('_');
//            error_log+= 'Please update passport expired date for passenger '+passenger_id[0]+' '+passenger_id[1]+'!</br>\n';
//            document.getElementById(passenger_id[0]+'_passport_expired_date'+passenger_id[1]).style['border-color'] = 'red';
//       }
//   }
    //student
    if(airline_request.hasOwnProperty('student')){
        length_name = 100;
        for(j in airline_pick){
           for(k in airline_pick[j].journeys){
                for(l in airline_pick[j].journeys[k].carrier_code_list){
                    if(length_name > airline_carriers[airline_pick[j].journeys[k].carrier_code_list[l]].adult_length_name)
                        length_name = airline_carriers[airline_pick[j].journeys[k].carrier_code_list[l]].adult_length_name;
                }
           }
       }

        for(i=1;i<=airline_request.student;i++){
           if(check_name(document.getElementById('student_title'+i).value,
           document.getElementById('student_first_name'+i).value,
           document.getElementById('student_last_name'+i).value,
           length_name) == false){
               error_log+= 'Total of student '+i+' name maximum '+length_name+' characters!</br>\n';
               document.getElementById('student_first_name'+i).style['border-color'] = 'red';
               document.getElementById('student_last_name'+i).style['border-color'] = 'red';
           }else{
               document.getElementById('student_first_name'+i).style['border-color'] = '#EFEFEF';
               document.getElementById('student_last_name'+i).style['border-color'] = '#EFEFEF';
           }if(document.getElementById('student_title'+i).value == ''){
                error_log+= 'Please choose title of student passenger '+i+'!</br>\n';
                $("#student_title"+i).each(function() {
                    $(this).parent().find('.nice-select').css('border', '0px solid red');
                });
           }else{
               $("#student_title"+i).each(function() {
                    $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                });
           }
           if(document.getElementById('student_first_name'+i).value == '' || check_word(document.getElementById('student_first_name'+i).value) == false){
               if(document.getElementById('student_first_name'+i).value == '')
                   error_log+= 'Please input first name of student passenger '+i+'!</br>\n';
               else if(check_word(document.getElementById('student_first_name'+i).value) == false){
                   error_log+= 'Please use alpha characters first name of student passenger '+i+'!</br>\n';
                   document.getElementById('student_first_name'+i).style['border-color'] = 'red';
               }
           }else{
               document.getElementById('student_first_name'+i).style['border-color'] = '#EFEFEF';
           }
           //check lastname
           // no check update 10 jan 2023 IVAN case A JAN
    //       if(check_name_airline(document.getElementById('student_first_name'+i).value, document.getElementById('student_last_name'+i).value) != ''){
    //           error_log+= 'Please '+check_name_airline(document.getElementById('student_first_name'+i).value, document.getElementById('student_last_name'+i).value)+' student passenger '+i+'!</br>\n';
    //           document.getElementById('student_last_name'+i).style['border-color'] = 'red';
    //       }else{
    //           document.getElementById('student_last_name'+i).style['border-color'] = '#EFEFEF';
    //       }
           if(check_date(document.getElementById('student_birth_date'+i).value)==false){
               error_log+= 'Birth date wrong for passenger student '+i+'!</br>\n';
               document.getElementById('student_birth_date'+i).style['border-color'] = 'red';
           }else{
               duration = moment.duration(moment(document.getElementById('student_birth_date'+i).value).diff(last_departure_date));
               if(duration._data.years <= -12 == false){ //check age
                    error_log+= 'Age wrong for passenger student '+i+', minimum 2 years old and maximum 11 years old!</br>\n';
                    document.getElementById('student_birth_date'+i).style['border-color'] = 'red';
               }else{
                    document.getElementById('student_birth_date'+i).style['border-color'] = '#EFEFEF';
               }
           }if(document.getElementById('student_nationality'+i+'_id').value == ''){
               error_log+= 'Please fill nationality for passenger student '+i+'!</br>\n';
               document.getElementById('student_nationality'+i+'_id').style['border-color'] = 'red';
           }else{
               if(is_identity_required == 'true' && document.getElementById('student_identity_div'+i).style.display == 'block')
                   if(document.getElementById('student_id_type'+i).value == ''){
                        error_log+= 'Please fill id type for passenger student '+i+'!</br>\n';
                        document.getElementById('student_id_type'+i).style['border-color'] = 'red';
                   }
               document.getElementById('student_nationality'+i+'_id').style['border-color'] = '#EFEFEF';
           }

           if(document.getElementById('student_identity_div'+i).style.display == 'block'){
               if(document.getElementById('student_id_type'+i).value != ''){
                   document.getElementById('student_id_type'+i).style['border-color'] = '#EFEFEF';
    //               if(document.getElementById('student_nationality'+i).value == 'Indonesia'){
    //                   //indonesia
    //                   if(document.getElementById('student_id_type'+i).value == 'ktp' && is_international == 'false'){
    //                        document.getElementById('student_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
    //                        $("#student_id_type"+i).each(function() {
    //                            $(this).parent().find('.nice-select').css('border', '1px solid red');
    //                        });
    //                        if(check_ktp(document.getElementById('student_passport_number'+i).value) == false){
    //                           error_log+= 'Please fill id number, nik only contain 16 digits for passenger student '+i+'!</br>\n';
    //                           document.getElementById('student_passport_number'+i).style['border-color'] = 'red';
    //                        }else{
    //                           document.getElementById('student_passport_number'+i).style['border-color'] = '#EFEFEF';
    //                        }if(document.getElementById('student_country_of_issued'+i).value == '' || document.getElementById('student_country_of_issued'+i).value == 'Country of Issued'){
    //                           error_log+= 'Please fill country of issued for passenger student '+i+'!</br>\n';
    //                           $("#student_country_of_issued"+i+"_id").each(function() {
    //                             $(this).siblings(".select2-container").css('border', '1px solid red');
    //                           });
    //                        }else{
    //                           $("#student_country_of_issued"+i+"_id").each(function() {
    //                             $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
    //                           });
    //                        }
    //                   }
    //                   else if(document.getElementById('student_id_type'+i).value == 'passport' && is_international == 'true'){
    //                       $("#student_id_type"+i).each(function() {
    //                           $(this).parent().find('.nice-select').css('border', '0px solid red');
    //                       });
    //                       if(document.getElementById('student_id_type'+i).value == 'passport' && check_passport(document.getElementById('student_passport_number'+i).value) == false){
    //                           error_log+= 'Please fill id number, passport only contain more than 6 digits  for passenger student '+i+'!</br>\n';
    //                           document.getElementById('student_passport_number'+i).style['border-color'] = 'red';
    //                       }else{
    //                           document.getElementById('student_passport_number'+i).style['border-color'] = '#EFEFEF';
    //                       }
    //                       if(document.getElementById('student_passport_expired_date'+i).value == ''){
    //                           error_log+= 'Please fill passport expired date for passenger student '+i+'!</br>\n';
    //                           document.getElementById('student_passport_expired_date'+i).style['border-color'] = 'red';
    //                       }else{
    //                           duration = moment.duration(moment(document.getElementById('student_passport_expired_date'+i).value).diff(last_departure_date));
    //                           //CHECK EXPIRED
    //                           if(duration._milliseconds < 0 ){
    //                                list_identity_need_update.push('student_'+i);
    ////                                error_log+= 'Please update passport expired date for passenger student '+i+'!</br>\n';
    ////                                document.getElementById('student_passport_expired_date'+i).style['border-color'] = 'red';
    //                           }else
    //                                document.getElementById('student_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
    //                       }if(document.getElementById('student_country_of_issued'+i).value == '' || document.getElementById('student_country_of_issued'+i).value == 'Country of Issued'){
    //                           error_log+= 'Please fill country of issued for passenger student '+i+'!</br>\n';
    //                           $("#student_country_of_issued"+i+"_id").each(function() {
    //                             $(this).siblings(".select2-container").css('border', '1px solid red');
    //                           });
    //
    //                       }else{
    //                           $("#student_country_of_issued"+i+"_id").each(function() {
    //                             $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
    //                           });
    //
    //                       }
    //                   }
    //                   else if(is_international == 'false'){
    //                        error_log += 'Please change identity to NIK for passenger student '+i+'!</br>\n';
    //                        $("#student_id_type"+i).each(function() {
    //                            $(this).parent().find('.nice-select').css('border', '1px solid red');
    //                        });
    //                   }else if(is_international == 'true'){
    //                        error_log += 'Please change identity to Passport for passenger student '+i+'!</br>\n';
    //                        $("#student_id_type"+i).each(function() {
    //                            $(this).parent().find('.nice-select').css('border', '1px solid red');
    //                        });
    //                   }
    //               }
    //               else{
    //                   //foreign
    //                   if(document.getElementById('student_id_type'+i).value == 'passport'){
    //                       $("#student_id_type"+i).each(function() {
    //                           $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
    //                       });
    //                       if(document.getElementById('student_id_type'+i).value == 'passport' && check_passport(document.getElementById('student_passport_number'+i).value) == false){
    //                           error_log+= 'Please fill id number, passport only contain more than 6 digits  for passenger student '+i+'!</br>\n';
    //                           document.getElementById('student_passport_number'+i).style['border-color'] = 'red';
    //                       }else{
    //                           document.getElementById('student_passport_number'+i).style['border-color'] = '#EFEFEF';
    //                       }
    //                       if(document.getElementById('student_passport_expired_date'+i).value == ''){
    //                           error_log+= 'Please fill passport expired date for passenger student '+i+'!</br>\n';
    //                           document.getElementById('student_passport_expired_date'+i).style['border-color'] = 'red';
    //                       }else{
    //                           duration = moment.duration(moment(document.getElementById('student_passport_expired_date'+i).value).diff(last_departure_date));
    //                           //CHECK EXPIRED
    //                           if(duration._milliseconds < 0 ){
    //                                list_identity_need_update.push('student_'+i);
    ////                                error_log+= 'Please update passport expired date for passenger student '+i+'!</br>\n';
    ////                                document.getElementById('student_passport_expired_date'+i).style['border-color'] = 'red';
    //                           }else
    //                                document.getElementById('student_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
    //                       }if(document.getElementById('student_country_of_issued'+i).value == ''){
    //                           error_log+= 'Please fill country of issued for passenger student '+i+'!</br>\n';
    //                           $("#student_country_of_issued"+i+"_id").each(function() {
    //                             $(this).siblings(".select2-container").css('border', '1px solid red');
    //                           });
    //
    //                       }else{
    //                           $("#student_country_of_issued"+i+"_id").each(function() {
    //                             $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
    //                           });
    //
    //                       }
    //                   }else{
    //                       error_log+= 'Please change identity type to Passport for passenger student '+i+'!</br>\n';
    //                   }
    //               }
                   // IVAN 17 okt 2022 open all passenger nationality, kalau inter harus passport
                   if(document.getElementById('student_id_type'+i).value == 'ktp' && is_international == 'false'){
                        document.getElementById('student_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
                        $("#student_id_type"+i).each(function() {
                            $(this).parent().find('.nice-select').css('border', '1px solid red');
                        });
                        if(check_ktp(document.getElementById('student_passport_number'+i).value) == false){
                           error_log+= 'Please fill id number, nik only contain 16 digits for passenger student '+i+'!</br>\n';
                           document.getElementById('student_passport_number'+i).style['border-color'] = 'red';
                        }else{
                           document.getElementById('student_passport_number'+i).style['border-color'] = '#EFEFEF';
                        }if(document.getElementById('student_country_of_issued'+i+'_id').value == ''){
                           error_log+= 'Please fill country of issued for passenger student '+i+'!</br>\n';
                           $("#student_country_of_issued"+i+"_id").each(function() {
                             $(this).siblings(".select2-container").css('border', '1px solid red');
                           });
                        }else{
                           $("#student_country_of_issued"+i+"_id").each(function() {
                             $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                           });
                        }
                   }
                   else if(document.getElementById('student_id_type'+i).value == 'passport'){
                       $("#student_id_type"+i).each(function() {
                           $(this).parent().find('.nice-select').css('border', '0px solid red');
                       });
                       if(document.getElementById('student_id_type'+i).value == 'passport' && check_passport(document.getElementById('student_passport_number'+i).value) == false){
                           error_log+= 'Please fill id number, passport only contain more than 6 digits  for passenger student '+i+'!</br>\n';
                           document.getElementById('student_passport_number'+i).style['border-color'] = 'red';
                       }else{
                           document.getElementById('student_passport_number'+i).style['border-color'] = '#EFEFEF';
                       }
                       if(document.getElementById('student_passport_expired_date'+i).value == ''){
                           error_log+= 'Please fill passport expired date for passenger student '+i+'!</br>\n';
                           document.getElementById('student_passport_expired_date'+i).style['border-color'] = 'red';
                       }else{
                           duration = moment.duration(moment(document.getElementById('student_passport_expired_date'+i).value).diff(last_departure_date));
                           //CHECK EXPIRED
                           if(duration._milliseconds < 0 ){
                                list_identity_need_update.push('student_'+i);
    //                                error_log+= 'Please update passport expired date for passenger student '+i+'!</br>\n';
    //                                document.getElementById('student_passport_expired_date'+i).style['border-color'] = 'red';
                           }else
                                document.getElementById('student_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
                       }if(document.getElementById('student_country_of_issued'+i+'_id').value == ''){
                           error_log+= 'Please fill country of issued for passenger student '+i+'!</br>\n';
                           $("#student_country_of_issued"+i+"_id").each(function() {
                             $(this).siblings(".select2-container").css('border', '1px solid red');
                           });

                       }else{
                           $("#student_country_of_issued"+i+"_id").each(function() {
                             $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                           });

                       }
                   }
                   else if(is_international == 'true'){
                        error_log += 'Please change identity to Passport for passenger student '+i+'!</br>\n';
                        $("#student_id_type"+i).each(function() {
                            $(this).parent().find('.nice-select').css('border', '1px solid red');
                        });
                   }
               }else{
                   if(document.getElementById('student_id_type'+i).value != ''){
                        error_log+= 'Please choose identity type for passenger student '+i+'!</br>\n';

                        document.getElementById('student_passport_number'+i).style['border-color'] = 'red';
                        document.getElementById('student_passport_expired_date'+i).style['border-color'] = 'red';
                        $("#student_id_type"+i).each(function() {
                            $(this).parent().find('.nice-select').css('border', '1px solid red');
                        });

                        $("#student_country_of_issued"+i+"_id").each(function() {
                            $(this).siblings(".select2-container").css('border', '1px solid red');
                        });
                   }
               }
           }else{
               if(document.getElementById('student_valid_passport'+i))
                   if(document.getElementById('student_valid_passport'+i).checked)
                       list_identity_need_update.push('student_'+i)
           }
           if(typeof ff_request !== 'undefined'){
               if(ff_request.length != 0 && check_ff == 1){
                   for(j=1;j<=ff_request.length;j++){
                        index_ff = j-1;
                        if(ff_request[index_ff].hasOwnProperty('error_code') == false){
                            error_ff = true
                            ff_required = false;
//                            for(k in ff_request[index_ff].carrier_codes){
//                                if(airline_carriers[ff_request[index_ff].carrier_codes[k]].hasOwnProperty('required_frequent_flyer') && airline_carriers[ff_request[index_ff].carrier_codes[k]].required_frequent_flyer){
//                                    ff_required = airline_carriers[ff_request[index_ff].carrier_codes[k]].required_frequent_flyer;
//                                    break;
//                                }
//                            }
                            if(ff_required && document.getElementById('student_ff_request'+i+'_'+j + '_id').value == '' && document.getElementById('student_ff_number'+i+'_'+j).value == ''){
                                error_log+= 'Please choose Frequent Flyer Program Journey '+j+' for passenger student '+i+'!</br>\n';
                                error_log+= 'Please fill Frequent Flyer Number '+j+' for passenger student '+i+'!</br>\n';
                                $("#student_ff_request"+i+'_'+j+'_id').each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid red');
                                });
                                document.getElementById('student_ff_number'+i+'_'+j).style['border-color'] = 'red';
                            }else if(ff_required && document.getElementById('student_ff_request'+i+'_'+j + '_id').value == ''){
                                error_log+= 'Please choose Frequent Flyer Program Journey '+j+' for passenger student '+i+'!</br>\n';
                                $("#student_ff_request"+i+'_'+j+'_id').each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid red');
                                });
                            }else if(ff_required && document.getElementById('student_ff_number'+i+'_'+j).value == ''){
                                error_log+= 'Please fill Frequent Flyer Number '+j+' for passenger student '+i+'!</br>\n';
                                document.getElementById('student_ff_number'+i+'_'+j).style['border-color'] = 'red';
                            }
                            else if(document.getElementById('student_ff_request'+i+'_'+j + '_id').value != '' && document.getElementById('student_ff_number'+i+'_'+j).value != '')
                                error_ff = false
                            else if(document.getElementById('student_ff_request'+i+'_'+j + '_id').value == '' && document.getElementById('student_ff_number'+i+'_'+j).value != ''){
                                error_log+= 'Please choose Frequent Flyer Program Journey '+j+' for passenger student '+i+'!</br>\n';
                                document.getElementById('student_ff_number'+i+'_'+j).style['border-color'] = 'red';
                            }else if(document.getElementById('student_ff_request'+i+'_'+j + '_id').value != '' && document.getElementById('student_ff_number'+i+'_'+j).value == '' &&
                                document.getElementById('student_ff_request'+i+'_'+j + '_id').value != '' && document.getElementById('student_ff_number'+i+'_'+j).value == ''){
                                error_log+= 'Please fill Frequent Flyer Number '+j+' for passenger student '+i+'!</br>\n';
                                document.getElementById('student_ff_number'+i+'_'+j).style['border-color'] = 'red';
                            }else{
                                error_ff = false
                            }
                            if(error_ff == false){
                                document.getElementById('student_ff_number'+i+'_'+j).style['border-color'] = '#EFEFEF';
                                document.getElementById('student_ff_request'+i+'_'+j + '_id').style['border-color'] = '#EFEFEF';
                            }
                        }
                   }
               }
           }
       }
    }

    //seaman
    if(airline_request.hasOwnProperty('seaman')){
        length_name = 100;
        for(j in airline_pick){
           for(k in airline_pick[j].journeys){
                for(l in airline_pick[j].journeys[k].carrier_code_list){
                    if(length_name > airline_carriers[airline_pick[j].journeys[k].carrier_code_list[l]].adult_length_name)
                        length_name = airline_carriers[airline_pick[j].journeys[k].carrier_code_list[l]].adult_length_name;
                }
           }
       }

        for(i=1;i<=airline_request.seaman;i++){
           if(check_name(document.getElementById('seaman_title'+i).value,
           document.getElementById('seaman_first_name'+i).value,
           document.getElementById('seaman_last_name'+i).value,
           length_name) == false){
               error_log+= 'Total of seaman '+i+' name maximum '+length_name+' characters!</br>\n';
               document.getElementById('seaman_first_name'+i).style['border-color'] = 'red';
               document.getElementById('seaman_last_name'+i).style['border-color'] = 'red';
           }else{
               document.getElementById('seaman_first_name'+i).style['border-color'] = '#EFEFEF';
               document.getElementById('seaman_last_name'+i).style['border-color'] = '#EFEFEF';
           }if(document.getElementById('seaman_title'+i).value == ''){
                error_log+= 'Please choose title of seaman passenger '+i+'!</br>\n';
                $("#seaman_title"+i).each(function() {
                    $(this).parent().find('.nice-select').css('border', '0px solid red');
                });
           }else{
               $("#seaman_title"+i).each(function() {
                    $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                });
           }
           if(document.getElementById('seaman_first_name'+i).value == '' || check_word(document.getElementById('seaman_first_name'+i).value) == false){
               if(document.getElementById('seaman_first_name'+i).value == '')
                   error_log+= 'Please input first name of seaman passenger '+i+'!</br>\n';
               else if(check_word(document.getElementById('seaman_first_name'+i).value) == false){
                   error_log+= 'Please use alpha characters first name of seaman passenger '+i+'!</br>\n';
                   document.getElementById('seaman_first_name'+i).style['border-color'] = 'red';
               }
           }else{
               document.getElementById('seaman_first_name'+i).style['border-color'] = '#EFEFEF';
           }
           //check lastname
           // no check update 10 jan 2023 IVAN case A JAN
    //       if(check_name_airline(document.getElementById('seaman_first_name'+i).value, document.getElementById('seaman_last_name'+i).value) != ''){
    //           error_log+= 'Please '+check_name_airline(document.getElementById('seaman_first_name'+i).value, document.getElementById('seaman_last_name'+i).value)+' seaman passenger '+i+'!</br>\n';
    //           document.getElementById('seaman_last_name'+i).style['border-color'] = 'red';
    //       }else{
    //           document.getElementById('seaman_last_name'+i).style['border-color'] = '#EFEFEF';
    //       }
           if(check_date(document.getElementById('seaman_birth_date'+i).value)==false){
               error_log+= 'Birth date wrong for passenger seaman '+i+'!</br>\n';
               document.getElementById('seaman_birth_date'+i).style['border-color'] = 'red';
           }else{
               duration = moment.duration(moment(document.getElementById('seaman_birth_date'+i).value).diff(last_departure_date));
               if(duration._data.years <= -12 == false){ //check age
                    error_log+= 'Age wrong for passenger seaman '+i+', minimum 2 years old and maximum 11 years old!</br>\n';
                    document.getElementById('seaman_birth_date'+i).style['border-color'] = 'red';
               }else{
                    document.getElementById('seaman_birth_date'+i).style['border-color'] = '#EFEFEF';
               }
           }if(document.getElementById('seaman_nationality'+i+'_id').value == ''){
               error_log+= 'Please fill nationality for passenger seaman '+i+'!</br>\n';
               document.getElementById('seaman_nationality'+i+'_id').style['border-color'] = 'red';
           }else{
               if(is_identity_required == 'true' && document.getElementById('seaman_identity_div'+i).style.display == 'block')
                   if(document.getElementById('seaman_id_type'+i).value == ''){
                        error_log+= 'Please fill id type for passenger seaman '+i+'!</br>\n';
                        document.getElementById('seaman_id_type'+i).style['border-color'] = 'red';
                   }
               document.getElementById('seaman_nationality'+i+'_id').style['border-color'] = '#EFEFEF';
           }

           if(document.getElementById('seaman_identity_div'+i).style.display == 'block'){
               if(document.getElementById('seaman_id_type'+i).value != ''){
                   document.getElementById('seaman_id_type'+i).style['border-color'] = '#EFEFEF';
    //               if(document.getElementById('seaman_nationality'+i).value == 'Indonesia'){
    //                   //indonesia
    //                   if(document.getElementById('seaman_id_type'+i).value == 'ktp' && is_international == 'false'){
    //                        document.getElementById('seaman_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
    //                        $("#seaman_id_type"+i).each(function() {
    //                            $(this).parent().find('.nice-select').css('border', '1px solid red');
    //                        });
    //                        if(check_ktp(document.getElementById('seaman_passport_number'+i).value) == false){
    //                           error_log+= 'Please fill id number, nik only contain 16 digits for passenger seaman '+i+'!</br>\n';
    //                           document.getElementById('seaman_passport_number'+i).style['border-color'] = 'red';
    //                        }else{
    //                           document.getElementById('seaman_passport_number'+i).style['border-color'] = '#EFEFEF';
    //                        }if(document.getElementById('seaman_country_of_issued'+i).value == '' || document.getElementById('seaman_country_of_issued'+i).value == 'Country of Issued'){
    //                           error_log+= 'Please fill country of issued for passenger seaman '+i+'!</br>\n';
    //                           $("#seaman_country_of_issued"+i+"_id").each(function() {
    //                             $(this).siblings(".select2-container").css('border', '1px solid red');
    //                           });
    //                        }else{
    //                           $("#seaman_country_of_issued"+i+"_id").each(function() {
    //                             $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
    //                           });
    //                        }
    //                   }
    //                   else if(document.getElementById('seaman_id_type'+i).value == 'passport' && is_international == 'true'){
    //                       $("#seaman_id_type"+i).each(function() {
    //                           $(this).parent().find('.nice-select').css('border', '0px solid red');
    //                       });
    //                       if(document.getElementById('seaman_id_type'+i).value == 'passport' && check_passport(document.getElementById('seaman_passport_number'+i).value) == false){
    //                           error_log+= 'Please fill id number, passport only contain more than 6 digits  for passenger seaman '+i+'!</br>\n';
    //                           document.getElementById('seaman_passport_number'+i).style['border-color'] = 'red';
    //                       }else{
    //                           document.getElementById('seaman_passport_number'+i).style['border-color'] = '#EFEFEF';
    //                       }
    //                       if(document.getElementById('seaman_passport_expired_date'+i).value == ''){
    //                           error_log+= 'Please fill passport expired date for passenger seaman '+i+'!</br>\n';
    //                           document.getElementById('seaman_passport_expired_date'+i).style['border-color'] = 'red';
    //                       }else{
    //                           duration = moment.duration(moment(document.getElementById('seaman_passport_expired_date'+i).value).diff(last_departure_date));
    //                           //CHECK EXPIRED
    //                           if(duration._milliseconds < 0 ){
    //                                list_identity_need_update.push('seaman_'+i);
    ////                                error_log+= 'Please update passport expired date for passenger seaman '+i+'!</br>\n';
    ////                                document.getElementById('seaman_passport_expired_date'+i).style['border-color'] = 'red';
    //                           }else
    //                                document.getElementById('seaman_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
    //                       }if(document.getElementById('seaman_country_of_issued'+i).value == '' || document.getElementById('seaman_country_of_issued'+i).value == 'Country of Issued'){
    //                           error_log+= 'Please fill country of issued for passenger seaman '+i+'!</br>\n';
    //                           $("#seaman_country_of_issued"+i+"_id").each(function() {
    //                             $(this).siblings(".select2-container").css('border', '1px solid red');
    //                           });
    //
    //                       }else{
    //                           $("#seaman_country_of_issued"+i+"_id").each(function() {
    //                             $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
    //                           });
    //
    //                       }
    //                   }
    //                   else if(is_international == 'false'){
    //                        error_log += 'Please change identity to NIK for passenger seaman '+i+'!</br>\n';
    //                        $("#seaman_id_type"+i).each(function() {
    //                            $(this).parent().find('.nice-select').css('border', '1px solid red');
    //                        });
    //                   }else if(is_international == 'true'){
    //                        error_log += 'Please change identity to Passport for passenger seaman '+i+'!</br>\n';
    //                        $("#seaman_id_type"+i).each(function() {
    //                            $(this).parent().find('.nice-select').css('border', '1px solid red');
    //                        });
    //                   }
    //               }
    //               else{
    //                   //foreign
    //                   if(document.getElementById('seaman_id_type'+i).value == 'passport'){
    //                       $("#seaman_id_type"+i).each(function() {
    //                           $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
    //                       });
    //                       if(document.getElementById('seaman_id_type'+i).value == 'passport' && check_passport(document.getElementById('seaman_passport_number'+i).value) == false){
    //                           error_log+= 'Please fill id number, passport only contain more than 6 digits  for passenger seaman '+i+'!</br>\n';
    //                           document.getElementById('seaman_passport_number'+i).style['border-color'] = 'red';
    //                       }else{
    //                           document.getElementById('seaman_passport_number'+i).style['border-color'] = '#EFEFEF';
    //                       }
    //                       if(document.getElementById('seaman_passport_expired_date'+i).value == ''){
    //                           error_log+= 'Please fill passport expired date for passenger seaman '+i+'!</br>\n';
    //                           document.getElementById('seaman_passport_expired_date'+i).style['border-color'] = 'red';
    //                       }else{
    //                           duration = moment.duration(moment(document.getElementById('seaman_passport_expired_date'+i).value).diff(last_departure_date));
    //                           //CHECK EXPIRED
    //                           if(duration._milliseconds < 0 ){
    //                                list_identity_need_update.push('seaman_'+i);
    ////                                error_log+= 'Please update passport expired date for passenger seaman '+i+'!</br>\n';
    ////                                document.getElementById('seaman_passport_expired_date'+i).style['border-color'] = 'red';
    //                           }else
    //                                document.getElementById('seaman_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
    //                       }if(document.getElementById('seaman_country_of_issued'+i).value == ''){
    //                           error_log+= 'Please fill country of issued for passenger seaman '+i+'!</br>\n';
    //                           $("#seaman_country_of_issued"+i+"_id").each(function() {
    //                             $(this).siblings(".select2-container").css('border', '1px solid red');
    //                           });
    //
    //                       }else{
    //                           $("#seaman_country_of_issued"+i+"_id").each(function() {
    //                             $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
    //                           });
    //
    //                       }
    //                   }else{
    //                       error_log+= 'Please change identity type to Passport for passenger seaman '+i+'!</br>\n';
    //                   }
    //               }
                   // IVAN 17 okt 2022 open all passenger nationality, kalau inter harus passport
                   if(document.getElementById('seaman_id_type'+i).value == 'ktp' && is_international == 'false'){
                        document.getElementById('seaman_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
                        $("#seaman_id_type"+i).each(function() {
                            $(this).parent().find('.nice-select').css('border', '1px solid red');
                        });
                        if(check_ktp(document.getElementById('seaman_passport_number'+i).value) == false){
                           error_log+= 'Please fill id number, nik only contain 16 digits for passenger seaman '+i+'!</br>\n';
                           document.getElementById('seaman_passport_number'+i).style['border-color'] = 'red';
                        }else{
                           document.getElementById('seaman_passport_number'+i).style['border-color'] = '#EFEFEF';
                        }if(document.getElementById('seaman_country_of_issued'+i+'_id').value == ''){
                           error_log+= 'Please fill country of issued for passenger seaman '+i+'!</br>\n';
                           $("#seaman_country_of_issued"+i+"_id").each(function() {
                             $(this).siblings(".select2-container").css('border', '1px solid red');
                           });
                        }else{
                           $("#seaman_country_of_issued"+i+"_id").each(function() {
                             $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                           });
                        }
                   }
                   else if(document.getElementById('seaman_id_type'+i).value == 'passport'){
                       $("#seaman_id_type"+i).each(function() {
                           $(this).parent().find('.nice-select').css('border', '0px solid red');
                       });
                       if(document.getElementById('seaman_id_type'+i).value == 'passport' && check_passport(document.getElementById('seaman_passport_number'+i).value) == false){
                           error_log+= 'Please fill id number, passport only contain more than 6 digits  for passenger seaman '+i+'!</br>\n';
                           document.getElementById('seaman_passport_number'+i).style['border-color'] = 'red';
                       }else{
                           document.getElementById('seaman_passport_number'+i).style['border-color'] = '#EFEFEF';
                       }
                       if(document.getElementById('seaman_passport_expired_date'+i).value == ''){
                           error_log+= 'Please fill passport expired date for passenger seaman '+i+'!</br>\n';
                           document.getElementById('seaman_passport_expired_date'+i).style['border-color'] = 'red';
                       }else{
                           duration = moment.duration(moment(document.getElementById('seaman_passport_expired_date'+i).value).diff(last_departure_date));
                           //CHECK EXPIRED
                           if(duration._milliseconds < 0 ){
                                list_identity_need_update.push('seaman_'+i);
    //                                error_log+= 'Please update passport expired date for passenger seaman '+i+'!</br>\n';
    //                                document.getElementById('seaman_passport_expired_date'+i).style['border-color'] = 'red';
                           }else
                                document.getElementById('seaman_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
                       }if(document.getElementById('seaman_country_of_issued'+i+'_id').value == ''){
                           error_log+= 'Please fill country of issued for passenger seaman '+i+'!</br>\n';
                           $("#seaman_country_of_issued"+i+"_id").each(function() {
                             $(this).siblings(".select2-container").css('border', '1px solid red');
                           });

                       }else{
                           $("#seaman_country_of_issued"+i+"_id").each(function() {
                             $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                           });

                       }
                   }
                   else if(is_international == 'true'){
                        error_log += 'Please change identity to Passport for passenger seaman '+i+'!</br>\n';
                        $("#seaman_id_type"+i).each(function() {
                            $(this).parent().find('.nice-select').css('border', '1px solid red');
                        });
                   }
               }else{
                    if(document.getElementById('seaman_id_type'+i).value != ''){
                        error_log+= 'Please choose identity type for passenger seaman '+i+'!</br>\n';

                        document.getElementById('seaman_passport_number'+i).style['border-color'] = 'red';
                        document.getElementById('seaman_passport_expired_date'+i).style['border-color'] = 'red';
                        $("#seaman_id_type"+i).each(function() {
                            $(this).parent().find('.nice-select').css('border', '1px solid red');
                        });

                        $("#seaman_country_of_issued"+i+"_id").each(function() {
                            $(this).siblings(".select2-container").css('border', '1px solid red');
                        });
                    }
               }
           }else{
               if(document.getElementById('seaman_valid_passport'+i))
                   if(document.getElementById('seaman_valid_passport'+i).checked)
                       list_identity_need_update.push('seaman_'+i)
           }
           if(typeof ff_request !== 'undefined'){
               if(ff_request.length != 0 && check_ff == 1){
                   for(j=1;j<=ff_request.length;j++){
                        index_ff = j-1;
                        if(ff_request[index_ff].hasOwnProperty('error_code') == false){
                            error_ff = true
                            ff_required = false;
//                            for(k in ff_request[index_ff].carrier_codes){
//                                if(airline_carriers[ff_request[index_ff].carrier_codes[k]].hasOwnProperty('required_frequent_flyer') && airline_carriers[ff_request[index_ff].carrier_codes[k]].required_frequent_flyer){
//                                    ff_required = airline_carriers[ff_request[index_ff].carrier_codes[k]].required_frequent_flyer;
//                                    break;
//                                }
//                            }
                            if(ff_required && document.getElementById('seaman_ff_request'+i+'_'+j + '_id').value == '' && document.getElementById('seaman_ff_number'+i+'_'+j).value == ''){
                                error_log+= 'Please choose Frequent Flyer Program Journey '+j+' for passenger seaman '+i+'!</br>\n';
                                error_log+= 'Please fill Frequent Flyer Number '+j+' for passenger seaman '+i+'!</br>\n';
                                $("#seaman_ff_request"+i+'_'+j+'_id').each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid red');
                                });
                                document.getElementById('seaman_ff_number'+i+'_'+j).style['border-color'] = 'red';
                            }else if(ff_required && document.getElementById('seaman_ff_request'+i+'_'+j + '_id').value == ''){
                                error_log+= 'Please choose Frequent Flyer Program Journey '+j+' for passenger seaman '+i+'!</br>\n';
                                $("#seaman_ff_request"+i+'_'+j+'_id').each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid red');
                                });
                            }else if(ff_required && document.getElementById('seaman_ff_number'+i+'_'+j).value == ''){
                                error_log+= 'Please fill Frequent Flyer Number '+j+' for passenger seaman '+i+'!</br>\n';
                                document.getElementById('seaman_ff_number'+i+'_'+j).style['border-color'] = 'red';
                            }
                            else if(document.getElementById('seaman_ff_request'+i+'_'+j + '_id').value != '' && document.getElementById('seaman_ff_number'+i+'_'+j).value != '')
                                error_ff = false
                            else if(document.getElementById('seaman_ff_request'+i+'_'+j + '_id').value == '' && document.getElementById('seaman_ff_number'+i+'_'+j).value != ''){
                                error_log+= 'Please choose Frequent Flyer Program Journey '+j+' for passenger seaman '+i+'!</br>\n';
                                document.getElementById('seaman_ff_number'+i+'_'+j).style['border-color'] = 'red';
                            }else if(document.getElementById('seaman_ff_request'+i+'_'+j + '_id').value != '' && document.getElementById('seaman_ff_number'+i+'_'+j).value == '' &&
                                document.getElementById('seaman_ff_request'+i+'_'+j + '_id').value != '' && document.getElementById('seaman_ff_number'+i+'_'+j).value == ''){
                                error_log+= 'Please fill Frequent Flyer Number '+j+' for passenger seaman '+i+'!</br>\n';
                                document.getElementById('seaman_ff_number'+i+'_'+j).style['border-color'] = 'red';
                            }else{
                                error_ff = false
                            }
                            if(error_ff == false){
                                document.getElementById('seaman_ff_number'+i+'_'+j).style['border-color'] = '#EFEFEF';
                                document.getElementById('seaman_ff_request'+i+'_'+j + '_id').style['border-color'] = '#EFEFEF';
                            }
                        }
                   }
               }
           }
       }
    }

    //labour
    if(airline_request.hasOwnProperty('labour')){
        length_name = 100;
        for(j in airline_pick){
           for(k in airline_pick[j].journeys){
                for(l in airline_pick[j].journeys[k].carrier_code_list){
                    if(length_name > airline_carriers[airline_pick[j].journeys[k].carrier_code_list[l]].adult_length_name)
                        length_name = airline_carriers[airline_pick[j].journeys[k].carrier_code_list[l]].adult_length_name;
                }
           }
        }

        for(i=1;i<=airline_request.labour;i++){
           if(check_name(document.getElementById('labour_title'+i).value,
           document.getElementById('labour_first_name'+i).value,
           document.getElementById('labour_last_name'+i).value,
           length_name) == false){
               error_log+= 'Total of labour '+i+' name maximum '+length_name+' characters!</br>\n';
               document.getElementById('labour_first_name'+i).style['border-color'] = 'red';
               document.getElementById('labour_last_name'+i).style['border-color'] = 'red';
           }else{
               document.getElementById('labour_first_name'+i).style['border-color'] = '#EFEFEF';
               document.getElementById('labour_last_name'+i).style['border-color'] = '#EFEFEF';
           }if(document.getElementById('labour_title'+i).value == ''){
                error_log+= 'Please choose title of labour passenger '+i+'!</br>\n';
                $("#labour_title"+i).each(function() {
                    $(this).parent().find('.nice-select').css('border', '0px solid red');
                });
           }else{
               $("#labour_title"+i).each(function() {
                    $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                });
           }
           if(document.getElementById('labour_first_name'+i).value == '' || check_word(document.getElementById('labour_first_name'+i).value) == false){
               if(document.getElementById('labour_first_name'+i).value == '')
                   error_log+= 'Please input first name of labour passenger '+i+'!</br>\n';
               else if(check_word(document.getElementById('labour_first_name'+i).value) == false){
                   error_log+= 'Please use alpha characters first name of labour passenger '+i+'!</br>\n';
                   document.getElementById('labour_first_name'+i).style['border-color'] = 'red';
               }
           }else{
               document.getElementById('labour_first_name'+i).style['border-color'] = '#EFEFEF';
           }
           //check lastname
           // no check update 10 jan 2023 IVAN case A JAN
    //       if(check_name_airline(document.getElementById('labour_first_name'+i).value, document.getElementById('labour_last_name'+i).value) != ''){
    //           error_log+= 'Please '+check_name_airline(document.getElementById('labour_first_name'+i).value, document.getElementById('labour_last_name'+i).value)+' labour passenger '+i+'!</br>\n';
    //           document.getElementById('labour_last_name'+i).style['border-color'] = 'red';
    //       }else{
    //           document.getElementById('labour_last_name'+i).style['border-color'] = '#EFEFEF';
    //       }
           if(check_date(document.getElementById('labour_birth_date'+i).value)==false){
               error_log+= 'Birth date wrong for passenger labour '+i+'!</br>\n';
               document.getElementById('labour_birth_date'+i).style['border-color'] = 'red';
           }else{
               duration = moment.duration(moment(document.getElementById('labour_birth_date'+i).value).diff(last_departure_date));
               if(duration._data.years <= -12 == false){ //check age
                    error_log+= 'Age wrong for passenger labour '+i+', minimum 2 years old and maximum 11 years old!</br>\n';
                    document.getElementById('labour_birth_date'+i).style['border-color'] = 'red';
               }else{
                    document.getElementById('labour_birth_date'+i).style['border-color'] = '#EFEFEF';
               }
           }if(document.getElementById('labour_nationality'+i+'_id').value == ''){
               error_log+= 'Please fill nationality for passenger labour '+i+'!</br>\n';
               document.getElementById('labour_nationality'+i+'_id').style['border-color'] = 'red';
           }else{
               if(is_identity_required == 'true' && document.getElementById('labour_identity_div'+i).style.display == 'block')
                   if(document.getElementById('labour_id_type'+i).value == ''){
                        error_log+= 'Please fill id type for passenger labour '+i+'!</br>\n';
                        document.getElementById('labour_id_type'+i).style['border-color'] = 'red';
                   }
               document.getElementById('labour_nationality'+i+'_id').style['border-color'] = '#EFEFEF';
           }

           if(document.getElementById('labour_identity_div'+i).style.display == 'block'){
               if(document.getElementById('labour_id_type'+i).value != ''){
                   document.getElementById('labour_id_type'+i).style['border-color'] = '#EFEFEF';
    //               if(document.getElementById('labour_nationality'+i).value == 'Indonesia'){
    //                   //indonesia
    //                   if(document.getElementById('labour_id_type'+i).value == 'ktp' && is_international == 'false'){
    //                        document.getElementById('labour_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
    //                        $("#labour_id_type"+i).each(function() {
    //                            $(this).parent().find('.nice-select').css('border', '1px solid red');
    //                        });
    //                        if(check_ktp(document.getElementById('labour_passport_number'+i).value) == false){
    //                           error_log+= 'Please fill id number, nik only contain 16 digits for passenger labour '+i+'!</br>\n';
    //                           document.getElementById('labour_passport_number'+i).style['border-color'] = 'red';
    //                        }else{
    //                           document.getElementById('labour_passport_number'+i).style['border-color'] = '#EFEFEF';
    //                        }if(document.getElementById('labour_country_of_issued'+i).value == '' || document.getElementById('labour_country_of_issued'+i).value == 'Country of Issued'){
    //                           error_log+= 'Please fill country of issued for passenger labour '+i+'!</br>\n';
    //                           $("#labour_country_of_issued"+i+"_id").each(function() {
    //                             $(this).siblings(".select2-container").css('border', '1px solid red');
    //                           });
    //                        }else{
    //                           $("#labour_country_of_issued"+i+"_id").each(function() {
    //                             $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
    //                           });
    //                        }
    //                   }
    //                   else if(document.getElementById('labour_id_type'+i).value == 'passport' && is_international == 'true'){
    //                       $("#labour_id_type"+i).each(function() {
    //                           $(this).parent().find('.nice-select').css('border', '0px solid red');
    //                       });
    //                       if(document.getElementById('labour_id_type'+i).value == 'passport' && check_passport(document.getElementById('labour_passport_number'+i).value) == false){
    //                           error_log+= 'Please fill id number, passport only contain more than 6 digits  for passenger labour '+i+'!</br>\n';
    //                           document.getElementById('labour_passport_number'+i).style['border-color'] = 'red';
    //                       }else{
    //                           document.getElementById('labour_passport_number'+i).style['border-color'] = '#EFEFEF';
    //                       }
    //                       if(document.getElementById('labour_passport_expired_date'+i).value == ''){
    //                           error_log+= 'Please fill passport expired date for passenger labour '+i+'!</br>\n';
    //                           document.getElementById('labour_passport_expired_date'+i).style['border-color'] = 'red';
    //                       }else{
    //                           duration = moment.duration(moment(document.getElementById('labour_passport_expired_date'+i).value).diff(last_departure_date));
    //                           //CHECK EXPIRED
    //                           if(duration._milliseconds < 0 ){
    //                                list_identity_need_update.push('labour_'+i);
    ////                                error_log+= 'Please update passport expired date for passenger labour '+i+'!</br>\n';
    ////                                document.getElementById('labour_passport_expired_date'+i).style['border-color'] = 'red';
    //                           }else
    //                                document.getElementById('labour_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
    //                       }if(document.getElementById('labour_country_of_issued'+i).value == '' || document.getElementById('labour_country_of_issued'+i).value == 'Country of Issued'){
    //                           error_log+= 'Please fill country of issued for passenger labour '+i+'!</br>\n';
    //                           $("#labour_country_of_issued"+i+"_id").each(function() {
    //                             $(this).siblings(".select2-container").css('border', '1px solid red');
    //                           });
    //
    //                       }else{
    //                           $("#labour_country_of_issued"+i+"_id").each(function() {
    //                             $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
    //                           });
    //
    //                       }
    //                   }
    //                   else if(is_international == 'false'){
    //                        error_log += 'Please change identity to NIK for passenger labour '+i+'!</br>\n';
    //                        $("#labour_id_type"+i).each(function() {
    //                            $(this).parent().find('.nice-select').css('border', '1px solid red');
    //                        });
    //                   }else if(is_international == 'true'){
    //                        error_log += 'Please change identity to Passport for passenger labour '+i+'!</br>\n';
    //                        $("#labour_id_type"+i).each(function() {
    //                            $(this).parent().find('.nice-select').css('border', '1px solid red');
    //                        });
    //                   }
    //               }
    //               else{
    //                   //foreign
    //                   if(document.getElementById('labour_id_type'+i).value == 'passport'){
    //                       $("#labour_id_type"+i).each(function() {
    //                           $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
    //                       });
    //                       if(document.getElementById('labour_id_type'+i).value == 'passport' && check_passport(document.getElementById('labour_passport_number'+i).value) == false){
    //                           error_log+= 'Please fill id number, passport only contain more than 6 digits  for passenger labour '+i+'!</br>\n';
    //                           document.getElementById('labour_passport_number'+i).style['border-color'] = 'red';
    //                       }else{
    //                           document.getElementById('labour_passport_number'+i).style['border-color'] = '#EFEFEF';
    //                       }
    //                       if(document.getElementById('labour_passport_expired_date'+i).value == ''){
    //                           error_log+= 'Please fill passport expired date for passenger labour '+i+'!</br>\n';
    //                           document.getElementById('labour_passport_expired_date'+i).style['border-color'] = 'red';
    //                       }else{
    //                           duration = moment.duration(moment(document.getElementById('labour_passport_expired_date'+i).value).diff(last_departure_date));
    //                           //CHECK EXPIRED
    //                           if(duration._milliseconds < 0 ){
    //                                list_identity_need_update.push('labour_'+i);
    ////                                error_log+= 'Please update passport expired date for passenger labour '+i+'!</br>\n';
    ////                                document.getElementById('labour_passport_expired_date'+i).style['border-color'] = 'red';
    //                           }else
    //                                document.getElementById('labour_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
    //                       }if(document.getElementById('labour_country_of_issued'+i).value == ''){
    //                           error_log+= 'Please fill country of issued for passenger labour '+i+'!</br>\n';
    //                           $("#labour_country_of_issued"+i+"_id").each(function() {
    //                             $(this).siblings(".select2-container").css('border', '1px solid red');
    //                           });
    //
    //                       }else{
    //                           $("#labour_country_of_issued"+i+"_id").each(function() {
    //                             $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
    //                           });
    //
    //                       }
    //                   }else{
    //                       error_log+= 'Please change identity type to Passport for passenger labour '+i+'!</br>\n';
    //                   }
    //               }
                   // IVAN 17 okt 2022 open all passenger nationality, kalau inter harus passport
                   if(document.getElementById('labour_id_type'+i).value == 'ktp' && is_international == 'false'){
                        document.getElementById('labour_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
                        $("#labour_id_type"+i).each(function() {
                            $(this).parent().find('.nice-select').css('border', '1px solid red');
                        });
                        if(check_ktp(document.getElementById('labour_passport_number'+i).value) == false){
                           error_log+= 'Please fill id number, nik only contain 16 digits for passenger labour '+i+'!</br>\n';
                           document.getElementById('labour_passport_number'+i).style['border-color'] = 'red';
                        }else{
                           document.getElementById('labour_passport_number'+i).style['border-color'] = '#EFEFEF';
                        }if(document.getElementById('labour_country_of_issued'+i+'_id').value == ''){
                           error_log+= 'Please fill country of issued for passenger labour '+i+'!</br>\n';
                           $("#labour_country_of_issued"+i+"_id").each(function() {
                             $(this).siblings(".select2-container").css('border', '1px solid red');
                           });
                        }else{
                           $("#labour_country_of_issued"+i+"_id").each(function() {
                             $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                           });
                        }
                   }
                   else if(document.getElementById('labour_id_type'+i).value == 'passport'){
                       $("#labour_id_type"+i).each(function() {
                           $(this).parent().find('.nice-select').css('border', '0px solid red');
                       });
                       if(document.getElementById('labour_id_type'+i).value == 'passport' && check_passport(document.getElementById('labour_passport_number'+i).value) == false){
                           error_log+= 'Please fill id number, passport only contain more than 6 digits  for passenger labour '+i+'!</br>\n';
                           document.getElementById('labour_passport_number'+i).style['border-color'] = 'red';
                       }else{
                           document.getElementById('labour_passport_number'+i).style['border-color'] = '#EFEFEF';
                       }
                       if(document.getElementById('labour_passport_expired_date'+i).value == ''){
                           error_log+= 'Please fill passport expired date for passenger labour '+i+'!</br>\n';
                           document.getElementById('labour_passport_expired_date'+i).style['border-color'] = 'red';
                       }else{
                           duration = moment.duration(moment(document.getElementById('labour_passport_expired_date'+i).value).diff(last_departure_date));
                           //CHECK EXPIRED
                           if(duration._milliseconds < 0 ){
                                list_identity_need_update.push('labour_'+i);
    //                                error_log+= 'Please update passport expired date for passenger labour '+i+'!</br>\n';
    //                                document.getElementById('labour_passport_expired_date'+i).style['border-color'] = 'red';
                           }else
                                document.getElementById('labour_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
                       }if(document.getElementById('labour_country_of_issued'+i+'_id').value == ''){
                           error_log+= 'Please fill country of issued for passenger labour '+i+'!</br>\n';
                           $("#labour_country_of_issued"+i+"_id").each(function() {
                             $(this).siblings(".select2-container").css('border', '1px solid red');
                           });

                       }else{
                           $("#labour_country_of_issued"+i+"_id").each(function() {
                             $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                           });

                       }
                   }
                   else if(is_international == 'true'){
                        error_log += 'Please change identity to Passport for passenger labour '+i+'!</br>\n';
                        $("#labour_id_type"+i).each(function() {
                            $(this).parent().find('.nice-select').css('border', '1px solid red');
                        });
                   }
               }else{
                    if(document.getElementById('labour_id_type'+i).value != ''){
                        error_log+= 'Please choose identity type for passenger labour '+i+'!</br>\n';

                        document.getElementById('labour_passport_number'+i).style['border-color'] = 'red';
                        document.getElementById('labour_passport_expired_date'+i).style['border-color'] = 'red';
                        $("#labour_id_type"+i).each(function() {
                            $(this).parent().find('.nice-select').css('border', '1px solid red');
                        });

                        $("#labour_country_of_issued"+i+"_id").each(function() {
                            $(this).siblings(".select2-container").css('border', '1px solid red');
                        });
                    }
               }
           }else{
               if(document.getElementById('labour_valid_passport'+i))
                   if(document.getElementById('labour_valid_passport'+i).checked)
                       list_identity_need_update.push('labour_'+i)
           }
           if(typeof ff_request !== 'undefined'){
               if(ff_request.length != 0 && check_ff == 1){
                   for(j=1;j<=ff_request.length;j++){
                        index_ff = j-1;
                        if(ff_request[index_ff].hasOwnProperty('error_code') == false){
                            error_ff = true
                            ff_required = false;
//                            for(k in ff_request[index_ff].carrier_codes){
//                                if(airline_carriers[ff_request[index_ff].carrier_codes[k]].hasOwnProperty('required_frequent_flyer') && airline_carriers[ff_request[index_ff].carrier_codes[k]].required_frequent_flyer){
//                                    ff_required = airline_carriers[ff_request[index_ff].carrier_codes[k]].required_frequent_flyer;
//                                    break;
//                                }
//                            }
                            if(ff_required && document.getElementById('labour_ff_request'+i+'_'+j + '_id').value == '' && document.getElementById('labour_ff_number'+i+'_'+j).value == ''){
                                error_log+= 'Please choose Frequent Flyer Program Journey '+j+' for passenger labour '+i+'!</br>\n';
                                error_log+= 'Please fill Frequent Flyer Number '+j+' for passenger labour '+i+'!</br>\n';
                                $("#labour_ff_request"+i+'_'+j+'_id').each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid red');
                                });
                                document.getElementById('labour_ff_number'+i+'_'+j).style['border-color'] = 'red';
                            }else if(ff_required && document.getElementById('labour_ff_request'+i+'_'+j + '_id').value == ''){
                                error_log+= 'Please choose Frequent Flyer Program Journey '+j+' for passenger labour '+i+'!</br>\n';
                                $("#labour_ff_request"+i+'_'+j+'_id').each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid red');
                                });
                            }else if(ff_required && document.getElementById('labour_ff_number'+i+'_'+j).value == ''){
                                error_log+= 'Please fill Frequent Flyer Number '+j+' for passenger labour '+i+'!</br>\n';
                                document.getElementById('labour_ff_number'+i+'_'+j).style['border-color'] = 'red';
                            }
                            else if(document.getElementById('labour_ff_request'+i+'_'+j + '_id').value != '' && document.getElementById('labour_ff_number'+i+'_'+j).value != '')
                                error_ff = false
                            else if(document.getElementById('labour_ff_request'+i+'_'+j + '_id').value == '' && document.getElementById('labour_ff_number'+i+'_'+j).value != ''){
                                error_log+= 'Please choose Frequent Flyer Program Journey '+j+' for passenger labour '+i+'!</br>\n';
                                document.getElementById('labour_ff_number'+i+'_'+j).style['border-color'] = 'red';
                            }else if(document.getElementById('labour_ff_request'+i+'_'+j + '_id').value != '' && document.getElementById('labour_ff_number'+i+'_'+j).value == '' &&
                                document.getElementById('labour_ff_request'+i+'_'+j + '_id').value != '' && document.getElementById('labour_ff_number'+i+'_'+j).value == ''){
                                error_log+= 'Please fill Frequent Flyer Number '+j+' for passenger labour '+i+'!</br>\n';
                                document.getElementById('labour_ff_number'+i+'_'+j).style['border-color'] = 'red';
                            }else{
                                error_ff = false
                            }
                            if(error_ff == false){
                                document.getElementById('labour_ff_number'+i+'_'+j).style['border-color'] = '#EFEFEF';
                                document.getElementById('labour_ff_request'+i+'_'+j + '_id').style['border-color'] = '#EFEFEF';
                            }
                        }
                   }
               }
           }
       }
    }

    // check don't valid identity
    for(i in list_identity_need_update){
        passenger_id = list_identity_need_update[i].split('_');
        //kalau domestic tapi nationality indonesia pakai dont have valid passport
        if(is_international == 'false' && is_identity_required == 'true' && document.getElementById(passenger_id[0]+'_nationality'+passenger_id[1]+'_id').value == 'ID'){
            error_log+= 'Please change identity type to KTP for passenger '+passenger_id[0]+' '+passenger_id[1]+'!</br>\n';
        }
    }

    if(error_log==''){
        //KALAU DATE DISABLED DARI TEROPONG VALUE TIDAK BISA DI AMBIL EXPIRED DATE TIDAK DI DISABLED FALSE KARENA BISA DI EDIT
       document.getElementById('booker_nationality_id').disabled = false;
       for(i=1;i<=adult;i++){
            document.getElementById('adult_birth_date'+i).disabled = false;
            document.getElementById('adult_nationality'+i + '_id').disabled = false;
            document.getElementById('adult_country_of_issued'+i + '_id').disabled = false;
//            document.getElementById('adult_passport_expired_date'+i).disabled = false;
       }
       for(i=1;i<=child;i++){
            document.getElementById('child_birth_date'+i).disabled = false;
            document.getElementById('child_nationality'+i + '_id').disabled = false;
            document.getElementById('child_country_of_issued'+i + '_id').disabled = false;
//            document.getElementById('child_passport_expired_date'+i).disabled = false;
       }
       for(i=1;i<=infant;i++){
            document.getElementById('infant_birth_date'+i).disabled = false;
            document.getElementById('infant_nationality'+i + '_id').disabled = false;
            document.getElementById('infant_country_of_issued'+i + '_id').disabled = false;
//            document.getElementById('infant_passport_expired_date'+i).disabled = false;
       }
       if(airline_request.hasOwnProperty('student')){
            for(i=1;i<=airline_request.student;i++){
                document.getElementById('student_birth_date'+i).disabled = false;
                document.getElementById('student_nationality'+i + '_id').disabled = false;
                document.getElementById('student_country_of_issued'+i + '_id').disabled = false;
            }
       }
       if(airline_request.hasOwnProperty('seaman')){
            for(i=1;i<=airline_request.seaman;i++){
                document.getElementById('seaman_birth_date'+i).disabled = false;
                document.getElementById('seaman_nationality'+i + '_id').disabled = false;
                document.getElementById('seaman_country_of_issued'+i + '_id').disabled = false;
            }
       }
       if(airline_request.hasOwnProperty('labour')){
            for(i=1;i<=airline_request.labour;i++){
                document.getElementById('labour_birth_date'+i).disabled = false;
                document.getElementById('labour_nationality'+i + '_id').disabled = false;
                document.getElementById('labour_country_of_issued'+i + '_id').disabled = false;
            }
       }
       // auto check invalid identity
       for(i in list_identity_need_update){
            passenger_id = list_identity_need_update[i].split('_');
            document.getElementById(passenger_id[0]+'_valid_passport'+passenger_id[1]).checked = true;
       }
       $('.loader-rodextrip').fadeIn();
       document.getElementById('time_limit_input').value = time_limit;
//       document.getElementById('airline_price_itinerary_request').value = JSON.stringify(airline_get_price_request);
       if(type == '')
            upload_image();
//       else if(type == 'update_name')
//            update_post_pax_name();
//       else if(type == 'update_identity'){
//            //check kalau identity tidak di isi error
//            update_post_pax_identity();
//       }else if(type == 'update_all'){
//            //check kalau identity tidak di isi error
//            update_post_pax_name('update_all');
//       }

    }else{
       $('.loader-rodextrip').fadeOut();
       document.getElementById('show_error_log').innerHTML = error_log;
       $("#myModalErrorPassenger").modal('show');
       $('.btn-next').removeClass("running");
       $('.btn-next').prop('disabled', false);
    }
}

function check_passenger_aftersales(adult, child, infant, type=''){
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
    if(document.getElementById('booker_title') != undefined){
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
            error_log+= 'Please choose booker title!</br>\n';
            $("#booker_title").each(function() {
                $(this).parent().find('.nice-select').css('border', '1px solid red');
            });
        }else{
            $("#booker_title").each(function() {
                $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
            });
        }
        if(document.getElementById('booker_first_name').value == '' || check_word(document.getElementById('booker_first_name').value) == false){
            if(document.getElementById('booker_first_name').value == '')
                error_log+= 'Please fill booker first name!</br>\n';
            else if(check_word(document.getElementById('booker_first_name').value) == false)
                error_log+= 'Please use alpha characters for booker first name!</br>\n';
            document.getElementById('booker_first_name').style['border-color'] = 'red';
        }else{
            document.getElementById('booker_first_name').style['border-color'] = '#EFEFEF';
        }if(document.getElementById('booker_nationality_id').value == ''){
            error_log+= 'Please fill booker nationality!</br>\n';
            $("#booker_nationality_id").each(function() {
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


   }

   for(i in airline_pick){
        for(j in airline_pick[i].journeys){
            last_departure_date = airline_pick[i].journeys[j].departure_date.split(' - ')[0];
        }
   }

   // di ubah ke true karena kalau false salah 1 lion akan ke bypass rule lion 15 jul 2022
   var is_provider_lionair = true;
   var list_carrier_lion_air = ['JT', 'IW', 'ID', 'IU', 'OD'];
   if(typeof airline_pick !== 'undefined'){
       for(x in airline_pick){
            for(y in airline_pick[x].journeys){
                for(z in airline_pick[x].journeys[y].segments){
                    if(is_provider_lionair && list_carrier_lion_air.includes(airline_pick[x].journeys[y].segments[z].carrier_code) == false)
                       is_provider_lionair = false
                }
            }
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
       }if(document.getElementById('adult_title'+i).value == ''){
            error_log+= 'Please choose title of adult passenger '+i+'!</br>\n';
           $("#adult_title"+i).each(function() {
                $(this).parent().find('.nice-select').css('border', '1px solid red');
            });
       }else{
           $("#adult_title"+i).each(function() {
                $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
            });
       }
       if(document.getElementById('adult_first_name'+i).value == '' || check_word(document.getElementById('adult_first_name'+i).value) == false){
           if(document.getElementById('adult_first_name'+i).value == '')
               error_log+= 'Please input first name of adult passenger '+i+'!</br>\n';
           else if(check_word(document.getElementById('adult_first_name'+i).value) == false)
               error_log+= 'Please use alpha characters first name of adult passenger '+i+'!</br>\n';
           document.getElementById('adult_first_name'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('adult_first_name'+i).style['border-color'] = '#EFEFEF';
       }
       //check lastname
       // no check update 10 jan 2023 IVAN case A JAN
//       if(check_name_airline(document.getElementById('adult_first_name'+i).value, document.getElementById('adult_last_name'+i).value) != ''){
//           error_log += 'Please '+check_name_airline(document.getElementById('adult_first_name'+i).value, document.getElementById('adult_last_name'+i).value)+' adult passenger '+i+'!</br>\n';
//           document.getElementById('adult_last_name'+i).style['border-color'] = 'red';
//       }else{
//           document.getElementById('adult_last_name'+i).style['border-color'] = '#EFEFEF';
//       }
       if(birth_date_required == true){
           if(check_date(document.getElementById('adult_birth_date'+i).value)==false){
               error_log+= 'Birth date wrong for passenger adult '+i+'!</br>\n';
               document.getElementById('adult_birth_date'+i).style['border-color'] = 'red';
           }else{
               duration = moment.duration(moment(document.getElementById('adult_birth_date'+i).value).diff(last_departure_date));
               if(duration._data.years <= -12 == false){ //check age
                    error_log+= 'Age wrong for passenger adult '+i+' minimum 12 years old!</br>\n';
                    document.getElementById('adult_birth_date'+i).style['border-color'] = 'red';
               }else{
                    document.getElementById('adult_birth_date'+i).style['border-color'] = '#EFEFEF';
               }
           }
       }if(document.getElementById('adult_nationality'+i+'_id').value == ''){
           error_log+= 'Please fill nationality for passenger adult '+i+'!</br>\n';
           document.getElementById('adult_nationality'+i+'_id').style['border-color'] = 'red';
       }else{
           document.getElementById('adult_nationality'+i+'_id').style['border-color'] = '#EFEFEF';
       }
       if(document.getElementById('adult_identity_div'+i).style.display == 'block'){
           if(document.getElementById('adult_id_type'+i).value != ''){
                $("#adult_id_type"+i).each(function() {
                    $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                });
               if(document.getElementById('adult_nationality'+i+'_id').value == 'ID'){
                   //indonesia
                   if(document.getElementById('adult_id_type'+i).value == 'ktp' && is_international == 'false' || is_provider_lionair == true && document.getElementById('adult_id_type'+i).value == 'ktp'){
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
                   }else if(document.getElementById('adult_id_type'+i).value == 'passport' && is_international == 'true' || is_provider_lionair == true && document.getElementById('adult_id_type'+i).value == 'passport'){
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

                   }else if(is_international == 'false' && is_provider_lionair == false){
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
                   }else{
                       error_log+= 'Please change identity type to Passport for passenger adult '+i+'!</br>\n';
                   }
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
       }
       if(typeof ff_request !== 'undefined'){
           if(ff_request.length != 0 && check_ff == 1){
               var index_ff = 0;
               for(j=1;j<=ff_request.length;j++){
                    index_ff = j-1;
                    if(ff_request[index_ff].hasOwnProperty('error_code') == false){
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
                        }else{
                            error_ff = false
                        }
                        if(error_ff == false){
                            document.getElementById('adult_ff_number'+i+'_'+j).style['border-color'] = '#EFEFEF';
                            document.getElementById('adult_ff_request'+i+'_'+j).style['border-color'] = '#EFEFEF';
                        }
                    }
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
       }if(document.getElementById('child_title'+i).value == ''){
            error_log+= 'Please choose title of child passenger '+i+'!</br>\n';
            $("#child_title"+i).each(function() {
                $(this).parent().find('.nice-select').css('border', '0px solid red');
            });
       }else{
           $("#child_title"+i).each(function() {
                $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
            });
       }
       if(document.getElementById('child_first_name'+i).value == '' || check_word(document.getElementById('child_first_name'+i).value) == false){
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
       // no check update 10 jan 2023 IVAN case A JAN
//       if(check_name_airline(document.getElementById('child_first_name'+i).value, document.getElementById('child_last_name'+i).value) != ''){
//           error_log+= 'Please '+check_name_airline(document.getElementById('child_first_name'+i).value, document.getElementById('child_last_name'+i).value)+' child passenger '+i+'!</br>\n';
//           document.getElementById('child_last_name'+i).style['border-color'] = 'red';
//       }else{
//           document.getElementById('child_last_name'+i).style['border-color'] = '#EFEFEF';
//       }
       if(check_date(document.getElementById('child_birth_date'+i).value)==false){
           error_log+= 'Birth date wrong for passenger child '+i+'!</br>\n';
           document.getElementById('child_birth_date'+i).style['border-color'] = 'red';
       }else{
           duration = moment.duration(moment(document.getElementById('child_birth_date'+i).value).diff(last_departure_date));
           if(duration._data.years <= -2 && duration._data.years > -12 == false){ //check age
                error_log+= 'Age wrong for passenger child '+i+', minimum 2 years old and maximum 11 years old!</br>\n';
                document.getElementById('child_birth_date'+i).style['border-color'] = 'red';
           }else{
                document.getElementById('child_birth_date'+i).style['border-color'] = '#EFEFEF';
           }
       }if(document.getElementById('child_nationality'+i+'_id').value == ''){
           error_log+= 'Please fill nationality for passenger child '+i+'!</br>\n';
           document.getElementById('child_nationality'+i+'_id').style['border-color'] = 'red';
       }else{
           document.getElementById('child_nationality'+i+'_id').style['border-color'] = '#EFEFEF';
       }

       if(document.getElementById('child_identity_div'+i).style.display == 'block'){
           if(document.getElementById('child_id_type'+i).value != ''){
               document.getElementById('child_id_type'+i).style['border-color'] = '#EFEFEF';
               if(document.getElementById('child_nationality'+i+'_id').value == 'ID'){
                   //indonesia
                   if(document.getElementById('child_id_type'+i).value == 'ktp' && is_international == 'false'){
                        document.getElementById('child_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
                        $("#child_id_type"+i).each(function() {
                            $(this).parent().find('.nice-select').css('border', '1px solid red');
                        });
                        if(check_ktp(document.getElementById('child_passport_number'+i).value) == false){
                           error_log+= 'Please fill id number, nik only contain 16 digits for passenger child '+i+'!</br>\n';
                           document.getElementById('child_passport_number'+i).style['border-color'] = 'red';
                        }else{
                           document.getElementById('child_passport_number'+i).style['border-color'] = '#EFEFEF';
                        }if(document.getElementById('child_country_of_issued'+i+'_id').value == ''){
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
                       }if(document.getElementById('child_country_of_issued'+i+'_id').value == ''){
                           error_log+= 'Please fill country of issued for passenger child '+i+'!</br>\n';
                           $("#child_country_of_issued"+i+"_id").each(function() {
                             $(this).siblings(".select2-container").css('border', '1px solid red');
                           });

                       }else{
                           $("#child_country_of_issued"+i+"_id").each(function() {
                             $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                           });

                       }
                   }else if(is_international == 'false' && is_provider_lionair == false){
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
                       }if(document.getElementById('child_country_of_issued'+i+'_id').value == ''){
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
           }
       }
       if(typeof ff_request !== 'undefined'){
           if(ff_request.length != 0 && check_ff == 1){
               for(j=1;j<=ff_request.length;j++){
                    index_ff = j-1;
                    if(ff_request[index_ff].hasOwnProperty('error_code') == false){
                        error_ff = true
                        if(document.getElementById('child_ff_request'+i+'_'+j).value != '' && document.getElementById('child_ff_request'+i+'_'+j).value != 'Frequent Flyer Program' && document.getElementById('child_ff_number'+i+'_'+j).value != '')
                            error_ff = false
                        else if(document.getElementById('child_ff_request'+i+'_'+j).value == '' && document.getElementById('child_ff_number'+i+'_'+j).value != '' ||
                                document.getElementById('child_ff_request'+i+'_'+j).value == 'Frequent Flyer Program' && document.getElementById('child_ff_number'+i+'_'+j).value != ''){
                            error_log+= 'Please choose Frequent Flyer Program Journey '+j+' for passenger child '+i+'!</br>\n';
                            document.getElementById('child_ff_number'+i+'_'+j).style['border-color'] = 'red';
                        }else if(document.getElementById('child_ff_request'+i+'_'+j).value != 'Frequent Flyer Program' && document.getElementById('child_ff_number'+i+'_'+j).value == '' &&
                            document.getElementById('child_ff_request'+i+'_'+j).value != '' && document.getElementById('child_ff_number'+i+'_'+j).value == ''){
                            error_log+= 'Please fill Frequent Flyer Number '+j+' for passenger child '+i+'!</br>\n';
                            document.getElementById('child_ff_number'+i+'_'+j).style['border-color'] = 'red';
                        }else{
                            error_ff = false
                        }
                        if(error_ff == false){
                            document.getElementById('child_ff_number'+i+'_'+j).style['border-color'] = '#EFEFEF';
                            document.getElementById('child_ff_request'+i+'_'+j).style['border-color'] = '#EFEFEF';
                        }
                    }
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
       }if(document.getElementById('infant_title'+i).value == ''){
            error_log+= 'Please choose title of infant passenger '+i+'!</br>\n';
            $("#infant_title"+i).each(function() {
                $(this).parent().find('.nice-select').css('border', '1px solid red');
            });
       }else{
           $("#infant_title"+i).each(function() {
                $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
            });
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
       // no check update 10 jan 2023 IVAN case A JAN
//       if(check_name_airline(document.getElementById('infant_first_name'+i).value, document.getElementById('infant_last_name'+i).value) != ''){
//           error_log+= 'Please '+check_name_airline(document.getElementById('infant_first_name'+i).value, document.getElementById('infant_last_name'+i).value)+' infant passenger '+i+'!</br>\n';
//           document.getElementById('infant_last_name'+i).style['border-color'] = 'red';
//       }else{
//           document.getElementById('infant_last_name'+i).style['border-color'] = '#EFEFEF';
//       }
       if(check_date(document.getElementById('infant_birth_date'+i).value)==false){
           error_log+= 'Birth date wrong for passenger infant '+i+'!</br>\n';
           document.getElementById('infant_birth_date'+i).style['border-color'] = 'red';
       }else{
           duration = moment.duration(moment(document.getElementById('infant_birth_date'+i).value).diff(last_departure_date));
           if(duration._data.years > -2 == false){ //check age
                error_log+= 'Age wrong for passenger child '+i+' maximum 2 years old!</br>\n';
                document.getElementById('infant_birth_date'+i).style['border-color'] = 'red';
           }else{
                document.getElementById('infant_birth_date'+i).style['border-color'] = '#EFEFEF';
           }
       }if(document.getElementById('infant_nationality'+i+'_id').value == ''){
           error_log+= 'Please fill nationality for passenger infant '+i+'!</br>\n';
           document.getElementById('infant_nationality'+i+'_id').style['border-color'] = 'red';
       }else{
           document.getElementById('infant_nationality'+i+'_id').style['border-color'] = '#EFEFEF';
       }

       if(document.getElementById('infant_identity_div'+i).style.display == 'block'){
           if(document.getElementById('infant_id_type'+i).value != ''){
               document.getElementById('infant_id_type'+i).style['border-color'] = '#EFEFEF';
               if(document.getElementById('infant_nationality'+i+'_id').value == 'ID'){
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
                        }if(document.getElementById('infant_country_of_issued'+i+'_id').value == ''){
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
                       }if(document.getElementById('infant_country_of_issued'+i+'_id').value == ''){
                           error_log+= 'Please fill country of issued for passenger infant '+i+'!</br>\n';
                           $("#infant_country_of_issued"+i+"_id").each(function() {
                             $(this).siblings(".select2-container").css('border', '1px solid red');
                           });
                       }else{
                           $("#infant_country_of_issued"+i+"_id").each(function() {
                             $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                           });
                       }
                   }else if(is_international == 'false' && is_provider_lionair == false){
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
                       }if(document.getElementById('infant_country_of_issued'+i+'_id').value == ''){
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
           }
       }
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
       if(type == '')
            upload_image();
       else if(type == 'update_name')
            update_post_pax_name();
       else if(type == 'update_identity'){
            //check kalau identity tidak di isi error
            update_post_pax_identity();
       }else if(type == 'update_all'){
            //check kalau identity tidak di isi error
            update_post_pax_name('update_all');
       }

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
    text = `
    <div style="background:white; margin-bottom:15px; padding:15px; border:1px solid #cdcdcd;">
        <div class="row">
            <div class="col-lg-12 mb-3" style="border-bottom:1px solid #cdcdcd;">
                <h4 class="mb-3"><img src="/static/tt_website/images/icon/product/b-airline.png" alt="undefined" style="width:20px; height:20px;"> Flight Detail</h4>
            </div>
        </div>`;
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
                    text += `<hr/><h6>Return</h6>`;
                    if(airline_request.direction != 'MC'){}
                    else{
                        flight_count++;
                    }
                }
            }else if(airline_request.direction == 'MC'){
                flight_count++;
                if(flight_count != 1){
                    text+=`<hr/>`;
                }
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
                                        <img src="/static/tt_website/images/icon/symbol/airlines-01.png" alt="Airline" style="width:20px; height:20px; margin-top:5px;"/>
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

                for(l in airline_pick[i].price_itinerary[j].segments[k].fares){
                    for(m in airline_pick[i].price_itinerary[j].segments[k].fares[l].fare_details){
                        text+=`<span style="font-weight:bold;">`;
                        if(airline_pick[i].price_itinerary[j].segments[k].fares[l].fare_details[m].detail_type.includes('BG')){
                            text+=`<i class="fas fa-suitcase"></i> Baggage: `;
                        }else if(airline_pick[i].price_itinerary[j].segments[k].fares[l].fare_details[m].detail_type.includes('ML')){
                            text+=`<i class="fas fa-utensils"></i> Meal: `;
                        }
                        text+=``+airline_pick[i].price_itinerary[j].segments[k].fares[l].fare_details[m].amount+` `+airline_pick[i].price_itinerary[j].segments[k].fares[l].fare_details[m].unit+`</span>`;
                    }
                }
                text+=`</div>`;
            }

            text+=`<div class="col-lg-12">`;
//                if(provider_list_data[airline_pick[i].price_itinerary[j].provider].is_post_issued_reschedule)
//                    text+=`
//                        <br/><span style="font-weight:bold;"><i class="fas fa-check-circle" style="color:#4f9c64;"></i> Reschedule</span>`;

//                if(provider_list_data[airline_pick[i].price_itinerary[j].provider].is_post_issued_cancel)
//                    text+=`
//                        <br/><span style="font-weight:bold;"><i class="fas fa-check-circle" style="color:#4f9c64;"></i> Refund</span>`;

                text+=`
                </div>
            </div>`;
        }
    }
    text+=`</div>`;

    //contact
    text+=`
    <div class="row">
        <div class="col-lg-12">
            <div style="background:white; padding:15px; border:1px solid #cdcdcd;">
                <div class="row">
                    <div class="col-lg-12 mb-3" style="border-bottom:1px solid #cdcdcd;">
                        <h4 class="mb-3"><i class="fas fa-user"></i> Contact Person</h4>
                    </div>
                </div>`;
                for(i in passengers.contact){
                    text+=`
                    <h5>
                        `+passengers.contact[i].title+` `+passengers.contact[i].first_name+` `+ passengers.contact[i].last_name +`
                    </h5>
                    <b>Email: </b><i>`+passengers.contact[i].email+`</i><br>
                    <b>Phone: </b><i>`+passengers.contact[i].calling_code+` - `+passengers.contact[i].mobile+`</i><br>`;
                }
                text+=`
            </div>
        </div>
    </div>`;

    //SSR
    text+=`
    <div class="row" style="padding-top:20px;">
        <div class="col-lg-12">
            <div style="background:white; padding:15px; border:1px solid #cdcdcd;">
                <div class="row">
                    <div class="col-lg-6 mb-2">
                        <h4><i class="fas fa-sticky-note"></i> Seat & SSR</h4>
                    </div>
                    <div class="col-lg-6 mb-2" style="text-align:right;">
                        <button type="button" class="primary-btn-white hold-seat-booking-train ld-ext-right" style="width:unset; margin-bottom:unset;" id="btn-search-train" onclick="window.location.href = '/airline/passenger/`+signature+`';" style="width:100%;">
                            Edit Passenger <i class="fas fa-user-edit"></i>
                            <div class="ld ld-ring ld-cycle"></div>
                        </button>
                    </div>
                </div>
                <div class="row">`;
                    count_pax = 0;
                    for(i in passengers_ssr){
                        text+=`
                            <div class="col-lg-12 mb-2" style="padding-top:15px; border-top:1px solid #cdcdcd;">
                            <h5 class="single_border_custom_left" style="padding-left:5px;">
                                `+(parseInt(count_pax)+1)+`. `+passengers_ssr[i].title+` `+passengers_ssr[i].first_name+` `+ passengers_ssr[i].last_name+``;

                            if(passengers_ssr[i].pax_type == 'ADT'){
                                text+=`
                                <b style="background:white; font-size:13px; color:black; padding:0px 15px; display:unset; border: 1px solid #cdcdcd; border-radius:7px;">
                                    <i class="fas fa-user"></i> Adult
                                </b>`;
                            }else if(passengers_ssr[i].pax_type == 'CHD'){
                                text+=`
                                <b style="background:white; font-size:13px; color:black; padding:0px 15px; display:unset; border: 1px solid #cdcdcd; border-radius:7px;">
                                    <i class="fas fa-user"></i> Child
                                </b>`;
                            }else if(passengers_ssr[i].pax_type == 'LBR'){
                                text+=`
                                <b style="background:white; font-size:13px; color:black; padding:0px 15px; display:unset; border: 1px solid #cdcdcd; border-radius:7px;">
                                    <i class="fas fa-user"></i> Labour
                                </b>`;
                            }else if(passengers_ssr[i].pax_type == 'SEA'){
                                text+=`
                                <b style="background:white; font-size:13px; color:black; padding:0px 15px; display:unset; border: 1px solid #cdcdcd; border-radius:7px;">
                                    <i class="fas fa-user"></i> Seaman
                                </b>`;
                            }else if(passengers_ssr[i].pax_type == 'STU'){
                                text+=`
                                <b style="background:white; font-size:13px; color:black; padding:0px 15px; display:unset; border: 1px solid #cdcdcd; border-radius:7px;">
                                    <i class="fas fa-user"></i> Student
                                </b>`;
                            }
                            text+=`
                            </h5>`;
                            text+=`</div>
                            <div class="col-lg-12">`;
//                            if(passengers_ssr[i].pax_type == 'ADT')
//                                text += `<b>Adult - </b>`;
//                            else
//                                text += `<b>Child - </b>`;
                            text+=`
                            <b>Birth Date:</b> <i>`+passengers_ssr[i].birth_date+`</i></div>`;
                            if(passengers_ssr[i].identity_type){
                                text+=`
                                <div class="col-lg-12">
                                    <b>`+passengers_ssr[i].identity_type.substr(0,1).toUpperCase()+passengers_ssr[i].identity_type.substr(1,passengers_ssr[i].identity_type.length)+`</b>: <i>`+passengers_ssr[i].identity_number+`</i>
                                </div>`;
                            }
                            if(passengers_ssr[i].identity_expdate){
                                text+=`
                                <div class="col-lg-12">
                                    <b>Expired Date</b>: <i>`+passengers_ssr[i].identity_expdate+`</i>
                                </div>`;
                            }

                            text+=`<div class="col-lg-12" style="padding-bottom:15px;">`;
                            try{
                                for(j in passengers_ssr[i].ff_numbers){
                                    text+= `<b style="text-transform: capitalize;">`+passengers_ssr[i].ff_numbers[j].ff_code+`: </b><i>`+passengers_ssr[i].ff_numbers[j].ff_number+`</i><br/>`;
                                }
                            }catch(err){
                                console.log(err); // error kalau ada element yg tidak ada
                            }

                            if(passengers_ssr[i].hasOwnProperty('behaviors') && Object.keys(passengers_ssr[i].behaviors).length > 0){
                                for(j in passengers_ssr[i].behaviors){
                                    if(j.toLowerCase() == 'airline'){
                                        text+=`<label id="pop_behaviors`+i+`" style="color:`+color+`;margin-bottom:unset;"> See Behavior History <i class="fas fa-chevron-down"></i></label><br/>`;
                                        break;
                                    }
                                }
                            }

                            i_id = parseInt(i)+1;
                            text+=`
                            <b>SSR already included:</b><br/>
                            <div class="mb-3" style="padding:15px; border:1px solid #cdcdcd;" id="included_ssr`+i_id+`">

                            </div>`;

                            if(passengers_ssr[i].ssr_list.length){
                                text+=`<b style="color:`+color+`;">SSR additional request::</b>
                                <div style="margin-bottom:10px; padding:15px; border:1px solid `+color+`; background:#f7f7f7;">`;
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
                            counter_fee_dict = 0;
                            for(j in fee_dict){
                                counter_fee_dict++;
                                if(counter_fee_dict == 1){
                                    text += `<b>`;
                                }else{
                                    text += `<b>`;
                                }
                                text+=`• `+fee_dict[j].origin+` - `+fee_dict[j].destination+` (`+fee_dict[j].departure_date+`)</b><br/>`;
                                for(k in fee_dict[j].fees){
                                    ssr_type_lower = fee_dict[j].fees[k].ssr_type.toLowerCase();
                                    if(ssr_type_lower.includes('ml') || ssr_type_lower.includes('meal')){
                                        text+=` <i class="fas fa-utensils" style="color:`+color+`;"></i> `;
                                    }
                                    else if(ssr_type_lower.includes('bg') || ssr_type_lower.includes('bag') || fee_dict[j].fees[k].ssr_type.includes('bg')){
                                        text+=` <i class="fas fa-suitcase" style="color:`+color+`;"></i> <i class="fas fa-plus"></i> <i>Added</i> `;
                                    }
                                    else if(ssr_type_lower.includes('wc') || ssr_type_lower.includes('wheelchair')){
                                        text+=` <i class="fas fa-wheelchair" style="color:`+color+`;"></i> `;
                                    }
                                    else{
                                        text+=` <i class="fas fa-tools" style="color:`+color+`;"></i> `;
                                    }
                                    text+= `<i>`+fee_dict[j].fees[k].name+`</i><br/>`;
                                }
                            }
                            if(passengers_ssr[i].ssr_list.length){
                                text+=`</div>`;
                            }

                            if(passengers_ssr[i].hasOwnProperty('seat_list')){
                                text+=`<b style="color:`+color+`;">Seat request:</b>
                                <div style="padding:15px; border:1px solid `+color+`; background:#f7f7f7;">`;
                            }

                            counter_seat_list = 0;
                            for(j in passengers_ssr[i].seat_list){
                                counter_seat_list++;
                                if(counter_seat_list == 1){
                                    text += `<b>`;
                                }else{
                                    text += `<b>`;
                                }

                                if(passengers_ssr[i].seat_list[j].seat_pick != ''){
                                    text+= `
                                    • `+passengers_ssr[i].seat_list[j].segment_code+` (`+moment(passengers_ssr[i].seat_list[j].departure_date).format('DD MMM YYYY') +`)<br/><img src="/static/tt_website/images/icon/symbol/seat.png" style="height:16px; width:auto;"/> <i>` +passengers_ssr[i].seat_list[j].seat_pick + '</i><br>';
                                }
                                text+=`</b>`;
                            }
                            if(passengers_ssr[i].hasOwnProperty('seat_list')){
                                text+=`</div>`;
                            }
                            text+=`
                            </div>`;
                        count_pax++;
                    }
                    for(i in passengers.infant){
                        text+=`
                        <div class="col-lg-12 mb-2" style="padding-top:15px; border-top:1px solid #cdcdcd;">
                            <h5 class="single_border_custom_left" style="padding-left:5px;">
                                `+(parseInt(count_pax)+1)+`. `+passengers.infant[i].title+` `+passengers.infant[i].first_name+` `+ passengers.infant[i].last_name +`
                                <b style="background:white; font-size:13px; color:black; padding:0px 15px; display:unset; border: 1px solid #cdcdcd; border-radius:7px;">
                                    <i class="fas fa-user"></i> Infant
                                </b>
                            </h5>
                        </div>
                        <div class="col-lg-12">
                            <b>Birth Date:</b> <i>`+passengers.infant[i].birth_date+`</i>
                        </div>`;
                        if(passengers.infant[i].identity_type)
                            text+=`
                            <div class="col-lg-12">
                                <b>`+passengers.infant[i].identity_type.substr(0,1).toUpperCase()+passengers.infant[i].identity_type.substr(1,passengers.infant[i].identity_type.length)+`</b>: <i>`+passengers.infant[i].identity_number+`</i>
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

    if(now_page == 'review'){
        get_default_ssr(passengers_ssr, price_itinerary_temp, 'review');
    }

    for(i in airline_pick){
        if(passengers_ssr[i].hasOwnProperty('behaviors') && Object.keys(passengers_ssr[i].behaviors).length > 0){
            text_behavior = '';
            for(j in passengers_ssr[i].behaviors){
                if(j.toLowerCase() == 'airline'){
                    text_behavior+=`<b>`+j+`</b><br/>`;
                    text_behavior+=`<span>`+passengers_ssr[i].behaviors[j]+`</span><br/>`;
                }
            }
            if(text_behavior != ''){
                new jBox('Tooltip', {
                     attach: '#pop_behaviors'+i,
                     theme: 'TooltipBorder',
                     width: 280,
                     position: {
                       x: 'center',
                       y: 'bottom'
                     },
                     closeOnMouseleave: true,
                     animation: 'zoomIn',
                     content: text_behavior
                });
            }
        }
    }
}

function get_airline_review_after_sales(){
    text = '';
    text = `
    <div style="background:white; margin-bottom:15px; padding:15px; border:1px solid #cdcdcd;">
        <div class="row">
            <div class="col-lg-12 mb-3" style="border-bottom:1px solid #cdcdcd;">
                <h4 class="mb-3"><img src="/static/tt_website/images/icon/product/b-airline.png" alt="undefined" style="width:20px; height:20px;"> Flight Detail</h4>
            </div>
        </div>`;
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
                    text+=`<img data-toggle="tooltip" alt="`+airline_carriers[airline_get_detail.provider_bookings[i].journeys[j].segments[k].carrier_code].name+`" title="`+airline_carriers[airline_get_detail.provider_bookings[i].journeys[j].segments[k].carrier_code].name+`" style="width:50px; height:50px;" src="`+static_path_url_server+`/public/airline_logo/`+airline_get_detail.provider_bookings[i].journeys[j].segments[k].carrier_code+`.png"><span> </span>`;
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
                                        <img src="/static/tt_website/images/icon/symbol/airlines-01.png" alt="Airline" style="width:20px; height:20px; margin-top:5px;"/>
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
    text+=`</div>
    <div style="background:white; margin-bottom:15px; padding:15px; border:1px solid #cdcdcd;">
        <div class="row">
            <div class="col-lg-12 mb-3" style="border-bottom:1px solid #cdcdcd;">
                <h4 class="mb-3"><i class="fas fa-users"></i> List of Passenger</h4>
            </div>
        </div>`;

    //passengers
    text+=`
    <div class="row">`;
        count_pax = 0;
        try{
            for(pax in airline_get_detail.passengers){
                fee_dict = {}; //bikin ke dict agar bisa fees per segment / journey
                for(i in airline_get_detail.passengers[pax].fees){
                    if(fee_dict.hasOwnProperty(airline_get_detail.passengers[pax].fees[i].journey_code) == false){
                        fee_dict[airline_get_detail.passengers[pax].fees[i].journey_code] = {
                            "fees": [],
                        };
                        found = false;
                        for(j in airline_get_detail.provider_bookings){
                            for(k in airline_get_detail.provider_bookings[j].journeys){
                                if(airline_get_detail.provider_bookings[j].journeys[k].journey_code == airline_get_detail.passengers[pax].fees[i].journey_code){
                                    found = true;
                                    fee_dict[airline_get_detail.passengers[pax].fees[i].journey_code].origin = airline_get_detail.provider_bookings[j].journeys[k].origin;
                                    fee_dict[airline_get_detail.passengers[pax].fees[i].journey_code].destination = airline_get_detail.provider_bookings[j].journeys[k].destination;
                                    fee_dict[airline_get_detail.passengers[pax].fees[i].journey_code].departure_date = airline_get_detail.provider_bookings[j].journeys[k].departure_date;
                                    fee_dict[airline_get_detail.passengers[pax].fees[i].journey_code].pnr = airline_get_detail.passengers[pax].fees[i].pnr;
                                    break;
                                }
                                for(l in airline_get_detail.provider_bookings[j].journeys[k].segments){
                                    if(airline_get_detail.provider_bookings[j].journeys[k].segments[l].segment_code == airline_get_detail.passengers[pax].fees[i].journey_code){
                                        found = true;
                                        fee_dict[airline_get_detail.passengers[pax].fees[i].journey_code].origin = airline_get_detail.provider_bookings[j].journeys[k].segments[l].origin;
                                        fee_dict[airline_get_detail.passengers[pax].fees[i].journey_code].destination = airline_get_detail.provider_bookings[j].journeys[k].segments[l].destination;
                                        fee_dict[airline_get_detail.passengers[pax].fees[i].journey_code].departure_date = airline_get_detail.provider_bookings[j].journeys[k].segments[l].departure_date;
                                        fee_dict[airline_get_detail.passengers[pax].fees[i].journey_code].pnr = airline_get_detail.passengers[pax].fees[i].pnr;
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
                    fee_dict[airline_get_detail.passengers[pax].fees[i].journey_code].fees.push({
                        "fee_category": airline_get_detail.passengers[pax].fees[i].fee_category,
                        "fee_name": airline_get_detail.passengers[pax].fees[i].fee_name
                    })
                }
                airline_get_detail.passengers[pax].fee_dict = fee_dict;
            }
        }catch(err){
              console.log(err); // error kalau ada element yg tidak ada
        }

        try{
            for(pax in passengers_ssr){
                fee_dict = {}; //bikin ke dict agar bisa fees per segment / journey
                for(i in passengers_ssr[pax].ssr_list){
                    if(fee_dict.hasOwnProperty(passengers_ssr[pax].ssr_list[i].journey_code) == false){
                        fee_dict[passengers_ssr[pax].ssr_list[i].journey_code] = {
                            "fees": [],
                        };
                        found = false;
                        for(j in airline_get_detail.provider_bookings){
                            for(k in airline_get_detail.provider_bookings[j].journeys){
                                if(airline_get_detail.provider_bookings[j].journeys[k].journey_code == passengers_ssr[pax].ssr_list[i].journey_code){
                                    found = true;
                                    fee_dict[passengers_ssr[pax].ssr_list[i].journey_code].origin = airline_get_detail.provider_bookings[j].journeys[k].origin;
                                    fee_dict[passengers_ssr[pax].ssr_list[i].journey_code].destination = airline_get_detail.provider_bookings[j].journeys[k].destination;
                                    fee_dict[passengers_ssr[pax].ssr_list[i].journey_code].departure_date = airline_get_detail.provider_bookings[j].journeys[k].departure_date;
                                    fee_dict[passengers_ssr[pax].ssr_list[i].journey_code].pnr = airline_get_detail.provider_bookings[j].pnr;
                                    fee_dict[passengers_ssr[pax].ssr_list[i].journey_code].is_replace_ssr = passengers_ssr[pax].ssr_list[i].is_replace_ssr;
                                    break;
                                }
                                for(l in airline_get_detail.provider_bookings[j].journeys[k].segments){
                                    if(airline_get_detail.provider_bookings[j].journeys[k].segments[l].segment_code == passengers_ssr[pax].ssr_list[i].journey_code){
                                        found = true;
                                        fee_dict[passengers_ssr[pax].ssr_list[i].journey_code].origin = airline_get_detail.provider_bookings[j].journeys[k].segments[l].origin;
                                        fee_dict[passengers_ssr[pax].ssr_list[i].journey_code].destination = airline_get_detail.provider_bookings[j].journeys[k].segments[l].destination;
                                        fee_dict[passengers_ssr[pax].ssr_list[i].journey_code].departure_date = airline_get_detail.provider_bookings[j].journeys[k].segments[l].departure_date;
                                        fee_dict[passengers_ssr[pax].ssr_list[i].journey_code].pnr = airline_get_detail.provider_bookings[j].pnr;
                                        fee_dict[passengers_ssr[pax].ssr_list[i].journey_code].is_replace_ssr = passengers_ssr[pax].ssr_list[i].is_replace_ssr;
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
                    fee_dict[passengers_ssr[pax].ssr_list[i].journey_code].fees.push({
                        "fee_category": passengers_ssr[pax].ssr_list[i].availability_type,
                        "fee_name": passengers_ssr[pax].ssr_list[i].name
                    })
                }
                passengers_ssr[pax].fee_dict = fee_dict;
            }
        }catch(err){
              console.log(err); // error kalau ada element yg tidak ada
        }
        journey_key = '';

        for(i in passengers_ssr){
            if(i == 0){
                text+=`<div class="col-lg-12">`;
            }else{
                text+=`<div class="col-lg-12" style="padding-top:15px; border-top:1px solid #cdcdcd;">`;
            }
            text+=`
            <h5 class="single_border_custom_left" style="padding-left:5px;">
                `+(parseInt(count_pax)+1)+`. `+passengers_ssr[i].title+` `+passengers_ssr[i].first_name+` `+ passengers_ssr[i].last_name +``;
                if(passengers_ssr[i].pax_type == 'ADT'){
                    text+=`
                    <b style="background:white; font-size:13px; color:black; padding:0px 15px; display:unset; border: 1px solid #cdcdcd; border-radius:7px;">
                        <i class="fas fa-user"></i> Adult
                    </b>`;
                }
                else if(passengers_ssr[i].pax_type == 'CHD'){
                    text+=`
                    <b style="background:white; font-size:13px; color:black; padding:0px 15px; display:unset; border: 1px solid #cdcdcd; border-radius:7px;">
                        <i class="fas fa-user"></i> Child
                    </b>`;
                }
                else if(passengers_ssr[i].pax_type == 'LBR'){
                    text+=`
                    <b style="background:white; font-size:13px; color:black; padding:0px 15px; display:unset; border: 1px solid #cdcdcd; border-radius:7px;">
                        <i class="fas fa-user"></i> Labour
                    </b>`;
                }
                else if(passengers_ssr[i].pax_type == 'SEA'){
                    text+=`
                    <b style="background:white; font-size:13px; color:black; padding:0px 15px; display:unset; border: 1px solid #cdcdcd; border-radius:7px;">
                        <i class="fas fa-user"></i> Seaman
                    </b>`;
                }
                else if(passengers_ssr[i].pax_type == 'STU'){
                    text+=`
                    <b style="background:white; font-size:13px; color:black; padding:0px 15px; display:unset; border: 1px solid #cdcdcd; border-radius:7px;">
                        <i class="fas fa-user"></i> Student
                    </b>`;
                }
            text+=`
            </h5>
            <b>Birth Date:</b> <i>`+passengers_ssr[i].birth_date+`</i></br>
            <div class="row">`;
            try{
                text+=`<div class="col-lg-12"><b>Current SSR additional request</b><div style="margin-bottom:15px; padding:15px; border:1px solid #cdcdcd;">`;
                for(j in airline_get_detail.passengers[i].fee_dict){
//                        if(journey_key != '' && journey_key != j)
//                            text += `<br/>`;
                    journey_key = j;
                    text += `<b>• `+airline_get_detail.passengers[i].fee_dict[j].origin+` - `+airline_get_detail.passengers[i].fee_dict[j].destination+` (`+airline_get_detail.passengers[i].fee_dict[j].departure_date+`)</b><br/>`;
                    for(k in airline_get_detail.passengers[i].fee_dict[j].fees){
                        if(airline_get_detail.passengers[i].fee_dict[j].fees[k].fee_category == 'meal'){
                            text+=`<i class="fas fa-utensils"></i> `;
                        }
                        else if(airline_get_detail.passengers[i].fee_dict[j].fees[k].fee_category == 'baggage'){
                            text+=`<i class="fas fa-suitcase"></i> `;
                        }
                        else if(airline_get_detail.passengers[i].fee_dict[j].fees[k].fee_category == 'equipment'){
                            text+=`<i class="fas fa-tools"></i> `;
                        }
                        else if(airline_get_detail.passengers[i].fee_dict[j].fees[k].fee_category == 'wheelchair'){
                            text+=`<i class="fas fa-wheelchair"></i> `;
                        }
                        else if(airline_get_detail.passengers[i].fee_dict[j].fees[k].fee_category == 'seat'){
                            text+=`<img src="/static/tt_website/images/icon/symbol/seat.png" style="height:16px; width:auto;"/> `;
                        }

                        if(airline_get_detail.passengers[i].fee_dict[j].fees[k].fee_name.toLowerCase().includes(airline_get_detail.passengers[i].fee_dict[j].fees[k].fee_category.toLowerCase()) == false)
                            text += '<b>'+airline_get_detail.passengers[i].fee_dict[j].fees[k].fee_category + ': </b>';
                        text += `<i>`;
                        text += airline_get_detail.passengers[i].fee_dict[j].fees[k].fee_name + `</i><br/>`;
                    }
//                                        text += `<label>`+airline_get_detail.passengers[i].fees[j].fee_name+ ' ' + airline_get_detail.passengers[i].fees[j].fee_value + `</label><br/>`;
                }
                text+=`</div></div>`;
                journey_key = '';
            }
            catch(err){
                  console.log(err); // error kalau ada element yg tidak ada
            }

            text+=`<div class="col-lg-12">`;
            for(j in passengers_ssr[i].fee_dict){
                try{
//                        if(journey_key != '' && journey_key != j)
//                            text += `<hr/>`;
                    journey_key = j;
                    text += `<b style="color:`+color+`;">`;
                    if(!passengers_ssr[i].fee_dict[j].is_replace_ssr)
                        text+= `Add new`;
                    else
                        text += `Only changed ssr is listed here`;
                    text+=`</b><br/>
                    <div style="margin-bottom:15px; padding:15px; border:1px solid `+color+`; background:#f7f7f7">`;

                    text += `<b>• `+passengers_ssr[i].fee_dict[j].origin+` - `+passengers_ssr[i].fee_dict[j].destination+` (`+passengers_ssr[i].fee_dict[j].departure_date+`)</b><br/>`;
                    for(k in passengers_ssr[i].fee_dict[j].fees){
                        if(passengers_ssr[i].fee_dict[j].fees[k].fee_category == 'meal'){
                            text+=`<i class="fas fa-utensils" style="color:`+color+`;"></i> `;
                        }
                        else if(passengers_ssr[i].fee_dict[j].fees[k].fee_category == 'baggage'){
                            text+=`<i class="fas fa-suitcase" style="color:`+color+`;"></i> `;
                        }
                        else if(passengers_ssr[i].fee_dict[j].fees[k].fee_category == 'wheelchair'){
                            text+=`<i class="fas fa-suitcase" style="color:`+color+`;"></i> `;
                        }
                        else if(passengers_ssr[i].fee_dict[j].fees[k].fee_category == 'equipment'){
                            text+=`<i class="fas fa-tools" style="color:`+color+`;"></i> `;
                        }
                        else if(passengers_ssr[i].fee_dict[j].fees[k].fee_category == 'seat'){
                            text+=`<img src="/static/tt_website/images/icon/symbol/seat.png" style="height:16px; width:auto;"/> `;
                        }

                        text += `<b>`;
                        if(passengers_ssr[i].fee_dict[j].fees[k].fee_category == 'baggage'){
                            if(!passengers_ssr[i].fee_dict[j].is_replace_ssr)
                                text += `Will be added to `;
                            else
                                text += `Will be replaced to `;

                        }
                        text += `</b>
                        <i>`;
                        if(passengers_ssr[i].fee_dict[j].fees[k].fee_name.toLowerCase().includes(passengers_ssr[i].fee_dict[j].fees[k].fee_category.toLowerCase()) == false)
                            text += passengers_ssr[i].fee_dict[j].fees[k].fee_category + ': ';
                        text += passengers_ssr[i].fee_dict[j].fees[k].fee_name + `</i><br/>`;
                    }
                    text+=`</div>`;
//                                        text += `<label>`+passengers_ssr[i].ssr_list[j].availability_type+ ' ' + passengers_ssr[i].ssr_list[j].name + `</label><br/>`;
              }catch(err){
                console.log(err); // error kalau ada element yg tidak ada
              }
            }

            if(typeof passengers_ssr[i].seat_list !== 'undefined'){
                text+=`
                <b style="color:`+color+`">Seat request</b>
                <div style="padding:15px; margin-bottom:15px; border:1px solid #cdcdcd; background:#f7f7f7;">`;
                for(j in passengers_ssr[i].seat_list){
                    try{
                        if(passengers_ssr[i].seat_list[j].seat_pick != ''){
                            text += `<b>• `+passengers_ssr[i].seat_list[j].segment_code+`:</b><br/>
                            <img src="/static/tt_website/images/icon/symbol/seat.png" style="height:16px; width:auto;"/> <i>`+passengers_ssr[i].seat_list[j].seat_pick + `</i><br/>`;
                        }
                  }catch(err){
                        console.log(err); // error kalau ada element yg tidak ada
                  }
                }
                text+=`</div>`;
            }

            text+=`</div>
                </div>
            </div>`;

            count_pax++;
        }
        for(i in passengers.infant){
            text+=`<div class="col-lg-12" style="padding-top:15px; border-top:1px solid #cdcdcd;">`;

            text+=`
            <h5 class="single_border_custom_left" style="padding-left:5px;">
                `+(parseInt(count_pax)+1)+`. `+passengers.infant[i].title+` `+passengers.infant[i].first_name+` `+ passengers.infant[i].last_name +`
                <b style="background:white; font-size:13px; color:black; padding:0px 15px; display:unset; border: 1px solid #cdcdcd; border-radius:7px;">
                    <i class="fas fa-user"></i> Infant
                </b>`;
            text+=`
            </h5>
            <b>Birth Date:</b> <i>`+passengers.infant[i].birth_date+`</i></br>`;

            count_pax++;
        }
//                is_add_data = true;
//                if(addons_type == 'ssr'){
//                    for(i in airline_get_detail.provider_bookings){
//                        if(provider_list_data[airline_get_detail.provider_bookings[i].provider].is_replace_ssr)
//                            is_replace_data = false;
//                    }
//                }else{
//                    // seat true
//                    is_replace_data = false;
//                }
//                if(is_add_data)
//                    text+=`<label>Notes: Add new</label>`;
//                else{
//                    text+=`<label>Notes: Change are only for same `+addons_type+` type</label>`;
//                }
        text+=`
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

    if(typeof(airline_pick) !== 'undefined'){
        //proses booking normal
        for(i in airline_pick){
            for(j in airline_pick[i].journeys){
                last_departure_date = airline_pick[i].journeys[j].departure_date.split(' - ')[0];
            }
        }
        if(last_departure_date == ''){
            //after sales
            for(i in airline_request.departure){
                last_departure_date = airline_request.departure[i];
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

//    $text= value_idx[0]+' - '+value_idx[1]+' → '+value_idx[2]+', '+value_idx[3]+'\n\n'; // pak adi yg minta
    $text = '';
    var airline_number = 0;
    node = document.createElement("div");
    //text+=`<div class="col-lg-12"><h5>`+value_flight_type+`</h5><hr/></div>`;
    text+=`<div class="col-lg-12">`;
    $(".copy_result:checked").each(function(obj) {
        var parent_airline = $(this).parent().parent().parent().parent();
        var combo_price = parent_airline.find('.copy_combo_price').html();
        var price_airline = parent_airline.find('.copy_price').html();
        //var search_banner = parent_airline.find('.copy_search_banner').html();
        var value_copy = [];
        parent_airline.find('.copy_airline').each(function(obj) {
            value_copy.push($(this).html());
        });
        if(airline_number != 0)
            $text += '_____________________________________\n\n'; // pak adi yg minta pembatas per option
        var id_airline = parent_airline.find('.id_copy_result').html();
        airline_number = airline_number + 1;
        $text += '#OPTION-'+airline_number+'\n'; // pak adi yg minta
        if(airline_number == 1){
            text+=`<div class="row pb-3" id="div_list`+id_airline+`" style="padding-top:15px; border-bottom:1px solid #cdcdcd; border-top:1px solid #cdcdcd; margin-bottom:15px; background:white;">`;
        }else{
            text+=`<div class="row pt-3 pb-3" id="div_list`+id_airline+`" style="padding-top:15px; border-bottom:1px solid #cdcdcd; border-top:1px solid #cdcdcd; margin-bottom:15px; background:white;">`;
        }
        text+=`
            <div class="col-xs-6">
                <h5 class="single_border_custom_left" style="padding-left:5px;">Option-`+airline_number+`</h5>
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
            <div class="col-xs-6" style="text-align:right;">
                <span style="font-weight:500; cursor:pointer;" onclick="delete_checked_copy_result(`+id_airline+`);"><i class="fas fa-times-circle" style="color:red; font-size:18px;"></i> Delete</span>
            </div>
            <div class="col-lg-12">
                <hr/>
            </div>
            <div class="col-lg-12">`;
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
                                text+=`<br/><span style="font-weight:500;">`+$(this).html()+` </span><br/><br/>`;
                                $text += '• '+$(this).html()+' \n';
                            }
                        }
                    });

                    if(j != 0)
                        $text += '\n\n';

                    var co_j = j+1;
                    text+=`<h5 style="padding-bottom:5px;"><i class="fas fa-angle-right"></i> Flight-`+co_j+`</h5>`;
//                    $text += '› Flight-'+co_j+'\n'; // pak adi yg minta

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
                                        text+=`<br/><span>`+$(this).html().replace(' ','').split('(')[4].split(')')[0]+` [`+$(this).html().split('(')[0].replace('\n','').replace(/ /g,'')+`]</span>`;
                                        $text += $(this).html().replace(' ','').split('(')[4].split(')')[0]+` [`+$(this).html().split('(')[0].replace('\n','').replace(/ /g,'')+`]`;
                                        break;
                                    }
                                }
                            });
                        }
                    });

                    parent_po.find('.copy_operated_by').each(function(obj) {
                        if($(this).html() != undefined){
                            text+=`<span> [`+$(this).html()+`]</span>`;
                            $text += ' ['+$(this).html()+']';
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
//                       $text += 'Departure: ';
                       $text += 'Origin: ';
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

                       parent_legs.find('.legs_terminal_origin').each(function(obj) {
                           if($(this).html() != undefined){
                               text+=`<br/><span>`+$(this).html()+` </span>`;
                               if($(this).html().includes('-') == false)
                                    $text += '\n'+$(this).html()+'\n';
                           }
                       });

                       text+=`</div>
                       <div class="col-lg-6" style="text-align:right;">`;
//                       $text += 'Arrival: ';
                       $text += '\nDestination: ';
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

                       parent_legs.find('.legs_terminal_destination').each(function(obj) {
                           if($(this).html() != undefined){
                               text+=`<br/><span>`+$(this).html()+` </span>`;
                               if($(this).html().includes('-') == false)
                                    $text += '\n'+$(this).html()+'\n';
                           }
                       });
                       text+=`</div>
                       </div>`;

                       $text+='\n\n';
                    }

                    var value_fares = [];
                    parent_segments.find('.copy_fares').each(function(obj) {
                        value_fares.push($(this).html());
                    });
                    for (var l = 0; l < value_fares.length; l++){
                       var temp_fares = ''+value_fares[l];
                       var parent_fares = $("#copy_fares_details"+temp_fares);
                       parent_fares.find('.copy_suitcase_details').each(function(obj) {
                           if($(this).html() != undefined || $(this).html() != ''){
                               text+=`<b>• Baggage: `+$(this).html()+` </b><br/>`;
                               $text += '• Baggage   : '+$(this).html()+' \n';
                           }
                       });
                       parent_fares.find('.copy_aircraft_details').each(function(obj) {
                           if($(this).html() != undefined || $(this).html() != ''){
                               text+=`<b>• Aircraft: `+$(this).html()+` </b><br/>`;
                               $text += '• Aircraft   : '+$(this).html()+' \n';
                           }
                       });
                       parent_fares.find('.copy_utensils_details').each(function(obj) {
                           if($(this).html() != undefined || $(this).html() != ''){
                               text+=`<b>• Meal: `+$(this).html()+` </b><br/>`;
                               $text += '• Meal  : '+$(this).html()+' \n';
                           }
                       });
                       parent_fares.find('.copy_others_details').each(function(obj) {
                           if($(this).html() != undefined || $(this).html() != ''){
                               text+=`<b>• Others: `+$(this).html()+` </b><br/>`;
                               $text += '• Others    : '+$(this).html()+' \n';
                           }
                       });

                       parent_duration.find('.copy_duration_details').each(function(obj) {
                           if($(this).html() != undefined || $(this).html() != ''){
                               text+=`<b>• Duration: `+$(this).html()+` </b><br/>`;
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
                if(combo_price != undefined){
                    text+=`<span class="price_template" style="float:right;">`+price_airline+` (`+combo_price+`)</span><br/>`;
                    $text += 'Price: '+price_airline+ ' ('+combo_price+')\n';
                }else{
                    text+=`<span class="price_template" style="float:right;">`+price_airline+`</span><br/>`;
                    $text += 'Price: '+price_airline+'\n';
                }

                $text+='====================\n';
            }
            text+=`
            </div>
        </div>`;
    });
    $text += '\nPRICE MAY CHANGE ANYTIME BEFORE PAYMENT IS DONE';
    text+=`
    </div>`;
    text_footer =`
    <div class="col-lg-12" style="margin-bottom:15px;" id="share_result">
        <span style="font-size:14px; font-weight:bold;"><i class="fas fa-share-alt"></i> Share This on:</span><br/>
        <div style="padding:7px 0px 15px 0px; display:inline-block;">`;
        share_data();
        var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
            text_footer+=`
                <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" alt="Whatsapp" src="/static/tt_website/images/logo/apps/whatsapp.png"/></a>`;
            if(airline_number < 11){
                text_footer+=`
                    <a href="line://msg/text/`+ $text_share +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" alt="Line" src="/static/tt_website/images/logo/apps/line.png"/></a>
                    <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" alt="Telegram" src="/static/tt_website/images/logo/apps/telegram.png"/></a>`;
            }
            else{
                text_footer+=`
                <a href="#" target="_blank" title="Share by Line" style="padding-right:5px; cursor:not-allowed;"><img style="height:30px; width:auto;" alt="Line Disable" src="/static/tt_website/images/logo/apps/line-gray.png"/></a>
                <a href="#" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" alt="Telegram Disable" src="/static/tt_website/images/logo/apps/telegram-gray.png"/></a>`;
            }
            text_footer+=`
                <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" alt="Email" src="/static/tt_website/images/logo/apps/email.png"/></a>`;
        } else {
            text_footer+=`
                <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" alt="Whatsapp" src="/static/tt_website/images/logo/apps/whatsapp.png"/></a>`;
            if(airline_number < 11){
                text_footer+=`
                    <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" alt="Line" src="/static/tt_website/images/logo/apps/line.png"/></a>
                    <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" alt="Telegram" src="/static/tt_website/images/logo/apps/telegram.png"/></a>`;
            }
            else{
                text_footer+=`
                <a href="#" title="Share by Line" style="padding-right:5px; cursor:not-allowed;"><img style="height:30px; width:auto;" alt="Line Disable" src="/static/tt_website/images/logo/apps/line-gray.png"/></a>
                <a href="#" title="Share by Telegram" style="padding-right:5px; cursor:not-allowed;"><img style="height:30px; width:auto;" alt="Telegram Disable" src="/static/tt_website/images/logo/apps/telegram-gray.png"/></a>`;
            }
            text_footer+=`
                <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" alt="Email" src="/static/tt_website/images/logo/apps/email.png"/></a>`;
        }
        if(airline_number > 10){
            text_footer+=`<br/><span style="color:red;">Nb: Share on Line and Telegram Max 10 Airline</span>`;
        }
    text_footer+=`
        </div>
        <div style="float:right;" id="copy_result">
            <button class="primary-btn-white" style="width:150px;" type="button" onclick="copy_data();">
                <i class="fas fa-copy"></i> Copy
            </button>
        </div>
    </div>`;

    node.innerHTML = text;
    node.className = "row";
    document.getElementById("show-list-copy-airline").appendChild(node);

    document.getElementById("footer_list_copy").innerHTML = text_footer;


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
        //filter airlines web
        document.getElementById('airlineAirline_generalShow_loading').innerHTML = `
        <div class="place_div_left_right">
            <span style="font-weight:bold; font-size:14px;">
                <div class="stripe_div_small70">
                    <div class="div_stripe">
                        <div class="loading_stripe"></div>
                    </div>
                </div>
            </span>
            <label style="position:absolute; right:0px;">
                <div class="stripe_checkbox">
                    <div class="div_stripe">
                        <div class="loading_stripe"></div>
                    </div>
                </div>
            </label>
        </div>
        <div class="place_div_grid">
            <label>
                <div class="stripe_div_medium160">
                    <div class="div_stripe">
                        <div class="loading_stripe"></div>
                    </div>
                </div>
            </label>
            <label>
                <div class="stripe_div_medium130">
                    <div class="div_stripe">
                        <div class="loading_stripe"></div>
                    </div>
                </div>
            </label>
            <label>
                <div class="stripe_div_medium160">
                    <div class="div_stripe">
                        <div class="loading_stripe"></div>
                    </div>
                </div>
            </label>
            <label>
                <div class="stripe_div_small100">
                    <div class="div_stripe">
                        <div class="loading_stripe"></div>
                    </div>
                </div>
            </label>
        </div>`;
        //filter airlines mobile
        document.getElementById('airlineAirline_generalShow_loading2').innerHTML = `
        <div class="place_div_left_right">
            <span style="font-weight:bold; font-size:14px;">
                <div class="stripe_div_small70">
                    <div class="div_stripe">
                        <div class="loading_stripe"></div>
                    </div>
                </div>
            </span>
            <label style="position:absolute; right:0px;">
                <div class="stripe_checkbox">
                    <div class="div_stripe">
                        <div class="loading_stripe"></div>
                    </div>
                </div>
            </label>
        </div>
        <div class="place_div_grid">
            <label>
                <div class="stripe_div_medium160">
                    <div class="div_stripe">
                        <div class="loading_stripe"></div>
                    </div>
                </div>
            </label>
            <label>
                <div class="stripe_div_medium130">
                    <div class="div_stripe">
                        <div class="loading_stripe"></div>
                    </div>
                </div>
            </label>
            <label>
                <div class="stripe_div_medium160">
                    <div class="div_stripe">
                        <div class="loading_stripe"></div>
                    </div>
                </div>
            </label>
            <label>
                <div class="stripe_div_small100">
                    <div class="div_stripe">
                        <div class="loading_stripe"></div>
                    </div>
                </div>
            </label>
        </div>`;

        //we found
        document.getElementById('airlines_result_ticket').innerHTML = `
        <div class="place_div_white">
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

        //hasil search
        document.getElementById('airlines_ticket_loading').innerHTML = `
        <div class="place_div_dynamic">
            <span style="font-weight:bold; font-size:14px;">
                <div class="stripe_div_medium130">
                    <div class="div_stripe">
                        <div class="loading_stripe"></div>
                    </div>
                </div>
            </span>
        </div>
        <div class="search-box-result mb-3">
            <div class="row" style="padding:10px;">
                <div class="col-xs-10">
                    <div class="stripe_div_small70">
                        <div class="div_stripe">
                            <div class="loading_stripe"></div>
                        </div>
                    </div>
                </div>
                <div class="col-xs-2" style="padding:0px 15px 15px 15px;">
                    <label style="position:absolute; right:15px;">
                        <div class="stripe_checkbox">
                            <div class="div_stripe">
                                <div class="loading_stripe"></div>
                            </div>
                        </div>
                    </label>
                </div>
                <div class="col-lg-12" style="margin-top:10px;">
                    <div class="row mt-2">
                        <div class="col-lg-2">
                            <div class="row">
                                <div class="col-lg-12">
                                    <span>
                                        <div class="stripe_span">
                                            <div class="div_stripe">
                                                <div class="loading_stripe"></div>
                                            </div>
                                        </div>
                                    </span><br>
                                    <div class="stripe_icon_img">
                                        <div class="div_stripe">
                                            <div class="loading_stripe"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-10">
                            <div class="row">
                                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-6">
                                    <table style="width:100%">
                                        <tbody>
                                        <tr>
                                            <td style="padding-bottom:20px;">
                                                <h5>
                                                    <div class="stripe_div_small70">
                                                        <div class="div_stripe">
                                                            <div class="loading_stripe"></div>
                                                        </div>
                                                    </div>
                                                </h5>
                                            </td>
                                            <td style="padding-left:15px;">
                                                <img src="/static/tt_website/images/icon/symbol/airlines-01.png" alt="Airline" style="width:20px; height:20px; margin-top:5px;">
                                            </td>
                                            <td style="height:30px;padding:0 15px;width:100%">
                                                <div style="display:inline-block;position:relative;width:100%">
                                                    <div style="height:2px;position:absolute;top:16px;width:100%;background-color:#d4d4d4;"></div>
                                                    <div class="origin-code-snippet" style="background-color:#d4d4d4;right:-6px"></div>
                                                    <div style="height:30px;min-width:40px;position:relative;width:0%">
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                    <span>
                                        <div class="stripe_span">
                                            <div class="div_stripe">
                                                <div class="loading_stripe"></div>
                                            </div>
                                        </div>
                                    </span>
                                    <span>
                                        <div class="stripe_span">
                                            <div class="div_stripe">
                                                <div class="loading_stripe"></div>
                                            </div>
                                        </div>
                                    </span><br>
                                </div>
                                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-6 mb-2">
                                    <table style="width:100%; margin-bottom:5px;">
                                        <tbody>
                                        <tr>
                                            <td style="padding-bottom:15px;">
                                                <h5>
                                                    <div class="stripe_div_small70">
                                                        <div class="div_stripe">
                                                            <div class="loading_stripe"></div>
                                                        </div>
                                                    </div>
                                                </h5>
                                            </td>
                                            <td></td>
                                            <td style="height:30px;padding:0 15px;width:100%"></td>
                                        </tr>
                                        </tbody>
                                    </table>
                                    <span>
                                        <div class="stripe_span">
                                            <div class="div_stripe">
                                                <div class="loading_stripe"></div>
                                            </div>
                                        </div>
                                    </span>
                                    <span>
                                        <div class="stripe_span">
                                            <div class="div_stripe">
                                                <div class="loading_stripe"></div>
                                            </div>
                                        </div>
                                    </span><br>
                                </div>
                                <div class="col-lg-4 col-md-4 col-sm-4">
                                    <div class="row">
                                        <div class="col-xs-12">
                                            <span>
                                                <div class="stripe_span">
                                                    <div class="div_stripe">
                                                        <div class="loading_stripe"></div>
                                                    </div>
                                                </div>
                                            </span>
                                        </div>
                                        <div class="col-xs-12">
                                            <span>
                                                <div class="stripe_span">
                                                    <div class="div_stripe">
                                                        <div class="loading_stripe"></div>
                                                    </div>
                                                </div>
                                            </span>
                                        </div>
                                        <div class="col-xs-12">
                                            <div class="row">
                                                <div class="col-xs-12">
                                                    <span>
                                                        <div class="stripe_span">
                                                            <div class="div_stripe">
                                                                <div class="loading_stripe"></div>
                                                            </div>
                                                        </div>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-xs-12">
                                            <span>
                                                <div class="stripe_span">
                                                    <div class="div_stripe">
                                                        <div class="loading_stripe"></div>
                                                    </div>
                                                </div>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6" style="padding-bottom:10px; margin-top: 15px;">
                    <span>
                        <div class="stripe_span">
                            <div class="div_stripe">
                                <div class="loading_stripe"></div>
                            </div>
                        </div>
                    </span>
                    <span>
                        <div class="stripe_span">
                            <div class="div_stripe">
                                <div class="loading_stripe"></div>
                            </div>
                        </div>
                    </span>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6">
                    <div class="row">
                        <div class="col-lg-12">
                            <span style="float:right;">
                                <div class="stripe_price">
                                    <div class="div_stripe">
                                        <div class="loading_stripe"></div>
                                    </div>
                                </div>
                            </span>
                        </div>
                        <div class="col-lg-12">
                            <span style="float:right;">
                                <div class="stripe_button">
                                    <div class="div_stripe">
                                        <div class="loading_stripe"></div>
                                    </div>
                                </div>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="search-box-result mb-3">
            <div class="row" style="padding:10px;">
                <div class="col-xs-10"></div>
                <div class="col-xs-2" style="padding:0px 15px 15px 15px;">
                    <label style="position:absolute; right:15px;">
                        <div class="stripe_checkbox">
                            <div class="div_stripe">
                                <div class="loading_stripe"></div>
                            </div>
                        </div>
                    </label>
                </div>
                <div class="col-lg-12">
                    <div class="row mt-2">
                        <div class="col-lg-2">
                            <div class="row">
                                <div class="col-lg-12">
                                    <span>
                                        <div class="stripe_span">
                                            <div class="div_stripe">
                                                <div class="loading_stripe"></div>
                                            </div>
                                        </div>
                                    </span><br>
                                    <div class="stripe_icon_img">
                                        <div class="div_stripe">
                                            <div class="loading_stripe"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-10">
                            <div class="row">
                                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-6">
                                    <table style="width:100%">
                                        <tbody>
                                        <tr>
                                            <td style="padding-bottom:20px;">
                                                <h5>
                                                    <div class="stripe_div_small70">
                                                        <div class="div_stripe">
                                                            <div class="loading_stripe"></div>
                                                        </div>
                                                    </div>
                                                </h5>
                                            </td>
                                            <td style="padding-left:15px;">
                                                <img src="/static/tt_website/images/icon/symbol/airlines-01.png" alt="Airline" style="width:20px; height:20px; margin-top:5px;">
                                            </td>
                                            <td style="height:30px;padding:0 15px;width:100%">
                                                <div style="display:inline-block;position:relative;width:100%">
                                                    <div style="height:2px;position:absolute;top:16px;width:100%;background-color:#d4d4d4;"></div>
                                                    <div class="origin-code-snippet" style="background-color:#d4d4d4;right:-6px"></div>
                                                    <div style="height:30px;min-width:40px;position:relative;width:0%">
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                    <span>
                                        <div class="stripe_span">
                                            <div class="div_stripe">
                                                <div class="loading_stripe"></div>
                                            </div>
                                        </div>
                                    </span>
                                    <span>
                                        <div class="stripe_span">
                                            <div class="div_stripe">
                                                <div class="loading_stripe"></div>
                                            </div>
                                        </div>
                                    </span><br>
                                </div>
                                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-6 mb-2">
                                    <table style="width:100%; margin-bottom:5px;">
                                        <tbody>
                                        <tr>
                                            <td style="padding-bottom:15px;">
                                                <h5>
                                                    <div class="stripe_div_small70">
                                                        <div class="div_stripe">
                                                            <div class="loading_stripe"></div>
                                                        </div>
                                                    </div>
                                                </h5>
                                            </td>
                                            <td></td>
                                            <td style="height:30px;padding:0 15px;width:100%"></td>
                                        </tr>
                                        </tbody>
                                    </table>
                                    <span>
                                        <div class="stripe_span">
                                            <div class="div_stripe">
                                                <div class="loading_stripe"></div>
                                            </div>
                                        </div>
                                    </span>
                                    <span>
                                        <div class="stripe_span">
                                            <div class="div_stripe">
                                                <div class="loading_stripe"></div>
                                            </div>
                                        </div>
                                    </span><br>
                                </div>
                                <div class="col-lg-4 col-md-4 col-sm-4">
                                    <div class="row">
                                        <div class="col-xs-12">
                                            <span>
                                                <div class="stripe_span">
                                                    <div class="div_stripe">
                                                        <div class="loading_stripe"></div>
                                                    </div>
                                                </div>
                                            </span>
                                        </div>
                                        <div class="col-xs-12">
                                            <span>
                                                <div class="stripe_span">
                                                    <div class="div_stripe">
                                                        <div class="loading_stripe"></div>
                                                    </div>
                                                </div>
                                            </span>
                                        </div>
                                        <div class="col-xs-12">
                                            <div class="row">
                                                <div class="col-xs-12">
                                                    <span>
                                                        <div class="stripe_span">
                                                            <div class="div_stripe">
                                                                <div class="loading_stripe"></div>
                                                            </div>
                                                        </div>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-xs-12">
                                            <span>
                                                <div class="stripe_span">
                                                    <div class="div_stripe">
                                                        <div class="loading_stripe"></div>
                                                    </div>
                                                </div>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6" style="padding-bottom:10px; margin-top: 15px;">
                    <span>
                        <div class="stripe_span">
                            <div class="div_stripe">
                                <div class="loading_stripe"></div>
                            </div>
                        </div>
                    </span>
                    <span>
                        <div class="stripe_span">
                            <div class="div_stripe">
                                <div class="loading_stripe"></div>
                            </div>
                        </div>
                    </span>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6">
                    <div class="row">
                        <div class="col-lg-12">
                            <span style="float:right;">
                                <div class="stripe_price">
                                    <div class="div_stripe">
                                        <div class="loading_stripe"></div>
                                    </div>
                                </div>
                            </span>
                        </div>
                        <div class="col-lg-12">
                            <span style="float:right;">
                                <div class="stripe_button">
                                    <div class="div_stripe">
                                        <div class="loading_stripe"></div>
                                    </div>
                                </div>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="search-box-result mb-3">
            <div class="row" style="padding:10px;">
                <div class="col-xs-10"></div>
                <div class="col-xs-2" style="padding:0px 15px 15px 15px;">
                    <label style="position:absolute; right:15px;">
                        <div class="stripe_checkbox">
                            <div class="div_stripe">
                                <div class="loading_stripe"></div>
                            </div>
                        </div>
                    </label>
                </div>
                <div class="col-lg-12">
                    <div class="row mt-2">
                        <div class="col-lg-2">
                            <div class="row">
                                <div class="col-lg-12">
                                    <span>
                                        <div class="stripe_span">
                                            <div class="div_stripe">
                                                <div class="loading_stripe"></div>
                                            </div>
                                        </div>
                                    </span><br>
                                    <div class="stripe_icon_img">
                                        <div class="div_stripe">
                                            <div class="loading_stripe"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-10">
                            <div class="row">
                                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-6">
                                    <table style="width:100%">
                                        <tbody>
                                        <tr>
                                            <td style="padding-bottom:20px;">
                                                <h5>
                                                    <div class="stripe_div_small70">
                                                        <div class="div_stripe">
                                                            <div class="loading_stripe"></div>
                                                        </div>
                                                    </div>
                                                </h5>
                                            </td>
                                            <td style="padding-left:15px;">
                                                <img src="/static/tt_website/images/icon/symbol/airlines-01.png" alt="Airline" style="width:20px; height:20px; margin-top:5px;">
                                            </td>
                                            <td style="height:30px;padding:0 15px;width:100%">
                                                <div style="display:inline-block;position:relative;width:100%">
                                                    <div style="height:2px;position:absolute;top:16px;width:100%;background-color:#d4d4d4;"></div>
                                                    <div class="origin-code-snippet" style="background-color:#d4d4d4;right:-6px"></div>
                                                    <div style="height:30px;min-width:40px;position:relative;width:0%">
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                    <span>
                                        <div class="stripe_span">
                                            <div class="div_stripe">
                                                <div class="loading_stripe"></div>
                                            </div>
                                        </div>
                                    </span>
                                    <span>
                                        <div class="stripe_span">
                                            <div class="div_stripe">
                                                <div class="loading_stripe"></div>
                                            </div>
                                        </div>
                                    </span><br>
                                </div>
                                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-6 mb-2">
                                    <table style="width:100%; margin-bottom:5px;">
                                        <tbody>
                                        <tr>
                                            <td style="padding-bottom:15px;">
                                                <h5>
                                                    <div class="stripe_div_small70">
                                                        <div class="div_stripe">
                                                            <div class="loading_stripe"></div>
                                                        </div>
                                                    </div>
                                                </h5>
                                            </td>
                                            <td></td>
                                            <td style="height:30px;padding:0 15px;width:100%"></td>
                                        </tr>
                                        </tbody>
                                    </table>
                                    <span>
                                        <div class="stripe_span">
                                            <div class="div_stripe">
                                                <div class="loading_stripe"></div>
                                            </div>
                                        </div>
                                    </span>
                                    <span>
                                        <div class="stripe_span">
                                            <div class="div_stripe">
                                                <div class="loading_stripe"></div>
                                            </div>
                                        </div>
                                    </span><br>
                                </div>
                                <div class="col-lg-4 col-md-4 col-sm-4">
                                    <div class="row">
                                        <div class="col-xs-12">
                                            <span>
                                                <div class="stripe_span">
                                                    <div class="div_stripe">
                                                        <div class="loading_stripe"></div>
                                                    </div>
                                                </div>
                                            </span>
                                        </div>
                                        <div class="col-xs-12">
                                            <span>
                                                <div class="stripe_span">
                                                    <div class="div_stripe">
                                                        <div class="loading_stripe"></div>
                                                    </div>
                                                </div>
                                            </span>
                                        </div>
                                        <div class="col-xs-12">
                                            <div class="row">
                                                <div class="col-xs-12">
                                                    <span>
                                                        <div class="stripe_span">
                                                            <div class="div_stripe">
                                                                <div class="loading_stripe"></div>
                                                            </div>
                                                        </div>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-xs-12">
                                            <span>
                                                <div class="stripe_span">
                                                    <div class="div_stripe">
                                                        <div class="loading_stripe"></div>
                                                    </div>
                                                </div>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6" style="padding-bottom:10px; margin-top: 15px;">
                    <span>
                        <div class="stripe_span">
                            <div class="div_stripe">
                                <div class="loading_stripe"></div>
                            </div>
                        </div>
                    </span>
                    <span>
                        <div class="stripe_span">
                            <div class="div_stripe">
                                <div class="loading_stripe"></div>
                            </div>
                        </div>
                    </span>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6">
                    <div class="row">
                        <div class="col-lg-12">
                            <span style="float:right;">
                                <div class="stripe_price">
                                    <div class="div_stripe">
                                        <div class="loading_stripe"></div>
                                    </div>
                                </div>
                            </span>
                        </div>
                        <div class="col-lg-12">
                            <span style="float:right;">
                                <div class="stripe_button">
                                    <div class="div_stripe">
                                        <div class="loading_stripe"></div>
                                    </div>
                                </div>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

        $("#badge-flight-notif").removeClass("infinite");
        $("#badge-flight-notif2").removeClass("infinite");
        $("#myModalTicketFlight").modal('hide');
        $('#loading-search-flight').hide();
        $('#button_chart_airline').hide();
        $('#choose-ticket-flight').show();
        $('#airlines_result_ticket').show();
        send_search_to_api();
//        airline_signin('');
      }
    })

//    change_date_next_prev(counter_search-1);
}

function change_date_next_prev(counter){
    var today_date = moment().format('DD MMM YYYY'); //hari ini
    flight_date = moment(airline_request.departure[counter]);
    var date_format = 'DD MMM YYYY';

    document.getElementById('change_date_search').innerHTML = `
    <div class="owl-carousel owl-theme">
        <div class="item" id="prev_date_2">

        </div>
        <div class="item" id="prev_date_1">

        </div>
        <div class="item" id="now_date">

        </div>
        <div class="item" id="next_date_1">

        </div>
        <div class="item" id="next_date_2">

        </div>
    </div>`;

    $('.owl-carousel').owlCarousel({
        loop:false,
        nav: true,
        margin: 20,
        responsiveClass:true,
        dots: false,
        smartSpeed:500,
        autoplay: false,
        autoplayTimeout:5000,
        autoplayHoverPause:false,
        navText: ['<i class="fa fa-caret-left owl-wh"/>', '<i class="fa fa-caret-right owl-wh"/>'],
        responsive:{
            0:{
                items:5,
                nav:true
            },
            480:{
                items:5,
                nav:true
            },
            768:{
                items:5,
                nav:true
            },
            961:{
                items:5,
                nav:true
            }
        }
    });

    document.getElementById('now_date').innerHTML = `<div class="button_date_np" style="background:white; border:2px solid `+color+`; text-align: center;" id="div_onclick_now_date">`+flight_date.format(date_format)+`</div>`;
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
    document.getElementById('choose_seat_span'+id1+id2).innerHTML = ''+textseat;
}

function change_seat_fare_span(id1, id2, textseat){
    document.getElementById('fare_seat_class'+id1+id2).innerHTML = ''+textseat;
    document.getElementById('fare_seat_class_fd'+id1+id2).innerHTML = ''+textseat;
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
                                text+=`<br/><span style="font-weight:500;padding-bottom:15px;">`+$(this).html()+` </span><br/>`;
                                $text += '• '+$(this).html()+' \n';
                            }
                        }
                    });

                    var co_j = j+1;
                    text+=`<h5 style="padding-bottom:5px;">Flight-`+co_j+`</h5>`;
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
        <span style="font-size:14px; font-weight:bold;"><i class="fas fa-share-alt"></i> Share This on:</span><br/>`;
        share_data();
        var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
            text+=`
                <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" alt="Whatsapp" src="/static/tt_website/images/logo/apps/whatsapp.png"/></a>`;
            if(airline_number < 11){
                text+=`
                    <a href="line://msg/text/`+ $text_share +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" alt="Line" src="/static/tt_website/images/logo/apps/line.png"/></a>
                    <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" alt="Telegram" src="/static/tt_website/images/logo/apps/telegram.png"/></a>`;
            }
            else{
                text+=`
                <a href="#" target="_blank" title="Share by Line" style="padding-right:5px; cursor:not-allowed;"><img style="height:30px; width:auto;" alt="Line Disable" src="/static/tt_website/images/logo/apps/line-gray.png"/></a>
                <a href="#" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" alt="Telegram Disable" src="/static/tt_website/images/logo/apps/telegram-gray.png"/></a>`;
            }
            text+=`
                <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" alt="Email" src="/static/tt_website/images/logo/apps/email.png"/></a>`;
        } else {
            text+=`
                <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" alt="Whatsapp" src="/static/tt_website/images/logo/apps/whatsapp.png"/></a>`;
            if(airline_number < 11){
                text+=`
                    <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" alt="Line" src="/static/tt_website/images/logo/apps/line.png"/></a>
                    <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" alt="Telegram" src="/static/tt_website/images/logo/apps/telegram.png"/></a>`;
            }
            else{
                text+=`
                <a href="#" title="Share by Line" style="padding-right:5px; cursor:not-allowed;"><img style="height:30px; width:auto;" alt="Line Disable" src="/static/tt_website/images/logo/apps/line-gray.png"/></a>
                <a href="#" title="Share by Telegram" style="padding-right:5px; cursor:not-allowed;"><img style="height:30px; width:auto;" alt="Telegram Disable" src="/static/tt_website/images/logo/apps/telegram-gray.png"/></a>`;
            }
            text+=`
                <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" alt="Email" src="/static/tt_website/images/logo/apps/email.png"/></a>`;
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

function reschedule_list_details(key, type){
    var reschedule_flight_detail = document.getElementById('detail_reschedule_list_'+type+'_'+key);
    var reschedule_flight_down = document.getElementById('reschedule_list_details_'+type+'_down'+key);
    var reschedule_flight_up = document.getElementById('reschedule_list_details_'+type+'_up'+key);

    if (reschedule_flight_detail.style.display === "none") {
        reschedule_flight_up.style.display = "block";
        reschedule_flight_down.style.display = "none";
        reschedule_flight_detail.style.display = "block";

    }
    else {
        reschedule_flight_up.style.display = "none";
        reschedule_flight_down.style.display = "block";
        reschedule_flight_detail.style.display = "none";
    }
}

function request_new_after_sales(inp_pax_seat = false){
    if(typeof(is_process_repricing) !== 'undefined')
        update_service_charge('request_new');
    update_booking_after_sales_v2(inp_pax_seat);
}

function post_issued_after_sales(adds_type, inp_pax_seat = false){
    if(typeof(is_process_repricing) !== 'undefined')
        update_service_charge('request_post_issued~'+adds_type);
    update_booking_after_sales_v2(inp_pax_seat);
}

function update_valid_passport(type, index){
    if(document.getElementById(type+'_valid_passport'+index).checked){
        document.getElementById(type+'_identity_div'+index).style.display = 'none';
    }else{
        document.getElementById(type+'_identity_div'+index).style.display = 'block';
    }
}

function go_back_page(){
    window.location.href=document.referrer;
}

function get_default_ssr(pax, itinerary, page){
    if(page == 'ssr_page'){
         document.getElementsByClassName("ssr_included_page").style.display = 'b';
    }

    for(co in pax){
        id_co = parseInt(co)+1;
        if(pax[co].pax_type != 'INF'){
            default_ssr_text = '';
            for(i in itinerary){
                //id_i = parseInt(i)+1;
                for(j in itinerary[i].journeys){
                    for(k in itinerary[i].journeys[j].segments){
                        default_ssr_text+=`<b>• `+itinerary[i].journeys[j].segments[k].origin+` - `+itinerary[i].journeys[j].segments[k].destination+` ( `+itinerary[i].journeys[j].segments[k].departure_date+` )</b><br/>`;
                        if(page == 'booking'){
                            if(itinerary[i].journeys[j].segments[k].fare_details.length != 0){
                                for(m in itinerary[i].journeys[j].segments[k].fare_details){
                                    default_ssr_text +=`
                                    <div class="row">
                                       <div class="col-xs-12">`;
                                       if(itinerary[i].journeys[j].segments[k].fare_details[m].detail_type.includes('BG')){
                                            default_ssr_text +=`<i class="fas fa-suitcase"></i><b> Baggage: </b> <i>`+itinerary[i].journeys[j].segments[k].fare_details[m].amount+` `+itinerary[i].journeys[j].segments[k].fare_details[m].unit+`</i><br/>`;
                                       }
                                       else if(itinerary[i].journeys[j].segments[k].fare_details[m].detail_type == 'ML'){
                                            default_ssr_text +=`<i class="fas fa-utensils"></i><b> Meal: </b> <i>`+itinerary[i].journeys[j].segments[k].fare_details[m].amount+` `+itinerary[i].journeys[j].segments[k].fare_details[m].unit+`</i><br/>`;
                                       }
                                       else{
                                            default_ssr_text +=`<i>`+itinerary[i].journeys[j].segments[k].fare_details[m].amount+` `+itinerary[i].journeys[j].segments[k].fare_details[m].unit+`</i><br/>`;
                                       }
                                   default_ssr_text+=`
                                       </div>
                                   </div>`;
                                }
                            }
                            else{
                                default_ssr_text += `<i>No SSR</i><br/>`;
                            }
                        }
                        else{
                            for(l in itinerary[i].journeys[j].segments[k].fares){
                                if(itinerary[i].journeys[j].segments[k].fares[l].fare_details.length != 0){
                                    for(m in itinerary[i].journeys[j].segments[k].fares[l].fare_details){
                                        default_ssr_text +=`
                                        <div class="row">
                                           <div class="col-xs-12">`;
                                           if(itinerary[i].journeys[j].segments[k].fares[l].fare_details[m].detail_type.includes('BG')){
                                                default_ssr_text +=`<i class="fas fa-suitcase"></i><b> Baggage: </b> <i>`+itinerary[i].journeys[j].segments[k].fares[l].fare_details[m].amount+` `+itinerary[i].journeys[j].segments[k].fares[l].fare_details[m].unit+`</i><br/>`;
                                           }
                                           else if(itinerary[i].journeys[j].segments[k].fares[l].fare_details[m].detail_type == 'ML'){
                                                default_ssr_text +=`<i class="fas fa-utensils"></i><b> Meal: </b> <i>`+itinerary[i].journeys[j].segments[k].fares[l].fare_details[m].amount+` `+itinerary[i].journeys[j].segments[k].fares[l].fare_details[m].unit+`</i><br/>`;
                                           }
                                           else{
                                                default_ssr_text +=`<i>`+itinerary[i].journeys[j].segments[k].fares[l].fare_details[m].amount+` `+itinerary[i].journeys[j].segments[k].fares[l].fare_details[m].unit+`</i><br/>`;
                                           }
                                       default_ssr_text+=`
                                           </div>
                                       </div>`;
                                    }
                                }
                                else{
                                    default_ssr_text += `<i>No SSR</i><br/>`;
                                }
                            }
                        }
                    }
                }
            }
            document.getElementById('included_ssr'+id_co).innerHTML = default_ssr_text;
        }
    }
}

function onchange_mc_date(val){
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
                if(moment(pick_date) < moment(min_date))
                    pick_date = min_date;
            }
            catch(err){
                min_date = $("#airline_departure").val()
                pick_date = $("#airline_departure").val()
            }

            picker_multi_city[i].destroy();
            document.getElementById('airline_departure'+i).value = pick_date;
            picker_multi_city[i] = new Lightpick({
                field: document.getElementById('airline_departure'+i),
                singleDate: true,
                startDate: pick_date,
                minDate: min_date,
                maxDate: moment().subtract(-1, 'years'),
                idNumber: i,
                onSelect: function(date){
                    onchange_mc_date(this._opts.idNumber);
                    setTimeout(function(){
                        $("#origin_id_flight"+parseInt(this._opts.idNumber+1)).focus();
                    }, 200);
                }
            });
        }
    }
}

function print_fare_detail_name(id, val){
    document.getElementById(id).innerHTML = `
    <i class="fas fa-eye-slash" onclick="delete_fare_detail_name('`+id+`', '`+val+`');" style="padding-left:5px; color:`+color+`; cursor:pointer; font-size:16px;"></i>
    <br/>
    <span style="padding-bottom:5px;">
        `+val+`
    </span>`;
}
function delete_fare_detail_name(id, val){
    document.getElementById(id).innerHTML = `
    <i class="fas fa-info-circle" onclick="print_fare_detail_name('`+id+`', '`+val+`');" style="padding-left:5px; color:`+color+`; cursor:pointer; font-size:16px;"></i>`;
}

function auto_fill_airline_cookie(cookie_airline,page='home'){
    // data default awal agar kalau oneway/return pindah ke MC tidak rusak
    airline_origin = cookie_airline['origin'][0];
    airline_destination = cookie_airline['destination'][0];
    airline_date =cookie_airline['departure'][0];

    // CHANGE tab oneway, return, MC
    if(['roundtrip', 'multicity'].includes(cookie_airline['direction'])){
        $("input[name=radio_airline_type][value='"+cookie_airline['direction']+"']").prop("checked",true);
        $("#radio_airline_search").click();
    }

    // DATA FILL
    if(['oneway','roundtrip'].includes(cookie_airline['direction'])){
        document.getElementById('origin_id_flight').value = cookie_airline['origin'][0];
        document.getElementById('destination_id_flight').value = cookie_airline['destination'][0];
        if(cookie_airline['direction'] == 'oneway'){
            document.getElementById('airline_departure').value = cookie_airline['departure'][0];
            var picker_airline_departure = new Lightpick({
                field: document.getElementById('airline_departure'),
                singleDate: true,
                startDate: cookie_airline['departure'][0],
                minDate: moment(),
                maxDate: moment().subtract(-1, 'years'),
                nextFocus: '#show_total_pax_flight'
            });
        }else{
            document.getElementById('airline_departure_return').value = cookie_airline['departure'][0] + ' - ' + cookie_airline['return'][0];
            document.getElementById('airline_departure').value = cookie_airline['departure'][0];
            document.getElementById('airline_return').value = cookie_airline['return'][0];
            var picker_airline_departure = new Lightpick({
                field: document.getElementById('airline_departure'),
                singleDate: false,
                startDate: cookie_airline['departure'][0],
                endDate: cookie_airline['return'][0],
                minDate: moment(),
                maxDate: moment().subtract(-1, 'years'),
                nextFocus: '#show_total_pax_flight'
            });
        }
        if(cookie_airline['adult']){
            document.getElementById('adult_flight').value = cookie_airline['adult'];
        }

        if(cookie_airline['child']){
            document.getElementById('child_flight').value = cookie_airline['child'];
        }

        if(cookie_airline['infant']){
            document.getElementById('infant_flight').value = cookie_airline['infant'];
        }

        if(cookie_airline.hasOwnProperty('student') && cookie_airline['student']){
            document.getElementById('student_flight').value = cookie_airline['student'];
        }

        if(cookie_airline.hasOwnProperty('labour') && cookie_airline['labour']){
            document.getElementById('student_flight').value = cookie_airline['student'];
        }

        if(cookie_airline.hasOwnProperty('seaman') && cookie_airline['seaman']){
            document.getElementById('seaman_flight').value = cookie_airline['seaman'];
        }
        document.getElementById('cabin_class_flight').value = cookie_airline['cabin_class'];
        // update niceselect
        $('#cabin_class_flight').niceSelect('update');
    }else{
        document.getElementById('origin_id_flight1').value = cookie_airline['origin'][0];
        document.getElementById('destination_id_flight1').value = cookie_airline['destination'][0];
        document.getElementById('airline_departure1').value = cookie_airline['departure'][0];
        document.getElementById('cabin_class_flight1').value = cookie_airline['cabin_class_list'][0];
        document.getElementById('origin_id_flight2').value = cookie_airline['origin'][1];
        document.getElementById('destination_id_flight2').value = cookie_airline['destination'][1];
        document.getElementById('airline_departure2').value = cookie_airline['departure'][1];
        document.getElementById('cabin_class_flight2').value = cookie_airline['cabin_class_list'][1];
        document.getElementById('cabin_class_flight_mc').value = cookie_airline['cabin_class'];
        // update niceselect
        $('#cabin_class_flight1').niceSelect('update');
        $('#cabin_class_flight2').niceSelect('update');

        new Lightpick({
            field: document.getElementById('airline_departure1'),
            singleDate: true,
            startDate: cookie_airline['departure'][0],
            minDate: moment(),
            maxDate: moment().subtract(-1, 'years'),
            idNumber: 0,
            onSelect: function(date){
                onchange_mc_date(this._opts.idNumber);
                setTimeout(function(){
                    $("#origin_id_flight"+parseInt(this._opts.idNumber+1)).focus();
                }, 200);
            }
        });

        new Lightpick({
            field: document.getElementById('airline_departure2'),
            singleDate: true,
            startDate: cookie_airline['departure'][1],
            minDate: cookie_airline['departure'][0],
            maxDate: moment().subtract(-1, 'years'),
            idNumber: 1,
            onSelect: function(date){
                onchange_mc_date(this._opts.idNumber);
                setTimeout(function(){
                    $("#origin_id_flight"+parseInt(this._opts.idNumber+1)).focus();
                }, 200);
            }
        });

        if(cookie_airline['adult']){
            document.getElementById('adult_flight1').value = cookie_airline['adult'];
        }

        if(cookie_airline['child']){
            document.getElementById('child_flight1').value = cookie_airline['child'];
        }

        if(cookie_airline['infant']){
            document.getElementById('infant_flight1').value = cookie_airline['infant'];
        }

        if(cookie_airline.hasOwnProperty('student') && cookie_airline['student']){
            document.getElementById('student_flight1').value = cookie_airline['student'];
        }

        if(cookie_airline.hasOwnProperty('labour') && cookie_airline['labour']){
            document.getElementById('student_flight1').value = cookie_airline['student'];
        }

        if(cookie_airline.hasOwnProperty('seaman') && cookie_airline['seaman']){
            document.getElementById('seaman_flight1').value = cookie_airline['seaman'];
        }
        // MC
        for(i=3;i<=counter;i++){
            add_multi_city(page);
            document.getElementById('origin_id_flight'+i).value = cookie_airline['origin'][i-1];
            document.getElementById('destination_id_flight'+i).value = cookie_airline['destination'][i-1];
            document.getElementById('airline_departure'+i).value = cookie_airline['departure'][i-1];
            document.getElementById('cabin_class_flight'+i).value = cookie_airline['cabin_class_list'][i-1];
            $('#cabin_class_flight'+i).niceSelect('update');
            new Lightpick({
                field: document.getElementById('airline_departure'+i),
                singleDate: true,
                startDate: cookie_airline['departure'][i-1],
                minDate: cookie_airline['departure'][i-2],
                maxDate: moment().subtract(-1, 'years'),
                idNumber: i,
                onSelect: function(date){
                    onchange_mc_date(this._opts.idNumber);
                    setTimeout(function(){
                        $("#origin_id_flight"+parseInt(this._opts.idNumber+1)).focus();
                    }, 200);
                }
            });
        }
    }
    plus_min_passenger_airline_btn();
    if(['roundtrip', 'multicity'].includes(cookie_airline['is_combo_price'])){
        document.getElementById('is_combo_price').checked = cookie_airline['is_combo_price'];
    }


}