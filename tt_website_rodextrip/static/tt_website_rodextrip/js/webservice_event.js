var data_event = '';
var hotel_price = '';
var price_pick = '';
var price_start = [];
var option_ids_length = 0;
var event_search_result = [];
var extra_question_result = [];
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
        data_event = msg.result.response;
        if(type == 'home'){
            category_event_drp = '';
            category_event_drp += `<option value="all" selected>All Category</option>`;
            for(i in data_event.category){
                category_event_drp += `<option value="`+data_event.category[i].category_name+`">`+data_event.category[i].category_name+`</option>`;
            }
            document.getElementById("category_event").innerHTML = category_event_drp;
            $('#category_event').niceSelect('update');
        }
        if(type == 'search'){
            var node = document.createElement("div");
            carrier_code_airline_checkbox = '<h5>Category</h5>';
            for(i in data_event.category){
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
                document.getElementById("filter").appendChild(node);
            }

            category_event_drp = '';
            category_event_drp += `<option value="all" `;
            if(event_search_data_request.category_name == ''){
                category_event_drp += `selected`;
            }
            category_event_drp += `>All Category</option>`;
            for(i in data_event.category){
                category_event_drp += `<option value="`+data_event.category[i].category_name+`"`;
                if(event_search_data_request.category_name == data_event.category[i].category_name){
                    category_event_drp += `selected`;
                }
                category_event_drp += `>`+data_event.category[i].category_name+`</option>`;
            }
            document.getElementById("category_event").innerHTML = category_event_drp;
            $('#category_event').niceSelect('update');
        }
        if(type == 'detail'){
            category_event_drp = '';
            category_event_drp += `<option value="all" `;
            if(event_search_data_request.category_name == ''){
                category_event_drp += `selected`;
            }
            category_event_drp += `>All Category</option>`;
            for(i in data_event.category){
                category_event_drp += `<option value="`+data_event.category[i].category_name+`"`;
                if(event_search_data_request.category_name == data_event.category[i].category_name){
                    category_event_drp += `selected`;
                }
                category_event_drp += `>`+data_event.category[i].category_name+`</option>`;
            }
            document.getElementById("category_event").innerHTML = category_event_drp;
            $('#category_event').niceSelect('update');
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
    category_event_choose = document.getElementById('category_event').value;
    for(i in choices){
        for(j in choices[i]){
            if(i == 'event'){
                if(category_event_choose == 'all'){
                    if(choices[i][j].name.toLowerCase().split(' - ')[0].search(term) !== -1){
                        choices[i][j].type = 'event'
                        priority.push(choices[i][j]);
                    }
                }else{
                    //check category
                    if(choices[i][j].name.toLowerCase().split(' - ')[0].search(term) !== -1 && choices[i][j].category.includes(category_event_choose) == true){
                        choices[i][j].type = 'event'
                        priority.push(choices[i][j]);
                    }
                }
            }else if(i == 'category'){
                if(category_event_choose == 'all'){
                    if(choices[i][j].category_name.toLowerCase().split(' - ')[0].search(term) !== -1){
                        choices[i][j].type = 'category'
                        choices[i][j].name = choices[i][j].category_name
                        suggestions.push(choices[i][j]);
                    }
                }
            }
        }
    }
    return priority.concat(suggestions).slice(0,100);
}

function event_page_passenger(){
    $.ajax({
       type: "POST",
       url: "/webservice/event",
       headers:{
            'action': 'page_passenger',
       },
       data: {
            'signature': signature,
       },
       success: function(msg) {
            event_option_code = msg.event_option_code;
            event_get_extra_question(event_option_code,'event_internal');
            render_object_from_value(event_option_code);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get data lab_pintar');
       },timeout: 300000
    });
}

function event_page_review(){
    $.ajax({
       type: "POST",
       url: "/webservice/event",
       headers:{
            'action': 'page_review',
       },
       data: {
            'signature': signature,
       },
       success: function(msg) {
            adult = msg.adult;
            booker = msg.booker;

            contact = msg.contact;

            json_event_option_code = msg.event_option_code;

            json_event_answer = msg.event_extra_question;
            upsell_price_dict = msg.upsell_price_dict;
            document.getElementById('json_event_code').value = json_event_option_code;
            render_extra_question(json_event_answer);
            render_object_from_value(json_event_option_code);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error get data lab_pintar');
       },timeout: 300000
    });
}

