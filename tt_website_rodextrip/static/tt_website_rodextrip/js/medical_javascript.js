function add_other_time(){
    var node = document.createElement("div");
    text = '';
    if(test_time > 1){
    text+=`
        <div>
            <hr/>
        </div>`;
    }
    text+= `
        <div class="row">
            <div class="col-lg-6">
                <label style="color:red !important">*</label>
                <label>Test Date</label>
                <div class="input-container-search-ticket">
                    <input type="text" class="form-control" style="cursor:pointer;" name="booker_test_date`+test_time+`" id="booker_test_date`+test_time+`" placeholder="Test Date" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Test Date '" autocomplete="off" readonly>
                </div>
            </div>

            <div class="col-lg-6">
                <label style="color:red !important;">*</label>
                <label>Timeslot</label>
                <div class="row">
                    <div class="col-lg-8">
                        <div class="input-container-search-ticket">
                            <div class="form-select">
                                <select style="width:100%;" id="booker_timeslot_id`+test_time+`" placeholder="Timeslot">

                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-2">`;
    if(test_time == 1){
        text+=` </div>
            </div>
        </div>`;
    }else{
        text+=`
                    <button type="button" class="primary-delete-date" onclick="delete_other_time('test`+test_time+`')"><i class="fa fa-trash-alt" style="color:#E92B2B;font-size:20px;"></i></button>
                </div>
            </div>
        </div>
        `;
    }


    node.innerHTML = text;
    node.id = 'test' + test_time
    document.getElementById('test').appendChild(node);
    $('#booker_timeslot_id'+test_time).niceSelect();
    $('input[name="booker_test_date'+test_time+'"]').daterangepicker({
        singleDatePicker: true,
        autoUpdateInput: true,
        startDate: moment(medical_get_availability_response[document.getElementById('booker_area').value].min_date),
        minDate: moment(medical_get_availability_response[document.getElementById('booker_area').value].min_date),
        maxDate: moment(medical_get_availability_response[document.getElementById('booker_area').value].max_date),
        showDropdowns: true,
        opens: 'center',
        locale: {
            format: 'DD MMM YYYY',
        }
    });
    $('input[name="booker_test_date'+test_time+'"]').on('apply.daterangepicker', function(ev, picker) {
        var val = parseInt(ev.target.id.replace('booker_test_date',''));
        update_timeslot(val);
    });
    update_timeslot(test_time);
    test_time++;
}

function update_timeslot(val){
    var text = '';
    var medical_date_pick = moment(document.getElementById('booker_test_date'+val).value).format('YYYY-MM-DD');
    var now = moment()
    for(i in medical_get_availability_response[document.getElementById('booker_area').value].timeslots[medical_date_pick]){
        if(medical_get_availability_response[document.getElementById('booker_area').value].timeslots[medical_date_pick][i].availability == false){
            text+= `<option disabled value="`+medical_get_availability_response[document.getElementById('booker_area').value].timeslots[medical_date_pick][i].seq_id+`~`+medical_get_availability_response[document.getElementById('booker_area').value].timeslots[medical_date_pick][i].time+`">`+medical_get_availability_response[document.getElementById('booker_area').value].timeslots[medical_date_pick][i].time+`</option>`;
        }else{
            text+= `<option value="`+medical_get_availability_response[document.getElementById('booker_area').value].timeslots[medical_date_pick][i].seq_id+`~`+medical_get_availability_response[document.getElementById('booker_area').value].timeslots[medical_date_pick][i].time+`">`+medical_get_availability_response[document.getElementById('booker_area').value].timeslots[medical_date_pick][i].time+`</option>`;
        }
    }
    console.log(text);
    document.getElementById('booker_timeslot_id'+val).innerHTML = text;
    $('#booker_timeslot_id'+val).niceSelect('update');
}

function delete_other_time(val){
    var element = document.getElementById(val);
    element.parentNode.removeChild(element);
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
        <td>
            <span id='sample_method`+counter_passenger+`' name='sample_method`+counter_passenger+`'></span>
        </td>
        `;
    text += `
        <td>
            <div style="text-align:center;">
                <button type="button" class="primary-btn" style="margin-bottom:5px; line-height:34px;" data-toggle="modal" data-target="#myModalPassenger`+counter_passenger+`" onclick="set_passenger_number(`+counter_passenger+`);"><i class="fas fa-search"></i></button>
            </div>
            <!-- Modal -->
            <div class="modal fade" id="myModalPassenger`+counter_passenger+`" role="dialog" data-keyboard="false">
                <div class="modal-dialog">
                  <!-- Modal content-->
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title" style="color:white;">Passenger `+(counter_passenger+1)+`</h4>
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
                                            <button type="button" class="primary-btn" id="passenger_btn_io_click`+(counter_passenger+1)+`" onclick="get_customer_list('','`+(counter_passenger+1)+`','medical')">Search</button>
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
                                                    <span style="font-size:16px;color:white;">Passenger - `+parseInt(counter_passenger+1)+`</span>
                                                </div>
                                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="text-align:right;">

                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-12" style="background-color:white; padding:10px; border:1px solid `+color+`;" id="adult_paxs`+parseInt(counter_passenger+1)+`">
                                            <div class="row">
                                                <div class="col-lg-6 col-md-6 col-sm-6" style="margin-top:15px;">
                                                    <label style="color:red !important">*</label>
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
                                                    <label style="color:red !important">*</label>
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
                                                    <label style="color:red !important">*</label>
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
                                                    <label style="color:red !important">*</label>
                                                    <label>Birth Date</label>
                                                    <div class="input-container-search-ticket" style="margin-bottom:5px;">
                                                        <input type="text" class="form-control date-picker-birth" name="adult_birth_date`+parseInt(counter_passenger+1)+`" id="adult_birth_date`+parseInt(counter_passenger+1)+`" onchange="check_years_old(`+parseInt(counter_passenger+1)+`)" placeholder="Birth Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Birth Date '" autocomplete="off">
                                                        <input type="hidden" class="form-control" name="adult_years_old`+parseInt(counter_passenger+1)+`" id="adult_years_old`+parseInt(counter_passenger+1)+`">
                                                    </div>
                                                </div>
                                                <div class="col-lg-6 col-md-6 col-sm-6">
                                                    <label style="color:red !important">*</label>
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
                                                        text+=`<select id="adult_identity_type`+parseInt(counter_passenger+1)+`" name="adult_identity_type`+parseInt(counter_passenger+1)+`">`;
                                                    }
                                                        text+=`
                                                            <option value=""></option>
                                                            <option value="ktp">KTP</option>`;
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

                                                <div class="col-lg-6">
                                                    <label style="color:red !important">*</label>
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

                                                <div class="col-lg-6 col-md-6 col-sm-6">
                                                    <label style="color:red !important">*</label>
                                                    <label>Sample Method</label>`;
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
                                                        text+=`<select class="nice-select-default rounded" id="adult_sample_method`+parseInt(counter_passenger+1)+`" name="adult_sample_method`+parseInt(counter_passenger+1)+`">`;
                                                    }else{
                                                        text+=`<select id="adult_sample_method`+parseInt(counter_passenger+1)+`" name="adult_sample_method`+parseInt(counter_passenger+1)+`">`;
                                                    }
                                                        text+=`
                                                            <option value=""></option>
                                                            <option value="saliva">Saliva</option>
                                                            <option value="nasal_swab">Nasal Swab</option>`;
                                                            text+=`</select>
                                                        </div>
                                                    </div>
                                                </div>`;
                                                text+=`
                                                <div class="col-lg-6" id="adult_cp_hidden1_`+parseInt(counter_passenger+1)+`">
                                                    <label style="color:red !important">*</label>
                                                    <label>Contact Email Address</label>
                                                    <div class="input-container-search-ticket">
                                                        <input type="text" class="form-control" name="adult_email`+parseInt(counter_passenger+1)+`" id="adult_email`+parseInt(counter_passenger+1)+`" placeholder="Email Address " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Email Address '">
                                                    </div>
                                                    <label style="font-size:12px; padding:0;">Example: email@example.com</label>
                                                </div>
                                                <div class="col-lg-6" id="adult_cp_hidden2_`+parseInt(counter_passenger+1)+`">
                                                    <label style="color:red !important">*</label>
                                                    <label>Contact Person for Urgent Situation</label>
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
    $('#adult_sample_method'+parseInt(counter_passenger+1)).niceSelect();
    $('#adult_identity_type'+parseInt(counter_passenger+1)).niceSelect();
    auto_complete(`adult_nationality`+parseInt(counter_passenger+1));
    counter_passenger++;
}

