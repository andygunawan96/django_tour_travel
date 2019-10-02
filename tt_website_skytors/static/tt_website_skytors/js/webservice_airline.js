var airline_data = [];
var airline_data_show = [];
var airline_data_filter = [];
var airline_pick_list = [];
var airline_provider_list_mc = [];
var airline_cookie = '';
var airline_sid = '';
var dep_price = [];
var ret_price = [];
var journey = [];
var value_pick = [];
var carrier_code = [];
var check = 0;
var count = 0;
var count_progress_bar_airline = 0;
var check_airline_pick = 0;
var pnr_list = [];
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
           console.log('signin airline');
           console.log(msg);
           airline_signature = msg.result.response.signature;
           signature = msg.result.response.signature;
           if(data == ''){
               temp = get_provider_list();

           }else if(data != ''){
               airline_get_booking(data);
           }
//            document.getElementById('train_searchForm').submit();
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           //alert(errorThrown);
          $("#barFlightSearch").hide();
          $("#waitFlightSearch").hide();

          Swal.fire({
              type: 'error',
              title: 'Oops...',
              text: 'Something went wrong, please try again or check your connection internet',
            })
       },timeout: 30000
    });

}

function get_carrier_code_list(type, val){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'get_carrier_code_list',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
           console.log(msg);
           airline_provider_list = msg;
           if(type != 'search'){
               text = `
                    <li>
                        <a class="small" data-value="option1" tabIndex="-1">
                            <label class="check_box_custom">
                                <span class="span-search-ticket" style="color:black;">All</span>`;
                                if(val == undefined)
                                text+=`
                                    <input type="checkbox" id="provider_box_All" name="provider_box_All" value="all" checked="checked" onclick="check_provider('all')"/>`;
                                else
                                text+=`
                                    <input type="checkbox" id="provider_box_All_`+val+`" name="provider_box_All_`+val+`" value="all" checked="checked" onclick="check_provider('all',`+val+`)"/>`;
                                text+=`
                                <span class="check_box_span_custom"></span>
                            </label>
                        </a>
                        <br/>
                    </li>
               `;
               for(i in msg){
                    text+=`
                        <li>
                            <a class="small" data-value="option1" tabIndex="-1">
                                <label class="check_box_custom">
                                    <span class="span-search-ticket" style="color:black;">`+msg[i].name+`</span>`;
                                    if(val == undefined)
                                    text+=`
                                        <input type="checkbox" id="provider_box_`+msg[i].code+`" name="provider_box_`+msg[i].code+`" value="`+msg[i].code+`" onclick="check_provider('`+msg[i].code+`')"/>`;
                                    else
                                    text+=`
                                        <input type="checkbox" id="provider_box_`+msg[i].code+`_`+val+`" name="provider_box_`+msg[i].code+`_`+val+`" value="`+msg[i].code+`" onclick="check_provider('`+msg[i].code+`',`+val+`)"/>`;
                                    text+=`
                                    <span class="check_box_span_custom"></span>
                                </label>
                            </a>
                            <br/>
                        </li>
                    `;
               }
           }else{
               try{
                   text = `
                    <li>
                        <a class="small" data-value="option1" tabIndex="-1">
                            <label class="check_box_custom">
                                <span class="span-search-ticket" style="color:black;">All</span>`;
                                if(val == undefined)
                                text+=`
                                    <input type="checkbox" id="provider_box_All" name="provider_box_All" value="all" checked="checked" onclick="check_provider('all')"/>`;
                                else
                                    if(airline_carriers[val-1]['All'].bool == true)
                                        text+=`
                                            <input type="checkbox" id="provider_box_All_`+val+`" name="provider_box_All_`+val+`" value="all" checked="checked" onclick="check_provider('all',`+val+`)"/>`;
                                    else
                                        text+=`
                                            <input type="checkbox" id="provider_box_All_`+val+`" name="provider_box_All_`+val+`" value="all" onclick="check_provider('all',`+val+`)"/>`;
                                text+=`
                                <span class="check_box_span_custom"></span>
                            </label>
                        </a>
                        <br/>
                    </li>`;
                   for(i in msg){
                        text+=`
                            <li>
                                <a class="small" data-value="option1" tabIndex="-1">
                                    <label class="check_box_custom">
                                        <span class="span-search-ticket" style="color:black;">`+msg[i].name+`</span>`;
                                        if(val == undefined)
                                        text+=`
                                            <input type="checkbox" id="provider_box_`+msg[i].code+`" name="provider_box_`+msg[i].code+`" value="`+msg[i].code+`" onclick="check_provider('`+msg[i].code+`')"/>`;
                                        else
                                            if(airline_carriers[val][msg[i].code].bool == true)
                                                text+=`
                                                    <input type="checkbox" id="provider_box_`+msg[i].code+`_`+val+`" name="provider_box_`+msg[i].code+`_`+val+`" value="`+msg[i].code+`" onclick="check_provider('`+msg[i].code+`',`+val+`)" checked="checked"/>`;
                                            else
                                                text+=`
                                                    <input type="checkbox" id="provider_box_`+msg[i].code+`_`+val+`" name="provider_box_`+msg[i].code+`_`+val+`" value="`+msg[i].code+`" onclick="check_provider('`+msg[i].code+`',`+val+`)"/>`;
                                        text+=`
                                        <span class="check_box_span_custom"></span>
                                    </label>
                                </a>
                                <br/>
                            </li>`;
                   }
               }catch(err){
                   text = `
                    <li>
                        <a class="small" data-value="option1" tabIndex="-1">
                            <label class="check_box_custom">
                                <span class="span-search-ticket" style="color:black;">All</span>`;
                                if(val == undefined)
                                text+=`
                                    <input type="checkbox" id="provider_box_All" name="provider_box_All" value="all" checked="checked" onclick="check_provider('all')"/>`;
                                else
                                text+=`
                                    <input type="checkbox" id="provider_box_All_`+val+`" name="provider_box_All_`+val+`" value="all" checked="checked" onclick="check_provider('all',`+val+`)"/>`;
                                text+=`
                                <span class="check_box_span_custom"></span>
                            </label>
                        </a>
                        <br/>
                    </li>`;
                   for(i in msg){
                        text+=`
                            <li>
                                <a class="small" data-value="option1" tabIndex="-1">
                                    <label class="check_box_custom">
                                        <span class="span-search-ticket" style="color:black;">`+msg[i].name+`</span>`;
                                        if(val == undefined)
                                        text+=`
                                            <input type="checkbox" id="provider_box_`+msg[i].code+`" name="provider_box_`+msg[i].code+`" value="`+msg[i].code+`" onclick="check_provider('`+msg[i].code+`')"/>`;
                                        else
                                        text+=`
                                            <input type="checkbox" id="provider_box_`+msg[i].code+`_`+val+`" name="provider_box_`+msg[i].code+`_`+val+`" value="`+msg[i].code+`" onclick="check_provider('`+msg[i].code+`',`+val+`)"/>`;
                                        text+=`
                                        <span class="check_box_span_custom"></span>
                                    </label>
                                </a>
                                <br/>
                            </li>`;
                   }
               }
           }
           if(val == undefined)
               try{
                   document.getElementById('provider_flight_content').innerHTML = text;
               }catch(err){

               }
           else
               document.getElementById('provider_flight_content'+val).innerHTML = text;
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
          Swal.fire({
              type: 'error',
              title: 'Oops...',
              text: 'Something went wrong, please try again or check your connection internet',
            })

       },timeout: 30000
    });

}

function get_provider_list(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'get_provider_list',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
           console.log(msg);
           provider_list = JSON.parse(msg);
           carrier_to_provider();
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           Swal.fire({
              type: 'error',
              title: 'Oops...',
              text: 'Something went wrong, please try again or check your connection internet',
            })
           $("#barFlightSearch").hide();
           $("#waitFlightSearch").hide();
           document.getElementById("airlines_error").innerHTML = '';
            text = '';
            text += `
                <div class="alert alert-warning" style="border:1px solid #cdcdcd;" role="alert">
                    <span style="font-weight:bold;"> Oops! Something went wrong, please try again or check your connection internet</span>
                </div>
            `;
            var node = document.createElement("div");
            node.innerHTML = text;
            document.getElementById("airlines_error").appendChild(node);
            node = document.createElement("div");
       },timeout: 30000
    });

}

function carrier_to_provider(){
    //MC
    airline = [];
    for(i in airline_carriers){
        airline.push({});
        for(j in airline_carriers[i]){
            if(airline_carriers[i][j].code == 'all' && airline_carriers[i][j].bool == true){
                for(k in provider_list){
                    airline[i][k] = [];
                    for(l in provider_list[k]){
                        airline[i][k].push(provider_list[k][l]);
                    }
                }
                break;
            }else if(airline_carriers[i][j].bool == true){
                try{
                    airline[i][airline_carriers[i][j].code] = provider_list[airline_carriers[i][j].code];
                }catch(err){

                }
            }
        }
    }
    provider_airline = []
    for(i in airline){
        provider_airline.push({});
        for(j in airline[i]){
            check = 0;
            for(l in provider_airline){
                if(provider_airline[j] == airline[i][j])
                    check = 1;
            }
            if(check == 0){
                for(k in airline[i][j]){
                    provider_airline[i][airline[i][j][k]] = [];
                }
            }
        }
    }
    console.log(provider_airline);
    for(i in airline){
        for(j in airline[i]){
            for(k in airline[i][j]){
                for(l in provider_airline[i]){
                    if(l == airline[i][j][k])
                        provider_airline[i][l].push(j);
                    }
            }
        }
    }
    send_search_to_api();
}

function send_search_to_api(val){
    airline_choose = 0;

    count_progress_bar_airline = 0;
    if(airline_request.direction == 'RT' && counter_search == 0){
        document.getElementById('show_origin_destination').innerHTML = `<span style="font-weight:600; font-size:14px;" title="`+airline_request.origin[counter_search]+` > `+airline_request.destination[counter_search]+`"> `+airline_request.origin[counter_search].split(' - ')[2] + ` (`+airline_request.origin[counter_search].split(' - ')[0]+`) <i class="fas fa-long-arrow-alt-right"></i> `+airline_request.destination[counter_search].split(' - ')[2]+` (`+airline_request.destination[counter_search].split(' - ')[0]+`)</span>`;
        date_show = `<i class="fas fa-calendar-alt"></i> `+airline_request.departure[counter_search];
        if(airline_request.departure[counter_search] != airline_request['return'][counter_search]){
            date_show += ` - `+airline_request['return'][counter_search];
        }
        document.getElementById('show_date').innerHTML = date_show;
    }else if(airline_request.direction != 'RT'){
        document.getElementById('show_origin_destination').innerHTML = `<span style="font-weight:600; font-size:14px;" title="`+airline_request.origin[counter_search]+` > `+airline_request.destination[counter_search]+`"> `+airline_request.origin[counter_search].split(' - ')[2] + ` (`+airline_request.origin[counter_search].split(' - ')[0]+`) <i class="fas fa-long-arrow-alt-right"></i> `+airline_request.destination[counter_search].split(' - ')[2]+` (`+airline_request.destination[counter_search].split(' - ')[0]+`)</span>`;
        date_show = `<i class="fas fa-calendar-alt"></i> `+airline_request.departure[counter_search];
        if(airline_request.departure[counter_search] != airline_request['return'][counter_search]){
            date_show += ` - `+airline_request['return'][counter_search];
        }
        document.getElementById('show_date').innerHTML = date_show;
    }
    if(val == undefined){
        for(j in provider_airline[counter_search]){
            airline_search(j,provider_airline[counter_search][j]);
        }
        var bar1 = new ldBar("#barFlightSearch");
        var bar2 = document.getElementById('barFlightSearch').ldBar;
        bar1.set((airline_choose/count_progress_bar_airline)*100);
        if ((airline_choose/count_progress_bar_airline)*100 == 100){
            $("#barFlightSearch").hide();
            $("#waitFlightSearch").hide();
        }
        document.getElementById('barFlightSearch').style.display = "block";
        document.getElementById('waitFlightSearch').style.display = "block";
    }else{
        if(val == 0){
            for(j in provider_airline[val]){
                airline_search(j,provider_airline[val][j]);
            }
            var bar1 = new ldBar("#barFlightSearch");
            var bar2 = document.getElementById('barFlightSearch').ldBar;
            bar1.set((airline_choose/count_progress_bar_airline)*100);
            if ((airline_choose/count_progress_bar_airline)*100 == 100){
                $("#barFlightSearch").hide();
                $("#waitFlightSearch").hide();
            }
            document.getElementById('barFlightSearch').style.display = "block";
            document.getElementById('waitFlightSearch').style.display = "block";
        }
    }
    counter_search++;
}

