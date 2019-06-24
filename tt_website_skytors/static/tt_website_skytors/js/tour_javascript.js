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
    var room_lib = {
        'double': 'Double/Twin',
        'triple': 'Triple'
    }
    var template = '';
        template += '<div id="room_field_' + idx + '" style="margin-bottom:20px; padding:20px; border: 1px solid #f15a22;">';
        template += '<strong style="margin: 0px; font-weight: bold;" title="'+ data_list[8] + ' (' + data_list[12] + ') - ' + data_list[1] + '">Room ' +  idx +  ' - ' + data_list[9] + ' ' + room_lib[data_list[4]] + '</strong>';
        template += '<br/><span style="margin: 0px;">' + data_list[7] +'</span>';
        template += '<br/><span style="margin: 0px;"><i class="fa fa-building"></i> ' + data_list[8] + ' (' + data_list[12] + ') - ' + data_list[1] +'</span>';
        template += '<div class="row">';
        template += '<div class="col-sm-4" style="margin:8px 0px;">';
        template += '<label>Adult</label>';
        template += '<select class="form-control adult-icon adult_tour_room" id="adult_tour_room_' + idx + '" name="adult_tour_room_' + idx + '" data-index="' + idx + '" data-pax-limit="' + data_list[10] + '" onchange="render_child_infant_selection(this)">';
        for (var i=1; i<=parseInt(data_list[2]); i++)
        {
            if (i == 1) {template += '<option selected value="' + i + '">' + i + '</option>';}
            else {template += '<option value="' + i + '">' + i + '</option>';}
        }
        template += '</select>';
        template += '</div>';
        template += '<div class="col-sm-4" style="margin:8px 0px;">';
        template +=  '<label>Child</label><i class="fa fa-info-circle" aria-hidden="true" data-toggle="tooltip" data-placement="top" title="2-11 years old" style="padding-left:5px;"></i>';
        template += '<select class="form-control child-icon child_tour_room" id="child_tour_room_' + idx + '" name="child_tour_room_' + idx + '" data-index="' + idx + '" onchange="get_price_itinerary()">';
        for (var i=0; i<=parseInt(data_list[10])-1; i++)
        {
            if (i == 0) {template += '<option selected value="' + i + '">' + i + '</option>';}
            else {template += '<option value="' + i + '">' + i + '</option>';}
        }
        template += '</select>';
        template += '</div>';
        template += '<div class="col-sm-4" style="margin:8px 0px;">';
        template +=  '<label>Infant</label><i class="fa fa-info-circle" aria-hidden="true" data-toggle="tooltip" data-placement="top" title="below 2 years old" style="padding-left:5px;"></i>';
        template += '<select class="form-control infant-icon infant_tour_room" id="infant_tour_room_' + idx + '" name="infant_tour_room_' + idx + '" data-index="' + idx + '" onchange="get_price_itinerary()">';
        template += '<option selected value="0">0</option>';
        template += '<option value="1">1</option>';
        template += '</select>';
        template += '</div>';

        if (data_list[4]=="double")
        {
            template += '<div class="col-sm-12 col-extrabed">';
            template += '<input type="text" class="form-control" id="notes_' + idx + '" name="notes_' + idx + '" placeholder="Notes"/>';
            template += '<small style="color: #787878; margin-left: 2px;">Ex: king size, twin, non smoking, etc.</small>';
            template += '</div>';
        }
        else
        {
            template += '<input type="text" class="form-control hide" id="notes_' + idx + '" name="notes_' + idx + '" placeholder="Notes" value=" "/>';
        }
        template += '</div>';
        template += '<input type="hidden" id="data_per_room_hidden_' + idx + '" name="data_per_room_hidden_' + idx + '" value="' + data_hidden + '"/>';
        template += '</div>';
    return template;
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
    get_price_itinerary();
}