function event_get_booking(data){
    price_arr_repricing = {};
    get_vendor_balance('false');
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
            try{
                //======================= Resv =========================
                if(msg.result.error_code == 0){
                    document.getElementById('button-home').hidden = false;
                    document.getElementById('button-new-reservation').hidden = false;
                    document.getElementById('show_loading_booking_airline').style.display = 'none';
                    hide_modal_waiting_transaction();
                    tes = moment.utc(msg.result.response.hold_date).format('YYYY-MM-DD HH:mm:ss')
                    localTime  = moment.utc(tes).toDate();

                    data_gmt = moment(msg.result.response.hold_date)._d.toString().split(' ')[5];
                    gmt = data_gmt.replace(/[^a-zA-Z+-]+/g, '');
                    timezone = data_gmt.replace (/[^\d.]/g, '');
                    timezone = timezone.split('')
                    timezone = timezone.filter(item => item !== '0')
                    msg.result.response.hold_date = moment(localTime).format('DD MMM YYYY HH:mm') + ' ' + gmt + timezone;
                    can_issued = msg.result.response.can_issued;
                    if(msg.result.response.booked_date != ''){
                        tes = moment.utc(msg.result.response.booked_date).format('YYYY-MM-DD HH:mm:ss')
                        localTime  = moment.utc(tes).toDate();
                        msg.result.response.booked_date = moment(localTime).format('DD MMM YYYY HH:mm') + ' ' + gmt + timezone;
                    }
                    if(msg.result.response.issued_date != ''){
                        tes = moment.utc(msg.result.response.issued_date).format('YYYY-MM-DD HH:mm:ss')
                        localTime  = moment.utc(tes).toDate();
                        msg.result.response.issued_date = moment(localTime).format('DD MMM YYYY HH:mm') + ' ' + gmt + timezone;
                    }
                    try{
                        if(msg.result.response.state == 'booked' || msg.result.response.state == 'issued' && msg.result.response.voucher_reference)
                            document.getElementById('voucher_div').style.display = 'block';
                        else
                            document.getElementById('voucher_div').style.display = 'none';
                    }catch(err){console.log(err);}
                    event_get_detail = msg;
                    $text = '';
                    $text += 'Order Number: '+ msg.result.response.order_number + '\n';
                    text = `
                        <h6 class="carrier_code_template">Order Number : </h6><h6>`+msg.result.response.order_number+`</h6><br/>
                        <table style="width:100%;">
                            <tr>
                                <th>Booking Code</th>`;
                                if(msg.result.response.state == 'booked')
                                    text+=`<th>Hold Date</th>`;
                            text+=`
                                <th>Status</th>
                            </tr>`;
                            for(i in msg.result.response.providers){
                                text+=`
                                    <tr>
                                        <td>`+msg.result.response.providers[i].pnr+`</td>`;

                                        if(msg.result.response.state == 'booked')
                                            text +=`
                                                <td>`+msg.result.response.hold_date+`</td>`;


                                        text+=`
                                            <td>`;
                                        if(msg.result.response.state_description == 'Expired'){
                                            text+=`<span style="background:#DC143C; color:white; padding:0px 15px; border-radius:14px;">`;
                                        }
                                        else if(msg.result.response.state_description == 'Booked'){
                                            text+=`<span style="background:#3fa1e8; color:white; padding:0px 15px; border-radius:14px;">`;
                                        }
                                        else if(msg.result.response.state_description == 'Issued'){
                                            text+=`<span style="background:#30b330; color:white; padding:0px 15px; border-radius:14px;">`;
                                        }
                                        else{
                                            text+=`<span>`;
                                        }
                                        text+=`
                                                `+msg.result.response.state_description+`
                                            </span>
                                        </td>
                                    </tr>`;
                            }
                    text+=`
                        </table>
                        <hr/>`;
                    if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false){
                        text+=`
                            <div class="row">
                                <div class="col-lg-6">
                                    <span>Agent: <b>`+msg.result.response.agent_name+`</b></span>
                                </div>`;
                        if(msg.result.response.customer_parent_name){
                            text+=`
                                <div class="col-lg-6">
                                    <span>Customer: <b>`+msg.result.response.customer_parent_type_name+` `+msg.result.response.customer_parent_name+`</b></span>
                                </div>`;
                        }
                        text+= `</div>`;
                    }
                    text+=`
                        <div class="row">
                            <div class="col-lg-6">
                                <h6>Booked</h6>
                                <span>Date: <b>`;
                                    if(msg.result.response.booked_date != ""){
                                        text+=``+msg.result.response.booked_date+``;
                                    }else{
                                        text+=`-`
                                    }
                                    text+=`</b>
                                </span>
                                <br/>
                                <span>by <b>`+msg.result.response.booked_by+`</b><span>
                            </div>

                            <div class="col-lg-6 mb-3">`;
                                if(msg.result.response.state == 'issued'){
                                    text+=`<h6>Issued</h6>
                                        <span>Date: <b>`;
                                        if(msg.result.response.issued_date != ""){
                                            text+=``+msg.result.response.issued_date+``;
                                        }else{
                                            text+=`-`
                                        }
                                    text+=`</b>
                                    </span>
                                    <br/>
                                    <span>by <b>`+msg.result.response.issued_by+`</b><span>`;
                                }
                                text+=`
                            </div>
                        </div>
                        <hr/>
                   `;
                   text+=`<div class="row">`;
                   text+=`<div class="col-lg-12"></div>`;
                   text+=`<div class="col-lg-3 col-md-4 col-sm-6">`;
                   if(msg.result.response.event_name != false)
                        text+=`<span style="font-weight:600;">Event Name: </span><br/>`;
                   text+=`</div>`;

                   text+=`<div class="col-lg-9 col-md-8 col-sm-6" style="margin-bottom:5px;">`;
                   if(msg.result.response.event_name != false)
                        text+=`<span>`+msg.result.response.event_name+`</span><br/>`;
                   text+=`</div>`;

                   text+=`<div class="col-lg-3 col-md-4 col-sm-6">`;
                   if(msg.result.response.event_location != false)
                        text+=`<span style="font-weight:600;">Location: </span>`;
                   text+=`</div>`;

                   text+=`<div class="col-lg-9 col-md-8 col-sm-6" style="margin-bottom:5px;">`;
                       if(msg.result.response.event_location != false)
                           for (loc_obj in msg.result.response.event_location)
                               text+=`<span><i class="fas fa-map-marker-alt" style="color:`+color+`;"></i> `+msg.result.response.event_location[loc_obj].name+`, `+msg.result.response.event_location[loc_obj].address+`, `+msg.result.response.event_location[loc_obj].city+`</span><br/>`;
                   text+=`</div>`;

                   text+=`<div class="col-lg-3 col-md-4 col-sm-6">`;
                   if(msg.result.response.event_location != false)
                        text+=`<span style="font-weight:600;">Event Detail: </span>`;
                   text+=`</div>`;

                   text+=`<div class="col-lg-9 col-md-8 col-sm-6" style="margin-bottom:5px;">`;
                       if(msg.result.response.description != false)
                           text+=`<span style="font-size:13px !important;">`+msg.result.response.description+`</span><br/>`;
                       else
                           text+=`<span>-</span><br/>`;
                   text+=`</div>`;
               document.getElementById('event_booking').innerHTML = text;
            //======================= Button Issued ==================
            if(msg.result.response.state == 'booked'){
               check_payment_payment_method(msg.result.response.order_number, 'Issued', msg.result.response.booker.seq_id, 'billing', 'event', signature, msg.result.response.payment_acquirer_number);
               $(".issued_booking_btn").show();
               $text += 'Status: Booked\n';
               document.getElementById('alert-state').innerHTML = `
               <div class="alert alert-success" role="alert">
                   <h5>Your booking has been successfully Booked. Please proceed to payment or review your booking again.</h5>
               </div>`;
            }
            else if(msg.result.response.state == 'issued'){
                document.getElementById('issued-breadcrumb').classList.add("br-active");
                document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-active");
                document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-check"></i>`;
                document.getElementById('show_title_event').hidden = true;
                document.getElementById('display_state').innerHTML = `Your Order Has Been Issued`;
                //document.getElementById('display_prices').style.display = "none";
                $text += 'Status: Issued\n';
                document.getElementById('alert-state').innerHTML = `
                <div class="alert alert-success" role="alert">
                    <h5>Your booking has been successfully Issued!</h5>
                </div>`;
            }else if(msg.result.response.state == 'refund'){
               //document.getElementById('issued-breadcrumb').classList.remove("current");
               //document.getElementById('issued-breadcrumb').classList.add("active");
               document.getElementById('issued-breadcrumb').classList.add("br-active");
               document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-active");
               document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-check"></i>`;
               document.getElementById('alert-state').innerHTML = `
               <div class="alert alert-dark" role="alert">
                   <h5>Your booking has been Refunded!</h5>
               </div>`;
            }
            else if(msg.result.response.state == 'cancel2'){
                $text += 'Status: Expired \n';
                document.getElementById('issued-breadcrumb').classList.remove("br-active");
                document.getElementById('issued-breadcrumb').classList.add("br-fail");
                document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
                document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-fail");
                document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
                document.getElementById('issued-breadcrumb-span').innerHTML = `Expired`;
                document.getElementById('display_state').innerHTML = `Your Order Has Been Expired`;
                document.getElementById('show_title_event').hidden = true;
                document.getElementById('alert-state').innerHTML = `
                <div class="alert alert-danger" role="alert">
                    <h5>Your booking has been Expired!</h5>
                </div>`;
            }
            else if(msg.result.response.state == 'fail_issued'){
                $text = 'Fail Issued';
                document.getElementById('issued-breadcrumb').classList.remove("br-active");
                document.getElementById('issued-breadcrumb').classList.add("br-fail");
                document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
                document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-fail");
                document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
                document.getElementById('issued-breadcrumb-span').innerHTML = `Fail Issued`;
                document.getElementById('display_state').innerHTML = `Your Order Has Been Failed`;
                document.getElementById('show_title_event').hidden = true;
                document.getElementById('alert-state').innerHTML = `
                <div class="alert alert-danger" role="alert">
                    <h5>Your booking has been Failed!</h5>
                </div>`;
            }
            else if(msg.result.response.state == 'fail_booked'){
                $text = 'Fail Booked';
                document.getElementById('issued-breadcrumb').classList.remove("br-active");
                document.getElementById('issued-breadcrumb').classList.add("br-fail");
                document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
                document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-fail");
                document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
                document.getElementById('issued-breadcrumb-span').innerHTML = `Fail Booked`;
                document.getElementById('display_state').innerHTML = `Your Order Has Been Failed`;
                document.getElementById('show_title_event').hidden = true;
                document.getElementById('alert-state').innerHTML = `
                <div class="alert alert-danger" role="alert">
                    <h5>Your booking has been Failed!</h5>
                </div>`;
            }
            else if(msg.result.response.state == 'fail_refunded'){
                $text = 'Fail Refunded';
                document.getElementById('issued-breadcrumb').classList.remove("br-active");
                document.getElementById('issued-breadcrumb').classList.add("br-fail");
                document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
                document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-fail");
                document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
                document.getElementById('issued-breadcrumb-span').innerHTML = `Fail Refunded`;
                document.getElementById('display_state').innerHTML = `Your Order Has Been Failed`;
                document.getElementById('show_title_event').hidden = true;
                document.getElementById('alert-state').innerHTML = `
                <div class="alert alert-danger" role="alert">
                    <h5>Your booking has been Failed!</h5>
                </div>`;
            }
            else if(msg.result.response.state == 'refund'){
                $text = 'Refunded';
                document.getElementById('issued-breadcrumb').classList.add("br-active");
                document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-active");
                document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-check"></i>`;
                document.getElementById('issued-breadcrumb-span').innerHTML = `Refunded`;
                document.getElementById('display_state').innerHTML = `Your Order Has Been Refunded`;
                document.getElementById('show_title_event').hidden = true;
                document.getElementById('alert-state').innerHTML = `
                <div class="alert alert-success" role="alert">
                    <h5>Your booking has been Refund!</h5>
                </div>`;
            }

            //======================= Option =========================
            text = `<h4>Ticket Information(s)</h4>
                    <hr/>
                    <div class="row">`;
                    var temp_name_option = '';
                    var temp_numb_option = 0;
                    for(i in msg.result.response.options){
                        var b = parseInt(i) + 1;
                        //console.log(msg.result.response.options);
                        if(temp_name_option != msg.result.response.options[i].option.event_option_id.grade){
                            temp_numb_option = 0;
                        }
                        temp_name_option = msg.result.response.options[i].option.event_option_id.grade;
                        temp_numb_option = temp_numb_option + 1;
                        text+=`
                            <div class="col-lg-12" style="margin-bottom:15px;">
                                <h6>`+msg.result.response.options[i].option.event_option_id.grade+` - `+ temp_numb_option +`</h6>
                                <span>Ticket Number : </span>`;
                                if(msg.result.response.options[i].option.ticket_number == false)
                                    text+=`<span>-</span>`;
                                else
                                    text+=`<span style="font-weight:500;">`+msg.result.response.options[i].option.ticket_number+`</span>`;

                            text+=`
                                <br/>
                                <span>Extra Question :
                                    <span style="padding-left:5px; font-weight:600; font-size:12px; color:`+color+`; cursor:pointer;" data-toggle="modal" data-target="#answerModal`+i+`"> Show Your Answer </span>
                                </span>
                                <div class="modal fade" id="answerModal`+i+`" role="dialog" data-keyboard="false">
                                    <div class="modal-dialog">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 style="color:`+text_color+`;">Extra Question </h5>
                                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                                            </div>
                                            <div class="modal-body">
                                            <h6>Your Answer on `+msg.result.response.options[i].option.event_option_id.grade+` - `+ temp_numb_option +`</h6>
                                                <div class="row" style="overflow-y:auto; max-height:450px;">`;
                                                for(j in msg.result.response.options[i].option.extra_question){
                                                    var ans_index = (parseInt(j))+1;
                                                    text+=`<div class="col-lg-12" style="margin-top:15px;">
                                                        <div style="padding:15px; border: 1px solid #cdcdcd; background: #f7f7f7;">
                                                            <h6>Question #`+ans_index+` - <i>`+ msg.result.response.options[i].option.extra_question[j].question +`</i></h6>
                                                            <span>Answer:</span>
                                                            <span style="font-weight:500;">`+ msg.result.response.options[i].option.extra_question[j].answer +`</span>
                                                        </div>
                                                    </div>`;
                                                }
                                            text+=`</div>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-3" style="margin-bottom:10px;">`;
                                if(msg.result.response.options[i].option.event_option_id.option_image_ids.length != 0)
                                    text+=`<div class="border-event"><div class="img-event-detail" style="background-size:contain; background-repeat: no-repeat; background-image: url('`+msg.result.response.options[i].option.event_option_id.option_image_ids[0]+`');"></div></div>`;
                                else
                                    text+=`<div class="border-event"><div class="img-event-detail" style="background-size:contain; background-repeat: no-repeat; background-image: url('/static/tt_website_rodextrip/images/no pic/no-ticket.png');"></div></div>`;
                            text+=`
                            </div>
                            <div class="col-lg-9">
                                <h6>Description</h6>`;
                            if(msg.result.response.options[i].option.event_option_id.description != false){
                                text+=`<span>`+msg.result.response.options[i].option.event_option_id.description+`</span><hr/>`;
                            }else{
                                text+='<span>No Description for this Ticket</span><hr/>';
                            }
                            js_total_price = 0;
                            js_currency = 'IDR';
                            for(ssc_idx in msg.result.response.options[i].sale_service_charges){
                                for(ssc_idx2 in msg.result.response.options[i].sale_service_charges[ssc_idx].FARE){
                                    js_total_price += msg.result.response.options[i].sale_service_charges[ssc_idx].FARE[ssc_idx2].amount
                                }
                                for(ssc_idx2 in msg.result.response.options[i].sale_service_charges[ssc_idx].ROC){
                                    js_total_price += msg.result.response.options[i].sale_service_charges[ssc_idx].ROC[ssc_idx2].amount
                                }
                            }
                            text+=`
                                <table style="width:100%;">
                                    <tr>
                                        <th style="width:40%;">Price</th>
                                        <th style="width:20%;">Qty</th>
                                        <th style="width:40%;">Sub Total</th>
                                    </tr>
                                    <tr>
                                        <td>`+js_currency+` `+getrupiah(js_total_price)+`</td>
                                        <td>1</td>
                                        <td>`+js_currency+` `+getrupiah(js_total_price)+`</td>
                                    </tr>
                                </table>
                            </div>`;
                            if(msg.result.response.options.length > 1 && b != msg.result.response.options.length)
                                text+=`<div class="col-lg-12"><hr/></div>`;
                    }
            document.getElementById('event_list_option').innerHTML = text;

            //======================= Extra Question =========================

            //detail

            title = '';
            if(msg.result.response.contact.gender == 'male')
                title = 'MR';
            else if(msg.result.response.contact.gender == 'female' && msg.result.response.contact.marital_status == true)
                title = 'MRS';
            else if(msg.result.response.contact.gender == 'female')
                title = 'MS';
            $text += '\nContact Person:\n';
            $text += msg.result.response.contact.title + ' ' + msg.result.response.contact.name + '\n';
            $text += msg.result.response.contact.email + '\n';
            $text += msg.result.response.contact.phone + '\n';
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
            for(i in msg.result.response.providers){
                try{
                    if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false || msg.result.response.state == 'issued')
                        text_detail+=`
                            <div style="text-align:left">
                                <span style="font-weight:500; font-size:14px;">PNR: `+msg.result.response.providers[i].pnr+` </span>
                            </div>`;

                    for(j in msg.result.response.passengers){
                        price = {'FARE': 0, 'RAC': 0, 'ROC': 0, 'TAX':0 , 'currency': '', 'CSC': 0, 'SSR': 0, 'DISC': 0,'SEAT':0};
                        for(k in msg.result.response.passengers[j].sale_service_charges[""]){
                            price[k] += msg.result.response.passengers[j].sale_service_charges[""][k].amount;
                            if(price['currency'] == '')
                                price['currency'] = msg.result.response.passengers[j].sale_service_charges[""][k].currency;
                        }
                        try{
                            price['CSC'] = msg.result.response.passengers[j].channel_service_charges.amount;

                        }catch(err){
                            console.log(err) //ada element yg tidak ada
                        }
                        //repricing
                        check = 0;
                        if(price_arr_repricing.hasOwnProperty(msg.result.response.passengers[j].pax_type) == false){
                            price_arr_repricing[msg.result.response.passengers[j].pax_type] = {}
                            pax_type_repricing.push([msg.result.response.passengers[j].pax_type, msg.result.response.passengers[j].pax_type]);
                        }
                        price_arr_repricing[msg.result.response.passengers[j].pax_type][msg.result.response.passengers[j].name] = {
                            'Fare': price['FARE'] + price['SSR'] + price['SEAT'] + price['DISC'],
                            'Tax': price['TAX'] + price['ROC'],
                            'Repricing': price['CSC']
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
                            for(l in price_arr_repricing[k]){
                                text_repricing += `
                                <div class="col-lg-12">
                                    <div style="padding:5px;" class="row" id="adult">
                                        <div class="col-lg-3" id="`+j+`_`+k+`">`+l+`</div>
                                        <div class="col-lg-3" id="`+l+`_price">`+getrupiah(price_arr_repricing[k][l].Fare + price_arr_repricing[k][l].Tax)+`</div>`;
                                        if(price_arr_repricing[k][l].Repricing == 0)
                                            text_repricing+=`<div class="col-lg-3" id="`+l+`_repricing">-</div>`;
                                        else
                                            text_repricing+=`<div class="col-lg-3" id="`+l+`_repricing">`+getrupiah(price_arr_repricing[k][l].Repricing)+`</div>`;
                                        text_repricing+=`<div class="col-lg-3" id="`+l+`_total">`+getrupiah(price_arr_repricing[k][l].Fare + price_arr_repricing[k][l].Tax + price_arr_repricing[k][l].Repricing)+`</div>
                                    </div>
                                </div>`;
                            }
                        }
                        //booker
                        booker_insentif = '-';
                        if(msg.result.response.hasOwnProperty('booker_insentif'))
                            booker_insentif = getrupiah(msg.result.response.booker_insentif)
                        text_repricing += `
                            <div class="col-lg-12">
                                <div style="padding:5px;" class="row" id="booker_repricing" hidden>
                                <div class="col-lg-6" id="repricing_booker_name">Booker Insentif</div>
                                <div class="col-lg-3" id="repriring_booker_repricing"></div>
                                <div class="col-lg-3" id="repriring_booker_total">`+booker_insentif+`</div>
                                </div>
                            </div>`;
                        text_repricing += `<div id='repricing_button' class="col-lg-12" style="text-align:center;"></div>`;
                        document.getElementById('repricing_div').innerHTML = text_repricing;
                        //repricing

                        text_detail+=`
                        <div class="row" style="margin-bottom:5px;">
                            <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7" style="text-align:left;">
                                <span style="font-size:12px;">`+msg.result.response.passengers[j].name+`</span>`;
                            text_detail+=`</div>
                            <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5" style="text-align:right;">`;
                            if(counter_service_charge == 0) //with upsell pnr pertama
                                text_detail+=`
                                <span style="font-size:13px;">`+ msg.result.response.passengers[j].qty + `X @` + price.currency+` `+getrupiah(parseInt(price.FARE + price.TAX + price.ROC + price.CSC + price.SSR + price.SEAT + price.DISC + price.CSC))+`</span>`;
                            else
                                text_detail+=`
                                <span style="font-size:13px;">`+ msg.result.response.passengers[j].qty + `X @` + price.currency+` `+getrupiah(parseInt(price.FARE + price.TAX + price.ROC + price.CSC + price.SSR + price.SEAT + price.DISC))+`</span>`;
                            text_detail+=`
                            </div>
                        </div>`;
                        $text += msg.result.response.passengers[j].name + ' ['+msg.result.response.providers[i].pnr+'] \n';
                        if(counter_service_charge == 0){ //with upsell pnr pertama
                            total_price += parseInt(price.TAX + price.ROC + price.FARE + price.SEAT + price.CSC + price.SSR + price.DISC) * parseInt(msg.result.response.passengers[j].qty);
                            price_provider += parseInt(price.TAX + price.ROC + price.FARE + price.SEAT + price.CSC + price.SSR + price.DISC) * parseInt(msg.result.response.passengers[j].qty);
                            $text += msg.result.response.passengers[j].qty + ' x ' + price.currency+` `+getrupiah(parseInt(price.FARE + price.SSR + price.SEAT + price.TAX + price.ROC + price.CSC + price.DISC))+'\n';
                            $text += 'Sub Total: ' + price.currency+` `+getrupiah(parseInt(price.FARE + price.SSR + price.SEAT + price.TAX + price.ROC + price.CSC + price.DISC) * msg.result.response.passengers[j].qty)+'\n\n';
                        }else{ //no upsell
                            total_price += parseInt(price.TAX + price.ROC + price.FARE + price.SSR + price.SEAT + price.DISC) * parseInt(msg.result.response.passengers[j].qty);
                            price_provider += parseInt(price.TAX + price.ROC + price.FARE + price.SSR + price.SEAT + price.DISC) * parseInt(msg.result.response.passengers[j].qty);
                            $text += msg.result.response.passengers[j].qty + ' x ' + price.currency+` `+getrupiah(parseInt(price.FARE + price.SSR + price.SEAT + price.TAX + price.ROC + price.DISC))+'\n';
                            $text += 'Sub Total: ' + price.currency+` `+getrupiah(parseInt(price.FARE + price.SSR + price.SEAT + price.TAX + price.ROC + price.DISC) * msg.result.response.passengers[j].qty)+'\n\n';
                        }
                        commission += parseInt(price.RAC);
                    }
                    total_price_provider.push({
                        'pnr': msg.result.response.providers[i].pnr,
                        'price': price_provider
                    })
                    price_provider = 0;
                    counter_service_charge++;
                }catch(err){console.log(err)}
            }
            try{
                event_get_detail.result.response.total_price = total_price;
                $text += 'Grand Total: '+price.currency+' '+ getrupiah(total_price);
                if(msg.result.response.state == 'booked'){
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
                if(msg.result.response.state == 'booked' && user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
                    text_detail+=`<div style="text-align:right; padding-bottom:10px;"><img src="/static/tt_website_rodextrip/img/bank.png" alt="Bank" style="width:25px; height:25px; cursor:pointer;" onclick="show_repricing();"/></div>`;
                else if(msg.result.response.state == 'issued' && user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false){
                    text_detail+=`<div style="text-align:right; padding-bottom:10px;"><img src="/static/tt_website_rodextrip/img/bank.png" alt="Bank" style="width:25px; height:25px; cursor:pointer;" onclick="show_repricing();"/></div>`;
                    document.getElementById('repricing_type').innerHTML = '<option value="booker">Booker</option>';
                    $('#repricing_type').niceSelect('update');
                    reset_repricing();
                }
                text_detail+=`<div class="row">
                <div class="col-lg-12" style="padding-bottom:10px;">
                    <hr/>
                    <span style="font-size:14px; font-weight:bold;">Share This on:</span><br/>`;
                    share_data();
                    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                    if (isMobile) {
                        text_detail+=`
                            <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png" alt="Whatsapp"/></a>
                            <a href="line://msg/text/`+ $text_share +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png" alt="Line"/></a>
                            <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png" alt="Telegram"/></a>
                            <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png" alt="Email"/></a>`;
                    } else {
                        text_detail+=`
                            <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png" alt="Whatsapp"/></a>
                            <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png" alt="Line"/></a>
                            <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png" alt="Telegram"/></a>
                            <a href="mailto:?subject=This is the airline price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png" alt="Email"/></a>`;
                    }

                text_detail+=`
                    </div>
                </div>`;
                if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false){
                    text_detail+=`
                    <div class="row" id="show_commission_event" style="display:block;">
                        <div class="col-lg-12 col-xs-12" style="text-align:center;">
                            <div class="alert alert-success">
                                <div class="row">
                                    <div class="col-lg-6 col-xs-6" style="text-align:left;">
                                        <span style="font-size:13px; font-weight:bold;">YPM</span>
                                    </div>
                                    <div class="col-lg-6 col-xs-6" style="text-align:right;">
                                        <span style="font-size:13px; font-weight:bold;">`+price.currency+` `+getrupiah(parseInt(commission)*-1)+`</span>
                                    </div>
                                </div>`;
                                if(msg.result.response.hasOwnProperty('agent_nta') == true){
                                    total_nta = 0;
                                    total_nta = msg.result.response.agent_nta;
                                    text_detail+=`<div class="row">
                                    <div class="col-lg-6 col-xs-6" style="text-align:left;">
                                        <span style="font-size:13px; font-weight:bold;">Agent NTA</span>
                                    </div>
                                    <div class="col-lg-6 col-xs-6" style="text-align:right;">
                                        <span style="font-size:13px; font-weight:bold;">`+price.currency+` `+getrupiah(total_nta)+`</span>
                                    </div>
                                </div>`;
                                }
                                if(msg.result.response.hasOwnProperty('total_nta') == true){
                                    total_nta = 0;
                                    total_nta = msg.result.response.total_nta;
                                    text_detail+=`<div class="row">
                                    <div class="col-lg-6 col-xs-6" style="text-align:left;">
                                        <span style="font-size:13px; font-weight:bold;">HO NTA</span>
                                    </div>
                                    <div class="col-lg-6 col-xs-6" style="text-align:right;">
                                        <span style="font-size:13px; font-weight:bold;">`+price.currency+` `+getrupiah(total_nta)+`</span>
                                    </div>
                                </div>`;
                                }
                                if(msg.result.response.hasOwnProperty('booker_insentif') == true){
                                    booker_insentif = 0;
                                    booker_insentif = msg.result.response.booker_insentif;
                                    text_detail+=`<div class="row">
                                    <div class="col-lg-6 col-xs-6" style="text-align:left;">
                                        <span style="font-size:13px; font-weight:bold;">Booker Insentif</span>
                                    </div>
                                    <div class="col-lg-6 col-xs-6" style="text-align:right;">
                                        <span style="font-size:13px; font-weight:bold;">`+price.currency+` `+getrupiah(booker_insentif)+`</span>
                                    </div>
                                </div>`;
                                }
                                if(commission == 0){
                                    text_detail+=`
                                    <div class="row">
                                        <div class="col-lg-12 col-xs-12" style="text-align:left;">
                                            <span style="font-size:13px; color:red;">* Please mark up the price first</span>
                                        </div>
                                    </div>`;
                                }
                                text_detail+=`
                            </div>
                        </div>
                    </div>`;
                }
                text_detail+=`<center>

                <div style="padding-bottom:10px;">
                    <center>
                        <input type="button" class="primary-btn-white" style="width:100%;" onclick="copy_data();" value="Copy"/>
                    </center>
                </div>`;
                if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false)
                    text_detail+=`
                        <div style="margin-bottom:5px;">
                            <input class="primary-btn-white" id="show_commission_button_event" style="width:100%;" type="button" onclick="show_commission_event();" value="Hide YPM"/>
                        </div>
                    </div>`;
            }catch(err){console.log(err);}
            document.getElementById('event_detail').innerHTML = text_detail;

            //==================== Print Button =====================
            var print_text = '<div class="col-lg-4" style="padding-bottom:10px;">';
            // === Button 1 ===
            if (msg.result.response.state  == 'issued') {
                print_text+=`
                <button class="primary-btn hold-seat-booking-train ld-ext-right" id="button-choose-print" type="button" onclick="get_printout('` + msg.result.response.name + `','ticket','event');" style="width:100%;">
                    Print Ticket
                    <div class="ld ld-ring ld-cycle"></div>
                </button>`;
            }
            print_text += '</div><div class="col-lg-4" style="padding-bottom:10px;">';
            // === Button 2 ===
            if (msg.result.response.state  == 'booked'){
                print_text+=`
                <button class="primary-btn hold-seat-booking-train ld-ext-right" id="button-print-print" type="button" onclick="get_printout('` + msg.result.response.name + `','itinerary','event');" style="width:100%;">
                    Print Itinerary Form
                    <div class="ld ld-ring ld-cycle"></div>
                </button>`;
            }else if (msg.result.response.state  == 'issued'){
                print_text+=`
                <button class="primary-btn hold-seat-booking-train ld-ext-right" type="button" id="button-print-print" onclick="get_printout('` + msg.result.response.name + `','ticket_price','event');" style="width:100%;">
                    Print Ticket (With Price)
                    <div class="ld ld-ring ld-cycle"></div>
                </button>`;
            }
            print_text += '</div><div class="col-lg-4" style="padding-bottom:10px;">';
            // === Button 3 ===
            if (msg.result.response.state  == 'issued') {
                print_text+=`
                <button class="primary-btn hold-seat-booking-train ld-ext-right" type="button" onclick="window.location.href='https://backend.rodextrip.com/rodextrip/report/pdf/tt.agent.invoice/`+msg.result.response.name+`'" style="width:100%;" >
                    Print Invoice
                    <div class="ld ld-ring ld-cycle"></div>
                </button>`;
            }
            print_text += '</div>';
            document.getElementById('event_btn_printout').innerHTML = print_text;
            if(msg.result.response.hasOwnProperty('voucher_reference') && msg.result.response.voucher_reference != '' && msg.result.response.voucher_reference != false){
                try{
                    render_voucher(price.currency,msg.result.response.voucher_discount, msg.result.response.state)
                }catch(err){console.log(err);}
            }
            try{
                if(msg.result.response.state == 'booked' || msg.result.response.state == 'issued' && msg.result.response.voucher_reference)
                    document.getElementById('voucher_discount').style.display = 'block';
                else
                    document.getElementById('voucher_discount').style.display = 'none';
            }catch(err){console.log(err);}
            //======================= Other =========================
            add_repricing();
                }else{
                    //swal
                }
            }catch(err){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error event booking </span> Please try again in 1 - 5 minutes later or contact customer service' ,
                }).then((result) => {
                  window.location.href = '/reservation';
                })
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error event get booking');
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
           if(msg.result.error_code == 0){
               signature = msg.result.response.signature;
               get_carriers_event();
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
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error Event signin');
            try{
                $('#loading-search-event').hide();
            }catch(err){console.log('part #3')}
       },timeout: 120000
    });
}

