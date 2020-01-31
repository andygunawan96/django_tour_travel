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
        document.getElementById('train_searchForm').submit();
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
    text+=`<span style="font-weight: bold; margin-right:10px;">Sort by: </span>`;

    for(i in sorting_list2){
        text+=`
        <button class="primary-btn-sorting" id="radio_sorting2`+i+`" name="radio_sorting2" onclick="sorting_button('`+sorting_list2[i].value.toLowerCase()+`')" value="`+sorting_list2[i].value+`">
            <span id="img-sort-down-`+sorting_list2[i].value.toLowerCase()+`" style="display:block;"> `+sorting_list2[i].value+` <i class="fas fa-caret-down"></i></span>
            <span id="img-sort-up-`+sorting_list2[i].value.toLowerCase()+`" style="display:none;"> `+sorting_list2[i].value+` <i class="fas fa-caret-up"></i></span>
        </button>`;
    }
    node = document.createElement("div");
    node.className = 'sorting-box';
    node.innerHTML = text;
    document.getElementById("sorting-train").appendChild(node);



    text = '';
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

    text = `<h6 style="padding-bottom:10px;">Sorting</h6><hr/>`;
    for(i in sorting_list){
        if(i == 0){
            text+=`
            <label class="radio-button-custom">
                <span class="span-search-ticket" style="color:black;">`+sorting_list[i].value+`</span>
                <input type="radio" checked="checked" id="radio_sorting`+i+`" name="radio_sorting" onclick="sorting_button('`+sorting_list[i].value+`')" value="`+sorting_list[i].value+`">
                <span class="checkmark-radio"></span>
            </label></br>`;
        }
        else{
            text+=`
            <label class="radio-button-custom">
                <span class="span-search-ticket" style="color:black;">`+sorting_list[i].value+`</span>
                <input type="radio" id="radio_sorting`+i+`" name="radio_sorting" onclick="sorting_button('`+sorting_list[i].value+`')" value="`+sorting_list[i].value+`">
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

function sorting_button(value){
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
        var temp = parseInt(price);
        var positif = false;
        if(temp > -1)
            positif = true;
        temp = price.toString();
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
            for(x=pj;x<temp.length;x++){
                priceshow+=temp.charAt(x);
            }
        }
        if(positif == false)
            priceshow = '-' + priceshow;
        return priceshow;
    }catch(err){
        return price;
    }
}

function choose_train(data,key){
    var x = document.getElementById("show-cart");
    $("#show-cart").addClass("minus");
    $(".img-plus-ticket").hide();
    $(".img-min-ticket").show();
//        document.getElementById("show-cart").style.display = "block";
    journeys.push(train_data[key]);
    if(journeys.length < train_request.departure.length){
        train_request_pick++;
        filtering('filter');
    }else if(journeys.length == train_request.departure.length){
        document.getElementById('train_choose'+data).value = 'Chosen';
        document.getElementById('train_choose'+data).classList.remove("primary-btn-custom");
        document.getElementById('train_choose'+data).classList.add("primary-btn-custom-un");
        document.getElementById('train_choose'+data).disabled = true;
        train_get_detail();
        document.getElementById('train_ticket').innerHTML = '';
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
    train_ticket_pick();
}

function change_train(val){
    train_request_pick = val;
    journeys.splice(val,1);
    document.getElementById("train_pick_ticket").innerHTML = '';
    document.getElementById("train_ticket").innerHTML = '';
    $('#button_chart_train').hide();
    document.getElementById("badge-train-notif").innerHTML = "0";
    train_ticket_pick();
    filtering('filter');
}

function train_get_detail(){
    document.getElementById("badge-train-notif").innerHTML = "1";
    $('#button_chart_train').show();
    $("#badge-train-notif").addClass("infinite");
    $("#myModalTicketTrain").modal('show');
    train_detail_text = '';
    total_price = 0;
    total_commission = 0;
    total_tax = 0;
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
    console.log(journeys);
    train_detail_text += `
    <div class="row">
        <div class="col-lg-12">
            <h5>Price Detail</h5>
            <br/>
        </div>
    </div>`;
    for(i in journeys){
        $text +=
            journeys[i].carrier_name+`-`+journeys[i].carrier_number+`(`+journeys[i].cabin_class[1]+`)\n`+
            journeys[i].origin_name+` (`+journeys[i].origin+`) - `+journeys[i].destination_name+` (`+journeys[i].destination+`) `+journeys[i].departure_date[0] + ` ` + journeys[i].departure_date[1];
        if(journeys[i].arrival_date[0] == journeys[i].departure_date[0])
            $text +=` - `+journeys[i].arrival_date[1]+`\n\n`;
        else
            $text +=` - `+journeys[i].arrival_date[0] + ' ' + journeys[i].arrival_date[1] +`\n\n`;
        train_detail_text += `
        <div class="row">
            <div class="col-lg-12">`;
                if(i != 0){
                    train_detail_text += `<hr/>`;
                }
            train_detail_text += `
                <h6>`+journeys[i].carrier_name+` - `+journeys[i].carrier_number+`</h6>
            </div>
            <div class="col-lg-6 col-xs-6">
                <table style="width:100%">
                    <tr>
                        <td><h6>`+journeys[i].departure_date[1]+`</h6></td>
                        <td style="padding-left:15px;">
                            <img src="/static/tt_website_rodextrip/img/icon/train-01.png" style="width:20px; height:20px;">
                        </td>
                        <td style="height:30px;padding:0 15px;width:100%">
                            <div style="display:inline-block;position:relative;width:100%">
                                <div style="height:2px;position:absolute;top:16px;width:100%;background-color:#d4d4d4;"></div>
                                <div class="origin-code-snippet" style="background-color:#d4d4d4;right:-6px"></div>
                                <div style="height:30px;min-width:40px;position:relative;width:0%"></div>
                            </div>
                        </td>
                    </tr>
                </table>
                <span>`+journeys[i].departure_date[0]+`</span><br/>
                <span style="font-weight:500;">`+journeys[i].origin_name+` (`+journeys[i].origin+`)</span>
            </div>

            <div class="col-lg-6 col-xs-6">
                <table style="width:100%; margin-bottom:6px;">
                    <tr>
                        <td><h6>`+journeys[i].arrival_date[1]+`</h6></td>
                        <td></td>
                        <td style="height:30px;padding:0 15px;width:100%"></td>
                    </tr>
                </table>
                <span>`+journeys[i].arrival_date[0]+`</span><br/>
                <span style="font-weight:500;">`+journeys[i].destination_name+` (`+journeys[i].destination+`)</span>
            </div>
        </div>
        <br/>
        <div class="row">`;
            if(parseInt(passengers.adult) > 0){
                total_commission += journeys[i].fares[0].service_charge_summary[0].total_rac*-1;
                total_tax += journeys[i].fares[0].service_charge_summary[0].total_tax;
                for(j in journeys[i].fares[0].service_charge_summary){

                    price = {
                        'fare': 0,
                        'tax': 0
                    };
                    for(k in journeys[i].fares[0].service_charge_summary[j].service_charges){
                        if(k == 0)
                            price['currency'] = journeys[i].fares[0].service_charge_summary[j].service_charges[k].currency;
                        if(journeys[i].fares[0].service_charge_summary[j].service_charges[k].charge_code != 'tax' && journeys[i].fares[0].service_charge_summary[j].service_charges[k].charge_code != 'roc')
                            price[journeys[i].fares[0].service_charge_summary[j].service_charges[k].charge_code] = journeys[i].fares[0].service_charge_summary[j].service_charges[k].amount;
                        else
                            price['tax'] += journeys[i].fares[0].service_charge_summary[j].service_charges[k].amount;
                    }
                    if(journeys[i].fares[0].service_charge_summary[j].pax_type == 'ADT')
                        total_price += price['fare'] * parseInt(passengers.adult);
                    else
                        total_price += price['fare'] * parseInt(passengers.infant);
                    console.log(price);
                    if(journeys[i].fares[0].service_charge_summary[j].pax_type == 'ADT' && parseInt(passengers.adult) > 0){
                        train_detail_text+=`
                            <div class="col-lg-6 col-xs-6" style="text-align:left;">
                                <span style="font-size:13px;">`+parseInt(passengers.adult)+` Adult(s) x `+price['currency']+` `+getrupiah(price['fare'])+`</span>
                            </div>
                            <div class="col-lg-6 col-xs-6" style="text-align:right;">
                                <span style="font-size:13px;">`+price['currency']+` `+getrupiah(price['fare'] * parseInt(passengers.adult))+`</span>
                            </div>`;
                        $text += passengers.adult+`x Adult Fare @`+price['currency']+' '+price['fare']+`\n`;
                    }else if(journeys[i].fares[i].service_charge_summary[j].pax_type == 'INF' && parseInt(passengers.infant) > 0){
                        train_detail_text+=`
                            <div class="col-lg-6 col-xs-6" style="text-align:left;">
                                <span style="font-size:13px;">`+parseInt(passengers.adult)+` Infant(s) x `+price['currency']+` `+getrupiah(price['fare'])+`</span>
                            </div>
                            <div class="col-lg-6 col-xs-6" style="text-align:right;">
                                <span style="font-size:13px;">`+price['currency']+` `+getrupiah(price['fare'] * parseInt(passengers.infant))+`</span>
                            </div>`;
                        $text += passengers.infant+`x Infant Fare @`+price['currency']+' '+getrupiah(price['fare'])+`\n`;
                    }
                }
                $text += '1x Convenience fee '+price['currency']+' '+ getrupiah(journeys[i].fares[0].service_charge_summary[0].total_tax) + '\n\n';
            }

            train_detail_text+=`
            <div class="col-lg-6 col-xs-6" style="text-align:left;">
                <span style="font-size:13px;">Convenience fee</span>
            </div>
            <div class="col-lg-6 col-xs-6" style="text-align:right;">
                <span style="font-size:13px;">`+price['currency']+` `+getrupiah(journeys[i].fares[0].service_charge_summary[0].total_tax)+`</span>
            </div>
        </div>
        `;
    }
    train_detail_text += `<hr/>
        <div class="row" style="margin-bottom:5px;">
            <div class="col-lg-6 col-xs-6" style="text-align:left;">
                <span style="font-size:13px;font-weight:bold;"><b>Total</b></span><br>
            </div>
            <div class="col-lg-6 col-xs-6" style="text-align:right;">
                <span style="font-size:13px;font-weight:bold;"><b>`+price['currency']+` `+getrupiah(total_price+total_tax)+`</b></span><br>
            </div>

            <div class="col-lg-12" style="padding-bottom:10px;">
            <hr/>
            <span style="font-size:14px; font-weight:bold;">Share This on:</span><br/>`;

            $text += 'Grand Total: '+ getrupiah(parseInt(total_price+total_tax));
            share_data();
            var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            if (isMobile) {
                train_detail_text+=`
                    <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png"/></a>
                    <a href="line://msg/text/`+ $text_share +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png"/></a>
                    <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png"/></a>
                    <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png"/></a>`;
            } else {
                train_detail_text+=`
                    <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png"/></a>
                    <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png"/></a>
                    <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png"/></a>
                    <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png"/></a>`;
            }
        train_detail_text +=`
            </div>
        </div>
        <div class="row" id="show_commission" style="display:none;">
            <div class="col-lg-12 col-xs-12" style="text-align:center;">
                <div class="alert alert-success">
                    <span style="font-size:13px; font-weight:bold;">Your Commission: IDR `+getrupiah(total_commission)+`</span><br>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-4 col-md-4 col-sm-4" style="padding-bottom:5px;">
                <input class="primary-btn-ticket" style="width:100%;" type="button" onclick="copy_data();" value="Copy" >
            </div>
            <div class="col-lg-4 col-md-4 col-sm-4" style="padding-bottom:5px;">
                <input class="primary-btn-ticket" id="show_commission_button" style="width:100%;" type="button" onclick="show_commission();" value="Show Commission"><br/>
            </div>`;
            if(agent_security.includes('book_reservation') == true)
            train_detail_text+=`
            <div class="col-lg-4 col-md-4 col-sm-4" style="padding-bottom:5px;">
                <button class="primary-btn-ticket next-loading next-search-train ld-ext-right" style="width:100%;" onclick="goto_passenger();" type="button" value="Next">
                    Next
                    <i class="fas fa-angle-right"></i>
                    <div class="ld ld-ring ld-cycle"></div>
                </button>
            </div>`;
            train_detail_text+=`
        </div>`;
    console.log($text);
    document.getElementById('train_detail').innerHTML = train_detail_text;
}

