var airline_data = [];
var airline_data_show = [];
var airline_data_filter = [];
var airline_pick_list = [];
var airline_cookie = '';
var airline_sid = '';
var dep_price = [];
var ret_price = [];
var journey = [];
var value_pick = [];
var carrier_code = [];
var check = 0;
var count = 0;
var airline_list_count = 0;
var choose_airline = null;
var month = {
    '01': 'Jan',
    '02': 'Feb',
    '03': 'Mar',
    '04': 'Apr',
    '05': 'May',
    '06': 'Jun',
    '07': 'Jul',
    '08': 'Aug',
    '09': 'Sep',
    '10': 'Oct',
    '11': 'Nov',
    '12': 'Dec',
}
var airline_departure = 'departure';
function elapse_time(departure,arrival){
    arrival_time = (parseInt(arrival[1].split(':')[0])*3600)+(parseInt(arrival[1].split(':')[1])*60);
    departure_time = (parseInt(departure[1].split(':')[0])*3600)+(parseInt(departure[1].split(':')[1])*60);
    if(departure[0] != arrival[0]){
      arrival_time+=24*3600;
    }
    var duration = arrival_time-departure_time;
    duration = {
        'hours': parseInt(duration/3600),
        'minutes': parseInt((duration/60)%60),
        'seconds': duration%60
    }
    if(duration.minutes!= 0){
        if(duration.minutes<10)
            duration = duration.hours+"h0"+duration.minutes+"m";
        else
            duration = duration.hours+"h"+duration.minutes+"m";
    }else
        duration = duration.hours+"h";
    return duration;
}

function can_book(departure, arrival){
    arrival_time = (parseInt(departure[1].split(':')[0])*3600)+(parseInt(departure[1].split(':')[1])*60);
    departure_time = (parseInt(arrival[1].split(':')[0])*3600)+(parseInt(arrival[1].split(':')[1])*60);
    departure[0].split('-')
    oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
    firstDate = new Date(departure[0].split('-')[0],departure[0].split('-')[1],departure[0].split('-')[2]);
    secondDate = new Date(departure[0].split('-')[0],departure[0].split('-')[1],departure[0].split('-')[2]);
    diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
    if(diffDays>0){
        arrival+=diffDays*24*3600;
    }
    duration=0;
    if(departure>arrival){
        duration=0;
    }else{
        duration = arrival-departure-10800;
        if(duration>0){
            duration=false;
        }else{
            duration=true;
        }
    }
    return duration;
}

function get_city(){

}

function airline_signin(data){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'signin',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {},
       success: function(msg) {
           console.log(msg);
           if(data == ''){
               for(i in airline_request.provider){
                   if(airline_request.provider[i] == 'all'){
                       if(flight == 'domestic'){
                           for(j in domestic_carriers){
                               airline_search(domestic_carriers[j]);
                           }
                       }else if(flight == 'international'){
                           for(j in international_carriers){
                               airline_search(international_carriers[j]);
                           }
                       }
                       break;
                   }else{
                       if(flight == 'domestic'){
                           for(j in domestic_carriers)
                               if(domestic_carriers[j] == airline_request.provider[i]){
                                   airline_search(domestic_carriers[j]);
                                   break;
                               }
                       }else
                           for(j in international_carriers)
                               if(international_carriers[j] == airline_request.provider[i]){
                                   airline_search(international_carriers[j]);
                                   break;
                               }

                   }


               }
           }else if(data != '')
               airline_get_booking(data);
//            document.getElementById('train_searchForm').submit();
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });

}

