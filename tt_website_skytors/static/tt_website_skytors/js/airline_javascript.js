price_type = [];

additional_price = 0;

airline_choose = 0;

sorting_value = '';

counter_search = 0;
counter_airline_search = 0;

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

function airline_goto_search(){
    type = '';
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
        document.getElementById('counter').value = counter_airline_search;
        document.getElementById('airline_searchForm').submit();
    }else{
        error_log = '';
        if(error_log == ''){
            document.getElementById('counter').value = counter_airline_search;
            document.getElementById('airline_searchForm').submit();
        }else
            alert(error_log)
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
    if(counter_airline_search != 3){
        counter_airline_search++;
        if(counter_airline_search == 1){
            var node_paxs = document.createElement("div");
            text_paxs = `
            <div class="row">
                <div class="col-lg-4 col-md-4 col-sm-4" style="text-align:left;">
                    <span class="span-search-ticket"><i class="fas fa-users"></i> Passenger</span>
                    <div class="input-container-search-ticket btn-group">
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
                                    <div style="float:right; display:flex; padding:5px 0px 5px 5px;">
                                        <button type="button" class="left-minus-adult-flight btn-custom-circle" id="left-minus-adult-flight`+counter_airline_search+`" onclick="airline_set_passenger_minus('adult',`+counter_airline_search+`);" data-type="minus" data-field="" disabled>
                                            <i class="fas fa-minus"></i>
                                        </button>
                                        <input type="text" style="padding:5px !important; border:none; background:none; font-size:13px; text-align:center; width:25px;" id="adult_flight`+counter_airline_search+`" name="adult_flight`+counter_airline_search+`" value="1" min="1" readonly>
                                        <button type="button" class="right-plus-adult-flight btn-custom-circle" id="right-plus-adult-flight`+counter_airline_search+`" data-type="plus" data-field="" onclick="airline_set_passenger_plus('adult',`+counter_airline_search+`);">
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
                                    <div style="float:right; display:flex; padding:5px 0px 5px 5px;">
                                        <button type="button" class="left-minus-child-flight btn-custom-circle" id="left-minus-child-flight`+counter_airline_search+`" data-type="minus" data-field="" disabled onclick="airline_set_passenger_minus('child',`+counter_airline_search+`);">
                                            <i class="fas fa-minus"></i>
                                        </button>
                                        <input type="text" style="padding:5px !important; border:none; background:none; font-size:13px; text-align:center; width:25px;" id="child_flight`+counter_airline_search+`" name="child_flight`+counter_airline_search+`" value="0" min="0" readonly>
                                        <button type="button" class="right-plus-child-flight btn-custom-circle" id="right-plus-child-flight`+counter_airline_search+`" data-type="plus" data-field="" onclick="airline_set_passenger_plus('child',`+counter_airline_search+`);">
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
                                    <div style="float:right; display:flex; padding:5px 0px 5px 5px;">
                                        <button type="button" class="left-minus-infant-flight btn-custom-circle" id="left-minus-infant-flight`+counter_airline_search+`" data-type="minus" data-field="" disabled onclick="airline_set_passenger_minus('infant',`+counter_airline_search+`);">
                                            <i class="fas fa-minus"></i>
                                        </button>
                                        <input type="text" style="padding:5px !important; border:none; background:none; font-size:13px; text-align:center; width:25px;" id="infant_flight`+counter_airline_search+`" name="infant_flight`+counter_airline_search+`" value="0" readonly>
                                        <button type="button" class="right-plus-infant-flight btn-custom-circle" id="right-plus-infant-flight`+counter_airline_search+`" data-type="plus" data-field="" onclick="airline_set_passenger_plus('infant',`+counter_airline_search+`);">
                                            <i class="fas fa-plus"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </ul>
                    </div>
                </div>`;
                text_paxs+=`
                <div class="col-lg-4 col-md-4 col-sm-4" style="">
                    <span class="span-search-ticket"><i class="fas fa-plane"></i> Airline</span>
                    <div class="input-container-search-ticket btn-group">
                        <button id="show_provider_airline`+counter_airline_search+`" type="button" class="form-control dropdown-toggle" data-toggle="dropdown" style="text-align:left; cursor:pointer;">Choose Airline</button>
                        <ul id="provider_flight_content`+counter_airline_search+`" class="dropdown-menu" style="padding:10px; z-index:11;">

                        </ul>
                    </div>
                </div>
                <div class="col-lg-4 col-md-4 col-sm-4" style="">
                    <span class="span-search-ticket">Class</span>
                    <div class="input-container-search-ticket btn-group">
                        <div class="form-select" id="default-select`+counter_airline_search+`">
                            <select id="cabin_class_flight`+counter_airline_search+`" name="cabin_class_flight`+counter_airline_search+`" data-live-search="true" size="4">`;
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
        text = `
        <div class="col-lg-12">
            <div class="row">`;
                text+=`
                <div class="col-lg-12" style="text-align:left; padding:0px; margin-top:10px; margin-bottom:10px;">
                    <h5 style="color:#f15a22;">Flight-`+counter_airline_search+`</h5>
                </div>
                <div class="col-lg-8">
                    <div class="row">
                        <div class="col-lg-6 col-md-6 col-sm-6 airline-from" style="padding-left:0px;">
                            <span class="span-search-ticket"><i class="fas fa-plane-departure"></i> From</span>
                            <div class="input-container-search-ticket">
                                <div class="form-select">
                                    <select class="form-control" style="width:100%;" id="origin_id_flight`+counter_airline_search+`" placeholder="City or Airport or IATA" onchange="airline_autocomplete('origin', `+counter_airline_search+`)">

                                    </select>
                                </div>
                                <input type="hidden" name="origin_id_flight`+counter_airline_search+`" id="airline_origin_flight`+counter_airline_search+`" />
                            </div>
                        </div>
                        <div class="image-change-route-vertical">
                            <h4><a href="javascript:airline_switch(`+counter_airline_search+`);" style="z-index:5;" id="flight_switch`+counter_airline_search+`"><i class="image-rounded-icon2"><i class="fas fa-exchange-alt"></i></i></a></h4>
                        </div>
                        <div class="image-change-route-horizontal">
                            <h4><a class="horizontal-arrow" href="javascript:airline_switch(`+counter_airline_search+`);" style="z-index:5; color:white;" id="flight_switch`+counter_airline_search+`"><i class="image-rounded-icon"><i class="fas fa-exchange-alt icon-change"></i></i></a></h4>
                        </div>
                        <div class="col-lg-6 col-md-6 col-sm-6 airline-to" style="z-index:5; padding-right:0px;">
                            <span class="span-search-ticket"><i class="fas fa-plane-arrival"></i> To</span>
                            <div class="input-container-search-ticket">
                                <div class="form-select">
                                    <select class="form-control " name="state" style="width:100%;" id="destination_id_flight`+counter_airline_search+`" name="destination_id_flight`+counter_airline_search+`" placeholder="City or Airport or IATA" onchange="airline_autocomplete('destination', `+counter_airline_search+`)">

                                    </select>
                                </div>
                                <input type="hidden" name="destination_id_flight`+counter_airline_search+`" id="airline_destination_flight`+counter_airline_search+`" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-6" style="padding:0px;">
                    <span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Departure</span>
                    <div class="input-container-search-ticket">
                        <input type="text" class="form-control" name="airline_departure`+counter_airline_search+`" id="airline_departure`+counter_airline_search+`" placeholder="Departure Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date '" autocomplete="off" readonly>
                    </div>
                </div>
            </div>
        </div>`;

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
            airline_request.departure
            $('input[name="airline_departure'+counter_airline_search+'"]').daterangepicker({
              singleDatePicker: true,
              autoUpdateInput: true,
              opens: 'center',
              startDate: airline_request.departure[counter_airline_search-1],
              minDate: moment(),
              maxDate: moment().subtract(-365, 'days'),
              showDropdowns: true,
              locale: {
                  format: 'DD MMM YYYY',
              }
            });
        }else
            $('input[name="airline_departure'+counter_airline_search+'"]').daterangepicker({
              singleDatePicker: true,
              autoUpdateInput: true,
              opens: 'center',
              startDate: $("#airline_departure").val(),
              minDate: moment(),
              maxDate: moment().subtract(-365, 'days'),
              showDropdowns: true,
              locale: {
                  format: 'DD MMM YYYY',
              }
            });
        get_airline_config(type,counter_airline_search);
        $('#origin_id_flight'+counter_airline_search).select2();
        $('#destination_id_flight'+counter_airline_search).select2();
        $('.dropdown-menu').on('click', function(e) {
          e.stopPropagation();
        });

        if(counter_airline_search == 3){
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
    text+= `<h4>Filter</h4>
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
    <hr/>
    <h6 style="padding-bottom:10px;">Departure Time</h6>`;
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
    node = document.createElement("div");
    node.innerHTML = text;
    document.getElementById("filter").appendChild(node);
    node = document.createElement("div");

    text=`
        <hr/>
        <h6 style="padding-bottom:10px;">Arrival Time</h6>`;
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
    text+=`
        <hr/>
        <h6 style="padding-bottom:10px;">Airline</h6>

        <div id="airline_list">

        </div>`;

    node = document.createElement("div");
    node.innerHTML = text;
    document.getElementById("filter").appendChild(node);
    node = document.createElement("div");

    text = `
            <hr/>
            <h6 style="padding-bottom:10px;">Transit</h6>`;
    for(i in transit_list){
        text+=`
        <label class="check_box_custom">
            <span class="span-search-ticket" style="color:black;">`+transit_list[i].value+`</span>
            <input type="checkbox" id="checkbox_transit`+i+`" onclick="change_filter('transit',`+i+`)"/>
            <span class="check_box_span_custom"></span>
        </label><br/>`;
    }
    node = document.createElement("div");
    node.innerHTML = text;
    document.getElementById("filter").appendChild(node);
    node = document.createElement("div");

    text = `
            <hr/>
            <h6 style="padding-bottom:10px;">Transit Duration</h6>`;
    for(i in transit_duration_list){
        text+=`
        <label class="check_box_custom">
            <span class="span-search-ticket" style="color:black;">`+transit_duration_list[i].value+`</span>
            <input type="checkbox" id="checkbox_transit_duration`+i+`" onclick="change_filter('transit_duration',`+i+`)"/>
            <span class="check_box_span_custom"></span>
        </label><br/>`;
    }

    node = document.createElement("div");
    node.innerHTML = text;
    document.getElementById("filter").appendChild(node);

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
    text+= `<h4>Filter</h4>
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
        <hr/>
        <h6 style="padding-bottom:10px;">Airline</h6>

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
    if(type == 'adult'){
        pax = parseInt(document.getElementById('adult_flight'+val).value);
        if(pax + parseInt(document.getElementById('child_flight'+val).value) != 9){
            document.getElementById('adult_flight'+val).value = pax + 1;
            document.getElementById('left-minus-adult-flight'+val).disabled = false;
        }else{
            alert("Maximum 9 passenger of adult and child in flight "+val+"!");
        }
    }else if(type == 'child'){
        pax = parseInt(document.getElementById('child_flight'+val).value);
        if(pax + parseInt(document.getElementById('adult_flight'+val).value) != 9){
            document.getElementById('child_flight'+val).value = pax + 1;
            document.getElementById('left-minus-child-flight'+val).disabled = false;
        }else{
            alert("Maximum 9 passenger of adult and child in flight "+val+"!");
        }
    }else if(type == 'infant'){
        pax = parseInt(document.getElementById('infant_flight'+val).value);
        if(pax < parseInt(document.getElementById('adult_flight'+val).value)){
            document.getElementById('infant_flight'+val).value = pax + 1;
            document.getElementById('left-minus-infant-flight'+val).disabled = false;
        }else{
            alert("Maximum passenger for infant below than adult passenger in flight "+val+"!");
        }
    }
    for(i=1;i<=counter_airline_search;i++)
        document.getElementById('show_total_pax_flight'+i).value = quantity_adult_flight + " Adult, " + quantity_child_flight + " Child, " +quantity_infant_flight + " Infant"
}

function airline_set_passenger_minus(type, val){
    error_log = '';
    if(type == 'adult'){
        if(parseInt(document.getElementById('adult_flight'+val).value) != 1)
            document.getElementById('adult_flight'+val).value = parseInt(document.getElementById('adult_flight'+val).value) - 1;
        else{
            alert("Minimum 1 adult in flight "+val+"!");
        }
        if(parseInt(document.getElementById('infant_flight'+val).value) > document.getElementById('adult_flight'+val).value)
            document.getElementById('infant_flight'+val).value = document.getElementById('adult_flight'+val).value;
    }else if(type == 'child'){
        if(parseInt(document.getElementById('child_flight'+val).value) != 0){
            document.getElementById('child_flight'+val).value = parseInt(document.getElementById('child_flight'+val).value) - 1;
        }
        if(parseInt(document.getElementById('child_flight'+val).value) == 0){
            document.getElementById('left-minus-child-flight'+val).disabled = true;
        }

    }else if(type == 'infant'){
        if(parseInt(document.getElementById('infant_flight'+val).value) != 0){
            document.getElementById('infant_flight'+val).value = parseInt(document.getElementById('infant_flight'+val).value) - 1;
        }
        if(parseInt(document.getElementById('infant_flight'+val).value) == 0){
            document.getElementById('left-minus-infant-flight'+val).disabled = true;
        }
    }

    for(i=1;i<=counter_airline_search;i++)
        document.getElementById('show_total_pax_flight'+i).value = quantity_adult_flight + " Adult, " + quantity_child_flight + " Child, " +quantity_infant_flight + " Infant"
}

function airline_switch(val){
    if(val == undefined){
        var temp = document.getElementById("airline_origin_flight").value;
        document.getElementById("select2-origin_id_flight-container").innerHTML = document.getElementById("airline_destination_flight").value;
        document.getElementById("airline_origin_flight").value = document.getElementById("airline_destination_flight").value;

        document.getElementById("select2-destination_id_flight-container").innerHTML = temp;
        document.getElementById("airline_destination_flight").value = temp;
    }else{

        var temp = document.getElementById("airline_origin_flight"+val).value;
        document.getElementById("select2-origin_id_flight"+val+"-container").innerHTML = document.getElementById("airline_destination_flight"+val).value;
        document.getElementById("airline_origin_flight"+val).value = document.getElementById("airline_destination_flight"+val).value;

        document.getElementById("select2-destination_id_flight"+val+"-container").innerHTML = temp;
        document.getElementById("airline_destination_flight"+val).value = temp;
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
       sort(data);

   }else if(type == 'sort'){
       sort(airline_data);
   }
}

function sort_button(value){

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

function sort(airline){
    if (airline.length == 0 && count == airline_choose){
        document.getElementById("airlines_ticket").innerHTML = '';
        text = '';
        text += `
            <div style="padding:5px; margin:10px;">
                <div style="text-align:center">
                <img src="/static/tt_website_skytors/img/icon/no-flight.jpeg" style="width:80px; height:80px;" alt="" title="" />
                <br/><br/>
                <h6>NO FLIGHT AVAILABLE</h6>
                </div>
            </div>
        `;
        var node = document.createElement("div");
        node.innerHTML = text;
        document.getElementById("airlines_ticket").appendChild(node);
        node = document.createElement("div");
    }
    else{
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
                }
                if(sorting == 'Lowest Price'){
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

            }
        }
        airline_data_filter = airline;
        //change sort render
        document.getElementById("airlines_ticket").innerHTML = '';
        text = '';
        for(i in airline){
           if(airline[i].origin == airline_request.origin[counter_search-1].substr(airline_request.origin[counter_search-1].length-4,3) && airline_departure == 'departure'){
               var price = 0;
               text += `
                    <div style="background-color:white; border:1px solid #cdcdcd; margin-bottom:15px;" id="journey`+i+`">
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="row" style="padding:10px;">
                                    <div class="col-lg-12">`;
                                    if(airline[i].operated_by == false)
                                        try{
                                            text += `<label>Operated By `+airline_carriers[0][airline[i].operated_by_carrier_code].name+`</label><br/>`;
                                        }catch(err){
                                            text += `<label>Operated By `+airline[i].operated_by_carrier_code+`</label><br/>`;
                                        }
                                    for(j in airline[i].carrier_code_list){
                                    text+=`
                                    <img data-toggle="tooltip" style="width:50px; height:50px;" title="`+airline_carriers[0][airline[i].carrier_code_list[j]].name+`" src="http://static.skytors.id/`+airline[i].carrier_code_list[j]+`.png">`;
                                    }
                                    if(airline[i].journey_type == "COM"){
                                        text+=`<span style="float:right; font-weight: bold; padding:5px; border:2px solid #f15a22;">Combo Price</span>`;
                                    }
                                    text+=`
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-9">
                                <div class="row" style="padding:0px 10px 10px 10px;">`;
                                    if(airline[i].journey_type != "COM"){
                                        text+=`
                                        <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5">
                                            <table style="width:100%">
                                                <tr>
                                                    <td class="airport-code"><h5>`+airline[i].departure_date.split(' - ')[1]+`</h5></td>
                                                    <td style="padding-left:15px;">
                                                        <img src="/static/tt_website_skytors/img/icon/airlines-01.png" style="width:20px; height:20px;"/>
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
                                            <span>`+airline[i].departure_date.split(' - ')[0]+` </span><br/>
                                            <span style="font-weight:500;">`+airline_request.origin[counter_search-1].substr(0, airline_request.origin[counter_search-1].length - 5)+` (`+airline[i].origin+`)</span>
                                        </div>
                                        <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5">
                                            <table style="width:100%; margin-bottom:6px;">
                                                <tr>
                                                    <td><h5>`+airline[i].arrival_date.split(' - ')[1]+`</h5></td>
                                                    <td></td>
                                                    <td style="height:30px;padding:0 15px;width:100%"></td>
                                                </tr>
                                            </table>
                                            <span>`+airline[i].arrival_date.split(' - ')[0]+`</span><br/>
                                            <span style="font-weight:500;">`+airline_request.destination[counter_search-1].substr(0, airline_request.destination[counter_search-1].length - 5)+` (`+airline[i].destination+`)</span>
                                        </div>
                                        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2" style="padding:0px;">
                                            <span>Transit: `+airline[i].transit_count+``;
                                            if(airline[i].transit_count==0)
                                                text+=`
                                                </br>
                                                Direct`;
                                            text+=`
                                            </span>
                                        </div>`;
                                    }else if(airline[i].journey_type == "COM"){
                                        for(j in airline[i].segments){
                                            //ganti sini
                                            flight_number = parseInt(j) + 1;
                                            text+=`
                                            <div class="col-lg-12" style="margin-top:5px;">
                                                <span style="font-weight: bold;">Flight `+flight_number+` </span>
                                            </div>`;

                                            text+=`
                                            <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5">
                                                <table style="width:100%">
                                                    <tr>
                                                        <td class="airport-code"><h5>`+airline[i].segments[j].departure_date.split(' - ')[1]+`</h5></td>
                                                        <td style="padding-left:15px;">
                                                            <img src="/static/tt_website_skytors/img/icon/airlines-01.png" style="width:20px; height:20px;"/>
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
                                                <span>`+airline[i].segments[j].departure_date.split(' - ')[0]+` </span></br>
                                                <span style="font-weight:500;">`+airline[i].segments[j].origin_name+`</span>
                                                <span style="font-weight:500;">`+airline[i].segments[j].origin_city+` (`+airline[i].segments[j].origin+`)</span>
                                            </div>

                                            <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5">
                                                <table style="width:100%; margin-bottom:6px;">
                                                    <tr>
                                                        <td><h5>`+airline[i].segments[j].arrival_date.split(' - ')[1]+`</h5></td>
                                                        <td></td>
                                                        <td style="height:30px;padding:0 15px;width:100%"></td>
                                                    </tr>
                                                </table>
                                                <span>`+airline[i].segments[j].arrival_date.split(' - ')[0]+` </span></br>
                                                <span style="font-weight:500;">`+airline[i].segments[j].destination_name+`</span>
                                                <span style="font-weight:500;">`+airline[i].segments[j].destination_city+` (`+airline[i].segments[j].destination+`)</span>
                                            </div>

                                            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2" style="padding:0px;">
                                                <span>Transit: `+airline[i].segments[j].transit_count+`</span>
                                            </div>`;

                                        }
                                    }
                            text+=`
                                </div>
                            </div>
                            <div class="col-lg-3">
                                <div class="row">
                                    <div class="col-lg-12" style="text-align:right; padding:0px 15px 10px 0px;">
                                        <span id="fare`+i+`" class="basic_fare_field" style="font-size:16px;font-weight: bold; color:#505050; padding:10px;">`;

                                        text+=`</span>`;
                                        if(choose_airline != null && choose_airline == airline[i].sequence && airline_request.direction != 'MC')
                                            text+=`<input type='button' style="margin:10px;" id="departjourney`+i+`" class="primary-btn-custom-un choose_selection_ticket_airlines_depart" value="Chosen" onclick="get_price_itinerary(`+i+`)" sequence_id="0"/>`;
                                        else
                                            text+=`<input type='button' style="margin:10px;" id="departjourney`+i+`" class="primary-btn-custom choose_selection_ticket_airlines_depart" value="Choose" onclick="get_price_itinerary(`+i+`)" sequence_id="0"/>`;
                                        text+=`
                                    </div>
                                </div>
                            </div>`;
                            text+=`
                            <div class="col-lg-12" style="text-align:right; padding:0px 15px 10px 0px;">
                                <a id="detail_button_journey0`+i+`" data-toggle="collapse" data-parent="#accordiondepart" onclick="show_flight_details(`+i+`);" href="#detail_departjourney`+i+`" style="color: #f15a22;" aria-expanded="true">
                                    <span style="text-align:right; margin-right:10px; font-weight: bold; display:none;" id="flight_details_up`+i+`"> Flight details <i class="fas fa-chevron-up" style="font-size:14px;"></i></span>
                                    <span style="text-align:right; margin-right:10px; font-weight: bold; display:block;" id="flight_details_down`+i+`"> Flight details <i class="fas fa-chevron-down" style="font-size:14px;"></i></span>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div id="detail_departjourney`+i+`" class="panel-collapse collapse in" aria-expanded="true" style="margin-bottom:15px; border-top: 1px solid #f15a22; display:none;">`;
                        for(j in airline[i].segments){
                            var depart = 0;
                            if(airline[i].segments[j].origin == airline_request.destination[counter_search-1].substr(airline_request.destination[counter_search-1].length-4,3))
                                depart = 1;
                            if(depart == 0 && j == 0)
                                text+=`
                                <div style="text-align:right; background-color:white; padding:5px 10px 5px 10px;">
                                <span style="font-weight: bold; font-size: 14px;">Departure</span>
                                </div>`;
                            else if(depart == 1){
                                text+=`
                                <div style="text-align:right; background-color:white; padding:5px 10px 5px 10px;">
                                <span style="font-weight: bold; font-size: 14px;">Return</span>
                                </div>`;
                                depart = 2;
                            }
                            text+=`
                            <div id="journey0segment0" style="padding:10px 10px 10px 10px; background-color:white; border:1px solid #cdcdcd;">
                                <span style="font-weight: bold;">`+airline_carriers[0][airline[i].segments[j].carrier_code].name+` - </span>
                                <span style="color:#f15a22; font-weight: bold;">`+airline[i].segments[j].carrier_name+`</span><hr/>`;
                                for(k in airline[i].segments[j].legs)
                                text+=`
                                <div class="row">
                                    <div class="col-lg-12">
                                        <div class="row">
                                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                                <table style="width:100%">
                                                    <tr>
                                                        <td class="airport-code"><h5>`+airline[i].segments[j].legs[k].departure_date.split(' - ')[1]+`</h5></td>
                                                        <td style="padding-left:15px;">
                                                            <img src="/static/tt_website_skytors/img/icon/airlines-01.png" style="width:20px; height:20px;"/>
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
                                                <span>`+airline[i].segments[j].legs[k].departure_date.split(' - ')[0]+` </span></br>
                                                <span style="font-weight:500;">`+airline[i].segments[j].legs[k].origin_city+` - `+airline[i].segments[j].legs[k].origin_name+` (`+airline[i].segments[j].legs[k].origin+`)</span></br>
                                                <span>Terminal: </span>
                                            </div>
                                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                                <table style="width:100%; margin-bottom:6px;">
                                                    <tr>
                                                        <td><h5>`+airline[i].segments[j].legs[k].arrival_date.split(' - ')[1]+`</h5></td>
                                                        <td></td>
                                                        <td style="height:30px;padding:0 15px;width:100%"></td>
                                                    </tr>
                                                </table>
                                                <span>`+airline[i].segments[j].legs[k].arrival_date.split(' - ')[0]+`</span></br>
                                                <span style="font-weight:500;">`+airline[i].segments[j].legs[k].destination_city+` - `+airline[i].segments[j].legs[k].destination_name+` (`+airline[i].segments[j].legs[k].destination+`)</span><br/>
                                                <span>Terminal: </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
                                text+=`
                                <br/>
                                <div class="row">
                                    <div class="col-lg-12">
                                        <span><b>Choose Seat (Class Of Service / Seat left) :</b></span>
                                        <div style="overflow:auto; white-space:nowrap;">
                                        <table>
                                            <tr>`;
                                            for(k in airline[i].segments[j].fares){
                                                text+=`
                                                <td style="padding:10px 15px 0px 0px;">`;
                                                if(k==0)
                                                    text+=`
                                                    <label class="radio-button-custom">
                                                        `+airline[i].segments[j].fares[k].class_of_service+`</span> / <span>`+airline[i].segments[j].fares[k].available_count+`
                                                        <input onclick="change_fare(`+airline[i].sequence+`,`+airline[i].segments[j].sequence+`,`+airline[i].segments[j].fares[k].sequence+`);" id="journey`+i+`segment`+airline[i].segments[j].sequence+`fare" name="journey`+i+`segment`+airline[i].segments[j].sequence+`fare" type="radio" value="`+airline[i].segments[j].fares[k].sequence+`" checked="checked">
                                                        <span class="checkmark-radio"></span>
                                                    </label>`;
                                                else
                                                    text+=`
                                                    <label class="radio-button-custom">
                                                        `+airline[i].segments[j].fares[k].class_of_service+`</span> / <span>`+airline[i].segments[j].fares[k].available_count+`
                                                        <input onclick="change_fare(`+i+`,`+airline[i].segments[j].sequence+`,`+airline[i].segments[j].fares[k].sequence+`);" id="journey`+i+`segment`+airline[i].segments[j].sequence+`fare" name="journey`+i+`segment`+airline[i].segments[j].sequence+`fare" type="radio" value="`+airline[i].segments[j].fares[k].sequence+`">
                                                        <span class="checkmark-radio"></span>
                                                    </label>`;
                                                text+=`<br/>`;
                                                var total_price = 0;
                                                for(l in airline[i].segments[j].fares[k].service_charge_summary)
                                                    for(m in airline[i].segments[j].fares[k].service_charge_summary[l].service_charges)
                                                        if(airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'tax' || airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'fare' || airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'roc')
                                                            total_price+= airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].amount;
//                                                for(l in airline[i].segments[j].fares[k].service_charges){
//                                                    total_price += airline[i].segments[j].fares[k].service_charges[l].amount;
//                                                }
                                                id_price_segment = `journey`+i+`segment`+airline[i].segments[j].sequence+`fare`+airline[i].segments[j].fares[k].sequence;
                                                text+=`<span id="`+id_price_segment+`"><b>IDR `+getrupiah(total_price)+`</b></span>`;
                                                text+=`</td>
                                                `;
                                            }

                                            text+=`
                                            </tr>
                                        </table></div>
                                    </div>
                                </div><br/>`;
                            text+=`</div>`;
                        }
                        text+=`
                    </div>
               `;
               var node = document.createElement("div");
               node.innerHTML = text;
               document.getElementById("airlines_ticket").appendChild(node);
               node = document.createElement("div");
    //                   document.getElementById('airlines_ticket').innerHTML += text;
               text = '';
               document.getElementById('fare'+i).innerHTML = 'IDR '+ getrupiah(airline[i].total_price);
           }else if(airline[i].origin == airline_request.destination[counter_search-1].substr(airline_request.destination[counter_search-1].length-4,3) && airline_departure == 'return'){
               var price = 0;
               text += `
                <div style="background-color:white; margin-bottom:15px; border: 1px solid #cdcdcd;" id="journey`+i+`">
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="row" style="padding:10px;">
                                <div class="col-lg-12">`;
                                if(airline[i].operated_by == false)
                                    try{
                                        text += `<label>Operated By `+airline_carriers[0][airline[i].operated_by_carrier_code].name+`</label><br/>`;
                                    }catch(err){
                                        text += `<label>Operated By `+airline[i].operated_by_carrier_code+`</label><br/>`;
                                    }
                                for(j in airline[i].carrier_code_list)
                                text+=`
                                <img data-toggle="tooltip" style="width:50px; height:50px;" title="`+airline_carriers[0][airline[i].carrier_code_list[j]].name+`" class="airline-logo" src="http://static.skytors.id/`+airline[i].carrier_code_list[j]+`.png"><span> </span>`;
                                text+=`
                                </div>
                            </div>
                        </div>

                        <div class="col-lg-9">
                            <div class="row" style="padding:0px 10px 10px 10px;">
                                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5">
                                    <table style="width:100%">
                                        <tr>
                                            <td class="airport-code"><h5>`+airline[i].departure_date.split(' - ')[1]+`</h5></td>
                                            <td style="padding-left:15px;">
                                                <img src="/static/tt_website_skytors/img/icon/airlines-01.png" style="width:20px; height:20px;"/>
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
                                    <span>`+airline[i].departure_date.split(' - ')[0]+` </span></br>
                                    <span style="font-weight:500;">`+airline_request.origin[counter_search-1].substr(0, airline_request.origin[counter_search-1].length - 5)+` (`+airline[i].origin+`)</span>
                                </div>
                                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5">
                                    <table style="width:100%; margin-bottom:6px;">
                                        <tr>
                                            <td><h5>`+airline[i].arrival_date.split(' - ')[1]+`</h5></td>
                                            <td></td>
                                            <td style="height:30px;padding:0 15px;width:100%"></td>
                                        </tr>
                                    </table>
                                    <span>`+airline[i].arrival_date.split(' - ')[0]+` </span></br>
                                    <span style="font-weight:500;">`+airline_request.destination[counter_search-1].substr(0, airline_request.destination[counter_search-1].length - 5)+` (`+airline[i].destination+`)</span>
                                </div>
                                <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2" style="padding:0px;">
                                    <span>Transit: `+airline[i].transit_count+``;
                                    if(airline[i].transit_count==0)
                                        text+=`
                                        </br>
                                        Direct`;
                                    text+=`
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-3">
                            <div class="row">
                                <div class="col-lg-12" style="text-align:right; padding:0px 15px 10px 0px;">
                                    <span id="fare`+i+`" class="basic_fare_field" style="font-size:16px;font-weight: bold; color:#505050; padding:10px;">`;
                                    for(j in airline[i].segments){
                                        for(k in airline[i].segments[j].fares){
                                            if(parseInt(airline_request.child)+parseInt(airline_request.adult) <= airline[i].segments[j].fares[k].available_count){
                                                for(l in airline[i].segments[j].fares[k].service_charges)
                                                    price+= airline[i].segments[j].fares[k].service_charges[l].amount;
                                                break;
                                            }
                                        }
                                    }
                                    text+=`</span>
                                    <input type='button' style="margin:10px;" id="departjourney`+i+`" class="primary-btn-custom choose_selection_ticket_airlines_depart" value="Choose" onclick="get_price_itinerary(`+i+`)" sequence_id="0"/>
                                </div>
                            </div>
                        </div>`;
                        text+=`
                        <div class="col-lg-12" style="text-align:right; padding:0px 15px 10px 0px;">
                            <a id="detail_button_journey0" data-toggle="collapse" data-parent="#accordiondepart" onclick="show_flight_details(`+i+`);" href="#detail_departjourney`+i+`" style="color: #f15a22;" aria-expanded="true">
                                <span style="text-align:right; margin-right:10px; font-weight: bold; display:none;" id="flight_details_up`+i+`"> Flight details <i class="fas fa-chevron-up" style="font-size:14px;"></i></span>
                                <span style="text-align:right; margin-right:10px; font-weight: bold; display:block;" id="flight_details_down`+i+`"> Flight details <i class="fas fa-chevron-down" style="font-size:14px;"></i></span>
                            </a>
                        </div>
                    </div>
                </div>

                <div id="detail_departjourney`+i+`" class="panel-collapse collapse in" aria-expanded="true" style="margin-bottom:15px; border-top: 1px solid #f15a22; display:none;">`;
                    for(j in airline[i].segments){
                    var depart = 0;
                    if(airline[i].segments[j].origin == airline_request.destination[counter_search-1].substr(airline_request.destination[counter_search-1].length-4,3))
                        depart = 1;
                    if(depart == 0 && j == 0)
                        text+=`
                        <div style="text-align:right; border: 2px solid white; background-color:white; padding:10px 10px 0px 10px;">
                        <span style="font-weight: bold; font-size: 14px;">Departure</span>
                        </div>`;
                    else if(depart == 1){
                        text+=`
                        <div style="text-align:right; border: 2px solid white; background-color:white; padding:0px 10px 0px 10px;">
                        <span style="font-weight: bold; font-size: 14px;">Return</span>
                        </div>`;
                        depart = 2;
                    }
                    text+=`
                        <div id="journey0segment0" style="padding:0px 10px 10px 10px; background-color:white;">
                            <span style="font-weight: bold;">`+airline_carriers[0][airline[i].segments[j].carrier_code].name+` - </span>
                            <span style="color:#f15a22; font-weight: bold;">`+airline[i].segments[j].carrier_name+`</span><hr/>`;
                            text+=`
                            <div class="row">
                                <div class="col-lg-12">
                                    <div class="row">
                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                            <table style="width:100%">
                                                <tr>
                                                    <td class="airport-code"><h5>`+airline[i].segments[j].departure_date.split(' - ')[1]+`</h5></td>
                                                    <td style="padding-left:15px;">
                                                        <img src="/static/tt_website_skytors/img/icon/airlines-01.png" style="width:20px; height:20px;"/>
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
                                            <span>`+airline[i].segments[j].departure_date.split(' - ')[0]+`</span></br>
                                            <span style="font-weight:500;">`+airline[i].segments[j].origin_city+` - `+airline[i].segments[j].origin_name+` (`+airline[i].segments[j].origin+`)</span></br>
                                            <span>Terminal: </span>
                                        </div>
                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                        <table style="width:100%; margin-bottom:6px;">
                                            <tr>
                                                <td><h5>`+airline[i].segments[j].arrival_date.split(' - ')[1]+`</h5></td>
                                                <td></td>
                                                <td style="height:30px;padding:0 15px;width:100%"></td>
                                            </tr>
                                        </table>
                                        <span>`+airline[i].segments[j].arrival_date.split(' - ')[0]+`</span></br>
                                        <span style="font-weight:500;">`+airline[i].segments[j].destination_city+`</span> - <span>`+airline[i].segments[j].destination_name+` (`+airline[i].segments[j].destination+`)</span><br/>
                                        <span>Terminal: </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <br/>
                            <div class="row">
                                <div class="col-lg-12">
                                    <span><b>Choose Seat (Sub class / Seat left) :</b></span>
                                    <div style="overflow:auto; white-space:nowrap;">
                                    <table>
                                        <tr>`;
                                        for(k in airline[i].segments[j].fares){
                                            text+=`
                                            <td style="padding:10px 15px 0px 0px;">`;
                                            if(k==0)
                                            text+=`
                                            <label class="radio-button-custom">
                                                `+airline[i].segments[j].fares[k].class_of_service+`</span> / <span>`+airline[i].segments[j].fares[k].available_count+`
                                                <input onclick="change_fare(`+i+`,`+airline[i].segments[j].sequence+`,`+airline[i].segments[j].fares[k].sequence+`);" id="journey`+i+`segment`+airline[i].segments[j].sequence+`fare" name="journey`+i+`segment`+airline[i].segments[j].sequence+`fare" type="radio" value="`+airline[i].segments[j].fares[k].sequence+`" checked="checked">
                                                <span class="checkmark-radio"></span>
                                            </label>`;
                                            else
                                            text+=`
                                            <label class="radio-button-custom">
                                                `+airline[i].segments[j].fares[k].subclass+`</span> / <span>`+airline[i].segments[j].fares[k].available_count+`
                                                <input onclick="change_fare(`+i+`,`+airline[i].segments[j].sequence+`,`+airline[i].segments[j].fares[k].sequence+`);" id="journey`+i+`segment`+airline[i].segments[j].sequence+`fare" name="journey`+i+`segment`+airline[i].segments[j].sequence+`fare" type="radio" value="`+airline[i].segments[j].fares[k].sequence+`">
                                                <span class="checkmark-radio"></span>
                                            </label>`;
                                            text+=`<br/>`;
                                            var total_price = 0;
                                            for(l in airline[i].segments[j].fares[k].service_charge_summary)
                                                for(m in airline[i].segments[j].fares[k].service_charge_summary[l].service_charges)
                                                    if(airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'tax' || airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'fare' || airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'roc')
                                                        total_price+= airline[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].amount;
                                            text+=`<span id="journey`+i+`segment`+airline[i].segments[j].sequence+`fare`+airline[i].segments[j].fares[k].sequence+`"><b>IDR `+getrupiah(total_price)+`</b></span>`;
                                            text+=`</td>
                                            `;
                                        }

                                        text+=`
                                        </tr>
                                    </table></div>
                                </div>
                            </div><br/>`;
                        text+=`</div>`;
                    }
                    text+=`
                </div>
                `;
               var node = document.createElement("div");
               node.innerHTML = text;
               document.getElementById("airlines_ticket").appendChild(node);
               node = document.createElement("div");
    //                   document.getElementById('airlines_ticket').innerHTML += text;
               text = '';
               document.getElementById('fare'+i).innerHTML = 'IDR '+ getrupiah(airline[i].total_price);
           }
       }
   }
}

