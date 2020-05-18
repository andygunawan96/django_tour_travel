var hotel_data = '';
var hotel_data_filter = '';
var hotel_price = '';
var price_pick = '';
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
            'action': 'get_data',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {},
       success: function(msg) {
        console.log(msg);
        hotel_config = msg
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
            console.log(msg);
            document.getElementById('show_loading_booking_airline').hidden = true;
            try{
                if(msg.result.error_code == 0){
                    hotel_get_detail = msg;
                    $text = '';
                    $text += 'Order Number: '+ msg.result.response.booking_name + '\n';
                    $text += msg.result.response.status + '\n';
                    text = `
                        <h6 class="carrier_code_template">Order Number : </h6><h6>`+msg.result.response.booking_name+`</h6><br/>
                        <table style="width:100%;">
                            <tr>
                                <th class="carrier_code_template">Booking Code</th>
                                <th class="carrier_code_template">Status</th>
                            </tr>`;
                            for(i in msg.result.response.hotel_rooms){
                                text+=`
                                    <tr>`;
                                if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false || msg.result.response.status == 'issued')
                                    text+=`
                                        <td>`+msg.result.response.hotel_rooms[i].prov_issued_code+`</td>`;
                                else
                                    text+= `<td> - </td>`;
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
                                if(msg.result.response.hotel_name != false)
                                    text+=`<span class="carrier_code_template">Hotel Name: </span><br/>`;
                                if(msg.result.response.hotel_address != false)
                                    text+=`<span class="carrier_code_template">Hotel Address: </span><br/>`;
                                if(msg.result.response.hotel_phone != false)
                                    text+=`<span class="carrier_code_template">Hotel Phone: </span><br/>`;
                    text+=`</div>
                            <div class="col-sm-6" style='text-align:right'>`;
                                if(msg.result.response.hotel_name != false)
                                    text+=`<span>`+msg.result.response.hotel_name+`</span><br/>`;
                                if(msg.result.response.hotel_address != false)
                                    text+=`<span>`+msg.result.response.hotel_address+`</span><br/>`;
                                if(msg.result.response.hotel_phone != false)
                                    text+=`<span>`+msg.result.response.hotel_phone+`</span><br/>`;
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
                   document.getElementById('hotel_booking').innerHTML = text;
                   if(msg.result.response.status == 'booked'){
                       check_payment_payment_method(msg.result.response.booking_name, 'Issued', '', 'billing', 'hotel', signature, {});
                       $(".issued_booking_btn").show();
                   }
                   text = `
                        <h4>List of Room(s)</h4>
                        <hr/>
                        <table style="width:100%;" id="list-of-passenger">
                            <tr>
                                <th class="">No</th>
                                <th class="">Date</th>
                                <th class="">Name</th>
                                <th class="">Room(s)</th>
                                <th class="">Person</th>
                                <th class="">Rate</th>
                                <th class="">Meal Type</th>
                            </tr>`;
                        for(i in msg.result.response.hotel_rooms){
                        text+=`
                            <tr>
                                <td>`+parseInt(i+1)+`</td>
                                <td>`+msg.result.response.hotel_rooms[i].date+`</td>
                                <td>`+msg.result.response.hotel_rooms[i].room_name;
                                 if(msg.result.response.hotel_rooms[i].room_type != '')
                                    text+=`(`+msg.result.response.hotel_rooms[i].room_type+`)`;
                         text+=`</td>
                                <td>1</td>
                                <td>`+msg.result.response.hotel_rooms[i].person+` Adult</td>
                                <td>`+msg.result.response.hotel_rooms[i].currency+` `+getrupiah(msg.result.response.hotel_rooms[i].room_rate)+`</td>
                                <td>`;
                                if(msg.result.response.hotel_rooms[i].meal_type != false)
                                    text+=msg.result.response.hotel_rooms[i].meal_type;
                                else
                                    text+= '-';
                                text+=`</td>
                            </tr>`;
                        }
                        text+=`</table>`;
                   document.getElementById('hotel_list_room').innerHTML = text;
                   text=`
                        <h5>List of Guest(s)</h5>
                        <hr/>
                        <table style="width:100%;" id="list-of-passenger">
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
                   document.getElementById('hotel_passenger').innerHTML = text;
                    if(msg.result.response.status == 'issued'){
                    document.getElementById('issued-breadcrumb').classList.add("br-active");
                    document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-active");
                    document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-check"></i>`;

                    text=`<div class="col-sm-4">
                                <!--<a href="#" id="seat-map-link" class="hold-seat-booking-train ld-ext-right" style="color:`+text_color+`;">
                                    <input type="button" id="button-choose-print" class="primary-btn" style="width:100%;" value="Print Ticket" onclick="get_printout('`+msg.result.response.booking_name+`', 'ticket','hotel');"/>
                                    <div class="ld ld-ring ld-cycle"></div>
                                </a>-->
                           </div>`;
                    text+=`
                        <div class="col-sm-4">
                        </div>
                        <div class="col-sm-4">
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
                                                <input type="button" class="primary-btn" id="button-issued-print" style="width:30%;" value="Submit" onclick="get_printout('`+msg.result.response.booking_name+`', 'invoice','hotel');"/>
                                            </div>
                                        </div>
                                        <div class="modal-footer">
                                          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`;
                    }
                    document.getElementById('hotel_btn_printout').innerHTML = text;
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
                    for(i in msg.result.response.hotel_rooms){
                        try{
                            if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false || msg.result.response.status == 'issued')
                                text_detail+=`
                                    <div style="text-align:left">
                                        <span style="font-weight:500; font-size:14px;">PNR: `+msg.result.response.hotel_rooms[i].prov_issued_code+` </span>
                                    </div>`;
                            price = {'FARE': 0, 'RAC': 0, 'ROC': 0, 'TAX':0 , 'currency': '', 'CSC': 0, 'SSR': 0, 'DISC': 0};
                            price['FARE'] = msg.result.response.hotel_rooms[i].room_rate;
                            price['currency'] = msg.result.response.hotel_rooms[i].currency;
                            price['CSC'] = 0;
                            total_price_provider = msg.result.response.hotel_rooms[i].room_rate;
                            for(j in msg.result.response.passengers){
                                pax_type_repricing.push([msg.result.response.passengers[j].title+' '+msg.result.response.passengers[j].first_name+' '+msg.result.response.passengers[j].last_name, msg.result.response.passengers[j].title+' '+msg.result.response.passengers[j].first_name+' '+msg.result.response.passengers[j].last_name]);
                                price_arr_repricing[msg.result.response.passengers[j].title+' '+msg.result.response.passengers[j].first_name+' '+msg.result.response.passengers[j].last_name] = {
                                    'Fare': (price['FARE']/msg.result.response.passengers.length) + price['SSR'] + price['DISC'],
                                    'Tax': price['TAX'] + price['ROC'],
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
                                for(j in price_arr_repricing){
                                   text_repricing += `
                                   <div class="col-lg-12">
                                        <div style="padding:5px;" class="row" id="adult">
                                            <div class="col-lg-3" id="`+i+`_`+j+`">`+j+`</div>
                                            <div class="col-lg-3" id="`+j+`_price">`+getrupiah(price_arr_repricing[j].Fare + price_arr_repricing[j].Tax)+`</div>`;
                                            if(price_arr_repricing[j].Repricing == 0)
                                            text_repricing+=`<div class="col-lg-3" id="`+j+`_repricing">-</div>`;
                                            else
                                            text_repricing+=`<div class="col-lg-3" id="`+j+`_repricing">`+getrupiah(price_arr_repricing[j].Repricing)+`</div>`;
                                            text_repricing+=`<div class="col-lg-3" id="`+j+`_total">`+getrupiah(price_arr_repricing[j].Fare + price_arr_repricing[j].Tax + price_arr_repricing[j].Repricing)+`</div>
                                        </div>
                                    </div>`;
                                }
                                text_repricing += `<div id='repricing_button' class="col-lg-12" style="text-align:center;"></div>`;
                                document.getElementById('repricing_div').innerHTML = text_repricing;
                                //repricing

                                text_detail+=`
                                <div class="row" style="margin-bottom:5px;">
                                    <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                        <span style="font-size:12px;">`+msg.result.response.hotel_rooms[i].date+`</span>`;
                                    text_detail+=`</div>
                                    <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">
                                        <span style="font-size:13px;">`+price.currency+` `+getrupiah(total_price_provider)+`</span>
                                    </div>
                                </div>`;
                                $text += msg.result.response.hotel_rooms[i].date + ' ';
                                $text += price.currency+` `+getrupiah(total_price_provider)+'\n';
                                if(counter_service_charge == 0){
                                    total_price += parseInt(price.TAX + price.ROC + price.FARE + price.CSC + price.SSR + price.DISC);
                                    price_provider += parseInt(price.TAX + price.ROC + price.FARE + price.CSC + price.SSR + price.DISC);
                                }else{
                                    total_price += parseInt(price.TAX + price.ROC + price.FARE + price.SSR + price.DISC);
                                    price_provider += parseInt(price.TAX + price.ROC + price.FARE + price.SSR + price.DISC);
                                }
                                commission += parseInt(price.RAC);

                            total_price_provider.push({
                                'pnr': msg.result.response.hotel_rooms[i].prov_issued_code,
                                'price': price_provider
                            })
                            price_provider = 0;
                            counter_service_charge++;
                        }catch(err){}
                    }
                    try{
                        $text += 'Grand Total: '+price.currency+' '+ getrupiah(total_price);
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
                        if(msg.result.response.status != 'issued')
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
                            </div>`;
                        text_detail+=`
                    </div>`;
                }catch(err){console.log(err)}
                document.getElementById('hotel_detail').innerHTML = text_detail;
                add_repricing();
                console.log($text);

    //               document.getElementById('hotel_detail').innerHTML = text;
                }else{
                    //swal
                }
            }catch(err){console.log(err)}
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
               }catch(err){}
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
              }catch(err){}
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
    document.getElementById('hotel_detail_table').innerHTML = '';
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
                <div class="col-lg-12" style="margin-bottom:25px;">
                    <div style="top:0px; right:10px; position:absolute;">
                        <label class="check_box_custom">
                            <span class="span-search-ticket"></span>
                            <input type="checkbox" id="copy_hotel"/>
                            <span class="check_box_span_custom"></span>
                        </label>
                    </div>
                </div>`;
                console.log(msg.result);
                if(msg.result.response[i].images.length != 0)
                    text+=`<div class="col-lg-3 col-md-3"><div class="img-hotel-detail" style="background-image: url(`+msg.result.response[i].images[0].url+`);"></div></div>`;
                else
                    text+=`<div class="col-lg-3 col-md-3"><div class="img-hotel-detail" style="background-image: #;"></div></div>`;

                    text+=`<div class="col-lg-3 col-md-3" style="text-align:right;">`;
                    text+= '<span style="font-weight: bold; font-size:16px;"> '+ msg.result.response[i].grade + '</span><br/>';
                    if(msg.result.response[i].currency != 'IDR')
                        text+= '<span style="font-weight: bold; font-size:16px;"> '+ msg.result.response[i].currency + ' ' + parseInt(msg.result.response[i].price) +'</span><br/>';
                    else
                        text+= '<span style="font-weight: bold; font-size:16px;"> '+ msg.result.response[i].currency + ' ' + getrupiah(parseInt(msg.result.response[i].price))+'</span><br/>';

                    text+='<button class="primary-btn-custom" type="button" onclick="hotel_room_pick(`'+msg.result.response[i].option_id+'`);" id="button'+msg.result.response[i].option_id+'">Choose</button>';
                    text+='</div></div>';
                    node.className = 'detail-hotel-box';
                    node.innerHTML = text;
                    document.getElementById("detail_room_pick").appendChild(node);
                    node = document.createElement("div");
                    $('#loading-detail-event').hide();
                }
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
        console.log(msg);
        if(msg.result.error_code == 0){
            text='';
            var node = document.createElement("div");
            for(i in msg.result.response){
                text += '<h3>Question #' + i+1 + '</h3>';
                text += '<i>' + msg.result.response[i].question + '</i>';
                text += '<input id="que_' + i +'" name="que_' + i +'" type="text" value="' + msg.result.response[i].question + '" hidden/>';
                text += '<input id="question_event_' + i +'" name="question_event_' + i +'" type="text" placeholder="' + msg.result.response[i].type + '"';
                if (msg.result.response[i].required)
                    text += 'required';
                text += '/>';
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
            path = 'http://192.168.0.11:8000/';
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

function gotoForm(){
    document.getElementById('hotel_searchForm').submit();
}