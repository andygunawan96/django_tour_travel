passport = [];
provider_search = 0;

function get_passport_config(type){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/passport",
       headers:{
            'action': 'get_config',
       },
       data: {},
       success: function(msg) {
        console.log(msg);
        if(type == 'search')
            passport_signin('');
        passport_config = msg;
        text = '';
        for(i in msg.passport_type_list)
            if(typeof(passport_request) !== 'undefined')
                if(passport_request.passport_type != msg.passport_type_list[i][1])
                    text += `<option>`+msg.passport_type_list[i][1]+`</option>`;
                else
                    text += `<option selected>`+msg.passport_type_list[i][1]+`</option>`;
            else
                text += `<option>`+msg.passport_type_list[i][1]+`</option>`;
        document.getElementById('passport_type_id').innerHTML = text;
        text= '';
        for(i in msg.apply_type_list)
            if(typeof(passport_request) !== 'undefined')
                if(passport_request.passport_apply_type != msg.apply_type_list[i][1])
                    text += `<option>`+msg.apply_type_list[i][1]+`</option>`;
                else
                    text += `<option selected>`+msg.apply_type_list[i][1]+`</option>`;
            else
                text += `<option>`+msg.apply_type_list[i][1]+`</option>`;
        document.getElementById('passport_apply_type_id').innerHTML = text;

        text= '';
        for(i in msg.immigration_consulate_list)
            if(typeof(passport_request) !== 'undefined')
                if(passport_request.consulate != msg.immigration_consulate_list[i])
                    text += `<option>`+msg.immigration_consulate_list[i]+`</option>`;
                else
                    text += `<option selected>`+msg.immigration_consulate_list[i]+`</option>`;
            else
                text += `<option>`+msg.immigration_consulate_list[i]+`</option>`;
        document.getElementById('consulate_id').innerHTML = text;

        document.getElementById('passport_type').value = document.getElementById('passport_type_id').value;
        document.getElementById('passport_apply_type').value = document.getElementById('passport_apply_type_id').value;
        document.getElementById('consulate').value = document.getElementById('consulate_id').value;
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status == 500){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error visa get_config </span>' + errorThrown,
                })
            }
       },timeout: 60000
    });
}

function passport_signin(data){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/passport",
       headers:{
            'action': 'signin',
       },
       data: {},
       success: function(msg) {
            if(msg.result.error_code == 0){
                signature = msg.result.response.signature;
                if(data == ''){
                    passport_get_config_provider();
                }else if(data != ''){
                    passport_get_data(data);
                }
            }else{
               Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: msg.result.error_msg,
               }).then((result) => {
                  if (result.value) {
                    $("#waitingTransaction").modal('hide');
                  }
                })
               try{
                $("#waitingTransaction").modal('hide');
               }catch(err){}
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status == 500){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error visa signin </span>' + errorThrown,
                })
            }
       },timeout: 60000
    });
}

function passport_get_config_provider(){
    $.ajax({
       type: "POST",
       url: "/webservice/passport",
       headers:{
            'action': 'get_config_provider',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
            provider_search++;
            if(msg.result.error_code == 0){
                provider_length = msg.result.response.providers.length;
                for(i in msg.result.response.providers){
                    search_passport(msg.result.response.providers[i].provider);
                }
            }else{
               Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: msg.result.error_msg,
               }).then((result) => {
                  if (result.value) {
                    $("#waitingTransaction").modal('hide');
                  }
                })
               try{
                $("#waitingTransaction").modal('hide');
               }catch(err){}
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status == 500){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error visa signin </span>' + errorThrown,
                })
            }
       },timeout: 60000
    });
}