function get_airline_config(type, val){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'get_data',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
            console.log(msg);
            new_airline_destination = [];
            for(i in msg){
                new_airline_destination.push(msg[i].code+' - '+ msg[i].name+` - `+msg[i].city +' - '+msg[i].country);
            }

       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
          Swal.fire({
              type: 'error',
              title: 'Oops...',
              text: 'Something went wrong, please try again or check your connection internet',
            })
       },timeout: 30000
    });
}

function airline_search(provider,carrier_codes){
    document.getElementById("airlines_ticket").innerHTML = '';
    getToken();
    count_progress_bar_airline++;
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'search',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {
           'provider': provider,
           'carrier_codes': JSON.stringify(carrier_codes),
           'counter_search': counter_search,
           'signature': airline_signature
       },
       success: function(msg) {
       console.log(msg);
           if(msg.error_code == 0){
              try{
                  datasearch2(msg.response);
                  airline_choose++;
                  var bar1 = new ldBar("#barFlightSearch");
                  var bar2 = document.getElementById('barFlightSearch').ldBar;
                  bar1.set((airline_choose/count_progress_bar_airline)*100);
                  if ((airline_choose/count_progress_bar_airline)*100 == 100){
                    $("#barFlightSearch").hide();
                    $("#waitFlightSearch").hide();
                  }

              }catch(err){
                  datasearch2(msg.response);
                      airline_choose++;
                      var bar1 = new ldBar("#barFlightSearch");
                      var bar2 = document.getElementById('barFlightSearch').ldBar;
                      bar1.set((airline_choose/count_progress_bar_airline)*100);
                      if ((airline_choose/count_progress_bar_airline)*100 == 100){
                        $("#barFlightSearch").hide();
                        $("#waitFlightSearch").hide();
                      }
              }
           }else{

              airline_choose++;
              var bar1 = new ldBar("#barFlightSearch");
              var bar2 = document.getElementById('barFlightSearch').ldBar;
              bar1.set((airline_choose/count_progress_bar_airline)*100);
              if ((airline_choose/count_progress_bar_airline)*100 == 100){
                $("#barFlightSearch").hide();
                $("#waitFlightSearch").hide();
              }
           }
           if (count_progress_bar_airline == airline_choose && airline_data.length == 0){
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
                   else if(airline_carriers[0][obj.segments[0].carrier_code] == undefined)
                       check=1;
               });
               if(check == 0){
                   var node = document.createElement("div");
                   node.innerHTML = `<div class="checkbox-inline1">
                   <label class="check_box_custom">
                        <span class="span-search-ticket" style="color:black;">`+airline_carriers[0][obj.segments[0].carrier_code].name+`</span>
                        <input type="checkbox" id="checkbox_airline`+airline_list_count+`" onclick="change_filter('airline',`+airline_list_count+`);"/>
                        <span class="check_box_span_custom"></span>
                    </label><br/>
                   </div>`;
                   document.getElementById("airline_list").appendChild(node);
                   node = document.createElement("div");

                   var node2 = document.createElement("div");
                   node2.innerHTML = `<div class="checkbox-inline1">
                   <label class="check_box_custom">
                        <span class="span-search-ticket" style="color:black;">`+airline_carriers[0][obj.segments[0].carrier_code].name+`</span>
                        <input type="checkbox" id="checkbox_airline2`+airline_list_count+`" onclick="change_filter('airline',`+airline_list_count+`);"/>
                        <span class="check_box_span_custom"></span>
                    </label><br/>
                   </div>`;
                   document.getElementById("airline_list2").appendChild(node2);
                   node2 = document.createElement("div");

                   carrier_code.push({
                       airline:airline_carriers[0][obj.segments[0].carrier_code],
                       code:obj.segments[0].carrier_code,
                       status: false,
                       key: airline_list_count
                   });
                   airline_list_count++;
               }

           });
//            document.getElementById('train_searchForm').submit();
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
        airline_choose++;
        var bar1 = new ldBar("#barFlightSearch");
        var bar2 = document.getElementById('barFlightSearch').ldBar;
        bar1.set((airline_choose/count_progress_bar_airline)*100);
        if ((airline_choose/count_progress_bar_airline)*100 == 100){
          $("#barFlightSearch").hide();
          $("#waitFlightSearch").hide();
        }
       if (count_progress_bar_airline == airline_choose && airline_data.length == 0){
           Swal.fire({
              type: 'error',
              title: 'Oops '+errorThrown+' ...',
              text: 'Something went wrong, please try again or check your connection internet',
            })
           $("#barFlightSearch").hide();
           $("#waitFlightSearch").hide();
           document.getElementById("airlines_error").innerHTML = '';
            text = '';
            text += `
                <div class="alert alert-warning" style="border:1px solid #cdcdcd;" role="alert">
                    <span style="font-weight:bold;"> Oops `+errorThrown+`! Something went wrong, please try again or check your connection internet</span>
                </div>
            `;
            var node = document.createElement("div");
            node.innerHTML = text;
            document.getElementById("airlines_error").appendChild(node);
            node = document.createElement("div");
        }
       },timeout: 60000 // sets timeout to 60 seconds
    });

}

function datasearch2(airline){
   data = [];
   data_show = [];
   text = '';
   var counter = 0;
   for(i in airline_data){
       data.push(airline_data[i]);
       if(airline_data[i].origin == airline_request.origin[counter_search-1].substr(airline_request.origin[counter_search-1].length-4,3) && airline_departure == 'departure')
           data_show.push(airline_data[i]);
       else if(airline_data[i].origin == airline_request.destination[counter_search-1].substr(airline_request.origin[counter_search-1].length-4,3) && airline_departure == 'return')
           data_show.push(airline_data[i]);
       counter++;
   }
   for(i in airline.journey_list){
        for(j in airline.journey_list[i].journeys){
           airline.journey_list[i].journeys[j].sequence = counter;
           airline.journey_list[i].journeys[j].journey_type = airline.journey_list[i].journey_type;
           price = 0;
           currency = '';
           airline.journey_list[i].journeys[j].operated_by = true;
           can_book = false;
           for(k in airline.journey_list[i].journeys[j].segments){
               for(l in airline.journey_list[i].journeys[j].segments[k].fares){
                   if(airline.journey_list[i].journeys[j].segments[k].fares[l].available_count >= parseInt(airline_request.adult)+parseInt(airline_request.child) || airline.journey_list[i].journeys[j].segments[k].fares[l].available_count == -1){//atau buat sia
                       airline.journey_list[i].journeys[j].segments[k].fare_pick = parseInt(k);
                       for(m in airline.journey_list[i].journeys[j].segments[k].fares[l].service_charge_summary){
                           if(airline.journey_list[i].journeys[j].segments[k].fares[l].service_charge_summary[m].pax_type == 'ADT'){
                               for(n in airline.journey_list[i].journeys[j].segments[k].fares[l].service_charge_summary[m].service_charges){
                                   if(airline.journey_list[i].journeys[j].segments[k].fares[l].service_charge_summary[m].service_charges[n].charge_code != 'rac' && airline.journey_list[i].journeys[j].segments[k].fares[l].service_charge_summary[m].service_charges[n].charge_code != 'rac1' && airline.journey_list[i].journeys[j].segments[k].fares[l].service_charge_summary[m].service_charges[n].charge_code && 'rac2'){
                                       price += airline.journey_list[i].journeys[j].segments[k].fares[l].service_charge_summary[m].service_charges[n].amount;
                                       currency = airline.journey_list[i].journeys[j].segments[k].fares[l].service_charge_summary[m].service_charges[n].currency;
                                       can_book = true;
                                   }
                               }
                           }
                       }
                       break;
                   }else{
                       //testing sia
                       airline.journey_list[i].journeys[j].segments[k].fare_pick = 0;
                       can_book = true;
                   }
               }

               if(airline.journey_list[i].journeys[j].segments[k].carrier_code == airline.journey_list[i].journeys[j].segments[k].operating_airline_code && airline.journey_list[i].journeys[j].operated_by != false){
                   airline.journey_list[i].journeys[j].operated_by_carrier_code = airline.journey_list[i].journeys[j].segments[k].operating_airline_code;
               }else if(airline.journey_list[i].journeys[j].segments[k].carrier_code != airline.journey_list[i].journeys[j].segments[k].operating_airline_code){
                   airline.journey_list[i].journeys[j].operated_by_carrier_code = airline.journey_list[i].journeys[j].segments[k].operating_airline_code;
                   airline.journey_list[i].journeys[j].operated_by = false;
               }
           }
           airline.journey_list[i].journeys[j].total_price = price;
           airline.journey_list[i].journeys[j].can_book = can_book;
           airline.journey_list[i].journeys[j].currency = currency;
           data.push(airline.journey_list[i].journeys[j]);
           counter++;
        }
   }

   airline_data = data;
   sorting_value = 'price';
   sort_button('price');
//   filtering('filter');
}

