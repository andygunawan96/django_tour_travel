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
//       url: "{% url 'tt_backend_rodextrip:social_media_tree_update' %}",
       data: {},
       success: function(msg) {
       try{
           console.log(msg);
           if(msg.result.error_code == 0){
               airline_signature = msg.result.response.signature;
               signature = msg.result.response.signature;
               if(data == ''){
                   get_carrier_providers();

               }else if(data != ''){
                   airline_get_booking(data);
               }
           }else{
               Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: msg.result.error_msg,
               })
               $('.loader-rodextrip').fadeOut();
               try{
                $("#show_loading_booking_airline").hide();
               }catch(err){}
           }
       }catch(err){
           $("#barFlightSearch").hide();
           $("#waitFlightSearch").hide();

           Swal.fire({
               type: 'error',
               title: 'Oops...',
               text: 'Something went wrong, please try again or check your internet connection',
           })
           $('.loader-rodextrip').fadeOut();
           document.getElementById("airlines_error").innerHTML = '';
           text = '';
           text += `
           <div class="alert alert-warning" style="border:1px solid #cdcdcd;" role="alert">
               <span style="font-weight:bold;"> Oops! Something went wrong, please try again or check your internet connection</span>
           </div>`;
           var node = document.createElement("div");
           node.innerHTML = text;
           document.getElementById("airlines_error").appendChild(node);
           node = document.createElement("div");
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
          if(XMLHttpRequest.status == 500){
              $("#barFlightSearch").hide();
              $("#waitFlightSearch").hide();

              Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error airline signin </span>' + errorThrown,
              })
              $('.loader-rodextrip').fadeOut();
              try{
                $("#show_loading_booking_airline").hide();
              }catch(err){}
          }
       },timeout: 60000
    });

}

function get_carrier_code_list(type, val){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'get_carriers_search',
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
                                else{
                                    if(document.getElementById('provider_box_All').checked == false)
                                        text+=`
                                            <input type="checkbox" id="provider_box_All_`+val+`" name="provider_box_All_`+val+`" value="all" onclick="check_provider('all',`+val+`)"/>`;
                                    else
                                        text+=`
                                            <input type="checkbox" id="provider_box_All_`+val+`" name="provider_box_All_`+val+`" value="all" checked="checked" onclick="check_provider('all',`+val+`)"/>`;
                                }
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
                                    <span class="span-search-ticket" style="color:black;">`+msg[i].display_name+`</span>`;
                                    if(val == undefined)
                                    text+=`
                                        <input type="checkbox" id="provider_box_`+i+`" name="provider_box_`+i+`" value="`+i+`" onclick="check_provider('`+i+`')"/>`;
                                    else{
                                        if(document.getElementById('provider_box_'+i).checked == false)
                                            text+=`
                                                <input type="checkbox" id="provider_box_`+i+`_`+val+`" name="provider_box_`+i+`_`+val+`" value="`+i+`" onclick="check_provider('`+i+`',`+val+`)"/>`;
                                        else
                                            text+=`
                                                <input type="checkbox" id="provider_box_`+i+`_`+val+`" name="provider_box_`+i+`_`+val+`" value="`+i+`" checked="checked" onclick="check_provider('`+i+`',`+val+`)"/>`;
                                    }
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
                                else{
                                    if(airline_carriers[val-1]['All'].bool == true){
                                        text+=`
                                            <input type="checkbox" id="provider_box_All_`+val+`" name="provider_box_All_`+val+`" value="all" checked="checked" onclick="check_provider('all',`+val+`)"/>`;
                                    }else
                                        text+=`
                                            <input type="checkbox" id="provider_box_All_`+val+`" name="provider_box_All_`+val+`" value="all" onclick="check_provider('all',`+val+`)"/>`;
                                }
                                text+=`
                                <span class="check_box_span_custom"></span>
                            </label>
                        </a>
                        <br/>
                    </li>`;
                   for(i in airline_carriers[0]){
                        if(i != 'All'){
                            text+=`
                                <li>
                                    <a class="small" data-value="option1" tabIndex="-1">
                                        <label class="check_box_custom">
                                            <span class="span-search-ticket" style="color:black;">`+airline_carriers[0][i].display_name+`</span>`;
                                            if(val == undefined)
                                            text+=`
                                                <input type="checkbox" id="provider_box_`+i+`" name="provider_box_`+i+`" value="`+i+`" onclick="check_provider('`+i+`')"/>`;
                                            else{
                                                try{
                                                    if(document.getElementById('provider_box_'+i).checked == true)
                                                        text+=`
                                                            <input type="checkbox" id="provider_box_`+i+`_`+val+`" name="provider_box_`+i+`_`+val+`" value="`+i+`" onclick="check_provider('`+i+`',`+val+`)" checked="checked"/>`;
                                                    else
                                                        text+=`
                                                            <input type="checkbox" id="provider_box_`+i+`_`+val+`" name="provider_box_`+i+`_`+val+`" value="`+i+`" onclick="check_provider('`+i+`',`+val+`)"/>`;
                                                }catch(err){
                                                    if(airline_carriers[val-1][i].bool == true)
                                                        text+=`
                                                            <input type="checkbox" id="provider_box_`+i+`_`+val+`" name="provider_box_`+i+`_`+val+`" value="`+i+`" onclick="check_provider('`+i+`',`+val+`)" checked="checked"/>`;
                                                    else
                                                        text+=`
                                                            <input type="checkbox" id="provider_box_`+i+`_`+val+`" name="provider_box_`+i+`_`+val+`" value="`+i+`" onclick="check_provider('`+i+`',`+val+`)"/>`;
                                                }
                                            }
                                            text+=`
                                            <span class="check_box_span_custom"></span>
                                        </label>
                                    </a>
                                    <br/>
                                </li>`;
                        }
                   }
               }catch(err){

               }
           }
           if(val == undefined)
               try{
                   document.getElementById('provider_flight_content').innerHTML = text;
               }catch(err){

               }
           else
               document.getElementById('provider_flight_content'+val).innerHTML = text;
           first_value_provider();
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status == 500){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error airline carrier code list </span>' + errorThrown,
                })
                $('.loader-rodextrip').fadeOut();
            }
       },timeout: 60000
    });

}

//function get_carriers_search(type, val){
//    getToken();
//    $.ajax({
//       type: "POST",
//       url: "/webservice/airline",
//       headers:{
//            'action': 'get_carriers_search',
//       },
//       data: {
//            'signature': signature
//       },
//       success: function(msg) {
//           console.log(msg);
//       },
//       error: function(XMLHttpRequest, textStatus, errorThrown) {
//            Swal.fire({
//              type: 'error',
//              title: 'Oops!',
//              html: '<span style="color: red;">Error airline carrier code list </span>' + errorThrown,
//            })
//            $('.loader-rodextrip').fadeOut();
//       },timeout: 60000
//    });
//
//}

function get_carrier_providers(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'get_carrier_providers',
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
           if(XMLHttpRequest.status == 500){
               Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error airline provider list </span>' + errorThrown,
               })
               $('.loader-rodextrip').fadeOut();
               $("#barFlightSearch").hide();
               $("#waitFlightSearch").hide();
               document.getElementById("airlines_error").innerHTML = '';
                text = '';
                text += `
                    <div class="alert alert-warning" style="border:1px solid #cdcdcd;" role="alert">
                        <span style="font-weight:bold;"> Oops! Something went wrong, please try again or check your internet connection</span>
                    </div>
                `;
                var node = document.createElement("div");
                node.innerHTML = text;
                document.getElementById("airlines_error").appendChild(node);
                node = document.createElement("div");
            }
       },timeout: 60000
    });

}

function get_carriers(){
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'get_carriers',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
           console.log(msg);
           airline_carriers[0] = msg;
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {

       },timeout: 60000
    });
}

function get_provider_list(){
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'get_provider_description',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
           console.log(msg);
           provider_list_data = JSON.parse(msg);

           airline_carriers_full = JSON.parse(msg);
           //carrier_to_provider();
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status == 500){
                   Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: red;">Error airline provider list </span>' + errorThrown,
                   })
                   $('.loader-rodextrip').fadeOut();
                   $("#barFlightSearch").hide();
                   $("#waitFlightSearch").hide();
                   document.getElementById("airlines_error").innerHTML = '';
                    text = '';
                    text += `
                        <div class="alert alert-warning" style="border:1px solid #cdcdcd;" role="alert">
                            <span style="font-weight:bold;"> Oops! Something went wrong, please try again or check your internet connection</span>
                        </div>
                    `;
                    var node = document.createElement("div");
                    node.innerHTML = text;
                    document.getElementById("airlines_error").appendChild(node);
                    node = document.createElement("div");
            }
       },timeout: 60000
    });

}

function carrier_to_provider(){
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
                    if(airline[i].hasOwnProperty(airline_carriers[i][j].code) == false)
                        for(k in airline_carriers[i][j].provider)
                            if(provider_list[airline_carriers[i][j].code].includes(airline_carriers[i][j].provider[k]) == true)
                                airline[i][airline_carriers[i][j].code] = [airline_carriers[i][j].provider[k]];
                    else{
                        for(k in airline_carriers[i][j].provider){
                            if(airline[i][airline_carriers[i][j].code].includes(airline_carriers[i][j].provider[k]) == false && provider_list[airline_carriers[i][j].code].includes(airline_carriers[i][j].provider[k]))
                                airline[i][airline_carriers[i][j].code].push(airline_carriers[i][j].provider[k]);
                        }
                    }

                }catch(err){

                }
            }
        }
    }
    provider_airline = []
    for(i in airline[0]){
        for(j in airline[0][i]){
            check = 0;
            try{
                for(k in provider_airline){
                    if(airline_carriers[0][i].is_favorite == true){
                        provider_airline.push([airline[0][i][j],[i], airline_carriers[0][i].is_favorite])
                        check = 1;
                        break;
                    }else if(provider_airline[k][0] == airline[0][i][j] && provider_airline[k][2] == false){
                        provider_airline[k][1].push(i);
                        check = 1;
                        break;
                    }

                }if(check == 0){
                    provider_airline.push([airline[0][i][j],[i], airline_carriers[0][i].is_favorite])
                }
            }catch(err){}
        }
    }
    airline_choose = 0;
    count_progress_bar_airline = 0;
    send_search_to_api();
    get_carriers();
//    document.getElementById('airline_list').innerHTML = '';
    document.getElementById('airline_list2').innerHTML = '';
}

function send_search_to_api(val){
    if(airline_request.direction == 'RT' && counter_search == 0){
        document.getElementById('show_origin_destination').innerHTML = `<span style="font-size:12px;" title="`+airline_request.origin[counter_search]+` > `+airline_request.destination[counter_search]+`"><span class="copy_span"> `+airline_request.origin[counter_search].split(' - ')[2] + ` (`+airline_request.origin[counter_search].split(' - ')[0]+`) </span><i class="fas fa-arrows-alt-h"></i><span class="copy_span"> `+airline_request.destination[counter_search].split(' - ')[2]+` (`+airline_request.destination[counter_search].split(' - ')[0]+`)</span></span>`;
        date_show = `<i class="fas fa-calendar-alt"></i> `+airline_request.departure[counter_search];
        if(airline_request.departure[counter_search] != airline_request['return'][counter_search]){
            date_show += ` - `+airline_request['return'][counter_search];
        }
        document.getElementById('show_date').innerHTML = date_show;
        document.getElementById('title_search').innerHTML += " From " + airline_request.origin[counter_search].split(' - ')[2] + " To " + airline_request.destination[counter_search].split(' - ')[2];
    }else if(airline_request.direction != 'RT'){
        document.getElementById('show_origin_destination').innerHTML = `<span style="font-size:12px;" title="`+airline_request.origin[counter_search]+` > `+airline_request.destination[counter_search]+`"><span class="copy_span"> `+airline_request.origin[counter_search].split(' - ')[2] + ` (`+airline_request.origin[counter_search].split(' - ')[0]+`) </span><i class="fas fa-arrow-right"></i><span class="copy_span"> `+airline_request.destination[counter_search].split(' - ')[2]+` (`+airline_request.destination[counter_search].split(' - ')[0]+`)</span></span>`;
        date_show = `<i class="fas fa-calendar-alt"></i> `+airline_request.departure[counter_search];
        if(airline_request.departure[counter_search] != airline_request['return'][counter_search]){
            date_show += ` - `+airline_request['return'][counter_search];
        }
        document.getElementById('show_date').innerHTML = date_show;
        if(airline_request.direction != 'MC'){
            document.getElementById('title_search').innerHTML += " From " + airline_request.origin[counter_search].split(' - ')[2] + " To " + airline_request.destination[counter_search].split(' - ')[2];
        }
    }
    if(val == undefined){
        console.log(provider_airline);
        //baru
        if(provider_airline.length == 0){
            Swal.fire({
              type: 'error',
              title: 'Oops...',
              text: 'Something went wrong, search other airline',
            })
            $('.loader-rodextrip').fadeOut();
            $("#barFlightSearch").hide();
            $("#waitFlightSearch").hide();
            document.getElementById("airlines_error").innerHTML = '';
            text = '';
            text += `
                <div class="alert alert-warning" style="border:1px solid #cdcdcd;" role="alert">
                    <span style="font-weight:bold;"> Oops... Something went wrong, search other airline</span>
                </div>
                <img src="/static/tt_website_rodextrip/images/no pic/no-flight.jpeg" style="height:50px;"/>
            `;
            var node = document.createElement("div");
            node.innerHTML = text;
            node.style = 'text-align:center';
            document.getElementById("airlines_error").appendChild(node);
            node = document.createElement("div");
        }
        else{
            ticket_count = 0;
            for(i in provider_airline){
                airline_search(provider_airline[i][0],provider_airline[i][1]);
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
            if(XMLHttpRequest.status == 500){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error airline config </span>' + errorThrown,
                })
                $('.loader-rodextrip').fadeOut();
            }
       },timeout: 60000
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
//       url: "{% url 'tt_backend_rodextrip:social_media_tree_update' %}",
       data: {
           'provider': provider,
           'carrier_codes': JSON.stringify(carrier_codes),
           'counter_search': counter_search,
           'signature': signature,
           'search_request': JSON.stringify(airline_request)
       },
       success: function(msg) {
       console.log(msg);
           if(msg.error_code == 0){
              try{
                  datasearch2(msg.response);
                  var bar1 = new ldBar("#barFlightSearch");
                  var bar2 = document.getElementById('barFlightSearch').ldBar;
                  bar1.set((airline_choose/count_progress_bar_airline)*100);
                  if ((airline_choose/count_progress_bar_airline)*100 == 100){
                    document.getElementById('sorting-flight2').hidden = false;
                    document.getElementById('sorting-flight').hidden = false;
                    document.getElementById('filter').hidden = false;
                    $("#barFlightSearch").hide();
                    $("#waitFlightSearch").hide();
                  }

              }catch(err){
                  datasearch2(msg.response);
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
                    <div style="text-align:center">
                        <img src="/static/tt_website_rodextrip/images/nofound/no-airlines.png" style="width:70px; height:70px;" alt="" title="" />
                        <br/>
                    </div>
                    <center><div class="alert alert-warning" role="alert" style="margin-top:15px; border:1px solid #cdcdcd;"><h6><i class="fas fa-search-minus"></i> Oops! Sorry no ticket for flight. Please try another flight. </h6></div></center>`;
                    var node = document.createElement("div");
                    node.innerHTML = text;
                    document.getElementById("airlines_ticket").appendChild(node);
                    node = document.createElement("div");
              }
              var node = document.createElement("div");
              var node2 = document.createElement("div");
              if(document.getElementById("filter_airline_span").innerHTML == '' && airline_data.length > 0){
                   document.getElementById('filter_airline_span').innerHTML = " Airline"+ '<i class="fas fa-chevron-down" id="airlineAirline_generalDown" style="float:right; display:none;"></i><i class="fas fa-chevron-up" id="airlineAirline_generalUp" style="float:right; display:block;"></i>';
                   document.getElementById('filter_airline_span').parentNode.insertBefore(document.createElement('hr'), document.getElementById('filter_airline_span'));
                   document.getElementById('filter_airline_span2').innerHTML = " Airline";
                   document.getElementById('filter_airline_span2').parentNode.insertBefore(document.createElement('hr'), document.getElementById('filter_airline_span2'));
              }
              try{
                   msg.response.schedules.forEach((obj)=> {

                       obj.journeys.forEach((obj2) =>{
                           check = 0;
                           carrier_code.forEach((obj1)=> {
                               if(obj1.code == obj2.segments[0].carrier_code){
                                   check=1;
                               }
                           });
                           carrier_code_airline_checkbox = '';
                           if(check == 0){
                               carrier_code_airline_checkbox += `
                               <div class="checkbox-inline1">
                               <label class="check_box_custom">`;
                               try{
                               carrier_code_airline_checkbox +=`
                                    <span class="span-search-ticket" style="color:black;">`+airline_carriers[0][obj2.segments[0].carrier_code].name+`</span>`;
                               }catch(err){
                               carrier_code_airline_checkbox +=`
                                    <span class="span-search-ticket" style="color:black;">`+obj2.segments[0].carrier_code+`</span>`;
                               }
                               carrier_code_airline_checkbox +=`
                                    <input type="checkbox" id="checkbox_airline`+airline_list_count+`" onclick="change_filter('airline',`+airline_list_count+`);"/>
                                    <span class="check_box_span_custom"></span>
                                </label><br/>
                               </div>`;
                               node.innerHTML = carrier_code_airline_checkbox;
                               document.getElementById("airlineAirline_generalShow").appendChild(node);
                               node = document.createElement("div");
                               carrier_code_airline_checkbox = '';
                               carrier_code_airline_checkbox += `
                               <div class="checkbox-inline1">
                               <label class="check_box_custom">`;
                               try{
                               carrier_code_airline_checkbox +=`
                                    <span class="span-search-ticket" style="color:black;">`+airline_carriers[0][obj2.segments[0].carrier_code].name+`</span>`;
                               }catch(err){
                               carrier_code_airline_checkbox +=`
                                    <span class="span-search-ticket" style="color:black;">`+obj2.segments[0].carrier_code+`</span>`;
                               }
                               carrier_code_airline_checkbox +=`<input type="checkbox" id="checkbox_airline2`+airline_list_count+`" onclick="change_filter('airline',`+airline_list_count+`);"/>
                                    <span class="check_box_span_custom"></span>
                                </label><br/>
                               </div>`;
                               node2.innerHTML = carrier_code_airline_checkbox;
                               document.getElementById("airline_list2").appendChild(node2);
                               node2 = document.createElement("div");

                               carrier_code.push({
                                   airline:airline_carriers[0][obj2.segments[0].carrier_code],
                                   code:obj2.segments[0].carrier_code,
                                   status: false,
                                   key: airline_list_count
                               });
                               airline_list_count++;
                           }
                       })

                   });
              }catch(err){console.log(err)}
           }else{
              airline_choose++;
              var bar1 = new ldBar("#barFlightSearch");
              var bar2 = document.getElementById('barFlightSearch').ldBar;
              bar1.set((airline_choose/count_progress_bar_airline)*100);
              if ((airline_choose/count_progress_bar_airline)*100 == 100){
                if(count_progress_bar_airline == 1){
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: red;">Error airline search </span>' + msg.error_msg,
                    })

                }
                filtering('sort');
                $("#barFlightSearch").hide();
                $("#waitFlightSearch").hide();
              }
           }
//            document.getElementById('train_searchForm').submit();
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status == 500){
                airline_choose++;
                var bar1 = new ldBar("#barFlightSearch");
                var bar2 = document.getElementById('barFlightSearch').ldBar;
                bar1.set((airline_choose/count_progress_bar_airline)*100);
                if ((airline_choose/count_progress_bar_airline)*100 == 100){
                    $("#barFlightSearch").hide();
                    $("#waitFlightSearch").hide();
                    filtering('sort');
                }
               if (count_progress_bar_airline == airline_choose && airline_data.length == 0){
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: red;">Error airline search </span>' + errorThrown,
                    })
                    $('.loader-rodextrip').fadeOut();
                   $("#barFlightSearch").hide();
                   $("#waitFlightSearch").hide();
                   document.getElementById("airlines_error").innerHTML = '';
                    text = '';
                    text += `
                        <div class="alert alert-warning" style="border:1px solid #cdcdcd;" role="alert">
                            <span style="font-weight:bold;"> Oops `+errorThrown+`! Something went wrong, please try again or check your internet connection</span>
                        </div>
                    `;
                    var node = document.createElement("div");
                    node.innerHTML = text;
                    document.getElementById("airlines_error").appendChild(node);
                    node = document.createElement("div");
                }
            }
       },timeout: 120000 // sets timeout to 120 seconds
    });

}

