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

function total_sales_price_issued_offline(){
    var amount = document.getElementById('total_sale_price').value.split(',');
    amount = amount.join('');
    document.getElementById('total_sale_price').value = getrupiah(amount);
}

function change_transaction_type(type){
    counter_line = 0;
    if(document.getElementById('transaction_type').value  == 'airline')
        document.getElementById('sector_div').hidden = false;
    else
        document.getElementById('sector_div').hidden = true;
    document.getElementById('show_line').innerHTML = '';
//    if(document.getElementById('transaction_type').value  == 'airline' || document.getElementById('transaction_type').value  == 'train' || document.getElementById('transaction_type').value  == 'hotel' || document.getElementById('transaction_type').value  == 'activity'){
        document.getElementById('show_line').hidden = false;
        $('#transaction_type').niceSelect();
        text = '';
        text += `<h4>`+document.getElementById('transaction_type').value.charAt(0).toUpperCase() + document.getElementById('transaction_type').value.slice(1).toLowerCase()+` Line(s)</h4><hr/>`;
        text+=`
        <button class="primary-btn-ticket" type="button" onclick="add_table_of_line('`+document.getElementById('transaction_type').value+`');"><i class="fas fa-plus"></i> Add</button>
        <button class="primary-btn-ticket" type="button" onclick="delete_table_of_line()"><i class="fas fa-trash-alt"></i> Delete</button>
        <br/>
        <div class="row" id="table_of_line" style="margin-top:15px;">
        </div>`;
        document.getElementById('show_line').innerHTML = text;
        //$('select').niceSelect();
//    }else{
//        document.getElementById('show_line').hidden = true;
//        document.getElementById('show_line').innerHTML = '';
//    }
}