function get_carriers_event(){
    $.ajax({
       type: "POST",
       url: "/webservice/event",
       headers:{
            'action': 'get_carriers',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
           event_carriers = msg;
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {

       },timeout: 60000
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
        'category': $('#category_event').val(),
        'signature': signature
       },
       success: function(msg) {
           if(google_analytics != '')
               gtag('event', 'event_search', {});
           event_search_result = [];
           var temp = [];
           try{
                if(msg.result.error_code==0){
                    for(k in msg.result.response){
                        if (Date.parse(msg.result.response[k].start_date) > Date.now() ){
                            event_search_result.push(msg.result.response[k]);
                        } else {
                            temp.push(msg.result.response[k]);
                        }
                    }
                    event_search_result = event_search_result.concat(temp);
                    sort(event_search_result,1);
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
        if(msg.result.response.length != 0){
            for(i in msg.result.response){
                if(parseInt(msg.result.response[i].qty_available) >= 1){
                    option_ids_length = option_ids_length+1;
                }else if (parseInt(msg.result.response[i].qty_available) == -1){
                    option_ids_length = option_ids_length+1;
                }
            }
            for(i in msg.result.response){
                content_pop_cancellation = '';
                content_pop_timeslot = '';
                text = ''
                    if(parseInt(msg.result.response[i].qty_available) >= 1){
                        text += '<div class="ticket-layout"><div class="ticket-content-wrapper">';
                        text += '<div class="row">';

                        text += `
                        <div class="col-lg-12" style="padding:0px;">
                            <div class="row">
                                <div class="col-lg-11 col-md-11 col-sm-11 col-xs-10">
                                <span class="option_name" id="option_name_`+i+`" style="font-weight: bold; font-size:16px; padding-right:5px; text-transform: capitalize;"> `+ msg.result.response[i].grade + `</span><br/>`;
                                text+=`
                                </div>
                                <div class="col-lg-1 col-md-1 col-sm-1 col-xs-2">
                                    <label class="check_box_custom" style="float:right; padding-left:15px;">
                                        <span class="span-search-ticket" style="color:black;"></span>
                                        <input type="checkbox" class="copy_result" name="copy_result`+i+`" id="copy_result`+i+`" onchange="checkboxCopyBox(`+i+`, `+option_ids_length+`);"/>
                                        <span class="check_box_span_custom" style="border:1px solid #cdcdcd;"></span>
                                    </label>
                                    <span class="id_copy_result" hidden>`+i+`</span>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-12" style="padding:0px;"><hr style="margin-top:10px; margin-bottom:10px;"/></div>

                        <div class="col-lg-8">
                            <div class="row">
                                <div class="col-lg-12" style="margin-bottom:5px; padding:0px;">`;
                                if(msg.result.response[i].description != false){
                                    text+=`<span class="option_description">` + msg.result.response[i].description + `</span>`;
                                }
                                else{
                                    text+=`<span class="option_description">Description not Available</span>`;
                                }
                                text+=`</div>`;

                                //text+=`<div class="col-lg-12" style="padding:0px;">`;
                                //for (j in msg.result.response[i].timeslot){
                                //    text+=`<div class="row option_row`+i+`">`;
                                //    if(msg.result.response[i].timeslot[j].start_date != ""){
                                //        text+=`<div class="col-lg-6">
                                //            <i class="fas fa-calendar-alt" style="color:{{color}};"></i><span style="font-size:14px;" class="option_date`+i+``+j+`" > ` + msg.result.response[i].timeslot[j].start_date + `</span>
                                //        </div>`;
                                //    }
                                //    if(msg.result.response[i].timeslot[j].start_hour +`- `+ msg.result.response[i].timeslot[j].end_hour != ""){
                                //        text+=`
                                //        <div class="col-lg-6">
                                //            <i class="fas fa-clock" style="color:{{color}};"></i><span style="font-size:14px;" class="option_time`+i+``+j+`"> ` +  msg.result.response[i].timeslot[j].start_hour +` - `+ msg.result.response[i].timeslot[j].end_hour + `</span>
                                //        </div>`;
                                //    }
                                //    text+=`</div>`;
                                //}
                                //text+=`</div>

                                text+=`
                                <div class="col-lg-12" style="padding:0px;">`;
                                    if (msg.result.response[i].ticket_sale_end_day != ''){
                                        text+=`<span style="font-weight:600;" class="option_available">Available Until:</span><span style="font-weight:600; color: `+color+`;"> <span class="option_expired">`+ msg.result.response[i].ticket_sale_end_day +` - `+ msg.result.response[i].ticket_sale_end_hour +`</span></span>`
                                    }
                                    text+=`
                                </div>
                                <div class="col-lg-12" style="padding:0px;">`;
                                    if(msg.result.response[i].cancellation_policy != false){
                                        text+=`
                                        <span style="font-weight:600; padding-right:15px; cursor:pointer;" id="pop_cancellation`+i+`">
                                            <i class="fas fa-ban"></i>
                                            <span style="color:`+color+`; text-decoration: underline;">Cancellation Policy</span>
                                        </span>`;
                                        content_pop_cancellation += msg.result.response[i].cancellation_policy;
                                    }

                                    if(msg.result.response[i].timeslot.length != 0){
                                        text+=`
                                        <span style="font-weight:600; padding-right:15px; cursor:pointer;" id="pop_timeslot`+i+`">
                                            <i class="fas fa-clock"></i>
                                            <span style="color:`+color+`; text-decoration: underline;">Timeslot</span>
                                        </span>`;
                                        for (j in msg.result.response[i].timeslot){
                                            if(msg.result.response[i].timeslot[j].start_date != ""){
                                                content_pop_timeslot += `<i class="fas fa-calendar-alt" style="color:`+color+`;"></i><span style="font-size:14px;" class="option_date`+i+``+j+`" > ` + msg.result.response[i].timeslot[j].start_date + `</span>`;
                                            }
                                            if(msg.result.response[i].timeslot[j].start_hour +`- `+ msg.result.response[i].timeslot[j].end_hour != ""){
                                                content_pop_timeslot+=`<span style="font-size:14px;" class="option_time`+i+``+j+`"> ` +  msg.result.response[i].timeslot[j].start_hour +` - `+ msg.result.response[i].timeslot[j].end_hour + `</span>`;
                                            }
                                            content_pop_timeslot += `</hr>`;
                                        }
                                    }
                                    text+=`
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-4 mt-1" style="padding:0px; text-align:right;">
                            <div class="row">
                                <div class="col-lg-12 col-md-6 col-sm-6 left-to-right">`;
                                if(parseInt(msg.result.response[i].qty_available) <= 5 && parseInt(msg.result.response[i].qty_available) >= 1){
                                    text+=`<i class="fas fa-ticket-alt"></i><span style="font-weight:600; color: `+color+`;"> `+ msg.result.response[i].qty_available +` ticket left</span><br/>`;
                                }
                                if(msg.result.response[i].currency != 'IDR')
                                    text+= '<span class="option_price" style="font-weight: bold; font-size:15px; padding-bottom:10px; padding-top:5px;"> '+ msg.result.response[i].currency + ' ' + parseInt(msg.result.response[i].price) +'</span><br/>';
                                else
                                    text+= '<span class="option_price" style="font-weight: bold; font-size:15px; padding-bottom:10px; padding-top:5px;"> '+ msg.result.response[i].currency + ' ' + getrupiah(parseInt(msg.result.response[i].price))+'</span><br/>';
                                text+=`</div>
                                <div class="col-lg-12 col-md-6 col-sm-6">`;
                                text+=`
                                <div style="display:flex; float:right; padding:5px 0px 0px 0px; ">
                                    <input id="option_max_qty_`+i+`" type="hidden" value="`+msg.result.response[i].qty_available+`"/>
                                    <input id="option_currency_`+i+`" type="hidden" value="`+msg.result.response[i].currency+`"/>
                                    <input id="option_price_`+i+`" type="hidden" value="`+msg.result.response[i].price+`"/>
                                    <input id="option_commission_`+i+`" type="hidden" value="`+msg.result.response[i].commission+`"/>`;
                                    price_start.push(msg.result.response[i].price);
                                text+=`
                                    <button type="button" class="btn-custom-circle" id="left-minus-event-`+i+`" data-type="minus" data-field="" disabled onclick="reduce_option(`+i+`);">
                                        <i class="fas fa-minus"></i>
                                    </button>`;

                                    if(template == 6){
                                        text+=`<input type="text" class="form-control" style="padding:5px !important; background:none; text-align:center; width:40px; height:43px !important;" id="option_qty_`+i+`" name="option_qty_`+i+`" value="0" min="0" readonly>`;
                                    }else{
                                        text+=`<input type="text" class="form-control" style="padding:5px !important; background:none; text-align:center; width:30px; height:30px !important;" id="option_qty_`+i+`" name="option_qty_`+i+`" value="0" min="0" readonly>`;
                                    }

                                    text+=`
                                    <button type="button" class="btn-custom-circle" id="right-plus-event-`+i+`" data-type="plus" data-field="" onclick="add_option(`+i+`);">
                                        <i class="fas fa-plus"></i>
                                    </button>
                                </div>
                            </div>
                        </div>`;

                        //text+='<button class="primary-btn-custom" type="button" onclick="hotel_room_pick(`'+msg.result.response[i].option_id+'`);" id="button'+msg.result.response[i].option_id+'">Choose</button>';
                        text+='</div></div>';
                        node.className = 'p-5px';
//                        node.className = 'detail-event-box';
                    }

                    else if (parseInt(msg.result.response[i].qty_available) == -1){
                        text += '<div class="ticket-layout"><div class="ticket-content-wrapper">';
                        text += '<div class="row">';

                        text += `
                        <div class="col-lg-12" style="padding:0px;">
                            <div class="row">
                                <div class="col-lg-11 col-md-11 col-sm-11 col-xs-10">
                                <span class="option_name" id="option_name_`+i+`" style="font-weight: bold; font-size:16px; padding-right:5px; text-transform: capitalize;"> `+ msg.result.response[i].grade + `</span><br/>`;
                                text+=`
                                </div>
                                <div class="col-lg-1 col-md-1 col-sm-1 col-xs-2">
                                    <label class="check_box_custom" style="float:right; padding-left:15px;">
                                        <span class="span-search-ticket" style="color:black;"></span>
                                        <input type="checkbox" class="copy_result" name="copy_result`+i+`" id="copy_result`+i+`" onchange="checkboxCopyBox(`+i+`, `+option_ids_length+`);"/>
                                        <span class="check_box_span_custom" style="border:1px solid #cdcdcd;"></span>
                                    </label>
                                    <span class="id_copy_result" hidden>`+i+`</span>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-12" style="padding:0px;"><hr style="margin-top:10px; margin-bottom:10px;"/></div>

                        <div class="col-lg-8">
                            <div class="row">
                                <div class="col-lg-12" style="margin-bottom:5px; padding:0px;">`;
                                if(msg.result.response[i].description != false){
                                    text+=`<span class="option_description">` + msg.result.response[i].description + `</span>`;
                                }
                                else{
                                    text+=`<span class="option_description">Description not Available</span>`;
                                }
                                text+=`</div>`;

                                //text+=`<div class="col-lg-12" style="padding:0px;">`;
                                //for (j in msg.result.response[i].timeslot){
                                //    text+=`<div class="row option_row`+i+`">`;
                                //    if(msg.result.response[i].timeslot[j].start_date != ""){
                                //        text+=`<div class="col-lg-6">
                                //            <i class="fas fa-calendar-alt" style="color:{{color}};"></i><span style="font-size:14px;" class="option_date`+i+``+j+`" > ` + msg.result.response[i].timeslot[j].start_date + `</span>
                                //        </div>`;
                                //    }
                                //    if(msg.result.response[i].timeslot[j].start_hour +`- `+ msg.result.response[i].timeslot[j].end_hour != ""){
                                //        text+=`
                                //        <div class="col-lg-6">
                                //            <i class="fas fa-clock" style="color:{{color}};"></i><span style="font-size:14px;" class="option_time`+i+``+j+`"> ` +  msg.result.response[i].timeslot[j].start_hour +` - `+ msg.result.response[i].timeslot[j].end_hour + `</span>
                                //        </div>`;
                                //    }
                                //    text+=`</div>`;
                                //}
                                //text+=`</div>

                                text+=`
                                <div class="col-lg-12" style="padding:0px;">`;
                                    if (msg.result.response[i].ticket_sale_end_day != ''){
                                        text+=`<span style="font-weight:600;" class="option_available">Available On:</span><span style="font-weight:600; color: `+color+`;"> <span class="option_expired">`+ msg.result.response[i].ticket_sale_start_day +` - `+ msg.result.response[i].ticket_sale_start_hour +`</span></span>`
                                    }
                                    text+=`
                                </div>
                                <div class="col-lg-12" style="padding:0px;">`;
                                    if(msg.result.response[i].cancellation_policy != false){
                                        text+=`
                                        <span style="font-weight:600; padding-right:15px; cursor:pointer;" id="pop_cancellation`+i+`">
                                            <i class="fas fa-ban"></i>
                                            <span style="color:`+color+`; text-decoration: underline;">Cancellation Policy</span>
                                        </span>`;
                                        content_pop_cancellation += msg.result.response[i].cancellation_policy;
                                    }

                                    if(msg.result.response[i].timeslot.length != 0){
                                        text+=`
                                        <span style="font-weight:600; padding-right:15px; cursor:pointer;" id="pop_timeslot`+i+`">
                                            <i class="fas fa-clock"></i>
                                            <span style="color:`+color+`; text-decoration: underline;">Timeslot</span>
                                        </span>`;
                                        for (j in msg.result.response[i].timeslot){
                                            if(msg.result.response[i].timeslot[j].start_date != ""){
                                                content_pop_timeslot += `<i class="fas fa-calendar-alt" style="color:`+color+`;"></i><span style="font-size:14px;" class="option_date`+i+``+j+`" > ` + msg.result.response[i].timeslot[j].start_date + `</span>`;
                                            }
                                            if(msg.result.response[i].timeslot[j].start_hour +`- `+ msg.result.response[i].timeslot[j].end_hour != ""){
                                                content_pop_timeslot+=`<span style="font-size:14px;" class="option_time`+i+``+j+`"> ` +  msg.result.response[i].timeslot[j].start_hour +` - `+ msg.result.response[i].timeslot[j].end_hour + `</span>`;
                                            }
                                            content_pop_timeslot += `</hr>`;
                                        }
                                    }
                                    text+=`
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-4 mt-1" style="padding:0px; text-align:right;">
                            <div class="row">
                                <div class="col-lg-12 col-md-6 col-sm-6 left-to-right">`;
                                if(parseInt(msg.result.response[i].qty_available) <= 5 && parseInt(msg.result.response[i].qty_available) >= 1){
                                    text+=`<i class="fas fa-ticket-alt"></i><span style="font-weight:600; color: `+color+`;"> `+ msg.result.response[i].qty_available +` ticket left</span><br/>`;
                                }
                                if(msg.result.response[i].currency != 'IDR')
                                    text+= '<span class="option_price" style="font-weight: bold; font-size:15px; padding-bottom:10px; padding-top:5px;"> '+ msg.result.response[i].currency + ' ' + parseInt(msg.result.response[i].price) +'</span><br/>';
                                else
                                    text+= '<span class="option_price" style="font-weight: bold; font-size:15px; padding-bottom:10px; padding-top:5px;"> '+ msg.result.response[i].currency + ' ' + getrupiah(parseInt(msg.result.response[i].price))+'</span><br/>';
                                text+=`</div>
                                <div class="col-lg-12 col-md-6 col-sm-6">`;
                                text+=`
                                <div style="display:flex; float:right; padding:5px 0px 0px 0px; ">
                                    <input id="option_currency_`+i+`" type="hidden" value="`+msg.result.response[i].currency+`"/>
                                    <input id="option_price_`+i+`" type="hidden" value="`+msg.result.response[i].price+`"/>
                                    <input id="option_commission_`+i+`" type="hidden" value="`+msg.result.response[i].commission+`"/>`;
                                    price_start.push(msg.result.response[i].price);
                                text+=`
                                    <span style="padding:10px; color: `+text_color+`; background: gray; border-radius:7px;">Coming Soon</span>
                                </div>
                            </div>
                        </div>`;

                        //text+='<button class="primary-btn-custom" type="button" onclick="hotel_room_pick(`'+msg.result.response[i].option_id+'`);" id="button'+msg.result.response[i].option_id+'">Choose</button>';
                        text+='</div></div>';
                        node.className = 'p-5px';
//                            node.className = 'detail-event-box-sold';
                    }

                    else{
                        text += '<div class="ticket-layout"><div class="ticket-content-wrapper" style="background: #f7f7f7;">';
                        text += '<div class="row">';

                        text += `
                        <div class="col-lg-12" style="padding:0px;">
                            <div class="row">
                                <div class="col-lg-11 col-md-11 col-sm-11 col-xs-10">
                                <span class="option_name" id="option_name_`+i+`" style="color:#4a4a4a;font-weight: bold; font-size:16px; padding-right:5px; text-transform: capitalize;"> `+ msg.result.response[i].grade + `</span><br/>`;
                                text+=`
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-12" style="padding:0px;"><hr style="margin-top:10px; margin-bottom:10px;"/></div>

                        <div class="col-lg-8">
                            <div class="row">
                                <div class="col-lg-12" style="margin-bottom:5px; padding:0px;">`;
                                if(msg.result.response[i].description != false){
                                    text+=`<span class="option_description" style="color:#4a4a4a;">` + msg.result.response[i].description + `</span>`;
                                }
                                else{
                                    text+=`<span class="option_description" style="color:#4a4a4a;">Description not Available</span>`;
                                }
                                text+=`</div>`;

                                //text+=`<div class="col-lg-12" style="padding:0px;">`;
                                //for (j in msg.result.response[i].timeslot){
                                //    text+=`<div class="row option_row`+i+`">`;
                                //    if(msg.result.response[i].timeslot[j].start_date != ""){
                                //        text+=`<div class="col-lg-6">
                                //            <i class="fas fa-calendar-alt" style="color:{{color}};"></i><span style="font-size:14px;" class="option_date`+i+``+j+`" > ` + msg.result.response[i].timeslot[j].start_date + `</span>
                                //        </div>`;
                                //    }
                                //    if(msg.result.response[i].timeslot[j].start_hour +`- `+ msg.result.response[i].timeslot[j].end_hour != ""){
                                //        text+=`
                                //        <div class="col-lg-6">
                                //            <i class="fas fa-clock" style="color:{{color}};"></i><span style="font-size:14px;" class="option_time`+i+``+j+`"> ` +  msg.result.response[i].timeslot[j].start_hour +` - `+ msg.result.response[i].timeslot[j].end_hour + `</span>
                                //        </div>`;
                                //    }
                                //    text+=`</div>`;
                                //}
                                //text+=`</div>

                                text+=`
                                <div class="col-lg-12" style="padding:0px;">`;
                                    if (msg.result.response[i].ticket_sale_end_day != ''){
                                        text+=`<span style="font-weight:600;color:#4a4a4a;">Available Until:</span><span style="font-weight:600; color: `+color+`;"> <span class="option_expired">`+ msg.result.response[i].ticket_sale_end_day +` - `+ msg.result.response[i].ticket_sale_end_hour +`</span></span>`
                                    }
                                    text+=`
                                </div>
                                <div class="col-lg-12" style="padding:0px;">`;
                                    if(msg.result.response[i].cancellation_policy != false){
                                        text+=`
                                        <span style="font-weight:600; padding-right:15px; color:#4a4a4a; cursor:pointer;" id="pop_cancellation`+i+`">
                                            <i class="fas fa-ban"></i>
                                            <span style="color:`+color+`; text-decoration: underline;">Cancellation Policy</span>
                                        </span>`;
                                        content_pop_cancellation += msg.result.response[i].cancellation_policy;
                                    }

                                    if(msg.result.response[i].timeslot.length != 0){
                                        text+=`
                                        <span style="font-weight:600; color:#4a4a4a; padding-right:15px; cursor:pointer;" id="pop_timeslot`+i+`">
                                            <i class="fas fa-clock"></i>
                                            <span style="color:`+color+`; text-decoration: underline;">Timeslot</span>
                                        </span>`;
                                        for (j in msg.result.response[i].timeslot){
                                            if(msg.result.response[i].timeslot[j].start_date != ""){
                                                content_pop_timeslot += `<i class="fas fa-calendar-alt" style="color:`+color+`;"></i><span style="font-size:14px;" class="option_date`+i+``+j+`" > ` + msg.result.response[i].timeslot[j].start_date + `</span>`;
                                            }
                                            if(msg.result.response[i].timeslot[j].start_hour +`- `+ msg.result.response[i].timeslot[j].end_hour != ""){
                                                content_pop_timeslot+=`<span style="font-size:14px;" class="option_time`+i+``+j+`"> ` +  msg.result.response[i].timeslot[j].start_hour +` - `+ msg.result.response[i].timeslot[j].end_hour + `</span>`;
                                            }
                                            content_pop_timeslot += `</hr>`;
                                        }
                                    }
                                    text+=`
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-4 mt-1" style="padding:0px; text-align:right;">
                            <div class="row">
                                <div class="col-lg-12 col-md-6 col-sm-6 left-to-right">`;
                                if(parseInt(msg.result.response[i].qty_available) <= 5 && parseInt(msg.result.response[i].qty_available) >= 1){
                                    text+=`<i class="fas fa-ticket-alt"></i><span style="font-weight:600; color: `+color+`;"> `+ msg.result.response[i].qty_available +` ticket left</span><br/>`;
                                }
                                if(msg.result.response[i].currency != 'IDR')
                                    text+= '<span class="option_price" style="color:#4a4a4a; font-weight: bold; font-size:15px; padding-bottom:10px; padding-top:5px;"> '+ msg.result.response[i].currency + ' ' + parseInt(msg.result.response[i].price) +'</span><br/>';
                                else
                                    text+= '<span class="option_price" style="color:#4a4a4a; font-weight: bold; font-size:15px; padding-bottom:10px; padding-top:5px;"> '+ msg.result.response[i].currency + ' ' + getrupiah(parseInt(msg.result.response[i].price))+'</span><br/>';
                                text+=`</div>
                                <div class="col-lg-12 col-md-6 col-sm-6">`;
                                text+=`
                                <div style="display:flex; float:right; padding:5px 0px 0px 0px; ">
                                    <input id="option_currency_`+i+`" type="hidden" value="`+msg.result.response[i].currency+`"/>
                                    <input id="option_price_`+i+`" type="hidden" value="`+msg.result.response[i].price+`"/>
                                    <input id="option_commission_`+i+`" type="hidden" value="`+msg.result.response[i].commission+`"/>`;
                                    price_start.push(msg.result.response[i].price);
                                text+=`
                                    <span style="font-weight: bold; font-size:20px; padding-top:5px; color:`+color+`"> SOLD OUT </span>
                                </div>
                            </div>
                        </div>`;

                        //text+='<button class="primary-btn-custom" type="button" onclick="hotel_room_pick(`'+msg.result.response[i].option_id+'`);" id="button'+msg.result.response[i].option_id+'">Choose</button>';
                        text+='</div></div>';
                        node.className = 'p-5px';
//                        node.className = 'detail-event-box-sold';
                    }

                    text += '</div></div>';

                    node.innerHTML = text;
                    document.getElementById("detail_room_pick").appendChild(node);
                    node = document.createElement("div");

                    new jBox('Tooltip', {
                        attach: '#pop_cancellation'+i,
                        target: '#pop_cancellation'+i,
                        theme: 'TooltipBorder',
                        trigger: 'click',
                        adjustTracker: true,
                        closeOnClick: 'body',
                        closeButton: 'box',
                        animation: 'move',
                        position: {
                          x: 'left',
                          y: 'bottom'
                        },
                        outside: 'y',
                        pointer: 'left:20',
                        offset: {
                          x: 25
                        },
                        content: content_pop_cancellation
                    });

                    new jBox('Tooltip', {
                        attach: '#pop_timeslot'+i,
                        target: '#pop_timeslot'+i,
                        theme: 'TooltipBorder',
                        trigger: 'click',
                        adjustTracker: true,
                        closeOnClick: 'body',
                        closeButton: 'box',
                        animation: 'move',
                        position: {
                          x: 'left',
                          y: 'bottom'
                        },
                        outside: 'y',
                        pointer: 'left:20',
                        offset: {
                          x: 25
                        },
                        content: content_pop_timeslot
                    });

                    $('#loading-detail-event').hide();
                }
                price_start.sort(function(a, b){return a - b});
                document.getElementById("price_start_event").textContent = msg.result.response[0].currency+" "+getrupiah(parseInt(price_start[0]));

                hotel_price = msg.result.prices;


            }else{
                alert("There's no option found for this event, Please Try again");
                $('#loading-detail-event').hide();

                text = '<div style="text-align:center"><img src="/static/tt_website_rodextrip/images/nofound/no-event.png" alt="Not Found Event" style="width:60px; height:60px;" title=""><br><br>';
                text += '<span style="font-size:14px; font-weight:600;">Oops! No option(s) found for this event, Please Try again or search another event.</span></div>';
                node.innerHTML = text;
                document.getElementById("detail_room_pick").appendChild(node);

                document.getElementById("please_select").innerHTML = "No option(s) found for this event";
                node = document.createElement("div");
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
        if(msg.result.error_code == 0){
            text='';
            var node = document.createElement("div");

            if(msg.result.response.length != 0){
                extra_question_result = msg.result.response;
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
                            var temp_id_que = "";
                            if(msg.result.response[i].type == 'boolean' || msg.result.response[i].type == 'checkbox'){
                                text+=`<div class="col-lg-12" style="margin-bottom:15px; margin-top:10px;"><h6>`;
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
                                text += '<input autocomplete="off" class="form-control" id="question_event_' + j + '_' + k + '_' + i + '" name="question_event_' + j + '_' + k + '_' + i + '" type="text" placeholder="Enter Your Answer"';
                                if (msg.result.response[i].required)
                                    text += 'required';
                                text += '/>';
                            }else if(msg.result.response[i].type == 'password'){
                                text += '<input autocomplete="off" class="form-control" id="question_event_' + j + '_' + k + '_' + i + '"name="question_event_' + j + '_' + k + '_' + i + '" type="password" placeholder="Enter Your Password"';
                                if (msg.result.response[i].required)
                                    text += 'required';
                                text += '/>';
                            }else if(msg.result.response[i].type == 'number'){
                                temp_id_que = "question_event_"+j+"_"+k+"_"+i;
                                text += '<input autocomplete="off" class="form-control" value=""';
                                text += 'oninput="regex_input_number(`'+temp_id_que+'`);"';
                                text += 'id="question_event_' + j + '_' + k + '_' + i + '" name="question_event_' + j + '_' + k + '_' + i + '" type="text" placeholder="Input number only, Example: 17"';
                                if (msg.result.response[i].required)
                                    text += 'required';
                                text += '/>';
                            }else if(msg.result.response[i].type == 'email'){
                                text += '<input class="form-control" id="question_event_' + j + '_' + k + '_' + i + '" name="question_event_' + j + '_' + k + '_' + i + '" type="email" placeholder="Enter Your Email, Example: email@example.com"';
                                if (msg.result.response[i].required)
                                    text += 'required';
                                text += '/>';
                            }else if(msg.result.response[i].type == 'boolean'){
                                text+=`<br/><div id="boolean_question_event_`+j+`_`+k+`_`+i+`">`;
                                for(ans in msg.result.response[i].answers){
                                    if(ans == "0"){
                                        text+=`
                                        <label class="radio-button-custom" style="margin-bottom:10px;">
                                            <span style="font-size:13px;">`+msg.result.response[i].answers[ans]+`</span>
                                            <input type="radio" name="question_event_`+j+`_`+k+`_`+i+`" value="`+msg.result.response[i].answers[ans]+`"`;
                                        if (msg.result.response[i].required)
                                            text += 'required';
                                        text+=`>
                                            <span class="checkmark-radio"></span>
                                        </label>`;
                                    }else{
                                        text+=`
                                        <label class="radio-button-custom" style="margin-bottom:0px;">
                                            <span style="font-size:13px;">`+msg.result.response[i].answers[ans]+`</span>
                                            <input type="radio" name="question_event_`+j+`_`+k+`_`+i+`" value="`+msg.result.response[i].answers[ans]+`">
                                            <span class="checkmark-radio"></span>
                                        </label>`;
                                    }
                                }
                                text+=`</div>`;
                            }else if(msg.result.response[i].type == 'selection'){
                                if(msg.result.response[i].answers.length > 3){
                                    text+=`
                                    <div class="form-group">
                                        <div class="form-select" id="select_question_event_`+j+`_`+k+`_`+i+`" style="height:45px;">
                                            <select id="question_event_`+j+`_`+k+`_`+i+`" name="question_event_`+j+`_`+k+`_`+i+`" class="nice-select-default">
                                                <option value="" selected>Choose</option>`;
                                                for(ans in msg.result.response[i].answers){
                                                    text+=`<option value="`+msg.result.response[i].answers[ans]+`">`+msg.result.response[i].answers[ans]+`</option>`;
                                                }
                                    text+=`</select/>
                                        </div>
                                    </div>`;
                                }else{
                                    text+=`<div id="boolean_question_event_`+j+`_`+k+`_`+i+`">`;
                                    for(ans in msg.result.response[i].answers){
                                        text+=`
                                        <label class="radio-button-custom" style="margin-bottom:0px;">
                                            <span style="font-size:13px;">`+msg.result.response[i].answers[ans]+`</span>
                                            <input type="radio" name="question_event_`+j+`_`+k+`_`+i+`" value="`+msg.result.response[i].answers[ans]+`">
                                            <span class="checkmark-radio"></span>
                                        </label>`;
                                    }
                                    text+=`</div><br/>`;
                                }
                            }else if(msg.result.response[i].type == 'date'){
                                text += '<input autocomplete="off" class="form-control" id="question_event_' + j + '_' + k + '_' + i + '" name="question_event_' + j + '_' + k + '_' + i + '" type="email" placeholder="Enter Your Date"';
                                if (msg.result.response[i].required)
                                    text += 'required';
                                text += '/>';
                            }else if(msg.result.response[i].type == 'checkbox'){
                                text+=`<div id="checkbox_question_event_`+j+`_`+k+`_`+i+`"><div class="row">`;
                                for(ans in msg.result.response[i].answers){
                                text+=`
                                <div class="col-lg-4 col-md-6">
                                    <div class="checkbox-inline1">
                                        <label class="check_box_custom">
                                            <span class="span-search-ticket" style="color:black;">`+msg.result.response[i].answers[ans]+`</span>
                                            <input type="checkbox" id="question_event_`+j+`_`+k+`_`+i+`_`+ans+`" name="question_event_`+j+`_`+k+`_`+i+`_`+ans+`" class="question_event_checkbox`+j+`_`+k+`_`+i+`" value="`+msg.result.response[i].answers[ans]+`"/>
                                            <span class="check_box_span_custom"></span>
                                        </label>
                                    </div>
                                </div>`;
                                }
                                text+=`</div></div>`;
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
                                if(template == 3){
                                    $('#question_event_'+j+'_'+k+'_'+i).niceSelect();
                                }else{
                                    $('#question_event_'+j+'_'+k+'_'+i).niceSelect('update');
                                }
                            }else if(msg.result.response[i].type == 'date'){
                                $('input[name="question_event_'+j+'_'+k+'_'+i+'"]').daterangepicker({
                                    singleDatePicker: true,
                                    autoUpdateInput: false,
                                    showDropdowns: true,
                                    opens: 'center',
                                    locale: {
                                        cancelLabel: 'Clear'
                                    }
                                });

                                $('input[name="question_event_'+j+'_'+k+'_'+i+'"]').on('apply.daterangepicker', function(ev, picker) {
                                  $(this).val(picker.startDate.format('DD MMM YYYY'));
                                });

                                $('input[name="question_event_'+j+'_'+k+'_'+i+'"]').on('cancel.daterangepicker', function(ev, picker) {
                                  $(this).val('');
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
        document.getElementById("type").value = 'event';
        document.getElementById("voucher_code").value = voucher_code;
        document.getElementById("discount").value = JSON.stringify(discount_voucher);
        document.getElementById("session_time_input").value = time_limit;
        if(val == 1)
            document.getElementById('event_issued').submit();
        else{
            a = document.getElementById("session_time_input").value
            event_create_booking(val,a);
        }
    }
    })
}

function event_create_booking(val,a){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/event",
       headers:{
            'action': 'create_booking',
       },
       data: {
//            'event_code': 'band001',
//            'provider': 'event_internal',
//            'event_option_codes': [
//                {
//                    'option_code': 'Sil-01',
//                    'extra_question': [
//                        {'question_id': '1','answer': 'Yes',},
//                        {'question_id': '2','answer': 'No',},
//                        {'question_id': '3','answer': '123',}
//                    ]
//                },
//                {
//                    'option_code': 'Sil-01',
//                    'extra_question': [
//                        {'question_id': '1','answer': 'No',},
//                        {'question_id': '2','answer': 'No',},
//                        {'question_id': '3','answer': '6',}
//                    ]
//                },
//                {
//                    'option_code': 'Pla-03',
//                    'extra_question': [
//                        {'question_id': '1','answer': 'No',},
//                        {'question_id': '2','answer': 'Yes',},
//                        {'question_id': '3','answer': '7',}
//                    ]
//                },
//            ],
//            'event_extra_question': '',
            'special_request': '',
            'force_issued': '0',
            'signature': signature
       },
       success: function(msg) {
        if(google_analytics != '')
            gtag('event', 'event_hold_booking', {});
        if(msg.result.error_code == 0){
            $('.loader-rodextrip').fadeOut();
            if(val == 0){
                if(user_login.co_agent_frontend_security.includes('b2c_limitation') == true){
//                    send_url_booking('event', btoa(msg.result.response.order_number), msg.result.response.order_number);
//                    document.getElementById('order_number').value = msg.result.response.order_number;
//                    document.getElementById('event_issued').submit();
                    Swal.fire({
                      title: 'Success',
                      type: 'success',
                      showCancelButton: true,
                      confirmButtonColor: '#3085d6',
                      cancelButtonColor: 'blue',
                      confirmButtonText: 'Payment',
                      cancelButtonText: 'View Booking'
                    }).then((result) => {
                      if (result.value) {
                           $('.hold-seat-booking-train').addClass("running");
                           $('.hold-seat-booking-train').attr("disabled", true);
                           send_url_booking('event', btoa(msg.result.response.order_number), msg.result.response.order_number);
                           document.getElementById('order_number').value = msg.result.response.order_number;
                           document.getElementById('event_issued').submit();
                      }else{
                           document.getElementById('event_booking').innerHTML+= '<input type="hidden" name="order_number" value='+msg.result.response.order_number+'>';
                           document.getElementById('event_booking').action = '/event/booking/' + btoa(msg.result.response.order_number);
                           document.getElementById('event_booking').submit();
                      }
                    })
                }else{
                    Swal.fire({
                      title: 'Success',
                      type: 'success',
                      showCancelButton: true,
                      confirmButtonColor: '#3085d6',
                      cancelButtonColor: 'blue',
                      confirmButtonText: 'Payment',
                      cancelButtonText: 'View Booking'
                    }).then((result) => {
                      if (result.value) {
                           $('.hold-seat-booking-train').addClass("running");
                           $('.hold-seat-booking-train').attr("disabled", true);
                           send_url_booking('event', btoa(msg.result.response.order_number), msg.result.response.order_number);
                           document.getElementById('order_number').value = msg.result.response.order_number;
                           document.getElementById('event_issued').submit();
                      }else{
                           document.getElementById('event_booking').innerHTML+= '<input type="hidden" name="order_number" value='+msg.result.response.order_number+'>';
                           document.getElementById('event_booking').action = '/event/booking/' + btoa(msg.result.response.order_number);
                           document.getElementById('event_booking').submit();
                      }
                    })
//                   document.getElementById('event_booking').innerHTML+= '<input type="hidden" name="order_number" value='+msg.result.response.order_number+'>';
//                   document.getElementById('event_booking').action = '/event/booking/' + btoa(msg.result.response.order_number);
//                   document.getElementById('event_booking').submit();
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
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: msg.result.error_msg,
            })

            $('.next-loading-booking').prop('disabled', false);
            $('.next-loading-issued').removeClass("running");
            $('.next-loading-issued').prop('disabled', false);
            $('.loader-rodextrip').fadeOut();
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: errorThrown,
            })
            $('.next-loading-booking').prop('disabled', false);
            $('.next-loading-issued').removeClass("running");
            $('.next-loading-issued').prop('disabled', false);
            $('.loader-rodextrip').fadeOut();
       }
    });
}

function event_issued(data){
    var temp_data = {}
    if(typeof(event_get_detail) !== 'undefined')
        temp_data = JSON.stringify(event_get_detail)
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

        if(document.getElementById('event_payment_form'))
        {
            var formData = new FormData($('#event_payment_form').get(0));
        }
        else
        {
            var formData = new FormData($('#global_payment_form').get(0));
        }
        formData.append('order_number', data);
        formData.append('acquirer_seq_id', payment_acq2[payment_method][selected].acquirer_seq_id);
        formData.append('member', payment_acq2[payment_method][selected].method);
        formData.append('signature', signature);
        formData.append('voucher_code', voucher_code);
        formData.append('booking', temp_data);

        if (document.getElementById('is_attach_pay_ref') && document.getElementById('is_attach_pay_ref').checked == true)
        {
            formData.append('payment_reference', document.getElementById('pay_ref_text').value);
        }

        getToken();
        $.ajax({
           type: "POST",
           url: "/webservice/event",
           headers:{
                'action': 'issued',
           },
           data: formData,
           success: function(msg) {
               if(google_analytics != '')
                   gtag('event', 'event_issued', {});
               if(msg.result.error_code == 0){
                   if(document.URL.split('/')[document.URL.split('/').length-1] == 'payment'){
                        window.location.href = '/event/booking/' + btoa(data);
                   }else{
                       //update ticket
                       price_arr_repricing = {};
                       pax_type_repricing = [];
                       hide_modal_waiting_transaction();
                       document.getElementById('event_booking').innerHTML = '';
                       document.getElementById('event_detail').innerHTML = '';
                       document.getElementById('payment_acq').innerHTML = '';
                       document.getElementById('show_loading_booking_airline').style.display = 'block';
                       document.getElementById('show_loading_booking_airline').hidden = false;
                       document.getElementById('payment_acq').hidden = true;
                       document.getElementById("overlay-div-box").style.display = "none";
                       $(".issued_booking_btn").remove();
                       event_get_booking(data);
                   }
               }else if(msg.result.error_code == 1009){
                   price_arr_repricing = {};
                   pax_type_repricing = [];
                   hide_modal_waiting_transaction();
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
                        hide_modal_waiting_transaction();
                      }
                    })
                    hide_modal_waiting_transaction();
                    document.getElementById("overlay-div-box").style.display = "none";

                    $('.hold-seat-booking-train').prop('disabled', false);
                    $('.hold-seat-booking-train').removeClass("running");
                    event_get_booking(data);
               }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                    auto_logout();
               }else{
                    if(msg.result.error_code != 1007){
                        Swal.fire({
                          type: 'error',
                          title: 'Oops!',
                          html: '<span style="color: #ff9900;">Error event issued </span>' + msg.result.error_msg,
                        })
                    }else{
                        Swal.fire({
                          type: 'error',
                          title: 'Error event issued '+ msg.result.error_msg,
                          showCancelButton: true,
                          cancelButtonText: 'Ok',
                          confirmButtonColor: '#f15a22',
                          cancelButtonColor: '#3085d6',
                          confirmButtonText: 'Top Up'
                        }).then((result) => {
                            if (result.value) {
                                window.location.href = '/top_up';
                            }
                        })
                    }

                    price_arr_repricing = {};
                    pax_type_repricing = [];
                    document.getElementById('show_loading_booking_airline').hidden = false;
                    document.getElementById('event_booking').innerHTML = '';
                    document.getElementById('event_detail').innerHTML = '';
                    document.getElementById('payment_acq').innerHTML = '';
                    document.getElementById('show_loading_booking_airline').style.display = 'block';
                    document.getElementById('show_loading_booking_airline').hidden = false;
                    document.getElementById('payment_acq').hidden = true;

                    hide_modal_waiting_transaction();
                    document.getElementById("overlay-div-box").style.display = "none";

                    $('.hold-seat-booking-train').prop('disabled', false);
                    $('.hold-seat-booking-train').removeClass("running");
                    event_get_booking(data);
               }
           },
           contentType:false,
           processData:false,
           error: function(XMLHttpRequest, textStatus, errorThrown) {
                error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error event issued');
                price_arr_repricing = {};
                pax_type_repricing = [];
                document.getElementById('show_loading_booking_airline').hidden = false;
                document.getElementById('airline_booking').innerHTML = '';
                document.getElementById('airline_detail').innerHTML = '';
                document.getElementById('payment_acq').innerHTML = '';
                document.getElementById('show_loading_booking_airline').style.display = 'block';
                document.getElementById('show_loading_booking_airline').hidden = false;
                document.getElementById('payment_acq').hidden = true;
                hide_modal_waiting_transaction();
                document.getElementById("overlay-div-box").style.display = "none";
                $('.hold-seat-booking-train').prop('disabled', false);
                $('.hold-seat-booking-train').removeClass("running");
                event_get_booking(data);
           },timeout: 300000
        });
      }
    })
}

