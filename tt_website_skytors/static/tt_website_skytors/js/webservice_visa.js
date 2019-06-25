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
        console.log(msg);
        visa_config = msg.destinations;
        var destination = document.getElementById("visa_destination_id");
        for(i in msg.destinations){
            var node = document.createElement("option");
            node.text = msg.destinations[i].country;
            node.value = msg.destinations[i].country;
            if(type == 'search'){
                try{
                    if(visa_request['destination'] == msg.destinations[i].country){
                        node.setAttribute('selected', 'selected');
                        document.getElementById('visa_destination_id_hidden').value = msg.destinations[i].country;
                    }
                }catch(err){

                }
            }else{
                try{
                    if(cache['visa']['destination'] == msg.destinations[i].country){
                        node.setAttribute('selected', 'selected');
                        document.getElementById('visa_destination_id_hidden').value = msg.destinations[i].country;
                    }
                }catch(err){
                    if('Australia' == msg.destinations[i].country){
                        node.setAttribute('selected', 'selected');
                        document.getElementById('visa_destination_id_hidden').value = msg.destinations[i].country;
                    }
                }
            }
            destination.add(node);
        }
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
            console.log(msg);
            console.log(data);
            if(data == ''){
                search_visa();
            }else if(data != ''){

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
            if(msg.result.error_code == 0){
                for(i in msg.result.response.list_of_visa){
                    //pax type
                    node = document.createElement("div");

                    text= `
                        <div style="background-color:white; margin-bottom:15px;" id="journey`+i+`">
                            <div class="row">
                                <div class="col-lg-9">
                                    <div class="col-lg-12">
                                        <table style="width:100%">
                                            <tr>
                                                <td>Pax Type</td>
                                                <td>Visa Type</td>
                                                <td>Entry Type</td>
                                                <td>Regular Type</td>
                                            </tr>
                                            <tr>
                                                <td>`+msg.result.response.list_of_visa[i].pax_type[1]+`</td>
                                                <td>`+msg.result.response.list_of_visa[i].visa_type[1]+`</td>
                                                <td>`+msg.result.response.list_of_visa[i].entry_type[1]+`</td>
                                                <td>`+msg.result.response.list_of_visa[i].type.process_type[1]+` `+msg.result.response.list_of_visa[i].type.duration+` Day(s)</td>
                                            </tr>
                                        </table>
                                        <div class="row">
                                            <label>Qty: </label>
                                            <input type="text" id="qty_pax_`+i+`" name="qty_pax_`+i+`" onchange="update_table('search');"/>
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
                                        <span style="text-align:right; margin-right:10px; font-weight: bold; display:none;" id="flight_details_up0"> Flight details <i class="fas fa-chevron-up" style="font-size:14px;"></i></span>
                                        <span style="text-align:right; margin-right:10px; font-weight: bold; display:block;" id="flight_details_down0"> Flight details <i class="fas fa-chevron-down" style="font-size:14px;"></i></span>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div id="detail_departjourney`+i+`" class="panel-collapse in collapse show" aria-expanded="true" style="margin-bottom: 15px; border-top: 1px solid rgb(241, 90, 34); display: none;">
                            <div id="journey0segment0" style="padding:0px 10px 10px 10px; background-color:white;">
                                <span style="font-weight: bold;">Consulate Address</span><br/>
                                <span>`+msg.result.response.list_of_visa[i].consulate.address+`, `+msg.result.response.list_of_visa[i].consulate.city+`</span><hr>
                                <br/>
                                <span style="font-weight: bold;">Visa Required</span><br/>`;
                                for(j in msg.result.response.list_of_visa[i].requirements){
                                    text+=`<span>`+parseInt(parseInt(j)+1)+` `+msg.result.response.list_of_visa[i].requirements[j].name;
                                    if(msg.result.response.list_of_visa[i].requirements[j].description != '')
                                        text+=
                                        `, `+msg.result.response.list_of_visa[i].requirements[j].description+`</span><br/>
                                    `;
                                    else
                                        text+='<span><br/>';
                                }

                                text+=`

                            </div>
                        </div>
                    `;
                    node.innerHTML = text;
                    document.getElementById("visa_ticket").appendChild(node);
                }
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