function change_fare(journey, segment, fares){
    price = 0;
    for(i in airline_data[journey].segments){
        var radios = document.getElementsByName('journey'+journey+'segment'+(parseInt(i)+1)+'fare');

        for (var j = 0, length = radios.length; j < length; j++) {
            if (radios[j].checked) {
                // do whatever you want with the checked radio
                temp = document.getElementById('journey'+journey+'segment'+(parseInt(i)+1)+'fare'+(parseInt(j)+1)).innerHTML;
                price += parseInt(temp.replace( /[^\d.]/g, '' ));
                airline_data[journey].segments[i].fare_pick = parseInt(j);
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
    if(check_airline_pick == 1 && airline_request.direction == 'OW'){
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
    }
    else if(check_airline_pick == 1 && airline_request.direction == 'RT'){
        if(value_pick.length != 0){
            try{
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
    else if(check_airline_pick == 1 && airline_request.direction == 'MC'){
        if(value_pick.length != 0){
            try{
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
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    document.getElementById("airline_detail").innerHTML = "";
    choose_airline = val;
    provider = '';
    for(i in airline_data_filter[val].segments){
        var radios = document.getElementsByName('journey'+val+'segment'+i+'fare');
        //get fare checked
        for (var j = 0, length = radios.length; j < length; j++) {
            if (radios[j].checked) {
                // do whatever you want with the checked radio
                fare = parseInt(radios[j].value)-1;
                // only one radio can be logically checked, don't check the rest
                break;
            }
        }
        //give fare pick
        airline_data_filter[val].segments[i].fare_pick = fare;
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
            'journey_type': airline_data_filter[val].segments[i].journey_type,
            'fare_code': fare_code,
            'class_of_service': class_of_service,
//            "fare_code": fare_code,
            "fare_pick": parseInt(airline_data_filter[val].segments[i].fare_pick),
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
    if(airline_request.direction == 'OW'){
        journey.push({'segments':segment, 'provider': provider});
    }else if(airline_request.direction == 'RT' && airline_data_filter[val].journey_type == "COM"){
        journey.push({'segments':segment, 'provider': provider});
    }else if(airline_request.direction == 'RT' && journey.length == 0){
        airline_pick_mc('change');
        journey.push({'segments':segment, 'provider': provider});
        document.getElementById("airlines_ticket").innerHTML = '';
        data_show = [];
        airline_departure = 'return';
        filtering('filter');
        var total_price = 0;

    }
    else if(airline_request.direction == 'RT' && journey.length == 1){
        journey.push({'segments':segment, 'provider': provider});

    }
    else if(airline_request.direction == 'MC' && airline_data_filter[val].journey_type == "COM")
        journey.push({'segments':segment, 'provider': provider});
    else if(airline_request.direction == 'MC' && journey.length != airline_request.counter){
        journey.push({'segments':segment, 'provider': provider,'sequence': counter_search-1});
    }
    else if(airline_request.direction == 'MC' && journey.length == airline_request.counter){
        temp_journey = [];
        temp_journey.push(journey[0]);
        temp_journey.push({'segments':segment, 'provider': provider,'sequence': counter_search-1});
        journey = temp_journey;
    }

    check = 0;
    //change view
    if(airline_request.direction == 'RT' && airline_data_filter[val].journey_type == "COM"){
        airline_pick_mc('change');
        check_airline_pick = 1;
        document.getElementById("badge-flight-notif").innerHTML = "1";
        document.getElementById("badge-flight-notif2").innerHTML = "1";
        $("#badge-flight-notif").addClass("infinite");
        $("#badge-flight-notif2").addClass("infinite");
        $("#myModalTicketFlight").modal('show');
        $('#loading-search-flight').show();
        $('#choose-ticket-flight').hide();
    }
    else if(airline_request.direction == 'OW'){
        airline_pick_mc('change');
        check_airline_pick = 1;
        document.getElementById("badge-flight-notif").innerHTML = "1";
        document.getElementById("badge-flight-notif2").innerHTML = "1";
        $("#badge-flight-notif").addClass("infinite");
        $("#badge-flight-notif2").addClass("infinite");
        $("#myModalTicketFlight").modal('show');
        $('#loading-search-flight').show();
        $('#choose-ticket-flight').hide();
    }
    else if(airline_request.direction == 'RT' && journey.length == 2){
        airline_pick_mc('change');
        check_airline_pick = 1;
        document.getElementById("badge-flight-notif").innerHTML = "1";
        document.getElementById("badge-flight-notif2").innerHTML = "1";
        $("#badge-flight-notif").addClass("infinite");
        $("#badge-flight-notif2").addClass("infinite");
        $("#myModalTicketFlight").modal('show');
        $('#loading-search-flight').show();
        $('#choose-ticket-flight').hide();
    }
    else if(airline_request.direction == 'MC' && airline_data_filter[val].journey_type == "COM"){
        airline_pick_mc('change');
        check_airline_pick = 1;
        document.getElementById("badge-flight-notif").innerHTML = "1";
        document.getElementById("badge-flight-notif2").innerHTML = "1";
        $("#badge-flight-notif").addClass("infinite");
        $("#badge-flight-notif2").addClass("infinite");
        $("#myModalTicketFlight").modal('show');
        $('#loading-search-flight').show();
        $('#choose-ticket-flight').hide();
    }
    else if(airline_request.direction == 'MC' && parseInt(airline_request.counter) == journey.length){
        airline_pick_mc('all');
        check_airline_pick = 1;
        document.getElementById("badge-flight-notif").innerHTML = "1";
        document.getElementById("badge-flight-notif2").innerHTML = "1";
        $("#badge-flight-notif").addClass("infinite");
        $("#badge-flight-notif2").addClass("infinite");
        $("#myModalTicketFlight").modal('show');
        $('#loading-search-flight').show();
        $('#choose-ticket-flight').hide();
        counter_search = parseInt(airline_request.counter) - 1;
        filtering('filter');
    }
    else if(airline_request.direction == 'MC' && airline_request.counter != journey.length){
        document.getElementById("airline_ticket_pick").innerHTML = '';
        airline_pick_mc('all');
        send_search_to_api(counter_search);
        filtering('filter');
    }
    if(check_airline_pick == 1){
        if(airline_request.direction == 'MC'){
//            RESTRUCTURE
            for(i in journey){
                for(j in journey){
                    if(journey[i].sequence < journey[j].sequence){
                        temp = {
                            'airline_pick_list':airline_pick_list[i],
                            'journey':journey[i]
                        }
                        airline_pick_list[i] = airline_pick_list[j];
                        journey[i] = journey[j];
                        airline_pick_list[j] = temp.airline_pick_list;
                        journey[j] = temp.journey
                    }
                }
            }
            airline_pick_mc('all');
        }
        get_price_itinerary_request();
    }
}

function get_price_itinerary_request(){
    separate = false;
    try{
        if(document.getElementsByName('myRadios')[0].checked == true)
            separate = true;
        else
            separate = false;
    }catch(err){

    }
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
          "journeys_booking": JSON.stringify(journey),
          'signature': airline_signature,
          'separate_journey': separate
       },
       success: function(resJson) {
           console.log(resJson);
           price_type = {};
           airline_price = [];
           if(resJson.result.error_code == 0 && resJson.result.response.price_itinerary_provider.length!=0){
                for(i in resJson.result.response.price_itinerary_provider){
                    for(j in resJson.result.response.price_itinerary_provider[i].price_itinerary){
                        for(k in resJson.result.response.price_itinerary_provider[i].price_itinerary[j].segments){
                            for(l in resJson.result.response.price_itinerary_provider[i].price_itinerary[j].segments[k].fares){
                                for(m in resJson.result.response.price_itinerary_provider[i].price_itinerary[j].segments[k].fares[l].service_charge_summary){
                                    if(m == 0)
                                        airline_price.push({});
                                    for(n in resJson.result.response.price_itinerary_provider[i].price_itinerary[j].segments[k].fares[l].service_charge_summary[m].service_charges){
                                        price_type[resJson.result.response.price_itinerary_provider[i].price_itinerary[j].segments[k].fares[l].service_charge_summary[m].service_charges[n].charge_code] = resJson.result.response.price_itinerary_provider[i].price_itinerary[j].segments[k].fares[l].service_charge_summary[m].service_charges[n].amount;
                                    }
                                    price_type['currency'] = resJson.result.response.price_itinerary_provider[i].price_itinerary[j].segments[k].fares[l].service_charge_summary[m].service_charges[n].currency;
                                    airline_price[airline_price.length-1][resJson.result.response.price_itinerary_provider[i].price_itinerary[j].segments[k].fares[l].service_charge_summary[m].pax_type] = price_type;
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
                <div class="col-lg-12">
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="alert alert-warning" role="alert">
                                <span style="font-weight:bold;"> Please check before going to the next page!</span>
                            </div>
                        </div>
                        <div class="col-lg-12" style="max-height:400px; overflow-y: auto;">
                            <div class="row">`;
                flight_count = 0;
                for(i in resJson.result.response.price_itinerary_provider){
                    for(j in resJson.result.response.price_itinerary_provider[i].price_itinerary){
                        text+=`
                        <div class="col-lg-12">`;
                        if(resJson.result.response.price_itinerary_provider[i].price_itinerary[j].journey_type == 'COM'){
                            text += `<h6>Combo Price</h6>`;
                            $text +='Combo Price\n';
                        }
                        else if(resJson.result.response.price_itinerary_provider[i].price_itinerary[j].journey_type == 'DEP'){
                            text += `<h6>Departure</h6>`;
                            if(airline_request.direction != 'MC'){
                                $text +='Departure\n';
                            }
                            else{
                                $text +='Flight'+parseInt(flight_count+1)+'\n';
                                flight_count++;
                            }
                        }else{
                            text += `<hr/><h6>Return</h6>`;
                            if(airline_request.direction != 'MC'){
                                $text +='\nReturn\n';
                            }
                            else{
                                $text +='Flight'+parseInt(flight_count+1)+'\n';
                                flight_count++;
                            }
                        }
                        text+=`</div>
                        <div class="col-lg-3">`;
                        //logo
                        for(k in resJson.result.response.price_itinerary_provider[i].price_itinerary[j].carrier_code_list){ //print gambar airline
                            try{
                                text+=`
                                <span style="font-weight: 500; font-size:12px;">`+airline_carriers[0][resJson.result.response.price_itinerary_provider[i].price_itinerary[j].carrier_code_list[k]].name+`</span><br/>
                                <img data-toggle="tooltip" title="`+airline_carriers[0][resJson.result.response.price_itinerary_provider[i].price_itinerary[j].carrier_code_list[k]]+`" style="width:50px; height:50px;" src="http://static.skytors.id/`+resJson.result.response.price_itinerary_provider[i].price_itinerary[j].carrier_code_list[k]+`.png"><span> </span>`;
                            }catch(err){
                                text+=`<img data-toggle="tooltip" title="" style="width:50px; height:50px;" src="http://static.skytors.id/`+resJson.result.response.price_itinerary_provider[i].price_itinerary[j].carrier_code_list[k]+`.png"><span> </span>`;
                            }
                        }
                        text+=`</div>`;
                        text+=`<div class="col-lg-9">`;
                        for(k in resJson.result.response.price_itinerary_provider[i].price_itinerary[j].segments){
                            if(resJson.result.response.price_itinerary_provider[i].price_itinerary[j].journey_type == 'COM'){
                                text += `<h6 style="color:#f15a22;">Flight `+parseInt(flight_count+1)+`</h6>`;
                                $text +='Flight'+parseInt(flight_count+1)+'\n';
                                flight_count++;
                            }
                            //datacopy
                            if(resJson.result.response.price_itinerary_provider[i].price_itinerary[j].segments[k].journey_type == 'DEP'){
                                $text += airline_carriers[0][resJson.result.response.price_itinerary_provider[i].price_itinerary[j].segments[k].carrier_code].name + ' ' + resJson.result.response.price_itinerary_provider[i].price_itinerary[j].segments[k].carrier_code + resJson.result.response.price_itinerary_provider[i].price_itinerary[j].segments[k].carrier_number + '\n';
                                $text += resJson.result.response.price_itinerary_provider[i].price_itinerary[j].segments[k].departure_date + ' → ' + resJson.result.response.price_itinerary_provider[i].price_itinerary[j].segments[k].arrival_date + '\n';
                                $text += resJson.result.response.price_itinerary_provider[i].price_itinerary[j].segments[k].origin_name + ' (' + resJson.result.response.price_itinerary_provider[i].price_itinerary[j].segments[k].origin_city + ') - ';
                                $text += resJson.result.response.price_itinerary_provider[i].price_itinerary[j].segments[k].destination_name + ' (' + resJson.result.response.price_itinerary_provider[i].price_itinerary[j].segments[k].destination_city + ')\n\n';
                            }
                            else if(resJson.result.response.price_itinerary_provider[i].price_itinerary[j].segments[k].journey_type == 'RET'){
                                $text += airline_carriers[0][resJson.result.response.price_itinerary_provider[i].price_itinerary[j].segments[k].carrier_code].name + ' ' + resJson.result.response.price_itinerary_provider[i].price_itinerary[j].segments[k].carrier_code + resJson.result.response.price_itinerary_provider[i].price_itinerary[j].segments[k].carrier_number + '\n';
                                $text += resJson.result.response.price_itinerary_provider[i].price_itinerary[j].segments[k].departure_date + ' → ' + resJson.result.response.price_itinerary_provider[i].price_itinerary[j].segments[k].arrival_date + '\n';
                                $text += resJson.result.response.price_itinerary_provider[i].price_itinerary[j].segments[k].origin_name + ' (' + resJson.result.response.price_itinerary_provider[i].price_itinerary[j].segments[k].origin_city + ') - ';
                                $text += resJson.result.response.price_itinerary_provider[i].price_itinerary[j].segments[k].destination_name + ' (' + resJson.result.response.price_itinerary_provider[i].price_itinerary[j].segments[k].destination_city + ')\n\n';
                            }
                            for(l in resJson.result.response.price_itinerary_provider[i].price_itinerary[j].segments[k].legs){
                                text+=`
                                    <div class="row">
                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                            <table style="width:100%">
                                                <tr>
                                                    <td class="airport-code"><h5>`+resJson.result.response.price_itinerary_provider[i].price_itinerary[j].segments[k].legs[l].departure_date.split(' - ')[1]+`</h5></td>
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
                                            <span style="font-size:13px;">`+resJson.result.response.price_itinerary_provider[i].price_itinerary[j].segments[k].legs[l].departure_date.split(' - ')[0]+`</span></br>
                                            <span style="font-size:13px; font-weight:500;">`+resJson.result.response.price_itinerary_provider[i].price_itinerary[j].segments[k].legs[l].origin_city+` (`+resJson.result.response.price_itinerary_provider[i].price_itinerary[j].segments[k].legs[l].origin+`)</span>
                                        </div>
                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                            <table style="width:100%; margin-bottom:6px;">
                                                <tr>
                                                    <td><h5>`+resJson.result.response.price_itinerary_provider[i].price_itinerary[j].segments[k].legs[l].arrival_date.split(' - ')[1]+`</h5></td>
                                                    <td></td>
                                                    <td style="height:30px;padding:0 15px;width:100%"></td>
                                                </tr>
                                            </table>
                                            <span style="font-size:13px;">`+resJson.result.response.price_itinerary_provider[i].price_itinerary[j].segments[k].legs[l].arrival_date.split(' - ')[0]+`</span><br/>
                                            <span style="font-size:13px; font-weight:500;">`+resJson.result.response.price_itinerary_provider[i].price_itinerary[j].segments[k].legs[l].destination_city+` (`+resJson.result.response.price_itinerary_provider[i].price_itinerary[j].segments[k].legs[l].destination+`)</span>
                                        </div>
                                    </div>`;
                            }
                            if(k == resJson.result.response.price_itinerary_provider[i].price_itinerary[j].segments.length - 1)
                                text+=`</div>`;
                            if(resJson.result.response.price_itinerary_provider[i].price_itinerary[j].segments[k].fares.length > 0 ){
                                for(l in resJson.result.response.price_itinerary_provider[i].price_itinerary[j].segments[k].fares){
                                    if(resJson.result.response.price_itinerary_provider[i].price_itinerary[j].segments[k].fares[l].service_charge_summary.length > 0){
                                    //term n condition
                                        text+=`
                                        <div class="col-lg-12" id="rules`+rules+`" style="padding-bottom:15px; padding-top:15px;">
                                            <span style="font-weight:bold; color:#f15a22;"> Term and Condition </span><br/>
                                            <span style="font-size:16px; font-weight:bold;">PLEASE WAIT </span><img src="/static/tt_website_skytors/img/plane_loading.gif" style="height:50px; width:50px;"/>
                                        </div>`;
                                rules++;
                                //price
                                price = 0;
                                //adult
                                $text+= 'Price\n';

                                        try{//adult
                                            if(airline_request.adult != 0){
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
                                                <div class="col-lg-12">
                                                    <div class="row">
                                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                                                            <span style="font-size:13px; font-weight:500;">`+airline_request.adult+`x Adult Fare @`+airline_price[i].ADT.currency +' '+getrupiah(Math.ceil(airline_price[i].ADT.fare))+`</span><br/>
                                                        </div>
                                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                                                            <span style="font-size:13px; font-weight:500;">`+getrupiah(Math.ceil(airline_price[i].ADT.fare * airline_request.adult))+`</span>
                                                        </div>
                                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                                                            <span style="font-size:13px; font-weight:500;">`+airline_request.adult+`x Service Charge</span>
                                                        </div>
                                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                                                            <span style="font-size:13px; font-weight:500;">`+getrupiah(Math.ceil(price * airline_request.adult))+`</span>
                                                        </div>
                                                    </div>
                                                </div>`;
                                                $text += airline_request.adult + ' Adult Fare @'+ airline_price[i].ADT.currency +' '+getrupiah(Math.ceil(airline_price[i].ADT.fare))+'\n';
                                                $text += airline_request.adult + ' Adult Tax @'+ airline_price[i].ADT.currency +' '+getrupiah(Math.ceil(price))+'\n';
                                                price = 0;
                                            }
                                        }catch(err){
                                            continue
                                        }

                                        try{//child
                                            if(airline_request.child != 0){
                                                try{
                                                    if(airline_price[i].CHD['roc'] != null)
                                                        price = airline_price[i].CHD['roc'];
                                                    if(airline_price[i].CHD.tax != null)
                                                        price += airline_price[i].CHD.tax;
                                                }catch(err){

                                                }
                                                commission = 0;
                                                if(airline_price[i].CHD['rac'] != null)
                                                    commission = airline_price[i].CHD['rac'];
                                                commission_price += airline_request.child * commission;
                                                total_price += airline_request.child * (airline_price[i].CHD['fare'] + price);
                                                text+=`
                                                <div class="col-lg-12">
                                                    <div class="row">
                                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                                                            <span style="font-size:13px; font-weight:500;">`+airline_request.child+`x Child Fare @`+airline_price[i].CHD.currency+' '+getrupiah(Math.ceil(airline_price[i].CHD.fare))+`</span><br/>
                                                        </div>
                                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                                                            <span style="font-size:13px; font-weight:500;">`+getrupiah(Math.ceil(airline_price[i].CHD.fare * airline_request.child))+`</span>
                                                        </div>
                                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                                                            <span style="font-size:13px; font-weight:500;">`+airline_request.adult+`x Service Charge</span>
                                                        </div>
                                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                                                            <span style="font-size:13px; font-weight:500;">`+getrupiah(Math.ceil(price * airline_request.child))+`</span>
                                                        </div>
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
                                            if(airline_request.infant != 0){
                                                price = 0;
                                                try{
                                                    if(airline_price[i].INF['roc'] != null)
                                                        price = airline_price[i].INF['roc'];
                                                    if(airline_price[i].INF.tax != null)
                                                        price += airline_price[i].INF.tax;
                                                }catch(err){

                                                }
                                                commission = 0;
                                                try{
                                                    if(airline_price[i].INF['rac'] != null)
                                                        commission = airline_price[i].INF['rac'];
                                                }catch(err){

                                                }
                                                commission_price += airline_request.infant * commission;
                                                total_price += airline_request.infant * (airline_price[i].INF['fare'] + price);
                                                text+=`
                                                <div class="col-lg-12">
                                                    <div class="row">
                                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                                                            <span style="font-size:13px; font-weight:500;">`+airline_request.infant+`x Infant Fare @`+airline_price[i].INF.currency+' '+getrupiah(Math.ceil(airline_price[i].INF.fare))+`</span><br/>
                                                        </div>
                                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                                                            <span style="font-size:13px; font-weight:500;">`+getrupiah(Math.ceil(airline_price[i].INF.fare * airline_request.infant))+`</span>
                                                        </div>
                                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                                                            <span style="font-size:13px; font-weight:500;">`+airline_request.infant+`x Service Charge</span>
                                                        </div>
                                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                                                            <span style="font-size:13px; font-weight:500;">`+getrupiah(Math.ceil(price * airline_request.infant))+`</span>
                                                        </div>
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
                            }
                        }

                    }
                }

                text+=`
                    </div>
                </div>
                <div class="col-lg-12">
                    <hr/>
                    <div class="row">
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                            <span style="font-size:14px; font-weight: bold;"><b>Total</b></span>
                        </div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                            <span style="font-size:14px; font-weight: bold;"><b>`+airline_price[0].ADT.currency+` `+getrupiah(Math.ceil(total_price))+`</b></span>
                        </div>
                    </div>
                </div>

                <div class="col-lg-12" style="padding-bottom:10px;">
                <hr/>
                <span style="font-size:14px; font-weight:bold;">Share This on:</span><br/>`;
                $text += 'Grand Total: IDR '+ getrupiah(Math.ceil(total_price)) + '\n\nPrices and availability may change at any time';
                share_data();
                var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                if (isMobile) {
                    text+=`
                        <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/whatsapp.png"/></a>
                        <a href="line://msg/text/`+ $text_share +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/line.png"/></a>
                        <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/telegram.png"/></a>
                        <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/email.png"/></a>`;
                } else {
                    text+=`
                        <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/whatsapp.png"/></a>
                        <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/line.png"/></a>
                        <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/telegram.png"/></a>
                        <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/email.png"/></a>`;
                }

                text+=`
                    </div>
                    <div class="col-lg-12" style="text-align:center; display:none;" id="show_commission">
                        <div class="alert alert-success">
                            <span style="font-size:13px; font-weight: bold;">Your Commission: IDR `+getrupiah(commission_price*-1)+`</span><br>
                        </div>
                    </div>`;
                text+=`
                    <div class="col-lg-4 col-md-4 col-sm-4" style="padding-bottom:5px;">
                        <input class="primary-btn" style="width:100%;" type="button" onclick="copy_data();" value="Copy">
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-4" style="padding-bottom:5px;">
                        <input class="primary-btn" id="show_commission_button" style="width:100%;" type="button" onclick="show_commission('commission');" value="Show Commission"><br/>
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-4" style="padding-bottom:5px;">
                        <button class="primary-btn btn-next ld-ext-right" style="width:100%;" onclick="next_disabled(); airline_sell_journeys();" type="button" value="Next">
                            Next
                            <div class="ld ld-ring ld-cycle"></div>
                        </button>
                    </div>`;
                text+=`</div>`;

                document.getElementById('airline_detail').innerHTML = text;
                $('.btn-next').prop('disabled', true);
                $('#loading-search-flight').hide();
                $('#choose-ticket-flight').hide();
                //check here
                text = '[';
                for(i in resJson.result.response.price_itinerary_provider){
                    if(i!=0)
                        text+= '&&&';
                    text += JSON.stringify(resJson.result.response.price_itinerary_provider[i]);
                }
                text+= ']';
                document.getElementById('airline_pick').value = text;
                get_fare_rules();

            }else if(resJson.result.error_code == 4003){
                logout();
            }else{
                document.getElementById("badge-flight-notif").innerHTML = "0";
                document.getElementById("badge-flight-notif2").innerHTML = "0";
                $("#badge-flight-notif").removeClass("infinite");
                $("#badge-flight-notif2").removeClass("infinite");
                text = `<span style="font-weight: bold; font-size:14px;">No Price Itinerary</span>`;
                document.getElementById('airline_detail').innerHTML = text;
                $('#loading-search-flight').hide();
                $('#choose-ticket-flight').hide();
            }

       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           document.getElementById("badge-flight-notif").innerHTML = "0";
           document.getElementById("badge-flight-notif2").innerHTML = "0";
           $("#badge-flight-notif").removeClass("infinite");
           $("#badge-flight-notif2").removeClass("infinite");
           text = `<span style="font-weight: bold; font-size:14px;">No Price Itinerary</span>`;
           document.getElementById('airline_detail').innerHTML = text;
           $('#loading-search-flight').hide();
           $('#choose-ticket-flight').hide();
           Swal.fire({
              type: 'error',
              title: 'Oops...',
              text: 'Something went wrong, please try again or check your connection internet',
           })
       },timeout: 30000
    });
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
            "journeys_booking": JSON.stringify(journey),
            'signature': airline_signature
       },
       success: function(msg) {
            console.log(msg);
            count_fare = 0;
            text_fare = '';
            if(msg.result.error_code == 0){
                for(i in msg.result.response.fare_rule_provider){
                    if(msg.result.response.fare_rule_provider[i].hasOwnProperty('journeys') == true){
                        for(j in msg.result.response.fare_rule_provider[i].journeys){
                            text_fare+=`
                            <span id="span-tac-up`+count_fare+`" style="font-size:14px;font-weight:bold; color:#f15a22; display:none; cursor:pointer;" onclick="show_hide_tac(`+count_fare+`);"> Show Term and Condition <i class="fas fa-chevron-down"></i></span>
                            <span id="span-tac-down`+count_fare+`" style="font-size:14px;font-weight:bold; color:#f15a22; display:block; cursor:pointer;" onclick="show_hide_tac(`+count_fare+`);"> Hide Term and Condition <i class="fas fa-chevron-up"></i></span>
                            <div id="div-tac`+count_fare+`" style="display:block;">`;
                            for(k in msg.result.response.fare_rule_provider[i].journeys[j].rules){
                                if(msg.result.response.fare_rule_provider[i].journeys[j].rules[k] != ""){
                                    text_fare += `<span style="font-weight:400;"><i class="fas fa-circle" style="font-size:9px;"></i> `+msg.result.response.fare_rule_provider[i].journeys[j].rules[k]+`</span><br/>`;
                                }
                            }
                            if(msg.result.response.fare_rule_provider[i].journeys[j].rules.length == 0)
                                text_fare += `<span style="font-weight:400;"><i class="fas fa-circle" style="font-size:9px;"></i> No fare rules</span><br/>`;
                            text_fare+=`</div>`;
                            try{
                                document.getElementById('rules'+count_fare).innerHTML = text_fare;
                            }catch(err){

                            }
                            text_fare = '';
                        }
                        count_fare++;
                    }else{
                        try{
                            for(var i=0;i<100;i++)//hardcode
                                document.getElementById('rules'+i).innerHTML = 'No fare rules';
                        }catch(err){

                        }
                    }

                }

            }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                logout();
            }else{
                try{
                    for(var i=0;i<100;i++)//hardcode
                        document.getElementById('rules'+i).innerHTML = 'No fare rules';
                }catch(err){

                }
            }
            $('.btn-next').prop('disabled', false);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           try{
                for(var i=0;i<100;i++)//hardcode
                    document.getElementById('rules'+i).innerHTML = '<b>Oops! Something went wrong, please choose / change again and check your connection internet</b>';
            }catch(err){

            }
       },timeout: 30000
    });
}

function airline_sell_journeys(){
    $('.loader-airline').fadeIn();
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'sell_journeys',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {
            'signature': airline_signature
       },
       success: function(msg) {
           console.log(msg);
           if(msg.result.error_code == 0){
               get_seat_availability('');
//               document.getElementById('time_limit_input').value = time_limit
//               document.getElementById('go_to_passenger').submit();
           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                logout();
           }else{
                alert(msg.result.error_msg);
                $('.btn-next').removeClass('running');
                $('.btn-next').prop('disabled', false);
                $('.loader-airline').fadeOut();
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           Swal.fire({
              type: 'error',
              title: 'Oops...',
              text: 'Something went wrong, please try again or check your connection internet',
           })
           $('.btn-next').removeClass('running');
           $('.btn-next').prop('disabled', false);
           $('.loader-airline').fadeOut();
       },timeout: 30000
    });

}
//get seat map
function get_seat_availability(type){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'get_seat_availability',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {
            'signature': airline_signature
       },
       success: function(msg) {
            console.log(msg);
            if(type == '')
                get_ssr_availabilty(type);
            else if(type == 'request_new_seat' && msg.result.error_code == 0)
                window.location.href='/airline/seat_map';
            else
                alert(msg.result.error_msg);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
          Swal.fire({
              type: 'error',
              title: 'Oops...',
              text: 'Something went wrong, please try again or check your connection internet',
           })
       },timeout: 30000
    });
}

function get_seat_map_response(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'get_seat_map_response',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {},
       success: function(msg) {
            console.log(msg);
            seat_map = msg;
            check = 0;
            text = '<div class="col-lg-12"> <div class="row">';
            percent = 0;
            segment_list = []
            for(i in seat_map.seat_availability_provider){
                percent += seat_map.seat_availability_provider[i].segments.length;
            }
            percent = 75 / percent;
            for(i in seat_map.seat_availability_provider){
                for(j in seat_map.seat_availability_provider[i].segments){
                    if(i == 0 && j == 0){
                        set_seat_show_segments = seat_map.seat_availability_provider[i].segments[j].segment_code2;
                        segment_list.push(seat_map.seat_availability_provider[i].segments[j].segment_code2);
                        text += `
                        <div class="col-lg-4 col-md-6 col-sm-6 col-xs-6">
                            <button class="button-seat-pass" style="width:100%; margin-right:10px; margin-bottom:10px; padding:10px;" type="button" id="`+seat_map.seat_availability_provider[i].segments[j].segment_code2+`" onclick="show_seat_map('`+seat_map.seat_availability_provider[i].segments[j].segment_code2+`', false)">
                                <span>`+seat_map.seat_availability_provider[i].segments[j].segment_code2+`</span>
                            </button>
                        </div>`;
                    }else
                    text += `
                    <div class="col-lg-4 col-md-6 col-sm-6 col-xs-6">
                        <button class="button-seat-pass" style="width:100%; margin-right:10px; margin-bottom:10px; padding:10px; color:black; background-color:white;" id="`+seat_map.seat_availability_provider[i].segments[j].segment_code2+`" type="button" onclick="show_seat_map('`+seat_map.seat_availability_provider[i].segments[j].segment_code2+`', false)">
                            <span>`+seat_map.seat_availability_provider[i].segments[j].segment_code2+`</span>
                        </button>
                    </div>`;
                }
            }
            text += '</div></div>';
            document.getElementById('airline_seat_map').innerHTML = text;
            show_seat_map(set_seat_show_segments, true)
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
          Swal.fire({
              type: 'error',
              title: 'Oops...',
              text: 'Something went wrong, please try again or check your connection internet',
           })
       },timeout: 30000
    });
}

