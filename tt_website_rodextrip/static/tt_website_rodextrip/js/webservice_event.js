var hotel_data = '';
var hotel_data_filter = '';
var hotel_price = '';
var price_pick = '';
var price_start = [];
var option_ids_length = 0;
var event_search_result = [];
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

function get_event_config(type){
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
        data_event = msg.result.response;
        if(type == 'search'){
            for(i in data_event.category){
                var node = document.createElement("div");
                carrier_code_airline_checkbox = '';
                carrier_code_airline_checkbox += `
                <div class="checkbox-inline1">
                    <label class="check_box_custom">`;

                carrier_code_airline_checkbox +=`
                    <span class="span-search-ticket" style="color:black;">`+data_event.category[i].category_name.slice(0,26)+`</span>`;

                carrier_code_airline_checkbox +=`<input type="checkbox" id="checkbox_event_`+ i +`" onclick="change_filter('category',`+i+`)"/>
                        <span class="check_box_span_custom"></span>
                        </label><br/>
                    </div>`;
                node.innerHTML = carrier_code_airline_checkbox;
                // tak buang ngotori logger
                // console.log(node);
                document.getElementById("filter").appendChild(node);
            }
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

function event_search_autocomplete(term){
    term = term.toLowerCase();
    var choices = data_event;
    var suggestions = [];
    var priority = [];
    if(term.split(' - ').length == 2)
        term = '';
    for(i in choices){
        for(j in choices[i]){
            if(i == 'event'){
                if(choices[i][j].name.toLowerCase().split(' - ')[0].search(term) !== -1){
                    choices[i][j].type = 'event'
                    priority.push(choices[i][j]);
                }
            }else if(i == 'category'){
                if(choices[i][j].category_name.toLowerCase().split(' - ')[0].search(term) !== -1){
                    choices[i][j].type = 'category'
                    choices[i][j].name = choices[i][j].category_name
                    suggestions.push(choices[i][j]);
                }
            }
        }
    }
    return priority.concat(suggestions).slice(0,100);
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
                        <hr/>
                   `;
                   text+=`<div class="row">`;
                   //Gambar event di booking
                   text+=`<div class="col-lg-12"></div>`;
                   text+=`<div class="col-lg-4 col-md-4 col-sm-6">`;
                   if(msg.result.response.event_name != false)
                        text+=`<span class="carrier_code_template">Event Name: </span><br/>`;
                   text+=`</div>`;

                   text+=`<div class="col-lg-8 col-md-8 col-sm-6" style="margin-bottom:5px;">`;
                   if(msg.result.response.event_name != false)
                        text+=`<span>`+msg.result.response.event_name+`</span><br/>`;
                   text+=`</div>`;

                   text+=`<div class="col-lg-4 col-md-4 col-sm-6">`;
                   if(msg.result.response.event_location != false)
                        text+=`<span class="carrier_code_template">Location: </span>`;
                   text+=`</div>`;

                   text+=`<div class="col-lg-8 col-md-8 col-sm-6" style="margin-bottom:5px;">`;
                       if(msg.result.response.event_location != false)
                           for (loc_obj in msg.result.response.event_location)
                               text+=`<span><i class="fas fa-map-marker-alt" style="color:`+color+`;"></i> `+msg.result.response.event_location[loc_obj].name+`, `+msg.result.response.event_location[loc_obj].address+`, `+msg.result.response.event_location[loc_obj].city+`</span><br/>`;
                   text+=`</div>`;

                   text+=`<div class="col-lg-4 col-md-4 col-sm-6">`;
                   if(msg.result.response.event_location != false)
                        text+=`<span class="carrier_code_template">Event Detail: </span>`;
                   text+=`</div>`;

                   text+=`<div class="col-lg-8 col-md-8 col-sm-6" style="margin-bottom:5px;">`;
                       if(msg.result.response.description != false)
                           text+=`<span style="font-size:13px !important;">`+msg.result.response.description+`</span><br/>`;
                       else
                           text+=`<span>-</span><br/>`;
                   text+=`</div>`;
               document.getElementById('event_booking').innerHTML = text;
            //======================= Button Issued ==================
            if(msg.result.response.status == 'booked'){
               check_payment_payment_method(msg.result.response.order_number, 'Issued', '', 'billing', 'event', signature, {});
               $(".issued_booking_btn").show();
            }
            else if(msg.result.response.status == 'issued'){
                document.getElementById('issued-breadcrumb').classList.add("br-active");
                document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-active");
                document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-check"></i>`;
                document.getElementById('show_title_event').hidden = true;
                document.getElementById('display_state').innerHTML = `Your Order Has Been Issued`;

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
                        //console.log(msg.result.response.options);
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
               }else{
                    event_search();
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
function event_search(){
    $.ajax({
       type: "POST",
       url: "/webservice/event",
       headers:{
            'action': 'search',
       },
       data: {
        'event_name': $('#event_name_id').val(),
        'is_online': '1',
        'category': $('#category_name').val(),
        'signature': signature
       },
       success: function(msg) {
           console.log('Result');
           console.log(msg);
           try{
                if(msg.result.error_code==0){
                    event_search_result = msg.result.response;
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
}

function event_search_vendor(){
    $.ajax({
       type: "POST",
       url: "/webservice/event",
       headers:{
            'action': 'search',
       },
       data: {
        'vendor': $('#vendor_id').val(),
        'signature': $('#signature').val(),
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
                alert(err);
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           console.log(textStatus);
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
            'signature': signature
       },
       success: function(msg) {
        console.log(msg);
        //show package
        text2='';
        var node2 = document.createElement("div");
        if(msg.result.response.length != 0){
            text2+=`
            <div class="row">
                <div class="col-lg-6">
                    <span style="font-size:14px; font-weight:bold;">Option - `+msg.result.response.length+` results</h6>
                </div>
                <div class="col-lg-6">
                    <label class="check_box_custom" style="float:right; margin-bottom:unset;">
                        <span class="span-search-ticket" style="color:black;">Select All to Copy</span>
                        <input type="checkbox" id="check_all_copy" onchange="check_all_result();"/>
                        <span class="check_box_span_custom"></span>
                    </label>
                </div>
            </div>`;
            node2.className = 'sorting-box';
            node2.innerHTML = text2;
            document.getElementById("select_copy_all").appendChild(node2);
            node2 = document.createElement("div");
        }


        text='';
        var node = document.createElement("div");
        console.log(msg.result.response)
        if(msg.result.response.length != 0){
            for(i in msg.result.response){
                if(parseInt(msg.result.response[i].qty_available) >= 1){
                    option_ids_length = option_ids_length+1;
                }
            }
            for(i in msg.result.response){
                text = '<div class="row">';
                    if(parseInt(msg.result.response[i].qty_available) >= 1){
                        text += `
                        <div class="col-lg-12" style="padding:0px;">
                            <div style="background: `+color+`; padding:10px; border-top-left-radius:7px; border-top-right-radius:7px;">
                                <span class="option_name" id="option_name_`+i+`" style="font-weight: bold; color:`+text_color+`; font-size:16px; padding-right:5px; text-transform: capitalize;"> `+ msg.result.response[i].grade + `</span>`;
                                if(parseInt(msg.result.response[i].qty_available) <= 5 && parseInt(msg.result.response[i].qty_available) >= 1){
                                    text+=`<span style="border:2px solid `+text_color+`; padding:0px 7px; color: `+color+`; background: `+text_color+`; border-radius:7px;">`+ msg.result.response[i].qty_available +` ticket left</span>`;
                                }
                                text+=`
                                <br/>
                                <div style="top:10px; right:10px; position:absolute;">
                                    <label class="check_box_custom">
                                        <span class="span-search-ticket"></span>
                                        <input type="checkbox" class="copy_result" name="copy_result`+i+`" id="copy_result`+i+`" onchange="checkboxCopyBox(`+i+`, `+option_ids_length+`);"/>
                                        <span class="check_box_span_custom" style="border:1px solid #cdcdcd;"></span>
                                    </label>
                                    <span class="id_copy_result" hidden>`+i+`</span>
                                </div>
                            </div>
                        </div>`;
                        console.log(msg.result);
                        if(msg.result.response[i].images.length != 0)
                            text+=`<div class="col-lg-3 col-md-3 border-event"><div class="img-event-detail" style="background-size:contain; background-repeat: no-repeat; background-image: url('`+msg.result.response[i].images[0].url+`');"></div></div>`;
                        else
                            text+=`<div class="col-lg-3 col-md-3 border-event"><div class="img-event-detail" style="background-size:contain; background-repeat: no-repeat; background-image: url('/static/tt_website_rodextrip/images/no pic/no-ticket.png');"></div></div>`;

                        text+=`<div class="col-lg-9 col-md-9">
                        <div class="row" style="padding:10px 0px;">
                            <div class="col-lg-12" style="margin-bottom:5px;">`;
                                if(msg.result.response[i].description != false)
                                    text+=`<span class="option_description">` + msg.result.response[i].description + `</span>`;
                                else
                                    text+=`<span class="option_description">Description not Available</span>`;
                            text+=`
                            </div>`;

                            text+=`<div class="col-lg-12">`;
                            for (j in msg.result.response[i].timeslot){
                                text+=`<div class="row option_row`+i+`">`;
                                if(msg.result.response[i].timeslot[j].start_date != ""){
                                    text+=`<div class="col-lg-6">
                                        <i class="fas fa-calendar-alt" style="color:{{color}};"></i><span style="font-size:14px;" class="option_date`+i+``+j+`" > ` + msg.result.response[i].timeslot[j].start_date + `</span>
                                    </div>`;
                                }

                                if(msg.result.response[i].timeslot[j].start_hour +`- `+ msg.result.response[i].timeslot[j].end_hour != ""){
                                    text+=`
                                    <div class="col-lg-6">
                                        <i class="fas fa-clock" style="color:{{color}};"></i><span style="font-size:14px;" class="option_time`+i+``+j+`"> ` +  msg.result.response[i].timeslot[j].start_hour +` - `+ msg.result.response[i].timeslot[j].end_hour + `</span>
                                    </div>`;
                                }
                                text+=`</div>`;
                            }
                            text+=`</div>`;

                            text+=`<div class="col-lg-12"><hr/></div>
                            <div class="col-lg-6 col-md-6">
                                <span style="font-weight:500; color: `+color+`;">Expired Date<br/> <span class="option_expired">`+ msg.result.response[i].ticket_sale_end_day +` - `+ msg.result.response[i].ticket_sale_end_hour +`</span></span>
                            </div>
                        <div class="col-lg-6 col-md-6" style="padding-top:5px;">
                            <div style="float:right; display:flex;">
                                <input id="option_max_qty_`+i+`" type="hidden" value="`+msg.result.response[i].qty_available+`"/>
                                <input id="option_currency_`+i+`" type="hidden" value="`+msg.result.response[i].currency+`"/>
                                <input id="option_price_`+i+`" type="hidden" value="`+msg.result.response[i].price+`"/>
                                <input id="option_commission_`+i+`" type="hidden" value="`+msg.result.response[i].commission+`"/>`;
                                price_start.push(msg.result.response[i].price);
                                if(msg.result.response[i].currency != 'IDR')
                                    text+= '<span class="option_price" style="font-weight: bold; font-size:15px; padding-right:10px; padding-top:5px;"> '+ msg.result.response[i].currency + ' ' + parseInt(msg.result.response[i].price) +'</span><br/>';
                                else
                                    text+= '<span class="option_price" style="font-weight: bold; font-size:15px; padding-right:10px; padding-top:5px;"> '+ msg.result.response[i].currency + ' ' + getrupiah(parseInt(msg.result.response[i].price))+'</span><br/>';
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
                    }

                    else{
                        text += `
                        <div class="col-lg-12" style="padding:0px;">
                            <div style="background: gray; padding:10px; border-top-left-radius:7px; border-top-right-radius:7px;">
                                <span id="option_name_`+i+`" style="font-weight: bold; color:`+text_color+`; font-size:16px;"> `+ msg.result.response[i].grade + `</span>
                                <span style="border:2px solid `+text_color+`; padding:0px 7px; color: `+text_color+`; background: `+color+`; border-radius:7px;">SOLD OUT</span>
                            </div>
                        </div>`;
                        console.log(msg.result);
                        if(msg.result.response[i].images.length != 0)
                            text+=`<div class="col-lg-3 col-md-3 border-event-sold" style="padding-top:20px;"><div class="img-event-detail" style="background-image: url(`+msg.result.response[i].images[0].url+`);"><div class="overlay overlay-bg-sold"></div></div><hr/></div>`;
                        else
                            text+=`<div class="col-lg-3 col-md-3 border-event-sold" style="padding-top:20px;"><div class="img-event-detail" style="background-image: url('/static/tt_website_rodextrip/images/no pic/no-ticket.png');"><div class="overlay overlay-bg-sold"></div></div></div>`;

                        text+=`<div class="col-lg-9 col-md-9">
                        <div class="overlay overlay-bg-sold"></div>
                        <div class="row">
                            <div class="col-lg-12" style="margin-top:10px; margin-bottom:5px;">`;
                            if(msg.result.response[i].description != false)
                                text+=`<span style="color: #6e6e6e;">` + msg.result.response[i].description + `</span>`;
                            else
                                text+=`<span>Description not Available</span>`;
                            text+=`
                            </div>`;

                            for (j in msg.result.response[i].timeslot){
                                if(msg.result.response[i].timeslot[j].start_date != ""){
                                    text+=`<div class="col-lg-6">
                                        <span style="color: #6e6e6e; font-size:14px;"><i class="fas fa-calendar-alt" style="color:{{color}};"></i> ` + msg.result.response[i].timeslot[j].start_date + `</span>
                                    </div>`;
                                }

                                if(msg.result.response[i].timeslot[j].start_hour +`- `+ msg.result.response[i].timeslot[j].end_hour != ""){
                                    text+=`<div class="col-lg-6">
                                        <span style="color: #6e6e6e; font-size:14px;"><i class="fas fa-clock" style="color:{{color}};"></i> ` +  msg.result.response[i].timeslot[j].start_hour +`- `+ msg.result.response[i].timeslot[j].end_hour + `</span>
                                    </div>`;
                                }
                            }

                            text+=`<div class="col-lg-12"><hr/></div>
                            <div class="col-lg-6 col-md-6" style="margin-bottom:10px;">
                                <span style="font-weight:500; color: #6e6e6e;">Expired Date<br/> `+ msg.result.response[i].ticket_sale_end_day +` - `+ msg.result.response[i].ticket_sale_end_hour +`</span>
                            </div>
                        <div class="col-lg-6 col-md-6" style="margin-bottom:10px; padding-top:5px;">
                            <div style="float:right; display:flex;">
                                <input id="option_currency_`+i+`" type="hidden" value="`+msg.result.response[i].currency+`"/>
                                <input id="option_price_`+i+`" type="hidden" value="`+msg.result.response[i].price+`"/>
                                <input id="option_commission_`+i+`" type="hidden" value="`+msg.result.response[i].commission+`"/>`;
                                price_start.push(msg.result.response[i].price);
                                text+=`<span style="font-weight: bold; font-size:15px; padding-right:10px; padding-top:5px; color:`+color+`"> SOLD OUT </span><br/>`;
                            text+=`
                            </div>
                        </div>`;

                        //text+='<button class="primary-btn-custom" type="button" onclick="hotel_room_pick(`'+msg.result.response[i].option_id+'`);" id="button'+msg.result.response[i].option_id+'">Choose</button>';
                        text+='</div></div>';
                        node.className = 'detail-event-box-sold';
                    }

                    node.innerHTML = text;
                    document.getElementById("detail_room_pick").appendChild(node);
                    node = document.createElement("div");
                    $('#loading-detail-event').hide();
                }
                price_start.sort(function(a, b){return a - b});
                document.getElementById("price_start_event").textContent = msg.result.response[0].currency+" "+getrupiah(parseInt(price_start[0]));

                hotel_price = msg.result.prices;


            }else{
                alert("There's no option found for this event, Please Try again");
                $('#loading-detail-event').hide();
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
          "provider": provider,
          'signature': signature
       },
       success: function(msg) {
        //console.log(option_code);
        console.log(msg);
        if(msg.result.error_code == 0){
            text='';
            var node = document.createElement("div");
            console.log(option_code);

            if(msg.result.response.length != 0){
                for(j in option_code){
                    var k = 0;
                    while(k < parseInt(option_code[j].qty)){
                        var co_ticket_idx = parseInt(k)+1;
                        text+=`
                        <div class="col-lg-12">`;

                        if(j == 0 && k == 0){
                            text+=`<div class="passenger_div" onclick="show_question_event('question', `+j+`, `+k+`)";>`;
                        }else{
                            text+=`<div class="passenger_div" style="margin-top:15px;" onclick="show_question_event('question', `+j+`, `+k+`)";>`;
                        }
                            text+=`
                                <div class="row">
                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                                        <span style="color:`+text_color+`; text-align:center; font-size:15px;"> `+option_code[j].name+` - `+co_ticket_idx+`</span>
                                    </div>
                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">`;

                                    if(j == 0 && k == 0){
                                        text+=`
                                            <span style="color:`+text_color+`; text-align:right; margin-right:5px; display:block;" id="question_down_opt`+j+``+k+`"><i class="fas fa-minus" style="font-size:14px;"></i></span>
                                            <span style="color:`+text_color+`; text-align:right; margin-right:5px; display:none;" id="question_up_opt`+j+``+k+`"><i class="fas fa-plus" style="font-size:14px;"></i></span>`;
                                    }else{
                                        text+=`
                                            <span style="color:`+text_color+`; text-align:right; margin-right:5px; display:none;" id="question_down_opt`+j+``+k+`"><i class="fas fa-minus" style="font-size:14px;"></i></span>
                                            <span style="color:`+text_color+`; text-align:right; margin-right:5px; display:block;" id="question_up_opt`+j+``+k+`"><i class="fas fa-plus" style="font-size:14px;"></i></span>`;
                                    }
                                    text+=`
                                    </div>
                                </div>
                            </div>
                        </div>`;
                        if(j == 0 && k == 0){
                            text+=`<div class="col-lg-12" style="display:block;" id="question_opt`+j+``+k+`">`;
                        }else{
                            text+=`<div class="col-lg-12" style="display:none;" id="question_opt`+j+``+k+`">`;
                        }
                        text+=`
                            <div style="background-color:white; padding:10px; border:1px solid `+color+`;">
                                <div class="row">`;
                        for(i in msg.result.response){
                            var co_index = (parseInt(i))+1;
                            if(msg.result.response[i].type == 'boolean' || msg.result.response[i].type == 'checkbox'){
                                text+=`<div class="col-lg-12" style="margin-bottom:15px;"><h6>`;
                            }else{
                                text+=`<div class="col-lg-12"><h6>`;
                            }
                            if (msg.result.response[i].required){
                                text+=`<span style="color:red; font-size:16px;"> *</span>`;
                            }
                            text += 'Question #' + parseInt(co_index) + '</h6>';
                            text += '<i>' + msg.result.response[i].question + '</i>';
                            text += '<input id="que_' + j + '_' + k + '_' + i + '" name="que_' + j + '_' + k + '_' + i + '" type="text" value="' + msg.result.response[i].question + '" hidden/>';
                            if(msg.result.response[i].type == 'text'){
                                text += '<input class="form-control" id="question_event_' + j + '_' + k + '_' + i + '" name="question_event_' + j + '_' + k + '_' + i + '" type="text" placeholder="Enter Your Answer"';
                                if (msg.result.response[i].required)
                                    text += 'required';
                                text += '/>';
                            }else if(msg.result.response[i].type == 'password'){
                                text += '<input class="form-control" id="question_event_' + j + '_' + k + '_' + i + '"name="question_event_' + j + '_' + k + '_' + i + '" type="password" placeholder="Enter Your Password"';
                                if (msg.result.response[i].required)
                                    text += 'required';
                                text += '/>';
                            }else if(msg.result.response[i].type == 'number'){
                                text += '<input class="form-control" id="question_event_' + j + '_' + k + '_' + i + '" name="question_event_' + j + '_' + k + '_' + i + '" type="number" placeholder="0"';
                                if (msg.result.response[i].required)
                                    text += 'required';
                                text += '/>';
                            }else if(msg.result.response[i].type == 'email'){
                                text += '<input class="form-control" id="question_event_' + j + '_' + k + '_' + i + '" name="question_event_' + j + '_' + k + '_' + i + '" type="email" placeholder="Enter Your Email"';
                                if (msg.result.response[i].required)
                                    text += 'required';
                                text += '/>';
                            }else if(msg.result.response[i].type == 'boolean'){
                                text+=`<br/>`;
                                for(ans in msg.result.response[i].answers){
                                    if(ans == "0"){
                                        text+=`
                                        <label class="radio-button-custom" style="margin-bottom:10px;">
                                            <span style="font-size:13px;">`+msg.result.response[i].answers[ans].answer+`</span>
                                            <input type="radio" checked="checked" name="question_event_`+j+`_`+k+`_`+i+`" value="`+msg.result.response[i].answers[ans].answer+`"`;
                                        if (msg.result.response[i].required)
                                            text += 'required';
                                        text+=`>
                                            <span class="checkmark-radio"></span>
                                        </label>`;
                                    }else{
                                        text+=`
                                        <label class="radio-button-custom" style="margin-bottom:0px;">
                                            <span style="font-size:13px;">`+msg.result.response[i].answers[ans].answer+`</span>
                                            <input type="radio" name="question_event_`+j+`_`+k+`_`+i+`" value="`+msg.result.response[i].answers[ans].answer+`">
                                            <span class="checkmark-radio"></span>
                                        </label>`;
                                    }
                                }
                            }else if(msg.result.response[i].type == 'selection'){
                                text+=`
                                <div class="form-group">
                                    <div class="form-select">
                                        <select id="question_event_`+j+`_`+k+`_`+i+`" name="question_event_`+j+`_`+k+`_`+i+`" class="nice-select-default">
                                            <option value="" selected>Choose</option>`;
                                            for(ans in msg.result.response[i].answers){
                                                text+=`<option value="`+msg.result.response[i].answers[ans].answer+`">`+msg.result.response[i].answers[ans].answer+`</option>`;
                                            }
                                text+=`</select/>
                                    </div>
                                </div>`;
                            }else if(msg.result.response[i].type == 'date'){
                                text += '<input class="form-control" id="question_event_' + j + '_' + k + '_' + i + '" name="question_event_' + j + '_' + k + '_' + i + '" type="email" placeholder="Enter Your Date"';
                                if (msg.result.response[i].required)
                                    text += 'required';
                                text += '/>';
                            }else if(msg.result.response[i].type == 'checkbox'){
                                text+=`<div class="row">`;
                                for(ans in msg.result.response[i].answers){
                                text+=`
                                <div class="col-lg-4 col-md-6">
                                    <div class="checkbox-inline1">
                                        <label class="check_box_custom">
                                            <span class="span-search-ticket" style="color:black;">`+msg.result.response[i].answers[ans].answer+`</span>
                                            <input type="checkbox" id="question_event_`+j+`_`+k+`_`+i+`_`+ans+`}" name="question_event_`+j+`_`+k+`_`+i+`_`+ans+`" value="`+msg.result.response[i].answers[ans].answer+`"/>
                                            <span class="check_box_span_custom"></span>
                                        </label>
                                    </div>
                                </div>`;
                                }
                                text+=`</div>`;
                            }
                            text+=`</div>`;
                        }
                        k += 1;
                        text+=`</div>
                            </div>
                        </div>`;
                    }
                    text+=`</div>`;
                }
                node.className = 'row';
                node.innerHTML = text;
                document.getElementById("extra_data_master").appendChild(node);
                for(j in option_code){
                    var k = 0;
                    while(k < parseInt(option_code[j].qty)){
                        for(i in msg.result.response){
                            if(msg.result.response[i].type == 'selection'){
                                $('#question_event_'+j+'_'+k+'_'+i).niceSelect('update');
                            }else if(msg.result.response[i].type == 'date'){
                                $('input[name="question_event_'+j+'_'+k+'_'+i+'"]').daterangepicker({
                                    singleDatePicker: true,
                                    autoUpdateInput: true,
                                    startDate: moment(),
                                    showDropdowns: true,
                                    opens: 'center',
                                    locale: {
                                        format: 'DD MMM YYYY',
                                    }
                                });
                            }
                        }
                        k += 1;
                    }
                }
            }else{
                $("#extra_question_show").hide();
            }

        }else{
            alert(msg.result.error_msg);
            $("#extra_question_show").hide();
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
            document.getElementById("provider").value = 'event';
            document.getElementById("type").value = 'hotel_review';
            document.getElementById("voucher_code").value = voucher_code;
            document.getElementById("discount").value = JSON.stringify(discount_voucher);
            document.getElementById("session_time_input").value = time_limit;
            if(val == 1)
                document.getElementById('event_issued').submit();
            else
                a = document.getElementById("session_time_input").value
                event_create_booking(val,a);
    }
    })
}

function event_create_booking(val,a){
    console.log(a);
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
            'signature': signature
       },
       success: function(msg) {
        console.log(msg);
        if(msg.result.error_code == 0){
            if(val == 0){
                if(user_login.co_agent_frontend_security.includes('b2c_limitation') == true){
                    send_url_booking('airline', btoa(msg.result.response.order_number), msg.result.response.order_number);
                    document.getElementById('order_number').value = msg.result.response.order_number;
                    document.getElementById('event_issued').submit();
                }else{
                   document.getElementById('event_booking').innerHTML+= '<input type="hidden" name="order_number" value='+msg.result.response.order_number+'>';
                   document.getElementById('event_booking').action = '/event/booking/' + btoa(msg.result.response.order_number);
                   document.getElementById('event_booking').submit();
                }
            }else if(val == 1){
                document.getElementById('order_number').value = msg.result.response.order_number;
                document.getElementById('issued').action = '/event/booking/' + btoa(msg.result.response.order_number);
                document.getElementById('issued').submit();
            }
//            path = 'http://192.168.50.241:8000/';
////            path = 'http://192.168.0.11:8000/';
//            window.location.href = path + "event/booking/" + msg.result.response.order_number;
        }else{
            alert(msg.result.error_msg);
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

function event_issued(data){
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
           url: "/webservice/event",
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
                   document.getElementById('event_booking').innerHTML = '';
                   document.getElementById('event_detail').innerHTML = '';
                   document.getElementById('payment_acq').innerHTML = '';
                   document.getElementById('show_loading_booking_airline').style.display = 'block';
                   document.getElementById('show_loading_booking_airline').hidden = false;
                   document.getElementById('payment_acq').hidden = true;
                   document.getElementById("overlay-div-box").style.display = "none";
                   $(".issued_booking_btn").remove();
                   event_get_booking(data);
               }else if(msg.result.error_code == 1009){
                   price_arr_repricing = {};
                   pax_type_repricing = [];
                   $("#waitingTransaction").modal('hide');
                   document.getElementById('show_loading_booking_airline').hidden = false;
                   document.getElementById('event_booking').innerHTML = '';
                   document.getElementById('event_detail').innerHTML = '';
                   document.getElementById('payment_acq').innerHTML = '';
                   document.getElementById('show_loading_booking_airline').style.display = 'block';
                   document.getElementById('show_loading_booking_airline').hidden = false;
                   document.getElementById('payment_acq').hidden = true;
                   document.getElementById("overlay-div-box").style.display = "none";
                   $(".issued_booking_btn").hide();
                   Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: #ff9900;">Error event issued </span>' + msg.result.error_msg,
                    }).then((result) => {
                      if (result.value) {
                        $("#waitingTransaction").modal('hide');
                      }
                    })
                    $("#waitingTransaction").modal('hide');
                    document.getElementById("overlay-div-box").style.display = "none";

                    $('.hold-seat-booking-train').prop('disabled', false);
                    $('.hold-seat-booking-train').removeClass("running");
                    event_get_booking(data);
               }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                    auto_logout();
               }else{
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: #ff9900;">Error event issued </span>' + msg.result.error_msg,
                    })
                    price_arr_repricing = {};
                    pax_type_repricing = [];
                    document.getElementById('show_loading_booking_airline').hidden = false;
                    document.getElementById('event_booking').innerHTML = '';
                    document.getElementById('event_detail').innerHTML = '';
                    document.getElementById('payment_acq').innerHTML = '';
                    document.getElementById('show_loading_booking_airline').style.display = 'block';
                    document.getElementById('show_loading_booking_airline').hidden = false;
                    document.getElementById('payment_acq').hidden = true;

                    $("#waitingTransaction").modal('hide');
                    document.getElementById("overlay-div-box").style.display = "none";

                    $('.hold-seat-booking-train').prop('disabled', false);
                    $('.hold-seat-booking-train').removeClass("running");
                    event_get_booking(data);
               }
           },
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                if(XMLHttpRequest.status == 500){
                    Swal.fire({
                      type: 'error',
                      title: 'Oops!',
                      html: '<span style="color: red;">Error Event issued </span>' + errorThrown,
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
                    event_get_booking(data);
                }
           },timeout: 300000
        });
      }
    })
}

function add_option(val){
    var obj = 'option_qty_' + val;
    var new_int = parseInt(document.getElementById(obj).value) + 1;
    var max_qty = parseInt(document.getElementById('option_max_qty_'+val).value);
    if (max_qty > 9){max_qty = 9;}

    document.getElementById(obj).value = new_int;
    if (new_int < max_qty){
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
    document.getElementById('event_searchForm').submit();
}

function update_service_charge(type){
    repricing_order_number = '';
    if(type == 'booking'){
//        upsell = []
//        for(i in train_get_detail.result.response.passengers){
//            for(j in train_get_detail.result.response.passengers[i].sale_service_charges){
//                currency = train_get_detail.result.response.passengers[i].sale_service_charges[j].FARE.currency;
//            }
//            list_price = []
//            for(j in list){
//                if(train_get_detail.result.response.passengers[i].name == document.getElementById('selection_pax'+j).value){
//                    list_price.push({
//                        'amount': list[j],
//                        'currency_code': currency
//                    });
//                }
//
//            }
//            upsell.push({
//                'sequence': train_get_detail.result.response.passengers[i].sequence,
//                'pricing': JSON.parse(JSON.stringify(list_price))
//            });
//        }
//        repricing_order_number = order_number;
    }else{
        upsell_price = 0;
        upsell = []
        counter_pax = -1;
        val = json_event_option_code
        currency = val[0]['currency'];
        for(i in val){
            list_price = []
            for(j in list){
                if(val[i].name == document.getElementById('selection_pax'+j).value){
                    list_price.push({
                        'amount': list[j],
                        'currency_code': currency
                    });
                    upsell_price += list[j];
                }
            }
            counter_pax++;
            if(list_price.length != 0)
                upsell.push({
                    'sequence': counter_pax,
                    'pricing': JSON.parse(JSON.stringify(list_price))
                });
        }
    }
    $.ajax({
       type: "POST",
       url: "/webservice/event",
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
                if(type == 'booking'){
                    price_arr_repricing = {};
                    pax_type_repricing = [];
                    train_get_booking(repricing_order_number);
                }else{
                    price_arr_repricing = {};
                    pax_type_repricing = [];
                    render_object_from_value(val);
                }

                $('#myModalRepricing').modal('hide');
           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
           }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error airline service charge </span>' + msg.result.error_msg,
                })
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status == 500){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error airline service charge </span>' + errorThrown,
                })
            }
       },timeout: 480000
    });
}

