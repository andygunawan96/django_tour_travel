price_type = [];

additional_price = 0;

airline_choose = 0;

sorting_value = '';

counter = 0;

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

function add_multi_city(){
    if(counter != 3){
        counter++;
        var node = document.createElement("div");
        text = `
        <div class="col-lg-12" id="mc_airline`+counter+`">
            <div class="row">
                <div class="col-lg-12" style="padding:0px 0px 15px 0px; text-align:left;">
                    <h6 style="color:white;">Flight - `+counter+`</h6>
                </div>
                <div class="col-lg-8">
                    <div class="row">
                        <div class="col-lg-6 col-md-6 col-sm-6 airline-from" style="padding-left:0px;">
                            <span class="span-search-ticket"><i class="fas fa-plane-departure"></i> From</span>
                            <div class="input-container-search-ticket">
                                <div class="form-select">
                                    <select class="form-control" style="width:100%;" id="origin_id_flight`+counter+`" placeholder="City or Airport or IATA" onchange="airline_autocomplete('origin')">

                                    </select>
                                </div>
                                <input type="hidden" name="origin_id_flight`+counter+`" id="airline_origin_flight`+counter+`" />
                            </div>
                        </div>
                        <div class="image-change-route-vertical">
                            <h4><a href="javascript:airline_switch();" style="z-index:5;" id="flight_switch`+counter+`"><i class="image-rounded-icon2"><i class="fas fa-exchange-alt"></i></i></a></h4>
                        </div>
                        <div class="image-change-route-horizontal">
                            <h4><a class="horizontal-arrow" href="javascript:airline_switch();" style="z-index:5; color:white;" id="flight_switch`+counter+`"><i class="image-rounded-icon"><i class="fas fa-exchange-alt icon-change"></i></i></a></h4>
                        </div>
                        <div class="col-lg-6 col-md-6 col-sm-6 airline-to" style="z-index:5; padding-right:0px;">
                            <span class="span-search-ticket"><i class="fas fa-plane-arrival"></i> To</span>
                            <div class="input-container-search-ticket">
                                <div class="form-select">
                                    <select class="form-control " name="state" style="width:100%;" id="destination_id_flight`+counter+`" name="destination_id_flight`+counter+`" placeholder="City or Airport or IATA" onchange="airline_autocomplete('destination')">

                                    </select>
                                </div>
                                <input type="hidden" name="destination_id_flight`+counter+`" id="airline_destination_flight`+counter+`" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-6" style="padding:0px;">
                    <span class="span-search-ticket"><i class="fas fa-calendar-alt"></i> Departure</span>
                    <div class="input-container-search-ticket">
                        <input type="text" class="form-control" name="airline_departure`+counter+`" id="airline_departure`+counter+`" placeholder="Departure Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date '" autocomplete="off" readonly>
                    </div>

                </div>`;
                if(counter == 1)
                text+=`<div class="col-lg-4 col-md-6 col-sm-6" style="padding:0px;">
                    <span class="span-search-ticket"><i class="fas fa-users"></i> Passenger</span>
                    <div class="input-container-search-ticket btn-group">
                        <button id="show_total_pax_flight`+counter+`" type="button" class="form-control dropdown-toggle" data-toggle="dropdown" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align:left; cursor:pointer;"></button>
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
                                        <button type="button" class="left-minus-adult-flight btn-custom-circle" id="left-minus-adult-flight`+counter+`" data-type="minus" data-field="" disabled>
                                            <i class="fas fa-minus"></i>
                                        </button>
                                        <input type="text" style="padding:5px !important; border:none; background:none; font-size:13px; text-align:center; width:25px;" id="adult_flight`+counter+`" name="adult_flight`+counter+`" value="1" min="1" readonly>
                                        <button type="button" class="right-plus-adult-flight btn-custom-circle" id="right-plus-adult-flight`+counter+`" data-type="plus" data-field="">
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
                                        <button type="button" class="left-minus-child-flight btn-custom-circle" id="left-minus-child-flight`+counter+`" data-type="minus" data-field="" disabled>
                                            <i class="fas fa-minus"></i>
                                        </button>
                                        <input type="text" style="padding:5px !important; border:none; background:none; font-size:13px; text-align:center; width:25px;" id="child_flight`+counter+`" name="child_flight`+counter+`" value="0" min="0" readonly>
                                        <button type="button" class="right-plus-child-flight btn-custom-circle" id="right-plus-child-flight`+counter+`" data-type="plus" data-field="">
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
                                        <button type="button" class="left-minus-infant-flight btn-custom-circle" id="left-minus-infant-flight`+counter+`" data-type="minus" data-field="" disabled>
                                            <i class="fas fa-minus"></i>
                                        </button>
                                        <input type="text" style="padding:5px !important; border:none; background:none; font-size:13px; text-align:center; width:25px;" id="infant_flight`+counter+`" name="infant_flight`+counter+`" value="0" readonly>
                                        <button type="button" class="right-plus-infant-flight btn-custom-circle" id="right-plus-infant-flight`+counter+`" data-type="plus" data-field="">
                                            <i class="fas fa-plus"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </ul>
                    </div>
                </div>`;
                else
         text+=`<div class="col-lg-4 col-md-6 col-sm-6" style="padding:0px;"></div>`;

                text+=`
                <div class="col-lg-4 col-md-6 col-sm-6" style="padding:0px;">
                    <span class="span-search-ticket"><i class="fas fa-plane"></i> Airline</span>
                    <div class="input-container-search-ticket btn-group">
                        <button id="show_provider_airline`+counter+`" type="button" class="form-control dropdown-toggle" data-toggle="dropdown" style="text-align:left; cursor:pointer;">Choose Airline</button>
                        <ul id="provider_flight_content`+counter+`" class="dropdown-menu" style="padding:10px; z-index:5;">

                        </ul>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-6" style="padding:0px;">
                    <span class="span-search-ticket">Class</span>
                    <div class="input-container-search-ticket btn-group">
                        <div class="form-select" id="default-select`+counter+`">
                            <select id="cabin_class_flight`+counter+`" name="cabin_class_flight`+counter+`" data-live-search="true" size="4">`;
                            console.log('asdasd');
                            for(i in cabin_class)
                                text+=`<option value="`+cabin_class[i].value+`" >`+cabin_class[i].name+`</option>`;
                     text+=`</select>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

        node.innerHTML = text;
        node.setAttribute('id', 'mc_airline_add'+counter);
        document.getElementById("mc_airline_add").appendChild(node);
        $("airline_departure"+counter).val(moment().format('DD MMM YYYY'));
        $('input[name="airline_departure'+counter+'"]').daterangepicker({
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
        get_airline_config('home',counter);
        $('#cabin_class_flight'+counter).niceSelect();
        get_carrier_code_list(counter);

        $('#origin_id_flight'+counter).select2();
        $('#destination_id_flight'+counter).select2();


//        for(i=0;i<counter;i++){
//            console.log('origin_id_flight'+(i+1));
//            $('#origin_id_flight'+(i+1)).select2();
//            $('#destination_id_flight'+(i+1)).select2();
//        }

    }
}

function del_multi_city(){
    if(counter!=1){
        document.getElementById("mc_airline"+counter).remove();
        counter--;
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

function airline_autocomplete(type){
    if(type == 'origin')
        document.getElementById('airline_origin_flight').value = document.getElementById('select2-origin_id_flight-container').innerHTML;
    else if(type == 'destination')
        document.getElementById('airline_destination_flight').value = document.getElementById('select2-destination_id_flight-container').innerHTML;
}

function airline_switch(){
    var temp = document.getElementById("airline_origin_flight").value;
    document.getElementById("select2-origin_id_flight-container").innerHTML = document.getElementById("airline_destination_flight").value;
    document.getElementById("airline_origin_flight").value = document.getElementById("airline_destination_flight").value;

    document.getElementById("select2-destination_id_flight-container").innerHTML = temp;
    document.getElementById("airline_destination_flight").value = temp;

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
        console.log(airline);
        for(i in airline){
           if(airline[i].origin == airline_request.origin.substr(airline_request.origin.length-4,3) && airline_departure == 'departure'){
               var price = 0;
               text += `
                    <div style="background-color:white; border:1px solid #cdcdcd; margin-bottom:15px;" id="journey`+i+`">
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="row" style="padding:10px;">
                                    <div class="col-lg-12">`;
                                    if(airline[i].operated_by == false)
                                        try{
                                            text += `<label>Operated By `+airline_carriers[airline[i].operated_by_carrier_code].name+`</label><br/>`;
                                        }catch(err){
                                            text += `<label>Operated By `+airline[i].operated_by_carrier_code+`</label><br/>`;
                                        }
                                    for(j in airline[i].carrier_code_list)
                                    text+=`
                                    <img data-toggle="tooltip" style="width:50px; height:50px;" title="`+airline_carriers[airline[i].carrier_code_list[j]].name+`" src="http://static.skytors.id/`+airline[i].carrier_code_list[j]+`.png">`;
                                    if(airline[i].is_combo_price == true){
                                        text+=`<span style="float:right; font-weight: bold; padding:5px; border:2px solid #f15a22;">Combo Price</span>`;
                                    }
                                    text+=`
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-9">
                                <div class="row" style="padding:0px 10px 10px 10px;">`;
                                    if(airline[i].is_combo_price == true){
                                        text+=`
                                        <div class="col-lg-12">
                                            <span style="font-weight: bold;">Departure</span>
                                        </div>`;
                                    }

                                    text+=`
                                    <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5">
                                        <table style="width:100%">
                                            <tr>
                                                <td class="airport-code"><h5>`+airline[i].origin+`</h5></td>
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
                                        <span>`+airline_request.origin.substr(0, airline_request.origin.length - 5)+`</span></br>
                                        <span>`+airline[i].departure_date.split(' - ')[0]+` `+airline[i].departure_date.split(' - ')[1]+`</span></br>
                                    </div>
                                    <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5">
                                        <table style="width:100%; margin-bottom:6px;">
                                            <tr>
                                                <td><h5>`+airline[i].destination+`</h5></td>
                                                <td></td>
                                                <td style="height:30px;padding:0 15px;width:100%"></td>
                                            </tr>
                                        </table>
                                        <span>`+airline_request.destination.substr(0, airline_request.destination.length - 5)+`</span><br/>
                                        <span>`+airline[i].arrival_date.split(' - ')[0]+` `+airline[i].arrival_date.split(' - ')[1]+`</span></br>
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

                                    if(airline[i].is_combo_price == true){
                                        transit = 0;
                                        check_transit = false;
                                        for(j in airline[i].segments){
                                            if(check_transit == true)
                                                transit++;
                                            if(airline[i].segments[j].origin == airline_request.destination.substr(airline_request.destination.length-4,3)){
                                                check_transit = true;
                                            }
                                        }
                                        return_date = [airline[i].segments[airline[i].segments.length-1].departure_date, airline[i].segments[airline[i].segments.length-1].arrival_date];
                                        for(j in airline[i].segments){
                                            if(airline[i].segments[j].origin == airline_request.destination.substr(airline_request.destination.length-4,3)){
                                                text+=`
                                                <div class="col-lg-12" style="margin-top:5px;">
                                                    <span style="font-weight: bold;">Return</span>
                                                </div>
                                                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5">
                                                    <table style="width:100%">
                                                        <tr>
                                                            <td class="airport-code"><h5>`+airline[i].segments[j].origin+`</h5></td>
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
                                                    <span>`+airline_request.destination.substr(0, airline_request.destination.length - 5)+`</span></br>
                                                    <span>`+return_date[0].split(' - ')[0]+` `+return_date[0].split(' - ')[1]+`</span></br>
                                                </div>

                                                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5">
                                                    <table style="width:100%; margin-bottom:6px;">
                                                        <tr>
                                                            <td><h5>`+airline[i].origin+`</h5></td>
                                                            <td></td>
                                                            <td style="height:30px;padding:0 15px;width:100%"></td>
                                                        </tr>
                                                    </table>
                                                    <span>`+airline_request.origin.substr(0, airline_request.origin.length - 5)+`</span><br/>
                                                    <span>`+return_date[1].split(' - ')[0]+` `+return_date[1].split(' - ')[1]+`</span></br>
                                                </div>

                                                <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2" style="padding:0px;">
                                                    <span>Transit: `+transit+`</span>
                                                </div>`;
                                            }
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
                                        if(choose_airline != null && choose_airline == airline[i].sequence)
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
                            if(airline[i].segments[j].origin == airline_request.destination.substr(airline_request.destination.length-4,3))
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
                            <div id="journey0segment0" style="padding:0px 10px 10px 10px; background-color:white; border:1px solid #cdcdcd;">
                                <span style="font-weight: bold;">`+airline_carriers[airline[i].segments[j].carrier_code].name+` - </span>
                                <span style="color:#f15a22; font-weight: bold;">`+airline[i].segments[j].carrier_name+`</span><hr/>`;
                                for(k in airline[i].segments[j].legs)
                                text+=`
                                <div class="row">
                                    <div class="col-lg-12">
                                        <div class="row">
                                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                                <table style="width:100%">
                                                    <tr>
                                                        <td class="airport-code"><h5>`+airline[i].segments[j].legs[k].origin+`</h5></td>
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
                                                <span>`+airline[i].segments[j].legs[k].origin_city+`</span> - <span>`+airline[i].segments[j].legs[k].origin_name+`</span></br>
                                                <span>Schedule depature</span></br>
                                                <span>`+airline[i].segments[j].legs[k].departure_date.split(' - ')[0]+` `+airline[i].segments[j].legs[k].departure_date.split(' - ')[1]+`</span></br>
                                                <span>Terminal</span></br>
                                            </div>
                                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                            <table style="width:100%; margin-bottom:6px;">
                                                <tr>
                                                    <td><h5>`+airline[i].segments[j].legs[k].destination+`</h5></td>
                                                    <td></td>
                                                    <td style="height:30px;padding:0 15px;width:100%"></td>
                                                </tr>
                                            </table>
                                            <span>`+airline[i].segments[j].legs[k].destination_city+`</span> - <span>`+airline[i].segments[j].legs[k].destination_name+`</span><br/>
                                            <span>Schedule arrival</span></br>
                                            <span>`+airline[i].segments[j].legs[k].arrival_date.split(' - ')[0]+` `+airline[i].segments[j].legs[k].arrival_date.split(' - ')[1]+`</span></br>
                                            <span>Terminal</span></br>
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
                                                console.log(total_price);
//                                                for(l in airline[i].segments[j].fares[k].service_charges){
//                                                    total_price += airline[i].segments[j].fares[k].service_charges[l].amount;
//                                                }
                                                id_price_segment = `journey`+i+`segment`+airline[i].segments[j].sequence+`fare`+airline[i].segments[j].fares[k].sequence;
                                                console.log(airline[i]);
                                                console.log(id_price_segment);
                                                console.log(total_price);
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
           }else if(airline[i].origin == airline_request.destination.substr(airline_request.destination.length-4,3) && airline_departure == 'return'){
               var price = 0;
               text += `
                <div style="background-color:white; margin-bottom:15px; border: 1px solid #cdcdcd;" id="journey`+i+`">
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="row" style="padding:10px;">
                                <div class="col-lg-12">`;
                                if(airline[i].operated_by == false)
                                    try{
                                        text += `<label>Operated By `+airline_carriers[airline[i].operated_by_carrier_code].name+`</label><br/>`;
                                    }catch(err){
                                        text += `<label>Operated By `+airline[i].operated_by_carrier_code+`</label><br/>`;
                                    }
                                for(j in airline[i].carrier_code_list)
                                text+=`
                                <img data-toggle="tooltip" style="width:50px; height:50px;" title="`+airline_carriers[airline[i].carrier_code_list[j]].name+`" class="airline-logo" src="http://static.skytors.id/`+airline[i].carrier_code_list[j]+`.png"><span> </span>`;
                                text+=`
                                </div>
                            </div>
                        </div>

                        <div class="col-lg-9">
                            <div class="row" style="padding:0px 10px 10px 10px;">
                                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5">
                                    <table style="width:100%">
                                        <tr>
                                            <td class="airport-code"><h5>`+airline[i].origin+`</h5></td>
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
                                    <span>`+airline_request.origin.substr(0, airline_request.origin.length - 5)+`</span></br>
                                    <span>`+airline[i].departure_date.split(' - ')[0]+` `+airline[i].departure_date.split(' - ')[1]+`</span></br>
                                </div>
                                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5">
                                    <table style="width:100%; margin-bottom:6px;">
                                        <tr>
                                            <td><h5>`+airline[i].destination+`</h5></td>
                                            <td></td>
                                            <td style="height:30px;padding:0 15px;width:100%"></td>
                                        </tr>
                                    </table>
                                    <span>`+airline_request.destination.substr(0, airline_request.destination.length - 5)+`</span><br/>
                                    <span>`+airline[i].arrival_date.split(' - ')[0]+` `+airline[i].arrival_date.split(' - ')[1]+`</span></br>
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
                    if(airline[i].segments[j].origin == airline_request.destination.substr(airline_request.destination.length-4,3))
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
                            <span style="font-weight: bold;">`+airline_carriers[airline[i].segments[j].carrier_code].name+` - </span>
                            <span style="color:#f15a22; font-weight: bold;">`+airline[i].segments[j].carrier_name+`</span><hr/>`;
                            text+=`
                            <div class="row">
                                <div class="col-lg-12">
                                    <div class="row">
                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                            <table style="width:100%">
                                                <tr>
                                                    <td class="airport-code"><h5>`+airline[i].segments[j].origin+`</h5></td>
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
                                            <span>`+airline[i].segments[j].origin_city+`</span> - <span>`+airline[i].segments[j].origin_name+`</span></br>
                                            <span>Schedule depature</span></br>
                                            <span>`+airline[i].segments[j].departure_date.split(' - ')[1]+`</span></br>
                                            <span>`+airline[i].segments[j].departure_date.split(' - ')[0]+`</span></br>
                                            <span>Terminal</span></br>
                                        </div>
                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                        <table style="width:100%; margin-bottom:6px;">
                                            <tr>
                                                <td><h5>`+airline[i].segments[j].destination+`</h5></td>
                                                <td></td>
                                                <td style="height:30px;padding:0 15px;width:100%"></td>
                                            </tr>
                                        </table>
                                        <span>`+airline[i].segments[j].destination_city+`</span> - <span>`+airline[i].segments[j].destination_name+`</span><br/>
                                        <span>Schedule arrival</span></br>
                                        <span>`+airline[i].segments[j].arrival_date.split(' - ')[1]+`</span></br>
                                        <span>`+airline[i].segments[j].arrival_date.split(' - ')[0]+`</span></br>
                                        <span>Terminal</span></br>
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
                                            console.log(total_price);
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

function change_departure(){
    journey = [];
    value_pick = [];
    airline_pick_list = [];
    document.getElementById("badge-flight-notif").innerHTML = "0";
    document.getElementById("badge-flight-notif2").innerHTML = "0";
    $("#badge-flight-notif").removeClass("infinite");
    $("#badge-flight-notif2").removeClass("infinite");
    $('#choose-ticket-flight').show();
    document.getElementById("airline_ticket_pick").innerHTML = '';
    document.getElementById("airline_detail").innerHTML = '';
    airline_departure = 'departure';
    choose_airline = null;
    filtering('filter');

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

function check_provider(val){
    console.log(val);
    if(val == 'all'){
        for(i in airline_provider_list){
            document.getElementById('provider_box_'+airline_provider_list[i].code).checked = false;
        }
        document.getElementById('provider_box_All').checked = true;
    }
    else
        document.getElementById('provider_box_All').checked = false;

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

function airline_detail(){
    if(price_itinerary.price_itinerary_provider.length!=0){
        for(i in price_itinerary.price_itinerary_provider){
            for(j in price_itinerary.price_itinerary_provider[i].price_itinerary){
                for(k in price_itinerary.price_itinerary_provider[i].price_itinerary[j].segments){
                    for(l in price_itinerary.price_itinerary_provider[i].price_itinerary[j].segments[k].fares){
                        for(m in price_itinerary.price_itinerary_provider[i].price_itinerary[j].segments[k].fares[l].service_charge_summary){
                            for(n in price_itinerary.price_itinerary_provider[i].price_itinerary[j].segments[k].fares[l].service_charge_summary[m].service_charges){
                                price_type[price_itinerary.price_itinerary_provider[i].price_itinerary[j].segments[k].fares[l].service_charge_summary[m].service_charges[n].charge_code] = price_itinerary.price_itinerary_provider[i].price_itinerary[j].segments[k].fares[l].service_charge_summary[m].service_charges[n].amount;
                            }
                            if(price_itinerary.price_itinerary_provider[i].price_itinerary[j].segments[k].journey_type == 'DEP' || price_itinerary.price_itinerary_provider[i].price_itinerary[j].is_combo_price == true){
                                dep_price[price_itinerary.price_itinerary_provider[i].price_itinerary[j].segments[k].fares[l].service_charge_summary[m].pax_type] = price_type;
                            }else if(price_itinerary.price_itinerary_provider[i].price_itinerary[j].segments[k].journey_type == 'RET'){
                                ret_price[price_itinerary.price_itinerary_provider[i].price_itinerary[j].segments[k].fares[l].service_charge_summary[m].pax_type] = price_type;
                            }
                                price_type = [];
                        }
                    }
                }
            }
        }
   text = `
    <div class="row" style="margin-bottom:5px; ">
        <div class="col-lg-12">
           <h4> Price Detail </h4>
           <hr/>
           <h6>Departure</h6>`;
           $text ='Departure\n';
           count = 0;
           for(i in airline_pick[0].segments){
               if(airline_pick[0].segments[i].journey_type == 'DEP'){
                   $text += airline_carriers[airline_pick[0].segments[i].carrier_code].name + ' ' + airline_pick[0].segments[i].carrier_code + airline_pick[0].segments[i].carrier_number + '\n';
                   $text += airline_pick[0].segments[i].departure_date + ' → ' + airline_pick[0].segments[i].arrival_date + '\n';
                   $text += airline_pick[0].segments[i].origin_name + ' (' + airline_pick[0].segments[i].origin_city + ') - ';
                   $text += airline_pick[0].segments[i].destination_name + ' (' + airline_pick[0].segments[i].destination_city + ')\n\n';
                   if(count == 0)
                       for(j in airline_pick[0].carrier_code_list)
                           text+=`<img data-toggle="tooltip" style="width:50px; height:50px;" title="`+airline_carriers[airline_pick[0].segments[i].carrier_code].name+`" class="airline-logo" src="http://static.skytors.id/`+airline_pick[0].carrier_code_list[j]+`.png"><span> </span>`;

               }else{
                   break;
               }
               count++;
           }
           console.log($text);
        text+=`</div>
        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
            <table style="width:100%">
                <tr>
                    <td class="airport-code"><h6>`+airline_pick[0].origin+`</h6></td>
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
            <span style="font-size:12px;">`+airline_pick[0].origin_city+`</span></br>
            <span style="font-size:12px;">`+airline_pick[0].departure_date.split(' - ')[0]+` `+airline_pick[0].departure_date.split(' - ')[1]+`</span></br>
        </div>
        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
            <table style="width:100%; margin-bottom:6px;">
                <tr>
                    <td><h6>`+airline_pick[0].destination+`</h6></td>
                    <td></td>
                    <td style="height:30px;padding:0 15px;width:100%"></td>
                </tr>
            </table>
            <span style="font-size:12px;">`+airline_pick[0].destination_city+`</span><br/>
            <span style="font-size:12px;">`+airline_pick[0].arrival_date.split(' - ')[0]+` `+airline_pick[0].arrival_date.split(' - ')[1]+`</span></br>
        </div>
    </div>
    <hr/>`;
    if(airline_pick[0].is_combo_price == true){
        text += `
        <div class="row" style="margin-bottom:5px; ">
            <div class="col-lg-12">
               <h6>Return</h6>`;
               $text ='Return\n';
               for(i in airline_pick[0].segments){
                   if(airline_pick[0].segments[i].journey_type == 'RET'){
                       $text += airline_carriers[airline_pick[0].segments[i].carrier_code].name + ' ' + airline_pick[0].segments[i].carrier_code + airline_pick[0].segments[i].carrier_number + '\n';
                       $text += airline_pick[0].segments[i].departure_date + ' → ' + airline_pick[0].segments[i].arrival_date + '\n';
                       $text += airline_pick[0].segments[i].origin_name + ' (' + airline_pick[0].segments[i].origin_city + ') - ';
                       $text += airline_pick[0].segments[i].destination_name + ' (' + airline_pick[0].segments[i].destination_city + ')\n\n';
//                       text+=`<img data-toggle="tooltip" style="width:50px; height:50px;" title="`+airline_carriers[airline_pick[0].segments[i].carrier_code]+`" class="airline-logo" src="http://static.skytors.id/`+airline_pick[0].carrier_code_list[i]+`.png"><span> </span>`;
                       check = 1;
                   }else if(check == 1){
                       break;
                   }
               }
               console.log($text);
            text+=`</div>
            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                <table style="width:100%">
                    <tr>
                        <td class="airport-code"><h6>`+airline_pick[0].destination+`</h6></td>
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
                <span style="font-size:12px;">`+airline_pick[0].destination_city+`</span></br>
                <span style="font-size:12px;">`+airline_pick[0].departure_date_return.split(' - ')[0]+` `+airline_pick[0].departure_date_return.split(' - ')[1]+`</span></br>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                <table style="width:100%; margin-bottom:6px;">
                    <tr>
                        <td><h6>`+airline_pick[0].origin+`</h6></td>
                        <td></td>
                        <td style="height:30px;padding:0 15px;width:100%"></td>
                    </tr>
                </table>
                <span style="font-size:12px;">`+airline_pick[0].origin_city+`</span><br/>
                <span style="font-size:12px;">`+airline_pick[0].arrival_date_return.split(' - ')[0]+` `+airline_pick[0].arrival_date_return.split(' - ')[1]+`</span></br>
            </div>
        </div>
        <hr/>`;
    }
    text+=`
    <div class="row">`;
        price = 0;
        price = 0;
        //adult
        console.log(dep_price);
        console.log(ret_price);
        if(airline_request.adult != '0'){
            if(dep_price.ADT['roc'] != null)
                price = dep_price.ADT['roc'];
            if(dep_price.ADT.tax != null)
                price += dep_price.ADT.tax;
            text+=`
                <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                    <span style="font-size:12px;">`+airline_request.adult+`x Adult Fare @ Rp `+getrupiah(Math.ceil(dep_price.ADT.fare))+`</span><br/>
                </div>
                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                    <span style="font-size:12px;">`+getrupiah(Math.ceil(dep_price.ADT.fare * airline_request.adult))+`</span><br/>
                </div>
                <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                    <span style="font-size:12px;">`+airline_request.adult+`x Service Charge</span><br/>
                </div>
                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                    <span style="font-size:12px;">`+getrupiah(Math.ceil(price * airline_request.adult))+`</span><br/>
                </div>`;
            price = 0;
        }
        //child
        if(airline_request.child != '0'){
            if(dep_price.CHD['roc'] != null)
                price = dep_price.CHD['roc'];
            if(dep_price.CHD.tax != null)
                price += dep_price.CHD.tax;
            text+=`
                <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                    <span style="font-size:12px;">`+airline_request.child+`x Child Fare @ Rp `+getrupiah(Math.ceil(dep_price.CHD.fare))+`</span><br/>
                </div>
                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                    <span style="font-size:12px;">`+getrupiah(Math.ceil(dep_price.CHD.fare * airline_request.child))+`</span><br/>
                </div>
                <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                    <span style="font-size:12px;">`+airline_request.child+`x Service Charge</span><br/>
                </div>
                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                    <span style="font-size:12px;">`+getrupiah(Math.ceil(price * airline_request.child))+`</span><br/>
                </div>`;
            price = 0;
        }
        //infant
        if(airline_request.infant != '0'){
            if(dep_price.INF['roc'] != null)
                price = dep_price.INF['roc'];
            if(dep_price.INF.tax != null)
                price += dep_price.INF.tax;
            if(dep_price.INF.inf != null)
                price += dep_price.INF.inf;

            text+=`
                <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                    <span style="font-size:12px;">`+airline_request.infant+`x Infant Fare @ Rp `+getrupiah(Math.ceil(dep_price.INF.fare))+`</span><br/>
                </div>
                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                    <span style="font-size:12px;">`+getrupiah(Math.ceil(dep_price.INF.fare * airline_request.infant))+`</span><br/>
                </div>
                <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                    <span style="font-size:12px;">`+airline_request.infant+`x Service Charge</span><br/>
                </div>
                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                    <span style="font-size:12px;">`+getrupiah(Math.ceil(price * airline_request.infant))+`</span><br/>
                </div>`;
            price = 0;
        }
    text+=`</div>`;
        //return
        if(airline_request.direction == 'RT' && airline_pick.length == 2){
            text+=`
        <div class="row" style="margin-top:5px; margin-bottom:5px;">
            <div class="col-lg-12">
                <hr/>
                <h6>Return</h6>`;
                $text ='Return\n';
                count = 0;
                   for(i in airline_pick[1].segments){
                       if(airline_pick[1].segments[i].journey_type=='RET'){
                           $text += airline_carriers[airline_pick[1].segments[i].carrier_code].name + ' ' + airline_pick[1].segments[i].carrier_code + airline_pick[1].segments[i].carrier_number + '\n';
                           $text += airline_pick[1].segments[i].departure_date + ' → ' + airline_pick[1].segments[i].arrival_date + '\n';
                           $text += airline_pick[1].segments[i].origin_name + ' (' + airline_pick[1].segments[i].origin_city + ') - '
                           $text += airline_pick[1].segments[i].destination_name + ' (' + airline_pick[1].segments[i].destination_city + ')\n\n'
                           if(count == 0)
                               for(j in airline_pick[1].carrier_code_list)
                                    text+=`<img data-toggle="tooltip" style="width:50px; height:50px;" title="`+airline_carriers[airline_pick[1].segments[i].carrier_code].name+`" class="airline-logo" src="http://static.skytors.id/`+airline_pick[1].carrier_code_list[j]+`.png"><span> </span>`;
                       }else{
                           break;
                       }
                       count++;
                   }
            text+=`</div>`;

            text+=`
            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                <table style="width:100%">
                    <tr>
                        <td class="airport-code"><h6>`+airline_pick[1].origin+`</h6></td>
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
                <span style="font-size:12px;">`+airline_pick[1].origin_city+`</span></br>
                <span style="font-size:12px;">`+airline_pick[1].departure_date.split(' - ')[0]+` `+airline_pick[1].departure_date.split(' - ')[1]+`</span></br>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                <table style="width:100%; margin-bottom:6px;">
                    <tr>
                        <td><h6>`+airline_pick[1].destination+`</h6></td>
                        <td></td>
                        <td style="height:30px;padding:0 15px;width:100%"></td>
                    </tr>
                </table>
                <span style="font-size:12px;">`+airline_pick[1].destination_city+`</span><br/>
                <span style="font-size:12px;">`+airline_pick[1].arrival_date.split(' - ')[0]+` `+airline_pick[1].arrival_date.split(' - ')[1]+`</span></br>
            </div>
        </div>
        <hr/>
        <div class="row">`;
            //adult
            if(parseInt(airline_request.adult) != 0){
                if(dep_price.ADT['roc'] != null)
                    price = ret_price.ADT['roc'];
                if(dep_price.ADT.tax != null)
                    price += ret_price.ADT.tax;
                text+=`
                <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                    <span style="font-size:12px;">`+airline_request.adult+`x Adult Fare @ Rp `+getrupiah(Math.ceil(ret_price.ADT.fare))+`</span><br/>
                </div>
                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                    <span style="font-size:12px;">`+getrupiah(Math.ceil(ret_price.ADT.fare * airline_request.adult))+`</span><br/>
                </div>
                <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                    <span style="font-size:12px;">`+airline_request.adult+`x Service Charge</span><br/>
                </div>
                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                    <span style="font-size:12px;">`+getrupiah(Math.ceil(price * airline_request.adult))+`</span><br/>
                </div>`;
                price = 0;
            }
            //child
            if(parseInt(airline_request.child) != 0){
                if(ret_price.CHD['roc'] != null)
                    price = ret_price.CHD['roc'];
                if(ret_price.CHD.tax != null)
                    price += ret_price.CHD.tax;
                text+=`
                <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                    <span style="font-size:12px;">`+airline_request.child+`x Child Fare @ Rp `+getrupiah(Math.ceil(ret_price.CHD.fare))+`</span><br/>
                </div>
                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                    <span style="font-size:12px;">`+getrupiah(Math.ceil(ret_price.CHD.fare * airline_request.child))+`</span><br/>
                </div>
                <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                    <span style="font-size:12px;">`+airline_request.child+`x Service Charge</span><br/>
                </div>
                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                    <span style="font-size:12px;">`+getrupiah(Math.ceil(price * airline_request.child))+`</span><br/>
                </div>`;
                price = 0;
            }
            //infant
            if(parseInt(airline_request.infant) != 0){
                if(ret_price.INF['roc'] != null)
                    price = ret_price.INF['roc'];
                if(ret_price.INF.tax != null)
                    price += ret_price.INF.tax;
                if(ret_price.INF.inf != null)
                    price += ret_price.INF.inf;
                text+=`
                <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                    <span style="font-size:12px;">`+airline_request.infant+`x Infant Fare @ Rp `+getrupiah(Math.ceil(ret_price.INF.fare))+`</span><br/>
                </div>
                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                    <span style="font-size:12px;">`+getrupiah(Math.ceil(ret_price.INF.fare * airline_request.infant))+`</span><br/>
                </div>
                <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                    <span style="font-size:12px;">`+airline_request.infant+`x Service Charge</span><br/>
                </div>
                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                    <span style="font-size:12px;">`+getrupiah(Math.ceil(price * airline_request.infant))+`</span><br/>
                </div>`;
                price = 0;
            }
        }
    text+=`</div><hr/>`;
        total_price = 0;
        temp_price = 0;
        commission_price = 0;
        if(parseInt(airline_request.adult) != 0){
            if(airline_request.direction == 'RT')
                if(airline_pick[0].is_combo_price == true){
                    if(dep_price.ADT.fare != null)
                        price = dep_price.ADT.fare;
                    if(dep_price.ADT['roc'] != null)
                        price += dep_price.ADT['roc'];
                    if(dep_price.ADT.tax != null)
                        price += dep_price.ADT.tax;
                    total_price += airline_request.adult * price;
                    temp_price += airline_request.adult * price;
                    if(dep_price.ADT['rac'] != null)
                        commission_price += airline_request.adult * (dep_price.ADT['r.ac']);
                }else{
                    if(dep_price.ADT.fare != null)
                        price = dep_price.ADT.fare;
                    if(dep_price.ADT['roc'] != null)
                        price += dep_price.ADT['roc'];
                    if(dep_price.ADT.tax != null)
                        price += dep_price.ADT.tax;

                    total_price += airline_request.adult * price;
                    temp_price += airline_request.adult * price;
                    price = 0;

                    if(ret_price.ADT.fare != null)
                        price = ret_price.ADT.fare;
                    if(ret_price.ADT['roc'] != null)
                        price += ret_price.ADT['roc'];
                    if(ret_price.ADT.tax != null)
                        price += ret_price.ADT.tax;

                    total_price += airline_request.adult * price;
                    temp_price += airline_request.adult * price;

                    if(dep_price.ADT['rac'] != null)
                        commission_price += airline_request.adult * (dep_price.ADT['rac']);
                    if(ret_price.ADT['rac'] != null)
                    commission_price += airline_request.adult * (ret_price.ADT['rac']);
                }
            else{
                if(dep_price.ADT.fare != null)
                    price = dep_price.ADT.fare;
                if(dep_price.ADT['roc'] != null)
                    price += dep_price.ADT['roc'];
                if(dep_price.ADT.tax != null)
                    price += dep_price.ADT.tax;
                total_price += airline_request.adult * price;
                temp_price += airline_request.adult * price;
                if(dep_price.ADT['rac'] != null)
                    commission_price += airline_request.adult * (dep_price.ADT['rac']);
            }
        }
        if(parseInt(airline_request.adult) != 0)
            $text += airline_request.adult + ' Adult Fare @IDR ' + getrupiah(Math.ceil(temp_price)) + '\n';
        temp_price = 0;
        if(parseInt(airline_request.child) != 0){
            if(airline_request.direction == 'RT')
                if(airline_pick[0].is_combo_price == true){
                    if(dep_price.CHD.fare != null)
                        price = dep_price.CHD.fare;
                    if(dep_price.CHD['roc'] != null)
                        price += dep_price.CHD['roc'];
                    if(dep_price.CHD.tax != null)
                        price += dep_price.CHD.tax;
                    total_price += airline_request.child * price;
                    temp_price += airline_request.child * price;
                    if(dep_price.CHD['rac'] != null)
                        commission_price += airline_request.child * (dep_price.CHD['rac']);
                }else{
                    if(dep_price.CHD.fare != null)
                        price = dep_price.CHD.fare;
                    if(dep_price.CHD['roc'] != null)
                        price += dep_price.CHD['roc'];
                    if(dep_price.CHD.tax != null)
                        price += dep_price.CHD.tax;

                    total_price += airline_request.child * price;
                    temp_price += airline_request.child * price;

                    if(ret_price.ADT.fare != null)
                        price = ret_price.ADT.fare;
                    if(ret_price.ADT['roc'] != null)
                        price += ret_price.ADT['roc'];
                    if(ret_price.ADT.tax != null)
                        price += ret_price.ADT.tax;

                    total_price += airline_request.child * price;
                    temp_price += airline_request.child * price;
                    if(dep_price.CHD['rac'] != null)
                        commission_price += airline_request.child * (dep_price.CHD['rac']);
                    if(ret_price.CHD['rac'] != null)
                        commission_price += airline_request.child * (ret_price.CHD['rac']);
                }
            else{
                if(dep_price.CHD.fare != null)
                    price = dep_price.CHD.fare;
                if(dep_price.CHD['roc'] != null)
                    price += dep_price.CHD['roc'];
                if(dep_price.CHD.tax != null)
                    price += dep_price.CHD.tax;

                total_price += airline_request.child * price;
                temp_price += airline_request.child * price;
                if(dep_price.CHD['rac'] != null)
                    commission_price += airline_request.child * (dep_price.CHD['rac']);
            }
        }
        if(parseInt(airline_request.child) != 0)
            $text += airline_request.child + ' Child Fare @IDR ' + getrupiah(Math.ceil(temp_price)) + '\n';
        temp_price = 0;
        if(parseInt(airline_request.infant) != 0){
            if(airline_request.direction == 'RT')
                if(airline_pick[0].is_combo_price == true){
                    if(dep_price.INF.fare != null)
                        price = dep_price.INF.fare;
                    if(dep_price.INF['roc'] != null)
                        price += dep_price.INF['roc'];
                    if(dep_price.INF.tax != null)
                        price += dep_price.INF.tax;
                    if(dep_price.INF.inf != null)
                        price += dep_price.INF.inf;
                    console.log(price);
                    total_price += airline_request.infant * price;
                    temp_price += airline_request.infant * price;
                    if(dep_price.INF['rac'] != null)
                        commission_price += airline_request.infant * (dep_price.INF['rac']);
                }else{
                    if(dep_price.INF.fare != null)
                        price = dep_price.INF.fare;
                    if(dep_price.INF['roc'] != null)
                        price += dep_price.INF['roc'];
                    if(dep_price.INF.tax != null)
                        price += dep_price.INF.tax;
                    total_price += airline_request.infant * price;
                    temp_price += airline_request.infant * price;

                    if(ret_price.INF.fare != null)
                        price = ret_price.INF.fare;
                    if(ret_price.INF['roc'] != null)
                        price += ret_price.INF['roc'];
                    if(ret_price.INF.tax != null)
                        price += ret_price.INF.tax;
                    if(ret_price.INF.inf != null)
                        price += ret_price.INF.inf;
                    total_price += airline_request.infant * price;
                    temp_price += airline_request.infant * price;
                    if(dep_price.INF['rac'] != null)
                        commission_price += airline_request.infant * (dep_price.INF['rac']);
                    if(ret_price.INF['rac'] != null)
                        commission_price += airline_request.infant * (ret_price.INF['rac']);
                }
            else{
                if(dep_price.INF.fare != null)
                    price = dep_price.INF.fare;
                if(dep_price.INF['roc'] != null)
                    price += dep_price.INF['roc'];
                if(dep_price.INF.tax != null)
                    price += dep_price.INF.tax;
                if(dep_price.INF.inf != null)
                    price += dep_price.INF.inf;
                total_price += airline_request.infant * price;
                temp_price += airline_request.infant * price;
                if(dep_price.INF['rac'] != null)
                    commission_price += airline_request.infant * (dep_price.INF['rac']);
            }
        }
        if(commission_price < 0)
            commission_price *= -1;
        if(parseInt(airline_request.infant) != 0)
            $text += airline_request.infant + ' Infant Fare @IDR ' + getrupiah(Math.ceil(temp_price)) + '\n\n';
        $text += 'Grand Total: IDR '+ getrupiah(Math.ceil(total_price)) + '\n\nPrices and availability may change at any time';
        text+=`
        </div>
    </div>

    <div class="row">
        <div class="col-lg-7" style="text-align:left;">
            <span style="font-size:12px;">Additional Price</span><br/>
        </div>
        <div class="col-lg-5" style="text-align:right;">
            <span style="font-size:12px;" id="additional_price">`+getrupiah(Math.ceil(additional_price))+`</span><br/>
            <input type="hidden" name="additional_price" id="additional_price_hidden"/>
        </div>
        <div class="col-lg-7" style="text-align:left;">
            <span style="font-size:13px;"><b>Total</b></span><br/>
        </div>
        <div class="col-lg-5" style="text-align:right;">
            <span style="font-size:13px;" id="total_price"><b>`+getrupiah(Math.ceil(total_price+additional_price))+`</b></span><br/>
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
    }else{
        text = `<span style="font-weight: bold; font-size:14px;">No Price Itinerary</span>`;
    }

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
       console.log(check_date(document.getElementById('adult_birth_date'+i).value));
       console.log(document.getElementById('adult_birth_date'+i).value);
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
       document.getElementById('airline_review').submit();
   }
   else{
       alert(error_log);
       $('.next-loading').removeClass("running");
       $('.next-loading').prop('disabled', false);
   }
}

function on_change_ssr(idhidden, id){
    price = 0;
    if(parseInt(document.getElementById(id).options[document.getElementById(id).selectedIndex].text.split(' ')[document.getElementById(id).options[document.getElementById(id).selectedIndex].text.split(' ').length-1]) > 0)
        price = parseInt(document.getElementById(id).options[document.getElementById(id).selectedIndex].text.split(' ')[document.getElementById(id).options[document.getElementById(id).selectedIndex].text.split(' ').length-1]);
    console.log(document.getElementById(idhidden).value);
    if(document.getElementById(idhidden).value != 'Selected')
        additional_price += price - parseInt(document.getElementById(idhidden).value);
    else
        additional_price += price;
    console.log(price);
    console.log(additional_price);
    document.getElementById('additional_price').innerHTML = getrupiah(additional_price);
    document.getElementById('additional_price_hidden').value = additional_price;
    console.log(document.getElementById(id).options[document.getElementById(id).selectedIndex].text.split(' ')[document.getElementById(id).options[document.getElementById(id).selectedIndex].text.split(' ').length-1]);
    document.getElementById(idhidden).value = document.getElementById(id).options[document.getElementById(id).selectedIndex].text.split(' ')[document.getElementById(id).options[document.getElementById(id).selectedIndex].text.split(' ').length-1];
    document.getElementById('total_price').innerHTML = getrupiah(Math.ceil(total_price + additional_price));
}

function get_airline_review(){
    text = '';
    console.log(airline_pick);
    text = `<div style="background-color:white; padding:10px; border:1px solid #cdcdcd;">
            <h4>Flight Detail</h4>
            <hr/>`;
    for(i in airline_pick){
        if(i == 0)
            text += '<h6>Departure</h6>';
        else
            text += '<hr/><h6>Return</h6>';

        for(j in airline_pick[i].segments){

            if(airline_pick[i].segments[j].origin == airline_request.destination)
                text += '<h6>Return</h6>';
            text+= `<div class="row">`;
            text+= `<div class="col-lg-12">
            <img data-toggle="tooltip" style="width:50px; height:50px;" title="`+airline_carriers[airline_pick[i].segments[j].carrier_code].name+`" class="airline-logo" src="http://static.skytors.id/`+airline_pick[i].segments[j].carrier_code+`.png"/>
            </div>`;

            text+= `<div class="col-lg-12">
                        <h5>`+airline_carriers[airline_pick[i].segments[j].carrier_code].name+` (`+airline_pick[i].segments[j].carrier_code+` `+airline_pick[i].segments[j].carrier_number+`)</h5>`;
            console.log(airline_get_price_request);
            console.log(airline_pick);
            if(airline_get_price_request.journeys_booking[i].segments[j].fare_pick != ''){
                 text+=`<h6>Class: `+airline_pick[i].segments[j].fares[airline_get_price_request.journeys_booking[i].segments[j].fare_pick].subclass+`</h6>`;
            }
            text+= `</div>`;
            text+= `</div>
                    <div class="row">`;
            text+= `
                    <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5">
                        <table style="width:100%">
                            <tr>
                                <td class="airport-code"><h5>`+airline_pick[i].segments[j].origin+`</h5></td>
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
                        <span>`+airline_pick[i].segments[j].origin_city+` - `+airline_pick[i].segments[j].origin_name+`</span></br>
                        <span>`+airline_pick[i].segments[j].departure_date.split(' - ')[0]+` `+airline_pick[i].segments[j].departure_date.split(' - ')[1]+`</span></br>
                    </div>
                    <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5">
                        <table style="width:100%; margin-bottom:6px;">
                            <tr>
                                <td><h5>`+airline_pick[i].segments[j].destination+`</h5></td>
                                <td></td>
                                <td style="height:30px;padding:0 15px;width:100%"></td>
                            </tr>
                        </table>
                        <span>`+airline_pick[i].segments[j].destination_city+` - `+airline_pick[i].segments[j].destination_name+`</span><br/>
                        <span>`+airline_pick[i].segments[j].arrival_date.split(' - ')[0]+` `+airline_pick[i].segments[j].arrival_date.split(' - ')[1]+`</span></br>
                    </div>
                </div>`;
        }
    }
    text+=`</div>`;

    //contact
    text+=`
    <div class="row" style="padding-top:20px;">
        <div class="col-lg-12">
            <div style="border:1px solid #cdcdcd; background-color:white;padding:10px;">
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

            <div style="border:1px solid #cdcdcd; background-color:white; padding:10px;">
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
    console.log(val);
    while(temp != airline_request.adult+1){
        console.log(document.getElementById('adult_cp'+temp.toString()).checked);
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