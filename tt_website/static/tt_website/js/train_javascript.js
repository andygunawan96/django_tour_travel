sorting_value = '';
journeys = [];
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

var myVar;

var sorting_list2 = [
    {
        value:'Price',
        status: false
    },{
        value:'Departure',
        status: false
    },{
        value:'Arrival',
        status: false
    }
]

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

var cabin_list = [
    {
        value:'Economy',
        status: false
    },{
        value:'Business',
        status: false
    },{
        value:'Executive',
        status: false
    }
]


//function train_check_search(){
//
//    var error_log = '';
//    if(document.getElementById("train_origin").value == document.getElementById("train_destination").value)
//        error_log += 'Please change your Origin or Destination!\n';
//    if(document.getElementById('train_departure').value=='')
//        error_log += 'Please change your date!\n';
//    if(error_log == ''){
//        document.getElementById('train_searchForm').submit();
//    }
//    else
//        alert(error_log);
//}

function set_train_search_value_to_false(){
    train_search_value = 'false';
}
function set_train_search_value_to_true(){
    train_search_value = 'true';
}

function train_search_autocomplete(term){
    term = term.toLowerCase();
    console.log(term);
    var choices = new_train_destination;
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

function train_check_search_values(){
    type = '';
    error_log = '';

    if(document.getElementById('train_origin').value.split(' - ').length != 4)
        error_log+= 'Please use autocomplete for origin\n';
    if(document.getElementById('train_destination').value.split(' - ').length != 4)
        error_log+= 'Please use autocomplete for destination\n';

    if(error_log == ''){
        $('.button-search').addClass("running");
        var train_origin = [document.getElementById('train_origin').value.split(' - ')[0]];
        var train_destination = [document.getElementById('train_destination').value.split(' - ')[0]];
        var radio_train_type = '';
        var radios = document.getElementsByName('radio_train_type');
        for (var j = 0, length = radios.length; j < length; j++) {
            if (radios[j].checked) {
                if(radios[j].value == 'oneway')
                    radio_train_type = 'OW';
                else
                    radio_train_type = 'RT';
                break;
            }
        }
        try{
            var train_departure_date = document.getElementById('train_departure_return').value.split(' - ');
        }
        catch{
            var train_departure_date = document.getElementById('train_departure').value.split(' - ');
        }
        if(radio_train_type == 'RT'){
            train_origin.push(document.getElementById('train_destination').value.split(' - ')[0]);
            train_destination.push(document.getElementById('train_origin').value.split(' - ')[0]);
        }

        var train_request_data = {
            "radio_train_type": radio_train_type,
            "origin": train_origin,
            "destination": train_destination,
            "departure_date": train_departure_date,
            "adult": document.getElementById('train_adult').value,
            "infant": document.getElementById('train_infant').value,
        }
        if(document.getElementById('checkbox_corpor_mode_train')){
            if(document.getElementById('checkbox_corpor_mode_train').checked){
                train_request_data['checkbox_corpor_mode_train'] = true;
                if(document.getElementById('train_corpor_select')){
                    if(!document.getElementById('train_corpor_select').value){
                        document.getElementById('train_corpor_select').value = '';
                    }
                    train_request_data['train_corpor_select'] = document.getElementById('train_corpor_select').value.split(' - ')[0];
                }if(document.getElementById('train_corbooker_select')){
                    train_request_data['train_corbooker_select'] = document.getElementById('train_corbooker_select').value;
                }
            }
        }
        var concat_url = '';
        for(key in train_request_data){
            if(concat_url)
                concat_url += '&';
            concat_url += key + '=' + encodeURIComponent(train_request_data[key]);
        }
        window.location.href = '/train/search?' + concat_url;
//        document.getElementById('train_searchForm').submit();
    }else{
        $('.button-search').removeClass("running");
        alert(error_log);
    }
}

function search_train_validation(){
    var train_origin = document.getElementById('train_origin').value;
    var train_destination = document.getElementById('train_destination').value;
    var train_departure = document.getElementById('train_departure').value;
    var is_valid = true;

    if (train_origin == "" || train_destination == "" || train_departure == ""){
        is_valid = false;
        alert("Please input all field");
    }

    return is_valid;
}



function train_switch(){
    var temp = document.getElementById("train_origin").value;
    document.getElementById("train_origin").value = document.getElementById("train_destination").value;
    document.getElementById("train_destination").value = temp;

    $('#train_origin').niceSelect('update');
    $('#train_destination').niceSelect('update');
}


//<label class="check_box_custom">
//    <span class="span-search-ticket" style="color:black;">`+arrival_list[i].value+`</span>
//    <input type="checkbox" id="checkbox_arrival_time`+i+`" onclick="change_filter('arrival',`+i+`)" checked/>
//    <span class="check_box_span_custom"></span>
//</label><br/>

function train_filter_render(){
    document.getElementById("sorting-train").innerHTML = '';
    document.getElementById("sorting-train2").innerHTML = '';
    document.getElementById("filter").innerHTML = '';
    document.getElementById("filter2").innerHTML = '';

    text = '';
    text+= `<h4 style="display: inline;">Filter</h4><a style="float: right; cursor: pointer;" onclick="reset_filter();"><i style="color:`+color+`;" class="fa fa-refresh"></i> Reset</a>
            <hr/>
            <h6 class="filter_general" onclick="show_hide_general('trainDeparture');">Departure Time <i class="fas fa-chevron-down" id="trainDeparture_generalDown" style="float:right; display:none;"></i><i class="fas fa-chevron-up" id="trainDeparture_generalUp" style="float:right; display:block;"></i></h6>
    <div id="trainDeparture_generalShow" style="display:inline-block;">`;
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
                <input type="checkbox" id="checkbox_departure_time`+i+`" onclick="change_filter('departure',`+i+`);"/>
                <span class="check_box_span_custom"></span>
            </label><br/>`;
    }
    var node = document.createElement("div");
    node.innerHTML = text;
    document.getElementById("filter").appendChild(node);
    node = document.createElement("div");

    text=`<hr/>
    <h6 class="filter_general" onclick="show_hide_general('trainArrival');">Arrival Time <i class="fas fa-chevron-down" id="trainArrival_generalDown" style="float:right; display:none;"></i><i class="fas fa-chevron-up" id="trainArrival_generalUp" style="float:right; display:block;"></i></h6>
    <div id="trainArrival_generalShow" style="display:inline-block;">`;
    for(i in arrival_list){
        if(i == 0)
            text+=`
            <label class="check_box_custom">
                <span class="span-search-ticket" style="color:black;">`+arrival_list[i].value+`</span>
                <input type="checkbox" id="checkbox_arrival_time`+i+`" onclick="change_filter('arrival',`+i+`);" checked/>
                <span class="check_box_span_custom"></span>
            </label><br/>`;
        else
            text+=`
            <label class="check_box_custom">
                <span class="span-search-ticket" style="color:black;">`+arrival_list[i].value+`</span>
                <input type="checkbox" id="checkbox_arrival_time`+i+`" onclick="change_filter('arrival',`+i+`);"/>
                <span class="check_box_span_custom"></span>
            </label><br/>`;
    }

    var node = document.createElement("div");
    node.innerHTML = text;
    document.getElementById("filter").appendChild(node);
    node = document.createElement("div");

    text = `<hr/>
    <h6 class="filter_general" onclick="show_hide_general('trainClass');">Class <i class="fas fa-chevron-down" id="trainClass_generalDown" style="float:right; display:none;"></i><i class="fas fa-chevron-up" id="trainClass_generalUp" style="float:right; display:block;"></i></h6>
    <div id="trainClass_generalShow" style="display:inline-block;">`;
    for(i in cabin_list){
        text+=`
        <label class="check_box_custom">
            <span class="span-search-ticket" style="color:black;">`+cabin_list[i].value+`</span>
            <input type="checkbox" id="checkbox_cabin`+i+`" onclick="change_filter('cabin',`+i+`)"/>
            <span class="check_box_span_custom"></span>
        </label><br/>`;
    }

    var node = document.createElement("div");
    node.innerHTML = text;
    document.getElementById("filter").appendChild(node);
    node = document.createElement("div");

    text='';
    text+=`
    <div style="margin-bottom:10px;">
        <h6 style="display: inline;">Sort by</h6>
    </div>
    <div class="drop_inline" style="width:100%;">
        <div class="dropdown-toggle div-dropdown-txt primary-btn-white" data-toggle="dropdown" style="width:100%; line-height:unset; padding:10px">
            <span type="button" style=" cursor:pointer; margin-bottom:0px !important; text-align:left;">
                <span id="sort_by_span">---Sort by---</span>
            </span>
            <ul class="dropdown-menu" role="menu" style="padding:15px;">`;
            for(i in sorting_list){
                text+=`
                <label class="radio-button-custom">
                    <span class="span-search-ticket" style="color:black;">`+sorting_list[i].value+`</span>
                    <input type="radio" id="radio_sorting`+i+`" name="radio_sorting" onclick="sorting_button('`+sorting_list[i].value+`', '`+i+`');" value="`+sorting_list[i].value+`">
                    <span class="checkmark-radio"></span>
                </label></br>`;
            }
            text+=`
            </ul>
        </div>
    </div>`;

//    for(i in sorting_list2){
//        text+=`
//        <button class="primary-btn-sorting" id="radio_sorting2`+i+`" name="radio_sorting2" onclick="sorting_button('`+sorting_list2[i].value.toLowerCase()+`')" value="`+sorting_list2[i].value+`">
//            <span id="img-sort-down-`+sorting_list2[i].value.toLowerCase()+`" style="display:block;"> `+sorting_list2[i].value+` <i class="fas fa-caret-down"></i></span>
//            <span id="img-sort-up-`+sorting_list2[i].value.toLowerCase()+`" style="display:none;"> `+sorting_list2[i].value+` <i class="fas fa-caret-up"></i></span>
//        </button>`;
//    }

    node = document.createElement("div");
    node.className = 'sorting-box';
    node.innerHTML = text;
    document.getElementById("sorting-train").appendChild(node);



    text = '';
    text+= `<h6 style="padding-bottom:10px;">Departure Time</h6>`;
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
                <input type="checkbox" id="checkbox_departure_time2`+i+`" onclick="change_filter('departure',`+i+`);"/>
                <span class="check_box_span_custom"></span>
            </label><br/>`;
    }
    var node2 = document.createElement("div");
    node2.innerHTML = text;
    document.getElementById("filter2").appendChild(node2);
    node2 = document.createElement("div");

    text=`<hr/>
    <h6 style="padding-bottom:10px;">Arrival Time</h6>`;
    for(i in arrival_list){
        if(i == 0)
            text+=`
            <label class="check_box_custom">
                <span class="span-search-ticket" style="color:black;">`+arrival_list[i].value+`</span>
                <input type="checkbox" id="checkbox_arrival_time2`+i+`" onclick="change_filter('arrival',`+i+`);" checked/>
                <span class="check_box_span_custom"></span>
            </label><br/>`;
        else
            text+=`
            <label class="check_box_custom">
                <span class="span-search-ticket" style="color:black;">`+arrival_list[i].value+`</span>
                <input type="checkbox" id="checkbox_arrival_time2`+i+`" onclick="change_filter('arrival',`+i+`);"/>
                <span class="check_box_span_custom"></span>
            </label><br/>`;
    }

    var node2 = document.createElement("div");
    node2.innerHTML = text;
    document.getElementById("filter2").appendChild(node2);
    node2 = document.createElement("div");

    text = `<hr/>
    <h6 style="padding-bottom:10px;">Class</h6>`;
    for(i in cabin_list){
        text+=`
        <label class="check_box_custom">
            <span class="span-search-ticket" style="color:black;">`+cabin_list[i].value+`</span>
            <input type="checkbox" id="checkbox_cabin2`+i+`" onclick="change_filter('cabin',`+i+`)"/>
            <span class="check_box_span_custom"></span>
        </label><br/>`;
    }

    var node2 = document.createElement("div");
    node2.innerHTML = text;
    document.getElementById("filter2").appendChild(node2);
    node2 = document.createElement("div");

    text = '';
    for(i in sorting_list){
        if(i == 0){
            text+=`
            <label class="radio-button-custom">
                <span class="span-search-ticket" style="color:black;">`+sorting_list[i].value+`</span>
                <input type="radio" checked="checked" id="radio_sorting2`+i+`" name="radio_sorting2" onclick="sorting_button('`+sorting_list[i].value+`', `+i+`)" value="`+sorting_list[i].value+`">
                <span class="checkmark-radio"></span>
            </label></br>`;
        }
        else{
            text+=`
            <label class="radio-button-custom">
                <span class="span-search-ticket" style="color:black;">`+sorting_list[i].value+`</span>
                <input type="radio" id="radio_sorting2`+i+`" name="radio_sorting2" onclick="sorting_button('`+sorting_list[i].value+`', `+i+`)" value="`+sorting_list[i].value+`">
                <span class="checkmark-radio"></span>
            </label></br>`;
        }
    }

    var node = document.createElement("div");
    node.innerHTML = text;
    document.getElementById("sorting-train2").appendChild(node);
    node = document.createElement("div");
}

function change_filter(type, value){
    var check = 0;
    if(type == 'departure'){
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
        if(value == 0)
        {
            for(i in arrival_list){
                arrival_list[i].status = false
                document.getElementById("checkbox_arrival_time"+i).checked = arrival_list[i].status;
                document.getElementById("checkbox_arrival_time2"+i).checked = arrival_list[i].status;
            }
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
    }else if(type == 'cabin'){
        cabin_list[value].status = !cabin_list[value].status;
        document.getElementById("checkbox_cabin"+value).checked = cabin_list[value].status;
        document.getElementById("checkbox_cabin2"+value).checked = cabin_list[value].status;
    }else if(type == 'price'){
        //still no
    }else if(type == 'transit'){
//        transit_list
        transit_list[value].status = !transit_list[value].status;
    }else if(type == 'transit_duration'){
//        transit_duration
        transit_duration_list[value].status = !transit_duration_list[value].status;
    }
    filtering('filter');
}

function sorting_button(value, id){
//    if(value == 'price'){
//        if(sorting_value == '' || sorting_value == 'Lowest Price'){
//            sorting_value = 'Highest Price';
//            document.getElementById("img-sort-down-price").style.display = "none";
//            document.getElementById("img-sort-up-price").style.display = "block";
//        }else{
//            sorting_value = 'Lowest Price';
//            document.getElementById("img-sort-down-price").style.display = "block";
//            document.getElementById("img-sort-up-price").style.display = "none";
//        }
//    }else if(value == 'departure'){
//        if(sorting_value == '' || sorting_value == 'Earliest Departure'){
//            sorting_value = 'Latest Departure';
//            document.getElementById("img-sort-down-departure").style.display = "none";
//            document.getElementById("img-sort-up-departure").style.display = "block";
//        }else{
//            sorting_value = 'Earliest Departure';
//            document.getElementById("img-sort-down-departure").style.display = "block";
//            document.getElementById("img-sort-up-departure").style.display = "none";
//        }
//    }else if(value == 'arrival'){
//        if(sorting_value == '' || sorting_value == 'Earliest Arrival'){
//            sorting_value = 'Latest Arrival';
//            document.getElementById("img-sort-down-arrival").style.display = "none";
//            document.getElementById("img-sort-up-arrival").style.display = "block";
//        }else{
//            sorting_value = 'Earliest Arrival';
//            document.getElementById("img-sort-down-arrival").style.display = "block";
//            document.getElementById("img-sort-up-arrival").style.display = "none";
//        }
//    }else{
//        sorting_value = value;
//    }

    sorting_value = value;
    $('#sort_by_span').text(value);
    document.getElementById('radio_sorting'+id).checked = true;
    document.getElementById('radio_sorting2'+id).checked = true;
    filtering('filter');
}

function search_train(val){
    clearTimeout(myVar);
    myVar = setTimeout(function() {
        find = '';
        if(val == 'origin'){
            find = document.getElementById('train_origin').value.toLowerCase();
            document.getElementById("train_origin_name").innerHTML = '';
        }else if(val == 'destination'){
            find = document.getElementById('train_destination').value.toLowerCase();
            document.getElementById("train_destination_name").innerHTML = '';
        }
        if(find.length>1){
            text = '';
            train_destination.forEach((obj)=> {
              if(obj[0].toString().toLowerCase().search(find) !== -1 || obj[1].toString().toLowerCase().search(find) !== -1){
                node = document.createElement("div");
                node.innerHTML = `<option value="`+obj[0]+' - '+obj[1]+' ('+obj[0]+`)">`+obj[0]+`</option>`;
                if(val == 'origin')
                    document.getElementById("train_origin_name").appendChild(node);
                else if(val == 'destination')
                    document.getElementById("train_destination_name").appendChild(node);
              }
            });
        }
    }, 500);
}

function train_pax(val){
    if(val == 'adult'){
        if(document.getElementById("train_infant").value > document.getElementById("train_adult").value){
            document.getElementById("train_infant").value = document.getElementById("train_adult").value;
        }
    }else if(val == 'infant'){
        if(document.getElementById("train_infant").value > document.getElementById("train_adult").value){
            document.getElementById("train_infant").value = document.getElementById("train_adult").value;
            alert('The number of infants cannot exceed the number of adults passengers');
        }
    }
}

function check_destination_origin(){

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

function choose_train(data,key){
    var x = document.getElementById("show-cart");
    document.getElementById("badge-copy-notif").innerHTML = 0;
    document.getElementById("badge-copy-notif2").innerHTML = 0;
    //$('#button_copy_train').hide();

    if(train_request.direction == 'OW'){
        document.getElementById('show_origin_destination').innerHTML = `<span title="`+train_request.origin[0]+` > `+train_request.destination[0]+`"><span class="copy_span"> `+train_request.origin[0].split(' - ')[1] + ` (`+train_request.origin[0].split(' - ')[0]+`) </span><i class="fas fa-arrow-right"></i><span class="copy_span"> `+train_request.destination[0].split(' - ')[1]+` (`+train_request.destination[0].split(' - ')[0]+`)</span></span>`;
    }else{
        document.getElementById('show_origin_destination').innerHTML = `<span title="`+train_request.origin[0]+` > `+train_request.destination[0]+`"><span class="copy_span"> `+train_request.origin[0].split(' - ')[1] + ` (`+train_request.origin[0].split(' - ')[0]+`) </span><i class="fas fa-arrows-alt-h"></i><span class="copy_span"> `+train_request.destination[0].split(' - ')[1]+` (`+train_request.destination[0].split(' - ')[0]+`)</span></span>`;
    }

    //ini manual
    $("#show-cart").addClass("minus");
    $(".img-plus-ticket").hide();
    $(".img-min-ticket").show();
    $('#choose-ticket-train').hide();
    $('#loading-search-train-choose').show();
//        document.getElementById("show-cart").style.display = "block";
    journeys.push(train_data[key]);
    if(journeys.length < train_request.departure.length){
        if(train_request.direction == 'RT'){
            document.getElementById('show_origin_destination').innerHTML = `<span title="`+train_request.destination[0]+` > `+train_request.origin[0]+`"><span class="copy_span"> `+train_request.destination[0].split(' - ')[1]+` (`+train_request.destination[0].split(' - ')[0]+`) </span><i class="fas fa-arrows-alt-h"></i><span class="copy_span"> `+train_request.origin[0].split(' - ')[1]+` (`+train_request.origin[0].split(' - ')[0]+`)</span></span>`;
            document.getElementById('train_div_box_choose').innerHTML = `
            <span style="font-size:14px; font-weight:bold;">
                <img style="width:auto; height:25px; border-radius:7px; background:white;" src="/static/tt_website/images/icon/product/c-train.png" alt="Train Icon">
                Return | `+train_request.destination[0].split(' - ')[1]+` (`+train_request.destination[0].split(' - ')[0]+`) <i class="fas fa-arrow-right"></i> `+train_request.origin[0].split(' - ')[1]+` (`+train_request.origin[0].split(' - ')[0]+`) | `+train_request.departure[1]+`
            </span>`;
        }

        train_request_pick++;
        reset_train_filter();
        filtering('filter');
    }else if(journeys.length == train_request.departure.length){
        document.getElementById('train_choose'+data).value = 'Chosen';
        document.getElementById('train_choose'+data).classList.remove("primary-btn-custom");
        document.getElementById('train_choose'+data).classList.add("primary-btn-custom-un");
        document.getElementById('train_choose'+data).disabled = true;
        train_get_detail();
        document.getElementById('train_ticket').innerHTML = '';
        if(train_request.direction == 'RT'){
            document.getElementById('show_origin_destination').innerHTML = `<span title="`+train_request.destination[0]+` > `+train_request.origin[0]+`"><span class="copy_span"> `+train_request.destination[0].split(' - ')[1] + ` (`+train_request.destination[0].split(' - ')[0]+`) </span><i class="fas fa-arrows-alt-h"></i><span class="copy_span"> `+train_request.origin[0].split(' - ')[1]+` (`+train_request.origin[0].split(' - ')[0]+`)</span></span>`;
            document.getElementById('train_div_box_choose').hidden = true;
        }
    }else{
        for(i in train_data){
            try{
                document.getElementById('train_choose'+train_data[i].sequence).value = 'Choose';
                document.getElementById('train_choose'+train_data[i].sequence).classList.remove("primary-btn-custom-un");
                document.getElementById('train_choose'+train_data[i].sequence).classList.add("primary-btn-custom");
                document.getElementById('train_choose'+train_data[i].sequence).disabled = false;
            }catch(err){
                console.log(err);
            }
        }
        journeys.pop(journeys.length-2);

        document.getElementById('train_choose'+data).value = 'Chosen';
        document.getElementById('train_choose'+data).classList.remove("primary-btn-custom");
        document.getElementById('train_choose'+data).classList.add("primary-btn-custom-un");
        document.getElementById('train_choose'+data).disabled = true;
        train_get_detail();
        document.getElementById('train_ticket').innerHTML = '';
    }
    change_date_next_prev(1);
    train_ticket_pick();
}

function change_train(val){
    train_request_pick = val;
    journeys.splice(val,1);
    document.getElementById("train_pick_ticket").innerHTML = '';
    document.getElementById("train_ticket").innerHTML = '';
    document.getElementById("train_detail").innerHTML = '';
    //$('#button_chart_train').hide();
    $('#loading-search-train-choose').hide();
    $('#choose-ticket-train').show();
    document.getElementById("badge-train-notif").innerHTML = "0";
    document.getElementById("badge-train-notif2").innerHTML = "0";
    document.getElementById("badge-copy-notif").innerHTML = 0;
    document.getElementById("badge-copy-notif2").innerHTML = 0;
    $('#train_result').show();

    document.getElementById('train_div_box_choose').hidden = false;
    if(val == 0){
        if(train_request.direction == 'OW'){
            document.getElementById('show_origin_destination').innerHTML = `<span title="`+train_request.origin[0]+` > `+train_request.destination[0]+`"><span class="copy_span"> `+train_request.origin[0].split(' - ')[1] + ` (`+train_request.origin[0].split(' - ')[0]+`) </span><i class="fas fa-arrow-right"></i><span class="copy_span"> `+train_request.destination[0].split(' - ')[1]+` (`+train_request.destination[0].split(' - ')[0]+`)</span></span>`;
        }
        else{
            document.getElementById('show_origin_destination').innerHTML = `<span title="`+train_request.origin[0]+` > `+train_request.destination[0]+`"><span class="copy_span"> `+train_request.origin[0].split(' - ')[1] + ` (`+train_request.origin[0].split(' - ')[0]+`) </span><i class="fas fa-arrows-alt-h"></i><span class="copy_span"> `+train_request.destination[0].split(' - ')[1]+` (`+train_request.destination[0].split(' - ')[0]+`)</span></span>`;
        }
        document.getElementById('train_div_box_choose').innerHTML = `
        <span style="font-size:14px; font-weight:bold;">
            <img style="width:auto; height:25px; border-radius:7px; background:white;" src="/static/tt_website/images/icon/product/c-train.png" alt="Train Icon">
            Departure |
            `+train_request.origin[0].split(' - ')[1] + ` (`+train_request.origin[0].split(' - ')[0]+`) <i class="fas fa-arrow-right"></i> `+train_request.destination[0].split(' - ')[1]+` (`+train_request.destination[0].split(' - ')[0]+`) | `+train_request.departure[0]+`
        </span>`;
    }else{
        if(train_request.direction == 'OW'){
            document.getElementById('show_origin_destination').innerHTML = `<span title="`+train_request.origin[0]+` > `+train_request.destination[0]+`"><span class="copy_span"> `+train_request.destination[0].split(' - ')[1] + ` (`+train_request.destination[0].split(' - ')[0]+`) </span><i class="fas fa-arrow-right"></i><span class="copy_span"> `+train_request.origin[0].split(' - ')[1]+` (`+train_request.origin[0].split(' - ')[0]+`)</span></span>`;
        }
        else{
            document.getElementById('show_origin_destination').innerHTML = `<span title="`+train_request.origin[0]+` > `+train_request.destination[0]+`"><span class="copy_span"> `+train_request.destination[0].split(' - ')[1] + ` (`+train_request.destination[0].split(' - ')[0]+`) </span><i class="fas fa-arrows-alt-h"></i><span class="copy_span"> `+train_request.origin[0].split(' - ')[1]+` (`+train_request.origin[0].split(' - ')[0]+`)</span></span>`;
        }
        document.getElementById('train_div_box_choose').innerHTML = `
        <span style="font-size:14px; font-weight:bold;">
            <img style="width:auto; height:25px; border-radius:7px; background:white;" src="/static/tt_website/images/icon/product/c-train.png" alt="Train Icon">
            Return |
            `+train_request.destination[0].split(' - ')[1] + ` (`+train_request.destination[0].split(' - ')[0]+`) <i class="fas fa-arrow-right"></i> `+train_request.origin[0].split(' - ')[1]+` (`+train_request.origin[0].split(' - ')[0]+`) | `+train_request.departure[1]+`
        </span>`;
    }

    //$('#button_copy_train').hide();
    change_date_next_prev(val);
    train_ticket_pick();
    reset_train_filter();
    filtering('filter');
}

function train_get_detail(){
    document.getElementById("badge-train-notif").innerHTML = "1";
    document.getElementById("badge-train-notif2").innerHTML = "1";
    document.getElementById('train_div_box_choose').hidden = true;
    //$('#button_chart_train').show();
    $("#badge-train-notif").addClass("infinite");
    $("#myModalTicketTrain").modal('show');
    $('#train_result').hide();
    train_detail_text = '';
    train_detail_footer = '';
    train_share = '';
    train_estimated = '';
    total_price = 0;
    total_commission = 0;
    total_tax = 0;
    total_discount = 0;
    $text = '';
    for(i in journeys){
        for(j in journeys){
            if(journeys[i].train_sequence < journeys[j].train_sequence){
                temp = {
                    'train0':journeys[i],
                    'train1':journeys[j]
                }
                journeys[i] = temp.train1;
                journeys[j] = temp.train0;
            }
        }
    }
//    train_detail_text += `
//    <div class="row">
//        <div class="col-lg-12">
//            <div class="alert alert-warning" role="alert">
//                <span style="font-weight:bold;"> Please check before going to the next page!</span>
//            </div>
//        </div>
//    </div>`;
    for(i in journeys){
        $text +=
            journeys[i].carrier_name+`- `+journeys[i].carrier_number+`(`+journeys[i].cabin_class[1]+`)\n`+
            journeys[i].origin_name+` (`+journeys[i].origin+`) - `+journeys[i].destination_name+` (`+journeys[i].destination+`) `+journeys[i].departure_date[0] + ` ` + journeys[i].departure_date[1];
        if(journeys[i].arrival_date[0] == journeys[i].departure_date[0]){
            $text +=` - `+journeys[i].arrival_date[1]+`\n\n`;
        }
        else{
            $text +=` - `+journeys[i].arrival_date[0] + ' ' + journeys[i].arrival_date[1] +`\n\n`;
        }
        train_detail_text += `
        <div style="background-color:white; box-shadow: rgb(3 18 26 / 15%) 4px -1px 10px -4px, rgb(3 18 26 / 15%) -4px -1px 10px -4px; border-radius:5px; border:1px solid #cdcdcd; margin-bottom:15px; padding:15px 15px 0px 15px;">
            <div style="background:white; padding-bottom:10px; cursor:pointer;" id="train_title_up`+i+`" onclick="show_hide_train(`+i+`);">
                <span style="font-size:14px; font-weight:bold;">
                    <img style="width:auto; height:25px; border-radius:7px; background:white;" src="/static/tt_website/images/icon/product/c-train.png" alt="Train Icon"> `;
                    if(i == 0)
                        train_detail_text += 'Departure | ';
                    else
                        train_detail_text += 'Return | ';

                train_detail_text+=journeys[i].origin_name+` (`+journeys[i].origin+`) <i class="fas fa-arrow-right"></i> `+journeys[i].destination_name+` (`+journeys[i].destination+`) | `+journeys[i].departure_date[0]+`</span>
                <i class="fas fa-chevron-up" style="float:right; font-size:18px;"></i>
            </div>
            <div style="background:white; padding-bottom:10px; cursor:pointer; display:none;" id="train_title_down`+i+`" onclick="show_hide_train(`+i+`);">
                <span style="font-size:14px; font-weight:bold;">
                    <img style="width:auto; height:25px; border-radius:7px; background:white;" src="/static/tt_website/images/icon/product/c-train.png" alt="Train Icon"> `;
                    if(i == 0)
                        train_detail_text += 'Departure | ';
                    else
                        train_detail_text += 'Return | ';

                train_detail_text+=journeys[i].origin_name+` (`+journeys[i].origin+`) <i class="fas fa-arrow-right"></i> `+journeys[i].destination_name+` (`+journeys[i].destination+`) | `+journeys[i].departure_date[0]+`</span>
                <i class="fas fa-chevron-down" style="float:right; font-size:18px;"></i>
            </div>
            <div id="train_div_sh`+i+`" style="padding-bottom:15px; padding-top:15px; display:block; border-top:1px solid #cdcdcd;">
                <div class="row">
                    <div class="col-lg-12">`;
                    if(journeys[i].hasOwnProperty('search_banner')){
                       for(banner_counter in journeys[i].search_banner){
                           var max_banner_date = moment().subtract(parseInt(-1*journeys[i].search_banner[banner_counter].minimum_days), 'days').format('YYYY-MM-DD');
                           var selected_banner_date = moment(journeys[i].departure_date[0]).format('YYYY-MM-DD');

                           if(selected_banner_date >= max_banner_date){
                               if(journeys[i].search_banner[banner_counter].active == true){
                                   train_detail_text+=`<label id="pop_search_banner_detail`+i+``+banner_counter+`" style="background:`+journeys[i].search_banner[banner_counter].banner_color+`; color:`+text_color+`;padding:5px 10px;">`+journeys[i].search_banner[banner_counter].name+`</label>`;
                               }
                           }
                       }
                    }

                    train_detail_text += `
                    </div>
                    <div class="col-lg-12">`;
        //                if(i != 0){
        //                    train_detail_text += `<hr/>`;
        //                }
                    train_detail_text += `
                        <h5>`+journeys[i].carrier_name+` - `+journeys[i].carrier_number+`</h5>
                        <span class="copy_cabin_class" style="font-weight:500; font-size:14px;">`+journeys[i].cabin_class[1]+` (`+journeys[i].class_of_service+`)</span>
                    </div>
                    <div class="col-lg-12">
                        <div class="row" style="padding-top:10px;">
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                <h6 class="copy_time_depart">`+journeys[i].departure_date[1]+`</h6>
                                <span class="copy_date_depart">`+journeys[i].departure_date[0]+`</span><br>
                                <span class="copy_departure" style="font-weight:500;">`+journeys[i].origin_name+` (`+journeys[i].origin+`)</span>
                            </div>
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                <div style="text-align:center; position: absolute; left:-10%;">
                                    <div style="display:inline-block;position:relative;width:100%;z-index:1;">
                                        <img src="/static/tt_website/images/icon/symbol/train-01.png" alt="Train" style="width:20px; height:20px; margin-top:5px; position:relative; z-index:99;">
                                        <div class="show_pc" style="height:2px;position:absolute;top:16px;width:100%;background-color:#d4d4d4;"></div>
                                        <div class="show_pc origin-code-snippet" style="background-color:#d4d4d4;right:0px"></div>
                                    </div>
                                    <span class="copy_duration" style="font-weight:500;"></span>
                                </div>
                                <div style="text-align:right">
                                    <h6 class="copy_time_arr">`+journeys[i].arrival_date[1]+`</h6>
                                    <span class="copy_date_arr">`+journeys[i].arrival_date[0]+`</span><br>
                                    <span class="copy_arrival" style="font-weight:500;">`+journeys[i].destination_name+` (`+journeys[i].destination+`)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div style="margin-bottom:15px; padding-top:15px; border-top:1px solid #cdcdcd;">
                <div class="row">`;
                    sub_total_count = 0;
                    tax = 0;
                    if(parseInt(passengers.adult) > 0){
                        total_commission += journeys[i].fares[0].service_charge_summary[0].total_commission*-1;
                        for(j in journeys[i].fares[0].service_charge_summary){
                            price = {
                                'fare': 0,
                                'tax': 0,
                                'disc': 0
                            };
                            for(k in journeys[i].fares[0].service_charge_summary[j].service_charges){
                                if(k == 0)
                                    price['currency'] = journeys[i].fares[0].service_charge_summary[j].service_charges[k].currency;
                                if(journeys[i].fares[0].service_charge_summary[j].service_charges[k].charge_type == 'FARE')
                                    price[journeys[i].fares[0].service_charge_summary[j].service_charges[k].charge_code] = journeys[i].fares[0].service_charge_summary[j].service_charges[k].amount;
                                else if(journeys[i].fares[0].service_charge_summary[j].service_charges[k].charge_type == 'DISC')
                                    price[journeys[i].fares[0].service_charge_summary[j].service_charges[k].charge_code] = journeys[i].fares[0].service_charge_summary[j].service_charges[k].total;
                                else if(journeys[i].fares[0].service_charge_summary[j].service_charges[k].charge_type == 'ROC')
                                    price['tax'] += journeys[i].fares[0].service_charge_summary[j].service_charges[k].total;
                            }
                            total_tax += price['tax'];
                            tax += price['tax'];
                            total_discount += price['disc'];

                            if(journeys[i].fares[0].service_charge_summary[j].pax_type == 'ADT')
                                total_price += price['fare'] * parseInt(passengers.adult);
                            else
                                total_price += price['fare'] * parseInt(passengers.infant);

                            if(journeys[i].fares[0].service_charge_summary[j].pax_type == 'ADT' && parseInt(passengers.adult) > 0){
                                train_detail_text+=`
                                <div class="col-lg-6 col-xs-6" style="text-align:left;">
                                    <span style="font-size:13px;">`+passengers.adult+`x Adult @ `+price['currency']+` `+getrupiah(price['fare'])+`</span>
                                </div>
                                <div class="col-lg-6 col-xs-6" style="text-align:right;">
                                    <span style="font-size:13px;">`+price['currency']+` `+getrupiah(price['fare'] * parseInt(passengers.adult))+`</span>
                                </div>`;
                                sub_total_count += price['fare'] * parseInt(passengers.adult);
                                $text += passengers.adult+`x Adult @`+price['currency']+' '+getrupiah(price['fare'] + price['tax']/passengers.adult)+`\n`;
                            }
                            // KARENA HARGA FARE INFANT FREE KALAU TIDAK FREE BARU UNCOMMENT LAGI INI
    //                        else if(parseInt(passengers.infant) > 0){
    //                            train_detail_text+=`
    //                            <div class="col-lg-6 col-xs-6" style="text-align:left;">
    //                                <span style="font-size:13px;">`+parseInt(passengers.infant)+` Infant x `+price['currency']+` `+getrupiah(0)+`</span>
    //                            </div>
    //                            <div class="col-lg-6 col-xs-6" style="text-align:right;">
    //                                <span style="font-size:13px;">Free</span>
    //                            </div>`;
    //                            sub_total_count += 0;
    //                            $text += passengers.infant+`x Infant Fare @`+price['currency']+' '+getrupiah(0)+`\n`;
    //                        }
                        }
                        // KARENA HARGA INFANT FREE JIKA ADA INFANT PRINT KALAU ADA HARGA FARE BARU NAIK KE ATAS LAGI
                        if(parseInt(passengers.infant) > 0){
                            train_detail_text+=`
                            <div class="col-lg-6 col-xs-6" style="text-align:left;">
                                <span style="font-size:13px;">`+parseInt(passengers.infant)+` Infant x `+price['currency']+` `+getrupiah(0)+`</span>
                            </div>
                            <div class="col-lg-6 col-xs-6" style="text-align:right;">
                                <span style="font-size:13px;">Free</span>
                            </div>`;
                            sub_total_count += 0;
                            $text += passengers.infant+`x Infant Fare @`+price['currency']+' '+getrupiah(0)+`\n`;
                        }
        //                $text += '1x Convenience fee '+price['currency']+' '+ getrupiah(journeys[i].fares[0].service_charge_summary[0].total_tax) + '\n\n';
                    }
                    $text += '\n';
                    train_detail_text+=`
                    <div class="col-lg-6 col-xs-6" style="text-align:left;">
                        <span style="font-size:13px;">1x Convenience fee</span>
                    </div>
                    <div class="col-lg-6 col-xs-6" style="text-align:right;">
                        <span style="font-size:13px;">`+price['currency']+` `+getrupiah(tax)+`</span>
                    </div>`;

                    sub_total_count += tax;

                    train_detail_text+=`
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                            <span style="font-size:13px; font-weight:bold;">Subtotal</span>
                        </div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                            <span style="font-size:13px; font-weight:bold;cursor:pointer;" id="sub_total_`+i+`">`+price['currency']+` `+getrupiah(sub_total_count)+`<i class="fas fa-caret-down"></i></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }


    train_detail_footer += `
    <div class="row" style="background:white;">`;
        train_share+=`
        <div class="row">
            <div class="col-lg-12">
                <div style="padding:7px 0px 15px 0px;">
                <button class="copy-btn-popup" type="button" onclick="copy_data();">
                    <i class="fas fa-copy"></i> Copy
                </button>`;

                share_data();
                var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                if (isMobile) {
                    train_share+=`
                        <a class="share-btn-popup whatsapp" href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" target="_blank"><img style="height:20px; width:auto;" src="/static/tt_website/images/logo/apps/whatsapp.png" alt="Whatsapp"/> Whatsapp</a>
                        <a class="share-btn-popup line" href="line://msg/text/`+ $text_share +`" target="_blank" title="Share by Line"><img style="height:20px; width:auto;" src="/static/tt_website/images/logo/apps/line.png" alt="Line"/> Line</a>
                        <a class="share-btn-popup telegram" href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" target="_blank"><img style="height:20px; width:auto;" src="/static/tt_website/images/logo/apps/telegram.png" alt="Telegram"/> Telegram</a>
                        <a class="share-btn-popup facebook" href="mailto:?subject=This is the train price detail&amp;body=`+ $text_share +`" title="Share by Email" target="_blank"><img style="height:20px; width:auto;" src="/static/tt_website/images/logo/apps/email.png" alt="Email"/> Email</a>`;
                } else {
                    train_share+=`
                        <a class="share-btn-popup whatsapp" href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" target="_blank"><img style="height:20px; width:auto;" src="/static/tt_website/images/logo/apps/whatsapp.png" alt="Whatsapp"/> Whatsapp</a>
                        <a class="share-btn-popup line" href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" target="_blank"><img style="height:20px; width:auto;" src="/static/tt_website/images/logo/apps/line.png" alt="Line"/> Line</a>
                        <a class="share-btn-popup telegram" href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" target="_blank"><img style="height:20px; width:auto;" src="/static/tt_website/images/logo/apps/telegram.png" alt="Telegram"/> Telegram</a>
                        <a class="share-btn-popup facebook" href="mailto:?subject=This is the train price detail&amp;body=`+ $text_share +`" title="Share by Email" target="_blank"><img style="height:20px; width:auto;" src="/static/tt_website/images/logo/apps/email.png" alt="Email"/> Email</a>`;
                }
                train_share +=`
                </div>
            </div>
        </div>`;

        train_detail_footer+=`
        <div class="col-lg-12" style="padding-bottom:10px;">
            <div class="row">
                <div class="col-lg-5" style="margin:auto;">`;
                    try{
                        if(total_discount != 0){
                            train_detail_footer += `
                            <span style="font-size:13px; font-weight:bold;"><b>Discount </b></span>
                            <span style="font-size:13px; font-weight:bold; color:#e04022; font-weight:bold; font-style: italic;">`+price['currency']+` `+getrupiah(total_discount*-1)+`</span><br>`;
                            $text += '‣ Discount: '+price['currency']+' ' +getrupiah(total_discount*-1) + '\n';
                        }
                    }catch(err){console.log(err);}

                    train_detail_footer += `
                    <b style="font-size:16px; padding-right:10px;">Grand Total </b><br/>
                    <span id="total_price" style="font-size:16px;font-weight:bold; padding-right:10px;`;
                    if(is_show_breakdown_price && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation")){
                        train_detail_footer+= "cursor:pointer;";
                    }
                    train_detail_footer+=`"><b>`+price['currency']+` `+getrupiah(total_price+total_tax+total_discount)+`</b>`;
                    if(is_show_breakdown_price && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation")){
                        train_detail_footer+= ` <i class="fas fa-caret-down"></i>`;
                    }
                    train_detail_footer+=`
                    </span>`;
                    if(typeof(currency_rate_data) !== 'undefined' && currency_rate_data.result.is_show && total_price+total_tax+total_discount){
                        if(user_login.hasOwnProperty('co_ho_seq_id') && currency_rate_data.result.response.agent.hasOwnProperty(user_login.co_ho_seq_id)){ // buat o3
                            train_detail_footer+=`<span class="span_link" id="estimated_popup" style="color:`+color+` !important;">Estimated <i class="fas fa-coins"></i></span>`;
                            for(k in currency_rate_data.result.response.agent[user_login.co_ho_seq_id]){
                                try{
                                    if(currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].base_currency == price.currency){
                                        price_convert = (Math.ceil(total_price+total_tax+total_discount)/currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].rate).toFixed(2);
                                        if(price_convert%1 == 0)
                                            price_convert = parseInt(price_convert);
                                        train_estimated+=`<span style="font-weight:bold;font-size:14px; font-style: italic; color:`+color+`;">• `+k+` `+getrupiah(price_convert)+`</span><br/>`;
                                    }
                                }catch(err){
                                    console.log(err);
                                }
                            }
                        }
                    }
                train_detail_footer+=`
                </div>
                <div class="col-lg-7" style="margin:auto;">`;
                    if(user_login.co_agent_frontend_security.includes('see_commission') && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation")){
                        train_detail_footer+= print_commission(total_commission,'show_commission', price.currency);
                    }
                train_detail_footer+=`
                </div>
            </div>
        </div>`;
        $text += '‣ Grand Total: '+ getrupiah(parseInt(total_price+total_tax+total_discount));

        train_detail_footer+=`
        <div class="col-lg-4">
            <button class="primary-btn-white" style="width:100%; margin-bottom:15px;" type="button" id="btn_share_popup">
                <i class="fas fa-share-alt"></i> Share / Copy
            </button>
        </div>`;
        if(agent_security.includes('book_reservation') == true)
        train_detail_footer+=`
        <div class="col-lg-8" style="padding-bottom:5px;">
            <button class="primary-btn-ticket next-loading next-search-train ld-ext-right" style="width:100%;" onclick="goto_passenger();" type="button" value="Next">
                Next
                <i class="fas fa-angle-right"></i>
                <div class="ld ld-ring ld-cycle"></div>
            </button>
        </div>
    </div>`;
    console.log($text);
    document.getElementById('train_detail').innerHTML = train_detail_text;
    document.getElementById('train_footer_detail').innerHTML = train_detail_footer;

    new jBox('Tooltip', {
        attach: '#estimated_popup',
        target: '#estimated_popup',
        theme: 'TooltipBorder',
        trigger: 'click',
        adjustTracker: true,
        closeOnClick: 'body',
        closeButton: 'box',
        animation: 'move',
        maxHeight: 300,
        position: {
          x: 'left',
          y: 'top'
        },
        outside: 'y',
        pointer: 'left:20',
        offset: {
          x: 25
        },
        content: train_estimated
    });

    new jBox('Tooltip', {
        attach: '#btn_share_popup',
        target: '#btn_share_popup',
        theme: 'TooltipBorder',
        trigger: 'click',
        adjustTracker: true,
        closeOnClick: 'body',
        closeButton: 'box',
        animation: 'move',
        maxHeight: 300,
        position: {
          x: 'left',
          y: 'top'
        },
        outside: 'y',
        pointer: 'left:20',
        offset: {
          x: 25
        },
        content: train_share
    });


    for(i in journeys){
        if(is_show_breakdown_price && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation")){
            var price_breakdown = {};
            var currency_breakdown = '';
            for(j in journeys[i].fares){
                price_breakdown = {};
                for(k in journeys[i].fares[j].service_charge_summary){
                    price_breakdown['FARE'] = journeys[i].fares[j].service_charge_summary[k].base_fare;
                    price_breakdown['TAX'] = journeys[i].fares[j].service_charge_summary[k].base_tax;
                    price_breakdown['BREAKDOWN'] = 0;
                    price_breakdown['CONVENIENCE FEE'] = journeys[i].fares[j].service_charge_summary[k].base_upsell;
                    if(user_login.co_agent_frontend_security.includes('see_commission') && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation"))
                        price_breakdown['COMMISSION'] = (journeys[i].fares[j].service_charge_summary[k].base_commission_vendor * -1);
                    price_breakdown['NTA TRAIN'] = journeys[i].fares[j].service_charge_summary[k].base_nta_vendor;
                    price_breakdown['SERVICE FEE'] = journeys[i].fares[j].service_charge_summary[k].base_fee_ho;
                    price_breakdown['VAT'] = journeys[i].fares[j].service_charge_summary[k].base_vat_ho;
                    price_breakdown['OTT'] = journeys[i].fares[j].service_charge_summary[k].base_price_ott;
                    price_breakdown['TOTAL PRICE'] = journeys[i].fares[j].service_charge_summary[k].base_price;
                    price_breakdown['NTA AGENT'] = journeys[i].fares[j].service_charge_summary[k].base_nta;
                    if(user_login.co_agent_frontend_security.includes('agent_ho'))
                        price_breakdown['COMMISSION HO'] = journeys[i].fares[j].service_charge_summary[k].base_commission_ho * -1;
                    if(currency_breakdown == ''){
                        for(l in journeys[i].fares[j].service_charge_summary[k].service_charges){
                            currency_breakdown = journeys[i].fares[j].service_charge_summary[k].service_charges[l].currency;
                            break;
                        }
                    }
                    break;
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
                    attach: '#sub_total_' + i,
                    target: '#sub_total_' + i,
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



            price_breakdown = {};
            for(j in journeys[i].fares){
                for(k in journeys[i].fares[j].service_charge_summary){
                    price_breakdown['FARE'] = journeys[i].fares[j].service_charge_summary[k].base_fare;
                    price_breakdown['TAX'] = journeys[i].fares[j].service_charge_summary[k].base_tax;
                    price_breakdown['BREAKDOWN'] = 0;
                    price_breakdown['CONVENIENCE FEE'] = journeys[i].fares[j].service_charge_summary[k].base_upsell;
                    if(user_login.co_agent_frontend_security.includes('see_commission') && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation"))
                        price_breakdown['COMMISSION'] = (journeys[i].fares[j].service_charge_summary[k].base_commission_vendor * -1);
                    price_breakdown['NTA TRAIN'] = journeys[i].fares[j].service_charge_summary[k].base_nta_vendor;
                    price_breakdown['SERVICE FEE'] = journeys[i].fares[j].service_charge_summary[k].base_fee_ho;
                    price_breakdown['VAT'] = journeys[i].fares[j].service_charge_summary[k].base_vat_ho;
                    price_breakdown['OTT'] = journeys[i].fares[j].service_charge_summary[k].base_price_ott;
                    price_breakdown['TOTAL PRICE'] = journeys[i].fares[j].service_charge_summary[k].base_price;
                    price_breakdown['NTA AGENT'] = journeys[i].fares[j].service_charge_summary[k].base_nta;
                    if(user_login.co_agent_frontend_security.includes('agent_ho'))
                        price_breakdown['COMMISSION HO'] = journeys[i].fares[j].service_charge_summary[k].base_commission_ho * -1;
                    break;
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

        if(journeys[i].hasOwnProperty('search_banner')){
           for(banner_counter in journeys[i].search_banner){
               var max_banner_date = moment().subtract(parseInt(-1*journeys[i].search_banner[banner_counter].minimum_days), 'days').format('YYYY-MM-DD');
               var selected_banner_date = moment(journeys[i].departure_date[0]).format('YYYY-MM-DD');

               if(selected_banner_date >= max_banner_date){
                   if(journeys[i].search_banner[banner_counter].active == true){
                       new jBox('Tooltip', {
                            attach: '#pop_search_banner_detail'+i+banner_counter,
                            theme: 'TooltipBorder',
                            width: 280,
                            position: {
                              x: 'center',
                              y: 'bottom'
                            },
                            closeOnMouseleave: true,
                            animation: 'zoomIn',
                            content: journeys[i].search_banner[banner_counter].description
                       });
                   }
               }
           }
        }
    }
}

function goto_passenger(){
    show_loading();
    document.getElementById('train_detail').innerHTML +=
        `<input type="hidden" id="response" name="response"
        value='`+JSON.stringify(journeys)+`'>
        <input type="hidden" id="time_limit_input" name="time_limit_input" value="`+time_limit+`" />`;
    document.getElementById('train_passenger').action = '/train/passenger/'+signature;
    document.getElementById('train_passenger').submit();
}

function train_detail(){
    modal_content_arr = [];

    if(document.URL.split('/')[document.URL.split('/').length-2] == 'review'){
        tax = 0;
        fare = 0;
        total_price = 0;
        total_price_provider = [];
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
        //repricing
        total_price_provider = [];
        for(i in train_data){
            provider_price = {
                'fare': 0,
                'tax': 0,
                'currency': '',
                'rac': 0,
                'roc': 0
            };

            for(j in train_data[i].fares){
                for(k in train_data[i].fares[j].service_charge_summary){
                    for(l in train_data[i].fares[j].service_charge_summary[k].service_charges){
                        if(train_data[i].fares[j].service_charge_summary[k].service_charges[l].charge_type.toLowerCase() == 'fare') //harga per pax hanya fare karena yg lain pax count bisa beda
                            provider_price['fare'] = train_data[i].fares[j].service_charge_summary[k].service_charges[l].total;
                        else if(train_data[i].fares[j].service_charge_summary[k].service_charges[l].charge_type.toLowerCase() == 'tax' || train_data[i].fares[j].service_charge_summary[k].service_charges[l].charge_type.toLowerCase() == 'roc')
                            provider_price['tax'] += train_data[i].fares[j].service_charge_summary[k].service_charges[l].total;
                        else if(train_data[i].fares[j].service_charge_summary[k].service_charges[l].charge_type.toLowerCase() == 'rac')
                            provider_price['rac'] += train_data[i].fares[j].service_charge_summary[k].service_charges[l].total;
                        if(provider_price['currency'] != '')
                            provider_price['currency'] += train_data[i].fares[j].service_charge_summary[k].service_charges[l].currency;
                    }
//                    provider_price['fare'] = train_data[i].fares[j].service_charge_summary[k].total_fare;
//                    provider_price['tax'] = train_data[i].fares[j].service_charge_summary[k].total_tax + train_data[i].fares[j].service_charge_summary[k].total_upsell;
//                    provider_price['rac'] = train_data[i].fares[j].service_charge_summary[k].total_commission;
//                    if(provider_price['currency'] != '')
//                        provider_price['currency'] = train_data[i].fares[j].service_charge_summary[k].service_charges[0].currency;
                }
            }
            total_price_provider.push({
                'provider': train_data[i].provider,
                'price': provider_price
            });
        }
    }
    total_price = 0;
    total_commission = 0;
    total_tax = 0;
    text = '';
    $text = '';
    text+=`
    <div class="row" style:"background-color:white;">
        <div class="col-lg-12 mb-3" style="border-bottom:1px solid #cdcdcd;">
            <h4 class="mb-3">Price Detail</h4>
        </div>
        <div class="col-lg-12">`;

    for(i in train_data){
        $text +=
            train_data[i].carrier_name+`-`+train_data[i].carrier_number+`(`+train_data[i].cabin_class[1]+`)\n`+
            train_data[i].origin_name+` (`+train_data[i].origin+`) - `+train_data[i].destination_name+` (`+train_data[i].destination+`) `;
        $text += train_data[i].departure_date[0]+' ' + train_data[i].departure_date[1]+ ` - `;
        if(train_data[i].departure_date[0] != train_data[i].arrival_date[0])
            $text += train_data[i].arrival_date[0] + ' ' + train_data[i].arrival_date[1]+`\n\n`;
        else
            $text += train_data[i].arrival_date[1]+`\n\n`;

        text_modal_content = '';
        text_modal_content += `
        <div class="row">
            <div class="col-lg-12">
                <div class="row">
                    <div class="col-lg-12">`;
                    if(train_data[i].hasOwnProperty('search_banner')){
                       for(banner_counter in train_data[i].search_banner){
                           var max_banner_date = moment().subtract(parseInt(-1*train_data[i].search_banner[banner_counter].minimum_days), 'days').format('YYYY-MM-DD');
                           var selected_banner_date = moment(train_data[i].departure_date[0]).format('YYYY-MM-DD');

                           if(selected_banner_date >= max_banner_date){
                               if(train_data[i].search_banner[banner_counter].active == true){
                                   text_modal_content+=`<label id="pop_search_banner`+i+``+banner_counter+`" style="background:`+train_data[i].search_banner[banner_counter].banner_color+`; color:`+text_color+`;padding:5px 10px;">`+train_data[i].search_banner[banner_counter].name+`</label>`;
                               }
                           }
                       }
                    }
                    text_modal_content+=`
                    </div>
                    <div class="col-lg-12" style="padding-top:5px;">
                        <h5>
                            `+train_data[i].carrier_name+` `+train_data[i].carrier_number+`
                        </h5>
                        <span>
                            `+train_data[i].cabin_class[1]+` (`+train_data[i].class_of_service+`)
                        </span>
                        <div class="row" style="padding-top:10px;">
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                <h6 class="copy_time_depart">`+train_data[i].departure_date[1]+`</h6>
                                <span class="copy_date_depart">`+train_data[i].departure_date[0]+`</span><br>
                                <span class="copy_departure" style="font-weight:500;">`+train_data[i].origin_name+` (`+train_data[i].origin+`)</span><br>
                            </div>
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                <div style="text-align:center; position: absolute; left:-20%;">
                                    <div style="display:inline-block;position:relative;width:100%;z-index:1;">
                                        <img src="/static/tt_website/images/icon/symbol/train-01.png" alt="Train" style="width:20px; height:20px; margin-top:5px; position:relative; z-index:99;">
                                        <div class="show_pc" style="height:2px;position:absolute;top:16px;width:100%;background-color:#d4d4d4;"></div>
                                        <div class="show_pc origin-code-snippet" style="background-color:#d4d4d4;right:0px"></div>
                                    </div>
                                    <span style="font-weight:500;">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</span>
                                </div>
                                <div style="text-align:right">
                                    <h6>`+train_data[i].arrival_date[1]+`</h6>
                                    <span>`+train_data[i].arrival_date[0]+`</span><br>
                                    <span style="font-weight:500;">`+train_data[i].destination_name+` (`+train_data[i].destination+`)</span><br>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

        modal_content_arr.push(text_modal_content);

        text+=`
        <div class="row">
            <div class="col-lg-12">
                <div class="span_link" style="display:inline-flex; margin-top:10px;" onclick="content_modal_custom('myModalDetail','myModalContent', 'Detail', modal_content_arr[`+parseInt(i)+`]);">
                    <div>`;
                        if(i == 0){
                            text += `Departure`;
                        }else{
                            text += `Return`;
                        }

                        text+=`<br/>`+train_data[i].origin;
                        text+=` <i class="fas fa-arrow-right"></i> `;
                        text+=train_data[i].destination+`,
                        `+train_data[i].departure_date[0]+`
                        <span style="font-weight:bold; color:`+color+`; cursor:pointer;"> Detail</span>
                    </div>
                </div>
            </div>`;


        price = {
            'fare': 0,
            'tax': 0,
            'currency': ''
        };
        for(j in train_data[i].fares){
            for(k in train_data[i].fares[j].service_charge_summary){
                for(l in train_data[i].fares[j].service_charge_summary[k].service_charges){
                    if(train_data[i].fares[j].service_charge_summary[k].service_charges[l].charge_type == 'FARE')
                        price['fare'] += train_data[i].fares[j].service_charge_summary[k].service_charges[l].amount;
                    else if(['TAX', 'ROC'].includes(train_data[i].fares[j].service_charge_summary[k].service_charges[l].charge_type))
                        price['tax'] += train_data[i].fares[j].service_charge_summary[k].service_charges[l].total;
                    else if(train_data[i].fares[j].service_charge_summary[k].service_charges[l].charge_type == 'RAC' && train_data[i].fares[j].service_charge_summary[k].service_charges[l].charge_code == 'rac')
                        total_commission += train_data[i].fares[j].service_charge_summary[k].service_charges[l].total * -1;
                    if(!price['currency'])
                        price['currency'] = train_data[i].fares[j].service_charge_summary[k].service_charges[l].currency;
                }
//                for(l in train_data[i].fares[j].service_charge_summary[k].service_charges){
//                    if(l == 0)
//                        price['currency'] = train_data[i].fares[j].service_charge_summary[k].service_charges[l].currency;
//                    break;
//                }
//                total_tax += train_data[i].fares[j].service_charge_summary[k].total_tax + train_data[i].fares[j].service_charge_summary[k].total_upsell;
//                total_commission += train_data[i].fares[j].service_charge_summary[k].total_commission*-1;
                total_tax += price['tax'];
                if(train_data[i].fares[j].service_charge_summary[k].pax_type == 'ADT')
                    total_price += price['fare'] * parseInt(adult);
                else
                    total_price += price['fare'] * parseInt(infant);
                if(train_data[i].fares[j].service_charge_summary[k].pax_type == 'ADT' && parseInt(adult) > 0){
                    if(typeof upsell_price_dict !== 'undefined' && upsell_price_dict.hasOwnProperty('adult')){
                        text+=`
                            <div class="col-lg-6 col-xs-6" style="text-align:left;">
                                <span style="font-size:13px;">`+parseInt(adult)+`x Adult @ `+price['currency']+` `+getrupiah(price['fare'] + (upsell_price_dict['adult']/parseInt(adult)))+`</span>
                            </div>
                            <div class="col-lg-6 col-xs-6" style="text-align:right;">
                                <span style="font-size:13px;">`+price['currency']+` `+getrupiah((price['fare'] * parseInt(adult)) + upsell_price_dict['adult'])+`</span>
                            </div>`;
                        $text += adult+`x Adult @`+price['currency']+' '+getrupiah(price['fare'] + (total_tax/adult) + (upsell_price_dict['adult']/parseInt(adult)))+`\n`;
                        total_commission += upsell_price_dict['adult']
                    }else{
                        text+=`
                            <div class="col-lg-6 col-xs-6" style="text-align:left;">
                                <span style="font-size:13px;">`+parseInt(adult)+`x Adult @ `+price['currency']+` `+getrupiah(price['fare'])+`</span>
                            </div>
                            <div class="col-lg-6 col-xs-6" style="text-align:right;">
                                <span style="font-size:13px;">`+price['currency']+` `+getrupiah(price['fare'] * parseInt(adult))+`</span>
                            </div>`;
                        $text += adult+`x Adult @`+price['currency']+' '+getrupiah(price['fare'] + (total_tax/adult))+`\n`;
                    }
                }
            }
        }
        if(parseInt(infant) > 0){
            if(typeof upsell_price_dict !== 'undefined' && upsell_price_dict.hasOwnProperty('infant')){
                text+=`
                    <div class="col-lg-6 col-xs-6" style="text-align:left;">
                        <span style="font-size:13px;">`+parseInt(infant)+` Infant x `+price['currency']+` `+getrupiah(0 + upsell_price_dict['infant']/parseInt(infant))+`</span>
                    </div>
                    <div class="col-lg-6 col-xs-6" style="text-align:right;">
                        <span style="font-size:13px;">`+price['currency']+` `+getrupiah(0 + upsell_price_dict['infant'])+`</span>
                    </div>`;
                $text += infant+`x Infant @`+price['currency']+' '+getrupiah(0 + upsell_price_dict['infant']/parseInt(infant))+`\n`;
                total_commission += upsell_price_dict['infant']
            }else{
                text+=`
                    <div class="col-lg-6 col-xs-6" style="text-align:left;">
                        <span style="font-size:13px;">`+parseInt(infant)+` Infant Free</span>
                    </div>
                    <div class="col-lg-6 col-xs-6" style="text-align:right;">
                        <span style="font-size:13px;">Free</span>
                    </div>`;
                $text += infant+`x Infant @`+price['currency']+' '+getrupiah(0)+`\n`;
            }
        }
        $text += '\n';
        text+=`
            <div class="col-lg-6 col-xs-6" style="text-align:left;">
                <span style="font-size:13px;">1x Convenience fee</span>
            </div>
            <div class="col-lg-6 col-xs-6" style="text-align:right;">
                <span style="font-size:13px;">`+price['currency']+` `+getrupiah(price['tax'])+`</span>
            </div>
            <div class="col-lg-12">
                <hr/>
            </div>
        </div>`;
    }
    grand_total_price = total_price + total_tax;
    try{
        // upsell pindah ke pax
//        if(upsell_price != 0){
//            text+=`<div class="row"><div class="col-lg-7" style="text-align:left;">
//                <span style="font-size:13px;font-weight:500;">Other Service Charge</span><br/>
//            </div>
//            <div class="col-lg-5" style="text-align:right;">`;
//            if(price['currency'] == 'IDR')
//            text+=`
//                <span style="font-size:13px; font-weight:500;">`+price['currency']+` `+getrupiah(upsell_price)+`</span><br/>`;
//            else
//            text+=`
//                <span style="font-size:13px; font-weight:500;">`+price['currency']+` `+upsell_price+`</span><br/>`;
//            text+=`</div></div>`;
//            grand_total_price += upsell_price;
//        }
        for(i in upsell_price_dict)
            grand_total_price += upsell_price_dict[i];
    }catch(err){
        console.log(err); // error kalau ada element yg tidak ada
    }
    text+=`
    <div class="row" style="margin-bottom:5px;">
        <div class="col-lg-6 col-xs-6" style="text-align:left;">
            <span style="font-size:13px;"><b>Total</b></span><br>
        </div>
        <div class="col-lg-6 col-xs-6" style="text-align:right;">
            <span id="total_price" style="font-size:13px;`;
    if(is_show_breakdown_price && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation")){
        text+= "cursor:pointer;";
    }
    text+=`"><b>`+price['currency']+` `+getrupiah(grand_total_price)+`</b>`;
    if(is_show_breakdown_price && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation")){
        text+= ` <i class="fas fa-caret-down"></i>`;
    }
    text+=`</span><br>
        </div>
    </div>`;

    if(typeof(currency_rate_data) !== 'undefined' && currency_rate_data.result.is_show && grand_total_price){
        if(user_login.hasOwnProperty('co_ho_seq_id') && currency_rate_data.result.response.agent.hasOwnProperty(user_login.co_ho_seq_id)){ // buat o3
            for(k in currency_rate_data.result.response.agent[user_login.co_ho_seq_id]){
                try{
                    if(currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].base_currency == price.currency){
                        price_convert = (grand_total_price/currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].rate).toFixed(2);
                        if(price_convert%1 == 0)
                            price_convert = parseInt(price_convert);
                        text+=`
                            <div class="row" style="margin-bottom:5px;">
                                <div class="col-lg-12 col-xs-12" style="text-align:right;">
                                    <span style="font-size:13px;"><b> Estimated `+k+` `+price_convert+`</b></span>
                                </div>
                            </div>`;
                    }
                }catch(err){
                    console.log(err);
                }
            }
        }
    }

    if(document.URL.split('/')[document.URL.split('/').length-2] == 'review' && user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false){
        text+=`<div class="mb-3" style="text-align:right;"><img src="/static/tt_website/images/icon/symbol/upsell_price.png" alt="Bank" style="width:auto; height:25px; cursor:pointer;" onclick="show_repricing();"/></div>`;
    }
    if(user_login.co_agent_frontend_security.includes('see_commission') && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation"))
        text+= print_commission(total_commission,'show_commission', price.currency)
//    $text += '1x Convenience fee '+price['currency']+' '+ getrupiah(total_tax) + '\n\n';
    try{

        if(document.URL.split('/')[document.URL.split('/').length-2] == 'review' && user_login.co_agent_frontend_security.includes('b2c_limitation') == false){

            $text += 'Contact Person:\n';
            $text += passenger_with_booker.contact[0].title + ' ' + passenger_with_booker.contact[0].first_name + ' ' + passenger_with_booker.contact[0].last_name + '\n';
            $text += passenger_with_booker.contact[0].email + '\n';
            $text += passenger_with_booker.contact[0].calling_code + ' - ' +passenger_with_booker.contact[0].mobile + '\n\n';


            $text += 'Passengers\n';
            for(i in passengers){
                if(i != 'booker' && i != 'contact')
                {
                    for(j in passengers[i]){
                        if(passengers[i][j].hasOwnProperty('identity_first_name') && passengers[i][j].identity_first_name != '' && passengers[i][j].identity_first_name != undefined && passengers[i][j].identity_first_name != false)
                            $text += passengers[i][j].title + ' ' + passengers[i][j].identity_first_name + ' ' + passengers[i][j].identity_last_name + '\n';
                        else
                            $text += passengers[i][j].title + ' ' + passengers[i][j].first_name + ' ' + passengers[i][j].last_name + '\n';
                    }
                }
            }
            $text += '\n';
        }
    }catch(err){

    }

    $text += 'Grand Total: '+ getrupiah(parseInt(grand_total_price));
    text+=`
    <div class="row">
        <div class="col-lg-12" style="padding-bottom:10px;">
            <span style="font-size:14px; font-weight:bold;"><i class="fas fa-share-alt"></i> Share This on:</span><br/>`;
            share_data();
            var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            if (isMobile) {
                text+=`
                    <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/whatsapp.png" alt="Whatsapp"/></a>
                    <a href="line://msg/text/`+ $text_share +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/line.png" alt="Line"/></a>
                    <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/telegram.png" alt="Telegram"/></a>
                    <a href="mailto:?subject=This is the train price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/email.png" alt="Email"/></a>`;
            } else {
                text+=`
                    <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/whatsapp.png" alt="Whatsapp"/></a>
                    <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/line.png" alt="Line"/></a>
                    <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/telegram.png" alt="Telegram"/></a>
                    <a href="mailto:?subject=This is the train price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/email.png" alt="Email"/></a>`;
            }
    text+=`
        </div>
    </div>

    <div class="row">
        <div class="col-lg-12" style="padding-bottom:10px;">
            <input class="primary-btn-white" style="width:100%;" type="button" onclick="copy_data();" value="Copy" >
        </div>`;
//        if(user_login.co_agent_frontend_security.includes('see_commission') == true && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
//            text+=`
//            <div class="col-lg-12" style="padding-bottom:5px;">
//                <input class="primary-btn-white" id="show_commission_button" style="width:100%;" type="button" onclick="show_commission();" value="Show YPM"><br/>
//            </div>`;
        text+=`
    </div>`;

    document.getElementById('train_detail').innerHTML = text;
    var price_breakdown = {};
    var currency_breakdown = '';
    for(i in train_data){
        if(is_show_breakdown_price && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation")){
            for(j in train_data[i].fares){
                for(k in train_data[i].fares[j].service_charge_summary){
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
                    if(!price_breakdown.hasOwnProperty('COMMISSION HO'))
                        price_breakdown['COMMISSION HO'] = 0;
                    price_breakdown['FARE'] += train_data[i].fares[j].service_charge_summary[k].base_fare;
                    price_breakdown['TAX'] += train_data[i].fares[j].service_charge_summary[k].base_tax;
                    price_breakdown['BREAKDOWN'] = 0;
                    price_breakdown['CONVENIENCE FEE'] += train_data[i].fares[j].service_charge_summary[k].base_upsell;
                    if(user_login.co_agent_frontend_security.includes('see_commission') && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation"))
                        price_breakdown['COMMISSION'] += (train_data[i].fares[j].service_charge_summary[k].base_commission_vendor * -1);
                    price_breakdown['NTA TRAIN'] += train_data[i].fares[j].service_charge_summary[k].base_nta_vendor;
                    price_breakdown['SERVICE FEE'] += train_data[i].fares[j].service_charge_summary[k].base_fee_ho;
                    price_breakdown['VAT'] += train_data[i].fares[j].service_charge_summary[k].base_vat_ho;
                    price_breakdown['OTT'] += train_data[i].fares[j].service_charge_summary[k].base_price_ott;
                    price_breakdown['TOTAL PRICE'] += train_data[i].fares[j].service_charge_summary[k].base_price;
                    price_breakdown['NTA AGENT'] += train_data[i].fares[j].service_charge_summary[k].base_nta;
                    if(user_login.co_agent_frontend_security.includes('agent_ho'))
                        price_breakdown['COMMISSION HO'] += train_data[i].fares[j].service_charge_summary[k].base_commission_ho * -1;

                    if(currency_breakdown == ''){
                        for(l in train_data[i].fares[j].service_charge_summary[k].service_charges){
                            currency_breakdown = train_data[i].fares[j].service_charge_summary[k].service_charges[l].currency;
                            break;
                        }
                    }
                    break;
                }
            }
        }
        if(train_data[i].hasOwnProperty('search_banner')){
           for(banner_counter in train_data[i].search_banner){
               var max_banner_date = moment().subtract(parseInt(-1*train_data[i].search_banner[banner_counter].minimum_days), 'days').format('YYYY-MM-DD');
               var selected_banner_date = moment(train_data[i].departure_date[0]).format('YYYY-MM-DD');

               if(selected_banner_date >= max_banner_date){
                   if(train_data[i].search_banner[banner_counter].active == true){
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
                            content: train_data[i].search_banner[banner_counter].description
                       });
                   }
               }
           }
        }
    }
    if(typeof upsell_price_dict !== 'undefined'){
        for(i in upsell_price_dict){
            if(!price_breakdown.hasOwnProperty('CHANNEL UPSELL'))
                price_breakdown['CHANNEL UPSELL'] = 0;
            price_breakdown['CHANNEL UPSELL'] += upsell_price_dict[i];
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
    if(is_show_breakdown_price && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation")){
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

function copy_data(){
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

}

function show_commission(val){
    var sc = '';
    var scs = '';
    if(val == 'show_commission_new'){
        sc = document.getElementById("show_commission_new");
        scs = document.getElementById("show_commission_new_button");
    }else if(val == 'show_commission'){
        var sc = document.getElementById("show_commission");
        var scs = document.getElementById("show_commission_button");
    }else{
        sc = document.getElementById("show_commission_old");
        scs = document.getElementById("show_commission_old_button");
    }
    if (sc.style.display === "none"){
        sc.style.display = "inline";
        scs.innerHTML = `<span style="float:right;">hide <i class="fas fa-eye-slash"></i></span>`;
    }
    else{
        sc.style.display = "none";
        scs.innerHTML = `<span style="float:right;">show <i class="fas fa-eye"></i></span>`;
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

function check_passenger(adult, infant){
    //booker
    error_log = '';
    //check booker jika teropong
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
    length_name = 100;
    for(i in train_response){
        if(train_carriers[train_response[i].carrier_code].adult_length_name < length_name)
            length_name = train_carriers[train_response[i].carrier_code].adult_length_name;
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
        error_log+= 'Please choose booker title!</br>\n';
        $("#booker_title").each(function() {
            $(this).parent().find('.nice-select').css('border', '1px solid red');
        });
    }else{
        $("#booker_title").each(function() {
            $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
        });
    }if(document.getElementById('booker_first_name').value == '' || check_word(document.getElementById('booker_first_name').value) == false){
        if(document.getElementById('booker_first_name').value == '')
            error_log+= 'Please fill booker first name!</br>\n';
        else if(check_word(document.getElementById('booker_first_name').value) == false)
            error_log+= 'Please use alpha characters for booker first name!</br>\n';
        document.getElementById('booker_first_name').style['border-color'] = 'red';
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
       }if(document.getElementById('adult_first_name'+i).value == '' || check_word(document.getElementById('adult_first_name'+i).value) == false){
           if(document.getElementById('adult_first_name'+i).value == '')
               error_log+= 'Please input first name of adult passenger '+i+'!</br>\n';
           else if(check_word(document.getElementById('adult_first_name'+i).value) == false)
               error_log+= 'Please use alpha characters first name of adult passenger '+i+'!</br>\n';
           document.getElementById('adult_first_name'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('adult_first_name'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('adult_last_name'+i).value != ''){
           if(check_word(document.getElementById('adult_last_name'+i).value) == false){
               error_log+= 'Please use alpha characters last name of adult passenger '+i+'!</br>\n';
               document.getElementById('adult_last_name'+i).style['border-color'] = 'red';
           }
       }else{
           document.getElementById('adult_last_name'+i).style['border-color'] = '#EFEFEF';
       }if(birth_date_required == true){
           if(check_date(document.getElementById('adult_birth_date'+i).value)==false){
               error_log+= 'Birth date wrong for passenger adult '+i+'!</br>\n';
               document.getElementById('adult_birth_date'+i).style['border-color'] = 'red';
           }else{
               document.getElementById('adult_birth_date'+i).style['border-color'] = '#EFEFEF';
           }
       }if(document.getElementById('adult_nationality'+i+'_id').value == ''){
           error_log+= 'Please fill nationality for passenger adult '+i+'!</br>\n';
           document.getElementById('adult_nationality'+i+'_id').style['border-color'] = 'red';
       }else{
           document.getElementById('adult_nationality'+i+'_id').style['border-color'] = '#EFEFEF';
       }
       if(document.getElementById('adult_id_type'+i).value == ''){
           error_log+= 'Please fill id type for passenger adult '+i+'!</br>\n';
           document.getElementById('adult_id_type'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('adult_id_type'+i).style['border-color'] = '#EFEFEF';
           if(document.getElementById('adult_identity_first_name'+i).value != '')
           {
                if(check_name(document.getElementById('adult_title'+i).value,
                    document.getElementById('adult_identity_first_name'+i).value,
                    document.getElementById('adult_identity_last_name'+i).value,
                    length_name) == false){
                   error_log+= 'Total of adult '+i+' identity name maximum '+length_name+' characters!</br>\n';
                   document.getElementById('adult_identity_first_name'+i).style['border-color'] = 'red';
                   document.getElementById('adult_identity_last_name'+i).style['border-color'] = 'red';
                }else if(check_word(document.getElementById('adult_identity_first_name'+i).value) == false){
                   error_log+= 'Please use alpha characters identity first name of adult passenger '+i+'!</br>\n';
                   document.getElementById('adult_identity_first_name'+i).style['border-color'] = 'red';
                }else if(document.getElementById('adult_identity_last_name'+i).value != '' && check_word(document.getElementById('adult_identity_last_name'+i).value) == false){
                   error_log+= 'Please use alpha characters identity last name of adult passenger '+i+'!</br>\n';
                   document.getElementById('adult_identity_last_name'+i).style['border-color'] = 'red';
                }else{
                   document.getElementById('adult_identity_first_name'+i).style['border-color'] = '#EFEFEF';
                   document.getElementById('adult_identity_first_name'+i).style['border-color'] = '#EFEFEF';
                }
           }
           if(document.getElementById('adult_id_type'+i).value == 'ktp'){
               document.getElementById('adult_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
               if(document.getElementById('adult_id_type'+i).value == 'ktp' && check_ktp(document.getElementById('adult_passport_number'+i).value) == false){
                   error_log+= 'Please fill id number, ktp only contain 16 digits for passenger adult '+i+'!</br>\n';
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
           if(document.getElementById('adult_id_type'+i).value == 'sim'){
               if(document.getElementById('adult_id_type'+i).value == 'sim' && check_sim(document.getElementById('adult_passport_number'+i).value) == false){
                   error_log+= 'Please fill id number, sim only contain 12 - 13 digits for passenger adult '+i+'!</br>\n';
                   document.getElementById('adult_passport_number'+i).style['border-color'] = 'red';
               }else{
                   document.getElementById('adult_passport_number'+i).style['border-color'] = '#EFEFEF';
               }if(document.getElementById('adult_passport_expired_date'+i).value == ''){
                   error_log+= 'Please fill passport expired date for passenger adult '+i+'!</br>\n';
                   document.getElementById('adult_passport_expired_date'+i).style['border-color'] = 'red';
               }else{
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

           if(document.getElementById('adult_id_type'+i).value == 'other'){
               if(document.getElementById('adult_passport_number'+i).value.length < 6){
                   error_log+= 'Please fill id number for passenger adult '+i+'!</br>\n';
                   document.getElementById('adult_passport_number'+i).style['border-color'] = 'red';
               }else{
                   document.getElementById('adult_passport_number'+i).style['border-color'] = '#EFEFEF';
               }
               if(document.getElementById('adult_passport_expired_date'+i).value == ''){
                   error_log+= 'Please fill passport expired date for passenger adult '+i+'!</br>\n';
                   document.getElementById('adult_passport_expired_date'+i).style['border-color'] = 'red';
               }else{
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
   }

   length_name = 100;
    for(i in train_response){
        if(train_carriers[train_response[i].carrier_code].infant_length_name < length_name)
            length_name = train_carriers[train_response[i].carrier_code].infant_length_name;
    }
   //infant
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
       }if(document.getElementById('infant_last_name'+i).value != ''){
           if(check_word(document.getElementById('infant_last_name'+i).value) == false){
               error_log+= 'Please use alpha characters last name of infant passenger '+i+'!</br>\n';
               document.getElementById('infant_last_name'+i).style['border-color'] = 'red';
           }
       }else{
           document.getElementById('infant_last_name'+i).style['border-color'] = '#EFEFEF';
       }
       if(check_date(document.getElementById('infant_birth_date'+i).value)==false){
           error_log+= 'Birth date wrong for passenger infant '+i+'!</br>\n';
           document.getElementById('infant_birth_date'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('infant_birth_date'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('infant_nationality'+i+'_id').value == ''){
           error_log+= 'Please fill nationality for passenger infant '+i+'!</br>\n';
           document.getElementById('infant_nationality'+i+'_id').style['border-color'] = 'red';
       }else{
           document.getElementById('infant_nationality'+i+'_id').style['border-color'] = '#EFEFEF';
       }

       if(document.getElementById('infant_id_type'+i).value == ''){
           error_log+= 'Please fill id type for passenger infant '+i+'!</br>\n';
           document.getElementById('infant_id_type'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('infant_id_type'+i).style['border-color'] = '#EFEFEF';
           if(document.getElementById('infant_identity_first_name'+i).value != '')
           {
                if(check_name(document.getElementById('infant_title'+i).value,
                    document.getElementById('infant_identity_first_name'+i).value,
                    document.getElementById('infant_identity_last_name'+i).value,
                    length_name) == false){
                   error_log+= 'Total of infant '+i+' identity name maximum '+length_name+' characters!</br>\n';
                   document.getElementById('infant_identity_first_name'+i).style['border-color'] = 'red';
                   document.getElementById('infant_identity_last_name'+i).style['border-color'] = 'red';
                }else if(check_word(document.getElementById('infant_identity_first_name'+i).value) == false){
                   error_log+= 'Please use alpha characters identity first name of infant passenger '+i+'!</br>\n';
                   document.getElementById('infant_identity_first_name'+i).style['border-color'] = 'red';
                }else if(document.getElementById('infant_identity_last_name'+i).value != '' && check_word(document.getElementById('infant_identity_last_name'+i).value) == false){
                   error_log+= 'Please use alpha characters identity last name of infant passenger '+i+'!</br>\n';
                   document.getElementById('infant_identity_last_name'+i).style['border-color'] = 'red';
                }else{
                   document.getElementById('infant_identity_first_name'+i).style['border-color'] = '#EFEFEF';
                   document.getElementById('infant_identity_first_name'+i).style['border-color'] = '#EFEFEF';
                }
           }
           if(document.getElementById('infant_id_type'+i).value == 'ktp'){
               if(document.getElementById('infant_id_type'+i).value == 'ktp' && check_ktp(document.getElementById('infant_passport_number'+i).value) == false){
                   error_log+= 'Please fill id number, ktp only contain 16 digits for passenger infant '+i+'!</br>\n';
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

           if(document.getElementById('infant_id_type'+i).value == 'sim'){
               if(document.getElementById('infant_id_type'+i).value == 'sim' && check_sim(document.getElementById('infant_passport_number'+i).value) == false){
                   error_log+= 'Please fill id number, sim only contain 12 - 13 digits for passenger infant '+i+'!</br>\n';
                   document.getElementById('infant_passport_number'+i).style['border-color'] = 'red';
               }else{
                   document.getElementById('infant_passport_number'+i).style['border-color'] = '#EFEFEF';
               }if(document.getElementById('infant_country_of_issued'+i+'_id').value == ''){
                   error_log+= 'Please fill country of issued for passenger infant '+i+'!</br>\n';
                   $("#infant_country_of_issued"+i+"_id").each(function() {
                     $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                   });
                   document.getElementById('infant_country_of_issued'+i+'_id').style['border-color'] = 'red';
               }else{
                   document.getElementById('infant_country_of_issued'+i+'_id').style['border-color'] = '#EFEFEF';
               }
           }

           if(document.getElementById('infant_id_type'+i).value == 'passport'){
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
           if(document.getElementById('infant_id_type'+i).value == 'other' && document.getElementById('infant_passport_number'+i).value.length < 6){
               error_log+= 'Please fill id number for passenger infant '+i+'!</br>\n';
               document.getElementById('infant_passport_number'+i).style['border-color'] = 'red';
           }else{
               document.getElementById('infant_passport_number'+i).style['border-color'] = '#EFEFEF';
           }
       }

   }
   if(error_log==''){
       document.getElementById('booker_nationality_id').disabled = false;
       for(i=1;i<=adult;i++){
                document.getElementById('adult_birth_date'+i).disabled = false;
                document.getElementById('adult_nationality'+i + '_id').disabled = false;
//                document.getElementById('adult_passport_expired_date'+i).disabled = false;
       }
       for(i=1;i<=infant;i++){
            document.getElementById('infant_birth_date'+i).disabled = false;
            document.getElementById('infant_nationality'+i + '_id').disabled = false;
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

function plusSlides(n, no) {
  showSlides(slideIndex[no] += n, no);
  document.getElementById('seat_map_wagon_pick').value = slideIndex[0] - 1;
  $('#seat_map_wagon_pick').niceSelect('update');
}

function showSlides(n, no) {
  var i;
  var x = document.getElementsByClassName(slideId[no]);
  if (n > x.length) {slideIndex[no] = 1}
  if (n < 1) {slideIndex[no] = x.length}
  for (i = 0; i < x.length; i++) {
     x[i].style.display = "none";
  }
  x[slideIndex[no]-1].style.display = "block";
  wagon = slideIndex[no]-1;
}

function select_passenger(val){
    if(pax_click > 0){
        document.getElementById('passenger'+pax_click).style.background = 'white';
        document.getElementById('passenger'+pax_click).style.color = 'black';
    }
    document.getElementById('passenger'+val).style.background = color;
    document.getElementById('passenger'+val).style.color = 'white';
    for(i in pax[val-1].seat){
        console.log('seat_journey'+parseInt(parseInt(i)+1));
        if(pax[val-1].seat[i].wagon != '')
            document.getElementById('seat_journey'+parseInt(parseInt(i)+1)).innerHTML = ', ' + pax[val-1].seat[i].wagon + ' ' + pax[val-1].seat[i].seat+pax[val-1].seat[i].column;
        else
            document.getElementById('seat_journey'+parseInt(parseInt(i)+1)).innerHTML = '';
    }
    print_behavior = false;
    if(pax[val-1].hasOwnProperty('behaviors') && Object.keys(pax[val-1].behaviors).length > 0){
        for(j in pax[val-1].behaviors){
            if(j.toLowerCase() == 'train'){
                if(pax[val-1].behaviors[j]){
                    print_behavior = true;
                    text=`<br/><b>Behavior History:</b><br/>`;
                    text += `<textarea id="passenger_remark" class="form-control" style="resize: none; height:200px;" rows="`+parseInt(parseInt(pax[val-1].behaviors[j].split('\n').length)+2)+`" cols="40" onchange="update_remark(`+parseInt(parseInt(val)-1)+`)">`+pax[val-1].behaviors[j].split('<br/>').join('\n')+`</textarea><br/>`;
                }
            }
        }
    }
    if(print_behavior)
        document.getElementById('detail_behavior_passenger').innerHTML = text;
    else{
        text=`<br/><b>Behavior History:</b><br/>`;
        text+= `<textarea id="passenger_remark" class="form-control" style="resize: none; height:200px;" rows="6" cols="40" onchange="update_remark(`+parseInt(parseInt(val)-1)+`)">Solo Traveller:\n\nGroup Traveller:\n</textarea><br/>`;
        document.getElementById('detail_behavior_passenger').innerHTML = text;
    }
    pax_click = val;
    print_seat_map();
}

function update_remark(val){
    if(!pax[val].hasOwnProperty('behaviors')){
        pax[val]['behaviors'] = {}
    }
    if(!pax[val]['behaviors'].hasOwnProperty('Train')){
        pax[val]['behaviors']['Train'] = ""
    }
    pax[val]['behaviors']['Train'] = document.getElementById('passenger_remark').value.split('\n').join('<br/>');
}

function select_journey(val){
    if(seat_map_pick > 0){
        document.getElementById('journey'+seat_map_pick).style.background = 'white';
        document.getElementById('journey'+seat_map_pick).style.color = 'black';
    }
    document.getElementById('journey'+val).style.background = color;
    document.getElementById('journey'+val).style.color = 'white';
    seat_map_pick = val;
    print_seat_map();
}

function change_seat(wagon, seat,column,seat_code){
    document.getElementById('seat_journey'+seat_map_pick).innerHTML = ', ' + wagon + ' ' + seat+column;
    for(i in seat_map_response[seat_map_pick-1]){
        if(seat_map_response[seat_map_pick-1][i].cabin_name == wagon){
            for(j in seat_map_response[seat_map_pick-1][i].seat_rows){
                if(pax[parseInt(pax_click-1)].seat_pick[parseInt(seat_map_pick-1)].seat == seat_map_response[seat_map_pick-1][i].seat_rows[j].row_number){
                    for(k in seat_map_response[seat_map_pick-1][i].seat_rows[j].seats){
                        if(pax[parseInt(pax_click-1)].seat_pick[parseInt(seat_map_pick-1)].column == seat_map_response[seat_map_pick-1][i].seat_rows[j].seats[k].column){
                            seat_map_response[seat_map_pick-1][i].seat_rows[j].seats[k].availability = 1;
                            break;
                        }
                    }
                    break;
                }
            }
            break;
        }
    }
    pax[parseInt(pax_click-1)].seat_pick[parseInt(seat_map_pick-1)] = {
        'wagon': wagon,
        'seat': seat,
        'column': column,
        'seat_code': seat_code
    }
    print_seat_map();
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
                data_time = obj1.departure_date;
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
                    data_time = obj1.arrival_date;
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

    data = train_data;
    if(type == 'filter'){
        check_cabin = 0;
        var temp_data = [];
        for(i in cabin_list)
            if(cabin_list[i].status == true)
                check_cabin = 1;

        data = time_check(data);
        if(check_cabin == 1){
            data.forEach((obj)=> {
                check = 0;
                cabin_list.forEach((obj1)=> {
                    if(obj.cabin_class[1] == obj1.value && obj1.status==true){
                        check = 1;
                    }
                });
                if(check != 0){
                    temp_data.push(obj);
                }
            });
            data = temp_data;
            temp_data = [];
        }
        //filter arrival departure
        if(journeys.length > 0){
            copy_data_list = JSON.parse(JSON.stringify(data));
            if(train_request.departure[journeys.length-1] == train_request.departure[journeys.length]){
                temp_data = [];
                for(i in copy_data_list){
                    if(parseInt(journeys[journeys.length-1].arrival_date[1].split(':')[0])*60 + parseInt(journeys[journeys.length-1].arrival_date[1].split(':')[1]) > parseInt(copy_data_list[i].departure_date[1].split(':')[0])*60 + parseInt(copy_data_list[i].departure_date[1].split(':')[1]))
                        copy_data_list[i].can_book_check_arrival_on_next_departure = false;
                    else
                        copy_data_list[i].can_book_check_arrival_on_next_departure = true;
                    temp_data.push(copy_data_list[i]);
                }
                data = temp_data;
                temp_data = [];
            }
        }
    }
    sort(data);
}

function sort(value){
    var data_filter = value;
    var temp = '';
    if(sorting_value == 'Lowest Price'){
        for(var i = 0; i < data_filter.length-1; i++) {
            for(var j = i+1; j < data_filter.length; j++) {
                if (data_filter[i].price > data_filter[j].price){
                    temp = data_filter[i];
                    data_filter[i] = data_filter[j];
                    data_filter[j] = temp;
                }
            }
        }
    }else if(sorting_value == 'Highest Price'){
        for(var i = 0; i < data_filter.length-1; i++) {
            for(var j = i+1; j < data_filter.length; j++) {
                if (data_filter[i].price < data_filter[j].price){
                    temp = data_filter[i];
                    data_filter[i] = data_filter[j];
                    data_filter[j] = temp;
                }
            }
        }
    }else if(sorting_value == 'Earliest Arrival'){
        for(var i = 0; i < data_filter.length-1; i++) {
            for(var j = i+1; j < data_filter.length; j++) {
                if (data_filter[i].arrival_date > data_filter[j].arrival_date){
                    temp = data_filter[i];
                    data_filter[i] = data_filter[j];
                    data_filter[j] = temp;
                }
            }
        }
    }else if(sorting_value == 'Latest Arrival'){
        for(var i = 0; i < data_filter.length-1; i++) {
            for(var j = i+1; j < data_filter.length; j++) {
                if (data_filter[i].arrival_date < data_filter[j].arrival_date){
                    temp = data_filter[i];
                    data_filter[i] = data_filter[j];
                    data_filter[j] = temp;
                }
            }
        }
    }else if(sorting_value == 'Earliest Departure'){
        for(var i = 0; i < data_filter.length-1; i++) {
            for(var j = i+1; j < data_filter.length; j++) {
                if (data_filter[i].departure_date > data_filter[j].departure_date){
                    temp = data_filter[i];
                    data_filter[i] = data_filter[j];
                    data_filter[j] = temp;
                }
            }
        }
    }else if(sorting_value == 'Latest Departure'){
        for(var i = 0; i < data_filter.length-1; i++) {
            for(var j = i+1; j < data_filter.length; j++) {
                if (data_filter[i].departure_date < data_filter[j].departure_date){
                    temp = data_filter[i];
                    data_filter[i] = data_filter[j];
                    data_filter[j] = temp;
                }
            }
        }
    }

    if(sorting_value == ''){
        for(var i = 0; i < data_filter.length-1; i++) {
            for(var j = i+1; j <data_filter.length; j++) {
                if (data_filter[i].can_book_three_hours == false && journeys.length == 0 || data_filter[i].can_book_check_arrival_on_next_departure == false && journeys.length > 0 || data_filter[i].available_count < parseInt(passengers.adult) && data_filter[j].can_book_three_hours == true && data_filter[j].can_book_check_arrival_on_next_departure == true){
                    temp = data_filter[i];
                    data_filter[i] = data_filter[j];
                    data_filter[j] = temp;
                }
            }
        }
    }else{
        for(var i = data_filter.length-1; i >= 0; i--) {
            if(data_filter[i].can_book_three_hours == false && journeys.length == 0 || data_filter[i].can_book_check_arrival_on_next_departure == false && journeys.length > 0 || data_filter[i].available_count < parseInt(passengers.adult)){
                for(j=i;j<data_filter.length-1;j++){
                    if(data_filter[j+1].can_book_three_hours == false && journeys.length == 0 || data_filter[j+1].can_book_check_arrival_on_next_departure == false && journeys.length > 0 || data_filter[j+1].available_count < parseInt(passengers.adult)){
                        break;
                    }else{
                        temp = data_filter[j];
                        data_filter[j] = data_filter[j+1];
                        data_filter[j+1] = temp
                    }
                }
            }
        }
    }
    //set
    //ticket_count = parseInt(data_filter.length);

    document.getElementById("train_ticket_loading").innerHTML = '';
    var response = '';
    ticket_count = 0;
    total_train_count = 0;

    if(data_filter.length != 0){
        for(i in data_filter){
            if(train_request.departure[train_request_pick] == data_filter[i].departure_date[0] && journeys.length != train_request.departure.length && train_request.destination[train_request_pick].split(' - ')[0] == data_filter[i].destination && train_request.origin[train_request_pick].split(' - ')[0] == data_filter[i].origin){
                total_train_count++;

                if(data_filter[i].available_count >= parseInt(passengers.adult) && data_filter[i].can_book_three_hours == true && data_filter[i].can_book_check_arrival_on_next_departure == true){
                    response+=`<div class="sorting-box mb-3">`;
                    ticket_count++;
                }
    //            else if(data_filter[i].available_count > parseInt(passengers.adult) && data_filter[i].can_book == false)
    //                response+=`<div class="sorting-box-b">`;
                else{
                    response+=`<div style="background-color:#E5E5E5; padding:15px; margin-bottom:15px; border:1px solid #cdcdcd;">`;
                }
                response += `
                    <span class="copy_train" hidden>`+i+`</span>`;
                response+=`
                    <div class="row">
                        <div class="col-lg-9 col-md-9 col-sm-9 col-xs-9">`;
                        if(data_filter[i].hasOwnProperty('search_banner')){
                           for(banner_counter in data_filter[i].search_banner){
                               var max_banner_date = moment().subtract(parseInt(-1*data_filter[i].search_banner[banner_counter].minimum_days), 'days').format('YYYY-MM-DD');
                               var selected_banner_date = moment(data_filter[i].departure_date[0]).format('YYYY-MM-DD');

                               if(selected_banner_date >= max_banner_date){
                                   if(data_filter[i].search_banner[banner_counter].active == true){
                                       response+=`<label id="pop_search_banner`+i+``+banner_counter+`" style="background:`+data_filter[i].search_banner[banner_counter].banner_color+`; color:`+text_color+`;padding:5px 10px;">`+data_filter[i].search_banner[banner_counter].name+`</label>`;
                                   }
                               }
                           }
                        }
                        response+=`
                        </div>
                        <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3 mb-3">`;
                           if(data_filter[i].available_count > 0 && data_filter[i].can_book_three_hours == true && data_filter[i].can_book_check_arrival_on_next_departure == true){
                               response+=`
                               <label class="check_box_custom" style="float:right;">
                                   <span class="span-search-ticket"></span>
                                   <input type="checkbox" class="copy_result" name="copy_result`+i+`" id="copy_result`+i+`" onchange="checkboxCopyBox(`+i+`);"/>
                                   <span class="check_box_span_custom"></span>
                               </label>
                               <span class="id_copy_result" hidden>`+i+`</span>`;
                               if(counter_train_provider > 1){
                                    response +=`<br/><label style="float:right;margin-right: 5px;">`+data_filter[i].provider+`</label>`;
                                }
                           }
                        response+=`
                        </div>
                        <div class="col-lg-9 col-md-8" style="padding-top:5px;">
                            <h5 class="copy_train_name">`+data_filter[i].carrier_name+` (`+data_filter[i].carrier_number+`)</h5>
                            <span class="copy_cabin_class" style="font-weight:500; font-size:14px;">`+data_filter[i].cabin_class[1]+` (`+data_filter[i].class_of_service+`)</span>
                            <div class="row" style="padding-top:10px;">
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                    <h6 class="copy_time_depart">`+data_filter[i].departure_date[1]+`</h6>
                                    <span class="copy_date_depart">`+data_filter[i].departure_date[0]+`</span><br/>
                                    <span class="copy_departure" style="font-weight:500;">`+data_filter[i].origin+`</span><br/>
                                </div>
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                    <div style="text-align:center; position: absolute; left:-10%;">
                                        <div style="display:inline-block;position:relative;width:100%;z-index:1;">
                                            <img src="/static/tt_website/images/icon/symbol/train-01.png" alt="Train" style="width:20px; height:20px; margin-top:5px; position:relative; z-index:99;"/>
                                            <div class="show_pc" style="height:2px;position:absolute;top:16px;width:100%;background-color:#d4d4d4;"></div>
                                            <div class="show_pc origin-code-snippet" style="background-color:#d4d4d4;right:0px"></div>
                                        </div>
                                        <span class="copy_duration" style="font-weight:500;">`;
                                        if(data_filter[i].elapsed_time.split(':')[0] != '0'){
                                            response+= data_filter[i].elapsed_time.split(':')[0] + 'h ';
                                        }
                                        if(data_filter[i].elapsed_time.split(':')[1] != '0'){
                                            response+= data_filter[i].elapsed_time.split(':')[1] + 'm ';
                                        }
                                        response+=`
                                    </div>
                                    <div style="text-align:right">
                                        <h6 class="copy_time_arr">`+data_filter[i].arrival_date[1]+`</h6>
                                        <span class="copy_date_arr">`+data_filter[i].arrival_date[0]+`</span><br/>
                                        <span class="copy_arrival" style="font-weight:500;">`+data_filter[i].destination+`</span><br/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-3 col-md-4" style="padding-top:5px;">
                            <div style="text-align:right;">`;
                                check = 0;
                                for(j in journeys){
                                    if(journeys[j].sequence == data_filter[i].sequence){
                                        if(data_filter[i].price != data_filter[i].without_discount_price){
                                            response += `<span class="basic_fare_field cross_price" style="font-size:14px; color:#929292;">`+data_filter[i].currency+` `+getrupiah(data_filter[i].without_discount_price)+`</span><br/>`
                                        }
                                        response+=`
                                        <span class="copy_price" style="font-size:16px; margin-right:10px; font-weight: bold; color:`+color+`;">`+data_filter[i].currency+` `+getrupiah(data_filter[i].price)+`</span>
                                        <input class="primary-btn-custom-un" style="margin-top:10px;" type="button" onclick="choose_train(`+i+`,`+data_filter[i].sequence+`);"  id="train_choose`+i+`" disabled value="Chosen">`;
                                        check = 1;
                                    }
                                }
                                if(check == 0){
                                    if(data_filter[i].price != data_filter[i].without_discount_price)
                                        response += `<span class="basic_fare_field cross_price" style="font-size:14px; color:#929292;">`+data_filter[i].currency+` `+getrupiah(data_filter[i].without_discount_price)+`</span><br/>`;
                                    response += `<span class="copy_price" id="train_price_`+i+`" style="font-size:16px; font-weight: bold; color:`+color+`;`;
//                                    if(is_show_breakdown_price && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation"))
//                                        response+='cursor:pointer;';
                                    response += `">`+data_filter[i].currency+` `+getrupiah(data_filter[i].price)+`</span>`;
//                                    if(is_show_breakdown_price && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation"))
//                                        response+=`<i class="fas fa-caret-down price_template"></i>`;
                                    response+=`<br/>`;
                                    if(typeof(currency_rate_data) !== 'undefined' && currency_rate_data.result.is_show && data_filter[i].price){
                                        if(user_login.hasOwnProperty('co_ho_seq_id') && currency_rate_data.result.response.agent.hasOwnProperty(user_login.co_ho_seq_id)){ // buat o3
                                            for(k in currency_rate_data.result.response.agent[user_login.co_ho_seq_id]){
                                                try{
                                                    if(currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].base_currency == data_filter[i].currency){
                                                        price_convert = (parseFloat(data_filter[i].price)/currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].rate).toFixed(2);
                                                        if(price_convert%1 == 0)
                                                            price_convert = parseInt(price_convert);
                                                        response+=`
                                                            <span class="copy_price" style="font-size:16px; font-weight: bold; color:`+color+`;" id="total_price_`+k+`"> Estimated `+k+` `+price_convert+`</span>`;
                                                    }
                                                }catch(err){
                                                    console.log(err);
                                                }
                                            }
                                        }
                                    }

                                    if(data_filter[i].available_count<50)
                                        response+=`<br/><img src="/static/tt_website/images/icon/symbol/seat.png" style="height:16px; width:auto;"> <span class="copy_seat" style="font-size:13px; float:right; color:`+color+`">`+data_filter[i].available_count+` seat(s) left</span>`;
                                    else if(data_filter[i].available_count<=1 )
                                        response+=`<br/><img src="/static/tt_website/images/icon/symbol/seat.png" style="height:16px; width:auto;"> <span class="copy_seat" style="font-size:13px; float:right; color:`+color+`">`+data_filter[i].available_count+` seat(s) left</span>`;

                                    if(data_filter[i].available_count >= parseInt(passengers.adult) && data_filter[i].can_book_three_hours == true && data_filter[i].can_book_check_arrival_on_next_departure == true)
                                        response+=`<input class="primary-btn-custom" style="width:100%; margin-top:10px;" type="button" onclick="choose_train(`+i+`,`+data_filter[i].sequence+`)"  id="train_choose`+i+`" value="Choose">`;
                                    else if(data_filter[i].available_count > parseInt(passengers.adult) && data_filter[i].can_book_three_hours == false)
                                        response+=`<input class="primary-btn-custom" style="width:100%; margin-top:10px; background:#E5E5E5; color:`+color+`;border:1px solid black;" type="button" onclick="alert_message_swal('Sorry, you can choose 3 or more hours from now!');"  id="train_choose`+i+`" value="Choose">`;
                                    else if(data_filter[i].available_count > parseInt(passengers.adult) && data_filter[i].can_book_check_arrival_on_next_departure == false)
                                        response+=`<input class="primary-btn-custom" style="width:100%; margin-top:10px;" type="button" onclick="alert_message_swal('Sorry, arrival time you pick does not match with this journey!');"  id="train_choose`+i+`" value="Choose">`;
                                    else if(data_filter[i].available_count < parseInt(passengers.adult))
                                        response+=`<input class="disabled-btn" style="width:100%; margin-top:10px;" type="button" id="train_choose`+i+`" value="Not Available" disabled>`
                                    else if(data_filter[i].available_count <= 0)
                                        response+=`<input class="disabled-btn" style="width:100%; margin-top:10px;" type="button" id="train_choose`+i+`" value="Sold" disabled>`

                                }
                                response+=`
                            </div>
                        </div>
                    </div>
                </div>`;
            }
        }
    }
    else{
        if (document.getElementById("button_chart_train").style.display === "none") {
            response +=`
            <div style="padding:5px; margin:10px;">
                <div style="text-align:center">
                    <img src="/static/tt_website/images/no_found/no-train.png" style="width:80px; height:80px;" alt="Not Found Train" title="" />
                    <br/><br/>
                    <h6>NO TRAIN AVAILABLE</h6>
                </div>
            </div>`;
        }
    }
    train_data_filter = data_filter;
    document.getElementById('train_ticket').innerHTML = response;
    document.getElementById('loading-search-train').hidden = true;
    document.getElementById("train_result").innerHTML = '';
    text_co = `
    <div class="we_found_box div_box_default">
        <span style="font-weight:bold; font-size:14px;"> We found `+total_train_count+` train</span>
        <label class="check_box_custom" style="float:right;">
            <span class="span-search-ticket" style="color:black;">Select All to Copy</span>
            <input type="checkbox" id="check_all_copy" onchange="check_all_result();"/>
            <span class="check_box_span_custom"></span>
        </label>
    </div>`;
    var node_co = document.createElement("div");
    node_co.innerHTML = text_co;
    document.getElementById("train_result").appendChild(node_co);

    for(i in data_filter){
        /*
        if(is_show_breakdown_price && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation")){
            if(train_request.departure[train_request_pick] == data_filter[i].departure_date[0] && journeys.length != train_request.departure.length && train_request.destination[train_request_pick].split(' - ')[0] == data_filter[i].destination && train_request.origin[train_request_pick].split(' - ')[0] == data_filter[i].origin){
                var price_breakdown = {};
                var currency_breakdown = '';
                for(j in data_filter[i].fares){
                    for(k in data_filter[i].fares[j].service_charge_summary){
                        price_breakdown['FARE'] = data_filter[i].fares[j].service_charge_summary[k].base_fare;
                        price_breakdown['TAX'] = data_filter[i].fares[j].service_charge_summary[k].base_tax;
//                        price_breakdown['BREAKDOWN'] = 0;
//                        price_breakdown['COMMISSION'] = (data_filter[i].fares[j].service_charge_summary[k].base_commission_vendor * -1);
//                        price_breakdown['NTA TRAIN'] = data_filter[i].fares[j].service_charge_summary[k].base_nta_vendor;
//                        price_breakdown['SERVICE FEE'] = data_filter[i].fares[j].service_charge_summary[k].base_fee_ho;
//                        price_breakdown['VAT'] = data_filter[i].fares[j].service_charge_summary[k].base_vat_ho;
//                        price_breakdown['OTT'] = data_filter[i].fares[j].service_charge_summary[k].base_price_ott;
//                        price_breakdown['TOTAL PRICE'] = data_filter[i].fares[j].service_charge_summary[k].base_price;
//                        price_breakdown['NTA AGENT'] = data_filter[i].fares[j].service_charge_summary[k].base_nta;
//                        if(user_login.co_agent_frontend_security.includes('agent_ho'))
//                            price_breakdown['COMMISSION HO'] = data_filter[i].fares[j].service_charge_summary[k].base_commission_ho * -1;
                        if(currency_breakdown == ''){
                            for(l in data_filter[i].fares[j].service_charge_summary[k].service_charges){
                                currency_breakdown = data_filter[i].fares[j].service_charge_summary[k].service_charges[l].currency;
                                break;
                            }
                        }
                        break;
                    }
                }
                // upsell
                if(typeof upsell_price_dict !== 'undefined'){
                    for(i in upsell_price_dict){
                        if(!price_breakdown.hasOwnProperty('CHANNEL UPSELL'))
                            price_breakdown['CHANNEL UPSELL'] = 0;
                        price_breakdown['CHANNEL UPSELL'] += upsell_price_dict[i];
                    }
                }
                var breakdown_text = '';
                for(j in price_breakdown){
                    if(breakdown_text)
                        breakdown_text += '<br/>';
                    breakdown_text += '<b>'+j+'</b> ';
                    if(j != 'BREAKDOWN')
                        breakdown_text += currency_breakdown + ' ' + getrupiah(price_breakdown[j]);
                }
                new jBox('Tooltip', {
                    attach: '#train_price_'+ i,
                    target: '#train_price_'+ i,
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
        */
        if(data_filter[i].hasOwnProperty('search_banner')){
           for(banner_counter in data_filter[i].search_banner){
               var max_banner_date = moment().subtract(parseInt(-1*data_filter[i].search_banner[banner_counter].minimum_days), 'days').format('YYYY-MM-DD');
               var selected_banner_date = moment(data_filter[i].departure_date[0]).format('YYYY-MM-DD');

               if(selected_banner_date >= max_banner_date){
                   if(data_filter[i].search_banner[banner_counter].active == true){
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
                            content: data_filter[i].search_banner[banner_counter].description
                       });
                   }
               }
           }
        }
    }
}

function train_ticket_pick(){
    response = '';
    for(i in journeys){
        response+=`
        <div style="background-color:white; box-shadow: rgb(3 18 26 / 15%) 4px -1px 10px -4px, rgb(3 18 26 / 15%) -4px -1px 10px -4px; border-radius:5px; border:1px solid #cdcdcd; margin-bottom:15px; padding:15px 15px 0px 15px;">
            <div class="row">
                <div class="col-lg-12 mb-3" style="border-bottom:1px solid #cdcdcd; padding-bottom:10px;">
                    <span style="font-size:14px; font-weight:bold;">
                        <img style="width:auto; height:25px; border-radius:7px; background:white;" src="/static/tt_website/images/icon/product/c-train.png" alt="Train Icon"> `;
                        if(journeys[i].train_sequence == "0")
                            response += 'Departure | ';
                        else
                            response += 'Return | ';
                    response+=journeys[i].origin_name+` (`+journeys[i].origin+`) <i class="fas fa-arrow-right"></i> `+journeys[i].destination_name+` (`+journeys[i].destination+`) | `+journeys[i].departure_date[0]+`</span>
                </div>
                <div class="col-lg-12">`;
                    if(journeys[i].hasOwnProperty('search_banner')){
                       for(banner_counter in journeys[i].search_banner){
                           var max_banner_date = moment().subtract(parseInt(-1*journeys[i].search_banner[banner_counter].minimum_days), 'days').format('YYYY-MM-DD');
                           var selected_banner_date = moment(journeys[i].departure_date[0]).format('YYYY-MM-DD');

                           if(selected_banner_date >= max_banner_date){
                               if(journeys[i].search_banner[banner_counter].active == true){
                                   response+=`<label id="pop_search_banner_pick`+i+``+journeys[i].train_sequence+``+banner_counter+`" style="background:`+journeys[i].search_banner[banner_counter].banner_color+`; color:`+text_color+`;padding:5px 10px;">`+journeys[i].search_banner[banner_counter].name+`</label>`;
                               }
                           }
                       }
                    }
                    response+=`
                </div>
                <div class="col-lg-9 col-md-8" style="padding-bottom:10px;">
                    <h5 class="copy_train_name">`+journeys[i].carrier_name+` - (`+journeys[i].carrier_number+`)</h5>
                    <span class="copy_cabin_class" style="font-weight:500; font-size:14px;">`+journeys[i].cabin_class[1]+` (`+journeys[i].class_of_service+`)</span>
                    <div class="row" style="padding-top:10px;">
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                            <h6 class="copy_time_depart">`+journeys[i].departure_date[1]+`</h6>
                            <span class="copy_date_depart">`+journeys[i].departure_date[0]+`</span><br/>
                            <span class="copy_departure" style="font-weight:500;">`+journeys[i].origin+`</span><br/>
                        </div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                            <div style="text-align:center; position: absolute; left:-10%;">
                                <div style="display:inline-block;position:relative;width:100%;z-index:1;">
                                    <img src="/static/tt_website/images/icon/symbol/train-01.png" alt="Train" style="width:20px; height:20px; margin-top:5px; position:relative; z-index:99;"/>
                                    <div class="show_pc" style="height:2px;position:absolute;top:16px;width:100%;background-color:#d4d4d4;"></div>
                                    <div class="show_pc origin-code-snippet" style="background-color:#d4d4d4;right:0px"></div>
                                </div>
                                <span class="copy_duration" style="font-weight:500;">`;
                                if(journeys[i].elapsed_time.split(':')[0] != '0'){
                                    response+= journeys[i].elapsed_time.split(':')[0] + 'h ';
                                }
                                if(journeys[i].elapsed_time.split(':')[1] != '0'){
                                    response+= journeys[i].elapsed_time.split(':')[1] + 'm ';
                                }
                                response+=`
                            </div>
                            <div style="text-align:right">
                                <h6 class="copy_time_arr">`+journeys[i].arrival_date[1]+`</h6>
                                <span class="copy_date_arr">`+journeys[i].arrival_date[0]+`</span><br/>
                                <span class="copy_arrival" style="font-weight:500;">`+journeys[i].destination+`</span><br/>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3 col-md-4" style="padding-bottom:10px;">
                    <div style="text-align:right;">`;
                        check = 0;
                        if(journeys[i].price != journeys[i].without_discount_price){
                            response += `<span class="basic_fare_field cross_price" style="font-size:14px; color:#929292;">`+journeys[i].currency+` `+getrupiah(journeys[i].without_discount_price)+`</span><br/>`
                        }
                        response+=`
                            <span id="train_pick_price_`+i+`" style="font-size:16px; margin-bottom:10px; font-weight: bold; color:`+color+`;`;
//                    if(is_show_breakdown_price && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation"))
//                        response+='cursor:pointer;';
                        response+=`">`+journeys[i].currency+` `+getrupiah(journeys[i].price)+`</span>`;
//                        if(is_show_breakdown_price && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation"))
//                            response+=`<i class="fas fa-caret-down price_template"></i>`;
                        if(typeof(currency_rate_data) !== 'undefined' && currency_rate_data.result.is_show && journeys[i].price){
                            if(user_login.hasOwnProperty('co_ho_seq_id') && currency_rate_data.result.response.agent.hasOwnProperty(user_login.co_ho_seq_id)){ // buat o3
                                for(k in currency_rate_data.result.response.agent[user_login.co_ho_seq_id]){
                                    try{
                                        if(currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].base_currency == journeys[i].currency){
                                            price_convert = (parseFloat(journeys[i].price)/currency_rate_data.result.response.agent[user_login.co_ho_seq_id][k].rate).toFixed(2);
                                            if(price_convert%1 == 0)
                                                price_convert = parseInt(price_convert);
                                            response+=`
                                                <br/>
                                                <span style="font-size:16px; font-weight:bold;"> Estimated `+k+` `+price_convert+`</span>`;
                                        }
                                    }catch(err){
                                        console.log(err);
                                    }
                                }
                            }
                        }
                        if(journeys[i].available_count<50)
                            response+=`<br/><img src="/static/tt_website/images/icon/symbol/seat.png" style="height:16px; width:auto;"> <span style="font-size:13px; float:right; color:`+color+`">`+journeys[i].available_count+` seat(s) left</span>`;
                        else if(journeys[i].available_count<=1 )
                            response+=`<br/><img src="/static/tt_website/images/icon/symbol/seat.png" style="height:16px; width:auto;"> <span style="font-size:13px; float:right; color:`+color+`">`+journeys[i].available_count+` seat(s) left</span>`;

                        response+=`<br/><input class="primary-btn-custom mt-2" type="button" style="width:100%;" onclick="change_train(`+i+`)"  id="train_choose`+i+`" value="Change">`;
                        response+=`
                    </div>
                </div>
            </div>
        </div>`;

    }
    document.getElementById('train_pick_ticket').innerHTML = response;

    for(i in journeys){
        /*
        if(is_show_breakdown_price && !user_login.co_agent_frontend_security.includes("corp_limitation") && !user_login.co_agent_frontend_security.includes("b2c_limitation")){
            var price_breakdown = {};
            var currency_breakdown = '';
            for(j in journeys[i].fares){
                for(k in journeys[i].fares[j].service_charge_summary){
                    price_breakdown['FARE'] = journeys[i].fares[j].service_charge_summary[k].base_fare;
                    price_breakdown['TAX'] = journeys[i].fares[j].service_charge_summary[k].base_tax;
//                    price_breakdown['BREAKDOWN'] = 0;
//                    price_breakdown['COMMISSION'] = (journeys[i].fares[j].service_charge_summary[k].base_commission_vendor * -1);
//                    price_breakdown['NTA TRAIN'] = journeys[i].fares[j].service_charge_summary[k].base_nta_vendor;
//                    price_breakdown['SERVICE FEE'] = journeys[i].fares[j].service_charge_summary[k].base_fee_ho;
//                    price_breakdown['VAT'] = journeys[i].fares[j].service_charge_summary[k].base_vat_ho;
//                    price_breakdown['OTT'] = journeys[i].fares[j].service_charge_summary[k].base_price_ott;
//                    price_breakdown['TOTAL PRICE'] = journeys[i].fares[j].service_charge_summary[k].base_price;
//                    price_breakdown['NTA AGENT'] = journeys[i].fares[j].service_charge_summary[k].base_nta;
//                    if(user_login.co_agent_frontend_security.includes('agent_ho'))
//                        price_breakdown['COMMISSION HO'] = journeys[i].fares[j].service_charge_summary[k].base_commission_ho * -1;

                    if(currency_breakdown == ''){
                        for(l in journeys[i].fares[j].service_charge_summary[k].service_charges){
                            currency_breakdown = journeys[i].fares[j].service_charge_summary[k].service_charges[l].currency;
                            break;
                        }
                    }
                    break;
                }
            }
            // upsell
            if(typeof upsell_price_dict !== 'undefined'){
                for(i in upsell_price_dict){
                    if(!price_breakdown.hasOwnProperty('CHANNEL UPSELL'))
                        price_breakdown['CHANNEL UPSELL'] = 0;
                    price_breakdown['CHANNEL UPSELL'] += upsell_price_dict[i];
                }
            }
            var breakdown_text = '';
            for(j in price_breakdown){
                if(breakdown_text)
                    breakdown_text += '<br/>';
                breakdown_text += '<b>'+j+'</b> ';
                if(j != 'BREAKDOWN')
                    breakdown_text += currency_breakdown + ' ' + getrupiah(price_breakdown[j]);
            }
            new jBox('Tooltip', {
                attach: '#train_pick_price_'+ i,
                target: '#train_pick_price_'+ i,
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
        */
        if(journeys[i].hasOwnProperty('search_banner')){
           for(banner_counter in journeys[i].search_banner){
               var max_banner_date = moment().subtract(parseInt(-1*journeys[i].search_banner[banner_counter].minimum_days), 'days').format('YYYY-MM-DD');
               var selected_banner_date = moment(journeys[i].departure_date[0]).format('YYYY-MM-DD');

               if(selected_banner_date >= max_banner_date){
                   if(journeys[i].search_banner[banner_counter].active == true){
                       new jBox('Tooltip', {
                            attach: '#pop_search_banner_pick'+i+journeys[i].train_sequence+banner_counter,
                            theme: 'TooltipBorder',
                            width: 280,
                            position: {
                              x: 'center',
                              y: 'bottom'
                            },
                            closeOnMouseleave: true,
                            animation: 'zoomIn',
                            content: journeys[i].search_banner[banner_counter].description
                       });
                   }
               }
           }
        }
    }

    setTimeout(function(){
        $('#loading-search-train-choose').hide();
    }, 600);
}

function update_contact_cp(val){
    temp = 1;
    while(temp != train_request.adult){
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

function share_data(){
//    const el = document.createElement('textarea');
//    el.value = $text;
//    document.body.appendChild(el);
//    el.select();
//    document.execCommand('copy');
//    document.body.removeChild(el);
    $text_share = window.encodeURIComponent($text);
}

function change_seat_map_from_selection(no){

    var selectBox = document.getElementById("seat_map_wagon_pick");
    var selectedValue = parseInt(selectBox.options[selectBox.selectedIndex].value) + 1;
    slideIndex[no] = selectedValue;
    showSlides(selectedValue, 0);
}

function print_seat_map(val){
    if(template == 1){
        var text = '<div class="input-container-search-ticket"><div class="form-select" id="default-select"><select id="seat_map_wagon_pick" onchange="change_seat_map_from_selection(0);">';
    }else if(template == 2){
        var text = '<div class="input-container-search-ticket"><select class="form-control" style="font-size:13px;" id="seat_map_wagon_pick" onchange="change_seat_map_from_selection(0);">';
    }else if(template == 3){
        var text = '<div class="form-group"><select class="form-control" style="font-size:13px;" id="seat_map_wagon_pick" onchange="change_seat_map_from_selection(0);">';
    }else if(template == 4){
        var text = '<div class="select-wrap"><span class="icon"><span class="icon-keyboard_arrow_down"></span></span><select class="form-control rounded" style="font-size:13px;" id="seat_map_wagon_pick" onchange="change_seat_map_from_selection(0);">';
    }else if(template == 5){
        var text = '<div class="input-container-search-ticket"><div class="form-select" id="default-select"><select class="form-control" id="seat_map_wagon_pick" onchange="change_seat_map_from_selection(0);">';
    }else if(template == 6){
        var text = '<div class="input-container-search-ticket"><div class="form-select"><select class="nice-select-default" id="seat_map_wagon_pick" onchange="change_seat_map_from_selection(0);">';
    }
    if(seat_map_response.length != 0){
        for(i in seat_map_response){
            if(parseInt(parseInt(i)+1) == seat_map_pick){
                for(j in seat_map_response[i]){
                    text += `<option value="`+j+`">`+seat_map_response[i][j].cabin_name+`</option>`;
                }
                text += '</select>';
                break;
            }
        }
        document.getElementById('train_seat_map').innerHTML = text;
        $('#seat_map_wagon_pick').niceSelect();
    }
    if(template == 1){
        text+=`</div></div>`;
    }else if(template == 2){
        text+=`</div>`;
    }else if(template == 3){
        text+=`</div>`;
    }else if(template == 4){
        text+=`</div>`;
    }else if(template == 5){
        text+=`</div>`;
    }else if(template == 6){
        text+=`</div></div>`;
    }


    text ='<div class="slideshow-container" style="margin-top:20px;">';
    for(i in seat_map_response){
        if(seat_map_pick == '' || pax_click == ''){
            text += `<center><h4>Please select passenger or journey</h4></center>`;
            document.getElementById('train_seat_map').innerHTML = text;
            loadingTrain();
            break;
        }else if(parseInt(parseInt(i)+1) == seat_map_pick){
            for(j in seat_map_response[i]){
                text+=`
                  <div class="col-lg-12 mySlides1" style="text-align:center;">
                  <div style="width:100%;text-align:center;">
                    <h5>
                    <div class="row">
                        <div class="col-lg-2">
                            <a style="color:black; cursor:pointer; float:left;" onclick="plusSlides(-1, 0)">&#10094; Prev</a>
                        </div>
                        <div class="col-lg-8">
                        </div>
                        <div class="col-lg-2">
                            <a style="color:black; cursor:pointer; float:right;" onclick="plusSlides(1, 0)">Next &#10095;</a>
                        </div>
                    </div>
                    </h5>
                    <br/>
                    </div>`;
                    for(k in seat_map_response[i][j].seat_rows){
                        text+=`
                          <div style="width:100%;">`;
                          var percent = parseInt(75 / seat_map_response[i][j].maximum_column_number);
                          for(l in seat_map_response[i][j].seat_rows[k].seats){
                            check = 0;
                            for(m in pax){
                                for(n in pax[m].seat_pick){
                                    if(seat_map_pick-1 == n && pax[m].seat_pick[n].wagon == seat_map_response[i][j].cabin_name && pax[m].seat_pick[n].seat == seat_map_response[i][j].seat_rows[k].row_number && pax[m].seat_pick[n].column == seat_map_response[i][j].seat_rows[k].seats[l].column){
                                        if(pax_click-1 == m){
                                            text+=`<button class="button-seat-map" type="button" style="width:`+percent+`%;background-color:`+color+`; color:`+text_color+`;margin:5px;" onclick="alert('Already booked');" data-toggle="tooltip" data-placement="top" title="`+parseInt(parseInt(m)+1)+` `+pax[m].name+`">`+seat_map_response[i][j].seat_rows[k].row_number+seat_map_response[i][j].seat_rows[k].seats[l].column+`</button>`;
                                            check = 1;
                                            break;
                                        }else{
                                            text+=`<button class="button-seat-map" type="button" style="width:`+percent+`%;background-color:#ff8971; color:`+text_color+`;margin:5px;" onclick="alert('Already booked');" data-toggle="tooltip" data-placement="top" title="`+parseInt(parseInt(m)+1)+` `+pax[m].name+`">`+seat_map_response[i][j].seat_rows[k].row_number+seat_map_response[i][j].seat_rows[k].seats[l].column+`</button>`;
                                            check = 1;
                                            break;
                                        }

                                    }
                                }
                            }
                            if(check == 0){
                                if(seat_map_response[i][j].seat_rows[k].seats[l].availability == -1){
                                  text+=`<button type="button" style="width:`+percent+`%;background-color:transparent;border:transparent; margin:5px;" disabled>`+seat_map_response[i][j].seat_rows[k].row_number+seat_map_response[i][j].seat_rows[k].seats[l].column+`</button>`;
                                }else if(seat_map_response[i][j].seat_rows[k].seats[l].availability == 1){
                                  text+=`<button class="button-seat-map" type="button" style="width:`+percent+`%;background-color:#CACACA; margin:5px;" onclick="change_seat('`+seat_map_response[i][j].cabin_name+`','`+seat_map_response[i][j].seat_rows[k].row_number+`', '`+seat_map_response[i][j].seat_rows[k].seats[l].column+`',`+seat_map_response[i][j].seat_rows[k].seats[l].seat_code+`)">`+seat_map_response[i][j].seat_rows[k].row_number+seat_map_response[i][j].seat_rows[k].seats[l].column+`</button>`;
                                }else if(seat_map_response[i][j].seat_rows[k].seats[l].availability == 0){
                                  text+=`<button class="button-seat-map" type="button" style="width:`+percent+`%;background-color:#656565; color:`+text_color+`; margin:5px;" onclick="alert('Already booked');">`+seat_map_response[i][j].seat_rows[k].row_number+seat_map_response[i][j].seat_rows[k].seats[l].column+`</button>`;
                                }
                            }

                          }
                          text+=`
                          </div>`;
                    }
                    text+=`
                  </div>`;
                }
            text+=`</div>`;

            document.getElementById('train_seat_map').innerHTML += text;
            if(val == 0)
                showSlides(1, 0);
            else{
                showSlides(slideIndex[0], 0);
                document.getElementById('seat_map_wagon_pick').value = slideIndex[0] - 1;
                $('#seat_map_wagon_pick').niceSelect('update');
            }
            loadingTrain();
            break;
        }
    }
    wagon_pick = 0;
}

function checkboxCopy(){
    var count_copy = $(".copy_result:checked").length;
//    if(count_copy == 0){
//        $('#button_copy_train').hide();
//    }
//    else{
//        $('#button_copy_train').show();
//    }
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

function check_all_result(){
   var selectAllCheckbox = document.getElementById("check_all_copy");
   if(selectAllCheckbox.checked==true){
        var checkboxes = document.getElementsByClassName("copy_result");
        for(var i=0, n=checkboxes.length;i<n;i++) {
        checkboxes[i].checked = true;
        $('#choose-train-copy').hide();
    }
   }else {
    var checkboxes = document.getElementsByClassName("copy_result");
    for(var i=0, n=checkboxes.length;i<n;i++) {
        checkboxes[i].checked = false;
        $('#choose-train-copy').show();
    }
   }
   checkboxCopy();
}

function get_checked_copy_result(){
    document.getElementById("show-list-copy-train").innerHTML = '';

    var search_params = document.getElementById("show-list-copy-train").innerHTML = '';

    var value_idx = [];
    $("#train_search_params .copy_span").each(function(obj) {
        value_idx.push( $(this).text() );
    })

    var value_train_type = "";
    if($radio_value_string == "oneway"){
        value_train_type = "Departure";
    }else if($radio_value_string == "roundtrip"){
        value_train_type = "Return";
    }
    text='';
    //$text='Search: '+value_idx[0]+'\n'+value_idx[1].trim()+'\nDate: '+value_idx[2]+'\n'+value_idx[3]+'\n\n';
    $text = value_idx[0]+' - '+value_idx[1]+' → '+value_idx[2]+', '+value_idx[3]+'\n\n';
    var train_number = 0;
    node = document.createElement("div");
    //text+=`<div class="col-lg-12"><h5>`+value_flight_type+`</h5><hr/></div>`;
    text+=`<div class="col-lg-12">`;
    $(".copy_result:checked").each(function(obj) {
        var parent_train = $(this).parent().parent().parent().parent();
        var name_train = parent_train.find('.copy_train_name').html();
        var cabin_train = parent_train.find('.copy_cabin_class').html();
        var time_depart = parent_train.find('.copy_time_depart').html();
        var date_depart = parent_train.find('.copy_date_depart').html();
        var departure_train = parent_train.find('.copy_departure').html();
        var time_arr = parent_train.find('.copy_time_arr').html();
        var date_arr = parent_train.find('.copy_date_arr').html();
        var arrival_train = parent_train.find('.copy_arrival').html();
        var price_train = parent_train.find('.copy_price').html();
        var seat_train = parent_train.find('.copy_seat').html();

        var id_train = parent_train.find('.id_copy_result').html();
        train_number = train_number + 1;
        $text += 'Option-'+train_number+'\n';
        $text += ''+name_train+'\n'+cabin_train+'\n';
        $text += departure_train+', '+date_depart+' '+time_depart;
        $text += ' → ';
        $text += arrival_train+', '+date_arr+' '+time_arr+'\n';
        if(seat_train){
            $text += seat_train+'\n';
        }
        $text += price_train+'\n';
        $text+='====================\n\n';

        if(train_number == 1){
            text+=`<div class="row pb-3" id="div_list`+id_train+`" style="padding-top:15px; border-bottom:1px solid #cdcdcd; border-top:1px solid #cdcdcd; margin-bottom:15px; background:white;">`;
        }else{
            text+=`<div class="row pt-3 pb-3" id="div_list`+id_train+`" style="padding-top:15px; border-bottom:1px solid #cdcdcd; border-top:1px solid #cdcdcd; margin-bottom:15px; background:white;">`;
        }

        text+=`
            <div class="col-lg-9">
                <h5 class="single_border_custom_left" style="padding-left:5px;">Option-`+train_number+`</h5>
            </div>
            <div class="col-lg-3" style="text-align:right;">
                <span style="font-weight:500; cursor:pointer;" onclick="delete_checked_copy_result(`+id_train+`);">Delete <i class="fas fa-times-circle" style="color:red; font-size:18px;"></i></span>
            </div>
            <div class="col-lg-12">
                <hr/>
            </div>
            <div class="col-lg-12">
                <h5 style="margin-bottom:5px;">`+name_train+`</h5>
                <span style="font-weight:500; font-size:14px;">`+cabin_train+`</span>
            </div>
            <div class="col-xs-6" style="text-align:left;">
                <b>Departure</b><br/><span>`+departure_train+`, `+date_depart+` `+time_depart+` </span>
            </div>
            <div class="col-xs-6" style="text-align:right;">
                <b>Return</b><br/><span>`+arrival_train+`, `+date_arr+` `+time_arr+` </span>
            </div>
            <div class="col-lg-12" style="text-align:right;">`;
            if(seat_train){
                text+=`<span>`+seat_train+`</span><br/>`;
            }
            text+=`
                <span class="price_template" style="float:right;">`+price_train+`</span>
            </div>
        </div>`;
    });
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
                    <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/whatsapp.png" alt="Whatsapp"/></a>`;
                if(train_number < 11){
                    text_footer+=`
                        <a href="line://msg/text/`+ $text_share +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/line.png" alt="Line"/></a>
                        <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/telegram.png" alt="Telegram"/></a>`;
                }
                else{
                    text_footer+=`
                    <a href="#" target="_blank" title="Share by Line" style="padding-right:5px; cursor:not-allowed;"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/line-gray.png" alt="Line Disable"/></a>
                    <a href="#" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/telegram-gray.png" alt="Telegram Disable"/></a>`;
                }
                text_footer+=`
                    <a href="mailto:?subject=This is the train price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/email.png" alt="Email"/></a>`;
            } else {
                text_footer+=`
                    <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/whatsapp.png" alt="Whatsapp"/></a>`;
                if(train_number < 11){
                    text_footer+=`
                        <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/line.png" alt="Line"/></a>
                        <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/telegram.png" alt="Telegram"/></a>`;
                }
                else{
                    text_footer+=`
                    <a href="#" title="Share by Line" style="padding-right:5px; cursor:not-allowed;"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/line-gray.png" alt="Line Disable"/></a>
                    <a href="#" title="Share by Telegram" style="padding-right:5px; cursor:not-allowed;"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/telegram-gray.png" alt="Telegram Disable"/></a>`;
                }
                text_footer+=`
                    <a href="mailto:?subject=This is the train price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website/images/logo/apps/email.png" alt="Email"/></a>`;
            }
            if(train_number > 10){
                text_footer+=`<br/><span style="color:red;">Nb: Share on Line and Telegram Max 10 Train</span>`;
            }
            text_footer+=`
        </div>
        <div style="float:right;" id="copy_result">
            <button class="primary-btn-white" type="button" style="width:150px;" onclick="copy_data();">
                <i class="fas fa-copy"></i> Copy
            </button>
        </div>
    </div>`;

    node.innerHTML = text;
    node.className = "row";
    document.getElementById("show-list-copy-train").appendChild(node);

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
        $('#choose-train-copy').show();
        $("#share_result").remove();
        $("#copy_result").remove();
        $text = '';
        $text_share = '';
    }else{
        $('#choose-train-copy').hide();
    }
}

function delete_checked_copy_result(id){
    $("#div_list"+id).remove();
    $("#copy_result"+id).prop("checked", false);
    checkboxCopyBox(id)
    var count_copy = $(".copy_result:checked").length;
    if (count_copy == 0){
        $('#choose-train-copy').show();
        $("#share_result").remove();
        $("#copy_result").remove();
        $text = '';
        $text_share = '';
    }
    else{
        $('#choose-train-copy').hide();
        get_checked_copy_result();
        share_data();
    }
    checkboxCopy();
}

function reset_filter(){
    change_filter('departure', 0);
    change_filter('arrival', 0);
    for(i in cabin_list){
        cabin_list[i].status = false;
        document.getElementById("checkbox_cabin"+i).checked = cabin_list[i].status;
        document.getElementById("checkbox_cabin2"+i).checked = cabin_list[i].status;
    }
    filtering('filter');
}

function change_date_shortcut(val){
    text = '';
    if(train_request_pick == 0)
        text = 'departure';
    else
        text = 'return';
    Swal.fire({
      title: 'Are you sure want change date for '+text+'?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        train_request.departure[train_request_pick] = moment(train_request.departure[train_request_pick]).subtract(val,'days').format('DD MMM YYYY');
        train_data = [];
        time_limit = 1200;
        journeys = [];
        train_request_pick = 0;
        document.getElementById('loading-search-train').style.display = 'block';
        document.getElementById('loading-search-train').hidden = false;
        document.getElementById('train_ticket').innerHTML = '';
        document.getElementById('train_result').innerHTML = `
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

        $('#train_result').show();

        document.getElementById('train_ticket_loading').innerHTML = `
        <div class="sorting-box-b mt-3 mb-3">
            <div class="row">
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

                <div class="col-lg-3" style="margin-top:10px;">
                    <span>
                        <div class="stripe_2row_small">
                            <div class="div_stripe">
                                <div class="loading_stripe"></div>
                            </div>
                        </div>
                    </span>
                    <div class="stripe_div_small100" style="margin-top:5px;">
                        <div class="div_stripe">
                            <div class="loading_stripe"></div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 col-md-8" style="margin-bottom:15px;">
                    <div class="row">
                        <div class="col-xs-6">
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
                                        <img src="/static/tt_website/images/icon/symbol/train-01.png" alt="Train" style="width:20px; height:20px; margin-top:5px;">
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
                        <div class="col-xs-6">
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
                    </div>
                </div>

                <div class="col-lg-3 col-md-4">
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
                        <div class="col-xs-12" style="margin-top:15px;">
                            <span style="float:right;">
                                <div class="stripe_div_small100">
                                    <div class="div_stripe">
                                        <div class="loading_stripe"></div>
                                    </div>
                                </div>
                            </span>
                        </div>
                        <div class="col-xs-12" style="margin-top:10px;">
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
        <div class="sorting-box-b mb-3">
            <div class="row">
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

                <div class="col-lg-3" style="margin-top:10px;">
                    <span>
                        <div class="stripe_2row_small">
                            <div class="div_stripe">
                                <div class="loading_stripe"></div>
                            </div>
                        </div>
                    </span>
                    <div class="stripe_div_small100" style="margin-top:5px;">
                        <div class="div_stripe">
                            <div class="loading_stripe"></div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 col-md-8" style="margin-bottom:15px;">
                    <div class="row">
                        <div class="col-xs-6">
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
                                        <img src="/static/tt_website/images/icon/symbol/train-01.png" alt="Train" style="width:20px; height:20px; margin-top:5px;">
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
                        <div class="col-xs-6">
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
                    </div>
                </div>

                <div class="col-lg-3 col-md-4">
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
                        <div class="col-xs-12" style="margin-top:15px;">
                            <span style="float:right;">
                                <div class="stripe_div_small100">
                                    <div class="div_stripe">
                                        <div class="loading_stripe"></div>
                                    </div>
                                </div>
                            </span>
                        </div>
                        <div class="col-xs-12" style="margin-top:10px;">
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
        <div class="sorting-box-b mb-3">
            <div class="row">
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

                <div class="col-lg-3" style="margin-top:10px;">
                    <span>
                        <div class="stripe_2row_small">
                            <div class="div_stripe">
                                <div class="loading_stripe"></div>
                            </div>
                        </div>
                    </span>
                    <div class="stripe_div_small100" style="margin-top:5px;">
                        <div class="div_stripe">
                            <div class="loading_stripe"></div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 col-md-8" style="margin-bottom:15px;">
                    <div class="row">
                        <div class="col-xs-6">
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
                                        <img src="/static/tt_website/images/icon/symbol/train-01.png" alt="Train" style="width:20px; height:20px; margin-top:5px;">
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
                        <div class="col-xs-6">
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
                    </div>
                </div>

                <div class="col-lg-3 col-md-4">
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
                        <div class="col-xs-12" style="margin-top:15px;">
                            <span style="float:right;">
                                <div class="stripe_div_small100">
                                    <div class="div_stripe">
                                        <div class="loading_stripe"></div>
                                    </div>
                                </div>
                            </span>
                        </div>
                        <div class="col-xs-12" style="margin-top:10px;">
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
        document.getElementById("badge-train-notif").innerHTML = "0";
        document.getElementById("badge-train-notif2").innerHTML = "0";
        $("#badge-train-notif").removeClass("infinite");
        $("#badge-train-notif2").removeClass("infinite");
        $("#myModalTicketTrain").modal('hide');
        //$('#button_chart_train').hide();
        $('#choose-ticket-train').show();
        $('#airlines_result_ticket').show();
        train_signin('');
        train_ticket_pick();
        //send_request_search();
      }
    })

//    change_date_next_prev(counter_search-1);
}

function change_date_next_prev(counter){
    var today_date = moment().format('DD MMM YYYY'); //hari ini
    if(train_request.departure.length > counter)
        flight_date = moment(train_request.departure[counter]);
    else
        flight_date = moment(train_request.departure[counter-1]);
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

    document.getElementById('now_date').innerHTML = `<div style="background:white; border:2px solid `+color+`; padding:15px; text-align: center;">`+flight_date.format(date_format)+`</div>`;
    document.getElementById('prev_date_1').innerHTML = `<div class="button_date_np date_item_p1" id="div_onclick_p1" style="background:white; padding:15px; text-align: center;" onclick="change_date_shortcut(1);">`+flight_date.subtract(+1, 'days').format(date_format)+`</div>`;
    document.getElementById('prev_date_2').innerHTML = `<div class="button_date_np date_item_p2" id="div_onclick_p2" style="background:white; padding:15px; text-align: center;" onclick="change_date_shortcut(2);">`+flight_date.subtract(+1, 'days').format(date_format)+`</div>`;
    document.getElementById('next_date_1').innerHTML = `<div class="button_date_np date_item_n1" id="div_onclick_n1" style="background:white; padding:15px; text-align: center;" onclick="change_date_shortcut(-1);">`+flight_date.subtract(-3, 'days').format(date_format)+`</div>`;
    document.getElementById('next_date_2').innerHTML = `<div class="button_date_np date_item_n2" id="div_onclick_n2" style="background:white; padding:15px; text-align: center;" onclick="change_date_shortcut(-2);">`+flight_date.subtract(-1, 'days').format(date_format)+`</div>`;
    flight_date.subtract(+2, 'days') //balikin ke hari ini

    if(train_request.direction == 'OW'){
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
            var nextdept = moment(train_request.departure[counter+1]).subtract(-1, 'days').format('DD MMM YYYY'); // tanggal berangkat setelahnya
            if(new Date(flight_date.subtract(+1, 'days').format(date_format)).getTime() < new Date(today_date).getTime()){
                $('.date_item_p1').removeClass("button_date_np");
                $('.date_item_p1').addClass("button_date_np_disabled");
                document.getElementById('div_onclick_p1').onclick = '';
            }
            if(new Date(flight_date.subtract(+1, 'days').format(date_format)).getTime() < new Date(today_date).getTime()){
                $('.date_item_p2').removeClass("button_date_np");
                $('.date_item_p2').addClass("button_date_np_disabled");
                document.getElementById('div_onclick_p2').onclick = '';;
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
            var prevdept = moment(train_request.departure[counter-1]).subtract(+1, 'days').format('DD MMM YYYY'); // tanggal berangkat sebelumnya
            if(train_request.direction == 'OW'){
                if(train_request_pick != train_request.departure.length){
                    var nextdept = moment(train_request.departure[counter+1]).subtract(-1, 'days').format('DD MMM YYYY'); // tanggal berangkat setelahnya
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

//function change_date_next_prev(counter){
//    //saat choose masih belum tau pake parameter sg mana, jadi masih di hardcode 1
//    var today_date = moment().format('DD MMM YYYY'); //hari ini
//    console.log(train_request);
//    var deptdate = moment(train_request.departure[counter]).format('DD MMM YYYY'); //tanggal flight skrg
//    var pdate1 = moment(train_request.departure[counter]).subtract(+1, 'days').format('DD MMM YYYY'); //1 tanggal sebelumnya
//    var pdate2 = moment(train_request.departure[counter]).subtract(+2, 'days').format('DD MMM YYYY'); //2 tanggal sebelumnya
//    var ndate1 = moment(train_request.departure[counter]).subtract(-1, 'days').format('DD MMM YYYY'); //1 tanggal setelahnya
//    var ndate2 = moment(train_request.departure[counter]).subtract(-2, 'days').format('DD MMM YYYY'); //2 tanggal setelahnya
//
//    document.getElementById('prev_date_1').innerHTML = `<div class="button_date_np date_item_p1">`+pdate1+`</div>`;
//    document.getElementById('prev_date_2').innerHTML = `<div class="button_date_np date_item_p2">`+pdate2+`</div>`;
//    document.getElementById('next_date_1').innerHTML = `<div class="button_date_np date_item_n1">`+ndate1+`</div>`;
//    document.getElementById('next_date_2').innerHTML = `<div class="button_date_np date_item_n2">`+ndate2+`</div>`;
//    document.getElementById('now_date').innerHTML = `<div style="background:white; border:2px solid `+color+`; padding:15px 0; text-align: center;">`+deptdate+`</div>`;
//
//    if(train_request.direction == 'OW'){
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
//            var nextdept = moment(train_request.departure[counter+1]).subtract(-1, 'days').format('DD MMM YYYY'); // tanggal berangkat setelahnya
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
//            var prevdept = moment(train_request.departure[counter-1]).subtract(+1, 'days').format('DD MMM YYYY'); // tanggal berangkat sebelumnya
//            if(train_request.direction == 'MC'){
//                var nextdept = moment(train_request.departure[counter+1]).subtract(-1, 'days').format('DD MMM YYYY'); // tanggal berangkat setelahnya
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
//        }
//        if(counter == 2){
//            var prevdept = moment(train_request.departure[counter-1]).subtract(+1, 'days').format('DD MMM YYYY'); // tanggal berangkat sebelumnya
//            if(new Date(pdate1).getTime() == new Date(prevdept).getTime()){
//                $('.date_item_p1').removeClass("button_date_np");
//                $('.date_item_p1').addClass("button_date_np_disabled");
//            }
//            if(new Date(pdate2).getTime() == new Date(prevdept).getTime()){
//                $('.date_item_p2').removeClass("button_date_np");
//                $('.date_item_p2').addClass("button_date_np_disabled");
//            }
//        }
//    }
//}

function show_hide_train(id){
    var general_up = document.getElementById('train_title_up'+id);
    var general_down = document.getElementById('train_title_down'+id);
    var general_show = document.getElementById('train_div_sh'+id);

    if (general_down.style.display === "none") {
        general_up.style.display = "none";
        general_down.style.display = "block";
        general_show.style.display = "none";
    }
    else {
        general_up.style.display = "block";
        general_down.style.display = "none";
        general_show.style.display = "block";
    }
}