function checkboxCopy(){
    var count_copy = $(".copy_result:checked").length;
    document.getElementById("badge-copy-notif").innerHTML = count_copy;
    //document.getElementById("badge-copy-notif2").innerHTML = count_copy;
}

function checkboxCopyBox(id, co_hotel){
    if(document.getElementById('copy_result'+id).checked) {
        var copycount = $(".copy_result:checked").length;
        if(copycount == co_hotel){
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
        $('#choose-option-copy').hide();
    }
   }else {
    var checkboxes = document.getElementsByClassName("copy_result");
    for(var i=0, n=checkboxes.length;i<n;i++) {
        checkboxes[i].checked = false;
        $('#choose-option-copy').show();
    }
   }
   checkboxCopy();
}

function copy_data2(){
    console.log('Oi');
    var obj_name = document.getElementById('product_title').innerHTML;
    var value_idx = [];
    var value_loc = [];
    $("#option_search_params .copy_span").each(function(obj) {
        if($(this).hasClass( "loc_address" )){
            value_loc.push( $(this).text() )
        }else{
            value_idx.push( $(this).text() );
        }
    })
    obj_name += '\n';
    obj_name += 'Date: '+value_idx[1]+'\n';
    obj_name += 'Time: '+value_idx[2]+'\n';
    obj_name += 'Address: ';
    if(value_loc.length > 1){
        obj_name += '\n';
    }
    for (i = 0; i < value_loc.length; i++) {
        obj_name += value_loc[i]+'\n';
    }

    var obj_body = 'Price:\n'
    var counter = 0;
    $("#event_detail_table div.row span").each(function(obj) {
        if ($(this).text() != 'Grand Total' && counter != 'x'){
            if (counter % 3 == 2){
                obj_body += '\n';
            } else {
                obj_body += $(this).text() + ' ';
            }
            counter += 1
        } else {
            counter = 'x';
        }
    })
    obj_body += '\n';
    obj_body += 'Grand Total: '+ document.getElementById('option_detail_grand_total').innerHTML +'\n';

    $text_print = '';
    $text_print = obj_name + '\n' + obj_body +'===Price may change at any time===';

    document.getElementById('data_copy2').innerHTML = $text_print;
    document.getElementById('data_copy2').hidden = false;
    var el = document.getElementById('data_copy2');
    el.select();
    document.execCommand('copy');
    document.getElementById('data_copy2').hidden = true;

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

function get_checked_copy_result(){
        document.getElementById("show-list-copy-option").innerHTML = '';

        $text= '';
        text='';
        //$text='Search: '+value_idx[0]+'\n'+value_idx[1].trim()+'\nDate: '+value_idx[2]+'\n'+value_idx[3]+'\n\n';
        var option_number = 0;
        node = document.createElement("div");
        text+=`<div class="col-lg-12" style="min-height=200px; max-height:500px; overflow-y: scroll;">`;

        var value_idx = [];
        var value_loc = [];
        $("#option_search_params .copy_span").each(function(obj) {
            if($(this).hasClass( "loc_address" )){
                value_loc.push( $(this).text() )
            }else{
                value_idx.push( $(this).text() );
            }
        })

        text='';
        //$text='Search: '+value_idx[0]+'\n'+value_idx[1].trim()+'\nDate: '+value_idx[2]+'\n'+value_idx[3]+'\n\n';
        $text = value_idx[0]+'\n';
        $text += 'Date: '+value_idx[1]+'\n';
        $text += 'Time: '+value_idx[2]+'\n';

        text+=`<h5>`+value_idx[0]+`</h5>`;
        text+=`<span>Date: `+value_idx[1]+`</span><br/>`;
        text+=`<span>Time: `+value_idx[2]+`</span><br/>`;
        text+=`<span>Address: `;

        $text += 'Address: ';
        if(value_loc.length > 1){
            $text += '\n';
            text+=`<br/>`;
        }
        for (i = 0; i < value_loc.length; i++) {
          $text += value_loc[i]+'\n';
          text+= value_loc[i]+'<br/>';
        }
        $text += '\n';
        text+=`</span><br/>`;

        $(".copy_result:checked").each(function(obj) {
            var parent_option = $(this).parent().parent().parent().parent().parent();
            var name_option = parent_option.find('.option_name').html();
            var description_option = parent_option.find('.option_description').html();
            var id_event = parent_option.find('.id_copy_result').html();
            option_number = option_number + 1;
            $text += ''+option_number+'. '+name_option+'\n';
            $text += 'Description: '+description_option+'\n';

            var cek_row = 0;
            text+=`
            <div class="row" id="div_list`+id_event+`">
                <div class="col-lg-8">
                    <h6>`+option_number+`. `+name_option+`</h6>
                    <span>Description: `+description_option+`</span><br/>`;

            $(".option_row"+id_event).each(function(obj) {
                var date_option = parent_option.find('.option_date'+id_event+cek_row).html();
                var time_option = parent_option.find('.option_time'+id_event+cek_row).html();
                $text += 'Date: ';
                text += `<span>Date: `;
                if(date_option != undefined){
                    $text += date_option;
                    text += date_option;
                }
                if(time_option != undefined){
                    $text += time_option+'\n';
                    text += ' '+time_option;
                }
                text += `</span><br/>`;
                cek_row = cek_row+1;
            })

            var expired_option = parent_option.find('.option_expired').html();
            var price_option = parent_option.find('.option_price').html();
            $text += 'Expired: ' + expired_option+ '\n';
            $text += 'Price: ' + price_option+ '\n \n';

            text+=`
                    <span>Expired: `+expired_option+`</span><br/>
                    <span style="font-weight:500;">Price: `+price_option+`</span>
                </div>
                <div class="col-lg-4" style="text-align:right;">
                    <span style="font-weight:500; cursor:pointer;" onclick="delete_checked_copy_result(`+id_event+`);">Delete <i class="fas fa-times-circle" style="color:red; font-size:18px;"></i></span>
                </div>
                <div class="col-lg-12"><hr/></div>
            </div>`;
            });
        $text += '\n===Price may change at any time===';
        text+=`</div>
        <div class="row">
            <div class="col-lg-12" style="margin-bottom:15px;" id="share_result">
                <span style="font-size:14px; font-weight:bold;">Share This on:</span><br/>`;
                share_data();
                var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                if (isMobile) {
                    text+=`
                        <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png"/></a>`;
                    if(option_number < 11){
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
                        <a href="mailto:?subject=This is the event price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png"/></a>`;
                } else {
                    text+=`
                        <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png"/></a>`;
                    if(option_number < 11){
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
                        <a href="mailto:?subject=This is the event price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png"/></a>`;
                }
                if(option_number > 10){
                    text+=`<br/><span style="color:red;">Nb: Share on Line and Telegram Max 10 Hotel</span>`;
                }
            text+=`
            </div>
            <div class="col-lg-12" id="copy_result">
                <input class="primary-btn" style="width:100%;" type="button" onclick="copy_data();" value="Copy">
            </div>
        </div>`;
        node.innerHTML = text;
        document.getElementById("show-list-copy-option").appendChild(node);

        if(option_number > 10){
            document.getElementById("mobile_line").style.display = "none";
            document.getElementById("mobile_telegram").style.cursor = "not-allowed";
            document.getElementById("pc_line").style.display = "not-allowe";
            document.getElementById("pc_telegram").style.cursor = "not-allowed";
        }

        var count_copy = $(".copy_result:checked").length;
        if (count_copy == 0){
            $('#choose-option-copy').show();
            $("#share_result").remove();
            $("#copy_result").remove();
            $("#show-list-copy-option").hide();
            $text = '';
            $text_share = '';
        }
        else{
            $('#choose-option-copy').hide();
            $("#show-list-copy-option").show();
        }
    }

function delete_checked_copy_result(id){
    $("#div_list"+id).remove();
    $("#copy_result"+id).prop("checked", false);
    checkboxCopyBox(id, option_ids_length)
    var count_copy = $(".copy_result:checked").length;
    if (count_copy == 0){
        $('#choose-option-copy').show();
        $("#share_result").remove();
        $("#copy_result").remove();
        $("#show-list-copy-option").hide();
        $text = '';
        $text_share = '';
    }
    else{
        $('#choose-option-copy').hide();
        $("#show-list-copy-option").show();
        get_checked_copy_result();
        share_data();
    }
    checkboxCopy();
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

function copy_data(){
    try{
        get_checked_copy_result();
    }catch(err){}
    document.getElementById('data_copy').innerHTML = $text;
    document.getElementById('data_copy').hidden = false;
    var el = document.getElementById('data_copy');
    el.select();
    document.execCommand('copy');
    document.getElementById('data_copy').hidden = true;

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
