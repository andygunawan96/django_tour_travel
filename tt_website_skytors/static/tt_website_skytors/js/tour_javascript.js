$test = '';
sorting_value = '';

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
        value:'Private Tour',
        real_val: 'private',
        status: false
    }
]

var budget_list = [
    {
        value:'All',
        status: true
    },
    {
        value:'0 - 1,000,000',
        min: 0,
        max: 1000000,
        status: false
    },
    {
        value:'1,000,000 - 2,000,000',
        min: 1000000,
        max: 2000000,
        status: false
    },
    {
        value:'2,000,000 - 5,000,000',
        min: 2000000,
        max: 5000000,
        status: false
    },
    {
        value:'5,000,000 - 10,000,000',
        min: 5000000,
        max: 10000000,
        status: false
    },
    {
        value:'10,000,000 - 20,000,000',
        min: 10000000,
        max: 20000000,
        status: false
    },
    {
        value:'>= 20,000,000',
        min: 20000000,
        max: 9999999999,
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
        value:'Earliest Departure',
        status: false
    },
    {
        value:'Latest Departure',
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
        value:'Departure',
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
    var pj = price.toString().length;
    var temp = price.toString();
    var priceshow="";
    for(x=0;x<pj;x++){
        if((pj-x)%3==0 && x!=0){
        priceshow+=",";
        }
        priceshow+=temp.charAt(x);
    }
    return priceshow;
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
    const el = document.createElement('textarea');
    el.value = $test;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}

function render_room_tour_field(id, idx, data_list, data_hidden) {
    var package_id = parseInt(document.getElementById("tour_id").value);
    var room_lib = {
        'double': 'Double/Twin',
        'triple': 'Triple'
    }
    var template = '';
        template += '<div id="room_field_' + idx + '" style="margin-bottom:20px; padding:15px; border: 1px solid #cdcdcd;"><div class="banner-right"><div class="form-wrap" style="padding:0px !important; text-align:left;">';
        template += '<h6 title="'+ data_list[8] + ' (' + data_list[12] + ') - ' + data_list[1] + '">Room ' +  idx +  ' - ' + data_list[9] + ' ' + room_lib[data_list[4]] + '</h6>';
        template += '<span style="font-size:12px;">' + data_list[7] +'</span>';
        template += '<br/><span style="margin: 0px;"><i class="fa fa-building"></i> ' + data_list[8] + ' (' + data_list[12] + ') - ' + data_list[1] +'</span>';
        template += '<div class="row" style="margin-top:15px;">';
        template += '<div class="col-lg-4 col-md-4 col-sm-4">';
        template += '<span>Adult</span>';
        template += '<div class="input-container-search-ticket btn-group"><i class="fas fa-male icon-search-ticket" style="font-size:14px;"></i><div class="form-select" id="default-select"><select class="adult_tour_room" id="adult_tour_room_' + idx + '" name="adult_tour_room_' + idx + '" data-index="' + idx + '" data-pax-limit="' + data_list[10] + '" onchange="render_child_infant_selection(this)">';
        for (var i=1; i<=parseInt(data_list[2]); i++)
        {
            if (i == 1) {template += '<option selected value="' + i + '">' + i + '</option>';}
            else {template += '<option value="' + i + '">' + i + '</option>';}
        }
        template += '</select></div></div>';
        template += '</div>';
        template += '<div class="col-lg-4 col-md-4 col-sm-4">';
        template += '<span>Child</span><i class="fa fa-info-circle" aria-hidden="true" data-toggle="tooltip" data-placement="top" title="2-11 years old" style="padding-left:5px;"></i>';
        template += '<div class="input-container-search-ticket btn-group"><i class="fas fa-child icon-search-ticket" style="font-size:14px;"></i><div class="form-select"><select class="child_tour_room" id="child_tour_room_' + idx + '" name="child_tour_room_' + idx + '" data-index="' + idx + '" onchange="get_price_itinerary(' + package_id + ')">';
        for (var i=0; i<=parseInt(data_list[10])-1; i++)
        {
            if (i == 0) {template += '<option selected value="' + i + '">' + i + '</option>';}
            else {template += '<option value="' + i + '">' + i + '</option>';}
        }
        template += '</select></div></div>';
        template += '</div>';
        template += '<div class="col-lg-4 col-md-4 col-sm-4">';
        template += '<span>Infant</span><i class="fa fa-info-circle" aria-hidden="true" data-toggle="tooltip" data-placement="top" title="below 2 years old" style="padding-left:5px;"></i>';
        template += '<div class="input-container-search-ticket btn-group"><i class="fas fa-baby icon-search-ticket" style="font-size:14px;"></i><div class="form-select"><select class="infant_tour_room" id="infant_tour_room_' + idx + '" name="infant_tour_room_' + idx + '" data-index="' + idx + '" onchange="get_price_itinerary(' + package_id + ')">';
        template += '<option selected value="0">0</option>';
        template += '<option value="1">1</option>';
        template += '</select></div></div>';
        template += '</div>';

        if (data_list[4]=="double")
        {
            template += '<div class="col-lg-12" style="margin-bottom:15px; margin-top:10px;">';
            template += '<textarea class="form-control" id="notes_' + idx + '" name="notes_' + idx + '" placeholder="Notes"/>';
            template += '<small style="color: #787878; margin-left: 2px;">Ex: king size, twin, non smoking, etc.</small>';
            template += '</div>';
        }
        else
        {
            template += '<input type="text" class="form-control hide" id="notes_' + idx + '" name="notes_' + idx + '" placeholder="Notes" value=" "/>';
        }
        template += '</div>';
        template += '<input type="hidden" id="data_per_room_hidden_' + idx + '" name="data_per_room_hidden_' + idx + '" value="' + data_hidden + '"/>';
        template += '</div></div></div>';
    return template;
}

function render_child_infant_selection(adult_select) {
    var id = adult_select.getAttribute("data-index");
    var package_id = parseInt(document.getElementById("tour_id").value);
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
    get_price_itinerary(package_id);
}

function get_total_price(discount_total) {
    var total_price = 0;
    total_price += parseInt(document.getElementById("adult_price").getAttribute("data-price"));
    total_price += parseInt(document.getElementById("adult_surcharge_price").getAttribute("data-price"));
    total_price += parseInt(document.getElementById("child_price").getAttribute("data-price"));
    total_price += parseInt(document.getElementById("child_surcharge_price").getAttribute("data-price"));
    total_price += parseInt(document.getElementById("infant_price").getAttribute("data-price"));
    total_price += parseInt(document.getElementById("single_supplement_price").getAttribute("data-price"));
//    total_price += parseInt(document.getElementById("extrabed_total").getAttribute("data-price"));
    total_price += parseInt(document.getElementById("airport_tax_total").getAttribute("data-price"));
    total_price += parseInt(document.getElementById("tipping_guide_total").getAttribute("data-price"));
    total_price += parseInt(document.getElementById("tipping_tour_leader_total").getAttribute("data-price"));
    total_price += parseInt(document.getElementById("tipping_driver_total").getAttribute("data-price"));
    total_price += parseInt(document.getElementById("additional_charge_total").getAttribute("data-price"));
    document.getElementById("sub_total_hidden").value = total_price;
    document.getElementById("sub_total").value = getrupiah(total_price);
    document.getElementById("discount_total_hidden").value = discount_total;
    document.getElementById("discount_total").value = getrupiah(discount_total);
    document.getElementById("grand_total_hidden").value = total_price - discount_total;
    document.getElementById("grand_total").value = getrupiah(total_price - discount_total);

    var total_commission = 0;
    total_commission += parseInt(document.getElementById("adult_commission").getAttribute("data-price"));
    total_commission += parseInt(document.getElementById("child_commission").getAttribute("data-price"));
    total_commission += parseInt(document.getElementById("infant_commission").getAttribute("data-price"));
    document.getElementById("commission_total").value = total_commission;
    test = document.getElementById("commission_agent_type").value;
    if (test == 'citra') {
        document.getElementById("commission_total_content").innerHTML = getrupiah(total_commission * 0.8);
    } else if (test == 'japro') {
        document.getElementById("commission_total_content").innerHTML = getrupiah(total_commission * 0.7);
    } else if (test == 'btb') {
        document.getElementById("commission_total_content").innerHTML = getrupiah(total_commission * 0.7);
    } else if (test == 'other') {
        document.getElementById("commission_total_content").innerHTML = getrupiah(0);
    } else {
        document.getElementById("commission_total_content").innerHTML = getrupiah(0);
    }
}

function check_passenger(adult, child, infant){
    //booker
    error_log = '';
    if(check_name(document.getElementById('booker_title').value,
                    document.getElementById('booker_first_name').value,
                    document.getElementById('booker_last_name').value,
                    25) == false){
        error_log+= 'Total of Booker name maximum 25 characters!\n';
        document.getElementById('booker_first_name').style['border-color'] = 'red';
        document.getElementById('booker_last_name').style['border-color'] = 'red';
    }else{
        document.getElementById('booker_first_name').style['border-color'] = '#EFEFEF';
        document.getElementById('booker_last_name').style['border-color'] = '#EFEFEF';
    }if(document.getElementById('booker_first_name').value == ''){
        error_log+= 'Please fill booker first name!\n';
        document.getElementById('booker_first_name').style['border-color'] = 'red';
    }else{
        document.getElementById('booker_first_name').style['border-color'] = '#EFEFEF';
    }if(check_phone_number(document.getElementById('booker_phone').value)==false){
        error_log+= 'Phone number Booker only contain number 8 - 12 digits!\n';
        document.getElementById('booker_phone').style['border-color'] = 'red';
    }else{
        document.getElementById('booker_phone').style['border-color'] = '#EFEFEF';
    }if(check_email(document.getElementById('booker_email').value)==false){
        error_log+= 'Invalid Booker email!\n';
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
           error_log+= 'Total of adult '+i+' name maximum '+length+' characters!\n';
           document.getElementById('adult_first_name'+i).style['border-color'] = 'red';
           document.getElementById('adult_last_name'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('adult_first_name'+i).style['border-color'] = '#EFEFEF';
           document.getElementById('adult_last_name'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('adult_first_name'+i).value == ''){
           error_log+= 'Please input first name of adult passenger '+i+'!\n';
           document.getElementById('adult_first_name'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('adult_first_name'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('adult_last_name'+i).value == ''){
           error_log+= 'Please input last name of adult passenger '+i+'!\n';
           document.getElementById('adult_last_name'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('adult_last_name'+i).style['border-color'] = '#EFEFEF';
       }
       console.log(check_date(document.getElementById('adult_birth_date'+i).value));
       console.log(document.getElementById('adult_birth_date'+i).value);
       if(check_date(document.getElementById('adult_birth_date'+i).value)==false){
           error_log+= 'Birth date wrong for passenger adult '+i+'!\n';
           document.getElementById('adult_birth_date'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('adult_birth_date'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('adult_nationality'+i).value == ''){
           error_log+= 'Please fill nationality for passenger adult '+i+'!\n';
           document.getElementById('adult_nationality'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('adult_nationality'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('adult_passport_number'+i).value != '' ||
          document.getElementById('adult_passport_expired_date'+i).value != '' ||
          document.getElementById('adult_country_of_issued'+i).value != ''){
           if(document.getElementById('adult_passport_number'+i).value == ''){
               error_log+= 'Please fill passport number for passenger adult '+i+'!\n';
               document.getElementById('adult_passport_number'+i).style['border-color'] = 'red';
           }else{
               document.getElementById('adult_passport_number'+i).style['border-color'] = '#EFEFEF';
           }if(document.getElementById('adult_passport_expired_date'+i).value == ''){
               error_log+= 'Please fill passport expired date for passenger adult '+i+'!\n';
               document.getElementById('adult_passport_expired_date'+i).style['border-color'] = 'red';
           }else{
               document.getElementById('adult_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
           }if(document.getElementById('adult_country_of_issued'+i).value == ''){
               error_log+= 'Please fill country of issued for passenger adult '+i+'!\n';
               document.getElementById('adult_country_of_issued'+i).style['border-color'] = 'red';
           }else{
               document.getElementById('adult_country_of_issued'+i).style['border-color'] = '#EFEFEF';
           }
       }
   }
   //child
   for(i=1;i<=child;i++){
       if(check_name(document.getElementById('child_title'+i).value,
       document.getElementById('child_first_name'+i).value,
       document.getElementById('child_last_name'+i).value,
       length) == false){
           error_log+= 'Total of child '+i+' name maximum '+length+' characters!\n';
           document.getElementById('child_first_name'+i).style['border-color'] = 'red';
           document.getElementById('child_last_name'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('child_first_name'+i).style['border-color'] = '#EFEFEF';
           document.getElementById('child_last_name'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('child_first_name'+i).value == ''){
           error_log+= 'Please input first name of child passenger '+i+'!\n';
           document.getElementById('child_first_name'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('child_first_name'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('child_last_name'+i).value == ''){
           error_log+= 'Please input last name of child passenger '+i+'!\n';
           document.getElementById('child_last_name'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('child_last_name'+i).style['border-color'] = '#EFEFEF';
       }if(check_date(document.getElementById('child_birth_date'+i).value)==false){
           error_log+= 'Birth date wrong for passenger child '+i+'!\n';
           document.getElementById('child_birth_date'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('child_birth_date'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('child_nationality'+i).value == ''){
           error_log+= 'Please fill nationality for passenger child '+i+'!\n';
           document.getElementById('child_nationality'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('child_nationality'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('child_passport_number'+i).value != '' ||
          document.getElementById('child_passport_expired_date'+i).value != '' ||
          document.getElementById('child_country_of_issued'+i).value != ''){
           if(document.getElementById('child_passport_number'+i).value == ''){
               error_log+= 'Please fill passport number for passenger child '+i+'!\n';
               document.getElementById('child_passport_number'+i).style['border-color'] = 'red';
           }else{
               document.getElementById('child_passport_number'+i).style['border-color'] = '#EFEFEF';
           }if(document.getElementById('child_passport_expired_date'+i).value == ''){
               error_log+= 'Please fill passport expired date for passenger child '+i+'!\n';
               document.getElementById('child_passport_expired_date'+i).style['border-color'] = 'red';
           }else{
               document.getElementById('child_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
           }if(document.getElementById('child_country_of_issued'+i).value == ''){
               error_log+= 'Please fill country of issued for passenger child '+i+'!\n';
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
           error_log+= 'Total of infant '+i+' name maximum '+length+' characters!\n';
           document.getElementById('infant_first_name'+i).style['border-color'] = 'red';
           document.getElementById('infant_last_name'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('infant_first_name'+i).style['border-color'] = '#EFEFEF';
           document.getElementById('infant_last_name'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('infant_first_name'+i).value == ''){
           error_log+= 'Please input first name of infant passenger '+i+'!\n';
           document.getElementById('infant_first_name'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('infant_first_name'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('infant_last_name'+i).value == ''){
           error_log+= 'Please input last name of infant passenger '+i+'!\n';
           document.getElementById('infant_last_name'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('infant_last_name'+i).style['border-color'] = '#EFEFEF';
       }if(check_date(document.getElementById('infant_birth_date'+i).value)==false){
           error_log+= 'Birth date wrong for passenger infant '+i+'!\n';
           document.getElementById('infant_birth_date'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('infant_birth_date'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('infant_nationality'+i).value == ''){
           error_log+= 'Please fill nationality for passenger infant '+i+'!\n';
           document.getElementById('infant_nationality'+i).style['border-color'] = 'red';
       }else{
           document.getElementById('infant_nationality'+i).style['border-color'] = '#EFEFEF';
       }if(document.getElementById('infant_passport_number'+i).value != '' ||
          document.getElementById('infant_passport_expired_date'+i).value != '' ||
          document.getElementById('infant_country_of_issued'+i).value != ''){
           if(document.getElementById('infant_passport_number'+i).value == ''){
               error_log+= 'Please fill passport number for passenger infant '+i+'!\n';
               document.getElementById('infant_passport_number'+i).style['border-color'] = 'red';
           }else{
               document.getElementById('infant_passport_number'+i).style['border-color'] = '#EFEFEF';
           }if(document.getElementById('infant_passport_expired_date'+i).value == ''){
               error_log+= 'Please fill passport expired date for passenger infant '+i+'!\n';
               document.getElementById('infant_passport_expired_date'+i).style['border-color'] = 'red';
           }else{
               document.getElementById('infant_passport_expired_date'+i).style['border-color'] = '#EFEFEF';
           }if(document.getElementById('infant_country_of_issued'+i).value == ''){
               error_log+= 'Please fill country of issued for passenger infant '+i+'!\n';
               document.getElementById('infant_country_of_issued'+i).style['border-color'] = 'red';
           }else{
               document.getElementById('infant_country_of_issued'+i).style['border-color'] = '#EFEFEF';
           }
       }

   }
   if(error_log=='')
       document.getElementById('tour_review').submit();
   else
       alert(error_log);

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
    var room_amount = document.getElementById('room_amount').value;
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

function tour_hold_booking(val){
    var check_rooms = tour_check_rooms();
    var radios = document.getElementsByName('payment_opt');
    var pay_method = 'cash';

    for (var i = 0; i < radios.length; i++)
    {
        if (radios[i].checked)
        {
            pay_method = radios[i].value;
            break;
        }
    }

    if (check_rooms == true)
    {
        for (var i=0; i < total_pax_js; i++)
        {
            var temp_room_seq = document.getElementById("room_select_pax"+String(i+1)).value;
            pax_list_js[i].room_id = document.getElementById("room_id_"+String(temp_room_seq)).value;
            pax_list_js[i].room_seq = parseInt(temp_room_seq);
        }
        tour_update_passenger(val, pay_method, pax_list_js);
    }
    else
    {
        alert("Please assign a room to each passengers.");
    }
}

function check_before_calculate(){
    check = 0;
    if(check == 0)
        calculate('tour');
    else
        alert('Please re-check all the tour datas!');
}

function check_before_add_repricing(){
    check = 0;
    if(check == 0)
        add_table_of_equation();
    else
        alert('Please re-check all the tour datas!');
}

function tour_filter_render(){

    var node = document.createElement("div");
    text = '';
    text+= `<h4>Filter</h4>
            <hr/>
            <h6 style="padding-bottom:10px;">Tour Type</h6>`;
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
    node = document.createElement("div");
    node.innerHTML = text;
    document.getElementById("filter").appendChild(node);
    node = document.createElement("div");

    text=`
        <hr/>
        <h6 style="padding-bottom:10px;">Price (Rupiah)</h6>`;
    for(i in budget_list){
        if(i == 0)
            text+=`
            <label class="check_box_custom">
                <span class="span-search-ticket" style="color:black;">`+budget_list[i].value+`</span>
                <input type="checkbox" id="checkbox_budget`+i+`" onclick="change_filter('budget',`+i+`)" checked />
                <span class="check_box_span_custom"></span>
            </label><br/>`;
        else
            text+=`
            <label class="check_box_custom">
                <span class="span-search-ticket" style="color:black;">`+budget_list[i].value+`</span>
                <input type="checkbox" id="checkbox_budget`+i+`" onclick="change_filter('budget',`+i+`)"/>
                <span class="check_box_span_custom"></span>
            </label><br/>`;
    }

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
    text+= `<h4>Filter</h4>
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
    node2 = document.createElement("div");
    node2.innerHTML = text;
    document.getElementById("filter2").appendChild(node2);
    node2 = document.createElement("div");

    text=`
        <hr/>
        <h6 style="padding-bottom:10px;">Price</h6>`;
    for(i in budget_list){
        if(i == 0)
            text+=`
            <label class="check_box_custom">
                <span class="span-search-ticket" style="color:black;">`+budget_list[i].value+`</span>
                <input type="checkbox" id="checkbox_budget2`+i+`" onclick="change_filter('budget',`+i+`)" checked />
                <span class="check_box_span_custom"></span>
            </label><br/>`;
        else
            text+=`
            <label class="check_box_custom">
                <span class="span-search-ticket" style="color:black;">`+budget_list[i].value+`</span>
                <input type="checkbox" id="checkbox_budget2`+i+`" onclick="change_filter('budget',`+i+`)"/>
                <span class="check_box_span_custom"></span>
            </label><br/>`;
    }

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

   }else if(value == 'departure'){
       if(sorting_value == '' || sorting_value == 'Earliest Departure'){
           sorting_value = 'Latest Departure';
           document.getElementById("img-sort-down-departure").style.display = "none";
           document.getElementById("img-sort-up-departure").style.display = "block";
       }else{
           sorting_value = 'Earliest Departure';
           document.getElementById("img-sort-down-departure").style.display = "block";
           document.getElementById("img-sort-up-departure").style.display = "none";
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
   filtering('filter');
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
    }else if(type == 'budget'){
        if(value == 0)
            for(i in budget_list){
                budget_list[i].status = false
                document.getElementById("checkbox_budget"+i).checked = budget_list[i].status;
                document.getElementById("checkbox_budget2"+i).checked = budget_list[i].status;
            }
        else{
            budget_list[0].status = false;
            document.getElementById("checkbox_budget0").checked = false;
            document.getElementById("checkbox_budget20").checked = false;
        }
        budget_list[value].status = !budget_list[value].status;
        for(i in budget_list){
            if(budget_list[i].status == true)
                check = 1;
        }
        if(check == 0)
            budget_list[value].status = !budget_list[value].status;
        document.getElementById("checkbox_budget"+value).checked = budget_list[value].status;
        document.getElementById("checkbox_budget2"+value).checked = budget_list[value].status;
    }
    filtering('filter');
}

function filtering(type){
   var temp_data = [];
   data = tour_data;
   if(type == 'filter'){
       check_tour_type = 0;
       check_budget = 0;
       for(i in tour_type_list)
           if(tour_type_list[i].status == true && tour_type_list[i].value != 'All')
               check_tour_type = 1;

       for(i in budget_list)
           if(budget_list[i].status == true && budget_list[i].value != 'All')
               check_budget = 1;

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

       if(check_budget == 1){
           data.forEach((obj)=> {
               check = 0;
               budget_list.forEach((obj1)=> {
                   if(obj1.status == true && check == 0){
                       if (obj.adult_sale_price >= obj1.min && obj.adult_sale_price <= obj1.max)
                       {
                            temp_data.push(obj);
                            check = 1;
                       }
                   }
               });
           });
           data = temp_data;
           temp_data = [];
       }
       console.log(data);
       sort(data);

   }else if(type == 'sort'){
       sort(tour_data);
   }
}

function sort(tour_dat){
    console.log(tour_dat);
    if (tour_dat.length == 0){
        document.getElementById("tour_ticket").innerHTML = '';
        text = '';
        text += `
            <div class="col-lg-4">
            </div>
            <div class="col-lg-4">
                <div style="padding:5px; margin:10px;">
                    <div style="text-align:center">
                        <img src="/static/tt_website_skytors/img/icon/no-flight.jpeg" style="width:80px; height:80px;" alt="" title="" />
                        <br/><br/>
                        <h6>NO TOUR AVAILABLE</h6>
                    </div>
                </div>
            </div>
            <div class="col-lg-4">
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
                }else if(sorting == 'Earliest Departure'){
                    var dept_datei = '';
                    var dept_datej = '';
                    if(tour_dat[i].tour_category == 'private')
                    {
                        dept_datei = Date.parse(tour_dat[i].start_period_ori);
                    }
                    else
                    {
                        dept_datei = Date.parse(tour_dat[i].departure_date_ori);
                    }

                    if(tour_dat[j].tour_category == 'private')
                    {
                        dept_datej = Date.parse(tour_dat[j].start_period_ori);
                    }
                    else
                    {
                        dept_datej = Date.parse(tour_dat[j].departure_date_ori);
                    }
                    if(dept_datei > dept_datej){
                        var temp = tour_dat[i];
                        tour_dat[i] = tour_dat[j];
                        tour_dat[j] = temp;
                    }
                }else if(sorting == 'Latest Departure'){
                    var dept_datei = '';
                    var dept_datej = '';
                    if(tour_dat[i].tour_category == 'private')
                    {
                        dept_datei = Date.parse(tour_dat[i].start_period_ori);
                    }
                    else
                    {
                        dept_datei = Date.parse(tour_dat[i].departure_date_ori);
                    }

                    if(tour_dat[j].tour_category == 'private')
                    {
                        dept_datej = Date.parse(tour_dat[j].start_period_ori);
                    }
                    else
                    {
                        dept_datej = Date.parse(tour_dat[j].departure_date_ori);
                    }
                    if(dept_datei < dept_datej){
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
           if (tour_dat[i].images_obj.length > 0)
           {
               img_src = tour_dat[i].images_obj[0].url;
           }
           else
           {
               img_src = `https://static.rodextrip.com/public/tour_packages/not_found.png`;
           }

           if (tour_dat[i].state_tour == 'sold')
           {
               dat_content1 = `Date: `+tour_dat[i].departure_date+` - `+tour_dat[i].return_date;
               dat_content2 = `Sold Out`
           }
           else
           {
               dat_content1 = `Date: `+tour_dat[i].departure_date+` - `+tour_dat[i].return_date;
               dat_content2 = `Availability: `+tour_dat[i].seat+`/`+tour_dat[i].quota;
           }

           text+=`

           <div class="col-lg-4 col-md-6">
                <form action='/tour/detail' method='POST' id='myForm`+tour_dat[i].sequence+`'>
                <div id='csrf`+tour_dat[i].sequence+`'></div>
                <input type='hidden' value='`+JSON.stringify(tour_dat[i]).replace(/[']/g, /["]/g)+`'/>
                <input id='uuid' name='uuid' type='hidden' value='`+tour_dat[i].id+`'/>
                <input id='sequence' name='sequence' type='hidden' value='`+tour_dat[i].sequence+`'/>
                <div class="single-recent-blog-post item" style="cursor:pointer;" onclick="go_to_detail('`+tour_dat[i].sequence+`')">
                    <div class="single-destination relative">
                        <div class="thumb relative">
                            <div class="overlay overlay-bg"></div>
                            <img class="img-fluid" src="`+img_src+`" alt="">
                        </div>
                        <div class="card card-effect-promotion">
                            <div class="card-body">
                                <div class="row details">
                                    <div class="col-lg-12" style="text-align:left;">
                                        <h6 style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="`+tour_dat[i].name+`">`+tour_dat[i].name+`</h6>
                                        <span style="font-size:12px;">`+dat_content1+`</span><br/>
                                        <span style="font-size:12px;">`+dat_content2+`</span><br/><br/>
                                    </div>
                                    <div class="col-lg-12" style="text-align:right;">
                                        <span style="font-size:12px;font-weight:bold;">IDR `+tour_dat[i].adult_sale_price_with_comma+`  </span>
                                        <a href="#" class="btn btn-primary" onclick="go_to_detail('`+tour_dat[i].sequence+`')">BOOK</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            </div>
           `;
        }
        document.getElementById('tour_ticket').innerHTML += text;
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

$(document).ready(function () {
    $('#btnDeleteRooms').click(function(){
        var index = document.getElementById('room_amount').value;
        var temp = '#room_field_' + String(index);
        var data_room = '#data_per_room_hidden_' + String(index);
        var total_additional_amount = parseInt(document.getElementById("additional_charge_amount").value);
        var total_additional_price = parseInt(document.getElementById("additional_charge_total").getAttribute("data-price"))
        var package_id = parseInt(document.getElementById("tour_id").value);
        data_room = $(data_room).val();
        var data_list = data_room.split('~');
        var additional_charge = parseInt(data_list[0]);
        if (additional_charge > 0) {
            total_additional_price -= additional_charge;
            total_additional_amount -= 1;
            document.getElementById("additional_charge_amount").value = total_additional_amount;
            document.getElementById("additional_charge_total").setAttribute("data-price", total_additional_price);
            document.getElementById("additional_charge_total").value = getrupiah(total_additional_price);
        }
        $(temp).remove();
        index--;
        document.getElementById('room_amount').value = index;
        get_price_itinerary(package_id);
    });
});
