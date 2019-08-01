visa = '';


function get_visa_config(type){
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/visa",
       headers:{
            'action': 'get_config',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {},
       success: function(msg) {

        if(type == 'search')
            visa_signin('');
        visa_config = msg;
        destination = document.getElementById('visa_destination_id');
        for(i in msg){
            console.log(i)
            var node = document.createElement("option");
            node.text = i;
            node.value = i;
            if(type == 'search'){
                try{
                    console.log(i);
                    console.log(visa_request['destination']);
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
                    if('Albania' == i){
                        node.setAttribute('selected', 'selected');
                        document.getElementById('visa_destination_id_hidden').value = i;
                    }
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
           alert(errorThrown);
       }
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
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {},
       success: function(msg) {
            if(data == ''){
                search_visa();
            }else if(data != ''){
                visa_get_data(data);
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
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
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {
            'destination': document.getElementById('visa_destination_id_hidden').value,
            'departure_date': document.getElementById('visa_departure').value,
            'consulate': document.getElementById('visa_consulate_id_hidden').value
       },
       success: function(msg) {
            console.log(msg);
            var node;
            if(msg.result.error_code == 0 && msg.result.response.list_of_visa.length != 0){
                for(i in msg.result.response.list_of_visa){
                    //pax type
                    node = document.createElement("div");

                    text= `
                        <div style="background-color:white; border:1px solid #cdcdcd; margin-bottom:15px; padding-top:15px; padding-left:15px;" id="journey`+i+`">
                            <div class="row">
                                <div class="col-lg-9">
                                    <table style="width:100%" id="list-of-passenger">
                                        <tr>
                                            <th>Pax Type</th>
                                            <th>Visa Type</th>
                                            <th>Entry Type</th>
                                            <th>Regular Type</th>
                                        </tr>
                                        <tr>
                                            <td>`+msg.result.response.list_of_visa[i].pax_type[1]+`</td>
                                            <td>`+msg.result.response.list_of_visa[i].visa_type[1]+`</td>
                                            <td>`+msg.result.response.list_of_visa[i].entry_type[1]+`</td>
                                            <td>`+msg.result.response.list_of_visa[i].type.process_type[1]+` `+msg.result.response.list_of_visa[i].type.duration+` Day(s)</td>
                                        </tr>
                                    </table>
                                    <div style="margin-top:10px; margin-bottom:10px;">
                                        <label>Qty : </label>
                                        <div class="banner-right">
                                            <div class="form-wrap" style="padding:0px;">
                                                <input class="form-control" type="text" id="qty_pax_`+i+`" name="qty_pax_`+i+`" onchange="update_table('search');"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-3">
                                    <div class="row">
                                        <div class="col-lg-12" style="text-align:right; padding:0px 15px 10px 0px;">
                                            <span id="fare`+i+`" class="basic_fare_field" style="font-size:16px;font-weight: bold; color:#505050; padding:10px;">`+msg.result.response.list_of_visa[i].sale_price.currency+` `+getrupiah(msg.result.response.list_of_visa[i].sale_price.total_price)+`</span>

                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-12" style="text-align:right; padding:0px 15px 10px 0px;">
                                    <a id="detail_button_journey0" data-toggle="collapse" data-parent="#accordiondepart" onclick="show_flight_details(`+i+`);" href="#detail_departjourney`+i+`" style="color: #f15a22;" aria-expanded="true">
                                        <span style="text-align:right; margin-right:10px; font-weight: bold; display:none;" id="flight_details_up`+i+`"> Visa details <i class="fas fa-chevron-up" style="font-size:14px;"></i></span>
                                        <span style="text-align:right; margin-right:10px; font-weight: bold; display:block;" id="flight_details_down`+i+`"> Visa details <i class="fas fa-chevron-down" style="font-size:14px;"></i></span>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div id="detail_departjourney`+i+`" class="panel-collapse in collapse show" aria-expanded="true" style="margin-bottom: 15px; border-top: 1px solid rgb(241, 90, 34); display: none;">
                            <div id="journey0segment0" style="padding:10px; background-color:white; border-left:1px solid #cdcdcd; border-right:1px solid #cdcdcd; border-bottom:1px solid #cdcdcd;">
                                <h6>Consulate Address</h6>
                                <span>`+msg.result.response.list_of_visa[i].consulate.address+`, `+msg.result.response.list_of_visa[i].consulate.city+`</span><hr>
                                <h6>Visa Required</h6>`;
                                for(j in msg.result.response.list_of_visa[i].requirements){
                                    text+=`<span>`+parseInt(parseInt(j)+1)+` `+msg.result.response.list_of_visa[i].requirements[j].name;
                                    if(msg.result.response.list_of_visa[i].requirements[j].description != '')
                                        text+=
                                        `, `+msg.result.response.list_of_visa[i].requirements[j].description+`</span><br/>
                                    `;
                                    else
                                        text+='<span> - </span><br/>';
                                }

                                text+=`

                            </div>
                        </div>
                    `;
                    node.innerHTML = text;
                    document.getElementById("visa_ticket").appendChild(node);
                }
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
            visa = msg.result.response.list_of_visa;
            country = msg.result.response.country;
            document.getElementById('loading-search-visa').hidden = true;
            update_table('search');
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
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
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {},
       success: function(msg) {

       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
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
                    error_log += 'Please fill visa for '+ i + ' passenger '+ count_pax + '\n';
                if(entry_type == '')
                    error_log += 'Please fill entry for '+ i + ' passenger '+ count_pax + '\n';
                if(process_type == '')
                    error_log += 'Please fill process for '+ i + ' passenger '+ count_pax + '\n';
            }
        }
    }
    if(error_log == '')
        visa_hold_booking(1);
    else
        alert(error_log)
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
                console.log(passenger[i][k]);
                console.log(k);
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
                console.log(visa_type);
                radios = document.getElementsByName(i+'_entry_type'+pax_count);
                entry_type = '';
                for (var j = 0, length = radios.length; j < length; j++) {
                    if(radios[j].checked == true){
                        entry_type = radios[j].value;
                    }
                }
                console.log(entry_type);
                radios = document.getElementsByName(i+'_process_type'+pax_count);
                process_type = '';
                for (var j = 0, length = radios.length; j < length; j++) {
                    if(radios[j].checked == true){
                        process_type = radios[j].value;
                    }
                }
                console.log(process_type);
                for(j in visa.list_of_visa){ //list of visa
                    if(visa.list_of_visa[j].pax_type[0] == passenger[i][k].pax_type &&
                    visa.list_of_visa[j].visa_type[0] == visa_type &&
                    visa.list_of_visa[j].type.process_type[0] == process_type &&
                    visa.list_of_visa[j].entry_type[0] == entry_type){
                        required = [];
                        for(count in visa.list_of_visa[j].requirements){
                            if(visa.list_of_visa[j].requirements[count].required == true){
                                required.push({
                                    'is_original': document.getElementById(i+'_required'+pax_count+'_'+count+'_original').checked,
                                    'is_copy': document.getElementById(i+'_required'+pax_count+'_'+count+'_copy').checked,
                                    'id': visa.list_of_visa[j].requirements[count].id
                                });
                            }
                        }
                        console.log(visa.list_of_visa[j]);
                        data_pax.push({
                            'id':visa.list_of_visa[j].id.toString(),
                            'required': required
                        });
                    }
                }
            }
        }
    }
    console.log(data_pax);
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/visa",
       headers:{
            'action': 'update_passengers',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {
            'id': JSON.stringify(data_pax)
       },
       success: function(msg) {
            console.log(msg);
            if(msg.result.error_code == 0){
                update_contact();
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
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
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {},
       success: function(msg) {
           console.log(msg);
            if(msg.result.error_code == 0){
                commit_booking();
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

function commit_booking(){
    console.log('here');
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/visa",
       headers:{
            'action': 'commit_booking',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {
            'force_issued': 'true'
       },
       success: function(msg) {
            console.log(msg);
            if(msg.result.error_code == 0){
                document.getElementById('order_number').value = msg.result.response.id;
                document.getElementById('visa_booking').submit();
            }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}

function visa_get_data(data){
    console.log('here');
    getToken();
    $.ajax({
       type: "POST",
       url: "/webservice/visa",
       headers:{
            'action': 'get_booking',
       },
//       url: "{% url 'tt_backend_skytors:social_media_tree_update' %}",
       data: {
            'order_number': data
       },
       success: function(msg) {
            console.log(msg);
            if(msg.result.error_code == 0){
                visa = msg.result.response;
                text= '';

                /* contact*/
                text+=`<div class="row">
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
                                    <td>`+msg.result.response.contact.first_name+` `+msg.result.response.contact.last_name+`</td>
                                    <td>`+msg.result.response.contact.email+`</td>
                                    <td>`+msg.result.response.contact.phone_number+`</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>`;
                /*pax*/
                text+=`
                <div class="row" style="padding-top:20px;">
                    <div class="col-lg-12">
                        <div style="border:1px solid #cdcdcd; background-color:white; padding:15px;">
                            <h4>List of Passenger(s)</h4>
                            <hr/>`;
                            for(i in msg.result.response.passengers){
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
                                            <span>`+msg.result.response.passengers[i].visa.immigration_consulate+`</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-4">
                                    <h6>Visa Type</h6>
                                    <label class="radio-button-custom">
                                        <span>`+msg.result.response.passengers[i].visa.visa_type+`</span>
                                    </label><br/>
                                </div>
                                <div class="col-lg-4">
                                    <h6>Entry Type</h6>
                                    <label class="radio-button-custom">
                                        <span>`+msg.result.response.passengers[i].visa.entry_type+`</span>
                                    </label><br/>
                                </div>
                                <div class="col-lg-4">
                                    <h6>Process Type</h6>
                                    <label class="radio-button-custom">
                                        <span>`+msg.result.response.passengers[i].visa.process+`</span>
                                    </label><br/>
                                </div>
                            </div>
                            <div class="row" style="margin-top:10px;">
                                <div class="col-lg-6">
                                    <h6>Required</h6>
                                    <div id="adult_required{{counter}}">
                                        `;
                                    for(j in msg.result.response.passengers[i].visa.requirement){
                                        text+=`<label><b>`+parseInt(j+1)+` `+msg.result.response.passengers[i].visa.requirement[j].name+`</b></label><br/>`;
                                    }
                                    text+=`
                                    </div>
                                </div>
                                <div class="col-lg-3" style="text-align:right;">
                                    <h6>Price</h6>
                                    <div id="adult_price{{counter}}">
                                        <label>`+msg.result.response.passengers[i].visa.price.FARE.currency+` `+msg.result.response.passengers[i].visa.price.FARE.amount+`</label>
                                    </div>
                                </div>
                            </div>`;
                            }
                            text+=`
                        </div>
                    </div>
                </div>`;
                document.getElementById('visa_booking').innerHTML = text;
                update_table('booking');
            }
            console.log(msg);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
       }
    });
}