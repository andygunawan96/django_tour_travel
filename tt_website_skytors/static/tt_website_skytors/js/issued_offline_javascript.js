class_of_service = [
    [
        'eco', 'Economy Class'
    ],[
        'pre', 'Premium Economy'
    ],[
        'bus', 'Business Class'
    ]
]

var myVarCarrier;
var myVarOriginDestination;

function search_carrier(){
    clearTimeout(myVarCarrier);
    myVarCarrier = setTimeout(function() {
        find = '';
        find = document.getElementById('carrier_name').value.toLowerCase();
        document.getElementById("list_carrier_name").innerHTML = '';
        if(find.length>1){
            console.log(find);
            text = '';
            issued_offline_data.carrier_id.forEach((obj)=> {
              if(obj.name.toString().toLowerCase().search(find) !== -1 || obj.code.toString().toLowerCase().search(find) !== -1){
                node = document.createElement("div");
                node.innerHTML = `<option value="`+obj.name+`">`+obj.code+`</option>`;
                document.getElementById("list_carrier_name").appendChild(node);
              }
            });
        }
    }, 500);
}

function issued_offline_price(){
    total_price = 0;
    insentif = 0;
    if(document.getElementById('total_sale_price').value != '')
        total_price = parseInt(document.getElementById('total_sale_price').value);
    if(document.getElementById('insentif').value != '')
        insentif = parseInt(document.getElementById('insentif').value);
    document.getElementById('agent_nta_price').innerHTML = 'IDR ' + getrupiah(insentif);

    document.getElementById('nta_price').innerHTML = 'IDR ' + getrupiah(parseInt(document.getElementById('total_sale_price').value) - parseInt(document.getElementById('insentif').value));
}


function search_origin_departure(val,sequence){
    clearTimeout(myVarOriginDestination);
    myVarOriginDestination = setTimeout(function() {
        find = '';
        console.log(val);
        console.log(sequence);
        if(val == 'origin'){
            find = document.getElementById(val+sequence).value.toLowerCase();
            document.getElementById("airline_origin_name"+sequence).innerHTML = '';
        }else if(val == 'destination'){
            find = document.getElementById(val+sequence).value.toLowerCase();
            document.getElementById("airline_destination_name"+sequence).innerHTML = '';
        }
        if(find.length>1){
            text = '';
            destination.forEach((obj)=> {
              if(obj.name.toString().toLowerCase().search(find) !== -1 || obj.code.toString().toLowerCase().search(find) !== -1){
                node = document.createElement("div");
                node.innerHTML = `<option value="`+obj.code + ` - ` + obj.name+`">`+obj.code+`</option>`;
                if(val == 'origin')
                    document.getElementById("airline_origin_name"+sequence).appendChild(node);
                else if(val == 'destination')
                    document.getElementById("airline_destination_name"+sequence).appendChild(node);
              }
            });
        }
    }, 500);
}

function change_transaction_type(){
    if(document.getElementById('transaction_type').value  == 'airline' || document.getElementById('transaction_type').value  == 'train'){
        document.getElementById('show_line').hidden = false;
    }else{
        document.getElementById('show_line').hidden = true;
    }
}