function get_price_itinerary() {
    document.getElementById("single_supplement_amount").value = 0;
    document.getElementById("single_supplement_price").value = 0;
    document.getElementById("airport_tax_amount").value = 0;
    document.getElementById("airport_tax_total").value = 0;
    document.getElementById("tipping_guide_amount").value = 0;
    document.getElementById("tipping_guide_total").value = 0;
    document.getElementById("tipping_tour_leader_amount").value = 0;
    document.getElementById("tipping_tour_leader_total").value = 0;

    var airport_tax = document.getElementById("airport_tax").value;
    var tipping_guide = document.getElementById("tipping_guide").value;
    var tipping_tour_leader = document.getElementById("tipping_tour_leader").value;
    var guiding_days = document.getElementById("guiding_days").value;
    var duration = document.getElementById("duration").value;

    var single_supplement_amount = 0;
    var single_supplement_price = 0;
    var grand_total_pax = 0;
    var grand_total_pax_no_infant = 0;
    var adult_total_pax = 0;
    var child_total_pax = 0;
    var infant_total_pax = 0;

    document.getElementById("adult_amount").value = 0;
    document.getElementById("adult_price").value = 0;
    document.getElementById("adult_commission").value = 0;
    var adult_sale_price = parseInt(document.getElementById("adult_sale_price_hidden").value);
    var adult_commission = parseInt(document.getElementById("adult_commission_hidden").value);
    var adult_amount = 0;

    document.getElementById("adult_surcharge_amount").value = 0;
    document.getElementById("adult_surcharge_price").value = 0;
    var adult_surcharge_total = 0;
    var adult_surcharge_amount = 0;

    document.getElementById("child_amount").value = 0;
    document.getElementById("child_price").value = 0;
    document.getElementById("child_commission").value = 0;
    var child_sale_price = parseInt(document.getElementById("child_sale_price_hidden").value);
    var child_commission = parseInt(document.getElementById("child_commission_hidden").value);
    var child_amount = 0;

    document.getElementById("child_surcharge_amount").value = 0;
    document.getElementById("child_surcharge_price").value = 0;
    var child_surcharge_total = 0;
    var child_surcharge_amount = 0;

    document.getElementById("infant_amount").value = 0;
    document.getElementById("infant_price").value = 0;
    document.getElementById("infant_commission").value = 0;
    var infant_sale_price = parseInt(document.getElementById("infant_sale_price_hidden").value);
    var infant_commission = parseInt(document.getElementById("infant_commission_hidden").value);
    var infant_amount = 0;

    var room_amount = document.getElementById("room_amount");

    if (room_amount.value <= 0)
    {
        $('#btnDeleteRooms').addClass("hide");
        $('#total-price-container').addClass("hide");
    }
    else {
        $('#btnDeleteRooms').removeClass("hide");
        $('#total-price-container').removeClass("hide");
    }

    for (var i=0; i<room_amount.value; i++)
    {
        var temp = 'data_per_room_hidden_'+String(i+1);
        var data_per_room_hidden = document.getElementById(temp).value;
        var data_per_room_list = data_per_room_hidden.split("~");
        var pax_minimum = parseInt(data_per_room_list[11]);
        var extra_bed_limit = parseInt(data_per_room_list[15]);
        var single_supplement = parseInt(data_per_room_list[13]);
        var adult_surcharge_price = parseInt(data_per_room_list[3]);
        var child_surcharge_price = parseInt(data_per_room_list[5]);

        temp = 'adult_tour_room_'+String(i+1);
        var adult_amount_per_room = parseInt(document.getElementById(temp).value);
        temp = 'child_tour_room_'+String(i+1);
        var child_amount_per_room = parseInt(document.getElementById(temp).value);
        temp = 'infant_tour_room_'+String(i+1);
        var infant_amount_per_room = parseInt(document.getElementById(temp).value);

        var total_amount = adult_amount_per_room + child_amount_per_room + infant_amount_per_room;
        var total_amount_no_infant = adult_amount_per_room + child_amount_per_room;

        grand_total_pax += total_amount;
        grand_total_pax_no_infant += total_amount_no_infant;
        adult_total_pax += adult_amount_per_room;
        child_total_pax += child_amount_per_room;
        infant_total_pax += infant_amount_per_room;

        if (total_amount_no_infant < pax_minimum) {
            var single_sup = pax_minimum - total_amount_no_infant;
            single_supplement_amount += single_sup;
            single_supplement_price += single_sup * single_supplement;
            adult_amount += total_amount_no_infant
            infant_amount += infant_amount_per_room
        }
        else {
            if (adult_amount_per_room >= pax_minimum) {
                adult_amount += adult_amount_per_room;
                if (adult_amount_per_room - pax_minimum <= extra_bed_limit) {
                    adult_surcharge_amount += adult_amount_per_room - pax_minimum;
                    adult_surcharge_total += (adult_amount_per_room - pax_minimum) * adult_surcharge_price;
                    extra_bed_limit -= adult_amount_per_room - pax_minimum;
                    if (child_amount_per_room <= extra_bed_limit) {
                        child_amount += child_amount_per_room;
                        child_surcharge_amount += child_amount_per_room;
                        child_surcharge_total += child_amount_per_room * child_surcharge_price;
                    }
                    else {
                        child_amount += child_amount_per_room;
                        child_surcharge_amount += child_amount_per_room - extra_bed_limit;
                        child_surcharge_total += (child_amount_per_room - extra_bed_limit) * child_surcharge_price;
                    }
                } else {
                    adult_surcharge_amount += adult_amount_per_room - pax_minimum - extra_bed_limit;
                    adult_surcharge_total += (adult_amount_per_room - pax_minimum - extra_bed_limit) * adult_surcharge_price;
                    child_amount += child_amount_per_room;
                }
//                child_amount += child_amount_per_room;
//                child_surcharge_amount += child_amount_per_room;
//                child_surcharge_total += child_amount_per_room * child_surcharge_price;
                infant_amount += infant_amount_per_room;
            }
            else {
                adult_amount += pax_minimum;
                if (child_amount_per_room > 0) {
                    if (Math.max(child_amount_per_room - (pax_minimum - adult_amount_per_room), 0) != 0) {
                        if ((child_amount_per_room - (pax_minimum - adult_amount_per_room)) > extra_bed_limit) {
                            child_amount += child_amount_per_room - (pax_minimum - adult_amount_per_room);
                            child_surcharge_amount += child_amount_per_room - (pax_minimum - adult_amount_per_room) - extra_bed_limit;
                            child_surcharge_total += (child_amount_per_room - (pax_minimum - adult_amount_per_room) - extra_bed_limit) * child_surcharge_price;
                        } else {
                            child_amount += child_amount_per_room - (pax_minimum - adult_amount_per_room);
                            child_surcharge_amount += child_amount_per_room - (pax_minimum - adult_amount_per_room);
                            child_surcharge_total += (child_amount_per_room - (pax_minimum - adult_amount_per_room)) * child_surcharge_price;
                        }
                    }
                }
                if (infant_amount_per_room > 0) {
                    if (adult_amount_per_room + child_amount_per_room < pax_minimum) {
                        infant_amount += Math.max(infant_amount_per_room - (pax_minimum - adult_amount_per_room - child_amount_per_room), 0);
                    }
                    else {
                        infant_amount += infant_amount_per_room;
                    }
                }
            }
        }
    }

    document.getElementById('adult_total_pax').value = adult_total_pax;
    document.getElementById('child_total_pax').value = child_total_pax;

    var discount_total = 0;
    var tour_type = document.getElementById("tour_type").value;
    if (tour_type == 'private' || tour_type== 'sic')
    {
        var discount = JSON.parse(document.getElementById("discount").value);
        for (var i=0; i < discount.length; i++) {
            var min_pax = discount[i]['min_pax'];
            var max_pax = discount[i]['max_pax'];
            var discount_per_pax = discount[i]['discount_per_pax'];
            if ((grand_total_pax_no_infant >= min_pax) && (grand_total_pax_no_infant <= max_pax)) {
                adult_sale_price = parseInt(document.getElementById("adult_sale_price_hidden").value) - discount_per_pax;
                child_sale_price = parseInt(document.getElementById("child_sale_price_hidden").value) - discount_per_pax;
                adult_commission *= 0.5;
                child_commission *= 0.5;
                infant_commission *= 0.5;
                discount_total = discount[i]['discount_total'];
                break;
            }
        }
    }

    document.getElementById("single_supplement_amount").value = single_supplement_amount;
    document.getElementById("single_supplement_price").setAttribute("data-price", single_supplement_price);
    document.getElementById("single_supplement_price").value = getrupiah(single_supplement_price);

    document.getElementById("adult_amount").value = adult_amount;
    document.getElementById("adult_price").setAttribute("data-price", adult_amount * adult_sale_price);
    document.getElementById("adult_price").value = getrupiah(adult_amount * adult_sale_price);
    document.getElementById("adult_commission").setAttribute("data-price", adult_amount * adult_commission);
    document.getElementById("adult_commission").value = getrupiah(adult_amount * adult_commission);
    document.getElementById("adult_surcharge_amount").value = adult_surcharge_amount;
    document.getElementById("adult_surcharge_price").setAttribute("data-price", adult_surcharge_total);
    document.getElementById("adult_surcharge_price").value = getrupiah(adult_surcharge_total);

    document.getElementById("child_amount").value = child_amount;
    document.getElementById("child_price").setAttribute("data-price", child_amount * child_sale_price);
    document.getElementById("child_price").value = getrupiah(child_amount * child_sale_price);
    document.getElementById("child_commission").setAttribute("data-price", child_amount * child_commission);
    document.getElementById("child_commission").value = getrupiah(child_amount * child_commission);
    document.getElementById("child_surcharge_amount").value = child_surcharge_amount;
    document.getElementById("child_surcharge_price").setAttribute("data-price", child_surcharge_total);
    document.getElementById("child_surcharge_price").value = getrupiah(child_surcharge_total);

    document.getElementById("infant_amount").value = infant_amount;
    document.getElementById("infant_price").setAttribute("data-price", infant_amount * infant_sale_price);
    document.getElementById("infant_price").value = getrupiah(infant_amount * infant_sale_price);
    document.getElementById("infant_commission").setAttribute("data-price", infant_amount * infant_commission);
    document.getElementById("infant_commission").value = getrupiah(infant_amount * infant_commission);

    var airport_tax = grand_total_pax * airport_tax;
    document.getElementById("airport_tax_amount").value = grand_total_pax;
    document.getElementById("airport_tax_total").setAttribute("data-price", airport_tax);
    document.getElementById("airport_tax_total").value = getrupiah(airport_tax);

    var tipping_guide_total = (adult_total_pax + child_total_pax) * tipping_guide * guiding_days;
    var tipping_tour_leader_total = (adult_total_pax + child_total_pax) * tipping_tour_leader * duration;

    document.getElementById("tipping_guide_amount").value = adult_total_pax + child_total_pax;
    document.getElementById("tipping_guide_total").setAttribute("data-price", tipping_guide_total);
    document.getElementById("tipping_guide_total").value = getrupiah(tipping_guide_total);

    document.getElementById("tipping_tour_leader_amount").value = adult_total_pax + child_total_pax;
    document.getElementById("tipping_tour_leader_total").setAttribute("data-price", tipping_tour_leader_total);
    document.getElementById("tipping_tour_leader_total").value = getrupiah(tipping_tour_leader_total);
    get_total_price(discount_total);
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

function check_passenger(room_amount){
    //booker
    error_log = '';
    if(document.getElementById('booker_title').value!= '' &&
       document.getElementById('booker_first_name').value!= '' &&
       document.getElementById('booker_last_name').value!='' &&
       document.getElementById('booker_nationality').value!='' &&
       document.getElementById('booker_email').value!='' &&
       document.getElementById('booker_phone_code').value!='' &&
       document.getElementById('booker_phone').value!= ''){

        if(check_name(document.getElementById('booker_title').value,
                        document.getElementById('booker_first_name').value,
                        document.getElementById('booker_last_name').value,
                        25) == false)
            error_log+= 'Total of Booker name maximum 25 characters!\n';
        if(check_phone_number(document.getElementById('booker_phone').value)==false)
            error_log+= 'Phone number Booker only contain number 8 - 12 digits!\n';
        if(check_email(document.getElementById('booker_email').value)==false)
            error_log+= 'Invalid Booker email!\n';

       length = 41;

       for (j=1;j<=room_amount;j++)
       {
           adult = parseInt(document.getElementById('adult_amount_room_'+j).value);
           child = parseInt(document.getElementById('child_amount_room_'+j).value);
           infant = parseInt(document.getElementById('infant_amount_room_'+j).value);
           //adult
           for(i=1;i<=adult;i++){
               if(document.getElementById('room'+j+'_adult_title'+i).value != '' &&
               document.getElementById('room'+j+'_adult_first_name'+i).value != '' &&
               document.getElementById('room'+j+'_adult_last_name'+i).value != '' &&
               document.getElementById('room'+j+'_adult_nationality'+i).value != ''){
                   if(check_name(document.getElementById('room'+j+'_adult_title'+i).value,
                   document.getElementById('room'+j+'_adult_first_name'+i).value,
                   document.getElementById('room'+j+'_adult_last_name'+i).value,
                   length) == false)
                       error_log+= 'Total of room '+j+' adult '+i+' name maximum '+length+' characters!\n';
                   if(check_date(document.getElementById('room'+j+'_adult_birth_date'+i).value)==false)
                       error_log+= 'Birth date wrong for passenger room '+j+' adult '+i+'!\n';
                   if(document.getElementById('room'+j+'_adult_nationality'+i).value == '')
                       error_log+= 'Please fill nationality for passenger room '+j+' adult '+i+'!\n';
                   if(document.getElementById('room'+j+'_adult_passport_number'+i).value != '' ||
                      document.getElementById('room'+j+'_adult_passport_expired_date'+i).value != '' ||
                      document.getElementById('room'+j+'_adult_country_of_issued'+i).value != ''){
                       if(document.getElementById('room'+j+'_adult_passport_number'+i).value == '')
                           error_log+= 'Please fill passport number for passenger room '+j+' adult '+i+'!\n';
                       if(document.getElementById('room'+j+'_adult_passport_expired_date'+i).value == '')
                           error_log+= 'Please fill passport expired date for passenger room '+j+' adult '+i+'!\n';
                       if(document.getElementById('room'+j+'_adult_country_of_issued'+i).value == '')
                           error_log+= 'Please fill country of issued for passenger room '+j+' adult '+i+'!\n';
                   }

               }else{
                   error_log+= 'Please fill all the blank for room '+j+' adult passenger '+i+'!\n';
               }
           }

           //child
           for(i=1;i<=child;i++){
               if(document.getElementById('room'+j+'_child_title'+i).value != '' &&
               document.getElementById('room'+j+'_child_first_name'+i).value != '' &&
               document.getElementById('room'+j+'_child_last_name'+i).value != '' &&
               document.getElementById('room'+j+'_child_nationality'+i).value != ''){
                   if(check_name(document.getElementById('room'+j+'_child_title'+i).value,
                   document.getElementById('room'+j+'_child_first_name'+i).value,
                   document.getElementById('room'+j+'_child_last_name'+i).value,
                   length) == false)
                       error_log+= 'Total of room '+j+' child '+i+' name maximum '+length+' characters!\n';
                   if(check_date(document.getElementById('room'+j+'_child_birth_date'+i).value)==false)
                       error_log+= 'Birth date wrong for passenger room '+j+' child '+i+'!\n';
                   if(document.getElementById('room'+j+'_child_nationality'+i).value == '')
                       error_log+= 'Please fill nationality for passenger room '+j+' child '+i+'!\n';
                   if(document.getElementById('room'+j+'_child_passport_number'+i).value != '' ||
                      document.getElementById('room'+j+'_child_passport_expired_date'+i).value != '' ||
                      document.getElementById('room'+j+'_child_country_of_issued'+i).value != '' || is_lion_air == true){
                       if(document.getElementById('room'+j+'_child_passport_number'+i).value == '')
                           error_log+= 'Please fill passport number for passenger room '+j+' child '+i+'!\n';
                       if(document.getElementById('room'+j+'_child_passport_expired_date'+i).value == '')
                           error_log+= 'Please fill passport expired date for passenger room '+j+' child '+i+'!\n';
                       if(document.getElementById('room'+j+'_child_country_of_issued'+i).value == '')
                           error_log+= 'Please fill country of issued for passenger room '+j+' child '+i+'!\n';
                   }

               }else{
                   error_log+= 'Please fill all the blank for room '+j+' child passenger '+i+'!\n';
               }
           }

           //infant
           for(i=1;i<=infant;i++){
               if(document.getElementById('room'+j+'_infant_title'+i).value != '' &&
               document.getElementById('room'+j+'_infant_first_name'+i).value != '' &&
               document.getElementById('room'+j+'_infant_last_name'+i).value != '' &&
               document.getElementById('room'+j+'_infant_nationality'+i).value != ''){
                   if(check_name(document.getElementById('room'+j+'_infant_title'+i).value,
                   document.getElementById('room'+j+'_infant_first_name'+i).value,
                   document.getElementById('room'+j+'_infant_last_name'+i).value,
                   length) == false)
                       error_log+= 'Total of room '+j+' infant '+i+' name maximum '+length+' characters!\n';
                   if(check_date(document.getElementById('room'+j+'_infant_birth_date'+i).value)==false)
                       error_log+= 'Birth date wrong for passenger room '+j+' infant '+i+'!\n';
                   if(document.getElementById('room'+j+'_infant_nationality'+i).value == '')
                       error_log+= 'Please fill nationality for passenger room '+j+' infant '+i+'!\n';
                   if(document.getElementById('room'+j+'_infant_passport_number'+i).value != '' ||
                      document.getElementById('room'+j+'_infant_passport_expired_date'+i).value != '' ||
                      document.getElementById('room'+j+'_infant_country_of_issued'+i).value != '' || is_lion_air == true){
                       if(document.getElementById('room'+j+'_infant_passport_number'+i).value == '')
                           error_log+= 'Please fill passport number for passenger room '+j+' infant '+i+'!\n';
                       if(document.getElementById('room'+j+'_infant_passport_expired_date'+i).value == '')
                           error_log+= 'Please fill passport expired date for passenger room '+j+' infant '+i+'!\n';
                       if(document.getElementById('room'+j+'_infant_country_of_issued'+i).value == '')
                           error_log+= 'Please fill country of issued for passenger room '+j+' infant '+i+'!\n';
                   }

               }else{
                   error_log+= 'Please fill all the blank for room '+j+' infant passenger '+i+'!\n';
               }
           }
       }
       if(error_log=='')
           document.getElementById('tour_review').submit();
       else
           alert(error_log);
     }else{
        alert('Please Fill all the blank !');
     }
}

$(document).ready(function () {
    $('#btnDeleteRooms').click(function(){
        var index = document.getElementById('room_amount').value;
        var temp = '#room_field_' + String(index);
        var data_room = '#data_per_room_hidden_' + String(index);
        var total_additional_amount = parseInt(document.getElementById("additional_charge_amount").value);
        var total_additional_price = parseInt(document.getElementById("additional_charge_total").getAttribute("data-price"))
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
        get_price_itinerary();
    });
});