function add_option(val){
    var obj = 'option_qty_' + val;
    var new_int = parseInt(document.getElementById(obj).value) + 1;
    var max_qty = parseInt(document.getElementById('option_max_qty_'+val).value);
//    if (max_qty > 9){max_qty = 9;} // kata ko vincent commend biar bisa lebih dari 9 ticket

    document.getElementById(obj).value = new_int;
    if (new_int == max_qty){
        document.getElementById('right-plus-event-'+val).disabled = true;
    }
    document.getElementById('left-minus-event-'+val).disabled = false;
    render_object(val, new_int);
}
function reduce_option(val){
    var obj = 'option_qty_' + val;
    var new_int = parseInt(document.getElementById(obj).value) - 1;
    document.getElementById(obj).value = new_int;
    if (new_int == 0){
        document.getElementById('left-minus-event-'+val).disabled = true;
    }
    document.getElementById('right-plus-event-'+val).disabled = false;
    render_object(val, new_int);
}

function gotoForm(){
    document.getElementById('event_searchForm').submit();
}

function update_service_charge(type){
    repricing_order_number = '';
    if(type == 'booking'){
        document.getElementById('event_booking').innerHTML = '';
        upsell = []
        currency = '';
        for(i in event_get_detail.result.response.passengers){
            if(currency == '')
                for(j in event_get_detail.result.response.passengers[i].sale_service_charges){
                    currency = event_get_detail.result.response.passengers[i].sale_service_charges[j].FARE.currency;
                    break;
                }
            list_price = []
            if(document.getElementById(event_get_detail.result.response.passengers[i].name+'_repricing').innerHTML != '-' && document.getElementById(event_get_detail.result.response.passengers[i].name+'_repricing').innerHTML != '0'){
                list_price.push({
                    'amount': parseInt(document.getElementById(event_get_detail.result.response.passengers[i].name+'_repricing').innerHTML.split(',').join('')),
                    'currency_code': currency
                });
                upsell.push({
                    'sequence': event_get_detail.result.response.passengers[i].sequence,
                    'pricing': JSON.parse(JSON.stringify(list_price))
                });
            }
        }
        repricing_order_number = event_get_detail.result.response.order_number;
    }else{
        upsell_price_dict = {};
        upsell = []
        counter_pax = 0;
        val = adult;
        currency = json_event_option_code[0]['currency'];
        for(i in val){
            if(val[i].pax_type in upsell_price_dict == false)
                upsell_price_dict[val[i].pax_type] = 0;
            list_price = []
            if(document.getElementById(val[i].first_name+val[i].last_name+'_repricing').innerHTML != '-'){
                list_price.push({
                    'amount': parseInt(document.getElementById(val[i].first_name+val[i].last_name+'_repricing').innerHTML.split(',').join('')),
                    'currency_code': currency
                });
                upsell_price_dict[val[i].pax_type] += parseInt(document.getElementById(val[i].first_name+val[i].last_name+'_repricing').innerHTML.split(',').join(''));
                upsell.push({
                    'sequence': counter_pax,
                    'pricing': JSON.parse(JSON.stringify(list_price)),
                    'pax_type': 'ADT'
                });
            }
            counter_pax++;
        }
        val = json_event_option_code;
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
           if(msg.result.error_code == 0){
                if(type == 'booking'){
                    please_wait_transaction();
                    price_arr_repricing = {};
                    pax_type_repricing = [];
                    event_get_booking(repricing_order_number);
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
                  html: '<span style="color: #ff9900;">Error event service charge </span>' + msg.result.error_msg,
                })
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error event service charge');
       },timeout: 480000
    });
}