function add_table_of_passenger(){
    text= '';
    var node = document.createElement("tr");
    text += `
        <td>`+(parseInt(counter_passenger)+1)+`</td>
        <td>
            <span id='name_pax`+counter_passenger+`' name='name_pax`+counter_passenger+`'></span>
            <input id="id_passenger`+counter_passenger+`" name="id_passenger`+counter_passenger+`" type="hidden"/>
        </td>
        <td>
            <span id='pax_type`+counter_passenger+`' name='pax_type`+counter_passenger+`'></span>
        </td>
        `;
    text += `
        <td>
            <div style="text-align:center;">
                <button type="button" class="primary-btn" style="border-radius: 28px; margin-bottom:5px;" data-toggle="modal" data-target="#myModalPassenger`+counter_passenger+`"><i class="fas fa-plus"></i></button>
            </div>
            <!-- Modal -->
            <div class="modal fade" id="myModalPassenger`+counter_passenger+`" role="dialog">
                <div class="modal-dialog">

                  <!-- Modal content-->
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title">Passenger `+(counter_passenger+1)+`</h4>
                            <button type="button" class="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div class="modal-body">
                            <div class="col-lg-12" id="radio_airline_search" style="padding:0px; text-align:left;margin-bottom:10px;">
                                <label class="radio-button-custom">
                                    <span style="font-size:14px;">Search</span>
                                    <input type="radio" checked="checked" id="radio_passenger_search`+parseInt(counter_passenger+1)+`" name="radio_passenger`+parseInt(counter_passenger+1)+`" value="search" onclick="radio_button('passenger',`+(counter_passenger+1)+`);">
                                    <span class="checkmark-radio"></span>
                                </label>
                                <label class="radio-button-custom">
                                    <span style="font-size:14px;">Input</span>
                                    <input type="radio" id="radio_passenger_input`+parseInt(counter_passenger+1)+`" name="radio_passenger`+parseInt(counter_passenger+1)+`" value="create" onclick="radio_button('passenger',`+(counter_passenger+1)+`);">
                                    <span class="checkmark-radio"></span>
                                </label>
                            </div>
                            <div id="passenger_content">
                                <div id="passenger_search`+parseInt(counter_passenger+1)+`">
                                    <input type="text" id="train`+(counter_passenger+1)+`_search" placeholder="Search" />
                                    <button type="button" class="btn btn-default" onclick="search_passenger('','`+(counter_passenger+1)+`','issued_offline')">Search</button>
                                    <div id="search_result`+(counter_passenger+1)+`" style="overflow:auto;height:200px;">

                                    </div>
                                </div>
                                <div id="passenger_input`+parseInt(counter_passenger+1)+`" style="background-color:white;" hidden>
                                    <div class="col-lg-12">
                                        <div style="background-color:#f15a22; padding:5px; cursor: pointer; box-shadow: 0px 5px #888888;">
                                            <div class="row">
                                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                                                    <span style="color:white; text-align:center; font-size:15px;">Passenger - `+parseInt(counter_passenger+1)+`</span>
                                                </div>
                                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">

                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-12" style="background-color:white; padding:10px; border:1px solid #f15a22;" id="adult_paxs`+parseInt(counter_passenger+1)+`">
                                            <div class="row">
                                                <div class="col-lg-6 col-md-6 col-sm-6" style="text-align:left;">
                                                    <div class="input-container-search-ticket">
                                                    </div>
                                                </div>
                                                <div class="col-lg-6 col-md-6 col-sm-6" style="text-align:right;">

                                                </div>
                                                <div class="col-lg-6 col-md-6 col-sm-6">
                                                    <label>Title</label>
                                                    <div class="input-container-search-ticket">
                                                        <div class="form-select-2">
                                                            <select id="adult_title`+parseInt(counter_passenger+1)+`" name="adult_title`+parseInt(counter_passenger+1)+`">`;
                                                                for(i in titles){
                                                                    text+= `<option>`+titles[i]+`</option>`;
                                                                }
                                                            text+=`</select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-lg-6 col-md-6 col-sm-6" style="float:left;"></div>
                                                <div class="col-lg-6 col-md-6 col-sm-6">
                                                    <br/>
                                                    <label>First name and middle name (if any)</label>
                                                    <div class="input-container-search-ticket">
                                                        <input type="text" class="form-control" name="adult_first_name`+parseInt(counter_passenger+1)+`" id="adult_first_name`+parseInt(counter_passenger+1)+`" placeholder="First Name " onfocus="this.placeholder = ''" onblur="this.placeholder = 'First Name '">
                                                        <input type="hidden" class="form-control" name="adult_id`+parseInt(counter_passenger+1)+`" id="adult_id`+parseInt(counter_passenger+1)+`">
                                                    </div>
                                                    <label style="font-size:12px; padding:0;">As on Identity Card or Passport without title and punctuation</label>
                                                </div>
                                                <div class="col-lg-6 col-md-6 col-sm-6">
                                                    <br/>
                                                    <label>Last name</label>
                                                    <div class="input-container-search-ticket">
                                                        <input type="text" class="form-control" name="adult_last_name`+parseInt(counter_passenger+1)+`" id="adult_last_name`+parseInt(counter_passenger+1)+`" placeholder="Last Name " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Last Name '">
                                                    </div>
                                                    <label style="font-size:12px; padding:0;">As on Identity Card or Passport without title and punctuation</label>
                                                </div>
                                                <div class="col-lg-6 col-md-6 col-sm-6">
                                                    <label>Nationality</label>
                                                    <div class="input-container-search-ticket">
                                                        <div class="form-select">
                                                            <select id="adult_nationality`+parseInt(counter_passenger+1)+`" name="adult_nationality`+parseInt(counter_passenger+1)+`">`;
                                                                for(i in countries){
                                                                    if(countries[i].code == 'ID')
                                                                       text+=`<option value="`+countries[i].code+`" selected>`+countries[i].name+`</option>`;
                                                                    else
                                                                       text+=`<option value="`+countries[i].code+`">`+countries[i].name+`</option>`;
                                                                }
                                                            text+=`</select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-lg-6 col-md-6 col-sm-6">
                                                    <label>Birth Date</label>
                                                    <div class="input-container-search-ticket">
                                                        <input type="text" class="form-control date-picker-birth" name="adult_birth_date`+parseInt(counter_passenger+1)+`" id="adult_birth_date`+parseInt(counter_passenger+1)+`" onchange="check_years_old(`+parseInt(counter_passenger+1)+`)" placeholder="Birth Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Birth Date '" autocomplete="off">
                                                        <input type="hidden" class="form-control" name="adult_years_old`+parseInt(counter_passenger+1)+`" id="adult_years_old`+parseInt(counter_passenger+1)+`">
                                                    </div>
                                                </div>
                                                <div class="col-lg-6 col-md-6 col-sm-6">
                                                    <label>Passport Number</label>
                                                    <div class="input-container-search-ticket">
                                                        <input type="text" class="form-control" name="adult_passport_number`+parseInt(counter_passenger+1)+`" id="adult_passport_number`+parseInt(counter_passenger+1)+`" placeholder="Passport Number " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Passport Number '">
                                                    </div>
                                                </div>
                                                <div class="col-lg-6 col-md-6 col-sm-6">
                                                    <label>Passport Expired Date</label>
                                                    <div class="input-container-search-ticket">
                                                        <input type="text" class="form-control date-picker-passport" name="adult_passport_expired_date`+parseInt(counter_passenger+1)+`" id="adult_passport_expired_date`+parseInt(counter_passenger+1)+`" placeholder="Passport Expired Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Passport Expired Date '" autocomplete="off">
                                                    </div>
                                                </div>
                                                <div class="col-lg-6 col-md-6 col-sm-6">
                                                    <label>Country of Issued</label>
                                                    <div class="input-container-search-ticket">
                                                        <div class="form-select">
                                                            <select id="adult_country_of_issued`+parseInt(counter_passenger+1)+`" name="adult_country_of_issued`+parseInt(counter_passenger+1)+`">
                                                                <option value="">Select Country</option>`;
                                                                for(i in countries){
                                                                    if(countries[i].code == 'ID')
                                                                       text+=`<option value="`+countries[i].code+`" selected>`+countries[i].name+`</option>`;
                                                                    else
                                                                       text+=`<option value="`+countries[i].code+`">`+countries[i].name+`</option>`;
                                                                }
                                                            text+=`</select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </td>`;

    node.innerHTML = text;
    node.setAttribute('id', 'table_passenger'+counter_passenger);
    document.getElementById("table_of_passenger").appendChild(node);
//    document.getElementById("radio_passenger_search"+(counter_passenger+1)).onclick = "radio_button('passenger',counter_passenger);"
    counter_passenger++;
    $('select').niceSelect();
}