function goto_passenger(){
    show_loading();
    document.getElementById('train_detail').innerHTML +=
        `<input type="hidden" id="response" name="response"
        value='`+JSON.stringify(journeys)+`'>
        <input type="hidden" id="time_limit_input" name="time_limit_input" value="`+time_limit+`" />`;
    document.getElementById('train_passenger').submit();
}

function train_detail(){
    if(document.URL.split('/')[document.URL.split('/').length-1] == 'review'){
        tax = 0;
        fare = 0;
        total_price = 0;
        total_price_provider = [];
        price_provider = 0;
        commission = 0;
        service_charge = ['FARE', 'RAC', 'ROC', 'TAX', 'SSR', 'DISC'];
        type_amount_repricing = ['Repricing'];
        for(i in passengers){
            if(i != 'booker'){
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
    }
    total_price = 0;
    total_commission = 0;
    total_tax = 0;
    text = '';
    $text = '';
    text+=`
    <div class="row" style:"background-color:white; padding:5px;">
        <div class="col-lg-12">
            <h4>Price Detail</h4>
            <hr/>
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
    text += `
        <div class="row">`;
            if(i != 0){
                text+=`<div class="col-lg-12"><hr/></div>`;
            }
            text+=`
            <div class="col-lg-6 col-xs-6">
                <table style="width:100%">
                    <tr>
                        <td><h6>`+train_data[i].departure_date[1]+`</h6></td>
                        <td style="padding-left:15px;">
                            <img src="/static/tt_website_rodextrip/img/icon/train-01.png" style="width:20px; height:20px;">
                        </td>
                        <td style="height:30px;padding:0 15px;width:100%">
                            <div style="display:inline-block;position:relative;width:100%">
                                <div style="height:2px;position:absolute;top:16px;width:100%;background-color:#d4d4d4;"></div>
                                <div class="origin-code-snippet" style="background-color:#d4d4d4;right:-6px"></div>
                                <div style="height:30px;min-width:40px;position:relative;width:0%"></div>
                            </div>
                        </td>
                    </tr>
                </table>
                <span>`+train_data[i].departure_date[0]+`</span><br/>
                <span style="font-weight:500;">`+train_data[i].origin_name+` (`+train_data[i].origin+`)</span>
            </div>

            <div class="col-lg-6 col-xs-6">
                <table style="width:100%; margin-bottom:6px;">
                    <tr>
                        <td><h6>`+train_data[i].arrival_date[1]+`</h6></td>
                        <td></td>
                        <td style="height:30px;padding:0 15px;width:100%"></td>
                    </tr>
                </table>
                <span>`+train_data[i].arrival_date[0]+`</span><br/>
                <span style="font-weight:500;">`+train_data[i].destination_name+` (`+train_data[i].destination+`)</span>
            </div>
        </div>
        <hr/>
        <div class="row">`;
        price = {
            'fare': 0,
            'tax': 0
        };
        for(j in train_data[i].fares){
            total_tax += train_data[i].fares[0].service_charge_summary[0].total_tax;
            total_commission += train_data[i].fares[0].service_charge_summary[0].total_rac*-1;
            for(k in train_data[i].fares[j].service_charge_summary){
                for(l in train_data[i].fares[j].service_charge_summary[k].service_charges){
                    if(l == 0)
                        price['currency'] = train_data[i].fares[j].service_charge_summary[k].service_charges[l].currency;
                    if(train_data[i].fares[j].service_charge_summary[k].service_charges[l].charge_code != 'tax' && train_data[i].fares[j].service_charge_summary[k].service_charges[l].charge_code != 'roc')
                        price[train_data[i].fares[j].service_charge_summary[k].service_charges[l].charge_code] = train_data[i].fares[j].service_charge_summary[k].service_charges[l].amount;
                    else
                        price['tax'] += train_data[i].fares[j].service_charge_summary[k].service_charges[l].amount;
                }
                if(train_data[i].fares[j].service_charge_summary[k].pax_type == 'ADT')
                    total_price += price['fare'] * parseInt(adult);
                else
                    total_price += price['fare'] * parseInt(infant);
                if(train_data[i].fares[j].service_charge_summary[k].pax_type == 'ADT' && parseInt(adult) > 0){
                    text+=`
                        <div class="col-lg-6 col-xs-6" style="text-align:left;">
                            <span style="font-size:13px;">`+parseInt(adult)+` Adult(s) x `+price['currency']+` `+getrupiah(price['fare'])+`</span>
                        </div>
                        <div class="col-lg-6 col-xs-6" style="text-align:right;">
                            <span style="font-size:13px;">`+price['currency']+` `+getrupiah(price['fare'] * parseInt(adult))+`</span>
                        </div>`;
                    $text += adult+`x Adult Fare @`+price['currency']+' '+getrupiah(price['fare'])+`\n`;
                }else if(train_data[i].fares[j].service_charge_summary[k].pax_type == 'INF' && parseInt(infant) > 0){
                    text+=`
                        <div class="col-lg-6 col-xs-6" style="text-align:left;">
                            <span style="font-size:13px;">`+parseInt(infant)+` Infant(s) x `+price['currency']+` `+getrupiah(price['fare'])+`</span>
                        </div>
                        <div class="col-lg-6 col-xs-6" style="text-align:right;">
                            <span style="font-size:13px;">`+price['currency']+` `+getrupiah(price['fare'] * parseInt(infant))+`</span>
                        </div>`;
                    $text += infant+`x Infant Fare @`+price['currency']+' '+getrupiah(price['fare'])+`\n`;
                }
            }
        }
        $text += '\n';
        text+=`<div class="col-lg-6 col-xs-6" style="text-align:left;">
                <span style="font-size:13px;">1x Convenience fee</span>
            </div>
            <div class="col-lg-6 col-xs-6" style="text-align:right;">
                <span style="font-size:13px;">`+price['currency']+` `+getrupiah(train_data[i].fares[0].service_charge_summary[0].total_tax)+`</span>
            </div>
        </div>`;
    }
    if(document.URL.split('/')[document.URL.split('/').length-1] == 'review'){
        text+=`<div style="text-align:right;"><img src="/static/tt_website_rodextrip/img/bank.png" style="width:25px; height:25px; cursor:pointer;" onclick="show_repricing();"/></div>`;
    }
    grand_total_price = total_price + total_tax;
    try{
        if(upsell_price != 0){
            text+=`<div class="row"><div class="col-lg-7" style="text-align:left;">
                <span style="font-size:13px;font-weight:500;">Other Service Charge</span><br/>
            </div>
            <div class="col-lg-5" style="text-align:right;">`;
            if(price['currency'] == 'IDR')
            text+=`
                <span style="font-size:13px; font-weight:500;">`+price['currency']+` `+getrupiah(upsell_price)+`</span><br/>`;
            else
            text+=`
                <span style="font-size:13px; font-weight:500;">`+price['currency']+` `+upsell_price+`</span><br/>`;
            text+=`</div></div>`;
            grand_total_price += upsell_price;
        }
    }catch(err){}
    text+=`
    <hr/>
    <div class="row" style="margin-bottom:5px;">
        <div class="col-lg-6 col-xs-6" style="text-align:left;">
            <span style="font-size:13px;"><b>Total</b></span><br>
        </div>
        <div class="col-lg-6 col-xs-6" style="text-align:right;">
            <span style="font-size:13px;"><b>`+price['currency']+` `+getrupiah(grand_total_price)+`</b></span><br>
        </div>
    </div>

    <div class="row" id="show_commission" style="display:none;">
        <div class="col-lg-12 col-xs-12" style="text-align:center;">
            <div class="alert alert-success">
                <span style="font-size:13px; font-weight:bold;">Your Commission: IDR `+getrupiah(total_commission)+`</span><br>
            </div>
        </div>
    </div>`;

    $text += '1x Convenience fee '+price['currency']+' '+ getrupiah(total_tax) + '\n\n';
    try{
        console.log(passengers);
        $text += 'Passengers\n';
        for(i in passengers){
            for(j in passengers[i]){
                $text += passengers[i][j].title + ' ' + passengers[i][j].first_name + ' ' + passengers[i][j].last_name + '\n';
            }
        }
        $text += '\n';
    }catch(err){

    }

    $text += 'Grand Total: '+ getrupiah(parseInt(parseInt(total_price)+parseInt(total_tax)));
    text+=`
    <div class="row">
        <div class="col-lg-12" style="padding-bottom:10px;">
            <span style="font-size:14px; font-weight:bold;">Share This on:</span><br/>`;
            share_data();
            var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            if (isMobile) {
                text+=`
                    <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png"/></a>
                    <a href="line://msg/text/`+ $text_share +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png"/></a>
                    <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png"/></a>
                    <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png"/></a>`;
            } else {
                text+=`
                    <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png"/></a>
                    <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png"/></a>
                    <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png"/></a>
                    <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png"/></a>`;
            }
    text+=`
        </div>
    </div>

    <div class="row">
        <div class="col-lg-12" style="padding-bottom:10px;">
            <input class="primary-btn-ticket" style="width:100%;" type="button" onclick="copy_data();" value="Copy" >
        </div>
        <div class="col-lg-12" style="padding-bottom:5px;">
            <input class="primary-btn-ticket" id="show_commission_button" style="width:100%;" type="button" onclick="show_commission();" value="Show Commission"><br/>
        </div>
    </div>`;

    document.getElementById('train_detail').innerHTML = text;
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
    if(check_name(document.getElementById('booker_title').value,
                    document.getElementById('booker_first_name').value,
                    document.getElementById('booker_last_name').value,
                    50) == false){
        error_log+= 'Total of Booker name maximum 50 characters!</br>\n';
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
    length_name = 50;

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
       }
       if(check_date(document.getElementById('adult_birth_date'+i).value)==false){
           error_log+= 'Birth date wrong for passenger adult '+i+'!</br>\n';
           document.getElementById('adult_birth_date'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('adult_birth_date'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('adult_nationality'+i).value == ''){
           error_log+= 'Please fill nationality for passenger adult '+i+'!</br>\n';
           document.getElementById('adult_nationality'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('adult_nationality'+i).style['border-color'] = '#EFEFEF';
       }
       if(document.getElementById('adult_id_type'+i).value == ''){
           error_log+= 'Please fill id type for passenger adult '+i+'!</br>\n';
           document.getElementById('adult_id_type'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('adult_id_type'+i).style['border-color'] = '#EFEFEF';
           if(document.getElementById('adult_id_type'+i).value == 'ktp' && check_ktp(document.getElementById('adult_passport_number'+i).value) == false){
               error_log+= 'Please fill id number, ktp only contain 16 digits for passenger adult '+i+'!</br>\n';
               document.getElementById('adult_passport_number'+i).style['border-color'] = 'red';
           }else{
               document.getElementById('adult_passport_number'+i).style['border-color'] = '#EFEFEF';
           }

           if(document.getElementById('adult_id_type'+i).value == 'sim' && check_sim(document.getElementById('adult_passport_number'+i).value) == false){
               error_log+= 'Please fill id number, sim only contain 12 - 13 digits for passenger adult '+i+'!</br>\n';
               document.getElementById('adult_passport_number'+i).style['border-color'] = 'red';
           }else{
               document.getElementById('adult_passport_number'+i).style['border-color'] = '#EFEFEF';
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
               }if(document.getElementById('adult_country_of_issued'+i).value == ''){
                   error_log+= 'Please fill country of issued for passenger adult '+i+'!</br>\n';
                   document.getElementById('adult_country_of_issued'+i).style['border-color'] = 'red';
               }else{
                   document.getElementById('adult_country_of_issued'+i).style['border-color'] = '#EFEFEF';
               }
           }
           if(document.getElementById('adult_id_type'+i).value == 'other' && document.getElementById('adult_passport_number'+i).value.length < 6){
               error_log+= 'Please fill id number for passenger adult '+i+'!</br>\n';
               document.getElementById('adult_passport_number'+i).style['border-color'] = 'red';
           }else{
               document.getElementById('adult_passport_number'+i).style['border-color'] = '#EFEFEF';
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
       }if(document.getElementById('infant_nationality'+i).value == ''){
           error_log+= 'Please fill nationality for passenger infant '+i+'!</br>\n';
           document.getElementById('infant_nationality'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('infant_nationality'+i).style['border-color'] = '#EFEFEF';
       }

   }
   if(error_log==''){
       for(i=1;i<=adult;i++){
                document.getElementById('adult_birth_date'+i).disabled = false;
                document.getElementById('adult_passport_expired_date'+i).disabled = false;
       }
       for(i=1;i<=infant;i++){
            document.getElementById('infant_birth_date'+i).disabled = false;
       }
       $('.loader-rodextrip').fadeIn();
       document.getElementById('time_limit_input').value = time_limit;
       document.getElementById('train_review').submit();
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
    pax_click = val;
    print_seat_map();
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
            for(var j = i+1; j <data_filter.length; j++) {
                if (data_filter[i].arrival_date > data_filter[j].arrival_date){
                    temp = data_filter[i];
                    data_filter[i] = data_filter[j];
                    data_filter[j] = temp;
                }
            }
        }
    }else if(sorting_value == 'Latest Arrival'){
        for(var i = 0; i < data_filter.length-1; i++) {
            for(var j = i+1; j <data_filter.length; j++) {
                if (data_filter[i].arrival_date < data_filter[j].arrival_date){
                    temp = data_filter[i];
                    data_filter[i] = data_filter[j];
                    data_filter[j] = temp;
                }
            }
        }
    }else if(sorting_value == 'Earliest Departure'){
        for(var i = 0; i < data_filter.length-1; i++) {
            for(var j = i+1; j <data_filter.length; j++) {
                if (data_filter[i].departure_date > data_filter[j].departure_date){
                    temp = data_filter[i];
                    data_filter[i] = data_filter[j];
                    data_filter[j] = temp;
                }
            }
        }
    }else if(sorting_value == 'Latest Departure'){
        for(var i = 0; i < data_filter.length-1; i++) {
            for(var j = i+1; j <data_filter.length; j++) {
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
                if (data_filter[i].can_book == false && data_filter[j].can_book == true || data_filter[i].available_count < parseInt(passengers.adult) && data_filter[j].can_book == true){
                    temp = data_filter[i];
                    data_filter[i] = data_filter[j];
                    data_filter[j] = temp;
                }
            }
        }
    }else{
        for(var i = data_filter.length-1; i >= 0; i--) {
            if(data_filter[i].can_book == false || data_filter[i].available_count < parseInt(passengers.adult)){
                for(j=i;j<data_filter.length-1;j++){
                    if(data_filter[j+1].can_book == false || data_filter[j+1].available_count < parseInt(passengers.adult)){
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
    ticket_count = parseInt(data_filter.length);
    document.getElementById("train_result").innerHTML = '';
    text_co = `
    <div class="we_found_box" style="border:1px solid #cdcdcd; background-color:white; margin-top:-2px; margin-bottom:10px; padding:10px;">
        <span style="font-weight:bold; font-size:14px;"> We found `+ticket_count+` train</span>
        <label class="check_box_custom" style="float:right;">
            <span class="span-search-ticket" style="color:black;">Select All to Copy</span>
            <input type="checkbox" id="check_all_copy" onchange="check_all_result();"/>
            <span class="check_box_span_custom"></span>
        </label>
    </div>`;
    var node_co = document.createElement("div");
    node_co.innerHTML = text_co;
    document.getElementById("train_result").appendChild(node_co);

    var response = '';
    for(i in data_filter){
        if(train_request.departure[train_request_pick] == data_filter[i].departure_date[0]){
            if(data_filter[i].available_count >= parseInt(passengers.adult) && data_filter[i].can_book == true)
                response+=`<div class="sorting-box-b">`;
            else if(data_filter[i].available_count > parseInt(passengers.adult)  && data_filter[i].can_book == false)
                response+=`<div class="sorting-box-b">`;
            else if(data_filter[i].can_book == false)
                response+=`<div style="background-color:#E5E5E5; padding:15px; margin-bottom:15px; border:1px solid #cdcdcd;">`;
            else
                response+=`<div style="background-color:#E5E5E5; padding:15px; margin-bottom:15px; border:1px solid #cdcdcd;">`;
            response += `
                <span class="copy_train" hidden>`+i+`</span>
                <div class="row">
                    <div class="col-lg-9">
                        <h4 class="copy_train_name">`+data_filter[i].carrier_name+` - (`+data_filter[i].carrier_number+`)  - `+data_filter[i].cabin_class[1]+`</h4>
                    </div>
                    <div class="col-lg-3">`;
                       if(data_filter[i].available_count > 0 && data_filter[i].can_book == true){
                           response+=`
                           <label class="check_box_custom" style="float:right;">
                               <span class="span-search-ticket"></span>
                               <input type="checkbox" class="copy_result" name="copy_result`+i+`" id="copy_result`+i+`" onchange="checkboxCopyBox(`+i+`);"/>
                               <span class="check_box_span_custom"></span>
                           </label>
                           <span class="id_copy_result" hidden>`+i+`</span>`;
                       }
                    response+=`
                    </div>
                    <div class="col-lg-4 col-xs-6">
                        <table style="width:100%">
                            <tr>
                                <td><h5 class="copy_time_depart">`+data_filter[i].departure_date[1]+`</h5></td>
                                <td style="padding-left:15px;">
                                    <img src="/static/tt_website_rodextrip/img/icon/train-01.png" style="width:20px; height:20px;"/>
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
                        <span class="copy_date_depart">`+data_filter[i].departure_date[0]+`</span><br/>
                        <span class="copy_departure" style="font-weight:500;">`+data_filter[i].origin_name+` (`+data_filter[i].origin+`)</span>

                    </div>
                    <div class="col-lg-4 col-xs-6" style="padding:0;">
                        <table style="width:100%; margin-bottom:6px;">
                            <tr>
                                <td><h5 class="copy_time_arr">`+data_filter[i].arrival_date[1]+`</h5></td>
                                <td></td>
                                <td style="height:30px;padding:0 15px;width:100%"></td>
                            </tr>
                        </table>
                        <span class="copy_date_arr">`+data_filter[i].arrival_date[0]+`</span><br/>
                        <span class="copy_arrival" style="font-weight:500;">`+data_filter[i].destination_name+` (`+data_filter[i].destination+`)</span>
                    </div>

                    <div class="col-lg-4">
                        <div style="float:right; margin-top:20px; margin-bottom:10px;">`;
                        check = 0;
                        for(j in journeys){
                            if(journeys[j].sequence == data_filter[i].sequence){
                                response+=`
                            <span class="copy_price" style="font-size:16px; margin-right:10px; font-weight: bold; color:#505050;">IDR `+getrupiah(data_filter[i].price)+`</span>
                            <input class="primary-btn-custom-un" type="button" onclick="choose_train(`+i+`,`+data_filter[i].sequence+`);"  id="train_choose`+i+`" disabled value="Chosen">`;
                                check = 1;
                            }
                        }
                        if(check == 0){
                            if(data_filter[i].available_count >= parseInt(passengers.adult) && data_filter[i].can_book == true)
                                response+=`
                                <span class="copy_price" style="font-size:16px; margin-right:10px; font-weight: bold; color:#505050;">IDR `+getrupiah(data_filter[i].price)+`</span>
                                <input class="primary-btn-custom" type="button" onclick="choose_train(`+i+`,`+data_filter[i].sequence+`)"  id="train_choose`+i+`" value="Choose">`;
                            else if(data_filter[i].available_count > parseInt(passengers.adult)  && data_filter[i].can_book == false)
                                response+=`
                                <span class="copy_price" style="font-size:16px; margin-right:10px; font-weight: bold; color:#505050;">IDR `+getrupiah(data_filter[i].price)+`</span>
                                <input class="primary-btn-custom" type="button" onclick="alert('Sorry, you can choose 3 or more hours from now!')"  id="train_choose`+i+`" value="Choose">`;
                            else if(data_filter[i].can_book == false)
                                response+=`
                                <span class="copy_price" style="font-size:16px; margin-right:10px;">IDR `+getrupiah(data_filter[i].price)+`</span>
                                <input class="disabled-btn" type="button" id="train_choose`+i+`" value="No Available" disabled>`
                            else
                                response+=`
                                <span class="copy_price" style="font-size:16px; margin-right:10px;">IDR `+getrupiah(data_filter[i].price)+`</span>
                                <input class="disabled-btn" type="button" id="train_choose`+i+`" value="Sold" disabled>`
                        }
                    if(data_filter[i].available_count<50)
                        response+=`<br/><span class="copy_seat" style="font-size:13px; float:right; color:`+color+`">`+data_filter[i].available_count+` seat(s) left</span>`;
                    else if(data_filter[i].available_count<=1 )
                        response+=`<br/><span class="copy_seat" style="font-size:13px; float:right; color:`+color+`">`+data_filter[i].available_count+` seat(s) left</span>`;
                    response+=`</div>
                    </div>
                </div>
            </div>`;
        }
    }
    train_data_filter = data_filter;
    document.getElementById('train_ticket').innerHTML = response;
    document.getElementById('loading-search-train').hidden = true;
}

function train_ticket_pick(){
    response = '';
    for(i in journeys){

        response+=`
        <div style="background-color:`+color+`; padding:10px;">
            <h6 style="color:`+text_color+`;">`;
        if(journeys[i].sequence == 0)
            response += 'Departure';
        else
            response += 'Return';
            response +=`</h6>
        </div>
        <div class="sorting-box-b">`;
        response += `
            <div class="row">
                <div class="col-lg-12">
                    <h4>`+journeys[i].carrier_name+` - (`+journeys[i].carrier_number+`)  - `+journeys[i].cabin_class[1]+`</h4>
                </div>
                <div class="col-lg-4 col-xs-6">
                    <table style="width:100%">
                        <tr>
                            <td><h5>`+journeys[i].departure_date[1]+`</h5></td>
                            <td style="padding-left:15px;">
                                <img src="/static/tt_website_rodextrip/img/icon/train-01.png" style="width:20px; height:20px;"/>
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
                    <span>`+journeys[i].departure_date[0]+`</span><br/>
                    <span style="font-weight:500;">`+journeys[i].origin_name+` (`+journeys[i].origin+`)</span>
                </div>
                <div class="col-lg-4 col-xs-6" style="padding:0;">
                    <table style="width:100%; margin-bottom:6px;">
                        <tr>
                            <td><h5>`+journeys[i].arrival_date[1]+`</h5></td>
                            <td></td>
                            <td style="height:30px;padding:0 15px;width:100%"></td>
                        </tr>
                    </table>
                    <span>`+journeys[i].arrival_date[0]+`</span><br/>
                    <span style="font-weight:500;">`+journeys[i].destination_name+` (`+journeys[i].destination+`)</span>
                </div>

                <div class="col-lg-4">
                    <div style="float:right; margin-top:20px; margin-bottom:10px;">`;
                    check = 0;
                    response+=`
                        <span style="font-size:16px; margin-right:10px; font-weight: bold; color:#505050;">IDR `+getrupiah(journeys[i].price)+`</span>
                        <input class="primary-btn-custom" type="button" onclick="change_train(`+i+`)"  id="train_choose`+i+`" value="Change">`;
                if(journeys[i].available_count<50)
                    response+=`<br/><span style="font-size:13px; float:right; color:`+color+`">`+journeys[i].available_count+` seat(s) left</span>`;
                else if(journeys[i].available_count<=1 )
                    response+=`<br/><span style="font-size:13px; float:right; color:`+color+`">`+journeys[i].available_count+` seat(s) left</span>`;
                response+=`</div>
                </div>
            </div>
        </div>`;

    }
    document.getElementById('train_pick_ticket').innerHTML = response;
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
    const el = document.createElement('textarea');
    el.value = $text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
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
    }
    if(template == 1){
        text+=`</div></div>`;
        $('#seat_map_wagon_pick').niceSelect();
    }else if(template == 2){
        text+=`</div>`;
    }else if(template == 3){
        text+=`</div>`;
    }else if(template == 4){
        text+=`</div>`;
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
                                            text+=`<input class="button-seat-map" type="button" style="width:`+percent+`%;background-color:`+color+`; color:`+text_color+`; margin:5px;" onclick="alert('Already booked');" value="`+seat_map_response[i][j].seat_rows[k].row_number+seat_map_response[i][j].seat_rows[k].seats[l].column+`"/>`;
                                            check = 1;
                                            break;
                                        }else{
                                            text+=`<input class="button-seat-map" type="button" style="width:`+percent+`%;background-color:#ff8971; color:`+text_color+`; margin:5px;" onclick="alert('Already booked');" value="`+seat_map_response[i][j].seat_rows[k].row_number+seat_map_response[i][j].seat_rows[k].seats[l].column+`"/>`;
                                            check = 1;
                                            break;
                                        }

                                    }
                                }
                            }
                            if(check == 0){
                                if(seat_map_response[i][j].seat_rows[k].seats[l].availability == -1){
                                  text+=`<input type="button" style="width:`+percent+`%;background-color:transparent;border:transparent; margin:5px;" value="`+seat_map_response[i][j].seat_rows[k].row_number+seat_map_response[i][j].seat_rows[k].seats[l].column+`" disabled/>`;
                                }else if(seat_map_response[i][j].seat_rows[k].seats[l].availability == 1){
                                  text+=`<input class="button-seat-map" type="button" style="width:`+percent+`%;background-color:#CACACA; margin:5px;" onclick="change_seat('`+seat_map_response[i][j].cabin_name+`','`+seat_map_response[i][j].seat_rows[k].row_number+`', '`+seat_map_response[i][j].seat_rows[k].seats[l].column+`',`+seat_map_response[i][j].seat_rows[k].seats[l].seat_code+`)" value="`+seat_map_response[i][j].seat_rows[k].row_number+seat_map_response[i][j].seat_rows[k].seats[l].column+`"/>`;
                                }else if(seat_map_response[i][j].seat_rows[k].seats[l].availability == 0){
                                  text+=`<input class="button-seat-map" type="button" style="width:`+percent+`%;background-color:#656565; color:`+text_color+`; margin:5px;" onclick="alert('Already booked');" value="`+seat_map_response[i][j].seat_rows[k].row_number+seat_map_response[i][j].seat_rows[k].seats[l].column+`"/>`;
                                }
                            }

                          }
                          text+=`
                          </div>`;
                    }
                    text+=`
                  </div>`;
                }
            text+=`
                      <a class="prev" style="color:black;" onclick="plusSlides(-1, 0)">&#10094;</a>
                      <a class="next" style="color:black;" onclick="plusSlides(1, 0)">&#10095;</a>
                    </div>
                    `;

            document.getElementById('train_seat_map').innerHTML += text;
            if(val == 0)
                showSlides(1, 0);
            else{
                document.getElementById('seat_map_wagon_pick').value = slideIndex[0] - 1;
                $('#seat_map_wagon_pick').niceSelect('update');
                showSlides(slideIndex[0], 0);
            }
            loadingTrain();
            break;
        }
    }
    wagon_pick = 0;
}

