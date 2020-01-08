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
       data: {},
       success: function(msg) {
            console.log(msg);
            if(msg.result.error_code == 0){
                signature = msg.result.response.signature;
                if(data == '')
                    train_search(msg.result.response.signature);
                else if(data != '')
                    train_get_booking(data);
            }else{
               Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: msg.result.error_msg,
               })
               try{
                $("#waitingTransaction").modal('hide');
               }catch(err){}
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error train signin </span>' + errorThrown,
            })
            try{
                $("#waitingTransaction").modal('hide');
            }catch(err){}
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
       data: {
            'signature': signature
       },
       success: function(msg) {
        console.log(msg);
        new_train_destination = [];
        for(i in msg){
            new_train_destination.push(msg[i].code+' - '+ msg[i].name+` - `+msg[i].city+` - `+msg[i].country);
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
                                <img src="/static/tt_website_rodextrip/img/icon/no-train.png" style="width:80px; height:80px;" alt="" title="" />
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

function elapse_time(departure){
  today = new Date();
  dep = new Date(departure);
  var diff = parseInt(Math.abs(dep - today)/3600000);
  if(today > dep)
    diff *= -1;
  if(diff >= 3)
    return true;
  else
    return false;
}

function datasearch2(train){
    var counter = 0;
    data = [];
    for(i in train.schedules){
        for(j in train.schedules[i].journeys){
           train.schedules[i].journeys[j].sequence = counter;
           train.schedules[i].journeys[j].train_sequence = i;
           price = 0;
           currency = '';
           if(train.schedules[i].journeys[j].cabin_class == 'E')
                train.schedules[i].journeys[j].cabin_class = ['E', 'Executive']
           else if(train.schedules[i].journeys[j].cabin_class == 'K')
                train.schedules[i].journeys[j].cabin_class = ['K', 'Economy']
           else if(train.schedules[i].journeys[j].cabin_class == 'B')
                train.schedules[i].journeys[j].cabin_class = ['B', 'Business']
           date = train.schedules[i].journeys[j].departure_date;
           date = date.split(' - ')[0].split(' ')[2] + ' ' + date.split(' - ')[0].split(' ')[1] + ' ' + date.split(' - ')[0].split(' ')[0] + ' ' +date.split(' - ')[1];
           train.schedules[i].journeys[j].can_book = elapse_time(date);
           train.schedules[i].journeys[j].departure_date = train.schedules[i].journeys[j].departure_date.split(' - ');
           train.schedules[i].journeys[j].arrival_date = train.schedules[i].journeys[j].arrival_date.split(' - ');
           for(k in train.schedules[i].journeys[j].fares){
                for(l in train.schedules[i].journeys[j].fares[k].service_charge_summary){
                    train.schedules[i].journeys[j].price = 0
                    for(m in train.schedules[i].journeys[j].fares[k].service_charge_summary[l].service_charges){
                        if(train.schedules[i].journeys[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'fare' || train.schedules[i].journeys[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'roc' || train.schedules[i].journeys[j].fares[k].service_charge_summary[l].service_charges[m].charge_code == 'tax'){
                            train.schedules[i].journeys[j].currency = train.schedules[i].journeys[j].fares[k].service_charge_summary[l].service_charges[m].currency;
                            train.schedules[i].journeys[j].price += train.schedules[i].journeys[j].fares[k].service_charge_summary[l].service_charges[m].amount;
                        }
                    }
                    break;
                }
                break;
           }
           data.push(train.schedules[i].journeys[j]);
           counter++;
       }
    }
    train_data = data;
    filtering('filter');
}

function hold_booking(){
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
            $('.loader-rodextrip').fadeIn();
            $('.next-loading-booking').addClass("running");
            $('.next-loading-booking').prop('disabled', true);
            $('.next-loading-issued').prop('disabled', true);
        }
        else{
            $('.loader-rodextrip').fadeIn();
            $('.next-loading-booking').prop('disabled', true);
            $('.next-loading-issued').addClass("running");
            $('.next-loading-issued').prop('disabled', true);
        }
        train_commit_booking();
      }
    });
}

