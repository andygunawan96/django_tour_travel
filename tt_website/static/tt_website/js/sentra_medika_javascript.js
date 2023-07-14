print_check_price = 0
function add_other_time(type='add'){
    if(type != 'auto_fill'){
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
                    <div class="input-container-search-ticket mb-3">
                        <input type="text" class="form-control" style="cursor:pointer; background:white;" name="booker_test_date`+test_time+`" id="booker_test_date`+test_time+`" placeholder="Test Date" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Test Date '" autocomplete="off" readonly>
                    </div>
                </div>`;
            text+=`
                <div class="col-lg-6">`;
        text+=`
                    <label style="color:red !important;">*</label>
                    <label>Timeslot</label>
                    <div class="row mb-3">
                        <div class="col-lg-8">`;

                        if(template == 1){
                            text+=`
                            <div class="form-select-2" id="default-select">
                                <select style="width:100%;" id="booker_timeslot_id`+test_time+`" placeholder="Timeslot" onchange="change_timeslot(`+test_time+`)">

                                </select>
                            </div>`;
                        }
                        else if(template == 2){
                            text+=`
                                <div class="form-select">
                                    <select style="width:100%;" id="booker_timeslot_id`+test_time+`" placeholder="Timeslot" onchange="change_timeslot(`+test_time+`)">

                                    </select>
                                </div>
                            </div>`;
                        }
                        else if(template == 3){
                            text+=`
                            <div class="form-group">
                                <div class="default-select">
                                    <select style="width:100%;" id="booker_timeslot_id`+test_time+`" placeholder="Timeslot" onchange="change_timeslot(`+test_time+`)">

                                    </select>
                                </div>
                            </div>`;
                        }
                        else if(template == 4){
                            text+=`
                            <div class="input-container-search-ticket">
                                <div class="form-select-2" style="width:100%;">
                                    <select class="nice-select-default" id="booker_timeslot_id`+test_time+`" placeholder="Timeslot" onchange="change_timeslot(`+test_time+`)">

                                    </select>
                                </div>
                            </div>`;
                        }
                        else if(template == 5){
                            text+=`
                            <div class="form-select">
                                <select style="width:100%;" id="booker_timeslot_id`+test_time+`" placeholder="Timeslot" onchange="change_timeslot(`+test_time+`)">

                                </select>
                            </div>`;
                        }
                        else if(template == 6){
                            text+=`
                            <div class="form-select-2" id="default-select">
                                <select style="width:100%;" id="booker_timeslot_id`+test_time+`" placeholder="Timeslot" onchange="change_timeslot(`+test_time+`)">

                                </select>
                            </div>`;
                        }
                        text+=`
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

        //test date
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
            },
            isInvalidDate: function(date) {
                for (data_rg in test_date_data){
                    var invalid_date_medical = moment(test_date_data[data_rg]).format('YYYY-MM-DD');
                    var invalid_date_calendar = moment(date).format('YYYY-MM-DD');
                    if(invalid_date_calendar == invalid_date_medical){
                        return false;
                    }
                }
                return true;
            }
        });
        $('input[name="booker_test_date'+test_time+'"]').on('apply.daterangepicker', function(ev, picker) {
            var val = parseInt(ev.target.id.replace('booker_test_date',''));
            update_timeslot(val);
            if (vendor == 'phc' && test_type != 'PHCHCKPCR'){
                if(test_type.includes('PCR')){
                    check_kuota_phc();
                }
            }
        });
        if (vendor == 'phc' && test_type != 'PHCHCKPCR'){
            if(test_type.includes('PCR')){
                check_kuota_phc();
            }
        }

        $('#booker_timeslot_id'+test_time).niceSelect();
        update_timeslot(test_time);
        test_time++;
    }
    if(typeof schedule_medical !== 'undefined' && test_time <= 2 && auto_fill_first_time == true){
        try{
            if(document.getElementById('booker_timeslot_id1') != null)
                auto_fill_first_time = false;

            if(schedule_medical.address != alamat_ss && schedule_medical.place_url_by_google != ''){
                web_url = schedule_medical.place_url_by_google;
                if(schedule_medical.area != '')
                    document.getElementById('booker_area').value = schedule_medical.area;
                $('#booker_area').niceSelect('update');
                var google_lat_long = schedule_medical.place_url_by_google.split('/')[schedule_medical.place_url_by_google.split('/').length-1];
                lat = parseFloat(google_lat_long.split(',')[0]);
                long = parseFloat(google_lat_long.split(',')[1]);
                list_map.push({
                    "name": "auto",
                    "lat": lat,
                    "long": long,
                    "zoom" : 18
                })
                change_area('auto_marker')
            }
            if(test_time == 1 && schedule_medical.area != '')
                document.getElementById('booker_area').value = schedule_medical.area;
            var nomor_test = 1;
            for(x in schedule_medical.test_list){
                if(x != 0){
                    add_other_time();
                }
                $('input[name="booker_test_date'+nomor_test+'"]').daterangepicker({
                    singleDatePicker: true,
                    autoUpdateInput: true,
                    startDate: moment(schedule_medical.test_list[x].date),
                    minDate: moment(medical_get_availability_response[document.getElementById('booker_area').value].min_date),
                    maxDate: moment(medical_get_availability_response[document.getElementById('booker_area').value].max_date),
                    showDropdowns: true,
                    opens: 'center',
                    locale: {
                        format: 'DD MMM YYYY',
                    },
                    isInvalidDate: function(date) {
                        for (data_rg in test_date_data){
                            var invalid_date_medical = moment(test_date_data[data_rg]).format('YYYY-MM-DD');
                            var invalid_date_calendar = moment(date).format('YYYY-MM-DD');
                            if(invalid_date_calendar == invalid_date_medical){
                                return false;
                            }
                        }
                        return true;
                    }
                });
                $('input[name="booker_test_date'+nomor_test+'"]').on('apply.daterangepicker', function(ev, picker) {
                    var val = parseInt(ev.target.id.replace('booker_test_date',''));
                    update_timeslot(val);
                    if (vendor == 'phc' && test_type != 'PHCHCKPCR'){
                        if(test_type.includes('PCR')){
                            check_kuota_phc();
                        }
                    }
                });
                document.getElementById('booker_test_date'+nomor_test).value = schedule_medical.test_list[x].date;
                update_timeslot(nomor_test);
                if(vendor == 'periksain' || vendor == 'phc' && test_type == 'PHCDTKATG' || vendor == 'phc' && test_type == 'PHCDTKPCR'){
                    var trends = document.getElementById('booker_timeslot_id'+nomor_test);

                    for(i = 0; i < trends.length; i++) {
                       if (trends.options[i].value.split('~')[0] == schedule_medical.test_list[x].seq_id) {
                           trends.options[i].selected = 'selected';
                           break;
                       }
                    }
                }
    //            document.getElementById('booker_timeslot_id'+test_time).value = schedule_medical.test_list[x].seq_id.split('~')[0];
                $('#booker_timeslot_id'+nomor_test).niceSelect('update');
                nomor_test++;
            }
        }catch(err){console.log(err)}
    }

}

function update_timeslot(val){
    var text = '';
    var medical_date_pick = moment(document.getElementById('booker_test_date'+val).value).format('YYYY-MM-DD');
    var now = moment();
    for(i in medical_get_availability_response[document.getElementById('booker_area').value].timeslots[medical_date_pick]){
        if(global_area == '' && test_type.includes('PHCHC') == false || medical_get_availability_response[document.getElementById('booker_area').value].timeslots[medical_date_pick][i].subarea == 'surabaya_all'){
            text += print_timeslot(i,medical_date_pick);
        }else if(global_area == medical_get_availability_response[document.getElementById('booker_area').value].timeslots[medical_date_pick][i].subarea){
            text += print_timeslot(i,medical_date_pick);
        }

    }
    document.getElementById('booker_timeslot_id'+val).innerHTML = text;
    $('#booker_timeslot_id'+val).niceSelect('update');
    change_timeslot(val);
    document.getElementById('next_sentra_medika').style.display='none';
    try{
        document.getElementById('sentra_medika_pax_div').hidden = true;
    }catch(err){
        console.log(err) //ada element yg tidak ada
    }
}

function get_area_global(){
    global_area = '';
    var found = false;
    for(i in zip_code_list['result']['response']){
        if(global_kecamatan in zip_code_list['result']['response'][i]){
            console.log('found in kecamatan');
            global_area = i;
            found = true;
            break;
        }
        for(j in zip_code_list['result']['response'][i]){
            for(k in zip_code_list['result']['response'][i][j]){
                if(global_zip_code == zip_code_list['result']['response'][i][j][k]){
                    console.log('found in zip code');
                    global_area = i;
                    found = true;
                    break;
                }
            }
            if(found)
                break
        }
        if(found)
            break
    }
    for(i=1;i<test_time;i++){
        update_timeslot(i);
    }
    if(test_type.includes('PHCHC')){
        document.getElementById('div_schedule_sentra_medika').style.display = 'block';
        $('html, body').animate({
            scrollTop: $("#div_schedule_sentra_medika").offset().top - 110
        }, 500);
    }
}

function print_timeslot(i,medical_date_pick){
    text_timeslot = '<option ';
    if(medical_get_availability_response[document.getElementById('booker_area').value].timeslots[medical_date_pick][i].availability == false){
        text_timeslot+= `disabled `;
    }
    text_timeslot+= `value="`+medical_get_availability_response[document.getElementById('booker_area').value].timeslots[medical_date_pick][i].seq_id+`~`+medical_get_availability_response[document.getElementById('booker_area').value].timeslots[medical_date_pick][i].time+`">`+medical_get_availability_response[document.getElementById('booker_area').value].timeslots[medical_date_pick][i].time;
    if(medical_get_availability_response[document.getElementById('booker_area').value].timeslots[medical_date_pick][i].hasOwnProperty('time_end'))
        text_timeslot += ` - `+medical_get_availability_response[document.getElementById('booker_area').value].timeslots[medical_date_pick][i].time_end;
    if(medical_get_availability_response[document.getElementById('booker_area').value].timeslots[medical_date_pick][i].group_booking == true)
        text_timeslot+= ` Group Booking`;
    if(medical_get_availability_response[document.getElementById('booker_area').value].timeslots[medical_date_pick][i].availability == false)
        text_timeslot+= ` Full`;
    else if(medical_get_availability_response[document.getElementById('booker_area').value].timeslots[medical_date_pick][i].availability == true)
        text_timeslot+= ` Available`;
    text_timeslot+=`</option>`;
    return text_timeslot;
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
    document.getElementById('sentra_medika_detail').innerHTML = '';
    document.getElementById('sentra_medika_detail').style.display = 'none';
}

function delete_other_time(val){
    var element = document.getElementById(val);
    element.parentNode.removeChild(element);
}

