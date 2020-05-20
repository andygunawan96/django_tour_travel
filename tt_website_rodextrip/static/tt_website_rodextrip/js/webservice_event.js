var hotel_data = '';
var hotel_data_filter = '';
var hotel_price = '';
var price_pick = '';
var price_start = [];
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

function get_event_config(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/event",
       headers:{
            'action': 'get_config',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {
            'signature': signature
       },
       success: function(msg) {
        console.log(msg);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

function event_get_booking(data){
    price_arr_repricing = {};
    get_balance('false');
    $.ajax({
       type: "POST",
       url: "/webservice/event",
       headers:{
            'action': 'get_booking',
       },
       data: {
            'order_number': data,
            'signature': signature
       },
       success: function(msg) {
            console.log('Get Booking');
            console.log(msg);
            document.getElementById('show_loading_booking_airline').hidden = true;
            try{
                //======================= Resv =========================
                if(msg.result.error_code == 0){
                    hotel_get_detail = msg;
                    $text = '';
                    $text += 'Order Number: '+ msg.result.response.order_number + '\n';
                    $text += msg.result.response.status + '\n';
                    text = `
                        <h6 class="carrier_code_template">Order Number : </h6><h6>`+msg.result.response.order_number+`</h6><br/>
                        <table style="width:100%;">
                            <tr>
                                <th class="carrier_code_template">Booking Code</th>
                                <th class="carrier_code_template">Status</th>
                            </tr>`;
                            for(i in msg.result.response.providers){
                                text+=`
                                    <tr>`;

                                text+=`
                                    <td>`+msg.result.response.providers[i].pnr+`</td>`;
                                text+=`
                                        <td>`+msg.result.response.status.charAt(0).toUpperCase()+msg.result.response.status.slice(1).toLowerCase()+`</td>
                                    </tr>
                                `;
                            }
                        text+=`
                        </table>
                   `;
                   text+=`<div class="row">
                            <div class="col-sm-6">`;
                                if(msg.result.response.event_name != false)
                                    text+=`<span class="carrier_code_template">Event Name: </span><br/>`;
                                if(msg.result.response.event_location != false)
                                    text+=`<span class="carrier_code_template">Location: </span>`;
                                    for (loc_obj in msg.result.response.event_location)
                                        text+=`<br/>`;
                                text+=`<span class="carrier_code_template">Event Detail: </span><br/>`;
                    text+=`</div>
                            <div class="col-sm-6" style='text-align:right'>`;
                                if(msg.result.response.event_name != false)
                                    text+=`<span>`+msg.result.response.event_name+`</span><br/>`;
                                if(msg.result.response.event_location != false)
                                    for (loc_obj in msg.result.response.event_location)
                                        text+=`<span>`+msg.result.response.event_location[loc_obj].name+`, `+msg.result.response.event_location[loc_obj].address+`, `+msg.result.response.event_location[loc_obj].city+`</span><br/>`;
                                if(msg.result.response.description != false)
                                    text+=`<span>`+msg.result.response.description+`</span><br/>`;
                                else
                                    text+=`<span>-</span><br/>`;
                    text+=`</div>
                          </div>`;

                   text+=`<div class="row">
                            <div class="col-sm-6">
                                <span class="carrier_code_template">Check In: </span><span>`+msg.result.response.from_date+`</span><br/>
                            </div>
                            <div class="col-sm-6" style='text-align:right'>
                                <span class="carrier_code_template">Check Out: </span><span>`+msg.result.response.to_date+`</span><br/>
                            </div>
                          </div>`;
               document.getElementById('event_booking').innerHTML = text;
            //======================= Button Issued ==================
            if(msg.result.response.status == 'booked'){
               check_payment_payment_method(msg.result.response.order_number, 'Issued', '', 'billing', 'event', signature, {});
               $(".issued_booking_btn").show();
            }
            //======================= Option =========================
            text = `<h4>Option(s)</h4>
                    <hr/>
                    <table style="width:100%;" id="option-list">
                        <tr>
                            <th class="">No</th>
                            <th class="">Image</th>
                            <th class="">Name</th>
                            <th class="">Description</th>
                            <th class="">Price</th>
                            <th class="">Qty</th>
                            <th class="">SubTotal</th>
                        </tr>`;
                    for(i in msg.result.response.options){
                        var b = parseInt(i) + 1;
                        text+=`
                            <tr>
                                <td>`+ b +`</td>
                                <td>`+msg.result.response.options[i].image_url+`</td>
                                <td>`+msg.result.response.options[i].name+`</td>
                                <td>`+msg.result.response.options[i].description+`</td>
                                <td>`+msg.result.response.options[i].currency+` `+getrupiah(msg.result.response.options[i].price)+`</td>
                                <td>`+msg.result.response.options[i].qty+`</td>
                                <td>`+msg.result.response.options[i].currency+` `+getrupiah(msg.result.response.options[i].price * msg.result.response.options[i].qty)+`</td>
                            </tr>`;
                        }
                    text+=`</table>`;
            document.getElementById('event_list_option').innerHTML = text;

            //======================= Guest / Passanger =========================
            text=`
                <h5>Extra Question</h5>
                <hr/>
                <table style="width:100%;" id="list-of-question">
                    <tr>
                        <th class="">No</th>
                        <th class="">Name</th>
                        <th class="">Pax Type</th>
                        <th class="">Birth Date</th>
                    </tr>`;
                    for(i in msg.result.response.passengers){
                        text+=`<tr>
                            <td>`+parseInt(i+1)+`</td>
                            <td><span>`+msg.result.response.passengers[i].title+` `+msg.result.response.passengers[i].first_name+` `+msg.result.response.passengers[i].last_name+`</span></td>
                            <td><span>`+msg.result.response.passengers[i].pax_type+`</span></td>
                            <td><span>`+msg.result.response.passengers[i].birth_date+`</span></td>
                        </tr>`;
                    }
           text+=`</table>`;
           document.getElementById('event_passenger').innerHTML = text;

            //======================= Other =========================
            add_repricing();
            console.log($text);
                }else{
                    //swal
                }
            }catch(err){}
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status == 500){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error hotel get booking </span>' + errorThrown,
                })
            }
       },timeout: 180000
    });
}