function show_seat_map(val, checked){
    if(val != set_seat_show_segments || checked == true){
        document.getElementById(set_seat_show_segments).style.background = 'white';
        document.getElementById(set_seat_show_segments).style.color = 'black';
        document.getElementById(val).style.background = '#f15a22';
        document.getElementById(val).style.color = 'white';
        set_seat_show_segments = val;
        text = '';
        check = 0;
        for(i in seat_map.seat_availability_provider){
            if(check == 1)
                break;
            for(j in seat_map.seat_availability_provider[i].segments){
                if(seat_map.seat_availability_provider[i].segments[j].segment_code2 == set_seat_show_segments){

                    for(k in seat_map.seat_availability_provider[i].segments[j].seat_cabins){
                        text+=`<div class="mySlides1">
                                    <div style="width:100%;text-align:center;">`;
                        percent = parseInt(75 / seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows.length+1);
                        for(l in seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows){
                            if(l == 0){
                                text+=`<div style="width:100%;text-align:center;">`;
                                for(m in seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats){
                                    if(m == 0)
                                        text+=`<input type="button" style="width:`+(percent)+`%;background-color:transparent;font-size:13px;border:transparent; padding:3px;" id="" disabled/>`;
                                    text+=`<input type="button" style="width:`+(percent+0.5)+`%;background-color:transparent;font-size:13px;border:transparent; padding:3px;" id="" value="`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].column+`" disabled/>`;
//                                    text+=`<label style="width:`+percent+`%;margin:3px;cursor:not-allowed;">`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].column+`</label>`;
                                }
                                text+=`</div>`;
                            }
                            text+=`<div style="width:100%;text-align:center;">`;
                            for(m in seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats){
                                if(m == 0)
                                    text+=`<label style="width:`+percent+`%; color:white; padding:3px;font-size:13px;color:black" id="">`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].row_number+`</label>`;
                                check = 0;
                                for(n in passengers){
                                    if(check == 1)
                                        break;
                                    for(o in passengers[n].seat_list){
                                        if(passenger_pick == n){
                                            if(passengers[n].seat_list[o].segment_code == seat_map.seat_availability_provider[i].segments[j].segment_code2 && seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].row_number+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].column == passengers[n].seat_list[o].seat_pick){
                                                check = 1;
                                                text+=`<input class="button-seat-map" type="button" style="width:`+percent+`%;font-size:13px;background-color:#f15a22; padding:3px;color:white;" onclick="alert('Already booked');" id="`+seat_map.seat_availability_provider[i].segments[j].segment_code2+`_`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].row_number+`_`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].column+`" value="`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].row_number+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].column+`"/>`;
                                                break;
                                            }
                                        }else if(passengers[n].seat_list[o].segment_code == seat_map.seat_availability_provider[i].segments[j].segment_code2 && seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].row_number+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].column == passengers[n].seat_list[o].seat_pick){
                                            console.log('other_pax');
                                            check = 1;
                                            text+=`<input class="button-seat-map" type="button" style="width:`+percent+`%;font-size:13px;background-color:#ff8971; padding:3px;color:white;" onclick="alert('Already booked');" id="`+seat_map.seat_availability_provider[i].segments[j].segment_code2+`_`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].row_number+`_`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].column+`"  value="`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].row_number+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].column+`"/>`;
                                            break;
                                        }
                                    }
                                }
                                if(check == 0){
                                    if(seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].availability == 0)
                                        text+=`<input class="button-seat-map" type="button" style="width:`+percent+`%;font-size:13px;background-color:#656565; color:white; padding:3px;" id="" onclick="alert('Already booked');" value="`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].row_number+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].column+`"/>`;
                                    else if(seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].availability == 1)
                                        text+=`<input class="button-seat-map" type="button" style="width:`+percent+`%;font-size:13px;background-color:#CACACA; padding:3px;" id="`+seat_map.seat_availability_provider[i].segments[j].segment_code2+`_`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].row_number+`_`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].column+`"
                                        onclick="update_seat_passenger('`+seat_map.seat_availability_provider[i].segments[j].segment_code2+`',
                                                                       '`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].row_number+`',
                                                                       '`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].column+`',
                                                                       '`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].seat_code+`',
                                                                       '`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].seat_name+`',
                                                                       '`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].service_charges[0].currency+`',
                                                                       '`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].service_charges[0].amount+`',
                                                                       '`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].description+`')" value="`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].row_number+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].column+`"/>`;
                                    else if(seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].availability == -1)
                                        text+=`<input type="button" style="width:`+percent+`%;background-color:transparent;font-size:13px;border:transparent; padding:3px;" id="" value="" disabled/>`;
                                }
                            }
                            text+=`</div>`;
                        }
                        text+=`
                            </div>
                        </div>`;
                    }

                    check = 1;
                    text+=`<a class="prev" onclick="plusSlides(-1, 0)" style="font-size:15px; padding:0px;">&#10094; Prev</a>
                           <a class="next" onclick="plusSlides(1, 0)" style="font-size:15px; padding:0px;">Next &#10095;</a>`;
                    break;
                }
            }
        }
        document.getElementById('airline_slideshow').innerHTML = text;
        showSlides(1, 0);
    }
}

