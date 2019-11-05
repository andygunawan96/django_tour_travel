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
            console.log(msg);
            signature = msg.result.response.signature;
            console.log(data);
            if(data == '')
                train_search(msg.result.response.signature);
            else if(data != '')
                train_get_booking(data);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error train signin </span>' + errorThrown,
            })
       },timeout: 60000
    });
}

function get_train_config(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/train",
       headers:{
            'action': 'get_data',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {},
       success: function(msg) {
        console.log(msg);
        new_train_destination = [];
        for(i in msg){
            new_train_destination.push(msg[i].code+' - '+ msg[i].name+` - `+msg[i].country);
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

//signin jadi 1 sama search
function train_search(signature){
    document.getElementById('train_ticket').innerHTML = ``;
    document.getElementById('train_detail').innerHTML = ``;

    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/train",
       headers:{
            'action': 'search',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {
            'signature': signature
       },
       success: function(msg) {
           console.log(msg);
           try{
                if(msg.result.error_code==0){
                    datasearch2(msg.result.response)
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
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: red;">Error train search </span>' + errorThrown,
                    })
               }
           }catch(err){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error train search </span>' + msg.result.error_msg,
                })
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error train search </span>' + errorThrown,
            })
       },timeout: 180000
    });
}

function datasearch2(train){
    var counter = 0;
    data = [];
    console.log(train);
    for(i in train.schedules){
        for(j in train.schedules[i].journeys){
           train.schedules[i].journeys[j].sequence = counter;
           price = 0;
           currency = '';
           if(train.schedules[i].journeys[j].cabin_class == 'E')
                train.schedules[i].journeys[j].cabin_class = ['E', 'Executive']
           else if(train.schedules[i].journeys[j].cabin_class == 'K')
                train.schedules[i].journeys[j].cabin_class = ['K', 'Economy']
           else if(train.schedules[i].journeys[j].cabin_class == 'B')
                train.schedules[i].journeys[j].cabin_class = ['B', 'Business']
           for(k in train.schedules[i].journeys[j].fares){
                for(l in train.schedules[i].journeys[j].fares[k].service_charge_summary){
                    for(m in train.schedules[i].journeys[j].fares[k].service_charge_summary[l].service_charges){
                        if(train.schedules[i].journeys[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'fare'){
                            train.schedules[i].journeys[j].currency = train.schedules[i].journeys[j].fares[k].service_charge_summary[l].service_charges[m].currency;
                            train.schedules[i].journeys[j].price = train.schedules[i].journeys[j].fares[k].service_charge_summary[l].service_charges[m].amount;
                            break;
                        }
                    }
                    break;
                }
                break;
           }
           data.push(train.schedules[i].journeys[j]);
       }
    }
    train_data = data;
    console.log(data);
    filtering('sort');
}


function train_create_booking(){
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
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: #ff9900;">Error train create booking </span>' + msg.result.error_msg,
            })
            // back to home
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error train create booking </span>' + errorThrown,
           })
       },timeout: 180000
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
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: #ff9900;">Error train booking </span>' + msg.result.error_msg,
            })
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error train booking </span>' + errorThrown,
            })
       },timeout: 60000
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
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error train issued booking </span>' + errorThrown,
            })
       },timeout: 180000
    });

    $('.issued-booking-train').addClass("running");
}

function train_get_seat_map(){
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
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: #ff9900;">Error train seat map </span>' + msg.result.error_msg,
            })
        }

       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error train seat map </span>' + errorThrown,
            })
       },timeout: 60000
    });
}

function train_manual_seat(){
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
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: #ff9900;">Error train manual seat </span>' + msg.result.error_msg,
            })
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error train manual seat </span>' + errorThrown,
            })
       },timeout: 60000
    });
    $('.submit-seat-train').addClass("running");
}

function gotoForm(){
    document.getElementById('train_searchForm').submit();
}