function datasearch2(airline){
   airline_choose++;
   data = [];
   data_show = [];
   temp_data = [];
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

   for(i in airline.schedules){
        for(j in airline.schedules[i].journeys){
           airline.schedules[i].journeys[j].sequence = counter;
           available_count = 100;
           for(k in airline_request.origin){
                if(airline_request.origin[k].split(' - ')[0] == airline.schedules[i].journeys[j].origin &&
                   airline_request.destination[k].split(' - ')[0] == airline.schedules[i].journeys[j].destination &&
                   airline_request.departure[k] == airline.schedules[i].journeys[j].departure_date.split(' - ')[0]){
                    airline.schedules[i].journeys[j].airline_pick_sequence = parseInt(parseInt(k)+1);
                }
           }
           price = 0;
           currency = '';
           airline.schedules[i].journeys[j].operated_by = true;
           can_book = false;
           for(k in airline.schedules[i].journeys[j].segments){
               for(l in airline.schedules[i].journeys[j].segments[k].fares){
                   if(airline.schedules[i].journeys[j].segments[k].fares[l].available_count >= parseInt(airline_request.adult)+parseInt(airline_request.child) || airline.schedules[i].journeys[j].segments[k].fares[l].available_count == -1){//atau buat sia
                       if(available_count > airline.schedules[i].journeys[j].segments[k].fares[l].available_count)
                            available_count = airline.schedules[i].journeys[j].segments[k].fares[l].available_count;
                       airline.schedules[i].journeys[j].segments[k].fare_pick = parseInt(k);
                       can_book = true;
                       for(m in airline.schedules[i].journeys[j].segments[k].fares[l].service_charge_summary){
                           if(airline.schedules[i].journeys[j].segments[k].fares[l].service_charge_summary[m].pax_type == 'ADT'){
                               for(n in airline.schedules[i].journeys[j].segments[k].fares[l].service_charge_summary[m].service_charges){
                                   if(airline.schedules[i].journeys[j].segments[k].fares[l].service_charge_summary[m].service_charges[n].charge_code != 'rac' && airline.schedules[i].journeys[j].segments[k].fares[l].service_charge_summary[m].service_charges[n].charge_code != 'rac1' && airline.schedules[i].journeys[j].segments[k].fares[l].service_charge_summary[m].service_charges[n].charge_code && 'rac2'){
                                       price += airline.schedules[i].journeys[j].segments[k].fares[l].service_charge_summary[m].service_charges[n].amount;
                                       if(currency == ''){
                                           currency = airline.schedules[i].journeys[j].segments[k].fares[l].service_charge_summary[m].service_charges[n].currency;
                                       }
                                   }
                               }
                           }
                       }
                       break;
                   }
               }

               if(airline.schedules[i].journeys[j].segments[k].carrier_code == airline.schedules[i].journeys[j].segments[k].operating_airline_code && airline.schedules[i].journeys[j].operated_by != false){
                   airline.schedules[i].journeys[j].operated_by_carrier_code = airline.schedules[i].journeys[j].segments[k].operating_airline_code;
               }else if(airline.schedules[i].journeys[j].segments[k].carrier_code != airline.schedules[i].journeys[j].segments[k].operating_airline_code){
                   airline.schedules[i].journeys[j].operated_by_carrier_code = airline.schedules[i].journeys[j].segments[k].operating_airline_code;
                   airline.schedules[i].journeys[j].operated_by = false;
               }
           }
           airline.schedules[i].journeys[j].total_price = price;
           if(available_count == 100)
               available_count = 0;
           airline.schedules[i].journeys[j].available_count = available_count;
           airline.schedules[i].journeys[j].can_book = can_book;
           airline.schedules[i].journeys[j].currency = currency;
           data.push(airline.schedules[i].journeys[j]);
           temp_data.push(airline.schedules[i].journeys[j]);
           counter++;
        }
   }
   airline_data = data;

//   print_ticket_search(temp_data);
//   sort_button('price');
//   sort(temp_data);
   recommendations_airline = recommendations_airline.concat(airline.recommendations)
   if(airline_request.departure.length != journey.length)
       filtering('filter');
}

function change_fare(journey, segment, fares){
    price = 0;
    var change_radios = document.getElementsByName('journey'+journey+'segment'+segment+'fare');
    for (var j = 0, length = change_radios.length; j < length; j++) {
        if (change_radios[j].checked) {
            fare_value = j
            break;
        }
    }
    group_fares = airline[journey].segments[segment].fares[fare_value].group_fare_id;
    for(i in airline[journey].segments){
        if(group_fares.length != 0){
            for(j in airline[journey].segments[i].fares){
                if(parseInt(i) == segment){
                    break;
                }else if(airline[journey].segments[i].fares[j].group_fare_id == group_fares){
                    document.getElementsByName('journey'+journey+'segment'+i+'fare')[parseInt(j)].checked = true;
                    break;
                }
            }
        }
        var radios = document.getElementsByName('journey'+journey+'segment'+i+'fare');

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
    document.getElementById("badge-copy-notif").innerHTML = "0";
    document.getElementById("badge-copy-notif2").innerHTML = "0";
    $('#button_copy_airline').hide();

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
                airline_data_filter[val].segments[i].fare_pick = parseInt(radios[j].value);
                fare = parseInt(radios[j].value);
                // only one radio can be logically checked, don't check the rest
                break;
            }
        }
        //give fare pick
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
//            'journey_type': airline_data_filter[val].segments[i].journey_type,
            'fare_code': fare_code,
            'carrier_code': airline_data_filter[val].segments[i].carrier_code,
            'class_of_service': class_of_service,
            "fare_pick": parseInt(airline_data_filter[val].segments[i].fare_pick),
        })

        //get farecode
//        document.getElementById('airline_searchForm').
    }
    auto_combo_price_flag = true;
    filter_recommendation = [];
    airline_recommendations_list.map(function (str,i) {if(str.includes(airline_data_filter[val].journey_ref_id) == true) return (filter_recommendation.push(i)) });
    for(i in filter_recommendation){
        if(airline_recommendations_combo_list[filter_recommendation[i]] == true){
            auto_combo_price_flag = false;
            break;
        }
    }
    if(airline_pick_list.length != 0 && auto_combo_price_flag == true){
        for(i in airline_pick_list){
            for(j in airline_pick_list[i].segments){
                for(k in airline_pick_list[i].segments[j].fares){
                    try{
                        if(airline_pick_list[i].segments[j].fares[k].fare_ref_id == airline_recommendations_journey[airline_recommendations_list.indexOf(airline_data_filter[val].journey_ref_id)].journey_flight_refs[i].fare_flight_refs[j].fare_ref_id){
                            airline_pick_list[i].segments[j].fare_pick = parseInt(k);
                            break;
                        }
                    }catch(err){}
                }
            }
        }
    }
    airline_pick_list.push(JSON.parse(JSON.stringify(airline_data_filter[val])));
    value_pick.push(val);

    price = 0;
    if(airline_request.direction == 'OW'){
        journey.push({'segments':segment, 'provider': provider});
    }else if(airline_request.direction == 'RT' && airline_data_filter[val].is_combo_price == true){
        journey.push({'segments':segment, 'provider': provider});
    }else if(airline_request.direction == 'RT' && journey.length == 0){
        airline_pick_mc('change');
        journey.push({'segments':segment, 'provider': provider});
        send_search_to_api(counter_search);
        document.getElementById("airlines_ticket").innerHTML = '';
        data_show = [];
        airline_departure = 'return';
        filtering('filter');
        var total_price = 0;

    }
    else if(airline_request.direction == 'RT' && journey.length == 1){
        journey.push({'segments':segment, 'provider': provider});
    }
    else if(airline_request.direction == 'MC' && airline_data_filter[val].is_combo_price == true)
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
    if(airline_request.direction == 'RT' && airline_data_filter[val].is_combo_price == true){
        airline_pick_mc('change');
        check_airline_pick = 1;
        document.getElementById("badge-flight-notif").innerHTML = "1";
        document.getElementById("badge-flight-notif2").innerHTML = "1";
        $("#badge-flight-notif").addClass("infinite");
        $("#badge-flight-notif2").addClass("infinite");
        $("#myModalTicketFlight").modal('show');
        $('#loading-search-flight').show();
        $('#button_chart_airline').show();
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
        $('#button_chart_airline').show();
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
        $('#button_chart_airline').show();
        $('#choose-ticket-flight').hide();
    }
    else if(airline_request.direction == 'MC' && airline_data_filter[val].is_combo_price == true){
        airline_pick_mc('change');
        check_airline_pick = 1;
        document.getElementById("badge-flight-notif").innerHTML = "1";
        document.getElementById("badge-flight-notif2").innerHTML = "1";
        $("#badge-flight-notif").addClass("infinite");
        $("#badge-flight-notif2").addClass("infinite");
        $("#myModalTicketFlight").modal('show');
        $('#loading-search-flight').show();
        $('#button_chart_airline').show();
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
        $('#button_chart_airline').show();
        $('#choose-ticket-flight').hide();
        counter_search = parseInt(airline_request.counter);
        console.log(counter_search);
        filtering('filter');
    }
    else if(airline_request.direction == 'MC' && airline_request.counter != journey.length){
        document.getElementById("airline_ticket_pick").innerHTML = '';
        airline_pick_mc('all');
        send_search_to_api(counter_search);
        filtering('filter');
    }

    if(check_airline_pick == 1){
        for(i in airline_pick_list){
            for(j in airline_pick_list){
                if(airline_pick_list[i].airline_pick_sequence < airline_pick_list[j].airline_pick_sequence){
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
        if(airline_request.direction == 'MC')
            airline_pick_mc('all');
        else
            airline_pick_mc('change');
        set_automatic_combo_price()
//        get_price_itinerary_request();
    }
}

function set_automatic_combo_price(){
    journey = [];
    for(i in airline_pick_list){
        total_price_temp = 0;
        segments = [];
        for(j in airline_pick_list[i].segments){
            for(k in airline_pick_list[i].segments[j].fares){
                if(airline_pick_list[i].segments[j].fare_pick == parseInt(k)){
                    segments.push({
                        "segment_code": airline_pick_list[i].segments[j].segment_code,
                        "fare_code": airline_pick_list[i].segments[j].fares[k].fare_code,
                        "carrier_code": airline_pick_list[i].segments[j].carrier_code,
                        "class_of_service": airline_pick_list[i].segments[j].fares[k].class_of_service,
                        "fare_pick": parseInt(k)
                    });
                    document.getElementsByName('journeypick'+airline_pick_list[i].airline_pick_sequence+'segment'+j+'fare')[k].checked = true;
                    for(l in airline_pick_list[i].segments[j].fares[k].service_charge_summary){
                        if(airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].pax_type == 'ADT'){
                            total_price_temp += airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].total_price / airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].pax_count;
                            break;
                        }
                    }
                    break;
                }
            }
        }
        journey.push({
            "provider": airline_pick_list[i].provider,
            "segments": segments
        });
        airline_pick_list[i].total_price = total_price_temp;
        document.getElementById('fare_detail_pick'+airline_pick_list[i].airline_pick_sequence).innerHTML = airline_pick_list[i].currency + ' ' + getrupiah(airline_pick_list[i].total_price);
    }
    document.getElementById('airline_detail').innerHTML = '';
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

