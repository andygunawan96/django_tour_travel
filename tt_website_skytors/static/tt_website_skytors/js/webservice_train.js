var train_data = '';
var train_data_filter = '';
var train_cookie = '';
var train_sid = '';
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

function train_signin(data){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/train",
       headers:{
            'action': 'signin',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {},
       success: function(msg) {
            if(data == '')
                document.getElementById('train_searchForm').submit();
            else if(data != '')
                train_get_booking(data);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

//signin jadi 1 sama search
function train_search(co_uid){
    document.getElementById('train_ticket').innerHTML = ``;
    document.getElementById('train_detail').innerHTML = ``;

    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/train",
       headers:{
            'action': 'signin',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {},
       success: function(msg) {
           if(msg.result.error_code == 0){
               $.ajax({
               type: "POST",
               url: "/webservice/train",
               headers:{
                    'action': 'search2',
               },
        //       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
               data: {
                'origin': $('#train_origin').val(),
                'destination': $('#train_destination').val(),
                'departure': $('#train_departure').val(),
                'adult': $('#train_adult').val(),
                'infant': $('#train_infant').val(),

               },
               success: function(msg) {
                   console.log(msg);
                   try{
                        if(msg.result.error_code==0){
                            var counter = 0;
                            var train = [];
                            var fare = 0;
                            var commission = 0;
                            var departure = '';
                            var arrival = '';
                            var book = '';
                            var elapse = '';
                            var cabin_class = '';
                            for(i in msg.result.response.journeys){
                                for(j in msg.result.response.journeys[i].segments){
                                    for(k in msg.result.response.journeys[i].segments[j].fares){
                                        fare = 0;
                                        commission = 0;
                                        cabin_class = '';
                                        departure = msg.result.response.journeys[i].segments[j].departure_date.split(' ');
                                        departure = [departure[0].split('-')[2]+' '+month[departure[0].split('-')[1]]+' '+departure[0].split('-')[0], departure[1].split(':')[0]+':'+departure[1].split(':')[1]];
                                        arrival = msg.result.response.journeys[i].segments[j].arrival_date.split(' ');
                                        arrival = [arrival[0].split('-')[2]+' '+month[arrival[0].split('-')[1]]+' '+arrival[0].split('-')[0], arrival[1].split(':')[0]+':'+arrival[1].split(':')[1]];
                                        for(l in msg.result.response.journeys[i].segments[j].fares[k].service_charges){
                                            if(msg.result.response.journeys[i].segments[j].fares[k].service_charges[l].charge_code == 'fare'){
                                                fare = msg.result.response.journeys[i].segments[j].fares[k].service_charges[l].amount;
                                            }else{
                                                commission = msg.result.response.journeys[i].segments[j].fares[k].service_charges[l].amount;
                                            }
                                        }
                                        if(msg.result.response.journeys[i].segments[j].fares[k].cabin_class == 'E'){
                                            cabin_class = "Executive";
                                        }else if(msg.result.response.journeys[i].segments[j].fares[k].cabin_class == 'K'){
                                            cabin_class = "Economy";
                                        }else if(msg.result.response.journeys[i].segments[j].fares[k].cabin_class == 'B'){
                                            cabin_class = "Business";
                                        }
                                        train.push({
                                             'cabin_class': [msg.result.response.journeys[i].segments[j].fares[k].cabin_class,cabin_class],
                                             'class_of_service': msg.result.response.journeys[i].segments[j].fares[k].class_of_service,
                                             'currency': msg.result.response.journeys[i].segments[j].fares[k].currency,
                                             'available_count': msg.result.response.journeys[i].segments[j].fares[k].available_count,
                                             'service_charges': msg.result.response.journeys[i].segments[j].fares[k].service_charges,
                                             'fare': fare,
                                             'fare_code': msg.result.response.journeys[i].segments[j].fares[k].fare_code,
                                             'commission': commission,
                                             'origin': $('#train_origin').val().split(' - '),
                                             'segment_code': msg.result.response.journeys[i].segments[j].segment_code,
                                             'destination': $('#train_destination').val().split(' - '),
                                             'departure': departure,
                                             'journey_code': msg.result.response.journeys[i].journey_code,
                                             'carrier_number': msg.result.response.journeys[i].segments[j].carrier_number,
                                             'carrier_code': msg.result.response.journeys[i].segments[j].carrier_code,
                                             'carrier_name': msg.result.response.journeys[i].segments[j].carrier_name,
                                             'transit_count': msg.result.response.journeys[i].segments[j].transit_count,
                                             'arrival': arrival,
                                             'provider': msg.result.response.journeys[i].segments[j].provider,
                                             'sequence': counter,
                                             'time_lapse': elapse_time(departure, arrival),
                                             'can_book': can_book(departure, arrival),
                                        });
                                        counter++;

                                    }
                                }
                            }
                            console.log(train);
                            var response = '';
                            for(i in train){
                                if(train[i].available_count > 0)
                                    response+=`<div style="background-color:white; padding:5px; margin-bottom:15px;">`;
                                else
                                    response+=`<div style="background-color:#E5E5E5; padding:5px; margin-bottom:15px;">`;
                                response +=`
                                    <div class="row" style="padding:10px;">
                                        <div class="col-lg-12">
                                            <h4>`+train[i].carrier_name+` - (`+train[i].carrier_number+`) - `+train[i].cabin_class[1]+`</h5>
                                        </div>
                                        <div class="col-lg-4 col-xs-6">
                                            <table style="width:100%">
                                                <tr>
                                                    <td><h5>`+train[i].origin[0]+`</h5></td>
                                                    <td style="padding-left:15px;">
                                                        <img src="/static/tt_website_skytors/img/icon/train-01.png" style="width:20px; height:20px;"/>
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
                                            <span>`+train[i].origin[1]+`</span><br/>
                                            <span>`+train[i].departure[0]+` `+train[i].departure[1]+`</span><br/>
                                        </div>
                                        <div class="col-lg-4 col-xs-6" style="padding:0;">
                                            <table style="width:100%; margin-bottom:6px;">
                                                <tr>
                                                    <td><h5>`+train[i].destination[0]+`</h5></td>
                                                    <td></td>
                                                    <td style="height:30px;padding:0 15px;width:100%"></td>
                                                </tr>
                                            </table>
                                            <span>`+train[i].destination[1]+`</span><br/>
                                            <span>`+train[i].arrival[0]+` `+train[i].arrival[1]+`</span><br/>
                                        </div>

                                        <div class="col-lg-4 col-xs-12">
                                            <div style="float:right; margin-top:20px; margin-bottom:10px;">`;
                                            if(train[i].can_book == true && train[i].available_count>0)
                                                response+=`
                                                <span style="font-size:16px; margin-right:10px; font-weight: bold; color:#505050;">IDR `+getrupiah(train[i].fare)+`</span>
                                                <input class="primary-btn-custom" type="button" onclick="choose_train(`+train[i].sequence+`,`+$('#train_adult').val()+`,`+$('#train_infant').val()+`)"  id="train_choose`+train[i].sequence+`" value="Choose">`;
                                            else if(train[i].can_book == false && train[i].available_count>0)
                                                response+=`
                                                <span style="font-size:16px; margin-right:10px; font-weight: bold; color:#505050;">IDR `+getrupiah(train[i].fare)+`</span>
                                                <input class="primary-btn-custom" type="button" onclick="onclick=alert('Sorry, you can choose 3 or more hours from now!')"  id="train_choose`+train[i].sequence+`" value="Choose">`;
                                            else
                                                response+=`
                                                <span style="font-size:16px; margin-right:10px;">IDR `+getrupiah(train[i].fare)+`</span>
                                                <input class="disabled-btn" type="button" id="train_choose`+train[i].sequence+`" value="Sold" disabled>`
                                            response+=`</div>
                                        </div>`;

                                        if(train[i].available_count<50)
                                            response+=`<div class="col-lg-12"><span style="font-size:16px; float:right; color:#f15a22">`+train[i].available_count+` seat(s) left</span></div>`;
                                        response+=`
                                    </div>
                                </div>
                                `;
                            }
                            train_data = train;
                            train_data_filter = train;
                            train_cookie = msg.result.cookies;
                            train_sid = msg.result.sid;
                            document.getElementById('train_ticket').innerHTML = response;
                            loadingTrain();
                        }else{
                            loadingTrain();
                            var response = '';
                            response +=`
                                <div style="padding:5px; margin:10px;">
                                    <div style="text-align:center">
                                        <img src="/static/tt_website_skytors/img/icon/no-train.png" style="width:80px; height:80px;" alt="" title="" />
                                        <br/><br/>
                                        <h6>NO TRAIN AVAILABLE</h6>
                                    </div>
                                </div>
                            `;
                            document.getElementById('train_ticket').innerHTML = response;
                        }
                   }catch(err){
                        alert(msg.result.error_msg);
                   }
               },
               error: function(XMLHttpRequest, textStatus, errorThrown) {
                   alert(errorThrown);
               }
            });
           }else{

           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });


}


function train_create_booking(){
    console.log('create booking');
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/train",
       headers:{
            'action': 'create_booking',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {},
       success: function(msg) {
       console.log(msg);
        if(msg.result.error_code == 0){
            //send order number
            document.getElementById('train_booking').innerHTML+= '<input type="hidden" name="order_number" value='+msg.result.response.order_number+'>';
            document.getElementById('train_booking').submit();
//            gotoForm();
        }else{
            alert(msg.result.error_msg);
            // back to home
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
    $('.hold-seat-booking-train').addClass("running");
}

function train_get_booking(data){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/train",
       headers:{
            'action': 'get_booking',
       },
       data: {
            'order_number': data
       },
       success: function(msg) {
       console.log(msg);

        if(msg.result.error_code == 0){

            var passenger = {adult:0,infant:0}
            for(i in msg.result.response.passengers){
                if(msg.result.response.passengers[i].pax_type == 'ADT')
                    passenger.adult++;
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
                    <span style="color:white; font-size:16px;"> Train Detail <img style="width:18px;" src="/static/tt_website_skytors/images/icon/train.png"/></span>
                </center>
            </div>

            <div style="background-color:white; border:1px solid #f15a22;">
                <div class="row">`;
                    for(i in msg.result.response.journeys){
                        var cabin_class = '';
                        if(i ==0)
                            text+=`
                            <div class="col-lg-12">
                                <div style="padding:10px; background-color:white;">
                                <h5>Departure</h5>`;
                        else
                            text+=`<h5>Return</h5><br/>`;
                        for(j in msg.result.response.journeys[i].segments){

                            for(k in cabin_class_types)
                                if(cabin_class_types[k][0] == msg.result.response.journeys[i].segments[j].cabin_class){
                                    cabin_class = cabin_class_types[k][1];
                                    break;
                                }

                        text+=`<h4>`+msg.result.response.journeys[i].segments[j].carrier.name+' '+msg.result.response.journeys[i].segments[j].carrier.code+`</h4>
                        <span>Class : `+msg.result.response.journeys[i].segments[j].class_of_service+` (`+cabin_class+`)</span><br/>
                        <div class="row">
                            <div class="col-lg-6 col-xs-6">
                                <table style="width:100%">
                                    <tr>
                                        <td><h6>`+msg.result.response.journeys[i].segments[j].origin.code+`</h6></td>
                                        <td style="padding-left:15px;">
                                            <img src="/static/tt_website_skytors/img/icon/train-01.png" style="width:20px; height:20px;"/>
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
                                <span>`+msg.result.response.journeys[i].segments[j].origin.name+`</span><br/>
                                <span>Schedule departure</span><br>
                                <span>`+msg.result.response.journeys[i].segments[j].departure_time+`</span><br>
                                <span>`+msg.result.response.journeys[i].segments[j].departure_date+`</span>
                            </div>

                            <div class="col-lg-6 col-xs-6" style="padding:0;">
                                <table style="width:100%; margin-bottom:6px;">
                                    <tr>
                                        <td><h6>`+msg.result.response.journeys[i].segments[j].destination.code+`</h6></td>
                                        <td></td>
                                        <td style="height:30px;padding:0 15px;width:100%"></td>
                                    </tr>
                                </table>
                                <span>`+msg.result.response.journeys[i].segments[j].destination.name+`</span><br/>
                                <span>Schedule arrival</span><br>
                                <span>`+msg.result.response.journeys[i].segments[j].arrival_time+`</span><br>
                                <span>`+msg.result.response.journeys[i].segments[j].arrival_date+`</span>
                            </div>
                        </div>

                        </div>
                    </div>`;
                    }
                }
            text+=`</div>
                    </div>
                </div>
            </div>

            <div style="background-color:#f15a22; margin-top:20px;">
                <center>
                    <span style="color:white; font-size:16px;"> List of Passenger <i class="fas fa-users"></i></span>
                </center>
            </div>

            <div style="border:1px solid #f15a22; padding:10px; background-color:white;">

            <table style="width:100%">
                <tr>
                    <th>Name</th>
                    <th>Birth Date</th>
                    <th>ID Type</th>
                    <th>ID Number</th>
                    <th>Seat</th>
                </tr>`;
                for(i in msg.result.response.journeys[0].segments[0].seats){
                    var identity_type = '';
                    for(j in id_types)
                        if(id_types[j][0] == msg.result.response.journeys[0].segments[0].seats[i].passenger.identity_type){
                            identity_type = id_types[j][1];
                            break;
                        }
                    text+=`
                        <tr>
                            <td>`+msg.result.response.journeys[0].segments[0].seats[i].passenger.title+' '+msg.result.response.journeys[0].segments[0].seats[i].passenger.first_name+' '+msg.result.response.journeys[0].segments[0].seats[i].passenger.last_name+`</td>
                            <td>`+msg.result.response.journeys[0].segments[0].seats[i].passenger.birth_date+`</td>
                            <td>`+identity_type+`</td>
                            <td>`+msg.result.response.journeys[0].segments[0].seats[i].passenger.identity_number+`</td>
                            <td>`+msg.result.response.journeys[0].segments[0].seats[i].seat+`</td>
                        </tr>
                    `;
                }
                text+=`</table>
                </div>
            </div>

            <div class="row" style="margin-top:20px;">
                <div class="col-lg-4" style="padding-bottom:10px;">`;
                        if (msg.result.response.state  == 'booked'){
                            text+=`
                            <a href="/train/seat_map" id="seat-map-link" class="hold-seat-booking-train ld-ext-right" style="color:white;">
                                <input type="button" id="button-choose-print" class="primary-btn" style="width:100%;" value="Choose Seat" onclick="train_create_booking();"/>
                                <div class="ld ld-ring ld-cycle"></div>
                            </a>`;
                        }
                        else{
                            text+=`
                            <a class="print-booking-train ld-ext-right" style="color:white;">
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
                                <input type="button" class="primary-btn" id="button-issued-print" style="width:100%;" value="Issued" onclick="train_issued_booking();"/>
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
            document.getElementById('train_booking').innerHTML = text;

            //detail
            text = '';
            commission = 0;
            total_price = 0;
            text+=`
                <div style="background-color:#f15a22; margin-top:20px;">
                    <center>
                        <span style="color:white; font-size:16px;"> Price Detail <i class="fas fa-money-bill-wave"></i></span>
                    </center>
                </div>
                <div style="background-color:white; padding:15px; border: 1px solid #f15a22;">`;
            for(i in msg.result.response.itinerary_price){
                if(msg.result.response.itinerary_price[i].charge_code == 'r.ac'){
                    commission = msg.result.response.itinerary_price[i].amount;

                 //bikin button commision isi nya msg.result.response.itinerary[i].amount
                }else if(msg.result.response.itinerary_price[i].charge_code == 'fare'){
                    text+=`
                    <div class="row" style="margin-bottom:5px;">
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                            <span style="font-size:13px;">`+passenger.adult+'x Adult '+msg.result.response.itinerary_price[i].charge_code+`</span>
                        </div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                            <span style="font-size:13px;">IDR `+getrupiah(passenger.adult*msg.result.response.itinerary_price[i].amount)+`</span>
                        </div>
                    </div>`;
                    text+=`
                    <div class="row" style="margin-bottom:5px;">
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                            <span style="font-size:13px;">`+passenger.infant+'x Infant '+msg.result.response.itinerary_price[i].charge_code+`</span>
                        </div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                            <span style="font-size:13px;">IDR 0</span>
                        </div>
                    </div>`;
                    total_price+=passenger.adult*msg.result.response.itinerary_price[i].amount;
                }else if(msg.result.response.itinerary_price[i].charge_code == 'disc'){
                    text+=`
                    <div class="row" style="margin-bottom:5px;">
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                            <span style="font-size:13px;">Discount Channel</span>
                        </div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                            <span style="font-size:13px; ">IDR `+getrupiah(msg.result.response.itinerary_price[i].amount)+`</span>
                        </div>
                    </div>`;
                    total_price-=msg.result.response.itinerary_price[i].amount;
                }else if(msg.result.response.itinerary_price[i].charge_code == 'r.oc'){
                    text+=`
                    <div class="row" style="margin-bottom:5px;">
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                            <span style="font-size:13px;">Tax</span>
                        </div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">
                            <span style="font-size:13px;">IDR `+getrupiah(msg.result.response.itinerary_price[i].amount)+`</span>
                        </div>
                    </div>`;
                    total_price+=msg.result.response.itinerary_price[i].amount;
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
                        <span style="font-size:13px;">Your Commission: IDR `+getrupiah(commission*-1)+`</span><br>
                    </div>
                </div>
            </div>`;
            text+=`<center><div style="margin-bottom:5px;"><input class="primary-btn-ticket" id="show_commission_button" style="width:100%;" type="button" onclick="show_commission();" value="Show Commission"/></div></div>`;
            document.getElementById('train_detail').innerHTML = text;
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

function train_issued_booking(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/train",
       headers:{
            'action': 'issued',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {},
       success: function(msg) {
        if(msg.result.error_code == 0)
            document.getElementById('issued-breadcrumb').classList.add("active");
            document.getElementById('success-issued').style.display = "block";
            document.getElementById('button-choose-print').value = "Print Ticket";
            document.getElementById('button-print-print').value = "Print Ticket (with Price)";
            document.getElementById('button-issued-print').value = "Print Invoice";
            document.getElementById('button-choose-print').onclick = "#";
            document.getElementById('button-print-print').onclick = "#";
            document.getElementById('button-issued-print').onclick = "#";
            document.getElementById('seat-map-link').href="#";
            document.getElementById('pnr').innerHTML="Issued";
            $('.issued-booking-train').removeClass("running");
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });

    $('.issued-booking-train').addClass("running");
}

function train_get_seat_map(){
    console.log('asdasdasd');
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/train",
       headers:{
            'action': 'get_seat_map',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {},
       success: function(msg) {
        if(msg.result.error_code==0){
            var text='<div class="slideshow-container">';
            for(i in msg.result.response){
                seat_map = msg.result.response;
                text+=`
                  <div class="col-lg-12 mySlides1">
                  <div style="width:100%;text-align:center;">
                    <h5>
                    <a style="color:black; cursor:pointer; float:left;" onclick="plusSlides(-1, 0)">&#10094; Prev</a>
                    `+msg.result.response[i].wagon_name+`
                    <a style="color:black; cursor:pointer; float:right;" onclick="plusSlides(1, 0)">Next &#10095;</a>
                    </h5>
                    <br/>
                    </div>`;
                    for(j in msg.result.response[i].seat_map){
                        text+=`
                          <div style="width:100%;text-align:center;">`;
                          var percent = parseInt(75 / msg.result.response[i].seat_map[j].seats_number.length);
                          for(k in msg.result.response[i].seat_map[j].seats_number){
                            check = 0;
                            for(l in pax)
                                if(pax[l].seat.split('/')[0] == msg.result.response[i].wagon_name && pax[l].seat.split('/')[1] == msg.result.response[i].seat_map[j].seats_number[k]){
                                    text+=`<input class="button-seat-map" type="button" style="width:`+percent+`%;background-color:#f15a22; margin:5px;" id="`+msg.result.response[i].wagon_name+`-`+msg.result.response[i].seat_map[j].seats_number[k]+`" onclick="change_seat('`+msg.result.response[i].wagon_name+`','`+msg.result.response[i].seat_map[j].seats_number[k]+`')" value="`+msg.result.response[i].seat_map[j].seats_number[k]+`"/>`;
                                    check = 1;
                                }
                            if(check == 0){
                                if(msg.result.response[i].seat_map[j].status[k] == -1){
                                  text+=`<input type="button" style="width:`+percent+`%;background-color:transparent;border:transparent; margin:5px;" id="`+msg.result.response[i].wagon_name+`-`+msg.result.response[i].seat_map[j].seats_number[k]+`" value="`+msg.result.response[i].seat_map[j].seats_number[k]+`" disabled/>`;
                                }else if(msg.result.response[i].seat_map[j].status[k] == 0){
                                  text+=`<input class="button-seat-map" type="button" style="width:`+percent+`%;background-color:#CACACA; margin:5px;" id="`+msg.result.response[i].wagon_name+`-`+msg.result.response[i].seat_map[j].seats_number[k]+`" onclick="change_seat('`+msg.result.response[i].wagon_name+`','`+msg.result.response[i].seat_map[j].seats_number[k]+`')" value="`+msg.result.response[i].seat_map[j].seats_number[k]+`"/>`;
                                }else if(msg.result.response[i].seat_map[j].status[k]== 1){
                                  text+=`<input class="button-seat-map" type="button" style="width:`+percent+`%;background-color:#656565; color:white; margin:5px;" id="`+msg.result.response[i].wagon_name+`-`+msg.result.response[i].seat_map[j].seats_number[k]+`" onclick="alert('Already booked');" value="`+msg.result.response[i].seat_map[j].seats_number[k]+`"/>`;
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

            document.getElementById('train_seat_map').innerHTML = text;
            showSlides(1, 0);
            loadingTrain();
        }else{
            alert(msg.result.error_msg);
        }

       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

function train_manual_seat(){
    console.log('asdd');
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/train",
       headers:{
            'action': 'manual_seat',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {
        'pax': JSON.stringify(pax)
       },
       success: function(msg) {
        if(msg.result.error_code == 0)
            document.getElementById('train_booking').submit();
        else
            alert(msg.result.error_msg);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
    $('.submit-seat-train').addClass("running");
}

function gotoForm(){
    document.getElementById('train_searchForm').submit();
}