function get_airline_config(type){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'get_data',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {},
       success: function(msg) {

        airline_destination = msg
        console.log(msg);
        var origin = document.getElementById("origin_id_flight");
        var destination = document.getElementById("destination_id_flight");
        for(i in msg){
            var node = document.createElement("option");
            node.text = msg[i].name+` - `+msg[i].city +' ('+msg[i].code+')';
            node.value = msg[i].code;
            if(type == 'search'){
                try{
                    if(airline_request['origin'] == msg[i].name+` - `+msg[i].city +' ('+msg[i].code+')'){
                        node.setAttribute('selected', 'selected');
                        document.getElementById('airline_origin_flight').value = msg[i].name+` - `+msg[i].city +' ('+msg[i].code+')';
                    }
                }catch(err){

                }
            }else{
                try{
                    if(cache['airline']['origin'] == msg[i].name+` - `+msg[i].city +' ('+msg[i].code+')'){
                        node.setAttribute('selected', 'selected');
                        document.getElementById('airline_origin_flight').value = msg[i].name+` - `+msg[i].city +' ('+msg[i].code+')';
                    }
                }catch(err){
                    if('Juanda - Surabaya (SUB)' == msg[i].name+` - `+msg[i].city +' ('+msg[i].code+')'){
                        node.setAttribute('selected', 'selected');
                        document.getElementById('airline_origin_flight').value = msg[i].name+` - `+msg[i].city +' ('+msg[i].code+')';
                    }
                }
            }
            origin.add(node);
            node = document.createElement("option");
            node.text = msg[i].name+` - `+msg[i].city +' ('+msg[i].code+')';
            node.value = msg[i].code;
            if(type == 'search'){
                try{
                    if(airline_request['destination'] == msg[i].name+` - `+msg[i].city +' ('+msg[i].code+')'){
                        node.setAttribute('selected', 'selected');
                        document.getElementById('airline_destination_flight').value = msg[i].name+` - `+msg[i].city +' ('+msg[i].code+')';
                    }
                }catch(err){

                }
            }else{
                try{
                    if(cache['airline']['destination'] == msg[i].name+` - `+msg[i].city +' ('+msg[i].code+')'){
                        node.setAttribute('selected', 'selected');
                        document.getElementById('airline_destination_flight').value = msg[i].name+` - `+msg[i].city +' ('+msg[i].code+')';
                    }
                }catch(err){
                    if('Soekarno Hatta Intl - Jakarta (CGK)' == msg[i].name+` - `+msg[i].city +' ('+msg[i].code+')'){
                        node.setAttribute('selected', 'selected');
                        document.getElementById('airline_destination_flight').value = msg[i].name+` - `+msg[i].city +' ('+msg[i].code+')';
                    }
                }
            }
            destination.add(node);
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

function airline_search(val){
    document.getElementById("airlines_ticket").innerHTML = '';
    getToken();
    count++;
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'search',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {
           'provider': val
       },
       success: function(msg) {
       console.log(msg);
           if(msg.error_code == 0){
              datasearch2(msg.response);
              airline_choose++;
              console.log(airline_choose);
              console.log(count);
              console.log((airline_choose/count)*100 + '%');
              var bar1 = new ldBar("#barFlightSearch");
              var bar2 = document.getElementById('barFlightSearch').ldBar;
              bar1.set((airline_choose/count)*100);
              if ((airline_choose/count)*100 == 100){
                $("#barFlightSearch").hide();
              }
           }
           else{

              airline_choose++;
              console.log(airline_choose);
              console.log(count);
              console.log((airline_choose/count)*100 + '%');
              var bar1 = new ldBar("#barFlightSearch");
              var bar2 = document.getElementById('barFlightSearch').ldBar;
              bar1.set((airline_choose/count)*100);
              if ((airline_choose/count)*100 == 100){
                $("#barFlightSearch").hide();
              }
           }
           if (count == airline_choose && airline_data.length == 0){
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

           airline_data.forEach((obj)=> {
               check = 0;
               carrier_code.forEach((obj1)=> {
                   if(obj1.code == obj.segments[0].carrier_code)
                       check=1;
                   else if(airline_carriers[obj.segments[0].carrier_code] == undefined)
                       check=1;
               });
               if(check == 0){
                   var node = document.createElement("div");
                   node.innerHTML = `<div class="checkbox-inline1">
                   <label class="check_box_custom">
                        <span class="span-search-ticket" style="color:black;">`+airline_carriers[obj.segments[0].carrier_code]+`</span>
                        <input type="checkbox" id="checkbox_airline`+airline_list_count+`" onclick="change_filter('airline',`+airline_list_count+`);"/>
                        <span class="check_box_span_custom"></span>
                    </label><br/>
                   </div>`;
                   document.getElementById("airline_list").appendChild(node);
                   node = document.createElement("div");

                   var node2 = document.createElement("div");
                   node2.innerHTML = `<div class="checkbox-inline1">
                   <label class="check_box_custom">
                        <span class="span-search-ticket" style="color:black;">`+airline_carriers[obj.segments[0].carrier_code]+`</span>
                        <input type="checkbox" id="checkbox_airline2`+airline_list_count+`" onclick="change_filter('airline',`+airline_list_count+`);"/>
                        <span class="check_box_span_custom"></span>
                    </label><br/>
                   </div>`;
                   document.getElementById("airline_list2").appendChild(node2);
                   node2 = document.createElement("div");

                   carrier_code.push({
                       airline:airline_carriers[obj.segments[0].carrier_code],
                       code:obj.segments[0].carrier_code,
                       status: false,
                       key: airline_list_count
                   });
                   airline_list_count++;
               }

           });
           console.log(carrier_code);
//            document.getElementById('train_searchForm').submit();
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });

}

function datasearch2(airline){
   data = [];
   data_show = [];
   text = '';
   var counter = 0;
   for(i in airline_data){
       data.push(airline_data[i]);
       if(airline_data[i].origin == airline_request.origin.substr(airline_request.origin.length-4,3) && airline_departure == 'departure')
           data_show.push(airline_data[i]);
       else if(airline_data[i].origin == airline_request.destination.substr(airline_request.origin.length-4,3) && airline_departure == 'return')
           data_show.push(airline_data[i]);
       counter++;
   }
   for(i in airline.journeys){
       airline.journeys[i].sequence = counter;
       price = 0;
       for(j in airline.journeys[i].segments){
           for(k in airline.journeys[i].segments[j].fares){
               if(airline.journeys[i].segments[j].fares[k].available_count >= parseInt(airline_request.adult)+parseInt(airline_request.child)){
                   for(l in airline.journeys[i].segments[j].fares[k].service_charges){
                       price += airline.journeys[i].segments[j].fares[k].service_charges[l].amount;
                   }
                   break;
               }
           }
       }
       airline.journeys[i].total_price = price;
       data.push(airline.journeys[i]);
       counter++;
   }

   airline_data = data;
   sort_button('');
//   filtering('filter');
}

function change_fare(journey, segment, fares){
    price = 0;
    for(i in airline_data[journey].segments){
        var radios = document.getElementsByName('journey'+journey+'segment'+i+'fare');
        for (var j = 0, length = radios.length; j < length; j++) {
            if (radios[j].checked) {
                // do whatever you want with the checked radio
                temp = document.getElementById('journey'+journey+'segment'+segment+'fare'+fares).innerHTML;
                price += parseInt(temp.replace( /[^\d.]/g, '' ));
                check=1;
                // only one radio can be logically checked, don't check the rest
                break;
            }
        }
    }
    document.getElementById('fare'+airline_data[journey].sequence).innerHTML = 'IDR ' + getrupiah(price.toString());
//    airline_data[journey].total_price = price;

}

function get_price_itinerary(val){
    segment = [];
    fare = 0;

    if(check == 1 && airline_request.direction == 'OW'){
        if(value_pick.length != 0){
            try{
                document.getElementById('departjourney'+value_pick[0]).value = 'Choose';
                document.getElementById('departjourney'+value_pick[0]).disabled = false;
                document.getElementById('departjourney'+value_pick[0]).classList.remove("primary-btn-custom-un");
                document.getElementById('departjourney'+value_pick[0]).classList.add("primary-btn-custom");

            }catch(err){

            }
        }
        journey = [];
        value_pick = [];
        airline_pick_list = [];
    }else if(check == 1 && airline_request.direction == 'RT'){
        if(value_pick.length != 0){
            try{
                console.log(value_pick);
                console.log(val);
                document.getElementById('departjourney'+value_pick[value_pick.length-1]).value = 'Choose';
                document.getElementById('departjourney'+value_pick[value_pick.length-1]).disabled = false;
                document.getElementById('departjourney'+value_pick[value_pick.length-1]).classList.remove("primary-btn-custom-un");
                document.getElementById('departjourney'+value_pick[value_pick.length-1]).classList.add("primary-btn-custom");
            }catch(err){

            }
        }
        journey.pop();
        value_pick.pop();
        airline_pick_list.pop();
    }

    if(choose_airline != null){
        try{document.getElementById('departjourney'+choose_airline).classList.remove("primary-btn-custom-un");
                document.getElementById('departjourney'+choose_airline).classList.add("primary-btn-custom");
            if(airline_request.direction == 'RT' && airline_data[choose_airline].combo_price == true){
                document.getElementById('departjourney'+choose_airline).value = 'Choose';

                document.getElementById('departjourney'+choose_airline).disabled = false;
            }else if(airline_request.direction == 'RT' && journey.length == 2){
                document.getElementById('departjourney'+choose_airline).value = 'Choose';
                document.getElementById('departjourney'+choose_airline).classList.remove("primary-btn-custom-un");
                document.getElementById('departjourney'+choose_airline).classList.add("primary-btn-custom");
                document.getElementById('departjourney'+choose_airline).disabled = false;
            }else if(airline_request.direction == 'OW'){
                document.getElementById('departjourney'+choose_airline).value = 'Choose';
                document.getElementById('departjourney'+choose_airline).classList.remove("primary-btn-custom-un");
                document.getElementById('departjourney'+choose_airline).classList.add("primary-btn-custom");
                document.getElementById('departjourney'+choose_airline).disabled = false;
            }

        }catch(err){

        }
    }
    document.getElementById('departjourney'+val).value = 'Chosen';
    document.getElementById('departjourney'+val).classList.remove("primary-btn-custom");
    document.getElementById('departjourney'+val).classList.add("primary-btn-custom-un");
    document.getElementById('departjourney'+val).disabled = true;
    document.getElementById("airline_detail").innerHTML = "";
    choose_airline = val;
    provider = '';
    for(i in airline_data_filter[val].segments){
        var radios = document.getElementsByName('journey'+val+'segment'+i+'fare');
        for (var j = 0, length = radios.length; j < length; j++) {
            if (radios[j].checked) {
                // do whatever you want with the checked radio
                fare = j;
                // only one radio can be logically checked, don't check the rest
                break;
            }
        }
        if(airline_data_filter[val].segments[i].provider.match(/sabre/))
            provider = 'sabre'
        else
            provider = airline_data_filter[val].segments[i].provider;
        subclass = '';
        class_of_service = '';
        fare_code = '';
        try{
            subclass = airline_data_filter[val].segments[i].fares[fare].subclass;
        }catch(err){

        }

        try{
            fare_code = airline_data_filter[val].segments[i].fares[fare].fare_code;
        }catch(err){

        }

        try{
            class_of_service = airline_data_filter[val].segments[i].fares[fare].class_of_service;
        }catch(err){

        }

        segment.push({
            "segment_code": airline_data_filter[val].segments[i].segment_code,
            'journey_type': airline_data_filter[val].segments[j].journey_type,
            'fare_code': fare_code,
            'class_of_service': class_of_service,
//            "fare_code": fare_code,
            "fare_pick": fare,
//            "provider": provider,
//            "subclass": subclass,
//            "class_of_service": class_of_service
        })

        //get farecode
//        document.getElementById('airline_searchForm').
    }


    value_pick.push(val);
    airline_pick_list.push(airline_data_filter[val]);

    price = 0;
    if(airline_request.direction == 'OW')
        journey.push({'segments':segment, 'provider': provider});
    else if(airline_request.direction == 'RT' && airline_data_filter[val].combo_price == true)
        journey.push({'segments':segment, 'provider': provider});
    else if(airline_request.direction == 'RT' && journey.length == 0){
        journey.push({'segments':segment, 'provider': provider});
        document.getElementById("airlines_ticket").innerHTML = '';
        data_show = [];
        airline_departure = 'return';
        filtering('filter');
       document.getElementById("airline_ticket_pick").innerHTML = '';
       for(i in airline_pick_list){
           text += `
            <div style="background-color:#f15a22; padding:10px;">
                <h6 style="color:white;">Departure</h6>
            </div>
            <div style="background-color:white; border:1px solid #f15a22; margin-bottom:15px;" id="journey2`+airline_pick_list[i].sequence+`">
                <div class="row">
                    <div class="col-lg-12" id="airline-info">
                        <div class="row" style="padding:10px;">
                            <div class="col-lg-12">`;
                                for(j in airline_pick_list[i].carrier_code_list)
                                text+=`
                                <img data-toggle="tooltip" style="width:50px; height:50px;" title="`+airline_carriers[airline_pick_list[i].carrier_code_list[j]]+`" class="airline-logo" src="http://static.skytors.id/`+airline_pick_list[i].carrier_code_list[j]+`.png">`;
                                text+=`
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-9">
                        <div class="row" style="padding:0px 10px 10px 10px;">
                            <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5">
                                <table style="width:100%">
                                    <tr>
                                        <td class="airport-code"><h5>`+airline_pick_list[i].origin+`</h5></td>
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
                                <span>`+airline_pick_list[i].departure_date.split(' - ')[0]+` `+airline_pick_list[i].departure_date.split(' - ')[1]+`</span></br>
                            </div>
                            <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5">
                                <table style="width:100%; margin-bottom:6px;">
                                    <tr>
                                        <td><h5>`+airline_pick_list[i].destination+`</h5></td>
                                        <td></td>
                                        <td style="height:30px;padding:0 15px;width:100%"></td>
                                    </tr>
                                </table>
                                <span>`+airline_request.destination.substr(0, airline_request.destination.length - 5)+`</span><br/>
                                <span>`+airline_pick_list[i].arrival_date.split(' - ')[0]+` `+airline_pick_list[i].arrival_date.split(' - ')[1]+`</span></br>
                            </div>
                            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2" style="padding:0px;">
                                <span>Transit: `+airline_pick_list[i].transit_count+``;
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
                                <span id="fare_detail`+airline_data_filter[value_pick[i]].sequence+`" class="basic_fare_field" style="font-size:16px;font-weight: bold; color:#505050; padding:10px;">`;
                                for(j in airline_pick_list[i].segments){
                                    for(k in airline_pick_list[i].segments[j].fares){
                                        if(parseInt(airline_request.child)+parseInt(airline_request.adult) <= airline_pick_list[i].segments[j].fares[k].available_count && k==fare){
                                            for(l in airline_pick_list[i].segments[j].fares[k].service_charges)
                                                price+= airline_pick_list[i].segments[j].fares[k].service_charges[l].amount;
                                            break;
                                        }
                                    }
                                }
                                text+=`</span>
                                <input type='button' style="margin:10px;" id="departjourney`+airline_pick_list[i].sequence+`" class="primary-btn-custom choose_selection_ticket_airlines_depart" value="Change" onclick="change_departure();" sequence_id="0"/>
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
            </div>
            <div id="detail_departjourney2`+airline_pick_list[i].sequence+`" class="panel-collapse collapse in" aria-expanded="true" style="margin-bottom:15px; display:none;">`;
                for(j in airline_pick_list[i].segments){
                var depart = 0;
                if(airline_pick_list[i].segments[j].origin == airline_request.destination.substr(airline_request.destination.length-4,3))
                    depart = 1;
                if(depart == 0)
                    text+=`
                    <div style="text-align:right; border: 2px solid white; background-color:white; padding:10px 10px 0px 10px;">
                        <span style="font-weight: bold; font-size: 14px;">Departure</span>
                    </div>`;
                else
                    text+=`
                    <div style="text-align:right; border: 2px solid white; background-color:white; padding:0px 10px 0px 10px;">
                        <span style="font-weight: bold; font-size: 14px;">Return</span>
                    </div>`;
                text+=`
                    <div id="journey0segment0" style="padding:0px 10px 10px 10px; background-color:white;">
                        <span style="font-weight: bold;">`+airline_carriers[airline_pick_list[i].segments[j].carrier_code]+` - </span>
                        <span style="color:#f15a22; font-weight: bold;">`+airline_pick_list[i].segments[j].carrier_name+`</span><hr/>

                        <div class="row" id="sch-segment-content">
                            <div class="col-lg-12">
                                <div class="row">
                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                        <table style="width:100%">
                                            <tr>
                                                <td class="airport-code"><h5>`+airline_pick_list[i].segments[j].origin+`</h5></td>
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
                                        <span>`+airline_pick_list[i].segments[j].origin_city+`</span> - <span>`+airline_pick_list[i].segments[j].origin_name+`</span></br>
                                        <span>Schedule depature</span></br>
                                        <span>`+airline_pick_list[i].segments[j].departure_date.split(' - ')[0]+` `+airline_pick_list[i].segments[j].departure_date.split(' - ')[1]+`</span></br>
                                        <span>Terminal</span></br>
                                    </div>
                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                    <table style="width:100%; margin-bottom:6px;">
                                        <tr>
                                            <td><h5>`+airline_pick_list[i].segments[j].destination+`</h5></td>
                                            <td></td>
                                            <td style="height:30px;padding:0 15px;width:100%"></td>
                                        </tr>
                                    </table>
                                    <span>`+airline_pick_list[i].segments[j].destination_city+`</span> - <span>`+airline_pick_list[i].segments[j].destination_name+`</span><br/>
                                    <span>Schedule arrival</span></br>
                                    <span>`+airline_pick_list[i].segments[j].arrival_date.split(' - ')[0]+` `+airline_pick_list[i].segments[j].arrival_date.split(' - ')[1]+`</span></br>
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
                                        for(k in airline_pick_list[i].segments[j].fares){
                                            text+=`
                                            <td style="padding:10px 15px 0px 0px;">`;
                                            if(k==fare)
                                            text+=`
                                            <label class="radio-button-custom">
                                                `+airline_pick_list[i].segments[j].fares[k].subclass+`</span> / <span>`+airline_pick_list[i].segments[j].fares[k].available_count+`
                                                <input onclick="change_fare(`+airline_pick_list[i].sequence+`,`+airline_pick_list[i].segments[j].sequence+`,`+airline_pick_list[i].segments[j].fares[k].sequence+`);" id="journey`+airline_pick_list[i].sequence+`segment`+airline_pick_list[i].segments[j].sequence+`fare" name="journey`+airline_pick_list[i].sequence+`segment`+airline_pick_list[i].segments[j].sequence+`fare" type="radio" value="`+airline_pick_list[i].segments[j].fares[k].sequence+`" checked="checked" disabled>
                                                <span class="checkmark-radio"></span>
                                            </label>`;
                                            else
                                            text+=`
                                            <label class="radio-button-custom">
                                                `+airline_pick_list[i].segments[j].fares[k].subclass+`</span> / <span>`+airline_pick_list[i].segments[j].fares[k].available_count+`
                                                <input onclick="change_fare(`+airline_pick_list[i].sequence+`,`+airline_pick_list[i].segments[j].sequence+`,`+airline_pick_list[i].segments[j].fares[k].sequence+`);" id="journey`+airline_pick_list[i].sequence+`segment`+airline_pick_list[i].segments[j].sequence+`fare" name="journey`+airline_pick_list[i].sequence+`segment`+airline_pick_list[i].segments[j].sequence+`fare" type="radio" value="`+airline_pick_list[i].segments[j].fares[k].sequence+`" disabled>
                                                <span class="checkmark-radio"></span>
                                            </label>`;
                                            text+=`<br>`;
                                            var total_price = 0;
                                            for(l in airline_pick_list[i].segments[j].fares[k].service_charges){
                                                total_price += airline_pick_list[i].segments[j].fares[k].service_charges[l].amount;
                                            }
                                            text+=`<span id="journey`+airline_pick_list[i].sequence+`segment`+airline_pick_list[i].segments[j].sequence+`fare`+airline_pick_list[i].segments[j].fares[k].sequence+`">IDR `+getrupiah(total_price)+`</span>`;
                                            text+=`</td>
                                            `;
                                        }

                                        text+=`
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>`;
                    text+=`
                    </div>`;
                }
                text+=`
            </div>`;
            text += `
            <div style="background-color:#f15a22; padding:10px; margin-bottom:15px;">
                <h6 style="color:white;">Return</h6>
            </div>`;
           var node = document.createElement("div");
           node.innerHTML = text;
           document.getElementById("airline_ticket_pick").appendChild(node);
           node = document.createElement("div");
    //     document.getElementById('airlines_ticket').innerHTML += text;
           text = '';
           document.getElementById('fare_detail'+airline_pick_list[i].sequence).innerHTML = 'IDR '+ getrupiah(price);
       }
    }else{
        if(journey.length == 1)
            journey.push({'segments':segment, 'provider': provider});
        if(journey.length == 2){
            temp_journey = [];
            temp_journey.push(journey[0]);
            temp_journey.push({'segments':segment, 'provider': provider});
            journey = temp_journey;
        }
    }
    console.log(val);
    console.log(airline_data_filter);
    console.log(journey);
    check = 0;
    if(airline_request.direction == 'RT' && airline_data_filter[val].combo_price == true){
        check = 1;
        console.log('combo_price');
        document.getElementById("badge-flight-notif").innerHTML = "1";
        document.getElementById("badge-flight-notif2").innerHTML = "1";
        $("#badge-flight-notif").addClass("infinite");
        $("#badge-flight-notif2").addClass("infinite");
        $("#myModalTicketFlight").modal('show');
        $('#loading-search-flight').show();
        $('#choose-ticket-flight').hide();
    }else if(airline_request.direction == 'OW'){
        check = 1;
        console.log('oneway');
        document.getElementById("badge-flight-notif").innerHTML = "1";
        document.getElementById("badge-flight-notif2").innerHTML = "1";
        $("#badge-flight-notif").addClass("infinite");
        $("#badge-flight-notif2").addClass("infinite");
        $("#myModalTicketFlight").modal('show');
        $('#loading-search-flight').show();
        $('#choose-ticket-flight').hide();
    }else if(airline_request.direction == 'RT' && journey.length == 2){
        check = 1;
        document.getElementById("badge-flight-notif").innerHTML = "1";
        document.getElementById("badge-flight-notif2").innerHTML = "1";
        $("#badge-flight-notif").addClass("infinite");
        $("#badge-flight-notif2").addClass("infinite");
        $("#myModalTicketFlight").modal('show');
        $('#loading-search-flight').show();
        $('#choose-ticket-flight').hide();
        console.log('return oneway');
    }
    console.log(check);
    if(check == 1){
        console.log(journey);
        getToken();
        $.ajax({
           type: "POST",
           url: "/webservice/airline",
           headers:{
                'action': 'get_price_itinerary',
           },
    //       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
           data: {
              "promotion_code": [],
              "journeys_booking": JSON.stringify(journey)
           },
           success: function(resJson) {
               console.log(resJson);
               price_type = {};
               dep_price = [];
               ret_price = [];
               if(resJson.result.error_code == 0 && resJson.result.response.price_itinerary_provider.length!=0){
                    console.log('price provider');
                    for(i in resJson.result.response.price_itinerary_provider){
                        for(j in resJson.result.response.price_itinerary_provider[i].price_itinerary){
                            console.log(i);
                            console.log('price');
                            for(k in resJson.result.response.price_itinerary_provider[i].price_itinerary[j].segments){
                                console.log('segments');
                                for(l in resJson.result.response.price_itinerary_provider[i].price_itinerary[j].segments[k].fares){
                                    console.log('fares');
                                    for(m in resJson.result.response.price_itinerary_provider[i].price_itinerary[j].segments[k].fares[l].service_charge_summary){
                                        console.log('service charge summary');
                                        for(n in resJson.result.response.price_itinerary_provider[i].price_itinerary[j].segments[k].fares[l].service_charge_summary[m].service_charges){
                                            console.log('total price');
                                            console.log(resJson.result.response.price_itinerary_provider[i].price_itinerary[j].segments[k].fares[l].service_charge_summary[m].service_charges[n])
                                            price_type[resJson.result.response.price_itinerary_provider[i].price_itinerary[j].segments[k].fares[l].service_charge_summary[m].service_charges[n].charge_code] = resJson.result.response.price_itinerary_provider[i].price_itinerary[j].segments[k].fares[l].service_charge_summary[m].service_charges[n].amount;
                                        }
                                        if(resJson.result.response.price_itinerary_provider[i].price_itinerary[j].segments[k].journey_type == 'DEP' || resJson.result.response.price_itinerary_provider[i].price_itinerary[j].is_combo_price == true){
                                            console.log('dep');
                                            dep_price[resJson.result.response.price_itinerary_provider[i].price_itinerary[j].segments[k].fares[l].service_charge_summary[m].pax_type] = price_type;
                                        }else if(resJson.result.response.price_itinerary_provider[i].price_itinerary[j].segments[k].journey_type == 'RET'){
                                            console.log('ret');
                                            ret_price[resJson.result.response.price_itinerary_provider[i].price_itinerary[j].segments[k].fares[l].service_charge_summary[m].pax_type] = price_type;
                                        }
                                            price_type = [];
                                    }
                                }
                            }
                        }
                    }

               text = `
               <div class="col-lg-12" style="max-height:400px; overflow-y: scroll;">
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="alert alert-warning" role="alert">
                                <span style="font-weight:bold;"> Please check before go to next page!</span>
                            </div>
                        </div>
                        <div class="col-lg-12" style="margin-bottom:5px;">
                            <h6>Departure</h6>`;
                               $text ='Depart\n';
                               for(i in airline_pick_list[0].segments){
                                   if(airline_pick_list[0].segments[i].journey_type == 'DEP'){
                                       $text += airline_carriers[airline_pick_list[0].segments[i].carrier_code] + ' ' + airline_pick_list[0].segments[i].carrier_code + airline_pick_list[0].segments[i].carrier_number + '\n';
                                       $text += airline_pick_list[0].segments[i].departure_date + ' → ' + airline_pick_list[0].segments[i].arrival_date + '\n';
                                       $text += airline_pick_list[0].segments[i].origin_name + ' (' + airline_pick_list[0].segments[i].origin_city + ') - ';
                                       $text += airline_pick_list[0].segments[i].destination_name + ' (' + airline_pick_list[0].segments[i].destination_city + ')\n\n';
                                   }else{
                                       break;
                                   }
                               }

                               for(i in airline_data_filter[value_pick[0]].carrier_code_list){
                                   text+=`<img data-toggle="tooltip" title="`+airline_carriers[airline_pick_list[0].segments[i].carrier_code]+`" style="width:50px; height:50px;" src="http://static.skytors.id/`+airline_pick_list[0].carrier_code_list[i]+`.png"><span> </span>`;
                               }
                        text+=`</div>`;
                        text+=`
                        <div class="col-lg-12">
                            <div class="row">
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                    <table style="width:100%">
                                        <tr>
                                            <td class="airport-code"><h6>`+airline_pick_list[0].origin+`</h6></td>
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
                                    <span style="font-size:13px;">`+airline_pick_list[0].origin_city+`</span></br>
                                    <span style="font-size:13px;">`+airline_pick_list[0].departure_date.split(' - ')[1]+` `+airline_pick_list[0].departure_date.split(' - ')[0]+`</span></br>
                                </div>
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                    <table style="width:100%; margin-bottom:6px;">
                                        <tr>
                                            <td><h5>`+airline_pick_list[0].destination+`</h5></td>
                                            <td></td>
                                            <td style="height:30px;padding:0 15px;width:100%"></td>
                                        </tr>
                                    </table>
                                    <span style="font-size:13px;">`+airline_pick_list[0].destination_city+`</span></br>
                                    <span style="font-size:13px;">`+airline_pick_list[0].arrival_date.split(' - ')[1]+` `+airline_pick_list[0].arrival_date.split(' - ')[0]+`</span></br>
                                </div>
                                <div class="col-lg-12" id="rules`+j+`">

                                </div>
                            </div>
                            <hr/>
                        </div>`;
                        if(airline_pick_list[0].combo_price == true){
                            text+=`
                            <div class="col-lg-12" style="margin-bottom:5px; margin-top:5px;">
                                <center><h6>Return</h6></center>`;
                                   $text +='Return\n';
                                   check_return = 0;
                                   date_return = [];
                                   for(i in airline_pick_list[0].segments){
                                       if(airline_pick_list[0].segments[i].journey_type == 'RET'){
                                           if(check_return == 0){
                                               date_return.push(airline_pick_list[0].segments[i].departure_date);
                                               check_return++;
                                           }
                                           $text += airline_carriers[airline_pick_list[0].segments[i].carrier_code] + ' ' + airline_pick_list[0].segments[i].carrier_code + airline_pick_list[0].segments[i].carrier_number + '\n';
                                           $text += airline_pick_list[0].segments[i].departure_date + ' → ' + airline_pick_list[0].segments[i].arrival_date + '\n';
                                           $text += airline_pick_list[0].segments[i].origin_name + ' (' + airline_pick_list[0].segments[i].origin_city + ') - ';
                                           $text += airline_pick_list[0].segments[i].destination_name + ' (' + airline_pick_list[0].segments[i].destination_city + ')\n\n';
                                       }
                                   }
                                   for(i in airline_pick_list[0].carrier_code_list){
                                      text+=`<img data-toggle="tooltip" title="`+airline_carriers[airline_pick_list[0].segments[i].carrier_code]+`" class="airline-logo" style="width:50px; height:50px;" src="http://static.skytors.id/`+airline_pick_list[0].segments[i].carrier_code+`.png"><span> </span>`;
                                   }
                                   date_return.push(airline_pick_list[0].segments[airline_pick_list[0].segments.length-1].arrival_date);
                            text+=`</div>`;

                            text+=`
                            <div class="col-lg-12">
                                <div class="row">
                                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">
                                        <table style="width:100%">
                                            <tr>
                                                <td class="airport-code"><h6>`+airline_pick_list[0].destination+`</h6></td>
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
                                        <span style="font-size:13px;">`+airline_pick_list[0].destination_city+`</span></br>
                                        <span style="font-size:13px;">`+date_return[0].split(' - ')[1]+` `+date_return[0].split(' - ')[0]+`</span></br>
                                    </div>
                                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">
                                        <table style="width:100%; margin-bottom:6px;">
                                            <tr>
                                                <td><h5>`+airline_pick_list[0].origin+`</h5></td>
                                                <td></td>
                                                <td style="height:30px;padding:0 15px;width:100%"></td>
                                            </tr>
                                        </table>
                                        <span style="font-size:13px;">`+airline_pick_list[0].destination_city+`</span></br>
                                        <span style="font-size:13px;">`+date_return[1].split(' - ')[1]+` `+date_return[1].split(' - ')[0]+`</span></br>
                                    </div>
                                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4" id="rules`+j+`">

                                    </div>
                                </div>
                                <hr/>
                            </div>`;
                        }

                        price = 0;
                        //adult
                        $text+= 'Price\n';
                        if(airline_request.adult != '0'){
                            if(dep_price.ADT['r.oc'] != null)
                                price = dep_price.ADT['r.oc'];
                            if(dep_price.ADT.tax != null)
                                price += dep_price.ADT.tax;
                            text+=`
                                <div class="col-lg-12">
                                    <div class="row">
                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                                            <span style="font-size:13px;">`+airline_request.adult+`x Adult Fare @ IDR `+getrupiah(Math.ceil(dep_price.ADT.fare))+`</span>
                                        </div>
                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                                            <span style="font-size:13px;">`+getrupiah(Math.ceil(dep_price.ADT.fare * airline_request.adult))+`</span>
                                        </div>
                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                                            <span style="font-size:13px;">`+airline_request.adult+`x Service Charge</span>
                                        </div>
                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                                            <span style="font-size:13px;">`+getrupiah(Math.ceil(price * airline_request.adult))+`</span>
                                        </div>
                                    </div>
                                </div>`;
                            price = 0;
                        }
                        //child
                        if(airline_request.child != '0'){
                            if(dep_price.CHD['r.oc'] != null)
                                price = dep_price.CHD['r.oc'];
                            if(dep_price.CHD.tax != null)
                                price += dep_price.CHD.tax;
                            text+=`
                                <div class="col-lg-12">
                                    <div class="row">
                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                                            <span style="font-size:13px;">`+airline_request.child+`x Child Fare @ IDR `+getrupiah(Math.ceil(dep_price.CHD.fare))+`</span>
                                        </div>
                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                                            <span style="font-size:13px;">`+getrupiah(Math.ceil(dep_price.CHD.fare * airline_request.child))+`</span>
                                        </div>
                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                                            <span style="font-size:13px;">`+airline_request.child+`x Service Charge</span>
                                        </div>
                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                                            <span style="font-size:13px;">`+getrupiah(Math.ceil(price * airline_request.child))+`</span>
                                        </div>
                                    </div>
                                </div>`;
                            price = 0;
                        }
                        //infant
                        if(airline_request.infant != '0'){
                            if(dep_price.INF['r.oc'] != null)
                                price = dep_price.INF['r.oc'];
                            if(dep_price.INF.tax != null)
                                price += dep_price.INF.tax;
                            if(dep_price.INF.inf != null)
                                price += dep_price.INF.inf;
                            text+=`
                                <div class="col-lg-12">
                                    <div class="row">
                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                                            <span style="font-size:13px;">`+airline_request.infant+`x Infant Fare @ IDR `+getrupiah(Math.ceil(dep_price.INF.fare))+`</span>
                                        </div>
                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                                            <span style="font-size:13px;">`+getrupiah(Math.ceil(dep_price.INF.fare * airline_request.infant))+`</span>
                                        </div>
                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                                            <span style="font-size:13px;">`+airline_request.infant+`x Service Charge</span>
                                        </div>
                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                                            <span style="font-size:13px;">`+getrupiah(Math.ceil(price * airline_request.infant))+`</span>
                                        </div>
                                    </div>
                                </div>`;
                            price = 0;
                        }
                        //return
                        if(airline_request.direction == 'RT' && airline_pick_list.length == 2){
                        console.log(value_pick);
                            text+=`
                            <div class="col-lg-12" style="margin-bottom:5px; margin-top:5px;">
                                <hr/>
                                <h6>Return</h6>`;
                                $text ='Return\n';
                                   for(i in airline_pick_list[1].segments){
                                       if(airline_pick_list[1].segments[i].journey_type=='RT')
                                       $text += airline_carriers[airline_pick_list[1].segments[i].carrier_code] + ' ' + airline_pick_list[1].segments[i].carrier_code + airline_pick_list[1].segments[i].carrier_number + '\n';
                                       $text += airline_pick_list[1].segments[i].departure_date + ' → ' + airline_pick_list[1].segments[i].arrival_date + '\n';
                                       $text += airline_pick_list[1].segments[i].origin_name + ' (' + airline_pick_list[1].segments[i].origin_city + ') - '
                                       $text += airline_pick_list[1].segments[i].destination_name + ' (' + airline_pick_list[1].segments[i].destination_city + ')\n\n'
                                   }

                                   for(i in airline_pick_list[1].carrier_code_list){
                                      text+=`<img data-toggle="tooltip" style="width:50px; height:50px;" title="`+airline_carriers[airline_pick_list[1].segments[i].carrier_code]+`" class="airline-logo" src="http://static.skytors.id/`+airline_pick_list[1].carrier_code_list[i]+`.png"><span> </span>`;
                                   }
                            text+=`</div>
                            <div class="col-lg-12">
                                <div class="row">
                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                        <table style="width:100%">
                                            <tr>
                                                <td class="airport-code"><h5>`+airline_pick_list[1].origin+`</h5></td>
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
                                        <span>`+airline_pick_list[1].origin_city+`</span></br>
                                        <span>`+airline_pick_list[1].departure_date.split(' - ')[0]+` `+airline_pick_list[1].departure_date.split(' - ')[1]+`</span></br>
                                    </div>
                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                        <table style="width:100%; margin-bottom:6px;">
                                            <tr>
                                                <td><h5>`+airline_pick_list[1].destination+`</h5></td>
                                                <td></td>
                                                <td style="height:30px;padding:0 15px;width:100%"></td>
                                            </tr>
                                        </table>
                                        <span>`+airline_pick_list[1].destination_city+`</span></br>
                                        <span>`+airline_pick_list[1].arrival_date.split(' - ')[0]+` `+airline_pick_list[1].arrival_date.split(' - ')[1]+`</span></br>
                                    </div>
                                    <div class="col-lg-12" id="rules0">

                                    </div>
                                </div>
                                <hr/>
                            </div>`;
                            //adult
                            if(parseInt(airline_request.adult) != 0){
                                if(dep_price.ADT['r.oc'] != null)
                                    price = ret_price.ADT['r.oc'];
                                if(dep_price.ADT.tax != null)
                                    price += ret_price.ADT.tax;
                                text+=`
                                    <div class="col-lg-12">
                                        <div class="row">
                                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                                                <span style="font-size:13px;">`+airline_request.adult+`x Adult Fare @ IDR `+getrupiah(Math.ceil(ret_price.ADT.fare))+`</span>
                                            </div>
                                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                                                <span style="font-size:13px;">`+getrupiah(Math.ceil(ret_price.ADT.fare * airline_request.adult))+`</span>
                                            </div>
                                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                                                <span style="font-size:13px;">`+airline_request.adult+`x Service Charge</span>
                                            </div>
                                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                                                <span style="font-size:13px;">`+getrupiah(Math.ceil(price * airline_request.adult))+`</span>
                                            </div>
                                        </div>
                                    </div>`;
                                price = 0;
                            }
                            //child
                            if(parseInt(airline_request.child) != 0){
                                if(ret_price.CHD['r.oc'] != null)
                                    price = ret_price.CHD['r.oc'];
                                if(ret_price.CHD.tax != null)
                                    price += ret_price.CHD.tax;
                                text+=`
                                    <div class="col-lg-12">
                                        <div class="row">
                                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                                                <span style="font-size:13px;">`+airline_request.child+`x Child Fare @ IDR `+getrupiah(Math.ceil(ret_price.CHD.fare))+`</span>
                                            </div>
                                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                                                <span style="font-size:13px;">`+getrupiah(Math.ceil(ret_price.CHD.fare * airline_request.child))+`</span>
                                            </div>
                                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                                                <span style="font-size:13px;">`+airline_request.child+`x Service Charge</span>
                                            </div>
                                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                                                <span style="font-size:13px;">`+getrupiah(Math.ceil(price * airline_request.child))+`</span>
                                            </div>
                                        </div>
                                    </div>`;
                                price = 0;
                            }
                            //infant
                            if(parseInt(airline_request.infant) != 0){
                                if(ret_price.INF['r.oc'] != null)
                                    price = ret_price.INF['r.oc'];
                                if(ret_price.INF.tax != null)
                                    price += ret_price.INF.tax;
                                if(ret_price.INF.inf != null)
                                    price += ret_price.INF.inf;
                                text+=`
                                    <div class="col-lg-12">
                                        <div class="row">
                                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                                                <span style="font-size:13px;">`+airline_request.infant+`x Infant Fare @ IDR `+getrupiah(Math.ceil(ret_price.INF.fare))+`</span>
                                            </div>
                                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                                                <span style="font-size:13px;">`+getrupiah(Math.ceil(ret_price.INF.fare * airline_request.infant))+`</span>
                                            </div>
                                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                                                <span style="font-size:13px;">`+airline_request.infant+`x Service Charge</span>
                                            </div>
                                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                                                <span style="font-size:13px;">`+getrupiah(Math.ceil(price * airline_request.infant))+`</span>
                                            </div>
                                        </div>
                                    </div>`;
                                price = 0;
                            }
                        }
                        total_price = 0;
                        temp_price = 0;
                        commission_price = 0;
                        if(parseInt(airline_request.adult) != 0){
                            if(airline_request.direction == 'RT')
                                if(airline_data_filter[value_pick[0]].combo_price == true){
                                    if(dep_price.ADT.fare != null)
                                        price = dep_price.ADT.fare;
                                    if(dep_price.ADT['r.oc'] != null)
                                        price += dep_price.ADT['r.oc'];
                                    if(dep_price.ADT.tax != null)
                                        price += dep_price.ADT.tax;
                                    total_price += airline_request.adult * price;
                                    temp_price += airline_request.adult * price;
                                    if(dep_price.ADT['r.ac'] != null)
                                        commission_price += airline_request.adult * (dep_price.ADT['r.ac']);
                                }else{
                                    if(dep_price.ADT.fare != null)
                                        price = dep_price.ADT.fare;
                                    if(dep_price.ADT['r.oc'] != null)
                                        price += dep_price.ADT['r.oc'];
                                    if(dep_price.ADT.tax != null)
                                        price += dep_price.ADT.tax;

                                    total_price += airline_request.adult * price;
                                    temp_price += airline_request.adult * price;
                                    price = 0;

                                    if(ret_price.ADT.fare != null)
                                        price = ret_price.ADT.fare;
                                    if(ret_price.ADT['r.oc'] != null)
                                        price += ret_price.ADT['r.oc'];
                                    if(ret_price.ADT.tax != null)
                                        price += ret_price.ADT.tax;

                                    total_price += airline_request.adult * price;
                                    temp_price += airline_request.adult * price;

                                    if(dep_price.ADT['r.ac'] != null)
                                        commission_price += airline_request.adult * (dep_price.ADT['r.ac']);
                                    if(ret_price.ADT['r.ac'] != null)
                                    commission_price += airline_request.adult * (ret_price.ADT['r.ac']);
                                }
                            else{
                                if(dep_price.ADT.fare != null)
                                    price = dep_price.ADT.fare;
                                if(dep_price.ADT['r.oc'] != null)
                                    price += dep_price.ADT['r.oc'];
                                if(dep_price.ADT.tax != null)
                                    price += dep_price.ADT.tax;
                                total_price += airline_request.adult * price;
                                temp_price += airline_request.adult * price;
                                if(dep_price.ADT['r.ac'] != null)
                                    commission_price += airline_request.adult * (dep_price.ADT['r.ac']);
                            }
                        }
                        if(parseInt(airline_request.adult) != 0)
                            $text += airline_request.adult + ' Adult Fare @IDR ' + getrupiah(Math.ceil(temp_price)) + '\n';
                        temp_price = 0;
                        if(parseInt(airline_request.child) != 0){
                            if(airline_request.direction == 'RT')
                                if(data[value_pick[0]].combo_price == true){
                                    if(dep_price.CHD.fare != null)
                                        price = dep_price.CHD.fare;
                                    if(dep_price.CHD['r.oc'] != null)
                                        price += dep_price.CHD['r.oc'];
                                    if(dep_price.CHD.tax != null)
                                        price += dep_price.CHD.tax;
                                    total_price += airline_request.child * price;
                                    temp_price += airline_request.child * price;
                                    if(dep_price.CHD['r.ac'] != null)
                                        commission_price += airline_request.child * (dep_price.CHD['r.ac']);
                                }else{
                                    if(dep_price.CHD.fare != null)
                                        price = dep_price.CHD.fare;
                                    if(dep_price.CHD['r.oc'] != null)
                                        price += dep_price.CHD['r.oc'];
                                    if(dep_price.CHD.tax != null)
                                        price += dep_price.CHD.tax;

                                    total_price += airline_request.child * price;
                                    temp_price += airline_request.child * price;

                                    if(ret_price.ADT.fare != null)
                                        price = ret_price.ADT.fare;
                                    if(ret_price.ADT['r.oc'] != null)
                                        price += ret_price.ADT['r.oc'];
                                    if(ret_price.ADT.tax != null)
                                        price += ret_price.ADT.tax;

                                    total_price += airline_request.child * price;
                                    temp_price += airline_request.child * price;
                                    if(dep_price.CHD['r.ac'] != null)
                                        commission_price += airline_request.child * (dep_price.CHD['r.ac']);
                                    if(ret_price.CHD['r.ac'] != null)
                                        commission_price += airline_request.child * (ret_price.CHD['r.ac']);
                                }
                            else{
                                if(dep_price.CHD.fare != null)
                                    price = dep_price.CHD.fare;
                                if(dep_price.CHD['r.oc'] != null)
                                    price += dep_price.CHD['r.oc'];
                                if(dep_price.CHD.tax != null)
                                    price += dep_price.CHD.tax;

                                total_price += airline_request.child * price;
                                temp_price += airline_request.child * price;
                                if(dep_price.CHD['r.ac'] != null)
                                    commission_price += airline_request.child * (dep_price.CHD['r.ac']);
                            }
                        }
                        if(parseInt(airline_request.child) != 0)
                            $text += airline_request.child + ' Child Fare @IDR ' + getrupiah(Math.ceil(temp_price)) + '\n';
                        temp_price = 0;
                        if(parseInt(airline_request.infant) != 0){
                            if(airline_request.direction == 'RT'){
                                if(airline_data_filter[value_pick[0]].combo_price == true){
                                    if(dep_price.INF.fare != null)
                                        price = dep_price.INF.fare;
                                    if(dep_price.INF['r.oc'] != null)
                                        price += dep_price.INF['r.oc'];
                                    if(dep_price.INF.tax != null)
                                        price += dep_price.INF.tax;
                                    if(dep_price.INF.inf != null)
                                        price += dep_price.INF.inf;

                                    total_price += airline_request.infant * price;
                                    temp_price += airline_request.infant * price;
                                    if(dep_price.INF['r.ac'] != null)
                                        commission_price += airline_request.infant * (dep_price.INF['r.ac']);
                                }else{
                                    if(dep_price.INF.fare != null)
                                        price = dep_price.INF.fare;
                                    if(dep_price.INF['r.oc'] != null)
                                        price += dep_price.INF['r.oc'];
                                    if(dep_price.INF.tax != null)
                                        price += dep_price.INF.tax;
                                    if(dep_price.INF.inf != null)
                                        price += dep_price.INF.inf;
                                    total_price += airline_request.infant * price;
                                    temp_price += airline_request.infant * price;

                                    if(ret_price.INF.fare != null)
                                        price = ret_price.INF.fare;
                                    if(ret_price.INF['r.oc'] != null)
                                        price += ret_price.INF['r.oc'];
                                    if(ret_price.INF.tax != null)
                                        price += ret_price.INF.tax;
                                    if(ret_price.INF.inf != null)
                                        price += ret_price.INF.inf;
                                    total_price += airline_request.infant * price;
                                    temp_price += airline_request.infant * price;
                                    if(dep_price.INF['r.ac'] != null)
                                        commission_price += airline_request.infant * (dep_price.INF['r.ac']);
                                    if(ret_price.INF['r.ac'] != null)
                                        commission_price += airline_request.infant * (ret_price.INF['r.ac']);
                                }
                            }else{
                                if(dep_price.INF.fare != null)
                                    price = dep_price.INF.fare;
                                if(dep_price.INF['r.oc'] != null)
                                    price += dep_price.INF['r.oc'];
                                if(dep_price.INF.tax != null)
                                    price += dep_price.INF.tax;
                                if(dep_price.INF.inf != null)
                                    price += dep_price.INF.inf;
                                total_price += airline_request.infant * price;
                                temp_price += airline_request.infant * price;
                                if(dep_price.INF['r.ac'] != null)
                                    commission_price += airline_request.infant * (dep_price.INF['r.ac']);
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
               <div class="col-lg-12" style="margin-top:10px;">
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="row">
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                                    <span style="font-size:14px; font-weight: bold;"><b>Total</b></span>
                                </div>
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                                    <span style="font-size:14px; font-weight: bold;"><b>IDR `+getrupiah(Math.ceil(total_price))+`</b></span>
                                </div>
                            </div>
                        </div>

                        <div class="col-lg-12" style="text-align:center; display:none;" id="show_commission">
                            <div class="alert alert-success">
                                <span style="font-size:13px; font-weight: bold;">Your Commission: IDR `+getrupiah(commission_price)+`</span><br>
                            </div>
                        </div>

                        <div class="col-lg-4 col-md-4 col-sm-4" style="padding-bottom:5px;">
                            <input class="primary-btn-ticket" style="width:100%;" type="button" onclick="copy_data();" value="Copy">
                        </div>
                        <div class="col-lg-4 col-md-4 col-sm-4" style="padding-bottom:5px;">
                            <input class="primary-btn-ticket" id="show_commission_button" style="width:100%;" type="button" onclick="show_commission();" value="Show Commission"><br/>
                        </div>
                        <div class="col-lg-4 col-md-4 col-sm-4" style="padding-bottom:5px;">
                            <button class="primary-btn-ticket next-search-flight ld-ext-right" style="width:100%;" onclick="document.getElementById('go_to_passenger').submit();" type="submit" value="Next">
                                Next
                                <i class="fas fa-angle-right"></i>
                                <div class="ld ld-ring ld-cycle"></div>
                            </button>
                        </div>
                    </div>
                </div>`;
                }else{
                    document.getElementById("badge-flight-notif").innerHTML = "0";
                    document.getElementById("badge-flight-notif2").innerHTML = "0";
                    $("#badge-flight-notif").removeClass("infinite");
                    $("#badge-flight-notif2").removeClass("infinite");
                    text = `<span style="font-weight: bold; font-size:14px;">No Price Itinerary</span>`;
                }
                document.getElementById('airline_detail').innerHTML = text;
                $('#loading-search-flight').hide();
                $('#choose-ticket-flight').hide();
                //check here
                text = '[';
                for(i in airline_pick_list){
                    if(i!=0)
                        text+= '&&&';
                    text += JSON.stringify(airline_pick_list[i]);
                }
                text+= ']'
                document.getElementById('airline_pick').value = text;
                get_fare_rules();
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
               alert(errorThrown);
           }
        });

    }
}

function get_fare_rules(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'get_fare_rules',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {
            "promotion_code": [],
            "journeys_booking": JSON.stringify(journey)
       },
       success: function(msg) {
            console.log(msg);
            count_fare = 0;
            text_fare = '<br/><span style="font-weight:bold;"> Term and Condition: </span><br/>';
            if(msg.result.error_code == 0){
                for(i in msg.result.response.fare_rule_provider){
                    for(j in msg.result.response.fare_rule_provider[i].journeys){
                        for(k in msg.result.response.fare_rule_provider[i].journeys[k].rules){
                            text_fare += `<label>`+msg.result.response.fare_rule_provider[i].journeys[j].rules[k]+`</label>`;
                        }
                        document.getElementById('rules'+count_fare).innerHTML = text_fare;
                        count_fare++;
                        text_fare = '';
                    }
                }

            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

function airline_sell_journeys(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'sell_journeys',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {},
       success: function(msg) {
           console.log(msg);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });

}

function airline_create_passengers(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'create_passengers',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {},
       success: function(msg) {
           console.log(msg);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });

}

function airline_ssr(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'ssr',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {},
       success: function(msg) {
           console.log(msg);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });

}

function airline_create_passengers_with_ssr(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'create_passengers',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {},
       success: function(msg) {
           console.log(msg);
           $.ajax({
               type: "POST",
               url: "/webservice/airline",
               headers:{
                    'action': 'ssr',
               },
        //       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
               data: {},
               success: function(msg) {
                   console.log(msg);
               },
               error: function(XMLHttpRequest, textStatus, errorThrown) {
                   alert(errorThrown);
               }
            });
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });

}

function airline_commit_booking(val){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'commit_booking',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {
        'value': val
       },
       success: function(msg) {
           console.log(msg);
           if(msg.result.error_code == 0){
               //send order number
               document.getElementById('airline_booking').innerHTML+= '<input type="hidden" name="order_number" value='+msg.result.response.order_number+'>';
               document.getElementById('airline_booking').submit();
           }else{
               alert(msg.result.error_msg);
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

function airline_hold_booking(val){
    airline_update_contact_booker(val);
}

function airline_update_passenger(val){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'update_contacts',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {},
       success: function(msg) {
           console.log(msg);
           if(msg.result.error_code == 0){
                airline_commit_booking(val);
           }else{
               alert(msg.result.error_msg);
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

function airline_update_contact_booker(val){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'update_passengers',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {},
       success: function(msg) {
           console.log(msg);
           if(msg.result.error_code == 0){
                airline_update_passenger(val);
           }else{
               alert(msg.result.error_msg);
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

function airline_get_booking(data){
    console.log('airline_get_booking');
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'get_booking',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {
            'order_number': data
       },
       success: function(msg) {
           console.log(msg);
           //get booking view edit here
           if(msg.result.error_code == 0){

            var passenger = {adult:0,child:0,infant:0}
            for(i in msg.result.response.passengers){
                if(msg.result.response.passengers[i].pax_type == 'ADT')
                    passenger.adult++;
                else if(msg.result.response.passengers[i].pax_type == 'CHD')
                    passenger.child++;
                else
                    passenger.infant++;
            }

            var text = `
            <div class="col-lg-12" style="border:1px solid #f15a22; padding:10px; background-color:white; margin-top:20px; margin-bottom:20px;">
                <table style="width:100%;">
                    <tr>
                        <th>PNR</th>
                        <th>Hold Date</th>
                        <th>Status</th>
                    </tr>`;
                    for(i in msg.result.response.pnrs){
                    text+=`<tr>
                        <td>`+msg.result.response.pnrs[i].pnr+`</td>
                        <td>`+msg.result.response.pnrs[i].hold_date+`</td>
                        <td id='pnr'>`+msg.result.response.pnrs[i].status+`</td>
                    </tr>`;
                    }
            text+=`</table>
            </div>

            <div style="background-color:#f15a22;">
                <center>
                    <span style="color:white; font-size:16px;"> Flight Detail <img style="width:18px;" src="/static/tt_website_skytors/images/icon/plane.png"/></span>
                </center>
            </div>

            <div style="background-color:white; border:1px solid #f15a22;">
                <div class="row">
                    <div class="col-lg-12">
                        <div style="padding:10px; background-color:white;">`;
                    for(i in msg.result.response.journeys){
                        var cabin_class = '';

                        if(i ==0)
                            text+=`
                                <h5>Departure</h5>`;
                        else
                            text+=`<br/><h5>Return</h5>`;

                        for(j in msg.result.response.journeys[i].segments){
                            //yang baru harus diganti
                            if(msg.result.response.journeys[i].segments[j].class_of_service == 'Y')
                                cabin_class = 'Economy Class';
                            else if(msg.result.response.journeys[i].segments[j].class_of_service == 'W')
                                cabin_class = 'Premium Economy Class';
                            else if(msg.result.response.journeys[i].segments[j].class_of_service == 'B')
                                cabin_class = 'Business Class';
                            else if(msg.result.response.journeys[i].segments[j].class_of_service == 'F')
                                cabin_class = 'First Class';
//                                if(cabin_class_types[k][0] == msg.result.response.journeys[i].segments[j].cabin_class){
//                                    cabin_class = cabin_class_types[k][1];
//                                    break;
//                                }

                            text+= `
                            <div class="row">
                                <div class="col-lg-12">
                                    <img data-toggle="tooltip" style="width:50px; height:50px;" title="`+airline_carriers[msg.result.response.journeys[i].segments[j].carrier_code]+`" class="airline-logo" src="http://static.skytors.id/`+msg.result.response.journeys[i].segments[j].carrier_code+`.png"/>
                                </div>
                            </div>`;
                            text+=`<h5>`+msg.result.response.journeys[i].segments[j].carrier.name+' '+msg.result.response.journeys[i].segments[j].carrier.code+`</h5>
                            <span>Class : `+msg.result.response.journeys[i].segments[j].class_of_service+` (`+cabin_class+`)</span><br/>
                            <div class="row">
                                <div class="col-lg-6 col-xs-6">
                                    <table style="width:100%">
                                        <tr>
                                            <td><h6>`+msg.result.response.journeys[i].segments[j].origin.code+`</h6></td>
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
                                    <span>`+msg.result.response.journeys[i].segments[j].origin.name+` - `+msg.result.response.journeys[i].segments[j].origin.city+`</span><br/>
                                    <span>Schedule departure</span><br>
                                    <span>`+msg.result.response.journeys[i].segments[j].departure_date+` `+msg.result.response.journeys[i].segments[j].departure_time+`</span>
                                </div>

                                <div class="col-lg-6 col-xs-6" style="padding:0;">
                                    <table style="width:100%; margin-bottom:6px;">
                                        <tr>
                                            <td><h6>`+msg.result.response.journeys[i].segments[j].destination.code+`</h6></td>
                                            <td></td>
                                            <td style="height:30px;padding:0 15px;width:100%"></td>
                                        </tr>
                                    </table>
                                    <span>`+msg.result.response.journeys[i].segments[j].destination.name+` - `+msg.result.response.journeys[i].segments[j].destination.city+`</span><br/>
                                    <span>Schedule arrival</span><br>
                                    <span>`+msg.result.response.journeys[i].segments[j].arrival_date+` `+msg.result.response.journeys[i].segments[j].arrival_time+`</span>
                                </div>
                            </div>`;
                        }
                    }
            text+=`
                        </div>
                    </div>
                </div>
            </div>

            <div style="background-color:#f15a22; margin-top:20px;">
                <center>
                    <span style="color:white; font-size:16px;"> List of Passenger <i class="fas fa-users"></i></span>
                </center>
            </div>

            <div style="border:1px solid #f15a22; padding:10px; background-color:white;">

            <table style="width:100%" id="list-of-passenger">
                <tr>
                    <th style="width:10%;" class="list-of-passenger-left">No</th>
                    <th style="width:40%;">Name</th>
                    <th style="width:20%;">Type</th>
                    <th style="width:30%;">Birth Date</th>
                </tr>`;
                for(pax in msg.result.response.passengers){
                    text+=`<tr>
                        <td class="list-of-passenger-left">`+(parseInt(pax)+1)+`</td>
                        <td>`+msg.result.response.passengers[pax].title+` `+msg.result.response.passengers[pax].first_name+` `+msg.result.response.passengers[pax].last_name+`</td>
                        <td>`+msg.result.response.passengers[pax].pax_type+`</td>
                        <td>`+msg.result.response.passengers[pax].birth_date+`</td>
                    </tr>`;
                }

                text+=`</table>
                </div>
            </div>

            <div class="row" style="margin-top:20px;">
                <div class="col-lg-4" style="padding-bottom:10px;">`;
                        if (msg.result.response.state  != 'booked'){
                            text+=`
                            <a href="#" id="seat-map-link" class="hold-seat-booking-train ld-ext-right" style="color:white;">
                                <input type="button" id="button-choose-print" class="primary-btn" style="width:100%;" value="Print Ticket" onclick=""/>
                                <div class="ld ld-ring ld-cycle"></div>
                            </a>`;
                        }
                    text+=`
                </div>
                <div class="col-lg-4" style="padding-bottom:10px;">`;
                        if (msg.result.response.state  == 'booked'){
                            text+=`
                            <a class="print-booking-train ld-ext-right" style="color:white;">
                                <input type="button" class="primary-btn" id="button-print-print" style="width:100%;" value="Print Form" onclick="" />
                                <div class="ld ld-ring ld-cycle"></div>
                            </a>`;
                        }
                        else{
                            text+=`
                            <a class="print-booking-train ld-ext-right" style="color:white;">
                                <input type="button" class="primary-btn" id="button-print-print" style="width:100%;" value="Print Ticket (with Price)" onclick="" />
                                <div class="ld ld-ring ld-cycle"></div>
                            </a>`;
                        }
                        text+=`
                    </a>
                </div>
                <div class="col-lg-4" style="padding-bottom:10px;">`;
                        if (msg.result.response.state  == 'booked'){
                            text+=`
                            <a class="issued-booking-train ld-ext-right" style="color:white;">
                                <input type="button" class="primary-btn" id="button-issued-print" style="width:100%;" value="Issued" onclick="airline_issued('`+msg.result.response.name+`');"/>
                                <div class="ld ld-ring ld-cycle"></div>
                            </a>`;
                        }
                        else{
                            text+=`
                            <a class="issued-booking-train ld-ext-right" style="color:white;">
                                <input type="button" class="primary-btn" id="button-issued-print" style="width:100%;" value="Print Invoice" onclick=""/>
                                <div class="ld ld-ring ld-cycle"></div>
                            </a>`;
                        }
                        text+=`
                    </a>
                </div>
            </div>`;
            document.getElementById('airline_booking').innerHTML = text;

            //detail
            text = '';
            commission = 0;
            total_price = 0;
            roc_adult = 0;
            roc_child = 0;
            text+=`
                <div style="background-color:#f15a22; margin-top:20px;">
                    <center>
                        <span style="color:white; font-size:16px;"> Price Detail <i class="fas fa-money-bill-wave"></i></span>
                    </center>
                </div>
                <div style="background-color:white; padding:15px; border: 1px solid #f15a22;">`;

            for(i in msg.result.response.itinerary_price){
                if(msg.result.response.itinerary_price[i].charge_code == 'r.oc'){
                    if(msg.result.response.itinerary_price[i].pax_type == 'ADT'){
                        roc_adult+=passenger.adult*parseInt(msg.result.response.itinerary_price[i].amount);
                    }else if(msg.result.response.itinerary_price[i].pax_type == 'CHD'){
                        roc_child+=passenger.adult*parseInt(msg.result.response.itinerary_price[i].amount);
                    }
                }
            }
            for(i in msg.result.response.itinerary_price){
                if(msg.result.response.itinerary_price[i].charge_code == 'fare'){
                    if(msg.result.response.itinerary_price[i].pax_type == 'ADT'){
                        text+=`
                        <div class="row" style="margin-bottom:5px;">
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                                <span style="font-size:13px;">`+passenger.adult+'x Adult '+msg.result.response.itinerary_price[i].charge_code+`</span>
                            </div>
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                                <span style="font-size:13px;">IDR `+getrupiah(passenger.adult*parseInt(msg.result.response.itinerary_price[i].amount))+`</span>
                            </div>
                        </div>`;
                        total_price+=passenger.adult*parseInt(msg.result.response.itinerary_price[i].amount);
                    }

                }else if(msg.result.response.itinerary_price[i].charge_code == 'tax'){
                    if(msg.result.response.itinerary_price[i].pax_type == 'ADT'){
                        text+=`
                        <div class="row" style="margin-bottom:5px;">
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                                <span style="font-size:13px;">Tax Adult</span>
                            </div>
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                                <span style="font-size:13px;">IDR `+getrupiah(passenger.adult*parseInt(msg.result.response.itinerary_price[i].amount+roc_adult))+`</span>
                            </div>
                        </div>`;
                        total_price+=passenger.adult*parseInt(msg.result.response.itinerary_price[i].amount+roc_adult);
                    }
                }
            }

            for(i in msg.result.response.itinerary_price){
                if(msg.result.response.itinerary_price[i].charge_code == 'r.ac'){
                    commission += msg.result.response.itinerary_price[i].amount;
                }
                else if(msg.result.response.itinerary_price[i].charge_code == 'fare'){
                    if(msg.result.response.itinerary_price[i].pax_type == 'CHD'){
                        text+=`
                        <div class="row" style="margin-bottom:5px;">
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                                <span style="font-size:13px;">`+passenger.child+'x Child '+msg.result.response.itinerary_price[i].charge_code+`</span>
                            </div>
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                                <span style="font-size:13px;">IDR `+getrupiah(passenger.child*msg.result.response.itinerary_price[i].amount)+`</span>
                            </div>
                        </div>`;
                        total_price+=passenger.child*msg.result.response.itinerary_price[i].amount;
                    }

                }else if(msg.result.response.itinerary_price[i].charge_code == 'tax'){
                    if(msg.result.response.itinerary_price[i].pax_type == 'CHD'){
                        text+=`
                        <div class="row" style="margin-bottom:5px;">
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                                <span style="font-size:13px;">Tax Child</span>
                            </div>
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                                <span style="font-size:13px;">IDR `+getrupiah(passenger.child*(msg.result.response.itinerary_price[i].amount+roc_child))+`</span>
                            </div>
                        </div>`;
                        total_price+=passenger.child*(msg.result.response.itinerary_price[i].amount+roc_child);
                    }
                }
            }

            for(i in msg.result.response.itinerary_price){
                if(msg.result.response.itinerary_price[i].charge_code == 'inf'){
                    text+=`
                    <div class="row" style="margin-bottom:5px;">
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                            <span style="font-size:13px;">`+passenger.infant+`x Infant </span>
                        </div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                            <span style="font-size:13px;">IDR `+getrupiah(passenger.infant*msg.result.response.itinerary_price[i].amount)+`</span>
                        </div>
                    </div>`;
                    total_price+=passenger.infant*msg.result.response.itinerary_price[i].amount;

                }
            }

            text+=`
            <div>
                <hr/>
            </div>
            <div class="row" style="margin-bottom:10px;">
                <div class="col-lg-6 col-xs-6" style="text-align:left;">
                    <span style="font-size:13px; font-weight: bold;">Grand Total</span>
                </div>
                <div class="col-lg-6 col-xs-6" style="text-align:right;">
                    <span style="font-size:13px; font-weight: bold;">IDR `+getrupiah(total_price)+`</span>
                </div>
            </div>

            <div class="row" id="show_commission" style="display:none;">
                <div class="col-lg-12 col-xs-12" style="text-align:center;">
                    <div class="alert alert-success">
                        <span style="font-size:13px;">Your Commission: IDR `+getrupiah(parseInt(commission*-1)  )+`</span><br>
                    </div>
                </div>
            </div>`;
            text+=`<center><div style="margin-bottom:5px;"><input class="primary-btn-ticket" id="show_commission_button" style="width:100%;" type="button" onclick="show_commission();" value="Show Commission"/></div></div>`;
            document.getElementById('airline_detail').innerHTML = text;
            loadingReviewHide();
            if (msg.result.response.state != 'booked'){
                document.getElementById('issued-breadcrumb').classList.add("active");
            }

           }else{
               alert(msg.result.error_msg);
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

function airline_issued(data){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'issued',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {
           'order_number': data
       },
       success: function(msg) {
           console.log(msg);
           if(msg.result.error_code == 0){

           }else{
               alert(msg.result.error_msg);
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });

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

function gotoForm(){
    document.getElementById('airline_searchForm').submit();
}