function set_passenger_seat_map_airline(val){
    additional_price = parseInt(additional_price_fix);
    console.log(additional_price_fix);
    console.log(additional_price);
    text='';
    text += `<hr/><h5 style="color:#f15a22;">`+passengers[val].title+` `+passengers[val].first_name+` `+passengers[val].last_name+`</h5>`;
    for(i in passengers[val].seat_list){
        text+=`<h6 style="padding-top:10px;">`+passengers[val].seat_list[i].segment_code+`: `+passengers[val].seat_list[i].seat_name+` `+passengers[val].seat_list[i].seat_pick+`</h6>`;
        text+=`<span style="font-weight:400; font-size:14px;">Price: `+passengers[val].seat_list[i].currency+` `+passengers[val].seat_list[i].price+`</span><br/><br/>`;
        console.log(passengers[val].seat_list[i].price);
        if(isNaN(parseFloat(passengers[val].seat_list[i].price)) == false)
            additional_price += parseFloat(passengers[val].seat_list[i].price);
        for(j in passengers[val].seat_list[i].description){
            //if(j == 0)
                //text+=`<span style="font-weight:400; font-size:14px;">Description:</span><br/>`;
            text+=`<span>`+passengers[val].seat_list[i].description[j]+`</span><br/>`;
        }
    }
    console.log(additional_price);
    document.getElementById('passenger'+(passenger_pick+1)).style.background = 'white';
    document.getElementById('passenger'+(passenger_pick+1)).style.color = 'black';
    document.getElementById('passenger'+(val+1)).style.background = '#f15a22';
    document.getElementById('passenger'+(val+1)).style.color = 'white';
    passenger_pick = val;
    document.getElementById('airline_passenger_detail_seat').innerHTML = text;
    try{
        show_seat_map(set_seat_show_segments,true);
        console.log('asdasda');
    }catch(err){

    }
    airline_detail(type);
}

function update_seat_passenger(segment, row, column,seat_code,seat_name, currency, amount,description){
    for(i in passengers[passenger_pick].seat_list){
        if(passengers[passenger_pick].seat_list[i].segment_code == segment){
            //lepas passenger seat
            if(passengers[passenger_pick].seat_list[i].seat_pick != ''){
                document.getElementById(segment+'_'+parseInt(passengers[passenger_pick].seat_list[i].seat_pick)+'_'+passengers[passenger_pick].seat_list[i].seat_pick[passengers[passenger_pick].seat_list[i].seat_pick.length-1]).style.background = '#CACACA';
                document.getElementById(segment+'_'+parseInt(passengers[passenger_pick].seat_list[i].seat_pick)+'_'+passengers[passenger_pick].seat_list[i].seat_pick[passengers[passenger_pick].seat_list[i].seat_pick.length-1]).style.color = 'black';
            }
            //pasang passenger seat
            passengers[passenger_pick].seat_list[i].seat_pick = row+column;
            passengers[passenger_pick].seat_list[i].seat_code = seat_code;
            passengers[passenger_pick].seat_list[i].seat_name = seat_name;
            passengers[passenger_pick].seat_list[i].currency = currency;
            passengers[passenger_pick].seat_list[i].price = amount;
            passengers[passenger_pick].seat_list[i].description = description.split(',');
            document.getElementById(segment+'_'+row+'_'+column).style.background = '#f15a22';
            document.getElementById(segment+'_'+row+'_'+column).style.color = 'white';
            break;
        }
    }
    set_passenger_seat_map_airline(passenger_pick);
}

//SSR
function get_ssr_availabilty(type){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'get_ssr_availabilty',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {
            'signature': airline_signature
       },
       success: function(msg) {
            console.log(msg);
            if(type == ''){
                document.getElementById('time_limit_input').value = time_limit;
                document.getElementById('go_to_passenger').submit();
            }else if(type == 'request_new_ssr' && msg.result.error_code == 0)
                window.location.href='/airline/ssr';
            else if(type == 'request_new_ssr')
                alert(msg.result.error_msg);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
          Swal.fire({
              type: 'error',
              title: 'Oops...',
              text: 'Something went wrong, please try again or check your connection internet',
           })
       },timeout: 30000
    });
}