function add_table_of_passenger_verify(type){
    text= '';
    set_passenger_number(counter_passenger);
    var node = document.createElement("div");
    text += `
    <div class="col-lg-12" style="padding:15px; background:`+color+`;">
        <span style="width:100%; font-weight:700; font-size:18px; color:`+text_color+`;">Customer #`+(parseInt(counter_passenger)+1)+`</span>
    </div>
    <div class="col-lg-12 mb-4" style="border:1px solid `+color+`; padding:20px 15px 0px 15px; background:white;">
        <div class="row">`;

            text+=`<div class="col-lg-12 mt-4 mb-3">`;

            text+=`
                <div class="row">
                    <div class="col-lg-6">
                        <span style="padding-right:10px; font-weight:700; font-size:15px;font-weight:bold;color:red">DATA HARUS BENAR KARENA TIDAK BISA DIUBAH</span><br/>
                        <span style="padding-right:10px; font-weight:700; font-size:15px;">Customer Data</span><br/>
                        <span style="padding-right:5px; font-style: italic; font-weight:500;" id='name_pax`+counter_passenger+`' name='name_pax`+counter_passenger+`'>
                            -- Blank Customer Data --
                        </span>
                        <br/>
                        <span id='birth_date`+counter_passenger+`' name='birth_date`+counter_passenger+`'></span>
                        <br/>
                    </div>
                    <div class="col-lg-6 pt-2" style="text-align:right;">
                        <button type="button" id="button_pax`+counter_passenger+`" class="primary-btn" style="margin-bottom:5px; font-size:12px; width:90px; height:40px; padding-left:12px; padding-right:12px; line-height:30px; font-weight:700;" onclick="set_passenger_number(`+counter_passenger+`); update_customer_fill('fill',`+counter_passenger+`);">
                            Fill <i class="fas fa-pen"></i>
                        </button>`;

                    if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false && document.URL.split('/')[document.URL.split('/').length-1] == 'passenger'){
                        text+=`
                        <button type="button" id="button_search`+counter_passenger+`" class="primary-btn" style="margin-bottom:5px; width:90px; height:40px; font-size:12px; padding-left:12px; padding-right:12px; line-height:30px; font-weight:700;" data-toggle="modal" data-target="#myModal_`+parseInt(counter_passenger+1)+`" data-backdrop="static" onclick="set_passenger_number(`+counter_passenger+`);">
                            Search <i class="fas fa-search"></i>
                        </button>`;
                    }
                    text+=`
                        <button type="button" id="button_clear`+counter_passenger+`" class="primary-btn" style="background:#c73912; width:90px; height:40px; margin-bottom:5px; font-size:12px; padding-left:12px; padding-right:12px; line-height:30px; font-weight:700;" onclick="clear_passenger('Medical',`+(parseInt(counter_passenger)+1)+`);">
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
    <div class="modal fade" id="myModal_`+parseInt(counter_passenger+1)+`" role="dialog" data-keyboard="false">
        <div class="overlay_modal_custom" onclick="close_modal_check('', '`+parseInt(counter_passenger+1)+`');"></div>
        <div class="modal-dialog modal_custom_fixed">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="row">
                        <div class="col-xs-6 pb-3">
                            <h4 class="modal-title">Customer #`+(counter_passenger+1)+`</h4>
                        </div>
                        <div class="col-xs-6">
                            <button type="button" class="close modal_custom_close" data-dismiss="modal" onclick="close_modal_check('', '`+parseInt(counter_passenger+1)+`');">&times;</button>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-6" id="button_tl_`+parseInt(counter_passenger+1)+`">

                        </div>
                        <div class="col-xs-6" id="button_tr_`+parseInt(counter_passenger+1)+`">

                        </div>
                    </div>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7">
                            <input class="form-control" type="text" id="train_`+(counter_passenger+1)+`_search" placeholder="Search"/>
                        </div>
                        <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5">
                            <button type="button" class="primary-btn" id="passenger_btn_io_click`+(counter_passenger+1)+`" onclick="get_customer_list('','`+(counter_passenger+1)+`','medical'); search_modal_pe_none();">Search</button>
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
                        <h3 style="color:`+color+`; border-bottom:2px solid `+color+`;">
                            Fill the Form
                            <i class="fas fa-pen" id="icon_fill`+parseInt(counter_passenger+1)+`" style="padding-left:5px;" onclick="open_date(`+parseInt(counter_passenger+1)+`);"></i>
                        </h3>
                        <span style="padding-right:10px; font-weight:700; font-size:15px;font-weight:bold;color:red">DATA HARUS BENAR KARENA TIDAK BISA DIUBAH</span><br/>
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
                            text_div_paxs+=`
                            </ul>
                        </div>`;
                    }

                    text_div_paxs+=`
                    <div class="col-lg-6 col-md-6 col-sm-6" style="margin-top:15px;">
                        <label style="color:red !important">*</label>
                        <label>Gender</label>`;
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
                        }else if(template == 3){
                            text_div_paxs+=`<div class="form-select-2" style="width:100%;">`;
                        }else if(template == 6){
                            text_div_paxs+=`<div class="form-select" style="width:100%;">`;
                        }else{
                            text_div_paxs+=`<div class="form-select-2">`;
                        }

                        if(template == 4){
                            text_div_paxs+=`<select style="width:100%;" class="nice-select-default rounded" id="adult_title`+parseInt(counter_passenger+1)+`" name="adult_title`+parseInt(counter_passenger+1)+`" onchange="onchange_title(`+parseInt(counter_passenger+1)+`)">`;
                        }else{
                            text_div_paxs+=`<select style="width:100%;" id="adult_title`+parseInt(counter_passenger+1)+`" name="adult_title`+parseInt(counter_passenger+1)+`" onchange="onchange_title(`+parseInt(counter_passenger+1)+`)">`;
                        }
                                text_div_paxs+= `<option value="">Choose</option>`;
                                text_div_paxs+= `<option value="MR">Male (LAKI-LAKI)</option>`;
                                text_div_paxs+= `<option value="MS">Female (PEREMPUAN)</option>`;
                                text_div_paxs+= `</select>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-6"></div>
                    <div class="col-lg-12 col-md-12 col-sm-12">
                        <span style="padding-right:10px; font-weight:700; font-size:15px;font-weight:bold;color:red">DATA HARUS BENAR KARENA TIDAK BISA DIUBAH</span><br/>
                    </div>
                    `;


                    text_div_paxs+=`
                    <div class="col-lg-6">
                        <br/>
                        <label style="color:red !important">*</label>
                        <label>First name and middle name (if any)</label>
                        <div class="input-container-search-ticket" style="margin-bottom:5px;">
                            <input type="text" class="form-control" name="adult_first_name`+parseInt(counter_passenger+1)+`" id="adult_first_name`+parseInt(counter_passenger+1)+`" placeholder="First Name " onfocus="this.placeholder = ''" onblur="this.placeholder = 'First Name '">
                            <input type="hidden" class="form-control" name="adult_id`+parseInt(counter_passenger+1)+`" id="adult_id`+parseInt(counter_passenger+1)+`">
                        </div>
                        <label style="font-size:12px; padding:0;">As on Identity Card or Passport without title and punctuation</label><br/>
                    </div>
                    <div class="col-lg-6">
                        <br/>
                        <label>Last name</label>
                        <div class="input-container-search-ticket" style="margin-bottom:5px;">
                            <input type="text" class="form-control" name="adult_last_name`+parseInt(counter_passenger+1)+`" id="adult_last_name`+parseInt(counter_passenger+1)+`" placeholder="Last Name " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Last Name '">
                        </div>
                        <label style="font-size:12px; padding:0;">As on Identity Card or Passport without title and punctuation</label><br/>
                    </div>`;

                    text_div_paxs+=`
                    <div class="col-lg-12 col-md-12 col-sm-12 mb-2">
                        <span style="padding-right:10px; font-weight:700; font-size:15px;font-weight:bold;color:red">DATA HARUS BENAR KARENA TIDAK BISA DIUBAH</span><br/>
                    </div>`;

                    //ini phc
                    if(vendor == 'phc'){
                        text_div_paxs+=`
                        <div class="col-lg-6">
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
                            }else if(template == 6){
                                text_div_paxs+=`<div class="input-container-search-ticket">`;
                            }

                            if(template == 5){
                                text_div_paxs+=`<div class="form-select">`;
                            }else if(template == 3){
                                text_div_paxs+=`<div class="form-select-2" style="width:100%;">`;
                            }else if(template == 6){
                                text_div_paxs+=`<div class="form-select" style="width:100%;">`;
                            }else{
                                text_div_paxs+=`<div class="form-select-2">`;
                            }

                            text_div_paxs+=`
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
                    <div class="col-lg-6 mb-2">
                        <label style="color:red !important">*</label>
                        <label>Birth Date</label>
                        <div class="input-container-search-ticket" style="margin-bottom:5px;">
                            <input type="text" class="form-control date-picker-birth" name="adult_birth_date`+parseInt(counter_passenger+1)+`" id="adult_birth_date`+parseInt(counter_passenger+1)+`" onchange="check_years_old(`+parseInt(counter_passenger+1)+`)" placeholder="Birth Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Birth Date '" autocomplete="off" readonly>
                            <input type="hidden" class="form-control" name="adult_years_old`+parseInt(counter_passenger+1)+`" id="adult_years_old`+parseInt(counter_passenger+1)+`">
                        </div>
                    </div>
                    <div class="col-lg-12 col-md-12 col-sm-12 mb-2">
                        <span style="padding-right:10px; font-weight:700; font-size:15px;font-weight:bold;color:red">DATA HARUS BENAR KARENA TIDAK BISA DIUBAH</span><br/>
                    </div>`;


                    text_div_paxs+=`
                    <div class="col-lg-6 mb-3">
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
                        }else if(template == 3){
                            text_div_paxs+=`<div class="form-select-2" style="width:100%;">`;
                        }else if(template == 6){
                            text_div_paxs+=`<div class="form-select" style="width:100%;">`;
                        }else{
                            text_div_paxs+=`<div class="form-select-2">`;
                        }

                        if(template == 4){
                            text_div_paxs+=`<select class="nice-select-default rounded" id="adult_identity_type`+parseInt(counter_passenger+1)+`" name="adult_identity_type`+parseInt(counter_passenger+1)+`" onchange="set_exp_identity(`+parseInt(counter_passenger+1)+`);">`;
                        }else{
                            text_div_paxs+=`<select id="adult_identity_type`+parseInt(counter_passenger+1)+`" name="adult_identity_type`+parseInt(counter_passenger+1)+`" onchange="set_exp_identity(`+parseInt(counter_passenger+1)+`);">`;
                        }
                        if(vendor == 'phc')
                            text_div_paxs+=`
                            <option value="ktp">NIK</option>`;
                        else
                            text_div_paxs+=`
                            <option value="ktp">KTP</option>`;
                        if(test_type != 'PHCHCKATG' && test_type != 'PHCDTKATG')
                        text_div_paxs+=`
                            <option value="passport">Passport</option>`;
                            text_div_paxs+=`</select>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6 mb-1">
                        <label style="color:red !important">*</label>
                        <label>Identity Number</label>
                        <div class="input-container-search-ticket" style="margin-bottom:5px;">
                            <input type="text" class="form-control" name="adult_identity_number`+parseInt(counter_passenger+1)+`" id="adult_identity_number`+parseInt(counter_passenger+1)+`" placeholder="Identity Number " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Identity Number '">
                        </div>
                    </div>

                    <div class="col-lg-6" id="identity_exp_date_hidden`+parseInt(counter_passenger+1)+`" hidden>
                        <label style="color:red !important">*</label>
                        <label>Identity Expired Date</label>
                        <div class="input-container-search-ticket" style="margin-bottom:5px;">
                            <input type="text" class="form-control date-picker-passport" name="adult_identity_expired_date`+parseInt(counter_passenger+1)+`" id="adult_identity_expired_date`+parseInt(counter_passenger+1)+`" placeholder="Identity Expired Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Identity Expired Date '">
                            <button type="button" class="primary-delete-date" onclick="clear_date('adult_identity_expired_date`+parseInt(counter_passenger+1)+`')"><i class="fa fa-trash-alt" style="color:#E92B2B;font-size:20px;"></i></button>
                        </div>
                    </div>`;

                    if(vendor != 'phc'){
                        text_div_paxs+=`
                        <div class="col-lg-12 mt-3 mb-3" style="text-align:right;">
                            <button type="button" class="primary-btn prev-next-form" style="margin-bottom:5px; font-size:12px; font-weight:700;" onclick="update_customer_fill('save',`+counter_passenger+`)">
                                Save <i class="fas fa-save"></i>
                            </button>
                        </div>`;
                    }
                    text_div_paxs += `
                    <div class="col-lg-6" id="adult_cp_hidden2_`+parseInt(counter_passenger+1)+`">
                        <label style="color:red !important">*</label>
                        <label>WA Number (WhatsApp Number)</label>
                        <div class="row">
                            <div class="col-lg-3 col-md-3 col-sm-3 col-xs-5">
                                <div class="input-container-search-ticket">
                                    <div class="form-select">
                                        <select id="adult_phone_code`+parseInt(counter_passenger+1)+`_id" name="adult_phone_code`+parseInt(counter_passenger+1)+`_id" class="form-control js-example-basic-single">`;
                                            for(i in countries){
                                                if(countries[i].phone_code == 0)
                                                   text_div_paxs+=`<option value="`+countries[i].phone_code+`" selected>`+countries[i].phone_code+`</option>`;
                                                else
                                                   text_div_paxs+=`<option value="`+countries[i].phone_code+`">`+countries[i].phone_code+`</option>`;
                                            }

                                text_div_paxs+=` </select>
                                        <input type="hidden" name="adult_phone_code`+parseInt(counter_passenger+1)+`" id="adult_phone_code`+parseInt(counter_passenger+1)+`" />
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-9 col-md-9 col-sm-9 col-xs-7">
                                <input type="text" class="form-control" name="adult_phone`+parseInt(counter_passenger+1)+`" id="adult_phone`+parseInt(counter_passenger+1)+`" placeholder="Phone Number " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Phone Number '">
                            </div>
                        </div>
                        <label style="font-size:12px; padding:0;">Example: 0 812345678</label>
                        <label style="color:`+color+` !important;">Please make sure to register with WA(WhatsApp) number for the result test</label>
                    </div>`;

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

        //verify
        $('#adult_klinis_golongan_darah'+parseInt(counter_passenger+1)).niceSelect();
//        if(test_type == 'PHCDTKPCR' || test_type == 'PHCHCKPCR'){
//            $('#adult_kriteria_pasien'+parseInt(counter_passenger+1)).niceSelect();
//            $('#adult_perusahaan'+parseInt(counter_passenger+1)).niceSelect();
//            $('#adult_klinis_ada_demam'+parseInt(counter_passenger+1)).niceSelect();
//            $('#adult_klinis_ada_batuk'+parseInt(counter_passenger+1)).niceSelect();
//            $('#adult_klinis_ada_pilek'+parseInt(counter_passenger+1)).niceSelect();
//            $('#adult_klinis_ada_sakit_tenggorokan'+parseInt(counter_passenger+1)).niceSelect();
//            $('#adult_klinis_ada_sesak'+parseInt(counter_passenger+1)).niceSelect();
//            $('#adult_klinis_ada_sakit_kepala'+parseInt(counter_passenger+1)).niceSelect();
//            $('#adult_klinis_ada_badan_lemah'+parseInt(counter_passenger+1)).niceSelect();
//            $('#adult_klinis_ada_nyeri_otot'+parseInt(counter_passenger+1)).niceSelect();
//            $('#adult_klinis_ada_mual'+parseInt(counter_passenger+1)).niceSelect();
//            $('#adult_klinis_ada_nyeri_abdomen'+parseInt(counter_passenger+1)).niceSelect();
//            $('#adult_klinis_ada_diare'+parseInt(counter_passenger+1)).niceSelect();
//            $('#adult_klinis_ada_gangguan_penciuman'+parseInt(counter_passenger+1)).niceSelect();
//            $('#adult_klinis_sedang_hamil'+parseInt(counter_passenger+1)).niceSelect();
//            $('#adult_klinis_ada_diabetes'+parseInt(counter_passenger+1)).niceSelect();
//            $('#adult_klinis_ada_penyakit_jantung'+parseInt(counter_passenger+1)).niceSelect();
//            $('#adult_klinis_ada_hipertensi'+parseInt(counter_passenger+1)).niceSelect();
//            $('#adult_klinis_ada_keganasan'+parseInt(counter_passenger+1)).niceSelect();
//            $('#adult_klinis_ada_gangguan_imunologi'+parseInt(counter_passenger+1)).niceSelect();
//            $('#adult_klinis_ada_gangguan_ginjal'+parseInt(counter_passenger+1)).niceSelect();
//            $('#adult_klinis_ada_gangguan_hati'+parseInt(counter_passenger+1)).niceSelect();
//            $('#adult_klinis_ada_gangguan_paru_obstruksi_kronis'+parseInt(counter_passenger+1)).niceSelect();
//            $('#adult_sedang_dirawat_di_rs'+parseInt(counter_passenger+1)).niceSelect();
//            $('#adult_sedang_dirawat_di_icu'+parseInt(counter_passenger+1)).niceSelect();
//            $('#adult_menggunakan_intubasi'+parseInt(counter_passenger+1)).niceSelect();
//            $('#adult_menggunakan_emco'+parseInt(counter_passenger+1)).niceSelect();
//            $('#adult_status_terakhir'+parseInt(counter_passenger+1)).niceSelect();
//            $('#adult_klinis_ada_penumonia'+parseInt(counter_passenger+1)).niceSelect();
//            $('#adult_klinis_ada_ards'+parseInt(counter_passenger+1)).niceSelect();
//            $('#adult_klinis_ada_penyakit_pernafasan'+parseInt(counter_passenger+1)).niceSelect();
//            $('#adult_perjalanan_keluar_negeri'+parseInt(counter_passenger+1)).niceSelect();
//            $('#adult_perjalanan_ke_transmisi_lokal'+parseInt(counter_passenger+1)).niceSelect();
//            $('#adult_berkunjung_ke_fasilitas_kesehatan'+parseInt(counter_passenger+1)).niceSelect();
//            $('#adult_berkunjung_ke_pasar_hewan'+parseInt(counter_passenger+1)).niceSelect();
//            $('#adult_berkunjung_ke_pasien_dalam_pengawasan'+parseInt(counter_passenger+1)).niceSelect();
//            $('#adult_berkunjung_ke_pasien_konfirmasi'+parseInt(counter_passenger+1)).niceSelect();
//            $('#adult_termasuk_cluster_ispa'+parseInt(counter_passenger+1)).niceSelect();
//            $('#adult_merupakan_petugas_kesehatan'+parseInt(counter_passenger+1)).niceSelect();
//            $('#adult_apd_yang_digunakan'+parseInt(counter_passenger+1)).niceSelect();
//            $('#adult_prosedur_menimbulkan_aerosol'+parseInt(counter_passenger+1)).niceSelect();
//
//            $('#adult_gejala'+parseInt(counter_passenger+1)).niceSelect();
//            $('#adult_penyakit_bawaan'+parseInt(counter_passenger+1)).niceSelect();
//
//            $('#adult_perjalanan'+parseInt(counter_passenger+1)).niceSelect();
//            $('#adult_berkunjung'+parseInt(counter_passenger+1)).niceSelect();
//
//            $('input[name="adult_tanggal_pertama_kali_gejala'+parseInt(counter_passenger+1)+'"]').daterangepicker({
//                  singleDatePicker: true,
//                  autoUpdateInput: true,
//                  showDropdowns: true,
//                  maxDate: moment(),
//                  opens: 'center',
//                  drops: 'down',
//                  locale: {
//                      format: 'DD MMM YYYY',
//                  }
//            });
//            $('input[name="adult_tanggal_pertama_kali_gejala'+parseInt(counter_passenger+1)+'"]').val("");
//            $('input[name="adult_tanggal_masuk_rs'+parseInt(counter_passenger+1)+'"]').daterangepicker({
//                  singleDatePicker: true,
//                  autoUpdateInput: true,
//                  showDropdowns: true,
//                  opens: 'center',
//                  drops: 'down',
//                  locale: {
//                      format: 'DD MMM YYYY',
//                  }
//            });
//            $('input[name="adult_tanggal_masuk_rs'+parseInt(counter_passenger+1)+'"]').val("");
//            perjalanan_keluar_negeri = 0;
//            perjalanan_ke_transmisi_lokal = 0;
//            berkunjung_ke_fasilitas_kesehatan = 0;
//            berkunjung_ke_pasar_hewan = 0;
//            berkunjung_ke_pasien_dalam_pengawasan = 0;
//            berkunjung_ke_pasien_konfirmasi = 0;
//        }
//        $('#adult_tempat_lahir'+parseInt(counter_passenger+1)).niceSelect();
//        $('#adult_kabupaten'+parseInt(counter_passenger+1)).niceSelect();
//        $('#adult_kecamatan'+parseInt(counter_passenger+1)).niceSelect();
//        $('#adult_kelurahan'+parseInt(counter_passenger+1)).niceSelect();
//        $('#adult_kabupaten_ktp'+parseInt(counter_passenger+1)).niceSelect();
//        $('#adult_kecamatan_ktp'+parseInt(counter_passenger+1)).niceSelect();
//        $('#adult_kelurahan_ktp'+parseInt(counter_passenger+1)).niceSelect();
        $('#adult_profession'+parseInt(counter_passenger+1)).niceSelect();
    }else if(vendor == 'periksain' && test_type == 'PRKATG'){
        $('#adult_sample_method'+parseInt(counter_passenger+1)).niceSelect();
    }
//    get_kecamatan(`adult_kabupaten`+parseInt(counter_passenger+1),`adult_kecamatan`+parseInt(counter_passenger+1));
//    $('#adult_nationality'+parseInt(counter_passenger+1)).select2();
    if(type == 'open')
        $('#myModalPassenger'+parseInt(parseInt(counter_passenger))).modal('show');
    $('#adult_title'+parseInt(counter_passenger+1)).niceSelect();
    $('#adult_identity_type'+parseInt(counter_passenger+1)).niceSelect();
//    auto_complete(`adult_nationality`+parseInt(counter_passenger+1));
    counter_passenger++;
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
    <div class="col-lg-12 mb-4" style="border:1px solid `+color+`;" id="div_form_customer`+counter_passenger+`">
        <span id="span_customer_data`+counter_passenger+`" style="color:red; font-weight:bold;"></span>
        <div class="row mt-2">`;
            text+=`<div class="col-lg-12 mt-4 mb-3">`;

            text+=`
                <div class="row">
                    <div class="col-lg-6">
                        <span style="padding-right:10px; font-weight:700; font-size:15px;font-weight:bold;color:red">DATA HARUS BENAR KARENA TIDAK BISA DIUBAH</span><br/>
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
                        <button type="button" id="button_search`+counter_passenger+`" class="primary-btn" style="margin-bottom:5px; width:90px; height:40px; font-size:12px; padding-left:12px; padding-right:12px; line-height:30px; font-weight:700;" data-toggle="modal" data-target="#myModal_`+parseInt(counter_passenger+1)+`" data-backdrop="static" onclick="set_passenger_number(`+counter_passenger+`);">
                            Search <i class="fas fa-search"></i>
                        </button>`;
                    }
                    text+=`
                        <button type="button" id="button_clear`+counter_passenger+`" class="primary-btn" style="background:#c73912; width:90px; height:40px; margin-bottom:5px; font-size:12px; padding-left:12px; padding-right:12px; line-height:30px; font-weight:700;" onclick="clear_passenger('Medical',`+(parseInt(counter_passenger)+1)+`);">
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
    <div class="modal fade" id="myModal_`+parseInt(counter_passenger+1)+`" role="dialog" data-keyboard="false">
        <div class="overlay_modal_custom" onclick="close_modal_check('', '`+parseInt(counter_passenger+1)+`');"></div>
        <div class="modal-dialog modal_custom_fixed">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="row">
                        <div class="col-xs-6 pb-3">
                            <h4 class="modal-title">Customer #`+(counter_passenger+1)+`</h4>
                        </div>
                        <div class="col-xs-6">
                            <button type="button" class="close modal_custom_close" data-dismiss="modal" onclick="close_modal_check('', '`+parseInt(counter_passenger+1)+`');">&times;</button>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-6" id="button_tl_`+parseInt(counter_passenger+1)+`">

                        </div>
                        <div class="col-xs-6" id="button_tr_`+parseInt(counter_passenger+1)+`">

                        </div>
                    </div>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-lg-12" id="date_pax`+parseInt(counter_passenger+1)+`"></div>
                        <div class="col-lg-9 col-md-9">
                            <div class="row">
                                <div class="col-lg-6 col-md-6 col-sm-6">
                                    <div class="form-select">
                                        <select id="train_`+(counter_passenger+1)+`_search_type" name="train_`+(counter_passenger+1)+`_search_type" onchange="search_type_on_change('pax','`+parseInt(counter_passenger+1)+`','train_`+(counter_passenger+1)+`_search_type','train_passenger_search');">
                                            <option value="cust_name">By Customer Name</option>
                                            <option value="mobile">By Customer Mobile</option>
                                            <option value="email">By Customer Mail</option>
                                            <option value="identity_type">By Customer Identity Number</option>
                                            <option value="birth_date">By Birth Date</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-6 col-sm-6">
                                    <input class="form-control" type="text" id="train_`+(counter_passenger+1)+`_search" placeholder="Search"/>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-3 col-md-3">
                            <button type="button" id="passenger_btn_io_click`+(counter_passenger+1)+`" class="primary-btn" onclick="get_customer_list('','`+(counter_passenger+1)+`','medical'); search_modal_pe_none();">Search</button>
                        </div>
                    </div>
                    <span><i class="fas fa-exclamation-triangle" style="font-size:18px; color:#ffcc00;"></i> Using this means you can't change title, first name, and last name</span>

                    <div class="row loading-pax-train" style="display:none;">
                        <div class="col-lg-12">
                            <br/>
                            <div style="text-align:center">
                                <span style="font-size:18px; font-weight:bold;">Please Wait </span><img src="/static/tt_website/images/gif/search.gif" alt="Search Passenger" style="height:50px; width:50px;"/>
                            </div>
                        </div>
                    </div>
                    <div id="search_result_`+(counter_passenger+1)+`">

                    </div>
                </div>
            </div>
        </div>
    </div>`;

    node_modal.innerHTML = text_modal_paxs;
    node_modal.setAttribute('id', 'modal_passenger'+counter_passenger);
    document.getElementById("modal_passenger_list").appendChild(node_modal);
    $('#train_'+(counter_passenger+1)+'_search_type').niceSelect();
    text_div_paxs= '';

    text_div_paxs+=`
        <div class="row">
            <div class="col-lg-12" id="adult_paxs`+parseInt(counter_passenger+1)+`" style="padding:15px; border-top:1px solid #cdcdcd; border-bottom:1px solid #cdcdcd;">
                <div class="row">
                    <div class="col-lg-12 mb-3" style="text-align:center;">
                        <h3 style="color:`+color+`; border-bottom:2px solid `+color+`;">
                            Fill the Form
                            <i class="fas fa-pen" id="icon_fill`+parseInt(counter_passenger+1)+`" style="padding-left:5px;" onclick="open_date(`+parseInt(counter_passenger+1)+`);"></i>
                        </h3>
                    </div>`;

                    text_div_paxs+=`
                    <div class="col-lg-12" style="text-align:right;">
                        <button type="button" class="primary-btn prev-next-form" style="margin-bottom:5px; font-size:12px; font-weight:700;" onclick="update_customer_fill('save',`+counter_passenger+`)">
                            Save <i class="fas fa-save"></i>
                        </button>
                    </div>`;

                    text_div_paxs += `
                    <div class="col-lg-12 mt-2 mb-2" id="show_error_form`+counter_passenger+`" style="text-align:center;">

                    </div>`;
                    text_div_paxs+=`
                    <div class="col-lg-12 col-md-12 col-sm-12" id="adult_div_avatar{{forloop.counter}}" hidden>
                    </div>`;
                    text_div_paxs+=`
                    <div class="col-lg-6 col-md-6 col-sm-6" style="margin-top:15px;">
                        <label style="color:red !important">*</label>
                        <label>Gender</label>`;
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
                        }else if(template == 3){
                            text_div_paxs+=`<div class="form-select-2" style="width:100%;">`;
                        }else if(template == 6){
                            text_div_paxs+=`<div class="form-select" style="width:100%;">`;
                        }else{
                            text_div_paxs+=`<div class="form-select-2">`;
                        }

                        if(template == 4){
                            text_div_paxs+=`<select style="width:100%;" class="nice-select-default rounded" id="adult_title`+parseInt(counter_passenger+1)+`" name="adult_title`+parseInt(counter_passenger+1)+`" onchange="onchange_title(`+parseInt(counter_passenger+1)+`)">`;
                        }else{
                            text_div_paxs+=`<select style="width:100%;" id="adult_title`+parseInt(counter_passenger+1)+`" name="adult_title`+parseInt(counter_passenger+1)+`" onchange="onchange_title(`+parseInt(counter_passenger+1)+`)">`;
                        }
                                text_div_paxs+= `<option value="">Choose</option>`;
                                text_div_paxs+= `<option value="MR">Male (LAKI-LAKI)</option>`;
                                text_div_paxs+= `<option value="MS">Female (PEREMPUAN)</option>`;
                                text_div_paxs+= `</select>
                            </div>
                        </div>
                    </div>`;

                    text_div_paxs+=`<div class="col-lg-6 col-md-6 col-sm-6"></div>`;


                    text_div_paxs+=`
                    <div class="col-lg-12 col-md-12 col-sm-12">
                        <span style="padding-right:10px; font-weight:700; font-size:15px;font-weight:bold;color:red">DATA HARUS BENAR KARENA TIDAK BISA DIUBAH</span><br/>
                    </div>
                    <div class="col-lg-6">
                        <br/>
                        <label style="color:red !important">*</label>
                        <label>First name and middle name (if any)</label>
                        <div class="input-container-search-ticket" style="margin-bottom:5px;">
                            <input type="text" class="form-control" name="adult_first_name`+parseInt(counter_passenger+1)+`" id="adult_first_name`+parseInt(counter_passenger+1)+`" placeholder="First Name " onfocus="this.placeholder = ''" onblur="this.placeholder = 'First Name '">
                            <input type="hidden" class="form-control" name="adult_id`+parseInt(counter_passenger+1)+`" id="adult_id`+parseInt(counter_passenger+1)+`">
                        </div>
                        <label style="font-size:12px; padding:0;">As on Identity Card or Passport without title and punctuation</label>
                    </div>
                    <div class="col-lg-6">
                        <br/>
                        <label>Last name</label>
                        <div class="input-container-search-ticket" style="margin-bottom:5px;">
                            <input type="text" class="form-control" name="adult_last_name`+parseInt(counter_passenger+1)+`" id="adult_last_name`+parseInt(counter_passenger+1)+`" placeholder="Last Name " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Last Name '">
                        </div>
                        <label style="font-size:12px; padding:0;">As on Identity Card or Passport without title and punctuation</label>
                    </div>`;

                    text_div_paxs+=`
                    <div class="col-lg-6">
                        <label style="color:red !important">*</label>
                        <label>Nationality</label>`;
                        if(template == 1 || template == 5 || template == 6){
                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                        }
                        text_div_paxs+=`
                            <div class="form-select">
                                <select class="form-control js-example-basic-single" name="adult_nationality`+parseInt(counter_passenger+1)+`_id" style="width:100%;" id="adult_nationality`+parseInt(counter_passenger+1)+`_id" placeholder="Nationality">
                                    <option value="">Select Nationality</option>`;
                                    for(i in countries){
                                        if(countries[i].code == 'ID')
                                           text_div_paxs+=`<option value="`+countries[i].code+`" selected>`+countries[i].name+`</option>`;
                                        else
                                           text_div_paxs+=`<option value="`+countries[i].code+`">`+countries[i].name+`</option>`;
                                    }
                                text_div_paxs+=`</select>
                            </div>`;
                        if(template == 1 || template == 5 || template == 6){
                            text_div_paxs+=`</div>`;
                        }
                    text_div_paxs+=`
                    </div>`;

                    text_div_paxs += `
                    <div class="col-lg-12 col-md-12 col-sm-12 mb-2">
                        <span style="padding-right:10px; font-weight:700; font-size:15px;font-weight:bold;color:red">DATA HARUS BENAR KARENA TIDAK BISA DIUBAH</span><br/>
                    </div>`;
                    //ini phc

                    text_div_paxs+=`
                    <div class="col-lg-6 mb-2">
                        <label style="color:red !important">*</label>
                        <label>Birth Date</label>
                        <div class="input-container-search-ticket" style="margin-bottom:5px;">
                            <input type="text" style="background:white !important;" class="form-control date-picker-birth" name="adult_birth_date`+parseInt(counter_passenger+1)+`" id="adult_birth_date`+parseInt(counter_passenger+1)+`" onchange="check_years_old(`+parseInt(counter_passenger+1)+`)" placeholder="Birth Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Birth Date '" autocomplete="off" readonly>
                            <input type="hidden" class="form-control" name="adult_years_old`+parseInt(counter_passenger+1)+`" id="adult_years_old`+parseInt(counter_passenger+1)+`">
                        </div>
                    </div>`;

                    text_div_paxs+=`
                    <div class="col-lg-12 col-md-12 col-sm-12" id="adult_div_avatar_identity`+parseInt(counter_passenger+1)+`" hidden>
                    </div>`;

                    text_div_paxs+=`
                    <div class="col-lg-6 mb-3">
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
                        }else if(template == 3){
                            text_div_paxs+=`<div class="form-select-2" style="width:100%;">`;
                        }else if(template == 6){
                            text_div_paxs+=`<div class="form-select" style="width:100%;">`;
                        }else{
                            text_div_paxs+=`<div class="form-select-2">`;
                        }

                        if(template == 4){
                            text_div_paxs+=`<select class="nice-select-default rounded" id="adult_identity_type`+parseInt(counter_passenger+1)+`" name="adult_identity_type`+parseInt(counter_passenger+1)+`" onchange="set_exp_identity(`+parseInt(counter_passenger+1)+`);">`;
                        }else{
                            text_div_paxs+=`<select id="adult_identity_type`+parseInt(counter_passenger+1)+`" name="adult_identity_type`+parseInt(counter_passenger+1)+`" onchange="set_exp_identity(`+parseInt(counter_passenger+1)+`);">`;
                        }
                        text_div_paxs+=`
                            <option value="ktp">NIK(KTP/KSK)</option>
                            <option value="passport">Passport</option>`;

                            text_div_paxs+=`</select>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6 mb-1">
                        <label style="color:red !important">*</label>
                        <label>Identity Number</label>
                        <div class="input-container-search-ticket" style="margin-bottom:5px;">
                            <input type="text" class="form-control" name="adult_identity_number`+parseInt(counter_passenger+1)+`" id="adult_identity_number`+parseInt(counter_passenger+1)+`" placeholder="Identity Number " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Identity Number '">
                        </div>
                    </div>

                    <div class="col-lg-6" id="identity_exp_date_hidden`+parseInt(counter_passenger+1)+`" hidden>
                        <label style="color:red !important">*</label>
                        <label>Identity Expired Date</label>
                        <div class="input-container-search-ticket" style="margin-bottom:5px;">
                            <input type="text" class="form-control date-picker-passport" name="adult_identity_expired_date`+parseInt(counter_passenger+1)+`" id="adult_identity_expired_date`+parseInt(counter_passenger+1)+`" placeholder="Identity Expired Date " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Identity Expired Date '">
                            <button type="button" class="primary-delete-date" onclick="clear_date('adult_identity_expired_date`+parseInt(counter_passenger+1)+`')"><i class="fa fa-trash-alt" style="color:#E92B2B;font-size:20px;"></i></button>
                        </div>
                    </div>`;

                    text_div_paxs+=`
                    <div class="col-lg-6">
                        <label style="color:red !important">*</label>
                        <label>Country of Issued</label>`;
                        if(template == 1){
                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                            text_div_paxs+=`
                                <div class="form-select">
                                    <select class="form-control js-example-basic-single" name="adult_country_of_issued`+parseInt(counter_passenger+1)+`_id" style="width:100%;" id="adult_country_of_issued`+parseInt(counter_passenger+1)+`_id" placeholder="Country Of Issued">
                                        <option value="">Select Country Of Issued</option>`;
                                        for(i in countries){
                                           if(countries[i].code == 'ID')
                                                text_div_paxs+=`<option value="`+countries[i].code+`" selected>`+countries[i].name+`</option>`;
                                           else
                                                text_div_paxs+=`<option value="`+countries[i].code+`">`+countries[i].name+`</option>`;
                                        }
                                    text_div_paxs+=`</select>
                                </div>
                                <button type="button" class="primary-delete-date" onclick="delete_country_of_issued('adult', `+parseInt(counter_passenger+1)+`)"><i class="fa fa-trash-alt" style="color:#E92B2B;font-size:20px;"></i></button>`;
                            text_div_paxs+=`</div>`;
                        }
                        else if(template == 2){
                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                            text_div_paxs+=`
                                    <select class="form-control js-example-basic-single" name="adult_country_of_issued`+parseInt(counter_passenger+1)+`_id" style="width:100%;" id="adult_country_of_issued`+parseInt(counter_passenger+1)+`_id" placeholder="Country Of Issued">
                                        <option value="">Select Country Of Issued</option>`;
                                        for(i in countries){
                                           if(countries[i].code == 'ID')
                                                text_div_paxs+=`<option value="`+countries[i].code+`" selected>`+countries[i].name+`</option>`;
                                           else
                                                text_div_paxs+=`<option value="`+countries[i].code+`">`+countries[i].name+`</option>`;
                                        }
                                    text_div_paxs+=`</select>
                                <button type="button" class="primary-delete-date" onclick="delete_country_of_issued('adult', `+parseInt(counter_passenger+1)+`)"><i class="fa fa-trash-alt" style="color:#E92B2B;font-size:20px;"></i></button>`;
                            text_div_paxs+=`</div>`;
                        }
                        else if(template == 3){
                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                            text_div_paxs+=`
                                <div class="form-select">
                                    <select class="form-control js-example-basic-single" name="adult_country_of_issued`+parseInt(counter_passenger+1)+`_id" style="width:100%;" id="adult_country_of_issued`+parseInt(counter_passenger+1)+`_id" placeholder="Country Of Issued">
                                        <option value="">Select Country Of Issued</option>`;
                                        for(i in countries){
                                           if(countries[i].code == 'ID')
                                                text_div_paxs+=`<option value="`+countries[i].code+`" selected>`+countries[i].name+`</option>`;
                                           else
                                                text_div_paxs+=`<option value="`+countries[i].code+`">`+countries[i].name+`</option>`;
                                        }
                                    text_div_paxs+=`</select>
                                </div>
                                <button type="button" class="primary-delete-date" onclick="delete_country_of_issued('adult', `+parseInt(counter_passenger+1)+`)"><i class="fa fa-trash-alt" style="color:#E92B2B;font-size:20px;"></i></button>`;
                            text_div_paxs+=`</div>`;
                        }
                        else if(template == 4){
                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                            text_div_paxs+=`
                                <div class="form-select">
                                    <select class="form-control js-example-basic-single" name="adult_country_of_issued`+parseInt(counter_passenger+1)+`_id" style="width:100%;" id="adult_country_of_issued`+parseInt(counter_passenger+1)+`_id" placeholder="Country Of Issued">
                                        <option value="">Select Country Of Issued</option>`;
                                        for(i in countries){
                                           if(countries[i].code == 'ID')
                                                text_div_paxs+=`<option value="`+countries[i].code+`" selected>`+countries[i].name+`</option>`;
                                           else
                                                text_div_paxs+=`<option value="`+countries[i].code+`">`+countries[i].name+`</option>`;
                                        }
                                    text_div_paxs+=`</select>
                                </div>
                                <button type="button" class="primary-delete-date" onclick="delete_country_of_issued('adult', `+parseInt(counter_passenger+1)+`)"><i class="fa fa-trash-alt" style="color:#E92B2B;font-size:20px;"></i></button>`;
                            text_div_paxs+=`</div>`;
                        }
                        else if(template == 5){
                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                            text_div_paxs+=`
                                <div class="form-select">
                                    <select class="form-control js-example-basic-single" name="adult_country_of_issued`+parseInt(counter_passenger+1)+`_id" style="width:100%;" id="adult_country_of_issued`+parseInt(counter_passenger+1)+`_id" placeholder="Country Of Issued">
                                        <option value="">Select Country Of Issued</option>`;
                                        for(i in countries){
                                           if(countries[i].code == 'ID')
                                                text_div_paxs+=`<option value="`+countries[i].code+`" selected>`+countries[i].name+`</option>`;
                                           else
                                                text_div_paxs+=`<option value="`+countries[i].code+`">`+countries[i].name+`</option>`;
                                        }
                                    text_div_paxs+=`</select>
                                </div>
                                <button type="button" class="primary-delete-date" onclick="delete_country_of_issued('adult', `+parseInt(counter_passenger+1)+`)"><i class="fa fa-trash-alt" style="color:#E92B2B;font-size:20px;"></i></button>`;
                            text_div_paxs+=`</div>`;
                        }
                        else if(template == 6){
                            text_div_paxs+=`<div class="input-container-search-ticket">`;
                            text_div_paxs+=`
                                <div class="form-select">
                                    <select class="form-control js-example-basic-single" name="adult_country_of_issued`+parseInt(counter_passenger+1)+`_id" style="width:100%;" id="adult_country_of_issued`+parseInt(counter_passenger+1)+`_id" placeholder="Country Of Issued">
                                        <option value="">Select Country Of Issued</option>`;
                                        for(i in countries){
                                            if(countries[i].code == 'ID')
                                                text_div_paxs+=`<option value="`+countries[i].code+`" selected>`+countries[i].name+`</option>`;
                                            else
                                                text_div_paxs+=`<option value="`+countries[i].code+`">`+countries[i].name+`</option>`;
                                        }
                                    text_div_paxs+=`</select>
                                </div>
                                <button type="button" class="primary-delete-date" onclick="delete_country_of_issued('adult', `+parseInt(counter_passenger+1)+`)"><i class="fa fa-trash-alt" style="color:#E92B2B;font-size:20px;"></i></button>`;
                            text_div_paxs+=`</div>`;
                        }
                    text_div_paxs+=`</div>`;


                    text_div_paxs+=`
                    <div class="col-lg-6">
                        <label style="color:red !important">*</label>
                        <label>Address KTP</label>
                        <div class="input-container-search-ticket">
                            <input type="text" class="form-control" name="adult_address`+parseInt(counter_passenger+1)+`" id="adult_address`+parseInt(counter_passenger+1)+`" placeholder="Address " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Address '">
                        </div>
                        <label style="font-size:12px; padding:0;">Example: Jl. Raya Darmo 177B</label>
                    </div>
                    <div class="col-lg-6" id="adult_cp_hidden1_`+parseInt(counter_passenger+1)+`">
                        <label style="color:red !important">*</label>
                        <label>Contact Email Address</label>
                        <div class="input-container-search-ticket">
                            <input type="text" class="form-control" name="adult_email`+parseInt(counter_passenger+1)+`" id="adult_email`+parseInt(counter_passenger+1)+`" placeholder="Email Address " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Email Address '">
                        </div>
                        <label style="font-size:12px; padding:0;">Example: email@example.com</label>
                    </div>
                    <div class="col-lg-12 col-md-12 col-sm-12">
                        <span style="padding-right:10px; font-weight:700; font-size:15px;font-weight:bold;color:red">DATA HARUS BENAR KARENA TIDAK BISA DIUBAH</span><br/>
                    </div>
                    <div class="col-lg-6" id="adult_cp_hidden2_`+parseInt(counter_passenger+1)+`">
                        <label style="color:red !important">*</label>
                        <label>WA Number (WhatsApp Number)</label>
                        <div class="row">
                            <div class="col-lg-3 col-md-3 col-sm-3 col-xs-5">
                                <div class="input-container-search-ticket">
                                    <div class="form-select">
                                        <select id="adult_phone_code`+parseInt(counter_passenger+1)+`_id" name="adult_phone_code`+parseInt(counter_passenger+1)+`_id" class="js-example-basic-single form-control">`;
                                            for(i in countries){
                                                if(countries[i].phone_code == 62)
                                                   text_div_paxs+=`<option value="`+countries[i].phone_code+`" selected>`+countries[i].phone_code+`</option>`;
                                                else
                                                   text_div_paxs+=`<option value="`+countries[i].phone_code+`">`+countries[i].phone_code+`</option>`;
                                            }

                                text_div_paxs+=` </select>
                                        </div>
                                    <input type="hidden" name="adult_phone_code`+parseInt(counter_passenger+1)+`" id="adult_phone_code`+parseInt(counter_passenger+1)+`" />
                                </div>
                            </div>
                            <div class="col-lg-9 col-md-9 col-sm-9 col-xs-7">
                                <input type="text" class="form-control" name="adult_phone`+parseInt(counter_passenger+1)+`" id="adult_phone`+parseInt(counter_passenger+1)+`" placeholder="Phone Number " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Phone Number '" onkeyup="onchange_number_no_zero(`+parseInt(counter_passenger+1)+`)">
                            </div>
                        </div>
                        <label style="font-size:12px; padding:0;">Example: 0 812345678</label>
                        <label style="color:`+color+` !important;">Please make sure to register with WA(WhatsApp) number for the result test</label>
                    </div>`;


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
    $('#adult_kabupaten'+parseInt(counter_passenger+1)+'_id').select2();
    $('#adult_kecamatan'+parseInt(counter_passenger+1)+'_id').select2();
    $('#adult_kelurahan'+parseInt(counter_passenger+1)+'_id').select2();
    if(vendor == 'phc'){
        $('#adult_tempat_lahir'+parseInt(counter_passenger+1)+'_id').select2();
        $('#adult_kabupaten'+parseInt(counter_passenger+1)+'_id').select2();
        $('#adult_kecamatan'+parseInt(counter_passenger+1)+'_id').select2();
        $('#adult_kelurahan'+parseInt(counter_passenger+1)+'_id').select2();
        $('#adult_kabupaten_ktp'+parseInt(counter_passenger+1)+'_id').select2();
        $('#adult_kecamatan_ktp'+parseInt(counter_passenger+1)+'_id').select2();
        $('#adult_kelurahan_ktp'+parseInt(counter_passenger+1)+'_id').select2();

        //verify
        $('#adult_klinis_golongan_darah'+parseInt(counter_passenger+1)).niceSelect();
        if(test_type.includes('PCR')){
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
        hidden_readonly_medical(parseInt(counter_passenger+1), 'profession', 'hidden');
        copy_ktp(parseInt(counter_passenger+1));
    }else if(vendor == 'periksain'){
        if(test_type == 'PRKATG')
            $('#adult_sample_method'+parseInt(counter_passenger+1)).niceSelect();
        $('#adult_provinsi'+parseInt(counter_passenger+1)+'_id').select2();
    }
//    get_kecamatan(`adult_kabupaten`+parseInt(counter_passenger+1),`adult_kecamatan`+parseInt(counter_passenger+1));
//    $('#adult_nationality'+parseInt(counter_passenger+1)).select2();
    if(type == 'open')
        $('#myModalPassenger'+parseInt(parseInt(counter_passenger))).modal('show');
    $('#adult_title'+parseInt(counter_passenger+1)).niceSelect();
    $('#adult_identity_type'+parseInt(counter_passenger+1)).niceSelect();
//    auto_complete(`adult_nationality`+parseInt(counter_passenger+1));
    counter_passenger++;
}

function regex_phone_sentra_medika(value){
  var regex_check = "^[1-9][0-9]*$";//number
    if(value.match(regex_check)!=null){
        return value
    }else{
        value = regex_phone_sentra_medika(value.slice(1,value.length));
        return value;
    }
}

function onchange_number_no_zero(val){
    if(document.getElementById('adult_phone'+val).value != '' && document.getElementById('adult_phone'+val).value != undefined){
        var data = regex_phone_sentra_medika(document.getElementById('adult_phone'+val).value)
        document.getElementById('adult_phone'+val).value = data;
    }
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
        <table style="width:100%;background:white;" class="list-of-table" id="perjalanan_ke_transmisi_lokal_div`+val+`">
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
}

function delete_pcr_table(type, val, nomor_table){
    try{
        var element = document.getElementById(type+'_table'+val+'_'+ nomor_table);
        element.parentNode.removeChild(element);
    }catch(err){
        console.log(err) //ada element yg tidak ada
    }

}

function onchange_title(val){
    try{
        if(document.getElementById('adult_title'+val).value == 'MS'){
            document.getElementById('adult_hamil_div'+val).hidden = false;
        }else{
            document.getElementById('adult_hamil_div'+val).hidden = true;
        }
    }catch(err){
        console.log(err) //ada element yg tidak ada
    }
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
                document.getElementById('adult_zip_code'+val).value = document.getElementById('adult_zip_code_ktp'+val).value;
                document.getElementById('adult_zip_code'+val).readOnly = true;
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
                document.getElementById('adult_zip_code'+val).value = '';
                document.getElementById('adult_zip_code'+val).readOnly = false;
                $('#adult_kabupaten'+val+'_id').val('');
                document.getElementById('select2-adult_kabupaten'+val+'_id-container').innerHTML = 'Select Kabupaten';
                document.getElementById('adult_kabupaten'+val).value = '';
                text = `<option value="">Select Kecamatan</option>`;
                document.getElementById('adult_kecamatan'+val+'_id').innerHTML = text;
                document.getElementById('select2-adult_kecamatan'+val+'_id-container').innerHTML = 'Select Kecamatan';
                $('#adult_kecamatan'+val+'_id').select2();
                $('#adult_kecamatan'+val+'_id').val('');
                text = `<option value="">Select Kelurahan</option>`;
                document.getElementById('adult_kelurahan'+val+'_id').innerHTML = text;
                document.getElementById('adult_kelurahan'+val).value = '';
                $('#adult_kelurahan'+val+'_id').select2();
                $('#adult_kelurahan'+val+'_id').val('');
                document.getElementById('select2-adult_kelurahan'+val+'_id-container').innerHTML = 'Select Kelurahan';
                document.getElementById('adult_kelurahan'+val).value = '';
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
    scrap_html.splice(1, 0, `<select class="form-group" id="title_`+counter_passenger+`" name="title_`+counter_passenger+`"><option value="MR">MR</option><option value="MS">MS</option><option value="MS">MS</option><option value="MSTR">MSTR</option><option value="MISS">MISS</option></select>`);

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
                            <h4 class="modal-title">Passenger `+(counter_passenger+1)+`</h4>
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

    try{ // buat halaman passenger
        document.getElementById("train_"+(counter_passenger+1)+"_search").addEventListener("keyup", function(event) {
            if (event.keyCode === 13) {
                // Cancel the default action, if needed
                event.preventDefault();
                // Trigger the button element with a click
                document.getElementById("passenger_btn_io_click"+(counter_passenger+1)).click();
              }
          });
    }catch(err){
    }

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

    if(test_type == 'swab_pcr'){
        $('input[name="klinis_tgl_rs_terakhir_'+parseInt(counter_passenger)+'"]').daterangepicker({
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
        }catch(err){
            console.log(err) //ada element yg tidak ada
        }
    }
}

function update_contact(type,val){
    if(type == 'booker'){
        if(document.getElementById('booker_title').value != '' && document.getElementById('booker_first_name').value != '' && document.getElementById('booker_last_name').value != '')
            document.getElementById('contact_person').value = document.getElementById('booker_title').value + ' ' + document.getElementById('booker_first_name').value + ' ' + document.getElementById('booker_last_name').value;
    }else if(type == 'passenger'){
        if(document.getElementById('adult_title'+val).value != '' && document.getElementById('adult_first_name'+val).value != '' && document.getElementById('adult_birth_date'+val).value != ''){
            document.getElementById('name_pax'+parseInt(val-1)).innerHTML = '';
            if(document.getElementById('adult_title'+val).value != '')
                document.getElementById('name_pax'+parseInt(val-1)).innerHTML += '<i><b>Name: </b>'+document.getElementById('adult_title'+val).value + '</i> ';
            if(document.getElementById('adult_first_name'+val).value != '')
                document.getElementById('name_pax'+parseInt(val-1)).innerHTML += '<i>'+document.getElementById('adult_first_name'+val).value + '</i> ';
            if(document.getElementById('adult_last_name'+val).value != '')
                document.getElementById('name_pax'+parseInt(val-1)).innerHTML += '<i>'+document.getElementById('adult_last_name'+val).value+'</i> ';
            if(document.getElementById('adult_birth_date'+val).value != ''){
                var adt_bd = document.getElementById('adult_birth_date'+val).value;
                var adt_age = moment().diff(adt_bd, 'years');
                document.getElementById('birth_date'+parseInt(val-1)).innerHTML = '<i><b>Birth Date: </b>'+document.getElementById('adult_birth_date'+val).value+' ('+adt_age+' years)</i>';
            }
        }
    }

}

function check_passenger(){

    if ($('#information_checkbox').is(':checked')) {
        document.getElementById("informasi_penting").style.border = "1px solid #cdcdcd";
        document.getElementById("information_div_checkbox").style.border = "1px solid #cdcdcd";

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
//                if(vendor == 'periksain'){
//                    if(now.format('DD MMM YYYY') == document.getElementById('booker_test_date'+i).value){
//                        if(new Date() > new Date(document.getElementById('booker_test_date'+i).value+' '+document.getElementById('booker_timeslot_id'+i).value.split('~')[1])){
//                            add_list = false;
//                            error_log += 'Test time reservation already pass please change test time ' + test_list_counter + '!</br>\n';
//                        }
//                    }
//                }else{
//                    if(test_type == 'PHCHCKATG' || test_type == 'PHCHCKPCR'){
//                        if(now.format('DD MMM YYYY') == document.getElementById('booker_test_date'+i).value){
//                            if(new Date() > new Date(document.getElementById('booker_test_date'+i).value+' '+document.getElementById('booker_timeslot_id'+i).value.split('~')[1])){
//                                add_list = false;
//                                error_log += 'Test time reservation already pass please change test time ' + test_list_counter + '!</br>\n';
//                            }
//                        }
//                    }
//                }
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

        var max_length = medical_config.result.response[test_type].adult_length_name;

        var check_booker = false;
        var radios = document.getElementsByName('useBooker');
        for (var j = 0, length = radios.length; j < length; j++) {
            if (radios[j].checked) {
                // do whatever you want with the checked radio
                if(radios[j].value == 'yes')
                    check_booker = true
                // only one radio can be logically checked, don't check the rest
                break;
            }
        }
        if(check_booker){
            if(check_name(document.getElementById('booker_title').value,
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
            }if(document.getElementById('booker_title').value == ''){
                error_log+= 'Please choose booker title!</br>\n';
                $("#booker_title").each(function() {
                    $(this).parent().find('.nice-select').css('border', '1px solid red');
                });
                check_form_booker = 1;
            }else{
                $("#booker_title").each(function() {
                    $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                });
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
            }

            if(error_log == ''){
                request['booker'] = {
                    "first_name": document.getElementById('booker_first_name').value,
                    "last_name": document.getElementById('booker_last_name').value,
                    "title": document.getElementById('booker_title').value,
                    'email': document.getElementById('booker_email').value,
                    'calling_code': document.getElementById('booker_phone_code').value,
                    'mobile': document.getElementById('booker_phone').value,
                    'nationality_code': document.getElementById('booker_nationality_id').value,
                    'booker_seq_id': document.getElementById('booker_id').value
                }
                request['contact_person'] = [{
                    "first_name": document.getElementById('booker_first_name').value,
                    "last_name": document.getElementById('booker_last_name').value,
                    "title": document.getElementById('booker_title').value,
                    'email': document.getElementById('booker_email').value,
                    'calling_code': document.getElementById('booker_phone_code').value,
                    'mobile': document.getElementById('booker_phone').value,
                    'nationality_code': document.getElementById('booker_nationality_id').value,
                    'contact_seq_id': document.getElementById('booker_id').value,
                    'is_also_booker': true
                }]
            }
        }

        var check_passenger_var = false;
        var ktp = [];
        var check_ktp_value = 1;
        if(counter_passenger == 0)
            error_log += 'Please fill passengers\n';
        else{
            request['passenger'] = []
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
                    }if(document.getElementById('adult_title'+nomor_pax).value == ''){
                        error_log+= 'Please choose title of adult passenger '+nomor_pax+'!</br>\n';
                        $("#adult_title"+nomor_pax).each(function() {
                            $(this).parent().find('.nice-select').css('border', '1px solid red');
                        });
                        check_form_periksain = 1;
                    }else{
                        $("#adult_title"+nomor_pax).each(function() {
                            $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                        });
                    }
                    if(document.getElementById('adult_first_name' + nomor_pax).value == '' || check_word(document.getElementById('adult_first_name' + nomor_pax).value) == false){
                        error_log += 'Please fill or use alpha characters for first name for customer '+ nomor_pax + ' !</br>\n';
                        document.getElementById('adult_first_name' + nomor_pax).style['border-color'] = 'red';
                        check_form_periksain = 1;
                    }else{
                        document.getElementById('adult_first_name' + nomor_pax).style['border-color'] = '#EFEFEF';
                    }
                    if(document.getElementById('adult_title' + nomor_pax).value == ''){
                        error_log += 'Please fill gender for customer '+ nomor_pax + ' !</br>\n';
                        $("#adult_title"+nomor_pax).each(function() {
                            $(this).parent().find('.nice-select').css('border', '1px solid red');
                        });
                        check_form_periksain = 1;
                    }else{
                        $("#adult_title"+nomor_pax).each(function() {
                            $(this).parent().find('.nice-select').css('border', '1px solid #EFEFEF');
                        });
                    }
                    if(document.getElementById('adult_nationality' + nomor_pax + '_id').value == ''){
                        error_log += 'Please fill nationality for customer '+ nomor_pax + ' !</br>\n';
                        $("#adult_nationality"+nomor_pax + '_id').each(function() {
                          $(this).siblings(".select2-container").css('border', '5px solid red');
                        });
                        check_form_periksain = 1;
                    }else{
                        $("#adult_nationality"+nomor_pax + '_id').each(function() {
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
                    if(document.getElementById('adult_address'+ nomor_pax).value == ''){
                        error_log+= 'Please fill address for customer passenger '+nomor_pax+'!</br>\n';
                        document.getElementById('adult_address'+ nomor_pax).style['border-color'] = 'red';
                    }else{
                        document.getElementById('adult_address'+ nomor_pax).style['border-color'] = '#EFEFEF';
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
                            if(document.getElementById('adult_country_of_issued'+ nomor_pax + '_id').value == ''){
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
                        }else if(document.getElementById('adult_identity_type' + nomor_pax).value == 'passport'){
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
                            if(document.getElementById('adult_country_of_issued'+ nomor_pax + '_id').value == ''){
                                error_log+= 'Please fill country of issued for customer '+ nomor_pax +'!</br>\n';
                                $("#adult_country_of_issued"+i+"_id").each(function() {
                                  $(this).siblings(".select2-container").css('border', '1px solid red');
                                });
                                check_form_personal = 1;
                            }else{
                                $("#adult_country_of_issued"+i+"_id").each(function() {
                                  $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                                });
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
                        check_form_periksain = 1;
                    }
                    if(i == 0 && document.getElementsByName('myRadios')[0].checked == true){
                        is_also_booker = true;
                        is_also_contact = true;
                    }else{
                        is_also_booker = false;
                        is_also_contact = false;
                    }
                    check_passenger_var = true;
                    if(i == 0 && check_booker == false){
                        request['booker'] = {
                            "first_name": document.getElementById('adult_first_name' + nomor_pax).value,
                            "last_name": document.getElementById('adult_last_name' + nomor_pax).value,
                            "title": document.getElementById('adult_title' + nomor_pax).value,
                            'email': document.getElementById('adult_email' + nomor_pax).value,
                            'calling_code': document.getElementById('adult_phone_code'+nomor_pax+'_id').value,
                            'mobile': document.getElementById('adult_phone'+nomor_pax).value,
                            'nationality_code': document.getElementById('adult_nationality' + nomor_pax + '_id').value,
                            'booker_seq_id': document.getElementById('adult_id' + nomor_pax).value
                        }
                        request['contact_person'] = [{
                            "first_name": document.getElementById('adult_first_name' + nomor_pax).value,
                            "last_name": document.getElementById('adult_last_name' + nomor_pax).value,
                            "title": document.getElementById('adult_title' + nomor_pax).value,
                            'email': document.getElementById('adult_email' + nomor_pax).value,
                            'calling_code': document.getElementById('adult_phone_code'+nomor_pax+'_id').value,
                            'mobile': document.getElementById('adult_phone'+nomor_pax).value,
                            'nationality_code': document.getElementById('adult_nationality' + nomor_pax + '_id').value,
                            'contact_seq_id': document.getElementById('adult_id' + nomor_pax).value,
                            'is_also_booker': true
                        }]
                    }

                    exp_date = document.getElementById('adult_identity_expired_date' + nomor_pax).value;
                    if(exp_date)
                        exp_date = moment(exp_date, 'DD MMM YYYY').format('YYYY-MM-DD');
                    else
                        exp_date = '';

                    request['passenger'].push({
                        "pax_type": "ADT",
                        "first_name": document.getElementById('adult_first_name' + nomor_pax).value,
                        "last_name": document.getElementById('adult_last_name' + nomor_pax).value,
                        "title": document.getElementById('adult_title' + nomor_pax).value,
                        "birth_date": document.getElementById('adult_birth_date' + nomor_pax).value,
                        "nationality_code": document.getElementById('adult_nationality' + nomor_pax + '_id').value,
                        "address_ktp": document.getElementById('adult_address' + nomor_pax).value,
                        "identity": {
                            "identity_country_of_issued_code": document.getElementById('adult_country_of_issued' + nomor_pax + '_id').value,
                            "identity_expdate": exp_date,
                            "identity_type": document.getElementById('adult_identity_type' + nomor_pax).value,
                            "identity_number": document.getElementById('adult_identity_number' + nomor_pax).value,
                        },
                        "passenger_seq_id": document.getElementById('adult_id' + nomor_pax).value,
                        "email": document.getElementById('adult_email' + nomor_pax).value,
                        "phone_number": document.getElementById('adult_phone_code'+nomor_pax+'_id').value + document.getElementById('adult_phone'+nomor_pax).value,
                        'is_also_booker': is_also_booker,
                        'is_also_contact': is_also_contact

                    })
                }catch(err){
                    console.log(err) //ada element yg tidak ada
                }

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

       if(error_log=='' && check_passenger_var == true){
    //       re_medical_signin('next');
            document.getElementById('time_limit_input').value = 200;
            document.getElementById('data').value = JSON.stringify(request);
            document.getElementById('signature').value = signature;
            document.getElementById('vendor').value = vendor;
            document.getElementById('test_type').value = test_type;
            document.getElementById('sentra_medika_review').submit();
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
                    scrollTop: $("#sentra_medika_pax_div").offset().top - 120
                }, 500);
           }else{
                $('html, body').animate({
                   scrollTop: $("#table_passenger"+check_to_scroll).offset().top - 120
                }, 500);
           }
       }
   }
    else{
        error_log = 'Anda harus menyetujui Syarat dan Ketentuan kami untuk melanjutkan pembelian<br/>\nYou must agree to our Terms and Conditions in order to continue'
        Swal.fire({
          type: 'error',
          title: 'Oops!',
          html: error_log,
        }).then((result) => {
          if (result.value) {
            document.getElementById("informasi_penting").style.border = "1px solid red";
            document.getElementById("information_div_checkbox").style.border = "1px solid red";
            $('html, body').animate({
                scrollTop: $("#informasi_penting").offset().top - 150
            }, 500);
          }
        })
    }
}
function check_passenger_data(){
    var request = {
        "passengers": []
    }
    var error_log = '';
    var check_passenger_var = false;
    var ktp = [];
    var check_ktp_value = 1;
    var max_length = 0;
    var error_log = '';
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
    if(counter_passenger == 0)
        error_log += 'Please fill passengers\n';
    else{
        if(vendor == 'phc'){
            for(i=0; i < counter_passenger; i++){
                nomor_pax = (i + 1)
                try{
                    //kasi if kosong
                    if(check_name(document.getElementById('adult_title'+nomor_pax).value,
                                document.getElementById('adult_first_name'+nomor_pax).value,
                                document.getElementById('adult_last_name'+nomor_pax).value,
                                max_length) == false){
                        error_log+= 'Total of Customer name '+nomor_pax+' maximum '+max_length+' characters!</br>\n';
                        document.getElementById('adult_first_name'+nomor_pax).style['border-color'] = 'red';
                        document.getElementById('adult_last_name'+nomor_pax).style['border-color'] = 'red';
                    }else{
                        document.getElementById('adult_first_name'+nomor_pax).style['border-color'] = '#EFEFEF';
                        document.getElementById('adult_last_name'+nomor_pax).style['border-color'] = '#EFEFEF';
                    }
                    if(document.getElementById('adult_first_name' + nomor_pax).value == '' || check_word(document.getElementById('adult_first_name' + nomor_pax).value) == false){
                        error_log += 'Please fill or use alpha characters for first name for customer '+ nomor_pax + ' !</br>\n';
                        document.getElementById('adult_first_name' + nomor_pax).style['border-color'] = 'red';
                    }else{
                        document.getElementById('adult_first_name' + nomor_pax).style['border-color'] = '#EFEFEF';
                    }
                    if(document.getElementById('adult_title' + nomor_pax).value == ''){
                        error_log += 'Please fill gender for customer '+ nomor_pax + ' !</br>\n';
                        document.getElementById('adult_title' + nomor_pax).style['border-color'] = 'red';
                    }else{
                        document.getElementById('adult_title' + nomor_pax).style['border-color'] = '#EFEFEF';
                    }
                    if(check_date(document.getElementById('adult_birth_date'+ nomor_pax).value)==false){
                        error_log+= 'Birth date wrong for customer passenger '+nomor_pax+'!</br>\n';
                        document.getElementById('adult_birth_date'+ nomor_pax).style['border-color'] = 'red';
                    }else{
                        document.getElementById('adult_birth_date'+ nomor_pax).style['border-color'] = '#EFEFEF';
                    }
                    if(check_phone_number(document.getElementById('adult_phone' + nomor_pax).value)==false){
                        error_log+= 'Phone number only contain number 8 - 12 digits for customer '+nomor_pax+'!</br>\n';
                        document.getElementById('adult_phone' + nomor_pax).style['border-color'] = 'red';
                    }else{
                        document.getElementById('adult_phone' + nomor_pax).style['border-color'] = '#EFEFEF';
                    }
                    if(document.getElementById('adult_tempat_lahir' + nomor_pax).value == ''){
                        error_log+= 'Please choose Tempat Lahir for customer '+nomor_pax+'!</br>\n';
                        document.getElementById('adult_tempat_lahir' + nomor_pax).style['border-color'] = 'red';
                    }else{
                        document.getElementById('adult_tempat_lahir' + nomor_pax).style['border-color'] = '#EFEFEF';
                    }
                    if(document.getElementById('adult_identity_type' + nomor_pax).value != ''){
                        document.getElementById('adult_identity_type' + nomor_pax).style['border-color'] = '#EFEFEF';
                        if(document.getElementById('adult_identity_type' + nomor_pax).value == 'ktp'){
                            if(document.getElementById('adult_identity_number'+ nomor_pax).value == ''){
                                error_log+= 'Please fill identity number for customer '+nomor_pax+'!</br>\n';
                                document.getElementById('adult_identity_number'+ nomor_pax).style['border-color'] = 'red';
                            }else if(check_ktp(document.getElementById('adult_identity_number'+ nomor_pax).value) == false){
                                error_log+= 'Please fill identity number, ktp only contain 16 digits for customer adult '+nomor_pax+'!</br>\n';
                                document.getElementById('adult_identity_number'+ nomor_pax).style['border-color'] = 'red';
                            }else{
                                document.getElementById('adult_identity_number'+ nomor_pax).style['border-color'] = '#EFEFEF';
                                if(ktp.includes(document.getElementById('adult_identity_number'+ nomor_pax).value) == true){
                                    error_log+= 'Duplicate identity number, for customer adult '+nomor_pax+'!</br>\n';
                                    document.getElementById('adult_identity_number'+ nomor_pax).style['border-color'] = 'red';
                                }else{
                                    ktp.push(document.getElementById('adult_identity_number'+ nomor_pax).value)
                                }
                            }
                        }else if(document.getElementById('adult_identity_type' + nomor_pax).value == 'passport'){
                            console.log('passport')
                            if(document.getElementById('adult_identity_number'+ nomor_pax).value == ''){
                                error_log+= 'Please fill identity number for customer '+nomor_pax+'!</br>\n';
                                document.getElementById('adult_identity_number'+ nomor_pax).style['border-color'] = 'red';
                            }else if(check_passport(document.getElementById('adult_identity_number'+ nomor_pax).value) == false){
                                error_log+= 'Please fill identity number, passport only contain more than 6 digits for customer adult '+nomor_pax+'!</br>\n';
                                document.getElementById('adult_identity_number'+ nomor_pax).style['border-color'] = 'red';
                            }else{
                                document.getElementById('adult_identity_number'+ nomor_pax).style['border-color'] = '#EFEFEF';
                                if(ktp.includes(document.getElementById('adult_identity_number'+ nomor_pax).value) == true){
                                    error_log+= 'Duplicate identity number, for customer adult '+nomor_pax+'!</br>\n';
                                    document.getElementById('adult_identity_number'+ nomor_pax).style['border-color'] = 'red';
                                }else{
                                    ktp.push(document.getElementById('adult_identity_number'+ nomor_pax).value)
                                }
                            }
                            if(document.getElementById('adult_country_of_issued'+ nomor_pax + '_id').value == ''){
                                error_log+= 'Please fill country of issued for customer '+ nomor_pax +'!</br>\n';
                                $("#adult_country_of_issued"+i+"_id").each(function() {
                                  $(this).siblings(".select2-container").css('border', '1px solid red');
                                });
                            }else{
                                $("#adult_country_of_issued"+i+"_id").each(function() {
                                  $(this).siblings(".select2-container").css('border', '1px solid #EFEFEF');
                                });
                            }
                            console.log('expired')
                            if(document.getElementById('adult_identity_expired_date'+nomor_pax).value == ''){
                                error_log+= 'Please fill identity expired date for customer '+ nomor_pax +'!</br>\n';
                                document.getElementById('adult_identity_expired_date'+ nomor_pax).style['border-color'] = 'red';
                            }else{
                                document.getElementById('adult_identity_expired_date'+ nomor_pax).style['border-color'] = '#EFEFEF';
                            }
                        }
                    }else{
                        error_log+= 'Please fill identity type for customer '+nomor_pax+'!</br>\n';
                        document.getElementById('adult_identity_type' + nomor_pax).style['border-color'] = 'red';
                    }
                    check_passenger_var = true;

                    request['passengers'].push({
                        "pax_type": "ADT",
                        "first_name": document.getElementById('adult_first_name' + nomor_pax).value,
                        "last_name": document.getElementById('adult_last_name' + nomor_pax).value,
                        "title": document.getElementById('adult_title' + nomor_pax).value,
                        "birth_date": document.getElementById('adult_birth_date' + nomor_pax).value,
                        "identity": {
                            "identity_number": document.getElementById('adult_identity_number' + nomor_pax).value,
                            "identity_type": document.getElementById('adult_identity_type' + nomor_pax).value,
                            "identity_expdate": document.getElementById('adult_identity_expired_date'+ nomor_pax).value,
                        },
                        "passenger_seq_id": document.getElementById('adult_id' + nomor_pax).value,
                        "tempat_lahir": document.getElementById('adult_tempat_lahir' + nomor_pax).value,
                        "phone_number": document.getElementById('adult_phone_code'+nomor_pax+'_id').value + document.getElementById('adult_phone'+nomor_pax).value,
                    })
                }catch(err){console.log(err);}
            }
        }
    }
    if(error_log == ''){
        return request
    }else{
        Swal.fire({
              type: 'error',
              title: 'Oops!',
              html: error_log,
        })
        return {}
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
    document.getElementById('next_sentra_medika').style.display = 'none';
    try{
        document.getElementById('sentra_medika_pax_div').hidden = true;
    }catch(err){
        console.log(err) //ada element yg tidak ada
    }
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
        scs.value = "Hide YPM";
    }
    else{
        sc.style.display = "none";
        scs.value = "Show YPM";
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

function copy_data(){
    //
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
//    const el = document.createElement('textarea');
//    el.innerHTML = $text;
//    document.body.appendChild(el);
//    el.select();
//    document.execCommand('copy');
//    document.body.removeChild(el);
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
    document.getElementById('sentra_medika_detail').style.display = 'none';
    document.getElementById('next_sentra_medika').style.display = 'none';

    try{
        document.getElementById('sentra_medika_pax_div').hidden = true;
    }catch(err){
        console.log(err) //ada element yg tidak ada
    }

    if(user_login.co_agent_frontend_security.includes('b2c_limitation') == false && user_login.co_agent_frontend_security.includes("corp_limitation") == false){
        document.getElementById('use_booker').style.display = 'none';
        document.getElementsByName('useBooker')[1].checked = true;
    }

    if(change_rebooking == true && total_passengers_rebooking != 0){
        //readd change value pax add table
        document.getElementById('passenger').value = total_passengers_rebooking;
        $('#passenger').niceSelect('update');
        tempcounter = total_passengers_rebooking;
        last_counter = 1;
        add_table();
        last_counter = tempcounter;
        // isi data passenger
        get_data_cache_passenger_sentra_medika();
        get_data_cache_schedule_sentra_medika();
//        if(vendor == 'periksain' || vendor == 'phc' && test_type == 'PHCHCKPCR' || vendor == 'phc' && test_type == 'PHCHCKATG'){
//            //isi data homecare
//
//        }

    }
    last_counter = tempcounter;
}

function medical_use_booker(value){
    console.log(value);
    if(value == true){
        document.getElementById('booker_div').style.display = 'block';
        document.getElementById('copy_booker_div').style.display = 'block';
    }else{
        document.getElementById('booker_div').style.display = 'none';
        document.getElementById('copy_booker_div').style.display = 'none';
    }
}

function add_table_verify(change_rebooking=false){
    var tempcounter = parseInt(document.getElementById('passenger').value);
    if(tempcounter > last_counter){
        document.getElementById('table_passenger_list').style.display = 'block';
        for(counting=last_counter;counting<tempcounter;counting++){
            add_table_of_passenger_verify();
        }
    }else{
        for(counting=last_counter-1;counting>=tempcounter;counting--){
            delete_table_of_passenger(counting);
        }
        counter_passenger = tempcounter;
    }
    document.getElementById('sentra_medika_detail').style.display = 'none';
    document.getElementById('next_sentra_medika').style.display = 'none';
    try{
        document.getElementById('sentra_medika_pax_div').hidden = true;
    }catch(err){
        console.log(err) //ada element yg tidak ada
    }

    if(change_rebooking == true && total_passengers_rebooking != 0){
        //readd change value pax add table
        document.getElementById('passenger').value = total_passengers_rebooking;
        $('#passenger').niceSelect('update');
        tempcounter = total_passengers_rebooking;
        last_counter = 1;
        add_table_verify();
        last_counter = tempcounter;
        // isi data
        get_data_cache_passenger_sentra_medika('verify');
    }
    last_counter = tempcounter;
}

function update_customer_fill(type,seq){
    if(vendor == 'phc'){
        if(test_type.includes('PCR')){
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
        }
    }
}

function clear_text_medical(sequence){
    document.getElementById("name_pax"+sequence).textContent = "-- Blank Customer Data --";
    document.getElementById("birth_date"+sequence).textContent = "";
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

function next_prev_form_medical(type, counter, id){
    pax = parseInt(id);
    counter = parseInt(counter);
    try{
        document.getElementById("progress_med"+counter+pax).style = "background-color:"+text_color+"; color:"+color+";";
        document.getElementById("progress_tab"+counter+pax).style = "background-color:"+color+"; color: white;";
        document.getElementById("progress_label"+counter+pax).style = "cursor:pointer; color:"+text_color+" !important;";
        document.getElementById("progress_div"+counter+pax).style.display = "block";
    }catch(err){
        console.log(err) //ada element yg tidak ada
    }
    length_progress = $(".progress_sentra_medika"+pax).length;
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

function auto_fill_data(){
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
            $('#booker_nationality_id').val(passenger_data_cache_medical[idx].nationality_name).trigger('change');
        }
        if(passenger_data_cache_medical[idx].title == 'MR')
            document.getElementById('adult_title'+counter).value = passenger_data_cache_medical[idx].title;
        else
            document.getElementById('adult_title'+counter).value = "MS";
        document.getElementById('adult_first_name'+counter).value = passenger_data_cache_medical[idx].first_name;
        document.getElementById('adult_last_name'+counter).value = passenger_data_cache_medical[idx].last_name;
        $('#adult_nationality'+counter+'_id').val(passenger_data_cache_medical[idx].nationality_name).trigger('change');
        $('input[name="adult_birth_date'+counter+'"]').daterangepicker({
              singleDatePicker: true,
              autoUpdateInput: true,
              showDropdowns: true,
              startDate: moment(passenger_data_cache_medical[idx].birth_date, 'DD MMM YYYY'),
              maxDate: moment(),
              opens: 'center',
              drops: 'down',
              locale: {
                  format: 'DD MMM YYYY',
              }
        });
        document.getElementById('adult_birth_date'+counter).value = passenger_data_cache_medical[idx].birth_date;
        if(passenger_data_cache_medical[idx].identity_type == 'ktp'){
            document.getElementById('adult_identity_type'+counter).value = passenger_data_cache_medical[idx].identity_type;
            document.getElementById('adult_identity_number'+counter).value = passenger_data_cache_medical[idx].identity_number;
            $('#adult_nationality'+counter+'_id').val(passenger_data_cache_medical[idx].nationality_code).trigger('change');
        }else if(passenger_data_cache_medical[idx].identity_type == 'passport'){
            document.getElementById('adult_identity_type'+counter).value = passenger_data_cache_medical[idx].identity_type;
            document.getElementById('adult_identity_number'+counter).value = passenger_data_cache_medical[idx].identity_number;
            if(passenger_data_cache_medical[idx].identity_expdate)
                document.getElementById('adult_identity_expired_date'+counter).value = moment(passenger_data_cache_medical[idx].identity_expdate,'YYYY-MM-DD').format('DD MMM YYYY');
            $('#adult_nationality'+counter+'_id').val(passenger_data_cache_medical[idx].nationality_code).trigger('change');
        }
        if(passenger_data_cache_medical[idx].phone_number.substr(0,2) == '62'){
            $('#adult_phone_code'+counter+'_id').val(62).trigger('change');
            document.getElementById('adult_phone'+counter).value = passenger_data_cache_medical[idx].phone_number.substr(2,100);
        }else if(passenger_data_cache_medical[idx].phone_number.substr(0,1) == '0'){
            $('#adult_phone_code'+counter+'_id').val(62).trigger('change');
            document.getElementById('adult_phone'+counter).value = passenger_data_cache_medical[idx].phone_number.substr(1,100);
        }else{
            $('#adult_phone_code'+counter+'_id').val(passenger_data_cache_medical[idx].phone_number.substr(0,2)).trigger('change');
            document.getElementById('adult_phone'+counter).value = passenger_data_cache_medical[idx].phone_number.substr(2,100);
        }
        document.getElementById('adult_email'+counter).value = passenger_data_cache_medical[idx].email;
        document.getElementById('adult_address'+counter).value = passenger_data_cache_medical[idx].address_ktp;
        $('#adult_title'+counter).niceSelect('update');
        $('#adult_identity_type'+counter).niceSelect('update');
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
            $('#booker_nationality_id').val(passenger_data_cache_medical[idx].nationality_code).trigger('change');
        }
        if(passenger_data_cache_medical[idx].title == 'MR')
            document.getElementById('adult_title'+counter).value = passenger_data_cache_medical[idx].title;
        else
            document.getElementById('adult_title'+counter).value = "MS"
        onchange_title(counter);
        document.getElementById('adult_first_name'+counter).value = passenger_data_cache_medical[idx].first_name;

        document.getElementById('adult_last_name'+counter).value = passenger_data_cache_medical[idx].last_name;
        $('#adult_nationality'+counter+'_id').val(passenger_data_cache_medical[idx].nationality_code).trigger('change');
        $('input[name="adult_birth_date'+counter+'"]').daterangepicker({
              singleDatePicker: true,
              autoUpdateInput: true,
              showDropdowns: true,
              startDate: moment(passenger_data_cache_medical[idx].birth_date, 'DD MMM YYYY'),
              maxDate: moment(),
              opens: 'center',
              drops: 'down',
              locale: {
                  format: 'DD MMM YYYY',
              }
        });
        document.getElementById('adult_birth_date'+counter).value = passenger_data_cache_medical[idx].birth_date;
        document.getElementById('adult_tempat_lahir'+counter).value = passenger_data_cache_medical[idx].tempat_lahir;
        document.getElementById('select2-adult_tempat_lahir'+counter+'_id-container').innerHTML = passenger_data_cache_medical[idx].tempat_lahir;
        document.getElementById('adult_identity_type'+counter).value = passenger_data_cache_medical[idx].identity_type;
        document.getElementById('adult_identity_number'+counter).value = passenger_data_cache_medical[idx].identity_number;
        $('#adult_country_of_issued'+counter+'_id').val(passenger_data_cache_medical[idx].identity_country_of_issued_code).trigger('change');
        if(passenger_data_cache_medical[idx].phone_number.substr(0,2) == '62'){
            $('#adult_phone_code'+counter+'_id').val(62).trigger('change');
            document.getElementById('adult_phone'+counter).value = passenger_data_cache_medical[idx].phone_number.substr(2,100);
        }else if(passenger_data_cache_medical[idx].phone_number.substr(0,1) == '0'){
            $('#adult_phone_code'+counter+'_id').val(62).trigger('change');
            document.getElementById('adult_phone'+counter).value = passenger_data_cache_medical[idx].phone_number.substr(1,100);
        }else{
            $('#adult_phone_code'+counter+'_id').val(passenger_data_cache_medical[idx].phone_number.substr(0,2)).trigger('change');
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

        if(Object.keys(passenger_data_cache_medical[idx].pcr_data).length > 6){
            document.getElementById('adult_klinis_sedang_hamil'+counter).value = passenger_data_cache_medical[idx].pcr_data.klinis_sedang_hamil;
            document.getElementById('adult_mother_name'+counter).value = passenger_data_cache_medical[idx].pcr_data.nama_orang_tua;
            document.getElementById('adult_perusahaan'+counter).value = passenger_data_cache_medical[idx].pcr_data.asal_perusahaan;
            document.getElementById('adult_nama_perusahaan'+counter).value = passenger_data_cache_medical[idx].pcr_data.nama_perusahaan;
            document.getElementById('adult_kriteria_pasien'+counter).value = passenger_data_cache_medical[idx].pcr_data.kriteria_covid;
            change_kriteria(counter);
            document.getElementById('adult_pemeriksaan_swab_ke'+counter).value = passenger_data_cache_medical[idx].pcr_data.pemeriksaan_swab_ke;
            document.getElementById('adult_sedang_dirawat_di_rs'+counter).value = passenger_data_cache_medical[idx].pcr_data.sedang_dirawat_di_rs;
            document.getElementById('adult_nama_rs'+counter).value = passenger_data_cache_medical[idx].pcr_data.nama_rs;

            $('input[name="adult_tanggal_masuk_rs'+counter+'"]').daterangepicker({
                  singleDatePicker: true,
                  autoUpdateInput: true,
                  showDropdowns: true,
                  startDate: moment(passenger_data_cache_medical[idx].pcr_data.tanggal_masuk_rs, 'DD MMM YYYY'),
                  maxDate: moment(),
                  opens: 'center',
                  drops: 'down',
                  locale: {
                      format: 'DD MMM YYYY',
                  }
            });
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
                $('input[name="adult_perjalanan_keluar_negeri_tanggal_perjalanan'+counter+'_'+idy+'"]').daterangepicker({
                      singleDatePicker: true,
                      autoUpdateInput: true,
                      showDropdowns: true,
                      startDate: moment(passenger_data_cache_medical[idx].pcr_data.daftar_perjalanan_keluar_negeri[idy].tanggal_perjalanan, 'YYYY-MM-DD').format('DD MMM YYYY'),
                      maxDate: moment(),
                      opens: 'center',
                      drops: 'down',
                      locale: {
                          format: 'DD MMM YYYY',
                      }
                });
                document.getElementById('adult_perjalanan_keluar_negeri_tanggal_perjalanan'+counter+'_'+idy).value = moment(passenger_data_cache_medical[idx].pcr_data.daftar_perjalanan_keluar_negeri[idy].tanggal_perjalanan, 'YYYY-MM-DD').format('DD MMM YYYY')
                $('input[name="adult_perjalanan_keluar_negeri_tiba_di_indonesia'+counter+'_'+idy+'"]').daterangepicker({
                      singleDatePicker: true,
                      autoUpdateInput: true,
                      showDropdowns: true,
                      startDate: moment(passenger_data_cache_medical[idx].pcr_data.daftar_perjalanan_keluar_negeri[idy].tiba_di_indonesia, 'YYYY-MM-DD').format('DD MMM YYYY'),
                      maxDate: moment(),
                      opens: 'center',
                      drops: 'down',
                      locale: {
                          format: 'DD MMM YYYY',
                      }
                });
                document.getElementById('adult_perjalanan_keluar_negeri_tiba_di_indonesia'+counter+'_'+idy).value = moment(passenger_data_cache_medical[idx].pcr_data.daftar_perjalanan_keluar_negeri[idy].tiba_di_indonesia, 'YYYY-MM-DD').format('DD MMM YYYY')
            }

            document.getElementById('adult_perjalanan_ke_transmisi_lokal'+counter).value = passenger_data_cache_medical[idx].pcr_data.perjalanan_ke_transmisi_lokal;
            onchange_perjalanan_ke_transmisi_lokal(counter)
            for(idy in passenger_data_cache_medical[idx].pcr_data.daftar_perjalanan_ke_transmisi_lokal){
                add_pcr_table('perjalanan_ke_transmisi_lokal', counter);
                document.getElementById('adult_perjalanan_ke_transmisi_lokal_nama_provinsi'+counter+'_'+idy).value = passenger_data_cache_medical[idx].pcr_data.daftar_perjalanan_ke_transmisi_lokal[idy].nama_provinsi
                document.getElementById('adult_perjalanan_ke_transmisi_lokal_nama_kota'+counter+'_'+idy).value = passenger_data_cache_medical[idx].pcr_data.daftar_perjalanan_ke_transmisi_lokal[idy].nama_kota
                $('input[name="adult_perjalanan_ke_transmisi_lokal_tanggal_perjalanan'+counter+'_'+idy+'"]').daterangepicker({
                      singleDatePicker: true,
                      autoUpdateInput: true,
                      showDropdowns: true,
                      startDate: moment(passenger_data_cache_medical[idx].pcr_data.daftar_perjalanan_ke_transmisi_lokal[idy].tanggal_perjalanan, 'YYYY-MM-DD').format('DD MMM YYYY'),
                      maxDate: moment(),
                      opens: 'center',
                      drops: 'down',
                      locale: {
                          format: 'DD MMM YYYY',
                      }
                });
                document.getElementById('adult_perjalanan_ke_transmisi_lokal_tanggal_perjalanan'+counter+'_'+idy).value = moment(passenger_data_cache_medical[idx].pcr_data.daftar_perjalanan_ke_transmisi_lokal[idy].tanggal_perjalanan, 'YYYY-MM-DD').format('DD MMM YYYY')
                $('input[name="adult_perjalanan_ke_transmisi_lokal_tiba_di_sini'+counter+'_'+idy+'"]').daterangepicker({
                      singleDatePicker: true,
                      autoUpdateInput: true,
                      showDropdowns: true,
                      startDate: moment(passenger_data_cache_medical[idx].pcr_data.daftar_perjalanan_ke_transmisi_lokal[idy].tiba_disini, 'YYYY-MM-DD').format('DD MMM YYYY'),
                      maxDate: moment(),
                      opens: 'center',
                      drops: 'down',
                      locale: {
                          format: 'DD MMM YYYY',
                      }
                });
                document.getElementById('adult_perjalanan_ke_transmisi_lokal_tiba_di_sini'+counter+'_'+idy).value = moment(passenger_data_cache_medical[idx].pcr_data.daftar_perjalanan_ke_transmisi_lokal[idy].tiba_disini, 'YYYY-MM-DD').format('DD MMM YYYY')
            }

            document.getElementById('adult_berkunjung_ke_fasilitas_kesehatan'+counter).value = passenger_data_cache_medical[idx].pcr_data.berkunjung_ke_fasilitas_kesehatan;
            onchange_berkunjung_ke_fasilitas_kesehatan(counter)
            for(idy in passenger_data_cache_medical[idx].pcr_data.daftar_ke_fasilitas_kesehatan){
                add_pcr_table('berkunjung_ke_fasilitas_kesehatan',counter);
                document.getElementById('adult_berkunjung_ke_fasilitas_kesehatan_nama_rumah_sakit'+counter+'_'+idy).value = passenger_data_cache_medical[idx].pcr_data.daftar_ke_fasilitas_kesehatan[idy].nama_rumah_sakit
                document.getElementById('adult_berkunjung_ke_fasilitas_kesehatan_nama_kota'+counter+'_'+idy).value = passenger_data_cache_medical[idx].pcr_data.daftar_ke_fasilitas_kesehatan[idy].nama_kota
                document.getElementById('adult_berkunjung_ke_fasilitas_kesehatan_nama_provinsi'+counter+'_'+idy).value = passenger_data_cache_medical[idx].pcr_data.daftar_ke_fasilitas_kesehatan[idy].nama_provinsi
                $('input[name="adult_berkunjung_ke_fasilitas_kesehatan_tanggal_kunjungan'+counter+'_'+idy+'"]').daterangepicker({
                      singleDatePicker: true,
                      autoUpdateInput: true,
                      showDropdowns: true,
                      startDate: moment(passenger_data_cache_medical[idx].pcr_data.daftar_ke_fasilitas_kesehatan[idy].tanggal_kunjungan, 'YYYY-MM-DD').format('DD MMM YYYY'),
                      maxDate: moment(),
                      opens: 'center',
                      drops: 'down',
                      locale: {
                          format: 'DD MMM YYYY',
                      }
                });
                document.getElementById('adult_berkunjung_ke_fasilitas_kesehatan_tanggal_kunjungan'+counter+'_'+idy).value = moment(passenger_data_cache_medical[idx].pcr_data.daftar_ke_fasilitas_kesehatan[idy].tanggal_kunjungan, 'YYYY-MM-DD').format('DD MMM YYYY')
            }

            document.getElementById('adult_berkunjung_ke_pasar_hewan'+counter).value = passenger_data_cache_medical[idx].pcr_data.berkunjung_ke_pasar_hewan;
            onchange_berkunjung_ke_pasar_hewan(counter)
            for(idy in passenger_data_cache_medical[idx].pcr_data.daftar_ke_pasar_hewan){
                add_pcr_table('berkunjung_ke_pasar_hewan',counter);
                document.getElementById('adult_berkunjung_ke_pasar_hewan_nama_lokasi_pasar'+counter+'_'+idy).value = passenger_data_cache_medical[idx].pcr_data.daftar_ke_pasar_hewan[idy].nama_lokasi_pasar
                document.getElementById('adult_berkunjung_ke_pasar_hewan_nama_kota'+counter+'_'+idy).value = passenger_data_cache_medical[idx].pcr_data.daftar_ke_pasar_hewan[idy].nama_kota
                document.getElementById('adult_berkunjung_ke_pasar_hewan_nama_provinsi'+counter+'_'+idy).value = passenger_data_cache_medical[idx].pcr_data.daftar_ke_pasar_hewan[idy].nama_provinsi
                $('input[name="adult_berkunjung_ke_pasar_hewan_tanggal_kunjungan'+counter+'_'+idy+'"]').daterangepicker({
                      singleDatePicker: true,
                      autoUpdateInput: true,
                      showDropdowns: true,
                      startDate: moment(passenger_data_cache_medical[idx].pcr_data.daftar_ke_pasar_hewan[idy].tanggal_kunjungan, 'YYYY-MM-DD').format('DD MMM YYYY'),
                      maxDate: moment(),
                      opens: 'center',
                      drops: 'down',
                      locale: {
                          format: 'DD MMM YYYY',
                      }
                });
                document.getElementById('adult_berkunjung_ke_pasar_hewan_tanggal_kunjungan'+counter+'_'+idy).value = moment(passenger_data_cache_medical[idx].pcr_data.daftar_ke_pasar_hewan[idy].tanggal_kunjungan, 'YYYY-MM-DD').format('DD MMM YYYY')
            }
            document.getElementById('adult_berkunjung_ke_pasien_dalam_pengawasan'+counter).value = passenger_data_cache_medical[idx].pcr_data.berkunjung_ke_pasien_dalam_pengawasan;
            onchange_berkunjung_ke_pasien_dalam_pengawasan(counter)
            for(idy in passenger_data_cache_medical[idx].pcr_data.daftar_ke_pasien_dalam_pengawasan){
                add_pcr_table('berkunjung_ke_pasien_dalam_pengawasan',counter);
                document.getElementById('adult_berkunjung_ke_pasien_dalam_pengawasan_nama_pasien'+counter+'_'+idy).value = passenger_data_cache_medical[idx].pcr_data.daftar_ke_pasien_dalam_pengawasan[idy].nama_pasien
                document.getElementById('adult_berkunjung_ke_pasien_dalam_pengawasan_alamat'+counter+'_'+idy).value = passenger_data_cache_medical[idx].pcr_data.daftar_ke_pasien_dalam_pengawasan[idy].alamat
                document.getElementById('adult_berkunjung_ke_pasien_dalam_pengawasan_hubungan'+counter+'_'+idy).value = passenger_data_cache_medical[idx].pcr_data.daftar_ke_pasien_dalam_pengawasan[idy].hubungan
                $('input[name="adult_berkunjung_ke_pasien_dalam_pengawasan_tanggal_kontak_pertama'+counter+'_'+idy+'"]').daterangepicker({
                      singleDatePicker: true,
                      autoUpdateInput: true,
                      showDropdowns: true,
                      startDate: moment(passenger_data_cache_medical[idx].pcr_data.daftar_ke_pasien_dalam_pengawasan[idy].tanggal_kontak_pertama, 'YYYY-MM-DD').format('DD MMM YYYY'),
                      maxDate: moment(),
                      opens: 'center',
                      drops: 'down',
                      locale: {
                          format: 'DD MMM YYYY',
                      }
                });
                document.getElementById('adult_berkunjung_ke_pasien_dalam_pengawasan_tanggal_kontak_pertama'+counter+'_'+idy).value = moment(passenger_data_cache_medical[idx].pcr_data.daftar_ke_pasien_dalam_pengawasan[idy].tanggal_kontak_pertama, 'YYYY-MM-DD').format('DD MMM YYYY')
                $('input[name="adult_berkunjung_ke_pasien_dalam_pengawasan_tanggal_kontak_terakhir'+counter+'_'+idy+'"]').daterangepicker({
                      singleDatePicker: true,
                      autoUpdateInput: true,
                      showDropdowns: true,
                      startDate: moment(passenger_data_cache_medical[idx].pcr_data.daftar_ke_pasien_dalam_pengawasan[idy].tanggal_kontak_terakhir, 'YYYY-MM-DD').format('DD MMM YYYY'),
                      maxDate: moment(),
                      opens: 'center',
                      drops: 'down',
                      locale: {
                          format: 'DD MMM YYYY',
                      }
                });
                document.getElementById('adult_berkunjung_ke_pasien_dalam_pengawasan_tanggal_kontak_terakhir'+counter+'_'+idy).value = moment(passenger_data_cache_medical[idx].pcr_data.daftar_ke_pasien_dalam_pengawasan[idy].tanggal_kontak_terakhir, 'YYYY-MM-DD').format('DD MMM YYYY')
            }

            document.getElementById('adult_berkunjung_ke_pasien_konfirmasi'+counter).value = passenger_data_cache_medical[idx].pcr_data.berkunjung_ke_pasien_konfirmasi;
            onchange_berkunjung_ke_pasien_konfirmasi(counter)
            for(idy in passenger_data_cache_medical[idx].pcr_data.daftar_ke_pasien_konfirmasi){
                add_pcr_table('berkunjung_ke_pasien_konfirmasi',counter);
                document.getElementById('adult_berkunjung_ke_pasien_konfirmasi_nama_pasien'+counter+'_'+idy).value = passenger_data_cache_medical[idx].pcr_data.berkunjung_ke_pasien_konfirmasi[idy].nama_pasien
                document.getElementById('adult_berkunjung_ke_pasien_konfirmasi_alamat'+counter+'_'+idy).value = passenger_data_cache_medical[idx].pcr_data.berkunjung_ke_pasien_konfirmasi[idy].alamat
                document.getElementById('adult_berkunjung_ke_pasien_konfirmasi_hubungan'+counter+'_'+idy).value = passenger_data_cache_medical[idx].pcr_data.berkunjung_ke_pasien_konfirmasi[idy].hubungan
                $('input[name="adult_berkunjung_ke_pasien_konfirmasi_tanggal_kontak_pertama'+counter+'_'+idy+'"]').daterangepicker({
                      singleDatePicker: true,
                      autoUpdateInput: true,
                      showDropdowns: true,
                      startDate: moment(passenger_data_cache_medical[idx].pcr_data.berkunjung_ke_pasien_konfirmasi[idy].tanggal_kontak_pertama, 'YYYY-MM-DD').format('DD MMM YYYY'),
                      maxDate: moment(),
                      opens: 'center',
                      drops: 'down',
                      locale: {
                          format: 'DD MMM YYYY',
                      }
                });
                document.getElementById('adult_berkunjung_ke_pasien_konfirmasi_tanggal_kontak_pertama'+counter+'_'+idy).value = moment(passenger_data_cache_medical[idx].pcr_data.berkunjung_ke_pasien_konfirmasi[idy].tanggal_kontak_pertama, 'YYYY-MM-DD').format('DD MMM YYYY')
                $('input[name="adult_berkunjung_ke_pasien_konfirmasi_tanggal_kontak_terakhir'+counter+'_'+idy+'"]').daterangepicker({
                      singleDatePicker: true,
                      autoUpdateInput: true,
                      showDropdowns: true,
                      startDate: moment(passenger_data_cache_medical[idx].pcr_data.berkunjung_ke_pasien_konfirmasi[idy].tanggal_kontak_terakhir, 'YYYY-MM-DD').format('DD MMM YYYY'),
                      maxDate: moment(),
                      opens: 'center',
                      drops: 'down',
                      locale: {
                          format: 'DD MMM YYYY',
                      }
                });
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
        $('#adult_klinis_sedang_hamil'+counter).niceSelect('update');
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
            $('#booker_nationality_id').val(passenger_data_cache_medical[idx].nationality_code).trigger('change');
        }
        if(passenger_data_cache_medical[idx].title == 'MR')
            document.getElementById('adult_title'+counter).value = passenger_data_cache_medical[idx].title;
        else
            document.getElementById('adult_title'+counter).value = "MS"
        document.getElementById('adult_first_name'+counter).value = passenger_data_cache_medical[idx].first_name;
        document.getElementById('adult_last_name'+counter).value = passenger_data_cache_medical[idx].last_name;
        $('#adult_nationality'+counter+'_id').val(passenger_data_cache_medical[idx].nationality_code).trigger('change');
        $('input[name="adult_birth_date'+counter+'"]').daterangepicker({
              singleDatePicker: true,
              autoUpdateInput: true,
              showDropdowns: true,
              startDate: moment(passenger_data_cache_medical[idx].birth_date, 'DD MMM YYYY'),
              maxDate: moment(),
              opens: 'center',
              drops: 'down',
              locale: {
                  format: 'DD MMM YYYY',
              }
        });
        document.getElementById('adult_birth_date'+counter).value = passenger_data_cache_medical[idx].birth_date;
        document.getElementById('adult_identity_type'+counter).value = passenger_data_cache_medical[idx].identity_type;
        document.getElementById('adult_identity_number'+counter).value = passenger_data_cache_medical[idx].identity_number;
        $('#adult_nationality'+counter+'_id').val(passenger_data_cache_medical[idx].identity_country_of_issued_code).trigger('change');
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
        try{
            if(passenger_data_cache_medical[idx].hasOwnProperty('sample_method_code'))
                document.getElementById('adult_sample_method').value = passenger_data_cache_medical[idx].sample_method_code;
            else
                document.getElementById('adult_sample_method').value = passenger_data_cache_medical[idx].sample_method;
        }catch(err){
            console.log(err) //ada element yg tidak ada
        }
        document.getElementById('adult_address'+counter).value = passenger_data_cache_medical[idx].address;

        document.getElementById('adult_provinsi'+counter).value = passenger_data_cache_medical[idx].provinsi;
        document.getElementById('adult_provinsi'+counter+'_id').value = passenger_data_cache_medical[idx].provinsi;
        document.getElementById('select2-adult_provinsi'+counter+'_id-container').innerHTML = passenger_data_cache_medical[idx].provinsi;

        get_kabupaten('adult_provinsi'+counter+'_id','adult_kabupaten'+counter+'_id');

        document.getElementById('adult_kabupaten'+counter).value = passenger_data_cache_medical[idx].kabupaten;
        document.getElementById('adult_kabupaten'+counter+'_id').value = passenger_data_cache_medical[idx].kabupaten;
        document.getElementById('select2-adult_kabupaten'+counter+'_id-container').innerHTML = passenger_data_cache_medical[idx].kabupaten;

        get_kecamatan('adult_kabupaten'+counter+'_id','adult_kecamatan'+counter+'_id');

        document.getElementById('adult_kecamatan'+counter).value = passenger_data_cache_medical[idx].kecamatan;
        document.getElementById('adult_kecamatan'+counter+'_id').value = passenger_data_cache_medical[idx].kecamatan;
        document.getElementById('select2-adult_kecamatan'+counter+'_id-container').innerHTML = passenger_data_cache_medical[idx].kecamatan;
        get_kelurahan('adult_kecamatan'+counter+'_id','adult_kelurahan'+counter+'_id');

        document.getElementById('adult_kelurahan'+counter).value = passenger_data_cache_medical[idx].kelurahan;
        document.getElementById('adult_kelurahan'+counter+'_id').value = passenger_data_cache_medical[idx].kelurahan;
        document.getElementById('select2-adult_kelurahan'+counter+'_id-container').innerHTML = passenger_data_cache_medical[idx].kelurahan;
        $('#adult_kelurahan'+counter+'_id').select2();

        document.getElementById('adult_kelurahan'+counter).value = passenger_data_cache_medical[idx].address;

        $('#adult_title'+counter).niceSelect('update');
        $('#adult_sample_method'+counter).niceSelect('update');
        $('#adult_identity_type'+counter).niceSelect('update');
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

function auto_fill_verify_data(){
    var counter = 1;
    var verified_check = true;
    for(idx in passenger_data_cache_medical){
        try{
            if(passenger_data_cache_medical[idx].verify == false)
                verified_check = false;
            if(passenger_data_cache_medical[idx].title == 'MR')
                document.getElementById('adult_title'+counter).value = passenger_data_cache_medical[idx].title;
            else
                document.getElementById('adult_title'+counter).value = "MS";
            onchange_title(counter);
            document.getElementById('adult_title'+counter).readOnly = true;
            for(i in document.getElementById('adult_title'+counter).options){
                if(document.getElementById('adult_title'+counter).options[i].selected != true)
                    document.getElementById('adult_title'+counter).options[i].disabled = true;
            }
            document.getElementById('adult_first_name'+counter).value = passenger_data_cache_medical[idx].first_name;

            document.getElementById('adult_last_name'+counter).value = passenger_data_cache_medical[idx].last_name;
            $('input[name="adult_birth_date'+counter+'"]').daterangepicker({
                  singleDatePicker: true,
                  autoUpdateInput: true,
                  showDropdowns: true,
                  startDate: moment(passenger_data_cache_medical[idx].birth_date, 'DD MMM YYYY'),
                  maxDate: moment(),
                  opens: 'center',
                  drops: 'down',
                  locale: {
                      format: 'DD MMM YYYY',
                  }
            });
            document.getElementById('adult_birth_date'+counter).value = passenger_data_cache_medical[idx].birth_date;
            document.getElementById('adult_tempat_lahir'+counter).value = passenger_data_cache_medical[idx].tempat_lahir;
            document.getElementById('select2-adult_tempat_lahir'+counter+'_id-container').innerHTML = passenger_data_cache_medical[idx].tempat_lahir;
            document.getElementById('adult_identity_type'+counter).value = passenger_data_cache_medical[idx].identity_type;
            document.getElementById('adult_identity_number'+counter).value = passenger_data_cache_medical[idx].identity_number;
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

            if(passenger_data_cache_medical[idx].identity_expdate){
                set_exp_identity(counter);
                document.getElementById('adult_identity_expired_date'+counter).value = moment(passenger_data_cache_medical[idx].identity_expdate, 'YYYY-MM-DD').format('DD MMM YYYY');
            }
            $('#adult_title'+counter).niceSelect('update');
            $('#adult_identity_type'+counter).niceSelect('update');
            update_contact('passenger',counter);
            counter++;
        }catch(err){console.log(err);}
    }
    if(verified_check == false && state == 'issued' && user_login.co_agent_frontend_security.includes('verify_phc') == true){
        document.getElementById('button_verify').innerHTML = `<button class="primary-btn-ticket" type="button" style="background-color:green" onclick="save_data_pax_backend('verify_data')"><i class="fas fa-save"></i> Save & Verify <i class="fas fa-upload"></i></button>`;
    }
    document.getElementById('btn_cancel').style.display = 'block';
    document.getElementById('btn_save').style.display = 'block';
}

function auto_fill_home_care(){
    if(schedule_medical.address != alamat_ss && vendor == 'periksain' || schedule_medical.address != alamat_ss && vendor == 'phc' && test_type == 'PHCHCKPCR' || schedule_medical.address != alamat_ss && vendor == 'phc' && test_type == 'PHCHCKATG' || vendor == 'periksain') //alamat DRIVE THRU
        document.getElementById('booker_address').value = schedule_medical.address;
    auto_fill_first_time = true;
}

function repeat_order_phc(){
    $("#myModalPluginGetBookingB2C").modal('show');
    document.getElementById('product').value = 'phc';
    document.getElementById('select2-product-container').innerHTML = 'phc';

    $('#product').niceSelect('update');
    change_product();
}

function open_date(counter){
    if ( $('#adult_birth_date'+counter).is('[readonly]') ) {
        document.getElementById('icon_fill'+counter).style.color = "black";
        document.getElementById('adult_birth_date'+counter).readOnly = false;

    }else{
        document.getElementById('icon_fill'+counter).style.color = color;
        document.getElementById('adult_birth_date'+counter).readOnly = true;

    }
}

function open_date_schedule(){
    if ( $('#booker_test_date1').is('[readonly]') ) {
        document.getElementById('icon_shcedule').style.color = color;
        document.getElementById('booker_test_date1').readOnly = false;
    }else{
        document.getElementById('icon_shcedule').style.color = "black";
        document.getElementById('booker_test_date1').readOnly = true;
    }
}

function check_kuota_phc(){
    var date_kuota = moment(document.getElementById('booker_test_date1').value).format('YYYY-MM-DD');
    for(i in test_kuota){
        for(j in test_kuota[i].timeslots){
            if(date_kuota == j){
                for(k in test_kuota[i].timeslots[j]){
                    document.getElementById("count_kuota_phc").innerHTML = test_kuota[i].timeslots[j][k].used_pcr_issued_count;
                    document.getElementById("total_pcr_timeslot").innerHTML = test_kuota[i].timeslots[j][k].total_pcr_issued_timeslot;
                    var count_percent = (parseInt(test_kuota[i].timeslots[j][k].used_pcr_issued_count) / parseInt(test_kuota[i].timeslots[j][k].total_pcr_issued_timeslot))*100;
                    document.getElementById('bar_kuota_phc').style.width = count_percent.toFixed(0)+"%";
                    document.getElementById('percent_kuota_phc').innerHTML = count_percent.toFixed(0)+"%";
                    if(count_percent.toFixed(0) >= 0 && count_percent.toFixed(0) <= 60){
                        document.getElementById('bar_kuota_phc').style.background = "#27b522";
                        document.getElementById('show_icon_kuota').innerHTML = `<i class="fas fa-check-circle" style="color:#27b522;"></i>`;
                    }else if(count_percent.toFixed(0) >= 61 && count_percent.toFixed(0) <= 99){
                        document.getElementById('bar_kuota_phc').style.background = "#d9d93d";
                        document.getElementById('show_icon_kuota').innerHTML = `<i class="fas fa-exclamation-circle" style="color:#d9d93d;"></i>`;
                    }else if(count_percent.toFixed(0) >= 100){
                        document.getElementById('bar_kuota_phc').style.background = "#f00c50";
                        document.getElementById('show_icon_kuota').innerHTML = `<i class="fas fa-times-circle" style="color:#f00c50;"></i>`;
                    }
                }
            }
        }
    }
}