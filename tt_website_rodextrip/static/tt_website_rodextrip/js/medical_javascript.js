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
                    <input type="text" class="form-control" style="cursor:pointer; background:white;" name="booker_test_date`+test_time+`" id="booker_test_date`+test_time+`" placeholder="Test Date" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Test Date '" autocomplete="off" readonly>
                </div>
            </div>`;
    if(vendor == 'periksain' || vendor == 'phc' && test_type == 'PHCHCKATG' || vendor == 'phc' && test_type == 'PHCHCKPCR')
        text+=`
            <div class="col-lg-6">`;
    else
        text+=`
            <div class="col-lg-6" hidden>`;
    text+=`
                <label style="color:red !important;">*</label>
                <label>Timeslot</label>
                <div class="row">
                    <div class="col-lg-8">`;

                    if(template == 1){
                        text+=`
                        <div class="form-select-2" id="default-select">
                            <select style="width:100%;" id="booker_timeslot_id`+test_time+`" placeholder="Timeslot" onclick="change_timeslot(`+test_time+`)">

                            </select>
                        </div>`;
                    }
                    else if(template == 2){
                        text+=`
                            <div class="form-select">
                                <select style="width:100%;" id="booker_timeslot_id`+test_time+`" placeholder="Timeslot" onclick="change_timeslot(`+test_time+`)">

                                </select>
                            </div>
                        </div>`;
                    }
                    else if(template == 3){
                        text+=`
                        <div class="form-group">
                            <div class="default-select">
                                <select style="width:100%;" id="booker_timeslot_id`+test_time+`" placeholder="Timeslot" onclick="change_timeslot(`+test_time+`)">

                                </select>
                            </div>
                        </div>`;
                    }
                    else if(template == 4){
                        text+=`
                        <div class="input-container-search-ticket">
                            <div class="form-select" id="default-select" style="width:100%;">
                                <select style="width:100%;" id="booker_timeslot_id`+test_time+`" placeholder="Timeslot" onclick="change_timeslot(`+test_time+`)">

                                </select>
                            </div>
                        </div>`;
                    }
                    else if(template == 5){
                        text+=`
                        <div class="form-select">
                            <select style="width:100%;" id="booker_timeslot_id`+test_time+`" placeholder="Timeslot" onclick="change_timeslot(`+test_time+`)">

                            </select>
                        </div>`;
                    }
                    else if(template == 6){
                        text+=`
                        <div class="form-select-2" id="default-select">
                            <select style="width:100%;" id="booker_timeslot_id`+test_time+`" placeholder="Timeslot" onclick="change_timeslot(`+test_time+`)">

                            </select>
                        </div>`;
                    }
                    text+=`
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
    $('#booker_timeslot_id'+test_time).niceSelect();
    update_timeslot(test_time);

    test_time++;
}

function update_timeslot(val){
    var text = '';
    var medical_date_pick = moment(document.getElementById('booker_test_date'+val).value).format('YYYY-MM-DD');
    var now = moment();
    for(i in medical_get_availability_response[document.getElementById('booker_area').value].timeslots[medical_date_pick]){
        if(medical_get_availability_response[document.getElementById('booker_area').value].timeslots[medical_date_pick][i].availability == false){
            text+= `<option disabled value="`+medical_get_availability_response[document.getElementById('booker_area').value].timeslots[medical_date_pick][i].seq_id+`~`+medical_get_availability_response[document.getElementById('booker_area').value].timeslots[medical_date_pick][i].time+`">`+medical_get_availability_response[document.getElementById('booker_area').value].timeslots[medical_date_pick][i].time+``;
        }else{
            text+= `<option value="`+medical_get_availability_response[document.getElementById('booker_area').value].timeslots[medical_date_pick][i].seq_id+`~`+medical_get_availability_response[document.getElementById('booker_area').value].timeslots[medical_date_pick][i].time+`">`+medical_get_availability_response[document.getElementById('booker_area').value].timeslots[medical_date_pick][i].time+``;
        }
        if(medical_get_availability_response[document.getElementById('booker_area').value].timeslots[medical_date_pick][i].group_booking == true)
            text+= ` Group Booking`;
        if(medical_get_availability_response[document.getElementById('booker_area').value].timeslots[medical_date_pick][i].availability == false)
            text+= ` Full`;
        else if(medical_get_availability_response[document.getElementById('booker_area').value].timeslots[medical_date_pick][i].availability == true)
            text+= ` Available`;
        text+=`</option>`;
    }
    document.getElementById('booker_timeslot_id'+val).innerHTML = text;
    $('#booker_timeslot_id'+val).niceSelect('update');
    change_timeslot(val);
}

function change_timeslot(val){
    var medical_date_pick = moment(document.getElementById('booker_test_date'+val).value).format('YYYY-MM-DD');
    for(i in medical_get_availability_response[document.getElementById('booker_area').value].timeslots[medical_date_pick]){
        if(medical_get_availability_response[document.getElementById('booker_area').value].timeslots[medical_date_pick][i].seq_id == document.getElementById('booker_timeslot_id'+val).value.split('~')[0]){
            var jumlah_pax = parseInt(document.getElementById('passenger').value);
            if(jumlah_pax == NaN)
                jumlah_pax = 1;
            var max_pax = 200;
            if(medical_get_availability_response[document.getElementById('booker_area').value].timeslots[medical_date_pick][i].group_booking == true){
                max_pax = 200;
            }else{
                max_pax = 20;
            }
            text = '';
            for(i=1;i<=max_pax;i++){
                if(jumlah_pax == i)
                    text+= `<option value="`+i+`" selected>`+i+`</option>`;
                else
                    text+= `<option value="`+i+`">`+i+`</option>`;
            }
            document.getElementById('passenger').innerHTML = text;
            $('#passenger').niceSelect('update');
            if (typeof data_kota !== 'undefined') {
                add_table();
            }
            break;
        }
    }
    document.getElementById('medical_detail').innerHTML = '';
    document.getElementById('medical_detail').style.display = 'none';
}

function delete_other_time(val){
    var element = document.getElementById(val);
    element.parentNode.removeChild(element);
}

function add_table_of_passenger(type){
    text= '';
    set_passenger_number(counter_passenger);
    var node = document.createElement("div");
    text += `
    <div class="col-lg-12" style="padding:15px; background:`+color+`;" id="title_form_customer`+counter_passenger+`">
        <span style="width:100%; font-weight:700; font-size:18px; color:`+text_color+`;">
            Customer #`+(parseInt(counter_passenger)+1)+`
        </span>
    </div>
    <div class="col-lg-12 mb-4" style="border:1px solid `+color+`; padding:20px 15px 0px 15px;" id="div_form_customer`+counter_passenger+`">
        <span id="span_customer_data`+counter_passenger+`" style="color:red; font-weight:bold;"></span><br/>
        <div class="row mt-2">`;
            if(vendor == 'periksain'){
                text+=`
                <div class="col-lg-4 mt-3">
                    <span style="padding-right:10px; font-weight:700; font-size:15px;">Sample Method</span>
                </div>
                <div class="col-lg-8">`;
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
                    }else if(template == 6){
                        text+=`<div class="default-select">`;
                    }

                    if(template == 5){
                        text+=`<div class="form-select">`;
                    }else{
                        text+=`<div class="form-select-2">`;
                    }

                    if(template == 4){
                        text+=`<select class="nice-select-default rounded" id="adult_sample_method`+parseInt(counter_passenger+1)+`" name="adult_sample_method`+parseInt(counter_passenger+1)+`">`;
                    }else{
                        text+=`<select id="adult_sample_method`+parseInt(counter_passenger+1)+`" name="adult_sample_method`+parseInt(counter_passenger+1)+`">`;
                    }
                    text+=`
                        <option value="">Choose Sample Method</option>
                        <option value="saliva">Saliva</option>
                        <option value="nasal_swab">Nasal Swab</option>`;
                        text+=`</select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4 mt-4">
                    <span style="padding-right:10px; font-weight:700; font-size:15px;">Address KTP</span>
                </div>
                <div class="col-lg-8">
                    <div class="input-container-search-ticket" style="margin-top:15px;">
                        <input type="text" class="form-control" name="adult_address_ktp`+parseInt(counter_passenger+1)+`" id="adult_address_ktp`+parseInt(counter_passenger+1)+`" placeholder="Address KTP " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Address KTP '" onchange="auto_change_copy_to_ktp(`+parseInt(counter_passenger+1)+`);">
                    </div>
                </div>`;
            }

            text+=`<div class="col-lg-12 mt-4 mb-3">`;

            text+=`
                <div class="row">
                    <div class="col-lg-6">
                        <span style="padding-right:10px; font-weight:700; font-size:15px;">Customer Data</span><br/>
                        <span style="padding-right:5px; font-style: italic; font-weight:500;" id='name_pax`+counter_passenger+`' name='name_pax`+counter_passenger+`'>
                            -- Blank Customer Data --
                        </span>
                        <br/>
                        <span id='birth_date`+counter_passenger+`' name='birth_date`+counter_passenger+`'></span>
                    </div>
                    <div class="col-lg-6 pt-2" style="text-align:right;">
                        <button type="button" id="button_pax`+counter_passenger+`" class="primary-btn" style="margin-bottom:5px; font-size:12px; width:90px; height:40px; padding-left:12px; padding-right:12px; line-height:30px; font-weight:700;" onclick="set_passenger_number(`+counter_passenger+`); update_customer_fill('fill',`+counter_passenger+`);">
                            Fill <i class="fas fa-pen"></i>
                        </button>`;

                    if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false){
                        text+=`
                        <button type="button" id="button_search`+counter_passenger+`" class="primary-btn" style="margin-bottom:5px; width:90px; height:40px; font-size:12px; padding-left:12px; padding-right:12px; line-height:30px; font-weight:700;" data-toggle="modal" data-target="#myModalPassengerSearch`+counter_passenger+`" onclick="set_passenger_number(`+counter_passenger+`);">
                            Search <i class="fas fa-search"></i>
                        </button>`;
                    }
                    text+=`
                        <button type="button" id="button_clear`+counter_passenger+`" class="primary-btn" style="background:#c73912; width:90px; height:40px; margin-bottom:5px; font-size:12px; padding-left:12px; padding-right:12px; line-height:30px; font-weight:700;" onclick="clear_passenger('Adult',`+(parseInt(counter_passenger)+1)+`); clear_text_medical(`+counter_passenger+`);">
                            Clear <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            </div>`;

            text+=`
            <input id="id_passenger`+counter_passenger+`" name="id_passenger`+counter_passenger+`" type="hidden"/>

            <div class="col-lg-12" id="div_passenger_list`+counter_passenger+`" style="display:none;">

            </div>
        </div>
    </div>`;
    node.className = 'col-lg-12';
    node.innerHTML = text;
    node.setAttribute('id', 'table_passenger'+counter_passenger);
    document.getElementById("div_of_passenger").appendChild(node);

    text_modal_paxs= '';
    var node_modal = document.createElement("div");

    text_modal_paxs += `
    <div class="modal fade" id="myModalPassengerSearch`+counter_passenger+`" role="dialog" data-keyboard="false">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title" style="color:white;">Customer #`+(counter_passenger+1)+`</h4>
                    <button type="button" class="close" data-dismiss="modal" onclick="update_contact('passenger',`+parseInt(counter_passenger+1)+`);">&times;</button>
                </div>
                <div class="modal-body">
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
            </div>
        </div>
    </div>`;

    node_modal.innerHTML = text_modal_paxs;
    node_modal.setAttribute('id', 'modal_passenger'+counter_passenger);
    document.getElementById("modal_passenger_list").appendChild(node_modal);

    text_div_paxs= '';

    text_div_paxs+=`
        <div class="row">
            <div class="col-lg-12" id="adult_paxs`+parseInt(counter_passenger+1)+`" style="padding:15px 15px 0px 15px; border-top:1px solid #cdcdcd; border-bottom:1px solid #cdcdcd;">
                <div class="row">
                    <div class="col-lg-12 mb-3" style="text-align:center;">
                        <h3 style="color:`+color+`; border-bottom:2px solid `+color+`;">Fill the Form</h3>
                    </div>`;

                    if(vendor != 'phc'){
                        text_div_paxs+=`
                        <div class="col-lg-12" style="text-align:right;">
                            <button type="button" class="primary-btn prev-next-form" style="margin-bottom:5px; font-size:12px; font-weight:700;" onclick="update_customer_fill('save',`+counter_passenger+`)">
                                Save <i class="fas fa-save"></i>
                            </button>
                        </div>`;
                    }

                    if(vendor == 'phc'){
                        text_div_paxs+=`
                        <div class="col-lg-12 mb-3" style="text-align:center;">
                            <ul class="progress_tabs">`;
                                if(test_type == 'PHCHCKPCR' || test_type == 'PHCDTKPCR'){
                                    text_div_paxs+=`
                                    <li class="progress_medical`+counter_passenger+`" id="progress_tab1`+counter_passenger+`" onclick="next_prev_form_medical('tab', 1, `+counter_passenger+`)">
                                        <label id="progress_label1`+counter_passenger+`" style="cursor:pointer;">
                                            <span class="progress_icon progress_icon-active" id="progress_med1`+counter_passenger+`">1</span>
                                            Personal Data
                                        </label>
                                    </li>
                                    <li class="progress_medical`+counter_passenger+`" id="progress_tab2`+counter_passenger+`" onclick="next_prev_form_medical('tab', 2, `+counter_passenger+`)">
                                        <label id="progress_label2`+counter_passenger+`" style="cursor:pointer;">
                                            <span class="progress_icon" id="progress_med2`+counter_passenger+`">2</span>
                                            Medical Data
                                        </label>
                                    </li>`;
                                    text_div_paxs+=`
                                    <li class="progress_medical`+counter_passenger+`" id="progress_tab3`+counter_passenger+`" onclick="next_prev_form_medical('tab', 3, `+counter_passenger+`)">
                                        <label id="progress_label3`+counter_passenger+`" style="cursor:pointer;">
                                            <span class="progress_icon" id="progress_med3`+counter_passenger+`">3</span>
                                            Faktor Kontak/Paparan
                                        </label>
                                    </li>`;
                                }
                            text_div_paxs+=`
                            </ul>
                        </div>`;
                    }

                    text_div_paxs += `
                    <div class="col-lg-12 mt-2 mb-2" id="show_error_form`+counter_passenger+`" style="text-align:center;">

                    </div>`;

                    if(vendor == 'phc'){
                        //ini tab personal
                        text_div_paxs+=`
                        <div id="progress_div1`+counter_passenger+`" style="background:#fcfcfc; border-top:1px solid #cdcdcd; display:block; padding:15px;">
                            <div class="row">
                                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4" style="text-align:left;"></div>`;
                                if(test_type == 'PHCHCKPCR' || test_type == 'PHCDTKPCR'){
                                    text_div_paxs+=`
                                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4" style="text-align:center;"></div>
                                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4" style="text-align:right;">
                                        <button type="button" class="primary-btn prev-next-form" style="margin-bottom:5px; font-size:12px; font-weight:700;" onclick="next_prev_form_medical('next', 2, `+counter_passenger+`);">
                                            Next <i class="fas fa-arrow-right"></i>
                                        </button>
                                    </div>`;
                                }else{
                                    text_div_paxs+=`
                                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4" style="text-align:center;">
                                        <button type="button" class="primary-btn prev-next-form" style="margin-bottom:5px; font-size:12px; font-weight:700;" onclick="update_customer_fill('save',`+counter_passenger+`)">
                                            Save <i class="fas fa-save"></i>
                                        </button>
                                    </div>
                                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4" style="text-align:right;"></div>`;
                                }
                    }
                    text_div_paxs+=`
                    <div class="col-lg-6 col-md-6 col-sm-6" style="margin-top:15px;">
                        <label style="color:red !important">*</label>
                        <label>Title</label>`;
                        if(template == 1){
                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                        }else if(template == 2){
                            text_div_paxs+=`<div>`;
                        }else if(template == 3){
                            text_div_paxs+=`<div class="default-select">`;
                        }else if(template == 4){
                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                        }else if(template == 5){
                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                        }else if(template == 6){
                            text_div_paxs+=`<div class="default-select">`;
                        }

                        if(template == 5){
                            text_div_paxs+=`<div class="form-select">`;
                        }else{
                            text_div_paxs+=`<div class="form-select-2">`;
                        }

                        if(template == 4){
                            text_div_paxs+=`<select style="width:100%;" class="nice-select-default rounded" id="adult_title`+parseInt(counter_passenger+1)+`" name="adult_title`+parseInt(counter_passenger+1)+`" onchange="onchange_title(`+parseInt(counter_passenger+1)+`)">`;
                        }else{
                            text_div_paxs+=`<select style="width:100%;" id="adult_title`+parseInt(counter_passenger+1)+`" name="adult_title`+parseInt(counter_passenger+1)+`" onchange="onchange_title(`+parseInt(counter_passenger+1)+`)">`;
                        }
                                text_div_paxs+= `<option value="MR">MR (Male)</option>`;
                                text_div_paxs+= `<option value="MRS">MRS (Female)</option>`;
                                text_div_paxs+= `<option value="MS">MS (Female)</option>`;
                                text_div_paxs+= `</select>
                            </div>
                        </div>
                    </div>`;

                    if(test_type == 'PHCHCKPCR' || test_type == 'PHCDTKPCR'){
                        text_div_paxs+=`
                        <div class="col-lg-6 col-md-6 col-sm-6" id="adult_hamil_div`+parseInt(counter_passenger+1)+`" style="margin-top:15px;" hidden>
                            <label style="color:red !important">*</label>
                            <label>Sedang Hamil</label>`;
                            if(template == 1){
                                text_div_paxs+=`<div class="input-container-search-ticket">`;
                            }else if(template == 2){
                                text_div_paxs+=`<div>`;
                            }else if(template == 3){
                                text_div_paxs+=`<div class="default-select">`;
                            }else if(template == 4){
                                text_div_paxs+=`<div class="input-container-search-ticket">`;
                            }else if(template == 5){
                                text_div_paxs+=`<div class="input-container-search-ticket">`;
                            }

                            if(template == 5){
                                text_div_paxs+=`<div class="form-select">`;
                            }else{
                                text_div_paxs+=`<div class="form-select-2">`;
                            }

                            if(template == 4){
                                text_div_paxs+=`<select class="nice-select-default rounded" id="adult_klinis_sedang_hamil`+parseInt(counter_passenger+1)+`" name="adult_klinis_sedang_hamil`+parseInt(counter_passenger+1)+`">`;
                            }else{
                                text_div_paxs+=`<select id="adult_klinis_sedang_hamil`+parseInt(counter_passenger+1)+`" name="adult_klinis_sedang_hamil`+parseInt(counter_passenger+1)+`">`;
                            }

                            text_div_paxs += '<option value="">Choose</option>';
                                for(i in medical_config.result.response.pilihan_jawaban)
                                    text_div_paxs+=`<option value="`+medical_config.result.response.pilihan_jawaban[i]+`">`+medical_config.result.response.pilihan_jawaban[i]+`</option>`;
                                    text_div_paxs+=`</select>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-12"></div>`;
                    }else{
                        text_div_paxs+=`<div class="col-lg-6 col-md-6 col-sm-6"></div>`;
                    }


                    text_div_paxs+=`
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
                    </div>`;

                    if(vendor == 'phc'){
                        if(test_type == 'PHCHCKPCR' || test_type == 'PHCDTKPCR'){
                            text_div_paxs+=`
                            <div class="col-lg-6 col-md-6 col-sm-6">
                                <label style="color:red !important">*</label>
                                <label>Mother name</label>
                                <div class="input-container-search-ticket" style="margin-bottom:5px;">
                                    <input type="text" class="form-control" name="adult_mother_name`+parseInt(counter_passenger+1)+`" id="adult_mother_name`+parseInt(counter_passenger+1)+`" placeholder="Mother Name " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Mother Name '">
                                </div>
                            </div>`;
                        }
                    }

                    text_div_paxs+=`
                    <div class="col-lg-6 col-md-6 col-sm-6">
                        <label style="color:red !important">*</label>
                        <label>Nationality</label>`;
                        if(template == 1 || template == 5){
                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                        }
                        text_div_paxs+=`
                            <div class="form-select">
                                <select class="form-control js-example-basic-single" name="adult_nationality`+parseInt(counter_passenger+1)+`_id" style="width:100%;" id="adult_nationality`+parseInt(counter_passenger+1)+`_id" placeholder="Nationality" onchange="auto_complete('adult_nationality`+parseInt(counter_passenger+1)+`')">
                                    <option value="">Select Nationality</option>`;
                                    for(i in countries){
                                        if(countries[i].code == 'ID')
                                           text_div_paxs+=`<option value="`+countries[i].code+`" selected>`+countries[i].name+`</option>`;
                                        else
                                           text_div_paxs+=`<option value="`+countries[i].code+`">`+countries[i].name+`</option>`;
                                    }
                                text_div_paxs+=`</select>
                            </div>
                            <input type="hidden" name="adult_nationality`+parseInt(counter_passenger+1)+`" id="adult_nationality`+parseInt(counter_passenger+1)+`" />`;
                        if(template == 1 || template == 5){
                            text_div_paxs+=`</div>`;
                        }
                    text_div_paxs+=`
                    </div>`;

                    if(vendor == 'phc'){
                        if(test_type == 'PHCHCKATG' || test_type == 'PHCDTKATG'){
                            text_div_paxs += `<div class="col-lg-6 col-md-6 col-sm-6"></div>`;
                        }
                    }

                    //ini phc
                    if(vendor == 'phc'){
                        text_div_paxs+=`
                        <div class="col-lg-6 col-md-6 col-sm-6">
                            <label style="color:red !important">*</label>
                            <label>Tempat Lahir</label>`;
                            if(template == 1){
                                text_div_paxs+=`<div class="input-container-search-ticket">`;
                            }else if(template == 2){
                                text_div_paxs+=`<div>`;
                            }else if(template == 3){
                                text_div_paxs+=`<div class="default-select">`;
                            }else if(template == 4){
                                text_div_paxs+=`<div class="input-container-search-ticket">`;
                            }else if(template == 5){
                                text_div_paxs+=`<div class="input-container-search-ticket">`;
                            }
                            text_div_paxs+=`
                            <div class="form-select">
                                <select class="form-control js-example-basic-single" name="adult_tempat_lahir`+parseInt(counter_passenger+1)+`_id" style="width:100%;" id="adult_tempat_lahir`+parseInt(counter_passenger+1)+`_id" placeholder="Tempat Lahir" onchange="auto_complete('adult_tempat_lahir`+parseInt(counter_passenger+1)+`');">
                                    <option value="">Select Tempat Lahir</option>`;
                                for(i in data_kota)
                                text_div_paxs+=`<option value="`+i+`">`+i+`</option>`;
                            text_div_paxs+=`</select>
                                </div>
                                <input type="hidden" name="adult_tempat_lahir`+parseInt(counter_passenger+1)+`" id="adult_tempat_lahir`+parseInt(counter_passenger+1)+`" />
                            </div>
                        </div>`;
                    }

                    text_div_paxs+=`
                    <div class="col-lg-6 col-md-6 col-sm-6">
                        <label style="color:red !important">*</label>
                        <label>Birth Date</label>
                        <div class="input-container-search-ticket" style="margin-bottom:5px;">
                            <input type="text" class="form-control date-picker-birth" name="adult_birth_date`+parseInt(counter_passenger+1)+`" id="adult_birth_date`+parseInt(counter_passenger+1)+`" onchange="check_years_old(`+parseInt(counter_passenger+1)+`)" placeholder="Birth Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Birth Date '" autocomplete="off">
                            <input type="hidden" class="form-control" name="adult_years_old`+parseInt(counter_passenger+1)+`" id="adult_years_old`+parseInt(counter_passenger+1)+`">
                        </div>
                    </div>`;

                    text_div_paxs+=`
                    <div class="col-lg-6 col-md-6 col-sm-6">
                        <label style="color:red !important">*</label>
                        <label>ID Type</label>`;
                        if(template == 1){
                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                        }else if(template == 2){
                            text_div_paxs+=`<div>`;
                        }else if(template == 3){
                            text_div_paxs+=`<div class="default-select">`;
                        }else if(template == 4){
                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                        }else if(template == 5){
                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                        }else if(template == 6){
                            text_div_paxs+=`<div class="default-select">`;
                        }

                        if(template == 5){
                            text_div_paxs+=`<div class="form-select">`;
                        }else{
                            text_div_paxs+=`<div class="form-select-2">`;
                        }

                        if(template == 4){
                            text_div_paxs+=`<select class="nice-select-default rounded" id="adult_identity_type`+parseInt(counter_passenger+1)+`" name="adult_identity_type`+parseInt(counter_passenger+1)+`" onchange="change_country_of_issued(`+parseInt(counter_passenger+1)+`);set_exp_identity(`+parseInt(counter_passenger+1)+`);">`;
                        }else{
                            text_div_paxs+=`<select id="adult_identity_type`+parseInt(counter_passenger+1)+`" name="adult_identity_type`+parseInt(counter_passenger+1)+`" onchange="change_country_of_issued(`+parseInt(counter_passenger+1)+`);set_exp_identity(`+parseInt(counter_passenger+1)+`);">`;
                        }
                        if(vendor == 'phc')
                            text_div_paxs+=`
                            <option value="ktp">NIK(KTP/KSK)</option>`;
                        else
                            text_div_paxs+=`
                            <option value="ktp">KTP</option>`;
                        if(vendor != 'periksain' && test_type != 'PHCHCKATG' && test_type != 'PHCDTKATG')
                        text_div_paxs+=`
                            <option value="passport">Passport</option>`;
                            text_div_paxs+=`</select>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-6">
                        <label style="color:red !important">*</label>
                        <label>Identity Number</label>
                        <div class="input-container-search-ticket" style="margin-bottom:5px;">
                            <input type="text" class="form-control" name="adult_identity_number`+parseInt(counter_passenger+1)+`" id="adult_identity_number`+parseInt(counter_passenger+1)+`" placeholder="Identity Number " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Identity Number '">
                        </div>
                    </div>

                    <div class="col-lg-6 col-md-6 col-sm-6" id="identity_exp_date_hidden`+parseInt(counter_passenger+1)+`" hidden>
                        <label style="color:red !important">*</label>
                        <label>Identity Expired Date</label>
                        <div class="input-container-search-ticket" style="margin-bottom:5px;">
                            <input type="text" class="form-control date-picker-passport" name="adult_identity_expired_date`+parseInt(counter_passenger+1)+`" id="adult_identity_expired_date`+parseInt(counter_passenger+1)+`" placeholder="Identity Expired Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Identity Expired Date '">
                            <button type="button" class="primary-delete-date" onclick="clear_date('adult_identity_expired_date`+parseInt(counter_passenger+1)+`')"><i class="fa fa-trash-alt" style="color:#E92B2B;font-size:20px;"></i></button>
                        </div>
                    </div>`;

                    text_div_paxs+=`
                    <div class="col-lg-6 col-md-6 col-sm-6">
                        <label style="color:red !important">*</label>
                        <label>Country of Issued</label>`;
                        if(template == 1){
                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                            text_div_paxs+=`
                                <div class="form-select">
                                    <select class="form-control js-example-basic-single" name="adult_country_of_issued`+parseInt(counter_passenger+1)+`_id" style="width:100%;" id="adult_country_of_issued`+parseInt(counter_passenger+1)+`_id" placeholder="Country Of Issued" onchange="auto_complete('adult_country_of_issued`+parseInt(counter_passenger+1)+`');">
                                        <option value="">Select Country Of Issued</option>`;
                                        for(i in countries){
                                           if(countries[i].code == 'ID')
                                                text_div_paxs+=`<option value="`+countries[i].code+`" selected>`+countries[i].name+`</option>`;
                                           else
                                                text_div_paxs+=`<option value="`+countries[i].code+`">`+countries[i].name+`</option>`;
                                        }
                                    text_div_paxs+=`</select>
                                </div>
                                <button type="button" class="primary-delete-date" onclick="delete_country_of_issued('adult', `+parseInt(counter_passenger+1)+`)"><i class="fa fa-trash-alt" style="color:#E92B2B;font-size:20px;"></i></button>
                                <input type="hidden" name="adult_country_of_issued`+parseInt(counter_passenger+1)+`" id="adult_country_of_issued`+parseInt(counter_passenger+1)+`" value="Indonesia"/>`;
                            text_div_paxs+=`</div>`;
                        }
                        else if(template == 2){
                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                            text_div_paxs+=`
                                <select class="form-control js-example-basic-single" name="adult_country_of_issued`+parseInt(counter_passenger+1)+`_id" style="width:100%;" id="adult_country_of_issued`+parseInt(counter_passenger+1)+`_id" placeholder="Country Of Issued" onchange="auto_complete('adult_country_of_issued`+parseInt(counter_passenger+1)+`');">
                                    <option value="">Select Country Of Issued</option>`;
                                    for(i in countries){
                                       if(countries[i].code == 'ID')
                                            text_div_paxs+=`<option value="`+countries[i].code+`" selected>`+countries[i].name+`</option>`;
                                       else
                                            text_div_paxs+=`<option value="`+countries[i].code+`">`+countries[i].name+`</option>`;
                                    }
                                text_div_paxs+=`</select>
                                <button type="button" class="primary-delete-date" onclick="delete_country_of_issued('adult', `+parseInt(counter_passenger+1)+`)"><i class="fa fa-trash-alt" style="color:#E92B2B;font-size:20px;"></i></button>
                                <input type="hidden" name="adult_country_of_issued`+parseInt(counter_passenger+1)+`" id="adult_country_of_issued`+parseInt(counter_passenger+1)+`" />`;
                            text_div_paxs+=`</div>`;
                        }
                        else if(template == 3){
                            text_div_paxs+=`<div class="input-container-search-ticket" style="margin-bottom:5px;">`;
                            text_div_paxs+=`
                                <select class="form-control js-example-basic-single" name="adult_country_of_issued`+parseInt(counter_passenger+1)+`_id" style="width:100%;" id="adult_country_of_issued`+parseInt(counter_passenger+1)+`_id" placeholder="Country Of Issued" onchange="auto_complete('adult_country_of_issued`+parseInt(counter_passenger+1)+`');">
                                    <option value="">Select Country Of Issued</option>`;
                                    for(i in countries){
                                       if(countries[i].code == 'ID')
                                            text_div_paxs+=`<option value="`+countries[i].code+`" selected>`+countries[i].name+`</option>`;
                                       else
                                            text_div_paxs+=`<option value="`+countries[i].code+`">`+countries[i].name+`</option>`;
                                    }
                                text_div_paxs+=`</select>
                                <button type="button" class="primary-delete-date" onclick="delete_country_of_issued('adult', `+parseInt(counter_passenger+1)+`)"><i class="fa fa-trash-alt" style="color:#E92B2B;font-size:20px;"></i></button>
                                <input type="hidden" name="adult_country_of_issued`+parseInt(counter_passenger+1)+`" id="adult_country_of_issued`+parseInt(counter_passenger+1)+`" />`;
                            text_div_paxs+=`</div>`;
                        }
                        else if(template == 4){
                            text_div_paxs+=`<div class="input-container-search-ticket" style="margin-bottom:5px;">`;
                            text_div_paxs+=`
                                <select class="form-control js-example-basic-single" name="adult_country_of_issued`+parseInt(counter_passenger+1)+`_id" style="width:100%;" id="adult_country_of_issued`+parseInt(counter_passenger+1)+`_id" placeholder="Country Of Issued" onchange="auto_complete('adult_country_of_issued`+parseInt(counter_passenger+1)+`');">
                                    <option value="">Select Country Of Issued</option>`;
                                    for(i in countries){
                                       if(countries[i].code == 'ID')
                                            text_div_paxs+=`<option value="`+countries[i].code+`" selected>`+countries[i].name+`</option>`;
                                       else
                                            text_div_paxs+=`<option value="`+countries[i].code+`">`+countries[i].name+`</option>`;
                                    }
                                text_div_paxs+=`</select>
                                <button type="button" class="primary-delete-date" onclick="delete_country_of_issued('adult', `+parseInt(counter_passenger+1)+`)"><i class="fa fa-trash-alt" style="color:#E92B2B;font-size:20px;"></i></button>
                                <input type="hidden" name="adult_country_of_issued`+parseInt(counter_passenger+1)+`" id="adult_country_of_issued`+parseInt(counter_passenger+1)+`" />`;
                            text_div_paxs+=`</div>`;
                        }
                        else if(template == 5){
                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                            text_div_paxs+=`
                                <div class="form-select">
                                    <select class="form-control js-example-basic-single" name="adult_country_of_issued`+parseInt(counter_passenger+1)+`_id" style="width:100%;" id="adult_country_of_issued`+parseInt(counter_passenger+1)+`_id" placeholder="Country Of Issued" onchange="auto_complete('adult_country_of_issued`+parseInt(counter_passenger+1)+`');">
                                        <option value="">Select Country Of Issued</option>`;
                                        for(i in countries){
                                           if(countries[i].code == 'ID')
                                                text_div_paxs+=`<option value="`+countries[i].code+`" selected>`+countries[i].name+`</option>`;
                                           else
                                                text_div_paxs+=`<option value="`+countries[i].code+`">`+countries[i].name+`</option>`;
                                        }
                                    text_div_paxs+=`</select>
                                </div>
                                <button type="button" class="primary-delete-date" onclick="delete_country_of_issued('adult', `+parseInt(counter_passenger+1)+`)"><i class="fa fa-trash-alt" style="color:#E92B2B;font-size:20px;"></i></button>
                                <input type="hidden" name="adult_country_of_issued`+parseInt(counter_passenger+1)+`" id="adult_country_of_issued`+parseInt(counter_passenger+1)+`" />`;
                            text_div_paxs+=`</div>`;
                        }
                        else if(template == 6){
                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                            text_div_paxs+=`
                                <div class="form-select">
                                    <select class="form-control js-example-basic-single" name="adult_country_of_issued`+parseInt(counter_passenger+1)+`_id" style="width:100%;" id="adult_country_of_issued`+parseInt(counter_passenger+1)+`_id" placeholder="Country Of Issued" onchange="auto_complete('adult_country_of_issued`+parseInt(counter_passenger+1)+`');">
                                        <option value="">Select Country Of Issued</option>`;
                                        for(i in countries){
                                            if(countries[i].code == 'ID')
                                                text_div_paxs+=`<option value="`+countries[i].code+`" selected>`+countries[i].name+`</option>`;
                                            else
                                                text_div_paxs+=`<option value="`+countries[i].code+`">`+countries[i].name+`</option>`;
                                        }
                                    text_div_paxs+=`</select>
                                </div>
                                <button type="button" class="primary-delete-date" onclick="delete_country_of_issued('adult', `+parseInt(counter_passenger+1)+`)"><i class="fa fa-trash-alt" style="color:#E92B2B;font-size:20px;"></i></button>
                                <input type="hidden" name="adult_country_of_issued`+parseInt(counter_passenger+1)+`" id="adult_country_of_issued`+parseInt(counter_passenger+1)+`" />`;
                            text_div_paxs+=`</div>`;
                        }
                    text_div_paxs+=`</div>`;


                    text_div_paxs+=`
                    <div class="col-lg-6 col-md-6 col-sm-6" id="adult_cp_hidden1_`+parseInt(counter_passenger+1)+`">
                        <label style="color:red !important">*</label>
                        <label>Contact Email Address</label>
                        <div class="input-container-search-ticket">
                            <input type="text" class="form-control" name="adult_email`+parseInt(counter_passenger+1)+`" id="adult_email`+parseInt(counter_passenger+1)+`" placeholder="Email Address " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Email Address '">
                        </div>
                        <label style="font-size:12px; padding:0;">Example: email@example.com</label>
                    </div>
                    <div class="col-lg-6" id="adult_cp_hidden2_`+parseInt(counter_passenger+1)+`">
                        <label style="color:red !important">*</label>
                        <label>Whatsapp Number</label>
                        <div class="row">
                            <div class="col-lg-3">
                                <div class="form-select">
                                    <select id="adult_phone_code`+parseInt(counter_passenger+1)+`_id" name="adult_phone_code`+parseInt(counter_passenger+1)+`_id" class="form-control js-example-basic-single">`;
                                        for(i in countries){
                                            if(countries[i].phone_code == 62)
                                               text_div_paxs+=`<option value="`+countries[i].phone_code+`" selected>`+countries[i].phone_code+`</option>`;
                                            else
                                               text_div_paxs+=`<option value="`+countries[i].phone_code+`">`+countries[i].phone_code+`</option>`;
                                        }

                            text_div_paxs+=` </select>
                                    <input type="hidden" name="adult_phone_code`+parseInt(counter_passenger+1)+`" id="adult_phone_code`+parseInt(counter_passenger+1)+`" />
                                </div>
                            </div>
                            <div class="col-lg-9">
                                <input type="text" class="form-control" name="adult_phone`+parseInt(counter_passenger+1)+`" id="adult_phone`+parseInt(counter_passenger+1)+`" placeholder="Phone Number " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Phone Number '" onkeyup="onchange_number_no_zero(`+parseInt(counter_passenger+1)+`)">
                            </div>
                        </div>
                        <label style="font-size:12px; padding:0;">Example: 0 812345678</label>
                        <label style="color:`+color+` !important;">Please make sure to register with whatsapp number for the result test</label>
                    </div>`;

                    if(vendor == 'phc'){
                        text_div_paxs+=`
                        <div class="col-lg-12" style="margin-top:15px;">
                            <hr/>
                            <h4>Profession</h4>
                        </div>
                        <div class="col-lg-6 col-md-6 col-sm-6" style="margin-top:15px;">
                            <label style="color:red !important">*</label>
                            <label>Profession</label>`;
                            if(template == 1){
                                text_div_paxs+=`<div class="input-container-search-ticket">`;
                            }else if(template == 2){
                                text_div_paxs+=`<div>`;
                            }else if(template == 3){
                                text_div_paxs+=`<div class="default-select">`;
                            }else if(template == 4){
                                text_div_paxs+=`<div class="input-container-search-ticket">`;
                            }else if(template == 5){
                                text_div_paxs+=`<div class="input-container-search-ticket">`;
                            }

                            if(template == 5){
                                text_div_paxs+=`<div class="form-select">`;
                            }else{
                                text_div_paxs+=`<div class="form-select-2">`;
                            }

                            if(template == 4){
                                text_div_paxs+=`<select class="nice-select-default rounded" id="adult_profession`+parseInt(counter_passenger+1)+`" name="adult_profession`+parseInt(counter_passenger+1)+`" onchange="hidden_readonly_medical('`+parseInt(counter_passenger+1)+`', 'profession', 'hidden');">`;
                            }else{
                                text_div_paxs+=`<select id="adult_profession`+parseInt(counter_passenger+1)+`" name="adult_profession`+parseInt(counter_passenger+1)+`" onchange="hidden_readonly_medical('`+parseInt(counter_passenger+1)+`', 'profession', 'hidden');">`;
                            }
                            text_div_paxs += '<option value="">Choose</option>';
                                for(i in medical_config.result.response.profession)
                                    text_div_paxs+=`<option value="`+medical_config.result.response.profession[i]+`">`+medical_config.result.response.profession[i]+`</option>`;
                                    text_div_paxs+=`</select>
                                </div>
                            </div>
                        </div>`;

                        text_div_paxs+=`
                        <div class="col-lg-6 col-md-6 col-sm-6" style="margin-top:15px;">
                            <div id="adult_work_place_div`+parseInt(counter_passenger+1)+`" style="display:none;">
                                <label id="adult_work_place_label`+parseInt(counter_passenger+1)+`" style="color:white !important">*</label>
                                <label>Work Place</label>
                                <div class="input-container-search-ticket" style="margin-bottom:5px;">
                                    <input type="text" class="form-control" name="adult_work_place`+parseInt(counter_passenger+1)+`" id="adult_work_place`+parseInt(counter_passenger+1)+`" placeholder="Work Place " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Work Place '">
                                </div>
                            </div>
                        </div>`;

                        if(test_type == 'PHCHCKPCR' || test_type == 'PHCDTKPCR'){
                            text_div_paxs+=`
                            <div class="col-lg-6 col-md-6 col-sm-6" style="margin-top:15px;">
                                <label style="color:red !important">*</label>
                                <label>Asal Perusahaan/Rumah Sakit/Pribadi</label>`;
                                if(template == 1){
                                    text_div_paxs+=`<div class="input-container-search-ticket">`;
                                }else if(template == 2){
                                    text_div_paxs+=`<div>`;
                                }else if(template == 3){
                                    text_div_paxs+=`<div class="default-select">`;
                                }else if(template == 4){
                                    text_div_paxs+=`<div class="input-container-search-ticket">`;
                                }else if(template == 5){
                                    text_div_paxs+=`<div class="input-container-search-ticket">`;
                                }

                                if(template == 5){
                                    text_div_paxs+=`<div class="form-select">`;
                                }else{
                                    text_div_paxs+=`<div class="form-select-2">`;
                                }

                                if(template == 4){
                                    text_div_paxs+=`<select class="nice-select-default rounded" id="adult_perusahaan`+parseInt(counter_passenger+1)+`" name="adult_perusahaan`+parseInt(counter_passenger+1)+`">`;
                                }else{
                                    text_div_paxs+=`<select id="adult_perusahaan`+parseInt(counter_passenger+1)+`" name="adult_perusahaan`+parseInt(counter_passenger+1)+`">`;
                                }
                                text_div_paxs += '<option value="">Choose</option>';
                                    for(i in medical_config.result.response.perusahaan)
                                        text_div_paxs+=`<option value="`+medical_config.result.response.perusahaan[i]+`">`+medical_config.result.response.perusahaan[i]+`</option>`;
                                        text_div_paxs+=`</select>
                                    </div>
                                </div>
                            </div>`;

                            text_div_paxs+=`
                            <div class="col-lg-6 col-md-6 col-sm-6" style="margin-top:15px;">
                                <label style="color:red !important">*</label>
                                <label>Nama Perusahaan/Rumah Sakit/Pribadi</label>
                                <div class="input-container-search-ticket" style="margin-bottom:5px;">
                                    <input type="text" class="form-control" name="adult_nama_perusahaan`+parseInt(counter_passenger+1)+`" id="adult_nama_perusahaan`+parseInt(counter_passenger+1)+`" placeholder="Nama Perusahaan/Rumah Sakit/Pribadi " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Nama Perusahaan/Rumah Sakit/Pribadi '">
                                </div>
                            </div>`;

                        }
                    }

                    //ini phc
                    if(vendor == 'phc'){

                        text_div_paxs += `
                        <div class="col-lg-12 col-md-12 col-sm-12 mt-2">
                            <hr/>
                            <h4>KTP</h4>
                        </div>`;

                        if(test_type == 'PHCHCKPCR' || test_type == 'PHCDTKPCR'){
                            text_div_paxs+=`

                            <div class="col-lg-6 col-md-6 col-sm-6">
                                <label style="color:red !important">*</label>
                                <label>Golongan Darah</label>`;
                                if(template == 1){
                                    text_div_paxs+=`<div class="input-container-search-ticket">`;
                                }else if(template == 2){
                                    text_div_paxs+=`<div>`;
                                }else if(template == 3){
                                    text_div_paxs+=`<div class="default-select">`;
                                }else if(template == 4){
                                    text_div_paxs+=`<div class="input-container-search-ticket">`;
                                }else if(template == 5){
                                    text_div_paxs+=`<div class="input-container-search-ticket">`;
                                }
                                text_div_paxs+=`<div class="form-select-2">`;
                                if(template == 4){
                                    text_div_paxs+=`<select class="nice-select-default rounded" id="adult_klinis_golongan_darah`+parseInt(counter_passenger+1)+`" name="adult_klinis_golongan_darah`+parseInt(counter_passenger+1)+`">`;
                                }else{
                                    text_div_paxs+=`<select id="adult_klinis_golongan_darah`+parseInt(counter_passenger+1)+`" name="adult_klinis_golongan_darah`+parseInt(counter_passenger+1)+`">`;
                                }
                                text_div_paxs += '<option value="">Choose</option>';
                                    for(i in medical_config.result.response.golongan_darah)
                                        text_div_paxs+=`<option value="`+medical_config.result.response.golongan_darah[i]+`">`+medical_config.result.response.golongan_darah[i]+`</option>`;
                                        text_div_paxs+=`</select>
                                    </div>
                                </div>
                            </div>`;
                        }

                        text_div_paxs+=`
                        <div class="col-lg-6 col-md-6 col-sm-6">
                            <label style="color:red !important">*</label>
                            <label>Address KTP</label>
                            <div class="input-container-search-ticket" style="margin-bottom:5px;">
                                <input type="text" class="form-control" name="adult_address_ktp`+parseInt(counter_passenger+1)+`" id="adult_address_ktp`+parseInt(counter_passenger+1)+`" placeholder="Address KTP " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Address KTP '" onchange="auto_change_copy_to_ktp(`+parseInt(counter_passenger+1)+`);">
                            </div>
                        </div>
                        <div class="col-lg-6 col-md-6 col-sm-6">
                            <label style="color:red !important">*</label>
                            <label>RT KTP</label>
                            <div class="input-container-search-ticket" style="margin-bottom:5px;">
                                <input type="text" maxlength="3" class="form-control" name="adult_rt_ktp`+parseInt(counter_passenger+1)+`" id="adult_rt_ktp`+parseInt(counter_passenger+1)+`" placeholder="RT KTP " onfocus="this.placeholder = ''" onblur="this.placeholder = 'RT KTP '" onchange="auto_change_copy_to_ktp(`+parseInt(counter_passenger+1)+`);">
                            </div>
                            <label style="font-size:12px; padding:0;">Maximum 3 Digit</label>
                        </div>
                        <div class="col-lg-6 col-md-6 col-sm-6">
                            <label style="color:red !important">*</label>
                            <label>RW KTP</label>
                            <div class="input-container-search-ticket" style="margin-bottom:5px;">
                                <input type="text" maxlength="3" class="form-control" name="adult_rw_ktp`+parseInt(counter_passenger+1)+`" id="adult_rw_ktp`+parseInt(counter_passenger+1)+`" placeholder="RW KTP " onfocus="this.placeholder = ''" onblur="this.placeholder = 'RW KTP '" onchange="auto_change_copy_to_ktp(`+parseInt(counter_passenger+1)+`);">
                            </div>
                            <label style="font-size:12px; padding:0;">Maximum 3 Digit</label>
                        </div>`;

                        text_div_paxs+=`

                        <div class="col-lg-6 col-md-6 col-sm-6">
                            <label style="color:red !important">*</label>
                            <label>Kabupaten/Kota KTP</label>`;
                            if(template == 1){
                                text_div_paxs+=`<div class="input-container-search-ticket">`;
                            }else if(template == 2){
                                text_div_paxs+=`<div>`;
                            }else if(template == 3){
                                text_div_paxs+=`<div class="default-select">`;
                            }else if(template == 4){
                                text_div_paxs+=`<div class="input-container-search-ticket">`;
                            }else if(template == 5){
                                text_div_paxs+=`<div class="input-container-search-ticket">`;
                            }
                            text_div_paxs+=` <div class="form-select">
                                        <select class="form-control js-example-basic-single" name="adult_kabupaten_ktp`+parseInt(counter_passenger+1)+`_id" style="width:100%;" id="adult_kabupaten_ktp`+parseInt(counter_passenger+1)+`_id" placeholder="Kabupaten" onchange="auto_complete('adult_kabupaten_ktp`+parseInt(counter_passenger+1)+`');get_kecamatan('adult_kabupaten_ktp`+parseInt(counter_passenger+1)+`','adult_kecamatan_ktp`+parseInt(counter_passenger+1)+`_id');auto_change_copy_to_ktp(`+parseInt(counter_passenger+1)+`);" >
                                            <option value="">Select Kabupaten KTP</option>`;
                                        for(i in data_kota)
                                        text_div_paxs+=`<option value="`+i+`">`+i+`</option>`;
                                    text_div_paxs+=`</select>
                                    </div>
                                    <input type="hidden" name="adult_kabupaten_ktp`+parseInt(counter_passenger+1)+`" id="adult_kabupaten_ktp`+parseInt(counter_passenger+1)+`" />
                                    <button type="button" class="primary-delete-date" onclick="delete_type('adult_kabupaten_ktp`+parseInt(counter_passenger+1)+`_id', `+parseInt(counter_passenger+1)+`)"><i class="fa fa-trash-alt" style="color:#E92B2B;font-size:20px;"></i></button>
                                </div>
                            </div>`;

                        text_div_paxs+=`

                        <div class="col-lg-6 col-md-6 col-sm-6">
                            <label style="color:red !important">*</label>
                            <label>Kecamatan KTP</label>`;
                            if(template == 1){
                                text_div_paxs+=`<div class="input-container-search-ticket">`;
                            }else if(template == 2){
                                text_div_paxs+=`<div>`;
                            }else if(template == 3){
                                text_div_paxs+=`<div class="default-select">`;
                            }else if(template == 4){
                                text_div_paxs+=`<div class="input-container-search-ticket">`;
                            }else if(template == 5){
                                text_div_paxs+=`<div class="input-container-search-ticket">`;
                            }
                            text_div_paxs+=` <div class="form-select">
                                        <select class="form-control js-example-basic-single" name="adult_kecamatan_ktp`+parseInt(counter_passenger+1)+`_id" style="width:100%;" id="adult_kecamatan_ktp`+parseInt(counter_passenger+1)+`_id" placeholder="Kecamatan" onchange="auto_complete('adult_kecamatan_ktp`+parseInt(counter_passenger+1)+`');get_kelurahan('adult_kecamatan_ktp`+parseInt(counter_passenger+1)+`','adult_kelurahan_ktp`+parseInt(counter_passenger+1)+`_id');auto_change_copy_to_ktp(`+parseInt(counter_passenger+1)+`);">
                                            <option value="">Select Kecamatan KTP</option>`;
                                    text_div_paxs+=`</select>
                                    </div>
                                    <input type="hidden" name="adult_kecamatan_ktp`+parseInt(counter_passenger+1)+`" id="adult_kecamatan_ktp`+parseInt(counter_passenger+1)+`" />
                                    <button type="button" class="primary-delete-date" onclick="delete_type('adult_kecamatan_ktp`+parseInt(counter_passenger+1)+`_id', `+parseInt(counter_passenger+1)+`)"><i class="fa fa-trash-alt" style="color:#E92B2B;font-size:20px;"></i></button>
                                </div>
                            </div>`;

                        text_div_paxs+=`

                        <div class="col-lg-6 col-md-6 col-sm-6">
                            <label style="color:red !important">*</label>
                            <label>Kelurahan KTP</label>`;
                            if(template == 1){
                                text_div_paxs+=`<div class="input-container-search-ticket">`;
                            }else if(template == 2){
                                text_div_paxs+=`<div>`;
                            }else if(template == 3){
                                text_div_paxs+=`<div class="default-select">`;
                            }else if(template == 4){
                                text_div_paxs+=`<div class="input-container-search-ticket">`;
                            }else if(template == 5){
                                text_div_paxs+=`<div class="input-container-search-ticket">`;
                            }
                            text_div_paxs+=` <div class="form-select">
                                        <select class="form-control js-example-basic-single" name="adult_kelurahan_ktp`+parseInt(counter_passenger+1)+`_id" style="width:100%;" id="adult_kelurahan_ktp`+parseInt(counter_passenger+1)+`_id" placeholder="Kelurahan" onchange="auto_complete('adult_kelurahan_ktp`+parseInt(counter_passenger+1)+`');auto_change_copy_to_ktp(`+parseInt(counter_passenger+1)+`);">
                                            <option value="">Select Kelurahan KTP</option>`;
                                    text_div_paxs+=`</select>
                                    </div>
                                    <input type="hidden" name="adult_kelurahan_ktp`+parseInt(counter_passenger+1)+`" id="adult_kelurahan_ktp`+parseInt(counter_passenger+1)+`" />
                                    <button type="button" class="primary-delete-date" onclick="delete_type('adult_kelurahan_ktp`+parseInt(counter_passenger+1)+`_id', `+parseInt(counter_passenger+1)+`)"><i class="fa fa-trash-alt" style="color:#E92B2B;font-size:20px;"></i></button>
                                </div>
                            </div>`;

                        //copy to ktp
                        text_div_paxs+= `
                        <div class="col-lg-12 col-md-12 col-sm-12 mt-2">
                            <hr/>
                            <label>Copy KTP to Domisili?</label>
                            <label class="radio-button-custom">
                                Yes
                                <input type="radio" name="adult_copy`+parseInt(counter_passenger+1)+`" onchange="copy_ktp(`+parseInt(counter_passenger+1)+`);" value="true"/>
                                <span class="checkmark-radio"></span>
                            </label>

                            <label class="radio-button-custom">
                                No
                                <input type="radio" name="adult_copy`+parseInt(counter_passenger+1)+`" onchange="copy_ktp(`+parseInt(counter_passenger+1)+`);" value="false" checked="checked"/>
                                <span class="checkmark-radio"></span>
                            </label>
                        </div>`;

                        text_div_paxs += `
                        <div class="col-lg-12 col-md-12 col-sm-12">
                            <h4>Domisili</h4>
                        </div>`
                        text_div_paxs+=`
                        <div class="col-lg-6 col-md-6 col-sm-6">
                            <label style="color:red !important">*</label>
                            <label>Address</label>
                            <div class="input-container-search-ticket" style="margin-bottom:5px;">
                                <input type="text" class="form-control" name="adult_address`+parseInt(counter_passenger+1)+`" id="adult_address`+parseInt(counter_passenger+1)+`" placeholder="Address " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Address '" >
                            </div>
                        </div>
                        <div class="col-lg-6 col-md-6 col-sm-6">
                            <label style="color:red !important">*</label>
                            <label>RT</label>
                            <div class="input-container-search-ticket" style="margin-bottom:5px;">
                                <input type="text" maxlength="3" class="form-control" name="adult_rt`+parseInt(counter_passenger+1)+`" id="adult_rt`+parseInt(counter_passenger+1)+`" placeholder="RT " onfocus="this.placeholder = ''" onblur="this.placeholder = 'RT '" >
                            </div>
                            <label style="font-size:12px; padding:0;">Maximum 3 Digit</label>
                        </div>
                        <div class="col-lg-6 col-md-6 col-sm-6">
                            <label style="color:red !important">*</label>
                            <label>RW</label>
                            <div class="input-container-search-ticket" style="margin-bottom:5px;">
                                <input type="text" maxlength="3" class="form-control" name="adult_rw`+parseInt(counter_passenger+1)+`" id="adult_rw`+parseInt(counter_passenger+1)+`" placeholder="RW " onfocus="this.placeholder = ''" onblur="this.placeholder = 'RW '" >
                            </div>
                            <label style="font-size:12px; padding:0;">Maximum 3 Digit</label>
                        </div>`;

                        text_div_paxs+=`

                        <div class="col-lg-6 col-md-6 col-sm-6">
                            <label style="color:red !important">*</label>
                            <label>Kabupaten</label>`;
                            if(template == 1){
                                text_div_paxs+=`<div class="input-container-search-ticket">`;
                            }else if(template == 2){
                                text_div_paxs+=`<div>`;
                            }else if(template == 3){
                                text_div_paxs+=`<div class="default-select">`;
                            }else if(template == 4){
                                text_div_paxs+=`<div class="input-container-search-ticket">`;
                            }else if(template == 5){
                                text_div_paxs+=`<div class="input-container-search-ticket">`;
                            }
                            text_div_paxs+=` <div class="form-select">
                                        <select class="form-control js-example-basic-single" name="adult_kabupaten`+parseInt(counter_passenger+1)+`_id" style="width:100%;" id="adult_kabupaten`+parseInt(counter_passenger+1)+`_id" placeholder="Kabupaten" onchange="auto_complete('adult_kabupaten`+parseInt(counter_passenger+1)+`');get_kecamatan('adult_kabupaten`+parseInt(counter_passenger+1)+`','adult_kecamatan`+parseInt(counter_passenger+1)+`_id');" >
                                            <option value="">Select Kabupaten</option>`;
                                        for(i in data_kota)
                                        text_div_paxs+=`<option value="`+i+`">`+i+`</option>`;
                                    text_div_paxs+=`</select>
                                    </div>
                                    <input type="hidden" name="adult_kabupaten`+parseInt(counter_passenger+1)+`" id="adult_kabupaten`+parseInt(counter_passenger+1)+`" />
                                    <button type="button" class="primary-delete-date" onclick="delete_type('adult_kabupaten`+parseInt(counter_passenger+1)+`_id', `+parseInt(counter_passenger+1)+`)"><i class="fa fa-trash-alt" style="color:#E92B2B;font-size:20px;"></i></button>
                                </div>
                            </div>`;

                        text_div_paxs+=`

                        <div class="col-lg-6 col-md-6 col-sm-6">
                            <label style="color:red !important">*</label>
                            <label>Kecamatan</label>`;
                            if(template == 1){
                                text_div_paxs+=`<div class="input-container-search-ticket">`;
                            }else if(template == 2){
                                text_div_paxs+=`<div>`;
                            }else if(template == 3){
                                text_div_paxs+=`<div class="default-select">`;
                            }else if(template == 4){
                                text_div_paxs+=`<div class="input-container-search-ticket">`;
                            }else if(template == 5){
                                text_div_paxs+=`<div class="input-container-search-ticket">`;
                            }
                            text_div_paxs+=` <div class="form-select">
                                        <select class="form-control js-example-basic-single" name="adult_kecamatan`+parseInt(counter_passenger+1)+`_id" style="width:100%;" id="adult_kecamatan`+parseInt(counter_passenger+1)+`_id" placeholder="Kecamatan" onchange="auto_complete('adult_kecamatan`+parseInt(counter_passenger+1)+`');get_kelurahan('adult_kecamatan`+parseInt(counter_passenger+1)+`','adult_kelurahan`+parseInt(counter_passenger+1)+`_id');">
                                            <option value="">Select Kecamatan</option>`;
                                    text_div_paxs+=`</select>
                                    </div>
                                    <input type="hidden" name="adult_kecamatan`+parseInt(counter_passenger+1)+`" id="adult_kecamatan`+parseInt(counter_passenger+1)+`" />
                                    <button type="button" class="primary-delete-date" onclick="delete_type('adult_kecamatan`+parseInt(counter_passenger+1)+`_id', `+parseInt(counter_passenger+1)+`)"><i class="fa fa-trash-alt" style="color:#E92B2B;font-size:20px;"></i></button>
                                </div>
                            </div>`;

                        text_div_paxs+=`

                        <div class="col-lg-6 col-md-6 col-sm-6">
                            <label style="color:red !important">*</label>
                            <label>Kelurahan</label>`;
                            if(template == 1){
                                text_div_paxs+=`<div class="input-container-search-ticket">`;
                            }else if(template == 2){
                                text_div_paxs+=`<div>`;
                            }else if(template == 3){
                                text_div_paxs+=`<div class="default-select">`;
                            }else if(template == 4){
                                text_div_paxs+=`<div class="input-container-search-ticket">`;
                            }else if(template == 5){
                                text_div_paxs+=`<div class="input-container-search-ticket">`;
                            }
                            text_div_paxs+=` <div class="form-select">
                                        <select class="form-control js-example-basic-single" name="adult_kelurahan`+parseInt(counter_passenger+1)+`_id" style="width:100%;" id="adult_kelurahan`+parseInt(counter_passenger+1)+`_id" placeholder="Kelurahan" onchange="auto_complete('adult_kelurahan`+parseInt(counter_passenger+1)+`');">
                                            <option value="">Select Kelurahan</option>`;
                                    text_div_paxs+=`</select>
                                        </div>
                                        <input type="hidden" name="adult_kelurahan`+parseInt(counter_passenger+1)+`" id="adult_kelurahan`+parseInt(counter_passenger+1)+`" />
                                        <button type="button" class="primary-delete-date" onclick="delete_type('adult_kelurahan`+parseInt(counter_passenger+1)+`_id', `+parseInt(counter_passenger+1)+`)"><i class="fa fa-trash-alt" style="color:#E92B2B;font-size:20px;"></i></button>
                                    </div>
                                </div>

                                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 mt-2" style="text-align:left;"></div>`;
                                if(test_type == 'PHCHCKPCR' || test_type == 'PHCDTKPCR'){
                                    text_div_paxs+=`
                                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 mt-2" style="text-align:center;"></div>
                                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 mt-2" style="text-align:right;">
                                        <button type="button" class="primary-btn prev-next-form" style="margin-bottom:5px; font-size:12px; font-weight:700;" onclick="next_prev_form_medical('next', 2, `+counter_passenger+`);">
                                            Next <i class="fas fa-arrow-right"></i>
                                        </button>
                                    </div>`;
                                }else{
                                    text_div_paxs+=`
                                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 mt-3" style="text-align:center;">
                                        <button type="button" class="primary-btn prev-next-form" style="margin-bottom:5px; font-size:12px; font-weight:700;" onclick="update_customer_fill('save',`+counter_passenger+`)">
                                            Save <i class="fas fa-save"></i>
                                        </button>
                                    </div>
                                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4" style="text-align:right;"></div>`;
                                }
                                text_div_paxs+=`
                            </div>
                        </div>`;

                            //ini pcr
                        if(test_type == 'PHCHCKPCR' || test_type == 'PHCDTKPCR'){
                            //ini tab gejala
                            text_div_paxs+=`
                                <div id="progress_div2`+counter_passenger+`" style="background:#fcfcfc; border-top:1px solid #cdcdcd; display:none; padding:15px;">
                                    <div class="row">
                                        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4" style="text-align:left;">
                                            <button type="button" class="primary-btn prev-next-form" style="margin-bottom:5px; font-size:12px; font-weight:700;" onclick="next_prev_form_medical('prev', 1, `+counter_passenger+`);">
                                                <i class="fas fa-arrow-left"></i> Prev
                                            </button>
                                        </div>
                                        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4" style="text-align:center;"></div>
                                        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4" style="text-align:right;">
                                            <button type="button" class="primary-btn prev-next-form" style="margin-bottom:5px; font-size:12px; font-weight:700;" onclick="next_prev_form_medical('next', 3, `+counter_passenger+`);">
                                                Next <i class="fas fa-arrow-right"></i>
                                            </button>
                                        </div>`;

                                text_div_paxs+=`
                                <div class="col-lg-6 col-md-6 col-sm-6 mt-2">
                                    <label style="color:red !important">*</label>
                                    <label>Kriteria Covid</label>`;
                                    if(template == 1){
                                        text_div_paxs+=`<div class="input-container-search-ticket">`;
                                    }else if(template == 2){
                                        text_div_paxs+=`<div>`;
                                    }else if(template == 3){
                                        text_div_paxs+=`<div class="default-select">`;
                                    }else if(template == 4){
                                        text_div_paxs+=`<div class="input-container-search-ticket">`;
                                    }else if(template == 5){
                                        text_div_paxs+=`<div class="input-container-search-ticket">`;
                                    }

                                    if(template == 5){
                                        text_div_paxs+=`<div class="form-select">`;
                                    }else{
                                        text_div_paxs+=`<div class="form-select-2">`;
                                    }

                                    if(template == 4){
                                        text_div_paxs+=`<select class="nice-select-default rounded" id="adult_kriteria_pasien`+parseInt(counter_passenger+1)+`" name="adult_kriteria_pasien`+parseInt(counter_passenger+1)+`" onchange="change_kriteria(`+parseInt(counter_passenger+1)+`)">`;
                                    }else{
                                        text_div_paxs+=`<select id="adult_kriteria_pasien`+parseInt(counter_passenger+1)+`" name="adult_kriteria_pasien`+parseInt(counter_passenger+1)+`" onchange="change_kriteria(`+parseInt(counter_passenger+1)+`)">`;
                                    }
                                    text_div_paxs += '<option value="">Choose</option>';
                                        for(i in medical_config.result.response.kriteria_pasien){
                                            if(medical_config.result.response.kriteria_pasien[i].name == 'LAIN-LAIN')
                                                text_div_paxs+=`<option value="`+medical_config.result.response.kriteria_pasien[i].name+`" selected>`+medical_config.result.response.kriteria_pasien[i].name+`</option>`;
                                            else
                                                text_div_paxs+=`<option value="`+medical_config.result.response.kriteria_pasien[i].name+`">`+medical_config.result.response.kriteria_pasien[i].name+`</option>`;
                                        }
                                            text_div_paxs+=`</select>
                                        </div>
                                    </div>
                                </div>`;

                                text_div_paxs+=`
                                <div class="col-lg-6 col-md-6 col-sm-6" style="margin-top:15px;">
                                    <label style="color:red !important">*</label>
                                    <label>Pemeriksaan Swab Ke</label>
                                    <div class="input-container-search-ticket" style="margin-bottom:5px;">
                                        <input type="number" class="form-control" name="adult_pemeriksaan_swab_ke`+parseInt(counter_passenger+1)+`" id="adult_pemeriksaan_swab_ke`+parseInt(counter_passenger+1)+`" placeholder="Number " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Number '">
                                    </div>
                                </div>
                                <div class="col-lg-12 col-md-12 col-sm-12" id="detail_kriteria`+parseInt(counter_passenger+1)+`" hidden>
                                </div>`;

                                text_div_paxs+=`
                                <div class="col-lg-6 col-md-6 col-sm-6" style="margin-top:15px;">
                                    <label style="color:red !important">*</label>
                                    <label>Pernah di rawat di RS sebelumnya?</label>`;
                                    if(template == 1){
                                        text_div_paxs+=`<div class="input-container-search-ticket">`;
                                    }else if(template == 2){
                                        text_div_paxs+=`<div>`;
                                    }else if(template == 3){
                                        text_div_paxs+=`<div class="default-select">`;
                                    }else if(template == 4){
                                        text_div_paxs+=`<div class="input-container-search-ticket">`;
                                    }else if(template == 5){
                                        text_div_paxs+=`<div class="input-container-search-ticket">`;
                                    }

                                    if(template == 5){
                                        text_div_paxs+=`<div class="form-select">`;
                                    }else{
                                        text_div_paxs+=`<div class="form-select-2">`;
                                    }

                                    if(template == 4){
                                        text_div_paxs+=`<select class="nice-select-default rounded" id="adult_sedang_dirawat_di_rs`+parseInt(counter_passenger+1)+`" name="adult_sedang_dirawat_di_rs`+parseInt(counter_passenger+1)+`" onchange="onchange_rawat_rs(`+parseInt(counter_passenger+1)+`);">`;
                                    }else{
                                        text_div_paxs+=`<select id="adult_sedang_dirawat_di_rs`+parseInt(counter_passenger+1)+`" name="adult_sedang_dirawat_di_rs`+parseInt(counter_passenger+1)+`" onchange="onchange_rawat_rs(`+parseInt(counter_passenger+1)+`);">`;
                                    }
                                    text_div_paxs += '<option value="">Choose</option>';
                                        for(i in medical_config.result.response.pilihan_jawaban){
                                            if(medical_config.result.response.pilihan_jawaban[i] == 'TIDAK TAHU'){
                                                text_div_paxs+=`<option value="`+medical_config.result.response.pilihan_jawaban[i]+`" selected>`+medical_config.result.response.pilihan_jawaban[i]+`</option>`;
                                            }else{
                                                text_div_paxs+=`<option value="`+medical_config.result.response.pilihan_jawaban[i]+`">`+medical_config.result.response.pilihan_jawaban[i]+`</option>`;
                                            }
                                        }
                                        text_div_paxs+=`</select>
                                        </div>
                                    </div>
                                </div>`;

                                text_div_paxs+=`
                                <div class="col-lg-6 col-md-6 col-sm-6" style="margin-top:15px;" id="nama_rs_div`+parseInt(counter_passenger+1)+`" hidden>
                                    <label style="color:red !important">*</label>
                                    <label>Nama RS</label>
                                    <input type="text" class="form-control date-picker-birth" name="adult_nama_rs`+parseInt(counter_passenger+1)+`" id="adult_nama_rs`+parseInt(counter_passenger+1)+`" placeholder="Nama RS " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Nama RS '" autocomplete="off">
                                </div>`;

                                text_div_paxs+=`
                                <div class="col-lg-6 col-md-6 col-sm-6" id="tanggal_masuk_rs`+parseInt(counter_passenger+1)+`" hidden>
                                    <label style="color:red !important">*</label>
                                    <label>Tanggal Masuk RS</label>
                                    <div class="input-container-search-ticket">
                                        <input type="text" class="form-control date-picker-birth" name="adult_tanggal_masuk_rs`+parseInt(counter_passenger+1)+`" id="adult_tanggal_masuk_rs`+parseInt(counter_passenger+1)+`" placeholder="Tanggal Masuk RS " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Tanggal Masuk RS '" autocomplete="off">
                                        <button type="button" class="primary-delete-date" onclick="clear_date('adult_tanggal_masuk_rs`+parseInt(counter_passenger+1)+`')"><i class="fa fa-trash-alt" style="color:#E92B2B;font-size:20px;"></i></button>
                                    </div>
                                </div>`;

                                text_div_paxs+=`
                                <div class="col-lg-6 col-md-6 col-sm-6" id="nama_ruang_perawatan`+parseInt(counter_passenger+1)+`" hidden>
                                    <label style="color:white !important">*</label>
                                    <label>Nama Ruang Perawatan</label>
                                    <div class="input-container-search-ticket" style="margin-bottom:0px;">
                                        <input type="text" class="form-control date-picker-birth" name="adult_nama_ruang_perawatan`+parseInt(counter_passenger+1)+`" id="adult_nama_ruang_perawatan`+parseInt(counter_passenger+1)+`" placeholder="Nama Ruang Perawatan " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Nama Ruang Perawatan '" autocomplete="off">
                                    </div>
                                </div>`;

                                text_div_paxs+=`
                                <div class="col-lg-6 col-md-6 col-sm-6" style="margin-top:15px;" id="adult_sedang_dirawat_di_icu_div`+parseInt(counter_passenger+1)+`" hidden>
                                    <label style="color:red !important">*</label>
                                    <label>Sedang Dirawat ICU</label>`;
                                    if(template == 1){
                                        text_div_paxs+=`<div class="input-container-search-ticket">`;
                                    }else if(template == 2){
                                        text_div_paxs+=`<div>`;
                                    }else if(template == 3){
                                        text_div_paxs+=`<div class="default-select">`;
                                    }else if(template == 4){
                                        text_div_paxs+=`<div class="input-container-search-ticket">`;
                                    }else if(template == 5){
                                        text_div_paxs+=`<div class="input-container-search-ticket">`;
                                    }

                                    if(template == 5){
                                        text_div_paxs+=`<div class="form-select">`;
                                    }else{
                                        text_div_paxs+=`<div class="form-select-2">`;
                                    }

                                    if(template == 4){
                                        text_div_paxs+=`<select class="nice-select-default rounded" id="adult_sedang_dirawat_di_icu`+parseInt(counter_passenger+1)+`" name="adult_sedang_dirawat_di_icu`+parseInt(counter_passenger+1)+`">`;
                                    }else{
                                        text_div_paxs+=`<select id="adult_sedang_dirawat_di_icu`+parseInt(counter_passenger+1)+`" name="adult_sedang_dirawat_di_icu`+parseInt(counter_passenger+1)+`">`;
                                    }
                                    text_div_paxs += '<option value="">Choose</option>';
                                        for(i in medical_config.result.response.pilihan_jawaban)
                                            text_div_paxs+=`<option value="`+medical_config.result.response.pilihan_jawaban[i]+`">`+medical_config.result.response.pilihan_jawaban[i]+`</option>`;
                                            text_div_paxs+=`</select>
                                        </div>
                                    </div>
                                </div>`;

                                text_div_paxs+=`
                                <div class="col-lg-6 col-md-6 col-sm-6" style="margin-top:15px;" id="adult_status_terakhir_div`+parseInt(counter_passenger+1)+`" hidden>
                                    <label style="color:white !important">*</label>
                                    <label>Status Terakhir</label>`;
                                    if(template == 1){
                                        text_div_paxs+=`<div class="input-container-search-ticket">`;
                                    }else if(template == 2){
                                        text_div_paxs+=`<div>`;
                                    }else if(template == 3){
                                        text_div_paxs+=`<div class="default-select">`;
                                    }else if(template == 4){
                                        text_div_paxs+=`<div class="input-container-search-ticket">`;
                                    }else if(template == 5){
                                        text_div_paxs+=`<div class="input-container-search-ticket">`;
                                    }

                                    if(template == 5){
                                        text_div_paxs+=`<div class="form-select">`;
                                    }else{
                                        text_div_paxs+=`<div class="form-select-2">`;
                                    }

                                    if(template == 4){
                                        text_div_paxs+=`<select class="nice-select-default rounded" id="adult_status_terakhir`+parseInt(counter_passenger+1)+`" name="adult_status_terakhir`+parseInt(counter_passenger+1)+`">`;
                                    }else{
                                        text_div_paxs+=`<select id="adult_status_terakhir`+parseInt(counter_passenger+1)+`" name="adult_status_terakhir`+parseInt(counter_passenger+1)+`">`;
                                    }
                                    text_div_paxs += '<option value="">Choose</option>';
                                        for(i in medical_config.result.response.status_pasien)
                                            text_div_paxs+=`<option value="`+medical_config.result.response.status_pasien[i]+`">`+medical_config.result.response.status_pasien[i]+`</option>`;
                                            text_div_paxs+=`</select>
                                        </div>
                                    </div>
                                </div>`;

                                text_div_paxs+=`
                                <div class="col-lg-6 col-md-6 col-sm-6" style="margin-top:15px;" id="adult_menggunakan_intubasi_div`+parseInt(counter_passenger+1)+`" hidden>
                                    <label style="color:white !important">*</label>
                                    <label>Menggunakan Intubasi</label>`;
                                    if(template == 1){
                                        text_div_paxs+=`<div class="input-container-search-ticket">`;
                                    }else if(template == 2){
                                        text_div_paxs+=`<div>`;
                                    }else if(template == 3){
                                        text_div_paxs+=`<div class="default-select">`;
                                    }else if(template == 4){
                                        text_div_paxs+=`<div class="input-container-search-ticket">`;
                                    }else if(template == 5){
                                        text_div_paxs+=`<div class="input-container-search-ticket">`;
                                    }

                                    if(template == 5){
                                        text_div_paxs+=`<div class="form-select">`;
                                    }else{
                                        text_div_paxs+=`<div class="form-select-2">`;
                                    }

                                    if(template == 4){
                                        text_div_paxs+=`<select class="nice-select-default rounded" id="adult_menggunakan_intubasi`+parseInt(counter_passenger+1)+`" name="adult_menggunakan_intubasi`+parseInt(counter_passenger+1)+`">`;
                                    }else{
                                        text_div_paxs+=`<select id="adult_menggunakan_intubasi`+parseInt(counter_passenger+1)+`" name="adult_menggunakan_intubasi`+parseInt(counter_passenger+1)+`">`;
                                    }
                                    text_div_paxs += '<option value="">Choose</option>';
                                        for(i in medical_config.result.response.pilihan_jawaban)
                                            text_div_paxs+=`<option value="`+medical_config.result.response.pilihan_jawaban[i]+`">`+medical_config.result.response.pilihan_jawaban[i]+`</option>`;
                                            text_div_paxs+=`</select>
                                        </div>
                                    </div>
                                </div>`;

                                text_div_paxs+=`
                                <div class="col-lg-6 col-md-6 col-sm-6" style="margin-top:15px;" id="adult_menggunakan_emco_div`+parseInt(counter_passenger+1)+`" hidden>
                                    <label style="color:red !important">*</label>
                                    <label>Menggunakan Emco</label>`;
                                    if(template == 1){
                                        text_div_paxs+=`<div class="input-container-search-ticket">`;
                                    }else if(template == 2){
                                        text_div_paxs+=`<div>`;
                                    }else if(template == 3){
                                        text_div_paxs+=`<div class="default-select">`;
                                    }else if(template == 4){
                                        text_div_paxs+=`<div class="input-container-search-ticket">`;
                                    }else if(template == 5){
                                        text_div_paxs+=`<div class="input-container-search-ticket">`;
                                    }

                                    if(template == 5){
                                        text_div_paxs+=`<div class="form-select">`;
                                    }else{
                                        text_div_paxs+=`<div class="form-select-2">`;
                                    }

                                    if(template == 4){
                                        text_div_paxs+=`<select class="nice-select-default rounded" id="adult_menggunakan_emco`+parseInt(counter_passenger+1)+`" name="adult_menggunakan_emco`+parseInt(counter_passenger+1)+`">`;
                                    }else{
                                        text_div_paxs+=`<select id="adult_menggunakan_emco`+parseInt(counter_passenger+1)+`" name="adult_menggunakan_emco`+parseInt(counter_passenger+1)+`">`;
                                    }
                                    text_div_paxs += '<option value="">Choose</option>';
                                        for(i in medical_config.result.response.pilihan_jawaban)
                                            text_div_paxs+=`<option value="`+medical_config.result.response.pilihan_jawaban[i]+`">`+medical_config.result.response.pilihan_jawaban[i]+`</option>`;
                                            text_div_paxs+=`</select>
                                        </div>
                                    </div>
                                </div>`;

                                text_div_paxs+=`
                                <div class="col-lg-6 col-md-6 col-sm-6" style="margin-top:15px;" hidden>
                                    <label style="color:red !important">*</label>
                                    <label>Nama RS Lainnya</label>
                                    <div class="input-container-search-ticket" style="margin-bottom:5px;">
                                        <input type="text" class="form-control date-picker-birth" name="adult_nama_rs_lainnya`+parseInt(counter_passenger+1)+`" id="adult_nama_rs_lainnya`+parseInt(counter_passenger+1)+`" placeholder="Nama RS lainnya " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Nama RS lainnya '" autocomplete="off">
                                    </div>
                                </div>`;

                                text_div_paxs+=`
                                <div class="col-lg-6 col-md-6 col-sm-6" style="margin-top:15px;" id="adult_klinis_ada_penumonia_div`+parseInt(counter_passenger+1)+`" hidden>
                                    <label style="color:red !important">*</label>
                                    <label>Penumonia</label>`;
                                    if(template == 1){
                                        text_div_paxs+=`<div class="input-container-search-ticket">`;
                                    }else if(template == 2){
                                        text_div_paxs+=`<div>`;
                                    }else if(template == 3){
                                        text_div_paxs+=`<div class="default-select">`;
                                    }else if(template == 4){
                                        text_div_paxs+=`<div class="input-container-search-ticket">`;
                                    }else if(template == 5){
                                        text_div_paxs+=`<div class="input-container-search-ticket">`;
                                    }

                                    if(template == 5){
                                        text_div_paxs+=`<div class="form-select">`;
                                    }else{
                                        text_div_paxs+=`<div class="form-select-2">`;
                                    }

                                    if(template == 4){
                                        text_div_paxs+=`<select class="nice-select-default rounded" id="adult_klinis_ada_penumonia`+parseInt(counter_passenger+1)+`" name="adult_klinis_ada_penumonia`+parseInt(counter_passenger+1)+`">`;
                                    }else{
                                        text_div_paxs+=`<select id="adult_klinis_ada_penumonia`+parseInt(counter_passenger+1)+`" name="adult_klinis_ada_penumonia`+parseInt(counter_passenger+1)+`">`;
                                    }
                                    text_div_paxs += '<option value="">Choose</option>';
                                        for(i in medical_config.result.response.pilihan_jawaban)
                                            text_div_paxs+=`<option value="`+medical_config.result.response.pilihan_jawaban[i]+`">`+medical_config.result.response.pilihan_jawaban[i]+`</option>`;
                                            text_div_paxs+=`</select>
                                        </div>
                                    </div>
                                </div>`;

                                text_div_paxs+=`
                                <div class="col-lg-6 col-md-6 col-sm-6" style="margin-top:15px;" id="adult_klinis_ada_ards_div`+parseInt(counter_passenger+1)+`" hidden>
                                    <label style="color:red !important">*</label>
                                    <label>ARDS (Acute Respiratory Distress Syndrom)</label>`;
                                    if(template == 1){
                                        text_div_paxs+=`<div class="input-container-search-ticket">`;
                                    }else if(template == 2){
                                        text_div_paxs+=`<div>`;
                                    }else if(template == 3){
                                        text_div_paxs+=`<div class="default-select">`;
                                    }else if(template == 4){
                                        text_div_paxs+=`<div class="input-container-search-ticket">`;
                                    }else if(template == 5){
                                        text_div_paxs+=`<div class="input-container-search-ticket">`;
                                    }
                                    text_div_paxs+=`<div class="form-select-2">`;
                                    if(template == 4){
                                        text_div_paxs+=`<select class="nice-select-default rounded" id="adult_klinis_ada_ards`+parseInt(counter_passenger+1)+`" name="adult_klinis_ada_ards`+parseInt(counter_passenger+1)+`" onchange="onchange_ards(`+parseInt(counter_passenger+1)+`);">`;
                                    }else{
                                        text_div_paxs+=`<select id="adult_klinis_ada_ards`+parseInt(counter_passenger+1)+`" name="adult_klinis_ada_ards`+parseInt(counter_passenger+1)+`" onchange="onchange_ards(`+parseInt(counter_passenger+1)+`);">`;
                                    }
                                    text_div_paxs += '<option value="">Choose</option>';
                                        for(i in medical_config.result.response.pilihan_jawaban)
                                            text_div_paxs+=`<option value="`+medical_config.result.response.pilihan_jawaban[i]+`">`+medical_config.result.response.pilihan_jawaban[i]+`</option>`;
                                            text_div_paxs+=`</select>
                                        </div>
                                    </div>
                                </div>`;

                                text_div_paxs+=`
                                <div class="col-lg-6 col-md-6 col-sm-6" style="margin-top:15px;" id="ards_detail_div`+parseInt(counter_passenger+1)+`" hidden>
                                    <label style="color:red !important">*</label>
                                    <label>Ards Detail</label>
                                    <div class="input-container-search-ticket" style="margin-bottom:5px;">
                                        <input type="text" class="form-control date-picker-birth" name="adult_klinis_ards_detil`+parseInt(counter_passenger+1)+`" id="adult_klinis_ards_detil`+parseInt(counter_passenger+1)+`" placeholder="Ards Detail " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Ards Detail '" autocomplete="off">
                                    </div>
                                </div>`;

                                text_div_paxs+=`
                                <div class="col-lg-6 col-md-6 col-sm-6" style="margin-top:15px;" id="adult_klinis_ada_penyakit_pernafasan_div`+parseInt(counter_passenger+1)+`" hidden>
                                    <label style="color:red !important">*</label>
                                    <label>Penyakit Pernafasan</label>`;
                                    if(template == 1){
                                        text_div_paxs+=`<div class="input-container-search-ticket">`;
                                    }else if(template == 2){
                                        text_div_paxs+=`<div>`;
                                    }else if(template == 3){
                                        text_div_paxs+=`<div class="default-select">`;
                                    }else if(template == 4){
                                        text_div_paxs+=`<div class="input-container-search-ticket">`;
                                    }else if(template == 5){
                                        text_div_paxs+=`<div class="input-container-search-ticket">`;
                                    }
                                    text_div_paxs+=`<div class="form-select-2">`;
                                    if(template == 4){
                                        text_div_paxs+=`<select class="nice-select-default rounded" id="adult_klinis_ada_penyakit_pernafasan`+parseInt(counter_passenger+1)+`" name="adult_klinis_ada_penyakit_pernafasan`+parseInt(counter_passenger+1)+`">`;
                                    }else{
                                        text_div_paxs+=`<select id="adult_klinis_ada_penyakit_pernafasan`+parseInt(counter_passenger+1)+`" name="adult_klinis_ada_penyakit_pernafasan`+parseInt(counter_passenger+1)+`">`;
                                    }
                                    text_div_paxs += '<option value="">Choose</option>';
                                        for(i in medical_config.result.response.pilihan_jawaban)
                                            text_div_paxs+=`<option value="`+medical_config.result.response.pilihan_jawaban[i]+`">`+medical_config.result.response.pilihan_jawaban[i]+`</option>`;
                                            text_div_paxs+=`</select>
                                        </div>
                                    </div>
                                </div>`;

                                text_div_paxs+=`
                                <div class="col-lg-6 col-md-6 col-sm-6" style="margin-top:15px;" hidden>
                                    <label style="color:red !important">*</label>
                                    <label>Penyakit Pernafasan Detail</label>
                                    <div class="input-container-search-ticket" style="margin-bottom:5px;">
                                        <input type="text" class="form-control date-picker-birth" name="adult_klinis_penyakit_pernafasan_detil`+parseInt(counter_passenger+1)+`" id="adult_klinis_penyakit_pernafasan_detil`+parseInt(counter_passenger+1)+`" placeholder="Penyakit Pernafasan Detail " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Penyakit Pernafasan Detail '" autocomplete="off">
                                    </div>
                                </div>`;


                                text_div_paxs+=`
                                <div class="col-lg-12" style="margin-top:15px;">
                                    <hr/>
                                    <h4>Gejala</h4>
                                </div>`;
                                text_div_paxs+=`
                                    <div class="col-lg-12 col-md-12 col-sm-12" style="margin-top:15px;">
                                        <label style="color:red !important">*</label>
                                        <label>Memiliki Gejala Covid-19?</label>`;
                                        if(template == 1){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 2){
                                            text_div_paxs+=`<div>`;
                                        }else if(template == 3){
                                            text_div_paxs+=`<div class="default-select">`;
                                        }else if(template == 4){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 5){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }
                                        text_div_paxs+=`<div class="form-select-2">`;
                                        if(template == 4){
                                            text_div_paxs+=`<select class="nice-select-default rounded" id="adult_gejala`+parseInt(counter_passenger+1)+`" name="adult_gejala`+parseInt(counter_passenger+1)+`" onchange="onchange_gejala(`+parseInt(counter_passenger+1)+`);">`;
                                        }else{
                                            text_div_paxs+=`<select id="adult_gejala`+parseInt(counter_passenger+1)+`" name="adult_gejala`+parseInt(counter_passenger+1)+`" onchange="onchange_gejala(`+parseInt(counter_passenger+1)+`);">`;
                                        }
                                        text_div_paxs += '<option value="">Choose</option>';
                                            for(i in medical_config.result.response.pilihan_jawaban){
                                                if(medical_config.result.response.pilihan_jawaban[i] == 'TIDAK TAHU')
                                                    text_div_paxs+=`<option value="`+medical_config.result.response.pilihan_jawaban[i]+`" selected>`+medical_config.result.response.pilihan_jawaban[i]+`</option>`;
                                                else
                                                    text_div_paxs+=`<option value="`+medical_config.result.response.pilihan_jawaban[i]+`">`+medical_config.result.response.pilihan_jawaban[i]+`</option>`;
                                            }
                                                text_div_paxs+=`</select>
                                            </div>
                                        </div>
                                    </div>`;

                                text_div_paxs+=`
                                <div class="col-lg-12 col-md-12 col-sm-12" id="table_gejala_div`+parseInt(counter_passenger+1)+`" hidden>
                                    <div class="row">
                                <div class="col-lg-6 col-md-6 col-sm-6" style="margin-top:15px;">
                                    <label style="color:red !important">*</label>
                                    <label>Tanggal pertama kali gejala</label>
                                    <div class="input-container-search-ticket" style="margin-bottom:5px;">
                                        <input type="text" class="form-control date-picker-birth" name="adult_tanggal_pertama_kali_gejala`+parseInt(counter_passenger+1)+`" id="adult_tanggal_pertama_kali_gejala`+parseInt(counter_passenger+1)+`" placeholder="Tanggal pertama kali gejala " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Tanggal pertama kali gejala '" autocomplete="off">
                                        <button type="button" class="primary-delete-date" onclick="clear_date('adult_tanggal_pertama_kali_gejala`+parseInt(counter_passenger+1)+`')"><i class="fa fa-trash-alt" style="color:#E92B2B;font-size:20px;"></i></button>
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-6 col-sm-6">
                                </div>`;

                                text_div_paxs+=`

                                    <div class="col-lg-6 col-md-6 col-sm-6" style="margin-top:15px;">
                                        <label style="color:red !important">*</label>
                                        <label>Demam</label>`;
                                        if(template == 1){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 2){
                                            text_div_paxs+=`<div>`;
                                        }else if(template == 3){
                                            text_div_paxs+=`<div class="default-select">`;
                                        }else if(template == 4){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 5){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }
                                        text_div_paxs+=`<div class="form-select-2">`;
                                        if(template == 4){
                                            text_div_paxs+=`<select class="nice-select-default rounded" id="adult_klinis_ada_demam`+parseInt(counter_passenger+1)+`" name="adult_klinis_ada_demam`+parseInt(counter_passenger+1)+`" onchange="onchange_demam(`+parseInt(counter_passenger+1)+`)">`;
                                        }else{
                                            text_div_paxs+=`<select id="adult_klinis_ada_demam`+parseInt(counter_passenger+1)+`" name="adult_klinis_ada_demam`+parseInt(counter_passenger+1)+`" onchange="onchange_demam(`+parseInt(counter_passenger+1)+`)">`;
                                        }
                                        text_div_paxs += '<option value="">Choose</option>';
                                            for(i in medical_config.result.response.pilihan_jawaban)
                                                text_div_paxs+=`<option value="`+medical_config.result.response.pilihan_jawaban[i]+`">`+medical_config.result.response.pilihan_jawaban[i]+`</option>`;
                                                text_div_paxs+=`</select>
                                            </div>
                                        </div>
                                    </div>`;

                                text_div_paxs+=`
                                    <div class="col-lg-6 col-md-6 col-sm-6" style="margin-top:15px;">
                                        <div id="suhu_tubuh_div`+parseInt(counter_passenger+1)+`" hidden>
                                            <label style="color:red !important">*</label>
                                            <label>Suhu Tubuh</label>
                                            <div class="input-container-search-ticket" style="margin-bottom:5px;">
                                                <input type="number" class="form-control date-picker-birth" name="adult_klinis_suhu_tubuh`+parseInt(counter_passenger+1)+`" id="adult_klinis_suhu_tubuh`+parseInt(counter_passenger+1)+`" placeholder="Suhu Tubuh " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Birth Date '" autocomplete="off">
                                            </div>
                                        </div>
                                    </div>`;

                                text_div_paxs+=`

                                    <div class="col-lg-6 col-md-6 col-sm-6" style="margin-top:15px;">
                                        <label style="color:red !important">*</label>
                                        <label>Batuk</label>`;
                                        if(template == 1){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 2){
                                            text_div_paxs+=`<div>`;
                                        }else if(template == 3){
                                            text_div_paxs+=`<div class="default-select">`;
                                        }else if(template == 4){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 5){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }
                                        text_div_paxs+=`<div class="form-select-2">`;
                                        if(template == 4){
                                            text_div_paxs+=`<select class="nice-select-default rounded" id="adult_klinis_ada_batuk`+parseInt(counter_passenger+1)+`" name="adult_klinis_ada_batuk`+parseInt(counter_passenger+1)+`">`;
                                        }else{
                                            text_div_paxs+=`<select id="adult_klinis_ada_batuk`+parseInt(counter_passenger+1)+`" name="adult_klinis_ada_batuk`+parseInt(counter_passenger+1)+`">`;
                                        }
                                        text_div_paxs += '<option value="">Choose</option>';
                                            for(i in medical_config.result.response.pilihan_jawaban)
                                                text_div_paxs+=`<option value="`+medical_config.result.response.pilihan_jawaban[i]+`">`+medical_config.result.response.pilihan_jawaban[i]+`</option>`;
                                                text_div_paxs+=`</select>
                                            </div>
                                        </div>
                                    </div>`;

                                text_div_paxs+=`

                                    <div class="col-lg-6 col-md-6 col-sm-6" style="margin-top:15px;">
                                        <label style="color:red !important">*</label>
                                        <label>Flu</label>`;
                                        if(template == 1){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 2){
                                            text_div_paxs+=`<div>`;
                                        }else if(template == 3){
                                            text_div_paxs+=`<div class="default-select">`;
                                        }else if(template == 4){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 5){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }
                                        text_div_paxs+=`<div class="form-select-2">`;
                                        if(template == 4){
                                            text_div_paxs+=`<select class="nice-select-default rounded" id="adult_klinis_ada_pilek`+parseInt(counter_passenger+1)+`" name="adult_klinis_ada_pilek`+parseInt(counter_passenger+1)+`">`;
                                        }else{
                                            text_div_paxs+=`<select id="adult_klinis_ada_pilek`+parseInt(counter_passenger+1)+`" name="adult_klinis_ada_pilek`+parseInt(counter_passenger+1)+`">`;
                                        }
                                        text_div_paxs += '<option value="">Choose</option>';
                                            for(i in medical_config.result.response.pilihan_jawaban)
                                                text_div_paxs+=`<option value="`+medical_config.result.response.pilihan_jawaban[i]+`">`+medical_config.result.response.pilihan_jawaban[i]+`</option>`;
                                                text_div_paxs+=`</select>
                                            </div>
                                        </div>
                                    </div>`;

                                text_div_paxs+=`

                                    <div class="col-lg-6 col-md-6 col-sm-6" style="margin-top:15px;">
                                        <label style="color:red !important">*</label>
                                        <label>Sakit Tenggorokan</label>`;
                                        if(template == 1){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 2){
                                            text_div_paxs+=`<div>`;
                                        }else if(template == 3){
                                            text_div_paxs+=`<div class="default-select">`;
                                        }else if(template == 4){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 5){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }
                                        text_div_paxs+=`<div class="form-select-2">`;
                                        if(template == 4){
                                            text_div_paxs+=`<select class="nice-select-default rounded" id="adult_klinis_ada_sakit_tenggorokan`+parseInt(counter_passenger+1)+`" name="adult_klinis_ada_sakit_tenggorokan`+parseInt(counter_passenger+1)+`">`;
                                        }else{
                                            text_div_paxs+=`<select id="adult_klinis_ada_sakit_tenggorokan`+parseInt(counter_passenger+1)+`" name="adult_klinis_ada_sakit_tenggorokan`+parseInt(counter_passenger+1)+`">`;
                                        }
                                        text_div_paxs += '<option value="">Choose</option>';
                                            for(i in medical_config.result.response.pilihan_jawaban)
                                                text_div_paxs+=`<option value="`+medical_config.result.response.pilihan_jawaban[i]+`">`+medical_config.result.response.pilihan_jawaban[i]+`</option>`;
                                                text_div_paxs+=`</select>
                                            </div>
                                        </div>
                                    </div>`;

                                text_div_paxs+=`

                                    <div class="col-lg-6 col-md-6 col-sm-6" style="margin-top:15px;">
                                        <label style="color:red !important">*</label>
                                        <label>Sesak Nafas</label>`;
                                        if(template == 1){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 2){
                                            text_div_paxs+=`<div>`;
                                        }else if(template == 3){
                                            text_div_paxs+=`<div class="default-select">`;
                                        }else if(template == 4){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 5){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }
                                        text_div_paxs+=`<div class="form-select-2">`;
                                        if(template == 4){
                                            text_div_paxs+=`<select class="nice-select-default rounded" id="adult_klinis_ada_sesak`+parseInt(counter_passenger+1)+`" name="adult_klinis_ada_sesak`+parseInt(counter_passenger+1)+`">`;
                                        }else{
                                            text_div_paxs+=`<select id="adult_klinis_ada_sesak`+parseInt(counter_passenger+1)+`" name="adult_klinis_ada_sesak`+parseInt(counter_passenger+1)+`">`;
                                        }
                                        text_div_paxs += '<option value="">Choose</option>';
                                            for(i in medical_config.result.response.pilihan_jawaban)
                                                text_div_paxs+=`<option value="`+medical_config.result.response.pilihan_jawaban[i]+`">`+medical_config.result.response.pilihan_jawaban[i]+`</option>`;
                                                text_div_paxs+=`</select>
                                            </div>
                                        </div>
                                    </div>`;

                                text_div_paxs+=`

                                    <div class="col-lg-6 col-md-6 col-sm-6" style="margin-top:15px;">
                                        <label style="color:red !important">*</label>
                                        <label>Sakit Kepala</label>`;
                                        if(template == 1){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 2){
                                            text_div_paxs+=`<div>`;
                                        }else if(template == 3){
                                            text_div_paxs+=`<div class="default-select">`;
                                        }else if(template == 4){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 5){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }
                                        text_div_paxs+=`<div class="form-select-2">`;
                                        if(template == 4){
                                            text_div_paxs+=`<select class="nice-select-default rounded" id="adult_klinis_ada_sakit_kepala`+parseInt(counter_passenger+1)+`" name="adult_klinis_ada_sakit_kepala`+parseInt(counter_passenger+1)+`">`;
                                        }else{
                                            text_div_paxs+=`<select id="adult_klinis_ada_sakit_kepala`+parseInt(counter_passenger+1)+`" name="adult_klinis_ada_sakit_kepala`+parseInt(counter_passenger+1)+`">`;
                                        }
                                        text_div_paxs += '<option value="">Choose</option>';
                                            for(i in medical_config.result.response.pilihan_jawaban)
                                                text_div_paxs+=`<option value="`+medical_config.result.response.pilihan_jawaban[i]+`">`+medical_config.result.response.pilihan_jawaban[i]+`</option>`;
                                                text_div_paxs+=`</select>
                                            </div>
                                        </div>
                                    </div>`;

                                text_div_paxs+=`

                                    <div class="col-lg-6 col-md-6 col-sm-6" style="margin-top:15px;">
                                        <label style="color:red !important">*</label>
                                        <label>Badan Lemah</label>`;
                                        if(template == 1){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 2){
                                            text_div_paxs+=`<div>`;
                                        }else if(template == 3){
                                            text_div_paxs+=`<div class="default-select">`;
                                        }else if(template == 4){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 5){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }
                                        text_div_paxs+=`<div class="form-select-2">`;
                                        if(template == 4){
                                            text_div_paxs+=`<select class="nice-select-default rounded" id="adult_klinis_ada_badan_lemah`+parseInt(counter_passenger+1)+`" name="adult_klinis_ada_badan_lemah`+parseInt(counter_passenger+1)+`">`;
                                        }else{
                                            text_div_paxs+=`<select id="adult_klinis_ada_badan_lemah`+parseInt(counter_passenger+1)+`" name="adult_klinis_ada_badan_lemah`+parseInt(counter_passenger+1)+`">`;
                                        }
                                        text_div_paxs += '<option value="">Choose</option>';
                                            for(i in medical_config.result.response.pilihan_jawaban)
                                                text_div_paxs+=`<option value="`+medical_config.result.response.pilihan_jawaban[i]+`">`+medical_config.result.response.pilihan_jawaban[i]+`</option>`;
                                                text_div_paxs+=`</select>
                                            </div>
                                        </div>
                                    </div>`;

                                text_div_paxs+=`

                                    <div class="col-lg-6 col-md-6 col-sm-6" style="margin-top:15px;">
                                        <label style="color:red !important">*</label>
                                        <label>Nyeri Otot</label>`;
                                        if(template == 1){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 2){
                                            text_div_paxs+=`<div>`;
                                        }else if(template == 3){
                                            text_div_paxs+=`<div class="default-select">`;
                                        }else if(template == 4){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 5){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }
                                        text_div_paxs+=`<div class="form-select-2">`;
                                        if(template == 4){
                                            text_div_paxs+=`<select class="nice-select-default rounded" id="adult_klinis_ada_nyeri_otot`+parseInt(counter_passenger+1)+`" name="adult_klinis_ada_nyeri_otot`+parseInt(counter_passenger+1)+`">`;
                                        }else{
                                            text_div_paxs+=`<select id="adult_klinis_ada_nyeri_otot`+parseInt(counter_passenger+1)+`" name="adult_klinis_ada_nyeri_otot`+parseInt(counter_passenger+1)+`">`;
                                        }
                                        text_div_paxs += '<option value="">Choose</option>';
                                            for(i in medical_config.result.response.pilihan_jawaban)
                                                text_div_paxs+=`<option value="`+medical_config.result.response.pilihan_jawaban[i]+`">`+medical_config.result.response.pilihan_jawaban[i]+`</option>`;
                                                text_div_paxs+=`</select>
                                            </div>
                                        </div>
                                    </div>`;

                                text_div_paxs+=`

                                    <div class="col-lg-6 col-md-6 col-sm-6" style="margin-top:15px;">
                                        <label style="color:red !important">*</label>
                                        <label>Mual</label>`;
                                        if(template == 1){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 2){
                                            text_div_paxs+=`<div>`;
                                        }else if(template == 3){
                                            text_div_paxs+=`<div class="default-select">`;
                                        }else if(template == 4){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 5){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }
                                        text_div_paxs+=`<div class="form-select-2">`;
                                        if(template == 4){
                                            text_div_paxs+=`<select class="nice-select-default rounded" id="adult_klinis_ada_mual`+parseInt(counter_passenger+1)+`" name="adult_klinis_ada_mual`+parseInt(counter_passenger+1)+`">`;
                                        }else{
                                            text_div_paxs+=`<select id="adult_klinis_ada_mual`+parseInt(counter_passenger+1)+`" name="adult_klinis_ada_mual`+parseInt(counter_passenger+1)+`">`;
                                        }
                                        text_div_paxs += '<option value="">Choose</option>';
                                            for(i in medical_config.result.response.pilihan_jawaban)
                                                text_div_paxs+=`<option value="`+medical_config.result.response.pilihan_jawaban[i]+`">`+medical_config.result.response.pilihan_jawaban[i]+`</option>`;
                                                text_div_paxs+=`</select>
                                            </div>
                                        </div>
                                    </div>`;

                                text_div_paxs+=`

                                    <div class="col-lg-6 col-md-6 col-sm-6" style="margin-top:15px;">
                                        <label style="color:red !important">*</label>
                                        <label>Nyeri Abdomen</label>`;
                                        if(template == 1){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 2){
                                            text_div_paxs+=`<div>`;
                                        }else if(template == 3){
                                            text_div_paxs+=`<div class="default-select">`;
                                        }else if(template == 4){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 5){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }
                                        text_div_paxs+=`<div class="form-select-2">`;
                                        if(template == 4){
                                            text_div_paxs+=`<select class="nice-select-default rounded" id="adult_klinis_ada_nyeri_abdomen`+parseInt(counter_passenger+1)+`" name="adult_klinis_ada_nyeri_abdomen`+parseInt(counter_passenger+1)+`">`;
                                        }else{
                                            text_div_paxs+=`<select id="adult_klinis_ada_nyeri_abdomen`+parseInt(counter_passenger+1)+`" name="adult_klinis_ada_nyeri_abdomen`+parseInt(counter_passenger+1)+`">`;
                                        }
                                        text_div_paxs += '<option value="">Choose</option>';
                                            for(i in medical_config.result.response.pilihan_jawaban)
                                                text_div_paxs+=`<option value="`+medical_config.result.response.pilihan_jawaban[i]+`">`+medical_config.result.response.pilihan_jawaban[i]+`</option>`;
                                                text_div_paxs+=`</select>
                                            </div>
                                        </div>
                                    </div>`;

                                text_div_paxs+=`

                                    <div class="col-lg-6 col-md-6 col-sm-6" style="margin-top:15px;">
                                        <label style="color:red !important">*</label>
                                        <label>Diare</label>`;
                                        if(template == 1){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 2){
                                            text_div_paxs+=`<div>`;
                                        }else if(template == 3){
                                            text_div_paxs+=`<div class="default-select">`;
                                        }else if(template == 4){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 5){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }
                                        text_div_paxs+=`<div class="form-select-2">`;
                                        if(template == 4){
                                            text_div_paxs+=`<select class="nice-select-default rounded" id="adult_klinis_ada_diare`+parseInt(counter_passenger+1)+`" name="adult_klinis_ada_diare`+parseInt(counter_passenger+1)+`">`;
                                        }else{
                                            text_div_paxs+=`<select id="adult_klinis_ada_diare`+parseInt(counter_passenger+1)+`" name="adult_klinis_ada_diare`+parseInt(counter_passenger+1)+`">`;
                                        }
                                        text_div_paxs += '<option value="">Choose</option>';
                                            for(i in medical_config.result.response.pilihan_jawaban)
                                                text_div_paxs+=`<option value="`+medical_config.result.response.pilihan_jawaban[i]+`">`+medical_config.result.response.pilihan_jawaban[i]+`</option>`;
                                                text_div_paxs+=`</select>
                                            </div>
                                        </div>
                                    </div>`;

                                text_div_paxs+=`

                                    <div class="col-lg-6 col-md-6 col-sm-6" style="margin-top:15px;">
                                        <label style="color:red !important">*</label>
                                        <label>Gangguan Penciuman</label>`;
                                        if(template == 1){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 2){
                                            text_div_paxs+=`<div>`;
                                        }else if(template == 3){
                                            text_div_paxs+=`<div class="default-select">`;
                                        }else if(template == 4){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 5){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }
                                        text_div_paxs+=`<div class="form-select-2">`;
                                        if(template == 4){
                                            text_div_paxs+=`<select class="nice-select-default rounded" id="adult_klinis_ada_gangguan_penciuman`+parseInt(counter_passenger+1)+`" name="adult_klinis_ada_gangguan_penciuman`+parseInt(counter_passenger+1)+`">`;
                                        }else{
                                            text_div_paxs+=`<select id="adult_klinis_ada_gangguan_penciuman`+parseInt(counter_passenger+1)+`" name="adult_klinis_ada_gangguan_penciuman`+parseInt(counter_passenger+1)+`">`;
                                        }
                                        text_div_paxs += '<option value="">Choose</option>';
                                            for(i in medical_config.result.response.pilihan_jawaban)
                                                text_div_paxs+=`<option value="`+medical_config.result.response.pilihan_jawaban[i]+`">`+medical_config.result.response.pilihan_jawaban[i]+`</option>`;
                                                text_div_paxs+=`</select>
                                            </div>
                                        </div>
                                    </div>`;

                                text_div_paxs+=`
                                    <div class="col-lg-6 col-md-6 col-sm-6" style="margin-top:15px;">
                                        <label style="color:white !important">*</label>
                                        <label>Gejala Lainnya</label>
                                        <div class="input-container-search-ticket" style="margin-bottom:5px;">
                                            <input type="text" class="form-control date-picker-birth" name="adult_klinis_gejala_lainnya`+parseInt(counter_passenger+1)+`" id="adult_klinis_gejala_lainnya`+parseInt(counter_passenger+1)+`" placeholder="Gejala Lainnya " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Gejala Lainnya '" autocomplete="off">
                                        </div>
                                    </div>
                                    </div>
                                </div>`;

                                text_div_paxs+=`
                                <div class="col-lg-12" style="margin-top:15px;">
                                    <hr/>
                                    <h4>Penyakit Bawaan</h4>
                                </div>`;
                                text_div_paxs+=`
                                    <div class="col-lg-12 col-md-12 col-sm-12" style="margin-top:15px;">
                                        <label style="color:red !important">*</label>
                                        <label>Memiliki Penyakit Bawaan?</label>`;
                                        if(template == 1){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 2){
                                            text_div_paxs+=`<div>`;
                                        }else if(template == 3){
                                            text_div_paxs+=`<div class="default-select">`;
                                        }else if(template == 4){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 5){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }
                                        text_div_paxs+=`<div class="form-select-2">`;
                                        if(template == 4){
                                            text_div_paxs+=`<select class="nice-select-default rounded" id="adult_penyakit_bawaan`+parseInt(counter_passenger+1)+`" name="adult_penyakit_bawaan`+parseInt(counter_passenger+1)+`" onchange="onchange_penyakit_bawaan(`+parseInt(counter_passenger+1)+`)">`;
                                        }else{
                                            text_div_paxs+=`<select id="adult_penyakit_bawaan`+parseInt(counter_passenger+1)+`" name="adult_penyakit_bawaan`+parseInt(counter_passenger+1)+`" onchange="onchange_penyakit_bawaan(`+parseInt(counter_passenger+1)+`)">`;
                                        }
                                        text_div_paxs += '<option value="">Choose</option>';
                                            for(i in medical_config.result.response.pilihan_jawaban)
                                                text_div_paxs+=`<option value="`+medical_config.result.response.pilihan_jawaban[i]+`">`+medical_config.result.response.pilihan_jawaban[i]+`</option>`;
                                                text_div_paxs+=`</select>
                                            </div>
                                        </div>
                                    </div>`;


                                text_div_paxs+=`
                                    <div class="col-lg-12 col-md-12 col-sm-12" id="table_penyakit_bawaan_div`+parseInt(counter_passenger+1)+`" hidden>
                                        <div class="row">
                                    <div class="col-lg-6 col-md-6 col-sm-6" style="margin-top:15px;">
                                        <label style="color:red !important">*</label>
                                        <label>Diabetes</label>`;
                                        if(template == 1){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 2){
                                            text_div_paxs+=`<div>`;
                                        }else if(template == 3){
                                            text_div_paxs+=`<div class="default-select">`;
                                        }else if(template == 4){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 5){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }
                                        text_div_paxs+=`<div class="form-select-2">`;
                                        if(template == 4){
                                            text_div_paxs+=`<select class="nice-select-default rounded" id="adult_klinis_ada_diabetes`+parseInt(counter_passenger+1)+`" name="adult_klinis_ada_diabetes`+parseInt(counter_passenger+1)+`">`;
                                        }else{
                                            text_div_paxs+=`<select id="adult_klinis_ada_diabetes`+parseInt(counter_passenger+1)+`" name="adult_klinis_ada_diabetes`+parseInt(counter_passenger+1)+`">`;
                                        }
                                        text_div_paxs += '<option value="">Choose</option>';
                                            for(i in medical_config.result.response.pilihan_jawaban)
                                                text_div_paxs+=`<option value="`+medical_config.result.response.pilihan_jawaban[i]+`">`+medical_config.result.response.pilihan_jawaban[i]+`</option>`;
                                                text_div_paxs+=`</select>
                                            </div>
                                        </div>
                                    </div>`;

                                text_div_paxs+=`

                                    <div class="col-lg-6 col-md-6 col-sm-6" style="margin-top:15px;">
                                        <label style="color:red !important">*</label>
                                        <label>Penyakit Jantung</label>`;
                                        if(template == 1){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 2){
                                            text_div_paxs+=`<div>`;
                                        }else if(template == 3){
                                            text_div_paxs+=`<div class="default-select">`;
                                        }else if(template == 4){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 5){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }
                                        text_div_paxs+=`<div class="form-select-2">`;
                                        if(template == 4){
                                            text_div_paxs+=`<select class="nice-select-default rounded" id="adult_klinis_ada_penyakit_jantung`+parseInt(counter_passenger+1)+`" name="adult_klinis_ada_penyakit_jantung`+parseInt(counter_passenger+1)+`">`;
                                        }else{
                                            text_div_paxs+=`<select id="adult_klinis_ada_penyakit_jantung`+parseInt(counter_passenger+1)+`" name="adult_klinis_ada_penyakit_jantung`+parseInt(counter_passenger+1)+`">`;
                                        }
                                        text_div_paxs += '<option value="">Choose</option>';
                                            for(i in medical_config.result.response.pilihan_jawaban)
                                                text_div_paxs+=`<option value="`+medical_config.result.response.pilihan_jawaban[i]+`">`+medical_config.result.response.pilihan_jawaban[i]+`</option>`;
                                                text_div_paxs+=`</select>
                                            </div>
                                        </div>
                                    </div>`;

                                text_div_paxs+=`

                                    <div class="col-lg-6 col-md-6 col-sm-6" style="margin-top:15px;">
                                        <label style="color:red !important">*</label>
                                        <label>Hipertensi</label>`;
                                        if(template == 1){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 2){
                                            text_div_paxs+=`<div>`;
                                        }else if(template == 3){
                                            text_div_paxs+=`<div class="default-select">`;
                                        }else if(template == 4){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 5){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }
                                        text_div_paxs+=`<div class="form-select-2">`;
                                        if(template == 4){
                                            text_div_paxs+=`<select class="nice-select-default rounded" id="adult_klinis_ada_hipertensi`+parseInt(counter_passenger+1)+`" name="adult_klinis_ada_penyakit_jantung`+parseInt(counter_passenger+1)+`">`;
                                        }else{
                                            text_div_paxs+=`<select id="adult_klinis_ada_hipertensi`+parseInt(counter_passenger+1)+`" name="adult_klinis_ada_hipertensi`+parseInt(counter_passenger+1)+`">`;
                                        }
                                        text_div_paxs += '<option value="">Choose</option>';
                                            for(i in medical_config.result.response.pilihan_jawaban)
                                                text_div_paxs+=`<option value="`+medical_config.result.response.pilihan_jawaban[i]+`">`+medical_config.result.response.pilihan_jawaban[i]+`</option>`;
                                                text_div_paxs+=`</select>
                                            </div>
                                        </div>
                                    </div>`;

                                text_div_paxs+=`

                                    <div class="col-lg-6 col-md-6 col-sm-6" style="margin-top:15px;">
                                        <label style="color:red !important">*</label>
                                        <label>Keganasan</label>`;
                                        if(template == 1){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 2){
                                            text_div_paxs+=`<div>`;
                                        }else if(template == 3){
                                            text_div_paxs+=`<div class="default-select">`;
                                        }else if(template == 4){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 5){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }
                                        text_div_paxs+=`<div class="form-select-2">`;
                                        if(template == 4){
                                            text_div_paxs+=`<select class="nice-select-default rounded" id="adult_klinis_ada_keganasan`+parseInt(counter_passenger+1)+`" name="adult_klinis_ada_keganasan`+parseInt(counter_passenger+1)+`">`;
                                        }else{
                                            text_div_paxs+=`<select id="adult_klinis_ada_keganasan`+parseInt(counter_passenger+1)+`" name="adult_klinis_ada_keganasan`+parseInt(counter_passenger+1)+`">`;
                                        }
                                        text_div_paxs += '<option value="">Choose</option>';
                                            for(i in medical_config.result.response.pilihan_jawaban)
                                                text_div_paxs+=`<option value="`+medical_config.result.response.pilihan_jawaban[i]+`">`+medical_config.result.response.pilihan_jawaban[i]+`</option>`;
                                                text_div_paxs+=`</select>
                                            </div>
                                        </div>
                                    </div>`;

                                text_div_paxs+=`

                                    <div class="col-lg-6 col-md-6 col-sm-6" style="margin-top:15px;">
                                        <label style="color:red !important">*</label>
                                        <label>Gangguan Imunologi</label>`;
                                        if(template == 1){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 2){
                                            text_div_paxs+=`<div>`;
                                        }else if(template == 3){
                                            text_div_paxs+=`<div class="default-select">`;
                                        }else if(template == 4){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 5){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }
                                        text_div_paxs+=`<div class="form-select-2">`;
                                        if(template == 4){
                                            text_div_paxs+=`<select class="nice-select-default rounded" id="adult_klinis_ada_gangguan_imunologi`+parseInt(counter_passenger+1)+`" name="adult_klinis_ada_gangguan_imunologi`+parseInt(counter_passenger+1)+`">`;
                                        }else{
                                            text_div_paxs+=`<select id="adult_klinis_ada_gangguan_imunologi`+parseInt(counter_passenger+1)+`" name="adult_klinis_ada_gangguan_imunologi`+parseInt(counter_passenger+1)+`">`;
                                        }
                                        text_div_paxs += '<option value="">Choose</option>';
                                            for(i in medical_config.result.response.pilihan_jawaban)
                                                text_div_paxs+=`<option value="`+medical_config.result.response.pilihan_jawaban[i]+`">`+medical_config.result.response.pilihan_jawaban[i]+`</option>`;
                                                text_div_paxs+=`</select>
                                            </div>
                                        </div>
                                    </div>`;

                                text_div_paxs+=`

                                    <div class="col-lg-6 col-md-6 col-sm-6" style="margin-top:15px;">
                                        <label style="color:red !important">*</label>
                                        <label>Gangguan Ginjal</label>`;
                                        if(template == 1){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 2){
                                            text_div_paxs+=`<div>`;
                                        }else if(template == 3){
                                            text_div_paxs+=`<div class="default-select">`;
                                        }else if(template == 4){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 5){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }
                                        text_div_paxs+=`<div class="form-select-2">`;
                                        if(template == 4){
                                            text_div_paxs+=`<select class="nice-select-default rounded" id="adult_klinis_ada_gangguan_ginjal`+parseInt(counter_passenger+1)+`" name="adult_klinis_ada_gangguan_ginjal`+parseInt(counter_passenger+1)+`">`;
                                        }else{
                                            text_div_paxs+=`<select id="adult_klinis_ada_gangguan_ginjal`+parseInt(counter_passenger+1)+`" name="adult_klinis_ada_gangguan_ginjal`+parseInt(counter_passenger+1)+`">`;
                                        }
                                        text_div_paxs += '<option value="">Choose</option>';
                                            for(i in medical_config.result.response.pilihan_jawaban)
                                                text_div_paxs+=`<option value="`+medical_config.result.response.pilihan_jawaban[i]+`">`+medical_config.result.response.pilihan_jawaban[i]+`</option>`;
                                                text_div_paxs+=`</select>
                                            </div>
                                        </div>
                                    </div>`;

                                text_div_paxs+=`

                                    <div class="col-lg-6 col-md-6 col-sm-6" style="margin-top:15px;">
                                        <label style="color:red !important">*</label>
                                        <label>Gangguan Hati</label>`;
                                        if(template == 1){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 2){
                                            text_div_paxs+=`<div>`;
                                        }else if(template == 3){
                                            text_div_paxs+=`<div class="default-select">`;
                                        }else if(template == 4){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 5){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }
                                        text_div_paxs+=`<div class="form-select-2">`;
                                        if(template == 4){
                                            text_div_paxs+=`<select class="nice-select-default rounded" id="adult_klinis_ada_gangguan_hati`+parseInt(counter_passenger+1)+`" name="adult_klinis_ada_gangguan_hati`+parseInt(counter_passenger+1)+`">`;
                                        }else{
                                            text_div_paxs+=`<select id="adult_klinis_ada_gangguan_hati`+parseInt(counter_passenger+1)+`" name="adult_klinis_ada_gangguan_hati`+parseInt(counter_passenger+1)+`">`;
                                        }
                                        text_div_paxs += '<option value="">Choose</option>';
                                            for(i in medical_config.result.response.pilihan_jawaban)
                                                text_div_paxs+=`<option value="`+medical_config.result.response.pilihan_jawaban[i]+`">`+medical_config.result.response.pilihan_jawaban[i]+`</option>`;
                                                text_div_paxs+=`</select>
                                            </div>
                                        </div>
                                    </div>`;

                                text_div_paxs+=`

                                    <div class="col-lg-6 col-md-6 col-sm-6" style="margin-top:15px;">
                                        <label style="color:red !important">*</label>
                                        <label>Gangguan Paru Obstruksi Kronis</label>`;
                                        if(template == 1){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 2){
                                            text_div_paxs+=`<div>`;
                                        }else if(template == 3){
                                            text_div_paxs+=`<div class="default-select">`;
                                        }else if(template == 4){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 5){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }
                                        text_div_paxs+=`<div class="form-select-2">`;
                                        if(template == 4){
                                            text_div_paxs+=`<select class="nice-select-default rounded" id="adult_klinis_ada_gangguan_paru_obstruksi_kronis`+parseInt(counter_passenger+1)+`" name="adult_klinis_ada_gangguan_paru_obstruksi_kronis`+parseInt(counter_passenger+1)+`">`;
                                        }else{
                                            text_div_paxs+=`<select id="adult_klinis_ada_gangguan_paru_obstruksi_kronis`+parseInt(counter_passenger+1)+`" name="adult_klinis_ada_gangguan_paru_obstruksi_kronis`+parseInt(counter_passenger+1)+`">`;
                                        }
                                        text_div_paxs += '<option value="">Choose</option>';
                                            for(i in medical_config.result.response.pilihan_jawaban)
                                                text_div_paxs+=`<option value="`+medical_config.result.response.pilihan_jawaban[i]+`">`+medical_config.result.response.pilihan_jawaban[i]+`</option>`;
                                                text_div_paxs+=`</select>
                                            </div>
                                        </div>
                                    </div>`;

                                text_div_paxs+=`
                                <div class="col-lg-6 col-md-6 col-sm-6" style="margin-top:15px;">
                                    <label style="color:white !important">*</label>
                                    <label>Kondisi Penyerta Lainnya</label>
                                    <div class="input-container-search-ticket" style="margin-bottom:5px;">
                                        <input type="text" class="form-control date-picker-birth" name="adult_klinis_kondisi_penyerta_lainnya`+parseInt(counter_passenger+1)+`" id="adult_klinis_kondisi_penyerta_lainnya`+parseInt(counter_passenger+1)+`" placeholder="Kondisi Penyerta Lainnya " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Kondisi Penyerta Lainnya '" autocomplete="off">
                                    </div>
                                </div>
                            </div>
                        </div>`;

                                text_div_paxs+=`
                                    <div class="col-lg-12 mt-3"></div>
                                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 mt-2" style="text-align:left;">
                                        <button type="button" class="primary-btn prev-next-form" style="margin-bottom:5px; font-size:12px; font-weight:700;" onclick="next_prev_form_medical('prev', 1, `+counter_passenger+`);">
                                            <i class="fas fa-arrow-left"></i> Prev
                                        </button>
                                    </div>
                                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 mt-2" style="text-align:center;"></div>
                                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 mt-2" style="text-align:right;">
                                        <button type="button" class="primary-btn prev-next-form" style="margin-bottom:5px; font-size:12px; font-weight:700;" onclick="next_prev_form_medical('next', 3, `+counter_passenger+`);">
                                            Next <i class="fas fa-arrow-right"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>`;

                            //ini tab faktor
                            text_div_paxs += `
                            <div id="progress_div3`+counter_passenger+`" style="background:#fcfcfc; border-top:1px solid #cdcdcd; display:none; padding:15px;">
                                <div class="row">
                                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4" style="text-align:left;">
                                        <button type="button" class="primary-btn prev-next-form" style="margin-bottom:5px; font-size:12px; font-weight:700;" onclick="next_prev_form_medical('prev', 2, `+counter_passenger+`);">
                                            <i class="fas fa-arrow-left"></i> Prev
                                        </button>
                                    </div>
                                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4" style="text-align:center;">
                                        <button type="button" class="primary-btn prev-next-form" style="margin-bottom:5px; font-size:12px; font-weight:700;" onclick="update_customer_fill('save',`+counter_passenger+`)">
                                            Save <i class="fas fa-save"></i>
                                        </button>
                                    </div>
                                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4" style="text-align:right;"></div>`;

                                text_div_paxs+=`

                                    <div class="col-lg-12 col-md-12 col-sm-12" style="margin-top:15px;">
                                        <label style="color:red !important">*</label>
                                        <label>Pernah Melakukan Perjalanan/Berkunjung? (seperti Luar Negri, Dalam Negri, Fasilitas Kesehatan, Pasar, Pasien)</label>`;
                                        if(template == 1){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 2){
                                            text_div_paxs+=`<div>`;
                                        }else if(template == 3){
                                            text_div_paxs+=`<div class="default-select">`;
                                        }else if(template == 4){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 5){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }
                                        text_div_paxs+=`<div class="form-select-2">`;
                                        if(template == 4){
                                            text_div_paxs+=`<select class="nice-select-default rounded" id="adult_perjalanan`+parseInt(counter_passenger+1)+`" name="adult_perjalanan`+parseInt(counter_passenger+1)+`" onchange="onchange_perjalanan(`+parseInt(counter_passenger+1)+`)">`;
                                        }else{
                                            text_div_paxs+=`<select id="adult_perjalanan`+parseInt(counter_passenger+1)+`" name="adult_perjalanan`+parseInt(counter_passenger+1)+`" onchange="onchange_perjalanan(`+parseInt(counter_passenger+1)+`)">`;
                                        }
                                        text_div_paxs += '<option value="">Choose</option>';
                                            for(i in medical_config.result.response.pilihan_jawaban)
                                                text_div_paxs+=`<option value="`+medical_config.result.response.pilihan_jawaban[i]+`">`+medical_config.result.response.pilihan_jawaban[i]+`</option>`;
                                                text_div_paxs+=`</select>
                                            </div>
                                        </div>
                                    </div>`;

                                text_div_paxs+=`
                                    <div class="col-lg-12 col-md-12 col-sm-12" style="margin-top:15px;" id="adult_perjalanan_div`+parseInt(counter_passenger+1)+`" hidden>
                                        <div class="row">
                                    <div class="col-lg-12 col-md-12 col-sm-12" style="margin-top:15px;">
                                        <label style="color:red !important">*</label>
                                        <label>Perjalanan Keluar Negeri</label>`;
                                        if(template == 1){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 2){
                                            text_div_paxs+=`<div>`;
                                        }else if(template == 3){
                                            text_div_paxs+=`<div class="default-select">`;
                                        }else if(template == 4){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 5){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }
                                        text_div_paxs+=`<div class="form-select-2">`;
                                        if(template == 4){
                                            text_div_paxs+=`<select class="nice-select-default rounded" id="adult_perjalanan_keluar_negeri`+parseInt(counter_passenger+1)+`" name="adult_perjalanan_keluar_negeri`+parseInt(counter_passenger+1)+`" onchange="onchange_perjalanan_keluar_negeri(`+parseInt(counter_passenger+1)+`)">`;
                                        }else{
                                            text_div_paxs+=`<select id="adult_perjalanan_keluar_negeri`+parseInt(counter_passenger+1)+`" name="adult_perjalanan_keluar_negeri`+parseInt(counter_passenger+1)+`" onchange="onchange_perjalanan_keluar_negeri(`+parseInt(counter_passenger+1)+`)">`;
                                        }
                                        text_div_paxs += '<option value="">Choose</option>';
                                            for(i in medical_config.result.response.pilihan_jawaban)
                                                text_div_paxs+=`<option value="`+medical_config.result.response.pilihan_jawaban[i]+`">`+medical_config.result.response.pilihan_jawaban[i]+`</option>`;
                                                text_div_paxs+=`</select>
                                            </div>
                                        </div>
                                    </div>`;

                                text_div_paxs+=`
                                    <div class="col-lg-12 col-md-12 col-sm-12" style="margin-bottom:15px;" id="daftar_perjalanan_keluar_negeri`+parseInt(counter_passenger+1)+`">
                                    </div>
                                `;

                                text_div_paxs+=`

                                    <div class="col-lg-12 col-md-12 col-sm-12" style="margin-top:15px;">
                                        <label style="color:red !important">*</label>
                                        <label>Perjalanan Transmisi Lokal</label>`;
                                        if(template == 1){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 2){
                                            text_div_paxs+=`<div>`;
                                        }else if(template == 3){
                                            text_div_paxs+=`<div class="default-select">`;
                                        }else if(template == 4){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 5){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }
                                        text_div_paxs+=`<div class="form-select-2">`;
                                        if(template == 4){
                                            text_div_paxs+=`<select class="nice-select-default rounded" id="adult_perjalanan_ke_transmisi_lokal`+parseInt(counter_passenger+1)+`" name="adult_perjalanan_ke_transmisi_lokal`+parseInt(counter_passenger+1)+`" onchange="onchange_perjalanan_ke_transmisi_lokal(`+parseInt(counter_passenger+1)+`)">`;
                                        }else{
                                            text_div_paxs+=`<select id="adult_perjalanan_ke_transmisi_lokal`+parseInt(counter_passenger+1)+`" name="adult_perjalanan_ke_transmisi_lokal`+parseInt(counter_passenger+1)+`" onchange="onchange_perjalanan_ke_transmisi_lokal(`+parseInt(counter_passenger+1)+`)">`;
                                        }
                                        text_div_paxs += '<option value="">Choose</option>';
                                            for(i in medical_config.result.response.pilihan_jawaban)
                                                text_div_paxs+=`<option value="`+medical_config.result.response.pilihan_jawaban[i]+`">`+medical_config.result.response.pilihan_jawaban[i]+`</option>`;
                                                text_div_paxs+=`</select>
                                            </div>
                                        </div>
                                    </div>`;

                                text_div_paxs+=`
                                    <div class="col-lg-12 col-md-12 col-sm-12" style="margin-bottom:15px;" id="perjalanan_ke_transmisi_lokal`+parseInt(counter_passenger+1)+`">
                                    </div>
                                </div>
                            </div>`;

                                text_div_paxs+=`
                                    <div class="col-lg-12 col-md-12 col-sm-12" style="margin-top:15px;" id="adult_berkunjung_div`+parseInt(counter_passenger+1)+`" hidden>
                                        <div class="row">
                                    <div class="col-lg-12 col-md-12 col-sm-12" style="margin-top:15px;">
                                        <label style="color:red !important">*</label>
                                        <label>Berkunjung Ke Fasilitas Kesehatan</label>`;
                                        if(template == 1){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 2){
                                            text_div_paxs+=`<div>`;
                                        }else if(template == 3){
                                            text_div_paxs+=`<div class="default-select">`;
                                        }else if(template == 4){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 5){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }
                                        text_div_paxs+=`<div class="form-select-2">`;
                                        if(template == 4){
                                            text_div_paxs+=`<select class="nice-select-default rounded" id="adult_berkunjung_ke_fasilitas_kesehatan`+parseInt(counter_passenger+1)+`" name="adult_berkunjung_ke_fasilitas_kesehatan`+parseInt(counter_passenger+1)+`" onchange="onchange_berkunjung_ke_fasilitas_kesehatan(`+parseInt(counter_passenger+1)+`)">`;
                                        }else{
                                            text_div_paxs+=`<select id="adult_berkunjung_ke_fasilitas_kesehatan`+parseInt(counter_passenger+1)+`" name="adult_berkunjung_ke_fasilitas_kesehatan`+parseInt(counter_passenger+1)+`" onchange="onchange_berkunjung_ke_fasilitas_kesehatan(`+parseInt(counter_passenger+1)+`)">`;
                                        }
                                        text_div_paxs += '<option value="">Choose</option>';
                                            for(i in medical_config.result.response.pilihan_jawaban)
                                                text_div_paxs+=`<option value="`+medical_config.result.response.pilihan_jawaban[i]+`">`+medical_config.result.response.pilihan_jawaban[i]+`</option>`;
                                                text_div_paxs+=`</select>
                                            </div>
                                        </div>
                                    </div>`;

                                text_div_paxs+=`
                                    <div class="col-lg-12 col-md-12 col-sm-12" style="margin-bottom:15px;" id="berkunjung_ke_fasilitas_kesehatan`+parseInt(counter_passenger+1)+`">
                                    </div>
                                `;

                                text_div_paxs+=`

                                    <div class="col-lg-12 col-md-12 col-sm-12" style="margin-top:15px;">
                                        <label style="color:red !important">*</label>
                                        <label>Berkunjung Ke Pasar Hewan</label>`;
                                        if(template == 1){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 2){
                                            text_div_paxs+=`<div>`;
                                        }else if(template == 3){
                                            text_div_paxs+=`<div class="default-select">`;
                                        }else if(template == 4){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 5){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }
                                        text_div_paxs+=`<div class="form-select-2">`;
                                        if(template == 4){
                                            text_div_paxs+=`<select class="nice-select-default rounded" id="adult_berkunjung_ke_pasar_hewan`+parseInt(counter_passenger+1)+`" name="adult_berkunjung_ke_pasar_hewan`+parseInt(counter_passenger+1)+`" onchange="onchange_berkunjung_ke_pasar_hewan(`+parseInt(counter_passenger+1)+`)">`;
                                        }else{
                                            text_div_paxs+=`<select id="adult_berkunjung_ke_pasar_hewan`+parseInt(counter_passenger+1)+`" name="adult_berkunjung_ke_pasar_hewan`+parseInt(counter_passenger+1)+`" onchange="onchange_berkunjung_ke_pasar_hewan(`+parseInt(counter_passenger+1)+`)">`;
                                        }
                                        text_div_paxs += '<option value="">Choose</option>';
                                            for(i in medical_config.result.response.pilihan_jawaban)
                                                text_div_paxs+=`<option value="`+medical_config.result.response.pilihan_jawaban[i]+`">`+medical_config.result.response.pilihan_jawaban[i]+`</option>`;
                                                text_div_paxs+=`</select>
                                            </div>
                                        </div>
                                    </div>`;

                                text_div_paxs+=`
                                    <div class="col-lg-12 col-md-12 col-sm-12" style="margin-bottom:15px;" id="berkunjung_ke_pasar_hewan`+parseInt(counter_passenger+1)+`">
                                    </div>
                                `;

                                text_div_paxs+=`

                                    <div class="col-lg-12 col-md-12 col-sm-12" style="margin-top:15px;">
                                        <label style="color:red !important">*</label>
                                        <label>Berkunjung Ke Pasien Dalam Pengawasan Covid-19</label>`;
                                        if(template == 1){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 2){
                                            text_div_paxs+=`<div>`;
                                        }else if(template == 3){
                                            text_div_paxs+=`<div class="default-select">`;
                                        }else if(template == 4){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 5){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }
                                        text_div_paxs+=`<div class="form-select-2">`;
                                        if(template == 4){
                                            text_div_paxs+=`<select class="nice-select-default rounded" id="adult_berkunjung_ke_pasien_dalam_pengawasan`+parseInt(counter_passenger+1)+`" name="adult_berkunjung_ke_pasien_dalam_pengawasan`+parseInt(counter_passenger+1)+`" onchange="onchange_berkunjung_ke_pasien_dalam_pengawasan(`+parseInt(counter_passenger+1)+`)">`;
                                        }else{
                                            text_div_paxs+=`<select id="adult_berkunjung_ke_pasien_dalam_pengawasan`+parseInt(counter_passenger+1)+`" name="adult_berkunjung_ke_pasien_dalam_pengawasan`+parseInt(counter_passenger+1)+`" onchange="onchange_berkunjung_ke_pasien_dalam_pengawasan(`+parseInt(counter_passenger+1)+`)">`;
                                        }
                                        text_div_paxs += '<option value="">Choose</option>';
                                            for(i in medical_config.result.response.pilihan_jawaban)
                                                text_div_paxs+=`<option value="`+medical_config.result.response.pilihan_jawaban[i]+`">`+medical_config.result.response.pilihan_jawaban[i]+`</option>`;
                                                text_div_paxs+=`</select>
                                            </div>
                                        </div>
                                    </div>`;

                                text_div_paxs+=`
                                    <div class="col-lg-12 col-md-12 col-sm-12" style="margin-bottom:15px;" id="berkunjung_ke_pasien_dalam_pengawasan`+parseInt(counter_passenger+1)+`">
                                    </div>
                                `;

                                text_div_paxs+=`

                                    <div class="col-lg-12 col-md-12 col-sm-12" style="margin-top:15px;">
                                        <label style="color:red !important">*</label>
                                        <label>Berkunjung Ke Pasien Positif Covid-19</label>`;
                                        if(template == 1){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 2){
                                            text_div_paxs+=`<div>`;
                                        }else if(template == 3){
                                            text_div_paxs+=`<div class="default-select">`;
                                        }else if(template == 4){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 5){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }
                                        text_div_paxs+=`<div class="form-select-2">`;
                                        if(template == 4){
                                            text_div_paxs+=`<select class="nice-select-default rounded" id="adult_berkunjung_ke_pasien_konfirmasi`+parseInt(counter_passenger+1)+`" name="adult_berkunjung_ke_pasien_konfirmasi`+parseInt(counter_passenger+1)+`" onchange="onchange_berkunjung_ke_pasien_konfirmasi(`+parseInt(counter_passenger+1)+`)">`;
                                        }else{
                                            text_div_paxs+=`<select id="adult_berkunjung_ke_pasien_konfirmasi`+parseInt(counter_passenger+1)+`" name="adult_berkunjung_ke_pasien_konfirmasi`+parseInt(counter_passenger+1)+`" onchange="onchange_berkunjung_ke_pasien_konfirmasi(`+parseInt(counter_passenger+1)+`)">`;
                                        }
                                        text_div_paxs += '<option value="">Choose</option>';
                                            for(i in medical_config.result.response.pilihan_jawaban)
                                                text_div_paxs+=`<option value="`+medical_config.result.response.pilihan_jawaban[i]+`">`+medical_config.result.response.pilihan_jawaban[i]+`</option>`;
                                                text_div_paxs+=`</select>
                                            </div>
                                        </div>
                                    </div>`;

                                text_div_paxs+=`
                                    <div class="col-lg-12 col-md-12 col-sm-12" style="margin-bottom:15px;" id="berkunjung_ke_pasien_konfirmasi`+parseInt(counter_passenger+1)+`">
                                    </div>
                                </div>
                            </div>`;

                                text_div_paxs+=`

                                    <div class="col-lg-12" style="margin-top:15px;">
                                        <label><label style="color:red !important">*</label> Apakah pasien termasuk cluster ISPA berat (demam dan pneumonia membutuhkan perawatan Rumah Sakit) yang tidak diketahui penyebabnya dimana kasus COVID-19 diperiksa?</label>`;
                                        if(template == 1){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 2){
                                            text_div_paxs+=`<div>`;
                                        }else if(template == 3){
                                            text_div_paxs+=`<div class="default-select">`;
                                        }else if(template == 4){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 5){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }
                                        text_div_paxs+=`<div class="form-select-2">`;
                                        if(template == 4){
                                            text_div_paxs+=`<select class="nice-select-default rounded" id="adult_termasuk_cluster_ispa`+parseInt(counter_passenger+1)+`" name="adult_termasuk_cluster_ispa`+parseInt(counter_passenger+1)+`">`;
                                        }else{
                                            text_div_paxs+=`<select id="adult_termasuk_cluster_ispa`+parseInt(counter_passenger+1)+`" name="adult_termasuk_cluster_ispa`+parseInt(counter_passenger+1)+`">`;
                                        }
                                        text_div_paxs += '<option value="">Choose</option>';
                                            for(i in medical_config.result.response.pilihan_jawaban)
                                                text_div_paxs+=`<option value="`+medical_config.result.response.pilihan_jawaban[i]+`">`+medical_config.result.response.pilihan_jawaban[i]+`</option>`;
                                                text_div_paxs+=`</select>
                                            </div>
                                        </div>
                                    </div>`;

                                text_div_paxs+=`

                                    <div class="col-lg-6 col-md-6 col-sm-6" style="margin-top:15px;">
                                        <label style="color:red !important">*</label>
                                        <label>Apakah pasien seorang petugas kesehatan?</label>`;
                                        if(template == 1){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 2){
                                            text_div_paxs+=`<div>`;
                                        }else if(template == 3){
                                            text_div_paxs+=`<div class="default-select">`;
                                        }else if(template == 4){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 5){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }
                                        text_div_paxs+=`<div class="form-select-2">`;
                                        if(template == 4){
                                            text_div_paxs+=`<select class="nice-select-default rounded" id="adult_merupakan_petugas_kesehatan`+parseInt(counter_passenger+1)+`" name="adult_merupakan_petugas_kesehatan`+parseInt(counter_passenger+1)+`" onchange="onchange_petugas_medis(`+parseInt(counter_passenger+1)+`)">`;
                                        }else{
                                            text_div_paxs+=`<select id="adult_merupakan_petugas_kesehatan`+parseInt(counter_passenger+1)+`" name="adult_merupakan_petugas_kesehatan`+parseInt(counter_passenger+1)+`" onchange="onchange_petugas_medis(`+parseInt(counter_passenger+1)+`)">`;
                                        }
                                        text_div_paxs += '<option value="">Choose</option>';
                                            for(i in medical_config.result.response.pilihan_jawaban)
                                                text_div_paxs+=`<option value="`+medical_config.result.response.pilihan_jawaban[i]+`">`+medical_config.result.response.pilihan_jawaban[i]+`</option>`;
                                                text_div_paxs+=`</select>
                                            </div>
                                        </div>
                                    </div>`;

                                text_div_paxs+=`

                                    <div class="col-lg-6 col-md-6 col-sm-6" style="margin-top:15px;" id="apd_div`+parseInt(counter_passenger+1)+`" hidden>
                                        <label style="color:red !important">*</label>
                                        <label>APD yang digunakan?</label>`;
                                        if(template == 1){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 2){
                                            text_div_paxs+=`<div>`;
                                        }else if(template == 3){
                                            text_div_paxs+=`<div class="default-select">`;
                                        }else if(template == 4){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 5){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }
                                        text_div_paxs+=`<div class="form-select-2">`;
                                        if(template == 4){
                                            text_div_paxs+=`<select class="nice-select-default rounded" id="adult_apd_yang_digunakan`+parseInt(counter_passenger+1)+`" name="adult_apd_yang_digunakan`+parseInt(counter_passenger+1)+`">`;
                                        }else{
                                            text_div_paxs+=`<select id="adult_apd_yang_digunakan`+parseInt(counter_passenger+1)+`" name="adult_apd_yang_digunakan`+parseInt(counter_passenger+1)+`">`;
                                        }
                                        text_div_paxs += '<option value="">Choose</option>';
                                            for(i in medical_config.result.response.apd)
                                                text_div_paxs+=`<option value="`+medical_config.result.response.apd[i]+`">`+medical_config.result.response.apd[i]+`</option>`;
                                                text_div_paxs+=`</select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-12"></div>`;

                                text_div_paxs+=`

                                    <div class="col-lg-6 col-md-6 col-sm-6" style="margin-top:15px;">
                                        <label style="color:red !important">*</label>
                                        <label>Apakah melakukan prosedur yang menimbulkan aerosol?</label>`;
                                        if(template == 1){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 2){
                                            text_div_paxs+=`<div>`;
                                        }else if(template == 3){
                                            text_div_paxs+=`<div class="default-select">`;
                                        }else if(template == 4){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }else if(template == 5){
                                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                                        }
                                        text_div_paxs+=`<div class="form-select-2">`;
                                        if(template == 4){
                                            text_div_paxs+=`<select class="nice-select-default rounded" id="adult_prosedur_menimbulkan_aerosol`+parseInt(counter_passenger+1)+`" name="adult_prosedur_menimbulkan_aerosol`+parseInt(counter_passenger+1)+`" onchange="onchange_aerosol(`+parseInt(counter_passenger+1)+`)">`;
                                        }else{
                                            text_div_paxs+=`<select id="adult_prosedur_menimbulkan_aerosol`+parseInt(counter_passenger+1)+`" name="adult_prosedur_menimbulkan_aerosol`+parseInt(counter_passenger+1)+`" onchange="onchange_aerosol(`+parseInt(counter_passenger+1)+`)">`;
                                        }
                                        text_div_paxs += '<option value="">Choose</option>';
                                            for(i in medical_config.result.response.pilihan_jawaban)
                                                text_div_paxs+=`<option value="`+medical_config.result.response.pilihan_jawaban[i]+`">`+medical_config.result.response.pilihan_jawaban[i]+`</option>`;
                                                text_div_paxs+=`</select>
                                            </div>
                                        </div>
                                    </div>`;

                                text_div_paxs+=`
                                    <div class="col-lg-6 col-md-6 col-sm-6" style="margin-top:15px;" id="tindakan_aerosol_div`+parseInt(counter_passenger+1)+`" hidden>
                                        <label style="color:red !important">*</label>
                                        <label>Tindakan Aerosol</label>
                                        <div class="input-container-search-ticket" style="margin-bottom:5px;">
                                            <input type="text" class="form-control date-picker-birth" name="adult_tindakan_menimbulkan_aerosol`+parseInt(counter_passenger+1)+`" id="adult_tindakan_menimbulkan_aerosol`+parseInt(counter_passenger+1)+`" placeholder="Tindakan Aerosol " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Tindakan Aerosol '" autocomplete="off">
                                        </div>
                                    </div>
                                    <div class="col-lg-12"></div>`;

                                text_div_paxs+=`
                                    <div class="col-lg-6 col-md-6 col-sm-6" style="margin-top:15px;">
                                        <label style="color:white !important">*</label>
                                        <label>Faktor Lain</label>
                                        <div class="input-container-search-ticket" style="margin-bottom:5px;">
                                            <input type="text" class="form-control date-picker-birth" name="adult_faktor_lain`+parseInt(counter_passenger+1)+`" id="adult_faktor_lain`+parseInt(counter_passenger+1)+`" placeholder="Faktor Lain " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Faktor Lain '" autocomplete="off">
                                        </div>
                                    </div>

                                    <div class="col-lg-12"></div>
                                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 mt-2" style="text-align:left;">
                                        <button type="button" class="primary-btn prev-next-form" style="margin-bottom:5px; font-size:12px; font-weight:700;" onclick="next_prev_form_medical('prev', 2, `+counter_passenger+`);">
                                            <i class="fas fa-arrow-left"></i> Prev
                                        </button>
                                    </div>
                                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 mt-2" style="text-align:center;">
                                        <button type="button" class="primary-btn prev-next-form" style="margin-bottom:5px; font-size:12px; font-weight:700;" onclick="update_customer_fill('save',`+counter_passenger+`)">
                                            Save <i class="fas fa-save"></i>
                                        </button>
                                    </div>
                                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 mt-2" style="text-align:right;"></div>
                                </div>
                            </div>`;
                        }
                    }

                    if(vendor != 'phc'){
                        text_div_paxs+=`
                        <div class="col-lg-12 mt-3 mb-3" style="text-align:right;">
                            <button type="button" class="primary-btn prev-next-form" style="margin-bottom:5px; font-size:12px; font-weight:700;" onclick="update_customer_fill('save',`+counter_passenger+`)">
                                Save <i class="fas fa-save"></i>
                            </button>
                        </div>`;
                    }

                text_div_paxs+=`
                </div>
            </div>
        </div>
    </div>`;

    document.getElementById("div_passenger_list"+counter_passenger).innerHTML = text_div_paxs;

    $('input[name="adult_birth_date'+parseInt(counter_passenger+1)+'"]').daterangepicker({
          singleDatePicker: true,
          autoUpdateInput: true,
          startDate: moment().subtract(+18, 'years'),
          maxDate: moment(),
          showDropdowns: true,
          opens: 'center',
          drops: 'down',
          locale: {
              format: 'DD MMM YYYY',
          }
    });
    $('input[name="adult_birth_date'+parseInt(counter_passenger+1)+'"]').val("");
    $('input[name="adult_identity_expired_date'+parseInt(counter_passenger+1)+'"]').daterangepicker({
          singleDatePicker: true,
          autoUpdateInput: true,
          startDate: moment(),
          minDate: moment(),
          showDropdowns: true,
          opens: 'center',
          drops: 'down',
          locale: {
              format: 'DD MMM YYYY',
          }
    });
    $('input[name="adult_identity_expired_date'+parseInt(counter_passenger+1)+'"]').val("");

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
    if(vendor == 'phc'){

        $('#adult_tempat_lahir'+parseInt(counter_passenger+1)+'_id').select2();
        $('#adult_kabupaten'+parseInt(counter_passenger+1)+'_id').select2();
        $('#adult_kecamatan'+parseInt(counter_passenger+1)+'_id').select2();
        $('#adult_kelurahan'+parseInt(counter_passenger+1)+'_id').select2();
        $('#adult_kabupaten_ktp'+parseInt(counter_passenger+1)+'_id').select2();
        $('#adult_kecamatan_ktp'+parseInt(counter_passenger+1)+'_id').select2();
        $('#adult_kelurahan_ktp'+parseInt(counter_passenger+1)+'_id').select2();
        if(test_type == 'PHCDTKPCR' || test_type == 'PHCHCKPCR'){
            $('#adult_kriteria_pasien'+parseInt(counter_passenger+1)).niceSelect();
            $('#adult_perusahaan'+parseInt(counter_passenger+1)).niceSelect();
            $('#adult_klinis_ada_demam'+parseInt(counter_passenger+1)).niceSelect();
            $('#adult_klinis_ada_batuk'+parseInt(counter_passenger+1)).niceSelect();
            $('#adult_klinis_ada_pilek'+parseInt(counter_passenger+1)).niceSelect();
            $('#adult_klinis_ada_sakit_tenggorokan'+parseInt(counter_passenger+1)).niceSelect();
            $('#adult_klinis_ada_sesak'+parseInt(counter_passenger+1)).niceSelect();
            $('#adult_klinis_ada_sakit_kepala'+parseInt(counter_passenger+1)).niceSelect();
            $('#adult_klinis_ada_badan_lemah'+parseInt(counter_passenger+1)).niceSelect();
            $('#adult_klinis_ada_nyeri_otot'+parseInt(counter_passenger+1)).niceSelect();
            $('#adult_klinis_ada_mual'+parseInt(counter_passenger+1)).niceSelect();
            $('#adult_klinis_ada_nyeri_abdomen'+parseInt(counter_passenger+1)).niceSelect();
            $('#adult_klinis_ada_diare'+parseInt(counter_passenger+1)).niceSelect();
            $('#adult_klinis_ada_gangguan_penciuman'+parseInt(counter_passenger+1)).niceSelect();
            $('#adult_klinis_golongan_darah'+parseInt(counter_passenger+1)).niceSelect();
            $('#adult_klinis_sedang_hamil'+parseInt(counter_passenger+1)).niceSelect();
            $('#adult_klinis_ada_diabetes'+parseInt(counter_passenger+1)).niceSelect();
            $('#adult_klinis_ada_penyakit_jantung'+parseInt(counter_passenger+1)).niceSelect();
            $('#adult_klinis_ada_hipertensi'+parseInt(counter_passenger+1)).niceSelect();
            $('#adult_klinis_ada_keganasan'+parseInt(counter_passenger+1)).niceSelect();
            $('#adult_klinis_ada_gangguan_imunologi'+parseInt(counter_passenger+1)).niceSelect();
            $('#adult_klinis_ada_gangguan_ginjal'+parseInt(counter_passenger+1)).niceSelect();
            $('#adult_klinis_ada_gangguan_hati'+parseInt(counter_passenger+1)).niceSelect();
            $('#adult_klinis_ada_gangguan_paru_obstruksi_kronis'+parseInt(counter_passenger+1)).niceSelect();
            $('#adult_sedang_dirawat_di_rs'+parseInt(counter_passenger+1)).niceSelect();
            $('#adult_sedang_dirawat_di_icu'+parseInt(counter_passenger+1)).niceSelect();
            $('#adult_menggunakan_intubasi'+parseInt(counter_passenger+1)).niceSelect();
            $('#adult_menggunakan_emco'+parseInt(counter_passenger+1)).niceSelect();
            $('#adult_status_terakhir'+parseInt(counter_passenger+1)).niceSelect();
            $('#adult_klinis_ada_penumonia'+parseInt(counter_passenger+1)).niceSelect();
            $('#adult_klinis_ada_ards'+parseInt(counter_passenger+1)).niceSelect();
            $('#adult_klinis_ada_penyakit_pernafasan'+parseInt(counter_passenger+1)).niceSelect();
            $('#adult_perjalanan_keluar_negeri'+parseInt(counter_passenger+1)).niceSelect();
            $('#adult_perjalanan_ke_transmisi_lokal'+parseInt(counter_passenger+1)).niceSelect();
            $('#adult_berkunjung_ke_fasilitas_kesehatan'+parseInt(counter_passenger+1)).niceSelect();
            $('#adult_berkunjung_ke_pasar_hewan'+parseInt(counter_passenger+1)).niceSelect();
            $('#adult_berkunjung_ke_pasien_dalam_pengawasan'+parseInt(counter_passenger+1)).niceSelect();
            $('#adult_berkunjung_ke_pasien_konfirmasi'+parseInt(counter_passenger+1)).niceSelect();
            $('#adult_termasuk_cluster_ispa'+parseInt(counter_passenger+1)).niceSelect();
            $('#adult_merupakan_petugas_kesehatan'+parseInt(counter_passenger+1)).niceSelect();
            $('#adult_apd_yang_digunakan'+parseInt(counter_passenger+1)).niceSelect();
            $('#adult_prosedur_menimbulkan_aerosol'+parseInt(counter_passenger+1)).niceSelect();

            $('#adult_gejala'+parseInt(counter_passenger+1)).niceSelect();
            $('#adult_penyakit_bawaan'+parseInt(counter_passenger+1)).niceSelect();

            $('#adult_perjalanan'+parseInt(counter_passenger+1)).niceSelect();
            $('#adult_berkunjung'+parseInt(counter_passenger+1)).niceSelect();

            $('input[name="adult_tanggal_pertama_kali_gejala'+parseInt(counter_passenger+1)+'"]').daterangepicker({
                  singleDatePicker: true,
                  autoUpdateInput: true,
                  showDropdowns: true,
                  maxDate: moment(),
                  opens: 'center',
                  drops: 'down',
                  locale: {
                      format: 'DD MMM YYYY',
                  }
            });
            $('input[name="adult_tanggal_pertama_kali_gejala'+parseInt(counter_passenger+1)+'"]').val("");
            $('input[name="adult_tanggal_masuk_rs'+parseInt(counter_passenger+1)+'"]').daterangepicker({
                  singleDatePicker: true,
                  autoUpdateInput: true,
                  showDropdowns: true,
                  opens: 'center',
                  drops: 'down',
                  locale: {
                      format: 'DD MMM YYYY',
                  }
            });
            $('input[name="adult_tanggal_masuk_rs'+parseInt(counter_passenger+1)+'"]').val("");
            perjalanan_keluar_negeri = 0;
            perjalanan_ke_transmisi_lokal = 0;
            berkunjung_ke_fasilitas_kesehatan = 0;
            berkunjung_ke_pasar_hewan = 0;
            berkunjung_ke_pasien_dalam_pengawasan = 0;
            berkunjung_ke_pasien_konfirmasi = 0;
        }
//        $('#adult_tempat_lahir'+parseInt(counter_passenger+1)).niceSelect();
//        $('#adult_kabupaten'+parseInt(counter_passenger+1)).niceSelect();
//        $('#adult_kecamatan'+parseInt(counter_passenger+1)).niceSelect();
//        $('#adult_kelurahan'+parseInt(counter_passenger+1)).niceSelect();
//        $('#adult_kabupaten_ktp'+parseInt(counter_passenger+1)).niceSelect();
//        $('#adult_kecamatan_ktp'+parseInt(counter_passenger+1)).niceSelect();
//        $('#adult_kelurahan_ktp'+parseInt(counter_passenger+1)).niceSelect();
        $('#adult_profession'+parseInt(counter_passenger+1)).niceSelect();
    }else if(vendor == 'periksain'){
        $('#adult_sample_method'+parseInt(counter_passenger+1)).niceSelect();
    }
//    get_kecamatan(`adult_kabupaten`+parseInt(counter_passenger+1),`adult_kecamatan`+parseInt(counter_passenger+1));
//    $('#adult_nationality'+parseInt(counter_passenger+1)).select2();
    if(type == 'open')
        $('#myModalPassenger'+parseInt(parseInt(counter_passenger))).modal('show');
    $('#adult_title'+parseInt(counter_passenger+1)).niceSelect();
    $('#adult_identity_type'+parseInt(counter_passenger+1)).niceSelect();
    auto_complete(`adult_nationality`+parseInt(counter_passenger+1));
    counter_passenger++;
}

function regex_phone_medical(value){
  var regex_check = "^[1-9][0-9]*$";//number
  if(value.match(regex_check)!=null){
    return value
  }else{
    value = regex_phone_medical(value.slice(1,value.length));
    return value;
  }
}

function onchange_number_no_zero(val){
  var data = regex_phone_medical(document.getElementById('adult_phone'+val).value)
  document.getElementById('adult_phone'+val).value = data;
}

function onchange_rawat_rs(val){
    if(document.getElementById('adult_sedang_dirawat_di_rs'+val).value == 'IYA'){
        document.getElementById('nama_rs_div'+val).hidden = false;
        document.getElementById('tanggal_masuk_rs'+val).hidden = false;
        document.getElementById('nama_ruang_perawatan'+val).hidden = false;
        document.getElementById('adult_sedang_dirawat_di_icu_div'+val).hidden = false;
        document.getElementById('adult_menggunakan_intubasi_div'+val).hidden = false;
        document.getElementById('adult_menggunakan_emco_div'+val).hidden = false;
        document.getElementById('adult_status_terakhir_div'+val).hidden = false;
        document.getElementById('adult_klinis_ada_penumonia_div'+val).hidden = false;
        document.getElementById('adult_klinis_ada_ards_div'+val).hidden = false;
        document.getElementById('adult_klinis_ada_penyakit_pernafasan_div'+val).hidden = false;
    }else{
        document.getElementById('nama_rs_div'+val).hidden = true;
        document.getElementById('adult_nama_rs'+val).value = '';
        document.getElementById('tanggal_masuk_rs'+val).hidden = true;
        document.getElementById('adult_tanggal_masuk_rs'+val).value = '';
        document.getElementById('nama_ruang_perawatan'+val).hidden = true;
        document.getElementById('adult_nama_ruang_perawatan'+val).value = '';
        document.getElementById('adult_sedang_dirawat_di_icu_div'+val).hidden = true;
        document.getElementById('adult_sedang_dirawat_di_icu'+val).value = '';
        document.getElementById('adult_menggunakan_intubasi_div'+val).hidden = true;
        document.getElementById('adult_menggunakan_intubasi'+val).value = '';
        document.getElementById('adult_menggunakan_emco_div'+val).hidden = true;
        document.getElementById('adult_menggunakan_emco'+val).value = '';
        document.getElementById('adult_status_terakhir_div'+val).hidden = true;
        document.getElementById('adult_status_terakhir'+val).value = '';
        document.getElementById('adult_klinis_ada_penumonia_div'+val).hidden = true;
        document.getElementById('adult_klinis_ada_penumonia'+val).value = '';
        document.getElementById('adult_klinis_ada_ards_div'+val).hidden = true;
        document.getElementById('adult_klinis_ada_ards'+val).value = '';
        document.getElementById('adult_klinis_ada_penyakit_pernafasan_div'+val).hidden = true;
        document.getElementById('adult_klinis_ada_penyakit_pernafasan'+val).value = '';
    }
}

function onchange_gejala(val){
    if(document.getElementById('adult_gejala'+val).value == 'IYA'){
        document.getElementById('table_gejala_div'+val).hidden = false;

    }else{
        document.getElementById('table_gejala_div'+val).hidden = true;
    }
}

function onchange_penyakit_bawaan(val){

    if(document.getElementById('adult_penyakit_bawaan'+val).value == 'IYA'){
        document.getElementById('table_penyakit_bawaan_div'+val).hidden = false;
    }else{
        document.getElementById('table_penyakit_bawaan_div'+val).hidden = true;
    }
}

function onchange_perjalanan(val){
    if(document.getElementById('adult_perjalanan'+val).value == 'IYA'){
        document.getElementById('adult_perjalanan_div'+val).hidden = false;
        document.getElementById('adult_berkunjung_div'+val).hidden = false;
    }else{
        document.getElementById('adult_perjalanan_div'+val).hidden = true;
        document.getElementById('adult_berkunjung_div'+val).hidden = true;
    }
}

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

function set_exp_identity(val){
    if(document.getElementById('adult_identity_type'+val).value == 'passport'){
        document.getElementById('identity_exp_date_hidden'+val).hidden = false;
    }else{
        document.getElementById('identity_exp_date_hidden'+val).hidden = true;
        document.getElementById('adult_identity_expired_date'+val).value = '';
    }
}

function onchange_demam(val){
    if(document.getElementById('adult_klinis_ada_demam'+val).value == 'IYA'){
        document.getElementById('suhu_tubuh_div'+val).hidden = false;
    }else{
        document.getElementById('suhu_tubuh_div'+val).hidden = true;
        document.getElementById('adult_klinis_suhu_tubuh'+val).value = '';
    }
}

function onchange_ards(val){
    if(document.getElementById('adult_klinis_ada_ards'+val).value == 'IYA'){
        document.getElementById('ards_detail_div'+val).hidden = false;
    }else{
        document.getElementById('ards_detail_div'+val).hidden = true;
        document.getElementById('adult_klinis_ards_detil'+val).value = '';
    }
}

function onchange_petugas_medis(val){
    if(document.getElementById('adult_merupakan_petugas_kesehatan'+val).value == 'IYA'){
        document.getElementById('apd_div'+val).hidden = false;
    }else{
        document.getElementById('apd_div'+val).hidden = true;
        document.getElementById('adult_apd_yang_digunakan'+val).value = '';
        $('#adult_apd_yang_digunakan'+val).niceSelect('update');
    }
}

function onchange_aerosol(val){
    if(document.getElementById('adult_prosedur_menimbulkan_aerosol'+val).value == 'IYA'){
        document.getElementById('tindakan_aerosol_div'+val).hidden = false;
    }else{
        document.getElementById('tindakan_aerosol_div'+val).hidden = true;
        document.getElementById('adult_tindakan_menimbulkan_aerosol'+val).value = '';
    }
}

function onchange_perjalanan_keluar_negeri(val){
    if(document.getElementById('adult_perjalanan_keluar_negeri'+val).value == 'IYA'){
        document.getElementById('daftar_perjalanan_keluar_negeri'+val).hidden = false;
        document.getElementById('daftar_perjalanan_keluar_negeri'+val).innerHTML = `
        <br/>
        <table style="width:100%;background:white;" class="list-of-table" id="perjalanan_keluar_negeri_div`+val+`">
            <tr>
                <th>
                    <div class="row">
                        <div class="col-lg-6 col-md-6">
                            <h4 style="color:`+color+`;">Perjalanan Keluar Negeri</h4>
                        </div>
                        <div class="col-lg-6 col-md-6" style="text-align:right;">
                            <button class="primary-btn-ticket" type="button" onclick="add_pcr_table('perjalanan_keluar_negeri',`+val+`);"> Add <i class="fas fa-plus"></i> </button>
                        </div>
                    </div>
                </th>
            </tr>
        </table>
        `;
    }else{
        document.getElementById('daftar_perjalanan_keluar_negeri'+val).hidden = true;
        document.getElementById('daftar_perjalanan_keluar_negeri'+val).innerHTML = '';
        perjalanan_keluar_negeri = 0;
    }
}

function onchange_perjalanan_ke_transmisi_lokal(val){
    if(document.getElementById('adult_perjalanan_ke_transmisi_lokal'+val).value == 'IYA'){
        document.getElementById('perjalanan_ke_transmisi_lokal'+val).hidden = false;
        document.getElementById('perjalanan_ke_transmisi_lokal'+val).innerHTML = `
        <br/>
        <table  style="width:100%;background:white;" class="list-of-table" id="perjalanan_ke_transmisi_lokal_div`+val+`">
            <tr>
                <th>
                    <div class="row">
                        <div class="col-lg-6 col-md-6">
                            <h4 style="color:`+color+`;">Perjalanan Transmisi Lokal</h4>
                        </div>
                        <div class="col-lg-6 col-md-6" style="text-align:right;">
                            <button class="primary-btn-ticket" type="button" onclick="add_pcr_table('perjalanan_ke_transmisi_lokal',`+val+`);"> Add <i class="fas fa-plus"></i> </button>
                        </div>
                    </div>
                </th>
            </tr>
        </table>
        `;
    }else{
        document.getElementById('perjalanan_ke_transmisi_lokal'+val).hidden = true;
        document.getElementById('perjalanan_ke_transmisi_lokal'+val).innerHTML = '';
        perjalanan_ke_transmisi_lokal = 0;
    }
}

function onchange_berkunjung_ke_fasilitas_kesehatan(val){
    if(document.getElementById('adult_berkunjung_ke_fasilitas_kesehatan'+val).value == 'IYA'){
        document.getElementById('berkunjung_ke_fasilitas_kesehatan'+val).hidden = false;
        document.getElementById('berkunjung_ke_fasilitas_kesehatan'+val).innerHTML = `
        <br/>
        <table  style="width:100%;background:white;" class="list-of-table" id="berkunjung_ke_fasilitas_kesehatan_div`+val+`">
            <tr>
                <th>
                    <div class="row">
                        <div class="col-lg-6 col-md-6">
                            <h4 style="color:`+color+`;">Berkunjung Ke Fasilitas Kesehatan</h4>
                        </div>
                        <div class="col-lg-6 col-md-6" style="text-align:right;">
                            <button class="primary-btn-ticket" type="button" onclick="add_pcr_table('berkunjung_ke_fasilitas_kesehatan',`+val+`);"> Add <i class="fas fa-plus"></i> </button>
                        </div>
                    </div>
                </th>
            </tr>
        </table>
        `;
    }else{
        document.getElementById('berkunjung_ke_fasilitas_kesehatan'+val).hidden = true;
        document.getElementById('berkunjung_ke_fasilitas_kesehatan'+val).innerHTML = '';
        berkunjung_ke_fasilitas_kesehatan = 0;
    }
}

function onchange_berkunjung_ke_pasar_hewan(val){
    if(document.getElementById('adult_berkunjung_ke_pasar_hewan'+val).value == 'IYA'){
        document.getElementById('berkunjung_ke_pasar_hewan'+val).hidden = false;
        document.getElementById('berkunjung_ke_pasar_hewan'+val).innerHTML = `
        <br/>
        <table style="width:100%;background:white;" class="list-of-table" id="berkunjung_ke_pasar_hewan_div`+val+`">
            <tr>
                <th>
                    <div class="row">
                        <div class="col-lg-6 col-md-6">
                            <h4 style="color:`+color+`;">Berkunjung Ke Pasar Hewan</h4>
                        </div>
                        <div class="col-lg-6 col-md-6" style="text-align:right;">
                            <button class="primary-btn-ticket" type="button" onclick="add_pcr_table('berkunjung_ke_pasar_hewan',`+val+`);"> Add <i class="fas fa-plus"></i> </button>
                        </div>
                    </div>
                </th>
            </tr>
        </table>
        `;
    }else{
        document.getElementById('berkunjung_ke_pasar_hewan'+val).hidden = true;
        document.getElementById('berkunjung_ke_pasar_hewan'+val).innerHTML = '';
        berkunjung_ke_pasar_hewan = 0;
    }
}

function onchange_berkunjung_ke_pasien_dalam_pengawasan(val){
    if(document.getElementById('adult_berkunjung_ke_pasien_dalam_pengawasan'+val).value == 'IYA'){
        document.getElementById('berkunjung_ke_pasien_dalam_pengawasan'+val).hidden = false;
        document.getElementById('berkunjung_ke_pasien_dalam_pengawasan'+val).innerHTML = `
        <br/>
        <table style="width:100%;background:white;" class="list-of-table" id="berkunjung_ke_pasien_dalam_pengawasan_div`+val+`">
            <tr>
                <th>
                    <div class="row">
                        <div class="col-lg-6 col-md-6">
                            <h4 style="color:`+color+`;">Berkunjung Ke Pasien Dalam Pengawasan Covid-19</h4>
                        </div>
                        <div class="col-lg-6 col-md-6" style="text-align:right;">
                            <button class="primary-btn-ticket" type="button" onclick="add_pcr_table('berkunjung_ke_pasien_dalam_pengawasan',`+val+`);"> Add <i class="fas fa-plus"></i> </button>
                        </div>
                    </div>
                </th>
            </tr>
        </table>
        `;
    }else{
        document.getElementById('berkunjung_ke_pasien_dalam_pengawasan'+val).hidden = true;
        document.getElementById('berkunjung_ke_pasien_dalam_pengawasan'+val).innerHTML = '';
        berkunjung_ke_pasien_dalam_pengawasan = 0;
    }
}

function onchange_berkunjung_ke_pasien_konfirmasi(val){
    if(document.getElementById('adult_berkunjung_ke_pasien_konfirmasi'+val).value == 'IYA'){
        document.getElementById('berkunjung_ke_pasien_konfirmasi'+val).hidden = false;
        document.getElementById('berkunjung_ke_pasien_konfirmasi'+val).innerHTML = `
        <br/>
        <table style="width:100%;background:white;" class="list-of-table" id="berkunjung_ke_pasien_konfirmasi_div`+val+`">
            <tr>
                <th>
                    <div class="row">
                        <div class="col-lg-6 col-md-6">
                            <h4 style="color:`+color+`;">Berkunjung Ke Pasien Positif Covid-19</h4>
                        </div>
                        <div class="col-lg-6 col-md-6" style="text-align:right;">
                            <button class="primary-btn-ticket" type="button" onclick="add_pcr_table('berkunjung_ke_pasien_konfirmasi',`+val+`);"> Add <i class="fas fa-plus"></i> </button>
                        </div>
                    </div>
                </th>
            </tr>
        </table>
        `;
    }else{
        document.getElementById('berkunjung_ke_pasien_konfirmasi'+val).hidden = true;
        document.getElementById('berkunjung_ke_pasien_konfirmasi'+val).innerHTML = '';
        berkunjung_ke_pasien_konfirmasi = 0;
    }
}

function add_pcr_table(type, val){
    var node = document.createElement("tr");
    var text = '';
    if(type == 'perjalanan_keluar_negeri'){
        text = `<tr>
                    <td style="padding-top:20px; padding-bottom:15px;">
                        <div class="row">
                            <div class="col-lg-3 col-md-3">
                                <div style="margin-bottom:5px;">
                                    <label>Nama Negara</label><br/>
                                    <input type="text" class="form-control" name="adult_perjalanan_keluar_negeri_nama_negara`+val+`_`+perjalanan_keluar_negeri+`" id="adult_perjalanan_keluar_negeri_nama_negara`+val+`_`+perjalanan_keluar_negeri+`" placeholder="Nama Negara " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Nama Negara '" autocomplete="off">
                                </div>
                            </div>
                            <div class="col-lg-3 col-md-3">
                                <div style="margin-bottom:5px;">
                                    <label>Nama Kota</label><br/>
                                    <input type="text" class="form-control" name="adult_perjalanan_keluar_negeri_nama_kota`+val+`_`+perjalanan_keluar_negeri+`" id="adult_perjalanan_keluar_negeri_nama_kota`+val+`_`+perjalanan_keluar_negeri+`" placeholder="Nama Kota " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Nama Kota '" autocomplete="off">
                                </div>
                            </div>
                            <div class="col-lg-3 col-md-3">
                                <div style="margin-bottom:5px;">
                                    <label>Tanggal Perjalanan</label><br/>
                                    <input type="text" class="form-control date-picker-birth" name="adult_perjalanan_keluar_negeri_tanggal_perjalanan`+val+`_`+perjalanan_keluar_negeri+`" id="adult_perjalanan_keluar_negeri_tanggal_perjalanan`+val+`_`+perjalanan_keluar_negeri+`" placeholder="Tanggal Perjalanan " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Tanggal Perjalanan '" autocomplete="off">
                                </div>
                            </div>
                            <div class="col-lg-3 col-md-3">
                                <div style="margin-bottom:5px;">
                                    <label>Tiba Di Indonesia</label><br/>
                                    <input type="text" class="form-control date-picker-birth" name="adult_perjalanan_keluar_negeri_tiba_di_indonesia`+val+`_`+perjalanan_keluar_negeri+`" id="adult_perjalanan_keluar_negeri_tiba_di_indonesia`+val+`_`+perjalanan_keluar_negeri+`" placeholder="Tanggal Tiba di Indonesia " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Tanggal Tiba di Indonesia '" autocomplete="off">
                                </div>
                            </div>
                            <div class="col-lg-12" style="text-align:right;">
                                <button class="primary-btn-cancel" type="button" onclick="delete_pcr_table('perjalanan_keluar_negeri',`+val+`,`+perjalanan_keluar_negeri+`)"> Delete <i class="fas fa-trash"></i> </button>
                            </div>
                        </div>
                    </td>
                </tr>`;
        node.innerHTML = text;
        node.setAttribute('id', 'perjalanan_keluar_negeri_table'+val+'_'+ perjalanan_keluar_negeri);
        document.getElementById("perjalanan_keluar_negeri_div"+val).appendChild(node);

        $('input[name="adult_perjalanan_keluar_negeri_tanggal_perjalanan'+val+'_'+perjalanan_keluar_negeri+'"]').daterangepicker({
              singleDatePicker: true,
              autoUpdateInput: true,
              maxDate: moment(),
              showDropdowns: true,
              opens: 'center',
              drops: 'down',
              locale: {
                  format: 'DD MMM YYYY',
              }
        });
        $('input[name="adult_perjalanan_keluar_negeri_tanggal_perjalanan'+val+'_'+perjalanan_keluar_negeri+'"]').val("");

        $('input[name="adult_perjalanan_keluar_negeri_tiba_di_indonesia'+val+'_'+perjalanan_keluar_negeri+'"]').daterangepicker({
              singleDatePicker: true,
              autoUpdateInput: true,
              showDropdowns: true,
              maxDate: moment(),
              opens: 'center',
              drops: 'down',
              locale: {
                  format: 'DD MMM YYYY',
              }
        });
        $('input[name="adult_perjalanan_keluar_negeri_tiba_di_indonesia'+val+'_'+perjalanan_keluar_negeri+'"]').val("");

        perjalanan_keluar_negeri++;
    }else if(type == 'perjalanan_ke_transmisi_lokal'){
        text = `<tr>
                    <td style="padding-top:20px; padding-bottom:15px;">
                        <div class="row">
                            <div class="col-lg-3 col-md-3">
                                <div style="margin-bottom:5px;">
                                    <label>Nama Provinsi</label><br/>
                                    <input type="text" class="form-control" name="adult_perjalanan_ke_transmisi_lokal_nama_provinsi`+val+`_`+perjalanan_ke_transmisi_lokal+`" id="adult_perjalanan_ke_transmisi_lokal_nama_provinsi`+val+`_`+perjalanan_ke_transmisi_lokal+`" placeholder="Nama Provinsi " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Nama Provinsi '" autocomplete="off">
                                </div>
                            </div>
                            <div class="col-lg-3 col-md-3">
                                <div style="margin-bottom:5px;">
                                    <label>Nama Kota</label><br/>
                                    <input type="text" class="form-control" name="adult_perjalanan_ke_transmisi_lokal_nama_kota`+val+`_`+perjalanan_ke_transmisi_lokal+`" id="adult_perjalanan_ke_transmisi_lokal_nama_kota`+val+`_`+perjalanan_ke_transmisi_lokal+`" placeholder="Nama Kota " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Nama Kota '" autocomplete="off">
                                </div>
                            </div>
                            <div class="col-lg-3 col-md-3">
                                <div style="margin-bottom:5px;">
                                    <label>Tanggal Perjalanan</label><br/>
                                    <input type="text" class="form-control date-picker-birth" name="adult_perjalanan_ke_transmisi_lokal_tanggal_perjalanan`+val+`_`+perjalanan_ke_transmisi_lokal+`" id="adult_perjalanan_ke_transmisi_lokal_tanggal_perjalanan`+val+`_`+perjalanan_ke_transmisi_lokal+`" placeholder="Tanggal Perjalanan " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Tanggal Perjalanan '" autocomplete="off">
                                </div>
                            </div>
                            <div class="col-lg-3 col-md-3">
                                <div style="margin-bottom:5px;">
                                    <label>Tiba Di Sini</label><br/>
                                    <input type="text" class="form-control date-picker-birth" name="adult_perjalanan_ke_transmisi_lokal_tiba_di_sini`+val+`_`+perjalanan_ke_transmisi_lokal+`" id="adult_perjalanan_ke_transmisi_lokal_tiba_di_sini`+val+`_`+perjalanan_ke_transmisi_lokal+`" placeholder="Tanggal Tiba Di Sini " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Tanggal Tiba Di Sini '" autocomplete="off">
                                </div>
                            </div>
                            <div class="col-lg-12" style="text-align:right;">
                                <button class="primary-btn-cancel" type="button" onclick="delete_pcr_table('perjalanan_ke_transmisi_lokal',`+val+`,`+perjalanan_ke_transmisi_lokal+`)"> Delete <i class="fas fa-trash"></i> </button>
                            </div>
                        </div>
                    </td>
                </tr>`;
        node.innerHTML = text;
        node.setAttribute('id', 'perjalanan_ke_transmisi_lokal_table'+val+'_'+ perjalanan_ke_transmisi_lokal);
        document.getElementById("perjalanan_ke_transmisi_lokal_div"+val).appendChild(node);
        $('input[name="adult_perjalanan_ke_transmisi_lokal_tanggal_perjalanan'+val+'_'+perjalanan_ke_transmisi_lokal+'"]').daterangepicker({
              singleDatePicker: true,
              autoUpdateInput: true,
              showDropdowns: true,
              maxDate: moment(),
              opens: 'center',
              drops: 'down',
              locale: {
                  format: 'DD MMM YYYY',
              }
        });
        $('input[name="adult_perjalanan_ke_transmisi_lokal_tanggal_perjalanan'+val+'_'+perjalanan_ke_transmisi_lokal+'"]').val("");

        $('input[name="adult_perjalanan_ke_transmisi_lokal_tiba_di_sini'+val+'_'+perjalanan_ke_transmisi_lokal+'"]').daterangepicker({
              singleDatePicker: true,
              autoUpdateInput: true,
              showDropdowns: true,
              maxDate: moment(),
              opens: 'center',
              drops: 'down',
              locale: {
                  format: 'DD MMM YYYY',
              }
        });
        $('input[name="adult_perjalanan_ke_transmisi_lokal_tiba_di_sini'+val+'_'+perjalanan_ke_transmisi_lokal+'"]').val("");

        perjalanan_ke_transmisi_lokal++;
    }else if(type == 'berkunjung_ke_fasilitas_kesehatan'){
        text = `<tr>
                    <td style="padding-top:20px; padding-bottom:15px;">
                        <div class="row">
                            <div class="col-lg-3 col-md-3">
                                <div style="margin-bottom:5px;">
                                    <label>Nama Rumah Sakit</label><br/>
                                    <input type="text" class="form-control" name="adult_berkunjung_ke_fasilitas_kesehatan_nama_rumah_sakit`+val+`_`+berkunjung_ke_fasilitas_kesehatan+`" id="adult_berkunjung_ke_fasilitas_kesehatan_nama_rumah_sakit`+val+`_`+berkunjung_ke_fasilitas_kesehatan+`" placeholder="Nama Rumah Sakit " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Nama Rumah Sakit '" autocomplete="off">
                                </div>
                            </div>
                            <div class="col-lg-3 col-md-3">
                                <div style="margin-bottom:5px;">
                                    <label>Nama Kota</label><br/>
                                    <input type="text" class="form-control" name="adult_berkunjung_ke_fasilitas_kesehatan_nama_kota`+val+`_`+berkunjung_ke_fasilitas_kesehatan+`" id="adult_berkunjung_ke_fasilitas_kesehatan_nama_kota`+val+`_`+berkunjung_ke_fasilitas_kesehatan+`" placeholder="Nama Kota " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Nama Kota '" autocomplete="off">
                                </div>
                            </div>
                            <div class="col-lg-3 col-md-3">
                                <div style="margin-bottom:5px;">
                                    <label>Nama Provinsi</label><br/>
                                    <input type="text" class="form-control" name="adult_berkunjung_ke_fasilitas_kesehatan_nama_provinsi`+val+`_`+berkunjung_ke_fasilitas_kesehatan+`" id="adult_berkunjung_ke_fasilitas_kesehatan_nama_provinsi`+val+`_`+berkunjung_ke_fasilitas_kesehatan+`" placeholder="Nama Provinsi " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Nama Provinsi '" autocomplete="off">
                                </div>
                            </div>
                            <div class="col-lg-3 col-md-3">
                                <div style="margin-bottom:5px;">
                                    <label>Tanggal Kunjungan</label><br/>
                                    <input type="text" class="form-control date-picker-birth" name="adult_berkunjung_ke_fasilitas_kesehatan_tanggal_kunjungan`+val+`_`+berkunjung_ke_fasilitas_kesehatan+`" id="adult_berkunjung_ke_fasilitas_kesehatan_tanggal_kunjungan`+val+`_`+berkunjung_ke_fasilitas_kesehatan+`" placeholder="Tanggal Kunjungan " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Tanggal Kunjungan '" autocomplete="off">
                                </div>
                            </div>
                            <div class="col-lg-12" style="text-align:right;">
                                <button class="primary-btn-cancel" type="button" onclick="delete_pcr_table('berkunjung_ke_fasilitas_kesehatan',`+val+`,`+berkunjung_ke_fasilitas_kesehatan+`)"> Delete <i class="fas fa-trash"></i> </button>
                            </div>
                        </div>
                    </td>
                </tr>`;
        node.innerHTML = text;
        node.setAttribute('id', 'berkunjung_ke_fasilitas_kesehatan_table'+val+'_'+ berkunjung_ke_fasilitas_kesehatan);
        document.getElementById("berkunjung_ke_fasilitas_kesehatan_div"+val).appendChild(node);

        $('input[name="adult_berkunjung_ke_fasilitas_kesehatan_tanggal_kunjungan'+val+'_'+berkunjung_ke_fasilitas_kesehatan+'"]').daterangepicker({
              singleDatePicker: true,
              autoUpdateInput: true,
              showDropdowns: true,
              maxDate: moment(),
              opens: 'center',
              drops: 'down',
              locale: {
                  format: 'DD MMM YYYY',
              }
        });
        $('input[name="adult_berkunjung_ke_fasilitas_kesehatan_tanggal_kunjungan'+val+'_'+berkunjung_ke_fasilitas_kesehatan+'"]').val("");

        berkunjung_ke_fasilitas_kesehatan++;
    }else if(type == 'berkunjung_ke_pasar_hewan'){
        text = `<tr>
                    <td style="padding-top:20px; padding-bottom:15px;">
                        <div class="row">
                            <div class="col-lg-3 col-md-3">
                                <div style="margin-bottom:5px;">
                                    <label>Nama Lokasi Pasar</label><br/>
                                    <input type="text" class="form-control" name="adult_berkunjung_ke_pasar_hewan_nama_lokasi_pasar`+val+`_`+berkunjung_ke_pasar_hewan+`" id="adult_berkunjung_ke_pasar_hewan_nama_lokasi_pasar`+val+`_`+berkunjung_ke_pasar_hewan+`" placeholder="Nama Lokasi " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Nama Lokasi '" autocomplete="off">
                                </div>
                            </div>
                            <div class="col-lg-3 col-md-3">
                                <div style="margin-bottom:5px;">
                                    <label>Nama Kota</label><br/>
                                    <input type="text" class="form-control" name="adult_berkunjung_ke_pasar_hewan_nama_kota`+val+`_`+berkunjung_ke_pasar_hewan+`" id="adult_berkunjung_ke_pasar_hewan_nama_kota`+val+`_`+berkunjung_ke_pasar_hewan+`" placeholder="Nama Kota " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Nama Kota '" autocomplete="off">
                                </div>
                            </div>
                            <div class="col-lg-3 col-md-3">
                                <div style="margin-bottom:5px;">
                                    <label>Nama Provinsi</label><br/>
                                    <input type="text" class="form-control" name="adult_berkunjung_ke_pasar_hewan_nama_provinsi`+val+`_`+berkunjung_ke_pasar_hewan+`" id="adult_berkunjung_ke_pasar_hewan_nama_provinsi`+val+`_`+berkunjung_ke_pasar_hewan+`" placeholder="Nama Provinsi " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Nama Provinsi '" autocomplete="off">
                                </div>
                            </div>
                            <div class="col-lg-3 col-md-3">
                                <div style="margin-bottom:5px;">
                                    <label>Tanggal Kunjungan</label><br/>
                                    <input type="text" class="form-control date-picker-birth" name="adult_berkunjung_ke_pasar_hewan_tanggal_kunjungan`+val+`_`+berkunjung_ke_pasar_hewan+`" id="adult_berkunjung_ke_pasar_hewan_tanggal_kunjungan`+val+`_`+berkunjung_ke_pasar_hewan+`" placeholder="Tanggal Kunjungan " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Tanggal Kunjungan '" autocomplete="off">
                                </div>
                            </div>
                            <div class="col-lg-12" style="text-align:right;">
                                <button class="primary-btn-cancel" type="button" onclick="delete_pcr_table('berkunjung_ke_pasar_hewan',`+val+`,`+berkunjung_ke_pasar_hewan+`)"> Delete <i class="fas fa-trash"></i> </button>
                            </div>
                        </div>
                    </td>
                </tr>`;
        node.innerHTML = text;
        node.setAttribute('id', 'berkunjung_ke_pasar_hewan_table'+val+'_'+ berkunjung_ke_pasar_hewan);
        document.getElementById("berkunjung_ke_pasar_hewan_div"+val).appendChild(node);

        $('input[name="adult_berkunjung_ke_pasar_hewan_tanggal_kunjungan'+val+'_'+berkunjung_ke_pasar_hewan+'"]').daterangepicker({
              singleDatePicker: true,
              autoUpdateInput: true,
              showDropdowns: true,
              maxDate: moment(),
              opens: 'center',
              drops: 'down',
              locale: {
                  format: 'DD MMM YYYY',
              }
        });
        $('input[name="adult_berkunjung_ke_pasar_hewan_tanggal_kunjungan'+val+'_'+berkunjung_ke_pasar_hewan+'"]').val("");

        berkunjung_ke_pasar_hewan++;
    }else if(type == 'berkunjung_ke_pasien_dalam_pengawasan'){
        text = `<tr>
                    <td style="padding-top:20px; padding-bottom:15px;">
                        <div class="row">
                            <div class="col-lg-4 col-md-4">
                                <div style="margin-bottom:5px;">
                                    <label>Nama Pasien</label><br/>
                                    <input type="text" class="form-control" name="adult_berkunjung_ke_pasien_dalam_pengawasan_nama_pasien`+val+`_`+berkunjung_ke_pasien_dalam_pengawasan+`" id="adult_berkunjung_ke_pasien_dalam_pengawasan_nama_pasien`+val+`_`+berkunjung_ke_pasien_dalam_pengawasan+`" placeholder="Nama Pasien " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Nama Pasien '" autocomplete="off">
                                </div>
                            </div>
                            <div class="col-lg-4 col-md-4">
                                <div style="margin-bottom:5px;">
                                    <label>Alamat</label><br/>
                                    <input type="text" class="form-control" name="adult_berkunjung_ke_pasien_dalam_pengawasan_alamat`+val+`_`+berkunjung_ke_pasien_dalam_pengawasan+`" id="adult_berkunjung_ke_pasien_dalam_pengawasan_alamat`+val+`_`+berkunjung_ke_pasien_dalam_pengawasan+`" placeholder="Alamat " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Alamat '" autocomplete="off">
                                </div>
                            </div>
                            <div class="col-lg-4 col-md-4">
                                <div style="margin-bottom:5px;">
                                    <label>Hubungan</label><br/>
                                    <input type="text" class="form-control" name="adult_berkunjung_ke_pasien_dalam_pengawasan_hubungan`+val+`_`+berkunjung_ke_pasien_dalam_pengawasan+`" id="adult_berkunjung_ke_pasien_dalam_pengawasan_hubungan`+val+`_`+berkunjung_ke_pasien_dalam_pengawasan+`" placeholder="Hubungan " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Hubungan '" autocomplete="off">
                                </div>
                            </div>
                            <div class="col-lg-6 col-md-6">
                                <div style="margin-bottom:5px;">
                                    <label>Tanggal Kontak Pertama</label><br/>
                                    <input type="text" class="form-control date-picker-birth" name="adult_berkunjung_ke_pasien_dalam_pengawasan_tanggal_kontak_pertama`+val+`_`+berkunjung_ke_pasien_dalam_pengawasan+`" id="adult_berkunjung_ke_pasien_dalam_pengawasan_tanggal_kontak_pertama`+val+`_`+berkunjung_ke_pasien_dalam_pengawasan+`" placeholder="Tanggal Pertama Bertemu " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Tanggal Pertama Bertemu '" autocomplete="off">
                                </div>
                            </div>
                            <div class="col-lg-6 col-md-6">
                                <div style="margin-bottom:5px;">
                                    <label>Tanggal Kontak Terakhir</label><br/>
                                    <input type="text" class="form-control date-picker-birth" name="adult_berkunjung_ke_pasien_dalam_pengawasan_tanggal_kontak_terakhir`+val+`_`+berkunjung_ke_pasien_dalam_pengawasan+`" id="adult_berkunjung_ke_pasien_dalam_pengawasan_tanggal_kontak_terakhir`+val+`_`+berkunjung_ke_pasien_dalam_pengawasan+`" placeholder="Tanggal Terakhir Bertemu " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Tanggal Terakhir Bertemu '" autocomplete="off">
                                </div>
                            </div>
                            <div class="col-lg-12" style="text-align:right;">
                                <button class="primary-btn-cancel" type="button" onclick="delete_pcr_table('berkunjung_ke_pasien_dalam_pengawasan',`+val+`,`+berkunjung_ke_pasien_dalam_pengawasan+`)"> Delete <i class="fas fa-trash"></i> </button>
                            </div>
                        </div>
                    </td>
                </tr>`;
        node.innerHTML = text;
        node.setAttribute('id', 'berkunjung_ke_pasien_dalam_pengawasan_table'+val+'_'+ berkunjung_ke_pasien_dalam_pengawasan);
        document.getElementById("berkunjung_ke_pasien_dalam_pengawasan_div"+val).appendChild(node);

        $('input[name="adult_berkunjung_ke_pasien_dalam_pengawasan_tanggal_kontak_pertama'+val+'_'+berkunjung_ke_pasien_dalam_pengawasan+'"]').daterangepicker({
              singleDatePicker: true,
              autoUpdateInput: true,
              showDropdowns: true,
              maxDate: moment(),
              opens: 'center',
              drops: 'down',
              locale: {
                  format: 'DD MMM YYYY',
              }
        });
        $('input[name="adult_berkunjung_ke_pasien_dalam_pengawasan_tanggal_kontak_pertama'+val+'_'+berkunjung_ke_pasien_dalam_pengawasan+'"]').val("");

        $('input[name="adult_berkunjung_ke_pasien_dalam_pengawasan_tanggal_kontak_terakhir'+val+'_'+berkunjung_ke_pasien_dalam_pengawasan+'"]').daterangepicker({
              singleDatePicker: true,
              autoUpdateInput: true,
              showDropdowns: true,
              maxDate: moment(),
              opens: 'center',
              drops: 'down',
              locale: {
                  format: 'DD MMM YYYY',
              }
        });
        $('input[name="adult_berkunjung_ke_pasien_dalam_pengawasan_tanggal_kontak_terakhir'+val+'_'+berkunjung_ke_pasien_dalam_pengawasan+'"]').val("");
        berkunjung_ke_pasien_dalam_pengawasan++;
    }else if(type == 'berkunjung_ke_pasien_konfirmasi'){
        text = `<tr>
                    <td style="padding-top:20px; padding-bottom:15px;">
                        <div class="row">
                            <div class="col-lg-4 col-md-4">
                                <div style="margin-bottom:5px;">
                                    <label>Nama Pasien</label><br/>
                                    <input type="text" class="form-control" name="adult_berkunjung_ke_pasien_konfirmasi_nama_pasien`+val+`_`+berkunjung_ke_pasien_konfirmasi+`" id="adult_berkunjung_ke_pasien_konfirmasi_nama_pasien`+val+`_`+berkunjung_ke_pasien_konfirmasi+`" placeholder="Nama Pasien " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Nama Pasien '" autocomplete="off">
                                </div>
                            </div>
                            <div class="col-lg-4 col-md-4">
                                <div style="margin-bottom:5px;">
                                    <label>Alamat</label><br/>
                                    <input type="text" class="form-control" name="adult_berkunjung_ke_pasien_konfirmasi_alamat`+val+`_`+berkunjung_ke_pasien_konfirmasi+`" id="adult_berkunjung_ke_pasien_konfirmasi_alamat`+val+`_`+berkunjung_ke_pasien_konfirmasi+`" placeholder="Alamat " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Alamat '" autocomplete="off">
                                </div>
                            </div>
                            <div class="col-lg-4 col-md-4">
                                <div style="margin-bottom:5px;">
                                    <label>Hubungan</label><br/>
                                    <input type="text" class="form-control" name="adult_berkunjung_ke_pasien_konfirmasi_hubungan`+val+`_`+berkunjung_ke_pasien_konfirmasi+`" id="adult_berkunjung_ke_pasien_konfirmasi_hubungan`+val+`_`+berkunjung_ke_pasien_konfirmasi+`" placeholder="Hubungan " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Hubungan '" autocomplete="off">
                                </div>
                            </div>
                            <div class="col-lg-6 col-md-6">
                                <div style="margin-bottom:5px;">
                                    <label>Tanggal Kontak Pertama</label><br/>
                                    <input type="text" class="form-control date-picker-birth" name="adult_berkunjung_ke_pasien_konfirmasi_tanggal_kontak_pertama`+val+`_`+berkunjung_ke_pasien_konfirmasi+`" id="adult_berkunjung_ke_pasien_konfirmasi_tanggal_kontak_pertama`+val+`_`+berkunjung_ke_pasien_konfirmasi+`" placeholder="Tanggal Pertama Bertemu " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Tanggal Pertama Bertemu '" autocomplete="off">
                                </div>
                            </div>
                            <div class="col-lg-6 col-md-6">
                                <div style="margin-bottom:5px;">
                                    <label>Tanggal Kontak Terakhir</label><br/>
                                    <input type="text" class="form-control date-picker-birth" name="adult_berkunjung_ke_pasien_konfirmasi_tanggal_kontak_terakhir`+val+`_`+berkunjung_ke_pasien_konfirmasi+`" id="adult_berkunjung_ke_pasien_konfirmasi_tanggal_kontak_terakhir`+val+`_`+berkunjung_ke_pasien_konfirmasi+`" placeholder="Tanggal Terakhir Bertemu " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Tanggal Terakhir Bertemu '" autocomplete="off">
                                </div>
                            </div>
                            <div class="col-lg-12" style="text-align:right;">
                                <button class="primary-btn-cancel" type="button" onclick="delete_pcr_table('berkunjung_ke_pasien_konfirmasi',`+val+`,`+berkunjung_ke_pasien_konfirmasi+`)"> Delete <i class="fas fa-trash"></i> </button>
                            </div>
                        </div>
                    </td>
                </tr>`;
        node.innerHTML = text;
        node.setAttribute('id', 'berkunjung_ke_pasien_konfirmasi_table'+val+'_'+ berkunjung_ke_pasien_konfirmasi);
        document.getElementById("berkunjung_ke_pasien_konfirmasi_div"+val).appendChild(node);

        $('input[name="adult_berkunjung_ke_pasien_konfirmasi_tanggal_kontak_pertama'+val+'_'+berkunjung_ke_pasien_konfirmasi+'"]').daterangepicker({
              singleDatePicker: true,
              autoUpdateInput: true,
              showDropdowns: true,
              maxDate: moment(),
              opens: 'center',
              drops: 'down',
              locale: {
                  format: 'DD MMM YYYY',
              }
        });
        $('input[name="adult_berkunjung_ke_pasien_konfirmasi_tanggal_kontak_pertama'+val+'_'+berkunjung_ke_pasien_konfirmasi+'"]').val("");

        $('input[name="adult_berkunjung_ke_pasien_konfirmasi_tanggal_kontak_terakhir'+val+'_'+berkunjung_ke_pasien_konfirmasi+'"]').daterangepicker({
              singleDatePicker: true,
              autoUpdateInput: true,
              showDropdowns: true,
              maxDate: moment(),
              opens: 'center',
              drops: 'down',
              locale: {
                  format: 'DD MMM YYYY',
              }
        });
        $('input[name="adult_berkunjung_ke_pasien_konfirmasi_tanggal_kontak_terakhir'+val+'_'+berkunjung_ke_pasien_konfirmasi+'"]').val("");
        berkunjung_ke_pasien_konfirmasi++;
    }
}

function delete_pcr_table(type, val, nomor_table){
    try{
        var element = document.getElementById(type+'_table'+val+'_'+ nomor_table);
        element.parentNode.removeChild(element);
    }catch(err){}

}

function onchange_title(val){
    try{
        if(document.getElementById('adult_title'+val).value != 'MR'){
            document.getElementById('adult_hamil_div'+val).hidden = false;
        }else{
            document.getElementById('adult_hamil_div'+val).hidden = true;
        }
    }catch(err){}
}

function change_kriteria(val){
    console.log('here');
    if(document.getElementById('adult_kriteria_pasien'+val).value != ''){
        document.getElementById('detail_kriteria'+val).hidden = false;
        for(i in medical_config.result.response.kriteria_pasien){
            if(document.getElementById('adult_kriteria_pasien'+val).value == medical_config.result.response.kriteria_pasien[i].name){
                document.getElementById('detail_kriteria'+val).innerHTML = medical_config.result.response.kriteria_pasien[i].html;
                break;
            }
        }
    }else{
        document.getElementById('detail_kriteria'+val).hidden = true;
        document.getElementById('detail_kriteria'+val).innerHTML = '';
    }
}


function clear_date(id){
    document.getElementById(id).value = '';
}
function delete_type(type, val){
    if(type.includes('ktp')){
        if(type.includes('kabupaten')){
            $('#adult_kabupaten_ktp'+val+'_id').val('');
            document.getElementById('select2-adult_kabupaten_ktp'+val+'_id-container').innerHTML = 'Select Kabupaten KTP';
            text = `<option value="">Select Kecamatan KTP</option>`;
            document.getElementById('adult_kecamatan_ktp'+val+'_id').innerHTML = text;
            document.getElementById('select2-adult_kecamatan_ktp'+val+'_id-container').innerHTML = 'Select Kecamatan KTP';
            $('#adult_kecamatan_ktp'+val+'_id').select2();
            $('#adult_kecamatan_ktp'+val+'_id').val('');
            text = `<option value="">Select Kelurahan KTP</option>`;
            document.getElementById('adult_kelurahan_ktp'+val+'_id').innerHTML = text;
            $('#adult_kelurahan_ktp'+val+'_id').select2();
            document.getElementById('adult_kabupaten_ktp'+val).value = '';
            document.getElementById('adult_kecamatan_ktp'+val).value = '';
        }
        if(type.includes('kecamatan')){
            $('#adult_kecamatan_ktp'+val+'_id').val('');
            document.getElementById('select2-adult_kecamatan_ktp'+val+'_id-container').innerHTML = 'Select Kecamatan KTP';
            text = `<option value="">Select Kelurahan KTP</option>`;
            document.getElementById('adult_kelurahan_ktp'+val+'_id').innerHTML = text;
            $('#adult_kelurahan_ktp'+val+'_id').select2();
            document.getElementById('adult_kecamatan_ktp'+val).value = '';
        }
        $('#adult_kelurahan_ktp'+val+'_id').val('');
        document.getElementById('select2-adult_kelurahan_ktp'+val+'_id-container').innerHTML = 'Select Kelurahan KTP';
        document.getElementById('adult_kelurahan_ktp'+val).value = '';
    }else{
        if(type.includes('kabupaten')){
            $('#adult_kabupaten'+val+'_id').val('');
            document.getElementById('select2-adult_kabupaten'+val+'_id-container').innerHTML = 'Select Kabupaten';
            text = `<option value="">Select Kecamatan</option>`;
            document.getElementById('adult_kecamatan'+val+'_id').innerHTML = text;
            document.getElementById('select2-adult_kecamatan'+val+'_id-container').innerHTML = 'Select Kecamatan';
            $('#adult_kecamatan'+val+'_id').select2();
            $('#adult_kecamatan'+val+'_id').val('');
            text = `<option value="">Select Kelurahan</option>`;
            document.getElementById('adult_kelurahan'+val+'_id').innerHTML = text;
            $('#adult_kelurahan'+val+'_id').select2();

        }
        if(type.includes('kecamatan')){
            $('#adult_kecamatan'+val+'_id').val('');
            document.getElementById('select2-adult_kecamatan'+val+'_id-container').innerHTML = 'Select Kecamatan';
            text = `<option value="">Select Kelurahan</option>`;
            document.getElementById('adult_kelurahan'+val+'_id').innerHTML = text;
            $('#adult_kelurahan'+val+'_id').select2();
        }
        $('#adult_kelurahan'+val+'_id').val('');
        document.getElementById('select2-adult_kelurahan'+val+'_id-container').innerHTML = 'Select Kelurahan';
    }
    //auto_change_copy_to_ktp(val);
}

function auto_change_copy_to_ktp(val){
    var radios = document.getElementsByName('adult_copy'+val);
    for(i=0, length = radios.length; i < length; i++){
        if(radios[i].checked){
            if(radios[i].value == 'true'){
                copy_ktp(val);
            }
            break;
        }
    }
}

function copy_ktp(val){
    var radios = document.getElementsByName('adult_copy'+val);
    for(i=0, length = radios.length; i < length; i++){
        if(radios[i].checked){
            if(radios[i].value == 'true'){
                document.getElementById('adult_address'+val).value = document.getElementById('adult_address_ktp'+val).value;
                document.getElementById('adult_address'+val).readOnly = true;
                document.getElementById('adult_rt'+val).value = document.getElementById('adult_rt_ktp'+val).value;
                document.getElementById('adult_rt'+val).readOnly = true;
                document.getElementById('adult_rw'+val).value = document.getElementById('adult_rw_ktp'+val).value;
                document.getElementById('adult_rw'+val).readOnly = true;
                document.getElementById('adult_kecamatan'+val).innerHTML = document.getElementById('adult_kecamatan_ktp'+val).innerHTML
                document.getElementById('adult_kelurahan'+val).innerHTML = document.getElementById('adult_kelurahan_ktp'+val).innerHTML
                $('#adult_kabupaten'+val+'_id').select2();
                $('#adult_kecamatan'+val+'_id').select2();
                $('#adult_kelurahan'+val+'_id').select2();
                $('#adult_kabupaten'+val).val(document.getElementById('adult_kabupaten_ktp'+val).value);
                document.getElementById('select2-adult_kabupaten'+val+'_id-container').innerHTML = document.getElementById('adult_kabupaten_ktp'+val).value;
                document.getElementById('adult_kabupaten'+val+'_id').disabled = true

                $('#adult_kecamatan'+val).val(document.getElementById('adult_kecamatan_ktp'+val).value);
                $('#adult_kecamatan'+val+'_id').val(document.getElementById('adult_kecamatan_ktp'+val).value);
                document.getElementById('select2-adult_kecamatan'+val+'_id-container').innerHTML = document.getElementById('adult_kecamatan_ktp'+val).value;
                document.getElementById('adult_kecamatan'+val+'_id').disabled = true

                $('#adult_kelurahan'+val).val(document.getElementById('adult_kelurahan_ktp'+val).value);
                $('#adult_kelurahan'+val+'_id').val(document.getElementById('adult_kelurahan_ktp'+val).value);
                document.getElementById('select2-adult_kelurahan'+val+'_id-container').innerHTML = document.getElementById('adult_kelurahan_ktp'+val).value;
                document.getElementById('adult_kelurahan'+val+'_id').disabled = true

            }else if(radios[i].value == 'false'){
                document.getElementById('adult_address'+val).value = '';
                document.getElementById('adult_address'+val).readOnly = false;
                document.getElementById('adult_rt'+val).value = '';
                document.getElementById('adult_rt'+val).readOnly = false;
                document.getElementById('adult_rw'+val).value = '';
                document.getElementById('adult_rw'+val).readOnly = false;
                $('#adult_kabupaten'+val+'_id').val('');
                document.getElementById('select2-adult_kabupaten'+val+'_id-container').innerHTML = 'Select Kabupaten';
                text = `<option value="">Select Kecamatan</option>`;
                document.getElementById('adult_kecamatan'+val+'_id').innerHTML = text;
                document.getElementById('select2-adult_kecamatan'+val+'_id-container').innerHTML = 'Select Kecamatan';
                $('#adult_kecamatan'+val+'_id').select2();
                $('#adult_kecamatan'+val+'_id').val('');
                text = `<option value="">Select Kelurahan</option>`;
                document.getElementById('adult_kelurahan'+val+'_id').innerHTML = text;
                $('#adult_kelurahan'+val+'_id').select2();
                $('#adult_kelurahan'+val+'_id').val('');
                document.getElementById('select2-adult_kelurahan'+val+'_id-container').innerHTML = 'Select Kelurahan';
                document.getElementById('adult_kabupaten'+val+'_id').disabled = false;
                document.getElementById('adult_kecamatan'+val+'_id').disabled = false;
                document.getElementById('adult_kelurahan'+val+'_id').disabled = false;
            }
            break;
        }
    }
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
          drops: 'down',
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
              drops: 'down',
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
              drops: 'down',
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
            if(medical_config.result.response.golongan_darah[i].code == 'NA')
                option += `<option value="`+medical_config.result.response.golongan_darah[i].code+`" selected>`+medical_config.result.response.golongan_darah[i].value+`</option>`;
            else
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
    document.getElementById( "inp_kec_domis_blmpernah_" + counter_passenger ).setAttribute( "onChange", "javascript: get_kelurahan('inp_kec_domis_blmpernah_"+counter_passenger+"','inp_kelurahan_domis_blmpernah_"+counter_passenger+"');" );

    document.getElementById( "inp_kab_kot_ktp_blmpernah_" + counter_passenger ).setAttribute( "onChange", "javascript: get_kecamatan('inp_kab_kot_ktp_blmpernah_"+counter_passenger+"','inp_kec_ktp_blmpernah_"+counter_passenger+"');" );
    document.getElementById( "inp_kec_ktp_blmpernah_" + counter_passenger ).setAttribute( "onChange", "javascript: get_kelurahan('inp_kec_ktp_blmpernah_"+counter_passenger+"','inp_kelurahan_ktp_blmpernah_"+counter_passenger+"');" );

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
    if(document.getElementById('alamat_sama_'+counter).checked == true){
        document.getElementById('inp_lamat_ktp_blmpernah_'+counter).value = document.getElementById('inp_lamat_domis_blmpernah_'+counter).value;
        document.getElementById('inp_rt_ktp_blmpernah_'+counter).value = document.getElementById('inp_rt_domis_blmpernah_'+counter).value;
        document.getElementById('inp_rw_ktp_blmpernah_'+counter).value = document.getElementById('inp_rw_domis_blmpernah_'+counter).value;
        document.getElementById('inp_kab_kot_ktp_blmpernah_'+counter).value = document.getElementById('inp_kab_kot_domis_blmpernah_'+counter).value;
        document.getElementById('inp_kec_ktp_blmpernah_'+counter).innerHTML = document.getElementById('inp_kec_domis_blmpernah_'+counter).innerHTML;
        document.getElementById('inp_kelurahan_ktp_blmpernah_'+counter).innerHTML = document.getElementById('inp_kelurahan_domis_blmpernah_'+counter).innerHTML;

        if(test_type == 'swab_pcr'){
            document.getElementById('inp_lamat_ktp_blmpernah_copy_'+counter).value = document.getElementById('inp_lamat_domis_blmpernah_'+counter).value;
            document.getElementById('inp_rt_ktp_blmpernah_copy_'+counter).value = document.getElementById('inp_rt_domis_blmpernah_'+counter).value;
            document.getElementById('inp_rw_ktp_blmpernah_copy_'+counter).value = document.getElementById('inp_rw_domis_blmpernah_'+counter).value;
            document.getElementById('inp_kab_kot_ktp_blmpernah_copy_'+counter).value = document.getElementById('inp_kab_kot_domis_blmpernah_'+counter).value;
            document.getElementById('inp_kec_ktp_blmpernah_copy_'+counter).value = document.getElementById('inp_kec_domis_blmpernah_'+counter).value;
            document.getElementById('inp_kelurahan_ktp_blmpernah_copy_'+counter).value = document.getElementById('inp_kelurahan_domis_blmpernah_'+counter).value;
        }
    }else{
        document.getElementById('inp_lamat_ktp_blmpernah_'+counter).value = '';
        document.getElementById('inp_rt_ktp_blmpernah_'+counter).value = '';
        document.getElementById('inp_rw_ktp_blmpernah_'+counter).value = '';
        document.getElementById('inp_kab_kot_ktp_blmpernah_'+counter).value = '';
        document.getElementById('inp_kec_ktp_blmpernah_'+counter).innerHTML = '';
        document.getElementById('inp_kelurahan_ktp_blmpernah_'+counter).innerHTML = '';
        if(test_type == 'swab_pcr')
            document.getElementById('inp_lamat_ktp_blmpernah_copy_'+counter).value = '';
        document.getElementById('inp_rt_ktp_blmpernah_copy_'+counter).value = '';
        document.getElementById('inp_rw_ktp_blmpernah_copy_'+counter).value = '';
        document.getElementById('inp_kab_kot_ktp_blmpernah_copy_'+counter).value = '';
        document.getElementById('inp_kec_ktp_blmpernah_copy_'+counter).innerHTML = '';
        document.getElementById('inp_kelurahan_ktp_blmpernah_copy_'+counter).innerHTML = '';
    }
//    inp_lamat_domis_blmpernah_0
//    inp_rt_domis_blmpernah_0
//    inp_rw_domis_blmpernah_0
//    inp_kab_kot_domis_blmpernah_0
//    inp_kec_domis_blmpernah_0
//    inp_kelurahan_domis_blmpernah_0
}

function delete_table_of_passenger(counter){
    if(counter_passenger != 0){
        try{
            var element = document.getElementById('table_passenger'+counter);
            var element_modal = document.getElementById('modal_passenger'+counter);
            element.parentNode.removeChild(element);
            element_modal.parentNode.removeChild(element);
        }catch(err){}
    }
}

function update_contact(type,val){
    if(type == 'booker'){
        if(document.getElementById('booker_title').value != '' && document.getElementById('booker_first_name').value != '' && document.getElementById('booker_last_name').value != '')
            document.getElementById('contact_person').value = document.getElementById('booker_title').value + ' ' + document.getElementById('booker_first_name').value + ' ' + document.getElementById('booker_last_name').value;
    }else if(type == 'passenger'){
        if(document.getElementById('adult_title'+val).value != '')
            document.getElementById('name_pax'+parseInt(val-1)).innerHTML = '<i><b>Name: </b>'+document.getElementById('adult_title'+val).value + '</i> ';
        if(document.getElementById('adult_first_name'+val).value != '')
            document.getElementById('name_pax'+parseInt(val-1)).innerHTML += '<i>'+document.getElementById('adult_first_name'+val).value + '</i> ';
        if(document.getElementById('adult_last_name'+val).value != '')
            document.getElementById('name_pax'+parseInt(val-1)).innerHTML += '<i>'+document.getElementById('adult_last_name'+val).value+'</i> ';
        if(document.getElementById('adult_birth_date'+val).value != ''){
            var adt_bd = document.getElementById('adult_birth_date'+val).value;
            var adt_age = moment().diff(adt_bd, 'years');
            document.getElementById('birth_date'+parseInt(val-1)).innerHTML = '<i><b>Birth Date: </b>'+document.getElementById('adult_birth_date'+val).value+' ('+adt_age+' years)</i>';
        }
        try{
            if(document.getElementById('adult_sample_method'+val).value != ''){
                document.getElementById('sample_method'+parseInt(val-1)).innerHTML = document.getElementById('adult_sample_method'+val).value;
            }
        }catch(err){}
    }

}

function check_passenger(){
    var check_scroll = '';
    var check_to_scroll = -1;

    var check_form_booker = 0;
    $('.next-passenger-train').addClass("running");
    $('.next-passenger-train').attr("disabled", true);
    //booker
    request = {
        "data": {},
        "booker": {},
        "passenger": {},
        "contact_person": {}
    }
    error_log = '';
    /*try{
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

    }*/

    if(document.getElementById('booker_address').value == ''){
        error_log+= 'Please fill address!</br>\n';
        document.getElementById('booker_address').style['border-color'] = 'red';
        check_form_booker = 2;
    }else{
        document.getElementById('booker_address').style['border-color'] = '#EFEFEF';
    }

    if(document.getElementById('booker_area').value == ''){
        error_log+= 'Please fill area test!</br>\n';
        document.getElementById('booker_area').style['border-color'] = 'red';
        check_form_booker = 2;
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
            'place_url_by_google': web_url
        }
    }
    var now = moment();
    var test_list_counter = 1;
    var add_list = true;
    for(i=1; i <= test_time; i++){
        try{
            add_list = true;
            if(vendor == 'periksain'){
                if(now.format('DD MMM YYYY') == document.getElementById('booker_test_date'+i).value){
                    if(new Date() > new Date(document.getElementById('booker_test_date'+i).value+' '+document.getElementById('booker_timeslot_id'+i).value.split('~')[1])){
                        add_list = false;
                        error_log += 'Test time reservation already pass please change test time ' + test_list_counter + '!</br>\n';
                    }
                }
            }else{
                if(test_type == 'PHCHCKATG' || test_type == 'PHCHCKPCR'){
                    if(now.format('DD MMM YYYY') == document.getElementById('booker_test_date'+i).value){
                        if(new Date() > new Date(document.getElementById('booker_test_date'+i).value+' '+document.getElementById('booker_timeslot_id'+i).value.split('~')[1])){
                            add_list = false;
                            error_log += 'Test time reservation already pass please change test time ' + test_list_counter + '!</br>\n';
                        }
                    }
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

    var max_length = 0;
    if(vendor == 'periksain')
        max_length = medical_config.result.response[test_type].adult_length_name
    else if(vendor == 'phc'){
        for(i in medical_config.result.response.carriers_code){
            if(medical_config.result.response.carriers_code[i].code == test_type){
                max_length = medical_config.result.response.carriers_code[i].adult_length_name;
                break;
            }
        }

    }

    /*if(check_name(document.getElementById('booker_title').value,
                    document.getElementById('booker_first_name').value,
                    document.getElementById('booker_last_name').value,
                    max_length) == false){
        error_log+= 'Total of Booker name maximum '+max_length+' characters!</br>\n';
        document.getElementById('booker_first_name').style['border-color'] = 'red';
        //document.getElementById('booker_last_name').style['border-color'] = 'red';
        check_form_booker = 1;
    }else{
        document.getElementById('booker_first_name').style['border-color'] = '#EFEFEF';
        //document.getElementById('booker_last_name').style['border-color'] = '#EFEFEF';
    }if(document.getElementById('booker_first_name').value == ''){
        error_log+= 'Please fill booker first name!</br>\n';
        document.getElementById('booker_first_name').style['border-color'] = 'red';
        check_form_booker = 1;
    }else{
        document.getElementById('booker_first_name').style['border-color'] = '#EFEFEF';
    }if(check_phone_number(document.getElementById('booker_phone').value)==false){
        error_log+= 'Phone number Booker only contain number 8 - 12 digits!</br>\n';
        document.getElementById('booker_phone').style['border-color'] = 'red';
        check_form_booker = 1;
    }else{
        document.getElementById('booker_phone').style['border-color'] = '#EFEFEF';
    }if(check_email(document.getElementById('booker_email').value)==false){
        error_log+= 'Invalid Booker email!</br>\n';
        document.getElementById('booker_email').style['border-color'] = 'red';
        check_form_booker = 1;
    }else{
        document.getElementById('booker_email').style['border-color'] = '#EFEFEF';
    }*/

    /*if(error_log == ''){
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
    }*/
    var check_passenger = false;
    var ktp = [];
    var check_ktp_value = 1;
    if(counter_passenger == 0)
        error_log += 'Please fill passengers\n';
    else{
        request['passenger'] = []
        if(vendor == 'periksain'){
            for(i=0; i < counter_passenger; i++){
                var check_form_periksain = 0;
                nomor_pax = (i + 1);
                try{
                    //kasi if kosong
                    if(check_name(document.getElementById('adult_title'+nomor_pax).value,
                                document.getElementById('adult_first_name'+nomor_pax).value,
                                document.getElementById('adult_last_name'+nomor_pax).value,
                                max_length) == false){
                        error_log+= 'Total of Customer name '+nomor_pax+' maximum '+max_length+' characters!</br>\n';
                        document.getElementById('adult_first_name'+nomor_pax).style['border-color'] = 'red';
                        check_form_periksain = 1;
                    }else{
                        document.getElementById('adult_first_name'+nomor_pax).style['border-color'] = '#EFEFEF';
                        //document.getElementById('adult_last_name'+nomor_pax).style['border-color'] = '#EFEFEF';
                    }
                    if(document.getElementById('adult_first_name' + nomor_pax).value == '' || check_word(document.getElementById('adult_first_name' + nomor_pax).value) == false){
                        error_log += 'Please fill or use alpha characters for first name for customer '+ nomor_pax + ' !</br>\n';
                        document.getElementById('adult_first_name' + nomor_pax).style['border-color'] = 'red';
                        check_form_periksain = 1;
                    }else{
                        document.getElementById('adult_first_name' + nomor_pax).style['border-color'] = '#EFEFEF';
                    }
                    if(document.getElementById('adult_title' + nomor_pax).value == ''){
                        error_log += 'Please fill title name for customer '+ nomor_pax + ' !</br>\n';
                        document.getElementById('adult_title' + nomor_pax).style['border-color'] = 'red';
                        check_form_periksain = 1;
                    }else{
                        document.getElementById('adult_title' + nomor_pax).style['border-color'] = '#EFEFEF';
                    }
                    if(document.getElementById('adult_nationality' + nomor_pax).value == ''){
                        error_log += 'Please fill title name for customer '+ nomor_pax + ' !</br>\n';
                        $("#adult_nationality"+nomor_pax).each(function() {
                          $(this).siblings(".select2-container").css('border', '5px solid red');
                        });
                        check_form_periksain = 1;
                    }else{
                        $("#adult_nationality"+nomor_pax).each(function() {
                          $(this).siblings(".select2-container").css('border', '5px solid #EFEFEF');
                        });
                    }
                    if(check_date(document.getElementById('adult_birth_date'+ nomor_pax).value)==false){
                        error_log+= 'Birth date wrong for customer passenger '+nomor_pax+'!</br>\n';
                        document.getElementById('adult_birth_date'+ nomor_pax).style['border-color'] = 'red';
                        check_form_periksain = 1;
                    }else{
                        document.getElementById('adult_birth_date'+ nomor_pax).style['border-color'] = '#EFEFEF';
                    }
                    if(check_phone_number(document.getElementById('adult_phone' + nomor_pax).value)==false){
                        error_log+= 'Phone number only contain number 8 - 12 digits for customer '+nomor_pax+'!</br>\n';
                        document.getElementById('adult_phone' + nomor_pax).style['border-color'] = 'red';
                        check_form_periksain = 1;
                    }else{
                        document.getElementById('adult_phone' + nomor_pax).style['border-color'] = '#EFEFEF';
                    }
                    if(check_email(document.getElementById('adult_email' + nomor_pax).value)==false){
                        error_log+= 'Invalid Passenger '+ nomor_pax +' email!</br>\n';
                        document.getElementById('adult_email' + nomor_pax).style['border-color'] = 'red';
                        check_form_periksain = 1;
                    }else{
                        document.getElementById('adult_email' + nomor_pax).style['border-color'] = '#EFEFEF';
                    }
                    if(document.getElementById('adult_sample_method' + nomor_pax).value == ''){
                        error_log+= 'Please choose sample method for customer '+nomor_pax+'!</br>\n';
                        $("#adult_sample_method"+nomor_pax).each(function() {
                            $(this).parent().find('.nice-select').css('border', '1px solid red');
                        });
                        check_form_periksain = 1;
                    }else{
                        $("#adult_sample_method"+nomor_pax).each(function() {
                            $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                        });
                    }
                    if(document.getElementById('adult_address_ktp' + nomor_pax).value == ''){
                        error_log+= 'Please fill address ktp for customer '+nomor_pax+'!</br>\n';
                        document.getElementById('adult_address_ktp' + nomor_pax).style['border-color'] = 'red';
                        check_form_periksain = 1;
                    }else{
                        document.getElementById('adult_address_ktp' + nomor_pax).style['border-color'] = '#EFEFEF';
                    }

                    if(document.getElementById('adult_identity_type' + nomor_pax).value != ''){
                        document.getElementById('adult_identity_type' + nomor_pax).style['border-color'] = '#EFEFEF';
                        if(document.getElementById('adult_identity_type' + nomor_pax).value == 'ktp'){
                            if(document.getElementById('adult_identity_number'+ nomor_pax).value == ''){
                                error_log+= 'Please fill identity number for customer '+nomor_pax+'!</br>\n';
                                document.getElementById('adult_identity_number'+ nomor_pax).style['border-color'] = 'red';
                                check_form_periksain = 1;
                            }else if(check_ktp(document.getElementById('adult_identity_number'+ nomor_pax).value) == false){
                                error_log+= 'Please fill identity number, ktp only contain 16 digits for customer adult '+nomor_pax+'!</br>\n';
                                document.getElementById('adult_identity_number'+ nomor_pax).style['border-color'] = 'red';
                                check_form_periksain = 1;
                            }else{
                                document.getElementById('adult_identity_number'+ nomor_pax).style['border-color'] = '#EFEFEF';
                                if(ktp.includes(document.getElementById('adult_identity_number'+ nomor_pax).value) == true){
                                    error_log+= 'Duplicate identity number, for customer adult '+nomor_pax+'!</br>\n';
                                    document.getElementById('adult_identity_number'+ nomor_pax).style['border-color'] = 'red';
                                    check_form_periksain = 1;
                                }else{
                                    ktp.push(document.getElementById('adult_identity_number'+ nomor_pax).value)
                                }
                            }
                            if(document.getElementById('adult_country_of_issued'+ nomor_pax).value == ''){
                                error_log+= 'Please fill country of issued for customer '+ nomor_pax +'!</br>\n';
                                $("#adult_country_of_issued"+nomor_pax+"_id").each(function() {
                                  $(this).siblings(".select2-container").css('border', '1px solid red');
                                });
                                check_form_periksain = 1;
                            }else{
                                $("#adult_country_of_issued"+nomor_pax+"_id").each(function() {
                                  $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                                });
                            }
                        }
                    }else{
                        error_log+= 'Please fill identity type for customer '+nomor_pax+'!</br>\n';
                        document.getElementById('adult_identity_type' + nomor_pax).style['border-color'] = 'red';
                        check_form_periksain = 1;
                    }
                    if(i == 0 && document.getElementsByName('myRadios')[0].checked == true){
                        is_also_booker = true;
                        is_also_contact = true;
                    }else{
                        is_also_booker = false;
                        is_also_contact = false;
                    }
                    check_passenger = true;
                    if(i == 0){
                        request['booker'] = {
                            "first_name": document.getElementById('adult_first_name' + nomor_pax).value,
                            "last_name": document.getElementById('adult_last_name' + nomor_pax).value,
                            "title": document.getElementById('adult_title' + nomor_pax).value,
                            'email': document.getElementById('adult_email' + nomor_pax).value,
                            'calling_code': document.getElementById('adult_phone_code'+nomor_pax+'_id').value,
                            'mobile': document.getElementById('adult_phone'+nomor_pax).value,
                            'nationality_name': document.getElementById('adult_nationality' + nomor_pax).value,
                            'booker_seq_id': document.getElementById('adult_id' + nomor_pax).value
                        }
                        request['contact_person'] = [{
                            "first_name": document.getElementById('adult_first_name' + nomor_pax).value,
                            "last_name": document.getElementById('adult_last_name' + nomor_pax).value,
                            "title": document.getElementById('adult_title' + nomor_pax).value,
                            'email': document.getElementById('adult_email' + nomor_pax).value,
                            'calling_code': document.getElementById('adult_phone_code'+nomor_pax+'_id').value,
                            'mobile': document.getElementById('adult_phone'+nomor_pax).value,
                            'nationality_name': document.getElementById('adult_nationality' + nomor_pax).value,
                            'contact_seq_id': document.getElementById('adult_id' + nomor_pax).value,
                            'is_also_booker': true
                        }]
                    }
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
                            "identity_type": document.getElementById('adult_identity_type' + nomor_pax).value,
                            "identity_number": document.getElementById('adult_identity_number' + nomor_pax).value,
                        },
                        "passenger_seq_id": document.getElementById('adult_id' + nomor_pax).value,
                        "sample_method": document.getElementById('adult_sample_method' + nomor_pax).value,
                        "address_ktp": document.getElementById('adult_address_ktp' + nomor_pax).value,
                        "email": document.getElementById('adult_email' + nomor_pax).value,
                        "phone_number": document.getElementById('adult_phone_code'+nomor_pax+'_id').value + document.getElementById('adult_phone'+nomor_pax).value,
                        'is_also_booker': is_also_booker,
                        'is_also_contact': is_also_contact

                    })
                }catch(err){}

                var error_form = '';
                var customer_id = nomor_pax - 1;

                if(check_form_periksain == 1){
                    document.getElementById('span_customer_data'+customer_id).innerHTML = "<i><i class='fas fa-times-circle'></i> Missing Data or Wrong Data. Please check your data again.</i>";
                    document.getElementById('div_form_customer'+customer_id).style = "padding: 20px 15px 0px 15px; border: 1px solid red !important;";
                }else{
                    document.getElementById('span_customer_data'+customer_id).innerHTML = "";
                    document.getElementById('div_form_customer'+customer_id).style = "padding: 20px 15px 0px 15px; border: 1px solid "+color+" !important;";
                }

                if(check_form_periksain == 1){
                    if(check_to_scroll == -1){
                        check_to_scroll = parseInt(i);
                    }
                }
            }
            if(check_scroll == ''){
                if(check_form_booker == 1){
                    check_scroll = 'booker';
                }
                else if(check_to_scroll != -1){
                    check_scroll = 'customer';
                }
                else if (check_form_booker == 2){
                    check_scroll = 'address';
                }
            }
        }
        else if(vendor == 'phc'){
            for(i=0; i < counter_passenger; i++){
                var check_form_personal = 0;
                var check_form_medical = 0;
                var check_form_faktor = 0;

                nomor_pax = (i + 1)
                try{
                    //kasi if kosong
                    if(check_name(document.getElementById('adult_title'+nomor_pax).value,
                                document.getElementById('adult_first_name'+nomor_pax).value,
                                document.getElementById('adult_last_name'+nomor_pax).value,
                                max_length) == false){
                        error_log+= 'Total of Customer name '+nomor_pax+' maximum '+max_length+' characters!</br>\n';
                        document.getElementById('adult_first_name'+nomor_pax).style['border-color'] = 'red';
                        //document.getElementById('adult_last_name'+nomor_pax).style['border-color'] = 'red';
                        check_form_personal = 1;
                    }else{
                        document.getElementById('adult_first_name'+nomor_pax).style['border-color'] = '#EFEFEF';
                        //document.getElementById('adult_last_name'+nomor_pax).style['border-color'] = '#EFEFEF';
                    }
                    if(document.getElementById('adult_first_name' + nomor_pax).value == '' || check_word(document.getElementById('adult_first_name' + nomor_pax).value) == false){
                        error_log += 'Please fill or use alpha characters for first name for customer '+ nomor_pax + ' !</br>\n';
                        document.getElementById('adult_first_name' + nomor_pax).style['border-color'] = 'red';
                        check_form_personal = 1;
                    }else{
                        document.getElementById('adult_first_name' + nomor_pax).style['border-color'] = '#EFEFEF';
                    }
                    if(document.getElementById('adult_title' + nomor_pax).value == ''){
                        error_log += 'Please fill title name for customer '+ nomor_pax + ' !</br>\n';
                        document.getElementById('adult_title' + nomor_pax).style['border-color'] = 'red';
                        check_form_personal = 1;
                    }else{
                        document.getElementById('adult_title' + nomor_pax).style['border-color'] = '#EFEFEF';
                    }
                    if(document.getElementById('adult_nationality' + nomor_pax).value == 'Select Nationality'){
                        error_log += 'Please fill title name for customer '+ nomor_pax + ' !</br>\n';
                        $("#adult_nationality"+nomor_pax+"_id").each(function() {
                          $(this).siblings(".select2-container").css('border', '1px solid red');
                        });
                        check_form_personal = 1;
                    }else{
                        $("#adult_nationality"+nomor_pax+"_id").each(function() {
                          $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                        });
                    }
                    if(check_date(document.getElementById('adult_birth_date'+ nomor_pax).value)==false){
                        error_log+= 'Birth date wrong for customer '+nomor_pax+'!</br>\n';
                        document.getElementById('adult_birth_date'+ nomor_pax).style['border-color'] = 'red';
                        check_form_personal = 1;
                    }else{
                        document.getElementById('adult_birth_date'+ nomor_pax).style['border-color'] = '#EFEFEF';
                    }
                    if(check_phone_number(document.getElementById('adult_phone' + nomor_pax).value)==false){
                        error_log+= 'Phone number only contain number 8 - 12 digits for customer '+nomor_pax+'!</br>\n';
                        document.getElementById('adult_phone' + nomor_pax).style['border-color'] = 'red';
                        check_form_personal = 1;
                    }else{
                        document.getElementById('adult_phone' + nomor_pax).style['border-color'] = '#EFEFEF';
                    }
                    if(check_email(document.getElementById('adult_email' + nomor_pax).value)==false){
                        error_log+= 'Invalid Customer '+ nomor_pax +' email!</br>\n';
                        document.getElementById('adult_email' + nomor_pax).style['border-color'] = 'red';
                        check_form_personal = 1;
                    }else{
                        document.getElementById('adult_email' + nomor_pax).style['border-color'] = '#EFEFEF';
                    }
                    if(document.getElementById('adult_profession' + nomor_pax).value == ''){
                        error_log+= 'Please choose profession for customer '+nomor_pax+'!</br>\n';
                        $("#adult_profession"+nomor_pax).each(function() {
                            $(this).parent().find('.nice-select').css('border', '1px solid red');
                        });
                        check_form_personal = 1;
                    }else{
                        $("#adult_profession"+nomor_pax).each(function() {
                            $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                        });
                    }
                    if(vendor == 'phc'){
                        if(test_type == 'PHCHCKPCR' || test_type == 'PHCDTKPCR'){
                            if(document.getElementById('adult_title' + nomor_pax).value == 'MRS' && document.getElementById('adult_klinis_sedang_hamil' + nomor_pax).value == ''){
                                error_log+= 'Please choose sedang hamil for customer '+nomor_pax+'!</br>\n';
                                $("#adult_klinis_sedang_hamil"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid red');
                                });
                                check_form_personal = 1;
                            }else{
                                $("#adult_klinis_sedang_hamil"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                                });
                            }
                        }
                    }
                    if(document.getElementById('adult_profession' + nomor_pax).value != '' && document.getElementById('adult_profession' + nomor_pax).value != 'BELUM BEKERJA'){
                        if(document.getElementById('adult_work_place' + nomor_pax).value == ''){
                            error_log+= 'Please fill work place for customer '+nomor_pax+'!</br>\n';
                            document.getElementById('adult_work_place' + nomor_pax).style['border-color'] = 'red';
                            check_form_personal = 1;
                        }else{
                            document.getElementById('adult_work_place' + nomor_pax).style['border-color'] = '#EFEFEF';
                        }
                    }
                    if(document.getElementById('adult_address' + nomor_pax).value == ''){
                        error_log+= 'Please fill Address for customer '+nomor_pax+'!</br>\n';
                        document.getElementById('adult_address' + nomor_pax).style['border-color'] = 'red';
                        check_form_personal = 1;
                    }else{
                        document.getElementById('adult_address' + nomor_pax).style['border-color'] = '#EFEFEF';
                    }
                    if(document.getElementById('adult_rt' + nomor_pax).value == '' || check_number(document.getElementById('adult_rt' + nomor_pax).value) == false || document.getElementById('adult_rt' + nomor_pax).value.length > 3){
                        error_log+= 'RT only contain number max 3 digit for customer '+nomor_pax+'!</br>\n';
                        document.getElementById('adult_rt' + nomor_pax).style['border-color'] = 'red';
                        check_form_personal = 1;
                    }else{
                        document.getElementById('adult_rt' + nomor_pax).style['border-color'] = '#EFEFEF';
                    }
                    if(document.getElementById('adult_rw' + nomor_pax).value == '' || check_number(document.getElementById('adult_rw' + nomor_pax).value) == false || document.getElementById('adult_rw' + nomor_pax).value.length > 3){
                        error_log+= 'RW only contain number max 3 digit for customer '+nomor_pax+'!</br>\n';
                        document.getElementById('adult_rw' + nomor_pax).style['border-color'] = 'red';
                        check_form_personal = 1;
                    }else{
                        document.getElementById('adult_rw' + nomor_pax).style['border-color'] = '#EFEFEF';
                    }
                    if(document.getElementById('adult_kabupaten' + nomor_pax).value == ''){
                        error_log+= 'Please choose Kabupaten for customer '+nomor_pax+'!</br>\n';
                        $("#adult_kabupaten"+nomor_pax+"_id").each(function() {
                          $(this).siblings(".select2-container").css('border', '1px solid red');
                        });
                        check_form_personal = 1;
                    }else{
                        $("#adult_kabupaten"+nomor_pax+"_id").each(function() {
                          $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                        });
                    }
                    if(document.getElementById('adult_kecamatan' + nomor_pax).value == ''){
                        error_log+= 'Please choose Kecamatan for customer '+nomor_pax+'!</br>\n';
                        $("#adult_kecamatan"+nomor_pax+"_id").each(function() {
                          $(this).siblings(".select2-container").css('border', '1px solid red');
                        });
                        check_form_personal = 1;
                    }else{
                        $("#adult_kecamatan"+nomor_pax+"_id").each(function() {
                          $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                        });
                    }
                    if(document.getElementById('adult_kelurahan' + nomor_pax).value == ''){
                        error_log+= 'Please choose Kelurahan for customer '+nomor_pax+'!</br>\n';
                        $("#adult_kelurahan"+nomor_pax+"_id").each(function() {
                          $(this).siblings(".select2-container").css('border', '1px solid red');
                        });
                        check_form_personal = 1;
                    }else{
                        $("#adult_kelurahan"+nomor_pax+"_id").each(function() {
                          $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                        });
                    }

                    if(document.getElementById('adult_address_ktp' + nomor_pax).value == ''){
                        error_log+= 'Please fill Address KTP for customer '+nomor_pax+'!</br>\n';
                        document.getElementById('adult_address_ktp' + nomor_pax).style['border-color'] = 'red';
                        check_form_personal = 1;
                    }else{
                        document.getElementById('adult_address_ktp' + nomor_pax).style['border-color'] = '#EFEFEF';
                    }
                    if(document.getElementById('adult_rt_ktp' + nomor_pax).value == '' || check_number(document.getElementById('adult_rt_ktp' + nomor_pax).value) == false || document.getElementById('adult_rt_ktp' + nomor_pax).value.length > 3){
                        error_log+= 'RT KTP only contain number max 3 digit for customer '+nomor_pax+'!</br>\n';
                        document.getElementById('adult_rt_ktp' + nomor_pax).style['border-color'] = 'red';
                        check_form_personal = 1;
                    }else{
                        document.getElementById('adult_rt_ktp' + nomor_pax).style['border-color'] = '#EFEFEF';
                    }
                    if(document.getElementById('adult_rw_ktp' + nomor_pax).value == '' || check_number(document.getElementById('adult_rw_ktp' + nomor_pax).value) == false || document.getElementById('adult_rw_ktp' + nomor_pax).value.length > 3){
                        error_log+= 'RW KTP only contain number max 3 digit for customer '+nomor_pax+'!</br>\n';
                        document.getElementById('adult_rw_ktp' + nomor_pax).style['border-color'] = 'red';
                        check_form_personal = 1;
                    }else{
                        document.getElementById('adult_rw_ktp' + nomor_pax).style['border-color'] = '#EFEFEF';
                    }
                    if(document.getElementById('adult_kabupaten_ktp' + nomor_pax).value == ''){
                        error_log+= 'Please choose Kabupaten KTP for customer '+nomor_pax+'!</br>\n';
                        $("#adult_kabupaten_ktp"+nomor_pax+"_id").each(function() {
                          $(this).siblings(".select2-container").css('border', '1px solid red');
                        });
                        check_form_personal = 1;
                    }else{
                        $("#adult_kabupaten_ktp"+nomor_pax+"_id").each(function() {
                          $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                        });
                    }
                    if(document.getElementById('adult_kecamatan_ktp' + nomor_pax).value == ''){
                        error_log+= 'Please choose Kecamatan KTP for customer '+nomor_pax+'!</br>\n';
                        $("#adult_kecamatan_ktp"+nomor_pax+"_id").each(function() {
                          $(this).siblings(".select2-container").css('border', '1px solid red');
                        });
                        check_form_personal = 1;
                    }else{
                        $("#adult_kecamatan_ktp"+nomor_pax+"_id").each(function() {
                          $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                        });
                    }
                    if(document.getElementById('adult_kelurahan_ktp' + nomor_pax).value == ''){
                        error_log+= 'Please choose Kelurahan KTP for customer '+nomor_pax+'!</br>\n';
                        $("#adult_kelurahan_ktp"+nomor_pax+"_id").each(function() {
                          $(this).siblings(".select2-container").css('border', '1px solid red');
                        });
                        check_form_personal = 1;
                    }else{
                        $("#adult_kelurahan_ktp"+nomor_pax+"_id").each(function() {
                          $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                        });
                    }
                    if(document.getElementById('adult_tempat_lahir' + nomor_pax).value == ''){
                        error_log+= 'Please choose Tempat Lahir for customer '+nomor_pax+'!</br>\n';
                        $("#adult_tempat_lahir"+nomor_pax+"_id").each(function() {
                          $(this).siblings(".select2-container").css('border', '1px solid red');
                        });
                        check_form_personal = 1;
                    }else{
                        $("#adult_tempat_lahir"+nomor_pax+"_id").each(function() {
                          $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                        });
                    }
                    if(document.getElementById('adult_identity_type' + nomor_pax).value != ''){
                        document.getElementById('adult_identity_type' + nomor_pax).style['border-color'] = '#EFEFEF';
                        if(document.getElementById('adult_identity_type' + nomor_pax).value == 'ktp'){
                            if(document.getElementById('adult_identity_number'+ nomor_pax).value == ''){
                                error_log+= 'Please fill identity number for customer '+nomor_pax+'!</br>\n';
                                document.getElementById('adult_identity_number'+ nomor_pax).style['border-color'] = 'red';
                                check_form_personal = 1;
                            }else if(check_ktp(document.getElementById('adult_identity_number'+ nomor_pax).value) == false){
                                error_log+= 'Please fill identity number, ktp only contain 16 digits for customer adult '+nomor_pax+'!</br>\n';
                                document.getElementById('adult_identity_number'+ nomor_pax).style['border-color'] = 'red';
                                check_form_personal = 1;
                            }else{
                                document.getElementById('adult_identity_number'+ nomor_pax).style['border-color'] = '#EFEFEF';
                                if(ktp.includes(document.getElementById('adult_identity_number'+ nomor_pax).value) == true){
                                    error_log+= 'Duplicate identity number, for customer adult '+nomor_pax+'!</br>\n';
                                    document.getElementById('adult_identity_number'+ nomor_pax).style['border-color'] = 'red';
                                    check_form_personal = 1;
                                }else{
                                    ktp.push(document.getElementById('adult_identity_number'+ nomor_pax).value)
                                }
                            }
                            if(document.getElementById('adult_country_of_issued'+ nomor_pax).value == ''){
                                error_log+= 'Please fill country of issued for customer '+nomor_pax+'!</br>\n';
                                $("#adult_country_of_issued"+nomor_pax+"_id").each(function() {
                                  $(this).siblings(".select2-container").css('border', '1px solid red');
                                });
                                check_form_personal = 1;
                            }else{
                                $("#adult_country_of_issued"+nomor_pax+"_id").each(function() {
                                  $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                                });
                            }
                        }else if(document.getElementById('adult_identity_type' + nomor_pax).value == 'passport'){
                            console.log('passport')
                            if(document.getElementById('adult_identity_number'+ nomor_pax).value == ''){
                                error_log+= 'Please fill identity number for customer '+nomor_pax+'!</br>\n';
                                document.getElementById('adult_identity_number'+ nomor_pax).style['border-color'] = 'red';
                                check_form_personal = 1;
                            }else if(check_passport(document.getElementById('adult_identity_number'+ nomor_pax).value) == false){
                                error_log+= 'Please fill identity number, passport only contain more than 6 digits for customer adult '+nomor_pax+'!</br>\n';
                                document.getElementById('adult_identity_number'+ nomor_pax).style['border-color'] = 'red';
                                check_form_personal = 1;
                            }else{
                                document.getElementById('adult_identity_number'+ nomor_pax).style['border-color'] = '#EFEFEF';
                                if(ktp.includes(document.getElementById('adult_identity_number'+ nomor_pax).value) == true){
                                    error_log+= 'Duplicate identity number, for customer adult '+nomor_pax+'!</br>\n';
                                    document.getElementById('adult_identity_number'+ nomor_pax).style['border-color'] = 'red';
                                    check_form_personal = 1;
                                }else{
                                    ktp.push(document.getElementById('adult_identity_number'+ nomor_pax).value)
                                }
                            }
                            if(document.getElementById('adult_country_of_issued'+ nomor_pax).value == ''){
                                error_log+= 'Please fill country of issued for customer '+ nomor_pax +'!</br>\n';
                                document.getElementById('adult_country_of_issued'+ nomor_pax).style['border-color'] = 'red';
                                check_form_personal = 1;
                            }else{
                                document.getElementById('adult_country_of_issued'+ nomor_pax).style['border-color'] = '#EFEFEF';
                            }
                            console.log('expired')
                            if(document.getElementById('adult_identity_expired_date'+nomor_pax).value == ''){
                                error_log+= 'Please fill identity expired date for customer '+ nomor_pax +'!</br>\n';
                                document.getElementById('adult_identity_expired_date'+ nomor_pax).style['border-color'] = 'red';
                                check_form_personal = 1;
                            }else{
                                document.getElementById('adult_identity_expired_date'+ nomor_pax).style['border-color'] = '#EFEFEF';
                            }
                        }
                    }else{
                        error_log+= 'Please fill identity type for customer '+nomor_pax+'!</br>\n';
                        document.getElementById('adult_identity_type' + nomor_pax).style['border-color'] = 'red';
                        check_form_personal = 1;
                    }
                    if(i == 0 && document.getElementsByName('myRadios')[0].checked == true){
                        is_also_booker = true;
                        is_also_contact = true;
                    }else{
                        is_also_booker = false;
                        is_also_contact = false;
                    }

                    pcr_data = {};
                    if(test_type == 'PHCDTKPCR' || test_type == 'PHCHCKPCR'){
                        if(document.getElementById('adult_mother_name' + nomor_pax).value == ''){
                            error_log+= 'Please fill mother name for customer '+nomor_pax+'!</br>\n';
                            document.getElementById('adult_mother_name' + nomor_pax).style['border-color'] = 'red';
                            check_form_personal = 1;
                        }else{
                            document.getElementById('adult_mother_name' + nomor_pax).style['border-color'] = '#EFEFEF';

                        }
                        if(document.getElementById('adult_kriteria_pasien' + nomor_pax).value == ''){
                            error_log+= 'Please choose kriteria pasien for customer '+nomor_pax+'!</br>\n';
                            $("#adult_kriteria_pasien"+nomor_pax).each(function() {
                                $(this).parent().find('.nice-select').css('border', '1px solid red');
                            });
                            check_form_medical = 1;
                        }else{
                            $("#adult_kriteria_pasien"+nomor_pax).each(function() {
                                $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                            });
                        }
                        if(document.getElementById('adult_pemeriksaan_swab_ke' + nomor_pax).value == '' || check_number(document.getElementById('adult_pemeriksaan_swab_ke' + nomor_pax).value) == false || parseInt(document.getElementById('adult_pemeriksaan_swab_ke' + nomor_pax).value) > 1000 ){
                            error_log+= 'Pemeriksaan swab only contain number max 1000 for customer '+nomor_pax+'!</br>\n';
                            document.getElementById('adult_pemeriksaan_swab_ke' + nomor_pax).style['border-color'] = 'red';
                            check_form_medical = 1;
                        }else{
                            document.getElementById('adult_pemeriksaan_swab_ke' + nomor_pax).style['border-color'] = '#EFEFEF';
                        }

                        //RAWAT RS
                        if(document.getElementById('adult_sedang_dirawat_di_rs' + nomor_pax).value == 'IYA'){
                            $("#adult_sedang_dirawat_di_rs"+nomor_pax).each(function() {
                                $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                            });
                            if(document.getElementById('adult_nama_rs' + nomor_pax).value == ''){
                                error_log+= 'Pemeriksaan Nama RS for customer '+nomor_pax+'!</br>\n';
                                document.getElementById('adult_nama_rs' + nomor_pax).style['border-color'] = 'red';
                                check_form_medical = 1;
                            }else{
                                document.getElementById('adult_nama_rs' + nomor_pax).style['border-color'] = '#EFEFEF';
                            }

                            if(document.getElementById('adult_tanggal_masuk_rs' + nomor_pax).value == ''){
                                error_log+= 'Pemeriksaan Nama RS for customer '+nomor_pax+'!</br>\n';
                                document.getElementById('adult_tanggal_masuk_rs' + nomor_pax).style['border-color'] = 'red';
                                check_form_medical = 1;
                            }else{
                                document.getElementById('adult_tanggal_masuk_rs' + nomor_pax).style['border-color'] = '#EFEFEF';
                            }

                            if(document.getElementById('adult_sedang_dirawat_di_icu' + nomor_pax).value == ''){
                                error_log+= 'Please choose Sedang Dirawat Di ICU for customer '+nomor_pax+'!</br>\n';
                                $("#adult_sedang_dirawat_di_icu"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid red');
                                });
                                check_form_medical = 1;
                            }else{
                                $("#adult_sedang_dirawat_di_icu"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                                });
                            }

                            if(document.getElementById('adult_menggunakan_emco' + nomor_pax).value == ''){
                                error_log+= 'Please choose Menggunakan Emco for customer '+nomor_pax+'!</br>\n';
                                $("#adult_menggunakan_emco"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid red');
                                });
                                check_form_medical = 1;
                            }else{
                                $("#adult_menggunakan_emco"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                                });
                            }

                            if(document.getElementById('adult_klinis_ada_penumonia' + nomor_pax).value == ''){
                                error_log+= 'Please choose Gejala Penumonia for customer '+nomor_pax+'!</br>\n';
                                $("#adult_klinis_ada_penumonia"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid red');
                                });
                                check_form_medical = 1;
                            }else{
                                $("#adult_klinis_ada_penumonia"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                                });
                            }
                            if(document.getElementById('adult_klinis_ada_ards' + nomor_pax).value == ''){
                                error_log+= 'Please choose ARDS for customer '+nomor_pax+'!</br>\n';
                                $("#adult_klinis_ada_ards"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid red');
                                });
                                check_form_medical = 1;
                            }else{
                                $("#adult_klinis_ada_ards"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                                });
                            }
                            if(document.getElementById('adult_klinis_ada_ards' + nomor_pax).value == 'IYA' && document.getElementById('adult_klinis_ards_detil' + nomor_pax).value == ''){
                                error_log+= 'Please choose ARDS detail for customer '+nomor_pax+'!</br>\n';
                                document.getElementById('adult_klinis_ards_detil' + nomor_pax).style['border-color'] = 'red';
                                check_form_medical = 1;
                            }else{
                                document.getElementById('adult_klinis_ards_detil' + nomor_pax).style['border-color'] = '#EFEFEF';
                            }
                            if(document.getElementById('adult_klinis_ada_penyakit_pernafasan' + nomor_pax).value == ''){
                                error_log+= 'Please choose Gejala Penyakit Pernafasan for customer '+nomor_pax+'!</br>\n';
                                $("#adult_klinis_ada_penyakit_pernafasan"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid red');
                                });
                                check_form_medical = 1;
                            }else{
                                $("#adult_klinis_ada_penyakit_pernafasan"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                                });
                            }
                        }
                        else if(document.getElementById('adult_sedang_dirawat_di_rs' + nomor_pax).value == ''){
                            error_log+= 'Please choose Pernah dirawat di RS for customer '+nomor_pax+'!</br>\n';
                            $("#adult_sedang_dirawat_di_rs"+nomor_pax).each(function() {
                                $(this).parent().find('.nice-select').css('border', '1px solid red');
                            });
                            check_form_medical = 1;
                        }
                        else{
                            $("#adult_sedang_dirawat_di_rs"+nomor_pax).each(function() {
                                $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                            });
                        }

                        if(document.getElementById('adult_perusahaan' + nomor_pax).value == ''){
                            error_log+= 'Please choose Asal Perusahaan/Rumah Sakit/Pribadi for customer '+nomor_pax+'!</br>\n';
                            $("#adult_perusahaan"+nomor_pax).each(function() {
                                $(this).parent().find('.nice-select').css('border', '1px solid red');
                            });
                            check_form_personal = 1;
                        }else{
                            $("#adult_perusahaan"+nomor_pax).each(function() {
                                $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                            });
                        }
                        if(document.getElementById('adult_nama_perusahaan' + nomor_pax).value == ''){
                            error_log+= 'Please fill Nama Perusahaan/Rumah Sakit/Pribadi for customer '+nomor_pax+'!</br>\n';
                            document.getElementById('adult_nama_perusahaan' + nomor_pax).style['border-color'] = 'red';
                            check_form_personal = 1;
                        }else{
                            document.getElementById('adult_nama_perusahaan' + nomor_pax).style['border-color'] = '#EFEFEF';
                        }
                        if(document.getElementById('adult_klinis_golongan_darah' + nomor_pax).value == ''){
                            error_log+= 'Please choose Golongan Darah for customer '+nomor_pax+'!</br>\n';
                            $("#adult_klinis_golongan_darah"+nomor_pax).each(function() {
                                $(this).parent().find('.nice-select').css('border', '1px solid red');
                            });
                            check_form_personal = 1;
                        }else{
                            $("#adult_klinis_golongan_darah"+nomor_pax).each(function() {
                                $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                            });
                        }

                        //GEJALA
                        if(document.getElementById('adult_gejala'+nomor_pax).value == 'IYA'){
                            if(document.getElementById('adult_tanggal_pertama_kali_gejala' + nomor_pax).value == ''){
                                error_log+= 'Please fill Tanggal Pertama Kali Gejala for customer '+nomor_pax+'!</br>\n';
                                document.getElementById('adult_tanggal_pertama_kali_gejala' + nomor_pax).style['border-color'] = 'red';
                                check_form_medical = 1;
                            }else{
                                document.getElementById('adult_tanggal_pertama_kali_gejala' + nomor_pax).style['border-color'] = '#EFEFEF';
                            }

                            if(document.getElementById('adult_klinis_ada_demam' + nomor_pax).value == ''){
                                error_log+= 'Please choose Gejala Demam for customer '+nomor_pax+'!</br>\n';
                                $("#adult_klinis_ada_demam"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid red');
                                });
                                check_form_medical = 1;
                            }else{
                                $("#adult_klinis_ada_demam"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                                });
                            }
                            if(document.getElementById('adult_klinis_ada_demam' + nomor_pax).value == 'IYA'){
                                if(document.getElementById('adult_klinis_suhu_tubuh' + nomor_pax).value == 'IYA'){
                                    error_log+= 'Please fill Suhu Tubuh for customer '+nomor_pax+'!</br>\n';
                                    document.getElementById('adult_klinis_suhu_tubuh' + nomor_pax).style['border-color'] = 'red';
                                    check_form_medical = 1;
                                }else{
                                    document.getElementById('adult_klinis_suhu_tubuh' + nomor_pax).style['border-color'] = '#EFEFEF';
                                }
                            }
                            if(document.getElementById('adult_klinis_ada_batuk' + nomor_pax).value == ''){
                                error_log+= 'Please choose Gejala Batuk for customer '+nomor_pax+'!</br>\n';
                                $("#adult_klinis_ada_batuk"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid red');
                                });
                                check_form_medical = 1;
                            }else{
                                $("#adult_klinis_ada_batuk"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                                });
                            }
                            if(document.getElementById('adult_klinis_ada_pilek' + nomor_pax).value == ''){
                                error_log+= 'Please choose Gejala Flu for customer '+nomor_pax+'!</br>\n';
                                $("#adult_klinis_ada_pilek"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid red');
                                });
                                check_form_medical = 1;
                            }else{
                                $("#adult_klinis_ada_pilek"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                                });
                            }
                            if(document.getElementById('adult_klinis_ada_sakit_tenggorokan' + nomor_pax).value == ''){
                                error_log+= 'Please choose Gejala Sakit Tenggorokan for customer '+nomor_pax+'!</br>\n';
                                $("#adult_klinis_ada_sakit_tenggorokan"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid red');
                                });
                                check_form_medical = 1;
                            }else{
                                $("#adult_klinis_ada_sakit_tenggorokan"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                                });
                            }
                            if(document.getElementById('adult_klinis_ada_sesak' + nomor_pax).value == ''){
                                error_log+= 'Please choose Gejala Sesak Nafas for customer '+nomor_pax+'!</br>\n';
                                $("#adult_klinis_ada_sesak"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid red');
                                });
                                check_form_medical = 1;
                            }else{
                                $("#adult_klinis_ada_sesak"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                                });
                            }
                            if(document.getElementById('adult_klinis_ada_sakit_kepala' + nomor_pax).value == ''){
                                error_log+= 'Please choose Gejala Sakit Kepala for customer '+nomor_pax+'!</br>\n';
                                $("#adult_klinis_ada_sakit_kepala"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid red');
                                });
                                check_form_medical = 1;
                            }else{
                                $("#adult_klinis_ada_sakit_kepala"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                                });
                            }
                            if(document.getElementById('adult_klinis_ada_badan_lemah' + nomor_pax).value == ''){
                                error_log+= 'Please choose Gejala Badan Lemah for customer '+nomor_pax+'!</br>\n';
                                $("#adult_klinis_ada_badan_lemah"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid red');
                                });
                                check_form_medical = 1;
                            }else{
                                $("#adult_klinis_ada_badan_lemah"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                                });
                            }
                            if(document.getElementById('adult_klinis_ada_nyeri_otot' + nomor_pax).value == ''){
                                error_log+= 'Please choose Gejala Nyeri Otot for customer '+nomor_pax+'!</br>\n';
                                $("#adult_klinis_ada_nyeri_otot"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid red');
                                });
                                check_form_medical = 1;
                            }else{
                                $("#adult_klinis_ada_nyeri_otot"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                                });
                            }
                            if(document.getElementById('adult_klinis_ada_mual' + nomor_pax).value == ''){
                                error_log+= 'Please choose Gejala Mual for customer '+nomor_pax+'!</br>\n';
                                $("#adult_klinis_ada_mual"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid red');
                                });
                                check_form_medical = 1;
                            }else{
                                $("#adult_klinis_ada_mual"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                                });
                            }
                            if(document.getElementById('adult_klinis_ada_nyeri_abdomen' + nomor_pax).value == ''){
                                error_log+= 'Please choose Gejala Nyeri Abdomen for customer '+nomor_pax+'!</br>\n';
                                $("#adult_klinis_ada_nyeri_abdomen"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid red');
                                });
                                check_form_medical = 1;
                            }else{
                                $("#adult_klinis_ada_nyeri_abdomen"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                                });
                            }
                            if(document.getElementById('adult_klinis_ada_diare' + nomor_pax).value == ''){
                                error_log+= 'Please choose Gejala Diare for customer '+nomor_pax+'!</br>\n';
                                $("#adult_klinis_ada_diare"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid red');
                                });
                                check_form_medical = 1;
                            }else{
                                $("#adult_klinis_ada_diare"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                                });
                            }
                            if(document.getElementById('adult_klinis_ada_gangguan_penciuman' + nomor_pax).value == ''){
                                error_log+= 'Please choose Gejala Gangguan Penciuman for customer '+nomor_pax+'!</br>\n';
                                $("#adult_klinis_ada_gangguan_penciuman"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid red');
                                });
                                check_form_medical = 1;
                            }else{
                                $("#adult_klinis_ada_gangguan_penciuman"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                                });
                            }

                            $("#adult_gejala"+nomor_pax).each(function() {
                                $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                            });
                        }
                        else if(document.getElementById('adult_gejala'+nomor_pax).value == ''){
                            error_log+= 'Please choose Gejala Covid-19 for customer '+nomor_pax+'!</br>\n';
                            $("#adult_gejala"+nomor_pax).each(function() {
                                $(this).parent().find('.nice-select').css('border', '1px solid red');
                            });
                            check_form_medical = 1;
                        }
                        else{
                            $("#adult_gejala"+nomor_pax).each(function() {
                                $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                            });
                        }

                        //PENYAKIT BAWAAN
                        if(document.getElementById('adult_penyakit_bawaan'+nomor_pax).value == 'IYA'){
                            if(document.getElementById('adult_klinis_ada_diabetes' + nomor_pax).value == ''){
                                error_log+= 'Please choose Diabetes for customer '+nomor_pax+'!</br>\n';
                                $("#adult_klinis_ada_diabetes"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid red');
                                });
                                check_form_medical = 1;
                            }else{
                                $("#adult_klinis_ada_diabetes"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                                });
                            }
                            if(document.getElementById('adult_klinis_ada_penyakit_jantung' + nomor_pax).value == ''){
                                error_log+= 'Please choose Penyakit Jantung for customer '+nomor_pax+'!</br>\n';
                                $("#adult_klinis_ada_penyakit_jantung"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid red');
                                });
                                check_form_medical = 1;
                            }else{
                                $("#adult_klinis_ada_penyakit_jantung"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                                });
                            }
                            if(document.getElementById('adult_klinis_ada_hipertensi' + nomor_pax).value == ''){
                                error_log+= 'Please choose Hipertensi for customer '+nomor_pax+'!</br>\n';
                                $("#adult_klinis_ada_hipertensi"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid red');
                                });
                                check_form_medical = 1;
                            }else{
                                $("#adult_klinis_ada_hipertensi"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                                });
                            }
                            if(document.getElementById('adult_klinis_ada_keganasan' + nomor_pax).value == ''){
                                error_log+= 'Please choose Keganasan for customer '+nomor_pax+'!</br>\n';
                                $("#adult_klinis_ada_keganasan"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid red');
                                });
                                check_form_medical = 1;
                            }else{
                                $("#adult_klinis_ada_keganasan"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                                });
                            }
                            if(document.getElementById('adult_klinis_ada_gangguan_imunologi' + nomor_pax).value == ''){
                                error_log+= 'Please choose Gangguan Imunologi for customer '+nomor_pax+'!</br>\n';
                                $("#adult_klinis_ada_gangguan_imunologi"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid red');
                                });
                                check_form_medical = 1;
                            }else{
                                $("#adult_klinis_ada_gangguan_imunologi"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                                });
                            }
                            if(document.getElementById('adult_klinis_ada_gangguan_ginjal' + nomor_pax).value == ''){
                                error_log+= 'Please choose Gangguan Ginjal for customer '+nomor_pax+'!</br>\n';
                                $("#adult_klinis_ada_gangguan_ginjal"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid red');
                                });
                                check_form_medical = 1;
                            }else{
                                $("#adult_klinis_ada_gangguan_ginjal"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                                });
                            }
                            if(document.getElementById('adult_klinis_ada_gangguan_hati' + nomor_pax).value == ''){
                                error_log+= 'Please choose Gangguan Hati for customer '+nomor_pax+'!</br>\n';
                                $("#adult_klinis_ada_gangguan_hati"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid red');
                                });
                                check_form_medical = 1;
                            }else{
                                $("#adult_klinis_ada_gangguan_hati"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                                });
                            }
                            if(document.getElementById('adult_klinis_ada_gangguan_paru_obstruksi_kronis' + nomor_pax).value == ''){
                                error_log+= 'Please choose Gangguan Paru Obstruksi for customer '+nomor_pax+'!</br>\n';
                                $("#adult_klinis_ada_gangguan_paru_obstruksi_kronis"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid red');
                                });
                                check_form_medical = 1;
                            }else{
                                $("#adult_klinis_ada_gangguan_paru_obstruksi_kronis"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                                });
                            }
                            $("#adult_penyakit_bawaan"+nomor_pax).each(function() {
                                $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                            });
                        }
                        else if(document.getElementById('adult_penyakit_bawaan'+nomor_pax).value == ''){
                            error_log+= 'Please choose Penyakit Bawaan for customer '+nomor_pax+'!</br>\n';
                            $("#adult_penyakit_bawaan"+nomor_pax).each(function() {
                                $(this).parent().find('.nice-select').css('border', '1px solid red');
                            });
                            check_form_medical = 1;
                        }
                        else{
                            $("#adult_penyakit_bawaan"+nomor_pax).each(function() {
                                $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                            });
                        }

                        //PERJALANAN
                        if(document.getElementById('adult_perjalanan'+nomor_pax).value == 'IYA'){
                            if(document.getElementById('adult_perjalanan_keluar_negeri' + nomor_pax).value == ''){
                                error_log+= 'Please choose Perjalanan Keluar Negeri for customer '+nomor_pax+'!</br>\n';
                                $("#adult_perjalanan_keluar_negeri"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid red');
                                });
                                check_form_faktor = 1;
                            }else{
                                $("#adult_perjalanan_keluar_negeri"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                                });
                            }
                            if(document.getElementById('adult_perjalanan_ke_transmisi_lokal' + nomor_pax).value == ''){
                                error_log+= 'Please choose Perjalanan Ke Transmisi Lokal for customer '+nomor_pax+'!</br>\n';
                                $("#adult_perjalanan_ke_transmisi_lokal"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid red');
                                });
                                check_form_faktor = 1;
                            }else{
                                $("#adult_perjalanan_ke_transmisi_lokal"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                                });
                            }
                            if(document.getElementById('adult_berkunjung_ke_fasilitas_kesehatan' + nomor_pax).value == ''){
                                error_log+= 'Please choose Berkunjung Ke Fasilitas Kesehatan for customer '+nomor_pax+'!</br>\n';
                                $("#adult_berkunjung_ke_fasilitas_kesehatan"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid red');
                                });
                                check_form_faktor = 1;
                            }else{
                                $("#adult_berkunjung_ke_fasilitas_kesehatan"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                                });
                            }
                            if(document.getElementById('adult_berkunjung_ke_pasar_hewan' + nomor_pax).value == ''){
                                error_log+= 'Please choose Berkunjung Ke Pasar Hewan for customer '+nomor_pax+'!</br>\n';
                                $("#adult_berkunjung_ke_pasar_hewan"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid red');
                                });
                                check_form_faktor = 1;
                            }else{
                                $("#adult_berkunjung_ke_pasar_hewan"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                                });
                            }
                            if(document.getElementById('adult_berkunjung_ke_pasien_dalam_pengawasan' + nomor_pax).value == ''){
                                error_log+= 'Please choose Berkunjung Ke Pasien Dalam Pengawasan for customer '+nomor_pax+'!</br>\n';
                                $("#adult_berkunjung_ke_pasien_dalam_pengawasan"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid red');
                                });
                                check_form_faktor = 1;
                            }else{
                                $("#adult_berkunjung_ke_pasien_dalam_pengawasan"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                                });
                            }
                            if(document.getElementById('adult_berkunjung_ke_pasien_konfirmasi' + nomor_pax).value == ''){
                                error_log+= 'Please choose Berkunjung Ke Pasien Konfirmasi for customer '+nomor_pax+'!</br>\n';
                                $("#adult_berkunjung_ke_pasien_konfirmasi"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid red');
                                });
                                check_form_faktor = 1;
                            }else{
                                $("#adult_berkunjung_ke_pasien_konfirmasi"+nomor_pax).each(function() {
                                    $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                                });
                            }

                            $("#adult_perjalanan"+nomor_pax).each(function() {
                                $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                            });
                        }
                        else if(document.getElementById('adult_perjalanan'+nomor_pax).value == ''){
                            error_log+= 'Please choose Perjalan for customer '+nomor_pax+'!</br>\n';
                            $("#adult_perjalanan"+nomor_pax).each(function() {
                                $(this).parent().find('.nice-select').css('border', '1px solid red');
                            });
                            check_form_faktor = 1;
                        }
                        else{
                            $("#adult_perjalanan"+nomor_pax).each(function() {
                                $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                            });
                        }

                        //BERKUNJUNG
//                        if(document.getElementById('adult_berkunjung'+nomor_pax).value == 'IYA'){
//
//                        }else if(document.getElementById('adult_berkunjung'+nomor_pax).value == ''){
//                            error_log+= 'Please choose Melakukan Berkunjung for customer '+nomor_pax+'!</br>\n';
//                            document.getElementById('adult_klinis_ada_gangguan_penciuman' + nomor_pax).style['border-color'] = 'red';
//                        }

                        if(document.getElementById('adult_termasuk_cluster_ispa' + nomor_pax).value == ''){
                            error_log+= 'Please choose Cluster ISPA (Saluran Pernapasan Akut) for customer '+nomor_pax+'!</br>\n';
                            $("#adult_termasuk_cluster_ispa"+nomor_pax).each(function() {
                                $(this).parent().find('.nice-select').css('border', '1px solid red');
                            });
                            check_form_faktor = 1;
                        }else{
                            $("#adult_termasuk_cluster_ispa"+nomor_pax).each(function() {
                                $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                            });
                        }
                        if(document.getElementById('adult_merupakan_petugas_kesehatan' + nomor_pax).value == ''){
                            error_log+= 'Please choose Petugas Kesehatan for customer '+nomor_pax+'!</br>\n';
                            $("#adult_merupakan_petugas_kesehatan"+nomor_pax).each(function() {
                                $(this).parent().find('.nice-select').css('border', '1px solid red');
                            });
                            check_form_faktor = 1;
                        }else{
                            $("#adult_merupakan_petugas_kesehatan"+nomor_pax).each(function() {
                                $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                            });
                        }
                        if(document.getElementById('adult_merupakan_petugas_kesehatan' + nomor_pax).value == 'IYA' && document.getElementById('adult_apd_yang_digunakan' + nomor_pax).value == ''){
                            error_log+= 'Please choose Petugas Kesehatan for customer '+nomor_pax+'!</br>\n';
                            $("#adult_apd_yang_digunakan"+nomor_pax).each(function() {
                                $(this).parent().find('.nice-select').css('border', '1px solid red');
                            });
                            check_form_faktor = 1;
                        }else{
                            $("#adult_apd_yang_digunakan"+nomor_pax).each(function() {
                                $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                            });
                        }
                        if(document.getElementById('adult_prosedur_menimbulkan_aerosol' + nomor_pax).value == ''){
                            error_log+= 'Please choose Prosedur Menimbulkan Aerosol for customer '+nomor_pax+'!</br>\n';
                            $("#adult_prosedur_menimbulkan_aerosol"+nomor_pax).each(function() {
                                $(this).parent().find('.nice-select').css('border', '1px solid red');
                            });
                            check_form_faktor = 1;
                        }else{
                            $("#adult_prosedur_menimbulkan_aerosol"+nomor_pax).each(function() {
                                $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                            });
                        }
                        if(document.getElementById('adult_prosedur_menimbulkan_aerosol' + nomor_pax).value == 'IYA' && document.getElementById('adult_tindakan_menimbulkan_aerosol' + nomor_pax).value == ''){
                            error_log+= 'Please fill Tindakan Aerosol for customer '+nomor_pax+'!</br>\n';
                            document.getElementById('adult_tindakan_menimbulkan_aerosol' + nomor_pax).style['border-color'] = 'red';
                            check_form_faktor = 1;
                        }else{
                            document.getElementById('adult_tindakan_menimbulkan_aerosol' + nomor_pax).style['border-color'] = '#EFEFEF';
                        }


                        perjalanan_keluar_negeri_list = [];
                        perjalanan_ke_transmisi_lokal_list = [];
                        berkunjung_ke_fasilitas_kesehatan_list = [];
                        berkunjung_ke_pasar_hewan_list = [];
                        berkunjung_ke_pasien_dalam_pengawasan_list = [];
                        berkunjung_ke_pasien_konfirmasi_list = [];
                        if(document.getElementById('adult_perjalanan'+nomor_pax).value == 'IYA'){
                            for(j=0;j<perjalanan_keluar_negeri;j++){
                                try{
                                    perjalanan_keluar_negeri_list.push({
                                        "nama_negara": document.getElementById('adult_perjalanan_keluar_negeri_nama_negara'+nomor_pax+'_'+j).value,
                                        "nama_kota": document.getElementById('adult_perjalanan_keluar_negeri_nama_kota'+nomor_pax+'_'+j).value,
                                        "tanggal_perjalanan": moment(document.getElementById('adult_perjalanan_keluar_negeri_tanggal_perjalanan'+nomor_pax+'_'+j).value).format('YYYY-MM-DD'),
                                        "tiba_di_indonesia": moment(document.getElementById('adult_perjalanan_keluar_negeri_tiba_di_indonesia'+nomor_pax+'_'+j).value).format('YYYY-MM-DD')
                                    });
                                }catch(err){

                                }
                            }

                            for(j=0;j<perjalanan_ke_transmisi_lokal;j++){
                                try{
                                    perjalanan_ke_transmisi_lokal_list.push({
                                        "nama_provinsi": document.getElementById('adult_perjalanan_ke_transmisi_lokal_nama_provinsi'+nomor_pax+'_'+j).value,
                                        "nama_kota": document.getElementById('adult_perjalanan_ke_transmisi_lokal_nama_kota'+nomor_pax+'_'+j).value,
                                        "tanggal_perjalanan": moment(document.getElementById('adult_perjalanan_ke_transmisi_lokal_tanggal_perjalanan'+nomor_pax+'_'+j).value).format('YYYY-MM-DD'),
                                        "tiba_disini": moment(document.getElementById('adult_perjalanan_ke_transmisi_lokal_tiba_di_sini'+nomor_pax+'_'+j).value).format('YYYY-MM-DD')
                                    });
                                }catch(err){

                                }
                            }
                            for(j=0;j<berkunjung_ke_fasilitas_kesehatan;j++){
                                try{
                                    berkunjung_ke_fasilitas_kesehatan_list.push({
                                        "nama_rumah_sakit": document.getElementById('adult_berkunjung_ke_fasilitas_kesehatan_nama_rumah_sakit'+nomor_pax+'_'+j).value,
                                        "nama_kota": document.getElementById('adult_berkunjung_ke_fasilitas_kesehatan_nama_kota'+nomor_pax+'_'+j).value,
                                        "nama_provinsi": document.getElementById('adult_berkunjung_ke_fasilitas_kesehatan_nama_provinsi'+nomor_pax+'_'+j).value,
                                        "tanggal_kunjungan": moment(document.getElementById('adult_berkunjung_ke_fasilitas_kesehatan_tanggal_kunjungan'+nomor_pax+'_'+j).value).format('YYYY-MM-DD')
                                    });
                                }catch(err){

                                }
                            }

                            for(j=0;j<berkunjung_ke_pasar_hewan;j++){
                                try{
                                    berkunjung_ke_pasar_hewan_list.push({
                                        "nama_lokasi_pasar": document.getElementById('adult_berkunjung_ke_pasar_hewan_nama_lokasi_pasar'+nomor_pax+'_'+j).value,
                                        "nama_kota": document.getElementById('adult_berkunjung_ke_pasar_hewan_nama_kota'+nomor_pax+'_'+j).value,
                                        "nama_provinsi": document.getElementById('adult_berkunjung_ke_pasar_hewan_nama_provinsi'+nomor_pax+'_'+j).value,
                                        "tanggal_kunjungan": moment(document.getElementById('adult_berkunjung_ke_pasar_hewan_tanggal_kunjungan'+nomor_pax+'_'+j).value).format('YYYY-MM-DD')
                                    });
                                }catch(err){

                                }
                            }

                            for(j=0;j<berkunjung_ke_pasien_dalam_pengawasan;j++){
                                try{
                                    berkunjung_ke_pasien_dalam_pengawasan_list.push({
                                        "nama_pasien": document.getElementById('adult_berkunjung_ke_pasien_dalam_pengawasan_nama_pasien'+nomor_pax+'_'+j).value,
                                        "nama_alamat": document.getElementById('adult_berkunjung_ke_pasien_dalam_pengawasan_alamat'+nomor_pax+'_'+j).value,
                                        "hubungan": document.getElementById('adult_berkunjung_ke_pasien_dalam_pengawasan_hubungan'+nomor_pax+'_'+j).value,
                                        "tanggal_kontak_pertama": moment(document.getElementById('adult_berkunjung_ke_pasien_dalam_pengawasan_tanggal_kontak_pertama'+nomor_pax+'_'+j).value).format('YYYY-MM-DD'),
                                        "tanggal_kontak_terakhir": moment(document.getElementById('adult_berkunjung_ke_pasien_dalam_pengawasan_tanggal_kontak_terakhir'+nomor_pax+'_'+j).value).format('YYYY-MM-DD')
                                    });
                                }catch(err){

                                }
                            }

                            for(j=0;j<berkunjung_ke_pasien_konfirmasi;j++){
                                try{
                                    berkunjung_ke_pasien_konfirmasi_list.push({
                                        "nama_pasien": document.getElementById('adult_berkunjung_ke_pasien_konfirmasi_nama_pasien1_0'+nomor_pax+'_'+j).value,
                                        "nama_alamat": document.getElementById('adult_berkunjung_ke_pasien_konfirmasi_alamat'+nomor_pax+'_'+j).value,
                                        "hubungan": document.getElementById('adult_berkunjung_ke_pasien_konfirmasi_hubungan'+nomor_pax+'_'+j).value,
                                        "tanggal_kontak_pertama": moment(document.getElementById('adult_berkunjung_ke_pasien_konfirmasi_tanggal_kontak_pertama'+nomor_pax+'_'+j).value).format('YYYY-MM-DD'),
                                        "tanggal_kontak_terakhir": moment(document.getElementById('adult_berkunjung_ke_pasien_konfirmasi_tanggal_kontak_terakhir'+nomor_pax+'_'+j).value).format('YYYY-MM-DD')
                                    });
                                }catch(err){

                                }
                            }
                        }
                        pcr_data = {
                            "nama_orang_tua": document.getElementById('adult_mother_name' + nomor_pax).value,
                            "kriteria_covid": document.getElementById('adult_kriteria_pasien' + nomor_pax).value,
                            "pemeriksaan_swab_ke": document.getElementById('adult_pemeriksaan_swab_ke' + nomor_pax).value,
                            "asal_perusahaan": document.getElementById('adult_perusahaan' + nomor_pax).value,
                            "nama_perusahaan": document.getElementById('adult_nama_perusahaan' + nomor_pax).value,
                            "klinis_golongan_darah": document.getElementById('adult_klinis_golongan_darah' + nomor_pax).value,
                            "klinis_sedang_hamil": document.getElementById('adult_klinis_sedang_hamil' + nomor_pax).value,

                            "termasuk_cluster_ispa": document.getElementById('adult_termasuk_cluster_ispa' + nomor_pax).value,
                            "merupakan_petugas_kesehatan": document.getElementById('adult_merupakan_petugas_kesehatan' + nomor_pax).value,
                            "apd_yang_digunakan": document.getElementById('adult_apd_yang_digunakan' + nomor_pax).value,
                            "prosedur_menimbulkan_aerosol": document.getElementById('adult_prosedur_menimbulkan_aerosol' + nomor_pax).value,
                            "tindakan_menimbulkan_aerosol": document.getElementById('adult_tindakan_menimbulkan_aerosol' + nomor_pax).value,
                            "faktor_lain": document.getElementById('adult_faktor_lain' + nomor_pax).value,
                            "gejala": document.getElementById('adult_gejala' + nomor_pax).value,
                            "penyakit_bawaan": document.getElementById('adult_penyakit_bawaan' + nomor_pax).value,
                            "perjalanan": document.getElementById('adult_perjalanan' + nomor_pax).value,
                        }

                        if(document.getElementById('adult_sedang_dirawat_di_rs' + nomor_pax).value == 'IYA'){
                            pcr_data["sedang_dirawat_di_rs"] = document.getElementById('adult_sedang_dirawat_di_rs' + nomor_pax).value;
                            pcr_data["nama_rs"] = document.getElementById('adult_nama_rs' + nomor_pax).value;
                            pcr_data["tanggal_masuk_rs"] = document.getElementById('adult_tanggal_masuk_rs' + nomor_pax).value;
                            pcr_data["nama_ruang_perawatan"] = document.getElementById('adult_nama_ruang_perawatan' + nomor_pax).value;
                            pcr_data["sedang_dirawat_di_icu"] = document.getElementById('adult_sedang_dirawat_di_icu' + nomor_pax).value;
                            pcr_data["menggunakan_intubasi"] = document.getElementById('adult_menggunakan_intubasi' + nomor_pax).value;
                            pcr_data["menggunakan_emco"] = document.getElementById('adult_menggunakan_emco' + nomor_pax).value;
                            pcr_data["nama_rs_lainnya"] = '';
                            pcr_data["status_terakhir"] = document.getElementById('adult_status_terakhir' + nomor_pax).value;

                            pcr_data["klinis_ada_penumonia"] = document.getElementById('adult_klinis_ada_penumonia' + nomor_pax).value;
                            pcr_data["klinis_ada_ards"] = document.getElementById('adult_klinis_ada_ards' + nomor_pax).value;
                            pcr_data["klinis_ards_detil"] = document.getElementById('adult_klinis_ards_detil' + nomor_pax).value;
                            pcr_data["klinis_ada_penyakit_pernafasan"] = document.getElementById('adult_klinis_ada_penyakit_pernafasan' + nomor_pax).value;
                            pcr_data["klinis_penyakit_pernafasan_detil"] = document.getElementById('adult_klinis_penyakit_pernafasan_detil' + nomor_pax).value;
                        }else{
                            pcr_data["sedang_dirawat_di_rs"] = 'TIDAK';
                            pcr_data["nama_rs"] = '';
                            pcr_data["tanggal_masuk_rs"] = '';
                            pcr_data["nama_ruang_perawatan"] = '';
                            pcr_data["sedang_dirawat_di_icu"] = 'TIDAK';
                            pcr_data["menggunakan_intubasi"] = '';
                            pcr_data["menggunakan_emco"] = 'TIDAK';
                            pcr_data["nama_rs_lainnya"] = '';
                            pcr_data["status_terakhir"] = '';
                            pcr_data["klinis_ada_penumonia"] = 'TIDAK';
                            pcr_data["klinis_ada_ards"] = 'TIDAK';
                            pcr_data["klinis_ards_detil"] = '';
                            pcr_data["klinis_ada_penyakit_pernafasan"] = 'TIDAK';
                            pcr_data["klinis_penyakit_pernafasan_detil"] = '';
                        }

                        if(document.getElementById('adult_gejala'+nomor_pax).value == 'IYA'){
                            pcr_data["tanggal_pertama_kali_gejala"] = document.getElementById('adult_tanggal_pertama_kali_gejala' + nomor_pax).value;
                            pcr_data["klinis_ada_demam"] = document.getElementById('adult_klinis_ada_demam' + nomor_pax).value;
                            pcr_data["klinis_suhu_tubuh"] = document.getElementById('adult_klinis_suhu_tubuh' + nomor_pax).value;
                            pcr_data["klinis_ada_batuk"] = document.getElementById('adult_klinis_ada_batuk' + nomor_pax).value;
                            pcr_data["klinis_ada_pilek"] = document.getElementById('adult_klinis_ada_pilek' + nomor_pax).value;
                            pcr_data["klinis_ada_sakit_tenggorokan"] = document.getElementById('adult_klinis_ada_sakit_tenggorokan' + nomor_pax).value;
                            pcr_data["klinis_ada_sesak"] = document.getElementById('adult_klinis_ada_sesak' + nomor_pax).value;
                            pcr_data["klinis_ada_sakit_kepala"] = document.getElementById('adult_klinis_ada_sakit_kepala' + nomor_pax).value;
                            pcr_data["klinis_ada_badan_lemah"] = document.getElementById('adult_klinis_ada_badan_lemah' + nomor_pax).value;
                            pcr_data["klinis_ada_nyeri_otot"] = document.getElementById('adult_klinis_ada_nyeri_otot' + nomor_pax).value;
                            pcr_data["klinis_ada_mual"] = document.getElementById('adult_klinis_ada_mual' + nomor_pax).value;
                            pcr_data["klinis_ada_nyeri_abdomen"] = document.getElementById('adult_klinis_ada_nyeri_abdomen' + nomor_pax).value;
                            pcr_data["klinis_ada_diare"] = document.getElementById('adult_klinis_ada_diare' + nomor_pax).value;
                            pcr_data["klinis_ada_gangguan_penciuman"] = document.getElementById('adult_klinis_ada_gangguan_penciuman' + nomor_pax).value;
                            pcr_data["klinis_gejala_lainnya"] = document.getElementById('adult_klinis_gejala_lainnya' + nomor_pax).value;
                        }else{
                            pcr_data["tanggal_pertama_kali_gejala"] = '';
                            pcr_data["klinis_ada_demam"] = 'TIDAK';
                            pcr_data["klinis_suhu_tubuh"] = '';
                            pcr_data["klinis_ada_batuk"] = 'TIDAK';
                            pcr_data["klinis_ada_pilek"] = 'TIDAK';
                            pcr_data["klinis_ada_sakit_tenggorokan"] = 'TIDAK';
                            pcr_data["klinis_ada_sesak"] = 'TIDAK';
                            pcr_data["klinis_ada_sakit_kepala"] = 'TIDAK';
                            pcr_data["klinis_ada_badan_lemah"] = 'TIDAK';
                            pcr_data["klinis_ada_nyeri_otot"] = 'TIDAK';
                            pcr_data["klinis_ada_mual"] = 'TIDAK';
                            pcr_data["klinis_ada_nyeri_abdomen"] = 'TIDAK';
                            pcr_data["klinis_ada_diare"] = 'TIDAK';
                            pcr_data["klinis_ada_gangguan_penciuman"] = 'TIDAK';
                            pcr_data["klinis_gejala_lainnya"] = '';
                        }

                        if(document.getElementById('adult_penyakit_bawaan'+nomor_pax).value == 'IYA'){
                            pcr_data["klinis_ada_diabetes"] = document.getElementById('adult_klinis_ada_diabetes' + nomor_pax).value;
                            pcr_data["klinis_ada_penyakit_jantung"] = document.getElementById('adult_klinis_ada_penyakit_jantung' + nomor_pax).value;
                            pcr_data["klinis_ada_hipertensi"] = document.getElementById('adult_klinis_ada_hipertensi' + nomor_pax).value;
                            pcr_data["klinis_ada_keganasan"] = document.getElementById('adult_klinis_ada_keganasan' + nomor_pax).value;
                            pcr_data["klinis_ada_gangguan_imunologi"] = document.getElementById('adult_klinis_ada_gangguan_imunologi' + nomor_pax).value;
                            pcr_data["klinis_ada_gangguan_ginjal"] = document.getElementById('adult_klinis_ada_gangguan_ginjal' + nomor_pax).value;
                            pcr_data["klinis_ada_gangguan_hati"] = document.getElementById('adult_klinis_ada_gangguan_hati' + nomor_pax).value;
                            pcr_data["klinis_ada_gangguan_paru_obstruksi_kronis"] = document.getElementById('adult_klinis_ada_gangguan_paru_obstruksi_kronis' + nomor_pax).value;
                            pcr_data["klinis_kondisi_penyerta_lainnya"] = document.getElementById('adult_klinis_kondisi_penyerta_lainnya' + nomor_pax).value;
                        }else{
                            pcr_data["klinis_ada_diabetes"] = 'TIDAK';
                            pcr_data["klinis_ada_penyakit_jantung"] = 'TIDAK';
                            pcr_data["klinis_ada_hipertensi"] = 'TIDAK';
                            pcr_data["klinis_ada_keganasan"] = 'TIDAK';
                            pcr_data["klinis_ada_gangguan_imunologi"] = 'TIDAK';
                            pcr_data["klinis_ada_gangguan_ginjal"] = 'TIDAK';
                            pcr_data["klinis_ada_gangguan_hati"] = 'TIDAK';
                            pcr_data["klinis_ada_gangguan_paru_obstruksi_kronis"] = 'TIDAK';
                            pcr_data["klinis_kondisi_penyerta_lainnya"] = '';
                        }

                        if(document.getElementById('adult_perjalanan'+nomor_pax).value == 'IYA'){
                            pcr_data["perjalanan_keluar_negeri"] = document.getElementById('adult_perjalanan_keluar_negeri' + nomor_pax).value;
                            pcr_data["daftar_perjalanan_keluar_negeri"] = perjalanan_keluar_negeri_list;
                            pcr_data["perjalanan_ke_transmisi_lokal"] = document.getElementById('adult_perjalanan_ke_transmisi_lokal' + nomor_pax).value;
                            pcr_data["daftar_perjalanan_ke_transmisi_lokal"] = perjalanan_ke_transmisi_lokal_list;
                            pcr_data["berkunjung_ke_fasilitas_kesehatan"] = document.getElementById('adult_berkunjung_ke_fasilitas_kesehatan' + nomor_pax).value;
                            pcr_data["daftar_ke_fasilitas_kesehatan"] = berkunjung_ke_fasilitas_kesehatan_list;
                            pcr_data["berkunjung_ke_pasar_hewan"] = document.getElementById('adult_berkunjung_ke_pasar_hewan' + nomor_pax).value;
                            pcr_data["daftar_ke_pasar_hewan"] = berkunjung_ke_pasar_hewan_list;
                            pcr_data["berkunjung_ke_pasien_dalam_pengawasan"] = document.getElementById('adult_berkunjung_ke_pasien_dalam_pengawasan' + nomor_pax).value;
                            pcr_data["daftar_ke_pasien_dalam_pengawasan"] = berkunjung_ke_pasien_dalam_pengawasan_list;
                            pcr_data["berkunjung_ke_pasien_konfirmasi"] = document.getElementById('adult_berkunjung_ke_pasien_konfirmasi' + nomor_pax).value;
                            pcr_data["daftar_ke_pasien_konfirmasi"] = berkunjung_ke_pasien_konfirmasi_list;
                        }else{
                            pcr_data["perjalanan_keluar_negeri"] = 'TIDAK';
                            pcr_data["daftar_perjalanan_keluar_negeri"] = perjalanan_keluar_negeri_list;
                            pcr_data["perjalanan_ke_transmisi_lokal"] = 'TIDAK';
                            pcr_data["daftar_perjalanan_ke_transmisi_lokal"] = perjalanan_ke_transmisi_lokal_list;
                            pcr_data["berkunjung_ke_fasilitas_kesehatan"] = 'TIDAK';
                            pcr_data["daftar_ke_fasilitas_kesehatan"] = berkunjung_ke_fasilitas_kesehatan_list;
                            pcr_data["berkunjung_ke_pasar_hewan"] = 'TIDAK';
                            pcr_data["daftar_ke_pasar_hewan"] = berkunjung_ke_pasar_hewan_list;
                            pcr_data["berkunjung_ke_pasien_dalam_pengawasan"] = 'TIDAK';
                            pcr_data["daftar_ke_pasien_dalam_pengawasan"] = berkunjung_ke_pasien_dalam_pengawasan_list;
                            pcr_data["berkunjung_ke_pasien_konfirmasi"] = 'TIDAK';
                            pcr_data["daftar_ke_pasien_konfirmasi"] = berkunjung_ke_pasien_konfirmasi_list;
                        }

                    }
                    if(i == 0){
                        request['booker'] = {
                            "first_name": document.getElementById('adult_first_name' + nomor_pax).value,
                            "last_name": document.getElementById('adult_last_name' + nomor_pax).value,
                            "title": document.getElementById('adult_title' + nomor_pax).value,
                            'email': document.getElementById('adult_email' + nomor_pax).value,
                            'calling_code': document.getElementById('adult_phone_code'+nomor_pax+'_id').value,
                            'mobile': document.getElementById('adult_phone'+nomor_pax).value,
                            'nationality_name': document.getElementById('adult_nationality' + nomor_pax).value,
                            'booker_seq_id': document.getElementById('adult_id' + nomor_pax).value
                        }
                        request['contact_person'] = [{
                            "first_name": document.getElementById('adult_first_name' + nomor_pax).value,
                            "last_name": document.getElementById('adult_last_name' + nomor_pax).value,
                            "title": document.getElementById('adult_title' + nomor_pax).value,
                            'email': document.getElementById('adult_email' + nomor_pax).value,
                            'calling_code': document.getElementById('adult_phone_code'+nomor_pax+'_id').value,
                            'mobile': document.getElementById('adult_phone'+nomor_pax).value,
                            'nationality_name': document.getElementById('adult_nationality' + nomor_pax).value,
                            'contact_seq_id': document.getElementById('adult_id' + nomor_pax).value,
                            'is_also_booker': true
                        }]
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
                            "identity_number": document.getElementById('adult_identity_number' + nomor_pax).value,
                            "identity_type": document.getElementById('adult_identity_type' + nomor_pax).value,
                            "identity_expdate": document.getElementById('adult_identity_expired_date'+ nomor_pax).value,
                        },
                        "passenger_seq_id": document.getElementById('adult_id' + nomor_pax).value,
                        "tempat_lahir": document.getElementById('adult_tempat_lahir' + nomor_pax).value,
                        "profession": document.getElementById('adult_profession' + nomor_pax).value,
                        "work_place": document.getElementById('adult_work_place' + nomor_pax).value,
                        "address": document.getElementById('adult_address' + nomor_pax).value,
                        "rt": document.getElementById('adult_rt' + nomor_pax).value,
                        "rw": document.getElementById('adult_rw' + nomor_pax).value,
                        "kabupaten": document.getElementById('adult_kabupaten' + nomor_pax).value,
                        "kecamatan": document.getElementById('adult_kecamatan' + nomor_pax).value,
                        "kelurahan": document.getElementById('adult_kelurahan' + nomor_pax).value,
                        "address_ktp": document.getElementById('adult_address_ktp' + nomor_pax).value,
                        "rt_ktp": document.getElementById('adult_rt_ktp' + nomor_pax).value,
                        "rw_ktp": document.getElementById('adult_rw_ktp' + nomor_pax).value,
                        "kabupaten_ktp": document.getElementById('adult_kabupaten_ktp' + nomor_pax).value,
                        "kecamatan_ktp": document.getElementById('adult_kecamatan_ktp' + nomor_pax).value,
                        "kelurahan_ktp": document.getElementById('adult_kelurahan_ktp' + nomor_pax).value,
                        "email": document.getElementById('adult_email' + nomor_pax).value,
                        "phone_number": document.getElementById('adult_phone_code'+nomor_pax+'_id').value + document.getElementById('adult_phone'+nomor_pax).value,
                        'is_also_booker': is_also_booker,
                        'is_also_contact': is_also_contact,
                        'pcr_data': pcr_data
                    })
                }catch(err){console.log(err);}

                var error_form = '';

                if(check_form_personal == 1 || check_form_medical == 1 || check_form_faktor == 1){
                    error_form+=`<h6 style="color:red;"><i class='fas fa-times-circle'></i> Missing Data or Wrong Data. </h6><span>Please check your data again on:  </span><br/>`;
                }
                if(check_form_personal == 1){
                    error_form += `<span><b style="color:red !important;">Personal Data</b></span><br/>`;
                }
                if(check_form_medical == 1){
                    error_form += `<span><b style="color:red !important;">Medical Data</b></span><br/>`;
                }
                if(check_form_faktor == 1){
                    error_form += `<span><b style="color:red !important;">Faktor Kontak/Paparan</b></span><br/>`;
                }

                var customer_id = nomor_pax - 1;
                if(vendor == 'phc'){
                    if(test_type == 'PHCHCKPCR' || test_type == 'PHCDTKPCR'){
                        document.getElementById('show_error_form'+customer_id).innerHTML = error_form;
                    }
                }

                if(check_form_personal == 1 || check_form_medical == 1 || check_form_faktor == 1){
                    document.getElementById('span_customer_data'+customer_id).innerHTML = "<i><i class='fas fa-times-circle'></i> Missing Data or Wrong Data. Please check your data again.</i>";
                    document.getElementById('div_form_customer'+customer_id).style = "padding: 20px 15px 0px 15px; border: 1px solid red !important;";
                    if(check_to_scroll == -1){
                        check_to_scroll = parseInt(i);
                    }
                    //scroll ke error yang paling teratas (bisa booker bisa customer 1 atau 2)
                }else{
                    document.getElementById('span_customer_data'+customer_id).innerHTML = "";
                    document.getElementById('div_form_customer'+customer_id).style = "padding: 20px 15px 0px 15px; border: 1px solid "+color+" !important;";
                }
            }

            if(check_scroll == ''){
                if(check_form_booker == 1){
                    check_scroll = 'booker';
                }else if(check_to_scroll != -1){
                    check_scroll = 'customer';
                }
            }

        }
    }

   if(error_log=='' && check_passenger == true){
//       re_medical_signin('next');
        document.getElementById('time_limit_input').value = 200;
        document.getElementById('data').value = JSON.stringify(request);
        document.getElementById('signature').value = signature;
        document.getElementById('vendor').value = vendor;
        document.getElementById('test_type').value = test_type;
        document.getElementById('medical_review').submit();
   }else{
       document.getElementById('show_error_log').innerHTML = error_log;
       $('.next-passenger-train').removeClass("running");
       $('.next-passenger-train').attr("disabled", false);
       $("#myModalErrorPassenger").modal('show');
       $('.next-loading').removeClass("running");
       $('.next-loading').prop('disabled', false);
       $('.loader-rodextrip').fadeOut();

       if(check_scroll == "booker"){
            $('html, body').animate({
                scrollTop: $("#booker").offset().top - 120
            }, 500);
       }else if(check_scroll == "address"){
            $('html, body').animate({
                scrollTop: $("#div_schedule_medical").offset().top - 120
            }, 500);
       }else{
            $('html, body').animate({
               scrollTop: $("#table_passenger"+check_to_scroll).offset().top - 120
            }, 500);
       }
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
        <th style="width:10%;">No</th>
        <th style="width:40%;">Name</th>
        <th style="width:20%;">Birth Date</th>
        <th style="width:15%;">Sample Method</th>
        <th style="width:10%;"></th>
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

function add_table(change_rebooking=false){
    var tempcounter = parseInt(document.getElementById('passenger').value);
    if(tempcounter > last_counter){
        document.getElementById('table_passenger_list').style.display = 'block';
        for(counting=last_counter;counting<tempcounter;counting++){
            add_table_of_passenger();

        }
    }else{
        for(counting=last_counter-1;counting>=tempcounter;counting--){
            delete_table_of_passenger(counting);
        }
        counter_passenger = tempcounter;
    }
    document.getElementById('medical_detail').style.display = 'none';
    document.getElementById('next_medical').style.display = 'none';
    if(change_rebooking == true && total_passengers_rebooking != 0){
        //readd change value pax add table
        document.getElementById('passenger').value = total_passengers_rebooking;
        $('#passenger').niceSelect('update');
        tempcounter = total_passengers_rebooking;
        last_counter = 1;
        add_table();
        last_counter = tempcounter;
        // isi data
        get_data_cache_passenger_medical();
    }
    last_counter = tempcounter;
}

function update_customer_fill(type,seq){
    if(vendor == 'phc'){
        if(test_type == 'PHCHCKPCR' || test_type == 'PHCDTKPCR'){
            if(type == 'fill'){
                next_prev_form_medical(type, 1, seq);
            }
        }
    }
    var form_show = document.getElementById('div_passenger_list'+seq);

    if (form_show.style.display === "none") {
        form_show.style.display = "block";
        document.getElementById("button_pax"+seq).innerHTML = `Close <i class="fas fa-chevron-up"></i>`;
    }

    else {
        form_show.style.display = "none";
        update_contact('passenger', (parseInt(seq)+1));
        document.getElementById("button_pax"+seq).innerHTML = `Fill <i class="fas fa-pen"></i>`;
    }

    if(type == 'save'){
        max_seq = parseInt(document.getElementById('passenger').value);
        next_seq = parseInt(seq+1);
        if(next_seq < max_seq){
            $('html, body').animate({
                scrollTop: $("#table_passenger"+next_seq).offset().top - 120
            }, 500);
        }else{
            $('html, body').animate({
                scrollTop: $("#div_schedule_medical").offset().top - 120
            }, 500);
        }
    }
}

function clear_text_medical(sequence){
    document.getElementById("name_pax"+sequence).textContent = "-- Blank Customer Data --";
    document.getElementById("birth_date"+sequence).textContent = "";
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

function next_prev_form_medical(type, counter, id){
    pax = parseInt(id);
    counter = parseInt(counter);
    document.getElementById("progress_med"+counter+pax).style = "background-color:"+text_color+"; color:"+color+";";
    document.getElementById("progress_tab"+counter+pax).style = "background-color:"+color+"; color: white;";
    document.getElementById("progress_label"+counter+pax).style = "cursor:pointer; color:"+text_color+" !important;";
    document.getElementById("progress_div"+counter+pax).style.display = "block";

    length_progress = $(".progress_medical"+pax).length;
    for (var i = 1; i <= length_progress; i++) {
        if(i != counter){
            document.getElementById("progress_med"+i+pax).style = "background-color: #9B9B9B; color:white;";
            document.getElementById("progress_tab"+i+pax).style = "background-color: white; color:black;";
            document.getElementById("progress_label"+i+pax).style = "cursor:pointer; color: black !important;";
            document.getElementById("progress_div"+i+pax).style.display = "none";
        }
    }

    if(type != 'fill'){
        $('html, body').animate({
            scrollTop: $("#div_passenger_list"+pax).offset().top - 120
        }, 500);
    }
}

function auto_fill_phc_antigen(){
    var counter = 1;
    for(idx in passenger_data_cache_medical){
        if(idx == 0){
            document.getElementById('booker_first_name').value = passenger_data_cache_medical[idx].first_name;
            document.getElementById('booker_last_name').value = passenger_data_cache_medical[idx].last_name;
            document.getElementById('booker_title').value = passenger_data_cache_medical[idx].title;
            document.getElementById('booker_email').value = passenger_data_cache_medical[idx].email;
            if(passenger_data_cache_medical[idx].phone_number.substr(0,2) == '62'){
                document.getElementById('booker_phone_code_id').value = '62';
                document.getElementById('select2-booker_phone_code_id-container').innerHTML = '62';
                document.getElementById('booker_phone').value = passenger_data_cache_medical[idx].phone_number.substr(2,100);
            }else if(passenger_data_cache_medical[idx].phone_number.substr(0,1) == '0'){
                document.getElementById('booker_phone_code_id').value = '0';
                document.getElementById('select2-booker_phone_code_id-container').innerHTML = '0';
                document.getElementById('booker_phone').value = passenger_data_cache_medical[idx].phone_number.substr(1,100);
            }else{
                document.getElementById('booker_phone_code_id').value = passenger_data_cache_medical[idx].phone_number.substr(0,2);
                document.getElementById('select2-booker_phone_code_id-container').innerHTML = passenger_data_cache_medical[idx].phone_number.substr(0,2);
                document.getElementById('booker_phone').value = passenger_data_cache_medical[idx].phone_number.substr(2,100);
            }
            document.getElementById('booker_nationality_id').value = passenger_data_cache_medical[idx].nationality_name;
            document.getElementById('select2-booker_nationality_id-container').innerHTML = passenger_data_cache_medical[idx].nationality_name;
            document.getElementsByName('myRadios')[0].checked = 'checked';

            copy_booker_to_passenger('copy','medical');
        }
        document.getElementById('adult_title'+counter).value = passenger_data_cache_medical[idx].title;
        document.getElementById('adult_first_name'+counter).value = passenger_data_cache_medical[idx].first_name;
        document.getElementById('adult_last_name'+counter).value = passenger_data_cache_medical[idx].last_name;
        document.getElementById('adult_nationality'+counter).value = passenger_data_cache_medical[idx].nationality_name;
        document.getElementById('select2-adult_nationality'+counter+'_id-container').innerHTML = passenger_data_cache_medical[idx].nationality_name;
        document.getElementById('adult_birth_date'+counter).value = passenger_data_cache_medical[idx].birth_date;
        document.getElementById('adult_tempat_lahir'+counter).value = passenger_data_cache_medical[idx].tempat_lahir;
        document.getElementById('select2-adult_tempat_lahir'+counter+'_id-container').innerHTML = passenger_data_cache_medical[idx].tempat_lahir;
        if(passenger_data_cache_medical[idx].identity_type != 'passport'){
            document.getElementById('adult_identity_type'+counter).value = passenger_data_cache_medical[idx].identity_type;
            document.getElementById('adult_identity_number'+counter).value = passenger_data_cache_medical[idx].identity_number;
            document.getElementById('adult_country_of_issued'+counter).value = passenger_data_cache_medical[idx].identity_country_of_issued_name;
            document.getElementById('select2-adult_country_of_issued'+counter+'_id-container').innerHTML = passenger_data_cache_medical[idx].identity_country_of_issued_name;
        }
        if(passenger_data_cache_medical[idx].phone_number.substr(0,2) == '62'){
            document.getElementById('adult_phone_code'+counter).value = '62';
            document.getElementById('select2-adult_phone_code'+counter+'_id-container').innerHTML = '62';
            document.getElementById('adult_phone'+counter).value = passenger_data_cache_medical[idx].phone_number.substr(2,100);
        }else if(passenger_data_cache_medical[idx].phone_number.substr(0,1) == '0'){
            document.getElementById('adult_phone_code'+counter).value = '0';
            document.getElementById('select2-adult_phone_code'+counter+'_id-container').innerHTML = '0';
            document.getElementById('adult_phone'+counter).value = passenger_data_cache_medical[idx].phone_number.substr(1,100);
        }else{
            document.getElementById('adult_phone_code'+counter).value = passenger_data_cache_medical[idx].phone_number.substr(0,2);
            document.getElementById('select2-adult_phone_code'+counter+'_id-container').innerHTML = passenger_data_cache_medical[idx].phone_number.substr(0,2);
            document.getElementById('adult_phone'+counter).value = passenger_data_cache_medical[idx].phone_number.substr(2,100);
        }
        document.getElementById('adult_email'+counter).value = passenger_data_cache_medical[idx].email;



        document.getElementById('adult_profession'+counter).value = passenger_data_cache_medical[idx].profession;
        if(passenger_data_cache_medical[idx].work_place)
            document.getElementById('adult_work_place'+counter).value = passenger_data_cache_medical[idx].work_place;

        document.getElementById('adult_address_ktp'+counter).value = passenger_data_cache_medical[idx].address_ktp;
        document.getElementById('adult_rt_ktp'+counter).value = passenger_data_cache_medical[idx].rt_ktp;
        document.getElementById('adult_rw_ktp'+counter).value = passenger_data_cache_medical[idx].rw_ktp;
        document.getElementById('adult_kabupaten_ktp'+counter).value = passenger_data_cache_medical[idx].kabupaten_ktp;
        document.getElementById('select2-adult_kabupaten_ktp'+counter+'_id-container').innerHTML = passenger_data_cache_medical[idx].kabupaten_ktp;
        get_kecamatan('adult_kabupaten_ktp'+counter,'adult_kecamatan_ktp'+counter+'_id');

        console.log(passenger_data_cache_medical[idx]);
        document.getElementById('adult_kecamatan_ktp'+counter).value = passenger_data_cache_medical[idx].kecamatan_ktp;
        document.getElementById('select2-adult_kecamatan_ktp'+counter+'_id-container').innerHTML = passenger_data_cache_medical[idx].kecamatan_ktp;
        get_kelurahan('adult_kecamatan_ktp'+counter,'adult_kelurahan_ktp'+counter+'_id');

        document.getElementById('adult_kelurahan_ktp'+counter).value = passenger_data_cache_medical[idx].kelurahan_ktp;
        document.getElementById('select2-adult_kelurahan_ktp'+counter+'_id-container').innerHTML = passenger_data_cache_medical[idx].kelurahan_ktp;

        document.getElementById('adult_address'+counter).value = passenger_data_cache_medical[idx].address;
        document.getElementById('adult_rt'+counter).value = passenger_data_cache_medical[idx].rt;
        document.getElementById('adult_rw'+counter).value = passenger_data_cache_medical[idx].rw;
        document.getElementById('adult_kabupaten'+counter).value = passenger_data_cache_medical[idx].kabupaten;
        document.getElementById('select2-adult_kabupaten'+counter+'_id-container').innerHTML = passenger_data_cache_medical[idx].kabupaten;
        get_kecamatan('adult_kabupaten'+counter,'adult_kecamatan'+counter+'_id');

        document.getElementById('adult_kecamatan'+counter).value = passenger_data_cache_medical[idx].kecamatan;
        document.getElementById('select2-adult_kecamatan'+counter+'_id-container').innerHTML = passenger_data_cache_medical[idx].kecamatan;
        get_kelurahan('adult_kecamatan'+counter,'adult_kelurahan'+counter+'_id');

        document.getElementById('adult_kelurahan'+counter).value = passenger_data_cache_medical[idx].kelurahan;
        document.getElementById('select2-adult_kelurahan'+counter+'_id-container').innerHTML = passenger_data_cache_medical[idx].kelurahan;

        $('#adult_title'+counter).niceSelect('update');
        $('#adult_identity_type'+counter).niceSelect('update');
        $('#adult_profession'+counter).niceSelect('update');
        update_contact('passenger',counter);
        counter++;
    }
}

function auto_fill_phc_pcr(){
    var counter = 1;
    for(idx in passenger_data_cache_medical){
        if(idx == 0){
            document.getElementById('booker_first_name').value = passenger_data_cache_medical[idx].first_name;
            document.getElementById('booker_last_name').value = passenger_data_cache_medical[idx].last_name;
            document.getElementById('booker_title').value = passenger_data_cache_medical[idx].title;
            document.getElementById('booker_email').value = passenger_data_cache_medical[idx].email;
            if(passenger_data_cache_medical[idx].phone_number.substr(0,2) == '62'){
                document.getElementById('booker_phone_code_id').value = '62';
                document.getElementById('select2-booker_phone_code_id-container').innerHTML = '62';
                document.getElementById('booker_phone').value = passenger_data_cache_medical[idx].phone_number.substr(2,100);
            }else if(passenger_data_cache_medical[idx].phone_number.substr(0,1) == '0'){
                document.getElementById('booker_phone_code_id').value = '0';
                document.getElementById('select2-booker_phone_code_id-container').innerHTML = '0';
                document.getElementById('booker_phone').value = passenger_data_cache_medical[idx].phone_number.substr(1,100);
            }else{
                document.getElementById('booker_phone_code_id').value = passenger_data_cache_medical[idx].phone_number.substr(0,2);
                document.getElementById('select2-booker_phone_code_id-container').innerHTML = passenger_data_cache_medical[idx].phone_number.substr(0,2);
                document.getElementById('booker_phone').value = passenger_data_cache_medical[idx].phone_number.substr(2,100);
            }
            document.getElementById('booker_nationality_id').value = passenger_data_cache_medical[idx].nationality_name;
            document.getElementById('select2-booker_nationality_id-container').innerHTML = passenger_data_cache_medical[idx].nationality_name;
            document.getElementsByName('myRadios')[0].checked = 'checked';

            copy_booker_to_passenger('copy','medical');
        }
        document.getElementById('adult_title'+counter).value = passenger_data_cache_medical[idx].title;
        onchange_title(counter);
        document.getElementById('adult_first_name'+counter).value = passenger_data_cache_medical[idx].first_name;

        document.getElementById('adult_last_name'+counter).value = passenger_data_cache_medical[idx].last_name;
        document.getElementById('adult_nationality'+counter).value = passenger_data_cache_medical[idx].nationality_name;
        document.getElementById('select2-adult_nationality'+counter+'_id-container').innerHTML = passenger_data_cache_medical[idx].nationality_name;
        document.getElementById('adult_birth_date'+counter).value = passenger_data_cache_medical[idx].birth_date;
        document.getElementById('adult_tempat_lahir'+counter).value = passenger_data_cache_medical[idx].tempat_lahir;
        document.getElementById('select2-adult_tempat_lahir'+counter+'_id-container').innerHTML = passenger_data_cache_medical[idx].tempat_lahir;
        document.getElementById('adult_identity_type'+counter).value = passenger_data_cache_medical[idx].identity_type;
        document.getElementById('adult_identity_number'+counter).value = passenger_data_cache_medical[idx].identity_number;
        document.getElementById('adult_country_of_issued'+counter).value = passenger_data_cache_medical[idx].identity_country_of_issued_name;
        document.getElementById('select2-adult_country_of_issued'+counter+'_id-container').innerHTML = passenger_data_cache_medical[idx].identity_country_of_issued_name;
        if(passenger_data_cache_medical[idx].phone_number.substr(0,2) == '62'){
            document.getElementById('adult_phone_code'+counter).value = '62';
            document.getElementById('select2-adult_phone_code'+counter+'_id-container').innerHTML = '62';
            document.getElementById('adult_phone'+counter).value = passenger_data_cache_medical[idx].phone_number.substr(2,100);
        }else if(passenger_data_cache_medical[idx].phone_number.substr(0,1) == '0'){
            document.getElementById('adult_phone_code'+counter).value = '0';
            document.getElementById('select2-adult_phone_code'+counter+'_id-container').innerHTML = '0';
            document.getElementById('adult_phone'+counter).value = passenger_data_cache_medical[idx].phone_number.substr(1,100);
        }else{
            document.getElementById('adult_phone_code'+counter).value = passenger_data_cache_medical[idx].phone_number.substr(0,2);
            document.getElementById('select2-adult_phone_code'+counter+'_id-container').innerHTML = passenger_data_cache_medical[idx].phone_number.substr(0,2);
            document.getElementById('adult_phone'+counter).value = passenger_data_cache_medical[idx].phone_number.substr(2,100);
        }
        document.getElementById('adult_email'+counter).value = passenger_data_cache_medical[idx].email;

        if(passenger_data_cache_medical[idx].identity_expdate){
            set_exp_identity(counter);
            document.getElementById('adult_identity_expired_date'+counter).value = moment(passenger_data_cache_medical[idx].identity_expdate, 'YYYY-MM-DD').format('DD MMM YYYY');
        }

        document.getElementById('adult_profession'+counter).value = passenger_data_cache_medical[idx].profession;
        if(passenger_data_cache_medical[idx].work_place)
            document.getElementById('adult_work_place'+counter).value = passenger_data_cache_medical[idx].work_place;

        document.getElementById('adult_address_ktp'+counter).value = passenger_data_cache_medical[idx].address_ktp;
        document.getElementById('adult_rt_ktp'+counter).value = passenger_data_cache_medical[idx].rt_ktp;
        document.getElementById('adult_rw_ktp'+counter).value = passenger_data_cache_medical[idx].rw_ktp;
        document.getElementById('adult_kabupaten_ktp'+counter).value = passenger_data_cache_medical[idx].kabupaten_ktp;
        document.getElementById('select2-adult_kabupaten_ktp'+counter+'_id-container').innerHTML = passenger_data_cache_medical[idx].kabupaten_ktp;
        get_kecamatan('adult_kabupaten_ktp'+counter,'adult_kecamatan_ktp'+counter+'_id');

        console.log(passenger_data_cache_medical[idx]);
        document.getElementById('adult_kecamatan_ktp'+counter).value = passenger_data_cache_medical[idx].kecamatan_ktp;
        document.getElementById('select2-adult_kecamatan_ktp'+counter+'_id-container').innerHTML = passenger_data_cache_medical[idx].kecamatan_ktp;
        get_kelurahan('adult_kecamatan_ktp'+counter,'adult_kelurahan_ktp'+counter+'_id');

        document.getElementById('adult_kelurahan_ktp'+counter).value = passenger_data_cache_medical[idx].kelurahan_ktp;
        document.getElementById('select2-adult_kelurahan_ktp'+counter+'_id-container').innerHTML = passenger_data_cache_medical[idx].kelurahan_ktp;

        document.getElementById('adult_address'+counter).value = passenger_data_cache_medical[idx].address;
        document.getElementById('adult_rt'+counter).value = passenger_data_cache_medical[idx].rt;
        document.getElementById('adult_rw'+counter).value = passenger_data_cache_medical[idx].rw;
        document.getElementById('adult_kabupaten'+counter).value = passenger_data_cache_medical[idx].kabupaten;
        document.getElementById('select2-adult_kabupaten'+counter+'_id-container').innerHTML = passenger_data_cache_medical[idx].kabupaten;
        get_kecamatan('adult_kabupaten'+counter,'adult_kecamatan'+counter+'_id');

        document.getElementById('adult_kecamatan'+counter).value = passenger_data_cache_medical[idx].kecamatan;
        document.getElementById('select2-adult_kecamatan'+counter+'_id-container').innerHTML = passenger_data_cache_medical[idx].kecamatan;
        get_kelurahan('adult_kecamatan'+counter,'adult_kelurahan'+counter+'_id');

        document.getElementById('adult_kelurahan'+counter).value = passenger_data_cache_medical[idx].kelurahan;
        document.getElementById('select2-adult_kelurahan'+counter+'_id-container').innerHTML = passenger_data_cache_medical[idx].kelurahan;

        if(Object.keys(passenger_data_cache_medical[idx].pcr_data).length != 0){
            document.getElementById('adult_klinis_sedang_hamil'+counter).value = passenger_data_cache_medical[idx].pcr_data.klinis_sedang_hamil;
            document.getElementById('adult_mother_name'+counter).value = passenger_data_cache_medical[idx].pcr_data.nama_orang_tua;
            document.getElementById('adult_perusahaan'+counter).value = passenger_data_cache_medical[idx].pcr_data.asal_perusahaan;
            document.getElementById('adult_nama_perusahaan'+counter).value = passenger_data_cache_medical[idx].pcr_data.nama_perusahaan;


            document.getElementById('adult_kriteria_pasien'+counter).value = passenger_data_cache_medical[idx].pcr_data.kriteria_covid;
            change_kriteria(counter);
            document.getElementById('adult_pemeriksaan_swab_ke'+counter).value = passenger_data_cache_medical[idx].pcr_data.pemeriksaan_swab_ke;
            document.getElementById('adult_sedang_dirawat_di_rs'+counter).value = passenger_data_cache_medical[idx].pcr_data.sedang_dirawat_di_rs;
            document.getElementById('adult_nama_rs'+counter).value = passenger_data_cache_medical[idx].pcr_data.nama_rs;
            document.getElementById('adult_tanggal_masuk_rs'+counter).value = passenger_data_cache_medical[idx].pcr_data.tanggal_masuk_rs;
            document.getElementById('adult_nama_ruang_perawatan'+counter).value = passenger_data_cache_medical[idx].pcr_data.nama_ruang_perawatan;
            document.getElementById('adult_sedang_dirawat_di_icu'+counter).value = passenger_data_cache_medical[idx].pcr_data.sedang_dirawat_di_icu;
            document.getElementById('adult_menggunakan_intubasi'+counter).value = passenger_data_cache_medical[idx].pcr_data.menggunakan_intubasi;
            document.getElementById('adult_menggunakan_emco'+counter).value = passenger_data_cache_medical[idx].pcr_data.menggunakan_emco;
            document.getElementById('adult_status_terakhir'+counter).value = passenger_data_cache_medical[idx].pcr_data.status_terakhir;
            document.getElementById('adult_klinis_ada_penumonia'+counter).value = passenger_data_cache_medical[idx].pcr_data.klinis_ada_penumonia;
            document.getElementById('adult_klinis_ada_ards'+counter).value = passenger_data_cache_medical[idx].pcr_data.klinis_ada_ards;
            onchange_ards(counter);
            document.getElementById('adult_klinis_ards_detil'+counter).value = passenger_data_cache_medical[idx].pcr_data.klinis_ards_detil;
            document.getElementById('adult_klinis_ada_penyakit_pernafasan'+counter).value = passenger_data_cache_medical[idx].pcr_data.klinis_ada_penyakit_pernafasan;
            document.getElementById('adult_tanggal_pertama_kali_gejala'+counter).value = passenger_data_cache_medical[idx].pcr_data.tanggal_pertama_kali_gejala;
            document.getElementById('adult_klinis_ada_demam'+counter).value = passenger_data_cache_medical[idx].pcr_data.klinis_ada_demam;
            onchange_demam(counter)
            document.getElementById('adult_klinis_suhu_tubuh'+counter).value = passenger_data_cache_medical[idx].pcr_data.klinis_suhu_tubuh;
            document.getElementById('adult_klinis_ada_batuk'+counter).value = passenger_data_cache_medical[idx].pcr_data.klinis_ada_batuk;
            document.getElementById('adult_klinis_ada_pilek'+counter).value = passenger_data_cache_medical[idx].pcr_data.klinis_ada_pilek;
            document.getElementById('adult_klinis_ada_sakit_tenggorokan'+counter).value = passenger_data_cache_medical[idx].pcr_data.klinis_ada_sakit_tenggorokan;
            document.getElementById('adult_klinis_ada_sesak'+counter).value = passenger_data_cache_medical[idx].pcr_data.klinis_ada_sesak;
            document.getElementById('adult_klinis_ada_sakit_kepala'+counter).value = passenger_data_cache_medical[idx].pcr_data.klinis_ada_sakit_kepala;
            document.getElementById('adult_klinis_ada_badan_lemah'+counter).value = passenger_data_cache_medical[idx].pcr_data.klinis_ada_badan_lemah;
            document.getElementById('adult_klinis_ada_nyeri_otot'+counter).value = passenger_data_cache_medical[idx].pcr_data.klinis_ada_nyeri_otot;
            document.getElementById('adult_klinis_ada_mual'+counter).value = passenger_data_cache_medical[idx].pcr_data.klinis_ada_mual;
            document.getElementById('adult_klinis_ada_nyeri_abdomen'+counter).value = passenger_data_cache_medical[idx].pcr_data.klinis_ada_nyeri_abdomen;
            document.getElementById('adult_klinis_ada_gangguan_penciuman'+counter).value = passenger_data_cache_medical[idx].pcr_data.klinis_ada_gangguan_penciuman;
            document.getElementById('adult_klinis_golongan_darah'+counter).value = passenger_data_cache_medical[idx].pcr_data.klinis_golongan_darah;
            document.getElementById('adult_klinis_gejala_lainnya'+counter).value = passenger_data_cache_medical[idx].pcr_data.klinis_gejala_lainnya;
            document.getElementById('adult_klinis_ada_diabetes'+counter).value = passenger_data_cache_medical[idx].pcr_data.klinis_ada_diabetes;
            document.getElementById('adult_klinis_ada_penyakit_jantung'+counter).value = passenger_data_cache_medical[idx].pcr_data.klinis_ada_penyakit_jantung;
            document.getElementById('adult_klinis_ada_hipertensi'+counter).value = passenger_data_cache_medical[idx].pcr_data.klinis_ada_hipertensi;
            document.getElementById('adult_klinis_ada_keganasan'+counter).value = passenger_data_cache_medical[idx].pcr_data.klinis_ada_keganasan;
            document.getElementById('adult_klinis_ada_gangguan_imunologi'+counter).value = passenger_data_cache_medical[idx].pcr_data.klinis_ada_gangguan_imunologi;
            document.getElementById('adult_klinis_ada_gangguan_ginjal'+counter).value = passenger_data_cache_medical[idx].pcr_data.klinis_ada_gangguan_ginjal;
            document.getElementById('adult_klinis_ada_gangguan_hati'+counter).value = passenger_data_cache_medical[idx].pcr_data.klinis_ada_gangguan_hati;
            document.getElementById('adult_klinis_ada_diare'+counter).value = passenger_data_cache_medical[idx].pcr_data.klinis_ada_gangguan_hati;
            document.getElementById('adult_klinis_ada_gangguan_paru_obstruksi_kronis'+counter).value = passenger_data_cache_medical[idx].pcr_data.klinis_ada_gangguan_paru_obstruksi_kronis;
            document.getElementById('adult_klinis_kondisi_penyerta_lainnya'+counter).value = passenger_data_cache_medical[idx].pcr_data.klinis_kondisi_penyerta_lainnya;
            document.getElementById('adult_klinis_ada_hipertensi'+counter).value = passenger_data_cache_medical[idx].pcr_data.klinis_ada_hipertensi;


            document.getElementById('adult_perjalanan_keluar_negeri'+counter).value = passenger_data_cache_medical[idx].pcr_data.perjalanan_keluar_negeri;
            onchange_perjalanan_keluar_negeri(counter);
            for(idy in passenger_data_cache_medical[idx].pcr_data.daftar_perjalanan_keluar_negeri){
                add_pcr_table('perjalanan_keluar_negeri', counter);
                document.getElementById('adult_perjalanan_keluar_negeri_nama_negara'+counter+'_'+idy).value = passenger_data_cache_medical[idx].pcr_data.daftar_perjalanan_keluar_negeri[idy].nama_negara
                document.getElementById('adult_perjalanan_keluar_negeri_nama_kota'+counter+'_'+idy).value = passenger_data_cache_medical[idx].pcr_data.daftar_perjalanan_keluar_negeri[idy].nama_kota
                document.getElementById('adult_perjalanan_keluar_negeri_tanggal_perjalanan'+counter+'_'+idy).value = moment(passenger_data_cache_medical[idx].pcr_data.daftar_perjalanan_keluar_negeri[idy].tanggal_perjalanan, 'YYYY-MM-DD').format('DD MMM YYYY')
                document.getElementById('adult_perjalanan_keluar_negeri_tiba_di_indonesia'+counter+'_'+idy).value = moment(passenger_data_cache_medical[idx].pcr_data.daftar_perjalanan_keluar_negeri[idy].tiba_di_indonesia, 'YYYY-MM-DD').format('DD MMM YYYY')
            }

            document.getElementById('adult_perjalanan_ke_transmisi_lokal'+counter).value = passenger_data_cache_medical[idx].pcr_data.perjalanan_ke_transmisi_lokal;
            onchange_perjalanan_ke_transmisi_lokal(counter)
            for(idy in passenger_data_cache_medical[idx].pcr_data.daftar_perjalanan_ke_transmisi_lokal){
                add_pcr_table('perjalanan_ke_transmisi_lokal', counter);
                document.getElementById('adult_perjalanan_ke_transmisi_lokal_nama_provinsi'+counter+'_'+idy).value = passenger_data_cache_medical[idx].pcr_data.daftar_perjalanan_ke_transmisi_lokal[idy].nama_provinsi
                document.getElementById('adult_perjalanan_ke_transmisi_lokal_nama_kota'+counter+'_'+idy).value = passenger_data_cache_medical[idx].pcr_data.daftar_perjalanan_ke_transmisi_lokal[idy].nama_kota
                document.getElementById('adult_perjalanan_ke_transmisi_lokal_tanggal_perjalanan'+counter+'_'+idy).value = moment(passenger_data_cache_medical[idx].pcr_data.daftar_perjalanan_ke_transmisi_lokal[idy].tanggal_perjalanan, 'YYYY-MM-DD').format('DD MMM YYYY')
                document.getElementById('adult_perjalanan_ke_transmisi_lokal_tiba_di_sini'+counter+'_'+idy).value = moment(passenger_data_cache_medical[idx].pcr_data.daftar_perjalanan_ke_transmisi_lokal[idy].tiba_disini, 'YYYY-MM-DD').format('DD MMM YYYY')
            }

            document.getElementById('adult_berkunjung_ke_fasilitas_kesehatan'+counter).value = passenger_data_cache_medical[idx].pcr_data.berkunjung_ke_fasilitas_kesehatan;
            onchange_berkunjung_ke_fasilitas_kesehatan(counter)
            for(idy in passenger_data_cache_medical[idx].pcr_data.daftar_ke_fasilitas_kesehatan){
                add_pcr_table('berkunjung_ke_fasilitas_kesehatan',counter);
                document.getElementById('adult_berkunjung_ke_fasilitas_kesehatan_nama_rumah_sakit'+counter+'_'+idy).value = passenger_data_cache_medical[idx].pcr_data.daftar_ke_fasilitas_kesehatan[idy].nama_rumah_sakit
                document.getElementById('adult_berkunjung_ke_fasilitas_kesehatan_nama_kota'+counter+'_'+idy).value = passenger_data_cache_medical[idx].pcr_data.daftar_ke_fasilitas_kesehatan[idy].nama_kota
                document.getElementById('adult_berkunjung_ke_fasilitas_kesehatan_nama_provinsi'+counter+'_'+idy).value = passenger_data_cache_medical[idx].pcr_data.daftar_ke_fasilitas_kesehatan[idy].nama_provinsi
                document.getElementById('adult_berkunjung_ke_fasilitas_kesehatan_tanggal_kunjungan'+counter+'_'+idy).value = moment(passenger_data_cache_medical[idx].pcr_data.daftar_ke_fasilitas_kesehatan[idy].tanggal_kunjungan, 'YYYY-MM-DD').format('DD MMM YYYY')
            }

            document.getElementById('adult_berkunjung_ke_pasar_hewan'+counter).value = passenger_data_cache_medical[idx].pcr_data.berkunjung_ke_pasar_hewan;
            onchange_berkunjung_ke_pasar_hewan(counter)
            for(idy in passenger_data_cache_medical[idx].pcr_data.daftar_ke_pasar_hewan){
                add_pcr_table('berkunjung_ke_pasar_hewan',counter);
                document.getElementById('adult_berkunjung_ke_pasar_hewan_nama_lokasi_pasar'+counter+'_'+idy).value = passenger_data_cache_medical[idx].pcr_data.daftar_ke_pasar_hewan[idy].nama_lokasi_pasar
                document.getElementById('adult_berkunjung_ke_pasar_hewan_nama_kota'+counter+'_'+idy).value = passenger_data_cache_medical[idx].pcr_data.daftar_ke_pasar_hewan[idy].nama_kota
                document.getElementById('adult_berkunjung_ke_pasar_hewan_nama_provinsi'+counter+'_'+idy).value = passenger_data_cache_medical[idx].pcr_data.daftar_ke_pasar_hewan[idy].nama_provinsi
                document.getElementById('adult_berkunjung_ke_pasar_hewan_tanggal_kunjungan'+counter+'_'+idy).value = moment(passenger_data_cache_medical[idx].pcr_data.daftar_ke_pasar_hewan[idy].tanggal_kunjungan, 'YYYY-MM-DD').format('DD MMM YYYY')
            }
            document.getElementById('adult_berkunjung_ke_pasien_dalam_pengawasan'+counter).value = passenger_data_cache_medical[idx].pcr_data.berkunjung_ke_pasien_dalam_pengawasan;
            onchange_berkunjung_ke_pasien_dalam_pengawasan(counter)
            for(idy in passenger_data_cache_medical[idx].pcr_data.daftar_ke_pasien_dalam_pengawasan){
                add_pcr_table('berkunjung_ke_pasien_dalam_pengawasan',counter);
                document.getElementById('adult_berkunjung_ke_pasien_dalam_pengawasan_nama_pasien'+counter+'_'+idy).value = passenger_data_cache_medical[idx].pcr_data.daftar_ke_pasien_dalam_pengawasan[idy].nama_pasien
                document.getElementById('adult_berkunjung_ke_pasien_dalam_pengawasan_alamat'+counter+'_'+idy).value = passenger_data_cache_medical[idx].pcr_data.daftar_ke_pasien_dalam_pengawasan[idy].alamat
                document.getElementById('adult_berkunjung_ke_pasien_dalam_pengawasan_hubungan'+counter+'_'+idy).value = passenger_data_cache_medical[idx].pcr_data.daftar_ke_pasien_dalam_pengawasan[idy].hubungan
                document.getElementById('adult_berkunjung_ke_pasien_dalam_pengawasan_tanggal_kontak_pertama'+counter+'_'+idy).value = moment(passenger_data_cache_medical[idx].pcr_data.daftar_ke_pasien_dalam_pengawasan[idy].tanggal_kontak_pertama, 'YYYY-MM-DD').format('DD MMM YYYY')
                document.getElementById('adult_berkunjung_ke_pasien_dalam_pengawasan_tanggal_kontak_terakhir'+counter+'_'+idy).value = moment(passenger_data_cache_medical[idx].pcr_data.daftar_ke_pasien_dalam_pengawasan[idy].tanggal_kontak_terakhir, 'YYYY-MM-DD').format('DD MMM YYYY')
            }

            document.getElementById('adult_berkunjung_ke_pasien_konfirmasi'+counter).value = passenger_data_cache_medical[idx].pcr_data.berkunjung_ke_pasien_konfirmasi;
            onchange_berkunjung_ke_pasien_konfirmasi(counter)
            for(idy in passenger_data_cache_medical[idx].pcr_data.daftar_ke_pasien_konfirmasi){
                add_pcr_table('berkunjung_ke_pasien_konfirmasi',counter);
                document.getElementById('adult_berkunjung_ke_pasien_konfirmasi_nama_pasien'+counter+'_'+idy).value = passenger_data_cache_medical[idx].pcr_data.berkunjung_ke_pasien_konfirmasi[idy].nama_pasien
                document.getElementById('adult_berkunjung_ke_pasien_konfirmasi_alamat'+counter+'_'+idy).value = passenger_data_cache_medical[idx].pcr_data.berkunjung_ke_pasien_konfirmasi[idy].alamat
                document.getElementById('adult_berkunjung_ke_pasien_konfirmasi_hubungan'+counter+'_'+idy).value = passenger_data_cache_medical[idx].pcr_data.berkunjung_ke_pasien_konfirmasi[idy].hubungan
                document.getElementById('adult_berkunjung_ke_pasien_konfirmasi_tanggal_kontak_pertama'+counter+'_'+idy).value = moment(passenger_data_cache_medical[idx].pcr_data.berkunjung_ke_pasien_konfirmasi[idy].tanggal_kontak_pertama, 'YYYY-MM-DD').format('DD MMM YYYY')
                document.getElementById('adult_berkunjung_ke_pasien_konfirmasi_tanggal_kontak_terakhir'+counter+'_'+idy).value = moment(passenger_data_cache_medical[idx].pcr_data.berkunjung_ke_pasien_konfirmasi[idy].tanggal_kontak_terakhir, 'YYYY-MM-DD').format('DD MMM YYYY')
            }

            document.getElementById('adult_termasuk_cluster_ispa'+counter).value = passenger_data_cache_medical[idx].pcr_data.termasuk_cluster_ispa;
            document.getElementById('adult_merupakan_petugas_kesehatan'+counter).value = passenger_data_cache_medical[idx].pcr_data.merupakan_petugas_kesehatan;
            onchange_petugas_medis(counter);
            document.getElementById('adult_apd_yang_digunakan'+counter).value = passenger_data_cache_medical[idx].pcr_data.apd_yang_digunakan;
            document.getElementById('adult_prosedur_menimbulkan_aerosol'+counter).value = passenger_data_cache_medical[idx].pcr_data.prosedur_menimbulkan_aerosol;
            onchange_aerosol(counter);
            document.getElementById('adult_tindakan_menimbulkan_aerosol'+counter).value = passenger_data_cache_medical[idx].pcr_data.tindakan_menimbulkan_aerosol;
            document.getElementById('adult_faktor_lain'+counter).value = passenger_data_cache_medical[idx].pcr_data.faktor_lain;
            document.getElementById('adult_gejala'+counter).value = passenger_data_cache_medical[idx].pcr_data.gejala;
            document.getElementById('adult_penyakit_bawaan'+counter).value = passenger_data_cache_medical[idx].pcr_data.penyakit_bawaan;
            document.getElementById('adult_perjalanan'+counter).value = passenger_data_cache_medical[idx].pcr_data.perjalanan;
            onchange_penyakit_bawaan(counter);
            onchange_gejala(counter);
            onchange_perjalanan(counter);
            onchange_rawat_rs(counter);
//            "gejala": document.getElementById('adult_gejala' + nomor_pax).value,
//                            "penyakit_bawaan": document.getElementById('adult_penyakit_bawaan' + nomor_pax).value,
//                            "perjalanan": document.getElementById('adult_perjalanan' + nomor_pax).value,
        }
        $('#adult_title'+counter).niceSelect('update');
        $('#adult_identity_type'+counter).niceSelect('update');
        $('#adult_profession'+counter).niceSelect('update');
        $('#adult_perusahaan'+counter).niceSelect('update');
        $('#adult_kriteria_pasien'+counter).niceSelect('update');
        $('#adult_pemeriksaan_swab_ke'+counter).niceSelect('update');
        $('#adult_sedang_dirawat_di_rs'+counter).niceSelect('update');
        $('#adult_sedang_dirawat_di_icu'+counter).niceSelect('update');
        $('#adult_menggunakan_intubasi'+counter).niceSelect('update');
        $('#adult_menggunakan_emco'+counter).niceSelect('update');
        $('#adult_status_terakhir'+counter).niceSelect('update');
        $('#adult_klinis_ada_penumonia'+counter).niceSelect('update');
        $('#adult_klinis_ada_ards'+counter).niceSelect('update');
        $('#adult_klinis_ada_penyakit_pernafasan'+counter).niceSelect('update');
        $('#adult_klinis_ada_ards'+counter).niceSelect('update');
        $('#adult_klinis_ada_demam'+counter).niceSelect('update');
        $('#adult_klinis_ada_batuk'+counter).niceSelect('update');
        $('#adult_klinis_ada_ards'+counter).niceSelect('update');
        $('#adult_klinis_ada_pilek'+counter).niceSelect('update');
        $('#adult_klinis_ada_sakit_tenggorokan'+counter).niceSelect('update');
        $('#adult_klinis_ada_sesak'+counter).niceSelect('update');
        $('#adult_klinis_ada_sakit_kepala'+counter).niceSelect('update');
        $('#adult_klinis_ada_badan_lemah'+counter).niceSelect('update');
        $('#adult_klinis_ada_nyeri_otot'+counter).niceSelect('update');
        $('#adult_klinis_ada_mual'+counter).niceSelect('update');
        $('#adult_klinis_ada_nyeri_abdomen'+counter).niceSelect('update');
        $('#adult_klinis_ada_diare'+counter).niceSelect('update');
        $('#adult_klinis_ada_gangguan_penciuman'+counter).niceSelect('update');
        $('#adult_klinis_golongan_darah'+counter).niceSelect('update');
        $('#adult_klinis_gejala_lainnya'+counter).niceSelect('update');
        $('#adult_klinis_ada_diabetes'+counter).niceSelect('update');
        $('#adult_klinis_ada_penyakit_jantung'+counter).niceSelect('update');
        $('#adult_klinis_ada_keganasan'+counter).niceSelect('update');
        $('#adult_klinis_ada_gangguan_imunologi'+counter).niceSelect('update');
        $('#adult_klinis_ada_gangguan_ginjal'+counter).niceSelect('update');
        $('#adult_klinis_ada_gangguan_hati'+counter).niceSelect('update');
        $('#adult_klinis_ada_gangguan_paru_obstruksi_kronis'+counter).niceSelect('update');
        $('#adult_klinis_kondisi_penyerta_lainnya'+counter).niceSelect('update');
        $('#adult_perjalanan_keluar_negeri'+counter).niceSelect('update');
        $('#adult_perjalanan_ke_transmisi_lokal'+counter).niceSelect('update');
        $('#adult_berkunjung_ke_fasilitas_kesehatan'+counter).niceSelect('update');
        $('#adult_berkunjung_ke_pasar_hewan'+counter).niceSelect('update');
        $('#adult_berkunjung_ke_pasien_dalam_pengawasan'+counter).niceSelect('update');
        $('#adult_berkunjung_ke_pasien_konfirmasi'+counter).niceSelect('update');
        $('#adult_termasuk_cluster_ispa'+counter).niceSelect('update');
        $('#adult_merupakan_petugas_kesehatan'+counter).niceSelect('update');
        $('#adult_apd_yang_digunakan'+counter).niceSelect('update');
        $('#adult_prosedur_menimbulkan_aerosol'+counter).niceSelect('update');
        $('#adult_tindakan_menimbulkan_aerosol'+counter).niceSelect('update');
        $('#adult_gejala'+counter).niceSelect('update');
        $('#adult_penyakit_bawaan'+counter).niceSelect('update');
        $('#adult_faktor_lain'+counter).niceSelect('update');



        update_contact('passenger',counter);
        counter++;
    }
}

function auto_fill_periksain(){
    var counter = 1;
    for(idx in passenger_data_cache_medical){
        if(idx == 0){
            document.getElementById('booker_first_name').value = passenger_data_cache_medical[idx].first_name;
            document.getElementById('booker_last_name').value = passenger_data_cache_medical[idx].last_name;
            document.getElementById('booker_title').value = passenger_data_cache_medical[idx].title;
            document.getElementById('booker_email').value = passenger_data_cache_medical[idx].email;
            if(passenger_data_cache_medical[idx].phone_number.substr(0,2) == '62'){
                document.getElementById('booker_phone_code_id').value = '62';
                document.getElementById('select2-booker_phone_code_id-container').innerHTML = '62';
                document.getElementById('booker_phone').value = passenger_data_cache_medical[idx].phone_number.substr(2,100);
            }else if(passenger_data_cache_medical[idx].phone_number.substr(0,1) == '0'){
                document.getElementById('booker_phone_code_id').value = '0';
                document.getElementById('select2-booker_phone_code_id-container').innerHTML = '0';
                document.getElementById('booker_phone').value = passenger_data_cache_medical[idx].phone_number.substr(1,100);
            }else{
                document.getElementById('booker_phone_code_id').value = passenger_data_cache_medical[idx].phone_number.substr(0,2);
                document.getElementById('select2-booker_phone_code_id-container').innerHTML = passenger_data_cache_medical[idx].phone_number.substr(0,2);
                document.getElementById('booker_phone').value = passenger_data_cache_medical[idx].phone_number.substr(2,100);
            }
            document.getElementById('booker_nationality_id').value = passenger_data_cache_medical[idx].nationality_name;
            document.getElementById('select2-booker_nationality_id-container').innerHTML = passenger_data_cache_medical[idx].nationality_name;
            document.getElementsByName('myRadios')[0].checked = 'checked';

            copy_booker_to_passenger('copy','medical');
        }
        document.getElementById('adult_title'+counter).value = passenger_data_cache_medical[idx].title;
        document.getElementById('adult_first_name'+counter).value = passenger_data_cache_medical[idx].first_name;
        document.getElementById('adult_last_name'+counter).value = passenger_data_cache_medical[idx].last_name;
        document.getElementById('adult_nationality'+counter).value = passenger_data_cache_medical[idx].nationality_name;
        document.getElementById('select2-adult_nationality'+counter+'_id-container').innerHTML = passenger_data_cache_medical[idx].nationality_name;
        document.getElementById('adult_birth_date'+counter).value = passenger_data_cache_medical[idx].birth_date;
        document.getElementById('adult_identity_type'+counter).value = passenger_data_cache_medical[idx].identity_type;
        document.getElementById('adult_identity_number'+counter).value = passenger_data_cache_medical[idx].identity_number;
        document.getElementById('adult_country_of_issued'+counter).value = passenger_data_cache_medical[idx].identity_country_of_issued_name;
        document.getElementById('select2-adult_country_of_issued'+counter+'_id-container').innerHTML = passenger_data_cache_medical[idx].identity_country_of_issued_name;
        if(passenger_data_cache_medical[idx].phone_number.substr(0,2) == '62'){
            document.getElementById('adult_phone_code'+counter).value = '62';
            document.getElementById('select2-adult_phone_code'+counter+'_id-container').innerHTML = '62';
            document.getElementById('adult_phone'+counter).value = passenger_data_cache_medical[idx].phone_number.substr(2,100);
        }else if(passenger_data_cache_medical[idx].phone_number.substr(0,1) == '0'){
            document.getElementById('adult_phone_code'+counter).value = '0';
            document.getElementById('select2-adult_phone_code'+counter+'_id-container').innerHTML = '0';
            document.getElementById('adult_phone'+counter).value = passenger_data_cache_medical[idx].phone_number.substr(1,100);
        }else{
            document.getElementById('adult_phone_code'+counter).value = passenger_data_cache_medical[idx].phone_number.substr(0,2);
            document.getElementById('select2-adult_phone_code'+counter+'_id-container').innerHTML = passenger_data_cache_medical[idx].phone_number.substr(0,2);
            document.getElementById('adult_phone'+counter).value = passenger_data_cache_medical[idx].phone_number.substr(2,100);
        }
        document.getElementById('adult_email'+counter).value = passenger_data_cache_medical[idx].email;
        document.getElementById('adult_sample_method'+counter).value = passenger_data_cache_medical[idx].sample_method_code;
        document.getElementById('adult_address_ktp'+counter).value = passenger_data_cache_medical[idx].address_ktp;

        $('#adult_title'+counter).niceSelect('update');
        $('#adult_sample_method'+counter).niceSelect('update');
        update_contact('passenger',counter);
        counter++;
    }
}

function hidden_readonly_medical(id, select, action){
    if(action == 'hidden'){
        if(select == 'profession'){
            if(document.getElementById('adult_profession'+id).value == 'BELUM BEKERJA' || document.getElementById('adult_profession'+id).value == '' ){
                document.getElementById('adult_work_place_label'+id).style = "color: white !important;";
                document.getElementById('adult_work_place_div'+id).style.display = "none";
            }else{
                document.getElementById('adult_work_place_label'+id).style = "color: red !important;";
                document.getElementById('adult_work_place_div'+id).style.display = "block";
            }
        }
    }else if(action == 'readonly'){

    }
}

function repeat_order_phc(){
    $("#myModalPluginGetBookingB2C").modal('show');
    document.getElementById('product').value = 'phc';
    document.getElementById('select2-product-container').innerHTML = 'phc';

    $('#product').niceSelect('update');
    change_product();
}