//function airline_create_passengers(){
//    getToken();
//    $.ajax({
//       type: "POST",
//       url: "/webservice/airline",
//       headers:{
//            'action': 'create_passengers',
//       },
////       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
//       data: {
//            'signature': signature
//       },
//       success: function(msg) {
//           if(msg.result.error_code == 0)
//               console.log(msg);
//           else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
//                logout();
//           }else{
//                alert(msg.result.error_msg);
//           }
//       },
//       error: function(XMLHttpRequest, textStatus, errorThrown) {
//           alert(errorThrown);
//       }
//    });
//
//}

//function airline_create_passengers_with_ssr(){
//    getToken();
//    $.ajax({
//       type: "POST",
//       url: "/webservice/airline",
//       headers:{
//            'action': 'create_passengers',
//       },
////       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
//       data: {
//            'signature': signature
//       },
//       success: function(msg) {
//           console.log(msg);
//           $.ajax({
//               type: "POST",
//               url: "/webservice/airline",
//               headers:{
//                    'action': 'ssr',
//               },
//        //       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
//               data: {
//                    'signature': signature
//               },
//               success: function(msg) {
//                   console.log(msg);
//               },
//               error: function(XMLHttpRequest, textStatus, errorThrown) {
//                   alert(errorThrown);
//               }
//            });
//       },
//       error: function(XMLHttpRequest, textStatus, errorThrown) {
//           alert(errorThrown);
//       }
//    });
//
//}

function airline_update_passenger(val){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'update_contacts',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {
            'signature': signature
       },
       success: function(msg) {
           console.log(msg);
           if(msg.result.error_code == 0){
               if(ssr == 0) //set ssr
                airline_set_ssr(val);
               else if(seat == 0)
                airline_assign_seats(val);
               else
                airline_commit_booking(val);
           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                logout();
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
       data: {
            'signature': signature
       },
       success: function(msg) {
           console.log(msg);
           if(msg.result.error_code == 0){
                airline_update_passenger(val);
           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                logout();
           }else{
                alert(msg.result.error_msg);
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
          Swal.fire({
              type: 'error',
              title: 'Oops...',
              text: 'Something went wrong, please try again or check your connection internet',
           })
       },timeout: 30000
    });
}

function airline_set_ssr(val){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'sell_ssrs',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {
            'signature': signature
       },
       success: function(msg) {
           console.log(msg);
           if(seat == 0)
                airline_assign_seats(val);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
          Swal.fire({
              type: 'error',
              title: 'Oops...',
              text: 'Something went wrong, please try again or check your connection internet',
           })
       }, timeout: 30000
    });
}

function airline_assign_seats(val){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'assign_seats',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {
            'signature': signature
       },
       success: function(msg) {
           console.log(msg);
           if(msg.result.error_code == 0)
               airline_commit_booking(val);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
          Swal.fire({
              type: 'error',
              title: 'Oops...',
              text: 'Something went wrong, please try again or check your connection internet',
           })
       },timeout: 30000
    });
}

function airline_commit_booking(val){
    data = {
        'value': val,
        'signature': signature
    }
    try{
        data['seq_id'] = payment_acq2[payment_method][selected].seq_id;
        data['member'] = payment_acq2[payment_method][selected].method;
    }catch(err){
    }
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'commit_booking',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: data,
       success: function(msg) {
           console.log(msg);
           if(msg.result.error_code == 0){
               //send order number
               document.getElementById('airline_booking').innerHTML+= '<input type="hidden" name="order_number" value='+msg.result.response.order_number+'>';
               document.getElementById('airline_booking').submit();
           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                logout();
           }else{
                alert(msg.result.error_msg);
                window.location.href = "/";
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
          Swal.fire({
              type: 'error',
              title: 'Oops...',
              text: 'Something went wrong, please try again or check your connection internet',
           })
       },timeout: 30000
    });
}

function airline_hold_booking(val){
    title = '';
    if(val == 0)
        title = 'Are you sure want to Hold Booking?';
    else if(val == 1)
        title = 'Are you sure want to Force Issued this booking?';
    Swal.fire({
      title: title,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        if (val==0){
            $('.loader-airline').fadeIn();
            $('.next-loading-booking').addClass("running");
            $('.next-loading-booking').prop('disabled', true);
            $('.next-loading-issued').prop('disabled', true);
        }
        else{
            $('.loader-airline').fadeIn();
            $('.next-loading-booking').prop('disabled', true);
            $('.next-loading-issued').addClass("running");
            $('.next-loading-issued').prop('disabled', true);
        }
        airline_update_contact_booker(val);
      }
    })
}