function delete_table_of_passenger(){
    if(counter_passenger != 0){
        counter_passenger--;
        var element = document.getElementById('table_passenger'+counter_passenger);
        element.parentNode.removeChild(element);
    }
}

function add_table_of_line(){
    text= '';
    var node = document.createElement("tr");
    text += `
    <td>`+(parseInt(counter_line)+1)+`</td>
    <td>
        <input list="airline_origin_name`+counter_line+`" id="origin`+counter_line+`" class="form-control" name="origin`+counter_line+`" onkeyup="search_origin_departure('origin',`+counter_line+`);" />
        <datalist id="airline_origin_name`+counter_line+`"/>
    </td>
    <td>
        <input list="airline_destination_name`+counter_line+`" id="destination`+counter_line+`" class="form-control" name="destination`+counter_line+`" onkeyup="search_origin_departure('destination',`+counter_line+`);" />
        <datalist id="airline_destination_name`+counter_line+`"/>
    </td>
    <td>
        <input type="datetime-local" id='departure`+counter_line+`' class="form-control" name='departure`+counter_line+`' placeholder="datetime"/>
    </td>
    <td>
        <input type="datetime-local" id='arrival`+counter_line+`' class="form-control" name='arrival`+counter_line+`' placeholder="datetime"/>
    </td>
    <td><input type="text" class="form-control" id='carrier_code`+counter_line+`' name='carrier_code`+counter_line+`' placeholder="Carrier Code"></td>
    <td><input type="text" class="form-control" id='carrier_number`+counter_line+`' name='carrier_number`+counter_line+`' placeholder="Carrier Number"></td>
    <td>
        <div class="input-container-search-ticket btn-group">
            <div class="form-select" id="default-select">
                <select id='class`+counter_line+`' name='class`+counter_line+`' class="form-control" style="height:42px;">`;
                for(i in class_of_service)
                    text+=`<option value="`+class_of_service[i][0]+`">`+class_of_service[i][1]+`</option>`;
            text+=`
                </select>
            </div>
        </div>
    </td>
    <td><input type="text" class="form-control" id='sub_class`+counter_line+`' name='sub_class`+counter_line+`' placeholder="Sub Class"></td>`;
    node.innerHTML = text;
    $('#class'+counter_line).niceSelect('update');
    node.setAttribute('id', 'table_line'+counter_line);
    document.getElementById("table_of_line").appendChild(node);
    counter_line++;
}