function add_table_of_passenger(type){
    text= '';
    set_passenger_number(counter_passenger);
    var node = document.createElement("tr");
    text += `
        <td>
            <span id='name_pax`+counter_passenger+`' name='name_pax`+counter_passenger+`'></span>
            <input id="id_passenger`+counter_passenger+`" name="id_passenger`+counter_passenger+`" type="hidden"/>
        </td>
        <td>
            <span id='birth_date`+counter_passenger+`' name='birth_date`+counter_passenger+`'></span>
        </td>
        `;
    text += `
        <td>
            <div style="text-align:center;">
                <button type="button" class="primary-btn" style="margin-bottom:5px; line-height:34px;" data-toggle="modal" data-target="#myModalPassenger`+counter_passenger+`" onclick="set_passenger_number(`+counter_passenger+`);"><i class="fas fa-search"></i></button>
                <button type="button" class="primary-btn" style="margin-bottom:5px; line-height:34px;" onclick="delete_table_of_passenger(`+parseInt(counter_passenger)+`);"><i class="fas fa-times"></i></button>
            </div>
            <!-- Modal -->
            <div class="modal fade" id="myModalPassenger`+counter_passenger+`" role="dialog" data-keyboard="false">
                <div class="modal-dialog">
                  <!-- Modal content-->
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title">Passenger `+(counter_passenger+1)+`</h4>
                            <button type="button" class="close" data-dismiss="modal" onclick="update_contact('passenger',`+parseInt(counter_passenger+1)+`);">&times;</button>
                        </div>
                        <div class="modal-body">
                            <div class="col-lg-12" id="radio_airline_search" style="padding:0px; text-align:left;margin-bottom:10px;">
                                <label class="radio-button-custom">
                                    <span style="font-size:14px;">Search</span>
                                    <input type="radio" checked="checked" id="radio_passenger_search`+parseInt(counter_passenger+1)+`" name="radio_passenger`+parseInt(counter_passenger+1)+`" value="search" onclick="radio_button('passenger',`+(counter_passenger+1)+`);">
                                    <span class="checkmark-radio"></span>
                                </label>
                                <label class="radio-button-custom">
                                    <span style="font-size:14px;">Input Passenger</span>
                                    <input type="radio" id="radio_passenger_input`+parseInt(counter_passenger+1)+`" name="radio_passenger`+parseInt(counter_passenger+1)+`" value="create" onclick="radio_button('passenger',`+(counter_passenger+1)+`);">
                                    <span class="checkmark-radio"></span>
                                </label>
                            </div>
                            <div id="passenger_content">
                                <div id="passenger_search`+parseInt(counter_passenger+1)+`">
                                    <div class="row">
                                        <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7">
                                            <input class="form-control" type="text" id="train_`+(counter_passenger+1)+`_search" placeholder="Search"/>
                                        </div>
                                        <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5">
                                            <button type="button" class="primary-btn" id="passenger_btn_io_click`+(counter_passenger+1)+`" onclick="get_customer_list('','`+(counter_passenger+1)+`','issued_offline')">Search</button>
                                        </div>
                                    </div>
                                    <span><i class="fas fa-exclamation-triangle" style="font-size:18px; color:#ffcc00;"></i> Using this means you can't change title, first name, and last name</span>

                                    <div id="search_result_`+(counter_passenger+1)+`">

                                    </div>
                                </div>
                                <div id="passenger_input`+parseInt(counter_passenger+1)+`" style="background-color:white;" hidden>
                                    <div class="col-lg-12" style="padding:0px;">
                                        <div style="background-color:`+color+`; padding:5px; cursor: pointer; box-shadow: 0px 5px #888888;">
                                            <div class="row">
                                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:left;">
                                                    <span style="font-size:16px;">Passenger - `+parseInt(counter_passenger+1)+`</span>
                                                </div>
                                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">

                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-12" style="background-color:white; padding:10px; border:1px solid `+color+`;" id="adult_paxs`+parseInt(counter_passenger+1)+`">
                                            <div class="row">
                                                <div class="col-lg-6 col-md-6 col-sm-6" style="text-align:left;">
                                                    <div class="input-container-search-ticket">
                                                        <label class="check_box_custom">
                                                            <span class="span-search-ticket" style="color:black;">Make this to Contact Person</span>
                                                            <input type="checkbox" id="adult_cp`+parseInt(counter_passenger+1)+`" name="adult_cp`+parseInt(counter_passenger+1)+`" onclick="update_contact_cp(`+parseInt(counter_passenger+1)+`)" />
                                                            <span class="check_box_span_custom"></span>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div class="col-lg-6 col-md-6 col-sm-6" style="text-align:right;">

                                                </div>
                                                <div class="col-lg-6 col-md-6 col-sm-6" style="margin-top:15px;">
                                                    <label>Title</label>`;
                                                    if(template == 1){
                                                        text+=`<div class="input-container-search-ticket">`;
                                                    }else if(template == 2){
                                                        text+=`<div>`;
                                                    }else if(template == 3){
                                                        text+=`<div class="default-select">`;
                                                    }else if(template == 4){
                                                        text+=`<div class="input-container-search-ticket">`;
                                                    }else if(template == 5){
                                                        text+=`<div class="input-container-search-ticket">`;
                                                    }
                                                    text+=`<div class="form-select-2">`;
                                                    if(template == 4){
                                                        text+=`<select class="nice-select-default rounded" id="adult_title`+parseInt(counter_passenger+1)+`" name="adult_title`+parseInt(counter_passenger+1)+`">`;
                                                    }else{
                                                        text+=`<select id="adult_title`+parseInt(counter_passenger+1)+`" name="adult_title`+parseInt(counter_passenger+1)+`">`;
                                                    }
                                                            for(i in titles){
                                                                text+= `<option value="`+titles[i]+`">`+titles[i]+`</option>`;
                                                            }
                                                            text+=`</select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-lg-6 col-md-6 col-sm-6" style="float:left;"></div>
                                                <div class="col-lg-6 col-md-6 col-sm-6">
                                                    <br/>
                                                    <label>First name and middle name (if any)</label>
                                                    <div class="input-container-search-ticket" style="margin-bottom:5px;">
                                                        <input type="text" class="form-control" name="adult_first_name`+parseInt(counter_passenger+1)+`" id="adult_first_name`+parseInt(counter_passenger+1)+`" placeholder="First Name " onfocus="this.placeholder = ''" onblur="this.placeholder = 'First Name '">
                                                        <input type="hidden" class="form-control" name="adult_id`+parseInt(counter_passenger+1)+`" id="adult_id`+parseInt(counter_passenger+1)+`">
                                                    </div>
                                                    <label style="font-size:12px; padding:0;">As on Identity Card or Passport without title and punctuation</label>
                                                </div>
                                                <div class="col-lg-6 col-md-6 col-sm-6">
                                                    <br/>
                                                    <label>Last name</label>
                                                    <div class="input-container-search-ticket" style="margin-bottom:5px;">
                                                        <input type="text" class="form-control" name="adult_last_name`+parseInt(counter_passenger+1)+`" id="adult_last_name`+parseInt(counter_passenger+1)+`" placeholder="Last Name " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Last Name '">
                                                    </div>
                                                    <label style="font-size:12px; padding:0;">As on Identity Card or Passport without title and punctuation</label>
                                                </div>
                                                <div class="col-lg-6">
                                                    <label>Nationality</label>`;
                                                    if(template == 1 || template == 5){
                                                        text+=`<div class="input-container-search-ticket">`;
                                                    }
                                                    text+=`
                                                        <div class="form-select">
                                                            <select class="form-control js-example-basic-single" name="adult_nationality`+parseInt(counter_passenger+1)+`_id" style="width:100%;" id="adult_nationality`+parseInt(counter_passenger+1)+`_id" placeholder="Nationality" onchange="auto_complete('adult_nationality`+parseInt(counter_passenger+1)+`')">
                                                                <option value="">Select Nationality</option>`;
                                                                for(i in countries){
                                                                    if(countries[i].code == 'ID')
                                                                       text+=`<option value="`+countries[i].code+`" selected>`+countries[i].name+`</option>`;
                                                                    else
                                                                       text+=`<option value="`+countries[i].code+`">`+countries[i].name+`</option>`;
                                                                }
                                                            text+=`</select>
                                                        </div>
                                                        <input type="hidden" name="adult_nationality`+parseInt(counter_passenger+1)+`" id="adult_nationality`+parseInt(counter_passenger+1)+`" />`;
                                                    if(template == 1 || template == 5){
                                                        text+=`</div>`;
                                                    }
                                                text+=`
                                                </div>
                                                <div class="col-lg-6 col-md-6 col-sm-6">
                                                    <label>Birth Date</label>
                                                    <div class="input-container-search-ticket" style="margin-bottom:5px;">
                                                        <input type="text" class="form-control date-picker-birth" name="adult_birth_date`+parseInt(counter_passenger+1)+`" id="adult_birth_date`+parseInt(counter_passenger+1)+`" onchange="check_years_old(`+parseInt(counter_passenger+1)+`)" placeholder="Birth Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Birth Date '" autocomplete="off">
                                                        <input type="hidden" class="form-control" name="adult_years_old`+parseInt(counter_passenger+1)+`" id="adult_years_old`+parseInt(counter_passenger+1)+`">
                                                    </div>
                                                </div>
                                                <div class="col-lg-6 col-md-6 col-sm-6">
                                                    <label>ID Type</label>`;
                                                    if(template == 1){
                                                        text+=`<div class="input-container-search-ticket">`;
                                                    }else if(template == 2){
                                                        text+=`<div>`;
                                                    }else if(template == 3){
                                                        text+=`<div class="default-select">`;
                                                    }else if(template == 4){
                                                        text+=`<div class="input-container-search-ticket">`;
                                                    }else if(template == 5){
                                                        text+=`<div class="input-container-search-ticket">`;
                                                    }
                                                    text+=`<div class="form-select-2">`;
                                                    if(template == 4){
                                                        text+=`<select class="nice-select-default rounded" id="adult_identity_type`+parseInt(counter_passenger+1)+`" name="adult_identity_type`+parseInt(counter_passenger+1)+`" onchange="change_country_of_issued(`+parseInt(counter_passenger+1)+`);">`;
                                                    }else{
                                                        text+=`<select id="adult_identity_type`+parseInt(counter_passenger+1)+`" name="adult_identity_type`+parseInt(counter_passenger+1)+`" onchange="change_country_of_issued(`+parseInt(counter_passenger+1)+`);">`;
                                                    }
                                                        text+=`
                                                            <option value=""></option>
                                                            <option value="ktp">KTP</option>
                                                            <option value="sim">SIM</option>
                                                            <option value="passport">PASSPORT</option>
                                                            <option value="other">Other</option>`;
                                                            text+=`</select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-lg-6 col-md-6 col-sm-6">
                                                    <label>Identity Number</label>
                                                    <div class="input-container-search-ticket" style="margin-bottom:5px;">
                                                        <input type="text" class="form-control" name="adult_identity_number`+parseInt(counter_passenger+1)+`" id="adult_identity_number`+parseInt(counter_passenger+1)+`" placeholder="Identity Number " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Identity Number '">
                                                    </div>
                                                </div>
                                                <div class="col-lg-6 col-md-6 col-sm-6">
                                                    <label>Identity Expired Date</label>
                                                    <div class="input-container-search-ticket" style="margin-bottom:5px;">
                                                        <input type="text" class="form-control date-picker-passport" name="adult_identity_expired_date`+parseInt(counter_passenger+1)+`" id="adult_identity_expired_date`+parseInt(counter_passenger+1)+`" placeholder="Identity Expired Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Identity Expired Date '" autocomplete="off">
                                                        <button type="button" class="primary-delete-date" onclick="delete_identity_expired_date('adult', `+parseInt(counter_passenger+1)+`)"><i class="fa fa-trash-alt" style="color:#E92B2B;font-size:20px;"></i></button>
                                                    </div>
                                                </div>

                                                <div class="col-lg-6">
                                                    <label>Country of Issued</label>`;
                                                    if(template == 1){
                                                        text+=`<div class="input-container-search-ticket">`;
                                                        text+=`
                                                            <div class="form-select">
                                                                <select class="form-control js-example-basic-single" name="adult_country_of_issued`+parseInt(counter_passenger+1)+`_id" style="width:100%;" id="adult_country_of_issued`+parseInt(counter_passenger+1)+`_id" placeholder="Country Of Issued" onchange="auto_complete('adult_country_of_issued`+parseInt(counter_passenger+1)+`');">
                                                                    <option value="">Select Country Of Issued</option>`;
                                                                    for(i in countries){
                                                                       text+=`<option value="`+countries[i].code+`">`+countries[i].name+`</option>`;
                                                                    }
                                                                text+=`</select>
                                                            </div>
                                                            <button type="button" class="primary-delete-date" onclick="delete_country_of_issued('adult', `+parseInt(counter_passenger+1)+`)"><i class="fa fa-trash-alt" style="color:#E92B2B;font-size:20px;"></i></button>
                                                            <input type="hidden" name="adult_country_of_issued`+parseInt(counter_passenger+1)+`" id="adult_country_of_issued`+parseInt(counter_passenger+1)+`" />`;
                                                        text+=`</div>`;
                                                    }else if(template == 2){
                                                        text+=`<div class="input-container-search-ticket">`;
                                                        text+=`
                                                            <select class="form-control js-example-basic-single" name="adult_country_of_issued`+parseInt(counter_passenger+1)+`_id" style="width:100%;" id="adult_country_of_issued`+parseInt(counter_passenger+1)+`_id" placeholder="Country Of Issued" onchange="auto_complete('adult_country_of_issued`+parseInt(counter_passenger+1)+`');">
                                                                <option value="">Select Country Of Issued</option>`;
                                                                for(i in countries){
                                                                   text+=`<option value="`+countries[i].code+`">`+countries[i].name+`</option>`;
                                                                }
                                                            text+=`</select>
                                                            <button type="button" class="primary-delete-date" onclick="delete_country_of_issued('adult', `+parseInt(counter_passenger+1)+`)"><i class="fa fa-trash-alt" style="color:#E92B2B;font-size:20px;"></i></button>
                                                            <input type="hidden" name="adult_country_of_issued`+parseInt(counter_passenger+1)+`" id="adult_country_of_issued`+parseInt(counter_passenger+1)+`" />`;
                                                        text+=`</div>`;
                                                    }else if(template == 3){
                                                        text+=`<div class="input-container-search-ticket" style="margin-bottom:5px;">`;
                                                        text+=`
                                                            <select class="form-control js-example-basic-single" name="adult_country_of_issued`+parseInt(counter_passenger+1)+`_id" style="width:100%;" id="adult_country_of_issued`+parseInt(counter_passenger+1)+`_id" placeholder="Country Of Issued" onchange="auto_complete('adult_country_of_issued`+parseInt(counter_passenger+1)+`');">
                                                                <option value="">Select Country Of Issued</option>`;
                                                                for(i in countries){
                                                                   text+=`<option value="`+countries[i].code+`">`+countries[i].name+`</option>`;
                                                                }
                                                            text+=`</select>
                                                            <button type="button" class="primary-delete-date" onclick="delete_country_of_issued('adult', `+parseInt(counter_passenger+1)+`)"><i class="fa fa-trash-alt" style="color:#E92B2B;font-size:20px;"></i></button>
                                                            <input type="hidden" name="adult_country_of_issued`+parseInt(counter_passenger+1)+`" id="adult_country_of_issued`+parseInt(counter_passenger+1)+`" />`;
                                                        text+=`</div>`;
                                                    }else if(template == 4){
                                                        text+=`<div class="input-container-search-ticket" style="margin-bottom:5px;">`;
                                                        text+=`
                                                            <select class="form-control js-example-basic-single" name="adult_country_of_issued`+parseInt(counter_passenger+1)+`_id" style="width:100%;" id="adult_country_of_issued`+parseInt(counter_passenger+1)+`_id" placeholder="Country Of Issued" onchange="auto_complete('adult_country_of_issued`+parseInt(counter_passenger+1)+`');">
                                                                <option value="">Select Country Of Issued</option>`;
                                                                for(i in countries){
                                                                   text+=`<option value="`+countries[i].code+`">`+countries[i].name+`</option>`;
                                                                }
                                                            text+=`</select>
                                                            <button type="button" class="primary-delete-date" onclick="delete_country_of_issued('adult', `+parseInt(counter_passenger+1)+`)"><i class="fa fa-trash-alt" style="color:#E92B2B;font-size:20px;"></i></button>
                                                            <input type="hidden" name="adult_country_of_issued`+parseInt(counter_passenger+1)+`" id="adult_country_of_issued`+parseInt(counter_passenger+1)+`" />`;
                                                        text+=`</div>`;
                                                    }else if(template == 2){
                                                        text+=`<div class="input-container-search-ticket">`;
                                                        text+=`
                                                            <div class="form-select">
                                                                <select class="form-control js-example-basic-single" name="adult_country_of_issued`+parseInt(counter_passenger+1)+`_id" style="width:100%;" id="adult_country_of_issued`+parseInt(counter_passenger+1)+`_id" placeholder="Country Of Issued" onchange="auto_complete('adult_country_of_issued`+parseInt(counter_passenger+1)+`');">
                                                                    <option value="">Select Country Of Issued</option>`;
                                                                    for(i in countries){
                                                                       text+=`<option value="`+countries[i].code+`">`+countries[i].name+`</option>`;
                                                                    }
                                                                text+=`</select>
                                                            </div>
                                                            <button type="button" class="primary-delete-date" onclick="delete_country_of_issued('adult', `+parseInt(counter_passenger+1)+`)"><i class="fa fa-trash-alt" style="color:#E92B2B;font-size:20px;"></i></button>
                                                            <input type="hidden" name="adult_country_of_issued`+parseInt(counter_passenger+1)+`" id="adult_country_of_issued`+parseInt(counter_passenger+1)+`" />`;
                                                        text+=`</div>`;
                                                    }
                                                text+=`
                                                </div>

                                                <div class="col-lg-6" id="adult_cp_hidden1_`+parseInt(counter_passenger+1)+`" hidden>
                                                    <label>Contact Email Address</label>
                                                    <div class="input-container-search-ticket">
                                                        <input type="text" class="form-control" name="adult_email`+parseInt(counter_passenger+1)+`" id="adult_email`+parseInt(counter_passenger+1)+`" placeholder="Email Address " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Email Address '">
                                                    </div>
                                                    <label style="font-size:12px; padding:0;">Example: email@example.com</label>
                                                </div>
                                                <div class="col-lg-6" id="adult_cp_hidden2_`+parseInt(counter_passenger+1)+`" hidden>
                                                    <label style="margin:0;">Contact Person for Urgent Situation</label>
                                                    <label style="font-size:10px; color:red;">(Must be filled with booker's mobile on first registration)</label>
                                                    <div class="row">
                                                        <div class="col-lg-3">
                                                            <div class="form-select">
                                                                <select id="adult_phone_code`+parseInt(counter_passenger+1)+`_id" name="adult_phone_code`+parseInt(counter_passenger+1)+`_id" class="form-control js-example-basic-single">`;
                                                                    for(i in countries){
                                                                        if(countries[i].code == 'ID')
                                                                           text+=`<option value="`+countries[i].phone_code+`" selected>`+countries[i].phone_code+`</option>`;
                                                                        else
                                                                           text+=`<option value="`+countries[i].phone_code+`">`+countries[i].phone_code+`</option>`;
                                                                    }

                                                        text+=` </select>
                                                                <input type="hidden" name="adult_phone_code`+parseInt(counter_passenger+1)+`" id="adult_phone_code`+parseInt(counter_passenger+1)+`" />
                                                            </div>
                                                        </div>
                                                        <div class="col-lg-9">
                                                            <input type="text" class="form-control" name="adult_phone`+parseInt(counter_passenger+1)+`" id="adult_phone`+parseInt(counter_passenger+1)+`" placeholder="Phone Number " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Phone Number '">
                                                        </div>
                                                    </div>
                                                    <label style="font-size:12px; padding:0;">Example: +62812345678</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                          <button type="button" class="btn btn-default" data-dismiss="modal" onclick="update_contact('passenger',`+parseInt(counter_passenger+1)+`);">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </td>`;

    node.innerHTML = text;
    node.setAttribute('id', 'table_passenger'+counter_passenger);
    document.getElementById("table_of_passenger").appendChild(node);
    $('input[name="adult_birth_date'+parseInt(counter_passenger+1)+'"]').daterangepicker({
          singleDatePicker: true,
          autoUpdateInput: true,
          startDate: moment().subtract(+18, 'years'),
          maxDate: moment(),
          showDropdowns: true,
          opens: 'center',
          drops: 'up',
          locale: {
              format: 'DD MMM YYYY',
          }
    });

    $('input[name="adult_identity_expired_date'+parseInt(counter_passenger+1)+'"]').daterangepicker({
          singleDatePicker: true,
          autoUpdateInput: true,
          startDate: moment(),
          minDate: moment(),
          showDropdowns: true,
          opens: 'center',
          drops: 'up',
          locale: {
              format: 'DD MMM YYYY',
          }
    });
    document.getElementById('adult_identity_expired_date'+parseInt(counter_passenger+1)).value = '';
    document.getElementById("train_"+parseInt(counter_passenger+1)+"_search").addEventListener("keyup", function(event) {
      // Number 13 is the "Enter" key on the keyboard

      if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        document.getElementById("passenger_btn_io_click"+event.target.id.split('_')[1]).click();
      }
    });