function airline_get_booking(data){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'get_booking',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {
            'order_number': data,
            'signature': airline_signature
       },
       success: function(msg) {
           console.log(msg);


           airline_get_detail = msg;
           //get booking view edit here
           if(msg.result.error_code == 0){
            var text = '';
            $text = '';
            if(msg.result.response.state == 'cancel2' || msg.result.response.state == 'cancel'){
               console.log('here');
               document.getElementById('issued-breadcrumb').classList.remove("br-active");
               document.getElementById('issued-breadcrumb').classList.add("br-fail");
               //document.getElementById('issued-breadcrumb').classList.remove("current");
               //document.getElementById('header_issued').innerHTML = `Fail <i class="fas fa-times"></i>`;
               document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
               document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-fail");
               document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
               document.getElementById('issued-breadcrumb-span').innerHTML = `Fail`;
            }else if(msg.result.response.state != 'issued'){
               get_payment_acq('Issued',msg.result.response.booker.seq_id, msg.result.response.order_number, 'billing',signature,'airline');
               //document.getElementById('issued-breadcrumb').classList.remove("active");
               //document.getElementById('issued-breadcrumb').classList.add("current");
               document.getElementById('issued-breadcrumb').classList.add("br-active");
               document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-active");
            }
            else{
               //document.getElementById('issued-breadcrumb').classList.remove("current");
               //document.getElementById('issued-breadcrumb').classList.add("active");
               document.getElementById('issued-breadcrumb').classList.add("br-active");
               document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-active");
               document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-check"></i>`;
            }

            if(msg.result.response.state != 'fail_booked' || msg.result.response.state != 'fail_issued')
                document.getElementById('ssr_request_after_sales').hidden = true;
            $text += 'Order Number: '+ msg.result.response.order_number + '\n';
            $text += 'Hold Date:\n';
            text += `
            <div class="col-lg-12" style="border:1px solid #cdcdcd; padding:10px; background-color:white; margin-bottom:20px;">
                <h6>Order Number : `+msg.result.response.order_number+`</h6><br/>
                <table style="width:100%;">
                    <tr>
                        <th>PNR</th>
                        <th>Hold Date</th>
                        <th>Status</th>
                    </tr>`;
                    for(i in msg.result.response.provider_bookings){
                        //datetime utc to local
                        if(msg.result.response.provider_bookings[i].error_msg.length != 0)
                            text += `<div class="alert alert-danger">
                                `+msg.result.response.provider_bookings[i].error_msg+`
                                <a href="#" class="close" data-dismiss="alert" aria-label="close" style="margin-top:-25px;">x</a>
                            </div>`;
                        tes = moment.utc(msg.result.response.provider_bookings[i].hold_date).format('YYYY-MM-DD HH:mm:ss')
                        var localTime  = moment.utc(tes).toDate();
                        msg.result.response.provider_bookings[i].hold_date = moment(localTime).format('DD MMM YYYY HH:mm');
                        //
                        $text += msg.result.response.provider_bookings[i].pnr +' ('+msg.result.response.provider_bookings[i].hold_date+')\n';
                        text+=`<tr>
                            <td>`+msg.result.response.provider_bookings[i].pnr+`</td>
                            <td>`+msg.result.response.provider_bookings[i].hold_date+`</td>
                            <td id='pnr'>`+msg.result.response.provider_bookings[i].state_description+`</td>
                        </tr>`;
                    }
                    $text +='\n';
            text+=`</table>
            </div>

            <div style="background-color:white; border:1px solid #cdcdcd;">
                <div class="row">
                    <div class="col-lg-12">
                        <div style="padding:10px; background-color:white;">
                        <h5> Flight Detail <img style="width:18px;" src="/static/tt_website_skytors/images/icon/plane.png"/></h5>
                        <hr/>`;
                    check = 0;
                    flight_counter = 1;
                    for(i in msg.result.response.provider_bookings){
                        for(j in msg.result.response.provider_bookings[i].journeys){
                            var cabin_class = '';

                            if(msg.result.response.provider_bookings[i].journeys[j].journey_type == 'DEP'){
                                text+=`
                                    <h6>Departure</h6>`;
                                $text += 'Departure\n';
                                check = 1;
                            }else if(check == 1 && msg.result.response.provider_bookings[i].journeys[j].journey_type == 'RET'){
                                text+=`<br/><h6>Return</h6>`;
                                $text += 'Return\n';
                                check = 2;
                            }
                            for(k in msg.result.response.provider_bookings[i].journeys[j].segments){
                                if(msg.result.response.provider_bookings[i].journeys[j].journey_type == 'COM'){
                                    text+=`<br/><h6>Flight `+flight_counter+`</h6>`;
                                    $text += 'Flight '+ flight_counter+'\n';
                                    flight_counter++;
                                }
                                //yang baru harus diganti
                                if(msg.result.response.provider_bookings[i].journeys[j].segments[k].cabin_class == 'Y')
                                    cabin_class = 'Economy Class';
                                else if(msg.result.response.provider_bookings[i].journeys[j].segments[k].cabin_class == 'W')
                                    cabin_class = 'Premium Economy Class';
                                else if(msg.result.response.provider_bookings[i].journeys[j].segments[k].cabin_class == 'B')
                                    cabin_class = 'Business Class';
                                else if(msg.result.response.provider_bookings[i].journeys[j].segments[k].cabin_class == 'F')
                                    cabin_class = 'First Class';
                                for(l in msg.result.response.provider_bookings[i].journeys[j].segments[k].legs){
                                    $text += airline_carriers[msg.result.response.provider_bookings[i].journeys[j].segments[k].carrier_code].name+'\n';
                                    if(msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].arrival_date.split('  ')[0] == msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].departure_date.split('  ')[0]){
                                        $text += msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].arrival_date.split('  ')[0]+' ';
                                        $text += msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].arrival_date.split('  ')[1]+' - ';
                                        $text += msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].departure_date.split('  ')[1]+'\n';
                                    }else{
                                        $text += msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].arrival_date.split('  ')[0]+' ';
                                        $text += msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].arrival_date.split('  ')[1]+' - ';
                                        $text += msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].departure_date.split('  ')[0]+' ';
                                        $text += msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].departure_date.split('  ')[1]+'\n';
                                    }
                                    $text += msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].origin_name +' ('+msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].origin_city+') - '+msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].destination_name +' ('+msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].destination_city+')\n\n';

                                    text+= `
                                    <div class="row">
                                        <div class="col-lg-12">
                                            <img data-toggle="tooltip" style="width:50px; height:50px;" title="`+airline_carriers[msg.result.response.provider_bookings[i].journeys[j].segments[k].carrier_code].name+`" class="airline-logo" src="http://static.skytors.id/`+msg.result.response.provider_bookings[i].journeys[j].segments[k].carrier_code+`.png"/>
                                        </div>
                                    </div>`;
                                    text+=`<h5>`+msg.result.response.provider_bookings[i].journeys[j].segments[k].carrier_name+' '+msg.result.response.provider_bookings[i].journeys[j].segments[k].carrier_number+`</h5>
                                    <span>Class : `+cabin_class+` (`+msg.result.response.provider_bookings[i].journeys[j].segments[k].class_of_service+`)</span><br/>
                                    <div class="row">
                                        <div class="col-lg-6 col-xs-6">
                                            <table style="width:100%">
                                                <tr>
                                                    <td><h5>`+msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].departure_date.split('  ')[1]+`</h5></td>
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
                                            <span>`+msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].departure_date.split('  ')[0]+`</span><br/>
                                            <span style="font-weight:500;">`+msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].origin_name+` - `+msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].origin_city+` (`+msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].origin+`)</span>
                                        </div>

                                        <div class="col-lg-6 col-xs-6" style="padding:0;">
                                            <table style="width:100%; margin-bottom:6px;">
                                                <tr>
                                                    <td><h5>`+msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].arrival_date.split('  ')[1]+`</h5></td>
                                                    <td></td>
                                                    <td style="height:30px;padding:0 15px;width:100%"></td>
                                                </tr>
                                            </table>
                                            <span>`+msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].arrival_date.split('  ')[0]+`</span><br/>
                                            <span style="font-weight:500;">`+msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].destination_name+` - `+msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].destination_city+` (`+msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].destination+`)</span>
                                        </div>
                                    </div>`;
                                }
                            }
                        }
                    }
                    text+=`
                        </div>
                    </div>
                </div>
            </div>

            <div style="border:1px solid #cdcdcd; padding:10px; background-color:white; margin-top:20px;">
                <h5> Booker</h5>
                <hr/>
                <table style="width:100%" id="list-of-passenger">
                    <tr>
                        <th style="width:10%;" class="list-of-passenger-left">No</th>
                        <th style="width:40%;">Name</th>
                        <th style="width:30%;">Email</th>
                        <th style="width:30%;">Phone</th>
                    </tr>`;
                    title = '';
                    if(msg.result.response.booker.gender == 'female' && msg.result.response.booker.marital_status == true)
                        title = 'MRS';
                    else if(msg.result.response.booker.gender == 'female' && msg.result.response.booker.marital_status == false)
                        title = 'MS'
                    else
                        title = 'MR';
                    text+=`<tr>
                        <td class="list-of-passenger-left">`+(1)+`</td>
                        <td>`+title+` `+msg.result.response.booker.name+`</td>
                        <td>`+msg.result.response.booker.email+`</td>
                        <td>`+msg.result.response.booker.phones[msg.result.response.booker.phones.length-1].calling_code+' - '+msg.result.response.booker.phones[msg.result.response.booker.phones.length-1].calling_number+`</td>
                    </tr>

                </table>
            </div>
            <div style="border:1px solid #cdcdcd; padding:10px; background-color:white; margin-top:20px;">
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
                        <td>`+msg.result.response.contact.name+`</td>
                        <td>`+msg.result.response.contact.email+`</td>
                        <td>`+msg.result.response.contact.phone+`</td>
                    </tr>
                </table>
            </div>

            <div style="border:1px solid #cdcdcd; padding:10px; background-color:white; margin-top:20px;">
                <h5> List of Passenger</h5>
                <hr/>
                <table style="width:100%" id="list-of-passenger">
                    <tr>
                        <th style="width:10%;" class="list-of-passenger-left">No</th>
                        <th style="width:40%;">Name</th>
                        <th style="width:30%;">Birth Date</th>
                        <th style="width:30%;">Ticket Number</th>
                    </tr>`;
                    for(pax in msg.result.response.passengers){
                        ticket = '';
                        for(provider in msg.result.response.provider_bookings){
                            try{
                                ticket += msg.result.response.provider_bookings[provider].tickets[pax].ticket_number
                                if(provider != msg.result.response.provider_bookings.length - 1)
                                    ticket += ', ';
                            }catch(err){

                            }
                        }
                        text+=`<tr>
                            <td class="list-of-passenger-left">`+(parseInt(pax)+1)+`</td>
                            <td>`+msg.result.response.passengers[pax].title+` `+msg.result.response.passengers[pax].first_name+` `+msg.result.response.passengers[pax].last_name+`</td>
                            <td>`+msg.result.response.passengers[pax].birth_date+`</td>
                            <td id="passenger_ticket_`+parseInt(pax)+`">`+ticket+`</td>
                        </tr>`;
                    }

                text+=`</table>
                </div>
            </div>

            <div class="row" style="margin-top:20px;">
                <div class="col-lg-4" style="padding-bottom:10px;">`;
                    console.log(msg.result.response.state);
                    if(msg.result.response.state != 'cancel' && msg.result.response.state != 'cancel2'){
                        if (msg.result.response.state == 'booked'){
                            text+=`
                            <a href="#" id="seat-map-link" class="hold-seat-booking-train ld-ext-right" style="color:white;" hidden>
                                <input type="button" id="button-choose-print" class="primary-btn" style="width:100%;" value="Print Ticket" onclick=""/>
                                <div class="ld ld-ring ld-cycle"></div>
                            </a>`;
                        }else{
                            text+=`
                            <a href="#" id="seat-map-link" class="hold-seat-booking-train ld-ext-right" style="color:white;">
                                <input type="button" id="button-choose-print" class="primary-btn" style="width:100%;" value="Print Ticket" onclick="window.location.href='https://backend.rodextrip.com/rodextrip/report/pdf/tt.reservation.airline/`+msg.result.response.order_number+`/1'"/>
                                <div class="ld ld-ring ld-cycle"></div>
                            </a>`;
                        }
                    }
                    text+=`
                </div>
                <div class="col-lg-4" style="padding-bottom:10px;">`;
                    if(msg.result.response.state != 'cancel' && msg.result.response.state != 'cancel2'){
                        if (msg.result.response.state  == 'booked'){
                            text+=`
                            <a class="print-booking-train ld-ext-right" style="color:white;">
                                <input type="button" class="primary-btn" id="button-print-print" style="width:100%;" value="Print Form" onclick="window.location.href='https://backend.rodextrip.com/rodextrip/report/pdf/tt.reservation.airline/`+msg.result.response.order_number+`/3'" />
                                <div class="ld ld-ring ld-cycle"></div>
                            </a>`;
                        }
                        else{
                            text+=`
                            <a class="print-booking-train ld-ext-right" style="color:white;">
                                <input type="button" class="primary-btn" id="button-print-print" style="width:100%;" value="Print Ticket (with Price)" onclick="window.location.href='https://backend.rodextrip.com/rodextrip/report/pdf/tt.reservation.airline/`+msg.result.response.order_number+`/2'" />
                                <div class="ld ld-ring ld-cycle"></div>
                            </a>`;
                        }
                    }
                        text+=`
                </div>
                <div class="col-lg-4" style="padding-bottom:10px;">`;
                    if(msg.result.response.state != 'cancel' && msg.result.response.state != 'cancel2'){
                        if (msg.result.response.state  == 'booked'){
                            text+=`
                            <a class="issued-booking-train ld-ext-right" id="print_invoice" style="color:white;" hidden>
                                <input type="button" class="primary-btn" id="button-issued-print" style="width:100%;" value="Issued" onclick=""/>
                                <div class="ld ld-ring ld-cycle"></div>
                            </a>`;
                        }
                        else{
                            text+=`
                            <a class="issued-booking-train ld-ext-right" style="color:white;">
                                <input type="button" class="primary-btn" id="button-issued-print" style="width:100%;" value="Print Invoice" onclick="window.location.href='https://backend.rodextrip.com/rodextrip/report/pdf/tt.reservation.airline/`+msg.result.response.order_number+`/4'"/>
                                <div class="ld ld-ring ld-cycle"></div>
                            </a>`;
                        }
                    }
                        text+=`
                    </a>
                </div>
            </div>`;
            document.getElementById('airline_booking').innerHTML = text;

            //detail
            text = '';
            tax = 0;
            fare = 0;
            total_price = 0;
            commission = 0;
            service_charge = ['FARE', 'RAC', 'ROC', 'TAX'];
            text_detail=`
            <div style="background-color:white; padding:10px; border: 1px solid #cdcdcd; margin-bottom:15px;">
                <h5> Price Detail</h5>
            <hr/>`;

            //repricing
            type_amount_repricing = ['Repricing'];
            //repricing
            counter_service_charge = 0;
            $text += '\nPrice:\n';
            for(i in msg.result.response.passengers[0].sale_service_charges){
                text_detail+=`
                    <div style="text-align:left">
                        <span style="font-weight:500; font-size:14px;">PNR: `+i+` </span>
                    </div>`;
                for(j in msg.result.response.passengers){
                    price = {'FARE': 0, 'RAC': 0, 'ROC': 0, 'TAX':0 , 'currency': '', 'CSC': 0};
                    for(k in msg.result.response.passengers[j].sale_service_charges[i]){
                        price[k] += msg.result.response.passengers[j].sale_service_charges[i][k].amount;
                        price['currency'] = msg.result.response.passengers[j].sale_service_charges[i][k].currency;
                    }
                    try{
                        price['CSC'] = msg.result.response.passengers[j].channel_service_charges.amount;

                    }catch(err){

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
                            'Fare': price['FARE'],
                            'Tax': price['TAX'] + price['ROC'],
                            'Repricing': price['CSC']
                        }
                    }else{
                        price_arr_repricing[msg.result.response.passengers[j].name] = {
                            'Fare': price_arr_repricing[msg.result.response.passengers[j].name]['Fare'] + price['FARE'],
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
                                <div class="col-lg-3" id="`+k+`_`+l+`">`+k+`</div>
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
                            <span style="font-size:13px;">`+price.currency+` `+getrupiah(parseInt(price.FARE))+`</span>
                        </div>
                    </div>
                    <div class="row" style="margin-bottom:5px;">
                        <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                            <span style="font-size:12px;">`+msg.result.response.passengers[j].name+` Tax</span>`;
                        text_detail+=`</div>
                        <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">`;

                        $text += msg.result.response.passengers[j].name + ' Fare ['+i+'] ' + price.currency+` `+getrupiah(parseInt(price.FARE))+'\n';
                        if(counter_service_charge == 0){
                            $text += msg.result.response.passengers[j].name + ' Tax ['+i+'] ' + price.currency+` `+getrupiah(parseInt(price.TAX + price.ROC + price.CSC))+'\n';
                        text_detail+=`
                            <span style="font-size:13px;">`+price.currency+` `+getrupiah(parseInt(price.TAX + price.ROC + price.CSC))+`</span>`;
                        }else{
                            $text += msg.result.response.passengers[j].name + ' Tax ['+i+'] ' + price.currency+` `+getrupiah(parseInt(price.TAX + price.ROC))+'\n';
                            text_detail+=`
                            <span style="font-size:13px;">`+price.currency+` `+getrupiah(parseInt(price.TAX + price.ROC))+`</span>`;
                        }
                        text_detail+=`
                        </div>
                    </div>`;
                    if(counter_service_charge == 0)
                        total_price += parseInt(price.TAX + price.ROC + price.FARE + price.CSC);
                    else
                        total_price += parseInt(price.TAX + price.ROC + price.FARE);
                    commission += parseInt(price.RAC);
                }
                counter_service_charge++;
            }
            try{
                $text += 'Grand Total: '+price.currency+' '+ getrupiah(total_price) + '\n\nPrices and availability may change at any time';
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
                        }catch(err){

                        }
                        text_detail+= `</span>
                    </div>
                </div>`;
                text_detail+=`<div style="text-align:right; padding-bottom:10px;"><img src="/static/tt_website_skytors/img/bank.png" style="width:25px; height:25px; cursor:pointer;" onclick="show_repricing();"/></div>`;
                text_detail+=`<div class="row">
                <div class="col-lg-12" style="padding-bottom:10px;">
                    <hr/>
                    <span style="font-size:14px; font-weight:bold;">Share This on:</span><br/>`;
                    share_data();
                    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                    if (isMobile) {
                        text_detail+=`
                            <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/whatsapp.png"/></a>
                            <a href="line://msg/text/`+ $text_share +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/line.png"/></a>
                            <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/telegram.png"/></a>
                            <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/email.png"/></a>`;
                    } else {
                        text_detail+=`
                            <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/whatsapp.png"/></a>
                            <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/line.png"/></a>
                            <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/telegram.png"/></a>
                            <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_skytors/img/email.png"/></a>`;
                    }

                text_detail+=`
                    </div>
                </div>`;
                text_detail+=`
                <div class="row" id="show_commission" style="display:none;">
                    <div class="col-lg-12 col-xs-12" style="text-align:center;">
                        <div class="alert alert-success">
                            <span style="font-size:13px; font-weight:bold;">Your Commission: `+price.currency+` `+getrupiah(parseInt(commission)*-1)+`</span><br>
                        </div>
                    </div>
                </div>`;
                text_detail+=`<center>

                <div style="padding-bottom:10px;">
                    <center>
                        <input type="button" class="primary-btn-ticket" style="width:100%;" onclick="copy_data();" value="Copy"/>
                    </center>
                </div>
                <div style="margin-bottom:5px;">
                    <input class="primary-btn-ticket" id="show_commission_button" style="width:100%;" type="button" onclick="show_commission('commission');" value="Show Commission"/>
                </div>
            </div>`;
            }catch(err){

            }
            try{
                testing_price = price.currency;
                text += text_detail;
            }catch(err){

            }

            document.getElementById('airline_detail').innerHTML = text;
            $("#show_loading_booking_airline").hide();

            //
            text = `
            <div class="modal fade" id="myModal" role="dialog">
                <div class="modal-dialog">

                    <!-- Modal content-->
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title" style="color:white;">Price Change <i class="fas fa-money"></i></h4>
                            <button type="button" class="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div class="modal-body">
                            <div id="search_result" style="overflow:auto;height:300px;margin-top:20px;">
                                <div class="col-sm-12">
                                    <div class="row">
                                        <div class="col-sm-6">
                                            <div style="text-align:center" id="old_price">
                                            </div>
                                        </div>
                                        <div class="col-sm-6">
                                            <div style="text-align:center" id="new_price">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal" onclick="airline_issued('`+msg.result.response.order_number+`');">Force Issued</button>
                            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>`;
            //
            document.getElementById('airline_booking').innerHTML += text;
            document.getElementById('show_title_airline').hidden = false;
            document.getElementById('show_loading_booking_airline').hidden = true;
            add_repricing();
            if (msg.result.response.state != 'booked'){
//                document.getElementById('issued-breadcrumb').classList.add("active");
            }

           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
               logout();
           }else{
                text += `<div class="alert alert-danger">
                        <h5>
                            `+msg.result.error_code+`
                        </h5>
                        `+msg.result.error_msg+`
                    </div>`;
                document.getElementById('airline_booking').innerHTML = text;
               alert(msg.result.error_msg);
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
          $("#show_loading_booking_airline").hide();
          $("#show_error_booking_airline").show();
          Swal.fire({
              type: 'error',
              title: 'Oops...',
              text: 'Something went wrong, please try again or check your connection internet',
           })
       },timeout: 60000
    });
}