function delete_table_of_line(){
    if(counter_line != 0){
        counter_line--;
        var element = document.getElementById('table_line'+counter_line);
        element.parentNode.removeChild(element);
    }
}

function table_issued_offline_history(data){
    text= '';
    var node = document.createElement("tr");
    for(i in data){
        data_search.push(data[i]);
        text+=`
        <tr>
        <td>`+(parseInt(data_counter)+1)+`</td>
        <td>`+data[i].name+`</td>`;
        text+= `<td>`+data[i].provider+`</td>`;
        text+= `<td>`+data[i].pnr+`</td>`;
        text+= `<td>`+data[i].agent_id+`</td>`;
        if(data[i].state == 'draft'){
            text+= `<td>Draft</td>`;
        }
        else if(data[i].state == 'confirm'){
            text+= `<td>Confirm</td>`;
        }
        else if(data[i].state == 'paid'){
            text+= `<td>Paid</td>`;
        }
        else if(data[i].state == 'posted'){
            text+= `<td>Done</td>`;
        }
        else if(data[i].state == 'refund'){
            text+= `<td>Refund</td>`;
        }
        else if(data[i].state == 'expired'){
            text+= `<td>Expired</td>`;
        }
        else if(data[i].state == 'cancel'){
            text+= `<td>Cancelled</td>`;
        }

        text+= `<td>`+data[i].total_sale_price+`</td>`;
        text+= `<td>`+data[i].expired_date+`</td>`;
        text+= `</tr>`;
        node.innerHTML = text;
        document.getElementById("table_issued_offline").appendChild(node);
        node = document.createElement("tr");
        $('#loading-search-issued-off-history').hide();
//                   document.getElementById('airlines_ticket').innerHTML += text;
        text = '';
        data_counter++;
    }
}

function radio_button(type,val){
    console.log(val);
    var radios = ''
    if(type == 'booker')
        radios = document.getElementsByName('radio_booker');
    else if(type == 'passenger'){
        radios = document.getElementsByName('radio_passenger'+val);
    }
    value = '';
    for (var j = 0, length = radios.length; j < length; j++) {
        if (radios[j].checked) {
            // do whatever you want with the checked radio
            value = radios[j].value;
            // only one radio can be logically checked, don't check the rest
            break;
        }
    }
    console.log(value);
    if(value == 'search' && type == 'booker'){
        document.getElementById('booker_search').hidden = false;
        document.getElementById('booker_input').hidden = true;
    }else if(value == 'create' && type == 'booker'){
        document.getElementById('booker_search').hidden = true;
        document.getElementById('booker_input').hidden = false;
    }else if(value == 'search' && type == 'passenger'){
        document.getElementById('passenger_search'+val).hidden = false;
        document.getElementById('passenger_input'+val).hidden = true;
    }else if(value == 'create' && type == 'passenger'){
        document.getElementById('passenger_search'+val).hidden = true;
        document.getElementById('passenger_input'+val).hidden = false;
    }
}

function update_contact(type){
    if(document.getElementById('booker_title').value != '' && document.getElementById('booker_first_name').value != '' && document.getElementById('booker_last_name').value != '')
        document.getElementById('contact_person').value = document.getElementById('booker_title').value + ' ' + document.getElementById('booker_first_name').value + ' ' + document.getElementById('booker_last_name').value;
}