function event_signin(data){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/event",
       headers:{
            'action': 'signin',
       },
       data: {},
       success: function(msg) {
           console.log(msg);
           if(msg.result.error_code == 0){
               signature = msg.result.response.signature;
               if(data != ''){
                    event_get_booking(data);
               }
           }else{
               Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: msg.result.error_msg,
               })
               try{
                $('#loading-search-event').hide();
               }catch(err){console.log('part #4')}
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status == 500){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error Event signin </span>' + errorThrown,
                })
              try{
                $('#loading-search-event').hide();
              }catch(err){console.log('part #3')}
            }
       },timeout: 120000
    });
}
//signin jadi 1 sama search
function event_search(data){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/event",
       headers:{
            'action': 'signin',
       },
       data: {},
       success: function(msg) {
           console.log(msg);
           if(data == ''){
               document.getElementById('event_ticket_objs').innerHTML = '';
               if(msg.result.error_code == 0){
                   $.ajax({
                       type: "POST",
                       url: "/webservice/event",
                       headers:{
                            'action': 'search',
                       },
                       data: {
                        'event_name': $('#event_name').val(),
                        'is_online': '1',
                       },
                       success: function(msg) {
                           console.log('Result');
                           console.log(msg);
                           try{
                                if(msg.result.error_code==0){
                                    sort(msg.result.response,1);
                                }else{
                                    //kalau error belum
                                    console.log('Error #1');
                                }
                           }catch(err){
                                console.log('Error #2');
                                alert(msg.result.error_msg);
                           }
                       },
                       error: function(XMLHttpRequest, textStatus, errorThrown) {
                           console.log(textStatus);
                           alert(errorThrown);
                       }
                   });
               }else{
                    console.log('Error Code != 0');
                    console.log(msg.result.error_code);
               }
           }else if(data != ''){
               //goto reservation
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

function event_options(id){
    //clearTimeout(myVar);
    myVar = setTimeout(function() {
    document.getElementById("detail_room_pick").innerHTML = '';
    document.getElementById('event_detail_table').innerHTML = '';
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/event",
       headers:{
            'action': 'detail',
       },
       data: {
            'external_code':id,
       },
       success: function(msg) {
        console.log(msg);
        //show package

        text='';
        var node = document.createElement("div");
        if(msg.result.response.length != 0){
            for(i in msg.result.response){
                text = '<div class="row" style="margin-bottom:15px;">';
                text += `
                <div class="col-lg-12" style="margin-bottom:15px; padding:0px;">
                    <div style="background: `+color+`; padding:10px; border-top-left-radius:7px; border-top-right-radius:7px;">
                        <span id="option_name_`+i+`" style="font-weight: bold; color:`+text_color+`; font-size:16px;"> `+ msg.result.response[i].grade + `</span><br/>
                        <div style="top:10px; right:10px; position:absolute;">
                            <label class="check_box_custom">
                                <span class="span-search-ticket"></span>
                                <input type="checkbox" id="copy_hotel"/>
                                <span class="check_box_span_custom"></span>
                            </label>
                        </div>
                    </div>
                </div>`;
                console.log(msg.result);
                if(msg.result.response[i].images.length != 0)
                    text+=`<div class="col-lg-3 col-md-3 border-event"><div class="img-event-detail" style="background-image: url(`+msg.result.response[i].images[0].url+`);"></div><hr/></div>`;
                else
                    text+=`<div class="col-lg-3 col-md-3 border-event"><div class="img-event-detail" style="background-image: url('/static/tt_website_rodextrip/images/no pic/no_image_hotel.jpeg');"></div></div>`;

                    text+=`<div class="col-lg-9 col-md-9">
                    <div class="row">
                        <div class="col-lg-12" style="margin-bottom:5px;">
                            <span>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard.</span>
                        </div>
                        <div class="col-lg-6">
                            <span style="font-size:14px;"><i class="fas fa-calendar-alt" style="color:{{color}};"></i> 15 Mei 2020</span>
                        </div>
                        <div class="col-lg-6">
                            <span style="font-size:14px;"><i class="fas fa-clock" style="color:{{color}};"></i> 09:00 - 13:00</span>
                        </div>
                        <div class="col-lg-12"><hr/></div>
                        <div class="col-lg-6 col-md-6">
                            <span style="font-weight:500; color: `+color+`;">Expired Date<br/> 15 Mei 2020 - 17:00</span>
                        </div>
                    <div class="col-lg-6 col-md-6" style="padding-top:5px;">
                        <div style="float:right; display:flex;">
                            <input id="option_currency_`+i+`" type="hidden" value="`+msg.result.response[i].currency+`"/>
                            <input id="option_price_`+i+`" type="hidden" value="`+msg.result.response[i].price+`"/>`;
                            price_start.push(msg.result.response[i].price);
                            if(msg.result.response[i].currency != 'IDR')
                                text+= '<span style="font-weight: bold; font-size:15px; padding-right:10px; padding-top:5px;"> '+ msg.result.response[i].currency + ' ' + parseInt(msg.result.response[i].price) +'</span><br/>';
                            else
                                text+= '<span style="font-weight: bold; font-size:15px; padding-right:10px; padding-top:5px;"> '+ msg.result.response[i].currency + ' ' + getrupiah(parseInt(msg.result.response[i].price))+'</span><br/>';
                        text+=`
                            <button type="button" class="btn-custom-circle" id="left-minus-event-`+i+`" data-type="minus" data-field="" disabled onclick="reduce_option(`+i+`);">
                                <i class="fas fa-minus"></i>
                            </button>
                            <input type="text" class="form-control" style="padding:5px !important; background:none; text-align:center; width:30px; height:30px;" id="option_qty_`+i+`" name="option_qty_`+i+`" value="0" min="0" readonly>
                            <button type="button" class="btn-custom-circle" id="right-plus-event-`+i+`" data-type="plus" data-field="" onclick="add_option(`+i+`);">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>`;

                    //text+='<button class="primary-btn-custom" type="button" onclick="hotel_room_pick(`'+msg.result.response[i].option_id+'`);" id="button'+msg.result.response[i].option_id+'">Choose</button>';
                    text+='</div></div>';
                    node.className = 'detail-event-box';
                    node.innerHTML = text;
                    document.getElementById("detail_room_pick").appendChild(node);
                    node = document.createElement("div");
                    $('#loading-detail-event').hide();
                }
                price_start.sort(function(a, b){return a - b});
                document.getElementById("price_start_event").textContent = msg.result.response[0].currency+" "+getrupiah(parseInt(price_start[0]));

                hotel_price = msg.result.prices;

                //            for(i in msg.result.prices){
    //                text+=`
    //                <div class="row" style="margin-bottom:15px;">
    //                    <div class="col-lg-12" style="margin-bottom:25px;">
    //                        <div style="top:0px; right:10px; position:absolute;">
    //                            <label class="check_box_custom">
    //                                <span class="span-search-ticket"></span>
    //                                <input type="checkbox" id="copy_hotel"/>
    //                                <span class="check_box_span_custom"></span>
    //                            </label>
    //                        </div>
    //                    </div>`;
    //
    //                for(j in msg.result.prices[i].rooms){
    //                    if(msg.result.prices[i].rooms[j].images.length != 0){
    //                        text+=`
    //                        <div class="col-lg-3 col-md-3">
    //                            <div class="img-hotel-detail" style="background-image: url(`+msg.result.prices[i].rooms[j].images[0].url+`);"></div>
    //                        </div>`;
    //                    }else{
    //                        text+=`
    //                        <div class="col-lg-3 col-md-3">
    //                            <div class="img-hotel-detail" style="background-image: url('/static/tt_website_rodextrip/images/no pic/no_image_hotel.jpeg');"></div>
    //                        </div>`;
    //                    }
    //
    //                    text+='<div class="col-lg-5 col-md-5"> <div style="margin-bottom:10px;"> <h4 style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">' +msg.result.prices[i].rooms[j].description+ '</h4></div>';
    //                    text+='<span>' + msg.result.prices[i].rooms[j].category + '<br/> Total: '+ msg.result.prices[i].rooms[j].qty + ' room(s)</span><br/>';
    //                }
    //
    //                text += '<span>Meal Type: ' + msg.result.prices[i].meal_type+'</span><br/>';
    //                text+=`</div>`;
    //
    //                text+=`
    //                <div class="col-lg-4 col-md-4" style="text-align:right;">`;
    //                if(msg.result.prices[i].currency != 'IDR')
    //                    text+= '<span style="font-weight: bold; font-size:16px;">'+ msg.result.prices[i].currency + ' ' + msg.result.prices[i].price_total +'</span>';
    //                else
    //                    text+= '<span style="font-weight: bold; font-size:16px;">'+ msg.result.prices[i].currency + ' ' + getrupiah(msg.result.prices[i].price_total) + '</span>';
    //
    //                text+='<br/><button class="primary-btn-custom" type="button" onclick="hotel_room_pick('+msg.result.prices[i].sequence+');" id="button'+msg.result.prices[i].sequence+'">Choose</button>';
    //                text+=`</div></div>`;
    //
    //            }
    //            hotel_price = msg.result.prices;

            }else{
                alert("There's no room in this hotel!");
                $('#loading-detail-hotel').hide();
    //            window.location.href = "http://localhost:8000";
            }
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
               alert(errorThrown);
           }
        });
    },500);
}

function event_get_extra_question(option_code, provider){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/event",
       headers:{
            'action': 'extra_question',
       },
       data: {
          "event_code": option_code,
          "price_code": option_code,
          "provider": provider
       },
       success: function(msg) {
        //console.log(option_code);
        console.log(msg);
        if(msg.result.error_code == 0){
            text='';
            var node = document.createElement("div");
            for(j in option_code){
                var k = 0;
                while(k < parseInt(option_code[j].qty)){
                    for(i in msg.result.response){
                        text += '<h3>Question #' + parseInt(i)+1 + '</h3>';
                        text += '<i>' + msg.result.response[i].question + '</i>';
                        text += '<input id="que_' + i +'" name="que_' + i +'" type="text" value="' + msg.result.response[i].question + '" hidden/>';
                        text += '<input id="question_event_' + i +'" name="question_event_' + i +'" type="text" placeholder="' + msg.result.response[i].type + '"';
                        if (msg.result.response[i].required)
                            text += 'required';
                        text += '/>';
                    }
                    k += 1;
                }
            }
            node.innerHTML = text;
            document.getElementById("extra_data_master").appendChild(node);
        }else{
            alert(msg.result.error_msg);
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

function event_issued_alert(val){
    if(val == 1)
        text = "Are you sure you want to Force Issued this booking?";
    else
        text = "Are you sure you want to Hold Booking this booking?";
    Swal.fire({
      title: text,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        $('.next-loading-booking').prop('disabled', true);
            $('.next-loading-issued').addClass("running");
            $('.next-loading-issued').prop('disabled', true);
            $('.loader-rodextrip').fadeIn();
            document.getElementById("passengers").value = JSON.stringify({'booker':booker});
            document.getElementById("signature").value = signature;
            document.getElementById("provider").value = 'hotel';
            document.getElementById("type").value = 'hotel_review';
            document.getElementById("voucher_code").value = voucher_code;
            document.getElementById("discount").value = JSON.stringify(discount_voucher);
            document.getElementById("session_time_input").value = time_limit;
            if(val == 1)
                document.getElementById('event_issued').submit();
            else
                event_create_booking();
    }
    })
}

function event_create_booking(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/event",
       headers:{
            'action': 'create_booking',
       },
       data: {
            'event_code': 'band001',
            'provider': 'event_internal',
            'event_option_codes': [
                {
                    'option_code': 'Sil-01',
                    'extra_question': [
                        {'question_id': '1','answer': 'Yes',},
                        {'question_id': '2','answer': 'No',},
                        {'question_id': '3','answer': '123',}
                    ]
                },
                {
                    'option_code': 'Sil-01',
                    'extra_question': [
                        {'question_id': '1','answer': 'No',},
                        {'question_id': '2','answer': 'No',},
                        {'question_id': '3','answer': '6',}
                    ]
                },
                {
                    'option_code': 'Pla-03',
                    'extra_question': [
                        {'question_id': '1','answer': 'No',},
                        {'question_id': '2','answer': 'Yes',},
                        {'question_id': '3','answer': '7',}
                    ]
                },
            ],
            'event_extra_question': '',
            'special_request': '',
            'force_issued': '0',
       },
       success: function(msg) {
        console.log(msg);
        if(msg.result.error_code == 0){
            path = 'http://192.168.50.241:8000/';
//            path = 'http://192.168.0.11:8000/';
            window.location.href = path + "event/booking/" + msg.result.response.order_number;
        }else{
            alert(msg.result.error_msg);
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

function event_issued(val){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/event",
       headers:{
            'action': 'issued',
       },
       data: {
            'order_number': val,
//            'seq_id': payment_acq2[payment_method][selected].seq_id,
//            'member': payment_acq2[payment_method][selected].method,
//            'signature': signature,
//            'voucher_code': voucher_code
       },
       success: function(msg) {
        if(msg.result.error_code == 0){
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

function add_option(val){
    var obj = 'option_qty_' + val;
    var new_int = parseInt(document.getElementById(obj).value) + 1;
    document.getElementById(obj).value = new_int;
    if (new_int < 9){
        document.getElementById('left-minus-event-'+val).disabled = false;
    }else{
        document.getElementById('right-plus-event-'+val).disabled = true;
    }
    render_object(val, new_int);
}
function reduce_option(val){
    var obj = 'option_qty_' + val;
    var new_int = parseInt(document.getElementById(obj).value) - 1;
    document.getElementById(obj).value = new_int;
    if (new_int > 0){
        document.getElementById('right-plus-event-'+val).disabled = false;
    }else{
        document.getElementById('left-minus-event-'+val).disabled = true;
    }
    render_object(val, new_int);
}

function gotoForm(){
    document.getElementById('hotel_searchForm').submit();
}