function airline_issued(data){
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
        getToken();
        $.ajax({
           type: "POST",
           url: "/webservice/airline",
           headers:{
                'action': 'issued',
           },
    //       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
           data: {
               'order_number': data,
               'seq_id': payment_acq2[payment_method][selected].seq_id,
               'member': payment_acq2[payment_method][selected].method,
               'signature': signature
           },
           success: function(msg) {
               console.log(msg);
               if(msg.result.error_code == 0){
                   //update ticket
                   document.getElementById('show_loading_booking_airline').hidden = false;
                   document.getElementById('airline_booking').innerHTML = '';
                   document.getElementById('airline_detail').innerHTML = '';
                   document.getElementById('payment_acq').innerHTML = '';
                   airline_get_booking(msg.result.response.order_number);
//                   text_error = ''
//                   for(pax in msg.result.response.passengers){
//                        ticket = '';
//                        for(provider in msg.result.response.provider_bookings){
//                            if(msg.result.response.provider_bookings[i].error_msg.length != 0)
//                   text_error+=`<div class="alert alert-danger">
//                                    Invalid PNR or Order Number or Name
//                                    <a href="#" class="close" data-dismiss="alert" aria-label="close" style="margin-top:-25px;">x</a>
//                                </div>`;
//                            ticket += msg.result.response.provider_bookings[provider].tickets[pax].ticket_number
//                            if(provider != msg.result.response.provider_bookings.length - 1)
//                                ticket += ', ';
//                        }
//                        document.getElementById('passenger_ticket_'+pax).innerHTML = ticket;
//                        document.getElementById('airline_booking').innerHTML = text_error + document.getElementById('airline_booking').innerHTML;
//                    }
//
//                   //document.getElementById('issued-breadcrumb').classList.add("active");
//                   //document.getElementById('issued-breadcrumb').classList.remove("current");
//                   document.getElementById('issued-breadcrumb').classList.add("br-active");
//                   document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-active");
//                   document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-check"></i>`;
//                   document.getElementById('success-issued').style.display = "block";
//                   document.getElementById('button-choose-print').value = "Print Ticket";
//                   document.getElementById('button-choose-print').type = "button";
//                   document.getElementById('button-choose-print').onclick = "window.location.href=https://backend.rodextrip.com/rodextrip/report/pdf/tt.reservation.airline/"+msg.result.response.order_number+'/1';
//                   document.getElementById('button-print-print').value = "Print Ticket (with Price)";
//                   document.getElementById('button-print-print').onclick = "window.location.href=https://backend.rodextrip.com/rodextrip/report/pdf/tt.reservation.airline/"+msg.result.response.order_number+"/2";
//                   document.getElementById('button-issued-print').value = "Print Invoice";
//                   document.getElementById('button-choose-print').onclick = "window.location.href=https://backend.rodextrip.com/rodextrip/report/pdf/tt.agent.invoice/"+msg.result.response.order_number+'/4';
//                   document.getElementById('seat-map-link').href="#";
//                   document.getElementById('seat-map-link').hidden=false;
//                   document.getElementById('print_invoice').href="#";
//                   document.getElementById('print_invoice').hidden=false;
//                   document.getElementById('pnr').innerHTML="Issued";
//                   //$('.issued-booking-train').removeClass("running");
//                   document.getElementById('payment_acq').innerHTML = '';
               }else if(msg.result.error_code == 1006){
                    alert(msg.result.error_msg);
                    //modal pop up

                    booking_price_detail(msg);
                    tax = 0;
                    fare = 0;
                    total_price = 0;
                    commission = 0;
                    service_charge = ['FARE', 'RAC', 'ROC', 'TAX'];
                    text=`
                        <div style="background-color:#f15a22; margin-top:20px;">
                            <center>
                                <span style="color:white; font-size:16px;">Old Price Detail <i class="fas fa-money-bill-wave"></i></span>
                            </center>
                        </div>
                        <div style="background-color:white; padding:15px; border: 1px solid #f15a22;">`;
                    for(i in airline_get_detail.result.response.passengers[0].sale_service_charges){
                        text+=`
                        <div style="text-align:center">
                            `+i+`
                        </div>`;
                        for(j in airline_get_detail.result.response.passengers){
                            price = {'FARE': 0, 'RAC': 0, 'ROC': 0, 'TAX':0 , 'currency': ''};
                            for(k in airline_get_detail.result.response.passengers[j].sale_service_charges[i]){
                                price[k] = airline_get_detail.result.response.passengers[j].sale_service_charges[i][k].amount;
                                price['currency'] = airline_get_detail.result.response.passengers[j].sale_service_charges[i][k].currency;
                            }

                            text+=`<div class="row" style="margin-bottom:5px;">
                                <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                    <span style="font-size:12px;">`+airline_get_detail.result.response.passengers[j].name+` Fare
                                </div>
                                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                    <span style="font-size:13px;">`+price.currency+` `+getrupiah(parseInt(price.FARE))+`</span>
                                </div>
                            </div>
                            <div class="row" style="margin-bottom:5px;">
                                <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                    <span style="font-size:12px;">`+airline_get_detail.result.response.passengers[j].name+` Tax
                                </div>
                                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                    <span style="font-size:13px;">IDR `+getrupiah(parseInt(price.TAX + price.ROC))+`</span>
                                </div>
                            </div>`;

                            total_price += parseInt(price.TAX + price.ROC + price.FARE);
                            commission += parseInt(price.RAC);
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
                            <span style="font-size:13px; font-weight: bold;">`+price.currency+` `+getrupiah(total_price)+`</span>
                        </div>
                    </div>

                    <div class="row" id="show_commission_old" style="display:none;">
                        <div class="col-lg-12 col-xs-12" style="text-align:center;">
                            <div class="alert alert-success">
                                <span style="font-size:13px;">Your Commission: IDR `+getrupiah(parseInt(commission*-1))+`</span><br>
                            </div>
                        </div>
                    </div>`;
                    text+=`<center><div style="margin-bottom:5px;"><input class="primary-btn-ticket" id="show_commission_button_old" style="width:100%;" type="button" onclick="show_commission('old');" value="Show Commission"/></div></div>`;
                    document.getElementById('old_price').innerHTML = text;

                    airline_get_detail = msg;
                    total_price = 0;
                    //new price
                    text=`
                        <div style="background-color:#f15a22; margin-top:20px;">
                            <center>
                                <span style="color:white; font-size:16px;">New Price Detail <i class="fas fa-money-bill-wave"></i></span>
                            </center>
                        </div>
                        <div style="background-color:white; padding:15px; border: 1px solid #f15a22;">`;
                    for(i in msg.result.response.passengers[0].sale_service_charges){
                        text+=`
                        <div style="text-align:center">
                            `+i+`
                        </div>`;
                        for(j in msg.result.response.passengers){
                            price = {'FARE': 0, 'RAC': 0, 'ROC': 0, 'TAX':0 , 'currency': ''};
                            for(k in msg.result.response.passengers[j].sale_service_charges[i]){
                                price[k] = msg.result.response.passengers[j].sale_service_charges[i][k].amount;
                                price['currency'] = msg.result.response.passengers[j].sale_service_charges[i][k].currency;
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
                                    <span style="font-size:13px;">IDR `+getrupiah(parseInt(price.TAX + price.ROC))+`</span>
                                </div>
                            </div>`;

                            total_price += parseInt(price.TAX + price.ROC + price.FARE);
                            commission += parseInt(price.RAC);
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
                            <span style="font-size:13px; font-weight: bold;">`+price.currency+` `+getrupiah(total_price)+`</span>
                        </div>
                    </div>

                    <div class="row" id="show_commission_new" style="display:none;">
                        <div class="col-lg-12 col-xs-12" style="text-align:center;">
                            <div class="alert alert-success">
                                <span style="font-size:13px;">Your Commission: IDR `+getrupiah(parseInt(commission*-1))+`</span><br>
                            </div>
                        </div>
                    </div>`;
                    text+=`<center><div style="margin-bottom:5px;"><input class="primary-btn-ticket" id="show_commission_button_new" style="width:100%;" type="button" onclick="show_commission('new');" value="Show Commission"/></div></div>`;
                    document.getElementById('new_price').innerHTML = text;

                   $("#myModal").modal();
               }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                    logout();
               }else{
                    alert(msg.result.error_msg);
                    $('.hold-seat-booking-train').prop('disabled', false);
                    $('.hold-seat-booking-train').removeClass("running");
               }
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
              Swal.fire({
                  type: 'error',
                  title: 'Oops...',
                  text: 'Something went wrong, please try again or check your connection internet',
               })
           },timeout: 60000
        });
      }
    })
}

function update_service_charge(data){
    upsell = []
    for(i in airline_get_detail.result.response.passengers){
        for(j in airline_get_detail.result.response.passengers[i].sale_service_charges){
            currency = airline_get_detail.result.response.passengers[i].sale_service_charges[j].FARE.currency;
        }
        list_price = []
        for(j in list){
            if(airline_get_detail.result.response.passengers[i].name == document.getElementById('selection_pax'+j).value){
                list_price.push({
                    'amount': list[j],
                    'currency_code': currency
                });
            }

        }
        upsell.push({
            'sequence': airline_get_detail.result.response.passengers[i].sequence,
            'pricing': JSON.parse(JSON.stringify(list_price))
        });
    }
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'update_service_charge',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {
           'order_number': JSON.stringify(order_number),
           'passengers': JSON.stringify(upsell),
           'signature': signature
       },
       success: function(msg) {
           console.log(msg);
           if(msg.result.error_code == 0){
                airline_get_booking(order_number);
                $('#myModalRepricing').modal('hide');
           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                logout();
           }else{
                alert(msg.result.error_msg);
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
          Swal.fire({
              type: 'error',
              title: 'Oops...',
              text: 'Something went wrong, please try again or check your connection internet',
           })
       },timeout: 30000
    });

}


function show_commission(val){
    var sc = '';
    var scs = '';
    if(val == 'new'){
        sc = document.getElementById("show_commission_new");
        scs = document.getElementById("show_commission_button_new");
    }else if(val == 'commission'){
        var sc = document.getElementById("show_commission");
        var scs = document.getElementById("show_commission_button");
    }else{
        sc = document.getElementById("show_commission_old");
        scs = document.getElementById("show_commission_button_old");
    }
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

function show_repricing(){
    $("#myModalRepricing").modal();
}

function sell_ssrs_after_sales(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'sell_ssrs',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {
            'signature': airline_signature
       },
       success: function(msg) {
           console.log(msg);
           if(msg.result.error_code == 0){
                airline_commit_booking(false);
           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                logout();
           }else{
                alert(msg.result.error_msg);
                $('.btn-next').removeClass('running');
                $('.btn-next').prop('disabled', false);
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
          Swal.fire({
              type: 'error',
              title: 'Oops...',
              text: 'Something went wrong, please try again or check your connection internet',
           })

           $('.btn-next').removeClass('running');
           $('.btn-next').prop('disabled', false);
       },timeout: 30000
    });
}