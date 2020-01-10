visa = '';


function get_visa_config(type){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/visa",
       headers:{
            'action': 'get_config',
       },
       data: {},
       success: function(msg) {
        console.log(msg);
        if(type == 'search')
            visa_signin('');
        visa_config = msg;
        destination = document.getElementById('visa_destination_id');
        for(i in msg){
            var node = document.createElement("option");
            node.text = i;
            node.value = i;
            if(type == 'search'){
                try{
                    if(visa_request['destination'] == i){
                        node.setAttribute('selected', 'selected');
                        document.getElementById('visa_destination_id_hidden').value = i;
                    }
                }catch(err){

                }
            }else{
                try{
                    if(cache['visa']['destination'] == i){
                        node.setAttribute('selected', 'selected');
                        document.getElementById('visa_destination_id_hidden').value = i;
                    }
                }catch(err){
                    node.setAttribute('selected', 'selected');
                    document.getElementById('visa_destination_id_hidden').value = i;

                }
            }
            destination.add(node);
        }
//        visa_config = msg.destinations;
//        var destination = document.getElementById("visa_destination_id");
//        for(i in msg.destinations){
//
//        }
        get_consulate(type);

       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error visa config </span>' + errorThrown,
            })
            try{
                $("#show_loading_booking_airline").hide();
            }catch(err){}
       },timeout: 120000
    });
}

function visa_signin(data){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/visa",
       headers:{
            'action': 'signin',
       },
       data: {},
       success: function(msg) {
            if(msg.result.error_code == 0){
                signature = msg.result.response.signature;
                if(data == ''){
                    search_visa();
                }else if(data != ''){
                    visa_get_data(data);
                }
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
              html: '<span style="color: red;">Error visa signin </span>' + errorThrown,
            })
       },timeout: 60000
    });
}