//    document.getElementById("radio_passenger_search"+(counter_passenger+1)).onclick = "radio_button('passenger',counter_passenger);"

    $('#adult_nationality'+parseInt(counter_passenger+1)+'_id').select2();
    $('#adult_country_of_issued'+parseInt(counter_passenger+1)+'_id').select2();
    $('#adult_phone_code'+parseInt(counter_passenger+1)+'_id').select2();
//    $('#adult_nationality'+parseInt(counter_passenger+1)).select2();
    if(type == 'open')
        $('#myModalPassenger'+parseInt(parseInt(counter_passenger))).modal('show');
    $('#adult_title'+parseInt(counter_passenger+1)).niceSelect();
    $('#adult_identity_type'+parseInt(counter_passenger+1)).niceSelect();
    auto_complete(`adult_nationality`+parseInt(counter_passenger+1));
    counter_passenger++;
}

function delete_table_of_passenger(counter){
    if(counter_passenger != 0){
        try{
            var element = document.getElementById('table_passenger'+counter);
            element.parentNode.removeChild(element);
        }catch(err){}
    }
}

function add_table_of_line(type){
    text= '';
    var node = document.createElement("div");
    if(type == 'airline' || type == 'train'){
        if(type == 'airline'){
            get_airline_config('home');
        }else{
            get_train_config();
        }
        text += `
        <div class="col-lg-12">
            <div class="row">
                <div class="col-lg-12">
                    <span style="font-size:14px; font-weight:bold;">No. `+parseInt(counter_line+1)+`</span>
                </div>
                <div class="col-lg-4 col-md-4">
                    <span>`;
                    if(type == 'airline'){
                        text+=`<i class="fas fa-plane-departure"></i>`;
                    }
                    else{
                        text+=`<img src="static/tt_website_rodextrip/img/icon/train-01.png" alt="Issued Offline" style="height:15px; width:auto;"/>`;
                    }
                    text+=` Origin</span>
                    <div class="input-container-search-ticket">
                        <input id="origin`+counter_line+`" name="origin`+counter_line+`" class="form-control" type="text" placeholder="Origin" style="width:100%;max-width:600px;outline:0" autocomplete="off" value="">
                    </div>
                </div>
                <div class="col-lg-4 col-md-4">
                    <span>`;
                    if(type == 'airline'){
                        text+=`<i class="fas fa-plane-arrival"></i>`;
                    }
                    else{
                        text+=`<img src="static/tt_website_rodextrip/img/icon/train-02.png" alt="Issued Offline" style="height:15px; width:auto;"/>`;
                    }
                    text+=` Destination
                    </span>
                    <div class="input-container-search-ticket">
                        <input id="destination`+counter_line+`" name="destination`+counter_line+`" class="form-control" type="text" placeholder="Destination" style="width:100%;max-width:600px;outline:0" autocomplete="off" value="">
                    </div>
                </div>
                <div class="col-lg-4">
                    <span>PNR</span><br/>
                    <div class="input-container-search-ticket">
                        <input type="text" id="pnr`+counter_line+`" name="pnr`+counter_line+`" class="form-control"/>
                    </div>
                </div>
                <div class="col-lg-4 col-md-4">
                    <span>Provider</span><br/>`;
                    if(template == 1){
                        text+=`<div class="input-container-search-ticket">`;
                    }
                    text+=`
                        <div class="form-select">
                            <select class="form-control js-example-basic-single" name="state" style="width:100%;" id="provider_data`+counter_line+`" placeholder="Carrier Name" onchange="set_data(`+counter_line+`,'provider')">

                            </select>
                        </div>
                        <input type="hidden" name="provider`+counter_line+`" id="provider`+counter_line+`" />`;
                    if(template == 1){
                        text+=`</div>`;
                    }
                text+=`
                </div>
                <div class="col-lg-4 col-md-4">
                    <span><i class="fas fa-calendar-alt"></i> Departure Date</span><br/>
                    <div class="input-container-search-ticket">
                        <input type="text" id='departure`+counter_line+`' class="form-control departure_date" name='departure`+counter_line+`' placeholder="datetime" onchange="date_issued_offline_onchange(`+counter_line+`, 'departure');"/>
                    </div>
                </div>
                <div class="col-lg-4 col-md-4">
                    <span><i class="fas fa-calendar-alt"></i> Arrival Date</span><br/>
                    <div class="input-container-search-ticket">
                        <input type="text" id='arrival`+counter_line+`' class="form-control arrival_date" name='arrival`+counter_line+`' placeholder="datetime" onchange="date_issued_offline_onchange(`+counter_line+`, 'arrival');"/>
                    </div>
                </div>
                <div class="col-lg-3 col-md-3">
                    <span>Carrier Code</span><br/>
                    <input type="text" class="form-control" id='carrier_code`+counter_line+`' name='carrier_code`+counter_line+`' placeholder="Carrier Code">
                </div>
                <div class="col-lg-3 col-md-3">
                    <span>Carrier Number</span><br/>
                    <input type="text" class="form-control" id='carrier_number`+counter_line+`' name='carrier_number`+counter_line+`' placeholder="Carrier Number">
                </div>
                <div class="col-lg-3 col-md-3">
                    <span>Class</span><br/>`;
                    if(template == 1){
                        text+=`<div class="input-container-search-ticket btn-group">`;
                    }
                    if(template == 1 || template == 2 || template == 4 || template == 5){
                        text+=`<div class="form-select" id="default-select">`;
                    }else if(template == 3){
                        text+=`<div class="default-select" id="default-select">`;
                    }

                    if(template == 4){
                        text+=`<select class="nice-select-default rounded" id='class`+counter_line+`' name='class`+counter_line+`'>`;
                    }else{
                        text+=`<select id='class`+counter_line+`' name='class`+counter_line+`' style="height:42px;">`;
                    }
                        for(i in class_of_service)
                            text+=`<option value="`+class_of_service[i][0]+`">`+class_of_service[i][1]+`</option>`;
                    text+=`
                        </select>
                    </div>`;
                    if(template == 1){
                        text+=`</div>`;
                    }
                text+=`
                </div>
                <div class="col-lg-3 col-md-3">
                    <span>Sub Class</span><br/>
                    <input type="text" class="form-control" id='sub_class`+counter_line+`' name='sub_class`+counter_line+`' placeholder="Sub Class">
                </div>
            </div>
        </div><hr/>`;
        node.innerHTML = text;
        node.setAttribute('id', 'table_line'+counter_line);
        document.getElementById("table_of_line").appendChild(node);
        $('#class'+counter_line).niceSelect();
        set_provider_data(counter_line, type);
//        set_origin_data(counter_line, type);
//        set_destination_data(counter_line, type);

        var origin = new autoComplete({
            selector: '#origin'+counter_line,
            minChars: 1,
            cache: false,
            delay:0,
            source: function(term, suggest){
                if(type == 'airline'){
                    if(term.split(' - ').length == 4)
                            term = ''
                    if(term.length > 1)
                        suggest(airline_search_autocomplete(term));
                }else if(type == 'train'){
                    if(term.split(' - ').length == 4)
                        term = ''
                    if(term.length > 1)
                        suggest(train_search_autocomplete(term));
                }
            },
            onSelect: function(e, term, item){
                $("#origin_id_flight").trigger("blur");
                set_airline_search_value_to_true();
            }
        });
        var destination = new autoComplete({
            selector: '#destination'+counter_line,
            minChars: 0,
            cache: false,
            delay:0,
            source: function(term, suggest){
                if(type == 'airline'){
                    if(term.split(' - ').length == 4)
                        term = ''
                    if(term.length > 1)
                        suggest(airline_search_autocomplete(term));
                }else if(type == 'train'){
                    if(term.split(' - ').length == 4)
                        term = ''
                    if(term.length > 1)
                        suggest(train_search_autocomplete(term));
                }
            },
            onSelect: function(e, term, item){
                $("#destination_id_flight").trigger("blur");
                set_airline_search_value_to_true();
            }
        });

        $('input[name="departure'+counter_line+'"]').daterangepicker({
              singleDatePicker: true,
              autoUpdateInput: true,
              startDate: moment(),
              minDate: moment(),
              maxDate: moment().subtract(-1, 'years'),
              showDropdowns: true,
              timePicker: true,
              timePicker24Hour: true,
              timePickerSeconds: true,
              opens: 'center',
              locale: {
                  format: 'DD MMM YYYY hh:mm:ss A',
              }
        });
        document.getElementById('departure'+counter_line).value = '';

        $('input[name="arrival'+counter_line+'"]').daterangepicker({
              singleDatePicker: true,
              autoUpdateInput: true,
              startDate: moment(),
              minDate: moment(),
              maxDate: moment().subtract(-1, 'years'),
              showDropdowns: true,
              timePicker: true,
              timePicker24Hour: true,
              timePickerSeconds: true,
              opens: 'center',
              locale: {
                  format: 'DD MMM YYYY hh:mm:ss A',
              }
        });
        document.getElementById('arrival'+counter_line).value = '';
        $('#provider_data'+counter_line).select2();
//        set_data(0,'origin');
//        set_data(0,'destination');
        set_data(counter_line,'provider');
    }else if(type == 'hotel'){
        text += `
        <div class="col-lg-12">
            <div class="row">
                <div class="col-lg-12">
                    <span style="font-size:14px; font-weight:bold;">No. `+parseInt(counter_line+1)+`</span>
                </div>
                <div class="col-lg-4 col-md-4">
                    <span><i class="fas fa-hotel"></i> Name</span><br/>
                    <div class="input-container-search-ticket">
                        <input type="input" id='hotel_name`+counter_line+`' class="form-control" name='hotel_name`+counter_line+`' placeholder="Name"/>
                    </div>
                </div>
                <div class="col-lg-4 col-md-4">
                    <span><i class="fas fa-bed"></i> Room</span><br/>
                    <div class="input-container-search-ticket">
                        <input type="input" id='hotel_room`+counter_line+`' class="form-control" name='hotel_room`+counter_line+`' placeholder="Room Type"/>
                    </div>
                </div>
                <div class="col-lg-4 col-md-4">
                    <span>Room Qty</span><br/>
                    <input type="number" id='hotel_qty`+counter_line+`' class="form-control" name='hotel_qty`+counter_line+`' placeholder="Quantity"/>
                </div>
                <div class="col-lg-4 col-xs-4">
                    <span><i class="fas fa-calendar-alt"></i> Check-in Date</span><br/>
                    <div class="input-container-search-ticket">
                        <input type="text" id='hotel_check_in`+counter_line+`' class="form-control check-in-date" name='hotel_check_in`+counter_line+`' placeholder="Check in" onclick="date_issued_offline_onchange(`+counter_line+`, 'checkin');"/>
                    </div>
                </div>
                <div class="col-lg-4 col-xs-4">
                    <span><i class="fas fa-calendar-alt"></i> Check-out Date</span><br/>
                    <div class="input-container-search-ticket">
                        <input type="text" id='hotel_check_out`+counter_line+`' class="form-control check-out-date" name='hotel_check_out`+counter_line+`' placeholder="Check out" onclick="date_issued_offline_onchange(`+counter_line+`, 'checkout');" />
                    </div>
                </div>
                <div class="col-lg-4 col-xs-4">
                    <span>PNR</span><br/>
                    <div class="input-container-search-ticket">
                        <input type="text" id="pnr`+counter_line+`" name="pnr`+counter_line+`" class="form-control"/>
                    </div>
                </div>
                <div class="col-lg-12">
                    <span>Description</span><br/>
                    <textarea style="height:100px;" id='hotel_description`+counter_line+`' class="form-control" name='hotel_description`+counter_line+`'></textarea>
                </div>
            </div>
        </div><hr/>`;
        node.innerHTML = text;
        $('#class'+counter_line).niceSelect('update');
        node.setAttribute('id', 'table_line'+counter_line);
        document.getElementById("table_of_line").appendChild(node);

        $('input[name="hotel_check_in'+counter_line+'"]').daterangepicker({
              singleDatePicker: true,
              autoUpdateInput: true,
              startDate: moment(),
              minDate: moment(),
              maxDate: moment().subtract(-1, 'years'),
              showDropdowns: true,
              timePicker: true,
              timePicker24Hour: true,
              timePickerSeconds: true,
              opens: 'center',
              locale: {
                  format: 'DD MMM YYYY hh:mm:ss A',
              }
          });

          $('input[name="hotel_check_out'+counter_line+'"]').daterangepicker({
              singleDatePicker: true,
              autoUpdateInput: true,
              startDate: moment(),
              minDate: moment(),
              maxDate: moment().subtract(-1, 'years'),
              showDropdowns: true,
              timePicker: true,
              timePicker24Hour: true,
              timePickerSeconds: true,
              opens: 'center',
              locale: {
                  format: 'DD MMM YYYY hh:mm:ss A',
              }
          });
          document.getElementById('hotel_check_in'+counter_line).value = '';
          document.getElementById('hotel_check_out'+counter_line).value = '';

    }else if(type == 'activity'){
        text += `
        <div class="col-lg-12">
            <div class="row">
                <div class="col-lg-12">
                    <span style="font-size:14px; font-weight:bold;">No. `+parseInt(counter_line+1)+`</span>
                </div>
                <div class="col-lg-3 col-md-3">
                    <span>Name</span><br/>
                    <input type="input" id='activity_name`+counter_line+`' class="form-control" name='activity_name`+counter_line+`' placeholder="Name"/>
                </div>
                <div class="col-lg-3 col-md-3">
                    <span>Package</span><br/>
                    <input type="input" id='activity_package`+counter_line+`' class="form-control" name='activity_package`+counter_line+`' placeholder="Package Type"/>
                </div>
                <div class="col-lg-2 col-md-2">
                    <span>Qty</span><br/>
                    <input type="input" id='activity_qty`+counter_line+`' class="form-control" name='activity_qty`+counter_line+`' placeholder="Quantity"/>
                </div>
                <div class="col-lg-4 col-md-4">
                    <span><i class="fas fa-calendar-alt"></i> Visit Date Time</span><br/>
                    <div class="input-container-search-ticket">
                        <input type="text" id='activity_datetime`+counter_line+`' class="form-control visit_date" name='activity_datetime`+counter_line+`' placeholder="Datetime"/>
                    </div>
                </div>
                <div class="col-lg-4 col-md-4">
                    <span>PNR</span><br/>
                    <div class="input-container-search-ticket">
                        <input type="text" id="pnr`+counter_line+`" name="pnr`+counter_line+`" class="form-control"/>
                    </div>
                </div>
                <div class="col-lg-8">
                    <span>Description</span><br/>
                    <textarea style="height:100px;" id='activity_description`+counter_line+`' class="form-control" name='activity_description`+counter_line+`'></textarea>
                </div>
            </div>

        </div><hr/>`;
        node.innerHTML = text;
        $('#class'+counter_line).niceSelect('update');
        node.setAttribute('id', 'table_line'+counter_line);
        document.getElementById("table_of_line").appendChild(node);

        $('input[name="activity_datetime'+counter_line+'"]').daterangepicker({
              singleDatePicker: true,
              autoUpdateInput: true,
              startDate: moment(),
              minDate: moment(),
              maxDate: moment().subtract(-1, 'years'),
              showDropdowns: true,
              timePicker: true,
              timePicker24Hour: true,
              timePickerSeconds: true,
              opens: 'center',
              locale: {
                  format: 'DD MMM YYYY hh:mm:ss A',
              }
        });
        document.getElementById('activity_datetime'+counter_line).value = '';
    }else{
        text += `
            <div class="row">
                <div class="col-lg-12">
                    <span style="font-size:14px; font-weight:bold;">No. `+parseInt(counter_line+1)+`</span>
                </div>
                <div class="col-lg-12 col-md-12">
                    <span>PNR</span><br/>
                    <div class="input-container-search-ticket">
                        <input type="text" id="pnr`+counter_line+`" name="pnr`+counter_line+`" class="form-control"/>
                    </div>
                </div>
                <div class="col-lg-12 col-md-12" style="text-align:left;">
                    <span>Description</span><br/>
                    <textarea id="other_description`+counter_line+`" name="description" rows="6" cols="80" style="resize:none; width:100%; margin-bottom:15px;" class="form-control" placeholder="Leave any notes here"></textarea>
                </div>

        </div><hr/>`;
        node.innerHTML = text;
        node.className = "col-lg-12";
        document.getElementById("table_of_line").appendChild(node);
    }


    counter_line++;
}