function get_price_itinerary_request(){
    added = 1;
    for(i in airline_pick_list){
        try{
            document.getElementById('changejourney_pick'+parseInt(parseInt(i)+added)).disabled = true;
        }catch(err){
            added++;
            try{
                document.getElementById('changejourney_pick'+parseInt(parseInt(i)+added)).disabled = true;
            }catch(err){}
        }
    }
    separate = false;
    try{
        if(document.getElementsByName('myRadios')[0].checked == true)
            separate = true;
        else
            separate = false;
    }catch(err){

    }
    promotion_code_list = [];
    for(i=0;i<promotion_code;i++){
        try{
            if(document.getElementById('carrier_code_line'+i).value != '' && document.getElementById('code_line'+i).value != '')
                promotion_code_list.push({
                    'carrier_code': document.getElementById('carrier_code_line'+i).value,
                    'promo_code': document.getElementById('code_line'+i).value
                })
        }catch(err){}
    }

    document.getElementById("airlines_ticket").innerHTML = '';
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'get_price_itinerary',
       },
       data: {
          "promo_codes": JSON.stringify(promotion_code_list),
          "journeys_booking": JSON.stringify(journey),
          'signature': airline_signature,
          'separate_journey': separate,
       },
       success: function(resJson) {
           added = 1;
           for(i in airline_pick_list){
                try{
                    document.getElementById('changejourney_pick'+parseInt(parseInt(i)+added)).disabled = false;
                }catch(err){
                    added++;
                    try{
                        document.getElementById('changejourney_pick'+parseInt(parseInt(i)+added)).disabled = false;
                    }catch(err){}
                }
           }
           console.log(resJson);
           price_type = {};
           airline_price = [];
           price_counter = 0;
           fare_print = false;
           if(resJson.result.error_code == 0 && resJson.result.response.price_itinerary_provider.length!=0){
                for(i in resJson.result.response.price_itinerary_provider){
                    for(j in resJson.result.response.price_itinerary_provider[i].journeys){
                        for(k in resJson.result.response.price_itinerary_provider[i].journeys[j].segments){
                            for(l in resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].fares){
                                if(resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].fares[l].service_charge_summary.length != 0)
                                    airline_price.push({});
                                for(m in resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].fares[l].service_charge_summary){
                                    price_type['fare'] = resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].fares[l].service_charge_summary[m].total_fare / resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].fares[l].service_charge_summary[m].pax_count;
                                    price_type['tax'] = resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].fares[l].service_charge_summary[m].total_tax / resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].fares[l].service_charge_summary[m].pax_count;
                                    price_type['rac'] = resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].fares[l].service_charge_summary[m].total_commission / resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].fares[l].service_charge_summary[m].pax_count;
                                    if(isNaN(price_type['rac']))
                                        price_type['rac'] = 0;
                                    price_type['roc'] = 0;
                                    price_type['currency'] = resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].fares[l].service_charge_summary[m].service_charges[0].currency;
                                    airline_price[airline_price.length-1][resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].fares[l].service_charge_summary[m].pax_type] = price_type;
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
                    for(j in resJson.result.response.price_itinerary_provider[i].journeys){
                        text+=`
                        <div class="col-lg-12">`;
                        if(i == 0 && j == 0 && resJson.result.response.is_combo_price == true && journey.length > 1){
                            text += `<marquee direction="down" behavior="alternate" height="50">

                                     <marquee behavior="alternate"><font size="5">Special Price</font></marquee>

                                     </marquee>`;
                            $text +='Special Price\n';
                        }
                        flight_count++;
                        text += `<hr/><h6>Flight `+flight_count+`</h6>`;
                        $text +='Flight '+flight_count+'\n';
                 text+=`</div>
                        <div class="col-lg-3">`;
                        //logo
                        for(k in resJson.result.response.price_itinerary_provider[i].journeys[j].segments){ //print gambar airline
                            if(k != 0)
                                text +=`<br/>`;
                            try{
                                text+=`
                                <span style="font-weight: 500; font-size:12px;">`+airline_carriers[0][resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].carrier_code].name+` `+resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].carrier_number+`</span><br/>
                                <img data-toggle="tooltip" title="`+airline_carriers[0][resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].carrier_code].name+`" style="width:50px; height:50px;" src="`+static_path_url_server+`/public/airline_logo/`+resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].carrier_code+`.png"><span> </span>`;
                            }catch(err){
                                text+=`<img data-toggle="tooltip" title="" style="width:50px; height:50px;" src="`+static_path_url_server+`/public/airline_logo/`+resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].carrier_number+`.png"><span> </span>`;
                            }
                        }
                        text+=`</div>`;
                        text+=`<div class="col-lg-9">`;
                        for(k in resJson.result.response.price_itinerary_provider[i].journeys[j].segments){
                            //datacopy
                            try{
                                $text += airline_carriers[0][resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].carrier_code].name + ' ' + resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].carrier_code + resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].carrier_number + '\n';
                            }catch(err){
                                $text += resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].carrier_code + resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].carrier_number + '\n';
                            }
                            $text += resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].departure_date + ' → ' + resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].arrival_date + '\n';
                            $text += resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].origin_name + ' (' + resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].origin_city + ') - ';
                            $text += resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].destination_name + ' (' + resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].destination_city + ')\n\n';

                            for(l in resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].legs){
                                text+=`
                                    <div class="row">
                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                            <table style="width:100%">
                                                <tr>
                                                    <td class="airport-code"><h5>`+resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].legs[l].departure_date.split(' - ')[1]+`</h5></td>
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
                                            <span style="font-size:13px;">`+resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].legs[l].departure_date.split(' - ')[0]+`</span></br>
                                            <span style="font-size:13px; font-weight:500;">`+resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].legs[l].origin_city+` (`+resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].legs[l].origin+`)</span>
                                        </div>
                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                            <table style="width:100%; margin-bottom:6px;">
                                                <tr>
                                                    <td><h5>`+resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].legs[l].arrival_date.split(' - ')[1]+`</h5></td>
                                                    <td></td>
                                                    <td style="height:30px;padding:0 15px;width:100%"></td>
                                                </tr>
                                            </table>
                                            <span style="font-size:13px;">`+resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].legs[l].arrival_date.split(' - ')[0]+`</span><br/>
                                            <span style="font-size:13px; font-weight:500;">`+resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].legs[l].destination_city+` (`+resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].legs[l].destination+`)</span>
                                        </div>
                                    </div>`;
                            }
                            if(k == resJson.result.response.price_itinerary_provider[i].journeys[j].segments.length - 1)
                                text+=`</div>`;
                            if(resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].fares.length > 0 ){
                                fare_print = true;
//                                for(l in resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].fares){
//                                    if(resJson.result.response.price_itinerary_provider[i].journeys[j].segments[k].fares[l].service_charge_summary.length > 0){
//                                    //term n condition
//                                        text+=`
//                                        <div class="col-lg-12" id="rules`+rules+`" style="padding-bottom:15px; padding-top:15px;">
//                                            <span class="carrier_code_template"> Term and Condition </span><br/>
//                                            <span style="font-size:16px; font-weight:bold;">PLEASE WAIT ... </span>
//                                            <div class="sk-circle">
//                                                <div class="sk-circle1 sk-child"></div>
//                                                <div class="sk-circle2 sk-child"></div>
//                                                <div class="sk-circle3 sk-child"></div>
//                                                <div class="sk-circle4 sk-child"></div>
//                                                <div class="sk-circle5 sk-child"></div>
//                                                <div class="sk-circle6 sk-child"></div>
//                                                <div class="sk-circle7 sk-child"></div>
//                                                <div class="sk-circle8 sk-child"></div>
//                                                <div class="sk-circle9 sk-child"></div>
//                                                <div class="sk-circle10 sk-child"></div>
//                                                <div class="sk-circle11 sk-child"></div>
//                                                <div class="sk-circle12 sk-child"></div>
//                                            </div>
//                                        </div>`;
//                                rules++;
//                                //price
//                                price = 0;
//                                //adult
//                                $text+= 'Price\n';
//
//                                        try{//adult
//                                            if(airline_request.adult != 0){
//                                                try{
//                                                if(airline_price[price_counter].ADT['roc'] != null)
//                                                    price = airline_price[price_counter].ADT['roc'];
//                                                if(airline_price[price_counter].ADT.tax != null)
//                                                    price += airline_price[price_counter].ADT.tax;
//                                                }catch(err){
//
//                                                }
//                                                commission = 0;
//                                                if(airline_price[price_counter].ADT['rac'] != null)
//                                                    commission = airline_price[price_counter].ADT['rac']
//                                                commission_price += airline_request.adult * commission;
//                                                total_price += airline_request.adult * (airline_price[price_counter].ADT['fare'] + price);
//                                                text+=`
//                                                <div class="col-lg-12">
//                                                    <div class="row">
//                                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
//                                                            <span style="font-size:13px; font-weight:500;">`+airline_request.adult+`x Adult Fare @`+airline_price[price_counter].ADT.currency +' '+getrupiah(Math.ceil(airline_price[price_counter].ADT.fare))+`</span><br/>
//                                                        </div>
//                                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
//                                                            <span style="font-size:13px; font-weight:500;">`+getrupiah(Math.ceil(airline_price[price_counter].ADT.fare * airline_request.adult))+`</span>
//                                                        </div>
//                                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
//                                                            <span style="font-size:13px; font-weight:500;">`+airline_request.adult+`x Service Charge</span>
//                                                        </div>
//                                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
//                                                            <span style="font-size:13px; font-weight:500;">`+getrupiah(Math.ceil(price * airline_request.adult))+`</span>
//                                                        </div>
//                                                    </div>
//                                                </div>`;
//                                                $text += airline_request.adult + ' Adult Fare @'+ airline_price[price_counter].ADT.currency +' '+getrupiah(Math.ceil(airline_price[price_counter].ADT.fare))+'\n';
//                                                $text += airline_request.adult + ' Adult Tax @'+ airline_price[price_counter].ADT.currency +' '+getrupiah(Math.ceil(price))+'\n';
//                                                price = 0;
//                                            }
//                                        }catch(err){
//
//                                        }
//
//                                        try{//child
//                                            if(airline_request.child != 0){
//                                                try{
//                                                    if(airline_price[price_counter].CHD['roc'] != null)
//                                                        price = airline_price[price_counter].CHD['roc'];
//                                                    if(airline_price[price_counter].CHD.tax != null)
//                                                        price += airline_price[price_counter].CHD.tax;
//                                                }catch(err){
//
//                                                }
//                                                commission = 0;
//                                                if(airline_price[price_counter].CHD['rac'] != null)
//                                                    commission = airline_price[price_counter].CHD['rac'];
//                                                commission_price += airline_request.child * commission;
//                                                total_price += airline_request.child * (airline_price[price_counter].CHD['fare'] + price);
//                                                text+=`
//                                                <div class="col-lg-12">
//                                                    <div class="row">
//                                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
//                                                            <span style="font-size:13px; font-weight:500;">`+airline_request.child+`x Child Fare @`+airline_price[price_counter].CHD.currency+' '+getrupiah(Math.ceil(airline_price[price_counter].CHD.fare))+`</span><br/>
//                                                        </div>
//                                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
//                                                            <span style="font-size:13px; font-weight:500;">`+getrupiah(Math.ceil(airline_price[price_counter].CHD.fare * airline_request.child))+`</span>
//                                                        </div>
//                                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
//                                                            <span style="font-size:13px; font-weight:500;">`+airline_request.child+`x Service Charge</span>
//                                                        </div>
//                                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
//                                                            <span style="font-size:13px; font-weight:500;">`+getrupiah(Math.ceil(price * airline_request.child))+`</span>
//                                                        </div>
//                                                    </div>
//                                                </div>`;
//                                                $text += airline_request.child + ' Child Fare @'+ airline_price[i].CHD.currency +' '+getrupiah(Math.ceil(airline_price[i].CHD.fare))+'\n';
//                                                $text += airline_request.child + ' Child Tax @'+ airline_price[i].CHD.currency +' '+getrupiah(Math.ceil(price))+'\n';
//                                                price = 0;
//                                            }
//                                        }catch(err){
//
//                                        }
//
//                                        try{//infant
//                                            if(airline_request.infant != 0){
//                                                price = 0;
//                                                try{
//                                                    if(airline_price[price_counter].INF['roc'] != null)
//                                                        price = airline_price[price_counter].INF['roc'];
//                                                    if(airline_price[price_counter].INF.tax != null)
//                                                        price += airline_price[price_counter].INF.tax;
//                                                }catch(err){
//
//                                                }
//                                                commission = 0;
//                                                try{
//                                                    if(airline_price[price_counter].INF['rac'] != null)
//                                                        commission = airline_price[price_counter].INF['rac'];
//                                                }catch(err){
//
//                                                }
//                                                commission_price += airline_request.infant * commission;
//                                                total_price += airline_request.infant * (airline_price[price_counter].INF['fare'] + price);
//                                                text+=`
//                                                <div class="col-lg-12">
//                                                    <div class="row">
//                                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
//                                                            <span style="font-size:13px; font-weight:500;">`+airline_request.infant+`x Infant Fare @`+airline_price[price_counter].INF.currency+' '+getrupiah(Math.ceil(airline_price[price_counter].INF.fare))+`</span><br/>
//                                                        </div>
//                                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
//                                                            <span style="font-size:13px; font-weight:500;">`+getrupiah(Math.ceil(airline_price[price_counter].INF.fare * airline_request.infant))+`</span>
//                                                        </div>
//                                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
//                                                            <span style="font-size:13px; font-weight:500;">`+airline_request.infant+`x Service Charge</span>
//                                                        </div>
//                                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
//                                                            <span style="font-size:13px; font-weight:500;">`+getrupiah(Math.ceil(price * airline_request.infant))+`</span>
//                                                        </div>
//                                                    </div>
//                                                </div>`;
//                                                $text += airline_request.infant + ' Infant Fare @'+ airline_price[price_counter].INF.currency +' '+getrupiah(Math.ceil(airline_price[price_counter].INF.fare))+'\n';
//                                                $text += airline_request.infant + ' Infant Tax @'+ airline_price[price_counter].INF.currency +' '+getrupiah(Math.ceil(price))+'\n';
//                                                price = 0;
//                                            }
//                                        }catch(err){
//
//                                        }
//                                        price_counter++;
//                                        $text += '\n';
//                                    }
//                                }
                            }
                        }
                        if(fare_print == true){
                            fare_print = false;
                            text+=`
                                    <div class="col-lg-12" id="rules`+rules+`" style="padding-bottom:15px; padding-top:15px;">
                                        <span class="carrier_code_template"> Term and Condition </span><br/>
                                        <span style="font-size:16px; font-weight:bold;">PLEASE WAIT ... </span>
                                        <div class="sk-circle">
                                            <div class="sk-circle1 sk-child"></div>
                                            <div class="sk-circle2 sk-child"></div>
                                            <div class="sk-circle3 sk-child"></div>
                                            <div class="sk-circle4 sk-child"></div>
                                            <div class="sk-circle5 sk-child"></div>
                                            <div class="sk-circle6 sk-child"></div>
                                            <div class="sk-circle7 sk-child"></div>
                                            <div class="sk-circle8 sk-child"></div>
                                            <div class="sk-circle9 sk-child"></div>
                                            <div class="sk-circle10 sk-child"></div>
                                            <div class="sk-circle11 sk-child"></div>
                                            <div class="sk-circle12 sk-child"></div>
                                        </div>
                                    </div>`;
                            rules++;
                            //price
                            price = 0;
                            //adult
                            $text+= 'Price\n';

                                    try{//adult
                                        if(airline_request.adult != 0){
                                            try{
                                            if(airline_price[price_counter].ADT['roc'] != null)
                                                price = airline_price[price_counter].ADT['roc'];
                                            if(airline_price[price_counter].ADT.tax != null)
                                                price += airline_price[price_counter].ADT.tax;
                                            }catch(err){

                                            }
                                            commission = 0;
                                            if(airline_price[price_counter].ADT['rac'] != null)
                                                commission = airline_price[price_counter].ADT['rac']
                                            commission_price += airline_request.adult * commission;
                                            total_price += airline_request.adult * (airline_price[price_counter].ADT['fare'] + price);
                                            text+=`
                                            <div class="col-lg-12">
                                                <div class="row">
                                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                                                        <span style="font-size:13px; font-weight:500;">`+airline_request.adult+`x Adult Fare @`+airline_price[price_counter].ADT.currency +' '+getrupiah(Math.ceil(airline_price[price_counter].ADT.fare))+`</span><br/>
                                                    </div>
                                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                                                        <span style="font-size:13px; font-weight:500;">`+getrupiah(Math.ceil(airline_price[price_counter].ADT.fare * airline_request.adult))+`</span>
                                                    </div>
                                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                                                        <span style="font-size:13px; font-weight:500;">`+airline_request.adult+`x Service Charge</span>
                                                    </div>
                                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                                                        <span style="font-size:13px; font-weight:500;">`+getrupiah(Math.ceil(price * airline_request.adult))+`</span>
                                                    </div>
                                                </div>
                                            </div>`;
                                            $text += airline_request.adult + ' Adult Fare @'+ airline_price[price_counter].ADT.currency +' '+getrupiah(Math.ceil(airline_price[price_counter].ADT.fare))+'\n';
                                            $text += airline_request.adult + ' Adult Tax @'+ airline_price[price_counter].ADT.currency +' '+getrupiah(Math.ceil(price))+'\n';
                                            price = 0;
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
                                            commission_price += airline_request.child * commission;
                                            total_price += airline_request.child * (airline_price[price_counter].CHD['fare'] + price);
                                            text+=`
                                            <div class="col-lg-12">
                                                <div class="row">
                                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                                                        <span style="font-size:13px; font-weight:500;">`+airline_request.child+`x Child Fare @`+airline_price[price_counter].CHD.currency+' '+getrupiah(Math.ceil(airline_price[price_counter].CHD.fare))+`</span><br/>
                                                    </div>
                                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                                                        <span style="font-size:13px; font-weight:500;">`+getrupiah(Math.ceil(airline_price[price_counter].CHD.fare * airline_request.child))+`</span>
                                                    </div>
                                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                                                        <span style="font-size:13px; font-weight:500;">`+airline_request.child+`x Service Charge</span>
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
                                            commission_price += airline_request.infant * commission;
                                            total_price += airline_request.infant * (airline_price[price_counter].INF['fare'] + price);
                                            text+=`
                                            <div class="col-lg-12">
                                                <div class="row">
                                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                                                        <span style="font-size:13px; font-weight:500;">`+airline_request.infant+`x Infant Fare @`+airline_price[price_counter].INF.currency+' '+getrupiah(Math.ceil(airline_price[price_counter].INF.fare))+`</span><br/>
                                                    </div>
                                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                                                        <span style="font-size:13px; font-weight:500;">`+getrupiah(Math.ceil(airline_price[price_counter].INF.fare * airline_request.infant))+`</span>
                                                    </div>
                                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                                                        <span style="font-size:13px; font-weight:500;">`+airline_request.infant+`x Service Charge</span>
                                                    </div>
                                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                                                        <span style="font-size:13px; font-weight:500;">`+getrupiah(Math.ceil(price * airline_request.infant))+`</span>
                                                    </div>
                                                </div>
                                            </div>`;
                                            $text += airline_request.infant + ' Infant Fare @'+ airline_price[price_counter].INF.currency +' '+getrupiah(Math.ceil(airline_price[price_counter].INF.fare))+'\n';
                                            $text += airline_request.infant + ' Infant Tax @'+ airline_price[price_counter].INF.currency +' '+getrupiah(Math.ceil(price))+'\n';
                                            price = 0;
                                        }
                                    }catch(err){

                                    }
                                    price_counter++;
                                    $text += '\n';
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
                $text += 'Grand Total: IDR '+ getrupiah(Math.ceil(total_price)) + '\nPrices and availability may change at any time';
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
                text+=`</div>`;
                if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false)
                    text+=`
                        <div class="col-lg-12" style="text-align:center; display:none;" id="show_commission">
                            <div class="alert alert-success">
                                <span style="font-size:13px; font-weight: bold;">Your Commission: IDR `+getrupiah(commission_price*-1)+`</span><br>
                            </div>
                        </div>`;
                text+=`
                    <div class="col-lg-4 col-md-4 col-sm-4" style="padding-bottom:5px;">
                        <input class="primary-btn" style="width:100%;" type="button" onclick="copy_data();" value="Copy">
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-4" style="padding-bottom:5px;">`;
                if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false)
                   text+=`
                        <input class="primary-btn" id="show_commission_button" style="width:100%;" type="button" onclick="show_commission('commission');" value="Show Commission"><br/>
                    `;
                text += `</div>`;
                if(agent_security.includes('book_reservation') == true)
                text+=`
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

            }else if(resJson.result.error_code == 4003 || resJson.result.error_code == 4002){
                auto_logout();
            }else if(resJson.result.error_code == 4024){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  text: resJson.result.error_msg,
                }).then((result) =>{
                  if (result.value) {
                    window.location.href="/airline";
                  }
                })
            }
            else{
                //document.getElementById("badge-flight-notif").innerHTML = "0";
                //document.getElementById("badge-flight-notif2").innerHTML = "0";
                //$("#badge-flight-notif").removeClass("infinite");
                //$("#badge-flight-notif2").removeClass("infinite");
                //$('#button_chart_airline').hide();
                text = `<div class="col-lg-12" style="text-align:center;"><span style="font-weight: bold; font-size:14px; padding:15px;">No Price Itinerary</span></div>`;
//                check_other_class = false;
//                for(pick in airline_pick_list){
//                    for(segment in airline_pick_list[pick].segments){
//                        if(airline_pick_list[pick].segments[segment].fares.length > 1){
//                            check_other_class = true;
//                            break;
//                        }
//                    }
//                    if(check_other_class == true)
//                        break;
//                }
//                if(check_other_class == true){
//                    text += `<div class="col-lg-12" style="text-align:center;"><button type="button" class="primary-btn-custom" onclick="set_automatic_combo_price('');">Change class to combo</button></div>`;
//                }

                document.getElementById('airline_detail').innerHTML = text;
                $('#loading-search-flight').hide();
                $('#choose-ticket-flight').hide();
            }

       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           if(XMLHttpRequest.status == 500){
               added = 1;
               for(i in airline_pick_list){
                    try{
                        document.getElementById('changejourney_pick'+parseInt(parseInt(i)+added)).disabled = false;
                    }catch(err){
                        added++;
                        try{
                            document.getElementById('changejourney_pick'+parseInt(parseInt(i)+added)).disabled = false;
                        }catch(err){}
                    }
               }
               //document.getElementById("badge-flight-notif").innerHTML = "0";
               //document.getElementById("badge-flight-notif2").innerHTML = "0";
               //$("#badge-flight-notif").removeClass("infinite");
               //$("#badge-flight-notif2").removeClass("infinite");
               //$('#button_chart_airline').hide();
               text = `<span style="font-weight: bold; font-size:14px; padding:15px;">No Price Itinerary</span>`;
               document.getElementById('airline_detail').innerHTML = text;
               $('#loading-search-flight').hide();
               $('#choose-ticket-flight').hide();
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error airline price itinerary request </span>' + errorThrown,
                })
                $('.loader-rodextrip').fadeOut();
            }
       },timeout: 120000
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
       data: {
            'signature': airline_signature
       },
       success: function(msg) {
            console.log(msg);
            count_fare = 0;
            text_fare = '';
            if(msg.result.error_code == 0){
                for(i in msg.result.response.fare_rule_provider){
                    if(msg.result.response.fare_rule_provider[i].hasOwnProperty('journeys') == true){
                        if(msg.result.response.fare_rule_provider[i].status != 'FAILED'){
                            text_fare+=`
                                <span id="span-tac-up`+count_fare+`" class="carrier_code_template" style="display:none; cursor:pointer;" onclick="show_hide_tac(`+count_fare+`);"> Show Term and Condition <i class="fas fa-chevron-down"></i></span>
                                <span id="span-tac-down`+count_fare+`" class="carrier_code_template" style="display:block; cursor:pointer;" onclick="show_hide_tac(`+count_fare+`);"> Hide Term and Condition <i class="fas fa-chevron-up"></i></span>
                                <div id="div-tac`+count_fare+`" style="display:block;">`;
                            for(k in msg.result.response.fare_rule_provider[i].rules){
                                if(msg.result.response.fare_rule_provider[i].rules[k] != ""){
                                    text_fare += `<span style="font-weight:400;"><i class="fas fa-circle" style="font-size:9px;"></i> `+msg.result.response.fare_rule_provider[i].rules[k]+`</span><br/>`;
                                }
                            }
                            if(msg.result.response.fare_rule_provider[i].rules.length == 0)
                                text_fare += `<span style="font-weight:400;"><i class="fas fa-circle" style="font-size:9px;"></i> No fare rules</span><br/>`;
                            text_fare+=`</div>`;
                        }else{
                            text_fare += 'No fare rules';
                        }
                        try{
                            document.getElementById('rules'+count_fare).innerHTML = text_fare;
                        }catch(err){

                        }
                        text_fare = '';
                        count_fare++;
                    }else{
                        try{
                            for(var i=0;i<5;i++)//hardcode
                                document.getElementById('rules'+i).innerHTML = 'No fare rules';
                        }catch(err){

                        }
                    }

                }
                try{
                    for(var i=count_fare;i<5;i++)//hardcode
                        document.getElementById('rules'+i).innerHTML = 'No fare rules';
                }catch(err){

                }

            }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
            }else if(msg.result.error_code == 4024){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  text: msg.result.error_msg,
                }).then((result) =>{
                  if (result.value) {
                    window.location.href="/airline";
                  }
                })
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
           if(XMLHttpRequest.status == 500){
                try{
                    for(var i=0;i<100;i++)//hardcode
                        document.getElementById('rules'+i).innerHTML = '<b>Oops! Something went wrong, please choose / change again and check your internet connection</b>';
                }catch(err){

                }
           }
       },timeout: 60000
    });
}

function airline_sell_journeys(){
    $('.loader-rodextrip').fadeIn();
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'sell_journeys',
       },
       data: {
            'signature': airline_signature,
       },
       success: function(msg) {
           console.log(msg);
           if(msg.result.error_code == 0){
               get_seat_availability('');
           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
           }else if(msg.result.error_code == 4024){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  text: msg.result.error_msg,
                }).then((result) =>{
                  if (result.value) {
                    window.location.href="/airline";
                  }
                })
           }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error airline sell journeys </span>' + msg.result.error_msg,
                })
                $('.loader-rodextrip').fadeOut();
                $('.btn-next').removeClass('running');
                $('.btn-next').prop('disabled', false);
                $('.loader-rodextrip').fadeOut();
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status == 500){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error airline sell journeys </span>' + errorThrown,
                })
                $('.loader-rodextrip').fadeOut();
               $('.btn-next').removeClass('running');
               $('.btn-next').prop('disabled', false);
               $('.loader-rodextrip').fadeOut();
            }
       },timeout: 60000
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
       data: {
            'signature': airline_signature
       },
       success: function(msg) {
            console.log(msg);
            if(type == '')
                get_ssr_availabilty(type);
            else if(type == 'request_new_seat' && msg.result.error_code == 0)
                window.location.href='/airline/seat_map';
            else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error airline seat availability </span>' + msg.result.error_msg,
                })
                $('.loader-rodextrip').fadeOut();
                $('#show_loading_booking_airline').hide();
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status == 500){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error airline seat availability </span>' + errorThrown,
                })
                $('.loader-rodextrip').fadeOut();
            }
       },timeout: 60000
    });
}

function get_seat_map_response(){
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'get_seat_map_response',
       },
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
                        set_seat_show_segments = seat_map.seat_availability_provider[i].segments[j].segment_code2+'_'+seat_map.seat_availability_provider[i].segments[j].departure_date;
                        segment_list.push(seat_map.seat_availability_provider[i].segments[j].segment_code2);
                        text += `
                        <div class="col-lg-4 col-md-6 col-sm-6 col-xs-6">
                            <button class="button-seat-pass" style="width:100%; margin-right:10px; margin-bottom:10px; padding:10px;" type="button" id="`+seat_map.seat_availability_provider[i].segments[j].segment_code2+`_`+seat_map.seat_availability_provider[i].segments[j].departure_date+`" onclick="show_seat_map('`+seat_map.seat_availability_provider[i].segments[j].segment_code2+`_`+seat_map.seat_availability_provider[i].segments[j].departure_date+`', false)">
                                <span>`+seat_map.seat_availability_provider[i].segments[j].segment_code2+`</span>
                            </button>
                        </div>`;
                    }else
                    text += `
                    <div class="col-lg-4 col-md-6 col-sm-6 col-xs-6">
                        <button class="button-seat-pass" style="width:100%; margin-right:10px; margin-bottom:10px; padding:10px; color:black; background-color:white;" id="`+seat_map.seat_availability_provider[i].segments[j].segment_code2+`_`+seat_map.seat_availability_provider[i].segments[j].departure_date+`" type="button" onclick="show_seat_map('`+seat_map.seat_availability_provider[i].segments[j].segment_code2+`_`+seat_map.seat_availability_provider[i].segments[j].departure_date+`', false)">
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
            if(XMLHttpRequest.status == 500){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error airline seat map response </span>' + errorThrown,
                })
                $('.loader-rodextrip').fadeOut();
            }
       },timeout: 60000
    });
}

function show_seat_map(val, checked){
    if(val != set_seat_show_segments || checked == true){
        document.getElementById(set_seat_show_segments).style.background = 'white';
        document.getElementById(set_seat_show_segments).style.color = 'black';
        document.getElementById(val).style.background = color;
        document.getElementById(val).style.color = 'white';
        set_seat_show_segments = val;
        text = '';
        check = 0;
        for(i in seat_map.seat_availability_provider){
            if(check == 1)
                break;
            for(j in seat_map.seat_availability_provider[i].segments){
                if(seat_map.seat_availability_provider[i].segments[j].segment_code2+'_'+seat_map.seat_availability_provider[i].segments[j].departure_date == set_seat_show_segments){
                    try{
                        for(k in seat_map.seat_availability_provider[i].segments[j].seat_cabins){
                            text+=`<div class="mySlides1">
                                        <div style="width:100%;text-align:center;">`;

                            percent = parseInt(50 / seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[0].seats.length+1);
                            for(l in seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows){
                                if(l == 0){
                                    text+=`<div style="width:100%;text-align:center;">`;
                                    for(m in seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats){
                                        if(m == 0)
                                            text+=`<input type="button" style="width:`+(percent)+`%;background-color:transparent;font-size:13px;border:transparent; padding:3px;" id="header`+m+`_`+m+`" disabled/>`;
                                        text+=`<input type="button" style="width:`+(percent+0.5)+`%;background-color:transparent;font-size:13px;border:transparent; padding:3px;" id="header`+m+`" value="`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].column+`" disabled/>`;
    //                                    text+=`<label style="width:`+percent+`%;margin:3px;cursor:not-allowed;">`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].column+`</label>`;
                                    }
                                    text+=`</div>`;
                                }
                                text+=`<div style="width:100%;text-align:center;">`;
                                for(m in seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats){
                                    if(m == 0)
                                        text+=`<label style="width:`+percent+`%; color:`+text_color+`; padding:3px;font-size:13px;color:black" id="">`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].row_number+`</label>`;
                                    check = 0;
                                    for(n in passengers){
                                        if(check == 1)
                                            break;
                                        for(o in passengers[n].seat_list){
                                            if(passenger_pick == n){
                                                if(passengers[n].seat_list[o].segment_code == seat_map.seat_availability_provider[i].segments[j].segment_code2 && seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].row_number+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].column == passengers[n].seat_list[o].seat_pick && passengers[n].seat_list[o].departure_date == seat_map.seat_availability_provider[i].segments[j].departure_date){
                                                    check = 1;
                                                    text+=`<input class="button-seat-map" type="button" style="width:`+percent+`%;font-size:13px;background-color:`+color+`; padding:3px;color:`+text_color+`;" onclick="alert('Already booked');" id="`+seat_map.seat_availability_provider[i].segments[j].segment_code2+`_`+seat_map.seat_availability_provider[i].segments[j].departure_date+`_`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].row_number+`_`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].column+`" value="`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].row_number+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].column+`"/>`;
                                                    break;
                                                }
                                            }else if(passengers[n].seat_list[o].segment_code == seat_map.seat_availability_provider[i].segments[j].segment_code2 && seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].row_number+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].column == passengers[n].seat_list[o].seat_pick && passengers[n].seat_list[o].departure_date == seat_map.seat_availability_provider[i].segments[j].departure_date){
                                                console.log('other_pax');
                                                check = 1;
                                                text+=`<input class="button-seat-map" type="button" style="width:`+percent+`%;font-size:13px;background-color:#ff8971; padding:3px;color:`+text_color+`;" onclick="alert('Already booked');" id="`+seat_map.seat_availability_provider[i].segments[j].segment_code2+`_`+seat_map.seat_availability_provider[i].segments[j].departure_date+`_`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].row_number+`_`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].column+`"  value="`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].row_number+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].column+`"/>`;
                                                break;
                                            }
                                        }
                                    }
                                    if(check == 0){
                                        if(seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].availability == 0){
                                            text+=`<input class="button-seat-map" type="button" style="width:`+percent+`%;font-size:13px;background-color:#656565; color:`+text_color+`; padding:3px;" id="`+seat_map.seat_availability_provider[i].segments[j].segment_code2+`_`+seat_map.seat_availability_provider[i].segments[j].departure_date+`_`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].row_number+`_`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].column+`" onclick="alert('Already booked');" value="`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].row_number+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].column+`"/>`;
                                        }else if(seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].availability == 1){
                                            text+=`<input class="button-seat-map" type="button" style="width:`+percent+`%;font-size:13px;background-color:#CACACA; padding:3px;" id="`+seat_map.seat_availability_provider[i].segments[j].segment_code2+`_`+seat_map.seat_availability_provider[i].segments[j].departure_date+`_`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].row_number+`_`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].column+`"
                                            onclick="update_seat_passenger('`+seat_map.seat_availability_provider[i].segments[j].segment_code2+`',
                                                                           '`+seat_map.seat_availability_provider[i].segments[j].departure_date+`',
                                                                           '`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].row_number+`',
                                                                           '`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].column+`',
                                                                           '`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].seat_code+`',
                                                                           '`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].seat_name+`',
                                                                           '`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].service_charges[0].currency+`',
                                                                           '`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].service_charges[0].amount+`',
                                                                           '`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].description+`')"
                                            value='`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].row_number+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].column+`'/>`;
                                        }else if(seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].availability == -1){
                                            text+=`<input type="button" style="width:`+percent+`%;background-color:transparent;font-size:13px;border:transparent; padding:3px;" id="`+seat_map.seat_availability_provider[i].segments[j].segment_code2+`_`+seat_map.seat_availability_provider[i].segments[j].departure_date+`_`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].row_number+`_`+seat_map.seat_availability_provider[i].segments[j].seat_cabins[k].seat_rows[l].seats[m].column+`" value="" disabled/>`;
                                        }
                                    }
                                }
                                text+=`</div>`;
                            }
                            text+=`
                                </div>
                            </div>`;
                        }

                        check = 1;
                        if(text != '')
                            text+=`<a class="prev" onclick="plusSlides(-1, 0)" style="font-size:15px; padding:0px;">&#10094; Prev</a>
                               <a class="next" onclick="plusSlides(1, 0)" style="font-size:15px; padding:0px;">Next &#10095;</a>`;
                        break;
                    }catch(err){}
                }
            }
        }
        document.getElementById('airline_slideshow').innerHTML = text;
        showSlides(1, 0);
    }
}