function search_visa(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/visa",
       headers:{
            'action': 'search',
       },
       data: {
            'destination': document.getElementById('visa_destination_id_hidden').value,
            'departure_date': document.getElementById('visa_departure').value,
            'consulate': document.getElementById('visa_consulate_id_hidden').value,
            'signature': signature
       },
       success: function(msg) {
            console.log(msg);
            var node;
            try{
                visa = msg.result.response.list_of_visa;
                country = msg.result.response.country;
            }catch(err){}
            if(msg.result.error_code == 0 && msg.result.response.list_of_visa.length != 0){
                for(i in msg.result.response.list_of_visa){
                    //pax type
                    node = document.createElement("div");

                    text= `
                        <div style="background-color:white; border:1px solid #cdcdcd; margin-bottom:15px; padding:15px;" id="journey`+i+`">
                            <div class="row">
                                <div class="col-lg-12">
                                    <table style="width:100%" id="list-of-passenger">
                                        <tr>
                                            <th style="width:15%;">Pax Type</th>
                                            <th style="width:15%;">Visa Type</th>
                                            <th style="width:15%;">Entry Type</th>
                                            <th style="width:30%;">Regular Type</th>
                                            <th style="width:25%;">Input Qty</th>
                                        </tr>
                                        <tr>
                                            <td>`+msg.result.response.list_of_visa[i].pax_type[1]+`</td>
                                            <td>`+msg.result.response.list_of_visa[i].visa_type[1]+`</td>
                                            <td>`+msg.result.response.list_of_visa[i].entry_type[1]+`</td>
                                            <td>`+msg.result.response.list_of_visa[i].type.process_type[1]+` `+msg.result.response.list_of_visa[i].type.duration+` Day(s)</td>
                                            <td>`;
                                            if(template == 1){
                                                text+=`<div class="banner-right">`;
                                            }else if(template == 2){
                                                text+=`
                                                <div class="hotel-search-form-area" style="bottom:0px !important; padding-left:0px; padding-right:0px;">
                                                    <div class="hotel-search-form" style="background-color:unset; padding:unset; box-shadow:unset; color:white;">`;
                                            }
                                            text+=`
                                                <div class="form-wrap" style="padding:0px;">
                                                    <input style="margin-bottom:unset;" class="form-control" type="number" value="0" min="0" id="qty_pax_`+i+`" name="qty_pax_`+i+`" onchange="update_table('search');"/>
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
                                                    <a id="detail_button_journey0" data-toggle="collapse" data-parent="#accordiondepart" onclick="show_flight_details(`+i+`);" href="#detail_departjourney`+i+`" style="color: `+color+`;" aria-expanded="true">
                                                        <span style="text-align:left; font-weight: bold; display:none;" id="flight_details_up`+i+`"> Visa details <i class="fas fa-chevron-up" style="font-size:14px;"></i></span>
                                                        <span style="text-align:left; font-weight: bold; display:block;" id="flight_details_down`+i+`"> Visa details <i class="fas fa-chevron-down" style="font-size:14px;"></i></span>
                                                    </a>
                                                </div>
                                                <div class="col-lg-6">
                                                    <a id="detail_button_attachment0" data-toggle="collapse" data-parent="#accordiondepart" onclick="show_attachment_details(`+i+`);" href="#detail_attachment`+i+`" style="color: `+color+`;" aria-expanded="true">
                                                        <span style="text-align:left; font-weight: bold; display:none;" id="attach_details_up`+i+`"> Attachment details <i class="fas fa-chevron-up" style="font-size:14px;"></i></span>
                                                        <span style="text-align:left; font-weight: bold; display:block;" id="attach_details_down`+i+`"> Attachment details <i class="fas fa-chevron-down" style="font-size:14px;"></i></span>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-5 col-md-5 col-sm-6 col-xs-6" style="text-align:right;">
                                            <span id="fare`+i+`" class="basic_fare_field" style="font-size:16px;font-weight: bold; color:#505050;">`+msg.result.response.list_of_visa[i].sale_price.currency+` `+getrupiah(msg.result.response.list_of_visa[i].sale_price.total_price)+`</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="detail_departjourney`+i+`" class="panel-collapse in collapse show" aria-expanded="true" style="margin-top:15px; display: none;">
                                <hr/>
                                <div id="journey0segment0" style="background-color:white;">
                                    <h6>Consulate Address</h6>
                                    <span>`+msg.result.response.list_of_visa[i].consulate.address+`, `+msg.result.response.list_of_visa[i].consulate.city+`</span><hr>`;
                                    if(msg.result.response.list_of_visa[i].notes != '')
                                    text+=`
                                    <h6>Visa Required</h6>`;
                                    for(j in msg.result.response.list_of_visa[i].notes){
                                        text+=`<span>`+msg.result.response.list_of_visa[i].notes[j]+`</span><br/>`;
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
                            <div id="detail_attachment`+i+`" class="panel-collapse in collapse show" aria-expanded="true" style="margin-top:15px; display: none;">
                                <hr/>
                                <div id="attachment">
                                    <h6>Attachment</h6>`;
                                    for(j in msg.result.response.list_of_visa[i].attachments){
                                        text+=`<a href="`+msg.result.response.list_of_visa[i].attachments[j].url+`" style="padding-right:10px; color:`+color+`; font-size:14px; font-weight:500;" download><i class="fas fa-file-download"></i> `+msg.result.response.list_of_visa[i].attachments[j].name+`</a>`
                                    }
                                    text+=`
                                </div>
                            </div>
                        </div>`;
                    node.innerHTML = text;
                    document.getElementById("visa_ticket").appendChild(node);
                }
                update_table('search');
            }
            else{
                node = document.createElement("div");
                text= `
                <div style="background-color:white; border:1px solid #cdcdcd; margin-bottom:15px; padding: 15px 0px 15px 15px; text-align:center;">
                    <div class="row">
                        <div class="col-lg-12">
                            <h3><i class="fas fa-search"></i> VISA NOT FOUND</h3>
                        </div>
                    </div>
                </div>`;

                node.innerHTML = text;
                document.getElementById("show-visa-search").appendChild(node);
            }

            document.getElementById('loading-search-visa').hidden = true;

       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error visa search </span>' + errorThrown,
            })
       },timeout: 120000
    });
}

function sell_visa(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/visa",
       headers:{
            'action': 'sell_visa',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {

       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error visa sell </span>' + errorThrown,
            })
       },timeout: 60000
    });
}

function check_hold_booking(){
    error_log = '';
    for(i in passenger){
        if(i != 'booker' && i != 'contact'){
            for(k in passenger[i]){
                count_pax = parseInt(k) + 1;
                var radios = document.getElementsByName('adult_visa_type'+count_pax);
                visa_type = '';
                for (var j = 0, length = radios.length; j < length; j++) {
                    if(radios[j].checked == true){
                        visa_type = radios[j].value;
                    }
                }
                radios = document.getElementsByName('adult_entry_type'+count_pax);
                entry_type = '';
                for (var j = 0, length = radios.length; j < length; j++) {
                    if(radios[j].checked == true){
                        entry_type = radios[j].value;
                    }
                }
                radios = document.getElementsByName('adult_process_type'+count_pax);
                process_type = '';
                for (var j = 0, length = radios.length; j < length; j++) {
                    if(radios[j].checked == true){
                        process_type = radios[j].value;
                    }
                }

                if(visa_type == '')
                    error_log += 'Please fill visa for '+ i + ' passenger '+ count_pax + '<br/>\n';
                if(entry_type == '')
                    error_log += 'Please fill entry for '+ i + ' passenger '+ count_pax + '<br/>\n';
                if(process_type == '')
                    error_log += 'Please fill process for '+ i + ' passenger '+ count_pax + '<br/>\n';
            }
        }
    }
    if(error_log == ''){
        visa_pre_create_booking(1);
    }
    else{
        Swal.fire({
          type: 'error',
          title: 'Oops!',
          html: '<span style="color: red;">Error check hold booking </span><br/>' + error_log,
        })
        $('.next-loading').removeClass("running");
        $('.next-loading').prop('disabled', false);
        $('.payment_method').prop('disabled', false).niceSelect('update');
        $('.option').removeClass("disabled");
        $(".payment_acq *").prop('disabled',false);
        $("#waitingTransaction").modal('hide');
    }
}

function visa_pre_create_booking(val){
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
        visa_hold_booking(val);
      }
    })
}

function visa_hold_booking(val){
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
                var radios = document.getElementsByName(i+'_visa_type'+pax_count);
                visa_type = '';
                for (var j = 0, length = radios.length; j < length; j++) {
                    if(radios[j].checked == true){
                        visa_type = radios[j].value;
                    }
                }
                radios = document.getElementsByName(i+'_entry_type'+pax_count);
                entry_type = '';
                for (var j = 0, length = radios.length; j < length; j++) {
                    if(radios[j].checked == true){
                        entry_type = radios[j].value;
                    }
                }
                radios = document.getElementsByName(i+'_process_type'+pax_count);
                process_type = '';
                for (var j = 0, length = radios.length; j < length; j++) {
                    if(radios[j].checked == true){
                        process_type = radios[j].value;
                    }
                }
                for(j in visa.list_of_visa){ //list of visa
                    if(visa.list_of_visa[j].pax_type[0] == passenger[i][k].pax_type &&
                    visa.list_of_visa[j].visa_type[0] == visa_type &&
                    visa.list_of_visa[j].type.process_type[0] == process_type &&
                    visa.list_of_visa[j].entry_type[0] == entry_type &&
                    document.getElementById(visa.list_of_visa[j].pax_type[1].toLowerCase()+'_check'+pax_count).value == visa.list_of_visa[j].sequence){
                        required = [];
                        for(count in visa.list_of_visa[j].requirements){
                            required.push({
                                'is_original': document.getElementById(i+'_required'+pax_count+'_'+count+'_original').checked,
                                'is_copy': document.getElementById(i+'_required'+pax_count+'_'+count+'_copy').checked,
                                'id': visa.list_of_visa[j].requirements[count].id
                            });

                        }
                        data_pax.push({
                            'id':visa.list_of_visa[j].id.toString(),
                            'required': required,
                            'notes': document.getElementById('notes_'+i+pax_count).value
                        });
                    }
                }
            }
        }
    }
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/visa",
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
                set_payment('Issued','visa');
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            $("#waitingTransaction").modal('hide');
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error visa update passenger </span>' + errorThrown,
            })
       },timeout: 60000
    });
}

function update_contact(){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/visa",
       headers:{
            'action': 'update_contacts',
       },
       data: {
            'signature': signature
       },
       success: function(msg) {
           console.log(msg);
            if(msg.result.error_code == 0){
                commit_booking();
            }else{
                $("#waitingTransaction").modal('hide');
                close_div('payment_acq');
                set_payment('Issued','visa');
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error visa update search </span>' + errorThrown,
            })
       },timeout: 60000
    });
}

function commit_booking(){
    data = {
        'force_issued': 'false',
        'signature': signature,
        'voucher_code': ''
    }
    try{
        data['seq_id'] = payment_acq2[payment_method][selected].seq_id;
        data['member'] = payment_acq2[payment_method][selected].method;
        data['voucher_code'] = voucher_code;
    }catch(err){
    }
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/visa",
       headers:{
            'action': 'commit_booking',
       },
       data: data,
       success: function(msg) {
            console.log(msg);
            if(msg.result.error_code == 0){
                document.getElementById('order_number').value = msg.result.response.journey.name;
                document.getElementById('visa_booking').submit();
            }else{
                $("#waitingTransaction").modal('hide');
                close_div('payment_acq');
                set_payment('Issued','visa');
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            $("#waitingTransaction").modal('hide');
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error visa commit booking </span>' + errorThrown,
            })
       },timeout: 180000
    });
}

function visa_get_data(data){
    price_arr_repricing = {};
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/visa",
       headers:{
            'action': 'get_booking',
       },
       data: {
            'order_number': data,
            'signature': signature
       },
       success: function(msg) {
            console.log(msg);
            if(msg.result.error_code == 0){
                visa = msg.result.response;
                var cur_state = msg.result.response.journey.state;
                var cur_state_visa = msg.result.response.journey.state_visa;
                if(cur_state == 'booked'){
                    conv_status = 'Booked';
                    document.getElementById('order_state').innerHTML = 'Your Order Has Been ' + conv_status;
                }
                else if(cur_state == 'issued'){
                    conv_status = 'Issued';
                    document.getElementById('issued-breadcrumb').classList.add("br-active");
                    document.getElementById('issued-breadcrumb-icon').classList.add("br-icon-active");
                    document.getElementById('issued-breadcrumb-icon').innerHTML = `<i class="fas fa-check"></i>`;
                    document.getElementById('order_state').innerHTML = 'Your Order Has Been ' + conv_status;
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

                conv_status_visa = {
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
                            <div id="visa_booking_detail" style="border:1px solid #cdcdcd; padding:10px; background-color:white">
                                <h6>Order Number : `+visa.journey.name+`</h6><br/>
                                 <table style="width:100%;">
                                    <tr>
                                        <th>Visa Status</th>
                                        <th>Order Status</th>
                                    </tr>
                                    <tr>
                                        <td>`+visa.journey.state_visa+`</td>
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
                                <h4> Visa Information </h4>
                                <hr/>
                                <h4>`+visa.journey.country+`</h4>
                                <span><i class="fa fa-calendar" aria-hidden="true"></i>
                                `+visa.journey.departure_date+`
                                </span>
                                <br/>
                                <br/>
                                <span>Payment Status: `+visa.journey.payment_status+`</span>
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
                                for(j in msg.result.response.passengers[i].visa.price){
                                    if(j == 'TOTAL'){
                                        price['FARE'] += msg.result.response.passengers[i].visa.price[j].amount;
                                        price['currency'] += msg.result.response.passengers[i].visa.price[j].currency;
                                    }else if(j == 'RAC'){
                                        price[j] += msg.result.response.passengers[i].visa.price[j].amount;
                                        price['currency'] += msg.result.response.passengers[i].visa.price[j].currency;
                                    }else if(j == 'CSC'){
                                        price['CSC'] = msg.result.response.passengers[i].visa.price[j].amount;

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
                                                <span>`+msg.result.response.passengers[i].visa.visa_type+`/`+msg.result.response.passengers[i].visa.entry_type+`/`+msg.result.response.passengers[i].visa.process+`</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
                                        console.log(msg.result.response.passengers[i]);
                                        for(j in msg.result.response.passengers[i].visa.requirement){
                                            if(template != 2){
                                                text+=`
                                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">`;
                                            }else{
                                                text+=`
                                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="margin-bottom:20px;">`;
                                            }
                                            text+=`
                                                <label><b>`+parseInt(parseInt(j)+1)+` `+msg.result.response.passengers[i].visa.requirement[j].name+`</b></label><br/>
                                            </div>
                                            <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">`;
                                                if(msg.result.response.passengers[i].visa.requirement[j].is_original == false){
                                                    text+=`
                                                    <label class="check_box_custom">
                                                        <span style="font-size:13px;"></span>
                                                        <input type="checkbox" disabled/>
                                                        <span class="check_box_span_custom"></span>
                                                    </label>`;
                                                }else if(msg.result.response.passengers[i].visa.requirement[j].is_original == true){
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
                                                if(msg.result.response.passengers[i].visa.requirement[j].is_copy == false){
                                                    text+=`
                                                    <label class="check_box_custom">
                                                        <span style="font-size:13px;"></span>
                                                        <input type="checkbox" disabled/>
                                                        <span class="check_box_span_custom"></span>
                                                    </label>`;
                                                }else if(msg.result.response.passengers[i].visa.requirement[j].is_copy == true){
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
                                    if(msg.result.response.passengers[i].visa.hasOwnProperty('interview') == true && msg.result.response.passengers[i].visa.interview.interview_list.length > 0 ){
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
                                            for(j in msg.result.response.passengers[i].visa.interview.interview_list){
                                                text+=`
                                            <tr>
                                                <td>`+parseInt(parseInt(j)+1)+`</td>
                                                <td>`+msg.result.response.passengers[i].visa.interview.interview_list[j].location+`</td>
                                                <td>`+msg.result.response.passengers[i].visa.interview.interview_list[j].meeting_point+`</td>
                                                <td>`+msg.result.response.passengers[i].visa.interview.interview_list[j].ho_employee+`</td>
                                                <td>`+msg.result.response.passengers[i].visa.interview.interview_list[j].datetime+`</td>
                                                <td>`+msg.result.response.passengers[i].visa.interview.needs+`</td>
                                            </tr>`;
                                            }
                                        text+=`</table>
                                        </div>`;
                                    }
                                    if(msg.result.response.passengers[i].visa.hasOwnProperty('biometrics') == true && msg.result.response.passengers[i].visa.biometrics.biometrics_list.length > 0 ){
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
                                            for(j in msg.result.response.passengers[i].visa.biometrics.biometrics_list){
                                                text+=`
                                            <tr>
                                                <td>`+parseInt(parseInt(j)+1)+`</td>
                                                <td>`+msg.result.response.passengers[i].visa.biometrics.biometrics_list[j].location+`</td>
                                                <td>`+msg.result.response.passengers[i].visa.biometrics.biometrics_list[j].meeting_point+`</td>
                                                <td>`+msg.result.response.passengers[i].visa.biometrics.biometrics_list[j].ho_employee+`</td>
                                                <td>`+msg.result.response.passengers[i].visa.biometrics.biometrics_list[j].datetime+`</td>
                                                <td>`+msg.result.response.passengers[i].visa.biometrics.needs+`</td>
                                            </tr>`
                                            }
                                        text+=`</table>
                                    </div>`;
                                }
                                text+=`
                                </div>
                                <div class="row" style="margin-top:10px;">
                                    <div class="col-lg-4">`;
                                    if(visa.journey.state == 'booked' || visa.journey.state == 'issued')
                                    text+=`
                                        <a class="print-booking-train ld-ext-right" style="color:white;">
                                            <input type="button" class="primary-btn" id="button-print-print" style="width:100%;" value="Visa Handling" onclick="get_printout('`+msg.result.response.journey.name+`', 'visa_cust','visa');" />
                                            <div class="ld ld-ring ld-cycle"></div>
                                        </a>`;
                                    text+=`</div>
                                    <div class="col-lg-4">`;
                                    if(visa.journey.state == 'booked')
                                    text+=`
                                        <a class="print-booking-train ld-ext-right" style="color:white;">
                                            <input type="button" class="primary-btn" id="button-print-print" style="width:100%;" value="Itinerary" onclick="get_printout('`+msg.result.response.journey.name+`', 'itinerary','visa');" />
                                            <div class="ld ld-ring ld-cycle"></div>
                                        </a>`;
                                        text+=`
                                    </div>
                                    <div class="col-lg-4">`;
                                    if(visa.journey.state == 'issued')
                                        text+=`
                                        <a class="issued-booking-train ld-ext-right" style="color:white;">
                                            <input type="button" class="primary-btn" id="button-issued-print" style="width:100%;" data-toggle="modal" data-target="#printInvoice" value="Print Invoice"/>
                                            <div class="ld ld-ring ld-cycle"></div>
                                        </a>
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
                                                            <input type="button" class="primary-btn" id="button-issued-print" style="width:30%;" value="Submit" onclick="get_printout('`+msg.result.response.journey.name+`', 'invoice','visa');"/>
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
                document.getElementById('visa_booking').innerHTML = text;
                update_table('booking');
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
            $("#waitingTransaction").modal('hide');
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error visa data </span>' + errorThrown,
            })
       },timeout: 60000
    });
}

function update_service_charge(){
    upsell = []
    for(i in visa.passengers){
        for(j in visa.passengers[i].sale_service_charges){
            currency = visa.passengers[i].sale_service_charges[j].TOTAL.currency;
        }
        list_price = []
        console.log(list);
        for(j in list){
            if(visa.passengers[i].first_name + ' ' + visa.passengers[i].last_name == document.getElementById('selection_pax'+j).value){
                list_price.push({
                    'amount': list[j],
                    'currency_code': currency
                });
            }

        }
        upsell.push({
            'sequence': visa.passengers[i].sequence,
            'pricing': JSON.parse(JSON.stringify(list_price))
        });
    }
    console.log(upsell);
    $.ajax({
       type: "POST",
       url: "/webservice/visa",
       headers:{
            'action': 'update_service_charge',
       },
       data: {
           'order_number': visa.journey.name,
           'passengers': JSON.stringify(upsell),
           'signature': signature
       },
       success: function(msg) {
           console.log(msg);
           if(msg.result.error_code == 0){
                price_arr_repricing = {};
                pax_type_repricing = [];
                visa_get_data(order_number);
                $('#myModalRepricing').modal('hide');
           }else if(msg.result.error_code == 4003 || msg.result.error_code == 4002){
                logout();
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
            Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: '<span style="color: red;">Error airline service charge </span>' + errorThrown,
            })
            $('.loader-rodextrip').fadeOut();
       },timeout: 60000
    });

}