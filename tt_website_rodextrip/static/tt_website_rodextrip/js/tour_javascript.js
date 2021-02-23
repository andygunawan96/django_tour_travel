$test = '';
var myVar;
var tourAutoCompleteVar;
var tour_choices = [];
sorting_value = '';
room_amount = 0;

var tour_type_list = [
    {
        value:'All',
        real_val: 'all',
        status: true
    },{
        value:'Series (With Tour Leader)',
        real_val: 'series',
        status: false
    },{
        value:'SIC (Without Tour Leader)',
        real_val: 'sic',
        status: false
    },{
        value:'Land Only',
        real_val: 'land',
        status: false
    },{
        value:'City Tour',
        real_val: 'city',
        status: false
    },{
        value:'Open Tour',
        real_val: 'open',
        status: false
    },{
        value:'Private Tour',
        real_val: 'private',
        status: false
    }
]

var sorting_list = [
    {
        value:'Name A-Z',
        status: false
    },
    {
        value:'Name Z-A',
        status: false
    },
    {
        value:'Lowest Price',
        status: false
    },
    {
        value:'Highest Price',
        status: false
    },
    {
        value:'Shortest Duration',
        status: false
    },
    {
        value:'Longest Duration',
        status: false
    }
]

var sorting_list2 = [
    {
        value:'Name',
        status: false
    },
    {
        value:'Price',
        status: false
    },
    {
        value:'Duration',
        status: false
    }
]

function get_dept_year(){
    temp = document.getElementById('tour_hidden_year').value;
    if (temp == "" || temp == "0000"){
        opt_text = `<option value="0000" selected="">All Years</option>`;
    }
    else {
        opt_text = `<option value="0000">All Years</option>`;
    }

    this_year = new Date().getFullYear();
    for(i=0; i<3; i++){
        if (temp == "" || temp == "0000"){
            opt_text += `<option value="`+(this_year+i)+`">`+(this_year+i)+`</option>`;
        }
        else {
            if (temp == this_year + i) {
                opt_text += `<option value="`+(this_year+i)+`" selected="">`+(this_year+i)+`</option>`;
            }
            else {
                opt_text += `<option value="`+(this_year+i)+`">`+(this_year+i)+`</option>`;
            }
        }
    }
    document.getElementById('tour_dest_year').innerHTML = opt_text;
}

function getrupiah(price){
    try{
        if(isNaN(price) == false && price.length != 0){
            var temp = parseFloat(price);
            var positif = false;
            if(temp > -1)
                positif = true;

            temp = temp.toString();
            temp = temp.split('-')[temp.split('-').length-1];
            var pj = temp.split('.')[0].toString().length;
            var priceshow="";
            for(x=0;x<pj;x++){
                if((pj-x)%3==0 && x!=0){
                    priceshow+=",";
                }
                priceshow+=temp.charAt(x);
            }
            if(temp.split('.').length == 2){
                for(x=pj;x<pj+3;x++){
                    priceshow+=temp.charAt(x);
                }
            }
            if(positif == false)
                priceshow = '-' + priceshow;

            return priceshow;
        }else{
            return '';
        }
    }catch(err){
        return price;
    }
}

function tour_get_city_search_name(current_city_id=0){
    search_city_name = 'All Cities';
    sel_objs = $('#tour_countries').select2('data');
    country_id = 0;
    for (i in sel_objs)
    {
        country_id = sel_objs[i].id;
    }
    var country = {};
    for(i in tour_country){
       if(tour_country[i].id == parseInt(country_id)){
           country = tour_country[i];
           break;
       }
    }
    for(i in country.city){
        if (country.city[i].id == current_city_id)
        {
            search_city_name = country.city[i].name;
        }
    }

    document.getElementById('search_city_name').innerHTML = search_city_name;
}