function check_identity(val){
    var radios = document.getElementsByName('radio_ktp_paspor_'+val);
    for (var j = 0, length = radios.length; j < length; j++) {
        if (radios[j].checked) {
            if(radios[j].id.includes('pilih_tidak_punya_ktp') == true){
                document.getElementById('punya_ktp_'+val).hidden = true;
                document.getElementById('punya_paspor_'+val).style.display = 'none';
                document.getElementById('pilih_maskapai_'+val).style.display = 'none';
                document.getElementById('pilih_negara_input_'+val).style.display = 'block';
                document.getElementById('pilih_negara_select_'+val).style.display = 'none';
            }else if(radios[j].id.includes('pilih_penerbangan') == true){
                document.getElementById('punya_ktp_'+val).hidden = true;
                document.getElementById('punya_paspor_'+val).style.display = 'block';
                document.getElementById('pilih_maskapai_'+val).style.display = 'block';
                document.getElementById('pilih_negara_input_'+val).style.display = 'block';
                document.getElementById('pilih_negara_select_'+val).style.display = 'none';
            }else if(radios[j].id.includes('pilih_punya_paspor') == true){
                document.getElementById('punya_ktp_'+val).hidden = true;
                document.getElementById('punya_paspor_'+val).style.display = 'block';
                if(test_type == 'swab_pcr'){
                    document.getElementById('pilih_maskapai_'+val).style.display = 'none';
                    document.getElementById('pilih_negara_input_'+val).style.display = 'none';
                    document.getElementById('pilih_negara_select_'+val).style.display = 'block';
                }
                if(test_type == 'swab_antigen'){
                    document.getElementById('pilih_nama_kitas_'+val).style.display = 'none';
                    document.getElementById('pilih_nama_paspor_'+val).style.display = 'block';
                }
            }else if(radios[j].id.includes('pilih_punya_kitas') == true){
                document.getElementById('punya_ktp_'+val).hidden = true;
                document.getElementById('punya_paspor_'+val).style.display = 'block';
                if(test_type == 'swab_antigen'){
                    document.getElementById('pilih_nama_kitas_'+val).style.display = 'block';
                    document.getElementById('pilih_nama_paspor_'+val).style.display = 'none';
                }
            }else if(radios[j].id.includes('pilih_punya_ktp') == true){
                document.getElementById('punya_ktp_'+val).hidden = false;
                document.getElementById('punya_paspor_'+val).style.display = 'none';
                if(test_type == 'swab_pcr'){
                    document.getElementById('pilih_maskapai_'+val).style.display = 'none';
                    document.getElementById('pilih_negara_input_'+val).style.display = 'block';
                    document.getElementById('pilih_negara_select_'+val).style.display = 'none';
                }
            }
            break;
        }
    }
}

function phc_html(phc_scrap_html){
    phc_scrap_html = phc_scrap_html.split('id=');
    var temp = '';
    for(i in phc_scrap_html){
        temp = phc_scrap_html[i].split('"');
        temp[1] += '_' + counter_passenger;
        if(phc_scrap_html[i].includes('name') == true){
            temp[3] += '_' + counter_passenger;
            phc_scrap_html[i] = temp.join('"');
        }else if(i != 0 && phc_scrap_html[i-1].includes('checkbox-tools') == true){
            phc_scrap_html[i] = temp.join('"');
        }else{
            temp.splice(2, 0, 'name="'+temp[1]+'"');
            phc_scrap_html[i] = temp.join('"');
        }
    }

    phc_scrap_html = phc_scrap_html.join("id=");
    return phc_scrap_html;
}