function date_issued_offline_onchange(val, type){
    min_date = '';
    if(type == 'departure'){
        min_date = $("#departure"+(val)).val();
        console.log(min_date);
        if(min_date > $("#arrival"+(val).toString()).val()){
            $('input[name="arrival'+val+'"]').daterangepicker({
              singleDatePicker: true,
              autoUpdateInput: true,
              startDate: min_date,
              minDate: min_date,
              maxDate: moment().subtract(-1, 'years'),
              showDropdowns: true,
              timePicker: true,
              timePicker24Hour: true,
              timePickerSeconds: true,
              opens: 'center',
              locale: {
                  format: 'DD MMM YYYY hh:mm:ss A',
              }
            });
            $('input[name="arrival'+val+'"]').val('');
        }
    }else if(type == 'checkin'){
        min_date = $("#hotel_check_in"+(val)).val();
        console.log(min_date);
        if(min_date > $("#hotel_check_out"+(val).toString()).val()){
            $('input[name="hotel_check_out'+val+'"]').daterangepicker({
              singleDatePicker: true,
              autoUpdateInput: true,
              startDate: min_date,
              minDate: min_date,
              maxDate: moment().subtract(-1, 'years'),
              showDropdowns: true,
              timePicker: true,
              timePicker24Hour: true,
              timePickerSeconds: true,
              opens: 'center',
              locale: {
                  format: 'DD MMM YYYY hh:mm:ss A',
              }
            });
            $('input[name="hotel_check_out'+val+'"]').val('');
        }

    }
}