function set_passenger_seat_map_airline(val){
    text='';
    text += `<hr/><h5 style="color:`+color+`;">`+passengers[val].title+` `+passengers[val].first_name+` `+passengers[val].last_name+`</h5>`;
    for(i in passengers[val].seat_list){
        text+=`<h6 style="padding-top:10px;">`+passengers[val].seat_list[i].segment_code+`: `+passengers[val].seat_list[i].seat_name+` `+passengers[val].seat_list[i].seat_pick+`</h6>`;
        text+=`<span style="font-weight:400; font-size:14px;">Price: `+passengers[val].seat_list[i].currency+` `+getrupiah(passengers[val].seat_list[i].price)+`</span><br/><br/>`;
        for(j in passengers[val].seat_list[i].description){
            //if(j == 0)
                //text+=`<span style="font-weight:400; font-size:14px;">Description:</span><br/>`;
            text+=`<span>`+passengers[val].seat_list[i].description[j]+`</span><br/>`;
        }
        if(passengers[val].seat_list[i].seat_name != '')
            text+= `<input class="button-seat-pass button-seat-pass-cancel" type="button" id="cancel_seat`+i+`" style="width: 30%; padding: 10px; margin-right: 10px; text-align: center; margin-bottom: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: white;" onclick="set_cancel_seat(`+i+`);" value="Cancel Seat">`;
    }
    document.getElementById('passenger'+(passenger_pick+1)).style.background = 'white';
    document.getElementById('passenger'+(passenger_pick+1)).style.color = 'black';
    document.getElementById('passenger'+(val+1)).style.background = color;
    document.getElementById('passenger'+(val+1)).style.color = 'white';
    passenger_pick = val;
    document.getElementById('airline_passenger_detail_seat').innerHTML = text;
    try{
        show_seat_map(set_seat_show_segments,true);
        airline_detail(type);
    }catch(err){
        airline_detail('request_new');
    }

}

function set_first_passenger_seat_map_airline(val){
    text='';
    text += `<hr/><h5 style="color:`+color+`;">`+passengers[val].title+` `+passengers[val].first_name+` `+passengers[val].last_name+`</h5>`;
    for(i in passengers[val].seat_list){
        text+=`<h6 style="padding-top:10px;">`+passengers[val].seat_list[i].segment_code+`: `+passengers[val].seat_list[i].seat_name+` `+passengers[val].seat_list[i].seat_pick+`</h6>`;
        text+=`<span style="font-weight:400; font-size:14px;">Price: `+passengers[val].seat_list[i].currency+` `+getrupiah(passengers[val].seat_list[i].price)+`</span><br/><br/>`;
        for(j in passengers[val].seat_list[i].description){
            //if(j == 0)
                //text+=`<span style="font-weight:400; font-size:14px;">Description:</span><br/>`;
            text+=`<span>`+passengers[val].seat_list[i].description[j]+`</span><br/>`;
        }
        if(passengers[val].seat_list[i].seat_name != '')
            text+= `<input class="button-seat-pass button-seat-pass-cancel" type="button" id="cancel_seat" style="width: 30%; background: #f15a22; padding: 10px; margin-right: 10px; text-align: center; margin-bottom: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: white;" onclick="set_cancel_seat(`+i+`);" value="Cancel Seat">`;
    }
    document.getElementById('passenger'+(val+1)).style.background = color;
    document.getElementById('passenger'+(val+1)).style.color = 'white';
    passenger_pick = val;
    document.getElementById('airline_passenger_detail_seat').innerHTML = text;
}

function set_cancel_seat(segment_number){
    if(isNaN(passengers[passenger_pick].seat_list[i].price) == false)
        additional_price -= parseFloat(passengers[passenger_pick].seat_list[i].price);
    passengers[passenger_pick].seat_list[segment_number].seat_pick = '';
    passengers[passenger_pick].seat_list[segment_number].seat_code = '';
    passengers[passenger_pick].seat_list[segment_number].seat_name = '';
    passengers[passenger_pick].seat_list[segment_number].currency = '';
    passengers[passenger_pick].seat_list[segment_number].price = '';
    passengers[passenger_pick].seat_list[segment_number].description = '';
    set_passenger_seat_map_airline(passenger_pick);
}

function update_seat_passenger(segment, departure_date, row, column,seat_code,seat_name, currency, amount,description){
    if(isNaN(passenger_pick) == false){
        try{
            for(i in passengers[passenger_pick].seat_list){
                if(passengers[passenger_pick].seat_list[i].segment_code == segment && departure_date == passengers[passenger_pick].seat_list[i].departure_date){
                    //lepas passenger seat
                    if(passengers[passenger_pick].seat_list[i].seat_pick != ''){
                        document.getElementById(segment+'_'+departure_date+'_'+parseInt(passengers[passenger_pick].seat_list[i].seat_pick)+'_'+passengers[passenger_pick].seat_list[i].seat_pick[passengers[passenger_pick].seat_list[i].seat_pick.length-1]).style.background = '#CACACA';
                        document.getElementById(segment+'_'+departure_date+'_'+parseInt(passengers[passenger_pick].seat_list[i].seat_pick)+'_'+passengers[passenger_pick].seat_list[i].seat_pick[passengers[passenger_pick].seat_list[i].seat_pick.length-1]).style.color = 'black';
                    }
                    //pasang passenger seat
                    if(passengers[passenger_pick].seat_list[i].price != '')
                        additional_price -= parseFloat(passengers[passenger_pick].seat_list[i].price);
                    additional_price += parseFloat(amount);
                    passengers[passenger_pick].seat_list[i].seat_pick = row+column;
                    passengers[passenger_pick].seat_list[i].seat_code = seat_code;
                    passengers[passenger_pick].seat_list[i].seat_name = seat_name;
                    passengers[passenger_pick].seat_list[i].currency = currency;
                    passengers[passenger_pick].seat_list[i].price = amount;
                    passengers[passenger_pick].seat_list[i].description = description.split(',');
                    document.getElementById(segment+'_'+departure_date+'_'+row+'_'+column).style.background = color;
                    document.getElementById(segment+'_'+departure_date+'_'+row+'_'+column).style.color = 'white';
                    break;
                }
            }
            set_passenger_seat_map_airline(passenger_pick);
        }catch(err){
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              text: 'Please choose passenger first!',
            })
            $('.loader-rodextrip').fadeOut();
        }
    }else{
        Swal.fire({
          type: 'error',
          title: 'Oops!',
          text: 'Please choose passenger first!',
        })
        $('.loader-rodextrip').fadeOut();
    }
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
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: #ff9900;">Error airline ssr availability </span>' + msg.result.error_msg,
                    })
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status == 500){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error airline ssr availability </span>' + errorThrown,
                })
                $('.loader-rodextrip').fadeOut();
            }
       },timeout: 60000
    });
}

function airline_update_passenger(val){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'update_passengers',
       },
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
                if(val == 0)
                    airline_commit_booking(val);
                else
                    document.getElementById('airline_issued').submit();

           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
           }else if(msg.result.error_code == 4024){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  text: msg.result.error_msg,
                }).then((result) =>{
                  if (result.value) {
                    window.location.href="/airline";
                  }
                })
           }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error airline update passenger </span>' + msg.result.error_msg,
                })
                $('.loader-rodextrip').fadeOut();
                $("#waitingTransaction").modal('hide');
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status == 500){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error airline update passenger </span>' + errorThrown,
                })
                $('.loader-rodextrip').fadeOut();
                $("#waitingTransaction").modal('hide');
            }
       },timeout: 60000
    });
}

function airline_update_contact_booker(val){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'update_contacts',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
           console.log(msg);
           if(msg.result.error_code == 0){
                airline_update_passenger(val);
           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
           }else if(msg.result.error_code == 4024){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  text: msg.result.error_msg,
                }).then((result) =>{
                  if (result.value) {
                    window.location.href="/airline";
                  }
                })
           }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error Error airline update booker </span>' + msg.result.error_msg,
                }).then((result) => {
                  if (result.value) {
                    $("#waitingTransaction").modal('hide');
                  }
                })
                $("#waitingTransaction").modal('hide');
                $('.btn-next').removeClass('running');
                $('.btn-next').prop('disabled', false);
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status == 500){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error Error airline update booker </span>' + errorThrown,
                }).then((result) => {
                  if (result.value) {
                    $("#waitingTransaction").modal('hide');
                  }
                })
                $("#waitingTransaction").modal('hide');
                $('.btn-next').removeClass('running');
                $('.btn-next').prop('disabled', false);
            }
       },timeout: 300000
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
       data: {
            'signature': signature
       },
       success: function(msg) {
           console.log(msg);
           if(msg.result.error_code == 0){
                for(i in msg.result.response.sell_ssr_provider){
                    error_log = '';
                    if(msg.result.response.sell_ssr_provider[i].status == "FAILED"){
                        error_log += msg.result.response.sell_ssr_provider[i].error_msg+'\n';
                    }
                }
                if(error_log != ''){
                    Swal.fire({
                      title: msg.result.error_msg,
                      type: 'warning',
                      showCancelButton: true,
                      confirmButtonColor: '#3085d6',
                      cancelButtonColor: '#d33',
                      confirmButtonText: 'Yes'
                    }).then((result) => {
                      if (result.value) {
                        if(seat == 0)
                            airline_assign_seats(val);
                        else
                            if(val == 0)
                                airline_commit_booking(val);
                            else
                                document.getElementById('airline_issued').submit();

                      }else{
                           window.location.href="/dashboard";
                      }
                    })
                }else{
                    if(seat == 0)
                        airline_assign_seats(val);
                    else
                        if(val == 0)
                            airline_commit_booking(val);
                        else
                            document.getElementById('airline_issued').submit();
                }
           }else{
                Swal.fire({
                  title: msg.result.error_msg,
                  type: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Yes'
                }).then((result) => {
                  if (result.value) {
                    if(seat == 0)
                        airline_assign_seats(val);
                    else
                        if(val == 0)
                            airline_commit_booking(val);
                        else
                            document.getElementById('airline_issued').submit();
                  }else{
                       window.location.href="/dashboard";
                  }
                })
           }

       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status == 500){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error airline seat ssr </span>' + errorThrown,
                })
                $('.loader-rodextrip').fadeOut();
            }
       }, timeout: 300000
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
       data: {
            'signature': signature
       },
       success: function(msg) {
           console.log(msg);
           if(msg.result.error_code == 0){
                error_log = '';
                for(i in msg.result.response.seat_provider){
                    if(msg.result.response.seat_provider[i].status == 'FAILED')
                        error_log += msg.result.response.seat_provider[i].error_msg + '\n';
                }
                if(error_log == '')
                    if(val == 0)
                        airline_commit_booking(val);
                    else
                        document.getElementById('airline_issued').submit();
                else{
                    Swal.fire({
                      title: error_log,
                      type: 'warning',
                      showCancelButton: true,
                      confirmButtonColor: '#3085d6',
                      cancelButtonColor: '#d33',
                      confirmButtonText: 'Yes'
                    }).then((result) => {
                      if (result.value)
                            if(val == 0)
                                airline_commit_booking(val);
                            else
                                document.getElementById('airline_issued').submit();
                      else{
                           window.location.href="/dashboard";
                      }
                    })
                }
           }else{
                Swal.fire({
                  title: msg.result.error_msg,
                  type: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Yes'
                }).then((result) => {
                  if (result.value)
                        if(val == 0)
                            airline_commit_booking(val);
                        else
                            document.getElementById('airline_issued').submit();
                  else{
                       window.location.href="/dashboard";
                  }
                })
           }

       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status == 500){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error airline assign seats </span>' + errorThrown,
                })
                $('.loader-rodextrip').fadeOut();
            }
       },timeout: 300000
    });
}

function force_issued_airline(val){
    //tambah swal
    if(val == 0)
    {
        var temp_title = 'Are you sure you want to Hold Booking?';
    }
    else
    {
        var temp_title = 'Are you sure you want to Force Issued this booking?';
    }
    Swal.fire({
      title: temp_title,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        $('.next-loading-booking').addClass("running");
        $('.next-loading-booking').prop('disabled', true);
        $('.next-loading-issued').prop('disabled', true);
        $('.issued_booking_btn').prop('disabled', true);
        please_wait_transaction();
        airline_commit_booking(val);
      }
    })
}

function airline_commit_booking(val){
    data = {
        'value': val,
        'signature': signature,
        'voucher_code': ''
    }
    try{
        data['seq_id'] = payment_acq2[payment_method][selected].seq_id;
        data['member'] = payment_acq2[payment_method][selected].method;
        data['voucher_code'] =  voucher_code;
    }catch(err){}
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'commit_booking',
       },
       data: data,
       success: function(msg) {
           console.log(msg);
           if(msg.result.error_code == 0){
               //send order number
               if(val == 0){
                   if(user_login.co_agent_frontend_security.includes('b2c_limitation') == true)
                        send_url_booking('airline', btoa(msg.result.response.order_number), msg.result.response.order_number);
                   document.getElementById('airline_booking').innerHTML+= '<input type="hidden" name="order_number" value='+msg.result.response.order_number+'>';
                   document.getElementById('airline_booking').action = '/airline/booking/' + btoa(msg.result.response.order_number);
                   document.getElementById('airline_booking').submit();
               }else{
                   if(user_login.co_agent_frontend_security.includes('b2c_limitation') == true)
                        send_url_booking('airline', btoa(msg.result.response.order_number), msg.result.response.order_number);
                   document.getElementById('order_number').value = msg.result.response.order_number;
                   document.getElementById('issued').action = '/airline/booking/' + btoa(msg.result.response.order_number);
                   document.getElementById('issued').submit();
               }
           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
           }else if(msg.result.error_code == 1026){
//                Swal.fire({
//                  title: msg.result.error_msg+ ' Are you sure want to Book this booking?',
//                  type: 'warning',
//                  showCancelButton: true,
//                  confirmButtonColor: '#3085d6',
//                  cancelButtonColor: '#d33',
//                  confirmButtonText: 'Yes'
//                }).then((result) => {
//                  if (result.value) {
//                        please_wait_transaction();
//                        $('.next-loading-booking').addClass("running");
//                        $('.next-loading-booking').prop('disabled', true);
//                        $('.next-loading-issued').prop('disabled', true);
//                        $('.issued_booking_btn').prop('disabled', true);
//                        airline_force_commit_booking(1);
//                  }
//                })
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: 'Booking passenger validator, Please contact BTB!',
                })
                $("#waitingTransaction").modal('hide');
                $('.loader-rodextrip').fadeOut();
                $('.btn-next').removeClass('running');
                $('.btn-next').prop('disabled', false);
           }else if(msg.result.error_code == 4024){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  text: msg.result.error_msg,
                }).then((result) =>{
                  if (result.value) {
                    window.location.href="/airline";
                  }
                })
           }else if(msg.result.error_code == 4014){
                if(val == 0){
                    if(msg.result.response.order_number != ''){
                        document.getElementById('airline_booking').innerHTML+= '<input type="hidden" name="order_number" value='+msg.result.response.order_number+'>';
                        document.getElementById('airline_booking').submit();
                    }else{
                        Swal.fire({
                          type: 'error',
                          title: 'Oops!',
                          html: '<span style="color: #ff9900;">Error airline commit booking </span>' + msg.result.error_msg,
                        }).then((result) => {
                          if (result.value) {
                            $("#waitingTransaction").modal('hide');
                          }
                        })
                        $("#waitingTransaction").modal('hide');
                        $('.loader-rodextrip').fadeOut();
                        $('.btn-next').removeClass('running');
                        $('.btn-next').prop('disabled', false);
                    }
                }else{
                    if(msg.result.response.order_number != ''){
                       if(user_login.co_agent_frontend_security.includes('b2c_limitation') == true)
                            send_url_booking('airline', btoa(msg.result.response.order_number), msg.result.response.order_number);
                       document.getElementById('order_number').value = msg.result.response.order_number;
                       document.getElementById('issued').action = '/airline/booking/' + btoa(msg.result.response.order_number);
                       document.getElementById('issued').submit();
                    }else{
                        Swal.fire({
                          type: 'error',
                          title: 'Oops!',
                          html: '<span style="color: #ff9900;">Error airline commit booking </span>' + msg.result.error_msg,
                        }).then((result) => {
                          if (result.value) {
                            $("#waitingTransaction").modal('hide');
                          }
                        })
                        $("#waitingTransaction").modal('hide');
                        $('.loader-rodextrip').fadeOut();
                        $('.btn-next').removeClass('running');
                        $('.btn-next').prop('disabled', false);
                    }
                }
           }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error airline commit booking </span>' + msg.result.error_msg,
                }).then((result) => {
                  if (result.value) {
                    $("#waitingTransaction").modal('hide');
                  }
                })
                $("#waitingTransaction").modal('hide');
                $('.loader-rodextrip').fadeOut();
                $('.btn-next').removeClass('running');
                $('.btn-next').prop('disabled', false);
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status == 500){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error airline commit booking </span>' + errorThrown,
                }).then((result) => {
                  if (result.value) {
                    $("#waitingTransaction").modal('hide');
                  }
                })
                $("#waitingTransaction").modal('hide');
                $('.loader-rodextrip').fadeOut();
                $('.btn-next').removeClass('running');
                $('.btn-next').prop('disabled', false);
            }
       },timeout: 300000
    });
}

function airline_force_commit_booking(val){
    data = {
        'value': val,
        'signature': signature,
        'voucher_code': ''
    }
    try{
        data['seq_id'] = payment_acq2[payment_method][selected].seq_id;
        data['member'] = payment_acq2[payment_method][selected].method;
        data['bypass_psg_validator'] = true;
        data['voucher_code'] =  voucher_code;
    }catch(err){}
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'commit_booking',
       },
       data: data,
       success: function(msg) {
           console.log(msg);
           if(msg.result.error_code == 0){
               //send order number
               if(val == 0){
                   if(user_login.co_agent_frontend_security.includes('b2c_limitation') == true)
                        send_url_booking('airline', btoa(msg.result.response.order_number), msg.result.response.order_number);
                   document.getElementById('airline_booking').innerHTML+= '<input type="hidden" name="order_number" value='+msg.result.response.order_number+'>';
                   document.getElementById('airline_booking').action = '/airline/booking/' + btoa(msg.result.response.order_number);
                   document.getElementById('airline_booking').submit();
               }else{
                   if(user_login.co_agent_frontend_security.includes('b2c_limitation') == true)
                        send_url_booking('airline', btoa(msg.result.response.order_number), msg.result.response.order_number);
                   document.getElementById('order_number').value = msg.result.response.order_number;
                   document.getElementById('issued').action = '/airline/booking/' + btoa(msg.result.response.order_number);
                   document.getElementById('issued').submit();
               }
           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
           }else if(msg.result.error_code == 4024){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  text: msg.result.error_msg,
                }).then((result) =>{
                  if (result.value) {
                    window.location.href="/airline";
                  }
                })
           }else if(msg.result.error_code == 4014){
                if(val == 0){
                    if(msg.result.response.order_number != ''){
                        document.getElementById('airline_booking').innerHTML+= '<input type="hidden" name="order_number" value='+msg.result.response.order_number+'>';
                        document.getElementById('airline_booking').submit();
                    }else{
                        Swal.fire({
                          type: 'error',
                          title: 'Oops!',
                          html: '<span style="color: #ff9900;">Error airline commit booking </span>' + msg.result.error_msg,
                        }).then((result) => {
                          if (result.value) {
                            window.location.href='/';
                          }
                        })
                        $("#waitingTransaction").modal('hide');
                        $('.loader-rodextrip').fadeOut();
                        $('.btn-next').removeClass('running');
                        $('.btn-next').prop('disabled', false);
                    }
                }else{
                    if(msg.result.response.order_number != ''){
                       if(user_login.co_agent_frontend_security.includes('b2c_limitation') == true)
                            send_url_booking('airline', btoa(msg.result.response.order_number), msg.result.response.order_number);
                       document.getElementById('order_number').value = msg.result.response.order_number;
                       document.getElementById('issued').action = '/airline/booking/' + btoa(msg.result.response.order_number);
                       document.getElementById('issued').submit();
                    }else{
                        Swal.fire({
                          type: 'error',
                          title: 'Oops!',
                          html: '<span style="color: #ff9900;">Error airline commit booking </span>' + msg.result.error_msg,
                        }).then((result) => {
                          if (result.value) {
                            window.location.href='/';
                          }
                        })
                        $("#waitingTransaction").modal('hide');
                        $('.loader-rodextrip').fadeOut();
                        $('.btn-next').removeClass('running');
                        $('.btn-next').prop('disabled', false);
                    }
                }
           }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error airline commit booking </span>' + msg.result.error_msg,
                }).then((result) => {
                  if (result.value) {
                    $("#waitingTransaction").modal('hide');
                  }
                })
                $("#waitingTransaction").modal('hide');
                $('.loader-rodextrip').fadeOut();
                $('.btn-next').removeClass('running');
                $('.btn-next').prop('disabled', false);
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status == 500){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error airline commit booking </span>' + errorThrown,
                }).then((result) => {
                  if (result.value) {
                    $("#waitingTransaction").modal('hide');
                  }
                })
                $("#waitingTransaction").modal('hide');
                $('.loader-rodextrip').fadeOut();
                $('.btn-next').removeClass('running');
                $('.btn-next').prop('disabled', false);
            }
       },timeout: 300000
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
            please_wait_transaction();
            $('.next-loading-booking').addClass("running");
            $('.next-loading-booking').prop('disabled', true);
            $('.next-loading-issued').prop('disabled', true);
            $('.issued_booking_btn').prop('disabled', true);
        }
        else{
            please_wait_transaction();
            $('.next-loading-booking').prop('disabled', true);
            $('.next-loading-issued').addClass("running");
            $('.next-loading-issued').prop('disabled', true);
            $('.issued_booking_btn').prop('disabled', true);
        }
        if(val == 1){
            try{
                document.getElementById("passengers").value = JSON.stringify(passengers);
                document.getElementById("signature").value = signature;
                document.getElementById("provider").value = 'airline';
                document.getElementById("type").value = 'airline_review';
                document.getElementById("voucher_code").value = voucher_code;
                document.getElementById("discount").value = JSON.stringify(discount_voucher);
                document.getElementById("session_time_input").value = time_limit;
            }catch(err){
                console.log(err)
            }
        }
        airline_update_contact_booker(val);
      }
    })
}