function copy_data(){
    const el = document.createElement('textarea');
    el.value = $test;
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

function tour_search_form_submit(){
    $('.button-search').addClass("running");
    document.getElementById('tour_search_form').submit();
}

function read_other_info_dict(data, current_list_type){
    var temp_txt2 = '';
    if (data.message){
        if (current_list_type != 'none'){
            if(template == 1){
                temp_txt2 += '<li>';
            }else if(template == 2){
                temp_txt2 += '<li style="list-style:unset;">'
            }else if(template == 3){
                temp_txt2 += '<li style="list-style:unset;">'
            }
        }

        for (i in data.message){
            if (data.message[i].style == 'B')
            {
                temp_txt2 += '<strong>' + String(data.message[i].text) + '</strong>';
            }
            else if (data.message[i].style == 'I')
            {
                temp_txt2 += '<i>' + String(data.message[i].text) + '</i>';
            }
            else if (data.message[i].style == 'U')
            {
                temp_txt2 += '<u>' + String(data.message[i].text) + '</u>';
            }
            else
            {
                temp_txt2 += String(data.message[i].text);
            }
        }

        if (current_list_type != 'none')
        {
            temp_txt2 += '</li>';
        }
        else
        {
            temp_txt2 += '<br/>';
        }
    }

    list_type_opt = {
        'none': {
            'start': '',
            'end': ''
        },
        'number': {
            'start': '<ol type="1" style="margin: 0px 15px; padding: 0px 15px; list-style: disc outside none; list-style-type: decimal;">',
            'end': '</ol>'
        },
        'letter': {
            'start': '<ol type="a" style="margin: 0px 15px; padding: 0px 15px; list-style: disc outside none; list-style-type: lower-latin;">',
            'end': '</ol>'
        },
        'dots': {
            'start': '<ul style="margin: 0px 15px; padding: 0px 15px; list-style: disc outside none;">',
            'end': '</ul>'
        },
        'romans': {
            'start': '<ol type="I" style="margin: 0px 15px; padding: 0px 15px; list-style: disc outside none; list-style-type: upper-roman;">',
            'end': '</ol>'
        },
    }

    if (data.children)
    {
        temp_txt2 += String(list_type_opt[data.child_list_type].start);
        for (j in data.children)
        {
            temp_txt2 += String(self.read_other_info_dict(data.children[j], data.child_list_type));
        }
        temp_txt2 += String(list_type_opt[data.child_list_type].end);
    }
    return temp_txt2;
}

function generate_other_info(list_of_dict){
    var temp_txt = '';
    for (i in list_of_dict)
    {
        temp_txt += String(read_other_info_dict(list_of_dict[i], 'none'));
        temp_txt += '<br/>';
    }

    return temp_txt;
}

function select_tour_date(key_change_date){
    line_data = tour_data.tour_lines[key_change_date];
    special_date_data = [];
    content_modal_special = '';
    footer_add = '';
    check_available_date = 0;
    if (tour_data.tour_type == 'open')
    {
        if (line_data.special_date_list.length != 0){
            for (dt in line_data.special_date_list){
                special_date_data.push(line_data.special_date_list[dt].date);
                if(moment().format('YYYY-MM-DD') == line_data.special_date_list[dt].date){
                    content_modal_special += `
                        <h6>`+moment(line_data.special_date_list[dt].date).format('DD MMMM YYYY')+`</h6>
                        <span>`+line_data.special_date_list[dt].name+`</span>
                        <hr/>
                        <div class="row">
                            <div class="col-lg-4 col-md-4">
                                <span style="font-weight:500; font-size:14px;">Adult: </span>
                                <span style="font-weight:500; font-size:14px;">`+line_data.special_date_list[dt].currency_code+` `+getrupiah(line_data.special_date_list[dt].additional_adult_price)+`</span>
                            </div>
                            <div class="col-lg-4 col-md-4">
                                <span style="font-weight:500; font-size:14px;">Child: </span>
                                <span style="font-weight:500; font-size:14px;">`+line_data.special_date_list[dt].currency_code+` `+getrupiah(line_data.special_date_list[dt].additional_child_price)+`</span>
                            </div>
                            <div class="col-lg-4 col-md-4">
                                <span style="font-weight:500; font-size:14px;">Infant: </span>
                                <span style="font-weight:500; font-size:14px;">`+line_data.special_date_list[dt].currency_code+` `+getrupiah(line_data.special_date_list[dt].additional_infant_price)+`</span>
                            </div>
                        </div>
                    `;

                    modal_special_date.setContent(content_modal_special);
                    modal_special_date.open();
                    $("#show_additional_charge").show();
                    setTimeout(function(){
                        $('html, body').animate({
                            scrollTop: $("#open_tour_div").offset().top - 250
                        }, 500);
                    }, 500);

                    check_available_date = 1;
                }else{
                    if(check_available_date == 0){
                        modal_special_date.setContent("No Additional Charge on this Date");
                        modal_special_date.close();
                        $("#show_additional_charge").hide();
                    }
                }
            }
            footer_add += '<hr style="margin-top:10px;margin-bottom:10px;/><div style="margin-bottom:10px; font-size:12px;"><span class="fa fa-hand-holding-usd" style="font-size:12px;"></span> Additional Charge</div>';
        }else{
            modal_special_date.setContent("No Additional Charge on this Date");
            modal_special_date.close();
            $("#show_additional_charge").hide();
        }
    }

    document.getElementById('tour_line_code').value = line_data.tour_line_code;
    document.getElementById('tour_line_display').value = line_data.departure_date_str + ' - ' + line_data.arrival_date_str;
    selected_tour_date = line_data.departure_date_str + ' - ' + line_data.arrival_date_str;
    if (tour_data.tour_type == 'open')
    {
        var open_tour_elements = document.getElementsByClassName('open_tour_date');
        for (var i = 0; i < open_tour_elements.length; i ++) {
            open_tour_elements[i].style.display = 'block';
        }
        if (moment().format('YYYY-MM-DD') >= line_data.departure_date)
        {
            dr_picker_start = moment().format('DD MMM YYYY')
        }
        else
        {
            dr_picker_start = line_data.departure_date_str
        }

        $('#open_tour_departure_date').daterangepicker({
            singleDatePicker: true,
            autoUpdateInput: true,
            opens: 'center',
            autoApply: true,
            startDate: dr_picker_start,
            minDate: dr_picker_start,
            maxDate: line_data.arrival_date_str,
            showDropdowns: true,
            opens: 'center',
            locale: {
                format: 'DD MMM YYYY',
                productDate: 'tour',
                styleDate: 'special_date_tour',
                dataDate: special_date_data,
                footerAdd: footer_add,
            }
        },function(start, end, label) {
            var check_pick_date = start.format('YYYY-MM-DD');
            var check_avail_date = 0;
            content_modal_special = '';
            for (dt in line_data.special_date_list){
                if(check_pick_date == line_data.special_date_list[dt].date){
                    content_modal_special += `
                        <h6>`+moment(line_data.special_date_list[dt].date).format('DD MMMM YYYY')+`</h6>
                    <span>`+line_data.special_date_list[dt].name+`</span>
                    <hr/>
                    <div class="row">
                        <div class="col-lg-4 col-md-4">
                            <span style="font-weight:500; font-size:14px;">Adult: </span>
                            <span style="font-weight:500; font-size:14px;">`+line_data.special_date_list[dt].currency_code+` `+getrupiah(line_data.special_date_list[dt].additional_adult_price)+`</span>
                        </div>
                        <div class="col-lg-4 col-md-4">
                            <span style="font-weight:500; font-size:14px;">Child: </span>
                            <span style="font-weight:500; font-size:14px;">`+line_data.special_date_list[dt].currency_code+` `+getrupiah(line_data.special_date_list[dt].additional_child_price)+`</span>
                        </div>
                        <div class="col-lg-4 col-md-4">
                            <span style="font-weight:500; font-size:14px;">Infant: </span>
                            <span style="font-weight:500; font-size:14px;">`+line_data.special_date_list[dt].currency_code+` `+getrupiah(line_data.special_date_list[dt].additional_infant_price)+`</span>
                        </div>
                    </div>`;

                    modal_special_date.setContent(content_modal_special);
                    modal_special_date.open();
                    $("#show_additional_charge").show();
                    setTimeout(function(){
                        $('html, body').animate({
                            scrollTop: $("#open_tour_div").offset().top - 250
                        }, 500);
                    }, 500);
                    check_avail_date = 1;
                }else{
                    if(check_avail_date == 0){
                         modal_special_date.setContent("No Additional Charge on this Date");
                         modal_special_date.close();
                         $("#show_additional_charge").hide();
                     }
                }
            }
            room_amount = 0;
            document.getElementById("tour_room_input").innerHTML = "";
            tour_table_detail();
        });
    }
    else
    {
        document.getElementById('product_date').innerHTML = selected_tour_date;
    }
    document.getElementById("tour_room_input_show").style.display = "block";
    $('#ChangeDateModal').modal('hide');
    room_amount = 0;
    document.getElementById("tour_room_input").innerHTML = "";
    tour_table_detail();
}

function set_tour_arrival_date(){
    var tour_dept_date = document.getElementById('open_tour_departure_date').value;
    var tour_arr_date = moment(tour_dept_date).add(tour_data.duration, 'days').format('DD MMM YYYY');
    document.getElementById('open_tour_arrival_date').value = tour_arr_date;
    selected_tour_date = tour_dept_date.toString() + ' - ' + tour_arr_date.toString();
    document.getElementById('product_date').innerHTML = selected_tour_date;
}

function add_tour_room(key_accomodation){
    room_data = tour_data.accommodations[key_accomodation];
    console.log(room_data);
    $('#tour_room_input').append(render_room_tour_field(parseInt(room_amount) + 1, room_data, key_accomodation));
    room_amount += 1;
    document.getElementById("total-price-container").classList.remove("hide");
    $('select').niceSelect();
    console.log(room_data);
    tour_table_detail();
}

function render_room_tour_field(idx, room_data, key_accomodation) {
    var room_lib = {
        'double': 'Double/Twin',
        'triple': 'Triple'
    }
    var template_txt = '';
        template_txt += '<div id="room_field_' + idx + '" style="margin-bottom:20px; padding:15px; border: 1px solid #cdcdcd;"><div class="banner-right"><div class="form-wrap" style="padding:0px !important; text-align:left;">';
        template_txt += '<input type="hidden" id="room_code_' + idx + '" name="room_code_' + idx + '" value="'+ room_data.room_code + '"/>';
        template_txt += '<h6 style="margin: 0px; padding-bottom:5px;"><i class="fa fa-building" style="font-size:18px;"></i> ' + room_data.hotel;
        if (room_data.star != 0){
            template_txt +=` ( <i class="fas fa-star" style="color:#FFC44D;"></i>` + room_data.star + `)</h6>`;
        }else{
            template_txt +=` ( Unrated )</h6>`;
        }
        if(room_data.address != ''){
            template_txt += `<span>`+room_data.address+`</span>`;
        }
        template_txt += '<h6 title="'+ room_data.hotel + ' (' + room_data.star + ') - ' + room_data.address + '"><span style="color:'+color+';">Room #' +  idx +  ' </span> - ' + room_data.name + ' ' + room_lib[room_data.bed_type] + '</h6>';
        template_txt += '<span style="font-size:12px;">' + room_data.description +'</span><br/>';

        template_txt+=`
        <div class="row" onclick="room_choose_sh(`+idx+`);" style="cursor:pointer;padding:15px 0px; margin:0px; border:1px solid `+color+`;">
            <div class="col-xs-8">
                <h6>
                    <span id="room_choose_adult`+idx+`">1 Adult</span>
                    <span id="room_choose_child`+idx+`"></span>
                    <span id="room_choose_infant`+idx+`"></span>
                </h6>`;
                if (room_data.bed_type=="double"){
                    template_txt+=`<span id="room_choose_special`+idx+`">Special Request: <span>Not Request</span></span>`;
                }else{
                    template_txt+=`<span id="room_choose_special`+idx+`">Special Request: <span style="color:#f23548">Can't Request <i class="fas fa-times"></i></span></span>`;
                }
            template_txt+=`
            </div>
            <div class="col-xs-4" style="text-align:right;">`;
                if(idx == 1){
                    template_txt+=`
                    <h6 class="center_vh" id="room_choose_open`+idx+`" style="display:none; color:`+color+`;">Open <i class="fas fa-caret-down"></i></h6>
                    <h6 class="center_vh" id="room_choose_close`+idx+`" style="display:block; color:`+color+`;">Close <i class="fas fa-caret-up"></i></h6>`;
                }else{
                    template_txt+=`
                    <h6 class="center_vh" id="room_choose_open`+idx+`" style="display:block; color:`+color+`;">Open <i class="fas fa-caret-down"></i></h6>
                    <h6 class="center_vh" id="room_choose_close`+idx+`" style="display:none; color:`+color+`;">Close <i class="fas fa-caret-up"></i></h6>`;
                }
        template_txt+=`
            </div>
        </div>`;

        if(idx == 1){
            template_txt += `<div class="row" style="margin-top:15px;" id="room_choose_div`+idx+`">`;
        }else{
            template_txt += `<div class="row" style="margin-top:15px; display:none;" id="room_choose_div`+idx+`">`;
        }
        template_txt += '<div class="col-lg-4 col-md-4 col-sm-4">';
        template_txt += '<span>Adult</span>';
        if(template == 1){
            template_txt += '<div class="input-container-search-ticket btn-group">';
        }
        if(template == 3){
            template_txt += '<div class="default-select" id="default-select" style="margin-bottom:5px;"><select class="adult_tour_room" id="adult_tour_room_' + idx + '" name="adult_tour_room_' + idx + '" data-index="' + idx + '" data-pax-limit="' + room_data.pax_limit + '" onchange="render_child_infant_selection(this); room_chose_render(this,'+idx+',1);">';
        }else if(template == 4){
            template_txt += '<div class="form-select" style="margin-bottom:5px;"><select class="nice-select-default rounded adult_tour_room" id="adult_tour_room_' + idx + '" name="adult_tour_room_' + idx + '" data-index="' + idx + '" data-pax-limit="' + room_data.pax_limit + '" onchange="render_child_infant_selection(this); room_chose_render(this,'+idx+',1);">';
        }else{
            template_txt += '<div class="form-select" id="default-select" style="margin-bottom:5px;"><select class="adult_tour_room" id="adult_tour_room_' + idx + '" name="adult_tour_room_' + idx + '" data-index="' + idx + '" data-pax-limit="' + room_data.pax_limit + '" onchange="render_child_infant_selection(this); room_chose_render(this,'+idx+',1);">';
        }
        for (var i=1; i<=parseInt(room_data.adult_limit); i++)
        {
            if (i == 1) {template_txt += '<option selected value="' + i + '">' + i + '</option>';}
            else {template_txt += '<option value="' + i + '">' + i + '</option>';}
        }
        template_txt += '</select></div>';
        if(template == 1){
            template_txt += '</div>';
        }
        template_txt += '<small id="tour_child_age_range' + i + '" class="hidden">(12-120 years old)</small>';
        template_txt += '</div>';
        template_txt += '<div class="col-lg-4 col-md-4 col-sm-4">';
        template_txt += '<span>Child</span>';
        if(template == 1){
            template_txt += '<div class="input-container-search-ticket btn-group">';
        }
        if(template == 3){
            template_txt += '<div class="default-select" style="margin-bottom:5px;"><select class="child_tour_room" id="child_tour_room_' + idx + '" name="child_tour_room_' + idx + '" data-index="' + idx + '" onchange="tour_table_detail(); room_chose_render(this,'+idx+',2)">';
        }else if(template == 4){
            template_txt += '<div class="form-select" style="margin-bottom:5px;"><select class="nice-select-default rounded child_tour_room" id="child_tour_room_' + idx + '" name="child_tour_room_' + idx + '" data-index="' + idx + '" onchange="tour_table_detail(); room_chose_render(this,'+idx+',2)">';
        }else{
            template_txt += '<div class="form-select" style="margin-bottom:5px;"><select class="child_tour_room" id="child_tour_room_' + idx + '" name="child_tour_room_' + idx + '" data-index="' + idx + '" onchange="tour_table_detail(); room_chose_render(this,'+idx+',2)">';
        }

        for (var i=0; i<=parseInt(room_data.pax_limit)-1; i++)
        {
            if (i == 0) {template_txt += '<option selected value="' + i + '">' + i + '</option>';}
            else {template_txt += '<option value="' + i + '">' + i + '</option>';}
        }
        template_txt += '</select></div>';
        if(template == 1){
            template_txt += '</div>';
        }
        template_txt += '<small id="tour_child_age_range' + i + '" class="hidden">(2-11 years old)</small>';
        template_txt += '</div>';
        template_txt += '<div class="col-lg-4 col-md-4 col-sm-4">';
        template_txt += '<span>Infant</span>';
        if(template == 1){
            template_txt += '<div class="input-container-search-ticket btn-group">';
        }
        if(template == 3){
            template_txt += '<div class="default-select" style="margin-bottom:5px;"><select class="infant_tour_room" id="infant_tour_room_' + idx + '" name="infant_tour_room_' + idx + '" data-index="' + idx + '" onchange="tour_table_detail(); room_chose_render(this,'+idx+',3)">';
        }else if(template == 4){
            template_txt += '<div class="form-select" style="margin-bottom:5px;"><select class="nice-select-default rounded infant_tour_room" id="infant_tour_room_' + idx + '" name="infant_tour_room_' + idx + '" data-index="' + idx + '" onchange="tour_table_detail(); room_chose_render(this,'+idx+',3)">';
        }else{
            template_txt += '<div class="form-select" style="margin-bottom:5px;"><select class="infant_tour_room" id="infant_tour_room_' + idx + '" name="infant_tour_room_' + idx + '" data-index="' + idx + '" onchange="tour_table_detail(); room_chose_render(this,'+idx+',3)">';
        }

        template_txt += '<option selected value="0">0</option>';
        template_txt += '<option value="1">1</option>';
        template_txt += '</select></div>';
        if(template == 1){
            template_txt += '</div>';
        }
        template_txt += '<small id="tour_child_age_range' + i + '" class="hidden">(0-1 years old)</small>';
        template_txt += '</div>';

        console.log(room_data);
        template_txt +=`
        <div class="row" style="padding:15px;">
            <div class="col-xs-12">
                <span style="display:inline-block; color:`+color+`; font-weight:bold; cursor:pointer;" id="pricing_detail`+n+`_up" onclick="show_hide_div('pricing_detail`+n+`');">See Price Detail <i class="fas fa-chevron-up"></i></span>
                <span style="display:none; color:`+color+`; font-weight:bold; cursor:pointer;" id="pricing_detail`+n+`_down" onclick="show_hide_div('pricing_detail`+n+`');">See Price Detail <i class="fas fa-chevron-down"></i></span>
            </div>
            <div class="col-lg-12" style="display:block;" id="pricing_detail`+n+`_div">
                <div class="row" style="padding:0px 15px;">`;
                for (pri in room_data.pricing){
                    template_txt += `
                    <div class="col-lg-12" style="margin-top:10px; border:1px solid #cdcdcd;">
                        <span style="font-weight:bold;">Min: `+room_data.pricing[pri].min_pax+` guest </span>`;

                    if(room_data.pricing[pri].is_infant_included == false){
                        template_txt+=`<span>(*excluding infant).</span>`;
                    }else{
                        template_txt+=`<span>(*including infant).</span>`;
                    }

                    template_txt+=`
                        <br/>
                        <span>Pricing (/guest): </span>
                        Adult: <span style="color:`+color+`;font-weight:bold;">`+room_data.pricing[pri].currency_id+` `+getrupiah(room_data.pricing[pri].adult_price)+`</span>,
                        Child: <span style="color:`+color+`;font-weight:bold;">`+room_data.pricing[pri].currency_id+` `+getrupiah(room_data.pricing[pri].child_price)+`</span>,
                        Infant: <span style="color:`+color+`;font-weight:bold;">`+room_data.pricing[pri].currency_id+` `+getrupiah(room_data.pricing[pri].infant_price)+`</span>
                    </div>`;
                }
            template_txt+=`
                </div>
            </div>
        </div>`;
        if (room_data.bed_type=="double")
        {
            template_txt += '<div class="col-lg-12" style="margin-bottom:15px; margin-top:10px;">';
            template_txt += '<textarea class="form-control" rows="3" cols="100%" id="notes_' + idx + '" name="notes_' + idx + '" placeholder="Special Request" onkeyup="room_chose_render(this,'+idx+',4)" style="margin-bottom:5px; resize:none; height:unset;"/>';
            template_txt += '<small style="color: #787878; margin-left: 2px;">Ex: king size, twin, non smoking, etc.</small>';
            template_txt += '</div>';
        }
        else
        {
            template_txt += '<input type="text" class="form-control hide" id="notes_' + idx + '" name="notes_' + idx + '" placeholder="Special Request" value=" "/>';
        }

        template_txt += `
        <div class="col-lg-12">
            <span style="font-size:14px; font-weight:600;">Note:</span><br/>
            <span>Minimum: <span style="font-size:12px;font-weight:500;color:`+color+`">`+room_data.pax_minimum+` Adult</span> and Maximum: <span style="font-size:12px;color:`+color+`;font-weight:500;">`+room_data.pax_limit+` Guest</span>.</span><br/>
            <ul style="list-style-type: disc; margin: 0 15px;">
                <li style="list-style: unset;">
                    If the selected room is adult and child, where the selected adult is less than the minimum number of adults ( < <span style="font-size:12px;font-weight:500;color:`+color+`">`+room_data.pax_minimum+` Adult</span> ), then there will be a child that is counted as an adult price until it reaches the minimum number of adults.
                </li>
                <li style="list-style: unset;">
                    If there is a selected room for adults only, which does not reach the minimum number of adults ( < <span style="font-size:12px;font-weight:500;color:`+color+`">`+room_data.pax_minimum+` Adult</span> ), then that selected room will get an additional Single Supplement fee.
                </li>
            </ul>
        </div>`;

        template_txt += '</div>';
        template_txt += '<input type="hidden" id="accomodation_index_' + idx + '" name="accomodation_index_' + idx + '" value="' + key_accomodation + '"/>';
        template_txt += '</div></div>';
        template_txt += '</div>';
    return template_txt;
}

function delete_tour_room(){
    var temp = '#room_field_' + String(room_amount);
    $(temp).remove();
    room_amount -= 1;
    tour_table_detail();
}

function render_child_infant_selection(adult_select) {
    var id = adult_select.getAttribute("data-index");
    var pax_limit = parseInt(adult_select.getAttribute("data-pax-limit"));
    var value = parseInt(adult_select.value);
    var child = pax_limit - value;
    var temp = 'child_tour_room_' + String(id);
    var $child = document.getElementById(temp);
    var temp2 = 'infant_tour_room_' + String(id);
    var $infant = document.getElementById(temp2);
    while ($child.hasChildNodes()) {
      $child.removeChild($child.lastChild);
    }
    while ($infant.hasChildNodes()) {
      $infant.removeChild($infant.lastChild);
    }
    for (var i=0; i<=child; i++)
    {
        var option = document.createElement("option");
        option.text = i;
        option.value = i;
        $child.appendChild(option);
    }
    for (var i=0; i<=value; i++)
    {
        var option = document.createElement("option");
        option.text = i;
        option.value = i;
        $infant.appendChild(option);
    }
    $child.value = 0;
    $infant.value = 0;
    $('#'+temp).niceSelect('update');
    $('#'+temp2).niceSelect('update');
    document.getElementById("room_choose_child"+id).innerText = "";
    document.getElementById("room_choose_infant"+id).innerText = "";
    tour_table_detail();
}

function check_detail(){
    error_check = '';
    if (document.getElementById('tour_line_code').value == '')
    {
        error_check += 'Please select Tour Package!\n';
    }
    if (tour_data.tour_type == 'open')
    {
        if (document.getElementById('open_tour_departure_date').value == '')
        {
            error_check += 'Please choose your departure date!\n';
        }
    }

    if (error_check == '')
    {
        $('.btn-next').addClass("running");
        $('.btn-next').prop('disabled', true);

        document.getElementById('room_amount').value = room_amount;
        document.getElementById('time_limit_input').value = time_limit;
        document.getElementById('go_to_pax').submit();
    }
    else
    {
        Swal.fire({
          type: 'error',
          title: 'Oops!',
          html: error_check,
        })
    }
}

function check_passenger(adult, child, infant){
    //booker
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
    length = 41;

   //adult
   for(i=1;i<=adult;i++){

       if(check_name(document.getElementById('adult_title'+i).value,
       document.getElementById('adult_first_name'+i).value,
       document.getElementById('adult_last_name'+i).value,
       length) == false){
           error_log+= 'Total of adult '+i+' name maximum '+length+' characters!</br>\n';
           document.getElementById('adult_first_name'+i).style['border-color'] = 'red';
           document.getElementById('adult_last_name'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('adult_first_name'+i).style['border-color'] = '#EFEFEF';
           document.getElementById('adult_last_name'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('adult_first_name'+i).value == ''){
           error_log+= 'Please input first name of adult passenger '+i+'!</br>\n';
           document.getElementById('adult_first_name'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('adult_first_name'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('adult_last_name'+i).value == ''){
           error_log+= 'Please input last name of adult passenger '+i+'!</br>\n';
           document.getElementById('adult_last_name'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('adult_last_name'+i).style['border-color'] = '#EFEFEF';
       }
       console.log(check_date(document.getElementById('adult_birth_date'+i).value));
       console.log(document.getElementById('adult_birth_date'+i).value);
       if(check_date(document.getElementById('adult_birth_date'+i).value)==false){
           error_log+= 'Birth date wrong for passenger adult '+i+'!</br>\n';
           document.getElementById('adult_birth_date'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('adult_birth_date'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('adult_nationality'+i).value == ''){
           error_log+= 'Please fill nationality for passenger adult '+i+'!</br>\n';
           document.getElementById('adult_nationality'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('adult_nationality'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('adult_passport_number'+i).value != '' ||
          document.getElementById('adult_passport_expired_date'+i).value != '' ||
          document.getElementById('adult_country_of_issued'+i).value != ''){
           if(document.getElementById('adult_passport_number'+i).value == ''){
               error_log+= 'Please fill passport number for passenger adult '+i+'!</br>\n';
               document.getElementById('adult_passport_number'+i).style['border-color'] = 'red';
           }else{
               document.getElementById('adult_passport_number'+i).style['border-color'] = '#EFEFEF';
           }if(document.getElementById('adult_passport_expired_date'+i).value == ''){
               error_log+= 'Please fill passport expired date for passenger adult '+i+'!</br>\n';
               document.getElementById('adult_passport_expired_date'+i).style['border-color'] = 'red';
           }else{
               document.getElementById('adult_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
           }if(document.getElementById('adult_country_of_issued'+i).value == ''){
               error_log+= 'Please fill country of issued for passenger adult '+i+'!</br>\n';
               document.getElementById('adult_country_of_issued'+i).style['border-color'] = 'red';
           }else{
               document.getElementById('adult_country_of_issued'+i).style['border-color'] = '#EFEFEF';
           }
       }if(document.getElementById('adult_cp'+i).checked == true){
            if(check_email(document.getElementById('adult_email'+i).value)==false){
                error_log+= 'Invalid Contact person email!</br>\n';
                document.getElementById('adult_email'+i).style['border-color'] = 'red';
            }else{
                document.getElementById('adult_email'+i).style['border-color'] = '#EFEFEF';
            }
            if(check_phone_number(document.getElementById('adult_phone'+i).value)==false){
                error_log+= 'Phone number Contact person only contain number 8 - 12 digits!</br>\n';
                document.getElementById('adult_phone'+i).style['border-color'] = 'red';
            }else
                document.getElementById('adult_phone'+i).style['border-color'] = '#EFEFEF';
       }
   }
   //child
   for(i=1;i<=child;i++){
       if(check_name(document.getElementById('child_title'+i).value,
       document.getElementById('child_first_name'+i).value,
       document.getElementById('child_last_name'+i).value,
       length) == false){
           error_log+= 'Total of child '+i+' name maximum '+length+' characters!</br>\n';
           document.getElementById('child_first_name'+i).style['border-color'] = 'red';
           document.getElementById('child_last_name'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('child_first_name'+i).style['border-color'] = '#EFEFEF';
           document.getElementById('child_last_name'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('child_first_name'+i).value == ''){
           error_log+= 'Please input first name of child passenger '+i+'!</br>\n';
           document.getElementById('child_first_name'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('child_first_name'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('child_last_name'+i).value == ''){
           error_log+= 'Please input last name of child passenger '+i+'!</br>\n';
           document.getElementById('child_last_name'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('child_last_name'+i).style['border-color'] = '#EFEFEF';
       }if(check_date(document.getElementById('child_birth_date'+i).value)==false){
           error_log+= 'Birth date wrong for passenger child '+i+'!</br>\n';
           document.getElementById('child_birth_date'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('child_birth_date'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('child_nationality'+i).value == ''){
           error_log+= 'Please fill nationality for passenger child '+i+'!</br>\n';
           document.getElementById('child_nationality'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('child_nationality'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('child_passport_number'+i).value != '' ||
          document.getElementById('child_passport_expired_date'+i).value != '' ||
          document.getElementById('child_country_of_issued'+i).value != ''){
           if(document.getElementById('child_passport_number'+i).value == ''){
               error_log+= 'Please fill passport number for passenger child '+i+'!</br>\n';
               document.getElementById('child_passport_number'+i).style['border-color'] = 'red';
           }else{
               document.getElementById('child_passport_number'+i).style['border-color'] = '#EFEFEF';
           }if(document.getElementById('child_passport_expired_date'+i).value == ''){
               error_log+= 'Please fill passport expired date for passenger child '+i+'!</br>\n';
               document.getElementById('child_passport_expired_date'+i).style['border-color'] = 'red';
           }else{
               document.getElementById('child_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
           }if(document.getElementById('child_country_of_issued'+i).value == ''){
               error_log+= 'Please fill country of issued for passenger child '+i+'!</br>\n';
               document.getElementById('child_country_of_issued'+i).style['border-color'] = 'red';
           }else{
               document.getElementById('child_country_of_issued'+i).style['border-color'] = '#EFEFEF';
           }
       }
   }

   //infant
   for(i=1;i<=infant;i++){
       if(check_name(document.getElementById('infant_title'+i).value,
       document.getElementById('infant_first_name'+i).value,
       document.getElementById('infant_last_name'+i).value,
       length) == false){
           error_log+= 'Total of infant '+i+' name maximum '+length+' characters!</br>\n';
           document.getElementById('infant_first_name'+i).style['border-color'] = 'red';
           document.getElementById('infant_last_name'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('infant_first_name'+i).style['border-color'] = '#EFEFEF';
           document.getElementById('infant_last_name'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('infant_first_name'+i).value == ''){
           error_log+= 'Please input first name of infant passenger '+i+'!</br>\n';
           document.getElementById('infant_first_name'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('infant_first_name'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('infant_last_name'+i).value == ''){
           error_log+= 'Please input last name of infant passenger '+i+'!</br>\n';
           document.getElementById('infant_last_name'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('infant_last_name'+i).style['border-color'] = '#EFEFEF';
       }if(check_date(document.getElementById('infant_birth_date'+i).value)==false){
           error_log+= 'Birth date wrong for passenger infant '+i+'!</br>\n';
           document.getElementById('infant_birth_date'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('infant_birth_date'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('infant_nationality'+i).value == ''){
           error_log+= 'Please fill nationality for passenger infant '+i+'!</br>\n';
           document.getElementById('infant_nationality'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('infant_nationality'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('infant_passport_number'+i).value != '' ||
          document.getElementById('infant_passport_expired_date'+i).value != '' ||
          document.getElementById('infant_country_of_issued'+i).value != ''){
           if(document.getElementById('infant_passport_number'+i).value == ''){
               error_log+= 'Please fill passport number for passenger infant '+i+'!</br>\n';
               document.getElementById('infant_passport_number'+i).style['border-color'] = 'red';
           }else{
               document.getElementById('infant_passport_number'+i).style['border-color'] = '#EFEFEF';
           }if(document.getElementById('infant_passport_expired_date'+i).value == ''){
               error_log+= 'Please fill passport expired date for passenger infant '+i+'!</br>\n';
               document.getElementById('infant_passport_expired_date'+i).style['border-color'] = 'red';
           }else{
               document.getElementById('infant_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
           }if(document.getElementById('infant_country_of_issued'+i).value == ''){
               error_log+= 'Please fill country of issued for passenger infant '+i+'!</br>\n';
               document.getElementById('infant_country_of_issued'+i).style['border-color'] = 'red';
           }else{
               document.getElementById('infant_country_of_issued'+i).style['border-color'] = '#EFEFEF';
           }
       }

   }
   if(error_log=='')
   {
       for(i=1;i<=adult;i++){
                document.getElementById('adult_birth_date'+i).disabled = false;
                document.getElementById('adult_passport_expired_date'+i).disabled = false;
       }
       for(i=1;i<=child;i++){
            document.getElementById('child_birth_date'+i).disabled = false;
            document.getElementById('child_passport_expired_date'+i).disabled = false;
       }
       for(i=1;i<=infant;i++){
            document.getElementById('infant_birth_date'+i).disabled = false;
            document.getElementById('infant_passport_expired_date'+i).disabled = false;
       }
       document.getElementById('time_limit_input').value = time_limit;
       document.getElementById('tour_review').submit();
   }
   else
   {
       document.getElementById('show_error_log').innerHTML = error_log;
       $("#myModalErrorPassenger").modal('show');
       $('.btn-next').removeClass("running");
       $('.btn-next').prop('disabled', false);
       $('.loader-rodextrip').fadeOut();
   }
}

function update_contact_cp(val){
    temp = 1;
    while(temp != adult+1){
        console.log(document.getElementById('adult_cp'+temp.toString()).checked);
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

function refresh_room_availability(seq){
    var total_pax = document.getElementById('total_pax_all').value;
    var disabled_rooms_adt = []
    var disabled_rooms_chd = []
    var disabled_rooms_inf = []

    for (i=1; i <= parseInt(room_amount); i++)
    {
        room_seq = document.getElementById('room_sequence'+i.toString()).value;
        document.getElementById('adult_quota_room'+room_seq.toString()).value = document.getElementById('ori_adult_quota_room'+room_seq.toString()).value;
        document.getElementById('child_quota_room'+room_seq.toString()).value = document.getElementById('ori_child_quota_room'+room_seq.toString()).value;
        document.getElementById('infant_quota_room'+room_seq.toString()).value = document.getElementById('ori_infant_quota_room'+room_seq.toString()).value;
    }

    for (i=1; i <= parseInt(total_pax); i++)
    {
        var pax_type = document.getElementById('pax_type'+i.toString()).value;
        if (document.getElementById('room_select_pax'+i.toString()).value != 0)
        {
            room_seq = document.getElementById('room_select_pax'+i.toString()).value;
            if (pax_type == 'ADT')
            {
                target = document.getElementById('adult_quota_room'+room_seq.toString());
                changes = parseInt(target.value) - 1;
                target.value = changes;
                if (changes <= 0)
                {
                    disabled_rooms_adt.push(room_seq);
                }
            }
            else if (pax_type == 'CHD')
            {
                target = document.getElementById('child_quota_room'+room_seq.toString());
                changes = parseInt(target.value) - 1;
                target.value = changes;
                if (changes <= 0)
                {
                    disabled_rooms_chd.push(room_seq);
                }
            }
            else if (pax_type == 'INF')
            {
                target = document.getElementById('infant_quota_room'+room_seq.toString());
                changes = parseInt(target.value) - 1;
                target.value = changes;
                if (changes <= 0)
                {
                    disabled_rooms_inf.push(room_seq);
                }
            }
        }
    }

    for (i=1; i <= parseInt(total_pax); i++)
    {
        var pax_type = document.getElementById('pax_type'+i.toString()).value;
        var op = document.getElementById('room_select_pax'+i.toString()).getElementsByTagName("option");
        for (var k = 0; k < op.length; k++) {
            if (pax_type == 'ADT')
            {
                found_in_dis = 0;
                for (j=0; j<disabled_rooms_adt.length; j++)
                {
                    if (parseInt(op[k].value) == parseInt(disabled_rooms_adt[j])) {
                        found_in_dis = 1;
                    }
                }
                if (found_in_dis == 1)
                {
                    if (op[k].disabled != true)
                    {
                        op[k].disabled = true;
                    }
                }
                else
                {
                    if (op[k].disabled == true)
                    {
                        op[k].disabled = false;
                    }
                }
            }
            else if (pax_type == 'CHD')
            {
                found_in_dis = 0;
                for (j=0; j<disabled_rooms_chd.length; j++)
                {
                    if (parseInt(op[k].value) == parseInt(disabled_rooms_chd[j])) {
                        found_in_dis = 1;
                    }
                }
                if (found_in_dis == 1)
                {
                    if (op[k].disabled != true)
                    {
                        op[k].disabled = true;
                    }
                }
                else
                {
                    if (op[k].disabled == true)
                    {
                        op[k].disabled = false;
                    }
                }
            }
            else if (pax_type == 'INF')
            {
                found_in_dis = 0;
                for (j=0; j<disabled_rooms_inf.length; j++)
                {
                    if (parseInt(op[k].value) == parseInt(disabled_rooms_inf[j])) {
                        found_in_dis = 1;
                    }
                }
                if (found_in_dis == 1)
                {
                    if (op[k].disabled != true)
                    {
                        op[k].disabled = true;
                    }
                }
                else
                {
                    if (op[k].disabled == true)
                    {
                        op[k].disabled = false;
                    }
                }
            }
        }
        $('#room_select_pax'+i.toString()).niceSelect('update');
    }
}

function tour_check_rooms()
{
    var all_clear = true;
    var total_pax = document.getElementById('total_pax_all').value;
    for (i=1; i <= parseInt(total_pax); i++){
        if (document.getElementById('room_select_pax'+i.toString()).value == 0)
        {
            all_clear = false;
            document.getElementById('div_select_pax'+i.toString()).style['border'] = '1px solid red';
        }
        else
        {
            document.getElementById('div_select_pax'+i.toString()).style['border'] = 'none';
        }
    }
    return all_clear;
}

function force_issued_tour(val){
    //tambah swal
    if(val == 0)
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
        $("#issuedModal").modal('hide');
        please_wait_transaction();
        $('.next-loading-booking').addClass("running");
        $('.next-loading-booking').prop('disabled', true);
        $('.next-loading-issued').prop('disabled', true);
        $('.issued_booking_btn').prop('disabled', true);
        commit_booking_tour(val);
      }
    })
}

function tour_hold_booking(val){
    var check_rooms = tour_check_rooms();
    book_setup_txt = ``;

    if (check_rooms == true)
    {
        book_setup_txt += `<input type="hidden" id="force_issued_opt" name="force_issued_opt" value="`+val+`"/>`;
        title = '';
        if(val == 0)
            title = 'Are you sure you want to Hold Booking?';
        else if(val == 1)
            title = 'Are you sure you want to Force Issued this booking?';
        Swal.fire({
          title: title,
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes'
        }).then((result) => {
          if (result.value) {
            if (val==0){
                please_wait_transaction()
                $('.next-loading-booking').addClass("running");
                $('.next-loading-booking').prop('disabled', true);
                $('.next-loading-issued').prop('disabled', true);
            }
            else{
                $("#issuedModal").modal('hide');
                please_wait_transaction()
                $('.next-loading-booking').prop('disabled', true);
                $('.next-loading-issued').addClass("running");
                $('.next-loading-issued').prop('disabled', true);
            }
            document.getElementById('commit_booking_setup').innerHTML = book_setup_txt;
            update_sell_tour(val);
          }
        })
    }
    else
    {
        $("#issuedModal").modal('hide');
        document.getElementById('show_error_log').innerHTML = "Please assign a room to each passengers.";
        $("#myModalErrorReview").modal('show');
    }
}

function tour_pre_create_booking()
{
    $("#issuedModal").modal('show');
}

function print_payment_rules(payment)
{
    pay_text = ``;
    var idx = 1;
    for (i in payment)
    {
        var payment_price = (parseFloat(payment[i].payment_percentage) / 100) * grand_total;
        if (payment_price > 0)
        {
            pay_text += `
            <tr>
                 <td>` +payment[i].name+ `</td>
                 <td id="payment_` + String(idx) + `" name="payment_` + String(idx) + `">IDR ` + getrupiah(Math.ceil(payment_price))+ `</td>
                 <td id="payment_date_` + String(idx) + `" name="payment_date_` + String(idx) + `">` +payment[i].due_date+ `</td>
            </tr>
            `;
            idx += 1;
        }
    }
    document.getElementById('tour_payment_rules').innerHTML = pay_text;
}

function tour_filter_render(){

    var node = document.createElement("div");
    text = '';
    text+= `
    <span style="font-size:14px; font-weight:600;">Session Time <span class="count_time" id="session_time"> </span></span>
    <hr/>
    <span style="font-size:14px; font-weight:600;">Elapsed Time <span class="count_time" id="elapse_time"> </span></span>`;

    node = document.createElement("div");
    node.innerHTML = text;
    document.getElementById("session_timer").appendChild(node);
    node = document.createElement("div");

    var node = document.createElement("div");
    text = '';
    text+= `<h4 style="display: inline;">Filter</h4><a style="float: right; cursor: pointer;" onclick="reset_filter();"><i style="color:`+color+`;" class="fa fa-refresh"></i> Reset</a>
            <hr/>`;

            if(template == 1){
                text+=`<div class="banner-right">`;
            }else if(template == 2){
                text+=`
                <div class="hotel-search-form-area" style="bottom:0px; padding-left:0px; padding-right:0px;">
                    <div class="hotel-search-form" style="background-color:unset; padding:unset; box-shadow:unset; color:`+text_color+`;">`;
            }else if(template == 3){
                text+=`<div class="header-right" style="background:unset; border:unset;">`;
            }
            text+=`
                <div class="form-wrap" style="padding:0px; text-align:left;">
                    <h6 class="filter_general" onclick="show_hide_general('tourName');">Tour Name <i class="fas fa-chevron-down" id="tourName_generalDown" style="float:right; display:none;"></i><i class="fas fa-chevron-up" id="tourName_generalUp" style="float:right; display:block;"></i></h6>
                    <div id="tourName_generalShow" style="display:inline-block; width:100%;">
                        <input type="text" style="margin-bottom:unset;" class="form-control" id="tour_filter_name" placeholder="Tour Name " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Tour Name '" autocomplete="off" onkeyup="filter_name(1);"/>
                    </div>
                    <hr/>
                    <h6 class="filter_general" onclick="show_hide_general('tourType');">Tour Type <i class="fas fa-chevron-down" id="tourType_generalDown" style="float:right; display:none;"></i><i class="fas fa-chevron-up" id="tourType_generalUp" style="float:right; display:block;"></i></h6>
                    <div id="tourType_generalShow" style="display:inline-block;">`;
    for(i in tour_type_list){
        if(i == 0)
            text += `
            <label class="check_box_custom">
                <span class="span-search-ticket" style="color:black;">`+tour_type_list[i].value+`</span>
                <input type="checkbox" id="checkbox_tour_type`+i+`" onclick="change_filter('tour_type',`+i+`);" checked/>
                <span class="check_box_span_custom"></span>
            </label><br/>`;
        else
            text += `
            <label class="check_box_custom">
                <span class="span-search-ticket" style="color:black;">`+tour_type_list[i].value+`</span>
                <input type="checkbox" id="checkbox_tour_type`+i+`" onclick="change_filter('tour_type',`+i+`);">
                <span class="check_box_span_custom"></span>
            </label><br/>`;
    }
    text += `</div>`;
    if(template == 2){
        text+=`</div>`;
    }
    node = document.createElement("div");
    node.innerHTML = text;
    document.getElementById("filter").appendChild(node);
    node = document.createElement("div");

    text=`
        <hr/>
        <h6 class="filter_general" onclick="show_hide_general('tourPrice');">Price Range <i class="fas fa-chevron-down" id="tourPrice_generalDown" style="float:right; display:none;"></i><i class="fas fa-chevron-up" id="tourPrice_generalUp" style="float:right; display:block;"></i></h6>
        <div id="tourPrice_generalShow" style="display:inline-block;">
            <div class="range-slider">
                <input type="text" class="js-range-slider"/>
            </div>
            <div class="row">
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                    <span>Min</span><br/>
                    <input type="text" class="js-input-from form-control-custom" id="price-from" value="`+low_price_slider+`" onblur="checking_price_slider(1,1);"/>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                    <span>Max</span><br/>
                    <input type="text" class="js-input-to form-control-custom" id="price-to" value="`+high_price_slider+`" onblur="checking_price_slider(1,2);"/>
                </div>
            </div>
        </div></div></div>`;

    node = document.createElement("div");
    node.innerHTML = text;
    document.getElementById("filter").appendChild(node);

    text='';
    text+=`<span style="font-weight: bold; margin-right:10px;">Sort by: </span>`;

    for(i in sorting_list2){
        text+=`
        <button class="primary-btn-sorting" id="radio_sorting`+i+`" name="radio_sorting" onclick="sort_button('`+sorting_list2[i].value.toLowerCase()+`');" value="`+sorting_list2[i].value+`">
            <span id="img-sort-down-`+sorting_list2[i].value.toLowerCase()+`" style="display:block;"> `+sorting_list2[i].value+` <i class="fas fa-caret-down"></i></span>
            <span id="img-sort-up-`+sorting_list2[i].value.toLowerCase()+`" style="display:none;"> `+sorting_list2[i].value+` <i class="fas fa-caret-up"></i></span>
        </button>`;
    }
    node = document.createElement("div");
    node.className = 'sorting-box';
    node.innerHTML = text;
    document.getElementById("sorting-flight").appendChild(node);


    var node2 = document.createElement("div");
    text = '';
    text+= `<h4 style="display: inline;">Filter</h4><a style="float: right; cursor: pointer;" onclick="reset_filter();"><i style="color:`+color+`;" class="fa fa-refresh"></i> Reset</a>
            <h6 style="padding-bottom:10px;">Tour Name</h6>`;

            if(template == 1){
                text+=`<div class="banner-right">`;
            }else if(template == 2){
                text+=`
                <div class="hotel-search-form-area" style="bottom:0px !important; padding-left:0px; padding-right:0px;">
                    <div class="hotel-search-form" style="background-color:unset; padding:unset; box-shadow:unset; color:`+text_color+`;">`;
            }
            text+=`
                <div class="form-wrap" style="padding:0px; text-align:left;">
                    <input type="text" style="margin-bottom:unset;" class="form-control" id="tour_filter_name2" placeholder="Tour Name " onfocus="this.placeholder = ''" onblur="this.placeholder = 'Tour Name '" autocomplete="off" onkeyup="filter_name(2);"/>
                </div>
            </div>`;

            if(template == 2){
                text+=`</div>`;
            }
            text+=`
            <hr/>
            <h6 style="padding-bottom:10px;">Tour Type</h6>`;
    for(i in tour_type_list){
        if(i == 0)
            text += `
            <label class="check_box_custom">
                <span class="span-search-ticket" style="color:black;">`+tour_type_list[i].value+`</span>
                <input type="checkbox" id="checkbox_tour_type2`+i+`" onclick="change_filter('tour_type',`+i+`);" checked/>
                <span class="check_box_span_custom"></span>
            </label><br/>`;
        else
            text += `
            <label class="check_box_custom">
                <span class="span-search-ticket" style="color:black;">`+tour_type_list[i].value+`</span>
                <input type="checkbox" id="checkbox_tour_type2`+i+`" onclick="change_filter('tour_type',`+i+`);">
                <span class="check_box_span_custom"></span>
            </label><br/>`;
    }
    text+=`
    <hr/>
    <h6 style="padding-bottom:10px;">Price Range</h6><br/>
    <div class="banner-right">
        <div class="form-wrap" style="padding:0px; text-align:left;">
            <div class="wrapper">
                <div class="range-slider">
                    <input type="text" class="js-range-slider2"/>
                </div>
                <div class="row">
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                        <span>Min</span><br/>
                        <input type="text" class="js-input-from2 form-control-custom" id="price-from2" value="`+low_price_slider+`" onblur="checking_price_slider(2,1);"/>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                        <span>Max</span><br/>
                        <input type="text" class="js-input-to2 form-control-custom" id="price-to2" value="`+high_price_slider+`" onblur="checking_price_slider(2,2);"/>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

    node2 = document.createElement("div");
    node2.innerHTML = text;
    document.getElementById("filter2").appendChild(node2);

    text='';
    text+=`<h4>Sorting</h4>
            <hr/>`;

    for(i in sorting_list){

            text+=`
            <label class="radio-button-custom">
                <span class="span-search-ticket" style="color:black;">`+sorting_list[i].value+`</span>
                <input type="radio" id="radio_sorting2`+i+`" name="radio_sorting" onclick="sort_button('`+sorting_list[i].value+`');" value="`+sorting_list[i].value+`">
                <span class="checkmark-radio"></span>
            </label></br>`;

    }
    node2 = document.createElement("div");
    node2.innerHTML = text;
    document.getElementById("sorting-flight2").appendChild(node2);
}

function sort_button(value){

    if(value == 'name'){
       if(sorting_value == '' || sorting_value == 'Name A-Z'){
           sorting_value = 'Name Z-A';
           document.getElementById("img-sort-down-name").style.display = "none";
           document.getElementById("img-sort-up-name").style.display = "block";
       }else{
           sorting_value = 'Name A-Z';
           document.getElementById("img-sort-down-name").style.display = "block";
           document.getElementById("img-sort-up-name").style.display = "none";
       }
   }else if(value == 'price'){
       if(sorting_value == '' || sorting_value == 'Lowest Price'){
           sorting_value = 'Highest Price';
           document.getElementById("img-sort-down-price").style.display = "none";
           document.getElementById("img-sort-up-price").style.display = "block";
       }else{
           sorting_value = 'Lowest Price';
           document.getElementById("img-sort-down-price").style.display = "block";
           document.getElementById("img-sort-up-price").style.display = "none";
       }

   }else if(value == 'duration'){
       if(sorting_value == '' || sorting_value == 'Shortest Duration'){
           sorting_value = 'Longest Duration';
           document.getElementById("img-sort-down-duration").style.display = "none";
           document.getElementById("img-sort-up-duration").style.display = "block";
       }else{
           sorting_value = 'Shortest Duration';
           document.getElementById("img-sort-down-duration").style.display = "block";
           document.getElementById("img-sort-up-duration").style.display = "none";
       }
   }else{
       sorting_value = value;
   }
   filtering('filter', 1);
}

function filter_name(name_numb){
    clearTimeout(myVar);
    myVar = setTimeout(function() {
        change_filter('tour_name'+String(name_numb), 1);
    }, 500);
}

function change_filter(type, value){
    var check = 0;

    if(type == 'tour_type'){
        if(value == 0)
            for(i in tour_type_list){
                tour_type_list[i].status = false
                document.getElementById("checkbox_tour_type"+i).checked = tour_type_list[i].status;
                document.getElementById("checkbox_tour_type2"+i).checked = tour_type_list[i].status;
            }
        else{
            tour_type_list[0].status = false;
            document.getElementById("checkbox_tour_type0").checked = false;
            document.getElementById("checkbox_tour_type20").checked = false;
        }
        tour_type_list[value].status = !tour_type_list[value].status;
        for(i in tour_type_list){
            if(tour_type_list[i].status == true)
                check = 1;
        }
        if(check == 0)
            tour_type_list[value].status = !tour_type_list[value].status;
        document.getElementById("checkbox_tour_type"+value).checked = tour_type_list[value].status;
        document.getElementById("checkbox_tour_type2"+value).checked = tour_type_list[value].status;
        filtering('filter', 1);
    }
    else if (type == 'price')
    {
        filtering('filter', value);
    }
    else if (type == 'tour_name1')
    {
        document.getElementById("tour_filter_name2").value = document.getElementById("tour_filter_name").value;
        filtering('filter', value);
    }
    else if (type == 'tour_name2')
    {
        document.getElementById("tour_filter_name").value = document.getElementById("tour_filter_name2").value;
        filtering('filter', value);
    }
}

function filtering(type, exist_check){
   var temp_data = [];
   var searched_name = $('#tour_filter_name').val();
   data = tour_data;

   if (searched_name){
            data.forEach((obj)=> {
                var test = 1;
                searched_name.toLowerCase().split(" ").forEach((search_str)=> {
                    if (obj.name.toLowerCase().includes( search_str ) == false){
                        test = 0;
                    }
                });
                if(test == 1){
                    temp_data.push(obj);
                }
            });
            data = temp_data;
            tour_filter = data;
            temp_data = [];
   }

   if(type == 'filter'){
       check_tour_type = 0;
       for(i in tour_type_list)
           if(tour_type_list[i].status == true && tour_type_list[i].value != 'All')
               check_tour_type = 1;

       var check = 0;
       if(check_tour_type == 1){
           data.forEach((obj)=> {
               check = 0;
               tour_type_list.forEach((obj1)=> {
                   if(obj.tour_type == obj1.real_val && obj1.status==true){
                       check = 1;
                   }
               });
               if(check != 0){
                   temp_data.push(obj);
               }
           });
           data = temp_data;
           temp_data = [];
       }

       console.log(data);
       sort(data, exist_check);

   }else if(type == 'sort'){
       sort(tour_data, exist_check);
   }
}

function sort(tour_dat, exist_check){
    console.log(tour_dat);
    if (tour_dat.length == 0 && exist_check != 0){
        document.getElementById("tour_ticket").innerHTML = '';
        text = '';
        text += `
            <div class="col-lg-12">
                <div style="text-align:center">
                    <img src="/static/tt_website_rodextrip/images/nofound/no-tour.png" style="width:70px; height:70px;" alt="Not Found Tour" title="" />
                    <br/>
                </div>
                <center><div class="alert alert-warning" role="alert" style="margin-top:15px; border:1px solid #cdcdcd;"><h6><i class="fas fa-search-minus"></i> Oops! Tour not found. Please try again or search another tour. </h6></div></center>
            </div>
            `;
        document.getElementById("tour_ticket").innerHTML = text;
    }
    else{
        //show data
        sorting = '';
        var radios = document.getElementsByName('radio_sorting');
        for (var j = 0, length = radios.length; j < length; j++) {
            if (radios[j].checked) {
                sorting = document.getElementById('radio_sorting2'+j).value;
                break;
            }
        }
        if(sorting_value != ''){
            sorting = sorting_value;
        }
        console.log(sorting);
        for(var i = 0; i < tour_dat.length-1; i++) {
            for(var j = i+1; j < tour_dat.length; j++) {
                if(sorting == '' || sorting == 'Name A-Z'){
                    if(tour_dat[i].name > tour_dat[j].name){
                        var temp = tour_dat[i];
                        tour_dat[i] = tour_dat[j];
                        tour_dat[j] = temp;
                    }
                }
                if(sorting == 'Name Z-A'){
                    if(tour_dat[i].name < tour_dat[j].name){
                        var temp = tour_dat[i];
                        tour_dat[i] = tour_dat[j];
                        tour_dat[j] = temp;
                    }
                }else if(sorting == 'Lowest Price'){
                    if(tour_dat[i].adult_sale_price > tour_dat[j].adult_sale_price){
                        var temp = tour_dat[i];
                        tour_dat[i] = tour_dat[j];
                        tour_dat[j] = temp;
                    }
                }else if(sorting == 'Highest Price'){
                    if(tour_dat[i].adult_sale_price < tour_dat[j].adult_sale_price){
                        var temp = tour_dat[i];
                        tour_dat[i] = tour_dat[j];
                        tour_dat[j] = temp;
                    }
                }else if(sorting == 'Shortest Duration'){
                    if(tour_dat[i].duration > tour_dat[j].duration){
                        var temp = tour_dat[i];
                        tour_dat[i] = tour_dat[j];
                        tour_dat[j] = temp;
                    }
                }else if(sorting == 'Longest Duration'){
                    if(tour_dat[i].duration < tour_dat[j].duration){
                        var temp = tour_dat[i];
                        tour_dat[i] = tour_dat[j];
                        tour_dat[j] = temp;
                    }
                }

            }
        }
        tour_data_filter = tour_dat;
        console.log(tour_dat);
        document.getElementById("tour_ticket").innerHTML = '';
        text = '';
        for(i in tour_dat)
        {
           if (tour_dat[i].adult_sale_price >= $minPrice && tour_dat[i].adult_sale_price <= $maxPrice)
           {
               if (tour_dat[i].images_obj.length > 0)
               {
                   img_src = tour_dat[i].images_obj[0].url;
               }
               else
               {
                   img_src = static_path_url_server+`/public/tour_packages/not_found.png`;
               }

               text+=`
                   <div class="col-lg-4 col-md-6">
                        <form action='/tour/detail/`+tour_dat[i].tour_code+`' method='POST' id='tour_select_form`+tour_dat[i].tour_code+`'>
                            <div id='csrf`+tour_dat[i].tour_code+`'></div>
                            <input type='hidden' value='`+JSON.stringify(tour_dat[i]).replace(/[']/g, /["]/g)+`'/>
                            <input id='uuid`+tour_dat[i].tour_code+`' name='uuid' type='hidden' value='`+tour_dat[i].id+`'/>
                            <input id='sequence`+tour_dat[i].tour_code+`' name='sequence' type='hidden' value='`+tour_dat[i].sequence+`'/>`;
                            if(template == 1){
                                text+=`
                                    <div class="single-recent-blog-post item">
                                        <div class="single-destination avail-sd relative">`;
                                            if(img_src){
                                                text+=`<div class="thumb relative" style="cursor:pointer; border:1px solid #cdcdcd; height:255px; background: white url('`+img_src+`'); background-size: contain; background-repeat: no-repeat; background-position: center center;" onclick="go_to_detail('`+tour_dat[i].tour_code+`')">`;
                                            }else{
                                                text+=`<div class="thumb relative" style="cursor:pointer; border:1px solid #cdcdcd; height:255px; background: white url('`+static_path_url_server+`/public/tour_packages/not_found.png'); background-size: contain; background-repeat: no-repeat; background-position: center center;" onclick="go_to_detail('`+tour_dat[i].tour_code+`')">`;
                                            }
                                            text+=`
                                                <div class="overlay overlay-bg"></div>
                                            </div>
                                            <div class="card card-effect-promotion">
                                                <div class="card-body">
                                                    <div class="row details">
                                                        <div class="col-lg-12 mb-2" style="text-align:left;">
                                                            <h5 style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="`+tour_dat[i].name+`">`+tour_dat[i].name+`</h5>`;
                                                            if(tour_dat[i].tour_line_amount != 0){
                                                                if(tour_dat[i].tour_type != 'open'){
                                                                    text+=`<span style="font-size:13px;font-weight:500;">`+tour_dat[i].tour_line_amount+` Available Date</span>`;
                                                                }else{
                                                                    text+=`<span style="font-size:13px;font-weight:500;">`+tour_dat[i].tour_line_amount+` Available Period</span>`;
                                                                }
                                                                text+=`<span id="pop_date`+i+`" style="float:right; font-size:12px;font-weight:500;color:`+color+`; cursor:pointer;">See Date</span>`;
                                                            }
                                                        text+=`
                                                        </div>
                                                        <div class="col-lg-12 mb-2">
                                                        <div style="display:flex;">
                                                            <div style="border-bottom:1px solid `+color+`; width:max-content; font-size:12px;">`;
                                                            if(tour_dat[i].tour_type == 'open'){
                                                                text+=`<span style="border:1px solid `+color+`; background:`+color+`; color:`+text_color+`; font-weight:500; padding:2px 5px;">`+tour_dat[i].tour_type_str+`</span>`;
                                                            }else{
                                                                text+=tour_dat[i].tour_type_str;
                                                            }
                                                        text+=`
                                                            </div>
                                                            <span id="pop_question`+i+`" style="cursor:pointer;"><i class="fas fa-question-circle" style="padding:0px 5px;font-size:16px;"></i></span>
                                                        </div>
                                                            <span style="font-size:13px; color:#616161; float:left; margin-top:10px;">Starting From</span>
                                                            <span style="font-size:14px;font-weight:bold; float:right; margin-top:10px;">IDR `+getrupiah(tour_dat[i].adult_sale_price)+`</span><br/>
                                                        </div>
                                                        <div class="col-lg-12">
                                                            <button href="#" class="primary-btn-custom" type="button" onclick="go_to_detail('`+tour_dat[i].tour_code+`')" style="width:100%;">BOOK</button><br/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;

                            }else if(template == 2){
                                text+=`
                                    <div class="single-post-area mb-30" style="transform:unset;">
                                        <div class="single-destination avail-sd relative" style="border:unset;">`;
                                            if(img_src){
                                                text+=`<div class="thumb relative" style="cursor:pointer; border-bottom:1px solid #cdcdcd; height:255px; background: white url('`+img_src+`'); background-size: contain; background-repeat: no-repeat; background-position: center center;" onclick="go_to_detail('`+tour_dat[i].tour_code+`')">`;
                                            }else{
                                                text+=`<div class="thumb relative" style="cursor:pointer; border-bottom:1px solid #cdcdcd; height:255px; background: white url('`+static_path_url_server+`/public/tour_packages/not_found.png'); background-size: contain; background-repeat: no-repeat; background-position: center center;" onclick="go_to_detail('`+tour_dat[i].tour_code+`')">`;
                                            }
                                            text+=`
                                                <div class="overlay overlay-bg"></div>
                                            </div>
                                            <div class="card card-effect-promotion">
                                                <div class="card-body" style="padding:10px; border:unset;">
                                                    <div class="row details">
                                                        <div class="col-lg-12 mb-2" style="text-align:left;">
                                                            <h5 style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="`+tour_dat[i].name+`">`+tour_dat[i].name+`</h5>`;
                                                            if(tour_dat[i].tour_line_amount != 0){
                                                                if(tour_dat[i].tour_type != 'open'){
                                                                    text+=`<span style="font-size:13px;font-weight:500;">`+tour_dat[i].tour_line_amount+` Available Date</span>`;
                                                                }else{
                                                                    text+=`<span style="font-size:13px;font-weight:500;">`+tour_dat[i].tour_line_amount+` Available Period</span>`;
                                                                }
                                                                text+=`<span id="pop_date`+i+`" style="float:right; font-size:12px;font-weight:500;color:`+color+`; cursor:pointer;">See Date</span>`;
                                                            }
                                                        text+=`
                                                        </div>
                                                        <div class="col-lg-12 mb-2">
                                                        <div style="display:flex;">
                                                            <div style="border-bottom:1px solid `+color+`; width:max-content; font-size:12px;">`;
                                                            if(tour_dat[i].tour_type == 'open'){
                                                                text+=`<span style="border:1px solid `+color+`; background:`+color+`; color:`+text_color+`; font-weight:500; padding:2px 5px;">`+tour_dat[i].tour_type_str+`</span>`;
                                                            }else{
                                                                text+=tour_dat[i].tour_type_str;
                                                            }
                                                        text+=`
                                                            </div>
                                                            <span id="pop_question`+i+`" style="cursor:pointer;"><i class="fas fa-question-circle" style="padding:0px 5px;font-size:16px;"></i></span>
                                                        </div>
                                                            <span style="font-size:13px; color:#616161; float:left; margin-top:10px;">Starting From</span>
                                                            <span style="font-size:14px;font-weight:bold; float:right; margin-top:10px;">IDR `+getrupiah(tour_dat[i].adult_sale_price)+`</span><br/>
                                                        </div>
                                                        <div class="col-lg-12">
                                                            <button href="#" class="primary-btn-custom" type="button" onclick="go_to_detail('`+tour_dat[i].tour_code+`')" style="width:100%;">BOOK</button><br/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;
                            }else if(template == 3){
                                text+=`
                                    <div class="single-post-area mb-30">
                                        <div class="single-destination avail-sd relative">`;
                                            if(img_src){
                                                text+=`<div class="thumb relative" style="cursor:pointer; border-bottom:1px solid #cdcdcd; height:255px; background: white url('`+img_src+`'); background-size: contain; background-repeat: no-repeat; background-position: center center;" onclick="go_to_detail('`+tour_dat[i].tour_code+`')">`;
                                            }else{
                                                text+=`<div class="thumb relative" style="cursor:pointer; border-bottom:1px solid #cdcdcd; height:255px; background: white url('`+static_path_url_server+`/public/tour_packages/not_found.png'); background-size: contain; background-repeat: no-repeat; background-position: center center;" onclick="go_to_detail('`+tour_dat[i].tour_code+`')">`;
                                            }
                                            text+=`
                                                <div class="overlay overlay-bg"></div>
                                            </div>
                                            <div class="card card-effect-promotion" style="border:unset;">
                                                <div class="card-body" style="padding:10px; border:unset;">
                                                    <div class="row details">
                                                        <div class="col-lg-12 mb-2" style="text-align:left;">
                                                            <h5 style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="`+tour_dat[i].name+`">`+tour_dat[i].name+`</h5>`;
                                                            if(tour_dat[i].tour_line_amount != 0){
                                                                if(tour_dat[i].tour_type != 'open'){
                                                                    text+=`<span style="font-size:13px;font-weight:500;">`+tour_dat[i].tour_line_amount+` Available Date</span>`;
                                                                }else{
                                                                    text+=`<span style="font-size:13px;font-weight:500;">`+tour_dat[i].tour_line_amount+` Available Period</span>`;
                                                                }
                                                                text+=`<span id="pop_date`+i+`" style="float:right; font-size:12px;font-weight:500;color:`+color+`; cursor:pointer;">See Date</span>`;
                                                            }
                                                        text+=`
                                                        </div>
                                                        <div class="col-lg-12 mb-2">
                                                        <div style="display:flex;">
                                                            <div style="border-bottom:1px solid `+color+`; width:max-content; font-size:12px;">`;
                                                            if(tour_dat[i].tour_type == 'open'){
                                                                text+=`<span style="border:1px solid `+color+`; background:`+color+`; color:`+text_color+`; font-weight:500; padding:2px 5px;">`+tour_dat[i].tour_type_str+`</span>`;
                                                            }else{
                                                                text+=tour_dat[i].tour_type_str;
                                                            }
                                                        text+=`
                                                            </div>
                                                            <span id="pop_question`+i+`" style="cursor:pointer;"><i class="fas fa-question-circle" style="padding:0px 5px;font-size:16px;"></i></span>
                                                        </div>
                                                            <span style="font-size:13px; color:#616161; float:left; margin-top:10px;">Starting From</span>
                                                            <span style="font-size:14px;font-weight:bold; float:right; margin-top:10px;">IDR `+getrupiah(tour_dat[i].adult_sale_price)+`</span><br/>
                                                        </div>
                                                        <div class="col-lg-12">
                                                            <button href="#" class="primary-btn-custom" type="button" onclick="go_to_detail('`+tour_dat[i].tour_code+`')" style="width:100%;">BOOK</button><br/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;
                            }else if(template == 4){
                                text+=`
                                    <div class="single-post-area mb-30">
                                        <div class="single-destination avail-sd relative">`;
                                            if(img_src){
                                                text+=`<div class="thumb relative" style="cursor:pointer; border-bottom:1px solid #cdcdcd; height:255px; background: white url('`+img_src+`'); background-size: contain; background-repeat: no-repeat; background-position: center center;" onclick="go_to_detail('`+tour_dat[i].tour_code+`')">`;
                                            }else{
                                                text+=`<div class="thumb relative" style="cursor:pointer; border-bottom:1px solid #cdcdcd; height:255px; background: white url('`+static_path_url_server+`/public/tour_packages/not_found.png'); background-size: contain; background-repeat: no-repeat; background-position: center center;" onclick="go_to_detail('`+tour_dat[i].tour_code+`')">`;
                                            }
                                            text+=`
                                                <div class="overlay overlay-bg"></div>
                                            </div>
                                            <div class="card card-effect-promotion" style="border:unset;">
                                                <div class="card-body" style="padding:10px; border:unset;">
                                                    <div class="row details">
                                                        <div class="col-lg-12 mb-2" style="text-align:left;">
                                                            <h5 style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="`+tour_dat[i].name+`">`+tour_dat[i].name+`</h5>`;
                                                            if(tour_dat[i].tour_line_amount != 0){
                                                                if(tour_dat[i].tour_type != 'open'){
                                                                    text+=`<span style="font-size:13px;font-weight:500;">`+tour_dat[i].tour_line_amount+` Available Date</span>`;
                                                                }else{
                                                                    text+=`<span style="font-size:13px;font-weight:500;">`+tour_dat[i].tour_line_amount+` Available Period</span>`;
                                                                }
                                                                text+=`<span id="pop_date`+i+`" style="float:right; font-size:12px;font-weight:500;color:`+color+`; cursor:pointer;">See Date</span>`;
                                                            }
                                                        text+=`
                                                        </div>
                                                        <div class="col-lg-12 mb-2">
                                                        <div style="display:flex;">
                                                            <div style="border-bottom:1px solid `+color+`; width:max-content; font-size:12px;">`;
                                                            if(tour_dat[i].tour_type == 'open'){
                                                                text+=`<span style="border:1px solid `+color+`; background:`+color+`; color:`+text_color+`; font-weight:500; padding:2px 5px;">`+tour_dat[i].tour_type_str+`</span>`;
                                                            }else{
                                                                text+=tour_dat[i].tour_type_str;
                                                            }
                                                        text+=`
                                                            </div>
                                                            <span id="pop_question`+i+`" style="cursor:pointer;"><i class="fas fa-question-circle" style="padding:0px 5px;font-size:16px;"></i></span>
                                                        </div>
                                                            <span style="font-size:13px; color:#616161; float:left; margin-top:10px;">Starting From</span>
                                                            <span style="font-size:14px;font-weight:bold; float:right; margin-top:10px;">IDR `+getrupiah(tour_dat[i].adult_sale_price)+`</span><br/>
                                                        </div>
                                                        <div class="col-lg-12">
                                                            <button href="#" class="primary-btn-custom" type="button" onclick="go_to_detail('`+tour_dat[i].tour_code+`')" style="width:100%;">BOOK</button><br/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;
                            }else if(template == 5){
                                text+=`
                                    <div class="single-post-area mb-30">
                                        <div class="single-destination avail-sd relative" style="border:1px solid #cdcdcd;">`;
                                            if(img_src){
                                                text+=`<div class="thumb relative" style="cursor:pointer; border-bottom:1px solid #cdcdcd; height:255px; background: white url('`+img_src+`'); background-size: contain; background-repeat: no-repeat; background-position: center center;" onclick="go_to_detail('`+tour_dat[i].tour_code+`')">`;
                                            }else{
                                                text+=`<div class="thumb relative" style="cursor:pointer; border-bottom:1px solid #cdcdcd; height:255px; background: white url('`+static_path_url_server+`/public/tour_packages/not_found.png'); background-size: contain; background-repeat: no-repeat; background-position: center center;" onclick="go_to_detail('`+tour_dat[i].tour_code+`')">`;
                                            }
                                            text+=`
                                            </div>
                                            <div class="card card-effect-promotion" style="border:unset;">
                                                <div class="card-body" style="padding:10px; border:unset;">
                                                    <div class="row details">
                                                        <div class="col-lg-12 mb-2" style="text-align:left;">
                                                            <h5 style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="`+tour_dat[i].name+`">`+tour_dat[i].name+`</h5>`;
                                                            if(tour_dat[i].tour_line_amount != 0){
                                                                if(tour_dat[i].tour_type != 'open'){
                                                                    text+=`<span style="font-size:13px;font-weight:500;">`+tour_dat[i].tour_line_amount+` Available Date</span>`;
                                                                }else{
                                                                    text+=`<span style="font-size:13px;font-weight:500;">`+tour_dat[i].tour_line_amount+` Available Period</span>`;
                                                                }
                                                                text+=`<span id="pop_date`+i+`" style="float:right; font-size:12px;font-weight:500;color:`+color+`; cursor:pointer;">See Date</span>`;
                                                            }
                                                        text+=`
                                                        </div>
                                                        <div class="col-lg-12 mb-2">
                                                        <div style="display:flex;">
                                                            <div style="border-bottom:1px solid `+color+`; width:max-content; font-size:12px;">`;
                                                            if(tour_dat[i].tour_type == 'open'){
                                                                text+=`<span style="border:1px solid `+color+`; background:`+color+`; color:`+text_color+`; font-weight:500; padding:2px 5px;">`+tour_dat[i].tour_type_str+`</span>`;
                                                            }else{
                                                                text+=tour_dat[i].tour_type_str;
                                                            }
                                                        text+=`
                                                            </div>
                                                            <span id="pop_question`+i+`" style="cursor:pointer;"><i class="fas fa-question-circle" style="padding:0px 5px;font-size:16px;"></i></span>
                                                        </div>
                                                            <span style="font-size:13px; color:#616161; float:left; margin-top:10px;">Starting From</span>
                                                            <span style="font-size:14px;font-weight:bold; float:right; margin-top:10px;">IDR `+getrupiah(tour_dat[i].adult_sale_price)+`</span><br/>
                                                        </div>
                                                        <div class="col-lg-12">
                                                            <button href="#" class="primary-btn-custom" type="button" onclick="go_to_detail('`+tour_dat[i].tour_code+`')" style="width:100%;">BOOK</button><br/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;
                            }
                            text+=`
                        </form>
                    </div>
                   `;
           }
        }
        if (text == '' && exist_check != 0)
        {
            text += `
            <div class="col-lg-12">
                <div style="text-align:center">
                    <img src="/static/tt_website_rodextrip/images/nofound/no-tour.png" alt="Not Found Tour" style="width:70px; height:70px;" title="" />
                    <br/>
                </div>
                <center><div class="alert alert-warning" role="alert" style="margin-top:15px; border:1px solid #cdcdcd;"><h6><i class="fas fa-search-minus"></i> Oops! Tour not found. Please try again or search another tour. </h6></div></center>
            </div>`;
            check_pagination = 0;
        }
        document.getElementById('tour_ticket').innerHTML += text;

       for(i in tour_dat){
           content_pop_date = '';
           content_pop_question = '';
           title_pop_date = '';
           if(tour_dat[i].tour_type == 'series'){
                content_pop_question+=`<b>Series: </b>Organized Public Tour with Tour Leader.`;
            }
            else if(tour_dat[i].tour_type == 'sic'){
                content_pop_question+=`<b>SIC: </b>Organized Public Tour without Tour Leader.`;
            }
            else if(tour_dat[i].tour_type == 'land'){
                content_pop_question+=`<b>Land Only: </b>Organized Tour with its price not including accommodation nor transportation.`;
            }
            else if(tour_dat[i].tour_type == 'city'){
                content_pop_question+=`<b>City Tour: </b>Tour visiting various favorite destinations of a certain city.`;
            }
            else if(tour_dat[i].tour_type == 'open'){
                content_pop_question+=`<b>Open Tour: </b>Unorganized Tour where tour participants can choose their own Departure Date within certain period.`;
            }
            else if(tour_dat[i].tour_type == 'private'){
                content_pop_question+=`<b>Private Tour: </b>Private Tour organized according to the participant's request.`;
            }

            new jBox('Tooltip', {
                attach: '#pop_question'+i,
                width: 280,
                closeOnMouseleave: true,
                animation: 'zoomIn',
                content: content_pop_question
            });

            if(tour_dat[i].tour_line_amount != 0){
                for (j in tour_dat[i].tour_lines){
                    sch_count = parseInt(j)+1;
                    if(tour_dat[i].tour_type != 'open'){
                        content_pop_date += `<h6>Schedule - `+sch_count+`</h6>`;
                        title_pop_date += 'Available Date';
                    }else{
                        content_pop_date += `<h6>Period - `+sch_count+`</h6>`;
                        title_pop_date += 'Period Date';
                    }
                    content_pop_date += `<span>`+tour_dat[i].tour_lines[j].departure_date_str+` - `+tour_dat[i].tour_lines[j].arrival_date_str+`</span><hr/>`;
                }

                new jBox('Tooltip', {
                    attach: '#pop_date'+i,
                    target: '#pop_date'+i,
                    theme: 'TooltipBorder',
                    trigger: 'click',
                    adjustTracker: true,
                    closeOnClick: 'body',
                    closeButton: 'box',
                    animation: 'move',
                    position: {
                      x: 'left',
                      y: 'top'
                    },
                    outside: 'y',
                    pointer: 'left:20',
                    offset: {
                      x: 25
                    },
                    content: content_pop_date,
                    onOpen: function () {
                      this.source.addClass('active').html('Close');
                    },
                    onClose: function () {
                      this.source.removeClass('active').html('See Date');
                    }
                });
            }
       }
    }
}

function auto_complete_tour(type, current_opt=0){
    sel_objs = $('#'+type).select2('data');
    temp_obj_id = 0;
    for (i in sel_objs)
    {
        temp_obj_id = sel_objs[i].id;
    }
    if (type == 'tour_countries')
    {
        tour_set_city(temp_obj_id, current_opt);
    }
}

function tour_set_city(country_id, current_city_id=0){
    var text = `<option value="0" selected="">All Cities</option>`;
    var country = {};
    for(i in tour_country){
       console.log(parseInt(country_id));
       if(tour_country[i].id == parseInt(country_id)){
           country = tour_country[i];
           break;
       }
    }
    if (current_city_id == 0)
    {
        for(i in country.city){
            text +=`<option value="`+country.city[i].id+`">`+country.city[i].name+`</option>`;
        }
    }
    else
    {
        for(i in country.city){
            if (country.city[i].id == current_city_id)
            {
                text +=`<option value="`+country.city[i].id+`" selected>`+country.city[i].name+`</option>`;
            }
            else
            {
                text +=`<option value="`+country.city[i].id+`">`+country.city[i].name+`</option>`;
            }
        }
    }

    document.getElementById('tour_cities').innerHTML = text;
    $('#tour_cities').niceSelect('update');
}

function share_data(){
    const el = document.createElement('textarea');
    el.value = $test;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    $text_share = window.encodeURIComponent($test);
}

function tour_table_detail()
{
    document.getElementById('tour_detail_table').innerHTML = '';
    document.getElementById('tour_detail_next_btn').innerHTML = '';
    $('#loading-price-tour').show();
    if (room_amount <= 0)
    {
        $('#btnDeleteRooms').hide();
        $('#add_room_first').show();
        $('#loading-price-tour').hide();
    }
    else
    {
        room_ids_list = [];
        $('#btnDeleteRooms').show();
        $('#add_room_first').hide();
        $('#total-price-container').removeClass("hide");
        for (i=0; i < room_amount; i++)
        {
            temp_room_id = {
                'room_code': document.getElementById("room_code_"+String(i+1)).value,
                'adult': parseInt(document.getElementById("adult_tour_room_"+String(i+1)).value),
                'child': parseInt(document.getElementById("child_tour_room_"+String(i+1)).value),
                'infant': parseInt(document.getElementById("infant_tour_room_"+String(i+1)).value),
            }
            room_ids_list.push(temp_room_id);
        }
        request = {
            'tour_code': tour_code,
            'room_list': room_ids_list,
        };
        if(tour_data.tour_type == 'open')
        {
            request['tour_line_code'] = document.getElementById('tour_line_code').value;
            request['departure_date'] = document.getElementById('open_tour_departure_date').value;
        }
        get_price_itinerary(JSON.stringify(request),'detail');
    }
}

function price_slider_true(filter, type){
   if(filter == 1){
       var from_price = parseInt(document.getElementById('price-from').value);
       var to_price = parseInt(document.getElementById('price-to').value);
       document.getElementById('price-from2').value = parseInt(document.getElementById('price-from').value)
       document.getElementById('price-to2').value = parseInt(document.getElementById('price-to').value)
   }
   else if(filter == 2){
       var from_price = parseInt(document.getElementById('price-from2').value);
       var to_price = parseInt(document.getElementById('price-to2').value);
       document.getElementById('price-from').value = parseInt(document.getElementById('price-from2').value)
       document.getElementById('price-to').value = parseInt(document.getElementById('price-to2').value)
   }

   $minPrice = parseInt(from_price);
   $maxPrice = parseInt(to_price);
   change_filter('price', type);
}

function price_update(filter, type){
   if(filter == 1){
       var from_price = parseInt(document.getElementById('price-from').value);
       var to_price = parseInt(document.getElementById('price-to').value);
       document.getElementById('price-from2').value = parseInt(document.getElementById('price-from').value)
       document.getElementById('price-to2').value = parseInt(document.getElementById('price-to').value)
   }
   else if(filter == 2){
       var from_price = parseInt(document.getElementById('price-from2').value);
       var to_price = parseInt(document.getElementById('price-to2').value);
       document.getElementById('price-from').value = parseInt(document.getElementById('price-from2').value)
       document.getElementById('price-to').value = parseInt(document.getElementById('price-to2').value)
   }

   $(".js-range-slider").data("ionRangeSlider").update({
        from: from_price,
        to: to_price,
        min: low_price_slider,
        max: high_price_slider,
        step: step_slider
   });

   $(".js-range-slider2").data("ionRangeSlider").update({
        from: from_price,
        to: to_price,
        min: low_price_slider,
        max: high_price_slider,
        step: step_slider
   });
}

function checking_price_slider(filter, type){
   if(filter == 1){
       var from_price = parseInt(document.getElementById('price-from').value);
       var to_price = parseInt(document.getElementById('price-to').value);
       document.getElementById('price-from2').value = parseInt(document.getElementById('price-from').value)
       document.getElementById('price-to2').value = parseInt(document.getElementById('price-to').value)
   }
   else if(filter == 2){
       var from_price = parseInt(document.getElementById('price-from2').value);
       var to_price = parseInt(document.getElementById('price-to2').value);
       document.getElementById('price-from').value = parseInt(document.getElementById('price-from2').value)
       document.getElementById('price-to').value = parseInt(document.getElementById('price-to2').value)
   }

   if(type == 1){
       if(from_price < low_price_slider){
          document.getElementById('price-from').value = low_price_slider;
          document.getElementById('price-from2').value = low_price_slider;
          from_price = low_price_slider;
       }
       if(from_price > high_price_slider || from_price > to_price){
          document.getElementById('price-from').value = document.getElementById('price-to').value;
          document.getElementById('price-from2').value = document.getElementById('price-to').value;
          from_price = document.getElementById('price-to').value;
       }
   }
   else if(type == 2){
       if(to_price > high_price_slider){
          document.getElementById('price-to').value = high_price_slider;
          document.getElementById('price-to2').value = high_price_slider;
          to_price = high_price_slider;
       }
       if(to_price < low_price_slider || to_price < from_price){
          document.getElementById('price-to').value = document.getElementById('price-from').value;
          document.getElementById('price-to2').value = document.getElementById('price-from').value;
          to_price = document.getElementById('price-from').value;
       }
   }

   $minPrice = parseInt(from_price);
   $maxPrice = parseInt(to_price);
   change_filter('price', type);
}

function reset_filter(){
    document.getElementById('tour_filter_name').value = '';
    document.getElementById('price-from').value = low_price_slider;
    document.getElementById('price-to').value = high_price_slider;
    filter_name(1);
    change_filter('tour_type', 0);
    price_update(1, 1);
    price_slider_true(1, 1);
}

function check_passport_expired_six_month(id){
    var last_departure_date = arrival_date_last;
    console.log(document.getElementById(id).value);
    if(document.getElementById(id).value != '' && document.getElementById(id).value != moment().format('DD MMM YYYY')){
        var duration = moment.duration(moment(document.getElementById(id).value).diff(last_departure_date));
        console.log(duration);
        if(duration._data.months < 6 && duration._data.years == 0)
            Swal.fire({
              type: 'warning',
              title: 'Oops!',
              html: '<span style="color: #ff9900;">Passport expired date less then 6 months </span>' ,
            })
    }
}

function room_choose_sh(id){
    var r_choose_div = document.getElementById("room_choose_div"+id);
    var r_choose_open = document.getElementById("room_choose_open"+id);
    var r_choose_close = document.getElementById("room_choose_close"+id);

    if (r_choose_open.style.display === "none") {
        r_choose_close.style.display = "none";
        r_choose_div.style.display = "none";
        r_choose_open.style.display = "block";
    }
    else {
        r_choose_close.style.display = "block";
        r_choose_div.style.display = "flex";
        r_choose_open.style.display = "none";
    }
}

function room_chose_render(data_ren, id, type_ren){
    var r_choose_adult = document.getElementById("room_choose_adult"+id);
    var r_choose_child = document.getElementById("room_choose_child"+id);
    var r_choose_infant = document.getElementById("room_choose_infant"+id);
    var r_choose_special = document.getElementById("room_choose_special"+id);
    var r_choose_input = document.getElementById("notes_"+id);
    if (type_ren == 1){
        r_choose_adult.innerText = data_ren.value + " Adult";
    }

    if (type_ren == 2){
        if(data_ren.value != 0){
            r_choose_child.innerText = ", "+ data_ren.value + " Child";
        }else{
            r_choose_child.innerText = "";
        }
    }

    if (type_ren == 3){
        if(data_ren.value != 0){
            r_choose_infant.innerText = ", "+ data_ren.value + " Infant";
        }else{
            r_choose_infant.innerText = "";
        }
    }

    if (type_ren == 4){
       if(r_choose_input.value != ""){
            r_choose_special.innerHTML = `Special Request: <span style="color:#41b83b">Requested <i class="fas fa-check"></i></span>`;
       }else{
            r_choose_special.innerHTML = `Special Request: <span>Not Request</span>`;
       }
    }
}