function train_create_booking(val){
    Swal.fire({
      title: 'Are you sure want to Hold Booking?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        $('.hold-seat-booking-train').addClass("running");
        $('.hold-seat-booking-train').attr("disabled", true);
        please_wait_transaction();
        data = {
            'value': val,
            'signature': signature
        }
        try{
            data['seq_id'] = payment_acq2[payment_method][selected].seq_id;
            data['member'] = payment_acq2[payment_method][selected].method;
        }catch(err){
        }
        $.ajax({
           type: "POST",
           url: "/webservice/train",
           headers:{
                'action': 'commit_booking',
           },
           data: data,
           success: function(msg) {
           console.log(msg);
            if(msg.result.error_code == 0){
                //send order number
                $('.hold-seat-booking-train').removeClass("running");
                $('.hold-seat-booking-train').attr("disabled", false);
                document.getElementById('train_booking').innerHTML+= '<input type="hidden" name="order_number" value='+msg.result.response.order_number+'>';
                document.getElementById('train_booking').submit();
    //            gotoForm();
            }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error train create booking </span>' + msg.result.error_msg,
                })
                $('.hold-seat-booking-train').removeClass("running");
                $('.hold-seat-booking-train').attr("disabled", false);
                $("#waitingTransaction").modal('hide');
            }
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
               Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error train create booking </span>' + errorThrown,
               })
               $('.hold-seat-booking-train').removeClass("running");
               $('.hold-seat-booking-train').attr("disabled", false);
               $("#waitingTransaction").modal('hide');
           },timeout: 300000
        });
      }
    })
}