function update_insentif_booker(type){
    repricing_order_number = '';
    if(type == 'booking'){
        booker_insentif = {}
        total_price = 0
        for(j in list){
            total_price += list[j];
        }
        booker_insentif = {
            'amount': total_price
        };
        repricing_order_number = order_number;
    }
    $.ajax({
       type: "POST",
       url: "/webservice/event",
       headers:{
            'action': 'booker_insentif_booking',
       },
       data: {
           'order_number': JSON.stringify(repricing_order_number),
           'booker': JSON.stringify(booker_insentif),
           'signature': signature
       },
       success: function(msg) {
           if(msg.result.error_code == 0){
                try{
                    if(type == 'booking'){
                        please_wait_transaction();
                        event_get_booking(repricing_order_number);
                        price_arr_repricing = {};
                        pax_type_repricing = [];
                    }
                }catch(err){
                    console.log(err) //ada element yg tidak ada
                }
                $('#myModalRepricing').modal('hide');
           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
           }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error event update booker insentif </span>' + msg.result.error_msg,
                })
                $('.loader-rodextrip').fadeOut();
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            error_ajax(XMLHttpRequest, textStatus, errorThrown, 'Error event update booker insentif');
            $('.loader-rodextrip').fadeOut();
       },timeout: 60000
    });

}