function search_passport(provider){
    counter_passport = 0;
    $.ajax({
       type: "POST",
       url: "/webservice/passport",
       headers:{
            'action': 'search',
       },
       data: {
            'passport_type': document.getElementById('passport_type').value,
            'apply_type': document.getElementById('passport_apply_type').value,
            'immigration_consulate': document.getElementById('consulate').value,
            'provider': provider,
            'signature': signature,
       },
       success: function(msg) {
            console.log(msg);
            var node;
            try{
                country = msg.result.response.country;
            }catch(err){}
            if(msg.result.error_code == 0 && msg.result.response.list_of_passport.length != 0){
                for(i in msg.result.response.list_of_passport){
                    //pax type
                    passport.push(msg.result.response.list_of_passport[i])
                    counter_passport++;
                    node = document.createElement("div");

                    text= `
                        <div style="background-color:white; border:1px solid #cdcdcd; margin-bottom:15px; padding:15px;" id="journey`+i+`">`;
                    text+=`
                            <div class="row">
                                <div class="col-lg-12">
                                    <table style="width:100%" id="list-of-passenger">
                                        <tr>
                                            <th style="width:40%;">Name</th>
                                            <th style="width:15%;">Apply Type</th>
                                            <th style="width:15%;">Regular Type</th>
                                            <th style="width:10%;">Input Qty</th>
                                        </tr>
                                        <tr>
                                            <td>`+msg.result.response.list_of_passport[i].name+`</td>
                                            <td>`+msg.result.response.list_of_passport[i].apply_type+`</td>
                                            <td>`+msg.result.response.list_of_passport[i].type.process_type+` `+msg.result.response.list_of_passport[i].type.duration+` Day(s)</td>
                                            <td>`;
                                            if(template == 1){
                                                text+=`<div class="banner-right">`;
                                            }else if(template == 2){
                                                text+=`
                                                <div class="hotel-search-form-area" style="bottom:0px !important; padding-left:0px; padding-right:0px;">
                                                    <div class="hotel-search-form" style="background-color:unset; padding:unset; box-shadow:unset; color:`+text_color+`;">`;
                                            }
                                            text+=`
                                                <div class="form-wrap" style="padding:0px;">
                                                    <input style="margin-bottom:unset;" class="form-control" type="number" value="0" min="0" id="qty_pax_`+counter_passport+`" name="qty_pax_`+counter_passport+`" onchange="update_table('search');"/>
                                                </div>
                                            </div>`;
                                            if(template == 2){
                                                text+=`</div>`;
                                            }
                                            text+=`
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                                <div class="col-lg-12" style="margin-top:15px;">
                                    <div class="row">
                                        <div class="col-lg-7 col-md-7 col-sm-6 col-xs-6" style="text-align:left;">
                                            <div class="row">
                                                <div class="col-lg-6">
                                                    <a id="detail_button_journey0" data-toggle="collapse" data-parent="#accordiondepart" onclick="show_flight_details(`+counter_passport+`);" href="#detail_departjourney`+counter_passport+`" style="color: `+color+`;" aria-expanded="true">
                                                        <span style="text-align:left; font-weight: bold; display:none;" id="flight_details_up`+counter_passport+`"> Passport details <i class="fas fa-chevron-up" style="font-size:14px;"></i></span>
                                                        <span style="text-align:left; font-weight: bold; display:block;" id="flight_details_down`+counter_passport+`"> Passport details <i class="fas fa-chevron-down" style="font-size:14px;"></i></span>
                                                    </a>
                                                </div>
                                                <div class="col-lg-6">
                                                    <a id="detail_button_attachment0" data-toggle="collapse" data-parent="#accordiondepart" onclick="show_attachment_details(`+counter_passport+`);" href="#detail_attachment`+counter_passport+`" style="color: `+color+`;" aria-expanded="true">
                                                        <span style="text-align:left; font-weight: bold; display:none;" id="attach_details_up`+counter_passport+`"> Attachment details <i class="fas fa-chevron-up" style="font-size:14px;"></i></span>
                                                        <span style="text-align:left; font-weight: bold; display:block;" id="attach_details_down`+counter_passport+`"> Attachment details <i class="fas fa-chevron-down" style="font-size:14px;"></i></span>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-5 col-md-5 col-sm-6 col-xs-6" style="text-align:right;">
                                            <span id="fare`+counter_passport+`" class="basic_fare_field" style="font-size:16px;font-weight: bold; color:#505050;">`+msg.result.response.list_of_passport[i].sale_price.currency+` `+getrupiah(msg.result.response.list_of_passport[i].sale_price.total_price)+`</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="detail_departjourney`+counter_passport+`" class="panel-collapse in collapse show" aria-expanded="true" style="margin-top:15px; display: none;">
                                <hr/>
                                <div id="journey0segment0" style="background-color:white;">
                                    <h6>Consulate Address</h6>
                                    <span>`+msg.result.response.list_of_passport[i].consulate.address+`, `+msg.result.response.list_of_passport[i].consulate.city+`</span><hr>`;
                                    if(msg.result.response.list_of_passport[i].notes != '')
                                    text+=`
                                    <h6>Passport Required</h6>`;
                                    for(j in msg.result.response.list_of_passport[i].notes){
                                        text+=`<span>`+msg.result.response.list_of_passport[i].notes[j]+`</span><br/>`;
                                    }
//                                    if(msg.result.response.list_of_visa[i].requirements.length > 0)
//                                    text+=`
//                                    <h6>Visa Required</h6>`;
//                                    for(j in msg.result.response.list_of_visa[i].requirements){
//                                        text+=`<span>`+parseInt(parseInt(j)+1)+` `+msg.result.response.list_of_visa[i].requirements[j].name;
//                                        if(msg.result.response.list_of_visa[i].requirements[j].description != '')
//                                            text+=
//                                            `, `+msg.result.response.list_of_visa[i].requirements[j].description+`</span><br/>
//                                        `;
//                                        else
//                                            text+='<span> - </span><br/>';
//                                    }

                                    text+=`
                                </div>
                            </div>
                            <div id="detail_attachment`+counter_passport+`" class="panel-collapse in collapse show" aria-expanded="true" style="margin-top:15px; display: none;">
                                <hr/>
                                <div id="attachment">
                                    <h6>Attachment</h6>`;
                                    for(j in msg.result.response.list_of_passport[i].attachments){
                                        text+=`<a href="`+msg.result.response.list_of_passport[i].attachments[j].url+`" style="padding-right:10px; color:`+color+`; font-size:14px; font-weight:500;" download><i class="fas fa-file-download"></i> `+msg.result.response.list_of_passport[i].attachments[j].name+`</a>`
                                    }
                                    text+=`
                                </div>
                            </div>
                        </div>`;
                    node.innerHTML = text;
                    document.getElementById("passport_ticket").appendChild(node);
                }
                update_table('search');
            }

            document.getElementById('loading-search-visa').hidden = true;

       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status == 500){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error passport search </span>' + errorThrown,
                })
            }
       },timeout: 120000
    });
}