function delete_table_of_line(){
    if(counter_line != 0){
        try{
            counter_line--;
            var element = document.getElementById('table_line'+counter_line);
            element.parentNode.removeChild(element);
        }catch(err){}
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

function update_contact(type,val){
    if(type == 'booker'){
        if(document.getElementById('booker_title').value != '' && document.getElementById('booker_first_name').value != '' && document.getElementById('booker_last_name').value != '')
            document.getElementById('contact_person').value = document.getElementById('booker_title').value + ' ' + document.getElementById('booker_first_name').value + ' ' + document.getElementById('booker_last_name').value;
    }else if(type == 'passenger'){
        if(document.getElementById('adult_title'+val).value != '')
            document.getElementById('name_pax'+parseInt(val-1)).innerHTML = document.getElementById('adult_title'+val).value + ' ';
        if(document.getElementById('adult_first_name'+val).value != '')
            document.getElementById('name_pax'+parseInt(val-1)).innerHTML += document.getElementById('adult_first_name'+val).value + ' ' ;
        if(document.getElementById('adult_last_name'+val).value != '')
            document.getElementById('name_pax'+parseInt(val-1)).innerHTML += document.getElementById('adult_last_name'+val).value;
        if(document.getElementById('adult_birth_date'+val).value != ''){
            document.getElementById('birth_date'+parseInt(val-1)).innerHTML = document.getElementById('adult_birth_date'+val).value;
        }
    }
}

function update_contact_cp(val){
    temp = 1;
    while(temp != counter_passenger+1){
        if(document.getElementById('adult_cp'+temp.toString()).checked == true && val != temp){
            document.getElementById('adult_cp_hidden1_'+temp.toString()).hidden = true;
            document.getElementById('adult_cp_hidden2_'+temp.toString()).hidden = true;
            document.getElementById('adult_cp'+temp.toString()).checked = false;
            alert('Contact Person has been changed!');
        }
        temp++;
    }
    if(document.getElementById('adult_cp'+val.toString()).checked == true){
        document.getElementById('adult_cp_hidden1_'+val.toString()).hidden = false;
        document.getElementById('adult_cp_hidden2_'+val.toString()).hidden = false;
    }else{
        document.getElementById('adult_cp_hidden1_'+val.toString()).hidden = true;
        document.getElementById('adult_cp_hidden2_'+val.toString()).hidden = true;
    }
}

function set_provider_data(val,type){
    var carrier = document.getElementById("provider_data"+val);
    if(type == 'airline'){
        for(i in issued_offline_data.carrier_id){
            var node = document.createElement("option");
            node.text = issued_offline_data.carrier_id[i].name;
            node.value = issued_offline_data.carrier_id[i].code;
            try{
            }catch(err){
            }
            carrier.add(node);
        }
    }else if(type == 'train'){
        var node = document.createElement("option");
        node.text = 'KAI';
        node.value = 'kai_outlet';
        carrier.add(node);
        document.getElementById('provider'+val).value = 'kai_outlet';
    }
}

function set_destination_data(val,type){
    var carrier = document.getElementById("destination_data"+val);
    if(type == 'airline'){
        for(i in airline_destination){
            var node = document.createElement("option");
            node.text = airline_destination[i].name+` - `+airline_destination[i].city +' ('+airline_destination[i].code+')';
            node.value = airline_destination[i].code;
            try{
            }catch(err){
            }
            carrier.add(node);
        }
    }else if(type == 'train'){
        for(i in train_destination){
            var node = document.createElement("option");
            node.text = train_destination[i].code +` - `+ train_destination[i].name;
            node.value = train_destination[i].name;
            try{
            }catch(err){
            }
            carrier.add(node);
        }
    }else if(type == 'hotel'){

    }
}

function set_origin_data(val,type){
    var carrier = document.getElementById("origin_data"+val);
    if(type == 'airline'){
        for(i in airline_destination){
            var node = document.createElement("option");
            node.text = airline_destination[i].name+` - `+airline_destination[i].city +' ('+airline_destination[i].code+')';
            node.value = airline_destination[i].code;
            try{
            }catch(err){
            }
            carrier.add(node);
        }
    }else if(type == 'train'){
        for(i in train_destination){
            var node = document.createElement("option");
            node.text = train_destination[i].code +` - `+ train_destination[i].name;
            node.value = train_destination[i].name;
            try{
            }catch(err){
            }
            carrier.add(node);
        }
    }else if(type == 'hotel'){

    }
}

function set_data(val,type){
    if(type == 'provider'){
        document.getElementById('provider'+val).value = document.getElementById('select2-provider_data'+val+'-container').innerHTML;
        try{
            for(i in issued_offline_data.carrier_id){
                if(issued_offline_data.carrier_id[i].name == document.getElementById('provider'+val).value){
                    document.getElementById('carrier_code'+val).value = issued_offline_data.carrier_id[i].code;
                    break;
                }
            }
        }catch(err){}

    }else if(type == 'origin')
        document.getElementById('origin'+val).value = document.getElementById('select2-origin_data'+val+'-container').title;
    else if(type == 'destination')
        document.getElementById('destination'+val).value = document.getElementById('select2-destination_data'+val+'-container').title;
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

function show_commission(){
    var sc = document.getElementById("show_commission");
    var scs = document.getElementById("show_commission_button");
    if (sc.style.display === "none"){
        sc.style.display = "block";
        scs.value = "Hide Commission";
    }
    else{
        sc.style.display = "none";
        scs.value = "Show Commission";
    }
}

function copy_data(){
    //
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
//    const el = document.createElement('textarea');
//    el.innerHTML = $text;
//    document.body.appendChild(el);
//    el.select();
//    document.execCommand('copy');
//    document.body.removeChild(el);
}

function Upload() {
    //Reference the FileUpload element.
    var fileUpload = document.getElementById("fileUpload");

    //Validate whether File is valid Excel file.
    if(fileUpload.value.toLowerCase().endsWith(".xlsx")){
        if (typeof (FileReader) != "undefined") {
            var reader = new FileReader();

            //For Browsers other than IE.
            if (reader.readAsBinaryString) {
                reader.onload = function (e) {
                    ProcessExcel(e.target.result);
                };
                reader.readAsBinaryString(fileUpload.files[0]);
            } else {
                //For IE Browser.
                reader.onload = function (e) {
                    var data = "";
                    var bytes = new Uint8Array(e.target.result);
                    for (var i = 0; i < bytes.byteLength; i++) {
                        data += String.fromCharCode(bytes[i]);
                    }
                    ProcessExcel(data);
                };
                reader.readAsArrayBuffer(fileUpload.files[0]);
            }
        } else {
            alert("This browser does not support HTML5.");
        }
    } else {
        alert("Please upload a valid Excel file.");
    }
};
function ProcessExcel(data) {
    //Read the Excel File data.
    var workbook = XLSX.read(data, {
        type: 'binary'
    });
    console.log(workbook);
    //Fetch the name of First Sheet.
    var firstSheet = workbook.SheetNames[0];

    //Read all rows from First Sheet into an JSON array.
    var excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);
    console.log(excelRows);
    //Create a HTML Table element.
    var table = document.createElement("table");
    table.border = "1";

    //Add the header row.
    var row = table.insertRow(-1);

    //Add the header cells.
    var headerCell = document.createElement("TH");
    headerCell.innerHTML = "Id";
    row.appendChild(headerCell);

    headerCell = document.createElement("TH");
    headerCell.innerHTML = "Name";
    row.appendChild(headerCell);

    headerCell = document.createElement("TH");
    headerCell.innerHTML = "Country";
    row.appendChild(headerCell);

    //Add the data rows from Excel file.
    passengers_excel = []
    for (var i = 0; i < excelRows.length; i++) {
        //Add the data row.
        passengers_excel.push([])
        for(j in excelRows[i]){
            passengers_excel[passengers_excel.length-1].push(excelRows[i][j])
        }
    }
    list_test = []
    for(i in passengers_excel){
        check = 1;
        for(j in list_test){
            if(list_test[j].address == passengers_excel[i][7] &&
               list_test[j].date == passengers_excel[i][8] &&
               list_test[j].hour == passengers_excel[i][9]){
                check = 0;
                list_test[j].pax.push(passengers_excel[i]);
            }
        }
        if(check){
            list_test.push({
                'address': passengers_excel[i][7],
                'date': passengers_excel[i][8],
                'hour': passengers_excel[i][9],
                'jenis_test': passengers_excel[i][10],
                'pax': [passengers_excel[i]]
            })
        }

    }
    console.log(passengers_excel);
    console.log(list_test);
    notes = '';
    counter_pax = 0;
    for(i in list_test){
        for(j in list_test[i].pax){
            add_table_of_passenger('');
            document.getElementById('adult_title'+counter_passenger).value = list_test[i].pax[j][0].toUpperCase();
            document.getElementById('adult_first_name'+counter_passenger).value = list_test[i].pax[j][1].split(' ')[0];
            try{
                last_name = list_test[i].pax[j][1].split(' ');
                last_name.splice(0, 1)
                document.getElementById('adult_last_name'+counter_passenger).value = last_name.join(' ');
            }catch(err){}
            document.getElementById('adult_birth_date'+counter_passenger).value = moment(list_test[i].pax[j][6]).format('DD MMM YYYY').toString();
            document.getElementById('adult_identity_type'+counter_passenger).value = list_test[i].pax[j][3].toLowerCase();
            document.getElementById('adult_identity_number'+counter_passenger).value = list_test[i].pax[j][4];
            document.getElementById('adult_country_of_issued'+counter_passenger+'_id').value = 'ID';
            document.getElementById('adult_country_of_issued'+counter_passenger).value = 'ID';
            document.getElementById('select2-adult_country_of_issued'+counter_passenger+'_id-container').innerHTML = 'Indonesia';
            notes += parseInt(parseInt(counter_pax)+1) + ' Pax: ' + list_test[i].pax[j][0] + ' ' + list_test[i].pax[j][1] + '\n';
            if(list_test[i].pax[j][2] != undefined)
                notes += 'Phone number: ' + list_test[i].pax[j][2] + '\n';
//            if(list_test[i].pax[j][3] != undefined && list_test[i].pax[j][4] != undefined)
//                notes += list_test[i].pax[j][3] + ': ' + list_test[i].pax[j][4] + '\n';
//            if(list_test[i].pax[j][6] != undefined)
//                notes += 'Alamat: ' + list_test[i].pax[j][5] + '\n';
            if(list_test[i].pax[j][11] != undefined)
                notes += 'Email: ' + list_test[i].pax[j][11] + '\n';
            if(list_test[i].pax[j][12] != undefined)
                notes += 'Notes: ' + list_test[i].pax[j][12] + '\n';
            update_contact('passenger', counter_passenger);
            change_country_of_issued(counter_passenger);
            $('#adult_title'+counter_passenger).niceSelect('update');
            $('#adult_id_type'+counter_passenger).niceSelect('update');
            counter_pax++;
            $('#adult_title'+parseInt(counter_passenger)).niceSelect('update');
            $('#adult_identity_type'+parseInt(counter_passenger)).niceSelect('update');
        }
        if(list_test[i].jenis_test != undefined){
            notes += 'Test: ' + list_test[i].jenis_test + '\n';
            notes += list_test[i].address + ' ' + moment(list_test[i].date).format('DD MMM YYYY').toString()+ ' ' + list_test[i].hour + '\n';
        }


    }
    document.getElementById('description').innerHTML = notes;
};

function change_country_of_issued(val){
    if(document.getElementById('adult_identity_type'+val).value != ''){
        if(document.getElementById('adult_country_of_issued'+val).value == '' || document.getElementById('adult_country_of_issued1').value != ''){
            document.getElementById('select2-adult_country_of_issued'+val+'_id-container').innerHTML = 'Indonesia';
            document.getElementById('adult_country_of_issued'+val).value = 'Indonesia'
        }
    }else{
        document.getElementById('select2-adult_country_of_issued'+val+'_id-container').innerHTML = 'Select Country Of Issued';
        document.getElementById('adult_country_of_issued'+val).value = '';
    }
    $('#adult_country_of_issued'+val+'_id').niceSelect('update');
}

function delete_identity_expired_date(type, id){
    document.getElementById(type+'_identity_expired_date'+id).value = "";
}