function change_departure(val){
    if(airline_request.direction != 'MC'){
        journey = [];
        value_pick = [];
        airline_pick_list = [];
        check_airline_pick = 0;
        document.getElementById("airline_ticket_pick").innerHTML = '';
        document.getElementById("airline_detail").innerHTML = '';
        airline_departure = 'departure';
        choose_airline = null;
        filtering('filter');
    }else{
        //MC
        //location.reload();
        check_airline_pick = 0;
        journey.splice(val,1);
        value_pick.splice(val,1);
        airline_pick_list.splice(val,1);
        counter_search = val;
        text = '';
        airline_pick_mc('no_button');
        document.getElementById("airline_detail").innerHTML = '';
        send_search_to_api(counter_search)
    }

    document.getElementById("badge-flight-notif").innerHTML = "0";
    document.getElementById("badge-flight-notif2").innerHTML = "0";
    $("#badge-flight-notif").removeClass("infinite");
    $("#badge-flight-notif2").removeClass("infinite");
    $('#choose-ticket-flight').show();


}

function delete_mc_journey(val){
    journey.splice(val,1);
    value_pick.splice(val,1);
    airline_pick_list.splice(val,1);
    temp = parseInt(airline_request.counter) - 1;
    airline_request.counter = temp.toString();
    airline_pick_mc('all');
    if(parseInt(airline_request.counter) == journey.length)

    if(parseInt(airline_request.counter) == journey.length){
        document.getElementById('airline_detail').innerHTML = '';
        filtering('filter');
        check_airline_pick = 1;
        document.getElementById("badge-flight-notif").innerHTML = "1";
        document.getElementById("badge-flight-notif2").innerHTML = "1";
        $("#badge-flight-notif").addClass("infinite");
        $("#badge-flight-notif2").addClass("infinite");
        $("#myModalTicketFlight").modal('show');
        $('#loading-search-flight').show();
        $('#choose-ticket-flight').hide();
        get_price_itinerary_request();
    }

}