function get_availability(){
    $.ajax({
       type: "POST",
       url: "/webservice/passport",
       headers:{
            'action': 'get_availability',
       },
       data: {
            'reference_code': JSON.stringify(reference_code),
            'provider': provider_pick[0],
            'signature': signature
       },
       success: function(msg) {
            console.log(msg);
            if(msg.result.error_code == 0){
                check = 0;
                for(i in msg.result.response.availability){
                    if(msg.result.response.availability[i] == false)
                        check = 1;
                }
                if(check == 0){
                    document.getElementById('passport_btn_search').innerHTML = `Next <div class="ld ld-ring ld-cycle"></div>`;
                    document.getElementById('passport_btn_search').disabled = false;
                    document.getElementById("passport_btn_search").setAttribute( "onClick", "javascript: show_loading();passport_check_search();" );
                }else{
                    document.getElementById('passport_btn_search').disabled = false;
                }
            }else{
                document.getElementById('passport_btn_search').disabled = false;
            }
            $('.next-loading').removeClass("running");
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status == 500){
                document.getElementById('visa_btn_search').disabled = false;
                $('.hold-seat-booking-train').removeClass("running");
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error visa sell </span>' + errorThrown,
                })
            }
       },timeout: 60000
    });
}

function sell_passport(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/passport",
       headers:{
            'action': 'sell_passport',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
            console.log(msg);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status == 500){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error visa sell </span>' + errorThrown,
                })
            }
       },timeout: 60000
    });
}

function check_hold_booking(){
    error_log = '';
    for(i in passenger){
        if(i != 'booker' && i != 'contact'){
            for(k in passenger[i]){
                count_pax = parseInt(k) + 1;
                if(document.getElementById('adult_passport'+count_pax).value == '' )
                    error_log += 'Please fill passport type for passenger '+ count_pax + '<br/>\n';
            }
        }
    }
    if(error_log == ''){
        focus_box('payment_acq');
    }
    else{
        Swal.fire({
          type: 'error',
          title: 'Oops!',
          html: '<span style="color: red;">Error check hold booking </span><br/>' + error_log,
        }).then((result) => {
          if (result.value) {
            $("#waitingTransaction").modal('hide');
          }
        })
        $('.next-loading').removeClass("running");
        $('.next-loading').prop('disabled', false);
        $('.payment_method').prop('disabled', false).niceSelect('update');
        $('.option').removeClass("disabled");
        $(".payment_acq *").prop('disabled',false);
        $("#waitingTransaction").modal('hide');
    }
}

function passport_pre_create_booking(val){
    Swal.fire({
      title: 'Are you sure want to Request this booking?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        $('.next-loading').addClass("running");
        $('.next-loading').prop('disabled', true);
        please_wait_transaction();
        passport_hold_booking(val);
      }
    })
}

function passport_hold_booking(val){
    if(val == 0){}

    else if(val == 1){
        update_passenger();
    }
}

function update_passenger(){
    data_pax = [];
    passenger_type = '';
    pax_count = 0;
    for(i in passenger){ //pax type
        for(k in passenger[i]){ //pax
            if(i != 'booker' && i != 'contact'){
                if(i != passenger_type){
                    pax_count = 0;
                    passenger_type = i;
                }
                pax_count++;

                for(j in passport.list_of_passport){ //list of visa
                    if( passport.list_of_passport[j].sequence == document.getElementById('adult_passport'+count_pax).value &&
                        passport.list_of_passport[j].pax_count != 0){
                        required = [];
                        for(count in passport.list_of_passport[j].requirements){
                            required.push({
                                'is_original': document.getElementById(i+'_required'+pax_count+'_'+count+'_original').checked,
                                'is_copy': document.getElementById(i+'_required'+pax_count+'_'+count+'_copy').checked,
                                'id': passport.list_of_passport[j].requirements[count].id
                            });

                        }
                        data_pax.push({
                            'id':passport.list_of_passport[j].id.toString(),
                            'required': required,
                            'notes': document.getElementById('notes_'+i+pax_count).value
                        });
                    }
                }
            }
        }
    }
    $.ajax({
       type: "POST",
       url: "/webservice/passport",
       headers:{
            'action': 'update_passengers',
       },
       data: {
            'id': JSON.stringify(data_pax),
            'signature': signature
       },
       success: function(msg) {
            console.log(msg);
            if(msg.result.error_code == 0){
                update_contact();
            }else{
                $("#waitingTransaction").modal('hide');
                close_div('payment_acq');
                //set_payment('Issued','visa');
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status == 500){
                $("#waitingTransaction").modal('hide');
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error visa update passenger </span>' + errorThrown,
                }).then((result) => {
                  if (result.value) {
                    $("#waitingTransaction").modal('hide');
                  }
                })
            }
       },timeout: 60000
    });
}