function airline_get_booking(data){
    price_arr_repricing = {};
    get_balance('false');
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'get_booking',
       },
       data: {
            'order_number': data,
            'signature': airline_signature
       },
       success: function(msg) {
           console.log(msg);
           airline_get_detail = msg;
           get_payment = false;
           //get booking view edit here
           if(msg.result.error_code == 0){
            var text = '';
            $text = '';
            check_provider_booking = 0;
            if(msg.result.response.hold_date != false && msg.result.response.hold_date != ''){
                tes = moment.utc(msg.result.response.hold_date).format('YYYY-MM-DD HH:mm:ss')
                localTime  = moment.utc(tes).toDate();
                msg.result.response.hold_date = moment(localTime).format('DD MMM YYYY HH:mm');
                var now = moment();
                var hold_date_time = moment(msg.result.response.hold_date, "DD MMM YYYY HH:mm");
            }
            if(msg.result.response.state == 'cancel'){
               document.getElementById('issued-breadcrumb').classList.remove("br-active");
               document.getElementById('issued-breadcrumb').classList.add("br-fail");
               //document.getElementById('issued-breadcrumb').classList.remove("current");
               //document.getElementById('header_issued').innerHTML = `Fail <i class="fas fa-times"></i>`;
               document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
               document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-fail");
               document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
               document.getElementById('issued-breadcrumb-span').innerHTML = `Cancelled`;
            }else if(msg.result.response.state == 'cancel2'){
               document.getElementById('issued-breadcrumb').classList.remove("br-active");
               document.getElementById('issued-breadcrumb').classList.add("br-fail");
               //document.getElementById('issued-breadcrumb').classList.remove("current");
               //document.getElementById('header_issued').innerHTML = `Fail <i class="fas fa-times"></i>`;
               document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
               document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-fail");
               document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
               document.getElementById('issued-breadcrumb-span').innerHTML = `Expired`;
            }else if(msg.result.response.state == 'fail_booked'){
               document.getElementById('issued-breadcrumb').classList.remove("br-active");
               document.getElementById('issued-breadcrumb').classList.add("br-fail");
               //document.getElementById('issued-breadcrumb').classList.remove("current");
               //document.getElementById('header_issued').innerHTML = `Fail <i class="fas fa-times"></i>`;
               document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
               document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-fail");
               document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
               document.getElementById('issued-breadcrumb-span').innerHTML = `Fail (Book)`;
            }else if(msg.result.response.state == 'booked'){
               try{
                   if(now.diff(hold_date_time, 'minutes')<0)
                       check_payment_payment_method(msg.result.response.order_number, 'Issued', msg.result.response.booker.seq_id, 'billing', 'airline', signature, msg.result.response.payment_acquirer_number);
                   get_payment = true;
//                   get_payment_acq('Issued',msg.result.response.booker.seq_id, msg.result.response.order_number, 'billing',signature,'airline');
                   document.getElementById('voucher_div').style.display = '';
                   //document.getElementById('issued-breadcrumb').classList.remove("active");
                   //document.getElementById('issued-breadcrumb').classList.add("current");
                   document.getElementById('issued-breadcrumb').classList.add("br-active");
                   document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-active");
               }catch(err){}
            }else if(msg.result.response.state == 'draft'){
               document.getElementById('issued-breadcrumb').classList.remove("br-active");
               document.getElementById('issued-breadcrumb').classList.add("br-fail");
               document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
               document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-fail");
               document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
               document.getElementById('Booking-breadcrumb').classList.remove("br-book");
               document.getElementById('Booking-breadcrumb').classList.add("br-fail");
               document.getElementById('Booking-breadcrumb-icon').classList.remove("br-icon-active");
               document.getElementById('Booking-breadcrumb-icon').classList.add("br-icon-fail");
               document.getElementById('Booking-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
            }else{
               //document.getElementById('issued-breadcrumb').classList.remove("current");
               //document.getElementById('issued-breadcrumb').classList.add("active");
               document.getElementById('issued-breadcrumb').classList.add("br-active");
               document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-active");
               document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-check"></i>`;
            }

            if(msg.result.response.state == 'issued'){
                try{
                    document.getElementById('voucher_discount').style.display = 'none';
                }catch(err){}
               //tanya ko sam kalau nyalain
//                document.getElementById('ssr_request_after_sales').hidden = false;
//                document.getElementById('ssr_request_after_sales').innerHTML = `
//                        <input class="primary-btn-ticket" style="width:100%;margin-bottom:10px;" type="button" onclick="set_new_request_ssr()" value="Request New SSR">
//                        <input class="primary-btn-ticket" style="width:100%;" type="button" onclick="set_new_request_seat()" value="Request New Seat">`;
//                document.getElementById('reissued').hidden = false;
//                document.getElementById('reissued').innerHTML = `<input class="primary-btn-ticket" style="width:100%;" type="button" onclick="reissued_btn();" value="Reissued">`;
                provider_list = [];
                for(i in msg.result.response.provider_bookings){
                    provider_list.push(msg.result.response.provider_bookings[i].provider);
                }
                if(provider_list.includes("traveloka") == true){
                    document.getElementById('cancel').hidden = false;
                    document.getElementById('cancel').innerHTML = `<input class="primary-btn-ticket" style="width:100%;" type="button" onclick="cancel_btn();" value="Cancel Booking">`;
                }
            }
            if(msg.result.response.state == 'booked'){
                try{
                    if(now.diff(hold_date_time, 'minutes')<0)
                        $(".issued_booking_btn").show();
                }catch(err){}
                check_provider_booking++;
            }
            else{
                //$(".issued_booking_btn").remove();
                $('.loader-rodextrip').fadeOut();
                $("#waitingTransaction").modal('hide');
            }

            $text += 'Order Number: '+ msg.result.response.order_number + '\n';

            //$text += 'Hold Date: ' + msg.result.response.hold_date + '\n';
            $text += msg.result.response.state_description + '\n';
            var localTime;
            text += `
            <div class="col-lg-12" style="border:1px solid #cdcdcd; padding:10px; background-color:white; margin-bottom:20px;">
                <h6>Order Number : `+msg.result.response.order_number+`</h6><br/>
                <table style="width:100%;">
                    <tr>
                        <th>PNR</th>
                        <th>Hold Date</th>
                        <th>Status</th>
                    </tr>`;
                    printed_hold_date = false;
                    for(i in msg.result.response.provider_bookings){
                        if(msg.result.response.provider_bookings[i].state == 'booked' && printed_hold_date == false){
                            if(get_payment == false){
                               check_payment_payment_method(msg.result.response.order_number, 'Issued', msg.result.response.booker.seq_id, 'billing', 'airline', signature, msg.result.response.payment_acquirer_number);
                               get_payment = true;
                            }
//                                check_payment_payment_method(msg.result.response.order_number, 'Issued', msg.result.response.booker.seq_id, 'billing', 'airline', signature);
//                            get_payment_acq('Issued',msg.result.response.booker.seq_id, msg.result.response.order_number, 'billing',signature,'airline');
                            $text += 'Please make payment before '+ msg.result.response.hold_date + `\n`;
                            try{
                                if(now.diff(hold_date_time, 'minutes')<0)
                                    $(".issued_booking_btn").show();
                            }catch(err){}
                            check_provider_booking++;
                            printed_hold_date = true;
                        }
                        //datetime utc to local
                        if(msg.result.response.provider_bookings[i].error_msg.length != 0)
                            text += `<div class="alert alert-danger">
                                `+msg.result.response.provider_bookings[i].error_msg+`
                                <a href="#" class="close" data-dismiss="alert" aria-label="close" style="margin-top:-1.9vh;">x</a>
                            </div>`;
                        if(msg.result.response.provider_bookings[i].hold_date != '' && msg.result.response.provider_bookings[i].hold_date != false){
                            tes = moment.utc(msg.result.response.provider_bookings[i].hold_date).format('YYYY-MM-DD HH:mm:ss')
                            localTime  = moment.utc(tes).toDate();
                            msg.result.response.provider_bookings[i].hold_date = moment(localTime).format('DD MMM YYYY HH:mm');
                        }
                        //
                        text+=`<tr>`;
                        if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false || msg.result.response.state == 'issued')
                            text+=`
                                <td>`+msg.result.response.provider_bookings[i].pnr+`</td>`;
                        else
                            text += `<td> - </td>`;
                        text+=`
                            <td>`+msg.result.response.hold_date+`</td>
                            <td id='pnr'>`+msg.result.response.provider_bookings[i].state_description+`</td>
                        </tr>`;
                    }
                    if(check_provider_booking == 0 && msg.result.response.state != 'issued'){
                        $text += msg.result.response.state_description+'\n';
                        check_provider_booking++;
                        $(".issued_booking_btn").remove();
                    }
                    $text +='\n';
            text+=`</table>
            </div>

            <div style="background-color:white; border:1px solid #cdcdcd;">
                <div class="row">
                    <div class="col-lg-12">
                        <div style="padding:10px; background-color:white;">
                        <h5> Flight Detail <img style="width:18px;" src="/static/tt_website_rodextrip/images/icon/plane.png"/></h5>
                        <hr/>`;
                    check = 0;
                    flight_counter = 1;
                    for(i in msg.result.response.provider_bookings){
                        $text += 'Booking Code: ' + msg.result.response.provider_bookings[i].pnr+'\n';
                        if(i != 0){
                            text+=`<hr/>`;
                        }
                        text+=`<h5>PNR: `+msg.result.response.provider_bookings[i].pnr+`</h5>`;
                        for(j in msg.result.response.provider_bookings[i].journeys){
                            text+=`<h6>Flight `+flight_counter+`</h6>`;
                            $text += 'Flight '+ flight_counter+'\n';
                            flight_counter++;
                            for(k in msg.result.response.provider_bookings[i].journeys[j].segments){
                                var cabin_class = '';
                                //yang baru harus diganti
                                if(msg.result.response.provider_bookings[i].journeys[j].segments[k].cabin_class == 'Y')
                                    cabin_class = 'Economy Class';
                                else if(msg.result.response.provider_bookings[i].journeys[j].segments[k].cabin_class == 'W')
                                    cabin_class = 'Premium Economy Class';
                                else if(msg.result.response.provider_bookings[i].journeys[j].segments[k].cabin_class == 'C')
                                    cabin_class = 'Business Class';
                                else if(msg.result.response.provider_bookings[i].journeys[j].segments[k].cabin_class == 'F')
                                    cabin_class = 'First Class';
                                for(l in msg.result.response.provider_bookings[i].journeys[j].segments[k].legs){
                                    try{
                                        $text += airline_carriers[msg.result.response.provider_bookings[i].journeys[j].segments[k].carrier_code].name + ' ' + msg.result.response.provider_bookings[i].journeys[j].segments[k].carrier_number;
                                    }catch(err){
                                        $text += msg.result.response.provider_bookings[i].journeys[j].segments[k].carrier_code + ' ' + msg.result.response.provider_bookings[i].journeys[j].segments[k].carrier_number;
                                    }
                                    if(cabin_class != '')
                                        $text += ' ' + cabin_class;
                                    else
                                        $text += ' ' + cabin_class;
                                    $text += '\n';
                                    if(msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].arrival_date.split('  ')[0] == msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].departure_date.split('  ')[0]){
                                        $text += msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].departure_date.split('  ')[0]+' ';
                                        $text += msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].departure_date.split('  ')[1]+' - ';
                                        $text += msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].arrival_date.split('  ')[1]+'\n';
                                    }else{
                                        $text += msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].departure_date.split('  ')[0]+' ';
                                        $text += msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].departure_date.split('  ')[1]+' - ';
                                        $text += msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].arrival_date.split('  ')[0]+' ';
                                        $text += msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].arrival_date.split('  ')[1]+'\n';
                                    }
                                    $text += msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].origin_name +' ('+msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].origin_city+') - '+msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].destination_name +' ('+msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].destination_city+')\n\n';

                                    text+= `
                                    <div class="row">
                                        <div class="col-lg-4">`;
                                        try{
                                            text += `<img data-toggle="tooltip" style="width:50px; height:50px;" title="`+airline_carriers[msg.result.response.provider_bookings[i].journeys[j].segments[k].carrier_code].name+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+msg.result.response.provider_bookings[i].journeys[j].segments[k].carrier_code+`.png"/>`;
                                        }catch(err){
                                            text += `<img data-toggle="tooltip" style="width:50px; height:50px;" title="`+msg.result.response.provider_bookings[i].journeys[j].segments[k].carrier_code+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+msg.result.response.provider_bookings[i].journeys[j].segments[k].carrier_code+`.png"/>`;
                                        }
                                        text+=`<h5>`+msg.result.response.provider_bookings[i].journeys[j].segments[k].carrier_name+' '+msg.result.response.provider_bookings[i].journeys[j].segments[k].carrier_number+`</h5>
                                            <span>Class : `+cabin_class+` ( Class of service `+msg.result.response.provider_bookings[i].journeys[j].segments[k].class_of_service+` )</span><br/>
                                        </div>
                                        <div class="col-lg-8" style="padding-top:10px;">
                                            <div class="row">
                                                <div class="col-lg-6 col-xs-6">
                                                    <table style="width:100%">
                                                        <tr>
                                                            <td><h5>`+msg.result.response.provider_bookings[i].journeys[j].segments[k].legs[l].departure_date.split('  ')[1]+`</h5></td>
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
                                            </div>
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
                    if(msg.result.response.booker.gender == 'female' && msg.result.response.booker.marital_status == "married")
                        title = 'MRS';
                    else if(msg.result.response.booker.gender == 'female')
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
                        <td>`+msg.result.response.contact.title+` `+msg.result.response.contact.name+`</td>
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
                        <th style="width:5%;" class="list-of-passenger-left">No</th>
                        <th style="width:30%;">Name</th>
                        <th style="width:20%;">Birth Date</th>
                        <th style="width:25%;">Ticket Number</th>
                        <th style="width:20%;">SSR</th>
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
                            <td>`;
                                  try{
                                      for(i in msg.result.response.passengers[pax].fees){
                                        text += `<label>` + msg.result.response.passengers[pax].fees[i].fee_name + ' ' + msg.result.response.passengers[pax].fees[i].fee_value + `</label><br/>`;
                                      }
                                  }catch(err){}
                                  text+=`
                                </div>
                            </td>
                        </tr>`;
                    }

                text+=`</table>
                </div>
            </div>

            <div class="row" style="margin-top:20px;">
                <div class="col-lg-4" style="padding-bottom:10px;">`;
                    if(msg.result.response.state != 'cancel' && msg.result.response.state != 'cancel2'){
                        if (msg.result.response.state == 'booked'){
                            text+=`
                            <a href="#" id="seat-map-link" class="hold-seat-booking-train ld-ext-right" style="color:`+text_color+`;" hidden>
                                <input type="button" id="button-choose-print" class="primary-btn" style="width:100%;" value="Print Ticket" onclick=""/>
                                <div class="ld ld-ring ld-cycle"></div>
                            </a>`;
                        }else if (msg.result.response.state == 'issued'){
                            text+=`
                            <a href="#" id="seat-map-link" class="hold-seat-booking-train ld-ext-right" style="color:`+text_color+`;">
                                <input type="button" id="button-choose-print" class="primary-btn" style="width:100%;" value="Print Ticket" onclick="get_printout('`+msg.result.response.order_number+`', 'ticket','airline');"/>
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
                            <a class="print-booking-train ld-ext-right" style="color:`+text_color+`;">
                                <input type="button" class="primary-btn" id="button-print-print" style="width:100%;" value="Print Form" onclick="get_printout('`+msg.result.response.order_number+`', 'itinerary','airline');" />
                                <div class="ld ld-ring ld-cycle"></div>
                            </a>`;
                        }
                        else if (msg.result.response.state == 'issued'){
                            text+=`
                            <a class="print-booking-train ld-ext-right" style="color:`+text_color+`;">
                                <input type="button" class="primary-btn" id="button-print-print" style="width:100%;" value="Print Ticket (with Price)" onclick="get_printout('`+msg.result.response.order_number+`', 'ticket_price','airline');" />
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
                            <a class="issued-booking-train ld-ext-right" id="print_invoice" style="color:`+text_color+`;" hidden>
                                <input type="button" class="primary-btn" id="button-issued-print" style="width:100%;" value="Issued" onclick=""/>
                                <div class="ld ld-ring ld-cycle"></div>
                            </a>`;
                        }
                        else if (msg.result.response.state == 'issued'){
                            text+=`
                            <a class="issued-booking-train ld-ext-right" style="color:`+text_color+`;">
                                <input type="button" class="primary-btn" id="button-issued-print" style="width:100%;" data-toggle="modal" data-target="#printInvoice" value="Print Invoice"/>
                                <div class="ld ld-ring ld-cycle"></div>
                            </a>`;
                            // modal invoice
                            text+=`
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
                                                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                        <span class="control-label" for="Name">Name</span>
                                                        <div class="input-container-search-ticket">
                                                            <input type="text" class="form-control o_website_form_input" id="bill_name" name="bill_name" placeholder="Name" required="1"/>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                                        <span class="control-label" for="Additional Information">Additional Information</span>
                                                        <div class="input-container-search-ticket">
                                                            <textarea style="width:100%;" rows="4" id="additional_information" name="additional_information" placeholder="Additional Information"></textarea>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                                        <span class="control-label" for="Address">Address</span>
                                                        <div class="input-container-search-ticket">
                                                            <textarea style="width:100%;" rows="4" id="bill_address" name="bill_address" placeholder="Address"></textarea>
                                                            <!--<input type="text" class="form-control o_website_form_input" id="bill_name" name="bill_address" placeholder="Address" required="1"/>-->
                                                        </div>
                                                    </div>
                                                </div>
                                                <br/>
                                                <div style="text-align:right;">
                                                    <span>Don't want to edit? just submit</span>
                                                    <br/>
                                                    <input type="button" class="primary-btn" id="button-issued-print" style="width:30%;" value="Submit" onclick="get_printout('`+msg.result.response.order_number+`', 'invoice','airline');"/>
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
            total_price_provider = [];
            price_provider = 0;
            commission = 0;
            service_charge = ['FARE', 'RAC', 'ROC', 'TAX', 'SSR', 'DISC'];
            text_detail=`
            <div style="background-color:white; padding:10px; border: 1px solid #cdcdcd; margin-bottom:15px;">
                <h5> Price Detail</h5>
            <hr/>`;

            //repricing
            type_amount_repricing = ['Repricing'];
            //repricing
            counter_service_charge = 0;
            $text += '\nPrice:\n';
            for(i in msg.result.response.provider_bookings){
                try{
                    if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false || msg.result.response.state == 'issued')
                        text_detail+=`
                            <div style="text-align:left">
                                <span style="font-weight:500; font-size:14px;">PNR: `+msg.result.response.provider_bookings[i].pnr+` </span>
                            </div>`;

                    for(j in msg.result.response.passengers){
                        price = {'FARE': 0, 'RAC': 0, 'ROC': 0, 'TAX':0 , 'currency': '', 'CSC': 0, 'SSR': 0, 'DISC': 0,'SEAT':0};
                        for(k in msg.result.response.passengers[j].sale_service_charges[msg.result.response.provider_bookings[i].pnr]){
                            price[k] += msg.result.response.passengers[j].sale_service_charges[msg.result.response.provider_bookings[i].pnr][k].amount;
                            if(price['currency'] == '')
                                price['currency'] = msg.result.response.passengers[j].sale_service_charges[msg.result.response.provider_bookings[i].pnr][k].currency;
                        }
                        try{
                            price['CSC'] = msg.result.response.passengers[j].channel_service_charges.amount;

                        }catch(err){}
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
                        text_repricing += `<div id='repricing_button' class="col-lg-12" style="text-align:center;"></div>`;
                        document.getElementById('repricing_div').innerHTML = text_repricing;
                        //repricing

                        text_detail+=`
                        <div class="row" style="margin-bottom:5px;">
                            <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                <span style="font-size:12px;">`+msg.result.response.passengers[j].name+`</span>`;
                            text_detail+=`</div>
                            <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                <span style="font-size:13px;">`+price.currency+` `+getrupiah(parseInt(price.FARE + price.TAX + price.ROC + price.CSC + price.SSR + price.SEAT + price.DISC))+`</span>
                            </div>
                        </div>`;
                        $text += msg.result.response.passengers[j].title +' '+ msg.result.response.passengers[j].name + ' ['+msg.result.response.provider_bookings[i].pnr+'] ';
                        for(k in msg.result.response.passengers[j].fees){
                            $text += msg.result.response.passengers[j].fees[k].fee_name;
                            if(parseInt(parseInt(k)+1) != msg.result.response.passengers[j].fees.length)
                                $text += ', ';
                            else
                                $text += ' ';
                        }
                        $text += price.currency+` `+getrupiah(parseInt(price.FARE + price.SSR + price.SEAT + price.TAX + price.ROC + price.CSC + price.DISC))+'\n';
                        if(counter_service_charge == 0){
                            total_price += parseInt(price.TAX + price.ROC + price.FARE + price.SEAT + price.CSC + price.SSR + price.DISC);
                            price_provider += parseInt(price.TAX + price.ROC + price.FARE + price.SEAT + price.CSC + price.SSR + price.DISC);
                        }else{
                            total_price += parseInt(price.TAX + price.ROC + price.FARE + price.SSR + price.SEAT + price.DISC);
                            price_provider += parseInt(price.TAX + price.ROC + price.FARE + price.SSR + price.SEAT + price.DISC);
                        }
                        commission += parseInt(price.RAC);
                    }
                    total_price_provider.push({
                        'pnr': msg.result.response.provider_bookings[i].pnr,
                        'price': price_provider
                    })
                    price_provider = 0;
                    counter_service_charge++;
                }catch(err){}
            }
            try{
                airline_get_detail.result.response.total_price = total_price;
                $text += 'Grand Total: '+price.currency+' '+ getrupiah(total_price);
                if(check_provider_booking != 0 && msg.result.response.state == 'booked'){
                    $text += '\n\nPrices and availability may change at any time';
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
                        }catch(err){

                        }
                        text_detail+= `</span>
                    </div>
                </div>`;
                if(msg.result.response.state == 'booked')
                    text_detail+=`<div style="text-align:right; padding-bottom:10px;"><img src="/static/tt_website_rodextrip/img/bank.png" style="width:25px; height:25px; cursor:pointer;" onclick="show_repricing();"/></div>`;
                text_detail+=`<div class="row">
                <div class="col-lg-12" style="padding-bottom:10px;">
                    <hr/>
                    <span style="font-size:14px; font-weight:bold;">Share This on:</span><br/>`;
                    share_data();
                    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                    if (isMobile) {
                        text_detail+=`
                            <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png"/></a>
                            <a href="line://msg/text/`+ $text_share +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png"/></a>
                            <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png"/></a>
                            <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png"/></a>`;
                    } else {
                        text_detail+=`
                            <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png"/></a>
                            <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png"/></a>
                            <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png"/></a>
                            <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png"/></a>`;
                    }

                text_detail+=`
                    </div>
                </div>`;
                if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false)
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
                </div>`;
                if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false)
                text_detail+=`
                <div style="margin-bottom:5px;">
                    <input class="primary-btn-ticket" id="show_commission_button" style="width:100%;" type="button" onclick="show_commission('commission');" value="Show Commission"/>
                </div>
            </div>`;
            }catch(err){}
            document.getElementById('airline_detail').innerHTML = text_detail;
            $("#show_loading_booking_airline").hide();

            //
            text = `
            <div class="modal fade" id="myModal" role="dialog">
                <div class="modal-dialog">

                    <!-- Modal content-->
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title" style="color:`+text_color+`;">Price Change <i class="fas fa-money"></i></h4>
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
            </div>
            <div class="modal fade" id="myModal_reissue" role="dialog">
                <div class="modal-dialog">

                    <!-- Modal content-->
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title" style="color:`+text_color+`;">Ticket <i class="fas fa-money"></i></h4>
                            <button type="button" class="close" onclick="dismiss_reissue();">&times;</button>
                        </div>
                        <div class="modal-body">
                            <div id="search_result" style="overflow:auto;height:300px;margin-top:20px;">
                                <div id="airline_ticket_pick">

                                </div>
                                <div class="col-sm-12" id="render_ticket_reissue">

                                </div>

                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal fade" id="myModal_price_itinerary" role="dialog">
                <div class="modal-dialog">

                    <!-- Modal content-->
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title" style="color:`+text_color+`;">Price Change <i class="fas fa-money"></i></h4>
                            <button type="button" class="close" onclick="dismiss_reissue_get_price();">&times;</button>
                        </div>
                        <div class="modal-body">
                            <div id="search_result" style="overflow:auto;height:300px;margin-top:20px;">
                                <div id="airline_detail">

                                </div>

                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
            `;
            //
            document.getElementById('airline_booking').innerHTML += text;
            document.getElementById('show_title_airline').hidden = false;
            document.getElementById('show_loading_booking_airline').hidden = true;
            add_repricing();
            if (msg.result.response.state != 'booked'){
//                document.getElementById('issued-breadcrumb').classList.add("active");
            }

           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
               auto_logout();
           }else{
                text += `<div class="alert alert-danger">
                        <h5>
                            `+msg.result.error_code+`
                        </h5>
                        `+msg.result.error_msg+`
                    </div>`;
                document.getElementById('airline_booking').innerHTML = text;
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error airline booking </span>' + msg.result.error_msg,
                })
                $('#show_loading_booking_airline').hide();
                $('.loader-rodextrip').fadeOut();
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
          if(XMLHttpRequest.status == 500){
              $("#show_loading_booking_airline").hide();
              $("#show_error_booking_airline").show();
              Swal.fire({
                type: 'error',
                title: 'Oops!',
                html: '<span style="color: red;">Error airline booking </span>' + errorThrown,
              }).then((result) => {
                  if (result.value) {
                    $("#waitingTransaction").modal('hide');
                  }
                })
              $('.loader-rodextrip').fadeOut();
              $("#waitingTransaction").modal('hide');
          }
       },timeout: 300000
    });
}

function cancel_btn(){
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
           url: "/webservice/airline",
           headers:{
                'action': 'cancel',
           },
           data: {
               'order_number': airline_get_detail.result.response.order_number,
               'signature': signature
           },
           success: function(msg) {
               console.log(msg);
               if(msg.result.error_code == 0){
                   //update ticket
                   price_arr_repricing = {};
                   pax_type_repricing = [];
                   $("#waitingTransaction").modal('hide');
                   document.getElementById('show_loading_booking_airline').hidden = false;
                   document.getElementById('airline_booking').innerHTML = '';
                   document.getElementById('airline_detail').innerHTML = '';
                   document.getElementById('payment_acq').innerHTML = '';
                   document.getElementById('show_loading_booking_airline').style.display = 'block';
                   document.getElementById('show_loading_booking_airline').hidden = false;
                   document.getElementById('payment_acq').hidden = true;
                   document.getElementById("overlay-div-box").style.display = "none";
                   $(".issued_booking_btn").remove();
                   airline_get_booking(data);
               }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                    auto_logout();
               }else{
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: #ff9900;">Error airline issued </span>' + msg.result.error_msg,
                    })
                    price_arr_repricing = {};
                    pax_type_repricing = [];
                    document.getElementById('show_loading_booking_airline').hidden = false;
                    document.getElementById('airline_booking').innerHTML = '';
                    document.getElementById('airline_detail').innerHTML = '';
                    document.getElementById('payment_acq').innerHTML = '';
                    document.getElementById('show_loading_booking_airline').style.display = 'block';
                    document.getElementById('show_loading_booking_airline').hidden = false;
                    document.getElementById('payment_acq').hidden = true;

                    $("#waitingTransaction").modal('hide');
                    document.getElementById("overlay-div-box").style.display = "none";

                    $('.hold-seat-booking-train').prop('disabled', false);
                    $('.hold-seat-booking-train').removeClass("running");
                    airline_get_booking(airline_get_detail.result.response.order_number);
               }
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                if(XMLHttpRequest.status == 500){
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: red;">Error airline issued </span>' + errorThrown,
                    })
                    price_arr_repricing = {};
                    pax_type_repricing = [];
                    document.getElementById('show_loading_booking_airline').hidden = false;
                    document.getElementById('airline_booking').innerHTML = '';
                    document.getElementById('airline_detail').innerHTML = '';
                    document.getElementById('payment_acq').innerHTML = '';
                    document.getElementById('show_loading_booking_airline').style.display = 'block';
                    document.getElementById('show_loading_booking_airline').hidden = false;
                    document.getElementById('payment_acq').hidden = true;
                    $("#waitingTransaction").modal('hide');
                    document.getElementById("overlay-div-box").style.display = "none";
                    $('.hold-seat-booking-train').prop('disabled', false);
                    $('.hold-seat-booking-train').removeClass("running");
                    airline_get_booking(airline_get_detail.result.response.order_number);
                }
           },timeout: 300000
        });
      }
    })
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
        please_wait_transaction();
        getToken();
        $.ajax({
           type: "POST",
           url: "/webservice/airline",
           headers:{
                'action': 'issued',
           },
           data: {
               'order_number': data,
               'seq_id': payment_acq2[payment_method][selected].seq_id,
               'member': payment_acq2[payment_method][selected].method,
               'voucher_code': voucher_code,
               'signature': signature
           },
           success: function(msg) {
               console.log(msg);
               if(msg.result.error_code == 0){
                   //update ticket
                   price_arr_repricing = {};
                   pax_type_repricing = [];
                   $("#waitingTransaction").modal('hide');
                   document.getElementById('show_loading_booking_airline').hidden = false;
                   document.getElementById('airline_booking').innerHTML = '';
                   document.getElementById('airline_detail').innerHTML = '';
                   document.getElementById('payment_acq').innerHTML = '';
                   document.getElementById('show_loading_booking_airline').style.display = 'block';
                   document.getElementById('show_loading_booking_airline').hidden = false;
                   document.getElementById('payment_acq').hidden = true;
                   document.getElementById("overlay-div-box").style.display = "none";
                   $(".issued_booking_btn").remove();
                   airline_get_booking(data);
               }else if(msg.result.error_code == 1009){
                   price_arr_repricing = {};
                   pax_type_repricing = [];
                   $("#waitingTransaction").modal('hide');
                   document.getElementById('show_loading_booking_airline').hidden = false;
                   document.getElementById('airline_booking').innerHTML = '';
                   document.getElementById('airline_detail').innerHTML = '';
                   document.getElementById('payment_acq').innerHTML = '';
                   document.getElementById('show_loading_booking_airline').style.display = 'block';
                   document.getElementById('show_loading_booking_airline').hidden = false;
                   document.getElementById('payment_acq').hidden = true;
                   document.getElementById("overlay-div-box").style.display = "none";
                   $(".issued_booking_btn").hide();
                   Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: #ff9900;">Error airline issued </span>' + msg.result.error_msg,
                    }).then((result) => {
                      if (result.value) {
                        $("#waitingTransaction").modal('hide');
                      }
                    })
                    $("#waitingTransaction").modal('hide');
                    document.getElementById("overlay-div-box").style.display = "none";

                    $('.hold-seat-booking-train').prop('disabled', false);
                    $('.hold-seat-booking-train').removeClass("running");
                    airline_get_booking(data);
               }else if(msg.result.error_code == 4006){
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: #ff9900;">Error airline issued </span>' + msg.result.error_msg,
                    }).then((result) => {
                      if (result.value) {
                        $("#waitingTransaction").modal('hide');
                      }
                    })
                    $("#waitingTransaction").modal('hide');
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
                            price_provider_show += parseInt(price.TAX + price.ROC + price.FARE);
                            commission += parseInt(price.RAC);
                        }
                        total_price_provider_show.push(price_provider_show);
                        price_provider_show = 0;
                    }
                    total_price_show = total_price;
                    if(voucher_discount_response.result.error_code == 0){
                        discount_voucher_new = {
                            'discount': 0,
                            'currency': ''
                        };
                        for(i in total_price_provider_show){
                            if(total_price_provider_show[i] > voucher_discount_response.result.response.voucher_minimum_purchase || voucher_discount_response.result.response.voucher_minimum_purchase == false){
                                if(voucher_discount_response.result.response.provider[i].able_to_use == true){
                                    if(voucher_discount_response.result.response.voucher_type == 'percent'){
                                        discount_voucher_new['discount'] += total_price_provider_show[i] * voucher_discount_response.result.response.voucher_value / 100;

                                    }else if(voucher_discount_response.result.response.voucher_type == 'amount'){
                                        discount_voucher_new['discount'] += voucher_discount_response.result.response.voucher_value;
                                    }
                                }
                            }
                        }
                        discount_voucher_new['currency'] = voucher_discount_response.result.response.voucher_currency;
                        if(discount_voucher_new['discount'] > voucher_discount_response.result.response.voucher_cap && voucher_discount_response.result.response.voucher_cap != false)
                            discount_voucher_new['discount'] = voucher_discount_response.result.response.voucher_cap;
                        text+=`<div class="row" style="margin-bottom:5px;">
                                <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                    <span style="font-size:12px;">Discount
                                </div>
                                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                    <span style="font-size:13px;">`+discount_voucher_new['currency']+` `+getrupiah(parseInt(discount_voucher_new['discount']))+`</span>
                                </div>
                            </div>`;
                        total_price_show -= discount_voucher_new['discount'];
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
                            <span style="font-size:13px; font-weight: bold;">`+price.currency+` `+getrupiah(total_price_show)+`</span>
                        </div>
                    </div>`;
                    if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false)
                    text+=`
                    <div class="row" id="show_commission_old" style="display:none;">
                        <div class="col-lg-12 col-xs-12" style="text-align:center;">
                            <div class="alert alert-success">
                                <span style="font-size:13px;">Your Commission: IDR `+getrupiah(parseInt(commission*-1))+`</span><br>
                            </div>
                        </div>
                    </div>`;
                    if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false)
                        text+=`<center><div style="margin-bottom:5px;"><input class="primary-btn-ticket" id="show_commission_button_old" style="width:100%;" type="button" onclick="show_commission('old');" value="Show Commission"/></div>`;
                    text+=`</div>`;
                    document.getElementById('old_price').innerHTML = text;

                    airline_get_detail = msg;
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
                            price_provider_show += parseInt(price.TAX + price.ROC + price.FARE);
                            commission += parseInt(price.RAC);
                        }
                        total_price_provider_show.push(price_provider_show)
                        total_price_show = 0;
                    }
                    total_price_show = total_price;
                    if(voucher_discount_response.result.error_code == 0){
                        discount_voucher_new = {
                            'discount': 0,
                            'currency': ''
                        };
                        for(i in total_price_provider_show){
                            if(total_price_provider_show[i] > voucher_discount_response.result.response.voucher_minimum_purchase || voucher_discount_response.result.response.voucher_minimum_purchase == false){
                                if(voucher_discount_response.result.response.provider[i].able_to_use == true){
                                    if(voucher_discount_response.result.response.voucher_type == 'percent'){
                                        discount_voucher_new['discount'] += total_price_provider_show[i] * voucher_discount_response.result.response.voucher_value / 100;

                                    }else if(voucher_discount_response.result.response.voucher_type == 'amount'){
                                        discount_voucher_new['discount'] += voucher_discount_response.result.response.voucher_value;
                                    }
                                }
                            }
                        }
                        discount_voucher_new['currency'] = voucher_discount_response.result.response.voucher_currency;
                        if(discount_voucher_new['discount'] > voucher_discount_response.result.response.voucher_cap && voucher_discount_response.result.response.voucher_cap != false)
                            discount_voucher_new['discount'] = voucher_discount_response.result.response.voucher_cap;
                        text+=`<div class="row" style="margin-bottom:5px;">
                                <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                    <span style="font-size:12px;">Discount
                                </div>
                                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                    <span style="font-size:13px;">`+discount_voucher_new['currency']+` `+getrupiah(parseInt(discount_voucher_new['discount']))+`</span>
                                </div>
                            </div>`;
                        total_price_show -= discount_voucher_new['discount'];
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
                            <span style="font-size:13px; font-weight: bold;">`+price.currency+` `+getrupiah(total_price_show)+`</span>
                        </div>
                    </div>`;
                    if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false)
                    text+=`
                    <div class="row" id="show_commission_new" style="display:none;">
                        <div class="col-lg-12 col-xs-12" style="text-align:center;">
                            <div class="alert alert-success">
                                <span style="font-size:13px;">Your Commission: IDR `+getrupiah(parseInt(commission*-1))+`</span><br>
                            </div>
                        </div>
                    </div>`;
                    if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false)
                        text+=`<center><div style="margin-bottom:5px;"><input class="primary-btn-ticket" id="show_commission_button_new" style="width:100%;" type="button" onclick="show_commission('new');" value="Show Commission"/></div>`;
                    text+=`</div>`;
                    document.getElementById('new_price').innerHTML = text;

                   $("#myModal").modal();
               }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                    auto_logout();
               }else{
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: #ff9900;">Error airline issued </span>' + msg.result.error_msg,
                    })
                    price_arr_repricing = {};
                    pax_type_repricing = [];
                    document.getElementById('show_loading_booking_airline').hidden = false;
                    document.getElementById('airline_booking').innerHTML = '';
                    document.getElementById('airline_detail').innerHTML = '';
                    document.getElementById('payment_acq').innerHTML = '';
                    document.getElementById('show_loading_booking_airline').style.display = 'block';
                    document.getElementById('show_loading_booking_airline').hidden = false;
                    document.getElementById('payment_acq').hidden = true;

                    $("#waitingTransaction").modal('hide');
                    document.getElementById("overlay-div-box").style.display = "none";

                    $('.hold-seat-booking-train').prop('disabled', false);
                    $('.hold-seat-booking-train').removeClass("running");
                    airline_get_booking(data);
               }
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                if(XMLHttpRequest.status == 500){
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: red;">Error airline issued </span>' + errorThrown,
                    })
                    price_arr_repricing = {};
                    pax_type_repricing = [];
                    document.getElementById('show_loading_booking_airline').hidden = false;
                    document.getElementById('airline_booking').innerHTML = '';
                    document.getElementById('airline_detail').innerHTML = '';
                    document.getElementById('payment_acq').innerHTML = '';
                    document.getElementById('show_loading_booking_airline').style.display = 'block';
                    document.getElementById('show_loading_booking_airline').hidden = false;
                    document.getElementById('payment_acq').hidden = true;
                    $("#waitingTransaction").modal('hide');
                    document.getElementById("overlay-div-box").style.display = "none";
                    $('.hold-seat-booking-train').prop('disabled', false);
                    $('.hold-seat-booking-train').removeClass("running");
                    airline_get_booking(data);
                }
           },timeout: 300000
        });
      }
    })
}

function update_service_charge(type){
    repricing_order_number = '';
    if(type == 'booking'){
        document.getElementById('airline_booking').innerHTML = '';
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
        repricing_order_number = order_number;
    }else{
        upsell_price = 0;
        upsell = []
        counter_pax = -1;
        currency = airline_price[0].ADT.currency;
        for(i in passengers){
            list_price = []
            if(i != 'booker' && i != 'contact'){
                for(j in list){
                    for(k in passengers[i]){
                        if(passengers[i][k].first_name+passengers[i][k].last_name == document.getElementById('selection_pax'+j).value){
                            list_price.push({
                                'amount': list[j],
                                'currency_code': currency
                            });
                            upsell_price += list[j];
                        }
                    }
                }
                counter_pax++;
            }
            if(list_price.length != 0)
                upsell.push({
                    'sequence': counter_pax,
                    'pricing': JSON.parse(JSON.stringify(list_price))
                });
        }
    }
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'update_service_charge',
       },
       data: {
           'order_number': JSON.stringify(repricing_order_number),
           'passengers': JSON.stringify(upsell),
           'signature': signature
       },
       success: function(msg) {
           console.log(msg);
           if(msg.result.error_code == 0){
                try{
                    if(type == 'booking'){
                        airline_get_booking(repricing_order_number);
                        price_arr_repricing = {};
                        pax_type_repricing = [];
                    }else{
                        price_arr_repricing = {};
                        pax_type_repricing = [];
                        airline_detail('');
                    }
                }catch(err){}
                $('#myModalRepricing').modal('hide');
           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
           }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error airline service charge </span>' + msg.result.error_msg,
                })
                $('.loader-rodextrip').fadeOut();
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status == 500){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error airline service charge </span>' + errorThrown,
                })
                $('.loader-rodextrip').fadeOut();
            }
       },timeout: 60000
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

function sell_after_sales(){
    if(after_sales_type == 'ssr'){
        sell_ssrs_after_sales();
    }else if(after_sales_type == 'seat'){
        assign_seats_after_sales();
    }
}

function sell_ssrs_after_sales(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'sell_ssrs',
       },
       data: {
            'signature': airline_signature
       },
       success: function(msg) {
           console.log(msg);
           if(msg.result.error_code == 0){
                airline_commit_booking(0);
           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
           }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error airline ssr after sales </span>' + msg.result.error_msg,
                })
                $('.loader-rodextrip').fadeOut();
                $('.btn-next').removeClass('running');
                $('.btn-next').prop('disabled', false);
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status == 500){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error airline ssr after sales </span>' + errorThrown,
                })
                $('.loader-rodextrip').fadeOut();

               $('.btn-next').removeClass('running');
               $('.btn-next').prop('disabled', false);
            }
       },timeout: 60000
    });
}

function assign_seats_after_sales(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'assign_seats',
       },
       data: {
            'signature': airline_signature
       },
       success: function(msg) {
           console.log(msg);
           if(msg.result.error_code == 0){
                airline_commit_booking(0);
           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
           }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error airline seat after sales </span>' + msg.result.error_msg,
                })
                $('.loader-rodextrip').fadeOut();
                $('.btn-next').removeClass('running');
                $('.btn-next').prop('disabled', false);
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status == 500){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error airline seat after sales </span>' + errorThrown,
                })
                $('.loader-rodextrip').fadeOut();

               $('.btn-next').removeClass('running');
               $('.btn-next').prop('disabled', false);
            }
       },timeout: 300000
    });
}

function reissued_btn(){
    text = '';
    flight = 1;
    cabin_class = 1;
    for(i in airline_get_detail.result.response.provider_bookings){
        for(j in airline_get_detail.result.response.provider_bookings[i].journeys){
            for(k in airline_get_detail.result.response.provider_bookings[i].journeys[j].segments){
                text+=`<h5>`+airline_get_detail.result.response.provider_bookings[i].journeys[j].segments[k].carrier_name+' '+airline_get_detail.result.response.provider_bookings[i].journeys[j].segments[k].carrier_number+`</h5>
                        <div class="row">
                            <div class="col-lg-12">`;
                            try{
                            text+=`
                                <img data-toggle="tooltip" style="width:50px; height:50px;" title="`+airline_carriers[airline_get_detail.result.response.provider_bookings[i].journeys[j].segments[k].carrier_code].name+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+airline_get_detail.result.response.provider_bookings[i].journeys[j].segments[k].carrier_code+`.png"/>`;
                            }catch(err){
                            text+=`
                                <img data-toggle="tooltip" style="width:50px; height:50px;" title="`+airline_get_detail.result.response.provider_bookings[i].journeys[j].segments[k].carrier_code+`" class="airline-logo" src="`+static_path_url_server+`/public/airline_logo/`+airline_get_detail.result.response.provider_bookings[i].journeys[j].segments[k].carrier_code+`.png"/>`;
                            }
                            text +=`
                            </div>
                        </div>`;
            }
            text+=`<div class="row">
                <div class="col-lg-6 col-xs-6">
                    <table style="width:100%">
                        <tr>
                            <td><h5>`+airline_get_detail.result.response.provider_bookings[i].journeys[j].departure_date.split('  ')[1]+`</h5></td>
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
                    <span>`+airline_get_detail.result.response.provider_bookings[i].journeys[j].departure_date.split('  ')[0]+`</span><br/>
                    <span style="font-weight:500;">`+airline_get_detail.result.response.provider_bookings[i].journeys[j].origin_name+` - `+airline_get_detail.result.response.provider_bookings[i].journeys[j].origin_city+` (`+airline_get_detail.result.response.provider_bookings[i].journeys[j].origin+`)</span>
                </div>

                <div class="col-lg-6 col-xs-6" style="padding:0;">
                    <table style="width:100%; margin-bottom:6px;">
                        <tr>
                            <td><h5>`+airline_get_detail.result.response.provider_bookings[i].journeys[j].arrival_date.split('  ')[1]+`</h5></td>
                            <td></td>
                            <td style="height:30px;padding:0 15px;width:100%"></td>
                        </tr>
                    </table>
                    <span>`+airline_get_detail.result.response.provider_bookings[i].journeys[j].arrival_date.split('  ')[0]+`</span><br/>
                    <span style="font-weight:500;">`+airline_get_detail.result.response.provider_bookings[i].journeys[j].destination_name+` - `+airline_get_detail.result.response.provider_bookings[i].journeys[j].destination_city+` (`+airline_get_detail.result.response.provider_bookings[i].journeys[j].destination+`)</span>
                </div>
            <div class="col-lg-12 banner-right">
                <div class="form-wrap" style="padding:10px 0px 0px 0px;">
                    <input type="text" style="background:white;margin-top:5px;" class="form-control" name="airline_departure" id="airline_departure`+flight+`" placeholder="Departure Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Departure Date '" autocomplete="off" readonly>
                </div>
            </div>`;
            flight++;
        }
        text+=`
            <div class="col-lg-12">
                <div class="form-select">
                    <select id="cabin_class_flight`+cabin_class+`" name="cabin_class_flight`+cabin_class+`" class="nice-select-default reissued-class-airline">
                        <option value="Y" selected="">Economy</option>
                        <option value="W">Premium Economy</option>
                        <option value="C">Business</option>
                        <option value="F">First Class</option>
                    </select>
                </div>
            </div>`;
        cabin_class++;
    }
    text+=`
        <div class="col-lg-12" style="margin-top:10px;">
            <input class="primary-btn-ticket" style="width:100%;" type="button" onclick="airline_reissued();" value="Request Reissued">
        </div>
    </div>`;
    document.getElementById('reissued').innerHTML = text;
    $('.reissued-class-airline').niceSelect();
    airline_date = airline_get_detail.result.response.provider_bookings[0].departure_date.split(' ')[0];
    $('input[name="airline_departure"]').daterangepicker({
          singleDatePicker: true,
          autoUpdateInput: true,
          startDate: airline_date,
          minDate: moment(),
          maxDate: moment().subtract(-1, 'years'),
          showDropdowns: true,
          opens: 'center',
          locale: {
              format: 'DD MMM YYYY',
          }
    });
}

function airline_reissued(){
    flight = 1;
    cabin_class = 1;
    provider_list = [];
    journey_list = [];
    cabin_class_flight = 1;

    for(i in airline_get_detail.result.response.provider_bookings){
        for(j in airline_get_detail.result.response.provider_bookings[i].journeys){
            journey_list.push({
                "origin": airline_get_detail.result.response.provider_bookings[i].journeys[j].origin,
                "destination": airline_get_detail.result.response.provider_bookings[i].journeys[j].destination,
                "departure_date": document.getElementById('airline_departure'+ flight).value
            });
            flight++;
        }
        provider_list.push({
            "pnr": airline_get_detail.result.response.provider_bookings[i].pnr,
            "provider": airline_get_detail.result.response.provider_bookings[i].provider,
            "journey_list":  journey_list,
            "cabin_class": document.getElementById('cabin_class_flight'+ cabin_class).value
        });
        cabin_class++;
        journey_list = [];
    }
    document.getElementById('airline_booking').innerHTML = '';
    document.getElementById('show_loading_booking_airline').style.display = 'block';
    document.getElementById('show_loading_booking_airline').hidden = false;
    document.getElementById('airline_detail').innerHTML = '';
    document.getElementById('ssr_request_after_sales').hidden = true;

    document.getElementById('reissued').innerHTML = `<input class="primary-btn-ticket" style="width:100%;" type="button" onclick="airline_get_booking('`+airline_get_detail.result.response.order_number+`')" value="Cancel Reissued">`;
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/airline",
       headers:{
            'action': 'reissue',
       },
//       url: "{% url 'tt_backend_rodextrip:social_media_tree_update' %}",
       data: {
            'data':JSON.stringify(provider_list),
            'signature': signature
       },
       success: function(msg) {
           console.log(msg);
           if(msg.result.error_code == 0){
                flight_select = 0;
                datareissue2(msg.result.response);
           }else{
                Swal.fire({
                   type: 'error',
                   title: 'Oops!',
                   html: '<span style="color: red;">Error reissued </span>' + errorThrown,
                }).then((result) => {
                  if (result.value) {
                    $("#waitingTransaction").modal('hide');
                  }
                })
                airline_get_booking(airline_get_detail.result.response.order_number);
                $('.loader-rodextrip').fadeOut();
                $("#waitingTransaction").modal('hide');
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
          if(XMLHttpRequest.status == 500){
              $("#show_loading_booking_airline").hide();
              $("#show_error_booking_airline").show();
              Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error reissued </span>' + errorThrown,
               }).then((result) => {
                  if (result.value) {
                    $("#waitingTransaction").modal('hide');
                  }
                })
               $('.loader-rodextrip').fadeOut();
               $("#waitingTransaction").modal('hide');
          }
       },timeout: 60000
    });
}

function datareissue2(airline){
   var counter = 0;

   for(i in airline.reissue_provider){
        for(j in airline.reissue_provider[i].journeys){
           airline.reissue_provider[i].journeys[j].sequence = counter;
           price = 0;
           currency = '';
           airline.reissue_provider[i].journeys[j].operated_by = true;
           can_book = false;
           for(k in airline.reissue_provider[i].journeys[j].segments){
               for(l in airline.reissue_provider[i].journeys[j].segments[k].fares){
                   airline.reissue_provider[i].journeys[j].segments[k].fare_pick = parseInt(k);
                   for(m in airline.reissue_provider[i].journeys[j].segments[k].fares[l].service_charge_summary){
                       if(airline.reissue_provider[i].journeys[j].segments[k].fares[l].service_charge_summary[m].pax_type == 'ADT'){
                           for(n in airline.reissue_provider[i].journeys[j].segments[k].fares[l].service_charge_summary[m].service_charges){
                               if(airline.reissue_provider[i].journeys[j].segments[k].fares[l].service_charge_summary[m].service_charges[n].charge_code != 'rac' && airline.reissue_provider[i].journeys[j].segments[k].fares[l].service_charge_summary[m].service_charges[n].charge_code != 'rac1' && airline.reissue_provider[i].journeys[j].segments[k].fares[l].service_charge_summary[m].service_charges[n].charge_code && 'rac2'){
                                   price += airline.reissue_provider[i].journeys[j].segments[k].fares[l].service_charge_summary[m].service_charges[n].amount;
                                   currency = airline.reissue_provider[i].journeys[j].segments[k].fares[l].service_charge_summary[m].service_charges[n].currency;
                                   can_book = true;
                               }
                           }
                       }
                   }
               }

               if(airline.reissue_provider[i].journeys[j].segments[k].carrier_code == airline.reissue_provider[i].journeys[j].segments[k].operating_airline_code && airline.reissue_provider[i].journeys[j].operated_by != false){
                   airline.reissue_provider[i].journeys[j].operated_by_carrier_code = airline.reissue_provider[i].journeys[j].segments[k].operating_airline_code;
               }else if(airline.reissue_provider[i].journeys[j].segments[k].carrier_code != airline.reissue_provider[i].journeys[j].segments[k].operating_airline_code){
                   airline.reissue_provider[i].journeys[j].operated_by_carrier_code = airline.reissue_provider[i].journeys[j].segments[k].operating_airline_code;
                   airline.reissue_provider[i].journeys[j].operated_by = false;
               }
           }
           airline.reissue_provider[i].journeys[j].total_price = price;
           airline.reissue_provider[i].journeys[j].can_book = can_book;
           airline.reissue_provider[i].journeys[j].currency = currency;
           counter++;
        }
   }
   reissue_ticket = airline.reissue_provider;
   render_ticket_reissue();
//   $("#myModal_reissue").modal();
}

function render_ticket_reissue(){
    document.getElementById('show_loading_booking_airline').style.display = 'none';
    document.getElementById('show_loading_booking_airline').hidden = true;
    ticket_count = 0;
    var text= '';
    for(i in reissue_ticket[flight_select].journeys){
       ticket_count++;
       var price = 0;
       text += `
            <div class="search-box-result" id="journey`+i+`">
                <div class="row" style="padding:10px;">
                    <div class="col-lg-12">`;
                    if(reissue_ticket[flight_select].journeys[i].operated_by == false)
                        try{
                            text += `<span style="float:left; font-weight: bold;">Operated By `+airline_carriers[reissue_ticket[flight_select].journeys[i].operated_by_carrier_code].name+`</span>`;
                        }catch(err){
                            text += `<span style="float:left; font-weight: bold;">Operated By `+reissue_ticket[flight_select].journeys[i].operated_by_carrier_code+`</span>`;
                        }
                    if(reissue_ticket[flight_select].journeys[i].is_combo_price == true){
                        text+=`<span style="float:right; font-weight: bold; padding:5px; border-bottom:2px solid `+color+`;">Combo Price</span>`;
                    }
                    text += `
                    </div>
                    <div class="col-lg-2">
                        <div class="row">`;
                        for(j in reissue_ticket[flight_select].journeys[i].carrier_code_list){
                            try{
                            text+=`
                            <div class="col-lg-12 col-md-4 col-sm-4 col-xs-4">
                                <span style="font-weight:500; font-size:12px;">`+airline_carriers[reissue_ticket[flight_select].journeys[i].carrier_code_list[j]].name+`</span><br/>
                                <img data-toggle="tooltip" style="width:50px; height:50px;" title="`+airline_carriers[reissue_ticket[flight_select].journeys[i].carrier_code_list[j]].name+`" src="`+static_path_url_server+`/public/airline_logo/`+reissue_ticket[flight_select].journeys[i].carrier_code_list[j]+`.png">
                            </div>`;
                            }catch(err){
                                text+=`
                                <img data-toggle="tooltip" style="width:50px; height:50px;" src="`+static_path_url_server+`/public/airline_logo/`+reissue_ticket[flight_select].journeys[i].carrier_code_list[j]+`.png">`;
                            }
                        }

                        text+=`
                        </div>
                    </div>
                    <div class="col-lg-10">
                        <div class="row">`;
                            if(reissue_ticket[flight_select].journeys[i].length == 1){
                                text+=`
                                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">
                                    <table style="width:100%">
                                        <tr>
                                            <td class="airport-code"><h5>`+reissue_ticket[flight_select].journeys[i].departure_date.split(' - ')[1]+`</h5></td>
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
                                    <span>`+reissue_ticket[flight_select].journeys[i].departure_date.split(' - ')[0]+` </span><br/>
                                    <span style="font-weight:500;">`+reissue_ticket[flight_select].journeys[i].origin_city+` (`+reissue_ticket[flight_select].journeys[i].origin+`)</span><br/>
                                </div>
                                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">
                                    <table style="width:100%; margin-bottom:6px;">
                                        <tr>
                                            <td><h5>`+reissue_ticket[flight_select].journeys[i].arrival_date.split(' - ')[1]+`</h5></td>
                                            <td></td>
                                            <td style="height:30px;padding:0 15px;width:100%"></td>
                                        </tr>
                                    </table>
                                    <span>`+reissue_ticket[flight_select].journeys[i].arrival_date.split(' - ')[0]+`</span><br/>
                                    <span style="font-weight:500;">`+reissue_ticket[flight_select].journeys[i].destination_city+` (`+reissue_ticket[flight_select].journeys[i].destination+`)</span><br/>
                                </div>
                                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">
                                    <span style="font-weight:500;"><i class="fas fa-clock"></i> `;
                                    if(reissue_ticket[flight_select].journeys[i].elapsed_time.split(':')[0] != '0')
                                        text+= reissue_ticket[flight_select].journeys[i].elapsed_time.split(':')[0] + 'd ';
                                    if(reissue_ticket[flight_select].journeys[i].elapsed_time.split(':')[1] != '0')
                                        text+= reissue_ticket[flight_select].journeys[i].elapsed_time.split(':')[1] + 'h ';
                                    if(reissue_ticket[flight_select].journeys[i].elapsed_time.split(':')[2] != '0')
                                        text+= reissue_ticket[flight_select].journeys[i].elapsed_time.split(':')[2] + 'm ';
                                    text+=`</span><br/>`;
                                    if(reissue_ticket[flight_select].journeys[i].transit_count==0)
                                        text+=`<span style="font-weight:500;">Direct</span>`;
                                    else
                                        text+=`<span style="font-weight:500;">Transit: `+reissue_ticket[flight_select].journeys[i].transit_count+`</span>`;
                                    text+=`
                                </div>`;
                            }else{ // length lebih dari 1
                                for(j in reissue_ticket[flight_select].journeys[i].segments){
                                    //ganti sini
                                    flight_number = parseInt(j) + 1;
                                    text+=`
                                    <div class="col-lg-12" style="margin-top:10px;">
                                        <span style="font-weight: 500; color:`+color+`;">Flight `+flight_number+` </span>
                                    </div>`;

                                    text+=`
                                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">
                                        <table style="width:100%">
                                            <tr>
                                                <td class="airport-code"><h5>`+reissue_ticket[flight_select].journeys[i].segments[j].departure_date.split(' - ')[1]+`</h5></td>
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
                                        <span>`+reissue_ticket[flight_select].journeys[i].segments[j].departure_date.split(' - ')[0]+` </span></br>
                                        <span style="font-weight:500;">`+reissue_ticket[flight_select].journeys[i].segments[j].origin_city+` (`+reissue_ticket[flight_select].journeys[i].segments[j].origin+`)</span>
                                    </div>

                                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">
                                        <table style="width:100%; margin-bottom:6px;">
                                            <tr>
                                                <td><h5>`+reissue_ticket[flight_select].journeys[i].segments[j].arrival_date.split(' - ')[1]+`</h5></td>
                                                <td></td>
                                                <td style="height:30px;padding:0 15px;width:100%"></td>
                                            </tr>
                                        </table>
                                        <span>`+reissue_ticket[flight_select].journeys[i].segments[j].arrival_date.split(' - ')[0]+` </span></br>
                                        <span style="font-weight:500;">`+reissue_ticket[flight_select].journeys[i].segments[j].destination_city+` (`+reissue_ticket[flight_select].journeys[i].segments[j].destination+`)</span>
                                    </div>

                                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">
                                        <span style="font-weight:500;"><i class="fas fa-clock"></i> `;
                                    if(reissue_ticket[flight_select].journeys[i].segments[j].elapsed_time.split(':')[0] != '0')
                                        text+= reissue_ticket[flight_select].journeys[i].segments[j].elapsed_time.split(':')[0] + 'd ';
                                    if(reissue_ticket[flight_select].journeys[i].segments[j].elapsed_time.split(':')[1] != '0')
                                        text+= reissue_ticket[flight_select].journeys[i].segments[j].elapsed_time.split(':')[1] + 'h ';
                                    if(reissue_ticket[flight_select].journeys[i].segments[j].elapsed_time.split(':')[2] != '0')
                                        text+= reissue_ticket[flight_select].journeys[i].segments[j].elapsed_time.split(':')[2] + 'm ';
                                    text+=`</span><br/>
                                        <span>Transit: `+reissue_ticket[flight_select].journeys[i].segments[j].transit_count+`</span>
                                    </div>`;

                                }
                            }
                    text+=`
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-4" style="padding-top:15px;">
                        <a id="detail_button_journey0`+i+`" data-toggle="collapse" data-parent="#accordiondepart" onclick="show_flight_details(`+i+`);" href="#detail_departjourney`+i+`" style="color: #237395; text-decoration: unset;" aria-expanded="true">
                            <span class="detail-link" style="font-weight: bold; display:none;" id="flight_details_up`+i+`"> Flight details <i class="fas fa-chevron-up" style="font-size:14px;"></i></span>
                            <span class="detail-link" style="font-weight: bold; display:block;" id="flight_details_down`+i+`"> Flight details <i class="fas fa-chevron-down" style="font-size:14px;"></i></span>
                        </a>
                    </div>
                    <div class="col-lg-8 col-md-8 col-sm-8">
                        <div class="row">
                            <div class="col-lg-12" style="text-align:right;">
                                <span id="fare`+i+`" class="basic_fare_field" style="font-size:15px;font-weight: bold; color:`+color+`; padding:10px;">`;

                                text+=`</span>`;
//                                        if(choose_airline != null && choose_airline == airline[i].sequence && airline_request.direction != 'MC')
//                                            text+=`<input type='button' style="margin:10px;" id="departjourney`+i+`" class="primary-btn-custom-un choose_selection_ticket_airlines_depart" value="Chosen" onclick="get_price_itinerary(`+i+`)" sequence_id="0"/>`;
//                                        else
                                if(reissue_ticket[flight_select].journeys[i].can_book == true){
                                    text+=`<input type='button' style="margin:10px 0px 0px 0px;" id="departjourney`+i+`" class="primary-btn-custom choose_selection_ticket_airlines_depart" value="Choose" onclick="get_price_itinerary_reissue(`+i+`)" sequence_id="0"/>`;
                                }
                                else{
                                    text+=`<input type='button' style="margin:10px 0px 0px 0px;" id="departjourney`+i+`" class="primary-btn-custom choose_selection_ticket_airlines_depart" value="Sold Out" onclick="" disabled sequence_id="0"/>`;
                                }
                                text+=`
                            </div>
                        </div>
                    </div>
                </div>

            <div id="detail_departjourney`+i+`" class="panel-collapse collapse in" aria-expanded="true" style="display:none;">`;
                for(j in reissue_ticket[flight_select].journeys[i].segments){
                    if(reissue_ticket[flight_select].journeys[i].segments[j].transit_duration != ''){
                        text += `<div class="col-sm-12" style="text-align:center;"><span style="font-weight:500;"><i class="fas fa-clock"></i> Transit Duration`;
                        if(reissue_ticket[flight_select].journeys[i].segments[j].transit_duration.split(':')[0] != '0')
                            text+= reissue_ticket[flight_select].journeys[i].segments[j].transit_duration.split(':')[0] + 'd ';
                        if(reissue_ticket[flight_select].journeys[i].segments[j].transit_duration.split(':')[1] != '0')
                            text+= reissue_ticket[flight_select].journeys[i].segments[j].transit_duration.split(':')[1] + 'h ';
                        if(reissue_ticket[flight_select].journeys[i].segments[j].transit_duration.split(':')[2] != '0')
                            text+= reissue_ticket[flight_select].journeys[i].segments[j].transit_duration.split(':')[2] + 'm ';
                        text+=`</span></div><br/>`;
                    }
                    text+=`
                    <div class="row" id="journey0segment0" style="padding:10px;">
                        <div class="col-lg-2">`;
                    try{
                    text+=`
                        <span style="font-weight: 500; font-size:12px;">`+airline_carriers[reissue_ticket[flight_select].journeys[i].segments[j].carrier_code].name+`</span><br/>
                        <span style="color:`+color+`; font-weight: 500;">`+reissue_ticket[flight_select].journeys[i].segments[j].carrier_name+`</span><br/>
                        <img data-toggle="tooltip" style="width:50px; height:50px;" title="`+airline_carriers[reissue_ticket[flight_select].journeys[i].segments[j].carrier_code].name+`" src="`+static_path_url_server+`/public/airline_logo/`+reissue_ticket[flight_select].journeys[i].segments[j].carrier_code+`.png"><br/>`;
                    }catch(err){
                    text+=`
                        <span style="font-weight: 500;">`+reissue_ticket[flight_select].journeys[i].segments[j].carrier_code+`</span><br/>
                        <span style="color:`+color+`; font-weight: 500;">`+reissue_ticket[flight_select].journeys[i].segments[j].carrier_name+`</span><br/>`;
                    }
                    text+=`
                    </div>
                    <div class="col-lg-7">`;
                        for(k in reissue_ticket[flight_select].journeys[i].segments[j].legs){
                        text+=`
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="timeline-wrapper">
                                    <ul class="StepProgress">
                                        <li class="StepProgress-item is-done">
                                            <div class="bold">
                                                `+reissue_ticket[flight_select].journeys[i].segments[j].legs[k].departure_date.split(' - ')[0]+` - `+reissue_ticket[flight_select].journeys[i].segments[j].legs[k].departure_date.split(' - ')[1]+`
                                            </div>
                                            <div>
                                                <span style="font-weight:500;">`+reissue_ticket[flight_select].journeys[i].segments[j].legs[k].origin_city+` - `+reissue_ticket[flight_select].journeys[i].segments[j].legs[k].origin_name+` (`+reissue_ticket[flight_select].journeys[i].segments[j].legs[k].origin+`)</span></br>
                                                <span>Terminal: `+reissue_ticket[flight_select].journeys[i].segments[j].origin_terminal+`</span>
                                            </div>
                                        </li>
                                        <li class="StepProgress-item is-end">
                                            <div class="bold">
                                                `+reissue_ticket[flight_select].journeys[i].segments[j].legs[k].arrival_date.split(' - ')[0]+` - `+reissue_ticket[flight_select].journeys[i].segments[j].legs[k].arrival_date.split(' - ')[1]+`
                                            </div>
                                            <div>
                                                <span style="font-weight:500;">`+reissue_ticket[flight_select].journeys[i].segments[j].legs[k].destination_city+` - `+reissue_ticket[flight_select].journeys[i].segments[j].legs[k].destination_name+` (`+reissue_ticket[flight_select].journeys[i].segments[j].legs[k].destination+`)</span><br/>
                                                <span>Terminal: `+reissue_ticket[flight_select].journeys[i].segments[j].destination_terminal+`</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>`;
                        }
                    text+=`
                    </div>
                    <div class="col-lg-3">
                        <span style="font-weight:500;"><i class="fas fa-clock"></i> `;
                        if(reissue_ticket[flight_select].journeys[i].segments[j].elapsed_time.split(':')[0] != '0')
                            text+= reissue_ticket[flight_select].journeys[i].segments[j].elapsed_time.split(':')[0] + 'd ';
                        if(reissue_ticket[flight_select].journeys[i].segments[j].elapsed_time.split(':')[1] != '0')
                            text+= reissue_ticket[flight_select].journeys[i].segments[j].elapsed_time.split(':')[1] + 'h ';
                        if(reissue_ticket[flight_select].journeys[i].segments[j].elapsed_time.split(':')[2] != '0')
                            text+= reissue_ticket[flight_select].journeys[i].segments[j].elapsed_time.split(':')[2] + 'm ';
                        text+=`</span><br/>`;
                        for(k in reissue_ticket[flight_select].journeys[i].segments[j].fares){
                            if(k == 0){
                                for(l in reissue_ticket[flight_select].journeys[i].segments[j].fares[k].fare_details){
                                    if(reissue_ticket[flight_select].journeys[i].segments[j].fares[k].fare_details[l].detail_type == 'BG'){
                        text+=`
                        <span style="font-weight:500;"><i class="fas fa-suitcase"></i> `;
                                    }else if(reissue_ticket[flight_select].journeys[i].segments[j].fares[k].fare_details[l].detail_type == 'ML'){
                        text+=`
                        <span style="font-weight:500;"><i class="fas fa-utensils"></i> `;
                                    }
                                    text+=reissue_ticket[flight_select].journeys[i].segments[j].fares[k].fare_details[l].amount+` `+reissue_ticket[flight_select].journeys[i].segments[j].fares[k].fare_details[l].unit+`</span><br/>`;
                                }
                            break;
                            }
                        }
                    text+=`</div>
                    <div class="col-lg-12">`;
                        text+=`
                        <br/>
                        <div class="row">
                            <div class="col-lg-12">
                                <span style="font-weight:500;">Choose Seat (Class Of Service / Seat left) :</span>
                                <div style="overflow:auto; white-space:nowrap;">
                                <table>
                                    <tr>`;
                                    for(k in reissue_ticket[flight_select].journeys[i].segments[j].fares){
                                        text+=`
                                        <td style="padding:10px 15px 0px 0px;">`;
                                        if(k==0)
                                            text+=`
                                            <label class="radio-button-custom">
                                                <b>`+reissue_ticket[flight_select].journeys[i].segments[j].fares[k].class_of_service+`</span> / <span>`+reissue_ticket[flight_select].journeys[i].segments[j].fares[k].available_count+`</b>
                                                <input onclick="change_fare(`+i+`,`+j+`,`+k+`);" id="journey`+i+`segment`+j+`fare" name="journey`+i+`segment`+j+`fare" type="radio" value="`+k+`" checked="checked">
                                                <span class="checkmark-radio"></span>
                                            </label>`;
                                        else
                                            text+=`
                                            <label class="radio-button-custom">
                                                <b>`+reissue_ticket[flight_select].journeys[i].segments[j].fares[k].class_of_service+`</span> / <span>`+reissue_ticket[flight_select].journeys[i].segments[j].fares[k].available_count+`</b>
                                                <input onclick="change_fare(`+i+`,`+j+`,`+k+`);" id="journey`+i+`segment`+j+`fare" name="journey`+i+`segment`+j+`fare" type="radio" value="`+k+`">
                                                <span class="checkmark-radio"></span>
                                            </label>`;
                                        text+=`<br/>`;
                                        var total_price = 0;
                                        for(l in reissue_ticket[flight_select].journeys[i].segments[j].fares[k].service_charge_summary)
                                            for(m in reissue_ticket[flight_select].journeys[i].segments[j].fares[k].service_charge_summary[l].service_charges)
                                                if(reissue_ticket[flight_select].journeys[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'tax' || reissue_ticket[flight_select].journeys[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'fare' || reissue_ticket[flight_select].journeys[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'roc')
                                                    total_price+= reissue_ticket[flight_select].journeys[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].amount;
//                                                for(l in airline[i].segments[j].fares[k].service_charges){
//                                                    total_price += airline[i].segments[j].fares[k].service_charges[l].amount;
//                                                }
                                        id_price_segment = `journey`+i+`segment`+reissue_ticket[flight_select].journeys[i].segments[j].sequence+`fare`+reissue_ticket[flight_select].journeys[i].segments[j].fares[k].sequence;
                                        text+=`<span id="`+id_price_segment+`"><b>IDR `+getrupiah(total_price)+`</b></span>`;
                                        text+=`</td>
                                        `;
                                    }

                                    text+=`
                                    </tr>
                                </table></div>
                            </div>
                        </div><br/>`;
                    text+=`</div>
                    </div>`;
                }
                text+=`
            </div>
        </div>`;
       var node = document.createElement("div");
       node.innerHTML = text;
//       document.getElementById("render_ticket_reissue").appendChild(node);
       document.getElementById('airline_booking').appendChild(node);
       node = document.createElement("div");
//                   document.getElementById('airlines_ticket').innerHTML += text;
       text = '';
       if(reissue_ticket[flight_select].journeys[i].currency == 'IDR')
            document.getElementById('fare'+i).innerHTML = reissue_ticket[flight_select].journeys[i].currency+' '+getrupiah(reissue_ticket[flight_select].journeys[i].total_price);
       else
            document.getElementById('fare'+i).innerHTML = reissue_ticket[flight_select].journeys[i].currency+' '+reissue_ticket[flight_select].journeys[i].total_price;
    }

}
function get_price_itinerary_reissue(val){
    segment = [];
    if(reissue_ticket[flight_select].provider.match(/sabre/))
        provider = 'sabre'
    else
        provider = reissue_ticket[flight_select].provider;
    for(i in reissue_ticket[flight_select].journeys[val].segments){
        segment.push({
            "segment_code": reissue_ticket[flight_select].journeys[val].segments[i].segment_code,
            'fare_code': reissue_ticket[flight_select].journeys[val].segments[i].fares[0].fare_code,
            'carrier_code': reissue_ticket[flight_select].journeys[val].segments[i].carrier_code,
        });
    }
    if(airline_pick_list.length == flight_select+1){
        journey.push({'segments': segment, 'provider': provider});
        airline_pick_list.push(reissue_ticket[flight_select].journeys[val]);
        get_price_itinerary_reissue_request();
        //tampil getprice
    }else if(airline_pick_list.length == flight_select){
        journey.pop();
        journey.push({'segments': segment, 'provider': provider});
        airline_pick_list.pop();
        airline_pick_list.push(reissue_ticket[flight_select].journeys[val]);
        get_price_itinerary_reissue_request();
    }else{
        flight_select++;
        journey.push({'segments': segment, 'provider': provider});
        airline_pick_list.push(reissue_ticket[flight_select].journeys[val]);
        render_ticket_reissue();
    }
}

function get_price_itinerary_reissue_request(){
    text = '';
    total_price = 0;
    commission_price = 0;
    rules = 0;
    $text = '';
    text += `
    <div class="col-lg-12" style="background-color:white; padding:10px; border: 1px solid #cdcdcd; margin-bottom:15px;">
        <div class="row">
            <div class="col-lg-12">
                <div class="alert alert-warning" role="alert">
                    <span style="font-weight:bold;"> Please check before going to the next page!</span>
                </div>
            </div>
            <div class="col-lg-12" style="max-height:400px; overflow-y: auto;">
                <div class="row">`;
    flight_count = 0;
    for(i in airline_pick_list){
        text+=`
        <div class="col-lg-12">`;
        flight_count++;
        text += `<hr/><h6>Flight `+flight_count+`</h6>`;
        $text +='Flight '+flight_count+'\n';
 text+=`</div>
        <div class="col-lg-3">`;
        //logo
        for(j in airline_pick_list[i].carrier_code_list){ //print gambar airline
            try{
                text+=`
                <span style="font-weight: 500; font-size:12px;">`+airline_carriers[airline_pick_list[i].carrier_code_list[j]].name+`</span><br/>
                <img data-toggle="tooltip" title="`+airline_carriers[airline_pick_list[i].carrier_code_list[j]]+`" style="width:50px; height:50px;" src="`+static_path_url_server+`/public/airline_logo/`+airline_pick_list[i].carrier_code_list[k]+`.png"><span> </span>`;
            }catch(err){
                text+=`<img data-toggle="tooltip" title="" style="width:50px; height:50px;" src="`+static_path_url_server+`/public/airline_logo/`+airline_pick_list[i].carrier_code_list[k]+`.png"><span> </span>`;
            }
        }
        text+=`</div>`;
        text+=`<div class="col-lg-9">`;
        for(j in airline_pick_list[i].segments){
            //datacopy
            $text += airline_carriers[airline_pick_list[i].segments[j].carrier_code].name + ' ' + airline_pick_list[i].segments[j].carrier_code + airline_pick_list[i].segments[k].carrier_number + '\n';
            $text += airline_pick_list[i].segments[j].departure_date + ' → ' + airline_pick_list[i].segments[j].arrival_date + '\n';
            $text += airline_pick_list[i].segments[j].origin_name + ' (' + airline_pick_list[i].segments[j].origin_city + ') - ';
            $text += airline_pick_list[i].segments[j].destination_name + ' (' + airline_pick_list[i].segments[j].destination_city + ')\n\n';

            for(k in airline_pick_list[i].segments[j].legs){
                text+=`
                    <div class="row">
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                            <table style="width:100%">
                                <tr>
                                    <td class="airport-code"><h5>`+airline_pick_list[i].segments[j].legs[k].departure_date.split(' - ')[1]+`</h5></td>
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
                            <span style="font-size:13px;">`+airline_pick_list[i].segments[j].legs[k].departure_date.split(' - ')[0]+`</span></br>
                            <span style="font-size:13px; font-weight:500;">`+airline_pick_list[i].segments[j].legs[k].origin_city+` (`+airline_pick_list[i].segments[j].legs[k].origin+`)</span>
                        </div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                            <table style="width:100%; margin-bottom:6px;">
                                <tr>
                                    <td><h5>`+airline_pick_list[i].segments[j].legs[k].arrival_date.split(' - ')[1]+`</h5></td>
                                    <td></td>
                                    <td style="height:30px;padding:0 15px;width:100%"></td>
                                </tr>
                            </table>
                            <span style="font-size:13px;">`+airline_pick_list[i].segments[j].legs[k].arrival_date.split(' - ')[0]+`</span><br/>
                            <span style="font-size:13px; font-weight:500;">`+airline_pick_list[i].segments[j].legs[k].destination_city+` (`+airline_pick_list[i].segments[j].legs[k].destination+`)</span>
                        </div>
                    </div>`;
            }
            if(j == airline_pick_list[i].segments.length - 1)
                text+=`</div>`;
            price_list = {};
            if(airline_pick_list[i].segments[j].fares.length > 0 ){
                for(k in airline_pick_list[i].segments[j].fares){
                    for(l in airline_pick_list[i].segments[j].fares[k].service_charge_summary){
                        additional_price_reissue = 0;
                        for(m in airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges){
                            additional_price_reissue += airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].amount;
                            currency = airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].service_charges[m].currency;
                        }
                        price_list[airline_pick_list[i].segments[j].fares[k].service_charge_summary[l].pax_type] = {
                            'price' : additional_price_reissue,
                            'currency': currency
                        }
                    }
                    break;
                }
            }
        }
        price = 0;
        //adult
        $text+= 'Price\n';
        total_price = 0;
        try{//adult
            if(airline_get_detail.result.response.ADT != 0){
                text+=`
                <div class="col-lg-12">
                    <div class="row">
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                            <span style="font-size:13px; font-weight:500;">`+airline_get_detail.result.response.ADT+`x Adult @`+price_list.ADT.currency +' '+getrupiah(Math.ceil(price_list.ADT.price))+`</span><br/>
                        </div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                            <span style="font-size:13px; font-weight:500;">`+price_list.ADT.currency +' '+getrupiah(Math.ceil( airline_get_detail.result.response.ADT * price_list.ADT.price))+`</span><br/>
                        </div>
                    </div>
                </div>`;
                $text += airline_get_detail.result.response.ADT + ' Adult @'+ price_list.ADT.currency +' '+getrupiah(Math.ceil(price_list.ADT.price))+'\n';
                total_price += airline_get_detail.result.response.ADT * price_list.ADT.price;
            }
        }catch(err){

        }

        try{//child
            if(airline_get_detail.result.response.CHD != 0){
                text+=`
                <div class="col-lg-12">
                    <div class="row">
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                            <span style="font-size:13px; font-weight:500;">`+airline_get_detail.result.response.CHD+`x Child @`+price_list.CHD.currency +' '+getrupiah(Math.ceil(price_list.CHD.price))+`</span><br/>
                        </div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                            <span style="font-size:13px; font-weight:500;">`+price_list.CHD.currency +' '+getrupiah(Math.ceil( airline_get_detail.result.response.CHD * price_list.CHD.price))+`</span><br/>
                        </div>
                    </div>
                </div>`;
                $text += airline_get_detail.result.response.CHD + ' Child @'+ price_list.CHD.currency +' '+getrupiah(Math.ceil(price_list.CHD.price))+'\n';
                total_price += airline_get_detail.result.response.CHD * price_list.CHD.price;
            }
        }catch(err){

        }
        try{//infant
            if(airline_get_detail.result.response.INF != 0){
                text+=`
                <div class="col-lg-12">
                    <div class="row">
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                            <span style="font-size:13px; font-weight:500;">`+airline_get_detail.result.response.INF+`x Infant @`+price_list.INF.currency +' '+getrupiah(Math.ceil(price_list.INF.price))+`</span><br/>
                        </div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                            <span style="font-size:13px; font-weight:500;">`+price_list.INF.currency +' '+getrupiah(Math.ceil(airline_get_detail.result.response.INF * price_list.INF.price))+`</span><br/>
                        </div>
                    </div>
                </div>`;
                $text += airline_get_detail.result.response.INF + ' Infant @'+ price_list.INF.currency +' '+getrupiah(Math.ceil(price_list.INF.price))+'\n';
                total_price += airline_get_detail.result.response.INF * price_list.INF.price;
            }
        }catch(err){

        }
        $text += '\n';
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
                <span style="font-size:14px; font-weight: bold;"><b>`+price_list.ADT.currency+` `+getrupiah(Math.ceil(total_price))+`</b></span>
            </div>
        </div>
    </div>
    <div class="col-lg-12" style="padding-bottom:10px;">
    <hr/>
    <span style="font-size:14px; font-weight:bold;">Share This on:</span><br/>`;
    $text += 'Grand Total: IDR '+ getrupiah(Math.ceil(total_price)) + '\nPrices and availability may change at any time';
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
        </div>`;
    text+=`
        <div class="col-lg-6 col-md-6 col-sm-6" style="padding-bottom:5px;">
            <input class="primary-btn" style="width:100%;" type="button" onclick="copy_data();" value="Copy">
        </div>
        <div class="col-lg-6 col-md-6 col-sm-6" style="padding-bottom:5px;">
            <button class="primary-btn" id="next_reissue" style="width:100%;" onclick="sell_journey_reissue_construct();" type="button" value="Next">
                Next
            </button>
        </div>`;
    text+=`</div>`;

    document.getElementById('airline_detail').innerHTML = text;
    $("#myModal_price_itinerary").modal();

    $('.btn-next').prop('disabled', true);
    $('#loading-search-flight').hide();
    $('#choose-ticket-flight').hide();
}

function sell_journey_reissue_construct(){
    Swal.fire({
      title: 'Are you sure want to reissue?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
        console.log(result);
        if (result.value) {
            if (result.value == true){
                document.getElementById('next_reissue').disabled = true;
                $.ajax({
                   type: "POST",
                   url: "/webservice/airline",
                   headers:{
                        'action': 'sell_journey_reissue_construct',
                   },
            //       url: "{% url 'tt_backend_rodextrip:social_media_tree_update' %}",
                   data: {
                        "journeys_booking": JSON.stringify(journey),
                        "passengers":JSON.stringify({
                            "adult": airline_get_detail.result.response.ADT,
                            "child": airline_get_detail.result.response.CHD,
                            "infant": airline_get_detail.result.response.INF
                        }),
                        'signature': signature
                   },
                   success: function(msg) {
                       console.log(msg);
                       if(msg == true){
                            $.ajax({
                               type: "POST",
                               url: "/webservice/airline",
                               headers:{
                                    'action': 'sell_journeys',
                               },
                               data: {
                                    'signature': signature
                               },
                               success: function(msg) {
                                   console.log(msg);
                                   if(msg.result.error_code == 0){
                                       get_payment_acq('Issued',airline_get_detail.result.response.booker.seq_id, '', 'billing',signature,'airline_reissue');
                                       document.getElementById('payment_acq').hidden = false;
                                   }
                               },
                               error: function(XMLHttpRequest, textStatus, errorThrown) {
                                   if(XMLHttpRequest.status == 500){
                                       Swal.fire({
                                          type: 'error',
                                          title: 'Oops...',
                                          text: 'Something went wrong, please try again or check your internet connection',
                                       })
                                       $('.loader-rodextrip').fadeOut();
                                       $('.btn-next').removeClass('running');
                                       $('.btn-next').prop('disabled', false);
                                   }
                               },timeout: 30000
                            });
                       }else{
                       //error
                       }
                   },
                   error: function(XMLHttpRequest, textStatus, errorThrown) {
                      if(XMLHttpRequest.status == 500){
                          Swal.fire({
                              type: 'error',
                              title: 'Oops...',
                              text: 'Something went wrong, please try again or check your internet connection',
                           })
                           $('.loader-rodextrip').fadeOut();
                       }
                   },timeout: 60000
                });
            }else{

            }

        }else{

        }
    })
}

function dismiss_reissue(){
    $('#myModal_reissue').modal('hide')
}

function dismiss_reissue_get_price(){
    $('#myModal_price_itinerary').modal('hide');
}

function reissue_airline_commit_booking(val){
    show_loading();
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
       data: data,
       success: function(msg) {
           console.log(msg);
           if(msg.result.error_code == 0){
               //send order number
               document.getElementById('airline_booking').innerHTML = '';
               document.getElementById('airline_detail').innerHTML = '';
               document.getElementById('payment_acq').innerHTML = '';
               document.getElementById('reissued').innerHTML = '';
               document.getElementById('ssr_request_after_sales').innerHTML = '';
               $('.modal').modal('hide') // closes all active pop ups.
               $('.modal-backdrop').remove() // removes the grey overlay.
               $("body").removeClass("modal-open");
               airline_signin(msg.result.response.order_number);


           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
           }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error airline commit booking </span>' + msg.result.error_msg,
                })
                $('.loader-rodextrip').fadeOut();
                window.location.href = "/";
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status == 500){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error airline commit booking </span>' + errorThrown,
                })
                $('.loader-rodextrip').fadeOut();
            }
       },timeout: 60000
    });
}