function checkboxCopy(){
    var count_copy = $(".copy_result:checked").length;
    if(count_copy == 0){
        $('#button_copy_train').hide();
    }
    else{
        $('#button_copy_train').show();
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
    text+=`<div class="col-lg-12" style="min-height=200px; max-height:500px; overflow-y: scroll;">`;
    $(".copy_result:checked").each(function(obj) {
        var parent_train = $(this).parent().parent().parent().parent();
        var name_train = parent_train.find('.copy_train_name').html();
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
        $text += ''+name_train+ '\n';
        $text += departure_train+', '+date_depart+' '+time_depart;
        $text += ' → ';
        $text += arrival_train+', '+date_arr+' '+time_arr+'\n';
        if(seat_train){
            $text += seat_train+'\n';
        }
        $text += price_train+'\n';
        $text+='====================\n\n';

        text+=`
        <div class="row" id="div_list`+id_train+`">
            <div class="col-lg-9">
                <h6>Option-`+train_number+`</h6>
                <h6>`+name_train+`</h6>
                <span>`+departure_train+`, `+date_depart+` `+time_depart+` </span>
                <i class="fas fa-arrow-right"></i>
                <span>`+arrival_train+`, `+date_arr+` `+time_arr+` </span><br/>`;
                if(seat_train){
                    text+=`<span>`+seat_train+`</span><br/>`;
                }
            text+=`
                <span style="font-size:13px; font-weight:800; color:`+color+`;">Price: `+price_train+`</span>
            </div>
            <div class="col-lg-3" style="text-align:right;">
                <span style="font-weight:500; cursor:pointer;" onclick="delete_checked_copy_result(`+id_train+`);">Delete <i class="fas fa-times-circle" style="color:red; font-size:18px;"></i></span>
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
                <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png"/></a>`;
            if(train_number < 11){
                text+=`
                    <a href="line://msg/text/`+ $text_share +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png"/></a>
                    <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png"/></a>`;
            }
            else{
                text+=`
                <a href="#" target="_blank" title="Share by Line" style="padding-right:5px; cursor:not-allowed;"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line-gray.png"/></a>
                <a href="#" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram-gray.png"/></a>`;
            }
            text+=`
                <a href="mailto:?subject=This is the train price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png"/></a>`;
        } else {
            text+=`
                <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png"/></a>`;
            if(train_number < 11){
                text+=`
                    <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png"/></a>
                    <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png"/></a>`;
            }
            else{
                text+=`
                <a href="#" title="Share by Line" style="padding-right:5px; cursor:not-allowed;"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line-gray.png"/></a>
                <a href="#" title="Share by Telegram" style="padding-right:5px; cursor:not-allowed;"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram-gray.png"/></a>`;
            }
            text+=`
                <a href="mailto:?subject=This is the train price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png"/></a>`;
        }
        if(train_number > 10){
            text+=`<br/><span style="color:red;">Nb: Share on Line and Telegram Max 10 Train</span>`;
        }
    text+=`
    </div>
    <div class="col-lg-12" id="copy_result">
        <input class="primary-btn" style="width:100%;" type="button" onclick="copy_data();" value="Copy">
    </div>`;

    node.innerHTML = text;
    node.className = "row";
    document.getElementById("show-list-copy-train").appendChild(node);

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