function update_contact(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/passport",
       headers:{
            'action': 'update_contacts',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
           console.log(msg);
            if(msg.result.error_code == 0){
                passport_commit_booking();
//                document.getElementById("passengers").value = JSON.stringify(passenger);
//                document.getElementById("signature").value = signature;
//                document.getElementById("provider").value = 'passport';
//                document.getElementById("type").value = 'passport';
//                document.getElementById("voucher_code").value = voucher_code;
//                document.getElementById("discount").value = JSON.stringify(discount_voucher);
//                document.getElementById("session_time_input").value = time_limit;
//                document.getElementById('passport_issued').submit();
            }else{
                $("#waitingTransaction").modal('hide');
                close_div('payment_acq');
                set_payment('Issued','passport');
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status == 500){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error visa update search </span>' + errorThrown,
                })
            }
       },timeout: 60000
    });
}

function force_issued_passport(val){
    //tambah swal
    if(val == 1)
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
        please_wait_transaction();
        $('.next-loading-booking').addClass("running");
        $('.next-loading-booking').prop('disabled', true);
        $('.next-loading-issued').prop('disabled', true);
        $('.issued_booking_btn').prop('disabled', true);
        passport_commit_booking();
      }
    })

}

function passport_commit_booking(){
    //tambah swal
    data = {
        'force_issued': 'false',
        'signature': signature,
        'voucher_code': ''
    }
    try{
        data['seq_id'] = payment_acq2[payment_method][selected].seq_id;
        data['member'] = payment_acq2[payment_method][selected].method;
        data['voucher_code'] = voucher_code;
    }catch(err){}
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/passport",
       headers:{
            'action': 'commit_booking',
       },
       data: data,
       success: function(msg) {
            console.log(msg);
            if(msg.result.error_code == 0){
//                document.getElementById('order_number').value = msg.result.response.journey.name;
//                document.getElementById('visa_booking').submit();
                if(user_login.co_agent_frontend_security.includes('b2c_limitation') == true)
                    send_url_booking('passport', btoa(msg.result.response.journey.name), msg.result.response.journey.name);
                document.getElementById('order_number').value = msg.result.response.journey.name;
                document.getElementById('passport_issued').action = '/passport/booking/' + btoa(msg.result.response.journey.name);
                document.getElementById('passport_issued').submit();
            }else{
                $("#waitingTransaction").modal('hide');
//                close_div('payment_acq');
                set_payment('Issued','passport');
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status == 500){
                $("#waitingTransaction").modal('hide');
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error visa commit booking </span>' + errorThrown,
                }).then((result) => {
                  if (result.value) {
                    $("#waitingTransaction").modal('hide');
                  }
                })
            }
       },timeout: 180000
    });
}

