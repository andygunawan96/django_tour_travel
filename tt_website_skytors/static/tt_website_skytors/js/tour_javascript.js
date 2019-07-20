$test = '';

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