function train_get_booking(data){
    price_arr_repricing = {};
    getToken();
    $("#waitingTransaction").modal('hide');
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
            train_get_detail = msg;
            if(msg.result.response.state != 'issued' && msg.result.response.state != 'fail_booked'  && msg.result.response.state != 'fail_issued'){
                get_payment_acq('Issued',msg.result.response.booker.seq_id, msg.result.response.order_number, 'billing',signature,'train');
                document.getElementById('voucher_discount').style.display = '';
            }else{
                document.getElementById('voucher_discount').style.display = 'none';
            }
            total_price_provider = [];
            price_provider = 0;
            $text = '';
            text = '';
            $text += 'Order Number: '+ msg.result.response.order_number + '\n';
            $text += 'Hold Date:\n';
            text += `
            <div class="col-lg-12" style="border:1px solid #cdcdcd; padding:10px; background-color:white; margin-bottom:20px;">
                <h6>Order Number : `+msg.result.response.order_number+`</h6><br/>
                <table style="width:100%;">
                    <tr>
                        <th>PNR</th>`;
                        if(msg.result.response.state == 'booked')
                        text+=`
                        <th>Hold Date</th>`;
                        text+=`
                        <th>Status</th>
                    </tr>`;
                    for(i in msg.result.response.provider_bookings){
                        //datetime utc to local
                        if(msg.result.response.provider_bookings[i].error_msg.length != 0)
                            text += `<div class="alert alert-danger">
                                `+msg.result.response.provider_bookings[i].error_msg+`
                                <a href="#" class="close" data-dismiss="alert" aria-label="close" style="margin-top:-1.9vh;">x</a>
                            </div>`;
                        if(msg.result.response.provider_bookings[i].hold_date != false || msg.result.response.provider_bookings[i].hold_date != ''){
                            tes = moment.utc(msg.result.response.provider_bookings[i].hold_date).format('YYYY-MM-DD HH:mm:ss')
                            var localTime  = moment.utc(tes).toDate();
                            msg.result.response.provider_bookings[i].hold_date = moment(localTime).format('DD MMM YYYY HH:mm');
                        }
                        //
                        $text += msg.result.response.provider_bookings[i].pnr;
                        if(msg.result.response.state == 'booked')
                            $text +=' ('+msg.result.response.provider_bookings[i].hold_date+')\n';
                        else
                            $text += '\n';
                        text+=`<tr>
                            <td>`+msg.result.response.provider_bookings[i].pnr+`</td>`;
                        if(msg.result.response.state == 'booked')
                        text +=`
                            <td>`+msg.result.response.provider_bookings[i].hold_date+`</td>`;
                        text +=`
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
                        <h5> Train Detail </h5>
                        <hr/>`;
                    check = 0;
                    flight_counter = 1;
                    for(i in msg.result.response.provider_bookings){
                        for(j in msg.result.response.provider_bookings[i].journeys){
                            if(msg.result.response.provider_bookings[i].journeys[j].cabin_class == 'E')
                                msg.result.response.provider_bookings[i].journeys[j].cabin_class = ['E', 'Executive']
                            else if(msg.result.response.provider_bookings[i].journeys[j].cabin_class == 'K')
                                msg.result.response.provider_bookings[i].journeys[j].cabin_class = ['K', 'Economy']
                            else if(msg.result.response.provider_bookings[i].journeys[j].cabin_class == 'B')
                                msg.result.response.provider_bookings[i].journeys[j].cabin_class = ['B', 'Business']
                            if(i != 0){
                                text+=`<hr/>`;
                            }
                            text += `<h5>PNR: `+msg.result.response.provider_bookings[i].journeys[j].pnr+`</h5>`;
                            text+=`<h6>Journey `+flight_counter+`</h6><br/>`;
                            $text += 'Journey '+ flight_counter+'\n';
                            flight_counter++;
                            //yang baru harus diganti

                            $text += msg.result.response.provider_bookings[i].journeys[j].carrier_name+'\n';
                            $text += msg.result.response.provider_bookings[i].journeys[j].departure_date + ' - ';
                            if(msg.result.response.provider_bookings[i].journeys[j].departure_date.split(' - ')[0] == msg.result.response.provider_bookings[i].journeys[j].arrival_date.split(' - ')[0])
                                $text += msg.result.response.provider_bookings[i].journeys[j].arrival_date.split(' - ')[1] + '\n';
                            else
                                $text += msg.result.response.provider_bookings[i].journeys[j].arrival_date + '\n';
                            $text += msg.result.response.provider_bookings[i].journeys[j].origin_name +' ('+msg.result.response.provider_bookings[i].journeys[j].origin+') - '+msg.result.response.provider_bookings[i].journeys[j].destination_name +' ('+msg.result.response.provider_bookings[i].journeys[j].destination+')\n';
                            $text += 'Seats:\n'
                            for(k in msg.result.response.provider_bookings[i].journeys[j].seats){
                                $text += msg.result.response.provider_bookings[i].journeys[j].seats[k].passenger + ', ' + msg.result.response.provider_bookings[i].journeys[j].seats[k].seat.split(',')[0] + ' ' + msg.result.response.provider_bookings[i].journeys[j].seats[k].seat.split(',')[1]+'\n';
                            }
                            $text += '\n';
                            text+= `
                            <div class="row">
                                <div class="col-lg-4">
                                    <img data-toggle="tooltip" style="width:auto; height:50px;" title="`+msg.result.response.provider_bookings[i].journeys[j].carrier_code+`" class="airline-logo" src="/static/tt_website_rodextrip/img/icon/kai.png"/>`;
                            text+=`<h6>`+msg.result.response.provider_bookings[i].journeys[j].carrier_name+' '+msg.result.response.provider_bookings[i].journeys[j].carrier_number+`</h5>
                            <span>Class : `+msg.result.response.provider_bookings[i].journeys[j].cabin_class[1];
                            if(msg.result.response.provider_bookings[i].journeys[j].class_of_service != '')
                                text+=` (`+msg.result.response.provider_bookings[i].journeys[j].class_of_service+`)</span><br/>`;
                            else
                                text += '<br/>';
                            text+=`</div>`;
                            text += `
                                <div class="col-lg-8">
                                    <div class="row">
                                        <div class="col-lg-6 col-xs-6">
                                            <table style="width:100%">
                                                <tr>
                                                    <td><h5>`+msg.result.response.provider_bookings[i].journeys[j].departure_date.split(' - ')[1]+`</h5></td>
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
                                            <span>`+msg.result.response.provider_bookings[i].journeys[j].departure_date.split(' - ')[0]+`</span><br/>
                                            <span style="font-weight:500;">`+msg.result.response.provider_bookings[i].journeys[j].origin_name+` (`+msg.result.response.provider_bookings[i].journeys[j].origin+`)</span>
                                        </div>

                                        <div class="col-lg-6 col-xs-6" style="padding:0;">
                                            <table style="width:100%; margin-bottom:6px;">
                                                <tr>
                                                    <td><h5>`+msg.result.response.provider_bookings[i].journeys[j].arrival_date.split(' - ')[1]+`</h5></td>
                                                    <td></td>
                                                    <td style="height:30px;padding:0 15px;width:100%"></td>
                                                </tr>
                                            </table>
                                            <span>`+msg.result.response.provider_bookings[i].journeys[j].arrival_date.split(' - ')[0]+`</span><br/>
                                            <span style="font-weight:500;">`+msg.result.response.provider_bookings[i].journeys[j].destination_name+`  (`+msg.result.response.provider_bookings[i].journeys[j].destination+`)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
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
                        <td> `+msg.result.response.contact.title+` `+msg.result.response.contact.name+`</td>
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
                        <th style="width:15%;">Birth Date</th>
                        <th style="width:15%;">Identity Type</th>
                        <th style="width:20%;">ID</th>
                        <th style="width:20%;">Seat</th>
                    </tr>`;
                    for(pax in msg.result.response.passengers){
                        ticket = [];
                        for(i in msg.result.response.provider_bookings){
                            for(j in msg.result.response.provider_bookings[i].journeys){
                                for(k in msg.result.response.provider_bookings[i].journeys[j].seats){
                                    if(msg.result.response.passengers[pax].name == msg.result.response.provider_bookings[i].journeys[j].seats[k].passenger){
                                        ticket.push({
                                            'journey': msg.result.response.provider_bookings[i].journeys[j].origin + ' - ' + msg.result.response.provider_bookings[i].journeys[j].destination,
                                            'seat': msg.result.response.provider_bookings[i].journeys[j].seats[k].seat
                                        })
                                        break;
                                    }
                                }
                            }
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
                            <td>`+msg.result.response.passengers[pax].identity_type.charAt(0).toUpperCase()+msg.result.response.passengers[pax].identity_type.slice(1).toLowerCase()+`</td>
                            <td>`+msg.result.response.passengers[pax].identity_number+`</td>
                            <td>`;
                            for(i in ticket)
                                if(ticket[i].seat.split(',').length == 2)
                                text += ticket[i].journey+`<br/>`+ticket[i].seat.split(',')[0] + ' ' + ticket[i].seat.split(',')[1] +`<br/>`;
                            text+=`
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
                            <form method="post" id="seat_map_request" action='/train/seat_map'>

                                <input type="button" id="button-choose-print" class="primary-btn hold-seat-booking-train ld-ext-right" style="width:100%;color:white;" value="Seat Map" onclick="set_seat_map();"/>
                                <input id='passenger_input' name="passenger_input" type="hidden"/>
                                <input id='seat_map_request_input' name="seat_map_request_input" type="hidden"/>
                            </form>`;
                        }else if(msg.result.response.state == 'issued'){
                            text+=`
                            <a href="#" id="seat-map-link" class="hold-seat-booking-train ld-ext-right" style="color:white;">
                                <input type="button" id="button-choose-print" class="primary-btn" style="width:100%;" value="Print Ticket" onclick="get_printout('`+msg.result.response.order_number+`', 'ticket','train');"/>
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
                                <input type="button" class="primary-btn" id="button-print-print" style="width:100%;" value="Print Form" onclick="get_printout('`+msg.result.response.order_number+`', 'itinerary','train');" />
                                <div class="ld ld-ring ld-cycle"></div>
                            </a>`;
                        }
                        else if(msg.result.response.state == 'issued'){
                            text+=`
                            <a class="print-booking-train ld-ext-right" style="color:white;">
                                <input type="button" class="primary-btn" id="button-print-print" style="width:100%;" value="Print Ticket (with Price)" onclick="get_printout('`+msg.result.response.order_number+`', 'ticket_price','train');" />
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
                            $(".issued_booking_btn").show();
                        }
                        else if(msg.result.response.state == 'issued'){
//                            text+=`
//                            <a class="issued-booking-train ld-ext-right" style="color:white;">
//                                <input type="button" class="primary-btn" id="button-issued-print" style="width:100%;" value="Print Invoice" onclick="window.open('https://backend.rodextrip.com/rodextrip/report/pdf/tt.reservation.train/`+msg.result.response.order_number+`/4','_blank');"/>
//                                <div class="ld ld-ring ld-cycle"></div>
//                            </a>`;
                            text+=`
                            <a class="issued-booking-train ld-ext-right" style="color:white;">
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
                                                <h4 class="modal-title" style="color:white">Invoice</h4>
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
                                                    <input type="button" class="primary-btn" id="button-issued-print" style="width:30%;" value="Submit" onclick="get_printout('`+msg.result.response.order_number+`', 'invoice','train');"/>
                                                </div>
                                            </div>
                                            <div class="modal-footer">
                                              <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `;
                            $(".issued_booking_btn").remove();
                        }
                    }
                        text+=`
                    </a>
                </div>
            </div>`;
            document.getElementById('train_booking').innerHTML = text;
            //$(".issued_booking_btn").show();

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
            for(i in msg.result.response.provider_bookings){
                try{
                    text_detail+=`
                        <div style="text-align:left">
                            <span style="font-weight:500; font-size:14px;">PNR: `+msg.result.response.provider_bookings[i].pnr+` </span>
                        </div>`;
                    for(j in msg.result.response.passengers){
                        price = {'FARE': 0, 'RAC': 0, 'ROC': 0, 'TAX':0 , 'currency': '', 'CSC': 0};
                        for(k in msg.result.response.passengers[j].sale_service_charges[msg.result.response.provider_bookings[i].pnr]){
                            price[k] += msg.result.response.passengers[j].sale_service_charges[msg.result.response.provider_bookings[i].pnr][k].amount;
                            price['currency'] = msg.result.response.passengers[j].sale_service_charges[msg.result.response.provider_bookings[i].pnr][k].currency;
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
                                    <div class="col-lg-3" id="`+k+`">`+k+`</div>
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
                                <span style="font-size:12px;">`+msg.result.response.passengers[j].name+` </span>`;
                            text_detail+=`</div>
                            <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">`;

                            if(counter_service_charge == 0){
                                $text += msg.result.response.passengers[j].name + ' ['+msg.result.response.provider_bookings[i].pnr+'] ' + price.currency+` `+getrupiah(parseInt(price.FARE + price.TAX + price.ROC + price.CSC))+'\n';
                            text_detail+=`
                                <span style="font-size:13px;">`+price.currency+` `+getrupiah(parseInt(price.FARE + price.TAX + price.ROC + price.CSC))+`</span>`;
                            }else{
                                $text += msg.result.response.passengers[j].name + ' ['+msg.result.response.provider_bookings[i].pnr+'] ' + price.currency+` `+getrupiah(parseInt(price.FARE + price.TAX + price.ROC))+'\n';
                                text_detail+=`
                                <span style="font-size:13px;">`+price.currency+` `+getrupiah(parseInt(price.FARE + price.TAX + price.ROC))+`</span>`;
                            }
                            text_detail+=`
                            </div>
                        </div>`;
                        if(counter_service_charge == 0){
                            total_price += parseInt(price.TAX + price.ROC + price.FARE + price.CSC);
                            price_provider += parseInt(price.TAX + price.ROC + price.FARE + price.CSC);
                        }else{
                            total_price += parseInt(price.TAX + price.ROC + price.FARE);
                            price_provider += parseInt(price.TAX + price.ROC + price.FARE);
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
                $text += 'Grand Total: '+price.currency+' '+ getrupiah(total_price);
                if(msg.result.response.state == 'booked')
                $text += '\n\nPrices and availability may change at any time';
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
                            <a href="mailto:?subject=This is the train price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png"/></a>`;
                    } else {
                        text_detail+=`
                            <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png"/></a>
                            <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png"/></a>
                            <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png"/></a>
                            <a href="mailto:?subject=This is the train price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png"/></a>`;
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
                console.log(err);
            }
            try{
                testing_price = price.currency;
                text += text_detail;
            }catch(err){

            }
            add_repricing();
            document.getElementById('show_title_train').hidden = false;
            document.getElementById('show_loading_booking_train').hidden = true;
            if(msg.result.response.state == 'booked'){
                text += `
                <div>
                    <input class="primary-btn-ticket" id="show_commission_button" style="width:100%;" type="button" onclick="train_cancel_booking();" value="Cancel Booking"/>
                </div>`;
            }
            document.getElementById('train_detail').innerHTML = text;
            if (msg.result.response.state != 'booked'){
                document.getElementById('issued-breadcrumb').classList.add("active");
            }
        }else{
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: #ff9900;">Error train booking </span>' + msg.result.error_msg,
            })
            document.getElementById('show_loading_booking_train').hidden = true;
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error train booking </span>' + errorThrown,
            })
            document.getElementById('show_loading_booking_train').hidden = true;
       },timeout: 60000
    });
}

function set_seat_map(){
    passengers = [];
    seat_map_request = [];
    for(i in train_get_detail.result.response.provider_bookings){
        for(j in train_get_detail.result.response.provider_bookings[i].journeys){
            seat_map_request.push({
                'fare_code': train_get_detail.result.response.provider_bookings[i].journeys[j].fare_code,
                'provider': train_get_detail.result.response.provider_bookings[i].provider
            })
            for(k in train_get_detail.result.response.provider_bookings[i].journeys[j].seats){
                check = 0;
                for(l in passengers){
                    if(passengers[l].name == train_get_detail.result.response.provider_bookings[i].journeys[j].seats[k].passenger){
                        passengers[l].seat_list.push({
                            'seat':train_get_detail.result.response.provider_bookings[i].journeys[j].seats[k].seat,
                            'fare_code': train_get_detail.result.response.provider_bookings[i].journeys[j].fare_code,
                            'origin': train_get_detail.result.response.provider_bookings[i].journeys[j].origin,
                            'seat_code': train_get_detail.result.response.provider_bookings[i].journeys[j].seats[l].seat_code,
                            'destination': train_get_detail.result.response.provider_bookings[i].journeys[j].destination
                        });
                        check = 1;
                        break;
                    }
                }
                if(check == 0){
                    passengers.push({
                        'sequence': train_get_detail.result.response.provider_bookings[i].journeys[j].seats[k].passenger_sequence,
                        'name': train_get_detail.result.response.provider_bookings[i].journeys[j].seats[k].passenger,
                        'seat_list': [{
                            'seat': train_get_detail.result.response.provider_bookings[i].journeys[j].seats[k].seat,
                            'fare_code': train_get_detail.result.response.provider_bookings[i].journeys[j].fare_code,
                            'origin': train_get_detail.result.response.provider_bookings[i].journeys[j].origin,
                            'seat_code': train_get_detail.result.response.provider_bookings[i].journeys[j].seats[k].seat_code,
                            'destination': train_get_detail.result.response.provider_bookings[i].journeys[j].destination
                        }]
                    })
                }
            }
        }
    }
    getToken();
    document.getElementById('passenger_input').value = JSON.stringify(passengers);
    document.getElementById('seat_map_request_input').value = JSON.stringify(seat_map_request);
    goto_seat_map();
}

function train_issued(data){
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
        $.ajax({
           type: "POST",
           url: "/webservice/train",
           headers:{
                'action': 'issued',
           },
           data: {
               'order_number': data,
               'seq_id': payment_acq2[payment_method][selected].seq_id,
               'member': payment_acq2[payment_method][selected].method,
               'signature': signature,
               'voucher_code': voucher_code
           },
           success: function(msg) {
               console.log(msg);
               if(msg.result.error_code == 0){
                   //update ticket
                   price_arr_repricing = {};
                   pax_type_repricing = [];
                   document.getElementById('show_loading_booking_train').hidden = true;
                   document.getElementById('train_booking').innerHTML = '';
                   document.getElementById('train_detail').innerHTML = '';
                   document.getElementById('payment_acq').innerHTML = '';
                   document.getElementById('show_loading_booking_train').style.display = 'block';
                   document.getElementById('show_loading_booking_train').hidden = false;
                   document.getElementById('payment_acq').hidden = true;
                   document.getElementById("overlay-div-box").style.display = "none";
                   document.getElementById('voucher_discount').style.display = 'none';
                   $("#waitingTransaction").modal('hide');
                   train_get_booking(msg.result.response.order_number);
               }else if(msg.result.error_code == 1009){
                   price_arr_repricing = {};
                   pax_type_repricing = [];
                   document.getElementById('show_loading_booking_train').hidden = true;
                   document.getElementById('train_booking').innerHTML = '';
                   document.getElementById('train_detail').innerHTML = '';
                   document.getElementById('payment_acq').innerHTML = '';
                   document.getElementById('show_loading_booking_train').style.display = 'block';
                   document.getElementById('show_loading_booking_train').hidden = false;
                   document.getElementById('payment_acq').hidden = true;
                   document.getElementById("overlay-div-box").style.display = "none";
                   document.getElementById('voucher_discount').style.display = 'none';
                   $("#waitingTransaction").modal('hide');
                   train_get_booking(data);
                   Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: #ff9900;">Error train issued </span>' + msg.result.error_msg,
                    })
               }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                    logout();
               }else{
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: #ff9900;">Error train issued </span>' + msg.result.error_msg,
                    })

                    $('.hold-seat-booking-train').prop('disabled', false);
                    $('.hold-seat-booking-train').removeClass("running");
                    $("#waitingTransaction").modal('hide');
                    document.getElementById("overlay-div-box").style.display = "none";
               }
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error train issued </span>' + errorThrown,
                })
               $('.hold-seat-booking-train').prop('disabled', false);
               $('.hold-seat-booking-train').removeClass("running");
               $("#waitingTransaction").modal('hide');
               document.getElementById("overlay-div-box").style.display = "none";
           },timeout: 300000
        });
      }
    })
}

function train_get_seat_map(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/train",
       headers:{
            'action': 'get_seat_map',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
        console.log(msg);
        if(msg.result.error_code==0){
            seat_map_response = msg.result.response;
            print_seat_map();
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

function train_cancel_booking(){
    Swal.fire({
      title: 'Are you sure want to Cancel Booking?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        please_wait_transaction();
        getToken();
        $.ajax({
           type: "POST",
           url: "/webservice/train",
           headers:{
                'action': 'cancel',
           },
           data: {
                'order_number': order_number,
                'signature': signature

           },
           success: function(msg) {
           console.log(msg);
            if(msg.result.error_code == 0){
                price_arr_repricing = {};
               pax_type_repricing = [];
               document.getElementById('show_loading_booking_train').hidden = true;
               document.getElementById('train_booking').innerHTML = '';
               document.getElementById('train_detail').innerHTML = '';
               document.getElementById('payment_acq').innerHTML = '';
               document.getElementById('show_loading_booking_train').style.display = 'block';
               document.getElementById('show_loading_booking_train').hidden = false;
               document.getElementById('payment_acq').hidden = true;
               document.getElementById("overlay-div-box").style.display = "none";
               document.getElementById('voucher_discount').style.display = 'none';

               train_get_booking(order_number);

            }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error cancel train </span>' + msg.result.error_msg,
                })
                price_arr_repricing = {};
                pax_type_repricing = [];
                document.getElementById('show_loading_booking_train').hidden = true;
                document.getElementById('train_booking').innerHTML = '';
                document.getElementById('train_detail').innerHTML = '';
                document.getElementById('payment_acq').innerHTML = '';
                document.getElementById('show_loading_booking_train').style.display = 'block';
                document.getElementById('show_loading_booking_train').hidden = false;
                document.getElementById('payment_acq').hidden = true;
                document.getElementById("overlay-div-box").style.display = "none";
                document.getElementById('voucher_discount').style.display = 'none';
                train_get_booking(order_number);
            }
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
               Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error train manual seat </span>' + errorThrown,
                })
                $("#waitingTransaction").modal('hide');
           },timeout: 60000
        });
        $('.submit-seat-train').addClass("running");
      }
    })
}

function train_manual_seat(){
    $('.submit-seat-train').addClass("running");
    $('.change-seat-train-buttons').prop('disabled', true);
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/train",
       headers:{
            'action': 'assign_seats',
       },
       data: {
            'pax': JSON.stringify(pax),
            'order_number': order_number,
            'signature': signature

       },
       success: function(msg) {
       console.log(msg);
        if(msg.result.error_code == 0){
            check = 0;
            for(i in msg.result.response){
                if(msg.result.response[i].status == 'FAILED'){
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: #ff9900;">Error train manual seat </span>' + msg.result.response[i].error_msg,
                    });
                    check = 1;
                }
            }
            if(check == 0){
                document.getElementById('train_booking').submit();
            }else{
                $('.submit-seat-train').removeClass("running");
                $('.change-seat-train-buttons').prop('disabled', false);
            }
        }else
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: #ff9900;">Error train manual seat </span>' + msg.result.error_msg,
            })
            $('.submit-seat-train').removeClass("running");
            $("#waitingTransaction").modal('hide');
            $('.change-seat-train-buttons').prop('disabled', false);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error train manual seat </span>' + errorThrown,
            })
            $('.submit-seat-train').removeClass("running");
            $("#waitingTransaction").modal('hide');
            $('.change-seat-train-buttons').prop('disabled', false);
       },timeout: 60000
    });
}

function gotoForm(){
    document.getElementById('train_searchForm').submit();
}

function update_service_charge(){
    upsell = []
    for(i in train_get_detail.result.response.passengers){
        for(j in train_get_detail.result.response.passengers[i].sale_service_charges){
            currency = train_get_detail.result.response.passengers[i].sale_service_charges[j].FARE.currency;
        }
        list_price = []
        for(j in list){
            if(train_get_detail.result.response.passengers[i].name == document.getElementById('selection_pax'+j).value){
                list_price.push({
                    'amount': list[j],
                    'currency_code': currency
                });
            }

        }
        upsell.push({
            'sequence': train_get_detail.result.response.passengers[i].sequence,
            'pricing': JSON.parse(JSON.stringify(list_price))
        });
    }
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/train",
       headers:{
            'action': 'update_service_charge',
       },
       data: {
           'order_number': JSON.stringify(order_number),
           'passengers': JSON.stringify(upsell),
           'signature': signature
       },
       success: function(msg) {
           console.log(msg);
           if(msg.result.error_code == 0){
                train_get_booking(order_number);
                $('#myModalRepricing').modal('hide');
           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                logout();
           }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error airline service charge </span>' + msg.result.error_msg,
                })
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error airline service charge </span>' + errorThrown,
            })
       },timeout: 60000
    });

}