function passport_get_data(data){
    price_arr_repricing = {};
    get_balance('false');
    $.ajax({
       type: "POST",
       url: "/webservice/passport",
       headers:{
            'action': 'get_booking',
       },
       data: {
            'order_number': data,
            'signature': signature
       },
       success: function(msg) {
            console.log(msg);
            $("#waitingTransaction").modal('hide');
            try{
                if(msg.result.error_code == 0){
                    passport = msg.result.response;
                    var cur_state = msg.result.response.journey.state;
                    var cur_state_passport= msg.result.response.journey.state_passport;
                    if(cur_state == 'booked'){
                        conv_status = 'Booked';
                        document.getElementById('order_state').innerHTML = 'Your Order Has Been ' + cur_state.charAt(0).toUpperCase()+cur_state.slice(1).toLowerCase();
                    }
                    else if(cur_state == 'issued'){
                        conv_status = 'Issued';
                        document.getElementById('issued-breadcrumb').classList.add("br-active");
                        document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-active");
                        document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-check"></i>`;
                        document.getElementById('order_state').innerHTML = 'Your Order Has Been ' + cur_state.charAt(0).toUpperCase()+cur_state.slice(1).toLowerCase();
                    }
                    else if(cur_state == 'cancel'){
                        conv_status = 'Cancelled';
                        document.getElementById('issued-breadcrumb').classList.remove("br-active");
                        document.getElementById('issued-breadcrumb').classList.add("br-fail");
                        document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
                        document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-fail");
                        document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
                        document.getElementById('issued-breadcrumb-span').innerHTML = `Cancelled`;
                        document.getElementById('order_state').innerHTML = 'Your Order Has Been ' + conv_status;
                    }
                    else if(cur_state == 'cancel2'){
                        conv_status = 'Expired';
                        document.getElementById('issued-breadcrumb').classList.remove("br-active");
                        document.getElementById('issued-breadcrumb').classList.add("br-fail");
                        document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
                        document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-fail");
                        document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
                        document.getElementById('issued-breadcrumb-span').innerHTML = `Expired`;
                        document.getElementById('order_state').innerHTML = 'Your Order Has Been ' + conv_status;
                    }
                    else if(cur_state == 'fail_issued'){
                        conv_status = 'Fail Issued';
                        document.getElementById('issued-breadcrumb').classList.remove("br-active");
                        document.getElementById('issued-breadcrumb').classList.add("br-fail");
                        document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
                        document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-fail");
                        document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-times"></i>`;
                        document.getElementById('issued-breadcrumb-span').innerHTML = `Fail Issued`;
                        document.getElementById('order_state').innerHTML = 'Your Order Has Been ' + conv_status;
                        document.getElementById('order_state').innerHTML = 'Your Order Has Failed, Please Try Again';
                    }
                    else{
                        conv_status = 'Pending';
                        document.getElementById('issued-breadcrumb').classList.remove("br-active");
                        document.getElementById('issued-breadcrumb').classList.add("br-pending");
                        document.getElementById('issued-breadcrumb-icon').classList.remove("br-icon-active");
                        document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-pending");
                        document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-clock"></i>`;
                        document.getElementById('issued-breadcrumb-span').innerHTML = `Pending`;
                        document.getElementById('order_state').innerHTML = 'Your Order Is Currently ' + conv_status;
                    }

                    conv_status_passport = {
                        'confirm': 'Confirm to HO',
                        'validate': 'Validated bo HO',
                        'to_vendor': 'Sent to Vendor',
                        'vendor_process': 'Proceed by Vendor',
                        'cancel': 'Cancelled',
                        'payment': 'Payment',
                        'in_process': 'In Process',
                        'partial_proceed': 'Partial Proceed',
                        'proceed': 'Proceed',
                        'delivered': 'Delivered to HO',
                        'ready': 'Ready',
                        'done': 'Done',
                        'expired': 'Expired'
                    }

                    text= `<div class="row">
                            <div class="col-lg-12">
                                <div id="passport_booking_detail" style="border:1px solid #cdcdcd; padding:10px; background-color:white">
                                    <h6>Order Number : `+passport.journey.name+`</h6><br/>
                                     <table style="width:100%;">
                                        <tr>
                                            <th>Passport Status</th>
                                            <th>Order Status</th>
                                        </tr>
                                        <tr>
                                            <td>`+passport.journey.state_passport+`</td>
                                            <td>`+conv_status+`</td>
                                        </tr>
                                     </table>
                                </div>
                            </div>
                        </div>`;

                    text += `
                        <div class="row">
                            <div class="col-lg-12">
                                <div id="tour_booking_info" style="padding:10px; margin-top: 10px; background-color:white; border:1px solid #cdcdcd;">
                                    <h4> Passport Information </h4>
                                    <hr/>
                                    <h4>Process Date</h4>
                                    <span><i class="fa fa-calendar" aria-hidden="true"></i>
                                    `+passport.journey.in_process_date+`
                                    </span>
                                    <br/>
                                    <br/>
                                    <span>Payment Status: `+passport.journey.payment_status+`</span>
                                    <br/>
                                </div>
                            </div>
                        </div>`;

                    /* contact*/
                    text+=`<div class="row" style="margin-top: 10px;">
                        <div class="col-lg-12">
                            <div style="border:1px solid #cdcdcd; background-color:white; padding:10px;">
                                <h4>List of Contact(s)</h4>
                                <hr/>
                                <table style="width:100%;" id="list-of-passenger">
                                    <tr>
                                        <th style="width:7%;" class="list-of-passenger-left">No</th>
                                        <th style="width:28%;">Name</th>
                                        <th style="width:28%;">Email</th>
                                        <th style="width:18%;">Phone Number</th>
                                    </tr>
                                    <tr>
                                        <td class="list-of-passenger-left">`+1+`</td>
                                        <td>`+msg.result.response.contact.title+` `+msg.result.response.contact.name+`</td>
                                        <td>`+msg.result.response.contact.email+`</td>
                                        <td>`+msg.result.response.contact.phone+`</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>`;

                    /*pax*/
                    text+=`
                    <div class="row" style="margin-top: 10px;">
                        <div class="col-lg-12">
                            <div style="border:1px solid #cdcdcd; background-color:white; padding:10px;">
                                <h4>List of Passenger(s)</h4>
                                <hr/>`;
                                type_amount_repricing = ['Repricing'];
                                price = {'FARE': 0, 'RAC': 0, 'ROC': 0, 'TAX':0 , 'currency': '', 'CSC': 0};
                                for(i in msg.result.response.passengers){
                                    for(j in msg.result.response.passengers[i].passport.price){
                                        if(j == 'TOTAL'){
                                            price['FARE'] += msg.result.response.passengers[i].passport.price[j].amount;
                                            price['currency'] += msg.result.response.passengers[i].passport.price[j].currency;
                                        }else if(j == 'RAC'){
                                            price[j] += msg.result.response.passengers[i].passport.price[j].amount;
                                            price['currency'] += msg.result.response.passengers[i].passport.price[j].currency;
                                        }else if(j == 'CSC'){
                                            price['CSC'] = msg.result.response.passengers[i].passport.price[j].amount;

                                        }
                                    }
                                    //repricing
                                    check = 0;
                                    for(j in pax_type_repricing){
                                        if(pax_type_repricing[j][0] == msg.result.response.passengers[i].first_name + ' ' + msg.result.response.passengers[i].last_name)
                                            check = 1;
                                    }
                                    if(check == 0){
                                        pax_type_repricing.push([msg.result.response.passengers[i].first_name + ' ' + msg.result.response.passengers[i].last_name, msg.result.response.passengers[i].first_name + ' ' + msg.result.response.passengers[i].last_name]);
                                        price_arr_repricing[msg.result.response.passengers[i].first_name + ' ' + msg.result.response.passengers[i].last_name] = {
                                            'Fare': price['FARE'],
                                            'Tax': price['TAX'] + price['ROC'],
                                            'Repricing': price['CSC']
                                        }
                                    }else{
                                        price_arr_repricing[msg.result.response.passengers[i].first_name + ' ' + msg.result.response.passengers[i].last_name] = {
                                            'Fare': price_arr_repricing[msg.result.response.passengers[i].first_name + ' ' + msg.result.response.passengers[i].last_name]['Fare'] + price['FARE'],
                                            'Tax': price_arr_repricing[msg.result.response.passengers[i].first_name + ' ' + msg.result.response.passengers[i].last_name]['Tax'] + price['TAX'] + price['ROC'],
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
                                            <div style="padding:5px;" class="row">
                                                <div class="col-lg-3" id="`+j+`">`+j+`</div>
                                                <div class="col-lg-3" id="`+j+`_price">`+getrupiah(price_arr_repricing[j].Fare + price_arr_repricing[j].Tax)+`</div>
                                                <div class="col-lg-3" id="`+j+`_repricing">-</div>
                                                <div class="col-lg-3" id="`+j+`_total">`+getrupiah(price_arr_repricing[j].Fare + price_arr_repricing[j].Tax)+`</div>
                                            </div>
                                        </div>`;
                                    }
                                    text_repricing += `<div id='repricing_button' class="col-lg-12" style="text-align:center;"></div>`;
                                    document.getElementById('repricing_div').innerHTML = text_repricing;
                                    //repricing

                                    text+=`<div class="row">
                                        <div class="col-lg-12" style="margin-bottom:10px;">
                                            <div class="row">
                                                <div class="col-lg-6">
                                                    <h6>`+parseInt(parseInt(i)+1)+`. `+msg.result.response.passengers[i].title+` `+msg.result.response.passengers[i].first_name+` `+msg.result.response.passengers[i].last_name+`</h6>`;
                                                    if(parseInt(msg.result.response.passengers[i].age) > 12)
                                             text+=`<span>Adult - `;
                                                    else if(parseInt(msg.result.response.passengers[i].age) > 3)
                                             text+=`<span>Child - `;
                                                    else
                                             text+=`<span>Infant - `;
                                                    text+=`Birth Date: `+msg.result.response.passengers[i].birth_date+`</span>`;
                                         text+=`</div>
                                                <div class="col-lg-6" style="text-align:right;">
                                                    <h6>Package</h6>
                                                    <span>`+msg.result.response.passengers[i].passport.passport_type+`/`+msg.result.response.passengers[i].passport.apply_type+`/`+msg.result.response.passengers[i].passport.process_type+`</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;
                                    if(msg.result.response.passengers[i].passport.requirement.length > 0){
                                        text+=`
                                        <div class="row" style="margin-top:10px;">
                                            <div class="col-lg-12">
                                                <div class="row" id="adult_required{{counter}}">
                                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="margin-bottom:10px;">
                                                        <h6>Required</h6>
                                                    </div>
                                                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" style="margin-bottom:10px;">
                                                        <h6>Original</h6>
                                                    </div>
                                                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" style="margin-bottom:10px;">
                                                        <h6>Copy</h6>
                                                    </div>`;
                                                for(j in msg.result.response.passengers[i].passport.requirement){
                                                    if(template == 1){
                                                        text+=`
                                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">`;
                                                    }else if(template == 2 || template == 3){
                                                        text+=`
                                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="margin-bottom:20px;">`;
                                                    }else if(template == 4 || template == 5){
                                                        text+=`
                                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="margin-bottom:15px;">`;
                                                    }
                                                    text+=`
                                                        <label><b>`+parseInt(parseInt(j)+1)+` `+msg.result.response.passengers[i].passport.requirement[j].name+`</b></label><br/>
                                                    </div>
                                                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">`;
                                                        if(msg.result.response.passengers[i].passport.requirement[j].is_original == false){
                                                            text+=`
                                                            <label class="check_box_custom">
                                                                <span style="font-size:13px;"></span>
                                                                <input type="checkbox" disabled/>
                                                                <span class="check_box_span_custom"></span>
                                                            </label>`;
                                                        }else if(msg.result.response.passengers[i].passport.requirement[j].is_original == true){
                                                            text+=`
                                                            <label class="check_box_custom">
                                                                <span style="font-size:13px;"></span>
                                                                <input type="checkbox" disabled checked/>
                                                                <span class="check_box_span_custom"></span>
                                                            </label>`;
                                                        }
                                                    text+=`
                                                    </div>
                                                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">`;
                                                        if(msg.result.response.passengers[i].passport.requirement[j].is_copy == false){
                                                            text+=`
                                                            <label class="check_box_custom">
                                                                <span style="font-size:13px;"></span>
                                                                <input type="checkbox" disabled/>
                                                                <span class="check_box_span_custom"></span>
                                                            </label>`;
                                                        }else if(msg.result.response.passengers[i].passport.requirement[j].is_copy == true){
                                                            text+=`
                                                            <label class="check_box_custom">
                                                                <span style="font-size:13px;"></span>
                                                                <input type="checkbox" disabled checked/>
                                                                <span class="check_box_span_custom"></span>
                                                            </label>`;
                                                        }
                                                    text+=`
                                                    </div>`;
                                                }
                                                text+=`
                                                </div>
                                            </div>`;
                                        }
                                        try{
                                            if(msg.result.response.passengers[i].passport.hasOwnProperty('interview') == true && msg.result.response.passengers[i].visa.interview.interview_list.length > 0 ){
                                            text+=`
                                            <div class="col-lg-12" style="margin-top:15px;">
                                                <h6>Interview</h6>
                                                <table style="width:100%;" id="list-of-passenger">
                                                    <tr>
                                                        <th>No</th>
                                                        <th>Location</th>
                                                        <th>Meeting Point</th>
                                                        <th>Employee</th>
                                                        <th>Date time</th>
                                                        <th>Required</th>
                                                    </tr>`;
                                                    for(j in msg.result.response.passengers[i].passport.interview.interview_list){
                                                        text+=`
                                                    <tr>
                                                        <td>`+parseInt(parseInt(j)+1)+`</td>
                                                        <td>`+msg.result.response.passengers[i].passport.interview.interview_list[j].location+`</td>
                                                        <td>`+msg.result.response.passengers[i].passport.interview.interview_list[j].meeting_point+`</td>
                                                        <td>`+msg.result.response.passengers[i].passport.interview.interview_list[j].ho_employee+`</td>
                                                        <td>`+msg.result.response.passengers[i].passport.interview.interview_list[j].datetime+`</td>
                                                        <td>`+msg.result.response.passengers[i].passport.interview.needs+`</td>
                                                    </tr>`;
                                                    }
                                                text+=`</table>
                                                </div>`;
                                            }
                                        }catch(err){}
                                        if(msg.result.response.passengers[i].passport.hasOwnProperty('biometrics') == true && msg.result.response.passengers[i].passport.biometrics.biometrics_list.length > 0 ){
                                        text+=`
                                        <div class="col-lg-12" style="margin-top:15px;">
                                            <h6>Biometrics</h6>
                                            <table style="width:100%;" id="list-of-passenger">
                                                <tr>
                                                    <th>No</th>
                                                    <th>Location</th>
                                                    <th>Meeting Point</th>
                                                    <th>Employee</th>
                                                    <th>Date time</th>
                                                    <th>Required</th>
                                                </tr>`;
                                                for(j in msg.result.response.passengers[i].passport.biometrics.biometrics_list){
                                                    text+=`
                                                <tr>
                                                    <td>`+parseInt(parseInt(j)+1)+`</td>
                                                    <td>`+msg.result.response.passengers[i].passport.biometrics.biometrics_list[j].location+`</td>
                                                    <td>`+msg.result.response.passengers[i].passport.biometrics.biometrics_list[j].meeting_point+`</td>
                                                    <td>`+msg.result.response.passengers[i].passport.biometrics.biometrics_list[j].ho_employee+`</td>
                                                    <td>`+msg.result.response.passengers[i].passport.biometrics.biometrics_list[j].datetime+`</td>
                                                    <td>`+msg.result.response.passengers[i].passport.biometrics.needs+`</td>
                                                </tr>`
                                                }
                                            text+=`</table>
                                        </div>`;
                                    }
                                    text+=`
                                    </div>
                                    <div class="row" style="margin-top:10px;">
                                        <div class="col-lg-4">`;
                                        text+=`</div>
                                        <div class="col-lg-4">`;
                                        if(passport.journey.state == 'booked')
                                        text+=`
                                            <a class="print-booking-train ld-ext-right" style="color:`+text_color+`;">
                                                <input type="button" class="primary-btn" id="button-print-print" style="width:100%;" value="Itinerary" onclick="get_printout('`+msg.result.response.journey.name+`', 'itinerary','passport');" />
                                                <div class="ld ld-ring ld-cycle"></div>
                                            </a>`;
                                            text+=`
                                        </div>
                                        <div class="col-lg-4">`;
                                        if(passport.journey.state == 'issued')
                                            text+=`
                                            <a class="issued-booking-train ld-ext-right" style="color:`+text_color+`;">
                                                <input type="button" class="primary-btn" id="button-issued-print" style="width:100%;" data-toggle="modal" data-target="#printInvoice" value="Print Invoice"/>
                                                <div class="ld ld-ring ld-cycle"></div>
                                            </a>
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
                                                                <input type="button" class="primary-btn" id="button-issued-print" style="width:30%;" value="Submit" onclick="get_printout('`+msg.result.response.journey.name+`', 'invoice','passport');"/>
                                                            </div>
                                                        </div>
                                                        <div class="modal-footer">
                                                          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>`;
                                            text+=`
                                        </div>
                                    </div>
                                <hr/>`;
                                }
                                text+=`
                            </div>
                        </div>
                    </div>`;
                    document.getElementById('passport_booking').innerHTML = text;
                    update_table('booking');
                }
            }catch(err){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error passport booking </span> Please try again in 1 - 5 minutes later or contact customer service' ,
                }).then((result) => {
                  window.location.href = '/reservation';
                })
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status == 500){
                $("#waitingTransaction").modal('hide');
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error passport data </span>' + errorThrown,
                }).then((result) => {
                  if (result.value) {
                    $("#waitingTransaction").modal('hide');
                  }
                })
            }
       },timeout: 60000
    });
}