function airline_pick_mc(type){
    text = '';
    for(i in airline_pick_list){
        text+=`
        <div style="background-color:#f15a22; padding:10px;">
            <h6 style="color:white;">Flight - `+(parseInt(i)+1)+`</h6>
        </div>
        <div style="background-color:white; border:1px solid #f15a22; margin-bottom:15px;" id="journey2`+i+`">
            <div class="row">
                <div class="col-lg-12" id="airline-info">
                    <div class="row" style="padding:10px;">
                        <div class="col-lg-12">`;
                            for(j in airline_pick_list[i].carrier_code_list)
                            text+=`
                            <img data-toggle="tooltip" style="width:50px; height:50px;" title="`+airline_carriers[0][airline_pick_list[i].carrier_code_list[j]].name+`" class="airline-logo" src="http://static.skytors.id/`+airline_pick_list[i].carrier_code_list[j]+`.png">`;
                            text+=`
                        </div>
                    </div>
                </div>

                <div class="col-lg-9">
                    <div class="row" style="padding:0px 10px 10px 10px;">
                        <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5">
                            <table style="width:100%">
                                <tr>
                                    <td class="airport-code"><h5>`+airline_pick_list[i].departure_date.split(' - ')[1]+`</h5></td>
                                    <td style="padding-left:15px;">
                                        <img src="/static/tt_website_skytors/img/icon/airlines-01.png" style="width:20px; height:20px;"/>
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
                            <span>`+airline_pick_list[i].departure_date.split(' - ')[0]+` </span></br>
                            <span style="font-weight:500;">`+airline_pick_list[i].origin_name+` - `+airline_pick_list[i].origin_city+` (`+airline_pick_list[i].origin+`)</span>
                        </div>
                        <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5">
                            <table style="width:100%; margin-bottom:6px;">
                                <tr>
                                    <td><h5>`+airline_pick_list[i].arrival_date.split(' - ')[1]+`</h5></td>
                                    <td></td>
                                    <td style="height:30px;padding:0 15px;width:100%"></td>
                                </tr>
                            </table>
                            <span>`+airline_pick_list[i].arrival_date.split(' - ')[0]+` </span></br>
                            <span style="font-weight:500;">`+airline_pick_list[i].destination_name+` - `+airline_pick_list[i].destination_city+` (`+airline_pick_list[i].destination+`)</span>
                        </div>
                        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2" style="padding:0px;">
                            <span>Transit: `+airline_pick_list[i].transit_count;
                            if(airline_pick_list[i].transit_count==0)
                                text+=`</br> Direct`;
                            text+=`
                            </span>
                        </div>
                    </div>
                </div>

                <div class="col-lg-3">
                    <div class="row">
                        <div class="col-lg-12" style="text-align:right; padding:0px 15px 10px 0px;">
                            <span id="fare_detail_pick`+i+`" class="basic_fare_field" style="font-size:16px;font-weight: bold; color:#505050; padding:10px;">`;
                            for(j in airline_pick_list[i].segments){
                                for(k in airline_pick_list[i].segments[j].fares){
                                    if(parseInt(airline_request.child)+parseInt(airline_request.adult) <= airline_pick_list[i].segments[j].fares[k].available_count && k==fare){
                                        for(l in airline_pick_list[i].segments[j].fares[k].service_charges)
                                            price+= airline_pick_list[i].segments[j].fares[k].service_charges[l].amount;
                                        break;
                                    }
                                }
                            }
                            text+=`</span>`;
                            if(type == 'all')
                            text+=`
                            <input type='button' style="margin:10px;" id="departjourney`+airline_pick_list[i].sequence+`" class="primary-btn-custom choose_selection_ticket_airlines_depart" value="Change" onclick="change_departure(`+i+`);" sequence_id="0"/>
                            <input type='button' style="margin:10px;" id="deletejourney`+airline_pick_list[i].sequence+`" class="primary-btn-custom choose_selection_ticket_airlines_depart" value="Delete" onclick="delete_mc_journey(`+i+`);" sequence_id="0"/>`;
                            else if(type == 'change')
                            text+=`
                            <input type='button' style="margin:10px;" id="departjourney`+airline_pick_list[i].sequence+`" class="primary-btn-custom choose_selection_ticket_airlines_depart" value="Change" onclick="change_departure(`+i+`);" sequence_id="0"/>
                            <input type='button' style="margin:10px;background:#f5f5f5 !important;" id="deletejourney`+airline_pick_list[i].sequence+`" class="primary-btn-custom choose_selection_ticket_airlines_depart" value="Delete" onclick="delete_mc_journey(`+i+`);" disabled sequence_id="0"/>`;
                            else if(type == 'delete')
                            text+=`
                            <input type='button' style="margin:10px;background:#f5f5f5 !important;" id="departjourney`+airline_pick_list[i].sequence+`" class="primary-btn-custom choose_selection_ticket_airlines_depart" value="Change" onclick="change_departure(`+i+`);" disabled sequence_id="0"/>
                            <input type='button' style="margin:10px;" id="deletejourney`+airline_pick_list[i].sequence+`" class="primary-btn-custom choose_selection_ticket_airlines_depart" value="Delete" onclick="delete_mc_journey(`+i+`);" sequence_id="0"/>`;
                            else if(type=='no_button')
                            text+=`
                            <input type='button' style="margin:10px;background:#f5f5f5 !important;" id="departjourney`+airline_pick_list[i].sequence+`" class="primary-btn-custom choose_selection_ticket_airlines_depart" value="Change" onclick="change_departure(`+i+`);" disabled sequence_id="0"/>
                            <input type='button' style="margin:10px;background:#f5f5f5 !important;" id="deletejourney`+airline_pick_list[i].sequence+`" class="primary-btn-custom choose_selection_ticket_airlines_depart" value="Delete" onclick="delete_mc_journey(`+i+`);" disabled sequence_id="0"/>`;
                            text+=`
                        </div>
                    </div>
                </div>

                <div class="col-lg-12" style="text-align:right; padding:0px 15px 10px 0px;">
                    <a id="detail_button_journey0" data-toggle="collapse" data-parent="#accordiondepart" onclick="show_flight_details2(`+airline_pick_list[i].sequence+`);" href="##detail_departjourney`+airline_pick_list[i].sequence+`" style="color: #f15a22;" aria-expanded="true">
                        <span style="text-align:right; margin-right:10px; font-weight: bold; display:none;" id="flight_details_up2`+airline_pick_list[i].sequence+`"> Flight details <i class="fas fa-chevron-up" style="font-size:14px;"></i></span>
                        <span style="text-align:right; margin-right:10px; font-weight: bold; display:block;" id="flight_details_down2`+airline_pick_list[i].sequence+`"> Flight details <i class="fas fa-chevron-down" style="font-size:14px;"></i></span>
                    </a>
                </div>
            </div>
        </div>`;
    }
    document.getElementById('airline_ticket_pick').innerHTML = text;
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

function check_provider(carrier_code,val){
    if(val == undefined){
        console.log(airline_provider_list);
        if(carrier_code == 'all'){
            for(i in airline_provider_list){
                document.getElementById('provider_box_'+airline_provider_list[i].code).checked = false;
            }
            document.getElementById('provider_box_All').checked = true;
        }
        else
            document.getElementById('provider_box_All').checked = false;
    }else{
        if(carrier_code == 'all'){
            for(i in airline_provider_list_mc[val-1]){
                document.getElementById('provider_box_'+airline_provider_list_mc[val-1][i].code+'_'+val).checked = false;
            }
            document.getElementById('provider_box_All_'+val).checked = true;
        }
        else
            document.getElementById('provider_box_All_'+val).checked = false;
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
    var pj = price.toString().length;
    var temp = price.toString();
    var priceshow="";
    for(x=0;x<pj;x++){
        if((pj-x)%3==0 && x!=0){
        priceshow+=",";
        }
        priceshow+=temp.charAt(x);
    }
    return priceshow;
}

function copy_data(){
    const el = document.createElement('textarea');
    el.value = $text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}

function share_data(){
    const el = document.createElement('textarea');
    el.value = $text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    $text_share = window.encodeURIComponent($text);
}

function airline_detail(){
    airline_price = [];
    for(i in price_itinerary.price_itinerary_provider){
        for(j in price_itinerary.price_itinerary_provider[i].price_itinerary){
            for(k in price_itinerary.price_itinerary_provider[i].price_itinerary[j].segments){
                for(l in price_itinerary.price_itinerary_provider[i].price_itinerary[j].segments[k].fares){
                    for(m in price_itinerary.price_itinerary_provider[i].price_itinerary[j].segments[k].fares[l].service_charge_summary){
                        for(n in price_itinerary.price_itinerary_provider[i].price_itinerary[j].segments[k].fares[l].service_charge_summary[m].service_charges){
                            price_type[price_itinerary.price_itinerary_provider[i].price_itinerary[j].segments[k].fares[l].service_charge_summary[m].service_charges[n].charge_code] = price_itinerary.price_itinerary_provider[i].price_itinerary[j].segments[k].fares[l].service_charge_summary[m].service_charges[n].amount;
                        }
                        price_type['currency'] = price_itinerary.price_itinerary_provider[i].price_itinerary[j].segments[k].fares[l].service_charge_summary[m].service_charges[n].currency;
                        airline_price.push({});
                        airline_price[airline_price.length-1][price_itinerary.price_itinerary_provider[i].price_itinerary[j].segments[k].fares[l].service_charge_summary[m].pax_type] = price_type;
                        price_type = [];
                    }
                }
            }
        }
    }
    text = '';
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
                <div class="col-lg-12" style="margin-bottom:5px;">`;
    flight_count = 0;
    for(i in price_itinerary.price_itinerary_provider){
        for(j in price_itinerary.price_itinerary_provider[i].price_itinerary){
            if(price_itinerary.price_itinerary_provider[i].price_itinerary[j].is_combo_price == 'true'){
                text += `<h6>Combo Price</h6>`;
                $text +='Combo Price\n';
            }else if(price_itinerary.price_itinerary_provider[i].price_itinerary[j].journey_type == 'DEP'){
                text += `<h6>Departure</h6>`;
                if(airline_request.direction != 'MC')
                    $text +='Departure\n';
                else{
                    $text +='Flight'+parseInt(flight_count+1)+'\n';
                    flight_count++;
                }
            }else{
                text += `<div class="row"><div class="col-lg-12" style="margin-bottom:5px;margin-top:2px;"><h6>Return</h6>`;
                if(airline_request.direction != 'MC')
                    $text +='Return\n';
                else{
                    $text +='Flight'+parseInt(flight_count+1)+'\n';
                    flight_count++;
                }
            }
            //logo
            for(k in price_itinerary.price_itinerary_provider[i].price_itinerary[j].carrier_code_list) //print gambar airline
                try{
                    text+=`<img data-toggle="tooltip" title="`+airline_carriers[0][price_itinerary.price_itinerary_provider[i].price_itinerary[j].carrier_code_list[k]]+`" style="width:50px; height:50px;" src="http://static.skytors.id/`+price_itinerary.price_itinerary_provider[i].price_itinerary[j].carrier_code_list[k]+`.png"><span> </span>`;
                }catch(err){
                    text+=`<img data-toggle="tooltip" title="" style="width:50px; height:50px;" src="http://static.skytors.id/`+price_itinerary.price_itinerary_provider[i].price_itinerary[j].carrier_code_list[k]+`.png"><span> </span>`;
                }
            text+=`</div>`;

            for(k in price_itinerary.price_itinerary_provider[i].price_itinerary[j].segments){
                if(price_itinerary.price_itinerary_provider[i].price_itinerary[j].journey_type == 'COM'){
                    text += `<div class="col-lg-12" style="margin-bottom:5px;"><h6>Flight `+parseInt(flight_count+1)+`</h6></div>`;
                    $text +='Flight'+parseInt(flight_count+1)+'\n';
                    flight_count++;
                }
                //datacopy
                if(price_itinerary.price_itinerary_provider[i].price_itinerary[j].segments[k].journey_type == 'DEP'){
                    $text += airline_carriers[price_itinerary.price_itinerary_provider[i].price_itinerary[j].segments[k].carrier_code].name + ' ' + price_itinerary.price_itinerary_provider[i].price_itinerary[j].segments[k].carrier_code + price_itinerary.price_itinerary_provider[i].price_itinerary[j].segments[k].carrier_number + '\n';
                    $text += price_itinerary.price_itinerary_provider[i].price_itinerary[j].segments[k].departure_date + ' → ' + price_itinerary.price_itinerary_provider[i].price_itinerary[j].segments[k].arrival_date + '\n';
                    $text += price_itinerary.price_itinerary_provider[i].price_itinerary[j].segments[k].origin_name + ' (' + price_itinerary.price_itinerary_provider[i].price_itinerary[j].segments[k].origin_city + ') - ';
                    $text += price_itinerary.price_itinerary_provider[i].price_itinerary[j].segments[k].destination_name + ' (' + price_itinerary.price_itinerary_provider[i].price_itinerary[j].segments[k].destination_city + ')\n\n';

                }else if(price_itinerary.price_itinerary_provider[i].price_itinerary[j].segments[k].journey_type == 'RET'){
                    $text += airline_carriers[price_itinerary.price_itinerary_provider[i].price_itinerary[j].segments[k].carrier_code].name + ' ' + price_itinerary.price_itinerary_provider[i].price_itinerary[j].segments[k].carrier_code + price_itinerary.price_itinerary_provider[i].price_itinerary[j].segments[k].carrier_number + '\n';
                    $text += price_itinerary.price_itinerary_provider[i].price_itinerary[j].segments[k].departure_date + ' → ' + price_itinerary.price_itinerary_provider[i].price_itinerary[j].segments[k].arrival_date + '\n';
                    $text += price_itinerary.price_itinerary_provider[i].price_itinerary[j].segments[k].origin_name + ' (' + price_itinerary.price_itinerary_provider[i].price_itinerary[j].segments[k].origin_city + ') - ';
                    $text += price_itinerary.price_itinerary_provider[i].price_itinerary[j].segments[k].destination_name + ' (' + price_itinerary.price_itinerary_provider[i].price_itinerary[j].segments[k].destination_city + ')\n\n';
                }
                text+=`
                    <div class="col-lg-12">
                        <div class="row">
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                <table style="width:100%">
                                    <tr>
                                        <td class="airport-code"><h5>`+price_itinerary.price_itinerary_provider[i].price_itinerary[j].segments[k].departure_date.split(' - ')[1]+`</h5></td>
                                        <td style="padding-left:15px;">
                                            <img src="/static/tt_website_skytors/img/icon/airlines-01.png" style="width:20px; height:20px;"/>
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
                                <span style="font-size:13px;">`+price_itinerary.price_itinerary_provider[i].price_itinerary[j].segments[k].departure_date.split(' - ')[0]+`</span></br>
                                <span style="font-size:13px; font-weight:500;">`+price_itinerary.price_itinerary_provider[i].price_itinerary[j].segments[k].origin_city+` (`+price_itinerary.price_itinerary_provider[i].price_itinerary[j].segments[k].origin+`)</span>
                            </div>
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                <table style="width:100%; margin-bottom:6px;">
                                    <tr>
                                        <td><h5>`+price_itinerary.price_itinerary_provider[i].price_itinerary[j].segments[k].arrival_date.split(' - ')[1]+`</h5></td>
                                        <td></td>
                                        <td style="height:30px;padding:0 15px;width:100%"></td>
                                    </tr>
                                </table>
                                <span style="font-size:13px;">`+price_itinerary.price_itinerary_provider[i].price_itinerary[j].segments[k].arrival_date.split(' - ')[0]+`</span><br/>
                                <span style="font-size:13px; font-weight:500;">`+price_itinerary.price_itinerary_provider[i].price_itinerary[j].segments[k].destination_city+` (`+price_itinerary.price_itinerary_provider[i].price_itinerary[j].segments[k].destination+`)</span>
                            </div>
                        </div>`;
                for(l in price_itinerary.price_itinerary_provider[i].price_itinerary[j].segments[k].legs){

                }
                if(price_itinerary.price_itinerary_provider[i].price_itinerary[j].segments[k].fares.length > 0 ){
                    for(l in price_itinerary.price_itinerary_provider[i].price_itinerary[j].segments[k].fares){
                        if(price_itinerary.price_itinerary_provider[i].price_itinerary[j].segments[k].fares[l].service_charge_summary.length > 0){

                        //price
                        price = 0;
                        //adult
                        $text+= 'Price\n';
                        text+=`<hr/>
                        </div>`;
                            try{//adult
                                if(airline_request.adult != '0'){
                                    text += `<div class="col-lg-12">`;
                                    try{
                                    if(airline_price[i].ADT['roc'] != null)
                                        price = airline_price[i].ADT['roc'];
                                    if(airline_price[i].ADT.tax != null)
                                        price += airline_price[i].ADT.tax;
                                    }catch(err){

                                    }
                                    commission = 0;
                                    if(airline_price[i].ADT['rac'] != null)
                                        commission = airline_price[i].ADT['rac']
                                    commission_price += airline_request.adult * commission;
                                    total_price += airline_request.adult * (airline_price[i].ADT['fare'] + price);
                                    text+=`
                                        <div class="row">
                                            <div class="col-lg-7 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                                                <span style="font-size:11px; font-weight:500;">`+airline_request.adult+`x Adult Fare @`+airline_price[i].ADT.currency +' '+getrupiah(Math.ceil(airline_price[i].ADT.fare))+`</span><br/>
                                            </div>
                                            <div class="col-lg-5 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                                                <span style="font-size:13px; font-weight:500;">`+getrupiah(Math.ceil(airline_price[i].ADT.fare * airline_request.adult))+`</span>
                                            </div>
                                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                                                <span style="font-size:13px; font-weight:500;">`+airline_request.adult+`x Service Charge</span>
                                            </div>
                                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                                                <span style="font-size:13px; font-weight:500;">`+getrupiah(Math.ceil(price * airline_request.adult))+`</span>
                                            </div>
                                        </div>`;
                                    $text += airline_request.adult + ' Adult Fare @'+ airline_price[i].ADT.currency +' '+getrupiah(Math.ceil(airline_price[i].ADT.fare))+'\n';
                                    $text += airline_request.adult + ' Adult Tax @'+ airline_price[i].ADT.currency +' '+getrupiah(Math.ceil(price))+'\n';
                                    price = 0;
                                    text+=`</div>`;
                                }
                            }catch(err){
                                continue
                            }

                            try{//child
                                if(airline_request.child != '0'){
                                    try{
                                    if(airline_price[i].CHD['roc'] != null)
                                        price = airline_price[i].CHD['roc'];
                                    if(airline_price[i].CHD.tax != null)
                                        price += airline_price[i].CHD.tax;
                                    }catch(err){

                                    }
                                    commission = 0;
                                    if(airline_price[i].CHD['rac'] != null)
                                        commission = airline_price[i].CHD['rac']
                                    commission_price += airline_request.child * commission;
                                    total_price += airline_request.child * (airline_price[i].CHD['fare'] + price);
                                    text+=`
                                    <div class="row">
                                        <div class="col-lg-7 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                                            <span style="font-size:11px; font-weight:500;">`+airline_request.child+`x Child Fare @`+airline_price[i].CHD.currency+' '+getrupiah(Math.ceil(airline_price[i].CHD.fare))+`</span><br/>
                                        </div>
                                        <div class="col-lg-5 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                                            <span style="font-size:13px; font-weight:500;">`+getrupiah(Math.ceil(airline_price[i].CHD.fare * airline_request.CHD))+`</span>
                                        </div>
                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                                            <span style="font-size:13px; font-weight:500;">`+airline_request.adult+`x Service Charge</span>
                                        </div>
                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                                            <span style="font-size:13px; font-weight:500;">`+getrupiah(Math.ceil(price * airline_request.child))+`</span>
                                        </div>
                                    </div>`;
                                    $text += airline_request.child + ' Child Fare @'+ airline_price[i].CHD.currency +' '+getrupiah(Math.ceil(airline_price[i].CHD.fare))+'\n';
                                    $text += airline_request.child + ' Child Tax @'+ airline_price[i].CHD.currency +' '+getrupiah(Math.ceil(price))+'\n';
                                    price = 0;
                                }
                            }catch(err){
                                continue
                            }

                            try{//infant
                                if(airline_request.infant != '0'){
                                    try{
                                    if(airline_price[i].INF['roc'] != null)
                                        price = airline_price[i].INF['roc'];
                                    if(airline_price[i].INF.tax != null)
                                        price += airline_price[i].INF.tax;
                                    }catch(err){

                                    }
                                    commission = 0;
                                    if(airline_price[i].INF['rac'] != null)
                                        commission = airline_price[i].INF['rac']
                                    commission_price += airline_request.infant * commission;
                                    total_price += airline_request.infant * (airline_price.INF['fare'] + price);
                                    text+=`
                                        <div class="row">
                                            <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                                <span style="font-size:11px; font-weight:500;">`+airline_request.infant+`x Infant Fare @`+airline_price[i].INF.currency+' '+getrupiah(Math.ceil(airline_price[i].INF.fare))+`</span><br/>
                                            </div>
                                            <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                                <span style="font-size:13px; font-weight:500;">`+getrupiah(Math.ceil(airline_price[i].INF.fare * airline_request.infant))+`</span>
                                            </div>
                                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                                                <span style="font-size:13px; font-weight:500;">`+airline_request.infant+`x Service Charge</span>
                                            </div>
                                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                                                <span style="font-size:13px; font-weight:500;">`+getrupiah(Math.ceil(price * airline_request.infant))+`</span>
                                            </div>
                                        </div>`;
                                    $text += airline_request.infant + ' Infant Fare @'+ airline_price[i].INF.currency +' '+getrupiah(Math.ceil(airline_price[i].INF.fare))+'\n';
                                    $text += airline_request.infant + ' Infant Tax @'+ airline_price[i].INF.currency +' '+getrupiah(Math.ceil(price))+'\n';
                                    price = 0;
                                }
                            }catch(err){
                                continue
                            }
                        }
                    }
                    text+=`<hr/>`;
                }
                text+=`
                </div>`;
            }
        }
    }
    share_data();
        text+=`
        </div>
    </div>
    <div class="row">
        <div class="col-lg-7" style="text-align:left;">
            <span style="font-size:13px;">Additional Price</span><br/>
        </div>
        <div class="col-lg-5" style="text-align:right;">
            <span style="font-size:13px;" id="additional_price">`+getrupiah(Math.ceil(additional_price))+`</span><br/>
            <input type="hidden" name="additional_price" id="additional_price_hidden"/>
        </div>
        <div class="col-lg-7" style="text-align:left;">
            <span style="font-size:14px; font-weight:bold;"><b>Total</b></span><br/>
        </div>
        <div class="col-lg-5" style="text-align:right;">
            <span style="font-size:14px; font-weight:bold;" id="total_price"><b>`+getrupiah(Math.ceil(total_price+additional_price))+`</b></span><br/>
        </div>
    </div>
    <div class="row">
        <div class="col-lg-12" style="padding-bottom:10px;">
            <hr/>
            <span style="font-size:14px; font-weight:bold;">Share This on:</span><br/>
            <a href="whatsapp://send?text=Share\n%20`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/whatsapp.png"/></a>
            <a href="line://msg/text/Share\n%20`+ $text_share +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/line.png"/></a>
            <a href="https://telegram.me/share/url?text=Share\n%20`+ $text_share +`" title="Share by Telegram" style="padding-right:5px;"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/telegram.png"/></a>
            <a href="mailto:?subject=This is the airline price detail&amp;body=Share\n%20`+ $text_share +`" title="Share by Email" style="padding-right:5px;"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/email.png"/></a>
        </div>
    </div>

    <div class="row" id="show_commission" style="display:none;">
        <div class="col-lg-12 col-xs-12" style="text-align:center;">
            <div class="alert alert-success">
                <span style="font-size:13px; font-weight: bold;">Your Commission: IDR `+getrupiah(commission_price)+`</span><br>
            </div>
        </div>
    </div>

    <div style="padding-bottom:10px;">
        <center>
            <input type="button" class="primary-btn-ticket" style="width:100%;" onclick="copy_data();" value="Copy"/>
        </center>
    </div>
    <div style="padding-bottom:10px;">
        <center>
            <input type="button" class="primary-btn-ticket" style="width:100%;" onclick="show_commission('commission');" id="show_commission_button" value="Show Commission"/><br/>
        </center>
    </div>`;
    $text += 'Grand Total: IDR '+ getrupiah(Math.ceil(total_price)) + '\n\nPrices and availability may change at any time';
    document.getElementById('airline_detail').innerHTML = text;

}

function check_passenger(adult, child, infant){
    //booker
    error_log = '';
    if(check_name(document.getElementById('booker_title').value,
                    document.getElementById('booker_first_name').value,
                    document.getElementById('booker_last_name').value,
                    25) == false){
        error_log+= 'Total of Booker name maximum 25 characters!\n';
        document.getElementById('booker_first_name').style['border-color'] = 'red';
        document.getElementById('booker_last_name').style['border-color'] = 'red';
    }else{
        document.getElementById('booker_first_name').style['border-color'] = '#EFEFEF';
        document.getElementById('booker_last_name').style['border-color'] = '#EFEFEF';
    }if(document.getElementById('booker_first_name').value == ''){
        error_log+= 'Please fill booker first name!\n';
        document.getElementById('booker_first_name').style['border-color'] = 'red';
    }else{
        document.getElementById('booker_first_name').style['border-color'] = '#EFEFEF';
    }if(check_phone_number(document.getElementById('booker_phone').value)==false){
        error_log+= 'Phone number Booker only contain number 8 - 12 digits!\n';
        document.getElementById('booker_phone').style['border-color'] = 'red';
    }else{
        document.getElementById('booker_phone').style['border-color'] = '#EFEFEF';
    }if(check_email(document.getElementById('booker_email').value)==false){
        error_log+= 'Invalid Booker email!\n';
        document.getElementById('booker_email').style['border-color'] = 'red';
    }else{
        document.getElementById('booker_email').style['border-color'] = '#EFEFEF';
    }
    length = 100;
    is_lion_air = false;
    for(j in airline_pick){
       for(k in airline_pick[j].carrier_code_list){
           if(airline_pick[j].carrier_code_list[k] == 'JT' || airline_pick[j].carrier_code_list[k] == 'ID' || airline_pick[j].carrier_code_list[k] == 'IW'){
               if(length>24)
                   length = 24;
               is_lion_air = true;
           }else if(airline_pick[j].carrier_code_list[k] == 'GA' && airline_pick[j].provider == 'sabre'){
               if(length>31)
                   length = 31;
           }else{
               if(length>28)
                   length = 28;
           }
       }
    }

   //adult
   for(i=1;i<=adult;i++){

       if(check_name(document.getElementById('adult_title'+i).value,
       document.getElementById('adult_first_name'+i).value,
       document.getElementById('adult_last_name'+i).value,
       length) == false){
           error_log+= 'Total of adult '+i+' name maximum '+length+' characters!\n';
           document.getElementById('adult_first_name'+i).style['border-color'] = 'red';
           document.getElementById('adult_last_name'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('adult_first_name'+i).style['border-color'] = '#EFEFEF';
           document.getElementById('adult_last_name'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('adult_first_name'+i).value == ''){
           error_log+= 'Please input first name of adult passenger '+i+'!\n';
           document.getElementById('adult_first_name'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('adult_first_name'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('adult_last_name'+i).value == ''){
           error_log+= 'Please input last name of adult passenger '+i+'!\n';
           document.getElementById('adult_last_name'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('adult_last_name'+i).style['border-color'] = '#EFEFEF';
       }
       if(check_date(document.getElementById('adult_birth_date'+i).value)==false){
           error_log+= 'Birth date wrong for passenger adult '+i+'!\n';
           document.getElementById('adult_birth_date'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('adult_birth_date'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('adult_nationality'+i).value == ''){
           error_log+= 'Please fill nationality for passenger adult '+i+'!\n';
           document.getElementById('adult_nationality'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('adult_nationality'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('adult_passport_number'+i).value != '' ||
          document.getElementById('adult_passport_expired_date'+i).value != '' ||
          document.getElementById('adult_country_of_issued'+i).value != '' || is_lion_air == true){
           if(document.getElementById('adult_passport_number'+i).value == ''){
               error_log+= 'Please fill passport number for passenger adult '+i+'!\n';
               document.getElementById('adult_passport_number'+i).style['border-color'] = 'red';
           }else{
               document.getElementById('adult_passport_number'+i).style['border-color'] = '#EFEFEF';
           }if(document.getElementById('adult_passport_expired_date'+i).value == ''){
               error_log+= 'Please fill passport expired date for passenger adult '+i+'!\n';
               document.getElementById('adult_passport_expired_date'+i).style['border-color'] = 'red';
           }else{
               document.getElementById('adult_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
           }if(document.getElementById('adult_country_of_issued'+i).value == ''){
               error_log+= 'Please fill country of issued for passenger adult '+i+'!\n';
               document.getElementById('adult_country_of_issued'+i).style['border-color'] = 'red';
           }else{
               document.getElementById('adult_country_of_issued'+i).style['border-color'] = '#EFEFEF';
           }
       }
   }
   //child
   for(i=1;i<=child;i++){
       if(check_name(document.getElementById('child_title'+i).value,
       document.getElementById('child_first_name'+i).value,
       document.getElementById('child_last_name'+i).value,
       length) == false){
           error_log+= 'Total of child '+i+' name maximum '+length+' characters!\n';
           document.getElementById('child_first_name'+i).style['border-color'] = 'red';
           document.getElementById('child_last_name'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('child_first_name'+i).style['border-color'] = '#EFEFEF';
           document.getElementById('child_last_name'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('child_first_name'+i).value == ''){
           error_log+= 'Please input first name of child passenger '+i+'!\n';
           document.getElementById('child_first_name'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('child_first_name'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('child_last_name'+i).value == ''){
           error_log+= 'Please input last name of child passenger '+i+'!\n';
           document.getElementById('child_last_name'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('child_last_name'+i).style['border-color'] = '#EFEFEF';
       }if(check_date(document.getElementById('child_birth_date'+i).value)==false){
           error_log+= 'Birth date wrong for passenger child '+i+'!\n';
           document.getElementById('child_birth_date'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('child_birth_date'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('child_nationality'+i).value == ''){
           error_log+= 'Please fill nationality for passenger child '+i+'!\n';
           document.getElementById('child_nationality'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('child_nationality'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('child_passport_number'+i).value != '' ||
          document.getElementById('child_passport_expired_date'+i).value != '' ||
          document.getElementById('child_country_of_issued'+i).value != '' || is_lion_air == true){
           if(document.getElementById('child_passport_number'+i).value == ''){
               error_log+= 'Please fill passport number for passenger child '+i+'!\n';
               document.getElementById('child_passport_number'+i).style['border-color'] = 'red';
           }else{
               document.getElementById('child_passport_number'+i).style['border-color'] = '#EFEFEF';
           }if(document.getElementById('child_passport_expired_date'+i).value == ''){
               error_log+= 'Please fill passport expired date for passenger child '+i+'!\n';
               document.getElementById('child_passport_expired_date'+i).style['border-color'] = 'red';
           }else{
               document.getElementById('child_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
           }if(document.getElementById('child_country_of_issued'+i).value == ''){
               error_log+= 'Please fill country of issued for passenger child '+i+'!\n';
               document.getElementById('child_country_of_issued'+i).style['border-color'] = 'red';
           }else{
               document.getElementById('child_country_of_issued'+i).style['border-color'] = '#EFEFEF';
           }
       }
   }

   //infant
   for(i=1;i<=infant;i++){
       if(check_name(document.getElementById('infant_title'+i).value,
       document.getElementById('infant_first_name'+i).value,
       document.getElementById('infant_last_name'+i).value,
       length) == false){
           error_log+= 'Total of infant '+i+' name maximum '+length+' characters!\n';
           document.getElementById('infant_first_name'+i).style['border-color'] = 'red';
           document.getElementById('infant_last_name'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('infant_first_name'+i).style['border-color'] = '#EFEFEF';
           document.getElementById('infant_last_name'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('infant_first_name'+i).value == ''){
           error_log+= 'Please input first name of infant passenger '+i+'!\n';
           document.getElementById('infant_first_name'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('infant_first_name'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('infant_last_name'+i).value == ''){
           error_log+= 'Please input last name of infant passenger '+i+'!\n';
           document.getElementById('infant_last_name'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('infant_last_name'+i).style['border-color'] = '#EFEFEF';
       }if(check_date(document.getElementById('infant_birth_date'+i).value)==false){
           error_log+= 'Birth date wrong for passenger infant '+i+'!\n';
           document.getElementById('infant_birth_date'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('infant_birth_date'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('infant_nationality'+i).value == ''){
           error_log+= 'Please fill nationality for passenger infant '+i+'!\n';
           document.getElementById('infant_nationality'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('infant_nationality'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('infant_passport_number'+i).value != '' ||
          document.getElementById('infant_passport_expired_date'+i).value != '' ||
          document.getElementById('infant_country_of_issued'+i).value != '' || is_lion_air == true){
           if(document.getElementById('infant_passport_number'+i).value == ''){
               error_log+= 'Please fill passport number for passenger infant '+i+'!\n';
               document.getElementById('infant_passport_number'+i).style['border-color'] = 'red';
           }else{
               document.getElementById('infant_passport_number'+i).style['border-color'] = '#EFEFEF';
           }if(document.getElementById('infant_passport_expired_date'+i).value == ''){
               error_log+= 'Please fill passport expired date for passenger infant '+i+'!\n';
               document.getElementById('infant_passport_expired_date'+i).style['border-color'] = 'red';
           }else{
               document.getElementById('infant_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
           }if(document.getElementById('infant_country_of_issued'+i).value == ''){
               error_log+= 'Please fill country of issued for passenger infant '+i+'!\n';
               document.getElementById('infant_country_of_issued'+i).style['border-color'] = 'red';
           }else{
               document.getElementById('infant_country_of_issued'+i).style['border-color'] = '#EFEFEF';
           }
       }

   }
   if(error_log==''){
       document.getElementById('time_limit_input').value = time_limit;
       document.getElementById('airline_review').submit();
   }
   else{
       alert(error_log);
       $('.btn-next').removeClass("running");
       $('.btn-next').prop('disabled', false);
   }
}

function on_change_ssr(idhidden, id){
    price = 0;
    if(parseInt(document.getElementById(id).options[document.getElementById(id).selectedIndex].text.split(' ')[document.getElementById(id).options[document.getElementById(id).selectedIndex].text.split(' ').length-1]) > 0)
        price = parseInt(document.getElementById(id).options[document.getElementById(id).selectedIndex].text.split(' ')[document.getElementById(id).options[document.getElementById(id).selectedIndex].text.split(' ').length-1]);
    if(document.getElementById(idhidden).value != 'Selected')
        additional_price += price - parseInt(document.getElementById(idhidden).value);
    else
        additional_price += price;
    document.getElementById('additional_price').innerHTML = getrupiah(additional_price);
    document.getElementById('additional_price_hidden').value = additional_price;
    document.getElementById(idhidden).value = document.getElementById(id).options[document.getElementById(id).selectedIndex].text.split(' ')[document.getElementById(id).options[document.getElementById(id).selectedIndex].text.split(' ').length-1];
    document.getElementById('total_price').innerHTML = getrupiah(Math.ceil(total_price + additional_price));
}

function get_airline_review(){
    text = '';
    text = `<div>
            <h4>Flight Detail</h4>
            <hr/>`;
    flight_count = 0;
    for(i in airline_pick){
        for(j in airline_pick[i].price_itinerary){
            if(airline_pick[i].price_itinerary[j].journey_type == "COM"){
                text += `<h6>Combo Price</h6>`;
            }else if(airline_pick[i].price_itinerary[j].journey_type == 'DEP'){
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
            //logo
            for(k in airline_pick[i].price_itinerary[j].carrier_code_list) //print gambar airline
                try{
                    text+=`<img data-toggle="tooltip" title="`+airline_carriers[airline_pick.price_itinerary_provider[i].price_itinerary[j].carrier_code_list[k]]+`" style="width:50px; height:50px;" src="http://static.skytors.id/`+airline_pick[i].price_itinerary[j].carrier_code_list[k]+`.png"><span> </span>`;
                }catch(err){
                    text+=`<img data-toggle="tooltip" title="" style="width:50px; height:50px;" src="http://static.skytors.id/`+airline_pick[i].price_itinerary[j].carrier_code_list[k]+`.png"><span> </span>`;
                }
            text+=`</div>`;

            for(k in airline_pick[i].price_itinerary[j].segments){
                if(airline_pick[i].price_itinerary[j].journey_type == 'COM'){
                    text += `<div><h6>Flight `+parseInt(flight_count+1)+`</h6></div>`;
                    flight_count++;
                }
                for(l in airline_pick[i].price_itinerary[j].segments[k].legs){
                    text+=`
                        <div>
                            <div class="row">
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                    <table style="width:100%">
                                        <tr>
                                            <td class="airport-code"><h5>`+airline_pick[i].price_itinerary[j].segments[k].legs[l].departure_date.split(' - ')[1]+`</h5></td>
                                            <td style="padding-left:15px;">
                                                <img src="/static/tt_website_skytors/img/icon/airlines-01.png" style="width:20px; height:20px;"/>
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
                text+=`<hr/>
                </div>`;
            }
        }
    }