function checkboxCopy(){
    var count_copy = $(".copy_result:checked").length;
    document.getElementById("badge-copy-notif").innerHTML = count_copy;
    document.getElementById("badge-copy-notif2").innerHTML = count_copy;
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
        var available_option = parent_option.find('.option_available').html();
        option_number = option_number + 1;
        $text += ''+option_number+'. '+name_option;
        if(available_option == "Available On:"){
            $text += " (COMING SOON) ";
        }
        $text += '\n';
        $text += 'Description: '+description_option+'\n';

        var cek_row = 0;
        text+=`
        <div class="row" id="div_list`+id_event+`">
            <div class="col-lg-8">
                <h6>`+option_number+`. `+name_option+``;
                if(available_option == "Available On:"){
                    text += " (COMING SOON) ";
                }
                text+=`</h6>
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
        $text += available_option+ ' ' + expired_option+ '\n';
        $text += 'Price: ' + price_option+ '\n \n';

        text+=`
                <span>`+available_option+` `+expired_option+`</span><br/>
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
                    <a href="https://wa.me/?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png" alt="Whatsapp"/></a>`;
                if(option_number < 11){
                    text+=`
                        <a href="line://msg/text/`+ $text_share +`" target="_blank" title="Share by Line" style="padding-right:5px;"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png" alt="Line"/></a>
                        <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png" alt="Telegram"/></a>`;
                }
                else{
                    text+=`
                    <a href="#" target="_blank" title="Share by Line" style="padding-right:5px; cursor:not-allowed;"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line-gray.png" alt="Line Disable"/></a>
                    <a href="#" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram-gray.png" alt="Telegram Disable"/></a>`;
                }
                text+=`
                    <a href="mailto:?subject=This is the event price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png" alt="Email"/></a>`;
            } else {
                text+=`
                    <a href="https://web.whatsapp.com/send?text=`+ $text_share +`" data-action="share/whatsapp/share" title="Share by Whatsapp" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/whatsapp.png" alt="Whatsapp"/></a>`;
                if(option_number < 11){
                    text+=`
                        <a href="https://social-plugins.line.me/lineit/share?text=`+ $text_share +`" title="Share by Line" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line.png" alt="Line"/></a>
                        <a href="https://telegram.me/share/url?text=`+ $text_share +`&url=Share" title="Share by Telegram" style="padding-right:5px;"  target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram.png" alt="Telegram"/></a>`;
                }
                else{
                    text+=`
                    <a href="#" title="Share by Line" style="padding-right:5px; cursor:not-allowed;"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/line-gray.png" alt="Line Disable"/></a>
                    <a href="#" title="Share by Telegram" style="padding-right:5px; cursor:not-allowed;"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/telegram-gray.png" alt="Telegram Disable"/></a>`;
                }
                text+=`
                    <a href="mailto:?subject=This is the event price detail&amp;body=`+ $text_share +`" title="Share by Email" style="padding-right:5px;" target="_blank"><img style="height:30px; width:auto;" src="/static/tt_website_rodextrip/img/email.png" alt="Email"/></a>`;
            }
            if(option_number > 10){
                text+=`<br/><span style="color:red;">Nb: Share on Line and Telegram Max 10 Hotel</span>`;
            }
        text+=`
        </div>
        <div class="col-lg-12" id="copy_result">
            <input class="primary-btn-white" style="width:100%;" type="button" onclick="copy_data();" value="Copy">
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
//    const el = document.createElement('textarea');
//    el.value = $text;
//    document.body.appendChild(el);
//    el.select();
//    document.execCommand('copy');
//    document.body.removeChild(el);
    $text_share = window.encodeURIComponent($text);
}

function copy_data(){
    try{
        get_checked_copy_result();
    }catch(err){
        console.log(err) //ada element yg tidak ada
    }

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