function update_service_charge(type){
    repricing_order_number = '';
    if(type == 'booking'){
        upsell = []
        for(i in passport.passengers){
            for(j in passport.passengers[i].sale_service_charges){
                currency = passport.passengers[i].sale_service_charges[j].TOTAL.currency;
            }
            list_price = []
            for(j in list){
                if(passport.passengers[i].first_name + ' ' + passport.passengers[i].last_name == document.getElementById('selection_pax'+j).value){
                    list_price.push({
                        'amount': list[j],
                        'currency_code': currency
                    });
                }

            }
            upsell.push({
                'sequence': passport.passengers[i].sequence,
                'pricing': JSON.parse(JSON.stringify(list_price))
            });
        }
        repricing_order_number = passport.journey.name;
    }else{
        upsell_price = 0;
        upsell = []
        counter_pax = -1;
        currency = passport.list_of_passport[0].sale_price.currency;
        for(i in passenger){
            list_price = []
            if(i != 'booker' && i != 'contact'){
                for(j in list){
                    for(k in passenger[i]){
                        if(passenger[i][k].first_name+passenger[i][k].last_name == document.getElementById('selection_pax'+j).value){
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
       url: "/webservice/passport",
       headers:{
            'action': 'update_service_charge',
       },
       data: {
           'order_number': repricing_order_number,
           'passengers': JSON.stringify(upsell),
           'signature': signature
       },
       success: function(msg) {
           console.log(msg);
           if(msg.result.error_code == 0){
                try{
                    if(type == 'booking'){
                        price_arr_repricing = {};
                        pax_type_repricing = [];
                        passport_get_data(repricing_order_number);
                        please_wait_transaction();
                    }else{
                        price_arr_repricing = {};
                        pax_type_repricing = [];
                        update_table('review');
                    }
                }catch(err){}

                $('#myModalRepricing').modal('hide');
           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                auto_logout();
           }else{
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: #ff9900;">Error passport service charge </span>' + msg.result.error_msg,
                })
                $('.loader-rodextrip').fadeOut();
           }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status == 500){
                Swal.fire({
                  type: 'error',
                  title: 'Oops!',
                  html: '<span style="color: red;">Error passport service charge </span>' + errorThrown,
                })
                $('.loader-rodextrip').fadeOut();
            }
       },timeout: 60000
    });

}