function add_table_passenger_phc(type){
    text= '';
    set_passenger_number(counter_passenger);
    scrap_html = phc_html(medical_config.result.response.carrier_type[test_type].html).split('<div class="box-footer">')[0];
    scrap_html = scrap_html.split(`<div class="form-group" id="punya_ktp_`+counter_passenger+`" name='punya_ktp'>`);
    console.log(scrap_html);
    scrap_html.splice(1, 0, `<select class="form-group" id="title_`+counter_passenger+`" name="title_`+counter_passenger+`"><option value="MR">MR</option><option value="MRS">MRS</option><option value="MS">MS</option><option value="MSTR">MSTR</option><option value="MISS">MISS</option></select>`);

    scrap_html = scrap_html[0] + scrap_html[1] + '<div class="form-group" id="punya_ktp_'+counter_passenger+'" name="punya_ktp">' + scrap_html[2];
    if(test_type == 'swab_pcr'){
        scrap_html += phc_html(medical_config.result.response.carrier_type[test_type].form_info_klinis_belum).split('<div class="box-footer">')[0];
        scrap_html += phc_html(medical_config.result.response.carrier_type[test_type].form_faktor_kontaks).split('<div class="box-footer">')[0];
    }

    var node = document.createElement("tr");
    text += `
        <td>
            <span id='name_pax`+counter_passenger+`' name='name_pax`+counter_passenger+`'></span>
            <input id="id_passenger`+counter_passenger+`" name="id_passenger`+counter_passenger+`" type="hidden"/>
        </td>
        <td>
            <span id='birth_date`+counter_passenger+`' name='birth_date`+counter_passenger+`'></span>
        </td>
        <td>
            <span id='sample_method`+counter_passenger+`' name='sample_method`+counter_passenger+`'></span>
        </td>
        `;
    text += `
        <td>
            <div style="text-align:center;">
                <button type="button" class="primary-btn" style="margin-bottom:5px; line-height:34px;" data-toggle="modal" data-target="#myModalPassenger`+counter_passenger+`" onclick="set_passenger_number(`+counter_passenger+`);"><i class="fas fa-search"></i></button>
            </div>
            <!-- Modal -->
            <div class="modal fade" id="myModalPassenger`+counter_passenger+`" role="dialog" data-keyboard="false">
                <div class="modal-dialog">
                  <!-- Modal content-->
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title" style="color:white;">Passenger `+(counter_passenger+1)+`</h4>
                            <button type="button" class="close" data-dismiss="modal" onclick="update_contact('passenger',`+parseInt(counter_passenger+1)+`);">&times;</button>
                        </div>
                        <div class="modal-body">
                            `+scrap_html.replaceAll('\\r\\n', '').replace('multiple="multiple"','')+`
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
    $('#inp_tgl_lahir_blmpernah_'+parseInt(counter_passenger)).addClass('date-picker-birth');
    $('input[name="inp_tgl_lahir_blmpernah_'+parseInt(counter_passenger)+'"]').daterangepicker({
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
    try{
        kriteria_pasien_text = '';
        for(i in medical_config.result.response.kriteria_pasien){
            kriteria_pasien_text += `<option value="`+medical_config.result.response.kriteria_pasien[i].code+`">`+medical_config.result.response.kriteria_pasien[i].value+`</option>`;
        }
        document.getElementById('inp_kriteria_blmpernah_'+ counter_passenger).innerHTML += kriteria_pasien_text;
    }catch(err){}

    if(test_type == 'swab_pcr'){
        $('input[name="klinis_tgl_mrs_terakhir_'+parseInt(counter_passenger)+'"]').daterangepicker({
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

        $('input[name="klinis_tgl_meninggal_pasien_'+parseInt(counter_passenger)+'"]').daterangepicker({
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



        option = `
        <option value=""> -pilih disini- </option>
        <option value="IYA"> IYA </option>
        <option value="TIDAK"> TIDAK </option>`;

        input_option('klinis_riwayat_demam_' + counter_passenger, option, counter_passenger)
        input_option('klinis_diabetes_' + counter_passenger, option, counter_passenger)
        input_option('klinis_jantung_' + counter_passenger, option, counter_passenger)
        input_option('klinis_hipertensi_' + counter_passenger, option, counter_passenger)
        input_option('pilih_klinis_keganasan_' + counter_passenger, option, counter_passenger)
        input_option('klinis_imunologi_' + counter_passenger, option, counter_passenger)
        input_option('klinis_ginjal_' + counter_passenger, option, counter_passenger)
        input_option('klinis_hati_' + counter_passenger, option, counter_passenger)
        input_option('klinis_ppok_' + counter_passenger, option, counter_passenger)
        input_option('klinis_pasien_dirawat_' + counter_passenger, option, counter_passenger)
        input_option('klinis_dirawat_diicu_' + counter_passenger, option, counter_passenger)
        input_option('klinis_intubasi_' + counter_passenger, option, counter_passenger)
        input_option('klinis_pengg_emco_' + counter_passenger, option, counter_passenger)
        input_option('faktor_menimbulkan_aerosol_' + counter_passenger, option, counter_passenger)








        option = `
        <option value=""> -pilih disini- </option>
        <option value="IYA"> IYA </option>
        <option value="TIDAK"> TIDAK </option>
        <option value="TIDAK TAHU"> TIDAK TAHU </option>`;
        input_option('klinis_batuk_' + counter_passenger, option, counter_passenger)
        input_option('klinis_pilek_' + counter_passenger, option, counter_passenger)
        input_option('klinis_tenggorokan_' + counter_passenger, option, counter_passenger)
        input_option('pilih_klinis_sesak_' + counter_passenger, option, counter_passenger)
        input_option('klinis_skt_kpl_' + counter_passenger, option, counter_passenger)
        input_option('klinis_lemah_' + counter_passenger, option, counter_passenger)
        input_option('klinis_nyeri_otot_' + counter_passenger, option, counter_passenger)
        input_option('klinis_mual_' + counter_passenger, option, counter_passenger)
        input_option('klinis_nyeri_abdomen_' + counter_passenger, option, counter_passenger)
        input_option('klinis_diare_' + counter_passenger, option, counter_passenger)
        input_option('klinis_gang_penciuman_' + counter_passenger, option, counter_passenger)
        input_option('klinis_pneumonia_' + counter_passenger, option, counter_passenger)
        input_option('klinis_ards_' + counter_passenger, option, counter_passenger)
        input_option('klinis_penyakit_pernafasan_' + counter_passenger, option, counter_passenger)
        input_option('faktor_perj_keluar_negeri_' + counter_passenger, option, counter_passenger)
        input_option('faktor_perj_ketransmisi_lokal_' + counter_passenger, option, counter_passenger)
        input_option('faktor_berkunj_pekerja_' + counter_passenger, option, counter_passenger)
        input_option('faktor_berkunj_pasar_hewan_' + counter_passenger, option, counter_passenger)
        input_option('faktor_berkunj_pdp_' + counter_passenger, option, counter_passenger)
        input_option('faktor_berkunj_konfrim_' + counter_passenger, option, counter_passenger)
        input_option('faktor_cluster_ispa_' + counter_passenger, option, counter_passenger)
        input_option('faktor_petugas_kesehatan_' + counter_passenger, option, counter_passenger)


        option = `
        <option value=""> --pilih disini-- </option>
        <option value="SEMBUH">SEMBUH</option>
        <option value="MASIH SAKIT">MASIH SAKIT</option>
        <option value="MENINGGAL">MENINGGAL</option>`;

        input_option('klinis_sts_pasien_terakhir_' + counter_passenger, option, counter_passenger)

        option = '';
        for(i in medical_config.result.response.golongan_darah){
            option += `<option value="`+medical_config.result.response.golongan_darah[i].code+`">`+medical_config.result.response.golongan_darah[i].value+`</option>`;
        }
        input_option('klinis_gol_darah_' + counter_passenger, option, counter_passenger)

        option = '';
        for(i in medical_config.result.response.apd){
            option += `<option value="`+medical_config.result.response.apd[i].code+`">`+medical_config.result.response.apd[i].value+`</option>`;
        }
        input_option('faktor_pelindung_diri_' + counter_passenger, option, counter_passenger)
        document.getElementById('inp_kewarganegaraan_blmpernah_'+ counter_passenger).value = "INDONESIA";
    }

    try{
        daftar_maskapai_text = '';
        for(i in medical_config.result.response.maskapai){
            daftar_maskapai_text += `<option value="`+medical_config.result.response.maskapai[i].code+`">`+medical_config.result.response.maskapai[i].value+`</option>`;
        }
        document.getElementById('pilih_daftar_maskapai_'+ counter_passenger).innerHTML += daftar_maskapai_text;
    }catch(err){}
    $('#inp_tgl_pemeriksaan_'+parseInt(counter_passenger)).addClass('date-picker-birth');


    $('input[name="inp_tgl_pemeriksaan_'+counter_passenger+'"]').daterangepicker({
        singleDatePicker: true,
        autoUpdateInput: true,
        startDate: moment(),
        minDate: moment(),
        maxDate: moment().subtract(-13, 'days'),
        showDropdowns: true,
        opens: 'center',
        locale: {
            format: 'DD MMM YYYY',
        }
    });

    var radios = document.getElementsByName('radio_ktp_paspor_'+counter_passenger);
    for (var j = 0, length = radios.length; j < length; j++) {
        radios[j].setAttribute( "onChange", "javascript: check_identity("+counter_passenger+");" );
    }

    document.getElementById( "inp_kab_kot_domis_blmpernah_" + counter_passenger ).setAttribute( "onChange", "javascript: get_kecamatan('inp_kab_kot_domis_blmpernah_"+counter_passenger+"','inp_kec_domis_blmpernah_"+counter_passenger+"');" );
    document.getElementById( "inp_kec_domis_blmpernah_" + counter_passenger ).setAttribute( "onChange", "javascript: get_desa('inp_kec_domis_blmpernah_"+counter_passenger+"','inp_desa_domis_blmpernah_"+counter_passenger+"');" );

    document.getElementById( "inp_kab_kot_ktp_blmpernah_" + counter_passenger ).setAttribute( "onChange", "javascript: get_kecamatan('inp_kab_kot_ktp_blmpernah_"+counter_passenger+"','inp_kec_ktp_blmpernah_"+counter_passenger+"');" );
    document.getElementById( "inp_kec_ktp_blmpernah_" + counter_passenger ).setAttribute( "onChange", "javascript: get_desa('inp_kec_ktp_blmpernah_"+counter_passenger+"','inp_desa_ktp_blmpernah_"+counter_passenger+"');" );

    document.getElementById('alamat_sama_' + counter_passenger).setAttribute( "onChange", "javascript: copy_alamat("+counter_passenger+");" );

//    $('#inp_tmp_lahir_blmpernah_'+parseInt(counter_passenger)).addClass('nice-select-default');
//    $('#inp_jns_kel_blmpernah_'+parseInt(counter_passenger)).addClass('nice-select-default');
//    $('#inp_kab_kot_domis_blmpernah_'+parseInt(counter_passenger)).addClass('nice-select-default');
//    $('#inp_kab_kot_ktp_blmpernah_0'+parseInt(counter_passenger)).addClass('nice-select-default');
//
//    $('#inp_tmp_lahir_blmpernah_'+parseInt(counter_passenger)).niceSelect();
//    $('#inp_jns_kel_blmpernah_'+parseInt(counter_passenger)).niceSelect();
//    $('#inp_kab_kot_domis_blmpernah_'+parseInt(counter_passenger)).niceSelect();
//    $('#inp_kab_kot_ktp_blmpernah_0'+parseInt(counter_passenger)).niceSelect();



    if(type == 'open')
        $('#myModalPassenger'+parseInt(parseInt(counter_passenger))).modal('show');

    counter_passenger++;
}

function input_option(id, option, val){
    try{
    document.getElementById(id).innerHTML = option;
    if(id.includes('klinis_riwayat_demam_') == true){
        document.getElementById(id).setAttribute( "onChange", "javascript: show_hide_demam("+val+");" );
    }
    }catch(err){console.log(id);console.log(err);}
}

function show_hide_demam(val){
    if(document.getElementById('klinis_riwayat_demam_'+val).value == 'IYA'){
        document.getElementById('pilih_klinis_demam_'+val).style.display = 'block';
    }else{
        document.getElementById('pilih_klinis_demam_'+val).style.display = 'none';
    }
}

function copy_alamat(counter){
    console.log(document.getElementById('alamat_sama_'+counter).checked);
    if(document.getElementById('alamat_sama_'+counter).checked == true){
        document.getElementById('inp_lamat_ktp_blmpernah_'+counter).value = document.getElementById('inp_lamat_domis_blmpernah_'+counter).value;
        document.getElementById('inp_rt_ktp_blmpernah_'+counter).value = document.getElementById('inp_rt_domis_blmpernah_'+counter).value;
        document.getElementById('inp_rw_ktp_blmpernah_'+counter).value = document.getElementById('inp_rw_domis_blmpernah_'+counter).value;
        document.getElementById('inp_kab_kot_ktp_blmpernah_'+counter).value = document.getElementById('inp_kab_kot_domis_blmpernah_'+counter).value;
        document.getElementById('inp_kec_ktp_blmpernah_'+counter).innerHTML = document.getElementById('inp_kec_domis_blmpernah_'+counter).innerHTML;
        document.getElementById('inp_desa_ktp_blmpernah_'+counter).innerHTML = document.getElementById('inp_desa_domis_blmpernah_'+counter).innerHTML;

        if(test_type == 'swab_pcr'){
            document.getElementById('inp_lamat_ktp_blmpernah_copy_'+counter).value = document.getElementById('inp_lamat_domis_blmpernah_'+counter).value;
            document.getElementById('inp_rt_ktp_blmpernah_copy_'+counter).value = document.getElementById('inp_rt_domis_blmpernah_'+counter).value;
            document.getElementById('inp_rw_ktp_blmpernah_copy_'+counter).value = document.getElementById('inp_rw_domis_blmpernah_'+counter).value;
            document.getElementById('inp_kab_kot_ktp_blmpernah_copy_'+counter).value = document.getElementById('inp_kab_kot_domis_blmpernah_'+counter).value;
            document.getElementById('inp_kec_ktp_blmpernah_copy_'+counter).value = document.getElementById('inp_kec_domis_blmpernah_'+counter).value;
            document.getElementById('inp_desa_ktp_blmpernah_copy_'+counter).value = document.getElementById('inp_desa_domis_blmpernah_'+counter).value;
        }
    }else{
        document.getElementById('inp_lamat_ktp_blmpernah_'+counter).value = '';
        document.getElementById('inp_rt_ktp_blmpernah_'+counter).value = '';
        document.getElementById('inp_rw_ktp_blmpernah_'+counter).value = '';
        document.getElementById('inp_kab_kot_ktp_blmpernah_'+counter).value = '';
        document.getElementById('inp_kec_ktp_blmpernah_'+counter).innerHTML = '';
        document.getElementById('inp_desa_ktp_blmpernah_'+counter).innerHTML = '';
        if(test_type == 'swab_pcr')
            document.getElementById('inp_lamat_ktp_blmpernah_copy_'+counter).value = '';
        document.getElementById('inp_rt_ktp_blmpernah_copy_'+counter).value = '';
        document.getElementById('inp_rw_ktp_blmpernah_copy_'+counter).value = '';
        document.getElementById('inp_kab_kot_ktp_blmpernah_copy_'+counter).value = '';
        document.getElementById('inp_kec_ktp_blmpernah_copy_'+counter).innerHTML = '';
        document.getElementById('inp_desa_ktp_blmpernah_copy_'+counter).innerHTML = '';
    }
//    inp_lamat_domis_blmpernah_0
//    inp_rt_domis_blmpernah_0
//    inp_rw_domis_blmpernah_0
//    inp_kab_kot_domis_blmpernah_0
//    inp_kec_domis_blmpernah_0
//    inp_desa_domis_blmpernah_0
}

function delete_table_of_passenger(counter){
    if(counter_passenger != 0){
        try{
            var element = document.getElementById('table_passenger'+counter);
            element.parentNode.removeChild(element);
        }catch(err){}
    }
}

function update_contact(type,val){
    if(vendor == 'periksain'){
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
            if(document.getElementById('adult_sample_method'+val).value != ''){
                document.getElementById('sample_method'+parseInt(val-1)).innerHTML = document.getElementById('adult_sample_method'+val).value;
            }
        }
    }else if(vendor == 'phc'){
        if(type == 'booker'){
            if(document.getElementById('booker_title').value != '' && document.getElementById('booker_first_name').value != '' && document.getElementById('booker_last_name').value != '')
                document.getElementById('contact_person').value = document.getElementById('booker_title').value + ' ' + document.getElementById('booker_first_name').value + ' ' + document.getElementById('booker_last_name').value;
        }else if(type == 'passenger'){
            if(document.getElementById('title_'+parseInt(val-1)).value != '')
                document.getElementById('name_pax'+parseInt(val-1)).innerHTML = document.getElementById('title_'+parseInt(val-1)).value + ' ';
            if(document.getElementById('inp_nm_pasien_blmpernah_'+parseInt(val-1)).value != '')
                document.getElementById('name_pax'+parseInt(val-1)).innerHTML += document.getElementById('inp_nm_pasien_blmpernah_'+parseInt(val-1)).value;
            if(document.getElementById('inp_tgl_lahir_blmpernah_'+parseInt(val-1)).value != ''){
                document.getElementById('birth_date'+parseInt(val-1)).innerHTML = document.getElementById('inp_tgl_lahir_blmpernah_'+parseInt(val-1)).value;
            }
            document.getElementById('sample_method'+parseInt(val-1)).innerHTML = "-";
        }
    }
}

function check_passenger(){
    //booker
    request = {
        "data": {},
        "booker": {},
        "passenger": {},
        "contact_person": {}
    }
    error_log = '';
    try{
        for(i in passenger_data_pick){
            if(passenger_data_pick[i].sequence != 'booker'){
                passenger_check = {
                    'type': passenger_data_pick[i].sequence.substr(0, passenger_data_pick[i].sequence.length-1),
                    'number': passenger_data_pick[i].sequence.substr(passenger_data_pick[i].sequence.length-1, passenger_data_pick[i].sequence.length)
                }
                if(document.getElementById(passenger_check.type+passenger_check.number).value == passenger_data_pick[i].seq_id){
                    if(document.getElementById(passenger_check.type+'_title'+passenger_check.number).value != passenger_data_pick[i].title ||
                       document.getElementById(passenger_check.type+'_first_name'+passenger_check.number).value != passenger_data_pick[i].first_name ||
                       document.getElementById(passenger_check.type+'_last_name'+passenger_check.number).value != passenger_data_pick[i].last_name)
                        error_log += "Search "+passenger_check.type+" "+passenger_check.number+" doesn't match!</br>\nPlease don't use inspect element!</br>\n";
                }
           }else if(passenger_data_pick[i].sequence == 'booker'){
                if(document.getElementById('booker_title').value != passenger_data_pick[i].title ||
                    document.getElementById('booker_first_name').value != passenger_data_pick[i].first_name ||
                    document.getElementById('booker_last_name').value != passenger_data_pick[i].last_name)
                    error_log += "Search booker doesn't match!</br>\nPlease don't use inspect element!</br>\n";
           }
        }
    }catch(err){

    }

    if(document.getElementById('booker_address').value == ''){
        error_log+= 'Please fill address!</br>\n';
        document.getElementById('booker_address').style['border-color'] = 'red';
    }else{
        document.getElementById('booker_address').style['border-color'] = '#EFEFEF';
    }

    if(document.getElementById('booker_area').value == ''){
        error_log+= 'Please fill area test!</br>\n';
        document.getElementById('booker_area').style['border-color'] = 'red';
    }else{
        document.getElementById('booker_area').style['border-color'] = '#EFEFEF';
    }
    if(use_google_map == true){
        if(web_url == '' && google_api_key != ''){
            error_log+= 'Please choose your test place in google maps!</br>\n';
        }
    }

    if(error_log == ''){
        request['data'] = {
            'address': document.getElementById('booker_address').value,
            'area': document.getElementById('booker_area').value,
            'test_list': [],
            'kontrak': [],
            'questioner': [],
            'place_url_by_google': web_url
        }
    }
    var now = moment();
    var test_list_counter = 1;
    var add_list = true;
    for(i=1; i <= test_time; i++){
        try{
            add_list = true;
            if(now.format('DD MMM YYYY') == document.getElementById('booker_test_date'+i).value){
                if(now.diff(moment(document.getElementById('booker_test_date'+i).value+' '+document.getElementById('booker_timeslot_id'+i).value.split('~')[1]), 'hours') > -5){
                    add_list = false;
                    error_log += 'Test time reservation only can be book 3 hours before test please change test ' + test_list_counter + '!</br>\n';
                }
            }
            if(add_list == true){
                request['data']['test_list'].push({
                    "date": document.getElementById('booker_test_date'+i).value,
                    "time": document.getElementById('booker_timeslot_id'+i).value.split('~')[1],
                    "seq_id": document.getElementById('booker_timeslot_id'+i).value.split('~')[0]
                })
            }
            test_list_counter++;
        }catch(err){

        }

    }


    if(check_name(document.getElementById('booker_title').value,
                    document.getElementById('booker_first_name').value,
                    document.getElementById('booker_last_name').value,
                    25) == false){
        error_log+= 'Total of Booker name maximum 25 characters!</br>\n';
        document.getElementById('booker_first_name').style['border-color'] = 'red';
        document.getElementById('booker_last_name').style['border-color'] = 'red';
    }else{
        document.getElementById('booker_first_name').style['border-color'] = '#EFEFEF';
        document.getElementById('booker_last_name').style['border-color'] = '#EFEFEF';
    }if(document.getElementById('booker_first_name').value == ''){
        error_log+= 'Please fill booker first name!</br>\n';
        document.getElementById('booker_first_name').style['border-color'] = 'red';
    }else{
        document.getElementById('booker_first_name').style['border-color'] = '#EFEFEF';
    }if(check_phone_number(document.getElementById('booker_phone').value)==false){
        error_log+= 'Phone number Booker only contain number 8 - 12 digits!</br>\n';
        document.getElementById('booker_phone').style['border-color'] = 'red';
    }else{
        document.getElementById('booker_phone').style['border-color'] = '#EFEFEF';
    }if(check_email(document.getElementById('booker_email').value)==false){
        error_log+= 'Invalid Booker email!</br>\n';
        document.getElementById('booker_email').style['border-color'] = 'red';
    }else{
        document.getElementById('booker_email').style['border-color'] = '#EFEFEF';
    }
    length = 25;
    if(error_log == ''){
        request['booker'] = {
            "first_name": document.getElementById('booker_first_name').value,
            "last_name": document.getElementById('booker_last_name').value,
            "title": document.getElementById('booker_title').value,
            'email': document.getElementById('booker_email').value,
            'calling_code': document.getElementById('booker_phone_code').value,
            'mobile': document.getElementById('booker_phone').value,
            'nationality_name': document.getElementById('booker_nationality').value,
            'booker_seq_id': document.getElementById('booker_id').value
        }
        request['contact_person'] = [{
            "first_name": document.getElementById('booker_first_name').value,
            "last_name": document.getElementById('booker_last_name').value,
            "title": document.getElementById('booker_title').value,
            'email': document.getElementById('booker_email').value,
            'calling_code': document.getElementById('booker_phone_code').value,
            'mobile': document.getElementById('booker_phone').value,
            'nationality_name': document.getElementById('booker_nationality').value,
            'contact_seq_id': document.getElementById('booker_id').value,
            'is_also_booker': true
        }]
    }
    var check_passenger = false;
    if(counter_passenger == 0)
        error_log += 'Please fill passengers\n';
    else{
        request['passenger'] = []
        if(vendor == 'periksain'){
            for(i=0; i < counter_passenger; i++){
                nomor_pax = (i + 1)
                try{
                    //kasi if kosong
                    if(document.getElementById('adult_first_name' + nomor_pax).value == '' || check_word(document.getElementById('adult_first_name' + nomor_pax).value) == false){
                        error_log += 'Please fill or use alpha characters for first name for passenger '+ nomor_pax + ' !</br>\n';
                        document.getElementById('adult_first_name' + nomor_pax).style['border-color'] = 'red';
                    }else{
                        document.getElementById('adult_first_name' + nomor_pax).style['border-color'] = '#EFEFEF';
                    }
                    if(document.getElementById('adult_last_name' + nomor_pax).value == '' || check_word(document.getElementById('adult_last_name' + nomor_pax).value) == false){
                        error_log += 'Please fill or use alpha characters for last name for passenger '+ nomor_pax + ' !</br>\n';
                        document.getElementById('adult_last_name' + nomor_pax).style['border-color'] = 'red';
                    }else{
                        document.getElementById('adult_last_name' + nomor_pax).style['border-color'] = '#EFEFEF';
                    }
                    if(document.getElementById('adult_title' + nomor_pax).value == ''){
                        error_log += 'Please fill title name for passenger '+ nomor_pax + ' !</br>\n';
                        document.getElementById('adult_title' + nomor_pax).style['border-color'] = 'red';
                    }else{
                        document.getElementById('adult_title' + nomor_pax).style['border-color'] = '#EFEFEF';
                    }
                    if(document.getElementById('adult_nationality' + nomor_pax).value == ''){
                        error_log += 'Please fill title name for passenger '+ nomor_pax + ' !</br>\n';
                        document.getElementById('adult_nationality' + nomor_pax).style['border-color'] = 'red';
                    }else{
                        document.getElementById('adult_nationality' + nomor_pax).style['border-color'] = '#EFEFEF';
                    }
                    if(check_date(document.getElementById('adult_birth_date'+ nomor_pax).value)==false){
                        error_log+= 'Birth date wrong for passenger passenger '+nomor_pax+'!</br>\n';
                        document.getElementById('adult_birth_date'+ nomor_pax).style['border-color'] = 'red';
                    }else{
                        document.getElementById('adult_birth_date'+ nomor_pax).style['border-color'] = '#EFEFEF';
                    }
                    if(check_phone_number(document.getElementById('adult_phone' + nomor_pax).value)==false){
                        error_log+= 'Phone number only contain number 8 - 12 digits for passenger '+nomor_pax+'!</br>\n';
                        document.getElementById('adult_phone' + nomor_pax).style['border-color'] = 'red';
                    }else{
                        document.getElementById('adult_phone' + nomor_pax).style['border-color'] = '#EFEFEF';
                    }
                    if(check_email(document.getElementById('adult_email' + nomor_pax).value)==false){
                        error_log+= 'Invalid Passenger '+ nomor_pax +' email!</br>\n';
                        document.getElementById('adult_email' + nomor_pax).style['border-color'] = 'red';
                    }else{
                        document.getElementById('adult_email' + nomor_pax).style['border-color'] = '#EFEFEF';
                    }
                    if(document.getElementById('adult_sample_method' + nomor_pax).value == ''){
                        error_log+= 'Please choose sample method for passenger '+nomor_pax+'!</br>\n';
                        document.getElementById('adult_sample_method' + nomor_pax).style['border-color'] = 'red';
                    }else{
                        document.getElementById('adult_sample_method' + nomor_pax).style['border-color'] = '#EFEFEF';
                    }
                    if(document.getElementById('adult_identity_type' + nomor_pax).value != ''){
                        document.getElementById('adult_identity_type' + nomor_pax).style['border-color'] = '#EFEFEF';
                        if(document.getElementById('adult_identity_type' + nomor_pax).value == 'ktp'){
                            if(document.getElementById('adult_identity_number'+ nomor_pax).value == ''){
                                error_log+= 'Please fill identity number for passenger '+nomor_pax+'!</br>\n';
                                document.getElementById('adult_identity_number'+ nomor_pax).style['border-color'] = 'red';
                            }else if(check_ktp(document.getElementById('adult_identity_number'+ nomor_pax).value) == false){
                                error_log+= 'Please fill identity number, ktp only contain 16 digits for passenger adult '+nomor_pax+'!</br>\n';
                                document.getElementById('adult_identity_number'+ nomor_pax).style['border-color'] = 'red';
                            }else{
                                document.getElementById('adult_identity_number'+ nomor_pax).style['border-color'] = '#EFEFEF';
                            }
                            if(document.getElementById('adult_country_of_issued'+ nomor_pax).value == ''){
                                error_log+= 'Please fill country of issued for passenger '+i+'!</br>\n';
                                document.getElementById('adult_country_of_issued'+ nomor_pax).style['border-color'] = 'red';
                            }else{
                                document.getElementById('adult_country_of_issued'+ nomor_pax).style['border-color'] = '#EFEFEF';
                            }
                        }
                    }else{
                        error_log+= 'Please fill identity type for passenger '+nomor_pax+'!</br>\n';
                        document.getElementById('adult_identity_type' + nomor_pax).style['border-color'] = 'red';
                    }
                    if(i == 0 && document.getElementsByName('myRadios')[0].checked == true){
                        is_also_booker = true;
                        is_also_contact = true;
                    }else{
                        is_also_booker = false;
                        is_also_contact = false;
                    }
                    check_passenger = true;
                    request['passenger'].push({
                        "pax_type": "ADT",
                        "first_name": document.getElementById('adult_first_name' + nomor_pax).value,
                        "last_name": document.getElementById('adult_last_name' + nomor_pax).value,
                        "title": document.getElementById('adult_title' + nomor_pax).value,
                        "birth_date": document.getElementById('adult_birth_date' + nomor_pax).value,
                        "nationality_name": document.getElementById('adult_nationality' + nomor_pax).value,
                        "identity": {
                            "identity_country_of_issued_name": document.getElementById('adult_country_of_issued' + nomor_pax).value,
                            "identity_expdate": '',
                            "identity_number": document.getElementById('adult_identity_number' + nomor_pax).value,
                        },
                        "passenger_seq_id": document.getElementById('adult_id' + nomor_pax).value,
                        "identity_type": document.getElementById('adult_identity_type' + nomor_pax).value,
                        "sample_method": document.getElementById('adult_sample_method' + nomor_pax).value,
                        "email": document.getElementById('adult_email' + nomor_pax).value,
                        "phone_number": document.getElementById('adult_phone_code'+nomor_pax+'_id').value + document.getElementById('adult_phone'+nomor_pax).value,
                        'is_also_booker': is_also_booker,
                        'is_also_contact': is_also_contact

                    })
                }catch(err){}
            }
        }else if(vendor == 'phc'){
            for(i=0; i < counter_passenger; i++){
                try{
                    //kasi if kosong
                    if(document.getElementById('inp_nm_pasien_blmpernah_' + (i)).value == '' || check_word(document.getElementById('inp_nm_pasien_blmpernah_' + (i)).value) == false){
                        error_log += 'Please fill or use alpha characters for name for passenger '+ (i + 1) + ' !</br>\n';
                        document.getElementById('inp_nm_pasien_blmpernah_' + (i)).style['border-color'] = 'red';
                    }else{
                        document.getElementById('inp_nm_pasien_blmpernah_' + (i)).style['border-color'] = '#EFEFEF';
                    }

                    if(check_date(document.getElementById('inp_tgl_lahir_blmpernah_'+ (i)).value)==false){
                        error_log+= 'Birth date wrong for passenger passenger '+(i + 1)+'</br>!\n';
                        document.getElementById('inp_tgl_lahir_blmpernah_'+ (i)).style['border-color'] = 'red';
                    }else{
                        document.getElementById('inp_tgl_lahir_blmpernah_'+ (i)).style['border-color'] = '#EFEFEF';
                    }
                    if(check_phone_number(document.getElementById('inp_nomor_hp_blmpernah_' + (i)).value)==false){
                        error_log+= 'Phone number only contain number 8 - 12 digits for passenger '+(i+1)+'!</br>\n';
                        document.getElementById('inp_nomor_hp_blmpernah_' + (i)).style['border-color'] = 'red';
                    }else{
                        document.getElementById('inp_nomor_hp_blmpernah_' + (i)).style['border-color'] = '#EFEFEF';
                    }
                    if(check_email(document.getElementById('inp_email_blmpernah_' + (i)).value)==false){
                        error_log+= 'Invalid Passenger '+(i+1)+' email!</br>\n';
                        document.getElementById('inp_email_blmpernah_' + (i)).style['border-color'] = 'red';
                    }else{
                        document.getElementById('inp_email_blmpernah_' + (i)).style['border-color'] = '#EFEFEF';
                    }

                    if(document.getElementById('inp_nomor_nik_blmpernah_'+ (i)).value == ''){
                        error_log+= 'Please fill identity number for passenger '+(i + 1)+'!</br>\n';
                        document.getElementById('inp_nomor_nik_blmpernah_'+ (i)).style['border-color'] = 'red';
                    }else if(check_ktp(document.getElementById('inp_nomor_nik_blmpernah_'+ (i)).value) == false){
                        error_log+= 'Please fill identity number, ktp only contain 16 digits for passenger adult '+(i+1)+'!</br>\n';
                        document.getElementById('inp_nomor_nik_blmpernah_'+ (i)).style['border-color'] = 'red';
                    }else{
                        document.getElementById('inp_nomor_nik_blmpernah_'+ (i)).style['border-color'] = '#EFEFEF';
                    }
                    first_name = document.getElementById('inp_nm_pasien_blmpernah_' + (i)).value.split(' ');
                    last_name = ''
                    if(first_name.length > 1)
                        last_name = first_name.pop();
                    if(i == 0 && document.getElementsByName('myRadios')[0].checked == true){
                        is_also_booker = true;
                        is_also_contact = true;
                    }else{
                        is_also_booker = false;
                        is_also_contact = false;
                    }

                    request['passenger'].push({
                        "pax_type": "ADT",
                        "first_name": first_name.join(' '),
                        "last_name": last_name,
                        "title": document.getElementById('title_' + (i)).value,
                        "birth_date": document.getElementById('inp_tgl_lahir_blmpernah_' + (i)).value,
                        "nationality_name": "ID - Indonesia",
                        "identity_country_of_issued_name": 'ID - Indonesia',
                        "identity_expdate": '',
                        "identity_number": document.getElementById('inp_nomor_nik_blmpernah_'+ (i)).value,
                        "passenger_seq_id": '',
                        "identity_type": 'ktp',
                        "sample_method": "-",
                        'is_also_booker': is_also_booker,
                        'is_also_contact': is_also_contact
                    });
                    request['data']['kontrak'].push({
                        "inp_nm_pasien_blmpernah": document.getElementById('inp_nm_pasien_blmpernah_'+(i)).value,
                        "inp_nomor_nik_blmpernah": document.getElementById('inp_nomor_nik_blmpernah_'+(i)).value,
                        "inp_nomor_paspor_blmpernah": document.getElementById('inp_nomor_paspor_blmpernah_'+(i)).value,
                        "inp_tgl_lahir_blmpernah": document.getElementById('inp_tgl_lahir_blmpernah_'+(i)).value,
                        "inp_jns_kel_blmpernah": document.getElementById('inp_jns_kel_blmpernah_'+(i)).value,
                        "inp_tgl_pemeriksaan": document.getElementById('inp_tgl_pemeriksaan_'+(i)).value,
                        "inp_lamat_domis_blmpernah": document.getElementById('inp_lamat_domis_blmpernah_'+(i)).value,
                        "inp_rt_domis_blmpernah": document.getElementById('inp_rt_domis_blmpernah_'+(i)).value,
                        "inp_rw_domis_blmpernah": document.getElementById('inp_rw_domis_blmpernah_'+(i)).value,
                        "inp_desa_domis_blmpernah": document.getElementById('inp_desa_domis_blmpernah_'+(i)).value,
                        "inp_kec_domis_blmpernah": document.getElementById('inp_kec_domis_blmpernah_'+(i)).value,
                        "inp_kab_kot_domis_blmpernah": document.getElementById('inp_kab_kot_domis_blmpernah_'+(i)).value,
                        "inp_lamat_ktp_blmpernah": document.getElementById('inp_lamat_ktp_blmpernah_'+(i)).value,
                        "inp_rt_ktp_blmpernah": document.getElementById('inp_rt_ktp_blmpernah_'+(i)).value,
                        "inp_rw_ktp_blmpernah": document.getElementById('inp_rw_ktp_blmpernah_'+(i)).value,
                        "inp_desa_ktp_blmpernah": document.getElementById('inp_desa_ktp_blmpernah_'+(i)).value,
                        "inp_kec_ktp_blmpernah": document.getElementById('inp_kec_ktp_blmpernah_'+(i)).value,
                        "inp_kab_kot_ktp_blmpernah": document.getElementById('inp_kab_kot_ktp_blmpernah_'+(i)).value,
                        "inp_desa_ktp_blmpernah_copy": document.getElementById('inp_desa_ktp_blmpernah_copy_'+(i)).value,
                        "inp_kec_ktp_blmpernah_copy": document.getElementById('inp_kec_ktp_blmpernah_copy_'+(i)).value,
                        "inp_kab_kot_ktp_blmpernah_copy": document.getElementById('inp_kab_kot_ktp_blmpernah_copy_'+(i)).value,
                        "inp_nomor_hp_blmpernah": document.getElementById('inp_nomor_hp_blmpernah_'+(i)).value,
                        "inp_email_blmpernah": document.getElementById('inp_email_blmpernah_'+(i)).value,
                        "ip_komputer": document.getElementById('ip_komputer_'+(i)).value
                    })


                    if(test_type == 'swab_pcr'){
                        request['data']['passengers'][request['data']['passengers'].length-1]["inp_kewarganegaraan_blmpernah"] = document.getElementById('inp_kewarganegaraan_blmpernah_'+(i)).value;
                        request['data']['passengers'][request['data']['passengers'].length-1]["input_maskapai_blmpernah"] = document.getElementById('pilih_daftar_maskapai_'+(i)).value;
                        request['data']['passengers'][request['data']['passengers'].length-1]["inp_nomor_id_blmpernah"] = document.getElementById('inp_nomor_id_blmpernah_'+(i)).value;
                        request['data']['passengers'][request['data']['passengers'].length-1]["inp_nama_ortu_blmpernah"] = document.getElementById('inp_nama_ortu_blmpernah_'+(i)).value;
                        request['data']['passengers'][request['data']['passengers'].length-1]["inp_umur_blmpernah"] = document.getElementById('inp_umur_blmpernah_'+(i)).value;
                        request['data']['passengers'][request['data']['passengers'].length-1]["inp_pekerjaan_blmpernah"] =  document.getElementById('inp_pekerjaan_blmpernah_'+(i)).value;
                        request['data']['passengers'][request['data']['passengers'].length-1]["inp_kriteria_blmpernah"] = document.getElementById('inp_kriteria_blmpernah_'+(i)).value;
                        request['data']['passengers'][request['data']['passengers'].length-1]["periksa_swab_keberapa"] = document.getElementById('periksa_swab_keberapa_'+(i)).value;
                        request['data']['passengers'][request['data']['passengers'].length-1]["asal_perusahaan_rs"] = document.getElementById('asal_perusahaan_rs_'+(i)).value;
                        request['data']['passengers'][request['data']['passengers'].length-1]["nm_perusahaan_rs"] = document.getElementById('nm_perusahaan_rs_'+(i)).value;
//                        questioner pcr
                        request['data']['questioner'].push({

                        })
                    }
                    check_passenger = true;
                }catch(err){console.log(err);}
            }
        }
    }

   if(error_log=='' && check_passenger == true){
       document.getElementById('time_limit_input').value = time_limit;
       console.log(request);
       document.getElementById('data').value = JSON.stringify(request);
       document.getElementById('signature').value = signature;
       document.getElementById('vendor').value = vendor;
       document.getElementById('test_type').value = test_type;
       document.getElementById('medical_review').submit();
   }else{
       document.getElementById('show_error_log').innerHTML = error_log;
       $("#myModalErrorPassenger").modal('show');
       $('.next-loading').removeClass("running");
       $('.next-loading').prop('disabled', false);
       $('.loader-rodextrip').fadeOut();
   }

}

function reset_other_time(){
    test_time = 1;
    document.getElementById('test').innerHTML = '';
    radio_timeslot_type_func();
}

function reset_pax(){
    counter_passenger = 0;
    document.getElementById('table_of_passenger').innerHTML = `
    <tr>
        <th style="width:40%;">Name</th>
        <th style="width:20%;">Birth Date</th>
        <th style="width:15%;">Sample Method</th>
        <th style="width:20%;"></th>
    </tr>`;
    document.getElementById('table_passenger_list').style.display = 'none';
    document.getElementById('next_medical').style.display = 'none';
}

function show_commission(val){
    var sc = '';
    var scs = '';
    if(val == 'new'){
        sc = document.getElementById("show_commission_new");
        scs = document.getElementById("show_commission_button_new");
    }else if(val == 'commission'){
        var sc = document.getElementById("show_commission");
        var scs = document.getElementById("show_commission_button");
    }else{
        sc = document.getElementById("show_commission_old");
        scs = document.getElementById("show_commission_button_old");
    }
    if (sc.style.display === "none"){
        sc.style.display = "block";
        scs.value = "Hide Commission";
    }
    else{
        sc.style.display = "none";
        scs.value = "Show Commission";
    }
}

function radio_timeslot_type_func(val){
    if(val == 'fix'){
        document.getElementById('add_test_time_button').hidden = true;
        for(var i=2;i<=test_time;i++)
            delete_other_time('test'+i);
        test_time = 2;
    }else if(val == 'flexible'){
        document.getElementById('add_test_time_button').hidden = false;
    }
    if(test_time == 1){
        add_other_time();
    }
}

function add_table(){
    var tempcounter = parseInt(document.getElementById('passenger').value);
    if(tempcounter > last_counter){
        document.getElementById('table_passenger_list').style.display = 'block';
        for(counting=last_counter;counting<tempcounter;counting++){
            if(vendor == 'phc'){
                add_table_passenger_phc();
            }else if(vendor == 'periksain'){
                add_table_of_passenger();
            }
        }
    }else{
        for(counting=last_counter-1;counting>=tempcounter;counting--){
            delete_table_of_passenger(counting);
        }
        counter_passenger = tempcounter;
    }
    document.getElementById('medical_detail').style.display = 'none';
    document.getElementById('next_medical').style.display = 'none';
    last_counter = tempcounter;
}