//    for(i in airline_pick){
//        if(i == 0)
//            text += '<h6>Departure</h6>';
//        else
//            text += '<hr/><h6>Return</h6>';
//
//        for(j in airline_pick[i].segments){
//
//            if(airline_pick[i].segments[j].origin == airline_request.destination)
//                text += '<h6>Return</h6>';
//            text+= `<div class="row">`;
//            text+= `<div class="col-lg-12">
//            <img data-toggle="tooltip" style="width:50px; height:50px;" title="`+airline_carriers[airline_pick[i].segments[j].carrier_code].name+`" class="airline-logo" src="http://static.skytors.id/`+airline_pick[i].segments[j].carrier_code+`.png"/>
//            </div>`;
//
//            text+= `<div class="col-lg-12">
//                        <h5>`+airline_carriers[airline_pick[i].segments[j].carrier_code].name+` (`+airline_pick[i].segments[j].carrier_code+` `+airline_pick[i].segments[j].carrier_number+`)</h5>`;
//            if(airline_get_price_request.journeys_booking[i].segments[j].fare_pick != ''){
//                 text+=`<h6>Class: `+airline_pick[i].segments[j].fares[airline_get_price_request.journeys_booking[i].segments[j].fare_pick].subclass+`</h6>`;
//            }
//            text+= `</div>`;
//            text+= `</div>
//                    <div class="row">`;
//            text+= `
//                    <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5">
//                        <table style="width:100%">
//                            <tr>
//                                <td class="airport-code"><h5>`+airline_pick[i].segments[j].departure_date.split(' - ')[1]+`</h5></td>
//                                <td style="padding-left:15px;">
//                                    <img src="/static/tt_website_skytors/img/icon/airlines-01.png" style="width:20px; height:20px;"/>
//                                </td>
//                                <td style="height:30px;padding:0 15px;width:100%">
//                                    <div style="display:inline-block;position:relative;width:100%">
//                                        <div style="height:2px;position:absolute;top:16px;width:100%;background-color:#d4d4d4;"></div>
//                                        <div class="origin-code-snippet" style="background-color:#d4d4d4;right:-6px"></div>
//                                        <div style="height:30px;min-width:40px;position:relative;width:0%"/>
//                                    </div>
//                                </td>
//                            </tr>
//                        </table>
//                        <span>`+airline_pick[i].segments[j].departure_date.split(' - ')[0]+`</span></br>
//                        <span style="font-weight:500;">`+airline_pick[i].segments[j].origin_city+` - `+airline_pick[i].segments[j].origin_name+` (`+airline_pick[i].segments[j].origin+`)</span>
//                    </div>
//                    <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5">
//                        <table style="width:100%; margin-bottom:6px;">
//                            <tr>
//                                <td><h5>`+airline_pick[i].segments[j].arrival_date.split(' - ')[1]+`</h5></td>
//                                <td></td>
//                                <td style="height:30px;padding:0 15px;width:100%"></td>
//                            </tr>
//                        </table>
//                        <span>`+airline_pick[i].segments[j].arrival_date.split(' - ')[0]+`</span></br>
//                        <span style="font-weight:500;">`+airline_pick[i].segments[j].destination_city+` - `+airline_pick[i].segments[j].destination_name+` (`+airline_pick[i].segments[j].destination+`)</span>
//                    </div>
//                </div>`;
//        }
//    }
//    text+=`</div>`;

    //contact
    text+=`
    <div class="row">
        <div class="col-lg-12">
            <div>
                <h4> List of Contact(s) Person</h4><hr/>
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
    </div>`;

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
                    </tr>`;
                    for(i in passengers.adult){
                        text+=`<tr>
                                <td class="list-of-passenger-left">`+(parseInt(i)+1)+`</td>
                                <td>`+passengers.adult[i].title+` `+passengers.adult[i].first_name+` `+ passengers.adult[i].last_name +`</td>
                                <td>Adult</td>
                                <td>`+passengers.adult[i].birth_date+`</td>
                               </tr>`;
                    }
                    for(i in passengers.child){
                        text+=`<tr>
                                <td class="list-of-passenger-left">`+(parseInt(i)+1)+`</td>
                                <td>`+passengers.child[i].title+` `+passengers.child[i].first_name+` `+ passengers.child[i].last_name +`</td>
                                <td>Child</td>
                                <td>`+passengers.child[i].birth_date+`</td>
                               </tr>`;
                    }
                    for(i in passengers.infant){
                        text+=`<tr>
                                <td class="list-of-passenger-left">`+(parseInt(i)+1)+`</td>
                                <td>`+passengers.infant[i].title+` `+passengers.infant[i].first_name+` `+ passengers.infant[i].last_name +`</td>
                                <td>Infant</td>
                                <td>`+passengers.infant[i].birth_date+`</td>
                               </tr>`;
                    }
                text+=`</table>
            </div>
        </div>
    </div>`;

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